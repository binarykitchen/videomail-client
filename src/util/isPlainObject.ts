import isObjectLike from "./isObjectLike";

function isPlainObject(value: unknown) {
  if (!isObjectLike(value)) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}
export default isPlainObject;
