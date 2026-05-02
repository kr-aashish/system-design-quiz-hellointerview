import { getProgress, replaceProgress } from './quizProgressStore.js';

const APP_ID = 'system-design-quiz-hellointerview';
const CLOUD_SCHEMA_VERSION = 1;
const JSONBIN_API_ROOT = 'https://api.jsonbin.io/v3/b';

// ─── Credentials from HTML data attributes ───

function getEmbeddedCredentials() {
  const root = document.getElementById('root');
  if (!root) return { apiKey: '', binId: '' };
  return {
    apiKey: (root.getAttribute('data-jb-k') || '').trim(),
    binId: (root.getAttribute('data-jb-b') || '').trim(),
  };
}

// ─── Lightweight config for timestamps (stored in localStorage) ───

const CONFIG_KEY = 'sd-quiz-cloud-sync-config';

function getTimestamps() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return { lastPulledAt: null, lastPushedAt: null };
    const parsed = JSON.parse(raw);
    return {
      lastPulledAt: parsed.lastPulledAt || null,
      lastPushedAt: parsed.lastPushedAt || null,
    };
  } catch {
    return { lastPulledAt: null, lastPushedAt: null };
  }
}

function saveTimestamps(ts) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(ts));
  } catch { /* ignore */ }
  return ts;
}

// ─── Public helpers ───

export function getCloudSyncConfig() {
  const creds = getEmbeddedCredentials();
  const ts = getTimestamps();
  return { ...creds, ...ts };
}

export function hasCloudSyncConfig() {
  const { apiKey, binId } = getEmbeddedCredentials();
  return Boolean(apiKey && binId);
}

// ─── Internal helpers ───

function getJsonBinUrls(binId) {
  const id = encodeURIComponent(binId);
  return {
    read: `${JSONBIN_API_ROOT}/${id}/latest`,
    update: `${JSONBIN_API_ROOT}/${id}`,
  };
}

function assertConfigured() {
  if (!hasCloudSyncConfig()) {
    throw new Error('JSONBin credentials are not embedded. Check index.html data attributes.');
  }
}

async function readResponseJson(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(body?.message || `JSONBin request failed with status ${response.status}.`);
  }

  return body;
}

function validateProgress(progress) {
  if (!progress || typeof progress !== 'object') {
    throw new Error('Cloud payload did not contain quiz progress.');
  }

  if (progress.version !== 1 || !progress.quizzes || typeof progress.quizzes !== 'object') {
    throw new Error('Cloud payload is not compatible with this quiz progress format.');
  }

  return progress;
}

function extractProgress(payload) {
  const record = payload?.record || payload;
  const progress = record?.progress || record;
  return validateProgress(progress);
}

export function buildCloudPayload(progress = getProgress(), syncedAt = new Date().toISOString()) {
  return {
    app: APP_ID,
    schemaVersion: CLOUD_SCHEMA_VERSION,
    syncedAt,
    progress,
  };
}

// ─── Push ───

