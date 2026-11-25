function getConstructorDetails() {
  const socketConstructor: unknown = globalThis.WebSocket;
  const available = typeof socketConstructor === "function";
  let name: string | undefined;
  let arity: number | undefined;
  let nativeLike = false;

  if (available) {
    name = socketConstructor.name.slice(0, 80);
    arity = socketConstructor.length;
    nativeLike = Function.prototype.toString
      .call(socketConstructor)
      .includes("[native code]");
  }

  // Native-looking functions can still be proxies; do not treat this as bot evidence.
  return { available, name, arity, nativeLike };
}

export default getConstructorDetails;
