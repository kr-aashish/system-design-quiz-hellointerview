import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Layers,
  Lightbulb,
  List,
  MessageSquare,
  PlayCircle,
  Target,
} from "lucide-react";
import { useKeyboardShortcuts } from "./keyboardShortcuts";
import { getLatestAttempt, PROGRESS_CHANGED_EVENT } from "./quizProgressStore";

const DIFFICULTY_STYLE = {
  L1: { label: "L1 Recognition", chip: "bg-green-950/30 border-green-800/40 text-green-300" },
  L2: { label: "L2 Understanding", chip: "bg-blue-950/30 border-blue-800/40 text-blue-300" },
  L3: { label: "L3 Application", chip: "bg-indigo-950/30 border-indigo-800/40 text-indigo-300" },
  L4: { label: "L4 Analysis", chip: "bg-amber-950/30 border-amber-800/40 text-amber-300" },
  L5: { label: "L5 Staff", chip: "bg-red-950/30 border-red-800/40 text-red-300" },
};

const TIER_ORDER = ["L1", "L2", "L3", "L4", "L5"];

function getCorrectIndex(q) {
  if (Number.isInteger(q.correctIndex)) return q.correctIndex;
  if (Number.isInteger(q.correct)) return q.correct;
  if (Number.isInteger(q.answerIndex)) return q.answerIndex;
  return 0;
}

function getOptionText(option, idx) {
  if (typeof option === "string") return option;
  if (option && typeof option === "object") {
    return option.text ?? option.label ?? `Option ${idx + 1}`;
  }
  return String(option ?? "");
}

function getQuestionTopicLabel(q) {
  return q.subtopic || q.category || q.part || "General";
}

function getSectionLabel(q) {
  return q.part || q.category || q.subtopic || "General";
}

function getSectionDetailLabel(q) {
  if (q.part) return q.subtopic || q.category || null;
  if (q.category) return q.subtopic || null;
  return null;
}

