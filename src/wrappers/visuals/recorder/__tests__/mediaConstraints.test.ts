import mergeWithDefaultOptions from "../../../../util/options/mergeWithDefaultOptions";
import createUserMediaConstraints from "../mediaConstraints";

describe("createUserMediaConstraints", () => {
  it("uses configured frame rate and dimensions", () => {
    const options = mergeWithDefaultOptions({
      video: { fps: 12, height: 240, width: 320 },
    });

    expect(
      createUserMediaConstraints({
        facingMode: "user",
        options,
      }),
    ).toEqual({
      audio: false,
      video: {
        frameRate: { ideal: 12 },
        height: { ideal: 240 },
        width: { ideal: 320 },
      },
    });
  });

  it("uses the available recorder width when no width is configured", () => {
    const options = mergeWithDefaultOptions({
      video: { height: 0, width: 0 },
    });

    expect(
      createUserMediaConstraints({
        facingMode: "user",
        limitedWidth: { unit: "px", value: 320 },
        options,
      }).video.width,
    ).toEqual({ ideal: 320 });
  });

  it("sets the active facing mode while recovering the camera", () => {
    const options = mergeWithDefaultOptions();

    expect(
      createUserMediaConstraints({
        facingMode: "environment",
        options,
        userMediaParams: { recovering: true },
      }).video.facingMode,
    ).toBe("environment");
  });
});
