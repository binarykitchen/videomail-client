import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import createError from "../createError";
import VideomailError from "../VideomailError";

describe("createError fn", () => {
  it("a default videomail error can be created", () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const error = createError({ options: defaultOptions });

    expect(error).toMatchObject({
      explanation: undefined,
      message: "(undefined message)",
    });
  });

  it("a videomail error with a custom message and explanation can be created", () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const error = createError({
      options: defaultOptions,
      message: "i am message",
      explanation: "i am explanation",
    });

    expect(error).toMatchObject({
      explanation: "i am explanation",
      message: "i am message",
    });
  });

  it("a videomail error does not re-create a videomail error", () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const error = createError({
      options: defaultOptions,
      err: new VideomailError("i am another message", defaultOptions),
    });

    expect(error).toMatchObject({
      explanation: undefined,
      message: "i am another message",
    });
  });

  it.each([
    [
      VideomailError.SECURITY_ERROR,
      "Your browser blocked this action",
      "Check this page's camera permissions and security settings.",
    ],
    [
      "MediaDeviceFailedDueToShutdown",
      "Webcam is shutting down",
      "Wait for your webcam to finish switching off, then try again.",
    ],
    [
      "SourceUnavailableError",
      "Cannot access your webcam",
      "Another app may be using it, or there may be a hardware problem.",
    ],
    ["NO_DEVICES_FOUND", "No webcam found", "Check that your webcam is connected."],
    [
      "PermissionDismissedError",
      "Camera permission is needed",
      "The camera permission prompt was closed.<br/>" +
        "Please allow access when it appears again.",
    ],
    ...[
      VideomailError.NOT_ALLOWED_ERROR,
      VideomailError.PERMISSION_DENIED,
      "PermissionDeniedError",
    ].map((name) => [
      name,
      "Permission denied",
      "We cannot access your webcam. Check these possibilities:" +
        "<ul><li>Camera access is blocked in your browser settings.</li>" +
        "<li>Another app is using your webcam.</li></ul>",
    ]),
    ...["HARDWARE_UNAVAILABLE", "AbortError"].map((name) => [
      name,
      "Webcam is unavailable",
      "Another window may be using it. Close it and try again.",
    ]),
    ["NO_VIDEO_FEED", "No video feed found", "Another browser may be using your webcam."],
    [
      VideomailError.STARTING_FAILED,
      "Could not start recording",
      "Another browser may be using your webcam.",
    ],
    [
      "DevicesNotFoundError",
      "No available webcam found",
      "Check that your webcam is connected and not being used by another app.",
    ],
    ...[VideomailError.NOT_READABLE_ERROR, VideomailError.TRACK_START_ERROR].map(
      (name) => [
        name,
        "Cannot access your webcam",
        "Another browser may be using it. Close it and try again.",
      ],
    ),
    [
      VideomailError.INVALID_STATE_ERROR,
      "Your camera stream has ended",
      "The webcam stream is no longer active.",
    ],
  ])("gives a clear explanation for %s", (name, message, explanation) => {
    const options = mergeWithDefaultOptions({ reportErrors: false });
    const err = new Error();
    err.name = name;

    expect(createError({ err, options })).toMatchObject({ message, explanation });
  });

  it("mentions both devices when audio is enabled and no devices are found", () => {
    const options = mergeWithDefaultOptions({
      reportErrors: false,
      audio: { enabled: true },
    });
    const err = new Error();
    err.name = "NO_DEVICES_FOUND";

    expect(createError({ err, options })).toMatchObject({
      message: "No webcam or microphone found",
      explanation: "Check that your webcam and microphone are connected.",
    });
  });
});
