import VideomailClient from "../client";

const mock = {
  onHide() {},
};

describe("client", () => {
  it("constructor with default arguments", () => {
    const videomailClient = new VideomailClient();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("constructor throws error when width is not divisible by two", () => {
    expect(() => {
      new VideomailClient({ video: { width: 99 } });
    }).toThrow(/Width must be divisible by two/u);
  });

  it("showing it sets its built flag to true", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();

    expect(videomailClient.isBuilt()).toBe(true);
  });

  it("hiding emits hide event", () => {
    const videomailClient = new VideomailClient();

    const onHideSpy = vi.spyOn(mock, "onHide");

    videomailClient.show();

    videomailClient.on("HIDE", () => {
      mock.onHide();
    });

    videomailClient.hide();

    expect(onHideSpy).toHaveBeenCalledTimes(1);
  });

  it("on unload, hidden and not built", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();
    videomailClient.unload();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("not dirty when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isDirty()).toBe(false);
  });

  it("not recording when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isRecording()).toBe(false);
  });
});
