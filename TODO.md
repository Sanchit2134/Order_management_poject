# Task Breakdown (TDD Order)

Work top to bottom. For each backend/frontend task: **write the test first**,
watch it fail, implement, watch it pass, refactor.

## Phase 0 — Project Setup
- [ ] Initialize `backend/` with Express, Mongoose, Jest, Supertest, `mongodb-memory-server`
- [ ] Initialize `frontend/` with `create-next-app`, Playwright
- [ ] Set up `.env` files from `.env` in both apps
- [ ] Confirm `npm test` runs (even with zero tests) in both apps

## Phase 1 — Menu API
- [ ] Test: `GET /api/menu` returns `[]` when no items exist
- [ ] Test: `GET /api/menu` returns seeded items
- [ ] Test: `POST /api/menu` creates an item and returns 201
- [ ] Test: `POST /api/menu` returns 400 + `VALIDATION_ERROR` for missing fields
- [ ] Implement `MenuItem` model, routes, controller to pass the above

## Phase 2 — Order Placement API
- [ ] Test: `POST /api/orders` creates an order with valid items + customer info
- [ ] Test: `POST /api/orders` computes `totalPrice` correctly from item prices × quantities
- [ ] Test: `POST /api/orders` returns 400 for empty `items` array
- [ ] Test: `POST /api/orders` returns 400 for quantity < 1
- [ ] Test: `POST /api/orders` returns 400 for missing customer fields
- [ ] Test: `POST /api/orders` returns 404/`ITEM_NOT_FOUND` for a bogus `menuItemId`
- [ ] Implement `Order` model, validation middleware, routes, controller

## Phase 3 — Order Retrieval
- [ ] Test: `GET /api/orders/:id` returns the order with current status
- [ ] Test: `GET /api/orders/:id` returns 404 for unknown/malformed id
- [ ] Test: `GET /api/orders` returns all orders
- [ ] Implement corresponding routes/controllers

## Phase 4 — Order Status Updates
- [ ] Test: `PATCH /api/orders/:id/status` advances status correctly
- [ ] Test: rejects invalid status values
- [ ] Test: rejects backward transitions (e.g. Preparing → Order Received)
- [ ] Implement status transition logic (a small state machine helper is fine)

## Phase 5 — Status Simulation ("real-time")
- [ ] Test: the status-simulation service advances a newly created order
      through the lifecycle over time (use fake timers in tests — don't
      actually wait in real seconds)
- [ ] Implement the simulator (interval job or scheduled advance on order creation)
- [ ] Wire it in so new orders start advancing automatically

## Phase 6 — Frontend: Menu Display
- [ ] Test: `MenuItemCard` renders name, description, price, image
- [ ] Test: menu page renders a list of `MenuItemCard`s from API data (mock `lib/api.js`)
- [ ] Implement `lib/api.js` menu fetch + `MenuItemCard` + menu page

## Phase 7 — Frontend: Cart
- [ ] Test: adding an item to the cart updates cart state/UI
- [ ] Test: changing quantity updates the line total and cart total
- [ ] Test: removing an item removes it from the cart
- [ ] Implement `CartContext`, `Cart` component

## Phase 8 — Frontend: Checkout
- [ ] Test: checkout form validates required fields (name, address, phone) before submit
- [ ] Test: successful submit calls the orders API with correct payload and
      redirects to the order status page
- [ ] Test: API error during checkout shows an inline error message
- [ ] Implement `CheckoutForm` + checkout flow

## Phase 9 — Frontend: Order Status Tracking
- [ ] Test: `OrderStatus` renders the current status
- [ ] Test: `OrderStatus` polls the API and updates when status changes
      (mock timers + mock API responses)
- [ ] Implement `OrderStatus` component + `pages/order/[id].js`

## Phase 10 — Polish
- [ ] Add basic loading/empty states (menu loading, empty cart, order not found)
- [ ] Add `npm run lint` config (ESLint) to both apps and fix violations
- [ ] Review API_SPEC.md vs actual implementation for drift; update whichever is wrong
- [ ] Write/update README run instructions if anything changed

## Future Enhancements (not required for v1)
- [ ] Order cancellation
- [ ] Admin UI for managing menu items
- [ ] Auth + per-user order history
- [ ] Swap polling for SSE (Option B in ARCHITECTURE.md)
