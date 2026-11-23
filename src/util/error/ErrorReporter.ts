import Resource from "../../resource";
import type { VideomailClientOptions } from "../../types/options";
import type VideomailError from "./VideomailError";

// Long enough to absorb a failure that repeats on every frame or retry.
const DUPLICATE_REPORT_WINDOW_MS = 10_000;

/*
 * Sends error reports to the Videomail server, once per distinct problem.
 *
 * createError() only builds errors. Code that actually handles an error (the
 * container's ERROR listener, the public promise APIs) decides to report it here.
 */
class ErrorReporter {
  private readonly options: VideomailClientOptions;
  private readonly lastReportedAtBySignature = new Map<string, number>();

  public constructor(options: VideomailClientOptions) {
    this.options = options;
  }

  // The same message with the same code counts as the same problem.
  private getSignature(err: VideomailError) {
    return `${err.code ?? ""}|${err.message}`;
  }

  private isRecentDuplicate(signature: string, nowMs: number) {
    const reportedAtMs = this.lastReportedAtBySignature.get(signature);

    return (
      reportedAtMs !== undefined && nowMs - reportedAtMs < DUPLICATE_REPORT_WINDOW_MS
    );
  }

  public report(err: VideomailError) {
    if (!this.options.reportErrors) {
      return;
    }

    const signature = this.getSignature(err);
    const nowMs = Date.now();

    if (this.isRecentDuplicate(signature, nowMs)) {
      this.options.logger.debug(`ErrorReporter: skipped a repeated "${err.message}"`);
      return;
    }

    this.lastReportedAtBySignature.set(signature, nowMs);

    const resource = new Resource(this.options);

    // Fire and forget: a failing report must never break recording.
    resource.reportError(err).catch((reason: unknown) => {
      console.error(reason);
    });
  }
}

export default ErrorReporter;
