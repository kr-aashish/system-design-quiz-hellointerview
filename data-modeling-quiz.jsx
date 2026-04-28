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

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, Flag, SkipForward, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, XCircle, AlertTriangle, Award, Brain, Target, Zap, BarChart3, BookOpen } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "Relational Databases (SQL)",
    style: "Scenario-based reasoning",
    question: "You're designing a SaaS platform for project management where data integrity is critical: users must exist before creating tasks, tasks must reference valid project IDs, and deleting a user should handle their tasks appropriately. You're choosing between PostgreSQL with foreign keys and MongoDB with embedded documents. Why is PostgreSQL the better choice despite MongoDB's flexibility?",
    options: [
      "PostgreSQL scales better than MongoDB for any workload",
      "PostgreSQL enforces referential integrity at the database level, preventing orphaned records; MongoDB embeds documents but risks inconsistency when relationships change, requiring application logic to maintain integrity",
      "MongoDB doesn't support transactions, while PostgreSQL does",
      "Foreign keys automatically delete related records, eliminating the need for application logic"
    ],
    correctIndex: 1,
    explanation: "The article emphasizes: 'Relational databases provide referential integrity via foreign keys, ensuring relationships remain valid.' With MongoDB's embedded model, if you embed user data in tasks and the user updates their name, you must update every task document — creating consistency risk. PostgreSQL's foreign key constraints prevent orphaned records at the DB level. This is the fundamental advantage of relational schemas: structural guarantees. Option C is outdated (MongoDB now supports ACID transactions). Option D is wrong — foreign keys can be configured for different behaviors (restrict, cascade, set null), not automatic deletion.",
    interviewScript: "In your interview, say: 'For this data model, referential integrity is critical. PostgreSQL enforces foreign key constraints at the database level, preventing orphaned user IDs or invalid project references. MongoDB would require application code to maintain consistency when relationships change, which is error-prone. PostgreSQL's ACID guarantees are a better fit for a system where data integrity directly impacts business logic.'",
    proTip: "Always ask: 'What happens when a relationship changes?' The answer often reveals whether you need a relational database's structural guarantees."
  },
  {
    id: "q2",
    subtopic: "Relational Databases (SQL)",
    style: "Anti-pattern identification",
    question: "During a system design interview, a candidate says: 'I'll use PostgreSQL for user accounts and MongoDB for everything else because SQL is too rigid for fast-moving features.' What's the critical flaw in this reasoning?",
    options: [
      "This is actually the right approach — polyglot persistence is always superior",
      "The belief that SQL is 'rigid' is outdated; PostgreSQL supports JSON columns, schema evolution, and flexible queries while maintaining integrity. The real rigidity lies in MongoDB's lack of JOIN support when data relationships exist",
      "PostgreSQL cannot handle schema changes, so MongoDB is necessary",
      "You should never mix databases in a single system"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Scalability concerns about SQL are often exaggerated.' A major misconception is that SQL is 'rigid.' Modern PostgreSQL offers JSON/JSONB columns for semi-structured data and supports ALTER TABLE for schema evolution. The rigidity risk is actually the opposite: MongoDB's document model discourages JOINs, forcing denormalization and embedding — which creates consistency problems. Polyglot persistence should be driven by access patterns and scalability needs, not by a misconception that SQL is inflexible. Using 'everything else MongoDB' is lazy design.",
    interviewScript: "In your interview, say: 'PostgreSQL is far more flexible than the SQL-is-rigid stereotype suggests. It handles JSON, supports schema evolution, and provides ACID transactions. I'd use PostgreSQL as the default and only adopt another database (like MongoDB or Redis) when I have a specific access pattern or scalability requirement that SQL doesn't serve well.'",
    proTip: null
  },
  {
    id: "q3",
    subtopic: "Relational Databases (SQL)",
    style: "Failure analysis",
    question: "A team reports that complex JOINs between 5 tables (users, orders, order_items, products, categories) are causing their 50,000 QPS read workload to degrade. They consider switching to MongoDB to 'avoid joins.' What's wrong with this solution?",
    options: [
      "Joins are the primary cause of database slowness; MongoDB avoids this by embedding documents",
      "The problem isn't JOINs themselves — it's that they're not optimized. Indexes on foreign keys, query optimization (EXPLAIN ANALYZE), and possibly denormalization or caching are the real solutions. Switching to MongoDB just replaces the join problem with an embedding/consistency problem",
      "PostgreSQL doesn't support joins efficiently, while MongoDB does",
      "Five-table joins are impossible in any SQL database"
    ],
    correctIndex: 1,
    explanation: "The article warns against blaming JOINs indiscriminately: 'Complex joins can be performance traps at scale' — but the solution isn't to abandon the relational model. Slow JOINs usually indicate missing indexes on foreign key columns or poorly written queries. The real solutions are: (1) index foreign keys, (2) use EXPLAIN to identify bottlenecks, (3) denormalize or cache specific aggregations if joins are legitimately slow. Switching to MongoDB trades a solved problem (indexable joins) for unsolved problems (embedding consistency, lack of aggregation power). This is a classic case of choosing the wrong tool to avoid fixing the underlying issue.",
    interviewScript: "In your interview, say: 'If JOINs are slow, the first step is diagnosis: check if foreign key columns are indexed, review EXPLAIN plans, and look for cartesian products. Usually, proper indexing and query rewriting fixes the issue. Switching to MongoDB to avoid JOINs just creates a different set of problems — embedding means handling consistency manually. I'd optimize the queries first before considering schema changes.'",
    proTip: "Remember: 'Complex joins can be performance traps' doesn't mean avoid joins — it means avoid poorly-designed joins. The difference is crucial."
  },
  {
    id: "q4",
    subtopic: "Relational Databases (SQL)",
    style: "Gotcha question",
    question: "You're designing a marketplace where users set their email as a unique identifier for login. Your schema has: `CREATE TABLE users (email VARCHAR(255) PRIMARY KEY, ...);` After 6 months, you realize users want to change their email. What's the technical problem with this design?",
    options: [
      "PostgreSQL doesn't allow primary key changes",
      "Changing an email that's a primary key requires updating all foreign key references in related tables, and if any orders or transactions reference this email, you risk breaking referential integrity constraints",
      "This design is actually fine — email is a perfectly valid primary key",
      "You'd have to drop and recreate the table to change the primary key"
    ],
    correctIndex: 1,
    explanation: "The article explicitly states: 'Use system-generated primary keys, not business data.' Email is business data that users expect to change. If email is the primary key and a user changes it, every foreign key reference in orders, reviews, favorites tables must also update. This violates the principle that primary keys should be immutable. A better design is a system-generated user_id as the primary key, with email as a UNIQUE but changeable column. This is a common real-world gotcha that reveals whether you understand the semantic difference between identity and attributes.",
    interviewScript: "In your interview, say: 'I'll use a system-generated user_id as the primary key, with email as a unique but nullable and changeable column. This separates identity (the ID) from attributes (the email). If I used email as the primary key and a user changes it later, I'd have to update all foreign key references across the system — a maintenance nightmare.'",
    proTip: "A good heuristic: 'If this value could change, it shouldn't be a primary key.' Email, phone number, and customer ID are attributes, not identities."
  },
  {
    id: "q5",
    subtopic: "Normalization vs Denormalization",
    style: "Scenario-based trade-offs",
    question: "You're building a Twitter-like system where every feed query requires joining tweets, users, and counts (retweets, likes, replies). You denormalize by storing denormalized tweet records with embedded user names and total counts. A user changes their name. What's the operational cost of your denormalization decision?",
    options: [
      "No cost — denormalized data stays consistent automatically",
      "You must update every tweet in the database containing that user's old name. With 100 million tweets, this could be millions of updates. Denormalization accepts this write complexity to speed up feed reads",
      "You should immediately revert to a normalized schema",
      "The denormalized data becomes permanently stale"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Denormalization creates consistency problems.' When you embed user.name in each tweet, changing the user's name requires updating N tweet rows. This is a classic denormalization trade-off: faster reads (no join needed) at the cost of slower, more complex writes (cascading updates). For a name change (rare), this is acceptable. But for frequently-changing fields (like follower count), denormalization becomes untenable. The key insight: denormalize fields that change infrequently, or use a different strategy (caching, materialized views).",
    interviewScript: "In your interview, say: 'I'd denormalize user names and counts into the tweet document because feed reads happen constantly but user names change rarely. However, I'm accepting the cost: when a user changes their name, I must update millions of tweet records. For fields that change frequently, I wouldn't denormalize — I'd use a cache or keep them normalized.'",
    proTip: "Denormalization is a conscious trade-off, not a free lunch. Always ask: 'How often does this data change?' If it's frequently, denormalization is a trap."
  },
  {
    id: "q6",
    subtopic: "Normalization vs Denormalization",
    style: "Decision framework",
    question: "Your analytics dashboard queries product popularity (sales count per category) millions of times per day, but product metadata (name, category, price) changes only during daily inventory updates. Your two options are: (1) normalize (join products and sales every query) or (2) denormalize (update materialized aggregate tables during inventory updates). Which is better and why?",
    options: [
      "Normalization — always normalize to avoid consistency issues",
      "Denormalization — materialized aggregate tables serve pre-computed results at query time, eliminating joins. The cost (updating aggregates during inventory updates) is acceptable because updates happen once daily, while reads happen millions of times",
      "You should use a NoSQL database to avoid this trade-off",
      "Both are equally valid with no trade-off difference"
    ],
    correctIndex: 1,
    explanation: "The article identifies this exact pattern: 'Denormalization is appropriate for analytics and event logs where reads vastly outnumber writes.' With millions of read queries against one daily update cycle, materialized views (pre-computed aggregations) are ideal. The cost is incurred once daily, while the benefit accrues millions of times. This is a clear win for denormalization because the read/write ratio is extreme and the update is batched (not real-time). Caching is an alternative but materialized views are persistent and reliable.",
    interviewScript: "In your interview, say: 'For an analytics workload where reads outnumber writes by millions to one, I'd use materialized views. Every night during the inventory update window, I'd recompute aggregate tables with sales counts per category. Queries read the pre-computed results with no joins. The upfront cost (recomputing aggregates daily) is worth the read performance at scale.'",
    proTip: "The denormalization rule of thumb: if reads >> writes by at least 100:1, denormalization becomes attractive. Analytics dashboards are the textbook case."
  },
  {
    id: "q7",
    subtopic: "Normalization vs Denormalization",
    style: "Anti-pattern identification",
    question: "A junior engineer proposes: 'Let's denormalize everything — cache user data, cache product data, cache counts. It's faster than joins.' Why is this 'denormalize everything' approach naive?",
    options: [
      "Caching is inferior to denormalization",
      "Denormalization eliminates the need for caching",
      "Denormalization of frequently-changing data (like counts) creates consistency nightmares: you must synchronize writes across many places, and stale data is unavoidable. Caching is a better approach: the source of truth stays normalized and consistent, caches expire independently",
      "Modern databases are fast enough that denormalization is unnecessary"
    ],
    correctIndex: 2,
    explanation: "The article explicitly advises: 'Cache as alternative to denormalization.' Denormalization and caching serve similar goals (speed) but differently. Denormalization embeds data in multiple places, creating sync problems. Caching keeps the source of truth normalized and separate, letting each cache expire independently. For frequently-changing data (like counts or user balances), caching is far superior: the count updates in one place (database), caches invalidate, and consistency is maintained at the source. Denormalizing counts means updating many rows whenever a count changes.",
    interviewScript: "In your interview, say: 'I'd differentiate between denormalization and caching. Denormalize infrequently-changing data (like user names in tweets) where the consistency cost is bearable. For frequently-changing data (like counts), use caching instead: keep the source of truth normalized, cache aggressively, and let caches expire independently. This gives you read speed without sacrificing consistency.'",
    proTip: null
  },
  {
    id: "q8",
    subtopic: "Scaling and Sharding",
    style: "Scenario-based reasoning",
    question: "You're designing a user service handling 100,000 QPS across 1 million users. Your primary query is 'get user by user_id.' You decide to shard by user_id (e.g., shard = user_id % num_shards). After launch, your traffic profile evolves: celebrity influencers gain millions of followers. Reading their follower lists (filtering by user_id and following_id) is now a hot shard. What's the core problem?",
    options: [
      "Sharding by user_id is the wrong choice",
      "Sharding always creates hot shards and there's no solution",
      "Your shard key (user_id) aligns with the original access pattern ('get user by ID') but doesn't match the new pattern ('list followers'). For follower lists, you might need a composite shard key like (user_id, follower_id) or separate followers table sharded differently, introducing cross-shard complexity",
      "You should use a NoSQL database instead"
    ],
    correctIndex: 2,
    explanation: "The article warns: 'Shard by primary access pattern... shard key choice is often permanent.' Your initial shard key (user_id) is optimal for 'get user' but suboptimal for 'list followers' — a different access pattern that emerges later. The real lesson: shard key selection depends on your dominant query pattern. Once chosen, changing it is extremely painful. For a social graph, you might need separate sharding strategies for different tables (users sharded by user_id, followers sharded by followed_user_id). This creates cross-shard complexity but prevents hot shards.",
    interviewScript: "In your interview, say: 'Shard key selection is critical because it's hard to change. I'd identify the dominant access patterns first. For a social platform, 'get user' would be sharded by user_id, but 'list followers' might need its own sharding strategy (sharded by followed_user_id) to avoid concentrating celebrity followers on one shard.'",
    proTip: "Shard key choice is often permanent. Getting it wrong at scale is expensive. Always validate your access patterns before finalizing the shard key."
  },
  {
    id: "q9",
    subtopic: "Scaling and Sharding",
    style: "Gotcha question",
    question: "You design a time-series events system for IoT sensors. You decide to shard by timestamp: shard = (date % num_shards). This distributes events evenly across shards. You then receive a query: 'Find all events for sensor_id=42 in the last 7 days.' Why does this query become expensive?",
    options: [
      "Time-series data can't be queried across shards",
      "Your shard key (timestamp) doesn't match the query pattern (sensor_id + date range). Finding events for one sensor requires querying ALL shards, since the sensor's events are scattered across every shard by timestamp. This is a cross-shard query that's expensive to execute and merge",
      "You should use a graph database instead",
      "Sharding by timestamp is the best approach for time-series data"
    ],
    correctIndex: 1,
    explanation: "The article explicitly warns: 'Time-range sharding anti-pattern (hot shard).' While time-range sharding avoids hot shards (events distribute evenly), it creates a different problem: queries by entity ID become cross-shard queries. Your query 'sensor_id=42, last 7 days' must hit every shard, collect results, and merge them. For a better approach, shard by sensor_id (or sensor_id + bucket), accepting that some sensors might have more events, but keeping sensor-specific queries fast and local to one shard.",
    interviewScript: "In your interview, say: 'Sharding by timestamp distributes events evenly but breaks entity-based queries. When I query for a specific sensor's events, I hit every shard. A better approach for sensor data: shard by sensor_id to keep sensor-specific queries local to one shard. I'd manage hot sensors (heavy hitters) with separate strategies like exponential backoff or request coalescing.'",
    proTip: "Don't shard by time hoping to avoid hot shards — you'll just trade one problem for another. Shard by your primary entity (sensor_id, user_id, account_id)."
  },
  {
    id: "q10",
    subtopic: "Scaling and Sharding",
    style: "Anti-pattern identification",
    question: "A team over-designs their sharding strategy: they shard users by user_id, but then also shard orders by order_id, and fulfill-ment by fulfillment_id. Each table uses a different shard key. A 'create order' transaction must check user balance, create an order, and trigger fulfillment. Why is this sharding strategy problematic?",
    options: [
      "Different shard keys ensure data is distributed evenly",
      "Cross-shard transactions are impossible in any distributed system",
      "Different shard keys mean related data (user, order, fulfillment) live on different shards. A single transaction now requires coordinating across multiple shards — expensive, complex, and prone to consistency issues. A better approach: use user_id as the shard key for all tables so related data stays together",
      "You should avoid sharding entirely"
    ],
    correctIndex: 2,
    explanation: "The article emphasizes: 'Shard key choice is often permanent.' While choosing different shard keys might seem smart for load balancing, it violates locality: related entities (user, orders, fulfillments) end up on different shards. Transactions then require distributed consensus (2-phase commit or similar), which is slow and unreliable. A better approach: use a common shard key (user_id) across tables, accepting that some shards might be busier, then handle hot shards with caching or exponential backoff. Co-locating related data is worth more than perfect load distribution.",
    interviewScript: "In your interview, say: 'I'd shard all tables by user_id so related entities (user, orders, fulfillment) live on the same shard. This keeps transactions local and avoids distributed consensus. If some users generate more traffic, I'd handle that with caching or request coalescing, not by using different shard keys for different tables.'",
    proTip: "Prefer locality over perfect load distribution. Related data on the same shard is worth far more than balanced load across shards."
  },
  {
    id: "q11",
    subtopic: "Document Databases",
    style: "Scenario-based reasoning",
    question: "You're building a content management system where document schemas change frequently: some articles have authors, tags, categories, and multimedia; others are bare-bones. You consider MongoDB for schema flexibility. What's the key trade-off you're accepting?",
    options: [
      "MongoDB has better performance than SQL",
      "Flexible schemas mean you lose structural validation. MongoDB won't prevent you from storing invalid data (article without author, tags as string instead of array). You must enforce consistency in application code, which is error-prone and hard to audit",
      "SQL databases don't support schema changes",
      "MongoDB automatically validates schema across all documents"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Document databases... flexible schemas... only when schema changes frequently.' The flexibility is real, but the cost is real too: structural validation moves from the database to application code. In a relational database, columns enforce types (string, integer, date). In MongoDB, a field might be a string in one document and an array in another — unless your code prevents it. For genuinely schema-agnostic workloads (like logs or user-generated content), this is fine. For business-critical data (CMS articles that must have certain fields), you might want the database enforcing constraints. MongoDB is not a 'free schema flexibility' — it's a trade-off.",
    interviewScript: "In your interview, say: 'MongoDB is attractive for schema flexibility, but I'm trading database-level validation for application-level validation. I'd ensure my code validates article structure everywhere it's created or updated. For frequently-evolving schemas where consistency isn't critical, this is fine. For business-critical data, I might prefer SQL's structural guarantees.'",
    proTip: "Flexible schemas in MongoDB aren't free — they just move validation work from the database to your application code."
  },
  {
    id: "q12",
    subtopic: "Document Databases",
    style: "Anti-pattern identification",
    question: "A team chooses MongoDB because 'documents are just like objects in our code — we can map application objects directly to documents.' They embed related entities aggressively: a user document embeds all user preferences, all address history, all payment methods. Queries and updates become slow. What's the flaw?",
    options: [
      "Embedding is always wrong in MongoDB",
      "Object-to-document mapping is a good pattern",
      "Embedding everything creates large documents, which slows down deserialization, indexing, and updates. Not all relationships should be embedded — only tightly coupled, infrequently-updated data. The seductive 'object = document' mental model ignores the cost of large, mutable documents",
      "MongoDB doesn't support references"
    ],
    correctIndex: 2,
    explanation: "The article warns: 'embed related data [but] only when schema changes frequently.' The seductive mental model is 'my User object has Preferences, so I'll embed preferences in the user document.' But embedded documents create performance problems: a user with 10 addresses and 20 payment methods is a 50KB+ document. Every query loads the entire document. Every update rewrites the whole document. MongoDB supports references and JOINs (via $lookup), which are the right choice for 1:N and N:M relationships. Embedding is only optimal for tightly-coupled 1:1 data that changes rarely.",
    interviewScript: "In your interview, say: 'I'd be selective about embedding. A user document embeds one current address and payment method (tightly coupled, rarely change). But address history and all previous payments stay in separate collections with foreign key references. This keeps documents lean and queries fast.'",
    proTip: null
  },
  {
    id: "q13",
    subtopic: "Key-Value Stores",
    style: "Use-case identification",
    question: "You're designing a session store for a web application. User sessions are accessed via session_id, updated on every request, and expire after 30 minutes of inactivity. Why is Redis (a key-value store) more appropriate than PostgreSQL for this workload?",
    options: [
      "PostgreSQL is too slow for sessions",
      "Redis provides in-memory storage (extremely fast), TTL (automatic expiration), and simple key-value operations that match the access pattern. PostgreSQL's complex query engine and ACID guarantees are unnecessary overhead for a workload that just needs 'get', 'set', and 'expire'",
      "Key-value stores are always faster than SQL databases",
      "PostgreSQL doesn't support the required queries"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Key-Value Stores... simple lookups by key... For caching, session storage.' Sessions are the ideal key-value workload: every operation is a simple get/set by session_id, no complex queries, and data expires automatically. Redis's in-memory engine and TTL feature are perfectly matched to this pattern. PostgreSQL would work but it's overkill — you're paying for transaction overhead, query optimization, and persistence that you don't need. This is how you choose databases: match the access pattern to the database capability.",
    interviewScript: "In your interview, say: 'For sessions, I'd use Redis: all queries are simple get/set by session_id, and I need automatic expiration via TTL. PostgreSQL supports this, but I'd be paying for ACID transactions, complex query planning, and disk I/O that sessions don't need. Redis is optimized for exactly this pattern.'",
    proTip: "Choosing a database is about matching access patterns, not absolute performance. A key-value store shines when queries are simple key lookups."
  },
  {
    id: "q14",
    subtopic: "Key-Value Stores",
    style: "Scenario-based trade-offs",
    question: "You use Redis as a cache alongside PostgreSQL. Your cache key format is 'user:{user_id}:profile'. When a user updates their profile, you must delete the cache entry, then update the database. A race condition: the cache entry is deleted but the database update fails. The user's profile is now missing from both cache and database. How would you avoid this?",
    options: [
      "Cache invalidation is impossible; accept inconsistency",
      "Use write-through pattern: update the database first, then update the cache. If the cache update fails, the database is still correct and the cache will be repopulated on the next read",
      "Delete the cache first, then update the database",
      "Use a key-value store that supports transactions"
    ],
    correctIndex: 1,
    explanation: "The article addresses cache-database consistency: cache-aside (delete then update) creates the race condition you described. Write-through (update database first, then cache) is safer: if the cache update fails, the database is the source of truth and the cache is simply repopulated on the next read. Alternatively, cache-behind (update database first, then update cache asynchronously) is similar but allows async updates. The key insight: never delete the source of truth (database) before updating the cache. Always treat the database as authoritative.",
    interviewScript: "In your interview, say: 'I'd use write-through: update the database first, then the cache. If the cache update fails, the database is correct and the cache will be repopulated on the next read. Never delete the source of truth first — that creates orphaned deletes when the subsequent database update fails.'",
    proTip: "When coordinating cache and database, always update the source of truth (database) first. The cache is a performance optimization; the database is the source of truth."
  },
  {
    id: "q15",
    subtopic: "Start with Requirements",
    style: "Framework question",
    question: "You're designing a data model for a video streaming platform. Before choosing between SQL, NoSQL, or specialized databases, what are the three critical requirements questions you should ask first?",
    options: [
      "How much data will we store? What programming language are we using? Will we need caching?",
      "What's the data volume? What are the primary access patterns? What are the consistency requirements? These three factors drive database selection more than any other consideration",
      "Should we use PostgreSQL or MongoDB? Should we shard? Should we denormalize?",
      "How much money do we have for infrastructure?"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Three key factors: data volume, access patterns (most important), consistency requirements. Tie schema choices back to these factors explicitly.' Data volume determines whether a single server suffices or you need distributed storage. Access patterns determine database type (SQL for complex queries, key-value for simple lookups, document for flexible schemas). Consistency requirements determine whether you need ACID transactions or can tolerate eventual consistency. These three anchor all downstream decisions about sharding, denormalization, and caching. Skipping this analysis leads to technology choices that don't match your actual needs.",
    interviewScript: "In your interview, say: 'Before I pick a database, I need to understand three things: (1) Data volume — how many users, videos, metadata? (2) Access patterns — is my primary query 'get video by ID' or 'search videos by title'? (3) Consistency — do I need ACID transactions or can metadata be eventually consistent? These three factors drive everything else.'",
    proTip: "Interviewer is checking if you design top-down (requirements first) or bottom-up (technology first). Always start with requirements."
  },
  {
    id: "q16",
    subtopic: "Start with Requirements",
    style: "Scenario-based reasoning",
    question: "You're designing a real-time stock trading system. Data volume: 10 million stock prices updated every second. Access pattern: (1) get latest price by ticker; (2) get price history for a 30-day window. Consistency requirement: reads must reflect writes within 100ms for regulatory compliance. Why does this consistency requirement change your database choice?",
    options: [
      "You should use MongoDB because it's faster",
      "You can't meet sub-100ms consistency with any distributed database",
      "Sub-100ms consistency rules out eventually-consistent distributed systems (like Cassandra). You need strong consistency with minimal replication lag. PostgreSQL with read replicas and careful replication setup, or a single high-performance instance (vertical scaling first) is more appropriate than Cassandra's eventual consistency model",
      "Consistency requirements don't affect database choice"
    ],
    correctIndex: 2,
    explanation: "The article emphasizes: 'consistency requirements [are one of] three key factors.' Eventual consistency (where replicas might lag by seconds) is incompatible with trading regulations requiring <100ms consistency. Strong consistency systems like PostgreSQL with synchronous replication, or read replicas with replication lag monitoring, are necessary. This is how requirements drive architecture: regulatory constraints eliminate entire database categories (eventual-consistency systems), leaving you with strong-consistency options. A candidate who chooses Cassandra for this workload is ignoring the consistency requirement.",
    interviewScript: "In your interview, say: 'The regulatory requirement for <100ms consistency eliminates eventual-consistency databases like Cassandra. A read might see a price from 5 seconds ago — unacceptable. I'd use PostgreSQL with synchronous replication to ensure writes propagate to replicas immediately, or start with a single high-performance instance and add read replicas with replication lag monitoring.'",
    proTip: "Regulatory, legal, or business requirements often tighten consistency bounds. Always ask: 'What's the strictest consistency guarantee any feature needs?'"
  },
  {
    id: "q17",
    subtopic: "Entities, Keys & Relationships",
    style: "Scenario-based reasoning",
    question: "You're designing a bank account system. Your schema has `accounts(account_id, balance, ...)` and `transactions(transaction_id, account_id, amount, ...)`. You define account_id as a foreign key in transactions with ON DELETE CASCADE. A user accidentally deletes their account. What happens, and why is this dangerous?",
    options: [
      "The account is deleted but transactions remain — no danger",
      "Transactions stay and the foreign key reference breaks — you'd see referential integrity violations",
      "All transactions for that account are automatically deleted. This permanently erases transaction history needed for auditing, tax records, and regulatory compliance. Cascading deletes are dangerous for audit logs",
      "The account can't be deleted due to foreign key constraints"
    ],
    correctIndex: 2,
    explanation: "The article discusses 'referential integrity vs write performance trade-off.' While ON DELETE CASCADE maintains referential integrity (no orphaned rows), it's semantically wrong for audit-critical data. Bank transactions are immutable history; deleting a transaction is a compliance violation. Better approach: use ON DELETE RESTRICT (prevents deletion if transactions exist) or soft deletes (mark account as deleted but don't remove it). The lesson: foreign key constraints have different semantics — choosing the right one matters for correctness, not just referential integrity.",
    interviewScript: "In your interview, say: 'I'd use ON DELETE RESTRICT or SETNULL, not CASCADE. For audit-critical data like transactions, deletion must be prevented or the account must stay in the database (soft delete). Cascading deletes would erase transaction history, violating compliance requirements. The choice of referential integrity strategy depends on business semantics, not just database mechanics.'",
    proTip: "Foreign key options have different semantics: RESTRICT prevents bad deletes, CASCADE erases data, SET NULL orphans records. Choose based on business logic, not convenience."
  },
  {
    id: "q18",
    subtopic: "Entities, Keys & Relationships",
    style: "Gotcha question",
    question: "You're modeling a many-to-many relationship: students can enroll in courses, and courses have many students. Your schema has `enrollments(student_id, course_id, grade)` where both student_id and course_id are foreign keys and together form the primary key. A student re-enrolls in the same course with a new grade. What happens when you insert the duplicate (student_id, course_id) pair?",
    options: [
      "The database allows duplicate enrollments",
      "The insert fails with a unique constraint violation. The composite primary key (student_id, course_id) prevents the same student from enrolling twice. You'd need to update the existing row instead, or use INSERT ... ON CONFLICT UPDATE (upsert) to handle re-enrollment",
      "The database automatically overwrites the old grade",
      "This is a schema design error — you shouldn't use composite primary keys"
    ],
    correctIndex: 1,
    explanation: "Composite primary keys enforce uniqueness on the tuple (student_id, course_id). A re-enrollment attempt inserts the same tuple, violating the primary key constraint. The solution depends on your business logic: (1) disallow re-enrollment (RESTRICT), (2) update the existing enrollment (upsert), or (3) allow multiple enrollments by adding an enrollment_id. This gotcha reveals whether you understand composite key semantics: the uniqueness constraint is enforced on the entire key, not just parts of it.",
    interviewScript: "In your interview, say: 'The composite primary key (student_id, course_id) prevents duplicate enrollments. If a student re-enrolls, the insert fails. I'd handle this with an upsert (INSERT ... ON CONFLICT UPDATE) to update the grade, or change the schema to include enrollment_id as the primary key if multiple enrollments per student-course pair are allowed.'",
    proTip: "Composite keys enforce uniqueness on the full tuple, not individual columns. Understand which duplicates you want to prevent."
  },
  {
    id: "q19",
    subtopic: "Database Selection Decision Framework",
    style: "Framework question",
    question: "You're choosing between PostgreSQL and DynamoDB for a new service. PostgreSQL: complex queries, ACID, joins. DynamoDB: NoSQL, eventual consistency, fast key lookups, managed scaling. What question would help you choose?",
    options: [
      "Which database is newer?",
      "Does your primary access pattern require complex queries (multiple conditions, joins, sorting)? If yes, SQL (PostgreSQL). If it's simple key/range lookups, NoSQL (DynamoDB) is a better fit",
      "Which is more popular?",
      "You should always use PostgreSQL for critical data"
    ],
    correctIndex: 1,
    explanation: "The article states: 'When to choose SQL vs alternatives [is a] key decision framework.' The decision hinges on access patterns: SQL excels at flexible queries (filter by any column, join multiple tables, aggregate results). NoSQL excels at simple lookups (get by key, range query by sort key). DynamoDB can't efficiently answer 'find orders by status across all users' — you'd need to scan the entire table. PostgreSQL handles this trivially. If your primary queries are simple, DynamoDB's managed scaling and simplicity win. If queries are complex, PostgreSQL's flexibility is required.",
    interviewScript: "In your interview, say: 'I'd start by listing my primary queries. If they're all simple key lookups or range queries, DynamoDB's managed scaling and simplicity are attractive. If I need complex filtering, aggregation, or joins, PostgreSQL's query flexibility is essential. Access patterns drive the choice.'",
    proTip: "SQL vs NoSQL decision: List your top 5 queries. Can they be answered by key/range lookups alone, or do you need filtering, aggregation, and joins?"
  },
  {
    id: "q20",
    subtopic: "Database Selection Decision Framework",
    style: "Scenario-based reasoning",
    question: "You're designing a recommendation engine: given a user, find top 10 similar users based on interests, engagement, and activity. You consider PostgreSQL (for complex queries) and Neo4j (a graph database). Why do you choose PostgreSQL even though Neo4j 'feels like the right fit for relationships'?",
    options: [
      "PostgreSQL is always faster than graph databases",
      "Neo4j seems attractive because of the 'relationship' language, but most social graphs are better modeled with SQL: user interests in one table, engagement in another, queries use joins. Graph databases excel at true graph traversal (shortest path, relationship depth) which your recommendation doesn't need. PostgreSQL is simpler, cheaper, and better understood. Graph databases are often chosen to look impressive in interviews, not because they're actually needed",
      "Graph databases are deprecated",
      "PostgreSQL doesn't support relationship queries"
    ],
    correctIndex: 1,
    explanation: "The article explicitly warns: 'Graph Databases... almost never the right choice in interviews. Even Facebook uses MySQL.' Recommendation engines seem like graph problems but they're actually similarity searches that SQL handles well. You're not traversing a relationship graph (shortest path between two users) — you're filtering and ranking. A graph database adds complexity (operational expertise, cost, limited query language) for a problem SQL solves naturally. This is a common interview trap: choosing exotic technology to impress, rather than choosing technology that fits the problem.",
    interviewScript: "In your interview, say: 'Graph databases are tempting because social data has relationships. But I don't actually need graph traversal — I need to filter users by interests and engagement, then rank them. PostgreSQL handles this with straightforward joins and sorting. Graph databases would add unnecessary complexity. I'd choose PostgreSQL and reconsider Neo4j only if I needed true graph queries like shortest-path analysis.'",
    proTip: "Graph databases are rarely the right choice in interviews. If you find yourself reaching for one, ask: 'Do I actually need graph traversal, or just relationship data?' Usually it's the latter."
  },
  {
    id: "q21",
    subtopic: "Wide-Column Databases",
    style: "Use-case identification",
    question: "You're building a time-series analytics system for IoT sensor data: 1 billion sensor readings per day, each with timestamp, sensor_id, value, and 100+ metrics. Queries are always 'get metrics for sensor_id in time range T1 to T2.' You consider Cassandra (a wide-column database). Why is it well-suited for this workload?",
    options: [
      "Cassandra is faster than PostgreSQL for all workloads",
      "Cassandra's column family structure stores metrics as columns and time ranges as rows, optimized for write-heavy, time-series access. It scales horizontally for 1 billion writes/day and queries are range scans on (sensor_id, time), which Cassandra handles efficiently. It also provides tunable consistency",
      "PostgreSQL doesn't support time-series data",
      "Wide-column databases are always better than SQL"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Wide-Column Databases... write-heavy, time-series. Design around query patterns.' Cassandra is purpose-built for this pattern: millions of writes per second, queries by (partition key, time range), and horizontal scalability. A single PostgreSQL instance would struggle with 1B writes/day. Cassandra shines here because its data model (column families, time-ordered rows) matches the query pattern. This is why Cassandra exists: SQL can't efficiently scale write-heavy time-series workloads.",
    interviewScript: "In your interview, say: 'For 1 billion sensor readings per day, I'd use Cassandra. It's designed for write-heavy time-series: data is sharded by sensor_id and stored in time order, so queries for a sensor's metrics over a time range hit one partition and scan sequentially. PostgreSQL would require complex sharding and still wouldn't match Cassandra's write throughput.'",
    proTip: "Wide-column databases are niche but essential for specific patterns: high-volume writes, time-series, metric storage. Use them when SQL's write performance becomes a bottleneck."
  },
  {
    id: "q22",
    subtopic: "Graph Databases (Anti-pattern)",
    style: "Anti-pattern identification",
    question: "During a design interview, a candidate proposes Neo4j for a user-to-user messaging system, saying: 'Messages flow between users — it's a graph!' The interviewer asks: 'What queries do you actually need?' The candidate realizes they need: (1) get messages for user_id ordered by timestamp; (2) get unread count for user_id. Why is Neo4j inappropriate for this workload?",
    options: [
      "Neo4j is never appropriate for any system",
      "The actual queries are simple key lookups and filters, not graph traversals. Neo4j's graph traversal capabilities are wasted. A simple SQL table (messages with user_id, read_flag) answers both queries with a single SELECT. Neo4j adds operational complexity and cost without solving a real need",
      "Neo4j doesn't support message ordering",
      "This is a perfect use case for Neo4j"
    ],
    correctIndex: 1,
    explanation: "The article warns: 'Graph Databases... almost never the right choice in interviews. Even Facebook uses MySQL. Common interview mistake to choose these.' The messaging system has no graph traversal requirement. You don't ask 'what's the shortest path from user A to user B through messages' — you ask 'what messages does user A have?' These are table queries, not graph traversals. Choosing Neo4j here is solving a problem that doesn't exist. This is why the warning is so explicit: graph databases are chosen to appear sophisticated, not because they're necessary.",
    interviewScript: "In your interview, say: 'I was tempted by Neo4j because messages flow between users, but the actual queries are simple: get messages by user_id. That's a table query, not a graph problem. I'd use PostgreSQL with a messages table indexed on (user_id, timestamp). If I later needed graph traversal — like 'recommend users who've messaged my friends' — then I'd reconsider graph databases.'",
    proTip: null
  },
  {
    id: "q23",
    subtopic: "Indexing for Access Patterns",
    style: "Scenario-based reasoning",
    question: "Your user service has these endpoints: GET /users/{id}, GET /users?email={email}, GET /users?last_name={last_name}&first_name={first_name}. Your schema is `users(id, email, first_name, last_name, ...)`. What indexes would you create?",
    options: [
      "Create one index on (id) because id is already unique",
      "Create indexes on: (email) for the email endpoint, and (last_name, first_name) for the name filter endpoint. Index every column that appears in a WHERE clause",
      "Create one index on (email, first_name, last_name) to cover all queries",
      "Indexes slow down writes, so don't create any"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Indexing for Access Patterns — Indexes support important queries, connect indexes to API endpoints.' Each endpoint maps to a query: GET /{id} uses the primary key (inherently indexed), GET ?email= needs an index on email, GET ?last_name=&first_name= needs a compound index on (last_name, first_name). A single compound index (email, first_name, last_name) wouldn't help the email-only query efficiently (leftmost prefix rule). This is schema design driven by API contracts: examine all endpoints, list their filters, and create indexes accordingly.",
    interviewScript: "In your interview, say: 'I'd trace each endpoint to its query and add indexes accordingly. GET /{id} uses the primary key. GET ?email= needs an index on email. GET ?last_name=&first_name= needs (last_name, first_name). The goal: every important query hits an index.'",
    proTip: "Indexes are driven by access patterns, which come from API endpoints. Write the API contract first, then design indexes."
  },
  {
    id: "q24",
    subtopic: "Constraints & Data Integrity",
    style: "Scenario-based reasoning",
    question: "You're designing a user registration system. You define constraints: NOT NULL on email, UNIQUE on email, and a CHECK constraint ensuring age >= 18. During registration, a user submits an empty email field. Which constraint catches this error and at what layer?",
    options: [
      "The CHECK constraint catches it in the application code",
      "The database accepts any data and the application logic validates it",
      "The NOT NULL constraint prevents the INSERT at the database layer before any CHECK or UNIQUE constraint is evaluated. Catching errors at the database layer (database-enforced constraints) is preferable because it prevents invalid data from ever entering the system, even from bugs or direct database access",
      "No constraint catches empty emails"
    ],
    correctIndex: 2,
    explanation: "The article discusses constraints as part of schema design. Constraints exist in a hierarchy: NOT NULL is checked first (prevents NULLs), then CHECK (custom logic), then UNIQUE (duplicate prevention). By catching empty emails at the database layer (NOT NULL constraint), you ensure that no application bug, direct SQL, or API bypass can insert invalid data. Application-level validation is also necessary, but database constraints are the final safety net. This is defense-in-depth: validate in the application, then again in the database.",
    interviewScript: "In your interview, say: 'I'd enforce constraints at both layers. In the application, validate that email is non-empty and meets format requirements. In the database, add NOT NULL and UNIQUE constraints on email. This defense-in-depth approach ensures that even if application validation is bypassed, the database prevents invalid data.'",
    proTip: "Always use database constraints (NOT NULL, UNIQUE, CHECK, foreign keys) in addition to application validation. Database constraints are the last line of defense."
  },
  {
    id: "q25",
    subtopic: "SQL choice × Sharding strategy",
    style: "Cross-subtopic reasoning",
    question: "You've chosen PostgreSQL as your default database. Now you need to handle 1 million sign-ups per day and serve user profiles at 100,000 QPS. Sharding is necessary. You decide to shard by user_id using consistent hashing across 10 PostgreSQL instances. A user updates their profile (name, bio). What's the architectural implication of this sharding strategy combined with SQL?",
    options: [
      "Sharding eliminates the need for SQL",
      "PostgreSQL within each shard handles its own schema and queries. A user profile update goes to the single shard responsible for that user_id, updates locally, and returns. Joins within a shard work fine; cross-shard joins become expensive. The SQL advantage (complex queries) is only available within a shard, not across the cluster",
      "Sharding with SQL is impossible",
      "All 10 PostgreSQL instances sync automatically"
    ],
    correctIndex: 1,
    explanation: "The article emphasizes: 'Shard by primary access pattern.' When you shard by user_id and use SQL databases, you're trading SQL's JOIN power for horizontal scalability. Queries that involve only one user (get profile, update profile) work perfectly within a shard. But queries spanning multiple users (find users by city) require querying all shards — you lose SQL's advantage. This is why shard key choice is critical: it determines which queries stay local (fast) and which become cross-shard (slow).",
    interviewScript: "In your interview, say: 'Sharding by user_id means each shard is an independent PostgreSQL instance. Updates to a user's profile go to one shard and work beautifully with SQL. But if I need to query 'find users in {city}', I must query all 10 shards and merge results — SQL's JOIN advantage is limited to within-shard queries. This is acceptable because most queries (profile reads, followers) are per-user.'",
    proTip: "With sharding, SQL's power is constrained to single-shard queries. Choose shard keys that ensure your common queries stay within one shard."
  },
  {
    id: "q26",
    subtopic: "Normalization × Access Patterns",
    style: "Cross-subtopic reasoning",
    question: "You're designing a product catalog. You normalize: products(id, name, category_id, ...) and categories(id, name, ...). Every product list query joins products and categories by name, and this join is a bottleneck. Should you denormalize by embedding category name in products?",
    options: [
      "Yes, always denormalize bottleneck queries",
      "Before denormalizing, check: Does the category name change frequently? If rarely, embedding is acceptable. If frequently, denormalization creates consistency problems. First try indexing the foreign key join, use EXPLAIN to diagnose, and consider caching instead. Denormalization is a last resort after you've optimized the normalized schema",
      "Normalization and denormalization are equally fast",
      "You should use MongoDB instead"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Start normalized, denormalize only when needed.' A join bottleneck doesn't automatically mean denormalize. Optimization steps: (1) Index foreign keys (category_id), (2) Run EXPLAIN to confirm the join is the issue, (3) Try caching the join result, (4) Only then denormalize. If category names change rarely, denormalization is low-cost. If they change frequently, embedding creates cascading updates. The right answer depends on your specific access patterns and consistency requirements.",
    interviewScript: "In your interview, say: 'Before denormalizing, I'd diagnose: add an index on products.category_id, review EXPLAIN plans to confirm the join is the bottleneck, and try caching. If the join is still slow and category names change rarely, I'd denormalize. If names change frequently, I'd stick with the normalized schema and optimize differently.'",
    proTip: "Denormalization is a statement about your entire system: what changes frequently, what's queried constantly, and what's acceptable write cost. Don't denormalize to fix a single slow query."
  },
  {
    id: "q27",
    subtopic: "Document DB embedding × Consistency Requirements",
    style: "Cross-subtopic reasoning",
    question: "You're building a job board using MongoDB. You embed job applications in the user document: `users: { _id, name, applications: [ { job_id, status, applied_at } ] }`. A job is deleted. Should you remove the application from the user document?",
    options: [
      "Yes, always cascade deletes to maintain referential integrity",
      "It depends on consistency requirements. If historical records are important (audit trail), keep the application even if the job is deleted — the user applied, that's fact. If applications are transient, deletion is fine. But this decision reveals the embedding trade-off: mongoDB doesn't enforce consistency automatically. Your application code must decide what 'delete' means. With separate collections and foreign keys, the database enforces the rule",
      "MongoDB automatically deletes embedded documents",
      "You should use PostgreSQL instead"
    ],
    correctIndex: 1,
    explanation: "The article states: 'Document Databases... denormalize aggressively, embed related data' but this creates consistency decisions that SQL handles. With SQL foreign keys, ON DELETE CASCADE is explicit. With embedded MongoDB documents, you must decide in your code: are applications immutable history (don't delete), or transient records (delete)? This inconsistency isn't a MongoDB flaw — it's a design choice. MongoDB doesn't prevent you from having stale job_id references. Your schema design and application logic must handle it.",
    interviewScript: "In your interview, say: 'Embedding applications in the user document shifts consistency decisions to the application layer. I'd ask: are applications immutable history? If yes, keep them even if the job is deleted — the fact that the user applied is historical. If applications are transient, delete them on job deletion. Either way, my application code is responsible for consistency, not the database.'",
    proTip: "Embedding in MongoDB isn't free — it just moves consistency management from database constraints to application code. Understand what you're accepting."
  }
];

const SUBTOPICS_ORDER = [
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

const SUBTOPIC_QUESTION_COUNTS = SUBTOPICS_ORDER.map(st => ({
  name: st,
  count: QUESTIONS.filter(q => q.subtopic === st).length
}));

const CONFIDENCE_LEVELS = ["Guessing", "Somewhat Sure", "Very Confident"];

const GRADES = [
  { min: 90, label: "Staff-ready", desc: "you'd ace this topic", color: "text-emerald-400" },
  { min: 75, label: "Strong Senior", desc: "solid, minor gaps to close", color: "text-blue-400" },
  { min: 60, label: "SDE2-level", desc: "review the weak areas below", color: "text-yellow-400" },
  { min: 0, label: "Needs deep review", desc: "revisit the fundamentals", color: "text-red-400" }
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Timer({ seconds, maxSeconds }) {
  const pct = (seconds / maxSeconds) * 100;
  const color = seconds <= 15 ? "text-red-400" : seconds <= 30 ? "text-amber-400" : "text-gray-200";
  const bgColor = seconds <= 15 ? "bg-red-500" : seconds <= 30 ? "bg-amber-500" : "bg-indigo-500";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div className="flex items-center gap-3">
      <Clock className={`w-5 h-5 ${color}`} />
      <div className="flex-1">
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${bgColor} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={`font-mono text-lg font-bold ${color}`}>{m}:{s.toString().padStart(2, "0")}</span>
    </div>
  );
}

function LandingScreen({ onStart }) {
  const [mode, setMode] = useState("shuffled");
  const totalTime = Math.round((QUESTIONS.length * 75) / 60);
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-400 text-xs font-semibold mb-4">
            <Zap className="w-3 h-3" /> FAANG SDE2 — Hard
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Data Modeling
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Master database selection, schema design, normalization, sharding, and consistency trade-offs for system design interviews.
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5"><Target className="w-4 h-4 text-indigo-400" />{QUESTIONS.length} questions</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" />~{totalTime} min</div>
          <div className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-indigo-400" />90s / question</div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Subtopic Coverage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUBTOPIC_QUESTION_COUNTS.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 truncate mr-2">{s.name}</span>
                <span className="text-indigo-400 font-mono text-xs flex-shrink-0">{s.count}q</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setMode("section")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "section" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-750"}`}>
            <BookOpen className="w-4 h-4 inline mr-1.5" />Section Order
          </button>
          <button onClick={() => setMode("shuffled")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "shuffled" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-750"}`}>
            <BarChart3 className="w-4 h-4 inline mr-1.5" />Shuffled
          </button>
        </div>

        <button onClick={() => onStart(mode)} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-900/30">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({ question, questionIndex, totalQuestions, onAnswer, onSkip, onFlag, isFlagged, timeLeft, maxTime }) {
  const [selected, setSelected] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      setTimedOut(true);
      setSubmitted(true);
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    const handler = (e) => {
      if (submitted) {
        if (e.key === "Enter") onAnswer(selected, confidence, timedOut);
        return;
      }
      const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined && idx < question.options.length) setSelected(idx);
      if (e.key === "Enter" && selected !== null && confidence !== null) {
        setSubmitted(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, selected, confidence, question, onAnswer, timedOut]);

  const handleSubmit = () => {
    if (selected !== null && confidence !== null) setSubmitted(true);
  };

  const optionLabels = ["A", "B", "C", "D"];
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <ProgressBar current={questionIndex + 1} total={totalQuestions} />
        </div>
        <div className="mb-4">
          <Timer seconds={timeLeft} maxSeconds={maxTime} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-medium">
            {question.subtopic}
          </span>
          <div className="flex gap-2">
            <button onClick={onFlag} className={`p-2 rounded-lg transition-all ${isFlagged ? "bg-amber-900/40 text-amber-400" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`} title="Flag for review">
              <Flag className="w-4 h-4" />
            </button>
            {!submitted && (
              <button onClick={onSkip} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-200 text-sm transition-all">
                <SkipForward className="w-4 h-4" /> Skip
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-4">
          <p className="text-gray-100 leading-relaxed text-sm">{question.question}</p>
        </div>

        <div className="space-y-3 mb-4">
          {question.options.map((opt, i) => {
            let borderClass = "border-gray-800 hover:border-gray-600";
            let bgClass = "bg-gray-900";
            let labelBg = "bg-gray-800";
            if (submitted) {
              if (i === question.correctIndex) {
                borderClass = "border-emerald-500"; bgClass = "bg-emerald-900/20"; labelBg = "bg-emerald-700";
              } else if (i === selected && !isCorrect) {
                borderClass = "border-red-500"; bgClass = "bg-red-900/20"; labelBg = "bg-red-700";
              } else {
                borderClass = "border-gray-800 opacity-50";
              }
            } else if (i === selected) {
              borderClass = "border-indigo-500"; bgClass = "bg-indigo-900/20"; labelBg = "bg-indigo-600";
            }
            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-xl border ${borderClass} ${bgClass} transition-all flex gap-3`}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-lg ${labelBg} flex items-center justify-center text-xs font-bold text-white`}>
                  {optionLabels[i]}
                </span>
                <span className="text-sm text-gray-200 leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {!submitted && selected !== null && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Confidence</p>
            <div className="flex gap-2">
              {CONFIDENCE_LEVELS.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setConfidence(c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${confidence === c ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-750"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null || confidence === null}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${selected !== null && confidence !== null ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed"}`}
          >
            Submit Answer
          </button>
        )}

        {submitted && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isCorrect && !timedOut ? "border-emerald-700 bg-emerald-900/20" : "border-red-700 bg-red-900/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect && !timedOut ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                <span className={`font-semibold text-sm ${isCorrect && !timedOut ? "text-emerald-400" : "text-red-400"}`}>
                  {isCorrect && !timedOut ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
            </div>

            <div className="p-4 rounded-xl border border-blue-800/50 bg-blue-900/10">
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1.5">Interview Script</p>
              <p className="text-sm text-gray-300 leading-relaxed italic">{question.interviewScript}</p>
            </div>

            {question.proTip && (
              <div className="p-4 rounded-xl border border-purple-800/50 bg-purple-900/10">
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1.5">Pro Tip</p>
                <p className="text-sm text-gray-300 leading-relaxed">{question.proTip}</p>
              </div>
            )}

            <button onClick={() => onAnswer(selected, confidence, timedOut)} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all flex items-center justify-center gap-2">
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ answers, questions, flaggedIds, totalElapsed, onRetryMissed, onRetryWeak, onRestart }) {
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct / questions.length) * 100);
  const grade = GRADES.find(g => pct >= g.min);

  const subtopicResults = SUBTOPICS_ORDER.map(st => {
    const qs = answers.filter(a => a.subtopic === st);
    const c = qs.filter(a => a.correct).length;
    return { name: st, total: qs.length, correct: c, pct: qs.length > 0 ? Math.round((c / qs.length) * 100) : 0 };
  }).filter(s => s.total > 0);

  const luckyGuesses = answers.filter(a => a.correct && a.confidence === "Guessing");
  const overconfidentMisses = answers.filter(a => !a.correct && a.confidence === "Very Confident");
  const incorrectAnswers = answers.filter(a => !a.correct);
  const flaggedAnswers = answers.filter(a => flaggedIds.has(a.id));

  const mins = Math.floor(totalElapsed / 60);
  const secs = totalElapsed % 60;

  const [showSection, setShowSection] = useState("subtopics");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Award className={`w-12 h-12 mx-auto mb-3 ${grade.color}`} />
          <div className="text-5xl font-bold mb-1">{pct}%</div>
          <div className={`text-lg font-semibold ${grade.color}`}>{grade.label}</div>
          <div className="text-gray-500 text-sm">{grade.desc}</div>
          <div className="text-gray-600 text-xs mt-2">{correct}/{questions.length} correct · {mins}m {secs}s total</div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["subtopics", "confidence", "incorrect", "flagged"].map(s => (
            <button key={s} onClick={() => setShowSection(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${showSection === s ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"}`}>
              {s === "subtopics" && "Subtopics"}
              {s === "confidence" && `Confidence (${luckyGuesses.length + overconfidentMisses.length})`}
              {s === "incorrect" && `Incorrect (${incorrectAnswers.length})`}
              {s === "flagged" && `Flagged (${flaggedAnswers.length})`}
            </button>
          ))}
        </div>

        {showSection === "subtopics" && (
          <div className="space-y-2 mb-6">
            {subtopicResults.map(s => (
              <div key={s.name} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{s.name}</span>
                  <span className={`font-mono font-bold ${s.pct >= 70 ? "text-emerald-400" : s.pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{s.correct}/{s.total}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${s.pct >= 70 ? "bg-emerald-500" : s.pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {showSection === "confidence" && (
          <div className="space-y-4 mb-6">
            {luckyGuesses.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Lucky Guesses ({luckyGuesses.length})
                </h3>
                <div className="space-y-2">
                  {luckyGuesses.map(a => (
                    <div key={a.id} className="bg-gray-900 rounded-lg p-3 border border-amber-800/30 text-sm text-gray-300">{a.question}</div>
                  ))}
                </div>
              </div>
            )}
            {overconfidentMisses.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Overconfident Misses ({overconfidentMisses.length})
                </h3>
                <div className="space-y-2">
                  {overconfidentMisses.map(a => (
                    <div key={a.id} className="bg-gray-900 rounded-lg p-3 border border-red-800/30">
                      <p className="text-sm text-gray-300 mb-2">{a.question}</p>
                      <p className="text-xs text-gray-500">{a.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {luckyGuesses.length === 0 && overconfidentMisses.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No confidence issues detected. Your self-assessment was well-calibrated.</p>
            )}
          </div>
        )}

        {showSection === "incorrect" && (
          <div className="space-y-3 mb-6">
            {incorrectAnswers.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Perfect score! No incorrect answers.</p>
            ) : incorrectAnswers.map(a => (
              <div key={a.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs mb-2">{a.subtopic}</span>
                <p className="text-sm text-gray-200 mb-2">{a.question}</p>
                <p className="text-xs text-emerald-400 mb-1">Correct: {a.correctAnswer}</p>
                <p className="text-xs text-gray-500">{a.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {showSection === "flagged" && (
          <div className="space-y-3 mb-6">
            {flaggedAnswers.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No flagged questions.</p>
            ) : flaggedAnswers.map(a => (
              <div key={a.id} className="bg-gray-900 rounded-lg p-4 border border-amber-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-gray-400">{a.subtopic}</span>
                  {a.correct ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <p className="text-sm text-gray-200 mb-2">{a.question}</p>
                <p className="text-xs text-gray-500">{a.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {incorrectAnswers.length > 0 && (
            <button onClick={onRetryMissed} className="flex-1 py-3 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 font-medium hover:bg-red-900/50 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retry Missed ({incorrectAnswers.length})
            </button>
          )}
          {subtopicResults.some(s => s.pct < 70) && (
            <button onClick={onRetryWeak} className="flex-1 py-3 rounded-xl bg-amber-900/30 border border-amber-800/50 text-amber-300 font-medium hover:bg-amber-900/50 transition-all flex items-center justify-center gap-2">
              <Target className="w-4 h-4" /> Retry Weak Subtopics
            </button>
          )}
          <button onClick={onRestart} className="flex-1 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-750 transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataModelingQuiz({ quizSlug = 'core-concepts-data-modeling' }) {
  const [screen, setScreen] = useState("landing");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [skippedIndices, setSkippedIndices] = useState([]);
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(90);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);
  const elapsedRef = useRef(null);

  const MAX_TIME = 90;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(elapsedRef.current);
    setTimeLeft(MAX_TIME);
    return;
    timerRef.current = setInterval(() => setTimeLeft(t => t), 1000);
    elapsedRef.current = setInterval(() => setTotalElapsed(t => t + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(elapsedRef.current); }, []);

  const startQuiz = (mode, questionSet = null) => {
    const qs = questionSet || (mode === "section"
      ? SUBTOPICS_ORDER.flatMap(st => QUESTIONS.filter(q => q.subtopic === st))
      : shuffleArray(QUESTIONS));
    setQuizQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setSkippedIndices([]);
    setFlaggedIds(new Set());
    setTotalElapsed(0);
    setScreen("quiz");
    startTimer();
    startNewAttempt(qs.map(q => q.id));
  };

  const handleAnswer = (selectedIdx, confidence, timedOut) => {
    stopTimer();
    const q = quizQuestions[currentIndex];
    const isCorrect = !timedOut && selectedIdx === q.correctIndex;
    setAnswers(prev => [...prev, {
      id: q.id,
      subtopic: q.subtopic,
      question: q.question,
      correct: isCorrect,
      selected: selectedIdx,
      confidence: confidence || "Guessing",
      explanation: q.explanation,
      correctAnswer: q.options[q.correctIndex],
      timedOut
    }]);
    persistAnswer(q.id, {
      selectedIndex: selectedIdx,
      correctIndex: q.correctIndex,
      isCorrect,
      confidence: confidence || null,
      timedOut: timedOut || false,
    });

    const nextIdx = currentIndex + 1;
    if (nextIdx < quizQuestions.length) {
      setCurrentIndex(nextIdx);
      startTimer();
    } else if (skippedIndices.length > 0) {
      // move skipped to end
      const skippedQs = skippedIndices.map(i => quizQuestions[i]);
      setQuizQuestions(prev => [...prev.filter((_, i) => !skippedIndices.includes(i)), ...skippedQs]);
      setCurrentIndex(nextIdx - skippedIndices.length);
      setSkippedIndices([]);
      startTimer();
    } else {
      stopTimer();
      const allAnswers = [...answers, { correct: isCorrect }];
      const correctCount = allAnswers.filter(a => a.correct).length;
      completeQuiz({ correct: correctCount, total: allAnswers.length }, totalElapsed);
      setScreen("results");
    }
  };

  const handleSkip = () => {
    setSkippedIndices(prev => [...prev, currentIndex]);
    const nextIdx = currentIndex + 1;
    if (nextIdx < quizQuestions.length) {
      setCurrentIndex(nextIdx);
      stopTimer();
      startTimer();
    } else {
      // All remaining are skipped — bring them back
      const skippedQs = [...skippedIndices, currentIndex].map(i => quizQuestions[i]);
      const answered = quizQuestions.filter((_, i) => ![...skippedIndices, currentIndex].includes(i));
      setQuizQuestions([...answered, ...skippedQs]);
      setCurrentIndex(answered.length);
      setSkippedIndices([]);
      stopTimer();
      startTimer();
    }
  };

  const handleFlag = () => {
    const q = quizQuestions[currentIndex];
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const retryMissed = () => {
    const missedIds = new Set(answers.filter(a => !a.correct).map(a => a.id));
    const missed = QUESTIONS.filter(q => missedIds.has(q.id));
    startQuiz("shuffled", shuffleArray(missed));
  };

  const retryWeak = () => {
    const subtopicResults = {};
    answers.forEach(a => {
      if (!subtopicResults[a.subtopic]) subtopicResults[a.subtopic] = { correct: 0, total: 0 };
      subtopicResults[a.subtopic].total++;
      if (a.correct) subtopicResults[a.subtopic].correct++;
    });
    const weakSubtopics = Object.entries(subtopicResults)
      .filter(([_, v]) => v.total > 0 && (v.correct / v.total) < 0.7)
      .map(([k]) => k);
    const weakQs = QUESTIONS.filter(q => weakSubtopics.includes(q.subtopic));
    startQuiz("shuffled", shuffleArray(weakQs));
  };

  if (screen === "landing") return <LandingScreen onStart={startQuiz} />;

  if (screen === "results") {
    return (
      <ResultsScreen
        answers={answers}
        questions={quizQuestions}
        flaggedIds={flaggedIds}
        totalElapsed={totalElapsed}
        onRetryMissed={retryMissed}
        onRetryWeak={retryWeak}
        onRestart={() => setScreen("landing")}
      />
    );
  }

  const currentQ = quizQuestions[currentIndex];
  if (!currentQ) return null;

  return (
    <QuestionScreen
      key={`${currentIndex}-${currentQ.id}`}
      question={currentQ}
      questionIndex={currentIndex}
      totalQuestions={quizQuestions.length}
      onAnswer={handleAnswer}
      onSkip={handleSkip}
      onFlag={handleFlag}
      isFlagged={flaggedIds.has(currentQ.id)}
      timeLeft={timeLeft}
      maxTime={MAX_TIME}
    />
  );
}
