import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, LayoutGrid, BookOpen, ExternalLink, PlayCircle, Trash2, XCircle, RotateCcw, Clock, Trophy, AlertTriangle } from 'lucide-react';
import quizState from './quiz-state.json';
import { getQuizSummaries, clearQuizProgress, clearAllProgress } from './quizProgressStore';

import ContentionQuiz from './contention-quiz';
import LargeBlobsQuiz from './handling-large-blobs-quiz';
import MultiStepQuiz from './multi-step-processes-quiz';
import RealTimeUpdatesQuiz from './real-time-updates-quiz';
import ScalingReadsQuiz from './scaling-reads-quiz';
import ScalingWritesQuiz from './scaling-writes-quiz';
import LongRunningTasksQuiz from './managing-long-running-tasks-quiz';
import DataModelingQuiz from './data-modeling-quiz';
import NetworkingEssentialsQuiz from './networking-essentials-quiz';
import ApiDesignQuiz from './api-design-quiz';
import CachingQuiz from './caching-quiz';
import DatabaseIndexingQuiz from './database-indexing-quiz';
import ShardingQuiz from './sharding-quiz';
import CAPTheoremQuiz from './cap-theorem-quiz';
import BigDataStructuresQuiz from './big-data-structures-quiz';
import ConsistentHashingQuiz from './consistent-hashing-quiz';
import NumbersToKnowQuiz from './numbers-to-know-quiz';
import TimeSeriesDatabasesQuiz from './time-series-databases-quiz';
import VectorDatabaseQuiz from './vector-database-quiz';

