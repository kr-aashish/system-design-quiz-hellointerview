import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Lightbulb,
  List,
  MessageSquare,
  RotateCcw,
  Shuffle,
  SkipForward,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useQuizProgress } from "./useQuizProgress";

const DEFAULT_DIFFICULTY_TIERS = ["L1", "L2", "L3", "L4", "L5"];
const TIER_TIMERS = {
  L1: 60,
  L2: 90,
  L3: 90,
  L4: 120,
  L5: 150,
};
const LEGACY_TIMER_SECONDS = 90;
const DIFFICULTY_STYLE = {
  L1: {
    label: "L1 Recognition",
    chip: "bg-green-950/30 border-green-800/40 text-green-300",
  },
  L2: {
    label: "L2 Understanding",
    chip: "bg-blue-950/30 border-blue-800/40 text-blue-300",
  },
  L3: {
    label: "L3 Application",
    chip: "bg-indigo-950/30 border-indigo-800/40 text-indigo-300",
  },
  L4: {
    label: "L4 Analysis",
    chip: "bg-amber-950/30 border-amber-800/40 text-amber-300",
  },
  L5: {
    label: "L5 Staff",
    chip: "bg-red-950/30 border-red-800/40 text-red-300",
  },
};

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function overrideValue(overrides, key, fallback) {
  return hasOwn(overrides, key) ? overrides[key] : fallback;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function normalizeQuestion(question, index) {
  const options = (question.options || []).map((option, optionIndex) => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") {
      return option.text ?? option.label ?? `Option ${optionIndex + 1}`;
    }
    return String(option ?? "");
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

function getGroupLabel(question) {
  return question.subtopic || question.category || question.part || "General";
}

function getPrimaryGroup(question) {
  return question.part || question.category || question.subtopic || "General";
}

function getSecondaryGroup(question) {
  if (question.part) return question.subtopic || question.category || question.part;
  if (question.category) return question.subtopic || question.category;
  return question.subtopic || "General";
}

function getTimerDuration(question) {
  return TIER_TIMERS[question?.difficulty] || LEGACY_TIMER_SECONDS;
}

function getGrade(percent) {
  if (percent >= 90) return { label: "Staff-ready - fundamentals fully internalized", text: "text-green-400", bg: "bg-green-500/10 border-green-500/30", bar: "bg-green-500" };
  if (percent >= 75) return { label: "Strong Senior - solid, minor gaps to close", text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", bar: "bg-blue-500" };
  if (percent >= 60) return { label: "SDE2-level - review weak tiers below", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", bar: "bg-amber-500" };
  return { label: "Needs deep review - revisit the fundamentals", text: "text-red-400", bg: "bg-red-500/10 border-red-500/30", bar: "bg-red-500" };
}

function orderedUnique(values) {
  const seen = new Set();
  return values.filter((value) => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function getCatalogOrder(questions, fieldName, configuredOrder = []) {
  const inferred = orderedUnique(questions.map((question) => question[fieldName]));
  return orderedUnique([...configuredOrder, ...inferred]);
}

function orderQuestions(mode, questions, quiz) {
  if (mode === "shuffled") return shuffleArray(questions);
  if (mode !== "ladder") return [...questions];

  const partsOrder = getCatalogOrder(questions, "part", quiz.partsOrder);
  const categoriesOrder = getCatalogOrder(questions, "category", quiz.categories);
  const subtopicsOrder = getCatalogOrder(questions, "subtopic", quiz.subtopicsOrder);
  const tiers = quiz.difficultyTiers?.length ? quiz.difficultyTiers : DEFAULT_DIFFICULTY_TIERS;

  const partIndex = new Map(partsOrder.map((part, index) => [part, index]));
  const categoryIndex = new Map(categoriesOrder.map((category, index) => [category, index]));
  const subtopicIndex = new Map(subtopicsOrder.map((subtopic, index) => [subtopic, index]));
  const tierIndex = new Map(tiers.map((tier, index) => [tier, index]));

  return [...questions].sort((a, b) => {
    const partA = partIndex.get(a.part) ?? categoryIndex.get(a.category) ?? 999;
    const partB = partIndex.get(b.part) ?? categoryIndex.get(b.category) ?? 999;
    if (partA !== partB) return partA - partB;

    const tierA = tierIndex.get(a.difficulty) ?? 999;
    const tierB = tierIndex.get(b.difficulty) ?? 999;
    if (tierA !== tierB) return tierA - tierB;

    const subtopicA = subtopicIndex.get(a.subtopic) ?? 999;
    const subtopicB = subtopicIndex.get(b.subtopic) ?? 999;
    return subtopicA - subtopicB;
  });
}

function formatTime(seconds) {
  const mins = Math.floor((seconds || 0) / 60);
  const secs = (seconds || 0) % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getReviewSummary(resumeData, totalQuestions) {
  if (!resumeData) return null;
  const answered = resumeData.answeredCount || 0;
  const score = resumeData.score || { correct: 0, total: 0 };
  return `${answered}/${totalQuestions} attempted, ${score.correct}/${Math.max(score.total, 1)} scored`;
}

function StatChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
      <Icon size={14} />
      {children}
    </span>
  );
}

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-gray-800 text-gray-400 border-gray-700",
    blue: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    amber: "bg-amber-950/30 text-amber-300 border-amber-800/40",
    emerald: "bg-green-950/30 text-green-300 border-green-800/40",
    purple: "bg-red-950/40 text-red-300 border-red-800/40",
  };
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

function BreakdownBars({ title, icon: Icon, rows }) {
  if (!rows.length) return null;
  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-100">
        <Icon size={15} />
        {title}
      </h3>
      <div className="space-y-3">
        {rows.map((row) => {
          const pct = row.total ? Math.round((row.correct / row.total) * 100) : 0;
          const color = pct >= 70 ? "bg-green-500" : "bg-red-500";
          return (
            <div key={row.name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-gray-300">{row.name}</span>
                <span className={pct >= 70 ? "text-green-400" : "text-red-400"}>
                  {row.correct}/{row.total} ({pct}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReviewList({ title, icon: Icon, questions, answers }) {
  if (!questions.length) return null;
  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-100">
        <Icon size={15} />
        {title} ({questions.length})
      </h3>
      <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-2">
        {questions.map((question) => {
          const answer = answers[question.id];
          const selectedText = Number.isInteger(answer?.selectedIndex)
            ? question.options[answer.selectedIndex]
            : null;
          return (
            <article key={question.id} className="rounded-lg border border-gray-800 p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                {question.difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded border ${DIFFICULTY_STYLE[question.difficulty]?.chip || DIFFICULTY_STYLE.L3.chip}`}>
                    {DIFFICULTY_STYLE[question.difficulty]?.label || question.difficulty}
                  </span>
                )}
                <Pill tone="blue">{getPrimaryGroup(question)}</Pill>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-300">{question.question}</p>
              {selectedText && (
                <p className="mb-1 text-sm text-red-400">
                  Your answer: {String.fromCharCode(65 + answer.selectedIndex)}. {selectedText}
                </p>
              )}
              {answer?.skipped && <p className="mb-1 text-sm text-amber-400">Skipped</p>}
              {answer?.timedOut && <p className="mb-1 text-sm text-amber-400">Timed out</p>}
              {answer?.revealed && <p className="mb-1 text-sm text-indigo-300">Answer revealed</p>}
              <p className="mb-3 text-sm text-green-400">
                Correct: {String.fromCharCode(65 + question.correctIndex)}. {question.options[question.correctIndex]}
              </p>
              {question.explanation && (
                <p className="text-xs leading-relaxed text-gray-500">{question.explanation}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function QuizEngine({ quiz }) {
  const allQuestions = useMemo(
    () => (quiz.questions || []).map(normalizeQuestion),
    [quiz.questions]
  );
  const questionsById = useMemo(
    () => new Map(allQuestions.map((question) => [question.id, question])),
    [allQuestions]
  );
  const hasDifficulty = allQuestions.some((question) => question.difficulty);
  const defaultMode = hasDifficulty ? "ladder" : "shuffled";

  const {
    attemptId,
    saveAnswer: persistAnswer,
    completeQuiz,
    resumeData,
    startNewAttempt,
    saveState,
    resumeAttempt,
    isResuming,
  } = useQuizProgress(quiz.slug, allQuestions.length);

  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState(defaultMode);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [timer, setTimer] = useState(LEGACY_TIMER_SECONDS);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const currentQuestion = questions[currentIndex];
  const currentTimerDuration = getTimerDuration(currentQuestion);

  const makePersistedState = useCallback((overrides = {}) => {
    const stateQuestions = overrideValue(overrides, "questions", questions);
    const stateAnswers = overrideValue(overrides, "answers", answers);
    const stateFlagged = overrideValue(overrides, "flagged", flagged);
    const stateSkipped = overrideValue(overrides, "skipped", skipped);
    return {
      schemaVersion: 1,
      screen: overrideValue(overrides, "screen", screen),
      mode: overrideValue(overrides, "mode", mode),
      questionOrder: stateQuestions.map((question) => question.id),
      currentIndex: overrideValue(overrides, "currentIndex", currentIndex),
      selectedOption: overrideValue(overrides, "selectedOption", selectedOption),
      confidence: overrideValue(overrides, "confidence", confidence),
      submitted: overrideValue(overrides, "submitted", submitted),
      answers: stateAnswers,
      skipped: stateSkipped,
      flagged: stateFlagged,
      timer: overrideValue(overrides, "timer", timer),
      totalElapsed: overrideValue(overrides, "totalElapsed", totalElapsed),
      questionsAttempted: Object.keys(stateAnswers).length,
      updatedAt: new Date().toISOString(),
    };
  }, [
    answers,
    confidence,
    currentIndex,
    flagged,
    mode,
    questions,
    screen,
    selectedOption,
    skipped,
    submitted,
    timer,
    totalElapsed,
  ]);

  const startQuiz = useCallback((selectedMode = mode, questionSubset = null) => {
    const baseQuestions = questionSubset || allQuestions;
    const nextQuestions = orderQuestions(selectedMode, baseQuestions, quiz);
    const firstTimer = getTimerDuration(nextQuestions[0]);
    const initialState = {
      schemaVersion: 1,
      screen: "quiz",
      mode: selectedMode,
      questionOrder: nextQuestions.map((question) => question.id),
      currentIndex: 0,
      selectedOption: null,
      confidence: null,
      submitted: false,
      answers: {},
      skipped: [],
      flagged: [],
      timer: firstTimer,
      totalElapsed: 0,
      questionsAttempted: 0,
      updatedAt: new Date().toISOString(),
    };

    setMode(selectedMode);
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers({});
    setSkipped([]);
    setFlagged([]);
    setTimer(firstTimer);
    setTotalElapsed(0);
    setScreen("quiz");
    startNewAttempt(initialState.questionOrder, initialState);
  }, [allQuestions, mode, quiz, startNewAttempt]);

  const restoreFromAttempt = useCallback(() => {
    const data = resumeAttempt();
    if (!data) return;

    const restoredState = data.state;
    const orderedQuestions = restoredState?.questionOrder?.length
      ? restoredState.questionOrder.map((id) => questionsById.get(String(id))).filter(Boolean)
      : allQuestions;
    const restoredAnswers = restoredState?.answers || Object.fromEntries(
      Object.entries(data.questionResults || {}).map(([questionId, result]) => [
        questionId,
        {
          selectedIndex: result.selectedIndex,
          correctIndex: result.correctIndex,
          isCorrect: result.isCorrect,
          confidence: result.confidence,
          timedOut: result.timedOut,
          skipped: result.skipped,
          elapsedSeconds: result.elapsedSeconds,
        },
      ])
    );
    const nextIndex = Math.min(
      restoredState?.currentIndex ?? Object.keys(restoredAnswers).length,
      Math.max(orderedQuestions.length - 1, 0)
    );
    const nextQuestion = orderedQuestions[nextIndex];

    setMode(restoredState?.mode || defaultMode);
    setQuestions(orderedQuestions);
    setCurrentIndex(nextIndex);
    setSelectedOption(restoredState?.selectedOption ?? null);
    setConfidence(restoredState?.confidence ?? null);
    setSubmitted(restoredState?.submitted ?? false);
    setAnswers(restoredAnswers);
    setSkipped(restoredState?.skipped || []);
    setFlagged(restoredState?.flagged || []);
    setTimer(restoredState?.timer ?? getTimerDuration(nextQuestion));
    setTotalElapsed(restoredState?.totalElapsed ?? data.totalTimeSeconds ?? 0);
    setScreen("quiz");
  }, [allQuestions, defaultMode, questionsById, resumeAttempt]);

  useEffect(() => {
    if (!attemptId || screen === "landing") return;
    saveState(makePersistedState());
  }, [attemptId, makePersistedState, saveState, screen]);

  useEffect(() => {
    if (screen !== "quiz") return undefined;
    const interval = window.setInterval(() => {
      setTotalElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || submitted || !currentQuestion) return undefined;
    const interval = window.setInterval(() => {
      setTimer((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [currentQuestion, screen, submitted]);

  const finishQuiz = useCallback((finalAnswers = answers, finalSkipped = skipped) => {
    const correct = questions.filter((question) => finalAnswers[question.id]?.isCorrect).length;
    const finalState = makePersistedState({
      screen: "results",
      answers: finalAnswers,
      skipped: finalSkipped,
      submitted: true,
    });
    setScreen("results");
    completeQuiz({ correct, total: questions.length }, totalElapsed, finalState);
  }, [answers, completeQuiz, makePersistedState, questions, skipped, totalElapsed]);

  const moveToNextQuestion = useCallback((nextAnswers = answers, nextSkipped = skipped) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      finishQuiz(nextAnswers, nextSkipped);
      return;
    }

    const nextQuestion = questions[nextIndex];
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setTimer(getTimerDuration(nextQuestion));
  }, [answers, currentIndex, finishQuiz, questions, skipped]);

  const recordCurrentAnswer = useCallback(({ timedOut = false, skippedAnswer = false, revealed = false } = {}) => {
    if (!currentQuestion || submitted) return;

    const selectedIndex = skippedAnswer || revealed ? null : selectedOption;
    const hasSelection = Number.isInteger(selectedIndex);
    const isCorrect = hasSelection && selectedIndex === currentQuestion.correctIndex;
    const elapsedSeconds = Math.max(0, currentTimerDuration - timer);
    const nextAnswer = {
      selectedIndex,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
      confidence: timedOut ? confidence || "timeout" : confidence,
      timedOut,
      skipped: skippedAnswer,
      revealed,
      elapsedSeconds,
      answeredAt: new Date().toISOString(),
    };
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: nextAnswer,
    };

    setAnswers(nextAnswers);
    persistAnswer(currentQuestion.id, {
      ...nextAnswer,
      optionText: hasSelection ? currentQuestion.options[selectedIndex] : null,
      correctOptionText: currentQuestion.options[currentQuestion.correctIndex],
    });

    if (skippedAnswer) {
      const nextSkipped = orderedUnique([...skipped, currentQuestion.id]);
      setSkipped(nextSkipped);
      moveToNextQuestion(nextAnswers, nextSkipped);
      return;
    }

    setSubmitted(true);
  }, [
    answers,
    confidence,
    currentQuestion,
    currentTimerDuration,
    moveToNextQuestion,
    persistAnswer,
    selectedOption,
    skipped,
    submitted,
    timer,
  ]);


  useEffect(() => {
    if (screen !== "quiz") return undefined;
    const handler = (event) => {
      const key = event.key.toLowerCase();
      if (!submitted) {
        if (["1", "a"].includes(key)) setSelectedOption(0);
        if (["2", "b"].includes(key)) setSelectedOption(1);
        if (["3", "c"].includes(key)) setSelectedOption(2);
        if (["4", "d"].includes(key)) setSelectedOption(3);
        if (key === "enter" && selectedOption !== null) {
          recordCurrentAnswer();
        }
      } else if (key === "enter") {
        moveToNextQuestion();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [moveToNextQuestion, recordCurrentAnswer, screen, selectedOption, submitted]);

  const coverageRows = useMemo(() => {
    const counts = new Map();
    allQuestions.forEach((question) => {
      const key = getGroupLabel(question);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, [allQuestions]);

  const coverageGroups = useMemo(() => {
    const groups = new Map();
    for (const question of allQuestions) {
      const primary = getPrimaryGroup(question);
      const secondary = getSecondaryGroup(question);
      if (!groups.has(primary)) {
        groups.set(primary, { name: primary, count: 0, children: new Map() });
      }
      const group = groups.get(primary);
      group.count += 1;
      group.children.set(secondary, (group.children.get(secondary) || 0) + 1);
    }
    return [...groups.values()].map((group) => ({
      ...group,
      children: [...group.children.entries()].map(([name, count]) => ({ name, count })),
    }));
  }, [allQuestions]);

  const resultStats = useMemo(() => {
    const correct = questions.filter((question) => answers[question.id]?.isCorrect).length;
    const attempted = Object.keys(answers).length;
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const grade = getGrade(pct);

    const groups = new Map();
    const tiers = new Map();
    for (const question of questions) {
      const group = getPrimaryGroup(question);
      if (!groups.has(group)) groups.set(group, { name: group, correct: 0, total: 0 });
      groups.get(group).total += 1;
      if (answers[question.id]?.isCorrect) groups.get(group).correct += 1;

      const tier = question.difficulty || "L3";
      if (!tiers.has(tier)) tiers.set(tier, { name: tier, correct: 0, total: 0 });
      tiers.get(tier).total += 1;
      if (answers[question.id]?.isCorrect) tiers.get(tier).correct += 1;
    }

    const incorrect = questions.filter((question) => answers[question.id] && !answers[question.id].isCorrect);
    const missedQuestions = questions.filter((question) => answers[question.id] && !answers[question.id].isCorrect);
    const weakGroups = [...groups.values()]
      .filter((group) => group.total && group.correct / group.total < 0.7)
      .map((group) => group.name);

    return {
      correct,
      attempted,
      pct,
      grade,
      groupRows: [...groups.values()],
      tierRows: [...tiers.values()].sort((a, b) => DEFAULT_DIFFICULTY_TIERS.indexOf(a.name) - DEFAULT_DIFFICULTY_TIERS.indexOf(b.name)),
      incorrect,
      missedQuestions,
      weakGroups,
    };
  }, [answers, flagged, questions]);

  if (screen === "landing") {
    const totalSeconds = allQuestions.reduce((sum, question) => sum + getTimerDuration(question), 0);
    const estimatedMinutes = quiz.estimatedTime || `~${Math.round(totalSeconds / 60)} min`;
    const resumeSummary = getReviewSummary(resumeData, allQuestions.length);

    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300">
            <ArrowLeft size={16} />
            All quizzes
          </Link>

          <section className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 px-3 py-1 rounded-full text-sm mb-4">
              <Layers size={14} />
              {quiz.category} · {quiz.name} {hasDifficulty ? "· L1 -> L5 Ladder" : ""}
            </div>
            <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
            {quiz.difficultyLabel && <p className="text-gray-400 text-lg mb-1">{quiz.difficultyLabel}</p>}
            <p className="text-gray-500 text-sm">{quiz.description}</p>
          </section>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
            <StatChip icon={BookOpen}>{allQuestions.length} questions</StatChip>
            <StatChip icon={Clock}>{estimatedMinutes}</StatChip>
            <StatChip icon={Target}>{coverageRows.length} coverage areas</StatChip>
          </div>

          {isResuming && (
            <section className="mb-6 rounded-xl border border-amber-700/50 bg-amber-950/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-amber-300">Resume saved attempt</h2>
                  <p className="text-sm text-amber-200/70">{resumeSummary}</p>
                </div>
                <button
                  onClick={restoreFromAttempt}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
                >
                  <RotateCcw size={16} />
                  Continue
                </button>
              </div>
            </section>
          )}

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Coverage Breakdown</h2>
            {coverageGroups.map((group) => (
              <div key={group.name} className="mb-4 last:mb-0">
                <div className="text-xs font-medium uppercase tracking-wider mb-2 text-gray-400">
                  {group.name} ({group.count} questions)
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.children.map((row) => (
                    <span
                      key={`${group.name}-${row.name}`}
                      className="text-xs px-2 py-1 rounded border bg-indigo-950/30 border-indigo-800/40 text-indigo-300"
                    >
                      {row.name} <span className="opacity-60">({row.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {hasDifficulty && (
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Difficulty Ladder
              </h3>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_DIFFICULTY_TIERS.map((tier) => (
                  <span key={tier} className={`text-xs px-2 py-1 rounded border ${DIFFICULTY_STYLE[tier].chip}`}>
                    {DIFFICULTY_STYLE[tier].label} · {TIER_TIMERS[tier]}s
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Ladder mode plays each area from easier recognition questions into deeper trade-off questions. Shuffled mode interleaves areas for retake and spaced review.
              </p>
            </section>
          )}

          <section className="flex gap-3 justify-center flex-wrap">
            {hasDifficulty && (
              <button
                onClick={() => startQuiz("ladder")}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-semibold"
              >
                <Layers size={18} />
                Ladder (Recommended)
              </button>
            )}
            <button
              onClick={() => startQuiz("ordered")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <List size={18} />
              Section Order
            </button>
            <button
              onClick={() => startQuiz("shuffled")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <Shuffle size={18} />
              Shuffled
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (screen === "results") {
    const { grade } = resultStats;
    const retryMissed = resultStats.missedQuestions.length > 0;
    const retryWeak = resultStats.weakGroups.length > 0;
    const weakQuestions = allQuestions.filter((question) => resultStats.weakGroups.includes(getPrimaryGroup(question)));
    const hardQuestions = allQuestions.filter((question) => ["L4", "L5"].includes(question.difficulty));

    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300">
            <ArrowLeft size={16} />
            All quizzes
          </Link>

          <section className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${grade.bg} ${grade.text} mb-3`}>
              <Award size={16} />
              {grade.label}
            </div>
            <div className="text-6xl font-bold mb-2">{resultStats.pct}%</div>
            <p className="text-lg text-gray-400 mb-3">
              {resultStats.correct} / {questions.length} correct
            </p>
            <div className="text-sm text-gray-500">Total time: {formatTime(totalElapsed)}</div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers size={18} /> Accuracy by Tier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {DEFAULT_DIFFICULTY_TIERS.map((tier) => {
                const row = resultStats.tierRows.find((item) => item.name === tier);
                const correct = row?.correct || 0;
                const total = row?.total || 0;
                const pct = total ? Math.round((correct / total) * 100) : 0;
                return (
                  <div key={tier} className={`rounded-lg border ${DIFFICULTY_STYLE[tier].chip} px-3 py-3 text-center`}>
                    <div className="text-xs uppercase tracking-wide opacity-80">{DIFFICULTY_STYLE[tier].label}</div>
                    <div className="text-2xl font-bold mt-1">{total ? `${correct}/${total}` : "-"}</div>
                    <div className="text-xs opacity-80">{total ? `${pct}%` : "not attempted"}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mb-6">
            <BreakdownBars title="Coverage by Area" icon={BarChart3} rows={resultStats.groupRows} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-8 mb-8">
            {retryMissed && (
              <button
                onClick={() => startQuiz(hasDifficulty ? "ladder" : "ordered", resultStats.missedQuestions)}
                className="flex items-center gap-2 px-5 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 rounded-lg text-red-300 transition-colors"
              >
                <RotateCcw size={16} />
                Retry Missed ({resultStats.missedQuestions.length})
              </button>
            )}
            {hardQuestions.length > 0 && (
              <button
                onClick={() => startQuiz("ladder", hardQuestions)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg text-amber-300 transition-colors"
              >
                <Layers size={16} />
                Retake L4-L5 only ({hardQuestions.length})
              </button>
            )}
            {retryWeak && (
              <button
                onClick={() => startQuiz(hasDifficulty ? "ladder" : "ordered", weakQuestions)}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-indigo-300 transition-colors"
              >
                <TrendingUp size={16} />
                Retry Weak Areas ({weakQuestions.length})
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Start
            </button>
          </div>

          <div className="space-y-6">
            <ReviewList title="Incorrect Questions" icon={XCircle} questions={resultStats.incorrect} answers={answers} />
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-gray-950 px-4 py-8 text-gray-100">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h1 className="mb-2 text-xl font-semibold">No question loaded</h1>
          <Link to="/" className="text-sm text-indigo-300 hover:text-indigo-200">Return to quiz list</Link>
        </div>
      </main>
    );
  }

  const isCorrect = submitted && selectedOption === currentQuestion.correctIndex;
  const selectedAnswer = answers[currentQuestion.id];
  const isTimedOut = selectedAnswer?.timedOut;
  const isRevealed = selectedAnswer?.revealed;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-medium leading-relaxed mb-6">{currentQuestion.question}</h2>

        <section className="mb-5 space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isAnswer = currentQuestion.correctIndex === index;
            let classes = "border-gray-700 bg-gray-900 hover:border-gray-500";
            if (submitted) {
              if (isAnswer) classes = "border-green-500 bg-green-500/10";
              else if (isSelected) classes = "border-red-500 bg-red-500/10";
              else classes = "border-gray-800 bg-gray-900/60 opacity-70";
            } else if (isSelected) {
              classes = "border-indigo-500 bg-indigo-500/10";
            }

            return (
              <button
                key={`${currentQuestion.id}-${index}`}
                onClick={() => !submitted && setSelectedOption(index)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border ${classes} transition-all duration-200`}
              >
                <div className="flex gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    submitted && isAnswer
                      ? "bg-green-500 text-white"
                      : submitted && isSelected
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-800 text-gray-400"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </div>
                {submitted && isAnswer && (
                  <div className="flex items-center gap-1 mt-2 ml-10 text-green-400 text-xs">
                    <CheckCircle2 size={12} /> Correct
                  </div>
                )}
                {submitted && isSelected && !isAnswer && (
                  <div className="flex items-center gap-1 mt-2 ml-10 text-red-400 text-xs">
                    <XCircle size={12} /> Incorrect
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {!submitted && (
          <section className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => recordCurrentAnswer({ revealed: true })}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg border border-indigo-700/50 text-indigo-200 transition-colors"
              >
                <BookOpen size={14} />
                Reveal answer
              </button>
              <button
                onClick={() => recordCurrentAnswer({ skippedAnswer: true })}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                <SkipForward size={14} />
                Skip
              </button>
              <button
                onClick={() => recordCurrentAnswer()}
                disabled={selectedOption === null}
                className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                  selectedOption !== null
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Submit
                <ChevronRight size={16} />
              </button>
            </div>
          </section>
        )}

        <section className="mt-5 flex flex-wrap gap-2" aria-label="Question tags">
          <span className={`text-xs px-2 py-1 rounded border ${DIFFICULTY_STYLE[currentQuestion.difficulty || "L3"]?.chip || DIFFICULTY_STYLE.L3.chip}`}>
            {DIFFICULTY_STYLE[currentQuestion.difficulty || "L3"]?.label || currentQuestion.difficulty}
          </span>
          <Pill tone="blue">{getPrimaryGroup(currentQuestion)}</Pill>
          {currentQuestion.style && <Pill>{currentQuestion.style}</Pill>}
          {currentQuestion.l5Pattern && <Pill tone="purple">{currentQuestion.l5Pattern}</Pill>}
        </section>

        {submitted && (
          <section className="mt-8 space-y-4">
            <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              isCorrect
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}>
              {isCorrect ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
              {isRevealed ? "Answer revealed" : isTimedOut ? "Timed out" : isCorrect ? "Correct" : "Incorrect"}
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
              {currentQuestion.explanation && (
                <div className="mb-4">
                  <h3 className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm">
                    <BookOpen size={16} />
                    Explanation
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{currentQuestion.explanation}</p>
                </div>
              )}
              {currentQuestion.interviewScript && (
                <div className="mb-4 bg-indigo-950/30 rounded-lg border border-indigo-800/40 p-4">
                  <h3 className="flex items-center gap-2 mb-3 text-indigo-300 font-semibold text-sm">
                    <MessageSquare size={16} />
                    Interview Script
                  </h3>
                  <p className="text-sm text-indigo-200/80 leading-relaxed italic">{currentQuestion.interviewScript}</p>
                </div>
              )}
              {currentQuestion.proTip && (
                <div className="bg-amber-950/20 rounded-lg border border-amber-800/30 p-4">
                  <h3 className="flex items-center gap-2 mb-3 text-amber-400 font-semibold text-sm">
                    <Lightbulb size={16} />
                    Pro Tip
                  </h3>
                  <p className="text-sm text-amber-200/70 leading-relaxed">{currentQuestion.proTip}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => moveToNextQuestion()}
                className="ml-auto flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors"
              >
                {currentIndex === questions.length - 1 ? "See Results" : "Next"}
                <ChevronRight size={16} />
              </button>
            </div>
          </section>
        )}

        <Link
          to="/"
          aria-label="Back to quizzes"
          className="fixed left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 text-gray-400 shadow-lg backdrop-blur hover:border-gray-700 hover:bg-gray-800 hover:text-gray-200"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
