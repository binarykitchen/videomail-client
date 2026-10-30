import Resource from "../resource";

// jsdom has no media playback, so stub pause() for tests.
HTMLMediaElement.prototype.pause = vi.fn();

beforeEach(() => {
  vi.spyOn(Resource.prototype, "reportError").mockResolvedValue(undefined);
});
