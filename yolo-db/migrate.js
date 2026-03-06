import { neon } from "@netlify/neon";

const sql = neon();

console.log("Running migrations...");

await sql`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    city TEXT DEFAULT '',
    email TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    source TEXT DEFAULT 'auto',
    created_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT DEFAULT '',
    pax INT DEFAULT 1,
    price_per_pax INT DEFAULT 0,
    total INT DEFAULT 0,
    tour TEXT DEFAULT '',
    airline TEXT DEFAULT '',
    hotels TEXT DEFAULT '',
    date TEXT,
    status TEXT DEFAULT 'draft',
    notes TEXT DEFAULT '',
    dmc_rate INT DEFAULT 0,
    charges INT DEFAULT 0,
    profit INT DEFAULT 0,
    ticket_price INT DEFAULT 0,
    with_ticket BOOLEAN DEFAULT true,
    inclusions JSONB DEFAULT '[]',
    child_categories JSONB DEFAULT '[]',
    cities JSONB DEFAULT '[]',
    airlines JSONB DEFAULT '[]',
    created_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    quote_id TEXT DEFAULT '',
    name TEXT NOT NULL,
    mobile TEXT DEFAULT '',
    tour TEXT DEFAULT '',
    airline TEXT DEFAULT '',
    hotels TEXT DEFAULT '',
    inclusions JSONB DEFAULT '[]',
    child_categories JSONB DEFAULT '[]',
    pax INT DEFAULT 1,
    price_per_pax INT DEFAULT 0,
    total INT DEFAULT 0,
    deposit INT DEFAULT 0,
    balance INT DEFAULT 0,
    within30 BOOLEAN DEFAULT false,
    travel_date TEXT DEFAULT '',
    balance_due_date TEXT DEFAULT '',
    estimated_profit INT DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT false,
    balance_paid BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'unpaid',
    travel_start_date TEXT DEFAULT '',
    return_date TEXT DEFAULT '',
    merged_into_booking TEXT DEFAULT '',
    created_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    invoice_id TEXT DEFAULT '',
    name TEXT NOT NULL,
    mobile TEXT DEFAULT '',
    pax INT DEFAULT 1,
    dest TEXT DEFAULT '',
    airline TEXT DEFAULT '',
    date TEXT DEFAULT '',
    departure_date TEXT DEFAULT '',
    return_date TEXT DEFAULT '',
    total INT DEFAULT 0,
    advance INT DEFAULT 0,
    due INT DEFAULT 0,
    balance_due_date TEXT DEFAULT '',
    full_paid TEXT DEFAULT '',
    pay_note TEXT DEFAULT '',
    dmc TEXT DEFAULT '',
    dmc_advance TEXT DEFAULT '',
    dmc_full TEXT DEFAULT '',
    actual_ticket_cost INT DEFAULT 0,
    actual_dmc_advance_cost INT DEFAULT 0,
    actual_dmc_cost INT DEFAULT 0,
    actual_delivery_cost INT DEFAULT 0,
    actual_extra_cost INT DEFAULT 0,
    actual_extra_note TEXT DEFAULT '',
    estimated_profit INT DEFAULT 0,
    tickets BOOLEAN DEFAULT false,
    dmc_advance_paid BOOLEAN DEFAULT false,
    dmc_full_paid BOOLEAN DEFAULT false,
    prepared BOOLEAN DEFAULT false,
    sent BOOLEAN DEFAULT false,
    checkin BOOLEAN DEFAULT false,
    arrival BOOLEAN DEFAULT false,
    departed BOOLEAN DEFAULT false,
    returned BOOLEAN DEFAULT false,
    cancelled BOOLEAN DEFAULT false,
    child_categories JSONB DEFAULT '[]',
    merged_invoices JSONB DEFAULT '[]',
    remarks TEXT DEFAULT '',
    created_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

console.log("✅ All tables created successfully.");
