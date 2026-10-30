# Privacy and error reporting 🕵🏻

Recording sends webcam frames to your configured Videomail service for encoding. Audio samples go along if audio is enabled. There is no offline recording.

## What error reports contain

`reportErrors` is `true` by default. Reports go to `/client-error/` on `apiUrl`, which defaults to `https://videomail.io/api`.

Reports keep these details for troubleshooting:

- Error messages, stacks, causes, and diagnostic data structure.
- Recent logs, client/plugin versions, and the whitelist key.
- Browser, OS, CPU, and device details.
- Screen size, orientation, and supported/used media constraints.
- Device labels, device IDs, and group IDs.

Device details help us investigate camera and microphone problems. They are kept on the live Videomail site, too.

## What gets filtered

The client does not read or copy your page's cookies into errors or reports. Before sending a report, it filters an outgoing copy:

- Removes URL credentials, query strings, and fragments.
- Redacts recognized credential and contact fields.
- Hides string-valued subject and body fields.
- Applies the same filtering to nested errors and recognized fields and URLs in log text.

Structured server response bodies and other diagnostic fields stay available. Normal browser-managed credentials sent to the API are unchanged.

**Reports are not fully anonymous.** Device labels, URL paths, and unrecognized free text can still identify someone. Keep secrets out of custom logs.

Local `ERROR` events and `getLogLines()` keep their original diagnostic content. Set `reportErrors: false` to handle errors locally only.

## How long data stays

The default logger keeps the latest 30 lines in memory. Change this with `logStackSize`. Debug lines are included even when `verbose` is `false`.

Lines stay until overwritten or the logger is discarded. There is no persistent report queue in the client.

The Videomail service controls server-side storage, access, and deletion periods. This package does not set or enforce them. The service's privacy policy must cover them.
