import getFormData from "get-form-data";

import type {
  VideomailErrorParams,
  VideomailPreviewParams,
} from "../types/events/params";
import type { VideomailClientOptions } from "../types/options";
import type { PartialVideomail, Videomail } from "../types/Videomail";
import type { DespotEmitter } from "../util/Despot";
import Despot from "../util/Despot";
import createError from "../util/error/createError";
import getValidity from "../util/getValidity";
import getValidationEventType from "../util/html/getValidationEventType";
import hideElement from "../util/html/hideElement";
import isNotButton from "../util/html/isNotButton";
import restoreAttribute from "../util/html/restoreAttribute";
import showElement from "../util/html/showElement";
import pretty from "../util/string/pretty";
import type Container from "./container";
import getFormFieldMappings, {
  type FormFieldMappings,
} from "./form/getFormFieldMappings";
import getVideomailFieldName from "./form/getVideomailFieldName";
import populateFormFields from "./form/populateFormFields";
import transformFormFields, { type FormInputs } from "./form/transformFormFields";

export type { FormInputs } from "./form/transformFormFields";

export const FormMethod = {
  POST: "post",
  PUT: "put",
  GET: "get",
} as const;

export type FormMethodType = (typeof FormMethod)[keyof typeof FormMethod];

class Form extends Despot {
  private static nextFormId = 0;

  private readonly container: Container;
  private readonly formElement: HTMLFormElement;
  // The host's own method. Replays switch to PUT; resets must bring this back.
  private readonly originalMethod: string | null;
  private keyInput?: HTMLInputElement | null;
  private submitButton: HTMLButtonElement | undefined;
  private submitButtonFormAttribute: string | null = null;
  private generatedFormId: string | undefined;
  private isSubmitting = false;
  // Each control's own disabled attribute, so a failed submission can put it back.
  private readonly submissionDisabledStates = new Map<Element, string | null>();

  private readonly fieldMappings: FormFieldMappings;

  constructor(
    container: Container,
    formElement: HTMLFormElement,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("Form", options, emitter);

    this.container = container;
    this.formElement = formElement;
    this.originalMethod = formElement.getAttribute("method");

    // Share one mapping across validation, replay and submission so renamed fields round-trip.
    this.fieldMappings = getFormFieldMappings(options.selectors);
  }

  private readonly validate = (event: Event) => {
    this.container.validate(event);
  };

  private readonly handleSubmit = (event: SubmitEvent) => {
    if (!event.defaultPrevented) {
      void this.doTheSubmit(event);
    }
  };

  private getData() {
    return getFormData(this.formElement, { includeDisabled: true }) as FormInputs;
  }

