// === COVERAGE MANIFEST ===
// Source: System Design in a Hurry — Introduction (https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction)
// Total questions: 40 across 8 parts (full L1→L5 ladder per part)
//
// PART A — What system design interviews are
//   Concept A1 (defn: ambiguous high-level → infrastructure pieces): q1, q2
//   Concept A2 (practical, not academic — closer to real work than leetcode): q1, q2
//   Concept A3 (multiple right answers — no single canonical solution): q1, q3
//   Concept A4 (interviewer assesses navigation + trade-offs + comm): q3, q4
//   Concept A5 (level-based weighting — disproportionate at senior): q4
//   Concept A6 (staff+ different approach): q5
//   Ladder: L1[q1] L2[q2] L3[q3] L4[q4] L5[q5]
//
// PART B — Types of SD interviews (Product/Infra vs alternatives)
//   Concept B1 (most are Product or Infrastructure Design — both covered): q6
//   Concept B2 (Product Design = system behind a product): q6
//   Concept B3 (Infrastructure Design = system supporting infra use case): q6
//   Concept B4 (both need infra components): q6
//   Concept B5 (LLD/OOD is a different interview — class structure): q7
//   Concept B6 (ML SD is different — modeling, feature engineering): q8
//   Concept B7 (Frontend design is different — separate guide): q9
//   Ladder: L1[q6] L2[q7] L3[q8] L4[q9] L5[q10]
//
// PART C — Level-based assessment philosophy
//   Concept C1 (full design required at every level): q11, q13
//   Concept C2 (mid-level: basics well, not deep): q11, q12
//   Concept C3 (senior: basics fast, depth in deep dives): q11, q12, q13, q14
//   Concept C4 (staff+ different approach): q15
//   Concept C5 (common rubric themes across companies): q13
//   Ladder: L1[q11] L2[q12] L3[q13] L4[q14] L5[q15]
//
// PART D — Problem Navigation (Pillar 1)
//   Concept D1 (break down + prioritize + navigate): q16
//   Concept D2 (often most important; where most struggle): q16
//   Concept D3 (failure: insufficient exploration / requirements): q16, q17
//   Concept D4 (failure: focusing on trivial vs important): q17, q18
//   Concept D5 (failure: getting stuck on a piece): q17
//   Concept D6 (failure: failing to deliver a working system): q17
//   Concept D7 (root cause: lack of structure): q18, q19
//   Concept D8 (Delivery Framework = recommended track): q18, q19
//   Ladder: L1[q16] L2[q17] L3[q18] L4[q19] L5[q20]
//
// PART E — Solution Design (Pillar 2)
//   Concept E1 (solve pieces + show how they fit): q21
//   Concept E2 (failure: insufficient core-concept understanding): q22, q24
//   Concept E3 (failure: ignoring scaling/perf): covered implicitly via E1, E2
//   Concept E4 (failure: spaghetti design): q21, q34
//   Concept E5 (memorization detection — pushback/doubt/trade-off ask): q22, q24, q25
//   Concept E6 (solid fundamentals + appropriate depth): q23, q24
//   Ladder: L1[q21] L2[q22] L3[q23] L4[q24] L5[q25]
//
// PART F — Technical Excellence (Pillar 3)
//   Concept F1 (best practices + current tech + patterns + applying them): q26, q27
//   Concept F2 (failure: not knowing available tech): q27
//   Concept F3 (failure: antiquated approaches / outdated hardware): q26, q28
//   Concept F4 (failure: knowing tech but not applying it): q27, q22
//   Concept F5 (failure: not recognizing common patterns): q29
//   Concept F6 (hardware has not stood still — material stuck in 2015): q26, q28
//   Concept F7 (numbers to know — modern hardware figures): q28, q30
//   Ladder: L1[q26] L2[q27] L3[q28] L4[q29] L5[q30]
//
// PART G — Communication and Collaboration (Pillar 4)
//   Concept G1 (interview as colleague-simulation): q31
//   Concept G2 (collaborative — interviewer participates): q32
//   Concept G3 (communicating + responding to feedback): q33, q34
//   Concept G4 (failure: can't communicate clearly): q31, q34
//   Concept G5 (failure: defensive/argumentative on feedback): q31, q33, q35
//   Concept G6 (failure: getting lost in the weeds): q19
//   Ladder: L1[q31] L2[q32] L3[q33] L4[q34] L5[q35]
//
// PART H — Preparation strategy
//   Concept H1 (read in order, skipping known): q38
//   Concept H2 (3-4 weeks new vs <1 week familiar): q37, q40
//   Concept H3 (push the date — recruiter prefers higher pass rate): q38
//   Concept H4 (hurry triage: Delivery Framework → Key Tech → Core Concepts): q39
//   Concept H5 (consume-but-can't-apply failure mode): q36, q37
//   Concept H6 (practice + Guided Practice = antidote): q36, q37, q39
//   Ladder: L1[q36] L2[q37] L3[q38] L4[q39] L5[q40]
//
// CROSS-PART BRIDGES (6, ≥ minimum of 2):
//   A×E (memorization detection — interviewer pushback): q4   (A4 + E5)
//   D×G (interviewer redirect handling — navigate + collaborate): q19 (D7 + G6)
//   E×F (know-tech vs apply-tech — distinct failures): q22 (E2 + F1/F4)
//   D×F (estimate before sharding — navigate forces tech): q28 (D1 + F3/F7)
//   E×G (redraw spaghetti — design × communication): q34 (E4 + G4)
//   C×H (level + prep math): q40 (C3 + H4/H5)
//
// L5 PATTERN COVERAGE:
//   - framing-is-wrong: q5 (A), q35 (G) — meta surface invites this twice
//   - trade-off-inversion: q10 (B)
//   - future-proofing: q15 (C)
//   - two-levels-of-indirection: q20 (D)
//   - adversarial-pushback: q25 (E)
//   - estimation-backed-scenario: q30 (F), q40 (H)
//   - implementation-specific-gotcha: NOT USED — meta-content surface (Section 12 of methodology
//     explicitly notes intro/meta L5s lean on framing-is-wrong / trade-off-inversion).
//   Unique patterns covered: 6/7. Minimum required: 4. ✓
//
// Anti-Recall acid test: every question is scenario-driven. No question is answerable by
// recalling the article's structure, list-of-N, or labels.
// ============================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import {
  Clock,
  ChevronRight,
  SkipForward,
  Flag,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Target,
  Shuffle,
  List,
  Timer,
  Award,
  TrendingUp,
  ArrowLeft,
  Layers,
  Zap,
} from "lucide-react";

