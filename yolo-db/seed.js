/**
 * Seed script — run ONCE after migrate.js to populate the DB with existing data.
 * Usage: NETLIFY_DATABASE_URL=<url> node scripts/seed.js
 *        OR: netlify env:get NETLIFY_DATABASE_URL then set it manually
 */
import { neon } from "@netlify/neon";

const sql = neon();

console.log("Seeding database…");

// ── QUOTES ──────────────────────────────────────────────────────────────────
const quotes = [
  {
    id: 'Q4135', name: 'Nimal Perera', mobile: '0771234567', pax: 2,
    pricePerPax: 185000, total: 370000,
    tour: 'Bangkok (3N) & Pattaya (2N) Tour', airline: 'Air Asia',
    hotels: 'Amari Pattaya & Mercure Bangkok Siam',
    date: '2026-03-06', status: 'confirmed', notes: '',
    dmcRate: 14500, charges: 3500, profit: 18000, ticketPrice: 42000,
    inclusions: ['Return Air Ticket (20+7 KG Luggage)','3* Hotel Accommodation with Breakfast','Coral Island Tour with Lunch','Tiger Park Pattaya','Floating Market Tour','Chao Phraya International Dinner Cruise','Dream World & Snow Town with Lunch','All Airport & Intercity Transfers'],
    childCategories: [], cities: [], airlines: []
  },
  {
    id: 'Q4134', name: 'Dilini Jayawardena', mobile: '0712345678', pax: 4,
    pricePerPax: 210000, total: 840000,
    tour: 'Phuket (3N) & Bangkok (3N) Tour', airline: 'Sri Lankan',
    hotels: 'Holiday Inn Phuket & Centara Grand Bangkok',
    date: '2026-03-05', status: 'invoiced', notes: 'Upgrade to sea-view room requested',
    dmcRate: 18200, charges: 4000, profit: 22000, ticketPrice: 55000,
    inclusions: ['Return Air Ticket with Sri Lankan Airlines (20+7 KG)','3* Hotel Accommodation with Breakfast','Phi Phi Islands Tour by Speedboat with Lunch','James Bond Island Tour with Lunch','Old Phuket Town Walking Tour','Chao Phraya Dinner Cruise','Madame Tussauds Bangkok','All Transfers'],
    childCategories: [], cities: [], airlines: []
  },
  {
    id: 'Q4133', name: 'Ruwan Bandara', mobile: '0759876543', pax: 3,
    pricePerPax: 165000, total: 495000,
    tour: 'Bangkok (4N) City & Theme Park Tour', airline: 'Thai Airways',
    hotels: 'Novotel Bangkok Sukhumvit',
    date: '2026-03-04', status: 'sent', notes: '',
    dmcRate: 12800, charges: 3000, profit: 15000, ticketPrice: 48000,
    inclusions: ['Return Air Ticket with Thai Airways (20+7 KG)','3* Hotel Accommodation with Breakfast','Dream World & Snow Town with Lunch','SEA LIFE Bangkok Ocean World','Madame Tussauds Wax Museum','Chatuchak Weekend Market Tour','Chao Phraya Dinner Cruise','All Transfers'],
    childCategories: [], cities: [], airlines: []
  },
  {
    id: 'Q4132', name: 'Sachini Fernando', mobile: '0768901234', pax: 2,
    pricePerPax: 320000, total: 640000,
    tour: 'Phuket (4N) Luxury Beach Escape', airline: 'Emirates',
    hotels: 'Pullman Phuket Panwa Beach',
    date: '2026-03-03', status: 'draft', notes: 'Honeymoon package — add room decoration',
    dmcRate: 24000, charges: 5000, profit: 28000, ticketPrice: 72000,
    inclusions: ['Return Air Ticket with Emirates (30+7 KG)','4* Beachfront Hotel with Breakfast','Phi Phi Islands Full Day Tour with Lunch','James Bond Island Tour','Old Town Tuk-Tuk Tour','Couples Spa Treatment (60 min)','Private Airport Transfers','Honeymoon Room Decoration'],
    childCategories: [], cities: [], airlines: []
  }
];

