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
        facingMode: "user",
        frameRate: { ideal: 12 },
        height: { ideal: 240 },
        width: { ideal: 320 },
      },
    });
  });

  it.each(["user", "environment"])(
    "uses the configured %s facing mode on initial camera access",
    (facingMode) => {
      const options = mergeWithDefaultOptions({ video: { facingMode } });

      expect(
        createUserMediaConstraints({
          facingMode: options.video.facingMode,
          options,
        }).video.facingMode,
      ).toBe(facingMode);
    },
  );

  it("preserves structured facing mode constraints on initial camera access", () => {
    const options = mergeWithDefaultOptions({
      video: { facingMode: { exact: "environment" } },
    });

    expect(
      createUserMediaConstraints({
        facingMode: options.video.facingMode,
        options,
      }).video.facingMode,
    ).toEqual({ exact: "environment" });
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

  it.each([
    { current: "user", target: "environment" },
    { current: "environment", target: "user" },
  ])("switches from $current to $target", ({ current, target }) => {
    const options = mergeWithDefaultOptions({ video: { facingMode: current } });

    expect(
      createUserMediaConstraints({
        facingMode: current,
        options,
        userMediaParams: { switchingFacingMode: target },
      }).video.facingMode,
    ).toBe(target);
  });

  it.each(["user", "environment"])(
    "keeps the active %s facing mode while recovering the camera",
    (facingMode) => {
      const options = mergeWithDefaultOptions();

      expect(
        createUserMediaConstraints({
          facingMode,
          options,
          userMediaParams: { recovering: true },
        }).video.facingMode,
      ).toBe(facingMode);
    },
  );
});
