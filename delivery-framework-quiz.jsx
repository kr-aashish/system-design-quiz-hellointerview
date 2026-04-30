// === COVERAGE MANIFEST ===
// Source: hellointerview.com/learn/system-design/in-a-hurry/delivery
// Total questions: 40 across 9 parts
//
// PART B — Why a Delivery Framework
//   B1 (failure-to-deliver = #1 mid-level failure mode):  q1 (L1), q2 (L2), q4 (L5)
//   B2 ("time management" = focus problem, not speed):    q1 (L1), q4 (L5)
//   B3 (linear build prevents getting lost when nervous): q3 (L3)
//   B4 (structure = fallback path under stress):          q3 (L3), q4 (L5)
//   B5 (delivery scored as "communication", not directly):q2 (L2)
//   B6 (empirically: structure-followers do better):      q2 (L2)
//   Ladder: L1[q1] L2[q2] L3[q3] L5[q4]
//
// PART C — Functional Requirements
//   C1 ("Users should be able to..." statements):         q5 (L1), q6 (L2)
//   C2 (PM-style back-and-forth; targeted questions):     q6 (L2), q7 (L3)
//   C3 (prioritized list of CORE features, ~3):           q5 (L1), q7 (L3), q8 (L4)
//   C4 (long lists hurt more than help):                  q7 (L3), q8 (L4), q9 (L5)
//   C5 (FAANGs evaluate ability to focus on what matters):q8 (L4), q9 (L5)
//   C6 (top 3 even when system has 100s of features):     q8 (L4)
//   C7 (Twitter functional examples):                     q5 (L1)
//   C8 (Cache functional examples):                       q6 (L2)
//   Ladder: L1[q5] L2[q6] L3[q7] L4[q8] L5[q9]
//
// PART D — Non-Functional Requirements
//   D1 ("System should be..." quality statements):        q10 (L1), q11 (L2)
//   D2 (put in CONTEXT and QUANTIFY):                     q11 (L2), q12 (L3)
//   D3 ("low latency" alone is meaningless):              q12 (L3)
//   D4 ("low latency search <500ms" = WHERE + TARGET):    q12 (L3)
//   D5 (top 3-5 most relevant):                           q14 (L5)
//   D6 (checklist as thinking tool, not exhaustive):      q11 (L2), q14 (L5)
//   D7 (CAP — C vs A; partition tolerance is given):      q13 (L4)
//   D8 (Environment — battery/memory/bandwidth):          q11 (L2)
//   D9 (Scalability — bursts, R/W ratio):                 q14 (L5)
//   D10 (Latency — meaningful-computation requests):      q12 (L3)
//   D11 (Durability — banking can't lose; social can):    q10 (L1), q13 (L4)
//   D12 (Security — protection, access control, regs):    q14 (L5)
//   D13 (Fault tolerance — redundancy/failover/recovery): q14 (L5)
//   D14 (Compliance — legal, industry standards):         q14 (L5)
//   D15 (Twitter NFR examples are quantified):            q12 (L3)
//   Ladder: L1[q10] L2[q11] L3[q12] L4[q13] L5[q14]
//
// PART E — Capacity Estimation
//   E1 (many guides say BotE upfront — disagrees):        q15 (L1)
//   E2 (default: skip upfront, do math during design):    q15 (L1), q16 (L2)
//   E3 (math when it CHANGES the design):                 q16 (L2), q17 (L4), q18 (L5)
//   E4 (TopK example — # topics → single vs sharded):     q17 (L4), q18 (L5)
//   E5 (failure mode: "ok, it's a lot. Got it." — no signal): q16 (L2)
//   E6 (estimation skill still worth practicing):         q17 (L4)
//   E7 (bad mental arithmetic under pressure is normal):  q16 (L2)
//   Ladder: L1[q15] L2[q16] L4[q17] L5[q18]
//
// PART F — Core Entities
//   F1 (defines terms + foundation for design):           q19 (L1), q20 (L2)
//   F2 (bulleted "first draft" called out as such):       q19 (L1)
//   F3 (don't list full schema — iterate):                q20 (L2), q21 (L3)
//   F4 (after HLD reveals state mutations → add fields):  q21 (L3)
//   F5 (Twitter: User, Tweet, Follow):                    q19 (L1)
//   F6 (heuristics: actors, nouns from FRs):              q20 (L2)
//   F7 (naming matters — "hardest problem in CS"):        q22 (L5)
//   Ladder: L1[q19] L2[q20] L3[q21] L5[q22]
//
// PART G — API / System Interface
//   G1 (API = contract between system and users):         q23 (L1), q24 (L2)
//   G2 (often maps to FRs — but not always):              q24 (L2), q27 (L5)
//   G3 (API guides HLD + verifies reqs being met):        q24 (L2)
//   G4 (REST = default unless specific reason):           q23 (L1), q25 (L3)
//   G5 (REST = HTTP verbs + CRUD on resources):           q23 (L1)
//   G6 (GraphQL = diverse clients, varied data needs):    q25 (L3)
//   G7 (gRPC = action-oriented, internal, faster):        q25 (L3)
//   G8 (WebSockets/SSE for realtime — design core API first): q26 (L4), q27 (L5)
//   G9 (resource naming: PLURAL nouns):                   q23 (L1)
//   G10 (Twitter API endpoints):                          q24 (L2)
//   G11 (SECURITY: derive user from auth token, not body):q26 (L4)
//   Ladder: L1[q23] L2[q24] L3[q25] L4[q26] L5[q27]
//
// PART H — [Optional] Data Flow
//   H1 (useful for backend/data-processing systems):      q28 (L1), q30 (L4)
//   H2 (skip if no long sequence):                        q28 (L1), q30 (L4)
//   H3 (format: simple sequential list):                  q29 (L2)
//   H4 (web crawler example — 5 steps):                   q29 (L2)
//   H5 (data flow informs HLD):                           q29 (L2), q30 (L4)
//   Ladder: L1[q28] L2[q29] L4[q30]
//
// PART I — High Level Design
//   I1 (HLD = boxes + arrows; components + interactions): q31 (L1)
//   I2 (components = building blocks):                    q31 (L1)
//   I3 (whiteboard or Excalidraw; practice tool first):   q31 (L1)
//   I4 (architecture satisfies API → satisfies reqs):     q32 (L2)
//   I5 (build sequentially — endpoint by endpoint):       q32 (L2)
//   I6 (anti-pattern: layering complexity too early):     q33 (L3), q35 (L5)
//   I7 (verbal callout + written note → move on):         q33 (L3)
//   I8 (talk through data flow + state mutations):        q34 (L4)
//   I9 (document relevant columns next to DB):            q34 (L4)
//   I10 (don't document obvious columns):                 q34 (L4)
//   I11 (don't worry about types — interviewer infers):   q34 (L4)
//   Ladder: L1[q31] L2[q32] L3[q33] L4[q34] L5[q35]
//
// PART J — Deep Dives
//   J1 (deep dives HARDEN the design after HLD):          q36 (L1)
//   J2 (four objectives: NFRs, edges, bottlenecks, probes): q36 (L1), q37 (L2)
//   J3 (junior: interviewer drives; senior: candidate):   q37 (L2), q40 (L5)
//   J4 (Twitter scale-NFR: scale/cache/shard):            q38 (L3)
//   J5 (Twitter latency-NFR: fanout-on-read vs on-write): q38 (L3)
//   J6 (common mistake: senior talks OVER interviewer):   q39 (L4), q40 (L5)
//   J7 (interviewer has specific signals — needs probing room): q39 (L4)
//   J8 (talking too much hurts BOTH technical AND comms): q39 (L4), q40 (L5)
//   J9 (deep dives = where most interesting problem lives): q38 (L3)
//   Ladder: L1[q36] L2[q37] L3[q38] L4[q39] L5[q40]
//
// L5 PATTERN COVERAGE (this file: 7/7 — full canon):
//   - framing-is-wrong:        q40 (interviewer asks "why are you so quiet?" mid-deep-dive)
//   - two-levels-of-indirection: q4 (looks slow at min 30 — surface fix vs real fix)
//   - adversarial-pushback:    q9 (interviewer: "couldn't users do X too?" — feature creep trap)
//   - trade-off-inversion:     q14 (NFR priority flip: A→C mid-interview)
//   - estimation-backed-scenario: q18 (TopK numbers: when math forces shard vs single instance)
//   - future-proofing:         q27 (REST locked in HLD; realtime requested in deep dive)
//   - implementation-specific-gotcha: q22 (entity name aliasing — "Post" vs "Tweet" in microservices)
//   Plus L5s at q35 (HLD-creep when interviewer asks "what about caching?" early — implicit framing-is-wrong reinforcer)
//   Plus L5 at q35 reuses anti-pattern axis but not double-counted in canon.
//
// CROSS-PART BRIDGES:
//   B × J  → q40 (structure-as-fallback meets talking-over-interviewer)
//   C × D  → q12 (NFR vagueness exposed by missing functional anchor)
//   C × G  → q27 (functional reqs vs API choice for realtime)
//   D × E  → q14 + q18 (NFR "100M DAU" only matters if estimation changes design)
//   D × J  → q38 (NFRs drive deep-dive selection)
//   F × I  → q21 (entities as foundation, schema fields emerge in HLD)
//   G × C  → q24 (API as the contract for FRs)
//   G × J  → q26 + q27 (WebSockets-in-HLD as deep-dive fragility)
//   I × J  → q33 + q35 (deferring complexity from HLD into deep dives)
//
// ANTI-PATTERN QUESTIONS:
//   q3 (no framework → drift); q7 (long FR list); q8 (FR creep); q15-q16 (BotE upfront);
//   q21 (full schema upfront); q33 (HLD complexity layering); q39 (talking over interviewer)
//
// INTERVIEWER-PUSHBACK QUESTIONS: q8, q9, q13, q17, q26, q30, q34, q39
// ========================

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
} from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    part: "B — Why a Delivery Framework",
    subtopic: "Failure-to-deliver as the dominant failure mode",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: [
      "B1",
      "B2"
    ],
    l5Pattern: null,
    question: "A mid-level candidate finishes their interview having designed a beautifully detailed authentication subsystem with consistent hashing, token rotation, and a slick session store — but never got to the parts of the system that actually serve user requests. They walk away thinking 'I just needed more time.' What is the most accurate diagnosis of what went wrong?",
    options: [
      "They genuinely needed more time. 45 minutes is a tight constraint and they were just unlucky to hit it on a complex sub-problem.",
      "They failed at communication. If they'd talked more during the auth section, the interviewer would have prompted them to move on.",
      "They failed because they didn't memorize enough patterns. Knowing more patterns would have let them recognize the auth pattern faster and move on.",
      "They didn't fail at speed — they failed at focus. Time was spent on a sub-problem that didn't satisfy the broader functional requirements, leaving the rest of the system undesigned. The fix isn't to work twice as fast; it's to spend time proportional to what each part of the system actually needs."
    ],
    correctIndex: 3,
    explanation: "Failure to deliver a working system is the single most common reason mid-level candidates fail — and it almost always shows up as 'I needed more time.' But the underlying problem is focus, not speed. A candidate who spends 25 of 45 minutes deep in one corner of the system isn't slow; they're prioritizing wrong. The framework's job is to nudge you out of any single area before you've spent disproportionate time there.",
    interviewScript: null,
    proTip: "If you ever catch yourself thinking 'this is interesting, let me go deeper here,' check the clock first. Interesting is not the same as load-bearing for the interview."
  },
  {
    id: "q2",
    part: "B — Why a Delivery Framework",
    subtopic: "Communication scoring and the framework",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "B1",
      "B5",
      "B6"
    ],
    l5Pattern: null,
    question: "A candidate asks: 'Interviewers don't have a checkbox for delivery, so why does it matter? They evaluate technical depth and communication.' How do those evaluation rubrics actually interact with whether you finish the design, and what's the practical implication for whether to use a framework?",
    options: [
      "The candidate is correct — delivery isn't on the rubric, so a framework is just stylistic preference. Strong technical depth on a partial design beats a complete design with shallower depth.",
      "A framework helps mostly with communication scoring; it has no real effect on technical depth, which is determined entirely by your knowledge.",
      "Delivery isn't its own line on the rubric, but failure-to-finish gets bucketed into 'communication' (you couldn't communicate a complete solution) and limits the technical signal the interviewer can collect (they can't evaluate depth on areas you never reached). The framework is the empirically-supported fix because candidates who follow one perform significantly better on both axes — not just one.",
      "The interviewer secretly does have a 'delivery' line item that they hide from candidates — the framework satisfies it."
    ],
    correctIndex: 2,
    explanation: "Even though interviewers don't formally score 'delivery,' failure to deliver leaks into both rubrics. Technical depth gets capped because the interviewer never sees the parts you didn't reach — they have to assume the worst about your knowledge there. Communication suffers because you didn't successfully communicate a working system. Frameworks help on both axes, which is why structure-followers empirically outperform — not because frameworks make you a deeper engineer, but because they let your existing depth get evaluated.",
    interviewScript: null,
    proTip: "When you 'feel' like an area needs more depth than the framework allots, that feeling is usually right about the depth and wrong about the budget. Note the depth verbally, then move on; you can return in deep dives if you have time."
  },
  {
    id: "q3",
    part: "B — Why a Delivery Framework",
    subtopic: "Structure as fallback under stress",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: [
      "B3",
      "B4"
    ],
    l5Pattern: null,
    question: "A senior candidate insists they don't need a framework: 'Frameworks are for juniors. I have 8 YoE; I can read the room and design intuitively.' In their interview, they get nervous about minute 12 when the interviewer pushes back on a choice they hadn't fully thought through, lose their place, and spend the next 10 minutes thrashing between sub-systems. What specific function did the framework provide that intuition didn't, and why does seniority not eliminate the need for it?",
    options: [
      "Seniority does eliminate the need for a framework — this candidate just had a bad day, and intuition is sufficient for senior+ candidates.",
      "The framework's primary function is as a FALLBACK PATH when nervous or destabilized. When pushback breaks the candidate's flow, an explicit framework gives them a written sequence to return to ('I was at HLD; let me finish the API and then return to that question'). Intuition fails precisely when stress is highest, so the candidate who relies on intuition is using a tool that breaks under load. Seniority correlates with knowledge but not with stress immunity.",
      "The framework's function is to impress the interviewer by showing you've prepared — its only value is signaling, and the candidate should fix this by visibly writing the framework on the board.",
      "The candidate failed because they didn't push back hard enough on the interviewer. A framework helps junior candidates handle pushback, but a senior should defend their choices rather than re-routing to a framework."
    ],
    correctIndex: 1,
    explanation: "The framework's value isn't pedagogical — it's stress-management. Under nerves, your working memory shrinks; the framework on the corner of the whiteboard offloads 'where am I?' from working memory to the visual environment. Seniority doesn't make you immune to interview nerves. Many candidates who 'don't need' a framework are fine in mocks (low stakes) and fall apart in real interviews (high stakes). The 'fallback path' framing is the right mental model: you may not consult the framework at all if everything goes smoothly, but its mere presence is what catches you when things don't.",
    interviewScript: "If pushback knocks you off-balance, glance at your written framework and say: 'Good question — let me come back to that in deep dives. Right now I'm finishing the API.' This both buys you time and shows the interviewer you have control of the sequence.",
    proTip: "Write the framework in the corner of the whiteboard at minute 0, even if you don't think you'll need it. The 30 seconds it takes is interview insurance."
  },
  {
    id: "q4",
    part: "B — Why a Delivery Framework",
    subtopic: "Why slow looks like slow",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "B1",
      "B2",
      "B4"
    ],
    l5Pattern: "two-levels-of-indirection",
    question: "A candidate is at minute 30 of a 45-minute interview and is still iterating on their data model. They look at the clock, panic, and start designing faster — skipping the API section entirely to jump to high-level design. They run out of time anyway. Their post-interview self-diagnosis: 'I'm too slow at writing.' What is the actual cause-and-effect chain here, and why is 'work faster' the wrong fix even though they ran out of time?",
    options: [
      "The clock anxiety at minute 30 is a SYMPTOM of a focus problem that started at minute 5, not a speed problem. The data model absorbed time that should have been distributed across requirements, API, and HLD. 'Work faster' is the wrong fix because the candidate IS working at a normal pace — the work itself was misallocated. Skipping the API to 'catch up' makes it worse: the API would have grounded the HLD, and now the HLD is unmoored. The real fix is upstream: a framework that prevented the data-model rabbit hole at minute 10. Once you're at minute 30 with most of the design undone, no amount of speed recovers; you have to spend the LESS-natural way (less depth per area, more breadth) to deliver something complete. The candidate's instinct to 'go faster' is the second-level mistake that compounds the first.",
      "The candidate's self-diagnosis is correct — they're slow at writing. They should practice writing system designs faster (e.g., timed drills) to fix the throughput problem.",
      "The candidate is fine — running out of time once is unlucky and they should just retry with the same approach.",
      "The candidate should have spent MORE time on the data model — the data model is foundational, so cutting it short in any way produces a worse design."
    ],
    correctIndex: 0,
    explanation: "L5 two-levels-of-indirection: the surface symptom (running out of time) prompts a surface fix (work faster), which is wrong because the surface symptom isn't the actual problem. The actual problem is focus allocation 25 minutes earlier; by minute 30 the framework constraint is already broken and 'going faster' just creates a worse, less-grounded design. The interviewer-listening signal: a senior candidate, asked to retrospect on a failed interview, can articulate WHERE the focus failure happened (early), not just WHEN the symptom appeared (late). Why most candidates pick A: because the symptom timing makes 'speed' feel like the problem. Why D is wrong: it doubles down on the original misallocation. The senior+ insight is that you don't fix a focus failure by going faster — you fix it by re-allocating time at the moment of the deviation.",
    interviewScript: null,
    proTip: "Time-checks aren't there to tell you to 'go faster' — they're there to tell you whether your CURRENT activity is allocated correctly. If yes, continue at your pace. If no, the fix is changing activity, not changing speed."
  },
  {
    id: "q5",
    part: "C — Functional Requirements",
    subtopic: "Phrasing and selection of FRs",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "C1",
      "C3",
      "C7"
    ],
    l5Pattern: null,
    question: "You're designing a Twitter-like service. Which of these is the best example of a single, well-formed FUNCTIONAL requirement to put on the board first?",
    options: [
      "The system should be highly available, prioritizing availability over consistency.",
      "The system should support 100M+ DAU.",
      "We should consider sharding the user table by user_id.",
      "Users should be able to post tweets."
    ],
    correctIndex: 3,
    explanation: "Functional requirements are 'Users/Clients should be able to...' statements describing what the system DOES. (A) and (D) are non-functional (system qualities). (C) is an implementation choice, not a requirement. Only (B) describes a user-visible capability. The 'Users should be able to...' framing isn't a stylistic preference — it's a discipline that prevents you from sneaking implementation details into the requirements list.",
    interviewScript: null,
    proTip: "Write each FR starting with 'Users should be able to...' — if you can't fit it into that sentence, it's not a functional requirement."
  },
  {
    id: "q6",
    part: "C — Functional Requirements",
    subtopic: "Eliciting FRs via PM-style probing",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "C1",
      "C2",
      "C8"
    ],
    l5Pattern: null,
    question: "You're asked to design an in-memory cache. The interviewer says 'design a cache' and stops. A candidate immediately writes 'Users should be able to insert items, set expirations, and read items' and moves on. A second candidate first asks: 'Should this cache support deletions explicitly? Eviction policies the client controls? Atomic compare-and-set?' before deciding which to keep. Which approach is correct, and why does it matter?",
    options: [
      "The first candidate is correct — they identified obvious requirements quickly and avoided wasting time on questions. Speed is what wins these sections.",
      "Both are equivalent — one optimizes for speed and the other for thoroughness, and the interviewer doesn't care which you pick.",
      "The second candidate's approach is correct. Even when you have a 'sense' of what the system should do, the elicitation step itself produces signal — it shows the interviewer you treat requirements as a back-and-forth with a stakeholder. The targeted questions ('does it need X?') also surface scope decisions early, before they become baked into a design that's hard to revise.",
      "The second candidate is wasting time. The first candidate's three-FR list is exactly the cache spec, so the questions add no new information."
    ],
    correctIndex: 2,
    explanation: "The article calls out FR elicitation explicitly as 'a back and forth with your interviewer' — like talking to a PM. This isn't theater: targeted questions ('does it need to do X?', 'what would happen if Y?') let you eliminate or commit to scope before the cost of changing your mind is high. The first candidate's list happens to overlap with the canonical answer, but they got there by guessing rather than scoping — and on a less-familiar system, that approach produces requirements that are wrong or that you have to retract halfway through.",
    interviewScript: null,
    proTip: "After your initial draft of FRs, ask the interviewer one specific narrowing question: 'Should this also support X?' — they'll either confirm or push back, and either response is useful information."
  },
  {
    id: "q7",
    part: "C — Functional Requirements",
    subtopic: "Why long lists hurt — FR overload",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: [
      "C2",
      "C3",
      "C4"
    ],
    l5Pattern: null,
    question: "Asked to design Twitter, a candidate writes 11 functional requirements: post tweets, follow users, see timeline, reply, retweet, like, search hashtags, search users, DMs, lists, notifications. They feel thorough. The interviewer's reaction is muted, and the candidate spends the next 25 minutes designing an undifferentiated half-system across all 11. What did the long list cost them, and what would a corrected list look like?",
    options: [
      "Nothing — long lists are exhaustive and exhaustiveness is good. The candidate just needed more time to design each FR properly.",
      "The long list cost them prioritization signal AND time budget. Designing for 11 FRs in 45 minutes means each gets ~3 minutes of design — not enough depth for any. A corrected list would identify the top ~3 (post / follow / timeline) as core, and explicitly NOTE the others as 'out of scope for this design — happy to revisit if time permits.' This is the FAANG-tested skill: focus on what matters and consciously DEFER the rest, rather than treating every plausible feature as equally load-bearing.",
      "The candidate should have written 20 FRs, not 11 — interviewers reward broader knowledge of product surface area.",
      "The list is fine; the problem was that they didn't design each one in enough depth. The fix is to go faster on each."
    ],
    correctIndex: 1,
    explanation: "The article is explicit: 'Having a long list of requirements will hurt you more than it will help you.' Top FAANGs evaluate the ability to focus — a candidate who lists 11 FRs is signaling that they can't, or won't, prioritize. The corrected behavior isn't to cut the list silently; it's to declare 3 core and explicitly defer the rest. That deferred list is itself useful signal — it shows you SAW the additional features and made an active decision to exclude them.",
    interviewScript: "After listing your 3 core FRs, say: 'I'm noting [retweet, search, DMs] as out-of-scope for the core design — happy to revisit one in deep dives if there's time.' This shows scope discipline without seeming dismissive.",
    proTip: "If your FR list has more than 3-4 items, you're either designing a different system than the interviewer asked for, or you haven't prioritized."
  },
  {
    id: "q8",
    part: "C — Functional Requirements",
    subtopic: "Resisting interviewer-led feature creep",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "C3",
      "C4",
      "C5",
      "C6"
    ],
    l5Pattern: null,
    question: "You've narrowed Twitter's FRs to three core items: post, follow, see timeline. The interviewer says: 'What about retweets? Notifications? Search? My users would expect all of those.' How do you respond in a way that maintains your prioritization without seeming to dismiss the interviewer's input?",
    options: [
      "Acknowledge the interviewer's point, but recover scope: 'Those are all real features in production Twitter. For this 45-minute design, my goal is to get the core posting/feed/follow loop right end-to-end — let me lock that down, and if there's time we can add one or two of those in deep dives.' This treats the interviewer's prompt as a useful surface-area observation while explicitly defending your time budget — and it gives you an out (deep dives) instead of a hard refusal.",
      "Add all three to your FR list — the interviewer is signaling these are required, and ignoring their guidance is a bad-faith move.",
      "Push back hard: 'Those are out of scope. I'm not designing them.' Senior candidates need to defend their decisions firmly.",
      "Pretend you didn't hear the question and continue with your design."
    ],
    correctIndex: 0,
    explanation: "Top FAANGs explicitly evaluate the ability to focus on what matters. Adding the interviewer's three suggestions takes you from 3 FRs to 6 — half your time budget already gone before you've designed anything. But the interviewer isn't necessarily INSISTING; they're often probing whether you'll cave under suggestion. The right move acknowledges their input (it's not adversarial — production Twitter does have those features), restates the prioritization rationale, and explicitly offers a path to revisit (deep dives) — which both maintains scope discipline and treats the interviewer as a collaborator rather than an adversary.",
    interviewScript: "Try the formula: '[Acknowledge: Yes, real users expect that] — [Defend the budget: For this design my focus is X] — [Offer the path: We can revisit in deep dives if time].' This works for almost any 'what about Y' interviewer probe.",
    proTip: "Interviewer prompts are often probes, not orders. If accepting every suggested feature would blow your time budget, the answer is to DEFER the suggestion gracefully, not to silently expand scope."
  },
  {
    id: "q9",
    part: "C — Functional Requirements",
    subtopic: "Adversarial pushback on minimal FRs",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "C4",
      "C5"
    ],
    l5Pattern: "adversarial-pushback",
    question: "You're designing Yelp and have committed to 3 FRs: search businesses by location, view business detail pages, post reviews. The interviewer says: 'But couldn't users also want to bookmark businesses, follow other reviewers, see check-in counts, and report fraud? Aren't those all things real users do?' You sense this is a probe rather than a hard demand. What is the highest-EV response, and what specific signal is the interviewer testing?",
    options: [
      "Add all four to the FR list. Yes, expanding scope hurts the budget, but disagreeing with the interviewer hurts your evaluation more.",
      "Compromise — add two of the four to your FR list as a goodwill gesture. Splitting the difference shows collaborative spirit.",
      "Reject the interviewer's framing entirely: 'No, those aren't part of the system you described.' Confidence wins these moments.",
      "The interviewer is testing whether you'll stay disciplined under social pressure. The highest-EV response: 'You're right that real users do all of those — but for a 45-minute design, the highest-leverage triple is search → view → review because they cover the read path, the detail path, and the write path. Adding bookmark/follow/check-ins would either reduce depth on the core triple or push the design into shallow surface-coverage. I'm explicitly choosing depth on the few that matter.' The interviewer is listening for whether you can ARTICULATE the prioritization principle (depth on the load-bearing few vs. coverage of all plausible features), not just resist their suggestion. A senior candidate names the trade-off; a mid-level candidate either silently expands scope or refuses without explaining why."
    ],
    correctIndex: 3,
    explanation: "L5 adversarial-pushback: the interviewer's prompt sounds like it wants more features but is actually testing whether you can defend your prioritization with a principle (not just a refusal). Why most candidates pick A: cooperative bias under pressure — disagreeing with the interviewer feels risky. Why D is the trap: it looks reasonable but is the worst option. You've abandoned your scope discipline (the 3-FR pick was correct) without gaining the signal of articulating WHY 3 was correct. The senior+ insight is that the prioritization principle ('depth on the load-bearing few rather than coverage of all plausible features') is itself the artifact the interviewer wants to hear — they don't want you to capitulate, and they don't want you to merely refuse, they want you to NAME the trade-off in plain language. Naming it shows you understand why the framework recommends 3 in the first place.",
    interviewScript: null,
    proTip: "Under interviewer pressure, ask yourself: are they probing my reasoning or telling me to change scope? Probes need a principled defense; orders don't. Most pressure on FR lists is a probe."
  },
  {
    id: "q10",
    part: "D — Non-Functional Requirements",
    subtopic: "FR vs NFR distinction",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "D1",
      "D11"
    ],
    l5Pattern: null,
    question: "Which of these is best described as a NON-functional requirement?",
    options: [
      "Users should be able to upload a photo to their post.",
      "The system must not lose user banking data even if a single data center fails.",
      "The system needs an authentication endpoint that returns a JWT.",
      "The system must support two database tables: users and posts."
    ],
    correctIndex: 1,
    explanation: "Non-functional requirements describe system QUALITIES — durability, latency, availability, scalability, security, etc. (A) and (C) describe what the system DOES (functional). (D) is a design detail, not a requirement. (B) describes a quality (durability under failure) the system must satisfy and is exactly the 'banking can't tolerate data loss' example from the article.",
    interviewScript: null,
    proTip: "Phrase NFRs as 'The system should...' or 'The system should be able to...' — that grammar enforces the distinction from 'Users should be able to...' (FRs)."
  },
  {
    id: "q11",
    part: "D — Non-Functional Requirements",
    subtopic: "Quantification & domain context",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "D1",
      "D2",
      "D6",
      "D8"
    ],
    l5Pattern: null,
    question: "You're designing a video-streaming app for users on 3G mobile connections. A candidate writes the NFR: 'The system should be performant.' What's wrong with this NFR, and what would a corrected version capture that this one misses?",
    options: [
      "Nothing is wrong — 'performant' is a standard NFR and the interviewer will infer the rest.",
      "The NFR should just say 'low latency' — adding numbers locks you into commitments you can't verify.",
      "The NFR is unquantified AND ungrounded in the domain. 'Performant' is meaningless — every system should be performant. A corrected version would quantify and contextualize: 'Initial video segment should start playing within 3 seconds on a 1.5 Mbps 3G connection; rebuffering events should occur on fewer than 1 in 50 minutes of playback.' This identifies WHICH performance dimension matters (startup latency + rebuffer rate), GROUNDS it in the actual user environment (3G, not desktop ethernet), and provides CONCRETE TARGETS the design will be measured against.",
      "The NFR is fine as written; just add 'and scalable' at the end."
    ],
    correctIndex: 2,
    explanation: "The article's specific guidance: NFRs put in CONTEXT and QUANTIFY where possible. 'Low latency' alone is meaningless because nearly all systems should be low latency. 'Low-latency search, < 500ms' identifies WHERE (search, not the whole system) and provides a TARGET (500ms). The same logic applies to performance NFRs in any domain — without quantification, the NFR can't drive design decisions because nothing in the design has to verifiably satisfy it. The 3G context is also load-bearing: a 3-second startup that's fine on wifi may be unachievable on 3G with the same architecture, so the constraint shapes the design (you'll lean toward smaller initial segments, lower-bitrate fallbacks, etc.).",
    interviewScript: null,
    proTip: "Every NFR you write should be testable. If you can't imagine a measurement that would prove the system meets it, it's not yet specific enough."
  },
  {
    id: "q12",
    part: "D — Non-Functional Requirements",
    subtopic: "Latency NFRs anchored in functional context",
    difficulty: "L3",
    style: "Cross-Part Bridge (C × D)",
    conceptIds: [
      "D2",
      "D3",
      "D4",
      "D10",
      "D15"
    ],
    l5Pattern: null,
    question: "Designing Yelp, a candidate's NFR list includes 'low latency.' The interviewer asks: 'Low latency for what?' The candidate freezes. What's the underlying problem with this NFR list, and how does the connection between functional requirements and NFRs help fix it?",
    options: [
      "There's no problem — 'low latency' is a standard term and the interviewer is being unfair.",
      "The NFR is fine; the candidate just needs to add 'low latency, low CPU usage, low memory usage' to make it more comprehensive.",
      "The candidate should have memorized that Yelp's latency target is 500ms — knowing this would have answered the interviewer's question.",
      "The NFR isn't anchored to a specific functional requirement, which is what makes it meaningless. The fix: take each FR and ask 'what quality does THIS specific feature most need?' For Yelp, the most-load-bearing FR is search (users won't tolerate slow search), so the NFR becomes 'Low-latency search: P95 under 500ms.' The latency-for-edits or latency-for-reviews can be much looser. The mistake the candidate made was writing NFRs as a global property of 'the system' rather than as constraints on specific user-facing flows. NFRs that don't map to a particular FR usually can't be designed for."
    ],
    correctIndex: 3,
    explanation: "The article's example — 'low latency search, < 500ms' for Yelp — is doing two things at once: identifying WHERE the latency matters (search, not the whole system) and providing a TARGET. Both come from the connection to the functional requirement: search is what users do most often and is most sensitive to slow response. NFRs that float independently of FRs become design dead weight — you can't make a tradeoff for 'the system being fast' because every component will claim it needs to be fast. Anchoring each NFR to the FR it most affects gives you a way to decide, e.g., 'this query path needs heavy caching; this other one doesn't.' Twitter's 'feeds < 200ms' is the same pattern: feeds is the FR that most needs latency, so feeds gets a quantified NFR.",
    interviewScript: "When writing NFRs, point at each FR and say: 'The most demanding quality for THIS feature is X — let me quantify.' This forces NFRs to be useful, not generic.",
    proTip: "If your NFR doesn't change any design decision, it's either too vague or it's not really a requirement."
  },
  {
    id: "q13",
    part: "D — Non-Functional Requirements",
    subtopic: "CAP-driven tradeoffs and durability tiering",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "D7",
      "D11"
    ],
    l5Pattern: null,
    question: "Designing a banking system, you've called out 'consistency over availability' (per CAP) as a top NFR. The interviewer pushes: 'But availability matters too — if the bank is down, customers are angry. Why pick consistency?' How do you defend the choice in a way that doesn't dismiss the availability concern?",
    options: [
      "Defend with the principle: 'CAP forces a choice during partition. For banking, an inconsistent read at minute 1 (showing $0 when you have $100) creates correctness incidents that cost orders of magnitude more than the temporary unavailability of saying \"please retry in 30 seconds.\" Customer anger from downtime is recoverable; customer anger from incorrect balances is regulatory. So C > A under partition. That doesn't mean we ignore availability — we still build for high uptime under normal conditions. CAP is specifically about the partition trade-off; it's not 'we accept arbitrary downtime.'",
      "Capitulate: 'Good point — let me change to availability over consistency.' Avoiding disagreement is the safest interview move.",
      "Refuse the framing: 'CAP is just theory — in practice, modern systems get both.' This shows knowledge of the theorem.",
      "Switch the NFR to 'high availability AND high consistency' — both can be top priorities."
    ],
    correctIndex: 0,
    explanation: "Partition tolerance is a given in distributed systems, so CAP is really a C-vs-A choice DURING a partition. The article specifies banking as the canonical durability/correctness example: data loss or inconsistency is catastrophic. The interviewer's pushback is testing whether you understand that 'C > A' doesn't mean 'we don't care about availability' — it means that when you must pick (during partition), correctness wins. Outside of partitions, the system targets high availability normally. Capitulating (A) gives away the right answer for nothing. Refusing CAP (C) shows you don't understand the theorem. Both-and (D) is the most common wrong answer — it sounds reasonable but evades the theorem's actual claim.",
    interviewScript: "When defending a CAP choice, frame it as: 'Under partition, [C/A] wins because [domain-specific cost of the alternative]. Outside of partition, we still aim for both; CAP is specifically about the worst-case tradeoff.' This shows you know what CAP actually says.",
    proTip: "If you ever say 'we want both consistency AND availability' without qualification, you haven't engaged with CAP — you've ignored it."
  },
  {
    id: "q14",
    part: "D — Non-Functional Requirements",
    subtopic: "When the NFR priority list flips mid-design",
    difficulty: "L5",
    style: "Scenario-Based Trade-offs",
    conceptIds: [
      "D5",
      "D6",
      "D9",
      "D12",
      "D13",
      "D14"
    ],
    l5Pattern: "trade-off-inversion",
    question: "You've designed a social media feed system optimizing for the NFRs: high availability (>99.9%), low latency (P95 < 200ms), and read-heavy scalability (~100x reads vs writes). At minute 35, the interviewer says: 'Actually, this is for a healthcare provider's patient-portal feed. Same surface, different context.' Without changing any FR, which NFR priorities now flip — and what does this reveal about the relationship between NFRs and the system being modeled?",
    options: [
      "Nothing changes — the system has the same FRs, so the same NFRs apply. The candidate should defend the current design.",
      "Almost everything flips: COMPLIANCE (HIPAA) becomes top-priority where it wasn't even in the list before; SECURITY (PHI access control, audit logs) jumps from incidental to load-bearing; CONSISTENCY may now matter more than the previous A>C choice (a stale medical update is a safety issue, not just a UX issue); DURABILITY (no patient data loss) becomes critical; pure-latency becomes secondary. This reveals that NFRs are not properties of the SYSTEM SHAPE — they're properties of the DOMAIN the system serves. Same boxes-and-arrows, different domain → potentially every NFR re-prioritized. The senior+ move is to recognize the domain switch immediately and re-derive the top 3-5 NFRs from scratch, rather than trying to bolt healthcare concerns onto a social-media architecture.",
      "Only one thing changes: the system needs to add encryption at rest. Everything else stays the same.",
      "The candidate should refuse the prompt as out of scope — changing the domain mid-interview is unfair."
    ],
    correctIndex: 1,
    explanation: "L5 trade-off-inversion: flipping the domain reveals which NFRs were domain-agnostic and which were domain-specific. The article's NFR checklist (CAP, environment, scalability, latency, durability, security, fault tolerance, compliance) is explicitly a thinking tool — you pick the top 3-5 RELEVANT to the domain. The social-media version emphasized A>C, latency, read-heavy scaling. Healthcare flips compliance and security to top, makes durability non-negotiable, and may flip CAP. The senior+ insight the interviewer listens for: the candidate doesn't just bolt on 'add encryption' — they recognize that the entire NFR priority list was derived from the social-media domain assumptions, and reroute. Why most candidates pick A: they treat NFRs as architectural constants. Why C is the trap: it identifies a real concern (encryption) but misses the magnitude of the shift. The 7-of-8 NFRs from the checklist should be re-evaluated, not just one.",
    interviewScript: null,
    proTip: "When the interviewer changes a piece of context, ask yourself: which of my NFRs were domain-derived vs. domain-agnostic? The domain-derived ones are now suspect."
  },
  {
    id: "q15",
    part: "E — Capacity Estimation",
    subtopic: "Default behavior for capacity estimation",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "E1",
      "E2"
    ],
    l5Pattern: null,
    question: "When the interview opens 'design Twitter,' which is the recommended DEFAULT approach to back-of-the-envelope estimation per the framework?",
    options: [
      "Always start with a 5-10 minute capacity estimation block: estimate DAU, QPS, storage, bandwidth — then proceed to design.",
      "Skip estimation entirely throughout the interview — modern systems are large enough that math doesn't matter.",
      "Skip BotE estimation upfront. Tell the interviewer you'll do math later in the interview when a calculation would actually influence a design choice.",
      "Demand the interviewer give you exact numbers (e.g., exact DAU) before doing any estimation."
    ],
    correctIndex: 2,
    explanation: "Many guides recommend an upfront BotE block, but the article's stance disagrees: most upfront calculations conclude 'ok, that's a lot,' which the interviewer learns nothing from. The default is to skip estimation upfront and do math during design only when a number would change a decision. Note this is NOT 'skip math entirely' (option C) — it's 'do math when it earns its keep.'",
    interviewScript: "At the start of the interview say: 'I'd like to skip upfront estimation and do math later if a calculation would change my design — sound good?' This makes the choice explicit rather than appearing to forget the step.",
    proTip: "Estimation is a tool for design decisions, not a ritual. Use it when it changes an answer; skip it when it doesn't."
  },
  {
    id: "q16",
    part: "E — Capacity Estimation",
    subtopic: "The 'ok, it's a lot' anti-pattern",
    difficulty: "L2",
    style: "Anti-Pattern Identification",
    conceptIds: [
      "E2",
      "E3",
      "E5",
      "E7"
    ],
    l5Pattern: null,
    question: "A candidate spends 6 minutes calculating: '300M users × 50% DAU = 150M DAU; ~100 tweets per user per day = 15B writes per day = ~175K writes per second. Plus reads, ~10x writes = ~1.75M reads per second. ... ok, so it's a lot.' They then proceed with the same design they would have done without the calculation. What signal did this give the interviewer, and what would 'using the calculation' have looked like?",
    options: [
      "It gave a strong signal — the candidate showed they can do back-of-the-envelope arithmetic, which is a core skill.",
      "It gave a positive signal because long calculations show seniority.",
      "It gave a negative signal — the candidate should never have done arithmetic at all.",
      "It gave essentially no signal beyond 'this candidate can multiply.' The math didn't drive any choice — the design was the same with or without it. Using the calculation would mean tying it to a specific decision: 'At 1.75M reads/sec, a single Postgres instance can't serve this; we need either a read-heavy cache (sub-ms reads) or sharded reads — let's go with cache + read replicas.' That's the calculation EARNING its time. Math without a coupled decision is decoration."
    ],
    correctIndex: 3,
    explanation: "The article calls this out directly: 'we gain nothing from this except that you can perform basic arithmetic.' The signal-bearing version of estimation is 'I'm doing this math because it changes my answer.' If your math ends with 'and so the design is X' that you'd have picked anyway, the math was wasted. The corrected version always closes the loop: calculation → specific decision derived from it. Bad mental arithmetic under pressure is normal; the article notes most people aren't great at it, so don't volunteer extra arithmetic that doesn't pay rent.",
    interviewScript: null,
    proTip: "Before doing any math, ask yourself: 'What decision will this number change?' If you can't name one, don't do the math."
  },
  {
    id: "q17",
    part: "E — Capacity Estimation",
    subtopic: "When estimation IS load-bearing",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "E3",
      "E4",
      "E6"
    ],
    l5Pattern: null,
    question: "Designing a TopK trending-topics service for Facebook posts, the interviewer asks: 'How many distinct topics are we tracking, roughly?' You respond '~10K hashtags actively trending.' They nod. Now: how does that estimate change your design, and what would it have looked like if the estimate had been ~100M instead?",
    options: [
      "At ~10K topics, a single in-memory min-heap fits comfortably on one instance — straightforward design. At ~100M topics, a single instance is infeasible (memory pressure + GC pauses + single point of failure for the entire trending feature), forcing sharding: partition the topics across N instances by hash, run a local TopK per instance, then merge. The sharded version has higher complexity (two-pass aggregation, partition-skew handling) AND different failure modes (one shard down = partial trending, not no trending). The estimate isn't decoration here — it's the literal pivot between two qualitatively different designs.",
      "It doesn't change anything — TopK is the same algorithm regardless of N.",
      "At ~100M topics, you'd just use a bigger machine. The design doesn't really change.",
      "The estimate is irrelevant; the interviewer just wants to see you can multiply."
    ],
    correctIndex: 0,
    explanation: "This is the article's TopK example. The number directly determines whether the natural data structure (a min-heap) fits on one machine or needs to be sharded. That's exactly the criterion for 'when does a calculation earn its time' — the design materially changes based on the answer. The interviewer asking 'roughly how many?' is signaling that the number matters for the design, not just for show. Note: the article also says estimation is still worth practicing even though many people are bad at mental arithmetic — the value isn't in the speed, it's in the reasoning about scale.",
    interviewScript: "When estimation does matter, narrate the loop: 'Let me check whether this fits on one instance — at 10K topics × 64 bytes each = 640KB, easily. So one min-heap. If it were 100M, we'd need sharding.' This makes the linkage between the math and the design choice visible.",
    proTip: "The most-cited estimation moments in real interviews are when the number is the deciding factor between 'one machine' and 'distributed' — that's when math is non-optional."
  },
  {
    id: "q18",
    part: "E — Capacity Estimation",
    subtopic: "Estimation that flips the architecture",
    difficulty: "L5",
    style: "Scenario-Based Trade-offs",
    conceptIds: [
      "E3",
      "E4"
    ],
    l5Pattern: "estimation-backed-scenario",
    question: "Designing a real-time leaderboard for a global mobile game, you've sketched a single Redis sorted set holding {userId → score}. The interviewer asks: '500M concurrent players, ~100K score updates per second peak. Does your single-set design hold?' What does the math actually reveal, and what's the senior+ structural response?",
    options: [
      "Yes — Redis is fast and 100K writes/sec is fine. No changes needed.",
      "The math reveals the scale boundary, and the senior+ response sketches BOTH halves of the trade-off explicitly: at 500M entries × ~16 bytes per ZSET member ≈ 8GB just for the sorted set — fits in a single Redis instance memory-wise, but the 100K writes/sec on one shard pushes write-amplification (replication lag, AOF fsync) into a fragile zone. Two architectural responses: (a) shard by region/leaderboard-segment, with a top-K merge for global views; (b) approximate top-K (e.g., HyperLogLog-style or sketch-based) to relax exactness for write throughput. The MATH is what surfaces the choice — without quantifying memory and writes/sec, you can't tell whether single-set works. The senior+ move: do the math, name BOTH options the math enables, and pick one with a stated trade-off (e.g., 'sharded — accept staleness on global view in exchange for write throughput and isolation').",
      "Switch to a SQL database — Redis can't handle this. (Don't bother with the math.)",
      "The math is irrelevant because real leaderboards always shard. Skip the calculation."
    ],
    correctIndex: 1,
    explanation: "L5 estimation-backed-scenario: the question is structured around an estimation moment that's load-bearing (single-set vs. sharded vs. approximate). The senior+ insight is twofold: (1) the math has to be done because the design pivots on it, and (2) once done, the math doesn't pick the winner — it surfaces the OPTIONS, and the candidate names the trade-offs explicitly (sharding = better isolation but staleness on global view; approximate = best throughput but exactness loss). Why C is the trap: it's the right architectural intuition but skips the work that earns the signal. Why D is wrong: it conflates 'this is well-known' with 'I don't need to derive it.' The interview is about the derivation.",
    interviewScript: null,
    proTip: "When estimation flips an architecture choice, narrate both branches the math reveals — don't just pick one silently. The interviewer wants to see you discovered the branch, not just landed on the answer."
  },
  {
    id: "q19",
    part: "F — Core Entities",
    subtopic: "What goes in the entities list",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "F1",
      "F2",
      "F5"
    ],
    l5Pattern: null,
    question: "After establishing the FRs for a Twitter-like service (post tweets, follow users, see feed), you're at the Core Entities step. Which list best matches the recommended approach for the FIRST DRAFT?",
    options: [
      "User { id, username, email, password_hash, created_at, last_login, follower_count, following_count, bio, profile_pic_url, ... }; Tweet { id, user_id, body, created_at, like_count, ... }; Follow { follower_id, followee_id, created_at } — full schemas to lock down state early.",
      "Auth, Cache, Queue, Database, Service — a list of components, not entities.",
      "User, Tweet, Follow — a brief bulleted list, called out to the interviewer as 'first draft, will refine fields as the design progresses.'",
      "Just User — every entity in a social system maps back to User somehow, so the others are redundant."
    ],
    correctIndex: 2,
    explanation: "The article specifies: 'this is as simple as jotting down a bulleted list and explaining this is your first draft.' Twitter's example is exactly User / Tweet / Follow. (A) is the schema-first anti-pattern — listing fields you don't yet need wastes time and locks in decisions that haven't been forced by the design. (C) confuses entities with components. (D) under-models — Tweet and Follow are real entities you'll persist and pass around in APIs.",
    interviewScript: "When listing entities, say it aloud: 'These are the core entities — first draft, I'll refine fields as the design forces them.' This signals you know the schema isn't final.",
    proTip: "If your first-draft entity list has more than ~5 items, you're either modeling too granularly or your FR list was too long."
  },
  {
    id: "q20",
    part: "F — Core Entities",
    subtopic: "Heuristics for identifying entities",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "F1",
      "F3",
      "F6"
    ],
    l5Pattern: null,
    question: "Designing Uber, a candidate is stuck on what entities to list. Which heuristic combination matches the framework's guidance and would produce the right minimal entity list?",
    options: [
      "List every database table you'd expect in an Uber clone: drivers, riders, trips, payments, vehicles, tariffs, ratings, etc. The more comprehensive the better.",
      "Default to the same entities used in Twitter (User, Post, Follow) and rename them to Uber-appropriate names.",
      "Ask: who are the ACTORS in the system (riders, drivers — note they're DIFFERENT roles, not the same User), and what NOUNS appear in the FRs ('book a ride' → Ride/Trip; 'pay for a ride' → Payment if payments are an FR). This produces a small list (Rider, Driver, Trip; Payment if in scope) — entities you know are load-bearing because the FRs require them. Other entities (Vehicle, Rating) get added only if the FRs that need them are in scope.",
      "Wait until you reach the database section, then list entities at that point."
    ],
    correctIndex: 2,
    explanation: "The article gives two questions for identifying entities: 'Who are the actors in the system? Are they overlapping?' and 'What are the nouns or resources necessary to satisfy the functional requirements?' For Uber, riders and drivers are non-overlapping actors (a senior question would explore 'should they be the same User entity with a role flag?'). The nouns in 'book a ride / drive a ride' produce Trip. This grounding-in-FRs approach prevents over-modeling (A) and misalignment (C/D).",
    interviewScript: null,
    proTip: "Walk through your FRs out loud and underline the nouns. Most of those nouns will be entities. Most things that aren't underlined aren't entities yet."
  },
  {
    id: "q21",
    part: "F — Core Entities",
    subtopic: "Schema iteration vs upfront completeness",
    difficulty: "L3",
    style: "Cross-Part Bridge (F × I)",
    conceptIds: [
      "F3",
      "F4"
    ],
    l5Pattern: null,
    question: "A candidate, at the Core Entities step, immediately starts drafting full database schemas for User, Tweet, and Follow — defining 12 columns each, including indexes, FK constraints, and column types. They spend 8 minutes on this. What is the strategic problem with this approach, and what's the corrected sequencing?",
    options: [
      "Nothing wrong — schemas should always be complete and rigorous from the start.",
      "The candidate is paying upfront for information they don't yet have. You don't know which fields matter until the HLD reveals what state needs to update on each request — designing the schema before that is guessing. The corrected sequence: (1) name entities only (User, Tweet, Follow). (2) Build HLD. (3) When HLD shows that fetching a feed requires (e.g.) tweet timestamps for ordering, ADD a created_at column to Tweet — and document it visually next to the database in the HLD. This way every column is design-driven and you spend zero effort on speculative fields like 'last_login_at' that may never be queried.",
      "The candidate should add MORE columns — incompleteness now leads to incompleteness later.",
      "The candidate should never write any schema fields, even after HLD."
    ],
    correctIndex: 1,
    explanation: "The article's specific guidance: 'Why not list the entire data model at this point? Because you don't know what you don't know. As you design your system, you'll discover new entities and relationships that you didn't anticipate.' The HLD is what surfaces which fields matter — feed-fetching needs created_at; following requires the Follow entity to be queryable by follower_id. Designing the schema before the HLD is wasted work because you're guessing which fields will be load-bearing. (D) over-corrects — you DO need to write down columns, just AFTER the HLD reveals them, and only the design-relevant ones.",
    interviewScript: "When you arrive at the database in HLD, narrate: 'For this query path, Tweet needs created_at. For the Follow lookup, we need an index on follower_id. I'm noting these next to the DB so they're tied to the queries that need them.'",
    proTip: "Schemas are emergent, not declarative. Every column you write should have a query-path that needs it."
  },
  {
    id: "q22",
    part: "F — Core Entities",
    subtopic: "Naming as load-bearing infrastructure",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "F7"
    ],
    l5Pattern: "implementation-specific-gotcha",
    question: "A candidate names their entities Item, Thing, Record, and Data, with subtypes ItemA, ItemB. The interviewer notes this without correcting it. Six minutes later, the candidate is confused about whether 'Record' refers to a Tweet or a Follow, and the interviewer has to ask twice for clarification. What is the deeper failure here, and why does the article elevate naming to 'one of the hardest problems in CS'?",
    options: [
      "Naming is the cheapest form of design documentation — names that match domain concepts (Tweet, Follow) reduce cognitive load for both the candidate and the interviewer for the rest of the interview. Names like Item/Record carry no semantic content, so every reference forces re-derivation ('which one was Record again?'). When this compounds across 30 minutes and 4 entities, the candidate's working memory burns on bookkeeping instead of design — and the interviewer loses confidence that the candidate models the domain crisply. The interview-specific gotcha: many candidates pick up generic names from coursework (Item, Record) and don't realize the cost is paid LATER, in confusion that masks as 'I'm getting nervous.' The fix is to spend an extra 30 seconds at the entity step to pick names that map to domain language — the 30 seconds save 5+ minutes of confusion downstream.",
      "Naming is purely cosmetic — the candidate just needed better notes.",
      "The candidate's only mistake was using 4 entities — they should have used 2. Naming is a non-issue.",
      "The interviewer should have corrected the names; it's not the candidate's responsibility to communicate clearly."
    ],
    correctIndex: 0,
    explanation: "L5 implementation-specific-gotcha: this is the kind of failure that doesn't appear in any rubric but compounds invisibly across the interview. The article quotes the famous 'two hardest things in CS' joke (cache invalidation and naming things) precisely because naming has outsized leverage on every subsequent step. Why most candidates pick A: they treat naming as cosmetic, missing that bad names tax working memory across the rest of the design. Why D is wrong: the interviewer is testing whether you communicate clearly, not whether they can extract clarity from your design. The senior+ move: pick domain-faithful names BEFORE the design starts (Tweet not Record, Follow not Relationship), and call them out so the interviewer commits to your vocabulary too.",
    interviewScript: null,
    proTip: "Choose entity names that an industry insider would recognize at a glance. If the name needs a glossary, it's wrong."
  },
  {
    id: "q23",
    part: "G — API / System Interface",
    subtopic: "REST defaults and resource naming",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "G1",
      "G4",
      "G5",
      "G9"
    ],
    l5Pattern: null,
    question: "Designing the API for posting a tweet, which endpoint best matches the framework's default conventions?",
    options: [
      "POST /v1/tweet — creates one tweet using a singular resource name.",
      "RPC.callTweetService('createTweet', { body }) — gRPC by default.",
      "GET /v1/createTweet?body=... — GET with the action in the URL.",
      "POST /v1/tweets — creates one tweet using the plural resource name; uses HTTP POST verb on the resource."
    ],
    correctIndex: 3,
    explanation: "REST is the default unless you have a specific reason otherwise. REST uses HTTP verbs (POST = create) and CRUD on resources, where resources are PLURAL nouns (tweets, not tweet). (A) uses singular naming — minor but the article specifically calls out plural. (C) abuses GET for state-changing actions and embeds the action in the URL. (D) is gRPC, which is the right tool only for internal performance-sensitive service-to-service communication — not the default for an interview.",
    interviewScript: null,
    proTip: "When in doubt, REST + plural-resource nouns + HTTP verbs. Reach for GraphQL or gRPC only when you can name a specific reason."
  },
  {
    id: "q24",
    part: "G — API / System Interface",
    subtopic: "API as contract; mapping to FRs",
    difficulty: "L2",
    style: "Cross-Part Bridge (G × C)",
    conceptIds: [
      "G1",
      "G2",
      "G3",
      "G10"
    ],
    l5Pattern: null,
    question: "You've listed 3 FRs for Twitter (post, follow, see feed) and now you're at the API step. Which of these reflects how the API connects back to the FRs?",
    options: [
      "The API is independent of the FRs — design it based on what feels REST-natural.",
      "Endpoints are decided in HLD; the API step is just for picking REST vs. GraphQL.",
      "Each FR maps to one or more API endpoints — POST /tweets satisfies 'post tweets'; POST /follows satisfies 'follow users'; GET /feed satisfies 'see feed'. The API is the CONTRACT that the rest of the design has to satisfy: when you build the HLD, you trace each endpoint through the system. The mapping is usually direct, especially for product systems — but not always. Some systems have FRs that span multiple endpoints (e.g., 'send a payment' might decompose into create-intent + confirm-intent endpoints), and some have endpoints that satisfy non-FR concerns (admin, health). The default mapping is 'one FR → one endpoint,' deviated from with reason.",
      "The API should have one endpoint per database table, regardless of FRs."
    ],
    correctIndex: 2,
    explanation: "The article: 'oftentimes, especially for full product style interviews, this maps directly to the functional requirements you've already identified (but not always!).' The API step matters because it's the first artifact that turns abstract FRs into concrete contracts the rest of the design must serve. The Twitter example endpoints (POST /tweets, POST /follows, GET /feed) come straight from the 3 FRs. The 'but not always' caveat is real: some FRs decompose into multiple endpoints, and some endpoints exist for cross-cutting concerns. Default to direct mapping; deviate consciously.",
    interviewScript: "While drawing the API, glance at your FR list and explicitly say 'POST /tweets satisfies FR-1; POST /follows satisfies FR-2; GET /feed satisfies FR-3.' This proves the API satisfies the requirements.",
    proTip: "If you have an FR with no endpoint covering it, that's a hole. If you have an endpoint with no FR motivating it, that's scope creep."
  },
  {
    id: "q25",
    part: "G — API / System Interface",
    subtopic: "REST vs GraphQL vs gRPC",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: [
      "G4",
      "G6",
      "G7"
    ],
    l5Pattern: null,
    question: "Which scenario best justifies departing from REST as the default?",
    options: [
      "Designing a user-facing mobile app that fetches profile data — same as web, just on a phone. → Use GraphQL.",
      "Designing an internal billing service called by the order service and the fraud service, where p99 latency under 5ms is required and both services are owned by the same team. → Use gRPC.",
      "Designing a public REST API for third-party developers. → Use gRPC for performance.",
      "Designing a CRUD admin tool. → Use GraphQL for flexibility."
    ],
    correctIndex: 1,
    explanation: "The article maps the three protocols cleanly: REST default; GraphQL when you have DIVERSE clients with different data needs (so they avoid over-fetching/under-fetching); gRPC for internal action-oriented service-to-service calls where performance is critical. (A) matches the gRPC criteria exactly — internal, performance-sensitive, action-oriented. (B) is wrong: same client + same data shape doesn't justify GraphQL's complexity. (C) is wrong: gRPC for public APIs creates client-tooling friction that dwarfs perf gains. (D) is wrong: standard CRUD admin is a textbook REST case.",
    interviewScript: "When picking a protocol, narrate the criterion: 'REST default. I'm reaching for [GraphQL/gRPC] because [specific criterion: diverse clients / internal performance].' This shows you know the criterion, not just the menu.",
    proTip: "If you can't name the specific criterion that justifies leaving REST, don't leave REST."
  },
  {
    id: "q26",
    part: "G — API / System Interface",
    subtopic: "Auth security & realtime placement",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "G8",
      "G11"
    ],
    l5Pattern: null,
    question: "A candidate proposes: POST /v1/follows with body { follower_id, followee_id }. The interviewer asks: 'How does the server know who's actually making the request?' The candidate says 'follower_id from the body.' What's wrong with that, and what's the corrected design?",
    options: [
      "Trusting follower_id from the request body lets ANY authenticated client follow on behalf of any user — a trivial impersonation vector. The corrected design: derive the current user from the auth token (e.g., JWT in Authorization header) on the SERVER, never from the request body or path. The endpoint becomes POST /v1/follows with body { followee_id } — follower_id comes from the validated auth token. The article calls this out as a security non-negotiable: 'Never rely on sensitive information like user IDs from request bodies when they should come from authentication.'",
      "Nothing is wrong — passing user IDs in the body is the standard pattern.",
      "The interviewer is being pedantic — security is for the deep dives section.",
      "The candidate should add a captcha to prevent impersonation. (Don't change the body schema.)"
    ],
    correctIndex: 0,
    explanation: "This is a frequent senior-level signal. The auth token is the only trustworthy source of 'who is making the request.' Anything in the body or URL path is client-controlled and forgeable. Even if your endpoint requires authentication, an authenticated user could pass another user's ID and pretend to act on their behalf. The fix is structural: the server reads the token, validates it, and uses the resulting user identity — request body never contains the current user. This generalizes: it's not just follow — every 'who am I' field needs to come from auth.",
    interviewScript: "When you sketch any endpoint, after writing the body, ask aloud: 'Is there a current-user field here that should come from auth instead?' If yes, move it. This catches the gotcha before the interviewer points it out.",
    proTip: "The current user is ALWAYS derived from the auth token. If you ever see user_id in a request body, ask whether it should be there."
  },
  {
    id: "q27",
    part: "G — API / System Interface",
    subtopic: "Realtime requirements appearing late",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "G2",
      "G8"
    ],
    l5Pattern: "future-proofing",
    question: "You've designed REST endpoints for a chat app: POST /messages, GET /conversations/{id}/messages. At minute 30, the interviewer says: 'Actually, the messages need to appear in real time without polling.' A candidate panics and starts re-architecting from scratch. What's the senior+ response, and what does this scenario reveal about how the article frames realtime in the API step?",
    options: [
      "Re-architect from scratch — the REST design is a sunk cost and needs to be replaced wholesale with a WebSocket-based design.",
      "Switch entirely to GraphQL subscriptions for both messaging and delivery.",
      "Tell the interviewer realtime is out of scope and stick to REST.",
      "The article specifically says: 'For real-time features, you'll also need WebSockets or Server-Sent Events, but design your core API first.' That's exactly the situation here. The senior+ response: keep REST for the mutating actions (POST /messages — clients still send messages this way) AND ADD a WebSocket or SSE channel for delivery (GET /conversations/{id}/stream — clients subscribe for updates). The two layers are complementary, not alternatives — REST handles 'do an action,' realtime handles 'tell me when something happened.' Designing the core API in REST first wasn't wasted — it was the right path because realtime's role is delivery, not actions. Re-architecting from scratch (A) is the panic response that loses 5 minutes of solid design work to no purpose."
    ],
    correctIndex: 3,
    explanation: "L5 future-proofing: the question tests whether the candidate can extend their design without panicking when a new requirement lands. The article's specific guidance — 'design your core API first, then add WebSockets/SSE for realtime' — is exactly this scenario. The two layers aren't alternatives. POST /messages still makes sense in a realtime chat (clients still need to SEND messages); the addition is a delivery channel for clients to RECEIVE pushes. Why most candidates pick A: panic + sunk-cost confusion. The senior+ insight is recognizing that realtime is an ADDITION to the API, not a REPLACEMENT — the two-layer model (REST for actions, push channel for delivery) is the durable pattern. Why C is wrong: that's a scope refusal, not a design response. Why D is wrong: that's over-correcting and abandoning REST elsewhere where it's correct.",
    interviewScript: null,
    proTip: "When realtime is added late to a design, the rule of thumb: keep REST for state changes, add a push channel (WS/SSE) for state propagation. Don't tear down REST."
  },
  {
    id: "q28",
    part: "H — [Optional] Data Flow",
    subtopic: "When to include the Data Flow step",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "H1",
      "H2"
    ],
    l5Pattern: null,
    question: "For which of these systems is the Data Flow step in the framework most likely worth including?",
    options: [
      "Twitter (post / follow / see-feed) — a product system with mostly direct request/response flows.",
      "A simple URL shortener (POST a long URL, GET back a short URL).",
      "An ad-bidding pipeline that ingests user events, joins them with bid history, runs a model, places bids, and stores results — a long sequence of stages on each input.",
      "Any chat application."
    ],
    correctIndex: 2,
    explanation: "The article says Data Flow 'can be helpful' for 'data-processing systems' that have a high-level sequence of actions on the inputs. The ad-bidding example — multi-stage pipeline transforming events through several steps — is exactly that. Product systems like Twitter (A) or a URL shortener (C) don't benefit because each request is short and direct; chat (D) is also direct unless you're modeling the realtime delivery pipeline specifically. The article explicitly says 'If your system doesn't involve a long sequence of actions, skip this!'",
    interviewScript: null,
    proTip: "Ask yourself: 'Is there a multi-step transformation chain on each input?' If no, skip Data Flow. If yes, list the stages."
  },
  {
    id: "q29",
    part: "H — [Optional] Data Flow",
    subtopic: "Format and informing HLD",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "H3",
      "H4",
      "H5"
    ],
    l5Pattern: null,
    question: "Designing a web crawler, a candidate writes the data flow as: '1. Fetch seed URLs. 2. Parse HTML. 3. Extract URLs. 4. Store data. 5. Repeat.' What's the role of this list, and how does it inform the next step (HLD)?",
    options: [
      "It's purely documentation; it has no role in the HLD.",
      "The list is a simple sequential summary that becomes the SKELETON of the HLD: each step typically maps to a component or a service in the architecture (Fetcher → URL Frontier → Parser → URL Extractor → Storage). The HLD then fleshes out the connections, queues between stages, error handling, and scaling decisions for each stage. Writing the data flow first means the HLD doesn't have to invent the pipeline shape — it inherits it.",
      "The list should be replaced by a complex flowchart with conditionals and parallel paths.",
      "The list is fine but should not be used to inform HLD — the HLD should be designed independently."
    ],
    correctIndex: 1,
    explanation: "The article: 'You'll use this flow to inform your high-level design in the next section.' The flow is intentionally a simple list (numbered steps), and each step typically lights up as a box in the HLD. The crawler example translates almost directly: each numbered step becomes a labeled component, with arrows representing the inter-stage data movement. Without the data-flow step for pipeline-shaped systems, candidates often try to draw the HLD bottom-up and lose the macro-shape — the data flow is the macro-shape made explicit.",
    interviewScript: "When you transition from Data Flow to HLD, narrate: 'Each step here will become one or more components — let me draw the architecture top-down from this list.' This makes the link visible.",
    proTip: "A clean data flow makes the HLD almost mechanical — it's the cheapest way to avoid getting lost in pipeline systems."
  },
  {
    id: "q30",
    part: "H — [Optional] Data Flow",
    subtopic: "Skipping when not needed",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "H1",
      "H2",
      "H5"
    ],
    l5Pattern: null,
    question: "Designing Twitter, a candidate forces a Data Flow section: 'Step 1: client makes request. Step 2: server receives request. Step 3: server queries database. Step 4: server returns response.' The interviewer asks: 'Why is this step in your design?' What's the right response?",
    options: [
      "Defend the section: 'Every system has a data flow, so it should be documented.' Stand firm.",
      "Refuse to answer — the framework is correct as written.",
      "Add more steps to make the data flow look more substantial.",
      "Concede the step doesn't help: 'You're right — for a product system like Twitter, there's no multi-stage pipeline shape that data flow would clarify. The framework calls this step optional, and Twitter doesn't earn it. Let me skip it and move to HLD.' Then move on. The trivial 'request → server → DB → response' isn't a data flow in the sense the framework means; it's the shape of every CRUD system, so listing it adds no signal and consumes time."
    ],
    correctIndex: 3,
    explanation: "The article makes the Data Flow step explicitly optional: '[Optional] Data Flow' in the section header, and 'If your system doesn't involve a long sequence of actions, skip this!' Forcing the step on a CRUD system gives you nothing while costing time. The senior+ move is recognizing when a framework step doesn't apply and skipping it cleanly — frameworks are tools, not rituals. The candidate's response should also recognize that a 'data flow' that's the same shape as every system isn't really telling you anything; it's just generic.",
    interviewScript: "If you find yourself starting a Data Flow section for a non-pipeline system, stop and say: 'Actually, this is a CRUD-shape system, no multi-stage flow — let me skip to HLD.' This is more impressive than forcing a generic flow.",
    proTip: "Frameworks have optional steps for a reason. Skipping them when they don't apply is a sign of mastery, not laziness."
  },
  {
    id: "q31",
    part: "I — High Level Design",
    subtopic: "What HLD is and the tools to draw it",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "I1",
      "I2",
      "I3"
    ],
    l5Pattern: null,
    question: "Which best describes the High Level Design step?",
    options: [
      "Boxes-and-arrows showing the major components (servers, databases, caches, queues) and how they interact, drawn on a whiteboard or with whiteboarding software like Excalidraw.",
      "Detailed code-level architecture with classes, methods, and field types defined.",
      "A list of every database table with full SQL DDL.",
      "A network diagram with VPC, subnets, and security groups."
    ],
    correctIndex: 0,
    explanation: "The article: 'This consists of drawing boxes and arrows to represent the different components of your system and how they interact. Components are basic building blocks like servers, databases, caches, etc.' Tools: whiteboard or Excalidraw, with the practical recommendation to ask the recruiter what software the interview will use and practice with it ahead of time. (A) is too detailed — you'd never finish in 15 minutes. (C) and (D) are specialized artifacts not what HLD means here.",
    interviewScript: "Ask your recruiter what whiteboarding tool the interview will use. If it's Excalidraw, practice with it for an hour before the interview — small UX friction during the interview costs disproportionate time.",
    proTip: "HLD is breadth-first: get every major component on the page before you go deep on any one of them."
  },
  {
    id: "q32",
    part: "I — High Level Design",
    subtopic: "Build sequence: API-driven HLD",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "I4",
      "I5"
    ],
    l5Pattern: null,
    question: "You have your API drafted (POST /tweets, POST /follows, GET /feed). How does the framework recommend you sequence the build of the HLD?",
    options: [
      "Start by drawing every component you can think of, then connect them.",
      "Go through your API endpoints one at a time. For each, trace the request through the components needed to satisfy it (e.g., POST /tweets → app server → DB write; GET /feed → app server → DB query). Build up the design incrementally as you cover each endpoint. The result: every component on the page has a reason for existing, and every endpoint has a path through the system.",
      "Start from the database schema and work outward.",
      "Start from the user interface and work backward."
    ],
    correctIndex: 1,
    explanation: "The article: 'In most cases, you can even go one-by-one through your API endpoints and build up your design sequentially to satisfy each one.' This is the cleanest discipline because (a) every component you add is justified by an endpoint that needs it, and (b) at the end you can verify each endpoint has a path through the system, which is the same as verifying you've satisfied each FR. (A) tends to produce orphan components. (C) is data-modeling-first, the schema-upfront anti-pattern from Part F.",
    interviewScript: null,
    proTip: "After HLD, point at each API endpoint and trace its path through your diagram. If you can't, the design has a hole."
  },
  {
    id: "q33",
    part: "I — High Level Design",
    subtopic: "Resisting premature complexity",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: [
      "I6",
      "I7"
    ],
    l5Pattern: null,
    question: "At minute 18, drawing the HLD for Twitter, a candidate thinks: 'I should add a Redis cache in front of the user lookups. And a Kafka queue for tweet writes. And a CDN for media. And a separate read replica for feed queries.' They start adding all of them now. What's the framework's specific guidance for this moment?",
    options: [
      "Add them all — more components shows architectural sophistication.",
      "Skip all the optimizations — caches and queues are unnecessary in any system.",
      "Note each idea verbally + with a small written note (e.g., 'CACHE?' beside the user-lookup arrow), then KEEP MOVING through the high-level design. Layering complexity in HLD is the exact anti-pattern the article warns about: 'It's incredibly common for candidates to start layering on complexity too early, resulting in them never arriving at a complete solution.' The complexity ideas are valid — but they belong in the deep-dives section, where the NFRs that motivate them get explicit treatment. The HLD's job is to satisfy the FUNCTIONAL requirements; deep dives is where you harden against the NON-functional ones.",
      "Pause for 5 minutes to evaluate which optimization is most important and add only that one."
    ],
    correctIndex: 2,
    explanation: "The article gives an explicit recipe: 'note these areas with a simple verbal callout and written note, and then move on.' This works because the IDEAS aren't wrong — caches and queues for Twitter are reasonable — but the TIMING is. The HLD's success criterion is 'meets the FRs end-to-end.' Optimizations meet NFRs (latency, scale, etc.), and those NFRs get explicit treatment in deep dives where you can argue them against trade-offs. Adding caches in HLD before you've proved the simple version works is one of the surest ways to run out of time at minute 35 with an incomplete design.",
    interviewScript: "When you spot a complexity idea, say: 'Note: we'll probably want a cache here for user-lookup hot path — flagging for deep dives.' Write 'CACHE?' next to the relevant arrow. Keep drawing.",
    proTip: "If you find yourself adding any infrastructure component (cache, queue, replica) before finishing every FR's path through the system, stop. That's the layering anti-pattern."
  },
  {
    id: "q34",
    part: "I — High Level Design",
    subtopic: "Documenting state changes & schema fields",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "I8",
      "I9",
      "I10",
      "I11"
    ],
    l5Pattern: null,
    question: "While drawing HLD for Twitter, the interviewer asks: 'When a user posts a tweet, what state changes?' A candidate freezes — they hadn't been narrating state. What does the framework recommend, and what's the corrected behavior?",
    options: [
      "The candidate should refuse the question — state mutations are for deep dives.",
      "Skip schema entirely; it's outside the scope of HLD.",
      "Document every column on every entity in full detail with types and constraints.",
      "Talk through the data flow + state changes for EVERY request as you draw the HLD: 'POST /tweets — request hits app server, app server inserts a row into the Tweet table with (tweet_id, user_id, body, created_at), returns the tweet_id.' Document the relevant columns visually next to the database. Don't document obvious columns the interviewer can infer (User has name/email/password — skip those). Don't worry about types — the interviewer will infer. Focus on columns that are LOAD-BEARING for the design's queries (user_id and created_at on Tweet because the feed query needs them; not last_login_timestamp because no query uses it)."
    ],
    correctIndex: 3,
    explanation: "Three pieces of article guidance combined: (1) 'Be explicit about how data flows through the system and what state changes with each request' — narration during HLD, not silent drawing. (2) 'When your request reaches your database or persistence layer, it's a great time to start documenting the relevant columns/fields for each entity.' (3) 'Don't waste your time documenting every column/field in your schema. ... focus on the columns/fields that are particularly relevant to your design.' And: 'No need to worry too much about types here, your interviewer can infer.' Together: narrate the state mutation, write the design-relevant columns next to the DB, skip the obvious ones, skip types.",
    interviewScript: "For each endpoint, when its arrow hits the DB, write the 1-3 columns this query path actually needs, right beside the DB. Say aloud: 'For the feed query, Tweet needs created_at and user_id on a covering index.'",
    proTip: "Columns earn their place by being load-bearing for a specific query. If you can't name the query that needs the column, don't write it."
  },
  {
    id: "q35",
    part: "I — High Level Design",
    subtopic: "Interviewer prompts for premature optimization",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "I6"
    ],
    l5Pattern: "framing-is-wrong",
    question: "At minute 14, mid-HLD, the interviewer asks: 'Don't you think you need a cache here?' A candidate, eager to show they've thought about caching, immediately stops drawing the HLD and spends 8 minutes adding a Redis cache, justifying its placement, discussing eviction, and arguing TTL. They never complete the HLD before time runs out. The interviewer's question was a probe, not a prescription. What was the trap, and what's the senior+ response?",
    options: [
      "The trap is treating the interviewer's prompt as a CHANGE OF AGENDA when it was a PROBE. The interviewer wants to know whether you'll lose your structure under suggestion. The senior+ response acknowledges the question, defers it explicitly, and continues: 'Good prompt — yes, cache placement is a discussion I want to have. Let me note CACHE? on the diagram and finish the HLD; I'll come back to it in deep dives where I can weigh fanout-on-read vs. cached feed.' This both treats the interviewer's prompt as legitimate AND maintains structural discipline. The candidate who pivots to cache for 8 minutes has just signaled they can be redirected by any prompt — which is a junior signal. The senior signal is RECOGNIZING that the interviewer is testing structural discipline and explicitly acknowledging-and-deferring.",
      "There's no trap — the interviewer asked about caching, so the candidate addressed caching. Time pressure is the only issue.",
      "The candidate should refuse to discuss caching: 'That's out of scope.' Strong defenses signal seniority.",
      "The candidate should have skipped HLD entirely and gone straight to the cache discussion."
    ],
    correctIndex: 0,
    explanation: "L5 framing-is-wrong: the obvious reading of 'don't you think you need a cache here?' is 'add a cache.' The deeper reading is 'will this candidate lose the framework when prompted?' Most senior interviews include at least one of these probes. The senior+ pattern is acknowledge → defer (with a written note) → continue. Why most candidates pick A: cooperative bias — the interviewer asked, so they answer. Why C is the trap: it's the mirror-image failure — over-defending instead of capitulating. The senior+ insight is that the right response holds two things at once: 'yes, this is a real discussion (acknowledge)' AND 'now is not when we have it (defer with discipline).' The framework provides the deferral mechanism (deep dives) precisely so this acknowledge-and-defer pattern works without seeming dismissive.",
    interviewScript: null,
    proTip: "Most interviewer mid-HLD prompts about optimizations are probes, not prescriptions. Default response: acknowledge, write a note, defer to deep dives, keep building."
  },
  {
    id: "q36",
    part: "J — Deep Dives",
    subtopic: "Purpose of the Deep Dives section",
    difficulty: "L1",
    style: "Recognition",
    conceptIds: [
      "J1",
      "J2"
    ],
    l5Pattern: null,
    question: "What is the explicit purpose of the Deep Dives section in the framework?",
    options: [
      "To re-design the system from scratch using better techniques.",
      "To HARDEN the design by ensuring it meets non-functional requirements, addressing edge cases, identifying and fixing bottlenecks, and responding to interviewer probes.",
      "To impress the interviewer with knowledge of advanced techniques unrelated to the design.",
      "To pad out the remaining time so the interview ends cleanly at 45 minutes."
    ],
    correctIndex: 1,
    explanation: "The article enumerates the deep-dives objectives: meet NFRs, address edge cases, identify and address bottlenecks, improve based on interviewer probes. The HLD's job was to satisfy FRs end-to-end; deep dives now turns the simple-but-complete HLD into a hardened system. (A) misframes — you don't redesign, you reinforce. (C) is the show-off anti-pattern. (D) trivializes the most signal-bearing part of the interview.",
    interviewScript: null,
    proTip: "Look at your NFR list as your deep-dive shopping list — each NFR maps to one or more deep-dive topics."
  },
  {
    id: "q37",
    part: "J — Deep Dives",
    subtopic: "Junior vs senior driving behavior",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: [
      "J2",
      "J3"
    ],
    l5Pattern: null,
    question: "How does the framework expect deep-dive driving to differ between junior and senior candidates?",
    options: [
      "There's no difference — both should wait silently for the interviewer to ask questions.",
      "Both should drive aggressively — the most aggressive candidate wins.",
      "Junior candidates can expect the interviewer to drive — pointing out areas to improve and asking questions. Senior candidates should be able to identify those areas themselves and lead the discussion ('I'm noticing the feed query won't scale to 100M DAU — let me discuss fanout-on-read vs fanout-on-write'). Senior signal is PROACTIVE leadership of deep dives.",
      "Junior candidates should drive harder than seniors to compensate for their lack of experience."
    ],
    correctIndex: 2,
    explanation: "The article: 'The degree to which you're proactive in leading deep dives is a function of your seniority. More junior candidates can expect the interviewer to jump in here and point out places where the design could be improved. More senior candidates should be able to identify these places themselves and lead the discussion.' This is a calibrated expectation — interviewers calibrate the bar by level. A senior candidate who waits silently for prompts is leaving the most senior signal on the table.",
    interviewScript: "If you're senior, after HLD say: 'Looking at this design against my NFRs — 100M DAU and feeds < 200ms — the most interesting deep dives are [X] and [Y]. Let me start with [X].' This proactively names the topics.",
    proTip: "If you're senior+, name your top 2 deep-dive topics out loud at the transition. Don't wait to be asked."
  },
  {
    id: "q38",
    part: "J — Deep Dives",
    subtopic: "Deep-dive selection driven by NFRs",
    difficulty: "L3",
    style: "Cross-Part Bridge (D × J)",
    conceptIds: [
      "J4",
      "J5",
      "J9"
    ],
    l5Pattern: null,
    question: "For Twitter, which two deep-dive topics most directly map to the stated NFRs (100M DAU; feeds rendered in under 200ms), and what's the structural reason these are the natural picks?",
    options: [
      "Database normalization and ORM choice — both are technical depth showcases.",
      "Code style and naming conventions — these affect maintainability.",
      "Authentication and TLS configuration — security is always the most senior topic.",
      "(1) Horizontal scaling / caches / DB sharding — directly maps to 100M DAU. (2) Fanout-on-read vs fanout-on-write — directly maps to the feed-latency NFR (it's the actual interesting design choice for delivering low-latency feeds at scale). The structural reason: deep dives are NFR-driven, so the NFRs predict which discussions will be load-bearing. Both topics are also where the article says Twitter's 'most interesting problem' lives — feed delivery is qualitatively harder than the simple HLD suggests."
    ],
    correctIndex: 3,
    explanation: "The article uses Twitter as the worked example: 100M DAU → 'horizontal scaling, the introduction of caches, and database sharding'; feeds < 200ms → 'fanout-on-read vs fanout-on-write and the use of caches.' These aren't arbitrary — each is the deep-dive that the corresponding NFR most demands. The senior+ pattern is to recognize that NFRs are the menu for deep dives: each NFR worth listing should generate at least one deep-dive topic.",
    interviewScript: "Open deep dives by saying: 'My NFRs say 100M DAU and feeds < 200ms. Those map to [scaling/sharding] and [fanout strategies]. Let me start with fanout because it's the most interesting trade-off in this design.' This names the link explicitly.",
    proTip: "Each NFR should generate at least one deep-dive topic. If an NFR doesn't, either the NFR was vague or the deep-dives section is missing material."
  },
  {
    id: "q39",
    part: "J — Deep Dives",
    subtopic: "Talking-over-the-interviewer trap",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: [
      "J6",
      "J7",
      "J8"
    ],
    l5Pattern: null,
    question: "A senior candidate, knowing they should drive deep dives, monologues for 7 minutes straight on cache strategies, sharding, and load balancing — barely pausing. The interviewer hasn't been able to ask anything. The post-interview feedback says the candidate seemed 'didn't engage with the interviewer's signals.' What specifically went wrong, and what's the corrected pattern?",
    options: [
      "Driving deep dives is NOT the same as talking continuously. The interviewer has specific signals they want to collect — they ask probing questions to test depth on particular topics. A 7-minute monologue starves them of the chance to probe, which means even if you're right, the interviewer can't COLLECT the signal. The corrected pattern: name your topic, talk for ~60-90 seconds, pause and check ('does that match how you'd want me to handle this, or do you want me to go deeper somewhere else?'). This treats the interview as collaborative and gives the interviewer the room they need to direct the depth. The article calls this out: talking over the interviewer hurts BOTH technical signal (you miss what they wanted to hear) AND communication score.",
      "The candidate did nothing wrong — driving deep dives means talking continuously.",
      "The candidate should have talked even faster to fit more content in.",
      "The candidate should have refused to do deep dives at all."
    ],
    correctIndex: 0,
    explanation: "The article's specific warning: 'A common mistake candidates make is that they try to talk over their interviewer here. There is a lot to talk about, sure, and for senior candidates being proactive is important, however, it's a balance. Make sure you give your interviewer room to ask questions and probe your design. Chances are they have specific signals they want to get from you and you're going to miss it if you're too busy talking. Plus, you'll hurt your evaluation on communication and collaboration.' The corrected rhythm — name topic → 60-90s on it → pause and check — gives the interviewer probe windows without abdicating the lead.",
    interviewScript: "After each deep-dive topic, pause and ask: 'Want me to go deeper here, or move to the next topic?' This gives the interviewer the steering wheel without giving up the gas pedal.",
    proTip: "60-90 seconds of monologue → check-in. That's the cadence. If you've talked for 3+ minutes uninterrupted in a deep dive, you've gone too long."
  },
  {
    id: "q40",
    part: "J — Deep Dives",
    subtopic: "When the framework signals 'now stop driving'",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: [
      "B4",
      "J3",
      "J6",
      "J8"
    ],
    l5Pattern: "framing-is-wrong",
    question: "A senior candidate has been driving deep dives confidently for 6 minutes, naming and resolving topics. The interviewer asks: 'Hmm — let me step in here. What about the case where a follower's read replica lags behind by 30 seconds?' A candidate hears 'let me step in' as a small interruption and continues their planned next topic ('on to sharding'). The interviewer doesn't ask follow-ups. What did the candidate miss, and how does this connect back to the framework's 'structure as fallback' principle?",
    options: [
      "The candidate missed an interviewer-driven probe. 'Let me step in' is the explicit handoff: the interviewer is collecting their own signal now and the candidate's job shifts from DRIVING to RESPONDING. The framework's structure-as-fallback principle works in BOTH directions — it gives you a path to follow when nervous (drive) AND a path to drop when the interviewer wants to drive (respond). Continuing to plough through your topic list ignores the steering signal and produces exactly the 'didn't engage with interviewer signals' feedback. The senior+ insight is that 'driving deep dives' is not 'monologuing through a list' — it's 'leading when nobody else is, and yielding when someone is.' Most candidates fail this either by under-driving (waiting silently) or by over-driving (ignoring handoffs). The framework's fallback is bidirectional: always give the interviewer right-of-way when they take it.",
      "The candidate did nothing wrong — they stayed on their plan, which is what senior leadership looks like.",
      "The candidate should have kept talking even louder to keep the floor.",
      "The candidate should have refused to address the lag question, since it wasn't on their topic list."
    ],
    correctIndex: 0,
    explanation: "L5 framing-is-wrong + cross-part bridge B × J: the obvious reading of 'driving deep dives' is 'monologue through your topic list,' but the deeper reading is 'lead when nobody else is leading.' When the interviewer takes the floor with 'let me step in,' the candidate's role switches. The framework's structure-as-fallback principle was introduced as 'a path to fall back to when you're overwhelmed' — but the principle generalizes: structure also tells you when to YIELD (when the interviewer takes initiative). Most candidates miss this because they conflate 'driving' with 'continuous talking.' The senior+ pattern: drive when the interviewer is silent; respond fully when they probe; never plough past their probes. Why most pick A: misframing seniority as relentless leadership. Why C is the inverse trap: over-correcting away from leadership. The right answer is bidirectional discipline — lead and yield as the moment requires.",
    interviewScript: null,
    proTip: "Phrases like 'let me step in,' 'hmm,' 'wait,' or 'I'm curious about X' are explicit handoff signals. Drop your plan immediately and engage with the probe — your topic list will still be there afterward."
  }
];

