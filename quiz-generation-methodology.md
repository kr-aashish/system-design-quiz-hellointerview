# Quiz Generation Methodology — System Design SDE2 Prep

> **Purpose.** This is the standing instruction for generating interactive system-design quizzes from source content (Hello Interview articles, deep-dives, problem breakdowns, etc.). Attach this file together with `principles-of-learning.md` to any new Cowork chat. A fresh agent should follow this pipeline end-to-end without re-deriving it.
>
> **Companion file:** `principles-of-learning.md` — the 16-point quality rubric is defined there. Every question must be checked against it.

---

## 0. Non-negotiable principles (the "constitution")

1. **Test the concept, never the text.** Questions must verify *understanding* of the underlying concept — never *recall* of the source article's wording, taxonomy, list-of-N, or labels. This rule binds at every tier including L1. See Section 0.5 for full treatment with examples. **This is the most important rule in this document.**
2. **Exhaustive coverage.** Every concept, distinction, gotcha, and implication in the source content must be covered by at least one question. Coverage is *enforced*, not aspirational — see Section 4.
3. **Difficulty climbs, never jumps.** Within each Part, the learner sees L1 (warm-up) before L5 (extreme). The learner is never demotivated by the hardest question first.
4. **Hardest realistic SDE2/Senior/Staff questions are included.** No skipping the extremes. L5 questions follow the canon in Section 5.
5. **Store quiz content as JSON only.** There are no per-quiz JSX files. New quizzes must be written under `data/quizzes/<track>/<section>/<article>.json` and referenced from `quiz-state.json` via `quizDataPath`. The path must mirror the article path in `quiz-state.json`; for Low Level Design, the section folder is one of `in-a-hurry`, `concurrency`, or `problem-breakdowns`.
6. **Every question is gradable against the 16-point rubric** in `principles-of-learning.md` Section 9. No exceptions.

---

## 0.5 The Anti-Recall Rule (most important rule — read carefully)

The point of these quizzes is to deepen and verify the learner's *understanding* of the underlying concept. The point is NOT to test whether the learner can recall how the source article happened to organize, name, or list things. Memorizing the article's table of contents is a passive activity — exactly the kind of "re-reading / highlighting / summarizing" that `principles-of-learning.md` warns against.

### Forbidden question patterns

If your question matches any of these, rewrite it.

- **List-recall:** "Which of these is NOT one of the [N things the article lists]?" / "The article names four pillars — pick one."
- **Label-retrieval:** "What does the source call X?" / "Spaghetti design is named under which rubric pillar?"
- **Taxonomy-recall:** "By the article's classification, which category does this fall into?"
- **Numeric-trivia recall:** "How many failure modes does the article list for Solution Design?"
- **Quote-completion:** "The article says: '__________' — fill in the blank."
- Any question that someone could answer correctly by memorizing the article's *structure* without understanding what any of it *means*.

### The replacement principle

Rewrite each forbidden question by following these moves:

1. **Lead with a scenario, not a list.** Describe a real situation in which the concept appears.
2. **Make answer choices describe the concept, not label it.** Instead of "Solution Design," write "ability to structure independent components into a coherent end-to-end architecture." If a label IS the thing being learned (e.g. "CRDT," "consistent hashing"), then the *question* must require recognizing the concept from its substance — never from a recited list.
3. **The correct answer is a judgment, not a retrieval.** The learner must *think about what's happening* in the scenario, not *remember what the article called it*.

### Worked transformations

**❌ Forbidden (label-retrieval):**
> Spaghetti design falls under which pillar?
> A. Problem Navigation  B. Solution Design  C. Technical Excellence  D. Communication

**✅ Conceptual replacement:**
> A candidate's design includes load balancer, cache, sharded DB, message queue, search index, and CDN — all individually justified. But midway through, the interviewer can't trace how a write request flows from the client to durable storage, or where authentication sits in the request path. What is the most accurate description of the candidate's weakness?
> A. They don't know enough technologies — they should add more components.
> B. They didn't gather enough requirements upfront.
> C. **They have correctly chosen components but no clear architectural shape — there is no end-to-end story showing how the pieces interact, and that's a structural failure independent of whether each component is correct.**
> D. They are being too theoretical — they should write code instead of drawing boxes.

