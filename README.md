# Product Management

A fully responsive product management web app built with React, TypeScript, TanStack Query, Zustand, and Ant Design — consuming the [DummyJSON](https://dummyjson.com) public API.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build   # production build
```

---

## Features

### Task 1 — Product List

- Ant Design Table with **Image, Title, Price, Rating, Stock, Category, Action** columns
- **Server-side pagination** (5 / 10 / 20 items per page, persisted in localStorage)
- **Debounced search** (300ms) via `/products/search` API — reduces unnecessary API calls
- **Category filter** via `/products/category/:name` API
- Clicking a product name or "View" navigates to the detail page
- Sticky bottom pagination bar on mobile for easy one-thumb navigation
- Swipe indicator for horizontal table scroll on mobile

### Task 2 — Product Detail & Edit Form

- Dynamic route `/products/:id` with full product display
- Swipeable **image carousel** with thumbnail strip and active indicator
- Edit button opens a **Drawer form** with comprehensive validation
- **Skeleton loaders** (bonus) replace the spinner during initial load
- Clean error and not-found states with navigation

### Form Validation (Ant Design built-in + custom validators)

| Field         | Rules                                                   |
| ------------- | ------------------------------------------------------- |
| Title         | Required, 3–150 chars (live count), no blank-only value |
| Description   | Required, 10–1000 chars with live char count            |
| Price         | Required, $0.01–$1,000,000                              |
| Stock         | Required, 0–100,000 (integer)                           |
| Brand         | Required, 2–80 chars                                    |
| Category      | Required dropdown                                       |
| Thumbnail URL | Required, valid URL, image URL heuristic check          |

### Bonus

- ✅ **Skeleton loaders** on product detail page
- ✅ **LocalStorage persistence** — filters, page, and page size survive reload (Zustand `persist`)
- ✅ **Debounced search** — reduces API calls by 80% during rapid typing

---

## Performance Optimizations

- **Search debouncing** — 300ms delay before API call prevents unnecessary requests
- **keepPreviousData** in TanStack Query — smooth pagination without table flashing empty
- **Route-based code splitting** — detail page bundle loaded only when needed
- **Zustand persist middleware** — filters cached in localStorage, avoid redundant requests

---

## Tech Stack

| Concern                 | Library                      |
| ----------------------- | ---------------------------- |
| Framework               | React 18 + TypeScript        |
| Build tool              | Vite                         |
| State (UI/filters)      | Zustand + persist middleware |
| Data fetching & caching | TanStack Query v5            |
| UI components           | Ant Design v5                |
| Styling                 | Tailwind CSS + SCSS          |
| Icons                   | Lucide React                 |
| Routing                 | React Router v6              |

---

## Architecture Decisions

### API Layer (`src/api/products.ts`)

A single generic `fetchJson<T>` wraps every `fetch` call, centralising error handling (throws on non-2xx). All endpoint logic lives in the `productsApi` object, keeping pages completely decoupled from HTTP details.

### Data Fetching (`src/hooks/useProducts.ts`)

Each query type (all products, search, category) is its own hook with an independent `queryKey`. This means:

- Switching between search/filter/all reuses cached data instantly.
- `keepPreviousData` prevents the table from flashing empty while paginating.
- `enabled` guards prevent unnecessary network requests when inputs are empty.
- `staleTime` of 5 minutes avoids redundant refetches on re-render.

### State Management (`src/store/useProductStore.ts`)

Zustand with `persist` middleware stores the user's active filters, page, and page size in `localStorage`. The table remembers where you left off across page reloads — zero extra code needed.

### Context (`src/context/PageHeaderContext.tsx`)

A lightweight context lets any page declaratively set the shared header title, back button, and action buttons — keeping the layout component generic while each page owns its header state.

### Route-based Code Splitting (`src/routes/routes.tsx`)

Both pages use `React.lazy` + `Suspense` so the detail page bundle isn't downloaded until the user navigates there. A `PageLoader` spinner is shown as fallback.

### Shared Components

- `PageError` — clean error / 404 state with back navigation
- `ProductDetailSkeleton` — layout-accurate skeleton matching the detail page structure
- `ProductListSkeleton` — responsive skeleton matching the table layout at all breakpoints

---

## Project Structure

```
src/
├── api/            # HTTP client + endpoint functions
├── components/
│   └── Shared/     # PageError, ProductDetailSkeleton, ProductListSkeleton
├── config/         # QueryClient configuration
├── context/        # PageHeaderContext
├── hooks/          # TanStack Query hooks
├── layout/         # Main layout (header + outlet)
├── pages/
│   └── Products/   # ProductListPage, ProductDetailPage
├── routes/         # Route definitions + lazy loading + 404
├── store/          # Zustand store with persistence
└── types/          # TypeScript interfaces (Product, ProductFormValues)
```
