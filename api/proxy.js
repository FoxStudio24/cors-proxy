export default async function handler(req, res) {
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
                           .setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
                           .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                           .end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    const upstream = await fetch(url);
    const json = await upstream.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(json);
  } catch (err) {
    return res.status(502).json({ error: 'Fetch failed', details: err.message });
  }
}
