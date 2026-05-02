// === COVERAGE MANIFEST ===
// Subtopic: Read/Write Ratio & The Problem — Questions: 2 — IDs: [q1, q2]
// Subtopic: Indexing — Questions: 3 — IDs: [q3, q4, q5]
//   └─ Nested: Full table scans & O(n) vs O(log n) — covered by: [q3]
//   └─ Nested: Compound indexes & column order — covered by: [q4]
//   └─ Nested: Over-indexing myth — covered by: [q5]
// Subtopic: Vertical Scaling / Hardware Upgrades — Questions: 2 — IDs: [q6, q7]
// Subtopic: Denormalization & Materialized Views — Questions: 3 — IDs: [q8, q9, q10]
//   └─ Nested: Join elimination — covered by: [q8]
//   └─ Nested: Materialized views for aggregation — covered by: [q9]
//   └─ Nested: Write complexity trade-off — covered by: [q10]
// Subtopic: Read Replicas & Leader-Follower Replication — Questions: 3 — IDs: [q11, q12, q13]
//   └─ Nested: Sync vs async replication — covered by: [q11]
//   └─ Nested: Replication lag — covered by: [q12]
//   └─ Nested: Failover / promotion — covered by: [q13]
// Subtopic: Database Sharding — Questions: 2 — IDs: [q14, q15]
//   └─ Nested: Functional sharding — covered by: [q14]
//   └─ Nested: Geographic sharding — covered by: [q15]
// Subtopic: Application-Level Caching (Redis/Memcached) — Questions: 3 — IDs: [q16, q17, q18]
//   └─ Nested: Cache-aside pattern — covered by: [q16]
//   └─ Nested: Skewed access patterns — covered by: [q17]
//   └─ Nested: TTL-driven by NFRs — covered by: [q18]
// Subtopic: Cache Invalidation Strategies — Questions: 3 — IDs: [q19, q20, q21]
//   └─ Nested: Write-through vs write-behind — covered by: [q19]
//   └─ Nested: Tagged invalidation — covered by: [q20]
//   └─ Nested: Combining strategies — covered by: [q21]
// Subtopic: CDN & Edge Caching — Questions: 2 — IDs: [q22, q23]
//   └─ Nested: What NOT to cache at CDN — covered by: [q23]
// Subtopic: Hot Key Problem & Request Coalescing — Questions: 3 — IDs: [q24, q25, q26]
//   └─ Nested: Request coalescing — covered by: [q24]
//   └─ Nested: Cache key fanout — covered by: [q25]
//   └─ Nested: Coalescing limits — covered by: [q26]
// Subtopic: Cache Stampede — Questions: 3 — IDs: [q27, q28, q29]
//   └─ Nested: Distributed locks — covered by: [q27]
//   └─ Nested: Probabilistic early refresh — covered by: [q28]
//   └─ Nested: Background refresh — covered by: [q29]
// Subtopic: Cache Versioning — Questions: 3 — IDs: [q30, q31, q32]
//   └─ Nested: Two-lookup overhead — covered by: [q30]
//   └─ Nested: Race condition avoidance — covered by: [q31]
//   └─ Nested: Limitations for computed data — covered by: [q32]
// Subtopic: Deleted Items Cache — Questions: 2 — IDs: [q33, q34]
// Cross-subtopic: Caching × Replicas — Questions: 1 — IDs: [q17]
// Cross-subtopic: Sharding × Caching — Questions: 1 — IDs: [q15]
// Cross-subtopic: Denormalization × Cache Invalidation — Questions: 1 — IDs: [q10]
// Cross-subtopic: Stampede × Hot Key — Questions: 1 — IDs: [q29]
// Cross-subtopic: Versioning × CDN — Questions: 1 — IDs: [q32]
// Anti-pattern questions: 4 — IDs: [q5, q7, q10, q23]
// Gotcha/trap questions: 4 — IDs: [q4, q12, q26, q31]
// Total: 34 questions across 13 subtopics
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Read/Write Ratio & The Problem",
    "style": "Estimation-backed reasoning",
    "question": "You're designing a social media platform where users post an average of 2 times per day, but each post is viewed by an average of 500 followers within 24 hours. Your single PostgreSQL instance handles 5,000 QPS comfortably. With 1 million daily active users, which statement most accurately describes your scaling challenge?",
    "options": [
      "Read traffic at ~11,500 QPS exceeds your DB capacity, but write traffic at ~23 QPS is trivially handled — you need read scaling first",
      "Both reads (~5,000 QPS) and writes (~2,000 QPS) are near capacity — you need to scale both simultaneously",
      "Write amplification from indexing means writes are actually your bottleneck at this scale",
      "The 500:1 fan-out ratio means you should focus on write scaling via sharding before addressing reads"
    ],
    "correctIndex": 0,
    "explanation": "With 1M DAU × 2 posts × 500 views = 1 billion reads/day ≈ 11,574 QPS for reads alone, well beyond your 5K QPS capacity. Writes are only 1M × 2 / 86400 ≈ 23 QPS — trivial. The read/write ratio is roughly 500:1, making this a textbook read scaling problem. Option D confuses fan-out (a read concern) with write amplification.",
    "interviewScript": "In your interview, say: 'Let me do some quick math. With 1M DAU posting twice daily, that's about 23 writes per second — negligible. But each post fans out to 500 readers, giving us roughly 11,500 read QPS. Our DB handles 5K, so reads are the bottleneck by a factor of 2x. I'd start with read scaling strategies.'",
    "proTip": "Always do back-of-envelope math before proposing architecture. Interviewers love candidates who quantify the problem before solving it."
  },
  {
    "id": "q2",
    "subtopic": "Read/Write Ratio & The Problem",
    "style": "Failure analysis",
    "question": "Your e-commerce product catalog serves 80,000 read QPS from a single database that's hitting 95% CPU utilization. A junior engineer suggests optimizing the application code to reduce query count by 30%. Why is this approach likely insufficient as the primary solution?",
    "options": [
      "Application-level optimization can't reduce query count because the ORM generates fixed queries",
      "Even with a 30% reduction, 56,000 QPS still exceeds what a single server can sustain at safe utilization levels, and traffic will continue growing",
      "Code optimization primarily reduces write-path latency through better batching and connection pooling, but read performance is bottlenecked by I/O throughput and disk seek time, neither of which application code changes can influence — the CPU spike is caused by kernel-level context switching between database connections, not query execution overhead",
      "The CPU bottleneck is caused by TCP connection establishment overhead, not actual query execution — each of the 80K queries opens a new connection, and reducing query count by 30% doesn't help because the connection pool is the saturated resource, so the fix is connection pooling rather than fewer queries"
    ],
    "correctIndex": 1,
    "explanation": "At 95% CPU with 80K QPS, a 30% reduction brings you to ~56K QPS — still dangerously close to capacity with no room for traffic spikes. More critically, this is a physics problem: CPU cores have finite instruction throughput. Code optimization buys temporary headroom but doesn't address the fundamental constraint that a single machine has physical limits. You need architectural solutions (replicas, caching) rather than just code tuning.",
    "interviewScript": "In your interview, say: 'Code optimization is good hygiene, but it's a linear improvement against exponential growth. Even 30% fewer queries leaves us at 56K QPS on hardware already at 95% CPU. I'd pursue this optimization AND add architectural read scaling — they're complementary, not alternatives.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "Indexing",
    "style": "Scenario-based trade-offs",
    "question": "Your users table has 10 million rows at ~200 bytes per row. Login queries filter by email (WHERE email = ?). Response times have degraded from 5ms to 30 seconds. After adding a B-tree index on the email column, you expect query performance to improve from scanning ~2GB of data to approximately:",
    "options": [
      "Scanning ~200MB — the index reduces data by 10x but still requires sequential access",
      "Scanning ~20 index entries via O(log n) traversal — roughly 4KB of index pages plus one data page fetch",
      "Scanning ~1MB — B-tree indexes only eliminate half the table per lookup",
      "Scanning ~500MB — indexes help with range queries but not exact matches"
    ],
    "correctIndex": 1,
    "explanation": "A B-tree index on email turns the lookup from O(n) full table scan (reading all 10M rows / ~2GB) into O(log n) index traversal. Log₂(10,000,000) ≈ 23 comparisons, meaning roughly 20 index page reads to find the exact row pointer, then one data page fetch. This is why the article emphasizes that indexing turns 'scanning 1 million rows versus checking maybe 20 index entries.' Option A describes a partial scan, not how B-tree indexes work.",
    "interviewScript": "In your interview, say: 'Without an index, the DB does a full table scan — 10 million rows, about 2GB. A B-tree index gives us O(log n) lookups, so roughly 20-23 index entries to traverse. That's going from scanning gigabytes to reading a handful of index pages. It's the single highest-impact optimization we can make.'",
    "proTip": "In interviews, always mention EXPLAIN or EXPLAIN ANALYZE — showing you know how to diagnose slow queries before blindly adding indexes demonstrates operational maturity."
  },
  {
    "id": "q4",
    "subtopic": "Indexing",
    "style": "Gotcha/trap question",
    "question": "You create a compound index on (status, created_at) for an orders table. A teammate writes a query: SELECT * FROM orders WHERE created_at > '2024-01-01'. They report the query is still doing a full table scan despite the index existing. What's the root cause?",
    "options": [
      "Compound indexes can only be used for exact-match (equality) queries and cannot accelerate range queries like greater-than or BETWEEN — for range queries, the database must fall back to a full table scan even when an index exists, because B-tree traversal requires exact key comparison to navigate the tree structure",
      "The query optimizer determined that a full table scan is faster than using the index because the date filter matches a large percentage of rows — when more than roughly 10-15% of rows match the filter predicate, sequential scanning is more efficient than the random I/O pattern of index lookups",
      "The index's leftmost prefix is 'status', so a query filtering only on 'created_at' cannot use this index — column order matters",
      "B-tree indexes don't support date and timestamp comparisons natively — they're designed for string and numeric equality checks, so date range queries require a specialized temporal index type like GiST or BRIN that understands chronological ordering"
    ],
    "correctIndex": 2,
    "explanation": "This is a classic compound index gotcha. A compound index on (status, created_at) is sorted first by status, then by created_at within each status group. Queries that skip the leftmost column can't efficiently traverse the index. The article explicitly states: 'an index on (status, created_at) helps both queries filtering by status and queries filtering by both. But it won't help queries filtering only by created_at.' Option B is a plausible distractor but the real issue is index prefix ordering.",
    "interviewScript": "In your interview, say: 'Column order in compound indexes follows the leftmost prefix rule. Our index on (status, created_at) is sorted by status first, so querying only on created_at can't leverage the index structure. We either need a separate index on created_at or need to include status in the WHERE clause.'",
    "proTip": "When designing compound indexes, put the most selective (high cardinality) column that's always present in queries as the leftmost column."
  },
  {
    "id": "q5",
    "subtopic": "Indexing",
    "style": "Anti-pattern identification",
    "question": "A candidate designing a social media application says: 'I'll only add one index per table to avoid write overhead. Too many indexes will slow down our writes significantly.' What's the most critical flaw in this reasoning?",
    "options": [
      "Modern databases enforce a practical limit of one B-tree index per table because each additional index competes for the same buffer pool memory, and at two or more indexes the page eviction rate causes thrashing that degrades both read and write performance below single-index baselines",
      "Indexes only slow down reads by adding an extra indirection layer — the query planner must decide whether to use the index or do a sequential scan, and for small result sets the index lookup plus heap fetch is actually slower than a direct scan, so this concern about write overhead is entirely unfounded",
      "The fear of over-indexing is dramatically overblown on modern hardware — under-indexing causes far more damage than over-indexing, and read-heavy apps need indexes on every frequently queried column",
      "You should add indexes only after the application is in production and you can measure actual slow-query patterns using pg_stat_statements or equivalent — premature indexing based on assumed access patterns often creates indexes that the query planner never uses, wasting write overhead on maintaining unused index structures"
    ],
    "correctIndex": 2,
    "explanation": "The article directly addresses this anti-pattern: 'You'll read outdated resources warning about too many indexes slowing down writes. While index overhead is real, this fear is dramatically overblown in most applications. Modern hardware and database engines handle well-designed indexes efficiently. Under-indexing kills more applications than over-indexing ever will.' In interviews, you should confidently add indexes for your query patterns.",
    "interviewScript": "In your interview, say: 'I'll add indexes on every column we frequently query, join, or sort by. The write overhead from indexes is real but minimal on modern hardware — it's a much bigger risk to under-index and have queries doing full table scans at scale.'",
    "proTip": null
  },
  {
    "id": "q6",
    "subtopic": "Vertical Scaling / Hardware Upgrades",
    "style": "Interviewer pushback",
    "question": "You mention vertical scaling (SSDs, more RAM) as a first step for a read-heavy application. Your interviewer pushes back: 'But vertical scaling doesn't really solve anything.' What's the strongest response?",
    "options": [
      "Agree completely — vertical scaling demonstrates a lack of distributed systems understanding and should never be mentioned in system design interviews, because interviewers are specifically testing your ability to design horizontally scalable architectures, and mentioning hardware upgrades signals that you default to brute-force solutions rather than elegant engineering",
      "Explain that SSDs provide 10-100x faster random I/O and more RAM keeps datasets in memory, buying meaningful breathing room while you implement architectural solutions — but acknowledge it doesn't scale indefinitely",
      "Argue that vertical scaling is always sufficient for read workloads since modern servers with NVMe SSDs and 2TB of RAM can handle millions of QPS through in-memory B-tree traversal — the entire dataset fits in RAM for most applications, making horizontal scaling unnecessary until you reach truly exceptional data volumes",
      "Pivot entirely to horizontal scaling since the interviewer's pushback is a clear signal that they want to discuss distributed systems design — responding with more vertical scaling arguments risks appearing inflexible and missing the interviewer's intent to explore your knowledge of replication, sharding, and caching"
    ],
    "correctIndex": 1,
    "explanation": "The article notes vertical scaling 'won't solve every problem, but it's often the fastest way to buy yourself some breathing room.' The key is framing it honestly: it's a pragmatic first step with real performance benefits (10-100x I/O improvement) while acknowledging its ceiling. Option D is too reactive — showing judgment means standing by valid points while acknowledging their limits.",
    "interviewScript": "In your interview, say: 'Vertical scaling is a pragmatic first step — swapping to SSDs gives 10-100x faster I/O, and more RAM means more hot data stays in memory. It buys us time while we implement horizontal solutions. But I'd pursue it in parallel with architectural changes, not as a replacement for them.'",
    "proTip": "Interviewers test whether you have practical judgment, not just theoretical knowledge. Mentioning vertical scaling shows you think about cost-effectiveness and time-to-value."
  },
  {
    "id": "q7",
    "subtopic": "Vertical Scaling / Hardware Upgrades",
    "style": "Anti-pattern identification",
    "question": "Your team's database is at 60,000 read QPS on a high-end server. A senior engineer proposes: 'Let's just keep upgrading the hardware — we can get 2x the cores and 4x the RAM for $50K/month. No architectural changes needed.' For a fast-growing application, what's the most dangerous assumption in this proposal?",
    "options": [
      "The $50K/month cost is the primary concern — distributed systems running on commodity hardware are always cheaper than a single high-end server, because cloud providers offer horizontal scaling at linear cost while vertical scaling follows a superlinear pricing curve where each doubling of capacity costs 3-4x more",
      "Hardware upgrades only improve write performance through faster disk I/O and larger WAL buffers, but read performance is bottlenecked by network bandwidth between the database and application servers, which no amount of server-side hardware improvement can address",
      "Vertical scaling has a physical ceiling — you can't buy a server with infinite cores — and each upgrade gets proportionally more expensive, while traffic growth is often exponential",
      "Modern cloud providers don't offer true hardware upgrades beyond their largest instance types, and migrating to a bigger instance requires database downtime for the resize operation, making this approach operationally risky for a fast-growing application that can't afford maintenance windows"
    ],
    "correctIndex": 2,
    "explanation": "The core issue is physics meets economics: CPU cores, memory, and I/O have hard physical limits. You can't buy a server with 10,000 cores. Meanwhile, user growth and traffic are often exponential. At some point, the most expensive server available simply can't keep up. Option A is wrong because distributed systems often cost more in total (operational complexity), but they scale beyond what any single machine can achieve.",
    "interviewScript": "In your interview, say: 'Vertical scaling is effective short-term, but it has diminishing returns and a hard ceiling. Traffic growth is often exponential while hardware capacity is bounded. I'd use vertical scaling to buy immediate headroom while implementing horizontal strategies that can scale indefinitely.'",
    "proTip": null
  },
  {
    "id": "q8",
    "subtopic": "Denormalization & Materialized Views",
    "style": "Scenario-based trade-offs",
    "question": "Your e-commerce order page joins users, orders, order_items, and products tables — a 4-table join serving 10,000 QPS. You denormalize by creating an order_summary table with redundant user names and product names. A product name changes. What's the operational cost you've accepted?",
    "options": [
      "No operational cost — denormalized tables in modern databases like PostgreSQL 15+ automatically propagate changes from source tables through materialized view triggers, so when the product name changes in the products table, the order_summary table is updated transparently by the database engine without application intervention",
      "You must update every order_summary row containing that product name — potentially millions of rows — but this is acceptable because product name changes are rare compared to order page reads",
      "You can't denormalize product data because product names change too frequently — even if name changes are rare today, product data evolves unpredictably as the business grows, and denormalizing creates a maintenance burden that compounds over time as more fields are embedded",
      "The order_summary table becomes permanently stale after any source data change — you'd need to rebuild the entire table from scratch on every product update by re-joining and re-aggregating all source tables, making the denormalization approach untenable for any data that ever changes"
    ],
    "correctIndex": 1,
    "explanation": "Denormalization trades write complexity for read speed. When a product name changes, you must update all order_summary rows containing it — a potentially expensive write operation touching millions of rows. But the article emphasizes: 'Always consider your read/write ratio before denormalizing.' Product name changes are extremely rare compared to thousands of order page views per second, making this trade-off clearly worthwhile.",
    "interviewScript": "In your interview, say: 'Denormalization means accepting write amplification. A product name change requires updating every order_summary row with that product. But if we're serving 10,000 order page reads per second and product names change maybe once a month, the read/write ratio massively favors this trade-off.'",
    "proTip": null
  },
  {
    "id": "q9",
    "subtopic": "Denormalization & Materialized Views",
    "style": "Scenario-based trade-offs",
    "question": "Your product listing page shows average ratings, requiring a JOIN across products and reviews tables with GROUP BY aggregation on every page load. This query runs 50,000 times per day. Which approach best balances performance and freshness?",
    "options": [
      "Add a B-tree index on reviews.product_id — this makes the JOIN and GROUP BY aggregation essentially free because the index provides pre-sorted access to reviews by product, allowing the database to compute the average incrementally without materializing the full join result set",
      "Create a materialized view precomputing AVG(rating) per product via a background job, refreshing every few minutes — eliminates expensive aggregation from the hot path",
      "Cache the entire product listing page in Redis with a 24-hour TTL — slightly stale ratings are acceptable for a product listing page since individual ratings fluctuate by small amounts, and the 24-hour refresh cadence aligns with most users' browsing patterns where they revisit the catalog daily",
      "Denormalize by storing the current average rating directly in the products table, updated synchronously on every new review submission — this eliminates the JOIN entirely and provides real-time accuracy, which is important because product ratings directly influence purchase decisions"
    ],
    "correctIndex": 1,
    "explanation": "Materialized views are the ideal fit here. The article describes this exact pattern: 'Instead of calculating average product ratings on every page load, compute them once (via a background job) and store the results.' Indexing (A) helps but doesn't eliminate the aggregation cost. A 24-hour TTL (C) is too stale for ratings. Synchronous denormalization (D) adds latency to every review submission, which is especially problematic during high-review periods.",
    "interviewScript": "In your interview, say: 'This is a textbook materialized view use case. The aggregation is expensive and identical across requests, but the underlying data changes slowly. I'd precompute AVG(rating) per product via a background job every 5-10 minutes, making the hot path a simple single-table read.'",
    "proTip": "Materialized views are especially powerful for analytics-style queries (COUNT, AVG, SUM) that scan large datasets. They're less useful for queries that already hit indexed lookups."
  },
  {
    "id": "q10",
    "subtopic": "Denormalization & Materialized Views",
    "style": "Cross-subtopic bridge (Denormalization × Cache Invalidation)",
    "question": "You've denormalized user profile data into a posts table for fast feed rendering. You also cache feed data in Redis. A user changes their display name. What's the most dangerous failure mode that candidates overlook?",
    "options": [
      "The denormalized posts table update fails but the cache is invalidated, so users see the old name from the database",
      "The cache is invalidated and the posts table is updated, but a read replica serves stale denormalized data that gets re-cached — polluting the cache with the old name for the duration of the TTL",
      "The user's profile table is updated correctly, but their browser's HTTP cache still shows the old display name because the profile API response includes a Cache-Control: max-age=300 header that prevents the browser from requesting fresh data — this is a client-side caching issue that requires cache-busting headers, not a server-side denormalization concern",
      "The posts table update succeeds but takes so long to propagate across millions of denormalized rows that the user sees a timeout error on their profile update request — the synchronous write amplification of updating every post creates a feedback loop where the user's simple name change triggers a multi-second database operation that exceeds the API gateway's request timeout"
    ],
    "correctIndex": 1,
    "explanation": "This is a nasty interaction between denormalization and caching. Even if you correctly update the denormalized posts table AND invalidate the Redis cache, a read replica with replication lag might serve the old denormalized data to a request that arrives between cache invalidation and replication propagation. That request re-caches stale data, potentially serving the old name for the entire TTL duration. This compounds two complexities: denormalization's write amplification and caching's race conditions.",
    "interviewScript": "In your interview, say: 'The dangerous case is the interaction between denormalization and cache invalidation. After we update the posts table and invalidate the cache, replication lag on a read replica could serve stale denormalized data to a cache-miss request, re-polluting the cache. I'd mitigate this by reading from the primary for cache rebuilds immediately after writes.'",
    "proTip": "This failure mode is why many production systems use 'read-your-writes' consistency: after a write, route that user's reads to the primary for a short window."
  },
  {
    "id": "q11",
    "subtopic": "Read Replicas & Leader-Follower Replication",
    "style": "Scenario-based trade-offs",
    "question": "You're adding read replicas to a user profile service. Profile views are 50,000 QPS, profile updates are 50 QPS. Your interviewer asks: 'synchronous or asynchronous replication?' For THIS specific use case, which choice is best justified?",
    "options": [
      "Synchronous — user profiles contain critical identity data (email, name, profile picture) that must never be stale across replicas, because a user who updates their email for account recovery and then gets routed to a stale replica could be locked out of their account if the recovery flow checks the old email",
      "Asynchronous — the massive read/write imbalance (1000:1) means replication lag is negligible in practice, and sync replication would add latency to the already-rare writes without meaningful consistency benefit",
      "Semi-synchronous — replicate synchronously to one replica and asynchronously to the rest, providing a hot standby for failover while keeping write latency lower than full synchronous replication across all replicas, which is the optimal balanced approach for any read-heavy workload regardless of the specific read/write ratio",
      "Asynchronous with zero-lag guarantee — modern databases like PostgreSQL 16+ and Aurora support bounded-lag asynchronous replication that guarantees replicas are within 1ms of the primary through adaptive flow control, combining the performance benefits of async with the consistency guarantees of sync"
    ],
    "correctIndex": 1,
    "explanation": "With a 1000:1 read/write ratio, writes are so infrequent that async replication lag is practically invisible — a replica might lag by milliseconds at most. Synchronous replication would add latency to every write (blocking until all replicas confirm) for negligible consistency benefit. Option D is impossible — 'zero-lag async' is a contradiction. Semi-sync (C) is valid but overengineered for this ratio.",
    "interviewScript": "In your interview, say: 'Given a 1000:1 read/write ratio, I'd choose asynchronous replication. Writes are so rare that replication lag stays minimal, and synchronous replication would add unnecessary write latency. The occasional millisecond of staleness on a profile read is acceptable.'",
    "proTip": "Always tie your sync/async decision to the specific read/write ratio and consistency requirements. There's no universally correct choice."
  },
  {
    "id": "q12",
    "subtopic": "Read Replicas & Leader-Follower Replication",
    "style": "Gotcha/trap question",
    "question": "A user updates their profile picture, then immediately refreshes their profile page. They see the old picture. A junior engineer says: 'The cache must be stale — let's reduce the TTL.' But you're not using any application-level cache. What's actually happening?",
    "options": [
      "The browser is caching the old image in its local HTTP cache due to aggressive Cache-Control headers on the profile image URL — this is a client-side caching issue that requires either cache-busting query parameters on the image URL or shorter max-age directives, not a backend infrastructure change",
      "The profile read hit an async read replica that hasn't received the write yet — this is replication lag, and reducing cache TTL wouldn't help because there's no cache to invalidate",
      "The database transaction for the image upload hasn't committed yet when the read arrives — the image upload involves writing the binary blob to object storage and then updating the profile row with the new URL, and if these are in a single transaction, the read could arrive between the object storage write and the database commit",
      "The CDN is serving a cached version of the profile page from an edge location that hasn't been invalidated yet — CDN edge caches typically have a propagation delay of 30-60 seconds for cache invalidation commands, so the old image persists at edge nodes until the invalidation fully propagates across the CDN's global network"
    ],
    "correctIndex": 1,
    "explanation": "This is the classic replication lag gotcha. The article states: 'Users might not see their own changes immediately if they're reading from a lagging replica.' The user wrote to the primary, then their read request was routed to a replica that hasn't received the update yet. The junior engineer's instinct to check the cache is reasonable but wrong here — the staleness comes from the replication layer. The fix is read-after-write consistency: route the user's reads to the primary for a short window after writes.",
    "interviewScript": "In your interview, say: 'This is replication lag, not caching. The write went to the primary, but the subsequent read hit a replica that hasn't synced yet. I'd implement read-after-write consistency: after a user writes, route their reads to the primary for a brief window — say 5-10 seconds.'",
    "proTip": "Read-after-write consistency is so common that many ORMs and database proxies support it natively. Always mention it when discussing async replication."
  },
  {
    "id": "q13",
    "subtopic": "Read Replicas & Leader-Follower Replication",
    "style": "Failure analysis",
    "question": "Your primary database crashes while handling 3,000 write QPS and 50,000 read QPS across 5 async replicas. You promote a replica to primary. What's the most likely data consistency issue you'll face?",
    "options": [
      "All replicas will refuse to accept the promoted primary because they have different data versions",
      "The promoted replica may be missing the most recent writes that hadn't replicated before the crash — these transactions are effectively lost unless recovered from the old primary's WAL",
      "Read traffic will immediately overwhelm the newly promoted primary because it now handles both the 50,000 read QPS and 3,000 write QPS on a single instance that was previously only handling read traffic — the remaining 4 replicas can't help because they're still pointed at the old primary's replication slot and need to be reconfigured",
      "The promoted replica will have MORE data than the old primary due to split-brain replication — during the brief window between the primary crash and the promotion, remaining replicas may have accepted writes from application servers that didn't detect the primary failure, creating conflicting state that must be resolved through manual merge"
    ],
    "correctIndex": 1,
    "explanation": "With async replication, the primary can acknowledge writes before they propagate to replicas. When the primary crashes, any writes in flight (acknowledged to the client but not yet replicated) are lost on the replicas. The promoted replica becomes primary but is missing those transactions. Recovery requires accessing the old primary's write-ahead log (WAL), which may not be possible if the disk failed. This is the fundamental trade-off of async replication: better performance at the cost of potential data loss during failover.",
    "interviewScript": "In your interview, say: 'Async replication means the promoted replica may be missing recent writes that hadn't propagated before the crash. These are effectively lost unless we can recover the old primary's WAL. This is the core trade-off of async replication — we accept this risk for lower write latency and higher throughput.'",
    "proTip": null
  },
  {
    "id": "q14",
    "subtopic": "Database Sharding",
    "style": "Scenario-based trade-offs",
    "question": "Your application has distinct user profiles, product catalog, and order history services. User queries are 30K QPS, product queries are 50K QPS, and order queries are 20K QPS. You choose functional sharding — putting each domain in its own database. What's the primary benefit for READ scaling specifically?",
    "options": [
      "Each database holds a smaller dataset, so indexes are smaller and queries are faster — plus read load is distributed across 3 servers instead of one",
      "Functional sharding eliminates the need for read replicas entirely because each domain database only handles its own traffic (30K, 50K, or 20K QPS), all of which are within a single PostgreSQL instance's capacity — the functional split provides sufficient horizontal scaling without the operational complexity of replication lag management",
      "You can now JOIN across all three databases more efficiently using a distributed query engine like Presto or Trino, which parallelizes the cross-database join across all three servers simultaneously — this is faster than a single-database join because each server only scans its smaller dataset",
      "Each database can use a different storage engine optimized for its access pattern, but read throughput stays the same"
    ],
    "correctIndex": 0,
    "explanation": "The article states functional sharding helps because 'user profile requests only query the smaller user database, and product searches only hit the product database.' For reads, this provides two benefits: smaller datasets mean faster individual queries (smaller indexes, less data to scan), and the read load naturally distributes across multiple servers. Option C is wrong — functional sharding makes cross-domain JOINs harder, not easier.",
    "interviewScript": "In your interview, say: 'Functional sharding splits our 100K total QPS across three purpose-built databases. Each handles only its domain's queries with smaller indexes and datasets. Product queries never compete with user queries for database resources. It's both a performance and isolation win.'",
    "proTip": null
  },
  {
    "id": "q15",
    "subtopic": "Database Sharding",
    "style": "Cross-subtopic bridge (Sharding × Caching)",
    "question": "You've geographically sharded your database — US users in US-East, EU users in EU-West. You also use a Redis cache and CDN. A US user views a European user's public profile. Which describes the request path and its key challenge?",
    "options": [
      "The request hits the US CDN edge, cache misses, queries the US database (which doesn't have EU user data), returns 404 — geographic sharding breaks cross-region reads entirely",
      "The request hits the US CDN edge, cache misses, routes to the EU database for the profile, populates both the US Redis cache and CDN edge — subsequent US reads are fast, but the first request has cross-region latency",
      "Geographic sharding automatically replicates all user data to all regions using cross-region synchronous replication, so the US database already contains a full copy of the EU profile data — geographic sharding distributes writes to the nearest datacenter but reads are served from a global replica that contains data from all regions",
      "The CDN always routes the request to the geographically closest database regardless of which shard contains the data, so it queries the US database, which then proxies the request to the EU shard — this adds double the network latency (US→EU→US) compared to a direct EU query because the request must traverse the Atlantic Ocean twice"
    ],
    "correctIndex": 1,
    "explanation": "Geographic sharding means data lives in its home region. When a US user requests an EU profile, the application must route to the EU shard — incurring cross-region latency (~100-200ms extra). However, caching layers (Redis + CDN) absorb this cost: the first request is slow, but subsequent US-region reads for the same EU profile are served from the local cache. This is why the article notes caching and sharding are complementary — caching mitigates sharding's cross-region read penalties.",
    "interviewScript": "In your interview, say: 'Geographic sharding means the first cross-region read incurs full round-trip latency to the data's home region. But once that data is cached in the requesting region's Redis and CDN, subsequent reads are fast. This is why geographic sharding works best with aggressive caching for cross-region access patterns.'",
    "proTip": "In interviews, always think about the cache-miss path, not just the cache-hit path. The first user to request cross-region data pays the full latency penalty."
  },
  {
    "id": "q16",
    "subtopic": "Application-Level Caching",
    "style": "Scenario-based trade-offs",
    "question": "You're designing a URL shortener like Bitly. URLs are created once and redirected millions of times. The short-to-long URL mapping never changes once created. Which caching strategy is optimal and why?",
    "options": [
      "Cache in Redis with a 1-hour TTL — short enough to keep memory usage bounded for millions of URL mappings while still providing a meaningful cache hit rate for popular links that receive bursts of clicks within the first hour of sharing",
      "Cache in Redis with NO expiration — the mapping is immutable, so there's zero invalidation complexity, and the DB only gets hit for cache misses on unpopular links",
      "Don't cache at all — use a hash index in the database for O(1) lookups, which is fast enough for any practical QPS because hash indexes have constant-time performance regardless of table size, and the overhead of maintaining a separate Redis cluster isn't justified when the database itself can serve the same access pattern",
      "Cache at the CDN layer only — Redis adds unnecessary infrastructure complexity for simple key-value lookups, and CDN edge caching provides the same sub-millisecond latency benefit with geographic distribution that Redis alone cannot match, since CDN edges are located closer to end users than a centralized Redis cluster"
    ],
    "correctIndex": 1,
    "explanation": "The article explicitly describes Bitly as 'a caching dream scenario. Cache the short URL to long URL mapping aggressively in Redis with no expiration (URLs don't change).' Since the mapping is immutable, you never face cache invalidation complexity — the hardest part of caching disappears. The DB becomes a cold-storage fallback for unpopular links. Option A introduces unnecessary eviction for data that never changes. Option C ignores that even O(1) DB lookups can't match sub-millisecond Redis for millions of QPS.",
    "interviewScript": "In your interview, say: 'URL shorteners are the dream caching scenario — the data is immutable. I'd cache every short-to-long mapping in Redis with no TTL. Zero invalidation complexity, sub-millisecond reads, and the database only handles cache misses for rarely accessed links.'",
    "proTip": null
  },
  {
    "id": "q17",
    "subtopic": "Application-Level Caching",
    "style": "Cross-subtopic bridge (Caching × Replicas)",
    "question": "Your product catalog serves 100,000 QPS. 80% of traffic goes to the top 1% of products (popular items). You have budget for either 5 read replicas OR a Redis cache cluster. Which provides better read scaling for THIS workload and why?",
    "options": [
      "Read replicas — they provide both read scaling AND redundancy (failover capability), making them strictly better than caching because caching only addresses performance while replicas address both performance and availability, and the redundancy benefit alone justifies the operational overhead of managing replication",
      "Redis cache — the highly skewed access pattern (80/1 distribution) means caching exploits hot data locality, serving 80K QPS from memory at sub-millisecond latency while the DB handles only 20K QPS of diverse queries",
      "They're equivalent for this workload — both distribute 100K QPS across multiple servers with similar per-request latency, so the choice should be made based on operational complexity rather than performance characteristics, and replicas are simpler to operate since they're just additional database instances",
      "Read replicas — caches don't help for product catalog data because product details change frequently (prices, inventory, descriptions) and the invalidation complexity of keeping the Redis cache consistent with the database outweighs any latency benefit, especially at 100K QPS where invalidation events would themselves generate significant traffic"
    ],
    "correctIndex": 1,
    "explanation": "The article emphasizes that 'most applications exhibit highly skewed access patterns.' When 80% of reads hit 1% of products, a cache naturally keeps those hot items in memory. 80K QPS served at sub-millisecond latency from Redis, leaving only 20K diverse queries for the database. Read replicas would spread 100K QPS evenly across 6 servers (~17K each) — functional but slower per request. For skewed distributions, caching is dramatically more efficient.",
    "interviewScript": "In your interview, say: 'The key insight is the access pattern skew — 80% of reads hit just 1% of products. A cache naturally keeps these hot items in memory, absorbing 80K QPS at sub-millisecond latency. Read replicas would work but they'd still execute full queries for every request. For skewed distributions, caching provides much better performance per dollar.'",
    "proTip": "Always analyze the access distribution before choosing between replicas and caching. Uniform distributions favor replicas; skewed distributions favor caching."
  },
  {
    "id": "q18",
    "subtopic": "Application-Level Caching",
    "style": "Implementation-specific nuance",
    "question": "Your non-functional requirements state: 'Search results should be no more than 30 seconds stale. User profiles can tolerate 5 minutes of staleness.' How should these NFRs directly inform your caching design?",
    "options": [
      "Use a single 30-second TTL for all cached data — the stricter staleness requirement should apply as the universal default, because applying different TTLs per data type creates inconsistency in the caching layer that's difficult to reason about and debug when staleness issues arise",
      "Set search result cache TTL to 30 seconds and user profile cache TTL to 5 minutes — each data type's TTL directly maps to its staleness tolerance from the NFRs",
      "Don't use TTL at all — rely entirely on write-through invalidation to meet both staleness requirements, because active invalidation provides tighter consistency guarantees than any TTL-based approach and eliminates the possibility of serving stale data within the TTL window",
      "Set TTLs to half the staleness tolerance (15 seconds for search and 2.5 minutes for profiles) as a safety margin — this accounts for clock skew between application servers and Redis nodes, cache write propagation delays, and the possibility that the TTL timer starts slightly before the data was actually fresh, ensuring you never exceed the NFR-defined staleness bound even under adverse timing conditions"
    ],
    "correctIndex": 1,
    "explanation": "The article directly states: 'Ideally, your cache TTL should be driven by non-functional requirements around data staleness. If your requirements state search results should be no more than 30 seconds stale, that gives you your exact TTL. For user profiles that can tolerate 5 minutes of staleness, use a 5-minute TTL.' This maps staleness requirements directly to cache configuration, making design decisions straightforward and justified.",
    "interviewScript": "In your interview, say: 'I'd derive my cache TTLs directly from the non-functional requirements. 30-second TTL for search results, 5-minute TTL for user profiles. This bounds our consistency guarantees to exactly what the business requires — no tighter than needed, no looser than acceptable.'",
    "proTip": "Tying TTLs to NFRs is a strong interview signal because it shows you design systems from requirements, not from arbitrary technical defaults."
  },
  {
    "id": "q19",
    "subtopic": "Cache Invalidation Strategies",
    "style": "Scenario-based trade-offs",
    "question": "You're building an event ticketing platform. Event details (venue, date, description) update infrequently but MUST be accurate — showing wrong venue info could send attendees to the wrong location. Which invalidation strategy best fits?",
    "options": [
      "TTL-only with a 1-hour expiration — stale venue data for up to an hour is an acceptable trade-off for simplicity",
      "Write-behind invalidation — queue the invalidation to process asynchronously for better write performance",
      "Write-through invalidation — update or delete cache entries immediately when writing to the database, accepting the additional write latency to ensure users never see stale venue information",
      "No caching for event details — the strict accuracy requirement for venue information means caching introduces unacceptable risk, because any caching layer creates a window where stale data could be served, and the consequence of displaying the wrong venue is severe enough to justify the latency cost of always reading from the database"
    ],
    "correctIndex": 2,
    "explanation": "The article uses this exact example: 'If an event organizer updates the venue address, attendees should not see the old location for another hour just because it's cached somewhere.' Write-through invalidation ensures cache entries are updated or deleted at write time. The added write latency is acceptable because event detail updates are rare. Write-behind (B) introduces a staleness window that's unacceptable for venue data. TTL-only (A) could serve wrong venues for up to an hour.",
    "interviewScript": "In your interview, say: 'Venue information is safety-critical data — sending people to the wrong location is unacceptable. I'd use write-through invalidation: update the cache immediately when event details change. The added write latency is negligible since event updates are rare, and the consistency guarantee is essential.'",
    "proTip": null
  },
  {
    "id": "q20",
    "subtopic": "Cache Invalidation Strategies",
    "style": "Multi-hop reasoning",
    "question": "A social media platform caches user feeds. Each feed entry contains the post content, author name, and author profile picture URL. When a user changes their profile picture, which invalidation approach handles this most efficiently?",
    "options": [
      "Iterate through all cached feeds and update the profile picture URL in each one — ensures immediate consistency",
      "Use tagged invalidation — associate each cached feed entry with tags like 'user:123:profile'. When the picture changes, invalidate all entries tagged with 'user:123:profile', forcing regeneration on next access",
      "Set a 30-second TTL on all feed entries — this ensures the picture will update everywhere within 30 seconds, and since most social media platforms consider 30-second staleness acceptable for profile metadata, this provides a simpler implementation than tagged invalidation with equivalent practical freshness",
      "Use write-through to update the user's profile cache and ignore feed caches — feeds will show the old picture until TTL expires"
    ],
    "correctIndex": 1,
    "explanation": "The article describes tagged invalidation: 'Associate cache entries with tags (e.g., user:123:posts). Invalidate all entries with a specific tag when related data changes.' A profile picture change affects potentially thousands of feed entries across many users. Tagged invalidation lets you invalidate all entries containing that user's data without knowing exactly which feeds they appear in. Option A is O(n) across all caches. Option C forces extremely aggressive TTLs on all feed data for a rare event.",
    "interviewScript": "In your interview, say: 'I'd use tagged invalidation. Every feed entry that displays user 123's data gets tagged with user:123:profile. When their picture changes, I invalidate all entries with that tag. It's surgical — I don't need to know which feeds contain their content, the tag system handles the fanout.'",
    "proTip": "Tagged invalidation shines when a single entity change can affect many unrelated cached objects. It's essentially a reverse index for cache dependencies."
  },
  {
    "id": "q21",
    "subtopic": "Cache Invalidation Strategies",
    "style": "Multi-hop reasoning",
    "question": "Your production system uses both short TTLs (5 minutes) as a safety net AND active write-through invalidation for critical data. An engineer asks: 'Why both? Isn't write-through invalidation sufficient?' What's the strongest justification for the dual approach?",
    "options": [
      "Write-through invalidation can fail silently — the cache delete call might timeout or the message queue might lose the event. Short TTLs provide a bounded staleness guarantee even when active invalidation fails",
      "TTLs are computationally cheaper than active invalidation because TTL expiration is handled by Redis's lazy expiration mechanism at zero CPU cost to the application, while write-through invalidation requires the application to make an explicit DELETE call to Redis on every write, adding latency and consuming connection pool resources",
      "Write-through only works for single-key invalidation and cannot handle cascading invalidation of related cached objects — when a user profile changes, the write-through handler can only delete the profile cache key but cannot identify and invalidate the feed entries, search results, and recommendation lists that also contain that user's data",
      "The two approaches are actually fully redundant — implementing both wastes computational resources and adds architectural complexity because TTL-based expiration and write-through invalidation serve the exact same purpose (keeping cached data fresh), and running both means every cache entry is invalidated twice, doubling the load on both the cache and the database"
    ],
    "correctIndex": 0,
    "explanation": "The article states: 'Most production systems combine approaches. Use short TTLs (5-15 minutes) as a safety net, with active invalidation for critical data.' The key insight is that active invalidation can fail: network partitions, message queue failures, or application bugs can cause invalidation events to be lost. Short TTLs bound the maximum staleness — even in the worst case, data is at most 5 minutes old. The dual approach provides defense in depth.",
    "interviewScript": "In your interview, say: 'I always combine TTLs with active invalidation as defense in depth. Active invalidation handles the happy path — data refreshes immediately on writes. But invalidation can fail silently: dropped messages, timeouts, bugs. Short TTLs provide a hard upper bound on staleness even when everything else goes wrong.'",
    "proTip": "Defense-in-depth caching is a hallmark of production systems. Mentioning it shows interviewer you've operated systems at scale."
  },
  {
    "id": "q22",
    "subtopic": "CDN & Edge Caching",
    "style": "Estimation-backed reasoning",
    "question": "Your application serves users globally. A user in Tokyo requests data from your Virginia data center. CDN edge caching can reduce this latency from ~200ms to under 10ms. With 40% of your 100K QPS coming from Asia-Pacific, what's the approximate origin load reduction from CDN caching with a 90% cache hit rate at APAC edges?",
    "options": [
      "Origin load drops by approximately 4,000 QPS — only 10% of APAC traffic misses the CDN cache, while the other 90% is served from edge nodes and never reaches the origin, but this calculation doesn't account for CDN-to-origin revalidation requests that occur on approximately 30% of cache hits",
      "Origin load drops by ~36,000 QPS — 90% of the 40K APAC queries are absorbed by CDN edges, leaving only 4K APAC cache misses hitting the origin",
      "Origin load drops by approximately 90,000 QPS — CDN caching benefits all regions equally regardless of geographic distribution, so the 90% hit rate applies to the full 100K QPS, not just the APAC portion",
      "Origin load is effectively unchanged — CDN edge nodes still proxy all requests to the origin server for freshness validation using conditional GET requests with If-None-Match/If-Modified-Since headers, so while response payloads are served from edge cache, the origin still processes the validation logic for every request"
    ],
    "correctIndex": 1,
    "explanation": "40% of 100K = 40K APAC QPS. With 90% CDN hit rate, 36K requests are served from edge (never reaching origin) and only 4K cache misses hit the origin. The article notes 'CDN caching can reduce origin load by 90% or more.' This 36K QPS reduction is significant — it's like removing a third of your total read load from the origin database. The remaining 60K non-APAC traffic could get similar treatment from CDN edges in their regions.",
    "interviewScript": "In your interview, say: 'With 40K APAC QPS and 90% CDN hit rate, we absorb 36K requests at the edge. That's a 36% reduction in origin load just from one region. If we deploy CDN globally with similar hit rates, origin load drops from 100K to roughly 10K QPS — a 90% reduction.'",
    "proTip": null
  },
  {
    "id": "q23",
    "subtopic": "CDN & Edge Caching",
    "style": "Anti-pattern identification",
    "question": "A candidate proposes caching ALL API responses at the CDN layer — including user settings, private messages, and account preferences — to maximize cache hit rates. What's the most critical flaw in this design?",
    "options": [
      "CDN caching is limited to static assets like images, CSS, and JavaScript files — CDN edge servers can't cache dynamic API responses because they lack the ability to parse response headers and determine cacheability, so all API traffic must pass through to the origin regardless of content type",
      "User-specific data like private messages and account settings have zero shared cache benefit — only one user ever requests them — while introducing significant privacy and security risks by storing personal data at edge locations",
      "CDN caching only works with HTTP GET requests, and user settings and private messages are typically accessed via POST requests for security reasons (to prevent URL-based data leakage), so the CDN would bypass caching for these endpoints automatically based on the HTTP method",
      "The cache hit rate would actually be very high for these endpoints because users frequently check their settings and messages — the high access frequency per user means each user's data stays warm in the CDN edge cache, providing sub-10ms response times that justify the edge storage cost"
    ],
    "correctIndex": 1,
    "explanation": "The article explicitly warns: 'CDNs only make sense for data accessed by multiple users. Don't cache user-specific data like personal preferences, private messages, or account settings. These have no cache hit rate benefit since only one user ever requests them. Focus CDN caching on content with natural sharing patterns.' Caching private data at edge locations also creates security concerns — edge servers are a wider attack surface.",
    "interviewScript": "In your interview, say: 'CDN caching only benefits data with shared access patterns — product pages, public posts, search results. User-specific data like messages and settings have a cache hit rate of effectively zero since only one user requests them. Caching them wastes edge storage and introduces privacy risks with no performance benefit.'",
    "proTip": "In interviews, demonstrating what NOT to cache is often more impressive than knowing what to cache. It shows judgment, not just pattern matching."
  },
  {
    "id": "q24",
    "subtopic": "Hot Key Problem & Request Coalescing",
    "style": "Scenario-based trade-offs",
    "question": "A celebrity with 50 million followers posts on your platform. Your Redis cache for that post's data is getting 500,000 requests per second on a single key. The cache server starts timing out. You implement request coalescing at the application layer. If you have 200 application servers, what's the maximum backend load after coalescing?",
    "options": [
      "500,000 QPS — coalescing only helps with database load, not cache load",
      "200 requests per second — one from each application server, since coalescing deduplicates requests within each server",
      "50,000 QPS — coalescing reduces backend load by exactly 10x because the algorithm batches every 10 concurrent requests into a single backend call, with the batch size determined by the coalescing window duration rather than the number of application servers",
      "1 request per second — coalescing globally deduplicates across all servers"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Request coalescing reduces backend load from potentially infinite to exactly N, where N is the number of application servers. Even if millions of users want the same data simultaneously, your backend only receives N requests — one per server doing the coalescing.' With 200 app servers, that's at most 200 requests to the cache/backend. Each server batches all incoming requests for the same key into a single outbound request.",
    "interviewScript": "In your interview, say: 'Request coalescing on each app server means at most N concurrent requests to the backend for any single key, where N is the number of app servers. With 200 servers, that's a 2500x reduction from 500K to 200 QPS. The key insight is that coalescing is per-server — multiple users hitting the same server share one backend request.'",
    "proTip": null
  },
  {
    "id": "q25",
    "subtopic": "Hot Key Problem & Request Coalescing",
    "style": "Implementation-specific nuance",
    "question": "Request coalescing alone isn't enough. You implement cache key fanout: storing the celebrity's post under 10 keys (feed:taylor-swift:1 through feed:taylor-swift:10), with clients randomly selecting one. What's the primary trade-off you've introduced?",
    "options": [
      "10x higher memory usage for this entry AND more complex invalidation — you must clear all 10 copies when data changes — but the load per key drops from 500K to 50K QPS",
      "10x higher latency per request because clients must randomly select a key and then check whether that specific replica contains valid data — if the randomly selected key was recently invalidated, the client must try another key, creating a retry loop that degrades average response time proportionally to the number of fanout copies",
      "Inconsistency between the 10 copies is unavoidable because they're written and invalidated at slightly different times due to network jitter between the application and cache nodes — a user hitting copy 3 might see updated data while a user hitting copy 7 still sees stale data, creating a confusing experience where the same URL shows different content to different users",
      "10x more cache misses because the probability of any single key being warm decreases"
    ],
    "correctIndex": 0,
    "explanation": "The article identifies the exact trade-off: 'The trade-off with fanout is memory usage and cache consistency. You're storing the same data multiple times, and invalidation becomes more complex since you need to clear all copies.' By spreading 500K QPS across 10 keys at 50K each, you solve the hot key problem. The cost is 10x memory for that entry and needing to invalidate all 10 keys on updates. Options C and D are wrong — all copies are written simultaneously, and with random selection, each key gets ~1/10 of total traffic, maintaining good hit rates.",
    "interviewScript": "In your interview, say: 'Key fanout trades memory and invalidation complexity for survivability. Storing 10 copies means 10x memory for this entry and invalidating all 10 on updates. But it drops per-key load from 500K to 50K QPS — the difference between timeouts and smooth operation. For a viral post threatening availability, this trade-off is clearly worth it.'",
    "proTip": "In production, many teams dynamically enable fanout only when they detect a hot key exceeding a threshold — this avoids the memory overhead for normal keys."
  },
  {
    "id": "q26",
    "subtopic": "Hot Key Problem & Request Coalescing",
    "style": "Gotcha/trap question",
    "question": "Your team implements request coalescing and celebrates that backend load dropped from 500K QPS to exactly N requests (one per app server). A week later, you add 300 more application servers to handle general traffic growth. What happens to the backend load for the hot key?",
    "options": [
      "Backend load stays at the original 200 QPS because the coalescing configuration remembers and locks to the server count at deployment time — adding new servers doesn't increase coalesced backend requests because the coalescing layer maintains a fixed-size request pool based on the initial cluster topology",
      "Backend load drops further to approximately 100 QPS because more servers means each individual server handles fewer concurrent users, and with fewer concurrent users per server the probability of multiple requests for the same key arriving at the same server simultaneously decreases, resulting in fewer coalesced requests overall",
      "Backend load increases to 500 QPS — coalescing bounds load to N application servers, and you just increased N from 200 to 500, potentially recreating the hot key problem at sufficient scale",
      "Backend load is unaffected because coalescing works at the cache layer, not the application layer"
    ],
    "correctIndex": 2,
    "explanation": "This is a subtle gotcha about coalescing's scaling properties. The article states coalescing reduces load to 'exactly N, where N is the number of application servers.' If you scale horizontally to 500 app servers, your coalesced backend load for a hot key grows to 500 QPS. At extreme horizontal scale (thousands of servers), coalescing alone might not be sufficient — you'd still need fanout or local caching. Coalescing bounds load linearly with infrastructure, not with traffic.",
    "interviewScript": "In your interview, say: 'Coalescing bounds load to N — the number of app servers, not the number of users. As we scale horizontally, N grows, and coalescing becomes less effective. At thousands of servers, we'd need to combine coalescing with key fanout or local in-process caches to keep backend load manageable.'",
    "proTip": "This is why production systems layer multiple strategies: coalescing for moderate hot keys, fanout for extreme ones, and local in-memory caches as the final defense."
  },
  {
    "id": "q27",
    "subtopic": "Cache Stampede",
    "style": "Failure analysis",
    "question": "Your homepage cache entry expires. You protect against stampede using a distributed lock: only one request rebuilds the cache while others wait. The rebuild involves a complex 10-table join that normally takes 3 seconds. During a traffic spike, the rebuild takes 15 seconds due to database load. What happens to the thousands of waiting requests?",
    "options": [
      "They efficiently wait and all get served once the rebuild completes — distributed locks handle this gracefully",
      "Most requests timeout waiting for the lock, resulting in a cascade of errors. If they retry, they create additional stampede pressure. The lock approach is fragile under load because rebuild time is unpredictable",
      "The lock automatically releases after 3 seconds, allowing a second request to start rebuilding in parallel",
      "Waiting requests are served stale data from a backup cache layer while the primary cache rebuild proceeds — the system maintains a shadow cache with the previous version of every entry, so when the primary entry expires and a rebuild lock is acquired, all other requests are transparently served from the shadow cache with the last known good value until the rebuild completes"
    ],
    "correctIndex": 1,
    "explanation": "The article warns that distributed locks have 'serious downsides: if the rebuild fails or takes too long, thousands of requests timeout waiting. You need complex timeout handling and fallback logic, making this approach fragile under load.' A 15-second rebuild during a traffic spike means thousands of user-facing requests hanging, hitting timeout thresholds, and potentially retrying — which creates more pressure on an already struggling database.",
    "interviewScript": "In your interview, say: 'Distributed locks for stampede protection are fragile because they convert the stampede problem into a queueing problem. If the rebuild is slow — which is exactly when stampedes occur — thousands of requests block. I'd prefer probabilistic early refresh, which spreads rebuild load over time and avoids the single-point-of-failure issue.'",
    "proTip": null
  },
  {
    "id": "q28",
    "subtopic": "Cache Stampede",
    "style": "Implementation-specific nuance",
    "question": "You implement probabilistic early refresh for a cache entry with a 60-minute TTL. At minute 50, each request has a 1% chance of triggering a background refresh. At minute 55, it increases to 5%. At minute 59, it's 20%. What is the key advantage of this approach over distributed locks?",
    "options": [
      "It guarantees the cache is always fresh — no user ever sees stale data because the probabilistic refresh triggers before the TTL boundary, ensuring the cached entry is replaced with a fresh copy before any staleness window opens",
      "It eliminates all database load from cache rebuilds by distributing the refresh responsibility across a peer-to-peer protocol where application servers share cached data with each other, avoiding the need to query the database entirely — the first server to refresh pushes the new value to all other servers via gossip",
      "It spreads cache rebuild requests across time rather than concentrating them at a single expiration moment, while most users continue getting served from the existing cache — no requests block waiting",
      "It uses significantly less memory than lock-based approaches because it doesn't need to store distributed lock state, lock holder information, or lock timeout metadata in Redis — the memory savings compound as the number of cached entries grows, making probabilistic refresh more memory-efficient at scale"
    ],
    "correctIndex": 2,
    "explanation": "The article explains: 'Instead of 100,000 requests hammering your database at minute 60, you spread those refreshes across the last 10-15 minutes. Most users still get cached data while a few unlucky ones trigger refreshes.' The critical distinction from locks: no user request blocks. Users either get cached data or trigger a background refresh (and still get the current cached data). This eliminates the timeout cascade problem entirely.",
    "interviewScript": "In your interview, say: 'Probabilistic early refresh avoids the all-or-nothing expiration cliff. Instead of 100K requests seeing a cache miss simultaneously at the TTL boundary, a few requests probabilistically refresh the entry in the background during the last minutes before expiration. No requests block, and most users are served from the existing cache throughout.'",
    "proTip": "The probability function should be tunable. Higher traffic items should start refreshing earlier (lower probability, longer window) while low-traffic items can refresh closer to expiration."
  },
  {
    "id": "q29",
    "subtopic": "Cache Stampede",
    "style": "Cross-subtopic bridge (Stampede × Hot Key)",
    "question": "You have a cache entry that's both a hot key (500K QPS) AND has an expensive rebuild (5 seconds). Neither probabilistic early refresh nor distributed locks are sufficient alone. What's the most robust combined strategy?",
    "options": [
      "Use distributed locks with a very long lock timeout (60 seconds) to ensure the cache rebuild always completes even under extreme database load — the longer timeout prevents premature lock release that would allow a second rebuild attempt to start while the first is still in progress, avoiding duplicate work",
      "Use background refresh processes that continuously update the entry before expiration, combined with cache key fanout to distribute the read load — this ensures the entry never expires and reads never overwhelm a single key",
      "Increase the TTL to 24 hours to minimize the frequency of stampedes — the longer the TTL, the fewer expiration events occur, and for a hot key the 24-hour staleness is acceptable because the underlying data changes slowly enough that day-old cached data is still useful",
      "Use probabilistic early refresh with a very high probability (50% starting 30 minutes before expiration) to ensure at least one server triggers a background refresh well before the TTL expires — the high probability guarantees multiple refresh attempts, providing redundancy in case any individual attempt fails or times out"
    ],
    "correctIndex": 1,
    "explanation": "For the most critical cached data, the article recommends background refresh: 'Background refresh processes continuously update these entries before expiration, ensuring they never go stale.' Combined with cache key fanout to handle the hot key problem, you get entries that are always fresh (no stampede possible) AND distributed reads (no single key bottleneck). Option C just delays the problem. Option D would create thousands of simultaneous rebuild attempts — essentially a slower-motion stampede.",
    "interviewScript": "In your interview, say: 'For data that's both hot and expensive to rebuild, I'd combine two strategies: background refresh ensures the entry never expires — a cron job or worker refreshes it on a schedule shorter than the TTL. Cache key fanout distributes the 500K QPS across multiple replica keys. Together, stampedes become impossible and no single key is overloaded.'",
    "proTip": "Background refresh is 'wasted work' for unpopular entries but essential insurance for your most critical ones. The cost of refreshing a few key entries every minute is trivial compared to an availability incident."
  },
  {
    "id": "q30",
    "subtopic": "Cache Versioning",
    "style": "Implementation-specific nuance",
    "question": "You implement cache versioning for event data. On every read, you first fetch the version from cache (e.g., 'event:123:version' → 'v42'), then construct the data key ('event:123:v42') and fetch the actual data. Compared to a simple cache-aside pattern with write-through invalidation, what's the measurable overhead?",
    "options": [
      "Two cache lookups per read instead of one — the version lookup adds ~0.5ms of additional latency per request",
      "10x more memory usage because every version creates a completely new copy of all related data",
      "Write latency doubles because the version must be updated in a distributed transaction",
      "No measurable overhead — the version lookup is free because it's served from the same cache"
    ],
    "correctIndex": 0,
    "explanation": "The article explicitly states this trade-off: 'You're making two cache lookups per request — one for the version number, another for the actual data — which adds some latency compared to a single cache hit.' This is the primary overhead of cache versioning. Each lookup is sub-millisecond to Redis, so the total overhead is small in absolute terms (~0.5ms) but measurable at high QPS. The benefit — eliminating race conditions and complex invalidation — typically justifies this cost.",
    "interviewScript": "In your interview, say: 'Cache versioning requires two cache lookups per read: one for the version, one for the versioned data. That's roughly double the cache latency — maybe an extra 0.5ms. For data where invalidation race conditions are dangerous, like event venue information, this overhead is a worthwhile trade for correctness.'",
    "proTip": "You can partially mitigate the double-lookup by pipelining both cache requests or by caching the version in the application's local memory with a very short TTL."
  },
  {
    "id": "q31",
    "subtopic": "Cache Versioning",
    "style": "Gotcha/trap question",
    "question": "Without cache versioning, you use simple cache-aside: on write, update DB then delete the cache key. Two requests arrive: Request A reads the old data from a read replica (replication lag), Request B writes new data. The sequence is: B writes DB → B deletes cache → A's stale read populates the cache. With cache versioning, why doesn't this race condition cause stale data to persist?",
    "options": [
      "Cache versioning prevents Request A from writing to the cache entirely — the versioning system detects that A's data is stale by comparing A's read timestamp against the current version, and rejects A's cache population attempt with a version conflict error",
      "Request A would populate cache key 'event:123:v42' with old data, but Request B already advanced the version to v43 — subsequent readers look up v43, making A's stale v42 entry unreachable and harmless",
      "The version number is stored in the database alongside the data row, so Request A's replica read returns the old version number and the old data, which are internally consistent with each other — the staleness is bounded to a single version and doesn't compound across multiple stale reads",
      "Cache versioning uses distributed locks behind the scenes to serialize Request A and Request B, preventing them from writing to the cache concurrently — the lock ensures that B's write completes and is visible before A's write begins, maintaining strict ordering of cache mutations"
    ],
    "correctIndex": 1,
    "explanation": "This is the core elegance of cache versioning. The article states: 'There are no race conditions because a late writer can't overwrite new data — the database forces a new version number.' Request A might still cache stale data, but it caches it under the OLD version key (v42). Since B already incremented the version to v43, all subsequent readers construct key 'event:123:v43' — they never see A's stale v42 entry. The stale data exists in cache but is unreachable, harmlessly expiring via TTL.",
    "interviewScript": "In your interview, say: 'Cache versioning sidesteps the race condition entirely. A stale read might populate event:123:v42 with old data, but the version pointer has already moved to v43. Readers construct keys from the current version, so they never find the stale v42 entry. It's not that stale data can't be cached — it's that stale data becomes unreachable.'",
    "proTip": "This is conceptually similar to how MVCC (Multi-Version Concurrency Control) works in databases — old versions exist but are invisible to new transactions."
  },
  {
    "id": "q32",
    "subtopic": "Cache Versioning",
    "style": "Cross-subtopic bridge (Versioning × CDN)",
    "question": "Cache versioning works well for single-entity caches. You also have CDN-cached search results and aggregated feed data. Why doesn't cache versioning solve invalidation for these computed caches?",
    "options": [
      "CDNs don't support versioned cache keys because CDN edge servers only understand URL-based caching with path and query string parameters — the version-prefixed key format (entity:id:v42) is a Redis-specific convention that doesn't translate to CDN cache key formats, so cache versioning is architecturally incompatible with CDN edge caching",
      "Computed data like search results and feeds depend on potentially thousands of entities — there's no single version number that captures 'search results for query X changed because product 47,231 was updated'",
      "Cache versioning is covered under distributed caching patents held by major cloud providers and cannot be legally used with third-party CDN providers without a licensing agreement, limiting its applicability to first-party caching infrastructure",
      "Computed caches don't have invalidation problems because they're regenerated from scratch on every request — search results and feeds are always computed fresh from the database, and the 'cache' is just a response buffer that's discarded after each request, so there's no stale data to invalidate"
    ],
    "correctIndex": 1,
    "explanation": "The article notes cache versioning 'really shines for single-entity caches like user profiles or product details, but it doesn't help much with computed data like search results or feeds where invalidation is inherently more complex.' Search results aggregate many entities — a version number on 'product:47231' doesn't tell you which cached search results contain that product. For these cases, you need alternative strategies like the deleted items cache or tagged invalidation.",
    "interviewScript": "In your interview, say: 'Cache versioning works for single-entity data because there's a clear 1:1 mapping between the entity's version and its cache key. Computed caches like search results aggregate thousands of entities — no single version captures the dependency graph. For those, I'd use tagged invalidation or the deleted items cache pattern.'",
    "proTip": null
  },
  {
    "id": "q33",
    "subtopic": "Deleted Items Cache",
    "style": "Scenario-based trade-offs",
    "question": "A post on your platform violates content policies and must be removed from all feeds immediately. Feeds are cached with a 5-minute TTL. Invalidating every cached feed containing the post across millions of users is infeasible in real-time. How does a deleted items cache solve this?",
    "options": [
      "It stores deleted post IDs in a small, fast cache. When serving any feed, you first check this cache and filter out matches before returning results — feeds are 'mostly correct' immediately without full invalidation",
      "It pre-deletes the post from all cached feeds using a background job, achieving full consistency within seconds",
      "It replaces the deleted post with a '[removed]' placeholder in all cached feeds simultaneously through a broadcast invalidation message to every cache node — this preserves the feed's pagination and ordering structure while immediately signaling to users that content was moderated, providing transparency about the content policy action",
      "It redirects all feed requests to the database until the cached feeds naturally expire and are rebuilt from the database's current state — this guarantees zero staleness during the expiration window but temporarily increases database load proportionally to the cache miss rate"
    ],
    "correctIndex": 0,
    "explanation": "The article describes this exact pattern: 'Maintain a cache of recently deleted post IDs. When serving feeds, you first check this small cache and filter out any matches. This lets you serve mostly-correct cached data immediately while taking time to properly invalidate the larger, more complex cached structures in the background.' The deleted items cache is small (just recent deletions) and fast to query, making it an efficient overlay that effectively removes content without expensive cache-wide invalidation.",
    "interviewScript": "In your interview, say: 'Instead of invalidating millions of feed caches, I'd maintain a small deleted items cache containing recently removed post IDs. On every feed read, I check this tiny cache and filter out deleted posts before returning results. The main feed caches remain intact and gradually refresh via normal TTL, while content policy is enforced immediately.'",
    "proTip": null
  },
  {
    "id": "q34",
    "subtopic": "Deleted Items Cache",
    "style": "Failure analysis",
    "question": "Your deleted items cache stores recently removed post IDs with a 24-hour TTL. The main feed caches have a 5-minute TTL. After 24 hours, a deleted post ID expires from the deleted items cache, but a stale feed cache entry somehow still references that post. What happens?",
    "options": [
      "The deleted post reappears in that user's feed — a 'resurrection' bug — until the feed cache naturally refreshes",
      "Nothing — the feed cache's 5-minute TTL guarantees all feed entries refresh within 5 minutes, long before the 24-hour deleted items TTL expires",
      "The system throws a runtime exception and crashes because the feed rendering code attempts to fetch the deleted post's content by ID and receives a null reference — without proper null handling in the feed rendering pipeline, this cascades into an unhandled exception that brings down the feed service",
      "The deleted items cache automatically extends its TTL to match the longest-lived cache in the system"
    ],
    "correctIndex": 1,
    "explanation": "The deleted items cache TTL (24 hours) vastly exceeds the feed cache TTL (5 minutes). Feed caches regenerate from the database every 5 minutes at most, and the database has the post permanently deleted. So within 5 minutes, all feed caches are rebuilt without the deleted post. The deleted items cache only needs to outlive the feed cache TTL — 24 hours provides enormous safety margin. Option A describes a real risk if the deleted items TTL were shorter than the feed cache TTL.",
    "interviewScript": "In your interview, say: 'The deleted items cache TTL must exceed the maximum lifetime of any cache it overlays. With 5-minute feed TTLs and 24-hour deleted items TTL, there's an enormous safety margin. Within 5 minutes, all feed caches rebuild from the database which has the deletion applied. The deleted items cache is just a bridge to cover that window.'",
    "proTip": "Always set deleted items cache TTL to at least 2-3x the maximum TTL of any cache it protects against. This provides safety margin for edge cases like clock skew and delayed cache refreshes."
  }
];

export const SUBTOPICS_ORDER = [
  "Read/Write Ratio & The Problem",
  "Indexing",
  "Vertical Scaling / Hardware Upgrades",
  "Denormalization & Materialized Views",
  "Read Replicas & Leader-Follower Replication",
  "Database Sharding",
  "Application-Level Caching",
  "Cache Invalidation Strategies",
  "CDN & Edge Caching",
  "Hot Key Problem & Request Coalescing",
  "Cache Stampede",
  "Cache Versioning",
  "Deleted Items Cache"
];

export default {
  questions: QUESTIONS,
  subtopicsOrder: SUBTOPICS_ORDER
};
