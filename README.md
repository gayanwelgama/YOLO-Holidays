# Yolo Holidays — Netlify + Neon DB Setup

## One-time Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Login & link your Netlify site
```bash
npm install -g netlify-cli
netlify login
netlify link   # choose: thunderous-babka-433efe
```

### 3. Start dev server (this auto-provisions your Neon DB)
```bash
netlify dev
```
Netlify will print a `NETLIFY_DATABASE_URL` and create your Postgres database automatically.

### 4. Run migrations (create tables)
```bash
netlify env:get NETLIFY_DATABASE_URL   # copy the URL
NETLIFY_DATABASE_URL=<paste-url> npm run migrate
```

### 5. Seed existing data (run once)
```bash
NETLIFY_DATABASE_URL=<paste-url> npm run seed
```

### 6. Deploy to production
```bash
netlify deploy --prod
```

---

## Project Structure
```
yolo-holidays/
├── index.html                        ← Full frontend app
├── netlify/
│   └── functions/
│       ├── bookings.mjs              ← GET/POST/PUT/DELETE /api/bookings
│       ├── quotes.mjs                ← GET/POST/PUT/DELETE /api/quotes
│       ├── invoices.mjs              ← GET/POST/PUT/DELETE /api/invoices
│       └── customers.mjs             ← GET/POST/PUT/DELETE /api/customers
├── scripts/
│   ├── migrate.js                    ← Creates all DB tables
│   └── seed.js                       ← Loads existing sample data
├── netlify.toml
└── package.json
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/bookings | List all bookings |
| GET | /api/bookings?id=YH4135 | Get single booking |
| POST | /api/bookings | Create booking |
| PUT | /api/bookings?id=YH4135 | Update booking |
| DELETE | /api/bookings?id=YH4135 | Delete booking |
| GET | /api/quotes | List all quotes |
| GET | /api/invoices | List all invoices |
| GET | /api/customers | List all customers |
| GET | /api/customers?mobile=07... | Lookup by phone |
