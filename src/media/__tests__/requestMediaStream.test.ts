import requestMediaStream from "../requestMediaStream";

describe("requestMediaStream", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests camera-only media when the microphone permission is denied", async () => {
    const stream = { id: "stream" } as MediaStream;
    const getUserMedia = vi.fn((_constraints: MediaStreamConstraints) =>
      Promise.resolve(stream),
    );
    const constraints = { audio: true, video: true };
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });

    const result = await requestMediaStream({
      constraints,
      followsMicrophonePermission: true,
      getPermission: () => Promise.resolve("denied"),
      isRequestCurrent: () => true,
    });

    expect({
      result,
      requestedConstraints: getUserMedia.mock.calls.map(
        ([requestedConstraints]) => requestedConstraints,
      ),
    }).toEqual({
      result: stream,
      requestedConstraints: [{ audio: false, video: true }],
    });
  });

  it("retries camera-only after an optional audio error", async () => {
    const stream = { id: "stream" } as MediaStream;
    const audioError = new Error("Microphone permission denied");
    audioError.name = "NotAllowedError";
    const getUserMedia = vi
      .fn((_constraints: MediaStreamConstraints) => Promise.resolve(stream))
      .mockRejectedValueOnce(audioError);
    const constraints = { audio: true, video: true };
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });

    const result = await requestMediaStream({
      constraints,
      followsMicrophonePermission: true,
      getPermission: () => Promise.resolve("granted"),
      isRequestCurrent: () => true,
    });

    expect({
      result,
      requestedConstraints: getUserMedia.mock.calls.map(
        ([requestedConstraints]) => requestedConstraints,
      ),
    }).toEqual({
      result: stream,
      requestedConstraints: [
        { audio: true, video: true },
        { audio: false, video: true },
      ],
    });
  });

  it("does not request media after the permission response becomes stale", async () => {
    const getUserMedia = vi.fn(() => Promise.resolve({ id: "stream" } as MediaStream));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });

    const result = await requestMediaStream({
      constraints: { audio: true, video: true },
      followsMicrophonePermission: true,
      getPermission: () => Promise.resolve("granted"),
      isRequestCurrent: () => false,
    });

    expect({ result, requests: getUserMedia.mock.calls.length }).toEqual({
      result: undefined,
      requests: 0,
    });
  });
});
