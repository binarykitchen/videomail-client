import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import Container from "../container";
import { FormInputs, FormMethod, FormMethodType } from "../form";

interface ContainerInternals {
  options: ReturnType<typeof mergeWithDefaultOptions>;
  visibility: {
    onChange: (listener: (visible: boolean) => void) => () => void;
  };
  visuals: {
    record: () => void;
    setLimitSeconds: (limitSeconds: number) => void;
    show: () => void;
    getRecordingDimensions: () => { width: number; height: number } | undefined;
    getRecorderWidth: (responsive: boolean) => { unit: string; value: number };
    getRecorderHeight: (responsive: boolean) => { unit: string; value: number };
  };
  form?: { transformFormData: (inputs: FormInputs) => FormInputs };
  resource: {
    form: (data: Record<string, unknown>, url: string) => Promise<unknown>;
    post: (data: FormInputs) => Promise<unknown>;
  };
  submitVideomail: (inputs: FormInputs, method: FormMethodType) => Promise<unknown>;
}

function getInternals(container: Container) {
  return container as unknown as ContainerInternals;
}

function createVisibilityFixture(enableAutoPause = true) {
  const container = new Container(
    mergeWithDefaultOptions({ enableAutoPause, enablePause: true }),
  );
  const visibility: { change?: (visible: boolean) => void } = {};
  const unsubscribe = vi.fn();
  vi.spyOn(getInternals(container).visibility, "onChange").mockImplementation(
    (listener) => {
      visibility.change = listener;
      return unsubscribe;
    },
  );
  const pause = vi.spyOn(container, "pause").mockImplementation(() => undefined);
  const resume = vi.spyOn(container, "resume").mockImplementation(() => undefined);
  const recover = vi.spyOn(container, "recoverCamera").mockResolvedValue(true);
  container.build();

  return { container, pause, resume, recover, unsubscribe, visibility };
}

function buildExternalSubmitFixture(
  formId = "someForm",
  submitMarkup = `<input id="external-submit" type="button" value="Submit">`,
  enableAutoValidation = false,
) {
  document.body.innerHTML = `
    <form action="/contact" method="post">
      <input name="from" type="email" value="signer@example.test" required>
      <input name="subject" value="Hello" required>
      <div id="videomail-target"></div>
    </form>
    ${submitMarkup}
  `;
  const formElement = document.querySelector("form");
  const submitButton = document.querySelector<HTMLInputElement | HTMLButtonElement>(
    "#external-submit",
  );

  if (!formElement || !submitButton) {
    throw new Error("Missing external submit fixture controls");
  }

  if (formId) {
    formElement.id = formId;
  }

  const container = new Container(
    mergeWithDefaultOptions({
      enableAutoValidation,
      selectors: {
        containerId: "videomail-target",
        formId,
        submitButtonSelector: "#external-submit",
      },
    }),
  );
  const submitAll = vi.spyOn(container, "submitAll").mockResolvedValue(undefined);
  container.build();

  return { container, formElement, submitButton, submitAll };
}

