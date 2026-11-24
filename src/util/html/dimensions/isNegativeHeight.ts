/*
 * Zero means "no height yet", which figureMinHeight() handles. Rounding never turns
 * a valid width and ratio into a negative height.
 */
function isNegativeHeight(height: number | undefined) {
  return height !== undefined && Number.isInteger(height) && height < 0;
}

export default isNegativeHeight;
