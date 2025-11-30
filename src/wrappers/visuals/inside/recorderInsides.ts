import { VideomailClientOptions } from "../../../types/options";
import Despot from "../../../util/Despot";
import getBrowser from "../../../util/getBrowser";
import Visuals from "../../visuals";
import Countdown from "./recorder/countdown";
import FacingMode from "./recorder/facingMode";
import PausedNote from "./recorder/pausedNote";
import RecordNote from "./recorder/recordNote";
import RecordTimer from "./recorder/recordTimer";

class RecorderInsides extends Despot {
  private readonly recordNote: RecordNote;
  private readonly recordTimer: RecordTimer;

  private readonly countdown?: Countdown;
  private readonly facingMode?: FacingMode;
  private readonly pausedNote?: PausedNote;

  private built = false;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    super("RecorderInsides", options);

    this.recordNote = new RecordNote(visuals);
    this.recordTimer = new RecordTimer(visuals, this.recordNote, options);

    const browser = getBrowser(options);

    if (options.video.countdown) {
      this.countdown = new Countdown(visuals, options);
    }

    if (options.video.facingModeButton && browser.isMobile()) {
      this.facingMode = new FacingMode(visuals, options);
    }

    if (options.enablePause) {
      this.pausedNote = new PausedNote(visuals, options);
    }
  }

  private startRecording() {
    this.recordTimer.start();
  }

  private resumeRecording() {
    this.recordTimer.resume();
  }

  private stopRecording() {
    this.recordTimer.stop();
  }

  private pauseRecording() {
    if (this.isCountingDown()) {
      this.countdown?.pause();
    } else {
      this.recordTimer.pause();
    }
  }

  private onResetting() {
    this.hidePause();
    this.hideCountdown();

    this.recordTimer.stop();
    this.facingMode?.hide();
  }

  private initEvents() {
    this.options.logger.debug("RecorderInsides: initEvents()");

    this.on("USER_MEDIA_READY", () => {
      this.facingMode?.show();
    });

    this.on("RECORDING", () => {
      this.startRecording();
    });

    this.on("RESUMING", () => {
      this.resumeRecording();
    });

    this.on("STOPPING", () => {
      this.stopRecording();
    });

    this.on("PAUSED", () => {
      this.pauseRecording();
    });

    this.on("ERROR", () => {
      this.onResetting();
    });

    this.on("RESETTING", () => {
      this.onResetting();
    });

    this.on("HIDE", () => {
      this.hideCountdown();
    });
  }

  public build() {
    this.options.logger.debug("RecorderInsides: build()");

    this.countdown?.build();
    this.pausedNote?.build();
    this.facingMode?.build();

    this.recordNote.build();
    this.recordTimer.build();

    if (!this.built) {
      this.initEvents();
    }

    this.built = true;
  }

  public unload() {
    this.countdown?.unload();

    this.built = false;
  }

  public showPause() {
    this.pausedNote?.show();
  }

  public hidePause() {
    this.pausedNote?.hide();
  }

  public hideCountdown() {
    this.countdown?.hide();
  }

  public startCountdown(cb) {
    this.countdown?.start(cb);
  }

  public resumeCountdown() {
    this.countdown?.resume();
  }

  public isCountingDown() {
    return this.countdown?.isCountingDown();
  }

  public checkTimer(elapsedTime: number) {
    this.recordTimer.check(elapsedTime);
  }

  public setLimitSeconds(limitSeconds: number) {
    this.options.video.limitSeconds = limitSeconds;
    this.recordTimer.setLimitSeconds(limitSeconds);
  }
}

export default RecorderInsides;
