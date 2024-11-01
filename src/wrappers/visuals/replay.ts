import hidden from "hidden";

import Despot from "../../util/Despot";
import { isAudioEnabled } from "../../util/options/audio";
import { VideomailClientOptions } from "../../types/options";
import Visuals from "../visuals";
import getBrowser from "../../util/getBrowser";
import calculateWidth from "../../util/html/dimensions/calculateWidth";
import calculateHeight from "../../util/html/dimensions/calculateHeight";
import Videomail from "../../types/Videomail";
import pretty from "../../util/pretty";
import { PreviewParams } from "../../types/events";
import { UnloadParams } from "../container";
import { VideoType } from "../../types/VideoType";

class Replay extends Despot {
  private readonly visuals: Visuals;

  private built = false;
  private replayElement?: HTMLVideoElement | undefined | null;
  private videomail?: Videomail | undefined;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    super("Replay", options);

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

  // Questionable, does not make sense
  private isStandalone() {
    return this.visuals.constructor.name === "HTMLDivElement";
  }

  private copyAttributes(newVideomail: Videomail) {
    let attributeContainer;

    Object.keys(newVideomail).forEach((attribute: string) => {
      attributeContainer = this.replayElement?.parentNode?.querySelector(`.${attribute}`);

      if (attributeContainer) {
        const empty =
          !attributeContainer.innerHTML || attributeContainer.innerHTML.length < 1;

        // Do not overwrite when already set before, e
        // e.g. with a React component adding links to the body
        if (empty) {
          attributeContainer.innerHTML = newVideomail[attribute];
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

    let height;
    let width;

    let ratio;

    if (this.videomail) {
      width = this.videomail.width;
      height = this.videomail.height;

      if (width) {
        ratio = height / width;
      }
    }

    if (!width) {
      width = calculateWidth(responsive, videoHeight, this.options, ratio);
    }

    if (!height) {
      const element = this.visuals.getElement() ?? document.body;
      height = calculateHeight(responsive, videoWidth, this.options, ratio, element);
    }

    if (width > 0) {
      this.replayElement.style.width = `${width}px`;
    } else {
      this.replayElement.style.width = "auto";
    }

    if (height > 0) {
      this.replayElement.style.height = `${height}px`;
    } else {
      this.replayElement.style.height = "auto";
    }
  }

  public setVideomail(newVideomail: Videomail, playerOnly = false) {
    this.videomail = newVideomail;

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

    if (hasMedia) {
      this.correctDimensions(
        true,
        // beware that recorderWidth and videomailHeight can be null sometimes
        videomailWidth ? videomailWidth : this.replayElement.videoWidth,
        videomailHeight ? videomailHeight : this.replayElement.videoHeight,
      );
    }

    if (playerOnly) {
      if (hasMedia) {
        hidden(this.replayElement, false);
      }
    } else {
      hidden(this.replayElement, false);
    }

    if (playerOnly) {
      hidden(this.replayElement.parentNode, false);
    } else {
      this.visuals.show();
    }

    if (hasAudio) {
      /*
       * https://github.com/binarykitchen/videomail-client/issues/115
       * do not set mute to false as this will mess up. just do not mention this attribute at all
       */
      this.replayElement.setAttribute("volume", "1");
    } else if (!isAudioEnabled(this.options)) {
      this.replayElement.setAttribute("muted", "true");
    }

    // this forces to actually fetch the videos from the server
    this.replayElement.load();

    if (!this.videomail) {
      this.replayElement.addEventListener(
        "canplaythrough",
        () => {
          this.emit("PREVIEW_SHOWN");
        },
        { once: true },
      );
    } else {
      this.replayElement.addEventListener(
        "canplaythrough",
        () => {
          this.emit("REPLAY_SHOWN");
        },
        { once: true },
      );
    }
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

    this.hide();

    this.replayElement.setAttribute("autoplay", "true");
    this.replayElement.setAttribute("autostart", "true");
    this.replayElement.setAttribute("autobuffer", "true");
    this.replayElement.setAttribute("playsinline", "true");
    this.replayElement.setAttribute("webkit-playsinline", "webkit-playsinline");
    this.replayElement.setAttribute("controls", "controls");
    this.replayElement.setAttribute("preload", "auto");

    if (!this.built) {
      if (!this.isStandalone()) {
        this.on("PREVIEW", (params?: PreviewParams) => {
          this.show(params?.width, params?.height, params?.hasAudio);
        });
      }

      this.replayElement.addEventListener("touchstart", (e) => {
        e.preventDefault();

        if (this.replayElement?.paused) {
          this.replayElement.play().catch((err: unknown) => {
            throw err;
          });
        } else {
          this.replayElement?.pause();
        }
      });

      this.replayElement.addEventListener("click", (e) => {
        e.preventDefault();

        if (this.replayElement?.paused) {
          this.replayElement.play().catch((err: unknown) => {
            throw err;
          });
        } else {
          this.replayElement?.pause();
        }
      });
    }

    this.built = true;

    this.options.logger.debug("Replay: built.");
  }

  public unload(params?: UnloadParams) {
    this.options.logger.debug("Replay: unload()");

    Despot.removeAllListeners();

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
    if (!this.replayElement) {
      return;
    }

    const sources = this.replayElement.getElementsByTagName("source");
    const l = sources.length;
    const videoType = `video/${type}`;

    let source: HTMLSourceElement | undefined;

    if (l) {
      let i;

      for (i = 0; i < l && !source; i++) {
        if (sources[i]?.getAttribute("type") === videoType) {
          source = sources[i];
        }
      }
    }

    return source;
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
        this.replayElement.removeChild(firstTrack);
      }
    } else {
      // Insert one then
      const track = document.createElement("track");

      track.setAttribute("src", src);
      track.src = src;

      // It's captions, not subtitles. Because for subtitles you must define the language, see
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
      track.kind = "captions";
      track.default = true;

      this.replayElement.appendChild(track);

      // Because the local videomail server for development uses a different port, see
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
      this.replayElement.setAttribute("crossorigin", "anonymous");
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
    } else if (src) {
      source.setAttribute("src", src);
    } else {
      this.replayElement.removeChild(source);
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
     * avoids race condition, inspired by
     * http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
     */
    window.setTimeout(() => {
      try {
        if (this.replayElement) {
          this.replayElement.pause();
        }
      } catch (exc) {
        // just ignore, see https://github.com/binarykitchen/videomail.io/issues/386
        this.options.logger.warn(exc);
      }

      cb();
    }, 15);
  }

  public reset(cb?) {
    // pause video to make sure it won't consume any memory
    this.pause(() => {
      if (this.replayElement) {
        this.setMp4Source(undefined);
        this.setWebMSource(undefined);
      }

      this.videomail = undefined;

      cb?.();
    });
  }

  public hide() {
    if (this.isStandalone()) {
      hidden(this.visuals, true);
    } else if (this.replayElement) {
      hidden(this.replayElement, true);
      hidden(this.replayElement.parentNode, true);
    }
  }

  public isShown() {
    if (!this.replayElement) {
      return false;
    }

    return !hidden(this.replayElement) && !this.visuals.isHidden();
  }

  public getVisuals() {
    return this.visuals;
  }

  public getElement() {
    return this.replayElement;
  }
}

export default Replay;
