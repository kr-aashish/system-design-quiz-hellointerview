// === COVERAGE MANIFEST ===
// Subtopic: Relational Databases (SQL) — Questions: 4 — IDs: [q1, q2, q3, q4]
// Subtopic: Normalization vs Denormalization — Questions: 3 — IDs: [q5, q6, q7]
// Subtopic: Scaling and Sharding — Questions: 3 — IDs: [q8, q9, q10]
// Subtopic: Document Databases — Questions: 2 — IDs: [q11, q12]
// Subtopic: Key-Value Stores — Questions: 2 — IDs: [q13, q14]
// Subtopic: Start with Requirements — Questions: 2 — IDs: [q15, q16]
// Subtopic: Entities, Keys & Relationships — Questions: 2 — IDs: [q17, q18]
// Subtopic: Database Selection Decision Framework — Questions: 2 — IDs: [q19, q20]
// Subtopic: Wide-Column Databases — Questions: 1 — IDs: [q21]
// Subtopic: Graph Databases (Anti-pattern) — Questions: 1 — IDs: [q22]
// Subtopic: Indexing for Access Patterns — Questions: 1 — IDs: [q23]
// Subtopic: Constraints & Data Integrity — Questions: 1 — IDs: [q24]
// Cross-subtopic: SQL choice × Sharding strategy — Questions: 1 — IDs: [q25]
// Cross-subtopic: Normalization × Access Patterns — Questions: 1 — IDs: [q26]
// Cross-subtopic: Document DB embedding × Consistency Requirements — Questions: 1 — IDs: [q27]
// Anti-pattern questions: 3 — IDs: [q22, q12, q10]
// Gotcha/trap questions: 3 — IDs: [q4, q9, q18]
// Total: 27 questions across 12 subtopics
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Relational Databases (SQL)",
    "style": "Scenario-based reasoning",
    "question": "You're designing a SaaS platform for project management where data integrity is critical: users must exist before creating tasks, tasks must reference valid project IDs, and deleting a user should handle their tasks appropriately. You're choosing between PostgreSQL with foreign keys and MongoDB with embedded documents. Why is PostgreSQL the better choice despite MongoDB's flexibility?",
    "options": [
      "MongoDB's denormalized model fits this workload because embedding tasks inside the user document gives you atomic single-document updates, and PostgreSQL's foreign keys add cross-table contention on every task creation that hurts throughput at moderate scale",
      "PostgreSQL enforces referential integrity at the database level, preventing orphaned records; MongoDB embeds documents but risks inconsistency when relationships change, requiring application logic to maintain integrity",
      "PostgreSQL's foreign key constraints are checked deferred at commit time, so they catch invalid references but only after the row is already written, while MongoDB's schema validation rejects bad references synchronously on insert and is therefore a stricter integrity guarantee",
      "Both databases enforce relationships equivalently — PostgreSQL via foreign keys and MongoDB via $lookup index validation — so the real differentiator here is PostgreSQL's transaction isolation level, which prevents the lost-update anomaly when two users edit the same task concurrently"
    ],
    "correctIndex": 1,
    "explanation": "The article emphasizes: 'Relational databases provide referential integrity via foreign keys, ensuring relationships remain valid.' With MongoDB's embedded model, if you embed user data in tasks and the user updates their name, you must update every task document — creating consistency risk. PostgreSQL's foreign key constraints prevent orphaned records at the DB level. This is the fundamental advantage of relational schemas: structural guarantees. Option C is outdated (MongoDB now supports ACID transactions). Option D is wrong — foreign keys can be configured for different behaviors (restrict, cascade, set null), not automatic deletion.",
    "interviewScript": "In your interview, say: 'For this data model, referential integrity is critical. PostgreSQL enforces foreign key constraints at the database level, preventing orphaned user IDs or invalid project references. MongoDB would require application code to maintain consistency when relationships change, which is error-prone. PostgreSQL's ACID guarantees are a better fit for a system where data integrity directly impacts business logic.'",
    "proTip": "Always ask: 'What happens when a relationship changes?' The answer often reveals whether you need a relational database's structural guarantees."
  },
  {
    "id": "q2",
    "subtopic": "Relational Databases (SQL)",
    "style": "Anti-pattern identification",
    "question": "During a system design interview, a candidate says: 'I'll use PostgreSQL for user accounts and MongoDB for everything else because SQL is too rigid for fast-moving features.' What's the critical flaw in this reasoning?",
    "options": [
      "The split is reasonable but the boundary is wrong — accounts belong in MongoDB because user documents naturally vary by signup method (OAuth vs email/password vs SSO add different fields), and MongoDB's schemaless storage handles that cleanly while PostgreSQL would need sparse columns or an EAV table",
      "The belief that SQL is 'rigid' is outdated; PostgreSQL supports JSON columns, schema evolution, and flexible queries while maintaining integrity. The real rigidity lies in MongoDB's lack of JOIN support when data relationships exist",
      "The framing assumes feature velocity and schema rigidity are correlated, but in practice MongoDB's lack of database-level constraints forces application code to defensively re-check every relationship on every write — which slows feature delivery more than schema migrations ever would on a modern PostgreSQL setup",
      "Polyglot persistence is correct in principle but the threshold is wrong — splitting databases is only justified when one workload is at least 10x the QPS of another, otherwise the operational cost of running two systems eclipses any performance gain you'd get from specialization"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Scalability concerns about SQL are often exaggerated.' A major misconception is that SQL is 'rigid.' Modern PostgreSQL offers JSON/JSONB columns for semi-structured data and supports ALTER TABLE for schema evolution. The rigidity risk is actually the opposite: MongoDB's document model discourages JOINs, forcing denormalization and embedding — which creates consistency problems. Polyglot persistence should be driven by access patterns and scalability needs, not by a misconception that SQL is inflexible. Using 'everything else MongoDB' is lazy design.",
    "interviewScript": "In your interview, say: 'PostgreSQL is far more flexible than the SQL-is-rigid stereotype suggests. It handles JSON, supports schema evolution, and provides ACID transactions. I'd use PostgreSQL as the default and only adopt another database (like MongoDB or Redis) when I have a specific access pattern or scalability requirement that SQL doesn't serve well.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "Relational Databases (SQL)",
    "style": "Failure analysis",
    "question": "A team reports that complex JOINs between 5 tables (users, orders, order_items, products, categories) are causing their 50,000 QPS read workload to degrade. They consider switching to MongoDB to 'avoid joins.' What's wrong with this solution?",
    "options": [
      "JOINs themselves are fine, but at 50,000 QPS the issue is connection-pool exhaustion: each multi-table query holds a connection longer, so concurrency suffers. MongoDB's connection-per-document model handles this concurrency profile better, which is why switching does help at this specific QPS threshold",
      "The problem isn't JOINs themselves — it's that they're not optimized. Indexes on foreign keys, query optimization (EXPLAIN ANALYZE), and possibly denormalization or caching are the real solutions. Switching to MongoDB just replaces the join problem with an embedding/consistency problem",
      "The 5-table JOIN is hitting PostgreSQL's planner cost limit, where the optimizer gives up on enumerating join orders and falls back to a worst-case nested-loop plan. MongoDB sidesteps this because $lookup is implemented as a direct hash join with no planner cost analysis stage",
      "JOIN cost grows superlinearly with table count beyond roughly 4 tables because the optimizer's search space explodes; the senior fix is to refactor toward fewer tables (denormalize categories into products), not switch databases — the database isn't wrong, the schema shape is"
    ],
    "correctIndex": 1,
    "explanation": "The article warns against blaming JOINs indiscriminately: 'Complex joins can be performance traps at scale' — but the solution isn't to abandon the relational model. Slow JOINs usually indicate missing indexes on foreign key columns or poorly written queries. The real solutions are: (1) index foreign keys, (2) use EXPLAIN to identify bottlenecks, (3) denormalize or cache specific aggregations if joins are legitimately slow. Switching to MongoDB trades a solved problem (indexable joins) for unsolved problems (embedding consistency, lack of aggregation power). This is a classic case of choosing the wrong tool to avoid fixing the underlying issue.",
    "interviewScript": "In your interview, say: 'If JOINs are slow, the first step is diagnosis: check if foreign key columns are indexed, review EXPLAIN plans, and look for cartesian products. Usually, proper indexing and query rewriting fixes the issue. Switching to MongoDB to avoid JOINs just creates a different set of problems — embedding means handling consistency manually. I'd optimize the queries first before considering schema changes.'",
    "proTip": "Remember: 'Complex joins can be performance traps' doesn't mean avoid joins — it means avoid poorly-designed joins. The difference is crucial."
  },
  {
    "id": "q4",
    "subtopic": "Relational Databases (SQL)",
    "style": "Gotcha question",
    "question": "You're designing a marketplace where users set their email as a unique identifier for login. Your schema has: `CREATE TABLE users (email VARCHAR(255) PRIMARY KEY, ...);` After 6 months, you realize users want to change their email. What's the technical problem with this design?",
    "options": [
      "VARCHAR primary keys force PostgreSQL to use string comparison on every JOIN, which is roughly 4-8x slower than integer comparison; at marketplace scale, this translates to measurable latency increases on order lookups and is the real reason email-as-PK is discouraged",
      "Changing an email that's a primary key requires updating all foreign key references in related tables, and if any orders or transactions reference this email, you risk breaking referential integrity constraints",
      "Email-as-primary-key bloats the B-tree index because each entry stores up to 255 bytes instead of the 8 bytes a BIGINT would use, increasing the index footprint by ~30x and pushing more pages out of the buffer cache for read-heavy workloads",
      "Email values aren't guaranteed unique across providers due to plus-addressing (`user+tag@gmail.com` vs `user@gmail.com`), so the UNIQUE constraint silently allows duplicates that the application treats as the same identity"
    ],
    "correctIndex": 1,
    "explanation": "The article explicitly states: 'Use system-generated primary keys, not business data.' Email is business data that users expect to change. If email is the primary key and a user changes it, every foreign key reference in orders, reviews, favorites tables must also update. This violates the principle that primary keys should be immutable. A better design is a system-generated user_id as the primary key, with email as a UNIQUE but changeable column. This is a common real-world gotcha that reveals whether you understand the semantic difference between identity and attributes.",
    "interviewScript": "In your interview, say: 'I'll use a system-generated user_id as the primary key, with email as a unique but nullable and changeable column. This separates identity (the ID) from attributes (the email). If I used email as the primary key and a user changes it later, I'd have to update all foreign key references across the system — a maintenance nightmare.'",
    "proTip": "A good heuristic: 'If this value could change, it shouldn't be a primary key.' Email, phone number, and customer ID are attributes, not identities."
  },
  {
    "id": "q5",
    "subtopic": "Normalization vs Denormalization",
    "style": "Scenario-based trade-offs",
    "question": "You're building a Twitter-like system where every feed query requires joining tweets, users, and counts (retweets, likes, replies). You denormalize by storing denormalized tweet records with embedded user names and total counts. A user changes their name. What's the operational cost of your denormalization decision?",
    "options": [
      "Denormalized name fields can be kept consistent via a database trigger that fires on user-table updates, so the cost is one extra trigger execution per name change — the writes themselves stay localized to the user record and the index propagates the change lazily",
      "You must update every tweet in the database containing that user's old name. With 100 million tweets, this could be millions of updates. Denormalization accepts this write complexity to speed up feed reads",
      "The cost is index bloat — every tweet now carries a denormalized user-name string, so the per-row footprint grows from ~50 bytes to ~150 bytes. With 100M tweets that's ~10GB of additional index pressure, which slows feed scans by pushing data out of the buffer cache",
      "The cost is consistency divergence — different replicas may reflect the new name at different times, and a user reading their own profile may see stale tweets attributed to their old name even after the user table has been fully updated, until replication lag closes"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Denormalization creates consistency problems.' When you embed user.name in each tweet, changing the user's name requires updating N tweet rows. This is a classic denormalization trade-off: faster reads (no join needed) at the cost of slower, more complex writes (cascading updates). For a name change (rare), this is acceptable. But for frequently-changing fields (like follower count), denormalization becomes untenable. The key insight: denormalize fields that change infrequently, or use a different strategy (caching, materialized views).",
    "interviewScript": "In your interview, say: 'I'd denormalize user names and counts into the tweet document because feed reads happen constantly but user names change rarely. However, I'm accepting the cost: when a user changes their name, I must update millions of tweet records. For fields that change frequently, I wouldn't denormalize — I'd use a cache or keep them normalized.'",
    "proTip": "Denormalization is a conscious trade-off, not a free lunch. Always ask: 'How often does this data change?' If it's frequently, denormalization is a trap."
  },
  {
    "id": "q6",
    "subtopic": "Normalization vs Denormalization",
    "style": "Decision framework",
    "question": "Your analytics dashboard queries product popularity (sales count per category) millions of times per day, but product metadata (name, category, price) changes only during daily inventory updates. Your two options are: (1) normalize (join products and sales every query) or (2) denormalize (update materialized aggregate tables during inventory updates). Which is better and why?",
    "options": [
      "Normalization — the join cost is fixed and predictable, while denormalized aggregate tables drift over the course of the day as products are sold, producing slightly stale popularity numbers that erode dashboard accuracy in ways analysts will notice and complain about",
      "Denormalization — materialized aggregate tables serve pre-computed results at query time, eliminating joins. The cost (updating aggregates during inventory updates) is acceptable because updates happen once daily, while reads happen millions of times",
      "Normalization with a covering index on (category_id, product_id, sale_count) — modern query optimizers can answer the popularity query directly from the index without touching the heap, which performs better than a materialized table that has to be kept in sync",
      "Denormalization is right but the implementation should use database triggers rather than batch jobs — triggers keep the aggregate table consistent on every sale, so dashboard freshness is real-time rather than 24 hours behind, with the same per-query read cost"
    ],
    "correctIndex": 1,
    "explanation": "The article identifies this exact pattern: 'Denormalization is appropriate for analytics and event logs where reads vastly outnumber writes.' With millions of read queries against one daily update cycle, materialized views (pre-computed aggregations) are ideal. The cost is incurred once daily, while the benefit accrues millions of times. This is a clear win for denormalization because the read/write ratio is extreme and the update is batched (not real-time). Caching is an alternative but materialized views are persistent and reliable.",
    "interviewScript": "In your interview, say: 'For an analytics workload where reads outnumber writes by millions to one, I'd use materialized views. Every night during the inventory update window, I'd recompute aggregate tables with sales counts per category. Queries read the pre-computed results with no joins. The upfront cost (recomputing aggregates daily) is worth the read performance at scale.'",
    "proTip": "The denormalization rule of thumb: if reads >> writes by at least 100:1, denormalization becomes attractive. Analytics dashboards are the textbook case."
  },
  {
    "id": "q7",
    "subtopic": "Normalization vs Denormalization",
    "style": "Anti-pattern identification",
    "question": "A junior engineer proposes: 'Let's denormalize everything — cache user data, cache product data, cache counts. It's faster than joins.' Why is this 'denormalize everything' approach naive?",
    "options": [
      "Caching is an inferior alternative to denormalization because caches introduce their own consistency problems (cache invalidation, TTL tuning, thundering herd on cache miss) that are at least as complex as denormalization's write amplification, and denormalization provides guaranteed sub-millisecond reads directly from the database without the operational overhead of a separate caching layer like Redis or Memcached",
      "Denormalization eliminates the need for caching entirely because the denormalized data is already co-located with the query path, so reads hit the database directly at the same speed a cache would provide — adding a cache on top of denormalized data is redundant and adds unnecessary infrastructure complexity",
      "Denormalization of frequently-changing data (like counts) creates consistency nightmares: you must synchronize writes across many places, and stale data is unavoidable. Caching is a better approach: the source of truth stays normalized and consistent, caches expire independently",
      "Modern databases with columnar storage engines and adaptive query optimizers are fast enough that denormalization is unnecessary for any workload under approximately 100,000 QPS — the performance difference between a normalized join and a denormalized read is negligible until you hit extreme scale, so the junior engineer's instinct is correct but premature"
    ],
    "correctIndex": 2,
    "explanation": "The article explicitly advises: 'Cache as alternative to denormalization.' Denormalization and caching serve similar goals (speed) but differently. Denormalization embeds data in multiple places, creating sync problems. Caching keeps the source of truth normalized and separate, letting each cache expire independently. For frequently-changing data (like counts or user balances), caching is far superior: the count updates in one place (database), caches invalidate, and consistency is maintained at the source. Denormalizing counts means updating many rows whenever a count changes.",
    "interviewScript": "In your interview, say: 'I'd differentiate between denormalization and caching. Denormalize infrequently-changing data (like user names in tweets) where the consistency cost is bearable. For frequently-changing data (like counts), use caching instead: keep the source of truth normalized, cache aggressively, and let caches expire independently. This gives you read speed without sacrificing consistency.'",
    "proTip": null
  },
  {
    "id": "q8",
    "subtopic": "Scaling and Sharding",
    "style": "Scenario-based reasoning",
    "question": "You're designing a user service handling 100,000 QPS across 1 million users. Your primary query is 'get user by user_id.' You decide to shard by user_id (e.g., shard = user_id % num_shards). After launch, your traffic profile evolves: celebrity influencers gain millions of followers. Reading their follower lists (filtering by user_id and following_id) is now a hot shard. What's the core problem?",
    "options": [
      "Sharding by user_id is the wrong choice for this workload because user_id-based sharding creates chronologically imbalanced shards — earlier-registered users accumulate more data over time, so lower user_id shards become disproportionately large. A hash-based approach on a time-bucketed key would distribute data more evenly across the cluster",
      "Sharding always creates hot shards due to the power-law distribution of real-world access patterns, and there's no practical solution — you can mitigate with caching or rate limiting at the application layer, but the fundamental skew is inherent to any shard key derived from user behavior and cannot be eliminated by choosing a different key",
      "Your shard key (user_id) aligns with the original access pattern ('get user by ID') but doesn't match the new pattern ('list followers'). For follower lists, you might need a composite shard key like (user_id, follower_id) or separate followers table sharded differently, introducing cross-shard complexity",
      "You should use a NoSQL database instead of sharded SQL because NoSQL databases like DynamoDB and Cassandra handle hot partitions automatically through adaptive capacity rebalancing, which detects skewed access patterns and redistributes data in real time without requiring manual shard key redesign"
    ],
    "correctIndex": 2,
    "explanation": "The article warns: 'Shard by primary access pattern... shard key choice is often permanent.' Your initial shard key (user_id) is optimal for 'get user' but suboptimal for 'list followers' — a different access pattern that emerges later. The real lesson: shard key selection depends on your dominant query pattern. Once chosen, changing it is extremely painful. For a social graph, you might need separate sharding strategies for different tables (users sharded by user_id, followers sharded by followed_user_id). This creates cross-shard complexity but prevents hot shards.",
    "interviewScript": "In your interview, say: 'Shard key selection is critical because it's hard to change. I'd identify the dominant access patterns first. For a social platform, 'get user' would be sharded by user_id, but 'list followers' might need its own sharding strategy (sharded by followed_user_id) to avoid concentrating celebrity followers on one shard.'",
    "proTip": "Shard key choice is often permanent. Getting it wrong at scale is expensive. Always validate your access patterns before finalizing the shard key."
  },
  {
    "id": "q9",
    "subtopic": "Scaling and Sharding",
    "style": "Gotcha question",
    "question": "You design a time-series events system for IoT sensors. You decide to shard by timestamp: shard = (date % num_shards). This distributes events evenly across shards. You then receive a query: 'Find all events for sensor_id=42 in the last 7 days.' Why does this query become expensive?",
    "options": [
      "Time-series data inherently requires cross-shard queries because any meaningful analysis spans multiple time windows, so no shard key can avoid scatter-gather — the issue isn't the shard key choice but rather the lack of a pre-aggregation layer that computes per-sensor summaries before they're sharded",
      "Your shard key (timestamp) doesn't match the query pattern (sensor_id + date range). Finding events for one sensor requires querying ALL shards, since the sensor's events are scattered across every shard by timestamp. This is a cross-shard query that's expensive to execute and merge",
      "You should use a graph database for IoT sensor data because the relationships between sensors, their locations, and their readings form a natural graph structure that enables efficient traversal-based queries like 'find all sensors in building X that reported anomalies in the last 7 days'",
      "Sharding by timestamp is actually the best approach for time-series data because it enables efficient time-range pruning — a 7-day query only needs to touch 7 shards rather than scanning the entire dataset, and the sensor_id filter can be applied as a secondary index within each shard, which is faster than the alternative of scanning a sensor_id-sharded table across all time ranges"
    ],
    "correctIndex": 1,
    "explanation": "The article explicitly warns: 'Time-range sharding anti-pattern (hot shard).' While time-range sharding avoids hot shards (events distribute evenly), it creates a different problem: queries by entity ID become cross-shard queries. Your query 'sensor_id=42, last 7 days' must hit every shard, collect results, and merge them. For a better approach, shard by sensor_id (or sensor_id + bucket), accepting that some sensors might have more events, but keeping sensor-specific queries fast and local to one shard.",
    "interviewScript": "In your interview, say: 'Sharding by timestamp distributes events evenly but breaks entity-based queries. When I query for a specific sensor's events, I hit every shard. A better approach for sensor data: shard by sensor_id to keep sensor-specific queries local to one shard. I'd manage hot sensors (heavy hitters) with separate strategies like exponential backoff or request coalescing.'",
    "proTip": "Don't shard by time hoping to avoid hot shards — you'll just trade one problem for another. Shard by your primary entity (sensor_id, user_id, account_id)."
  },
  {
    "id": "q10",
    "subtopic": "Scaling and Sharding",
    "style": "Anti-pattern identification",
    "question": "A team over-designs their sharding strategy: they shard users by user_id, but then also shard orders by order_id, and fulfill-ment by fulfillment_id. Each table uses a different shard key. A 'create order' transaction must check user balance, create an order, and trigger fulfillment. Why is this sharding strategy problematic?",
    "options": [
      "Different shard keys ensure data is distributed evenly across the cluster, which is the primary goal of sharding — co-locating related data on the same shard creates hotspots because some users place more orders than others, and the uneven distribution defeats the purpose of horizontal scaling",
      "Cross-shard transactions are impossible in any distributed system because distributed consensus protocols (2PC, 3PC, Paxos) can only coordinate reads across shards, not writes — once data is sharded, multi-entity writes must be handled asynchronously through event sourcing or saga patterns, not through synchronous transactions",
      "Different shard keys mean related data (user, order, fulfillment) live on different shards. A single transaction now requires coordinating across multiple shards — expensive, complex, and prone to consistency issues. A better approach: use user_id as the shard key for all tables so related data stays together",
      "You should avoid sharding entirely and instead use vertical scaling with read replicas — modern cloud database instances support up to 128 vCPUs and 4TB of RAM, which can handle the described workload without the operational complexity of cross-shard coordination, and the cost premium of a larger instance is offset by reduced engineering effort"
    ],
    "correctIndex": 2,
    "explanation": "The article emphasizes: 'Shard key choice is often permanent.' While choosing different shard keys might seem smart for load balancing, it violates locality: related entities (user, orders, fulfillments) end up on different shards. Transactions then require distributed consensus (2-phase commit or similar), which is slow and unreliable. A better approach: use a common shard key (user_id) across tables, accepting that some shards might be busier, then handle hot shards with caching or exponential backoff. Co-locating related data is worth more than perfect load distribution.",
    "interviewScript": "In your interview, say: 'I'd shard all tables by user_id so related entities (user, orders, fulfillment) live on the same shard. This keeps transactions local and avoids distributed consensus. If some users generate more traffic, I'd handle that with caching or request coalescing, not by using different shard keys for different tables.'",
    "proTip": "Prefer locality over perfect load distribution. Related data on the same shard is worth far more than balanced load across shards."
  },
  {
    "id": "q11",
    "subtopic": "Document Databases",
    "style": "Scenario-based reasoning",
    "question": "You're building a content management system where document schemas change frequently: some articles have authors, tags, categories, and multimedia; others are bare-bones. You consider MongoDB for schema flexibility. What's the key trade-off you're accepting?",
    "options": [
      "MongoDB provides better raw performance than SQL for read-heavy workloads because document databases store data in a binary serialization format (BSON) that maps directly to application objects without the row-to-object impedance mismatch that relational databases impose, reducing deserialization overhead per query",
      "Flexible schemas mean you lose structural validation. MongoDB won't prevent you from storing invalid data (article without author, tags as string instead of array). You must enforce consistency in application code, which is error-prone and hard to audit",
      "SQL databases don't support schema changes without full table locks and data migration scripts — adding a column to a table with 100 million rows requires hours of downtime for the ALTER TABLE operation, while MongoDB handles schema evolution transparently because each document is self-describing and can have different fields without any migration step",
      "MongoDB automatically validates schema correctness across all documents using its built-in JSON Schema validation feature, which enforces field types, required fields, and custom validation rules at the database level — giving you the same structural guarantees as SQL foreign keys but with the added flexibility of per-collection schema evolution"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Document databases... flexible schemas... only when schema changes frequently.' The flexibility is real, but the cost is real too: structural validation moves from the database to application code. In a relational database, columns enforce types (string, integer, date). In MongoDB, a field might be a string in one document and an array in another — unless your code prevents it. For genuinely schema-agnostic workloads (like logs or user-generated content), this is fine. For business-critical data (CMS articles that must have certain fields), you might want the database enforcing constraints. MongoDB is not a 'free schema flexibility' — it's a trade-off.",
    "interviewScript": "In your interview, say: 'MongoDB is attractive for schema flexibility, but I'm trading database-level validation for application-level validation. I'd ensure my code validates article structure everywhere it's created or updated. For frequently-evolving schemas where consistency isn't critical, this is fine. For business-critical data, I might prefer SQL's structural guarantees.'",
    "proTip": "Flexible schemas in MongoDB aren't free — they just move validation work from the database to your application code."
  },
  {
    "id": "q12",
    "subtopic": "Document Databases",
    "style": "Anti-pattern identification",
    "question": "A team chooses MongoDB because 'documents are just like objects in our code — we can map application objects directly to documents.' They embed related entities aggressively: a user document embeds all user preferences, all address history, all payment methods. Queries and updates become slow. What's the flaw?",
    "options": [
      "Embedding is always wrong in MongoDB because it violates normalization principles — the correct approach is to use separate collections with $lookup references for all relationships, which gives you the flexibility of MongoDB's schema model while maintaining the same relational separation that SQL enforces",
      "Object-to-document mapping is a good design pattern that should be followed consistently across the entire data model, because the primary advantage of document databases is eliminating the object-relational impedance mismatch, and selectively breaking this mapping by using references undermines the architectural coherence of the document model",
      "Embedding everything creates large documents, which slows down deserialization, indexing, and updates. Not all relationships should be embedded — only tightly coupled, infrequently-updated data. The seductive 'object = document' mental model ignores the cost of large, mutable documents",
      "MongoDB doesn't support references between documents, so embedding is the only option for modeling relationships — the $lookup aggregation stage is a server-side join that's prohibitively expensive at scale and should only be used for ad-hoc analytics queries, not for production read paths"
    ],
    "correctIndex": 2,
    "explanation": "The article warns: 'embed related data [but] only when schema changes frequently.' The seductive mental model is 'my User object has Preferences, so I'll embed preferences in the user document.' But embedded documents create performance problems: a user with 10 addresses and 20 payment methods is a 50KB+ document. Every query loads the entire document. Every update rewrites the whole document. MongoDB supports references and JOINs (via $lookup), which are the right choice for 1:N and N:M relationships. Embedding is only optimal for tightly-coupled 1:1 data that changes rarely.",
    "interviewScript": "In your interview, say: 'I'd be selective about embedding. A user document embeds one current address and payment method (tightly coupled, rarely change). But address history and all previous payments stay in separate collections with foreign key references. This keeps documents lean and queries fast.'",
    "proTip": null
  },
  {
    "id": "q13",
    "subtopic": "Key-Value Stores",
    "style": "Use-case identification",
    "question": "You're designing a session store for a web application. User sessions are accessed via session_id, updated on every request, and expire after 30 minutes of inactivity. Why is Redis (a key-value store) more appropriate than PostgreSQL for this workload?",
    "options": [
      "PostgreSQL is too slow for session workloads because its MVCC (Multi-Version Concurrency Control) architecture creates version bloat for frequently-updated rows like sessions, requiring aggressive autovacuum settings that compete with session reads for I/O bandwidth at high concurrency",
      "Redis provides in-memory storage (extremely fast), TTL (automatic expiration), and simple key-value operations that match the access pattern. PostgreSQL's complex query engine and ACID guarantees are unnecessary overhead for a workload that just needs 'get', 'set', and 'expire'",
      "Key-value stores are always faster than SQL databases for any workload because they skip query parsing, plan optimization, and transaction management entirely — the overhead of SQL's query planner alone adds 2-5ms per query, which is unacceptable for session lookups that need sub-millisecond latency",
      "PostgreSQL doesn't support the required TTL-based expiration queries natively — you'd need to implement expiration via a background cron job that periodically scans and deletes expired sessions, which is operationally fragile and creates lock contention during cleanup sweeps at scale"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Key-Value Stores... simple lookups by key... For caching, session storage.' Sessions are the ideal key-value workload: every operation is a simple get/set by session_id, no complex queries, and data expires automatically. Redis's in-memory engine and TTL feature are perfectly matched to this pattern. PostgreSQL would work but it's overkill — you're paying for transaction overhead, query optimization, and persistence that you don't need. This is how you choose databases: match the access pattern to the database capability.",
    "interviewScript": "In your interview, say: 'For sessions, I'd use Redis: all queries are simple get/set by session_id, and I need automatic expiration via TTL. PostgreSQL supports this, but I'd be paying for ACID transactions, complex query planning, and disk I/O that sessions don't need. Redis is optimized for exactly this pattern.'",
    "proTip": "Choosing a database is about matching access patterns, not absolute performance. A key-value store shines when queries are simple key lookups."
  },
  {
    "id": "q14",
    "subtopic": "Key-Value Stores",
    "style": "Scenario-based trade-offs",
    "question": "You use Redis as a cache alongside PostgreSQL. Your cache key format is 'user:{user_id}:profile'. When a user updates their profile, you must delete the cache entry, then update the database. A race condition: the cache entry is deleted but the database update fails. The user's profile is now missing from both cache and database. How would you avoid this?",
    "options": [
      "Cache invalidation is fundamentally impossible to get right in a distributed system due to the CAP theorem — you must accept inconsistency between cache and database as an inherent property of any caching architecture and design your application to tolerate stale reads",
      "Use write-through pattern: update the database first, then update the cache. If the cache update fails, the database is still correct and the cache will be repopulated on the next read",
      "Delete the cache first, then update the database — this is the correct order because it ensures that any concurrent readers will miss the cache and read directly from the database, getting the freshest data possible, whereas updating the database first risks a window where the cache serves stale data before it's updated",
      "Use a key-value store that supports native transactions between cache and database operations, such as Redis with its MULTI/EXEC command block, which provides atomic cache-and-persist semantics that eliminate the race condition entirely by treating the cache write and database write as a single atomic unit"
    ],
    "correctIndex": 1,
    "explanation": "The article addresses cache-database consistency: cache-aside (delete then update) creates the race condition you described. Write-through (update database first, then cache) is safer: if the cache update fails, the database is the source of truth and the cache is simply repopulated on the next read. Alternatively, cache-behind (update database first, then update cache asynchronously) is similar but allows async updates. The key insight: never delete the source of truth (database) before updating the cache. Always treat the database as authoritative.",
    "interviewScript": "In your interview, say: 'I'd use write-through: update the database first, then the cache. If the cache update fails, the database is correct and the cache will be repopulated on the next read. Never delete the source of truth first — that creates orphaned deletes when the subsequent database update fails.'",
    "proTip": "When coordinating cache and database, always update the source of truth (database) first. The cache is a performance optimization; the database is the source of truth."
  },
  {
    "id": "q15",
    "subtopic": "Start with Requirements",
    "style": "Framework question",
    "question": "You're designing a data model for a video streaming platform. Before choosing between SQL, NoSQL, or specialized databases, what are the three critical requirements questions you should ask first?",
    "options": [
      "How much data will we store? What programming language is our backend using? Will we need caching? These three factors determine the database choice because storage volume drives cost, language compatibility determines ORM support and driver maturity, and caching needs determine whether you need a dedicated cache layer or can rely on the database's built-in query cache",
      "What's the data volume? What are the primary access patterns? What are the consistency requirements? These three factors drive database selection more than any other consideration",
      "Should we use PostgreSQL or MongoDB? Should we shard? Should we denormalize? These are the three concrete architectural decisions that define the data layer, and answering them first forces you to think through the implementation constraints before getting bogged down in abstract requirements gathering",
      "How much money do we have for infrastructure? This is the primary constraint because database licensing costs, managed service pricing, and cloud storage fees vary dramatically between options, and the budget determines the feasibility of choices like Spanner (expensive but strong) versus PostgreSQL (cheap but requires more operational effort) before any technical analysis begins"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Three key factors: data volume, access patterns (most important), consistency requirements. Tie schema choices back to these factors explicitly.' Data volume determines whether a single server suffices or you need distributed storage. Access patterns determine database type (SQL for complex queries, key-value for simple lookups, document for flexible schemas). Consistency requirements determine whether you need ACID transactions or can tolerate eventual consistency. These three anchor all downstream decisions about sharding, denormalization, and caching. Skipping this analysis leads to technology choices that don't match your actual needs.",
    "interviewScript": "In your interview, say: 'Before I pick a database, I need to understand three things: (1) Data volume — how many users, videos, metadata? (2) Access patterns — is my primary query 'get video by ID' or 'search videos by title'? (3) Consistency — do I need ACID transactions or can metadata be eventually consistent? These three factors drive everything else.'",
    "proTip": "Interviewer is checking if you design top-down (requirements first) or bottom-up (technology first). Always start with requirements."
  },
  {
    "id": "q16",
    "subtopic": "Start with Requirements",
    "style": "Scenario-based reasoning",
    "question": "You're designing a real-time stock trading system. Data volume: 10 million stock prices updated every second. Access pattern: (1) get latest price by ticker; (2) get price history for a 30-day window. Consistency requirement: reads must reflect writes within 100ms for regulatory compliance. Why does this consistency requirement change your database choice?",
    "options": [
      "You should use MongoDB because its document model handles variable-frequency data (prices change every second, metadata rarely) better than PostgreSQL's rigid row structure, and MongoDB's built-in sharding automatically distributes high-volume writes across the cluster without manual partition management",
      "You can't meet sub-100ms consistency with any distributed database because network latency between data centers typically exceeds 50ms round-trip, and adding consensus protocol overhead (Raft leader election, quorum acknowledgment) pushes total write-to-read visibility beyond 100ms regardless of the database engine",
      "Sub-100ms consistency rules out eventually-consistent distributed systems (like Cassandra). You need strong consistency with minimal replication lag. PostgreSQL with read replicas and careful replication setup, or a single high-performance instance (vertical scaling first) is more appropriate than Cassandra's eventual consistency model",
      "Consistency requirements don't affect database choice because consistency is a property of the replication topology, not the database engine — any database can achieve strong consistency with synchronous replication, and any database will be eventually consistent with asynchronous replication, so the choice between PostgreSQL and Cassandra should be based on write throughput and query flexibility rather than consistency semantics"
    ],
    "correctIndex": 2,
    "explanation": "The article emphasizes: 'consistency requirements [are one of] three key factors.' Eventual consistency (where replicas might lag by seconds) is incompatible with trading regulations requiring <100ms consistency. Strong consistency systems like PostgreSQL with synchronous replication, or read replicas with replication lag monitoring, are necessary. This is how requirements drive architecture: regulatory constraints eliminate entire database categories (eventual-consistency systems), leaving you with strong-consistency options. A candidate who chooses Cassandra for this workload is ignoring the consistency requirement.",
    "interviewScript": "In your interview, say: 'The regulatory requirement for <100ms consistency eliminates eventual-consistency databases like Cassandra. A read might see a price from 5 seconds ago — unacceptable. I'd use PostgreSQL with synchronous replication to ensure writes propagate to replicas immediately, or start with a single high-performance instance and add read replicas with replication lag monitoring.'",
    "proTip": "Regulatory, legal, or business requirements often tighten consistency bounds. Always ask: 'What's the strictest consistency guarantee any feature needs?'"
  },
  {
    "id": "q17",
    "subtopic": "Entities, Keys & Relationships",
    "style": "Scenario-based reasoning",
    "question": "You're designing a bank account system. Your schema has `accounts(account_id, balance, ...)` and `transactions(transaction_id, account_id, amount, ...)`. You define account_id as a foreign key in transactions with ON DELETE CASCADE. A user accidentally deletes their account. What happens, and why is this dangerous?",
    "options": [
      "The account is deleted but transactions remain as orphaned records with a dangling foreign key reference — there's no danger because the transactions table's foreign key becomes a soft reference that the application can check and display as 'deleted user' in audit reports",
      "Transactions stay in the database but the foreign key reference breaks, causing referential integrity violations that surface as query errors whenever the application tries to JOIN transactions with accounts — this is the primary danger because it creates silent data corruption that only manifests during reporting queries",
      "All transactions for that account are automatically deleted. This permanently erases transaction history needed for auditing, tax records, and regulatory compliance. Cascading deletes are dangerous for audit logs",
      "The account can't be deleted due to the foreign key constraint — PostgreSQL's default ON DELETE behavior is RESTRICT, which prevents deletion of any parent row that still has dependent child rows, so the DELETE statement would fail with a constraint violation error and the account and transactions would both remain intact"
    ],
    "correctIndex": 2,
    "explanation": "The article discusses 'referential integrity vs write performance trade-off.' While ON DELETE CASCADE maintains referential integrity (no orphaned rows), it's semantically wrong for audit-critical data. Bank transactions are immutable history; deleting a transaction is a compliance violation. Better approach: use ON DELETE RESTRICT (prevents deletion if transactions exist) or soft deletes (mark account as deleted but don't remove it). The lesson: foreign key constraints have different semantics — choosing the right one matters for correctness, not just referential integrity.",
    "interviewScript": "In your interview, say: 'I'd use ON DELETE RESTRICT or SETNULL, not CASCADE. For audit-critical data like transactions, deletion must be prevented or the account must stay in the database (soft delete). Cascading deletes would erase transaction history, violating compliance requirements. The choice of referential integrity strategy depends on business semantics, not just database mechanics.'",
    "proTip": "Foreign key options have different semantics: RESTRICT prevents bad deletes, CASCADE erases data, SET NULL orphans records. Choose based on business logic, not convenience."
  },
  {
    "id": "q18",
    "subtopic": "Entities, Keys & Relationships",
    "style": "Gotcha question",
    "question": "You're modeling a many-to-many relationship: students can enroll in courses, and courses have many students. Your schema has `enrollments(student_id, course_id, grade)` where both student_id and course_id are foreign keys and together form the primary key. A student re-enrolls in the same course with a new grade. What happens when you insert the duplicate (student_id, course_id) pair?",
    "options": [
      "The database allows duplicate enrollments because composite primary keys only enforce uniqueness on individual columns, not the tuple — student_id must be unique and course_id must be unique, but the same pair can appear multiple times as long as neither column alone is duplicated",
      "The insert fails with a unique constraint violation. The composite primary key (student_id, course_id) prevents the same student from enrolling twice. You'd need to update the existing row instead, or use INSERT ... ON CONFLICT UPDATE (upsert) to handle re-enrollment",
      "The database automatically overwrites the old grade with the new one because composite primary keys in PostgreSQL implement last-write-wins semantics by default — when a conflicting tuple is inserted, the existing row is updated in place rather than raising an error, making re-enrollment work transparently",
      "This is a schema design error — composite primary keys should never be used for junction tables because they prevent the table from evolving: if you later need to track enrollment date, re-enrollment history, or multiple sections, you'll need to change the primary key, which requires migrating all foreign key references in dependent tables"
    ],
    "correctIndex": 1,
    "explanation": "Composite primary keys enforce uniqueness on the tuple (student_id, course_id). A re-enrollment attempt inserts the same tuple, violating the primary key constraint. The solution depends on your business logic: (1) disallow re-enrollment (RESTRICT), (2) update the existing enrollment (upsert), or (3) allow multiple enrollments by adding an enrollment_id. This gotcha reveals whether you understand composite key semantics: the uniqueness constraint is enforced on the entire key, not just parts of it.",
    "interviewScript": "In your interview, say: 'The composite primary key (student_id, course_id) prevents duplicate enrollments. If a student re-enrolls, the insert fails. I'd handle this with an upsert (INSERT ... ON CONFLICT UPDATE) to update the grade, or change the schema to include enrollment_id as the primary key if multiple enrollments per student-course pair are allowed.'",
    "proTip": "Composite keys enforce uniqueness on the full tuple, not individual columns. Understand which duplicates you want to prevent."
  },
  {
    "id": "q19",
    "subtopic": "Database Selection Decision Framework",
    "style": "Framework question",
    "question": "You're choosing between PostgreSQL and DynamoDB for a new service. PostgreSQL: complex queries, ACID, joins. DynamoDB: NoSQL, eventual consistency, fast key lookups, managed scaling. What question would help you choose?",
    "options": [
      "Which database was released more recently? Newer databases have learned from the design mistakes of older systems, so DynamoDB (launched 2012) incorporates lessons from PostgreSQL's scaling limitations and provides better default behaviors for distributed workloads",
      "Does your primary access pattern require complex queries (multiple conditions, joins, sorting)? If yes, SQL (PostgreSQL). If it's simple key/range lookups, NoSQL (DynamoDB) is a better fit",
      "Which database is more popular in the industry? Wider adoption means better community support, more Stack Overflow answers, richer ecosystem of tools and libraries, and a larger talent pool for hiring — all of which reduce long-term operational risk more than raw technical capability differences between databases",
      "You should always use PostgreSQL for critical data because its ACID guarantees and mature ecosystem make it the safe default for any service that handles user-facing data, and DynamoDB should be reserved for non-critical auxiliary data like analytics events and feature flags where eventual consistency is acceptable"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'When to choose SQL vs alternatives [is a] key decision framework.' The decision hinges on access patterns: SQL excels at flexible queries (filter by any column, join multiple tables, aggregate results). NoSQL excels at simple lookups (get by key, range query by sort key). DynamoDB can't efficiently answer 'find orders by status across all users' — you'd need to scan the entire table. PostgreSQL handles this trivially. If your primary queries are simple, DynamoDB's managed scaling and simplicity win. If queries are complex, PostgreSQL's flexibility is required.",
    "interviewScript": "In your interview, say: 'I'd start by listing my primary queries. If they're all simple key lookups or range queries, DynamoDB's managed scaling and simplicity are attractive. If I need complex filtering, aggregation, or joins, PostgreSQL's query flexibility is essential. Access patterns drive the choice.'",
    "proTip": "SQL vs NoSQL decision: List your top 5 queries. Can they be answered by key/range lookups alone, or do you need filtering, aggregation, and joins?"
  },
  {
    "id": "q20",
    "subtopic": "Database Selection Decision Framework",
    "style": "Scenario-based reasoning",
    "question": "You're designing a recommendation engine: given a user, find top 10 similar users based on interests, engagement, and activity. You consider PostgreSQL (for complex queries) and Neo4j (a graph database). Why do you choose PostgreSQL even though Neo4j 'feels like the right fit for relationships'?",
    "options": [
      "PostgreSQL is always faster than graph databases for relationship queries because PostgreSQL's B-tree indexes on foreign key columns provide O(log n) lookup for any relationship traversal, while graph databases use adjacency list storage that degrades to O(n) for filtered traversals when the relationship count exceeds the cache capacity",
      "Neo4j seems attractive because of the 'relationship' language, but most social graphs are better modeled with SQL: user interests in one table, engagement in another, queries use joins. Graph databases excel at true graph traversal (shortest path, relationship depth) which your recommendation doesn't need. PostgreSQL is simpler, cheaper, and better understood. Graph databases are often chosen to look impressive in interviews, not because they're actually needed",
      "Graph databases are being deprecated in favor of vector databases for recommendation workloads because modern embedding-based similarity search (using tools like pgvector or Pinecone) produces higher-quality recommendations than graph traversal by capturing semantic similarity rather than explicit relationship structure",
      "PostgreSQL doesn't natively support relationship queries, but its recursive CTE (Common Table Expression) syntax provides equivalent graph traversal capability for recommendation workloads by recursively joining the relationships table with itself to compute multi-hop similarity scores — and since CTEs are standard SQL, they're portable across any relational database"
    ],
    "correctIndex": 1,
    "explanation": "The article explicitly warns: 'Graph Databases... almost never the right choice in interviews. Even Facebook uses MySQL.' Recommendation engines seem like graph problems but they're actually similarity searches that SQL handles well. You're not traversing a relationship graph (shortest path between two users) — you're filtering and ranking. A graph database adds complexity (operational expertise, cost, limited query language) for a problem SQL solves naturally. This is a common interview trap: choosing exotic technology to impress, rather than choosing technology that fits the problem.",
    "interviewScript": "In your interview, say: 'Graph databases are tempting because social data has relationships. But I don't actually need graph traversal — I need to filter users by interests and engagement, then rank them. PostgreSQL handles this with straightforward joins and sorting. Graph databases would add unnecessary complexity. I'd choose PostgreSQL and reconsider Neo4j only if I needed true graph queries like shortest-path analysis.'",
    "proTip": "Graph databases are rarely the right choice in interviews. If you find yourself reaching for one, ask: 'Do I actually need graph traversal, or just relationship data?' Usually it's the latter."
  },
  {
    "id": "q21",
    "subtopic": "Wide-Column Databases",
    "style": "Use-case identification",
    "question": "You're building a time-series analytics system for IoT sensor data: 1 billion sensor readings per day, each with timestamp, sensor_id, value, and 100+ metrics. Queries are always 'get metrics for sensor_id in time range T1 to T2.' You consider Cassandra (a wide-column database). Why is it well-suited for this workload?",
    "options": [
      "Cassandra is faster than PostgreSQL for all workloads because its LSM-tree storage engine provides O(1) write performance regardless of data volume, while PostgreSQL's B-tree based storage degrades logarithmically as the dataset grows beyond memory capacity",
      "Cassandra's column family structure stores metrics as columns and time ranges as rows, optimized for write-heavy, time-series access. It scales horizontally for 1 billion writes/day and queries are range scans on (sensor_id, time), which Cassandra handles efficiently. It also provides tunable consistency",
      "PostgreSQL doesn't support time-series data natively and would require the TimescaleDB extension to handle time-bucketed queries efficiently, which adds operational complexity comparable to running a separate Cassandra cluster — so the choice between them is a wash in terms of operational burden, and Cassandra wins on write throughput alone",
      "Wide-column databases are always better than SQL for any workload exceeding 100 million rows because SQL's query planner overhead and transaction management become the dominant latency factors at that scale, regardless of whether the workload is read-heavy, write-heavy, or mixed"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Wide-Column Databases... write-heavy, time-series. Design around query patterns.' Cassandra is purpose-built for this pattern: millions of writes per second, queries by (partition key, time range), and horizontal scalability. A single PostgreSQL instance would struggle with 1B writes/day. Cassandra shines here because its data model (column families, time-ordered rows) matches the query pattern. This is why Cassandra exists: SQL can't efficiently scale write-heavy time-series workloads.",
    "interviewScript": "In your interview, say: 'For 1 billion sensor readings per day, I'd use Cassandra. It's designed for write-heavy time-series: data is sharded by sensor_id and stored in time order, so queries for a sensor's metrics over a time range hit one partition and scan sequentially. PostgreSQL would require complex sharding and still wouldn't match Cassandra's write throughput.'",
    "proTip": "Wide-column databases are niche but essential for specific patterns: high-volume writes, time-series, metric storage. Use them when SQL's write performance becomes a bottleneck."
  },
  {
    "id": "q22",
    "subtopic": "Graph Databases (Anti-pattern)",
    "style": "Anti-pattern identification",
    "question": "During a design interview, a candidate proposes Neo4j for a user-to-user messaging system, saying: 'Messages flow between users — it's a graph!' The interviewer asks: 'What queries do you actually need?' The candidate realizes they need: (1) get messages for user_id ordered by timestamp; (2) get unread count for user_id. Why is Neo4j inappropriate for this workload?",
    "options": [
      "Neo4j is never appropriate for any system because graph databases add operational complexity (specialized query language, limited horizontal scaling, niche community) that isn't justified by the marginal query performance improvement over a well-indexed relational database for any realistic workload",
      "The actual queries are simple key lookups and filters, not graph traversals. Neo4j's graph traversal capabilities are wasted. A simple SQL table (messages with user_id, read_flag) answers both queries with a single SELECT. Neo4j adds operational complexity and cost without solving a real need",
      "Neo4j doesn't support message ordering because graph databases store relationships as edges without inherent ordering — you'd need to add timestamp properties to each edge and sort at query time, which is O(n log n) per conversation query compared to the O(1) index lookup that a B-tree index on (user_id, timestamp) provides in PostgreSQL",
      "This is actually a strong use case for Neo4j because the message threading and conversation branching that messaging systems need maps naturally to graph traversal — finding reply chains, detecting conversation participants, and computing 'unread since last visit' are all graph operations that Neo4j handles more efficiently than recursive SQL CTEs"
    ],
    "correctIndex": 1,
    "explanation": "The article warns: 'Graph Databases... almost never the right choice in interviews. Even Facebook uses MySQL. Common interview mistake to choose these.' The messaging system has no graph traversal requirement. You don't ask 'what's the shortest path from user A to user B through messages' — you ask 'what messages does user A have?' These are table queries, not graph traversals. Choosing Neo4j here is solving a problem that doesn't exist. This is why the warning is so explicit: graph databases are chosen to appear sophisticated, not because they're necessary.",
    "interviewScript": "In your interview, say: 'I was tempted by Neo4j because messages flow between users, but the actual queries are simple: get messages by user_id. That's a table query, not a graph problem. I'd use PostgreSQL with a messages table indexed on (user_id, timestamp). If I later needed graph traversal — like 'recommend users who've messaged my friends' — then I'd reconsider graph databases.'",
    "proTip": null
  },
  {
    "id": "q23",
    "subtopic": "Indexing for Access Patterns",
    "style": "Scenario-based reasoning",
    "question": "Your user service has these endpoints: GET /users/{id}, GET /users?email={email}, GET /users?last_name={last_name}&first_name={first_name}. Your schema is `users(id, email, first_name, last_name, ...)`. What indexes would you create?",
    "options": [
      "Create one index on (id) because id is already the primary key and inherently unique — additional indexes on other columns would slow down write performance proportionally to the number of indexes maintained, and the primary key index is sufficient for all lookups when the application routes queries through the ID-based endpoint first and enriches results client-side",
      "Create indexes on: (email) for the email endpoint, and (last_name, first_name) for the name filter endpoint. Index every column that appears in a WHERE clause",
      "Create one composite index on (email, first_name, last_name) to cover all three query patterns efficiently — the leftmost prefix rule means this single index serves the email-only query (matches the leftmost column), the name query can use the last two columns, and the composite structure avoids the overhead of maintaining multiple separate indexes",
      "Indexes slow down writes proportionally to the number of indexes on the table, so don't create any secondary indexes — instead, rely on PostgreSQL's parallel sequential scan capability which can scan the full table across multiple CPU cores faster than an index lookup for tables under 10 million rows"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Indexing for Access Patterns — Indexes support important queries, connect indexes to API endpoints.' Each endpoint maps to a query: GET /{id} uses the primary key (inherently indexed), GET ?email= needs an index on email, GET ?last_name=&first_name= needs a compound index on (last_name, first_name). A single compound index (email, first_name, last_name) wouldn't help the email-only query efficiently (leftmost prefix rule). This is schema design driven by API contracts: examine all endpoints, list their filters, and create indexes accordingly.",
    "interviewScript": "In your interview, say: 'I'd trace each endpoint to its query and add indexes accordingly. GET /{id} uses the primary key. GET ?email= needs an index on email. GET ?last_name=&first_name= needs (last_name, first_name). The goal: every important query hits an index.'",
    "proTip": "Indexes are driven by access patterns, which come from API endpoints. Write the API contract first, then design indexes."
  },
  {
    "id": "q24",
    "subtopic": "Constraints & Data Integrity",
    "style": "Scenario-based reasoning",
    "question": "You're designing a user registration system. You define constraints: NOT NULL on email, UNIQUE on email, and a CHECK constraint ensuring age >= 18. During registration, a user submits an empty email field. Which constraint catches this error and at what layer?",
    "options": [
      "The CHECK constraint catches it in the application code layer before the query reaches the database, because CHECK constraints in PostgreSQL are evaluated as pre-insert validation hooks that the database driver invokes on the client side to reduce round-trips",
      "The database accepts any data and the application logic is responsible for validating it — database constraints are a legacy pattern that adds latency to every INSERT operation, and modern applications should validate at the API layer using schema validation libraries like Joi or Zod that provide better error messages and faster rejection of invalid input",
      "The NOT NULL constraint prevents the INSERT at the database layer before any CHECK or UNIQUE constraint is evaluated. Catching errors at the database layer (database-enforced constraints) is preferable because it prevents invalid data from ever entering the system, even from bugs or direct database access",
      "No constraint catches empty emails because an empty string ('') is not the same as NULL — the NOT NULL constraint only prevents literal NULL values, not zero-length strings, so the INSERT succeeds with an empty email that passes NOT NULL but is effectively invalid, requiring a separate CHECK constraint like CHECK(LENGTH(email) > 0) to catch this case"
    ],
    "correctIndex": 2,
    "explanation": "The article discusses constraints as part of schema design. Constraints exist in a hierarchy: NOT NULL is checked first (prevents NULLs), then CHECK (custom logic), then UNIQUE (duplicate prevention). By catching empty emails at the database layer (NOT NULL constraint), you ensure that no application bug, direct SQL, or API bypass can insert invalid data. Application-level validation is also necessary, but database constraints are the final safety net. This is defense-in-depth: validate in the application, then again in the database.",
    "interviewScript": "In your interview, say: 'I'd enforce constraints at both layers. In the application, validate that email is non-empty and meets format requirements. In the database, add NOT NULL and UNIQUE constraints on email. This defense-in-depth approach ensures that even if application validation is bypassed, the database prevents invalid data.'",
    "proTip": "Always use database constraints (NOT NULL, UNIQUE, CHECK, foreign keys) in addition to application validation. Database constraints are the last line of defense."
  },
  {
    "id": "q25",
    "subtopic": "SQL choice × Sharding strategy",
    "style": "Cross-subtopic reasoning",
    "question": "You've chosen PostgreSQL as your default database. Now you need to handle 1 million sign-ups per day and serve user profiles at 100,000 QPS. Sharding is necessary. You decide to shard by user_id using consistent hashing across 10 PostgreSQL instances. A user updates their profile (name, bio). What's the architectural implication of this sharding strategy combined with SQL?",
    "options": [
      "Sharding eliminates the need for SQL query capabilities because once data is distributed across multiple nodes, the query planner can't optimize cross-shard operations, so you're effectively running a key-value store that happens to use SQL syntax — switching to DynamoDB would give you the same access pattern with lower operational overhead",
      "PostgreSQL within each shard handles its own schema and queries. A user profile update goes to the single shard responsible for that user_id, updates locally, and returns. Joins within a shard work fine; cross-shard joins become expensive. The SQL advantage (complex queries) is only available within a shard, not across the cluster",
      "Sharding with SQL is architecturally impossible because PostgreSQL's transaction manager assumes a single-node topology — distributing tables across 10 instances breaks ACID guarantees even for within-shard operations because the WAL (Write-Ahead Log) can't span multiple instances",
      "All 10 PostgreSQL instances synchronize automatically through PostgreSQL's built-in logical replication, which detects shard membership and routes updates to the correct instance — the sharding layer is transparent to the application, and cross-shard queries are handled by the coordinator node that merges results from all shards before returning"
    ],
    "correctIndex": 1,
    "explanation": "The article emphasizes: 'Shard by primary access pattern.' When you shard by user_id and use SQL databases, you're trading SQL's JOIN power for horizontal scalability. Queries that involve only one user (get profile, update profile) work perfectly within a shard. But queries spanning multiple users (find users by city) require querying all shards — you lose SQL's advantage. This is why shard key choice is critical: it determines which queries stay local (fast) and which become cross-shard (slow).",
    "interviewScript": "In your interview, say: 'Sharding by user_id means each shard is an independent PostgreSQL instance. Updates to a user's profile go to one shard and work beautifully with SQL. But if I need to query 'find users in {city}', I must query all 10 shards and merge results — SQL's JOIN advantage is limited to within-shard queries. This is acceptable because most queries (profile reads, followers) are per-user.'",
    "proTip": "With sharding, SQL's power is constrained to single-shard queries. Choose shard keys that ensure your common queries stay within one shard."
  },
  {
    "id": "q26",
    "subtopic": "Normalization × Access Patterns",
    "style": "Cross-subtopic reasoning",
    "question": "You're designing a product catalog. You normalize: products(id, name, category_id, ...) and categories(id, name, ...). Every product list query joins products and categories by name, and this join is a bottleneck. Should you denormalize by embedding category name in products?",
    "options": [
      "Yes, always denormalize bottleneck queries immediately because query latency directly impacts user experience, and the consistency cost of denormalization is always worth the read performance gain since most applications are read-heavy and users are far more sensitive to slow reads than to occasionally stale data",
      "Before denormalizing, check: Does the category name change frequently? If rarely, embedding is acceptable. If frequently, denormalization creates consistency problems. First try indexing the foreign key join, use EXPLAIN to diagnose, and consider caching instead. Denormalization is a last resort after you've optimized the normalized schema",
      "Normalization and denormalization produce identical read performance when the database has sufficient memory to cache the working set, because the join operation is performed entirely in memory and the cost difference between joining two tables versus reading a single denormalized table is negligible when both fit in the buffer cache",
      "You should switch to MongoDB instead of denormalizing within PostgreSQL, because MongoDB's native document embedding achieves the same data co-location as PostgreSQL denormalization but without the schema migration overhead — you simply restructure your application's data model to embed category data within each product document"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Start normalized, denormalize only when needed.' A join bottleneck doesn't automatically mean denormalize. Optimization steps: (1) Index foreign keys (category_id), (2) Run EXPLAIN to confirm the join is the issue, (3) Try caching the join result, (4) Only then denormalize. If category names change rarely, denormalization is low-cost. If they change frequently, embedding creates cascading updates. The right answer depends on your specific access patterns and consistency requirements.",
    "interviewScript": "In your interview, say: 'Before denormalizing, I'd diagnose: add an index on products.category_id, review EXPLAIN plans to confirm the join is the bottleneck, and try caching. If the join is still slow and category names change rarely, I'd denormalize. If names change frequently, I'd stick with the normalized schema and optimize differently.'",
    "proTip": "Denormalization is a statement about your entire system: what changes frequently, what's queried constantly, and what's acceptable write cost. Don't denormalize to fix a single slow query."
  },
  {
    "id": "q27",
    "subtopic": "Document DB embedding × Consistency Requirements",
    "style": "Cross-subtopic reasoning",
    "question": "You're building a job board using MongoDB. You embed job applications in the user document: `users: { _id, name, applications: [ { job_id, status, applied_at } ] }`. A job is deleted. Should you remove the application from the user document?",
    "options": [
      "Yes, always cascade deletes to maintain referential integrity — keeping stale job references in user documents creates phantom data that confuses application logic, and the referential integrity of the data model should take precedence over historical record retention because audit trails should be maintained in a separate logging system, not in the application's primary data store",
      "It depends on consistency requirements. If historical records are important (audit trail), keep the application even if the job is deleted — the user applied, that's fact. If applications are transient, deletion is fine. But this decision reveals the embedding trade-off: mongoDB doesn't enforce consistency automatically. Your application code must decide what 'delete' means. With separate collections and foreign keys, the database enforces the rule",
      "MongoDB automatically handles embedded document cleanup when the referenced entity is deleted through its change stream triggers — when a job document is removed, MongoDB emits a delete event that your application can subscribe to and use to cascade the deletion to all embedded references across user documents",
      "You should switch to PostgreSQL for this use case because the need to reason about cascading deletes across embedded documents reveals that your data model has relational semantics that MongoDB wasn't designed to enforce — the fact that you're asking 'should I cascade?' means you need referential integrity, which is PostgreSQL's core strength"
    ],
    "correctIndex": 1,
    "explanation": "The article states: 'Document Databases... denormalize aggressively, embed related data' but this creates consistency decisions that SQL handles. With SQL foreign keys, ON DELETE CASCADE is explicit. With embedded MongoDB documents, you must decide in your code: are applications immutable history (don't delete), or transient records (delete)? This inconsistency isn't a MongoDB flaw — it's a design choice. MongoDB doesn't prevent you from having stale job_id references. Your schema design and application logic must handle it.",
    "interviewScript": "In your interview, say: 'Embedding applications in the user document shifts consistency decisions to the application layer. I'd ask: are applications immutable history? If yes, keep them even if the job is deleted — the fact that the user applied is historical. If applications are transient, delete them on job deletion. Either way, my application code is responsible for consistency, not the database.'",
    "proTip": "Embedding in MongoDB isn't free — it just moves consistency management from database constraints to application code. Understand what you're accepting."
  }
];

export const SUBTOPICS_ORDER = [
  "Relational Databases (SQL)",
  "Normalization vs Denormalization",
  "Scaling and Sharding",
  "Document Databases",
  "Key-Value Stores",
  "Start with Requirements",
  "Entities, Keys & Relationships",
  "Database Selection Decision Framework",
  "Wide-Column Databases",
  "Graph Databases (Anti-pattern)",
  "Indexing for Access Patterns",
  "Constraints & Data Integrity"
];

export default {
  questions: QUESTIONS,
  subtopicsOrder: SUBTOPICS_ORDER
};
