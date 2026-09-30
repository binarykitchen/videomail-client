import adjustButton from "../adjustButton";

describe("adjustButton", () => {
  it("hides a button by default", () => {
    const button = document.createElement("button");

    adjustButton(button);

    expect([button.style.display, button.style.getPropertyPriority("display")]).toEqual([
      "none",
      "important",
    ]);
  });

  it("keeps a requested button visible", () => {
    const button = document.createElement("button");

    adjustButton(button, true);

    expect(button.style.display).toBe("");
  });

  it("sets the requested button type", () => {
    const button = document.createElement("button");

    adjustButton(button, true, "submit");

    expect(button.type).toBe("submit");
  });

  it("disables the button when requested", () => {
    const button = document.createElement("button");

    adjustButton(button, true, "button", true);

    expect(button.disabled).toBe(true);
  });

  it("returns the adjusted button", () => {
    const button = document.createElement("button");

    expect(adjustButton(button, true)).toBe(button);
  });
});
