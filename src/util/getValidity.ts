function getValidity(element: Element) {
  const validity =
    "validity" in element ? (element.validity as ValidityState) : undefined;

  return validity;
}

export default getValidity;
