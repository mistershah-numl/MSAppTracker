// api/_supabase.js  — shared Supabase client for all API routes
const { createClient } = require('@supabase/supabase-js');

let client = null;

function getClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY; // service role key (server only)
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }
  client = createClient(url, key, {
    auth: { persistSession: false }
  });
  return client;
}

module.exports = { getClient };
