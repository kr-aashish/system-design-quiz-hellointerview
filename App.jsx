import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, LayoutGrid, BookOpen, ExternalLink, PlayCircle, Trash2, XCircle, RotateCcw, Clock, AlertTriangle, Cloud, UploadCloud, DownloadCloud, RefreshCw, Layers, Boxes, ScrollText } from 'lucide-react';
import quizState from './quiz-state.json';
import { getQuizSummaries, clearQuizProgress, clearAllProgress, PROGRESS_CHANGED_EVENT } from './quizProgressStore';
import { getCloudSyncConfig, hasCloudSyncConfig, pushProgressToCloud, pullProgressFromCloud, syncProgress } from './quizCloudSync';
import QuizEngine from './QuizEngine';
import QuizReview from './QuizReview';
import ShortcutHelp from './ShortcutHelp';
import { useKeyboardShortcuts } from './keyboardShortcuts';

const quizModules = import.meta.glob('./data/quizzes/**/*.json', { eager: true, import: 'default' });

const TRACK_CONFIG = [
  {
    id: 'system-design',
    title: 'Learn System Design',
    subtitle: 'Distributed systems, scaling patterns, and core infrastructure',
    icon: 'Layers',
    accent: 'teal',
  },
  {
    id: 'low-level-design',
    title: 'Learn Low Level Design',
    subtitle: 'Object-oriented design, concurrency, and interview problem breakdowns',
    icon: 'Boxes',
    accent: 'violet',
  },
];

const TRACK_ICONS = {
  Layers,
  Boxes,
};

function normalizeQuizPath(modulePath) {
  return modulePath.replace(/^\.\//, '');
}

const quizModuleByPath = Object.fromEntries(
  Object.entries(quizModules).map(([modulePath, module]) => [normalizeQuizPath(modulePath), module])
);

function isLldTopic(topic) {
  return topic.path.startsWith('/learn/low-level-design');
}

function getTrackId(topic) {
  return isLldTopic(topic) ? 'low-level-design' : 'system-design';
}

function groupByCategory(topics) {
  return topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});
}

function orderSectionEntries(trackId, sectionEntries) {
  if (trackId === 'system-design') {
    return [
      ...sectionEntries.filter(([category]) => category === 'In a Hurry'),
      ...sectionEntries.filter(([category]) => category !== 'In a Hurry' && category !== 'Advanced Topics'),
      ...sectionEntries.filter(([category]) => category === 'Advanced Topics'),
    ];
  }

  return sectionEntries;
}

function buildLearningTracks(topics) {
  return TRACK_CONFIG.map(track => {
    const trackTopics = topics.filter(topic => getTrackId(topic) === track.id);
    const sectionEntries = orderSectionEntries(track.id, Object.entries(groupByCategory(trackTopics)));

    return {
      ...track,
      sections: sectionEntries.map(([name, articles]) => ({ name, articles })),
    };
  }).filter(track => track.sections.length > 0);
}

function normalizeQuestion(question, index) {
  const rawOptions = Array.isArray(question.options) ? question.options : [];
  const options = rawOptions.map((option, optionIndex) => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      return option.text ?? option.label ?? `Option ${optionIndex + 1}`;
    }
    return String(option ?? '');
  });

  const correctIndex =
    Number.isInteger(question.correctIndex) ? question.correctIndex :
    Number.isInteger(question.correct) ? question.correct :
    Number.isInteger(question.answerIndex) ? question.answerIndex :
    0;

  return {
    ...question,
    id: String(question.id ?? `q${index + 1}`),
    options,
    correctIndex,
  };
}

