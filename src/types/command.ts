import { ErrorObject } from "serialize-error";

// Do not trust what we receive from server side.
// Therefore, all of them can be undefined and require additional checks
export interface CommandArgs {
  frame?: number;
  key?: string | undefined;
  err?: ErrorObject;
  sample?: number;
  mp4?: string;
  webm?: string;
}

export interface Command {
  command: string;
  args?: CommandArgs;
}
