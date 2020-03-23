this.chromeWindows = class extends ExtensionAPI {
  getAPI(context) {
    const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm', {});
    const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm", {});
    const { EventManager } = ExtensionCommon;
    const initialWindows = [...Services.wm.getEnumerator(null)];
    return {
      chromeWindows: {
        async getBoolPref(prefName, defaultValue) {
          return Services.prefs.getBoolPref(prefName, defaultValue);
        },
        onEvent: new EventManager({
          context,
          name: "chromeWindows.onEvent",
          register: (fire, eventType) => {
            const callback = event => {
              Services.console.logStringMessage(`${eventType}: ${event}`);
              fire.async({"type": event.type,
                          "targetID": event.target.id,
                          "tag": event.target.tagName});
            };
            initialWindows.map(w => w.addEventListener(eventType, callback));
            Services.console.logStringMessage("event listeners added");
            return () => {
              initialWindows.map(w => w.removeEventListener(eventType, callback));
              Services.console.logStringMessage("event listeners removed");
            };
          }
        }).api()
      }
    }
  }
};
