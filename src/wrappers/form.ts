import getFormData from "get-form-data";
import hidden from "hidden";
import h from "hyperscript";

import Despot from "../util/Despot";
import Container from "./container";
import { VideomailClientOptions } from "../types/options";
import createError from "../util/error/createError";
import { trimEmail, trimEmails } from "../util/trimEmail";
import { PartialVideomail } from "../types/Videomail";
import { ErrorParams, PreviewParams } from "../types/events";
import pretty from "../util/pretty";

export type FormInputs = Record<string, any>;

class Form extends Despot {
  private container: Container;
  private formElement: HTMLFormElement;

  private keyInput;

  private readonly FORM_FIELDS = {};

  constructor(
    container: Container,
    formElement: HTMLFormElement,
    options: VideomailClientOptions,
  ) {
    super("Form", options);

    this.container = container;
    this.formElement = formElement;

    this.FORM_FIELDS = {
      subject: options.selectors.subjectInputName,
      from: options.selectors.fromInputName,
      to: options.selectors.toInputName,
      cc: options.selectors.ccInputName,
      bcc: options.selectors.bccInputName,
      body: options.selectors.bodyInputName,
      key: options.selectors.keyInputName,
      parentKey: options.selectors.parentKeyInputName,
      sendCopy: options.selectors.sendCopyInputName,
    };
  }

  private getData() {
    return getFormData(this.formElement, { includeDisabled: true });
  }

  public transformFormData(videomail: PartialVideomail) {
    const transformedVideomail: PartialVideomail = {};

    Object.keys(this.FORM_FIELDS).forEach((key) => {
      const formFieldValue = this.FORM_FIELDS[key];

      if (formFieldValue in videomail) {
        const value = videomail[formFieldValue];

        if (value === undefined) {
          // skip
        } else {
          transformedVideomail[key] = value;
        }
      }
    });

    if (transformedVideomail.from) {
      transformedVideomail.from = trimEmail(transformedVideomail.from);
    }

    if (transformedVideomail.to) {
      transformedVideomail.to = trimEmails(transformedVideomail.to);
    }

    if (transformedVideomail.cc) {
      transformedVideomail.cc = trimEmails(transformedVideomail.cc);
    }

    if (transformedVideomail.bcc) {
      transformedVideomail.bcc = trimEmails(transformedVideomail.bcc);
    }

    return transformedVideomail;
  }

  public getRecipients() {
    const videomail = this.transformFormData(this.getData());

    const recipients: PartialVideomail = {};

    if (videomail.to) {
      recipients.to = videomail.to;
    }

    if (videomail.cc) {
      recipients.cc = videomail.cc;
    }

    if (videomail.bcc) {
      recipients.bcc = videomail.bcc;
    }

    return recipients;
  }

  public loadVideomail(videomail: PartialVideomail) {
    this.options.logger.debug("Form: loadVideomail()");

    const limit = this.formElement.elements.length;

    let input: HTMLObjectElement | undefined;

    for (let i = 0; i < limit; i++) {
      input = this.getFormElementAt(i);
      const name = input?.name;

      if (name && videomail[name] && input) {
        input.setAttribute("value", videomail[name]);
      }

      if (
        name === this.options.selectors.subjectInputName ||
        name === this.options.selectors.bodyInputName
      ) {
        input?.setAttribute("disabled", "disabled");
      }
    }

    this.formElement.setAttribute("method", "put");
  }

  private getFormElementAt(i) {
    if (this.formElement.elements[i]) {
      return this.formElement.elements[i] as HTMLObjectElement;
    }

    return undefined;
  }

  private isNotButton(element: HTMLObjectElement) {
    return element.tagName !== "BUTTON" && element.getAttribute("type") !== "submit";
  }

  private setDisabled(disabled: boolean, buttonsToo: boolean) {
    const limit = this.formElement.elements.length;

    for (let i = 0; i < limit; i++) {
      const element = this.getFormElementAt(i);

      if (buttonsToo || (element && this.isNotButton(element))) {
        if (disabled) {
          element?.setAttribute("disabled", "disabled");
        } else {
          element?.removeAttribute("disabled");
        }
      }
    }
  }

  private hideAll() {
    const limit = this.formElement.elements.length;

    for (let i = 0; i < limit; i++) {
      hidden(this.formElement.elements[i], true);
    }

    hidden(this.formElement, true);
  }

  private isRegisteredFormField(formElement: HTMLObjectElement) {
    const formElementName = formElement.getAttribute("name");

    const registeredFormFieldNames = Object.values(this.FORM_FIELDS);
    const isRegistered = registeredFormFieldNames.includes(formElementName);

    return isRegistered;
  }

  private getRegisteredFormElements() {
    const elements: NodeListOf<HTMLObjectElement> = this.formElement.querySelectorAll(
      "input, textarea, select",
    );
    const registeredElements: HTMLObjectElement[] = [];

    for (const element of elements) {
      if (this.isRegisteredFormField(element)) {
        registeredElements.push(element);
      }
    }

    return registeredElements;
  }