// Map output file names to imported components
const componentsMap = {
  'contention-quiz.jsx': ContentionQuiz,
  'handling-large-blobs-quiz.jsx': LargeBlobsQuiz,
  'managing-long-running-tasks-quiz.jsx': LongRunningTasksQuiz,
  'multi-step-processes-quiz.jsx': MultiStepQuiz,
  'real-time-updates-quiz.jsx': RealTimeUpdatesQuiz,
  'scaling-reads-quiz.jsx': ScalingReadsQuiz,
  'scaling-writes-quiz.jsx': ScalingWritesQuiz,
  'data-modeling-quiz.jsx': DataModelingQuiz,
  'networking-essentials-quiz.jsx': NetworkingEssentialsQuiz,
  'api-design-quiz.jsx': ApiDesignQuiz,
  'caching-quiz.jsx': CachingQuiz,
  'database-indexing-quiz.jsx': DatabaseIndexingQuiz,
  'sharding-quiz.jsx': ShardingQuiz,
  'cap-theorem-quiz.jsx': CAPTheoremQuiz,
  'big-data-structures-quiz.jsx': BigDataStructuresQuiz,
  'consistent-hashing-quiz.jsx': ConsistentHashingQuiz,
  'numbers-to-know-quiz.jsx': NumbersToKnowQuiz,
  'time-series-databases-quiz.jsx': TimeSeriesDatabasesQuiz,
  'vector-database-quiz.jsx': VectorDatabaseQuiz,
};

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#1e2536] border border-[#2d3748] rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Clear Progress</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/50 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/30 border border-red-500/30 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, score, pct, questionsDone, totalQuestions, lastAttemptAt }) {
  if (status === 'completed') {
    const pctColor = pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold ${pctColor}`}>{pct}%</span>
        <span className="text-[11px] text-slate-500">{timeAgo(lastAttemptAt)}</span>
      </div>
    );
  }
  
  if (status === 'in_progress') {
    return (
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-amber-400" />
        <span className="text-xs text-amber-400 font-medium">{questionsDone}/{totalQuestions}</span>
      </div>
    );
  }
  
  return null;
}

function QuizItemActions({ slug, hasProgress, onClear }) {
  if (!hasProgress) return null;
  
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClear(slug); }}
      className="p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      title="Clear quiz progress"
    >
      <XCircle className="w-3.5 h-3.5" />
    </button>
  );
}

function ProgressStats({ summaries, quizTopics }) {
  const quizSlugs = quizTopics.filter(t => t.outputFile && componentsMap[t.outputFile]).map(t => t.slug);
  const totalQuizzes = quizSlugs.length;
  const completed = quizSlugs.filter(s => summaries[s]?.status === 'completed').length;
  const inProgress = quizSlugs.filter(s => summaries[s]?.status === 'in_progress').length;
  const notStarted = totalQuizzes - completed - inProgress;
  
  if (completed === 0 && inProgress === 0) return null;
  
  const pct = Math.round((completed / totalQuizzes) * 100);
  
  return (
    <div className="bg-[#232a3b] border border-[#2d3748] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
        <span className="text-xs text-slate-500">{completed}/{totalQuizzes} completed</span>
      </div>
      <div className="w-full bg-[#1c2331] rounded-full h-2 mb-3 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
          }}
        />
      </div>
      <div className="flex gap-4 text-xs">
        {completed > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">{completed} done</span>
          </span>
        )}
        {inProgress > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-400">{inProgress} in progress</span>
          </span>
        )}
        {notStarted > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            <span className="text-slate-400">{notStarted} remaining</span>
          </span>
        )}
      </div>
    </div>
  );
}

function Index() {
  const [summaries, setSummaries] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  const refreshSummaries = useCallback(() => {
    setSummaries(getQuizSummaries());
  }, []);
  
  useEffect(() => {
    refreshSummaries();
  }, [refreshSummaries]);
  
  const handleClearQuiz = (slug) => {
    const topic = quizState.topics.find(t => t.slug === slug);
    setConfirmDialog({
      message: `Clear all progress for "${topic?.name || slug}"? This will remove your saved answers, scores, and attempt history for this quiz.`,
      onConfirm: () => {
        clearQuizProgress(slug);
        refreshSummaries();
        setConfirmDialog(null);
      },
    });
  };
  
  const handleClearAll = () => {
    setConfirmDialog({
      message: 'Clear ALL quiz progress? This will permanently remove all saved answers, scores, and attempt history across every quiz.',
      onConfirm: () => {
        clearAllProgress();
        refreshSummaries();
        setConfirmDialog(null);
      },
    });
  };

  const topicsByCategory = quizState.topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  const hasAnyProgress = Object.keys(summaries).length > 0;

  return (
    <div className="min-h-screen bg-[#1c2331] text-slate-300 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <BookOpen className="text-teal-500" />
            System Design Learning Paths
          </h1>
          <div className="flex items-center gap-2">
            {hasAnyProgress && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg font-medium transition-colors border border-red-500/20 text-xs"
                title="Clear all quiz progress"
              >
                <Trash2 size={13} />
                <span className="max-sm:hidden">Clear All</span>
              </button>
            )}
            <a
              href="https://www.hellointerview.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-700 max-sm:hidden text-sm"
            >
              <ExternalLink size={14} className="text-slate-400" />
              Dashboard
            </a>
          </div>
        </div>
        
        <ProgressStats summaries={summaries} quizTopics={quizState.topics} />
        
        <div className="space-y-4 bg-[#232a3b] p-6 rounded-xl border border-[#2d3748] shadow-2xl">
          {Object.entries(topicsByCategory).map(([category, items], index, array) => (
            <CategorySection 
              key={category} 
              category={category} 
              items={items} 
              summaries={summaries}
              onClearQuiz={handleClearQuiz}
              defaultOpen={index < array.length - 2}
            />
          ))}
        </div>
      </div>
      
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

function CategorySection({ category, items, summaries, onClearQuiz, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left font-semibold text-slate-200 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
      >
        <LayoutGrid className="w-5 h-5 text-slate-400" />
        <span className="text-lg">{category}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 ml-auto text-slate-500" />
        ) : (
          <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />
        )}
      </button>

      {isOpen && (
        <ul className="mt-1 pl-[18px] border-l border-[#374151] ml-[14px] space-y-1">
          {items.map(item => {
            const hasQuiz = item.outputFile && componentsMap[item.outputFile];
            const progress = summaries[item.slug];
            const status = progress?.status || 'not_started';
            const hasProgress = !!progress;
            
            // Status-based icon coloring
            let iconColor = 'text-slate-600';
            if (status === 'completed') iconColor = 'text-emerald-400';
            else if (status === 'in_progress') iconColor = 'text-amber-400';
            
            // Status-based name coloring
            let nameColor = 'text-slate-300 group-hover:text-white';
            if (status === 'completed') nameColor = 'text-emerald-400/90';
            else if (status === 'in_progress') nameColor = 'text-amber-300/90';
            
            // Status icon
            let StatusIcon = CheckCircle2;
            if (status === 'in_progress') StatusIcon = Clock;
            
            return (
              <li key={item.slug}>
                <div className="flex items-center gap-3 group px-4 py-2.5 rounded-lg hover:bg-[#2d3748] transition-colors cursor-default">
                  <StatusIcon 
                    className={`w-5 h-5 shrink-0 ${iconColor} transition-colors`} 
                  />
                  
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[15px] font-medium transition-colors truncate ${nameColor}`}>
                        {item.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Progress badge */}
                      {progress && (
                        <StatusBadge 
                          status={status}
                          score={progress.latestScore}
                          pct={progress.latestPct}
                          questionsDone={progress.questionsDone}
                          totalQuestions={progress.totalQuestions}
                          lastAttemptAt={progress.lastAttemptAt}
                        />
                      )}
                      
                      {/* Action buttons — always visible on hover */}
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {hasQuiz && (
                          <Link 
                            to={`/${item.slug}`}
                            className="flex items-center gap-1.5 text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1.5 rounded-md hover:bg-teal-500/20 transition-colors font-semibold"
                          >
                            {status === 'in_progress' ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Resume
                              </>
                            ) : status === 'completed' ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Retake
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" />
                                Take Quiz
                              </>
                            )}
                          </Link>
                        )}
                        <a 
                          href={`https://www.hellointerview.com${item.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1.5 rounded-md hover:bg-blue-500/20 transition-colors font-semibold"
                          title="Read Article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Article
                        </a>
                        <QuizItemActions 
                          slug={item.slug} 
                          hasProgress={hasProgress} 
                          onClear={onClearQuiz} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {quizState.topics.filter(t => t.outputFile && componentsMap[t.outputFile]).map((quiz) => {
          const Component = componentsMap[quiz.outputFile];
          return (
            <Route 
              key={quiz.slug} 
              path={`/${quiz.slug}`} 
              element={<Component quizSlug={quiz.slug} />} 
            />
          );
        })}
      </Routes>
    </HashRouter>
  );
}
