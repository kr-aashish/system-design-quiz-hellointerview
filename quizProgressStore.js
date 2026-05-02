/**
 * Quiz Progress Store — localStorage-based persistence layer
 * 
 * Stores quiz progress, answers, scores, and attempt history.
 * All data persisted in browser localStorage under key 'sd-quiz-progress'.
 */

const STORAGE_KEY = 'sd-quiz-progress';
const SCHEMA_VERSION = 1;
export const PROGRESS_CHANGED_EVENT = 'sd-quiz-progress-changed';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: SCHEMA_VERSION, quizzes: {} };
    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) {
      // Future: handle migrations here
      return { version: SCHEMA_VERSION, quizzes: {} };
    }
    return parsed;
  } catch {
    return { version: SCHEMA_VERSION, quizzes: {} };
  }
}

function emitProgressChanged(store, source = 'local') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PROGRESS_CHANGED_EVENT, {
    detail: { store, source },
  }));
}

function saveStore(store, options = {}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    if (options.emit !== false) {
      emitProgressChanged(store, options.source);
    }
  } catch (e) {
    console.warn('[QuizProgress] Failed to save to localStorage:', e);
  }
}

function normalizeProgressStore(progress) {
  if (!progress || typeof progress !== 'object') {
    return { version: SCHEMA_VERSION, quizzes: {} };
  }

  return {
    version: SCHEMA_VERSION,
    quizzes: progress.quizzes && typeof progress.quizzes === 'object' ? progress.quizzes : {},
  };
}

// ─── Public API ───

/** Get full progress state */
export function getProgress() {
  return getStore();
}

/** Replace the full local progress state, used by cloud restore/import flows. */
export function replaceProgress(progress, options = {}) {
  const normalized = normalizeProgressStore(progress);
  saveStore(normalized, { source: options.source || 'replace', emit: options.emit });
  return normalized;
}

/** Get progress for a single quiz */
export function getQuizProgress(slug) {
  const store = getStore();
  return store.quizzes[slug] || null;
}

/** Get the latest (most recent) attempt for a quiz, or null */
export function getLatestAttempt(slug) {
  const quiz = getQuizProgress(slug);
  if (!quiz || !quiz.attempts || quiz.attempts.length === 0) return null;
  return quiz.attempts[quiz.attempts.length - 1];
}

/** Get in-progress attempt for a quiz (incomplete attempt), or null */
export function getInProgressAttempt(slug) {
  const latest = getLatestAttempt(slug);
  if (latest && !latest.completedAt) return latest;
  return null;
}

/**
 * Start a new quiz attempt.
 * Returns the new attemptId.
 */
export function startAttempt(slug, totalQuestions) {
  const store = getStore();
  if (!store.quizzes[slug]) {
    store.quizzes[slug] = { status: 'in_progress', attempts: [], lastAttemptAt: null };
  }
  
  const attemptId = generateId();
  const attempt = {
    attemptId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    lastSavedAt: new Date().toISOString(),
    totalQuestions: totalQuestions || 0,
    score: { correct: 0, total: 0 },
    totalTimeSeconds: 0,
    questionResults: {},
    questionOrder: [], // track the order questions were presented
    state: null, // full resumable UI state for the shared quiz runtime
  };
  
  store.quizzes[slug].attempts.push(attempt);
  store.quizzes[slug].status = 'in_progress';
  store.quizzes[slug].lastAttemptAt = attempt.startedAt;
  saveStore(store);
  
  return attemptId;
}

/**
 * Save the question order for an attempt (for resume support).
 */
export function saveQuestionOrder(slug, attemptId, questionIds) {
  const store = getStore();
  const quiz = store.quizzes[slug];
  if (!quiz) return;
  
  const attempt = quiz.attempts.find(a => a.attemptId === attemptId);
  if (!attempt) return;
  
  attempt.questionOrder = questionIds;
  attempt.lastSavedAt = new Date().toISOString();
  saveStore(store);
}

/**
 * Persist a complete resumable attempt state.
 * This intentionally stores UI state in addition to answer results so reloads
 * can restore the quiz exactly where the learner left off.
 */
