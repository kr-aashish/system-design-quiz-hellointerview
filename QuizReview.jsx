import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import { isNativeInteractiveTarget, useKeyboardShortcuts } from "./keyboardShortcuts";

const DIFFICULTY_STYLE = {
  L1: { label: "L1 Recognition", chip: "bg-green-950/30 border-green-800/40 text-green-300" },
  L2: { label: "L2 Understanding", chip: "bg-blue-950/30 border-blue-800/40 text-blue-300" },
  L3: { label: "L3 Application", chip: "bg-indigo-950/30 border-indigo-800/40 text-indigo-300" },
  L4: { label: "L4 Analysis", chip: "bg-amber-950/30 border-amber-800/40 text-amber-300" },
  L5: { label: "L5 Staff", chip: "bg-red-950/30 border-red-800/40 text-red-300" },
};

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

function formatQuestionContextLabel(label) {
  return String(label).replace(/^[A-Z]\s*[-–—:]\s*/, "");
}

function getQuestionBreadcrumb(question, sectionName) {
  const parts = [
    sectionName,
    getSectionDetailLabel(question),
  ].filter(Boolean).map(formatQuestionContextLabel);

  return orderedUnique(parts);
}

function normalizeContextLabel(label) {
  return formatQuestionContextLabel(label).trim().toLowerCase();
}

