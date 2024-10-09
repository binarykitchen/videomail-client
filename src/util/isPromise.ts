function isPromise(anything) {
  return anything && typeof Promise !== "undefined" && anything instanceof Promise;
}

export default isPromise;
