const { test, expect } = require("./fixtures");

test("loads the current order immediately and refreshes it while active", async ({ page, mockOrder }) => {
  await page.clock.install();
  let requestCount = 0;

  await mockOrder({ onRequest: () => requestCount += 1 });

  await page.goto("/order/order-1");
  await expect(page.locator(".current-status")).toHaveText("Preparing");
  expect(requestCount).toBeGreaterThanOrEqual(1);

  await page.clock.fastForward(4000);
  await expect.poll(() => requestCount).toBeGreaterThanOrEqual(2);
});
