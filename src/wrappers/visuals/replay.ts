import hasMediaToUnload from "../../media/video/hasMediaToUnload";
import type { VideomailPreviewParams } from "../../types/events/params";
import type { VideomailClientOptions } from "../../types/options";
import type { Videomail } from "../../types/Videomail";
import { VideoType } from "../../types/VideoType";
import getBrowser from "../../util/browser/getBrowser";
import type { DespotEmitter } from "../../util/Despot";
import Despot from "../../util/Despot";
import createError from "../../util/error/createError";
import isDOMExceptionNamed from "../../util/error/isDOMExceptionNamed";
import calculateHeight from "../../util/html/dimensions/calculateHeight";
import calculateWidth from "../../util/html/dimensions/calculateWidth";
import canCalculateMissingDimension from "../../util/html/dimensions/canCalculateMissingDimension";
import hideElement from "../../util/html/hideElement";
import isHidden from "../../util/html/isHidden";
import showElement from "../../util/html/showElement";
import { isAudioEnabled } from "../../util/options/audio";
import hasFixedVideoFrame from "../../util/options/hasFixedVideoFrame";
import pretty from "../../util/string/pretty";
import type { UnloadParams } from "../container";
import type Visuals from "../visuals";

class Replay extends Despot {
  private readonly visuals: Visuals;

  private built = false;
  private replayElement?: HTMLVideoElement | undefined | null;
  private videomail?: Videomail | undefined;
  private canPlayThroughHandler?: (() => void) | undefined;

  private readonly togglePlayback = (e: Event) => {
    e.preventDefault();

    if (this.replayElement?.paused) {
      this.replayElement.play().catch((exc: unknown) => {
        // Leaving the replay can abort a play request before it settles.
        if (isDOMExceptionNamed(exc, "AbortError") && !this.isShown()) {
          return;
        }

        const err = createError({
          message: `Failed to play replay video upon ${e.type} event.`,
          exc,
          options: this.options,
        });

        this.emit("ERROR", { err });
      });
    } else {
      this.replayElement?.pause();
    }
  };

  constructor(
    visuals: Visuals,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("Replay", options, emitter);

    this.visuals = visuals;
  }

  private buildElement(replayParentElement: HTMLElement) {
    const videoSelector = `video.${this.options.selectors.replayClass}`;

    this.replayElement =
      replayParentElement.querySelector<HTMLVideoElement>(videoSelector);

    // If none exists, create one then
    if (!this.replayElement) {
      this.replayElement = document.createElement("video");
      this.replayElement.classList.add(this.options.selectors.replayClass);
      replayParentElement.appendChild(this.replayElement);
    }
  }

  private copyAttributes(newVideomail: Videomail) {
    let attributeContainer;

    Object.keys(newVideomail).forEach((attribute: string) => {
      attributeContainer = this.replayElement?.parentNode?.querySelector(`.${attribute}`);

      if (attributeContainer) {
        const empty =
          !attributeContainer.innerHTML || attributeContainer.innerHTML.length < 1;

        // Keep content the host app already supplied, such as links in the body.
        if (empty) {
          attributeContainer.textContent = String(newVideomail[attribute]);
        }
      }
    });
  }

  private correctDimensions(
    responsive: boolean,
    videoWidth: number,
    videoHeight: number,
  ) {
    if (!this.replayElement) {
      throw new Error("There is no replay element to correct dimensions for.");
    }

    let heightValue: number | undefined;
    let widthValue: number | undefined;

    let ratio: number | undefined;

    if (this.videomail) {
      widthValue = this.videomail.width;
      heightValue = this.videomail.height;

      if (widthValue && heightValue) {
        ratio = heightValue / widthValue;
      }
    }

    if (
      canCalculateMissingDimension(widthValue, videoHeight, this.options.video.height)
    ) {
      const newWidthDimensions = calculateWidth(
        responsive,
        this.options,
        videoHeight,
        ratio,
      );

      const newWidth = newWidthDimensions.value;

      widthValue = newWidth;
    }

    if (canCalculateMissingDimension(heightValue, videoWidth, this.options.video.width)) {
      let element = this.visuals.getElement();

      if (!element) {
        element = document.body;
      }

      const newDimensions = calculateHeight(
        responsive,
        videoWidth,
        this.options,
        ratio,
        element,
      );

      heightValue = newDimensions.value;
    }

    if (widthValue) {
      this.replayElement.style.width = `${widthValue}px`;
    } else {
      this.replayElement.style.width = "auto";
    }

    if (heightValue) {
      this.replayElement.style.height = `${heightValue}px`;
    } else {
      this.replayElement.style.height = "auto";
    }
  }

