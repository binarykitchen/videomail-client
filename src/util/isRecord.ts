import isObjectLike from "./isObjectLike";

function isRecord(value: unknown): value is Record<string, unknown> {
  return isObjectLike(value) && !Array.isArray(value);
}

export default isRecord;
