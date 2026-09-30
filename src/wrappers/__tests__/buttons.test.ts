import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import Buttons from "../buttons";
import type Container from "../container";

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

  it("keeps pause controls unchanged during a countdown", () => {
    const { buttons, element, isCountingDown } = createFixture();
    isCountingDown.mockReturnValue(true);
    buttons.build();

    emit(buttons, "PAUSED");

    expect(element.querySelector<HTMLElement>(".resume")?.style.display).toBe("none");
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