function ScreenReaderReview({ group, firstHeadingRef }) {
  if (!group) return null;

  return (
    <div className="sr-only">
      <section key={group.name}>
        <h2 ref={firstHeadingRef} tabIndex={-1}>
          {formatQuestionContextLabel(group.name)}
        </h2>
        {group.questions.map((question) => {
          const correctIndex = getCorrectIndex(question);
          const options = (question.options || []).map(getOptionText);
          const breadcrumbs = getQuestionBreadcrumb(question, group.name);

          return (
            <article key={question.id}>
              {breadcrumbs.length > 0 && (
                <p>{breadcrumbs.join(" to ")}</p>
              )}
              <h3>{question.question}</h3>
              <p>
                Correct answer: {letterFor(correctIndex)}. {options[correctIndex]}
              </p>
              {question.explanation && (
                <p>Explanation: {question.explanation}</p>
              )}
              {question.interviewScript && (
                <p>Interview script: {question.interviewScript}</p>
              )}
              {question.proTip && (
                <p>Pro tip: {question.proTip}</p>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function QuestionCard({ question, sectionName, showAllOptions, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const correctIndex = getCorrectIndex(question);
  const options = (question.options || []).map(getOptionText);
  const visibleOptions = showAllOptions
    ? options.map((text, index) => ({ text, index }))
    : [{ text: options[correctIndex], index: correctIndex }];
  const difficulty = question.difficulty || "L3";
  const diffStyle = DIFFICULTY_STYLE[difficulty] || DIFFICULTY_STYLE.L3;
  const answerId = `q-${question.id}-answer`;
  const topicLabel = getQuestionTopicLabel(question);
  const showTopicTag = normalizeContextLabel(topicLabel) !== normalizeContextLabel(sectionName);

  return (
    <article
      id={`q-${question.id}`}
      tabIndex={-1}
      data-review-question
      className="bg-gray-900 rounded-xl border border-gray-800 p-6 scroll-mt-6 focus:outline-none focus:ring-2 focus:ring-indigo-400/70"
    >
      <button
        type="button"
        tabIndex={-1}
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
            <span className={`text-xs px-2 py-1 rounded border ${diffStyle.chip}`}>
              {diffStyle.label}
            </span>
            {showTopicTag && <Pill tone="blue">{topicLabel}</Pill>}
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

function GroupSection({ group, startNumber, defaultOpen = true, showAllOptions }) {
  const [open, setOpen] = useState(defaultOpen);
  const anchor = `group-${startNumber}`;

  return (
    <section id={anchor} className="scroll-mt-6">
      <button
        type="button"
        tabIndex={-1}
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
          {group.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              sectionName={group.name}
              showAllOptions={showAllOptions}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionPager({ groups, sectionIndex, onSelectSection, onPrevious, onNext }) {
  const currentGroup = groups[sectionIndex];
  const isFirst = sectionIndex <= 0;
  const isLast = sectionIndex >= groups.length - 1;
  const progressPercent = groups.length ? ((sectionIndex + 1) / groups.length) * 100 : 0;

  if (!currentGroup) return null;

  const navButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors";
  const enabledClass = "border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-600 hover:bg-gray-800";
  const disabledClass = "border-gray-900 bg-gray-900/50 text-gray-700";

  return (
    <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/80 p-5 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          tabIndex={-1}
          disabled={isFirst}
          onClick={onPrevious}
          className={`${navButtonClass} ${isFirst ? disabledClass : enabledClass}`}
        >
          <ChevronLeft size={16} />
          Previous Section
        </button>

        <div className="min-w-0 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Section {sectionIndex + 1} of {groups.length}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-gray-100">
            {currentGroup.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {currentGroup.questions.length} {currentGroup.questions.length === 1 ? "question" : "questions"}
          </p>
        </div>

        <button
          type="button"
          tabIndex={-1}
          disabled={isLast}
          onClick={onNext}
          className={`${navButtonClass} ${isLast ? disabledClass : enabledClass}`}
        >
          Next Section
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {groups.map((group, index) => {
          const isActive = index === sectionIndex;
          return (
            <button
              key={group.name}
              type="button"
              tabIndex={-1}
              onClick={() => onSelectSection(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                  : "border-gray-800 bg-gray-950/50 text-gray-500 hover:border-gray-700 hover:text-gray-300"
              }`}
            >
              {group.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function QuizReview({ quiz }) {
  const navigate = useNavigate();
  const questions = quiz.questions || [];
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const firstReviewHeadingRef = useRef(null);

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
          sourceIndex: map.size,
        });
      }

      const group = map.get(name);
      group.questions.push(q);
    }

    const order = new Map((groupOrder || []).map((name, index) => [name, index]));
    return [...map.values()]
      .sort((a, b) => {
        const aIndex = order.has(a.name) ? order.get(a.name) : Number.MAX_SAFE_INTEGER;
        const bIndex = order.has(b.name) ? order.get(b.name) : Number.MAX_SAFE_INTEGER;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.sourceIndex - b.sourceIndex;
      });
  }, [questions, quiz.partsOrder, quiz.categories, quiz.subtopicsOrder]);

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

  const currentGroup = groups[sectionIndex] || null;
  const currentStartNumber = groupStartNumbers[sectionIndex] || 1;

  const goToSection = useCallback((nextIndex) => {
    if (!groups.length) return false;

    const clampedIndex = Math.max(0, Math.min(nextIndex, groups.length - 1));
    if (clampedIndex === sectionIndex) return false;

    setSectionIndex(clampedIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }, [groups.length, sectionIndex]);

  const goToPreviousSection = useCallback(() => {
    return goToSection(sectionIndex - 1);
  }, [goToSection, sectionIndex]);

  const goToNextSection = useCallback(() => {
    return goToSection(sectionIndex + 1);
  }, [goToSection, sectionIndex]);

  useEffect(() => {
    setSectionIndex((currentIndex) => Math.min(currentIndex, Math.max(groups.length - 1, 0)));
  }, [groups.length]);

  useEffect(() => {
    firstReviewHeadingRef.current?.focus({ preventScroll: true });
  }, [quiz.slug, currentGroup?.name]);

  useKeyboardShortcuts([
    { key: "q", handler: (event) => {
      if (isNativeInteractiveTarget(event.target)) return false;
      navigate(`/${quiz.slug}`);
      return true;
    } },
    { key: "]", handler: (event) => {
      if (isNativeInteractiveTarget(event.target)) return false;
      return goToNextSection();
    } },
    { key: "[", handler: (event) => {
      if (isNativeInteractiveTarget(event.target)) return false;
      return goToPreviousSection();
    } },
    { keys: ["backspace", "escape"], handler: () => { navigate("/"); return true; } },
  ], [
    goToNextSection,
    goToPreviousSection,
    navigate,
    quiz.slug,
  ]);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <ScreenReaderReview group={currentGroup} firstHeadingRef={firstReviewHeadingRef} />

      <Link
        to="/"
        aria-hidden="true"
        aria-label="Back to quizzes"
        aria-keyshortcuts="Backspace Escape"
        tabIndex={-1}
        className="fixed left-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 text-gray-400 shadow-lg backdrop-blur hover:border-gray-700 hover:bg-gray-800 hover:text-gray-200"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>

      <div aria-hidden="true" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/${quiz.slug}`}
            aria-keyshortcuts="Q"
            tabIndex={-1}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            <PlayCircle size={16} />
            Retake the Quiz
          </Link>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowAllOptions((value) => !value)}
            aria-pressed={showAllOptions}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800"
          >
            <Eye size={16} />
            {showAllOptions ? "Show Correct Only" : "Reveal All Options"}
          </button>
        </section>

        <SectionPager
          groups={groups}
          sectionIndex={sectionIndex}
          onSelectSection={goToSection}
          onPrevious={goToPreviousSection}
          onNext={goToNextSection}
        />

        <div className="space-y-10">
          {currentGroup && (
            <GroupSection
              key={currentGroup.name}
              group={currentGroup}
              startNumber={currentStartNumber}
              showAllOptions={showAllOptions}
            />
          )}
        </div>
      </div>
    </main>
  );
}
