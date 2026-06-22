// api/_auth.js  — simple secret-based auth for personal use
function checkAuth(req, res) {
  const secret = process.env.API_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'API_SECRET not configured on server' });
    return false;
  }
  const provided = req.headers['x-api-secret'];
  if (!provided || provided !== secret) {
    res.status(401).json({ error: 'Unauthorized — wrong or missing API secret' });
    return false;
  }
  return true;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-api-secret');
}

module.exports = { checkAuth, setCors };
