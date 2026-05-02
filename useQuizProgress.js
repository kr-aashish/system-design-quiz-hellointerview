/**
 * useQuizProgress — React hook for quiz progress persistence.
 * 
 * Wraps quizProgressStore with React-friendly API.
 * Supports both Pattern A (answers as object with confidence) and
 * Pattern B (answers as array of indices).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  startAttempt,
  recordAnswer,
  completeAttempt,
  getInProgressAttempt,
  saveQuestionOrder,
  saveAttemptState,
} from './quizProgressStore';

/**
 * Hook for tracking quiz progress.
 * 
 * @param {string} quizSlug - The slug identifying this quiz
 * @param {number} totalQuestions - Total number of questions in the quiz
 * @returns {{ 
 *   attemptId: string|null, 
 *   saveAnswer: function, 
 *   completeQuiz: function, 
 *   resumeData: object|null,
 *   startNewAttempt: function,
 *   isResuming: boolean 
 * }}
 */
export function useQuizProgress(quizSlug, totalQuestions) {
  const [attemptId, setAttemptId] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isResuming, setIsResuming] = useState(false);
  const initialized = useRef(false);

  // Check for existing in-progress attempt on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const inProgress = getInProgressAttempt(quizSlug);
    if (inProgress) {
      setResumeData({
        attemptId: inProgress.attemptId,
        questionResults: inProgress.questionResults,
        questionOrder: inProgress.questionOrder || [],
        state: inProgress.state || null,
        answeredCount: Object.keys(inProgress.questionResults).length,
        score: inProgress.score,
        totalTimeSeconds: inProgress.totalTimeSeconds || 0,
      });
      setIsResuming(true);
    }
  }, [quizSlug]);

  /**
   * Start a new attempt (used when user clicks "Start Quiz" or "Restart")
   */
  const startNewAttempt = useCallback((questionIds, initialState = null) => {
    const id = startAttempt(quizSlug, questionIds?.length || totalQuestions || 0);
    setAttemptId(id);
    setResumeData(null);
    setIsResuming(false);
    
    if (questionIds && questionIds.length > 0) {
      saveQuestionOrder(quizSlug, id, questionIds);
    }
    if (initialState) {
      saveAttemptState(quizSlug, id, initialState);
    }
    
    return id;
  }, [quizSlug, totalQuestions]);

  /**
   * Resume an existing in-progress attempt
   */
  const resumeAttempt = useCallback(() => {
    if (resumeData) {
      setAttemptId(resumeData.attemptId);
      setIsResuming(false);
      return resumeData;
    }
    return null;
  }, [resumeData]);

  /**
   * Save an individual answer.
   * 
   * For Pattern A: saveAnswer(questionId, { selectedIndex, correctIndex, isCorrect, confidence, timedOut })
   * For Pattern B: saveAnswer(questionId, { selectedIndex, correctIndex, isCorrect, skipped })
   */
  const saveAnswer = useCallback((questionId, result) => {
    const id = attemptId;
    if (!id) return;
    
    recordAnswer(quizSlug, id, questionId, result);
  }, [quizSlug, attemptId]);

  /**
   * Persist the current question order for resume support after skip/reorder flows.
   */
  const persistQuestionOrder = useCallback((questionIds) => {
    const id = attemptId;
    if (!id || !questionIds || questionIds.length === 0) return;

    saveQuestionOrder(quizSlug, id, questionIds);
  }, [quizSlug, attemptId]);

  /**
   * Persist full resumable UI state for the active attempt.
   */
  const saveState = useCallback((state) => {
    const id = attemptId;
    if (!id) return;

    saveAttemptState(quizSlug, id, state);
  }, [quizSlug, attemptId]);

  /**
   * Mark the quiz as complete.
   * 
   * @param {{ correct: number, total: number }} score - Final score
   * @param {number} totalTimeSeconds - Total time taken
   */
  const completeQuiz = useCallback((score, totalTimeSeconds, finalState = null) => {
    const id = attemptId;
    if (!id) return;
    
    completeAttempt(quizSlug, id, score, totalTimeSeconds, finalState);
  }, [quizSlug, attemptId]);

  return {
    attemptId,
    saveAnswer,
    completeQuiz,
    resumeData,
    startNewAttempt,
    saveQuestionOrder: persistQuestionOrder,
    saveState,
    resumeAttempt,
    isResuming,
  };
}
