// === COVERAGE MANIFEST ===
// Subtopic: The Problem (Distributed Coordination Challenges) — Questions: 2 — IDs: [q1, q2]
// Subtopic: Single Server Orchestration — Questions: 3 — IDs: [q3, q4, q5]
//   └─ Nested: State persistence bolt-on — covered by: [q4]
//   └─ Nested: Crash recovery gap — covered by: [q3, q5]
// Subtopic: Event Sourcing — Questions: 4 — IDs: [q6, q7, q8, q9]
//   └─ Nested: Durable log mechanics — covered by: [q6]
//   └─ Nested: Worker consumption model — covered by: [q7]
//   └─ Nested: Debugging/observability challenges — covered by: [q8]
//   └─ Nested: Event lineage tracing — covered by: [q9]
// Subtopic: Durable Execution Engines (Temporal) — Questions: 4 — IDs: [q10, q11, q12, q13]
//   └─ Nested: Deterministic replay — covered by: [q10]
//   └─ Nested: Workflow vs Activity distinction — covered by: [q11]
//   └─ Nested: History-based recovery — covered by: [q12]
//   └─ Nested: Temporal deployment architecture — covered by: [q13]
// Subtopic: Managed Workflow Systems (Step Functions, Airflow) — Questions: 3 — IDs: [q14, q15, q16]
//   └─ Nested: Declarative vs code-driven tradeoffs — covered by: [q14]
//   └─ Nested: Step Functions limitations (state size, duration) — covered by: [q15]
//   └─ Nested: Airflow scheduling model — covered by: [q16]
// Subtopic: When to Use Workflows — Questions: 2 — IDs: [q17, q18]
// Subtopic: When NOT to Use Workflows — Questions: 3 — IDs: [q19, q20, q21]
// Subtopic: Workflow Versioning & Migrations — Questions: 3 — IDs: [q22, q23, q24]
//   └─ Nested: Version coexistence — covered by: [q22]
//   └─ Nested: Patch-based migration — covered by: [q23]
//   └─ Nested: Declarative in-place update — covered by: [q24]
// Subtopic: Workflow State Size Management — Questions: 2 — IDs: [q25, q26]
// Subtopic: External Events & Signals — Questions: 2 — IDs: [q27, q28]
// Subtopic: Idempotency / Exactly-Once Semantics — Questions: 3 — IDs: [q29, q30, q31]
// Subtopic: Compensation Logic — Questions: 2 — IDs: [q32, q17]
// Cross-subtopic: Event Sourcing × Durable Execution — Questions: 1 — IDs: [q9]
// Cross-subtopic: Single Server × Workflows — Questions: 1 — IDs: [q5]
// Cross-subtopic: Idempotency × Compensation — Questions: 1 — IDs: [q31]
// Cross-subtopic: Versioning × State Size — Questions: 1 — IDs: [q26]
// Cross-subtopic: Signals × Exactly-Once — Questions: 1 — IDs: [q30]
// Anti-pattern questions: 4 — IDs: [q4, q19, q20, q21]
// Gotcha/trap questions: 3 — IDs: [q7, q12, q30]
// Total: 32 questions across 12 subtopics
// ========================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuizProgress } from './useQuizProgress';
import {
  Clock,
  ChevronRight,
  Flag,
  SkipForward,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Play,
  Shuffle,
  List,
  Award,
  Target,
  TrendingUp,
  Brain,
  Timer,
  ArrowRight,
  BarChart3,
  Eye,
} from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "The Problem",
    question:
      "You're designing an e-commerce order fulfillment system that must charge payment, reserve inventory, create a shipping label, and send a confirmation email. A junior engineer proposes handling all steps in a single synchronous API call with try/catch around each step. What is the MOST critical failure mode this design overlooks?",
    options: [
      {
        label: "A",
        text: "The server crashes after charging payment but before reserving inventory, and on restart there is no record of the partial progress — the customer is charged but receives nothing.",
      },
      {
        label: "B",
        text: "The shipping label API has high latency, causing the synchronous call to exceed typical HTTP timeout thresholds and drop the connection.",
      },
      {
        label: "C",
        text: "The confirmation email service is rate-limited and will reject burst sends during peak order periods.",
      },
      {
        label: "D",
        text: "The inventory service uses eventual consistency and may report stale availability data during the synchronous call.",
      },
    ],
    correctIndex: 0,
    explanation:
      "The most critical failure mode is the crash-and-amnesia problem: after a server crash mid-process, the restarted server has no memory of what happened. The customer has been charged but no subsequent steps executed, and there's no mechanism to detect or recover from this partial state. While latency, rate limiting, and consistency are real concerns, they produce degraded behavior — not silent money loss with no recovery path. This is exactly why the content emphasizes that 'real applications often need to talk to dozens of (flaky) services' and that server crashes mid-orchestration leave 'no memory of what happened.'",
    interviewScript:
      "In your interview, say: 'The fundamental issue isn't any single service failing — it's that a server crash mid-process creates an irrecoverable state where the customer is charged but the system has no record of needing to continue the fulfillment. We need durable state that survives process death.'",
    proTip:
      "In interviews, always identify the failure mode that causes silent data corruption or financial loss first — these are the ones interviewers consider 'critical' versus merely 'problematic.'",
  },
  {
    id: "q2",
    subtopic: "The Problem",
    question:
      "An interviewer describes a system where a ride-sharing app must: match a rider to a driver, get driver acceptance, navigate to pickup, confirm pickup, navigate to destination, process payment, and collect ratings. Each step depends on real-time human actions. The interviewer asks: 'What makes this fundamentally harder than a typical microservices request flow?' What's the strongest answer?",
    options: [
      {
        label: "A",
        text: "The workflow spans minutes to hours with human-dependent waits, meaning the orchestrating process must survive server restarts and deployments while maintaining state across asynchronous, unpredictable external events.",
      },
      {
        label: "B",
        text: "The system requires exactly-once semantics for payment processing, which is impossible in distributed systems without two-phase commit.",
      },
      {
        label: "C",
        text: "Each microservice must implement its own retry logic and circuit breakers, creating an exponential increase in failure handling code.",
      },
      {
        label: "D",
        text: "The real-time location tracking requires sub-100ms latency which conflicts with the reliability guarantees of message queue-based architectures.",
      },
    ],
    correctIndex: 0,
    explanation:
      "The fundamental difficulty is the interleaving of long-duration human waits with system state management. Unlike a typical request flow that completes in milliseconds, this workflow spans minutes to hours, during which servers may crash, deploy, or scale. The system must maintain workflow state across all these disruptions while also handling unpredictable external events (driver acceptance, pickup confirmation). Option B is wrong because exactly-once with idempotency keys is feasible. Option C describes a real problem but not the fundamental one. Option D conflates real-time tracking with the orchestration challenge.",
    interviewScript:
      "In your interview, say: 'What makes this hard isn't the number of services — it's that the process lives across human timescales. A server handling this workflow might crash, be redeployed, or scale down hours before the ride completes. We need durable execution that survives all of that while reacting to asynchronous human actions.'",
    proTip: null,
  },
  {
    id: "q3",
    subtopic: "Single Server Orchestration",
    question:
      "Your team has been running a single-server orchestration pattern for order processing. They added a database checkpoint after each step so the server can resume after crashes. After a recent deployment, they notice that some orders have inventory reserved but payment was never charged. The payment service confirms it received and processed the charge request successfully. What's the most likely root cause?",
    options: [
      {
        label: "A",
        text: "The server crashed after calling the payment service but before writing the checkpoint, so on restart it skipped payment and moved to inventory — but the payment service had already processed the charge on its side.",
      },
      {
        label: "B",
        text: "The payment service processed the charge but returned a timeout error, causing the orchestrator to write a 'payment failed' checkpoint and skip to inventory reservation via a fallback path.",
      },
      {
        label: "C",
        text: "The database checkpoint write succeeded, then the server crashed before calling inventory, so on restart it re-executed inventory but the payment checkpoint was already recorded.",
      },
      {
        label: "D",
        text: "A race condition between two API server instances caused both to read the same checkpoint state simultaneously, with one processing payment and the other processing inventory.",
      },
    ],
    correctIndex: 0,
    explanation:
      "This is the classic 'gap between action and checkpoint' problem in single-server orchestration. The payment service received and processed the charge, but the orchestrating server crashed before it could record that fact in its checkpoint database. On restart, the server sees no payment checkpoint and either retries payment (double-charging) or skips it depending on implementation. Meanwhile, the flow continued to inventory. This is exactly the problem the content describes: 'You're manually building a state machine with careful database checkpoints after each step' and it highlights how this 'quickly becomes complex.'",
    interviewScript:
      "In your interview, say: 'This is the fundamental gap in checkpoint-based orchestration — the window between an external side effect completing and the checkpoint being recorded. The payment service processed the charge, but the crash happened before we could durably record that fact. This is why durable execution engines record activity completions atomically.'",
    proTip:
      "This exact failure pattern is what durable execution engines like Temporal solve — they record the activity result in the history before returning it to the workflow code, eliminating the gap.",
  },
  {
    id: "q4",
    subtopic: "Single Server Orchestration",
    question:
      "A candidate proposes this architecture for a payment processing system: 'We'll use a single API server that calls each service in sequence. We'll add a PostgreSQL table to track progress, and use pub/sub to handle webhook callbacks from the payment gateway. We'll scale by adding more API servers that read state from the database.' The interviewer says: 'What's the most critical flaw in this design?'",
    options: [
      {
        label: "A",
        text: "PostgreSQL isn't suitable for high-throughput state management; they should use Redis for checkpoint storage instead.",
      },
      {
        label: "B",
        text: "With multiple API servers reading shared state, there's no mechanism to determine which server should pick up dropped work after a crash, leading to duplicate processing or orphaned workflows.",
      },
      {
        label: "C",
        text: "Pub/sub systems provide at-most-once delivery, meaning webhook callbacks from the payment gateway could be permanently lost.",
      },
      {
        label: "D",
        text: "The sequential service calls create a latency bottleneck that could be solved by parallelizing independent steps.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly calls out this anti-pattern: 'What if you have multiple API servers? Who picks up the dropped work?' When you scale out API servers that share a checkpoint database, you create a coordination problem — no single server owns a workflow. After a crash, all servers see pending work but there's no leader election or work-claiming mechanism, leading to either duplicate processing (multiple servers claiming the same work) or orphaned workflows (each server assuming another will handle it). Option A is wrong because PostgreSQL is fine for state management. Option C mischaracterizes pub/sub. Option D is an optimization, not a critical flaw.",
    interviewScript:
      "In your interview, say: 'The critical flaw is the missing work assignment protocol. When multiple servers share state, we need a mechanism to claim and exclusively own in-progress workflows. Without it, server crashes lead to either duplicate execution or permanently stuck workflows. This is essentially re-inventing what workflow engines already solve.'",
    proTip: null,
  },
  {
    id: "q5",
    subtopic: "Single Server Orchestration",
    question:
      "You've been asked to evolve a single-server orchestration system into something more reliable. The system currently handles ~500 orders/hour with 3% failure rate due to crashes mid-process. Your manager wants to keep the same codebase and 'just add reliability.' An architect suggests adopting Temporal instead. What's the strongest argument for the architectural shift rather than incremental patching?",
    options: [
      {
        label: "A",
        text: "Temporal provides automatic horizontal scaling that the single-server approach can never achieve, so it's needed for throughput.",
      },
      {
        label: "B",
        text: "Every reliability patch (checkpointing, compensation, crash recovery, work claiming) is independently re-inventing what Temporal provides as a unified, tested framework — and the interleaving of infrastructure concerns with business logic makes each patch increasingly fragile.",
      },
      {
        label: "C",
        text: "Temporal uses event sourcing internally, which provides better audit trails than any custom solution could achieve.",
      },
      {
        label: "D",
        text: "The single-server approach requires a message queue for callbacks, while Temporal eliminates the need for any messaging infrastructure entirely.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content's key insight is that patching single-server orchestration leads to interweaving 'system-level concerns (crashes, retries, failures) with business-level concerns (what happens if we can't find the item?)' — and that 'each of these things makes the system more complex and brittle.' The strongest argument isn't about any single capability (scaling, audit trails, or messaging) but that you're manually rebuilding a workflow engine piece by piece, and each piece interacts with every other piece in complex ways. Temporal provides all of these as a cohesive, battle-tested system. Option D is misleading — Temporal still needs infrastructure (history database, worker pools).",
    interviewScript:
      "In your interview, say: 'The issue isn't any single reliability gap — it's that we're incrementally building a workflow engine. Each patch (checkpointing, compensation, crash recovery) interacts with every other patch, and we're mixing infrastructure concerns with business logic. Temporal gives us all of these as a unified, tested framework, letting us write business logic that reads like business requirements.'",
    proTip:
      "This is a cross-cutting argument the content makes: workflow engines let you 'write business logic that reads like business requirements, not infrastructure gymnastics.' Lead with this in interviews.",
  },
  {
    id: "q6",
    subtopic: "Event Sourcing",
    question:
      "You're designing an order fulfillment system using event sourcing with Kafka as the durable log. The payment worker consumes 'OrderPlaced' events, calls the payment service, and emits 'PaymentCharged' or 'PaymentFailed.' During a load spike, the payment worker's consumer group rebalances and a partition is reassigned. What's the most dangerous consequence specific to the event sourcing pattern?",
    options: [
      {
        label: "A",
        text: "The new consumer may re-process events that the previous consumer had already acted on but hadn't committed offsets for, causing duplicate payment charges if the payment activity isn't idempotent.",
      },
      {
        label: "B",
        text: "The rebalance causes a temporary pause in event consumption, increasing end-to-end latency for in-flight orders beyond SLA thresholds.",
      },
      {
        label: "C",
        text: "Events emitted by the old consumer during rebalance may be written to the wrong partition, breaking ordering guarantees for affected orders.",
      },
      {
        label: "D",
        text: "The consumer group loses its position in the log and must replay from the beginning, causing a thundering herd of duplicate events.",
      },
    ],
    correctIndex: 0,
    explanation:
      "In event sourcing with Kafka, consumer rebalancing creates a window where events may be re-processed. If the payment worker processed an 'OrderPlaced' event and called the payment service, but the offset commit hadn't been flushed before the rebalance, the new consumer will re-process that event and charge payment again. This is the most dangerous because it has direct financial impact. Option B describes a real but less critical issue. Option C is incorrect — producers control partition assignment, not consumers. Option D is wrong — consumer groups track offsets and resume from the last committed position, not the beginning.",
    interviewScript:
      "In your interview, say: 'The danger with event sourcing over Kafka is the gap between processing an event with an external side effect and committing the offset. During consumer rebalances, this gap can cause duplicate processing. This is why every worker in an event-sourced system must be idempotent — especially for financial operations.'",
    proTip:
      "This connects to the idempotency discussion in the content — even in event sourcing architectures (not just workflow engines), making activities idempotent is essential for safety.",
  },
  {
    id: "q7",
    subtopic: "Event Sourcing",
    question:
      "Your team's event-sourced order system has been in production for 6 months. An oncall engineer gets paged because 50 orders are stuck in 'PaymentCharged' state with no subsequent 'InventoryReserved' or 'InventoryFailed' events. The inventory worker logs show it's healthy and consuming events. What's the MOST LIKELY cause that's specific to event sourcing architectures?",
    options: [
      {
        label: "A",
        text: "The inventory worker is subscribed to the wrong Kafka topic or consumer group, so it's consuming events but not the 'PaymentCharged' events it needs.",
      },
      {
        label: "B",
        text: "There's no worker pool configured to consume 'PaymentCharged' events — the inventory worker only consumes 'OrderPlaced' events and a missing worker was never deployed.",
      },
      {
        label: "C",
        text: "The payment worker is emitting 'PaymentCharged' events to a different partition than the inventory worker is consuming from.",
      },
      {
        label: "D",
        text: "The inventory worker is consuming and processing the events, but crashing before it can emit the resulting events, creating a silent failure loop.",
      },
    ],
    correctIndex: 1,
    explanation:
      "This is a gotcha the content explicitly warns about: 'Why was there no worker pool to pick up this particular PaymentFailed event?' In event sourcing, the workflow is implicitly defined by the pattern in which workers consume from various topics. If a worker pool for a specific event type was never deployed or was accidentally removed during a deployment, events accumulate with no consumer. The system appears healthy because all existing workers are running fine — the problem is a missing worker. This is fundamentally harder to detect than explicit workflow failures. Options A and C describe configuration errors that would typically be caught during testing. Option D would show errors in logs.",
    interviewScript:
      "In your interview, say: 'This is one of the key debugging challenges with event sourcing the content highlights — the workflow is implicit in the worker topology. A missing worker pool means events pile up silently with no consumer, and standard health checks on existing workers won't catch it. This is why the content notes that monitoring event-sourced systems is significantly more complex.'",
    proTip:
      "This exact debugging challenge is why the content says 'thousands of redundant internal tools have been built' for event-sourced systems — and why workflow engines with explicit flow definitions are often preferred.",
  },
  {
    id: "q8",
    subtopic: "Event Sourcing",
    question:
      "An interviewer asks you to compare the observability characteristics of event sourcing versus durable execution engines like Temporal. Which statement most accurately captures the key difference?",
    options: [
      {
        label: "A",
        text: "Event sourcing provides a complete audit trail of all events, while Temporal only stores the most recent workflow state, making event sourcing superior for debugging.",
      },
      {
        label: "B",
        text: "Both provide complete audit trails, but in event sourcing the workflow is implicit in the event chain across topics, requiring lineage tracing tools to reconstruct — while in Temporal the workflow is an explicit code artifact with a single history log per execution.",
      },
      {
        label: "C",
        text: "Temporal provides built-in metrics and dashboards while event sourcing requires custom monitoring, making Temporal strictly superior for observability.",
      },
      {
        label: "D",
        text: "Event sourcing allows replaying events to reproduce any historical state, while Temporal's replay-based recovery means you can only inspect the current state of running workflows.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content draws a clear distinction: in event sourcing, the workflow is 'implicitly defined by the pattern in which workers consume from various topics,' making debugging require lineage tracing across multiple topics and workers. The content asks 'What was the lineage of events that led to this InventoryReserved event?' as an example of the debugging complexity. In Temporal, the workflow is explicitly defined in code and each execution has a complete history in one place. Both approaches provide audit trails (the content lists 'Complete audit trail of all events' as a benefit of event sourcing), but the structure of that trail differs fundamentally.",
    interviewScript:
      "In your interview, say: 'Both give you audit trails, but the shape is different. In event sourcing, the workflow is implicit — you need lineage tracing tools to reconstruct which events led to a given state across topics. In Temporal, each workflow execution is an explicit code path with a single history, making it much easier to answer questions about what happened and why.'",
    proTip: null,
  },
  {
    id: "q9",
    subtopic: "Event Sourcing",
    question:
      "You're evaluating whether to migrate from a Kafka-based event sourcing architecture to Temporal for your order processing system. The system currently handles 10,000 orders/hour across 15 worker types consuming from 8 Kafka topics. Which factor is MOST important in deciding whether the migration is justified?",
    options: [
      {
        label: "A",
        text: "Whether the team has more operational experience with Kafka or Temporal — the infrastructure management burden is similar for both, so team familiarity dominates.",
      },
      {
        label: "B",
        text: "Whether the debugging and operational costs of the implicit event-chain workflow exceed the migration cost and operational complexity of adding Temporal as a new distributed system dependency.",
      },
      {
        label: "C",
        text: "Whether the current Kafka cluster can handle the throughput — if it can, there's no reason to migrate since both architectures provide the same reliability guarantees.",
      },
      {
        label: "D",
        text: "Whether the business logic requires conditional branching — event sourcing handles linear workflows well, but only Temporal can express conditional logic efficiently.",
      },
    ],
    correctIndex: 1,
    explanation:
      "This is a cross-subtopic bridge question connecting event sourcing and durable execution. The content acknowledges that event sourcing provides fault tolerance, scalability, observability, and flexibility — but notes 'you're building significant infrastructure to make it work' and that 'monitoring and debugging this system can be significantly more complex.' The decision hinges on whether the operational pain of implicit workflows justifies adding another distributed system (Temporal). Option A underestimates the architectural differences. Option C ignores the debugging and operational differences. Option D is wrong — event sourcing can handle conditional logic through different event types and workers.",
    interviewScript:
      "In your interview, say: 'The decision isn't about capability — both architectures can solve the problem. It's about operational cost. If we're spending significant engineering time debugging implicit event chains and building custom tooling for lineage tracing, that cost may exceed the one-time migration effort and ongoing Temporal operational overhead.'",
    proTip: null,
  },
  {
    id: "q10",
    subtopic: "Durable Execution Engines",
    question:
      "A developer new to Temporal writes a workflow that uses `Date.now()` to generate a timestamp for an audit log entry, and `Math.random()` to generate a transaction ID. The workflow runs successfully the first time. Two days later, the Temporal worker restarts and the workflow is replayed. What happens?",
    options: [
      {
        label: "A",
        text: "The replay fails with a non-determinism error because `Date.now()` and `Math.random()` produce different values on replay than during the original execution, violating Temporal's deterministic execution requirement.",
      },
      {
        label: "B",
        text: "The replay succeeds because Temporal intercepts `Date.now()` and `Math.random()` calls, returning the same values recorded during the original execution.",
      },
      {
        label: "C",
        text: "The replay succeeds but produces incorrect audit log entries and transaction IDs because the replayed values differ from the originals.",
      },
      {
        label: "D",
        text: "The replay is skipped entirely because the workflow had already completed all its activities before the restart.",
      },
    ],
    correctIndex: 0,
    explanation:
      "The content states that 'Temporal runs workflow code in a special environment that guarantees deterministic execution: timestamps are fixed, random numbers are deterministic.' This means Temporal provides its own deterministic versions of these operations. However, if a developer bypasses Temporal's APIs and calls `Date.now()` or `Math.random()` directly, the replay will produce different values, causing the workflow to make different decisions than the original execution. Temporal detects this divergence and throws a non-determinism error. Option B would only be true if the developer used Temporal's provided time/random APIs. Option C is wrong because Temporal catches the divergence rather than silently producing wrong results.",
    interviewScript:
      "In your interview, say: 'Temporal requires workflow code to be deterministic — given the same inputs and history, it must make the same decisions. Temporal provides deterministic versions of time, random, and other non-deterministic operations. Using native language equivalents directly breaks replay and Temporal will flag it as a non-determinism error. This is a key constraint developers must internalize.'",
    proTip:
      "In a real Temporal project, linting rules are often set up to catch direct calls to Date.now(), Math.random(), and setTimeout in workflow code. Mention this in interviews to show production experience.",
  },
  {
    id: "q11",
    subtopic: "Durable Execution Engines",
    question:
      "In Temporal, a workflow calls `processPayment(order)` as an activity with `maximumAttempts: 3`. The activity successfully charges the payment on the first attempt and returns a result. But the worker running the activity crashes before it can report the result back to the Temporal server. What happens next?",
    options: [
      {
        label: "A",
        text: "The Temporal server detects the worker failure and retries the activity on another worker, potentially causing a double charge because the payment service already processed the first attempt.",
      },
      {
        label: "B",
        text: "The workflow fails permanently because the activity result was lost and cannot be recovered.",
      },
      {
        label: "C",
        text: "The Temporal server waits for the `startToCloseTimeout` to expire, then schedules the activity on a different worker — which may double-charge unless the activity is idempotent.",
      },
      {
        label: "D",
        text: "Temporal automatically detects the duplicate and deduplicates the payment using the workflow execution ID as an idempotency key.",
      },
    ],
    correctIndex: 2,
    explanation:
      "The content explicitly addresses this: 'If the activity finishes successfully, but fails to \"ack\" to the workflow engine, the workflow engine will retry the activity. This might be a bad thing if the activity is a refund or an email send.' Temporal uses the startToCloseTimeout to detect unresponsive workers — when it expires without receiving a result, Temporal schedules the activity on another worker. This creates a potential double-charge. Option A is partially right but doesn't mention the timeout mechanism. Option D is wrong — Temporal does NOT automatically make activities idempotent. The content says 'The solution is to make the activity idempotent' — this is the developer's responsibility.",
    interviewScript:
      "In your interview, say: 'This is the exact scenario the content warns about. Temporal guarantees activities won't be retried after a successful ack, but if the worker dies before acking, Temporal will retry after the timeout expires. For operations with external side effects like payments, the activity MUST be idempotent — typically using an idempotency key stored in a database.'",
    proTip:
      "Always mention idempotency keys when discussing payment activities in Temporal. It shows you understand the 'exactly-once for a specific definition of run' nuance.",
  },
  {
    id: "q12",
    subtopic: "Durable Execution Engines",
    question:
      "A Temporal workflow has completed 500 activity invocations over 3 weeks. A new worker picks up this workflow after a restart. What computational cost does the worker incur before it can execute the next activity?",
    options: [
      {
        label: "A",
        text: "The worker reads only the last checkpoint from the history database and resumes from there, incurring minimal cost regardless of history length.",
      },
      {
        label: "B",
        text: "The worker replays the entire workflow from the beginning, executing the workflow code against 500 recorded activity results from the history database, using stored results instead of re-running activities.",
      },
      {
        label: "C",
        text: "The worker downloads the full history but only replays from the most recent signal or timer event, using a partial replay optimization.",
      },
      {
        label: "D",
        text: "The worker re-executes all 500 activities against the original services to verify the stored results haven't become stale, then resumes.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content describes this mechanism: 'When a worker crashes, the workflow is replayed from the beginning, using the results in the history of previous activity invocations instead of re-running the activities.' This means the worker must execute the entire workflow function, but at each activity call point, it reads the stored result from the history rather than making an actual service call. For 500 activities, this replay can be computationally significant — which is exactly why the content discusses state size management. Option A describes what you might want but not how Temporal works. Option D is wrong — activities are never re-executed during replay.",
    interviewScript:
      "In your interview, say: 'Temporal replays the entire workflow from the beginning on recovery. It executes the workflow code but substitutes stored history results at each activity call point. This means long-running workflows with large histories have a significant replay cost, which is why we need strategies like periodic workflow recreation to keep histories manageable.'",
    proTip:
      "This is a gotcha — many candidates assume Temporal uses checkpointing like a database. The full-replay model is why state size management is a common deep-dive topic.",
  },
  {
    id: "q13",
    subtopic: "Durable Execution Engines",
    question:
      "An interviewer asks you to describe the deployment architecture of Temporal and explain which component is the most critical single point of failure. What's the correct assessment?",
    options: [
      {
        label: "A",
        text: "The worker pools are the most critical — if all workflow workers go down, no workflows can make progress. The Temporal server and history database can be independently scaled and replicated.",
      },
      {
        label: "B",
        text: "The history database is the most critical — it's the append-only log of all workflow decisions and activity results. If it's lost, all in-flight workflows lose their state and cannot be recovered.",
      },
      {
        label: "C",
        text: "The Temporal server is the most critical — it's the centralized orchestration that tracks state and manages execution. Without it, workers cannot receive tasks or report results.",
      },
      {
        label: "D",
        text: "None of these is a single point of failure because Temporal is designed with full redundancy across all components — the real concern is network partitions between components.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content describes three components: 'Temporal Server: Centralized orchestration that tracks state and manages execution,' 'History Database: Append-only log of all workflow decisions and activity results,' and 'Worker Pools: Separate pools for workflow orchestration and activity execution.' While the Temporal server and workers can be replicated and restarted (workers are stateless, and the Temporal server can be run as a cluster), the history database contains the irreplaceable state of all workflows. If the history database is lost, workflows cannot be replayed or recovered. Option A is wrong because workers are stateless and replaceable. Option C overlooks that the Temporal server can be clustered. Option D is overly optimistic.",
    interviewScript:
      "In your interview, say: 'The Temporal deployment has three key components: the Temporal server cluster, the history database, and worker pools. Workers are stateless and replaceable. The Temporal server can be clustered. But the history database is the source of truth for all workflow state — it must be highly available and durable, typically backed by Cassandra or MySQL with replication.'",
    proTip: null,
  },
  {
    id: "q14",
    subtopic: "Managed Workflow Systems",
    question:
      "Your team is debating between Temporal (code-driven) and AWS Step Functions (declarative JSON) for a new workflow system. The workflows involve complex conditional branching with 12 distinct paths based on customer tier, payment method, and shipping region. Which assessment of the tradeoff is most accurate?",
    options: [
      {
        label: "A",
        text: "Step Functions' visual state machine diagrams make the 12-path branching easier to understand and maintain, outweighing any expressiveness limitations.",
      },
      {
        label: "B",
        text: "Temporal's code-driven approach handles complex branching naturally with standard programming constructs, while Step Functions' declarative JSON becomes unwieldy — but Step Functions eliminates operational overhead of running Temporal clusters.",
      },
      {
        label: "C",
        text: "Both handle complex branching equally well — the real difference is that Temporal supports longer-running workflows while Step Functions has a 1-year maximum execution duration.",
      },
      {
        label: "D",
        text: "Temporal is always the better choice for complex workflows because Step Functions can't express conditional logic without custom Lambda functions for every decision.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content notes that declarative workflows have 'the ability to visualize workflows as diagrams which means a much nicer UI' but 'comes with its own set of drawbacks in terms of expressiveness — you may find yourself creating a lot of custom code to fit into the declarative model.' For 12 distinct branching paths, declarative JSON becomes extremely verbose and hard to maintain, while code handles this naturally with if/else and switch statements. However, Step Functions is serverless — you don't need to run clusters. The content also acknowledges 'the decision to use a declarative workflow system versus a more code-driven approach depends largely on the preferences of the team.' Option D is too absolute.",
    interviewScript:
      "In your interview, say: 'For complex branching, code-driven approaches like Temporal are more natural — you use standard programming constructs instead of verbose JSON state machines. But Step Functions eliminates the operational cost of running Temporal infrastructure. The tradeoff is expressiveness versus operational simplicity.'",
    proTip: null,
  },
  {
    id: "q15",
    subtopic: "Managed Workflow Systems",
    question:
      "You're designing a loan approval workflow on AWS that involves waiting for document submissions (up to 90 days), running credit checks, getting underwriter approval, and coordinating with multiple third-party verification services. A colleague suggests AWS Step Functions. What specific limitation could be a problem?",
    options: [
      {
        label: "A",
        text: "Step Functions has a 256KB state size limit, and accumulating document metadata, verification results, and audit data across a 90-day workflow could exceed this, requiring external state management that defeats the purpose of the managed service.",
      },
      {
        label: "B",
        text: "Step Functions doesn't support waiting for external events, so you can't pause the workflow while waiting for document submissions.",
      },
      {
        label: "C",
        text: "Step Functions can only invoke Lambda functions, and the credit check and third-party verification services require direct HTTP calls.",
      },
      {
        label: "D",
        text: "Step Functions' maximum execution duration of 1 year isn't long enough for loan workflows that might extend beyond that due to regulatory holds.",
      },
    ],
    correctIndex: 0,
    explanation:
      "The content explicitly states Step Functions has 'limitations on execution duration (1 year max) and state size (256KB).' For a loan approval workflow accumulating data over 90 days — document metadata, multiple verification results, credit check reports, underwriter notes, and audit trails — the 256KB state size limit is the most likely constraint to hit. Option B is wrong — Step Functions supports waiting via callback tasks. Option C is wrong — Step Functions can make HTTP calls via API Gateway integrations. Option D's 1-year limit is unlikely to be hit for a 90-day workflow.",
    interviewScript:
      "In your interview, say: 'The 256KB state size limit in Step Functions is the key constraint here. Over a 90-day loan workflow, we'd accumulate document metadata, verification results, credit data, and audit entries. We'd likely need to offload state to DynamoDB and pass only references, which adds complexity and partially negates the managed service benefits.'",
    proTip:
      "When discussing Step Functions in interviews, always mention both limitations: 256KB state size AND 1-year max duration. This shows you know the concrete constraints, not just abstract tradeoffs.",
  },
  {
    id: "q16",
    subtopic: "Managed Workflow Systems",
    question:
      "An interviewer asks: 'Why wouldn't you use Apache Airflow for an event-driven order fulfillment workflow that needs to react to real-time events like payment confirmations and inventory updates?' What's the most technically precise answer?",
    options: [
      {
        label: "A",
        text: "Airflow can handle event-driven workflows through sensor operators that poll for events, making it suitable for order fulfillment with appropriate configuration.",
      },
      {
        label: "B",
        text: "Airflow was designed for scheduled batch workflows and DAGs, not event-driven, long-running processes — it lacks efficient signal/event handling and would require polling-based workarounds that waste resources and add latency.",
      },
      {
        label: "C",
        text: "Airflow doesn't support conditional branching in workflows, which is required for handling payment success/failure paths.",
      },
      {
        label: "D",
        text: "Airflow uses Python exclusively, which limits integration with services written in other languages like Java or Go.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly states: 'Apache Airflow excels at scheduled batch workflows but wasn't designed for event-driven, long-running processes. It's great for ETL and data pipelines, less suitable for user-facing workflows.' Airflow's DAG-based model is inherently schedule-driven — while sensor operators exist, they're polling-based and consume worker slots while waiting. For real-time event processing like payment confirmations, this wastes resources and adds unacceptable latency compared to signal-based approaches in Temporal or event-driven Step Functions. Option A downplays the fundamental mismatch. Option C is wrong — Airflow supports branching. Option D is inaccurate.",
    interviewScript:
      "In your interview, say: 'Airflow is purpose-built for scheduled batch workflows like ETL pipelines. For event-driven order fulfillment, we need efficient signal handling where the workflow suspends without consuming resources. Airflow's sensor operators would poll, wasting worker slots and adding latency. Temporal or Step Functions are designed for this event-driven, long-running pattern.'",
    proTip: null,
  },
  {
    id: "q17",
    subtopic: "When to Use Workflows",
    question:
      "You're 30 minutes into a system design interview for an e-commerce platform. You've designed the product catalog, shopping cart, and checkout API. The interviewer says: 'Now walk me through what happens after the user clicks Place Order.' What signal tells you to introduce a workflow system here rather than simple service-to-service calls?",
    options: [
      {
        label: "A",
        text: "The presence of multiple microservices — any time more than 3 services are involved, a workflow engine is needed for coordination.",
      },
      {
        label: "B",
        text: "The need for partial failure handling with compensation — if payment succeeds but inventory fails, you need to refund. The phrase 'if step X fails, we need to undo step Y' is the clearest signal for workflows.",
      },
      {
        label: "C",
        text: "The requirement for audit logging — workflow engines provide automatic audit trails that are required for financial transactions.",
      },
      {
        label: "D",
        text: "The need for horizontal scaling — workflow engines distribute work across multiple workers, which is necessary for high-throughput order processing.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'In your interview, listen for phrases like \"if step X fails, we need to undo step Y\" or \"we need to ensure all steps complete or none do.\" That's a clear signal for workflows.' For order fulfillment, the compensation requirement (refund if inventory fails after payment) is the defining signal. Option A is too rigid — many multi-service interactions work fine with simple calls. Option C is a benefit but not the primary signal. Option D describes a capability but not the trigger. The content emphasizes that workflows shine for 'partial failure handling, long-running processes, complex orchestration, or audit requirements.'",
    interviewScript:
      "In your interview, say: 'The moment I hear that payment succeeds but we might need to roll it back if downstream steps fail, that's my signal to introduce a workflow engine. We need compensation logic that's reliable across failures — exactly what workflow systems are designed for.'",
    proTip:
      "The content specifically flags Payment Systems and Human-in-the-Loop as the two most common interview scenarios for workflows. Have concrete examples ready for both.",
  },
  {
    id: "q18",
    subtopic: "When to Use Workflows",
    question:
      "You're designing a system like Uber where a rider requests a ride, a driver must accept, the driver navigates to pickup, the rider confirms pickup, and finally payment is processed at drop-off. The interviewer asks why this is a good workflow candidate. What's the strongest justification?",
    options: [
      {
        label: "A",
        text: "The workflow involves multiple API calls to different services, and a workflow engine optimizes the routing of these calls for minimal latency.",
      },
      {
        label: "B",
        text: "Each step depends on a human action that may take minutes to hours, the process must survive server restarts during these waits, and multiple failure/compensation paths exist (driver cancels, rider cancels, no drivers available).",
      },
      {
        label: "C",
        text: "The system needs to handle millions of concurrent rides, and workflow engines provide automatic sharding and load balancing that manual orchestration can't match.",
      },
      {
        label: "D",
        text: "GPS location tracking between steps requires persistent connections, which workflow engines maintain more efficiently than stateless API servers.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content identifies 'Human-in-the-Loop Workflows' as a prime workflow candidate, using Uber as the example: 'there are a bunch of places where the user is waiting on a human to complete a task. When a user requests a driver, for instance, the driver has to accept the ride.' The combination of human-timescale waits (server survival requirement), state machine complexity (multiple paths based on human decisions), and compensation logic (handling cancellations) makes this an ideal workflow candidate. Option A mischaracterizes what workflow engines optimize. Option C overstates the scaling argument. Option D conflates location tracking with workflow orchestration.",
    interviewScript:
      "In your interview, say: 'This is a textbook human-in-the-loop workflow. The process spans minutes to hours of human wait time, must survive infrastructure changes during those waits, and has multiple branching paths with compensation logic. The workflow engine handles the durability and state management so we can focus on the business logic of matching, pickup, and payment.'",
    proTip: null,
  },
  {
    id: "q19",
    subtopic: "When NOT to Use Workflows",
    question:
      "A candidate designing a photo-sharing application proposes using Temporal for their image processing pipeline: when a user uploads a photo, a workflow resizes it to 5 different sizes, applies a watermark, and stores each variant in S3. The interviewer asks: 'Is a workflow engine the right tool here?' What's the best assessment?",
    options: [
      {
        label: "A",
        text: "Yes — the 5 resize operations can run in parallel within a Temporal workflow, and the watermark step depends on them completing, making this a good orchestration candidate.",
      },
      {
        label: "B",
        text: "No — this is simple async processing with no partial failure compensation, no long-running waits, and no complex state management. A message queue with worker consumers is sufficient and adds far less operational overhead.",
      },
      {
        label: "C",
        text: "Yes — if a resize fails, you need the workflow engine to retry it and track which sizes completed, otherwise you might serve incomplete image variants.",
      },
      {
        label: "D",
        text: "No — image processing is CPU-intensive and workflow engines add too much latency per step, making them unsuitable for media processing pipelines.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly lists this anti-pattern: 'Simple async processing — If you just need to resize an image or send an email, use a message queue. Workflows are overkill for single-step operations.' While image processing involves multiple steps (resize, watermark, store), there's no compensation logic needed (if one resize fails, you just retry it), no human waits, and no complex state. A simple message queue with retry handles this pattern perfectly. Option A overvalues the orchestration need. Option C describes a problem that message queue retries already solve. Option D's concern about latency is a red herring — the overhead is minimal per step.",
    interviewScript:
      "In your interview, say: 'This is a case where the content explicitly says workflows are overkill. Image processing is simple async work — no compensation logic, no long-running waits, no complex state. A message queue with consumer workers handles retries and parallelism just fine without the operational overhead of running a workflow engine.'",
    proTip:
      "In interviews, demonstrate maturity by starting simple. The content says: 'Only introduce workflows when you identify specific problems they solve.' Recognizing when NOT to use them is as important as knowing when to use them.",
  },
  {
    id: "q20",
    subtopic: "When NOT to Use Workflows",
    question:
      "A candidate proposes using AWS Step Functions for a real-time chat message delivery system that processes ~50,000 messages per second. Each message goes through: validation, content filtering, recipient lookup, and push notification delivery. The interviewer says: 'Walk me through the tradeoffs.' What's the most critical issue?",
    options: [
      {
        label: "A",
        text: "Step Functions' state machine definition in JSON would be too complex for the 4-step pipeline, making it unmaintainable.",
      },
      {
        label: "B",
        text: "Step Functions adds per-transition latency and cost overhead that's unjustified for high-frequency, low-value operations — at 50K messages/second, the workflow overhead dominates processing time and the cost is prohibitive.",
      },
      {
        label: "C",
        text: "Step Functions can't handle 50K executions per second due to service limits, so the system would need to batch messages, adding unacceptable latency for real-time chat.",
      },
      {
        label: "D",
        text: "The recipient lookup step requires database access that Step Functions can't provide directly, requiring an intermediate Lambda function.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content identifies two anti-patterns that apply here: 'High-frequency, low-value operations — Workflows add overhead. For millions of simple operations, the cost and complexity aren't justified' and 'Synchronous operations — If the client waits for the response, or there is a lot of sensitivity around latency, you probably don't need (or can't use) a workflow.' Chat messages are high-frequency, latency-sensitive, and each message is a low-value operation that doesn't need compensation logic. At 50K/second, Step Functions' per-transition pricing would be enormous and the added latency unacceptable. Option C conflates architectural unfitness with service limits. Option D is incorrect — Step Functions integrates with many AWS services.",
    interviewScript:
      "In your interview, say: 'This hits two anti-patterns from the workflow guidelines: high-frequency, low-value operations where the overhead isn't justified, and latency-sensitive processing where workflow overhead adds unacceptable delay. At 50K messages/second, we want a simple pipeline — probably a message queue with consumer workers — not a workflow engine.'",
    proTip: null,
  },
  {
    id: "q21",
    subtopic: "When NOT to Use Workflows",
    question:
      "In a system design interview, you've designed a social media feed service. The interviewer asks about the 'like' button — when a user likes a post, the system needs to: increment the like count, add the user to the likers list, and send a notification to the post author. A candidate says: 'I'd use a Temporal workflow for this since it involves three services and we need reliability.' What should the interviewer's concern be?",
    options: [
      {
        label: "A",
        text: "The candidate is correct — three services with notification delivery is exactly the right complexity threshold for a workflow engine.",
      },
      {
        label: "B",
        text: "The candidate should have suggested Step Functions instead of Temporal since this is a simpler workflow that benefits from a managed service.",
      },
      {
        label: "C",
        text: "This is a synchronous, high-frequency, low-value operation — the user expects near-instant feedback, the operations are simple, and the cost of a missed notification doesn't justify the overhead of a workflow engine.",
      },
      {
        label: "D",
        text: "The candidate should have proposed event sourcing instead, since the like event needs to be stored for analytics and the notification is just a side effect.",
      },
    ],
    correctIndex: 2,
    explanation:
      "The content says: 'demonstrate maturity by starting simple. Only introduce workflows when you identify specific problems they solve.' A 'like' operation is synchronous (user expects instant feedback), extremely high-frequency (potentially millions per day on a popular platform), and low-value (a missed notification is annoying but not catastrophic — no compensation logic needed). The content explicitly lists all three of these as scenarios where workflows should NOT be used. Recognizing this anti-pattern shows more interview maturity than reaching for Temporal.",
    interviewScript:
      "In your interview, say: 'I'd push back on using a workflow engine here. Likes are synchronous, high-frequency, and low-value — all three anti-patterns for workflows. I'd increment the count inline, add to the likers list, and publish a notification event to a message queue. If the notification fails, it's not worth the overhead of orchestrated retry — just retry from the queue.'",
    proTip:
      "Interviewers specifically test whether candidates can resist the temptation to use sophisticated tools for simple problems. Choosing a simple solution when it's appropriate demonstrates more maturity than always reaching for the complex tool.",
  },
  {
    id: "q22",
    subtopic: "Workflow Versioning & Migrations",
    question:
      "You have 10,000 running loan approval workflows that take an average of 2 weeks to complete. A new regulatory requirement mandates adding a sanctions screening step before final approval. You're using Temporal. How should you handle this?",
    options: [
      {
        label: "A",
        text: "Deploy the new workflow version and let Temporal automatically migrate all running workflows to include the sanctions check at their current step.",
      },
      {
        label: "B",
        text: "Use workflow versioning — deploy the new version separately so new workflows include sanctions screening, and let existing workflows complete under the old version. If immediate compliance is required, use a patch to add the step for in-progress workflows that haven't passed the patched branch.",
      },
      {
        label: "C",
        text: "Stop all 10,000 running workflows, migrate their state to the new version's schema, and restart them at their current step with the new code.",
      },
      {
        label: "D",
        text: "Add the sanctions check as a separate, independent workflow that runs in parallel with the existing loan approval workflow and blocks final approval.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content describes two approaches and when to use each. Workflow versioning is the simplest: 'Old workflows will continue to run with the old version of the code, and new workflows will run with the new version.' But if compliance demands the change take effect immediately for in-progress workflows, you use patches: the content shows using `workflow.patched('change-behavior')` where 'workflows that have passed through the patched branch before in their execution follow the legacy path. For new workflows that have yet to follow the patched branch, they follow the new path.' Option A is wrong — Temporal doesn't auto-migrate. Option C is risky and unnecessary. Option D adds unnecessary complexity.",
    interviewScript:
      "In your interview, say: 'There are two strategies here. Workflow versioning deploys a new version and lets existing workflows complete on the old version. If compliance requires immediate enforcement, we use Temporal's patch API — it lets running workflows take the new path at branches they haven't reached yet, while preserving deterministic replay for branches they've already passed.'",
    proTip: null,
  },
  {
    id: "q23",
    subtopic: "Workflow Versioning & Migrations",
    question:
      "Consider this Temporal patch code for a workflow migration:\n\n```\nif(workflow.patched('add-fraud-check')) {\n  await a.runFraudCheck(order);\n}\nawait a.processPayment(order);\n```\n\nA workflow started before this patch was deployed and has already completed `processPayment`. During replay, what happens when the workflow code reaches the patch check?",
    options: [
      {
        label: "A",
        text: "The patch evaluates to true since it's new code, so the workflow tries to run the fraud check — but this creates a non-determinism error because the original history doesn't contain a fraud check activity.",
      },
      {
        label: "B",
        text: "The patch evaluates to false for this workflow because it has already passed this point in its execution history without the patch, so it skips the fraud check and continues to replay processPayment from history.",
      },
      {
        label: "C",
        text: "The replay crashes because the workflow code no longer matches the original execution path, requiring manual intervention to fix the workflow.",
      },
      {
        label: "D",
        text: "Temporal detects the patch and automatically rolls back the workflow to before processPayment so the fraud check can run first.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explains that patches help 'the workflow system to decide deterministically whether a new path can be followed. For workflows that have passed through the patched branch before in their execution, they follow the legacy path. For new workflows that have yet to follow the patched branch, they follow the new path.' Since this workflow already passed this point (processPayment is in the history), the patch evaluates to false, and the workflow skips the fraud check. This preserves deterministic replay — the replayed execution matches the original history. New workflows that haven't reached this point yet will take the new path with the fraud check.",
    interviewScript:
      "In your interview, say: 'Temporal's patch API uses the workflow's execution history to decide which path to take. If the workflow has already passed this branch point in its history, the patch returns false — it follows the legacy path to maintain deterministic replay. Only workflows that haven't reached this branch yet take the new path with the fraud check.'",
    proTip:
      "Think of patches as git merge strategies for running code — they allow two code paths to coexist until all legacy workflows complete.",
  },
  {
    id: "q24",
    subtopic: "Workflow Versioning & Migrations",
    question:
      "You're using AWS Step Functions (declarative) for order processing and need to add a fraud detection step between payment and inventory reservation. You have 500 in-flight workflows. What's the key advantage declarative workflow systems have over durable execution engines for this specific scenario?",
    options: [
      {
        label: "A",
        text: "Declarative systems can't handle this — you'd need to wait for all 500 workflows to complete before updating the definition.",
      },
      {
        label: "B",
        text: "You can update the workflow definition in place, and as long as the state machine structure is compatible, both existing and new invocations can follow the updated path — the content notes this is simpler than code-based patching.",
      },
      {
        label: "C",
        text: "Declarative systems automatically migrate all in-flight workflows to the new version by replaying them from the beginning.",
      },
      {
        label: "D",
        text: "Step Functions provides a built-in A/B testing framework that lets you route a percentage of workflows to the new version.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'With declarative workflow systems, you can simply update the workflow definition in place. As long as you don't have complex branching or looping logic, both new and existing invocations can follow the new path.' This is simpler than the patch-based approach needed for durable execution engines. Adding a step between two existing steps in a state machine is structurally compatible — existing workflows at the payment stage will see the new fraud detection step as their next state. Option A is incorrect. Option C is wrong — they don't replay from the beginning. Option D doesn't exist.",
    interviewScript:
      "In your interview, say: 'This is where declarative workflow systems have an edge. We can update the state machine definition in place, and in-flight workflows that haven't reached the insertion point will naturally follow the new path through the fraud detection step. With code-based engines like Temporal, we'd need explicit patch logic to handle this migration.'",
    proTip: null,
  },
  {
    id: "q25",
    subtopic: "Workflow State Size Management",
    question:
      "A Temporal workflow processing insurance claims has been running for 6 months with 15,000 activity invocations. Worker startup times have degraded to 45 seconds per workflow replay. The team wants to fix this without losing the ability to audit historical activity results. What's the recommended approach?",
    options: [
      {
        label: "A",
        text: "Increase the Temporal history database's read throughput by adding replicas, since the bottleneck is database read speed during replay.",
      },
      {
        label: "B",
        text: "Periodically recreate the workflow by spawning a new workflow instance with only the current state as input, allowing the old workflow to complete and be archived for audit purposes while the new one continues with a fresh, small history.",
      },
      {
        label: "C",
        text: "Configure Temporal to use incremental checkpointing instead of full replay, so workers only replay from the last checkpoint instead of the beginning.",
      },
      {
        label: "D",
        text: "Compress the workflow history using Temporal's built-in history compression feature to reduce the amount of data replayed on recovery.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content directly addresses this: 'we can keep our workflows lean by periodically recreating them. If you have a long-running workflow with lots of history, you can periodically recreate the workflow from the beginning, passing only the required inputs to the new workflow to keep going.' The old workflow completes and its history remains available for audit. The new workflow starts with a clean history. This is the standard Temporal pattern for long-running workflows called 'continue-as-new.' Option A addresses symptoms, not the root cause. Options C and D describe features that don't exist in Temporal — replay is always from the beginning.",
    interviewScript:
      "In your interview, say: 'The standard pattern is to periodically recreate the workflow — called continue-as-new in Temporal. We spawn a new workflow with just the current state as input, the old workflow completes with its full history preserved for audit, and the new one starts fresh. This keeps replay times bounded regardless of how long the business process runs.'",
    proTip:
      "Mention 'continue-as-new' by name in interviews — it shows you've actually worked with or deeply studied Temporal, not just read about it conceptually.",
  },
  {
    id: "q26",
    subtopic: "Workflow State Size Management",
    question:
      "A team is passing full order objects (including product images as base64 strings) as activity inputs and outputs in their Temporal workflows. Each activity result averages 2MB. After 50 activities, the workflow history is 100MB. An architect proposes two fixes: (1) pass only order IDs and look up details from a database in each activity, and (2) use the workflow versioning patch to migrate existing workflows to the new pattern. What's wrong with fix (2)?",
    options: [
      {
        label: "A",
        text: "Workflow patches can't change the schema of activity inputs/outputs — they can only add or remove entire activity steps.",
      },
      {
        label: "B",
        text: "Existing workflows must replay their full 100MB history to reach the patched code, and the patch only affects future activities — the already-recorded 100MB of history doesn't shrink, so the replay performance problem persists for in-flight workflows.",
      },
      {
        label: "C",
        text: "Patching activity input schemas would cause a non-determinism error because the replayed activity calls would have different input shapes than the recorded history.",
      },
      {
        label: "D",
        text: "Workflow versioning is only supported for workflow logic changes, not for activity interface changes, so this would require creating an entirely new activity type.",
      },
    ],
    correctIndex: 1,
    explanation:
      "This is a cross-subtopic question connecting versioning with state size management. The key insight is that patches affect future execution paths but don't retroactively modify existing history. Even if new activities use small ID-only inputs, the workflow's history still contains the original 100MB of large activity results. During replay, the worker must still download and process this entire history. The correct approach for existing workflows is 'continue-as-new' (recreation) — which starts a fresh workflow with a clean history. Option C is wrong because activities with different input patterns wouldn't cause replay issues if they're in the new branch of a patch.",
    interviewScript:
      "In your interview, say: 'Patching only helps future activities — the existing 100MB history doesn't shrink. For in-flight workflows with bloated histories, the right tool is continue-as-new, which recreates the workflow with a fresh history. The patch approach should be combined with continue-as-new: patch to fix the data pattern for new activities, then recreate to shed the historical bloat.'",
    proTip: null,
  },
  {
    id: "q27",
    subtopic: "External Events & Signals",
    question:
      "You're designing a document signing workflow where a customer might take 5 minutes or 30 days to sign. The workflow must send reminders at day 7 and day 14 if unsigned, and cancel the request after 30 days. An engineer suggests polling a database every minute to check if the document has been signed. Why is the signal-based approach superior?",
    options: [
      {
        label: "A",
        text: "Signals are delivered with lower latency than polling intervals, reducing the time between the customer signing and the workflow proceeding.",
      },
      {
        label: "B",
        text: "The workflow suspends efficiently when waiting for a signal — no polling, no resource consumption, no database load. The workflow engine handles timer-based wakeups for reminders without the workflow consuming worker capacity during the 30-day wait period.",
      },
      {
        label: "C",
        text: "Polling creates lock contention on the database record, while signals use an event-driven architecture that avoids database bottlenecks.",
      },
      {
        label: "D",
        text: "Signals support exactly-once delivery semantics while database polling can miss updates due to race conditions.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explains this directly: 'The workflow suspends efficiently — no polling, no resource consumption.' When a workflow waits for a signal, it's not consuming a worker thread or making database queries. The workflow engine tracks the pending signal and timer internally. For a 30-day wait, polling every minute would mean 43,200 database reads per workflow — multiplied across thousands of pending documents, this creates significant unnecessary load. The signal approach wakes the workflow only when the event arrives or a timer fires for reminders. Option A is partially correct but misses the core benefit. Option D overstates signal delivery guarantees.",
    interviewScript:
      "In your interview, say: 'Signals are fundamentally more efficient than polling for human-timescale waits. The workflow suspends without consuming any resources — no worker threads, no database polls. For a 30-day signing window, that's the difference between zero resource consumption and 43,000 polling queries per workflow. The engine handles timer-based wakeups for reminders natively.'",
    proTip: null,
  },
  {
    id: "q28",
    subtopic: "External Events & Signals",
    question:
      "Your document signing workflow uses signals with a 30-day timeout. The customer signs the document on day 15, and the external signing service sends the signal to the Temporal workflow. But the signal arrives while the worker processing this workflow is being deployed (rolling restart). What happens to the signal?",
    options: [
      {
        label: "A",
        text: "The signal is lost because the target worker is down, and the external system would need to implement retry logic to redeliver it.",
      },
      {
        label: "B",
        text: "The signal is delivered to the Temporal server (not directly to the worker) and persisted in the workflow's history. When a worker picks up the workflow, it replays the history including the signal and continues execution.",
      },
      {
        label: "C",
        text: "The signal is queued in the Temporal server's memory and delivered to the worker after deployment completes, but if the server also restarts, the signal is lost.",
      },
      {
        label: "D",
        text: "Temporal detects the worker is unavailable and routes the signal to a different worker pool that can process it immediately.",
      },
    ],
    correctIndex: 1,
    explanation:
      "Signals in Temporal are sent to the Temporal server, not directly to workers. The server persists the signal in the workflow's history database. Workers are stateless executors — they pick up workflows from the task queue and replay the history, which includes any signals that arrived. This is the same mechanism that makes Temporal durable: all state changes (including signals) are persisted in the history before being processed. Option A is wrong because signals don't go directly to workers. Option C incorrectly suggests signal persistence depends on Temporal server memory. Option D describes a different mechanism.",
    interviewScript:
      "In your interview, say: 'Signals are durable because they go through the Temporal server and are persisted in the workflow history, not sent directly to workers. Workers are stateless — they replay the full history including signals. This means signals survive worker deployments, crashes, and scaling events, which is critical for workflows waiting on human actions.'",
    proTip:
      "This durability model is what the content means when it says workflow engines provide 'more efficient and lower-latency than polling' — the efficiency comes from the signal being durably stored and the workflow being woken up only when needed.",
  },
  {
    id: "q29",
    subtopic: "Idempotency / Exactly-Once",
    question:
      "A Temporal activity sends a refund to a customer via a payment gateway. The activity succeeds, but the worker crashes before acknowledging the result to Temporal. Temporal retries the activity on a new worker. The developer didn't implement idempotency. What's the customer experience?",
    options: [
      {
        label: "A",
        text: "The customer receives a single refund because Temporal's exactly-once guarantee prevents the duplicate from reaching the payment gateway.",
      },
      {
        label: "B",
        text: "The customer receives two refunds because Temporal retries the full activity execution, which calls the payment gateway again without an idempotency key to deduplicate.",
      },
      {
        label: "C",
        text: "The customer receives no refund because Temporal detects the crashed worker's partial result and rolls back the transaction.",
      },
      {
        label: "D",
        text: "The activity retry fails with a duplicate transaction error from the payment gateway, and Temporal marks the activity as permanently failed.",
      },
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly warns: 'If the activity finishes successfully, but fails to \"ack\" to the workflow engine, the workflow engine will retry the activity. This might be a bad thing if the activity is a refund or an email send.' Temporal's 'exactly-once' is specifically about not re-running activities that have been successfully acknowledged — it provides no protection for the case where the ack fails. Without idempotency keys, the retry calls the payment gateway again, and the customer gets two refunds. Option A is wrong — Temporal does NOT provide end-to-end exactly-once. Option D assumes the gateway rejects duplicates, which can't be relied on without explicit idempotency keys.",
    interviewScript:
      "In your interview, say: 'This is the exact scenario the content warns about. Temporal guarantees exactly-once for a very specific definition: it won't retry after a successful ack. But if the ack fails, the activity reruns. For irreversible operations like refunds, we MUST implement idempotency — typically by storing an idempotency key in a database before making the payment call and checking it on retry.'",
    proTip: null,
  },
  {
    id: "q30",
    subtopic: "Idempotency / Exactly-Once",
    question:
      "A workflow waits for a 'document_signed' signal and then runs a `process_signature_activity` that sends a legal confirmation email. Due to a network partition, the external signing service sends the same signal twice — once during the partition and once after recovery. What happens, and is idempotency protection needed at the activity level?",
    options: [
      {
        label: "A",
        text: "Temporal deduplicates signals by default, so the workflow only receives one signal and processes the signature once. No activity-level idempotency needed.",
      },
      {
        label: "B",
        text: "The workflow receives both signals, but since it's already past the wait point after the first signal, the second signal is buffered but never consumed. No duplicate email is sent.",
      },
      {
        label: "C",
        text: "The workflow receives both signals and processes the signature twice, sending two legal confirmation emails unless the activity implements idempotency.",
      },
      {
        label: "D",
        text: "The second signal causes the workflow to restart from the signal wait point, re-executing all subsequent activities unless each implements idempotency.",
      },
    ],
    correctIndex: 1,
    explanation:
      "This is a gotcha that connects signals with exactly-once semantics. In Temporal, when a workflow is waiting for a signal with `wait_for_signal`, the first signal unblocks the workflow and it continues execution. A duplicate signal arriving after the workflow has moved past the wait point doesn't retroactively re-trigger the wait. The signal is delivered to the workflow but since there's no pending wait for it, it's buffered (or ignored depending on implementation). The workflow has already moved on to process_signature_activity and beyond. This is different from activity idempotency — the protection here comes from the workflow's linear execution model, not from activity-level deduplication.",
    interviewScript:
      "In your interview, say: 'The workflow's linear execution model protects us here. Once the first signal unblocks the wait and execution continues, a duplicate signal doesn't re-trigger the wait or re-execute subsequent activities. The workflow has moved past that point. However, I'd still implement signal deduplication as a defense-in-depth measure, especially for workflows with multiple signal wait points.'",
    proTip:
      "This is a cross-subtopic bridge between signals and idempotency. Interviewers love to probe whether candidates understand which layer provides the protection — the workflow execution model or the activity implementation.",
  },
  {
    id: "q31",
    subtopic: "Idempotency / Exactly-Once",
    question:
      "You're implementing idempotency for a payment activity in Temporal. The activity stores an idempotency key in a database before calling the payment gateway. The sequence is: (1) check if key exists, (2) if not, insert key, (3) call payment gateway, (4) update key with result. A race condition in step 1-2 allows two concurrent retries to both see 'key not found' and both insert. How do you fix this while maintaining exactly-once payment processing?",
    options: [
      {
        label: "A",
        text: "Use the database's UNIQUE constraint on the idempotency key column so only one insert succeeds. The second concurrent retry receives a constraint violation, catches it, and reads the result from the first execution.",
      },
      {
        label: "B",
        text: "Add a distributed lock (e.g., Redis SETNX) before the check-and-insert to serialize concurrent retries.",
      },
      {
        label: "C",
        text: "Use Temporal's built-in activity deduplication feature which prevents concurrent executions of the same activity.",
      },
      {
        label: "D",
        text: "Add a delay between step 1 and step 2 to reduce the probability of the race condition to an acceptable level.",
      },
    ],
    correctIndex: 0,
    explanation:
      "The content describes the idempotency pattern: 'Storing off a key to a database (e.g. the idempotency key of the email) and then checking if it exists before performing the irreversible action.' The race condition is a classic check-then-act problem. The database UNIQUE constraint makes the insert atomic — only one can succeed, and the loser gets a constraint violation that it can handle by reading the winner's result. Option B adds unnecessary complexity and another distributed system dependency. Option C doesn't exist — Temporal can have concurrent retries if the first attempt's ack fails. Option D is never an acceptable solution to race conditions.",
    interviewScript:
      "In your interview, say: 'The UNIQUE constraint makes this atomic at the database level. Only one insert succeeds — the concurrent retry gets a constraint violation, catches it, and reads the result from the successful execution. This is the standard idempotency implementation pattern: use the database's atomicity guarantees rather than application-level locking.'",
    proTip:
      "This crosses idempotency and compensation logic — if you're implementing idempotent activities for financial operations, always think about the concurrent retry case, not just the sequential retry case.",
  },
  {
    id: "q32",
    subtopic: "Compensation Logic",
    question:
      "In your e-commerce workflow, payment succeeds but inventory reservation fails because the item went out of stock. Your compensation logic issues a refund. But the refund activity fails on the first attempt due to a payment gateway timeout. Temporal retries, and the refund succeeds on the second attempt. The customer then complains they were charged but never refunded. Investigation shows the first refund attempt actually succeeded at the gateway despite the timeout. What went wrong and how should you fix the design?",
    options: [
      {
        label: "A",
        text: "The refund activity wasn't idempotent — the first call succeeded at the gateway but timed out, so Temporal retried and issued a second refund. The fix is to use an idempotency key with the payment gateway so retries don't create duplicate refunds.",
      },
      {
        label: "B",
        text: "Temporal should have detected the duplicate refund by checking the payment gateway's transaction history before retrying.",
      },
      {
        label: "C",
        text: "The compensation logic should use a separate workflow with its own retry policy rather than running as an activity within the main workflow.",
      },
      {
        label: "D",
        text: "The timeout threshold for the refund activity should be increased to match the payment gateway's maximum response time, eliminating the false timeout.",
      },
    ],
    correctIndex: 0,
    explanation:
      "This combines compensation logic with the idempotency challenge the content warns about. The gateway processed the first refund but the response timed out, so from Temporal's perspective the activity failed. Temporal retried, and without an idempotency key, the gateway processed a second refund. The customer was actually refunded twice (not zero times as they claimed — but the duplicate refund may have created accounting confusion). The fix is the content's prescribed pattern: 'make the activity idempotent' by 'storing off a key to a database and then checking if it exists before performing the irreversible action.' Option D might reduce timeouts but doesn't prevent them. Option B puts the responsibility in the wrong place.",
    interviewScript:
      "In your interview, say: 'This is the classic timeout-and-retry problem for irreversible operations. The gateway processed the refund but the response timed out, triggering a retry that created a duplicate. The fix is idempotency keys — pass a unique key to the gateway so it deduplicates retries. This applies to every external side effect in compensation logic, not just the happy path.'",
    proTip:
      "Compensation logic is often even more critical to make idempotent than forward logic — a double-charge might be caught and corrected, but a double-refund is pure financial loss that's harder to recover.",
  },
];

const SUBTOPIC_ORDER = [
  "The Problem",
  "Single Server Orchestration",
  "Event Sourcing",
  "Durable Execution Engines",
  "Managed Workflow Systems",
  "When to Use Workflows",
  "When NOT to Use Workflows",
  "Workflow Versioning & Migrations",
  "Workflow State Size Management",
  "External Events & Signals",
  "Idempotency / Exactly-Once",
  "Compensation Logic",
];

const SUBTOPIC_COLORS = {
  "The Problem": "bg-red-500/20 text-red-300 border-red-500/30",
  "Single Server Orchestration": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Event Sourcing": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Durable Execution Engines": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Managed Workflow Systems": "bg-lime-500/20 text-lime-300 border-lime-500/30",
  "When to Use Workflows": "bg-green-500/20 text-green-300 border-green-500/30",
  "When NOT to Use Workflows": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Workflow Versioning & Migrations": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Workflow State Size Management": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "External Events & Signals": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Idempotency / Exactly-Once": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Compensation Logic": "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getSubtopicBreakdown() {
  const counts = {};
  QUESTIONS.forEach((q) => {
    counts[q.subtopic] = (counts[q.subtopic] || 0) + 1;
  });
  return SUBTOPIC_ORDER.map((s) => ({ name: s, count: counts[s] || 0 }));
}

export default function MultiStepProcessesQuiz({ quizSlug = 'patterns-multi-step-processes' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(90);
  const [timerActive, setTimerActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [totalTimerActive, setTotalTimerActive] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryMode, setRetryMode] = useState(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t), 1000);
    } else if (timerActive && timer === 0) {
      setTimerActive(false);
      setTimedOut(true);
      setSubmitted(true);
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          selected: null,
          confidence: null,
          correct: false,
          timedOut: true,
        },
      }));
      // Persist timed-out answer
      persistAnswer(currentQuestion.id, {
        selectedIndex: null,
        correctIndex: currentQuestion.correctIndex,
        isCorrect: false,
        confidence: null,
        timedOut: true,
      });
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, currentQuestion]);

  useEffect(() => {
    let interval;
    if (totalTimerActive) {
      interval = setInterval(() => setTotalTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [totalTimerActive]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (screen !== "quiz") return;
      if (submitted) {
        if (e.key === "Enter") handleNext();
        return;
      }
      const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined) setSelectedOption(idx);
      if (e.key === "Enter" && selectedOption !== null && confidence !== null) handleSubmit();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, submitted, selectedOption, confidence, currentIndex]);

  function startQuiz(selectedMode) {
    let ordered;
    if (selectedMode === "section") {
      ordered = SUBTOPIC_ORDER.flatMap((s) => QUESTIONS.filter((q) => q.subtopic === s));
    } else {
      ordered = shuffleArray([...QUESTIONS]);
    }
    setQuestions(ordered);
    setMode(selectedMode);
    setScreen("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimerActive(false);
    setTotalTime(0);
    setTotalTimerActive(true);
    setTimedOut(false);
    setRetryMode(null);
    startNewAttempt(ordered.map(q => q.id));
  }

  function startRetry(questionSubset, retryLabel) {
    const ordered = shuffleArray(questionSubset);
    setQuestions(ordered);
    setRetryMode(retryLabel);
    setScreen("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimerActive(false);
    setTotalTime(0);
    setTotalTimerActive(true);
    setTimedOut(false);
    startNewAttempt(ordered.map(q => q.id));
  }

  function handleResume() {
    const data = resumeAttempt();
    if (!data) return;
    const order = data.questionOrder || [];
    let qs;
    if (order.length > 0) {
      qs = order.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    } else {
      qs = [...QUESTIONS];
    }
    // Restore answers from saved data
    const restoredAnswers = {};
    const questionResults = data.questionResults || {};
    for (const [qid, r] of Object.entries(questionResults)) {
      restoredAnswers[qid] = {
        selected: r.selectedIndex,
        confidence: r.confidence,
        correct: r.isCorrect,
        timedOut: r.timedOut || false,
      };
    }
    setQuestions(qs);
    const firstUnanswered = qs.findIndex(q => !questionResults[q.id]);
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : qs.length - 1);
    setAnswers(restoredAnswers);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimerActive(false);
    setTotalTime(0);
    setTotalTimerActive(true);
    setTimedOut(false);
    setRetryMode(null);
    setScreen("quiz");
  }

  function handleSubmit() {
    if (selectedOption === null || confidence === null) return;
    const correct = selectedOption === currentQuestion.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: selectedOption, confidence, correct, timedOut: false },
    }));
    setSubmitted(true);
    setTimerActive(false);
    // Persist answer
    persistAnswer(currentQuestion.id, {
      selectedIndex: selectedOption,
      correctIndex: currentQuestion.correctIndex,
      isCorrect: correct,
      confidence,
      timedOut: false,
    });
  }

  function handleSkip() {
    setSkipped((prev) => [...prev, currentQuestion]);
    moveToNext();
  }

  function handleNext() {
    moveToNext();
  }

  function moveToNext() {
    const nextIdx = currentIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(90);
      setTimerActive(false);
      setTimedOut(false);
    } else if (skipped.length > 0) {
      const remaining = skipped.filter((q) => !answers[q.id]);
      if (remaining.length > 0) {
        setQuestions((prev) => [...prev, ...remaining]);
        setSkipped([]);
        setCurrentIndex(nextIdx);
        setSelectedOption(null);
        setConfidence(null);
        setSubmitted(false);
        setTimer(90);
        setTimerActive(false);
        setTimedOut(false);
      } else {
        finishQuiz();
      }
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    setScreen("results");
    setTotalTimerActive(false);
    setTimerActive(false);
    // Persist completion
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, totalTime);
  }

  function toggleFlag() {
    setFlagged((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-green-400";
  const timerBg = timer <= 15 ? "bg-red-500/20" : timer <= 30 ? "bg-amber-500/20" : "bg-green-500/20";

  // ============ LANDING SCREEN ============
  if (screen === "landing") {
    const breakdown = getSubtopicBreakdown();
    const totalEst = Math.round((QUESTIONS.length * 75) / 60);

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm font-medium mb-4 border border-red-500/30">
              <Target size={14} />
              FAANG SDE2 — Hard
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Multi-Step Processes</h1>
            <p className="text-gray-400 text-lg mb-1">Sagas, Workflow Systems & Durable Execution</p>
            <p className="text-gray-500 text-sm">
              {QUESTIONS.length} questions · ~{totalEst} min estimated · Interview-calibrated difficulty
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart3 size={14} />
              Subtopic Coverage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {breakdown.map((s) => (
                <div key={s.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/50">
                  <span className="text-sm text-gray-300 truncate mr-2">{s.name}</span>
                  <span className="text-xs font-mono text-gray-500 whitespace-nowrap">{s.count}q</span>
                </div>
              ))}
            </div>
          </div>

          {isResuming && resumeData && (
            <button
              onClick={handleResume}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors mb-3 w-full"
            >
              <Play size={18} />
              Resume Quiz ({resumeData.answeredCount}/{QUESTIONS.length} answered)
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => startQuiz("shuffled")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
            >
              <Shuffle size={18} />
              {isResuming ? 'New Shuffled' : 'Shuffled (Recommended)'}
            </button>
            <button
              onClick={() => startQuiz("section")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold transition-colors border border-gray-700"
            >
              <List size={18} />
              {isResuming ? 'New Section' : 'Section Order'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ QUIZ SCREEN ============
  if (screen === "quiz" && currentQuestion) {
    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-mono">
                {currentIndex + 1}/{totalQuestions}
              </span>
              {retryMode && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {retryMode}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${timerBg}`}>
                <Timer size={14} className={timerColor} />
                <span className={`font-mono font-bold text-sm ${timerColor}`}>{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <Clock size={14} />
                {formatTime(totalTime)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Subtopic tag */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                SUBTOPIC_COLORS[currentQuestion.subtopic] || "bg-gray-700 text-gray-300"
              }`}
            >
              {currentQuestion.subtopic}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white leading-relaxed">{currentQuestion.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((opt, idx) => {
              let cardStyle = "bg-gray-900 border-gray-700 hover:border-gray-500 cursor-pointer";
              if (submitted) {
                if (idx === currentQuestion.correctIndex) {
                  cardStyle = "bg-green-500/10 border-green-500/50";
                } else if (
                  idx === selectedOption &&
                  idx !== currentQuestion.correctIndex
                ) {
                  cardStyle = "bg-red-500/10 border-red-500/50";
                } else {
                  cardStyle = "bg-gray-900/50 border-gray-800 opacity-60";
                }
              } else if (idx === selectedOption) {
                cardStyle = "bg-indigo-500/15 border-indigo-500/50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedOption(idx)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${cardStyle}`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                        submitted && idx === currentQuestion.correctIndex
                          ? "bg-green-500/30 text-green-300"
                          : submitted && idx === selectedOption
                          ? "bg-red-500/30 text-red-300"
                          : idx === selectedOption
                          ? "bg-indigo-500/30 text-indigo-300"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm text-gray-200 leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence selector (pre-submit) */}
          {!submitted && selectedOption !== null && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">How confident are you?</p>
              <div className="flex gap-2">
                {["Guessing", "Somewhat Sure", "Very Confident"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfidence(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      confidence === level
                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                        : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons (pre-submit) */}
          {!submitted && (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || confidence === null}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  selectedOption !== null && confidence !== null
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                <CheckCircle size={18} />
                Submit
              </button>
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
              >
                <SkipForward size={16} />
                Skip
              </button>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                  flagged[currentQuestion.id]
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                <Flag size={16} />
              </button>
            </div>
          )}

          {/* Feedback (post-submit) */}
          {submitted && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-300">Explanation</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-300">Interview Script</span>
                </div>
                <p className="text-sm text-emerald-200/80 leading-relaxed italic">
                  {currentQuestion.interviewScript}
                </p>
              </div>

              {currentQuestion.proTip && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-300">Pro Tip</span>
                  </div>
                  <p className="text-sm text-amber-200/80 leading-relaxed">{currentQuestion.proTip}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
                >
                  {currentIndex + 1 < totalQuestions || skipped.some((q) => !answers[q.id])
                    ? "Next Question"
                    : "View Results"}
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                    flagged[currentQuestion.id]
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <Flag size={16} />
                  {flagged[currentQuestion.id] ? "Flagged" : "Flag"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ RESULTS SCREEN ============
  if (screen === "results") {
    const totalAnswered = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    let grade, gradeColor, gradeBg;
    if (score >= 90) {
      grade = "Staff-ready — you'd ace this topic";
      gradeColor = "text-green-300";
      gradeBg = "bg-green-500/10 border-green-500/30";
    } else if (score >= 75) {
      grade = "Strong Senior — solid, minor gaps to close";
      gradeColor = "text-blue-300";
      gradeBg = "bg-blue-500/10 border-blue-500/30";
    } else if (score >= 60) {
      grade = "SDE2-level — review the weak areas below";
      gradeColor = "text-amber-300";
      gradeBg = "bg-amber-500/10 border-amber-500/30";
    } else {
      grade = "Needs deep review — revisit the fundamentals";
      gradeColor = "text-red-300";
      gradeBg = "bg-red-500/10 border-red-500/30";
    }

    // Per-subtopic breakdown
    const subtopicStats = {};
    Object.entries(answers).forEach(([qId, ans]) => {
      const q = QUESTIONS.find((x) => x.id === qId);
      if (!q) return;
      if (!subtopicStats[q.subtopic]) subtopicStats[q.subtopic] = { correct: 0, total: 0 };
      subtopicStats[q.subtopic].total++;
      if (ans.correct) subtopicStats[q.subtopic].correct++;
    });

    // Confidence analysis
    const luckyGuesses = [];
    const overconfidentMisses = [];
    Object.entries(answers).forEach(([qId, ans]) => {
      const q = QUESTIONS.find((x) => x.id === qId);
      if (!q) return;
      if (ans.correct && ans.confidence === "Guessing") luckyGuesses.push(q);
      if (!ans.correct && ans.confidence === "Very Confident") overconfidentMisses.push(q);
    });

    const incorrectQuestions = Object.entries(answers)
      .filter(([, ans]) => !ans.correct)
      .map(([qId, ans]) => ({ ...QUESTIONS.find((q) => q.id === qId), answer: ans }))
      .filter(Boolean);

    const flaggedQuestions = Object.keys(flagged)
      .filter((qId) => flagged[qId])
      .map((qId) => QUESTIONS.find((q) => q.id === qId))
      .filter(Boolean);

    const weakSubtopics = Object.entries(subtopicStats)
      .filter(([, s]) => s.total > 0 && (s.correct / s.total) < 0.7)
      .map(([name]) => name);

    const weakQuestions = QUESTIONS.filter((q) => weakSubtopics.includes(q.subtopic));

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score card */}
          <div className={`text-center p-6 rounded-2xl border mb-6 ${gradeBg}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award size={24} className={gradeColor} />
              <span className="text-4xl font-bold text-white">{score}%</span>
            </div>
            <p className={`text-lg font-semibold ${gradeColor} mb-1`}>{grade}</p>
            <p className="text-sm text-gray-400">
              {correctCount}/{totalAnswered} correct · {formatTime(totalTime)} elapsed
              {retryMode && ` · ${retryMode}`}
            </p>
          </div>

          {/* Per-subtopic breakdown */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 size={14} />
              Subtopic Breakdown
            </h3>
            <div className="space-y-2">
              {SUBTOPIC_ORDER.map((name) => {
                const stat = subtopicStats[name];
                if (!stat) return null;
                const pct = Math.round((stat.correct / stat.total) * 100);
                const barColor = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-48 truncate flex-shrink-0">{name}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-gray-500 w-16 text-right">
                      {stat.correct}/{stat.total} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence analysis */}
          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Eye size={14} />
                Confidence Analysis
              </h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-amber-300 mb-2">
                    Lucky Guesses ({luckyGuesses.length}) — hidden weak spots
                  </p>
                  {luckyGuesses.map((q) => (
                    <div key={q.id} className="text-xs text-gray-400 pl-3 py-1 border-l border-amber-500/30 mb-1">
                      {q.question.slice(0, 100)}...
                    </div>
                  ))}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-300 mb-2">
                    Overconfident Misses ({overconfidentMisses.length}) — dangerous misconceptions
                  </p>
                  {overconfidentMisses.map((q) => (
                    <div key={q.id} className="text-xs text-gray-400 pl-3 py-1 border-l border-red-500/30 mb-1">
                      {q.question.slice(0, 100)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Incorrect questions review */}
          {incorrectQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <XCircle size={14} className="text-red-400" />
                Missed Questions ({incorrectQuestions.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrectQuestions.map((q) => (
                  <div key={q.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          SUBTOPIC_COLORS[q.subtopic] || "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {q.subtopic}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                    {q.answer && q.answer.selected !== null && (
                      <p className="text-xs text-red-400 mb-1">
                        Your answer: {q.options[q.answer.selected]?.label} — {q.options[q.answer.selected]?.text.slice(0, 80)}...
                      </p>
                    )}
                    <p className="text-xs text-green-400 mb-2">
                      Correct: {q.options[q.correctIndex].label} — {q.options[q.correctIndex].text.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged questions review */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flag size={14} className="text-amber-400" />
                Flagged for Review ({flaggedQuestions.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {flaggedQuestions.map((q) => (
                  <div key={q.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <span
                      className={`inline-flex text-xs px-2 py-0.5 rounded border mb-2 ${
                        SUBTOPIC_COLORS[q.subtopic] || "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {q.subtopic}
                    </span>
                    <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                    <p className="text-xs text-green-400 mb-2">
                      Correct: {q.options[q.correctIndex].label} — {q.options[q.correctIndex].text.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retry buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {incorrectQuestions.length > 0 && (
              <button
                onClick={() =>
                  startRetry(
                    incorrectQuestions.map((q) => QUESTIONS.find((x) => x.id === q.id)).filter(Boolean),
                    "Retry Missed"
                  )
                }
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl font-semibold transition-colors border border-red-500/30"
              >
                <RotateCcw size={16} />
                Retry Missed ({incorrectQuestions.length})
              </button>
            )}
            {weakQuestions.length > 0 && (
              <button
                onClick={() => startRetry(weakQuestions, "Retry Weak Subtopics")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl font-semibold transition-colors border border-amber-500/30"
              >
                <TrendingUp size={16} />
                Retry Weak Subtopics
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-colors border border-gray-700"
            >
              <Play size={16} />
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
