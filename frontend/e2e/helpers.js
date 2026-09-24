const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const pizza = {
  _id: "pizza-1",
  name: "Margherita Pizza",
  description: "Tomato, mozzarella and basil",
  price: 9.99,
  imageUrl: "https://example.test/pizza.jpg",
};

const burger = {
  _id: "burger-1",
  name: "Burger",
  description: "Classic burger",
  price: 7.5,
  imageUrl: "https://example.test/burger.jpg",
};

async function fulfillJson(route, body, status = 200) {
  await route.fulfill({
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function mockApi(page, handler) {
  await page.route(/\/api\//, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await handler(route);
  });
}

async function mockMenu(page, items = [pizza]) {
  await mockApi(page, async (route) => {
    const { pathname } = new URL(route.request().url());
    if (route.request().method() === "GET" && pathname.endsWith("/menu")) {
      await fulfillJson(route, items);
      return;
    }
    await fulfillJson(route, { error: { message: "Not stubbed", code: "NOT_STUBBED" } }, 404);
  });
}

module.exports = { burger, corsHeaders, fulfillJson, mockApi, mockMenu, pizza };
