# Audio

Audio recording is disabled by default. Because it's made for the love of Sign Language.

## Enabling Audio

To enable audio recording, set the `audio.enabled` option to `true` when creating the `VideomailClient` instance. Here is an example:

```ts
const videomailClient = new VideomailClient({
  whitelistKey: "your-whitelist-key",
  audio: {
    enabled: true,
  },
});
```

## Other Audio Configurations

`audio.volume` controls recording gain from `0` (silence) to `1` (unchanged microphone level, the default). It does not control playback volume or enable audible microphone monitoring.

Audio is captured as mono Float32 PCM on the browser's audio rendering thread using `AudioWorkletNode`, at the `AudioContext` sample rate. The existing 16-bit PCM transport to the server is unchanged. Capture does not include microphone pre-roll or paused audio.

`audio.bufferSize` controls the number of PCM frames per transferred batch, not the sample rate or audio fidelity. Use `"auto"` (2048 frames) or a power of two from 256 through 16384. Smaller batches reduce delivery latency; larger batches reduce message overhead.

Audio requires AudioWorklet support in a secure context. The processor is embedded in the package as a `blob:` module, so no additional worklet asset needs hosting. Sites with a Content Security Policy must allow `blob:` in `script-src` when enabling audio. Unsupported browsers and blocked modules report an initialization error; there is no deprecated ScriptProcessor fallback.
