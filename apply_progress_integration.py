#!/usr/bin/env python3
"""
Apply useQuizProgress integration to Pattern A quiz files.
Each quiz follows the same structure as contention-quiz.jsx.
"""

import re
import sys

# Map: filename -> (component function name, default quiz slug)
QUIZ_FILES = {
    'caching-quiz.jsx': ('CachingQuiz', 'core-concepts-caching'),
    'scaling-reads-quiz.jsx': ('ScalingReadsQuiz', 'patterns-scaling-reads'),
    'scaling-writes-quiz.jsx': ('ScalingWritesQuiz', 'patterns-scaling-writes'),
    'handling-large-blobs-quiz.jsx': ('LargeBlobsQuiz', 'patterns-large-blobs'),
    'multi-step-processes-quiz.jsx': ('MultiStepProcessesQuiz', 'patterns-multi-step-processes'),
    'managing-long-running-tasks-quiz.jsx': ('ManagingLongRunningTasksQuiz', 'patterns-long-running-tasks'),
    'data-modeling-quiz.jsx': ('DataModelingQuiz', 'core-concepts-data-modeling'),
    'networking-essentials-quiz.jsx': ('NetworkingEssentialsQuiz', 'core-concepts-networking-essentials'),
    'database-indexing-quiz.jsx': ('DatabaseIndexingQuiz', 'core-concepts-db-indexing'),
    'big-data-structures-quiz.jsx': ('BigDataStructuresQuiz', 'advanced-data-structures-big-data'),
    'consistent-hashing-quiz.jsx': ('ConsistentHashingQuiz', 'core-concepts-consistent-hashing'),
    'numbers-to-know-quiz.jsx': ('NumbersToKnowQuiz', 'core-concepts-numbers-to-know'),
    'sharding-quiz.jsx': ('ShardingQuiz', 'core-concepts-sharding'),
    'time-series-databases-quiz.jsx': ('TimeSeriesDatabasesQuiz', 'advanced-time-series-databases'),
    'vector-database-quiz.jsx': ('VectorDatabaseQuiz', 'advanced-vector-databases'),
}


