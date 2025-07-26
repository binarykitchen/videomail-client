function isPromise(anything) {
  return Boolean(
    anything &&
      typeof Promise !== "undefined" &&
      Object.prototype.toString.call(anything) === "[object Promise]",
  );
}
export default isPromise;
