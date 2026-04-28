// === COVERAGE MANIFEST ===
// Source: hellointerview.com/learn/system-design/deep-dives/redis  (Updated Jan 17, 2026)
// Total questions: 47 across 10 Parts (Ladder schema: every question tagged L1–L5)
//
// PART A — Foundation, Performance, Data Model & Commands
//   A1 (versatility — depth via fewer techs):       q01 (L1)
//   A2 (simplicity — language-like data structures): q02 (L2)
//   A3 (in-memory):                                  q01 (L1), q04 (L4)
//   A4 (single-threaded):                            q01 (L1)
//   A5 (durability tradeoff: AOF vs MemoryDB):       q02 (L2), q03 (L3), q05 (L5)
//   A6 (perf: 100k w/s, microsecond reads):          q04 (L4)
//   A7 (anti-pattern feasibility consequence):       q04 (L4)
//   A8 (key-value core):                             q02 (L2)
//   A9 (data structures supported):                  q01 (L1), q02 (L2)
//   A10 (Bloom: false-positives only):               q02 (L2)
//   A11 (communication patterns: Pub/Sub, Streams):  q02 (L2)
//   A12 (human-readable wire protocol / CLI):        — covered in spirit; questions test concept
//   A13 (predictable command surface per structure): q02 (L2)
//   A14 (INCR atomic):                               q15 (L1, in Part D), q24 (L1, in Part F)
//   A15 (XADD adds stream entry):                    q33 (L1, in Part H)
//   Ladder: L1[q01] L2[q02] L3[q03] L4[q04] L5[q05]
//
// PART B — Cluster & Sharding Model
//   B1 (single / HA / cluster):                      q06 (L1)
//   B2 (hash slots = phone book; client routes):     q06 (L1), q07 (L2)
//   B3 (MOVED + CLUSTER SHARDS refresh):             q07 (L2)
//   B4 (gossip — limited cross-redirects):           q07 (L2)
//   B5 (cluster primitives basic; not auto-scale):   q09 (L4)
//   B6 (single-node-per-request constraint):         q08 (L3), q10 (L5)
//   B7 (key choice IS scaling):                      q08 (L3), q09 (L4)
//   B8 ('add nodes' doesn't fix locality):           q09 (L4), q10 (L5)
//   Ladder: L1[q06] L2[q07] L3[q08] L4[q09] L5[q10]
//
// PART C — Caching
//   C1 (most common deployment):                     q11 (L1)
//   C2 (cache keys = Redis keys; cluster trivial):   q11 (L1)
//   C3 (capacity scales by adding nodes):            q11 (L1)
//   C4 (TTL semantic guarantee):                     q12 (L2)
//   C5 (TTL also drives eviction):                   q12 (L2), q13 (L3)
//   C6 (product:123 example shape):                  q11 (L1)
//   C7 (hot-key NOT solved here):                    q14 (L4) [cross-part to J]
//   Ladder: L1[q11] L2[q12] L3[q13] L4[q14]  (L5 absorbed by J L5 cross-part)
//
// PART D — Distributed Locks
//   D1 (Ticketmaster / Uber motivation):             q15 (L1)
//   D2 (use DB consistency if available):            q18 (L4)
//   D3 (INCR + TTL recipe):                          q15 (L1), q16 (L2)
//   D4 (TTL = safety net, lease boundary):           q16 (L2), q17 (L3)
//   D5 (Redlock + fencing tokens):                   q18 (L4), q19 (L5)
//   D6 (interviewer: 'tell me edge cases'):          q19 (L5)
//   Ladder: L1[q15] L2[q16] L3[q17] L4[q18] L5[q19]
//
// PART E — Leaderboards via Sorted Sets
//   E1 (Sorted Set, O(log N) by rank/score):         q20 (L1), q21 (L2)
//   E2 (scale advantage vs SQL ORDER BY):            q22 (L3)
//   E3 (post-search example: keyword → top-K):       q20 (L1)
//   E4 (ZADD score member):                          q20 (L1)
//   E5 (ZREMRANGEBYRANK to bound memory):            q23 (L4)
//   E6 ('top-K by X' is the trigger):                q22 (L3)
//   Ladder: L1[q20] L2[q21] L3[q22] L4[q23]  (L5 absorbed by F L5 boundary-burst pattern)
//
// PART F — Rate Limiting
//   F1 (data-structure-server flexibility):          q24 (L1)
//   F2 (fixed-window: INCR + EXPIRE):                q24 (L1), q25 (L2)
//   F3 (boundary-burst weakness):                    q26 (L3), q28 (L5)
//   F4 (sliding-window: Sorted Set + Lua atomic):    q26 (L3), q27 (L4)
//   Ladder: L1[q24] L2[q25] L3[q26] L4[q27] L5[q28]
//
// PART G — Proximity Search
//   G1 (GEOADD, GEOSEARCH BYRADIUS):                 q29 (L1)
//   G2 (O(N + log M) — N candidates, M box items):   q30 (L2)
//   G3 (geohash → square bounding boxes):            q31 (L3)
//   G4 (two-pass candidate-then-filter):             q31 (L3), q32 (L4)
//   G5 ('candidates + filter' is universal):         q32 (L4)
//   Ladder: L1[q29] L2[q30] L3[q31] L4[q32]  (L5 absorbed by H L5 framing-is-wrong pattern)
//
// PART H — Streams & Event Sourcing
//   H1 (append-only log / Kafka analog):             q33 (L1)
//   H2 (XADD durable in stream):                     q33 (L1), q34 (L2)
//   H3 (consumer groups XREADGROUP):                 q34 (L2), q35 (L3)
//   H4 (XCLAIM for failed worker):                   q35 (L3), q36 (L4)
//   H5 (Streams ≠ Pub/Sub; at-least-once redelivery): q36 (L4), q37 (L5)
//   Ladder: L1[q33] L2[q34] L3[q35] L4[q36] L5[q37]
//
// PART I — Pub/Sub
//   I1 (broadcast to current subscribers):           q38 (L1)
//   I2 (chat / notifications use cases):             q38 (L1)
//   I3 (S = sharded; modern API):                    q39 (L2)
//   I4 (at-most-once; offline subs miss):            q39 (L2), q40 (L3)
//   I5 (one connection PER NODE, not per channel):   q41 (L4)
//   I6 (channel evaporates when last sub leaves):    q40 (L3)
//   I7 (when to swap to Streams or Kafka):           q40 (L3)
//   I8 ('roll your own' anti-pattern):               q41 (L4), q42 (L5)
//   I9 (3 hops vs 2):                                q41 (L4), q42 (L5)
//   I10 (TCP setup cost dominates third hop):        q42 (L5)
//   I11 (resident memory + heartbeat chatter):       q41 (L4)
//   I12 (per-channel-connection myth):               q41 (L4)
//   Ladder: L1[q38] L2[q39] L3[q40] L4[q41] L5[q42]
//
// PART J — Hot Key Issues
//   J1 (uneven load → one node hot):                 q43 (L1)
//   J2 (ecommerce 100-node viral example):           q43 (L1), q44 (L2)
//   J3 (CPU pegs → node fails):                      q44 (L2)
//   J4 (mitigation: client-side cache):              q44 (L2), q47 (L5)
//   J5 (mitigation: replicate key + random fan-out): q44 (L2), q47 (L5)
//   J6 (mitigation: read replicas, dynamic):         q44 (L2), q47 (L5)
//   J7 (recognize + + remediate ++ as senior signal): q45 (L3), q46 (L4)
//   Ladder: L1[q43] L2[q44] L3[q45] L4[q46] L5[q47]
//
// CROSS-PART BRIDGES (≥2 required):
//   q05 (A × C) — durability requirement flip cuts into the cache framing
//   q10 (B × J) — single-node-per-request constraint and hot-key concentration share a root cause
//   q14 (C × J) — caching does NOT solve the hot-key problem
//   q19 (D × A) — fencing-token correctness rests on INCR-style atomicity from foundation
//   q37 (H × I) — chat-framing forces choosing between Streams (durability) and Pub/Sub (real-time fan-out)
//   q46 (J × B) — 'just use consistent hashing' pushback bridges sharding model and hot-key
//
// L5 PATTERN COVERAGE (target: ≥4 of 7; achieved: 7 of 7):
//   - trade-off-inversion:           q05 (Part A)
//   - two-levels-of-indirection:     q10 (Part B)
//   - adversarial-pushback:          q19 (Part D)
//   - future-proofing:               q28 (Part F)
//   - framing-is-wrong:              q37 (Part H)
//   - estimation-backed-scenario:    q42 (Part I)
//   - implementation-specific-gotcha: q47 (Part J)
//
// COVERAGE STATS:
//   Concepts: 64 IDs across 10 Parts; every concept has ≥1 question.
//   Cross-Part bridges: 6 (well above the 2 minimum).
//   L5 canon: full 7 of 7 patterns used.
//   Anti-Recall: every question is scenario-led; no question rewards memorizing the article's
//   structure, list-of-N, or labels.
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
  Eye,
  Layers,
} from "lucide-react";