for (const q of quotes) {
  await sql`
    INSERT INTO quotes (id, name, mobile, pax, price_per_pax, total, tour, airline, hotels,
      date, status, notes, dmc_rate, charges, profit, ticket_price, with_ticket,
      inclusions, child_categories, cities, airlines, created_date)
    VALUES (${q.id}, ${q.name}, ${q.mobile}, ${q.pax}, ${q.pricePerPax}, ${q.total},
      ${q.tour}, ${q.airline}, ${q.hotels}, ${q.date}, ${q.status}, ${q.notes},
      ${q.dmcRate}, ${q.charges}, ${q.profit}, ${q.ticketPrice}, true,
      ${JSON.stringify(q.inclusions)}, ${JSON.stringify(q.childCategories)},
      ${JSON.stringify(q.cities)}, ${JSON.stringify(q.airlines)}, ${q.date})
    ON CONFLICT (id) DO NOTHING
  `;
}
console.log(`✅ Seeded ${quotes.length} quotes`);

// ── INVOICES ─────────────────────────────────────────────────────────────────
const invoices = [
  {
    id: 'INV-4134', quoteId: 'Q4134',
    name: 'Dilini Jayawardena', mobile: '0712345678',
    tour: 'Phuket (3N) & Bangkok (3N) Tour', airline: 'Sri Lankan',
    hotels: 'Holiday Inn Phuket & Centara Grand Bangkok',
    inclusions: ['Return Air Ticket with Sri Lankan Airlines (20+7 KG)','3* Hotel Accommodation with Breakfast','Phi Phi Islands Tour by Speedboat with Lunch','James Bond Island Tour with Lunch','Old Phuket Town Walking Tour','Chao Phraya Dinner Cruise','Madame Tussauds Bangkok','All Transfers'],
    pax: 4, pricePerPax: 210000, total: 840000,
    deposit: 504000, balance: 336000, within30: false,
    travelDate: '2026-05-10', balanceDueDate: '2026-04-10',
    createdDate: '2026-03-05', estimatedProfit: 88000,
    depositPaid: true, balancePaid: false, status: 'partial'
  },
  {
    id: 'INV-4135', quoteId: 'Q4135',
    name: 'Nimal Perera', mobile: '0771234567',
    tour: 'Bangkok (3N) & Pattaya (2N) Tour', airline: 'Air Asia',
    hotels: 'Amari Pattaya & Mercure Bangkok Siam',
    inclusions: ['Return Air Ticket (20+7 KG Luggage)','3* Hotel Accommodation with Breakfast','Coral Island Tour with Lunch','Tiger Park Pattaya','Floating Market Tour','Chao Phraya International Dinner Cruise','Dream World & Snow Town with Lunch','All Airport & Intercity Transfers'],
    pax: 2, pricePerPax: 185000, total: 370000,
    deposit: 370000, balance: 0, within30: true,
    travelDate: '2026-03-20', balanceDueDate: '',
    createdDate: '2026-03-06', estimatedProfit: 36000,
    depositPaid: true, balancePaid: true, status: 'paid'
  }
];

for (const inv of invoices) {
  await sql`
    INSERT INTO invoices (id, quote_id, name, mobile, tour, airline, hotels,
      inclusions, child_categories, pax, price_per_pax, total,
      deposit, balance, within30, travel_date, balance_due_date,
      estimated_profit, deposit_paid, balance_paid, status,
      travel_start_date, return_date, merged_into_booking, created_date)
    VALUES (${inv.id}, ${inv.quoteId}, ${inv.name}, ${inv.mobile},
      ${inv.tour}, ${inv.airline}, ${inv.hotels},
      ${JSON.stringify(inv.inclusions)}, '[]',
      ${inv.pax}, ${inv.pricePerPax}, ${inv.total},
      ${inv.deposit}, ${inv.balance}, ${inv.within30},
      ${inv.travelDate}, ${inv.balanceDueDate},
      ${inv.estimatedProfit}, ${inv.depositPaid}, ${inv.balancePaid}, ${inv.status},
      ${inv.travelDate}, '', '', ${inv.createdDate})
    ON CONFLICT (id) DO NOTHING
  `;
}
console.log(`✅ Seeded ${invoices.length} invoices`);