const PARTS_ORDER = [
  "B — Why a Delivery Framework",
  "C — Functional Requirements",
  "D — Non-Functional Requirements",
  "E — Capacity Estimation",
  "F — Core Entities",
  "G — API / System Interface",
  "H — [Optional] Data Flow",
  "I — High Level Design",
  "J — Deep Dives",
];

const PART_COUNTS = PARTS_ORDER.map((name) => ({
  name,
  count: QUESTIONS.filter((q) => q.part === name).length,
}));

const DIFFICULTY_TIERS = ["L1", "L2", "L3", "L4", "L5"];

const TIMER_BY_TIER = { L1: 60, L2: 90, L3: 90, L4: 120, L5: 150 };
const LEGACY_TIMER = 90;

function getTimerDuration(q) {
  if (q && q.difficulty && TIMER_BY_TIER[q.difficulty] != null) {
    return TIMER_BY_TIER[q.difficulty];
  }
  return LEGACY_TIMER;
}

const DIFFICULTY_STYLES = {
  L1: { label: "L1 · Recognition", color: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  L2: { label: "L2 · Understanding", color: "bg-cyan-500/15 border-cyan-500/40 text-cyan-300" },
  L3: { label: "L3 · SDE2-Core", color: "bg-blue-500/15 border-blue-500/40 text-blue-300" },
  L4: { label: "L4 · Senior Pushback", color: "bg-amber-500/15 border-amber-500/40 text-amber-300" },
  L5: { label: "L5 · Staff/Extreme", color: "bg-red-500/15 border-red-500/40 text-red-300" },
};

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
    const partA = PARTS_ORDER.indexOf(a.part);
    const partB = PARTS_ORDER.indexOf(b.part);
    if (partA !== partB) return partA - partB;
    const tierA = DIFFICULTY_TIERS.indexOf(a.difficulty);
    const tierB = DIFFICULTY_TIERS.indexOf(b.difficulty);
    return tierA - tierB;
  });
}

