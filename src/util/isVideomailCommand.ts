import type { VideomailCommand } from "../types/command";
import isRecord from "./isRecord";

// The server's arguments get checked where they're used. Here, just make sure it's a command.
function isVideomailCommand(value: unknown): value is VideomailCommand {
  return isRecord(value) && typeof value.command === "string";
}

export default isVideomailCommand;