// ── BOOKINGS ─────────────────────────────────────────────────────────────────
const bookings = [
  {
    id: 'YH4135', invoiceId: 'INV-4135', name: 'Nimal Perera', mobile: '0771234567', pax: 2,
    dest: 'Bangkok & Pattaya', airline: 'Air Asia',
    departureDate: '2026-03-20', returnDate: '2026-03-25', date: '20 Mar - 25 Mar 2026',
    total: 370000, advance: 370000, due: 0, balanceDueDate: '',
    fullPaid: 'Invoice', payNote: 'INV-4135 — fully paid',
    dmc: 'D&G Thailand', dmcAdvance: '', dmcFull: '',
    actualTicketCost: 84000, actualDmcAdvanceCost: 0, actualDmcCost: 29000,
    actualDeliveryCost: 1500, actualExtraCost: 0, actualExtraNote: '',
    estimatedProfit: 36000,
    tickets: true, dmcAdvancePaid: false, dmcFullPaid: true,
    prepared: true, sent: true, checkin: false, arrival: false,
    departed: false, returned: false, cancelled: false,
    childCategories: [], mergedInvoices: [],
    createdDate: '2026-03-01', remarks: 'Fully paid. Package sent.'
  },
  {
    id: 'YH4134', invoiceId: 'INV-4134', name: 'Dilini Jayawardena', mobile: '0712345678', pax: 4,
    dest: 'Phuket & Bangkok', airline: 'Sri Lankan',
    departureDate: '2026-05-10', returnDate: '2026-05-16', date: '10 May - 16 May 2026',
    total: 840000, advance: 504000, due: 336000, balanceDueDate: '2026-04-10',
    fullPaid: '', payNote: 'Deposit via Seylan. Balance due 10 Apr.',
    dmc: 'D&G Thailand', dmcAdvance: '', dmcFull: '',
    actualTicketCost: 220000, actualDmcAdvanceCost: 72800, actualDmcCost: 0,
    actualDeliveryCost: 0, actualExtraCost: 0, actualExtraNote: '',
    estimatedProfit: 88000,
    tickets: true, dmcAdvancePaid: true, dmcFullPaid: false,
    prepared: false, sent: false, checkin: false, arrival: false,
    departed: false, returned: false, cancelled: false,
    childCategories: [], mergedInvoices: [],
    createdDate: '2026-03-05', remarks: 'Sea-view room upgrade requested. Confirm with DMC.'
  },
  {
    id: 'YH4133', invoiceId: '', name: 'Kasun Madushanka', mobile: '0755443322', pax: 5,
    dest: 'Bangkok & Pattaya', airline: 'Air Asia',
    departureDate: '2026-04-12', returnDate: '2026-04-18', date: '12 Apr - 18 Apr 2026',
    total: 925000, advance: 555000, due: 370000, balanceDueDate: '2026-03-12',
    fullPaid: '', payNote: 'Due date: 12 March. 3 PNR.',
    dmc: 'D&G Thailand', dmcAdvance: '', dmcFull: '',
    actualTicketCost: 0, actualDmcAdvanceCost: 0, actualDmcCost: 0,
    actualDeliveryCost: 0, actualExtraCost: 0, actualExtraNote: '',
    estimatedProfit: 0,
    tickets: false, dmcAdvancePaid: false, dmcFullPaid: false,
    prepared: false, sent: false, checkin: false, arrival: false,
    departed: false, returned: false, cancelled: false,
    childCategories: [], mergedInvoices: [],
    createdDate: '2026-02-28', remarks: '3 PNR — family group booking.'
  },
  {
    id: 'YH4132', invoiceId: '', name: 'Tharanga Wickramasinghe', mobile: '0722334455', pax: 2,
    dest: 'Bangkok', airline: 'Thai Airways',
    departureDate: '2026-06-05', returnDate: '2026-06-10', date: '05 Jun - 10 Jun 2026',
    total: 440000, advance: 264000, due: 176000, balanceDueDate: '2026-05-05',
    fullPaid: '', payNote: 'Balance due 5 May.',
    dmc: 'D&G Thailand', dmcAdvance: '', dmcFull: '',
    actualTicketCost: 0, actualDmcAdvanceCost: 0, actualDmcCost: 0,
    actualDeliveryCost: 0, actualExtraCost: 0, actualExtraNote: '',
    estimatedProfit: 0,
    tickets: false, dmcAdvancePaid: false, dmcFullPaid: false,
    prepared: false, sent: false, checkin: false, arrival: false,
    departed: false, returned: false, cancelled: false,
    childCategories: [], mergedInvoices: [],
    createdDate: '2026-03-04', remarks: ''
  },
  {
    id: 'YH4131', invoiceId: '', name: 'Priya Seneviratne', mobile: '0703219876', pax: 3,
    dest: 'Phuket', airline: 'Singapore Airlines',
    departureDate: '2026-03-08', returnDate: '2026-03-13', date: '08 Mar - 13 Mar 2026',
    total: 615000, advance: 615000, due: 0, balanceDueDate: '',
    fullPaid: 'Cash', payNote: 'Fully settled in cash.',
    dmc: 'D&G Thailand', dmcAdvance: '54,600 THB', dmcFull: '',
    actualTicketCost: 165000, actualDmcAdvanceCost: 218400, actualDmcCost: 0,
    actualDeliveryCost: 2000, actualExtraCost: 8000, actualExtraNote: 'Travel insurance',
    estimatedProfit: 45000,
    tickets: true, dmcAdvancePaid: true, dmcFullPaid: false,
    prepared: true, sent: true, checkin: true, arrival: false,
    departed: false, returned: false, cancelled: false,
    childCategories: [], mergedInvoices: [],
    createdDate: '2026-02-20', remarks: 'Insurance included.'
  }
];

