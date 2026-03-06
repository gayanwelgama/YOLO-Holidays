import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const mobile = url.searchParams.get("mobile");

  try {
    if (req.method === "GET") {
      // Lookup by mobile (for phone-match feature)
      if (mobile) {
        const norm = normaliseMobile(mobile);
        const rows = await sql`SELECT * FROM customers`;
        const match = rows.find(r => normaliseMobile(r.mobile) === norm);
        if (!match) return Response.json(null);
        return Response.json(dbToCustomer(match));
      }
      if (id) {
        const rows = await sql`SELECT * FROM customers WHERE id = ${id}`;
        if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(dbToCustomer(rows[0]));
      }
      const rows = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
      return Response.json(rows.map(dbToCustomer));
    }

    if (req.method === "POST") {
      const c = await req.json();
      // Upsert by mobile — if exists update name, else insert
      const norm = normaliseMobile(c.mobile);
      const existing = await sql`SELECT id FROM customers WHERE mobile = ${c.mobile}`;
      if (existing.length) {
        // Update name if it was blank
        await sql`UPDATE customers SET name = COALESCE(NULLIF(name,''), ${c.name||''}) WHERE mobile = ${c.mobile}`;
        return Response.json({ ok: true, id: existing[0].id, updated: true });
      }
      await sql`
        INSERT INTO customers (id, name, mobile, city, email, notes, source, created_date)
        VALUES (
          ${c.id}, ${c.name||''}, ${c.mobile||''},
          ${c.city||''}, ${c.email||''}, ${c.notes||''},
          ${c.source||'auto'},
          ${c.createdDate||new Date().toISOString().split('T')[0]}
        )
      `;
      return Response.json({ ok: true, id: c.id }, { status: 201 });
    }

    if (req.method === "PUT") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      const c = await req.json();
      await sql`
        UPDATE customers SET
          name         = ${c.name||''},
          mobile       = ${c.mobile||''},
          city         = ${c.city||''},
          email        = ${c.email||''},
          notes        = ${c.notes||''}
        WHERE id = ${id}
      `;
      return Response.json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      await sql`DELETE FROM customers WHERE id = ${id}`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });

  } catch (err) {
    console.error("customers error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

function normaliseMobile(p) {
  return (p || '').replace(/[\s\-().]/g, '').replace(/^\+94/, '0').replace(/^94/, '0');
}

function dbToCustomer(r) {
  return {
    id: r.id,
    name: r.name,
    mobile: r.mobile,
    city: r.city,
    email: r.email,
    notes: r.notes,
    source: r.source,
    createdDate: r.created_date,
  };
}

export const config = { path: "/api/customers" };
