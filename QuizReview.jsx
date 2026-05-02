import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  Lightbulb,
  List,
  MessageSquare,
  PlayCircle,
  Target,
} from "lucide-react";

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

function getGroupLabel(q) {
  return q.subtopic || q.category || q.part || "General";
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

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function QuestionCard({ question, number }) {
  const correctIndex = getCorrectIndex(question);
  const options = (question.options || []).map(getOptionText);
  const difficulty = question.difficulty || "L3";
  const diffStyle = DIFFICULTY_STYLE[difficulty] || DIFFICULTY_STYLE.L3;

  return (
    <article
      id={`q-${question.id}`}
      className="bg-gray-900 rounded-xl border border-gray-800 p-6 scroll-mt-6"
    >
      <header className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-gray-800 px-2 text-xs font-bold text-gray-400">
          #{number}
        </span>
        <span className={`text-xs px-2 py-1 rounded border ${diffStyle.chip}`}>
          {diffStyle.label}
        </span>
        <Pill tone="blue">{getGroupLabel(question)}</Pill>
        {question.style && <Pill>{question.style}</Pill>}
        {question.l5Pattern && <Pill tone="purple">{question.l5Pattern}</Pill>}
        <span className="ml-auto text-[11px] uppercase tracking-wider text-gray-600">
          {question.id}
        </span>
      </header>

      <h3 className="text-base sm:text-lg font-semibold text-gray-100 leading-snug mb-5">
        {question.question}
      </h3>

      <ul className="space-y-2 mb-6">
        {options.map((opt, idx) => {
          const isCorrect = idx === correctIndex;
          return (
            <li
              key={idx}
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
                {letterFor(idx)}
              </span>
              <span className="flex-1">{opt}</span>
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
    </article>
  );
}

function GroupSection({ group, startNumber, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const anchor = `group-${slugify(group.name)}`;

  return (
    <section id={anchor} className="scroll-mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
        <div className="mt-4 space-y-4">
          {group.questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} number={startNumber + i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function QuizReview({ quiz }) {
  const questions = quiz.questions || [];

  const groups = useMemo(() => {
    const map = new Map();
    for (const q of questions) {
      const name = getGroupLabel(q);
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(q);
    }
    return [...map.entries()].map(([name, qs]) => ({ name, questions: qs }));
  }, [questions]);

  const tierCounts = useMemo(() => {
    const counts = {};
    for (const q of questions) {
      const t = q.difficulty || "L3";
      counts[t] = (counts[t] || 0) + 1;
    }
    return TIER_ORDER.map((t) => ({ tier: t, count: counts[t] || 0 })).filter((r) => r.count);
  }, [questions]);

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

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Link
        to="/"
        aria-label="Back to quizzes"
        className="fixed left-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 text-gray-400 shadow-lg backdrop-blur hover:border-gray-700 hover:bg-gray-800 hover:text-gray-200"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 px-3 py-1 rounded-full text-sm mb-4">
            <Layers size={14} />
            {quiz.category} · {quiz.name} · Revision
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
            <StatChip icon={Target}>{groups.length} sections</StatChip>
            {quiz.estimatedTime && <StatChip icon={List}>{quiz.estimatedTime}</StatChip>}
          </div>

          {tierCounts.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {tierCounts.map(({ tier, count }) => {
                const s = DIFFICULTY_STYLE[tier];
                return (
                  <span
                    key={tier}
                    className={`text-xs px-2.5 py-1 rounded border ${s.chip}`}
                  >
                    {s.label} · {count}
                  </span>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to={`/${quiz.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <PlayCircle size={16} />
              Take the Quiz
            </Link>
            {quiz.path && (
              <a
                href={`https://www.hellointerview.com${quiz.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800"
              >
                <BookOpen size={16} />
                Read Article
              </a>
            )}
          </div>
        </header>

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
                defaultOpen
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
