# Sarayo Alwadiya — Chips Store Backend

Production-ready REST API for the Sarayo Alwadiya chips store, built with **NestJS**,
**Prisma**, **PostgreSQL**, and **Paymob** for payments. It powers both the
customer-facing storefront and the admin dashboard.

---

## 1. Prerequisites

- **Node.js 20+** (tested on Node 20–24)
- **npm 9+**
- **PostgreSQL 16** — either via Docker (recommended) or a local install
- A **Paymob** account for live payments (optional for local development)

---

## 2. Installation

```bash
cd backend
npm install
```

---

## 3. Environment setup

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Key variables (see `.env.example` for the full list):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets (min 32 chars) |
| `FRONTEND_URL` / `DASHBOARD_URL` | Allowed CORS origins + Paymob redirect base |
| `PAYMOB_*` | Paymob credentials (see §7) |
| `FREE_SHIPPING_THRESHOLD` / `SHIPPING_COST` / `TAX_RATE` | Business rules |

All config is read through `ConfigService` (`src/config/configuration.ts`) — never
through `process.env` directly in services.

---

## 4. Database setup

Start Postgres (Docker):

```bash
docker-compose up -d
```

Run migrations and generate the Prisma client:

```bash
npm run prisma:generate     # generate the typed client
npm run prisma:migrate      # apply migrations (creates the schema)
npm run prisma:seed         # seed demo data
```

> The initial migration lives in `prisma/migrations/` and is committed to the repo.
> On a fresh database, `npx prisma migrate dev` will apply it.

Seeded credentials:

- **Admin** — `admin@chipstore.com` / `Admin123!`
- **Customer** — `mariam.h@example.com` / `Customer123!`

---

## 5. Running locally

```bash
npm run start:dev     # watch mode
# or
npm run build && npm run start:prod
```

The API runs on `http://localhost:4000` by default (configurable via `PORT`).
All routes are prefixed with `/api`.

---

## 6. Running with Docker

```bash
docker-compose up -d        # starts PostgreSQL on :5432
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

`docker-compose.yml` only provisions PostgreSQL; the API runs on the host. (Add an
app service later if you want a fully containerised stack.)

---

## 7. Paymob setup

The backend implements Paymob's server-side **3-step flow** plus HMAC-verified
callbacks. To wire it up:

1. Sign in to the [Paymob dashboard](https://accept.paymob.com/portal2/en/login).
2. **API key** → *Settings → Account Info → API Key* → set `PAYMOB_API_KEY`.
3. **Integration ID** → *Developers → Payment Integrations* → copy your **Card**
   integration id → set `PAYMOB_INTEGRATION_ID`.
4. **Iframe ID** → *Developers → iframes* → create/copy an iframe id →
   set `PAYMOB_IFRAME_ID`.
5. **HMAC secret** → *Settings → Account Info → HMAC* → set `PAYMOB_HMAC_SECRET`.
6. Configure your **Transaction processed callback** to
   `POST {API_BASE}/api/payments/callback` and the **Transaction response
   callback** to `GET {API_BASE}/api/payments/callback`.

Payment flow:

1. Customer creates an order → `POST /api/orders` (also runs Paymob steps 1–3 and
   returns `paymentKey` + `iframeUrl`).
2. Frontend embeds the iframe:
   `https://accept.paymob.com/api/acceptance/iframes/{IFRAME_ID}?payment_token={paymentKey}`.
3. Paymob calls back `POST /api/payments/callback` (HMAC SHA512 verified) → order
   marked `PAID`/`CONFIRMED` or `FAILED`.
4. Paymob redirects the browser to `GET /api/payments/callback` → redirected to
   `{FRONTEND_URL}/orders/{orderId}?payment=success|failed`.

> Amounts are always sent to Paymob in **piasters** (EGP × 100) as integers.
> All callbacks are rejected unless the HMAC SHA512 signature verifies.

---

## 8. API documentation

Swagger UI is available at:

```
http://localhost:4000/api/docs
```

Use the **Authorize** button to paste a JWT access token (`Bearer`) and try the
protected/admin endpoints. Endpoints are grouped by module tag.

### Endpoint overview

| Area | Base | Notes |
|---|---|---|
| Auth | `/api/auth` | register, login, refresh, logout, forgot/reset password, me |
| Users | `/api/users` | profile + addresses |
| Admin Users | `/api/admin/users` | list/get/update (ADMIN) |
| Products | `/api/products` | list/filter/search/featured/`:slug` |
| Admin Products | `/api/admin/products` | CRUD + stock (ADMIN) |
| Categories | `/api/categories` | list + `:slug` |
| Admin Categories | `/api/admin/categories` | CRUD (ADMIN) |
| Cart | `/api/cart` | items, summary (auth) |
| Orders | `/api/orders` | create, list, detail, cancel (auth) |
| Admin Orders | `/api/admin/orders` | list, detail, status, **stats** (ADMIN) |
| Payments | `/api/payments` | initiate, callback (POST/GET), refund |
| Uploads | `/api/uploads/image` | image upload (ADMIN) |

Every successful response is wrapped as `{ success: true, data, timestamp }`.
Errors use `{ success: false, statusCode, message, error, timestamp, path }`.

---

## 9. Running tests

```bash
npm test           # unit tests (Jest)
npm run test:e2e   # end-to-end tests (Supertest)
npm run test:cov   # coverage
```

> The e2e suite expects a reachable test database (`DATABASE_URL`).

---

## 10. Deployment notes

- Set strong `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (≥ 32 chars) and real
  Paymob credentials as environment variables.
- Run `npx prisma migrate deploy` on release (not `migrate dev`).
- Put the API behind HTTPS; Paymob callbacks must hit a public HTTPS URL.
- Swap local file uploads for S3/Cloudinary — see the `// TODO: swap to S3`
  comments in `src/uploads/`.
- Consider moving refresh-token storage / rate-limit buckets to Redis at scale
  (see `// TODO: add Redis` markers).
- Tighten CORS to your exact production origins.

---

## Project structure

```
backend/
├── prisma/
│   ├── schema.prisma        # data model
│   ├── migrations/          # committed SQL migrations
│   └── seed.ts              # demo data
├── src/
│   ├── main.ts              # bootstrap: pipes, filters, CORS, Swagger
│   ├── app.module.ts        # root module + global throttler
│   ├── common/              # decorators, guards, filters, interceptors, pricing
│   ├── config/              # typed configuration
│   ├── prisma/              # global PrismaModule/Service
│   ├── auth/  users/  products/  categories/  cart/  orders/  payments/  uploads/
├── test/                    # e2e tests
├── docker-compose.yml
└── .env.example
```
