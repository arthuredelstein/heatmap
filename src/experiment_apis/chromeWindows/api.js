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

const classNameToSelector = className => {
  const classSegments = className.split(/\s+/);
  return "." + classSegments.join(".");
};

const selectorFromElement = (element) => {
  let selector = "";
  for (x = element; x !== null; x = x.parentElement) {
    let segment = x.tagName;
    if (x.id === "") {
      segment += (x.className !== "") ? classNameToSelector(x.className) : "";
    } else {
      segment += `#${x.id}`;
    }
    let newSelector = (segment + " " + selector).trim();
    if (newSelector.length > 80) {
      break;
    } else {
      selector = newSelector;
    }
  }
  return selector;
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
                          "windowID": windowID.toString(),
                          "selector": selectorFromElement(event.target)
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
