import { useEffect, useRef, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { useKeyboardShortcuts } from "./keyboardShortcuts";

const SHORTCUT_GROUPS = [
  {
    title: "Global",
    rows: [
      ["?", "Show or hide this panel"],
      ["Tab", "Move through visible buttons and links"],
      ["Enter / Space", "Activate focused controls"],
      ["Backspace", "Go back from quiz and review screens"],
      ["Esc", "Close panels or return to all quizzes"],
    ],
  },
  {
    title: "Index",
    rows: [
      ["J / Down", "Next learning item"],
      ["K / Up", "Previous learning item"],
      ["Home / End", "First or last item"],
      ["Enter", "Take or resume the focused quiz"],
      ["R", "Open focused quiz review"],
      ["A", "Open focused article"],
      ["Delete", "Clear focused quiz progress"],
      ["Shift + Delete", "Clear all progress"],
    ],
  },
  {
    title: "Review",
    rows: [
      ["J / Down", "Next question"],
      ["K / Up", "Previous question"],
      ["Home / End", "First or last question"],
      ["Q", "Take the quiz"],
      ["A", "Open article"],
      ["Backspace / Esc", "Back to all quizzes"],
    ],
  },
  {
    title: "Quiz Start",
    rows: [
      ["L", "Start ladder mode"],
      ["O", "Start section order"],
      ["S", "Start shuffled mode"],
      ["C", "Continue saved attempt"],
      ["Backspace / Esc", "Back to all quizzes"],
    ],
  },
  {
    title: "During Quiz",
    rows: [
      ["A-I / 1-9", "Select an option"],
      ["J / Down", "Move selection down"],
      ["K / Up", "Move selection up"],
      ["Enter / Space", "Submit, then continue"],
      ["R", "Retry the submitted question"],
      ["S", "Skip question"],
      ["V", "Reveal answer"],
      ["Backspace", "Back to quiz start"],
      ["Esc", "Back to all quizzes"],
    ],
  },
  {
    title: "Results",
    rows: [
      ["M", "Retry missed questions"],
      ["R", "Retry focused missed question"],
      ["H", "Retake L4-L5 questions"],
      ["W", "Retry weak areas"],
      ["B / Backspace", "Back to quiz start"],
      ["Esc", "Back to all quizzes"],
    ],
  },
];

function ShortcutKey({ children }) {
  return (
    <kbd className="inline-flex min-w-8 items-center justify-center rounded border border-slate-600 bg-slate-950 px-2 py-1 font-mono text-xs font-semibold text-slate-200 shadow-sm">
      {children}
    </kbd>
  );
}

export default function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    document.body.dataset.shortcutHelpOpen = open ? "true" : "false";
    const appRoutes = document.querySelector("[data-app-routes]");
    if (appRoutes) {
      if (open) {
        appRoutes.setAttribute("aria-hidden", "true");
        appRoutes.inert = true;
      } else {
        appRoutes.removeAttribute("aria-hidden");
        appRoutes.inert = false;
      }
    }

    if (open) {
      window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    }

    return () => {
      document.body.dataset.shortcutHelpOpen = "false";
      if (appRoutes) {
        appRoutes.removeAttribute("aria-hidden");
        appRoutes.inert = false;
      }
    };
  }, [open]);

  useKeyboardShortcuts([
    {
      key: "?",
      allowWhenShortcutHelpOpen: true,
      handler: () => {
        setOpen((value) => !value);
        return true;
      },
    },
    {
      key: "escape",
      allowWhenShortcutHelpOpen: true,
      handler: () => {
        if (!open) return false;
        setOpen(false);
        return true;
      },
    },
  ], [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-help-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <section className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
            <Keyboard size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="shortcut-help-title" className="text-lg font-bold text-slate-100">
              Keyboard Shortcuts
            </h2>
            <p className="text-xs text-slate-500">Press ? again or Esc to close.</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close keyboard shortcuts"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[calc(88vh-5rem)] overflow-y-auto p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {SHORTCUT_GROUPS.map((group) => (
              <section key={group.title} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {group.title}
                </h3>
                <dl className="space-y-2">
                  {group.rows.map(([keys, description]) => (
                    <div key={`${group.title}-${keys}`} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-3">
                      <dt className="flex flex-wrap gap-1">
                        {keys.split(" / ").map((key) => (
                          <ShortcutKey key={key}>{key}</ShortcutKey>
                        ))}
                      </dt>
                      <dd className="text-sm leading-snug text-slate-300">{description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
