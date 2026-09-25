const { test, expect } = require("./fixtures");

test("adds, updates and removes cart items with the correct total", async ({ page, mockMenu, burger }) => {
  await mockMenu([burger]);
  await page.goto("/");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.getByRole("link", { name: /cart/i }).click();

  await expect(page.getByText("₹7.50", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Total: ₹7.50" })).toBeVisible();

  await page.getByRole("spinbutton", { name: /burger quantity/i }).fill("3");
  await expect(page.getByRole("heading", { name: "Total: ₹22.50" })).toBeVisible();

  await page.getByRole("button", { name: /remove/i }).click();
  await expect(page.getByText(/your cart is empty/i)).toBeVisible();
});

test("rejects whitespace-only delivery details", async ({ page, mockMenu, burger }) => {
  await mockMenu([burger]);
  await page.goto("/");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.getByRole("link", { name: /cart/i }).click();

  await page.getByLabel("Name").fill("   ");
  await page.getByLabel("Address").fill("   ");
  await page.getByLabel("Phone").fill("   ");
  await page.getByRole("button", { name: /place order/i }).click();

  await expect(page.getByText("Name is required", { exact: true })).toBeVisible();
  await expect(page.getByText("Address is required", { exact: true })).toBeVisible();
  await expect(page.getByText("Phone is required", { exact: true })).toBeVisible();
});

test("starts a new cart after placing an order", async ({ page, mockMenu, burger, pizza, placeOrder }) => {
  await mockMenu([burger, pizza]);
  await placeOrder();
  await page.goto("/");
  await page.getByRole("button", { name: /add to cart/i }).first().click();
  await page.getByRole("link", { name: /cart/i }).click();

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Address").fill("1 Analytical Engine Way");
  await page.getByLabel("Phone").fill("1234567890");
  await page.getByRole("button", { name: /place order/i }).click();
  await expect(page).toHaveURL(/\/order\/order-1$/);

  await page.getByRole("link", { name: /order another meal/i }).click();
  await page.getByRole("button", { name: /add to cart/i }).nth(1).click();
  await page.getByRole("link", { name: /cart/i }).click();

  await expect(page.getByText("Margherita Pizza", { exact: true })).toBeVisible();
  await expect(page.getByText("Burger", { exact: true })).toHaveCount(0);
});
