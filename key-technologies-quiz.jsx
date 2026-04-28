// === COVERAGE MANIFEST ===
// Source: "Key Technologies" — System Design in a Hurry
// Type: BROAD SURVEY across 12 building-block categories
// Ladder enforced per Part: L1 → L2 → L3 → L4 → L5 (climbs, never jumps)
//
// PARTS & CONCEPT IDs:
//
// Part A — Database Selection Strategy & Anti-Patterns
//   A1 SQL-vs-NoSQL anti-comparison is a yellow flag
//   A2 Heuristic: product=relational, infra=NoSQL
//   A3 "I need relational because I have relationships" — false
//   A4 "I need NoSQL because I need scale" — false
//   A5 Right framing: discuss specific features of YOUR DB
//   A6 SQL/NoSQL capabilities are highly overlapping
//   Questions: q1 (L3), q2 (L4), q3 (L5)
//
// Part B — Relational Databases
//   B1 Tables/rows/cols, SQL declarative
//   B2 Default for transactional data
//   B3 Joins — combine tables; perf bottleneck
//   B4 Indexes — speed reads (B-Tree/Hash)
//   B5 Multi-column / specialized indexes (geo, FT)
//   B6 Arbitrarily many indexes
//   B7 Transactions — atomic group; prevents orphan state
//   B8 Postgres / MySQL most common
//   Questions: q4 (L1), q5 (L2), q6 (L3), q7 (L4), q8 (L5)
//
// Part C — NoSQL Databases
//   C1 Schema-less / flexible
//   C2 Designed for horizontal scale
//   C3 Four shapes: KV / document / column / graph
//   C4 Strong → eventual consistency spectrum
//   C5 Indexing supported
//   C6 Consistent hashing / sharding for scale
//   C7 Use-case fit: evolving schema / horizontal / big-data
//   C8 NoSQL-strong areas ≠ relational-fail areas
//   C9 DynamoDB / Cassandra / MongoDB
//   C10 Cassandra append-only — write-heavy
//   Questions: q9 (L1), q10 (L2), q11 (L3), q12 (L4), q13 (L5)
//
// Part D — Blob Storage
//   D1 Use for large unstructured: images/videos/files
//   D2 Avoid blobs in primary DB
//   D3 Upload → URL → download
//   D4 DB stores pointers; blob store holds data
//   D5 Pairs with CDN as origin
//   D6 S3 / GCS / Azure (S3-compatible APIs common)
//   D7 Durability — replication + erasure coding
//   D8 Effectively infinite scale (assume given)
//   D9 Cost — 50x cheaper than DDB ($0.023 vs $1.25/GB)
//   D10 Encryption + ACLs
//   D11 Presigned URLs — temporary access
//   D12 Multipart / chunking — resume + parallel
//   D13 Presigned upload flow (4 steps)
//   D14 Presigned download flow via CDN
//   Questions: q14 (L1), q15 (L2), q16 (L3), q17 (L4), q18 (L5)
//
// Part E — Search Optimized Database
//   E1 Full-text search at scale
//   E2 LIKE '%term%' = full table scan
//   E3 Inverted index — word → docs
//   E4 Tokenization — text → words
//   E5 Stemming — running/runs → run
//   E6 Fuzzy via edit distance
//   E7 Scaling — shard + add nodes
//   E8 Elasticsearch (built on Lucene)
//   E9 Postgres GIN / Redis FT alternatives
//   E10 Reduce footprint via existing-DB FT
//   Questions: q19 (L1), q20 (L2), q21 (L3), q22 (L4), q23 (L5)
//
// Part F — API Gateway
//   F1 Routes incoming requests to backends
//   F2 Microservice architecture
//   F3 Cross-cutting: auth / rate-limit / logging
//   F4 First point of contact in product-design
//   F5 AWS API Gateway / Kong / Apigee / nginx
//   F6 Interviewers rarely drill in
//   Questions: q24 (L1), q25 (L2), q26 (L3)
//
// Part G — Load Balancer
//   G1 Spread traffic across machines
//   G2 LB wherever multiple machines handle same request
//   G3 Drawing convention — abstract at the edge
//   G4 L4 vs L7 — most common decision
//   G5 Persistent connections (websockets) → L4
//   G6 Otherwise → L7 (routing flexibility)
//   G7 ELB / NGINX / HAProxy
//   G8 Hardware LB at extreme traffic
//   Questions: q27 (L1), q28 (L2), q29 (L3), q30 (L4), q31 (L5)
//
// Part H — Queue
//   H1 Buffer for bursty load
//   H2 Distribute work across worker pool
//   H3 Decouples producer / consumer
//   H4 Don't drop — wait beyond capacity
//   H5 AVOID in synchronous low-latency
//   H6 Ride-share surge buffering
//   H7 Photo-processing distribution
//   H8 FIFO default
//   H9 Kafka — priority/time ordering
//   H10 Retry mechanisms — config delay/max
//   H11 DLQ — debug/audit
//   H12 Partitioning + partition key
//   H13 Backpressure — slow/reject producer
//   H14 Queue obscures capacity problems
//   H15 Kafka / SQS
//   Questions: q32 (L1), q33 (L2), q34 (L3), q35 (L4), q36 (L5)
//
// Part I — Streams / Event Sourcing
//   I1 Real-time large-volume processing
//   I2 Event sourcing — state = event sequence
//   I3 Audit / reverse / replay
//   I4 KEY DIFF: streams retain; consumers re-read
//   I5 Real-time analytics (Flink/Spark)
//   I6 Banking transactions / replay
//   I7 Pub-sub fan-out (chat room)
//   I8 Partitioning + partition key
//   I9 Multiple consumer groups — independent
//   I10 Replication
//   I11 Windowing — time/count batches
//   I12 Kafka / Flink / Kinesis
//   Questions: q37 (L1), q38 (L2), q39 (L3), q40 (L4), q41 (L5)
//
// Part J — Distributed Lock
//   J1 Lock resource for ~minutes (10-min ticket)
//   J2 Distinct from DB transaction locks (short)
//   J3 KV store + atomic set-if-absent
//   J4 Lock expiry — auto-release on crash
//   J5 Granularity — single vs group
//   J6 E-commerce checkout
//   J7 Ride-share matchmaking
//   J8 Distributed cron
//   J9 Online auction last-second
//   J10 Redlock — multi-Redis-instance
//   J11 Deadlocks — keep locks local
//   Questions: q42 (L1), q43 (L2), q44 (L3), q45 (L4), q46 (L5)
//
// Part K — Distributed Cache
//   K1 In-memory cluster — latency / DB-load
//   K2 Aggregated metrics (async-computed)
//   K3 Session storage
//   K4 Speed up expensive queries (social feed)
//   K5 Eviction — LRU / FIFO / LFU
//   K6 Cache invalidation
//   K7 Write-through / Write-around / Write-back
//   K8 Be explicit about data structure
//   K9 Redis / Memcached
//   K10 Redis many structures vs Memcached KV-only
//   Questions: q47 (L1), q48 (L2), q49 (L3), q50 (L4), q51 (L5)
//
// Part L — CDN
//   L1 Fast global content delivery
//   L2 Edge servers close to users
//   L3 Cache miss → fetch origin → cache → return
//   L4 Not just static — dynamic with low change rate
//   L5 Cache API responses
//   L6 TTL or explicit invalidation
//   L7 Cloudflare / Akamai / CloudFront — DDoS, WAF
//   L8 Pairs with blob storage as origin
//   Questions: q52 (L1), q53 (L2), q54 (L3), q55 (L4), q56 (L5)
//
// CROSS-PART BRIDGES (woven into L4/L5 slots):
//   q17 — Blob Storage × CDN (D5 × L8) — origin pattern
//   q22 — Search × Relational (E9, E10) — Postgres GIN alternative
//   q31 — API Gateway × Load Balancer (F1 × G3) — different roles at edge
//   q41 — Queue vs Streams (H × I) — when each
//   q46 — Distributed Lock × Distributed Cache (J × K) — Redis dual role
//   q56 — Blob × CDN × Cache invalidation (D × L × K6) — versioned URLs
//
// L5 CANON PATTERN USAGE (need ≥4 of 7):
//   - Trade-off inversion: q3, q8, q13, q23, q31, q46
//   - Framing-is-wrong: q3, q23, q36, q51
//   - Cross-Part synthesis: q17, q22, q41, q46, q56
//   - Subtle distractors: q12, q18, q35, q45
//   - Operational / cost: q7, q17, q35, q44
//   - Failure mode: q40, q44, q45
//   - "Both partially true": q26, q31, q51
//   ⇒ All 7 patterns represented ✓
//
// Total: 56 questions across 12 Parts (A–L)
// Difficulty distribution: ≈ 12% L1, 21% L2, 24% L3, 21% L4, 22% L5
// Coverage: every concept ID (A1–L8, 6 cross-bridges) maps to ≥1 question
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, CheckCircle, XCircle, ChevronRight, RotateCcw, Award, AlertTriangle, Zap, Brain, Target, Trophy, Timer, ArrowRight, BarChart3 } from "lucide-react";

