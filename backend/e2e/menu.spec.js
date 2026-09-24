const { test, expect } = require("./fixtures");

test.describe.configure({ mode: "serial" });

test("GET /api/menu returns an empty array when no items exist", async ({ request }) => {
  const response = await request.get("/api/menu");

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual([]);
});

test("GET /api/menu paginates items when page and limit are provided", async ({ request, createMenuItem }) => {
  await createMenuItem({ name: "Pizza" });
  await createMenuItem({ name: "Pasta" });
  await createMenuItem({ name: "Wrap" });

  const response = await request.get("/api/menu?page=2&limit=2");
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.items).toHaveLength(1);
  expect(body.items[0].name).toBe("Wrap");
  expect(body.pagination).toEqual({ page: 2, limit: 2, totalItems: 3, totalPages: 2 });
});

test("POST /api/menu creates an item and it is returned by GET", async ({ request, createMenuItem }) => {
  const createdBody = await createMenuItem(menuItemData);

  expect(createdBody).toMatchObject(menuItemData);
  expect(createdBody._id).toBeDefined();

  const listed = await request.get("/api/menu");
  const listedBody = await listed.json();
  expect(listedBody).toHaveLength(1);
  expect(listedBody[0].name).toBe(menuItemData.name);
});

test("DELETE /api/menu/:id removes an item", async ({ request, createMenuItem }) => {
  const createdItem = await createMenuItem({ name: "Item to delete" });

  const response = await request.delete(`/api/menu/${createdItem._id}`);
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body).toMatchObject({ message: "Menu item deleted", id: createdItem._id });

  const deletedItem = await request.get(`/api/menu?page=1&limit=100`);
  const deletedItemsBody = await deletedItem.json();
  expect(deletedItemsBody.items.some((item) => item._id === createdItem._id)).toBe(false);
});

test("DELETE /api/menu/:id returns ITEM_NOT_FOUND for an unknown or malformed id", async ({ request }) => {
  for (const id of ["507f1f77bcf86cd799439011", "not-an-id"]) {
    const response = await request.delete(`/api/menu/${id}`);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.error.code).toBe("ITEM_NOT_FOUND");
  }
});

test("POST /api/menu rejects invalid input", async ({ request }) => {
  const response = await request.post("/api/menu", { data: { name: "Incomplete" } });
  const body = await response.json();

  expect(response.status()).toBe(400);
  expect(body.error.code).toBe("VALIDATION_ERROR");
});