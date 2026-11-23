import type { PartialVideomailClientOptions } from "../../types/options";
import type { Videomail } from "../../types/Videomail";
import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import type Container from "../container";
import Form from "../form";

function createFixture(formMarkup = "", overrides: PartialVideomailClientOptions = {}) {
  const formElement = document.createElement("form");
  formElement.innerHTML = formMarkup;
  const submitButton = formElement.querySelector<HTMLButtonElement>("[type='submit']");
  const submitAll = vi.fn<Container["submitAll"]>().mockResolvedValue(undefined);
  const validate = vi.fn();
  const container = {
    getSubmitButton: vi.fn(() => submitButton ?? undefined),
    hasElement: vi.fn(() => true),
    submitAll,
    validate,
  } as unknown as Container;
  const options = mergeWithDefaultOptions(overrides);
  const form = new Form(container, formElement, options);

  return { container, form, formElement, options, submitAll, validate };
}

function emit(form: Form, eventName: string, params?) {
  const emitter = form as unknown as {
    emit: (name: string, eventParams?: unknown) => void;
  };
  emitter.emit(eventName, params);
}

function buildFixture(formMarkup = "") {
  const fixture = createFixture(formMarkup);
  document.body.appendChild(fixture.formElement);
  fixture.form.build();
  emit(fixture.form, "BUILT");

  return fixture;
}

