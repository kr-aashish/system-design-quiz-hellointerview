import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quizStatePath = path.join(rootDir, 'quiz-state.json');
const outputPath = path.join(rootDir, 'quiz-data.json');

function extractExpression(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return null;

  const equalsIndex = source.indexOf('=', markerIndex);
  if (equalsIndex === -1) return null;

  let start = equalsIndex + 1;
  while (/\s/.test(source[start])) start += 1;

  const opener = source[start];
  const closer = opener === '[' ? ']' : opener === '{' ? '}' : null;
  if (!closer) {
    throw new Error(`Unsupported expression opener "${opener}" for ${marker}`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }

    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }

    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === opener) depth += 1;
    if (char === closer) {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`Could not find the end of ${marker}`);
}

function evaluateExpression(expression, label) {
  try {
    return Function(`"use strict"; return (${expression});`)();
  } catch (error) {
    throw new Error(`Unable to evaluate ${label}: ${error.message}`);
  }
}

function extractConst(source, name) {
  const expression = extractExpression(source, `const ${name}`);
  return expression ? evaluateExpression(expression, name) : null;
}

function normalizeQuestion(rawQuestion, index) {
  const rawOptions = Array.isArray(rawQuestion.options) ? rawQuestion.options : [];
  const options = rawOptions.map((option, optionIndex) => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      return option.text ?? option.label ?? `Option ${optionIndex + 1}`;
    }
    return String(option ?? '');
  });

  const correctIndex =
    Number.isInteger(rawQuestion.correctIndex) ? rawQuestion.correctIndex :
    Number.isInteger(rawQuestion.correct) ? rawQuestion.correct :
    Number.isInteger(rawQuestion.answerIndex) ? rawQuestion.answerIndex :
    0;

  return {
    ...rawQuestion,
    id: String(rawQuestion.id ?? `q${index + 1}`),
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

function buildQuizEntry(topic) {
  const sourcePath = path.join(rootDir, topic.outputFile);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing quiz file for ${topic.slug}: ${topic.outputFile}`);
  }

  const source = fs.readFileSync(sourcePath, 'utf8');
  const quizData = extractConst(source, 'QUIZ_DATA');
  const questionsExpression = quizData ? null : extractExpression(source, 'const QUESTIONS');
  const rawQuestions = quizData?.questions ?? evaluateExpression(questionsExpression, `${topic.outputFile} QUESTIONS`);
  const questions = rawQuestions.map(normalizeQuestion);

  const partsOrder = extractConst(source, 'PARTS_ORDER') ?? inferOrderedValues(questions, 'part');
  const subtopicsOrder = extractConst(source, 'SUBTOPICS_ORDER') ?? inferOrderedValues(questions, 'subtopic');
  const difficultyTiers = extractConst(source, 'DIFFICULTY_TIERS') ?? ['L1', 'L2', 'L3', 'L4', 'L5'];
  const categories = quizData?.categories ?? inferOrderedValues(questions, 'category');

  return {
    slug: topic.slug,
    name: topic.name,
    title: quizData?.title ?? `${topic.name} Quiz`,
    description: quizData?.description ?? `Practice scenario-based system design questions for ${topic.name}.`,
    category: topic.category,
    path: topic.path,
    sourceFile: topic.outputFile,
    estimatedTime: quizData?.estimatedTime ?? null,
    difficultyLabel: quizData?.difficulty ?? null,
    categories,
    partsOrder,
    subtopicsOrder,
    difficultyTiers,
    questions,
  };
}

const quizState = JSON.parse(fs.readFileSync(quizStatePath, 'utf8'));
const topicsWithQuizzes = quizState.topics.filter((topic) => topic.outputFile);
const quizzes = {};

for (const topic of topicsWithQuizzes) {
  quizzes[topic.slug] = buildQuizEntry(topic);
}

const catalog = {
  version: 1,
  lastUpdated: quizState.lastUpdated ?? null,
  quizzes,
};

fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${Object.keys(quizzes).length} quizzes to ${path.relative(rootDir, outputPath)}`);
