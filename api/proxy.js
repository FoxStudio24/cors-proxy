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
    const upstream = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        origin: undefined
      },
      body: ['GET','HEAD'].includes(req.method) ? undefined : req.body
    });

    const data = await upstream.arrayBuffer();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
    return res.status(upstream.status).send(Buffer.from(data));
  } catch (err) {
    return res.status(502).json({ error: 'Fetch failed', details: err.message });
  }
}