describe("Form", () => {
  const VIDEOMAIL = {
    alias: "existing-video",
    body: "Signed message",
    from: "sender@example.com",
    to: ["one@example.com", "two@example.com"],
    cc: ["copy@example.com"],
    bcc: ["private@example.com"],
    subject: "Existing subject",
    key: "existing-video-key",
    parentKey: "parent-video-key",
    url: "https://example.test/video",
    replyUrl: "https://example.test/reply",
    dateCreated: 0,
    dateCreatedServerPretty: "Created",
    expiresAfter: 1,
    expiresAfterIso: "1970-01-01T00:00:00.001Z",
    expiresAfterServerPretty: "Expires",
    sending: false,
    whitelistKey: "test",
    versions: { videomailClient: "test" },
  } satisfies Videomail;

  it("transforms registered form fields", () => {
    const { form } = createFixture();

    expect(
      form.transformFormData({
        body: "Welcome",
        ignored: "not included",
        subject: "Hello",
      }),
    ).toEqual({ body: "Welcome", subject: "Hello" });
  });

  it("removes spaces and commas from the sender address", () => {
    const { form } = createFixture();

    expect(form.transformFormData({ from: " signer, @example.com " })).toEqual({
      from: "signer@example.com",
    });
  });

  it("splits recipient fields into trimmed address arrays", () => {
    const { form } = createFixture();

    expect(
      form.transformFormData({
        to: "one@example.com, two@example.com three@example.com",
      }),
    ).toEqual({
      to: ["one@example.com", "two@example.com", "three@example.com"],
    });
  });

  it("returns recipients populated in the form", () => {
    const { form } = createFixture(`
      <input name="to" value="one@example.com, two@example.com">
      <input name="cc" value="copy@example.com">
      <input name="subject" value="Ignored here">
    `);

    expect(form.getRecipients()).toEqual({
      cc: ["copy@example.com"],
      to: ["one@example.com", "two@example.com"],
    });
  });

  it("creates a hidden videomail key input when building", () => {
    const { form, formElement } = createFixture();

    form.build();

    expect(
      formElement.querySelector<HTMLInputElement>("[name='videomail_key']"),
    ).toMatchObject({
      type: "hidden",
    });
  });

  it("validates registered text inputs when their value changes", () => {
    const { form, formElement, validate } = createFixture(
      `<input name="subject" value="Hello">`,
    );
    form.build();

    formElement
      .querySelector("[name='subject']")
      ?.dispatchEvent(new InputEvent("input", { bubbles: true }));

    expect(validate).toHaveBeenCalledOnce();
  });

  it("stores the preview key in the hidden input", () => {
    const { form, formElement } = createFixture();
    form.build();

    emit(form, "PREVIEW", { key: "video-key" });

    expect(
      formElement.querySelector<HTMLInputElement>("[name='videomail_key']")?.value,
    ).toBe("video-key");
  });

  it("marks the form invalid on the INVALID event", () => {
    const { form, formElement } = createFixture();
    form.build();

    emit(form, "INVALID");

    expect(formElement.classList.contains("invalid")).toBe(true);
  });

  it("loads videomail values into registered controls", () => {
    const { form, formElement } = createFixture(`
      <input name="subject">
      <textarea name="body"></textarea>
      <input name="to">
    `);

    form.loadVideomail({
      body: "Signed message",
      subject: "Hello",
      to: ["one@example.com", "two@example.com"],
    } as Videomail);

    expect({
      body: formElement.querySelector<HTMLTextAreaElement>("[name='body']")?.value,
      subject: formElement.querySelector<HTMLInputElement>("[name='subject']")?.value,
      to: formElement.querySelector<HTMLInputElement>("[name='to']")?.value,
    }).toEqual({
      body: "Signed message",
      subject: "Hello",
      to: "one@example.com, two@example.com",
    });
  });

  it("submits a loaded replay with its default video and parent key fields", async () => {
    const { form, options, submitAll } = createFixture(`
      <input name="subject">
      <input type="hidden" name="videomail_parent_key">
    `);
    form.build();

    form.loadVideomail(VIDEOMAIL);
    await form.doTheSubmit();

    expect(submitAll).toHaveBeenCalledExactlyOnceWith(
      {
        subject: VIDEOMAIL.subject,
        videomail_key: VIDEOMAIL.key,
        videomail_parent_key: VIDEOMAIL.parentKey,
      },
      "put",
      options.apiUrl,
      false,
    );
  });

  it("round-trips replay values through custom field names without changing host fields", async () => {
    const { form, submitAll } = createFixture(
      `
        <input name="edit_subject">
        <textarea name="edit_body"></textarea>
        <input name="edit_from">
        <input name="edit_to">
        <input name="edit_cc">
        <input name="edit_bcc">
        <input type="hidden" name="edit_key" value="stale-video-key">
        <input type="hidden" name="edit_parent">
        <input name="phone" value="host value">
      `,
      {
        selectors: {
          subjectInputName: "edit_subject",
          bodyInputName: "edit_body",
          fromInputName: "edit_from",
          toInputName: "edit_to",
          ccInputName: "edit_cc",
          bccInputName: "edit_bcc",
          keyInputName: "edit_key",
          parentKeyInputName: "edit_parent",
        },
      },
    );
    form.build();

    form.loadVideomail(VIDEOMAIL);
    await form.doTheSubmit();

    const submission = submitAll.mock.calls[0];
    if (!submission) {
      throw new Error("Expected the replay form to submit.");
    }
    const [inputs, method] = submission;

    expect({
      method,
      key: inputs.edit_key,
      phone: inputs.phone,
      videomail: form.transformFormData(inputs),
    }).toEqual({
      method: "put",
      key: VIDEOMAIL.key,
      phone: "host value",
      videomail: {
        subject: VIDEOMAIL.subject,
        body: VIDEOMAIL.body,
        from: VIDEOMAIL.from,
        to: VIDEOMAIL.to,
        cc: VIDEOMAIL.cc,
        bcc: VIDEOMAIL.bcc,
        key: VIDEOMAIL.key,
        parentKey: VIDEOMAIL.parentKey,
      },
    });
  });

  it("passes the host field name and canonical value to the population callback", () => {
    const adjust = vi.fn((_name: string, value: unknown, _videomail: Videomail) =>
      String(value),
    );
    const { form } = createFixture(`<input name="edit_subject">`, {
      selectors: { subjectInputName: "edit_subject" },
      callbacks: { adjustFormValueBeforePopulating: adjust },
    });

    form.loadVideomail(VIDEOMAIL);

    expect(adjust).toHaveBeenCalledExactlyOnceWith(
      "edit_subject",
      VIDEOMAIL.subject,
      VIDEOMAIL,
    );
  });

  it("switches a loaded videomail form to PUT", () => {
    const { form, formElement } = createFixture();

    form.loadVideomail({} as Videomail);

    expect(formElement.getAttribute("method")).toBe("put");
  });

  describe("after a replay switched it to PUT", () => {
    // A replay switches the method; unloading must hand the host's markup back.
    function unloadReplayForm(formElement: HTMLFormElement) {
      const container = {} as unknown as Container;
      const form = new Form(container, formElement, mergeWithDefaultOptions());
      form.loadVideomail({} as Videomail);
      form.unload();
    }

    it("restores the host's method on unload", () => {
      const formElement = document.createElement("form");
      formElement.setAttribute("method", "post");

      unloadReplayForm(formElement);

      expect(formElement.getAttribute("method")).toBe("post");
    });

    it("leaves no method behind when the host had none", () => {
      const formElement = document.createElement("form");

      unloadReplayForm(formElement);

      expect(formElement.hasAttribute("method")).toBe(false);
    });
  });

  it("disables registered controls loaded from a videomail", () => {
    const { form, formElement } = createFixture(`<input name="subject">`);

    form.loadVideomail({ subject: "Hello" } as Videomail);

    expect(
      formElement.querySelector<HTMLInputElement>("[name='subject']")?.disabled,
    ).toBe(true);
  });

  it("disables non-button controls while leaving buttons enabled", () => {
    const { form, formElement } = createFixture(`
      <input name="subject">
      <button type="submit">Submit</button>
    `);

    form.disable(false);

    expect([
      formElement.querySelector<HTMLInputElement>("input")?.disabled,
      formElement.querySelector<HTMLButtonElement>("button")?.disabled,
    ]).toEqual([true, false]);
  });

  it("enables all controls when buttons are included", () => {
    const { form, formElement } = createFixture(`
      <input name="subject" disabled>
      <button type="submit" disabled>Submit</button>
    `);

    form.enable(true);

    expect(
      Array.from(formElement.elements).every(
        (element) => !element.hasAttribute("disabled"),
      ),
    ).toBe(true);
  });

  it("submits form data with the configured method and action", async () => {
    const { form, formElement, submitAll } = createFixture(
      `<input name="subject" value="Hello">`,
    );
    formElement.action = "https://example.test/send";
    formElement.method = "put";

    await form.doTheSubmit();

    expect(submitAll).toHaveBeenCalledWith(
      { subject: "Hello" },
      "put",
      "https://example.test/send",
      true,
    );
  });

  it("does not mark the API fallback as a host-form action", async () => {
    const { form, options, submitAll } = createFixture();

    await form.doTheSubmit();

    expect(submitAll).toHaveBeenCalledWith({}, "post", options.apiUrl, false);
  });

  it("returns false to prevent native submission", async () => {
    const { form } = createFixture();

    await expect(form.doTheSubmit()).resolves.toBe(false);
  });

  it("submits through a form submit event without a submit button", () => {
    const { form, formElement, submitAll } = createFixture();
    form.build();
    emit(form, "BUILT");

    formElement.dispatchEvent(
      new SubmitEvent("submit", { bubbles: true, cancelable: true }),
    );

    expect(submitAll).toHaveBeenCalledOnce();
  });

  describe("submit events", () => {
    afterEach(() => {
      document.body.replaceChildren();
    });

    it.each([
      ["submit button", `<button type="submit" id="send">Send</button>`],
      ["submit input", `<input type="submit" id="send" value="Send">`],
      ["default button", `<button id="send">Send</button>`],
      [
        "second submit button",
        `<button type="submit">First</button><button type="submit" id="send">Second</button>`,
      ],
    ])("intercepts a %s click", (_name, markup) => {
      const { formElement, submitAll } = buildFixture(markup);

      formElement.querySelector<HTMLElement>("#send")?.click();

      expect(submitAll).toHaveBeenCalledOnce();
    });

    it("intercepts requestSubmit without a submit control", () => {
      const { formElement, submitAll } = buildFixture();

      formElement.requestSubmit();

      expect(submitAll).toHaveBeenCalledOnce();
    });

    it("intercepts requestSubmit with another submit control", () => {
      const { formElement, submitAll } = buildFixture(
        `<button type="submit">First</button>`,
      );
      const otherButton = document.createElement("button");
      otherButton.type = "submit";
      formElement.appendChild(otherButton);

      formElement.requestSubmit(otherButton);

      expect(submitAll).toHaveBeenCalledOnce();
    });

    it("prevents native submission synchronously", () => {
      const { formElement } = buildFixture();
      const event = new SubmitEvent("submit", { bubbles: true, cancelable: true });

      expect(formElement.dispatchEvent(event)).toBe(false);
    });

    it("forwards the preview key and host action from a native submission", () => {
      const { form, formElement, submitAll } = buildFixture(
        `<input name="subject" value="Hello">`,
      );
      formElement.setAttribute("action", "/contact");
      emit(form, "PREVIEW", { key: "video-key" });

      formElement.requestSubmit();

      expect(submitAll).toHaveBeenCalledWith(
        { subject: "Hello", videomail_key: "video-key" },
        "post",
        "/contact",
        true,
      );
    });

    it("preserves existing host click and submit handlers", () => {
      const { form, formElement, submitAll } = createFixture();
      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      const hostClick = vi.fn();
      const hostSubmit = vi.fn();
      submitButton.onclick = hostClick;
      formElement.onsubmit = hostSubmit;
      formElement.appendChild(submitButton);
      document.body.appendChild(formElement);
      form.build();
      emit(form, "BUILT");

      submitButton.click();

      expect({
        hostClicks: hostClick.mock.calls.length,
        hostSubmits: hostSubmit.mock.calls.length,
        submissions: submitAll.mock.calls.length,
      }).toEqual({ hostClicks: 1, hostSubmits: 1, submissions: 1 });
    });

    it("leaves previously cancelled submit events to the host", () => {
      const { form, formElement, submitAll } = createFixture();
      formElement.onsubmit = (event) => {
        event.preventDefault();
      };
      form.build();
      emit(form, "BUILT");

      formElement.requestSubmit();

      expect(submitAll).not.toHaveBeenCalled();
    });

    it("preserves native validation before submission", () => {
      const { formElement, submitAll } = buildFixture(
        `<input name="from" type="email" required><button type="submit">Send</button>`,
      );

      formElement.querySelector<HTMLButtonElement>("button")?.click();

      expect(submitAll).not.toHaveBeenCalled();
    });

    it("cancels duplicate events while a submission is pending", async () => {
      const { formElement, submitAll } = buildFixture();
      const pendingSubmission = Promise.withResolvers<undefined>();
      submitAll.mockReturnValueOnce(pendingSubmission.promise);
      formElement.requestSubmit();
      const duplicateEvent = new SubmitEvent("submit", {
        bubbles: true,
        cancelable: true,
      });

      const nativeSubmissionAllowed = formElement.dispatchEvent(duplicateEvent);
      pendingSubmission.resolve(undefined);
      await pendingSubmission.promise;

      expect({
        nativeSubmissionAllowed,
        submissions: submitAll.mock.calls.length,
      }).toEqual({ nativeSubmissionAllowed: false, submissions: 1 });
    });

    it("guards manual submissions and form events with the same pending state", async () => {
      const { form, formElement, submitAll } = buildFixture();
      const pendingSubmission = Promise.withResolvers<undefined>();
      submitAll.mockReturnValueOnce(pendingSubmission.promise);
      const firstSubmission = form.doTheSubmit();

      formElement.requestSubmit();
      await form.doTheSubmit();
      pendingSubmission.resolve(undefined);
      await firstSubmission;

      expect(submitAll).toHaveBeenCalledOnce();
    });

    it("allows another submission after the pending request completes", async () => {
      const { form, formElement, submitAll } = buildFixture();
      await form.doTheSubmit();

      formElement.requestSubmit();

      expect(submitAll).toHaveBeenCalledTimes(2);
    });

    it("allows retrying after a rejected submission", async () => {
      const { form, submitAll } = buildFixture();
      submitAll.mockRejectedValueOnce(new Error("Submission failed"));
      await form.doTheSubmit().catch(() => undefined);

      await form.doTheSubmit();

      expect(submitAll).toHaveBeenCalledTimes(2);
    });

    it("does not register duplicate listeners when BUILT repeats", () => {
      const { form, formElement } = buildFixture();
      const submit = vi.spyOn(form, "doTheSubmit");
      emit(form, "BUILT");

      formElement.requestSubmit();

      expect(submit).toHaveBeenCalledOnce();
    });

    it("removes the client submit listener on unload", () => {
      const { form, formElement, submitAll } = buildFixture();
      form.unload();
      const event = new SubmitEvent("submit", { bubbles: true, cancelable: true });

      const nativeSubmissionAllowed = formElement.dispatchEvent(event);

      expect({
        nativeSubmissionAllowed,
        submissions: submitAll.mock.calls.length,
      }).toEqual({ nativeSubmissionAllowed: true, submissions: 0 });
    });

    it("preserves host click handlers on unload", () => {
      const { form, formElement } = buildFixture();
      const submitButton = document.createElement("button");
      const hostClick = vi.fn();
      submitButton.type = "submit";
      submitButton.onclick = hostClick;
      formElement.appendChild(submitButton);

      form.unload();

      expect(submitButton.onclick).toBe(hostClick);
    });

    it("listens again after unloading and rebuilding", () => {
      const { form, formElement, submitAll } = buildFixture();
      form.unload();
      form.build();
      emit(form, "BUILT");

      formElement.requestSubmit();

      expect(submitAll).toHaveBeenCalledOnce();
    });
  });

  it("returns the first invalid registered control", () => {
    const { form, formElement } = createFixture(
      `<input name="from" type="email" required>`,
    );

    expect(form.getInvalidElement()).toBe(formElement.querySelector("[name='from']"));
  });

  it("finds the form submit button", () => {
    const { form, formElement } = createFixture(`<button type="submit">Send</button>`);

    expect(form.findSubmitButton()).toBe(formElement.querySelector("button"));
  });

  it("hides and shows the form", () => {
    const { form, formElement } = createFixture();
    form.hide();
    const hiddenDisplay = formElement.style.display;

    form.show();

    expect([hiddenDisplay, formElement.style.display]).toEqual(["none", ""]);
  });
});
