import { getTopicBySlug, getPublicProblemsByTopic } from '../../../data/javaProblemsRegistry.js';

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
    const topicSlug = req.query?.topicSlug || 'basic-io-variables';
    const topic = getTopicBySlug(topicSlug);
    if (!topic) {
      return res.status(404).json({ error: `Topic '${topicSlug}' not found.` });
    }

    const problems = getPublicProblemsByTopic(topicSlug);
    return res.status(200).json({ topic, problems });
  } catch (err) {
    console.error('[Vercel API] Error fetching topic problems:', err);
    return res.status(500).json({ error: 'Failed to retrieve problems for topic.' });
  }
}

