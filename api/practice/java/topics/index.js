import { getAllTopics } from '../../../data/javaProblemsRegistry.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const topics = getAllTopics();
    return res.status(200).json({ topics });
  } catch (err) {
    console.error('[Vercel API] Error fetching topics:', err);
    return res.status(500).json({ error: 'Failed to retrieve practice topics.' });
  }
}
