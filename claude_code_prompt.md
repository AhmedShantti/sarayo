# Claude Code Prompt — Potato Chips Store: NestJS Backend + Prisma + Payment Gateway

---

## ROLE & MISSION

You are a **Senior Full-Stack Backend Engineer** specializing in NestJS, Prisma ORM, PostgreSQL, and payment gateway integrations. Your task is to build a **complete, production-ready backend** for an existing potato chips online store. The customer-facing frontend and the admin dashboard frontend are already built — your job is to create everything they need on the backend side: REST API, database schema, authentication, business logic, and payment processing.

---

## EXISTING CONTEXT (READ FIRST)

Before writing a single line of code:

1. **Explore the entire project structure** using `ls -R` and `cat` relevant files.
2. **Read all existing frontend code** — identify every API endpoint being called (look for `fetch`, `axios`, `api/`, environment variables like `NEXT_PUBLIC_API_URL`, etc.).
3. **Read all existing types/interfaces** in the frontend — your backend DTOs and Prisma models must match them exactly.
4. **Check for any existing `.env.example`, `README`, or config files** that hint at expected environment variables or architecture.
5. **List every entity you discover** (e.g. Product, Order, User, Cart, Category, Review) before modeling the database.

Do NOT assume anything. Derive everything from the existing frontend code.

---

## TECH STACK — MANDATORY

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | NestJS (latest stable) |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access token + refresh token) |
| Payment | Paymob (primary) |
| Validation | class-validator + class-transformer |
| Config | @nestjs/config with .env |
| API Docs | Swagger (@nestjs/swagger) |
| Testing | Jest (unit) + Supertest (e2e) |

---

## DELIVERABLES — COMPLETE LIST