export function saveAttemptState(slug, attemptId, state) {
  const store = getStore();
  const quiz = store.quizzes[slug];
  if (!quiz) return;

  const attempt = quiz.attempts.find(a => a.attemptId === attemptId);
  if (!attempt) return;

  attempt.state = state;
  attempt.lastSavedAt = new Date().toISOString();
  if (state?.questionOrder?.length) {
    attempt.questionOrder = state.questionOrder;
  }
  if (Number.isFinite(state?.totalElapsed)) {
    attempt.totalTimeSeconds = state.totalElapsed;
  }
  saveStore(store);
}

/**
 * Record an individual answer.
 * result: { selectedIndex, correctIndex, isCorrect, confidence, timedOut, skipped, revealed }
 */
export function recordAnswer(slug, attemptId, questionId, result) {
  const store = getStore();
  const quiz = store.quizzes[slug];
  if (!quiz) return;
  
  const attempt = quiz.attempts.find(a => a.attemptId === attemptId);
  if (!attempt) return;
  
  attempt.questionResults[questionId] = {
    selectedIndex: result.selectedIndex ?? null,
    correctIndex: result.correctIndex,
    isCorrect: result.isCorrect || false,
    confidence: result.confidence || null,
    timedOut: result.timedOut || false,
    skipped: result.skipped || false,
    revealed: result.revealed || false,
    optionText: result.optionText || null,
    correctOptionText: result.correctOptionText || null,
    elapsedSeconds: result.elapsedSeconds || null,
    answeredAt: new Date().toISOString(),
  };
  attempt.lastSavedAt = new Date().toISOString();
  
  // Recompute score from all answers
  const results = Object.values(attempt.questionResults);
  attempt.score = {
    correct: results.filter(r => r.isCorrect).length,
    total: results.filter(r => !r.skipped).length,
  };
  
  saveStore(store);
}

/**
 * Complete an attempt — mark it as finished.
 */
export function completeAttempt(slug, attemptId, finalScore, totalTimeSeconds, finalState) {
  const store = getStore();
  const quiz = store.quizzes[slug];
  if (!quiz) return;
  
  const attempt = quiz.attempts.find(a => a.attemptId === attemptId);
  if (!attempt) return;
  
  attempt.completedAt = new Date().toISOString();
  attempt.lastSavedAt = attempt.completedAt;
  attempt.totalTimeSeconds = totalTimeSeconds || 0;
  if (finalScore) {
    attempt.score = finalScore;
  }
  if (finalState) {
    attempt.state = finalState;
    if (finalState.questionOrder?.length) {
      attempt.questionOrder = finalState.questionOrder;
    }
  }
  
  quiz.status = 'completed';
  quiz.lastAttemptAt = attempt.completedAt;
  saveStore(store);
}

/**
 * Clear progress for a single quiz.
 */
export function clearQuizProgress(slug) {
  const store = getStore();
  delete store.quizzes[slug];
  saveStore(store);
}

/**
 * Clear all quiz progress (nuclear reset).
 */
export function clearAllProgress() {
  saveStore({ version: SCHEMA_VERSION, quizzes: {} });
}

/**
 * Get summaries for all quizzes (for index page display).
 * Returns: { [slug]: { status, latestScore, latestPct, questionsDone, totalQuestions, lastAttemptAt, attemptCount } }
 */
export function getQuizSummaries() {
  const store = getStore();
  const summaries = {};
  
  for (const [slug, quiz] of Object.entries(store.quizzes)) {
    const latest = quiz.attempts[quiz.attempts.length - 1];
    if (!latest) continue;
    
    const questionsDone = Object.keys(latest.questionResults).length;
    const totalQuestions = latest.totalQuestions || questionsDone;
    const pct = latest.score.total > 0 
      ? Math.round((latest.score.correct / latest.score.total) * 100) 
      : 0;
    const results = Object.values(latest.questionResults);
    
    summaries[slug] = {
      status: quiz.status,
      latestScore: latest.score,
      latestPct: pct,
      questionsDone,
      totalQuestions,
      lastAttemptAt: quiz.lastAttemptAt,
      attemptCount: quiz.attempts.length,
      isComplete: !!latest.completedAt,
      skippedCount: results.filter(r => r.skipped).length,
      flaggedCount: latest.state?.flagged?.length || 0,
      lastSavedAt: latest.lastSavedAt || quiz.lastAttemptAt,
    };
  }
  
  return summaries;
}

/**
 * Get the answered question count for a specific in-progress attempt.
 */
export function getAnsweredCount(slug) {
  const attempt = getInProgressAttempt(slug);
  if (!attempt) return 0;
  return Object.keys(attempt.questionResults).length;
}