function orderedUnique(values, preferredOrder = []) {
  const seen = new Set();
  const unique = [];
  for (const value of values) {
    if (value && !seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  }

  const order = new Map((preferredOrder || []).map((value, index) => [value, index]));
  return unique.sort((a, b) => {
    const aIndex = order.has(a) ? order.get(a) : Number.MAX_SAFE_INTEGER;
    const bIndex = order.has(b) ? order.get(b) : Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return 0;
  });
}

function getTierCounts(questions) {
  const counts = {};
  for (const question of questions) {
    const tier = question.difficulty || "L3";
    counts[tier] = (counts[tier] || 0) + 1;
  }

  return TIER_ORDER
    .map((tier) => ({ tier, count: counts[tier] || 0 }))
    .filter((item) => item.count);
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

function letterFor(idx) {
  return String.fromCharCode(65 + idx);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0m";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins <= 0) return `${secs}s`;
  return secs ? `${mins}m ${secs}s` : `${mins}m`;
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function QuestionCard({ question, number, showAllOptions }) {
  const [open, setOpen] = useState(false);
  const correctIndex = getCorrectIndex(question);
  const options = (question.options || []).map(getOptionText);
  const visibleOptions = showAllOptions
    ? options.map((text, index) => ({ text, index }))
    : [{ text: options[correctIndex], index: correctIndex }];
  const difficulty = question.difficulty || "L3";
  const diffStyle = DIFFICULTY_STYLE[difficulty] || DIFFICULTY_STYLE.L3;
  const answerId = `q-${question.id}-answer`;

  return (
    <article
      id={`q-${question.id}`}
      tabIndex={0}
      data-review-question
      className="bg-gray-900 rounded-xl border border-gray-800 p-6 scroll-mt-6 focus:outline-none focus:ring-2 focus:ring-indigo-400/70"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={answerId}
        className="flex w-full items-start gap-3 text-left"
      >
        {open ? (
          <ChevronDown size={18} className="mt-1 shrink-0 text-gray-500" />
        ) : (
          <ChevronRight size={18} className="mt-1 shrink-0 text-gray-500" />
        )}
        <div className="min-w-0 flex-1">
          <header className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-gray-800 px-2 text-xs font-bold text-gray-400">
              #{number}
            </span>
            <span className={`text-xs px-2 py-1 rounded border ${diffStyle.chip}`}>
              {diffStyle.label}
            </span>
            <Pill tone="blue">{getQuestionTopicLabel(question)}</Pill>
            {question.style && <Pill>{question.style}</Pill>}
            {question.l5Pattern && <Pill tone="purple">{question.l5Pattern}</Pill>}
            <span className="ml-auto text-[11px] uppercase tracking-wider text-gray-600">
              {question.id}
            </span>
          </header>
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 leading-snug">
            {question.question}
          </h3>
        </div>
      </button>

      {open && (
        <div id={answerId} className="mt-5">
          <ul className="space-y-2 mb-6">
            {visibleOptions.map(({ text, index }) => {
              const isCorrect = index === correctIndex;
              return (
                <li
                  key={index}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed transition-colors ${
                    isCorrect
                      ? "border-green-500/40 bg-green-500/10 text-green-100"
                      : "border-gray-800 bg-gray-950/50 text-gray-400"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCorrect
                        ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/40"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {letterFor(index)}
                  </span>
                  <span className="flex-1">{text}</span>
                  {isCorrect && (
                    <CheckCircle2 size={18} className="shrink-0 text-green-400" />
                  )}
                </li>
              );
            })}
          </ul>

          {question.explanation && (
            <div className="mb-3 rounded-lg border border-blue-800/40 bg-blue-950/20 p-4">
              <h4 className="flex items-center gap-2 mb-2 text-blue-300 font-semibold text-sm">
                <BookOpen size={15} />
                Explanation
              </h4>
              <p className="text-sm text-blue-100/80 leading-relaxed whitespace-pre-line">
                {question.explanation}
              </p>
            </div>
          )}

          {question.interviewScript && (
            <div className="mb-3 rounded-lg border border-indigo-800/40 bg-indigo-950/30 p-4">
              <h4 className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-sm">
                <MessageSquare size={15} />
                Interview Script
              </h4>
              <p className="text-sm text-indigo-200/80 leading-relaxed italic whitespace-pre-line">
                {question.interviewScript}
              </p>
            </div>
          )}

          {question.proTip && (
            <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-4">
              <h4 className="flex items-center gap-2 mb-2 text-amber-300 font-semibold text-sm">
                <Lightbulb size={15} />
                Pro Tip
              </h4>
              <p className="text-sm text-amber-200/80 leading-relaxed whitespace-pre-line">
                {question.proTip}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function GroupSection({ group, startNumber, defaultOpen = false, showAllOptions }) {
  const [open, setOpen] = useState(defaultOpen);
  const anchor = `group-${slugify(group.name)}`;
  const endNumber = startNumber + group.questions.length - 1;

  return (
    <section id={anchor} className="scroll-mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${anchor}-questions`}
        className="group flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 text-left transition-colors hover:bg-gray-900"
      >
        {open ? (
          <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300" />
        ) : (
          <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300" />
        )}
        <h2 className="flex-1 text-base font-semibold text-gray-100">{group.name}</h2>
        <span className="text-xs text-gray-500">
          {group.questions.length} {group.questions.length === 1 ? "question" : "questions"}
        </span>
      </button>

      {open && (
        <div id={`${anchor}-questions`} className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Section Details
              </span>
              <span className="rounded border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-gray-400">
                Questions #{startNumber}-{endNumber}
              </span>
              {group.details.length > 0 && (
                <span className="rounded border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-gray-400">
                  {group.details.length} {group.details.length === 1 ? "topic" : "topics"}
                </span>
              )}
              {group.tierCounts.map(({ tier, count }) => {
                const style = DIFFICULTY_STYLE[tier] || DIFFICULTY_STYLE.L3;
                return (
                  <span key={tier} className={`rounded border px-2 py-1 text-xs ${style.chip}`}>
                    {tier} · {count}
                  </span>
                );
              })}
            </div>

            {group.details.length > 0 && (
              <ol className="grid gap-2 sm:grid-cols-2">
                {group.details.map((detail, index) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2 rounded-md border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-gray-300"
                  >
                    <span className="mt-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-gray-800 px-1 text-[11px] font-bold text-gray-500">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {group.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              number={startNumber + i}
              showAllOptions={showAllOptions}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function QuizReview({ quiz }) {
  const navigate = useNavigate();
  const questions = quiz.questions || [];
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState(() => getLatestAttempt(quiz.slug));
  const hasDifficulty = questions.some((question) => question.difficulty);

  useEffect(() => {
    const refreshAttempt = () => setLatestAttempt(getLatestAttempt(quiz.slug));
    window.addEventListener(PROGRESS_CHANGED_EVENT, refreshAttempt);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refreshAttempt);
  }, [quiz.slug]);

  const groups = useMemo(() => {
    const map = new Map();
    const hasParts = questions.some((question) => question.part);
    const hasCategories = questions.some((question) => question.category);
    const groupOrder = hasParts
      ? quiz.partsOrder
      : hasCategories
        ? quiz.categories
        : quiz.subtopicsOrder;

    for (const q of questions) {
      const name = getSectionLabel(q);
      if (!map.has(name)) {
        map.set(name, {
          name,
          questions: [],
          details: [],
          sourceIndex: map.size,
        });
      }

      const group = map.get(name);
      group.questions.push(q);

      const detail = getSectionDetailLabel(q);
      if (detail) group.details.push(detail);
    }

    const order = new Map((groupOrder || []).map((name, index) => [name, index]));
    return [...map.values()]
      .sort((a, b) => {
        const aIndex = order.has(a.name) ? order.get(a.name) : Number.MAX_SAFE_INTEGER;
        const bIndex = order.has(b.name) ? order.get(b.name) : Number.MAX_SAFE_INTEGER;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.sourceIndex - b.sourceIndex;
      })
      .map((group) => ({
        ...group,
        details: orderedUnique(group.details, quiz.subtopicsOrder),
        tierCounts: getTierCounts(group.questions),
      }));
  }, [questions, quiz.partsOrder, quiz.categories, quiz.subtopicsOrder]);

  const tierCounts = useMemo(() => {
    return getTierCounts(questions);
  }, [questions]);

  const latestResult = useMemo(() => {
    if (!latestAttempt?.completedAt) return null;
    const results = Object.values(latestAttempt.questionResults || {});
    const correct = latestAttempt.score?.correct ?? results.filter((result) => result.isCorrect).length;
    const total = latestAttempt.score?.total || questions.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;

    return {
      correct,
      total,
      pct,
      missed: results.filter((result) => !result.isCorrect).length,
      skipped: results.filter((result) => result.skipped).length,
      totalTimeSeconds: latestAttempt.totalTimeSeconds || 0,
    };
  }, [latestAttempt, questions.length]);

  // Pre-compute starting question number for each group so numbering is global.
  const groupStartNumbers = useMemo(() => {
    const result = [];
    let running = 1;
    for (const g of groups) {
      result.push(running);
      running += g.questions.length;
    }
    return result;
  }, [groups]);

  const getReviewQuestions = useCallback(() => {
    return Array.from(document.querySelectorAll("[data-review-question]"))
      .filter((card) => card.offsetParent !== null);
  }, []);

  const focusReviewQuestion = useCallback((direction) => {
    const cards = getReviewQuestions();
    if (!cards.length) return false;

    const activeCard = document.activeElement?.closest?.("[data-review-question]");
    const activeIndex = activeCard ? cards.indexOf(activeCard) : -1;
    let nextIndex = direction > 0 ? activeIndex + 1 : activeIndex - 1;

    if (activeIndex === -1) {
      nextIndex = direction > 0 ? 0 : cards.length - 1;
    }

    nextIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
    cards[nextIndex].focus();
    cards[nextIndex].scrollIntoView({ block: "start", behavior: "smooth" });
    return true;
  }, [getReviewQuestions]);

  const focusReviewEdge = useCallback((edge) => {
    const cards = getReviewQuestions();
    if (!cards.length) return false;
    const card = edge === "end" ? cards[cards.length - 1] : cards[0];
    card.focus();
    card.scrollIntoView({ block: "start", behavior: "smooth" });
    return true;
  }, [getReviewQuestions]);

  const openArticle = useCallback(() => {
    if (!quiz.path) return false;
    window.open(`https://www.hellointerview.com${quiz.path}`, "_blank", "noopener,noreferrer");
    return true;
  }, [quiz.path]);

  useKeyboardShortcuts([
    { keys: ["arrowdown", "j"], handler: () => focusReviewQuestion(1) },
    { keys: ["arrowup", "k"], handler: () => focusReviewQuestion(-1) },
    { key: "home", handler: () => focusReviewEdge("start") },
    { key: "end", handler: () => focusReviewEdge("end") },
    { key: "q", handler: () => { navigate(`/${quiz.slug}`); return true; } },
    { key: "a", handler: openArticle },
    { keys: ["backspace", "escape"], handler: () => { navigate("/"); return true; } },
  ], [
    focusReviewEdge,
    focusReviewQuestion,
    navigate,
    openArticle,
    quiz.slug,
  ]);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Link
        to="/"
        aria-label="Back to quizzes"
        aria-keyshortcuts="Backspace Escape"
        className="fixed left-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 text-gray-400 shadow-lg backdrop-blur hover:border-gray-700 hover:bg-gray-800 hover:text-gray-200"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 px-3 py-1 rounded-full text-sm mb-4">
            <Layers size={14} />
            {quiz.category} · {quiz.name} {hasDifficulty ? "· L1 -> L5 Ladder" : ""}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{quiz.title}</h1>
          {quiz.difficultyLabel && (
            <p className="text-gray-400 text-base sm:text-lg mb-2">{quiz.difficultyLabel}</p>
          )}
          {quiz.description && (
            <p className="mx-auto max-w-3xl text-sm text-gray-500 leading-relaxed">
              {quiz.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <StatChip icon={BookOpen}>{questions.length} questions</StatChip>
            <StatChip icon={Target}>{groups.length} coverage areas</StatChip>
            {quiz.estimatedTime && <StatChip icon={List}>{quiz.estimatedTime}</StatChip>}
          </div>
        </header>

        <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
            Coverage Breakdown
          </h2>
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.name}>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                  {group.name} ({group.questions.length} {group.questions.length === 1 ? "question" : "questions"})
                </div>
                {group.details.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {group.details.map((detail) => (
                      <span
                        key={`${group.name}-${detail}`}
                        className="rounded border border-indigo-800/40 bg-indigo-950/30 px-2 py-1 text-xs text-indigo-300"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {tierCounts.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Difficulty Ladder
            </h2>
            <div className="flex flex-wrap gap-2">
              {tierCounts.map(({ tier, count }) => {
                const s = DIFFICULTY_STYLE[tier] || DIFFICULTY_STYLE.L3;
                return (
                  <span key={tier} className={`text-xs px-2 py-1 rounded border ${s.chip}`}>
                    {s.label} · {count}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {latestResult && (
          <section className="mb-6 rounded-xl border border-emerald-800/40 bg-emerald-950/10 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-300">
              <Award size={16} />
              Latest Result
            </h2>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3">
                <div className="text-xs text-gray-500">Score</div>
                <div className="mt-1 text-2xl font-bold text-emerald-300">{latestResult.pct}%</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3">
                <div className="text-xs text-gray-500">Correct</div>
                <div className="mt-1 text-2xl font-bold text-gray-100">{latestResult.correct}/{latestResult.total}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3">
                <div className="text-xs text-gray-500">Missed</div>
                <div className="mt-1 text-2xl font-bold text-amber-300">{latestResult.missed}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3">
                <div className="text-xs text-gray-500">Time</div>
                <div className="mt-1 text-2xl font-bold text-gray-100">{formatTime(latestResult.totalTimeSeconds)}</div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/${quiz.slug}`}
              aria-keyshortcuts="Q"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <PlayCircle size={16} />
              Take the Quiz
            </Link>
            {latestResult && (
              <Link
                to={`/${quiz.slug}/results`}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-800/40 bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-950/50"
              >
                <Award size={16} />
                Review Result
              </Link>
            )}
            {quiz.path && (
              <a
                href={`https://www.hellointerview.com${quiz.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800"
                aria-keyshortcuts="A"
              >
                <BookOpen size={16} />
                Read Article
              </a>
            )}
            <button
              type="button"
              onClick={() => setShowAllOptions((value) => !value)}
              aria-pressed={showAllOptions}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800"
            >
              <Eye size={16} />
              {showAllOptions ? "Show Correct Only" : "Reveal All Options"}
            </button>
        </section>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <List size={14} />
                Sections
              </h2>
              <nav className="space-y-1">
                {groups.map((g) => (
                  <a
                    key={g.name}
                    href={`#group-${slugify(g.name)}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100"
                  >
                    <span className="truncate">{g.name}</span>
                    <span className="ml-3 shrink-0 text-xs text-gray-600">
                      {g.questions.length}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-10">
            {groups.map((g, idx) => (
              <GroupSection
                key={g.name}
                group={g}
                startNumber={groupStartNumbers[idx]}
                showAllOptions={showAllOptions}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
