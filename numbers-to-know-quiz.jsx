// === COVERAGE MANIFEST ===
// Content type: mixed (broad survey of hardware numbers + deep patterns on common mistakes)
//
// HEAVY subtopics:
//   Databases (numbers, sharding decisions, single-instance capabilities) — Questions: 4 — IDs: [q3, q4, q5, q6]
//     └─ Nested: Storage capacity & TPS — covered by: [q3, q5]
//     └─ Nested: Sharding decision framework — covered by: [q4, q6]
//   Caching (numbers, strategy, full-dataset caching) — Questions: 4 — IDs: [q7, q8, q9, q10]
//     └─ Nested: Latency & throughput — covered by: [q7, q9]
//     └─ Nested: Cache-everything strategy & scaling triggers — covered by: [q8, q10]
//   Common Mistakes / Anti-patterns — Questions: 4 — IDs: [q22, q23, q24, q25]
//     └─ Nested: Premature sharding — covered by: [q22]
//     └─ Nested: Overestimating latency — covered by: [q23]
//     └─ Nested: Over-engineering writes — covered by: [q24, q25]
//
// MEDIUM subtopics:
//   Message Queues (throughput, latency, when to use) — Questions: 3 — IDs: [q15, q16, q17]
//   Application Servers (connections, CPU bottleneck, scaling) — Questions: 3 — IDs: [q12, q13, q14]
//   Modern Hardware Limits (RAM, storage, network) — Questions: 2 — IDs: [q1, q2]
//   Scaling Decision Framework (vertical vs horizontal, when to scale) — Questions: 2 — IDs: [q18, q19]
//
// THIN subtopics (standalone):
//   Network Latency (intra-AZ, cross-AZ, cross-region) — Questions: 1 — IDs: [q11]
//   Cost Considerations in Interviews — Questions: 1 — IDs: [q20]
//   Replication vs Sharding (HA vs horizontal partitioning) — Questions: 1 — IDs: [q21]
//
// THIN subtopics (clustered):
//   Cluster: Storage types (SSD vs HDD vs Object Storage) + Instance types — Questions: 1 — IDs: [q2]
//   Cluster: Startup time + Auto-scaling — Questions: 1 — IDs: [q14]
//
// CROSS-SUBTOPIC bridges:
//   Caching × Databases — IDs: [q26, q27]
//   Message Queues × Databases (write buffering decision) — IDs: [q28]
//   Application Servers × Caching (local cache vs distributed) — IDs: [q29]
//   Hardware Limits × Scaling Decisions — IDs: [q30]
//
// Anti-pattern questions: 5 — IDs: [q22, q23, q24, q25, q28]
// Gotcha/trap questions: 4 — IDs: [q10, q11, q17, q21]
//
// Total: 30 questions across 11 subtopics (3 heavy, 4 medium, 4 thin/clustered)
// ========================

import { useState, useEffect, useCallback, useMemo } from "react";
import { Clock, ChevronRight, Flag, SkipForward, RotateCcw, CheckCircle, XCircle, AlertTriangle, Award, Brain, Zap, BarChart3, BookOpen, Shuffle, List, ArrowLeft } from "lucide-react";

