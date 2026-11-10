import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import Buttons from "../buttons";
import type Container from "../container";
import Visuals from "../visuals";

function createFixture(overrides = {}) {
  const element = document.createElement("div");
  const enableAudio = vi.fn();
  const isCountingDown = vi.fn(() => false);
  const record = vi.fn();
  const recordAgain = vi.fn();
  const container = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    beginWaiting: vi.fn(),
    disableAudio: vi.fn(),
    enableAudio,
    hasForm: vi.fn(() => false),
    isCountingDown,
    pause: vi.fn(),
    querySelector: (selector: string) => element.querySelector(selector),
    record,
    recordAgain,
    resume: vi.fn(),
    stop: vi.fn(),
    submit: vi.fn(() => Promise.resolve()),
  } as unknown as Container;
  const options = mergeWithDefaultOptions(overrides);
  const buttons = new Buttons(container, options);

  return {
    buttons,
    container,
    element,
    enableAudio,
    isCountingDown,
    options,
    record,
    recordAgain,
  };
}

function emit(buttons: Buttons, eventName: string, params?) {
  const emitter = buttons as unknown as {
    emit: (name: string, eventParams?: unknown) => void;
  };
  emitter.emit(eventName, params);
}

// Real buttons, overlays, and countdown; fake camera/capture keep this hardware-free.
function createCountdownFixture() {
  const element = document.createElement("div");
  const options = mergeWithDefaultOptions({
    video: { countdown: 3, stretch: true },
  });
  const container = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    beginWaiting: vi.fn(),
    enableForm: vi.fn(),
    endWaiting: vi.fn(),
    hasForm: () => false,
    insertBefore: (child: HTMLElement, reference: HTMLElement) =>
      element.insertBefore(child, reference),
    isCountingDown: () => visuals.isCountingDown(),
    isOutsideElementOf: () => false,
    limitHeight: (height: number) => ({ unit: "px", value: height }),
    limitWidth: (width: number) => ({ unit: "px", value: width }),
    pause: () => {
      visuals.pause();
    },
    querySelector: (selector: string) => element.querySelector(selector),
    record: () => {
      visuals.record();
    },
    resume: () => visuals.resume(),
    stop: () => {
      visuals.stop();
    },
    submit: vi.fn().mockResolvedValue(undefined),
    validate: vi.fn(),
  } as unknown as Container;
  const visuals = new Visuals(container, options);
  const buttons = new Buttons(container, options);
  buttons.build();
  visuals.build();
  const recorder = visuals.getRecorder();
  let paused = false;
  const record = vi.spyOn(recorder, "record").mockImplementation(() => undefined);
  const recovery = vi.spyOn(recorder, "recoverCamera").mockResolvedValue(true);
  vi.spyOn(recorder, "isPaused").mockImplementation(() => paused);
  vi.spyOn(recorder, "pause").mockImplementation(() => {
    paused = true;
    emit(buttons, "PAUSED");
  });
  vi.spyOn(recorder, "resumeMediaForCountdown").mockImplementation(() => {
    paused = false;
  });
  emit(buttons, "USER_MEDIA_READY", {});
  element.querySelector<HTMLButtonElement>(".record")?.click();
  // One countdown tick puts us at 2, before a single video frame has been captured.
  vi.advanceTimersByTime(950);
  visuals.pause();

  return { buttons, element, record, recovery, visuals };
}

