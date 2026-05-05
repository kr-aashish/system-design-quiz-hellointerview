import { getProgress, replaceProgress } from './quizProgressStore.js';

const APP_ID = 'system-design-quiz-hellointerview';
const CLOUD_SCHEMA_VERSION = 1;
const JSONBIN_API_ROOT = 'https://api.jsonbin.io/v3/b';
const CHUNKED_STORAGE_VERSION = 1;
const CHUNK_ENCODING = 'utf8-base64';

// JSONBin free accounts reject records over 100 KB. Keep a margin for headers,
// UTF-8 accounting, and any small API-side envelope differences.
const MAX_JSONBIN_RECORD_BYTES = 90 * 1024;
const CHUNK_DATA_CHARS = 64 * 1024;

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

function getByteLength(text) {
  return new TextEncoder().encode(text).length;
}

function getJsonByteLength(value) {
  return getByteLength(JSON.stringify(value));
}

function generateCloudId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function bytesToBase64(bytes) {
  let binary = '';
  const batchSize = 0x8000;
  for (let i = 0; i < bytes.length; i += batchSize) {
    const batch = bytes.subarray(i, i + batchSize);
    binary += String.fromCharCode(...batch);
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeUtf8Base64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

function decodeUtf8Base64(base64) {
  return new TextDecoder().decode(base64ToBytes(base64));
}

function isChunkedManifest(record) {
  return record?.progressStorage?.type === 'jsonbin-chunks';
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

function buildChunkRecord({ chunkSetId, syncedAt, index, total, data }) {
  return {
    app: APP_ID,
    schemaVersion: CLOUD_SCHEMA_VERSION,
    kind: 'progress-chunk',
    storageVersion: CHUNKED_STORAGE_VERSION,
    chunkSetId,
    syncedAt,
    index,
    total,
    encoding: CHUNK_ENCODING,
    data,
  };
}

function buildChunkedCloudPayload({
  syncedAt,
  chunkSetId,
  chunkBinIds,
  encodedLength,
  decodedByteLength,
  usedChunks,
}) {
  return {
    app: APP_ID,
    schemaVersion: CLOUD_SCHEMA_VERSION,
    syncedAt,
    progressStorage: {
      type: 'jsonbin-chunks',
      version: CHUNKED_STORAGE_VERSION,
      encoding: CHUNK_ENCODING,
      chunkSetId,
      chunkBinIds,
      totalChunks: chunkBinIds.length,
      usedChunks,
      encodedLength,
      decodedByteLength,
    },
  };
}

function makeChunkRecords(progress, syncedAt, allocatedChunkCount = 0) {
  const progressJson = JSON.stringify(validateProgress(progress));
  const encoded = encodeUtf8Base64(progressJson);
  const chunkSetId = generateCloudId();
  const usedChunks = Math.max(1, Math.ceil(encoded.length / CHUNK_DATA_CHARS));
  const total = Math.max(usedChunks, allocatedChunkCount);
  const chunks = [];

  for (let index = 0; index < total; index += 1) {
    const start = index * CHUNK_DATA_CHARS;
    const data = encoded.slice(start, start + CHUNK_DATA_CHARS);
    const record = buildChunkRecord({ chunkSetId, syncedAt, index, total, data });

    if (getJsonByteLength(record) > MAX_JSONBIN_RECORD_BYTES) {
      throw new Error('Cloud chunk is too large for JSONBin. Reduce CHUNK_DATA_CHARS before syncing.');
    }

    chunks.push(record);
  }

  return {
    chunkSetId,
    chunks,
    encodedLength: encoded.length,
    decodedByteLength: getByteLength(progressJson),
    usedChunks,
  };
}

async function readJsonBinRecord(apiKey, binId) {
  const urls = getJsonBinUrls(binId);
  const response = await fetch(urls.read, {
    headers: {
      'X-Master-Key': apiKey,
    },
  });
  return readResponseJson(response);
}

async function updateJsonBinRecord(apiKey, binId, record) {
  const urls = getJsonBinUrls(binId);
  const response = await fetch(urls.update, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
    },
    body: JSON.stringify(record),
  });
  return readResponseJson(response);
}

async function createJsonBinRecord(apiKey, record, name) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': apiKey,
    'X-Bin-Private': 'true',
  };

  if (name) {
    headers['X-Bin-Name'] = name.slice(0, 128);
  }

  const response = await fetch(JSONBIN_API_ROOT, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  const data = await readResponseJson(response);
  const id = data?.metadata?.id;

  if (!id) {
    throw new Error('JSONBin did not return a bin id for a cloud sync chunk.');
  }

  return { id, metadata: data.metadata || null };
}

