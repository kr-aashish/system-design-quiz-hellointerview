// === COVERAGE MANIFEST ===
// Content type: deep pattern (database indexing deep-dive with multiple index types and optimization patterns)
//
// HEAVY subtopics:
//   B-Tree Indexes — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Nested: B-tree structure & disk I/O — covered by: [q1, q2]
//     └─ Nested: B-tree as default choice / trade-offs — covered by: [q3, q4]
//   LSM Trees — Questions: 4 — IDs: [q5, q6, q7, q8]
//     └─ Nested: Write path (memtable, WAL, SSTable flush) — covered by: [q5, q6]
//     └─ Nested: Read path & optimizations (bloom filters, compaction) — covered by: [q7, q8]
//   Geospatial Indexes — Questions: 4 — IDs: [q9, q10, q11, q12]
//     └─ Nested: Why lat/lng B-trees fail — covered by: [q9]
//     └─ Nested: Geohash — covered by: [q10, q11]
//     └─ Nested: Quadtree vs R-tree — covered by: [q12]
//   Composite Indexes — Questions: 3 — IDs: [q13, q14, q15]
//     └─ Nested: Column ordering — covered by: [q13, q14]
//     └─ Nested: Prefix rule — covered by: [q15]
//
// MEDIUM subtopics:
//   Physical Storage & Access Patterns — Questions: 2 — IDs: [q16, q17]
//   Index Cost & Trade-offs — Questions: 2 — IDs: [q18, q19]
//   Inverted Indexes — Questions: 2 — IDs: [q20, q21]
//   Covering Indexes — Questions: 2 — IDs: [q22, q23]
//   Hash Indexes — Questions: 2 — IDs: [q24, q25]
//
// THIN subtopics (standalone):
//   R-tree specifics (overlapping rectangles) — Questions: 1 — IDs: [q26]
//   Quadtree adaptive resolution — Questions: 1 — IDs: [q27]
//
// THIN subtopics (clustered):
//   Cluster: SSD vs HDD access patterns + heap file storage — Questions: 1 — IDs: [q28]
//   Cluster: WAL durability + memtable crash recovery — Questions: 1 — IDs: [q29]
//   Cluster: Bloom filter false positives + sparse indexes — Questions: 1 — IDs: [q30]
//
// CROSS-SUBTOPIC bridges:
//   B-Tree × LSM Tree (write-heavy decision) — IDs: [q31, q32]
//   Geospatial × B-Tree (geohash leveraging B-trees) — IDs: [q33]
//   Composite × Covering (optimization layering) — IDs: [q34]
//   Inverted Index × B-Tree (text search limitations) — IDs: [q35]
//
// Anti-pattern questions: 4 — IDs: [q3, q9, q18, q25]
// Gotcha/trap questions: 4 — IDs: [q7, q15, q19, q30]
//
// Total: 35 questions across 14 subtopics (4 heavy, 5 medium, 5 thin/clustered)
// ========================

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, Clock, Flag, SkipForward, Check, X, AlertTriangle, Award, RotateCcw, BookOpen, Brain, Zap, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useQuizProgress } from "./useQuizProgress";

