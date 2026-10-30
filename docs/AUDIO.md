# Audio

Audio is off by default. Sign Language comes first here.

## Enabling Audio

Want audio, too? Set `audio.enabled` to `true`:

```ts
const videomailClient = new VideomailClient({
  whitelistKey: "your-whitelist-key",
  audio: {
    enabled: true,
  },
});
```

## Other Audio Configurations

`audio.volume` sets the recording gain:

- `0`: silence.
- `1`: the original microphone level (the default).

It does not change playback volume or play the microphone through your speakers.

The browser captures mono Float32 PCM with `AudioWorkletNode`. This runs on the audio rendering thread at the `AudioContext` sample rate. Audio still travels to the server as 16-bit PCM. Nothing is captured before recording starts or while paused.

`audio.bufferSize` sets the PCM frames per batch. It does not change the sample rate or audio quality:

- Use `"auto"` for 2048 frames, or a power of two from 256 to 16384.
- Smaller batches arrive sooner.
- Larger batches mean fewer messages.

## Browser requirements

- AudioWorklet support and a secure context are required.
- The processor ships as a `blob:` module. There's no extra worklet file to host.
- If your site uses a content security policy, allow `blob:` in `script-src` for audio.

Unsupported browsers and blocked modules report a setup error. There is no fallback to the deprecated ScriptProcessor.
