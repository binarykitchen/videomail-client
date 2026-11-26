// send() only accepts views on a plain ArrayBuffer, not on shared memory.
function isSendable(chunk: Uint8Array): chunk is Uint8Array<ArrayBuffer> {
  return chunk.buffer instanceof ArrayBuffer;
}

export default isSendable;