const QUESTIONS = [
  // ====================================================================
  // PART A — Foundation, Performance, Data Model & Commands
  // ====================================================================
  {
    id: "redis_A_q01",
    part: "A — Foundation, Performance & Commands",
    subtopic: "Redis Foundations",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["A1", "A3", "A4", "A9"],
    l5Pattern: null,
    question:
      "You're picking between PostgreSQL (with a generously-sized buffer pool that fits the entire working set in RAM) and Redis for a small key→value lookup with a sub-millisecond p99 read SLO. Which architectural property of Redis is most directly responsible for it being the more confident pick for that latency target?",
    options: [
      "Redis uses gossip-based consensus to coordinate reads across nodes faster than Postgres replication.",
      "Redis stores data in memory by design — every read is served from RAM with no path to disk — whereas Postgres' buffer pool is a best-effort cache and the execution path can still touch disk on a miss.",
      "Redis runs query plans in parallel across CPU cores while Postgres serializes them.",
      "Redis can run on faster hardware than Postgres can.",
    ],
    correctIndex: 1,
    explanation:
      "Redis' in-memory-by-design architecture is the primary driver of microsecond reads. Postgres' buffer pool can keep hot pages in RAM, but its execution path always allows disk access. For a sub-millisecond SLO, you want a tier where 'in memory' is a guarantee rather than a tuning outcome. Single-threaded execution per node reinforces predictability (no contention surprises within a node) but the *cause* is in-memory storage.",
    interviewScript:
      "In your interview, say: 'For sub-millisecond reads I'd reach for Redis because it's in-memory by design — every read is served from RAM. Postgres can be tuned to keep the working set in its buffer pool, but the execution path still allows disk access. I want a system where in-memory is a guarantee, not a tuning outcome.'",
    proTip:
      "When the latency target is sub-millisecond, the question is rarely about clever algorithms — it's about whether the storage tier *can* touch disk at all.",
  },
  {
    id: "redis_A_q02",
    part: "A — Foundation, Performance & Commands",
    subtopic: "Redis Foundations",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["A2", "A8", "A9", "A10", "A11", "A13"],
    l5Pattern: null,
    question:
      "A teammate who has used Redis only as a cache asks: 'Why do people say Redis is *simple* — it's just a hash map, right?' Which framing best captures what people actually mean by 'Redis is simple,' as a statement that distinguishes it from most general-purpose databases?",
    options: [
      "Redis is simple because it has only two data types — strings and hashes — so there's nothing complicated to learn.",
      "Redis is simple because it has no data types at all and acts as raw memory the application interprets however it wants.",
      "Redis exposes data structures — strings, hashes, lists, sets, sorted sets, bloom filters, geospatial indexes, streams — that map directly to the same primitives you use in any general-purpose programming language. Behavior is therefore predictable and easy to reason about (including in distributed settings), unlike databases where opaque optimizers and query planners can change a query's runtime characteristics under you.",
      "Redis is simple because it doesn't support any networking — clients embed it in-process, so there's no protocol to learn.",
    ],
    correctIndex: 2,
    explanation:
      "The 'simplicity' claim is about predictability, not feature scarcity. Redis' surface looks like the data structures you already program against — sets behave like a Set, sorted sets behave like a priority queue, etc. — and the command groups per structure (SADD/SCARD/SMEMBERS/SISMEMBER for sets) read like the matching language API. There is no query optimizer making decisions you can't see, which makes reasoning about behavior at scale much more tractable than for a typical RDBMS.",
    interviewScript:
      "In your interview, say: 'Redis' simplicity isn't about being feature-light — it's about predictability. The data structures map to the ones I already use in code, and there's no query planner deciding things behind the scenes. That makes it easy to reason about how my workload will behave when I scale out, which is the property an interviewer cares about.'",
    proTip:
      "Bloom filters in Redis are probabilistic membership: false positives are possible, false negatives are not — that's exactly the inverse of what most people guess when first meeting them.",
  },
  {
    id: "redis_A_q03",
    part: "A — Foundation, Performance & Commands",
    subtopic: "Durability Trade-offs",
    difficulty: "L3",
    style: "Anti-Pattern Identification",
    conceptIds: ["A5"],
    l5Pattern: null,
    question:
      "A team is building 'real-time match-rejoin' for a multiplayer game: when a server crashes mid-match, players must rejoin within ~2s and the game state must be intact. The lead engineer says: 'Just store the live match state in Redis. It's fast.' A senior engineer pushes back. What is the senior engineer's *strongest single objection*?",
    options: [
      "Redis can't sustain 2-second rejoin latency — it's too slow for real-time gameplay.",
      "Redis is single-threaded, so concurrent player updates queue and miss the rejoin SLA.",
      "Redis' speed is fine — but it's an in-memory store whose persistence (even with AOF) does not match an RDBMS's commit-to-disk guarantee. If the Redis node dies before the most recent moves have been flushed, the rejoin will produce a stale or empty state. The lead is treating 'fast cache' as if it had the durability semantics of a database. The right move is either to accept lossy rejoin explicitly, tune AOF and own the residual data-loss window, or use MemoryDB.",
      "Redis hash slots will rebalance during the crash, making rejoin ambiguous about which node holds the match state.",
    ],
    correctIndex: 2,
    explanation:
      "Speed and concurrency are red herrings here. The real concern is durability semantics. Redis is in-memory; AOF (Append-Only File) reduces data loss but is an *intentional trade-off* and does not give you the same guarantees a relational database provides on commit-to-disk. For 'state must be intact on rejoin,' that gap is exactly the problem. MemoryDB exists for the case where you want Redis-shaped APIs but need disk-based durability.",
    interviewScript:
      "In your interview, say: 'Redis is fast enough, but the question for live match state is durability. AOF reduces data loss but doesn't give me the commit-to-disk guarantee an RDBMS does, so a node crash can drop the last few moves. I'd either accept lossy rejoin explicitly, tune AOF and own the residual data-loss window, or move to MemoryDB which trades a bit of speed for disk-backed durability.'",
    proTip:
      "Whenever someone says 'just put it in Redis,' the very next question to surface is: how much data loss is acceptable on a node failure?",
  },
  {
    id: "redis_A_q04",
    part: "A — Foundation, Performance & Commands",
    subtopic: "Performance Profile",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["A3", "A6", "A7"],
    l5Pattern: null,
    question:
      "You've sketched a service that fans out 100 small per-item lookups against Redis to assemble a single API response. The interviewer asks: 'If you proposed that against a SQL database I'd push back hard. Why is the same pattern *defensible* against Redis, and what's the limit you'd still respect?' Which response best demonstrates senior judgment?",
    options: [
      "It's identical — 100 small lookups is bad architecture against any storage system; rewrite as a single multi-get.",
      "Redis throughput (~100k writes/sec, microsecond-range reads) makes 100 small lookups *tolerable* where SQL would buckle under per-query overhead. But 'tolerable' is not 'free' — it still adds round-trips. I'd prefer pipelining or a single multi-key call when possible, and I'd respect the cluster constraint that all keys for one logical request should ideally live on the same node so the fan-out doesn't cross slots.",
      "Redis' performance comes from its query planner choosing parallel execution — so the 100 lookups run concurrently and there is no overhead.",
      "Redis is so fast that overhead doesn't exist; fan out as widely as you want.",
    ],
    correctIndex: 1,
    explanation:
      "Redis' in-memory architecture lets it sustain ~100k writes/sec and microsecond-range reads, which makes per-request overhead small enough that patterns that would kill a SQL database (many tiny round-trips) are feasible. The senior framing is: 'feasible, not optimal' — pipeline or multi-get when you can, and respect the single-node-per-request locality constraint so the fan-out doesn't degrade into cross-slot round-trips. (a) is too dogmatic; (c) is wrong about Redis having a query planner; (d) ignores that overhead, while small, is non-zero.",
    interviewScript:
      "In your interview, say: 'Against SQL, 100 small lookups is a smell — per-query overhead dominates. Against Redis, the in-memory profile makes that overhead small enough that the pattern is *defensible*, not optimal. I'd still prefer pipelining or MGET, and I'd make sure all the keys for a single request hash to the same node so the fan-out doesn't cross slots.'",
    proTip:
      "'In-memory + simple data structures' makes Redis tolerant of patterns that would be anti-patterns elsewhere. Recognize the difference between *tolerable* and *good* — and always show you know which one you're choosing.",
  },
  {
    id: "redis_A_q05",
    part: "A — Foundation, Performance & Commands",
    subtopic: "Durability Trade-offs (Cross-Part)",
    difficulty: "L5",
    style: "Cross-Part Bridge",
    conceptIds: ["A5", "C1"],
    l5Pattern: "trade-off-inversion",
    question:
      "Your Redis-backed pricing service is performing beautifully — sub-millisecond reads, ~80k writes/sec, single-region. Then product hands you a new requirement: pricing changes must be *legally auditable* — after a power-loss event, the most recent committed change must be replayable exactly. A teammate says: 'Easy — turn on AOF and we're done.' Why is that response subtly wrong, and what is the senior+ move?",
    options: [
      "AOF is fine — once enabled, the audit requirement is satisfied as long as the AOF file is replicated.",
      "AOF is too slow at 80k writes/sec, so the only fix is to disable AOF and accept the lost data.",
      "The new requirement *flips the original constraint*. AOF reduces data loss but does NOT match an RDBMS's commit-to-disk guarantee — the most recent few writes in the in-memory buffer can be lost on power failure unless AOF is set to fsync-per-write, which destroys the throughput Redis was chosen for. The senior+ move is to recognize that the workload's defining property has changed (fast cache → durable system of record) and re-decide the tool: MemoryDB if you want Redis APIs with disk-backed durability, or a real RDBMS as the source of truth with Redis kept as a cache. Don't bolt durability onto a tool you picked under different constraints.",
      "Write to Redis and to a SQL database in parallel from the application; ignore consistency between them.",
    ],
    correctIndex: 2,
    explanation:
      "Classic trade-off inversion. Redis was correct under 'fast reads, lossy OK.' When the requirement becomes 'must be durable for audit,' the right move isn't to layer durability onto Redis — it's to revisit the architecture choice. AOF with per-write fsync technically works but undoes the property that motivated Redis in the first place. MemoryDB is right if you want Redis-shaped APIs with disk-backed durability; an RDBMS is right if Redis no longer earns its place. Why (a) and (d) tempt: (a) sounds reassuring (AOF feels like the durability knob); (d) feels paranoid-safe (writing to both). The deeper insight: when the workload's defining property flips, re-pick the tool — don't compensate around the old one.",
    interviewScript:
      "In your interview, say: 'The original Redis pick was right under fast-reads-lossy-OK. The audit requirement flips that constraint. AOF reduces loss but doesn't give me commit-to-disk semantics unless I fsync per write, which costs me the throughput I picked Redis for. The senior move is to acknowledge that the workload's defining property has changed and re-pick the tool — MemoryDB if I want Redis APIs with disk durability, or an RDBMS as the system of record with Redis as a cache.'",
    proTip:
      "When a requirement flips, resist the urge to layer compensations onto your existing pick. Re-decide the tool first; if you're lucky, the same tool still wins on the new constraints.",
  },

  // ====================================================================
  // PART B — Cluster & Sharding Model
  // ====================================================================
  {
    id: "redis_B_q06",
    part: "B — Cluster & Sharding",
    subtopic: "Cluster Routing",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["B1", "B2"],
    l5Pattern: null,
    question:
      "Your company runs Redis in cluster mode with 12 nodes. A new client connects for the first time and issues `GET user:42`. How does the client know *which* of the 12 nodes actually holds that key, in the common case?",
    options: [
      "It broadcasts the GET to all 12 nodes and takes the first response.",
      "It picks a random node; if wrong, the request fails and the client falls back to the next node round-robin.",
      "The client maintains a local map of hash-slot ranges → nodes (built from cluster topology), hashes the key to a slot, and connects directly to the node responsible for that slot. The 'phone book' is local so the request is one network hop in the happy path.",
      "A central coordinator process tracks all keys and tells the client which node to use.",
    ],
    correctIndex: 2,
    explanation:
      "Redis Cluster routes by hash slots. Clients cache a slot→node map and route requests directly. There is no central coordinator and no broadcast. This local map is what makes cluster requests cheap — the client almost always hits the correct node on the first try.",
    interviewScript:
      "In your interview, say: 'Each key hashes to one of 16,384 slots. The client caches a slot→node map at startup, hashes the key, and connects directly to the right node. It's effectively a phone book — there's no central coordinator and no broadcast.'",
    proTip: null,
  },
  {
    id: "redis_B_q07",
    part: "B — Cluster & Sharding",
    subtopic: "Topology Changes",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["B2", "B3", "B4"],
    l5Pattern: null,
    question:
      "Your Redis cluster has just finished a failover: slot 8137 moved from node-A to node-B. A client that hasn't refreshed its slot map sends `GET orders:99` (which hashes to 8137) to node-A. Which behavior is the client most likely to observe, and what should it do?",
    options: [
      "node-A returns NULL because it no longer holds the slot. The client should treat it as a missing key.",
      "node-A returns a `MOVED` redirect that names node-B. The client retries against node-B and refreshes its local slot map (e.g. via `CLUSTER SHARDS`) so subsequent requests for that slot route correctly. Gossip between nodes makes the limited redirect possible, but Redis is optimized for the client hitting the right endpoint *first* — the redirect is a correction, not a normal-case routing primitive.",
      "node-A silently forwards the request to node-B and returns the answer; the client never learns the topology changed.",
      "The cluster blocks all reads to slot 8137 until every client has been individually notified of the move.",
    ],
    correctIndex: 1,
    explanation:
      "On a slot move (rebalance or failover), the *server* replies with `MOVED` so the client knows where the slot lives now and can refresh its map. Gossip lets nodes share enough topology to issue these redirects, but the design priority is to hit the right endpoint first — the redirect path is a recovery, not the steady-state routing path.",
    interviewScript:
      "In your interview, say: 'After a failover, the wrong node replies with MOVED telling the client which node now owns the slot. The client retries there and refreshes its slot map — usually via CLUSTER SHARDS. The redirect is a safety net; the steady-state path is direct routing from the client's local map.'",
    proTip: null,
  },
  {
    id: "redis_B_q08",
    part: "B — Cluster & Sharding",
    subtopic: "Single-Node Constraint",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: ["B6", "B7"],
    l5Pattern: null,
    question:
      "You're modeling chat: messages keyed `msg:<msgId>`, conversation membership keyed `conv:<convId>:members`. A new feature requires a single Redis transaction that reads a conversation's member list AND writes a new message atomically. In a Redis cluster, what goes wrong, and what's the right fix?",
    options: [
      "Nothing goes wrong — Redis transactions are global across the cluster and can touch any keys.",
      "The transaction will silently succeed but with stale reads, because the cluster doesn't synchronize transaction boundaries across nodes.",
      "Multi-key transactions (and most multi-key operations) require all touched keys to live on a *single node*. `msg:<msgId>` and `conv:<convId>:members` will hash to different slots on different nodes, so the transaction will fail with a CROSSSLOT error. The fix is to design the keys so they co-locate — using a hash-tag like `conv:{<convId>}:members` and `conv:{<convId>}:msg:<msgId>` forces both keys into the same slot. Key design *is* your scaling design in Redis.",
      "Move both keys into the same Redis hash structure under one key (HSET) — this avoids cluster sharding entirely.",
    ],
    correctIndex: 2,
    explanation:
      "Redis cluster's defining constraint is that multi-key operations (transactions, MGET, scripts) must touch keys living on a single node. If the keys hash to different slots, the operation fails. The standard fix is hash tags: anything inside `{...}` in a key is what gets hashed, so you can deliberately co-locate related keys in the same slot. This is why the article says 'how you organize keys IS how you organize your data and scale your cluster.'",
    interviewScript:
      "In your interview, say: 'Multi-key transactions in Redis Cluster require all keys to live on the same node. With independent keys for messages and members, they'll hash to different slots and the transaction will fail with CROSSSLOT. I'd use hash tags — putting the conversation ID inside braces — to force both keys to the same slot. In Redis, key design and scaling design are the same conversation.'",
    proTip:
      "Whenever an interviewer asks about a Redis transaction or Lua script in a sharded cluster, the first thing to surface is whether all touched keys can be co-located on one node.",
  },
  {
    id: "redis_B_q09",
    part: "B — Cluster & Sharding",
    subtopic: "Scaling Misconceptions",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["B5", "B7", "B8"],
    l5Pattern: null,
    question:
      "Your interviewer says: 'You said Redis cluster scales horizontally. So if my workload is too slow, I just add nodes — right?' Which response best captures the *senior+* nuance?",
    options: [
      "Yes — Redis is linearly scalable in node count for any workload.",
      "Adding nodes increases aggregate memory and aggregate throughput — but Redis cluster primitives are deliberately basic; they don't *automatically* solve scalability for you. Two specific limits matter: all data for a single request typically must live on one node, and uneven key access can concentrate load on a single node regardless of cluster size. Adding nodes fixes capacity but does NOT fix a key-design or hot-key problem. Redis gives you primitives — *your key choices* are what scales.",
      "No — Redis cluster doesn't scale horizontally at all; for more throughput you must vertically scale the single primary.",
      "Adding nodes only helps with reads. Writes are always routed to a single coordinator node regardless of cluster size.",
    ],
    correctIndex: 1,
    explanation:
      "Redis cluster gives you basic distribution primitives — slot-based routing, replication, gossip — but it does not auto-balance load. Two failure modes survive 'just add nodes': (1) single-node-per-request locality, which limits the surface that benefits from extra nodes, and (2) uneven key access, where one popular key floods one node. Adding nodes scales capacity, not skew. Senior candidates surface both before promising linear scale.",
    interviewScript:
      "In your interview, say: 'Adding nodes scales capacity — more memory, more aggregate throughput. It does NOT scale skew. Two specific limits: data for one request typically must live on one node, and a hot key still pegs one node no matter how big the cluster is. Redis gives you primitives; my key design is what determines whether those primitives actually buy me linear scale.'",
    proTip:
      "Cluster *primitives* and cluster *scalability* are not the same thing. Cluster primitives are basic; scalability comes from how you use them.",
  },
  {
    id: "redis_B_q10",
    part: "B — Cluster & Sharding",
    subtopic: "Surface vs Real Bottleneck",
    difficulty: "L5",
    style: "Cross-Part Bridge",
    conceptIds: ["B6", "B8", "J1"],
    l5Pattern: "two-levels-of-indirection",
    question:
      "A team complains that their Redis cluster is 'slow.' Dashboards show the cluster averaged across all nodes is at 35% CPU and 30% memory — plenty of headroom — but p99 latency for one specific high-traffic API is 4× higher than for everything else. The team's response is: 'add more nodes.' What is the *actual* problem they're chasing past, and what is the senior+ first move?",
    options: [
      "Adding nodes is correct; the cluster is under-provisioned even though the average shows headroom.",
      "The cluster's *average* CPU is healthy because most nodes are idle relative to one or two hot ones. The real bottleneck is locality, not capacity: either a hot key is concentrating one slot's traffic on one node, or the slow API issues multi-key operations that cross slots and degrade into client-side fan-out. Adding nodes fixes neither. The senior+ first move is to inspect per-node CPU/throughput — not the average — and look at the slow API's key access pattern: is it one hot slot, or cross-slot fan-out?",
      "p99 latency is unrelated to cluster shape; the issue is the network between client and cluster — deploy the cluster closer to the client.",
      "The cluster's gossip protocol overhead grows with node count, so adding nodes will make the latency worse — the team should *remove* nodes.",
    ],
    correctIndex: 1,
    explanation:
      "Two-levels-of-indirection. The surface signal — 'cluster slow' — points at cluster size, but average CPU is hiding skew across nodes. The real bottleneck is one of two locality issues: a hot key/slot pegging one node, or multi-key operations crossing slots and forcing client-side merging. Both are invisible to a 'cluster average' dashboard. Adding nodes spreads cold data more thinly while leaving the hot or cross-slot path unchanged. Why (a) tempts: 'if it's slow, add capacity' is the default move and feels safe. The deeper insight an interviewer is listening for: when only one API is slow and only one or two nodes are hot, the bottleneck is locality, not capacity — and you cannot solve a locality problem with capacity.",
    interviewScript:
      "In your interview, say: 'The average CPU is hiding skew. I'd look at *per-node* CPU and at the slow API's key access pattern. Two likely culprits: a hot key is pegging one node — adding nodes won't help because all reads of that key still go to one slot — or the API is doing multi-key ops that cross slots and degrade to client-side merging. Both look like cluster-size problems on the dashboard but are actually key-design problems.'",
    proTip:
      "Whenever cluster latency is bad but cluster-average utilization is healthy, the next thing to look at is *per-node* utilization. Skew kills the average's usefulness.",
  },

  // ====================================================================
  // PART C — Caching
  // ====================================================================
  {
    id: "redis_C_q11",
    part: "C — Caching",
    subtopic: "Cache as Distributed Hash Map",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["C1", "C2", "C3", "C6"],
    l5Pattern: null,
    question:
      "An ecommerce service caches product details to absorb a 50× read amplification on hot SKUs. The team asks: 'If we deploy Redis as a cluster of N nodes, do we need to do anything special to use it as a cache, or do we just write keys?' Which answer best captures the natural shape?",
    options: [
      "You need a custom routing layer in front of Redis — out of the box, cluster mode does not partition cache keys across nodes.",
      "Use it as a giant distributed hash map: cache keys map to Redis keys (e.g. `product:123` → JSON blob, or a Redis Hash with name/price/inventoryCount fields). The cluster distributes those keys across nodes by hash slot automatically, so adding capacity is 'add a node.' The only thing you have to think about is key design — which the cache pattern makes easy because there's a natural one-to-one mapping from cache key to Redis key.",
      "Cluster mode disables TTL, so caching can only be done on a single node.",
      "You must replicate every key to every node manually — Redis cluster doesn't do this for you.",
    ],
    correctIndex: 1,
    explanation:
      "Caching is the most natural and most common Redis deployment because the abstraction lines up: a cache is a key→value map, and Redis is a key→value store. Cluster mode distributes those keys across nodes by hash slot; you scale capacity by adding nodes. The only design surface is key choice (which is easy in the cache case — there's a natural identifier per cached item).",
    interviewScript:
      "In your interview, say: 'I'd treat Redis as a giant distributed hash map. The cache key is the Redis key — `product:123` maps to either a JSON blob or a Redis Hash. The cluster spreads those keys across nodes by hash slot, so to add capacity I just add nodes. The only design choice is the key itself, which is naturally easy for caching.'",
    proTip: null,
  },
  {
    id: "redis_C_q12",
    part: "C — Caching",
    subtopic: "TTL Semantics",
    difficulty: "L2",
    style: "Gotcha/Trap",
    conceptIds: ["C4", "C5"],
    l5Pattern: null,
    question:
      "A junior engineer says: 'I set a 60-second TTL on this cache key. So I'm guaranteed the data in it is *at most* 60 seconds out of date.' Which precise correction best preserves what TTL actually guarantees and what it does not?",
    options: [
      "The junior is correct — TTL gives you both a freshness guarantee and an eviction policy.",
      "The TTL guarantee is a *read* guarantee: you will never read the value after the TTL expires (the value is removed). It does NOT, by itself, guarantee that the cached value is fresh relative to the source of truth — between cache writes, the underlying source could have changed at any point in the last 60 seconds. TTL also doubles as the eviction policy: it caps how long a key can survive in the cache and helps keep memory under control.",
      "TTL guarantees the value will be read no more than 60 seconds after it was written, but only on a single-node deployment — across a cluster, replication lag invalidates this guarantee.",
      "TTL is a soft hint to Redis; on memory pressure, keys may be evicted earlier and on idle nodes, may stay longer.",
    ],
    correctIndex: 1,
    explanation:
      "TTL gives a *non-stale-read* guarantee: a value is never read past its expiration. It does NOT give a 'fresh-relative-to-source' guarantee — between cache writes, the upstream source can drift arbitrarily. TTL is also Redis' eviction lever for cache use: it bounds how long any key can occupy memory, which is what makes caching workloads viable when more items would be cached than fit in memory.",
    interviewScript:
      "In your interview, say: 'TTL is a read guarantee — Redis won't serve a value past its expiration. It's not a freshness-vs-source guarantee; the source could have changed five seconds after I cached, and I'd still serve the old value for the next 55. TTL also doubles as eviction — it's the lever that keeps the cache size bounded.'",
    proTip: null,
  },
  {
    id: "redis_C_q13",
    part: "C — Caching",
    subtopic: "TTL-Driven Eviction",
    difficulty: "L3",
    style: "Multi-Hop Reasoning",
    conceptIds: ["C5"],
    l5Pattern: null,
    question:
      "Your Redis cache has hit a memory ceiling. You're caching 20M keys but RAM only fits ~12M. Without changing node count, what does TTL-as-eviction give you, and what does it NOT solve?",
    options: [
      "TTL eviction guarantees the cache will never be full because expired keys are removed immediately on insertion.",
      "TTL ensures memory is bounded by *time* — once a key's TTL expires, it leaves memory and frees space for new keys. This makes a finite-memory cache viable when the working set drifts over time. What TTL does NOT solve is *concurrent* hot keys: if all 20M keys are accessed within their TTL windows, you'll still spill — TTL bounds churn, not size at any single instant. For that case you need an eviction policy (LRU/LFU) on top of TTL, or smarter key selection.",
      "TTL ensures memory is bounded by request rate — keys are evicted when their access frequency drops.",
      "TTL is unrelated to memory management; it only governs how long an individual key is valid for reads.",
    ],
    correctIndex: 1,
    explanation:
      "TTL is what makes the cache size manageable when more items would be cached than memory allows — items leave naturally as TTLs fire. But TTL bounds churn, not instantaneous size. If you genuinely want all 20M keys hot at once, TTL alone won't save you — you'll still hit memory pressure. The cache eviction policy (e.g. LRU/LFU) is what kicks in for *that* case.",
    interviewScript:
      "In your interview, say: 'TTL is the eviction lever for time-based churn — keys leave memory when they expire, freeing space for new ones. That makes caches viable when the working set drifts. But TTL doesn't bound concurrent hotness — if all 20M keys are accessed within their TTL windows I still spill, and I'd want LRU or LFU on top.'",
    proTip: null,
  },
  {
    id: "redis_C_q14",
    part: "C — Caching",
    subtopic: "What Caching Does Not Fix (Cross-Part)",
    difficulty: "L4",
    style: "Cross-Part Bridge",
    conceptIds: ["C7", "J1"],
    l5Pattern: null,
    question:
      "You've put Redis cluster in front of a Postgres database to absorb read load on product pages. A new product (one SKU) goes viral — that single key now drives ~40% of total cache traffic. Your interviewer asks: 'Doesn't Redis-as-cache solve hot keys for you, since it's distributed?' Which response is correct?",
    options: [
      "Yes — distributing the cache across N nodes spreads each key 1/N evenly, so hot keys are not a problem on a sufficiently large cluster.",
      "No. Redis-as-cache is a distributed *hash map* — each key still lives on exactly one slot, on one primary node. A hot key concentrates traffic on that one node regardless of cluster size; the cluster does not help here. The hot-key problem is not unique to Redis (Memcached and high-scale DynamoDB share it), and the standard remediations — client-side cache, replicating the key across multiple Redis keys with random fan-out, dynamic read replicas — are layered *on top of* Redis caching, not given to you by it.",
      "Yes — Redis automatically replicates hot keys across all nodes when access frequency exceeds a threshold.",
      "No, but Redis Pub/Sub bypasses the hot-key problem entirely; the right answer is to migrate the cache to Pub/Sub.",
    ],
    correctIndex: 1,
    explanation:
      "Redis-as-cache distributes *the keyspace* across nodes, not *each key's traffic*. One key still lives on one slot on one primary, so a viral SKU's read storm hits one node. Adding nodes does not help. The hot-key problem is shared by other distributed caches (Memcached, DynamoDB at scale). Senior candidates separate 'Redis-as-cache reduces *cache miss* DB load' (which it does well) from 'Redis-as-cache solves *hot key* concentration' (which it does not).",
    interviewScript:
      "In your interview, say: 'Redis-as-cache distributes the keyspace, not the traffic to any one key. A viral SKU still lives on one slot on one node — that node sees 40% of total traffic regardless of cluster size. The hot-key problem is shared by Memcached and high-scale DynamoDB. The fixes — client-side cache, key replication with random fan-out, read replicas — are things I bolt on; Redis-as-cache doesn't give them to me automatically.'",
    proTip:
      "Distinguish 'cache misses crushed your DB' (a problem Redis-as-cache solves) from 'one cache key crushed one Redis node' (a problem Redis-as-cache does NOT solve). They look similar; they are not the same.",
  },

  // ====================================================================
  // PART D — Distributed Locks
  // ====================================================================
  {
    id: "redis_D_q15",
    part: "D — Distributed Locks",
    subtopic: "Simple Lock Recipe",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["D1", "D3", "A14"],
    l5Pattern: null,
    question:
      "You need to ensure only one of many worker processes runs a daily reconciliation job at midnight, even if multiple processes wake up at the same time. You want a simple Redis-backed coordination primitive. Which atomic operation against a single key gives you 'first one through wins, others retry,' as the basis of a simple distributed lock?",
    options: [
      "INCR a shared counter key. If the response is 1, you got the lock; if > 1, someone else has it. DEL the key when done so others can take it later.",
      "GET the key, then SET it if the value is null. The two-step nature is fine because Redis is single-threaded.",
      "Use Pub/Sub: publish an 'I'm starting' message and only the first publisher wins.",
      "ZADD into a sorted set with the worker's ID; the lowest-scoring entry holds the lock.",
    ],
    correctIndex: 0,
    explanation:
      "INCR is atomic — exactly one caller will see the response '1.' That's the simplest possible 'first-through-wins' lock primitive against Redis. DEL releases it. (b) is wrong because GET-then-SET is not atomic against another client; (c) doesn't give you mutual exclusion; (d) works for a queue, not a lock.",
    interviewScript:
      "In your interview, say: 'INCR is atomic — exactly one caller sees the response 1. That's my lock-acquired signal. Others see > 1 and retry. When the holder finishes, it DELs the key. It's a couple of lines and uses no special locking primitives — just INCR's atomicity.'",
    proTip:
      "Most simple Redis patterns (locks, rate limits, leaderboards) ride on the atomicity of one Redis command. Recognize the primitive each pattern is built on.",
  },
  {
    id: "redis_D_q16",
    part: "D — Distributed Locks",
    subtopic: "Why TTL on Locks",
    difficulty: "L2",
    style: "Failure Analysis",
    conceptIds: ["D3", "D4"],
    l5Pattern: null,
    question:
      "You've built the INCR-based lock, but on a Friday night the worker that holds the lock crashes mid-job — without releasing it. By Monday morning every worker is still spinning trying to acquire. What single change to the original recipe prevents this *class* of failure?",
    options: [
      "Add a centralized monitor that detects crashed workers and DELs the lock on their behalf.",
      "Set a TTL on the lock key when it's acquired. If the holder crashes without releasing, the key expires automatically and another worker can take the lock — the TTL is your safety net, not your primary release mechanism.",
      "Switch from INCR to a GET-then-SET pattern, which automatically releases the lock when the connection closes.",
      "Replicate the lock key across all cluster nodes so a single node's crash doesn't strand it.",
    ],
    correctIndex: 1,
    explanation:
      "The TTL acts as a lease: even if the holder dies without releasing, the lock evaporates after the TTL and another worker can take it. The TTL is a safety net for crashes, not the primary release path — your job releases via DEL on success, and TTL handles failure cases.",
    interviewScript:
      "In your interview, say: 'I'd add a TTL to the lock key when I take it. The TTL is a lease — if my worker crashes without DELing the key, the lock evaporates after the TTL fires and another worker can take it. The TTL is the safety net; DEL is still the normal release path.'",
    proTip: null,
  },
  {
    id: "redis_D_q17",
    part: "D — Distributed Locks",
    subtopic: "Lease Boundary Trade-off",
    difficulty: "L3",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["D4"],
    l5Pattern: null,
    question:
      "You set the lock TTL to 5 seconds. Some jobs reliably take 2 seconds; some occasionally take 20 seconds. Your interviewer asks: 'Walk me through what goes wrong with each TTL choice — too long vs too short — and how you'd actually pick.' What's the strongest answer?",
    options: [
      "TTL choice doesn't matter — Redis releases the lock when the job finishes regardless.",
      "Too long: if a holder crashes, all other workers wait for the entire TTL before retrying — your system stalls on every failure. Too short: a slow-but-alive holder gets its lease revoked while still working, and a second worker grabs the lock — now you have *two* workers running the same job, which is the exact thing the lock was supposed to prevent. The right choice usually pairs a TTL with periodic *lease renewal* by the holder while it's alive — turning the TTL into a heartbeat-controlled lease — and accepts that 'how long is acceptable to stall on crash' and 'how long before we risk overlap' are the two ends of the trade-off.",
      "Always choose TTL = 1 second; Redis is fast enough that you can renew this many times per second.",
      "Choose the TTL by halving the average job duration — this is the proven mathematical optimum.",
    ],
    correctIndex: 1,
    explanation:
      "The TTL is a *lease boundary*. Too long → long stall after a crash. Too short → revoked while still working, with a second holder running concurrently. The senior framing is to accept the trade-off explicitly and (often) add lease renewal — the holder periodically extends its TTL while alive — so the lock is held only as long as the holder remains responsive.",
    interviewScript:
      "In your interview, say: 'TTL is a lease boundary. Too long, my system stalls after every crash. Too short, a slow-but-alive holder gets revoked and a second worker grabs the lock — now I have two workers running the same job. I'd usually pair the TTL with periodic lease renewal so the lock is held only as long as the worker is alive, and pick a TTL based on max-tolerable stall after a crash.'",
    proTip: null,
  },
  {
    id: "redis_D_q18",
    part: "D — Distributed Locks",
    subtopic: "When Not to Use a Distributed Lock",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["D2", "D5"],
    l5Pattern: null,
    question:
      "Your interviewer asks: 'You're updating an inventory_count column for one item. You want exactly one update at a time. Should you reach for a Redis distributed lock, Redlock with fencing tokens, or something simpler?' What's the best answer?",
    options: [
      "Always use Redlock + fencing tokens — distributed locking is the only correct way to coordinate updates across multiple processes.",
      "If the database itself can give you the consistency guarantee — e.g. a row-level lock via `SELECT ... FOR UPDATE`, or a conditional update with a version check — *use the database*. A Redis distributed lock adds an extra system, extra failure modes (lock leaks, lease overlap, fencing complexity), and extra interviewer-drilled edge cases to defend. Reach for Redlock + fencing tokens only when the database genuinely can't provide the guarantee — typically across heterogeneous resources, not for a single-row update.",
      "Use Redis-as-cache instead — caching the inventory_count is faster than locking it.",
      "Use a Redis distributed lock unconditionally; it's faster than database row locks and gives the same guarantee.",
    ],
    correctIndex: 1,
    explanation:
      "The article is direct: if your core database can provide consistency, *don't reach for a distributed lock first*. A distributed lock adds complexity (lease semantics, fencing tokens, edge cases) that interviewers will probe. The Redlock + fencing-tokens combo is the *airtight* shape — but you only need it when nothing simpler will do, typically when coordinating across multiple resources where the database alone can't enforce the invariant.",
    interviewScript:
      "In your interview, say: 'For a single-row update, I'd use the database — SELECT FOR UPDATE or a conditional update with a version check. A Redis distributed lock adds an extra system and a stack of edge cases I'd have to defend. I reach for Redlock plus fencing tokens only when the database alone can't enforce the invariant, like coordinating an action across multiple heterogeneous systems.'",
    proTip:
      "When your interviewer asks 'why not use Redlock?', the strongest answer is usually 'because the database is already giving me the guarantee I need.'",
  },
  {
    id: "redis_D_q19",
    part: "D — Distributed Locks",
    subtopic: "Adversarial: 'Couldn't You Just DEL?' (Cross-Part)",
    difficulty: "L5",
    style: "Cross-Part Bridge",
    conceptIds: ["D5", "D6", "A14"],
    l5Pattern: "adversarial-pushback",
    question:
      "Your design uses the simple INCR + TTL lock. The interviewer says: 'Couldn't your job just `DEL` the key when it's done? What's the issue with that?' Which answer best captures the subtle correctness flaw and the canonical fix?",
    options: [
      "There's no issue — DEL on completion is the standard release pattern for the simple lock.",
      "DEL deletes whatever is at the key — even if it's no longer *your* lock. Concretely: your worker stalls past the TTL, the key expires, a second worker grabs the lock; your worker un-stalls, sees its job 'finished,' and `DEL`s the key — releasing someone else's lock. The canonical fix is to (1) write a unique value (a token) when acquiring (e.g. via SET NX with the token) so you can verify ownership before DEL, ideally in a Lua script for atomicity, AND (2) for high-stakes shared resources, attach a *fencing token* — a monotonically increasing number that the resource validates on each write so a stale holder cannot mutate state past its lease.",
      "DEL is not atomic in Redis cluster mode; the fix is to use UNLINK instead.",
      "DEL is fine, but you should DEL twice in a row to be safe in case the first one races with a concurrent INCR.",
    ],
    correctIndex: 1,
    explanation:
      "Adversarial pushback: the easy alternative ('just DEL') has a subtle correctness flaw. Once a TTL fires and the lock has been re-acquired by a second holder, an unsuspecting first holder will release someone else's lock by `DEL`-ing the same key. The canonical defense pairs (1) ownership-checked release — set a unique token at acquire, verify it on release, ideally in a single Lua script — and (2) for shared resources where the bad write must be hard-stopped, fencing tokens validated by the resource itself, so a stale holder *physically cannot* commit a write past its lease. This is the Redlock + fencing-tokens pattern. Why other answers tempt: the (a) reading is correct in the absence of TTL, but the moment you have a TTL the reasoning changes; (c) and (d) confuse mechanism with semantics. The deeper insight: 'simple lock + TTL' has correctness gaps that compound with each other — TTL alone makes it crash-safe but introduces the overlap risk that DEL alone cannot defend against.",
    interviewScript:
      "In your interview, say: 'DEL releases whoever's lock is at that key, not specifically *my* lock. If my worker pauses past the TTL, the key expires, a second worker takes it, and my worker DELs that second worker's lock when it finishes. The fix is to set a unique token when I acquire the lock, verify the token on release, and do that check-and-DEL atomically — typically in a Lua script. For high-stakes shared resources I'd add a fencing token validated by the resource itself, so a stale holder can't write past its lease — that's the Redlock-plus-fencing pattern.'",
    proTip:
      "When the interviewer asks 'couldn't you just X?', they're usually probing whether you've thought through TTL-overlap, ABA-style, or stale-holder edge cases. Have a concrete fencing-token sketch ready.",
  },

  // ====================================================================
  // PART E — Leaderboards via Sorted Sets
  // ====================================================================
  {
    id: "redis_E_q20",
    part: "E — Leaderboards (Sorted Sets)",
    subtopic: "Sorted Sets as Leaderboard",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["E1", "E3", "E4"],
    l5Pattern: null,
    question:
      "You're building post-search by keyword: for the keyword 'tiger,' you need to surface the top-K posts by like-count in real time. Posts are added and re-scored as users like them. Which Redis data structure most naturally fits 'top-K by score, ordered by score, fast both to update and to query'?",
    options: [
      "A Redis Hash keyed by keyword, with post IDs as fields and like counts as values.",
      "A Redis List, with newer posts pushed to the head.",
      "A Sorted Set per keyword: `ZADD tiger_posts <like_count> <postId>` adds or updates a post with its score; range queries (`ZRANGE`, `ZREVRANGE`) return the top-K in O(log N + K). Update on like is O(log N), and queries are sub-millisecond on practical sizes.",
      "Pub/Sub channels per keyword, with subscribers maintaining their own ordering.",
    ],
    correctIndex: 2,
    explanation:
      "Sorted Sets are the leaderboard primitive. ZADD inserts or updates a member's score in O(log N); ZRANGE/ZREVRANGE returns the top-K in O(log N + K). The 'tiger_posts' example in the article is exactly this shape: one sorted set per keyword, scored by like-count, supporting fast top-K queries.",
    interviewScript:
      "In your interview, say: 'Sorted Set per keyword. ZADD with the like count as the score — O(log N) per update. ZRANGE for top-K, also log-time. That's the standard top-K-by-score pattern, and it's where SQL ORDER-BY-LIMIT starts to struggle at scale.'",
    proTip:
      "Whenever the question is 'top-K by some score, fast on both write and read,' your reflex should be Sorted Set.",
  },
  {
    id: "redis_E_q21",
    part: "E — Leaderboards (Sorted Sets)",
    subtopic: "Why Log-Time",
    difficulty: "L2",
    style: "Multi-Hop Reasoning",
    conceptIds: ["E1"],
    l5Pattern: null,
    question:
      "An interviewer asks: 'You said Sorted Sets give you O(log N) lookups by rank. Concretely — in interview-speak, why log N, and why is that the property that makes leaderboards feasible at scale?' What's the strongest sketch?",
    options: [
      "Because Sorted Sets are stored in a hash table, lookups are constant-time — log N is wrong.",
      "Sorted Sets are backed by a skip-list-style ordered structure (alongside a hash for member lookup), which lets rank- and score-range queries traverse O(log N) levels rather than scanning N elements. That's why a leaderboard with 100M entries can answer 'who is at rank 17?' or 'top-100 by score' in microseconds — the cost grows with the *log* of the population, not the population itself.",
      "Sorted Sets internally maintain a SQL B-tree index, so all queries are O(log N) for the same reason SQL ORDER BY is.",
      "Log N comes from Redis splitting the sorted set across log N nodes — it's a property of the cluster, not the data structure.",
    ],
    correctIndex: 1,
    explanation:
      "Sorted Sets are an ordered structure (skip-list-shaped) plus a hash for direct member lookup. Rank and score-range queries traverse log N levels of the ordered structure — not the full N elements — which is what keeps queries fast even at huge sizes. The log-not-linear scaling is what separates 'leaderboard at any size' from 'leaderboard until N gets big.'",
    interviewScript:
      "In your interview, say: 'Sorted Sets are a skip-list-style ordered structure paired with a hash. Rank and score-range queries traverse O(log N) levels rather than scanning N. That's why I can answer top-100 on a 100M-row leaderboard in microseconds — the cost scales with *log* of the population, not the population.'",
    proTip: null,
  },
  {
    id: "redis_E_q22",
    part: "E — Leaderboards (Sorted Sets)",
    subtopic: "When SQL Stops Working",
    difficulty: "L3",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["E2", "E6"],
    l5Pattern: null,
    question:
      "Your team currently maintains 'top viral posts in last 24h' with a SQL query: `SELECT ... FROM posts WHERE ts > NOW()-INTERVAL '24h' ORDER BY likes DESC LIMIT 100`. At 10K writes/sec on `likes` it works; at 250K writes/sec it falls over. What's specifically failing, and why does a Redis Sorted Set solve it cleanly?",
    options: [
      "SQL ORDER BY doesn't work on tables larger than 1M rows; the fix is to add more indexes.",
      "At high write rates the index on `likes` is being constantly rewritten by every UPDATE, and the ORDER BY/LIMIT scan competes with those writes for I/O — both contend on the same B-tree pages. Redis Sorted Sets keep the ordering in memory, ZADD updates the rank in O(log N) without disk I/O, and ZRANGE answers the top-100 in microseconds. The Sorted Set is the data structure you reach for whenever the question is 'top-K by X' at high write rate.",
      "SQL is slower than Redis for any read-heavy workload; the fix is to put a cache in front of the SQL query.",
      "ORDER BY is fundamentally a NoSQL operation; SQL doesn't support it efficiently.",
    ],
    correctIndex: 1,
    explanation:
      "The article frames it directly: the high write throughput + low read latency of Redis make this work where SQL starts to struggle. Concretely, SQL pays for ORDER BY/LIMIT against a constantly-mutating index — every like rewrites a B-tree page, and the ranked scan competes with writes for the same pages. Redis Sorted Sets are in-memory and built for this: ZADD is log-N and writes don't touch disk, ZRANGE is log-N and microseconds.",
    interviewScript:
      "In your interview, say: 'SQL is paying for ORDER BY plus LIMIT against an index that's being rewritten by every like. At 250K writes/sec the index churn and the ranked scan are competing on the same B-tree pages. Redis Sorted Sets keep the ordering in memory — ZADD is log-N with no disk I/O, ZRANGE is log-N microseconds. That's the workload Sorted Sets exist for.'",
    proTip: null,
  },
  {
    id: "redis_E_q23",
    part: "E — Leaderboards (Sorted Sets)",
    subtopic: "Bounding Memory",
    difficulty: "L4",
    style: "Failure Analysis",
    conceptIds: ["E5"],
    l5Pattern: null,
    question:
      "Your team adds Sorted Sets per keyword for post-search. After 6 months in production, one Sorted Set has grown to 200M members. Latency on ZADD has crept from microseconds to milliseconds, and memory is the new bottleneck. What's the *minimum-cost* fix that preserves correctness for the 'top-K viewable posts' use case?",
    options: [
      "Add more cluster nodes — Sorted Sets shard automatically, so memory will rebalance.",
      "Migrate the workload back to SQL — a 200M-member Sorted Set is past Redis' practical limit.",
      "Periodically prune the Sorted Set: `ZREMRANGEBYRANK <key> 0 -<K+1>` removes everything except the top K. The leaderboard surfaces only the top viewable posts anyway, so most of the 200M tail is dead memory. Trimming on a schedule (or after each batch of inserts) keeps the structure bounded — log-N stays log-K — and the ZADD/ZRANGE operations stay microsecond-fast. The trade-off: removed entries can't 're-emerge' if their score later climbs, so the trim threshold has to allow some headroom.",
      "Increase the per-node memory; the 200M-member Sorted Set is correct as-is.",
    ],
    correctIndex: 2,
    explanation:
      "The article calls this out: 'Periodically, we can remove low-ranked posts to save space.' `ZREMRANGEBYRANK key 0 -(K+1)` keeps only the top-K. Since the leaderboard is only visible for the top K anyway, the rest is dead memory. The structure stays bounded; log-N effectively becomes log-K; latency recovers. Trade-off: a previously-low-ranked post can't re-emerge into the top-K once it's been pruned, so you usually keep a multiple of K (e.g. top 10K when you display top 100) as headroom.",
    interviewScript:
      "In your interview, say: 'I'd trim the Sorted Set periodically with ZREMRANGEBYRANK, keeping only the top K (or a small multiple of K for headroom). The leaderboard only surfaces the top K anyway, so the long tail is dead memory. Log-N becomes log-K and ZADD goes back to microseconds. The trade-off is that pruned entries can't re-emerge if their score later climbs, so I keep enough headroom to absorb that.'",
    proTip:
      "Sorted Sets are unbounded by default. In production, every leaderboard that you actually care about scaling needs a *trim policy*.",
  },

  // ====================================================================
  // PART F — Rate Limiting
  // ====================================================================
  {
    id: "redis_F_q24",
    part: "F — Rate Limiting",
    subtopic: "Fixed-Window Recipe",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["F1", "F2", "A14"],
    l5Pattern: null,
    question:
      "You need to enforce 'at most 100 API calls per user per minute.' The team wants the simplest correct Redis-only implementation. Which two-command primitive does the fixed-window rate limit ride on?",
    options: [
      "ZADD then ZRANGE: maintain a sorted set of every request and count the last minute on each call.",
      "INCR a per-window key (e.g. `rl:user:42:202604271203`) and EXPIRE that key for the window length. If INCR returns a value > N, reject; otherwise allow. The window resets automatically when the key expires.",
      "GET then SET: read the current count, increment in the application, and SET back. Redis' single-threaded execution makes this safe.",
      "Pub/Sub: publish each request to a per-user channel and count the subscribers' messages.",
    ],
    correctIndex: 1,
    explanation:
      "The article: 'When a request comes in, we increment (INCR) the key for our rate limiter and check the response. If the response is greater than N, we wait. … We call EXPIRE on our key so that after time period W, the value is reset.' This is the canonical fixed-window primitive — ride INCR's atomicity, let EXPIRE bound the window.",
    interviewScript:
      "In your interview, say: 'INCR a per-user-per-window key, EXPIRE it for the window length. If INCR returns more than N, refuse the request. The window resets when the key expires. Two commands, no race conditions because INCR is atomic.'",
    proTip: null,
  },
  {
    id: "redis_F_q25",
    part: "F — Rate Limiting",
    subtopic: "Window Boundaries",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["F2"],
    l5Pattern: null,
    question:
      "You've shipped INCR + EXPIRE for 'at most 100 requests per user per minute.' A junior engineer asks: 'Why exactly does the EXPIRE matter? Couldn't we just check the count?' What's the cleanest answer?",
    options: [
      "EXPIRE is not strictly necessary — Redis evicts old keys for you under memory pressure.",
      "Without EXPIRE, the counter never resets — once a user has incremented to 100, they're rate-limited forever (or until manual cleanup). EXPIRE is what *defines the window*: after W seconds the key disappears, the next request sees a fresh counter at 1, and the user gets a new minute's quota. The pattern is 'INCR for atomicity in this window, EXPIRE for window boundary.'",
      "EXPIRE is a soft hint and Redis sometimes ignores it; the real reset comes from the application clearing the key.",
      "EXPIRE controls how long the rate limit *applies* to the user — without it, rate-limited users would never recover access.",
    ],
    correctIndex: 1,
    explanation:
      "EXPIRE *is* the window. Without it, you have a forever-counter; with it, the key vanishes after W and the next INCR starts a new window. INCR provides atomicity *within* the window; EXPIRE defines the window boundary itself.",
    interviewScript:
      "In your interview, say: 'EXPIRE *is* the window. Without it, the counter never resets — once you hit 100, you're rate-limited forever. With it, the key vanishes after W and the next INCR starts at 1, which gives the user a fresh quota.'",
    proTip: null,
  },
  {
    id: "redis_F_q26",
    part: "F — Rate Limiting",
    subtopic: "Sliding Window with Sorted Sets",
    difficulty: "L3",
    style: "Multi-Hop Reasoning",
    conceptIds: ["F3", "F4"],
    l5Pattern: null,
    question:
      "Your fixed-window limiter allows 100/min per user. A traffic analysis shows: a user sends 100 requests at 12:00:59 and 100 more at 12:01:01 — 200 requests in 2 seconds, all 'within the rules.' The team wants to switch to a sliding window. Which Redis primitive shape is correct, and why does it specifically need Lua scripting?",
    options: [
      "Use INCR on a key that includes the current second; sum the last 60 seconds of keys per request.",
      "Per user, store request timestamps in a Sorted Set keyed by user. On each request: (1) ZREMRANGEBYSCORE to drop entries older than now-W, (2) ZCARD to count what's left, (3) reject or accept based on the count, (4) ZADD the new timestamp on accept. To avoid races where two concurrent requests both observe count = 99 before either ZADDs, the prune+count+add must run atomically — the standard fix is a Lua script (which Redis runs to completion as a single atomic unit per node).",
      "Use Pub/Sub with a per-user channel; count the subscribers' message buffer.",
      "Use Bloom filters to probabilistically estimate the rate; this is the only sliding-window approach that scales.",
    ],
    correctIndex: 1,
    explanation:
      "The article: 'If you need a sliding window, you can store timestamps in a Sorted Set per key and remove old entries before counting; run the check in Lua to keep it atomic.' The Lua script is what makes the prune-count-add sequence atomic — without it, two concurrent requests can both see count = 99, both decide 'allow,' both ZADD, and you've leaked one over the limit.",
    interviewScript:
      "In your interview, say: 'Per user, a Sorted Set of request timestamps. On each request: ZREMRANGEBYSCORE to drop anything older than now minus the window, ZCARD to count what's left, decide allow or reject, and ZADD on allow. I'd put the prune-count-add inside a Lua script — Redis runs Lua to completion as a single atomic unit per node, which prevents two concurrent requests from both reading count 99 and both being allowed.'",
    proTip:
      "Whenever your design needs 'check then mutate' atomicity in Redis and the operation isn't a single command, the answer is usually Lua.",
  },
  {
    id: "redis_F_q27",
    part: "F — Rate Limiting",
    subtopic: "Atomicity Pushback",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["F4"],
    l5Pattern: null,
    question:
      "Your interviewer asks: 'Couldn't I just do ZREMRANGEBYSCORE, then ZCARD, then ZADD as three separate Redis calls? They're each fast — why bother with Lua?' What's the strongest senior response?",
    options: [
      "You're right — three separate calls are fine because Redis is single-threaded per node, so they can't race.",
      "Even though Redis is single-threaded *per command*, between calls *another client* can interleave. Concretely: client A does ZREMRANGEBYSCORE then ZCARD, sees count = 99, decides 'allow,' but before its ZADD, client B runs the same sequence, also sees 99, also decides 'allow,' both ZADD — you've allowed 101 in the window. Lua bundles the three operations into a single atomic execution at the server, so no other client can interleave between them. This is exactly what Redis Lua exists for.",
      "Three calls are fine because Redis transactions (MULTI/EXEC) prevent interleaving — Lua is a redundant alternative.",
      "Three calls are slow because of network round-trips; Lua's value is performance, not correctness.",
    ],
    correctIndex: 1,
    explanation:
      "Single-threadedness *within* a command does not stop another client's commands from interleaving *between* yours. Redis runs each command in isolation, but two clients alternating commands can race exactly as described. Lua scripts are executed atomically — the script runs to completion before the server picks up another client's request — so Lua, not just single-threading, is what gives you the multi-step atomicity. (c) is wrong because MULTI/EXEC doesn't actually prevent interleaving conditional logic the way Lua does (you can't branch inside a transaction based on intermediate results).",
    interviewScript:
      "In your interview, say: 'Single-threaded per command, not per sequence. Between my ZCARD and my ZADD, another client can run the same sequence — both see 99, both ZADD, I'm now at 101. Lua runs the whole prune-count-add script to completion at the server before any other client's command, which gives me real atomicity. MULTI/EXEC isn't a substitute because I need to *branch* on the count, which transactions don't allow.'",
    proTip:
      "When a multi-step Redis pattern needs atomicity *with conditional logic*, Lua is your tool, not transactions.",
  },
  {
    id: "redis_F_q28",
    part: "F — Rate Limiting",
    subtopic: "Future-Proofing the Window Choice",
    difficulty: "L5",
    style: "Anti-Pattern Identification",
    conceptIds: ["F2", "F3"],
    l5Pattern: "future-proofing",
    question:
      "Your fixed-window limiter has been running smoothly for a year — average traffic is uniform, no abuse. Marketing now plans a coordinated push (push notification + email + paid ad, all firing at the top of each minute). The 'top-of-minute' synchronization is what changes. Why does the previously-fine fixed-window design fail under this new pattern, and what's the principled re-design?",
    options: [
      "Fixed-window keeps working — Redis is fast enough to absorb any spike.",
      "The fixed-window's worst case is well-known: a user can fire N requests at the end of one window and N more at the start of the next — 2N within an interval of ~0. With *uniform* traffic this is rare; under *synchronized* traffic (everyone hits 'top of minute'), it's the *expected* behavior. The design that worked was implicitly relying on traffic being unsynchronized — a property that's now broken. The principled fix is to migrate to a sliding window (per-user Sorted Set of timestamps + Lua) which evaluates the actual N-in-W invariant rather than approximating it with 'N per fixed bucket.' This is the 'works today, breaks when X happens' shape — the spec didn't change, but the input distribution did.",
      "Marketing should reschedule the push; rate limiters cannot adapt to coordinated traffic.",
      "Switch from INCR + EXPIRE to GET + SET so the count can be tuned dynamically.",
    ],
    correctIndex: 1,
    explanation:
      "Future-proofing pattern. Fixed-window's boundary-burst is a textbook weakness: 2N requests in 2W approximately when traffic is uniform, but the *worst case* of 2N in interval ~0 becomes the *expected* case when traffic is synchronized. Marketing-driven coordinated traffic flips the input distribution. The design's hidden assumption — 'traffic is roughly uniform across windows' — is what makes the implicit failure mode explicit. Sliding-window via Sorted Set + Lua is the principled fix because it directly evaluates the invariant ('how many requests in the last W?') rather than approximating it. Why other answers tempt: (a) misreads the problem as a capacity issue when it's a correctness issue; (c) deflects to operations; (d) is mechanism-level confusion. The deeper insight: rate-limiting designs have *implicit* assumptions about input distribution; when the distribution changes, the design fails even though the spec didn't.",
    interviewScript:
      "In your interview, say: 'Fixed-window has a worst case where you can fire 2N within ~0 seconds across a window boundary. Under uniform traffic that's rare — under synchronized traffic from a marketing push, it's the *expected* behavior. The design implicitly assumed unsynchronized traffic. I'd migrate to a sliding window — Sorted Set of timestamps plus Lua — which evaluates the actual N-in-W invariant rather than approximating with fixed buckets.'",
    proTip:
      "Every rate-limiter has an *implicit* assumption about input distribution. When that assumption breaks, the design fails silently in correctness, not in capacity.",
  },

  // ====================================================================
  // PART G — Proximity Search (Geospatial)
  // ====================================================================
  {
    id: "redis_G_q29",
    part: "G — Proximity Search",
    subtopic: "Geo Commands",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["G1"],
    l5Pattern: null,
    question:
      "You're building 'find restaurants within 1km of my current location.' The dataset is small enough to fit in Redis, and reads must be sub-millisecond. Which native primitives line up with this?",
    options: [
      "ZADD a sorted set with latitude as score; query with ZRANGEBYSCORE to filter by latitude band, then filter again in the application.",
      "GEOADD `restaurants <lon> <lat> <name>` to index each location; `GEOSEARCH restaurants FROMLONLAT <lon> <lat> BYRADIUS 1 km` to query points within the radius. Both commands are native Redis — no application-side geometry math required.",
      "Use Pub/Sub channels per geographic grid square; subscribers receive updates from their own square.",
      "Use Redis Streams to log every position update and run a separate geo-indexer.",
    ],
    correctIndex: 1,
    explanation:
      "Redis natively supports geospatial indexes. GEOADD inserts a (longitude, latitude, member); GEOSEARCH ... BYRADIUS does the proximity query directly. The article gives the exact shape: `GEOADD key longitude latitude member` and `GEOSEARCH key FROMLONLAT longitude latitude BYRADIUS radius unit`.",
    interviewScript:
      "In your interview, say: 'Redis has native geo: GEOADD inserts a point, GEOSEARCH BYRADIUS does the proximity query. No external library, no application-side geometry math.'",
    proTip: null,
  },
  {
    id: "redis_G_q30",
    part: "G — Proximity Search",
    subtopic: "Complexity Analysis",
    difficulty: "L2",
    style: "Multi-Hop Reasoning",
    conceptIds: ["G2"],
    l5Pattern: null,
    question:
      "GEOSEARCH BYRADIUS runs in O(N + log M). An interviewer says: 'What do those two letters mean — and why is it not just O(log N) like a balanced tree?' Which sketch is the most accurate?",
    options: [
      "N is the number of total nodes in the cluster; M is the number of items per node. The complexity grows linearly with cluster size.",
      "M is the total number of items inside the geohash bounding box that *contains* the query — log M is the cost of locating that box in the geo index. N is the number of items inside the *exact circular radius* — those candidates are then filtered linearly to verify they're actually within the radius. The complexity is 'log to find the box, plus linear over the candidates within the box's vicinity.'",
      "N is the radius in km; M is the unit of measure. The complexity reflects the choice of unit.",
      "Both N and M refer to the same set of items; the 'plus log' is a constant overhead Redis adds for every command.",
    ],
    correctIndex: 1,
    explanation:
      "From the article: 'O(N+log(M)) time where N is the number of elements in the radius and M is the number of items inside the shape.' Geohash-based indexes locate the candidate bounding box in log time over the population. Then the query has to *verify* each candidate against the actual radius — a linear pass over the candidates. The two letters reflect those two phases.",
    interviewScript:
      "In your interview, say: 'Two phases. log M to locate the geohash bounding box that covers my query — M is items in that box. Then a linear pass over the candidates inside the box to filter to the items actually within my circular radius — N is the answer count. So it's log M to find the candidate region, plus N to verify each one geometrically.'",
    proTip: null,
  },
  {
    id: "redis_G_q31",
    part: "G — Proximity Search",
    subtopic: "Two-Pass Geometry",
    difficulty: "L3",
    style: "Scenario-Based",
    conceptIds: ["G3", "G4"],
    l5Pattern: null,
    question:
      "An interviewer asks: 'Why does GEOSEARCH need *two* passes? Couldn't a well-designed geo index just return exactly the points inside the radius in one pass?' What's the strongest answer?",
    options: [
      "It's a Redis implementation quirk — other geo databases don't need the second pass.",
      "Geohash indexes (the underlying structure) partition space into *grid-aligned, square* bounding boxes. A user query is a *circle*. Squares cannot exactly cover a circle, so the index can give you a fast 'candidate set' from the relevant boxes (cheap and possibly over-inclusive), but verifying which candidates actually lie inside the circular radius requires geometry — a second, linear pass. Every geo system that supports radius queries over a grid index has some flavor of this 'candidates + filter' pattern.",
      "The first pass returns approximate distances; the second pass refines them to exact distances using floating-point math.",
      "The two passes exist because Redis runs one on the primary and one on a replica; this is a quirk of cluster mode.",
    ],
    correctIndex: 1,
    explanation:
      "The article explains it directly: geohashes index data into grid-aligned, square bounding boxes. A circular radius query intersects those boxes imprecisely — boxes that are partially inside the radius hold both points-inside and points-outside. The first pass gives candidates (cheap, log-N); the second pass filters to actual radius members (linear-in-candidates). This is universal — every geo system using a grid-style index has the same shape.",
    interviewScript:
      "In your interview, say: 'Geohashes index space into square bounding boxes. A radius query is a circle. The boxes can give me a fast candidate set from the relevant grid cells, but to know which candidates are *actually* inside the circle I have to check distance per candidate — that's the second pass. Every geo index that does radius queries over a grid has some flavor of candidates-plus-filter.'",
    proTip: null,
  },
  {
    id: "redis_G_q32",
    part: "G — Proximity Search",
    subtopic: "Universal Geo Pattern",
    difficulty: "L4",
    style: "Cross-Subtopic Bridge",
    conceptIds: ["G4", "G5"],
    l5Pattern: null,
    question:
      "Your interviewer asks: 'When does the *candidates + filter* shape stop being a Redis implementation detail and start being a system-design framing you'd reach for in interviews?' Which is the strongest answer?",
    options: [
      "Never — it's specific to Redis' geohash implementation.",
      "Whenever you have a fast index that's *coarse* over the answer space (covers the answer but with false positives), and a separate *exact* check that's expensive enough that you don't want to run it on the entire dataset. Geo with geohashes is the canonical example: square boxes are the coarse index, the radius distance check is the exact filter. The same shape shows up in vector search (ANN candidate set + exact distance reranking), in fraud detection (fast bloom-filter screen + exact verification), and in many search systems. Recognize the *abstract* pattern, not just the geo special case.",
      "Only when working with two-dimensional data — the pattern is geometry-specific.",
      "Only in databases that support both spatial indexes and lambda functions for filtering.",
    ],
    correctIndex: 1,
    explanation:
      "The article hints at the universality: 'geohashes allow us to grab candidates in grid-aligned bounding boxes. But these boxes are square and imprecise. A second pass takes the candidates and filters them to only include items that are within the exact radius.' The same 'fast coarse index → exact filter' shape recurs in ANN-then-exact-distance vector search, fast bloom-filter screens before exact lookups, and elsewhere. Recognizing the abstract pattern — coarse-then-exact — generalizes interview answers across very different problem spaces.",
    interviewScript:
      "In your interview, say: 'Candidates-plus-filter is a system-design framing, not a Redis quirk. Whenever I have a fast coarse index that *covers* the answer with false positives, and an exact-but-expensive check, I want to use the index to gate the work and the check to verify correctness. Geo is one example. Vector search with ANN-then-exact-rerank is another. Fast bloom screens before exact lookups is a third. The pattern is what generalizes.'",
    proTip:
      "Recognizing 'coarse index + exact filter' as a recurring pattern is more valuable than memorizing any one implementation of it.",
  },

  // ====================================================================
  // PART H — Streams & Event Sourcing
  // ====================================================================
  {
    id: "redis_H_q33",
    part: "H — Streams & Event Sourcing",
    subtopic: "Streams as Append-Only Log",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["H1", "H2", "A15"],
    l5Pattern: null,
    question:
      "You need a Redis-native primitive that lets producers *durably append* events to a log and lets multiple consumers read them, with the log preserved across consumer restarts. Which Redis structure most directly matches this?",
    options: [
      "Pub/Sub channels — they broadcast messages to all subscribers in real time.",
      "Redis Lists used as queues with LPUSH/RPOP.",
      "Redis Streams: producers append entries with `XADD mystream * <field> <value> ...`, the stream durably retains the entries, and consumers read via `XREAD` or via a consumer group with `XREADGROUP`. Streams are Redis' native analog of Kafka topics.",
      "Sorted Sets with the timestamp as the score; consumers query by timestamp range.",
    ],
    correctIndex: 2,
    explanation:
      "Redis Streams are append-only logs analogous to Kafka topics. XADD appends; the stream durably retains entries; XREAD/XREADGROUP consumes. Pub/Sub does NOT retain — offline subscribers miss messages. Lists are FIFO queues but don't provide consumer groups or per-message processing state. Sorted Sets aren't durably append-only in the streaming sense.",
    interviewScript:
      "In your interview, say: 'Streams are the right primitive — append-only, durable in the stream, with native consumer-group semantics. XADD to append, XREADGROUP to consume. They're Redis' Kafka-shaped option.'",
    proTip: null,
  },
  {
    id: "redis_H_q34",
    part: "H — Streams & Event Sourcing",
    subtopic: "Consumer Groups",
    difficulty: "L2",
    style: "Scenario-Based",
    conceptIds: ["H2", "H3"],
    l5Pattern: null,
    question:
      "A work queue has 8 worker processes. The team wants each job to be processed by *exactly one* of the workers, with the stream tracking which jobs have been processed and which haven't. Which mechanism in Redis Streams provides this?",
    options: [
      "Each worker reads via XREAD with a different starting offset; they coordinate offsets in the application.",
      "All workers join a single consumer group via `XREADGROUP`; the stream distributes each entry to exactly one member of the group and tracks per-message processing state — including which entries have been delivered to a consumer but not yet acknowledged.",
      "Workers subscribe to a shared Pub/Sub channel; the first one to claim a message wins.",
      "Workers each call XADD to write themselves into the stream; the consumer with the lowest ID processes the next entry.",
    ],
    correctIndex: 1,
    explanation:
      "Consumer groups are the abstraction. All 8 workers attach to one consumer group; XREADGROUP delivers each entry to exactly one consumer in the group and tracks delivered-but-not-acknowledged state. This is the work-queue primitive — exactly what the article describes for a worker pool.",
    interviewScript:
      "In your interview, say: 'All 8 workers attach to a single consumer group with XREADGROUP. Each entry goes to exactly one worker; the stream tracks which entries are pending acknowledgement per consumer. That's the work-queue shape.'",
    proTip: null,
  },
  {
    id: "redis_H_q35",
    part: "H — Streams & Event Sourcing",
    subtopic: "Worker Failure Recovery",
    difficulty: "L3",
    style: "Failure Analysis",
    conceptIds: ["H3", "H4"],
    l5Pattern: null,
    question:
      "Worker-3 takes a job from the consumer group, starts processing, then crashes before acknowledging. Without intervention, that job sits as 'delivered to worker-3, never acknowledged.' Which Redis Streams operation lets a different worker pick it up and reprocess it?",
    options: [
      "XREAD — any worker can re-read the stream from offset 0.",
      "XCLAIM — another worker explicitly *claims* the pending message, transferring ownership from the failed worker. Combined with the consumer-group's pending-entries list (which says how long each pending entry has been outstanding), this gives you a recovery loop: 'find pending entries older than threshold T → XCLAIM them to a healthy worker → reprocess.' This is how Streams give you at-least-once delivery in the face of worker failure.",
      "DEL the consumer group and recreate it — re-delivery to the new group restarts processing.",
      "Pub/Sub: re-publish the message and any subscriber can pick it up.",
    ],
    correctIndex: 1,
    explanation:
      "From the article: 'in the case a worker fails, [the consumer group] provides a way for a new worker to claim (XCLAIM) and restart processing that message.' XCLAIM, paired with the pending-entries list (which exposes age of un-acknowledged messages), is the recovery primitive. Together they give Redis Streams its at-least-once semantics.",
    interviewScript:
      "In your interview, say: 'XCLAIM — a healthy worker claims the pending message from the failed worker. Paired with the pending-entries list, I get a recovery loop: find pending entries older than my threshold, XCLAIM them, reprocess. That's how Streams give me at-least-once in the face of worker failure.'",
    proTip: null,
  },
  {
    id: "redis_H_q36",
    part: "H — Streams & Event Sourcing",
    subtopic: "Streams vs Pub/Sub",
    difficulty: "L4",
    style: "Anti-Pattern Identification",
    conceptIds: ["H5"],
    l5Pattern: null,
    question:
      "A teammate's first sketch uses Redis Pub/Sub for a payment-processing pipeline: 'publish the payment event, our worker subscribes, processes it.' What specifically goes wrong, and why are Streams the right primitive instead?",
    options: [
      "Pub/Sub is fine — payment processing is a real-time concern and Pub/Sub fits real-time events.",
      "Pub/Sub is at-most-once and ephemeral — if no subscriber is connected at publish time, or if the subscriber crashes mid-processing, the event is gone, no replay possible. For payment events that must be processed, that's catastrophic. Streams give you a durable append-only log, consumer-group exactly-one-of-pool semantics, and XCLAIM-based recovery on worker failure — at-least-once delivery, which is the right semantic for payments. Pub/Sub is for ephemeral broadcast (chat, notifications); Streams are for durable work that must survive subscriber outages.",
      "Pub/Sub is fine for payments but only if you also add a relational database write before publishing.",
      "Pub/Sub is faster than Streams, and for payments speed is more important than durability.",
    ],
    correctIndex: 1,
    explanation:
      "The article is direct: Pub/Sub is at-most-once, no persistence, offline subscribers miss messages forever. For payment events that must be processed at-least-once, Pub/Sub is the wrong primitive. Streams are durable in the log, consumer groups give exactly-one-of-pool, and XCLAIM gives failure recovery — together those are at-least-once semantics. The split: Pub/Sub for ephemeral broadcast, Streams for durable work.",
    interviewScript:
      "In your interview, say: 'Pub/Sub is at-most-once and ephemeral — if no subscriber is connected at publish, the event is gone; if the subscriber crashes mid-processing, also gone. For payments, that's not acceptable. Streams give me a durable log, consumer-group exactly-one-of-pool delivery, and XCLAIM for crash recovery — at-least-once, which is the right semantic for payments.'",
    proTip: null,
  },
  {
    id: "redis_H_q37",
    part: "H — Streams & Event Sourcing",
    subtopic: "Wrong-Framing (Cross-Part)",
    difficulty: "L5",
    style: "Cross-Part Bridge",
    conceptIds: ["H5", "I1", "I4"],
    l5Pattern: "framing-is-wrong",
    question:
      "Your team is designing real-time chat for currently-connected users. A junior says: 'We need durability, so let's use Redis Streams — that gives us at-least-once delivery and replay.' Why might this be 'technically correct, but the wrong framing,' and what is the senior+ move?",
    options: [
      "It's correct — Streams should be the default for any real-time messaging system.",
      "Durability and at-least-once are real properties of Streams, but they're not what *real-time chat to currently-connected users* is asking for. The product requirement is 'broadcast to all subscribers connected right now.' Streams' durability means every message is persisted and replayed for catching-up consumers — for an active chat session, you don't want that, you want fan-out to live subscribers. Pub/Sub matches: at-most-once, fan-out, ephemeral. The senior+ move is to reject the 'durability is always good' reflex, restate what the product actually needs (real-time fan-out vs durable replay), and then pick. Most chat systems pair Pub/Sub for the live path with a separate persistence write for history — Streams are the right answer for a different question (offline delivery, replayable work queues).",
      "Streams use too much memory; Pub/Sub is just cheaper.",
      "Streams aren't allowed in cluster mode, so the design wouldn't deploy.",
    ],
    correctIndex: 1,
    explanation:
      "Framing-is-wrong. Streams' durability is genuinely a property — but the product is asking for *real-time broadcast to currently-connected subscribers*, not durable replay. Pub/Sub matches the actual ask: ephemeral fan-out, at-most-once, with the connection model that makes 'live subscribers only' efficient. Most real chat systems pair Pub/Sub for the live path with an independent persistence write to a database for history. Why other answers tempt: 'durability is always good' is an automatic reflex; the junior's logic is internally consistent but solving the wrong problem. The deeper insight: when the requirement is 'real-time + live audience,' adding durability solves a different problem and adds cost without serving the original need. Step *out* of the framing and re-decide the primitive based on what's actually being asked.",
    interviewScript:
      "In your interview, say: 'Streams are durable and at-least-once — those are real properties. But the product is asking for real-time fan-out to currently-connected users, which is what Pub/Sub matches. If I add Streams, I'm solving a different problem — durable replay for catching-up consumers — and paying for it without serving the live path. Most real chat systems use Pub/Sub for the live broadcast and persist to a database independently for history. Streams are the right answer for offline delivery and durable work queues — not for the active chat session.'",
    proTip:
      "When someone reaches for durability as a default, ask: 'durable for *whom*?' If the consumer is always live, durability is solving a question nobody asked.",
  },

  // ====================================================================
  // PART I — Pub/Sub
  // ====================================================================
  {
    id: "redis_I_q38",
    part: "I — Pub/Sub",
    subtopic: "Broadcast Semantics",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["I1", "I2"],
    l5Pattern: null,
    question:
      "Your real-time notification service needs to push 'new comment on your thread' to all currently-viewing users instantly, with no requirement that offline users receive the alert later. Which Redis primitive is the most natural fit?",
    options: [
      "Sorted Set with timestamp scores; viewers poll for new entries.",
      "Pub/Sub: producer SPUBLISHes to a per-thread channel; every currently-connected subscriber to that channel receives the message in real time. Offline subscribers miss the message — which is exactly what the requirement allows.",
      "Streams with consumer groups, so each viewer gets exactly one delivery.",
      "Hash keyed by thread, with a list of recent comments inside; viewers refresh on a timer.",
    ],
    correctIndex: 1,
    explanation:
      "Pub/Sub is broadcast to currently-connected subscribers, in real time. The 'no requirement for offline users to catch up' makes Pub/Sub's at-most-once delivery acceptable — and the connection model (one connection per cluster node, not per channel) makes it scalable for many channels.",
    interviewScript:
      "In your interview, say: 'Pub/Sub. SPUBLISH to a per-thread channel, every currently-connected subscriber receives the message in real time. Offline users miss it, but the requirement explicitly allows that — which makes Pub/Sub's at-most-once and ephemeral nature a perfect match.'",
    proTip: null,
  },
  {
    id: "redis_I_q39",
    part: "I — Pub/Sub",
    subtopic: "Sharded Pub/Sub & Delivery Semantics",
    difficulty: "L2",
    style: "Gotcha/Trap",
    conceptIds: ["I3", "I4"],
    l5Pattern: null,
    question:
      "A senior engineer says: 'Don't use Redis Pub/Sub at scale — it can't shard, and any subscriber outage drops messages.' Which part of this is *outdated*, and which part is still true?",
    options: [
      "Both are still true — Redis Pub/Sub is unsharded and lossy regardless of version.",
      "Both are outdated — modern Redis Pub/Sub is sharded *and* persisted.",
      "The 'can't shard' part is outdated: modern Redis Pub/Sub is sharded — that's exactly what the `S` in `SPUBLISH` and `SSUBSCRIBE` means. Many older critiques were aimed at the pre-sharded model. The 'any subscriber outage drops messages' part is still true: Pub/Sub is at-most-once and does NOT persist messages — offline subscribers miss them forever. So the right framing is: scale concerns about per-channel routing are largely solved; durability concerns are not. If you need durability, use Streams or pair Pub/Sub with a queue or outbox.",
      "The 'can't shard' part is still true; the 'subscriber outage drops messages' part is outdated.",
    ],
    correctIndex: 2,
    explanation:
      "The article calls this out: 'Redis pub/sub is now sharded which enables scalability which was not possible in previous versions.' The S prefix in SPUBLISH/SSUBSCRIBE is sharded Pub/Sub. The at-most-once delivery semantic, however, has not changed: offline subscribers still miss messages. So the senior engineer's two-part claim is half outdated, half still correct.",
    interviewScript:
      "In your interview, say: 'The scale critique is outdated — modern Redis Pub/Sub is sharded; that's what the S in SPUBLISH means. The at-most-once critique is still real — offline subscribers miss messages forever. So scale isn't the limit anymore; durability is. If I need durability, Streams or a queue/outbox pattern.'",
    proTip:
      "Whenever a teammate cites a Pub/Sub scalability limitation, sanity-check whether they're thinking of pre-sharded versions. The connection model and routing have changed materially.",
  },
  {
    id: "redis_I_q40",
    part: "I — Pub/Sub",
    subtopic: "When to Outgrow Pub/Sub",
    difficulty: "L3",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["I4", "I6", "I7"],
    l5Pattern: null,
    question:
      "Your notification service starts with Pub/Sub. Product asks: 'Users who were offline should receive the notifications when they come back online (within the last 24 hours).' What's the right architectural change, and *what stays the same*?",
    options: [
      "Replace Pub/Sub entirely with Streams; Pub/Sub is now obsolete for this use case.",
      "Pub/Sub still serves the live path well — it's efficient for broadcast to currently-connected users, channels evaporate when inactive, no per-channel connection cost. The new requirement (catch-up for offline users) needs durable storage, which Pub/Sub doesn't provide. Standard pattern: keep Pub/Sub for the live broadcast, AND add a durable layer — either Redis Streams as a per-user inbox stream, or pair Pub/Sub with a queue (e.g., SNS→SQS, Kafka), or use an outbox where messages are written to a database and replayed on reconnect. Live and durable serve two different needs.",
      "Add Streams alongside Pub/Sub; users get duplicates because both deliver.",
      "Increase Pub/Sub message retention by setting a TTL on the channel.",
    ],
    correctIndex: 1,
    explanation:
      "The article advises this exact framing: 'Need offline delivery or durable fan-out? Redis Streams are a good option or you can pair Pub/Sub with a queue (e.g., SNS→SQS, Kafka) or outbox pattern.' The key insight is that real-time fan-out and durable catch-up are *different requirements* — Pub/Sub remains efficient for the live path, and you layer the durable mechanism alongside it.",
    interviewScript:
      "In your interview, say: 'Pub/Sub stays for the live path — it's efficient for currently-connected users, channels are zero-cost when nobody is subscribed. For the catch-up requirement I'd add a durable layer — either a per-user Streams inbox, a queue like SQS, or an outbox in the database that replays on reconnect. Live broadcast and durable catch-up are different requirements; layer them.'",
    proTip: null,
  },
  {
    id: "redis_I_q41",
    part: "I — Pub/Sub",
    subtopic: "Misconception: 'One Connection per Channel'",
    difficulty: "L4",
    style: "Interviewer Pushback",
    conceptIds: ["I5", "I8", "I9", "I11", "I12"],
    l5Pattern: null,
    question:
      "Your interviewer says: 'I've heard people propose rolling their own Pub/Sub by storing channel→server mappings in Redis and having publishers look up + send. Why does that almost always end up worse than native Pub/Sub?' What's the strongest answer?",
    options: [
      "It's actually better — the homegrown design avoids Redis' single-threaded bottleneck.",
      "The homegrown design is usually motivated by a *misconception* that Pub/Sub uses one connection per channel — which it doesn't (one connection per cluster node, regardless of channel count). Then it adds three real costs: (1) an extra network hop — three hops instead of two; (2) the third hop usually requires *new* TCP connections to each subscriber server (native Pub/Sub keeps connections established), and TCP setup is the most expensive part of the path; (3) resident-memory cost grows because the homegrown map holds *every* channel's metadata, and stale-server cleanup typically requires heartbeat chatter — native Pub/Sub stores nothing for inactive channels. Native Pub/Sub solves the imagined problem you don't actually have, with none of the costs you'd take on by rolling your own.",
      "The homegrown design is fine — it's what most production systems do.",
      "Native Pub/Sub doesn't allow custom routing, so the homegrown design is the only option for fine-grained control.",
    ],
    correctIndex: 1,
    explanation:
      "The article walks through this exact comparison. Homegrown Pub/Sub is three hops vs. two; the third hop requires new TCP connections per delivery; resident-memory cost grows with the channel→server map; cleanup needs heartbeats which add chatter. The motivation for the homegrown design is usually a misunderstanding of Pub/Sub's connection model — clients keep one connection *per node*, not per channel.",
    interviewScript:
      "In your interview, say: 'The motivation is usually a misconception — that Pub/Sub uses one connection per channel. It doesn't; it uses one connection per cluster node. Once you accept that, the homegrown design has three real costs: an extra network hop, a fresh TCP setup on the third hop where native keeps connections established, and resident-memory plus heartbeat overhead because the homegrown map holds every channel and has to detect dead servers. Native Pub/Sub stores nothing for inactive channels and skips all of that.'",
    proTip:
      "When someone proposes rolling their own Pub/Sub for scalability, the first move is to ask what their per-connection model actually looks like. Most homegrown proposals fix a problem that doesn't exist.",
  },
  {
    id: "redis_I_q42",
    part: "I — Pub/Sub",
    subtopic: "Estimation: Native vs Homegrown",
    difficulty: "L5",
    style: "Estimation-Backed Reasoning",
    conceptIds: ["I8", "I9", "I10"],
    l5Pattern: "estimation-backed-scenario",
    question:
      "You have 10M active channels, 1M publishes/sec, average 100 subscribers per channel. Compare native Redis Pub/Sub vs the rolled-your-own design (Redis lookup → publisher opens TCP to each subscriber server). Which cost dominates at this scale, and what's the *order-of-magnitude* answer the interviewer is listening for?",
    options: [
      "Both are equivalent — at 1M publishes/sec, network and CPU costs scale linearly in either design.",
      "Resident memory dominates: native Pub/Sub holds metadata for all 10M channels, the homegrown design holds none.",
      "TCP setup cost on the third hop dominates the homegrown design. Native Pub/Sub: 2 hops, persistent TCP connections to each cluster node — call it ~1ms per publish, ~100M subscriber-deliveries/sec ride pre-established connections at near-zero per-delivery setup cost. Homegrown: 3 hops, with the third hop requiring fresh TCP setup per (publisher, subscriber-server) pair every publish — TCP setup is roughly 1 RTT plus syscall cost, ~1-10ms; at 1M publishes/sec × ~100 subscriber servers per publish = ~100M TCP handshakes/sec system-wide, which is 1-2 orders of magnitude beyond what's realistically sustainable. Native is sustainable; homegrown isn't even close. The TCP cost is what the article is alluding to when it says 'the last hop is the most expensive.'",
      "Heartbeat chatter dominates because the homegrown design has to track 10M channel-to-server mappings.",
    ],
    correctIndex: 2,
    explanation:
      "Estimation-backed scenario. At 1M publishes/sec × 100 subscribers/channel, you're already at 100M subscriber-side deliveries per second. Native Pub/Sub holds those over pre-established TCP connections to each cluster node — the per-delivery cost is small. Homegrown forces a fresh TCP handshake per (publisher, subscriber-server) hop on every publish — at ~1-10ms per handshake, the system needs to sustain ~100M TCP setups/sec, which is impractical by 1-2 orders of magnitude on commodity hardware. The article's prose ('the last hop is the most expensive because it's likely that we don't already have a TCP connection') becomes a quantitative blocker once you put real numbers behind it. Why other answers tempt: heartbeat chatter and resident memory are real costs but they're 1-2 orders of magnitude cheaper than the TCP-setup blocker. The deeper insight: the article's prose is correct; the senior+ move is to translate it into a number that reveals which cost is the binding one.",
    interviewScript:
      "In your interview, say: 'At 1M publishes/sec × 100 subscribers, I'm at 100M deliveries/sec. Native Pub/Sub rides pre-established TCP per cluster node — per-delivery setup cost is essentially zero. The homegrown design needs a fresh TCP handshake per publish per subscriber server — call it 1-10ms per handshake, so I'd need to sustain 100M handshakes/sec, which is 1-2 orders of magnitude beyond commodity hardware. Memory and heartbeat are real costs but they're rounding errors next to that. The article's claim that the last hop is the most expensive — when I put numbers on it, that's the binding constraint that kills the homegrown design.'",
    proTip:
      "The fastest way to convert prose-level reasoning ('the last hop is the most expensive') into senior+ signal is a back-of-envelope number that quantifies it.",
  },

  // ====================================================================
  // PART J — Hot Key Issues
  // ====================================================================
  {
    id: "redis_J_q43",
    part: "J — Hot Key Issues",
    subtopic: "Recognizing Hot Keys",
    difficulty: "L1",
    style: "Scenario-Based",
    conceptIds: ["J1", "J2"],
    l5Pattern: null,
    question:
      "Your ecommerce service caches product details in a 100-node Redis cluster. Items are evenly spread across nodes. One day, item #4221 trends — that one item now drives ~40% of all cache reads. Which symptom would you expect to dominate your dashboards first?",
    options: [
      "Cluster-wide CPU rises uniformly across all 100 nodes by ~40%.",
      "One node's CPU and request-rate are far higher than the rest, while the other 99 nodes look healthy. Cluster-average dashboards may look fine; per-node graphs reveal the asymmetry.",
      "Memory pressure across the cluster causes evictions of unrelated keys.",
      "Every node sees its own copy of item #4221 fail simultaneously.",
    ],
    correctIndex: 1,
    explanation:
      "A hot key concentrates load on the single node responsible for its hash slot. The cluster-average view smooths this out and hides the problem — per-node CPU and request-rate are where it shows. This is exactly the asymmetry the article describes ('Now the load on one server is dramatically higher than the rest').",
    interviewScript:
      "In your interview, say: 'I'd see one node hot — far higher CPU and request-rate than the rest — while the cluster average looks fine. Hot keys hide in the average. Per-node dashboards expose them.'",
    proTip: null,
  },
  {
    id: "redis_J_q44",
    part: "J — Hot Key Issues",
    subtopic: "Three Mitigations",
    difficulty: "L2",
    style: "Scenario-Based Trade-offs",
    conceptIds: ["J2", "J3", "J4", "J5", "J6"],
    l5Pattern: null,
    question:
      "Your team brainstorms three remediations for the hot-key problem on item #4221. Which framing best summarizes what each remediation actually does and what it costs?",
    options: [
      "All three remediations are equivalent; pick whichever is simplest to deploy.",
      "(1) Client-side cache: each client keeps its own copy of the hot value, reducing the request rate against Redis. Cost: stale data window equal to the client TTL. (2) Replicate the hot key under N synthetic keys (e.g. `item:4221:1`, `:2`, … `:N`) and have clients pick one at random — this spreads the read load across N slots/nodes. Cost: N× write fan-out and N× memory for the replication. (3) Read replicas of the hot node, dynamically scaled with load — adds capacity proportional to demand. Cost: replica lag, replica management, and replicas don't help with write hotness. Each remediation is right for a different shape of hotness; the senior move is to characterize the workload before picking.",
      "Only the third remediation works; the first two violate Redis cluster semantics.",
      "All three apply only to writes — none of them help with read-heavy hot keys.",
    ],
    correctIndex: 1,
    explanation:
      "The article lists exactly these three: 'add an in-memory cache in our clients,' 'store the same data in multiple keys and randomize the requests,' and 'add read replica instances and dynamically scale these with load.' Each maps to a different lever — request rate at the client, key-fan-out across slots, capacity-via-replicas — and each has a corresponding cost.",
    interviewScript:
      "In your interview, say: 'Three remediations, each with a different cost. Client-side cache lowers request rate, costs me a staleness window. Replicating the hot key under N synthetic keys spreads load across slots, costs me N× write fan-out and memory. Read replicas of the hot node add capacity, cost me replica lag and only help reads. The senior move is to characterize the hotness shape — read-only? writes too? burst or steady? — before picking.'",
    proTip: null,
  },
  {
    id: "redis_J_q45",
    part: "J — Hot Key Issues",
    subtopic: "Recognize-and-Remediate Signal",
    difficulty: "L3",
    style: "Interviewer Pushback",
    conceptIds: ["J7"],
    l5Pattern: null,
    question:
      "An interviewer asks how you'd handle hot keys in your Redis design. Candidate A: 'I'd notice the hot key.' Candidate B: 'I'd notice the hot key and add a client-side cache.' Why does the article describe this as the difference between SDE2 and senior signal, and what's an even better answer?",
    options: [
      "There's no difference — both candidates are correct.",
      "A only recognizes the problem (+); B recognizes AND remediates (++). The article calls this out directly: 'the important thing is that you recognize potential hot key issues (+) and that you proactively design remediations (++).' An even better answer characterizes the workload first ('reads only? writes too? bursty?'), proposes the matched remediation, and acknowledges the trade-off — that's the senior+ pattern: name the problem, pick the right tool, own the cost.",
      "B is worse than A because client-side cache adds complexity.",
      "Both are equivalent; the only thing interviewers actually grade is whether the candidate names Redis correctly.",
    ],
    correctIndex: 1,
    explanation:
      "The article frames it explicitly: '(+) recognize potential hot key issues, (++) proactively design remediations.' Candidate A earns +; Candidate B earns ++. Senior+ goes one step further by *characterizing the hotness shape* before picking the remediation, which signals you understand the trade-off space and aren't just reciting a recipe.",
    interviewScript:
      "In your interview, say: 'The article frames it as recognize-plus, remediate-plus-plus. The senior+ version is to first characterize the hotness — reads only or writes too, burst or steady — then pick the matched remediation and own its cost. Naming the problem is one tier; matching the remediation to the workload is the next.'",
    proTip:
      "Senior signal is a *layered* answer: name the problem, characterize it, pick the matched tool, own the trade-off. Skipping any layer flattens your signal.",
  },
  {
    id: "redis_J_q46",
    part: "J — Hot Key Issues",
    subtopic: "Adversarial: 'Just Use Consistent Hashing' (Cross-Part)",
    difficulty: "L4",
    style: "Cross-Part Bridge",
    conceptIds: ["J1", "B6", "B8"],
    l5Pattern: null,
    question:
      "An interviewer pushes back: 'Couldn't you just use consistent hashing to spread the hot key across nodes? Doesn't that solve hot-key concentration?' What's the strongest senior response?",
    options: [
      "Yes — consistent hashing automatically spreads any individual key's traffic across multiple nodes proportional to its load.",
      "Consistent hashing changes how *the keyspace* is distributed across nodes (and how it rebalances when nodes join/leave) — but each individual key still hashes to exactly one slot on one node. So 100% of traffic for item #4221 still routes to one node regardless of consistent hashing. The hot-key problem is per-key, not per-keyspace; the actual fixes — client-side cache, key replication with random fan-out, read replicas — work *on top of* whatever sharding scheme the cluster uses. Consistent hashing solves the cluster-membership problem, not the hot-key problem.",
      "Consistent hashing replicates each key to log(N) nodes, which spreads the load across log(N) destinations.",
      "Consistent hashing is incompatible with Redis cluster mode, so the question is moot.",
    ],
    correctIndex: 1,
    explanation:
      "Cross-part bridge. Consistent hashing addresses keyspace distribution and rebalancing under node changes — it does NOT distribute *one key's traffic* across nodes. A single key still hashes to one slot. Hot-key remediations are layered on top of (any) sharding scheme. This connects Part B (single-node-per-request) and Part J (hot-key concentration) — both arise from the same architectural fact: each key lives on exactly one node. Consistent hashing changes which node, not how many.",
    interviewScript:
      "In your interview, say: 'Consistent hashing changes how the keyspace partitions across nodes, and how it rebalances when nodes join or leave — but every individual key still hashes to one slot on one node. 100% of item #4221's traffic still hits one node, regardless of consistent hashing. The hot-key fixes — client-side cache, key replication with random fan-out, read replicas — work on top of *any* sharding scheme. Consistent hashing solves a different problem.'",
    proTip:
      "When someone proposes consistent hashing as a hot-key fix, they're usually conflating 'distributing the keyspace' with 'distributing one key's load.' Be quick to separate them.",
  },
  {
    id: "redis_J_q47",
    part: "J — Hot Key Issues",
    subtopic: "Mitigation Asymmetries",
    difficulty: "L5",
    style: "Implementation-Specific Nuance",
    conceptIds: ["J4", "J5", "J6"],
    l5Pattern: "implementation-specific-gotcha",
    question:
      "Your hot key is a real-time auction's current high-bid count: it's read 50× more than written, but writes are also frequent and *must* reflect the latest. A teammate says: 'Just apply all three mitigations — client-side cache, key replication, read replicas — and we're safe.' Why is this answer dangerous, and which mitigation actually fits?",
    options: [
      "Apply all three — the more layers of mitigation, the safer the system.",
      "Each mitigation has a different *correctness* profile that depends on whether the hotness is read or write and whether stale reads are tolerable: (1) Client-side cache breaks read-modify-write semantics — a client reading a stale bid count and writing back will overwrite a more-recent update; for an auction this corrupts the invariant. (2) Replicating the key under N synthetic keys creates an N-way write fan-out — every bid increment now requires N writes that must stay consistent, which adds either a distributed-write problem or a noticeable staleness window between replicas. (3) Read replicas help reads but lag behind the primary, and writes still all hit the primary — so they help the 50× read multiplier but not the write hotness, and a stale read can lose a bid. The right answer for an auction's *latest high bid* is usually: read replicas with a tight lag SLO for the read path, and accept that writes go to one node (vertical-scale that node, or change the data model so the bid increment doesn't require contention on one key — e.g., per-bidder offset combined later). Stacking all three mitigations naively breaks correctness.",
      "Read replicas alone are correct; the other two are antipatterns and should never be combined.",
      "The right answer is to use Pub/Sub instead of cache for high-bid count.",
    ],
    correctIndex: 1,
    explanation:
      "Implementation-specific-gotcha. The three mitigations are NOT interchangeable — each one breaks a different correctness property under different workloads. Client-side caches sacrifice freshness, which destroys read-modify-write invariants on a contended counter. Key replication with random fan-out creates a multi-write consistency problem you didn't have. Read replicas lag behind the primary, so a 'latest count' read can be stale. The right framing matches the mitigation to the hotness shape and the correctness requirement; for a strongly-consistent counter, you usually can't apply the read-spreading mitigations without changing the data model. Why a/c tempt: 'apply more mitigations' is reflex caution; 'one mitigation is universal' is reflex simplicity. The deeper insight: mitigations have *correctness profiles*, not just performance profiles — and the workload's correctness requirement is what determines which one is safe.",
    interviewScript:
      "In your interview, say: 'The three mitigations have different correctness profiles. Client-side cache breaks read-modify-write — a stale bid count read and a new write will silently overwrite a more-recent update. Replicating under N synthetic keys turns one write into N writes that must stay consistent — a distributed-write problem I didn't have before. Read replicas help reads but lag behind the primary, so a latest-count read can lose a bid. For an auction's high-bid counter, I'd lean on read replicas with a tight lag SLO and either vertical-scale the primary or change the data model so the increment doesn't contend on one key — e.g., per-bidder offsets combined at read time. Stacking all three naively breaks the invariant the auction depends on.'",
    proTip:
      "Match the mitigation to the *correctness* requirement, not just the load shape. For strongly-consistent counters, most read-spreading tricks are silent footguns.",
  },
];

