import { VideomailClient } from "../client";

vi.mock("../util/isAutomatedUserAgent", () => ({
  default: () => true,
}));

describe("Client", () => {
  const mock = {
    onHide() {},
  };

  it("constructor with default arguments", () => {
    const videomailClient = new VideomailClient();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("constructor throws error when width is not divisible by two", () => {
    expect(() => {
      new VideomailClient({ reportErrors: false, video: { width: 99 } });
    }).toThrow(/Width must be divisible by two/u);
  });

  it("showing it sets its built flag to true", () => {
    const videomailClient = new VideomailClient();

    const container = videomailClient.show();

    expect({
      built: videomailClient.isBuilt(),
      noScriptText: container.querySelector("noscript")?.textContent,
    }).toEqual({
      built: true,
      noScriptText: "Please enable JavaScript",
    });
  });

  it("hiding emits hide event", () => {
    const videomailClient = new VideomailClient();

    const onHideSpy = vi.spyOn(mock, "onHide");

    videomailClient.show();

    videomailClient.on("HIDE", () => {
      mock.onHide();
    });

    videomailClient.hide();

    expect(onHideSpy).toHaveBeenCalledTimes(1);
  });

  it("isolates events between client instances", () => {
    const firstClient = new VideomailClient();
    const secondClient = new VideomailClient();
    const firstListener = vi.fn();
    const secondListener = vi.fn();

    firstClient.on("HIDE", firstListener);
    secondClient.on("HIDE", secondListener);

    firstClient.show();
    firstClient.hide();

    secondClient.show();
    secondClient.hide();

    expect([firstListener.mock.calls, secondListener.mock.calls]).toEqual([[[]], [[]]]);
  });

  it("on unload, hidden and not built", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();
    videomailClient.unload();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("removes its window listeners on unload", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const videomailClient = new VideomailClient({
      enableAutoUnload: true,
      enableSpace: true,
      recalculateDimensionsOnWindowResize: true,
    });

    videomailClient.show();

    const listenerFor = (eventName: string) =>
      addEventListener.mock.calls.find(([type]) => type === eventName)?.[1];

    const resizeListener = listenerFor("resize");
    const beforeUnloadListener = listenerFor("beforeunload");
    const keydownListener = listenerFor("keydown");

    videomailClient.unload();

    expect(removeEventListener.mock.calls).toEqual(
      expect.arrayContaining([
        ["resize", resizeListener],
        ["beforeunload", beforeUnloadListener],
        ["keydown", keydownListener],
      ]),
    );
  });

  it("not dirty when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isDirty()).toBe(false);
  });

  it("not recording when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isRecording()).toBe(false);
  });
});
