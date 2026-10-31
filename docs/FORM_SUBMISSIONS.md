# Form Submissions ✏️

The client listens for the form's `submit` event. This covers:

- Submit buttons.
- Pressing Enter.
- Calling `form.requestSubmit()`.

Your app's click and submit handlers stay registered. Events your app has already cancelled are left alone. Extra submissions are ignored while one is in progress, whether triggered by the form or through code.

## Where submissions go

With `enableAutoSubmission` enabled (the default):

- **Video and an explicit form `action`:** send the video to Videomail first. After success, POST the original form fields to that action.
- **No video:** POST the form straight to its action.
- **First-party Videomail form without an explicit `action`:** send the video to the Videomail API in one request. Listen for `SUBMITTED` to handle the response.

If your app handles submission itself, set `enableAutoSubmission: false`. Let your integration continue after `SUBMITTED`.

If an automatic submission fails, the client restores the controls it disabled so users can edit and retry. A host-form retry reuses the already-uploaded video instead of uploading it again.

## Submitting from code

Use `form.requestSubmit()` or `videomailClient.submit()`. Native `form.submit()` skips submit events, so the client cannot intercept it.

With `enableAutoValidation: false`, `videomailClient.submit()` does not wait for client validation. Your app must validate the form first. `form.requestSubmit()` still runs the browser's built-in validation.

Not working? Check that these selectors point to your form and submit button:

```ts
selectors: {
  formId: undefined,
  submitButtonId: undefined,
  submitButtonSelector: undefined,
}
```

Leave them `undefined` (the defaults) to find the nearest form and a button with `type="submit"` automatically.

## Include videomail meta data in Form Submissions

Set `submitWithVideomail: true` to include full videomail metadata under `videomail` in the second request to your form's action.

Otherwise, the form fields include the videomail alias. Use `videomailClient.getByAlias(alias)` to look up the video later.
