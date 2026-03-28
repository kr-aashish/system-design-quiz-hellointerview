// === COVERAGE MANIFEST ===
// Subtopic: Synchronous Processing Limitations — Questions: 2 — IDs: [q1, q2]
// Subtopic: Core Async Pattern (Decoupling) — Questions: 3 — IDs: [q3, q4, q5]
//   └─ Nested: Request acceptance vs processing — covered by: [q3, q4]
//   └─ Nested: User experience & notifications — covered by: [q5]
// Subtopic: Trade-offs — Questions: 3 — IDs: [q6, q7, q8]
//   └─ Nested: What you gain — covered by: [q6]
//   └─ Nested: What you lose / new failure modes — covered by: [q7, q8]
// Subtopic: Message Queue Technologies — Questions: 3 — IDs: [q9, q10, q11]
//   └─ Nested: Redis/Bull durability caveat — covered by: [q9]
//   └─ Nested: SQS message size limit — covered by: [q10]
//   └─ Nested: Kafka ordering & replay — covered by: [q11]
// Subtopic: Worker Implementation — Questions: 3 — IDs: [q12, q13, q14]
//   └─ Nested: Dedicated servers — covered by: [q12]
//   └─ Nested: Serverless constraints — covered by: [q13]
//   └─ Nested: Container orchestration — covered by: [q14]
// Subtopic: End-to-End Flow — Questions: 2 — IDs: [q15, q16]
// Subtopic: Interview Signal Recognition — Questions: 2 — IDs: [q17, q18]
// Subtopic: Failure Handling & Heartbeats — Questions: 3 — IDs: [q19, q20, q21]
//   └─ Nested: Heartbeat interval trade-off — covered by: [q19, q20]
//   └─ Nested: Visibility timeout / session timeout — covered by: [q21]
// Subtopic: Dead Letter Queue (DLQ) — Questions: 2 — IDs: [q22, q23]
// Subtopic: Idempotency & Deduplication — Questions: 3 — IDs: [q24, q25, q26]
//   └─ Nested: Idempotency keys — covered by: [q24, q25]
//   └─ Nested: Making work itself idempotent — covered by: [q26]
// Subtopic: Queue Backpressure & Autoscaling — Questions: 2 — IDs: [q27, q28]
// Subtopic: Mixed Workloads & Queue Separation — Questions: 2 — IDs: [q29, q30]
// Subtopic: Job Dependencies & Orchestration — Questions: 2 — IDs: [q31, q32]
// Cross-subtopic: Core Pattern × Failure Handling — Questions: 1 — IDs: [q16]
// Cross-subtopic: Queue Tech × Backpressure — Questions: 1 — IDs: [q28]
// Cross-subtopic: Mixed Workloads × Worker Impl — Questions: 1 — IDs: [q30]
// Cross-subtopic: Idempotency × Failure Handling — Questions: 1 — IDs: [q26]
// Cross-subtopic: DLQ × Backpressure — Questions: 1 — IDs: [q23]
// Anti-pattern questions: 4 — IDs: [q2, q7, q18, q29]
// Gotcha/trap questions: 3 — IDs: [q9, q20, q21]
// Total: 32 questions across 13 subtopics
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import {
  Clock,
  ChevronRight,
  Flag,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Zap,
  BookOpen,
  Shuffle,
  List,
  Timer,
  ArrowRight,
  Eye,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "Synchronous Processing Limitations",
    question:
      "Your e-commerce platform's 'Generate Annual Tax Summary' endpoint averages 55 seconds. Your load balancer timeout is 60 seconds, but under load, p99 latency reaches 72 seconds. Users report intermittent failures. A junior engineer proposes simply increasing the load balancer timeout to 120 seconds. What is the most critical problem with this approach?",
    options: [
      "Increasing timeout means each open connection holds a thread/socket longer, drastically reducing the web server's effective concurrency and causing cascading failures for ALL endpoints — including fast ones like login and browsing",
      "The load balancer timeout increase will cause the database connection pool to be exhausted since queries will run longer",
      "Users will still perceive the experience as slow, but the request will reliably complete, so it's a valid short-term fix with no systemic risk",
      "The 120-second timeout will trigger TCP keep-alive failures at the OS level, causing packets to be dropped before the response is sent",
    ],
    correctIndex: 0,
    explanation:
      "Increasing timeouts is a dangerous band-aid. Each long-running request occupies a server thread/connection for its entire duration. With a 120s timeout, a single slow request blocks resources 120x longer than a typical 1s request. Under load, this means your web servers saturate their connection pools serving a few slow requests, causing ALL traffic — including fast endpoints — to queue and fail. This is a classic cascading failure pattern. The correct solution is async processing.",
    interviewScript:
      "In your interview, say: 'Raising the timeout treats the symptom, not the cause. The real issue is that a 55-second synchronous operation holds server resources hostage. Under load, those held connections cascade into failures for every endpoint. I'd decouple the heavy work into async workers so the web tier stays responsive.'",
    proTip:
      "Interviewers love to see you identify cascading failure risks. Always mention that slow endpoints can poison fast ones when they share a thread/connection pool.",
  },
  {
    id: "q2",
    subtopic: "Synchronous Processing Limitations",
    question:
      "A candidate designs a video platform where the upload endpoint synchronously transcodes video before returning a response. They argue: 'We'll just add more web servers to handle the transcoding load.' What is the most critical flaw in this anti-pattern?",
    options: [
      "Web servers would need expensive GPU instances for transcoding, but most requests (browsing, login) don't need GPUs — you're paying GPU prices for simple database queries across your entire fleet",
      "Synchronous transcoding will always be slower than asynchronous transcoding due to thread context switching overhead",
      "The web servers will run out of disk space storing intermediate transcoding files",
      "Adding more web servers creates a split-brain problem where two servers might transcode the same video simultaneously",
    ],
    correctIndex: 0,
    explanation:
      "This is a classic resource mismatch anti-pattern. Transcoding needs GPUs and high compute; serving API requests needs minimal resources. When you colocate them, every web server needs expensive hardware even though 99% of requests are lightweight. Independent scaling is impossible — you can't add GPU capacity without also adding unnecessary API capacity. The async pattern lets you run cheap web servers and expensive GPU workers as separate, independently scaled pools.",
    interviewScript:
      "In your interview, say: 'This violates separation of concerns at the infrastructure level. I'd keep web servers lightweight for fast request handling and offload transcoding to dedicated GPU workers via a job queue. This way each pool scales based on its own demand curve.'",
    proTip: null,
  },
  {
    id: "q3",
    subtopic: "Core Async Pattern (Decoupling)",
    question:
      "You're designing a document processing service. The product manager insists users need to see their processed document immediately after upload. Your architect proposes the async worker pattern with job IDs. The PM pushes back: 'Users won't accept waiting — they need instant results.' What is the strongest technical response that addresses the PM's concern while maintaining the async architecture?",
    options: [
      "Implement optimistic UI with WebSocket updates: return a job ID instantly, show a progress indicator, push real-time status updates via WebSocket, and render the document the moment processing completes — users perceive responsiveness even though processing is async",
      "Use a hybrid approach where small documents are processed synchronously and large documents are processed asynchronously, since the PM's concern is valid for small files",
      "Pre-process a low-quality preview synchronously and queue the full processing async — the user sees an immediate but degraded result",
      "Explain that the async pattern fundamentally cannot provide immediate results and the PM needs to adjust the product requirements",
    ],
    correctIndex: 0,
    explanation:
      "The key insight is that 'immediate results' and 'async processing' aren't mutually exclusive from a UX perspective. WebSocket/SSE connections let you push real-time progress updates, making the wait feel responsive rather than like a black hole. The user sees 'Uploading... Processing... Generating preview... Done!' in real-time. Option B introduces complexity with two code paths. Option C adds sync processing back to the web tier. Option D misunderstands that good async UX can feel instantaneous.",
    interviewScript:
      "In your interview, say: 'The user's perception of speed matters more than actual processing time. I'd return a job ID immediately with a WebSocket subscription, push granular progress updates, and render the result the moment it's ready. Users stay engaged instead of staring at a spinner.'",
    proTip:
      "Mentioning WebSocket/SSE for status updates shows you understand the full async pattern — not just the backend decoupling but also the frontend UX implications.",
  },
  {
    id: "q4",
    subtopic: "Core Async Pattern (Decoupling)",
    question:
      "In the async worker pool pattern, the web server pushes the job ID to the queue rather than the full job payload. An interviewer challenges you: 'Why not just put all the job data directly in the queue message? It would save a database read in the worker.' What is the strongest justification for the job-ID-only approach?",
    options: [
      "Queue messages have size limits (e.g., SQS caps at 256KB), job data can be arbitrarily large, and storing data in the database gives you a single source of truth for job status that both the API status endpoint and workers can query consistently",
      "Putting job data in the queue message violates the single responsibility principle since queues should only handle routing, not data storage",
      "The database read latency in the worker is negligible compared to the actual job processing time, so the performance argument doesn't hold",
      "Queue messages with large payloads cause network congestion between the queue broker and workers, leading to head-of-line blocking",
    ],
    correctIndex: 0,
    explanation:
      "The job-ID approach solves three problems simultaneously: (1) message size limits are real constraints — SQS has 256KB, Redis pub/sub has limits too; (2) the database becomes the single source of truth, so your /status endpoint and workers read from the same place, avoiding consistency issues; (3) if you need to update job parameters after queuing but before processing, you update the DB record, not the queue message. Option C is true but doesn't explain WHY you'd choose job-ID-only. Option D overstates the network impact.",
    interviewScript:
      "In your interview, say: 'I pass only the job ID in the queue message for three reasons: it respects queue size limits, it gives me a single source of truth in the database for both status queries and worker reads, and it lets me update job parameters after queuing without touching the queue.'",
    proTip: null,
  },
  {
    id: "q5",
    subtopic: "Core Async Pattern (Decoupling)",
    question:
      "Your async system processes user-uploaded videos. The user closes their laptop after uploading and reopens it 2 hours later. Which notification strategy provides the best user experience while maintaining system simplicity?",
    options: [
      "Store job completion status in the database, send a push notification and/or email on completion, and have the client poll or reconnect via WebSocket on next visit to fetch the latest status — covering both online and offline users",
      "Keep the WebSocket connection alive using TCP keep-alive so the notification is delivered the instant the user reopens their laptop",
      "Only use WebSocket notifications since they provide real-time updates, and if the user is offline, the notification will be buffered by the OS",
      "Implement long-polling from the client that automatically resumes when the laptop wakes from sleep",
    ],
    correctIndex: 0,
    explanation:
      "Users go offline. WebSockets don't survive laptop sleep/close — the connection is dropped. The robust pattern is: (1) persist completion status in the DB as the source of truth, (2) attempt real-time notification via WebSocket/push notification, (3) send an email as a durable fallback, (4) when the client reconnects, it fetches current status from the DB. Option B is wrong — TCP connections don't survive laptop sleep. Option C misunderstands WebSocket behavior. Option D adds unnecessary complexity.",
    interviewScript:
      "In your interview, say: 'I'd use a layered notification strategy: persist status in the DB, attempt WebSocket push for online users, send email as a durable fallback for offline users, and have the client check status on reconnect. This covers every scenario without relying on fragile long-lived connections.'",
    proTip: null,
  },
  {
    id: "q6",
    subtopic: "Trade-offs",
    question:
      "Your team is debating whether to add async workers for a new image processing feature. The feature currently takes 3 seconds synchronously. A senior engineer argues the async overhead isn't worth it for a 3-second operation. Given a traffic pattern of 500 image requests per second at peak, which analysis most accurately captures the trade-off?",
    options: [
      "At 500 req/s with 3s processing each, you need 1,500 concurrent threads just for image processing — this will saturate most web server pools (typically 200-500 threads), so async workers are necessary despite the added complexity, not for user experience but for server resource protection",
      "3 seconds is within acceptable synchronous range since most load balancers allow 30-60 second timeouts, so the senior engineer is correct that async overhead isn't justified",
      "The async pattern is always preferred for operations over 1 second because users perceive anything over 1 second as slow, making the UX argument definitive",
      "At 500 req/s, horizontal scaling of web servers is cheaper and simpler than introducing a queue and worker infrastructure",
    ],
    correctIndex: 0,
    explanation:
      "This is an estimation-backed reasoning question. 500 req/s × 3s = 1,500 concurrent connections held by image processing alone. Most web servers handle 200-500 concurrent connections. Image processing would consume your entire web server fleet, leaving zero capacity for normal requests. The senior engineer is thinking about individual request duration, not aggregate resource consumption. Option B ignores the concurrency math. Option D ignores that scaling web servers means scaling expensive image processing hardware too.",
    interviewScript:
      "In your interview, say: 'Let me do the math: 500 requests per second, each holding a connection for 3 seconds, means 1,500 concurrent connections just for image processing. That would saturate our web server pool and block all other traffic. Even though 3 seconds seems short, the aggregate load makes async workers essential.'",
    proTip:
      "Always do the concurrent-connection math in interviews. It's one of the most impressive moves you can make — turning a subjective 'is it too slow?' debate into a concrete resource calculation.",
  },
  {
    id: "q7",
    subtopic: "Trade-offs",
    question:
      "A candidate proposes adding async workers to a payment processing system. Their design queues the payment charge as an async job and immediately returns 'Payment received' to the user. The interviewer asks: 'What's wrong with this design?' What is the most critical flaw?",
    options: [
      "Telling the user 'Payment received' before the charge actually processes creates a false confirmation — if the charge fails (insufficient funds, fraud detection), you've already promised success, leading to inventory overselling, fulfillment of unconfirmed orders, and a terrible reversal experience",
      "The async pattern adds unnecessary latency to payment processing since card authorizations typically complete in 200-300ms synchronously",
      "Payment processors like Stripe require synchronous webhook responses, making async processing architecturally incompatible",
      "Queuing payment charges violates PCI-DSS compliance since sensitive card data would be stored in the message queue",
    ],
    correctIndex: 0,
    explanation:
      "This is a dangerous anti-pattern. Payment authorization (the initial charge check) should be synchronous because: (1) it's fast (~200ms), (2) the user MUST know if their payment succeeded before you confirm the order, (3) false confirmations lead to overselling and painful reversals. The async pattern applies to post-authorization steps: fraud analysis, receipt emails, webhook notifications, settlement. Option B is partially true but misses the core issue. Option C is incorrect — Stripe doesn't require this. Option D confuses card data with job metadata.",
    interviewScript:
      "In your interview, say: 'The card authorization itself should be synchronous — it's fast and the user needs a real answer. But everything after authorization — fraud scoring, receipt generation, webhook delivery, settlement — should absolutely be async. The key is knowing which parts of a workflow must be synchronous for correctness.'",
    proTip:
      "Interviewers test whether you blindly apply patterns or understand when NOT to use them. Not everything should be async — identify the synchronous 'point of no return' in each workflow.",
  },
  {
    id: "q8",
    subtopic: "Trade-offs",
    question:
      "After migrating to async workers, your team discovers that users are seeing stale profile data for up to 30 seconds after updating their profile photo. The photo resize job completes successfully, but users see their old photo when they refresh. An engineer proposes adding a 'processing' banner that shows for 60 seconds after any upload. What's the best approach?",
    options: [
      "Use a 'read-your-writes' pattern: after submitting the job, set a short-lived client-side flag so that reads for THIS user bypass the CDN cache and hit the origin directly until the job completes — this gives immediate consistency for the user who made the change while preserving cache performance for everyone else",
      "The 60-second processing banner is the simplest solution and correctly sets user expectations for eventual consistency — overengineering this is worse than the brief stale data",
      "Switch profile photo processing back to synchronous since it only takes 2-3 seconds and the eventual consistency tradeoff isn't worth it for user-facing content",
      "Reduce the CDN cache TTL for profile photos from 30 seconds to 1 second to eliminate the staleness window",
    ],
    correctIndex: 0,
    explanation:
      "The 'read-your-writes' pattern elegantly solves the eventual consistency problem for the user who cares most — the one who just made the change. Everyone else can continue reading from cache. Implementation: after submitting the upload job, store a version token client-side. On subsequent reads, include this token; the server checks if the latest version is processed and either serves the new photo or shows a targeted loading state. Option B is lazy. Option C throws away async benefits. Option D hammers your origin server.",
    interviewScript:
      "In your interview, say: 'This is an eventual consistency challenge inherent to async processing. I'd implement read-your-writes consistency: the uploading user's client gets a version token, and their subsequent reads bypass cache until the new version is available. Other users continue reading from cache — best of both worlds.'",
    proTip: null,
  },
  {
    id: "q9",
    subtopic: "Message Queue Technologies",
    question:
      "Your startup uses Redis with BullMQ as the job queue. During a production incident, the Redis instance experiences a hard crash (process kill, not graceful shutdown) and restarts from its RDB snapshot taken 5 minutes ago. What is the most accurate description of the impact on your job queue?",
    options: [
      "Jobs enqueued in the last 5 minutes are lost entirely — they existed only in Redis memory between snapshots. Jobs that were 'in-progress' at crash time will also be lost since their queue state reverts to the snapshot, potentially causing duplicate processing when workers re-fetch from the restored state",
      "All jobs are preserved because BullMQ uses Redis Streams with consumer group acknowledgments, which survive restarts",
      "Only completed jobs are lost since BullMQ stores pending jobs in an append-only file (AOF) that persists every write",
      "No jobs are lost because Redis replication ensures at least one replica has the latest state before any write is acknowledged",
    ],
    correctIndex: 0,
    explanation:
      "This is a gotcha about Redis durability. Redis is memory-first. RDB snapshots are periodic — a hard crash loses everything since the last snapshot. Even with AOF enabled, the default 'everysec' fsync policy can lose 1 second of data. BullMQ provides queue semantics ON TOP of Redis, but it can't magically make Redis more durable than its configuration allows. This is exactly why the content notes 'you can lose jobs in a hard crash' with Redis. For true durability, SQS or RabbitMQ are safer choices.",
    interviewScript:
      "In your interview, say: 'Redis is memory-first, so its durability depends entirely on persistence configuration. With RDB snapshots, a hard crash loses all data since the last snapshot. This is the key tradeoff with Redis-based queues — you get speed and simplicity but accept durability risk. For critical jobs where loss is unacceptable, I'd use SQS or RabbitMQ instead.'",
    proTip:
      "This is a favorite interviewer trap. Many candidates say 'Redis' without understanding the durability implications. Always acknowledge the tradeoff.",
  },
  {
    id: "q10",
    subtopic: "Message Queue Technologies",
    question:
      "You're designing an async pipeline that processes user-uploaded CSV files (up to 500MB). Each job needs the file content and metadata. You've chosen AWS SQS as your queue. An engineer proposes putting the CSV content directly in the SQS message. What constraint makes this approach fail?",
    options: [
      "SQS has a 256KB maximum message size — a 500MB CSV exceeds this by orders of magnitude. The correct pattern is to upload the file to S3 first and pass only the S3 object key and metadata in the SQS message",
      "SQS charges per KB of message payload, so a 500MB message would cost approximately $200 per job, making it economically unfeasible",
      "SQS messages with payloads over 1MB trigger automatic message chunking, which adds reassembly complexity and increases failure probability",
      "Placing file content in the queue message causes consumer lag because SQS delivers messages in order and large messages block smaller ones behind them",
    ],
    correctIndex: 0,
    explanation:
      "SQS has a hard 256KB message size limit (even with the Extended Client Library, the actual message body in SQS is capped). The standard pattern is: upload file to S3, then send an SQS message containing only the S3 key, user ID, and job metadata. Workers fetch the file from S3 when processing. This also means the same file can be reprocessed without re-uploading. Option B fabricates pricing. Option C doesn't exist — SQS doesn't chunk. Option D is wrong — SQS doesn't guarantee ordering (standard queues).",
    interviewScript:
      "In your interview, say: 'SQS caps messages at 256KB, so we can't pass large payloads directly. I'd upload the file to S3 first, then enqueue just the S3 key and metadata. This also decouples storage from messaging and lets us retry jobs without re-uploading the file.'",
    proTip: null,
  },
  {
    id: "q11",
    subtopic: "Message Queue Technologies",
    question:
      "You're choosing between Kafka and SQS for a job queue that processes financial transaction reconciliation. Requirements: strict ordering per merchant, ability to replay jobs from 3 days ago if a bug is found, and 50,000 jobs/second throughput. Which queue technology fits and why?",
    options: [
      "Kafka — partition by merchant ID for per-merchant ordering, its append-only log with configurable retention enables replaying 3-day-old messages, and it handles 50K msg/s with horizontal partition scaling. SQS FIFO queues max out at 3,000 msg/s per queue and lack replay capability",
      "SQS with FIFO queues — use message group IDs for per-merchant ordering and DLQ for storing messages for replay. SQS handles unlimited throughput with automatic scaling",
      "Either would work at this scale, but SQS is preferred because it's fully managed and Kafka's operational overhead isn't justified for a simple job queue",
      "Kafka for ordering and replay, but you'd need to pair it with SQS for the throughput requirement since Kafka partitions have individual throughput limits of ~1,000 msg/s",
    ],
    correctIndex: 0,
    explanation:
      "This question tests knowledge of queue technology constraints. Kafka's append-only log with configurable retention is uniquely suited for replay (re-consume messages from an offset). Partitioning by merchant ID guarantees per-merchant ordering. Kafka easily handles 50K msg/s across partitions. SQS FIFO queues cap at ~3,000 msg/s per queue and don't support arbitrary replay — once a message is deleted after processing, it's gone. Option D is wrong — Kafka partitions typically handle 10K+ msg/s each.",
    interviewScript:
      "In your interview, say: 'Kafka is the clear choice here. I'd partition by merchant ID for strict per-merchant ordering, set a 3-day retention window for replay capability, and scale partitions horizontally for the 50K msg/s requirement. SQS FIFO queues can't match the throughput or replay needs.'",
    proTip:
      "Kafka's replay ability is a unique differentiator. If the interviewer asks about recovering from bugs in processing logic, mention consumer group offset rewind.",
  },
  {
    id: "q12",
    subtopic: "Worker Implementation",
    question:
      "You're running dedicated server workers that each pull one job at a time from the queue in a blocking loop. Each worker processes a video transcoding job that takes 8 minutes on average. You have 20 workers. During a traffic spike, 500 new jobs arrive in 10 minutes. What is the most accurate description of system behavior?",
    options: [
      "Only 20 jobs process concurrently. At 8 minutes per job, the 20 workers complete ~25 jobs in 10 minutes. The remaining ~475 jobs queue up safely and will be processed over the next ~3 hours. Queue depth grows but jobs aren't lost — this is the designed backpressure behavior",
      "The worker pool will crash because 500 jobs exceeds the maximum concurrent capacity, causing out-of-memory errors",
      "Workers will automatically spawn additional threads to handle the spike, processing up to 100 concurrent jobs",
      "The queue will reject jobs beyond worker capacity, returning errors to the web servers which will fail the user requests",
    ],
    correctIndex: 0,
    explanation:
      "This is how async worker pools are designed to behave. The queue absorbs the spike — it's a buffer. Workers process at their own pace (20 concurrent jobs). The math: 20 workers × (10 min / 8 min per job) ≈ 25 jobs completed in 10 minutes. The queue grows to ~475 pending jobs, which drain over ~3+ hours. No crashes, no rejections — just increased latency for jobs submitted during the spike. This is the fundamental value proposition of async processing.",
    interviewScript:
      "In your interview, say: 'The queue is designed to absorb traffic spikes. Twenty workers process ~25 jobs in 10 minutes while the remaining jobs wait safely in the queue. The user-facing API stays responsive because we decoupled acceptance from processing. If the queue depth exceeds our SLA, that's when I'd trigger autoscaling to add more workers.'",
    proTip: null,
  },
  {
    id: "q13",
    subtopic: "Worker Implementation",
    question:
      "Your team wants to use AWS Lambda for processing async jobs. The jobs involve generating PDF reports that take 5-20 minutes depending on data size. A developer argues Lambda is ideal because you only pay per execution. What is the most critical constraint they're overlooking?",
    options: [
      "AWS Lambda has a 15-minute maximum execution timeout — jobs that take 20 minutes will be killed mid-execution, leaving partially generated PDFs and requiring complex checkpoint/resume logic to handle the cutoff",
      "Lambda functions have a 512MB memory limit, which is insufficient for PDF generation with charts and images",
      "Lambda's cold start adds 10-30 seconds of latency to each invocation, making the per-job cost higher than dedicated servers",
      "Lambda functions cannot access S3 or databases, so you can't store the generated PDFs or update job status",
    ],
    correctIndex: 0,
    explanation:
      "Lambda's hard 15-minute timeout is the critical constraint. The content explicitly mentions '15-60 minute executions (depending on provider)' as a serverless limitation. If your p95 job duration exceeds Lambda's timeout, you'll get silent failures where jobs are killed mid-processing. Option B is wrong — Lambda supports up to 10GB memory. Option C overstates cold start impact. Option D is completely wrong — Lambda has full AWS SDK access. For jobs that might exceed 15 minutes, dedicated servers or ECS tasks are better choices.",
    interviewScript:
      "In your interview, say: 'Lambda's 15-minute timeout is a hard constraint. Since our p95 report generation can reach 20 minutes, Lambda would silently kill those jobs mid-execution. I'd use ECS tasks or dedicated servers for this workload, reserving Lambda for jobs with predictable, short durations.'",
    proTip:
      "Always mention the specific timeout limit when discussing serverless constraints. It shows you've operated these systems rather than just read about them.",
  },
  {
    id: "q14",
    subtopic: "Worker Implementation",
    question:
      "You're migrating workers from dedicated EC2 instances to Kubernetes (EKS). Your video transcoding workers use NVIDIA GPUs and process jobs that take 2-45 minutes. Which Kubernetes configuration consideration is MOST critical for this workload?",
    options: [
      "Configure GPU resource requests/limits on the worker pods and use the NVIDIA device plugin, set appropriate terminationGracePeriodSeconds (longer than max job time) to prevent Kubernetes from killing pods mid-transcoding during scaling events or deployments",
      "Use Kubernetes CronJobs instead of Deployments so that each transcoding job gets its own pod with isolated resources",
      "Set the pod's restart policy to 'Never' so that failed transcoding jobs don't cause infinite restart loops that waste GPU resources",
      "Use Kubernetes StatefulSets instead of Deployments because video workers need persistent local storage for intermediate transcoding files",
    ],
    correctIndex: 0,
    explanation:
      "The critical insight is terminationGracePeriodSeconds. By default, Kubernetes gives pods only 30 seconds to shut down during deployments, scaling events, or node drains. A video transcoding job taking 45 minutes would be killed 30 seconds into a rolling update. You must set terminationGracePeriodSeconds ≥ max job duration AND handle SIGTERM gracefully (finish current job, don't pull new ones). GPU scheduling with the NVIDIA device plugin is also essential. Option C's 'Never' restart policy defeats fault tolerance.",
    interviewScript:
      "In your interview, say: 'The biggest risk in Kubernetes for long-running workers is premature pod termination during deployments or scaling. I'd set terminationGracePeriodSeconds to at least 45 minutes, handle SIGTERM by finishing the current job and stopping the pull loop, and use the NVIDIA device plugin for GPU scheduling.'",
    proTip: null,
  },
  {
    id: "q15",
    subtopic: "End-to-End Flow",
    question:
      "In the standard async worker pool flow, the web server creates a job record in the database BEFORE pushing to the queue. An engineer proposes reversing this: push to the queue first, then write to the database, arguing it's faster. What failure scenario makes the original ordering critical?",
    options: [
      "If you push to the queue first and the database write fails, a worker may pick up the job and start processing, but there's no job record for status tracking — the status endpoint returns 'not found', the client has no way to check progress, and the worker has no record to update when it finishes",
      "Writing to the database first provides a natural deduplication mechanism that prevents the same job from being queued twice in a race condition",
      "The database write creates a transaction lock that prevents concurrent modifications to the job, ensuring queue push and database write are atomic",
      "Queue systems require a valid job record to exist in the database before they accept a message — this is a standard queue protocol requirement",
    ],
    correctIndex: 0,
    explanation:
      "The ordering matters because of partial failure handling. DB-first means: if the queue push fails, you have a 'pending' job record that a background reconciliation process can detect and re-queue. Queue-first means: if the DB write fails, a worker processes a phantom job with no status tracking. The client's job ID points to nothing. The worker can't update status. You've lost observability and created an orphaned job. Option D is fabricated — queues don't verify external databases.",
    interviewScript:
      "In your interview, say: 'I write to the database first because it creates a recoverable state. If the queue push fails, the pending DB record can be detected and re-queued by a reconciliation sweep. If I push to the queue first and the DB write fails, I have an orphaned job with no status tracking — that's worse because it's invisible.'",
    proTip:
      "Advanced candidates mention the transactional outbox pattern here: write the job record AND the queue message to the same database in one transaction, then have a separate process relay messages from the outbox table to the actual queue.",
  },
  {
    id: "q16",
    subtopic: "End-to-End Flow",
    question:
      "Your async system has the following components: web servers, a Kafka queue, workers, a PostgreSQL database, and S3 for file storage. The Kafka cluster goes down for 5 minutes. According to the content's description of component independence, which statement most accurately describes the system's behavior?",
    options: [
      "Web servers still accept requests and create 'pending' job records in PostgreSQL. Jobs pile up in the database but can't be queued. Once Kafka recovers, a reconciliation process detects un-queued pending jobs and pushes them to Kafka — no user requests are lost, just delayed",
      "The entire system halts because workers can't pull jobs, web servers can't push jobs, and the status endpoint returns errors since it depends on Kafka for state",
      "Web servers automatically switch to synchronous processing mode, bypassing the queue and sending jobs directly to workers via HTTP",
      "Workers continue processing jobs already pulled from Kafka before the outage, but the web servers immediately return 503 errors to all new requests",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic question bridging end-to-end flow with failure handling. The content explicitly states: 'If the queue goes down, web servers still accept requests and jobs pile up in the database as pending.' The database-first write pattern ensures no request is lost. Workers processing already-pulled jobs continue normally. New jobs wait in the DB until Kafka recovers. Status endpoints query the database, not Kafka, so they continue working. The system degrades gracefully rather than failing completely.",
    interviewScript:
      "In your interview, say: 'This is where component independence shines. The DB-first write pattern means web servers keep accepting requests — jobs accumulate as pending records in PostgreSQL. When Kafka recovers, we reconcile and push the backlog. Workers with in-flight jobs finish normally. The user experience is delayed processing, not failure.'",
    proTip: null,
  },
  {
    id: "q17",
    subtopic: "Interview Signal Recognition",
    question:
      "In a system design interview for a ride-sharing platform, the interviewer says: 'Users request a ride and see \"Finding drivers near you...\" while we match them.' A candidate immediately starts designing a synchronous matching algorithm. What should the candidate have recognized?",
    options: [
      "The 'Finding drivers near you...' text is a strong signal for async processing — the user is already expecting to wait, the system is explicitly showing a loading state, and ride matching involves evaluating multiple drivers' availability, routes, and pricing which takes variable time",
      "The candidate's synchronous approach is actually correct here because ride matching must return a result within 10 seconds to maintain good UX, which is within synchronous limits",
      "The loading message indicates the frontend team has already implemented polling, so the backend architecture doesn't need to be async",
      "This is a trick question — ride matching should use a pub/sub pattern, not an async worker pattern, since it involves real-time bidding between multiple drivers",
    ],
    correctIndex: 0,
    explanation:
      "The content explicitly lists Uber/ride-sharing as a canonical example: 'Ride matching runs asynchronously. The user sees \"Finding drivers near you...\" while workers evaluate driver availability, calculate optimal routes, and determine pricing.' The loading state IS the async pattern's UX. The candidate missed a key signal: when the product already shows a waiting state, the architecture should match. Synchronous matching would hold a server thread while evaluating potentially dozens of drivers.",
    interviewScript:
      "In your interview, say: 'The loading message is my cue — this is classic async territory. I'd return a match request ID immediately, have workers evaluate nearby drivers, compute routes and pricing, and push the match result via WebSocket. The web server shouldn't be holding a connection open while we search.'",
    proTip:
      "The content emphasizes being PROACTIVE about identifying async signals. Don't wait for the interviewer to suggest it — the moment you hear about variable-time operations, propose async processing yourself.",
  },
  {
    id: "q18",
    subtopic: "Interview Signal Recognition",
    question:
      "A candidate is designing a social media platform. They correctly use async workers for image processing but process the news feed fanout synchronously: when a user with 10 million followers posts, the API call blocks while writing to all 10 million follower feeds. The interviewer asks 'How long will this API call take?' What anti-pattern has the candidate fallen into?",
    options: [
      "They failed to recognize that fan-out to millions of followers is the exact same class of problem as video processing — it's a long-running operation that should be queued. The API should return immediately while workers batch-write to follower feeds asynchronously",
      "They should use a push-based fan-out model instead of a pull-based model, which would eliminate the need for writing to follower feeds entirely",
      "The issue is that they should shard the follower list across multiple databases, and then the synchronous write would be fast enough",
      "This is correct for small fanouts but they should use a hybrid approach: synchronous for users with fewer than 10K followers and async for celebrity accounts",
    ],
    correctIndex: 0,
    explanation:
      "The content explicitly calls out Instagram's fan-out: 'when someone with millions of followers posts, workers propagate that post to follower feeds.' The candidate applied async selectively (image processing) but missed that fan-out IS a long-running task. Writing to 10M feeds synchronously takes minutes regardless of sharding. This is the anti-pattern of inconsistently applying patterns — if you recognize the signal for one use case, apply the same reasoning to all matching cases.",
    interviewScript:
      "In your interview, say: 'Fan-out to 10 million followers is fundamentally a long-running task — same class as video transcoding. I'd queue the fan-out, batch it across workers writing to chunks of followers in parallel, and return the post ID immediately. The user's followers see the post as workers propagate it, typically within seconds.'",
    proTip: null,
  },
  {
    id: "q19",
    subtopic: "Failure Handling & Heartbeats",
    question:
      "Your workers send heartbeats every 10 seconds to the queue. A worker picks up a video transcoding job that triggers a 45-second garbage collection (GC) pause due to a memory-heavy operation. The queue's heartbeat timeout is set to 30 seconds. What happens, and why is this problematic?",
    options: [
      "The queue declares the worker dead after 30 seconds without a heartbeat, re-queues the job to another worker, but the original worker resumes after the GC pause and finishes the job too — resulting in the same video being transcoded twice, wasting resources and potentially causing duplicate notifications",
      "The garbage collection pause will cause the worker process to crash with an OutOfMemoryError, which is correctly handled by the queue's retry mechanism",
      "The queue will buffer the missed heartbeats and process them when the worker resumes, recognizing it was temporarily paused rather than dead",
      "The 45-second GC pause won't trigger a timeout because heartbeats are sent by a separate OS-level thread that isn't affected by JVM garbage collection",
    ],
    correctIndex: 0,
    explanation:
      "This is a classic gotcha about heartbeat intervals. The content warns: 'you may mark jobs as failed when in fact they're still running (e.g. a garbage collection pause).' A GC pause stops ALL threads in the process (in stop-the-world collection), including the heartbeat thread. The queue sees no heartbeats for 45 seconds, exceeds the 30-second timeout, and re-queues the job. When the original worker resumes, it continues processing — now two workers are processing the same job. This is why heartbeat intervals need careful tuning.",
    interviewScript:
      "In your interview, say: 'This is a duplicate processing risk. The GC pause stops heartbeats, the queue assumes the worker is dead and reassigns the job, but the original worker revives and finishes too. I'd set the heartbeat timeout to at least 60 seconds for memory-heavy workloads, and also make the job processing idempotent as a safety net.'",
    proTip:
      "Connect this to idempotency — even with perfect heartbeat tuning, duplicate processing can happen. Making work idempotent is the defense-in-depth strategy.",
  },
  {
    id: "q20",
    subtopic: "Failure Handling & Heartbeats",
    question:
      "You're configuring the heartbeat interval for your worker fleet. Your SLA requires that failed jobs are retried within 2 minutes. Workers process jobs averaging 30 seconds but occasionally take up to 5 minutes. A junior engineer sets the heartbeat timeout to 5 seconds for 'fast failure detection.' What is the most dangerous consequence?",
    options: [
      "With a 5-second timeout, any brief worker slowdown (network blip, disk I/O spike, minor GC pause) will cause the queue to falsely declare workers dead and re-queue their jobs — creating a cascade of duplicate processing, wasted resources, and potentially corrupted output from overlapping writes",
      "A 5-second heartbeat interval creates excessive network traffic between workers and the queue, consuming bandwidth and increasing queue latency for all consumers",
      "The short timeout violates the 2-minute SLA because it causes too-fast retries that overwhelm the worker pool",
      "Workers will spend more time sending heartbeats than processing jobs, reducing effective throughput by over 50%",
    ],
    correctIndex: 0,
    explanation:
      "This is a gotcha question. The content explicitly warns: 'If it's too short... you may mark jobs as failed when in fact they're still running.' A 5-second timeout is catastrophically short for jobs that can take 5 minutes. Normal operational jitter (disk I/O, GC, network latency) will frequently cause heartbeat delays >5 seconds, triggering false-positive death detection. This creates a storm of duplicate processing. The content recommends 10-30 seconds as a starting point, and choosing 'the longest interval permissible by your users/clients.'",
    interviewScript:
      "In your interview, say: 'The heartbeat timeout should be the longest interval our SLA permits, not the shortest possible. With a 2-minute retry SLA, I'd set the timeout to 60-90 seconds — long enough to absorb operational jitter but well within SLA. A 5-second timeout would cause constant false-positive failure detection.'",
    proTip: null,
  },
  {
    id: "q21",
    subtopic: "Failure Handling & Heartbeats",
    question:
      "You're using SQS with a visibility timeout of 60 seconds. A worker picks up a job that unexpectedly takes 90 seconds. The worker does NOT extend the visibility timeout during processing. What happens?",
    options: [
      "At 60 seconds, SQS makes the message visible again. Another worker picks it up and starts processing the same job. At 90 seconds, the first worker finishes and tries to delete the message — but the second worker is now also processing it. You get duplicate processing and a potential race condition on the result",
      "SQS will throw a VisibilityTimeoutExceeded error to the first worker, causing it to stop processing and release the job cleanly",
      "The job is automatically moved to the dead letter queue after the visibility timeout expires, preventing duplicate processing",
      "SQS buffers the message internally and waits for the first worker to complete, automatically extending the timeout based on consumer activity",
    ],
    correctIndex: 0,
    explanation:
      "This is a critical SQS gotcha. SQS's visibility timeout is a lease, not a lock. When it expires, the message becomes visible again regardless of whether the original consumer is still processing it. SQS doesn't notify the original consumer. There's no error, no warning — another consumer simply picks up the 'available' message. This is why workers MUST extend the visibility timeout if processing takes longer than expected, and why making work idempotent is essential.",
    interviewScript:
      "In your interview, say: 'SQS visibility timeout is a lease, not a permanent lock. If processing exceeds the timeout, another worker will pick up the same message — SQS won't warn the first worker. I'd implement a heartbeat that extends the visibility timeout periodically, and make all job processing idempotent as a safety net.'",
    proTip:
      "This is one of the most common SQS pitfalls in production. Always implement visibility timeout extension in your worker loop.",
  },
  {
    id: "q22",
    subtopic: "Dead Letter Queue (DLQ)",
    question:
      "Your DLQ has been growing steadily for the past week. Investigation reveals the failed jobs all involve processing PDFs uploaded from a specific mobile app version that includes a malformed header. The bug fix will take 3 days to deploy. What is the most appropriate action for the DLQ jobs?",
    options: [
      "Leave them in the DLQ, deploy the fix that handles malformed headers gracefully, then replay the DLQ jobs back to the main queue — the DLQ preserves the original job data so they can be reprocessed without users re-uploading",
      "Delete the DLQ messages immediately since they'll all fail again anyway, and ask affected users to re-upload their PDFs once the fix is deployed",
      "Move the DLQ messages back to the main queue now so they keep retrying — eventually the fix will be deployed and they'll process successfully",
      "Create a temporary worker that strips the malformed header before forwarding to the main processing queue, bypassing the DLQ entirely",
    ],
    correctIndex: 0,
    explanation:
      "This is exactly what DLQs are designed for: isolating problematic jobs for later investigation and reprocessing. The content states: 'Your DLQ becomes a collection of jobs that need human investigation. Maybe there's a bug to fix or data to clean up. Once fixed, you can move jobs back to the main queue for reprocessing.' Deleting them loses user data. Moving them back now wastes resources on guaranteed failures. The DLQ safely holds them until the fix is ready.",
    interviewScript:
      "In your interview, say: 'This is the DLQ working as designed — isolating bad jobs so they don't waste worker resources. I'd fix the header parsing, deploy, then replay the DLQ jobs. Users don't need to re-upload because the DLQ preserves the original job context. I'd also monitor the DLQ drain to confirm the fix is working.'",
    proTip: null,
  },
  {
    id: "q23",
    subtopic: "Dead Letter Queue (DLQ)",
    question:
      "During a Black Friday traffic spike, your main queue has 500,000 pending jobs and your DLQ suddenly grows from 0 to 10,000 messages in 30 minutes. Both events are happening simultaneously. What should be your FIRST diagnostic action, and why does the correlation matter?",
    options: [
      "Check if the DLQ growth is caused by queue backpressure forcing job timeouts — when the main queue is deeply backed up, jobs may exceed their visibility timeout waiting for a worker, get requeued multiple times, hit the max retry count, and land in the DLQ despite having no actual processing error",
      "Immediately scale up workers to 10x capacity to drain both the main queue and DLQ simultaneously — the DLQ growth is just a symptom of insufficient capacity",
      "Investigate the DLQ messages for a new bug introduced in the latest deployment, since the timing with Black Friday is likely coincidental",
      "Stop accepting new jobs to prevent the main queue from growing further, then focus on draining the DLQ first since those jobs have been waiting longest",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic bridge between DLQ and backpressure. The correlation matters: during extreme backpressure, jobs may time out in the queue before a worker ever processes them. Each timeout counts as a 'failure,' and after max retries, perfectly valid jobs land in the DLQ. This is a false-positive DLQ scenario — the jobs aren't broken, they're just victims of congestion. Scaling workers fixes both problems simultaneously. If you scale workers and the DLQ stops growing, you've confirmed the root cause.",
    interviewScript:
      "In your interview, say: 'The correlation is suspicious. During extreme backpressure, jobs can timeout waiting in the queue — each timeout counts as a retry. After max retries, valid jobs end up in the DLQ. My first action is checking if DLQ messages actually failed processing or just timed out waiting. If it's congestion-driven, scaling workers fixes both the main queue and stops the DLQ leak.'",
    proTip:
      "This diagnostic pattern — correlating DLQ growth with queue depth — is something production engineers check routinely. Mentioning it shows operational maturity.",
  },
  {
    id: "q24",
    subtopic: "Idempotency & Deduplication",
    question:
      "A user clicks 'Generate Report' three times in quick succession. Your system uses the idempotency key pattern: user_id + action + timestamp (rounded to 1-minute windows). The three clicks happen at 14:32:45, 14:32:47, and 14:32:52. What is the expected behavior?",
    options: [
      "All three clicks generate the same idempotency key (user_id + 'generate_report' + '14:32') because the timestamp is rounded to the minute. The first click creates a job and returns a job ID. The second and third clicks find the existing job by idempotency key and return the same job ID — only one job is processed",
      "Each click creates a separate job because the timestamps are different (45, 47, and 52 seconds), resulting in three identical reports being generated",
      "The first click creates a job. The second and third clicks are rejected with a 429 rate-limit error because the system detects rapid duplicate requests",
      "The idempotency check happens at the queue level, so all three messages enter the queue but only one is processed — the other two are silently dropped by the consumer",
    ],
    correctIndex: 0,
    explanation:
      "The content specifies 'timestamp (likely rounded to the duration you want to prevent duplicate work on).' Rounding to 1-minute windows means all three clicks at 14:32:xx produce the same key. The second and third submissions find the existing job and return its ID. No extra jobs are created. Option B fails to apply the rounding. Option C uses rate limiting instead of idempotency (different mechanism). Option D puts deduplication in the wrong layer — it should be at the API/submission level, not the consumer level.",
    interviewScript:
      "In your interview, say: 'I'd generate an idempotency key from user_id, action type, and a rounded timestamp. The rounding window controls the deduplication window — say 1 minute for reports. Subsequent clicks within the window get the same job ID back. This is simpler and more reliable than client-side deduplication.'",
    proTip: null,
  },
  {
    id: "q25",
    subtopic: "Idempotency & Deduplication",
    question:
      "Your idempotency key implementation stores keys in a Redis cache with a 5-minute TTL. A user generates a report at 14:30, the key expires at 14:35, and they click 'Generate Report' again at 14:36 with identical parameters. What happens, and is this the correct behavior?",
    options: [
      "A new job is created because the idempotency key expired. This IS correct behavior — the 5-minute TTL represents a conscious design choice that after 5 minutes, a new request with the same parameters is likely intentional (e.g., the user wants updated data), not an accidental duplicate",
      "The system returns the original job ID because idempotency keys should be permanent to prevent any possibility of duplicate work",
      "A new job is created, but this is a bug — idempotency keys should be stored in the database with no expiration to guarantee deduplication forever",
      "Redis's eviction policy may have already deleted the key before the 5-minute TTL, making the deduplication window unpredictable",
    ],
    correctIndex: 0,
    explanation:
      "Idempotency windows must be finite. A user requesting the same report 6 minutes later probably wants a fresh version, not a cached one. The TTL represents the deduplication window — how long you assume duplicate requests are accidental. Option B would prevent users from ever regenerating reports. Option C conflates deduplication with preventing intentional re-runs. Option D overstates Redis eviction risk — with a short TTL, the memory pressure is minimal.",
    interviewScript:
      "In your interview, say: 'The idempotency TTL defines the window where duplicates are assumed accidental. After 5 minutes, a new request is treated as intentional. The TTL should match user behavior patterns — for impatient double-clicks, even 60 seconds works. The key insight is that idempotency prevents accidental duplicates, not intentional re-runs.'",
    proTip: null,
  },
  {
    id: "q26",
    subtopic: "Idempotency & Deduplication",
    question:
      "A worker processes an email notification job. It successfully sends the email but crashes BEFORE marking the job as completed. The queue re-delivers the job to another worker. If the email-sending logic is NOT idempotent, what happens? How does this connect to the failure handling pattern?",
    options: [
      "The second worker sends the same email again because it has no way to know the first worker already sent it — the user receives duplicate emails. The fix requires making the email send idempotent by checking a 'sent' flag in the database before sending, combining idempotency with the retry mechanism to handle crash-then-retry scenarios safely",
      "The queue's exactly-once delivery guarantee prevents the second worker from processing the same message, so no duplicate email is sent",
      "The second worker will detect that the email was already sent by querying the email provider's API for recent sends to that recipient",
      "This can't happen because the worker marks the job as 'processing' when it starts, and the second worker will see this status and skip the email",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic bridge between idempotency and failure handling. The content states: 'If a job fails halfway through and gets retried, it should be safe to run again. This might mean checking if an email was already sent.' Most queues provide at-least-once delivery, not exactly-once. Option B is wrong for most queue systems. Option C is unreliable — email APIs don't support this well. Option D fails because a crashed worker can't update the status to 'processing' (or it did, but the job still needs to be retried).",
    interviewScript:
      "In your interview, say: 'At-least-once delivery means retries can cause duplicate side effects. For email, I'd record a sent flag in the database BEFORE sending — or better, use a unique message ID that the email provider deduplicates. The pattern is: check-before-act, making each step idempotent so retries are safe. This is where idempotency and failure handling intersect.'",
    proTip:
      "The order matters: record the side effect BEFORE performing it if possible, or use an external deduplication mechanism. 'Send then record' has the exact crash window this question illustrates.",
  },
  {
    id: "q27",
    subtopic: "Queue Backpressure & Autoscaling",
    question:
      "Your autoscaling is configured to scale workers based on CPU utilization (scale up at 70% CPU). During a traffic spike, your queue depth grows to 2 million messages but CPU on existing workers remains at 45% because jobs are I/O-bound (waiting on external API calls). What's wrong with the autoscaling configuration?",
    options: [
      "CPU utilization is the wrong scaling metric for I/O-bound workloads — workers are idle waiting on network I/O, not CPU-bound. The content explicitly states: 'The key metric is queue depth, not CPU usage. By the time CPU is high, your queue is already backed up.' Scale on queue depth instead",
      "The autoscaling group's cooldown period is too long, preventing it from reacting to the traffic spike quickly enough",
      "I/O-bound workers should use burstable instances (T-series) that provide temporary CPU credits for spikes, which would trigger the CPU-based scaling",
      "The workers need to be configured with more CPU cores so that the I/O wait time is counted toward CPU utilization metrics",
    ],
    correctIndex: 0,
    explanation:
      "This directly tests a key insight from the content: 'The key metric is queue depth, not CPU usage. By the time CPU is high, your queue is already backed up.' I/O-bound workers can have millions of queued messages with low CPU because they spend time waiting on network responses, not computing. Queue depth is the correct leading indicator — when depth exceeds a threshold (e.g., >10,000), scale up. CPU-based scaling is a lagging indicator that fails for I/O workloads.",
    interviewScript:
      "In your interview, say: 'I'd scale on queue depth, not CPU. Queue depth is a leading indicator — it tells you work is accumulating before workers are saturated. CPU is a lagging indicator that fails entirely for I/O-bound workloads. I'd set a CloudWatch alarm on queue depth and trigger autoscaling when it exceeds a threshold.'",
    proTip: null,
  },
  {
    id: "q28",
    subtopic: "Queue Backpressure & Autoscaling",
    question:
      "During a massive traffic spike, your queue depth reaches 5 million and autoscaling is adding workers. But each new worker needs to establish connections to your PostgreSQL database to fetch job details. Your database connection pool is maxed at 200 connections. What cascading failure is about to occur, and which queue technology characteristic could help mitigate it?",
    options: [
      "New workers will fail to get database connections, crash, get replaced by autoscaling, crash again — creating a thundering herd that hammers the database. A connection pooler like PgBouncer would help, and Kafka's consumer group rebalancing would naturally rate-limit how quickly new workers start pulling jobs, buying time for connections to stabilize",
      "The database will automatically queue connection requests and serve them in order, so there's no cascading failure — just increased latency until workers drain the queue",
      "The queue broker will detect the database bottleneck and automatically throttle message delivery to match available database connections",
      "Autoscaling will stop adding workers once the database connection limit is reached because health checks will detect the connection failures",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic bridge between backpressure and queue technology. The thundering herd pattern is a classic autoscaling failure: more workers → more DB connections → connection pool exhausted → workers crash → autoscaler replaces them → they crash again. Kafka's consumer group protocol helps because rebalancing is coordinated and gradual. PgBouncer multiplexes connections. The key is recognizing that autoscaling without connection management turns a queue depth problem into a database problem.",
    interviewScript:
      "In your interview, say: 'Autoscaling workers without managing downstream dependencies creates a thundering herd. I'd put PgBouncer in front of PostgreSQL to multiplex connections, cap the autoscaling max to respect the connection pool limit, and add exponential backoff on connection failures so new workers ramp up gradually.'",
    proTip: null,
  },
  {
    id: "q29",
    subtopic: "Mixed Workloads & Queue Separation",
    question:
      "A candidate designs a document processing system with a single queue for all jobs. Quick OCR jobs (5 seconds) and complex data extraction jobs (5 minutes) share the same queue and worker pool. The candidate argues this is simpler and avoids the overhead of multiple queues. The interviewer asks: 'A user submits a quick OCR job during a batch of 1,000 data extraction jobs. When will the OCR job complete?' What is the core problem?",
    options: [
      "Head-of-line blocking: with all workers busy on 5-minute extraction jobs, the OCR job waits behind up to 1,000 slow jobs. Assuming 20 workers, the OCR job won't start for roughly (1000/20) × 5 minutes ≈ 4+ hours, despite needing only 5 seconds of processing",
      "The OCR job will be processed immediately because most queue systems implement priority scheduling that automatically fast-tracks shorter jobs",
      "The problem is resource waste — OCR workers are overprovisioned to handle extraction-level compute, wasting 95% of their CPU allocation",
      "The single queue approach works fine here because workers process jobs concurrently, so the OCR job will start within seconds regardless of queue depth",
    ],
    correctIndex: 0,
    explanation:
      "The content explicitly describes this: 'Long jobs block short ones. A user requesting a simple report waits hours behind someone's massive year-end export.' With one queue and one worker pool, each worker processes one job at a time. If all workers are busy with slow jobs, fast jobs wait. The solution is separate queues with different worker pools: a 'fast' queue with many workers for quick jobs, and a 'slow' queue with fewer, more powerful workers for long jobs.",
    interviewScript:
      "In your interview, say: 'This is head-of-line blocking. I'd separate into fast and slow queues with independent worker pools. Quick OCR jobs go to a fast queue with 50 workers on small instances. Complex extraction jobs go to a slow queue with 10 workers on large instances. This prevents 5-second jobs from waiting hours behind batch workloads.'",
    proTip: null,
  },
  {
    id: "q30",
    subtopic: "Mixed Workloads & Queue Separation",
    question:
      "You've separated your queues into 'fast' (max 60s jobs, 50 t3.medium workers) and 'slow' (max 6h jobs, 10 c5.xlarge workers). A new job type arrives: ML inference that takes 30 seconds but requires a GPU. Which queue should it go to, and what does this reveal about the queue separation strategy?",
    options: [
      "Neither existing queue works well — the fast queue's t3.medium instances lack GPUs, and the slow queue's workers are overkill for 30-second jobs. This reveals that queue separation should be based on resource requirements (CPU, GPU, memory), not just duration. Create a third 'gpu-fast' queue with GPU instances",
      "Place it in the fast queue since the 30-second duration fits the <60s limit, and add GPU instances to the fast worker pool",
      "Place it in the slow queue since GPU workloads are inherently compute-intensive and belong with other heavy jobs",
      "Use serverless GPU functions (like AWS Inferentia) instead of adding a third queue, since 30-second jobs are ideal for serverless",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic bridge between mixed workloads and worker implementation. Queue separation isn't just about duration — it's about matching workload characteristics to infrastructure. Duration, resource type (CPU/GPU/memory), and scaling behavior are all factors. Adding GPUs to the fast queue means paying for GPUs on jobs that don't need them. The slow queue wastes large instances on 30-second jobs. A third queue correctly matches the unique resource profile of GPU inference.",
    interviewScript:
      "In your interview, say: 'Queue separation is about matching workload profiles to infrastructure, not just duration. I'd create a gpu-fast queue with GPU instances sized for short inference jobs. This lets each queue autoscale based on its specific demand without overpaying for resources that most jobs in the queue don't need.'",
    proTip:
      "The content mentions 'different operations need different hardware' as an async signal. This principle extends to queue design — each queue should represent a distinct resource profile.",
  },
  {
    id: "q31",
    subtopic: "Job Dependencies & Orchestration",
    question:
      "You're designing a report pipeline with three sequential steps: (1) fetch data from multiple APIs, (2) generate PDF, (3) email the PDF. Each step is a separate worker job. Step 2 fails and is retried. Without proper orchestration, what is the most subtle problem that can occur?",
    options: [
      "If Step 2 fails and Step 1's worker directly queued Step 2, the retry must re-execute Step 2 with Step 1's output. But if Step 1's output was stored in temporary storage with a short TTL, it may have been garbage-collected. The retry fails not because of Step 2's logic but because the input data expired — this is why each job should include the full context (like S3 URLs) and intermediate results should use durable storage",
      "The retry will cause Step 3 to execute before Step 2 completes because the job dependency chain is broken",
      "Step 1 will be re-executed unnecessarily because the worker doesn't know that only Step 2 failed",
      "The PDF generation will produce a corrupted file because the retry doesn't clear the partial output from the first failed attempt",
    ],
    correctIndex: 0,
    explanation:
      "The content emphasizes: 'Include the full context in each job so steps can be retried independently.' The subtle failure is data availability on retry. If intermediate results are in /tmp or ephemeral storage, retries fail for the wrong reason — not a bug in Step 2, but missing input data. The fix: store intermediate results in durable storage (S3) and include the reference in the job context. Each step becomes independently retryable.",
    interviewScript:
      "In your interview, say: 'Each job in the chain needs to be independently retryable. I'd store intermediate results in S3 with the object key in the job context. This way, when Step 2 is retried, it fetches Step 1's output from a durable location regardless of how much time has passed. I'd also set S3 lifecycle policies to clean up intermediate results after the workflow completes.'",
    proTip: null,
  },
  {
    id: "q32",
    subtopic: "Job Dependencies & Orchestration",
    question:
      "Your report generation workflow has this dependency graph: (A) Fetch user data and (B) Fetch analytics data can run in parallel. (C) Generate PDF depends on both A and B. (D) Email PDF depends on C. A simple chaining approach (each step queues the next) can't express this parallelism. An engineer proposes using a workflow orchestrator like Temporal or Step Functions. The tech lead says: 'That's overengineering for 4 steps.' Who's right?",
    options: [
      "The tech lead is right for now — the content advises to 'only reach for orchestration when job dependencies become truly complex.' For this case, run A and B as separate jobs, have each write a 'completed' flag, and have a lightweight fan-in check: after each completes, check if the other is also done, and if so, queue C. This avoids a full orchestrator while handling the parallelism",
      "The engineer is right — any workflow with parallel steps requires a proper orchestrator because the fan-in synchronization is impossible to implement reliably without one",
      "The tech lead should use a single job that sequentially runs A, B, C, D — the parallelism isn't worth the coordination complexity since A and B together take under 10 seconds",
      "Use a cron job that polls every 30 seconds to check if A and B are complete, then queues C — this is simpler than both approaches",
    ],
    correctIndex: 0,
    explanation:
      "The content explicitly states: 'For simple chains, have each worker queue the next job before marking itself complete' and 'only reach for orchestration when job dependencies become truly complex.' A 4-step workflow with one fan-in point can be handled with a completion check: each of A and B records completion in the DB, then checks if the other is done — if so, queues C. A full orchestrator like Temporal is powerful but overkill here. Save it for workflows with 10+ steps, conditional branching, or human-in-the-loop steps.",
    interviewScript:
      "In your interview, say: 'I'd keep it simple. A and B run as parallel jobs, each recording completion in the database. After completing, each checks if the other is done — if both are done, queue C. C queues D on completion. This handles the fan-in without a full orchestrator. I'd introduce Temporal or Step Functions only when the workflow grows more complex.'",
    proTip:
      "Knowing when NOT to add infrastructure is as impressive as knowing what tools exist. Interviewers love candidates who choose the simplest solution that works.",
  },
];

const SUBTOPICS = [
  "Synchronous Processing Limitations",
  "Core Async Pattern (Decoupling)",
  "Trade-offs",
  "Message Queue Technologies",
  "Worker Implementation",
  "End-to-End Flow",
  "Interview Signal Recognition",
  "Failure Handling & Heartbeats",
  "Dead Letter Queue (DLQ)",
  "Idempotency & Deduplication",
  "Queue Backpressure & Autoscaling",
  "Mixed Workloads & Queue Separation",
  "Job Dependencies & Orchestration",
];

const SUBTOPIC_COLORS = {
  "Synchronous Processing Limitations": "bg-red-500/20 text-red-300 border-red-500/30",
  "Core Async Pattern (Decoupling)": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Trade-offs": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Message Queue Technologies": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Worker Implementation": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "End-to-End Flow": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Interview Signal Recognition": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Failure Handling & Heartbeats": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Dead Letter Queue (DLQ)": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Idempotency & Deduplication": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Queue Backpressure & Autoscaling": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Mixed Workloads & Queue Separation": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Job Dependencies & Orchestration": "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const CONFIDENCE_LEVELS = ["Guessing", "Somewhat Sure", "Very Confident"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSubtopicQuestionCounts() {
  const counts = {};
  SUBTOPICS.forEach((s) => (counts[s] = 0));
  QUESTIONS.forEach((q) => {
    if (counts[q.subtopic] !== undefined) counts[q.subtopic]++;
  });
  return counts;
}

// --- SCREENS ---

function LandingScreen({ onStart }) {
  const [mode, setMode] = useState("shuffled");
  const counts = getSubtopicQuestionCounts();
  const totalTime = Math.ceil((QUESTIONS.length * 75) / 60);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4 border border-red-500/30">
            <Zap size={14} /> FAANG SDE2 — Hard
          </div>
          <h1 className="text-3xl font-bold mb-2">Managing Long-Running Tasks</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Async worker pools, message queues, failure handling, idempotency, backpressure, and job orchestration — tested through scenario-based interview questions.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><BookOpen size={15} /> {QUESTIONS.length} questions</span>
          <span className="flex items-center gap-1.5"><Clock size={15} /> ~{totalTime} min</span>
          <span className="flex items-center gap-1.5"><BarChart3 size={15} /> {SUBTOPICS.length} subtopics</span>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Coverage Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUBTOPICS.map((s) => (
              <div key={s} className="flex items-center justify-between text-sm px-3 py-1.5 rounded-lg bg-gray-800/50">
                <span className="text-gray-300 truncate mr-2">{s}</span>
                <span className="text-gray-500 whitespace-nowrap">{counts[s]}q</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setMode("section")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "section" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <List size={16} /> Section Order
          </button>
          <button
            onClick={() => setMode("shuffled")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "shuffled" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Shuffle size={16} /> Shuffled
          </button>
        </div>

        <button
          onClick={() => onStart(mode)}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2"
        >
          Start Quiz <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function QuizScreen({ questions, onFinish, onPersistAnswer }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(90);
  const [timerActive, setTimerActive] = useState(true);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const q = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const allAnswered = questions.every((qq) => answers[qq.id] !== undefined);

  useEffect(() => {
    elapsedRef.current = setInterval(() => setTotalElapsed((t) => t + 1), 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => {
    setTimer(90);
    setTimerActive(true);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
  }, [currentIdx]);

  useEffect(() => {
    if (!timerActive || submitted) return;
    if (timer <= 0) {
      handleTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, timerActive, submitted]);

  const handleTimeout = () => {
    setTimerActive(false);
    setSubmitted(true);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { selected: -1, confidence: "Timeout", correct: false },
    }));
    if (onPersistAnswer) {
      onPersistAnswer(q.id, {
        selectedIndex: -1,
        correctIndex: q.correctIndex,
        isCorrect: false,
        confidence: null,
        timedOut: true,
      });
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null || confidence === null) return;
    setSubmitted(true);
    setTimerActive(false);
    const isCorrect = selectedOption === q.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        selected: selectedOption,
        confidence,
        correct: isCorrect,
      },
    }));
    if (onPersistAnswer) {
      onPersistAnswer(q.id, {
        selectedIndex: selectedOption,
        correctIndex: q.correctIndex,
        isCorrect,
        confidence,
        timedOut: false,
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish(answers, flagged, totalElapsed);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleSkip = () => {
    if (!skipped.includes(currentIdx)) {
      const remaining = questions.slice(currentIdx + 1);
      const newOrder = [...questions.slice(0, currentIdx), ...remaining, questions[currentIdx]];
      // Instead of reordering, just move to next and track skipped
      setSkipped((prev) => [...prev, q.id]);
    }
    if (isLastQuestion) {
      onFinish(answers, flagged, totalElapsed);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const n = new Set(prev);
      if (n.has(q.id)) n.delete(q.id);
      else n.add(q.id);
      return n;
    });
  };

  useEffect(() => {
    if (submitted) return;
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (["1", "a"].includes(key)) setSelectedOption(0);
      else if (["2", "b"].includes(key)) setSelectedOption(1);
      else if (["3", "c"].includes(key)) setSelectedOption(2);
      else if (["4", "d"].includes(key)) setSelectedOption(3);
      else if (key === "enter" && selectedOption !== null && confidence !== null) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, selectedOption, confidence]);

  const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-300";
  const timerBg = timer <= 15 ? "bg-red-500/20" : timer <= 30 ? "bg-amber-500/20" : "bg-gray-800";
  const progressPct = ((currentIdx + 1) / questions.length) * 100;
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">{currentIdx + 1}</span> / {questions.length}
          </div>
          <div className="flex-1 mx-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-mono font-medium ${timerBg} ${timerColor}`}>
            <Timer size={14} />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="max-w-3xl w-full">
          {/* Subtopic tag */}
          <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mb-4 ${SUBTOPIC_COLORS[q.subtopic] || "bg-gray-800 text-gray-300"}`}>
            {q.subtopic}
          </div>

          {/* Question */}
          <h2 className="text-lg font-medium leading-relaxed mb-6">{q.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              let classes = "border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 cursor-pointer";
              if (submitted) {
                if (i === q.correctIndex) classes = "border-emerald-500 bg-emerald-500/10";
                else if (i === selectedOption && i !== q.correctIndex) classes = "border-red-500 bg-red-500/10";
                else classes = "border-gray-800 bg-gray-900/50 opacity-60";
              } else if (selectedOption === i) {
                classes = "border-blue-500 bg-blue-500/10";
              }
              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedOption(i)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${classes}`}
                >
                  <div className="flex gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      submitted && i === q.correctIndex ? "bg-emerald-500 text-white" :
                      submitted && i === selectedOption && i !== q.correctIndex ? "bg-red-500 text-white" :
                      selectedOption === i ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"
                    }`}>
                      {optionLabels[i]}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </div>
                  {submitted && i === q.correctIndex && (
                    <div className="ml-10 mt-1"><CheckCircle2 size={16} className="text-emerald-400" /></div>
                  )}
                  {submitted && i === selectedOption && i !== q.correctIndex && (
                    <div className="ml-10 mt-1"><XCircle size={16} className="text-red-400" /></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Confidence selector */}
          {!submitted && selectedOption !== null && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">How confident are you?</p>
              <div className="flex gap-2">
                {CONFIDENCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfidence(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      confidence === level ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!submitted && (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || confidence === null}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  selectedOption !== null && confidence !== null
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
              <button onClick={handleSkip} className="px-4 py-3 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all text-sm flex items-center gap-1.5">
                <SkipForward size={15} /> Skip
              </button>
              <button onClick={toggleFlag} className={`px-4 py-3 rounded-xl transition-all text-sm flex items-center gap-1.5 ${
                flagged.has(q.id) ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}>
                <Flag size={15} />
              </button>
            </div>
          )}

          {/* Explanation */}
          {submitted && (
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"><Eye size={15} /> Explanation</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{q.explanation}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2"><MessageSquare size={15} /> Interview Script</h3>
                <p className="text-sm text-blue-200/80 leading-relaxed italic">{q.interviewScript}</p>
              </div>
              {q.proTip && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2"><Lightbulb size={15} /> Pro Tip</h3>
                  <p className="text-sm text-amber-200/80 leading-relaxed">{q.proTip}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isLastQuestion ? "View Results" : "Next Question"} <ChevronRight size={18} />
                </button>
                {!submitted || flagged.has(q.id) ? null : (
                  <button onClick={toggleFlag} className="px-4 py-3 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all text-sm flex items-center gap-1.5">
                    <Flag size={15} /> Flag
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ questions, answers, flagged, totalElapsed, onRetryMissed, onRetryWeak, onRestart }) {
  const totalCorrect = questions.filter((q) => answers[q.id]?.correct).length;
  const pct = Math.round((totalCorrect / questions.length) * 100);

  let grade, gradeColor;
  if (pct >= 90) { grade = "Staff-ready — you'd ace this topic"; gradeColor = "text-emerald-400"; }
  else if (pct >= 75) { grade = "Strong Senior — solid, minor gaps to close"; gradeColor = "text-blue-400"; }
  else if (pct >= 60) { grade = "SDE2-level — review the weak areas below"; gradeColor = "text-amber-400"; }
  else { grade = "Needs deep review — revisit the fundamentals"; gradeColor = "text-red-400"; }

  // Per-subtopic breakdown
  const subtopicStats = {};
  SUBTOPICS.forEach((s) => { subtopicStats[s] = { total: 0, correct: 0 }; });
  questions.forEach((q) => {
    subtopicStats[q.subtopic].total++;
    if (answers[q.id]?.correct) subtopicStats[q.subtopic].correct++;
  });

  // Confidence analysis
  const luckyGuesses = questions.filter((q) => answers[q.id]?.correct && answers[q.id]?.confidence === "Guessing");
  const overconfidentMisses = questions.filter((q) => !answers[q.id]?.correct && answers[q.id]?.confidence === "Very Confident");
  const incorrect = questions.filter((q) => !answers[q.id]?.correct);
  const flaggedQuestions = questions.filter((q) => flagged.has(q.id));

  const weakSubtopics = SUBTOPICS.filter((s) => {
    const stat = subtopicStats[s];
    return stat.total > 0 && (stat.correct / stat.total) < 0.7;
  });

  const mins = Math.floor(totalElapsed / 60);
  const secs = totalElapsed % 60;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Score header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 border-2 border-gray-700 mb-4">
            <span className="text-3xl font-bold">{pct}%</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{totalCorrect} / {questions.length} Correct</h2>
          <p className={`text-sm font-medium ${gradeColor}`}>{grade}</p>
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1.5"><Clock size={13} /> {mins}m {secs}s total</p>
        </div>

        {/* Subtopic breakdown */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Subtopic Breakdown</h3>
          <div className="space-y-3">
            {SUBTOPICS.map((s) => {
              const stat = subtopicStats[s];
              if (stat.total === 0) return null;
              const p = Math.round((stat.correct / stat.total) * 100);
              const barColor = p >= 70 ? "bg-emerald-500" : p >= 50 ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300 truncate mr-2">{s}</span>
                    <span className="text-gray-500 whitespace-nowrap">{stat.correct}/{stat.total} ({p}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence analysis */}
        {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Confidence Analysis</h3>
            {luckyGuesses.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-1.5"><AlertTriangle size={14} /> Lucky Guesses ({luckyGuesses.length})</h4>
                <p className="text-xs text-gray-500 mb-2">You got these right but admitted you were guessing — hidden weak spots.</p>
                {luckyGuesses.map((q) => (
                  <div key={q.id} className="text-sm text-gray-400 pl-4 py-1 border-l-2 border-amber-500/30 mb-1">{q.question.substring(0, 100)}...</div>
                ))}
              </div>
            )}
            {overconfidentMisses.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1.5"><XCircle size={14} /> Overconfident Misses ({overconfidentMisses.length})</h4>
                <p className="text-xs text-gray-500 mb-2">You were very confident but got these wrong — dangerous misconceptions.</p>
                {overconfidentMisses.map((q) => (
                  <div key={q.id} className="text-sm text-gray-400 pl-4 py-1 border-l-2 border-red-500/30 mb-1">{q.question.substring(0, 100)}...</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Incorrect questions */}
        {incorrect.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Missed Questions ({incorrect.length})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {incorrect.map((q) => {
                const ans = answers[q.id];
                return (
                  <div key={q.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mb-2 ${SUBTOPIC_COLORS[q.subtopic] || ""}`}>{q.subtopic}</div>
                    <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                    {ans.selected >= 0 && (
                      <p className="text-xs text-red-400 mb-1">Your answer: {["A", "B", "C", "D"][ans.selected]}. {q.options[ans.selected].substring(0, 80)}...</p>
                    )}
                    {ans.selected < 0 && <p className="text-xs text-gray-500 mb-1">Timed out</p>}
                    <p className="text-xs text-emerald-400 mb-2">Correct: {["A", "B", "C", "D"][q.correctIndex]}. {q.options[q.correctIndex].substring(0, 80)}...</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Flagged questions */}
        {flaggedQuestions.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Flag size={14} /> Flagged for Review ({flaggedQuestions.length})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {flaggedQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mb-2 ${SUBTOPIC_COLORS[q.subtopic] || ""}`}>{q.subtopic}</div>
                  <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                  <p className="text-xs text-emerald-400 mb-2">Correct: {["A", "B", "C", "D"][q.correctIndex]}. {q.options[q.correctIndex].substring(0, 120)}...</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retry buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {incorrect.length > 0 && (
            <button onClick={onRetryMissed} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-medium text-sm transition-all flex items-center justify-center gap-2">
              <RotateCcw size={15} /> Retry Missed ({incorrect.length})
            </button>
          )}
          {weakSubtopics.length > 0 && (
            <button onClick={() => onRetryWeak(weakSubtopics)} className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-medium text-sm transition-all flex items-center justify-center gap-2">
              <BarChart3 size={15} /> Retry Weak Subtopics ({weakSubtopics.length})
            </button>
          )}
          <button onClick={onRestart} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium text-sm transition-all flex items-center justify-center gap-2">
            <RotateCcw size={15} /> Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---

export default function ManagingLongRunningTasksQuiz({ quizSlug = 'patterns-long-running-tasks' }) {
  const [screen, setScreen] = useState("landing");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [finalFlagged, setFinalFlagged] = useState(new Set());
  const [finalElapsed, setFinalElapsed] = useState(0);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

  const startQuiz = (mode) => {
    let qs;
    if (mode === "shuffled") {
      qs = shuffleArray(QUESTIONS);
    } else {
      qs = [...QUESTIONS];
    }
    setQuizQuestions(qs);
    setScreen("quiz");
    startNewAttempt(qs.map(q => q.id));
  };

  const finishQuiz = (answers, flagged, elapsed) => {
    setFinalAnswers(answers);
    setFinalFlagged(flagged);
    setFinalElapsed(elapsed);
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, elapsed);
    setScreen("results");
  };

  const retryMissed = () => {
    const missed = quizQuestions.filter((q) => !finalAnswers[q.id]?.correct);
    setQuizQuestions(shuffleArray(missed));
    setScreen("quiz");
  };

  const retryWeak = (weakSubtopics) => {
    const weakQs = QUESTIONS.filter((q) => weakSubtopics.includes(q.subtopic));
    setQuizQuestions(shuffleArray(weakQs));
    setScreen("quiz");
  };

  const restart = () => {
    setScreen("landing");
  };

  if (screen === "landing") return <LandingScreen onStart={startQuiz} />;
  if (screen === "quiz") return <QuizScreen questions={quizQuestions} onFinish={finishQuiz} onPersistAnswer={persistAnswer} />;
  if (screen === "results")
    return (
      <ResultsScreen
        questions={quizQuestions}
        answers={finalAnswers}
        flagged={finalFlagged}
        totalElapsed={finalElapsed}
        onRetryMissed={retryMissed}
        onRetryWeak={retryWeak}
        onRestart={restart}
      />
    );
  return null;
}
