import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import Container from "../container";

interface ContainerInternals {
  options: ReturnType<typeof mergeWithDefaultOptions>;
  visuals: {
    record: () => void;
    setLimitSeconds: (limitSeconds: number) => void;
    show: () => void;
  };
}

function getInternals(container: Container) {
  return container as unknown as ContainerInternals;
}

describe("Container", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.classList.remove("wait");
  });

  it("starts unbuilt without a container element", () => {
    const container = new Container(mergeWithDefaultOptions());

    expect([container.isBuilt(), container.hasElement()]).toEqual([false, false]);
  });

  it("builds a container element", () => {
    const container = new Container(mergeWithDefaultOptions());

    const element = container.build();

    expect(element?.classList.contains("videomail")).toBe(true);
  });

  it("reports a built state after building", () => {
    const container = new Container(mergeWithDefaultOptions());

    container.build();

    expect(container.isBuilt()).toBe(true);
  });

  it("builds button and visual children", () => {
    const container = new Container(mergeWithDefaultOptions());

    const element = container.build();

    expect(element?.querySelectorAll(".buttons, .visuals")).toHaveLength(2);
  });

  it("discovers a parent form", () => {
    document.body.innerHTML = `<form><div id="videomail-target"></div><button type="submit">Send</button></form>`;
    const options = mergeWithDefaultOptions({
      selectors: { containerId: "videomail-target" },
    });
    const container = new Container(options);

    container.build();

    expect(container.hasForm()).toBe(true);
  });

  it("queries inside the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.build();

    expect(container.querySelector(".visuals")).not.toBeNull();
  });

  it("appends children to the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const child = document.createElement("p");
    const element = container.build();

    container.appendChild(child);

    expect(child.parentElement).toBe(element);
  });

  it("identifies an element outside the container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const outside = document.createElement("p");
    container.build();

    expect(container.isOutsideElementOf(outside)).toBe(true);
  });

  it("adds a waiting class to the document", () => {
    const container = new Container(mergeWithDefaultOptions());

    container.beginWaiting();

    expect(document.documentElement.classList.contains("wait")).toBe(true);
  });

  it("removes the document waiting class", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.beginWaiting();

    container.endWaiting();

    expect(document.documentElement.classList.contains("wait")).toBe(false);
  });

  it("limits width to the built container", () => {
    const container = new Container(mergeWithDefaultOptions());
    const element = container.build();
    if (!element) {
      throw new Error("Expected a built container element");
    }
    const rect = {
      bottom: 0,
      height: 0,
      left: 0,
      right: 320,
      top: 0,
      width: 320,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    };
    const rectMock = vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rect);

    const dimension = container.limitWidth(640);
    rectMock.mockRestore();

    expect(dimension).toEqual({ unit: "px", value: 320 });
  });

  it("returns valid before it is built", () => {
    const container = new Container(mergeWithDefaultOptions());

    expect(container.validate()).toBe(true);
  });

  it("emits the audio-enabling event", () => {
    const container = new Container(mergeWithDefaultOptions());
    const listener = vi.fn();
    container.on("ENABLING_AUDIO", listener);

    container.enableAudio();

    expect(listener).toHaveBeenCalledOnce();
  });

  it("delegates recording to visuals", () => {
    const container = new Container(mergeWithDefaultOptions());
    const record = vi
      .spyOn(getInternals(container).visuals, "record")
      .mockImplementation(() => undefined);

    container.record();

    expect(record).toHaveBeenCalledOnce();
  });

  it("updates and delegates the recording limit", () => {
    const container = new Container(mergeWithDefaultOptions());
    const internals = getInternals(container);
    const setLimit = vi
      .spyOn(internals.visuals, "setLimitSeconds")
      .mockImplementation(() => undefined);

    container.setLimitSeconds(45);

    expect([internals.options.video.limitSeconds, setLimit.mock.calls]).toEqual([
      45,
      [[45]],
    ]);
  });

  it("shows the container without starting recorder work when visuals are stubbed", () => {
    const container = new Container(mergeWithDefaultOptions());
    const element = container.build();
    vi.spyOn(getInternals(container).visuals, "show").mockImplementation(() => undefined);

    const shown = container.show();

    expect(shown).toBe(element);
  });

  it("returns to an unbuilt state when unloaded", () => {
    const container = new Container(mergeWithDefaultOptions());
    container.build();

    container.unload();

    expect(container.isBuilt()).toBe(false);
  });
});
