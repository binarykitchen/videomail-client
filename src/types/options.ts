export interface VideomailClientOptions {
  logger: any;
  logStackSize: number;
  verbose: boolean;
  baseUrl: string;
  socketUrl: string;
  siteName: string;
  enablePause: boolean;
  enableAutoPause: boolean;
  enableSpace: boolean;
  submitWithVideomail: boolean;
  disableSubmit: boolean;
  enableAutoValidation: boolean;
  enableAutoUnload: boolean;
  enableAutoSubmission: boolean;
  enctype: string;

  selectors: {
    containerId?: string | undefined;
    containerClass: string;
    replayClass: string;
    userMediaClass: string;
    visualsClass: string;
    buttonClass?: string | undefined;
    buttonsClass: string;

    recordButtonClass: string;
    pauseButtonClass: string;
    resumeButtonClass: string;
    previewButtonClass: string;
    recordAgainButtonClass: string;
    submitButtonClass: string;

    subjectInputName: string;
    fromInputName: string;
    toInputName: string;
    ccInputName: string;
    bccInputName: string;
    bodyInputName: string;
    sendCopyInputName: string;

    keyInputName: string;
    parentKeyInputName: string;

    formId?: string | undefined;
    submitButtonId?: string | undefined;
    submitButtonSelector?: string | undefined;
  };

  audio: {
    enabled: boolean;
    switch: boolean;
    volume: number;
    bufferSize: string;
  };

  video: {
    fps: number;
    limitSeconds?: number;
    countdown: number | boolean;

    width: string | number;
    height: string | number;
    facingMode: string;
    facingModeButton: boolean;

    stretch: boolean;
  };

  image: {
    quality: number;
    types: string[];
  };

  text: {
    pausedHeader: string;
    pausedHint?: string | undefined;
    sending: string;
    encoding: string;
    limitReached: string;
    audioOff: string;
    audioOn: string;
    buttons: {
      record: string;
      recordAgain: string;
      resume: string;
      pause: string;
      preview: string;
    };
  };

  notifier: {
    entertain: boolean;
    entertainClass: string;
    entertainLimit: number;
    entertainInterval: number;
  };

  timeouts: {
    userMedia: number;
    connection: number;
    pingInterval: number;
  };

  loadUserMediaOnRecord: boolean;

  callbacks: {
    adjustFormDataBeforePosting: any;
  };

  defaults: {
    from?: string | undefined;
    to?: string | undefined;
    cc?: string | undefined;
    bcc?: string | undefined;
    subject?: string | undefined;
    body?: string | undefined;
  };

  displayErrors: boolean;
  adjustFormOnBrowserError: boolean;
  reportErrors: boolean | (() => boolean);
  fakeUaString?: string | undefined;
  version: string;
}
