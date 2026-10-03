const DARK_MODE_STYLESHEET_ID = "canvas-dark-mode-stylesheet";
const DARK_MODE_ENABLED_KEY = "darkModeEnabled";

function setDarkModeEnabled(enabled) {
  const existingStylesheet = document.getElementById(DARK_MODE_STYLESHEET_ID);

  if (enabled && !existingStylesheet && document.head) {
    const stylesheet = document.createElement("link");
    stylesheet.id = DARK_MODE_STYLESHEET_ID;
    stylesheet.rel = "stylesheet";
    stylesheet.href = chrome.runtime.getURL("css/styles.css");
    document.head.appendChild(stylesheet);
  } else if (!enabled && existingStylesheet) {
    existingStylesheet.remove();
  }
}

function applyStoredDarkMode(settings) {
  setDarkModeEnabled(settings[DARK_MODE_ENABLED_KEY]);
}

chrome.storage.local.get({ [DARK_MODE_ENABLED_KEY]: true }, (settings) => {
  if (document.head) {
    applyStoredDarkMode(settings);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      applyStoredDarkMode(settings);
    }, { once: true });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[DARK_MODE_ENABLED_KEY]) {
    setDarkModeEnabled(changes[DARK_MODE_ENABLED_KEY].newValue);
  }
});
