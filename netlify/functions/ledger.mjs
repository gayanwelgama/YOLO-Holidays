import { neon } from '@netlify/neon';

const sql = neon();

await sql`CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)`;

export default async (req, context) => {
  const url  = new URL(req.url);
  const id   = url.searchParams.get('id');
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') return new Response('', { headers: cors });

  try {
    if (req.method === 'GET') {
      if (id) {
        const rows = await sql`SELECT data FROM ledger WHERE id = ${id}`;
        if (!rows.length) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: cors });
        return new Response(JSON.stringify(rows[0].data), { headers: cors });
      }
      const rows = await sql`SELECT data FROM ledger ORDER BY created_at DESC`;
      return new Response(JSON.stringify(rows.map(r => r.data)), { headers: cors });
    }
    if (req.method === 'POST') {
      const body = await req.json();
      await sql`INSERT INTO ledger (id, data) VALUES (${body.id}, ${JSON.stringify(body)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(body)}, updated_at = now()`;
      return new Response(JSON.stringify(body), { headers: cors });
    }
    if (req.method === 'PUT') {
      if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: cors });
      const body = await req.json();
      await sql`UPDATE ledger SET data = ${JSON.stringify(body)}, updated_at = now() WHERE id = ${id}`;
      return new Response(JSON.stringify(body), { headers: cors });
    }
    if (req.method === 'DELETE') {
      if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: cors });
      await sql`DELETE FROM ledger WHERE id = ${id}`;
      return new Response(JSON.stringify({ deleted: true }), { headers: cors });
    }
    return new Response('Method not allowed', { status: 405, headers: cors });
  } catch (e) {
    console.error('ledger error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
};

export const config = { path: '/api/ledger' };
