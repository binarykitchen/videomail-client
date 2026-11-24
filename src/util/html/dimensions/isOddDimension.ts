// The server's video encoder needs even widths and heights.
function isOddDimension(dimension: number | undefined) {
  return dimension !== undefined && dimension % 2 !== 0;
}
export default isOddDimension;
