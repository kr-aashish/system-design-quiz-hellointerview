# System Design Quiz Project — Standing Instructions

This project contains interactive system design quizzes used for SDE2 / Senior interview prep at Hello Interview content. The user (Aashish) studies a piece of content end-to-end, then uses the matching quiz to verify *conceptual understanding* — not source-text recall.

---

## How to generate a new quiz (the only workflow this project is for)

When the user pastes source content with any of these phrases, run the full quiz-generation pipeline:

- **"Generate a quiz from this content: [paste]"**
- **"Make a quiz from this: [paste]"**
- **"Build the quiz for this article: [paste]"**
- Or any minor variation. If the user pastes a long block of educational content into a fresh session in this project, default-assume they want a quiz unless they say otherwise.

### Mandatory reads before authoring (in this order)

1. **`quiz-generation-methodology.md`** — the full pipeline, the 5-tier difficulty ladder (L1 recognition → L5 staff/extreme), question schema, coverage manifest format, the L5 canon of 7 hardest-question patterns, engine extensions, and the pre-flight checklist.
2. **`principles-of-learning.md`** — the 16-point quality rubric. Every question is graded against it.

Both files are in this directory.

### Non-negotiable rules (these come from the methodology — repeated here for emphasis)

1. **Anti-Recall Rule (most important).** Never test the user's recall of how the source text is structured, named, listed, or worded. Every question must test *conceptual understanding* via a scenario. If a learner could answer correctly by memorizing only the article's table of contents, the question fails. See Section 0.5 of the methodology file for forbidden patterns and worked transformations.
2. **Exhaustive coverage.** Every concept in the source must be covered by at least one question. The Coverage Manifest in the output quiz JSON (`coverageManifest`) is the enforcement mechanism.
3. **Difficulty climbs, never jumps.** Within each Part: L1 → L2 → L3 → L4 → L5. The learner is never demotivated by hitting the hardest question first.
4. **L5 questions are mandatory.** Use the 7-pattern canon in methodology Section 5. Aim for ≥4 of the 7 patterns per quiz, all 7 if surface allows.

### The pipeline (summarized — full version in methodology Section 1 and Section 10)

1. Decompose the content into **Parts** (typically 4-10).
2. Produce the **Concept Inventory** for each Part (every distinct fact, distinction, implication, gotcha).
3. **Pause and confirm** the Parts list and Concept Inventory with the user before authoring questions. (This catches scoping errors cheaply.)
4. Author questions in **ladder order**: Part A L1→L5, Part B L1→L5, etc.
5. Build the **Coverage Manifest** at the top of the output file. Verify every concept ID has ≥1 question.
6. Emit the quiz as a JSON data file under **`data/quizzes/<track>/<section>/<article>.json`**. Do **not** create a per-quiz JSX file.
7. Add or update the matching topic in **`quiz-state.json`** with `quizDataPath`. Do **not** register anything in `App.jsx`; routes and index UI are generated from the JSON database.
8. Run the **pre-flight checklist** (methodology Section 11) — including the Anti-Recall acid test on every question.
9. Report to the user: coverage stats, L5-pattern usage, 3 random spot-checks (source sentence → covering question IDs).

### Engine extensions (apply once, then reuse)

The shared `QuizEngine.jsx` supports `difficulty` chip rendering, a "Ladder" play mode, per-tier timers (60/90/90/120/150s), and an "Accuracy by Tier" results breakdown. Engine extensions must be **backward-compatible** with existing quiz JSON data that lacks optional fields. Methodology Section 7 has details.

---

## Project layout (already in place)

- `QuizEngine.jsx` — shared quiz UI runtime for every quiz.
- `App.jsx` — router and index UI; it renders from `quiz-state.json` and the nested quiz JSON files, not from per-quiz components or a generated aggregate database.
- `quiz-state.json` — source article catalog with category, slug, status, and `quizDataPath`.
- `data/quizzes/<track>/<section>/<article>.json` — source-of-truth quiz content files.
- `quizProgressStore.js`, `useQuizProgress.js` — localStorage-backed progress
- `quiz-generation-methodology.md` — **read this for every quiz**
- `principles-of-learning.md` — **read this for every quiz**

---

## What NOT to do

- Don't author questions that test article-text recall ("which of these is NOT one of the four pillars listed").
- Don't skip the Concept Inventory step or jump straight to writing questions.
- Don't omit L5 questions because the topic is "introductory" — every topic gets the full ladder, even if L5 has to lean on adjacent topics or use the *trade-off-inversion* / *framing-is-wrong* canon patterns.
- Don't fabricate concepts not in the source. No question may rest on content the article doesn't cover.
- Don't create `*-quiz.jsx` files or register quiz components manually. Quiz content belongs in JSON only.
- Don't break backward compatibility with existing quiz JSON when extending `QuizEngine.jsx`.
