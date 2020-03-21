this.chromeWindows = class extends ExtensionAPI {
  getAPI() {
    const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm', {});
    return {
      chromeWindows: {
        async getBoolPref(prefName, defaultValue) {
          return Services.prefs.getBoolPref(prefName, defaultValue);
        },
      },
    };
  }
};
