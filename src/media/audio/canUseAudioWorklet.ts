// AudioWorklet only exists in secure contexts of browsers that support it.
function canUseAudioWorklet(context: AudioContext) {
  return (
    typeof context.audioWorklet !== "undefined" &&
    typeof window.AudioWorkletNode === "function"
  );
}
export default canUseAudioWorklet;