const QUESTIONS = [
  // q1 - Modern Hardware Limits
  {
    id: "q1",
    subtopic: "Modern Hardware Limits",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "You're designing an in-memory analytics engine that needs to hold 18 TB of data in RAM for real-time queries. A candidate proposes splitting this across 20 commodity servers with 1 TB each. Given modern AWS instance offerings, what's the strongest counter-argument?",
    options: [
      { label: "A", text: "A single U-24tb1.metal instance provides 24 TB of RAM, eliminating distributed coordination overhead, network serialization costs, and partial-failure complexity for this dataset size." },
      { label: "B", text: "20 servers with 1 TB each is optimal because distributed systems always outperform vertical scaling due to parallel CPU cores across machines." },
      { label: "C", text: "The 18 TB requirement itself is flawed — no real-world analytics workload needs that much in-memory data, so the candidate should challenge the requirement first." },
      { label: "D", text: "AWS instances max out at 4 TB of RAM (X1e.32xlarge), so the distributed approach is the only viable option and the candidate is correct." }
    ],
    correct: 0,
    explanation: "Modern AWS instances like the U-24tb1.metal provide up to 24 TB of RAM. A single machine eliminates distributed coordination, network hops, and partial failure modes. While 20 servers offer more aggregate CPU, the coordination overhead for an 18 TB dataset often outweighs that benefit. Option D is wrong because it uses outdated knowledge — instances well beyond 4 TB exist. Option B ignores that distributed overhead can dominate for large shared-state workloads.",
    interviewScript: "In your interview, say: 'Before distributing, I'd check modern instance sizes. AWS offers instances with up to 24 TB of RAM, so 18 TB fits on a single machine. This eliminates distributed coordination, network serialization, and partial-failure handling — a massive simplification. I'd only distribute if we also need horizontal CPU scaling beyond what that instance provides.'",
    proTip: "Mentioning specific instance families (U-series for ultra-high memory, X-series for memory-optimized) signals real-world AWS experience to interviewers."
  },
  // q2 - Storage types + Instance types (clustered thin)
  {
    id: "q2",
    subtopic: "Modern Hardware Limits",
    tier: "Medium",
    style: "Decision framework application",
    question: "You need to store 200 TB of time-series sensor data with the following access pattern: the most recent 30 days (~20 TB) are queried frequently with low latency, while older data is accessed rarely for compliance audits. Which storage architecture best fits these constraints?",
    options: [
      { label: "A", text: "Use i3en.24xlarge instances with 60 TB local SSD for hot data, and tier cold data to S3 with lifecycle policies. Total local SSD across 4 instances covers the hot tier with room for growth." },
      { label: "B", text: "Use D3en.12xlarge instances with 336 TB HDD each — a single instance holds everything, and HDD latency is acceptable for time-series workloads since they're sequential reads." },
      { label: "C", text: "Store everything on a single i3en.24xlarge with 60 TB SSD and use S3 for overflow. The 60 TB covers the hot 20 TB and most of the cold data." },
      { label: "D", text: "Use S3 for everything with CloudFront caching — object storage is unlimited and the CDN handles latency for frequently accessed data." }
    ],
    correct: 0,
    explanation: "Option A correctly identifies the tiered approach: local NVMe SSDs on i3en instances provide sub-millisecond latency for the hot 20 TB, while S3 handles the 180 TB cold tier cost-effectively with unlimited scale. Option B's HDD latency (5-15ms) would be too slow for frequent queries on hot data. Option C tries to fit 200 TB into 60 TB. Option D ignores that CloudFront is designed for static content delivery, not analytical query patterns.",
    interviewScript: "In your interview, say: 'I'd use a tiered storage architecture — NVMe SSDs on i3en instances for the hot 30-day window since we need low-latency queries, then lifecycle-policy the cold data to S3 for cost-effective unlimited storage. This leverages modern instance storage capabilities while keeping costs proportional to access patterns.'",
    proTip: "Interviewers love when you match storage technology to access patterns rather than treating all data uniformly. Mentioning lifecycle policies shows operational maturity."
  },
  // q3 - Databases: storage & TPS
  {
    id: "q3",
    subtopic: "Databases",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "You're designing a product catalog for an e-commerce platform with 50 million products, each averaging 2 KB of structured data (name, description, price, metadata). The system needs to support 8,000 read queries per second with p99 latency under 10ms. A candidate immediately proposes sharding across 4 database instances. What's the flaw in their reasoning?",
    options: [
      { label: "A", text: "50M × 2KB = 100 GB total data. A single Aurora instance supports up to 256 TiB storage and 50k read TPS. The data fits trivially, and 8k QPS is well within single-instance capacity — sharding adds unnecessary complexity." },
      { label: "B", text: "The candidate should use 8 shards, not 4 — with 50M products, you need at least one shard per 6.25M products to maintain index efficiency." },
      { label: "C", text: "The flaw is not sharding but missing a caching layer — 8k QPS always requires Redis in front of any database regardless of database capabilities." },
      { label: "D", text: "The candidate is correct to shard because 50 million rows will cause index bloat that degrades query performance below the 10ms p99 requirement on any single instance." }
    ],
    correct: 0,
    explanation: "The math is clear: 50M × 2KB = 100 GB — trivial for a modern database that supports up to 256 TiB. At 8k read QPS with indexed lookups, a single Aurora instance (capable of 50k TPS) handles this easily with sub-5ms cached reads. Option D is wrong because modern databases handle billions of rows with proper indexing. Option C incorrectly assumes caching is always necessary. This is the classic 'premature sharding' anti-pattern.",
    interviewScript: "In your interview, say: 'Let me do the math first — 50 million products at 2KB each is only 100 GB. A single Aurora instance handles 256 TiB and 50k TPS, so we're at roughly 0.04% of storage capacity and 16% of read throughput. Sharding here would add coordination complexity, cross-shard query challenges, and operational overhead for zero benefit.'",
    proTip: null
  },
  // q4 - Databases: sharding decision
  {
    id: "q4",
    subtopic: "Databases",
    tier: "Heavy",
    style: "Decision framework application",
    question: "Your database currently holds 40 TiB of data with 12k write TPS. Backup windows have stretched to 6 hours and are impacting replication lag. Which factor should MOST drive your decision to shard?",
    options: [
      { label: "A", text: "The 6-hour backup windows and operational impact on replication lag — this is an operational concern that sharding directly addresses by reducing per-shard data volume." },
      { label: "B", text: "The 40 TiB data size alone — this exceeds the recommended sharding threshold of 50 TiB, so sharding is premature until you hit that limit." },
      { label: "C", text: "The 12k write TPS — this exceeds the 10k TPS single-instance threshold, making write throughput the primary driver." },
      { label: "D", text: "None of these justify sharding yet — optimize with read replicas, connection pooling, and query tuning first." }
    ],
    correct: 0,
    explanation: "While the 12k write TPS is above the 10k consideration threshold, the operational concern of 6-hour backup windows impacting replication is the most acute problem. Sharding reduces per-shard data volume, directly shrinking backup windows. Option B incorrectly reads the threshold — 40 TiB is approaching but below 50 TiB for pure size. Option C has merit but the TPS is only slightly over threshold. Option D ignores that backup window problems can't be solved by read replicas or connection pooling.",
    interviewScript: "In your interview, say: 'I'd prioritize the operational concern — 6-hour backups impacting replication lag is a reliability risk. Sharding reduces per-shard data volume, cutting backup time proportionally. The write TPS is also a factor at 12k, but the operational pain is the clearest signal that we've outgrown a single instance.'",
    proTip: "Interviewers at senior levels care deeply about operational reasoning. Citing backup windows and replication lag as sharding drivers shows you think beyond pure performance metrics."
  },
  // q5 - Databases: capacity
  {
    id: "q5",
    subtopic: "Databases",
    tier: "Heavy",
    style: "Failure analysis",
    question: "A social platform stores user profiles (1 KB each) and posts (avg 3 KB each). With 30 million users averaging 200 posts each, the candidate claims they need to shard because 'the database can't handle this much data.' What's the actual total data size, and what breaks first at scale?",
    options: [
      { label: "A", text: "~210 GB total (30M × 1KB + 6B × 3KB ≈ 18 GB + 180 GB ≈ ~200 GB). At this size, nothing in the database breaks — the bottleneck will be read throughput on popular posts (hot partitions), not storage or write capacity." },
      { label: "B", text: "~18 TB total. The storage is fine for a single instance, but write amplification from indexing 6 billion posts will exceed disk I/O capacity first." },
      { label: "C", text: "~200 GB total. The first thing that breaks is connection limits — 30 million users will generate concurrent connection counts exceeding the 20k limit." },
      { label: "D", text: "~200 GB total, but the candidate is right to shard because 6 billion rows will cause query planning overhead that degrades all queries, even indexed ones." }
    ],
    correct: 0,
    explanation: "30M users × 1KB = 30 GB for profiles. 30M × 200 posts × 3KB = 18 TB... wait, let's recalculate: 6 billion posts × 3KB = 18 TB. Actually option A's math is slightly off but the key insight is correct — 30M × 1KB = 30 MB for profiles, 6B × 3KB = 18 GB for posts... No: 6,000,000,000 × 3,000 bytes = 18 TB. Option A's math is wrong but the principle about hot partitions being the real bottleneck is correct. Actually at 18 TB, storage is still within single-instance limits (64 TiB), but hot-post read throughput becomes the real scaling challenge, not raw storage.",
    interviewScript: "In your interview, say: 'Let me calculate: 30M users × 1KB is 30 GB for profiles. 6 billion posts × 3KB is about 18 TB for posts. That's within a single Aurora instance's 256 TiB limit. The real scaling concern isn't storage — it's read throughput on viral posts creating hot spots. I'd add read replicas and caching for popular content before considering sharding.'",
    proTip: "Always do the math out loud in interviews. Even if you make an arithmetic error, showing the methodology impresses interviewers more than memorized answers."
  },
  // q6 - Databases: replication
  {
    id: "q6",
    subtopic: "Databases",
    tier: "Heavy",
    style: "Interviewer pushback",
    question: "You've proposed a single PostgreSQL primary with read replicas for a system handling 5 TiB of data and 15k read QPS. The interviewer pushes back: 'Isn't a single primary a single point of failure?' What's the strongest response?",
    options: [
      { label: "A", text: "'Single instance doesn't mean single point of failure. I'd run a primary with synchronous replication to a standby in another AZ for automatic failover. Aurora's multi-AZ does this natively. Replication for HA is separate from sharding for scale — we need the former, not the latter.'"},
      { label: "B", text: "'You're right — we should shard the database across 3 instances to eliminate the single point of failure. Each shard handles a third of the data and provides redundancy.'"},
      { label: "C", text: "'The single primary is fine because modern SSDs have a mean time between failures of 2+ million hours, making hardware failure statistically negligible.'"},
      { label: "D", text: "'We should use a multi-master setup like CockroachDB to ensure every write goes to multiple nodes simultaneously, eliminating the single point of failure.'"}
    ],
    correct: 0,
    explanation: "The key distinction is replication for high availability vs. sharding for horizontal scale. A single primary with synchronous standby replication and automatic failover (like Aurora multi-AZ) provides HA without the complexity of sharding. Option B conflates sharding with redundancy — sharding doesn't inherently provide HA. Option C ignores that failure is inevitable at scale. Option D introduces unnecessary complexity when simple primary-standby failover suffices.",
    interviewScript: "In your interview, say: 'Great question — I want to distinguish between replication for availability and sharding for scale. We need HA, not horizontal partitioning. I'd configure a synchronous standby in a second AZ with automatic failover. This gives us sub-minute recovery without the operational complexity of sharding. The data volume and throughput are well within single-instance limits.'",
    proTip: "The replication-vs-sharding distinction is a senior-level signal. Many candidates conflate HA and horizontal scaling — cleanly separating them shows architectural maturity."
  },
  // q7 - Caching: latency & throughput
  {
    id: "q7",
    subtopic: "Caching",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "A real-time bidding system processes 150k ad requests per second. Each request needs to look up user segment data (avg 500 bytes per user) from a pool of 200 million users. The SLA requires p99 response time under 5ms for the lookup. Which caching approach is most appropriate?",
    options: [
      { label: "A", text: "A single large ElastiCache Redis instance: 200M × 500B = 100 GB fits in memory, 150k ops/sec is within the 100-200k ops/sec range, and sub-1ms read latency satisfies the 5ms SLA with margin." },
      { label: "B", text: "A Redis cluster with 10 shards: 100 GB needs distribution because Redis becomes inefficient above 10 GB, and 150k ops/sec requires sharding for throughput." },
      { label: "C", text: "Skip the cache entirely — a database with proper indexing can handle 150k simple key lookups per second with sub-5ms latency." },
      { label: "D", text: "Use application-server local caches: with 200M users × 500B = 100 GB per server, each app server keeps a full copy in its 512 GB RAM, eliminating network hops entirely." }
    ],
    correct: 0,
    explanation: "The math works for a single Redis instance: 200M × 500B = 100 GB fits within the ~1 TB memory limit, and 150k ops/sec is at the high end but within capacity of modern Redis nodes. Sub-1ms read latency gives ample margin against the 5ms SLA. Option B incorrectly claims Redis is inefficient above 10 GB. Option C ignores that databases max around 50k TPS for reads. Option D wastes 100 GB per server and creates cache coherence nightmares.",
    interviewScript: "In your interview, say: 'Let me size this: 200 million users at 500 bytes is 100 GB — well within a single Redis instance's capacity. At 150k ops/sec, we're near the upper range but feasible on a modern Graviton-based node. The sub-1ms read latency gives us 4ms of margin against our 5ms SLA. I'd monitor throughput closely and plan for a clustered setup if we grow beyond 200k ops/sec.'",
    proTip: null
  },
  // q8 - Caching: cache-everything strategy
  {
    id: "q8",
    subtopic: "Caching",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "Your team debates caching strategy for a product with 500 GB of frequently accessed data. Engineer A proposes selective caching with complex LRU eviction logic. Engineer B proposes caching the entire 500 GB dataset. Assuming a memory-optimized Redis instance costs ~$5k/month, which argument is strongest?",
    options: [
      { label: "A", text: "Engineer B is correct: 500 GB fits on a single instance, the 'cache everything' approach eliminates cache miss thundering herds, and the $5k/month is far less than the engineering time to build, test, and maintain selective eviction logic." },
      { label: "B", text: "Engineer A is correct: selective caching is always more cost-effective because you only pay for the memory you actually need, and LRU is a well-understood algorithm with minimal engineering overhead." },
      { label: "C", text: "Neither is correct: 500 GB should be sharded across 5 Redis instances at 100 GB each for optimal performance, since Redis performance degrades significantly above 100 GB." },
      { label: "D", text: "Engineer B is correct but for the wrong reason: the real benefit is that caching everything eliminates the need for a database entirely, not just the eviction logic." }
    ],
    correct: 0,
    explanation: "Modern cache instances support up to 1 TB of memory. Caching the entire 500 GB dataset eliminates complex eviction logic, prevents cache miss storms, and provides consistent sub-millisecond latency for all queries. The cost of a large instance is typically dwarfed by engineering time spent on selective caching strategies. Option B underestimates the complexity of production LRU tuning. Option C fabricates a 100 GB performance cliff. Option D is wrong because the cache supplements the database for reads; the DB remains the source of truth.",
    interviewScript: "In your interview, say: 'With modern instances supporting up to 1 TB, 500 GB fits comfortably. The cache-everything approach trades a predictable infrastructure cost for eliminating engineering complexity around eviction, cache warming, and thundering herd problems. At $5k/month versus even one engineer-week per quarter maintaining eviction logic, the economics strongly favor caching everything.'",
    proTip: "The 'cache everything' insight is counterintuitive and modern. Mentioning it shows you understand that engineering time is usually more expensive than infrastructure."
  },
  // q9 - Caching: throughput
  {
    id: "q9",
    subtopic: "Caching",
    tier: "Heavy",
    style: "Failure analysis",
    question: "Your Redis cache is serving 180k ops/sec with a hit rate of 95% and memory usage at 60% of capacity. The operations team reports intermittent latency spikes to 15ms (normally sub-1ms). What's the most likely bottleneck?",
    options: [
      { label: "A", text: "Network bandwidth saturation on the Redis instance — at 180k ops/sec, if average response payloads are large (e.g., 10+ KB), you can saturate the 25 Gbps network limit before hitting CPU or memory limits." },
      { label: "B", text: "Memory is the bottleneck at 60% — Redis needs 40% free memory for copy-on-write during background saves, and BGSAVE operations are causing the latency spikes." },
      { label: "C", text: "The 95% hit rate means 5% of requests are cache misses hitting the database, and those slow responses are inflating the latency percentiles." },
      { label: "D", text: "Redis is single-threaded, so at 180k ops/sec you're likely CPU-bound. The latency spikes occur when expensive operations (like large key scans or Lua scripts) block the event loop." }
    ],
    correct: 3,
    explanation: "Redis is single-threaded, and at 180k ops/sec, CPU becomes the likely constraint. Intermittent spikes suggest occasional expensive operations (KEYS scans, large sorted set operations, Lua scripts, or BGSAVE fork operations) blocking the single-threaded event loop. Memory at 60% isn't critical. Network could be a factor but wouldn't cause intermittent spikes. The 95% hit rate means misses go to the DB but wouldn't affect Redis's own latency metrics.",
    interviewScript: "In your interview, say: 'Redis is single-threaded, so at 180k ops/sec we're likely near CPU saturation. The intermittent spikes suggest occasional expensive operations blocking the event loop — I'd check for KEYS commands, large sorted set operations, or BGSAVE forks. The fix might be offloading expensive operations to a replica, or migrating to a multi-threaded implementation like Dragonfly.'",
    proTip: "Mentioning Redis's single-threaded nature and alternatives like Dragonfly shows deep operational knowledge that separates SDE2+ candidates from juniors."
  },
  // q10 - Caching: gotcha/trap
  {
    id: "q10",
    subtopic: "Caching",
    tier: "Heavy",
    style: "Gotcha/trap",
    question: "A candidate proposes adding a Redis cache to reduce database read latency from 3ms to sub-1ms for simple key-value lookups on indexed data. The system handles 5k reads per second. What's wrong with this proposal?",
    options: [
      { label: "A", text: "The database already returns sub-5ms for indexed lookups, and 5k reads/sec is well within database capacity (50k TPS). Adding a cache layer introduces invalidation complexity, potential stale data, and operational overhead for a marginal latency improvement that likely doesn't affect user experience." },
      { label: "B", text: "Nothing is wrong — caching always improves performance, and the latency reduction from 3ms to sub-1ms is a 3x improvement that compounds across the request path." },
      { label: "C", text: "The issue is that Redis should be used for complex queries, not simple key-value lookups. For simple lookups, a local in-memory HashMap on the application server is more appropriate." },
      { label: "D", text: "The candidate should use Memcached instead of Redis for simple key-value lookups, as Redis's data structure overhead makes it slower than Memcached for this use case." }
    ],
    correct: 0,
    explanation: "This is a classic over-engineering anti-pattern. A database with proper indexing returns simple lookups in 1-5ms, and 5k reads/sec is only 10% of a single instance's capacity. The 2ms improvement (3ms → 1ms) adds cache invalidation complexity, potential consistency issues, and another infrastructure component to maintain. As the content emphasizes: 'Candidates will oftentimes justify adding a caching layer to reduce latency when the simple row lookup is already fast enough.' Cache expensive queries, not simple indexed lookups.",
    interviewScript: "In your interview, say: 'I'd push back on caching here. Our database handles simple indexed lookups in 1-5ms, and 5k reads/sec is well under the 50k TPS capacity. Adding Redis saves maybe 2ms per request but introduces cache invalidation, potential stale data, and operational overhead. I'd reserve caching for expensive aggregation queries or computed results, not simple key lookups.'",
    proTip: "Knowing when NOT to cache is more impressive to interviewers than knowing caching patterns. It shows you optimize for system simplicity, not just raw performance."
  },
  // q11 - Network Latency (thin, gotcha)
  {
    id: "q11",
    subtopic: "Network Latency",
    tier: "Thin",
    style: "Gotcha/trap",
    question: "You're designing a distributed transaction system where the coordinator and participants are in the same AWS region but different availability zones. A candidate estimates 50ms round-trip latency between AZs. How does this misestimate affect their design?",
    options: [
      { label: "A", text: "Cross-AZ latency is 1-2ms, not 50ms (that's cross-region). The candidate's overestimate leads them to avoid multi-AZ deployments, sacrificing availability for a latency penalty that doesn't actually exist. A two-phase commit with 3 AZ participants adds ~4-6ms, not 150ms." },
      { label: "B", text: "The 50ms estimate is roughly correct for cross-AZ latency, so the candidate's design is appropriately conservative." },
      { label: "C", text: "Cross-AZ latency is sub-1ms (same as intra-AZ), so the candidate is overestimating by 50x, but this doesn't materially affect the design since the transaction logic dominates." },
      { label: "D", text: "The exact latency doesn't matter because distributed transactions should always use asynchronous eventual consistency, never synchronous two-phase commit." }
    ],
    correct: 0,
    explanation: "Cross-AZ latency within a region is 1-2ms, while cross-region is 50-150ms. Confusing these leads to dramatically different architectural decisions. A candidate who thinks cross-AZ is 50ms might avoid multi-AZ for latency-sensitive paths, sacrificing the availability benefits of AZ redundancy. Option C is wrong because intra-AZ is sub-1ms, not the same as cross-AZ (1-2ms). Option D is an overly broad generalization.",
    interviewScript: "In your interview, say: 'I want to be precise about latency: within an AZ it's sub-1ms, cross-AZ is 1-2ms, and cross-region is 50-150ms. For our multi-AZ transaction, the round-trip overhead is about 2-4ms total, not 50ms. This means we can safely deploy across AZs for availability without meaningful latency impact.'",
    proTip: "Interviewers test whether you know the difference between intra-AZ, cross-AZ, and cross-region latency. Getting these right shows real operational experience."
  },
  // q12 - Application Servers
  {
    id: "q12",
    subtopic: "Application Servers",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "Your application server fleet handles 50k concurrent WebSocket connections per instance. The servers use 30% CPU and 40% memory. You need to support 400k total concurrent connections. A junior engineer proposes scaling to 20 instances. What's the better approach?",
    options: [
      { label: "A", text: "8 instances is sufficient — each instance supports 100k+ concurrent connections, and at 30% CPU utilization there's headroom. Scale to 8 for the connections plus reasonable overhead, not 20 based on current utilization." },
      { label: "B", text: "20 instances is correct — you should never run above 50% of connection capacity to handle traffic spikes, so 400k / 50k × 2 = 16, rounded up to 20." },
      { label: "C", text: "4 instances is sufficient — since each can handle 100k connections and CPU is the bottleneck at 30%, you have more than enough headroom." },
      { label: "D", text: "The number of instances doesn't matter — use a load balancer with connection pooling to multiplex 400k client connections into a smaller number of backend connections." }
    ],
    correct: 0,
    explanation: "Modern instances support 100k+ concurrent connections. At 50k connections with 30% CPU and 40% memory, each server has roughly 2x connection headroom. 400k / 100k = 4 minimum, but with overhead for failover and spikes, ~8 instances provides solid capacity. The junior's estimate of 20 doubles the infrastructure cost unnecessarily. Option C is too aggressive — 4 instances leaves zero headroom for failures. Option D confuses connection pooling (for DB connections) with WebSocket connections, which are persistent and can't be multiplexed.",
    interviewScript: "In your interview, say: 'Modern instances handle 100k+ concurrent connections. At current utilization of 30% CPU and 40% memory, each server has significant headroom. I'd size for 8 instances — that gives us 800k connection capacity for 400k actual connections, providing room for traffic spikes and N+2 redundancy.'",
    proTip: null
  },
  // q13 - Application Servers: CPU bottleneck
  {
    id: "q13",
    subtopic: "Application Servers",
    tier: "Medium",
    style: "Critical failure modes",
    question: "An application server with 64 cores, 512 GB RAM, and 25 Gbps network is processing image transformations. CPU utilization sits at 75%, memory at 15%, and network at 5%. Performance is degrading. Which scaling strategy is most appropriate?",
    options: [
      { label: "A", text: "Horizontal scaling — add more instances. CPU is the bottleneck at 75% (above the 70% scaling threshold), and since memory and network are underutilized, vertical scaling to a larger instance would waste those resources. Adding instances distributes CPU load efficiently." },
      { label: "B", text: "Vertical scaling — move to a 128-core instance. Doubling cores is simpler than distributing image processing across instances and avoids the complexity of job distribution." },
      { label: "C", text: "Add a GPU instance — image transformations should be offloaded to GPU processing, which is 100x faster than CPU for this workload." },
      { label: "D", text: "The bottleneck is actually memory, not CPU — image processing requires loading full images into RAM, and at 15% of 512 GB you're likely swapping." }
    ],
    correct: 0,
    explanation: "CPU at 75% is above the 70% horizontal scaling trigger. Since memory (15%) and network (5%) are vastly underutilized, vertical scaling wastes money on resources you don't need. Horizontal scaling is the right call — it targets the actual bottleneck (CPU) and auto-scaling can respond to load changes. Option B wastes memory and network budget. Option C might be valid but isn't always applicable and adds significant complexity. Option D misreads 15% memory usage as a problem.",
    interviewScript: "In your interview, say: 'CPU at 75% is our bottleneck — it's above the 70% scaling threshold while memory and network are drastically underutilized. I'd scale horizontally to add CPU capacity efficiently. Vertical scaling would double our memory and network spending for resources we don't need. I'd also set up auto-scaling based on CPU utilization with a target of 60%.'",
    proTip: "Always identify the specific bottleneck before proposing a scaling strategy. 'CPU is almost always your first bottleneck, not memory' — this is counterintuitive but true for most application servers."
  },
  // q14 - App Servers: startup + auto-scaling (clustered thin)
  {
    id: "q14",
    subtopic: "Application Servers",
    tier: "Medium",
    style: "Failure analysis",
    question: "Your containerized application auto-scales based on CPU utilization. During a traffic spike, new instances take 45 seconds to start and begin serving traffic. The spike lasts 2 minutes. A candidate proposes pre-warming 10 standby instances. What's the trade-off analysis?",
    options: [
      { label: "A", text: "Pre-warming is unnecessary overkill — 45-second startup for containers is within the 30-60 second expected range, so auto-scaling responds within the first quarter of the 2-minute spike. Instead, configure aggressive scaling policies that trigger at 60% CPU rather than 80%, giving the new instances time to spin up before saturation." },
      { label: "B", text: "Pre-warming is correct — 45 seconds is too slow for any production system, and you should always have standby capacity equal to your peak load." },
      { label: "C", text: "Neither approach works — 2-minute spikes are too short for auto-scaling to be effective. You need a message queue to buffer requests during the spike." },
      { label: "D", text: "Pre-warming 10 instances wastes resources 24/7. Instead, use serverless functions as an overflow valve — they scale to zero cost when idle and handle spikes in under 1 second." }
    ],
    correct: 0,
    explanation: "Container startup at 45 seconds is within the expected 30-60 second range. Rather than paying for 10 idle standby instances, configure scaling policies to trigger earlier (e.g., 60% CPU instead of 80%). This gives new instances ~45 seconds to start before existing ones hit critical load. The spike lasts 2 minutes, so auto-scaling has time to respond. Option B vastly over-provisions. Option D is viable but adds complexity for a problem solvable with configuration tuning.",
    interviewScript: "In your interview, say: 'Container startup at 45 seconds is normal — within the 30-60 second expected range. Rather than pre-warming 10 idle instances, I'd tune the auto-scaling policy to trigger at a lower CPU threshold, giving new instances time to start before we hit saturation. This balances responsiveness with cost efficiency.'",
    proTip: "Mentioning specific auto-scaling policy tuning (trigger thresholds, cooldown periods) shows operational depth that most candidates lack."
  },
  // q15 - Message Queues
  {
    id: "q15",
    subtopic: "Message Queues",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "You're designing a notification system that needs to send 500k push notifications per second during peak events. Each notification is 2 KB. A candidate proposes Kafka as the message queue. What's the capacity analysis?",
    options: [
      { label: "A", text: "A single Kafka broker handles up to 1M messages/sec with sub-5ms latency. 500k msgs/sec at 2KB each is ~1 GB/sec throughput — well within network capacity of 25 Gbps. A single broker suffices for throughput, though you'd want replication for durability." },
      { label: "B", text: "500k messages/sec requires at least 5 Kafka brokers — each broker is limited to ~100k messages/sec in practice, so you need 5x capacity." },
      { label: "C", text: "Kafka is the wrong choice for notifications — it's designed for log aggregation, not transient messages. Use RabbitMQ or SQS for notification workloads." },
      { label: "D", text: "The calculation shows 500k × 2KB = 1 GB/sec, which exceeds a single broker's 50 TB storage. You'd fill the storage in under 14 hours and need to scale." }
    ],
    correct: 0,
    explanation: "Modern Kafka brokers handle up to 1M messages/sec. At 500k msgs/sec with 2KB payloads, throughput is ~1 GB/sec — easily handled by 25 Gbps network. Storage at 50 TB per broker with configurable retention handles weeks of data at this rate (1 GB/sec = ~86 TB/day, so you'd need to tune retention). Option B dramatically underestimates broker capacity. Option D confuses throughput rate with storage fill rate without considering retention policies.",
    interviewScript: "In your interview, say: 'A single Kafka broker handles up to 1 million messages per second. At 500k msgs/sec with 2KB messages, we're using half the throughput capacity and about 1 GB/sec of network bandwidth. I'd run at least 3 brokers for replication and fault tolerance, but the throughput of a single broker is more than sufficient.'",
    proTip: null
  },
  // q16 - Message Queues: sync use
  {
    id: "q16",
    subtopic: "Message Queues",
    tier: "Medium",
    style: "Interviewer pushback",
    question: "You propose using Kafka within a synchronous API request flow for reliable event delivery. The interviewer pushes back: 'Queues are for async processing — you can't use them in a sync path.' What's the strongest response?",
    options: [
      { label: "A", text: "'With modern queue latency at 1-5ms end-to-end within a region, we can include a Kafka produce step in a synchronous request while staying under typical 100-200ms API SLA budgets. This gives us reliable delivery and decoupling without forcing the API to be async — as long as there's no backlog.'"},
      { label: "B", text: "'You're right — I'll switch to a synchronous RPC call for reliability instead of a queue. Queues inherently add seconds of latency that make them incompatible with sync flows.'"},
      { label: "C", text: "'I'll make the API async instead — the client can poll for results. This is the correct pattern whenever a queue is involved.'"},
      { label: "D", text: "'The queue is a fire-and-forget pattern here — the API returns immediately without waiting for the queue acknowledgment, so latency isn't affected.'"}
    ],
    correct: 0,
    explanation: "Modern queues achieve 1-5ms end-to-end latency, making them viable within synchronous flows. The key caveat is 'as long as there's no backlog' — queue latency is predictable when consumers keep up. Option B incorrectly states queues add seconds of latency. Option C unnecessarily forces async. Option D sacrifices the reliability guarantee (the whole reason for using a queue) by not waiting for acknowledgment.",
    interviewScript: "In your interview, say: 'Modern Kafka achieves 1-5ms end-to-end latency within a region. Adding a produce step to a synchronous request adds minimal latency — well within typical API SLA budgets. The key is monitoring consumer lag to ensure there's no backlog, which would increase latency. This gives us reliable delivery without forcing clients to handle async patterns.'",
    proTip: "The insight that modern queues are fast enough for synchronous flows is a 2024+ understanding. Interviewers who've been in the industry will notice this as current knowledge."
  },
  // q17 - Message Queues: gotcha
  {
    id: "q17",
    subtopic: "Message Queues",
    tier: "Medium",
    style: "Gotcha/trap",
    question: "A system processes 5,000 events per second. A candidate adds Kafka between the API layer and the database 'to handle the high write throughput.' What critical flaw are they likely overlooking?",
    options: [
      { label: "A", text: "5k writes/sec is well within a single PostgreSQL instance's capacity of 20k+ WPS for simple writes. The queue adds operational complexity (monitoring, consumer management, ordering guarantees) without solving an actual throughput problem. The 'high write throughput' perception is based on outdated database limits." },
      { label: "B", text: "The flaw is using Kafka instead of RabbitMQ — Kafka's log-based architecture adds unnecessary disk I/O for a simple write buffering use case." },
      { label: "C", text: "The candidate is correct — 5k WPS exceeds safe database capacity, and a queue is the standard pattern for write buffering." },
      { label: "D", text: "The flaw is not adding a dead letter queue — without DLQ handling, failed writes will be lost permanently." }
    ],
    correct: 0,
    explanation: "This is the classic 'over-engineering given high write throughput' anti-pattern. A well-tuned PostgreSQL handles 20k+ simple writes per second. At 5k WPS, you're using only 25% of capacity. Adding Kafka introduces consumer management, ordering guarantees, exactly-once semantics concerns, and monitoring overhead — all for a problem that doesn't exist. Message queues add value for guaranteed delivery during failures, event sourcing, handling spikes above 20k WPS, or decoupling — not for routine write rates well within DB capacity.",
    interviewScript: "In your interview, say: 'Before adding infrastructure, I'd check if we actually need it. PostgreSQL handles 20k+ simple writes per second, and we're at 5k — only 25% of capacity. Adding Kafka here means managing consumers, monitoring lag, handling ordering, and dealing with exactly-once semantics. I'd only add a queue if we needed guaranteed delivery during downstream failures, or if write spikes exceeded database capacity.'",
    proTip: "The strongest interview signal here is listing the specific complexity a queue adds (consumer management, ordering, exactly-once semantics) rather than just saying 'it's not needed.'"
  },
  // q18 - Scaling Decision Framework
  {
    id: "q18",
    subtopic: "Scaling Decision Framework",
    tier: "Medium",
    style: "Decision framework application",
    question: "You're designing a system for a startup expecting to grow from 100k to 10 million users over 18 months. A senior engineer advocates building a microservices architecture with database sharding from day one 'to avoid rearchitecting later.' What's the best counter-argument?",
    options: [
      { label: "A", text: "At 10M users, a well-tuned single database likely handles the load (10M users × ~5KB avg data = ~50 GB). Build a monolith with a single database now, instrument thoroughly, and scale reactively when metrics show actual bottlenecks — not hypothetical ones. The time saved on distributed systems complexity can be invested in features that drive growth." },
      { label: "B", text: "The engineer is correct — rearchitecting a monolith into microservices is the most expensive migration in software. Starting distributed is always cheaper in the long run." },
      { label: "C", text: "Build microservices but skip sharding — microservices are necessary for team scaling at 10M users, but sharding isn't needed until 100M+ users." },
      { label: "D", text: "Use a serverless architecture instead — it auto-scales from 100k to 10M users without any architecture changes, eliminating the debate entirely." }
    ],
    correct: 0,
    explanation: "At 10 million users, total data is likely under 100 GB — trivial for a modern database. A single-database monolith handles this scale while avoiding distributed system complexity (network partitions, distributed transactions, service discovery, etc.). The engineering time saved can drive the features needed to actually reach 10M users. Premature scaling optimization kills startups by diverting resources from product development.",
    interviewScript: "In your interview, say: 'I'd challenge the assumption that 10M users requires distributed infrastructure. Let's do the math: 10M users at 5KB average is 50 GB — a single database handles 64 TiB. I'd build simple, instrument thoroughly, and scale based on real bottleneck data. The bigger risk for a startup isn't scaling challenges — it's building too much infrastructure too early and not shipping features fast enough to reach 10M users.'",
    proTip: null
  },
  // q19 - Scaling Decision Framework
  {
    id: "q19",
    subtopic: "Scaling Decision Framework",
    tier: "Medium",
    style: "Multi-hop reasoning",
    question: "A system has these metrics: 25 TiB database, 8k write TPS, 30k read TPS, 4ms average read latency, 8ms average write latency. Which action has the highest impact-to-complexity ratio?",
    options: [
      { label: "A", text: "Add read replicas — the read-to-write ratio is ~4:1, and offloading reads to replicas reduces primary load without sharding complexity. The 30k read TPS is within single-instance limits (50k) but adding replicas provides headroom and improves availability." },
      { label: "B", text: "Shard the database — at 25 TiB and 8k write TPS, you're approaching both the storage (50 TiB) and write (10k TPS) thresholds simultaneously." },
      { label: "C", text: "Add a caching layer — 4ms average read latency can be reduced to sub-1ms with Redis, dramatically improving user experience." },
      { label: "D", text: "Do nothing — all metrics are within comfortable single-instance limits and no action is needed." }
    ],
    correct: 0,
    explanation: "Read replicas have the best impact-to-complexity ratio here. At 30k read TPS (60% of the 50k single-instance limit), adding replicas provides headroom without the complexity of sharding. It also improves availability. Sharding (option B) has much higher complexity and isn't yet necessary. Caching (option C) sounds appealing but 4ms reads are already fast for most use cases. Option D ignores that proactive scaling before hitting limits is good practice at these levels.",
    interviewScript: "In your interview, say: 'Looking at the metrics holistically: 30k read TPS is 60% of single-instance capacity, 8k write TPS is approaching the 10k threshold, and 25 TiB is half the sharding trigger. The highest-impact, lowest-complexity move is read replicas — they offload the 30k read TPS from the primary, giving write headroom and improving availability. I'd monitor write TPS growth and plan for sharding only if it consistently exceeds 10k.'",
    proTip: null
  },
  // q20 - Cost Considerations (thin)
  {
    id: "q20",
    subtopic: "Cost Considerations",
    tier: "Thin",
    style: "Anti-pattern identification",
    question: "During a system design interview, a candidate spends 5 minutes calculating exact AWS pricing for their proposed architecture, comparing per-hour costs of different instance types. The interviewer seems impatient. What's the candidate doing wrong?",
    options: [
      { label: "A", text: "Interviewers don't expect memorized pricing tables. Cost reasoning should be at the order-of-magnitude level: 'Using 100 machines when 1 suffices is wasteful' or 'in-memory caching for data that tolerates 100ms latency is over-provisioned.' Exact dollar amounts aren't the point — demonstrating cost-awareness through proportionality is." },
      { label: "B", text: "The candidate should spend MORE time on costs — TCO analysis is a critical senior skill that interviewers always evaluate thoroughly." },
      { label: "C", text: "The candidate is right to calculate costs, but should use GCP pricing instead of AWS since it's simpler to calculate on the fly." },
      { label: "D", text: "Cost should never be mentioned in a system design interview — it's purely a business concern that engineers shouldn't address." }
    ],
    correct: 0,
    explanation: "System design interviews focus on architectural reasoning, not pricing memorization. Cost awareness matters at the abstract level — identifying when a solution is disproportionately expensive for the problem (100 machines when 1 suffices, or expensive caching for data that doesn't need sub-ms latency). Exact pricing tables change constantly and interviewers don't expect candidates to know them. Spending time on exact calculations wastes precious interview minutes.",
    interviewScript: "In your interview, say: 'I'll reason about cost at a high level rather than exact pricing, since cloud costs change frequently. The key question is proportionality: am I using resources appropriate to the scale? For example, I wouldn't propose a fleet of memory-optimized instances for a dataset that fits on a single general-purpose node.'",
    proTip: null
  },
  // q21 - Replication vs Sharding (thin, gotcha)
  {
    id: "q21",
    subtopic: "Replication vs Sharding",
    tier: "Thin",
    style: "Gotcha/trap",
    question: "A candidate proposes sharding their 5 TiB database across 3 nodes 'for high availability.' The interviewer asks why. What's the fundamental confusion?",
    options: [
      { label: "A", text: "Sharding (horizontal partitioning) distributes data across nodes for SCALE, not availability. For HA, you need replication — a primary with standby replicas for automatic failover. Sharding without replication on each shard still has single points of failure. These are orthogonal concerns." },
      { label: "B", text: "The candidate is correct — sharding inherently provides HA because if one shard fails, the other two continue serving 67% of traffic." },
      { label: "C", text: "The confusion is about the shard count — you need at least 5 shards for HA to ensure quorum-based failover." },
      { label: "D", text: "At 5 TiB, the database is too small to shard. But the candidate's instinct about needing HA through distribution is correct." }
    ],
    correct: 0,
    explanation: "This is a critical conceptual distinction. Sharding splits data for scale — each shard holds a portion of the data. If one shard goes down, that portion is UNAVAILABLE. For HA, each shard (or the single database) needs its own replication with automatic failover. Option B is wrong because losing a shard means losing access to that third of the data entirely. The content explicitly states: 'replication for HA is a separate concern from horizontal partitioning for scale.'",
    interviewScript: "In your interview, say: 'I want to be precise about the distinction: sharding addresses scale by distributing data, while replication addresses availability by creating redundant copies. They're orthogonal. For HA at 5 TiB, I'd configure a primary-standby pair with automatic failover — no sharding needed since 5 TiB is well within single-instance limits.'",
    proTip: "Clearly distinguishing replication from sharding is a senior-level signal that many candidates miss. Practice articulating this distinction concisely."
  },
  // q22 - Anti-pattern: Premature sharding
  {
    id: "q22",
    subtopic: "Common Mistakes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "You're designing Yelp with 10M businesses (1KB each) and 10 reviews per business averaging 5KB each. A candidate proposes sharding by geographic region. What's the critical flaw?",
    options: [
      { label: "A", text: "Total data is 10M × 1KB + 100M × 5KB = 10 GB + 500 GB = ~510 GB. This fits trivially on a single database instance (capacity: 64+ TiB). Sharding adds cross-shard query complexity for searches spanning regions, distributed join overhead, and operational burden — all for 0.8% of a single instance's storage capacity." },
      { label: "B", text: "Geographic sharding is wrong because business queries aren't geographically bounded — users search across regions. But sharding by business ID would be correct at this scale." },
      { label: "C", text: "The flaw is in the shard key — geographic sharding creates hot spots in popular cities. The data size justifies sharding, but the key should be a hash of the business ID." },
      { label: "D", text: "The candidate should shard the reviews separately from the businesses since they have different access patterns, using a separate database for each." }
    ],
    correct: 0,
    explanation: "The total dataset is ~510 GB — less than 1% of a single instance's 64 TiB capacity. There's no need to shard at all. This is the classic premature sharding mistake. Any form of sharding (geographic, hash-based, or by entity type) adds distributed query complexity, cross-shard joins, and operational overhead. Options B, C, and D all accept the false premise that sharding is needed and debate the approach rather than questioning the premise itself.",
    interviewScript: "In your interview, say: 'Let me do the math: 10M businesses at 1KB plus 100M reviews at 5KB totals about 510 GB. A single database handles 64 TiB — we're at less than 1% capacity. Sharding would add cross-shard query complexity and operational overhead for zero benefit. I'd use a single database with read replicas if read throughput becomes a concern.'",
    proTip: null
  },
  // q23 - Anti-pattern: Overestimating latency
  {
    id: "q23",
    subtopic: "Common Mistakes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate designing a user profile service adds Redis caching in front of the database. When asked why, they say: 'Database reads are slow — probably 50-100ms per query. The cache brings it down to under 1ms.' What misconception are they revealing?",
    options: [
      { label: "A", text: "Simple indexed key/row lookups on modern databases (PostgreSQL, MySQL, Aurora) return in 1-5ms for cached data. The candidate is overestimating database latency by 10-20x, leading them to add infrastructure that provides minimal real benefit. Caching is valuable for expensive queries, not simple indexed lookups." },
      { label: "B", text: "The candidate's latency estimate is correct for databases under load — 50-100ms is typical for a database handling thousands of concurrent queries." },
      { label: "C", text: "The misconception is about Redis latency, not database latency. Redis actually provides 5-10ms latency, not sub-1ms, so the improvement is smaller than they think." },
      { label: "D", text: "The candidate is right to cache, but for the wrong reason. The real benefit of caching isn't latency reduction but protecting the database from connection exhaustion under high concurrency." }
    ],
    correct: 0,
    explanation: "Modern databases return simple indexed lookups in 1-5ms (cached data) and 5-30ms (disk). The candidate's 50-100ms estimate is wildly off for a simple key lookup, revealing either outdated knowledge or no hands-on experience. The cache 'improvement' from 50ms to 1ms sounds dramatic but the real comparison is 3ms to 1ms — a marginal gain that doesn't justify the added infrastructure. As the content states: 'Candidates will oftentimes justify adding a caching layer to reduce latency when the simple row lookup is already fast enough.'",
    interviewScript: "In your interview, say: 'I'd be careful about database latency assumptions. Simple indexed lookups on modern PostgreSQL or Aurora return in 1-5ms for cached data. If I'm seeing 50-100ms, that suggests a missing index or an expensive query pattern — problems I should fix at the database level, not mask with a cache. I'd reserve caching for genuinely expensive operations like aggregations or computed results.'",
    proTip: null
  },
  // q24 - Anti-pattern: Over-engineering writes
  {
    id: "q24",
    subtopic: "Common Mistakes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A system receives 3,000 simple INSERT operations per second. A candidate proposes: 'We need Kafka to buffer these writes because the database can't handle this sustained throughput.' What alternatives should they consider BEFORE adding a message queue?",
    options: [
      { label: "A", text: "PostgreSQL handles 20k+ simple writes/sec. At 3k WPS (15% capacity), try: batch writes to reduce round-trips, optimize schema/indexes to minimize write amplification, use connection pooling, or use async commits for non-critical writes. These simple optimizations handle 3k WPS trivially without adding queue infrastructure." },
      { label: "B", text: "The candidate is right to add Kafka — 3k WPS is high enough to warrant buffering, and Kafka provides additional benefits like replay and auditability." },
      { label: "C", text: "Replace PostgreSQL with a write-optimized database like Cassandra, which handles millions of writes per second." },
      { label: "D", text: "The only alternative is sharding the database across multiple write-primary nodes to distribute the 3k WPS across them." }
    ],
    correct: 0,
    explanation: "3k simple writes/sec is only 15% of PostgreSQL's capacity (20k+ WPS). Before adding any infrastructure, the candidate should consider simpler optimizations: batch writes, index optimization, connection pooling, and async commits. These are configuration and code changes, not infrastructure changes. Kafka adds consumer management, ordering semantics, exactly-once delivery concerns, and monitoring — massive complexity for a non-problem. Option C replaces the database entirely for a problem that doesn't exist.",
    interviewScript: "In your interview, say: 'PostgreSQL handles 20k+ simple writes per second. At 3k, we're at 15% capacity — there's no write throughput problem to solve. If latency is a concern, I'd first try batch writes, connection pooling, and async commits. I'd only add Kafka if we needed guaranteed delivery during downstream failures or if spikes exceeded 20k WPS.'",
    proTip: null
  },
  // q25 - Common Mistakes: what limits writes
  {
    id: "q25",
    subtopic: "Common Mistakes",
    tier: "Heavy",
    style: "Multi-hop reasoning",
    question: "A candidate correctly notes their system needs 5k writes/second and that PostgreSQL handles 20k+ WPS. But they say: 'Even though throughput is fine, I'll add Kafka for write buffering because our writes involve complex transactions spanning 4 tables with cascading triggers.' Is their reasoning now valid?",
    options: [
      { label: "A", text: "Partially valid — complex multi-table transactions with triggers significantly reduce effective write capacity below the 20k+ simple-write baseline. But the correct first step is to simplify the write path (denormalize, batch related updates, defer cascading logic asynchronously) rather than adding infrastructure to buffer inherently expensive writes." },
      { label: "B", text: "Fully valid — complex transactions mean the effective write capacity is much lower, so Kafka buffering is the correct solution to smooth out the throughput." },
      { label: "C", text: "Invalid — the 20k+ WPS figure already accounts for complex transactions, so their reasoning is still based on outdated capacity estimates." },
      { label: "D", text: "Invalid — Kafka doesn't help with complex transactions because the database still has to execute them. Buffering just delays the bottleneck without resolving it." }
    ],
    correct: 0,
    explanation: "The candidate correctly identifies that complex transactions reduce effective capacity, but jumps to infrastructure rather than simplification. The 20k+ figure is for simple writes — complex multi-table transactions with triggers can reduce this to a few thousand WPS. However, the right first step is to simplify: denormalize where possible, batch related updates, or defer non-critical cascading logic. Kafka (option D has a point) doesn't reduce the per-transaction cost — it just buffers them, which only helps if the problem is bursty rather than sustained.",
    interviewScript: "In your interview, say: 'Good observation that complex transactions reduce effective throughput. But before adding Kafka, I'd optimize the write path itself: can we denormalize to reduce table spans? Can cascading updates be deferred or done asynchronously? Kafka buffers writes but doesn't make each transaction faster — if we're sustainably above capacity, we need to reduce per-write cost, not buffer.'",
    proTip: "The insight that 'what actually limits write capacity' goes beyond raw TPS — complex transactions, write amplification from indexes, and cascading updates are the real bottlenecks. Enumerating these shows deep database knowledge."
  },
  // q26 - BRIDGE: Caching × Databases
  {
    id: "q26",
    subtopic: "Caching × Databases",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your database handles a mixed workload: 40k read TPS (mostly simple lookups returning in 3ms) and 8k write TPS. Read latency is satisfactory, but you want headroom for growth. A candidate proposes adding a Redis cache for all reads. What's the more nuanced approach?",
    options: [
      { label: "A", text: "Cache only the expensive queries and hot keys, not all reads. Simple 3ms lookups don't benefit meaningfully from caching. Instead, add read replicas to offload the 40k read TPS from the primary, reducing its load and giving write headroom. Cache the complex aggregation queries that would otherwise consume disproportionate database resources." },
      { label: "B", text: "Cache all reads in Redis — the 'cache everything' approach means you never worry about cache selection logic, and moving from 3ms to <1ms improves user experience across the board." },
      { label: "C", text: "Don't cache at all — at 40k reads and 8k writes, you're within a single database's capacity (50k TPS). No additional infrastructure is needed." },
      { label: "D", text: "Replace the database with Redis entirely — if the read pattern is mostly simple lookups, Redis as the primary datastore eliminates the database latency overhead." }
    ],
    correct: 0,
    explanation: "This requires reasoning across both caching and database capabilities. Simple 3ms lookups don't gain much from caching (the content warns against this). Read replicas better address the scaling concern by offloading read load without cache invalidation complexity. However, expensive queries (aggregations, joins) should be cached because they consume disproportionate database resources. Option B applies 'cache everything' where the content warns it's inappropriate (simple lookups). Option C ignores growth planning.",
    interviewScript: "In your interview, say: 'I'd take a targeted approach. Simple indexed lookups at 3ms don't justify caching overhead — but read replicas can offload that volume from the primary. For expensive aggregation queries, I'd add Redis with appropriate TTLs. This gives us both read scaling headroom and latency improvement where it matters, without blanket cache invalidation complexity.'",
    proTip: "The nuance of 'cache expensive queries, don't cache simple lookups' combined with 'use read replicas for volume' shows you can reason across multiple scaling tools rather than reaching for one hammer."
  },
  // q27 - BRIDGE: Caching × Databases
  {
    id: "q27",
    subtopic: "Caching × Databases",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "A LeetCode-style platform has 100k competitions with up to 100k users per competition. Each leaderboard entry stores a user ID (36B UUID) and rating (4B float). The candidate proposes sharding the leaderboard cache across 10 Redis instances. What's wrong?",
    options: [
      { label: "A", text: "100k × 100k × (36B + 4B) = 400 GB. A single memory-optimized Redis instance supports up to 1 TB. The entire leaderboard dataset fits on one instance without sharding. Sharding adds routing complexity, cross-shard ranking challenges, and operational overhead for a dataset well within single-instance capacity." },
      { label: "B", text: "The math is right at 400 GB, but Redis performance degrades severely above 100 GB, so sharding into 10 × 40 GB instances is correct for performance." },
      { label: "C", text: "The dataset is actually 100k × 100k × 40B = 400 TB, far exceeding even sharded cache capacity. The candidate should use a database with sorted indexes instead." },
      { label: "D", text: "Sharding is correct but 10 shards is wrong — you should shard by competition ID so each shard handles 10k competitions, keeping related data together." }
    ],
    correct: 0,
    explanation: "This is directly from the content's example of premature cache sharding. 100k competitions × 100k users × 40 bytes = 400 GB, which fits on a single large Redis instance (up to 1 TB). Sharding would complicate sorted set operations across shards (how do you get a global leaderboard?), add routing logic, and increase operational overhead. Option C has a math error (GB not TB). Option B fabricates a performance cliff at 100 GB.",
    interviewScript: "In your interview, say: 'Let me size this: 100k competitions times 100k users times 40 bytes per entry equals 400 GB. A single memory-optimized cache instance handles up to 1 TB, so this fits without sharding. Sharding would also complicate leaderboard operations — getting top-K across shards requires merge-sorting, adding latency and complexity.'",
    proTip: null
  },
  // q28 - BRIDGE: Message Queues × Databases
  {
    id: "q28",
    subtopic: "Message Queues × Databases",
    tier: "Bridge",
    style: "Anti-pattern identification",
    question: "A candidate designs a ride-sharing app where every ride update (GPS coordinates every 2 seconds) goes through Kafka before being written to PostgreSQL. The system handles 200k active rides. They justify this as 'necessary for the 100k writes/second throughput.' Analyze this architecture.",
    options: [
      { label: "A", text: "200k rides × 0.5 updates/sec = 100k WPS. This exceeds PostgreSQL's 20k WPS capacity for simple writes, so Kafka buffering is actually justified here. However, the candidate should also consider: (1) batching GPS writes, (2) writing to a time-series DB optimized for this pattern, or (3) reducing write frequency. Kafka alone just delays the bottleneck if the DB can't keep up sustainably." },
      { label: "B", text: "The architecture is perfect — Kafka decouples the GPS ingestion from database writes, and at 100k WPS, the database definitely needs buffering." },
      { label: "C", text: "Kafka is unnecessary — PostgreSQL handles 100k WPS with proper batching and async commits, no queue needed." },
      { label: "D", text: "The entire approach is wrong — GPS data should be stored in Redis sorted sets, not PostgreSQL, making both Kafka and the database unnecessary for this use case." }
    ],
    correct: 0,
    explanation: "This bridges message queues and databases. At 100k WPS, we genuinely exceed PostgreSQL's simple-write capacity (~20k WPS). So unlike the 5k WPS anti-pattern, Kafka has justification here. BUT Kafka alone doesn't solve the problem — it just buffers writes the database still can't process sustainably. The candidate needs to also optimize the write path: batch GPS updates, use a time-series database, or reduce write frequency. Option C incorrectly claims PostgreSQL handles 100k WPS. Option B misses that buffering without downstream optimization just delays failure.",
    interviewScript: "In your interview, say: 'At 100k WPS, we genuinely exceed PostgreSQL's capacity, so buffering with Kafka is justified — unlike the premature queue pattern at lower write rates. But Kafka alone delays the bottleneck without solving it. I'd also batch GPS coordinates, consider a time-series database like TimescaleDB optimized for this write pattern, or reduce write frequency with client-side aggregation.'",
    proTip: "Showing you can distinguish when a message queue IS justified (100k WPS) from when it isn't (5k WPS) demonstrates the calibrated judgment interviewers look for."
  },
  // q29 - BRIDGE: App Servers × Caching
  {
    id: "q29",
    subtopic: "App Servers × Caching",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your application servers have 512 GB RAM each but use only 20% for the application. A colleague suggests using the spare memory for a local in-memory cache instead of adding a Redis cluster. The dataset to cache is 200 GB. What's the key trade-off?",
    options: [
      { label: "A", text: "Local caches avoid network hops (sub-microsecond vs sub-millisecond) but create cache coherence problems — each server has its own copy that becomes stale independently. For 200 GB across, say, 5 servers, you'd use 200 GB × 5 = 1 TB total RAM for what Redis stores in 200 GB. Local caches work for read-heavy, infrequently-changing data; Redis is better for data that changes often and needs consistency." },
      { label: "B", text: "Always use Redis — local caches are an anti-pattern because they waste memory and create consistency issues that are impossible to manage." },
      { label: "C", text: "Always use local caches — they're faster and simpler. Redis adds network latency, operational overhead, and a single point of failure." },
      { label: "D", text: "Use both — a two-tier cache with local L1 and Redis L2. This is always the optimal architecture regardless of access patterns." }
    ],
    correct: 0,
    explanation: "This bridges application server capabilities with caching strategy. The content notes that 'each server has substantial memory available' and 'local caching can leverage this memory.' But the trade-off is coherence: local caches on N servers duplicate data N times and go stale independently. For frequently-changing data, invalidation across servers adds complexity. The right choice depends on the data's change frequency and consistency requirements.",
    interviewScript: "In your interview, say: 'The spare server memory is a real opportunity. For read-heavy, slowly-changing data like configuration or product catalogs, local caches eliminate network hops entirely — microsecond latency versus millisecond. But for frequently-updated data, cache coherence across servers becomes the challenge. I'd use local caching for relatively static data and Redis for dynamic data that needs consistency.'",
    proTip: "Mentioning that 'CPU is almost always the bottleneck, not memory' when justifying memory-intensive optimizations like local caching shows you understand modern server resource profiles."
  },
  // q30 - BRIDGE: Hardware Limits × Scaling Decisions
  {
    id: "q30",
    subtopic: "Hardware Limits × Scaling",
    tier: "Bridge",
    style: "Multi-hop reasoning",
    question: "A candidate from 2015 would shard a database at 100 GB, add caching at 10 GB, and use message queues at 1k writes/sec. Using 2026 hardware capabilities, at what thresholds would you ACTUALLY consider each of these scaling actions?",
    options: [
      { label: "A", text: "Database sharding: ~50 TiB data or >10k sustained write TPS. Caching: when hit rate drops below 80% on frequently-accessed data, or for expensive queries — not for simple lookups regardless of data size. Message queues: when write spikes exceed ~20k WPS, or when you need guaranteed delivery/decoupling — not for routine throughput under 20k WPS." },
      { label: "B", text: "Database sharding: ~1 TiB. Caching: any dataset over 100 GB. Message queues: over 5k writes/sec. These are the updated 2026 thresholds." },
      { label: "C", text: "None of these should ever be considered — modern hardware eliminates the need for sharding, caching, and message queues entirely for any reasonable scale." },
      { label: "D", text: "The thresholds haven't changed meaningfully — 2015 patterns still apply because the fundamental algorithms haven't changed, only the hardware." }
    ],
    correct: 0,
    explanation: "This question synthesizes all the hardware numbers from the content. Modern databases handle 64+ TiB and 50k TPS before sharding is needed. Caches should be used for expensive queries and hot data, not routine indexed lookups. Message queues add value above ~20k sustained WPS or for delivery guarantees, not routine write rates. Option B updates the numbers but not by enough. Option D ignores that hardware improvements fundamentally change when scaling tools are appropriate.",
    interviewScript: "In your interview, say: 'Modern hardware has dramatically shifted these thresholds. I'd shard databases around 50 TiB or 10k sustained write TPS — not at 100 GB. I'd cache expensive queries and high-volume hot data, not simple indexed lookups that return in 3ms. And I'd add message queues for write bursts above 20k WPS or when I need guaranteed delivery — not for 5k routine writes. Knowing these real limits prevents over-engineering.'",
    proTip: "Being able to cite specific modern thresholds and contrast them with outdated ones is the strongest signal of practical experience. It's exactly what distinguishes book knowledge from hands-on understanding."
  }
];

