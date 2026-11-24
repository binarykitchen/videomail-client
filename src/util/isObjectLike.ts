// typeof null is "object", too. Check this before reading properties of unknown values.
function isObjectLike(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export default isObjectLike;