The new version tests whether the learner has internalized "what does coherent architecture look like, vs. having the right boxes" — without ever using the label "Solution Design."

**❌ Forbidden (list-recall):**
> Hello Interview groups system design interviews into categories. Which of these is NOT one of them?
> A. Product Design  B. Infrastructure Design  C. Algorithmic Design  D. ML System Design

**✅ Conceptual replacement:**
> You're asked: "Design the class hierarchy and key methods for a chess game. Show me how you'd handle move validation, game state, and undo." This is a different kind of interview from "design a chess matchmaking service for 10 million players." Why?
> A. Both are the same kind of interview — both ask you to design a chess system.
> B. The first is harder because it requires more code.
> C. **The first focuses on internal class structure and design patterns within a single program; the second focuses on how independent services interact at scale. They evaluate different skills — object-oriented design vs distributed system design.**
> D. The first is just a simpler version of the second.

The new version requires the learner to *understand the substantive distinction* between OOD and SD — not to memorize a list of category names.

### The acid test

Before you author any question, ask: **"Could a learner answer this correctly by memorizing the article's structure, without understanding any of the concepts?"** If yes, the question fails the Anti-Recall Rule. Rewrite it.

---

## 0.6 The Hard-Distractors Rule (second-most important rule — read carefully)

A question is only as good as its hardest distractor. If the correct answer is obviously the longest, the most detailed, or the only one that uses precise vocabulary, the learner is pattern-matching on the *shape* of the option — not reasoning about the concept. That defeats the entire purpose of the quiz. **Every wrong option must be plausible enough that a moderately-prepared SDE2 candidate would seriously consider it.**

This rule binds at every tier (L1 through L5) and applies to every MCQ in every quiz, including any retroactive edits to existing quizzes.

### What "extremely difficult to discriminate" means

The three wrong options must each:

1. **Be roughly the same length as the correct option** — within ~15% character count. Never let the correct answer be the visibly-longest one. If the correct answer needs a long explanation, the distractors need comparably long ones (with parallel sentence structure: same number of clauses, same level of qualification, same use of "because"/"so that" subordinations).
2. **Use the same vocabulary register** — same level of precision, same technical terms, same hedge-words ("typically," "generally," "in most cases"). If the correct option says "the system favors availability over consistency under partition," a distractor should not say "it picks A." Both must operate at the same level of formality.
3. **Be substantively wrong, not obviously wrong.** A wrong option should be wrong because of a *subtle conceptual error* — wrong direction of a trade-off, wrong layer in the stack, right mechanism but wrong failure mode it addresses, correct concept but wrong scenario it applies to, an alternative the learner might actually pick if they half-understood the concept. Never make a distractor wrong by being absurd, off-topic, or using a name the learner has clearly never heard of.
4. **Reflect the most common real misconceptions a learner brings to this concept.** Three excellent sources of distractor material: (a) the Anti-Pattern Identification candidates from Section 6, (b) the "wrong answers tempting because…" insights you already write for L5 explanations, and (c) commonly-confused adjacent concepts (e.g. when the answer is *optimistic concurrency*, distractors should reflect *pessimistic locking*, *serializable isolation*, and *snapshot isolation* — not "the database doesn't support this").

### Forbidden distractor patterns

If your distractor matches any of these, rewrite it.

- **Length-tell:** the correct option is noticeably longer/shorter than the others.
- **Vocabulary-tell:** only the correct option uses the precise term; distractors are vague.
- **Confidence-tell:** only the correct option uses hedge-words like "typically" or "in most cases"; distractors make absolute claims (or vice versa).
- **Sentence-structure-tell:** only the correct option has the "because/so that/which means" reasoning structure; distractors are flat assertions.
- **Strawman:** the distractor is so wrong that no SDE2 candidate would pick it (e.g. "Add more components.", "Write more code.", "Hire more engineers.").
- **Off-topic:** the distractor talks about a different layer/system entirely (e.g. correct answer is about cache invalidation, distractor is about TCP retries).
- **Negation-trick:** the distractor is the correct answer with one word flipped to a negation. (Use *substantive inversions* — different mechanism producing a different outcome — not lexical flips.)
- **Implausible attribution:** the distractor blames a cause the learner has no reason to even consider in the scenario.

