import type { Videomail } from "../../types/Videomail";
import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import type Container from "../container";
import Form from "../form";

function createFixture(formMarkup = "") {
  const formElement = document.createElement("form");
  formElement.innerHTML = formMarkup;
  const submitButton = formElement.querySelector<HTMLButtonElement>("[type='submit']");
  const submitAll = vi.fn(() => Promise.resolve());
  const validate = vi.fn();
  const container = {
    getSubmitButton: vi.fn(() => submitButton ?? undefined),
    hasElement: vi.fn(() => true),
    submitAll,
    validate,
  } as unknown as Container;
  const options = mergeWithDefaultOptions();
  const form = new Form(container, formElement, options);

  return { container, form, formElement, options, submitAll, validate };
}

function emit(form: Form, eventName: string, params?) {
  const emitter = form as unknown as {
    emit: (name: string, eventParams?: unknown) => void;
  };
  emitter.emit(eventName, params);
}

describe("Form", () => {
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

  it("switches a loaded videomail form to PUT", () => {
    const { form, formElement } = createFixture();

    form.loadVideomail({} as Videomail);

    expect(formElement.getAttribute("method")).toBe("put");
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
    );
  });

  it("returns false to prevent native submission", async () => {
    const { form } = createFixture();

    await expect(form.doTheSubmit()).resolves.toBe(false);
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
