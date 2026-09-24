# Order Management Feature — Food Delivery App

A full-stack Order Management feature: browse a menu, add items to a cart, checkout with
delivery details, and track order status with simulated real-time updates.

## Tech Stack

- **Backend:** Node.js + Express, MongoDB (Mongoose)
- **Frontend:** Next.js (React)
- **Testing:** Jest + Supertest (backend), Playwright (frontend)
- **Real-time updates:** Simulated via polling or Server-Sent Events (see ARCHITECTURE.md)

## Repository Structure

```
order-mgmt-starter/
├── README.md
├── CLAUDE.md              # AI assistant instructions & conventions
├── ARCHITECTURE.md        # System design, data flow, decisions
├── API_SPEC.md            # REST API contract
├── TODO.md                # Task breakdown (TDD-ordered)
├── .gitignore
├── backend/
│   ├── package.json
│   ├── .env
│   ├── src/
│   │   ├── models/        # Mongoose schemas (MenuItem, Order)
│   │   ├── routes/        # Express routes
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic (status simulation, etc.)
│   │   ├── middleware/    # Validation, error handling
│   │   └── app.js
│   └── tests/
│       ├── menu.test.js
│       ├── orders.test.js
│       └── validation.test.js
└── frontend/
    ├── package.json
    ├── .env
    ├── pages/
    │   ├── index.js       # Menu page
    │   ├── cart.js
    │   └── order/[id].js  # Order status tracking page
    ├── components/
    │   ├── MenuItemCard.js
    │   ├── Cart.js
    │   ├── CheckoutForm.js
    │   └── OrderStatus.js
    └── e2e/
        ├── menu.spec.js
        ├── cart.spec.js
        └── order-status.spec.js
```

## Getting Started

### 1. Backend

```bash
cd backend
cp .env .env      # fill in your MongoDB URI
npm install
npm test                  # run tests first (TDD)
npm run dev               # start dev server (default: http://localhost:5000)
```

### 2. Frontend

```bash
cd frontend
cp .env .env.local
npm install
npm test
npm run dev                # http://localhost:3000
```

### 3. MongoDB

Use a local MongoDB instance or a free MongoDB Atlas cluster. Set the connection string
in `backend/.env` as `MONGODB_URI`.

### 4. Add the starter menu

After configuring MongoDB, create the five starter dishes with:

```bash
cd backend
npm run seed:menu
```

The command can be run again without creating duplicate dishes.



