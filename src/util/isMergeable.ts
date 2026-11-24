import isPlainObject from "./isPlainObject";

/*
 * Only arrays and plain objects get merged. Anything else, like a class-based
 * logger, is taken as it is: cloning it would drop its prototype methods.
 */
function isMergeable(value: unknown) {
  return Array.isArray(value) || isPlainObject(value);
}
export default isMergeable;
