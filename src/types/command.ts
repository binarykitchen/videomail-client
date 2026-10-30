import { ErrorObject } from "serialize-error";

// Server data needs checking. Any field may be missing.
export interface VideomailCommandArgs {
  frame?: number;
  key?: string | undefined;
  err?: ErrorObject;
  sample?: number;
  mp4?: string;
  webm?: string;
  duration?: number;
}

export interface VideomailCommand {
  command: string;
  args?: VideomailCommandArgs;
}