const QUESTIONS = [
  // q1 — B-Tree: structure & disk I/O
  {
    id: "q1",
    subtopic: "B-Tree Indexes",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "Your PostgreSQL table has 50 million user records. The B-tree index on the primary key uses 8KB pages, and each internal node holds ~500 keys. Roughly how many disk page reads does a primary key lookup require?",
    options: [
      "2-3 page reads: root → internal → leaf, since log₅₀₀(50M) ≈ 2.8",
      "5-6 page reads: the tree must be at least 5 levels deep for 50M records",
      "1 page read: the root node can hold all 50M keys in a single 8KB page",
      "10+ page reads: B-trees degrade to near-linear scan at this scale"
    ],
    correct: 0,
    explanation: "With a branching factor of ~500, a B-tree can index 500³ = 125 million records in just 3 levels. For 50 million records, log₅₀₀(50M) ≈ 2.8, meaning 2-3 page reads suffice. This is the fundamental efficiency of B-trees: by matching node size to disk page size and maximizing the branching factor, they minimize I/O. Option B overestimates because it ignores the high branching factor. Option C is impossible — a single 8KB page can hold ~500 keys, not 50M.",
    interviewScript: "In your interview, say: 'B-trees are designed so each node fits in one disk page, typically 8KB. With a branching factor of around 500, even 50 million records only require about 3 levels — so a lookup is 2-3 disk reads. This is why B-trees are the default: they turn millions of records into just a few I/O operations.'",
    proTip: "In practice, the root node and often the first internal level are cached in the buffer pool, so many lookups only hit disk for the leaf page — effectively 1 disk read."
  },
  // q2 — B-Tree: self-balancing property
  {
    id: "q2",
    subtopic: "B-Tree Indexes",
    tier: "Heavy",
    style: "Failure analysis",
    question: "A junior engineer notices that after months of random inserts and deletes on a B-tree indexed table, query performance hasn't degraded. They're surprised because they expected the tree to become unbalanced. Why is this expectation wrong?",
    options: [
      "B-trees enforce that all leaf nodes remain at the same depth, splitting and merging nodes to stay balanced regardless of insert/delete patterns",
      "PostgreSQL periodically runs REINDEX in the background to rebalance B-trees automatically",
      "B-trees don't actually stay balanced — the engineer just hasn't noticed the degradation yet because the table is small",
      "Modern SSDs make random access so fast that tree imbalance doesn't affect performance"
    ],
    correct: 0,
    explanation: "B-trees are self-balancing by design: all leaf nodes must be at the same depth, and nodes split when they overflow or merge when they underflow. This is a structural invariant of B-trees, not an optimization. Option B is wrong — PostgreSQL doesn't auto-reindex (though VACUUM can reclaim space). Option D confuses I/O speed with algorithmic guarantees; even on SSDs, an unbalanced tree would have worse worst-case performance.",
    interviewScript: "In your interview, say: 'B-trees maintain balance as a structural invariant — every leaf is at the same depth. When a node overflows during insertion, it splits, potentially propagating up to the root. This guarantees O(log n) lookups regardless of the insertion pattern, which is why they avoid the performance cliffs you'd see with unbalanced BSTs.'"
  },
  // q3 — B-Tree: anti-pattern identification
  {
    id: "q3",
    subtopic: "B-Tree Indexes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate proposes adding B-tree indexes on every column of a logging table that receives 50,000 inserts/second but is only queried weekly for compliance reports. What's the most critical flaw in this design?",
    options: [
      "B-tree indexes on every column will multiply write amplification — each insert triggers updates to every index, turning one logical write into many disk writes and severely degrading ingestion throughput",
      "B-tree indexes don't work on logging tables because log entries are append-only",
      "The indexes will consume so much RAM that the database will run out of memory within hours",
      "Weekly queries are too infrequent to benefit from any indexing strategy"
    ],
    correct: 0,
    explanation: "Every index on a table must be updated on every write. With 50K inserts/second and, say, 10 indexes, that's 500K index updates/second on top of the data writes. For a write-heavy, rarely-read table, this overhead far outweighs the read benefit. The correct approach is minimal indexing (or none) during ingestion, with indexes added before the weekly query if needed. Option D is wrong — infrequent queries can still benefit enormously from indexes; the issue is the write cost.",
    interviewScript: "In your interview, say: 'Indexes aren't free — every index on a table must be updated on every write. For a write-heavy logging table queried weekly, I'd minimize indexes during ingestion and consider adding them before query time, or use an LSM-tree-based store designed for write-heavy workloads.'"
  },
  // q4 — B-Tree: why default choice
  {
    id: "q4",
    subtopic: "B-Tree Indexes",
    tier: "Heavy",
    style: "Decision framework application",
    question: "Your team is designing a user profile service. The access patterns include exact email lookups, range queries on signup_date, and ORDER BY on last_active. A teammate suggests using hash indexes for email (O(1) lookups) and B-trees for the date fields. What's the strongest counter-argument?",
    options: [
      "B-trees handle equality lookups nearly as fast as hash indexes while also supporting range queries and sorting — using hash indexes adds complexity for marginal gain",
      "Hash indexes are faster for all query types, so the teammate should use hash indexes everywhere",
      "The teammate's approach is optimal — always use the most specialized index for each access pattern",
      "Neither hash nor B-tree indexes support exact email lookups efficiently; you need an inverted index"
    ],
    correct: 0,
    explanation: "As PostgreSQL's own documentation notes, B-trees handle equality comparisons 'almost as efficiently as hash indexes.' The marginal speed gain of hash indexes for exact matches rarely justifies losing range query and sorting support. For a user profile service where future query patterns may evolve, B-tree's versatility is more valuable. Option C sounds reasonable but ignores the operational cost of maintaining different index types for marginal benefit.",
    interviewScript: "In your interview, say: 'I'd use B-trees for all three columns. B-trees are nearly as fast as hash indexes for exact matches, and they give us range queries and sorting for free. Hash indexes solve a problem we rarely have — the complexity isn't worth the marginal lookup speed gain.'"
  },
  // q5 — LSM Tree: write path
  {
    id: "q5",
    subtopic: "LSM Trees",
    tier: "Heavy",
    style: "Scenario-based trade-offs",
    question: "You're designing a metrics ingestion pipeline processing 500K writes/second from IoT sensors. The data must be durable (no data loss on crash) and support time-range queries. Which storage approach best fits these constraints?",
    options: [
      "LSM tree with WAL: writes go to an in-memory memtable with a sequential WAL append for durability, then flush to sorted SSTables — converting random writes to sequential I/O",
      "B-tree with write-ahead logging: each write updates the B-tree in place, which provides both durability and range query support with minimal overhead",
      "In-memory hash table with periodic snapshots to disk: fastest possible writes with snapshot-based durability",
      "Append-only log file with a B-tree index rebuilt on each query: separates write and read paths completely"
    ],
    correct: 0,
    explanation: "At 500K writes/second, B-trees become a bottleneck because each write requires finding and updating the correct leaf page (random I/O). LSM trees convert this to sequential I/O: writes go to an in-memory memtable (fast) and a sequential WAL append (durable). The memtable is periodically flushed as a sorted SSTable, which supports range queries. Option C sacrifices durability between snapshots. Option D would make queries prohibitively slow since you'd rebuild the index every time.",
    interviewScript: "In your interview, say: 'For 500K writes/second, I'd choose an LSM-tree-based storage engine like RocksDB. It buffers writes in a memtable, appends to a WAL for durability, and periodically flushes sorted SSTables to disk. This converts random writes to sequential I/O, which is critical at this throughput. The sorted SSTables also support the time-range queries we need.'"
  },
  // q6 — LSM Tree: SSTable flush mechanics
  {
    id: "q6",
    subtopic: "LSM Trees",
    tier: "Heavy",
    style: "Ordering/sequencing",
    question: "In an LSM tree, what is the correct sequence when a write arrives and the memtable is approaching its size threshold?",
    options: [
      "Write to WAL → insert into memtable → when threshold hit: freeze memtable, create new empty memtable, flush frozen memtable to SSTable in background",
      "Insert into memtable → flush memtable to SSTable → write to WAL after SSTable is confirmed on disk",
      "Write to WAL → flush memtable to SSTable → insert into new memtable → delete WAL",
      "Insert into memtable → write to WAL → block all new writes → flush to SSTable → resume writes"
    ],
    correct: 0,
    explanation: "The WAL must be written BEFORE the memtable insert confirms to the client — this ensures durability. When the memtable hits its size threshold, it's frozen (made immutable) and a new empty memtable takes over for incoming writes. The frozen memtable is flushed to disk as an SSTable in the background, so writes are never blocked. Option B writes the WAL after the SSTable, which would lose data if the system crashes during the flush. Option D blocks writes during flush, which defeats the purpose of LSM trees.",
    interviewScript: "In your interview, say: 'The write path is: append to WAL for durability, insert into the memtable, and acknowledge. When the memtable fills up, we freeze it and swap in a fresh one — writes keep flowing. The frozen memtable flushes to an SSTable in the background. This is why LSM trees achieve such high write throughput: writes are never blocked by disk flushes.'"
  },
  // q7 — LSM Tree: gotcha on read path
  {
    id: "q7",
    subtopic: "LSM Trees",
    tier: "Heavy",
    style: "Gotcha/trap question",
    question: "A Cassandra cluster uses LSM trees. An engineer observes that point queries for recently written keys are fast, but queries for keys written months ago are sometimes 10x slower. They add more RAM to improve buffer caching, but the problem persists. What's the actual issue?",
    options: [
      "Old keys may exist across many SSTable levels due to accumulated compaction debt — the read must check multiple SSTables even with bloom filters, and more RAM doesn't reduce the number of SSTables to check",
      "Cassandra automatically deletes data older than 30 days, so old key lookups trigger tombstone scans",
      "The LSM tree's bloom filters expire after a configurable TTL, so old SSTables lose their filters",
      "RAM only helps B-tree indexes; LSM trees store all data on disk and never cache SSTable pages"
    ],
    correct: 0,
    explanation: "This is a classic LSM gotcha: compaction debt. If compaction can't keep up, old data fragments across many SSTables. A point query must check each level — even with bloom filters (which have false positive rates of ~1%), checking 50+ SSTables adds significant latency. More RAM helps cache SSTable metadata but doesn't reduce the number of files to check. The fix is tuning compaction strategy or increasing compaction throughput. Option C is wrong — bloom filters don't expire. Option D is wrong — LSM trees absolutely use page caching.",
    interviewScript: "In your interview, say: 'This is compaction debt — a well-known LSM pitfall. When background compaction can't keep up with write volume, old data fragments across many SSTables. Each point query must check multiple levels, and even bloom filters can't eliminate all the I/O. The fix is tuning the compaction strategy: leveled compaction keeps fewer files per level at the cost of more write amplification.'",
    proTip: "Leveled compaction in Cassandra guarantees at most ~10 SSTables to check per read vs. potentially hundreds with size-tiered compaction — but it doubles write amplification."
  },
  // q8 — LSM Tree: compaction strategies
  {
    id: "q8",
    subtopic: "LSM Trees",
    tier: "Heavy",
    style: "Scenario-based trade-offs",
    question: "You're running a time-series database on an LSM engine. Write throughput is your top priority, and reads are mostly sequential scans over time ranges. Which compaction strategy should you choose and why?",
    options: [
      "Size-tiered compaction: it minimizes write amplification by merging SSTables of similar size, and sequential range scans are less affected by having more SSTables since they read large contiguous blocks",
      "Leveled compaction: it minimizes the number of SSTables per level, making range scans faster by reducing the merge overhead during reads",
      "No compaction: since it's time-series data, old SSTables can simply be deleted after a retention period, eliminating compaction overhead entirely",
      "FIFO compaction with leveled overlay: write new data with FIFO and periodically switch to leveled for older data"
    ],
    correct: 0,
    explanation: "Size-tiered compaction is optimal for write-heavy time-series workloads because it minimizes write amplification — data is rewritten fewer times during compaction. The trade-off is more SSTables to check during reads, but sequential range scans (the primary read pattern for time-series) are less affected than point queries since they read large blocks anyway. Leveled compaction would reduce read latency but at the cost of significantly higher write amplification, which conflicts with the top priority. Option C sounds clever but would leave deleted/updated records unreclaimed and bloom filters wouldn't work without compaction.",
    interviewScript: "In your interview, say: 'For write-heavy time-series with sequential reads, I'd choose size-tiered compaction. It minimizes write amplification — data gets rewritten fewer times — which directly serves our top priority. Range scans tolerate more SSTables better than point queries do, since they read sequentially. Leveled compaction would improve point reads but at 2-3x the write cost.'"
  },
  // q9 — Geospatial: anti-pattern (lat/lng B-trees)
  {
    id: "q9",
    subtopic: "Geospatial Indexes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate designs a restaurant finder with separate B-tree indexes on latitude and longitude columns. For 'find restaurants within 5 miles,' they propose using both indexes via index intersection. What specific performance problem will they hit?",
    options: [
      "The two indexes produce a rectangular intersection covering a huge band across the globe at the target latitude/longitude — the candidate must filter millions of false positives that fall in the band but outside the actual 5-mile radius",
      "B-tree indexes cannot store decimal values like latitude and longitude, so the queries will fail entirely",
      "Index intersection only works with hash indexes, not B-trees, so PostgreSQL will fall back to a sequential scan",
      "The 5-mile radius calculation requires trigonometric functions that invalidate the B-tree's sort order"
    ],
    correct: 0,
    explanation: "With separate B-tree indexes on lat and lng, the database finds all restaurants in the right latitude band and all in the right longitude band, then intersects. But each band spans the entire globe at that coordinate — the intersection is a rectangle far larger than the 5-mile circle. For a dense dataset, this means scanning thousands of false positives. This is the fundamental 2D problem: B-trees treat each dimension independently and can't efficiently represent proximity in 2D space. Geospatial indexes solve this by preserving spatial locality.",
    interviewScript: "In your interview, say: 'Separate B-tree indexes on lat and lng create a band problem — each index returns all points in a global strip at that coordinate. Their intersection is a huge rectangle, not a tight circle. We'd scan thousands of false positives. This is why we need spatial indexes like geohash or R-trees that preserve 2D proximity in their structure.'"
  },
  // q10 — Geospatial: Geohash mechanics
  {
    id: "q10",
    subtopic: "Geospatial Indexes",
    tier: "Heavy",
    style: "Implementation-specific nuance",
    question: "You're implementing geohash-based proximity search in Redis. A user searches for restaurants within 2 miles. Your system finds the user's geohash prefix at the appropriate precision, but some nearby restaurants are missing from results. What's the most likely cause?",
    options: [
      "Restaurants near the edge of a geohash cell boundary have different prefixes despite being physically close — the system must also query the 8 adjacent geohash cells to avoid missing edge cases",
      "Redis geohash has a maximum precision of 4 characters, which is too coarse for 2-mile radius queries",
      "Geohash indexes only work with exact-match queries, not radius searches",
      "The user's coordinates were rounded to the nearest geohash centroid, shifting the search center"
    ],
    correct: 0,
    explanation: "This is the classic geohash edge problem: two points can be physically adjacent but fall in different geohash cells, giving them completely different prefixes. A restaurant 100 meters away might have a totally different geohash prefix if it's across a cell boundary. The solution is to query not just the target cell but all 8 adjacent cells — this is why Redis's GEOSEARCH command handles this internally. Option B is wrong — geohash precision can go much higher (up to 12+ characters in Redis).",
    interviewScript: "In your interview, say: 'Geohash has a known edge-case: points near cell boundaries have different prefixes despite being close physically. For radius queries, we must query the target cell plus all 8 neighbors. Redis handles this automatically in GEOSEARCH, but if you're implementing it manually, missing the adjacent cell queries is a common bug.'",
    proTip: "The number of adjacent cells to query depends on the ratio of search radius to cell size. For very large radii relative to cell precision, you may need to drop one precision level and query fewer, larger cells."
  },
  // q11 — Geospatial: Geohash + B-tree synergy
  {
    id: "q11",
    subtopic: "Geospatial Indexes",
    tier: "Heavy",
    style: "Multi-hop reasoning",
    question: "A geohash converts 2D coordinates to a 1D string. Why does this specifically enable the use of standard B-tree indexes for spatial queries, and what property of B-trees makes this work?",
    options: [
      "B-trees maintain sorted order and excel at prefix matching — since geohash preserves spatial locality in string prefixes, a B-tree range scan on the prefix efficiently finds all points in a spatial region",
      "B-trees can store variable-length strings, which is necessary because geohash strings vary in length based on precision",
      "B-trees use hash functions internally, so they naturally support geohash lookups without modification",
      "B-trees store data in leaf nodes only (B+ tree variant), which means all geohash strings are at the same depth for consistent lookup times"
    ],
    correct: 0,
    explanation: "The key insight is the synergy between geohash's design and B-tree's strengths. Geohash encodes spatial proximity into string prefixes — nearby points share prefixes. B-trees maintain sorted order and are optimized for prefix-based range scans. So 'find all points in this spatial region' becomes 'find all strings with this prefix' — exactly what B-trees do best. This is why geohash is so elegant: it requires no special spatial data structure, just a regular B-tree on the geohash column.",
    interviewScript: "In your interview, say: 'Geohash is elegant because it turns a 2D spatial problem into a 1D string prefix problem. Nearby locations share geohash prefixes, and B-trees are optimized for sorted prefix range scans. So a proximity query becomes a simple B-tree range scan — no specialized spatial data structure needed. This is why Redis uses geohash internally: it leverages existing sorted set infrastructure.'"
  },
  // q12 — Geospatial: Quadtree vs R-tree
  {
    id: "q12",
    subtopic: "Geospatial Indexes",
    tier: "Heavy",
    style: "Decision framework application",
    question: "You need to spatially index a mix of point locations (restaurants), polygons (delivery zones), and line segments (road networks) in PostGIS. Which spatial index type handles this best, and why do alternatives fall short?",
    options: [
      "R-tree: its flexible overlapping bounding rectangles can efficiently enclose points, polygons, and lines in a single index, whereas quadtrees subdivide until they isolate each shape (creating very deep trees for large polygons)",
      "Quadtree: its recursive spatial subdivision naturally handles any shape by subdividing until the shape fits, and it's faster than R-trees for mixed data",
      "Geohash: convert all shapes to their centroid geohash and use a B-tree, which is simpler and equally accurate",
      "Three separate indexes — geohash for points, R-tree for polygons, quadtree for lines — each optimized for its shape type"
    ],
    correct: 0,
    explanation: "R-trees use minimum bounding rectangles (MBRs) that flexibly adapt to any shape — a point's MBR is tiny, a polygon's MBR encloses it, a line's MBR is a thin rectangle. This lets a single R-tree efficiently index mixed geometry. Quadtrees struggle with large shapes because they must subdivide until the shape is isolated, creating deep trees and many redundant entries. Geohash (Option C) reduces shapes to centroids, losing all shape information — a delivery zone polygon would become a single point. This is why PostGIS defaults to GiST indexes (R-tree based).",
    interviewScript: "In your interview, say: 'R-trees are the right choice for mixed geometry. They wrap each shape in a minimum bounding rectangle, so points, polygons, and lines coexist in one index. Quadtrees would create very deep trees trying to isolate large polygons. Geohash would lose shape information by reducing everything to point representations. This is why PostGIS uses GiST indexes based on R-trees as the default.'"
  },
  // q13 — Composite: column ordering
  {
    id: "q13",
    subtopic: "Composite Indexes",
    tier: "Heavy",
    style: "Scenario-based trade-offs",
    question: "Your social media app has this query pattern running 10K times/second: SELECT id, content FROM posts WHERE user_id = ? AND created_at > ? ORDER BY created_at DESC LIMIT 20. Which composite index best serves this query?",
    options: [
      "(user_id, created_at) — the B-tree groups by user_id first, then sorts by created_at within each group, allowing a single index traversal for both filtering and ordering",
      "(created_at, user_id) — putting the range column first allows the database to skip directly to the right time range",
      "(user_id, created_at, content) — include content to make it a covering index for maximum performance",
      "(created_at DESC, user_id) — matching the ORDER BY direction avoids a reverse scan"
    ],
    correct: 0,
    explanation: "With (user_id, created_at), the B-tree first groups all entries by user_id, then sorts by created_at within each group. For our query, the database finds user_id=? (equality), then scans backward through created_at entries (range + ORDER BY) — one clean traversal. Option B puts created_at first, which means all users' posts are interleaved by time — the database can't efficiently filter to one user. Option C adds content, making the index much larger for marginal benefit (we'd need to include id too, and content can be large).",
    interviewScript: "In your interview, say: 'I'd create a composite index on (user_id, created_at). The equality predicate on user_id goes first — it narrows to one user's posts. Then created_at provides sorted order within that group, giving us both the range filter and ORDER BY for free. The database does a single index seek plus a backward scan — no sorting needed.'"
  },
  // q14 — Composite: column order trap
  {
    id: "q14",
    subtopic: "Composite Indexes",
    tier: "Heavy",
    style: "Interviewer pushback",
    question: "You proposed a composite index (status, priority, created_at) for an event processing system. Your interviewer pushes back: 'status has only 3 possible values — wouldn't putting a low-cardinality column first hurt performance?' What's the strongest response?",
    options: [
      "'Low cardinality as a leading column is fine for composite indexes — it partitions the tree into 3 clean sub-ranges. The real rule is: equality predicates first, then range predicates. Since we always filter status with equality (status = 'pending'), it's correct as the leading column.'",
      "'You're right, I should move status to the end since low-cardinality columns should always be last in composite indexes.'",
      "'The low cardinality means the index will have poor selectivity, so I should add a hash index on status instead.'",
      "'I'll replace the composite index with three separate indexes — one per status value — for better performance.'"
    ],
    correct: 0,
    explanation: "The 'most selective column first' heuristic is an oversimplification. For composite indexes, the correct rule is: equality predicates first, then range predicates. A low-cardinality column used with equality (WHERE status = 'pending') is an excellent leading column — it cleanly partitions the B-tree into sub-ranges that can then be efficiently traversed by the subsequent columns. Moving it to the end would break the prefix rule for queries that filter on status alone.",
    interviewScript: "In your interview, say: 'Low cardinality in the leading position is actually fine here. The key rule for composite index ordering is: equality columns first, range columns last. Status is always used with equality, so it cleanly partitions the tree into 3 sub-ranges. Each sub-range is then sorted by priority and created_at, enabling efficient traversal for our access pattern.'"
  },
  // q15 — Composite: prefix rule gotcha
  {
    id: "q15",
    subtopic: "Composite Indexes",
    tier: "Heavy",
    style: "Gotcha/trap question",
    question: "You have a composite index on (user_id, created_at, type). A new feature requires: SELECT * FROM events WHERE type = 'login' AND created_at > '2024-01-01'. The team expects the existing composite index to handle this efficiently. What's wrong with this assumption?",
    options: [
      "The composite index can only be used efficiently for prefixes of the column list — skipping user_id means the database can't use the index at all, or at best does a full index scan",
      "The index works fine — modern query optimizers can use any subset of columns in a composite index regardless of order",
      "The query will use the index but only for the type = 'login' filter, ignoring the created_at range entirely",
      "Composite indexes only support equality predicates, so the range query on created_at will force a table scan"
    ],
    correct: 0,
    explanation: "This is a critical gotcha: composite indexes follow the 'leftmost prefix' rule. An index on (user_id, created_at, type) can efficiently serve queries filtering on user_id, (user_id, created_at), or (user_id, created_at, type) — but NOT queries that skip user_id. Without the leading column in the WHERE clause, the B-tree can't narrow the search — it would need to scan every user_id partition. The team needs a separate index on (type, created_at) for this query.",
    interviewScript: "In your interview, say: 'Composite indexes follow the leftmost prefix rule. Our index on (user_id, created_at, type) is structured as a B-tree sorted by user_id first. Without user_id in the WHERE clause, the database can't skip to the right part of the tree — it'd have to scan the entire index. We need a new index on (type, created_at) for this query pattern.'",
    proTip: "Some databases like MySQL can do an 'index skip scan' to partially use a composite index when the leading column is skipped — but only when that column has very few distinct values. This is an optimization, not a guarantee."
  },
  // q16 — Physical Storage: page-based I/O
  {
    id: "q16",
    subtopic: "Physical Storage & Access Patterns",
    tier: "Medium",
    style: "Failure analysis",
    question: "A database stores its heap file across thousands of 8KB pages. Without any indexes, a query for a single row with a specific email must perform a sequential scan. On a table with 2 million rows across 100,000 pages, what makes this so slow even on modern SSDs?",
    options: [
      "Each page must be loaded from disk into RAM to check its contents — even on SSDs, reading 100,000 pages means ~800MB of I/O to find one row, and the data isn't sorted so no early termination is possible",
      "SSDs can only read one page at a time with no parallelism, so 100,000 sequential reads take minutes",
      "The heap file is stored in a compressed format that requires full decompression before any row can be checked",
      "Sequential scans are slow because the OS kernel must perform a context switch for each page read"
    ],
    correct: 0,
    explanation: "The fundamental issue is that a heap file stores rows in insertion order with no structure. To find one row by email, the database must read every page into memory and check each row — there's no way to skip pages or terminate early (the row could be on the last page). Even on SSDs, reading 100K pages (~800MB) is far more I/O than necessary. This is the exact problem indexes solve: they provide a structured path to the data, reducing I/O from 100K pages to 2-3 pages.",
    interviewScript: "In your interview, say: 'Without an index, the database stores data in a heap file — rows in insertion order with no structure. Finding one row means loading every page into memory since there's no way to know which page contains our target. An index provides a structured shortcut, reducing a 100K-page scan to 2-3 page reads.'"
  },
  // q17 — Physical Storage: SSD vs sequential access
  {
    id: "q17",
    subtopic: "Physical Storage & Access Patterns",
    tier: "Medium",
    style: "Implementation-specific nuance",
    question: "An engineer claims 'since we're on SSDs, random access is just as fast as sequential access, so the choice between B-trees and LSM trees doesn't matter.' Why is this claim misleading?",
    options: [
      "While SSDs greatly narrow the random vs. sequential gap compared to HDDs, random access is still significantly slower — SSDs still benefit from sequential I/O patterns due to internal page alignment, read-ahead, and reduced command overhead",
      "SSDs don't support random access at all — they always read sequentially from the NAND chips",
      "The claim is correct for SSDs — the B-tree vs LSM choice is only relevant for HDD-based systems",
      "SSDs are faster for random access than sequential access because they can parallelize random reads across NAND channels"
    ],
    correct: 0,
    explanation: "This is a common misconception. While SSDs dramatically reduced the random/sequential performance gap compared to HDDs, sequential access is still faster. SSDs read in pages (4-16KB), have internal parallelism that favors sequential patterns, benefit from OS read-ahead, and have lower per-command overhead for sequential reads. Benchmarks typically show 2-5x advantage for sequential over random on NVMe SSDs. This means the B-tree vs LSM trade-off (random updates vs. sequential writes) is less dramatic on SSDs but still real.",
    interviewScript: "In your interview, say: 'SSDs narrow the gap but don't eliminate it. Sequential I/O is still 2-5x faster than random on modern NVMe drives due to page alignment, read-ahead, and lower command overhead. So the fundamental trade-off between B-trees (random in-place updates) and LSM trees (sequential writes) still holds — it's just less extreme than on spinning disks.'"
  },
  // q18 — Index Cost: anti-pattern
  {
    id: "q18",
    subtopic: "Index Cost & Trade-offs",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "A team discovers that their PostgreSQL database has 12 indexes on a table with only 500 rows. The table is queried frequently. A junior engineer suggests removing all but the primary key index 'since the table is small enough for sequential scans.' Is this reasoning sound?",
    options: [
      "The reasoning is partially correct — for very small tables (hundreds of rows), the overhead of traversing an index structure can exceed the cost of a sequential scan, and maintaining 12 indexes adds write overhead for minimal read benefit",
      "No — even for small tables, indexes always improve query performance by avoiding full table scans",
      "Yes, but only if the table uses B-tree indexes; hash indexes have no overhead on small tables",
      "No — the number of indexes doesn't matter because PostgreSQL only activates indexes when the table exceeds 10,000 rows"
    ],
    correct: 0,
    explanation: "For very small tables, the query planner may actually choose a sequential scan over an index lookup because the entire table fits in a few disk pages — traversing the B-tree structure (root → internal → leaf → heap) can require more page reads than just scanning all rows directly. Having 12 indexes on a 500-row table also means every write triggers 12 index updates. However, 'remove all indexes' is too aggressive — the primary key index is essential, and any foreign key columns should remain indexed. The answer is to profile and remove unused indexes.",
    interviewScript: "In your interview, say: 'The engineer's instinct is partially right. For a 500-row table that fits in a few disk pages, the query planner may prefer sequential scans anyway — the overhead of B-tree traversal can exceed the cost of scanning a tiny table. But I'd profile before dropping indexes. Keep the primary key and any foreign key indexes, and use pg_stat_user_indexes to identify which of the 12 indexes are actually being used.'"
  },
  // q19 — Index Cost: gotcha on write amplification
  {
    id: "q19",
    subtopic: "Index Cost & Trade-offs",
    tier: "Medium",
    style: "Gotcha/trap question",
    question: "Your e-commerce platform has a products table with 5 B-tree indexes. You run UPDATE products SET view_count = view_count + 1 WHERE id = 123 for every product page view — about 50K times/second. Strangely, even though you're only updating view_count and none of the 5 indexes include view_count, writes are still slow. What's the hidden issue?",
    options: [
      "In PostgreSQL's MVCC, every UPDATE creates a new row version — and ALL indexes must be updated to point to the new physical row location, even if the indexed columns haven't changed (unless HOT updates apply)",
      "The 5 indexes are fragmenting the disk, causing slow writes due to poor sequential access patterns",
      "PostgreSQL locks all indexes during any write to maintain consistency, creating contention at 50K writes/second",
      "The view_count column is automatically added to all indexes by PostgreSQL for statistics tracking"
    ],
    correct: 0,
    explanation: "This is a PostgreSQL-specific gotcha related to MVCC. When you UPDATE a row, PostgreSQL doesn't modify the existing row — it creates a new row version at a new physical location. All indexes must be updated to point to this new location, even if the indexed columns haven't changed. The exception is HOT (Heap-Only Tuple) updates, which avoid index updates when the new row version fits on the same page and no indexed columns changed. At 50K updates/second, this write amplification from 5 indexes is significant. Consider using a separate counter table or HOT-friendly table fillfactor.",
    interviewScript: "In your interview, say: 'In PostgreSQL, every UPDATE creates a new row version due to MVCC. Even if indexed columns don't change, all indexes need new entries pointing to the new row location. With 5 indexes and 50K updates/second, that's 250K index writes per second just for view count bumps. I'd consider HOT update optimization by setting a lower fillfactor, or moving the counter to a separate table with minimal indexes.'"
  },
  // q20 — Inverted Index: LIKE pattern failure
  {
    id: "q20",
    subtopic: "Inverted Indexes",
    tier: "Medium",
    style: "Failure analysis",
    question: "A developer has a B-tree index on posts.content and runs: SELECT * FROM posts WHERE content LIKE '%database%'. The query is extremely slow despite the index. They try adding more B-tree indexes and increasing shared_buffers, but nothing helps. Why?",
    options: [
      "B-tree indexes only support prefix matching (LIKE 'database%'), not infix matching (LIKE '%database%') — the leading wildcard prevents the database from using the B-tree's sorted order, forcing a full sequential scan regardless of index presence",
      "The LIKE operator is inherently slow regardless of indexing strategy — the database must always scan all rows for pattern matching",
      "B-tree indexes work with LIKE but only for exact matches — the wildcards in the pattern prevent any index usage",
      "The content column is too long — B-tree indexes can only index the first 256 characters of a text column"
    ],
    correct: 0,
    explanation: "B-tree indexes maintain sorted order, which enables prefix matching: 'database%' can binary-search to the start of entries beginning with 'database'. But '%database%' could match ANYWHERE in the text — 'mydatabaseapp', 'the database is slow', etc. The leading wildcard means the B-tree's sort order is useless. The solution is an inverted index (via full-text search) or a trigram index (pg_trgm in PostgreSQL). These index the content by its constituent tokens/trigrams, enabling efficient substring matching.",
    interviewScript: "In your interview, say: 'The leading wildcard in LIKE '%database%' prevents B-tree usage because the match can occur anywhere in the string — the B-tree's sorted order can't help. For text search, we need an inverted index that maps words to documents. In PostgreSQL, I'd use full-text search with a GIN index, or pg_trgm for substring matching. For more complex search needs, I'd consider Elasticsearch.'"
  },
  // q21 — Inverted Index: analysis pipeline
  {
    id: "q21",
    subtopic: "Inverted Indexes",
    tier: "Medium",
    style: "Implementation-specific nuance",
    question: "A user searches for 'Databases' (capitalized, plural) on your Elasticsearch-powered search. Despite having documents containing 'database', 'DATABASE', and 'database's', the search returns all of them successfully. Which inverted index feature enables this?",
    options: [
      "The analysis pipeline: during indexing, text is tokenized, lowercased, and stemmed (reducing 'databases' to 'database') — the search query undergoes the same analysis, so 'Databases' → 'database' matches all variants in the inverted index",
      "Elasticsearch's fuzzy matching algorithm compares character-by-character with a tolerance of 2 edits, matching any near-miss",
      "The inverted index stores every possible case variant of each term, creating separate entries for 'Database', 'database', 'DATABASE', etc.",
      "Elasticsearch uses a hash of each word that's case-insensitive by default, so all variants hash to the same bucket"
    ],
    correct: 0,
    explanation: "Inverted indexes in systems like Elasticsearch use an analysis pipeline during both indexing and querying. During indexing, text is tokenized (split into words), lowercased, stemmed (removing suffixes to get root forms), and stop words are removed. The same pipeline processes the search query. So 'Databases' → lowercase → 'databases' → stem → 'database', which matches the indexed term 'database'. This is fundamentally different from fuzzy matching (Option B) — it's deterministic linguistic processing, not approximate string comparison.",
    interviewScript: "In your interview, say: 'Inverted indexes use an analysis pipeline during both indexing and querying. Text is tokenized, lowercased, and stemmed — so 'Databases' becomes 'database' at both index time and query time. This is why full-text search feels natural: it understands that 'running', 'runs', and 'ran' all relate to 'run'. It's deterministic linguistic processing, not fuzzy matching.'"
  },
  // q22 — Covering Index: mechanics
  {
    id: "q22",
    subtopic: "Covering Indexes",
    tier: "Medium",
    style: "Scenario-based trade-offs",
    question: "A leaderboard query runs 5K times/second: SELECT user_id, score FROM leaderboard WHERE game_id = ? ORDER BY score DESC LIMIT 100. The table has 50 million rows. You have an index on (game_id, score). Query performance is good but the DBA says heap lookups are the bottleneck. What's the most targeted fix?",
    options: [
      "Create a covering index: CREATE INDEX idx ON leaderboard(game_id, score DESC) INCLUDE (user_id) — this eliminates heap lookups by storing user_id in the index leaf pages, so the query can be served entirely from the index",
      "Add a separate B-tree index on user_id to speed up the user_id retrieval after the primary index scan",
      "Increase shared_buffers to cache the entire heap in memory, eliminating disk-based heap lookups",
      "Switch to a hash index on (game_id, score, user_id) for O(1) lookups instead of B-tree traversal"
    ],
    correct: 0,
    explanation: "The existing index on (game_id, score) efficiently finds and orders the right rows, but the query also needs user_id. Since user_id isn't in the index, the database must do a heap lookup for each of the 100 rows to fetch it — that's 100 random I/O operations per query at 5K QPS. The INCLUDE clause adds user_id to the index leaf pages without affecting the tree's sort order. Now the query is fully covered: filter, sort, and all selected columns come from the index alone. This is the textbook use case for covering indexes.",
    interviewScript: "In your interview, say: 'The bottleneck is heap lookups — the index finds the right 100 rows but must go to the main table to get user_id. I'd add INCLUDE (user_id) to make it a covering index. This stores user_id in the index leaf pages, so the query is served entirely from the index — zero heap lookups. For a leaderboard query running 5K/second, eliminating 100 random reads per query is a massive win.'"
  },
  // q23 — Covering Index: trade-off awareness
  {
    id: "q23",
    subtopic: "Covering Indexes",
    tier: "Medium",
    style: "Interviewer pushback",
    question: "You propose a covering index that INCLUDEs 5 columns to eliminate heap lookups. Your interviewer pushes back: 'That index is going to be massive. Is this really worth it?' What's the most balanced response?",
    options: [
      "'It depends on the query frequency and the included columns' sizes. For a high-QPS query on a read-heavy table where the included columns are small (integers, timestamps), the performance gain justifies the storage cost. But if the included columns are large (TEXT, BLOB) or the query runs rarely, the overhead isn't justified.'",
      "'Covering indexes are always worth it because eliminating heap lookups is the most impactful optimization possible.'",
      "'You're right — I should never include more than 2 columns. I'll split this into multiple smaller covering indexes.'",
      "'The storage cost is negligible on modern systems with terabytes of disk space, so size shouldn't be a concern.'"
    ],
    correct: 0,
    explanation: "The key is nuance: covering indexes trade storage and write overhead for read performance. The calculation depends on query frequency (high QPS = more benefit), column sizes (INCLUDEing a TEXT column is very different from an INT), read vs. write ratio (every write must update the larger index), and whether the query planner actually uses index-only scans. Modern database optimizers are quite good at executing queries efficiently with regular indexes, so covering indexes are a targeted optimization, not a default strategy.",
    interviewScript: "In your interview, say: 'It's a trade-off calculation. I'd consider: how often does this query run, how large are the included columns, and what's our write ratio? For a 5K QPS leaderboard with small integer columns, the storage cost is justified. But for a 10 QPS analytics query with large TEXT columns, I'd skip the covering index and let the heap lookups happen — the optimizer handles it well enough.'"
  },
  // q24 — Hash Index: use case
  {
    id: "q24",
    subtopic: "Hash Indexes",
    tier: "Medium",
    style: "Decision framework application",
    question: "An engineer proposes using PostgreSQL hash indexes for a session lookup table where the only access pattern is exact-match by session_token. The table has 10 million rows and is queried 20K times/second. Is this a good use of hash indexes?",
    options: [
      "Technically sound but practically unwise — B-trees handle exact matches nearly as fast, and hash indexes in PostgreSQL historically had limitations (no WAL logging pre-10, no replication support). The marginal speed gain doesn't justify the risk and loss of flexibility.",
      "Perfect use case — hash indexes are 10x faster than B-trees for exact matches, and this is exactly the O(1) lookup scenario they're designed for",
      "Bad choice — hash indexes can't handle 10 million rows due to memory limitations",
      "Good choice, but only if the session_token is an integer; hash indexes don't support string hashing"
    ],
    correct: 0,
    explanation: "This is a textbook scenario where hash indexes seem ideal — exact-match only, high throughput. But in practice, PostgreSQL's B-trees handle exact matches 'almost as efficiently' (from PostgreSQL docs). Hash indexes in PostgreSQL historically had serious limitations: they weren't WAL-logged until version 10, couldn't be replicated, and aren't crash-safe in older versions. Even in modern PostgreSQL, the marginal performance gain is rarely worth losing B-tree features like range query support if access patterns evolve.",
    interviewScript: "In your interview, say: 'While this looks like the perfect hash index use case, I'd still use a B-tree. PostgreSQL's B-trees handle equality lookups almost as efficiently as hash indexes, and they give me flexibility if we ever need range queries on session tokens or sorting. Hash indexes are a niche optimization that rarely justifies the trade-offs in practice.'"
  },
  // q25 — Hash Index: anti-pattern
  {
    id: "q25",
    subtopic: "Hash Indexes",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "A candidate designs an analytics dashboard that queries user events by date range (WHERE timestamp BETWEEN ? AND ?) and proposes hash indexes on the timestamp column 'for faster lookups.' What's the critical flaw?",
    options: [
      "Hash indexes scatter values across buckets by hash — they completely destroy the ordering needed for range queries. A timestamp range query can't use a hash index at all, since chronologically adjacent timestamps map to unrelated buckets.",
      "Hash indexes work for range queries but are slower than B-trees, so the candidate should use B-trees for performance reasons only",
      "Hash indexes on timestamp columns cause excessive collisions because many events share the same second",
      "The timestamp data type isn't supported by hash indexes in most databases"
    ],
    correct: 0,
    explanation: "This is a fundamental misunderstanding of hash indexes. By design, hash functions deliberately scatter similar values to different buckets — this is what makes them fast for exact matches. But this same property makes them useless for range queries: timestamps '2024-01-01' and '2024-01-02' map to completely unrelated buckets, so there's no way to scan a range without checking every bucket. B-tree indexes maintain sorted order, making them perfect for range queries.",
    interviewScript: "In your interview, say: 'Hash indexes are fundamentally incompatible with range queries. Hash functions deliberately scatter similar values to unrelated buckets — great for O(1) exact matches, but it means there's no way to scan a range. Adjacent timestamps end up in random buckets. For range queries like BETWEEN on timestamps, B-tree indexes are the only choice because they maintain sorted order.'"
  },
  // q26 — R-tree specifics
  {
    id: "q26",
    subtopic: "R-tree Specifics",
    tier: "Thin",
    style: "Failure analysis",
    question: "An R-tree spatial index search for 'restaurants near point P' sometimes traverses multiple branches of the tree even when the answer is in a single leaf node. What property of R-trees causes this overhead, and why is it still preferable to the alternative?",
    options: [
      "R-trees allow overlapping bounding rectangles between sibling nodes — the search point may fall in the overlap of two rectangles, forcing both branches to be checked. This is preferable to non-overlapping partitions (like quadtrees) because flexible overlaps lead to shallower trees with better disk I/O patterns.",
      "R-trees use probabilistic search that randomly samples branches, occasionally checking more than necessary to ensure correctness",
      "R-tree nodes have a maximum capacity, so overflow entries are stored in sibling nodes that must be checked during search",
      "R-trees don't actually have this problem — each point maps to exactly one branch, just like a B-tree"
    ],
    correct: 0,
    explanation: "R-trees explicitly allow sibling nodes' bounding rectangles to overlap. When a query point falls in an overlap region, the tree must descend into both branches to find all matching entries. This seems wasteful, but the alternative — enforcing non-overlapping partitions like quadtrees — forces rigid spatial divisions that lead to deeper trees and worse disk I/O. R-trees' smart algorithms balance overlap against tree depth, resulting in fewer overall page reads despite occasional multi-branch traversal.",
    interviewScript: "In your interview, say: 'R-trees use overlapping bounding rectangles, so a query point in an overlap region requires checking multiple branches. This is a deliberate trade-off: overlapping regions allow more flexible, data-adaptive grouping, which keeps the tree shallow and minimizes disk I/O. Rigid non-overlapping partitions like quadtrees avoid the overlap but create deeper trees that read more pages overall.'"
  },
  // q27 — Quadtree adaptive resolution
  {
    id: "q27",
    subtopic: "Quadtree Adaptive Resolution",
    tier: "Thin",
    style: "Implementation-specific nuance",
    question: "A quadtree indexes restaurant locations in a city. Downtown Manhattan (dense) subdivides to depth 12, while rural areas subdivide to depth 3. What practical problem does this extreme depth variance cause for disk-based storage?",
    options: [
      "Deep quadrant chains in dense areas mean more pointer-following and random disk reads to reach leaf nodes — unlike B-trees which are designed for uniform, shallow depth, quadtrees can have highly uneven path lengths that degrade disk I/O performance",
      "The depth-12 quadrants are so small that GPS precision errors cause points to fall in wrong cells",
      "Quadtrees with depth > 8 exceed the maximum addressable space in 64-bit pointers",
      "Dense areas with many subdivisions cause the quadtree to become unbalanced, violating the tree invariant"
    ],
    correct: 0,
    explanation: "Quadtrees don't guarantee uniform depth — they subdivide based on data density. In Manhattan with thousands of restaurants per block, the tree might be 12 levels deep, requiring 12 disk page reads to reach a leaf. In rural areas, it's only 3 reads. This inconsistency is problematic for disk-based storage where each level typically requires a separate page read. This is one reason R-trees (which maintain balanced depth like B-trees) are preferred in production databases, and quadtrees are more common in in-memory applications like game engines.",
    interviewScript: "In your interview, say: 'Quadtrees have variable depth based on data density, which hurts disk I/O in dense areas — 12 levels means 12 page reads. R-trees maintain balanced depth like B-trees, giving consistent I/O cost. This is why quadtrees are better suited for in-memory use cases, while R-trees dominate in disk-based databases like PostGIS.'"
  },
  // q28 — Cluster: SSD access + heap file
  {
    id: "q28",
    subtopic: "SSD Access + Heap Storage",
    tier: "Thin (Clustered)",
    style: "Multi-hop reasoning",
    question: "A table's heap file stores rows in insertion order across 8KB pages. Even with an index, queries that return many rows scattered across different pages are slow on SSDs. What's the root cause and what storage optimization addresses it?",
    options: [
      "The heap file doesn't cluster related rows together — rows matching a query are scattered across random pages, causing many random I/O operations. A clustered index (or PostgreSQL's CLUSTER command) physically reorders the heap to match the index order, converting random reads to sequential reads.",
      "SSDs can only serve one read request at a time, so scattered rows create a serialization bottleneck",
      "The 8KB page size is too small for SSDs, which have an internal block size of 128KB — each read wastes 120KB",
      "Heap files don't support parallel reads, so all page fetches must happen sequentially regardless of their physical location"
    ],
    correct: 0,
    explanation: "The heap file stores rows in insertion order, not query order. When an index scan finds 1,000 matching rows scattered across 800 different pages, the database must perform 800 random reads. A clustered index physically reorders the heap to match the index, so those 1,000 rows are stored on consecutive pages — turning 800 random reads into ~8 sequential reads. Note that CLUSTER in PostgreSQL is a one-time operation (not maintained automatically), so it's most useful for mostly-static tables.",
    interviewScript: "In your interview, say: 'Heap files store rows in insertion order, not query order. When an index finds matching rows scattered across many pages, each row requires a random page read. PostgreSQL's CLUSTER command physically reorders the heap to match an index, converting scattered reads to sequential ones. But it's a one-time operation — new inserts go back to arbitrary locations. For frequently queried ranges, this can dramatically reduce I/O.'"
  },
  // q29 — Cluster: WAL + memtable crash recovery
  {
    id: "q29",
    subtopic: "WAL Durability + Crash Recovery",
    tier: "Thin (Clustered)",
    style: "Critical failure modes",
    question: "An LSM tree system crashes after writing to the WAL but before the memtable flush to SSTable completes. The memtable had 50MB of data. What happens during recovery, and what would happen if the system had no WAL?",
    options: [
      "With WAL: the system replays the WAL to reconstruct the memtable contents, recovering all acknowledged writes. Without WAL: all 50MB of memtable data is permanently lost since memtables are purely in-memory structures.",
      "With WAL: the system recovers only the data that was partially flushed to the SSTable. Without WAL: the last SSTable checkpoint serves as the recovery point.",
      "With WAL: recovery takes hours because the WAL must be replayed sequentially. Without WAL: the system recovers faster from the SSTables alone.",
      "With WAL: the system discards the incomplete SSTable and replays from the last successful compaction. Without WAL: the same recovery occurs from SSTables."
    ],
    correct: 0,
    explanation: "The WAL is the durability guarantee for LSM trees. Every write is appended to the WAL BEFORE being acknowledged to the client. The memtable is an in-memory structure that's lost on crash. During recovery, the system replays the WAL from the last checkpoint to reconstruct the memtable state. Without a WAL, any data in the memtable at crash time is permanently lost — this could be seconds to minutes of writes. This is why the WAL append must happen before the write is acknowledged.",
    interviewScript: "In your interview, say: 'The WAL is the durability lifeline for LSM trees. The memtable is purely in-memory — if the system crashes, it's gone. The WAL captures every write sequentially on disk before acknowledging to the client. On recovery, we replay the WAL to reconstruct the lost memtable. Without it, all in-flight data — potentially millions of writes — would be lost. This is why WAL-first is non-negotiable.'"
  },
  // q30 — Cluster: Bloom filter + sparse index gotcha
  {
    id: "q30",
    subtopic: "Bloom Filters + Sparse Indexes",
    tier: "Thin (Clustered)",
    style: "Gotcha/trap question",
    question: "Your LSM-based database uses bloom filters on each SSTable. A developer observes that bloom filters correctly skip 95% of SSTables for point queries, but a specific key lookup is still slow. The bloom filter says 'maybe present' for 4 SSTables. What subtle property of bloom filters explains this, and what additional optimization helps?",
    options: [
      "Bloom filters have a false positive rate — 'maybe present' means the key might NOT actually be in those SSTables. All 4 must be checked, and the key may only exist in one (or even none, if deleted). Sparse indexes within each SSTable help by checking the key range per block, skipping blocks that can't contain the key.",
      "Bloom filters become less accurate over time as the hash functions degrade, so older SSTables have higher false positive rates requiring full scans",
      "The key is present in all 4 SSTables due to duplicate writes, and the database must read all 4 to find the latest version",
      "Bloom filters only work for string keys — the developer is likely using integer keys, which bypass the bloom filter entirely"
    ],
    correct: 0,
    explanation: "Bloom filters are probabilistic: they can tell you 'definitely not present' or 'maybe present' — never 'definitely present.' With a typical 1% false positive rate and 100 SSTables, ~1 SSTable will give a false positive per query. But with 4 'maybe present' results, all 4 must be checked. Sparse indexes help by maintaining the min/max key range per data block within each SSTable — so even if the bloom filter says 'maybe,' the sparse index can skip blocks whose range doesn't include our key. This combination — bloom filter to skip SSTables, sparse index to skip blocks within SSTables — is what makes LSM reads tolerable.",
    interviewScript: "In your interview, say: 'Bloom filters are probabilistic — they can say definitely-not but only maybe-yes. A 1% false positive rate means roughly 1 in 100 SSTables gives a false positive per query. For the SSTables that pass the bloom filter, sparse indexes check key ranges per block to skip irrelevant data. This two-layer filtering — bloom filters across SSTables, sparse indexes within SSTables — is essential for LSM read performance.'",
    proTip: "You can tune the bloom filter's false positive rate by adjusting bits per key. 10 bits per key gives ~1% FP rate, while 15 bits gives ~0.1% — but at the cost of more memory per SSTable."
  },
  // q31 — Bridge: B-Tree × LSM Tree
  {
    id: "q31",
    subtopic: "B-Tree × LSM Tree",
    tier: "Bridge",
    style: "Decision framework application",
    question: "You're choosing the storage engine for a new service that handles 80% writes (user activity events) and 20% reads (activity feed queries that filter by user_id and time range). The write volume is 200K events/second. Which storage engine and why?",
    options: [
      "LSM tree (e.g., Cassandra/RocksDB): the 80/20 write-heavy ratio at 200K/sec favors LSM's sequential write optimization. The read queries can be served by primary key (user_id) lookups in the LSM structure, and time-range filtering works within sorted SSTables.",
      "B-tree (e.g., PostgreSQL): B-trees handle mixed workloads well, and 200K writes/second is within B-tree capability on modern hardware",
      "Hash-based storage: since most reads are by user_id, an O(1) hash lookup is faster than either B-tree or LSM",
      "LSM tree for writes with a separate B-tree read replica: the two engines complement each other for the mixed workload"
    ],
    correct: 0,
    explanation: "At 200K writes/second with 80% writes, the workload heavily favors LSM trees. B-trees require random I/O for each write (find leaf, read-modify-write), while LSM trees buffer in memory and flush sequentially. The 20% reads are filtered by user_id (the primary key in Cassandra) and time range (sort key), which LSM handles via sorted SSTables. Option B underestimates the I/O pressure of 200K random writes/second. Option D adds unnecessary complexity — a well-tuned LSM engine handles both.",
    interviewScript: "In your interview, say: 'With 200K writes/second and 80% write ratio, I'd choose an LSM-based engine like Cassandra. LSM trees convert random writes to sequential I/O — critical at this throughput. The 20% reads filter by user_id (partition key) and time range (sort key), which maps perfectly to LSM's sorted-by-primary-key structure. B-trees would struggle with the write I/O at this volume.'"
  },
  // q32 — Bridge: B-Tree × LSM (read-heavy pivot)
  {
    id: "q32",
    subtopic: "B-Tree × LSM Tree",
    tier: "Bridge",
    style: "Interviewer pushback",
    question: "You chose Cassandra (LSM-based) for the activity service. Six months later, the product team adds a feature requiring complex multi-column queries with JOINs across activity and user tables, running 50K times/second. Your interviewer asks: 'Does your storage choice still hold?' What's the strongest response?",
    options: [
      "'No — LSM trees and Cassandra aren't designed for complex JOINs and ad-hoc multi-column queries. I'd introduce a read-optimized store like PostgreSQL (B-tree based) as a materialized view layer, fed by CDC from Cassandra. The LSM store handles ingestion, the B-tree store handles complex reads.'",
      "'Yes — Cassandra can handle JOINs by creating secondary indexes on all queried columns'",
      "'I'd switch entirely from Cassandra to PostgreSQL since the workload has fundamentally changed'",
      "'I'd add a covering index in Cassandra that includes all columns needed for the JOINs'"
    ],
    correct: 0,
    explanation: "This tests adaptability. Cassandra explicitly doesn't support JOINs — it's designed for denormalized single-partition queries. The original LSM choice was correct for write-heavy ingestion, but the new read pattern needs a relational engine. The best architecture uses both: Cassandra for ingestion, CDC (Change Data Capture) to replicate to PostgreSQL for complex queries. Option C throws away the write-optimized ingestion layer. Option B is factually wrong — Cassandra secondary indexes are limited and don't support JOINs.",
    interviewScript: "In your interview, say: 'The original LSM choice was right for ingestion, but complex JOINs need a relational engine. I'd add PostgreSQL as a read layer, fed by CDC from Cassandra. This gives us the best of both worlds: LSM for high-throughput writes, B-tree-based relational queries for complex reads. This is a common pattern — Cassandra for ingestion, PostgreSQL or Elasticsearch for querying.'"
  },
  // q33 — Bridge: Geospatial × B-Tree
  {
    id: "q33",
    subtopic: "Geospatial × B-Tree",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your restaurant finder uses Redis GEOSEARCH for proximity queries. Under the hood, Redis stores geohash values in a sorted set. An engineer asks: 'How does Redis efficiently find nearby restaurants if it's just using a sorted set?' What's the connection?",
    options: [
      "Redis's sorted sets use skip lists (similar properties to B-trees for range scans). Geohash encodes spatial proximity into string ordering, so nearby points have similar geohash values. A sorted set range scan on geohash prefixes efficiently returns spatially close points — the 2D spatial query becomes a 1D range scan.",
      "Redis uses a special spatial data structure inside sorted sets that's different from the normal skip list implementation",
      "Redis pre-computes all pairwise distances between points and stores them in the sorted set, so GEOSEARCH is just a lookup",
      "Redis's sorted set uses hash indexes internally, which is why geohash-based lookups are O(1)"
    ],
    correct: 0,
    explanation: "This bridges two key concepts: geohash's dimension reduction and B-tree-like range scan efficiency. Geohash converts 2D coordinates into 1D strings where spatial proximity = string proximity. Redis's sorted sets (backed by skip lists with similar range-scan properties to B-trees) can then efficiently range-scan over geohash values. GEOSEARCH calculates the geohash range covering the search radius, scans that range in the sorted set, then filters by actual distance. No special spatial data structure needed.",
    interviewScript: "In your interview, say: 'Redis leverages geohash's key insight: it encodes 2D spatial proximity into 1D string ordering. Redis's sorted set efficiently range-scans these geohash values using its skip list structure. For a proximity query, Redis calculates which geohash ranges cover the search area, scans those ranges in the sorted set, then filters by actual distance. It turns a 2D spatial problem into a 1D range scan — exactly what sorted structures are optimized for.'"
  },
  // q34 — Bridge: Composite × Covering
  {
    id: "q34",
    subtopic: "Composite × Covering",
    tier: "Bridge",
    style: "Scenario-based trade-offs",
    question: "Your API endpoint returns: SELECT user_id, username, last_active FROM sessions WHERE app_id = ? AND session_start > ? ORDER BY session_start DESC LIMIT 50. The sessions table has 200M rows. You've created a composite index on (app_id, session_start). Query EXPLAIN shows the index is used for filtering and sorting, but 'Heap Fetches: 50' appears in the plan. How do you eliminate those heap fetches without creating an excessively large index?",
    options: [
      "Add INCLUDE (user_id, username, last_active) to the composite index — this stores the extra columns in leaf pages without affecting the tree's sort structure, eliminating heap fetches while keeping the index navigational structure lean",
      "Add user_id, username, and last_active to the composite index key: (app_id, session_start, user_id, username, last_active) — this makes it a covering index",
      "Create a separate index on (user_id, username, last_active) and let the database intersect the two indexes",
      "Use a materialized view that pre-joins the session data with the needed columns"
    ],
    correct: 0,
    explanation: "The INCLUDE clause is specifically designed for this: it adds columns to the index leaf pages for coverage without making them part of the sort key. Option B would work functionally but adds user_id, username, and last_active to every internal node of the B-tree (not just leaves), bloating the tree structure and reducing the branching factor — making navigational efficiency worse. INCLUDE keeps the tree lean while adding coverage data only at the leaf level.",
    interviewScript: "In your interview, say: 'I'd use INCLUDE to add the three columns to the index leaf pages. Unlike adding them to the sort key, INCLUDE keeps the navigational B-tree structure lean — user_id, username, and last_active only exist at the leaf level. This eliminates all 50 heap fetches per query without bloating the internal nodes, preserving the branching factor and tree depth.'"
  },
  // q35 — Bridge: Inverted × B-Tree
  {
    id: "q35",
    subtopic: "Inverted Index × B-Tree",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your e-commerce search needs to support both text search ('wireless bluetooth headphones') and filtering/sorting (WHERE price < 100 ORDER BY rating DESC). You're choosing between putting everything in Elasticsearch versus using PostgreSQL with appropriate indexes. What's the key architectural trade-off?",
    options: [
      "Elasticsearch excels at text search via inverted indexes but struggles with real-time updates and strong consistency for price/inventory changes. PostgreSQL handles structured queries (B-tree for price range, sorting by rating) with strong consistency but requires pg_trgm or full-text search extensions for text matching. The best approach often combines both.",
      "Elasticsearch is strictly superior for both text and structured queries — its inverted index handles numeric ranges just as well as text",
      "PostgreSQL's B-tree indexes can handle text search just as well as Elasticsearch if you create enough indexes on text columns",
      "The trade-off is purely cost — Elasticsearch is more expensive to run but handles both use cases identically to PostgreSQL"
    ],
    correct: 0,
    explanation: "This bridges inverted indexes and B-trees. Elasticsearch's inverted indexes are purpose-built for text search with analysis pipelines, relevance scoring, and fuzzy matching. But it uses eventual consistency and can lag on real-time updates. PostgreSQL's B-trees handle structured queries (price ranges, sorting, JOINs) with ACID guarantees. Many production systems use both: Elasticsearch for text search, PostgreSQL as the source of truth for structured data. Updates flow from PostgreSQL to Elasticsearch via CDC or a sync pipeline.",
    interviewScript: "In your interview, say: 'I'd use both. Elasticsearch for text search — its inverted indexes with analysis pipelines, relevance scoring, and fuzzy matching are purpose-built for 'wireless bluetooth headphones' queries. PostgreSQL for structured data — B-tree indexes on price and rating give us efficient range queries and sorting with strong consistency. Updates flow from PostgreSQL to Elasticsearch via CDC, keeping search fresh while maintaining a consistent source of truth.'"
  }
];