const QUESTIONS = [
  // ============== PART A — What system design interviews are ==============
  {
    id: "q1",
    part: "A — What system design interviews are",
    subtopic: "What system design interviews are",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["A1", "A2", "A3"],
    l5Pattern: null,
    question:
      "A team lead drops a single sentence on the table: 'we need to design something that handles photo uploads from millions of users.' No further constraints, no test cases, no expected output. Compared to a coding-style interview (which gives precise inputs and a single expected output), what is it about *this* prompt that makes it characteristically a system-design interview rather than a coding interview?",
    options: [
      "Photos require image-processing libraries that are too complex for a coding interview, so the prompt has to be SD by elimination.",
      "The prompt is intentionally under-specified at a high level — the candidate's job is to break it into infrastructure pieces (storage, scaling, request flow), make trade-offs, and arrive at one of several valid answers. Coding problems by contrast have fixed inputs and a single correct output.",
      "System-design problems always involve photos, video, or other media; the topic is the giveaway.",
      "Coding interviews are easier; this prompt just looks harder, so it must be SD.",
    ],
    correctIndex: 1,
    explanation:
      "An SD interview is defined by what the prompt is asking the candidate to do: take an ambiguously-defined, high-level problem and decompose it into the infrastructure pieces needed to solve it. The signal is reasoning under ambiguity with multiple valid endpoints — not retrieving the right answer for a known input. The topic (photos, ride-sharing, anything) is incidental.",
    interviewScript:
      "In your interview, when you receive a single under-specified sentence, lead with: 'Before I design, let me make sure I understand the scope — I'll ask a few clarifying questions to anchor scale, latency requirements, and which parts you most want to see.' That move alone signals you understand the kind of interview you're in.",
    proTip:
      "If a prompt comes with test cases or precise I/O, it is *not* an SD interview — recalibrate your approach.",
  },
  {
    id: "q2",
    part: "A — What system design interviews are",
    subtopic: "What system design interviews are",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["A1", "A2"],
    l5Pattern: null,
    question:
      "Two interviewers describe what they did this morning. Interviewer X: 'I gave the candidate a problem with three test cases and graded by whether their function returned the correct output for all three.' Interviewer Y: 'I gave them an under-specified prompt; we built up the design together; what I cared about was how they reasoned through trade-offs along the way.' Which one ran something closer to a system-design interview, and what specific phrase in their description gives it away?",
    options: [
      "X — a precise grading rubric is the hallmark of system design.",
      "Y — the under-specified prompt and the focus on *reasoning through trade-offs* are the giveaways. SD interviews are practical (closer to real engineering work than leetcode), and they have no single correct output to grade against, so the assessment is about how the candidate navigates ambiguity.",
      "Y — but only because Y's interview took longer than X's.",
      "Both are SD interviews; they're just different formats of the same thing.",
    ],
    correctIndex: 1,
    explanation:
      "SD interviews are deliberately under-specified and graded on the reasoning process — not on whether a final artifact matches a 'right answer.' X's setup (fixed inputs, fixed outputs) is the textbook coding-interview shape. Y's setup is the textbook SD shape. Length isn't the signal; *what's being measured* is.",
    interviewScript:
      "In your interview, you can use this to read the room: if your interviewer pushes you to choose between two reasonable approaches and weigh them, they're collecting trade-off-reasoning signal — that's what they're grading.",
    proTip: null,
  },
  {
    id: "q3",
    part: "A — What system design interviews are",
    subtopic: "What system design interviews are",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: ["A3", "A4"],
    l5Pattern: null,
    question:
      "A candidate finishes a senior-level SD interview and tells a friend: 'I think I nailed it — my final architecture matched the well-known reference design for that product.' What is missing from that statement that should make them less confident than they are?",
    options: [
      "Reference designs are always wrong; senior candidates should invent something novel from scratch.",
      "SD interviews are not graded on whether the final design matches a 'right answer.' Interviewers care about navigation, trade-off reasoning, and communication along the way — many problems have several right answers. Arriving at a known good design tells you nothing about whether the *process* you ran (clarifying, prioritizing, justifying) was the process the interviewer was actually scoring.",
      "They should have used more components than the reference design.",
      "Reference designs are for mid-level interviews; senior candidates should be more ambitious.",
    ],
    correctIndex: 1,
    explanation:
      "There are usually several valid answers to an SD problem. The interviewer is collecting signal on how the candidate *got there* — requirements gathering, prioritization, trade-off discussion, response to pushback. A correct end-state with no visible reasoning is indistinguishable from a memorized answer, which is exactly what interviewers probe to detect.",
    interviewScript:
      "When debriefing your own interviews, ask yourself not 'did I land on the right architecture?' but 'did I make my reasoning visible at every step where there was a trade-off?'",
    proTip:
      "If you find yourself thinking 'I just need to match the textbook design,' you've reframed an SD interview into a recall task — which is exactly the failure mode interviewers test for.",
  },
  {
    id: "q4",
    part: "A — What system design interviews are",
    subtopic: "What system design interviews are",
    difficulty: "L4",
    style: "Cross-Part Bridge",
    conceptIds: ["A4", "A5", "A6", "E5"],
    l5Pattern: null,
    question:
      "Same candidate's identical performance — basics covered, one good deep dive, two missed deep dives — receives different outcomes at three levels: passed at mid, borderline at senior, weak signal at staff. The candidate concludes the panels were inconsistent. What's a more accurate interpretation, and what does it imply about how SD interviews are weighted?",
    options: [
      "The panels were inconsistent; report it to the recruiter.",
      "SD interviews are weighted *disproportionately more* as the level rises — at senior they often carry the largest single weight in the loop, and the bar for what counts as 'good performance' shifts upward with level. The same artifact (basics + one deep dive) is a passing signal at mid, marginal at senior, and weak at staff — not because the panels graded inconsistently, but because what each level *requires* the candidate to demonstrate is different. The performance was constant; the bars weren't.",
      "Mid-level interviewers are more lenient; senior ones are strict.",
      "Staff interviews aren't really SD interviews.",
    ],
    correctIndex: 1,
    explanation:
      "SD weighting climbs with level — entry-level rarely has SD, mid-level commonly does, senior treats SD as the norm with disproportionate weight, and staff+ requires a different mode entirely. A given performance therefore moves across the bar as the bar moves, even when the panels are calibrated. Interviewers also actively probe (pushback, doubt, trade-off questions) to detect memorized vs reasoned answers — and the more senior you are, the more this probing is decisive.",
    interviewScript:
      "If you're being assessed at multiple levels (e.g. a 'flex' candidate), explicitly target the higher level's bar — basics fast, deep dives in depth, and engage interviewer pushback as a chance to add signal rather than as a threat.",
    proTip:
      "Cross-Part bridge: this connects 'level-based weighting' (Part A) with 'memorization detection' (Part E) — interviewers probe more aggressively at senior+ specifically because the bar requires reasoned, not memorized, answers.",
  },
  {
    id: "q5",
    part: "A — What system design interviews are",
    subtopic: "What system design interviews are",
    difficulty: "L5",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["A1", "A2", "A3", "A4"],
    l5Pattern: "framing-is-wrong",
    question:
      "An entry-level engineer asks: 'why do companies use system-design interviews instead of just leetcode-style coding interviews? Coding interviews are simpler to grade, so why pay the extra cost of grading SD?' The 'obvious' answer is something like 'because real engineering work involves systems, not just algorithms.' That answer is technically correct, but it's solving the wrong problem. What is the deeper insight a senior+ candidate should articulate, and why does framing this as a cost-vs-benefit-of-grading analysis miss the point?",
    options: [
      "Grading is actually a solved problem — SD rubrics make grading just as objective as leetcode, so the framing is fine.",
      "The framing 'why SD instead of leetcode' assumes the two formats are interchangeable measurement instruments at different cost points. They aren't: SD measures a *different* skill — the ability to reason through ambiguous, multi-part problems where multiple right answers exist. Coding interviews structurally cannot measure that, because they require a single grading-truth (the correct output). The investment in SD isn't justified by 'cost vs benefit of grading' — it's justified by 'measure what we actually need to assess.' The right answer to the entry-level engineer is to step out of the cost-of-grading frame entirely.",
      "Companies copy each other; SD interviews exist because Google does them.",
      "SD interviews are vestigial; companies will eventually drop them in favor of cheaper formats.",
    ],
    correctIndex: 1,
    explanation:
      "Most candidates accept the entry-level engineer's framing and produce a correct-but-shallow answer ('real work isn't algorithms'). The senior+ move is to recognize the framing is wrong: cost-of-grading is not the relevant axis. SD interviews exist because they measure a structurally different skill (judgment under ambiguity with multiple valid endpoints) that coding interviews cannot measure at any cost. The expensive grading is a *consequence*, not the question. Stepping out of the framing is the staff move.\n\nWhy A and D are tempting: A re-anchors to the original frame (cost) and tries to defend it; D dismisses the format. Both miss that the question itself contains a category error.",
    interviewScript:
      "In your interview, if the interviewer ever asks you a question with a baked-in category error, the staff move is: 'Before I answer, I want to pause on the framing — the choice here isn't about [framed axis]; it's about [actual axis]. If we agree on that, here's the answer ...'",
    proTip:
      "L5 framing-is-wrong: the 'obvious' answer is technically true but inside the wrong frame. Senior+ candidates step out of the frame and explicitly name the category error before answering.",
  },

  // ============== PART B — Types of system design interviews ==============
  {
    id: "q6",
    part: "B — Types of system design interviews",
    subtopic: "Types of system design interviews",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["B1", "B2", "B3", "B4"],
    l5Pattern: null,
    question:
      "An interviewer says: 'design a service that authenticates incoming API requests, applies rate limits per user, and forwards approved requests to backend services.' Compared to a prompt like 'design Instagram' (whose users are end consumers), this prompt's deliverable is a system whose users are *other systems and engineers*. Which kind of SD interview is this most clearly an example of, and does the SD-in-a-Hurry framework still apply?",
    options: [
      "It's a pure coding interview, because rate limiting can be implemented as an algorithm.",
      "It's an infrastructure-design SD interview — the deliverable supports an infrastructure use case rather than a user-facing product. It's distinct from product-design SD interviews like 'design Instagram,' but the SD-in-a-Hurry framework applies to both because both still require infra components like load balancers, services, datastores, and queues.",
      "It's a frontend-design interview because requests originate from UI clients.",
      "It's a low-level/object-oriented design interview because rate-limit state is held in a class.",
    ],
    correctIndex: 1,
    explanation:
      "SD interviews split into product-design (system *behind* a product, e.g. Uber, Instagram) and infrastructure-design (system supporting an infra use case, e.g. rate limiter, distributed cache). Both still need infra components — so the same framework applies. Recognizing the kind of SD problem helps you scope clarifying questions correctly (product-design questions emphasize user-facing requirements; infra-design questions emphasize SLAs, failure modes, and consumer contracts).",
    interviewScript:
      "Early in the interview, name the kind of problem out loud: 'this looks like an infrastructure design problem — its consumers are other services. Let me clarify the SLAs and the contract before I sketch.' That signals you've correctly classified the prompt.",
    proTip: null,
  },
  {
    id: "q7",
    part: "B — Types of system design interviews",
    subtopic: "Types of system design interviews",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["B5"],
    l5Pattern: null,
    question:
      "Compare two interview prompts a candidate might receive. Prompt 1: 'design the class structure and key methods for a chess game with move validation, game state, and undo.' Prompt 2: 'design a chess matchmaking service for 10M players with skill-based pairing.' What is the *substantive* difference between what each prompt is testing, and why would studying SD-in-a-Hurry be insufficient preparation for one of them?",
    options: [
      "Prompt 1 is harder because it requires writing more code.",
      "Prompt 1 is testing object-oriented design within a single program — class hierarchy, method contracts, state machines, design patterns. Prompt 2 is testing how independent services interact at scale — distributed components, queues, sharding, latency. Different skills. SD-in-a-Hurry is the right preparation for prompt 2; prompt 1 is a low-level / OOD interview that needs separate material.",
      "They're testing the same skill — both are 'design a chess thing.'",
      "Prompt 1 is for backend engineers; prompt 2 is for frontend.",
    ],
    correctIndex: 1,
    explanation:
      "These two interview formats live in genuinely different skill spaces. OOD/LLD asks about the internal structure of a single program — encapsulation, contracts, design patterns. SD asks about how independent services interact at scale. SD-in-a-Hurry covers the second; the first needs LLD-specific material. Misclassifying one as the other and applying the wrong playbook (e.g. drawing microservices for a parking-lot OOD problem) is a high-leverage failure.",
    interviewScript:
      "If you ever feel uncertain whether a prompt is OOD or SD, ask explicitly: 'just to clarify the scope — are you looking for the class structure within a single service, or how multiple services would interact at scale?' Both interviewers will appreciate the calibration question.",
    proTip:
      "Opposites together: OOD = inside one program, SD = across many services. Holding the contrast in mind helps you classify ambiguous prompts faster.",
  },
  {
    id: "q8",
    part: "B — Types of system design interviews",
    subtopic: "Types of system design interviews",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: ["B6"],
    l5Pattern: null,
    question:
      "A friend has an interview tomorrow for an applied ML role. The role description mentions 'feature engineering, model training, and serving infrastructure for recommendations.' They ask whether SD-in-a-Hurry alone is sufficient prep. What do you tell them, and why is the answer not 'yes' even though the role mentions serving infrastructure?",
    options: [
      "Yes — the serving infrastructure piece is what matters, and SD-in-a-Hurry covers infra.",
      "Their interview will likely include ML-specific concerns — feature engineering, model lifecycle, training pipelines, online vs offline evaluation — that go beyond product- or infra-design. SD-in-a-Hurry covers the serving-infra side, but they need ML-System-Design material for the model/feature/training pieces. The two are complementary; one isn't a substitute for the other. If they only prep SD, they'll be strong on the serving box and silent on everything inside it.",
      "ML interviews are pure coding; tell them to do leetcode.",
      "ML system design is the same as frontend design.",
    ],
    correctIndex: 1,
    explanation:
      "ML SD adds modeling and feature-engineering concerns on top of the system-design substrate. The SD pieces still apply (you still need to discuss serving, scaling, latency), but the questions about feature stores, training/serving skew, model evaluation, and cold-start are not in SD-in-a-Hurry. Treat ML SD as SD + a domain-specific layer.",
    interviewScript:
      "Suggest your friend explicitly ask the recruiter: 'how much of the SD round is ML-specific (features, training, evaluation) vs general infra?' so they can prioritize prep accordingly.",
    proTip: null,
  },
  {
    id: "q9",
    part: "B — Types of system design interviews",
    subtopic: "Types of system design interviews",
    difficulty: "L4",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["B7", "B1"],
    l5Pattern: null,
    question:
      "You're 15 minutes into what you assumed was a backend SD interview for a generalist role. You've sketched services, queues, and a datastore. The interviewer says: 'walk me through the JavaScript you'd use to handle the resumable-upload UI on the file selector — I want to understand how the client coordinates with your backend.' This is a frontend-flavored probe. What's the most likely interpretation, and what is the right *immediate* move?",
    options: [
      "The interviewer made a mistake — politely redirect back to backend infrastructure design.",
      "The interview is more frontend-leaning than the prompt implied. SD-in-a-Hurry doesn't fully cover frontend system design (it's a separate format with its own playbook). The right immediate move: clarify scope explicitly — 'is this leaning frontend, or do you want backend infra primarily? I want to budget my remaining time correctly.' Misjudging the scope (only doing backend when they want both) is a common way to fail by mismatch rather than by lack of knowledge.",
      "Refuse — frontend isn't system design.",
      "Fake the JS and hope it's good enough.",
    ],
    correctIndex: 1,
    explanation:
      "Frontend system design is a distinct interview format — separate guides, separate concerns (rendering, state, network coordination from the client side). When the prompt blends frontend and backend, the candidate's job is to recognize the blend early and budget time accordingly. Asking the calibration question is far stronger than guessing wrong and burning 20 minutes on the wrong axis. This is a Problem-Navigation move (gather requirements / scope) inside a Part-B classification problem.",
    interviewScript:
      "Practice this script: 'Quick clarification on scope — are we focused on the backend services, or do you want me to also cover the client-side coordination? I'll budget my remaining time differently depending on which.'",
    proTip: null,
  },
  {
    id: "q10",
    part: "B — Types of system design interviews",
    subtopic: "Types of system design interviews",
    difficulty: "L5",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["B6", "B1"],
    l5Pattern: "trade-off-inversion",
    question:
      "Staff candidate. Prompt: 'design a recommendation system for a video platform.' They start with the standard product-SD playbook: clarify users, scale, services, datastore, queues. The interviewer interrupts after 8 minutes: 'OK, but what about the model — what features would you use, and how would you handle cold-start for new videos?' The candidate freezes; they prepared SD, not ML SD. What is the deeper insight a staff+ candidate should have surfaced *before* the interview began, and how does it change preparation for the next loop?",
    options: [
      "Always assume every interview is product SD; the interviewer was being unfair.",
      "'Recommendation system' is a strong flag that the interview is *probably* ML System Design, not vanilla SD — recommender problems are inherently model-driven, and 'cold-start for new videos' is an ML-system concept, not an SD concept. The interview type is determined by the *content* of the problem, not by the label given when scheduling. A staff+ candidate pre-classifies the loop ('which rounds are SD, which are ML SD, which are OOD?') and prepares matching materials. Mis-classifying a recommender problem as pure SD is a high-leverage staff-level failure: the requirement (recommender / ML) implicitly inverts the chosen pattern (SD playbook).",
      "ML SD doesn't exist; everything is SD.",
      "Hand-wave the model and stay in the SD playbook.",
    ],
    correctIndex: 1,
    explanation:
      "L5 trade-off-inversion: the candidate's chosen pattern (SD playbook) was correct *for* a vanilla SD prompt — but the implicit requirement (recommender system) flips the interview type to ML SD, which inverts the playbook needed. The senior+ insight is to classify the interview *by problem content*, not by what it was labeled, and to pre-prep for each loop accordingly.\n\nWhy A and D are tempting: A treats the interviewer's question as out-of-scope rather than recognizing the candidate's classification was wrong. D doubles down on the wrong pattern.",
    interviewScript:
      "Before each interview, take 60 seconds to skim the prompt and ask 'what kind of interview is this *actually* — product SD, infra SD, ML SD, or OOD?' If you're not sure after the first minute of the interview, ask the interviewer to confirm scope.",
    proTip:
      "L5 trade-off-inversion: when the *requirement* changes, the *pattern* you should pick changes too. Recognize requirement shifts at the meta-level (what kind of interview is this?) before they bite at the design level.",
  },

  // ============== PART C — Level-based assessment philosophy ==============
  {
    id: "q11",
    part: "C — Level-based assessment philosophy",
    subtopic: "Level-based assessment",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["C1", "C2", "C3"],
    l5Pattern: null,
    question:
      "A mid-level engineer observes a senior candidate's mock interview. The senior gets through requirements, scale numbers, and high-level architecture in 12 minutes, then spends 30 minutes deep-diving the cache eviction strategy, hot-key handling, and a follow-up on cross-region replication. The mid-level engineer says: 'wow, they're going way beyond the basics.' What does the mid-level's reaction reveal about the difference between mid- and senior-level expectations in an SD interview?",
    options: [
      "The senior was overcompensating; senior interviews are graded harder.",
      "The mid-level engineer hasn't internalized that at senior level, working through the basics *quickly* is the floor, and the substantive grading happens in the deep dives. The senior's behavior isn't 'going beyond' — it's the expected pattern. Mid-level's bar is 'do the basics well'; senior's bar is 'do the basics fast, then show depth.' Same problem, different bars.",
      "The senior was wasting time on details that don't matter.",
      "Senior interviews skip the basics entirely.",
    ],
    correctIndex: 1,
    explanation:
      "Both levels must complete a working design, but how they spend time is graded differently. Mid-level can pass on basics covered well. Senior is expected to clear basics fast and use the remaining time for depth. The mid-level engineer's reaction reveals their own bar, not the senior's overshoot.",
    interviewScript:
      "If you're targeting senior: practice clearing requirements + high-level architecture in under 15 minutes so you have 25-30 minutes for deep dives. The time discipline *is* the senior signal.",
    proTip:
      "Opposites together: mid = 'basics well, depth optional'; senior = 'basics fast, depth expected.'",
  },
  {
    id: "q12",
    part: "C — Level-based assessment philosophy",
    subtopic: "Level-based assessment",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["C2", "C3"],
    l5Pattern: null,
    question:
      "Two senior candidates produce nearly identical final architectures. Candidate X spent 35 of 45 minutes on basics (requirements, high-level diagram, basic data model) and 10 minutes on a single deep dive covered shallowly. Candidate Y spent 12 minutes on basics and 33 minutes across two deep dives covered thoroughly. Both reached the same end state. Which is more likely to pass at senior level, and why does the time allocation matter so much when the artifact is the same?",
    options: [
      "X — they covered the basics more thoroughly, which is always safer.",
      "Y — at senior level, time allocation *is the signal*. Spending 35 minutes on basics tells the interviewer the candidate operates at mid-level even if the final picture looks senior. Y's 12-minute basics demonstrates the basics are reflexive, freeing time for the depth that distinguishes senior. The same end state earns very different signals because the *distribution of time* is itself being graded.",
      "They will tie — same artifact, same outcome.",
      "X — covering basics carefully shows attention to detail.",
    ],
    correctIndex: 1,
    explanation:
      "The interviewer is grading the path, not just the destination. Spending 35 of 45 minutes on basics is a strong mid-level signal regardless of the final design's quality, because it shows the candidate isn't fluent enough with basics to compress them. The same artifact + different time allocation produces different signals.",
    interviewScript:
      "Build an internal clock: by the 12-minute mark in a 45-minute interview, you should be done with requirements + high-level architecture and starting your first deep dive. Practice with that clock.",
    proTip: null,
  },
  {
    id: "q13",
    part: "C — Level-based assessment philosophy",
    subtopic: "Level-based assessment",
    difficulty: "L3",
    style: "Failure Analysis",
    conceptIds: ["C1", "C3", "C5"],
    l5Pattern: null,
    question:
      "A candidate (target level: senior, internally L5 at the company) gets feedback: 'you delivered a working architecture covering all the requirements, but you came across as L4 (mid-level).' They protest — they finished the design and answered every question. What is the most plausible feedback the interviewer would give to explain why the *outcome* was correct but the *signal* was mid-level — and how does this generalize across companies even when rubric labels differ?",
    options: [
      "The architecture had a bug they didn't notice.",
      "Delivering a correct full design is the universal floor at every level — that's what 'all candidates are expected to complete a full design' means. At senior, the rubric weights *depth* much more heavily, so producing a correct artifact without showing depth produces a mid-level signal even when the artifact is acceptable. Different companies use different rubric labels, but the pattern (depth-weighting at senior+) is common across the industry. To register as senior, the candidate would have needed to surface depth choices the interviewer couldn't have predicted from the basics alone.",
      "The interviewer was biased.",
      "The candidate didn't speak loudly enough; this is a Communication issue.",
    ],
    correctIndex: 1,
    explanation:
      "The article is explicit that all candidates must complete a full design, and that level differences show up in *how* the time is spent. Different companies attach different labels (Problem Navigation / Solution Design / etc. or different equivalents), but the underlying themes are common — and depth-weighting at senior is one of them. The candidate's outcome was correct; the signal was wrong because the path through the design didn't show depth.",
    interviewScript:
      "If you're targeting a level above your current one, explicitly list before the interview: what 2 deep-dive choices would distinguish my design at the higher level? Then make sure you have time to show them.",
    proTip: null,
  },
  {
    id: "q14",
    part: "C — Level-based assessment philosophy",
    subtopic: "Level-based assessment",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["C3"],
    l5Pattern: null,
    question:
      "You've delivered a complete design. The interviewer says: 'I notice you covered the basics well, but I didn't get a sense of where you'd push the boundaries if this design had to scale 10x.' This is a senior-level depth probe arriving in the last 10 minutes. What is the *fastest* recovery move that converts the basics-only signal into senior-level signal without restarting the interview?",
    options: [
      "Ask the interviewer to repeat the question.",
      "Pick the *one* component most likely to break at 10x scale (typically the database write path or the cache layer for read-heavy systems), pre-empt the question with a depth-dive into how that component would change at scale, and explicitly call out the trade-off you're choosing. This converts a mid-level signal into senior signal in 5-7 minutes by demonstrating you can identify the *highest-leverage* failure point and reason about it under scale, without restarting from scratch.",
      "Restart the design from scratch with bigger scale numbers.",
      "Pivot to a coding question to demonstrate breadth.",
    ],
    correctIndex: 1,
    explanation:
      "Restarting eats time and signals panic. The senior move is to recognize the comment as a request for a depth-dive, choose one high-leverage component (the one that breaks first under scale), and treat the remaining 10 minutes as the deep dive. Demonstrating which component you'd pick *and why* is itself the senior signal.",
    interviewScript:
      "When you hear 'I want to see where you'd push the design,' answer: 'The first thing that breaks at 10x is [component], because [reason]. Here's how I'd evolve the design ...' Lead with the failure point, then with the fix.",
    proTip:
      "Learn one component deeply for each common scale axis: write-heavy DB, read-heavy cache, hot key, fan-out queue. You'll be able to pivot to the right deep-dive on demand.",
  },
  {
    id: "q15",
    part: "C — Level-based assessment philosophy",
    subtopic: "Level-based assessment",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: ["C3", "C4"],
    l5Pattern: "future-proofing",
    question:
      "A candidate has done well on senior loops historically: thorough basics, two strong deep dives. Their loop is bumped to staff. They use the same approach. Result: 'no hire — staff signal absent.' The senior approach worked at senior; what specifically *broke* when staff was added on top, and why does this fit the 'works today, breaks when feature X is added' pattern?",
    options: [
      "Staff rounds are graded purely on architecture beauty.",
      "At staff+, the rubric's center of gravity shifts from 'basics fast + deep dives' to 'breadth-of-influence and systemic / org-level reasoning' — concerns like cross-team API contracts, migration paths, deprecation strategy, build-vs-buy decisions, and downstream effects on engineers building on top of the system. The senior playbook (basics + deep dives) stops short of those levels of indirection. The same approach worked at senior because depth-in-component sufficed; it breaks at staff because the bar requires depth-in-system + organizational consequence. Same candidate, same approach, broken when 'staff' was added — exactly the future-proofing failure pattern.",
      "Staff candidates need to draw on a whiteboard.",
      "Staff and senior are graded identically; the candidate just got an unlucky panel.",
    ],
    correctIndex: 1,
    explanation:
      "L5 future-proofing: the senior playbook is correctly tuned for senior; it doesn't generalize to staff+. The 'feature added' here is the level itself. Staff+ requires reasoning at a higher level of indirection (the system's effects on the org, not just on the user), and the senior playbook doesn't reach that level by design.\n\nWhy A and D are tempting: A imagines staff is just senior with prettier diagrams (ignores the indirection shift). D denies the level distinction.",
    interviewScript:
      "If you're flexing up to staff, pick one or two of these *during the interview*: 'how does this design constrain teams that build on top of it?', 'what's the migration path from the existing system?', 'where does this design create or remove organizational coupling?' Voice them out loud during your deep dive.",
    proTip:
      "L5 future-proofing: a pattern that works at one level can break when the level (or any other implicit context) is added on top. Senior-level mastery is recognizing the implicit context that makes today's pattern work.",
  },

  // ============== PART D — Problem Navigation (Pillar 1) ==============
  {
    id: "q16",
    part: "D — Problem Navigation",
    subtopic: "Problem Navigation",
    difficulty: "L1",
    style: "Anti-Pattern Identification",
    conceptIds: ["D1", "D2", "D3"],
    l5Pattern: null,
    question:
      "A candidate is given: 'design a system to send notifications to users.' They immediately start drawing services and queues without asking what kind of notifications, what scale, what latency tolerance, or what failure semantics are acceptable. *Independent of whether their final architecture happens to be correct*, what capability are they most clearly weak on?",
    options: [
      "Technical knowledge — they're drawing the wrong components.",
      "The ability to navigate an under-specified problem — turning a high-level prompt into a focused, prioritized scope before solving it. Even if their guessed architecture happens to be correct, the interviewer can't distinguish 'correct by reasoning' from 'correct by lucky guess' because the requirements were never made explicit.",
      "Communication — they're not talking enough.",
      "They drew too few components to start with.",
    ],
    correctIndex: 1,
    explanation:
      "Problem Navigation is the ability to take an ambiguously-defined problem, decompose it, prioritize the important pieces, and proceed deliberately. Skipping requirements is the textbook navigation failure — and it's often the most important pillar because everything downstream depends on it. The downstream signal is also lost: the interviewer can't grade reasoning that wasn't shown.",
    interviewScript:
      "Start every SD interview with the same opening: 'Before I sketch anything, let me make sure I understand the scope. I'll ask 4-5 clarifying questions and then propose what I think we should focus on.' That single move guarantees you don't fail the navigation pillar in the first 60 seconds.",
    proTip: null,
  },
  {
    id: "q17",
    part: "D — Problem Navigation",
    subtopic: "Problem Navigation",
    difficulty: "L2",
    style: "Failure Analysis",
    conceptIds: ["D3", "D4", "D5", "D6"],
    l5Pattern: null,
    question:
      "Two candidates fail at the same point: 25 minutes in, both have 12 components on the whiteboard but neither has a clear story for how a write request flows end-to-end. Candidate X spent 15 minutes asking detailed clarifying questions and never moved past requirements. Candidate Y added components rapidly and skipped clarifying entirely. Both end up with no working design at minute 25. Are these the same failure or different failures, and what's the fix for each?",
    options: [
      "They're the same failure — neither delivered a working design.",
      "They're symmetric failures around the same core skill (Problem Navigation), but with different specific failures. X is failing by *getting stuck in requirements* — never moving forward to deliver. Y is failing by *not exploring the problem at all* — jumping to solutions without prioritizing. Same outcome (no working design) from opposite directions. X's fix: time-box requirements to 5-7 minutes and force a transition. Y's fix: pause and explicitly list what's important before drawing.",
      "X is a Communication failure; Y is a Tech failure.",
      "Both are doing fine; the timer is wrong.",
    ],
    correctIndex: 1,
    explanation:
      "These are two distinct failure modes: insufficient exploration of the problem (Y) vs getting stuck on a piece and unable to move forward (X). Both fail to deliver a working system. Recognizing which one *you* tend toward in your own practice is high-leverage, because the fixes are opposite.",
    interviewScript:
      "Self-diagnose by recording your mock interviews: do you tend to over-clarify (X-pattern) or under-clarify (Y-pattern)? The fix for each is different.",
    proTip:
      "Opposites together: under-clarifying and over-clarifying are mirror failures of the same skill. Most candidates lean strongly toward one of the two; know which one is yours.",
  },
  {
    id: "q18",
    part: "D — Problem Navigation",
    subtopic: "Problem Navigation",
    difficulty: "L3",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["D4", "D7", "D8"],
    l5Pattern: null,
    question:
      "You're 20 of 45 minutes into an SD interview. Full requirements + a high-level architecture are done. Three areas could be deep-dived: (a) database schema and indexing, (b) cache strategy and consistency, (c) message queue design and ordering. You can do *one* well or *two* poorly. The interviewer hasn't signaled which they care about. What is the correct navigation move, and why is picking blindly worse than asking?",
    options: [
      "Pick the area you know best, regardless of interviewer signal — confidence is what matters.",
      "Ask: 'I have time to go deep on one or two of these — which would you find most valuable given the problem?' This avoids depth-on-the-wrong-thing (a navigation failure) *and* signals that you're calibrating to interviewer interest, which is itself a senior behavior. Picking blindly is structurally risky: a great deep dive on the wrong topic produces less signal than a good deep dive on the priority topic, because what's being graded is whether the depth lands on the area the interviewer cares about.",
      "Try to do all three shallowly to be safe.",
      "Skip the deep dives and add more components instead.",
    ],
    correctIndex: 1,
    explanation:
      "The Delivery Framework's emphasis on structure includes choosing where to go deep deliberately rather than randomly. Asking the interviewer is not a sign of weakness — it's a sign of calibration, which is exactly what senior+ candidates do. The deep-dive topic is graded on *match-to-priority*, not just on quality.",
    interviewScript:
      "Memorize the script: 'I have time to go deep on one or two of these — [list them]. Which would be most useful to you?' Most interviewers will give you a direct answer. The question itself adds signal.",
    proTip:
      "Asking 'where would you like me to go deep?' is rarely seen as weakness; it's seen as professional calibration. Confidence isn't picking blindly — it's choosing well.",
  },
  {
    id: "q19",
    part: "D — Problem Navigation",
    subtopic: "Problem Navigation",
    difficulty: "L4",
    style: "Cross-Part Bridge",
    conceptIds: ["D7", "D8", "G6", "G2"],
    l5Pattern: null,
    question:
      "Your interviewer says: 'I think you're getting stuck on the queue-ordering question — let's move on.' You've spent 8 minutes on it and feel close. Two responses: Candidate X says 'OK' and moves on. Candidate Y says 'OK — but if it turns out to matter for the design, I'd like to come back to it. Can we revisit at the end if there's time?' Which gets stronger Problem-Navigation signal, and why does Y's response also score on the Communication pillar even though X complies more directly?",
    options: [
      "X — interviewers always know best; immediate compliance is the right move.",
      "Y. Problem Navigation rewards *structured* movement, including knowing when to defer something rather than abandon it. X's 'OK' loses signal because they're allowing the interviewer to drive their navigation rather than navigating themselves. Y demonstrates control of the interview's structure: accepting the redirect *and* time-boxing a return — which is what the Delivery Framework's structured approach prescribes. Y also scores on Communication because they're working *with* the interviewer rather than reactively complying — the collaborative posture the rubric rewards.",
      "They're equivalent — same final action.",
      "X — Y is being argumentative.",
    ],
    correctIndex: 1,
    explanation:
      "The Delivery Framework gives you a track to run on; you should still be the one driving the train. Y's response respects the interviewer's redirect (no defiance) while keeping ownership of the structure (defer, return). That's exactly the navigation pattern the rubric grades, and it doubles as a collaboration signal because it engages with the interviewer rather than just complying.",
    interviewScript:
      "Practice this exact phrasing: 'OK, I'll move on — if it turns out to matter for the design later, can we come back?' It costs nothing to say and adds two pillars of signal at once.",
    proTip:
      "Cross-Part bridge: this is D (navigation under structure) × G (collaborative communication) — two pillars at the same moment.",
  },
  {
    id: "q20",
    part: "D — Problem Navigation",
    subtopic: "Problem Navigation",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: ["D2", "D4", "D6"],
    l5Pattern: "two-levels-of-indirection",
    question:
      "A candidate is doing well: requirements clear, scale numbers correct, high-level architecture solid at minute 18 of 45. The interviewer asks an innocent-sounding follow-up: 'so what does the read path look like for the home feed?' The candidate launches into a detailed answer and ends up 35 minutes deep into read-path optimization. They never get to anything else. They feel they did well because the read-path explanation was excellent. The interview almost certainly does not pass at senior level. What is the *real* Problem-Navigation failure here, two levels removed from the surface?",
    options: [
      "The read-path optimization wasn't deep enough.",
      "Surface signal: 'I gave a great answer to the interviewer's question.' Deeper signal (one level down): 'I let myself get stuck on a single component and didn't move on.' But the *real* failure (two levels down) is different: the interviewer's question was a *sub-question*, not a redirect — and the candidate let an innocent prompt control their entire time budget. The Problem-Navigation failure isn't 'getting stuck' (the obvious read), it's 'failing to budget time across the whole problem when the interviewer asks something that *seems* like a small dive.' The senior+ move: answer with depth *and* explicitly flag time — 'I'll cover this in 5 minutes, then move to write path and scaling concerns.'",
      "The candidate spoke too quickly.",
      "The interviewer should have stopped them.",
    ],
    correctIndex: 1,
    explanation:
      "L5 two-levels-of-indirection: the obvious failure (got stuck) is the level-1 read. The real failure (level-2) is that the candidate's time budget was hijacked by an *innocent-looking* sub-question, not by an explicit redirect. Senior+ candidates protect the time budget proactively — by stating their intended budget out loud, they make hijacking visible to themselves and the interviewer.\n\nWhy A and D are tempting: A treats it as a depth issue (more depth would have helped — false: the depth was the problem). D blames the interviewer (interviewers can probe with sub-questions; managing budget is the candidate's job).",
    interviewScript:
      "Halfway through any deep dive, say out loud: 'I'll wrap this in N minutes and move to [next thing].' The verbal commitment forces you to honor your time budget — and demonstrates Problem Navigation as a meta-skill.",
    proTip:
      "L5 two-levels-of-indirection: when a candidate fails, the obvious failure is rarely the real one. Train yourself to ask 'what's the failure underneath the failure?' both in your prep and in the interview itself.",
  },

  // ============== PART E — Solution Design (Pillar 2) ==============
  {
    id: "q21",
    part: "E — Solution Design",
    subtopic: "Solution Design",
    difficulty: "L1",
    style: "Anti-Pattern Identification",
    conceptIds: ["E1", "E4"],
    l5Pattern: null,
    question:
      "A candidate's whiteboard has all the right components: load balancer, app servers, cache, sharded DB, message queue, search index. But when the interviewer traces a write request, the candidate stumbles: they can't say which component receives the write first, where authentication happens, or how the cache stays coherent with the database. *Independent of the components being correct*, what is most accurately wrong with the design?",
    options: [
      "They picked the wrong components — fewer components would have been better.",
      "The components are individually justified but there's no end-to-end *story* showing how a request flows through them. That's a structural failure: the design has the right boxes without a coherent shape — what's commonly called 'spaghetti design.' It's distinct from 'doesn't know the tech' (each box is correct in isolation) and from 'didn't gather requirements' (the components match the problem). The fix is to redraw the architecture and explicitly walk a request through it end-to-end.",
      "Their handwriting was bad.",
      "They needed to add more components.",
    ],
    correctIndex: 1,
    explanation:
      "Solution Design is solving each piece *and* showing how the pieces fit together into a cohesive whole. Right boxes + no shape = a structural Solution-Design failure that's independent of technical knowledge. The fix is structural (re-shape the design), not technical (add more tech).",
    interviewScript:
      "After you sketch the high-level architecture, *always* walk a request end-to-end out loud: 'a write comes in here, hits this LB, gets authenticated by this service, ends up here ...' If you can't tell the story, the design isn't done yet.",
    proTip:
      "End-to-end walk-through is the cheapest way to catch your own spaghetti before the interviewer does.",
  },
  {
    id: "q22",
    part: "E — Solution Design",
    subtopic: "Solution Design",
    difficulty: "L2",
    style: "Cross-Part Bridge",
    conceptIds: ["E2", "E5", "F1", "F4"],
    l5Pattern: null,
    question:
      "Two failure feedback notes from different interviews. (a) 'I had to explicitly tell them about Cassandra; they didn't seem to know what to use for the write-heavy workload.' (b) 'They proposed Cassandra immediately but couldn't explain why it fits the workload's specific needs.' Which one is a Solution-Design failure (insufficient core-concept understanding) vs a Technical-Excellence failure (didn't know the option exists), and what's the *practical* difference for how the candidate would prepare?",
    options: [
      "Both are the same failure with different surface presentations.",
      "(a) is a Technical-Excellence gap — the candidate didn't know the option exists. (b) is a Solution-Design gap — knew the option but couldn't reason from problem characteristics to tech choice. The practical difference: (a) is fixed by *learning more tech*; (b) is fixed by *practicing the connection from workload characteristics to tech choice*. Memorizing more tech does not fix (b), and learning to reason about trade-offs does not fix (a). They're orthogonal preparations.",
      "(a) is Communication; (b) is Navigation.",
      "Both are Technical Excellence.",
    ],
    correctIndex: 1,
    explanation:
      "Solution Design and Technical Excellence are adjacent but distinct pillars. Knowing the tool (TE) is necessary; reasoning from the problem to the tool (SD) is the next layer. Failing at TE means you don't reach for Cassandra; failing at SD means you reach for Cassandra without justification. Interviewers probe to detect *which* failure they're seeing — the fixes are different.",
    interviewScript:
      "When you propose any technology, force yourself to say: 'I'm choosing X because the workload has [specific characteristic]; if it had [different characteristic], I'd choose Y instead.' That single sentence covers the SD signal interviewers grade.",
    proTip:
      "Cross-Part bridge: E (reasoning from problem to tech) × F (knowing the tech). Most candidates have one and not the other — diagnose which one is your weakness.",
  },
  {
    id: "q23",
    part: "E — Solution Design",
    subtopic: "Solution Design",
    difficulty: "L3",
    style: "Interviewer Pushback",
    conceptIds: ["E1", "E3", "E5", "E6"],
    l5Pattern: null,
    question:
      "You propose Postgres for the feed system. The interviewer asks: 'why not Cassandra? Wouldn't that scale better?' You answer 'Postgres is fine for our scale.' The interviewer presses: 'but why specifically *not* Cassandra?' You're stuck — you mostly know Postgres. What's the most accurate diagnosis, and what's the fastest recovery move that demonstrates Solution-Design competency rather than evasion?",
    options: [
      "You chose the wrong DB — switch to Cassandra immediately.",
      "Diagnosis: you defended a choice without articulating the trade-off against the alternative — Solution Design demands you can name what you're trading away by *not* choosing the alternative. Recovery: be explicit. 'I'm trading Cassandra's write scalability for Postgres's transaction guarantees and lower operational complexity, given the scale we agreed on. If write QPS were 10x higher, I'd revisit.' This converts a defensive answer into a reasoned trade-off — which is the actual signal being graded.",
      "The interviewer is being unfair; push back firmly.",
      "Switch to MongoDB to avoid the Cassandra question entirely.",
    ],
    correctIndex: 1,
    explanation:
      "A defended choice that doesn't name the trade-off looks like a memorized choice — exactly what interviewers probe for. The recovery isn't switching tech; it's articulating the trade-off out loud. This works even when you don't know the alternative deeply: 'I'm trading away X (Cassandra's write scaling) for Y (Postgres's transactions + simpler ops)' is the reasoning the rubric grades. Naming what you're trading is the move.",
    interviewScript:
      "Memorize: 'I'm choosing X because [workload property]. By choosing X over Y, I'm trading [Y's strength] for [X's strength]. If [property] were different, I'd revisit.' Use this every time you pick a piece of tech.",
    proTip: null,
  },
  {
    id: "q24",
    part: "E — Solution Design",
    subtopic: "Solution Design",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["E2", "E5", "E6"],
    l5Pattern: null,
    question:
      "Mid-design, the interviewer says: 'you've correctly identified that we need a queue here, but I don't see how this design handles the case where the consumer crashes mid-message.' Two candidates: X immediately answers 'we use Kafka with consumer groups and offsets — handles failover.' Y says 'right, the basic queue doesn't address this — let me think about acknowledgment semantics: at-most-once vs at-least-once vs exactly-once, and what the application can tolerate.' Which response gives stronger Solution-Design signal at senior level, and why specifically?",
    options: [
      "X — they answered immediately and correctly.",
      "Y. Naming Kafka without reasoning is a *technology-recall* answer, not a Solution-Design answer. Y demonstrates the actual concept — delivery semantics and application tolerance — *before* picking a tool. Interviewers specifically probe for this distinction: X's answer is the textbook 'memorized' shape that the rubric warns about. Y is what 'understanding the core concepts to solve the problem' looks like in practice — the concept first, then the tool that implements it.",
      "Both are equivalent.",
      "X — Y is overthinking.",
    ],
    correctIndex: 1,
    explanation:
      "Interviewers test whether candidates have memorized answers vs reasoned them. X's instant 'Kafka' is technically correct but doesn't show the underlying concept; Y demonstrates the concept (delivery semantics, application tolerance) and then maps it to a tool. The same eventual answer earns very different signals because the rubric grades the path, not just the destination.",
    interviewScript:
      "When asked about failure modes, *always* reason from semantics first: 'this is fundamentally a question about [delivery semantics / consistency / availability]. Given [the workload], we need [property]. Kafka gives us [property] via [mechanism].'",
    proTip:
      "L4 senior-pushback: when the easy answer is the named tool, the senior move is to expose the underlying concept *and then* name the tool.",
  },
  {
    id: "q25",
    part: "E — Solution Design",
    subtopic: "Solution Design",
    difficulty: "L5",
    style: "Interviewer Pushback",
    conceptIds: ["E5", "E6"],
    l5Pattern: "adversarial-pushback",
    question:
      "You're 35 minutes into the interview. Your design is solid. The interviewer says: 'are you sure about your cache invalidation strategy?' You restate. They say 'are you sure?' again. You restate with more conviction. They say 'are you sure?' a third time. Most candidates either fold (change the answer) or harden (repeat louder with confidence). Both lose senior+ signal. What is the move that earns staff-level signal, and why is repetition-with-confidence specifically the wrong move *even though confidence is generally a positive signal*?",
    options: [
      "Stand your ground — confidence is always rewarded.",
      "The interviewer is collecting two signals: (1) was your answer reasoned or memorized? and (2) can you be moved by *valid* objections without folding to *invalid* ones? Repetition-with-confidence shows confidence but no engagement with the objection, which reads as 'memorized.' Folding shows you didn't reason it. The staff move: 'what specifically concerns you about it?' — surface the actual objection. If they raise something you'd missed, you update; if not, you've shown the confidence came from reasoning. Repetition-with-confidence fails because it doesn't distinguish reasoned-confidence from memorized-confidence — and that distinction is *exactly* what the interviewer is trying to make.",
      "Change the answer immediately.",
      "Refuse to answer until the interviewer states their concern.",
    ],
    correctIndex: 1,
    explanation:
      "L5 adversarial-pushback: 'are you sure?' three times is a deliberate probe. The naive response (confidence!) is a trap because confidence-without-engagement is the signature of memorization. The senior move is to surface the objection — converting the probe into a collaborative check. If you turn out to be wrong about the wrong thing, you update; if you're right, your confidence is now visibly reasoned.\n\nWhy A and C are tempting: A treats confidence as universally good (it isn't — only reasoned confidence is). C treats compliance as safe (it isn't — folding to invalid pushback is its own failure).",
    interviewScript:
      "When pushed, *always* engage the substance: 'what specifically concerns you?' Then either update on a real concern or articulate why the choice still holds. Either way you've shown reasoning, which is what was being probed.",
    proTip:
      "L5 adversarial-pushback: the interview's most adversarial-feeling moments are usually the highest-leverage signal opportunities. Engage substance, not posture.",
  },

  // ============== PART F — Technical Excellence (Pillar 3) ==============
  {
    id: "q26",
    part: "F — Technical Excellence",
    subtopic: "Technical Excellence",
    difficulty: "L1",
    style: "Anti-Pattern Identification",
    conceptIds: ["F3", "F6"],
    l5Pattern: null,
    question:
      "A candidate is sizing their database sharding strategy. Their reasoning out loud: 'a typical hard drive does about 100 IOPS, so to handle our 50K writes/sec we'll need at least 500 shards.' Independent of whether sharding is the right answer, what's wrong with their reasoning?",
    options: [
      "Sharding is always wrong — they should denormalize instead.",
      "The 100-IOPS figure is a spinning-disk-era number. Modern NVMe SSDs do hundreds of thousands of IOPS per drive; the candidate is solving a problem that no longer exists at the scale they're sizing for. This is the textbook 'antiquated approach / outdated hardware constraint' — knowing a number that *was* true a decade ago but is now stale, and using it to drive a design decision that adds unnecessary complexity.",
      "They picked the wrong DB.",
      "100 IOPS is correct; sharding is unnecessary.",
    ],
    correctIndex: 1,
    explanation:
      "Hardware has not stood still — much SD material is still anchored in 2015-era assumptions. A modern NVMe SSD does ~100K-1M IOPS depending on workload; a single Postgres instance can sustain 50K+ writes/sec on commodity hardware. Sizing decisions made on stale numbers produce over-engineered designs that fail to recognize what current hardware can do. The Technical-Excellence failure is reasoning from outdated constraints.",
    interviewScript:
      "Whenever you cite a hardware number, mentally tag the year. If your number is from a textbook published before 2018, double-check it before using it as the basis of a design decision.",
    proTip:
      "Common stale numbers to *unlearn*: 100 IOPS for disks (NVMe is ~100x more), 1 Gbps networks (10/100 Gbps in datacenters), 'memory is expensive' (a TB of RAM in a server is routine).",
  },
  {
    id: "q27",
    part: "F — Technical Excellence",
    subtopic: "Technical Excellence",
    difficulty: "L2",
    style: "Failure Analysis",
    conceptIds: ["F1", "F2", "F4"],
    l5Pattern: null,
    question:
      "Two candidates fail in opposite ways. Candidate X chose MySQL for everything because it's the only DB they know. Candidate Y chose six different specialized datastores (Cassandra, Redis, Elasticsearch, S3, Postgres, Kafka) for a small system that didn't need that complexity. Both are Technical-Excellence failures, but they're *opposite* in flavor. What's each one's specific failure, and what skill do they share underneath?",
    options: [
      "Both are 'didn't know enough tech' — same failure.",
      "X's failure: not knowing about available technologies (limited toolbox) — solution forced into the only tool they have. Y's failure: not knowing how to *apply* technologies to the problem (knowing too many, applied indiscriminately). The shared underlying skill: matching the workload's *actual* needs to a *minimum-complexity* tech choice. X under-matches because they don't know alternatives; Y over-matches because they don't pick. Both fail the same rubric — application of knowledge — from opposite directions.",
      "X is a Solution-Design failure; Y is a Communication failure.",
      "They're both Communication failures.",
    ],
    correctIndex: 1,
    explanation:
      "Knowing technologies and knowing how to *apply* them are distinct sub-skills under Technical Excellence. X has the first weakness; Y has the second. Both fail at picking the right tool for the workload — but the fixes are opposite. Under-toolbox candidates need to expand their kit; over-toolbox candidates need to discipline their selection.",
    interviewScript:
      "For each piece of tech you propose, ask out loud: 'is the simpler option insufficient here, and why?' That single question protects you against both failure modes — it makes your selection process visible and constrained.",
    proTip:
      "Opposites together: X (under-match) and Y (over-match) are mirror failures. Diagnose which way you tend to lean and prepare accordingly.",
  },
  {
    id: "q28",
    part: "F — Technical Excellence",
    subtopic: "Technical Excellence",
    difficulty: "L3",
    style: "Cross-Part Bridge",
    conceptIds: ["F3", "F6", "F7", "D1"],
    l5Pattern: null,
    question:
      "Interviewer: 'how would you handle 100K writes per second to your database?' Your reflex is 'the database can't handle that — I need to shard.' You propose sharding the user-id space across 32 shards. Before the interviewer responds, what conceptual check should you run on your own answer that distinguishes a Technical-Excellence response from a memorized-pattern response?",
    options: [
      "Check that 32 is the right number of shards.",
      "Check whether 100K writes/sec actually exceeds modern hardware capacity. A single Postgres instance on modern NVMe can sustain 50K+ writes/sec; with primary + read replicas, 100K writes/sec is within reach without sharding. The 'shard immediately' instinct is the antiquated-hardware reflex. The Technical-Excellence move is to do the back-of-envelope check with current numbers first, then decide. Sharding may still be the right answer — but the *reasoning that gets you there* is what's graded, and it requires acknowledging that the alternative (vertical / replicated, no shard) is plausible.",
      "Check that the user-id space is hash-distributable.",
      "Check that the rack has enough physical space.",
    ],
    correctIndex: 1,
    explanation:
      "The 'numbers to know' pattern matters here: knowing modern write-throughput numbers prevents the reflex jump to sharding. The deeper signal is also Problem-Navigation — running the math first is a *navigation* move (don't solve a problem you don't have). The cross-part bridge: F (current numbers) drives D (don't solve the wrong problem).",
    interviewScript:
      "Anytime you're about to propose a complexity-adding pattern (sharding, microservices, multi-region), force yourself to do 30 seconds of math first: 'does the simpler option fail the requirement? Let me check.' If it doesn't fail, the simpler option wins.",
    proTip:
      "Cross-Part bridge: F (modern numbers) × D (don't solve the wrong problem). Stale numbers create phantom problems that drive unnecessary complexity.",
  },
  {
    id: "q29",
    part: "F — Technical Excellence",
    subtopic: "Technical Excellence",
    difficulty: "L4",
    style: "Implementation-Specific Nuance",
    conceptIds: ["F1", "F5"],
    l5Pattern: null,
    question:
      "You propose 'we'll use REPEATABLE READ isolation to prevent phantom reads in this transaction.' Your interviewer asks: 'which database?' You answer 'Postgres.' They smile. What conceptual gotcha is the smile most plausibly about, and why does this single question separate Technical-Excellence-mid from Technical-Excellence-senior?",
    options: [
      "REPEATABLE READ is fine in Postgres; the interviewer is being friendly.",
      "Postgres's REPEATABLE READ uses snapshot isolation that prevents many phantoms but with serialization-anomaly behavior different from MySQL/InnoDB's REPEATABLE READ (which uses gap locks). The SQL standard *names* the isolation level the same; the *implementations* behave differently. Mid-level Technical Excellence treats 'REPEATABLE READ' as a single concept across vendors. Senior recognizes that the standard names a guarantee that vendors implement with different mechanisms — and the differences matter for correctness in specific scenarios. The smile is the interviewer recognizing a depth probe is now warranted.",
      "Postgres doesn't have REPEATABLE READ.",
      "The candidate should have said SERIALIZABLE instead.",
    ],
    correctIndex: 1,
    explanation:
      "SQL standards specify an *outcome guarantee*, not an *implementation*. Postgres uses snapshot isolation; MySQL/InnoDB uses gap locks; the user-visible behavior under specific concurrent workloads differs. Senior-level Technical Excellence requires distinguishing standard-name from vendor-implementation — exactly the kind of gotcha that separates 'knows the term' from 'knows the system.'",
    interviewScript:
      "When you cite an isolation level, specify the engine: 'in Postgres REPEATABLE READ ...' or 'in MySQL InnoDB REPEATABLE READ ...' Naming the engine signals you know there's a difference.",
    proTip:
      "Build a small mental table of common standards-vs-implementations gaps: SQL isolation levels, JSON behavior across DBs, NULL semantics, time-zone handling. These are reliable senior-level depth probes.",
  },
  {
    id: "q30",
    part: "F — Technical Excellence",
    subtopic: "Technical Excellence",
    difficulty: "L5",
    style: "Estimation-Backed Reasoning",
    conceptIds: ["F1", "F4", "F7"],
    l5Pattern: "estimation-backed-scenario",
    question:
      "Senior interview. You're proposing Redis for a global leaderboard with 'O(log N) sorted-set operations.' The interviewer says: '50M users, 200K score updates per second at peak. Walk me through the math.' Most candidates re-state the O(log N) and add 'Redis is fast enough.' The interviewer keeps probing. What does the staff+ candidate compute, and why do the numbers force a *different* recommendation in some realistic scenarios that pure asymptotic reasoning would miss?",
    options: [
      "Stay with single-node Redis — O(log N) is always fast enough.",
      "Single-node Redis ZADD is roughly ~0.1ms in-memory, but the network + serialization round-trip pushes per-op latency to ~0.3-1ms over LAN. 200K writes/sec × 0.3ms = ~60% utilization on a single Redis node — near the edge for headroom. Under burst (trending events, post-game spikes), tail latency explodes past 100% and clients time out. The math forces either sharded Redis (split the leaderboard into N shards, merge top-K at read time) or an approximate data structure (Count-Min Sketch + heap for top-K). Without doing the math, 'Redis is fast' sounds correct but breaks in production. The senior+ move: do the math out loud during the interview.",
      "Switch to Postgres because Redis can't handle it.",
      "Add a CDN.",
    ],
    correctIndex: 1,
    explanation:
      "L5 estimation-backed-scenario: the asymptotic answer (O(log N)) is correct in theory but the constant factors (network, serialization, single-thread Redis) bite at this scale. Doing the back-of-envelope math during the interview demonstrates senior-level technical fluency — and forces the design pivot that pure asymptotic reasoning misses. Staff candidates typically have a small bag of these numbers (Redis ZADD latency, Postgres write throughput, NVMe IOPS, network RTT within DC) at hand specifically because the interview math depends on them.\n\nWhy A and C are tempting: A trusts asymptotics without checking constants. C abandons the right tool when the issue is sizing, not tool fit.",
    interviewScript:
      "Out loud during sizing: 'let me check this — 200K ops/sec × 0.3ms per op = 60ms of CPU time per second, so 60% of a single Redis core. Headroom is tight for bursts; I'd shard the leaderboard.' That math, said out loud, is the senior signal.",
    proTip:
      "L5 estimation-backed-scenario: keep a small list of latency/throughput numbers in working memory — they're what convert asymptotic reasoning into senior-level reasoning.",
  },

  // ============== PART G — Communication and Collaboration (Pillar 4) ==============
  {
    id: "q31",
    part: "G — Communication and Collaboration",
    subtopic: "Communication & Collaboration",
    difficulty: "L1",
    style: "Anti-Pattern Identification",
    conceptIds: ["G1", "G2", "G4", "G5"],
    l5Pattern: null,
    question:
      "A candidate's design is technically excellent. Mid-interview, the interviewer says: 'I'm having trouble following — could you walk me through where the cache fits in the read path?' The candidate replies: 'I already covered that. The cache is in the read path. Next question?' The interviewer's note afterward says: 'tech is solid; concerns about working with this person.' Which pillar is being flagged, and what *specifically* signaled the concern?",
    options: [
      "Technical Excellence — the cache placement was wrong.",
      "Communication & Collaboration — the candidate's response was dismissive of the interviewer's confusion. The signal isn't 'they don't know caching' (tech is fine) — it's 'how would it feel to have this person on the team when a peer asks for clarification?' Re-explaining is free; refusing to do so reads as defensive or arrogant. The actual failure isn't the technical answer — it's the *response to the confusion itself*.",
      "Solution Design — the design was unclear.",
      "Problem Navigation — they didn't gather requirements.",
    ],
    correctIndex: 1,
    explanation:
      "The interview is a sample of what working with the candidate would feel like. Re-explaining when asked is part of normal collaboration; refusing reads as defensive regardless of whether the original explanation was clear. The concern isn't about caching — it's about colleague-fit, which is exactly what the Communication pillar measures.",
    interviewScript:
      "Default-answer requests for clarification with: 'sure, let me walk through it again' — even when you think you covered it. The cost of re-explaining is near-zero; the cost of looking dismissive is high.",
    proTip: null,
  },
  {
    id: "q32",
    part: "G — Communication and Collaboration",
    subtopic: "Communication & Collaboration",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["G1", "G2", "G3"],
    l5Pattern: null,
    question:
      "Two candidates respond differently to 'I'm not sure about your sharding strategy.' Candidate X: 'Here's why it's correct — [3-minute defense].' Candidate Y: 'What concerns you specifically? I want to make sure I understand which part you're questioning.' Both responses come from genuine confidence in the answer. Which one demonstrates better Communication-and-Collaboration signal, and what *specifically* distinguishes them?",
    options: [
      "X — they defended their answer confidently.",
      "Y. Communication isn't 'speak well'; it's 'work *with* the interviewer.' X's response delivers a monologue without first checking what was actually being asked. Y's response opens collaboration — surfaces the actual concern, which lets them either (1) address the real objection, or (2) discover the interviewer was just probing. Same confidence, but Y is collaborating; X is presenting. Senior interviews specifically grade this distinction because day-to-day teamwork looks more like Y than like X.",
      "They're equivalent.",
      "X — speaking longer is always better.",
    ],
    correctIndex: 1,
    explanation:
      "Collaborative communication asks before answering. X's monologue assumes the interviewer's concern; Y's clarifying question reveals it. The same answer with Y's framing produces more signal because it shows the candidate is engaging with the interviewer's reasoning rather than running a script. Confidence is fine; non-engaged confidence is the problem.",
    interviewScript:
      "When pushed, lead with: 'what concerns you specifically?' Then either address the real concern or articulate why the choice still holds. The clarifying step is itself the Communication signal.",
    proTip: null,
  },
  {
    id: "q33",
    part: "G — Communication and Collaboration",
    subtopic: "Communication & Collaboration",
    difficulty: "L3",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["G3", "G5"],
    l5Pattern: null,
    question:
      "Interviewer: 'I think your database choice is wrong; you should be using DynamoDB.' You're sure your choice is right. Three responses: (a) 'OK, switch to DynamoDB' (folds). (b) 'I disagree — here's why I'm right' [3-minute defense without acknowledging concern] (defends). (c) 'Help me understand — what's the specific concern with my choice? If it's [X], here's why I think the trade-off works; if it's [Y], I might be missing something' (engages). Which best demonstrates Communication-and-Collaboration, and *why* is (c) better than (b) when both refuse to fold?",
    options: [
      "(a) — agree with the interviewer.",
      "(c). (b) defends without engaging the actual concern, which reads as defensive *even when correct* — the rubric isn't grading correctness in isolation, it's grading whether the candidate can be moved by valid objections without folding to invalid ones. (c) explicitly enumerates what the concern *might* be, addresses each plausibly, and leaves room to be moved by an objection the candidate didn't anticipate. The Communication signal isn't 'I'm willing to be moved' (folding) and isn't 'I'm sure I'm right' (defending) — it's 'I'm engaging with whether I should be moved.' That's the collaborative signal, and it's separable from being right.",
      "(b) — confidence wins.",
      "All three are equivalent.",
    ],
    correctIndex: 1,
    explanation:
      "Folding (a) tells the interviewer your answers can be pushed without reason. Defending (b) tells them you don't engage with concerns. Engaging (c) demonstrates the collaborative posture — open to being moved by *valid* objections, willing to defend against *invalid* ones, and explicit about which is which. Being right is necessary but not sufficient for the Communication pillar.",
    interviewScript:
      "Whenever an interviewer pushes against a choice, prefix your response with the engagement step: 'help me understand the concern — is it [X] or [Y]?' Then address each, conditional on the answer.",
    proTip: null,
  },
  {
    id: "q34",
    part: "G — Communication and Collaboration",
    subtopic: "Communication & Collaboration",
    difficulty: "L4",
    style: "Cross-Part Bridge",
    conceptIds: ["G3", "G4", "E4"],
    l5Pattern: null,
    question:
      "Mid-interview, you've designed a plausible system. The interviewer says: 'I'm confused about your design — can you redraw the high-level architecture?' Two effects are happening at once: (1) the interviewer can't follow your design (Communication issue), and (2) the design itself may have structural unclarity (Solution-Design / spaghetti issue). What's the *correct* response that addresses both pillars at the same moment, and what would the wrong move look like?",
    options: [
      "Redraw the same diagram more neatly.",
      "Pause, redraw the architecture from scratch with explicit numbered components (not the previous sketch with notations layered on), then walk a request end-to-end through the new diagram. This treats the interviewer's confusion as evidence that *the design's shape* was unclear — not just *your explanation*. Wrong move: treating it purely as a Communication issue (talk slower, repeat the same words) without restructuring the diagram. That fails because the structural unclarity persists; the interviewer will still be lost after the second explanation. The fix lives at both pillars at once.",
      "Skip the redraw and move to deep dives.",
      "Tell the interviewer to look more carefully.",
    ],
    correctIndex: 1,
    explanation:
      "Cross-Part bridge G × E: a confused interviewer is evidence about *both* communication and design structure. Redrawing forces both fixes at once: the act of redrawing exposes structural problems (which is where Solution-Design fails are caught), and the act of walking a request end-to-end is the Communication fix. Repeating the same explanation more clearly is a Communication-only patch that ignores the structural issue.",
    interviewScript:
      "When asked to redraw, *don't* annotate the old diagram. Start a fresh region of the whiteboard, label components 1, 2, 3, ..., and trace one request end-to-end through them. The discipline of starting fresh is what catches your own spaghetti.",
    proTip:
      "Cross-Part bridge: G (Communication) × E (Solution Design). Confusion is data about both pillars; the fix has to live at both.",
  },
  {
    id: "q35",
    part: "G — Communication and Collaboration",
    subtopic: "Communication & Collaboration",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: ["G5", "G4"],
    l5Pattern: "framing-is-wrong",
    question:
      "An interviewer gives a candidate explicit feedback: 'your design ignores the failure case where the queue consumer goes down.' The candidate responds: 'I disagree — Kafka has consumer groups, so failover is automatic, the queue doesn't go down.' This is technically correct. The interviewer's note: 'defensive — concerns about feedback handling.' The candidate believes the rubric punished them for being *wrong* when they were actually *right*, so the rating is unfair. What is the staff+ insight that explains why being technically correct can still earn a Communication failure, and what's the move the candidate should have made instead?",
    options: [
      "The rubric is unfair — being right should always pass.",
      "The framing 'I should be rewarded for being right' is wrong. The interviewer's feedback may have been technically incorrect, but the *signal being collected* is 'how does this person handle feedback when working on a team?' A defensive correction in 5 seconds reads as 'I will not be moved by feedback even when I'm right' — which on a real team is a hiring concern *regardless of correctness*. The staff+ move: 'Let me check that — yes, Kafka consumer groups handle this with automatic re-balancing on consumer death. Are you concerned about a different failure mode, like the entire Kafka cluster being unavailable?' This both corrects the interviewer *and* shows engagement, not deflection. Being right is necessary but not sufficient; *how* you communicate the rightness is the signal.",
      "Always agree even when you're right.",
      "Switch to RabbitMQ to avoid the question.",
    ],
    correctIndex: 1,
    explanation:
      "L5 framing-is-wrong: the candidate's frame ('I was right, so I should pass') is technically true and substantively wrong. The Communication pillar isn't grading correctness in isolation — it's grading whether the candidate engages with feedback collegially. A defensive 5-second correction even when right is a real hiring concern: it predicts the candidate will be hard to give feedback to on the job. The staff move corrects + engages + offers an alternative concern — collaborative posture wrapped around technical correctness.\n\nWhy A and C are tempting: A reflects most candidates' instinct that correctness is a complete defense. C overcorrects in the opposite direction (always agree).",
    interviewScript:
      "When you need to correct an interviewer, pad the correction with engagement: 'let me check that ... yes, [correct fact]. Are you concerned about [different angle]?' This corrects without putting the interviewer on the defensive.",
    proTip:
      "L5 framing-is-wrong: 'I was right, so I should pass' assumes the rubric is grading correctness in isolation. It isn't — at senior+, *how* you handle feedback is graded as a separate dimension.",
  },

  // ============== PART H — Preparation strategy ==============
  {
    id: "q36",
    part: "H — Preparation strategy",
    subtopic: "Preparation strategy",
    difficulty: "L1",
    style: "Failure Analysis",
    conceptIds: ["H5", "H6"],
    l5Pattern: null,
    question:
      "A candidate has 5 weeks until their interview. Moderate SD experience, no formal study. They consume the entire SD-in-a-Hurry guide cover-to-cover, then watch 30 hours of YouTube SD content, then read every problem breakdown. Two days before the interview, they realize they've never *practiced* a full design from scratch. What is the most specific failure mode this preparation pattern matches?",
    options: [
      "They studied too much.",
      "The 'consume material but stumble when applying it' failure mode — passive consumption builds recognition but not the active production skill the interview measures. SD interviews require *producing* a design under time pressure; consuming articles measures and rewards a different skill. Practice (worked solutions, mocks, Guided Practice) is the antidote. Two days isn't enough to recover. The preparation should have alternated consumption with practice from week 1, not pushed practice to the end.",
      "They didn't watch enough YouTube.",
      "They needed to memorize more answers.",
    ],
    correctIndex: 1,
    explanation:
      "This is a textbook failure that the source content explicitly names: a lot of consumption + no production. The skill the interview tests (producing a design under time pressure with reasoning visible) doesn't transfer from consumption alone. Practice is what bridges the two — and it has to start early, not at the end.",
    interviewScript:
      "If you have N weeks of prep, do at least one full practice design per week from week 1. The practice exposes which concepts you only *think* you understand.",
    proTip:
      "Recognition vs production are different skills. Recognition asks 'do I know this?'; production asks 'can I do this under pressure?' The interview tests production.",
  },
  {
    id: "q37",
    part: "H — Preparation strategy",
    subtopic: "Preparation strategy",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["H2", "H5", "H6"],
    l5Pattern: null,
    question:
      "Two candidates with the same starting point and same total study hours allocate time differently. Candidate X: 35 hours skim-reading SD material + 5 hours practice. Candidate Y: 12 hours skim + 28 hours of mock interviews and worked-solution practice. Which is the more reliable preparation for a senior interview, and *why* does the marginal hour spent on practice outpace the marginal hour spent on reading once basic familiarity is achieved?",
    options: [
      "X — knowledge is the foundation; you can't practice what you don't know.",
      "Y. Once basic familiarity is in place (12 hours of skim is sufficient for that), additional reading produces diminishing returns because the bottleneck shifts to *application under time pressure*. Practice exposes which concepts you *actually* misunderstand vs only think you understand, and it builds the muscle of producing a design fast — which is what's graded. The marginal practice hour reveals gaps; the marginal reading hour reinforces what you already know.",
      "Both are equivalent.",
      "X — reading is always more efficient than practicing.",
    ],
    correctIndex: 1,
    explanation:
      "Reading and practicing aren't substitutes; they're complements with different return curves. Reading has high return at the start (when you don't know basics) and steeply diminishing return after that. Practice has flat-and-rising return throughout. Once you're past the basic-familiarity bar, you should be majority-practicing.",
    interviewScript:
      "After the first 10-15 hours of prep (the basics-skim phase), every additional hour should be majority practice. Track your time and rebalance if the practice ratio is below 60%.",
    proTip: null,
  },
  {
    id: "q38",
    part: "H — Preparation strategy",
    subtopic: "Preparation strategy",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: ["H1", "H3"],
    l5Pattern: null,
    question:
      "Your interview is scheduled for next Monday. It's Wednesday. You've done some prep but you'd benefit from another two weeks. The recruiter has been responsive and helpful. What is the correct call, and what's the *non-obvious* reason this question even has a 'right answer' beyond candidate convenience?",
    options: [
      "Take the interview as scheduled — pushing dates looks bad to the company.",
      "Ask the recruiter to push the date — most will agree, because the recruiter's actual incentive is your *pass rate*, not your interview date. A failed interview costs the recruiter more (re-loop or lost candidate) than a delay. The non-obvious bit: the recruiter is on your side here. Most candidates assume recruiters prefer speed and don't ask, which is a self-inflicted wound based on a false premise. Ask politely; the answer is usually yes.",
      "Take the interview but bring notes.",
      "Cancel and re-apply in a year.",
    ],
    correctIndex: 1,
    explanation:
      "Recruiters are graded on hires, not on interview dates. A push that increases pass probability is a net win for the recruiter as well as the candidate. The only candidates who *can't* push are time-constrained ones (visa, competing offer, internal deadline). If you're not in that category, just ask.",
    interviewScript:
      "Ask the recruiter directly: 'I'd benefit from another two weeks of prep — would it be possible to move the interview to [date]?' Most recruiters will accommodate. Don't pre-emptively apologize; you're asking a routine question with a usually-yes answer.",
    proTip: null,
  },
  {
    id: "q39",
    part: "H — Preparation strategy",
    subtopic: "Preparation strategy",
    difficulty: "L4",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["H4", "H5", "H6"],
    l5Pattern: null,
    question:
      "You have 4 days until your senior SD interview. You've never done one. You panic. You can do *one* of three things, not all: (a) read the entire SD-in-a-Hurry guide carefully, (b) deeply study the Delivery Framework + skim Key Technologies + skim Core Concepts, (c) do 6 mock interviews with feedback. Which choice maximizes pass probability for a senior interview, and what's the underlying logic?",
    options: [
      "(a) — comprehensive knowledge maximizes the chance you've covered the topic.",
      "Ideally (b) and (c) together, but if forced to choose one, (c) has the highest *marginal* return at 4 days. Reasoning: at 4 days you can't move from 'doesn't know' to 'expert' on most topics. The biggest delta is moving from 'has knowledge but can't apply under pressure' to 'can produce a design under time pressure.' Mocks expose your specific application failures, which are harder to fix than knowledge gaps. The triage in the guide (Delivery Framework → skim Key Tech → skim Core Concepts) is the *backup* if (c) isn't available — and (b) is the right structure if you must read, because the Delivery Framework is the highest-leverage piece for an under-prepared candidate.",
      "(a) — there's no way to fake knowledge in 4 days.",
      "None of the above; reschedule the interview.",
    ],
    correctIndex: 1,
    explanation:
      "At 4 days, the bottleneck is application, not coverage. Mocks force production under time pressure, which is the actual interview skill. Comprehensive reading at 4 days is mostly reinforcement of recognition — high-cost, low-marginal-return. The recommended hurry-mode triage exists for the case where mocks aren't available; even then, the Delivery Framework is prioritized first because it's the highest-leverage piece of structure for a hurried candidate.",
    interviewScript:
      "If you have under a week and can mock, mock. If you can't mock, study the Delivery Framework first, then the highest-frequency Key Tech, and skim Core Concepts last.",
    proTip: null,
  },
  {
    id: "q40",
    part: "H — Preparation strategy",
    subtopic: "Preparation strategy",
    difficulty: "L5",
    style: "Estimation-Backed Reasoning",
    conceptIds: ["H2", "H4", "C3"],
    l5Pattern: "estimation-backed-scenario",
    question:
      "A candidate has 20 hours total to prep for a senior SD interview. They know the four pillars from the rubric. They're tempted to allocate evenly: 5 hours per pillar. Why does even allocation likely under-perform, and what's the math (rough but honest) that produces a better allocation given limited time?",
    options: [
      "Even allocation is correct — that's what the rubric implies.",
      "The pillars aren't graded equally and aren't equally trainable in 20 hours. Problem Navigation is the largest single failure point in the rubric — without it, the rest doesn't get expressed — so it has the highest leverage at low time budgets. Communication is best learned in mocks rather than separately. Solution Design has steep returns from working through 2-3 reference deep dives. Technical Excellence at 20 hours is best served by skimming Key Tech rather than mastering it. A defensible allocation: ~6 hours on Problem Navigation + Delivery Framework, ~3 hours on Tech Excellence (Key Tech skim), ~3 hours on Solution Design (one or two reference deep dives), ~2 hours on Communication (built into mocks), ~6 hours on mocks themselves. The non-obvious points: Communication mostly trains as a side-effect of mocks; Problem Navigation has the highest payoff if it's the bottleneck (and at 20 hours, it usually is).",
      "There's no math to do — just memorize tech.",
      "Skip the rubric entirely.",
    ],
    correctIndex: 1,
    explanation:
      "L5 estimation-backed-scenario: even allocation is the naive answer. The math forces a different allocation because (1) the pillars have different bottleneck characteristics — Problem Navigation gates the rest; (2) Communication trains *inside* mocks, not separately; (3) at 20 hours you can't master Tech Excellence, so skim is the right depth there; and (4) the marginal-return curves of each pillar are different, so equal hours produce unequal effective signal. This connects to Part C: at senior level, the pillars carry different weights; even allocation under-invests in the high-leverage one.\n\nWhy A and C are tempting: A defaults to equal allocation as a safe default (it isn't, given unequal returns). C dismisses the rubric, which throws away the structure that lets you allocate at all.",
    interviewScript:
      "Before allocating prep time, *list* the pillars and rank them by your current weakness. Allocate to your bottleneck, not to the average pillar.",
    proTip:
      "L5 estimation-backed-scenario + cross-part bridge: this is H (prep allocation) × C (level weighting) — what you study is shaped by what level you're targeting, not just by the rubric in the abstract.",
  },
];

