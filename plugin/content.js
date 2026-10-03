const DARK_MODE_STYLESHEET_ID = "canvas-dark-mode-stylesheet";
const DARK_MODE_ENABLED_KEY = "darkModeEnabled";
const AUTO_SCHEDULE_ENABLED_KEY = "autoScheduleEnabled";
const NIGHT_START_HOUR = 18;
const NIGHT_END_HOUR = 6;
const defaultSettings = {
  [DARK_MODE_ENABLED_KEY]: true,
  [AUTO_SCHEDULE_ENABLED_KEY]: false
};
let settings = { ...defaultSettings };
let autoScheduleEnabled = false;
let scheduleTimer;

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

function applyStoredDarkMode() {
  autoScheduleEnabled = settings[AUTO_SCHEDULE_ENABLED_KEY];
  setDarkModeEnabled(getDarkModeEnabled(settings));
  scheduleNextUpdate();
}

function getDarkModeEnabled(settings) {
  if (!autoScheduleEnabled) {
    return settings[DARK_MODE_ENABLED_KEY];
  }

  const hour = new Date().getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

function scheduleNextUpdate() {
  if (scheduleTimer) {
    clearTimeout(scheduleTimer);
  }
  if (!autoScheduleEnabled) {
    return;
  }

  const now = new Date();
  const nextBoundary = new Date(now);
  const isNight = now.getHours() >= NIGHT_START_HOUR || now.getHours() < NIGHT_END_HOUR;
  nextBoundary.setHours(isNight ? NIGHT_END_HOUR : NIGHT_START_HOUR, 0, 0, 0);
  if (nextBoundary <= now) {
    nextBoundary.setDate(nextBoundary.getDate() + 1);
  }

  scheduleTimer = setTimeout(() => {
    applyStoredDarkMode();
  }, nextBoundary.getTime() - now.getTime());
}

chrome.storage.local.get(defaultSettings, (storedSettings) => {
  settings = storedSettings;
  if (document.head) {
    applyStoredDarkMode();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      applyStoredDarkMode();
    }, { once: true });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }
  if (changes[DARK_MODE_ENABLED_KEY] || changes[AUTO_SCHEDULE_ENABLED_KEY]) {
    if (changes[DARK_MODE_ENABLED_KEY]) {
      settings[DARK_MODE_ENABLED_KEY] =
        changes[DARK_MODE_ENABLED_KEY].newValue ?? defaultSettings[DARK_MODE_ENABLED_KEY];
    }
    if (changes[AUTO_SCHEDULE_ENABLED_KEY]) {
      settings[AUTO_SCHEDULE_ENABLED_KEY] =
        changes[AUTO_SCHEDULE_ENABLED_KEY].newValue ?? defaultSettings[AUTO_SCHEDULE_ENABLED_KEY];
    }
    applyStoredDarkMode();
  }
});
