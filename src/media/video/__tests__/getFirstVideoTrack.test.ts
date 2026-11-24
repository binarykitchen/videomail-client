import getFirstVideoTrack from "../getFirstVideoTrack";

describe("getFirstVideoTrack", () => {
  it("returns the first video track", () => {
    const firstTrack = { id: "first" } as MediaStreamTrack;
    const secondTrack = { id: "second" } as MediaStreamTrack;
    const stream = {
      getVideoTracks: vi.fn(() => [firstTrack, secondTrack]),
    } as unknown as MediaStream;

    expect(getFirstVideoTrack(stream)).toBe(firstTrack);
  });

  it("returns undefined when the stream has no video tracks", () => {
    const stream = {
      getVideoTracks: vi.fn(() => []),
    } as unknown as MediaStream;

    expect(getFirstVideoTrack(stream)).toBeUndefined();
  });
});