// Coverage breakdown for the landing page (pillar-weighted view).
const PARTS_OVERVIEW = {
  "Foundational (intro / types)": [
    { name: "What system design interviews are", count: 5 },
    { name: "Types of system design interviews", count: 5 },
    { name: "Level-based assessment", count: 5 },
  ],
  "The Four Pillars": [
    { name: "Problem Navigation", count: 5 },
    { name: "Solution Design", count: 5 },
    { name: "Technical Excellence", count: 5 },
    { name: "Communication & Collaboration", count: 5 },
  ],
  "Strategy": [
    { name: "Preparation strategy", count: 5 },
  ],
};

// Legacy per-tier pacing values retained for saved attempt compatibility.
const TIMER_BY_DIFFICULTY = {
  L1: 60,
  L2: 90,
  L3: 90,
  L4: 120,
  L5: 150,
};
const DEFAULT_TIMER = 90;
const timerForQuestion = (q) => TIMER_BY_DIFFICULTY[q?.difficulty] ?? DEFAULT_TIMER;

// Difficulty styling (methodology Section 7).
const DIFFICULTY_STYLE = {
  L1: { label: "L1 · Recognition", chip: "bg-emerald-900/40 border-emerald-700/40 text-emerald-300" },
  L2: { label: "L2 · Understanding", chip: "bg-cyan-900/40 border-cyan-700/40 text-cyan-300" },
  L3: { label: "L3 · SDE2-core", chip: "bg-blue-900/40 border-blue-700/40 text-blue-300" },
  L4: { label: "L4 · Senior pushback", chip: "bg-amber-900/40 border-amber-700/40 text-amber-300" },
  L5: { label: "L5 · Staff / extreme", chip: "bg-red-900/40 border-red-700/40 text-red-300" },
};