### 1. Project Scaffold

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   │   └── configuration.ts
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   └── uploads/
├── test/
├── .env.example
├── docker-compose.yml
└── package.json
```

### 2. Prisma Schema

Model ALL entities discovered from the frontend. At minimum, include:

- **User** — id, email, password (hashed), name, role (CUSTOMER | ADMIN), phone?, address?, createdAt, updatedAt
- **Product** — id, name, slug, description, price (Decimal), compareAtPrice?, stock, images (String[]), flavor?, weight?, isActive, categoryId, createdAt, updatedAt
- **Category** — id, name, slug, description?, imageUrl?, isActive
- **Cart** — id, userId (unique), items (CartItem[]), createdAt, updatedAt
- **CartItem** — id, cartId, productId, quantity, price (snapshot at add time)
- **Order** — id, userId, status (PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED), subtotal, shippingCost, tax, total, shippingAddress (Json), paymentIntentId?, paymentStatus, notes?, createdAt, updatedAt
- **OrderItem** — id, orderId, productId, quantity, price (snapshot), productName (snapshot), productImage (snapshot)
- **Payment** — id, orderId (unique), paymobOrderId, paymobTransactionId?, amount, currency, status, metadata (Json?), createdAt, updatedAt
- **Address** — id, userId, label, street, city, state, country, postalCode, isDefault
- **Review** — id, userId, productId, rating (1–5), comment?, isVerified, createdAt

Add all necessary relations, indexes, and unique constraints. Use `@@index` for frequently queried fields (slug, email, productId).

### 3. Authentication Module (`/auth`)

Implement full auth flow:

- `POST /auth/register` — register new customer, hash password with bcrypt (rounds: 12), return tokens
- `POST /auth/login` — validate credentials, return access + refresh tokens
- `POST /auth/refresh` — accept refresh token, return new access token
- `POST /auth/logout` — invalidate refresh token
- `POST /auth/forgot-password` — generate reset token, (mock email sending with console.log)
- `POST /auth/reset-password` — validate token, update password
- `GET /auth/me` — return current authenticated user profile

JWT Strategy:
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry, stored in DB or Redis-compatible field on User
- Use `@nestjs/passport` + `passport-jwt`
- Create `JwtAuthGuard`, `RolesGuard`, and `@Roles()` decorator

### 4. Users Module (`/users`)

- `GET /users/profile` — get own profile (auth required)
- `PATCH /users/profile` — update own profile
- `GET /users/addresses` — list own addresses
- `POST /users/addresses` — add address
- `PATCH /users/addresses/:id` — update address
- `DELETE /users/addresses/:id` — delete address
- `PATCH /users/addresses/:id/default` — set as default

Admin endpoints:
- `GET /admin/users` — list all users (paginated, filterable)
- `GET /admin/users/:id` — get user details
- `PATCH /admin/users/:id` — update user (role, status)

### 5. Products Module (`/products`)

Public endpoints:
- `GET /products` — list products with filters: categoryId, minPrice, maxPrice, search (name/description), sortBy (price_asc, price_desc, newest, popular), pagination (page, limit)
- `GET /products/:slug` — get product by slug with full details + average rating
- `GET /products/featured` — featured/active products
- `GET /products/search?q=` — search products

Admin endpoints:
- `POST /admin/products` — create product (with image URLs)
- `PATCH /admin/products/:id` — update product
- `DELETE /admin/products/:id` — soft delete (set isActive=false)
- `PATCH /admin/products/:id/stock` — update stock quantity

### 6. Categories Module (`/categories`)

- `GET /categories` — list all active categories with product count
- `GET /categories/:slug` — get category with its products
- `POST /admin/categories` — create
- `PATCH /admin/categories/:id` — update
- `DELETE /admin/categories/:id` — delete (only if no products)

### 7. Cart Module (`/cart`)

Auth required for all:
- `GET /cart` — get current user's cart with populated product details
- `POST /cart/items` — add item (body: productId, quantity) — validate stock availability
- `PATCH /cart/items/:productId` — update quantity
- `DELETE /cart/items/:productId` — remove item
- `DELETE /cart` — clear cart
- `GET /cart/summary` — return subtotal, estimated shipping, estimated tax, total

Business rules:
- If product is out of stock → throw 400 with clear message
- If quantity exceeds stock → clamp to available stock or throw error
- Price in cart is always recalculated from current product price on fetch (but snapshot price is stored at order creation)

### 8. Orders Module (`/orders`)

Auth required:
- `POST /orders` — create order from current cart:
  1. Validate all items still in stock
  2. Calculate totals (subtotal + shipping logic + tax)
  3. Snapshot product names/images/prices into OrderItems
  4. Register order with Paymob (Step 1 — get Paymob order ID)
  5. Clear cart after order creation
  6. Return order + Paymob payment key for the hosted iframe
- `GET /orders` — list own orders (paginated)
- `GET /orders/:id` — get order details with items
- `POST /orders/:id/cancel` — cancel if status is PENDING

Admin endpoints:
- `GET /admin/orders` — list all orders (filterable by status, date range, userId)
- `GET /admin/orders/:id` — full order details
- `PATCH /admin/orders/:id/status` — update order status (with validation of allowed transitions)
- `GET /admin/orders/stats` — return: total revenue, orders count, pending orders, top products

Shipping logic (hardcoded, configurable via env):
- Free shipping for orders over $50
- Flat $5.99 shipping for orders under $50

Tax: 10% of subtotal (configurable via env: `TAX_RATE=0.10`)

### 9. Payments Module (`/payments`) — PAYMOB INTEGRATION

#### How Paymob Works (3-Step Flow)

Paymob uses a server-side 3-step flow. Claude Code must implement all three steps:

**Step 1 — Authentication Token** (server → Paymob)
POST to `https://accept.paymob.com/api/auth/tokens` with `{ api_key }` → returns short-lived `token`

**Step 2 — Register Order** (server → Paymob)
POST to `https://accept.paymob.com/api/ecommerce/orders` with token + order details → returns Paymob `order_id`

**Step 3 — Get Payment Key** (server → Paymob)
POST to `https://accept.paymob.com/api/acceptance/payment_keys` with token + order_id + amount + billing data + integration_id → returns `payment_key` (token valid for 1 hour)

