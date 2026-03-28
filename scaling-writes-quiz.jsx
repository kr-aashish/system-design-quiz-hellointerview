// === COVERAGE MANIFEST ===
// Subtopic: Vertical Scaling & Hardware — Questions: 2 — IDs: [q1, q2]
// Subtopic: Database Choices for Write Optimization — Questions: 3 — IDs: [q3, q4, q5]
//   └─ Nested: Cassandra append-only architecture — covered by: [q3]
//   └─ Nested: Time-series / Column stores — covered by: [q4]
//   └─ Nested: Write vs Read tension — covered by: [q5]
// Subtopic: Database Tuning — Questions: 2 — IDs: [q6, q7]
//   └─ Nested: WAL batching / index overhead — covered by: [q6]
//   └─ Nested: Disabling features gotcha — covered by: [q7]
// Subtopic: Horizontal Sharding — Questions: 2 — IDs: [q8, q9]
//   └─ Nested: Redis Cluster slot model — covered by: [q8]
//   └─ Nested: Consistent hashing — covered by: [q9]
// Subtopic: Partitioning Key Selection — Questions: 3 — IDs: [q10, q11, q12]
//   └─ Nested: Variance minimization — covered by: [q10]
//   └─ Nested: Read-path impact — covered by: [q11]
//   └─ Nested: Bad key anti-pattern — covered by: [q12]
// Subtopic: Vertical Partitioning — Questions: 2 — IDs: [q13, q14]
// Subtopic: Write Queues & Burst Handling — Questions: 3 — IDs: [q15, q16, q17]
//   └─ Nested: Burst absorption — covered by: [q15]
//   └─ Nested: Unbounded queue growth anti-pattern — covered by: [q16]
//   └─ Nested: Async write confirmation — covered by: [q17]
// Subtopic: Load Shedding — Questions: 2 — IDs: [q18, q19]
// Subtopic: Batching — Questions: 3 — IDs: [q20, q21, q22]
//   └─ Nested: Application-layer batching — covered by: [q20]
//   └─ Nested: Intermediate processor (Like Batcher) — covered by: [q21]
//   └─ Nested: Batching efficacy gotcha — covered by: [q22]
// Subtopic: Hierarchical Aggregation — Questions: 3 — IDs: [q23, q24, q25]
//   └─ Nested: Fan-in/fan-out problem — covered by: [q23]
//   └─ Nested: Broadcast nodes — covered by: [q24]
//   └─ Nested: Multi-stage reduction — covered by: [q25]
// Subtopic: Resharding — Questions: 2 — IDs: [q26, q27]
// Subtopic: Hot Key Handling — Questions: 3 — IDs: [q28, q29, q30]
//   └─ Nested: Fixed k-split — covered by: [q28]
//   └─ Nested: Dynamic hot key detection — covered by: [q29]
//   └─ Nested: Reader/writer agreement — covered by: [q30]
// Subtopic: When to Use / When NOT to Use — Questions: 2 — IDs: [q31, q32]
// Cross-subtopic: Vertical Scaling × Sharding — Questions: 1 — IDs: [q2]
// Cross-subtopic: Queues × Load Shedding — Questions: 1 — IDs: [q19]
// Cross-subtopic: Batching × Hierarchical Aggregation — Questions: 1 — IDs: [q25]
// Cross-subtopic: Partitioning Key × Hot Key Handling — Questions: 1 — IDs: [q12]
// Anti-pattern questions: 4 — IDs: [q12, q16, q22, q31]
// Gotcha/trap questions: 3 — IDs: [q7, q17, q30]
// Total: 32 questions across 13 subtopics
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, ChevronRight, Flag, SkipForward, RotateCcw, CheckCircle, XCircle, AlertTriangle, Award, BarChart3, Brain, Zap, ArrowRight, Home, ChevronDown, ChevronUp } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "Vertical Scaling & Hardware",
    style: "Estimation-backed reasoning",
    question: "Your write-heavy service currently runs on a 4-core instance with spinning disks, handling 800 writes/sec. Before proposing sharding, your interviewer asks you to justify why vertical scaling won't work. Your target is 15,000 writes/sec. Given that modern cloud instances offer 200+ CPU cores, NVMe SSDs with 500K+ IOPS, and 10Gbps NICs — what's the strongest argument for why vertical scaling alone is insufficient here?",
    options: [
      "NVMe SSDs max out at ~5,000 writes/sec regardless of CPU count, so the disk is still the bottleneck",
      "While hardware can likely reach 15K writes/sec, the single-node failure domain makes it unacceptable for production — but this is a reliability argument, not a throughput argument",
      "A single database process can only utilize ~16 cores effectively due to lock contention, so 200 cores won't help linearly",
      "Vertical scaling can likely handle 15K writes/sec on modern hardware, so you should demonstrate this with back-of-envelope math before proposing horizontal scaling"
    ],
    correctIndex: 3,
    explanation: "The content emphasizes that candidates should exhaust vertical scaling first and use back-of-envelope math to prove they're hitting hardware limits. Systems with 200 CPU cores and 10Gbps NICs are common — 15K writes/sec is well within reach of a single beefy machine. Jumping to sharding without proving vertical scaling can't work is a red flag. The strongest move is to show the math, demonstrate you've considered modern hardware, then let the interviewer move the goalposts if they want horizontal scaling.",
    interviewScript: "In your interview, say: 'Before adding complexity with sharding, let me check if we can solve this vertically. Modern instances offer 200+ cores and NVMe storage — 15K writes/sec is achievable on a single node. Let me do quick math to verify... [show calculation]. If the interviewer pushes for higher scale, that's when I'd introduce horizontal strategies.'",
    proTip: "Staff+ candidates intuitively know where hardware limits are. Showing this awareness before jumping to distributed solutions signals maturity."
  },
  {
    id: "q2",
    subtopic: "Vertical Scaling & Hardware",
    style: "Cross-subtopic bridge",
    question: "You're designing a metrics collection system expecting 50,000 writes/sec. You've confirmed through back-of-envelope math that a single high-end instance (200 cores, NVMe) tops out at ~30,000 writes/sec for your workload. Your interviewer asks: 'So you need horizontal scaling — but how many shards?' A candidate answers '2 shards since 2 × 30K > 50K.' What's the critical flaw in this reasoning?",
    options: [
      "Two shards provide exactly 60K capacity, leaving zero headroom for traffic bursts — you need at least 3 shards to handle peak loads without queuing",
      "The candidate forgot that sharding introduces coordination overhead (consistent hashing lookups, cross-shard queries), so effective per-shard throughput drops below the single-node maximum",
      "With only 2 shards, the partitioning key is likely to create significant skew since there aren't enough shards to statistically smooth out variance",
      "The calculation assumes linear scaling, but each shard operates independently so 2 shards do actually provide ~60K throughput — the real issue is the candidate didn't validate the partitioning key distribution"
    ],
    correctIndex: 0,
    explanation: "While coordination overhead (option B) is real, the most critical flaw is capacity planning without burst headroom. The content explicitly states that real-world traffic isn't steady and that interviewers love to ask about 4x peak scenarios. Running at 83% capacity (50K/60K) means any burst — which the content says is common — will overwhelm the system. You'd need at least 3 shards to have meaningful headroom. Option B is partially true but secondary to the burst handling problem.",
    interviewScript: "In your interview, say: 'Two shards gives us 60K capacity for a 50K steady-state load, but that's 83% utilization with no burst headroom. Real traffic spikes — if we see even a 1.5x burst, we're underwater. I'd provision at least 3 shards to maintain 60% utilization at steady state, giving us room for 1.5-2x bursts without needing emergency scaling.'",
    proTip: "Capacity planning should always account for peak-to-average ratios. A common rule of thumb is to target 60-70% utilization at steady state."
  },
  {
    id: "q3",
    subtopic: "Database Choices for Write Optimization",
    style: "Scenario-based trade-offs",
    question: "You're building an event ingestion pipeline that receives 40,000 events/sec from IoT sensors. Events are timestamped, append-only, and primarily queried by time ranges. Reads happen once per minute for dashboards. A candidate proposes PostgreSQL with write-optimized settings (disabled triggers, batched WAL flushes). Why would Cassandra or a time-series DB be more appropriate here?",
    options: [
      "PostgreSQL's MVCC creates dead tuples during high-volume inserts, requiring frequent VACUUM operations that compete with write throughput",
      "Cassandra's append-only commit log avoids expensive disk seeks that PostgreSQL's B-tree index updates require, achieving 10x+ write throughput on the same hardware",
      "PostgreSQL can't handle 40K writes/sec even with tuning, while Cassandra can handle millions of writes/sec on a single node",
      "Time-series databases support native downsampling and retention policies, which are critical for IoT data — the write performance difference between PostgreSQL and Cassandra is negligible at this scale"
    ],
    correctIndex: 1,
    explanation: "The content specifically explains that Cassandra achieves superior write throughput through its append-only commit log architecture — instead of updating data in place (requiring expensive disk seeks for B-tree updates), everything is written sequentially. The content quantifies this: 10,000+ writes/sec on modest hardware vs ~1,000 for a traditional RDBMS doing the same work. Option A is true but secondary. Option C exaggerates — Cassandra doesn't do millions on a single node. Option D is wrong because the performance difference IS significant at this scale.",
    interviewScript: "In your interview, say: 'For 40K append-only writes/sec, I'd choose Cassandra or a time-series DB over PostgreSQL because they use append-only write paths. PostgreSQL's B-tree indexes require random disk seeks on every insert, while Cassandra writes sequentially to a commit log — that's the difference between ~1K and 10K+ writes/sec per node on comparable hardware. Since our reads are infrequent dashboard queries, we can accept Cassandra's read trade-off.'",
    proTip: "In interviews, always explain WHY a database is faster — 'append-only vs B-tree updates' shows deeper understanding than just naming the database."
  },
  {
    id: "q4",
    subtopic: "Database Choices for Write Optimization",
    style: "Implementation-specific nuance",
    question: "You're designing a real-time analytics system that needs to handle 20,000 writes/sec of ad impression events and support complex aggregation queries (GROUP BY, COUNT, SUM across multiple dimensions). A candidate proposes Cassandra because 'it's the best for writes.' What's the most important counter-argument?",
    options: [
      "Cassandra requires you to design tables around query patterns, so complex ad-hoc aggregations would require maintaining multiple denormalized tables — increasing total write volume",
      "A column store like ClickHouse can batch writes efficiently AND execute complex aggregation queries orders of magnitude faster than Cassandra, because columnar compression reduces I/O for analytical scans",
      "Cassandra's eventual consistency model means aggregation results could be wrong during network partitions, which is unacceptable for ad billing",
      "At 20K writes/sec, even PostgreSQL with partitioned tables could handle this load, making Cassandra's complexity unjustified"
    ],
    correctIndex: 1,
    explanation: "The content mentions column stores like ClickHouse as databases that 'batch writes efficiently for analytics workloads.' The key insight is that database choice must consider BOTH read and write patterns. Cassandra excels at writes but struggles with the complex aggregation queries this system requires. ClickHouse handles both: efficient batch writes AND fast analytical queries through columnar storage and compression. Option A is partially true but misses the better alternative. Option C conflates consistency guarantees. Option D underestimates the scale.",
    interviewScript: "In your interview, say: 'While Cassandra has great write throughput, our system also needs complex aggregations across dimensions. A column store like ClickHouse gives us both — efficient batch writes AND fast analytical queries through columnar compression. Choosing Cassandra would optimize writes at the cost of making our primary read pattern — multi-dimensional aggregations — extremely expensive.'"
  },
  {
    id: "q5",
    subtopic: "Database Choices for Write Optimization",
    style: "Failure analysis",
    question: "A team migrated their social media engagement tracking from PostgreSQL to Cassandra to handle higher write throughput. Writes improved 8x. However, three weeks later, the product team reports that the 'trending posts' feature has become unreliable — sometimes showing stale data and missing recent viral posts. What's the most likely root cause?",
    options: [
      "Cassandra's eventual consistency means the trending algorithm is reading stale engagement counts from replicas that haven't received the latest writes",
      "Cassandra's read path requires checking multiple SSTables and merging results, so the trending query exceeds its timeout when scanning engagement data across all posts",
      "The team didn't create a dedicated table for the trending query pattern, so Cassandra is performing expensive full-table scans instead of targeted reads",
      "Cassandra's tombstone accumulation from counter updates is causing read performance degradation, and the team hasn't configured compaction properly"
    ],
    correctIndex: 1,
    explanation: "The content explicitly states that 'Cassandra's read performance isn't great. Reading data often requires checking multiple files and merging results, which can be slower than a well-indexed relational database.' A trending posts feature requires reading and ranking engagement metrics across many posts — exactly the kind of read pattern Cassandra struggles with. The reads are timing out or returning incomplete results. This is the core write-vs-read tension the content describes: 'Optimizing for write performance often degrades read performance.'",
    interviewScript: "In your interview, say: 'This is the classic write-read tension. Cassandra's append-only architecture gives great writes but reads require checking multiple SSTables and merging. A trending feature needs to scan engagement data across many posts — exactly where Cassandra struggles. The solution might be a hybrid: Cassandra for raw event ingestion, with a separate read-optimized store (like Redis sorted sets) for the trending view, populated by a background aggregation job.'"
  },
  {
    id: "q6",
    subtopic: "Database Tuning",
    style: "Scenario-based trade-offs",
    question: "You're running PostgreSQL for a high-write service and need to squeeze more write throughput from the existing instance before scaling horizontally. You propose three changes: (1) reduce the number of indexes from 8 to 3, (2) batch WAL flushes by increasing commit_delay, and (3) disable foreign key constraints. Your DBA pushes back. Which change carries the most dangerous hidden cost?",
    options: [
      "Reducing indexes — the query planner may choose sequential scans for previously-fast read queries, causing cascading latency increases across the entire application",
      "Batching WAL flushes — if the server crashes between flushes, you lose all transactions in the unflushed batch, violating durability guarantees",
      "Disabling foreign key constraints — orphaned records will silently accumulate, causing data corruption that may not be detected for weeks until downstream systems break",
      "All three carry roughly equal risk — the correct approach is to apply them together during a defined 'high-write window' and revert afterward"
    ],
    correctIndex: 1,
    explanation: "While all three changes have costs, batching WAL flushes directly compromises durability — the D in ACID. The content mentions 'databases like PostgreSQL can batch multiple transactions before flushing to disk' as a tuning option, but the hidden cost is that a server crash loses all unflushed transactions. This is fundamentally different from the other two: reducing indexes degrades read performance (recoverable), and disabling FK constraints is a data quality issue (detectable). Losing committed transactions is the most dangerous because users received confirmation of writes that were never persisted.",
    interviewScript: "In your interview, say: 'I'd be careful with WAL flush batching — it trades durability for throughput. If the server crashes between flushes, we lose committed transactions that clients think succeeded. Reducing indexes or disabling FK constraints are safer because their costs are recoverable or detectable. I'd only batch WAL flushes if we have an upstream queue that can replay lost writes.'",
    proTip: "The content frames these as 'things we can do to optimize any database for writes' — but always articulate the specific trade-off. Interviewers reward nuance."
  },
  {
    id: "q7",
    subtopic: "Database Tuning",
    style: "Gotcha/trap question",
    question: "During a system design interview, a candidate proposes disabling full-text search indexing on their PostgreSQL write table to improve write throughput, planning to 're-enable it during off-peak hours.' The interviewer nods approvingly. What subtle problem will this candidate hit in production that they haven't considered?",
    options: [
      "Re-enabling the full-text index requires a full table lock in PostgreSQL, which will block all writes during the index rebuild — potentially for hours on large tables",
      "The full-text index will be incomplete after re-enabling because it only indexes new rows — a full REINDEX is needed, which is equally expensive",
      "PostgreSQL's CONCURRENTLY index option can rebuild without locking, so the real problem is that any queries relying on the full-text index will fail or return incomplete results during the disabled window",
      "Toggling indexes on and off causes PostgreSQL's query planner statistics to become stale, leading to poor query plans for hours after re-enabling"
    ],
    correctIndex: 2,
    explanation: "The content mentions disabling 'full-text search indexing during high-write periods' as an optimization, but the gotcha is that this is a trade-off — the content emphasizes 'fewer indexes mean faster writes, though you'll pay for it on reads.' The most practical problem is that any search functionality depending on that index will return incomplete or zero results during the disabled window. While PostgreSQL does offer CONCURRENT index rebuilding (avoiding locks), the functional impact of missing search results during peak hours is the real issue candidates overlook.",
    interviewScript: "In your interview, say: 'I could disable non-critical indexes during peak writes, but I need to consider what functionality breaks. If we have a search feature depending on that full-text index, users get degraded results during our busiest period — exactly when it matters most. A better approach might be vertical partitioning: separate the searchable data into a dedicated search index like Elasticsearch, so I can optimize the write table without affecting search quality.'"
  },
  {
    id: "q8",
    subtopic: "Horizontal Sharding",
    style: "Implementation-specific nuance",
    question: "In Redis Cluster's sharding model, keys are hashed using CRC16 to produce a slot number (0-16383), and slots are assigned to nodes. A client wants to write a key. What is the correct sequence of operations, and what happens if the client sends the write to the wrong node?",
    options: [
      "Client hashes the key locally, looks up the slot-to-node mapping from its cached cluster topology, and sends the write directly. If the node doesn't own that slot, it proxies the request to the correct node transparently.",
      "Client sends the key to any node, that node hashes it and forwards to the correct node. The client never needs to know the topology.",
      "Client hashes the key locally, sends to the mapped node. If wrong (due to stale cache), the node returns a MOVED redirect with the correct node address, and the client retries and updates its cache.",
      "Client queries a centralized coordinator (like ZooKeeper) for every write to determine the correct node, then sends the write directly to that node."
    ],
    correctIndex: 2,
    explanation: "The content describes Redis Cluster's model: 'Clients query the Redis Cluster to keep track of servers in the cluster and the slot numbers they are responsible for. When a client wants to write a value, it hashes the key to determine the slot number, looks up the server responsible for that slot, and sends the write request to that server.' The key detail is that Redis Cluster uses MOVED redirects (not proxying) when a client's cached topology is stale — the client must retry. This is different from a proxy model (option A) or a centralized coordinator (option D).",
    interviewScript: "In your interview, say: 'Redis Cluster uses client-side routing — the client hashes the key with CRC16 to get a slot number, checks its cached slot-to-node mapping, and sends directly. If the mapping is stale after a resharding, the node returns a MOVED redirect and the client updates its cache. This avoids a centralized coordinator bottleneck while keeping routing lightweight.'"
  },
  {
    id: "q9",
    subtopic: "Horizontal Sharding",
    style: "Interviewer pushback",
    question: "You've proposed sharding your write-heavy database using consistent hashing. Your interviewer says: 'Consistent hashing has a well-known problem with load imbalance when nodes join or leave. How do you address this?' What's the strongest response?",
    options: [
      "We use virtual nodes — each physical node is assigned multiple positions on the hash ring, so when a node joins or leaves, the load redistribution is spread across many nodes instead of just the neighbors",
      "We monitor shard load and manually rebalance by moving slot ranges between nodes when imbalance exceeds a threshold",
      "We add a replication factor of 3, so each key is stored on three consecutive nodes on the ring — this naturally smooths out load imbalances",
      "We use a fixed hash function with a predetermined number of slots (like Redis Cluster's 16384 slots) and assign slot ranges to nodes, avoiding the hash ring entirely"
    ],
    correctIndex: 0,
    explanation: "The content specifically mentions 'consistent hashing, virtual nodes, and slot assignment schemes' as important concepts to know. Virtual nodes solve the classic consistent hashing problem: without them, when a node leaves, its entire load transfers to just one neighbor. With virtual nodes, each physical node occupies many positions on the ring, so load is redistributed across many nodes. Option D describes Redis Cluster's approach (which is valid but avoids the question). Option C conflates replication with load balancing.",
    interviewScript: "In your interview, say: 'I'd use virtual nodes — each physical server gets, say, 150-200 positions on the hash ring. When a node joins or leaves, its virtual nodes are scattered across the ring, so the load change is distributed across all remaining nodes rather than concentrated on one neighbor. This gives us much more even distribution without manual intervention.'"
  },
  {
    id: "q10",
    subtopic: "Partitioning Key Selection",
    style: "Scenario-based trade-offs",
    question: "You're designing a social media platform and need to shard the posts table. You're considering three partitioning keys: (A) hash(user_id), (B) hash(post_id), (C) hash(created_date). Your primary write pattern is users creating posts. Your primary read pattern is loading a user's profile page (all their posts). Which key is best and why?",
    options: [
      "hash(post_id) — distributes writes most evenly since post IDs are unique, and profile reads can use scatter-gather across shards which parallelizes nicely",
      "hash(user_id) — distributes writes reasonably well and co-locates all posts by the same user, so profile page reads hit a single shard instead of scatter-gathering",
      "hash(created_date) — distributes writes evenly over time and supports time-range queries for feeds efficiently",
      "hash(post_id) — because user_id would create hot shards for users who post frequently, while post_id guarantees uniform distribution"
    ],
    correctIndex: 1,
    explanation: "The content emphasizes: 'Keep in mind that we need to also consider how the data might be read. If you spread all of your writes across shards, but each request needs to collect data from every single shard, you'll have a lot of overhead.' hash(user_id) strikes the best balance — writes are distributed well (most users post at similar rates) AND profile reads hit a single shard. hash(post_id) would distribute writes perfectly but force every profile page load to scatter-gather across ALL shards. hash(created_date) creates temporal hot spots.",
    interviewScript: "In your interview, say: 'I'd partition by hash(user_id). It distributes writes well since most users post at comparable frequencies, and critically, it co-locates a user's posts on one shard — so profile page reads hit a single shard. hash(post_id) gives better write distribution but every profile read becomes a scatter-gather across all shards, which is far more expensive given how frequent profile views are.'",
    proTip: "The content's key question to ask yourself: 'how many shards does this request need to hit?' and 'how often does this request happen?'"
  },
  {
    id: "q11",
    subtopic: "Partitioning Key Selection",
    style: "Multi-hop reasoning",
    question: "You've sharded a messaging system by hash(conversation_id). Each conversation's messages are co-located on one shard. A product manager asks you to add a feature: 'show all unread messages across all conversations for a user.' What's the fundamental scaling problem this creates, and what's the best mitigation?",
    options: [
      "The query must fan out to every shard since a user's conversations are spread across all shards — mitigate by maintaining a separate per-user unread count in a fast key-value store like Redis",
      "The query is fine because you can add a secondary index on user_id within each shard — the database handles the cross-shard routing automatically",
      "The query creates lock contention because it reads from multiple shards simultaneously — mitigate by batching the cross-shard reads with a 100ms delay between each",
      "The query is expensive but acceptable because 'show all unread messages' is an infrequent operation — optimize only if it becomes a bottleneck"
    ],
    correctIndex: 0,
    explanation: "This illustrates the content's warning about read path impact of sharding decisions. Sharding by conversation_id co-locates messages within a conversation (good for chat reads), but a user participates in many conversations spread across different shards. 'Show all unread' requires hitting every shard — the content says 'each reader needs to make lossy network calls to all the shards of the cluster.' The best mitigation is vertical partitioning: maintain a separate, user-sharded data structure (Redis) specifically for unread counts, updated asynchronously when messages arrive.",
    interviewScript: "In your interview, say: 'Sharding by conversation_id means a user's conversations span multiple shards, so all unread messages requires a fan-out to every shard — that's a cross-shard scatter-gather on every app open. I'd mitigate this with a separate read-optimized store: a Redis hash per user tracking unread counts per conversation, updated asynchronously when new messages are written. This gives O(1) unread lookups without touching the message shards.'"
  },
  {
    id: "q12",
    subtopic: "Partitioning Key Selection",
    style: "Anti-pattern identification",
    question: "A candidate designing a global e-commerce platform proposes sharding the orders table by hash(country_code). They argue: 'This keeps all orders from the same country together, which is great for generating country-specific sales reports — our most common query.' What's the most critical flaw the interviewer should identify?",
    options: [
      "Country codes have low cardinality (~200 values), so with 50 shards some shards would have zero data while others handle all traffic from large countries like the US or India",
      "Country-based sharding violates data residency regulations because orders might need to stay in specific geographic regions, not arbitrary database shards",
      "The hash function on country codes would produce the same hash for the same country, defeating the purpose of hashing — they should use range-based partitioning instead",
      "Country-specific reports are better served by a separate analytics database, so optimizing the primary shard key for this read pattern sacrifices write distribution for an uncommon query"
    ],
    correctIndex: 0,
    explanation: "The content uses almost this exact example: 'instead of hashing the userID we decided to use the user's country as the key. We might end up with a lot of writes going to highly populated China, and very few writes going to sparse New Zealand.' The principle is that 'we want to select a key that minimizes variance in the number of writes per shard.' Country codes have extreme variance in order volume — the US shard might get 1000x the writes of the Iceland shard. This creates massive hot spots that defeat the purpose of sharding.",
    interviewScript: "In your interview, say: 'Country code is a poor shard key because it has extreme cardinality skew — the US might generate 40% of all orders while Iceland generates 0.01%. We'd end up with a few overwhelmed shards and many idle ones. I'd shard by hash(order_id) or hash(user_id) for even distribution, and serve country-specific reports from a separate analytics store optimized for that access pattern.'"
  },
  {
    id: "q13",
    subtopic: "Vertical Partitioning",
    style: "Scenario-based trade-offs",
    question: "You have a monolithic posts table being hammered by three concurrent workloads: (1) users creating posts (write-once), (2) the system updating like/comment counts every second (high-frequency writes), (3) analytics scanning all posts for trend analysis (read-heavy scans). A candidate proposes vertically partitioning into post_content, post_metrics, and post_analytics tables. What's the primary advantage of this split?",
    options: [
      "Each table can use different storage engines optimized for its access pattern — B-tree for content reads, in-memory counters for metrics, columnar compression for analytics",
      "Vertical partitioning eliminates the need for horizontal sharding since each partition handles a fraction of the total writes",
      "The split reduces lock contention because PostgreSQL's row-level locks on the monolithic table were causing metrics updates to block content reads",
      "It simplifies the application code because each microservice can own its own table without coordinating transactions"
    ],
    correctIndex: 0,
    explanation: "The content explicitly states that once logically separated, 'each of these databases can be optimized for its specific access pattern': 'B-tree indexes optimized for read performance' for content, 'in-memory storage or specialized counters for high-frequency updates' for metrics, and 'time-series optimized storage or column-oriented compression' for analytics. This is the core insight — vertical partitioning lets you use the RIGHT tool for each job, not just reduce lock contention.",
    interviewScript: "In your interview, say: 'The key win from vertical partitioning isn't just splitting the load — it's that each partition can live on a storage engine optimized for its access pattern. Post content is write-once, read-many, perfect for B-tree indexes. Metrics need high-frequency counter updates, ideal for in-memory stores like Redis. Analytics data is append-only time-series, perfect for columnar compression. A monolithic table forces all three patterns into one engine that's mediocre at all of them.'"
  },
  {
    id: "q14",
    subtopic: "Vertical Partitioning",
    style: "Failure analysis",
    question: "After vertically partitioning your social media posts table into post_content (PostgreSQL) and post_metrics (Redis), you notice that the 'post detail' page sometimes shows a post with 0 likes and 0 comments for a few seconds after the post goes viral. Refreshing shows the correct counts. What's happening?",
    options: [
      "Redis is returning stale cached values because the cache TTL hasn't expired yet — the actual counts in Redis are correct but the application is reading from a stale cache layer in front of Redis",
      "The vertical partition introduced a consistency boundary — the post was just created in PostgreSQL but the corresponding metrics entry in Redis hasn't been initialized yet, so it returns defaults",
      "Redis is experiencing memory pressure from the viral post's rapid counter increments, causing temporary read failures that the application interprets as zero values",
      "The application's read path queries PostgreSQL first and Redis second — under high load, the Redis query times out and the application falls back to default values instead of retrying"
    ],
    correctIndex: 1,
    explanation: "Vertical partitioning splits data across different stores, creating consistency boundaries that didn't exist in the monolithic design. When a post is created, the content goes to PostgreSQL and the metrics entry should be created in Redis — but these aren't atomic. During the gap between the PostgreSQL write and the Redis initialization, reading the metrics returns zeros. This is the fundamental trade-off of vertical partitioning that the content hints at: splitting data means losing transactional guarantees across the split.",
    interviewScript: "In your interview, say: 'Vertical partitioning creates a consistency boundary between stores. When a post is created in PostgreSQL, the Redis metrics entry is initialized separately — there's a window where the post exists but metrics show zeros. I'd address this with eventual consistency: initialize Redis metrics before or simultaneously with the PostgreSQL write using a pattern like outbox, or have the read path treat missing Redis entries as loading rather than zero.'"
  },
  {
    id: "q15",
    subtopic: "Write Queues & Burst Handling",
    style: "Scenario-based trade-offs",
    question: "Your e-commerce order processing system handles a steady 5,000 orders/sec. On Black Friday, you expect 20,000 orders/sec for a 4-hour peak. Your database can handle 8,000 writes/sec. A candidate proposes: 'Add a Kafka queue between the app servers and database. Kafka absorbs the burst, and the database drains at its max rate.' What critical question should you ask about this proposal?",
    options: [
      "How will Kafka handle 20K writes/sec? Kafka itself becomes the bottleneck if not properly partitioned.",
      "At 8K drain rate and 20K intake during the 4-hour peak, you'll accumulate ~172 million undrained messages. Can Kafka store that, and how long will it take to drain the backlog after peak ends?",
      "How do you handle message ordering? Kafka partitions may deliver orders out of sequence, causing inventory conflicts.",
      "What's your exactly-once delivery guarantee? Without it, you'll process duplicate orders during consumer failures."
    ],
    correctIndex: 1,
    explanation: "The content warns that 'queues are only a temporary solution — if the app server continues to write to the queue faster than records can be written to the database, we get unbounded growth of our queue.' During the 4-hour peak: (20K - 8K) × 3600 × 4 = 172.8M messages accumulate. After peak ends, even at 8K/sec drain rate with 5K/sec new intake (leaving 3K/sec for backlog), that's 172.8M / 3K = ~16 hours to clear the backlog. Users won't see their orders confirmed for 16+ hours after Black Friday ends. This math is essential.",
    interviewScript: "In your interview, say: 'The queue absorbs the burst, but let me check the math. During the 4-hour peak, we accumulate (20K-8K) × 14,400 = ~173M messages. After peak, with 5K steady intake and 8K drain, we clear backlog at 3K/sec — that's 16+ hours to drain. Users who ordered at the end of the peak won't see confirmation for half a day. We need either more database capacity, or we need to question whether all 20K/sec need to hit the primary database.'",
    proTip: "The content explicitly says 'use queues when you expect to have bursts that are short-lived, not to patch a database that can't handle the steady-state load.' A 4-hour peak is not short-lived."
  },
  {
    id: "q16",
    subtopic: "Write Queues & Burst Handling",
    style: "Anti-pattern identification",
    question: "A candidate's architecture for a ride-sharing location tracking system: 'Drivers send location updates every 2 seconds. During rush hour, we get 500K updates/sec. Our location database handles 100K writes/sec. I'll put a Kafka queue in between — Kafka handles the burst, and the database processes steadily.' What's the most critical flaw?",
    options: [
      "Kafka's consumer lag will grow unboundedly during the entire rush hour (not just a brief spike), making location data increasingly stale — riders will see driver positions that are minutes old",
      "Kafka doesn't support geospatial operations, so location updates can't be efficiently routed to the correct database partition from the queue",
      "The 2-second update frequency is too high — the candidate should first reduce it to 10 seconds during rush hour before adding infrastructure",
      "Kafka partitions might deliver location updates out of order, so a driver's position could appear to jump backward in time"
    ],
    correctIndex: 0,
    explanation: "This is the anti-pattern the content explicitly warns about: using queues to 'patch a database that can't handle the steady-state load.' Rush hour isn't a brief spike — it's a sustained period where intake (500K/sec) vastly exceeds drain (100K/sec). The queue grows unboundedly for the entire rush hour duration. By the end, location updates in the queue are minutes old — completely useless for a ride-sharing app where freshness is everything. The content suggests load shedding as the better pattern here.",
    interviewScript: "In your interview, say: 'A queue doesn't solve this — rush hour is sustained load, not a brief burst. At 500K intake and 100K drain, the queue grows by 400K messages/sec. After 30 minutes, we have 720M stale location updates. For ride-sharing, stale locations are useless. Instead, I'd use load shedding: drop older location updates when the system is overloaded, since each driver will send a fresher update in 2 seconds anyway.'",
    proTip: "The content gives this exact example with Strava/Uber: 'If we drop one write, we should expect another write to be sent in a few seconds that will be fresher than the one we dropped.'"
  },
  {
    id: "q17",
    subtopic: "Write Queues & Burst Handling",
    style: "Gotcha/trap question",
    question: "You've added a Kafka queue between your web servers and database for order processing. A user submits an order and immediately navigates to 'My Orders.' The order doesn't appear. They refresh — still nothing. They submit again. Now they have a duplicate order. What fundamental issue did the architecture fail to address?",
    options: [
      "The Kafka consumer has a bug causing it to skip messages, so the first order was never processed",
      "The system lacks idempotency keys, so the duplicate submission creates a second order instead of being deduplicated",
      "The queue makes writes asynchronous, meaning the app server confirmed the order was queued but not committed to the database — the system needs a way for clients to check eventual write status",
      "Kafka's at-least-once delivery guarantee means the first order will eventually be processed twice, creating three total orders"
    ],
    correctIndex: 2,
    explanation: "The content states: 'Because queues are inherently async, it means the app server only knows that the write was recorded in the queue, not that it was successfully written to our database. In most cases, this means that clients will often need a way to call back to check the write was eventually made to the database.' The gotcha is that queueing changes the user-facing contract: the order confirmation now means 'we received your order' not 'your order is in the system.' Without a polling mechanism or push notification, users see a gap that causes duplicate submissions.",
    interviewScript: "In your interview, say: 'When we add a queue, writes become asynchronous — the user gets confirmation that we received their order, not that it's been processed. We need two things: first, a polling endpoint or websocket so the client can check order status. Second, idempotency keys so duplicate submissions from impatient users don't create duplicate orders. This is the fundamental trade-off of queue-based architectures.'",
    proTip: "This gotcha catches many candidates who add queues without thinking through the user experience implications of async writes."
  },
  {
    id: "q18",
    subtopic: "Load Shedding",
    style: "Scenario-based trade-offs",
    question: "You're designing an analytics platform that ingests both ad impressions (100K/sec) and ad clicks (5K/sec). During a traffic spike, your ingestion pipeline can only handle 80K events/sec total. You need to implement load shedding. Which events should you drop, and why?",
    options: [
      "Drop clicks first because they're 20x less frequent, so dropping them has minimal impact on total throughput while preserving the majority of impression data",
      "Drop impressions because they're less business-critical than clicks — clicks directly tie to revenue attribution, while individual impression data can be statistically reconstructed from the surviving sample",
      "Drop both proportionally (80% of each) to maintain the click-through rate ratio, which is critical for analytics accuracy",
      "Drop neither — instead, reduce the sampling rate of both to 76% (80K/105K), maintaining relative proportions across all event types"
    ],
    correctIndex: 1,
    explanation: "The content explicitly gives this exact scenario: 'For an analytics system, we might drop impressions for a while to ensure we can process the more important clicks.' Load shedding 'tries to make a determination of which writes are going to be most important to the business.' Clicks drive revenue attribution — each lost click is lost billing data. Impressions are high-volume and statistically reconstructable: if you capture 60% of impressions, you can extrapolate total impression counts with high confidence. Dropping clicks means losing money directly.",
    interviewScript: "In your interview, say: 'I'd shed impressions before clicks. Clicks directly map to revenue — each dropped click is potentially lost billing attribution. Impressions are high-volume and statistically redundant: if I capture 60% during the spike, I can extrapolate totals with high confidence. The business impact of losing some impression counts is minimal compared to losing click data that drives advertiser billing.'"
  },
  {
    id: "q19",
    subtopic: "Load Shedding",
    style: "Cross-subtopic bridge (Queues × Load Shedding)",
    question: "Your ride-sharing location service handles 200K location updates/sec at peak. Your database can sustain 150K writes/sec. A junior engineer proposes: 'We'll queue the overflow and drain it when traffic subsides.' A senior engineer proposes: 'We'll drop the oldest pending update for each driver when we're over capacity.' The system requires sub-5-second location freshness. Which is correct and why?",
    options: [
      "The junior engineer's queue is better because it preserves all data — the 50K/sec overflow during a 1-hour peak only accumulates 180M messages, which drains in 30 minutes after peak",
      "The senior engineer's load shedding is better because queued location updates become stale in seconds, violating the freshness requirement, while load shedding ensures every processed update is recent",
      "Neither is sufficient — you need to scale the database to 200K writes/sec, as both queuing and shedding compromise the core requirement of accurate real-time location tracking",
      "Use both: queue during small spikes (< 10% over capacity) and shed during large spikes (> 10% over capacity) for a graceful degradation strategy"
    ],
    correctIndex: 1,
    explanation: "This bridges the Queues and Load Shedding subtopics. The content explains that for location-update systems like Uber/Strava, queuing is counterproductive because 'users are going to keep calling back every few seconds to send us their location. If we drop one write, we should expect another write to be sent in a few seconds that will be fresher than the one we dropped.' With a 5-second freshness requirement, even 10 seconds of queue lag makes data useless. Load shedding the oldest update per driver guarantees every processed update is fresh.",
    interviewScript: "In your interview, say: 'Queuing location updates is an anti-pattern here. With 200K intake and 150K drain, the queue grows by 50K/sec. Within 10 seconds, queued updates are stale — violating our 5-second freshness requirement. Since drivers send updates every 2 seconds, dropped updates are naturally replaced by fresher ones. I'd use load shedding: when over capacity, drop the oldest pending update per driver, ensuring we always process the freshest data.'"
  },
  {
    id: "q20",
    subtopic: "Batching",
    style: "Failure analysis",
    question: "Your service reads events from Kafka, processes them, and writes results to PostgreSQL one row at a time. You refactor to batch 500 rows per INSERT. Write throughput improves 8x. But then the service crashes mid-batch, and after restart, you notice 200 events were processed (side effects executed) but never written to the database. What architectural property did the batch design violate?",
    options: [
      "Exactly-once processing — the Kafka consumer offset was committed before the database batch was flushed, so the 200 events are considered consumed but their results are lost",
      "The batch size of 500 is too large — smaller batches of 50 would reduce the blast radius of a crash to an acceptable level",
      "The application layer is acting as the source of truth during the batch window — if it crashes before committing, processed events with side effects are lost and can't be safely replayed from Kafka",
      "The batch INSERT should use a database transaction with a savepoint every 100 rows, so a crash only loses at most 100 rows instead of the full batch"
    ],
    correctIndex: 2,
    explanation: "The content explicitly addresses this: 'If the application is the source of truth for the data, we need to be able to handle the potential for data loss. The worst case would be that users send requests which are confirmed and placed in a batch only to have the service crash before the writes are sent to the database.' The key issue is that side effects were executed (irreversible), but the database write wasn't committed. If events were simple transforms from Kafka, you could replay. But with side effects already executed, replay would double-execute them.",
    interviewScript: "In your interview, say: 'The fundamental issue is that the application became the temporary source of truth during the batch window. If it crashes after executing side effects but before the database commit, those 200 events are in a liminal state — side effects fired but results lost. For idempotent transforms, I'd just replay from Kafka. But if side effects aren't idempotent, I need to either make them idempotent or commit to the database before executing side effects.'",
    proTip: "The content contrasts this with reading from Kafka: 'If the application crashes, we'll have to re-read the Kafka topic to recover but we haven't lost data.' This only works when the app isn't the source of truth."
  },
  {
    id: "q21",
    subtopic: "Batching",
    style: "Estimation-backed reasoning",
    question: "You're building a 'Like Batcher' that accumulates like events over a 1-minute window, then writes aggregated counts to the database. A popular post receives 100 likes/minute, reducing 100 individual writes to 1 batch write — a 100x improvement. But 95% of posts receive 0-1 likes per minute. What's the actual system-wide write reduction?",
    options: [
      "Approximately 100x — the popular posts dominate total write volume, so their 100x reduction drives the overall improvement",
      "Approximately 2x — most posts get 0-1 likes per minute, so the batcher provides almost no reduction for the vast majority of writes, and popular posts are a tiny fraction of total posts",
      "Nearly 0x (no improvement) — the overhead of maintaining the batching infrastructure (timers, in-memory state, flush logic) offsets the small gains from the few popular posts",
      "It depends entirely on the distribution: if 1% of posts generate 80% of likes (power law), the reduction is ~5x; if the distribution is more uniform, the reduction approaches 1x"
    ],
    correctIndex: 3,
    explanation: "The content warns: 'If the majority of posts are getting 1 like an hour, a batch frequency of 1 minute provides 0 benefit to the system! We need to ensure the batching itself is actually helpful.' The answer depends on the like distribution. With a power law (typical for social media), 1% of viral posts generate most likes — batching helps those significantly. But the 95% of posts getting 0-1 likes see zero benefit. The real-world improvement depends on what fraction of total write volume comes from high-frequency keys vs. the long tail.",
    interviewScript: "In your interview, say: 'Before implementing the batcher, I need to understand the like distribution. If 95% of posts get 0-1 likes per minute, batching provides zero benefit for those — we still make 1 write per like. The improvement comes only from the small percentage of popular posts. In a power-law distribution, that small percentage might represent 80% of total volume, giving us maybe 5x overall. But I should validate this with data before building the infrastructure.'",
    proTip: "Staff-level candidates are expected to question batching efficacy. Always estimate the actual improvement, not the theoretical maximum."
  },
  {
    id: "q22",
    subtopic: "Batching",
    style: "Anti-pattern identification",
    question: "A candidate proposes database-layer batching for their payment processing system: 'I'll configure PostgreSQL to flush writes to disk every 500ms instead of after every commit. This batches all transactions in that window and gives us 5x write throughput.' What's the critical problem with this approach for payment processing specifically?",
    options: [
      "500ms flush intervals would cause users to see a noticeable delay in their payment confirmation UX, degrading the checkout experience",
      "If the database server crashes within the 500ms window, all uncommitted payment transactions in that batch are lost — users were told their payment succeeded, but it wasn't persisted to disk",
      "PostgreSQL's WAL batching only works with synchronous_commit=off, which disables streaming replication, leaving the system with no failover capability during the batch window",
      "The 5x improvement assumes uniform write distribution across the 500ms window, but payment processing is bursty (checkout peaks), so actual improvement is closer to 2x"
    ],
    correctIndex: 1,
    explanation: "The content describes database-layer batching as 'the big hammer solution' that should be 'reserved for extreme cases.' For payments, the problem is catastrophic: a user completes checkout, receives a confirmation, but if the server crashes before the 500ms flush, their payment record vanishes. Unlike analytics or metrics where lost data is tolerable, lost payment records mean customers are charged (by the payment processor) but have no order record. This is exactly the kind of durability violation that is unacceptable for financial transactions.",
    interviewScript: "In your interview, say: 'Database-layer write batching is a dangerous choice for payments. If we flush every 500ms and the server crashes at 400ms, all payments in that window are lost — customers were charged but we have no record of their orders. For analytics or metrics, that trade-off might be acceptable. For payments, we need synchronous durability guarantees. I'd look for write improvements elsewhere — batching at the application layer with immediate acknowledgment, or using a write-optimized payment event store.'"
  },
  {
    id: "q23",
    subtopic: "Hierarchical Aggregation",
    style: "Scenario-based trade-offs",
    question: "A live video stream has 5 million concurrent viewers. Each viewer can post comments and like comments. All viewers need to see new comments and updated like counts within 3 seconds. A naive approach writes each event to all 5M viewers. What's the fundamental problem, and which write-scaling strategy addresses it?",
    options: [
      "The problem is write amplification: each comment creates 5M writes. Sharding viewers by hash(viewer_id) reduces per-shard writes to 5M/N for N shards.",
      "The problem is the fan-in/fan-out: millions of writers producing events that must reach millions of readers. Hierarchical aggregation with broadcast nodes reduces this to a manageable tree structure.",
      "The problem is database throughput: 5M individual writes per comment exceeds any single database's capacity. Adding a Kafka queue between the event source and viewers absorbs the burst.",
      "The problem is network bandwidth: sending 5M notifications per comment saturates the server NICs. Load shedding — only notifying 10% of viewers per comment — keeps bandwidth manageable."
    ],
    correctIndex: 1,
    explanation: "The content describes this exact scenario as the 'fan-in, fan-out problem of live comments' and proposes hierarchical aggregation as the solution. The key insight is that 'all of our viewers are looking for the same, eventually consistent view.' Instead of writing to each of the 5M viewers individually, you build a tree: write processors aggregate events, forward batches to a root processor, which distributes to broadcast nodes, which push to their assigned viewers. This reduces per-component load at each stage.",
    interviewScript: "In your interview, say: 'This is a fan-in/fan-out problem. 5M individual pushes per comment is intractable. Since all viewers want the same eventually-consistent view, I'd use hierarchical aggregation: comments are received by write processors (sharded by comment ID), aggregated over a short window, forwarded to a root processor, then distributed through broadcast nodes assigned via consistent hashing. Each layer reduces the per-component write volume at the cost of a small latency increase.'"
  },
  {
    id: "q24",
    subtopic: "Hierarchical Aggregation",
    style: "Failure analysis",
    question: "In your hierarchical aggregation system for live comments, you have: Write Processors → Root Processor → Broadcast Nodes → Viewers. The root processor crashes. What's the immediate user-visible impact, and what's the recovery strategy?",
    options: [
      "All viewers stop receiving updates permanently. Recovery: elect a new root from the broadcast nodes using leader election, replay events from write processors' in-memory buffers.",
      "Viewers receive stale data (last update before crash) but no new updates. Recovery: write processors detect the root is down and fail over to a standby root, which begins receiving aggregated batches and distributes them. Viewers see a brief gap in updates.",
      "Half the viewers see updates (from their local broadcast node cache) while the other half don't. Recovery: broadcast nodes switch to pulling directly from write processors, bypassing the root.",
      "The system continues working for a few seconds because broadcast nodes have buffered recent updates, then viewers notice a freeze. Recovery: automatically redistribute the root processor's slot range to the write processors using consistent hashing."
    ],
    correctIndex: 1,
    explanation: "In the hierarchical model from the content, the root processor merges aggregated batches from write processors and forwards to broadcast nodes. When it crashes, the pipeline breaks at the merge point. Broadcast nodes have their last received state and continue serving it (stale but not blank), but no new updates flow through. Recovery requires a standby root (or fast restart) that re-establishes the pipeline. Write processors can buffer or replay their recent windows. Viewers see a brief gap, then updates resume.",
    interviewScript: "In your interview, say: 'The root processor is a single point of failure in the aggregation tree. When it crashes, broadcast nodes still serve their last known state but stop receiving updates — viewers see a freeze. I'd run a hot standby root that takes over within seconds. Write processors buffer their aggregation windows in memory, so the new root receives the next batch without data loss. The gap is bounded by the aggregation window duration — a few seconds of missed updates.'"
  },
  {
    id: "q25",
    subtopic: "Hierarchical Aggregation",
    style: "Cross-subtopic bridge (Batching × Hierarchical Aggregation)",
    question: "You're designing a real-time dashboard showing total donation amounts for a charity live stream. 2 million viewers can donate simultaneously. You've implemented hierarchical aggregation: Donation Processors → Aggregation Layer → Dashboard. Your aggregation window is 5 seconds. A viewer donates $50 and immediately checks the dashboard. What will they see, and how does the batching window interact with the hierarchical structure to create this experience?",
    options: [
      "They see the updated total immediately — the donation processor writes directly to the dashboard's data store in addition to sending to the aggregation layer, ensuring zero-latency visibility",
      "They see the total WITHOUT their donation for up to 10 seconds — their donation enters a processor's 5-second batch, then the aggregation layer adds its own 5-second merge window before the dashboard updates",
      "They see the total WITHOUT their donation for up to 5 seconds — only the first aggregation stage has a window; subsequent stages (root processor, dashboard) propagate instantly once they receive the batch",
      "They see the total WITHOUT their donation for up to 15 seconds — each of the three stages (processor, aggregation, dashboard) adds a 5-second window"
    ],
    correctIndex: 1,
    explanation: "The content explains hierarchical aggregation 'reduces the number of writes that any one system needs to handle at the cost of some latency introduced by adding steps.' Each stage can have its own batching window. If donation processors batch over 5 seconds and the aggregation layer also uses a 5-second merge window, the total latency is additive: up to 5s at the processor + 5s at aggregation = 10 seconds worst case. This is the explicit trade-off the content describes: 'substantially reduced the number of writes... at the cost of some latency.'",
    interviewScript: "In your interview, say: 'Hierarchical aggregation trades latency for throughput at each stage. With 5-second windows, the worst case is additive: up to 5s in the donation processor batch, plus up to 5s in the aggregation layer merge — that's 10 seconds before the dashboard reflects the donation. For a charity stream, this is likely acceptable. If we need faster visibility, we can reduce window sizes, but that reduces the batching benefit. I'd tune the window size to balance user expectation against write reduction.'"
  },
  {
    id: "q26",
    subtopic: "Resharding",
    style: "Scenario-based trade-offs",
    question: "Your system has 8 shards and needs to expand to 16. During the migration, you implement dual-writes: every write goes to both the old shard and the new shard. Reads prefer the new shard with fallback to the old. A week into migration, you discover that 5% of records have different values on the old and new shards. What's the most likely cause?",
    options: [
      "The dual-write implementation has a race condition: if two concurrent updates arrive for the same key, they might be applied in different orders on the old vs. new shard",
      "Network partitions between the application and one of the shards caused some dual-writes to succeed on one shard but fail on the other, creating divergent state",
      "The migration script that copied historical data to the new shards used a stale snapshot, so records modified between snapshot time and dual-write activation are inconsistent",
      "All of the above are plausible causes, but the most likely for a 5% divergence rate sustained over a week is the race condition (A), since network failures (B) and migration gaps (C) would show different temporal patterns"
    ],
    correctIndex: 3,
    explanation: "The content mentions dual-writes during resharding but doesn't dive into the failure modes. In practice, dual-write systems face all three issues: race conditions cause ordering divergence (sustained, proportional to concurrent update rate), network failures cause sporadic divergence (bursty, correlated with infrastructure events), and snapshot timing causes one-time divergence (detectable, bounded to migration window). A sustained 5% rate over a week most likely points to race conditions, which are ongoing rather than one-time.",
    interviewScript: "In your interview, say: 'Dual-writes during resharding have three failure modes: race conditions causing ordering divergence between shards, network failures causing partial writes, and snapshot timing gaps during initial data copy. A sustained 5% divergence over a week points to race conditions — two concurrent updates being applied in different orders. I'd address this with version vectors or last-write-wins with synchronized timestamps, and run a periodic consistency checker to detect and repair divergent records.'"
  },
  {
    id: "q27",
    subtopic: "Resharding",
    style: "Interviewer pushback",
    question: "You propose handling a resharding event by taking the system offline for 2 hours to rehash and redistribute all data. Your interviewer says: 'We can't have any downtime. How do you do this live?' What's the correct approach?",
    options: [
      "Use database-native online resharding (e.g., Vitess or CockroachDB) which handles data movement transparently, then swap the routing configuration atomically",
      "Implement gradual migration: start dual-writing to both old and new shard assignments, backfill historical data to new shards, verify consistency, then cut over reads to new shards and stop writing to old ones",
      "Add the new shards and use consistent hashing with virtual nodes — the hash ring naturally redistributes a minimal amount of data to the new nodes without a full rehash",
      "Implement a scatter-gather proxy that routes reads to both old and new shard assignments during migration, eliminating the need for data movement entirely"
    ],
    correctIndex: 1,
    explanation: "The content describes the approach: 'Production systems use gradual migration which targets writes to both locations (the shard we're migrating from and the shard we're migrating to). This allows us to migrate data gradually while maintaining availability. The dual-write phase ensures no data is lost during migration. You write to both old and new shards, but read with preference for the new shard.' This is a phased approach: dual-write → backfill → verify → cutover.",
    interviewScript: "In your interview, say: 'I'd use a gradual migration with three phases. First, start dual-writing to both old and new shard assignments so no new writes are lost. Second, backfill historical data from old to new shards in the background. Third, verify consistency between old and new shards, then cut over reads to the new assignment and stop dual-writing. At no point is the system offline — reads always have a valid source.'"
  },
  {
    id: "q28",
    subtopic: "Hot Key Handling",
    style: "Estimation-backed reasoning",
    question: "A viral tweet receives 100,000 likes/sec. Your shard can handle 10,000 writes/sec. You implement the fixed k-split approach, splitting the like counter across k sub-keys (tweetLikes-0 through tweetLikes-k-1). Likers are randomly assigned to a sub-key. Readers must aggregate all k sub-keys to get the total. What value of k should you choose, and what's the read cost?",
    options: [
      "k=10 — each sub-key handles 10K writes/sec (at the shard's limit). Reads require 10 queries across potentially 10 different shards to aggregate the total count.",
      "k=100 — each sub-key handles 1K writes/sec (well within shard capacity). Reads require 100 queries, but these can be parallelized to complete in one round-trip.",
      "k=10 — each sub-key handles 10K writes/sec. But reads are free because you maintain a cached total in Redis that's updated asynchronously.",
      "k=10 — each sub-key handles 10K writes/sec. Reads only need to query 1 sub-key and multiply by k for an estimate."
    ],
    correctIndex: 0,
    explanation: "The content explains: 'if a small k brings our workload comfortably back into line with our database's write capacity, we've solved our problem!' With 100K likes/sec and 10K/shard capacity, k=10 makes each sub-key handle exactly 10K writes/sec. The content also explicitly states the downside: 'We've also multiplied the read volume by k. In order to get the number of likes for a given post, we need to reach postId-0, postId-1, postId-2, all the way through to postId-k-1.' So reads cost 10 queries. k=100 over-provisions unnecessarily. Option D is wrong — you can't just multiply by k since writes aren't uniformly distributed over time.",
    interviewScript: "In your interview, say: 'With 100K likes/sec and 10K/shard capacity, I need k=10 sub-keys. Each handles 10K writes/sec. The trade-off is reads now require aggregating 10 sub-keys. For a likes counter, this is acceptable — the read query fans out to 10 sub-keys in parallel, adds the results, and returns in one round-trip. I'd keep k small to minimize read amplification — a small k that brings us within capacity is better than over-splitting.'",
    proTip: "The content emphasizes: 'if a small k brings our workload comfortably back into line with our database's write capacity, we've solved our problem!' Don't over-engineer."
  },
  {
    id: "q29",
    subtopic: "Hot Key Handling",
    style: "Scenario-based trade-offs",
    question: "You're using the dynamic hot key detection approach: writers detect hot keys using local statistics and split writes across sub-keys. Readers always check all sub-keys (the simple approach). A key that was hot yesterday has cooled off — it now gets 10 writes/sec instead of 100,000/sec. What's the operational problem?",
    options: [
      "The local statistics on each writer become stale, so writers continue splitting writes to sub-keys unnecessarily, adding overhead to what is now a normal key",
      "Readers are still checking all sub-keys for this key, but the read amplification is now unjustified — the key doesn't need sub-keys anymore, but there's no mechanism to merge them back",
      "The sub-keys contain stale partial counts that will never be updated, so the total aggregate over-counts the actual value",
      "Other keys that have become hot aren't being split because the hot key detection threshold was calibrated for the previously-hot key's traffic pattern"
    ],
    correctIndex: 1,
    explanation: "The content discusses dynamic splitting where 'when a writer detects a key may be hot (they can keep local statistics), they can conditionally write to the sub-keys for that key.' But it doesn't discuss the reverse: what happens when a key cools off? Sub-keys persist, readers continue aggregating all of them (the simple approach always checks all sub-keys), and the write distribution across sub-keys becomes sparse. The operational debt is that you've permanently increased read complexity for a key that no longer needs it, with no described mechanism for merging sub-keys back.",
    interviewScript: "In your interview, say: 'Dynamic hot key splitting creates an asymmetry: splitting is triggered automatically, but merging back isn't. A key that was hot yesterday still has sub-keys that readers aggregate, adding unnecessary read overhead. I'd implement a cooldown mechanism: if a key's write rate drops below a threshold for a sustained period, merge the sub-keys back. This requires coordinating readers and writers, which is why the content notes most systems use the simpler always-check-all-sub-keys approach despite its overhead.'"
  },
  {
    id: "q30",
    subtopic: "Hot Key Handling",
    style: "Gotcha/trap question",
    question: "You implement dynamic hot key splitting: writers detect hot keys and split writes across sub-keys. You choose the 'simple' approach where readers always check all sub-keys. A writer detects a key is hot and starts writing to sub-key 0, 1, and 2. But the reader only checks the base key (no sub-keys) and returns a count of 50 when the true total across sub-keys is 5,000. What went wrong?",
    options: [
      "The reader's code has a bug — it should be checking sub-keys but isn't looking up the sub-key configuration",
      "The writer is using a different hashing scheme for sub-key assignment than the reader expects, so the reader can't find the sub-keys",
      "Both readers and writers must agree on whether a key is split. The reader was deployed before the hot key logic and doesn't know to check sub-keys — the write spread across sub-keys while the reader only queries the base key",
      "The writer created the sub-keys but didn't delete the base key, so the reader finds the base key (with its stale count of 50) and returns it without checking for sub-keys"
    ],
    correctIndex: 2,
    explanation: "The content explicitly warns: 'Importantly, both readers and writers need to be able to agree on which keys are hot for this to work. If writers are spreading writes across multiple sub-keys, but readers aren't reading from all sub-keys, we have a problem!' This is the gotcha: the simple approach only works if ALL readers are updated to check for sub-keys. If even one reader (or an older version of the code) queries only the base key, it gets a stale/partial count. Reader-writer agreement on the splitting scheme is critical.",
    interviewScript: "In your interview, say: 'This is the agreement problem the content warns about. Writers started splitting, but readers aren't checking sub-keys. Both sides must agree on whether a key is split. With the simple approach, ALL readers must always check for sub-keys — even for non-hot keys. This adds some overhead but guarantees consistency. The alternative — having writers announce splits to readers — is more efficient but much harder to coordinate reliably.'",
    proTip: "The content explicitly calls this out as a requirement. This is a trap that catches candidates who only think about the write path and forget the read path."
  },
  {
    id: "q31",
    subtopic: "When to Use / When NOT to Use",
    style: "Anti-pattern identification",
    question: "A candidate is designing a booking system for a small hotel chain (50 hotels, ~500 bookings/day across all hotels). They propose: 'I'll shard the bookings database by hotel_id across 10 nodes for write scalability, add a Kafka queue for burst handling, and implement a batching layer for check-in/check-out counter updates.' What should the interviewer's response be?",
    options: [
      "The sharding strategy is sound but 10 shards is too many for 50 hotels — 3 shards would be more appropriate. The queue and batching are reasonable additions.",
      "The architecture is overengineered. 500 bookings/day is ~0.006 writes/sec — a single PostgreSQL instance handles this trivially. Adding sharding, queuing, and batching creates operational complexity with zero benefit.",
      "The candidate is showing breadth of knowledge, which is positive. The interviewer should ask them to justify each component with back-of-envelope math rather than rejecting the proposal.",
      "The queue is unnecessary but sharding is forward-thinking — the hotel chain might grow. The interviewer should appreciate the scalability mindset."
    ],
    correctIndex: 1,
    explanation: "The content is emphatic: 'Be careful of employing write scaling strategies when no scaling is necessary!' and 'The worst case is creating a problem where one doesn't exist!' 500 bookings/day is roughly 0.006 writes/sec — even a Raspberry Pi could handle this. Each added component (sharding, queuing, batching) introduces operational complexity, failure modes, and maintenance burden with zero throughput benefit. The content explicitly says to use 'quick back-of-the-envelope math to see if it's worth the effort.'",
    interviewScript: "In your interview, say: 'Before adding any write-scaling infrastructure, let me do the math. 500 bookings/day is about 0.006 writes/sec. A single PostgreSQL instance handles thousands of writes per second. We're operating at 0.001% of a single machine's capacity. Adding sharding, queuing, and batching would create significant operational complexity — more things to monitor, debug, and maintain — with zero performance benefit. I'd start with the simplest architecture that works.'",
    proTip: "This is the most common mistake the content warns about. Showing restraint and doing the math is more impressive than proposing complex architectures."
  },
  {
    id: "q32",
    subtopic: "When to Use / When NOT to Use",
    style: "Multi-hop reasoning",
    question: "An interviewer asks you to design a system for 10,000 writes/sec. You propose sharding across 4 nodes (each handling 2,500 writes/sec). The interviewer then reveals: 'Actually, 90% of those writes are reads-after-writes — users write a value and immediately read it back.' How does this information change your sharding strategy?",
    options: [
      "It doesn't change the strategy — sharding by the same key means the write and subsequent read hit the same shard, so reads-after-writes are automatically co-located",
      "You should add read replicas to each shard, since the read volume (9,000 reads/sec across shards) might exceed shard capacity. The sharding strategy itself stays the same.",
      "You should reduce to 2 shards — the actual write load requiring durability is only 1,000/sec (the other 9,000 are effectively round-trips). Two shards handle 1,000/sec easily, and fewer shards means simpler read-after-write consistency.",
      "You need to switch to a single-node database — cross-shard reads-after-writes in a sharded system can return stale data if the replication lag between the write shard and the read replica hasn't caught up"
    ],
    correctIndex: 2,
    explanation: "This requires multi-hop reasoning. First: 90% of 10K writes/sec have an immediate read-after-write, so the actual unique write volume that needs scaling is lower than 10K. Second: the content emphasizes minimizing complexity — 'each of these strategies comes with tradeoffs.' If the actual sustained write load that creates durability pressure is only 1,000 new writes/sec, 4 shards is over-provisioned. Two shards handle this easily and simplify read-after-write consistency (fewer shards = simpler topology = less chance of stale reads). The content says to validate bottlenecks with math first.",
    interviewScript: "In your interview, say: 'If 90% of writes are followed by immediate reads, the effective write pressure is lower than it appears — many of those writes/reads are essentially round-trips. The actual novel write volume creating durability pressure might only be 1,000/sec. I'd reduce to 2 shards: this handles the load easily, simplifies read-after-write consistency since there are fewer routing decisions, and reduces operational complexity. The content principle applies: don't add more shards than the workload demands.'"
  }
];

