import isVirtualCamera from "../isVirtualCamera";

describe("isVirtualCamera", () => {
  it.each([
    "OBS Camera",
    "Virtual Camera",
    "ManyCam Video",
    "vCaM",
    "SplitCam",
    "DroidCam",
  ])("detects the virtual-camera label %s without capability APIs", (label) => {
    expect(isVirtualCamera({ label })).toBe(true);
  });

  it.each(["Integrated Camera", "FaceTime HD Camera", "USB Camera", ""])(
    "does not classify %s as virtual without capability APIs",
    (label) => {
      expect(isVirtualCamera({ label })).toBe(false);
    },
  );
});
