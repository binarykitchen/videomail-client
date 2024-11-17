class HTTPError extends Error {
  public code?: string | undefined;
  public status?: number | undefined;
}

export default HTTPError;