  public disable(buttonsToo: boolean) {
    this.setDisabled(true, buttonsToo);
  }

  public enable(buttonsToo: boolean) {
    this.setDisabled(false, buttonsToo);
  }

  public build() {
    this.options.logger.debug("Form: build()");

    this.keyInput = this.formElement.querySelector(
      `input[name="${this.options.selectors.keyInputName}"]`,
    );

    if (!this.keyInput) {
      this.keyInput = h("input", {
        name: this.options.selectors.keyInputName,
        type: "hidden",
      });

      this.formElement.appendChild(this.keyInput);
    }

    if (this.options.enableAutoValidation) {
      const inputElements = this.getRegisteredFormElements();

      for (let i = 0, len = inputElements.length; i < len; i++) {
        const inputElement = inputElements[i];
        const type = inputElement?.getAttribute("type");

        if (type === "radio" || type === "select") {
          inputElement?.addEventListener(
            "change",
            this.container.validate.bind(this.container),
          );
        } else {
          inputElement?.addEventListener(
            "input",
            this.container.validate.bind(this.container),
          );
        }
      }
    }

    this.on("PREVIEW", (params?: PreviewParams) => {
      /*
       * beware that preview doesn't always come with a key, i.E.
       * container.show() can emit PREVIEW without a key when a replay already exists
       * (can happen when showing - hiding - showing videomail over again)
       */

      // only emit error if key is missing AND the input has no key (value) yet
      if (!params?.key && !this.keyInput.value) {
        const err = createError({
          message: "Videomail key for preview is missing!",
          options: this.options,
        });
        this.emit("ERROR", { err });
      } else if (params?.key) {
        this.keyInput.value = params.key;

        // Important so that any other JS framework can detect changes
        this.keyInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      /*
       * else leave as it and use existing keyInput.value
       */
    });

    this.on("STARTING_OVER", () => {
      this.resetForm();
    });

    this.on("INVALID", () => {
      this.formElement.classList.add("invalid");
    });

    this.on("VALID", () => {
      this.formElement.classList.remove("invalid");
    });

    this.on("ERROR", (params: ErrorParams) => {
      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user to process an error
       * (= less distractions)
       */
      if (this.options.adjustFormOnBrowserError) {
        this.hideAll();
      } else if (params.err?.isBrowserProblem()) {
        this.hideSubmitButton();
      }
    });

    this.on("BUILT", () => {
      this.startListeningToSubmitEvents();
    });
  }

  private removeAllInputListeners() {
    const inputElements = this.getRegisteredFormElements();

    for (const inputElement of inputElements) {
      const type = inputElement.getAttribute("type");

      if (type === "radio" || type === "select") {
        inputElement.removeEventListener(
          "change",
          this.container.validate.bind(this.container),
        );
      } else {
        inputElement.removeEventListener(
          "input",
          this.container.validate.bind(this.container),
        );
      }
    }
  }

  private hideSubmitButton() {
    const submitButton = this.findSubmitButton();
    hidden(submitButton, true);
  }

  public unload() {
    this.options.logger.debug("Form: unload()");

    this.removeAllInputListeners();

    this.removeAllListeners();
    this.stopListeningToSubmitEvents();

    this.resetForm();
  }

  private resetForm() {
    // It can be set to put before when e.g. correcting, so revert to default
    this.formElement.setAttribute("method", "");

    // This resets all except hidden inputs
    this.formElement.reset();

    const inputElements = this.getRegisteredFormElements();

    for (const inputElement of inputElements) {
      const type = inputElement.getAttribute("type");

      if (type?.toLowerCase() === "hidden") {
        inputElement.setAttribute("value", "");
      }
    }
  }

  private startListeningToSubmitEvents() {
    const submitButton = this.container.getSubmitButton();

    if (submitButton) {
      submitButton.onclick = this.doTheSubmit.bind(this);
    }
  }

  private stopListeningToSubmitEvents() {
    const submitButton = this.container.getSubmitButton();

    if (submitButton) {
      submitButton.onclick = null;
    }
  }

  public doTheSubmit(e?) {
    if (e) {
      this.options.logger.debug(`Form: doTheSubmit(${pretty(e)})`);
      e.preventDefault();
    } else {
      this.options.logger.debug("Form: doTheSubmit()");
    }

    /*
     * only submit when there is a container,
     * otherwise do nothing and leave as it
     */
    if (this.container.hasElement()) {
      this.container.submitAll(
        this.getData(),
        this.formElement.getAttribute("method"),
        this.formElement.getAttribute("action"),
      );
    }

    return false; // important to stop submission
  }

  public getInvalidElement() {
    const inputElements = this.getRegisteredFormElements();

    for (const inputElement of inputElements) {
      if (!inputElement.validity.valid) {
        return inputElement;
      }
    }

    return null;
  }

  public findSubmitButton() {
    return this.formElement.querySelector("[type='submit']");
  }

  public hide() {
    hidden(this.formElement, true);
  }

  public show() {
    hidden(this.formElement, false);
  }
}

export default Form;
