// api/entries.js  — GET all entries | POST new entry
const { getClient } = require('./_supabase');
const { checkAuth, setCors } = require('./_auth');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req, res)) return;

  const sb = getClient();

  // ── GET: fetch all entries ordered by newest first ──
  if (req.method === 'GET') {
    const { data, error } = await sb
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── POST: create new entry ──
  if (req.method === 'POST') {
    const body = req.body;
    if (!body.name || !body.uni) {
      return res.status(400).json({ error: 'name and uni are required' });
    }
    const row = toRow(body);
    const { data, error } = await sb.from('entries').insert(row).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(fromRow(data));
  }

  res.status(405).json({ error: 'Method not allowed' });
};

// ── map JS camelCase → DB snake_case ──
function toRow(b) {
  return {
    id:           b.id,
    type:         b.type         || 'Professor',
    country:      b.country      || 'Canada',
    name:         b.name,
    uni:          b.uni,
    dept:         b.dept         || null,
    degree:       b.degree       || 'MS',
    areas:        b.areas        || null,
    funding:      b.funding      || 'Unknown',
    fit:          b.fit          || 'no',
    status:       b.status       || 'Not Applied',
    deadline:     b.deadline     || null,
    response:     b.response     || null,
    email:        b.email        || null,
    phone:        b.phone        || null,
    web:          b.web          || null,
    portal:       b.portal       || null,
    scholar:      b.scholar      || null,
    linkedin:     b.linkedin     || null,
    twitter:      b.twitter      || null,
    rg:           b.rg           || null,
    note:         b.note         || null,
    email_draft:  b.emailDraft   || null,
    custom_label: b.customLabel  || null,
    custom_value: b.customValue  || null,
  };
}

// ── map DB snake_case → JS camelCase ──
function fromRow(r) {
  return {
    id:          r.id,
    type:        r.type,
    country:     r.country,
    name:        r.name,
    uni:         r.uni,
    dept:        r.dept,
    degree:      r.degree,
    areas:       r.areas,
    funding:     r.funding,
    fit:         r.fit,
    status:      r.status,
    deadline:    r.deadline,
    response:    r.response,
    email:       r.email,
    phone:       r.phone,
    web:         r.web,
    portal:      r.portal,
    scholar:     r.scholar,
    linkedin:    r.linkedin,
    twitter:     r.twitter,
    rg:          r.rg,
    note:        r.note,
    emailDraft:  r.email_draft,
    customLabel: r.custom_label,
    customValue: r.custom_value,
    created:     new Date(r.created_at).getTime(),
    updated:     new Date(r.updated_at).getTime(),
  };
}

module.exports.toRow   = toRow;
module.exports.fromRow = fromRow;
