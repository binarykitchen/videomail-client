import { VideomailClient } from "../client";
import Resource from "../resource";
import Container from "../wrappers/container";

vi.mock("../util/isAutomatedUserAgent", () => ({
  default: () => true,
}));

describe("Client", () => {
  const mock = {
    onHide() {},
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("constructor with default arguments", () => {
    const videomailClient = new VideomailClient();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("constructor throws error when width is not divisible by two", () => {
    expect(() => {
      new VideomailClient({ reportErrors: false, video: { width: 99 } });
    }).toThrow(/Width must be divisible by two/u);
  });

  // An npm package scanner once called these with junk and flooded our inbox. 📮
  it("keeps its error reporting helpers out of reach", () => {
    const videomailClient = new VideomailClient({ reportErrors: false });
    const helpers = ["createReportedError", "reportFailure"];

    expect(helpers.filter((name) => name in videomailClient)).toEqual([]);
  });

  it("reports a failed lookup and still rejects for the host", async () => {
    const failure = new Error("Lookup failed");
    vi.spyOn(Resource.prototype, "getByAlias").mockRejectedValue(failure);
    const report = vi
      .spyOn(Resource.prototype, "reportError")
      .mockResolvedValue(undefined);
    const videomailClient = new VideomailClient();

    const outcome = await videomailClient
      .getByAlias("alias")
      .catch((exc: unknown) => exc);

    expect({ outcome, reports: report.mock.calls.length }).toEqual({
      outcome: failure,
      reports: 1,
    });
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

  it("keeps public listeners across repeated start over cycles", () => {
    // jsdom does not calculate the layout needed when rebuilding the recorder.
    vi.spyOn(document.body, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 400, 300),
    );
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(300);
    const videomailClient = new VideomailClient();
    const onStartingOver = vi.fn();
    const onError = vi.fn();
    videomailClient.on("STARTING_OVER", onStartingOver);
    videomailClient.on("ERROR", onError);

    try {
      videomailClient.show();
      videomailClient.startOver({ keepHidden: true });
      videomailClient.startOver({ keepHidden: true });

      expect({
        startOvers: onStartingOver.mock.calls.length,
        errors: onError.mock.calls,
      }).toEqual({ startOvers: 2, errors: [] });
    } finally {
      videomailClient.unload();
    }
  });

  it("on unload, hidden and not built", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();
    videomailClient.unload();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("removes its browser listeners on unload", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const addContainerEventListener = vi.spyOn(HTMLElement.prototype, "addEventListener");
    const removeContainerEventListener = vi.spyOn(
      HTMLElement.prototype,
      "removeEventListener",
    );
    const videomailClient = new VideomailClient({
      enableAutoUnload: true,
      enableSpace: true,
      recalculateDimensionsOnWindowResize: true,
    });

    videomailClient.show();

    const listenerFor = (eventName: string) =>
      addEventListener.mock.calls.find(([type]) => type === eventName)?.[1];

    const resizeListener = listenerFor("resize");
    const pageHideListener = listenerFor("pagehide");
    const keydownListener = addContainerEventListener.mock.calls.find(
      ([type]) => type === "keydown",
    )?.[1];

    videomailClient.unload();

    expect({
      window: removeEventListener.mock.calls,
      container: removeContainerEventListener.mock.calls,
    }).toEqual({
      window: expect.arrayContaining([
        ["resize", resizeListener],
        ["pagehide", pageHideListener],
      ]),
      container: expect.arrayContaining([["keydown", keydownListener]]),
    });
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

  it("keeps public pause delegated to safe lifecycle suspension", () => {
    const suspend = vi
      .spyOn(Container.prototype, "suspend")
      .mockImplementation(() => undefined);
    const videomailClient = new VideomailClient();

    videomailClient.pause();

    expect(suspend).toHaveBeenCalledExactlyOnceWith();
    suspend.mockRestore();
  });

  it("exposes transport-only recovery through the public client API", () => {
    const recover = vi
      .spyOn(Container.prototype, "recoverConnection")
      .mockImplementation(() => undefined);
    const videomailClient = new VideomailClient();

    videomailClient.recoverConnection();

    expect(recover).toHaveBeenCalledExactlyOnceWith();
    recover.mockRestore();
  });

  it("logs a failing host listener instead of raising an ERROR", () => {
    const logError = vi.fn();
    const videomailClient = new VideomailClient({ logger: { error: logError } });
    const errorListener = vi.fn();
    const unsubscribe = videomailClient.on("HIDE", () => {
      throw new Error("Bug in the host app");
    });
    videomailClient.on("ERROR", errorListener);

    try {
      videomailClient.show();
      videomailClient.hide();

      expect({
        errors: errorListener.mock.calls,
        logs: logError.mock.calls,
      }).toEqual({
        errors: [],
        logs: [
          [
            expect.stringContaining(
              "A listener for HIDE failed: Error: Bug in the host app",
            ),
          ],
        ],
      });
    } finally {
      unsubscribe();
      videomailClient.unload();
    }
  });

  describe("when the page is about to go away", () => {
    // A shown client inside a form, holding an unsent preview.
    function createDirtyClient() {
      document.body.innerHTML = `<form method="post"><div id="videomail"></div></form>`;
      const videomailClient = new VideomailClient({
        selectors: { containerId: "videomail" },
      });
      videomailClient.show();
      vi.spyOn(Container.prototype, "isReplayShown").mockReturnValue(true);

      return videomailClient;
    }

    function getContainer(videomailClient: VideomailClient) {
      return (videomailClient as unknown as { container: Container }).container;
    }

    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("keeps an unsent take while the host can still cancel leaving", () => {
      const videomailClient = createDirtyClient();

      window.dispatchEvent(new Event("beforeunload", { cancelable: true }));

      expect(videomailClient.isDirty()).toBe(true);
    });

    it("unloads once the page is really leaving", () => {
      const videomailClient = createDirtyClient();

      window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false }));

      expect(videomailClient.isBuilt()).toBe(false);
    });

    it("only suspends when the back/forward cache may restore the page", () => {
      const videomailClient = createDirtyClient();
      const suspend = vi.spyOn(getContainer(videomailClient), "suspend");

      window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));

      expect({
        built: videomailClient.isBuilt(),
        suspensions: suspend.mock.calls.length,
      }).toEqual({ built: true, suspensions: 1 });
    });
  });
});
