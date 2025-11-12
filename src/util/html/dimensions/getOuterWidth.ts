function getOuterWidth(element: HTMLElement) {
  let rect = element.getBoundingClientRect();

  let outerWidth = rect.right - rect.left;

  if (outerWidth < 1) {
    // Last effort, can happen when replaying only
    rect = document.body.getBoundingClientRect();
    outerWidth = rect.right - rect.left;
  }

  return outerWidth;
}

export default getOuterWidth;
