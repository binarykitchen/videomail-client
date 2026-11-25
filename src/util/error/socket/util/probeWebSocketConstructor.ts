function probeWebSocketConstructor(url: string) {
  // Test construction, not connectivity. Some crawlers fail even on a simple URL.
  try {
    const socket = new WebSocket(url);
    socket.close();
    return "ok";
  } catch (exc) {
    if (exc instanceof Error) {
      return `${exc.name}:${exc.message}`;
    }

    return String(exc);
  }
}

export default probeWebSocketConstructor;