  public setVideomail(newVideomail: Videomail, playerOnly = false) {
    this.videomail = newVideomail;

    this.replayElement?.setAttribute("controls", "controls");

    if (this.videomail.mp4) {
      this.setMp4Source(this.videomail.mp4);
    }

    if (this.videomail.webm) {
      this.setWebMSource(this.videomail.webm);
    }

    if (this.videomail.vtt) {
      this.setTrackSource(this.videomail.vtt);
    }

    if (this.videomail.poster) {
      this.replayElement?.setAttribute("poster", this.videomail.poster);
    }

    this.copyAttributes(this.videomail);

    const sampleRate = this.videomail.recordingStats?.sampleRate;

    const width = this.videomail.width;
    const height = this.videomail.height;
    const hasAudio = sampleRate !== undefined ? sampleRate > 0 : false;

    this.show(width, height, hasAudio, playerOnly);
  }

  public show(
    videomailWidth: number | undefined,
    videomailHeight: number | undefined,
    hasAudio?: boolean,
    playerOnly = false,
  ) {
    if (!this.replayElement) {
      return;
    }

    if (this.isShown()) {
      // Skip, already shown
      return;
    }

    this.options.logger.debug(`Replay: show(playerOnly=${playerOnly})`);

    const hasMedia =
      Boolean(this.videomail?.webm) ||
      Boolean(this.videomail?.mp4) ||
      Boolean(this.videomail?.poster);

    if (!playerOnly && hasFixedVideoFrame(this.options)) {
      this.replayElement.style.width = "100%";
      this.replayElement.style.height = "100%";
    } else if (hasMedia) {
      this.correctDimensions(
        true,
        // beware that recorderWidth and videomailHeight can be null sometimes
        videomailWidth ?? this.replayElement.videoWidth,
        videomailHeight ?? this.replayElement.videoHeight,
      );
    }

    if (playerOnly) {
      if (hasMedia) {
        showElement(this.replayElement);
      }

      showElement(this.replayElement.parentElement);
    } else {
      showElement(this.replayElement);
      this.visuals.show();
    }

    if (hasAudio) {
      /*
       * https://github.com/binarykitchen/videomail-client/issues/115
       */
      this.replayElement.volume = 1;
    } else if (!isAudioEnabled(this.options)) {
      this.replayElement.setAttribute("muted", "true");
    }

    // this forces to actually fetch the videos from the server
    this.replayElement.load();

    this.removeCanPlayThroughHandler();
    const eventName = this.videomail ? "REPLAY_SHOWN" : "PREVIEW_SHOWN";
    this.canPlayThroughHandler = () => {
      this.canPlayThroughHandler = undefined;
      this.emit(eventName);
    };
    this.replayElement.addEventListener("canplaythrough", this.canPlayThroughHandler, {
      once: true,
    });
  }

  public build(replayParentElement: HTMLElement) {
    this.options.logger.debug(
      `Replay: build (replayParentElement="${pretty(replayParentElement)}")`,
    );

    this.replayElement = this.visuals
      .getElement()
      ?.querySelector(`video.${this.options.selectors.replayClass}`);

    if (!this.replayElement) {
      this.buildElement(replayParentElement);
    }

    if (!this.replayElement) {
      throw new Error("There is no replayElement to build on");
    }

    // Native previews need an origin header, even when there are no captions.
    if (!this.replayElement.hasAttribute("crossorigin")) {
      this.replayElement.crossOrigin = "anonymous";
    }

    this.hide();

    if (this.options.video.autoPlay) {
      this.replayElement.setAttribute("autoplay", this.options.video.autoPlay.toString());
    }

    this.replayElement.setAttribute("autostart", "true");
    this.replayElement.setAttribute("autobuffer", "true");
    this.replayElement.setAttribute("playsinline", "true");
    this.replayElement.setAttribute("webkit-playsinline", "webkit-playsinline");
    this.replayElement.setAttribute("preload", "auto");

    if (!this.built) {
      this.on("PREVIEW", (params?: VideomailPreviewParams) => {
        // Only add controls when needed, so that the native video controls do
        // not appear unnecessarily before recording
        this.replayElement?.setAttribute("controls", "controls");
        this.show(params?.width, params?.height, params?.hasAudio);
      });

      this.replayElement.addEventListener("touchstart", this.togglePlayback);
      this.replayElement.addEventListener("click", this.togglePlayback);
    }

    this.built = true;

    this.options.logger.debug("Replay: built.");
  }

