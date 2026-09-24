# API Specification

Base URL: `http://localhost:5000/api`

All responses are JSON. All errors follow:
```json
{ "error": { "message": "Human readable message", "code": "MACHINE_CODE" } }
```

---

## Menu

### `GET /api/menu`
Returns all menu items.

Optional pagination is available with `page` and `limit` query parameters. When
provided, `page` starts at 1 and `limit` must be between 1 and 100.

**200 OK (paginated)**
```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Invalid pagination values return `400 INVALID_PAGINATION`.

**200 OK**
```json
[
  {
    "_id": "662f1a...",
    "name": "Margherita Pizza",
    "description": "Classic tomato, mozzarella, basil",
    "price": 9.99,
    "imageUrl": "https://example.com/margherita.jpg",
    "category": "Pizza"
  }
]
```

### `POST /api/menu` (seed/admin use — no auth in v1)
Creates a menu item.

**Request body**
```json
{
  "name": "Cheeseburger",
  "description": "cheddar, lettuce",
  "price": 7.5,
  "imageUrl": "https://example.com/burger.jpg",
  "category": "Burgers"
}
```

**201 Created** → returns the created item.
**400 Bad Request** if `name`, `description`, `price`, or `imageUrl` missing/invalid
→ `code: "VALIDATION_ERROR"`.

### `DELETE /api/menu/:id`
Deletes a menu item.

**200 OK**
```json
{ "message": "Menu item deleted", "id": "662f1a..." }
```

**404 Not Found** if the ID is malformed or the item does not exist
→ `code: "ITEM_NOT_FOUND"`.

---

## Orders

### `POST /api/orders`
Places a new order.

**Request body**
```json
{
  "items": [
    { "menuItemId": "662f1a...", "quantity": 2 },
    { "menuItemId": "662f1b...", "quantity": 1 }
  ],
  "customer": {
    "name": "Jane Doe",
    "address": "123 Main St, Springfield",
    "phone": "555-0100"
  }
}
```

**201 Created**
```json
{
  "_id": "662f2c...",
  "items": [
    { "menuItemId": "662f1a...", "name": "Margherita Pizza", "price": 9.99, "quantity": 2 }
  ],
  "customer": { "name": "Jane Doe", "address": "123 Main St, Springfield", "phone": "555-0100" },
  "status": "Order Received",
  "totalPrice": 19.98,
  "createdAt": "2026-09-17T10:00:00.000Z",
  "updatedAt": "2026-09-17T10:00:00.000Z"
}
```

**400 Bad Request** — validation errors, e.g.:
- `items` empty or missing → `VALIDATION_ERROR`
- `quantity` < 1 → `VALIDATION_ERROR`
- missing `customer.name` / `address` / `phone` → `VALIDATION_ERROR`
- a `menuItemId` that doesn't exist → `ITEM_NOT_FOUND`

### `GET /api/orders/:id`
Returns a single order, including current status.

**200 OK** → same shape as POST response above.
**404 Not Found** → `code: "ORDER_NOT_FOUND"` if id doesn't exist or is malformed.

### `GET /api/orders`
Returns all orders (useful for a simple "my orders" list; no auth/filtering in v1).

**200 OK** → array of order objects.

### `DELETE /api/orders/:id`
Deletes an existing order.

**204 No Content** → order deleted successfully.
**404 Not Found** → `code: "ORDER_NOT_FOUND"` if id doesn't exist or is malformed.

### `PATCH /api/orders/:id/status`
Manually advance/set an order's status. Used by the status-simulation job, and
useful directly for testing.

**Request body**
```json
{ "status": "Preparing" }
```

**200 OK** → updated order object.
**400 Bad Request** — invalid status value, or attempting to move status
backward → `code: "INVALID_STATUS_TRANSITION"`.
**404 Not Found** → `code: "ORDER_NOT_FOUND"`.

Valid status values, in order:
`"Order Received"` → `"Preparing"` → `"Out for Delivery"` → `"Delivered"`

---

## Real-Time Status (Option A: polling — default)
No separate endpoint needed; frontend re-calls `GET /api/orders/:id` on an
interval (e.g. every 3–5 seconds) while status is not `"Delivered"`.

## Real-Time Status (Option B: SSE — optional upgrade)

### `GET /api/orders/:id/stream`
Server-Sent Events stream. Emits an event each time status changes:
```
event: status-update
data: {"status": "Preparing", "updatedAt": "2026-09-17T10:02:00.000Z"}
```
Connection closes automatically after a `"Delivered"` event is sent.

---

## HTTP Status Code Summary
| Code | Meaning                              |
|------|---------------------------------------|
| 200  | Successful GET/PATCH                  |
| 201  | Resource created (POST)               |
| 400  | Validation error / bad input          |
| 404  | Resource not found                    |
| 500  | Unexpected server error               |
