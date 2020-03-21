/*
const winEnum = Services.wm.getEnumerator(null);
const aWindow = winEnum.getNext();
// Usually figures out the element involved in a click.
aWindow.addEventListener("click", e => console.log("click from chrome window", e));
aWindow.addEventListener("command", e => console.log("command received", e));

// registering telemetry events
await browser.telemetry.registerEvents("test_category", {"test_category": {"methods":["click"], "objects":["click_object"], "extra_keys":["selector"]}})

// recording events
await browser.telemetry.recordEvent("test_category", "click", "click_object", "dynamicValue", {"selector": "dynamicSelector"})
*/

console.log("hello");

//(async () => {
//  console.log("devtools.chrome.enabled",
//              await browser.chromeWindows.getBoolPref("devtools.chrome.enabled"));
//})()
