# AI Assistant Instructions — Order Management Feature

These are standing instructions for any AI coding assistant (Claude Code, Cursor, etc.)
working on this repository. Read this before writing code.

## Project Summary

Order Management feature for a food delivery app: menu browsing, cart, checkout,
and order status tracking with simulated real-time updates.

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: Next.js
- Methodology: **TDD** — always write/update a test before or alongside implementation code

## Golden Rules

1. **Never write implementation code without a corresponding test.** If a task in
   TODO.md doesn't have a test yet, write the test first, run it (confirm it fails
   for the right reason), then implement.
2. **Follow API_SPEC.md exactly.** Route paths, request/response shapes, and status
   codes are the contract. If a change is needed, update API_SPEC.md in the same
   change set and say so explicitly.
3. **Keep backend and frontend decoupled.** Frontend only talks to the backend via
   the REST API defined in API_SPEC.md — no direct DB access from Next.js.
4. **Use environment variables for all config** (DB URI, ports, API base URL).
   Never hardcode secrets or URLs. Update `.env` whenever a new variable
   is introduced.
5. **Validate all input at the API boundary** (Express middleware), not just in
   the UI. Assume the API can be called by something other than this frontend.
6. **Keep changes small and reviewable.** Prefer several focused commits/diffs
   over one large one, matching the task breakdown in TODO.md.

## Conventions

### Backend (Node/Express)
- File layout: `routes/` → `controllers/` → `services/` → `models/`. Routes stay thin;
  business logic lives in services.
- Use `async/await`, not raw promise chains or callbacks.
- Errors: throw custom `AppError` objects; a single centralized error-handling
  middleware formats the HTTP response. Never leak stack traces in production
  responses.
- Mongoose schemas live in `models/`, one file per model (`MenuItem.js`, `Order.js`).
- Response shape for errors:
  ```json
  { "error": { "message": "string", "code": "MACHINE_READABLE_CODE" } }
  ```
- Testing: Jest + Supertest. Use an in-memory MongoDB instance for tests
  (`mongodb-memory-server`) so tests don't touch a real database.

### Frontend (Next.js)
- Functional components + hooks only. No class components.
- Keep API calls in a small `lib/api.js` client module — components should not
  call `fetch` directly.
- Cart state: use React Context (`CartContext`) rather than prop-drilling.
- Styling: keep it simple (CSS Modules or plain CSS) unless told otherwise —
  this is a functional demo, not a design showcase.
- Testing: Playwright. Test behavior in the browser (what the user sees/does),
  not implementation details. Mock the REST API with `page.route` so tests do
  not require the backend.

### Naming
- REST resources: plural nouns (`/api/orders`, `/api/menu-items`).
- MongoDB collections: `orders`, `menuitems`.
- Order status values (exact strings, used across backend and frontend):
  `"Order Received"`, `"Preparing"`, `"Out for Delivery"`, `"Delivered"`.

### Commands to run before considering a task done
```bash
# backend
cd backend && npm test && npm run lint

# frontend
cd frontend && npm test && npm run lint
```

## Things to Avoid
- Don't introduce a new database or ORM — MongoDB/Mongoose only.
- Don't add authentication/login — out of scope for this feature (assume a
  single implicit guest user unless requirements change).
- Don't add a payment gateway integration — out of scope.
- Don't couple the "real-time" simulation to a specific frontend framework
  feature that would block reuse (keep the polling/SSE endpoint generic).

## Current Task
See `TODO.md` for the ordered task list and check off items as they're completed.
When starting a session, state which TODO item you're working on before writing code.
