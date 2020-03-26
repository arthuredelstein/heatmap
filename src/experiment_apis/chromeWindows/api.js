const attachedEvents = [];

const addEventListener = (element, eventType, callback) => {
  element.addEventListener(eventType, callback);
  attachedEvents.push({eventType, element, callback});
};

const removeAllEventListeners = () => {
  for (let {element, eventType, callback} of attachedEvents) {
    element.removeEventListener(eventType, callback);
  }
};

this.chromeWindows = class extends ExtensionAPI {
  getAPI(context) {
    const { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm', {});
    const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm", {});
    const { EventManager } = ExtensionCommon;
    const {Cc: classes, Ci: interfaces} = Components;
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
            const callback = (windowID, event) => {
              Services.console.logStringMessage(`${eventType}: ${event}`);
              fire.async({"type": event.type,
                          "id": event.target.id,
                          "tag": event.target.tagName,
                          "class": event.target.className,
                          "windowID": windowID
                         });
            };
            const setupWindow = w => addEventListener(
              w,
              eventType,
              event => callback(w.windowUtils.outerWindowID, event));
            const windowObserver = {
              observe: function (subject, topic, data) {
                if (topic === "domwindowopened") {
                  setupWindow(subject);
                }
              }
            };
            initialWindows.map(setupWindow);
            Services.ww.registerNotification(windowObserver);
            Services.console.logStringMessage("event listeners added");
            return () => {
              Services.ww.unregisterNotification(windowObserver);
              removeAllEventListeners();
              Services.console.logStringMessage("event listeners removed");
            };
          }
        }).api()
      }
    }
  }
};
