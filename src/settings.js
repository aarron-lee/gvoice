const path = require("path");
const fs = require("fs");

const IS_WINDOW_HIDDEN = "isWindowHidden";

const DEFAULT_SETTINGS = {
  appVersion: undefined,
  [IS_WINDOW_HIDDEN]: false,
};

function initializeSettings(app) {
  const appVersion = app.getVersion();
  const CONFIG_PATH = app.getPath("appData");
  const SETTINGS_PATH = path.join(CONFIG_PATH, "gvoice-electron.json");

  let settings = DEFAULT_SETTINGS;

  const saveSettings = () => {
    settings.appVersion = appVersion;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
  };

  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const rawData = fs.readFileSync(SETTINGS_PATH);

      settings = JSON.parse(rawData);
    } else {
      // initialize settings file
      saveSettings();
    }
  } catch (e) {
    console.error(e);
  }

  const setItem = (key, value) => {
    settings[key] = value;
    saveSettings();
  };

  const getItem = (key) => settings[key];

  const getSettings = () => settings;

  // save settings to disk on initialization
  saveSettings();

  return { getSettings, setItem, getItem };
}

module.exports = {
  initializeSettings,
  IS_WINDOW_HIDDEN,
};