for (const b of bookings) {
  await sql`
    INSERT INTO bookings (id, invoice_id, name, mobile, pax, dest, airline, date,
      departure_date, return_date, total, advance, due, balance_due_date,
      full_paid, pay_note, dmc, dmc_advance, dmc_full,
      actual_ticket_cost, actual_dmc_advance_cost, actual_dmc_cost,
      actual_delivery_cost, actual_extra_cost, actual_extra_note,
      estimated_profit, tickets, dmc_advance_paid, dmc_full_paid,
      prepared, sent, checkin, arrival, departed, returned, cancelled,
      child_categories, merged_invoices, remarks, created_date)
    VALUES (${b.id}, ${b.invoiceId}, ${b.name}, ${b.mobile}, ${b.pax},
      ${b.dest}, ${b.airline}, ${b.date}, ${b.departureDate}, ${b.returnDate},
      ${b.total}, ${b.advance}, ${b.due}, ${b.balanceDueDate},
      ${b.fullPaid}, ${b.payNote}, ${b.dmc}, ${b.dmcAdvance}, ${b.dmcFull},
      ${b.actualTicketCost}, ${b.actualDmcAdvanceCost}, ${b.actualDmcCost},
      ${b.actualDeliveryCost}, ${b.actualExtraCost}, ${b.actualExtraNote},
      ${b.estimatedProfit}, ${b.tickets}, ${b.dmcAdvancePaid}, ${b.dmcFullPaid},
      ${b.prepared}, ${b.sent}, ${b.checkin}, ${b.arrival},
      ${b.departed}, ${b.returned}, ${b.cancelled},
      ${JSON.stringify(b.childCategories)}, ${JSON.stringify(b.mergedInvoices)},
      ${b.remarks}, ${b.createdDate})
    ON CONFLICT (id) DO NOTHING
  `;
}
console.log(`✅ Seeded ${bookings.length} bookings`);

// ── CUSTOMERS (from bookings only) ───────────────────────────────────────────
const seen = new Set();
const customers = bookings
  .filter(b => !b.cancelled && (b.name || b.mobile))
  .filter(b => { const k = b.mobile||b.name; if (seen.has(k)) return false; seen.add(k); return true; })
  .map(b => ({
    id: 'CUS' + b.id.replace('YH',''),
    name: b.name, mobile: b.mobile,
    city: '', email: '', notes: '',
    source: 'auto', createdDate: b.createdDate
  }));

for (const c of customers) {
  await sql`
    INSERT INTO customers (id, name, mobile, city, email, notes, source, created_date)
    VALUES (${c.id}, ${c.name}, ${c.mobile}, '', '', '', ${c.source}, ${c.createdDate})
    ON CONFLICT (id) DO NOTHING
  `;
}
console.log(`✅ Seeded ${customers.length} customers`);

console.log("\n🎉 Seed complete! Your Yolo Holidays database is ready.");
