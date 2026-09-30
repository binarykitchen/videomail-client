// Because JSDOM does not implement HTMLMediaElement.pause, we mock it to avoid errors during tests
HTMLMediaElement.prototype.pause = vi.fn();
