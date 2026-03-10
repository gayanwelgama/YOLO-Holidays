// netlify/functions/tourpackages.mjs
// CRUD for tour package templates
import { neon } from '@netlify/neon';

const sql = neon();

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tour_packages (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;
}

export default async function handler(req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });

  await ensureTable();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET') {
      if (id) {
        const rows = await sql`SELECT data FROM tour_packages WHERE id = ${id}`;
        if (!rows.length) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        return new Response(JSON.stringify(rows[0].data), { status: 200, headers });
      }
      const rows = await sql`SELECT data FROM tour_packages ORDER BY created_at DESC`;
      return new Response(JSON.stringify(rows.map(r => r.data)), { status: 200, headers });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      if (!body.id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers });
      await sql`INSERT INTO tour_packages (id, data) VALUES (${body.id}, ${JSON.stringify(body)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(body)}, updated_at = NOW()`;
      return new Response(JSON.stringify(body), { status: 201, headers });
    }

    if (req.method === 'PUT') {
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers });
      const body = await req.json();
      await sql`UPDATE tour_packages SET data = ${JSON.stringify(body)}, updated_at = NOW() WHERE id = ${id}`;
      return new Response(JSON.stringify(body), { status: 200, headers });
    }

    if (req.method === 'DELETE') {
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers });
      await sql`DELETE FROM tour_packages WHERE id = ${id}`;
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    console.error('tourpackages error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export const config = { path: '/api/tourpackages' };