async function readCurrentChunkBinIds(apiKey, binId) {
  try {
    const payload = await readJsonBinRecord(apiKey, binId);
    const record = payload?.record || payload;
    const chunkBinIds = record?.progressStorage?.chunkBinIds;

    if (!isChunkedManifest(record) || !Array.isArray(chunkBinIds)) {
      return [];
    }

    return chunkBinIds.filter(chunkBinId => typeof chunkBinId === 'string');
  } catch {
    return [];
  }
}

async function readChunkedProgress(manifest, apiKey) {
  const storage = manifest.progressStorage;

  if (
    storage.version !== CHUNKED_STORAGE_VERSION ||
    storage.encoding !== CHUNK_ENCODING ||
    !Array.isArray(storage.chunkBinIds) ||
    storage.chunkBinIds.length !== storage.totalChunks
  ) {
    throw new Error('Cloud payload uses an unsupported chunked progress format.');
  }

  const chunkPayloads = await Promise.all(
    storage.chunkBinIds.map(chunkBinId => readJsonBinRecord(apiKey, chunkBinId))
  );
  const chunks = chunkPayloads.map(payload => payload?.record || payload);

  const dataByIndex = new Map();
  for (const chunk of chunks) {
    if (
      chunk?.kind !== 'progress-chunk' ||
      chunk.storageVersion !== CHUNKED_STORAGE_VERSION ||
      chunk.chunkSetId !== storage.chunkSetId ||
      chunk.total !== storage.totalChunks ||
      chunk.encoding !== CHUNK_ENCODING ||
      typeof chunk.index !== 'number' ||
      typeof chunk.data !== 'string'
    ) {
      throw new Error('Cloud progress chunk did not match the manifest.');
    }
    dataByIndex.set(chunk.index, chunk.data);
  }

  const orderedData = [];
  for (let index = 0; index < storage.totalChunks; index += 1) {
    if (!dataByIndex.has(index)) {
      throw new Error(`Cloud progress is missing chunk ${index + 1} of ${storage.totalChunks}.`);
    }
    orderedData.push(dataByIndex.get(index));
  }

  const encoded = orderedData.join('');
  if (encoded.length !== storage.encodedLength) {
    throw new Error('Cloud progress chunks did not reconstruct to the expected size.');
  }

  const progressJson = decodeUtf8Base64(encoded);
  if (getByteLength(progressJson) !== storage.decodedByteLength) {
    throw new Error('Cloud progress decoded size did not match the manifest.');
  }

  return validateProgress(JSON.parse(progressJson));
}

async function readCloudProgress(apiKey, binId) {
  const payload = await readJsonBinRecord(apiKey, binId);
  const record = payload?.record || payload;

  if (isChunkedManifest(record)) {
    const progress = await readChunkedProgress(record, apiKey);
    return {
      progress,
      metadata: payload?.metadata || null,
      cloudFormat: 'chunked',
      chunkCount: record.progressStorage.totalChunks,
    };
  }

  return {
    progress: extractProgress(payload),
    metadata: payload?.metadata || null,
    cloudFormat: 'single',
    chunkCount: 0,
  };
}

async function readCloudProgressOrEmpty(apiKey, binId) {
  const payload = await readJsonBinRecord(apiKey, binId);
  const record = payload?.record || payload;

  if (isChunkedManifest(record)) {
    const progress = await readChunkedProgress(record, apiKey);
    return {
      progress,
      metadata: payload?.metadata || null,
      cloudFormat: 'chunked',
      chunkCount: record.progressStorage.totalChunks,
    };
  }

  try {
    return {
      progress: extractProgress(payload),
      metadata: payload?.metadata || null,
      cloudFormat: 'single',
      chunkCount: 0,
    };
  } catch {
    return {
      progress: { version: 1, quizzes: {} },
      metadata: payload?.metadata || null,
      cloudFormat: 'empty',
      chunkCount: 0,
    };
  }
}

