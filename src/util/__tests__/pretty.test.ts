import pretty from "../pretty";

describe("pretty", () => {
  test("returns ID of any HTML element", () => {
    const element = document.createElement("div");
    element.id = "i am id";

    const output = pretty(element);
    expect(output).toBe("#i am id");
  });

  test("returns class name of any HTML element", () => {
    const element = document.createElement("div");
    element.classList.add("i-am-class");

    const output = pretty(element);
    expect(output).toBe(".i-am-class");
  });
});