### Authoring procedure for distractors

After writing the correct option:

1. **Write a one-line "why this is right" gloss** in your scratchpad (not in the file). Identify the *single conceptual move* that makes it correct.
2. **Generate three "near-miss" alternatives** by perturbing that one move:
   - Distractor A: same mechanism, wrong direction of trade-off.
   - Distractor B: adjacent mechanism that solves a *similar but different* problem.
   - Distractor C: the answer a candidate would give who has read about the topic but never applied it (surface-true but missing the operational nuance).
3. **Length-match each distractor to the correct option.** Pad with parallel qualifications ("…, particularly when X holds") or trim, until they are within ~15% characters and have a comparable clause count. Read them out loud — they should *sound the same shape*.
4. **Vocabulary-match.** If the correct option says "linearizability," a distractor should say "serializability" or "sequential consistency" — not "strong consistency stuff." Distractors should be wrong *despite* using precise language.
5. **Run the discrimination check (below).**

### The discrimination check (acid test for options)

Cover the explanation. Read only the question and the four options. Ask:

- **The length test:** could a learner pick the correct answer just by spotting the longest, most detailed, or most-hedged option? If yes, fix the lengths.
- **The vocabulary test:** could a learner pick the correct answer just by spotting the only option that uses the right technical term? If yes, push the term into the distractors too (used in a wrong-but-plausible way).
- **The "would I pick this wrong one?" test:** for each distractor, can you write a one-sentence reason a real SDE2 candidate would seriously consider picking it? If you can't, the distractor is a strawman — rewrite it.
- **The "swap test":** if you rearranged the options so the correct answer were in position A, B, C, or D at random, would the question still be discriminating? (This is also why you should vary `correctIndex` across the file — never let the correct position become predictable.)

### Worked example — making distractors hard

**❌ Weak distractors (length-tell, strawman, off-topic):**
> The candidate's design uses a single Postgres instance for a feature that will see 100K writes/sec at peak. What's the correct critique?
> A. They should add more servers.
> B. They picked the wrong color database.
> C. **A single Postgres node won't sustain 100K writes/sec without partitioning the write load — they need to either shard by a high-cardinality key, move the hot path to an append-only store, or front the writes with a queue that batches into Postgres at a sustainable rate.**
> D. Postgres is bad.

The correct answer is obviously C — it's the only one that's a real engineering response.

**✅ Hard distractors (length-matched, plausible, all in the same vocabulary register):**
> The candidate's design uses a single Postgres instance for a feature that will see 100K writes/sec at peak. What's the correct critique?
> A. A single Postgres node won't sustain 100K writes/sec on commodity hardware — they should switch the storage engine to a write-optimized LSM-tree backend like ScyllaDB and keep the same single-node topology to avoid distributed-systems complexity.
> B. A single Postgres node won't sustain 100K writes/sec under sustained load — they should add a read replica and route the heaviest writes (audit logs, event streams) to the replica to free capacity on the primary.
> C. **A single Postgres node won't sustain 100K writes/sec without partitioning the write load — they need to either shard by a high-cardinality key, move the hot path to an append-only store, or front the writes with a queue that batches into Postgres at a sustainable rate.**
> D. A single Postgres node will sustain 100K writes/sec only if the rows are small and uncontended — the correct fix is to enable synchronous_commit=off and increase wal_buffers, which raises sustained throughput by 5-10× before any topology change is needed.

Each wrong option now reflects a real misconception (A: storage-engine-swap fixes throughput; B: read replicas absorb writes; D: tuning alone scales by an order of magnitude). A learner who has read about Postgres but doesn't deeply understand horizontal scaling could plausibly pick any of them.

### When the correct answer is genuinely short

Some correct answers are inherently terse (e.g. "Use a CRDT.") — that's fine. In those cases, **make the distractors short too**, and rely on conceptual subtlety rather than length parity. The principle is *parity*, not "always make everything long."

