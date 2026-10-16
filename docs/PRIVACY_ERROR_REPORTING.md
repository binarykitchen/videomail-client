# Privacy and error reporting 🕵🏻

Recording sends webcam frames, and audio samples when enabled, to the configured Videomail service for encoding. The package does not provide offline recording.

The `reportErrors` option defaults to `true`. Reports go to `/client-error/` on `apiUrl`, which defaults to `https://videomail.io/api`. Reports retain error messages, stacks and causes, diagnostic payload structure, recent logs, client/plugin versions, the whitelist key, browser/OS/CPU/device details, screen and orientation data, and supported/used media constraints. Enumerated device labels, device IDs and group IDs are intentionally retained for troubleshooting camera and microphone problems, including on the live Videomail site.

The client does not read or copy the embedding page's cookies into errors or reports. Before sending, an outgoing copy is filtered to remove URL credentials, query strings and fragments, redact recognized credential and contact fields, and hide string-valued subject/body fields. Filtering also covers nested errors and recognized fields and URLs in log text. Structured server response bodies and other diagnostic payload fields remain available. Normal browser-managed credentials sent to the API are unchanged.

This is not full anonymization: device labels, URL paths and unrecognized free text can still identify a user. Avoid putting secrets in custom logs. Local `ERROR` events and `getLogLines()` retain their original diagnostic content. Set `reportErrors: false` for local-only error handling.

The default logger keeps the latest 30 lines in memory, configurable with `logStackSize`, including debug lines when `verbose` is `false`. Lines remain until overwritten or the logger is discarded; there is no persistent client-side report queue. Server-side storage, access and deletion periods are controlled by the Videomail service deployment, not configured or enforced by this package, and must be covered by the service's privacy policy.
