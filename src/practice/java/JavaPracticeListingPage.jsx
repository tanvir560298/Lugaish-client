import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { TOPIC_1_METADATA, TOPIC_2_METADATA, TOPIC_METADATA_MAP } from './javaPracticeData.js';
import { JavaTopicPracticeListing } from './JavaTopicPracticeListing.jsx';

export function JavaPracticeListingPage() {
  const { topicSlug = 'basic-io-variables' } = useParams();
  const currentTopic = TOPIC_METADATA_MAP?.[topicSlug] || (topicSlug === 'operators-expressions' ? TOPIC_2_METADATA : TOPIC_1_METADATA);
  const isTopic2 = topicSlug === 'operators-expressions';
  const coursePath = isTopic2 ? '/learn/java-programming/02' : '/learn/java-programming/01';
  const topicLabel = isTopic2 ? 'Topic 02' : 'Topic 01';

  useEffect(() => {
    document.title = `${currentTopic.title} — Java Practice | Lugaish`;
  }, [currentTopic]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-200 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to={coursePath} className="hover:text-slate-200 transition-colors">
          Java Course
        </Link>
        <span>/</span>
        <span className="text-amber-400">Practice</span>
        <span>/</span>
        <span className="text-white font-semibold">{currentTopic.title}</span>
      </nav>

      {/* Topic Header Card */}
      <div className="section-card relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-8 border border-slate-700/60 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Terminal className="w-3.5 h-3.5" />
              {currentTopic.language || 'Java'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Level: {currentTopic.level || 'Beginner'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {topicLabel}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            {currentTopic.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-4">
            {currentTopic.description}
          </p>

          <div className="flex items-center gap-3">
            <Link
              to={coursePath}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              ← Watch Video Lesson &amp; Review Topic Notes
            </Link>
          </div>
        </div>
      </div>

      {/* Reusable Problem Listing */}
      <JavaTopicPracticeListing topicSlug={topicSlug} topicTitle={currentTopic.title} />
    </div>
  );
}