const QUIZ_DATA = {
  title: "Key Technologies: System Design Building Blocks",
  description: "Master the 12 building-block categories that solve 90% of system design problems — databases, blob storage, search, queues, streams, locks, caches, CDNs, and more. 56 questions test conceptual reasoning, trade-offs, and operational depth — not source-text recall.",
  estimatedTime: "~70 min",
  difficulty: "FAANG SDE2 / Senior — Very Hard",
  categories: [
    "DB Strategy",
    "Relational DB",
    "NoSQL DB",
    "Blob Storage",
    "Search DB",
    "API Gateway",
    "Load Balancer",
    "Queue",
    "Streams",
    "Distributed Lock",
    "Distributed Cache",
    "CDN"
  ],
  questions: [
    {
      id: "q1",
      category: "DB Strategy",
      difficulty: "L3",
      question: "A candidate is designing a social-graph product (users, follows, posts) and confidently opens with: 'I'll use a relational database because my data has relationships.' Why is this a yellow flag in a senior interview?",
      options: [
        { label: "A", text: "Relational databases can't actually model many-to-many relationships well — graph DBs are required for any social graph" },
        { label: "B", text: "The reasoning conflates 'relationships in your data' (a domain concept that any DB can model) with 'relational algebra' (a specific query model). NoSQL document and KV stores model social graphs successfully at huge scale (e.g., DynamoDB at Amazon). The candidate is repeating a heuristic without naming a real feature of the chosen DB they need" },
        { label: "C", text: "Relational databases don't scale to social-graph sizes, so the candidate has picked the wrong tool for the workload" },
        { label: "D", text: "Senior interviewers expect candidates to use graph databases (Neo4j) for any system with relationships" }
      ],
      correct: 1,
      explanation: "The article calls this exact line — 'I need to use a relational because I have relationships' — a yellow flag of inexperience. The word 'relational' in RDBMS refers to relational algebra, not to having related entities. NoSQL stores model social graphs all the time (Twitter, Facebook, Pinterest). The right framing is to name a SPECIFIC feature of your chosen DB (ACID, secondary indexes, transactions, etc.) and tie it to the problem.",
      interviewScript: "Say: 'I'll use Postgres here. Specifically I need ACID transactions for the follow/unfollow flow so the (follower→followee) and (followee→follower) edges always stay consistent, and I'll use a secondary index on followee_id to fetch a user's followers efficiently.' Notice the framing — feature first, problem-fit second.",
      proTip: "The article's exact words: 'broad statements like \"I need to use a relational database because I have relationships in my data\" are often yellow flags that reveal inexperience.' Memorize the failure mode and avoid it."
    },
    {
      id: "q2",
      category: "DB Strategy",
      difficulty: "L4",
      question: "Your interviewer pushes back on your DynamoDB choice with: 'Why not Postgres?' The weakest possible response would be:",
      options: [
        { label: "A", text: "'Postgres can't horizontally scale to the write throughput we need' — even though Postgres scales horizontally fine with the right architecture (Citus, partitioning, read replicas)" },
        { label: "B", text: "'I'm using DynamoDB because of its single-digit-ms read latency at scale and its built-in TTL feature, which lets me expire session data without a sweeper job'" },
        { label: "C", text: "'DynamoDB's auto-scaling on partition keys matches our spiky write pattern from the IoT ingest path'" },
        { label: "D", text: "'I'm familiar with DynamoDB's data modeling — single-table design with composite keys — so I can produce a working schema in the time we have'" }
      ],
      correct: 0,
      explanation: "Option A is the textbook anti-pattern: a broad SQL-vs-NoSQL claim ('NoSQL because scale') that's empirically wrong (Postgres scales). The article warns: 'I've gotta use NoSQL because I need scale and performance — relational databases, used correctly, perform and scale incredibly well.' B, C, and D all follow the right framing: name a SPECIFIC feature of the chosen DB and tie it to the problem at hand.",
      interviewScript: "Say: 'I picked DynamoDB for two specific reasons — single-digit-ms latency at our write QPS, and built-in TTL. If we hit a read-heavy join workload later, that's a separate trade-off conversation.' Specific features, specific problems — never broad SQL-vs-NoSQL claims.",
      proTip: "Treat 'NoSQL is for scale' / 'SQL is for relationships' as forbidden phrases. They're cliches the interviewer has heard 500 times and they reveal you've been studying generic blog posts."
    },
    {
      id: "q3",
      category: "DB Strategy",
      difficulty: "L5",
      question: "Mid-interview, a candidate spends 4 minutes laying out a SQL-vs-NoSQL comparison table — ACID, scaling, schema rigidity, joins — and concludes 'so I'll go with Postgres.' What is the strongest critique of this 4-minute spend?",
      options: [
        { label: "A", text: "The candidate forgot to mention CAP theorem trade-offs in the comparison" },
        { label: "B", text: "The interviewer has heard the same comparison hundreds of times; the time would have been better spent discussing the SPECIFIC features of Postgres they'll use to solve THIS problem (e.g., 'I'll use Postgres GIN indexes for full-text search on posts and a btree on user_id for the feed query'). The framing — comparison first vs feature-fit first — is the actual senior signal" },
        { label: "C", text: "The comparison was correct but Postgres was the wrong conclusion — DynamoDB would have been the senior choice" },
        { label: "D", text: "4 minutes is too short for a thorough SQL vs NoSQL comparison; senior candidates need 8–10 minutes minimum" }
      ],
      correct: 1,
      explanation: "This is the framing-is-wrong L5 pattern. The article is explicit: 'most interviewers don't need an explicit comparison of SQL and NoSQL databases in your session and it's a pothole you should completely avoid.' The candidate is solving a generic question ('SQL or NoSQL?') instead of the actual question ('how does your DB choice solve THIS problem?'). The 4 minutes is wasted because the comparison itself signals junior thinking — even if the conclusion is correct.",
      interviewScript: "If asked to compare, pivot fast: 'Both could work. Specifically I'm using Postgres because [feature 1: ACID for the order flow] and [feature 2: GIN index for search]. If we hit [scale threshold], I'd revisit.' Two sentences max — the comparison itself is the trap.",
      proTip: "The article calls this 'a pothole you should completely avoid.' Senior candidates skip the SQL-vs-NoSQL flowchart entirely — they pick a tool, name the features, and move on."
    },
    {
      id: "q4",
      category: "Relational DB",
      difficulty: "L1",
      question: "Which feature of relational databases lets you treat 'create user, then create their first post' as a single all-or-nothing operation, so a crash mid-flow leaves no orphaned posts?",
      options: [
        { label: "A", text: "Joins" },
        { label: "B", text: "Indexes" },
        { label: "C", text: "Transactions" },
        { label: "D", text: "Foreign keys" }
      ],
      correct: 2,
      explanation: "Transactions group multiple writes into a single atomic unit — either all succeed or all fail. The article's example is exactly this: 'create a new user and a new post for that user at the same time. If you do this in a transaction, either both operations will succeed or both will fail.' Joins (A) are for reads. Indexes (B) speed up reads. Foreign keys (D) enforce referential integrity but a non-transactional insert can still partially fail.",
      interviewScript: "Say: 'I'll wrap user-creation and first-post creation in a transaction so we never end up with a post pointing at a non-existent user.' Pair the feature with the failure mode it prevents.",
      proTip: "The 'A' in ACID is Atomicity — what transactions provide. Memorize the four-letter acronym and the property each letter buys you for the interview."
    },
    {
      id: "q5",
      category: "Relational DB",
      difficulty: "L2",
      question: "Your `users` table has 50M rows and the query `SELECT * FROM users WHERE email = ?` is taking 800ms. Which feature do you reach for first, and what's the underlying data structure most likely used?",
      options: [
        { label: "A", text: "Add a btree index on the `email` column — the database walks a balanced tree in O(log n) instead of scanning all 50M rows" },
        { label: "B", text: "Add a foreign key on `email` so the database knows it's unique" },
        { label: "C", text: "Add a join to a secondary `email_lookup` table that mirrors the email column" },
        { label: "D", text: "Convert the query to use prepared statements to reduce parsing overhead — that's the dominant cost" }
      ],
      correct: 0,
      explanation: "An index turns an O(n) scan into an O(log n) lookup. The article specifies B-Tree and Hash Table as the most common implementations; for equality-or-range lookups on a single column, btree is the default. Foreign keys (B) are for referential integrity, not lookup speed. A side-table join (C) is just an index built badly. Prepared statements (D) save parsing cost but won't move 800ms to <10ms — the table scan is the cost.",
      interviewScript: "Say: 'I'd add a btree index on email. That collapses the lookup from a 50M-row scan to an O(log n) walk — sub-millisecond on warm cache.' Mention the data structure if it's a senior round.",
      proTip: "If the field has many duplicates (low cardinality, like a status enum), an index helps less. Indexes shine on high-cardinality columns where each lookup eliminates most rows."
    },
    {
      id: "q6",
      category: "Relational DB",
      difficulty: "L3",
      question: "A teammate proposes a 6-table join to render the home feed in your social product: posts ⨝ users ⨝ follows ⨝ likes ⨝ comments ⨝ media. The query takes 2.4s P50. What's the most senior framing of the trade-off?",
      options: [
        { label: "A", text: "Joins are always bad — denormalize everything into one wide `feed_items` table with all data duplicated" },
        { label: "B", text: "Joins are a real RDBMS feature, but each one is a potential perf bottleneck — the article calls out 'minimize them where possible.' At feed-render hot path with 2.4s latency, denormalize the read path (materialized view, cache, or precomputed feed) and keep normalized writes for source-of-truth integrity" },
        { label: "C", text: "Use a NoSQL database — joins don't exist there so the problem is solved" },
        { label: "D", text: "Add indexes to every join column — that fully eliminates join cost" }
      ],
      correct: 1,
      explanation: "The article: 'joins can be also be a major performance bottleneck in your system so minimize them where possible.' But A overcorrects — denormalizing everything wrecks write integrity. The senior pattern is asymmetric: keep normalized writes (single source of truth) and a denormalized read path (cache or materialized feed). C dodges (NoSQL just makes you do the join in app code). D helps but indexes don't eliminate join cost — they reduce per-row work, the join itself still combines rows.",
      interviewScript: "Say: 'Joins are fine for low-frequency reports, but on the home-feed hot path I'd precompute the feed into a denormalized `feed_items` cache keyed by user_id. Writes update the source-of-truth tables AND fan out to the feed cache.' This is the read/write asymmetry.",
      proTip: "Memorize the rule: normalize writes, denormalize reads. It's the answer to 90% of 'joins are slow' questions and shows you understand the underlying trade-off."
    },
    {
      id: "q7",
      category: "Relational DB",
      difficulty: "L4",
      question: "After adding 4 new indexes to a write-heavy `events` table (1000 inserts/sec) to speed up analytics queries, write latency P99 jumps from 8ms to 45ms. What's the underlying mechanism?",
      options: [
        { label: "A", text: "Indexes lock the table during inserts; with 4 indexes, writes serialize behind 4 lock acquisitions" },
        { label: "B", text: "Every insert must also update each index structure (each btree must be re-balanced, hash buckets rehashed). With 4 indexes, the write does 5x the work — the row insert plus 4 index updates. This is the read/write trade-off of indexing: faster reads cost slower writes" },
        { label: "C", text: "Indexes consume RAM for caching, so adding 4 indexes evicted hot row data from buffer pool, causing disk I/O on every write" },
        { label: "D", text: "Postgres rewrites the entire table when an index is added; the latency is from the migration not yet completing" }
      ],
      correct: 1,
      explanation: "Each index is a separate auxiliary data structure (typically btree). Every INSERT must update the table AND each index, so 4 indexes ≈ 5x write work. This is THE trade-off the article alludes to when listing indexes as a feature: 'their support for arbitrarily many indexes' — but each costs you on writes. A is wrong (no per-index lock for normal MVCC inserts). C is plausible secondary effect but B is the primary mechanism. D is wrong (Postgres uses CREATE INDEX CONCURRENTLY for online builds).",
      interviewScript: "Say: 'Every index is a separate btree that must be updated on every insert. 4 new indexes means roughly 5x the write work per row. For a write-heavy table, I'd audit which indexes are actually used by hot queries and drop the rest, or move analytics queries to a read replica with its own index set.'",
      proTip: "The senior move is to know about partial indexes (only index rows matching a predicate) and covering indexes (include extra columns to skip the table fetch). Mention them if probed — it shows you've optimized real workloads."
    },
    {
      id: "q8",
      category: "Relational DB",
      difficulty: "L5",
      question: "A candidate says: 'I'll use Postgres because I have semi-structured product attribute data — Postgres has JSONB columns so I get flexible schema like NoSQL.' This sounds clever. What is the strongest case AGAINST stuffing flexible attributes into a Postgres JSONB column?",
      options: [
        { label: "A", text: "Postgres JSONB doesn't actually support indexing, so any query into the JSON is a full table scan" },
        { label: "B", text: "JSONB works, but you give up the things relational gives you for the JSON portion: schema validation at write time, column-level constraints, and clean SQL ergonomics. You also fragment your data — half-relational/half-document — which is harder to reason about than picking one model. JSONB is great for OPTIONAL flexible attributes on a stable core schema, not as the primary data model. Picking 'JSONB columns' as a reason for Postgres is a tell: the candidate is choosing Postgres to avoid the actual schema-design conversation" },
        { label: "C", text: "JSONB columns aren't ACID-compliant — writes to JSON fields aren't transactional" },
        { label: "D", text: "Postgres JSONB is 100x slower than DynamoDB document storage at any scale" }
      ],
      correct: 1,
      explanation: "This is the trade-off-inversion L5 pattern — the 'best of both worlds' framing is itself the trap. JSONB is a real Postgres feature (it does support GIN indexes — A is wrong) and it IS great for OPTIONAL flex attributes on a stable schema. But picking Postgres BECAUSE of JSONB usually means the candidate hasn't decided on a schema. They get the worst of both: Postgres operational complexity AND no schema discipline. C is wrong (JSONB writes are transactional). D is wrong (JSONB is fast).",
      interviewScript: "Say: 'I'd use Postgres with a stable core schema (id, sku, price, created_at) and a JSONB `attributes` column for the genuinely variable per-category fields. The core gives me clean SQL and constraints; the JSONB absorbs the long tail. I would NOT pick Postgres just because JSONB exists — that suggests I'm avoiding the schema-design conversation.'",
      proTip: "Real test: if you find yourself describing a system as 'mostly JSONB columns,' you should probably be using a document DB (Mongo / DynamoDB). Postgres-with-JSONB is for the 5–10% flex tail of a relational model."
    },
    {
      id: "q9",
      category: "NoSQL DB",
      difficulty: "L1",
      question: "You need to store user-session data: a session ID maps to a small JSON blob (user_id, expires_at, csrf_token). Reads and writes are exact-key lookups, no querying inside the blob. Which NoSQL data-model shape is the natural fit?",
      options: [
        { label: "A", text: "Key-value store — you have a single key (session_id) mapping to an opaque value, with no need to query inside the value. The simplest of the NoSQL shapes; matches the access pattern exactly" },
        { label: "B", text: "Graph database — sessions are nodes, users are nodes, traversals between them" },
        { label: "C", text: "Column-family store — columns scale better than rows for session data" },
        { label: "D", text: "Document store — required because the value is JSON" }
      ],
      correct: 0,
      explanation: "The session use case is the textbook key-value workload: lookup by exact key, value is opaque to the store. KV (Redis, DynamoDB-as-KV) handles it with the simplest possible model and the lowest latency. Document stores (D) work but add unnecessary indexing/querying machinery for an access pattern that never queries inside the document. Graph (B) and column-family (C) are mismatched to single-key lookup.",
      interviewScript: "Say: 'Sessions are exact-key lookups with opaque values — that\\'s the key-value access pattern. I\\'d use Redis for the in-memory speed, or DynamoDB as a KV table if I want managed durability. Document or graph stores would add machinery I don\\'t use.'",
      proTip: "Match family to access pattern: KV for sessions / lookups by exact key, document for queries inside nested objects, column-family for time-series and write-heavy, graph for traversal-heavy queries."
    },
    {
      id: "q10",
      category: "NoSQL DB",
      difficulty: "L2",
      question: "You're designing a write-heavy event log: 50K writes/sec of small append-only events, mostly read in time-range scans. Which NoSQL DB does the article specifically recommend for this workload, and why?",
      options: [
        { label: "A", text: "MongoDB — its document model handles event payloads naturally" },
        { label: "B", text: "Cassandra — its append-only storage model excels at write-heavy workloads, with the trade-off of reduced query flexibility" },
        { label: "C", text: "DynamoDB — its auto-scaling handles bursty writes" },
        { label: "D", text: "Redis — in-memory writes are fastest" }
      ],
      correct: 1,
      explanation: "The article: 'Cassandra is a good choice for write-heavy workloads due to its append-only storage model, but comes with some tradeoffs in functionality.' Append-only (LSM-tree-based) storage means writes are sequential disk appends — far cheaper than the in-place updates Mongo/DynamoDB do. Trade-off: less query flexibility (no joins, limited secondary indexes). DynamoDB also handles writes well but Cassandra is the article's specific append-heavy recommendation. Redis is in-memory — durability concerns for an event log.",
      interviewScript: "Say: 'For a write-heavy append-only event log, Cassandra. Its LSM-tree storage means writes are sequential appends, not in-place updates, which is exactly the access pattern. I accept the trade-off of constrained query flexibility because the workload is time-range scans, not arbitrary lookups.'",
      proTip: "Cassandra's data model is centered on the partition key + clustering key. Time-series fits perfectly: partition by entity, cluster by timestamp. Mention this exact pattern if probed."
    },
    {
      id: "q11",
      category: "NoSQL DB",
      difficulty: "L3",
      question: "A chat app uses DynamoDB with eventual consistency for reads. User A sends a message at T+0. User B does a strongly-consistent read at T+50ms — sees it. User C does an eventually-consistent read at T+50ms — doesn't see it. What does this tell you about the consistency-model trade-off?",
      options: [
        { label: "A", text: "DynamoDB is broken — both reads should see the same data" },
        { label: "B", text: "Eventually-consistent reads are cheaper (DynamoDB charges half the read units) and have lower latency, but they may serve stale data for a brief window. Strong consistency guarantees freshness but costs more and routes through the leader replica. The right choice depends on whether stale reads are tolerable for the use case" },
        { label: "C", text: "User C's region had a network partition; eventual consistency is irrelevant here" },
        { label: "D", text: "User C is using a read replica that's lagging by exactly 50ms; this is a configuration error" }
      ],
      correct: 1,
      explanation: "The article: 'Strong consistency ensures that all nodes in the system have the same data at the same time, while eventual consistency ensures that all nodes will eventually have the same data.' Eventual consistency reads can hit a replica that hasn't caught up yet — typically <100ms lag in DDB. It's a trade-off, not a bug. For a chat message where missing-by-50ms is jarring, choose strong reads on the message fetch.",
      interviewScript: "Say: 'For chat message reads I'd use strong consistency — the cost is acceptable and the UX cost of seeing yesterday\\'s message disappear briefly is too high. For analytics reads — say, message count — eventual is fine.'",
      proTip: "Eventual consistency in DDB is half the price of strong reads. That's the explicit dollar cost of choosing freshness — name it in your interview."
    },
    {
      id: "q12",
      category: "NoSQL DB",
      difficulty: "L4",
      question: "Your DynamoDB table is partitioned by `user_id`. One celebrity user has 10M followers and their writes (e.g., new posts, follower-count increments) hot-spot a single partition, throttling at 1000 WCU. Multiple legitimate-looking explanations exist — which is the actual root cause?",
      options: [
        { label: "A", text: "DynamoDB's auto-scaling is misconfigured; raising the WCU limit fixes it" },
        { label: "B", text: "Consistent hashing distributes load unevenly when one key is overrepresented; the celebrity's user_id hashes to a single partition, which has its own throughput limit. The fix is changing the partition strategy — e.g., partition by `(user_id, shard_id)` where shard_id is 0..N for celebrities, fanning their writes across N partitions and aggregating on read" },
        { label: "C", text: "DynamoDB's eventual consistency means writes need to propagate; reducing replication factor fixes it" },
        { label: "D", text: "Adding more secondary indexes will redistribute the writes" }
      ],
      correct: 1,
      explanation: "This is hot-partition — one of the canonical NoSQL pitfalls. The article hints at this: NoSQL scales 'by using consistent hashing and/or sharding.' Consistent hashing distributes KEYS evenly across partitions, but if one KEY gets disproportionate traffic, you get a hotspot. The celebrity-fanout fix (write-shard) is the standard answer: split the heavy partition into N sub-partitions. A doesn't help (per-partition limit, not table limit). C confuses replication with partitioning. D adds more hot indexes.",
      interviewScript: "Say: 'This is the classic hot-partition problem. Consistent hashing distributes keys evenly but not LOAD — celebrities concentrate write traffic on one partition. I\\'d write-shard the celebrity\\'s data across N synthetic partition keys, e.g., `(user_id, hash % N)`, then aggregate on read.'",
      proTip: "DynamoDB's per-partition limit is roughly 1000 WCU / 3000 RCU. Knowing this number signals operational depth — interviewers love it."
    },
    {
      id: "q13",
      category: "NoSQL DB",
      difficulty: "L5",
      question: "A candidate confidently says: 'Mongo's flexible schema lets me iterate fast — I won't have to do migrations as my model evolves.' For the L5 inversion: when does this 'flexible schema' selling point actively HURT you in a production system?",
      options: [
        { label: "A", text: "Schema flexibility is always a benefit; there's no downside in production" },
        { label: "B", text: "Schema doesn't disappear — it just moves from the database to your application code, often UNVERSIONED. After a year, your collection has 5 generations of partial schemas (some docs have `email`, some have `email_address`, some have both with mismatches). Reads must defensively handle every variant. The 'no migrations' promise was actually 'every read is a migration.' Strict schemas force you to confront and version the change at write time — which is uncomfortable but explicit. Schema-less puts the cost on every reader, forever" },
        { label: "C", text: "Mongo's flexible schema only works for documents under 16MB, which is the real production limitation" },
        { label: "D", text: "Schema flexibility breaks ACID guarantees, which is the actual issue" }
      ],
      correct: 1,
      explanation: "This is the trade-off-inversion + framing-is-wrong L5 pattern. The article notes NoSQL is 'often schema-less' — and that this is sometimes a FIT, not always a WIN. Strict schemas don't eliminate change; they force you to commit the change up-front. Schema-less DBs DEFER the cost to every reader, every shipping engineer, every analytics query. Senior engineers know that 'no migrations' is a rebranding of 'every read needs to handle every historical schema variant.' B is wrong (C is true but not the strongest critique; D is just incorrect).",
      interviewScript: "Say: 'Flexible schema is good for genuinely unstructured data and rapid prototyping, but in long-lived production systems the schema doesn\\'t go away — it migrates from the DB to defensive code in every reader. I\\'d use it deliberately for evolving fields, not as a default to dodge schema design.'",
      proTip: "The mental model: 'schema-less' = 'schema-in-application-code-and-unversioned.' Once you frame it that way, the trade-off becomes obvious and you can articulate it cleanly."
    },
    {
      id: "q14",
      category: "Blob Storage",
      difficulty: "L1",
      question: "A teammate proposes storing user-uploaded videos directly in your Postgres database as `bytea` columns. What's the article's specific objection?",
      options: [
        { label: "A", text: "Postgres can't store binary data" },
        { label: "B", text: "Storing large unstructured blobs in a traditional database is expensive and inefficient; blob storage like S3 is purpose-built for this and dramatically cheaper" },
        { label: "C", text: "Postgres requires separate licensing for binary data" },
        { label: "D", text: "Videos always exceed Postgres's 1GB row size limit" }
      ],
      correct: 1,
      explanation: "The article: 'Storing these large blobs in a traditional database is both expensive and inefficient and should be avoided when possible.' Postgres CAN store binary data (A, C are wrong), and the 1GB TOAST limit (D) is real but isn't the primary objection. The objection is cost-and-fit: traditional DBs are built for queryable structured data; blob storage is built for cheap durable byte storage.",
      interviewScript: "Say: 'I\\'ll put the video bytes in S3 and store the S3 URL in Postgres. That keeps the database for queryable metadata and the blob store for cheap, durable byte storage — each tool doing what it\\'s good at.'",
      proTip: "The standard architecture: DB stores metadata + URL pointer; blob store holds the bytes. Memorize this pattern — it appears in YouTube, Instagram, Dropbox design questions."
    },
    {
      id: "q15",
      category: "Blob Storage",
      difficulty: "L2",
      question: "You're designing Instagram. Where does the original-quality JPEG go, and where do user-id, caption, like-count, and post timestamp go?",
      options: [
        { label: "A", text: "JPEG and metadata both go in Postgres for transactional consistency" },
        { label: "B", text: "JPEG and metadata both go in S3 for cost efficiency" },
        { label: "C", text: "JPEG goes in S3 as a blob; metadata (user_id, caption, likes, timestamp) goes in a database (Postgres or DynamoDB) which stores the S3 URL as a pointer" },
        { label: "D", text: "Both go in CDN for fast global delivery" }
      ],
      correct: 2,
      explanation: "Standard split: bytes-in-blob, metadata-in-DB. The article: 'In a typical setup you will have a core database like Postgres or DynamoDB that has pointers (just a url) to the blobs stored in S3.' Why? Metadata needs to be queried, indexed, and joined (find me posts from user X in last 7 days) — DB strengths. Image bytes need cheap, durable, scalable byte storage — blob-store strength. B loses queryability. A is expensive. D is wrong (CDN is a cache, not a primary store).",
      interviewScript: "Say: 'Image bytes in S3, metadata in Postgres with the S3 URL as a column. The DB row is small, indexable, and queryable; the blob store handles the gigabytes of pixel data cheaply. The CDN sits in front of S3 for delivery.'",
      proTip: "The pattern is: DB row = pointer + queryable fields; blob store = bytes; CDN = delivery cache. Three layers, three jobs."
    },
    {
      id: "q16",
      category: "Blob Storage",
      difficulty: "L3",
      question: "Trace the presigned-URL upload flow the article describes. The client wants to upload a 2GB video. What is the correct sequence?",
      options: [
        { label: "A", text: "Client uploads file to your API server → server validates → server forwards bytes to S3 → server returns success to client" },
        { label: "B", text: "Client requests a presigned URL from the server → server generates URL and records the pending upload in DB → client uploads bytes directly to S3 using the presigned URL → S3 notifies the server (via event/webhook) that upload completed → server marks the record complete" },
        { label: "C", text: "Client requests an S3 access key from the server → client uploads directly to S3 with the key" },
        { label: "D", text: "Client encrypts the file → uploads to a queue → a worker drains the queue and writes to S3" }
      ],
      correct: 1,
      explanation: "The article describes this exact 4-step flow. The critical insight is that the bytes go DIRECTLY from client to S3 — your server never touches them. This avoids the bandwidth/CPU bottleneck of proxying 2GB through your fleet. A is the naive approach (proxies through your server — kills you at scale). C is dangerous (long-lived credentials on the client). D adds a queue with no clear benefit and increases latency.",
      interviewScript: "Say: 'I\\'ll use presigned URLs. Client asks for a URL, server generates one with limited scope and TTL, client uploads directly to S3 — bytes never touch my fleet. S3 fires an event back to my server when complete. This scales the bandwidth elastically with S3 instead of bottlenecking through my API tier.'",
      proTip: "S3 → Lambda / SNS / SQS event-on-upload is the standard 'upload completed' notification. Mention the integration mechanism if probed."
    },
    {
      id: "q17",
      category: "Blob Storage",
      difficulty: "L4",
      question: "You're storing 50TB of user-uploaded videos. An architect proposes storing them in DynamoDB to keep the data layer 'simple — one technology.' Walk through the operational and cost reasoning.",
      options: [
        { label: "A", text: "Good idea — fewer technologies means simpler operations" },
        { label: "B", text: "Bad idea on cost alone: AWS S3 is $0.023/GB/month, DynamoDB is $1.25/GB/month — that's ~54x. 50TB stored in DDB costs ~$62.5K/month vs ~$1.15K in S3. On top of that, DDB has a 400KB item limit so each video would need to be chunked across many items, and you'd be using a query-optimized data store as a byte bucket — paying for capabilities you don't use" },
        { label: "C", text: "DynamoDB doesn't store binary data — only JSON" },
        { label: "D", text: "DynamoDB is fine for this; S3 has the same per-GB cost" }
      ],
      correct: 1,
      explanation: "The article gives the exact prices: S3 $0.023/GB/month, DynamoDB $1.25/GB/month. 50TB × $1.25 = $62,500/month vs 50TB × $0.023 = $1,150/month. Plus the 400KB item-size limit on DDB makes videos impossible without chunking. Plus you're paying for query capabilities (indexes, KV access) that bytes don't need. The 'one technology' simplification ignores the 50x cost AND the impedance mismatch. C is wrong (DDB does support binary).",
      interviewScript: "Say: 'S3 is purpose-built for cheap durable byte storage at $0.023/GB. DDB is $1.25/GB — 54x more expensive — because you\\'re paying for index, query, and consistency capabilities that bytes don\\'t use. 50TB in DDB is $62K/month; in S3 it\\'s $1.1K. The right pattern is S3 for bytes, DDB for metadata + S3 URL.'",
      proTip: "Quoting the actual numbers ($0.023 vs $1.25) signals real-world experience. The article gives you these exact numbers — memorize them for cost-reasoning questions."
    },
    {
      id: "q18",
      category: "Blob Storage",
      difficulty: "L5",
      question: "A user has been uploading a 5GB video over a flaky 4G connection. At 92% completion, the connection drops. What feature should the upload pipeline already be using to make this recoverable WITHOUT restarting from byte 0, and what does the recovery actually look like?",
      options: [
        { label: "A", text: "Compression — restart with smaller bytes; the upload will succeed faster" },
        { label: "B", text: "Multipart / chunked upload (S3's multipart upload API). The 5GB file was split into N chunks (e.g., 5MB each), each uploaded independently with its own retry. On reconnect, the client queries S3 for which parts have been received and re-uploads only the missing parts. Bonus: chunks can be uploaded in parallel for throughput. The whole feature is purpose-built for this resume-from-failure case" },
        { label: "C", text: "Replication — S3 replicates the partial upload to another region for backup" },
        { label: "D", text: "Encryption — encrypted uploads can resume from any byte offset" }
      ],
      correct: 1,
      explanation: "The article: 'When uploading large files, it\\'s common to use chunking to upload the file in smaller pieces. This allows you to resume an upload if it fails partway through, and it also allows you to upload the file in parallel.' Specifically S3's multipart upload API. The client maintains the upload ID and uploaded part numbers; on resume, it lists already-uploaded parts and continues. A, C, D don't address resumability at all.",
      interviewScript: "Say: 'I\\'d use S3 multipart upload. The 5GB file is chunked into ~5MB parts and each is uploaded independently with its own retry. On reconnect the client lists the parts S3 already has and only re-uploads the missing ones. The feature also lets us upload parts in parallel for throughput.'",
      proTip: "Multipart upload is also the right answer to 'how do I parallelize a large upload?' The same feature gives you both resumability and parallelism — name both."
    },
    {
      id: "q19",
      category: "Search DB",
      difficulty: "L1",
      question: "What is an inverted index, in one line?",
      options: [
        { label: "A", text: "An index sorted in reverse order, from Z to A" },
        { label: "B", text: "A data structure mapping each WORD to the list of DOCUMENTS containing it" },
        { label: "C", text: "An index that hides itself from the query planner to save memory" },
        { label: "D", text: "A btree where left and right pointers are swapped" }
      ],
      correct: 1,
      explanation: "The article shows the exact structure: { 'word1': [doc1, doc2, doc3], ... }. The 'inversion' is from documents-contain-words (the natural direction) to words-point-to-documents (the lookup-friendly direction). This is the foundational data structure of every full-text search system, including Lucene/Elasticsearch.",
      interviewScript: "Say: 'An inverted index maps from each token to the documents that contain it. So instead of scanning every document looking for the term, you look up the term once and get the list of matching documents in O(1) or O(log n).'",
      proTip: "If asked 'how does Elasticsearch make full-text search fast?' the one-word answer is 'inverted indexes.' Lucene segments are essentially serialized inverted indexes."
    },
    {
      id: "q20",
      category: "Search DB",
      difficulty: "L2",
      question: "A junior engineer writes `SELECT * FROM articles WHERE body LIKE '%kubernetes%'` to support full-text search on a 5M-row articles table. What's the specific performance failure?",
      options: [
        { label: "A", text: "Postgres doesn't support the LIKE operator" },
        { label: "B", text: "The leading-wildcard `%kubernetes%` prevents any btree index from being used. The query becomes a full table scan — every row's body is loaded and string-matched. The article calls out exactly this query as why search-optimized databases exist" },
        { label: "C", text: "LIKE only works on integer columns; you need REGEX" },
        { label: "D", text: "5M rows is too few for any noticeable performance issue" }
      ],
      correct: 1,
      explanation: "The article uses this exact example: 'SELECT * FROM documents WHERE document_text LIKE \\'%search_term%\\' ... requires a full table scan ... rather than relying on an index or lookup. Slow!' The leading `%` defeats btree indexes (they can only seek on a fixed prefix). Search DBs solve this with inverted indexes that map words → docs, turning the search into an O(log n) lookup. A, C are wrong. D is wrong (5M-row scan is seconds-to-minutes).",
      interviewScript: "Say: 'The leading wildcard prevents any btree index from helping — it\\'s a full scan. For full-text search at any meaningful scale, I\\'d use an inverted-index store like Elasticsearch, or Postgres GIN indexes via tsvector if I want to keep the footprint small.'",
      proTip: "Postgres GIN indexes on tsvector columns are the 'reduce footprint' answer when you want full-text search without spinning up Elasticsearch. Mention them — the article does."
    },
    {
      id: "q21",
      category: "Search DB",
      difficulty: "L3",
      question: "An English-language search system. A user types `running shoes`. The article describes two pre-processing steps that happen before the inverted index is queried — what are they, and what does each do?",
      options: [
        { label: "A", text: "Compression and encryption" },
        { label: "B", text: "Tokenization (split text into individual words: 'running', 'shoes') and stemming (reduce words to roots: 'running' → 'run', 'shoes' → 'shoe'). Both run on indexing AND on queries, so 'runs', 'running', 'ran' all match the same root token in the index" },
        { label: "C", text: "Caching and replication" },
        { label: "D", text: "Hashing and bucketing" }
      ],
      correct: 1,
      explanation: "Article: 'Tokenization is the process of breaking a piece of text into individual words... Stemming is the process of reducing words to their root form. \\'running\\' and \\'runs\\' would both be reduced to \\'run\\'.' These run BOTH on the documents being indexed AND on the query, ensuring the query token and the document tokens are normalized to the same form before lookup. Without stemming, a search for 'run' would miss documents that only contain 'running.'",
      interviewScript: "Say: 'Tokenization splits text into words; stemming reduces each word to its root. Both run at index time on the document AND at query time on the search term, so \\'running shoes\\', \\'run shoe\\', and \\'runs shoes\\' all hit the same tokens in the inverted index.'",
      proTip: "Stemming is language-specific. English uses Porter / Snowball stemmers. Mention this if asked about multi-language search — naive stemming on Chinese / Japanese fails because there's no whitespace tokenization either."
    },
    {
      id: "q22",
      category: "Search DB",
      difficulty: "L4",
      question: "Cross-Part synthesis: your system already runs on Postgres (250K rows of articles). A PM asks for a 'search this article body' feature. The team's first instinct is to spin up Elasticsearch. What's the article's specific objection, and what's the alternative?",
      options: [
        { label: "A", text: "Always use Elasticsearch — Postgres simply cannot do text search" },
        { label: "B", text: "Adding Elasticsearch means a NEW operational footprint: new cluster, new replication strategy, new failure modes, and a new data-sync pipeline (CDC from Postgres → ES). For 250K rows, Postgres GIN indexes (tsvector + tsquery) handle full-text search natively with no new infra. The article: 'Using your existing database can be a good idea to reduce the footprint of your design.' Reach for ES when you outgrow Postgres FT — not before" },
        { label: "C", text: "Elasticsearch is expensive — switch to Redis full-text search instead" },
        { label: "D", text: "Postgres GIN indexes only work on small tables (< 1000 rows)" }
      ],
      correct: 1,
      explanation: "The article: 'Other options for search optimized databases include using full-text search capabilities of your database. Postgres has GIN indexes which support full-text search... Using your existing database can be a good idea to reduce the footprint of your design.' For 250K rows, Postgres GIN handles it well. Adding ES means a whole new operational surface — cluster, sync, monitoring, failure modes. C is wrong (the article calls Redis FT 'quite immature and bad'). D is wrong (GIN scales to millions).",
      interviewScript: "Say: 'I\\'d use Postgres GIN indexes via tsvector — full-text search without adding a second data store. If we hit Postgres FT limits at 10M+ rows or need fuzzy/multi-language relevance, I\\'d migrate to Elasticsearch with CDC sync. Until then, the footprint reduction is worth more than the extra power.'",
      proTip: "The senior heuristic: don't add a new data store for a feature your existing one can do at your current scale. Elasticsearch is for when you've outgrown the alternatives, not the default."
    },
    {
      id: "q23",
      category: "Search DB",
      difficulty: "L5",
      question: "A candidate confidently says: 'I'll use Elasticsearch as my primary database — it has search AND it's distributed AND I can store JSON, so I get one DB instead of two.' For the L5 framing-is-wrong: what's the strongest critique?",
      options: [
        { label: "A", text: "Excellent design — one database is always simpler" },
        { label: "B", text: "Elasticsearch is built around the inverted-index/Lucene segment model, which is optimized for SEARCH and ANALYTICS read patterns: heavy reads, batch-friendly writes, eventual consistency, no real transactions, no joins. Using it as a primary OLTP store means you give up ACID, you fight refresh-interval staleness, and you discover that 'distributed' doesn\\'t mean 'transactional.' The article positions ES squarely as a search-optimized database, not a primary store. The right architecture is Postgres/DDB as the source of truth + ES as a search-derived view fed by CDC" },
        { label: "C", text: "Elasticsearch can't store JSON — only flat strings" },
        { label: "D", text: "Elasticsearch is too slow to be a primary database" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong L5 pattern. ES is impressive (it CAN do many things) but the question 'should it be your primary store?' is the wrong frame — the answer is determined by what you're optimizing for, not by 'how many features can I get from one tool.' ES gives up transactional guarantees that primary stores need. The standard architecture is source-of-truth-DB + ES as derived index. The 'one DB to rule them all' instinct misses that databases are specialized for read/write patterns, not feature counts.",
      interviewScript: "Say: 'I\\'d keep my source of truth in a transactional store (Postgres/DDB) and use Elasticsearch as a derived search index, fed by CDC or dual writes. ES sacrifices ACID and has refresh-interval staleness — fine for search, painful for primary storage. The right framing isn\\'t \"one DB or two,\" it\\'s \"which DB matches each access pattern.\"'",
      proTip: "Real-world ES architectures almost always have a primary upstream store. Mention 'CDC from Postgres' or 'Debezium' to show you've seen the actual pattern, not just heard 'use Elasticsearch.'"
    },
    {
      id: "q24",
      category: "API Gateway",
      difficulty: "L1",
      question: "In a microservice architecture, a request comes in for `GET /users/123`. Which component is responsible for receiving the request from the client and routing it to the `users-service`?",
      options: [
        { label: "A", text: "Load balancer" },
        { label: "B", text: "API Gateway" },
        { label: "C", text: "CDN" },
        { label: "D", text: "Database" }
      ],
      correct: 1,
      explanation: "The article: 'an API gateway sits in front of your system and is responsible for routing incoming requests to the appropriate backend service. For example, if the system receives a request to GET /users/123, the API gateway would route that request to the users service.' Load balancers (A) distribute traffic across instances of the SAME service; the gateway routes between DIFFERENT services. CDN (C) caches static content. DB (D) stores data.",
      interviewScript: "Say: 'The API gateway is the first hop in a microservice request — it terminates the client connection, runs cross-cutting concerns like auth and rate-limiting, and routes to the right backend service. Load balancers sit one layer deeper, distributing to instances of that service.'",
      proTip: "API gateway = service-to-service routing + cross-cutting policy. Load balancer = instance-to-instance distribution. Two distinct jobs, both at the edge."
    },
    {
      id: "q25",
      category: "API Gateway",
      difficulty: "L2",
      question: "Which of the following is BEST handled at the API gateway layer (vs duplicated in every backend service)?",
      options: [
        { label: "A", text: "Domain-specific business logic for `users-service`" },
        { label: "B", text: "Authentication, rate limiting, and request logging — cross-cutting concerns that every service needs but none of them owns" },
        { label: "C", text: "Database schema migrations" },
        { label: "D", text: "User-interface rendering" }
      ],
      correct: 1,
      explanation: "The article: 'The gateway is also typically responsible for handling cross-cutting concerns like authentication, rate limiting, and logging.' These apply to every request regardless of backend, so centralizing them at the gateway prevents duplication across services. Business logic (A) is service-specific and stays in the service. C is data-tier. D is client-tier.",
      interviewScript: "Say: 'Auth, rate-limiting, and logging at the gateway. Each service then trusts the gateway-attached identity and focuses on domain logic. Without this, every service ends up reimplementing the same JWT validation and rate-limit logic — divergent and bug-prone.'",
      proTip: "The mental test: if a feature would be implemented identically in every service, it belongs at the gateway. If it's specific to one service's domain, it stays in the service."
    },
    {
      id: "q26",
      category: "API Gateway",
      difficulty: "L3",
      question: "A candidate spends 5 minutes in their interview deep-diving the internal architecture of an API gateway — how it does L7 inspection, how its routing tables are sharded, etc. What does the article say is most likely to happen?",
      options: [
        { label: "A", text: "The interviewer will appreciate the depth and assign extra credit" },
        { label: "B", text: "The interviewer will be annoyed because API gateway internals are rarely the actual subject of the interview — they\\'ll want to ask questions specific to the problem at hand. Include the gateway in your design as the first point of contact, but spend depth on the problem-specific components, not the gateway itself" },
        { label: "C", text: "The candidate will run out of time and fail to finish the design" },
        { label: "D", text: "Both B and C — interviewers redirect AND time runs out" }
      ],
      correct: 3,
      explanation: "Article: 'interviewers rarely get into detail of the API gateway, they\\'ll usually want to ask questions which are more specific to the problem at hand.' Going deep on gateway internals is a classic time-management failure. Both effects (interviewer redirect + clock pressure) operate, so D is the most complete answer. The gateway should appear in your diagram as a black box and your time should go to the problem-specific components (data model, scaling strategy, failure handling).",
      interviewScript: "Say: 'I\\'ll put an API gateway here as the first point of contact, handling auth and rate-limiting. Moving on to [the actual interesting part of the design]...' One sentence, then move on. Gateway is plumbing.",
      proTip: "Time budget rule of thumb: gateway gets ~30 seconds of mention. If the interviewer wants more, they'll ask. Don't volunteer minutes on infrastructure plumbing."
    },
    {
      id: "q27",
      category: "Load Balancer",
      difficulty: "L1",
      question: "Your system needs to support persistent WebSocket connections from millions of clients. Which load balancer layer should you use, and why in one sentence?",
      options: [
        { label: "A", text: "L4 — works at the TCP layer and handles persistent connections without the request-response assumption that L7 makes" },
        { label: "B", text: "L7 — only L7 supports WebSocket connections" },
        { label: "C", text: "L3 — you need network-layer routing for WebSockets" },
        { label: "D", text: "L2 — only data-link layer can keep connections alive" }
      ],
      correct: 0,
      explanation: "Article: 'if you have persistent connections like websockets, you\\'ll likely want to use an L4 load balancer.' L4 (TCP-layer) operates without inspecting HTTP semantics, so it doesn't impose request-response timeouts and handles long-lived connections cleanly. L7 (HTTP-layer) is great for routing flexibility but its idle timeouts can drop quiet WebSockets. C and D are network/data-link layers, not relevant to LB choice.",
      interviewScript: "Say: 'Persistent connections → L4. L7 LBs assume HTTP request-response patterns and have idle timeouts that can break WebSockets. L4 just forwards TCP, which is exactly what long-lived connections need.'",
      proTip: "The shortcut: persistent connection (WebSocket, gRPC streaming) → L4. Stateless request-response → L7. Memorize this two-line decision tree."
    },
    {
      id: "q28",
      category: "Load Balancer",
      difficulty: "L2",
      question: "Stateless REST API. Mixed routes: `/users/*` should go to users-service, `/orders/*` to orders-service. Which LB layer, and what's the deciding feature?",
      options: [
        { label: "A", text: "L4 — performs better than L7" },
        { label: "B", text: "L7 — operates at the application layer so it can inspect the HTTP path and route to different services. L4 only sees IP+port and can't differentiate `/users/*` from `/orders/*`" },
        { label: "C", text: "L3 — required for path-based routing" },
        { label: "D", text: "Either works equivalently" }
      ],
      correct: 1,
      explanation: "Article: 'Otherwise, an L7 load balancer offers great flexibility in routing traffic to different services.' Path-based routing requires HTTP inspection — only L7 sees the URL path. L4 is faster and connection-friendly but can't read inside the TCP payload. So: stateless + needs path/host routing → L7.",
      interviewScript: "Say: 'L7 — it parses HTTP and can route by path or host. L4 is connection-level and faster, but it can\\'t differentiate `/users` from `/orders` because it only sees the TCP layer.'",
      proTip: "L7 features senior interviewers love: header-based routing (canary releases), weighted routing (gradual rollouts), and request rewriting. Name one if probed."
    },
    {
      id: "q29",
      category: "Load Balancer",
      difficulty: "L3",
      question: "In an interview, a candidate draws a load balancer in front of EVERY service in a 12-service microservice diagram (12 LBs total). What does the article recommend instead, and why?",
      options: [
        { label: "A", text: "Yes, draw all 12 — it shows operational rigor" },
        { label: "B", text: "Either omit LBs entirely (and say 'these services are horizontally scaled') OR draw a single LB at the edge as an abstraction. 12 LB icons clutters the diagram and steals time from the parts the interviewer actually wants to discuss. The reality is you DO need an LB wherever there are multiple instances, but the diagram is a communication tool, not an inventory" },
        { label: "C", text: "Skip LBs because they're not real components in modern systems" },
        { label: "D", text: "Use a single global LB across all 12 services" }
      ],
      correct: 1,
      explanation: "Article: 'in an interview, it can be redundant to draw a load balancer in front of every service. Instead, either omit a load balancer from your design altogether (and just mention that the services are horizontally scaled) or add one only to the front of the design as an abstraction.' The actual systems run LBs internally (service mesh, in-cluster LB, etc.) — but the DIAGRAM is for communication, and 12 LB icons obscures the design.",
      interviewScript: "Say: 'I\\'m omitting LB icons internally — assume each service tier is horizontally scaled with its own LB. I\\'ll draw a single edge LB to make the entry point explicit.' This signals you know they exist without spending visual budget on them.",
      proTip: "The diagram is a story-telling tool. Anything that takes up pixel space steals attention from the components you want to discuss. Omit ubiquitous infrastructure unless the interviewer asks."
    },
    {
      id: "q30",
      category: "Load Balancer",
      difficulty: "L4",
      question: "Your system grows to handle 10M+ QPS with strict P99 < 5ms. Your software LB (NGINX on EC2) starts being the bottleneck — packet processing CPU saturates at 8M QPS even on the largest instances. What's the architectural escalation path?",
      options: [
        { label: "A", text: "Add more NGINX instances; horizontal scale always solves it" },
        { label: "B", text: "Hardware load balancers (e.g., F5, Citrix ADC) outperform software LBs at extreme traffic — they offload packet processing to specialized ASICs/FPGAs and bypass kernel network stacks. The article: 'for problems with extremely high traffic, specialized hardware load balancers will outperform software load balancers you\\'d host yourself — you\\'ll quickly be pulled into the crazy world of network engineering.' This is rare territory but real" },
        { label: "C", text: "Switch the LB to L7 — it\\'s faster than L4" },
        { label: "D", text: "There\\'s no solution above 8M QPS without sharding the problem" }
      ],
      correct: 1,
      explanation: "Article calls this out: 'for problems with extremely high traffic, specialized hardware load balancers will outperform software load balancers you\\'d host yourself.' Hardware LBs use ASICs/FPGAs to process packets at line rate — software LBs are bounded by CPU, kernel network stack, and DPDK at best. A scales but adds latency and complexity. C is wrong (L7 is slower per-connection because it parses HTTP). D is defeatist.",
      interviewScript: "Say: 'At extreme QPS, software LBs hit CPU/kernel-network-stack limits. The escalation is hardware LBs — F5, Citrix — that offload packet processing to specialized silicon. We\\'re in network-engineering territory at this point. I\\'d also evaluate kernel-bypass techniques like DPDK if hardware procurement isn\\'t feasible.'",
      proTip: "Mentioning DPDK or eBPF (XDP) for kernel-bypass software LBs at scale signals you've actually been near these problems. Senior infrastructure interviewers love these signals."
    },
    {
      id: "q31",
      category: "Load Balancer",
      difficulty: "L5",
      question: "Cross-Part bridge: a candidate puts both an API Gateway AND a Load Balancer at the edge. The interviewer asks: 'Why both? Aren't they doing the same thing?' What's the strongest answer?",
      options: [
        { label: "A", text: "They\\'re redundant — drop one" },
        { label: "B", text: "Different jobs at the same physical edge: the LB distributes traffic across multiple instances OF the gateway itself (so the gateway is HA), and the gateway then routes between DIFFERENT services and runs cross-cutting policy (auth, rate-limit). LB = horizontal-scale-of-one-component; Gateway = router-between-components. They look similar in a diagram because both sit at the edge, but they\\'re solving orthogonal problems. Often deployed as: Internet → DNS → LB (for gateway HA) → API Gateway fleet → backend services" },
        { label: "C", text: "API Gateway is L4, LB is L7" },
        { label: "D", text: "API Gateway handles writes, LB handles reads" }
      ],
      correct: 1,
      explanation: "Trade-off-inversion + cross-Part synthesis L5 pattern. They look like the same component (both at the edge) but do orthogonal work. LB scales-out a single component (the gateway is itself a service that needs HA). Gateway routes between MULTIPLE different services. Both are needed: without an LB the gateway is a single point of failure; without a gateway you have one giant service or every client knows about every backend. C is wrong (gateway is usually L7). D is wrong.",
      interviewScript: "Say: 'They\\'re solving different problems. The LB makes my gateway tier highly available — multiple gateway instances behind a single VIP. The gateway then routes between many different backend services and runs auth/rate-limiting. LB scales one component; gateway routes between components. Both at the edge, neither redundant.'",
      proTip: "'LB is for horizontal scale of ONE component, Gateway is for routing between MANY components.' One sentence that disambiguates them — memorize it."
    },
    {
      id: "q32",
      category: "Queue",
      difficulty: "L1",
      question: "A standard queue processes messages in what order by default?",
      options: [
        { label: "A", text: "Random — workers grab messages in arbitrary order" },
        { label: "B", text: "FIFO — first in, first out, the order messages were received" },
        { label: "C", text: "LIFO — last in, first out, like a stack" },
        { label: "D", text: "Sorted by message size" }
      ],
      correct: 1,
      explanation: "Article: 'Most queues are FIFO (first in, first out), meaning that messages are processed in the order they were received.' Some queues (Kafka in particular) support priority or time-based ordering as a configuration, but the default and dominant model is FIFO.",
      interviewScript: "Say: 'Standard queues are FIFO by default. If I need priority ordering or time-based delivery, I\\'d use Kafka or a queue that supports it explicitly.'",
      proTip: "FIFO ordering only holds within a partition. If you partition for scale, ordering across partitions is NOT preserved. This trips up many candidates."
    },
    {
      id: "q33",
      category: "Queue",
      difficulty: "L2",
      question: "Uber receives a New Year's Eve burst: 50K ride requests/second for 2 minutes, then back to 5K/second. Your matching service processes 8K requests/second steady-state. How does a queue help, in one sentence?",
      options: [
        { label: "A", text: "It rejects the excess 42K/sec to protect the matcher" },
        { label: "B", text: "It buffers the burst — requests beyond 8K/sec wait in the queue rather than being dropped, so the matcher processes at its own pace and clears the backlog over the next several minutes after the burst ends" },
        { label: "C", text: "It speeds up the matcher to handle 50K/second" },
        { label: "D", text: "It replicates messages 6x for fault tolerance" }
      ],
      correct: 1,
      explanation: "Article uses this exact example: 'In a ride-sharing application like Uber, queues can be used to manage sudden surges in ride requests... A queue buffers these incoming requests, allowing the system to process them at a manageable rate without overloading the server.' And: 'If I get a spike of 1,000 requests but can only handle 200 requests per second, 800 requests will wait in the queue before being processed — but they are not dropped!' B captures the buffer-not-drop semantics. A is wrong.",
      interviewScript: "Say: 'The queue absorbs the burst. Requests beyond the matcher\\'s 8K/sec capacity wait — they don\\'t drop. The matcher steadily drains the backlog after the burst ends. This is the buffer-for-bursty-traffic pattern.'",
      proTip: "The corollary: this only works if the burst is BURSTY. If sustained input > capacity forever, the queue grows unboundedly — see L5 question on backpressure."
    },
    {
      id: "q34",
      category: "Queue",
      difficulty: "L3",
      question: "After a deploy, your worker pool starts throwing exceptions on 0.5% of messages — they look malformed. The queue's retry config is 3 attempts with exponential backoff. After all retries fail, where does the article say these messages should go?",
      options: [
        { label: "A", text: "They should be silently dropped to keep the queue moving" },
        { label: "B", text: "Routed to a Dead Letter Queue (DLQ) — a separate queue for unprocessable messages, useful for debugging (inspect what failed) and auditing (no data is silently lost)" },
        { label: "C", text: "Retried forever until they succeed" },
        { label: "D", text: "Routed back to the front of the main queue to retry again" }
      ],
      correct: 1,
      explanation: "Article: 'Dead letter queues are used to store messages that cannot be processed. They\\'re useful for debugging and auditing, as it allows you to inspect messages that failed to be processed and understand why they failed.' DLQs solve two problems: don't drop messages silently (data integrity), and don't retry-forever-and-hammer-the-system (operational sanity).",
      interviewScript: "Say: 'After the configured retries fail, the message goes to a DLQ. That gives me a place to inspect what went wrong without losing data and without infinite retries that mask bugs. I\\'d set up alerting on DLQ depth so I see new failure modes immediately.'",
      proTip: "DLQ depth is a critical alert. A growing DLQ means a new failure mode has appeared in production — you want to find out before customers do."
    },
    {
      id: "q35",
      category: "Queue",
      difficulty: "L4",
      question: "Your queue is deepening fast (1M messages backlogged, growing at 50K/sec). The matcher can only process 30K/sec. What's the article's name for the technique that prevents the queue from becoming a runaway bottleneck, and what does it actually do?",
      options: [
        { label: "A", text: "Eventual consistency — let the queue eventually drain" },
        { label: "B", text: "Backpressure — slow down the producers when the queue gets overwhelmed. Concretely: reject new messages, return rate-limit errors to producers, or block producer threads, so the producer is FORCED to slow down or fail loudly. The alternative — letting the queue grow forever — just hides the capacity problem and eventually crashes when memory/disk fills" },
        { label: "C", text: "Sharding — split the queue into N partitions" },
        { label: "D", text: "Replication — copy the queue to a backup" }
      ],
      correct: 1,
      explanation: "Article: 'The biggest problem with queues is they make it easy to overwhelm your system... A queue is just obscuring the problem that I don\\'t have enough capacity. The answer is backpressure. Backpressure is a way of slowing down the production of messages when the queue is overwhelmed.' Without backpressure, the queue grows unboundedly until it crashes. C and D help with capacity but don't address producer-faster-than-consumer.",
      interviewScript: "Say: 'Backpressure. When the queue depth crosses a threshold I reject new messages or rate-limit producers — usually with a 429 or a circuit-breaker on the producer side. The point is the producer FEELS the slowdown so it backs off. Without backpressure the queue grows until it crashes, hiding the real problem.'",
      proTip: "Reactive Streams, Akka Streams, and Kafka's quotas are real-world backpressure mechanisms. Mention one if probed for depth."
    },
    {
      id: "q36",
      category: "Queue",
      difficulty: "L5",
      question: "A candidate's design hits a capacity wall: matcher can handle 30K rps, traffic is 60K rps. The candidate's solution: 'I\\'ll add a queue between the API and the matcher.' For the L5 framing-is-wrong: what's the strongest critique?",
      options: [
        { label: "A", text: "Smart move — that doubles capacity" },
        { label: "B", text: "The queue does NOT solve the capacity problem; it OBSCURES it. With sustained input > capacity, the queue grows unboundedly until backpressure or memory exhaustion stops it. The actual problem is 'matcher can\\'t keep up' and the actual solutions are: scale the matcher horizontally, optimize the per-message cost, or reduce input. The queue is a useful BUFFER for bursty traffic, but it\\'s not a capacity multiplier. The article: \\'A queue is just obscuring the problem that I don\\'t have enough capacity\\'" },
        { label: "C", text: "The queue should be in-memory not on-disk" },
        { label: "D", text: "Use Kafka instead of SQS" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong + failure-mode L5 pattern. The candidate has confused buffering (smoothing burst) with capacity-creation (multiplying steady-state throughput). A queue absorbs short spikes ABOVE steady capacity but cannot absorb a sustained imbalance. The article calls this exact misunderstanding out: 'The biggest problem with queues is they make it easy to overwhelm your system.' Real fix: scale the matcher to handle 60K, OR rate-limit input. The queue is plumbing, not a capacity multiplier.",
      interviewScript: "Say: 'A queue smooths bursts above steady capacity, but it can\\'t fix sustained over-capacity. With 60K rps in and 30K rps out, the queue grows unboundedly. The real fix is matching capacity to input — scale the matcher horizontally or rate-limit at the API. The queue helps if traffic is BURSTY around 30K average; it doesn\\'t help if it\\'s STEADY at 60K.'",
      proTip: "The mental test: would the queue be empty most of the time? If yes, it's a buffer (good fit). If it grows monotonically, you have a capacity problem and the queue is just delaying the crash."
    },
    {
      id: "q37",
      category: "Streams",
      difficulty: "L1",
      question: "What is the key behavioral difference between a stream (like Kafka) and a traditional queue?",
      options: [
        { label: "A", text: "Streams are faster than queues" },
        { label: "B", text: "Streams retain messages for a configurable period, allowing consumers to read AND re-read messages from the same position or from a specified time in the past. Traditional queues delete messages after they\\'re consumed" },
        { label: "C", text: "Streams support encryption, queues don\\'t" },
        { label: "D", text: "Streams are in-memory, queues are on-disk" }
      ],
      correct: 1,
      explanation: "Article: 'Unlike message queues, streams can retain data for a configurable period of time, allowing consumers to read and re-read messages from the same position or from a specified time in the past.' This retention is what enables event-sourcing replay, multiple consumer groups, and recovery-from-failure-at-an-old-offset. Traditional queue: deliver-once-and-delete. Stream: append-only-log with offsets.",
      interviewScript: "Say: 'Streams retain messages — consumers track a position (offset) and can re-read from any point. Queues delete on ack. That single behavioral difference enables replay, multiple consumer groups, and event-sourcing patterns that queues can\\'t.'",
      proTip: "The mental model: queue = mailbox (you check it, take the mail, mailbox is empty). Stream = bookshelf (everyone can browse, you mark which book you've read). Different abstractions."
    },
    {
      id: "q38",
      category: "Streams",
      difficulty: "L2",
      question: "A real-time chat room: when a user sends a message, all 50 participants need to receive it. Your design uses a Kafka topic per room. What pattern does this implement?",
      options: [
        { label: "A", text: "Request-response" },
        { label: "B", text: "Publish-subscribe (pub-sub) — a producer publishes once to a topic, multiple subscribers (each room participant) receive the same message simultaneously via the stream" },
        { label: "C", text: "Round-robin work distribution" },
        { label: "D", text: "Master-slave replication" }
      ],
      correct: 1,
      explanation: "Article uses this exact example: 'In a real-time chat application, when a user sends a message, it\\'s published to a stream associated with the chat room. This stream acts as a centralized channel where all chat participants are subscribers... This is a great example of a publish-subscribe pattern, which is a common use case for streams.' Streams enable pub-sub naturally because multiple consumers can independently read from the retained log.",
      interviewScript: "Say: 'Pub-sub. The stream\\'s retention plus multi-consumer model means one publish reaches all 50 participants without the producer knowing about them individually. The room topic decouples the publisher from the subscriber set.'",
      proTip: "Pub-sub via streams scales much better than fanout-via-direct-delivery. The producer doesn't track subscribers — the stream does."
    },
    {
      id: "q39",
      category: "Streams",
      difficulty: "L3",
      question: "Your real-time engagement event stream (likes, comments, shares) feeds two systems: a live dashboard AND a historical analytics database. The article describes a feature that lets both consume the same events without one blocking the other. What's it called?",
      options: [
        { label: "A", text: "Replication" },
        { label: "B", text: "Multiple consumer groups — independent consumer groups can each read the same stream at their own pace, tracking separate offsets. The dashboard group reads in real-time; the analytics group can lag without affecting the dashboard" },
        { label: "C", text: "Sharding" },
        { label: "D", text: "Compaction" }
      ],
      correct: 1,
      explanation: "Article: 'Streams can support multiple consumer groups, allowing different consumers to read from the same stream independently. This is useful for scenarios where you need to process the same data in different ways. For example, in a real-time analytics system, one consumer group might process events to update a dashboard, while another group processes the same events to store them in a database for historical analysis.' Each group has its own offset; they don't compete for messages, they share the source.",
      interviewScript: "Say: 'Multiple consumer groups. The dashboard group and the analytics group each maintain their own offset on the same topic. They consume independently — one falling behind doesn\\'t affect the other. This is a major reason streams beat queues for fan-out.'",
      proTip: "Within a consumer GROUP, partitions are distributed across instances (parallelism). Across consumer groups, every group sees every message. Two-level model — important to articulate."
    },
    {
      id: "q40",
      category: "Streams",
      difficulty: "L4",
      question: "A delivery dashboard shows 'mean delivery time per region over the last 24 hours.' The metric updates every minute. Which stream feature is this implemented with?",
      options: [
        { label: "A", text: "Replication" },
        { label: "B", text: "Windowing — group events by time (or count) into batches and compute aggregates per batch. A '24-hour rolling window updated every minute' is exactly this. Stream-processing frameworks (Flink, Spark Streaming) support windowed aggregation natively" },
        { label: "C", text: "Compaction" },
        { label: "D", text: "Eviction policy" }
      ],
      correct: 1,
      explanation: "Article: 'Streams can support windowing, which is a way of grouping events together based on time or count. This is useful for scenarios where you need to process events in batches, such as calculating hourly or daily aggregates of data. Think about a real-time dashboard that shows mean delivery time per region over the last 24 hours.' That's the exact example. Windowing is the mechanism that turns an infinite stream into bounded batches you can compute over.",
      interviewScript: "Say: 'Windowing — Flink or Spark Streaming groups the stream events into time windows (e.g., 24-hour sliding window, advance every minute) and computes aggregates per window. Without windowing the question \"mean over last 24 hours\" doesn\\'t even have a well-defined answer on an infinite stream.'",
      proTip: "Windowing types: tumbling (non-overlapping), sliding (overlapping), session (gap-based). Mention the type that matches the dashboard's behavior."
    },
    {
      id: "q41",
      category: "Streams",
      difficulty: "L5",
      question: "Cross-Part L5: a banking system needs to record every transaction (deposits, withdrawals, transfers) and support: real-time fraud detection, regulatory audit, AND the ability to rebuild any account's balance at any point in history. A queue isn\\'t enough — why specifically?",
      options: [
        { label: "A", text: "Queues are too slow for real-time fraud detection" },
        { label: "B", text: "Queues delete messages after consumption — once the fraud detector has read a transaction, it\\'s gone. The audit and replay requirements need messages to be RETAINED indefinitely so they can be re-read by other consumers AND replayed to reconstruct historical state. This is event sourcing: state = sequence of events, derive any view by replaying. Streams give you this; queues don\\'t. The article uses this exact example: \"each transaction is an event that can be stored, processed, and replayed\"" },
        { label: "C", text: "Queues don\\'t support encryption needed for banking" },
        { label: "D", text: "Queues don\\'t support FIFO ordering" }
      ],
      correct: 1,
      explanation: "Cross-Part synthesis L5. The article: 'Consider a banking system where every transaction (deposits, withdrawals, transfers) needs to be recorded and could affect multiple accounts. Using event sourcing with a stream like Kafka, each transaction is an event that can be stored, processed, and replayed. This setup not only allows for real-time processing of transactions but also enables the bank to audit transactions, rollback changes, or reconstruct the state of any account at any point in time by replaying the events.' Retention IS the feature — and it's the feature queues lack.",
      interviewScript: "Say: 'A queue gives me real-time delivery once. Banking needs: real-time fraud, audit trail, and historical replay. All three require RETAINED events. That\\'s event sourcing on a stream. The state of an account becomes a derived view computed by replaying transactions; you get audit AND time-travel debugging for free.'",
      proTip: "Event sourcing has a real cost: every read of derived state replays from the log, which is expensive without snapshots/compaction. Mention 'snapshots every N events' if probed for trade-offs."
    },
    {
      id: "q42",
      category: "Distributed Lock",
      difficulty: "L1",
      question: "Ticketmaster lets a user reserve a concert ticket for 10 minutes during checkout — no one else can buy it during that window. Which technology does the article specifically describe for this case?",
      options: [
        { label: "A", text: "DB transaction lock — wraps the read in a SELECT FOR UPDATE for 10 minutes" },
        { label: "B", text: "Distributed lock — implemented with a key-value store like Redis or ZooKeeper, holding a lock entry for ~10 minutes with an expiry" },
        { label: "C", text: "Message queue — the ticket sits in a queue for 10 minutes" },
        { label: "D", text: "CDN cache — the ticket is cached for 10 minutes" }
      ],
      correct: 1,
      explanation: "Article: 'when you\\'re dealing with online systems like Ticketmaster, you might need a way to lock a resource — like a concert ticket — for a short time (~10 minutes in this case). Traditional databases with ACID properties use transaction locks to keep data consistent... but they\\'re not designed for longer-term locking. This is where distributed locks come in handy.' DB transaction locks (A) are seconds-scale not minutes-scale.",
      interviewScript: "Say: 'Distributed lock with a key-value store like Redis. I set a key `ticket-123` with value `held` and a 10-minute TTL. While the user is in checkout, no other request can acquire that lock. If the user crashes, the TTL auto-releases.'",
      proTip: "Redis SETNX (SET if Not eXists) + EXPIRE is the canonical distributed-lock primitive. Or `SET key value NX EX 600` in one atomic command."
    },
    {
      id: "q43",
      category: "Distributed Lock",
      difficulty: "L2",
      question: "A daily aggregation cron job runs across 4 servers in your fleet. Without coordination, all 4 might run the job simultaneously and produce duplicate data. The article describes the right primitive for ensuring exactly one server runs the job. What is it?",
      options: [
        { label: "A", text: "Message queue with priority routing" },
        { label: "B", text: "Distributed lock — each server attempts to acquire the lock 'daily-aggregation-2026-04-27' before running. Only one wins; the others see the lock held and skip" },
        { label: "C", text: "Database connection pool" },
        { label: "D", text: "DNS-based service discovery" }
      ],
      correct: 1,
      explanation: "Article: 'For systems that run scheduled tasks (cron jobs) across multiple servers, a distributed lock ensures that a task is executed by only one server at a time. For instance, in a data analytics platform, a daily job aggregates user data for reports. A distributed lock can prevent the duplication of this task across multiple servers to save compute resources.' The lock is the coordination primitive — first server to acquire wins; others observe and back off.",
      interviewScript: "Say: 'Each server tries to acquire a distributed lock keyed on the job-id and date. The first wins and runs; the others see the lock held and skip. With a TTL slightly longer than the job\\'s expected runtime, a crashed server\\'s lock auto-releases so the next cron tick can recover.'",
      proTip: "The TTL > runtime invariant is critical — too short and a slow job loses its lock to another server mid-run; too long and a crash leaves the system stuck. Mention this trade-off."
    },
    {
      id: "q44",
      category: "Distributed Lock",
      difficulty: "L3",
      question: "Your distributed lock implementation does not set an expiry. A worker acquires lock `ticket-456`, then crashes mid-process. What happens, and what's the article's specific fix?",
      options: [
        { label: "A", text: "The lock auto-releases after the worker's TCP connection times out" },
        { label: "B", text: "The lock stays held forever — `ticket-456` is now permanently unbuyable. Fix: always set an expiry on distributed locks, so a crashed process\\'s lock auto-releases. The article: 'Distributed locks can be set to expire after a certain amount of time. This is important for ensuring that locks don\\'t get stuck in a locked state if a process crashes or is killed.'" },
        { label: "C", text: "Another worker can force-release after sensing the original is dead" },
        { label: "D", text: "The lock automatically transfers ownership to the next requesting worker" }
      ],
      correct: 1,
      explanation: "Without expiry, lock-on-crash = lock-stuck-forever. The article calls this out explicitly. TCP timeout (A) does not release the lock entry in Redis/ZK — those are independent. C and D require coordination logic that no off-the-shelf distributed lock provides; the standard practice is TTL.",
      interviewScript: "Say: 'Always set a TTL on the lock. If the worker crashes, the TTL auto-releases the lock and the system recovers. The TTL needs to be long enough to cover the longest expected operation, with some headroom — and the operation needs to be designed to not corrupt anything if the lock expires while it\\'s still working.'",
      proTip: "If your operation might run longer than the TTL, the operation should periodically EXTEND the lock — heartbeat the TTL forward. Critical pattern in long-running coordinators."
    },
    {
      id: "q45",
      category: "Distributed Lock",
      difficulty: "L4",
      question: "Process A acquires lock `inventory-X`, then tries to acquire lock `pricing-Y`. Process B acquires lock `pricing-Y`, then tries to acquire lock `inventory-X`. Both hang forever. What is this called and what's the article's specific advice on preventing it?",
      options: [
        { label: "A", text: "Race condition; fix with retry-with-backoff" },
        { label: "B", text: "Deadlock. Article: 'a common mistake is to have locks pulled from far-flung pieces of infrastructure or your code, this makes it hard to recognize and prevent deadlocks.' Standard fixes: acquire locks in a globally consistent order (always inventory-then-pricing), use timeouts so deadlocked acquires fail rather than hang, or design the system so a single process never needs more than one lock" },
        { label: "C", text: "Live-lock; fix with priority inversion" },
        { label: "D", text: "Cache miss; fix with cache warming" }
      ],
      correct: 1,
      explanation: "Article: 'Deadlocks can occur when two or more processes are waiting for each other to release a lock. Think about a situation where two processes are trying to acquire two locks at the same time. One process acquires lock A and then tries to acquire lock B, while the other process acquires lock B and then tries to acquire lock A.' Specific advice: 'a common mistake is to have locks pulled from far-flung pieces of infrastructure or your code, this makes it hard to recognize and prevent deadlocks.' Solutions are textbook: lock ordering, timeouts, single-lock designs.",
      interviewScript: "Say: 'Classic deadlock. Two prevention strategies: (1) global lock-acquisition order — every process acquires locks in the same order, so a cycle is impossible by construction; (2) lock timeouts — if I can\\'t acquire within N seconds, fail loudly rather than hang. The deeper architectural fix is keeping locks local so deadlock potential is visible at code-review time.'",
      proTip: "The 'lock ordering' invariant is one of the few real-world ways to prove deadlock-freedom. If your code can't guarantee a global ordering, you probably have too many locks."
    },
    {
      id: "q46",
      category: "Distributed Lock",
      difficulty: "L5",
      question: "Cross-Part L5: a candidate notices their design uses Redis for both distributed caching AND distributed locking. The interviewer asks: 'Is that a problem?' What's the strongest answer?",
      options: [
        { label: "A", text: "Yes — Redis can\\'t do both simultaneously; pick one" },
        { label: "B", text: "Both uses are legitimate, but they have very different operational profiles. Caching tolerates eviction (LRU) and replication lag — losing a cache entry is fine. Locking does NOT tolerate accidental release — losing a lock entry can cause double-charges or duplicate-cron-runs. If they share an instance, an eviction-induced lock loss or a replication-failover loses lock semantics. Best practice: separate Redis instances (one tuned for cache eviction, one tuned for lock durability), or use Redlock across multiple Redis instances for the locks specifically. Some teams move locks entirely to ZooKeeper for stronger consensus guarantees" },
        { label: "C", text: "Redis is wrong for both; use Memcached" },
        { label: "D", text: "Yes — Redis is single-threaded and can only handle one workload" }
      ],
      correct: 1,
      explanation: "Cross-Part synthesis L5. The two uses look identical (both are key-value writes to Redis) but have OPPOSITE durability requirements. Cache: 'I prefer to lose data over slowing down.' Lock: 'I must NEVER lose data, or I corrupt invariants.' Sharing an instance means cache pressure (eviction, OOM) can break locks. The article hints at this with Redlock: 'Redlock uses multiple Redis instances to ensure that a lock is acquired and released in a safe and consistent manner.' That algorithm exists because single-Redis locks are fragile.",
      interviewScript: "Say: 'It\\'s the same TECHNOLOGY but they have opposite durability requirements. Cache wants eviction (lose entries to stay fast); lock wants persistence (never lose entries). I\\'d separate the Redis instances at minimum, and consider Redlock or ZooKeeper for the lock workload if correctness matters. Sharing an instance can mean a cache-eviction policy quietly breaks lock semantics.'",
      proTip: "ZooKeeper is purpose-built for coordination primitives with stronger consensus guarantees than Redis. For high-correctness locks (financial, medical), prefer ZK over Redis."
    },
    {
      id: "q47",
      category: "Distributed Cache",
      difficulty: "L1",
      question: "A distributed cache has a 'Least Recently Used' eviction policy. When the cache is full and a new item arrives, what gets removed?",
      options: [
        { label: "A", text: "A random item" },
        { label: "B", text: "The item that was accessed least recently — the one whose last-access timestamp is the oldest" },
        { label: "C", text: "The item that was added most recently" },
        { label: "D", text: "The largest item by byte size" }
      ],
      correct: 1,
      explanation: "Article: 'Least Recently Used (LRU): Evicts the least recently accessed items first.' The intuition: an item not touched in a long time is unlikely to be touched soon, so evict it before items being actively used. LRU works well for workloads with temporal locality. Other policies named: FIFO (oldest by insertion order) and LFU (least frequently used).",
      interviewScript: "Say: 'LRU evicts the item with the oldest last-access timestamp. It bets that recently-used items are likely to be used again soon — temporal locality. It\\'s the default for most general-purpose caches because it tracks actual access patterns rather than insertion or count.'",
      proTip: "LRU has a hidden cost: tracking access timestamps per entry. Approximate-LRU (Redis's `volatile-lru` mode) samples N keys and evicts the oldest from the sample — much cheaper, almost as good."
    },
    {
      id: "q48",
      category: "Distributed Cache",
      difficulty: "L2",
      question: "You're designing a leaderboard: top 100 players by score, queried 10K times/sec, updated 1K times/sec. The article warns against a specific generic approach. Which concrete Redis data structure should you use?",
      options: [
        { label: "A", text: "Key-value pairs: SET player:1 score, then iterate all players to find top 100 on each read" },
        { label: "B", text: "Sorted set (ZSET): players are stored sorted by score; ZRANGE returns top 100 in O(log n + 100). The article specifically warns against the generic 'I\\'ll store the events in a cache' phrasing — be explicit about the data structure" },
        { label: "C", text: "Hash: store all players in one hash and iterate" },
        { label: "D", text: "List: append each score and iterate" }
      ],
      correct: 1,
      explanation: "Article: 'Don\\'t forget to be explicit about what data you are storing in the cache, including the data structure you\\'re using. Remember, modern caches have many different datastructures you can leverage, they are not just simple key-value stores. So for example, if you are storing a list of events in your cache, you might want to use a sorted set so that you can easily retrieve the most popular events. Many candidates will just say, \"I\\'ll store the events in a cache\" and leave it at that. This is a missed opportunity.' Sorted sets (ZSETs) maintain the leaderboard property natively.",
      interviewScript: "Say: 'Redis sorted set keyed `leaderboard`. Each player is a member with score = their score. Read top 100 with ZREVRANGE 0 99 — O(log n + 100). Write a new score with ZADD — O(log n). The data structure does the sorting for me; I never iterate.'",
      proTip: "Naming the exact data structure (ZSET, HSET, LIST, SET, HyperLogLog, Bitmap, Stream) signals depth in any Redis-based design. The generic 'cache' answer leaves easy points on the table."
    },
    {
      id: "q49",
      category: "Distributed Cache",
      difficulty: "L3",
      question: "You're choosing between Write-Through and Write-Back cache strategies. A Write-Back cache writes to the cache and asynchronously writes to the DB. What's the specific risk the article calls out?",
      options: [
        { label: "A", text: "Write-Back is slower than Write-Through" },
        { label: "B", text: "Write-Back is faster for writes (cache-only on the hot path) but data can be lost if the cache fails before the async DB write completes. Write-Through writes to both simultaneously — slower but consistent" },
        { label: "C", text: "Write-Back doesn\\'t work for read-heavy workloads" },
        { label: "D", text: "Write-Back requires a separate database" }
      ],
      correct: 1,
      explanation: "Article: 'Write-Back Cache: Writes data to the cache and then asynchronously writes the data to the datastore. This can be faster for write operations but can lead to data loss if the cache fails before the data is written to the datastore.' Write-Through trades latency for durability; Write-Back trades durability for latency. A is wrong (Write-Back IS faster).",
      interviewScript: "Say: 'Write-Back is fast — the user sees a write succeed as soon as the cache acks. The risk is the gap between cache-ack and DB-flush; if the cache crashes in that window, the write is lost. Write-Through is slower because both writes block the response, but the write is durable as soon as the user sees success. Choose based on how much data loss the use case can tolerate.'",
      proTip: "Write-Around (the third strategy in the article) writes only to the DB and bypasses the cache. Useful when writes are rare-then-stale (data won\\'t be read soon) — avoids polluting cache with cold data."
    },
    {
      id: "q50",
      category: "Distributed Cache",
      difficulty: "L4",
      question: "Your Ticketmaster cache stores popular events. An admin updates the venue of event 1234 in the source DB. The cache still serves the old venue for the next 6 hours (the TTL). What's the article's specific term for the strategy that fixes this?",
      options: [
        { label: "A", text: "Cache eviction policy" },
        { label: "B", text: "Cache invalidation strategy — the strategy you use to ensure the data in your cache is up to date. When the underlying data changes, you actively remove or update the cache entry rather than waiting for TTL expiry" },
        { label: "C", text: "Cache write strategy" },
        { label: "D", text: "Cache replication strategy" }
      ],
      correct: 1,
      explanation: "Article: 'Cache Invalidation Strategy: This is the strategy you\\'ll use to ensure that the data in your cache is up to date. For example, if you are designing Ticketmaster and caching popular events, then you\\'ll need to invalidate an event in the cache if the event in your Database was updated (like the venue changed).' Invalidation is the active push; eviction is the passive expiry. Different concepts.",
      interviewScript: "Say: 'On the DB write path, after a successful update, I delete (or update) the cache entry for that event. On the next read, the cache miss fetches fresh data from the DB. TTL is a backstop, not the primary freshness mechanism.'",
      proTip: "The famous Phil Karlton quote: 'There are only two hard things in computer science: cache invalidation and naming things.' Mention it for color — interviewers love it."
    },
    {
      id: "q51",
      category: "Distributed Cache",
      difficulty: "L5",
      question: "A candidate says: 'I'll cache the user's feed in Redis to make reads fast.' For the L5 'both partially true' / framing-is-wrong: what's the strongest follow-up the interviewer would push on?",
      options: [
        { label: "A", text: "What\\'s the cache hit rate?" },
        { label: "B", text: "ALL of: (1) what data structure — string blob, hash, sorted set, list? (2) what\\'s the eviction policy — LRU, LFU? (3) what\\'s the invalidation strategy when a new post is published? (4) what\\'s the write strategy — write-through, write-back? (5) what\\'s in the cache key — user_id, page_number, version? The single line 'I\\'ll cache the feed' answers none of these, and each one is a real design decision the interviewer expects you to have made deliberately. The article: 'Many candidates will just say, \\'I\\'ll store the events in a cache\\' and leave it at that. This is a missed opportunity and may invite follow-up questions'" },
        { label: "C", text: "Why not Memcached?" },
        { label: "D", text: "What region is the cache in?" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong + 'both partially true' L5. 'I\\'ll cache the feed' is too vague to be a design decision. Each of the five sub-questions is a real choice with real consequences (hit rate, freshness, latency, complexity). Senior candidates volunteer these decisions without being asked. The article specifically calls out this kind of vague answer as inviting follow-up questions you'd rather not face. A, C, D are good follow-ups individually but B captures the systemic problem.",
      interviewScript: "Say: 'Specifically — Redis sorted set keyed `feed:{user_id}`, scored by post timestamp. Eviction LRU at the cluster level, but I prefer to size to keep recent users hot. Invalidation: on new follow / new post from a followed user, I update the affected feeds (fanout-on-write for active users, fanout-on-read for celebrities). Write-through for the recent slice, write-around for cold pagination.' That\\'s a real cache design, not a hand-wave.",
      proTip: "When mentioning a cache, always answer five questions BEFORE the interviewer asks: data structure, key, eviction, invalidation, write strategy. Volunteering these signals seniority."
    },
    {
      id: "q52",
      category: "CDN",
      difficulty: "L1",
      question: "What is the primary architectural reason a CDN reduces latency for users?",
      options: [
        { label: "A", text: "It compresses content more aggressively than the origin" },
        { label: "B", text: "It uses distributed edge servers physically close to users; a request from Tokyo hits a Tokyo edge instead of crossing the Pacific to the origin" },
        { label: "C", text: "It uses faster CPUs than typical origin servers" },
        { label: "D", text: "It uses HTTP/3 instead of HTTP/2" }
      ],
      correct: 1,
      explanation: "Article: 'A content delivery network (CDN) is a type of cache that uses distributed servers to deliver content to users based on their geographic location... They work by caching content on servers that are close to users. When a user requests content, the CDN routes the request to the closest server.' Geographic proximity reduces RTT, which dominates perceived latency for content delivery.",
      interviewScript: "Say: 'CDN reduces latency by serving from edge locations physically close to users. RTT scales with distance — Tokyo→Tokyo is sub-10ms; Tokyo→US-East is 150ms+. For static content, eliminating that round-trip is the dominant win.'",
      proTip: "RTT is bounded by speed of light, not technology. CDNs are the only way to fundamentally beat the geography problem for global users."
    },
    {
      id: "q53",
      category: "CDN",
      difficulty: "L2",
      question: "Instagram serves user profile pictures globally. Users in Sydney, Lagos, and Helsinki all view the same celebrity's picture. Where should the picture be cached, and what's the cache-miss flow?",
      options: [
        { label: "A", text: "Cache only at origin S3 — clients fetch directly from S3 every time" },
        { label: "B", text: "Cache at CDN edge servers globally. On cache miss at the edge, the CDN fetches from origin (S3), caches at that edge, and returns to the user. Subsequent requests at that edge hit the cache" },
        { label: "C", text: "Cache only in the user\\'s browser; CDN is unnecessary" },
        { label: "D", text: "Cache at origin only, but use HTTP/2 multiplexing to compensate" }
      ],
      correct: 1,
      explanation: "Article describes this exact flow: 'When a user requests content, the CDN routes the request to the closest server. If the content is cached on that server, the CDN will return the cached content. If the content is not cached on that server, the CDN will fetch the content from the origin server, cache it on the server, and then return the content to the user.' The fill-on-miss pattern means each edge warms its own cache for popular content. Browser cache (C) helps individual users but doesn't help cross-user popularity.",
      interviewScript: "Say: 'Edge cache. First request in Sydney is a miss — CDN edge fetches from S3, caches locally, returns. Subsequent Sydney requests for that picture hit the local edge — sub-10ms. Edges in Lagos and Helsinki warm independently as their first request comes in. Globally we get O(N_edges) origin fetches for popular content, not O(N_users).'",
      proTip: "The 'first request is slow, subsequent requests fast' pattern is called 'cold cache miss.' Mention it — interviewers expect you to acknowledge that the first user pays a cost."
    },
    {
      id: "q54",
      category: "CDN",
      difficulty: "L3",
      question: "Your blog posts change roughly once a day on average, are read 50K times/day, and the article specifically says CDNs aren't only for static assets. What's the design implication?",
      options: [
        { label: "A", text: "Blog posts are dynamic; never cache them at the CDN" },
        { label: "B", text: "Cache blog posts at the CDN with a TTL appropriate to the change rate (e.g., 1 hour). The article: 'CDNs are not just for static assets... they can also be used to cache dynamic content. This is especially useful for content that is accessed frequently, but changes infrequently. For example, a blog post that is updated once a day can be cached by a CDN.' 50K reads/day vs ~1 update/day is exactly the read-heavy ratio that CDN caching wins" },
        { label: "C", text: "Blog posts must be cached only in the application server, never at the CDN" },
        { label: "D", text: "CDNs only support static files like images" }
      ],
      correct: 1,
      explanation: "Article: 'CDNs are not just for static assets. While CDNs are often used to cache static assets like images, videos, and javascript files, they can also be used to cache dynamic content. This is especially useful for content that is accessed frequently, but changes infrequently. For example, a blog post that is updated once a day can be cached by a CDN.' The threshold is read-heavy + low change rate — blog posts qualify.",
      interviewScript: "Say: 'Dynamic doesn\\'t mean uncacheable — it means change rate matters. Blog posts change once a day, are read 50K times — that\\'s read:write of 50000:1. Cache at the CDN with a 1-hour TTL or invalidate on publish. Origin sees ~1 fetch/hour/edge instead of 50K reads/day.'",
      proTip: "The right framing: cache anything where read-rate >> write-rate, with TTL or invalidation calibrated to the staleness tolerance. 'Static vs dynamic' is the wrong distinction."
    },
    {
      id: "q55",
      category: "CDN",
      difficulty: "L4",
      question: "Your CDN has cached an old version of your bundled JavaScript at all 200 edge locations. You ship a critical bug fix and need users to get the new version IMMEDIATELY. The article describes a low-cost approach. What is it?",
      options: [
        { label: "A", text: "Lower TTL to 0 across the entire CDN" },
        { label: "B", text: "Send a purge request to all 200 edge locations" },
        { label: "C", text: "Cache-busting URLs — change the URL of the new bundle (e.g., `app.abc123.js` → `app.def456.js`). The new URL is a cache miss everywhere and fetches from origin immediately. The old URL\\'s cache entries expire naturally via TTL — no purge needed. The HTML references the new URL, so all clients pick up the change on next page load" },
        { label: "D", text: "Disable the CDN until the rollout completes" }
      ],
      correct: 2,
      explanation: "This is the standard CDN-content-versioning pattern. By making the URL itself part of the version (`app.abc123.js`), you sidestep the invalidation problem: a new version is a new URL, which is a guaranteed cache miss everywhere. The old URL's cache entries cost nothing — they're just unreferenced and expire on their own. This is what JS bundlers (webpack, vite) do automatically with content-hashed filenames. Purging 200 edges (B) is expensive and not always instant.",
      interviewScript: "Say: 'Content-hash the bundle filename. The new bundle is `app.def456.js`, the HTML now points to it, every CDN edge sees a cache miss and fetches from origin once. Old `app.abc123.js` entries linger in caches harmlessly until their TTL expires. This is what every modern JS bundler does for exactly this reason.'",
      proTip: "Mention the term 'immutable URLs.' Once a URL is content-hashed, you can set TTL=1year on it because the URL will never change content. This is the strongest possible caching, with instant updates."
    },
    {
      id: "q56",
      category: "CDN",
      difficulty: "L5",
      question: "Cross-Part L5: an e-commerce product page contains BOTH static product images (cacheable for hours) AND a real-time 'In Stock: 5' inventory count. A naive design caches the whole page. After a purchase the cached count is wrong. What's the architectural pattern that preserves CDN benefits without breaking inventory accuracy?",
      options: [
        { label: "A", text: "Set CDN TTL to 0 — fetch every page from origin" },
        { label: "B", text: "Decompose the page: cache the static parts (images, descriptions, reviews) at the CDN with long TTLs, and load the dynamic inventory via a separate real-time API call to the origin region. The CDN serves the page shell; client-side JS fetches the freshness-sensitive bits. This is the 'static shell + dynamic data' pattern — preserves 90% of the CDN benefit while keeping inventory accurate. The article uses this exact pattern in the regionalization section" },
        { label: "C", text: "Replicate inventory to every CDN edge in real-time" },
        { label: "D", text: "Move all inventory data into a single global database queried from every edge" }
      ],
      correct: 1,
      explanation: "Cross-Part L5 (Blob × CDN × Cache invalidation). The senior pattern is to NOT cache things together that have different freshness requirements. The static parts of the product page (images, descriptions) belong on the CDN with long TTL. The inventory count belongs as a fresh API fetch on each page load — small payload, no CDN involvement. The page shell loads instantly from edge; the JS makes one extra small API call for the freshness-critical fragment. A defeats CDN purpose. C is operationally insane (200 edges replicating a real-time counter). D centralizes inventory but creates a global bottleneck.",
      interviewScript: "Say: 'Decompose by freshness. The product page shell — images, descriptions, reviews — has long TTL at the CDN; that\\'s 90% of the bytes. The inventory count is a small JSON fragment fetched live from the regional API. JS in the page makes one fetch on load. CDN handles the heavy stuff fast, origin handles the freshness-critical sliver. This pattern is sometimes called Edge Side Includes (ESI) or, more commonly today, just static-shell-with-dynamic-fragments.'",
      proTip: "The mental model: split content by freshness requirement, then cache each layer at the level that matches. Static images at CDN. Slowly-changing prices at CDN with shorter TTL. Real-time inventory uncached at origin. Three different freshness budgets, three different caching tiers."
    }
  ]
};

function LandingScreen({ onStart }) {
  const categoryTotals = {};
  QUIZ_DATA.categories.forEach(cat => {
    categoryTotals[cat] = QUIZ_DATA.questions.filter(q => q.category === cat).length;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-6">
            <Brain size={32} className="text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">{QUIZ_DATA.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">{QUIZ_DATA.description}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Target size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Trophy size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Zap size={18} className="text-amber-400" />
            Coverage by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {QUIZ_DATA.categories.map(cat => (
              <div key={cat} className="text-sm text-gray-400 flex items-center justify-between px-2 py-1">
                <span>{cat}</span>
                <span className="text-gray-600">({categoryTotals[cat] || 0})</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Each category climbs the L1→L5 difficulty ladder. L5 questions test trade-off inversion, framing-is-wrong, and cross-category synthesis — the patterns staff-level interviewers probe.
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-lg"
        >
          <Zap size={20} />
          Start Quiz
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({ question, questionIndex, total, score, onAnswer, onSkip, selectedAnswer, showFeedback, onNext, timer }) {
  const isCorrect = selectedAnswer !== null && selectedAnswer !== -1 && selectedAnswer === question.correct;
  const isSkipped = selectedAnswer === -1;

  const difficultyColor = {
    L1: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    L2: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    L3: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    L4: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    L5: "bg-red-500/10 text-red-400 border-red-500/30",
  }[question.difficulty] || "bg-gray-700 text-gray-400 border-gray-600";

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-400 uppercase">Question {questionIndex + 1} / {total}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timer <= 15 ? "bg-red-500/10 border border-red-500/30" : timer <= 30 ? "bg-amber-500/10 border border-amber-500/30" : "bg-gray-800 border border-gray-700"}`}>
              <Timer size={16} className={timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-400"} />
              <span className={`text-sm font-semibold ${timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-300"}`}>{timer}s</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold flex-shrink-0">
              {question.category}
            </span>
            {question.difficulty && (
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 border ${difficultyColor}`}>
                {question.difficulty}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showFeedback && onAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border ${
                  showFeedback
                    ? idx === question.correct
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : selectedAnswer === idx && idx !== question.correct
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-gray-800 border-gray-700 text-gray-400"
                    : selectedAnswer === idx
                    ? "bg-blue-500/10 border-blue-500 text-blue-300"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg flex-shrink-0">{option.label}</span>
                  <span className="flex-1">{option.text}</span>
                  {showFeedback && idx === question.correct && <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                  {showFeedback && selectedAnswer === idx && idx !== question.correct && <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />}
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  Why
                </h3>
                <p className="text-sm text-gray-300">{question.explanation}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Brain size={16} className="text-blue-400" />
                  Interview Script
                </h3>
                <p className="text-sm text-gray-300">{question.interviewScript}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Pro Tip
                </h3>
                <p className="text-sm text-gray-300">{question.proTip}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showFeedback ? (
            <>
              <button
                onClick={onSkip}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold transition-all duration-200"
              >
                Skip
              </button>
            </>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {questionIndex === total - 1 ? "See Results" : "Next Question"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ score, total, answers, questions, onRestart }) {
  const pct = Math.round((score / total) * 100);
  let grade = { label: "A+", desc: "Mastery-level performance", bg: "bg-emerald-500/10", border: "border-emerald-500/30", color: "text-emerald-400", GradeIcon: Trophy };
  if (pct < 60) grade = { label: "F", desc: "Review fundamentals", bg: "bg-red-500/10", border: "border-red-500/30", color: "text-red-400", GradeIcon: XCircle };
  else if (pct < 70) grade = { label: "D", desc: "Needs improvement", bg: "bg-red-500/10", border: "border-red-500/30", color: "text-red-400", GradeIcon: AlertTriangle };
  else if (pct < 80) grade = { label: "C", desc: "Competent, but room to grow", bg: "bg-amber-500/10", border: "border-amber-500/30", color: "text-amber-400", GradeIcon: AlertTriangle };
  else if (pct < 90) grade = { label: "B", desc: "Solid understanding", bg: "bg-blue-500/10", border: "border-blue-500/30", color: "text-blue-400", GradeIcon: CheckCircle };
  else grade = { label: "A+", desc: "Mastery-level performance", bg: "bg-emerald-500/10", border: "border-emerald-500/30", color: "text-emerald-400", GradeIcon: Trophy };

  const GradeIcon = grade.GradeIcon;
  const categoryScores = {};
  questions.forEach((q, idx) => {
    if (!categoryScores[q.category]) categoryScores[q.category] = { correct: 0, total: 0 };
    categoryScores[q.category].total += 1;
    if (answers[idx] === q.correct) categoryScores[q.category].correct += 1;
  });

  const tierScores = {};
  questions.forEach((q, idx) => {
    const tier = q.difficulty || "Untiered";
    if (!tierScores[tier]) tierScores[tier] = { correct: 0, total: 0 };
    tierScores[tier].total += 1;
    if (answers[idx] === q.correct) tierScores[tier].correct += 1;
  });

  const incorrect = questions.filter((q, idx) => answers[idx] !== q.correct && answers[idx] !== -1);

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${grade.bg} ${grade.border} border mb-4`}>
            <GradeIcon size={36} className={grade.color} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{score} / {total}</h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${grade.bg} ${grade.border} border ${grade.color} mb-3`}>
            {grade.label} — {pct}%
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto">{grade.desc}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Accuracy by Tier</h3>
          </div>
          <div className="space-y-3">
            {["L1", "L2", "L3", "L4", "L5"].filter(t => tierScores[t]).map((tier) => {
              const data = tierScores[tier];
              const tierPct = Math.round((data.correct / data.total) * 100);
              let barColor = "bg-emerald-500";
              if (tierPct < 50) barColor = "bg-red-500";
              else if (tierPct < 75) barColor = "bg-amber-500";
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-mono font-bold">{tier}</span>
                    <span className="text-sm font-semibold text-gray-400">{data.correct}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${tierPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Category Breakdown</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryScores).map(([cat, data]) => {
              const catPct = Math.round((data.correct / data.total) * 100);
              let barColor = "bg-emerald-500";
              if (catPct < 50) barColor = "bg-red-500";
              else if (catPct < 75) barColor = "bg-amber-500";
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{cat}</span>
                    <span className="text-sm font-semibold text-gray-400">{data.correct}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {incorrect.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Review Incorrect ({incorrect.length})
              </h3>
            </div>
            <div className="space-y-4">
              {incorrect.map((q) => {
                const idx = questions.findIndex(x => x.id === q.id);
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-700 text-gray-400 text-xs font-mono flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                        {q.category}
                      </span>
                      {q.difficulty && (
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold flex-shrink-0">
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed">{q.question}</p>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2 text-sm">
                        <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-300">Your answer: <span className="text-red-400 font-medium">
                          {answers[idx] === -1 ? 'Skipped' : `${q.options[answers[idx]].label}. ${q.options[answers[idx]].text}`}
                        </span></span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-300">Correct: <span className="text-emerald-400 font-medium">{q.options[q.correct].label}. {q.options[q.correct].text}</span></span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

export default function KeyTechnologiesQuiz({ quizSlug = 'in-a-hurry-key-technologies' }) {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(90);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUIZ_DATA.questions.length);

  const questions = QUIZ_DATA.questions;

  const tierTimer = (difficulty) => {
    switch (difficulty) {
      case "L1": return 60;
      case "L2": return 90;
      case "L3": return 90;
      case "L4": return 120;
      case "L5": return 150;
      default: return 90;
    }
  };

  const startTimer = useCallback((difficulty) => {
    const initialTime = tierTimer(difficulty);
    setTimer(initialTime);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleStart = () => {
    setScreen("quiz");
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    startTimer(questions[0]?.difficulty);
    startNewAttempt(questions.map(q => q.id));
  };

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);
    stopTimer();
    const q = questions[currentQ];
    const isCorrect = idx === q.correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
    persistAnswer(q.id, {
      selectedIndex: idx,
      correctIndex: q.correct,
      isCorrect,
      confidence: null,
      timedOut: false,
    });
  };

  const handleSkip = () => {
    setSelectedAnswer(-1);
    setShowFeedback(true);
    stopTimer();
    setAnswers(prev => [...prev, -1]);
    const q = questions[currentQ];
    persistAnswer(q.id, {
      selectedIndex: -1,
      correctIndex: q.correct,
      isCorrect: false,
      confidence: null,
      timedOut: true,
    });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      const nextIdx = currentQ + 1;
      setCurrentQ(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
      startTimer(questions[nextIdx]?.difficulty);
    } else {
      completeQuiz({ correct: score, total: questions.length }, 0);
      setScreen("results");
      stopTimer();
    }
  };

  if (screen === "landing") {
    return <LandingScreen onStart={handleStart} />;
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        score={score}
        total={questions.length}
        answers={answers}
        questions={questions}
        onRestart={handleStart}
      />
    );
  }

  return (
    <QuestionScreen
      question={questions[currentQ]}
      questionIndex={currentQ}
      total={questions.length}
      score={score}
      onAnswer={handleAnswer}
      onSkip={handleSkip}
      selectedAnswer={selectedAnswer}
      showFeedback={showFeedback}
      onNext={handleNext}
      timer={timer}
    />
  );
}
