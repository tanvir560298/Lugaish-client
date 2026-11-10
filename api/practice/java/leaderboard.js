export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Attempt to proxy to deployed Render backend where MongoDB resides
  const renderUrl = process.env.VITE_API_URL || 'https://lugaish-server.onrender.com/api';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const backendRes = await fetch(`${renderUrl.replace(/\/$/, '')}/practice/java/leaderboard`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (backendRes.ok) {
      const data = await backendRes.json();
      return res.status(200).json(data);
    }
  } catch (err) {
    console.warn('[Vercel Leaderboard] Failed to proxy to Render:', err.message);
  }

  // Graceful fallback: return empty list rather than 500 error
  return res.status(200).json({ leaders: [] });
}
