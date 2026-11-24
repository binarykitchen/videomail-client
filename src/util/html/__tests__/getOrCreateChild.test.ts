import getOrCreateChild from "../getOrCreateChild";

describe("getOrCreateChild", () => {
  it("reuses a child from the host markup without touching it", () => {
    const parent = document.createElement("div");
    const existing = document.createElement("span");
    existing.className = "note";
    parent.appendChild(existing);
    const setup = vi.fn();

    const child = getOrCreateChild(parent, "p", "note", setup);

    expect({ child, setupCalls: setup.mock.calls.length }).toEqual({
      child: existing,
      setupCalls: 0,
    });
  });

  it("creates, marks, sets up and appends a missing child", () => {
    const parent = document.createElement("div");

    const child = getOrCreateChild(parent, "button", "switch", (button) => {
      button.textContent = "⤾";
    });

    expect({
      tagName: child.tagName,
      className: child.className,
      text: child.textContent,
      parent: child.parentElement,
    }).toEqual({ tagName: "BUTTON", className: "switch", text: "⤾", parent });
  });
});