The frontend then uses the `payment_key` to embed the Paymob iframe:
```
https://accept.paymob.com/api/acceptance/iframes/{PAYMOB_IFRAME_ID}?payment_token={payment_key}
```

#### Setup:
```bash
npm install axios
```
No official Paymob Node SDK — use `axios` for all Paymob API calls. Create a `PaymobClient` service that wraps all HTTP calls.

#### Environment Variables needed:
```
PAYMOB_API_KEY=your_api_key_here
PAYMOB_INTEGRATION_ID=your_card_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret
PAYMOB_CURRENCY=EGP
PAYMOB_BASE_URL=https://accept.paymob.com/api
```

#### PaymobClient Service (`src/payments/paymob.client.ts`)

Create a dedicated service encapsulating all 3 steps:

```typescript
@Injectable()
export class PaymobClient {
  // Step 1: Get auth token (call before every Step 2/3 — tokens are short-lived)
  async getAuthToken(): Promise<string>

  // Step 2: Register order with Paymob
  async registerOrder(token: string, amountCents: number, currency: string, items: PaymobItem[]): Promise<number> // returns paymobOrderId

  // Step 3: Get payment key
  async getPaymentKey(token: string, paymobOrderId: number, amountCents: number, billingData: PaymobBillingData): Promise<string> // returns paymentKey

  // Convenience: run all 3 steps in sequence
  async initiatePayment(amount: number, currency: string, items: PaymobItem[], billingData: PaymobBillingData): Promise<{ paymobOrderId: number, paymentKey: string }>
}
```

**Important:** Paymob amounts are in **cents/piasters** (multiply EGP by 100). Always store and send `amountCents` as an integer.

#### Endpoints:

`POST /payments/initiate`
- Auth required
- Body: `{ orderId: string }`
- Runs all 3 Paymob steps using the order's total and the user's billing data
- Stores `paymobOrderId` on the Order record
- Returns `{ paymentKey, iframeUrl, paymobOrderId }`
- `iframeUrl` = `https://accept.paymob.com/api/acceptance/iframes/{IFRAME_ID}?payment_token={paymentKey}`

`POST /payments/callback` — **Paymob Transaction Callback (server-to-server)**
- Public endpoint (no JWT) — called directly by Paymob servers
- Paymob sends a POST with transaction data + HMAC signature
- **Verify HMAC signature** before processing (see HMAC verification below)
- Handle transaction result:
  - `success: true` → update Order.paymentStatus = PAID, Order.status = CONFIRMED, create Payment record
  - `success: false` → update Order.paymentStatus = FAILED
- Return HTTP 200 immediately (Paymob expects 200 or it will retry)

`GET /payments/callback` — **Paymob Redirect Callback (browser redirect)**
- Public endpoint — Paymob redirects the user's browser here after payment
- Query params include `success`, `order`, `transaction_id`, `merchant_order_id`, etc.
- Also verify HMAC on this callback
- Redirect user to frontend success or failure page:
  - Success: `{FRONTEND_URL}/orders/{orderId}?payment=success`
  - Failure: `{FRONTEND_URL}/orders/{orderId}?payment=failed`

`POST /payments/refund`
- Admin only
- Body: `{ transactionId: string, amountCents: number }`
- POST to `https://accept.paymob.com/api/acceptance/void_refund/refund` with auth token + transaction details
- Update Payment and Order status

#### HMAC Verification (CRITICAL — never skip)

Paymob sends an HMAC SHA512 signature to prevent spoofing. Implement this exactly:

```typescript
verifyHmac(params: Record<string, string>, receivedHmac: string): boolean {
  // Concatenate specific fields in this exact order:
  const hmacFields = [
    'amount_cents', 'created_at', 'currency', 'error_occured',
    'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure',
    'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment',
    'is_voided', 'order', 'owner', 'pending', 'source_data.pan',
    'source_data.sub_type', 'source_data.type', 'success'
  ];
  const concatenated = hmacFields.map(f => params[f] ?? '').join('');
  const computed = crypto.createHmac('sha512', this.hmacSecret)
    .update(concatenated)
    .digest('hex');
  return computed === receivedHmac;
}
```