---

## 1. The 4-step generation pipeline

### Step 1 — Decompose
Read the source content end-to-end. Identify **Parts** — natural structural divisions, typically 4-10 per article:
- Each paragraph or bullet-block in the source maps to a Part if it introduces new concepts.
- Embedded links and "lock-icon" references count as Parts if the linked concept is mentioned by name.
- Headings in the source = candidate Part boundaries.

Output a Parts list with one-line summaries.

### Step 2 — Concept Inventory
For each Part, write a flat list of every distinct *fact, distinction, implication, common misconception, and "what changes at scale"* point. This is the **exhaustiveness ledger** — the source of truth for what must be covered.

Format per Part:
```
Part C — The Interviewer Rubric
  - C1. Four pillars: Problem Navigation, Solution Design, Technical Excellence, Communication
  - C2. Problem Navigation failure modes (4 named in source)
  - C3. Solution Design failure modes (3 named)
  - C4. Technical Excellence failure modes (4 named)
  - C5. Communication failure modes (3 named)
  - C6. Pillars are common across companies despite different rubric wording
  - C7. Mid-level vs senior expectation difference (basics-only vs basics-fast-then-depth)
  - C8. "Memorized answers" detection — interviewers probe with pushback/doubt
  - ...
```

### Step 3 — Map to the difficulty ladder
Every concept-inventory entry gets at least one question. Then the most important entries get a **full ladder** of questions across L1-L5.

The 5 tiers:

| Tier | Name | Cognitive load | Timer | Examples of style |
|---|---|---|---|---|
| **L1** | Recognition / Warm-up | **Recognize the concept in a clean, low-ambiguity scenario.** Builds confidence by anchoring the concept in a recognizable instance — never by retrieving a label or list from the source. 1 hop. | 60s | "Given this micro-scenario, what kind of skill is being tested?", "Which of these two designs handles X conceptually better, and why?" |
| **L2** | Understanding | **Distinguish the concept from a closely-related one in a brief scenario.** The answer describes *what's happening conceptually*, not what the source labels it. 1-hop with framing. | 90s | "These two interviewer behaviors look similar — which one signals concern about Y rather than Z?" |
| **L3** | SDE2-core | Realistic mid-level scenario, trade-off recognition, 2-hop reasoning. **The meat of an SDE2 interview.** | 90s | "Candidate spent 25/45 min on schema, missed dispatch — which pillar are they failing first?" |
| **L4** | Senior Pushback | Multi-hop across subtopics; anti-pattern detection; interviewer pushback; implementation-specific gotchas. The "wait a minute" question. | 120s | "Interviewer says 'I can't follow your design' — which pillars + what's the fix in next 5 min?" |
| **L5** | Staff / Extreme | Hardest realistic question. Recognizing wrong framing. Adversarial pushback. Numeric estimation. 2 levels of indirection. | 150s | "'Walk me through 100M users' — what trap loses senior signal?" |

### Step 4 — Author
Write each question using the schema in Section 3. Every question must answer:
- What concept does it cover? (matches a concept-inventory ID)
- What tier is it? (L1-L5)
- What style? (matches Section 6 list)
- For L5: which canon pattern from Section 5?

---

## 2. Data Structure (Output)

Each quiz is a single JSON data file. Naming and location follow the article hierarchy:

- High-level/System Design: `data/quizzes/system-design/<section>/<article>.json`
- Low-Level Design: `data/quizzes/low-level-design/<section>/<article>.json`, where `<section>` is the index path segment (`in-a-hurry`, `concurrency`, or `problem-breakdowns`)

Examples:

- `data/quizzes/system-design/core-concepts/caching.json`
- `data/quizzes/system-design/patterns/scaling-reads.json`
- `data/quizzes/low-level-design/in-a-hurry/design-principles.json`

Top-level field: **`coverageManifest`**. It is *the* enforcement mechanism. JSON does not support comments, so never put the manifest in a comment block. Store it as structured JSON:

