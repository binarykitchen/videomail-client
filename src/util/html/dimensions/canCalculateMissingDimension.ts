// A missing width or height can be calculated once the video or the options know the other side.
function canCalculateMissingDimension(
  dimension: number | undefined,
  otherVideoDimension: number,
  otherOptionDimension: number | undefined,
) {
  return !dimension && (otherVideoDimension > 0 || Boolean(otherOptionDimension));
}
export default canCalculateMissingDimension;