export default function DeliveryFrameworkQuiz({ quizSlug = 'in-a-hurry-delivery' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("ladder");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [timer, setTimer] = useState(LEGACY_TIMER);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showingSkipped, setShowingSkipped] = useState(false);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const { saveAnswer: persistAnswer, completeQuiz } = useQuizProgress(quizSlug, QUESTIONS.length);

  const currentQuestion = questions[currentIndex];
  const currentTimerMax = getTimerDuration(currentQuestion);

  const startQuiz = useCallback(
    (selectedMode) => {
      const m = selectedMode || mode;
      let qs;
      if (m === "shuffled") {
        qs = shuffleArray(QUESTIONS);
      } else if (m === "ordered") {
        qs = [...QUESTIONS];
      } else {
        qs = ladderSort(QUESTIONS);
      }
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setAnswers({});
      setSkipped([]);
      setFlagged(new Set());
      setTimer(getTimerDuration(qs[0]));
      setTimerActive(false);
      setTotalElapsed(0);
      setShowingSkipped(false);
      setScreen("quiz");
    },
    [mode]
  );

  const startRetry = useCallback((questionSubset) => {
    const qs = ladderSort(questionSubset);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers({});
    setSkipped([]);
    setFlagged(new Set());
    setTimer(getTimerDuration(qs[0]));
    setTimerActive(false);
    setTotalElapsed(0);
    setShowingSkipped(false);
    setScreen("quiz");
  }, []);

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
            if (q) {
              setAnswers((prev) => ({
                ...prev,
                [q.id]: {
                  selected: selectedOption,
                  confidence: confidence || "timeout",
                  correct: selectedOption === q.correctIndex,
                  timedOut: true,
                },
              }));
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
      else if (key === "enter" && selectedOption !== null && confidence) {
        handleSubmit();
      }
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

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(getTimerDuration(nextQ));
      setTimerActive(false);
    } else if (skipped.length > 0 && !showingSkipped) {
      const skippedQs = skipped.map((id) => QUESTIONS.find((q) => q.id === id));
      setQuestions(skippedQs);
      setCurrentIndex(0);
      setSkipped([]);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(getTimerDuration(skippedQs[0]));
      setTimerActive(false);
      setShowingSkipped(true);
    } else {
      clearInterval(elapsedRef.current);
      const correctCount = Object.values(answers).filter((a) => a.correct).length;
      const totalAnswered = Object.keys(answers).length;
      completeQuiz({ correct: correctCount, total: totalAnswered }, totalElapsed);
      setScreen("results");
    }
  }, [currentIndex, questions, skipped, showingSkipped, answers, completeQuiz, totalElapsed]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIndex];
    const newSkipped = [...skipped, q.id];
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      setSkipped(newSkipped);
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(getTimerDuration(nextQ));
      setTimerActive(false);
    } else {
      const skippedQs = newSkipped.map((id) => QUESTIONS.find((qq) => qq.id === id));
      if (skippedQs.length === 0) return;
      setQuestions(skippedQs);
      setCurrentIndex(0);
      setSkipped([]);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(getTimerDuration(skippedQs[0]));
      setTimerActive(false);
      setShowingSkipped(true);
    }
  }, [currentIndex, questions, skipped]);

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

  // ---------- LANDING ----------
  if (screen === "landing") {
    const tierCounts = DIFFICULTY_TIERS.map((t) => ({
      tier: t,
      count: QUESTIONS.filter((q) => q.difficulty === t).length,
    }));
    const totalSeconds = QUESTIONS.reduce((s, q) => s + getTimerDuration(q), 0);
    const totalMin = Math.round(totalSeconds / 60);

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 px-3 py-1 rounded-full text-sm mb-4">
              <Layers size={14} />
              SDE2/Senior · Ladder Quiz
            </div>
            <h1 className="text-4xl font-bold mb-2">Delivery Framework</h1>
            <p className="text-gray-400 text-lg mb-1">System Design Interview · The Recommended Structure</p>
            <p className="text-gray-500 text-sm">
              Requirements → Entities → API → Data Flow → HLD → Deep Dives. Why structure beats speed, and how to use it.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {QUESTIONS.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> ~{totalMin} min
            </span>
          </div>

          {/* Difficulty ladder */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={13} /> Difficulty Ladder
            </h3>
            <div className="flex flex-wrap gap-2">
              {tierCounts.map(({ tier, count }) => {
                const ds = DIFFICULTY_STYLES[tier];
                if (count === 0) return null;
                return (
                  <span key={tier} className={`text-xs px-2.5 py-1 rounded-md border ${ds.color}`}>
                    {ds.label} <span className="opacity-60 ml-1">({count}q · {TIMER_BY_TIER[tier]}s)</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Part coverage */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-8">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Coverage by Part
            </h3>
            <div className="space-y-2">
              {PART_COUNTS.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm bg-gray-800/40 rounded px-3 py-2">
                  <span className="text-gray-300 truncate mr-2">{p.name}</span>
                  <span className="text-xs font-mono text-indigo-300 whitespace-nowrap">{p.count}q</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setMode("shuffled"); startQuiz("shuffled"); }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <Shuffle size={18} /> Shuffled
            </button>
            <button
              onClick={() => { setMode("ordered"); startQuiz("ordered"); }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <List size={18} /> Section Order
            </button>
            <button
              onClick={() => { setMode("ladder"); startQuiz("ladder"); }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-semibold"
            >
              <Layers size={18} /> Ladder (Recommended)
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Ladder mode walks each Part L1 → L5 — easiest first, hardest last. Builds confidence before the senior-level questions.
          </p>
        </div>
      </div>
    );
  }

  // ---------- QUIZ ----------
  if (screen === "quiz") {
    const q = questions[currentIndex];
    if (!q) return null;
    const timerColor =
      timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-green-400";
    const timerBg =
      timer <= 15 ? "bg-red-500" : timer <= 30 ? "bg-amber-500" : "bg-green-500";
    const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;
    const labels = ["A", "B", "C", "D"];
    const confidenceLevels = [
      { key: "guessing", label: "Guessing", color: "border-red-500 bg-red-500/10 text-red-300" },
      { key: "somewhat", label: "Somewhat Sure", color: "border-amber-500 bg-amber-500/10 text-amber-300" },
      { key: "confident", label: "Very Confident", color: "border-green-500 bg-green-500/10 text-green-300" },
    ];
    const ds = DIFFICULTY_STYLES[q.difficulty] || null;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              {showingSkipped && <span className="text-amber-400 mr-2">[Skipped]</span>}
              Q{currentIndex + 1} / {questions.length}
              <span className="text-gray-600 ml-2">({totalAnswered}/{QUESTIONS.length} total)</span>
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg ${timerColor}`}>
              <Clock size={18} />
              {formatTime(timer)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer bar */}
          <div className="w-full bg-gray-800 rounded-full h-1 mb-6">
            <div
              className={`${timerBg} h-1 rounded-full transition-all duration-1000`}
              style={{ width: `${(timer / currentTimerMax) * 100}%` }}
            />
          </div>

          {/* Tags: Part, Difficulty, Style */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 rounded">
              {q.part}
            </span>
            {ds && (
              <span className={`text-xs px-2 py-1 rounded border ${ds.color}`}>
                {ds.label}
              </span>
            )}
            <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 text-gray-400 rounded">
              {q.style}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-800/60 border border-gray-700/60 text-gray-500 rounded">
              {q.subtopic}
            </span>
            {q.l5Pattern && (
              <span className="text-xs px-2 py-1 bg-red-900/30 border border-red-700/40 text-red-300 rounded font-mono">
                L5 · {q.l5Pattern}
              </span>
            )}
          </div>

          {/* Question */}
          <h2 className="text-lg font-medium leading-relaxed mb-6">{q.question}</h2>

          {/* Options */}
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

          {/* Confidence */}
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

          {/* Action buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2">
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

          {/* Explanation */}
          {submitted && (
            <div className="mt-8 space-y-4">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm">
                  <BookOpen size={16} /> Explanation
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
              </div>
              {q.interviewScript && (
                <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/40 p-5">
                  <div className="flex items-center gap-2 mb-3 text-indigo-300 font-semibold text-sm">
                    <MessageSquare size={16} /> Interview Script
                  </div>
                  <p className="text-sm text-indigo-200/80 leading-relaxed italic">
                    {q.interviewScript}
                  </p>
                </div>
              )}
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

  // ---------- RESULTS ----------
  if (screen === "results") {
    const score = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const grade =
      score >= 90
        ? { label: "Staff-ready — you'd ace this topic", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" }
        : score >= 75
        ? { label: "Strong Senior — solid, minor gaps to close", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" }
        : score >= 60
        ? { label: "SDE2-level — review the weak areas below", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" }
        : { label: "Needs deep review — revisit the fundamentals", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" };

    const partStats = {};
    QUESTIONS.forEach((q) => {
      if (!partStats[q.part]) partStats[q.part] = { total: 0, correct: 0 };
      partStats[q.part].total++;
      if (answers[q.id]?.correct) partStats[q.part].correct++;
    });

    const tierStats = DIFFICULTY_TIERS.map((tier) => {
      const qs = QUESTIONS.filter((q) => q.difficulty === tier);
      const correct = qs.filter((q) => answers[q.id]?.correct).length;
      const total = qs.length;
      return { tier, total, correct, pct: total ? Math.round((correct / total) * 100) : 0 };
    }).filter((t) => t.total > 0);

    const luckyGuesses = QUESTIONS.filter(
      (q) => answers[q.id]?.correct && answers[q.id]?.confidence === "guessing"
    );
    const overconfidentMisses = QUESTIONS.filter(
      (q) => answers[q.id] && !answers[q.id]?.correct && answers[q.id]?.confidence === "confident"
    );
    const incorrect = QUESTIONS.filter((q) => answers[q.id] && !answers[q.id]?.correct);
    const flaggedQs = QUESTIONS.filter((q) => flagged.has(q.id));

    const hardTierMisses = QUESTIONS.filter(
      (q) => (q.difficulty === "L4" || q.difficulty === "L5") && answers[q.id] && !answers[q.id]?.correct
    );

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 pt-4">
            <div className="text-6xl font-bold mb-2">{score}%</div>
            <div className="text-lg text-gray-400 mb-3">
              {totalCorrect} / {totalAnswered} correct
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${grade.bg} ${grade.color}`}>
              <Award size={18} /> {grade.label}
            </div>
            <div className="text-sm text-gray-500 mt-3">
              Total time: {formatTime(totalElapsed)}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers size={18} /> Accuracy by Tier
            </h3>
            <div className="space-y-3">
              {tierStats.map(({ tier, total, correct, pct }) => {
                const ds = DIFFICULTY_STYLES[tier];
                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={`px-2 py-0.5 rounded border ${ds.color} text-xs`}>{ds.label}</span>
                      <span className={pct >= 70 ? "text-green-400" : "text-red-400"}>
                        {correct}/{total} ({pct}%)
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
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} /> Coverage by Part
            </h3>
            <div className="space-y-3">
              {Object.entries(partStats).map(([name, s]) => {
                const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={name}>
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
                    <div key={q.id} className="text-sm text-gray-400 py-1 border-b border-gray-800 last:border-0">
                      <span className="text-amber-500">{q.id}</span> — {q.subtopic}: {q.question.slice(0, 80)}...
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
                    <div key={q.id} className="text-sm text-gray-400 py-1 border-b border-gray-800 last:border-0">
                      <span className="text-red-500">{q.id}</span> — {q.subtopic}: {q.question.slice(0, 80)}...
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
                {incorrect.map((q) => {
                  const ds = DIFFICULTY_STYLES[q.difficulty];
                  return (
                    <div key={q.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 rounded">
                          {q.part}
                        </span>
                        {ds && (
                          <span className={`text-xs px-2 py-0.5 rounded border ${ds.color}`}>
                            {ds.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                      <p className="text-sm text-red-400 mb-1">
                        Your answer:{" "}
                        {answers[q.id]?.selected !== null && answers[q.id]?.selected !== undefined
                          ? ["A", "B", "C", "D"][answers[q.id].selected]
                          : "Timed out"}
                      </p>
                      <p className="text-sm text-green-400 mb-2">
                        Correct: {["A", "B", "C", "D"][q.correctIndex]} —{" "}
                        {q.options[q.correctIndex].slice(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">{q.explanation}</p>
                    </div>
                  );
                })}
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
            {hardTierMisses.length > 0 && (
              <button
                onClick={() => startRetry(hardTierMisses)}
                className="flex items-center gap-2 px-5 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 rounded-lg text-red-300 transition-colors"
              >
                <TrendingUp size={16} /> Retake L4-L5 Misses ({hardTierMisses.length})
              </button>
            )}
            {incorrect.length > 0 && (
              <button
                onClick={() => startRetry(incorrect)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg text-amber-300 transition-colors"
              >
                <RotateCcw size={16} /> Retry All Missed ({incorrect.length})
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