describe("Buttons", () => {
  it("builds the standard button set", () => {
    const { buttons, element } = createFixture();

    buttons.build();

    expect(element.querySelectorAll("button")).toHaveLength(6);
  });

  it("starts in a state that is not ready to record", () => {
    const { buttons } = createFixture();
    buttons.build();

    expect(buttons.isReady()).toBe(false);
  });

  it("enables and shows record after user media is ready", () => {
    const { buttons, element } = createFixture();
    buttons.build();

    emit(buttons, "USER_MEDIA_READY", {
      recordWhenReady: false,
      switchingFacingMode: false,
    });

    const recordButton = element.querySelector<HTMLButtonElement>(".record");
    expect([recordButton?.disabled, recordButton?.style.display]).toEqual([false, ""]);
  });

  it("delegates record button clicks to the container", () => {
    const { buttons, element, record } = createFixture();
    buttons.build();
    emit(buttons, "USER_MEDIA_READY", {
      recordWhenReady: false,
      switchingFacingMode: false,
    });

    element.querySelector<HTMLButtonElement>(".record")?.click();

    expect(record).toHaveBeenCalledOnce();
  });

  it("shows an enabled record-again button for preview", () => {
    const { buttons, element } = createFixture();
    buttons.build();

    emit(buttons, "PREVIEW");

    const recordAgain = element.querySelector<HTMLButtonElement>(".recordAgain");
    expect([recordAgain?.disabled, recordAgain?.style.display]).toEqual([false, ""]);
  });

  it("shows an enabled resume button when paused", () => {
    const { buttons, element } = createFixture();
    buttons.build();

    emit(buttons, "PAUSED");

    const resume = element.querySelector<HTMLButtonElement>(".resume");
    expect([resume?.disabled, resume?.style.display]).toEqual([false, ""]);
  });

  it("shows an enabled resume control for a paused countdown", () => {
    const { buttons, element, isCountingDown } = createFixture();
    isCountingDown.mockReturnValue(true);
    buttons.build();

    emit(buttons, "PAUSED");

    const resume = element.querySelector<HTMLButtonElement>(".resume");
    expect([resume?.disabled, resume?.style.display]).toEqual([false, ""]);
  });

  describe("countdown background recovery", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("keeps 2 paused after foreground recovery and exposes Resume", async () => {
      const { element, visuals, record } = createCountdownFixture();

      await visuals.recoverCamera();
      vi.advanceTimersByTime(10_000);
      const resume = element.querySelector<HTMLButtonElement>(".resume");

      expect({
        countdown: element.querySelector(".countdown")?.textContent,
        pausedOverlay: element.querySelector<HTMLElement>(".paused")?.style.display,
        resume: [resume?.disabled, resume?.style.display],
        recordingCalls: record.mock.calls.length,
      }).toEqual({
        countdown: "2",
        pausedOverlay: "",
        resume: [false, ""],
        recordingCalls: 0,
      });
    });

    it("continues from 2 after clicking Resume and starts exactly one take", async () => {
      const { element, record } = createCountdownFixture();

      element.querySelector<HTMLButtonElement>(".resume")?.click();
      await Promise.resolve();
      const resumedAt = element.querySelector(".countdown")?.textContent;
      vi.advanceTimersByTime(2000);

      expect({ resumedAt, recordings: record.mock.calls.length }).toEqual({
        resumedAt: "2",
        recordings: 1,
      });
    });

    it("waits for camera recovery before continuing the countdown", async () => {
      const { element, record, recovery } = createCountdownFixture();
      const pending = Promise.withResolvers<boolean>();
      recovery.mockReturnValue(pending.promise);
      element.querySelector<HTMLButtonElement>(".resume")?.click();
      vi.advanceTimersByTime(10_000);
      const whileRecovering = element.querySelector(".countdown")?.textContent;

      pending.resolve(true);
      await pending.promise;
      await Promise.resolve();
      vi.advanceTimersByTime(2000);

      expect({ whileRecovering, recordings: record.mock.calls.length }).toEqual({
        whileRecovering: "2",
        recordings: 1,
      });
    });

    it("hides Resume and does not offer Stop while the resumed countdown runs", async () => {
      const { element } = createCountdownFixture();
      element.querySelector<HTMLButtonElement>(".resume")?.click();
      await Promise.resolve();

      expect({
        resume: element.querySelector<HTMLElement>(".resume")?.style.display,
        stop: element.querySelector<HTMLElement>(".preview")?.style.display,
        pause: element.querySelector<HTMLElement>(".pause")?.style.display,
        pausedOverlay: element.querySelector<HTMLElement>(".paused")?.style.display,
      }).toEqual({
        resume: "none",
        stop: "none",
        pause: "none",
        pausedOverlay: "none",
      });
    });

    it("keeps Resume available if camera recovery fails", async () => {
      const { element, recovery, record } = createCountdownFixture();
      recovery.mockResolvedValue(false);
      element.querySelector<HTMLButtonElement>(".resume")?.click();
      await Promise.resolve();
      vi.advanceTimersByTime(5000);
      const resume = element.querySelector<HTMLButtonElement>(".resume");

      expect({
        countdown: element.querySelector(".countdown")?.textContent,
        resume: [resume?.disabled, resume?.style.display],
        recordings: record.mock.calls.length,
      }).toEqual({ countdown: "2", resume: [false, ""], recordings: 0 });
    });

    it("preserves countdown Resume when camera replacement reports readiness", () => {
      const { buttons, element } = createCountdownFixture();

      emit(buttons, "USER_MEDIA_READY", { recovering: true, paused: true });

      expect({
        resume: [
          element.querySelector<HTMLButtonElement>(".resume")?.disabled,
          element.querySelector<HTMLElement>(".resume")?.style.display,
        ],
        record: element.querySelector<HTMLElement>(".record")?.style.display,
        stop: element.querySelector<HTMLElement>(".preview")?.style.display,
      }).toEqual({ resume: [false, ""], record: "none", stop: "none" });
    });

    it("can pause again at 1 and resume without resetting or duplicating the take", async () => {
      const { element, visuals, record } = createCountdownFixture();
      element.querySelector<HTMLButtonElement>(".resume")?.click();
      await Promise.resolve();
      vi.advanceTimersByTime(950);
      visuals.pause();
      vi.advanceTimersByTime(5000);
      const remaining = element.querySelector(".countdown")?.textContent;

      element.querySelector<HTMLButtonElement>(".resume")?.click();
      await Promise.resolve();
      vi.advanceTimersByTime(1000);

      expect({ remaining, recordings: record.mock.calls.length }).toEqual({
        remaining: "1",
        recordings: 1,
      });
    });

    it("allows the keyboard pause/resume action to continue a paused countdown", async () => {
      const { visuals, record } = createCountdownFixture();

      visuals.pauseOrResume();
      await Promise.resolve();
      vi.advanceTimersByTime(2000);

      expect(record).toHaveBeenCalledExactlyOnceWith();
    });
  });

  it("preserves paused-take controls through camera recovery, resume, and stop", () => {
    const { buttons, element } = createFixture();
    buttons.build();
    emit(buttons, "USER_MEDIA_READY", {
      recordWhenReady: false,
      switchingFacingMode: false,
    });
    emit(buttons, "FIRST_FRAME_SENT");
    emit(buttons, "PAUSED");
    emit(buttons, "USER_MEDIA_READY", {
      paused: true,
      recovering: true,
      recordWhenReady: false,
      switchingFacingMode: false,
    });

    const record = element.querySelector<HTMLButtonElement>(".record");
    const resume = element.querySelector<HTMLButtonElement>(".resume");
    const preview = element.querySelector<HTMLButtonElement>(".preview");
    const pausedTake = {
      record: [record?.disabled, record?.style.display],
      resume: [resume?.disabled, resume?.style.display],
      stop: [preview?.disabled, preview?.style.display],
    };

    emit(buttons, "RESUMING");
    const resumedTake = {
      pause: [
        element.querySelector<HTMLButtonElement>(".pause")?.disabled,
        element.querySelector<HTMLButtonElement>(".pause")?.style.display,
      ],
      record: [record?.disabled, record?.style.display],
      resume: [resume?.disabled, resume?.style.display],
    };

    emit(buttons, "STOPPING");
    const stoppedTake = {
      pause: element.querySelector<HTMLButtonElement>(".pause")?.style.display,
      resume: resume?.style.display,
      stop: preview?.disabled,
    };

    expect({ pausedTake, resumedTake, stoppedTake }).toEqual({
      pausedTake: {
        record: [true, "none"],
        resume: [false, ""],
        stop: [false, ""],
      },
      resumedTake: {
        pause: [false, ""],
        record: [true, "none"],
        resume: [false, "none"],
      },
      stoppedTake: {
        pause: "none",
        resume: "none",
        stop: true,
      },
    });
  });

  it("enables submit after the form becomes valid", () => {
    const { buttons } = createFixture();
    buttons.build();

    emit(buttons, "VALID");

    expect(buttons.getSubmitButton()?.disabled).toBe(false);
  });

  it("disables submit after the form becomes invalid", () => {
    const { buttons } = createFixture();
    buttons.build();
    emit(buttons, "VALID");

    emit(buttons, "INVALID");

    expect(buttons.getSubmitButton()?.disabled).toBe(true);
  });

  it("disables all action buttons when reset", () => {
    const { buttons, element } = createFixture();
    buttons.build();
    emit(buttons, "USER_MEDIA_READY", {
      recordWhenReady: false,
      switchingFacingMode: false,
    });

    buttons.reset();

    expect(
      Array.from(
        element.querySelectorAll<HTMLButtonElement>("button:not(.submit)"),
      ).every((button) => button.disabled),
    ).toBe(true);
  });

  it("builds audio switch radio buttons when configured", () => {
    const { buttons, element } = createFixture({ audio: { switch: true } });

    buttons.build();

    expect(element.querySelectorAll("input[name='audio']")).toHaveLength(2);
  });

  it("delegates the audio-on choice to the container", () => {
    const { buttons, element, enableAudio } = createFixture({
      audio: { switch: true },
    });
    buttons.build();
    const audioOn = element.querySelector<HTMLInputElement>("#audioOnOption");

    audioOn?.dispatchEvent(new Event("change"));

    expect(enableAudio).toHaveBeenCalledOnce();
  });

  it("shows and hides the buttons container", () => {
    const { buttons, element } = createFixture();
    buttons.build();
    buttons.show();
    const shownDisplay = element.querySelector<HTMLElement>(".buttons")?.style.display;

    buttons.hide();

    expect([
      shownDisplay,
      element.querySelector<HTMLElement>(".buttons")?.style.display,
    ]).toEqual(["", "none"]);
  });

  it("stores a replacement submit button", () => {
    const { buttons } = createFixture();
    const submit = document.createElement("button");

    buttons.setSubmitButton(submit);

    expect(buttons.getSubmitButton()).toBe(submit);
  });

  it("delegates record-again clicks after preview", () => {
    const { buttons, element, recordAgain } = createFixture();
    buttons.build();
    emit(buttons, "PREVIEW");

    element.querySelector<HTMLButtonElement>(".recordAgain")?.click();

    expect(recordAgain).toHaveBeenCalledOnce();
  });

  it("removes its event listeners when unloaded", () => {
    const { buttons } = createFixture();
    buttons.build();
    buttons.unload();

    emit(buttons, "VALID");

    expect(buttons.getSubmitButton()?.disabled).toBe(true);
  });
});
