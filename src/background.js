console.log("heatmap started");

(async () => {
  // Register telemetry events.
  await browser.telemetry.registerEvents("test_category", {"test_category": {"methods":["click", "command"], "objects":["click_object", "command_object"], "extra_keys":["selector"]}})
  // Record "click" and "command" events.
  browser.chromeWindows.onEvent.addListener(async (e) => {
    console.log(`event received: ${JSON.stringify(e)}`);
    await browser.telemetry.recordEvent("test_category", "click", "click_object", JSON.stringify(e));
  }, "click");
  browser.chromeWindows.onEvent.addListener(async (e) => {
    console.log(`event received: ${JSON.stringify(e)}`);
    await browser.telemetry.recordEvent("test_category", "command", "command_object", JSON.stringify(e));
  }, "command");
})();