const PART_ORDER = [
  "A — What system design interviews are",
  "B — Types of system design interviews",
  "C — Level-based assessment philosophy",
  "D — Problem Navigation",
  "E — Solution Design",
  "F — Technical Excellence",
  "G — Communication and Collaboration",
  "H — Preparation strategy",
];
const partIndex = (p) => {
  const idx = PART_ORDER.indexOf(p);
  return idx === -1 ? 999 : idx;
};
const tierIndex = (d) => ["L1", "L2", "L3", "L4", "L5"].indexOf(d ?? "L3");

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ladderSort(arr) {
  return [...arr].sort((a, b) => {
    const dp = partIndex(a.part) - partIndex(b.part);
    if (dp !== 0) return dp;
    return tierIndex(a.difficulty) - tierIndex(b.difficulty);
  });
}

export default function InAHurryIntroductionQuiz({ quizSlug = "in-a-hurry-introduction" }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("ladder"); // ladder is the default per methodology §7
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showingSkipped, setShowingSkipped] = useState(false);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const { saveAnswer: persistAnswer, completeQuiz } = useQuizProgress(
    quizSlug,
    QUESTIONS.length
  );

  const startQuiz = useCallback(
    (selectedMode) => {
      const m = selectedMode || mode;
      let qs;
      if (m === "shuffled") qs = shuffleArray(QUESTIONS);
      else if (m === "ordered") qs = [...QUESTIONS];
      else qs = ladderSort(QUESTIONS); // ladder
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setAnswers({});
      setSkipped([]);
      setFlagged(new Set());
      setTimer(timerForQuestion(qs[0]));
      setTimerActive(false);
      setTotalElapsed(0);
      setShowingSkipped(false);
      setScreen("quiz");
    },
    [mode]
  );

  const startRetry = useCallback((subset) => {
    if (!subset || subset.length === 0) return;
    const qs = ladderSort(subset);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers({});
    setSkipped([]);
    setFlagged(new Set());
    setTimer(timerForQuestion(qs[0]));
    setTimerActive(false);
    setTotalElapsed(0);
    setShowingSkipped(false);
    setScreen("quiz");
  }, []);

  // Per-question timer (per-tier durations).
  useEffect(() => {
    if (timerActive && screen === "quiz" && !submitted) {
      return;
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            setSubmitted(true);
            const q = questions[currentIndex];
            setAnswers((prev) => ({
              ...prev,
              [q?.id]: {
                selected: selectedOption,
                confidence: confidence || "timeout",
                correct: selectedOption === q?.correctIndex,
                timedOut: true,
              },
            }));
            if (q) {
              persistAnswer(q.id, {
                selectedIndex: selectedOption,
                correctIndex: q.correctIndex,
                isCorrect: selectedOption === q.correctIndex,
                confidence: null,
                timedOut: true,
              });
            }
            return 0;
          }
          return t;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, screen, submitted, currentIndex, questions, selectedOption, confidence, persistAnswer]);

  useEffect(() => {
    if (screen === "quiz") {
      elapsedRef.current = setInterval(() => {
        setTotalElapsed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(elapsedRef.current);
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || submitted) return;
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (["1", "a"].includes(key)) setSelectedOption(0);
      else if (["2", "b"].includes(key)) setSelectedOption(1);
      else if (["3", "c"].includes(key)) setSelectedOption(2);
      else if (["4", "d"].includes(key)) setSelectedOption(3);
      else if (key === "enter" && selectedOption !== null && confidence) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submitted, selectedOption, confidence]);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || !confidence) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
    setSubmitted(true);
    const q = questions[currentIndex];
    const isCorrect = selectedOption === q.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        selected: selectedOption,
        confidence,
        correct: isCorrect,
        timedOut: false,
      },
    }));
    persistAnswer(q.id, {
      selectedIndex: selectedOption,
      correctIndex: q.correctIndex,
      isCorrect,
      confidence,
      timedOut: false,
    });
  }, [selectedOption, confidence, questions, currentIndex, persistAnswer]);

  const advanceTo = useCallback((qsArray, idx) => {
    setQuestions(qsArray);
    setCurrentIndex(idx);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setTimer(timerForQuestion(qsArray[idx]));
    setTimerActive(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      advanceTo(questions, currentIndex + 1);
    } else if (skipped.length > 0 && !showingSkipped) {
      const skippedQs = skipped.map((id) => QUESTIONS.find((q) => q.id === id)).filter(Boolean);
      setSkipped([]);
      setShowingSkipped(true);
      advanceTo(skippedQs, 0);
    } else {
      clearInterval(elapsedRef.current);
      const correctCount = Object.values(answers).filter((a) => a.correct).length;
      completeQuiz(
        { correct: correctCount, total: Object.keys(answers).length },
        totalElapsed
      );
      setScreen("results");
    }
  }, [currentIndex, questions, skipped, showingSkipped, advanceTo, answers, completeQuiz, totalElapsed]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIndex];
    setSkipped((s) => [...s, q.id]);
    if (currentIndex < questions.length - 1) {
      advanceTo(questions, currentIndex + 1);
    } else {
      const allSkipped = [...skipped, q.id];
      const skippedQs = allSkipped.map((id) => QUESTIONS.find((qq) => qq.id === id)).filter(Boolean);
      setSkipped([]);
      setShowingSkipped(true);
      advanceTo(skippedQs, 0);
    }
  }, [currentIndex, questions, skipped, advanceTo]);

  const toggleFlag = useCallback(() => {
    const q = questions[currentIndex];
    setFlagged((f) => {
      const nf = new Set(f);
      if (nf.has(q.id)) nf.delete(q.id);
      else nf.add(q.id);
      return nf;
    });
  }, [currentIndex, questions]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter((a) => a.correct).length;

  // ============== LANDING ==============
  if (screen === "landing") {
    const totalSeconds = QUESTIONS.reduce((s, q) => s + timerForQuestion(q), 0);
    const minutes = Math.round(totalSeconds / 60);
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 px-3 py-1 rounded-full text-sm mb-4">
              <Layers size={14} />
              In a Hurry · Introduction · L1 → L5 Ladder
            </div>
            <h1 className="text-4xl font-bold mb-2">System Design in a Hurry — Introduction</h1>
            <p className="text-gray-400 text-lg mb-1">Foundational concepts &amp; the four pillars</p>
            <p className="text-gray-500 text-sm">
              The four-pillar interviewer rubric, the L1 → L5 ladder, and the prep
              strategy that separates senior signal from mid-level signal.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {QUESTIONS.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> ~{minutes} min
            </span>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Coverage Breakdown
            </h3>
            {Object.entries(PARTS_OVERVIEW).map(([group, parts]) => (
              <div key={group} className="mb-4 last:mb-0">
                <div className="text-xs font-medium uppercase tracking-wider mb-2 text-gray-400">
                  {group} ({parts.reduce((s, p) => s + p.count, 0)} questions)
                </div>
                <div className="flex flex-wrap gap-2">
                  {parts.map((p) => (
                    <span
                      key={p.name}
                      className="text-xs px-2 py-1 rounded border bg-indigo-950/30 border-indigo-800/40 text-indigo-300"
                    >
                      {p.name} <span className="opacity-60">({p.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Difficulty Ladder
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DIFFICULTY_STYLE).map(([k, v]) => (
                <span key={k} className={`text-xs px-2 py-1 rounded border ${v.chip}`}>
                  {v.label} · {TIMER_BY_DIFFICULTY[k]}s
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Ladder mode plays each Part L1 → L5 in order — confidence first, depth last.
              Shuffled mode interleaves Parts (recommended for retake / spaced review).
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setMode("ladder");
                startQuiz("ladder");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-semibold"
            >
              <Layers size={18} />
              Ladder (Recommended)
            </button>
            <button
              onClick={() => {
                setMode("shuffled");
                startQuiz("shuffled");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <Shuffle size={18} />
              Shuffled
            </button>
            <button
              onClick={() => {
                setMode("ordered");
                startQuiz("ordered");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <List size={18} />
              Section Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============== QUIZ ==============
  if (screen === "quiz") {
    const q = questions[currentIndex];
    if (!q) return null;
    const tDur = timerForQuestion(q);
    const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-green-400";
    const timerBg = timer <= 15 ? "bg-red-500" : timer <= 30 ? "bg-amber-500" : "bg-green-500";
    const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;
    const labels = ["A", "B", "C", "D"];
    const confidenceLevels = [
      { key: "guessing", label: "Guessing", color: "border-red-500 bg-red-500/10 text-red-300" },
      { key: "somewhat", label: "Somewhat Sure", color: "border-amber-500 bg-amber-500/10 text-amber-300" },
      { key: "confident", label: "Very Confident", color: "border-green-500 bg-green-500/10 text-green-300" },
    ];
    const diffStyle = DIFFICULTY_STYLE[q.difficulty] || DIFFICULTY_STYLE.L3;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              {showingSkipped && <span className="text-amber-400 mr-2">[Skipped]</span>}
              Q{currentIndex + 1} / {questions.length}
              <span className="text-gray-600 ml-2">
                ({totalAnswered}/{QUESTIONS.length} total)
              </span>
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg ${timerColor}`}>
              <Clock size={18} />
              {formatTime(timer)}
            </div>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="w-full bg-gray-800 rounded-full h-1 mb-6">
            <div
              className={`${timerBg} h-1 rounded-full transition-all duration-1000`}
              style={{ width: `${(timer / tDur) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded border ${diffStyle.chip}`}>
              {diffStyle.label}
            </span>
            <span className="text-xs px-2 py-1 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 rounded">
              {q.part}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 text-gray-400 rounded">
              {q.style}
            </span>
            {q.l5Pattern && (
              <span className="text-xs px-2 py-1 bg-red-950/40 border border-red-800/40 text-red-300 rounded inline-flex items-center gap-1">
                <Zap size={11} /> {q.l5Pattern}
              </span>
            )}
          </div>

          <h2 className="text-lg font-medium leading-relaxed mb-6">{q.question}</h2>

          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              let border = "border-gray-700 hover:border-gray-500";
              let bg = "bg-gray-900";
              if (submitted) {
                if (i === q.correctIndex) (border = "border-green-500"), (bg = "bg-green-500/10");
                else if (i === selectedOption && i !== q.correctIndex)
                  (border = "border-red-500"), (bg = "bg-red-500/10");
                else border = "border-gray-800";
              } else if (i === selectedOption) {
                border = "border-indigo-500";
                bg = "bg-indigo-500/10";
              }
              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedOption(i)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border ${border} ${bg} transition-all duration-200`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                        submitted && i === q.correctIndex
                          ? "bg-green-500 text-white"
                          : submitted && i === selectedOption && i !== q.correctIndex
                          ? "bg-red-500 text-white"
                          : i === selectedOption && !submitted
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {labels[i]}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </div>
                  {submitted && i === q.correctIndex && (
                    <div className="flex items-center gap-1 mt-2 ml-10 text-green-400 text-xs">
                      <CheckCircle2 size={12} /> Correct
                    </div>
                  )}
                  {submitted && i === selectedOption && i !== q.correctIndex && (
                    <div className="flex items-center gap-1 mt-2 ml-10 text-red-400 text-xs">
                      <XCircle size={12} /> Incorrect
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!submitted && selectedOption !== null && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">How confident are you?</p>
              <div className="flex gap-2 flex-wrap">
                {confidenceLevels.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setConfidence(c.key)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      confidence === c.key
                        ? c.color
                        : "border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!submitted && (
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                >
                  <SkipForward size={14} /> Skip
                </button>
              )}
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg border transition-colors ${
                  flagged.has(q.id)
                    ? "bg-amber-900/30 border-amber-700 text-amber-300"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-400"
                }`}
              >
                <Flag size={14} /> {flagged.has(q.id) ? "Flagged" : "Flag"}
              </button>
            </div>
            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || !confidence}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                  selectedOption !== null && confidence
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Submit <ChevronRight size={16} />
              </button>
            )}
            {submitted && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors"
              >
                {currentIndex < questions.length - 1
                  ? "Next"
                  : skipped.length > 0
                  ? "Review Skipped"
                  : "See Results"}{" "}
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {submitted && (
            <div className="mt-8 space-y-4">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm">
                  <BookOpen size={16} /> Explanation
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{q.explanation}</p>
              </div>
              <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/40 p-5">
                <div className="flex items-center gap-2 mb-3 text-indigo-300 font-semibold text-sm">
                  <MessageSquare size={16} /> Interview Script
                </div>
                <p className="text-sm text-indigo-200/80 leading-relaxed italic">{q.interviewScript}</p>
              </div>
              {q.proTip && (
                <div className="bg-amber-950/20 rounded-lg border border-amber-800/30 p-5">
                  <div className="flex items-center gap-2 mb-3 text-amber-400 font-semibold text-sm">
                    <Lightbulb size={16} /> Pro Tip
                  </div>
                  <p className="text-sm text-amber-200/70 leading-relaxed">{q.proTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============== RESULTS ==============
  if (screen === "results") {
    const score = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const grade =
      score >= 90
        ? { label: "Staff-ready — fundamentals fully internalized", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" }
        : score >= 75
        ? { label: "Strong Senior — solid, minor gaps to close", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" }
        : score >= 60
        ? { label: "SDE2-level — review weak tiers below", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" }
        : { label: "Needs deep review — revisit the four pillars", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" };

    // Per-Part breakdown
    const partStats = {};
    QUESTIONS.forEach((q) => {
      if (!partStats[q.part]) partStats[q.part] = { total: 0, correct: 0 };
      partStats[q.part].total++;
      if (answers[q.id]?.correct) partStats[q.part].correct++;
    });

    // Per-tier breakdown (methodology Section 7).
    const tierStats = { L1: { t: 0, c: 0 }, L2: { t: 0, c: 0 }, L3: { t: 0, c: 0 }, L4: { t: 0, c: 0 }, L5: { t: 0, c: 0 } };
    QUESTIONS.forEach((q) => {
      const d = q.difficulty || "L3";
      if (!tierStats[d]) return;
      if (answers[q.id]) {
        tierStats[d].t++;
        if (answers[q.id].correct) tierStats[d].c++;
      }
    });

    const luckyGuesses = QUESTIONS.filter(
      (q) => answers[q.id]?.correct && answers[q.id]?.confidence === "guessing"
    );
    const overconfidentMisses = QUESTIONS.filter(
      (q) => answers[q.id] && !answers[q.id]?.correct && answers[q.id]?.confidence === "confident"
    );
    const incorrect = QUESTIONS.filter((q) => answers[q.id] && !answers[q.id]?.correct);
    const flaggedQs = QUESTIONS.filter((q) => flagged.has(q.id));
    const hardTier = QUESTIONS.filter((q) => q.difficulty === "L4" || q.difficulty === "L5");

    const weakParts = Object.entries(partStats)
      .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.7)
      .map(([name]) => name);
    const weakQuestions = QUESTIONS.filter((q) => weakParts.includes(q.part));

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2">{score}%</div>
            <div className="text-lg text-gray-400 mb-3">
              {totalCorrect} / {totalAnswered} correct
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${grade.bg} ${grade.color}`}>
              <Award size={18} />
              {grade.label}
            </div>
            <div className="text-sm text-gray-500 mt-3">Total time: {formatTime(totalElapsed)}</div>
          </div>

          {/* Accuracy by Tier (methodology §7) */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers size={18} /> Accuracy by Tier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {["L1", "L2", "L3", "L4", "L5"].map((d) => {
                const s = tierStats[d];
                const pct = s.t > 0 ? Math.round((s.c / s.t) * 100) : 0;
                const style = DIFFICULTY_STYLE[d];
                return (
                  <div key={d} className={`rounded-lg border ${style.chip} px-3 py-3 text-center`}>
                    <div className="text-xs uppercase tracking-wide opacity-80">{style.label}</div>
                    <div className="text-2xl font-bold mt-1">
                      {s.t > 0 ? `${s.c}/${s.t}` : "—"}
                    </div>
                    <div className="text-xs opacity-80">{s.t > 0 ? `${pct}%` : "not attempted"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Part breakdown */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} /> Coverage by Part
            </h3>
            {PART_ORDER.filter((p) => partStats[p]).map((name) => {
              const s = partStats[name];
              const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              return (
                <div key={name} className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">{name}</span>
                    <span className={pct >= 70 ? "text-green-400" : "text-red-400"}>
                      {s.correct}/{s.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 70 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target size={18} /> Confidence Analysis
              </h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-amber-400 mb-2">
                    Lucky Guesses — correct but you were guessing (hidden weak spots)
                  </div>
                  {luckyGuesses.map((q) => (
                    <div
                      key={q.id}
                      className="text-sm text-gray-400 py-1 border-b border-gray-800 last:border-0"
                    >
                      <span className="text-amber-500">{q.id}</span> — {q.part}: {q.question.slice(0, 80)}…
                    </div>
                  ))}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-400 mb-2">
                    Overconfident Misses — wrong but you were very confident (dangerous misconceptions)
                  </div>
                  {overconfidentMisses.map((q) => (
                    <div
                      key={q.id}
                      className="text-sm text-gray-400 py-1 border-b border-gray-800 last:border-0"
                    >
                      <span className="text-red-500">{q.id}</span> — {q.part}: {q.question.slice(0, 80)}…
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {incorrect.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <XCircle size={18} className="text-red-400" /> Incorrect Questions ({incorrect.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrect.map((q) => (
                  <div key={q.id} className="border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded border ${DIFFICULTY_STYLE[q.difficulty]?.chip}`}>
                        {DIFFICULTY_STYLE[q.difficulty]?.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 rounded">
                        {q.part}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-sm text-red-400 mb-1">
                      Your answer:{" "}
                      {answers[q.id]?.selected !== null && answers[q.id]?.selected !== undefined
                        ? ["A", "B", "C", "D"][answers[q.id].selected]
                        : "Timed out"}
                    </p>
                    <p className="text-sm text-green-400 mb-2">
                      Correct: {["A", "B", "C", "D"][q.correctIndex]} — {q.options[q.correctIndex].slice(0, 100)}…
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {flaggedQs.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Flag size={18} className="text-amber-400" /> Flagged for Review ({flaggedQs.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {flaggedQs.map((q) => (
                  <div key={q.id} className="border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded border ${DIFFICULTY_STYLE[q.difficulty]?.chip}`}>
                        {DIFFICULTY_STYLE[q.difficulty]?.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 rounded">
                        {q.part}
                      </span>
                      {answers[q.id]?.correct ? (
                        <span className="text-xs text-green-400">✓ Correct</span>
                      ) : (
                        <span className="text-xs text-red-400">✗ Incorrect</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center mt-8 mb-8">
            {incorrect.length > 0 && (
              <button
                onClick={() => startRetry(incorrect)}
                className="flex items-center gap-2 px-5 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 rounded-lg text-red-300 transition-colors"
              >
                <RotateCcw size={16} /> Retry Missed ({incorrect.length})
              </button>
            )}
            {hardTier.length > 0 && (
              <button
                onClick={() => startRetry(hardTier)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg text-amber-300 transition-colors"
              >
                <Layers size={16} /> Retake L4–L5 only ({hardTier.length})
              </button>
            )}
            {weakQuestions.length > 0 && (
              <button
                onClick={() => startRetry(weakQuestions)}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-indigo-300 transition-colors"
              >
                <TrendingUp size={16} /> Retry Weak Parts ({weakQuestions.length})
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
