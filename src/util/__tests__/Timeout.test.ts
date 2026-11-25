import Timeout from "../Timeout";

describe("Timeout class", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("replaces a pending timer instead of leaking it", () => {
    const fired: string[] = [];
    const timeout = new Timeout();

    timeout.start(() => fired.push("first"), 100);
    timeout.start(() => fired.push("second"), 100);
    vi.advanceTimersByTime(100);

    expect(fired).toStrictEqual(["second"]);
  });

  it("never fires once cleared", () => {
    const callback = vi.fn<() => void>();
    const timeout = new Timeout();

    timeout.start(callback, 100);
    timeout.clear();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });

  it("is no longer pending once it fired", () => {
    const timeout = new Timeout();

    timeout.start(() => undefined, 100);
    vi.advanceTimersByTime(100);

    expect(timeout.isPending()).toBe(false);
  });

  it("only reports clearing a pending timer", () => {
    const onClear = vi.fn<() => void>();
    const timeout = new Timeout(onClear);

    timeout.clear();
    timeout.start(() => undefined, 100);
    timeout.clear();
    timeout.clear();

    expect(onClear).toHaveBeenCalledOnce();
  });
});
