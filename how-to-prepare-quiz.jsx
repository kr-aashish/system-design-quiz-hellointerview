// === COVERAGE MANIFEST ===
// Source: hellointerview.com/learn/system-design/in-a-hurry/how-to-prepare
// Total questions: 8 across 1 part (single-Part file: cross-Part bridges N/A by structure)
//
// PART A — Prep Foundation & Practice Loop
//   A1 (two-stage learning: foundation then practice): q2 (L2), q7 (L5), q8 (L5)
//   A2 (foundation = 3 ingredients):                   q2 (L2), q5 (L3)
//   A3 (framework's role: linear roadmap):             q3 (L2)
//   A4 (build mental model from basics first):         q2 (L2), q7 (L5)
//   A5 (active practice ~10x retention):               q1 (L1), q7 (L5)
//   A6 (practice loop ordering: pick→reqs→solo→key→mock): q4 (L3), q6 (L4), q8 (L5)
//   A7 ("only after attempt" matters):                 q4 (L3)
//   A8 (mock interview is the final test):             q6 (L4)
//   Ladder: L1[q1] L2[q2,q3] L3[q4,q5] L4[q6] L5[q7,q8]
//
// L5 PATTERN COVERAGE (this file: 2/7; combined with delivery-framework-quiz: 6/7):
//   - framing-is-wrong: q7 (heavy reading, zero practice → recognition vs production)
//   - trade-off-inversion: q8 (constraint flip: 3 weeks left → which steps are load-bearing)
//
// CROSS-PART BRIDGES: N/A (single-Part file; bridges live in delivery-framework-quiz.jsx)
// Anti-pattern questions: q4 (read answer key first), q5 (framework-shopping)
// Interviewer-pushback questions: q6
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Active Practice vs Passive Consumption",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "A5"
    ],
    "l5Pattern": null,
    "question": "Two engineers prepare for a system design interview. Engineer X watches 4 hours of mock-interview videos every weekday for two weeks, taking detailed notes. Engineer Y picks one design question per day, attempts it on a whiteboard alone for 45 minutes, then compares their attempt to a written answer key — also for two weeks. Which engineer is more likely to recall and apply system design concepts under interview pressure, and why?",
    "options": [
      "Engineer X — the volume of expert content viewed is higher, so more concepts have been encoded. The note-taking provides a written record they can review the morning of the interview.",
      "Engineer Y — generating an answer (even imperfectly) before checking it forces the brain to commit to a structure, surface gaps, and integrate the correction. Watching expert reasoning is like watching someone exercise; doing the design yourself is the actual workout.",
      "The two are roughly equivalent — the brain learns from any deliberate exposure to the material, regardless of whether it's input-heavy (X) or output-heavy (Y).",
      "Engineer X — videos provide visual + audio multimodal encoding, which is far stronger than the single-channel encoding produced by drawing on a whiteboard."
    ],
    "correctIndex": 1,
    "explanation": "Active production (attempting the design from a blank page) creates retrieval-strength encoding that watching cannot match. When the brain has to structure an answer with no scaffolding, every gap it surfaces becomes a hook for the corrected information. Engineer X is doing recognition, which feels productive but rarely transfers to performance under pressure. Note-taking from videos is one of the explicitly weakest study modalities — re-reading notes is passive review, not retrieval.",
    "interviewScript": null,
    "proTip": "If you have limited time, spend it producing answers, not consuming them. One question attempted alone teaches more than three watched."
  },
  {
    "id": "q2",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Foundation Stage",
    "difficulty": "L2",
    "style": "Scenario-Based",
    "conceptIds": [
      "A1",
      "A2",
      "A4"
    ],
    "l5Pattern": null,
    "question": "A candidate skips reading any introductory system-design material and goes straight to attempting full design questions on day one. After three attempts, they report they 'didn't know what the interviewer was asking about' — terms like load balancer, cache, write-through were thrown around with no anchoring concept. What did the candidate skip that would have prevented this, and what specifically does that step buy you?",
    "options": [
      "They skipped the practice loop entirely — they should re-attempt the same three questions until each becomes muscle memory.",
      "They skipped foundational reading on the basics. The role of foundation reading is not to learn the material deeply; it is to build a mental skeleton — a vocabulary and rough mental map — so that when concepts appear during practice, they have somewhere to attach. Without the skeleton, every term feels like a new word in a foreign language.",
      "They skipped choosing a delivery framework, so without a structure their attempts felt chaotic.",
      "They skipped the mock interview step. Mock interviews are where the basics get learned through exposure to a real interviewer."
    ],
    "correctIndex": 1,
    "explanation": "The prep model is two-stage: build foundation, then practice. The foundation isn't about depth — it's about giving you a place to *attach* new information when you encounter it during practice. Skipping it means every term you encounter is unmoored. Re-attempting the same questions (A) just reinforces a foundation-less approach. Framework choice (C) helps with sequencing but not vocabulary. Mock interviews (D) come at the end of the practice loop, not as a substitute for the foundation step.",
    "interviewScript": null,
    "proTip": "Skim the foundation high-level — don't try to memorize. The point is to build hooks for later, not to know the material yet."
  },
  {
    "id": "q3",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Why a Delivery Framework",
    "difficulty": "L2",
    "style": "Scenario-Based",
    "conceptIds": [
      "A3"
    ],
    "l5Pattern": null,
    "question": "An interviewer asks the same question to two candidates in 45-minute interviews. Candidate A keeps a written sequence on the side of the whiteboard ('Reqs → Entities → API → HLD → Deep Dives') and visibly checks where they are every few minutes. Candidate B works 'intuitively' and lets the design unfold organically based on what feels interesting. At minute 30, Candidate A is in deep dives; Candidate B is still iterating on the data model. Which candidate's behavior reflects the case for using a delivery framework, and what does the framework specifically prevent?",
    "options": [
      "Candidate B — organic exploration produces better designs because it follows the natural shape of the problem. Frameworks impose artificial structure that wastes time.",
      "Candidate A — the framework provides a linear roadmap that prevents scope creep. Without it, an interesting sub-problem can absorb 25 minutes that should have been distributed across requirements, design, and deep dives. The framework isn't about making the design 'better' — it's about ensuring you finish.",
      "Candidate A — the framework makes the design more impressive because it shows you've read books about system design.",
      "Both reflect the case for a framework equally — A uses an explicit framework, B uses an implicit one."
    ],
    "correctIndex": 1,
    "explanation": "Failure to deliver a working system is the #1 failure mode for mid-level candidates, and a framework prevents this by forcing linear progression. The data model is exactly the kind of detail that can absorb a candidate's full attention if there's no roadmap to nudge them forward. The framework doesn't make the design more elegant — it makes sure the candidate reaches deep dives. (A) inverts the actual point. (D) is wrong because 'implicit structure' usually means no structure when nervous — the value of an explicit framework is that you can fall back to it under stress.",
    "interviewScript": "In your interview, write your framework steps on the corner of the whiteboard. Glance at them every few minutes — it acts as a nudge back when you start drifting into a sub-problem.",
    "proTip": null
  },
  {
    "id": "q4",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Practice Loop Ordering",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "A6",
      "A7"
    ],
    "l5Pattern": null,
    "question": "A candidate reports their prep cycle: 'I pick a question, immediately read the answer key carefully (15 minutes), then I attempt the design myself for 30 minutes, then I re-read the answer key to compare.' After two weeks they feel they're 'learning the material' but they bomb their first mock interview. What is the specific cognitive failure their cycle creates, and what is the corrected ordering?",
    "options": [
      "They read the answer key too quickly. They should spend 30 minutes reading the answer key and only 15 minutes attempting the design.",
      "Reading the answer key BEFORE attempting eliminates the productive struggle. When they 'attempt' the design after reading, they are pattern-matching against the answer they just memorized — which feels like understanding but is actually recognition. The corrected ordering is: attempt FIRST (struggle through it), THEN read the answer key. The struggle is what creates the gaps the answer key needs to fill.",
      "The candidate isn't doing enough mock interviews. The cycle is fine; mocks would have caught any gaps.",
      "They should skip the re-read step entirely. Reading the answer key once is sufficient."
    ],
    "correctIndex": 1,
    "explanation": "The practice loop is: try to answer on your own → only then read the answer key. The order matters because reading the answer first turns the 'attempt' into a recall exercise — and recall feels easier than generation, even when it isn't. The candidate is mistaking 'I can follow this answer' for 'I could have produced this answer.' Mock interviews expose the gap, but the cycle itself was already broken. Self-evaluating against an answer you've just read is one of the most common ways to feel productive while learning very little.",
    "interviewScript": null,
    "proTip": "Force yourself to write down a complete (even bad) answer before opening the answer key. Even a 30%-correct attempt creates the encoding that lets the answer key actually teach you something."
  },
  {
    "id": "q5",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Foundation: Framework Selection",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "A2"
    ],
    "l5Pattern": null,
    "question": "A candidate has spent a week reading five different 'delivery framework' articles, taking notes on each, and is now drafting a comparison table to 'pick the best framework before starting practice.' They have not yet attempted a single design question. What is the most accurate description of what's happening here, and what should the candidate do?",
    "options": [
      "This is good preparation — picking the right framework is high-leverage, and an extra week comparing options will pay off in every future practice attempt.",
      "The candidate is in framework-procrastination — comparing frameworks feels productive but is a sophisticated form of avoiding the harder work of practice. Any reasonable framework gets you ~95% of the value of the 'best' one. Pick one, commit to it for at least 5 practice attempts, then evaluate. Framework selection is not the bottleneck; practice volume is.",
      "The candidate should stop reading frameworks and design their own custom framework based on the strengths of each.",
      "The candidate should switch focus from framework selection to memorizing answer keys, which is more directly relevant to interview performance."
    ],
    "correctIndex": 1,
    "explanation": "The foundation step says to choose a framework and start with the basics — not to optimize over framework choices. Any framework that imposes linear progression captures most of the value; the marginal gain from picking the 'optimal' one is small relative to the cost of delaying practice. Framework-shopping is a known anti-pattern in skill acquisition: it provides the *feeling* of preparation without the *substance*. (D) is also wrong — memorizing answer keys without producing your own attempts first is the broken cycle from the previous question.",
    "interviewScript": null,
    "proTip": "The first 10 hours of practice with a mediocre framework beats the first 10 hours of comparing frameworks with no practice. Optimization without data is just procrastination."
  },
  {
    "id": "q6",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Mock Interviews vs Self-Evaluation",
    "difficulty": "L4",
    "style": "Interviewer Pushback",
    "conceptIds": [
      "A6",
      "A8"
    ],
    "l5Pattern": null,
    "question": "A candidate tells their mentor: 'I've completed 10 practice questions following the loop and I feel ready. I'm skipping the mock-interview step because mocks cost money and I can self-evaluate from the answer keys.' Their mentor pushes back. What specific signal does a mock interview produce that comparing your written answer to a written answer key cannot, and why does that signal matter?",
    "options": [
      "Mock interviews force you to type faster, which matches the speed required during a real interview.",
      "The mock interview tests four things the answer-key comparison cannot: real-time interviewer pushback (you can't argue with a written answer key), ability to think and talk simultaneously, recovery when the interviewer goes off-script, and calibration of how clear your verbalization actually sounds to a third party. Self-evaluation systematically over-credits your written answers because you are both the producer and the grader. Mocks are how that bias gets corrected.",
      "Mock interviews give you the chance to practice the introduction and behavioral parts of the interview, which the technical answer keys don't cover.",
      "The mentor is overcautious — 10 practice questions with self-evaluation is sufficient prep, and skipping mocks saves money for the real interview prep."
    ],
    "correctIndex": 1,
    "explanation": "The practice section ends with 'schedule a mock interview' precisely because the practice loop is incomplete without external evaluation. The four signals listed (pushback, parallel processing, recovery, calibration) are the *interactive* dimensions of the interview that cannot be tested in solo practice. The self-evaluation bias is real and well-documented: producers grade their own work generously. (A) misses the point — typing speed isn't the issue. (C) is incidental. (D) trivializes the mentor's concern.",
    "interviewScript": "In a real interview, expect interviewer pushback even on correct answers — they're checking whether your reasoning is held with confidence or memorized. Mocks are where you practice the muscle of staying calm and re-stating your reasoning under that pressure.",
    "proTip": "Schedule your first mock 1/3 of the way through your prep, not at the end. Early mocks expose what to focus on; end-of-prep mocks just measure where you ended up."
  },
  {
    "id": "q7",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Recognition vs Production",
    "difficulty": "L5",
    "style": "Failure Analysis",
    "conceptIds": [
      "A1",
      "A4",
      "A5"
    ],
    "l5Pattern": "framing-is-wrong",
    "question": "A candidate has spent 80 hours reading every Hello Interview article 3 times each, takes meticulous notes, and can summarize each article from memory. They schedule their first mock interview and bomb it — they freeze when asked to design Twitter, can name the components but cannot organize them, and run out of time at minute 25 stuck on the data model. What specific cognitive failure has their preparation approach optimized for, and why does the mock-interview format defeat it?",
    "options": [
      "The candidate didn't read enough articles. 80 hours is below the ~200 hours typically needed for SDE2-level prep — more reading would have closed the gap.",
      "The candidate optimized for RECOGNITION (can recognize concepts when shown them in articles) rather than PRODUCTION (can generate a design from a blank page under time pressure). Recognition is what reading rewards; production is what the interview tests. The interview format defeats recognition because there is no article to recognize against — the candidate must generate structure from nothing, and the recognition skill is largely useless for that. The fix is not more reading; it is shifting to active practice immediately.",
      "The candidate is anxious — the bomb was a one-off and another mock will go better without changing their prep approach.",
      "The candidate didn't memorize specific component names well enough. They need to memorize a checklist of components (load balancer, cache, queue, etc.) and recite it at the start of every design."
    ],
    "correctIndex": 1,
    "explanation": "L5 framing-is-wrong: the obvious answers (read more, memorize more) are technically about prep but solve the wrong problem. The deeper insight the interviewer listens for is that learning system design happens during *production*, not during *consumption*. The two-stage prep model puts foundation reading first only to ENABLE practice — not as a goal in itself. Why most candidates pick A or D: A feels conservative ('more is more'); D feels concrete ('I'll just memorize the list'). Both let the candidate keep doing what feels productive — which is exactly the trap. The senior+ move is recognizing that the prep modality itself is misaligned with what the interview tests, and switching to the harder, less-comfortable production work.",
    "interviewScript": null,
    "proTip": "Treat reading as scaffolding for practice, never as a substitute for it. If you've spent 5x more hours reading than producing answers, you're optimizing for the wrong skill."
  },
  {
    "id": "q8",
    "part": "A — Prep Foundation & Practice Loop",
    "subtopic": "Compressing the Prep Loop",
    "difficulty": "L5",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "A1",
      "A6"
    ],
    "l5Pattern": "trade-off-inversion",
    "question": "A candidate has 3 weeks until their FAANG system-design interview and has done zero prep. The standard advice (foundation, then practice loop, then mocks) implicitly assumes a multi-month timeline. What is the highest-EV adaptation of the standard prep approach for this constrained timeline, and what does that adaptation reveal about which step in the standard loop is *most* load-bearing?",
    "options": [
      "Compress the timeline by reading the foundation material at 3x speed and doing twice as many practice questions per day. The standard model is correct; the candidate just needs to execute it faster.",
      "Skip the foundation entirely and spend all 3 weeks doing back-to-back mock interviews. Mocks are the most realistic signal, so maximizing them maximizes prep value.",
      "Shrink — don't skip — the foundation. Spend 1-2 days skimming the basics for vocabulary only (build the mental skeleton, no depth). Then spend the remaining ~19 days on the practice loop with frequent mocks (e.g., one mock per 4-5 self-attempts). This adaptation reveals that the PRACTICE LOOP is the most load-bearing step — the foundation exists to enable practice, so it's compressible. Mocks are non-skippable because they're the only step that produces calibrated external signal. The foundation's role is hooks, not depth, so 1-2 days suffices.",
      "Cancel the interview and reschedule for 3 months out. 3 weeks is structurally insufficient and any prep approach will fail."
    ],
    "correctIndex": 2,
    "explanation": "L5 trade-off-inversion: flipping the time-budget constraint forces you to identify which steps are *load-bearing* and which are compressible. Foundation reading is high-value-per-hour for the first 1-2 days (building vocabulary) and rapidly diminishing thereafter — it's compressible. Practice is load-bearing — there is no substitute. Mocks are load-bearing — they're the only external-calibration step. Why most candidates pick A or B: A is the conservative answer ('just do everything faster'); B is the heroic answer ('just do the hardest thing'). Both miss that the steps have different *functions*, not just different difficulties. The senior+ insight the interviewer listens for is the ability to articulate what each step actually buys you — which most candidates can't do until forced by a constraint.",
    "interviewScript": null,
    "proTip": "When you're time-constrained, audit each step in any standard advice for 'is this compressible or load-bearing?' The compressible steps shrink first; the load-bearing ones get *more* attention, not less."
  }
];

export const PARTS_ORDER = [
  "A — Prep Foundation & Practice Loop"
];

export const DIFFICULTY_TIERS = [
  "L1",
  "L2",
  "L3",
  "L4",
  "L5"
];

export default {
  questions: QUESTIONS,
  partsOrder: PARTS_ORDER,
  difficultyTiers: DIFFICULTY_TIERS
};
