// === COVERAGE MANIFEST ===
// Source: https://www.hellointerview.com/learn/system-design/in-a-hurry/patterns
// Total questions: 55 across 10 parts (A-J)
//
// PART A — Why Patterns Matter (5 questions, ladder L1-L5)
//   A1 (senior-vs-junior signal):                       qA1 (L1), qA4 (L4), qA5 (L5)
//   A2 (best-practice fall-back / save time):           qA2 (L2), qA5 (L5)
//   A3 (anticipate failure modes):                      qA3 (L3), qA4 (L4), qA5 (L5)
//   A4 (built FROM key tech + core concepts):           qA2 (L2)
//   Ladder: L1[qA1] L2[qA2] L3[qA3] L4[qA4] L5[qA5]
//
// PART B — Pushing Realtime Updates (6 questions, ladder L1-L5 + 1 alt)
//   B1 (when realtime is needed vs sync):               qB1 (L1)
//   B2 (two-axis decision: protocol + propagation):     qB2 (L2)
//   B3 (protocol ladder polling/SSE/WS):                qB3 (L3), qB3a (L3)
//   B4 (start with polling default):                    qB3 (L3)
//   B5 (Pub/Sub for stateless fan-out, WhatsApp):       qB4 (L4)
//   B6 (consistent hash for stateful, Google Docs):     qB4 (L4)
//   B7 (realtime infra is operationally tricky):        qB3a (L3), qB5 (L5)
//   Ladder: L1[qB1] L2[qB2] L3[qB3,qB3a] L4[qB4] L5[qB5]
//
// PART C — Managing Long-Running Tasks (6 questions, ladder + 1 alt)
//   C1 (trigger: ops > few seconds):                    qC1 (L1)
//   C2 (shape: ack + background):                       qC1 (L1), qC2 (L2)
//   C3 (mechanism: validate → enqueue → job ID):        qC2 (L2)
//   C4 (workers pull and execute):                      qC2 (L2)
//   C5 (independent scaling benefit):                   qC3a (L3)
//   C6 (anti-pattern: queue-everything):                qC3 (L3), qC5 (L5)
//   C7 (when sync wins for short jobs):                 qC3 (L3), qC5 (L5)
//   C8 (DLQ / retries / poison messages):               qC4 (L4)
//   C9 (key tech: queue + worker pool):                 qC1 (L1), qC2 (L2)
//   Ladder: L1[qC1] L2[qC2] L3[qC3,qC3a] L4[qC4] L5[qC5]
//
// PART D — Dealing with Contention (6 questions, ladder + 1 alt)
//   D1 (race conditions in shared resources):           qD1 (L1)
//   D2 (goal: prevent races, ensure consistency):       qD1 (L1)
//   D3 (pessimistic vs OCC vs distributed coord):       qD2 (L2)
//   D4 (atomicity vs explicit locking axis):            qD2 (L2), qD3 (L3)
//   D5 (perf vs consistency, simple vs distributed):    qD3 (L3)
//   D6 (start single-DB, scale only when forced):       qD4 (L4), qD3a (L3)
//   D7 (DBs already solve contention; splitting re-creates problems): qD5 (L5)
//   D8 (premature data-splitting is a failure mode):    qD4 (L4), qD5 (L5)
//   D9 (interviewer probes "what did you give up"):     qD3a (L3), qD5 (L5)
//   Ladder: L1[qD1] L2[qD2] L3[qD3,qD3a] L4[qD4] L5[qD5]
//
// PART E — Scaling Reads (6 questions, ladder + 1 alt)
//   E1 (reads bottleneck first):                        qE1 (L1)
//   E2 (read traffic grows faster than writes):         qE1 (L1), qE2 (L2)
//   E3 (10:1 → 100:1+ read:write ratio):                qE2 (L2)
//   E4 (Instagram example):                             qE2 (L2)
//   E5 (in-DB → replicas → cache progression):          qE3 (L3), qE3a (L3)
//   E6 (cache invalidation, replica lag, hot keys):     qE4 (L4), qE5 (L5)
//   E7 (escalation order matters; don't skip ahead):    qE3 (L3), qE3a (L3)
//   Ladder: L1[qE1] L2[qE2] L3[qE3,qE3a] L4[qE4] L5[qE5]
//
// PART F — Scaling Writes (5 questions, ladder L1-L5)
//   F1 (single DB hits hard limits):                    qF1 (L1)
//   F2 (three strategies):                              qF1 (L1), qF2 (L2)
//   F3 (horizontal vs vertical partitioning):           qF2 (L2)
//   F4 (vertical = different types of data):            qF2 (L2)
//   F5 (partition-key trade-off):                       qF3 (L3), qF5 (L5)
//   F6 (write queues for spikes):                       qF4 (L4)
//   F7 (load shedding for sustained surge):             qF4 (L4)
//   F8 (batching reduces per-op overhead):              qF5 (L5)
//   Ladder: L1[qF1] L2[qF2] L3[qF3] L4[qF4] L5[qF5]
//
// PART G — Handling Large Blobs (6 questions, ladder + 1 alt)
//   G1 (scope: large files):                            qG1 (L1)
//   G2 (anti-pattern: bytes through app servers):       qG1 (L1)
//   G3 (pattern: presigned URLs + CDN):                 qG2 (L2), qG3 (L3)
//   G4 (upload mechanism: scoped credentials):          qG2 (L2)
//   G5 (download via CDN with signed URLs):             qG3 (L3)
//   G6 (resumable, progress, global come free):         qG3 (L3), qG3a (L3)
//   G7 (state-sync challenge DB ↔ blob):                qG4 (L4), qG5 (L5)
//   G8 (lifecycle management):                          qG5 (L5)
//   G9 (storage events for sync):                       qG4 (L4)
//   Ladder: L1[qG1] L2[qG2] L3[qG3,qG3a] L4[qG4] L5[qG5]
//
// PART H — Multi-Step Processes (5 questions, ladder L1-L5)
//   H1 (cross-service long-running, must survive failures):  qH1 (L1)
//   H2 (examples: orders, onboarding, payments):        qH1 (L1)
//   H3 (spectrum: single-server → workflow engines):    qH3 (L3)
//   H4 (event-sourcing choreography):                   qH2 (L2), qH5 (L5)
//   H5 (workflow engines orchestration):                qH2 (L2), qH4 (L4)
//   H6 (declarative > scattered manual error handling): qH4 (L4)
//   H7 (exactly-once + audit trail guarantees):         qH4 (L4)
//   Ladder: L1[qH1] L2[qH2] L3[qH3] L4[qH4] L5[qH5]
//
// PART I — Proximity-Based Services (5 questions, ladder L1-L5)
//   I1 (search by location):                            qI1 (L1)
//   I2 (geospatial indexes are the mechanism):          qI1 (L1)
//   I3 (impl options: PostGIS, Redis, Elasticsearch):   qI5 (L5)
//   I4 (region division architecture):                  qI2 (L2)
//   I5 (worth-it threshold: 100k–1M items):             qI3 (L3)
//   I6 (small-N → scan beats index):                    qI3 (L3)
//   I7 (proximity is local-not-global):                 qI4 (L4)
//   Ladder: L1[qI1] L2[qI2] L3[qI3] L4[qI4] L5[qI5]
//
// PART J — Pattern Selection / Composition (5 questions, ladder L1-L5)
//   J1 (patterns NOT mutually exclusive):               qJ1 (L1)
//   J2 (video platform composition example):            qJ1 (L1)
//   J3 (skill = recognize + understand trade-offs):     qJ2 (L2), qJ4 (L4)
//   J4 (default: start simple, add complexity on demand): qJ3 (L3), qJ5 (L5)
//   J5 (proactive identification = senior signal):      qJ2 (L2), qJ4 (L4), qJ5 (L5)
//   Ladder: L1[qJ1] L2[qJ2] L3[qJ3] L4[qJ4] L5[qJ5]
//
// CROSS-PART BRIDGES (4):
//   qC5 (C × J)   — async-everything anti-pattern bridges sync/async to "start simple"
//   qD5 (D × F)   — sharding to scale writes re-creates contention
//   qG4 (G × H)   — blob metadata sync via storage events = mini multi-step process
//   qJ1 (J × G+C+B+H) — video platform composes 4 patterns
//
// L5 PATTERN COVERAGE (all 7 of 7):
//   - framing-is-wrong:                qA5, qC5, qJ5
//   - two-levels-of-indirection:       qB5
//   - adversarial-pushback:            qD5
//   - trade-off-inversion:             qF5
//   - implementation-specific-gotcha:  qH5, qI5
//   - estimation-backed-scenario:      qE5
//   - future-proofing:                 qG5
// ============================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "qA1",
    "part": "A — Why Patterns Matter",
    "subtopic": "Pattern Recognition as a Skill",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "A1"
    ],
    "l5Pattern": null,
    "question": "Two engineers look at the same brief — 'design a chat app like WhatsApp.' Engineer X immediately starts naming components: 'we'll need WebSockets, a pub/sub, sharded DB.' Engineer Y says: 'before listing components, the two interesting decisions are how clients hold connections and how a sender's message reaches the receiver's connection — those decisions have known failure modes I want to talk through.' What capability is Y demonstrating that X is not?",
    "options": [
      "Y has memorized more vocabulary than X.",
      "Y is recognizing the situation as one with a known shape — a pattern — and is using that recognition to anticipate where the design's interesting decisions and known failure modes live, rather than reverse-engineering them mid-design.",
      "Y is being overly cautious; X's instinct to enumerate components is the faster and equally valid approach for a 45-minute interview.",
      "Y's response is identical to X's in substance — Y has just rephrased it as a process rather than a list."
    ],
    "correctIndex": 1,
    "explanation": "Pattern recognition is a senior-vs-junior signal precisely because it lets the engineer pre-load the *interesting decision points* and *known failure modes* of a problem. X is doing component recall; Y is doing pattern recognition. In a 45-minute interview, the time savings of skipping reverse-engineering and going straight to the trade-offs is the difference between finishing a solid design and running out of clock.",
    "interviewScript": "In your interview, say: 'Before I list components, this looks like a realtime-updates problem. There are two decisions to make: client↔server protocol and how updates propagate across servers to the right connection. Each has known trade-offs — let me walk through them and pick.'",
    "proTip": "When a problem matches a pattern you know, *say so out loud* and then enumerate the interesting decisions the pattern surfaces. This explicit framing is a strong senior signal."
  },
  {
    "id": "qA2",
    "part": "A — Why Patterns Matter",
    "subtopic": "Pattern Recognition as a Skill",
    "difficulty": "L2",
    "style": "Scenario-Based",
    "conceptIds": [
      "A2",
      "A4"
    ],
    "l5Pattern": null,
    "question": "Mid-interview the interviewer says: 'You've named load balancers, caches, queues, and a sharded DB. But what *pattern* are you applying here?' What is the interviewer probing — and how is a pattern different from the components a candidate has just listed?",
    "options": [
      "The interviewer is testing trivia about pattern names; the right move is to label the design with one of the standard pattern names.",
      "Components are atoms; a pattern is the recurring problem-and-trade-off shape that tells you which atoms to combine, in what order, and what the failure modes will be. Listing components is necessary but not sufficient — patterns carry the trade-off knowledge that the components alone don't.",
      "There is no real difference; 'pattern' is just a more abstract word for 'set of components.'",
      "A pattern always specifies an exact technology choice (e.g., Kafka not Redis); without that specificity, only a list of components is meaningful."
    ],
    "correctIndex": 1,
    "explanation": "Patterns are *built from* key technologies and core concepts, but they aren't the same thing. A pattern is the recurring problem shape and the trade-offs that come with solving it — it tells you which components to combine, in what order, and what the failure modes are. The interviewer's prompt is asking the candidate to step from atoms to recipe.",
    "interviewScript": "In your interview, say: 'Right — these components are the atoms. The pattern I'm applying is [X], which says: when you face [Y problem shape], combine these components this way because [trade-off]. Naming the pattern lets us focus on the interesting decisions instead of re-deriving them.'",
    "proTip": "Patterns sit one layer above components. When asked 'what pattern,' name the recurring problem shape and the trade-off the pattern encodes — not just a different label for the same set of boxes."
  },
  {
    "id": "qA3",
    "part": "A — Why Patterns Matter",
    "subtopic": "Failure-Mode Anticipation",
    "difficulty": "L3",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "A3"
    ],
    "l5Pattern": null,
    "question": "You're 25 minutes into a 45-minute interview when the interviewer asks: 'What happens at launch when your cache is cold and the first 10K users all hit the homepage simultaneously?' Two candidates respond: A starts deriving the failure from first principles; B says 'this is a classic cold-cache stampede — the symptom will be a thundering herd hitting the DB; the standard mitigations are request coalescing on the cache layer plus a small jitter on cache populates.' Why does B's response signal seniority more strongly?",
    "options": [
      "B knows more vocabulary; the underlying reasoning is identical.",
      "B has compressed minutes of derivation into seconds by recognizing the failure as a known instance with known mitigations. In a time-boxed interview, that compression is itself the senior skill — A will run out of clock before discussing the trade-offs that actually matter.",
      "A's first-principles approach is always preferable because pattern matching can lead to wrong answers when the situation is subtly different.",
      "B is incorrect — there is no such thing as a cold-cache stampede; A's derivation will yield a different (and better) answer."
    ],
    "correctIndex": 1,
    "explanation": "Patterns let you skip reverse-engineering common failure modes. A's first-principles approach is fine when truly novel, but at 25 minutes in, the interviewer is testing whether the candidate can *anticipate* failure modes from a recognizable shape. B has compressed minutes of derivation into seconds and bought back interview time for the trade-off discussion the interviewer actually wants. Pattern recognition isn't a substitute for understanding — it's what understanding looks like once it's been compiled.",
    "interviewScript": "In your interview, say: 'I recognize this as a cold-cache stampede — the failure mode is a thundering herd on the DB. Standard mitigations are request coalescing in the cache layer and jitter on cache fills. The trade-off is added cache complexity vs DB protection during launches and partial outages.'",
    "proTip": "When you spot a known failure mode, name it explicitly. Naming it shows you've internalized the pattern; deriving it from first principles every time is what a junior does."
  },
  {
    "id": "qA4",
    "part": "A — Why Patterns Matter",
    "subtopic": "Pattern Application vs Pattern Recall",
    "difficulty": "L4",
    "style": "Interviewer Pushback",
    "conceptIds": [
      "A1",
      "A3"
    ],
    "l5Pattern": null,
    "question": "A candidate says: 'I'd add a queue here for resilience.' The interviewer pushes: 'Those are tools, not a decision — why is *this* the right pattern for the problem in front of us, and what specifically does it cost?' Two candidates respond: X confidently lists three patterns they could use. Y says: 'The job is sub-second and synchronous from the user's view, so a queue costs us clearer back-pressure and a worse UX in exchange for fault isolation we don't need yet.' What weakness is the interviewer exposing in candidate X?",
    "options": [
      "X knows fewer patterns than Y; the fix is more pattern study.",
      "X is showing pattern surface knowledge — knowing pattern names — without pattern application skill, which is the ability to weigh whether a pattern fits the workload at hand and articulate what it costs. Listing patterns is recall; applying patterns is judgment.",
      "X is correct; the interviewer is being unfair by pushing back on a valid suggestion.",
      "X should commit harder to the queue suggestion to demonstrate confidence."
    ],
    "correctIndex": 1,
    "explanation": "The interviewer is testing the difference between pattern *recall* (knowing names and rough shapes) and pattern *application* (knowing when each pattern fits, what it costs, and when to *not* use it). X demonstrates the former. Y demonstrates the latter by speaking in terms of trade-offs the candidate is making — that's what the article means when it calls pattern identification a senior-vs-junior signal.",
    "interviewScript": "In your interview, say: 'You're right to push — adding a queue here costs us clearer back-pressure and a worse UX, in exchange for fault isolation that the job's duration doesn't actually need. I'd skip the queue here. The pattern I'm applying is split sync from async, but only when the latency budget demands it — otherwise async-everything is its own anti-pattern.'",
    "proTip": "Whenever you propose a pattern, follow it immediately with 'and what this costs us is…' — the cost articulation is what separates application from recall."
  },
  {
    "id": "qA5",
    "part": "A — Why Patterns Matter",
    "subtopic": "Pattern Application vs Pattern Recall",
    "difficulty": "L5",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "A1",
      "A2",
      "A3"
    ],
    "l5Pattern": "framing-is-wrong",
    "question": "A candidate has memorized all the standard system-design patterns and reflexively reaches for the closest match every time the interviewer adds a requirement. Their design grows into a Rube Goldberg machine: presigned URLs, async workers, a workflow engine, a geospatial index — all bolted on, each individually defensible. The interviewer says, 'You've used a lot of patterns here.' Why is that often a *failing* signal at senior+ level even when each individual pattern is correctly applied?",
    "options": [
      "The candidate hasn't applied enough patterns; the design needs more sophistication, not less.",
      "Pattern recognition is supposed to *constrain* the design — senior+ candidates use patterns to *eliminate* options ('this is sub-second sync, no queue; small N, no geo index'), not to *add* options. A design that grows monotonically with each new requirement demonstrates the same recall-without-judgment failure as never knowing patterns at all — pattern overfitting.",
      "The patterns are wrong; the candidate should pick different patterns and try again.",
      "The interviewer's comment is a compliment that the candidate has misread; they should keep going."
    ],
    "correctIndex": 1,
    "explanation": "This is the framing-is-wrong canon pattern. The 'obvious' move — apply more patterns to satisfy more requirements — is technically correct but solving the wrong problem. The actual senior+ skill is using pattern recognition to *narrow* the design space: 'small N, so no geo index'; 'sub-second user-visible work, so no queue.' Pattern overfitting is the same recall-without-judgment failure that the article opens by warning against. The interviewer's flat 'you've used a lot of patterns' is the senior-tier version of 'are you sure?' Most candidates take it as praise; senior+ candidates hear it as a probe and re-justify each pattern's necessity (or remove it).",
    "interviewScript": "In your interview, say: 'Good push — let me re-justify these. Presigned URLs because uploads are large; remove the workflow engine, since the post-upload pipeline is a 3-step linear flow without long waits — a function with retries does it. Drop the geo index — N is 5K. The remaining design is simpler and meets the requirements.'",
    "proTip": "If your design has grown by adding a pattern for every requirement, ask yourself which patterns you can *remove* without violating a requirement. The remaining design is your real design; the rest is signaling. Most candidates pick A because they read 'used a lot of patterns' as competence; the deeper insight is that the interviewer is testing whether you treat patterns as a checklist or as constraints."
  },
  {
    "id": "qB1",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "When Realtime Is Needed",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "B1"
    ],
    "l5Pattern": null,
    "question": "Two surfaces in the same app: (X) the user pulls down to refresh their bank balance and the new number appears; (Y) the user sees a 'new message' toast within 200ms of a friend sending it, without doing anything. Which surface needs the realtime-updates pattern, and why doesn't the other one?",
    "options": [
      "Both need it — every modern app should push updates to feel responsive.",
      "Neither needs it — both can be solved with HTTP request/response.",
      "Y needs it; X does not. X is request/response — the user's own action provides the trigger and the response delivers the update. Y has no client-side trigger; the update originates on someone else's device, so the server must initiate the push to the receiving client.",
      "X needs it because banking is sensitive; Y does not because chat is casual."
    ],
    "correctIndex": 2,
    "explanation": "Realtime push is for situations where the *update* originates somewhere other than the user's own action — chat, notifications, live dashboards. Synchronous request/response handles cases where the user's action is the trigger; the response *is* the update. Recognizing which surfaces need push and which don't is the first decision in this pattern.",
    "interviewScript": "In your interview, say: 'For a feature like X, request/response is enough — the response carries the update. For Y, the update originates on a different client or system, so the server has to initiate the push. That's where realtime updates becomes a real pattern.'",
    "proTip": "Before reaching for SSE/WebSockets, check whether the update has a client-side trigger. If yes, you might not need realtime at all."
  },
  {
    "id": "qB2",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "Two-Axis Decision",
    "difficulty": "L2",
    "style": "Multi-Hop Reasoning",
    "conceptIds": [
      "B2"
    ],
    "l5Pattern": null,
    "question": "A candidate says: 'I'd use WebSockets for live updates.' The interviewer asks: 'And how does an update from User A's server reach the WebSocket connection that User B is holding open on a different server?' Why is this question not redundant with the original answer?",
    "options": [
      "It is redundant; WebSockets handle both client-server and server-server communication.",
      "The interviewer is being pedantic — any well-known protocol handles propagation transparently.",
      "WebSockets describe only the client↔server hop. Updates often originate elsewhere (another user, a worker, a DB change) and must propagate across servers to reach the right WS connection. That cross-server propagation is a separate decision (Pub/Sub vs consistent-hash routing) with its own trade-offs.",
      "The question is unanswerable without specifying the cloud provider."
    ],
    "correctIndex": 2,
    "explanation": "Realtime updates is a two-axis decision: (1) client↔server protocol (polling, SSE, WebSockets), and (2) cross-server propagation (Pub/Sub, consistent-hash routing, etc.). A candidate who answers only the first axis has answered half the question. The interviewer is probing whether the candidate sees both.",
    "interviewScript": "In your interview, say: 'There are two decisions: how the client and server stay connected — protocol — and how an update reaches the server holding the right connection — propagation. WebSockets is one answer to the first; the second is independent. For this workload I'd pick X for protocol and Y for propagation, because…'",
    "proTip": "Always present realtime updates as two independent decisions. Candidates who collapse them into one consistently miss the trickier half."
  },
  {
    "id": "qB3",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "Protocol Ladder & Default",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "B3",
      "B4",
      "B7"
    ],
    "l5Pattern": null,
    "question": "A team is building a stock ticker for a brokerage. PMs say 'real-time prices.' The candidate's first instinct is WebSockets. What's the more senior first move and why?",
    "options": [
      "WebSockets is correct; never start with anything simpler for anything called 'real-time.'",
      "Ask 'what does \"real-time\" mean to the user?' — most stock viewers tolerate 2-5s freshness. HTTP polling every 2s is dramatically simpler than WS at any scale, removes the operational burden of long-lived connections (sticky sessions, idle timeouts, reconnection logic), and is a perfectly fine first version. Escalate to SSE/WS only if requirements force it.",
      "Use long polling — it sits between polling and WebSockets and is always the right answer.",
      "Use SSE — it's purpose-built for server-to-client streams, so it dominates polling regardless of update frequency."
    ],
    "correctIndex": 1,
    "explanation": "The pattern's explicit guidance is to start with HTTP polling and escalate only when polling fails. Polling is stateless, plays well with any load balancer, and works behind any proxy. WS introduces sticky sessions or distributed connection state, idle-timeout management, and reconnection logic — all of which are real operational costs. The senior move is questioning whether 'real-time' actually requires sub-second freshness, since for many product surfaces 2-5s is invisible.",
    "interviewScript": "In your interview, say: 'Before reaching for WebSockets I'd want to know what real-time means here. If the freshness budget is 2-5 seconds, polling every 2s is dramatically simpler — no sticky sessions, no idle-timeout management, no reconnection logic. I'd start with polling and escalate only if requirements force me there.'",
    "proTip": "When PMs say 'real-time,' translate to a concrete latency budget. The number determines whether polling is enough — and polling is almost always enough for human-visible refresh."
  },
  {
    "id": "qB3a",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "Protocol Ladder & Default",
    "difficulty": "L3",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "B3",
      "B7"
    ],
    "l5Pattern": null,
    "question": "Two candidates choose WebSockets for a chat app. A doubles down: 'WS gives the lowest latency.' B says: 'WS adds load-balancer requirements, sticky sessions or distributed connection state, idle-timeout management, and reconnection logic — I want to make sure the latency requirement actually demands all of that.' What is B demonstrating that A is missing?",
    "options": [
      "B is being timid; A is correct that lowest latency wins.",
      "B is recognizing that 'tricky to get right' — the operational complexity of long-lived connections — is a real cost to weigh against latency benefits. A is treating protocol choice as if it were free.",
      "Their answers are equivalent; B has just added unnecessary caveats.",
      "B is wrong about the sticky-session requirement; modern WS load balancers don't need sticky sessions."
    ],
    "correctIndex": 1,
    "explanation": "The realtime-updates pattern explicitly notes that the infrastructure for SSE and WebSockets is 'tricky to get right.' That trickiness — sticky sessions, connection-state tracking, reconnection, half-open detection — is the cost candidates routinely under-weight. B is not being timid; B is articulating the trade-off A is treating as zero.",
    "interviewScript": "In your interview, say: 'WebSockets has the latency advantage, but the cost is operational: sticky sessions or distributed connection state, idle-timeout handling, and client-side reconnection logic. Before picking it I want to know whether the latency requirement actually needs sub-second freshness, because if 2-5s works, polling skips all of that.'",
    "proTip": "Operational complexity is a first-class trade-off. If a candidate picks WebSockets without articulating the operational cost, the interviewer will probe — even if WebSockets is the correct final answer."
  },
  {
    "id": "qB4",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "Server-Side Propagation",
    "difficulty": "L4",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "B5",
      "B6"
    ],
    "l5Pattern": null,
    "question": "For a real-time multiplayer drawing app where 50 users in a room share a canvas with sub-100ms cursor and stroke updates, a candidate proposes Pub/Sub for cross-server message delivery. The interviewer says, 'I see why that's tempting — what's the better choice for THIS workload, and why?'",
    "options": [
      "Pub/Sub is fine here — the 50 users will be load-balanced across many servers and Pub/Sub handles the fan-out.",
      "Consistent hashing routes all 50 users in the room to the same server, so the canvas state lives in-process — heavy stateful processing co-locates with the connections. Pub/Sub spreads users across servers, forcing every operation to coordinate state externally (cache, DB) and adds a second network hop. Pub/Sub fits stateless fan-out (chat); consistent hashing fits stateful processing (collaborative editing).",
      "Switch to long polling — neither Pub/Sub nor consistent hashing is appropriate here.",
      "Use 2PC across the servers holding the 50 connections to keep canvas state consistent."
    ],
    "correctIndex": 1,
    "explanation": "This is the WhatsApp-vs-Google-Docs distinction explicitly drawn in the pattern. Pub/Sub decouples publisher and subscriber and works beautifully when the work is stateless: chat fan-out, where any server can deliver any message. Consistent hashing pins related connections to the same server when the work is stateful: collaborative editing, where the canvas state and the connections that mutate it should live together. Picking the wrong one converts a pleasant in-process update into a distributed-state coordination problem.",
    "interviewScript": "In your interview, say: 'I'd use consistent hashing here. The 50 editors in a room mutate shared canvas state — if I spread them with Pub/Sub I now have to keep that state externally consistent across servers, which is a much harder problem. Consistent hashing co-locates the connections and the state. Pub/Sub is the right call for chat-style fan-out where there's no shared state to coordinate.'",
    "proTip": "Stateful processing → consistent hashing. Stateless fan-out → Pub/Sub. When the question hinges on shared state, the choice is consistent hashing essentially every time."
  },
  {
    "id": "qB5",
    "part": "B — Pushing Realtime Updates",
    "subtopic": "Operational Failure Modes",
    "difficulty": "L5",
    "style": "Failure Analysis",
    "conceptIds": [
      "B7"
    ],
    "l5Pattern": "two-levels-of-indirection",
    "question": "A team builds a live dashboard with SSE. Latency tests in dev pass perfectly; in prod, users see updates arrive in 30-second batches. The team blames SSE and starts a migration to WebSockets. Why is the protocol choice the wrong layer to investigate, and what is the actual root cause likely to be?",
    "options": [
      "SSE is fundamentally batch-oriented; the team is correct and the WebSockets migration will fix it.",
      "An L7 proxy (load balancer, CDN, API gateway) on the request path is buffering the chunked-transfer response — collecting bytes until the response 'completes' before forwarding. Switching to WebSockets often appears to 'fix' it, not because WS is better, but because the proxy doesn't try to buffer it. The senior+ move is to investigate the *path* between client and server, not the protocol.",
      "The browser's EventSource is the bottleneck and must be replaced.",
      "The DB is producing batched updates; the realtime layer is innocent and the migration is unnecessary."
    ],
    "correctIndex": 1,
    "explanation": "This is the two-levels-of-indirection canon: the surface bottleneck (SSE 'batches') is not the real bottleneck (a proxy buffering chunked transfer encoding). The team is one level deep — protocol — when the answer is one level over — request path. Switching to WebSockets often masks the real bug, because most proxies don't try to buffer WS frames the way they try to buffer chunked HTTP responses. Most candidates pick A because the symptom 'looks like' SSE behavior; the deeper insight is that any layer on the path can buffer, and protocol-level migrations frequently fix the symptom by avoiding the buggy layer rather than fixing it.",
    "interviewScript": "In your interview, say: 'Before migrating, I'd verify the issue is SSE itself and not a proxy on the path. L7 proxies often buffer chunked-transfer responses, which produces exactly this symptom. I'd test by hitting the SSE endpoint without going through the proxy and confirm streaming works there. If so, the fix is configuring the proxy, not changing the protocol.'",
    "proTip": "When 'real-time' breaks in prod but not in dev, suspect the path before the protocol. Proxies, load balancers, CDNs, and API gateways all have configuration that can break streaming responses."
  },
  {
    "id": "qC1",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "Pattern Shape",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "C1",
      "C2",
      "C9"
    ],
    "l5Pattern": null,
    "question": "A user uploads a 2-minute video to a sharing app. The server transcodes it to 5 resolutions — about 90 seconds of compute. The mobile app shouldn't sit on a spinner for 90 seconds. Which response shape is correct, and what infrastructure does it imply?",
    "options": [
      "Hold the HTTP request open for 90s and stream a 'transcoding…' progress response — no extra infrastructure needed.",
      "Validate the upload synchronously, write the job to a queue, return a job ID in milliseconds. A worker pool consumes the queue and runs the transcode asynchronously; the client polls or listens for completion. Infra: message queue (Redis/Kafka) + worker pool.",
      "Drop the upload — transcoding 5 resolutions is too expensive at scale and should be done on the client.",
      "Process the transcode on the same web server that received the upload; rely on long timeouts to keep clients connected."
    ],
    "correctIndex": 1,
    "explanation": "This is the canonical shape of the long-running-tasks pattern: split the request into the synchronous part (validate, enqueue, return job ID) and the asynchronous part (worker consumes queue, executes work, updates status). The infrastructure is a message queue plus a worker pool — both explicitly named in the pattern.",
    "interviewScript": "In your interview, say: 'The web server validates the upload, enqueues a transcode job, returns a job ID in milliseconds. A worker pool — separate process — consumes the queue and does the 90s of work. The client polls the job ID or subscribes for completion. The web server's request budget stays in the millisecond range; long work scales independently on the worker side.'",
    "proTip": "Whenever a piece of work exceeds a few seconds, the default shape is ack-and-defer. The hard part is *not* applying it (see the L5 question for this Part)."
  },
  {
    "id": "qC2",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "Web Server vs Worker Separation",
    "difficulty": "L2",
    "style": "Multi-Hop Reasoning",
    "conceptIds": [
      "C2",
      "C3",
      "C4",
      "C9"
    ],
    "l5Pattern": null,
    "question": "A candidate says, 'I'd push the job to a queue and a worker will pick it up.' The interviewer asks: 'Walk me through what the *web server* does and what the *worker* does — and why that separation matters.'",
    "options": [
      "Both do the same work; the queue is just a delivery mechanism with no architectural significance.",
      "Web server: synchronous part — validate auth, parse the request, enqueue the job, return a job ID (millisecond budget). Worker: asynchronous part — consume the queue, run the long compute, update job status, fire side effects. The split lets you scale the two independently, isolates the worker's faults from the request path, and keeps web-server response times predictable.",
      "Web servers do both validation and compute; workers exist only to write to disk.",
      "Workers handle authentication; web servers handle compute. The split is about offloading auth to a separate tier."
    ],
    "correctIndex": 1,
    "explanation": "The split between web server and worker pool is the entire point of the pattern. The web server's job is synchronous and millisecond-bounded — it acks the request and hands the work off. The worker's job is asynchronous and bounded only by the work itself — it consumes the queue and executes. Independent scaling, fault isolation, and predictable web-server latency are the three benefits the pattern explicitly cites.",
    "interviewScript": "In your interview, say: 'The web server handles the synchronous half: validate, enqueue, return a job ID — bounded by milliseconds. The worker pool handles the asynchronous half: consume, compute, update status — bounded only by the work itself. The split is what gives us independent scaling, fault isolation, and predictable web-server latency.'",
    "proTip": "Make the split explicit in your design narration. Candidates who blur 'web server' and 'worker' into 'the backend' lose the analytical structure that makes this pattern work."
  },
  {
    "id": "qC3",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "When Sync Wins",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "C6",
      "C7"
    ],
    "l5Pattern": null,
    "question": "A candidate proposes a queue + worker pool for a 'send password reset email' feature. The interviewer pushes back: 'Is that the right pattern here?' How should the candidate answer?",
    "options": [
      "Yes — async-everything is the default modern architecture; the interviewer is being old-fashioned.",
      "No. Sending an email is a few hundred ms — synchronous gives clearer feedback ('email sent' vs 'queued, eventually sent'), simpler back-pressure (request rate equals email rate), and one fewer moving part to operate. The async pattern is appropriate when the wait would exceed a few seconds OR when fault isolation truly matters; for sub-second work, sync is the better default.",
      "Yes — but only if the queue is Kafka; Redis-backed queues would be wrong here.",
      "No — the candidate should suggest a webhook from a third-party email service instead, with no internal queue at all."
    ],
    "correctIndex": 1,
    "explanation": "The pattern explicitly warns: 'Many candidates are quick to pull the trigger on pushing their processing behind a queue, but this is frequently a bad decision.' For short-running jobs, returning the result synchronously gives a simpler architecture, clearer back-pressure, and better UX. The async-everything reflex is one of the most common anti-patterns in interview answers.",
    "interviewScript": "In your interview, say: 'I'd actually do this synchronously. The work is sub-second, the user expects immediate feedback, and adding a queue here costs us back-pressure clarity and operational surface area in exchange for fault isolation we don't need yet. The long-running-tasks pattern is for work that takes more than a few seconds.'",
    "proTip": "Push back on 'just use a queue' as a reflex. The senior-tier answer specifies *when* the queue helps and when it doesn't."
  },
  {
    "id": "qC3a",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "Independent Scaling",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "C5"
    ],
    "l5Pattern": null,
    "question": "An e-commerce site sees web traffic 10× during a flash sale. Their architecture has the web servers and the email-sending workers in the same auto-scaling group. Why is this an anti-pattern relative to what the long-running-tasks pattern is trying to give you?",
    "options": [
      "It is fine — co-locating web and worker is best practice for low-latency shops.",
      "One of the explicit benefits of the pattern is independent scaling of web vs workers. They have very different load shapes (web = bursty user-initiated, worker = throughput-bound queue drain). Bundling them together means scaling web 10× also scales the worker pool 10× even if the email queue is empty (wasting money), or the email queue backs up because workers are starved when web is sized low (bad UX).",
      "Auto-scaling groups are inherently broken; the design should use Kubernetes.",
      "Workers should always run on the same machine as the queue, which is incompatible with web auto-scaling."
    ],
    "correctIndex": 1,
    "explanation": "Independent scaling of web servers vs workers is one of the three explicitly-named benefits of the pattern. Bundling them defeats it. Web servers scale with user concurrency; workers scale with queue depth. Different load shapes need different scaling curves; sharing a group means you optimize for neither.",
    "interviewScript": "In your interview, say: 'The point of separating web from worker is that they have different load shapes. Web is bursty — driven by user concurrency. Workers are throughput-bound — driven by queue depth. Co-scaling means I either over-provision workers during traffic spikes or starve the queue during quiet periods. They should be separate auto-scaling groups with separate metrics.'",
    "proTip": "When you call out independent scaling, name the metric each side scales on. Web: concurrent connections / RPS. Worker: queue depth / oldest message age. Different metrics ⇒ different groups."
  },
  {
    "id": "qC4",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "DLQ, Retries, Poison Messages",
    "difficulty": "L4",
    "style": "Failure Analysis",
    "conceptIds": [
      "C8"
    ],
    "l5Pattern": null,
    "question": "A candidate's design has a worker pool consuming a Kafka topic. The interviewer asks: 'What happens if a single message has bad data that crashes the worker every time it tries to process it?'",
    "options": [
      "Kafka automatically skips poison messages and continues; nothing the application needs to handle.",
      "The worker keeps consuming and crashing on the same message (or, with manual offset commits, the partition stalls behind the bad message). A single poison message blocks the entire partition. The fix: bounded retries with exponential backoff, then move the message to a dead-letter queue (DLQ) for human inspection. The worker must also be idempotent because retries mean the same job may be processed more than once.",
      "Workers should ignore parse errors silently and move on; logging is sufficient.",
      "Kafka guarantees exactly-once delivery, so retries are unnecessary."
    ],
    "correctIndex": 1,
    "explanation": "Poison messages are one of the explicit failure scenarios the pattern names. Without bounded retries and a DLQ, a single bad message becomes a denial-of-service against the worker pool. The pattern's required handling list — 'job status tracking, retries, and failure scenarios like dead-letter queues for poison messages' — is exactly this. Idempotency is the companion requirement: any retry-based design must assume duplicate processing.",
    "interviewScript": "In your interview, say: 'Without protection, a single poison message stalls the partition. I'd add bounded retries with exponential backoff — say three attempts — and on final failure move the message to a DLQ for human triage. The worker logic also has to be idempotent, because retries mean the same job may execute more than once.'",
    "proTip": "Whenever you draw a queue + worker, draw the DLQ next to it. It's one box, but its absence is a fast way to lose senior signal."
  },
  {
    "id": "qC5",
    "part": "C — Managing Long-Running Tasks",
    "subtopic": "Async-Everything Anti-Pattern",
    "difficulty": "L5",
    "style": "Cross-Part Bridge",
    "conceptIds": [
      "C6",
      "C7"
    ],
    "l5Pattern": "framing-is-wrong",
    "question": "A team built an order-confirmation flow as: web server enqueues → worker computes total → worker writes to DB → worker publishes 'order_confirmed' event → email service consumes and sends. Each step is 'correctly' async. Customers complain that 'Submit Order' returns immediately, but the order doesn't appear in their dashboard for 6 seconds. Why is async-everything the wrong framing here, and what's the senior+ design?",
    "options": [
      "The team is correct; customers should learn to wait. No design change needed.",
      "The flow needs more queues and a workflow engine to make the 6 seconds reliable.",
      "Order confirmation is a sub-second sync operation in disguise. The user's mental model is 'I clicked Submit; my order exists.' Returning a job ID and making them poll is solving an imaginary scaling problem. Senior+ design: write the order synchronously and return the order in the response. Then async out the slow side effects (email, fraud check, inventory replication). The pattern is *split sync from async* — not 'everything async.'",
      "Replace the queue with a synchronous API call between services; the queue itself is the problem."
    ],
    "correctIndex": 2,
    "explanation": "This is the framing-is-wrong canon: the team is asking 'how do we make our async pipeline fast?' when the right question is 'should this be async at all?' The pattern's name 'long-running tasks' carries the answer — it's for *long-running* tasks, and order creation is sub-second. The senior+ split is sync where the user's mental model demands consistency, async for the actual long-tail side effects. Most candidates pick B because they read 'add reliability infrastructure' as the answer; the deeper insight is recognizing that the wrong work is async. This question bridges Part C × Part J: the right pattern is also 'start simple' — a sync write, then async only the genuinely slow steps.",
    "interviewScript": "In your interview, say: 'The order itself should be a synchronous DB write — the user's mental model is that hitting Submit creates the order. The async part is the side effects: email, fraud scoring, inventory replication. Splitting sync from async correctly means asking which work the user is *waiting on the result of* — only that part is sync, and only the rest is async.'",
    "proTip": "Async-everything is its own anti-pattern. Test each step against: 'does the user need the result before the response returns?' If yes, sync. If no, async. The split is per-step, not per-flow."
  },
  {
    "id": "qD1",
    "part": "D — Dealing with Contention",
    "subtopic": "Race Conditions",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "D1",
      "D2"
    ],
    "l5Pattern": null,
    "question": "On Black Friday, a single product has 5 units left in inventory. Within 100 milliseconds, 50,000 users hit 'Buy Now.' The naive design reads 'available > 0' and decrements. Without coordination, what goes wrong, and what general class of problem is this?",
    "options": [
      "Nothing — the database serializes writes automatically and only the first 5 succeed.",
      "Most users see a friendly 'sold out' message because the application server queues their requests in order.",
      "Many users read 'available > 0' before any decrement commits, all proceed past the check, and the system over-sells. This is a race condition — a contention problem where multiple actors operate on a shared resource without isolation between their operations.",
      "The database crashes because 50,000 concurrent writes always exceed transaction-per-second limits."
    ],
    "correctIndex": 2,
    "explanation": "This is the canonical example given in the pattern: a shared resource (inventory row) with concurrent access where the read-then-write gap allows the system to over-sell. The pattern's framing is 'multiple users try to access the same resource simultaneously … you need mechanisms to prevent race conditions and ensure data consistency.' Recognizing this *as* a contention problem is the first step.",
    "interviewScript": "In your interview, say: 'This is a contention problem — a race condition on a shared resource. Without isolation, many users will pass the availability check before any commit, and the system will over-sell. The fix is some coordination mechanism: pessimistic locking, OCC, or a queue-based serialization, depending on the throughput and contention profile.'",
    "proTip": "Always name the problem explicitly as a race condition or contention problem before reaching for a solution. Naming it shows you're applying the pattern, not just guessing."
  },
  {
    "id": "qD2",
    "part": "D — Dealing with Contention",
    "subtopic": "Pessimistic vs OCC",
    "difficulty": "L2",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "D3",
      "D4"
    ],
    "l5Pattern": null,
    "question": "Two strategies for the inventory race: (X) wrap the buy in a transaction with `SELECT … FOR UPDATE` on the inventory row, serializing access through a lock. (Y) read inventory + version, write back conditional on version unchanged, retry on conflict. What fundamentally differs in their behavior under high vs low contention?",
    "options": [
      "X and Y are functionally identical; pick whichever your DB supports.",
      "X (pessimistic) serializes access — predictable but bottlenecks under high contention as transactions queue. Y (OCC) is cheap when conflicts are rare (no locks held during the read), but degrades to retry storms when conflicts are common — most retries find the version moved again. Choice depends on contention frequency: low contention → OCC; high contention → pessimistic.",
      "Y always wins because it doesn't require database locks.",
      "X always wins because the database guarantees correctness without retry logic."
    ],
    "correctIndex": 1,
    "explanation": "The decision axis the pattern names is atomicity/transactions versus explicit locking. Pessimistic locking serializes — high latency under contention but no wasted work. OCC is optimistic — cheap when most reads commit cleanly but pathological when many writers retry against a fast-moving version. Picking between them requires knowing the contention profile, which is why the pattern is presented as a trade-off rather than a default.",
    "interviewScript": "In your interview, say: 'Both can be correct depending on contention. OCC is cheap when conflicts are rare — readers don't hold locks. But under high contention, OCC degrades to retry storms because most retries lose the version race again. Pessimistic locking serializes more predictably but bottlenecks. For an inventory row with 50K concurrent buyers, I'd expect heavy contention and would prefer pessimistic — or step further to a queue-based serialization.'",
    "proTip": "OCC is not 'always better than locks.' Under high contention it can be much worse. Always characterize the contention profile before picking."
  },
  {
    "id": "qD3",
    "part": "D — Dealing with Contention",
    "subtopic": "Performance vs Consistency",
    "difficulty": "L3",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "D4",
      "D5"
    ],
    "l5Pattern": null,
    "question": "For a global cart-checkout flow, you can use 2PC across the cart-service DB and inventory-service DB to keep them perfectly consistent, OR a saga (cart-service writes, then asks inventory-service to reserve, then compensates if anything fails). For a high-throughput consumer site, which fits, and why?",
    "options": [
      "2PC — perfect consistency is non-negotiable for checkout.",
      "Saga. 2PC's blocking coordinator and cross-service locks kill throughput and create outage risk if the coordinator's log is lost. Saga accepts eventual consistency in exchange for operational simplicity, higher throughput, and partition tolerance — failures become compensating transactions rather than blocked clients. Trade-off: stronger consistency vs throughput/availability.",
      "Neither — use a single global database for both services to avoid the choice altogether.",
      "Both, depending on the time of day; switch between them dynamically."
    ],
    "correctIndex": 1,
    "explanation": "The pattern names the trade-off explicitly: 'performance versus consistency guarantees, and simple database solutions versus complex distributed coordination.' 2PC gives strong consistency at the cost of throughput and availability — the coordinator becomes a synchronous dependency for every transaction and a single point of failure. Saga gives eventual consistency with much higher throughput and resilience. For a consumer checkout that can tolerate brief inconsistency (with compensations), the saga is almost always the senior choice. The deeper move is sometimes recognizing that the data-split itself was premature (see Part D L5).",
    "interviewScript": "In your interview, say: 'I'd use a saga. 2PC across two services adds a synchronous coordinator that's now in the critical path for every checkout — that's a throughput ceiling and a single point of failure. Saga accepts eventual consistency, with explicit compensations on failure, in exchange for the throughput and availability we actually need at scale.'",
    "proTip": "Whenever you compare 2PC vs saga, frame it as 'consistency vs availability/throughput.' The choice is workload-dependent — but the framing itself is what shows you understand the pattern."
  },
  {
    "id": "qD3a",
    "part": "D — Dealing with Contention",
    "subtopic": "Interviewer Probes the Split",
    "difficulty": "L3",
    "style": "Interviewer Pushback",
    "conceptIds": [
      "D6",
      "D9"
    ],
    "l5Pattern": null,
    "question": "A candidate designs an event-bookings system with separate user-service, booking-service, and inventory-service, each with its own database. The interviewer asks: 'What changes when a customer cancels and you have to issue a refund?' Why is this question a probe rather than a feature request?",
    "options": [
      "It is just a feature request; refunds are routine.",
      "The interviewer is testing whether the candidate understands distributed transactions. With one DB, refund is a single transaction. Across three services with three DBs, refund is a multi-step operation that needs a saga, idempotent compensations, or 2PC — all of which the candidate must reason about. The probe surfaces whether splitting data into multiple DBs was a deliberate trade-off or a default 'microservices' choice.",
      "The interviewer is asking about UI design.",
      "The interviewer wants the candidate to add a fourth service for refunds."
    ],
    "correctIndex": 1,
    "explanation": "The pattern explicitly notes: 'Interviewers are keen to dig in and see if you really understand all that you're giving up by breaking your data apart.' Refund is a classic probe because it forces the candidate to reckon with cross-service consistency. The candidate's quality of answer here — articulating saga vs 2PC vs reverting to a single DB — directly signals whether the original split was thought-through.",
    "interviewScript": "In your interview, say: 'Good question — and a fair probe of my data split. With one DB this is a single transaction. Across three services I need either a saga with compensating transactions for inventory release and payment refund, or 2PC if the consistency requirement can't tolerate any window of inconsistency. For a consumer refund, saga with idempotent compensations is the right move — but if I'm being honest, the data split itself is what made this hard, not the refund.'",
    "proTip": "When an interviewer asks about a cross-service flow, treat it as a quality-of-split probe. The right move is to articulate what the split cost you, not just describe the workaround."
  },
  {
    "id": "qD4",
    "part": "D — Dealing with Contention",
    "subtopic": "Premature Distribution",
    "difficulty": "L4",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "D6",
      "D8"
    ],
    "l5Pattern": null,
    "question": "A candidate immediately designs a sharded inventory service with a Redis-based distributed lock for a startup that processes 100 orders per day. The interviewer asks: 'Are we sure this is the right shape?' What's the issue?",
    "options": [
      "There is no issue; the design is forward-looking and prepares for scale.",
      "The candidate is overengineering. A single Postgres row with `SELECT … FOR UPDATE` handles 100 orders/day without measurable contention. The pattern's explicit guidance: 'Most problems start with single-database solutions before scaling to distributed approaches.' Distributed coordination introduces fencing-token gotchas, lock-renewal failures, split-brain risk, and operational burden — all costs the simple approach skips.",
      "The candidate should use SERIALIZABLE isolation in Postgres instead of FOR UPDATE.",
      "The candidate should use a separate database per order to maximize parallelism."
    ],
    "correctIndex": 1,
    "explanation": "The pattern's default progression is single-DB first, distributed only when forced. At 100 orders/day, distributed locks introduce more failure modes than they prevent. The interviewer's 'are we sure?' is the senior-tier nudge to right-size the solution — overengineering is a real failure mode the pattern names. The deeper point: every distributed primitive added is a primitive whose own failure modes the candidate now owns.",
    "interviewScript": "In your interview, say: 'You're right — at this scale a distributed lock is overkill. A single Postgres row with FOR UPDATE handles 100 orders/day comfortably. I'd start there and only move to distributed coordination when the workload demands it. Distributed locks bring fencing-token, renewal, and split-brain failure modes that we don't have to own at this scale.'",
    "proTip": "When you reach for a distributed primitive, ask: 'what does the single-DB version of this look like, and why isn't that enough?' If you can't answer cleanly, you're probably overengineering."
  },
  {
    "id": "qD5",
    "part": "D — Dealing with Contention",
    "subtopic": "Splitting Re-Creates Contention",
    "difficulty": "L5",
    "style": "Cross-Part Bridge",
    "conceptIds": [
      "D7",
      "D8",
      "D9"
    ],
    "l5Pattern": "adversarial-pushback",
    "question": "A candidate proposes: 'To scale write throughput, I'll shard the orders table by user_id.' The interviewer says: 'Couldn't you just do that? It seems clean.' What subtle problem does sharding *introduce* that the original single-database design *solved for free*?",
    "options": [
      "Nothing — sharding by user_id is a clean win with no downsides.",
      "Cross-shard transactions. Any operation that touches two users (transfers, group orders, refunds with cross-account credit, marketplace splits) now spans shards and requires distributed coordination — 2PC, saga, or careful idempotent compensations — that a single database gave you transparently. The DB was solving a contention problem you've now opted into solving yourself. Sharding is sometimes appropriate, but the candidate must show they understand exactly what they're giving up.",
      "Sharding always reduces write throughput; the candidate's premise is wrong.",
      "Sharding by user_id is incompatible with foreign keys and breaks SQL entirely."
    ],
    "correctIndex": 1,
    "explanation": "This is the adversarial-pushback canon: 'couldn't you just shard?' has a subtle correctness flaw. The pattern is explicit: 'Databases are built around problems of contention. When you separate your data into multiple databases, you're taking on all of the challenges that the database systems were originally designed to solve.' Sharding moves the problem from inside one DB (where the DB solved it for free) to between DBs (where the application now owns 2PC/saga). Most candidates pick A because sharding 'sounds like the answer' to write scaling; the deeper insight is that the single-DB design had transactional cross-row operations as a free property, and sharding turns every cross-shard operation into a distributed coordination problem. This question bridges Part D × Part F: the right answer to write scaling is sometimes sharding, but only after pricing in the contention re-creation.",
    "interviewScript": "In your interview, say: 'I want to push back on my own answer. Sharding by user_id moves cross-user operations — transfers, group orders, cross-account refunds — from being a single DB transaction to being a distributed coordination problem. The DB was solving that contention transparently; I've now opted in to owning it. Whether sharding is right here depends on how much of the workload is cross-user. If most operations stay within a user, sharding is fine; if cross-user is common, I either keep the single DB or accept 2PC/saga for those flows.'",
    "proTip": "When proposing sharding, immediately characterize what fraction of operations cross shards. That single number determines whether sharding wins or loses. Most candidates pick A because 'shard for writes' is a reflex; the deeper insight is that sharding re-creates the contention problem the DB was already solving for you."
  },
  {
    "id": "qE1",
    "part": "E — Scaling Reads",
    "subtopic": "Reads Bottleneck First",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "E1",
      "E2"
    ],
    "l5Pattern": null,
    "question": "A new social app has 10,000 users; the database is fine. The interviewer scales the brief to 10 million users and asks: 'Where do you expect the first scaling problem to appear — reads, writes, or storage?' What's the right answer and why?",
    "options": [
      "Writes — because every user is generating new content constantly.",
      "Storage — because 10M users means 10M times the disk usage.",
      "Reads. Read traffic grows with both user count and per-user read frequency (feed views, profile views, comment threads, each of which fires many DB queries). Write rate per user grows much more slowly. In most systems, read traffic outstrips write traffic by 10:1 to 100:1+, so reads hit scaling limits first.",
      "All three at once — there is no general pattern."
    ],
    "correctIndex": 2,
    "explanation": "The pattern's framing line: 'As your application grows from hundreds to millions of users, read traffic often becomes the first bottleneck. While writes create data, reads consume it — and read traffic typically grows much faster than write traffic.' Recognizing this asymmetry is the entry point to the entire pattern.",
    "interviewScript": "In your interview, say: 'Reads will hit limits first. Read traffic grows with user count *and* per-user read frequency — each feed view fires many queries — while write rate per user grows slowly. The asymmetry is usually 10:1 to 100:1, so the strategies are asymmetric too: read replicas, caches, indexing.'",
    "proTip": "When the interviewer scales up the brief, default-assume reads bottleneck first. The exceptions (analytics ingest, IoT telemetry) are the cases where you should call out 'this is unusual — writes dominate' explicitly."
  },
  {
    "id": "qE2",
    "part": "E — Scaling Reads",
    "subtopic": "Read:Write Ratio",
    "difficulty": "L2",
    "style": "Estimation-Backed Reasoning",
    "conceptIds": [
      "E2",
      "E3",
      "E4"
    ],
    "l5Pattern": null,
    "question": "An interviewer asks: 'For Instagram, roughly what fraction of database operations are writes?' Without exact data, what's a reasonable estimate, and what does the answer imply for scaling strategy?",
    "options": [
      "About 50% — every read is matched by a write.",
      "Much less than 1% writes. A user opens the feed dozens of times per day; each open fires hundreds of queries (post metadata, user info, engagement counts, comment previews). A user posts maybe once per day — one write. Read:write ratios of 100:1 or 1000:1 are normal for feed-heavy social apps. Implication: scaling strategies should be asymmetric — read replicas, caches, and indexing matter far more than write-side scaling here.",
      "About 25% writes — a 3:1 ratio is typical.",
      "Writes always equal reads in steady-state systems by conservation."
    ],
    "correctIndex": 1,
    "explanation": "The pattern's worked example is exactly this: 'Consider Instagram: when you open the app, you see dozens of photos requiring hundreds of database queries for metadata, user info, and engagement data. Meanwhile, you might only post once per day.' The point isn't the exact ratio — it's that read-write asymmetry is huge, so the scaling toolkit is asymmetric (replicas + caches + CDN, not sharding for writes).",
    "interviewScript": "In your interview, say: 'Reads dominate by orders of magnitude here. A user opens the feed dozens of times a day; each open fires hundreds of queries. Writes — posts, likes — are maybe 1% of operations or less. That asymmetry tells me my scaling investments belong on the read side: indexing, replicas, and caching, in that order.'",
    "proTip": "When asked for ratios, anchor on the user behavior — 'how many feed opens vs how many posts per day' — and let the math fall out. Interviewers want the reasoning, not the exact number."
  },
  {
    "id": "qE3",
    "part": "E — Scaling Reads",
    "subtopic": "Escalation Order",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "E5",
      "E7"
    ],
    "l5Pattern": null,
    "question": "Asked to scale reads on a slow query, a candidate's first move is: 'I'll put Redis in front of the database.' What's the more senior progression, and why does the order matter?",
    "options": [
      "Redis-first is correct; caching is always step one.",
      "Start in-DB: indexing for actually-slow queries, denormalization where joins dominate. Then horizontal: read replicas (cheap, well-understood, data still authoritative in the DB). Then external caching: Redis or a CDN. Skipping straight to caching introduces invalidation complexity and stale-reads risk before exhausting cheaper, simpler optimizations — and a bad query that's slow on the primary will be slow on a cache miss too.",
      "The order doesn't matter — pick whichever fits the budget.",
      "Always shard the DB before touching reads."
    ],
    "correctIndex": 1,
    "explanation": "The pattern names this progression explicitly: 'optimize read performance within your database through indexing and denormalization, scale horizontally with read replicas, then add external caching layers like Redis and CDNs.' The order isn't arbitrary — each step is cheaper to operate and correctness-easier than the next. Caching adds invalidation as a permanent operational tax; replicas add lag but no consistency model change; in-DB optimization adds nothing operationally.",
    "interviewScript": "In your interview, say: 'Before reaching for Redis I'd look in-DB first — index the slow query, denormalize if joins are the bottleneck. Then read replicas, which give linear scale-out without changing the consistency model much. Cache is the last step because invalidation is a permanent tax. Cheapest to operate to most expensive: index → replicas → cache.'",
    "proTip": "Cache is not free — it's a debt the system pays in invalidation forever. Defer it until cheaper options are exhausted."
  },
  {
    "id": "qE3a",
    "part": "E — Scaling Reads",
    "subtopic": "Indexing & Denormalization First",
    "difficulty": "L3",
    "style": "Anti-Pattern Identification",
    "conceptIds": [
      "E5",
      "E7"
    ],
    "l5Pattern": null,
    "question": "A candidate proposes adding 5 read replicas to scale a slow feed-rendering query. The interviewer asks, 'Have you looked at the queries themselves?' Why is the question pointed?",
    "options": [
      "It is not pointed; the candidate's plan is fine.",
      "Replicas don't fix slow queries — they give you 5 servers running the same slow query. The biggest read win often comes from indexing and denormalizing *before* fanning out. A feed-render query doing 4 joins per item benefits more from a denormalized feed-item table (one row read = one item rendered) than from a 5× replica fan-out. Optimize the query first; replicate it second.",
      "The interviewer is suggesting 10 replicas instead of 5.",
      "Replicas can only run reads if the schema is denormalized first; without that, they can't be used."
    ],
    "correctIndex": 1,
    "explanation": "The first step in the pattern's progression is in-DB optimization — indexing and denormalization. Replicas multiply the *current* query, including its inefficiencies. A 4-join feed query at 200ms remains 200ms across 5 replicas; a denormalized single-row read at 5ms beats it on one replica. Replicas are aggregate-throughput tools, not query-speed tools.",
    "interviewScript": "In your interview, say: 'You're right — let me look at the query first. If it does 4 joins per feed item, the win is denormalizing into a feed-item table, not replicating. Replicas multiply throughput but not query speed. I'd index and denormalize first, then replicate.'",
    "proTip": "Replicas multiply throughput; they don't improve per-query latency. If your latency is bad, fix the query first."
  },
  {
    "id": "qE4",
    "part": "E — Scaling Reads",
    "subtopic": "Replication Lag",
    "difficulty": "L4",
    "style": "Failure Analysis",
    "conceptIds": [
      "E6"
    ],
    "l5Pattern": null,
    "question": "Candidate adds read replicas for scaling. The interviewer says: 'User A posts a comment. User A immediately refreshes the page. What might happen?'",
    "options": [
      "Nothing unusual — the database guarantees A sees their own write.",
      "User A's POST hits the primary; the refresh GET is round-robined to a replica that hasn't received the new row yet. User A sees their own comment missing — which looks like a data-loss bug to them. Mitigations: read-your-writes (read from primary for the originating user), sticky read-from-primary for a few seconds after a write, or UI affordances that show the comment immediately while the replicate-and-confirm happens in the background.",
      "The system would crash because primary and replica got out of sync.",
      "The replica would automatically forward the read to the primary — replication makes this transparent."
    ],
    "correctIndex": 1,
    "explanation": "Replication lag is one of the explicitly-named concerns in the pattern. Read-from-replica gives throughput at the cost of staleness, and the pathological case is the writer reading right after the write — they see 'their own write missing.' Mitigations exist (read-your-writes, sticky reads, optimistic UI) and the senior signal is naming the problem and articulating one.",
    "interviewScript": "In your interview, say: 'Replication lag — A's POST goes to primary, A's refresh hits a lagging replica, A sees their comment missing. Three mitigations: route the originating user's reads to primary for a few seconds, render the new comment optimistically on the client before the replica catches up, or accept the lag and signal it in the UI. For a comment thread the optimistic-UI approach is usually the right UX move.'",
    "proTip": "Read-your-writes is the canonical mitigation. Always name it when you propose read replicas — interviewers will probe."
  },
  {
    "id": "qE5",
    "part": "E — Scaling Reads",
    "subtopic": "Hot Keys at Scale",
    "difficulty": "L5",
    "style": "Estimation-Backed Reasoning",
    "conceptIds": [
      "E6"
    ],
    "l5Pattern": "estimation-backed-scenario",
    "question": "A celebrity posts. Their profile is requested at 1M QPS for 30 seconds. The cache layer is a 50-node Redis cluster; the celebrity's profile is owned by one node. What breaks first, in what order, and why does adding more replicas not help in time?",
    "options": [
      "Nothing breaks — Redis handles 1M QPS trivially.",
      "The DB breaks first because Redis can't handle bursts.",
      "The single Redis node receiving 1M QPS for one key saturates network bandwidth or CPU before anything else — one shard owns the key regardless of how many shards exist. Adding more shards or replicas doesn't help fast enough because the hot key is on one shard. Hot-key mitigations differ from generic read scaling: per-key client-side caching, key replication across nodes, request coalescing, or breaking the cache-aside pattern with a write-through copy. Lesson: aggregate read scaling and per-key read scaling are different problems.",
      "The CDN saturates first; Redis can handle 1M QPS per key indefinitely."
    ],
    "correctIndex": 2,
    "explanation": "This is the estimation-backed-scenario canon: the numbers force a different recommendation than generic read scaling would give. 1M QPS to one key on one shard is a per-shard problem; adding shards is irrelevant when the key is hot. The pattern explicitly calls out 'hot keys where millions of users request the same popular content simultaneously' as a separate concern. Most candidates pick A because they think 'Redis is fast'; the deeper insight is that aggregate scaling buys you nothing when one key dominates one shard.",
    "interviewScript": "In your interview, say: 'At 1M QPS to one key, the bottleneck is the single shard owning that key — likely network bandwidth on that node. More shards don't help because hashing puts the key on one shard. The fix is per-key replication: copy the celebrity's profile to multiple shards or onto every web server's local cache, with TTL and invalidation. CDN edge caching is even better for this — the edges absorb the burst and the origin sees a few hundred QPS, not a million.'",
    "proTip": "When a single piece of content goes hot, generic scaling math doesn't apply. The mitigations are per-key (replicate, edge-cache, coalesce), not per-fleet. Most candidates pick A because they conflate Redis throughput with per-key throughput; the deeper insight is that the hot-key problem is a sharding problem in disguise."
  },
  {
    "id": "qF1",
    "part": "F — Scaling Writes",
    "subtopic": "When Single-DB Limits Bite",
    "difficulty": "L1",
    "style": "Scenario-Based",
    "conceptIds": [
      "F1",
      "F2"
    ],
    "l5Pattern": null,
    "question": "A startup's monolithic Postgres handles 200 writes/sec comfortably. After a viral launch, they need to handle 200,000 writes/sec sustained. What broad class of strategy must they consider?",
    "options": [
      "Vertical scaling — buy a bigger database server, end of problem.",
      "Add read replicas — they offload writes too.",
      "Horizontal sharding (distribute writes across servers), vertical partitioning (split data types onto different DBs), and burst handling (queues, load shedding, batching). Single-server limits don't disappear with vertical scale alone; the toolkit at this scale is the scaling-writes pattern, not a bigger box.",
      "Turn off transactions — they are the bottleneck."
    ],
    "correctIndex": 2,
    "explanation": "The pattern's framing: 'individual database servers and storage systems hit hard limits' at high write QPS. The three strategies named are horizontal sharding, vertical partitioning, and burst handling. Recognizing this *as* a write-scaling problem — and naming the strategies — is the entry point.",
    "interviewScript": "In your interview, say: 'At 200K writes/sec one server is no longer enough — vertical scaling will plateau. The toolkit is horizontal sharding, vertical partitioning, and burst handling via queues, load shedding, or batching. Which I reach for first depends on the workload shape — sustained throughput vs spikes.'",
    "proTip": "Always name all three legs of the toolkit (sharding, partitioning, burst handling) before picking one. Interviewers probe the leg you didn't name."
  },
  {
    "id": "qF2",
    "part": "F — Scaling Writes",
    "subtopic": "Horizontal vs Vertical Partitioning",
    "difficulty": "L2",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "F2",
      "F3",
      "F4"
    ],
    "l5Pattern": null,
    "question": "A candidate says, 'we'll partition the database.' The interviewer asks: 'horizontal or vertical?' For an app where the orders table is enormous but the rest of the schema (users, products, settings) is fine, which fits, and what's the difference?",
    "options": [
      "Horizontal and vertical mean the same thing.",
      "Horizontal sharding: same schema, rows distributed across servers (e.g., orders sharded by user_id). Vertical partitioning: different *types* of data live on different servers (e.g., orders DB separate from analytics DB). For a write-heavy `orders` table with the rest of the schema fine, horizontal sharding of orders is the right move; vertical partitioning fits when different data types have different access patterns or scaling needs.",
      "Vertical partitioning is the only correct choice; horizontal sharding is deprecated.",
      "Horizontal sharding always requires a NoSQL database."
    ],
    "correctIndex": 1,
    "explanation": "The pattern names both strategies as distinct. Horizontal sharding splits one large table by row across servers — same schema, more servers. Vertical partitioning splits the data model by *type* — orders here, analytics there. For a single hot table, horizontal is the lever; for a system where different parts of the schema have different scaling profiles, vertical is. The two are complementary.",
    "interviewScript": "In your interview, say: 'Horizontal sharding splits the orders table by row across servers — same schema. Vertical partitioning would put different tables on different DBs. Here it's the orders table that's hot, so horizontal sharding by user_id (or order_id with co-location keys) is the move. I'd leave the rest of the schema on the original DB.'",
    "proTip": "Use the words 'horizontal' and 'vertical' precisely. Conflating them is a fast tell that the candidate is at surface depth."
  },
  {
    "id": "qF3",
    "part": "F — Scaling Writes",
    "subtopic": "Partition Key Trade-off",
    "difficulty": "L3",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "F5"
    ],
    "l5Pattern": null,
    "question": "A candidate shards a chat service by `chat_id`. The interviewer asks: 'What happens to a query like \"show all chats for user X\"?'",
    "options": [
      "It runs identically to before — sharding is transparent to queries.",
      "It must fan out across every shard (scatter-gather), aggregate the results, and return — drastically slower than the per-chat queries the layout is optimized for. Trade-off: sharding by chat_id keeps a single chat's writes co-located (write-path wins), but breaks per-user queries (read-path loses for one access pattern, gains for another). Partition key choice always trades load distribution, co-location of related data, and acceptability of cross-shard queries.",
      "The query becomes faster because the data is now distributed.",
      "The query is impossible after sharding; the schema must be redesigned entirely."
    ],
    "correctIndex": 1,
    "explanation": "The pattern's explicit guidance: 'selecting good partition keys that distribute load evenly while keeping related data together.' The trade-off is real because related-by-write and related-by-read are often different relations. Sharding by chat_id co-locates all writes for one chat (great for a chat's hot path) but scatters a user's chats across shards (terrible for a user's chat list). The senior signal is articulating the trade-off, not finding a magical key that wins both.",
    "interviewScript": "In your interview, say: 'Sharding by chat_id co-locates writes within a chat — the hot path — but means \"all chats for user X\" is a fan-out across all shards. The trade-off is unavoidable: chat_id wins for chat operations, user_id wins for user views. Two ways out: pick the key that matches the dominant access pattern and accept fan-out for the other, or maintain a secondary user→chat-list index in a separate store.'",
    "proTip": "Partition keys encode workload assumptions. State the assumption explicitly when you pick one — 'I'm sharding by X because Y is the dominant access pattern' — and you've prevented the most common interview gotcha."
  },
  {
    "id": "qF4",
    "part": "F — Scaling Writes",
    "subtopic": "Burst Handling",
    "difficulty": "L4",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "F6",
      "F7"
    ],
    "l5Pattern": null,
    "question": "A payments system normally handles 1K writes/sec; a Black Friday spike hits 50K writes/sec. The candidate proposes: 'buffer the surge in a write queue.' The interviewer asks: 'What if the surge is sustained for 6 hours?'",
    "options": [
      "Queues handle indefinite surges; size them larger.",
      "Queues are tools for *temporary* spikes — they assume the drain capacity returns. A 6-hour sustained surge fills any finite queue and creates large staleness/SLA violations. The senior move is combining tools: queue absorbs short spikes; load shedding kicks in for sustained surges (drop low-priority writes — analytics events — keep high-priority writes — payments). The pattern names load shedding explicitly: 'prioritize important writes during overload.' Knowing when each tool is the wrong tool is the trade-off.",
      "Add more queue replicas to handle 6 hours.",
      "Stop accepting writes until the surge ends."
    ],
    "correctIndex": 1,
    "explanation": "The pattern names both tools — write queues for spikes, load shedding for sustained overload. They're complementary, not interchangeable. A queue is a smoothing mechanism; if the long-run incoming rate exceeds drain rate, the queue grows without bound (or is dropped, which is load shedding by accident). Senior+ designs articulate when each tool fits.",
    "interviewScript": "In your interview, say: 'Queues smooth temporary spikes — they assume drain capacity returns. For a 6-hour sustained surge, the queue grows unbounded. The right combination is queue for short bursts, plus load shedding for sustained overload — drop analytics writes, keep payment writes. Defining write priorities upfront is part of the design.'",
    "proTip": "Always pair queues with load shedding when answering burst-handling questions. Either alone is incomplete."
  },
  {
    "id": "qF5",
    "part": "F — Scaling Writes",
    "subtopic": "Workload-Flip",
    "difficulty": "L5",
    "style": "Scenario-Based Trade-offs",
    "conceptIds": [
      "F5",
      "F8"
    ],
    "l5Pattern": "trade-off-inversion",
    "question": "A candidate has designed a multi-region order system: sharded by user_id, batching writes for efficiency, optimized for the write path. The interviewer says: 'Now flip the workload — what if 90% of traffic becomes *reads* of order history rather than writes?' Why does the entire partitioning strategy potentially need to change?",
    "options": [
      "It doesn't — user_id sharding is the right choice for any workload.",
      "user_id sharding is great for write co-location and per-user reads, but if reads span many users (analytics, dashboards, fraud scans), this layout becomes a fan-out nightmare. Read-heavy workloads may favor different layouts: time-partitioned tables (often immutable, easy to cache), a denormalized read store fed by CDC (CQRS), or a separate read-optimized DB. The senior+ insight: partition-key choices encode assumptions about workload; flip the workload, you flip the design.",
      "Sharding always loses to a single big DB; remove the sharding entirely.",
      "Add more shards — read scaling is always a sharding problem."
    ],
    "correctIndex": 1,
    "explanation": "This is the trade-off-inversion canon: 'what if the requirement flips?' forces switching the chosen pattern. user_id sharding optimizes for the write-co-location and per-user-read access patterns. A read-heavy workload that scans across users (fraud, analytics, leaderboards) has fundamentally different access patterns and may want a CQRS read store, time-partitioning, or a different shard key entirely. The senior+ skill is recognizing that partition-key choices are workload-conditional and re-decomposing when the workload changes.",
    "interviewScript": "In your interview, say: 'My current sharding by user_id was tuned for write co-location and per-user reads. If 90% of traffic is now cross-user analytics-style reads, fanning out across all shards every read is the wrong shape. I'd build a CQRS read store — denormalized, time-partitioned, fed by CDC from the user-sharded primary — and serve cross-user reads from there. The write side stays user-sharded; the read side gets its own optimal layout. Partition keys encode workload assumptions, and the workload just changed.'",
    "proTip": "When workload assumptions flip, the right move is rarely tweaking the existing layout — it's adding a second layout (CQRS) tuned for the new workload. State this explicitly as the trade-off."
  }
];

export const PARTS_ORDER = [
  "A — Why Patterns Matter",
  "B — Pushing Realtime Updates",
  "C — Managing Long-Running Tasks",
  "D — Dealing with Contention",
  "E — Scaling Reads",
  "F — Scaling Writes",
  "G — Handling Large Blobs",
  "H — Multi-Step Processes",
  "I — Proximity-Based Services",
  "J — Pattern Selection / Composition"
];

export default {
  questions: QUESTIONS,
  partsOrder: PARTS_ORDER
};