const SUBTOPIC_TIERS = {
  Heavy: [
    { name: "B-Tree Indexes", count: 4 },
    { name: "LSM Trees", count: 4 },
    { name: "Geospatial Indexes", count: 4 },
    { name: "Composite Indexes", count: 3 }
  ],
  Medium: [
    { name: "Physical Storage & Access Patterns", count: 2 },
    { name: "Index Cost & Trade-offs", count: 2 },
    { name: "Inverted Indexes", count: 2 },
    { name: "Covering Indexes", count: 2 },
    { name: "Hash Indexes", count: 2 }
  ],
  Thin: [
    { name: "R-tree Specifics", count: 1 },
    { name: "Quadtree Adaptive Resolution", count: 1 },
    { name: "SSD Access + Heap Storage", count: 1 },
    { name: "WAL Durability + Crash Recovery", count: 1 },
    { name: "Bloom Filters + Sparse Indexes", count: 1 }
  ],
  Bridge: [
    { name: "B-Tree × LSM Tree", count: 2 },
    { name: "Geospatial × B-Tree", count: 1 },
    { name: "Composite × Covering", count: 1 },
    { name: "Inverted Index × B-Tree", count: 1 }
  ]
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5">
      <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Timer({ seconds, maxSeconds }) {
  const pct = (seconds / maxSeconds) * 100;
  const color = seconds <= 15 ? "text-red-400" : seconds <= 30 ? "text-amber-400" : "text-green-400";
  const bgColor = seconds <= 15 ? "bg-red-500" : seconds <= 30 ? "bg-amber-500" : "bg-blue-500";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="flex items-center gap-3">
      <Clock className={`w-5 h-5 ${color}`} />
      <span className={`font-mono text-lg font-bold ${color}`}>{mins}:{secs.toString().padStart(2, "0")}</span>
      <div className="w-24 bg-gray-800 rounded-full h-1.5">
        <div className={`${bgColor} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LandingScreen({ onStart }) {
  const [mode, setMode] = useState("shuffled");
  const totalTime = Math.round((QUESTIONS.length * 75) / 60);
  const [expandedTier, setExpandedTier] = useState(null);

  const tierColors = { Heavy: "text-red-400", Medium: "text-amber-400", Thin: "text-blue-400", Bridge: "text-purple-400" };
  const tierBg = { Heavy: "bg-red-400/10 border-red-400/30", Medium: "bg-amber-400/10 border-amber-400/30", Thin: "bg-blue-400/10 border-blue-400/30", Bridge: "bg-purple-400/10 border-purple-400/30" };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold mb-4 border border-red-500/30">
            <AlertTriangle className="w-4 h-4" /> FAANG SDE2 — Hard
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Database Indexing</h1>
          <p className="text-gray-400 text-lg mb-1">System Design Deep Dive Quiz</p>
          <p className="text-gray-500 text-sm">{QUESTIONS.length} questions · ~{totalTime} minutes</p>
          <p className="text-gray-500 text-sm mt-2">B-trees, LSM trees, geospatial indexes, inverted indexes, and optimization patterns — tested through real interview scenarios.</p>
        </div>

        <div className="mb-6 space-y-2">
          {Object.entries(SUBTOPIC_TIERS).map(([tier, topics]) => (
            <div key={tier} className={`border rounded-lg ${tierBg[tier]}`}>
              <button
                onClick={() => setExpandedTier(expandedTier === tier ? null : tier)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${tierColors[tier]}`}>{tier}</span>
                  <span className="text-gray-500 text-xs">({topics.reduce((s, t) => s + t.count, 0)} questions)</span>
                </div>
                {expandedTier === tier ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {expandedTier === tier && (
                <div className="px-3 pb-3 space-y-1">
                  {topics.map(t => (
                    <div key={t.name} className="flex justify-between text-sm">
                      <span className="text-gray-300">{t.name}</span>
                      <span className="text-gray-500">{t.count}q</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("section")}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${mode === "section" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Section Order
          </button>
          <button
            onClick={() => setMode("shuffled")}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${mode === "shuffled" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Shuffled
          </button>
        </div>

        <button
          onClick={() => onStart(mode)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({ question, index, total, onAnswer, onSkip, onFlag, isFlagged, timeLeft, maxTime }) {
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
      if (keyMap[e.key.toLowerCase()] !== undefined) setSelected(keyMap[e.key.toLowerCase()]);
      if (e.key === "Enter" && selected !== null && confidence !== null) {
        setSubmitted(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, selected, confidence, onAnswer, timedOut]);

  const labels = ["A", "B", "C", "D"];
  const confLevels = ["Guessing", "Somewhat Sure", "Very Confident"];
  const confColors = ["bg-yellow-600/30 border-yellow-600/50 text-yellow-300", "bg-blue-600/30 border-blue-600/50 text-blue-300", "bg-green-600/30 border-green-600/50 text-green-300"];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm font-mono">{index + 1}/{total}</span>
            <ProgressBar current={index + 1} total={total} />
          </div>
          <Timer seconds={timeLeft} maxSeconds={maxTime} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">{question.subtopic}</span>
          <span className="px-2 py-0.5 bg-gray-800 text-gray-500 rounded text-xs">{question.style}</span>
        </div>

        <h2 className="text-lg font-semibold mb-5 leading-relaxed">{question.question}</h2>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, i) => {
            let cls = "border border-gray-700 bg-gray-900 hover:border-gray-500 cursor-pointer";
            if (selected === i && !submitted) cls = "border-2 border-blue-500 bg-blue-500/10";
            if (submitted) {
              if (i === question.correct) cls = "border-2 border-green-500 bg-green-500/10";
              else if (i === selected && i !== question.correct) cls = "border-2 border-red-500 bg-red-500/10";
              else cls = "border border-gray-800 bg-gray-900/50 opacity-50";
            }
            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                className={`w-full text-left p-4 rounded-lg transition-all flex gap-3 ${cls}`}
                disabled={submitted}
              >
                <span className={`font-bold text-sm mt-0.5 ${submitted && i === question.correct ? "text-green-400" : submitted && i === selected ? "text-red-400" : "text-gray-500"}`}>{labels[i]}</span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {!submitted && selected !== null && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">How confident are you?</p>
            <div className="flex gap-2">
              {confLevels.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setConfidence(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${confidence === c ? confColors[i] : "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {submitted && (
          <div className="space-y-4 mb-6 animate-fadeIn">
            <div className={`p-4 rounded-lg border ${selected === question.correct && !timedOut ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                {selected === question.correct && !timedOut ? <Check className="w-5 h-5 text-green-400" /> : timedOut ? <Clock className="w-5 h-5 text-red-400" /> : <X className="w-5 h-5 text-red-400" />}
                <span className="font-semibold text-sm">{timedOut ? "Time's Up!" : selected === question.correct ? "Correct!" : "Incorrect"}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Interview Script</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">{question.interviewScript}</p>
            </div>
            {question.proTip && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">Pro Tip</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{question.proTip}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!submitted && (
              <button onClick={onSkip} className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-all">
                <SkipForward className="w-4 h-4" /> Skip
              </button>
            )}
            <button onClick={onFlag} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${isFlagged ? "bg-amber-600/20 text-amber-400 border border-amber-600/40" : "bg-gray-800 hover:bg-gray-700 text-gray-400"}`}>
              <Flag className="w-4 h-4" /> {isFlagged ? "Flagged" : "Flag"}
            </button>
          </div>
          {submitted ? (
            <button
              onClick={() => onAnswer(selected, confidence, timedOut)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition-all"
            >
              {index + 1 < total ? "Next" : "See Results"} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { if (selected !== null && confidence !== null) setSubmitted(true); }}
              disabled={selected === null || confidence === null}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${selected !== null && confidence !== null ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-800 text-gray-600 cursor-not-allowed"}`}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SubtopicBar({ name, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-48 truncate text-right">{name}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-mono w-16 text-right ${pct >= 70 ? "text-green-400" : pct >= 40 ? "text-amber-400" : "text-red-400"}`}>{correct}/{total}</span>
    </div>
  );
}

function ResultsScreen({ answers, questions, flagged, totalTime, onRetryMissed, onRetryWeak, onRestart }) {
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showFlagged, setShowFlagged] = useState(false);

  const correct = answers.filter(a => a.selected === questions[a.qIdx].correct && !a.timedOut).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);

  let grade, gradeColor;
  if (pct >= 90) { grade = "Staff-ready — you'd ace this topic"; gradeColor = "text-green-400"; }
  else if (pct >= 75) { grade = "Strong Senior — solid, minor gaps"; gradeColor = "text-blue-400"; }
  else if (pct >= 60) { grade = "SDE2-level — review weak areas below"; gradeColor = "text-amber-400"; }
  else { grade = "Needs deep review — revisit fundamentals"; gradeColor = "text-red-400"; }

  const subtopicStats = {};
  answers.forEach(a => {
    const q = questions[a.qIdx];
    if (!subtopicStats[q.subtopic]) subtopicStats[q.subtopic] = { correct: 0, total: 0 };
    subtopicStats[q.subtopic].total++;
    if (a.selected === q.correct && !a.timedOut) subtopicStats[q.subtopic].correct++;
  });

  const luckyGuesses = answers.filter(a => a.selected === questions[a.qIdx].correct && !a.timedOut && a.confidence === "Guessing");
  const overconfidentMisses = answers.filter(a => (a.selected !== questions[a.qIdx].correct || a.timedOut) && a.confidence === "Very Confident");
  const incorrect = answers.filter(a => a.selected !== questions[a.qIdx].correct || a.timedOut);
  const flaggedAnswers = answers.filter(a => flagged.has(a.qIdx));

  const weakSubtopics = Object.entries(subtopicStats).filter(([_, s]) => s.total > 0 && (s.correct / s.total) < 0.7).map(([name]) => name);

  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Award className={`w-16 h-16 mx-auto mb-4 ${gradeColor}`} />
          <div className="text-6xl font-bold mb-2">{pct}%</div>
          <div className="text-xl text-gray-400 mb-1">{correct}/{total} correct</div>
          <div className={`text-lg font-semibold ${gradeColor}`}>{grade}</div>
          <div className="text-gray-500 text-sm mt-2">Completed in {mins}m {secs}s</div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Subtopic Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(subtopicStats).map(([name, s]) => (
              <SubtopicBar key={name} name={name} correct={s.correct} total={s.total} />
            ))}
          </div>
        </div>

        {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {luckyGuesses.length > 0 && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm text-yellow-400">Lucky Guesses ({luckyGuesses.length})</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Correct but you were guessing — hidden weak spots</p>
                {luckyGuesses.map(a => (
                  <p key={a.qIdx} className="text-xs text-gray-300 truncate">• {questions[a.qIdx].subtopic}: Q{a.qIdx + 1}</p>
                ))}
              </div>
            )}
            {overconfidentMisses.length > 0 && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-sm text-red-400">Overconfident Misses ({overconfidentMisses.length})</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Wrong but you were very confident — dangerous misconceptions</p>
                {overconfidentMisses.map(a => (
                  <p key={a.qIdx} className="text-xs text-gray-300 truncate">• {questions[a.qIdx].subtopic}: Q{a.qIdx + 1}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {incorrect.length > 0 && (
          <div className="mb-6">
            <button onClick={() => setShowIncorrect(!showIncorrect)} className="flex items-center gap-2 text-lg font-semibold mb-3">
              <X className="w-5 h-5 text-red-400" /> Incorrect ({incorrect.length})
              {showIncorrect ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {showIncorrect && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrect.map(a => {
                  const q = questions[a.qIdx];
                  return (
                    <div key={a.qIdx} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{q.subtopic}</span>
                      </div>
                      <p className="text-sm font-semibold mb-2">{q.question}</p>
                      <p className="text-xs text-red-400 mb-1">Your answer: {q.options[a.selected] || "Timed out"}</p>
                      <p className="text-xs text-green-400 mb-2">Correct: {q.options[q.correct]}</p>
                      <p className="text-xs text-gray-400">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {flaggedAnswers.length > 0 && (
          <div className="mb-6">
            <button onClick={() => setShowFlagged(!showFlagged)} className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Flag className="w-5 h-5 text-amber-400" /> Flagged ({flaggedAnswers.length})
              {showFlagged ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {showFlagged && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {flaggedAnswers.map(a => {
                  const q = questions[a.qIdx];
                  return (
                    <div key={a.qIdx} className="p-4 rounded-lg bg-gray-900 border border-amber-500/30">
                      <p className="text-sm font-semibold mb-2">{q.question}</p>
                      <p className="text-xs text-green-400 mb-2">Correct: {q.options[q.correct]}</p>
                      <p className="text-xs text-gray-400 mb-2">{q.explanation}</p>
                      <p className="text-xs text-purple-400 italic">{q.interviewScript}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {incorrect.length > 0 && (
            <button onClick={onRetryMissed} className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 rounded-lg font-semibold text-sm text-red-400 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retry Missed ({incorrect.length})
            </button>
          )}
          {weakSubtopics.length > 0 && (
            <button onClick={onRetryWeak} className="flex-1 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/40 rounded-lg font-semibold text-sm text-amber-400 transition-all flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" /> Retry Weak Subtopics
            </button>
          )}
          <button onClick={onRestart} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Full Restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DatabaseIndexingQuiz({ quizSlug = 'core-concepts-db-indexing' }) {
  const [screen, setScreen] = useState("landing");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(90);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

  const MAX_TIME = 90;

  const startQuiz = useCallback((mode) => {
    const ordered = QUESTIONS.map((q, i) => i);
    const qs = mode === "shuffled" ? shuffleArray(ordered) : ordered;
    setQuizQuestions(qs);
    setCurrentIdx(0);
    setAnswers([]);
    setSkipped([]);
    setFlagged(new Set());
    setTimeLeft(MAX_TIME);
    setTotalElapsed(0);
    setScreen("quiz");
    startNewAttempt(qs.map(idx => QUESTIONS[idx].id));
  }, []);

  const startRetry = useCallback((indices) => {
    const qs = shuffleArray(indices);
    setQuizQuestions(qs);
    setCurrentIdx(0);
    setAnswers([]);
    setSkipped([]);
    setFlagged(new Set());
    setTimeLeft(MAX_TIME);
    setTotalElapsed(0);
    setScreen("quiz");
  }, []);

  useEffect(() => {
    if (screen !== "quiz") return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) return 0;
        return t - 1;
      });
      setTotalElapsed(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, currentIdx]);

  const currentQ = screen === "quiz" && currentIdx < quizQuestions.length ? QUESTIONS[quizQuestions[currentIdx]] : null;

  const handleAnswer = useCallback((selected, confidence, timedOut) => {
    const qIdx = quizQuestions[currentIdx];
    const q = QUESTIONS[qIdx];
    const isCorrect = !timedOut && selected === q.correct;
    const newAnswers = [...answers, { qIdx, selected: selected ?? -1, confidence: confidence || "Guessing", timedOut: !!timedOut }];
    setAnswers(newAnswers);
    persistAnswer(q.id, {
      selectedIndex: selected ?? -1,
      correctIndex: q.correct,
      isCorrect,
      confidence: confidence || null,
      timedOut: !!timedOut,
    });

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(MAX_TIME);
    } else if (skipped.length > 0) {
      setQuizQuestions(prev => [...prev, ...skipped]);
      setSkipped([]);
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(MAX_TIME);
    } else {
      setAnswers(newAnswers);
      const correctCount = newAnswers.filter(a => a.selected === QUESTIONS[a.qIdx].correct && !a.timedOut).length;
      completeQuiz({ correct: correctCount, total: newAnswers.length }, totalElapsed);
      setScreen("results");
    }
  }, [answers, currentIdx, quizQuestions, skipped, persistAnswer, completeQuiz, totalElapsed]);

  const handleSkip = useCallback(() => {
    setSkipped(prev => [...prev, quizQuestions[currentIdx]]);
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(MAX_TIME);
    } else if (skipped.length > 0) {
      const allSkipped = [...skipped, quizQuestions[currentIdx]];
      setQuizQuestions(prev => [...prev, ...allSkipped]);
      setSkipped([]);
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(MAX_TIME);
    } else {
      const remaining = [quizQuestions[currentIdx]];
      setQuizQuestions(prev => [...prev, ...remaining]);
      setSkipped([]);
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(MAX_TIME);
    }
  }, [currentIdx, quizQuestions, skipped]);

  const handleFlag = useCallback(() => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(quizQuestions[currentIdx])) next.delete(quizQuestions[currentIdx]);
      else next.add(quizQuestions[currentIdx]);
      return next;
    });
  }, [currentIdx, quizQuestions]);

  const handleRetryMissed = useCallback(() => {
    const missed = answers.filter(a => a.selected !== QUESTIONS[a.qIdx].correct || a.timedOut).map(a => a.qIdx);
    startRetry(missed);
  }, [answers, startRetry]);

  const handleRetryWeak = useCallback(() => {
    const subtopicStats = {};
    answers.forEach(a => {
      const q = QUESTIONS[a.qIdx];
      if (!subtopicStats[q.subtopic]) subtopicStats[q.subtopic] = { correct: 0, total: 0, indices: [] };
      subtopicStats[q.subtopic].total++;
      subtopicStats[q.subtopic].indices.push(a.qIdx);
      if (a.selected === q.correct && !a.timedOut) subtopicStats[q.subtopic].correct++;
    });
    const weakIndices = [];
    Object.values(subtopicStats).forEach(s => {
      if (s.total > 0 && (s.correct / s.total) < 0.7) weakIndices.push(...s.indices);
    });
    startRetry([...new Set(weakIndices)]);
  }, [answers, startRetry]);

  if (screen === "landing") return <LandingScreen onStart={startQuiz} />;
  if (screen === "results") return (
    <ResultsScreen
      answers={answers}
      questions={QUESTIONS}
      flagged={flagged}
      totalTime={totalElapsed}
      onRetryMissed={handleRetryMissed}
      onRetryWeak={handleRetryWeak}
      onRestart={() => setScreen("landing")}
    />
  );

  if (!currentQ) return null;

  return (
    <QuestionScreen
      key={`${currentIdx}-${quizQuestions[currentIdx]}`}
      question={currentQ}
      index={currentIdx}
      total={quizQuestions.length}
      onAnswer={handleAnswer}
      onSkip={handleSkip}
      onFlag={handleFlag}
      isFlagged={flagged.has(quizQuestions[currentIdx])}
      timeLeft={timeLeft}
      maxTime={MAX_TIME}
    />
  );
}
