# Top 10 improvements for videomail-client

Prioritized by potential user impact, especially loss of a recording or a form submission. These are investigation and implementation tasks, not claims that every failure is reproducible on every browser or server deployment.

## 1. Protect frames and audio samples against slow or interrupted WebSockets (critical)

**Evidence:** [`writeStream`](src/wrappers/visuals/recorder.ts#L122) ignores the boolean returned by `stream.write`; [`draw`](src/wrappers/visuals/recorder.ts#L1617) increments the frame number before writing, while [`onAudioSample`](src/wrappers/visuals/recorder.ts#L189) counts samples before writing. On close, the stream is replaced and reconnects ([`initSocket`](src/wrappers/visuals/recorder.ts#L766)); no unacknowledged-media replay or queue limit is evident in this path. Progress acknowledgments are tracked, but not used to resume transmission.

**Why it matters:** Slow uplinks can accumulate buffered image data; a connection interruption can discard frames or samples already counted by the client. A resumed connection may therefore produce an incomplete recording or an encoding failure. Whether the server can recover from a gap needs an integration check.

**Next step:** Add bounded backpressure handling and define a recovery protocol for unacknowledged media (or fail the recording clearly instead of silently losing it). Test slow sends and mid-recording disconnects against a controllable WebSocket/server, checking frame and sample counts in the encoded result.

## 2. Make host-form submission match the advertised two-step contract (critical)

**Evidence:** The [README's Form Submissions section](README.md#L299) and [ContactForm story](src/stories/Form.stories.ts#L76) promise a Videomail request followed by the original form request. In [`submitAll`](src/wrappers/container.ts#L784), a form with `videomail_key` only calls `submitVideomail`; the `resource.form` call is in the _no-key_ branch. [`submitWithVideomail`](src/options.ts#L16) is advertised as controlling metadata forwarded to the host, but the option has no reader in `src` beyond its definition and type.

**Why it matters:** An integrator following those examples can see `SUBMITTED` even though their contact form never reached its own server. Setting `submitWithVideomail` does not change that outcome.

**Next step:** Decide and document who owns the host request. If the client owns it, post the form after Videomail succeeds, forward the alias/metadata according to the option, and test request order and failure handling. If integrations must do it themselves, correct the README, story, and option contract before relying on them.

## 3. Minimize sensitive data in automatic error reports (critical)

**Evidence:** [`reportErrors` defaults to true](src/options.ts#L176). [`VideomailError`](src/util/error/VideomailError.ts#L78) copies `document.cookie`, and [`reportError`](src/resource.ts#L117) sends it with the full page URL, recent logs, and enumerated media-device details to `/client-error/`. [`CollectLogger`](src/util/CollectLogger.ts#L17) retains debug messages even when `verbose` is false.

**Why it matters:** Readable session/CSRF cookies, URL tokens, addresses, and device labels from an embedding site can be sent to a different service on an otherwise ordinary client error. The README discloses several diagnostics, but not cookies.

**Next step:** Remove cookie values and strip URL query/fragment and sensitive log fields by default; minimize device details, document the remaining payload and retention, and test that synthetic secrets never enter outgoing reports.

## 4. Intercept the form's `submit` event, not only a button click (high)

**Evidence:** [`startListeningToSubmitEvents`](src/wrappers/form.ts#L367) assigns `onclick` to one found `[type='submit']` button; it does not register a form `submit` listener. [`doTheSubmit`](src/wrappers/form.ts#L386) prevents the browser default only when given that click event. The [form tests](src/wrappers/__tests__/form.test.ts#L194) invoke the method directly, not a native submit event.

**Why it matters:** `form.requestSubmit()`, another submit control, or a form without the selected button can bypass the recording/metadata flow and submit the host form prematurely. The assigned `onclick` also replaces a host click handler.

**Next step:** Own the cancellable form `submit` event, guard duplicate submissions, and preserve host handlers. Cover button, keyboard, `requestSubmit()`, and multiple-button submission paths in a DOM integration test.

## 5. Restore form controls after an API submission fails (high)

**Evidence:** [`submitAll`](src/wrappers/container.ts#L784) disables all form controls when `disableFormWhenSubmitting` is true, then catches API errors and emits `ERROR`, but its `finally` only ends waiting. The only normal [`enableForm`](src/wrappers/visuals.ts#L75) event is `USER_MEDIA_READY`, which need not occur after an already recorded preview; the option [defaults to true](src/options.ts#L182).

**Why it matters:** A transient API failure can leave the recorded message and the host form stuck in a disabled state, with no obvious retry path. Blindly enabling every control would also undo fields that were disabled before submission.

**Next step:** Restore the pre-submit enabled states on failure, expose a retry action without discarding the recorded key, and test failure/retry in a completed-recording state.

## 6. Time out a silent server after recording stops (high)

**Evidence:** [`stop`](src/wrappers/visuals/recorder.ts#L1391) uses a 60 ms timer to _send_ the stop command and then resets local capture; the completed preview comes later via a WebSocket command ([`executeCommand`](src/wrappers/visuals/recorder.ts#L1224)). The configured [`connection` timeout](src/wrappers/visuals/recorder.ts#L724) covers socket establishment, not the period from `stop` to `preview`. No deadline for that period is visible in the recorder.

**Why it matters:** If the socket remains open but server-side encoding stalls or never replies, a user can wait indefinitely without an actionable failure or a way to recover the recording. The 60 ms `stopTimeout` does not address this.

**Next step:** Introduce a bounded stop-to-preview deadline with distinct upload, encoding, and server-error states. Test a silent server that accepts `stop` but never sends `preview`, and make the failure recoverable without claiming the video was delivered.

## 7. Release camera/microphone tracks on every media initialization failure (high)

**Evidence:** [`UserMedia.init`](src/wrappers/visuals/userMedia.ts#L130) receives an already acquired stream; errors such as a rejected virtual camera are caught and only emitted in its [`catch`](src/wrappers/visuals/userMedia.ts#L349). [`stop`](src/wrappers/visuals/userMedia.ts#L364) is where tracks are stopped, but that catch does not call it. A rejected video `play()` promise with an `Error` is also only logged ([`play`](src/wrappers/visuals/userMedia.ts#L185)).

**Why it matters:** Some initialization failures can leave camera or microphone tracks live without a working recorder, keeping the browser's capture indicator on and the device in use.

**Next step:** Stop every track of an acquired stream when setup cannot complete, settle readiness once, and add tests for invalid video tracks, rejected playback, and switching cameras after a failure.

## 8. Reassess the high-severity development-tool audit exceptions (medium)

**Evidence:** [`audit-ci.jsonc`](audit-ci.jsonc#L3) permits five advisory IDs without a reason or review date. On 2026-10-09, a public-registry audit of the lockfile reported 15 high-severity dependency entries; the configured `npm run audit` passed by allowlisting the `basic-ftp` and `braces` advisories, and reported the other three IDs as no longer needed. A separate `npm audit --omit=dev` reported **zero production-dependency findings**. The affected chains include release tooling and Storybook/build tooling, not a demonstrated browser-bundle exposure.

**Why it matters:** Blanket, indefinite exceptions can conceal ongoing risk in the development and release environment and make a green audit result look more reassuring than it is.

**Next step:** Trace each active advisory to a reachable dev/release action, update or replace vulnerable tooling where feasible, remove stale IDs, and document owners, reasons, and review dates for any remaining exceptions. Keep the production-only and full audits distinguishable in CI.

## 9. Correct the audio gain graph before relying on recorded volume (medium)

**Evidence:** [`AudioRecorder.init`](src/util/html/media/AudioRecorder.ts#L125) connects the microphone directly to `scriptProcessor` _and_ through a gain node into the same processor ([`volume.connect`](src/util/html/media/AudioRecorder.ts#L131)). The processor samples that mixed input, so setting `audio.volume` does not isolate or simply scale the recorded signal. The [unit test](src/util/html/media/__tests__/AudioRecorder.test.ts#L64) checks the gain property, not the connections or PCM amplitude.

**Why it matters:** When experimental audio is enabled, the dry and gained paths can add together, increasing amplitude and potentially clipping; the documented volume setting cannot be trusted.

**Next step:** Use a single input path through gain, ensure the processor stays active without audible monitor feedback, and test both the graph and sample amplitudes in at least one real browser.

## 10. Distinguish blank recipient fields from absent ones (medium)

**Evidence:** [`getRecipients`](src/wrappers/form.ts#L93) adds `to`, `cc`, and `bcc` only when their parsed value is truthy. [`validate`](src/wrappers/container.ts#L719) then tests property presence to decide whether a recipient is configured; if all configured fields are empty and not HTML-`required`, it takes the "no recipients to validate" branch. The [form test](src/wrappers/__tests__/form.test.ts#L61) covers only populated recipients.

**Why it matters:** A contact form that displays optional recipient inputs can pass client validation with no recipient, reaching the API without an intended destination. Truly recipient-free video forms should still be allowed.

**Next step:** Detect configured recipient controls independently of their values, require at least one nonempty address when the integration provides recipient inputs, and test blank optional fields, CC/BCC-only forms, and recipient-free forms.

## Audit notes

- Checked source, nearby unit tests, README and Storybook examples, CI/release/audit configuration, and the npm tarball after a fresh production build. The full Vitest suite passed (303 tests across 47 files) under the pinned Node 26.5.0; the production build and package dry run also passed. Items concerning live WebSockets, server encoding, native browser media, and host submissions still need real integration/browser verification.
- Development TLS deserves a separate housekeeping pass: the tracked [localhost private key](etc/ssl-certs/localhost.key) and [certificate](etc/ssl-certs/localhost.crt) are signed for one developer's mkcert setup; the certificate expires on 2027-01-02. Generate per-developer keys outside version control with the existing [regeneration script](etc/ssl-certs/regenerate_cert.sh), and update the Storybook setup instructions. The npm tarball does **not** include these files.
- Refresh the project size estimate after optimization: a fresh ESM build reported 67.8 kB gzipped versus the [roughly 50 kB claim](.github/copilot-instructions.md#L64); CJS and UMD were each about 161-163 kB gzipped. These are lower priority than the recording and submission failures above.
