const { test, expect } = require("./fixtures");

test("creates an order with denormalized item details and calculated total", async ({ placeOrder, customer }) => {
  const response = await placeOrder();
  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body).toMatchObject({ customer, status: "Order Received", totalPrice: 15 });
  expect(body.items[0]).toMatchObject({ name: "Burger", price: 7.5, quantity: 2 });
});

test("lists and retrieves created orders", async ({ request, placeOrder }) => {
  const created = await placeOrder({ quantity: 1 });
  const createdBody = await created.json();
  const list = await request.get("/api/orders");
  const found = await request.get(`/api/orders/${createdBody._id}`);
  const listedOrders = await list.json();

  expect(listedOrders.some((order) => order._id === createdBody._id)).toBe(true);
  expect(found.status()).toBe(200);
  expect((await found.json())._id).toBe(createdBody._id);
});

test("returns ORDER_NOT_FOUND for an unknown or malformed order id", async ({ request }) => {
  const unknown = await request.get("/api/orders/507f1f77bcf86cd799439011");
  const malformed = await request.get("/api/orders/not-an-object-id");

  for (const response of [unknown, malformed]) {
    expect(response.status()).toBe(404);
    expect((await response.json()).error.code).toBe("ORDER_NOT_FOUND");
  }
});

test("validates missing customer data, empty items and invalid quantities", async ({ request, customer }) => {
  const empty = await request.post("/api/orders", { data: { items: [], customer } });
  const invalidQuantity = await request.post("/api/orders", {
    data: { items: [{ menuItemId: "507f1f77bcf86cd799439011", quantity: 0 }], customer },
  });
  const missingCustomer = await request.post("/api/orders", {
    data: { items: [{ menuItemId: "507f1f77bcf86cd799439011", quantity: 1 }], customer: {} },
  });

  for (const response of [empty, invalidQuantity, missingCustomer]) {
    expect(response.status()).toBe(400);
    expect((await response.json()).error.code).toBe("VALIDATION_ERROR");
  }
});

test("returns ITEM_NOT_FOUND for a missing menu item", async ({ request, customer }) => {
  const response = await request.post("/api/orders", {
    data: { items: [{ menuItemId: "507f1f77bcf86cd799439011", quantity: 1 }], customer },
  });

  expect(response.status()).toBe(404);
  expect((await response.json()).error.code).toBe("ITEM_NOT_FOUND");
});

test("moves an order forward through statuses and rejects invalid or backward changes", async ({ request, placeOrder }) => {
  const created = await placeOrder({ quantity: 1 });
  const id = (await created.json())._id;
  const preparing = await request.patch(`/api/orders/${id}/status`, { data: { status: "Preparing" } });
  const backward = await request.patch(`/api/orders/${id}/status`, { data: { status: "Order Received" } });
  const invalid = await request.patch(`/api/orders/${id}/status`, { data: { status: "Cancelled" } });

  expect((await preparing.json()).status).toBe("Preparing");
  for (const response of [backward, invalid]) {
    expect(response.status()).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_STATUS_TRANSITION");
  }
});

test("returns ORDER_NOT_FOUND when updating a missing order", async ({ request }) => {
  const response = await request.patch("/api/orders/507f1f77bcf86cd799439011/status", {
    data: { status: "Preparing" },
  });

  expect(response.status()).toBe(404);
  expect((await response.json()).error.code).toBe("ORDER_NOT_FOUND");
});

test("deletes an order and no longer returns it", async ({ request, placeOrder }) => {
  const created = await placeOrder({ quantity: 1 });
  const id = (await created.json())._id;
  const deleted = await request.delete(`/api/orders/${id}`);
  const found = await request.get(`/api/orders/${id}`);

  expect(deleted.status()).toBe(204);
  expect(found.status()).toBe(404);
  expect((await found.json()).error.code).toBe("ORDER_NOT_FOUND");
});