function inferOrderedValues(questions, fieldName) {
  const seen = new Set();
  const values = [];
  for (const question of questions) {
    const value = question[fieldName];
    if (value && !seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }
  return values;
}

function buildQuizEntry(article) {
  if (!article.quizDataPath) return null;

  const quiz = quizModuleByPath[article.quizDataPath];
  if (!quiz || quiz.active === false) return null;

  const questions = (quiz.questions || []).map(normalizeQuestion);

  return {
    slug: article.slug,
    name: article.name,
    title: quiz.title ?? `${article.name} Quiz`,
    description: quiz.description ?? `Practice scenario-based system design questions for ${article.name}.`,
    category: article.category,
    path: article.path,
    quizDataPath: article.quizDataPath,
    estimatedTime: quiz.estimatedTime ?? null,
    difficultyLabel: quiz.difficulty ?? quiz.difficultyLabel ?? null,
    categories: quiz.categories ?? inferOrderedValues(questions, 'category'),
    partsOrder: quiz.partsOrder ?? inferOrderedValues(questions, 'part'),
    subtopicsOrder: quiz.subtopicsOrder ?? inferOrderedValues(questions, 'subtopic'),
    difficultyTiers: quiz.difficultyTiers ?? ['L1', 'L2', 'L3', 'L4', 'L5'],
    questions,
  };
}

const learningTracks = buildLearningTracks(quizState.topics || []);
const articleTopics = learningTracks.flatMap(track =>
  (track.sections || []).flatMap(section => section.articles || [])
);
const articleBySlug = new Map(articleTopics.map(article => [article.slug, article]));
const quizDataBySlug = Object.fromEntries(
  articleTopics
    .map(article => [article.slug, buildQuizEntry(article)])
    .filter(([, quiz]) => quiz)
);
const quizArticles = articleTopics.filter(article => quizDataBySlug[article.slug]);
const INDEX_SCROLL_STATE_KEY = 'hello-interview:index-scroll-state';

function getActiveIndexSlug() {
  return document.activeElement?.closest?.('[data-keyboard-row="quiz-index"]')?.dataset.slug || null;
}

function getIndexRowBySlug(slug) {
  if (!slug) return null;
  return Array.from(document.querySelectorAll('[data-keyboard-row="quiz-index"]'))
    .find((element) => element.dataset.slug === slug) || null;
}

function readIndexScrollState() {
  try {
    const state = JSON.parse(window.sessionStorage.getItem(INDEX_SCROLL_STATE_KEY) || 'null');
    if (!state || !Number.isFinite(state.y)) return null;
    return state;
  } catch {
    return null;
  }
}

function saveIndexScrollState(focusedSlug = getActiveIndexSlug()) {
  try {
    const previousState = readIndexScrollState();
    const row = focusedSlug ? getIndexRowBySlug(focusedSlug) : null;
    const rowTop = row?.getBoundingClientRect().top;
    const keepRecentAnchoredPosition = !focusedSlug
      && previousState?.focusedSlug
      && Date.now() - previousState.updatedAt < 1500;

    window.sessionStorage.setItem(INDEX_SCROLL_STATE_KEY, JSON.stringify({
      x: keepRecentAnchoredPosition ? previousState.x : window.scrollX,
      y: keepRecentAnchoredPosition ? previousState.y : window.scrollY,
      focusedSlug: focusedSlug || previousState?.focusedSlug || null,
      rowTop: Number.isFinite(rowTop) ? rowTop : previousState?.rowTop ?? null,
      updatedAt: Date.now(),
    }));
  } catch {
    // Scroll restoration is a convenience; ignore unavailable storage.
  }
}

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
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#1e2536] border border-[#2d3748] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel();
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Clear Progress</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            ref={cancelRef}
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
      type="button"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClear(slug); }}
      className="p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      title="Clear quiz progress"
      aria-label="Clear quiz progress"
      aria-keyshortcuts="Delete"
    >
      <XCircle className="w-3.5 h-3.5" />
    </button>
  );
}

