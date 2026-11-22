type RecorderControl =
  "record" | "pause" | "resume" | "preview" | "recordAgain" | "audio";

type TakePhase =
  | "unready"
  | "idle"
  | "countdown"
  | "starting"
  | "recording"
  | "pausedCountdown"
  | "pausedTake"
  | "stopping"
  | "preview";

interface RecorderControlState {
  phase: TakePhase;
  shown: boolean;
  recordReady: boolean;
  audioReady: boolean;
  locked: boolean;
  previewLocked: boolean;
}

interface ControlPresentation {
  visible: boolean;
  enabled: boolean | undefined;
}

type RecorderControlView = Record<RecorderControl, ControlPresentation>;

const VISIBLE_ACTIONS: Record<TakePhase, readonly RecorderControl[]> = {
  unready: [],
  idle: ["record"],
  // Keep Record in place until the first frame so the form does not jump.
  countdown: ["record"],
  starting: ["record"],
  recording: ["pause", "preview"],
  pausedCountdown: ["resume"],
  pausedTake: ["resume", "preview"],
  stopping: ["preview"],
  preview: ["recordAgain"],
};

function getRecorderControlView(state: RecorderControlState): RecorderControlView {
  const { phase, shown, locked } = state;
  const isPaused = phase === "pausedCountdown" || phase === "pausedTake";

  function present(control: RecorderControl, enabled?: boolean): ControlPresentation {
    return {
      visible: shown && (control === "audio" || VISIBLE_ACTIONS[phase].includes(control)),
      enabled: locked ? false : enabled,
    };
  }

  return {
    record: present("record", phase === "idle" && state.recordReady),
    pause: present("pause", phase === "recording"),
    // Hiding Resume when continuing a take leaves its disabled attribute alone.
    resume: present("resume", isPaused ? true : undefined),
    preview: present("preview", phase === "recording" || phase === "pausedTake"),
    recordAgain: present("recordAgain", phase === "preview" && !state.previewLocked),
    audio: present("audio", phase === "idle" && state.audioReady),
  };
}

export type { RecorderControlState, RecorderControlView, TakePhase };
export default getRecorderControlView;
