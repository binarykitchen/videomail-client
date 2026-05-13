class HTTPVideomailError extends Error {
  // This helps to distinguish between errors thrown by the videomail-client package and other errors
  public override name = "VideomailError";

  public code?: string | undefined;
  public status?: number | undefined;
  public explanation?: string | undefined;
}

export default HTTPVideomailError;