export async function pushProgressToCloud({ progress = getProgress() } = {}) {
  assertConfigured();
  const { apiKey, binId } = getEmbeddedCredentials();

  const syncedAt = new Date().toISOString();
  const urls = getJsonBinUrls(binId);
  const payload = buildCloudPayload(progress, syncedAt);
  const response = await fetch(urls.update, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await readResponseJson(response);
  const ts = saveTimestamps({ ...getTimestamps(), lastPushedAt: syncedAt });

  return {
    syncedAt,
    timestamps: ts,
    metadata: data?.metadata || null,
  };
}

// ─── Pull ───

export async function pullProgressFromCloud({ emit = false } = {}) {
  assertConfigured();
  const { apiKey, binId } = getEmbeddedCredentials();

  const urls = getJsonBinUrls(binId);
  const response = await fetch(urls.read, {
    headers: {
      'X-Master-Key': apiKey,
    },
  });

  const data = await readResponseJson(response);
  const progress = extractProgress(data);
  replaceProgress(progress, { source: 'cloud-pull', emit });

  const pulledAt = new Date().toISOString();
  const ts = saveTimestamps({ ...getTimestamps(), lastPulledAt: pulledAt });

  return {
    progress,
    pulledAt,
    timestamps: ts,
    metadata: data?.metadata || null,
  };
}

// ─── Sync (merge local + cloud, keeping the more-progressed version) ───

function countAnswers(attempt) {
  if (!attempt) return 0;
  return Object.keys(attempt.questionResults || {}).length;
}

function pickBetterQuiz(localQuiz, cloudQuiz) {
  // If one side is missing, take the other
  if (!localQuiz && cloudQuiz) return cloudQuiz;
  if (localQuiz && !cloudQuiz) return localQuiz;
  if (!localQuiz && !cloudQuiz) return null;

  // Compare latest attempts
  const localLatest = localQuiz.attempts?.[localQuiz.attempts.length - 1];
  const cloudLatest = cloudQuiz.attempts?.[cloudQuiz.attempts.length - 1];

  const localAnswers = countAnswers(localLatest);
  const cloudAnswers = countAnswers(cloudLatest);

  // Completed beats in-progress
  if (localQuiz.status === 'completed' && cloudQuiz.status !== 'completed') return localQuiz;
  if (cloudQuiz.status === 'completed' && localQuiz.status !== 'completed') return cloudQuiz;

  // Both completed or both in-progress — take the one with more attempts or answers
  if (localQuiz.attempts.length !== cloudQuiz.attempts.length) {
    return localQuiz.attempts.length >= cloudQuiz.attempts.length ? localQuiz : cloudQuiz;
  }

  // Same attempt count — more answers in latest wins
  if (localAnswers !== cloudAnswers) {
    return localAnswers >= cloudAnswers ? localQuiz : cloudQuiz;
  }

  // Tie-break by most recent timestamp
  const localTime = new Date(localQuiz.lastAttemptAt || 0).getTime();
  const cloudTime = new Date(cloudQuiz.lastAttemptAt || 0).getTime();
  return localTime >= cloudTime ? localQuiz : cloudQuiz;
}

function mergeProgress(local, cloud) {
  const allSlugs = new Set([
    ...Object.keys(local.quizzes || {}),
    ...Object.keys(cloud.quizzes || {}),
  ]);

  const mergedQuizzes = {};
  for (const slug of allSlugs) {
    const winner = pickBetterQuiz(local.quizzes?.[slug], cloud.quizzes?.[slug]);
    if (winner) mergedQuizzes[slug] = winner;
  }

  return { version: 1, quizzes: mergedQuizzes };
}

export async function syncProgress({ emit = true } = {}) {
  assertConfigured();
  const { apiKey, binId } = getEmbeddedCredentials();

  // 1. Pull cloud state
  const urls = getJsonBinUrls(binId);
  const pullResponse = await fetch(urls.read, {
    headers: { 'X-Master-Key': apiKey },
  });
  const pullData = await readResponseJson(pullResponse);

  let cloudProgress;
  try {
    cloudProgress = extractProgress(pullData);
  } catch {
    // Cloud is empty / fresh bin — treat as empty
    cloudProgress = { version: 1, quizzes: {} };
  }

  // 2. Get local state
  const localProgress = getProgress();

  // 3. Merge
  const merged = mergeProgress(localProgress, cloudProgress);

  // 4. Apply locally
  replaceProgress(merged, { source: 'cloud-sync', emit });

  // 5. Push merged back to cloud
  const syncedAt = new Date().toISOString();
  const payload = buildCloudPayload(merged, syncedAt);
  const pushResponse = await fetch(urls.update, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });
  await readResponseJson(pushResponse);

  const ts = saveTimestamps({ lastPulledAt: syncedAt, lastPushedAt: syncedAt });

  return {
    merged,
    syncedAt,
    timestamps: ts,
  };
}
