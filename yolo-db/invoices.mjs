import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (req.method === "GET") {
      if (id) {
        const rows = await sql`SELECT * FROM invoices WHERE id = ${id}`;
        if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(dbToInvoice(rows[0]));
      }
      const rows = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
      return Response.json(rows.map(dbToInvoice));
    }

    if (req.method === "POST") {
      const inv = await req.json();
      await sql`
        INSERT INTO invoices (
          id, quote_id, name, mobile, tour, airline, hotels,
          inclusions, child_categories, pax, price_per_pax, total,
          deposit, balance, within30, travel_date, balance_due_date,
          estimated_profit, deposit_paid, balance_paid, status,
          travel_start_date, return_date, merged_into_booking, created_date
        ) VALUES (
          ${inv.id}, ${inv.quoteId||''}, ${inv.name}, ${inv.mobile||''},
          ${inv.tour||''}, ${inv.airline||''}, ${inv.hotels||''},
          ${JSON.stringify(inv.inclusions||[])},
          ${JSON.stringify(inv.childCategories||[])},
          ${inv.pax||1}, ${inv.pricePerPax||0}, ${inv.total||0},
          ${inv.deposit||0}, ${inv.balance||0}, ${inv.within30||false},
          ${inv.travelDate||''}, ${inv.balanceDueDate||''},
          ${inv.estimatedProfit||0},
          ${inv.depositPaid||false}, ${inv.balancePaid||false},
          ${inv.status||'unpaid'},
          ${inv.travelDate||''}, ${inv.returnDate||''},
          ${inv.mergedIntoBooking||''},
          ${inv.createdDate||new Date().toISOString().split('T')[0]}
        )
      `;
      return Response.json({ ok: true, id: inv.id }, { status: 201 });
    }

    if (req.method === "PUT") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      const inv = await req.json();
      await sql`
        UPDATE invoices SET
          quote_id             = ${inv.quoteId||''},
          name                 = ${inv.name},
          mobile               = ${inv.mobile||''},
          tour                 = ${inv.tour||''},
          airline              = ${inv.airline||''},
          hotels               = ${inv.hotels||''},
          inclusions           = ${JSON.stringify(inv.inclusions||[])},
          child_categories     = ${JSON.stringify(inv.childCategories||[])},
          pax                  = ${inv.pax||1},
          price_per_pax        = ${inv.pricePerPax||0},
          total                = ${inv.total||0},
          deposit              = ${inv.deposit||0},
          balance              = ${inv.balance||0},
          within30             = ${inv.within30||false},
          travel_date          = ${inv.travelDate||''},
          balance_due_date     = ${inv.balanceDueDate||''},
          estimated_profit     = ${inv.estimatedProfit||0},
          deposit_paid         = ${inv.depositPaid||false},
          balance_paid         = ${inv.balancePaid||false},
          status               = ${inv.status||'unpaid'},
          travel_start_date    = ${inv.travelDate||''},
          return_date          = ${inv.returnDate||''},
          merged_into_booking  = ${inv.mergedIntoBooking||''}
        WHERE id = ${id}
      `;
      return Response.json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });

  } catch (err) {
    console.error("invoices error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

function dbToInvoice(r) {
  return {
    id: r.id,
    quoteId: r.quote_id,
    name: r.name,
    mobile: r.mobile,
    tour: r.tour,
    airline: r.airline,
    hotels: r.hotels,
    inclusions: r.inclusions || [],
    childCategories: r.child_categories || [],
    pax: r.pax,
    pricePerPax: r.price_per_pax,
    total: r.total,
    deposit: r.deposit,
    balance: r.balance,
    within30: r.within30,
    travelDate: r.travel_date,
    balanceDueDate: r.balance_due_date,
    estimatedProfit: r.estimated_profit,
    depositPaid: r.deposit_paid,
    balancePaid: r.balance_paid,
    status: r.status,
    returnDate: r.return_date,
    mergedIntoBooking: r.merged_into_booking,
    createdDate: r.created_date,
  };
}

export const config = { path: "/api/invoices" };
