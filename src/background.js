console.log("heatmap started");

(async () => {
  // registering telemetry events
  await browser.telemetry.registerEvents("test_category", {"test_category": {"methods":["click", "command"], "objects":["click_object", "command_object"], "extra_keys":["selector"]}})

  // recording events
  browser.chromeWindows.onEvent.addListener(async (e) => {
    console.log(`event received: ${e}`);
    await browser.telemetry.recordEvent("test_category", "click", "click_object", JSON.stringify(e));
  }, "click");
  browser.chromeWindows.onEvent.addListener(async (e) => {
    console.log(`event received: ${e}`);
    await browser.telemetry.recordEvent("test_category", "command", "command_object", JSON.stringify(e));
  }, "command");
  // do "click" as well.
})();
