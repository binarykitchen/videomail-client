import VideomailClient from "../client";

const mock = {
  onHide() {},
};

describe("Client", () => {
  test("Constructor with default arguments", () => {
    const videomailClient = new VideomailClient();
    expect(videomailClient.isBuilt()).toBeFalsy();
  });

  test("Constructor throws error when width is not divisible by two", () => {
    expect(() => {
      new VideomailClient({ video: { width: 99 } });
    }).toThrowError(/Width must be divisible by two/u);
  });

  test("Showing it sets its built flag to true", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();

    expect(videomailClient.isBuilt()).toBeTruthy();
  });

  test("Hiding emits hide event", () => {
    const videomailClient = new VideomailClient();

    const onHideSpy = vi.spyOn(mock, "onHide");

    videomailClient.show();

    videomailClient.on("HIDE", () => {
      mock.onHide();
    });

    videomailClient.hide();

    expect(onHideSpy).toHaveBeenCalledTimes(1);
  });

  test("On unload, hidden and not built", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();
    videomailClient.unload();

    expect(videomailClient.isBuilt()).toBeFalsy();
  });

  test("Not dirty when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isDirty()).toBeFalsy();
  });

  test("Not recording when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isRecording()).toBeFalsy();
  });
});
