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

### Native permission-based audio

For native integrations whose OS microphone setting replaces an in-app audio switch, set `audio.followPermissions: true` and `audio.switch: false`. Optionally supply `audio.getPermission`, an async function returning the standard `"granted"`, `"denied"` or `"prompt"` state from a read-only native permission API.

A denied state requests camera-only capture directly. Otherwise, capture requests the microphone and falls back to video-only when microphone access is denied or no microphone exists. Camera denial and unrelated capture errors still fail normally. This mode is opt-in; the usual audio-off default and browser audio controls do not change.

`USER_MEDIA_READY` includes `audioEnabled` after permission-based capture, so the host can update its controls, recording allowance and price using the effective stream. Idle recovery re-reads microphone access; once media transmission starts, the take's audio format stays fixed. Do not reset a paused take just to apply a new permission setting.

### Gain and buffering

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
