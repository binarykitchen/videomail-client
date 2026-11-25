function getLanguagesValue() {
  const languageList = navigator.languages;

  if (languageList.length > 0) {
    return languageList.join(",");
  }

  // navigator.languages is empty in some minimal/headless environments.
  return navigator.language || "none";
}

export default getLanguagesValue;