def transform_file(filepath, func_name, slug):
    with open(filepath, 'r') as f:
        content = f.read()

    changes = 0

    # 1. Add import for useQuizProgress after the React imports
    if "import { useQuizProgress }" not in content:
        # Find the line: import { useState, useEffect, useCallback, useRef } from "react";
        content = content.replace(
            'import { useState, useEffect, useCallback, useRef } from "react";',
            'import { useState, useEffect, useCallback, useRef } from "react";\nimport { useQuizProgress } from \'./useQuizProgress\';',
            1
        )
        changes += 1

    # 2. Add quizSlug prop to component function
    old_sig = f'export default function {func_name}() {{'
    new_sig = f"export default function {func_name}({{ quizSlug = '{slug}' }}) {{"
    if old_sig in content:
        content = content.replace(old_sig, new_sig, 1)
        changes += 1

    # 3. Add useQuizProgress hook after timerRef
    if 'useQuizProgress(quizSlug' not in content:
        content = content.replace(
            '  const timerRef = useRef(null);\n',
            '  const timerRef = useRef(null);\n\n  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);\n',
            1
        )
        changes += 1

    # 4. Add startNewAttempt call inside startQuiz, and update deps
    # Pattern: setScreen("quiz");\n    },\n    []\n  );
    if 'startNewAttempt(qs.map' not in content:
        content = content.replace(
            '      setScreen("quiz");\n    },\n    []\n  );',
            '      setScreen("quiz");\n      startNewAttempt(qs.map(q => q.id));\n    },\n    [startNewAttempt]\n  );',
            1
        )
        changes += 1

    # 5. Add handleResume after startQuiz
    if 'const handleResume = useCallback' not in content:
        # Find the closing of startQuiz and add handleResume after it
        startquiz_end = '    [startNewAttempt]\n  );'
        resume_fn = '''    [startNewAttempt]
  );

  const handleResume = useCallback(() => {
    const data = resumeAttempt();
    if (!data) return;
    const order = data.questionOrder;
    let qs;
    if (order && order.length > 0) {
      qs = order.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    } else {
      qs = [...QUESTIONS];
    }
    const restoredAnswers = {};
    for (const [qid, r] of Object.entries(data.questionResults)) {
      restoredAnswers[qid] = {
        selected: r.selectedIndex,
        confidence: r.confidence,
        correct: r.isCorrect,
        timedOut: r.timedOut || false,
      };
    }
    setQuestions(qs);
    const firstUnanswered = qs.findIndex(q => !data.questionResults[q.id]);
    setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : qs.length - 1);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers(restoredAnswers);
    setSkipped([]);
    setFlagged(new Set());
    setTimer(TIMER_SECONDS);
    setTimedOut(false);
    setTotalStartTime(Date.now());
    setTotalElapsed(0);
    setScreen("quiz");
  }, [resumeAttempt]);'''
        content = content.replace(startquiz_end, resume_fn, 1)
        changes += 1

    # 6. Update handleSubmit to persist answer
    if 'persistAnswer(currentQuestion.id,' not in content:
        # Find and replace the handleSubmit
        old_submit = '''    clearInterval(timerRef.current);
    setSubmitted(true);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: selectedOption,
        confidence,
        correct: selectedOption === currentQuestion.correctIndex,
        timedOut: false,
      },
    }));
  };'''
        new_submit = '''    clearInterval(timerRef.current);
    setSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: selectedOption,
        confidence,
        correct: isCorrect,
        timedOut: false,
      },
    }));
    persistAnswer(currentQuestion.id, {
      selectedIndex: selectedOption,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
      confidence,
      timedOut: false,
    });
  };'''
        content = content.replace(old_submit, new_submit, 1)
        changes += 1

    # 7. Update results transition in handleNext
    if 'completeQuiz({' not in content:
        old_results = '''    } else {
      setTotalElapsed(Math.round((Date.now() - totalStartTime) / 1000));
      setScreen("results");
    }'''
        new_results = '''    } else {
      const elapsed = Math.round((Date.now() - totalStartTime) / 1000);
      setTotalElapsed(elapsed);
      const correctCount = Object.values(answers).filter(a => a.correct).length;
      completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, elapsed);
      setScreen("results");
    }'''
        content = content.replace(old_results, new_results, 1)
        changes += 1

    # 8. Update timed-out useEffect to persist
    old_timeout = '''      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          selected: selectedOption,
          confidence: null,
          correct: false,
          timedOut: true,
        },
      }));
    }
  }, [timedOut]);'''
    new_timeout = '''      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          selected: selectedOption,
          confidence: null,
          correct: false,
          timedOut: true,
        },
      }));
      persistAnswer(currentQuestion.id, {
        selectedIndex: selectedOption,
        correctIndex: currentQuestion.correctIndex,
        isCorrect: false,
        confidence: null,
        timedOut: true,
      });
    }
  }, [timedOut]);'''
    if content.count('persistAnswer(currentQuestion.id') < 2:  # only if not already added
        content = content.replace(old_timeout, new_timeout, 1)
        changes += 1

    # 9. Update the null currentQuestion fallback
    old_fallback = '''  if (!currentQuestion) {
    setTotalElapsed(Math.round((Date.now() - totalStartTime) / 1000));
    setScreen("results");
    return null;
  }'''
    new_fallback = '''  if (!currentQuestion) {
    const elapsed = Math.round((Date.now() - totalStartTime) / 1000);
    setTotalElapsed(elapsed);
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, elapsed);
    setScreen("results");
    return null;
  }'''
    if content.count('completeQuiz({') < 2:  # only add if not already there from step 7
        content = content.replace(old_fallback, new_fallback, 1)
    changes += 1

    # 10. Add resume banner and update button text in landing screen
    # Find the "Section Order" / "Shuffled" buttons pattern
    old_buttons = '''          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMode("ordered");
                startQuiz("ordered");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-200 font-medium"
            >
              <List size={18} /> Section Order
            </button>
            <button
              onClick={() => {
                setMode("shuffled");
                startQuiz("shuffled");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium"
            >
              <Shuffle size={18} /> Shuffled (Recommended)
            </button>
          </div>'''
    
    new_buttons = '''          {isResuming && resumeData && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 font-medium text-sm">In-progress attempt found</p>
                  <p className="text-slate-400 text-xs mt-1">{resumeData.answeredCount}/{QUESTIONS.length} questions answered</p>
                </div>
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium text-sm border border-amber-500/30 transition-colors"
                >
                  <RotateCcw size={14} /> Resume
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMode("ordered");
                startQuiz("ordered");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-200 font-medium"
            >
              <List size={18} /> Section Order
            </button>
            <button
              onClick={() => {
                setMode("shuffled");
                startQuiz("shuffled");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium"
            >
              <Shuffle size={18} /> {isResuming ? 'Start Fresh' : 'Shuffled (Recommended)'}
            </button>
          </div>'''
    
    if 'isResuming && resumeData' not in content:
        content = content.replace(old_buttons, new_buttons, 1)
        changes += 1

    with open(filepath, 'w') as f:
        f.write(content)

    return changes


if __name__ == '__main__':
    import os
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename, (func_name, slug) in QUIZ_FILES.items():
        filepath = os.path.join(base_dir, filename)
        if not os.path.exists(filepath):
            print(f"⚠️  {filename} not found, skipping")
            continue
        changes = transform_file(filepath, func_name, slug)
        print(f"✅ {filename}: {changes} changes applied")
