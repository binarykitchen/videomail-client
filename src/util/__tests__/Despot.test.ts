import Despot from "../Despot";
import mergeWithDefaultOptions from "../options/mergeWithDefaultOptions";

// Just enough of a component to emit events the way the real ones do.
class TestComponent extends Despot {
  public constructor(options = mergeWithDefaultOptions()) {
    super("TestComponent", options);
  }

  public hide() {
    this.emit("HIDE");
  }

  public fail(exc: unknown) {
    this.emit("ERROR", { exc });
  }

  public progress() {
    this.emit("PROGRESS", { frameProgress: "50%" });
  }
}

describe("Despot", () => {
  it("keeps notifying the other listeners when one of them fails", () => {
    const component = new TestComponent();
    const nextListener = vi.fn();
    component.on("HIDE", () => {
      throw new Error("Listener bug");
    });
    component.on("HIDE", nextListener);

    component.hide();

    expect(nextListener).toHaveBeenCalledOnce();
  });

  it("raises a failing internal listener as an ERROR", () => {
    const component = new TestComponent();
    const failure = new Error("Listener bug");
    const errorListener = vi.fn();
    component.on("HIDE", () => {
      throw failure;
    });
    component.on("ERROR", errorListener);

    component.hide();

    expect(errorListener).toHaveBeenCalledExactlyOnceWith({ exc: failure });
  });

  it("logs instead of looping when an ERROR listener fails", () => {
    const options = mergeWithDefaultOptions();
    const logError = vi
      .spyOn(options.logger, "error")
      .mockImplementation(() => undefined);
    const component = new TestComponent(options);
    component.on("ERROR", () => {
      throw new Error("Error listener bug");
    });

    component.fail(new Error("Original problem"));

    expect(logError).toHaveBeenCalledOnce();
  });

  it("keeps per-frame progress events out of the collected log lines", () => {
    const options = mergeWithDefaultOptions();
    const component = new TestComponent(options);

    component.progress();

    expect(options.logger.getLines?.()).toEqual([]);
  });
});
