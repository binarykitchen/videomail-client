// JavaScript can throw anything, e.g. a string. Those deserve a readable error, too.
function isThrownNonError(exc: unknown) {
  return exc !== undefined && !(exc instanceof Error);
}

export default isThrownNonError;
