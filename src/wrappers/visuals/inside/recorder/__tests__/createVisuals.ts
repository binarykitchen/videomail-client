import type Visuals from "../../../../visuals";

// Just enough of Visuals for an overlay to find, create and append its element.
function createVisuals() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
  } as unknown as Visuals;

  return { element, visuals };
}

export default createVisuals;
