import getFormData from "get-form-data";

import { ErrorParams, PreviewParams } from "../types/events";
import { VideomailClientOptions } from "../types/options";
import type { PartialVideomail, Videomail } from "../types/Videomail";
import Despot from "../util/Despot";
import createError from "../util/error/createError";
import hideElement from "../util/html/hideElement";
import isNotButton from "../util/html/isNotButton";
import showElement from "../util/html/showElement";
import pretty from "../util/pretty";
import { trimEmail, trimEmails } from "../util/trimEmail";
import Container from "./container";

export type FormInputs = Record<string, string>;

export enum FormMethod {
  POST = "post",
  PUT = "put",
  GET = "get",
}

class Form extends Despot {
  private readonly container: Container;
  private readonly formElement: HTMLFormElement;

  private keyInput?: HTMLInputElement | null;

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
    return getFormData(this.formElement, { includeDisabled: true }) as FormInputs;
  }

  public transformFormData(formInputs: FormInputs) {
    const transformedVideomail: PartialVideomail = {};

    Object.keys(this.FORM_FIELDS).forEach((key) => {
      const formFieldValue = this.FORM_FIELDS[key];

      if (formFieldValue in formInputs) {
        const value = formInputs[formFieldValue];

        if (value !== undefined) {
          switch (key) {
            case "from":
              transformedVideomail[key] = trimEmail(value);
              break;
            case "to":
            case "cc":
            case "bcc":
              transformedVideomail[key] = trimEmails(value);
              break;
            default:
              transformedVideomail[key] = value;
          }
        }
      }
    });

    return transformedVideomail;
  }

  public getRecipients() {
    const partialVideomail = this.getData();
    const videomail = this.transformFormData(partialVideomail);

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

  public loadVideomail(videomail: Videomail) {
    this.options.logger.debug("Form: loadVideomail()");

    for (const formControl of this.formElement.elements) {
      const name = formControl.getAttribute("name");

      if (name) {
        const value = videomail[name];
        const tagName = formControl.tagName;

        switch (tagName) {
          case "INPUT": {
            const inputControl = formControl as HTMLInputElement;

            if (Array.isArray(value)) {
              inputControl.value = value.join(", ");
            } else {
              inputControl.value = value;
            }
            break;
          }
          case "TEXTAREA": {
            const textArea = formControl as HTMLTextAreaElement;
            textArea.value = value;
            break;
          }
          default:
            throw createError({
              message: `Unsupported form control tag name $${tagName} found`,
              options: this.options,
            });
        }

        // Always disable them, they can't be changed
        if (
          name === this.options.selectors.toInputName ||
          name === this.options.selectors.subjectInputName ||
          name === this.options.selectors.bodyInputName
        ) {
          formControl.setAttribute("disabled", "disabled");
        }
      }
    }

    this.formElement.setAttribute("method", FormMethod.PUT);
  }

  private setDisabled(disabled: boolean, buttonsToo: boolean) {
    for (const formControl of this.formElement.elements) {
      if (buttonsToo || isNotButton(formControl)) {
        if (disabled) {
          formControl.setAttribute("disabled", "disabled");
        } else {
          formControl.removeAttribute("disabled");
        }
      }
    }
  }

  private hideAll() {
    for (const formElement of this.formElement.elements) {
      hideElement(formElement as HTMLElement);
    }

    // Just do not hide the form itself when it act as a container
    if (!this.formElement.classList.contains(this.options.selectors.containerClass)) {
      hideElement(this.formElement);
    }
  }

  private isRegisteredFormField(formElement: Element) {
    const formElementName = formElement.getAttribute("name");

    const registeredFormFieldNames = Object.values(this.FORM_FIELDS);
    const isRegistered = registeredFormFieldNames.includes(formElementName);

    return isRegistered;
  }

  private getRegisteredFormElements() {
    const elements = this.formElement.querySelectorAll("input, textarea, select");
    const registeredElements: Element[] = [];

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
      this.keyInput = document.createElement("input");
      this.keyInput.type = "hidden";
      this.keyInput.name = this.options.selectors.keyInputName;

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
      if (!params?.key && !this.keyInput?.value) {
        const err = createError({
          message: "Videomail key for preview is missing!",
          options: this.options,
        });
        this.emit("ERROR", { err });
      } else if (params?.key && this.keyInput) {
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
      const isBrowserProblem = params.err?.isBrowserProblem();
      /*
       * Since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user to process an error
       * (= less distractions)
       */
      if (isBrowserProblem && this.options.adjustFormOnBrowserError) {
        this.hideAll();
      }

      if (isBrowserProblem) {
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
    hideElement(submitButton);
  }

  public unload() {
    this.options.logger.debug("Form: unload()");

    this.removeAllInputListeners();

    Despot.removeAllListeners();
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

  public async doTheSubmit(e?) {
    if (e) {
      this.options.logger.debug(`Form: doTheSubmit(${pretty(e)})`);
      e.preventDefault();
    } else {
      this.options.logger.debug("Form: doTheSubmit()");
    }

    const url = this.formElement.getAttribute("action") ?? this.options.baseUrl;
    const method = this.formElement.getAttribute("method");

    let chosenMethod: FormMethod;

    switch (method) {
      case FormMethod.POST:
        chosenMethod = FormMethod.POST;
        break;
      case FormMethod.PUT:
        chosenMethod = FormMethod.PUT;
        break;
      default:
        chosenMethod = FormMethod.POST;
    }

    if (this.container.hasElement()) {
      await this.container.submitAll(this.getData(), chosenMethod, url);
    }

    // important to stop submission
    return false;
  }

  public getInvalidElement() {
    const elements = this.getRegisteredFormElements();

    for (const element of elements) {
      const validity =
        "validity" in element ? (element.validity as ValidityState) : undefined;

      if (!validity?.valid) {
        return element;
      }
    }

    return null;
  }

  public findSubmitButton(): HTMLButtonElement | null {
    return this.formElement.querySelector("[type='submit']");
  }

  public hide() {
    hideElement(this.formElement);
  }

  public show() {
    showElement(this.formElement);
  }
}

export default Form;