function ProgressStats({ summaries, quizTopics }) {
  const quizSlugs = quizTopics.filter(t => quizDataBySlug[t.slug]).map(t => t.slug);
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

function getSyncStatusClass(tone) {
  if (tone === 'success') return 'text-emerald-400';
  if (tone === 'error') return 'text-red-400';
  if (tone === 'working') return 'text-cyan-400';
  return 'text-slate-400';
}

function describeCloudFormat(result) {
  if (result?.cloudFormat === 'chunked') {
    if (Number.isFinite(result.createdChunkBins)) {
      const action = result.createdChunkBins > 0
        ? `${result.createdChunkBins} new, ${result.reusedChunkBins || 0} reused`
        : 'reused existing bins';
      return ` (${result.chunkCount} JSONBin chunks: ${action})`;
    }
    return ` (${result.chunkCount} JSONBin chunks)`;
  }
  return '';
}

function CloudSyncPanel({ onPulled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [status, setStatus] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [timestamps, setTimestamps] = useState(() => getCloudSyncConfig());
  const autoSyncTimerRef = useRef(null);

  const isConfigured = hasCloudSyncConfig();

  const showStatus = useCallback((text, tone = 'neutral') => {
    setStatus({ text, tone });
  }, []);

  // Auto-push on progress change
  useEffect(() => {
    if (!autoSync || !isConfigured) return undefined;

    const handleProgressChanged = () => {
      window.clearTimeout(autoSyncTimerRef.current);
      autoSyncTimerRef.current = window.setTimeout(async () => {
        try {
          const result = await pushProgressToCloud();
          setTimestamps(result.timestamps);
          showStatus(`Auto-pushed progress to cloud${describeCloudFormat(result)}.`, 'success');
        } catch (error) {
          showStatus(`Auto-push failed: ${error.message}`, 'error');
        }
      }, 2000);
    };

    window.addEventListener(PROGRESS_CHANGED_EVENT, handleProgressChanged);
    return () => {
      window.removeEventListener(PROGRESS_CHANGED_EVENT, handleProgressChanged);
      window.clearTimeout(autoSyncTimerRef.current);
    };
  }, [autoSync, isConfigured, showStatus]);

  const handlePush = async () => {
    setIsBusy(true);
    showStatus('Pushing local progress to cloud...', 'working');
    try {
      const result = await pushProgressToCloud();
      setTimestamps(result.timestamps);
      showStatus(`Pushed local progress to cloud${describeCloudFormat(result)}.`, 'success');
    } catch (error) {
      showStatus(error.message, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handlePull = async () => {
    if (!window.confirm('Pull progress from cloud? This will replace the quiz progress currently saved in this browser.')) {
      return;
    }

    setIsBusy(true);
    showStatus('Pulling progress from cloud...', 'working');
    try {
      const result = await pullProgressFromCloud();
      setTimestamps(result.timestamps);
      onPulled();
      showStatus(`Pulled cloud progress into this browser${describeCloudFormat(result)}.`, 'success');
    } catch (error) {
      showStatus(error.message, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSync = async () => {
    setIsBusy(true);
    showStatus('Syncing local ↔ cloud (merging)...', 'working');
    try {
      const result = await syncProgress();
      setTimestamps(result.timestamps);
      onPulled(); // refresh the summaries since local was updated
      showStatus(`Sync complete — local and cloud are now merged${describeCloudFormat(result)}.`, 'success');
    } catch (error) {
      showStatus(error.message, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-700 text-sm"
      >
        <Cloud size={15} className={isConfigured ? 'text-cyan-400' : 'text-slate-500'} />
        Cloud Sync
        {autoSync && (
          <span className="text-[11px] font-medium text-slate-500">auto</span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 bg-[#232a3b] border border-[#2d3748] rounded-xl p-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSync}
              disabled={isBusy}
              className="inline-flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50 text-purple-400 px-3 py-2 rounded-lg text-xs font-semibold border border-purple-500/20 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isBusy ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button
              type="button"
              onClick={handlePull}
              disabled={isBusy}
              className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 text-blue-400 px-3 py-2 rounded-lg text-xs font-semibold border border-blue-500/20 transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
              Pull
            </button>
            <button
              type="button"
              onClick={handlePush}
              disabled={isBusy}
              className="inline-flex items-center gap-2 bg-teal-500/10 hover:bg-teal-500/20 disabled:opacity-50 text-teal-400 px-3 py-2 rounded-lg text-xs font-semibold border border-teal-500/20 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Push
            </button>
            <label className="inline-flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(event) => setAutoSync(event.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-[#1c2331] text-cyan-500 focus:ring-cyan-500/40"
              />
              Auto-push after changes
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            {timestamps.lastPushedAt && <span>Last push {timeAgo(timestamps.lastPushedAt)}</span>}
            {timestamps.lastPulledAt && <span>Last pull {timeAgo(timestamps.lastPulledAt)}</span>}
          </div>

          {status && (
            <p className={`mt-3 text-xs ${getSyncStatusClass(status.tone)}`}>
              {status.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null);
  const restoredScrollRef = useRef(false);
  
  const refreshSummaries = useCallback(() => {
    setSummaries(getQuizSummaries());
  }, []);
  
  useEffect(() => {
    refreshSummaries();
  }, [refreshSummaries]);

  useEffect(() => {
    if (restoredScrollRef.current) return undefined;
    restoredScrollRef.current = true;

    const state = readIndexScrollState();
    if (!state) return undefined;

    let cancelled = false;
    let frameId = 0;
    const timeoutIds = [80, 180, 360, 700].map((delay) => window.setTimeout(() => restoreScroll(), delay));

    function restoreScroll() {
      if (cancelled) return;
      const row = getIndexRowBySlug(state.focusedSlug);
      const targetY = row
        ? window.scrollY + row.getBoundingClientRect().top - (Number.isFinite(state.rowTop) ? state.rowTop : Math.min(360, window.innerHeight * 0.45))
        : state.y;
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({
        left: Number.isFinite(state.x) ? state.x : 0,
        top: Math.max(0, Math.min(targetY, maxY)),
        behavior: 'auto',
      });

      row?.focus({ preventScroll: true });
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = window.requestAnimationFrame(restoreScroll);
    });

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const scheduleSave = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        saveIndexScrollState();
      });
    };

    window.addEventListener('scroll', scheduleSave, { passive: true });
    window.addEventListener('pagehide', scheduleSave);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleSave);
      window.removeEventListener('pagehide', scheduleSave);
      saveIndexScrollState();
    };
  }, []);
  
  const handleClearQuiz = useCallback((slug) => {
    const topic = articleBySlug.get(slug);
    setConfirmDialog({
      message: `Clear all progress for "${topic?.name || slug}"? This will remove your saved answers, scores, and attempt history for this quiz.`,
      onConfirm: () => {
        clearQuizProgress(slug);
        refreshSummaries();
        setConfirmDialog(null);
      },
    });
  }, [refreshSummaries]);
  
  const handleClearAll = useCallback(() => {
    setConfirmDialog({
      message: 'Clear ALL quiz progress? This will permanently remove all saved answers, scores, and attempt history across every quiz.',
      onConfirm: () => {
        clearAllProgress();
        refreshSummaries();
        setConfirmDialog(null);
      },
    });
  }, [refreshSummaries]);

  const hasAnyProgress = Object.keys(summaries).length > 0;

  const getIndexRows = useCallback(() => {
    return Array.from(document.querySelectorAll('[data-keyboard-row="quiz-index"]'))
      .filter((row) => row.offsetParent !== null);
  }, []);

  const getFocusedRow = useCallback(() => {
    return document.activeElement?.closest?.('[data-keyboard-row="quiz-index"]') || null;
  }, []);

  const focusIndexRow = useCallback((direction) => {
    const rows = getIndexRows();
    if (!rows.length) return false;

    const activeRow = getFocusedRow();
    const activeIndex = activeRow ? rows.indexOf(activeRow) : -1;
    let nextIndex = direction > 0 ? activeIndex + 1 : activeIndex - 1;

    if (activeIndex === -1) {
      nextIndex = direction > 0 ? 0 : rows.length - 1;
    }

    nextIndex = Math.max(0, Math.min(rows.length - 1, nextIndex));
    rows[nextIndex].focus();
    rows[nextIndex].scrollIntoView({ block: 'nearest' });
    return true;
  }, [getFocusedRow, getIndexRows]);

  const focusIndexEdge = useCallback((edge) => {
    const rows = getIndexRows();
    if (!rows.length) return false;
    const row = edge === 'end' ? rows[rows.length - 1] : rows[0];
    row.focus();
    row.scrollIntoView({ block: 'nearest' });
    return true;
  }, [getIndexRows]);

  const getFocusedTopic = useCallback(() => {
    const row = getFocusedRow();
    if (!row) return null;
    return articleBySlug.get(row.dataset.slug) || null;
  }, [getFocusedRow]);

  const navigateToTopicQuiz = useCallback((topic) => {
    if (!topic || !quizDataBySlug[topic.slug]) return false;
    const status = summaries[topic.slug]?.status || 'not_started';
    saveIndexScrollState(topic.slug);
    navigate(`/${topic.slug}${status === 'in_progress' ? '?resume=true' : ''}`);
    return true;
  }, [navigate, summaries]);

  const navigateToTopicReview = useCallback((topic) => {
    if (!topic || !quizDataBySlug[topic.slug]) return false;
    saveIndexScrollState(topic.slug);
    navigate(`/${topic.slug}/review`);
    return true;
  }, [navigate]);

  const openTopicArticle = useCallback((topic) => {
    if (!topic?.path) return false;
    saveIndexScrollState(topic.slug);
    window.open(`https://www.hellointerview.com${topic.path}`, '_blank', 'noopener,noreferrer');
    return true;
  }, []);

  useKeyboardShortcuts([
    { keys: ['arrowdown', 'j'], handler: () => confirmDialog ? false : focusIndexRow(1) },
    { keys: ['arrowup', 'k'], handler: () => confirmDialog ? false : focusIndexRow(-1) },
    { key: 'home', handler: () => confirmDialog ? false : focusIndexEdge('start') },
    { key: 'end', handler: () => confirmDialog ? false : focusIndexEdge('end') },
    {
      key: 'enter',
      handler: () => {
        if (confirmDialog) return false;
        const row = getFocusedRow();
        if (!row || document.activeElement !== row) return false;
        const topic = getFocusedTopic();
        return navigateToTopicQuiz(topic) || openTopicArticle(topic);
      },
    },
    { key: 'r', handler: () => confirmDialog ? false : navigateToTopicReview(getFocusedTopic()) },
    { key: 'a', handler: () => confirmDialog ? false : openTopicArticle(getFocusedTopic()) },
    {
      key: 'delete',
      shiftKey: false,
      handler: () => {
        if (confirmDialog) return false;
        const topic = getFocusedTopic();
        if (!topic || !summaries[topic.slug]) return false;
        handleClearQuiz(topic.slug);
        return true;
      },
    },
    {
      key: 'delete',
      shiftKey: true,
      handler: () => {
        if (confirmDialog) return false;
        if (!hasAnyProgress) return false;
        handleClearAll();
        return true;
      },
    },
  ], [
    focusIndexEdge,
    focusIndexRow,
    confirmDialog,
    getFocusedRow,
    getFocusedTopic,
    hasAnyProgress,
    handleClearAll,
    handleClearQuiz,
    navigateToTopicQuiz,
    navigateToTopicReview,
    openTopicArticle,
    summaries,
  ]);

  return (
    <div className="min-h-screen bg-[#1c2331] text-slate-300 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <BookOpen className="text-teal-500" />
            Hello Interview Learning Paths
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

        <CloudSyncPanel onPulled={refreshSummaries} />
        
        <ProgressStats summaries={summaries} quizTopics={articleTopics} />
        
        {learningTracks.map((track, index) => {
          const Icon = TRACK_ICONS[track.icon] || Layers;
          const entries = (track.sections || []).map(section => [section.name, section.articles || []]);
          const section = (
            <TrackSection
              title={track.title}
              subtitle={track.subtitle}
              icon={Icon}
              accent={track.accent}
              entries={entries}
              summaries={summaries}
              onClearQuiz={handleClearQuiz}
            />
          );

          if (index === 0) return <React.Fragment key={track.id}>{section}</React.Fragment>;

          return (
            <div key={track.id} className="mt-6">
              {section}
            </div>
          );
        })}
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

const TRACK_ACCENTS = {
  teal: {
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    title: 'text-teal-300',
    border: 'border-teal-500/20',
    glow: 'from-teal-500/10 via-cyan-500/5 to-transparent',
  },
  violet: {
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    title: 'text-violet-300',
    border: 'border-violet-500/20',
    glow: 'from-violet-500/10 via-fuchsia-500/5 to-transparent',
  },
};

function TrackSection({ title, subtitle, icon: Icon, accent = 'teal', entries, summaries, onClearQuiz }) {
  const a = TRACK_ACCENTS[accent] || TRACK_ACCENTS.teal;
  const totalArticles = entries.reduce((sum, [, items]) => sum + items.length, 0);
  const quizCount = entries.reduce(
    (sum, [, items]) => sum + items.filter(i => quizDataBySlug[i.slug]).length,
    0,
  );

  return (
    <div className={`relative bg-[#232a3b] p-6 rounded-xl border ${a.border} shadow-2xl overflow-hidden`}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${a.glow}`} />
      <div className="relative flex items-start justify-between mb-5 pb-4 border-b border-[#2d3748]">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${a.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${a.iconColor}`} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${a.title}`}>{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500 shrink-0 max-sm:hidden">
          <div>{totalArticles} articles</div>
          <div>{quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}</div>
        </div>
      </div>
      <div className="relative space-y-2">
        {entries.map(([category, items]) => (
          <CategorySection
            key={category}
            category={category}
            items={items}
            summaries={summaries}
            onClearQuiz={onClearQuiz}
            defaultOpen
          />
        ))}
      </div>
    </div>
  );
}

function CategorySection({ category, items, summaries, onClearQuiz, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left font-semibold text-slate-200 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
        aria-expanded={isOpen}
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
            const hasQuiz = !!quizDataBySlug[item.slug];
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
                <div
                  tabIndex={0}
                  data-keyboard-row="quiz-index"
                  data-slug={item.slug}
                  onClickCapture={() => saveIndexScrollState(item.slug)}
                  onFocus={() => saveIndexScrollState(item.slug)}
                  className="flex items-center gap-3 group px-4 py-2.5 rounded-lg hover:bg-[#2d3748] focus:bg-[#2d3748] focus:outline-none focus:ring-2 focus:ring-teal-400/70 transition-colors cursor-default"
                  aria-label={`${item.name} learning item`}
                >
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
                      <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                        {hasQuiz && (
                          <Link
                            to={`/${item.slug}${status === 'in_progress' ? '?resume=true' : ''}`}
                            className="flex items-center gap-1.5 text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1.5 rounded-md hover:bg-teal-500/20 transition-colors font-semibold"
                            aria-keyshortcuts="Enter"
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
                        {hasQuiz && (
                          <Link
                            to={`/${item.slug}/review`}
                            className="flex items-center gap-1.5 text-xs bg-violet-500/10 text-violet-300 px-2.5 py-1.5 rounded-md hover:bg-violet-500/20 transition-colors font-semibold"
                            title="Review all questions and answers"
                            aria-keyshortcuts="R"
                          >
                            <ScrollText className="w-3.5 h-3.5" />
                            Review
                          </Link>
                        )}
                        <a 
                          href={`https://www.hellointerview.com${item.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1.5 rounded-md hover:bg-blue-500/20 transition-colors font-semibold"
                          title="Read Article"
                          aria-keyshortcuts="A"
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
      <ShortcutHelp />
      <div data-app-routes>
        <Routes>
          <Route path="/" element={<Index />} />
          {quizArticles.flatMap((quiz) => [
            <Route
              key={quiz.slug}
              path={`/${quiz.slug}`}
              element={<QuizEngine quiz={quizDataBySlug[quiz.slug]} />}
            />,
            <Route
              key={`${quiz.slug}-review`}
              path={`/${quiz.slug}/review`}
              element={<QuizReview quiz={quizDataBySlug[quiz.slug]} />}
            />,
          ])}
        </Routes>
      </div>
    </HashRouter>
  );
}
