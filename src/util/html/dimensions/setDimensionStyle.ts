import type { Dimension } from "../../../types/dimension";

// Apply a calculated size, or drop the inline one so the stylesheet decides again. 📐
function setDimensionStyle(
  element: HTMLElement,
  property: "width" | "height",
  dimension?: Dimension,
) {
  if (dimension?.value) {
    element.style[property] = `${dimension.value}${dimension.unit}`;
  } else {
    element.style.removeProperty(property);
  }
}

export default setDimensionStyle;
