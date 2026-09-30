import mergeWithDefaultOptions from "../../../../../util/options/mergeWithDefaultOptions";
import Visuals from "../../../../visuals";
import FacingMode from "../facingMode";

function createVisuals() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
  } as unknown as Visuals;

  return { element, visuals };
}

describe("FacingMode", () => {
  it("builds a hidden camera-switch button", () => {
    const { element, visuals } = createVisuals();
    const facingMode = new FacingMode(visuals, mergeWithDefaultOptions());

    facingMode.build();

    expect(element.querySelector<HTMLButtonElement>(".facingMode")).toMatchObject({
      style: expect.objectContaining({ display: "none" }),
      textContent: "⤾",
    });
  });

  it("shows the camera-switch button", () => {
    const { element, visuals } = createVisuals();
    const facingMode = new FacingMode(visuals, mergeWithDefaultOptions());
    facingMode.build();

    facingMode.show();

    expect(element.querySelector<HTMLElement>(".facingMode")?.style.display).toBe("");
  });

  it("emits a switch event when clicked", () => {
    const { element, visuals } = createVisuals();
    const facingMode = new FacingMode(visuals, mergeWithDefaultOptions());
    const listener = vi.fn();
    facingMode.on("SWITCH_FACING_MODE", listener);
    facingMode.build();

    element.querySelector<HTMLButtonElement>(".facingMode")?.click();

    expect(listener).toHaveBeenCalledOnce();
  });
});
