// Because JSDOM does not implement HTMLMediaElement.pause, we mock it to avoid errors during tests
vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
