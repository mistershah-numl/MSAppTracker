// api/entry.js  — PUT update | DELETE by id
// Called as /api/entry?id=xxx
const { getClient } = require('./_supabase');
const { checkAuth, setCors } = require('./_auth');
const { toRow, fromRow } = require('./entries');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req, res)) return;

  const sb  = getClient();
  const id  = req.query.id;

  if (!id) return res.status(400).json({ error: 'id is required' });

  // ── PUT: update existing entry ──
  if (req.method === 'PUT') {
    const body = req.body;
    if (!body.name || !body.uni) {
      return res.status(400).json({ error: 'name and uni are required' });
    }
    const row = toRow(body);
    delete row.id; // don't overwrite PK

    const { data, error } = await sb
      .from('entries')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data)  return res.status(404).json({ error: 'Entry not found' });
    return res.status(200).json(fromRow(data));
  }

  // ── DELETE: remove entry ──
  if (req.method === 'DELETE') {
    const { error } = await sb.from('entries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, id });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