#### PaymobBillingData shape:
```typescript
interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment: string;      // use "NA" if not applicable
  floor: string;          // use "NA" if not applicable
  street: string;
  building: string;       // use "NA" if not applicable
  shipping_method: string; // use "PKG"
  postal_code: string;
  city: string;
  country: string;
  state: string;
}
```

Map the user's Address model to this shape in the PaymentsService. If any field is missing, use `"NA"`.

#### PaymobModule setup:
- Create `PaymobModule` with `forRootAsync` pattern injecting `ConfigService`
- Export `PaymobClient` so `PaymentsModule` can inject it
- `PaymentsModule` imports `PaymobModule`, `OrdersModule`, `UsersModule`

### 10. File Uploads Module (`/uploads`)

- `POST /uploads/image` — accept single image (multipart/form-data), validate mime type (jpg/png/webp only), max 5MB
- Use `multer` with `@nestjs/platform-express`
- For MVP: save to `./uploads/` local folder, return URL
- Add a note in code comments about how to swap to S3/Cloudinary later

### 11. Global Infrastructure

**Exception Filter** (`AllExceptionsFilter`):
- Catch all exceptions
- Return consistent error shape: `{ statusCode, message, error, timestamp, path }`
- Log 5xx errors with full stack trace

**Response Interceptor** (`TransformInterceptor`):
- Wrap all successful responses: `{ success: true, data: <payload>, timestamp }`

**Validation Pipe** (global):
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
}));
```

**CORS**:
- Allow origins from env: `FRONTEND_URL`, `DASHBOARD_URL`
- Allow credentials

**Rate Limiting**:
- Install `@nestjs/throttler`
- Global: 100 requests / 60 seconds
- Auth endpoints: 5 requests / 60 seconds

**Swagger**:
- Available at `/api/docs`
- Group endpoints by module tags
- Include JWT bearer auth in Swagger UI
- Document all request/response DTOs

### 12. Configuration & Environment

Create `.env.example` with ALL variables:

```env
# App
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/chips_store

# JWT
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Paymob
PAYMOB_API_KEY=your_api_key_here
PAYMOB_INTEGRATION_ID=your_card_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret
PAYMOB_CURRENCY=EGP
PAYMOB_BASE_URL=https://accept.paymob.com/api

# Uploads
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=5242880

# Business Rules
FREE_SHIPPING_THRESHOLD=50
SHIPPING_COST=5.99
TAX_RATE=0.10
```

Use `@nestjs/config` with a typed `configuration.ts` file. Access all env vars through the `ConfigService` — never use `process.env` directly in services.

### 13. Docker Setup

`docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: chips_store
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 14. Database Seed (`prisma/seed.ts`)

Seed with realistic data:
- 1 admin user (email: `admin@chipstore.com`, password: `Admin123!`)
- 3 customers with addresses
- 5 categories (e.g., Classic, BBQ, Spicy, Cheese, Limited Edition)
- 20 products across categories with varied prices, stock, and flavors
- 10 sample orders in different statuses
- Sample reviews for products

### 15. README

Create `backend/README.md` with:
1. Prerequisites
2. Installation steps
3. Environment setup
4. Database setup commands
5. Running locally
6. Running with Docker
7. Paymob setup (how to get API key, integration ID, iframe ID, and HMAC secret from Paymob dashboard)
8. API documentation URL
9. Running tests
10. Deployment notes

---

## IMPLEMENTATION RULES — FOLLOW STRICTLY

### Code Quality
- Every module follows NestJS Module/Controller/Service/Repository pattern
- No business logic in Controllers — only in Services
- Use `async/await` everywhere, never `.then()` chains
- All Prisma calls wrapped in try/catch with proper error translation (e.g., `P2002` unique constraint → `ConflictException`)
- Never expose password hashes in any response — use `Exclude()` decorator on DTO