const SUBTOPICS_ORDER = [
  "Vertical Scaling & Hardware",
  "Database Choices for Write Optimization",
  "Database Tuning",
  "Horizontal Sharding",
  "Partitioning Key Selection",
  "Vertical Partitioning",
  "Write Queues & Burst Handling",
  "Load Shedding",
  "Batching",
  "Hierarchical Aggregation",
  "Resharding",
  "Hot Key Handling",
  "When to Use / When NOT to Use"
];

const SUBTOPIC_QUESTION_MAP = {};
QUESTIONS.forEach(q => {
  if (!SUBTOPIC_QUESTION_MAP[q.subtopic]) SUBTOPIC_QUESTION_MAP[q.subtopic] = [];
  SUBTOPIC_QUESTION_MAP[q.subtopic].push(q.id);
});

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  if (pct >= 90) return { label: "Staff-ready", desc: "You'd ace this topic", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  if (pct >= 75) return { label: "Strong Senior", desc: "Solid, minor gaps to close", color: "text-blue-400", bg: "bg-blue-500/20" };
  if (pct >= 60) return { label: "SDE2-level", desc: "Review the weak areas below", color: "text-yellow-400", bg: "bg-yellow-500/20" };
  return { label: "Needs deep review", desc: "Revisit the fundamentals", color: "text-red-400", bg: "bg-red-500/20" };
}

