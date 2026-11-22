import type { VideomailInvalidParams } from "../../types/events/params";

interface ValidationGate {
  built: boolean;
  autoValidate: boolean;
  forced: boolean;
  notifying: boolean;
  connected: boolean;
  connecting: boolean;
  cameraLoaded: boolean | undefined;
  replayShown: boolean;
}

interface ValidationFacts {
  videoValid: boolean;
  videoRequired: boolean;
  form?:
    | {
        invalidInput?: {
          name: string | null;
          value: string | null;
          missing: boolean;
        };
        recipientsValid: boolean;
      }
    | undefined;
}

type ValidationResult =
  { status: "valid" } | ({ status: "invalid" } & VideomailInvalidParams);

function getValidationSkip(gate: ValidationGate) {
  if (!gate.built || !gate.autoValidate) {
    return { allowManualSubmit: gate.built && !gate.autoValidate };
  }

  if (gate.forced) {
    return undefined;
  }

  // A completed replay is usable even if the live camera was explicitly released.
  const waitingForMedia = gate.connected && !gate.cameraLoaded && !gate.replayShown;
  if (gate.notifying || waitingForMedia || (!gate.connected && gate.connecting)) {
    return { allowManualSubmit: false };
  }

  return undefined;
}

function evaluateValidation({
  form,
  videoValid,
  videoRequired,
}: ValidationFacts): ValidationResult {
  if (!form) {
    return videoValid
      ? { status: "valid" }
      : { status: "invalid", whyInvalid: "Because visuals aren't valid" };
  }

  const input = form.invalidInput;
  if (input) {
    if (!input.name) {
      return { status: "invalid" };
    }

    return input.missing
      ? { status: "invalid", whyInvalid: `Please fill out field "${input.name}" ⚠️` }
      : {
          status: "invalid",
          whyInvalid: `Input "${input.name}" seems wrong 🤔`,
          invalidData: { [input.name]: input.value },
        };
  }

  if (videoRequired && !videoValid) {
    return {
      status: "invalid",
      whyInvalid: "Don't forget to record a video 😉",
      invalidData: { key: undefined },
    };
  }

  return form.recipientsValid
    ? { status: "valid" }
    : { status: "invalid", whyInvalid: "At least one recipient is required" };
}

export { evaluateValidation, getValidationSkip };
