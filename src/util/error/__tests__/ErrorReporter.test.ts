import Resource from "../../../resource";
import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import ErrorReporter from "../ErrorReporter";
import VideomailError from "../VideomailError";

function createFixture(reportErrors = true) {
  const options = mergeWithDefaultOptions({ reportErrors });
  const reporter = new ErrorReporter(options);
  // Never send real reports from tests.
  const report = vi.spyOn(Resource.prototype, "reportError").mockResolvedValue(undefined);

  return { options, report, reporter };
}

describe("ErrorReporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends a report for a new error", () => {
    const { options, report, reporter } = createFixture();

    reporter.report(new VideomailError("Camera failed", options));

    expect(report).toHaveBeenCalledOnce();
  });

  it("skips the same error within ten seconds", () => {
    vi.useFakeTimers();
    const { options, report, reporter } = createFixture();
    reporter.report(new VideomailError("Camera failed", options));
    vi.advanceTimersByTime(9_999);

    reporter.report(new VideomailError("Camera failed", options));

    expect(report).toHaveBeenCalledOnce();
  });

  it("reports the same error again after ten seconds", () => {
    vi.useFakeTimers();
    const { options, report, reporter } = createFixture();
    reporter.report(new VideomailError("Camera failed", options));
    vi.advanceTimersByTime(10_000);

    reporter.report(new VideomailError("Camera failed", options));

    expect(report).toHaveBeenCalledTimes(2);
  });

  it("reports a different error right away", () => {
    const { options, report, reporter } = createFixture();
    reporter.report(new VideomailError("Camera failed", options));

    reporter.report(new VideomailError("Microphone failed", options));

    expect(report).toHaveBeenCalledTimes(2);
  });

  it("sends nothing when error reporting is turned off", () => {
    const { options, report, reporter } = createFixture(false);

    reporter.report(new VideomailError("Camera failed", options));

    expect(report).not.toHaveBeenCalled();
  });
});