export default function ScalingWritesQuiz() {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questionOrder, setQuestionOrder] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(90);
  const [timedOut, setTimedOut] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [retryMode, setRetryMode] = useState(null);
  const timerRef = useRef(null);
  const [expandedResults, setExpandedResults] = useState({});

  const currentQuestion = questionOrder[currentIdx] ? QUESTIONS.find(q => q.id === questionOrder[currentIdx]) : null;
  const totalQuestions = questionOrder.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (screen === "quiz" && currentQuestion && !submitted && !timedOut) {
      const questionId = currentQuestion.id;
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimedOut(true);
            setShowExplanation(true);
            setAnswers(a => ({ ...a, [questionId]: { selected: -1, confidence: "timeout", correct: false } }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, currentIdx, submitted, timedOut, currentQuestion]);

  const handleSubmitCb = useCallback(handleSubmit, [selectedOption, confidence, currentQuestion]);
  const handleNextCb = useCallback(handleNext, [currentIdx, questionOrder, skipped, answers]);

  useEffect(() => {
    if (screen === "quiz") {
      const handler = (e) => {
        if (submitted || timedOut) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNextCb(); }
          return;
        }
        const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3, "A": 0, "B": 1, "C": 2, "D": 3 };
        if (keyMap[e.key] !== undefined) { setSelectedOption(keyMap[e.key]); }
        if (e.key === "Enter" && selectedOption !== null && confidence !== null && !submitted) { e.preventDefault(); handleSubmitCb(); }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [screen, submitted, timedOut, selectedOption, confidence, currentIdx, handleSubmitCb, handleNextCb]);

  function startQuiz(chosenMode, retryQuestionIds = null) {
    setMode(chosenMode);
    let order;
    if (retryQuestionIds) {
      order = chosenMode === "shuffled" ? shuffleArray(retryQuestionIds) : retryQuestionIds.sort((a, b) => {
        const qa = QUESTIONS.find(q => q.id === a);
        const qb = QUESTIONS.find(q => q.id === b);
        return SUBTOPICS_ORDER.indexOf(qa.subtopic) - SUBTOPICS_ORDER.indexOf(qb.subtopic);
      });
    } else if (chosenMode === "shuffled") {
      order = shuffleArray(QUESTIONS.map(q => q.id));
    } else {
      order = [];
      SUBTOPICS_ORDER.forEach(st => {
        QUESTIONS.filter(q => q.subtopic === st).forEach(q => order.push(q.id));
      });
    }
    setQuestionOrder(order);
    setCurrentIdx(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers({});
    setFlagged(new Set());
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setStartTime(Date.now());
    setShowExplanation(false);
    setRetryMode(null);
    setExpandedResults({});
    setScreen("quiz");
  }

  function handleSubmit() {
    if (selectedOption === null || confidence === null) return;
    clearInterval(timerRef.current);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAnswers(a => ({ ...a, [currentQuestion.id]: { selected: selectedOption, confidence, correct: isCorrect } }));
    setSubmitted(true);
    setShowExplanation(true);
  }

  function handleSkip() {
    clearInterval(timerRef.current);
    setSkipped(s => [...s, questionOrder[currentIdx]]);
    moveToNext();
  }

  function handleNext() {
    moveToNext();
  }

  function moveToNext() {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questionOrder.length) {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setShowExplanation(false);
      setTimer(90);
    } else if (skipped.length > 0) {
      const remaining = skipped.filter(id => !answers[id]);
      if (remaining.length > 0) {
        setQuestionOrder(prev => [...prev, ...remaining]);
        setSkipped([]);
        setCurrentIdx(nextIdx);
        setSelectedOption(null);
        setConfidence(null);
        setSubmitted(false);
        setTimedOut(false);
        setShowExplanation(false);
        setTimer(90);
      } else {
        finishQuiz();
      }
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    setScreen("results");
  }

  function toggleFlag() {
    setFlagged(prev => {
      const s = new Set(prev);
      if (s.has(currentQuestion.id)) s.delete(currentQuestion.id);
      else s.add(currentQuestion.id);
      return s;
    });
  }

  const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-300";
  const timerBg = timer <= 15 ? "bg-red-500/20" : timer <= 30 ? "bg-amber-500/20" : "bg-gray-700/50";
  const optionLabels = ["A", "B", "C", "D"];
  const confidenceLevels = [
    { key: "guessing", label: "Guessing", icon: "🎲" },
    { key: "somewhat", label: "Somewhat Sure", icon: "🤔" },
    { key: "confident", label: "Very Confident", icon: "💪" }
  ];

  // --- LANDING SCREEN ---
  if (screen === "landing") {
    const estTime = Math.round(QUESTIONS.length * 75 / 60);
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <Zap size={14} /> FAANG SDE2 — Hard
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Scaling Writes
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
              Master vertical scaling, sharding strategies, queue-based burst handling, batching, hierarchical aggregation, and hot key management for write-heavy system design interviews.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-1"><Brain size={14} /> {QUESTIONS.length} questions</span>
            <span className="flex items-center gap-1"><Clock size={14} /> ~{estTime} min</span>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Subtopic Coverage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUBTOPICS_ORDER.map(st => (
                <div key={st} className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-2">
                  <span className="text-xs text-gray-300 truncate mr-2">{st}</span>
                  <span className="text-xs font-mono text-purple-400 whitespace-nowrap">{(SUBTOPIC_QUESTION_MAP[st] || []).length}q</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => startQuiz("section")}
              className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
            >
              Section Order
              <span className="block text-xs text-gray-500 font-normal mt-0.5">Questions grouped by subtopic</span>
            </button>
            <button
              onClick={() => startQuiz("shuffled")}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
            >
              Shuffled (Recommended)
              <span className="block text-xs text-blue-200 font-normal mt-0.5">Simulates interview unpredictability</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (screen === "results") {
    const totalAnswered = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const pct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const grade = getGrade(pct);

    const subtopicScores = {};
    SUBTOPICS_ORDER.forEach(st => {
      const qIds = SUBTOPIC_QUESTION_MAP[st] || [];
      const relevant = qIds.filter(id => answers[id]);
      const correct = relevant.filter(id => answers[id].correct).length;
      subtopicScores[st] = { total: relevant.length, correct, pct: relevant.length > 0 ? Math.round((correct / relevant.length) * 100) : 0 };
    });

    const luckyGuesses = Object.entries(answers).filter(([_, a]) => a.correct && a.confidence === "guessing");
    const overconfidentMisses = Object.entries(answers).filter(([_, a]) => !a.correct && a.confidence === "confident");
    const incorrectQuestions = Object.entries(answers).filter(([_, a]) => !a.correct);
    const flaggedQuestions = [...flagged].map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    const weakSubtopics = Object.entries(subtopicScores).filter(([_, s]) => s.pct < 70 && s.total > 0).map(([name]) => name);
    const weakQuestionIds = weakSubtopics.flatMap(st => SUBTOPIC_QUESTION_MAP[st] || []);
    const incorrectIds = incorrectQuestions.map(([id]) => id);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    const toggleExpand = (key) => setExpandedResults(prev => ({ ...prev, [key]: !prev[key] }));

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 ${grade.bg} ${grade.color} px-4 py-2 rounded-full text-sm font-bold mb-3`}>
              <Award size={16} /> {grade.label}
            </div>
            <div className="text-5xl font-bold mb-1">{pct}%</div>
            <div className="text-gray-400 text-sm">{correctCount} / {totalAnswered} correct</div>
            <div className="text-gray-500 text-xs mt-1">{grade.desc}</div>
            <div className="text-gray-600 text-xs mt-2 flex items-center justify-center gap-1">
              <Clock size={12} /> {minutes}m {seconds}s total
            </div>
          </div>

          {/* Subtopic Breakdown */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2"><BarChart3 size={14} /> Per-Subtopic Breakdown</h3>
            <div className="space-y-2">
              {SUBTOPICS_ORDER.map(st => {
                const s = subtopicScores[st];
                if (s.total === 0) return null;
                const barColor = s.pct >= 75 ? "bg-emerald-500" : s.pct >= 60 ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={st}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300 truncate mr-2">{st}</span>
                      <span className="text-gray-500 whitespace-nowrap">{s.correct}/{s.total} ({s.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence Analysis */}
          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Confidence Analysis</h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-3">
                  <button onClick={() => toggleExpand("lucky")} className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1 w-full text-left">
                    🎲 Lucky Guesses ({luckyGuesses.length}) — hidden weak spots
                    {expandedResults.lucky ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {expandedResults.lucky && luckyGuesses.map(([id]) => {
                    const q = QUESTIONS.find(qu => qu.id === id);
                    return (
                      <div key={id} className="bg-gray-800/50 rounded p-3 mb-2 text-xs">
                        <div className="text-gray-300 mb-1 font-medium">{q.question.substring(0, 120)}...</div>
                        <div className="text-gray-500">{q.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <button onClick={() => toggleExpand("overconfident")} className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-1 w-full text-left">
                    💪❌ Overconfident Misses ({overconfidentMisses.length}) — dangerous misconceptions
                    {expandedResults.overconfident ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {expandedResults.overconfident && overconfidentMisses.map(([id]) => {
                    const q = QUESTIONS.find(qu => qu.id === id);
                    return (
                      <div key={id} className="bg-gray-800/50 rounded p-3 mb-2 text-xs">
                        <div className="text-gray-300 mb-1 font-medium">{q.question.substring(0, 120)}...</div>
                        <div className="text-green-400 mb-1">Correct: {optionLabels[q.correctIndex]}. {q.options[q.correctIndex].substring(0, 80)}...</div>
                        <div className="text-gray-500">{q.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Incorrect Questions */}
          {incorrectQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
              <button onClick={() => toggleExpand("incorrect")} className="flex items-center justify-between w-full text-left">
                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2"><XCircle size={14} /> Incorrect Questions ({incorrectQuestions.length})</h3>
                {expandedResults.incorrect ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </button>
              {expandedResults.incorrect && (
                <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
                  {incorrectQuestions.map(([id, ans]) => {
                    const q = QUESTIONS.find(qu => qu.id === id);
                    return (
                      <div key={id} className="bg-gray-800/50 rounded p-3 text-xs border-l-2 border-red-500/50">
                        <div className="text-purple-400 text-xs mb-1">{q.subtopic}</div>
                        <div className="text-gray-300 mb-2 font-medium leading-relaxed">{q.question.substring(0, 200)}{q.question.length > 200 ? "..." : ""}</div>
                        {ans.selected >= 0 && <div className="text-red-400 mb-1">Your answer: {optionLabels[ans.selected]}. {q.options[ans.selected].substring(0, 100)}...</div>}
                        {ans.selected < 0 && <div className="text-gray-500 mb-1 italic">Timed out</div>}
                        <div className="text-green-400 mb-2">Correct: {optionLabels[q.correctIndex]}. {q.options[q.correctIndex].substring(0, 100)}...</div>
                        <div className="text-gray-500 leading-relaxed">{q.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Flagged Questions */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
              <button onClick={() => toggleExpand("flagged")} className="flex items-center justify-between w-full text-left">
                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2"><Flag size={14} /> Flagged for Review ({flaggedQuestions.length})</h3>
                {expandedResults.flagged ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </button>
              {expandedResults.flagged && (
                <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
                  {flaggedQuestions.map(q => (
                    <div key={q.id} className="bg-gray-800/50 rounded p-3 text-xs border-l-2 border-amber-500/50">
                      <div className="text-purple-400 text-xs mb-1">{q.subtopic}</div>
                      <div className="text-gray-300 mb-2 font-medium">{q.question.substring(0, 200)}{q.question.length > 200 ? "..." : ""}</div>
                      <div className="text-green-400 mb-1">Correct: {optionLabels[q.correctIndex]}. {q.options[q.correctIndex].substring(0, 100)}...</div>
                      <div className="text-gray-500 leading-relaxed">{q.explanation}</div>
                      {q.interviewScript && <div className="mt-2 bg-blue-500/10 border border-blue-500/20 rounded p-2 text-blue-300">{q.interviewScript}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button onClick={() => setScreen("landing")} className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
              <Home size={14} /> Home
            </button>
            {incorrectIds.length > 0 && (
              <button onClick={() => startQuiz(mode, incorrectIds)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                <RotateCcw size={14} /> Retry Missed ({incorrectIds.length})
              </button>
            )}
            {weakQuestionIds.length > 0 && (
              <button onClick={() => startQuiz(mode, [...new Set(weakQuestionIds)])} className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-semibold py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                <AlertTriangle size={14} /> Weak Subtopics
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-500">
            {currentIdx + 1} / {totalQuestions}
          </div>
          <div className={`flex items-center gap-1.5 ${timerBg} ${timerColor} px-3 py-1 rounded-full text-sm font-mono font-bold`}>
            <Clock size={14} />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Subtopic tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{currentQuestion.subtopic}</span>
          <span className="text-xs text-gray-600 italic">{currentQuestion.style}</span>
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
          <p className="text-sm leading-relaxed text-gray-200">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {currentQuestion.options.map((opt, i) => {
            let borderClass = "border-gray-800 hover:border-gray-600";
            let bgClass = "bg-gray-900";
            let textClass = "text-gray-300";
            let labelBg = "bg-gray-800 text-gray-400";

            if ((submitted || timedOut) && showExplanation) {
              if (i === currentQuestion.correctIndex) {
                borderClass = "border-emerald-500/50";
                bgClass = "bg-emerald-500/10";
                textClass = "text-emerald-300";
                labelBg = "bg-emerald-500/20 text-emerald-400";
              } else if (i === selectedOption && i !== currentQuestion.correctIndex) {
                borderClass = "border-red-500/50";
                bgClass = "bg-red-500/10";
                textClass = "text-red-300";
                labelBg = "bg-red-500/20 text-red-400";
              }
            } else if (i === selectedOption) {
              borderClass = "border-blue-500/50";
              bgClass = "bg-blue-500/10";
              textClass = "text-blue-300";
              labelBg = "bg-blue-500/20 text-blue-400";
            }

            return (
              <button
                key={i}
                onClick={() => { if (!submitted && !timedOut) setSelectedOption(i); }}
                disabled={submitted || timedOut}
                className={`w-full text-left ${bgClass} border ${borderClass} rounded-lg p-3 transition-all flex items-start gap-3`}
              >
                <span className={`${labelBg} w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                  {optionLabels[i]}
                </span>
                <span className={`text-sm leading-relaxed ${textClass}`}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Confidence selector */}
        {selectedOption !== null && !submitted && !timedOut && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">How confident are you?</div>
            <div className="flex gap-2">
              {confidenceLevels.map(c => (
                <button
                  key={c.key}
                  onClick={() => setConfidence(c.key)}
                  className={`flex-1 text-xs py-2 px-2 rounded-lg border transition-all ${
                    confidence === c.key
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                      : "border-gray-800 bg-gray-900 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          {!submitted && !timedOut && (
            <>
              <button onClick={handleSkip} className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 py-2 px-3 rounded-lg transition-colors">
                <SkipForward size={12} /> Skip
              </button>
              <button onClick={toggleFlag} className={`flex items-center gap-1 text-xs border py-2 px-3 rounded-lg transition-colors ${
                flagged.has(currentQuestion.id)
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
              }`}>
                <Flag size={12} /> {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
              </button>
              <div className="flex-1" />
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || confidence === null}
                className={`flex items-center gap-1 text-sm font-semibold py-2 px-5 rounded-lg transition-colors ${
                  selectedOption !== null && confidence !== null
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </>
          )}
          {(submitted || timedOut) && !showExplanation && null}
          {(submitted || timedOut) && showExplanation && (
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1 text-xs border py-2 px-3 rounded-lg transition-colors ${
                flagged.has(currentQuestion.id)
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <Flag size={12} /> {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
            </button>
          )}
          {(submitted || timedOut) && showExplanation && (
            <>
              <div className="flex-1" />
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 px-5 rounded-lg transition-colors"
              >
                {currentIdx + 1 < totalQuestions || skipped.filter(id => !answers[id]).length > 0 ? "Next" : "Results"} <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="space-y-3 animate-in">
            {timedOut && !submitted && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="text-xs font-semibold text-red-400 mb-1 flex items-center gap-1"><Clock size={12} /> Time's up!</div>
                <div className="text-xs text-gray-400">This question has been marked as incorrect.</div>
              </div>
            )}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">Explanation</div>
              <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            {currentQuestion.interviewScript && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1">🎤 Interview Script</div>
                <p className="text-sm text-blue-200/80 leading-relaxed italic">{currentQuestion.interviewScript}</p>
              </div>
            )}
            {currentQuestion.proTip && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                <div className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1">⭐ Pro Tip</div>
                <p className="text-sm text-purple-200/80 leading-relaxed">{currentQuestion.proTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Keyboard hints */}
        {!submitted && !timedOut && (
          <div className="text-center text-xs text-gray-700 mt-4">
            Press 1-4 to select • Enter to submit
          </div>
        )}
        {(submitted || timedOut) && (
          <div className="text-center text-xs text-gray-700 mt-4">
            Press Enter or Space to continue
          </div>
        )}
      </div>
    </div>
  );
}