```json
{
  "coverageManifest": {
    "source": "<article URL or filename>",
    "totalQuestions": 35,
    "parts": [
      {
        "id": "A",
        "name": "What system design interviews are",
        "concepts": [
          {
            "id": "A1",
            "description": "definition of SD interview",
            "questions": ["q1", "q4"]
          },
          {
            "id": "A2",
            "description": "no single right answer",
            "questions": ["q2", "q9"]
          }
        ],
        "ladder": {
          "L1": ["q1", "q2"],
          "L2": ["q3"],
          "L3": ["q4", "q11"],
          "L4": ["q9"],
          "L5": ["q15"]
        }
      }
    ],
    "crossPart": ["q9", "q22"],
    "l5PatternCoverage": {
      "framing-is-wrong": ["q15"],
      "two-levels-of-indirection": ["q22"],
      "adversarial-pushback": ["q28"],
      "trade-off-inversion": ["q31"],
      "implementation-specific-gotcha": ["q33"],
      "estimation-backed-scenario": ["q22"],
      "future-proofing": ["q35"]
    }
  }
}
```

Then store metadata and the `questions` array in **ladder order** (Part A: L1→L5, Part B: L1→L5, …). `partsOrder`, `subtopicsOrder`, and `difficultyTiers` are optional top-level arrays.

The file must be referenced by the matching article in `quiz-state.json` using `quizDataPath`. Do **not** create a JSX component, import it in `App.jsx`, or register it in any `componentsMap`. `App.jsx` renders directly from `quiz-state.json` plus the nested quiz JSON files. For Low Level Design, keep the JSON path aligned with the index URL hierarchy, for example `/learn/low-level-design/concurrency/correctness` maps to `data/quizzes/low-level-design/concurrency/correctness.json`.

---

## 3. Question schema (the only schema we use)

```json
{
  "id": "intro_C_q07",
  "part": "C — Interviewer Rubric",
  "subtopic": "Communication & Collaboration",
  "difficulty": "L4",
  "style": "Interviewer Pushback",
  "conceptIds": ["C5", "C8"],
  "l5Pattern": null,
  "question": "Your interviewer says: 'I see strong tech content but I'm having trouble following your design.' ...",
  "options": [
    "Solution Design + Technical Excellence — add more concrete tech choices.",
    "Communication + Solution Design — pause, redraw the high-level architecture ...",
    "Communication only — speak more slowly and use simpler vocabulary.",
    "Problem Navigation — go back to gathering requirements."
  ],
  "correctIndex": 1,
  "explanation": "...why this is right and the others aren't, with reference to the source content quote...",
  "interviewScript": "In your interview, say: '...'",
  "proTip": "...optional pro tip; null if none..."
}
```

`id` is `<quizSlug>_<partLetter>_q<n>` or another stable unique ID within the quiz JSON. `difficulty` is required for new quizzes: `L1 | L2 | L3 | L4 | L5`. `conceptIds` reference the concept inventory. `l5Pattern` is `null` except for L5 questions, where it must be one of Section 5's pattern names.

**Engine compat note.** The engine reads `subtopic` for grouping in Sequential mode. Keep using it. `part` is additive; Ladder mode sorts by `part` then `difficulty`.

**Distractors are first-class — see Section 0.6.** When writing the `options` array, do not treat the three wrong options as filler. Every distractor must be length-matched (within ~15% character count of the correct option), share its vocabulary register, and reflect a real misconception a moderately-prepared SDE2 candidate could plausibly pick. Run the discrimination check from Section 0.6 on every MCQ before moving on. Also vary `correctIndex` across the file — never let the correct answer's position become predictable.

---

## 4. Exhaustiveness — three forcing functions stacked

1. **Concept Inventory check.** Before authoring any question, the agent produces the full concept inventory (Step 2). If a concept is in the source but not in the inventory, generation is incomplete.
2. **Coverage Manifest mapping.** Every concept-inventory ID must appear in the manifest at least once. If a row has zero question IDs, generation is incomplete.
3. **Cross-Part Bridges.** A minimum of 2 cross-Part questions per quiz. They appear at L4 or L5 and are explicitly tagged in the manifest. They prevent siloed knowledge — interviewers test combined understanding.

The agent must report at the end of generation: **"Coverage check: X concepts × Y questions across L1-L5, all concepts covered, N cross-Part bridges, M L5-pattern slots filled."**

