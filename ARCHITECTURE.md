# Architecture

## High-Level Flow

```
[Next.js Frontend] <--REST/JSON--> [Express API] <--Mongoose--> [MongoDB]
                                          |
                                   [Status Simulator]
                                   (interval job that
                                    advances order status)
```

## Data Models

### MenuItem
| Field       | Type    | Notes                        |
|-------------|---------|-------------------------------|
| _id         | ObjectId| auto                          |
| name        | String  | required                      |
| description | String  | required                      |
| price       | Number  | required, > 0                 |
| imageUrl    | String  | required                      |
| category    | String  | optional (e.g. "Pizza")       |

### Order
| Field           | Type      | Notes                                             |
|-----------------|-----------|----------------------------------------------------|
| _id             | ObjectId  | auto                                               |
| items           | [OrderItem] | see below                                        |
| customer.name   | String    | required                                          |
| customer.address| String    | required                                          |
| customer.phone  | String    | required                                          |
| status          | String    | enum: Order Received, Preparing, Out for Delivery, Delivered |
| totalPrice      | Number    | computed from items                               |
| createdAt       | Date      | auto                                              |
| updatedAt       | Date      | auto                                              |

### OrderItem (embedded, not a separate collection)
| Field      | Type     | Notes                       |
|------------|----------|------------------------------|
| menuItemId | ObjectId | ref to MenuItem              |
| name       | String   | denormalized at order time   |
| price      | Number   | denormalized at order time   |
| quantity   | Number   | required, >= 1                |

> Denormalizing `name`/`price` onto the order protects historical orders from
> changing if a menu item's price is edited later.

## Order Status Lifecycle

```
Order Received → Preparing → Out for Delivery → Delivered
```

Status only moves forward. No cancellation flow in this version (out of scope
unless requirements change — note it in TODO.md as a future enhancement).

## Simulated Real-Time Updates

Two options — pick one based on how much time you have. Default recommendation: **Option A**.

### Option A: Polling (simplest, recommended for TDD speed)
- Backend has a `setInterval`-based job (or triggered on order creation) that
  advances an order's status every N seconds until it reaches "Delivered".
- Frontend polls `GET /api/orders/:id` every few seconds on the order status page.
- Easiest to test: you can directly call the service function that advances
  status and assert on the DB state, no sockets involved.

### Option B: Server-Sent Events (SSE)
- `GET /api/orders/:id/stream` keeps a connection open and pushes status
  updates as they happen.
- More "real-time" but harder to unit test — needs integration-style tests
  with a test client that reads the event stream.

Start with Option A. Note in TODO.md if you upgrade to Option B later.

## Error Handling Strategy
- All API errors return `{ error: { message, code } }` with an appropriate
  HTTP status (400 validation, 404 not found, 500 unexpected).
- Frontend shows inline error messages near the relevant form/action; it
  never crashes the page on an API error.

## Testing Strategy
- **Backend:** `mongodb-memory-server` spins up an ephemeral MongoDB for each
  test run — no dependency on a real DB, fast and isolated.
- **Frontend:** Playwright browser tests intercept REST calls with `page.route`,
  so tests don't require the backend running.
- **Coverage target:** all API endpoints (happy path + validation errors) and
  all core UI components (MenuItemCard, Cart, CheckoutForm, OrderStatus).

## Future Enhancements (out of scope for v1)
- User authentication / order history per user
- Payment integration
- Order cancellation / editing after placement
- Admin panel for managing menu items
