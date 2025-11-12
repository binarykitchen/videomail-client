import { Dimension } from "../../../types/dimension";

// TODO Implement event listener when viewport width has changed to reconfigure dimensions
function useFullWidth(mobileBreakPoint?: number) {
  if (mobileBreakPoint === undefined) {
    return undefined;
  }

  // This excludes width of any vertical scrollbars
  const viewportWidth = window.innerWidth;

  if (viewportWidth < mobileBreakPoint) {
    const dimension: Dimension = {
      unit: "%",
      value: 100,
    };

    return dimension;
  }

  return undefined;
}

export default useFullWidth;
