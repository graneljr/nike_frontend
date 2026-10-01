export const DISPLAY_SETTINGS_KEY = "nike-store-display-settings";

export const defaultDisplaySettings = {
  textSize: "default",
  reduceMotion: false,
};

export function getDisplaySettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(DISPLAY_SETTINGS_KEY) || "{}");
    return {
      textSize: ["small", "default", "large"].includes(saved.textSize)
        ? saved.textSize
        : defaultDisplaySettings.textSize,
      reduceMotion: Boolean(saved.reduceMotion),
    };
  } catch {
    return defaultDisplaySettings;
  }
}

export function applyDisplaySettings(settings) {
  const root = document.documentElement;
  root.dataset.textSize = settings.textSize;
  root.dataset.reduceMotion = String(settings.reduceMotion);
}

export function saveDisplaySettings(settings) {
  localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(settings));
  applyDisplaySettings(settings);
}