// ====================================================================
// Engine — backward-compatible Ladder mode for the L1-L5 schema.
// Other 19 quizzes in this project are unaffected (they have their own
// inlined engines and lack the `difficulty` field).
// ====================================================================

const TIER_TIMERS = { L1: 60, L2: 90, L3: 90, L4: 120, L5: 150 };
const TIER_COLORS = {
  L1: { chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", text: "text-emerald-400" },
  L2: { chip: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", text: "text-cyan-400" },
  L3: { chip: "bg-blue-500/15 text-blue-300 border-blue-500/30", text: "text-blue-400" },
  L4: { chip: "bg-amber-500/15 text-amber-300 border-amber-500/30", text: "text-amber-400" },
  L5: { chip: "bg-red-500/15 text-red-300 border-red-500/30", text: "text-red-400" },
};
const TIER_LABEL = {
  L1: "L1 · Recognition",
  L2: "L2 · Understanding",
  L3: "L3 · SDE2-core",
  L4: "L4 · Senior Pushback",
  L5: "L5 · Staff / Extreme",
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ladderSort(qs) {
  // Group by part letter (alphabetical), then by difficulty L1→L5.
  const tierIdx = { L1: 0, L2: 1, L3: 2, L4: 3, L5: 4 };
  return [...qs].sort((a, b) => {
    if (a.part !== b.part) return a.part.localeCompare(b.part);
    return (tierIdx[a.difficulty] ?? 9) - (tierIdx[b.difficulty] ?? 9);
  });
}

const PARTS_ORDER = [
  "A — Foundation, Performance & Commands",
  "B — Cluster & Sharding",
  "C — Caching",
  "D — Distributed Locks",
  "E — Leaderboards (Sorted Sets)",
  "F — Rate Limiting",
  "G — Proximity Search",
  "H — Streams & Event Sourcing",
  "I — Pub/Sub",
  "J — Hot Key Issues",
];

export default function RedisQuiz({ quizSlug = "key-tech-redis" }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("ladder"); // ladder is default for L1-L5 quizzes
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [timer, setTimer] = useState(TIER_TIMERS.L3);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showingSkipped, setShowingSkipped] = useState(false);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz } = useQuizProgress(quizSlug, QUESTIONS.length);
  const elapsedRef = useRef(null);

  const tierFor = (q) => q?.difficulty ?? "L3";
  const tierTimerFor = (q) => TIER_TIMERS[tierFor(q)] ?? 90;

  const startQuiz = useCallback(
    (selectedMode) => {
      const m = selectedMode || mode;
      let qs;
      if (m === "shuffled") qs = shuffleArray(QUESTIONS);
      else if (m === "ladder") qs = ladderSort(QUESTIONS);
      else qs = [...QUESTIONS];
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setAnswers({});
      setSkipped([]);
      setFlagged(new Set());
      setTimer(tierTimerFor(qs[0]));
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
    setTimer(tierTimerFor(qs[0]));
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
            setAnswers((prev) => ({
              ...prev,
              [questions[currentIndex]?.id]: {
                selected: selectedOption,
                confidence: confidence || "timeout",
                correct: selectedOption === questions[currentIndex]?.correctIndex,
                timedOut: true,
              },
            }));
            const q = questions[currentIndex];
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
      [q.id]: { selected: selectedOption, confidence, correct: isCorrect, timedOut: false },
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
      setTimer(tierTimerFor(nextQ));
      setTimerActive(true);
    } else if (skipped.length > 0 && !showingSkipped) {
      const skippedQs = skipped.map((id) => QUESTIONS.find((q) => q.id === id));
      const ordered = ladderSort(skippedQs);
      setQuestions(ordered);
      setCurrentIndex(0);
      setSkipped([]);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimer(tierTimerFor(ordered[0]));
      setTimerActive(true);
      setShowingSkipped(true);
    } else {
      clearInterval(elapsedRef.current);
      const correctCount = Object.values(answers).filter((a) => a.correct).length;
      completeQuiz({ correct: correctCount, total: Object.keys(answers).length }, totalElapsed);
      setScreen("results");
    }
  }, [currentIndex, questions, skipped, showingSkipped, answers, completeQuiz, totalElapsed]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIndex];
    if (!q) return;
    setSkipped((prev) => [...prev, q.id]);
    handleNext();
  }, [questions, currentIndex, handleNext]);

  const handleFlag = useCallback(() => {
    const q = questions[currentIndex];
    if (!q) return;
    setFlagged((prev) => {
      const n = new Set(prev);
      if (n.has(q.id)) n.delete(q.id);
      else n.add(q.id);
      return n;
    });
  }, [questions, currentIndex]);

  // ----- Landing screen -----
  if (screen === "landing") {
    return (
      <div className="min-h-screen bg-[#1c2331] text-slate-300 p-6 font-sans">
        <div className="max-w-3xl mx-auto">
          <a href="#/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> All quizzes
          </a>
          <div className="bg-[#232a3b] border border-[#2d3748] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-7 h-7 text-teal-400" />
              <h1 className="text-3xl font-bold text-slate-100">Redis — Deep-Dive Quiz</h1>
            </div>
            <p className="text-slate-400 mb-6">
              47 questions · 10 Parts · L1–L5 ladder. Tests <em>concept</em> understanding, not source-text recall.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => { setMode("ladder"); startQuiz("ladder"); }}
                className="text-left bg-[#1c2331] hover:bg-[#1a2030] border border-teal-500/40 rounded-xl p-4 transition"
              >
                <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
                  <List className="w-4 h-4" /> Ladder (default)
                </div>
                <div className="text-xs text-slate-400">Part A → J, each ramping L1 → L5. Builds before stretching.</div>
              </button>
              <button
                onClick={() => { setMode("shuffled"); startQuiz("shuffled"); }}
                className="text-left bg-[#1c2331] hover:bg-[#1a2030] border border-[#2d3748] rounded-xl p-4 transition"
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
                  <Shuffle className="w-4 h-4" /> Shuffled
                </div>
                <div className="text-xs text-slate-400">Interleaves Parts and tiers. Hard-mode active recall.</div>
              </button>
              <button
                onClick={() => { setMode("sequential"); startQuiz("sequential"); }}
                className="text-left bg-[#1c2331] hover:bg-[#1a2030] border border-[#2d3748] rounded-xl p-4 transition"
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
                  <BookOpen className="w-4 h-4" /> Sequential
                </div>
                <div className="text-xs text-slate-400">File order — useful right after reading the article.</div>
              </button>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              Per-tier timers: L1 60s · L2 90s · L3 90s · L4 120s · L5 150s. Results break down accuracy by tier so you can drill the level you missed.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- Quiz screen -----
  if (screen === "quiz" && questions.length > 0) {
    const q = questions[currentIndex];
    const tier = tierFor(q);
    const tierColor = TIER_COLORS[tier] || TIER_COLORS.L3;
    const isFlagged = flagged.has(q.id);
    const total = questions.length;
    const progressPct = Math.round(((currentIndex + 1) / total) * 100);

    return (
      <div className="min-h-screen bg-[#1c2331] text-slate-300 p-4 sm:p-6 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3 text-sm">
            <a href="#/" className="inline-flex items-center gap-1 text-slate-500 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Exit
            </a>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className={timer < 15 ? "text-red-400 font-semibold" : ""}>{timer}s</span>
              </span>
              <span className="text-slate-500">{currentIndex + 1} / {total}</span>
            </div>
          </div>

          <div className="w-full bg-[#1c2331] rounded-full h-1.5 mb-4 overflow-hidden">
            <div className="h-full bg-teal-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="bg-[#232a3b] border border-[#2d3748] rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold ${tierColor.chip}`}>
                {TIER_LABEL[tier]}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/40 text-slate-300 border border-slate-600/40">
                {q.part}
              </span>
              {q.style && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/30 text-slate-400 border border-slate-700/50">
                  {q.style}
                </span>
              )}
              {q.l5Pattern && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/30">
                  L5: {q.l5Pattern}
                </span>
              )}
              <button
                onClick={handleFlag}
                className={`ml-auto p-1.5 rounded-md transition ${isFlagged ? "text-amber-400 bg-amber-500/10" : "text-slate-500 hover:text-amber-300"}`}
                title="Flag for later"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg text-slate-100 leading-relaxed mb-4">{q.question}</h2>

            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === q.correctIndex;
                let cls = "bg-[#1c2331] border-[#2d3748] hover:border-slate-500 text-slate-300";
                if (submitted) {
                  if (isCorrect) cls = "bg-emerald-500/10 border-emerald-500/40 text-emerald-200";
                  else if (isSelected) cls = "bg-red-500/10 border-red-500/40 text-red-200";
                  else cls = "bg-[#1c2331] border-[#2d3748] text-slate-500";
                } else if (isSelected) {
                  cls = "bg-teal-500/10 border-teal-500/50 text-teal-100";
                }
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setSelectedOption(i)}
                    disabled={submitted}
                    className={`w-full text-left rounded-lg border p-3 transition text-sm ${cls}`}
                  >
                    <span className="text-slate-500 font-mono mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!submitted && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-slate-500">Confidence:</span>
                  {["guess", "unsure", "confident"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setConfidence(c)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition ${confidence === c ? "bg-teal-500/15 border-teal-500/40 text-teal-200" : "bg-[#1c2331] border-[#2d3748] text-slate-400 hover:text-slate-200"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null || !confidence}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    Submit <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-3 py-2.5 rounded-lg border border-[#2d3748] text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1"
                    title="Skip — revisit later"
                  >
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </>
            )}

            {submitted && (
              <div className="mt-3 space-y-3">
                <div className={`p-3 rounded-lg border ${selectedOption === q.correctIndex ? "bg-emerald-500/5 border-emerald-500/30" : "bg-red-500/5 border-red-500/30"}`}>
                  <div className={`flex items-center gap-2 font-semibold mb-2 ${selectedOption === q.correctIndex ? "text-emerald-300" : "text-red-300"}`}>
                    {selectedOption === q.correctIndex ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {selectedOption === q.correctIndex ? "Correct" : "Not quite"}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
                {q.interviewScript && (
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1 text-sm">
                      <MessageSquare className="w-4 h-4" /> Interview script
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{q.interviewScript}</p>
                  </div>
                )}
                {q.proTip && (
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1 text-sm">
                      <Lightbulb className="w-4 h-4" /> Pro tip
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{q.proTip}</p>
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? "Next question" : (skipped.length > 0 && !showingSkipped ? "Revisit skipped" : "See results")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----- Results screen -----
  if (screen === "results") {
    const total = Object.keys(answers).length || QUESTIONS.length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;

    // Accuracy by tier
    const byTier = { L1: { c: 0, t: 0 }, L2: { c: 0, t: 0 }, L3: { c: 0, t: 0 }, L4: { c: 0, t: 0 }, L5: { c: 0, t: 0 } };
    QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      if (!a) return;
      const tier = q.difficulty || "L3";
      byTier[tier].t += 1;
      if (a.correct) byTier[tier].c += 1;
    });

    // Worst tier — drill suggestion
    const tiers = Object.entries(byTier).filter(([, v]) => v.t > 0);
    const worst = tiers
      .map(([k, v]) => ({ tier: k, acc: v.c / v.t }))
      .sort((a, b) => a.acc - b.acc)[0];

    const wrongQuestions = QUESTIONS.filter((q) => answers[q.id] && !answers[q.id].correct);
    const wrongAtTier = (tier) => QUESTIONS.filter((q) => q.difficulty === tier && answers[q.id] && !answers[q.id].correct);

    return (
      <div className="min-h-screen bg-[#1c2331] text-slate-300 p-4 sm:p-6 font-sans">
        <div className="max-w-3xl mx-auto">
          <a href="#/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> All quizzes
          </a>
          <div className="bg-[#232a3b] border border-[#2d3748] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-7 h-7 text-teal-400" />
              <h1 className="text-2xl font-bold text-slate-100">Results</h1>
            </div>
            <p className="text-4xl font-bold text-slate-100 mb-1">
              {correctCount}<span className="text-slate-500">/{total}</span>
              <span className="ml-2 text-2xl text-slate-400">({pct}%)</span>
            </p>
            <p className="text-slate-500 text-sm mb-5">Total time: {Math.floor(totalElapsed / 60)}m {totalElapsed % 60}s</p>

            <div className="mb-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
                <BarChart3 className="w-5 h-5" /> Accuracy by tier
              </div>
              <div className="space-y-1.5">
                {Object.entries(byTier).map(([t, v]) => {
                  if (v.t === 0) return null;
                  const tierAcc = Math.round((v.c / v.t) * 100);
                  const c = TIER_COLORS[t];
                  return (
                    <div key={t} className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${c.text} w-24`}>{TIER_LABEL[t]}</span>
                      <div className="flex-1 bg-[#1c2331] rounded h-2 overflow-hidden">
                        <div className={`h-full ${tierAcc >= 75 ? "bg-emerald-500" : tierAcc >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${tierAcc}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-16 text-right">{v.c}/{v.t}</span>
                    </div>
                  );
                })}
              </div>
              {worst && worst.acc < 0.75 && (
                <p className="text-xs text-amber-400 mt-3">
                  Drill suggestion: re-attempt {TIER_LABEL[worst.tier]} ({Math.round(worst.acc * 100)}% accuracy).
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => startQuiz(mode)}
                className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              {wrongQuestions.length > 0 && (
                <button
                  onClick={() => startRetry(wrongQuestions)}
                  className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" /> Retake missed ({wrongQuestions.length})
                </button>
              )}
              {worst && wrongAtTier(worst.tier).length > 0 && (
                <button
                  onClick={() => startRetry(wrongAtTier(worst.tier))}
                  className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> Drill {worst.tier}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
