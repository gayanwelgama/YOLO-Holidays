import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (req.method === "GET") {
      if (id) {
        const rows = await sql`SELECT * FROM suppliers WHERE id = ${id}`;
        if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(dbToSupplier(rows[0]));
      }
      const rows = await sql`SELECT * FROM suppliers ORDER BY type, name`;
      return Response.json(rows.map(dbToSupplier));
    }

    if (req.method === "POST") {
      const s = await req.json();
      await sql`
        INSERT INTO suppliers (
          id, name, type, contact_person, phone, email,
          bank_name, bank_account, bank_branch, payment_notes, notes, cities, services, created_date
        ) VALUES (
          ${s.id}, ${s.name}, ${s.type||'DMC'},
          ${s.contactPerson||''}, ${s.phone||''}, ${s.email||''},
          ${s.bankName||''}, ${s.bankAccount||''}, ${s.bankBranch||''},
          ${s.paymentNotes||''}, ${s.notes||''},
          ${JSON.stringify(s.cities||[])},
          ${JSON.stringify(s.services||[])},
          ${s.createdDate||new Date().toISOString().split('T')[0]}
        )
      `;
      return Response.json({ ok: true, id: s.id }, { status: 201 });
    }

    if (req.method === "PUT") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      const s = await req.json();
      await sql`
        UPDATE suppliers SET
          name           = ${s.name},
          type           = ${s.type||'DMC'},
          contact_person = ${s.contactPerson||''},
          phone          = ${s.phone||''},
          email          = ${s.email||''},
          bank_name      = ${s.bankName||''},
          bank_account   = ${s.bankAccount||''},
          bank_branch    = ${s.bankBranch||''},
          payment_notes  = ${s.paymentNotes||''},
          notes          = ${s.notes||''},
          cities         = ${JSON.stringify(s.cities||[])},
          services       = ${JSON.stringify(s.services||[])}
        WHERE id = ${id}
      `;
      return Response.json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      await sql`DELETE FROM suppliers WHERE id = ${id}`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });

  } catch (err) {
    console.error("suppliers error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

function dbToSupplier(r) {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    contactPerson: r.contact_person,
    phone: r.phone,
    email: r.email,
    bankName: r.bank_name,
    bankAccount: r.bank_account,
    bankBranch: r.bank_branch,
    paymentNotes: r.payment_notes,
    notes: r.notes,
    cities: r.cities || [],
    services: r.services || [],
    createdDate: r.created_date,
  };
}

export const config = { path: "/api/suppliers" };