  public transformFormData(formInputs: FormInputs) {
    return transformFormFields(formInputs, this.fieldMappings);
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
    populateFormFields(this.formElement, videomail, this.fieldMappings, this.options);
    // The next submission updates this video instead of creating another.
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

  private getRegisteredFormElements() {
    const elements = this.formElement.querySelectorAll("input, textarea, select");
    const registeredElements: Element[] = [];

    for (const element of elements) {
      if (getVideomailFieldName(element.getAttribute("name"), this.fieldMappings)) {
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

  public disableForSubmission() {
    // Remember existing locks so a failed request only unlocks controls we locked.
    for (const formControl of this.formElement.elements) {
      this.submissionDisabledStates.set(
        formControl,
        formControl.getAttribute("disabled"),
      );
      formControl.setAttribute("disabled", "disabled");
    }
  }

  public restoreAfterFailedSubmission() {
    for (const [formControl, disabled] of this.submissionDisabledStates) {
      restoreAttribute(formControl, "disabled", disabled);
    }

    this.submissionDisabledStates.clear();
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

      for (const inputElement of inputElements) {
        inputElement.addEventListener(
          getValidationEventType(inputElement),
          this.validate,
        );
      }
    }

    this.on("PREVIEW", (params?: VideomailPreviewParams) => {
      // Showing an existing replay can emit PREVIEW without a key.
      // Keep the input's existing key; report an error only if both are missing.
      if (!params?.key && !this.keyInput?.value) {
        const err = createError({
          message: "Videomail key and its value for previewing is missing",
          options: this.options,
        });

        this.emit("ERROR", { err });
      } else if (params?.key && this.keyInput) {
        this.keyInput.value = params.key;

        // Let the host app know the value changed.
        this.keyInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      }
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

    this.on("ERROR", (params: VideomailErrorParams) => {
      const isBrowserProblem = params.err?.isBrowserProblem();
      // Hide unusable inputs so users can focus on the error (#60).
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
      inputElement.removeEventListener(
        getValidationEventType(inputElement),
        this.validate,
      );
    }
  }

  private hideSubmitButton() {
    const submitButton = this.findSubmitButton();
    hideElement(submitButton);
  }

  public unload() {
    this.options.logger.debug("Form: unload()");

    this.removeAllInputListeners();

    this.removeAllListeners();
    this.stopListeningToSubmitEvents();

    this.resetForm();
  }

  private resetForm() {
    // Undo a replay's PUT without wiping the host's method. A blank method would
    // turn a later native submission into a GET, so a missing one stays missing.
    restoreAttribute(this.formElement, "method", this.originalMethod);

    // This resets all except hidden inputs
    this.formElement.reset();

    const inputElements = this.getRegisteredFormElements();

    for (const inputElement of inputElements) {
      const type = inputElement.getAttribute("type");

      if (type?.toLowerCase() === "hidden") {
        (inputElement as HTMLInputElement).value = "";
      }
    }
  }

  private connectSubmitButton() {
    const submitButton = this.container.getSubmitButton();

    if (!submitButton) {
      return;
    }

    if (submitButton.form === this.formElement) {
      return;
    }

    if (!this.formElement.id) {
      let formId: string;

      do {
        formId = `videomail-form-${Form.nextFormId++}`;
      } while (document.getElementById(formId));

      this.formElement.id = formId;
      this.generatedFormId = formId;
    }

    this.submitButton = submitButton;
    this.submitButtonFormAttribute = submitButton.getAttribute("form");
    submitButton.setAttribute("form", this.formElement.id);
  }

  private startListeningToSubmitEvents() {
    this.connectSubmitButton();
    this.formElement.addEventListener("submit", this.handleSubmit);
  }

  private stopListeningToSubmitEvents() {
    this.formElement.removeEventListener("submit", this.handleSubmit);

    if (this.submitButton) {
      restoreAttribute(this.submitButton, "form", this.submitButtonFormAttribute);

      this.submitButton = undefined;
      this.submitButtonFormAttribute = null;
    }

    if (this.generatedFormId === this.formElement.id) {
      this.formElement.removeAttribute("id");
    }

    this.generatedFormId = undefined;
  }

  public async doTheSubmit(e?: Event) {
    if (e) {
      this.options.logger.debug(`Form: doTheSubmit(${pretty(e)})`);
      e.preventDefault();
    } else {
      this.options.logger.debug("Form: doTheSubmit()");
    }

    if (this.isSubmitting) {
      return false;
    }

    const hasHostAction = this.formElement.hasAttribute("action");
    const url = this.formElement.getAttribute("action") ?? this.options.apiUrl;
    const method = this.formElement.getAttribute("method");

    // Only a replay's PUT updates a video. Anything else creates one.
    const chosenMethod = method === FormMethod.PUT ? FormMethod.PUT : FormMethod.POST;

    if (this.container.hasElement()) {
      this.isSubmitting = true;

      try {
        await this.container.submitAll(this.getData(), chosenMethod, url, hasHostAction);
      } finally {
        this.isSubmitting = false;
      }
    }

    // important to stop submission
    return false;
  }

  public getInvalidElement() {
    const elements = this.getRegisteredFormElements();

    for (const element of elements) {
      const validity = getValidity(element);

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
