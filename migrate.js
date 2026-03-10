import { neon } from "@netlify/neon";

const sql = neon();

console.log("🔧 Running migrations...");

await sql`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    mobile TEXT NOT NULL DEFAULT '',
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
    name TEXT NOT NULL DEFAULT '',
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
    name TEXT NOT NULL DEFAULT '',
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
    name TEXT NOT NULL DEFAULT '',
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
await sql`
  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    type TEXT DEFAULT 'DMC',
    contact_person TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    bank_name TEXT DEFAULT '',
    bank_account TEXT DEFAULT '',
    bank_branch TEXT DEFAULT '',
    payment_notes TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    cities JSONB DEFAULT '[]',
    created_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS cities JSONB DEFAULT '[]'`;
await sql`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'`;
await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`;
await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS corporate BOOLEAN DEFAULT false`;
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS supplier_payments JSONB DEFAULT '{}'`;
await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS group_tour_id TEXT DEFAULT ''`;
await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tour_package_id TEXT DEFAULT ''`;
await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS city_nights JSONB DEFAULT '[]'`;
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS group_tour_id TEXT DEFAULT ''`;
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tour_package_id TEXT DEFAULT ''`;
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tour TEXT DEFAULT ''`;
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS city_nights JSONB DEFAULT '[]'`;
await sql`
  CREATE TABLE IF NOT EXISTS group_tours (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS tour_packages (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS ledger (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
console.log("✅ Tables ready.");

// Seed only if empty
const existing = await sql`SELECT COUNT(*) as c FROM bookings`;
if (parseInt(existing[0].c) > 0) {
  console.log("⏭  Data already exists, skipping seed.");
  process.exit(0);
}

console.log("🌱 Seeding initial data...");

const quotes = [
  { id:'Q4135', name:'Nimal Perera', mobile:'0771234567', pax:2, pricePerPax:185000, total:370000, tour:'Bangkok (3N) & Pattaya (2N) Tour', airline:'Air Asia', hotels:'Amari Pattaya & Mercure Bangkok Siam', date:'2026-03-06', status:'confirmed', notes:'', dmcRate:14500, charges:3500, profit:18000, ticketPrice:42000, inclusions:['Return Air Ticket (20+7 KG Luggage)','3* Hotel Accommodation with Breakfast','Coral Island Tour with Lunch','Tiger Park Pattaya','Floating Market Tour','Chao Phraya International Dinner Cruise','Dream World & Snow Town with Lunch','All Airport & Intercity Transfers'] },
  { id:'Q4134', name:'Dilini Jayawardena', mobile:'0712345678', pax:4, pricePerPax:210000, total:840000, tour:'Phuket (3N) & Bangkok (3N) Tour', airline:'Sri Lankan', hotels:'Holiday Inn Phuket & Centara Grand Bangkok', date:'2026-03-05', status:'invoiced', notes:'Upgrade to sea-view room requested', dmcRate:18200, charges:4000, profit:22000, ticketPrice:55000, inclusions:['Return Air Ticket with Sri Lankan Airlines (20+7 KG)','3* Hotel Accommodation with Breakfast','Phi Phi Islands Tour by Speedboat with Lunch','James Bond Island Tour with Lunch','Old Phuket Town Walking Tour','Chao Phraya Dinner Cruise','Madame Tussauds Bangkok','All Transfers'] },
  { id:'Q4133', name:'Ruwan Bandara', mobile:'0759876543', pax:3, pricePerPax:165000, total:495000, tour:'Bangkok (4N) City & Theme Park Tour', airline:'Thai Airways', hotels:'Novotel Bangkok Sukhumvit', date:'2026-03-04', status:'sent', notes:'', dmcRate:12800, charges:3000, profit:15000, ticketPrice:48000, inclusions:['Return Air Ticket with Thai Airways (20+7 KG)','3* Hotel Accommodation with Breakfast','Dream World & Snow Town with Lunch','SEA LIFE Bangkok Ocean World','Madame Tussauds Wax Museum','Chatuchak Weekend Market Tour','Chao Phraya Dinner Cruise','All Transfers'] },
  { id:'Q4132', name:'Sachini Fernando', mobile:'0768901234', pax:2, pricePerPax:320000, total:640000, tour:'Phuket (4N) Luxury Beach Escape', airline:'Emirates', hotels:'Pullman Phuket Panwa Beach', date:'2026-03-03', status:'draft', notes:'Honeymoon package', dmcRate:24000, charges:5000, profit:28000, ticketPrice:72000, inclusions:['Return Air Ticket with Emirates (30+7 KG)','4* Beachfront Hotel with Breakfast','Phi Phi Islands Full Day Tour with Lunch','James Bond Island Tour','Old Town Tuk-Tuk Tour','Couples Spa Treatment (60 min)','Private Airport Transfers','Honeymoon Room Decoration'] },
];
for (const q of quotes) {
  await sql`INSERT INTO quotes (id,name,mobile,pax,price_per_pax,total,tour,airline,hotels,date,status,notes,dmc_rate,charges,profit,ticket_price,with_ticket,inclusions,child_categories,cities,airlines,created_date) VALUES (${q.id},${q.name},${q.mobile},${q.pax},${q.pricePerPax},${q.total},${q.tour},${q.airline},${q.hotels},${q.date},${q.status},${q.notes},${q.dmcRate},${q.charges},${q.profit},${q.ticketPrice},true,${JSON.stringify(q.inclusions)},'[]','[]','[]',${q.date}) ON CONFLICT (id) DO NOTHING`;
}
console.log("  ✅ 4 quotes");

await sql`INSERT INTO invoices (id,quote_id,name,mobile,tour,airline,hotels,inclusions,child_categories,pax,price_per_pax,total,deposit,balance,within30,travel_date,balance_due_date,estimated_profit,deposit_paid,balance_paid,status,travel_start_date,return_date,merged_into_booking,created_date) VALUES ('INV-4134','Q4134','Dilini Jayawardena','0712345678','Phuket (3N) & Bangkok (3N) Tour','Sri Lankan','Holiday Inn Phuket & Centara Grand Bangkok','["Return Air Ticket with Sri Lankan Airlines (20+7 KG)","3* Hotel Accommodation with Breakfast","Phi Phi Islands Tour by Speedboat with Lunch","James Bond Island Tour with Lunch","Old Phuket Town Walking Tour","Chao Phraya Dinner Cruise","Madame Tussauds Bangkok","All Transfers"]','[]',4,210000,840000,504000,336000,false,'2026-05-10','2026-04-10',88000,true,false,'partial','2026-05-10','','','2026-03-05') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO invoices (id,quote_id,name,mobile,tour,airline,hotels,inclusions,child_categories,pax,price_per_pax,total,deposit,balance,within30,travel_date,balance_due_date,estimated_profit,deposit_paid,balance_paid,status,travel_start_date,return_date,merged_into_booking,created_date) VALUES ('INV-4135','Q4135','Nimal Perera','0771234567','Bangkok (3N) & Pattaya (2N) Tour','Air Asia','Amari Pattaya & Mercure Bangkok Siam','["Return Air Ticket (20+7 KG Luggage)","3* Hotel Accommodation with Breakfast","Coral Island Tour with Lunch","Tiger Park Pattaya","Floating Market Tour","Chao Phraya International Dinner Cruise","Dream World & Snow Town with Lunch","All Airport & Intercity Transfers"]','[]',2,185000,370000,370000,0,true,'2026-03-20','',36000,true,true,'paid','2026-03-20','','','2026-03-06') ON CONFLICT (id) DO NOTHING`;
console.log("  ✅ 2 invoices");

await sql`INSERT INTO bookings (id,invoice_id,name,mobile,pax,dest,airline,date,departure_date,return_date,total,advance,due,balance_due_date,full_paid,pay_note,dmc,dmc_advance,dmc_full,actual_ticket_cost,actual_dmc_advance_cost,actual_dmc_cost,actual_delivery_cost,actual_extra_cost,actual_extra_note,estimated_profit,tickets,dmc_advance_paid,dmc_full_paid,prepared,sent,checkin,arrival,departed,returned,cancelled,child_categories,merged_invoices,remarks,created_date) VALUES ('YH4135','INV-4135','Nimal Perera','0771234567',2,'Bangkok & Pattaya','Air Asia','20 Mar - 25 Mar 2026','2026-03-20','2026-03-25',370000,370000,0,'','Invoice','INV-4135 — fully paid','D&G Thailand','','',84000,0,29000,1500,0,'',36000,true,false,true,true,true,false,false,false,false,false,'[]','[]','Fully paid. Package sent.','2026-03-01') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO bookings (id,invoice_id,name,mobile,pax,dest,airline,date,departure_date,return_date,total,advance,due,balance_due_date,full_paid,pay_note,dmc,dmc_advance,dmc_full,actual_ticket_cost,actual_dmc_advance_cost,actual_dmc_cost,actual_delivery_cost,actual_extra_cost,actual_extra_note,estimated_profit,tickets,dmc_advance_paid,dmc_full_paid,prepared,sent,checkin,arrival,departed,returned,cancelled,child_categories,merged_invoices,remarks,created_date) VALUES ('YH4134','INV-4134','Dilini Jayawardena','0712345678',4,'Phuket & Bangkok','Sri Lankan','10 May - 16 May 2026','2026-05-10','2026-05-16',840000,504000,336000,'2026-04-10','','Deposit via Seylan. Balance due 10 Apr.','D&G Thailand','','',220000,72800,0,0,0,'',88000,true,true,false,false,false,false,false,false,false,false,'[]','[]','Sea-view room upgrade requested.','2026-03-05') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO bookings (id,invoice_id,name,mobile,pax,dest,airline,date,departure_date,return_date,total,advance,due,balance_due_date,full_paid,pay_note,dmc,dmc_advance,dmc_full,actual_ticket_cost,actual_dmc_advance_cost,actual_dmc_cost,actual_delivery_cost,actual_extra_cost,actual_extra_note,estimated_profit,tickets,dmc_advance_paid,dmc_full_paid,prepared,sent,checkin,arrival,departed,returned,cancelled,child_categories,merged_invoices,remarks,created_date) VALUES ('YH4133','','Kasun Madushanka','0755443322',5,'Bangkok & Pattaya','Air Asia','12 Apr - 18 Apr 2026','2026-04-12','2026-04-18',925000,555000,370000,'2026-03-12','','Due date: 12 March. 3 PNR.','D&G Thailand','','',0,0,0,0,0,'',0,false,false,false,false,false,false,false,false,false,false,'[]','[]','3 PNR — family group booking.','2026-02-28') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO bookings (id,invoice_id,name,mobile,pax,dest,airline,date,departure_date,return_date,total,advance,due,balance_due_date,full_paid,pay_note,dmc,dmc_advance,dmc_full,actual_ticket_cost,actual_dmc_advance_cost,actual_dmc_cost,actual_delivery_cost,actual_extra_cost,actual_extra_note,estimated_profit,tickets,dmc_advance_paid,dmc_full_paid,prepared,sent,checkin,arrival,departed,returned,cancelled,child_categories,merged_invoices,remarks,created_date) VALUES ('YH4132','','Tharanga Wickramasinghe','0722334455',2,'Bangkok','Thai Airways','05 Jun - 10 Jun 2026','2026-06-05','2026-06-10',440000,264000,176000,'2026-05-05','','Balance due 5 May.','D&G Thailand','','',0,0,0,0,0,'',0,false,false,false,false,false,false,false,false,false,false,'[]','[]','','2026-03-04') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO bookings (id,invoice_id,name,mobile,pax,dest,airline,date,departure_date,return_date,total,advance,due,balance_due_date,full_paid,pay_note,dmc,dmc_advance,dmc_full,actual_ticket_cost,actual_dmc_advance_cost,actual_dmc_cost,actual_delivery_cost,actual_extra_cost,actual_extra_note,estimated_profit,tickets,dmc_advance_paid,dmc_full_paid,prepared,sent,checkin,arrival,departed,returned,cancelled,child_categories,merged_invoices,remarks,created_date) VALUES ('YH4131','','Priya Seneviratne','0703219876',3,'Phuket','Singapore Airlines','08 Mar - 13 Mar 2026','2026-03-08','2026-03-13',615000,615000,0,'','Cash','Fully settled in cash.','D&G Thailand','54,600 THB','',165000,218400,0,2000,8000,'Travel insurance',45000,true,true,false,true,true,true,false,false,false,false,'[]','[]','Insurance included.','2026-02-20') ON CONFLICT (id) DO NOTHING`;
console.log("  ✅ 5 bookings");

await sql`INSERT INTO customers (id,name,mobile,city,email,notes,source,created_date) VALUES ('CUS4135','Nimal Perera','0771234567','','','','auto','2026-03-01') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO customers (id,name,mobile,city,email,notes,source,created_date) VALUES ('CUS4134','Dilini Jayawardena','0712345678','','','','auto','2026-03-05') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO customers (id,name,mobile,city,email,notes,source,created_date) VALUES ('CUS4133','Kasun Madushanka','0755443322','','','','auto','2026-02-28') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO customers (id,name,mobile,city,email,notes,source,created_date) VALUES ('CUS4132','Tharanga Wickramasinghe','0722334455','','','','auto','2026-03-04') ON CONFLICT (id) DO NOTHING`;
await sql`INSERT INTO customers (id,name,mobile,city,email,notes,source,created_date) VALUES ('CUS4131','Priya Seneviratne','0703219876','','','','auto','2026-02-20') ON CONFLICT (id) DO NOTHING`;
console.log("  ✅ 5 customers");

await sql`INSERT INTO suppliers (id,name,type,contact_person,phone,email,bank_name,bank_account,bank_branch,payment_notes,notes,created_date) VALUES ('SUP001','D&G Thailand','DMC','D&G Agent','','','Bangkok Bank','','','Pay in THB via wire transfer','Main DMC partner for Thailand packages','2026-01-01') ON CONFLICT (id) DO NOTHING`;
console.log("  ✅ 1 supplier");

console.log("🎉 Database ready!");
