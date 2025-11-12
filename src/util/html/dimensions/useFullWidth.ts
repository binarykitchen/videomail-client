import { Dimension } from "../../../types/dimension";

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
