/**
 * Reuse a child the host markup already provides, or create one. 🧩
 *
 * @param parent - Where to look for the child, and where a new child goes.
 * @param tagName - The tag of a new child.
 * @param className - Finds an existing child and marks a new one.
 * @param setup - Prepares a new child before it gets added. Host markup stays untouched.
 */
function getOrCreateChild<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement | null | undefined,
  tagName: K,
  className: string,
  setup?: (child: HTMLElementTagNameMap[K]) => void,
) {
  const existing = parent?.querySelector<HTMLElement>(`.${className}`);

  if (existing) {
    return existing;
  }

  const child = document.createElement(tagName);
  child.classList.add(className);
  setup?.(child);
  parent?.appendChild(child);

  return child;
}

export default getOrCreateChild;
