import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quizStatePath = path.join(rootDir, 'quiz-state.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveQuizDataPath(quizDataPath) {
  if (!quizDataPath) return null;
  if (path.isAbsolute(quizDataPath)) return quizDataPath;
  return path.join(rootDir, quizDataPath);
}

function getPathSegments(topic) {
  return String(topic.path || '').split('/').filter(Boolean);
}

function isLowLevelDesignTopic(topic) {
  const segments = getPathSegments(topic);
  return segments[0] === 'learn' && segments[1] === 'low-level-design';
}

function expectedLowLevelDesignQuizPath(topic) {
  const segments = getPathSegments(topic);
  const [, track, section, ...articleSegments] = segments;
  const article = articleSegments.at(-1);

  if (!track || !section || !article) {
    throw new Error(`${topic.slug}: low-level-design topic path must include /learn/<track>/<section>/<article>`);
  }

  return `data/quizzes/${track}/${section}/${article}.json`;
}

function validateLowLevelDesignPath(topic) {
  if (!isLowLevelDesignTopic(topic)) return;

  const expectedPath = expectedLowLevelDesignQuizPath(topic);
  if (topic.quizDataPath !== expectedPath) {
    throw new Error(`${topic.slug}: quizDataPath must follow the index hierarchy: expected ${expectedPath}, found ${topic.quizDataPath}`);
  }
}

function validateQuestion(question, quizPath, index) {
  if (!question || typeof question !== 'object') {
    throw new Error(`${quizPath}: question ${index + 1} must be an object`);
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    throw new Error(`${quizPath}: question ${question.id ?? index + 1} must have at least two options`);
  }

  const correctIndex =
    Number.isInteger(question.correctIndex) ? question.correctIndex :
    Number.isInteger(question.correct) ? question.correct :
    Number.isInteger(question.answerIndex) ? question.answerIndex :
    null;

  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= question.options.length) {
    throw new Error(`${quizPath}: question ${question.id ?? index + 1} has an invalid correct index`);
  }
}

function validateQuizData(topic) {
  validateLowLevelDesignPath(topic);

  const absolutePath = resolveQuizDataPath(topic.quizDataPath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    throw new Error(`${topic.slug}: missing quiz JSON at ${topic.quizDataPath}`);
  }

  const quiz = readJson(absolutePath);
  if (quiz.active === false) return { active: false };

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error(`${topic.quizDataPath}: active quiz must contain a non-empty questions array`);
  }

  quiz.questions.forEach((question, index) => validateQuestion(question, topic.quizDataPath, index));
  return { active: true, questions: quiz.questions.length };
}

const quizState = readJson(quizStatePath);
let activeCount = 0;
let inactiveCount = 0;
let questionCount = 0;

for (const topic of quizState.topics.filter((item) => item.quizDataPath)) {
  const result = validateQuizData(topic);
  if (result.active) {
    activeCount += 1;
    questionCount += result.questions;
  } else {
    inactiveCount += 1;
  }
}

console.log(`Validated ${activeCount} active quizzes (${questionCount} questions) and ${inactiveCount} inactive quiz data file.`);
