import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Award
} from 'lucide-react';
import { fetchTopicProblems, getSolvedProblemIds } from './javaPracticeClient.js';
import { TOPIC_1_METADATA } from './javaPracticeData.js';

export function JavaPracticeListingPage() {
  const [topic, setTopic] = useState(TOPIC_1_METADATA);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedIds, setSolvedIds] = useState([]);

  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopicProblems('basic-io-variables');
      setTopic(data.topic || TOPIC_1_METADATA);
      setProblems(data.problems || []);
      setSolvedIds(getSolvedProblemIds());
    } catch (err) {
      console.error('Error loading practice problems:', err);
      setError('Could not load practice problems. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Update document title for SEO
    document.title = 'Basic Input, Output & Variables — Java Practice | Lugaish';
  }, []);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      // Difficulty filter
      if (selectedDifficulty !== 'All') {
        const probDiff = (prob.difficulty || '').toLowerCase();
        const selDiff = selectedDifficulty.toLowerCase();
        if (selDiff === 'easy') {
          if (!probDiff.startsWith('easy')) return false;
        } else if (selDiff === 'medium') {
          if (probDiff !== 'medium' && probDiff !== 'easy+') return false;
        } else if (selDiff === 'hard') {
          if (probDiff !== 'hard' && probDiff !== 'challenge') return false;
        } else if (probDiff !== selDiff) {
          return false;
        }
      }
      // Source filter
      if (selectedSource === 'Lugaish' && prob.problemType !== 'lugaish') {
        return false;
      }
      if (selectedSource === 'External' && prob.problemType !== 'external') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = prob.title?.toLowerCase().includes(query);
        const matchesNumber = prob.number?.toString().includes(query);
        const matchesPlatform = prob.sourcePlatform?.toLowerCase().includes(query);
        const matchesConcepts = prob.concepts?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNumber && !matchesPlatform && !matchesConcepts) {
          return false;
        }
      }
      return true;
    });
  }, [problems, selectedDifficulty, selectedSource, searchQuery]);

  // Statistics
  const totalCount = problems.length;
  const lugaishCount = problems.filter((p) => p.problemType === 'lugaish').length;
  const externalCount = problems.filter((p) => p.problemType === 'external').length;
  const solvedCount = problems.filter((p) => p.problemType === 'lugaish' && solvedIds.includes(p.id)).length;

  const getDifficultyBadge = (difficulty = 'Easy') => {
    const diff = (difficulty || '').toLowerCase();
    if (diff === 'hard' || diff === 'challenge') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          {difficulty}
        </span>
      );
    }
    if (diff === 'medium') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Medium
        </span>
      );
    }
    if (diff === 'easy+' || diff === 'easy plus') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Easy+
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Easy
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-200 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-300">Programming Practice</span>
        <span>/</span>
        <span className="text-amber-400">Java</span>
        <span>/</span>
        <span className="text-white font-semibold">{topic.title}</span>
      </nav>

      {/* Topic Header Card */}
      <div className="section-card relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-8 border border-slate-700/60 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Terminal className="w-3.5 h-3.5" />
              {topic.language}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Level: {topic.level}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Phase 1
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            {topic.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
            {topic.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
              <div className="text-xs text-slate-400 font-medium">Total Problems</div>
              <div className="text-xl font-bold text-white mt-0.5">{totalCount}</div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
              <div className="text-xs text-slate-400 font-medium">Lugaish Original</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">{lugaishCount}</div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
              <div className="text-xs text-slate-400 font-medium">External Practice</div>
              <div className="text-xl font-bold text-purple-400 mt-0.5">{externalCount}</div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
              <div className="text-xs text-slate-400 font-medium">Solved Challenges</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                {solvedCount}
                {solvedCount > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search problems by title, number, or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Dropdown / Group */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/70 rounded-xl p-1 text-xs">
            <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Difficulty:
            </span>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Source Dropdown / Group */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/70 rounded-xl p-1 text-xs">
            <span className="px-2 text-slate-400 font-medium">Source:</span>
            {['All', 'Lugaish', 'External'].map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedSource(src)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSource === src
                    ? 'bg-blue-500 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadData}
            title="Refresh problem list"
            className="p-2 text-slate-400 hover:text-white bg-slate-900/90 border border-slate-700/70 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="section-card rounded-2xl p-12 text-center border border-slate-800">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Loading Java practice problems...</p>
        </div>
      ) : error ? (
        <div className="section-card rounded-2xl p-8 text-center border border-rose-500/20 bg-rose-500/5">
          <p className="text-rose-400 font-semibold mb-3">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredProblems.length === 0 ? (
        /* Empty State */
        <div className="section-card rounded-2xl p-10 sm:p-14 text-center border border-slate-800/80 bg-slate-900/60 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Terminal className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {problems.length === 0
              ? 'Platform Ready for Problems'
              : 'No Problems Match Your Filters'}
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            {problems.length === 0
              ? 'The Java practice system and real code compiler infrastructure are fully operational. Coding challenges for Basic Input, Output & Variables will be uploaded here one by one.'
              : 'Try clearing your search query or switching your difficulty/source filters to see other challenges.'}
          </p>
          {problems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedDifficulty('All');
                setSelectedSource('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          )}
          {problems.length === 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Java OpenJDK 13 Execution Engine Online
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th scope="col" className="py-4 px-6 w-16 text-center">
                    No.
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Problem
                  </th>
                  <th scope="col" className="py-4 px-6 w-32 text-center">
                    Difficulty
                  </th>
                  <th scope="col" className="py-4 px-6 w-44">
                    Source
                  </th>
                  <th scope="col" className="py-4 px-6 w-32 text-center">
                    Status
                  </th>
                  <th scope="col" className="py-4 px-6 w-48 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {filteredProblems.map((prob) => {
                  const isSolved = prob.problemType === 'lugaish' && solvedIds.includes(prob.id);
                  const isExternal = prob.problemType === 'external';

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Number */}
                      <td className="py-4 px-6 text-center font-mono text-xs font-semibold text-slate-400">
                        {prob.number || prob.id}
                      </td>

                      {/* Problem Title */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                          {prob.title}
                          {isSolved && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" title="Solved" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {prob.concepts ? (
                            <span className="text-slate-300 font-medium">{prob.concepts}</span>
                          ) : (
                            <span>{topic.title} • {prob.language || 'Java'}</span>
                          )}
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-6 text-center">
                        {getDifficultyBadge(prob.difficulty)}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-6">
                        {isExternal ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            {prob.sourcePlatform || 'External'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            Lugaish Original
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {isExternal ? (
                          <span className="text-xs text-slate-500">—</span>
                        ) : isSolved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Unsolved</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        {isExternal ? (
                          <a
                            href={prob.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-all"
                          >
                            Practice on {prob.sourcePlatform || 'External'}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            to={`/practice/java/basic-io-variables/${prob.slug || prob.id}`}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isSolved
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold shadow-md shadow-amber-500/10'
                            }`}
                          >
                            {isSolved ? 'Review Code' : 'Solve Problem'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredProblems.map((prob) => {
              const isSolved = prob.problemType === 'lugaish' && solvedIds.includes(prob.id);
              const isExternal = prob.problemType === 'external';

              return (
                <div
                  key={prob.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        #{prob.number || prob.id}
                      </span>
                      {getDifficultyBadge(prob.difficulty)}
                    </div>
                    {isSolved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">
                      {prob.title}
                    </h3>
                    {prob.concepts && (
                      <div className="text-xs text-slate-300 font-medium mt-0.5">
                        {prob.concepts}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      {isExternal ? (
                        <span className="text-purple-400 font-medium">
                          Platform: {prob.sourcePlatform || 'External'}
                        </span>
                      ) : (
                        <span className="text-blue-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Lugaish Original
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    {isExternal ? (
                      <a
                        href={prob.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-all"
                      >
                        Practice on {prob.sourcePlatform || 'External'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={`/practice/java/basic-io-variables/${prob.slug || prob.id}`}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isSolved
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold shadow-md shadow-amber-500/10'
                        }`}
                      >
                        {isSolved ? 'Review Code' : 'Solve Problem'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