async function writeProgressToCloud(apiKey, binId, progress, syncedAt) {
  const previousChunkBinIds = await readCurrentChunkBinIds(apiKey, binId);
  const singlePayload = buildCloudPayload(progress, syncedAt);

  if (previousChunkBinIds.length === 0 && getJsonByteLength(singlePayload) <= MAX_JSONBIN_RECORD_BYTES) {
    const data = await updateJsonBinRecord(apiKey, binId, singlePayload);
    return {
      cloudFormat: 'single',
      chunkCount: 0,
      metadata: data?.metadata || null,
      createdChunkBins: 0,
      reusedChunkBins: 0,
    };
  }

  const {
    chunkSetId,
    chunks,
    encodedLength,
    decodedByteLength,
    usedChunks,
  } = makeChunkRecords(progress, syncedAt, previousChunkBinIds.length);

  const chunkBinIds = [...previousChunkBinIds];
  let createdChunkBins = 0;

  for (let index = 0; index < chunks.length; index += 1) {
    if (chunkBinIds[index]) {
      await updateJsonBinRecord(apiKey, chunkBinIds[index], chunks[index]);
      continue;
    }

    const result = await createJsonBinRecord(apiKey, chunks[index], `${APP_ID}-progress-chunk-${index + 1}`);
    chunkBinIds[index] = result.id;
    createdChunkBins += 1;
  }

  const manifest = buildChunkedCloudPayload({
    syncedAt,
    chunkSetId,
    chunkBinIds,
    encodedLength,
    decodedByteLength,
    usedChunks,
  });

  if (getJsonByteLength(manifest) > MAX_JSONBIN_RECORD_BYTES) {
    throw new Error('Cloud sync manifest is too large for JSONBin. Use fewer or larger chunks, or switch to XL Bins.');
  }

  const data = await updateJsonBinRecord(apiKey, binId, manifest);
  return {
    cloudFormat: 'chunked',
    chunkCount: chunks.length,
    metadata: data?.metadata || null,
    createdChunkBins,
    reusedChunkBins: chunks.length - createdChunkBins,
  };
}

// ─── Push ───

export async function pushProgressToCloud({ progress = getProgress() } = {}) {
  assertConfigured();
  const { apiKey, binId } = getEmbeddedCredentials();

  const syncedAt = new Date().toISOString();
  const writeResult = await writeProgressToCloud(apiKey, binId, progress, syncedAt);
  const ts = saveTimestamps({ ...getTimestamps(), lastPushedAt: syncedAt });

  return {
    syncedAt,
    timestamps: ts,
    metadata: writeResult.metadata,
    cloudFormat: writeResult.cloudFormat,
    chunkCount: writeResult.chunkCount,
    createdChunkBins: writeResult.createdChunkBins,
    reusedChunkBins: writeResult.reusedChunkBins,
  };
}

// ─── Pull ───

export async function pullProgressFromCloud({ emit = false } = {}) {
  assertConfigured();
  const { apiKey, binId } = getEmbeddedCredentials();

  const cloud = await readCloudProgress(apiKey, binId);
  const progress = cloud.progress;
  replaceProgress(progress, { source: 'cloud-pull', emit });

  const pulledAt = new Date().toISOString();
  const ts = saveTimestamps({ ...getTimestamps(), lastPulledAt: pulledAt });

  return {
    progress,
    pulledAt,
    timestamps: ts,
    metadata: cloud.metadata,
    cloudFormat: cloud.cloudFormat,
    chunkCount: cloud.chunkCount,
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
  const cloudRead = await readCloudProgressOrEmpty(apiKey, binId);
  const cloudProgress = cloudRead.progress;

  // 2. Get local state
  const localProgress = getProgress();

  // 3. Merge
  const merged = mergeProgress(localProgress, cloudProgress);

  // 4. Apply locally
  replaceProgress(merged, { source: 'cloud-sync', emit });

  // 5. Push merged back to cloud
  const syncedAt = new Date().toISOString();
  const writeResult = await writeProgressToCloud(apiKey, binId, merged, syncedAt);

  const ts = saveTimestamps({ lastPulledAt: syncedAt, lastPushedAt: syncedAt });

  return {
    merged,
    syncedAt,
    timestamps: ts,
    cloudFormat: writeResult.cloudFormat,
    chunkCount: writeResult.chunkCount,
    createdChunkBins: writeResult.createdChunkBins,
    reusedChunkBins: writeResult.reusedChunkBins,
    previousCloudFormat: cloudRead.cloudFormat,
  };
}
