class HTTPVideomailError extends Error {
  // Distinguish our errors from errors raised by the host app.
  public override name = "VideomailError";

  public code?: string | undefined;
  public status?: number | undefined;
  public explanation?: string | undefined;
  public constraint?: string | undefined;
  public usedConstraints?: MediaStreamConstraints | undefined;
}

export default HTTPVideomailError;