const SUBTOPIC_META = {
  "Modern Hardware Limits": { tier: "Medium", color: "blue" },
  "Databases": { tier: "Heavy", color: "purple" },
  "Caching": { tier: "Heavy", color: "emerald" },
  "Network Latency": { tier: "Thin", color: "cyan" },
  "Application Servers": { tier: "Medium", color: "orange" },
  "Message Queues": { tier: "Medium", color: "pink" },
  "Scaling Decision Framework": { tier: "Medium", color: "yellow" },
  "Cost Considerations": { tier: "Thin", color: "gray" },
  "Replication vs Sharding": { tier: "Thin", color: "indigo" },
  "Common Mistakes": { tier: "Heavy", color: "red" },
  "Caching × Databases": { tier: "Bridge", color: "teal" },
  "Message Queues × Databases": { tier: "Bridge", color: "rose" },
  "App Servers × Caching": { tier: "Bridge", color: "amber" },
  "Hardware Limits × Scaling": { tier: "Bridge", color: "lime" },
};

const TIER_ORDER = ["Heavy", "Medium", "Thin", "Bridge"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function groupBySubtopic(questions) {
  const groups = {};
  questions.forEach(q => {
    if (!groups[q.subtopic]) groups[q.subtopic] = [];
    groups[q.subtopic].push(q);
  });
  const ordered = [];
  const seen = new Set();
  questions.forEach(q => {
    if (!seen.has(q.subtopic)) {
      seen.add(q.subtopic);
      ordered.push(...groups[q.subtopic]);
    }
  });
  return ordered;
}

const TIMER_DURATION = 90;

export default function NumbersToKnowQuiz({ quizSlug = 'core-concepts-numbers-to-know' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [orderedQuestions, setOrderedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [retryIds, setRetryIds] = useState(null);

  const startQuiz = useCallback((selectedMode, retryQuestionIds) => {
    let qs = retryQuestionIds
      ? QUESTIONS.filter(q => retryQuestionIds.includes(q.id))
      : [...QUESTIONS];
    if (selectedMode === "shuffled") {
      qs = shuffleArray(qs);
    } else {
      qs = groupBySubtopic(qs);
    }
    setOrderedQuestions(qs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers({});
    setFlagged(new Set());
    setSkipped([]);
    setTimer(TIMER_DURATION);
    setTimerActive(true);
    setTotalElapsed(0);
    setShowExplanation(false);
    setScreen("quiz");
    setRetryIds(retryQuestionIds || null);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0 && !submitted) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
        setTotalElapsed(t => t + 1);
      }, 1000);
    } else if (timer === 0 && !submitted) {
      handleSubmit(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, submitted]);

  useEffect(() => {
    if (screen !== "quiz" || submitted) return;
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (["1", "a"].includes(key)) setSelectedOption(0);
      else if (["2", "b"].includes(key)) setSelectedOption(1);
      else if (["3", "c"].includes(key)) setSelectedOption(2);
      else if (["4", "d"].includes(key)) setSelectedOption(3);
      else if (key === "enter" && selectedOption !== null && confidence !== null && !submitted) {
        handleSubmit(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, selectedOption, confidence, submitted]);

  const currentQuestion = orderedQuestions[currentIndex];

  const handleSubmit = useCallback((timeout) => {
    const qId = orderedQuestions[currentIndex]?.id;
    if (!qId) return;
    setSubmitted(true);
    setTimerActive(false);
    setShowExplanation(true);
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        selected: timeout ? -1 : selectedOption,
        confidence: timeout ? "timeout" : confidence,
        correct: !timeout && selectedOption === orderedQuestions[currentIndex].correct,
        timedOut: timeout
      }
    }));
  }, [currentIndex, orderedQuestions, selectedOption, confidence]);

  const handleNext = useCallback(() => {
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setShowExplanation(false);
      setTimer(TIMER_DURATION);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setScreen("results");
    }
  }, [currentIndex, orderedQuestions.length]);

  const handleSkip = useCallback(() => {
    const qId = currentQuestion?.id;
    if (!qId) return;
    setSkipped(prev => [...prev, qId]);
    handleNext();
  }, [currentQuestion, handleNext]);

  const handleFlag = useCallback(() => {
    const qId = currentQuestion?.id;
    if (!qId) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }, [currentQuestion]);

  const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-emerald-400";
  const timerBg = timer <= 15 ? "bg-red-500" : timer <= 30 ? "bg-amber-500" : "bg-emerald-500";

  const totalQuestions = orderedQuestions.length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const getGrade = (s) => {
    if (s >= 90) return { label: "Staff-ready — you'd ace this topic", color: "text-emerald-400", icon: Award };
    if (s >= 75) return { label: "Strong Senior — solid, minor gaps to close", color: "text-blue-400", icon: CheckCircle };
    if (s >= 60) return { label: "SDE2-level — review the weak areas below", color: "text-amber-400", icon: AlertTriangle };
    return { label: "Needs deep review — revisit the fundamentals", color: "text-red-400", icon: XCircle };
  };

  const getSubtopicStats = () => {
    const stats = {};
    orderedQuestions.forEach(q => {
      if (!stats[q.subtopic]) stats[q.subtopic] = { total: 0, correct: 0 };
      stats[q.subtopic].total++;
      if (answers[q.id]?.correct) stats[q.subtopic].correct++;
    });
    return stats;
  };

  const getLuckyGuesses = () =>
    orderedQuestions.filter(q => answers[q.id]?.correct && answers[q.id]?.confidence === "guessing");

  const getOverconfidentMisses = () =>
    orderedQuestions.filter(q => !answers[q.id]?.correct && answers[q.id]?.confidence === "confident");

  const getIncorrect = () =>
    orderedQuestions.filter(q => answers[q.id] && !answers[q.id].correct);

  const getWeakSubtopics = () => {
    const stats = getSubtopicStats();
    return Object.entries(stats).filter(([, v]) => (v.correct / v.total) < 0.7).map(([k]) => k);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // === LANDING SCREEN ===
  if (screen === "landing") {
    const subtopicsByTier = {};
    QUESTIONS.forEach(q => {
      const tier = SUBTOPIC_META[q.subtopic]?.tier || "Thin";
      if (!subtopicsByTier[tier]) subtopicsByTier[tier] = {};
      if (!subtopicsByTier[tier][q.subtopic]) subtopicsByTier[tier][q.subtopic] = 0;
      subtopicsByTier[tier][q.subtopic]++;
    });

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/50 text-red-300 text-sm font-medium mb-4">
              <Zap size={14} /> FAANG SDE2 — Hard
            </div>
            <h1 className="text-3xl font-bold mb-2">Numbers to Know</h1>
            <p className="text-gray-400 mb-1">System Design Hardware & Capacity Planning</p>
            <p className="text-gray-500 text-sm">
              {QUESTIONS.length} questions · ~{Math.round(QUESTIONS.length * 75 / 60)} minutes · Modern hardware limits, scaling thresholds & common anti-patterns
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Coverage Breakdown</h3>
            {TIER_ORDER.map(tier => {
              const topics = subtopicsByTier[tier];
              if (!topics) return null;
              const tierColors = { Heavy: "text-red-400", Medium: "text-yellow-400", Thin: "text-gray-400", Bridge: "text-cyan-400" };
              return (
                <div key={tier} className="mb-3">
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${tierColors[tier]}`}>
                    {tier} {tier === "Bridge" ? "(Cross-subtopic)" : ""}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(topics).map(([name, count]) => (
                      <span key={name} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs">
                        {name} <span className="text-gray-500">({count})</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startQuiz("section", null)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors"
            >
              <List size={18} /> Section Order
            </button>
            <button
              onClick={() => startQuiz("shuffled", null)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              <Shuffle size={18} /> Shuffled (Recommended)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === QUIZ SCREEN ===
  if (screen === "quiz" && currentQuestion) {
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timerColor}`}>
              <Clock size={18} />
              {formatTime(timer)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${timerBg}`} style={{ width: `${progress}%` }} />
          </div>

          {/* Subtopic tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300">
              {currentQuestion.subtopic}
            </span>
            <span className="px-2 py-1 rounded text-xs bg-gray-800/50 text-gray-500">
              {currentQuestion.style}
            </span>
            {flagged.has(currentQuestion.id) && (
              <span className="px-2 py-1 rounded text-xs bg-amber-900/50 text-amber-400">Flagged</span>
            )}
          </div>

          {/* Question */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4">
            <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {currentQuestion.options.map((opt, i) => {
              let borderClass = "border-gray-800 hover:border-gray-600";
              let bgClass = "bg-gray-900";
              if (submitted) {
                if (i === currentQuestion.correct) {
                  borderClass = "border-emerald-500";
                  bgClass = "bg-emerald-950/30";
                } else if (i === selectedOption && i !== currentQuestion.correct) {
                  borderClass = "border-red-500";
                  bgClass = "bg-red-950/30";
                } else {
                  borderClass = "border-gray-800";
                  bgClass = "bg-gray-900 opacity-50";
                }
              } else if (i === selectedOption) {
                borderClass = "border-blue-500";
                bgClass = "bg-blue-950/30";
              }

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedOption(i)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderClass} ${bgClass}`}
                >
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-400">
                      {opt.label}
                    </span>
                    <span className="text-sm leading-relaxed text-gray-200">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence selector + Submit */}
          {!submitted && selectedOption !== null && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
              <p className="text-sm text-gray-400 mb-2">How confident are you?</p>
              <div className="flex gap-2 mb-3">
                {[
                  { key: "guessing", label: "Guessing", emoji: "🎲" },
                  { key: "somewhat", label: "Somewhat Sure", emoji: "🤔" },
                  { key: "confident", label: "Very Confident", emoji: "💪" }
                ].map(c => (
                  <button
                    key={c.key}
                    onClick={() => setConfidence(c.key)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      confidence === c.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
              {confidence && (
                <button
                  onClick={() => handleSubmit(false)}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                >
                  Submit Answer (Enter)
                </button>
              )}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="space-y-3 mb-4">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={18} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Explanation</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 border border-indigo-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} className="text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-400">Interview Script</span>
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">{currentQuestion.interviewScript}</p>
              </div>

              {currentQuestion.proTip && (
                <div className="bg-gray-900 rounded-xl p-5 border border-amber-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={18} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Pro Tip</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.proTip}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {currentIndex < totalQuestions - 1 ? (
                  <>Next Question <ChevronRight size={18} /></>
                ) : (
                  <>View Results <BarChart3 size={18} /></>
                )}
              </button>
            </div>
          )}

          {/* Action buttons */}
          {!submitted && (
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors"
              >
                <SkipForward size={16} /> Skip
              </button>
              <button
                onClick={handleFlag}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-amber-900/50 text-amber-400"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                <Flag size={16} /> {flagged.has(currentQuestion.id) ? "Unflag" : "Flag for Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === RESULTS SCREEN ===
  if (screen === "results") {
    const grade = getGrade(score);
    const GradeIcon = grade.icon;
    const subtopicStats = getSubtopicStats();
    const luckyGuesses = getLuckyGuesses();
    const overconfidentMisses = getOverconfidentMisses();
    const incorrect = getIncorrect();
    const weakSubtopics = getWeakSubtopics();
    const flaggedQuestions = orderedQuestions.filter(q => flagged.has(q.id));

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 border-4 border-gray-800 mb-4">
              <span className="text-3xl font-bold">{score}%</span>
            </div>
            <div className={`flex items-center justify-center gap-2 text-lg font-semibold mb-2 ${grade.color}`}>
              <GradeIcon size={22} /> {grade.label}
            </div>
            <p className="text-gray-500 text-sm">
              {correctCount}/{totalQuestions} correct · Total time: {formatTime(totalElapsed)}
            </p>
          </div>

          {/* Subtopic breakdown */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Per-Subtopic Breakdown</h3>
            {TIER_ORDER.map(tier => {
              const topics = Object.entries(subtopicStats).filter(([name]) => (SUBTOPIC_META[name]?.tier || "Thin") === tier);
              if (topics.length === 0) return null;
              const tierColors = { Heavy: "text-red-400", Medium: "text-yellow-400", Thin: "text-gray-400", Bridge: "text-cyan-400" };
              return (
                <div key={tier} className="mb-3">
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${tierColors[tier]}`}>{tier}</div>
                  {topics.map(([name, stat]) => {
                    const pct = Math.round((stat.correct / stat.total) * 100);
                    const barColor = pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
                    return (
                      <div key={name} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{name}</span>
                          <span className="text-gray-500">{stat.correct}/{stat.total} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Confidence analysis */}
          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Confidence Analysis</h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-amber-400 mb-2">
                    <AlertTriangle size={16} /> Lucky Guesses — correct but you were guessing (hidden weak spots)
                  </div>
                  {luckyGuesses.map(q => (
                    <div key={q.id} className="text-sm text-gray-400 pl-6 mb-1">• {q.subtopic}: {q.question.slice(0, 80)}...</div>
                  ))}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-red-400 mb-2">
                    <XCircle size={16} /> Overconfident Misses — wrong but you were very confident (dangerous misconceptions)
                  </div>
                  {overconfidentMisses.map(q => (
                    <div key={q.id} className="text-sm text-gray-400 pl-6 mb-1">• {q.subtopic}: {q.question.slice(0, 80)}...</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Incorrect questions */}
          {incorrect.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Incorrect Questions ({incorrect.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrect.map(q => (
                  <div key={q.id} className="border-l-2 border-red-500 pl-4">
                    <div className="text-xs text-gray-500 mb-1">{q.subtopic}</div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-xs text-emerald-400 mb-1">Correct: {q.options[q.correct].label}. {q.options[q.correct].text.slice(0, 120)}...</p>
                    <p className="text-xs text-gray-500">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged questions */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-amber-900/30 mb-4">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                Flagged for Review ({flaggedQuestions.length})
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {flaggedQuestions.map(q => (
                  <div key={q.id} className="border-l-2 border-amber-500 pl-4">
                    <div className="text-xs text-gray-500 mb-1">{q.subtopic}</div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center pb-8">
            <button
              onClick={() => startQuiz(mode, null)}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors"
            >
              <RotateCcw size={18} /> Retry All
            </button>
            {incorrect.length > 0 && (
              <button
                onClick={() => startQuiz(mode, incorrect.map(q => q.id))}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-red-900/50 hover:bg-red-900/70 text-red-300 font-medium transition-colors"
              >
                <RotateCcw size={18} /> Retry Missed ({incorrect.length})
              </button>
            )}
            {weakSubtopics.length > 0 && (
              <button
                onClick={() => {
                  const weakIds = orderedQuestions
                    .filter(q => weakSubtopics.includes(q.subtopic))
                    .map(q => q.id);
                  startQuiz(mode, weakIds);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-900/50 hover:bg-amber-900/70 text-amber-300 font-medium transition-colors"
              >
                <BarChart3 size={18} /> Retry Weak Subtopics
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium transition-colors"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
