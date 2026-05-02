// === COVERAGE MANIFEST ===
// Content type: deep pattern (caching strategies, architectures, eviction, failure modes)
//
// HEAVY subtopics:
//   Cache-Aside (Lazy Loading) — Questions: 3 — IDs: [q1, q2, q3]
//     └─ Nested: Cache miss latency penalty — covered by: [q1]
//     └─ Nested: Default pattern rationale — covered by: [q2]
//     └─ Nested: Stale data window — covered by: [q3]
//   Cache Consistency — Questions: 4 — IDs: [q14, q15, q16, q17]
//     └─ Nested: Invalidation on writes — covered by: [q14]
//     └─ Nested: Short TTLs for stale tolerance — covered by: [q15]
//     └─ Nested: Eventual consistency acceptance — covered by: [q16]
//     └─ Nested: Dual-write problem — covered by: [q17]
//   Cache Stampede (Thundering Herd) — Questions: 3 — IDs: [q18, q19, q20]
//     └─ Nested: Request coalescing / single flight — covered by: [q18]
//     └─ Nested: Cache warming — covered by: [q19]
//     └─ Nested: Probabilistic early expiration — covered by: [q20]
//   Hot Keys — Questions: 3 — IDs: [q21, q22, q23]
//     └─ Nested: Replicate hot keys — covered by: [q21]
//     └─ Nested: Local fallback cache — covered by: [q22]
//     └─ Nested: Rate limiting on keys — covered by: [q23]
//   Interview Strategy (When/How to Introduce Caching) — Questions: 4 — IDs: [q30, q31, q32, q33]
//     └─ Nested: Identify bottleneck first — covered by: [q30]
//     └─ Nested: Decide what to cache — covered by: [q31]
//     └─ Nested: Walk through architecture choice — covered by: [q32]
//     └─ Nested: Address downsides — covered by: [q33]
//
// MEDIUM subtopics:
//   External Caching (Redis/Memcached) — Questions: 2 — IDs: [q4, q5]
//   CDN (Content Delivery Network) — Questions: 2 — IDs: [q6, q7]
//   Write-Through Caching — Questions: 2 — IDs: [q8, q9]
//   Write-Behind (Write-Back) Caching — Questions: 2 — IDs: [q10, q11]
//   LRU Eviction — Questions: 2 — IDs: [q24, q25]
//   TTL (Time To Live) — Questions: 2 — IDs: [q28, q29]
//
// THIN subtopics (standalone):
//   Client-Side Caching — Questions: 1 — IDs: [q12]
//   In-Process Caching — Questions: 1 — IDs: [q13]
//   Read-Through Caching — Questions: 1 — IDs: [q26]
//
// THIN subtopics (clustered):
//   Cluster: LFU + FIFO — Questions: 1 — IDs: [q27]
//
// CROSS-SUBTOPIC bridges:
//   Hot Keys × In-Process Caching — IDs: [q22]
//   CDN × Read-Through Pattern — IDs: [q26]
//   Cache Stampede × TTL — IDs: [q20]
//   Write-Through × Cache Consistency — IDs: [q17]
//   Interview Strategy × Cache Stampede — IDs: [q33]
//
// Anti-pattern questions: 4 — IDs: [q9, q16, q25, q31]
// Gotcha/trap questions: 4 — IDs: [q3, q11, q17, q19]
//
// Total: 33 questions across 15 subtopics (5 heavy, 6 medium, 4 thin)
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Cache-Aside (Lazy Loading)",
    "style": "Failure Analysis",
    "question": "You implement cache-aside for user profiles in a social media app. During a cold start after a Redis restart, your database receives 50,000 profile reads in the first 10 seconds. The DB connection pool (max 200) is exhausted within 2 seconds and requests start timing out. What is the root cause and the most effective mitigation?",
    "options": [
      "Cache-aside always causes this on cold start because every request is a cache miss. The fix is to switch to read-through caching so the cache handles DB queries internally, which doesn't reduce DB load but distributes it more evenly.",
      "The connection pool is undersized. Increase it to 5,000 connections to handle the burst, and the cold start resolves itself as the cache populates.",
      "Cache-aside's cold start causes 100% miss rate, hammering the DB. The most effective mitigation is cache warming — preload the most frequently accessed profiles into Redis before routing traffic, combined with request coalescing so duplicate profile fetches during the warm-up window share a single DB query.",
      "The cold start is unavoidable with cache-aside. Switch to write-through caching so the cache is always populated on writes and never has a cold start problem."
    ],
    "correctIndex": 2,
    "explanation": "Cache-aside by design only populates on cache misses, so a cold start means 100% miss rate. Increasing the connection pool just delays the problem — 50,000 concurrent queries will overwhelm any reasonable DB. Write-through helps future writes but doesn't solve the immediate cold start for existing data. Cache warming (preloading hot keys) combined with request coalescing (deduplicating concurrent fetches for the same key) is the standard production solution.",
    "interviewScript": "In your interview, say: 'Cache-aside has a cold start vulnerability — after a restart, the 100% miss rate can overwhelm the database. I'd mitigate this with cache warming for the top N most-accessed keys, and implement request coalescing so if 100 requests hit the same uncached profile simultaneously, only one DB query fires and the rest wait for that result.'",
    "proTip": "Always mention cold start risk when proposing cache-aside. It shows you understand the operational reality, not just the happy path."
  },
  {
    "id": "q2",
    "subtopic": "Cache-Aside (Lazy Loading)",
    "style": "Interviewer Pushback",
    "question": "You propose cache-aside for a product catalog service. Your interviewer says: 'Cache-aside only caches data that's been requested. What about new products that haven't been viewed yet — won't the first viewer always get slow response times?' What's the strongest response?",
    "options": [
      "Switch to write-through caching so every new product is cached on creation, eliminating the first-view latency penalty entirely.",
      "The first-view penalty is unavoidable with cache-aside, but it's the right trade-off. Cache-aside keeps the cache lean by only storing data that's actually requested. For a catalog with millions of products where only 20% are viewed regularly, caching everything would waste memory. The single cache miss for a new product adds ~50ms — noticeable but acceptable — and all subsequent views are served at 1ms.",
      "Pre-populate every new product into the cache on creation using a background job. This eliminates the cold read entirely with no trade-offs.",
      "The first-view penalty doesn't matter because CDN caching will handle new product pages before they reach the application cache."
    ],
    "correctIndex": 1,
    "explanation": "Cache-aside's 'lazy' nature is a feature, not a bug. It keeps the cache lean by only storing data that's actually requested. Pre-populating every new product wastes memory on items that may never be viewed. Write-through adds write latency and complexity for a marginal benefit. The correct response acknowledges the trade-off and explains why it's acceptable: one slow read vs. potentially millions of wasted cache entries.",
    "interviewScript": "In your interview, say: 'That's the core trade-off of cache-aside — it only caches what's been requested. For a catalog with millions of products, that's actually ideal. We'd waste enormous cache memory storing products nobody views. The first viewer pays ~50ms instead of ~1ms, but every subsequent viewer benefits. If first-view latency is critical for certain products, I can selectively warm those keys.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "Cache-Aside (Lazy Loading)",
    "style": "Gotcha/Trap",
    "question": "Your cache-aside implementation invalidates the cache entry on every write, then the next read repopulates it from the database. A colleague points out that there's a subtle race condition in this seemingly safe pattern. What's the issue?",
    "options": [
      "If a write invalidates the cache and a concurrent read happens between the invalidation and the DB write committing, the read fetches stale data from the DB and re-caches it — the fresh write is then 'hidden' behind stale cached data until TTL expires.",
      "The invalidation itself could fail silently if Redis is temporarily unreachable, but the DB write succeeds, leaving stale data in the cache indefinitely.",
      "Both A and B are real race conditions in cache-aside. Option A is the read-after-invalidate race, and Option B is the silent invalidation failure. Together they mean cache-aside can never guarantee consistency.",
      "There is no race condition. Since the cache is invalidated before the next read, the read always fetches fresh data from the database."
    ],
    "correctIndex": 2,
    "explanation": "Cache-aside has two subtle consistency gaps. First, a concurrent read between cache invalidation and DB commit can re-cache stale data. Second, if the cache invalidation call fails (e.g., Redis network blip) but the DB write succeeds, you have permanently stale cached data until TTL expiration. This is why the content states 'there is no perfect solution' for cache consistency — you must choose a strategy based on freshness requirements. Short TTLs provide a safety net for both failure modes.",
    "interviewScript": "In your interview, say: 'Cache-aside has a known race condition: a read between cache invalidation and DB commit can re-cache stale data. There's also the risk of invalidation failure — if the Redis call fails but the DB write succeeds, stale data persists. Short TTLs act as a safety net for both cases. Perfect consistency with cache-aside isn't achievable without distributed transactions, which is rarely worth the complexity.'",
    "proTip": "Mentioning the invalidation race condition unprompted shows deep understanding. Most candidates only think about the happy path of cache-aside."
  },
  {
    "id": "q4",
    "subtopic": "External Caching (Redis/Memcached)",
    "style": "Scenario-Based Trade-offs",
    "question": "You're designing a session store for a web app with 5M daily active users. Each session is ~2KB and sessions expire after 30 minutes of inactivity. You're choosing between Redis and Memcached. Given these constraints, which is the better choice and why?",
    "options": [
      "Memcached, because sessions are simple key-value pairs that don't need Redis's data structures, Memcached's multi-threaded architecture handles higher throughput for simple GET/SET operations, and its built-in slab allocation is optimized for uniform-size objects like sessions.",
      "Redis, because it supports TTL natively with keyspace notifications, offers persistence options so sessions survive restarts, and its single-threaded event loop provides simpler consistency guarantees for session updates.",
      "Either works equally well. The choice doesn't matter because both support TTL and key-value operations with similar latency.",
      "Neither — sessions should be stored in the database with an index on expiration time, since cache eviction could prematurely destroy active sessions."
    ],
    "correctIndex": 1,
    "explanation": "For sessions, Redis is the better choice. TTL with keyspace notifications enables automatic cleanup. Persistence (RDB/AOF) means sessions survive Redis restarts — with Memcached, a restart loses all sessions and forces mass re-authentication. The consistency of single-threaded execution simplifies session update logic. Memcached's multi-threaded advantage matters less here since session operations are simple and the bottleneck is network latency, not CPU.",
    "interviewScript": "In your interview, say: 'I'd choose Redis for sessions. TTL with keyspace notifications handles expiration cleanly. Persistence means sessions survive restarts — critical for user experience. And Redis's single-threaded model gives simpler consistency for session updates. Memcached would work for pure caching, but sessions need durability.'",
    "proTip": null
  },
  {
    "id": "q5",
    "subtopic": "External Caching (Redis/Memcached)",
    "style": "Critical Failure Modes",
    "question": "Your application uses Redis as an external cache with cache-aside. Redis goes down during peak traffic (100K requests/sec). Your application falls back to hitting the database directly. What is the most dangerous failure cascade and how should you design against it?",
    "options": [
      "The database handles the load fine since it was designed for the full traffic. The only impact is increased latency from 1ms to 50ms per query.",
      "The sudden traffic spike from 100K cache misses overwhelms the database, causing connection exhaustion, query timeouts, and cascading failures across all services that depend on the database. Design against this with circuit breakers that shed load, a small in-process cache as a last-resort layer, and graceful degradation that serves stale data or reduced functionality.",
      "The application servers crash from the increased memory usage of holding open database connections. Use connection pooling to prevent this.",
      "The Redis failover to a replica happens within 1-2 seconds, so the traffic spike is negligible. Just configure Redis Sentinel for automatic failover."
    ],
    "correctIndex": 1,
    "explanation": "This is exactly the scenario the content warns about. If Redis is absorbing 95% of reads, the database is only provisioned for 5% of the traffic. When Redis fails, the database suddenly receives 20x its normal load. Connection pools exhaust, queries queue, timeouts cascade. The content specifically recommends circuit breakers, in-process caching as a last resort, and graceful degradation. Redis Sentinel helps, but the failover window still creates a dangerous spike.",
    "interviewScript": "In your interview, say: 'If Redis is handling 95% of reads, the database is sized for 5% of traffic. A Redis failure means 20x load hitting the DB instantly. I'd add circuit breakers to shed excess load, a small in-process cache for the hottest keys as a last-resort layer, and graceful degradation — serving slightly stale data is better than a complete outage.'",
    "proTip": "Always discuss cache failure scenarios when proposing Redis. Interviewers specifically test whether you understand that caching creates a dependency, not just an optimization."
  },
  {
    "id": "q6",
    "subtopic": "CDN (Content Delivery Network)",
    "style": "Estimation-Backed Reasoning",
    "question": "Your image-heavy social media app serves 500M image requests per day. Your origin server is in Virginia. 40% of traffic comes from India (250-300ms RTT to origin). You're evaluating whether to add a CDN. What's the latency improvement and what's the primary operational benefit?",
    "options": [
      "CDN reduces Indian user latency from 250-300ms to 20-40ms per image by serving from a nearby edge server. But the primary operational benefit is reducing origin bandwidth costs, not latency.",
      "CDN reduces latency from 250-300ms to 20-40ms per image for Indian users by serving from a nearby edge server. The primary operational benefit is that the origin server load drops dramatically — instead of 500M requests/day hitting your servers, only cache misses reach the origin, potentially reducing origin traffic by 90%+ for static content.",
      "CDN latency improvement is marginal (maybe 50ms savings) because images still need to be fetched from the origin on every request. The main benefit is DDoS protection.",
      "CDN only helps for the first request. Subsequent requests use browser caching regardless of CDN presence, so the improvement is only for cache-cold users."
    ],
    "correctIndex": 1,
    "explanation": "The content states that without a CDN, requests from India to Virginia add 250-300ms, while a CDN serves from a nearby edge in 20-40ms — that's a 6-15x latency improvement. But the operational benefit is equally important: the CDN absorbs the vast majority of requests, so your origin servers handle only cache misses. For static media with high cache hit rates, this can reduce origin traffic by 90%+, dramatically cutting infrastructure costs and server load.",
    "interviewScript": "In your interview, say: 'For 500M daily image requests with 40% from India, a CDN reduces latency from 250-300ms to 20-40ms by serving from edge servers. But the bigger win is origin offload — with high cache hit rates on static media, the CDN absorbs 90%+ of requests, so my origin servers only handle misses. That's a massive reduction in infrastructure cost and load.'",
    "proTip": null
  },
  {
    "id": "q7",
    "subtopic": "CDN (Content Delivery Network)",
    "style": "Decision Framework Application",
    "question": "You're designing a system that serves both static profile images and personalized API responses (user feeds). A junior engineer suggests putting both behind a CDN. When should you push back on CDN caching and why?",
    "options": [
      "CDN caching is appropriate for both. Modern CDNs like Cloudflare can cache personalized API responses using Vary headers and edge logic, making them equally effective for dynamic content.",
      "CDN is appropriate for the static profile images but NOT for personalized API feeds. Personalized content has a cache hit rate approaching zero because each user sees different data — the CDN would waste edge storage and add latency (edge miss → origin fetch) instead of removing it. The content advises introducing CDN for static media first, then expanding only if the problem calls for it.",
      "CDN should be used for neither. API responses change too frequently and images should be served directly from object storage (S3) which has built-in edge distribution.",
      "CDN is only useful for images over 1MB. Profile thumbnails are too small to benefit from edge caching."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states: 'the safest time to introduce a CDN is when your system serves static media at scale.' While modern CDNs can cache API responses, personalized feeds have near-zero cache hit rates because every user sees different content. A CDN miss adds latency (extra hop to edge, then to origin) rather than reducing it. Start with static media where cache hit rates are high, then expand only if needed.",
    "interviewScript": "In your interview, say: 'I'd CDN-cache the profile images — static content with high cache hit rates is the sweet spot. But personalized feeds are a poor fit because each user sees different data, so the cache hit rate approaches zero. A CDN miss actually adds latency from the extra hop. I'd serve feeds directly from the application cache or database.'",
    "proTip": "In interviews, distinguish between what CDNs CAN do and what they SHOULD do. Saying 'modern CDNs can cache API responses' is true but shows shallow understanding if you don't explain when it's counterproductive."
  },
  {
    "id": "q8",
    "subtopic": "Write-Through Caching",
    "style": "Scenario-Based Trade-offs",
    "question": "You're building a financial dashboard where users must always see their latest portfolio value. You implement write-through caching: every portfolio update writes to the cache first, which synchronously writes to the database before acknowledging. What is the key trade-off you're making, and when does this pattern break down?",
    "options": [
      "Write-through guarantees perfect consistency with no trade-offs. It breaks down only when Redis is unavailable.",
      "The trade-off is write latency — every write waits for both cache and DB to complete. It breaks down under high write volume because you're paying double the write cost. It also still suffers from the dual-write problem: if the cache update succeeds but the DB write fails, the systems are inconsistent. You need retry logic or accept that perfect consistency requires distributed transactions.",
      "The trade-off is cache pollution — write-through caches every written value even if it's never read again, wasting memory. But consistency is guaranteed.",
      "Both B and C are trade-offs of write-through. Slower writes AND cache pollution. But consistency is still guaranteed because writes are synchronous."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states write-through's trade-off: 'slower writes because the application must wait for both the cache update and the database write.' More critically, it warns about the dual-write problem — if the cache succeeds but DB fails (or vice versa), you have inconsistency. Write-through does NOT guarantee perfect consistency without distributed transactions. Cache pollution is also mentioned but is secondary to the consistency and latency issues.",
    "interviewScript": "In your interview, say: 'Write-through gives me reads that always return fresh data, but the cost is doubled write latency. More importantly, it still has the dual-write problem — if the cache update succeeds but the DB write fails, I have inconsistency. I need retry logic and error handling. For a financial dashboard, this trade-off is worth it because correctness on reads is critical.'",
    "proTip": "Interviewers test whether you know write-through still has consistency edge cases. Saying 'write-through guarantees consistency' is a red flag — say 'write-through improves consistency but doesn't eliminate the dual-write problem.'"
  },
  {
    "id": "q9",
    "subtopic": "Write-Through Caching",
    "style": "Anti-Pattern Identification",
    "question": "A candidate proposes write-through caching for a logging and analytics pipeline that ingests 100K events per second. Events are written once and rarely read within the first hour. What is the most critical flaw in this design?",
    "options": [
      "Write-through doubles write latency by requiring synchronous cache + DB writes for every event. At 100K events/sec, this adds unacceptable overhead. Worse, it pollutes the cache with data that won't be read for hours, evicting potentially useful entries. The content states write-through 'can pollute the cache with data that may never be read again.'",
      "Write-through is fine for this use case because it ensures all events are durably stored. The cache simply acts as a write buffer.",
      "The only issue is that Redis might not handle 100K writes/sec. If you scale Redis, write-through works well here.",
      "Write-through fails because logging events are immutable and never updated, so caching them provides no benefit. But the write latency is acceptable."
    ],
    "correctIndex": 0,
    "explanation": "This is a textbook anti-pattern for write-through. The content warns that write-through 'can pollute the cache with data that may never be read again.' For a write-heavy analytics pipeline where events are rarely read immediately, write-through adds latency to every write and fills the cache with entries that won't be accessed for hours — evicting actually useful cached data. Write-behind (write-back) is the correct pattern here: fast async writes with batched DB flushes.",
    "interviewScript": "In your interview, say: 'Write-through is wrong here. It doubles write latency on 100K events/sec and pollutes the cache with data that won't be read for hours. For write-heavy analytics, I'd use write-behind — the application writes to the cache, which batches and flushes to the database asynchronously. That gives me the write throughput I need.'",
    "proTip": null
  },
  {
    "id": "q10",
    "subtopic": "Write-Behind (Write-Back) Caching",
    "style": "Critical Failure Modes",
    "question": "You implement write-behind caching for a metrics pipeline. Writes go to Redis, which batches and flushes to the database every 5 seconds. During a flush, the Redis instance crashes. What data is lost, and for what types of workloads is this an acceptable risk?",
    "options": [
      "No data is lost because Redis persists all writes to its AOF (append-only file) before acknowledging. The flush resumes after restart.",
      "All data written since the last successful flush (up to 5 seconds of metrics) is lost. The content states 'if the cache crashes before flushing, you can lose data.' This is acceptable for analytics and metrics pipelines where eventual consistency is fine and losing a few seconds of aggregate data doesn't affect business decisions.",
      "Only the current batch being flushed is lost. All previously acknowledged writes are safe because Redis uses write-ahead logging.",
      "The entire cache is lost, but this is never acceptable in production. Write-behind should only be used in development environments."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states: write-behind 'introduces risk. If the cache crashes before flushing, you can lose data.' With a 5-second flush interval, up to 5 seconds of metrics are lost. The content also states this pattern is 'best for workloads where occasional data loss is acceptable' and specifically names 'analytics and metrics pipelines' as appropriate use cases. Even with AOF persistence, there's typically a sync interval gap.",
    "interviewScript": "In your interview, say: 'Write-behind risks data loss if the cache crashes before flushing. With a 5-second interval, I could lose up to 5 seconds of metrics. For an analytics pipeline, that's acceptable — losing a few data points doesn't change aggregate trends. But I'd never use write-behind for financial transactions or anything requiring strong durability.'",
    "proTip": null
  },
  {
    "id": "q11",
    "subtopic": "Write-Behind (Write-Back) Caching",
    "style": "Gotcha/Trap",
    "question": "A candidate claims write-behind caching gives them 'the best of both worlds: fast writes AND strong consistency, because the data is always in the cache for reads and eventually makes it to the database.' What's wrong with this reasoning?",
    "options": [
      "The reasoning is actually correct. As long as reads always go through the cache, the data is consistent from the application's perspective.",
      "Write-behind provides fast writes but NOT strong consistency. There's a window between the cache write and the DB flush where a cache failure loses data permanently, and any system reading directly from the database (analytics, reporting, other services) sees stale data. The content explicitly states write-behind requires 'eventual consistency is acceptable.'",
      "The issue is only performance — write-behind batching creates latency spikes during flush operations that can affect read performance.",
      "Write-behind fails because the cache has limited memory. Once it fills up, writes are rejected until the flush completes, creating backpressure."
    ],
    "correctIndex": 1,
    "explanation": "This is a dangerous misconception. Write-behind is explicitly an eventual consistency pattern. The cache write is acknowledged immediately, but the DB write happens asynchronously. During that window: (1) a cache crash loses the data permanently, (2) any system reading from the DB directly sees stale data. The content is clear: use write-behind only 'when you need high write throughput and eventual consistency is acceptable.'",
    "interviewScript": "In your interview, say: 'Write-behind is an eventual consistency pattern, not a strong consistency one. There's a window where data exists only in the cache. If the cache fails, that data is gone. And any system reading from the database directly — reporting, analytics, other microservices — sees stale data until the flush completes.'",
    "proTip": "Interviewers love to test if you can spot the consistency model mismatch. Whenever someone says 'eventually consistent' and 'strong consistency' in the same breath, that's a red flag to probe."
  },
  {
    "id": "q12",
    "subtopic": "Client-Side Caching",
    "style": "Multi-Hop Reasoning",
    "question": "Your mobile app caches user run data locally for offline use and syncs when connectivity returns (like Strava). A user completes 3 runs offline, then connects to WiFi. Meanwhile, they also edited their profile on the web app. When the mobile app syncs, what's the most architecturally challenging problem and why?",
    "options": [
      "Bandwidth — uploading 3 runs worth of GPS data over WiFi takes too long and might timeout.",
      "Conflict resolution. The mobile app has local changes (3 new runs) and the server has changes the mobile app doesn't know about (profile edit). The sync must handle bidirectional reconciliation without losing data from either side. Client-side caching inherently means 'data can go stale and invalidation is harder' — the app can't know what changed server-side while offline.",
      "Authentication — the session token may have expired during the offline period, preventing the sync entirely.",
      "Data ordering — the 3 runs must be inserted in chronological order or the user's statistics will be incorrect."
    ],
    "correctIndex": 1,
    "explanation": "The content notes that with client-side caching, 'data can go stale and invalidation is harder.' In the offline scenario, this problem is amplified — the client has local writes that haven't reached the server, and the server has changes the client doesn't know about. Bidirectional sync requires conflict resolution strategies (last-write-wins, merge, manual resolution). This is why client-side caching is powerful for UX but architecturally complex.",
    "interviewScript": "In your interview, say: 'The core challenge is bidirectional conflict resolution. The mobile client has local writes and the server has changes from the web app. I need a sync protocol that merges both without data loss. For non-conflicting changes like new runs vs. profile edits, this is straightforward. But if both sides edited the same data, I need a conflict resolution strategy — usually last-write-wins with timestamps or vector clocks.'",
    "proTip": null
  },
  {
    "id": "q13",
    "subtopic": "In-Process Caching",
    "style": "Implementation-Specific Nuance",
    "question": "Your service has 20 application server instances behind a load balancer. You add an in-process cache for feature flags that refreshes every 60 seconds. A product manager toggles a feature flag off due to a critical bug. What happens in the worst case, and what constraint from the content makes this acceptable?",
    "options": [
      "All 20 instances see the change immediately because in-process caches use shared memory across the load balancer.",
      "In the worst case, some instances serve the old flag value for up to 60 seconds after the toggle. Since each instance has its own cache and they refresh independently, there's a window of inconsistency. The content states in-process caching is appropriate for 'small, frequently accessed values that rarely change' — feature flags fit this pattern, and 60 seconds of staleness is the accepted trade-off for avoiding 20 Redis calls per request.",
      "The feature flag change propagates within 1-2 seconds via the load balancer's cache invalidation broadcast.",
      "In-process caching doesn't work for feature flags because they change too frequently. The content recommends only configuration values that never change."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states in-process caching limitations: 'Each instance of your application has its own cache, so cached data is not shared across servers. If one instance updates or invalidates a cached value, the others will not know.' With 20 instances refreshing independently on 60-second intervals, a flag toggle takes up to 60 seconds to propagate to all instances. The content lists feature flags as an appropriate use case because they're 'small, frequently accessed values that rarely change.'",
    "interviewScript": "In your interview, say: 'In-process caching means each of my 20 instances has its own copy. When a feature flag is toggled, instances won't know until their next refresh — up to 60 seconds. For most flag changes, this is fine. For critical bug mitigation, I might add a pub/sub notification channel to trigger immediate cache invalidation across instances, while keeping the 60-second refresh as the normal path.'",
    "proTip": "Mention in-process caching as an optimization AFTER proposing an external cache. The content says: 'mention this only as an optimization layer after you have already introduced an external cache.'"
  },
  {
    "id": "q14",
    "subtopic": "Cache Consistency",
    "style": "Scenario-Based Trade-offs",
    "question": "A user updates their profile picture. The new image is written to the database, and the old cache entry is invalidated. However, for the next 2 seconds, other users still see the old profile picture. A product manager files a bug. How do you explain this behavior and what strategy does the content recommend?",
    "options": [
      "This is a bug — cache invalidation should be synchronous and atomic with the DB write. Fix it by using distributed transactions between Redis and the database.",
      "This is expected behavior with cache-aside and invalidation on writes. The 2-second window occurs because other servers may have read and cached the old value before invalidation propagated. The content recommends accepting this with 'short TTLs for stale tolerance' — a brief delay is fine for profile pictures, and the TTL ensures it self-heals even if invalidation fails.",
      "The invalidation is failing silently. Check the Redis connection and add retry logic.",
      "This only happens because you're invalidating instead of updating. Switch to updating the cache entry directly on every write to eliminate the stale window entirely."
    ],
    "correctIndex": 1,
    "explanation": "The content explains this exact scenario: 'if a user updates their profile picture, the new value is written to the database but the old value might still be in the cache. Other users may see the outdated profile picture until the cache eventually refreshes.' The recommended strategies are invalidation on writes (which you're doing) combined with short TTLs as a safety net. The content states: 'there is no perfect solution. You choose a strategy based on how fresh the data must be.'",
    "interviewScript": "In your interview, say: 'This is expected eventual consistency, not a bug. With cache-aside, there's a brief window where stale data can be served. For profile pictures, a 2-second delay is acceptable. I use cache invalidation on writes as the primary mechanism and short TTLs as a safety net. If we needed true real-time consistency, we'd pay a higher complexity cost with write-through, but for social profiles that's overkill.'",
    "proTip": null
  },
  {
    "id": "q15",
    "subtopic": "Cache Consistency",
    "style": "Decision Framework Application",
    "question": "You're designing three different features: (1) a user's bank balance display, (2) a social media news feed, (3) an analytics dashboard showing daily active users. For each, you need to choose a cache consistency strategy. Which combination correctly applies the content's guidance?",
    "options": [
      "All three should use cache invalidation on writes for maximum freshness. TTL-based approaches are too risky for production systems.",
      "Bank balance: no caching at all (always read from DB). News feed: cache invalidation on writes with short TTL. Analytics: accept eventual consistency with longer TTL. This follows the content's guidance to choose strategy 'based on how fresh the data must be.'",
      "Bank balance: write-through for strong consistency. News feed: cache-aside with invalidation on writes plus short TTL (10-60 seconds). Analytics: cache-aside with longer TTL (5-15 minutes) accepting eventual consistency. The content states 'for feeds, metrics, and analytics, a short delay is usually fine.'",
      "Bank balance: cache-aside with 1-second TTL. News feed: CDN caching. Analytics: write-behind with 5-minute flush."
    ],
    "correctIndex": 2,
    "explanation": "The content maps consistency strategies to freshness requirements. Bank balance requires strong consistency — write-through ensures reads always return fresh data. News feed needs reasonable freshness — cache-aside with invalidation on writes and short TTL balances speed and staleness. The content explicitly states: 'for feeds, metrics, and analytics, a short delay is usually fine' — so the analytics dashboard can use longer TTLs with eventual consistency.",
    "interviewScript": "In your interview, say: 'I'd match consistency strategy to freshness requirements. Bank balance gets write-through for strong consistency. News feed gets cache-aside with invalidation on writes and a 30-second TTL — the content says feeds tolerate short delays. Analytics gets a 10-minute TTL with eventual consistency — aggregate metrics don't need real-time accuracy.'",
    "proTip": "Demonstrating different consistency strategies for different features in the same system shows maturity. One-size-fits-all caching is a junior answer."
  },
  {
    "id": "q16",
    "subtopic": "Cache Consistency",
    "style": "Anti-Pattern Identification",
    "question": "A candidate designs an e-commerce system where product prices are cached with a 24-hour TTL and no invalidation on writes. When a product price changes, users may see the old price for up to 24 hours. The candidate argues: 'The content says to accept eventual consistency. This is eventually consistent.' What's wrong with this reasoning?",
    "options": [
      "The reasoning is correct. Eventual consistency means any delay is acceptable, and 24 hours is just a longer eventual consistency window.",
      "The candidate correctly applies eventual consistency but should use write-behind instead of TTL-based expiration for better performance.",
      "The candidate misapplies the content's guidance. 'Accept eventual consistency' applies to feeds, metrics, and analytics where staleness is cosmetic. For prices, 24-hour staleness means users could purchase at wrong prices, creating legal and financial liability. The content says to choose strategy 'based on how fresh the data must be' — price data requires invalidation on writes or very short TTLs.",
      "The 24-hour TTL is fine for prices, but the candidate should also add a CDN layer to reduce the staleness window."
    ],
    "correctIndex": 2,
    "explanation": "The content's advice to 'accept eventual consistency' is specifically contextualized: 'for feeds, metrics, and analytics, a short delay is usually fine.' Prices are not in this category — displaying incorrect prices has legal and financial consequences. The content's framework is clear: choose strategy based on freshness requirements. Prices require cache invalidation on writes (delete cache entry when price changes) or very short TTLs (seconds, not hours).",
    "interviewScript": "In your interview, say: 'Eventual consistency isn't a blanket license for staleness. The content recommends it for feeds and metrics where delays are cosmetic. Prices require near-real-time accuracy — a 24-hour stale price could mean selling products below cost. I'd use cache invalidation on writes: when a price changes, immediately delete the cache entry so the next read fetches the current price.'",
    "proTip": null
  },
  {
    "id": "q17",
    "subtopic": "Cache Consistency",
    "style": "Gotcha/Trap",
    "question": "A candidate proposes write-through caching and claims it 'solves cache consistency because the cache and database are always updated together synchronously.' The content identifies a specific problem that persists even with write-through. What is it?",
    "options": [
      "Write-through only works with Redis, not Memcached, so it's not a general solution.",
      "Write-through still suffers from the dual-write problem. If the cache update succeeds but the database write fails, or vice versa, the systems are inconsistent. The content states: 'You need retry logic, error handling, or eventually accept that perfect consistency is difficult without distributed transactions.'",
      "Write-through is too slow because it requires two synchronous writes, but consistency is guaranteed if both succeed.",
      "Write-through solves consistency for writes but not for reads — cached data can still expire via TTL and serve stale data on the next read."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly warns about this: 'Write-through still suffers from the dual-write problem. If the cache update succeeds but the database write fails, or vice versa, the systems can end up inconsistent. You need retry logic, error handling, or eventually accept that perfect consistency is difficult without distributed transactions.' Write-through improves consistency but doesn't guarantee it.",
    "interviewScript": "In your interview, say: 'Write-through improves consistency but doesn't guarantee it. The dual-write problem persists — if the cache write succeeds but the DB write fails, you have an inconsistent state. True consistency requires distributed transactions, which add significant complexity. In practice, I'd add retry logic and idempotent writes as a pragmatic solution.'",
    "proTip": "This is a favorite interviewer gotcha. If a candidate says any caching pattern 'guarantees consistency,' probe the dual-write problem. The only guarantee comes from distributed transactions, and those have their own costs."
  },
  {
    "id": "q18",
    "subtopic": "Cache Stampede (Thundering Herd)",
    "style": "Failure Analysis",
    "question": "Your homepage feed cache has a 60-second TTL. At exactly the expiration moment, 5,000 concurrent requests arrive. The feed query takes 200ms and requires joining 3 tables. Without any stampede protection, what happens to your database and what is the most effective mitigation?",
    "options": [
      "The database handles it fine because modern databases can process 5,000 queries in parallel. The 200ms query time means all results return within 250ms.",
      "All 5,000 requests miss the cache simultaneously and fire the 200ms join query against the database. The database is hit with 5,000 identical expensive queries in the same second, overwhelming CPU and I/O. Request coalescing (single flight) is the most effective mitigation — only one request rebuilds the cache while the other 4,999 wait for that single result.",
      "The TTL expiration is staggered by the cache automatically, so requests naturally spread out over several seconds. No mitigation needed.",
      "The database queues the requests and processes them serially, so only latency increases (5,000 × 200ms = 1,000 seconds). The fix is to increase the TTL to avoid frequent expiration."
    ],
    "correctIndex": 1,
    "explanation": "The content describes this exact scenario: 'a cache stampede happens when a popular cache entry expires and many requests try to rebuild it at the same time... you suddenly have hundreds or thousands [of queries], which can overload the database.' The content identifies request coalescing (single flight) as 'the most effective solution' — one request rebuilds the cache while others wait for that result.",
    "interviewScript": "In your interview, say: 'This is a classic thundering herd. When the TTL expires, 5,000 requests all miss and fire the expensive 3-table join simultaneously. I'd implement request coalescing — also called single flight — where the first request to miss the cache triggers the rebuild, and all subsequent requests for that key wait for that single result instead of hitting the DB independently.'",
    "proTip": null
  },
  {
    "id": "q19",
    "subtopic": "Cache Stampede (Thundering Herd)",
    "style": "Gotcha/Trap",
    "question": "A candidate proposes cache warming (proactively refreshing popular keys before they expire) as the solution to cache stampedes. Under what specific condition does cache warming NOT prevent stampedes, according to the content?",
    "options": [
      "Cache warming doesn't work when the cache server has insufficient memory to hold the warmed entries.",
      "Cache warming only helps when using TTL-based expiration. If you invalidate cache on writes instead (e.g., delete the cache entry when data changes), warming doesn't prevent stampedes because the invalidation happens at an unpredictable time, not at a scheduled TTL expiration that warming can preempt.",
      "Cache warming fails when the popular keys change frequently, because the warming process can't keep up with the changing popularity patterns.",
      "Cache warming is always effective regardless of the expiration strategy. The candidate's answer is correct."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states this nuance: 'Cache warming: Refresh popular keys proactively before they expire. This only helps when using TTL-based expiration. If you invalidate cache on writes instead, warming does not prevent stampedes.' This is because write-based invalidation happens at unpredictable times — you can't proactively refresh a key that was just invalidated by a write. You need request coalescing for write-invalidation scenarios.",
    "interviewScript": "In your interview, say: 'Cache warming helps with TTL-based expiration because you can schedule refreshes before expiry. But if I'm invalidating on writes — deleting the cache entry when data changes — warming doesn't help because the invalidation is unpredictable. For write-invalidation patterns, I need request coalescing instead.'",
    "proTip": "This distinction is rarely mentioned by candidates but shows sophisticated understanding. Always pair your stampede mitigation strategy with your invalidation strategy."
  },
  {
    "id": "q20",
    "subtopic": "Cache Stampede (Thundering Herd)",
    "style": "Cross-Subtopic Bridge",
    "question": "You use TTL-based expiration with a 60-second TTL on trending post feeds. You want to prevent stampedes without the complexity of request coalescing. The content mentions probabilistic early expiration. How does this interact with TTL, and what's the trade-off?",
    "options": [
      "Probabilistic early expiration sets a random TTL between 30-60 seconds for each cache entry, so entries expire at different times and never all expire simultaneously. The trade-off is slightly more stale data on average.",
      "Each cache entry independently decides whether to refresh itself before the TTL expires, with increasing probability as the TTL approaches. This spreads the refresh load over time instead of concentrating it at the exact expiration moment. The trade-off is slightly fresher data (some entries refresh early) at the cost of more total DB queries than strict TTL, but far fewer than a stampede.",
      "Probabilistic early expiration works by setting the TTL to infinity and relying on LRU eviction to naturally stagger removals. The trade-off is unpredictable cache sizes.",
      "It randomly delays cache misses after TTL expiration so requests spread out over a few seconds. The trade-off is higher worst-case latency for some users."
    ],
    "correctIndex": 1,
    "explanation": "Probabilistic early expiration means each request to a cache entry has an increasing probability of triggering a refresh as the TTL approaches, rather than all requests waiting for the exact expiration moment. This naturally distributes the rebuild load. The trade-off is slightly more total DB queries (some entries refresh before strictly necessary), but this is far better than a stampede of 5,000 simultaneous queries.",
    "interviewScript": "In your interview, say: 'Probabilistic early expiration smooths out stampedes by having each request independently decide to refresh with increasing probability as TTL approaches. Instead of 5,000 requests hitting the DB at second 60, a few requests refresh at seconds 50-59 naturally. The trade-off is slightly more total refreshes, but the load is distributed rather than concentrated.'",
    "proTip": null
  },
  {
    "id": "q21",
    "subtopic": "Hot Keys",
    "style": "Scenario-Based Trade-offs",
    "question": "You're building a Twitter-like system. Taylor Swift tweets during the Super Bowl, and her profile key (user:taylorswift) receives 5 million requests per second. Your Redis cluster has 10 shards, but this key maps to a single shard. That shard is overwhelmed while the other 9 are idle. What's the most effective mitigation?",
    "options": [
      "Increase the Redis shard count to 100 so the load is distributed. Since the key maps to one shard, more shards mean less traffic per shard.",
      "Replicate the hot key across multiple cache nodes — store user:taylorswift:1, user:taylorswift:2, etc. on different shards — and load balance reads across them. This distributes the 5M requests across multiple nodes instead of hammering one.",
      "Rate limit requests for Taylor Swift's profile to 100K/sec. Users who exceed the limit get a cached static version.",
      "Move Taylor Swift's profile to a separate Redis instance dedicated to celebrity profiles, isolating the hot key from the main cache cluster."
    ],
    "correctIndex": 1,
    "explanation": "The content specifically uses this Taylor Swift example and recommends: 'Replicate hot keys: Store the same value on multiple cache nodes and load balance reads across them.' Adding more shards doesn't help because consistent hashing still maps the key to one shard. A dedicated instance helps but is reactive and doesn't scale to multiple hot keys. Replication across shards with read distribution is the standard solution.",
    "interviewScript": "In your interview, say: 'This is a hot key problem. Adding shards doesn't help because the key still maps to one shard. I'd replicate the hot key across multiple nodes — store copies as user:taylorswift:1 through user:taylorswift:10 on different shards, and randomly route reads across them. This distributes the 5M requests across 10 nodes, bringing each to 500K/sec.'",
    "proTip": "The Taylor Swift example is directly from the content. Use real-world analogies like this in interviews — it shows you've internalized the concepts beyond textbook definitions."
  },
  {
    "id": "q22",
    "subtopic": "Hot Keys",
    "style": "Cross-Subtopic Bridge",
    "question": "Continuing the Taylor Swift hot key scenario: you've replicated the key across 10 Redis shards. A senior engineer suggests also adding an in-process cache for her profile on each application server. What additional benefit does this provide, and what's the risk?",
    "options": [
      "No benefit — the replicated Redis keys already handle the load. In-process caching just wastes application server memory.",
      "The in-process cache eliminates network calls to Redis entirely for the hottest key. Even with replicated shards, 5M requests/sec across 10 shards means 500K network round-trips per shard per second. In-process caching serves from local memory with zero network latency. The risk is staleness — each app server has its own copy that may be out of date if Taylor Swift updates her profile, and instances won't know until their refresh interval.",
      "In-process caching helps only if Redis goes down. It's a fallback layer, not a performance optimization.",
      "In-process caching is faster but creates a distributed cache coherence problem that's unsolvable without consensus protocols like Raft."
    ],
    "correctIndex": 1,
    "explanation": "The content recommends this as a layered approach: 'Add a local fallback cache: Keep extremely hot values in-process to avoid pounding Redis.' In-process caching eliminates network round-trips entirely for the hottest keys. But the content also warns: 'Each instance has its own cache, so cached data is not shared across servers. If one instance updates or invalidates a cached value, the others will not know.' For a celebrity profile that changes rarely, this staleness risk is acceptable.",
    "interviewScript": "In your interview, say: 'I'd add a small in-process cache as a second layer. It eliminates the network round-trip to Redis for the absolute hottest keys. The trade-off is each app server has its own stale copy — but for a celebrity profile that changes rarely, a 30-60 second refresh interval is fine. This is a layered caching strategy: in-process for the hottest keys, Redis for the rest.'",
    "proTip": null
  },
  {
    "id": "q23",
    "subtopic": "Hot Keys",
    "style": "Ordering/Sequencing",
    "question": "You detect a hot key issue in production. The key receives 10x more traffic than any other and the Redis shard is at 95% CPU. In what order should you apply mitigations for maximum immediate impact with minimum risk?",
    "options": [
      "1. Add in-process caching on app servers (instant relief, no infrastructure changes). 2. Replicate the hot key across multiple shards (distributes load). 3. Add rate limiting on abusive traffic patterns (prevents artificial amplification). 4. Investigate and fix the root cause (is this legitimate traffic or a bot?).",
      "1. Replicate the hot key across shards first (highest throughput gain). 2. Add in-process caching. 3. Rate limit. 4. Investigate root cause.",
      "1. Rate limit immediately (stop the bleeding). 2. Investigate root cause. 3. Replicate hot key. 4. Add in-process caching.",
      "1. Scale up the Redis shard (more CPU/memory). 2. Add replicas. 3. Add in-process caching. 4. Rate limit."
    ],
    "correctIndex": 0,
    "explanation": "In-process caching provides the fastest relief with minimum risk — it's a code-level change on the application servers that immediately reduces Redis traffic. Hot key replication requires Redis configuration changes and client routing logic. Rate limiting addresses the symptom but may incorrectly throttle legitimate users. The content lists all three mitigations (replicate, local fallback, rate limit), and the optimal order prioritizes immediate impact and minimal risk of disruption.",
    "interviewScript": "In your interview, say: 'First, I'd add in-process caching on app servers — it's the fastest to deploy and immediately reduces Redis pressure with no infrastructure changes. Then I'd replicate the hot key across shards for sustained distribution. Rate limiting comes third to catch any abusive patterns. Finally, I'd investigate whether this is legitimate traffic or artificial amplification.'",
    "proTip": null
  },
  {
    "id": "q24",
    "subtopic": "LRU (Least Recently Used)",
    "style": "Implementation-Specific Nuance",
    "question": "Your Redis cache uses LRU eviction and has a 10GB memory limit. Your application caches both user profiles (accessed frequently, ~2KB each) and report PDFs (accessed once per month, ~5MB each). The cache is full. A batch job loads 100 report PDFs into the cache. What happens to cache performance and why?",
    "options": [
      "Nothing — Redis automatically prioritizes smaller objects over larger ones to maximize cache hit ratio.",
      "The 100 report PDFs (~500MB) evict 250,000 user profiles to make room, even though those profiles were recently accessed. LRU only considers access recency, not access frequency or object size. Cache hit rate for profiles drops dramatically until they're re-cached through normal access patterns.",
      "Redis refuses to cache objects larger than 1MB, so the PDFs are silently rejected and profiles are unaffected.",
      "The PDFs are cached but immediately evicted on the next cycle because LRU detects they won't be accessed again soon."
    ],
    "correctIndex": 1,
    "explanation": "LRU evicts based solely on access recency. The batch job makes the PDFs 'recently accessed,' so LRU evicts older entries — the user profiles — regardless of their access frequency or usefulness. 100 PDFs at 5MB each = 500MB, which evicts roughly 250,000 2KB profiles. This is a classic LRU pathology: a batch scan pollutes the cache. This is why some systems use LFU or a combination of LRU + TTL.",
    "interviewScript": "In your interview, say: 'This is a classic LRU pollution problem. The batch job makes infrequently-accessed PDFs appear recently used, evicting 250K frequently-accessed profiles. LRU doesn't consider access frequency, only recency. I'd mitigate this by either using a separate cache for reports, setting very short TTLs on report entries, or switching to an LFU-aware eviction policy for the main cache.'",
    "proTip": "Cache pollution from batch jobs is a real production issue. Mentioning it shows operational experience beyond textbook knowledge."
  },
  {
    "id": "q25",
    "subtopic": "LRU (Least Recently Used)",
    "style": "Anti-Pattern Identification",
    "question": "A candidate sets LRU eviction on their Redis cache but sets no TTL on any keys. They argue: 'LRU handles everything — it evicts entries when memory is full, so TTLs are redundant.' What critical problem does this create?",
    "options": [
      "The candidate is correct — LRU makes TTL unnecessary because stale entries will eventually be evicted when memory pressure increases.",
      "Without TTL, stale data persists indefinitely as long as it's accessed regularly. A user profile cached 6 months ago with outdated information will never be refreshed if it keeps getting read, because LRU only evicts the LEAST recently used entries. The content states TTL is 'a must have when data must eventually refresh' — it complements LRU rather than being redundant.",
      "Without TTL, the cache grows unbounded because LRU only activates when memory is full. The cache will consume all available server memory.",
      "The only issue is that session tokens won't expire, creating a security vulnerability. Other data types are fine without TTL."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states TTL is 'a must have when data must eventually refresh, like API responses or session tokens' and notes it's 'often combined with LRU or LFU to balance freshness and memory usage.' Without TTL, frequently-accessed but stale data never refreshes — LRU keeps it because it's 'recently used.' This means users could see months-old cached data that no longer matches the database.",
    "interviewScript": "In your interview, say: 'LRU and TTL serve different purposes. LRU manages memory pressure — it evicts entries when the cache is full. TTL manages data freshness — it ensures entries are refreshed after a time limit. Without TTL, a frequently-accessed entry could serve stale data forever because LRU never evicts popular entries. I always use both together.'",
    "proTip": null
  },
  {
    "id": "q26",
    "subtopic": "Read-Through Caching",
    "style": "Cross-Subtopic Bridge",
    "question": "The content states that CDNs are a form of read-through cache, yet recommends cache-aside over read-through for application-level caching with Redis. What architectural property makes read-through natural for CDNs but unnecessarily complex for Redis-based application caching?",
    "options": [
      "CDNs have more memory than Redis, so they can handle the additional complexity of read-through.",
      "CDNs are inherently positioned as proxies between clients and origin servers — they intercept requests naturally. The cache IS the intermediary. For application-level Redis, read-through requires the cache to know how to query your database, which couples the cache to your data access logic and requires a specialized caching library. Cache-aside keeps this logic in the application where it belongs.",
      "Read-through requires consistent hashing which CDNs support natively but Redis does not.",
      "CDNs only cache static files which are simple to read-through. Redis caches complex query results that require application logic to reconstruct."
    ],
    "correctIndex": 1,
    "explanation": "The content notes that 'CDNs are a form of read-through cache. When a CDN gets a cache miss, it fetches from your origin server, caches the result, and returns it.' This works because CDNs are designed as transparent proxies — they sit between clients and servers. For Redis, read-through means the cache must know how to query your database, which 'adds complexity and usually requires a specialized caching library or service.' Cache-aside keeps data access logic in the application.",
    "interviewScript": "In your interview, say: 'CDNs are natural read-through caches because they're already positioned as intermediaries — the cache IS the proxy. For Redis, read-through means coupling the cache to my data access layer, requiring specialized libraries. Cache-aside is simpler because the application owns the DB query logic and treats Redis as a pure key-value store.'",
    "proTip": "The content says 'there are very few reasons to propose read-through in system design interviews unless you're discussing CDNs.' Use this to avoid over-engineering."
  },
  {
    "id": "q27",
    "subtopic": "LFU + FIFO (Clustered)",
    "style": "Decision Framework Application",
    "question": "You're choosing an eviction policy for a video streaming platform's cache. Some videos trend for 2-3 days then disappear, while others (classics) are consistently popular over months. A third category is new uploads that may or may not become popular. Which eviction policy best handles this mixed workload and why?",
    "options": [
      "FIFO, because it evicts the oldest entries first, naturally removing videos that haven't been popular recently. It's simple to implement with a queue.",
      "LRU, because it evicts the least recently accessed video. This handles trending videos well since they're accessed frequently while trending, and naturally evicted when the trend ends.",
      "LFU (or approximate LFU), because it maintains access frequency counters that distinguish consistently popular classics (high frequency) from flash-in-the-pan trends (lower cumulative frequency). The content notes LFU 'works well when certain keys are consistently popular over time, like trending videos or top playlists.' FIFO would be worst here — it ignores usage patterns entirely and might evict a classic film to make room for a new upload.",
      "TTL-only with no eviction policy. Set a 7-day TTL on all videos and let them expire naturally."
    ],
    "correctIndex": 2,
    "explanation": "The content specifically maps LFU to this use case: 'works well when certain keys are consistently popular over time, like trending videos or top playlists.' LFU's frequency tracking ensures classic videos (high cumulative access count) survive eviction while flash trends with lower total access get evicted first. FIFO is explicitly called out as problematic: 'it ignores usage patterns' and 'may evict items that are still hot.' LRU would evict classics during overnight low-traffic hours.",
    "interviewScript": "In your interview, say: 'LFU is the best fit here. It tracks access frequency, so classic videos with thousands of cumulative views survive eviction even during overnight dips, while new uploads that don't gain traction are evicted first. FIFO would be dangerous — it ignores popularity entirely and could evict a classic. LRU works for trending content but might evict long-tail classics during quiet hours.'",
    "proTip": null
  },
  {
    "id": "q28",
    "subtopic": "TTL (Time To Live)",
    "style": "Estimation-Backed Reasoning",
    "question": "You're setting TTLs for different cached data types in your system. Session tokens, user profiles, and a global leaderboard all need different TTLs. Given that your session timeout is 30 minutes, profiles change on average once per week, and the leaderboard updates every 5 minutes from a batch job, what's the optimal TTL strategy?",
    "options": [
      "Set all three to 5 minutes for simplicity. Uniform TTLs are easier to manage and debug.",
      "Sessions: 30 minutes (matching session timeout). Profiles: 10-15 minutes (much shorter than change frequency to limit staleness, but long enough for high hit rates). Leaderboard: 5 minutes (matching the batch job refresh cycle — no point caching beyond the next update). The content states TTL is 'a must have when data must eventually refresh, like API responses or session tokens.'",
      "Sessions: no TTL (let the application manage expiration). Profiles: 24 hours (since they change weekly). Leaderboard: 1 minute (for near-real-time updates).",
      "Sessions: 30 minutes. Profiles: 7 days (matching change frequency). Leaderboard: no TTL (invalidate on write from the batch job)."
    ],
    "correctIndex": 1,
    "explanation": "Optimal TTLs balance freshness and hit rate for each data type. Sessions at 30 minutes match the session timeout — the content calls out session tokens as a key TTL use case. Profiles at 10-15 minutes mean worst-case staleness is 15 minutes on weekly-changing data, which is acceptable while maintaining high hit rates. Leaderboard at 5 minutes matches the refresh cycle — caching beyond that serves guaranteed-stale data. A 7-day TTL on profiles means a changed profile stays stale for up to a week.",
    "interviewScript": "In your interview, say: 'I'd match TTLs to data freshness requirements. Sessions get 30-minute TTL matching our timeout policy. Profiles get 10-15 minute TTL — short enough to limit staleness but long enough for 95%+ hit rate on data that changes weekly. Leaderboard gets exactly 5 minutes to match the batch refresh — caching longer serves stale data with no benefit.'",
    "proTip": null
  },
  {
    "id": "q29",
    "subtopic": "TTL (Time To Live)",
    "style": "Multi-Hop Reasoning",
    "question": "Your system uses cache-aside with TTL. You set a 60-second TTL on trending post feeds. During a viral event, the feed changes every 5 seconds but the cache serves the version from up to 60 seconds ago. You shorten the TTL to 5 seconds to improve freshness. What second-order problem does this create, and how should you actually solve it?",
    "options": [
      "A 5-second TTL works fine. The cache still provides significant latency reduction (1ms vs 50ms) and the data is nearly real-time.",
      "A 5-second TTL on a viral feed creates a cache stampede every 5 seconds. During a viral event, thousands of users are viewing the feed simultaneously. Every 5 seconds, the cache expires and all those requests hit the database at once. The correct solution is to keep the 60-second TTL for stampede protection but add cache invalidation on writes — when the feed updates, invalidate the cache entry and use request coalescing so only one rebuild query fires.",
      "The 5-second TTL causes the cache to use too much memory due to frequent key creation and deletion. Keep the 60-second TTL and accept the staleness.",
      "The problem is that a 5-second TTL makes the cache indistinguishable from a direct database read. Remove caching entirely during viral events."
    ],
    "correctIndex": 1,
    "explanation": "Shortening TTL to match data change frequency turns every expiration into a potential stampede. During a viral event with high concurrency, a 5-second TTL means a thundering herd every 5 seconds. The content's stampede solutions (request coalescing, cache warming) combined with write-based invalidation solve this better: invalidate when data actually changes, and use request coalescing to ensure only one rebuild query fires regardless of concurrent demand.",
    "interviewScript": "In your interview, say: 'Shortening TTL to 5 seconds creates a stampede every 5 seconds during peak traffic. Instead, I'd keep a longer TTL as a safety net and add write-based invalidation — when the feed updates, delete the cache entry. Request coalescing ensures only one DB query rebuilds the cache while thousands of concurrent requests wait for that result. This gives me both freshness and stampede protection.'",
    "proTip": "This question chains three concepts: TTL, stampede, and invalidation strategy. In interviews, always think about second-order effects when changing caching parameters."
  },
  {
    "id": "q30",
    "subtopic": "Interview Strategy",
    "style": "Interviewer Pushback",
    "question": "You're 5 minutes into a system design interview for a URL shortener. You immediately say: 'We should add a Redis cache to reduce database load.' The interviewer responds: 'Why do we need caching?' What's the problem with your approach, according to the content?",
    "options": [
      "Nothing is wrong — caching is always needed for read-heavy systems, and a URL shortener is read-heavy.",
      "You jumped to caching without establishing the need first. The content says: 'Don't jump straight to caching. You need to establish why it's necessary first.' You should first quantify the problem: estimate read volume, calculate DB load, identify the bottleneck, then propose caching as the solution. Without this, caching appears as a premature optimization.",
      "The issue is that you proposed Redis specifically. You should have said 'an external cache' without naming a technology.",
      "URL shorteners don't need caching because the database query (single key lookup) is already fast enough. The interviewer is telling you caching is wrong here."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly instructs: 'Don't jump straight to caching. You need to establish why it's necessary first.' It then provides a clear pattern: identify the bottleneck → quantify it with numbers → explain how caching solves it. For a URL shortener, you should first estimate: '100M short URLs, 1B redirects/day, each redirect is a DB lookup at 5-10ms. That's 11.5K QPS on the database. A cache drops this to sub-millisecond for popular URLs and reduces DB load by 80%.'",
    "interviewScript": "In your interview, say: 'You're right to push back. Let me quantify the need. If we have 1B redirects per day, that's ~11.5K QPS. Each URL lookup takes 5-10ms from the database. The same popular URLs are looked up repeatedly. A cache gives us sub-millisecond lookups for popular URLs and reduces DB load by 80-90%. That's why we need it.'",
    "proTip": "The content provides a checklist of when to bring up caching: read-heavy workload, expensive queries, high DB CPU, latency requirements. Always use one of these as your justification."
  },
  {
    "id": "q31",
    "subtopic": "Interview Strategy",
    "style": "Anti-Pattern Identification",
    "question": "A candidate designing a real-time chat application proposes caching every message in Redis with a 24-hour TTL. They say: 'Messages are read frequently, so we should cache them all.' The content's guidance on 'what to cache' reveals why this is a flawed strategy. What's wrong?",
    "options": [
      "The TTL is too long. Messages should have a 5-minute TTL for real-time freshness.",
      "Redis can't handle the volume. A chat app generates too many messages per second for Redis.",
      "The candidate violates the content's guidance: 'Not everything should be cached. Focus on data that is read frequently, doesn't change often, and is expensive to fetch.' Chat messages are read only a few times (when the recipient sees them), are generated constantly (high write volume), and a single message lookup by ID is a cheap indexed query. Caching every message wastes Redis memory on rarely-re-read data while the truly expensive query — loading a conversation's recent messages — might not be addressed.",
      "Chat messages are too small to benefit from caching. The latency difference between a cached and uncached small text message is negligible."
    ],
    "correctIndex": 2,
    "explanation": "The content's framework for deciding what to cache is: 'data that is read frequently, doesn't change often, and is expensive to fetch or compute.' Individual chat messages fail all three criteria: they're read only a few times, they're generated constantly, and a single indexed lookup is cheap. The correct approach would be to cache conversation previews or recent message lists — aggregations that are read frequently and expensive to compute.",
    "interviewScript": "In your interview, say: 'I wouldn't cache individual messages — they're read just a few times, generated constantly, and cheap to fetch by ID. Instead, I'd cache the expensive queries: conversation previews showing the last message for each chat, and the recent message list for active conversations. These are read frequently, computed from joins, and change less often than individual messages.'",
    "proTip": null
  },
  {
    "id": "q32",
    "subtopic": "Interview Strategy",
    "style": "Ordering/Sequencing",
    "question": "The content provides a systematic framework for introducing caching in interviews. You've just identified that your database CPU is at 80% during peak hours from repeated identical queries. In what order should you present your caching strategy?",
    "options": [
      "1. Choose Redis as the cache. 2. Explain the cache-aside pattern. 3. Set LRU eviction. 4. Address consistency. 5. Identify what to cache.",
      "1. Identify the bottleneck (DB CPU at 80% from repeated queries). 2. Decide what to cache (the repeated queries — specify which data and cache key design). 3. Choose cache architecture (cache-aside for this use case). 4. Set eviction policy (LRU + TTL). 5. Address downsides (invalidation strategy, cache failure handling, potential stampedes).",
      "1. Address downsides first to show awareness. 2. Choose the architecture. 3. Decide what to cache. 4. Set eviction. 5. Identify the bottleneck.",
      "1. Propose CDN caching. 2. Add Redis. 3. Add in-process caching. 4. Explain the bottleneck."
    ],
    "correctIndex": 1,
    "explanation": "The content provides this exact 5-step framework: (1) Identify the bottleneck, (2) Decide what to cache, (3) Choose your cache architecture, (4) Set an eviction policy, (5) Address the downsides. This order is deliberate — you establish the WHY before the HOW, choose what to cache before how to cache it, and address downsides last to show you understand the trade-offs after presenting the solution.",
    "interviewScript": "In your interview, say: 'Let me walk through my caching strategy systematically. First, the bottleneck: DB CPU at 80% from repeated identical queries. Second, what to cache: [specific queries and key design]. Third, architecture: cache-aside with Redis. Fourth, eviction: LRU with 10-minute TTL. Fifth, failure handling: cache invalidation on writes, circuit breakers for Redis failure, and request coalescing for stampede prevention.'",
    "proTip": "Following a clear, numbered framework in your interview shows structured thinking. Interviewers remember candidates who present systematically rather than stream-of-consciousness."
  },
  {
    "id": "q33",
    "subtopic": "Interview Strategy",
    "style": "Cross-Subtopic Bridge",
    "question": "You're in a staff-level interview and have just proposed cache-aside with Redis, LRU eviction, and TTL. The interviewer says: 'What happens when things go wrong?' The content advises focusing on 'important but non-obvious scenarios' for staff-level candidates. Which combination of failure scenarios would most impress the interviewer?",
    "options": [
      "Discuss Redis running out of memory, keys not being found, and network latency to Redis increasing.",
      "Discuss cache invalidation race conditions (read between invalidation and DB commit re-caches stale data), Redis failure cascading to the database (circuit breakers + in-process fallback), and thundering herd on popular key expiration (request coalescing). Then explicitly say you won't cover basic scenarios like 'what if a key doesn't exist' because the interviewer can assume you handle cache misses.",
      "List every possible failure mode: Redis down, network partition, key not found, TTL too short, TTL too long, LRU evicting important data, hot keys, cold start, stale data, etc.",
      "Focus solely on the thundering herd problem since it's the most complex. Spend 5 minutes on the single-flight implementation details."
    ],
    "correctIndex": 1,
    "explanation": "The content advises for staff-level: 'focus on the important but non-obvious scenarios rather than burning time on things the interviewer can already assume.' The three selected scenarios (invalidation race, failure cascade, thundering herd) are non-obvious and demonstrate deep understanding. Listing every failure mode wastes time on obvious ones. Focusing on just one misses the breadth expected at staff level.",
    "interviewScript": "In your interview, say: 'Three failure scenarios I'd highlight. First, cache invalidation has a race condition — a read between invalidation and DB commit can re-cache stale data; short TTLs are my safety net. Second, Redis failure cascades to the database; I'd add circuit breakers and a small in-process cache as a last resort. Third, thundering herd on popular key expiration; I'd use request coalescing so only one request rebuilds the cache.'",
    "proTip": "The content says: 'Don't list every possible problem. Pick one or two that are relevant.' For staff-level, pick the non-obvious ones. For SDE2, covering the basics thoroughly is fine."
  }
];

export default {
  questions: QUESTIONS
};