---

## 5. The L5 canon — "hardest question ever asked" patterns

Every L5 question uses one of these 7 patterns. Tag the pattern in the `l5Pattern` field. **Aim to use all 7 patterns at least once per quiz** when the source surface allows.

1. **framing-is-wrong** — The "obvious" answer is technically correct but solving the wrong problem. (E.g. SERIALIZABLE for collaborative editing → real answer is CRDT/OT.) The senior+ move is *stepping out* of the framing.
2. **two-levels-of-indirection** — The surface bottleneck is not the real one. (E.g. "lock duration" looks like the problem but the real problem is *queue depth on a hot row*.)
3. **adversarial-pushback** — "Couldn't you just…?" where the easy alternative has a subtle correctness flaw. (ABA problem, fencing tokens, version-as-business-value.)
4. **trade-off-inversion** — "What if the requirement flips?" Forces switching the chosen pattern. (Saga → 2PC when consistency becomes hard; eventual consistency → strong consistency.)
5. **implementation-specific-gotcha** — Same standard, different vendor. (Postgres vs MySQL REPEATABLE READ; Redis SET vs SET-NX; consumer-group rebalance differences across Kafka clients.)
6. **estimation-backed-scenario** — Numbers force a different recommendation. (5,000 transfers/sec on one hot account; 100M users × 1 read/sec = 100M QPS that breaks the cache layer first.)
7. **future-proofing** — Works today, breaks when feature X is added. ("Use review_count as version — fine until you add delete; use bid amount as version — fine for auctions, breaks for inventory.")

**Authoring rule for L5.** Each L5 question must include in its `explanation` field:
- *Why the wrong answers are tempting* (most candidates pick A or D — explain why).
- *The deeper insight* (one sentence the interviewer is listening for).

---

## 6. Question styles (carry over from existing quizzes)

Reuse these labels for the `style` field — the engine renders them as chips. New styles can be added if the source content motivates it.

- Failure Analysis
- Scenario-Based
- Scenario-Based Trade-offs
- Gotcha/Trap
- Anti-Pattern Identification
- Multi-Hop Reasoning
- Interviewer Pushback
- Implementation-Specific Nuance
- Cross-Subtopic Bridge / Cross-Part Bridge
- Critical Failure Modes
- Estimation-Backed Reasoning

---

## 7. QuizEngine extensions (additive, do not break existing JSON)

Add to the engine when the first new quiz is generated:

1. **`difficulty` chip** rendered on each question card. Color: L1 emerald, L2 cyan, L3 blue, L4 amber, L5 red.
2. **New play mode: "Ladder"** — sorts by `part` (alphabetical by Part letter) then by `difficulty` (L1→L5). Becomes the **default mode** for any quiz that has the `difficulty` field. Quiz JSON that lacks `difficulty` continues to default to Shuffled.
3. **Per-question timer respects difficulty:** L1=60s, L2=90s, L3=90s, L4=120s, L5=150s. Falls back to existing 90s for legacy questions.
4. **Results screen** — adds an "Accuracy by Tier" breakdown (e.g. L1: 4/4, L2: 3/4, L3: 5/6, L4: 2/4, L5: 1/4 → "Drill L4-L5"). Adds a "Coverage map" diagram showing which concept-inventory entries the learner missed.
5. **Resume / retake by tier.** A "Retake L4-L5 only" button on the results screen. This is the spaced-repetition primitive — re-attempt only the hard tier without re-doing the warm-up.

All five extensions must remain **fully backward-compatible** with existing quiz JSON that has no `difficulty` field or optional metadata.

---

## 8. The 16-point quality rubric (link to companion)

Every authored question must pass the rubric in `principles-of-learning.md` Section 9. Highest-priority checks for quizzes specifically:

