const DARK_MODE_ENABLED_KEY = "darkModeEnabled";
const toggle = document.getElementById("dark-mode-toggle");

chrome.storage.local.get({ [DARK_MODE_ENABLED_KEY]: true }, (settings) => {
  toggle.checked = settings[DARK_MODE_ENABLED_KEY];
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ [DARK_MODE_ENABLED_KEY]: toggle.checked });
});