describe("Container", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.classList.remove("wait");
    vi.restoreAllMocks();
  });

  it.each(["recording", "paused", "countdown"])(
    "pauses %s when the document goes into the background",
    (state) => {
      const { container, visibility, pause } = createVisibilityFixture();
      vi.spyOn(container, "isRecording").mockReturnValue(state === "recording");
      vi.spyOn(container, "isPaused").mockReturnValue(state === "paused");
      vi.spyOn(container, "isCountingDown").mockReturnValue(state === "countdown");

      visibility.change?.(false);

      expect(pause).toHaveBeenCalledOnce();
    },
  );

  it("recovers on foreground without silently resuming a countdown or take", () => {
    const { container, visibility, resume, recover } = createVisibilityFixture();
    vi.spyOn(container, "isCountingDown").mockReturnValue(true);

    visibility.change?.(true);

    expect({
      recoveries: recover.mock.calls.length,
      resumes: resume.mock.calls.length,
    }).toEqual({ recoveries: 1, resumes: 0 });
  });

  it("leaves automatic lifecycle handling disabled when configured", () => {
    const { visibility, pause, recover } = createVisibilityFixture(false);

    visibility.change?.(false);
    visibility.change?.(true);

    expect({
      pauses: pause.mock.calls.length,
      recoveries: recover.mock.calls.length,
    }).toEqual({ pauses: 0, recoveries: 0 });
  });

  it("removes the visibility listener when unloaded", () => {
    const { container, unsubscribe } = createVisibilityFixture();

    container.unload();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("submits captured frame dimensions rather than stopped-media or viewport dimensions", async () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    internals.form = { transformFormData: (inputs) => ({ ...inputs }) };
    vi.spyOn(internals.visuals, "getRecordingDimensions").mockReturnValue({
      width: 320,
      height: 240,
    });
    vi.spyOn(internals.visuals, "getRecorderWidth").mockReturnValue({
      unit: "px",
      value: 320,
    });
    vi.spyOn(internals.visuals, "getRecorderHeight").mockReturnValue({
      unit: "px",
      value: 863,
    });
    const post = vi.spyOn(internals.resource, "post").mockResolvedValue({});

    await internals.submitVideomail({}, FormMethod.POST);

    expect(post.mock.calls[0]?.[0]).toMatchObject({ width: 320, height: 240 });
  });

  it("rejects submission when no captured dimensions are available", async () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    internals.form = { transformFormData: (inputs) => ({ ...inputs }) };

    await expect(internals.submitVideomail({}, FormMethod.POST)).rejects.toThrow(
      "Recorded frame dimensions are missing.",
    );
  });

  it("submits the host form after Videomail and includes metadata when enabled", async () => {
    const container = new Container(
      mergeWithDefaultOptions({ submitWithVideomail: true }),
    );
    const internals = getInternals(container);
    const videomail = { alias: "video-alias" };
    const response = { body: { videomail } };
    const requestOrder: string[] = [];
    const submitVideomail = vi
      .spyOn(internals, "submitVideomail")
      .mockImplementation(() => {
        requestOrder.push("videomail");
        return Promise.resolve(response);
      });
    const submitHostForm = vi.spyOn(internals.resource, "form").mockImplementation(() => {
      requestOrder.push("host");
      return Promise.resolve({});
    });
    const formData = {
      [internals.options.selectors.keyInputName]: "video-key",
      email: "ada@example.com",
    };

    await container.submitAll(formData, FormMethod.POST, "/contact", true);

    expect({
      videoRequest: submitVideomail.mock.calls[0],
      hostRequest: submitHostForm.mock.calls[0],
      requestOrder,
    }).toEqual({
      videoRequest: [formData, FormMethod.POST],
      hostRequest: [{ ...formData, videomail }, "/contact"],
      requestOrder: ["videomail", "host"],
    });
  });

  it("leaves host-form submission to integrations when auto-submission is disabled", async () => {
    const container = new Container(
      mergeWithDefaultOptions({ enableAutoSubmission: false }),
    );
    const internals = getInternals(container);
    vi.spyOn(internals, "submitVideomail").mockResolvedValue({
      body: { videomail: { alias: "video-alias" } },
    });
    const submitHostForm = vi.spyOn(internals.resource, "form").mockResolvedValue({});

    await container.submitAll(
      { [internals.options.selectors.keyInputName]: "video-key" },
      FormMethod.POST,
      "/contact",
      true,
    );

    expect(submitHostForm).not.toHaveBeenCalled();
  });

  it("does not submit a second request without an explicit host action", async () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    vi.spyOn(internals, "submitVideomail").mockResolvedValue({
      body: { videomail: { alias: "video-alias" } },
    });
    const submitHostForm = vi.spyOn(internals.resource, "form").mockResolvedValue({});

    await container.submitAll(
      { [internals.options.selectors.keyInputName]: "video-key" },
      FormMethod.POST,
      internals.options.apiUrl,
    );

    expect(submitHostForm).not.toHaveBeenCalled();
  });

  it("retries a failed host submission without resubmitting Videomail", async () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    const submitVideomail = vi.spyOn(internals, "submitVideomail").mockResolvedValue({
      body: { videomail: { alias: "video-alias" } },
    });
    const submitHostForm = vi
      .spyOn(internals.resource, "form")
      .mockRejectedValueOnce(new Error("Host unavailable"))
      .mockResolvedValueOnce({});
    const error = vi.fn();
    container.on("ERROR", error);
    const formData = {
      [internals.options.selectors.keyInputName]: "video-key",
    };

    await container.submitAll(formData, FormMethod.POST, "/contact", true);
    await container.submitAll(formData, FormMethod.POST, "/contact", true);

    expect({
      videoRequests: submitVideomail.mock.calls.length,
      hostRequests: submitHostForm.mock.calls.length,
      errors: error.mock.calls.length,
    }).toEqual({ videoRequests: 1, hostRequests: 2, errors: 1 });
  });

  it("restores the form for a UI retry and reuses the uploaded video", async () => {
    const { container, formElement, submitButton, submitAll } =
      buildExternalSubmitFixture();
    submitAll.mockRestore();

    const internals = getInternals(container);
    const subject = formElement.querySelector<HTMLInputElement>("[name='subject']");
    const lockedInput = document.createElement("input");
    lockedInput.name = "locked";
    lockedInput.disabled = true;
    formElement.appendChild(lockedInput);

    if (!subject) {
      throw new Error("Missing subject input");
    }

    const keyInput = formElement.querySelector<HTMLInputElement>(
      `[name='${internals.options.selectors.keyInputName}']`,
    );

    if (!keyInput) {
      throw new Error("Missing Videomail key input");
    }

    keyInput.value = "video-key";

    const submitVideomail = vi.spyOn(internals, "submitVideomail").mockResolvedValue({
      body: { videomail: { alias: "video-alias" } },
    });
    const submitHostForm = vi
      .spyOn(internals.resource, "form")
      .mockRejectedValueOnce(new Error("Host unavailable"))
      .mockResolvedValueOnce({});
    const error = vi.fn();
    container.on("ERROR", error);

    submitButton.click();
    await vi.waitFor(() => {
      if (submitHostForm.mock.calls.length !== 1) {
        throw new Error("Expected the first host request to settle");
      }
    });

    const firstFailureState = {
      submitEnabled: !submitButton.disabled,
      subjectEnabled: !subject.disabled,
      subjectValue: subject.value,
      lockedInputDisabled: lockedInput.disabled,
      recoverable: error.mock.calls[0]?.[0].recoverable,
    };

    subject.value = "Edited for retry";
    submitButton.click();
    await vi.waitFor(() => {
      if (submitHostForm.mock.calls.length !== 2) {
        throw new Error("Expected the host retry request to settle");
      }
    });

    expect({
      firstFailureState,
      videoRequests: submitVideomail.mock.calls.length,
      retriedSubject: submitHostForm.mock.calls[1]?.[0].subject,
    }).toEqual({
      firstFailureState: {
        submitEnabled: true,
        subjectEnabled: true,
        subjectValue: "Hello",
        lockedInputDisabled: true,
        recoverable: true,
      },
      videoRequests: 1,
      retriedSubject: "Edited for retry",
    });
  });

  it("starts unbuilt without a container element", () => {
    const container = new Container(mergeWithDefaultOptions());

    expect([container.isBuilt(), container.hasElement()]).toEqual([false, false]);
  });

  it("builds a container element", () => {
    const container = new Container(mergeWithDefaultOptions());

    const element = container.build();

    expect(element?.classList.contains("videomail")).toBe(true);
  });

  it("reports a built state after building", () => {
    const container = new Container(mergeWithDefaultOptions());

    container.build();

    expect(container.isBuilt()).toBe(true);
  });

  it("builds button and visual children", () => {
    const container = new Container(mergeWithDefaultOptions());

    const element = container.build();

    expect(element?.querySelectorAll(".buttons, .visuals")).toHaveLength(2);
  });

  it("discovers a parent form", () => {
    document.body.innerHTML = `<form><div id="videomail-target"></div><button type="submit">Send</button></form>`;
    const options = mergeWithDefaultOptions({
      selectors: { containerId: "videomail-target" },
    });
    const container = new Container(options);

    container.build();

    expect(container.hasForm()).toBe(true);
  });

  it("associates an external submit input with its host form", () => {
    const { formElement, submitButton } = buildExternalSubmitFixture();

    expect(submitButton.form).toBe(formElement);
  });

  it("keeps recorder controls out of implicit form submission", () => {
    const { formElement } = buildExternalSubmitFixture();

    expect(
      Array.from(formElement.querySelectorAll("button")).every(
        (button) => button.type === "button",
      ),
    ).toBe(true);
  });

  it.each([
    ["input", `<input id="external-submit" type="button" value="Submit">`],
    ["button", `<button id="external-submit" type="button">Submit</button>`],
  ])("submits the host form from an external %s click", (_name, markup) => {
    const { submitButton, submitAll } = buildExternalSubmitFixture("someForm", markup);

    submitButton.click();

    expect(submitAll).toHaveBeenCalledWith(
      {
        from: "signer@example.test",
        subject: "Hello",
        videomail_key: "",
      },
      "post",
      "/contact",
      true,
    );
  });

  it("supports requestSubmit before automatic validation with the external submit control", () => {
    const { container, formElement, submitButton, submitAll } =
      buildExternalSubmitFixture();
    const validate = vi.spyOn(container, "validate");

    formElement.requestSubmit(submitButton);

    expect({
      submissions: submitAll.mock.calls.length,
      validations: validate.mock.calls.length,
    }).toEqual({ submissions: 1, validations: 0 });
  });

  it("allows manual submission without a validation result when automatic validation is disabled", async () => {
    const { container, submitAll } = buildExternalSubmitFixture();

    await container.submit();

    expect(submitAll).toHaveBeenCalledOnce();
  });

  it("still requires validation before manual submission when automatic validation is enabled", async () => {
    const { container, submitAll } = buildExternalSubmitFixture(
      "someForm",
      undefined,
      true,
    );

    await container.submit();

    expect(submitAll).not.toHaveBeenCalled();
  });

  it("blocks overlapping manual submissions when automatic validation is disabled", async () => {
    const { container, submitAll } = buildExternalSubmitFixture();
    const pendingSubmission = Promise.withResolvers<undefined>();
    submitAll.mockReturnValueOnce(pendingSubmission.promise);

    const firstSubmission = container.submit();
    const secondSubmission = container.submit();
    pendingSubmission.resolve(undefined);
    await Promise.all([firstSubmission, secondSubmission]);

    expect(submitAll).toHaveBeenCalledOnce();
  });

  it("preserves existing host click and submit handlers", () => {
    const { container, formElement, submitButton, submitAll } =
      buildExternalSubmitFixture();
    const hostClick = vi.fn();
    const hostSubmit = vi.fn();
    submitButton.onclick = hostClick;
    formElement.onsubmit = hostSubmit;
    container.build();
    submitButton.disabled = false;

    submitButton.click();

    expect({
      clicks: hostClick.mock.calls.length,
      submits: hostSubmit.mock.calls.length,
      requests: submitAll.mock.calls.length,
    }).toEqual({ clicks: 1, submits: 1, requests: 1 });
  });

  it("honors cancelled external button clicks", () => {
    const { submitButton, submitAll } = buildExternalSubmitFixture();
    submitButton.onclick = (event) => {
      event.preventDefault();
    };

    submitButton.click();

    expect(submitAll).not.toHaveBeenCalled();
  });

  it("preserves native validation for the external submit control", () => {
    const { formElement, submitButton, submitAll } = buildExternalSubmitFixture();
    const sender = formElement.querySelector<HTMLInputElement>("[name='from']");
    if (sender) {
      sender.value = "";
    }

    submitButton.click();

    expect(submitAll).not.toHaveBeenCalled();
  });

  it("blocks overlapping requests from the external submit control", async () => {
    const { submitButton, submitAll } = buildExternalSubmitFixture();
    const pendingSubmission = Promise.withResolvers<undefined>();
    submitAll.mockReturnValueOnce(pendingSubmission.promise);

    submitButton.click();
    submitButton.click();
    pendingSubmission.resolve(undefined);
    await pendingSubmission.promise;

    expect(submitAll).toHaveBeenCalledOnce();
  });

  it("associates an external control when the form has no ID", () => {
    const { formElement, submitButton } = buildExternalSubmitFixture("");

    expect(submitButton.form).toBe(formElement);
  });

  it("keeps the association stable across repeated builds", () => {
    const { container, formElement, submitButton } = buildExternalSubmitFixture("");
    const formId = formElement.id;

    container.build();

    expect({ id: formElement.id, owner: submitButton.form }).toEqual({
      id: formId,
      owner: formElement,
    });
  });

  it("restores the external control's original association on unload", () => {
    const { container, submitButton } = buildExternalSubmitFixture(
      "someForm",
      `<input id="external-submit" type="button" value="Submit" form="other-form">`,
    );

    container.unload();

    expect(submitButton.getAttribute("form")).toBe("other-form");
  });

  it("preserves an existing correct association on unload", () => {
    const { container, submitButton } = buildExternalSubmitFixture(
      "someForm",
      `<input id="external-submit" type="button" value="Submit" form="someForm">`,
    );

    container.unload();

    expect(submitButton.getAttribute("form")).toBe("someForm");
  });

  it("removes a generated form ID and association on unload", () => {
    const { container, formElement, submitButton } = buildExternalSubmitFixture("");

    container.unload();

    expect({
      formId: formElement.getAttribute("id"),
      association: submitButton.getAttribute("form"),
    }).toEqual({ formId: null, association: null });
  });

  it("preserves the host form ID on unload", () => {
    const { container, formElement } = buildExternalSubmitFixture();

    container.unload();

    expect(formElement.id).toBe("someForm");
  });

  it("removes the client submit listener on unload", () => {
    const { container, formElement, submitAll } = buildExternalSubmitFixture();
    container.unload();

    const nativeSubmissionAllowed = formElement.dispatchEvent(
      new SubmitEvent("submit", { bubbles: true, cancelable: true }),
    );

    expect({ nativeSubmissionAllowed, requests: submitAll.mock.calls.length }).toEqual({
      nativeSubmissionAllowed: true,
      requests: 0,
    });
  });

  it("reconnects an external submit control after unloading and rebuilding", () => {
    const { container, submitButton, submitAll } = buildExternalSubmitFixture("");
    container.unload();
    container.build();
    submitButton.disabled = false;

    submitButton.click();

    expect(submitAll).toHaveBeenCalledOnce();
  });

  it("queries inside the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.build();

    expect(container.querySelector(".visuals")).not.toBeNull();
  });

  it("appends children to the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const child = document.createElement("p");
    const element = container.build();

    container.appendChild(child);

    expect(child.parentElement).toBe(element);
  });

  it("identifies an element outside the container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const outside = document.createElement("p");
    container.build();

    expect(container.isOutsideElementOf(outside)).toBe(true);
  });

  it("adds a waiting class to the document", () => {
    const container = new Container(mergeWithDefaultOptions());

    container.beginWaiting();

    expect(document.documentElement.classList.contains("wait")).toBe(true);
  });

  it("removes the document waiting class", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.beginWaiting();

    container.endWaiting();

    expect(document.documentElement.classList.contains("wait")).toBe(false);
  });

  it("limits width to the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const element = container.build();
    if (!element) {
      throw new Error("Expected a built container element");
    }
    const rect = {
      bottom: 0,
      height: 0,
      left: 0,
      right: 320,
      top: 0,
      width: 320,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    };
    const rectMock = vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rect);

    const dimension = container.limitWidth(640);
    rectMock.mockRestore();

    expect(dimension).toEqual({ unit: "px", value: 320 });
  });

  it("returns valid before it is built", () => {
    const container = new Container(mergeWithDefaultOptions());

    expect(container.validate()).toBe(true);
  });

  it("emits the name of the field being validated", () => {
    const container = new Container(mergeWithDefaultOptions());
    const listener = vi.fn();
    const input = document.createElement("input");
    input.name = "subject";
    const event = new Event("input");
    container.build();
    container.on("VALIDATING", listener);
    input.dispatchEvent(event);

    container.validate(event, true);

    expect(listener).toHaveBeenCalledWith({ targetName: "subject" });
  });

  it("emits the audio-enabling event", () => {
    const container = new Container(mergeWithDefaultOptions());
    const listener = vi.fn();
    container.on("ENABLING_AUDIO", listener);

    container.enableAudio();

    expect(listener).toHaveBeenCalledOnce();
  });

  it("delegates recording to visuals", () => {
    const container = new Container(mergeWithDefaultOptions());
    const record = vi
      .spyOn(getInternals(container).visuals, "record")
      .mockImplementation(() => undefined);

    container.record();

    expect(record).toHaveBeenCalledOnce();
  });

  it("updates and delegates the recording limit", () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    const setLimit = vi
      .spyOn(internals.visuals, "setLimitSeconds")
      .mockImplementation(() => undefined);

    container.setLimitSeconds(45);

    expect([internals.options.video.limitSeconds, setLimit.mock.calls]).toEqual([
      45,
      [[45]],
    ]);
  });

  it("shows the container without starting recorder work when visuals are stubbed", () => {
    const container = new Container(mergeWithDefaultOptions());
    const element = container.build();
    vi.spyOn(getInternals(container).visuals, "show").mockImplementation(() => undefined);

    const shown = container.show();

    expect(shown).toBe(element);
  });

  it("returns to an unbuilt state when unloaded", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.build();

    container.unload();

    expect(container.isBuilt()).toBe(false);
  });
});