### DTOs
- Separate `CreateXxxDto`, `UpdateXxxDto` (extends `PartialType`), and response DTOs
- All DTOs use `class-validator` decorators
- Response DTOs use `@ApiProperty()` for Swagger

### Security
- Hash passwords with bcrypt, rounds=12
- Sanitize all string inputs
- Validate file uploads strictly (mime type + size)
- Paymob callbacks must verify HMAC SHA512 signature — never process without verification
- Admin routes protected by both `JwtAuthGuard` AND `RolesGuard` with `@Roles('ADMIN')`
- Never log sensitive data (passwords, Paymob API keys, card numbers)

### Prisma Best Practices
- Use `select` to only fetch fields you need — never return full User with password
- Use transactions (`prisma.$transaction`) for order creation (cart clear + order create must be atomic)
- All migrations committed to repo

### Error Handling
- 400 — Validation errors, business rule violations (out of stock, etc.)
- 401 — Not authenticated
- 403 — Not authorized (wrong role or not resource owner)
- 404 — Resource not found
- 409 — Conflict (duplicate email, etc.)
- 422 — Unprocessable (payment failed, etc.)
- 500 — Unexpected server errors

---

## EXECUTION ORDER

Follow this exact order. Do not skip ahead:

1. `cd backend && npm install` (or scaffold with NestJS CLI)
2. Set up `prisma/schema.prisma` — write full schema
3. Set up `docker-compose.yml` and start Postgres
4. Run `npx prisma migrate dev --name init`
5. Build `ConfigModule` + `configuration.ts`
6. Build `PrismaModule` as global module
7. Build `AuthModule` end-to-end (register → login → JWT guard works)
8. Build `UsersModule`
9. Build `CategoriesModule`
10. Build `ProductsModule`
11. Build `CartModule`
12. Build `OrdersModule` (without payment yet)
13. Build `PaymentsModule` with Paymob (`PaymobClient` + all 3 steps)
14. Wire Paymob callbacks (POST + GET) and HMAC verification
15. Add `UploadsModule`
16. Add global pipes, filters, interceptors
17. Add Swagger
18. Add rate limiting
19. Write seed file and run it
20. Write `README.md`
21. Run `npx prisma studio` and verify all data
22. Test every endpoint manually via Swagger UI

---

## VERIFICATION CHECKLIST

Before declaring done, verify each item:

- [ ] `POST /auth/register` returns tokens
- [ ] `POST /auth/login` returns tokens
- [ ] `GET /auth/me` with Bearer token returns user (no password field)
- [ ] `GET /products` returns paginated list
- [ ] `GET /products/:slug` returns product with rating
- [ ] `POST /cart/items` adds item and validates stock
- [ ] `POST /orders` creates order AND initiates Paymob flow AND returns `paymentKey` + `iframeUrl`
- [ ] `POST /payments/callback` verifies HMAC and updates order status on success
- [ ] `GET /payments/callback` redirects browser to correct frontend URL after payment
- [ ] `GET /admin/orders/stats` returns dashboard metrics
- [ ] All admin routes return 403 for non-admin users
- [ ] Swagger UI at `/api/docs` shows all endpoints with auth
- [ ] `npx prisma studio` shows seeded data
- [ ] `docker-compose up` starts postgres cleanly
- [ ] `.env.example` has every variable used in code

---

## NOTES FOR CLAUDE CODE

- If you find the frontend uses a different field name than what you'd naturally choose, **match the frontend exactly**.
- If you find existing API calls in the frontend that don't fit the above spec, **add those endpoints** — the spec above is a baseline, not a ceiling.
- Prefer explicit over implicit — verbose, readable code over clever one-liners.
- Leave `// TODO: swap to S3` or `// TODO: add Redis` comments where production upgrades are expected.
- After each module is complete, do a quick sanity check: can NestJS resolve all the module dependencies? (`npm run build` must pass with zero errors before moving to next module.)