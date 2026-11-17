# SmartStock AI – Frontend (Phase 1)

AI-Powered Warehouse Management & Supply Chain Traceability System.

**Phase 1 pages:** Login · Dashboard · Inventory Management
Built with React + Vite, TypeScript, Tailwind CSS, React Router DOM, Lucide React and Recharts.

## Quick start

Requirements: **Node.js 18 or newer** (https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:5173 (it opens automatically).

Other commands:

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload  |
| `npm run build`     | Type-check and create a production build in `dist/` |
| `npm run preview`   | Serve the production build locally    |
| `npm run typecheck` | Run the TypeScript compiler only      |

## Demo login

| Email                | Password    |
| -------------------- | ----------- |
| `admin@smartstock.ai` | `Admin@123` |

Or click **Continue with demo account** on the login page.

## What works in Phase 1

- **Login** – validation, show/hide password, error state, loading state, demo login, redirect to Dashboard, protected routes, sign out.
- **Dashboard** – KPI cards (Products, Batches, Stock, Low Stock, Expiring) calculated live from inventory, quick actions, inventory overview chart (by category / weekly movement), AI alerts (dismissable, with actions), recent stock movements, recent activities.
- **Inventory** – table (product, SKU/barcode, category, batch, quantity, location, status, expiry), search, category and status filters, pagination, Add / View / Edit / Delete with validated modals, low-stock / expiring / expired indicators, empty and loading states, toast feedback. Data is stored in `localStorage` so it survives a refresh (use **Reset demo data** to restore the seed data).
- **Layout** – collapsible sidebar, mobile drawer, top bar with search (`Ctrl/⌘ + K`), breadcrumb and user menu. Fully responsive.
- All other sidebar items already have routes and show a "coming in a later phase" placeholder.

## Folder structure

```
src/
├── components/
│   ├── layout/      Sidebar, Topbar, AppLayout
│   ├── ui/          Button, Modal, Card, Field, StatusBadge, EmptyState, Skeleton, ...
│   ├── dashboard/   KpiCard, charts, tables, alerts, quick actions
│   └── inventory/   InventoryTable, form modal, details modal
├── context/         AuthContext, InventoryContext, ToastContext
├── data/            Mock data (products, inventory, dashboard, users) + navigation config
├── lib/             Helpers (date, status, formatting)
├── pages/           LoginPage, DashboardPage, InventoryPage, PlaceholderPage, NotFoundPage
├── routes/          ProtectedRoute, pageRegistry
└── types/           Shared TypeScript types
```

## Adding a new page (Phase 2+)

1. Create `src/pages/YourPage.tsx`.
2. Register it in `src/routes/pageRegistry.tsx` (`'/your-path': <YourPage />`).
3. Set `implemented: true` for its item in `src/data/navigation.ts`.

The sidebar, routing and breadcrumb pick it up automatically.

## Replacing mock data with a real backend

- Auth: replace the mock check in `src/context/AuthContext.tsx`.
- Inventory: replace the in-memory logic in `src/context/InventoryContext.tsx` with API calls.
- Static mock data lives only in `src/data/`.
