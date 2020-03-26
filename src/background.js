console.log("heatmap started");

const TELEMETRY_CATEGORY = "chrome_heatmap";

(async () => {
  // Register telemetry events.
  await browser.telemetry.registerEvents(
    TELEMETRY_CATEGORY,
    {TELEMETRY_CATEGORY: {"methods": ["click", "command"],
                          "objects": ["chrome_element"],
                          "extra_keys": []}});
  // Record "click" and "command" events.
  for (let eventType of ["click", "command"]) {
    browser.chromeWindows.onEvent.addListener(async ({selector, type}) => {
      console.log(`event received: ${type}: ${selector}`);
      await browser.telemetry.recordEvent(
        TELEMETRY_CATEGORY, eventType, "chrome_element", selector);
    }, eventType);
  }
})();
