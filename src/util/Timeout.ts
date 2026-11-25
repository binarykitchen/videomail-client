/*
 * One timer that knows whether it's still pending ⏱️
 *
 * Starting it again replaces the pending timer instead of leaking it. Once the
 * callback runs, it's no longer pending, so no stale handle hangs around.
 */
class Timeout {
  private id: number | undefined;

  // Runs only when clear() stops a pending timer, e.g. for a debug line.
  public constructor(private readonly onClear?: () => void) {}

  public start(callback: () => void, delayMs: number) {
    this.clear();

    this.id = window.setTimeout(() => {
      this.id = undefined;
      callback();
    }, delayMs);
  }

  public clear() {
    if (this.id === undefined) {
      return;
    }

    window.clearTimeout(this.id);
    this.id = undefined;
    this.onClear?.();
  }

  // True from start() until the callback runs or clear() stops it.
  public isPending() {
    return this.id !== undefined;
  }
}

export default Timeout;
