// Put an attribute back the way the host markup had it, including its absence. ↩️
function restoreAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}

export default restoreAttribute;