- **#3 Active Recall** — phrase questions to force recall, never to invite re-reading.
- **#4 Desirable Difficulty** — the question is at the *edge* of the tier's ability, not over the cliff.
- **#5 Visualization** — when applicable, the question references a diagram/architecture mentally.
- **#7 Serial Position** — the most important Part starts and ends the file (L5 questions of high-importance parts at end).
- **#8 Opposites Together** — pair contrasting concepts (SQL vs NoSQL, push vs pull, sync vs async, 2PC vs Saga, optimistic vs pessimistic) within the same question or adjacent questions.
- **#9 Feynman Trigger** — at least one question per Part asks the learner to "explain to a junior" (use it in `interviewScript`).
- **#10 Interleaving** — the file's order is Ladder by default; engine's Shuffled mode interleaves across Parts.
- **#11 Spacing** — `useQuizProgress` should support 1-day / 1-week / 1-month review reminders (existing infrastructure to extend).
- **#12 Hard Start** — the engine's "Hard Start" button starts with a random L4/L5, then re-routes to the ladder. (Optional UX feature.)
- **#15 Anki-suitable atomic facts** — for every L1 question, the question can be exported as a single Anki card.

---

## 9. Worked example — one paragraph → one full ladder

**Source paragraph (from SD-in-a-Hurry Introduction, Part C):**
> "Solution Design. With a problem broken down, your interviewer wants to see how you can solve each of the pieces of the problem. … The most common ways that candidates fail with this competency are: Not having a strong enough understanding of the core concepts to solve the problem. Ignoring scaling and performance considerations. 'Spaghetti design' - a solution that is not well-structured and difficult to understand. Interviewers are on alert for candidates who have simply memorized answers or material. They'll test you by probing your reasoning, doubting your answers, or asking you to explore tradeoffs."

**Concept inventory:**
- C-SD-1: Solution Design = solving each broken-down piece + showing how they fit together.
- C-SD-2: Failure mode — weak core concepts.
- C-SD-3: Failure mode — ignoring scaling/perf.
- C-SD-4: Failure mode — spaghetti design (not well-structured).
- C-SD-5: Interviewers probe to detect memorization (pushback, doubt, trade-off exploration).

**Resulting ladder (5 questions, 1 per tier — every question describes a scenario; none asks for a label-from-the-article):**
- **L1 (recognition):** "Two candidates are evaluated on the same Uber design. Candidate A names every component (LB, cache, queue, sharded DB) but cannot explain how a ride request flows through them. Candidate B names fewer components but walks through the request path end-to-end. Which capability is Candidate A demonstrably weak on?" — Conceptual answer: *organizing chosen components into a coherent end-to-end architecture* (no label retrieval).
- **L2 (understanding):** "An interviewer's complaint 'I can't follow your design' vs 'I'm not sure your tech choices are correct' point at two different weaknesses. Which one is about *architectural structure* rather than *technical knowledge*, and how would you tell?" — The first is structural; tell by whether the interviewer is questioning the *shape* of the design vs the *individual choices*.
- **L3 (SDE2-core):** "A candidate confidently proposes Cassandra for a strongly-consistent read-heavy workload with no further justification. What's actually going wrong here at a conceptual level, and what is the fastest recovery move that doesn't require admitting they were wrong?" — Going wrong: jumping to a technology without first establishing the read/write pattern and consistency requirement. Recovery: explicitly back up, restate the workload's needs, and re-evaluate (which may keep Cassandra or pivot — both are fine, but the *process* is what's signaled).
- **L4 (senior pushback):** "An interviewer says 'are you sure?' three times in a row after your answer about cache invalidation. Two candidates respond differently: Candidate X immediately changes their answer; Candidate Y restates their reasoning and asks the interviewer what specifically concerns them. What is the interviewer most plausibly testing, and which response is correct?" — Testing whether your answer was reasoned vs memorized. Y is correct because it surfaces the actual concern; X reveals the answer was held without confidence.
- **L5 (staff / pattern: framing-is-wrong):** "You've completed a clean design for the stated problem. The interviewer says 'this looks great — now what if 10% of your users are in a different region?' Most candidates immediately reach for a CDN or cross-region replication. Why does that response forfeit senior-level signal even when the technology choice would eventually be correct, and what is the senior+ move?" — The forfeit: a new requirement just landed; jumping to tools skips re-decomposing the problem. Senior+ move: pause, restate what changed (do those users need writes, or read-only? Latency tolerance? Consistency?), THEN pick a tool. The skill being tested is recognizing when the *problem* has changed, not whether you know the tools.

