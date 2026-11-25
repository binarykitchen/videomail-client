// Superagent attaches the server's HTTP response to errors from failed requests.
function hasResponse(exc: unknown): exc is Error & { response: unknown } {
  return exc instanceof Error && "response" in exc;
}

export default hasResponse;
