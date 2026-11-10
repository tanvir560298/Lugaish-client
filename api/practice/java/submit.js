import { judgeJavaSubmission } from '../../lib/javaJudge.js';
import { getInternalProblemForJudging } from '../../data/javaProblemsRegistry.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { topicSlug = 'basic-io-variables', problemId, sourceCode } = body || {};

    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required.' });
    }

    if (!sourceCode || typeof sourceCode !== 'string' || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        verdict: 'Compilation Error',
        compileOutput: 'Error: No Java source code provided.'
      });
    }

    const internalProblem = getInternalProblemForJudging(topicSlug, problemId);
    if (!internalProblem) {
      return res.status(404).json({ error: `Problem with ID '${problemId}' not found.` });
    }

    const result = await judgeJavaSubmission({
      problem: internalProblem,
      sourceCode
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('[Vercel API] Error judging Java submission:', err);
    return res.status(500).json({
      success: false,
      verdict: 'Execution Service Unavailable',
      message: 'Failed to process submission. Please retry shortly.'
    });
  }
}
