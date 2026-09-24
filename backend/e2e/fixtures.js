const { test: base, expect } = require("@playwright/test");

const customer = {
  name: "Jane Doe",
  address: "123 Main Street",
  phone: "555-0100",
};

const menuItem = {
  name: "Burger",
  description: "veg burger",
  price: 7.5,
  imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
};

const test = base.extend({
  customer: [customer, { option: true }],
  menuItem: [menuItem, { option: true }],
  createMenuItem: async ({ request }, use) => {
    await use(async (overrides = {}) => {
      const response = await request.post("/api/menu", {
        data: { ...menuItem, ...overrides },
      });
      expect(response.status()).toBe(201);
      return response.json();
    });
  },
  placeOrder: async ({ request, customer, createMenuItem }, use) => {
    await use(async ({ item, quantity = 2 } = {}) => {
      const menuItemToOrder = item || (await createMenuItem());
      return request.post("/api/orders", {
        data: {
          items: [{ menuItemId: menuItemToOrder._id, quantity }],
          customer,
        },
      });
    });
  },
});

module.exports = { test, expect, customer, menuItem };