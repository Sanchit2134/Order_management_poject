const { test, expect } = require("./fixtures");
const { fulfillJson, mockApi } = require("./helpers");

test("renders menu details from the API and adds the selected item", async ({ page, mockMenu, pizza }) => {
  await mockMenu([pizza]);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: pizza.name })).toBeVisible();
  await expect(page.getByText(pizza.description)).toBeVisible();
  await expect(page.getByText("₹9.99")).toBeVisible();
  await expect(page.getByRole("img", { name: pizza.name })).toHaveAttribute("src", pizza.imageUrl);

  await page.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByRole("link", { name: /cart \(1\)/i })).toBeVisible();
});

test("loads the next menu page and appends its items", async ({ page, pizza, burger }) => {
  await mockApi(page, async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname.endsWith("/menu")) {
      const pageNumber = requestUrl.searchParams.get("page");
      const items = pageNumber === "2" ? [burger] : [pizza];
      await fulfillJson(route, {
        items,
        pagination: { page: Number(pageNumber), limit: 1, totalItems: 2, totalPages: 2 },
      });
      return;
    }
    await fulfillJson(route, { error: { message: "Not stubbed", code: "NOT_STUBBED" } }, 404);
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: pizza.name })).toBeVisible();
  await expect(page.getByRole("button", { name: /load more/i })).toBeVisible();

  await page.getByRole("button", { name: /load more/i }).click();

  await expect(page.getByRole("heading", { name: burger.name })).toBeVisible();
  await expect(page.getByRole("button", { name: /load more/i })).toHaveCount(0);
});
