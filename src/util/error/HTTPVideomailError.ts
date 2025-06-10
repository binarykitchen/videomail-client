class HTTPVideomailError extends Error {
  public code?: string | undefined;
  public status?: number | undefined;
  public explanation?: string | undefined;
}

export default HTTPVideomailError;
