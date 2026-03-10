import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (req.method === "GET") {
      if (id) {
        const rows = await sql`SELECT * FROM quotes WHERE id = ${id}`;
        if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(dbToQuote(rows[0]));
      }
      const rows = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
      return Response.json(rows.map(dbToQuote));
    }

    if (req.method === "POST") {
      const q = await req.json();
      await sql`
        INSERT INTO quotes (
          id, name, mobile, pax, price_per_pax, total, tour, airline, hotels,
          date, status, notes, dmc_rate, charges, profit, ticket_price, with_ticket,
          inclusions, child_categories, cities, airlines, created_date
        ) VALUES (
          ${q.id}, ${q.name}, ${q.mobile||''}, ${q.pax||1},
          ${q.pricePerPax||0}, ${q.total||0}, ${q.tour||''},
          ${q.airline||''}, ${q.hotels||''}, ${q.date||''},
          ${q.status||'draft'}, ${q.notes||''},
          ${q.dmcRate||0}, ${q.charges||0}, ${q.profit||0},
          ${q.ticketPrice||0}, ${q.withTicket!==false},
          ${JSON.stringify(q.inclusions||[])},
          ${JSON.stringify(q.childCategories||[])},
          ${JSON.stringify(q.cityNights||q.cities||[])},
          ${JSON.stringify(q.airlines||[])},
          ${q.createdDate||q.date||new Date().toISOString().split('T')[0]}
        )
      `;
      return Response.json({ ok: true, id: q.id }, { status: 201 });
    }

    if (req.method === "PUT") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      const q = await req.json();
      await sql`
        UPDATE quotes SET
          name             = ${q.name},
          mobile           = ${q.mobile||''},
          pax              = ${q.pax||1},
          price_per_pax    = ${q.pricePerPax||0},
          total            = ${q.total||0},
          tour             = ${q.tour||''},
          airline          = ${q.airline||''},
          hotels           = ${q.hotels||''},
          date             = ${q.date||''},
          status           = ${q.status||'draft'},
          notes            = ${q.notes||''},
          dmc_rate         = ${q.dmcRate||0},
          charges          = ${q.charges||0},
          profit           = ${q.profit||0},
          ticket_price     = ${q.ticketPrice||0},
          with_ticket      = ${q.withTicket!==false},
          inclusions       = ${JSON.stringify(q.inclusions||[])},
          child_categories = ${JSON.stringify(q.childCategories||[])},
          cities           = ${JSON.stringify(q.cityNights||q.cities||[])},
          airlines         = ${JSON.stringify(q.airlines||[])}
        WHERE id = ${id}
      `;
      return Response.json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      await sql`DELETE FROM quotes WHERE id = ${id}`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });

  } catch (err) {
    console.error("quotes error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

function dbToQuote(r) {
  return {
    id: r.id,
    name: r.name,
    mobile: r.mobile,
    pax: r.pax,
    pricePerPax: r.price_per_pax,
    total: r.total,
    tour: r.tour,
    airline: r.airline,
    hotels: r.hotels,
    date: r.date,
    status: r.status,
    notes: r.notes,
    dmcRate: r.dmc_rate,
    charges: r.charges,
    profit: r.profit,
    ticketPrice: r.ticket_price,
    withTicket: r.with_ticket,
    inclusions: r.inclusions || [],
    childCategories: r.child_categories || [],
    cityNights: r.cities || [],
    airlines: r.airlines || [],
    createdDate: r.created_date,
  };
}

export const config = { path: "/api/quotes" };
