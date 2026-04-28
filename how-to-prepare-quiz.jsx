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
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Active Practice vs Passive Consumption",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["A5"],
    l5Pattern: null,
    question:
      "Two engineers prepare for a system design interview. Engineer X watches 4 hours of mock-interview videos every weekday for two weeks, taking detailed notes. Engineer Y picks one design question per day, attempts it on a whiteboard alone for 45 minutes, then compares their attempt to a written answer key — also for two weeks. Which engineer is more likely to recall and apply system design concepts under interview pressure, and why?",
    options: [
      "Engineer X — the volume of expert content viewed is higher, so more concepts have been encoded. The note-taking provides a written record they can review the morning of the interview.",
      "Engineer Y — generating an answer (even imperfectly) before checking it forces the brain to commit to a structure, surface gaps, and integrate the correction. Watching expert reasoning is like watching someone exercise; doing the design yourself is the actual workout.",
      "The two are roughly equivalent — the brain learns from any deliberate exposure to the material, regardless of whether it's input-heavy (X) or output-heavy (Y).",
      "Engineer X — videos provide visual + audio multimodal encoding, which is far stronger than the single-channel encoding produced by drawing on a whiteboard.",
    ],
    correctIndex: 1,
    explanation:
      "Active production (attempting the design from a blank page) creates retrieval-strength encoding that watching cannot match. When the brain has to structure an answer with no scaffolding, every gap it surfaces becomes a hook for the corrected information. Engineer X is doing recognition, which feels productive but rarely transfers to performance under pressure. Note-taking from videos is one of the explicitly weakest study modalities — re-reading notes is passive review, not retrieval.",
    interviewScript: null,
    proTip:
      "If you have limited time, spend it producing answers, not consuming them. One question attempted alone teaches more than three watched.",
  },
  {
    id: "q2",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Foundation Stage",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["A1", "A2", "A4"],
    l5Pattern: null,
    question:
      "A candidate skips reading any introductory system-design material and goes straight to attempting full design questions on day one. After three attempts, they report they 'didn't know what the interviewer was asking about' — terms like load balancer, cache, write-through were thrown around with no anchoring concept. What did the candidate skip that would have prevented this, and what specifically does that step buy you?",
    options: [
      "They skipped the practice loop entirely — they should re-attempt the same three questions until each becomes muscle memory.",
      "They skipped foundational reading on the basics. The role of foundation reading is not to learn the material deeply; it is to build a mental skeleton — a vocabulary and rough mental map — so that when concepts appear during practice, they have somewhere to attach. Without the skeleton, every term feels like a new word in a foreign language.",
      "They skipped choosing a delivery framework, so without a structure their attempts felt chaotic.",
      "They skipped the mock interview step. Mock interviews are where the basics get learned through exposure to a real interviewer.",
    ],
    correctIndex: 1,
    explanation:
      "The prep model is two-stage: build foundation, then practice. The foundation isn't about depth — it's about giving you a place to *attach* new information when you encounter it during practice. Skipping it means every term you encounter is unmoored. Re-attempting the same questions (A) just reinforces a foundation-less approach. Framework choice (C) helps with sequencing but not vocabulary. Mock interviews (D) come at the end of the practice loop, not as a substitute for the foundation step.",
    interviewScript: null,
    proTip:
      "Skim the foundation high-level — don't try to memorize. The point is to build hooks for later, not to know the material yet.",
  },
  {
    id: "q3",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Why a Delivery Framework",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["A3"],
    l5Pattern: null,
    question:
      "An interviewer asks the same question to two candidates in 45-minute interviews. Candidate A keeps a written sequence on the side of the whiteboard ('Reqs → Entities → API → HLD → Deep Dives') and visibly checks where they are every few minutes. Candidate B works 'intuitively' and lets the design unfold organically based on what feels interesting. At minute 30, Candidate A is in deep dives; Candidate B is still iterating on the data model. Which candidate's behavior reflects the case for using a delivery framework, and what does the framework specifically prevent?",
    options: [
      "Candidate B — organic exploration produces better designs because it follows the natural shape of the problem. Frameworks impose artificial structure that wastes time.",
      "Candidate A — the framework provides a linear roadmap that prevents scope creep. Without it, an interesting sub-problem can absorb 25 minutes that should have been distributed across requirements, design, and deep dives. The framework isn't about making the design 'better' — it's about ensuring you finish.",
      "Candidate A — the framework makes the design more impressive because it shows you've read books about system design.",
      "Both reflect the case for a framework equally — A uses an explicit framework, B uses an implicit one.",
    ],
    correctIndex: 1,
    explanation:
      "Failure to deliver a working system is the #1 failure mode for mid-level candidates, and a framework prevents this by forcing linear progression. The data model is exactly the kind of detail that can absorb a candidate's full attention if there's no roadmap to nudge them forward. The framework doesn't make the design more elegant — it makes sure the candidate reaches deep dives. (A) inverts the actual point. (D) is wrong because 'implicit structure' usually means no structure when nervous — the value of an explicit framework is that you can fall back to it under stress.",
    interviewScript:
      "In your interview, write your framework steps on the corner of the whiteboard. Glance at them every few minutes — it acts as a nudge back when you start drifting into a sub-problem.",
    proTip: null,
  },
  {
    id: "q4",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Practice Loop Ordering",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: ["A6", "A7"],
    l5Pattern: null,
    question:
      "A candidate reports their prep cycle: 'I pick a question, immediately read the answer key carefully (15 minutes), then I attempt the design myself for 30 minutes, then I re-read the answer key to compare.' After two weeks they feel they're 'learning the material' but they bomb their first mock interview. What is the specific cognitive failure their cycle creates, and what is the corrected ordering?",
    options: [
      "They read the answer key too quickly. They should spend 30 minutes reading the answer key and only 15 minutes attempting the design.",
      "Reading the answer key BEFORE attempting eliminates the productive struggle. When they 'attempt' the design after reading, they are pattern-matching against the answer they just memorized — which feels like understanding but is actually recognition. The corrected ordering is: attempt FIRST (struggle through it), THEN read the answer key. The struggle is what creates the gaps the answer key needs to fill.",
      "The candidate isn't doing enough mock interviews. The cycle is fine; mocks would have caught any gaps.",
      "They should skip the re-read step entirely. Reading the answer key once is sufficient.",
    ],
    correctIndex: 1,
    explanation:
      "The practice loop is: try to answer on your own → only then read the answer key. The order matters because reading the answer first turns the 'attempt' into a recall exercise — and recall feels easier than generation, even when it isn't. The candidate is mistaking 'I can follow this answer' for 'I could have produced this answer.' Mock interviews expose the gap, but the cycle itself was already broken. Self-evaluating against an answer you've just read is one of the most common ways to feel productive while learning very little.",
    interviewScript: null,
    proTip:
      "Force yourself to write down a complete (even bad) answer before opening the answer key. Even a 30%-correct attempt creates the encoding that lets the answer key actually teach you something.",
  },
  {
    id: "q5",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Foundation: Framework Selection",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: ["A2"],
    l5Pattern: null,
    question:
      "A candidate has spent a week reading five different 'delivery framework' articles, taking notes on each, and is now drafting a comparison table to 'pick the best framework before starting practice.' They have not yet attempted a single design question. What is the most accurate description of what's happening here, and what should the candidate do?",
    options: [
      "This is good preparation — picking the right framework is high-leverage, and an extra week comparing options will pay off in every future practice attempt.",
      "The candidate is in framework-procrastination — comparing frameworks feels productive but is a sophisticated form of avoiding the harder work of practice. Any reasonable framework gets you ~95% of the value of the 'best' one. Pick one, commit to it for at least 5 practice attempts, then evaluate. Framework selection is not the bottleneck; practice volume is.",
      "The candidate should stop reading frameworks and design their own custom framework based on the strengths of each.",
      "The candidate should switch focus from framework selection to memorizing answer keys, which is more directly relevant to interview performance.",
    ],
    correctIndex: 1,
    explanation:
      "The foundation step says to choose a framework and start with the basics — not to optimize over framework choices. Any framework that imposes linear progression captures most of the value; the marginal gain from picking the 'optimal' one is small relative to the cost of delaying practice. Framework-shopping is a known anti-pattern in skill acquisition: it provides the *feeling* of preparation without the *substance*. (D) is also wrong — memorizing answer keys without producing your own attempts first is the broken cycle from the previous question.",
    interviewScript: null,
    proTip:
      "The first 10 hours of practice with a mediocre framework beats the first 10 hours of comparing frameworks with no practice. Optimization without data is just procrastination.",
  },
  {
    id: "q6",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Mock Interviews vs Self-Evaluation",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["A6", "A8"],
    l5Pattern: null,
    question:
      "A candidate tells their mentor: 'I've completed 10 practice questions following the loop and I feel ready. I'm skipping the mock-interview step because mocks cost money and I can self-evaluate from the answer keys.' Their mentor pushes back. What specific signal does a mock interview produce that comparing your written answer to a written answer key cannot, and why does that signal matter?",
    options: [
      "Mock interviews force you to type faster, which matches the speed required during a real interview.",
      "The mock interview tests four things the answer-key comparison cannot: real-time interviewer pushback (you can't argue with a written answer key), ability to think and talk simultaneously, recovery when the interviewer goes off-script, and calibration of how clear your verbalization actually sounds to a third party. Self-evaluation systematically over-credits your written answers because you are both the producer and the grader. Mocks are how that bias gets corrected.",
      "Mock interviews give you the chance to practice the introduction and behavioral parts of the interview, which the technical answer keys don't cover.",
      "The mentor is overcautious — 10 practice questions with self-evaluation is sufficient prep, and skipping mocks saves money for the real interview prep.",
    ],
    correctIndex: 1,
    explanation:
      "The practice section ends with 'schedule a mock interview' precisely because the practice loop is incomplete without external evaluation. The four signals listed (pushback, parallel processing, recovery, calibration) are the *interactive* dimensions of the interview that cannot be tested in solo practice. The self-evaluation bias is real and well-documented: producers grade their own work generously. (A) misses the point — typing speed isn't the issue. (C) is incidental. (D) trivializes the mentor's concern.",
    interviewScript:
      "In a real interview, expect interviewer pushback even on correct answers — they're checking whether your reasoning is held with confidence or memorized. Mocks are where you practice the muscle of staying calm and re-stating your reasoning under that pressure.",
    proTip:
      "Schedule your first mock 1/3 of the way through your prep, not at the end. Early mocks expose what to focus on; end-of-prep mocks just measure where you ended up.",
  },
  {
    id: "q7",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Recognition vs Production",
    difficulty: "L5",
    style: "Failure Analysis",
    conceptIds: ["A1", "A4", "A5"],
    l5Pattern: "framing-is-wrong",
    question:
      "A candidate has spent 80 hours reading every Hello Interview article 3 times each, takes meticulous notes, and can summarize each article from memory. They schedule their first mock interview and bomb it — they freeze when asked to design Twitter, can name the components but cannot organize them, and run out of time at minute 25 stuck on the data model. What specific cognitive failure has their preparation approach optimized for, and why does the mock-interview format defeat it?",
    options: [
      "The candidate didn't read enough articles. 80 hours is below the ~200 hours typically needed for SDE2-level prep — more reading would have closed the gap.",
      "The candidate optimized for RECOGNITION (can recognize concepts when shown them in articles) rather than PRODUCTION (can generate a design from a blank page under time pressure). Recognition is what reading rewards; production is what the interview tests. The interview format defeats recognition because there is no article to recognize against — the candidate must generate structure from nothing, and the recognition skill is largely useless for that. The fix is not more reading; it is shifting to active practice immediately.",
      "The candidate is anxious — the bomb was a one-off and another mock will go better without changing their prep approach.",
      "The candidate didn't memorize specific component names well enough. They need to memorize a checklist of components (load balancer, cache, queue, etc.) and recite it at the start of every design.",
    ],
    correctIndex: 1,
    explanation:
      "L5 framing-is-wrong: the obvious answers (read more, memorize more) are technically about prep but solve the wrong problem. The deeper insight the interviewer listens for is that learning system design happens during *production*, not during *consumption*. The two-stage prep model puts foundation reading first only to ENABLE practice — not as a goal in itself. Why most candidates pick A or D: A feels conservative ('more is more'); D feels concrete ('I'll just memorize the list'). Both let the candidate keep doing what feels productive — which is exactly the trap. The senior+ move is recognizing that the prep modality itself is misaligned with what the interview tests, and switching to the harder, less-comfortable production work.",
    interviewScript: null,
    proTip:
      "Treat reading as scaffolding for practice, never as a substitute for it. If you've spent 5x more hours reading than producing answers, you're optimizing for the wrong skill.",
  },
  {
    id: "q8",
    part: "A — Prep Foundation & Practice Loop",
    subtopic: "Compressing the Prep Loop",
    difficulty: "L5",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["A1", "A6"],
    l5Pattern: "trade-off-inversion",
    question:
      "A candidate has 3 weeks until their FAANG system-design interview and has done zero prep. The standard advice (foundation, then practice loop, then mocks) implicitly assumes a multi-month timeline. What is the highest-EV adaptation of the standard prep approach for this constrained timeline, and what does that adaptation reveal about which step in the standard loop is *most* load-bearing?",
    options: [
      "Compress the timeline by reading the foundation material at 3x speed and doing twice as many practice questions per day. The standard model is correct; the candidate just needs to execute it faster.",
      "Skip the foundation entirely and spend all 3 weeks doing back-to-back mock interviews. Mocks are the most realistic signal, so maximizing them maximizes prep value.",
      "Shrink — don't skip — the foundation. Spend 1-2 days skimming the basics for vocabulary only (build the mental skeleton, no depth). Then spend the remaining ~19 days on the practice loop with frequent mocks (e.g., one mock per 4-5 self-attempts). This adaptation reveals that the PRACTICE LOOP is the most load-bearing step — the foundation exists to enable practice, so it's compressible. Mocks are non-skippable because they're the only step that produces calibrated external signal. The foundation's role is hooks, not depth, so 1-2 days suffices.",
      "Cancel the interview and reschedule for 3 months out. 3 weeks is structurally insufficient and any prep approach will fail.",
    ],
    correctIndex: 2,
    explanation:
      "L5 trade-off-inversion: flipping the time-budget constraint forces you to identify which steps are *load-bearing* and which are compressible. Foundation reading is high-value-per-hour for the first 1-2 days (building vocabulary) and rapidly diminishing thereafter — it's compressible. Practice is load-bearing — there is no substitute. Mocks are load-bearing — they're the only external-calibration step. Why most candidates pick A or B: A is the conservative answer ('just do everything faster'); B is the heroic answer ('just do the hardest thing'). Both miss that the steps have different *functions*, not just different difficulties. The senior+ insight the interviewer listens for is the ability to articulate what each step actually buys you — which most candidates can't do until forced by a constraint.",
    interviewScript: null,
    proTip:
      "When you're time-constrained, audit each step in any standard advice for 'is this compressible or load-bearing?' The compressible steps shrink first; the load-bearing ones get *more* attention, not less.",
  },
];