  private removeCanPlayThroughHandler() {
    if (this.canPlayThroughHandler) {
      this.replayElement?.removeEventListener(
        "canplaythrough",
        this.canPlayThroughHandler,
      );
      this.canPlayThroughHandler = undefined;
    }
  }

  public unload(params?: UnloadParams) {
    this.options.logger.debug("Replay: unload()");

    this.removeCanPlayThroughHandler();

    this.replayElement?.removeEventListener("touchstart", this.togglePlayback);
    this.replayElement?.removeEventListener("click", this.togglePlayback);

    this.removeAllListeners();

    if (params?.startingOver) {
      this.hide();
    } else {
      this.replayElement?.remove();
      this.replayElement = undefined;
    }

    this.videomail = undefined;
    this.built = false;
  }

  public getVideoSource(type: string) {
    return (
      this.replayElement?.querySelector<HTMLSourceElement>(
        `source[type="video/${type}"]`,
      ) ?? undefined
    );
  }

  private setTrackSource(src: string) {
    if (!this.replayElement) {
      return;
    }

    const tracks = this.replayElement.getElementsByTagName("track");
    const firstTrack = tracks[0];

    if (firstTrack) {
      if (src) {
        firstTrack.setAttribute("src", src);
      } else {
        // Remove when no captions available
        firstTrack.remove();
      }
    } else {
      const track = document.createElement("track");

      track.src = src;

      // Use captions without requiring a subtitle language.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
      track.kind = "captions";
      track.default = true;

      this.replayElement.appendChild(track);
    }
  }

  private setVideoSource(type: string, src?: string, bustCache?: boolean) {
    if (!this.replayElement) {
      throw new Error("There is no replay element for appending a video source");
    }

    let source = this.getVideoSource(type);
    let url = src;

    if (url && bustCache) {
      url += `?${Date.now()}`;
    }

    if (!source) {
      if (src) {
        const { fps } = this.options.video;

        // Ensure it's greater than the frame duration itself
        const t = 2 * (1 / fps);

        source = document.createElement("source");
        /*
         * Ensures HTML video thumbnail turns up on iOS, see
         * https://muffinman.io/blog/hack-for-ios-safari-to-display-html-video-thumbnail/
         */
        source.src = `${url}#t=${t}`;
        source.type = `video/${type}`;

        this.replayElement.appendChild(source);
      }
    } else if (url) {
      source.setAttribute("src", url);
    } else {
      source.remove();
    }
  }

  public setMp4Source(src?: string, bustCache?: boolean) {
    this.setVideoSource(VideoType.MP4, src, bustCache);
  }

  public setWebMSource(src?: string, bustCache?: boolean) {
    this.setVideoSource(VideoType.WebM, src, bustCache);
  }

  public getVideoType() {
    if (!this.replayElement) {
      return;
    }
    return getBrowser(this.options).getVideoType(this.replayElement);
  }

  private pause(cb) {
    /*
     * Wait for pending play requests before pausing. See:
     * http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
     */
    window.setTimeout(() => {
      try {
        if (this.replayElement) {
          this.replayElement.pause();
        }
      } catch (exc) {
        // Log pause failures without blocking reset.
        // See https://github.com/binarykitchen/videomail.io/issues/386.
        this.options.logger.warn(exc);
      }

      cb();
    }, 15);
  }

  public reset(cb?) {
    // Pause before clearing sources to release playback resources.
    this.pause(() => {
      if (this.replayElement) {
        this.setMp4Source(undefined);
        this.setWebMSource(undefined);
      }

      this.videomail = undefined;

      cb?.();
    });
  }

  public hide({ discardPreview = false } = {}) {
    const video = this.replayElement;
    if (!video) {
      return;
    }

    video.pause();

    // Avoid a leftover black controls bar on mobile.
    video.removeAttribute("controls");

    if (discardPreview) {
      this.removeCanPlayThroughHandler();
      this.videomail = undefined;
    }

    // Previews use <source> children. Hiding them does not unload the old player
    // before the next camera stream starts, and load() alone would select them again.
    const sources = discardPreview ? video.querySelectorAll("source") : [];

    if (hasMediaToUnload(video, sources, discardPreview)) {
      video.removeAttribute("src");
      sources.forEach((source) => source.remove());
      video.load();
    }

    hideElement(video);
    hideElement(video.parentElement);
  }

  public isShown() {
    if (!this.replayElement) {
      return false;
    }

    return !isHidden(this.replayElement) && !this.visuals.isHidden();
  }

  public getElement() {
    return this.replayElement;
  }
}

export default Replay;
