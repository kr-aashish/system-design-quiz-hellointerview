// === COVERAGE MANIFEST ===
// Subtopic: Race Conditions & The Problem — Questions: 2 — IDs: [q1, q2]
// Subtopic: Atomicity & Transactions — Questions: 3 — IDs: [q3, q4, q5]
//   └─ Nested: Transaction rollback behavior — covered by: [q3]
//   └─ Nested: Atomicity vs isolation distinction — covered by: [q4, q5]
// Subtopic: Pessimistic Locking (FOR UPDATE) — Questions: 3 — IDs: [q6, q7, q8]
//   └─ Nested: Lock scope & performance — covered by: [q7]
//   └─ Nested: WHERE predicate importance — covered by: [q8]
// Subtopic: Isolation Levels — Questions: 3 — IDs: [q9, q10, q11]
//   └─ Nested: SERIALIZABLE overhead — covered by: [q10]
//   └─ Nested: DB-specific behavior (PostgreSQL vs MySQL) — covered by: [q11]
// Subtopic: Optimistic Concurrency Control — Questions: 3 — IDs: [q12, q13, q14]
//   └─ Nested: Silent zero-row update gotcha — covered by: [q13]
//   └─ Nested: Version column strategies — covered by: [q14]
// Subtopic: ABA Problem — Questions: 2 — IDs: [q15, q16]
// Subtopic: Two-Phase Commit (2PC) — Questions: 3 — IDs: [q17, q18, q19]
//   └─ Nested: Coordinator persistent log — covered by: [q18]
//   └─ Nested: Blocking problem — covered by: [q19]
// Subtopic: Distributed Locks — Questions: 3 — IDs: [q20, q21, q22]
//   └─ Nested: Redis NX flag — covered by: [q20]
//   └─ Nested: Fencing tokens — covered by: [q22]
// Subtopic: Saga Pattern — Questions: 2 — IDs: [q23, q24]
//   └─ Nested: Eventual consistency tradeoff — covered by: [q24]
// Subtopic: Deadlock Prevention — Questions: 2 — IDs: [q25, q26]
// Subtopic: Hot Partition / Celebrity Problem — Questions: 2 — IDs: [q27, q28]
// Subtopic: Reservations & Intermediate States — Questions: 2 — IDs: [q29, q30]
// Subtopic: Choosing the Right Approach — Questions: 2 — IDs: [q31, q32]
// Cross-subtopic: Pessimistic × Optimistic trade-off — Questions: 1 — IDs: [q31]
// Cross-subtopic: 2PC × Saga comparison — Questions: 1 — IDs: [q24]
// Cross-subtopic: Distributed Locks × Reservations — Questions: 1 — IDs: [q29]
// Cross-subtopic: Hot Partition × Queue Serialization — Questions: 1 — IDs: [q28]
// Anti-pattern questions: 4 — IDs: [q5, q8, q13, q20]
// Gotcha/trap questions: 4 — IDs: [q4, q11, q13, q22]
// Total: 32 questions across 13 subtopics
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
  Eye,
} from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "Race Conditions & The Problem",
    style: "Failure Analysis",
    question:
      "In the classic concert ticket race condition, Alice and Bob both read 'available_seats = 1' and proceed to purchase. The content states this is fundamentally an isolation problem, not an atomicity problem. A junior engineer proposes wrapping the read-check-update in a single transaction to fix it. Why does this alone NOT prevent the double-booking?",
    options: [
      "Each transaction individually maintains atomicity — operations within each succeed or fail together — but under READ COMMITTED isolation, both transactions can read the same initial state before either commits, so the check-then-update gap still exists between transactions.",
      "The transaction will deadlock because both Alice and Bob try to write the same row simultaneously, causing the database to abort both transactions and leaving the seat unbooked.",
      "Transactions only guarantee durability, not isolation, so the database allows both writes to proceed and the last write wins, resulting in seats = -1.",
      "The database detects the conflict automatically at COMMIT time and aborts the second transaction, so the basic transaction approach actually does work — the engineer is correct.",
    ],
    correctIndex: 0,
    explanation:
      "A basic transaction provides atomicity (all-or-nothing within that transaction) but under the default READ COMMITTED isolation, it doesn't prevent another transaction from reading the same state concurrently. Both transactions read available_seats = 1 before either commits. The UPDATE in the second transaction may succeed because the WHERE clause is re-evaluated against committed state, but the INSERT still runs unless the application explicitly checks the affected row count. The fix requires either explicit locking (FOR UPDATE), higher isolation levels, or optimistic concurrency control.",
    interviewScript:
      "In your interview, say: 'The race condition here is an isolation problem, not an atomicity problem. Each transaction is internally atomic, but under READ COMMITTED, they can both read the same snapshot. I need either explicit row locks with FOR UPDATE, SERIALIZABLE isolation, or optimistic concurrency control to close the gap between reading and writing.'",
    proTip:
      "When an interviewer presents a race condition, immediately classify it as an atomicity vs. isolation problem. This framing shows you understand the fundamental ACID properties at a deeper level than most candidates.",
  },
  {
    id: "q2",
    subtopic: "Race Conditions & The Problem",
    style: "Scenario-Based",
    question:
      "Your flash sale system processes 10,000 concurrent purchase requests for 50 limited items. Under the default READ COMMITTED isolation level with no additional locking, what is the most likely failure mode at this scale?",
    options: [
      "The database will crash from connection exhaustion because 10,000 transactions all try to lock the same row simultaneously.",
      "Massive overselling occurs because hundreds of transactions read 'items_available > 0' before any commits, pass the business logic check, and proceed — the race window that's microseconds for 2 users becomes almost guaranteed with 10,000 concurrent readers.",
      "The database's internal conflict resolution will serialize all 10,000 writes automatically, causing no data inconsistency but extremely high latency (minutes per transaction).",
      "Exactly 50 items will be sold correctly because the UPDATE statement's WHERE clause is evaluated at execution time against the latest committed state, so excess transactions will update zero rows.",
    ],
    correctIndex: 1,
    explanation:
      "At 10,000 concurrent readers under READ COMMITTED, the race window that barely matters for 2 users becomes catastrophic. Hundreds of transactions will read items_available > 0 before any write commits. The UPDATE's WHERE clause does re-evaluate against committed state, but the critical issue is that the application still needs to check the affected row count — and even if it does, many transactions will have already proceeded past the business logic check. Without explicit locking or OCC, massive overselling is the most likely outcome.",
    interviewScript:
      "In your interview, say: 'At this scale, READ COMMITTED's race window becomes nearly guaranteed. I'd use either pessimistic locking with FOR UPDATE to serialize access, or optimistic concurrency with a version column and retry logic. For a flash sale specifically, I'd also add a reservation/hold system to avoid users going through checkout only to fail.'",
    proTip:
      "Interviewers love to scale up the numbers. Always think about what changes when you go from 2 concurrent users to 10,000 — failure modes that are 'unlikely' at small scale become 'guaranteed' at high concurrency.",
  },
  {
    id: "q3",
    subtopic: "Atomicity & Transactions",
    style: "Failure Analysis",
    question:
      "A bank transfer transaction debits Alice and credits Bob. The debit succeeds but the database crashes before the credit executes. What happens when the database recovers, and why is this behavior sufficient for preventing money from disappearing?",
    options: [
      "The database replays the debit from the write-ahead log and then attempts the credit again, completing the full transaction on recovery.",
      "The debit is committed permanently and the credit is lost. The application must implement a compensation mechanism to detect and fix this inconsistency.",
      "The entire transaction is rolled back on recovery because the COMMIT was never reached — the write-ahead log shows an incomplete transaction, so all operations within it are undone, restoring Alice's original balance.",
      "The database marks the transaction as 'pending' and waits for the application to reconnect and explicitly decide whether to commit or rollback.",
    ],
    correctIndex: 2,
    explanation:
      "This is the core guarantee of atomicity — all or nothing. Since the COMMIT was never reached before the crash, the database's recovery process (using the write-ahead log) identifies the incomplete transaction and rolls back all its operations. Alice's debit is undone. This is precisely why transactions exist: they prevent the partial-completion state where money disappears from Alice but never arrives at Bob.",
    interviewScript:
      "In your interview, say: 'Atomicity guarantees all-or-nothing. Since COMMIT was never reached, the WAL-based recovery process rolls back all operations in that transaction. Alice's balance is restored to its pre-transaction state. This is the fundamental reason we use transactions for multi-step operations.'",
    proTip: null,
  },
  {
    id: "q4",
    subtopic: "Atomicity & Transactions",
    style: "Gotcha/Trap",
    question:
      "A candidate writes this ticket purchase code: BEGIN TRANSACTION; UPDATE concerts SET available_seats = available_seats - 1 WHERE concert_id = 'X' AND available_seats > 0; INSERT INTO tickets VALUES (...); COMMIT; They claim the AND available_seats > 0 guard makes this safe against double-booking. What subtle bug exists?",
    options: [
      "The INSERT will execute even if the UPDATE matched zero rows (no seats available), because SQL doesn't raise an error when a WHERE clause matches nothing — the application must explicitly check the affected row count after the UPDATE and ROLLBACK if zero rows were updated.",
      "The available_seats > 0 check is evaluated at parse time, not execution time, so it uses a stale snapshot of the data rather than the current value.",
      "The transaction will deadlock with other concurrent purchases because UPDATE acquires a shared lock, and the INSERT requires an exclusive lock on the same table.",
      "The WHERE clause prevents the race condition entirely because the database evaluates it atomically with the UPDATE, making the affected row count check unnecessary.",
    ],
    correctIndex: 0,
    explanation:
      "This is a critical gotcha the content explicitly warns about. A SQL UPDATE that matches zero rows is NOT an error — it silently succeeds with 0 rows affected. Without checking the affected row count, the INSERT INTO tickets executes anyway, creating a ticket record without actually reserving a seat. The application code MUST check the row count after the UPDATE and ROLLBACK if it's 0. This is one of the most common mistakes in contention handling.",
    interviewScript:
      "In your interview, say: 'There's a subtle trap here. SQL won't raise an error when an UPDATE matches zero rows — it just silently affects nothing. The INSERT still runs. I need to check the affected row count in my application code and explicitly ROLLBACK if it's zero. This is a common pitfall in contention handling.'",
    proTip:
      "This gotcha applies to both pessimistic locking and optimistic concurrency. Whenever you use a conditional UPDATE (version check, availability check), always emphasize checking the affected row count. Interviewers will probe this.",
  },
  {
    id: "q5",
    subtopic: "Atomicity & Transactions",
    style: "Anti-Pattern Identification",
    question:
      "A candidate designs a payment system where each transaction wraps a balance check (SELECT), a debit (UPDATE), and a receipt creation (INSERT) in a single transaction under default READ COMMITTED isolation. They confidently state: 'The transaction makes all three operations atomic, so no race condition can occur.' What is the critical flaw in this reasoning?",
    options: [
      "READ COMMITTED doesn't support multi-statement transactions, so each statement runs as its own implicit transaction.",
      "The candidate confuses atomicity with isolation. The transaction guarantees all-or-nothing execution, but under READ COMMITTED, another transaction can read the same balance between the SELECT and UPDATE, leading to double-spending — the operations within each transaction don't fail, they just interfere across transactions.",
      "The transaction will always deadlock because the SELECT acquires a read lock that conflicts with the UPDATE's write lock within the same transaction.",
      "READ COMMITTED actually does prevent this race condition because it re-evaluates all WHERE clauses at commit time, making the candidate's reasoning correct.",
    ],
    correctIndex: 1,
    explanation:
      "This is the fundamental misconception the content highlights: atomicity and isolation are different ACID properties. Atomicity ensures operations within a transaction all succeed or all fail. But isolation controls how much concurrent transactions see of each other's work. Under READ COMMITTED, two transactions can both read the same balance, both pass the check, and both proceed — each transaction is individually atomic, but they interfere with each other. The fix requires explicit locking, higher isolation, or optimistic concurrency.",
    interviewScript:
      "In your interview, say: 'This is a classic confusion between atomicity and isolation. Atomicity is within a transaction — all or nothing. Isolation is between transactions — how much they see of each other's work. Under READ COMMITTED, two transactions can read the same state concurrently. I need FOR UPDATE locks or SERIALIZABLE isolation to prevent this.'",
    proTip:
      "When an interviewer tests you on transactions, explicitly separate atomicity from isolation in your explanation. Most candidates conflate them, and distinguishing them immediately signals deep understanding.",
  },
  {
    id: "q6",
    subtopic: "Pessimistic Locking",
    style: "Scenario-Based Trade-offs",
    question:
      "You're designing a seat selection system for a 50,000-seat stadium. During a Taylor Swift presale, 200,000 users attempt to select seats simultaneously. You implement SELECT ... FOR UPDATE on each seat row. What is the primary performance concern and how should you mitigate it?",
    options: [
      "FOR UPDATE locks the entire table, not individual rows, so all 200,000 users serialize on a single lock. Mitigate by partitioning the seats table by section.",
      "Lock contention on popular sections (front row, VIP) creates severe bottlenecks — transactions queue behind each other waiting for row locks. Mitigate by using temporary reservations with TTL instead of holding transactional locks during the full purchase flow, shrinking the lock duration from minutes to milliseconds.",
      "The database connection pool will exhaust because each FOR UPDATE holds a connection for the entire transaction. Mitigate by increasing the connection pool to match concurrent users (200,000 connections).",
      "FOR UPDATE causes excessive disk I/O because each lock must be persisted to the write-ahead log. Mitigate by using in-memory locks instead of database locks.",
    ],
    correctIndex: 1,
    explanation:
      "FOR UPDATE locks specific rows, not the entire table. The real problem is that popular seats (front rows, VIP sections) become hot rows where hundreds of transactions queue up. The content emphasizes locking as few rows as possible for as short a time as possible. The key mitigation is using temporary reservations with TTL — when a user selects a seat, immediately move it to 'reserved' status with a 10-minute timeout. This shrinks the contention window from the full purchase flow to just the reservation step (milliseconds).",
    interviewScript:
      "In your interview, say: 'The concern is lock contention on popular seats. FOR UPDATE locks individual rows, so hot seats like front row create long queues. I'd use temporary reservations with TTL instead — when a user selects a seat, reserve it for 10 minutes. This shrinks the contention window from the entire checkout flow to just the reservation step.'",
    proTip:
      "Always mention the reservation pattern in ticketing interviews. It's the biggest UX win and shows you think about the user experience, not just the technical correctness.",
  },
  {
    id: "q7",
    subtopic: "Pessimistic Locking",
    style: "Estimation-Backed Reasoning",
    question:
      "Your payment service processes transfers with FOR UPDATE locks on account rows. Average lock hold time is 5ms. Under normal load (100 transfers/sec), the system performs well. During a payroll batch job, 5,000 transfers execute simultaneously against 500 employee accounts. What happens and why?",
    options: [
      "The system handles it fine because 5ms × 5,000 = 25 seconds total lock time, which is distributed across 500 accounts so each account is locked for only 50ms.",
      "Popular accounts (e.g., the company payroll account that's the source for all transfers) become severely contended — if all 5,000 transfers debit from one payroll account, each waits in line. With 5ms lock hold time and 5,000 queued transactions, the last transaction waits ~25 seconds, and the queue depth compounds as new transfers arrive.",
      "The database automatically detects the batch pattern and parallelizes the locks, processing all 5,000 transfers in approximately 5ms total.",
      "FOR UPDATE degrades to table-level locking when more than 1,000 concurrent transactions target the same table, reducing throughput to 1 transaction at a time regardless of which rows are targeted.",
    ],
    correctIndex: 1,
    explanation:
      "The content stresses locking 'as few rows as possible for as short a time as possible.' In this scenario, all 5,000 transfers likely share a common source account (the payroll account), creating a hot row. With 5ms hold time and 5,000 queued transactions on that one row, the last transaction waits ~25 seconds. Meanwhile, new transfers arriving compound the queue. This is why you must think about lock scope and hot rows — the 500 destination accounts have minimal contention, but the single source account becomes a severe bottleneck.",
    interviewScript:
      "In your interview, say: 'The problem is the payroll source account — it's a hot row. All 5,000 transfers queue on it. At 5ms per transaction, the tail latency is ~25 seconds and growing. I'd batch the debits from the payroll account into a single bulk operation, or use a queue-based approach to serialize access to the hot account.'",
    proTip: null,
  },
  {
    id: "q8",
    subtopic: "Pessimistic Locking",
    style: "Anti-Pattern Identification",
    question:
      "A candidate implements seat booking with: SELECT ... FOR UPDATE on the seat row, then UPDATE seats SET status = 'booked' WHERE seat_id = 'A15'. They omit the AND status = 'available' predicate on the UPDATE. The interviewer asks: 'Your lock prevents concurrent access — why would you need the status check too?' What's the correct response?",
    options: [
      "The status check is indeed redundant when using FOR UPDATE because the lock guarantees exclusive access. The candidate's implementation is correct.",
      "Locking serializes access but doesn't enforce business invariants. Two back-to-back transactions (not concurrent) would both succeed — the first books the seat, the second immediately 're-books' it. The lock prevents concurrent modification, but the predicate (AND status = 'available') prevents logically incorrect sequential modifications.",
      "Without the status check, the database will throw a constraint violation error, crashing the application instead of gracefully handling the 'already booked' case.",
      "The status check is only needed for optimistic concurrency, not pessimistic locking. With FOR UPDATE, the database implicitly checks all column values.",
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly states: 'Locking the row prevents concurrent access, but it doesn't enforce business invariants.' A lock serializes access — it ensures only one transaction touches the row at a time. But once the first transaction commits and releases the lock, the next transaction acquires it and sees the updated state. Without the business logic predicate (status = 'available'), that next transaction would blindly overwrite the booking. The lock prevents races; the predicate prevents incorrect state transitions.",
    interviewScript:
      "In your interview, say: 'The lock and the predicate serve different purposes. The lock serializes access to prevent concurrent modification. The predicate enforces business invariants to prevent incorrect sequential modifications. Without AND status = available, a released lock allows the next transaction to re-book an already-booked seat.'",
    proTip:
      "This separation of concerns (serialization vs. business rules) is a principle interviewers test frequently. Always include both in your designs and explain why each is necessary.",
  },
  {
    id: "q9",
    subtopic: "Isolation Levels",
    style: "Multi-Hop Reasoning",
    question:
      "You switch your ticket purchase transaction to SERIALIZABLE isolation to prevent race conditions. Under peak load with 10,000 concurrent purchases, what performance characteristic distinguishes SERIALIZABLE from explicit FOR UPDATE locks, and which is more efficient for this specific use case?",
    options: [
      "SERIALIZABLE is more efficient because the database can optimize conflict detection globally, while FOR UPDATE forces sequential execution one transaction at a time.",
      "They perform identically because SERIALIZABLE internally uses the same row-level locking mechanism as FOR UPDATE.",
      "SERIALIZABLE is much more expensive because it must track ALL reads and writes across ALL concurrent transactions to detect potential conflicts, and aborts/retries many transactions speculatively. FOR UPDATE is more efficient here because you know exactly which row needs locking — you're paying only for the lock you need, not system-wide conflict detection.",
      "FOR UPDATE is slower because it holds locks during the entire transaction, while SERIALIZABLE uses an optimistic approach that only checks at commit time.",
    ],
    correctIndex: 2,
    explanation:
      "The content states that 'SERIALIZABLE isolation is much more expensive than explicit locks. It requires the database to track all reads and writes to detect potential conflicts, and transaction aborts waste work that must be redone.' When you know exactly which row creates contention (the specific concert row), FOR UPDATE gives you precise control — you lock only what you need. SERIALIZABLE is doing much more work: tracking every read set and write set across all concurrent transactions. At 10,000 concurrent users, this overhead (plus frequent aborts and retries) is significantly worse than targeted locking.",
    interviewScript:
      "In your interview, say: 'SERIALIZABLE is overkill here. It tracks all reads and writes system-wide to detect conflicts, and aborted transactions waste work. Since I know exactly which row needs protection — the concert row — FOR UPDATE gives me precise control with minimal overhead. Explicit locks are more efficient when you can identify the contention point upfront.'",
    proTip: null,
  },
  {
    id: "q10",
    subtopic: "Isolation Levels",
    style: "Interviewer Pushback",
    question:
      "You propose using SERIALIZABLE isolation for a collaborative document editing system. Your interviewer pushes back: 'SERIALIZABLE aborts transactions that conflict. With 50 users editing the same document simultaneously, won't you have massive abort rates?' What's the strongest response?",
    options: [
      "Yes, SERIALIZABLE would cause excessive aborts here. For collaborative editing, I should use pessimistic locking to serialize edits, giving each user exclusive access to the document while they're editing.",
      "The abort rate is manageable because SERIALIZABLE only aborts when actual data conflicts occur, and document edits to different paragraphs won't conflict.",
      "You're right — SERIALIZABLE is wrong for high-contention collaborative editing. This problem is better solved with operational transform (OT) or CRDTs, which allow concurrent edits without transactions by design. Using any database isolation level for real-time collaboration is an anti-pattern.",
      "I'd mitigate the abort rate by setting shorter transaction timeouts so failed transactions retry quickly, keeping the overall throughput acceptable.",
    ],
    correctIndex: 2,
    explanation:
      "This tests whether you can recognize when the entire framing is wrong. The content emphasizes 'don't overcomplicate' and choosing the right tool. Collaborative editing with 50 concurrent users is fundamentally a different problem than contention over a single resource. Neither SERIALIZABLE nor pessimistic locking is appropriate — operational transform or CRDTs are purpose-built for concurrent document editing. Recognizing when to step outside the contention pattern entirely shows mature system design thinking.",
    interviewScript:
      "In your interview, say: 'Actually, I'd step back from the transaction-based approach entirely. Real-time collaborative editing is better served by CRDTs or operational transform, which are designed for concurrent modifications without requiring serialization. Using database isolation levels here is solving the wrong problem.'",
    proTip:
      "The best candidates know when NOT to use a pattern. Recognizing that collaborative editing is a fundamentally different problem from resource contention shows breadth of knowledge.",
  },
  {
    id: "q11",
    subtopic: "Isolation Levels",
    style: "Implementation-Specific Nuance",
    question:
      "Your team runs PostgreSQL with REPEATABLE READ isolation for a bidding system. A colleague migrating the same code to MySQL says 'REPEATABLE READ works the same everywhere — it's a SQL standard.' Why is this dangerous advice, and what specific behavioral difference matters?",
    options: [
      "MySQL's REPEATABLE READ uses more memory than PostgreSQL's because it stores full row copies instead of using MVCC.",
      "The SQL standard defines isolation levels as minimum guarantees, not exact behaviors. PostgreSQL's REPEATABLE READ detects write conflicts and aborts the second transaction with a serialization error. MySQL's REPEATABLE READ does not — it allows the second write to proceed, potentially causing lost updates. Code relying on PostgreSQL's conflict detection would silently produce incorrect results on MySQL.",
      "MySQL doesn't support REPEATABLE READ at all — it only supports READ COMMITTED and SERIALIZABLE, so the code won't even run.",
      "The difference is only in how they handle phantom reads. PostgreSQL prevents them under REPEATABLE READ while MySQL allows them, but this doesn't affect contention handling.",
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly warns: 'In PostgreSQL, REPEATABLE READ would actually catch this: the second transaction to update the row gets aborted with a serialization error. But this behavior varies by database engine, so don't rely on it universally.' PostgreSQL provides stronger guarantees than the SQL standard requires for REPEATABLE READ. Migrating code that relies on PostgreSQL's automatic conflict detection to MySQL would silently introduce race conditions because MySQL's REPEATABLE READ doesn't abort conflicting transactions.",
    interviewScript:
      "In your interview, say: 'Isolation levels are minimum guarantees defined by the SQL standard, but implementations vary significantly. PostgreSQL's REPEATABLE READ detects write conflicts and aborts, but MySQL's doesn't. I'd never rely on database-specific behavior for correctness — I'd use explicit FOR UPDATE locks or optimistic concurrency with version checks, which are portable.'",
    proTip:
      "Mentioning database-specific behavioral differences in an interview is a strong signal of production experience. It shows you've been burned by portability issues, not just read about them.",
  },
  {
    id: "q12",
    subtopic: "Optimistic Concurrency Control",
    style: "Scenario-Based Trade-offs",
    question:
      "Your e-commerce platform has two contention patterns: (1) flash sales where 5,000 users compete for 100 items, and (2) product catalog updates where 3 admins occasionally edit product descriptions. A candidate proposes optimistic concurrency for both. What's wrong with this approach?",
    options: [
      "Optimistic concurrency doesn't work with multiple UPDATE statements in a single transaction, so neither use case is appropriate.",
      "Optimistic concurrency is correct for the admin catalog updates (low contention, rare conflicts, retries are cheap) but terrible for the flash sale. With 5,000 users and 100 items, the conflict rate is extreme — almost every transaction will fail and retry, creating a 'retry storm' that amplifies load instead of reducing it. The flash sale needs pessimistic locking or reservations.",
      "Both use cases should use pessimistic locking because optimistic concurrency can never guarantee correctness — it's a probabilistic approach that sometimes allows double-writes.",
      "Optimistic concurrency works perfectly for both cases because the retry overhead is always lower than the locking overhead, regardless of contention level.",
    ],
    correctIndex: 1,
    explanation:
      "The content is clear: optimistic concurrency 'makes sense when conflicts are uncommon.' Under low contention (admin edits), retries are rare and the performance benefit of avoiding locks is real. But under high contention (flash sale with 5,000 users for 100 items), nearly every transaction conflicts, retries compound the load, and the system spirals. The content's guidance is to use pessimistic locking for high-contention single-database scenarios and optimistic concurrency for low-contention ones.",
    interviewScript:
      "In your interview, say: 'I'd use different approaches for different contention profiles. For the admin catalog — optimistic concurrency with version columns, since conflicts are rare. For the flash sale — pessimistic locking with FOR UPDATE, or better yet, a reservation system. Optimistic concurrency under high contention creates retry storms that amplify load.'",
    proTip: null,
  },
  {
    id: "q13",
    subtopic: "Optimistic Concurrency Control",
    style: "Gotcha/Trap",
    question:
      "A developer implements optimistic concurrency for an auction system. Their code: UPDATE auctions SET high_bid = 150, version = version + 1 WHERE auction_id = 'X' AND version = 42; followed by INSERT INTO bid_history VALUES (...); COMMIT; They test with 2 concurrent bids and find that both bids appear in the history even though only one actually updated the auction. What did they miss?",
    options: [
      "They need to use a SELECT ... FOR UPDATE before the optimistic UPDATE to prevent the race condition.",
      "The version column must be a UUID, not an integer, for optimistic concurrency to work correctly.",
      "They forgot to check the affected row count after the UPDATE. When version doesn't match, the UPDATE silently affects 0 rows (no SQL error), but the INSERT still executes, creating a phantom bid record. The application must check the row count and ROLLBACK if zero rows were updated.",
      "The INSERT should be inside a separate transaction to ensure it only runs if the UPDATE committed successfully.",
    ],
    correctIndex: 2,
    explanation:
      "The content explicitly warns about this: 'The UPDATE with a stale version won't raise a database error. It just silently updates zero rows. Your application code must check how many rows were affected and roll back the transaction if zero rows matched. Otherwise the INSERT would still run.' This is one of the most common bugs in OCC implementations — developers assume a failed version check will cause an error, but SQL silently succeeds with 0 rows affected.",
    interviewScript:
      "In your interview, say: 'This is a classic OCC pitfall. SQL doesn't raise an error when an UPDATE matches zero rows — it silently succeeds. The INSERT runs regardless. I must check the affected row count in my application code and ROLLBACK if it's zero. This applies to any conditional UPDATE pattern, whether using version columns or business value checks.'",
    proTip:
      "In a real interview, proactively mention this gotcha when discussing OCC. It's the #1 implementation mistake and calling it out unprompted shows production experience.",
  },
  {
    id: "q14",
    subtopic: "Optimistic Concurrency Control",
    style: "Cross-Subtopic Bridge",
    question:
      "For an auction system using optimistic concurrency, a candidate proposes using the current high bid amount as the version (since bids only go up). Their UPDATE: UPDATE auctions SET high_bid = 200 WHERE auction_id = 'X' AND high_bid = 150. Under what specific condition does using the high bid amount as the version work safely, and when would it fail?",
    options: [
      "It always works because the high bid is unique and changes with every update, making it functionally identical to a version column.",
      "It works safely here because auction bids are monotonically increasing — a value can never return to a previous state, so there's no ABA risk. It would fail in a scenario where the value can decrease and return to its original value, like an inventory count that can be both decremented (sales) and incremented (returns).",
      "It never works safely because the high bid could theoretically overflow the integer type and wrap around to a previous value.",
      "It works only if there's a unique constraint on the high_bid column. Without it, two identical bids would both succeed.",
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'Use business values as the version only when you're certain they change in one direction (like a monotonically increasing bid amount in an auction).' Auction bids only go up, so there's no ABA risk — if the bid changed from 150, it went to something higher and can never return to 150. But for values that can increase and decrease (like inventory with sales and returns, or account balances with debits and credits), the value can cycle back to its original, creating the ABA problem where your optimistic check passes despite meaningful state changes.",
    interviewScript:
      "In your interview, say: 'Using the high bid as the version is safe here specifically because bids are monotonically increasing — no ABA risk. But I'd be careful generalizing this. For any value that can both increase and decrease, like inventory or account balances, I'd use a dedicated monotonically increasing version column to avoid the ABA problem.'",
    proTip: null,
  },
  {
    id: "q15",
    subtopic: "ABA Problem",
    style: "Multi-Hop Reasoning",
    question:
      "A restaurant review system tracks avg_rating and review_count. Two reviews arrive simultaneously: one gives 5 stars, another gives 3 stars. The restaurant starts at avg_rating = 4.0, review_count = 100. Due to the math, after both reviews the average happens to be exactly 4.0 again with 102 reviews. A developer uses avg_rating as the optimistic concurrency version. What specific sequence of events leads to data corruption?",
    options: [
      "Both reviews calculate the same new average, and since the avg_rating check passes for both (4.0 == 4.0), one review is silently lost — the second UPDATE overwrites the first's changes, and the final review_count is 101 instead of 102.",
      "The ABA problem can't occur here because floating-point arithmetic ensures the intermediate avg_rating will never exactly equal 4.0 again.",
      "Both transactions deadlock because they try to update the same row simultaneously, requiring manual intervention.",
      "The database catches the conflict automatically because UPDATE operations on the same row are always serialized, regardless of the WHERE clause.",
    ],
    correctIndex: 0,
    explanation:
      "This is the ABA problem the content describes: Review A reads avg_rating = 4.0, version matches. Review B also reads 4.0. Review A commits, changing the average (temporarily). Review B's update also matches because the average happened to return to 4.0 after A's commit. Now B's UPDATE passes the version check (4.0 == 4.0) and overwrites A's review_count increment. One review is silently lost. The fix is a dedicated, monotonically increasing version column that increments on every update.",
    interviewScript:
      "In your interview, say: 'This is a textbook ABA problem. The avg_rating returns to its original value, so the optimistic check passes even though state changed. I'd use a dedicated version column that increments on every write — it's monotonically increasing and immune to ABA. Business values should only serve as versions when they're guaranteed to be monotonic.'",
    proTip: null,
  },
  {
    id: "q16",
    subtopic: "ABA Problem",
    style: "Interviewer Pushback",
    question:
      "You recommend a dedicated version column to avoid the ABA problem. Your interviewer asks: 'Couldn't you just use the review_count as your version instead? It increments with every review, so it's monotonically increasing.' What's the most thorough response?",
    options: [
      "Yes, review_count works perfectly as a version because it only increases, making it immune to ABA. There's no need for a separate column.",
      "review_count is monotonically increasing IF reviews can only be added. But if reviews can also be deleted, the count goes from 100 to 99 and potentially back to 100, creating an ABA scenario. A dedicated version column is safer because it increments on every write — adds, deletes, edits — and never decreases, regardless of business logic changes.",
      "review_count won't work because integers can overflow, creating a theoretical ABA scenario at 2^31 reviews.",
      "Version columns must be UUIDs, not integers, so neither review_count nor a dedicated integer version would work.",
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly states: 'Using review_count as your version works if the value only ever increases, but breaks down if reviews can be deleted (the count could go from 100 to 99 and back to 100, creating an ABA situation).' The key insight is that business values are only safe as versions when they're monotonically increasing under ALL possible operations, not just the most common one. A dedicated version column is the safest approach because it increments on every mutation regardless of type.",
    interviewScript:
      "In your interview, say: 'review_count works only if reviews are append-only. But if we ever add delete functionality, the count can decrease and return to a previous value — that's ABA. A dedicated version column is defensive: it increments on every write regardless of the operation type, so it's robust against future feature additions.'",
    proTip:
      "Mentioning future-proofing ('what if we add delete later?') shows you think about system evolution, not just current requirements. Interviewers love this.",
  },
  {
    id: "q17",
    subtopic: "Two-Phase Commit (2PC)",
    style: "Failure Analysis",
    question:
      "In a 2PC bank transfer, Database A has prepared (debited Alice, holding locks) and Database B has prepared (ready to credit Bob). The coordinator crashes before sending COMMIT to either participant. Both databases are stuck with prepared transactions holding locks. What happens to other transactions that need to access Alice's or Bob's accounts?",
    options: [
      "Other transactions proceed normally because prepared transactions only hold advisory locks that don't block other operations.",
      "The databases automatically abort the prepared transactions after a default timeout of 30 seconds, releasing the locks and allowing other transactions to proceed.",
      "Other transactions on those specific rows are completely blocked until the coordinator recovers, reads its persistent log, and sends the final COMMIT or ABORT decision. This is 2PC's well-known blocking problem — it preserves consistency but sacrifices availability.",
      "The databases promote the prepared transactions to committed state after detecting coordinator failure, ensuring forward progress without data loss.",
    ],
    correctIndex: 2,
    explanation:
      "The content describes this as '2PC's biggest weakness: participants that have prepared are blocked until the coordinator recovers and resolves the transaction.' Prepared transactions in true 2PC use PREPARE TRANSACTION, making the prepared state durable and lock-holding. Other transactions needing those rows are blocked indefinitely. The content notes: '2PC preserves consistency (you won't get an inconsistent state), but at the cost of availability. Partitions cause blocking, not data corruption.'",
    interviewScript:
      "In your interview, say: '2PC has a well-known blocking problem. Prepared transactions hold locks until the coordinator decides commit or abort. If the coordinator crashes, those locks persist until recovery. This is the fundamental availability trade-off of 2PC — it preserves consistency but other transactions on those rows are blocked. This is why coordinator high availability and persistent logging are critical.'",
    proTip: null,
  },
  {
    id: "q18",
    subtopic: "Two-Phase Commit (2PC)",
    style: "Gotcha/Trap",
    question:
      "A candidate designs a 2PC-based transfer system but decides the coordinator doesn't need a persistent log because 'if the coordinator crashes, we can just abort all in-flight transactions and retry.' Why is this reasoning dangerous?",
    options: [
      "Without a persistent log, the coordinator can't retry failed transactions after recovery, leading to lost transfers.",
      "Once participants have PREPARED, they cannot unilaterally abort — the prepared state is durable and survives database restarts. Without a persistent log, the recovered coordinator doesn't know which transactions were in-flight or their state. Participants sit in limbo with locked rows, and the coordinator has no way to tell them to commit or abort. This creates irrecoverable stuck transactions.",
      "The persistent log is only needed for auditing purposes. The coordinator can reconstruct transaction state by querying all participants on recovery.",
      "The reasoning is actually correct — aborting and retrying is the safest approach because it avoids the complexity of log-based recovery.",
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'the coordinator must write to a persistent log before sending any commit or abort decisions... Without this log, coordinator crashes create unrecoverable situations where participants don't know whether to commit or abort their prepared transactions.' The key insight is that PREPARE TRANSACTION is durable — it survives participant restarts. Once prepared, participants can only commit or abort on the coordinator's instruction. Without the log, the coordinator can't determine what to instruct after recovery.",
    interviewScript:
      "In your interview, say: 'This is dangerous because PREPARE TRANSACTION is durable — it survives database restarts. Once prepared, participants are stuck waiting for a commit or abort decision. Without a persistent log, the recovered coordinator can't determine which transactions were in-flight or their state, leaving participants in limbo with locks held indefinitely. The persistent log is not optional in 2PC.'",
    proTip:
      "In interviews, always mention the coordinator's persistent log when discussing 2PC. It's the most commonly overlooked component, and bringing it up unprompted demonstrates deep understanding of distributed transaction failure modes.",
  },
  {
    id: "q19",
    subtopic: "Two-Phase Commit (2PC)",
    style: "Critical Failure Modes",
    question:
      "Your system uses 2PC across 5 database participants. A network partition isolates participant C from the coordinator after C has voted PREPARE. The coordinator receives PREPARE from A, B, D, E but times out waiting for C. What is the safest decision, and what happens to C?",
    options: [
      "The coordinator should commit A, B, D, E and abort C's portion later, since 4 out of 5 participants are ready. The majority vote succeeds.",
      "The coordinator must abort the entire transaction because it didn't receive PREPARE from all participants. C remains in an uncertain state with its prepared transaction holding locks until the network partition heals and the coordinator can deliver the ABORT decision.",
      "The coordinator should wait indefinitely for C's response because committing or aborting without unanimity could lead to inconsistency.",
      "C will automatically abort its prepared transaction after its local timeout expires, so the coordinator can safely commit the remaining 4 participants.",
    ],
    correctIndex: 1,
    explanation:
      "2PC requires unanimous PREPARE votes — there's no majority quorum. Without C's vote, the coordinator must abort. But C has already prepared, so its prepared transaction holds locks until it receives the ABORT decision. During the partition, C is blocked — it can't unilaterally commit or abort its prepared state. This demonstrates 2PC's fundamental weakness: network partitions cause blocking, not data corruption. The system is safe (consistent) but unavailable for those specific resources.",
    interviewScript:
      "In your interview, say: '2PC requires unanimity, not majority. The coordinator must abort because C didn't respond. But C is stuck with a prepared transaction holding locks until the partition heals and the ABORT arrives. This is the classic 2PC blocking problem — the system stays consistent but those resources are unavailable. This is why many systems prefer Sagas for cross-database coordination.'",
    proTip: null,
  },
  {
    id: "q20",
    subtopic: "Distributed Locks",
    style: "Anti-Pattern Identification",
    question:
      "A candidate implements a distributed lock with Redis using: SET lock:resource value. When asked about concurrent access, they say 'Redis is single-threaded, so commands are naturally serialized — no race condition possible.' What critical flaw exists in their implementation?",
    options: [
      "Redis being single-threaded doesn't help because the client reads and writes are separate network round-trips. Without the NX flag (SET lock:resource value NX), two clients can both execute SET successfully — the second overwrites the first's lock. They also forgot TTL for automatic expiration, so if the holder crashes, the lock is held forever.",
      "The single-threaded model is correct and prevents race conditions. The only issue is missing TTL for automatic cleanup.",
      "Redis SET is not atomic in clustered mode, so the command could be partially applied across nodes.",
      "The candidate should use Redis WATCH/MULTI instead of SET for distributed locking, as SET doesn't support transactional semantics.",
    ],
    correctIndex: 0,
    explanation:
      "The content specifies: 'The SET command with NX (only set if not exists) and expiration atomically creates a lock... the NX flag is critical — without it, a second process could overwrite an existing lock.' While Redis is single-threaded, two separate SET commands from different clients both succeed — the second just overwrites the first. The NX flag makes the SET conditional (only if the key doesn't exist), and TTL ensures cleanup if the holder crashes. Both are essential.",
    interviewScript:
      "In your interview, say: 'Two problems. First, without the NX flag, the second SET overwrites the first client's lock silently — Redis being single-threaded doesn't help because these are separate commands. I need SET key value NX to make it conditional. Second, without TTL, a crashed lock holder means the lock is held forever. I'd use SET key value NX EX ttl_seconds for atomic lock acquisition with automatic expiration.'",
    proTip: null,
  },
  {
    id: "q21",
    subtopic: "Distributed Locks",
    style: "Scenario-Based Trade-offs",
    question:
      "You need distributed locks for a payment processing system. Your team debates three options: Redis with TTL, database column locks, and ZooKeeper. Given that payment processing requires strong consistency (no double-charges), has moderate contention (hundreds of payments/sec), and your team has limited ops capacity, which option is best and why?",
    options: [
      "Redis with TTL — it's the fastest option and speed matters most for payment processing. TTL handles cleanup automatically.",
      "Database column locks — payment data is already in the database, so using it for locking keeps everything in one system with ACID guarantees, avoids introducing new infrastructure, and your team's limited ops capacity means adding Redis or ZooKeeper is risky. The slower lock operations are acceptable at hundreds/sec.",
      "ZooKeeper — it provides the strongest consistency guarantees, and payment processing can't tolerate any failures.",
      "None of these — you should use 2PC instead because distributed locks can't provide strong enough consistency for payments.",
    ],
    correctIndex: 1,
    explanation:
      "The content notes that database locks 'keep everything in one place and leverage your database's ACID properties.' For payments requiring strong consistency, the database provides ACID guarantees that Redis doesn't. Redis is fast but introduces a single point of failure and weaker consistency. ZooKeeper provides strong consistency but requires 'running and maintaining a separate coordination cluster' — bad for limited ops capacity. At hundreds/sec, database lock performance is sufficient. Keeping locks co-located with data simplifies the architecture.",
    interviewScript:
      "In your interview, say: 'For payments, I'd use database column locks. They leverage existing ACID guarantees, don't introduce new infrastructure for a team with limited ops capacity, and at hundreds of payments per second, the performance is sufficient. Redis is faster but introduces a SPOF with weaker consistency. ZooKeeper is overkill for this scale and adds operational burden.'",
    proTip:
      "The content warns that 'adding new components adds system complexity and introduces new failure modes.' In interviews, always justify adding infrastructure — don't reach for Redis or ZooKeeper when the database suffices.",
  },
  {
    id: "q22",
    subtopic: "Distributed Locks",
    style: "Gotcha/Trap",
    question:
      "Your distributed lock uses Redis with a 30-second TTL. A lock holder experiences a 35-second GC pause. During the pause, another process acquires the lock and begins writing to the shared resource. The original process resumes and also writes to the resource, unaware its lock expired. What mechanism prevents this data corruption, and how does it work?",
    options: [
      "Redis WATCH command monitors the lock key and notifies the original holder that its lock was revoked during the GC pause.",
      "Fencing tokens — a monotonically increasing number issued with each lock acquisition. The storage layer validates that incoming writes carry a token at least as large as the last one it saw, rejecting stale writes from the expired lock holder. The original process's write is rejected because its fencing token (e.g., 42) is lower than the new holder's token (43).",
      "The TTL should be set longer than the maximum possible GC pause, making this scenario impossible. There's no mechanism to handle it after the fact.",
      "The Redis client library automatically detects expired locks and aborts pending operations on the client side before they can write stale data.",
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'Use fencing tokens: a monotonically increasing number issued with each lock acquisition. The storage layer validates that incoming writes carry a token at least as large as the last one it saw, rejecting stale writes from expired lock holders.' This is a server-side protection — the storage layer (not the lock service) enforces ordering. The original process's write arrives with token 42, but the storage layer has already seen token 43 from the new holder, so it rejects the stale write.",
    interviewScript:
      "In your interview, say: 'This is exactly why we need fencing tokens. Each lock acquisition gets a monotonically increasing token. The storage layer — not Redis — validates that writes carry a token at least as large as the last one seen. When the original process tries to write with its stale token, the storage layer rejects it. This protects against GC pauses, network delays, and any scenario where a lock holder doesn't know it's been preempted.'",
    proTip:
      "Fencing tokens are a Martin Kleppmann concept from 'Designing Data-Intensive Applications.' Mentioning this in an interview shows you've done serious distributed systems reading.",
  },
  {
    id: "q23",
    subtopic: "Saga Pattern",
    style: "Failure Analysis",
    question:
      "A saga-based bank transfer executes: Step 1 (Debit Alice $100, committed), Step 2 (Credit Bob $100, fails because Bob's account is frozen). The saga runs the compensation for Step 1 (Credit Alice $100 back). During the window between Step 1 completing and the compensation running, what inconsistency is visible, and how should you handle it in your application?",
    options: [
      "No inconsistency is visible because the saga framework hides intermediate states from other transactions using snapshot isolation.",
      "Alice's balance shows $100 less than it should for a brief window. The total money in the system appears to have decreased. You handle this by showing the transfer as 'pending' in the UI and designing queries to account for in-flight saga state — for example, showing Alice's 'available balance' vs. 'balance including pending transfers.'",
      "The compensation will fail because Alice's account might have insufficient funds to receive the credit back, creating an irrecoverable state.",
      "The inconsistency only exists in the application layer. The database remains fully consistent because each step is a committed transaction.",
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly describes this: 'After Step 1 completes, Alice's account is debited but Bob's account isn't credited yet. Other processes might see Alice's balance as $100 lower during this window. If someone checks the total money in the system, it appears to have decreased temporarily.' The solution is designing your application to understand intermediate states — showing transfers as 'pending' until all steps complete. This is the fundamental tradeoff of sagas: eventual consistency in exchange for avoiding 2PC's blocking problem.",
    interviewScript:
      "In your interview, say: 'Sagas trade strong consistency for availability. During the compensation window, Alice's balance is temporarily $100 lower. I'd design the application to show this as a pending transfer, and surface both available balance and total balance including in-flight operations. This eventual consistency is the explicit tradeoff for avoiding 2PC's blocking problem.'",
    proTip: null,
  },
  {
    id: "q24",
    subtopic: "Saga Pattern",
    style: "Cross-Subtopic Bridge (2PC × Saga)",
    question:
      "Your interviewer asks: 'You chose the saga pattern for cross-database transfers. I need strict consistency — the total money in the system must never appear incorrect, even temporarily. Does this change your recommendation?' What's the strongest response?",
    options: [
      "Sagas can be made strictly consistent by adding distributed locks around the entire saga execution, preventing anyone from reading intermediate states.",
      "If strict consistency is a hard requirement — meaning no observer should ever see a state where money appears to have disappeared — then I need to switch to 2PC. Sagas are eventually consistent by design; there's always a window where intermediate states are visible. 2PC's blocking and coordinator availability challenges are the price of that consistency. I'd also invest heavily in coordinator HA and persistent logging.",
      "Strict consistency across databases is impossible according to the CAP theorem, so the interviewer's requirement is unrealistic.",
      "I'd keep sagas but add a separate reconciliation service that runs every second to detect and fix inconsistencies, giving the appearance of strict consistency.",
    ],
    correctIndex: 1,
    explanation:
      "The content positions 2PC and sagas as different tradeoffs: '2PC for strong consistency, Sagas for resilience.' If the interviewer explicitly requires that no observer ever sees inconsistent state, sagas fundamentally can't provide this — their intermediate states are committed and visible. 2PC is the right choice despite its blocking problem. The best answer acknowledges the tradeoff explicitly: you accept 2PC's availability risks in exchange for the consistency guarantee.",
    interviewScript:
      "In your interview, say: 'That changes my recommendation. Sagas have visible intermediate states by design — the money temporarily appears to decrease. For strict consistency, I need 2PC despite its blocking tradeoff. I'd mitigate 2PC's risks with coordinator high availability, persistent transaction logs, and short timeout windows. The choice between 2PC and sagas ultimately comes down to whether you prioritize consistency or availability.'",
    proTip:
      "Always frame contention solutions as tradeoffs, not 'right vs. wrong.' Saying 'I chose sagas for resilience, but 2PC for consistency' shows you understand both tools and their appropriate contexts.",
  },
  {
    id: "q25",
    subtopic: "Deadlock Prevention",
    style: "Scenario-Based",
    question:
      "Users A (ID: 456) and B (ID: 123) simultaneously transfer money to each other. Transfer A→B locks user 456 first then tries to lock 123. Transfer B→A locks user 123 first then tries to lock 456. This creates a deadlock. A candidate proposes: 'Always lock the initiator's account first.' Why doesn't this solve the problem?",
    options: [
      "Locking the initiator first is correct because it ensures a consistent order relative to each transaction's perspective.",
      "'Lock the initiator first' creates exactly this deadlock scenario — A initiates and locks 456, B initiates and locks 123, and they deadlock. The correct solution is ordered locking: always lock by ascending user ID regardless of who initiated. Both transactions lock 123 first (lower ID), then 456. This eliminates circular waiting because all transactions follow the same global acquisition order.",
      "The deadlock can't actually occur because modern databases detect it within milliseconds and abort one transaction automatically.",
      "The solution is to acquire both locks simultaneously using a multi-key lock command, rather than acquiring them sequentially.",
    ],
    correctIndex: 1,
    explanation:
      "The content explicitly warns: 'This is critical — you must sort all participants by the same key, not lock the initiator first.' If Alice (456) transfers to Bob (123), lock 123 first because 123 < 456. If Bob transfers to Alice, STILL lock 123 first. The ordering must be globally consistent — based on a deterministic key (like user ID), not relative to the business logic (like 'who sent the transfer'). 'Lock the initiator first' creates different orderings for different transactions, which is exactly how deadlocks occur.",
    interviewScript:
      "In your interview, say: 'Locking the initiator first creates different orderings for different transactions — that's what causes deadlocks. The fix is deterministic ordered locking: sort all participants by a global key like user ID and always acquire locks in that order. If IDs are 456 and 123, both transactions lock 123 first, then 456, regardless of who initiated. This eliminates circular waiting.'",
    proTip: null,
  },
  {
    id: "q26",
    subtopic: "Deadlock Prevention",
    style: "Interviewer Pushback",
    question:
      "You propose ordered locking for deadlock prevention. Your interviewer asks: 'What if a transaction needs to lock resources it doesn't know about upfront? For example, a cascade operation where locking resource A reveals that you also need to lock resource B.' How do you handle this?",
    options: [
      "Ordered locking can't handle this case. You should switch to optimistic concurrency control, which doesn't use locks and therefore can't deadlock.",
      "Acquire all discovered locks in sorted order by releasing existing locks and re-acquiring them all together in the correct order. This is called 'lock escalation.'",
      "This is where ordered locking isn't practical, and you fall back to database timeout configurations as a safety net. Set transaction timeouts so that if a deadlock does form from unpredictable lock acquisition, the deadlocked transactions get killed after a reasonable wait period and can retry. Most databases also have automatic deadlock detection that aborts one transaction when cycles are detected.",
      "Pre-analyze all possible lock dependencies at application startup and create a global lock ordering table that covers every possible cascade path.",
    ],
    correctIndex: 2,
    explanation:
      "The content states: 'As a fallback, database timeout configurations serve as your safety net when ordered locking isn't practical or when you miss edge cases. Set transaction timeouts so deadlocked transactions get killed after a reasonable wait period and can retry with proper ordering. Most modern databases also have automatic deadlock detection that kills one transaction when cycles are detected, but this should be your fallback, not your primary strategy.'",
    interviewScript:
      "In your interview, say: 'When lock acquisition is dynamic, ordered locking isn't always practical. I'd rely on database deadlock detection and transaction timeouts as the safety net. If a deadlock forms, the database detects the cycle and aborts one transaction, which can then retry. Timeouts provide a hard upper bound on wait time. These are fallbacks — I'd still use ordered locking wherever possible.'",
    proTip: null,
  },
  {
    id: "q27",
    subtopic: "Hot Partition / Celebrity Problem",
    style: "Critical Failure Modes",
    question:
      "Taylor Swift announces a surprise concert. 500,000 users hit your ticketing system simultaneously for the same 1,000 seats. You've implemented pessimistic locking with FOR UPDATE. Your system uses read replicas and horizontal sharding. Why do none of your normal scaling strategies help here?",
    options: [
      "Read replicas don't help because they can serve the seat availability data, reducing read load on the primary. The issue is only with the connection pool size.",
      "Sharding distributes data across nodes, but you can't split one concert across multiple shards because everyone wants that specific concert's rows. Read replicas serve stale data for writes. Load balancing distributes requests to different servers, but they all contend for the same database rows. The bottleneck is serialized writes to a single hot resource, which no horizontal scaling strategy addresses.",
      "The scaling strategies do help — sharding puts different seat sections on different shards, and read replicas handle the availability checks, leaving only the final purchase hitting the primary.",
      "All scaling strategies fail because PostgreSQL can't handle more than 10,000 concurrent connections regardless of hardware.",
    ],
    correctIndex: 1,
    explanation:
      "The content explains: 'Sharding doesn't help because you can't split one Taylor Swift concert across multiple databases. Load balancing doesn't help because all servers compete for the same database row. Even read replicas don't help because the bottleneck is on the writes.' This is the fundamental nature of the hot partition/celebrity problem — when demand concentrates on a single resource, horizontal scaling strategies that distribute across many resources don't help.",
    interviewScript:
      "In your interview, say: 'This is the celebrity problem — normal scaling fails because demand concentrates on one resource. Sharding can't split one concert. Read replicas can't help with writes. Load balancing just distributes the contention across servers. I'd use queue-based serialization: funnel all requests for this concert into a dedicated queue processed by a single worker, eliminating contention by making operations sequential. Users wait longer, but the system stays stable.'",
    proTip: null,
  },
  {
    id: "q28",
    subtopic: "Hot Partition / Celebrity Problem",
    style: "Cross-Subtopic Bridge (Hot Partition × Queue Serialization)",
    question:
      "For the Taylor Swift concert scenario, you implement queue-based serialization — all purchase requests go into a single queue processed sequentially. Your interviewer says: 'Now your throughput is limited by one worker. At 5ms per transaction, you process 200/sec. 500,000 users are waiting.' What's the best architectural response?",
    options: [
      "Add more workers to the queue to increase throughput, using distributed locks to prevent double-booking between workers.",
      "The queue is just a buffer — 500,000 users don't all need to succeed. Once 1,000 seats are sold (at 200/sec, about 5 seconds), remaining users get immediate 'sold out' responses. The queue absorbs the traffic spike while the worker processes at a sustainable rate. For user experience, show position-in-queue and estimated wait time instead of making users spam refresh.",
      "Replace the queue with optimistic concurrency to allow parallel processing — at 5ms per transaction with rare conflicts, most will succeed on the first try.",
      "Shard the 1,000 seats across 10 queues (100 seats each) to achieve 10x throughput while maintaining serialization within each shard.",
    ],
    correctIndex: 1,
    explanation:
      "The content states: 'The queue acts as a buffer that can absorb traffic spikes while the worker processes requests at a sustainable rate.' The key insight is that you don't need to process 500,000 requests — you need to sell 1,000 seats. At 200/sec, that's 5 seconds. The queue's job is to absorb the spike and provide orderly processing. Option D (sharding seats across queues) is also reasonable but the content emphasizes the buffer/spike-absorption role of the queue rather than throughput optimization.",
    interviewScript:
      "In your interview, say: 'The queue is a spike absorber, not a throughput solution. I only need to sell 1,000 seats — that's 5 seconds at 200/sec. Once sold out, remaining queued requests get immediate rejections. I'd show users their queue position and estimated wait time. The tradeoff is latency: users wait seconds instead of getting instant results, but the system stays stable instead of collapsing under contention.'",
    proTip:
      "Questioning whether you can 'change the problem' is powerful in interviews. Here, the problem isn't '500K concurrent writes' — it's 'sell 1,000 seats in order.' Reframing shows strong system design thinking.",
  },
  {
    id: "q29",
    subtopic: "Reservations & Intermediate States",
    style: "Cross-Subtopic Bridge (Distributed Locks × Reservations)",
    question:
      "Your Uber-like ride dispatch system sends ride requests to the nearest driver. Without coordination, multiple customers could be matched to the same driver simultaneously. A candidate proposes checking driver status at request time. What's the better approach and how does it use distributed locks?",
    options: [
      "Use optimistic concurrency on the driver's status column — if two dispatches conflict, one retries with the next nearest driver.",
      "Set the driver's status to 'pending_request' immediately when sending a ride request, using a distributed lock with TTL. This creates a temporary reservation that prevents other requests from targeting the same driver. If the driver doesn't respond within 10 seconds, the TTL expires and the lock auto-releases, making the driver available again. The contention window shrinks from the entire ride acceptance flow to just the dispatch step.",
      "Use a global FIFO queue for all ride requests and process them one at a time to prevent concurrent dispatch to the same driver.",
      "Let multiple requests go to the same driver and let the driver choose which ride to accept. The others automatically get rerouted.",
    ],
    correctIndex: 1,
    explanation:
      "The content describes this pattern: 'Uber sets driver status to pending_request when sending ride requests, which prevents multiple simultaneous requests to the same driver. Use either a cache with TTL for automatic cleanup when drivers don't respond within 10 seconds.' This is the reservation pattern using distributed locks — creating an intermediate state that gives temporary exclusive access. The TTL handles the timeout case automatically. The contention window shrinks from the entire acceptance flow to just the dispatch moment.",
    interviewScript:
      "In your interview, say: 'I'd use the reservation pattern with distributed locks. When dispatching, immediately set the driver to pending_request with a 10-second TTL. This prevents concurrent requests to the same driver. If they don't respond, the TTL releases the reservation automatically. This shrinks the contention window from the entire acceptance flow to just the dispatch step.'",
    proTip: null,
  },
  {
    id: "q30",
    subtopic: "Reservations & Intermediate States",
    style: "Estimation-Backed Reasoning",
    question:
      "Your e-commerce checkout takes 3 minutes on average (selecting items, entering payment, confirming). Without reservations, users frequently complete checkout only to find items sold out. You implement cart holds with a 10-minute TTL. With 50,000 concurrent shoppers and 500 limited items, what new problem does the reservation system introduce?",
    options: [
      "The 10-minute TTL is too short — users who take longer than 10 minutes lose their items, creating a worse user experience than the original problem.",
      "Reservation abuse — users (or bots) can reserve all 500 items by adding them to carts, effectively locking out legitimate buyers for 10 minutes even if they never intend to purchase. You need rate limiting on reservations, shorter TTLs for suspicious patterns, and maximum reservation limits per user to prevent hoarding.",
      "The distributed lock system (Redis) becomes a single point of failure. If Redis goes down, no one can make reservations and the system is completely blocked.",
      "With 50,000 shoppers and 10-minute TTLs, the reservation table grows to millions of rows, causing database performance degradation.",
    ],
    correctIndex: 1,
    explanation:
      "The reservation pattern introduces a new attack surface: reservation hoarding. With 500 limited items and 10-minute TTLs, a bot can reserve all items by adding them to 500 carts, blocking all legitimate buyers for 10 minutes. When the TTLs expire, the bot re-reserves everything. This is a real problem for flash sales and limited-edition drops. Mitigations include per-user reservation limits, shorter TTLs, CAPTCHA, and rate limiting on the reservation endpoint.",
    interviewScript:
      "In your interview, say: 'Reservations introduce a hoarding attack surface. Bots can reserve all 500 items without purchasing, blocking legitimate buyers for the TTL duration. I'd mitigate with per-user reservation limits, shorter TTLs for users who frequently abandon, CAPTCHA on the reservation step, and rate limiting. The reservation system solves the contention UX problem but needs its own abuse prevention layer.'",
    proTip:
      "Always think about adversarial users when designing reservation systems. Interviewers love to probe 'what if someone abuses this?' and showing you've already considered it is a strong signal.",
  },
  {
    id: "q31",
    subtopic: "Choosing the Right Approach",
    style: "Cross-Subtopic Bridge (Pessimistic × Optimistic)",
    question:
      "You're designing a review system like Yelp. The interviewer asks: 'Hundreds of reviews arrive per second for popular restaurants, all updating the average rating. What concurrency approach do you use?' You need to consider that reviews for the SAME restaurant create contention. What's the best approach and why?",
    options: [
      "Pessimistic locking — hundreds per second for the same restaurant means high contention. Lock the restaurant row with FOR UPDATE during each review submission to ensure accurate rating calculations.",
      "SERIALIZABLE isolation — let the database handle conflict detection automatically so you don't need to implement retry logic.",
      "Optimistic concurrency with a dedicated version column. While contention seems high at 'hundreds per second,' the actual conflict rate on any SINGLE restaurant is much lower (reviews spread across millions of restaurants). The few conflicts that occur on viral restaurants are cheaper to retry than the overhead of pessimistic locks across all restaurants.",
      "Queue-based serialization — funnel all rating updates for each restaurant into a per-restaurant queue processed by a single worker.",
    ],
    correctIndex: 2,
    explanation:
      "The content lists Yelp as 'A good example of optimistic concurrency control.' The key insight is that while total volume is high, contention per restaurant is low — reviews distribute across millions of restaurants. Even for viral restaurants, the conflict rate doesn't justify pessimistic locking's overhead applied to every review. OCC with a version column handles the occasional conflict via retry, with much better average-case performance. The content also notes using a 'dedicated version column' specifically to avoid the ABA problem.",
    interviewScript:
      "In your interview, say: 'I'd use optimistic concurrency with a dedicated version column. While total review volume is high, contention per restaurant is low — reviews spread across millions of restaurants. The occasional conflict on a viral restaurant is cheaper to retry than applying pessimistic locks to every review. I'd use a dedicated version column, not the avg_rating, to avoid the ABA problem.'",
    proTip: null,
  },
  {
    id: "q32",
    subtopic: "Choosing the Right Approach",
    style: "Ordering/Sequencing",
    question:
      "When tackling a contention problem in a system design interview, the content recommends a specific decision sequence. What is the correct order of evaluation?",
    options: [
      "Evaluate contention frequency → Choose optimistic or pessimistic → Implement distributed locks → Add queue serialization if needed.",
      "Assess if a single database can hold all contended data → If yes, choose pessimistic (high contention) or optimistic (low contention) → Only if you truly need multiple databases, consider distributed coordination (2PC for consistency, Sagas for resilience) → Add reservations for user-facing competitive flows.",
      "Start with distributed locks for maximum safety → Downgrade to database transactions if performance allows → Add sagas for cross-service coordination.",
      "Implement SERIALIZABLE isolation everywhere → Monitor for performance issues → Downgrade to optimistic concurrency where abort rates are high → Use 2PC for cross-database operations.",
    ],
    correctIndex: 1,
    explanation:
      "The content's decision framework is clear: 'Start here. Can you keep all the contended data in a single database? If yes, use pessimistic locking or optimistic concurrency based on your conflict frequency.' It emphasizes: 'Nine times out of ten, this is entirely possible and avoids the need for distributed coordination.' Only when you've truly outgrown a single database should you consider 2PC or sagas. The content also adds reservations as a UX-layer solution for competitive user flows.",
    interviewScript:
      "In your interview, say: 'My first question is always: can I keep the contended data in a single database? If yes — and it usually is — I choose between pessimistic locking for high contention and optimistic concurrency for low contention. Only if I truly need multiple databases do I reach for distributed coordination. And for user-facing flows, I add a reservation layer to improve UX.'",
    proTip:
      "The strongest interview signal in contention discussions is starting simple. Candidates who immediately reach for distributed locks or 2PC when a single database with FOR UPDATE would suffice are red flags to senior interviewers.",
  },
];

const SUBTOPICS_ORDER = [
  "Race Conditions & The Problem",
  "Atomicity & Transactions",
  "Pessimistic Locking",
  "Isolation Levels",
  "Optimistic Concurrency Control",
  "ABA Problem",
  "Two-Phase Commit (2PC)",
  "Distributed Locks",
  "Saga Pattern",
  "Deadlock Prevention",
  "Hot Partition / Celebrity Problem",
  "Reservations & Intermediate States",
  "Choosing the Right Approach",
];

const SUBTOPIC_COUNTS = SUBTOPICS_ORDER.map((name) => ({
  name,
  count: QUESTIONS.filter((q) => q.subtopic === name).length,
}));

const CONFIDENCE_LEVELS = ["Guessing", "Somewhat Sure", "Very Confident"];

const TIMER_SECONDS = 90;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  if (pct >= 90) return { label: "Staff-ready — you'd ace this topic", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  if (pct >= 75) return { label: "Strong Senior — solid, minor gaps to close", color: "text-blue-400", bg: "bg-blue-500/20" };
  if (pct >= 60) return { label: "SDE2-level — review the weak areas below", color: "text-amber-400", bg: "bg-amber-500/20" };
  return { label: "Needs deep review — revisit the fundamentals", color: "text-red-400", bg: "bg-red-500/20" };
}

export default function ContentionQuiz({ quizSlug = 'patterns-dealing-with-contention' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [totalStartTime, setTotalStartTime] = useState(null);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

  const currentQuestion = questions[currentIdx];

  const startQuiz = useCallback(
    (m, questionSubset) => {
      const qs = questionSubset
        ? questionSubset
        : m === "shuffled"
        ? shuffleArray(QUESTIONS)
        : [...QUESTIONS].sort(
            (a, b) =>
              SUBTOPICS_ORDER.indexOf(a.subtopic) -
              SUBTOPICS_ORDER.indexOf(b.subtopic)
          );
      setQuestions(qs);
      setCurrentIdx(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setAnswers({});
      setSkipped([]);
      setFlagged(new Set());
      setTimer(TIMER_SECONDS);
      setTimedOut(false);
      setTotalStartTime(Date.now());
      setTotalElapsed(0);
      setScreen("quiz");
      startNewAttempt(qs.map(q => q.id));
    },
    [startNewAttempt]
  );

  const handleResume = useCallback(() => {
    const data = resumeAttempt();
    if (!data) return;
    const order = data.questionOrder;
    let qs;
    if (order && order.length > 0) {
      qs = order.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    } else {
      qs = [...QUESTIONS];
    }
    // Restore answers from saved data
    const restoredAnswers = {};
    for (const [qid, r] of Object.entries(data.questionResults)) {
      restoredAnswers[qid] = {
        selected: r.selectedIndex,
        confidence: r.confidence,
        correct: r.isCorrect,
        timedOut: r.timedOut || false,
      };
    }
    setQuestions(qs);
    // Find first unanswered question
    const firstUnanswered = qs.findIndex(q => !data.questionResults[q.id]);
    setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : qs.length - 1);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers(restoredAnswers);
    setSkipped([]);
    setFlagged(new Set());
    setTimer(TIMER_SECONDS);
    setTimedOut(false);
    setTotalStartTime(Date.now());
    setTotalElapsed(0);
    setScreen("quiz");
  }, [resumeAttempt]);

  useEffect(() => {
    if (screen !== "quiz" || submitted) return;
    return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setSubmitted(true);
          return 0;
        }
        return t;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, currentIdx, submitted]);

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || confidence === null) return;
    clearInterval(timerRef.current);
    setSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: selectedOption,
        confidence,
        correct: isCorrect,
        timedOut: false,
      },
    }));
    persistAnswer(currentQuestion.id, {
      selectedIndex: selectedOption,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
      confidence,
      timedOut: false,
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(TIMER_SECONDS);
    } else if (skipped.length > 0) {
      const skippedQs = skipped.map((id) => QUESTIONS.find((q) => q.id === id));
      setSkipped([]);
      setQuestions((prev) => [...prev, ...skippedQs]);
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(TIMER_SECONDS);
    } else {
      const elapsed = Math.round((Date.now() - totalStartTime) / 1000);
      setTotalElapsed(elapsed);
      const correctCount = Object.values(answers).filter(a => a.correct).length;
      completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, elapsed);
      setScreen("results");
    }
  };

  const handleSkip = () => {
    if (submitted) return;
    clearInterval(timerRef.current);
    setSkipped((prev) => [...prev, currentQuestion.id]);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(TIMER_SECONDS);
    } else {
      const skippedQs = [...skipped, currentQuestion.id].map((id) =>
        QUESTIONS.find((q) => q.id === id)
      );
      setQuestions((prev) => [...prev, ...skippedQs]);
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(TIMER_SECONDS);
      setSkipped([]);
    }
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };

  useEffect(() => {
    if (screen !== "quiz" || submitted) return;
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (["1", "a"].includes(key)) handleSelect(0);
      else if (["2", "b"].includes(key)) handleSelect(1);
      else if (["3", "c"].includes(key)) handleSelect(2);
      else if (["4", "d"].includes(key)) handleSelect(3);
      else if (key === "enter" && selectedOption !== null && confidence !== null)
        handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submitted, selectedOption, confidence]);

  useEffect(() => {
    if (screen !== "quiz" || !submitted || timedOut) return;
    const handler = (e) => {
      if (e.key === "Enter") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submitted, timedOut, currentIdx, questions.length, skipped.length]);

  // Save timed-out answers
  useEffect(() => {
    if (timedOut && currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          selected: selectedOption,
          confidence: null,
          correct: false,
          timedOut: true,
        },
      }));
      persistAnswer(currentQuestion.id, {
        selectedIndex: selectedOption,
        correctIndex: currentQuestion.correctIndex,
        isCorrect: false,
        confidence: null,
        timedOut: true,
      });
    }
  }, [timedOut]);

  const timerColor =
    timer <= 15
      ? "text-red-400"
      : timer <= 30
      ? "text-amber-400"
      : "text-slate-300";
  const timerBg =
    timer <= 15
      ? "bg-red-500"
      : timer <= 30
      ? "bg-amber-500"
      : "bg-blue-500";

  // --- LANDING SCREEN ---
  if (screen === "landing") {
    const totalTime = Math.round((QUESTIONS.length * 75) / 60);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4">
              <Target size={14} />
              FAANG SDE2 — Hard
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dealing with Contention
            </h1>
            <p className="text-slate-400 text-lg">
              Race conditions, locking strategies, distributed coordination, and
              concurrency control patterns for system design interviews.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-8">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {QUESTIONS.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> ~{totalTime} min
            </span>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Coverage Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUBTOPIC_COUNTS.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50"
                >
                  <span className="text-sm text-slate-300 truncate mr-2">
                    {s.name}
                  </span>
                  <span className="text-xs font-mono text-blue-400 whitespace-nowrap">
                    {s.count}q
                  </span>
                </div>
              ))}
            </div>
          </div>
          {isResuming && resumeData && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 font-medium text-sm">In-progress attempt found</p>
                  <p className="text-slate-400 text-xs mt-1">{resumeData.answeredCount}/{QUESTIONS.length} questions answered</p>
                </div>
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium text-sm border border-amber-500/30 transition-colors"
                >
                  <RotateCcw size={14} /> Resume
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMode("ordered");
                startQuiz("ordered");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-200 font-medium"
            >
              <List size={18} /> Section Order
            </button>
            <button
              onClick={() => {
                setMode("shuffled");
                startQuiz("shuffled");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium"
            >
              <Shuffle size={18} /> {isResuming ? 'Start Fresh' : 'Shuffled (Recommended)'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (screen === "results") {
    const totalQ = questions.length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const pct = Math.round((correctCount / totalQ) * 100);
    const grade = getGrade(pct);

    const subtopicScores = SUBTOPICS_ORDER.map((name) => {
      const qs = questions.filter((q) => q.subtopic === name);
      const correct = qs.filter((q) => answers[q.id]?.correct).length;
      return { name, total: qs.length, correct, pct: qs.length ? Math.round((correct / qs.length) * 100) : 0 };
    }).filter((s) => s.total > 0);

    const luckyGuesses = Object.entries(answers)
      .filter(([, a]) => a.correct && a.confidence === "Guessing")
      .map(([id]) => QUESTIONS.find((q) => q.id === id));

    const overconfidentMisses = Object.entries(answers)
      .filter(([, a]) => !a.correct && a.confidence === "Very Confident")
      .map(([id]) => QUESTIONS.find((q) => q.id === id));

    const incorrect = questions.filter(
      (q) => answers[q.id] && !answers[q.id].correct
    );

    const flaggedQs = questions.filter((q) => flagged.has(q.id));

    const weakSubtopics = subtopicScores
      .filter((s) => s.pct < 70)
      .map((s) => s.name);

    const minutes = Math.floor(totalElapsed / 60);
    const seconds = totalElapsed % 60;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${grade.bg} ${grade.color} text-sm font-medium mb-4`}
            >
              <Award size={16} />
              {grade.label}
            </div>
            <div className="text-6xl font-bold mb-2">
              <span className={grade.color}>{pct}%</span>
            </div>
            <p className="text-slate-400">
              {correctCount} / {totalQ} correct — {minutes}m {seconds}s total
            </p>
          </div>

          {/* Per-subtopic breakdown */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 size={14} /> Subtopic Breakdown
            </h3>
            <div className="space-y-3">
              {subtopicScores.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{s.name}</span>
                    <span
                      className={
                        s.pct >= 70 ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {s.correct}/{s.total} ({s.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        s.pct >= 70 ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence analysis */}
          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Confidence Analysis
              </h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-1">
                    <AlertTriangle size={14} /> Lucky Guesses (
                    {luckyGuesses.length}) — hidden weak spots
                  </h4>
                  <div className="space-y-1">
                    {luckyGuesses.map((q) => (
                      <p key={q.id} className="text-sm text-slate-400 pl-4">
                        • {q.subtopic}: {q.question.slice(0, 80)}...
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <h4 className="text-red-400 text-sm font-medium mb-2 flex items-center gap-1">
                    <XCircle size={14} /> Overconfident Misses (
                    {overconfidentMisses.length}) — dangerous misconceptions
                  </h4>
                  <div className="space-y-1">
                    {overconfidentMisses.map((q) => (
                      <p key={q.id} className="text-sm text-slate-400 pl-4">
                        • {q.subtopic}: {q.question.slice(0, 80)}...
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Incorrect questions */}
          {incorrect.length > 0 && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <XCircle size={14} /> Incorrect ({incorrect.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrect.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div className="text-xs text-blue-400 mb-1">
                      {q.subtopic}
                    </div>
                    <p className="text-sm text-slate-200 mb-2">{q.question}</p>
                    {answers[q.id]?.selected !== null &&
                      answers[q.id]?.selected !== undefined && (
                        <p className="text-sm text-red-400 mb-1">
                          Your answer:{" "}
                          {String.fromCharCode(65 + answers[q.id].selected)}.{" "}
                          {q.options[answers[q.id].selected]?.slice(0, 100)}...
                        </p>
                      )}
                    <p className="text-sm text-emerald-400 mb-2">
                      Correct:{" "}
                      {String.fromCharCode(65 + q.correctIndex)}.{" "}
                      {q.options[q.correctIndex].slice(0, 100)}...
                    </p>
                    <p className="text-xs text-slate-400">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged questions */}
          {flaggedQs.length > 0 && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flag size={14} /> Flagged for Review ({flaggedQs.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {flaggedQs.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div className="text-xs text-blue-400 mb-1">
                      {q.subtopic}
                    </div>
                    <p className="text-sm text-slate-200 mb-2">{q.question}</p>
                    <p className="text-sm text-emerald-400 mb-2">
                      Correct:{" "}
                      {String.fromCharCode(65 + q.correctIndex)}.{" "}
                      {q.options[q.correctIndex].slice(0, 100)}...
                    </p>
                    <p className="text-xs text-slate-400">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {incorrect.length > 0 && (
              <button
                onClick={() => startQuiz(mode, shuffleArray(incorrect))}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-medium transition-colors"
              >
                <RotateCcw size={16} /> Retry Missed ({incorrect.length})
              </button>
            )}
            {weakSubtopics.length > 0 && (
              <button
                onClick={() => {
                  const weakQs = QUESTIONS.filter((q) =>
                    weakSubtopics.includes(q.subtopic)
                  );
                  startQuiz(mode, shuffleArray(weakQs));
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 font-medium transition-colors"
              >
                <TrendingUp size={16} /> Retry Weak Subtopics
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  if (!currentQuestion) {
    const elapsed = Math.round((Date.now() - totalStartTime) / 1000);
    setTotalElapsed(elapsed);
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, elapsed);
    setScreen("results");
    return null;
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / questions.length) * 100);
  const isCorrect = submitted && selectedOption === currentQuestion.correctIndex;
  const isWrong = submitted && selectedOption !== null && selectedOption !== currentQuestion.correctIndex;
  const isLast = currentIdx === questions.length - 1 && skipped.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-400">
            {currentIdx + 1} / {questions.length}
            {skipped.length > 0 && (
              <span className="text-amber-400 ml-2">
                ({skipped.length} skipped)
              </span>
            )}
          </div>
          <div className={`flex items-center gap-1 font-mono text-lg font-bold ${timerColor}`}>
            <Clock size={18} />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 mb-6">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Subtopic tag and style */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
            {currentQuestion.subtopic}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
            {currentQuestion.style}
          </span>
          {flagged.has(currentQuestion.id) && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">
              Flagged
            </span>
          )}
        </div>

        {/* Question */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-5">
          <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {currentQuestion.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let borderClass = "border-slate-700 hover:border-slate-500";
            let bgClass = "bg-slate-900";
            if (submitted) {
              if (i === currentQuestion.correctIndex) {
                borderClass = "border-emerald-500";
                bgClass = "bg-emerald-500/10";
              } else if (i === selectedOption && i !== currentQuestion.correctIndex) {
                borderClass = "border-red-500";
                bgClass = "bg-red-500/10";
              } else {
                borderClass = "border-slate-800";
                bgClass = "bg-slate-900/50 opacity-60";
              }
            } else if (i === selectedOption) {
              borderClass = "border-blue-500";
              bgClass = "bg-blue-500/10";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-xl border ${borderClass} ${bgClass} transition-all`}
              >
                <div className="flex gap-3">
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      submitted && i === currentQuestion.correctIndex
                        ? "bg-emerald-500 text-white"
                        : submitted && i === selectedOption
                        ? "bg-red-500 text-white"
                        : i === selectedOption
                        ? "bg-blue-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-200">
                    {opt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confidence selector + action buttons */}
        {!submitted && (
          <div className="space-y-4">
            {selectedOption !== null && (
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  How confident are you?
                </p>
                <div className="flex gap-2">
                  {CONFIDENCE_LEVELS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setConfidence(c)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        confidence === c
                          ? "border-blue-500 bg-blue-500/20 text-blue-300"
                          : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-sm transition-colors"
              >
                <SkipForward size={14} /> Skip
              </button>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400"
                }`}
              >
                <Flag size={14} /> {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || confidence === null}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  selectedOption !== null && confidence !== null
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                Submit <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div className="space-y-4 mb-8">
            {!timedOut && isCorrect && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                <CheckCircle2 size={16} /> Correct!
              </div>
            )}
            {!timedOut && isWrong && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <XCircle size={16} /> Incorrect.
              </div>
            )}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen size={14} /> Explanation
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-1">
                  <MessageSquare size={14} /> Interview Script
                </h4>
                <p className="text-sm text-blue-200 leading-relaxed italic">
                  {currentQuestion.interviewScript}
                </p>
              </div>
              {currentQuestion.proTip && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-1 flex items-center gap-1">
                    <Lightbulb size={14} /> Pro Tip
                  </h4>
                  <p className="text-sm text-purple-200 leading-relaxed">
                    {currentQuestion.proTip}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400"
                }`}
              >
                <Flag size={14} />{" "}
                {flagged.has(currentQuestion.id) ? "Flagged" : "Flag for Review"}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
              >
                {isLast ? "View Results" : "Next Question"}{" "}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