const PARTS_ORDER = [
  "A — Prep Foundation & Practice Loop",
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

export default function HowToPrepareQuiz({ quizSlug = 'in-a-hurry-how-to-prepare' }) {
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
        // ladder mode (default)
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
      setTimerActive(true);
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
    setTimerActive(true);
    setTotalElapsed(0);
    setShowingSkipped(false);
    setScreen("quiz");
  }, []);

  useEffect(() => {
    if (timerActive && screen === "quiz" && !submitted) {
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
          return t - 1;
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
      setTimerActive(true);
    } else if (skipped.length > 0 && !showingSkipped) {
      const skippedQs = skipped.map((id) => QUESTIONS.find((q) => q.id === id));
      setQuestions(skippedQs);
      setCurrentIndex(0);
      setSkipped([]);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(getTimerDuration(skippedQs[0]));
      setTimerActive(true);
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
      setTimerActive(true);
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
      setTimerActive(true);
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
            <h1 className="text-4xl font-bold mb-2">How to Prepare</h1>
            <p className="text-gray-400 text-lg mb-1">System Design Interview Prep — Meta</p>
            <p className="text-gray-500 text-sm">
              Foundation vs practice, the prep loop, framework selection, and the recognition-vs-production gap.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {QUESTIONS.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> ~{totalMin} min
            </span>
            <span className="flex items-center gap-1">
              <Timer size={14} /> Per-tier timer
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

    // Per-Part stats
    const partStats = {};
    QUESTIONS.forEach((q) => {
      if (!partStats[q.part]) partStats[q.part] = { total: 0, correct: 0 };
      partStats[q.part].total++;
      if (answers[q.id]?.correct) partStats[q.part].correct++;
    });

    // Per-Tier stats
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

    // Hardest-tier focus: if user has misses in L4/L5, surface a "Retake L4-L5" button
    const hardTierMisses = QUESTIONS.filter(
      (q) => (q.difficulty === "L4" || q.difficulty === "L5") && answers[q.id] && !answers[q.id]?.correct
    );

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score header */}
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

          {/* Accuracy by Tier */}
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

          {/* Per-Part breakdown */}
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

          {/* Confidence analysis */}
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

          {/* Incorrect questions */}
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

          {/* Flagged questions */}
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

          {/* Action buttons */}
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
