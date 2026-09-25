const { test: base, expect } = require("@playwright/test");
const { burger, mockMenu, pizza, mockApi, fulfillJson } = require("./helpers");

const test = base.extend({
  burger: async ({}, use) => use(burger),
  pizza: async ({}, use) => use(pizza),
  mockMenu: async ({ page }, use) => use((items = [pizza]) => mockMenu(page, items)),
  placeOrder: async ({ page }, use) =>
    use(async () =>
      mockApi(page, async (route) => {
        const { pathname } = new URL(route.request().url());
        if (route.request().method() === "POST" && pathname.endsWith("/orders")) {
          await fulfillJson(route, { _id: "order-1", status: "Order Received" }, 201);
          return;
        }
        await fulfillJson(route, { error: { message: "Not stubbed", code: "NOT_STUBBED" } }, 404);
      }),
    ),
  mockOrder: async ({ page }, use) =>
    use(({ order = { _id: "order-1", status: "Preparing", totalPrice: 15 }, onRequest } = {}) =>
      mockApi(page, async (route) => {
        const { pathname } = new URL(route.request().url());
        if (route.request().method() === "GET" && pathname.endsWith(`/orders/${order._id}`)) {
          onRequest?.();
          await fulfillJson(route, order);
          return;
        }
        await fulfillJson(route, { error: { message: "Not stubbed", code: "NOT_STUBBED" } }, 404);
      })
    ),
});

module.exports = { test, expect };