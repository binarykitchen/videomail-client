import getFormData from "get-form-data";
import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";

import stringify from "safe-json-stringify";
import Events from "../events";
import EventEmitter from "../util/eventEmitter";
import VideomailError from "../util/videomailError";

// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email) {
  return email.replace(/(^[,\s]+)|([,\s]+$)/g, "");
}

const Form = function (container, formElement, options) {
  EventEmitter.call(this, options, "Form");

  const { debug } = options;

  const self = this;

  const FORM_FIELDS = {
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

  let keyInput;

  function getData() {
    return getFormData(formElement, { includeDisabled: true });
  }

  this.transformFormData = function (formData) {
    const transformedFormData = {};

    Object.keys(FORM_FIELDS).forEach(function (key) {
      const formFieldValue = FORM_FIELDS[key];

      if (formFieldValue in formData) {
        const value = formData[formFieldValue];

        if (value === undefined) {
          // skip
        } else {
          transformedFormData[key] = value;
        }
      }
    });

    if (transformedFormData.from) {
      transformedFormData.from = trimEmail(transformedFormData.from);
    }

    if (transformedFormData.to) {
      transformedFormData.to = trimEmail(transformedFormData.to);
    }

    if (transformedFormData.cc) {
      transformedFormData.cc = trimEmail(transformedFormData.cc);
    }

    if (transformedFormData.bcc) {
      transformedFormData.bcc = trimEmail(transformedFormData.bcc);
    }

    return transformedFormData;
  };

  this.getRecipients = function () {
    const videomailFormData = this.transformFormData(getData());

    const recipients = {};

    if ("to" in videomailFormData) {
      recipients.to = videomailFormData.to;
    }

    if ("cc" in videomailFormData) {
      recipients.cc = videomailFormData.cc;
    }

    if ("bcc" in videomailFormData) {
      recipients.bcc = videomailFormData.bcc;
    }

    return recipients;
  };

  this.loadVideomail = function (videomail) {
    debug("Form: loadVideomail()");

    const limit = formElement.elements.length;

    let input;
    let name;

    for (let i = 0; i < limit; i++) {
      input = formElement.elements[i];
      name = input.name;

      if (videomail[name]) {
        input.value = videomail[name];
      }

      if (
        name === options.selectors.subjectInputName ||
        name === options.selectors.bodyInputName
      ) {
        input.disabled = true;
      }
    }

    formElement.setAttribute("method", "put");
  };

  function isNotButton(element) {
    return element.tagName !== "BUTTON" && element.type !== "submit";
  }

  function setDisabled(disabled, buttonsToo) {
    const limit = formElement.elements.length;

    for (let i = 0; i < limit; i++) {
      if (buttonsToo || (!buttonsToo && isNotButton(formElement.elements[i]))) {
        formElement.elements[i].disabled = disabled;
      }
    }
  }

  function hideAll() {
    const limit = formElement.elements.length;

    for (let i = 0; i < limit; i++) {
      hidden(formElement.elements[i], true);
    }

    hidden(formElement, true);
  }

  function isRegisteredFormField(formElement) {
    const formElementName = formElement.name;

    const registeredFormFieldNames = Object.values(FORM_FIELDS);
    const isRegistered = registeredFormFieldNames.includes(formElementName);

    return isRegistered;
  }

  function getRegisteredFormElements() {
    const elements = formElement.querySelectorAll("input, textarea, select");
    const registeredElements = [];

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      if (isRegisteredFormField(element)) {
        registeredElements.push(element);
      }
    }

    return registeredElements;
  }

  this.disable = function (buttonsToo) {
    setDisabled(true, buttonsToo);
  };

  this.enable = function (buttonsToo) {
    setDisabled(false, buttonsToo);
  };

  this.build = function () {
    debug("Form: build()");

    keyInput = formElement.querySelector(
      `input[name="${options.selectors.keyInputName}"]`,
    );

    if (!keyInput) {
      keyInput = h("input", {
        name: options.selectors.keyInputName,
        type: "hidden",
      });

      formElement.appendChild(keyInput);
    }

    if (options.enableAutoValidation) {
      const inputElements = getRegisteredFormElements();

      for (let i = 0, len = inputElements.length; i < len; i++) {
        const inputElement = inputElements[i];
        const type = inputElement.type;

        if (type === "radio" || type === "select") {
          inputElement.addEventListener("change", container.validate);
        } else {
          inputElement.addEventListener("input", container.validate);
        }
      }
    }

    this.on(Events.PREVIEW, function (videomailKey) {
      /*
       * beware that preview doesn't always come with a key, i.E.
       * container.show() can emit PREVIEW without a key when a replay already exists
       * (can happen when showing - hiding - showing videomail over again)
       */

      // only emit error if key is missing AND the input has no key (value) yet
      if (!videomailKey && !keyInput.value) {
        self.emit(
          Events.ERROR,
          VideomailError.create("Videomail key for preview is missing!", options),
        );
      } else if (videomailKey) {
        keyInput.value = videomailKey;
        // Important so that any other JS framework can detect changes
        keyInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      /*
       * else leave as it and use existing keyInput.value
       */
    });

    this.on(Events.STARTING_OVER, () => {
      resetForm();
    });

    this.on(Events.INVALID, () => {
      formElement.classList.add("invalid");
    });

    this.on(Events.VALID, () => {
      formElement.classList.remove("invalid");
    });

    this.on(Events.ERROR, function (err) {
      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user to process an error
       * (= less distractions)
       */
      if (err.hideForm && err.hideForm() && options.adjustFormOnBrowserError) {
        hideAll();
      } else if (
        err.hideButtons &&
        err.hideButtons() &&
        options.adjustFormOnBrowserError
      ) {
        hideSubmitButton();
      }
    });

    this.on(Events.BUILT, function () {
      startListeningToSubmitEvents();
    });
  };

  function removeAllInputListeners() {
    const inputElements = getRegisteredFormElements();

    for (let i = 0, len = inputElements.length; i < len; i++) {
      const inputElement = inputElements[i];
      const type = inputElement.type;

      if (type === "radio" || type === "select") {
        inputElement.removeEventListener("change", container.validate);
      } else {
        inputElement.removeEventListener("input", container.validate);
      }
    }
  }

  function hideSubmitButton() {
    const submitButton = self.findSubmitButton();
    hidden(submitButton, true);
  }

  this.unload = function () {
    debug("Form: unload()");

    removeAllInputListeners();

    this.removeAllListeners();
    stopListeningToSubmitEvents();

    resetForm();
  };

  function resetForm() {
    // It can be set to put before when e.g. correcting, so revert to default
    formElement.setAttribute("method", "");

    // This resets all except hidden inputs
    formElement.reset();

    const inputElements = getRegisteredFormElements();

    for (let i = 0, len = inputElements.length; i < len; i++) {
      const inputElement = inputElements[i];
      const type = inputElement.type.toLowerCase();

      if (type === "hidden") {
        inputElement.value = "";
      }
    }
  }

  function startListeningToSubmitEvents() {
    const submitButton = container.getSubmitButton();
    submitButton.onclick = self.doTheSubmit.bind(self);
  }

  function stopListeningToSubmitEvents() {
    const submitButton = container.getSubmitButton();
    submitButton.onclick = null;
  }

  this.doTheSubmit = (e) => {
    if (e) {
      debug(`Form: doTheSubmit(${stringify(e)})`);
      e.preventDefault();
    } else {
      debug("Form: doTheSubmit()");
    }

    /*
     * only submit when there is a container,
     * otherwise do nothing and leave as it
     */
    if (container.hasElement()) {
      container.submitAll(
        getData(),
        formElement.getAttribute("method"),
        formElement.getAttribute("action"),
      );
    }

    return false; // important to stop submission
  };

  this.getInvalidElement = () => {
    const inputElements = getRegisteredFormElements();
    let i = 0;

    for (const len = inputElements.length; i < len; i++) {
      if (!inputElements[i].validity.valid) {
        return inputElements[i];
      }
    }

    return null;
  };

  this.findSubmitButton = function () {
    return formElement.querySelector("[type='submit']");
  };

  this.hide = function () {
    formElement && hidden(formElement, true);
  };

  this.show = function () {
    formElement && hidden(formElement, false);
  };
};

inherits(Form, EventEmitter);

export default Form;
