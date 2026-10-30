# Form Submissions ✏️

The client intercepts the form's `submit` event, covering submit controls, Enter-key submission, and `form.requestSubmit()`. Existing host click and submit handlers stay registered; events already cancelled by the host are left alone. Overlapping native and manual submissions are ignored until the current submission settles.

With `enableAutoSubmission` enabled (the default), a recorded video and an explicit form `action` produce two requests: the client sends Videomail first, then POSTs the original form fields to that action after success. Without a recorded video, the client POSTs the form directly to its action.

For first-party Videomail forms without an explicit `action`, a recorded video is sent in one request to the Videomail API; listen for `SUBMITTED` to handle the response. Set `enableAutoSubmission: false` when a host framework owns form submission, then let that integration resume its submission after `SUBMITTED`.

For programmatic submission, use `form.requestSubmit()` or `videomailClient.submit()`. Native `form.submit()` bypasses submit events and therefore cannot be intercepted.

With `enableAutoValidation: false`, `videomailClient.submit()` does not wait for a client validation result. Validate through the host integration before calling it. `form.requestSubmit()` still applies the browser's native constraint validation.

If this does not work, verify that the configured selectors identify the form and its submit button:

```ts
selectors: {
  formId: undefined,
  submitButtonId: undefined,
  submitButtonSelector: undefined,
}
```

When these values are `undefined` (the defaults), the client detects the nearest form and a button with `type="submit"` automatically.

## Include videomail meta data in Form Submissions

When the client sends the second, host-form request, enable `submitWithVideomail` to include full videomail metadata under the `videomail` key. Otherwise the original form fields include the videomail alias, which can later be resolved with `videomailClient.getByAlias(alias)`.
