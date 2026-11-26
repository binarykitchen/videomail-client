// The server sends text frames. Binary ones get decoded, anything else shows what it was.
function decodeMessage(data: unknown) {
  if (typeof data === "string") {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data);
  }

  return String(data);
}

export default decodeMessage;
