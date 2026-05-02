import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

function extractHeader(source, firstDataIndex) {
  const prefix = source.slice(0, firstDataIndex);
  const importIndex = prefix.search(/^import\s/m);
  const header = (importIndex === -1 ? prefix : prefix.slice(0, importIndex)).trimEnd();
  return header ? `${header}\n\n` : '';
}

function jsonConst(name, value) {
  if (value === null) return '';
  return `export const ${name} = ${JSON.stringify(value, null, 2)};\n\n`;
}

function dataOnlyModuleFor(fileName) {
  const filePath = path.join(rootDir, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const quizDataExpression = extractExpression(source, 'const QUIZ_DATA');
  const questionsExpression = quizDataExpression ? null : extractExpression(source, 'const QUESTIONS');
  const firstDataIndex = quizDataExpression
    ? source.indexOf('const QUIZ_DATA')
    : source.indexOf('const QUESTIONS');

  if (firstDataIndex === -1) {
    throw new Error(`No QUIZ_DATA or QUESTIONS found in ${fileName}`);
  }

  const header = extractHeader(source, firstDataIndex);
  const banner = '// Data-only quiz module. Rendering lives in QuizEngine.jsx.\n\n';

  if (quizDataExpression) {
    const quizData = evaluateExpression(quizDataExpression, `${fileName} QUIZ_DATA`);
    return `${header}${banner}${jsonConst('QUIZ_DATA', quizData)}export default QUIZ_DATA;\n`;
  }

  const questions = evaluateExpression(questionsExpression, `${fileName} QUESTIONS`);
  const partsOrder = extractConst(source, 'PARTS_ORDER');
  const subtopicsOrder = extractConst(source, 'SUBTOPICS_ORDER');
  const difficultyTiers = extractConst(source, 'DIFFICULTY_TIERS');

  let output = `${header}${banner}${jsonConst('QUESTIONS', questions)}`;
  output += jsonConst('PARTS_ORDER', partsOrder);
  output += jsonConst('SUBTOPICS_ORDER', subtopicsOrder);
  output += jsonConst('DIFFICULTY_TIERS', difficultyTiers);
  output += 'export default {\n';
  output += '  questions: QUESTIONS';
  if (partsOrder) output += ',\n  partsOrder: PARTS_ORDER';
  if (subtopicsOrder) output += ',\n  subtopicsOrder: SUBTOPICS_ORDER';
  if (difficultyTiers) output += ',\n  difficultyTiers: DIFFICULTY_TIERS';
  output += '\n};\n';
  return output;
}

const files = fs.readdirSync(rootDir)
  .filter((fileName) => fileName.endsWith('-quiz.jsx'))
  .sort();

for (const fileName of files) {
  fs.writeFileSync(path.join(rootDir, fileName), dataOnlyModuleFor(fileName));
}

console.log(`Stripped UI from ${files.length} quiz files.`);