This is one Part of one Concept of one paragraph yielding 5 questions. A medium article (8 Parts) typically produces **30-50 questions**; a long deep-dive can produce **80-120**.

---

## 10. Generation workflow (what the agent does, in order)

Given source content + this methodology + `principles-of-learning.md`:

1. **Read** the source end-to-end. **Read** both methodology files.
2. **Decompose** into Parts. Output the Parts list with one-line summaries. Pause and confirm with the user before proceeding (the Parts list is short and high-leverage to get right).
3. **Concept Inventory** for each Part. Output the full inventory. Pause and confirm.
4. **Author** the QUESTIONS array in ladder order:
   - For every Part: write L1 questions → L2 → L3 → L4 → L5.
   - Tag every question with `id, part, subtopic, difficulty, style, conceptIds, l5Pattern`.
   - For L5 questions: explicitly note which canon pattern is used and why other patterns wouldn't fit.
5. **Build the Coverage Manifest** in the top-level `coverageManifest` field. Verify every concept ID in the inventory has ≥1 question. Verify every L5 pattern slot is filled (where surface allows).
6. **Emit** the JSON file under `data/quizzes/<track>/<section>/<article>.json`. Add or update the matching `quiz-state.json` article with `quizDataPath`. Run `npm run build:quiz-data` to validate the referenced quiz JSON. Do not edit `App.jsx` for per-quiz registration.
7. **Coverage report** to the user: "X concepts × Y questions; ladder coverage per Part; N cross-Part bridges; M/7 L5 patterns used."
8. **Verification step** (mandatory). Re-read the source content; cross-check that no paragraph is unrepresented. Output a "spot-check" listing 3 random source sentences and the question(s) that cover them.

---

## 11. Output checklist (the agent's pre-flight before declaring done)

- [ ] **Anti-Recall acid test passed** (Section 0.5): for every question, confirm a learner could NOT answer it correctly by memorizing only the article's structure. If yes, the question fails and must be rewritten.
- [ ] **Hard-Distractors discrimination check passed** (Section 0.6): for every MCQ, the four options are length-matched (within ~15%), share vocabulary register, and each distractor reflects a real misconception a moderately-prepared SDE2 candidate could plausibly pick. No length-tell, no vocabulary-tell, no strawmen.
- [ ] **`correctIndex` is varied across the file** — the correct answer's position is roughly evenly distributed across 0/1/2/3, never settling into a predictable pattern.
- [ ] All Parts identified and confirmed.
- [ ] Concept Inventory produced and confirmed (no concept missing).
- [ ] Every concept has ≥1 question.
- [ ] Every Part has a complete L1-L5 ladder for its most important concepts.
- [ ] At least 2 cross-Part bridge questions.
- [ ] At least 4 of 7 L5 canon patterns used (all 7 if surface allows).
- [ ] Coverage Manifest in `coverageManifest` is complete and accurate.
- [ ] Each question passes the 16-point rubric in `principles-of-learning.md`.
- [ ] Engine extensions in place (Ladder mode, difficulty chip, per-tier timer, by-tier results).
- [ ] Quiz JSON file exists under `data/quizzes/<track>/<section>/<article>.json`.
- [ ] Matching `quiz-state.json` topic has the correct `quizDataPath`.
- [ ] `npm run build:quiz-data` completed successfully.
- [ ] Spot-check report produced (3 random source sentences → covering question IDs).

---

## 12. What is NOT done in this methodology

- Generating *open-ended* design questions (those go in a separate "design challenges" file — different schema, different engine).
- Generating coding questions.
- Generating questions about content not in the source (no fabrication; if the source doesn't mention Cassandra, no Cassandra question).
- Skipping L5 because the topic is "introductory" — every topic has an L5, even if the L5 has to reach into adjacent topics. (For meta/intro content, L5 typically uses the *trade-off-inversion* or *framing-is-wrong* pattern.)

---

*This methodology pairs with `principles-of-learning.md`. Both files together are the standing instruction for SDE2 system design quiz generation.*
