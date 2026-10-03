const DARK_MODE_ENABLED_KEY = "darkModeEnabled";
const AUTO_SCHEDULE_ENABLED_KEY = "autoScheduleEnabled";
const toggle = document.getElementById("dark-mode-toggle");
const autoScheduleToggle = document.getElementById("auto-schedule-toggle");

chrome.storage.local.get({
  [DARK_MODE_ENABLED_KEY]: true,
  [AUTO_SCHEDULE_ENABLED_KEY]: false
}, (settings) => {
  toggle.checked = settings[DARK_MODE_ENABLED_KEY];
  autoScheduleToggle.checked = settings[AUTO_SCHEDULE_ENABLED_KEY];
  toggle.disabled = autoScheduleToggle.checked;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ [DARK_MODE_ENABLED_KEY]: toggle.checked });
});

autoScheduleToggle.addEventListener("change", () => {
  toggle.disabled = autoScheduleToggle.checked;
  chrome.storage.local.set({
    [AUTO_SCHEDULE_ENABLED_KEY]: autoScheduleToggle.checked
  });
});
