// === COVERAGE MANIFEST ===
// Content type: deep pattern (time-series database internals)
//
// HEAVY subtopics:
// LSM Trees — Questions: 4 — IDs: [q3, q4, q5, q6]
//   └─ Memtable (sorted in-memory buffer) — covered by: [q3]
//   └─ SSTables (immutable sorted files) — covered by: [q4]
//   └─ Compaction (background merging) — covered by: [q5]
//   └─ Write amplification trade-off — covered by: [q6]
// Delta Encoding & Compression — Questions: 4 — IDs: [q7, q8, q9, q10]
//   └─ Delta encoding basics — covered by: [q7]
//   └─ Delta-of-delta for timestamps — covered by: [q8]
//   └─ XOR-based float compression — covered by: [q9]
//   └─ Variable-length integer encoding — covered by: [q10]
// Data Model (Tags vs Fields) — Questions: 4 — IDs: [q19, q20, q21, q22]
//   └─ Tag indexing & filtering — covered by: [q19]
//   └─ Tag vs field decision — covered by: [q20]
//   └─ Series concept (measurement+tags) — covered by: [q21]
//   └─ Inverted index for tags — covered by: [q22]
// Cardinality Problem — Questions: 3 — IDs: [q23, q24, q25]
//   └─ High-cardinality tag explosion — covered by: [q23]
//   └─ Memory exhaustion from tag index — covered by: [q24]
//   └─ When TSDB is worse than general-purpose DB — covered by: [q25]
//
// MEDIUM subtopics:
// Append-Only Storage — Questions: 2 — IDs: [q1, q2]
// Time-Based Partitioning — Questions: 2 — IDs: [q11, q12]
// Bloom Filters — Questions: 2 — IDs: [q13, q14]
// Downsampling & Rollups — Questions: 2 — IDs: [q15, q16]
// Query Execution — Questions: 2 — IDs: [q26, q27]
// Storage Engine Architecture (WAL + file format) — Questions: 2 — IDs: [q28, q29]
//
// THIN subtopics (standalone):
// Block-Level Metadata — Questions: 1 — IDs: [q17]
// When NOT to use a TSDB — Questions: 1 — IDs: [q30]
//
// THIN subtopics (clustered):
// Cluster: Motivating Example (Postgres limitations) + TSDB vs General-Purpose — Questions: 1 — IDs: [q18]
//
// CROSS-SUBTOPIC bridges:
// LSM Trees × Bloom Filters — IDs: [q31]
// Time-Based Partitioning × Downsampling — IDs: [q32]
// Compression × Cardinality — IDs: [q33]
// Append-Only Storage × LSM Trees × Query Execution — IDs: [q34]
// Block-Level Metadata × Time-Based Partitioning × Query Execution — IDs: [q35]
//
// Anti-pattern questions: 4 — IDs: [q20, q23, q25, q30]
// Gotcha/trap questions: 3 — IDs: [q6, q10, q24]
//
// Total: 35 questions across 13 subtopics (4 heavy, 6 medium, 3 thin)
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, CheckCircle, XCircle, ChevronRight, RotateCcw, Award, AlertTriangle, Zap, Brain, Target, Trophy, Timer, ArrowRight, BarChart3, Flag, SkipForward, BookOpen } from "lucide-react";

const QUIZ_DATA = {
  title: "Time-Series Databases: Deep Dive",
  description: "Master the internals of time-series databases — LSM trees, append-only storage, delta encoding, Bloom filters, and cardinality trade-offs. These 35 questions test your ability to reason about storage engine design and data modeling decisions at FAANG SDE2+ level.",
  estimatedTime: "~44 min",
  difficulty: "FAANG SDE2 — Very Hard",
  subtopicBreakdown: {
    heavy: [
      { name: "LSM Trees", count: 4 },
      { name: "Delta Encoding & Compression", count: 4 },
      { name: "Data Model (Tags vs Fields)", count: 4 },
      { name: "Cardinality Problem", count: 3 }
    ],
    medium: [
      { name: "Append-Only Storage", count: 2 },
      { name: "Time-Based Partitioning", count: 2 },
      { name: "Bloom Filters", count: 2 },
      { name: "Downsampling & Rollups", count: 2 },
      { name: "Query Execution", count: 2 },
      { name: "Storage Engine Architecture", count: 2 }
    ],
    thin: [
      { name: "Block-Level Metadata", count: 1 },
      { name: "When NOT to use a TSDB", count: 1 },
      { name: "Postgres Limitations + TSDB vs GP", count: 1 }
    ]
  },
  questions: [
    // === APPEND-ONLY STORAGE ===
    {
      id: "q1",
      category: "Append-Only Storage",
      tier: "medium",
      question: "You're designing a metrics ingestion service handling 50,000 writes/second. Your storage layer uses traditional B-tree-based updates (read-modify-write). Under sustained load, write latency spikes to 200ms with heavy tail latencies. You switch to append-only storage and latency drops to 5ms p99. What is the primary physical mechanism that explains this 40x improvement?",
      options: [
        { label: "A", text: "Append-only storage eliminates the need for write-ahead logging, saving one disk write per operation" },
        { label: "B", text: "Sequential I/O avoids disk seek time — instead of random seeks to update rows in place, all writes go to the end of the file in order, which both spinning disks and SSDs handle dramatically faster" },
        { label: "C", text: "Append-only storage uses memory-mapped files, which bypass the kernel's I/O scheduler entirely" },
        { label: "D", text: "The storage engine can batch writes into larger blocks because append-only files don't need per-row locking" }
      ],
      correct: 1,
      explanation: "The fundamental advantage is the I/O access pattern. Traditional B-tree updates require random I/O: seek to the row's location, read it, modify, write back. Spinning disks handle only 100-200 random IOPS. Even SSDs, while faster at random access, perform significantly better with sequential patterns due to their internal architecture. Append-only turns all writes into sequential I/O — just write to the end. Option A is wrong because TSDBs still use WALs. Option D describes a real benefit of batching but isn't the primary mechanism. Option C conflates memory-mapping with append-only.",
      interviewScript: "In your interview, say: 'The key insight is converting random I/O to sequential I/O. Traditional databases seek to specific disk locations for each update, but append-only storage writes everything to the end of the file. Sequential writes are orders of magnitude faster on both HDDs and SSDs.'",
      proTip: "Quantify the difference: spinning disks do ~100-200 random IOPS but tens of thousands of sequential writes/sec. SSDs do ~10K-100K random IOPS but hundreds of thousands sequential. This is why the pattern matters even on modern hardware."
    },
    {
      id: "q2",
      category: "Append-Only Storage",
      tier: "medium",
      question: "A junior engineer on your team says: 'If append-only storage is so fast for writes, why don't all databases use it? What's the catch?' What is the most accurate response?",
      options: [
        { label: "A", text: "Append-only storage can't handle updates or deletes, making it useless for most workloads" },
        { label: "B", text: "Append-only storage makes writes fast but creates a read problem — data isn't organized for efficient lookups, requiring additional structures like LSM trees to reorganize data in the background" },
        { label: "C", text: "Append-only storage wastes disk space because deleted data is never reclaimed" },
        { label: "D", text: "Append-only storage only works with time-series data because it relies on timestamps for ordering" }
      ],
      correct: 1,
      explanation: "The trade-off is write speed vs. read organization. Appending is fast but means data is scattered in insertion order, not organized for efficient queries. You need additional mechanisms (LSM trees, compaction) to periodically reorganize data for reads. Option A is wrong — you can handle updates/deletes with tombstones and compaction. Option C is partially true (space reclamation requires compaction) but not the primary 'catch'. Option D is wrong — append-only storage works for any write-heavy workload (Cassandra, LevelDB use it for general data).",
      interviewScript: "In your interview, say: 'Append-only storage optimizes writes at the cost of read organization. Data lands in arrival order, not query order. That's why append-only storage is paired with LSM trees — the LSM tree's background compaction reorganizes data for efficient reads without blocking the fast write path.'",
      proTip: null
    },

    // === LSM TREES ===
    {
      id: "q3",
      category: "LSM Trees",
      tier: "heavy",
      question: "In an LSM tree, the memtable is implemented as a sorted data structure like a red-black tree or skip list. A colleague suggests using a hash map instead, arguing it has O(1) inserts vs O(log n) for a sorted structure. Why is this a bad idea for an LSM-based storage engine?",
      options: [
        { label: "A", text: "Hash maps use more memory than sorted trees, which matters because the memtable must fit in RAM" },
        { label: "B", text: "Hash maps can't handle concurrent writes from multiple threads, while red-black trees can" },
        { label: "C", text: "When the memtable flushes to disk as an SSTable, it must produce a sorted file — a hash map would require a full sort at flush time, making flushes expensive and unpredictable instead of a simple sequential write of already-sorted data" },
        { label: "D", text: "Hash maps don't support range queries on keys, which are needed for the memtable to serve reads while in memory" }
      ],
      correct: 2,
      explanation: "The critical requirement is that SSTables on disk must be sorted — this enables binary search for point lookups, efficient range queries, and merge-sort-based compaction. If the memtable is already sorted, flushing is a simple sequential write from start to end — extremely fast. A hash map would require sorting all entries at flush time, creating latency spikes. Option D is a real benefit of sorted structures but not the primary reason — the flush efficiency is what matters because it determines write throughput. Option A is generally false. Option B is wrong — both can be made concurrent.",
      interviewScript: "In your interview, say: 'The memtable must be sorted because the flush to SSTable needs to produce a sorted file efficiently. With a sorted memtable, flushing is a simple sequential write. A hash map would require sorting at flush time, creating unpredictable latency spikes and blocking incoming writes.'",
      proTip: "Sorted SSTables enable three critical operations: binary search for point lookups, efficient sequential range scans, and merge-sort during compaction. All three break if the file isn't sorted."
    },
    {
      id: "q4",
      category: "LSM Trees",
      tier: "heavy",
      question: "Your LSM-based time-series database has accumulated 200 SSTables in one partition due to delayed compaction. Users report that point lookups for a specific host's data have become 10x slower. Bloom filters are enabled. What explains the slowdown, and what is the correct fix?",
      options: [
        { label: "A", text: "Bloom filters become less accurate with more SSTables, causing excessive false positives. Fix: increase the Bloom filter size per SSTable" },
        { label: "B", text: "Each SSTable's Bloom filter must still be checked in memory, and with 200 SSTables the cumulative false positive rate means many unnecessary disk reads. Fix: trigger compaction to merge SSTables, reducing the number of files to check" },
        { label: "C", text: "The memtable is full and refusing new writes, causing a backlog. Fix: increase memtable size to delay flushes" },
        { label: "D", text: "SSTables have overlapping key ranges, so binary search can't narrow down which file contains the key. Fix: enable range-partitioned compaction (leveled compaction)" }
      ],
      correct: 1,
      explanation: "With 200 SSTables, each point lookup must check up to 200 Bloom filters. Even at 1% false positive rate per filter, the probability of at least one false positive across 200 files is 1 - (0.99)^200 ≈ 87%. That means most lookups result in unnecessary disk reads. Compaction merges SSTables, reducing the file count and thus the number of Bloom filter checks. Option D describes a real concern (leveled compaction does help) but doesn't correctly diagnose why Bloom filters alone aren't sufficient. Option A is wrong — individual filter accuracy doesn't degrade. Option C is unrelated to read performance.",
      interviewScript: "In your interview, say: 'With 200 SSTables, the cumulative false positive rate across all Bloom filters becomes very high — roughly 87% chance of at least one false positive per lookup. The fix is compaction: merging SSTables reduces the number of files, directly reducing both Bloom filter checks and potential false-positive disk reads.'",
      proTip: "Calculate it: P(at least one false positive) = 1 - (1 - FPR)^N. With FPR=1% and N=200, that's 1 - 0.99^200 ≈ 87%. This quantitative reasoning impresses interviewers."
    },
    {
      id: "q5",
      category: "LSM Trees",
      tier: "heavy",
      question: "During LSM tree compaction, the database merges multiple SSTables into larger ones. Your monitoring shows that compaction is consuming 80% of disk I/O bandwidth, starving both reads and incoming writes. What is the fundamental tension here, and what's the best mitigation strategy?",
      options: [
        { label: "A", text: "Compaction rewrites data multiple times (write amplification), competing for I/O. Mitigate by rate-limiting compaction throughput and accepting temporarily higher read latency from more SSTables" },
        { label: "B", text: "Compaction is CPU-bound from sorting merged data. Mitigate by using more CPU cores for parallel compaction" },
        { label: "C", text: "Compaction locks the SSTables being merged, blocking reads. Mitigate by using copy-on-write snapshots during compaction" },
        { label: "D", text: "Compaction generates too many temporary files. Mitigate by increasing the compaction threshold so it runs less frequently with larger batches" }
      ],
      correct: 0,
      explanation: "Write amplification is the core tension: data written to the memtable gets rewritten multiple times as it moves through compaction levels. Each compaction round reads and rewrites data, consuming disk I/O. The standard mitigation is rate-limiting compaction — cap its I/O bandwidth so it doesn't starve foreground operations, accepting that more SSTables temporarily exist (slightly worse reads). Option B is wrong — compaction is I/O-bound, not CPU-bound. Option C is wrong — SSTables are immutable, so compaction reads old files and writes new ones without locking. Option D would make individual compactions even more I/O-intensive.",
      interviewScript: "In your interview, say: 'This is the write amplification trade-off inherent to LSM trees. Compaction rewrites data multiple times across levels, consuming disk I/O. The practical mitigation is rate-limiting compaction throughput — you accept temporarily more SSTables and slightly degraded reads to prevent compaction from starving foreground operations.'",
      proTip: "Real systems like RocksDB expose compaction rate limits as configuration. Facebook's production RocksDB tuning guide specifically addresses this trade-off — it's a real operational concern, not just theory."
    },
    {
      id: "q6",
      category: "LSM Trees",
      tier: "heavy",
      question: "A candidate proposes using an LSM tree for a read-heavy analytics workload that performs 95% range scans and 5% writes. The data is rarely updated after insertion. What is the most critical flaw in this proposal?",
      options: [
        { label: "A", text: "LSM trees can't perform range scans because SSTables store data in random order" },
        { label: "B", text: "Write amplification from compaction will overwhelm the 5% write volume, causing disk saturation" },
        { label: "C", text: "LSM trees trade read performance for write throughput — range scans may need to merge results across multiple SSTables, adding latency. A B-tree or columnar store would be more appropriate for this read-heavy, scan-intensive workload" },
        { label: "D", text: "LSM trees don't support the GROUP BY and aggregation operations needed for analytics" }
      ],
      correct: 2,
      explanation: "LSM trees are optimized for write-heavy workloads by deferring organization to background compaction. For a 95% read workload with range scans, the multiple-SSTable merge penalty directly hurts the dominant access pattern. A B-tree keeps data sorted in place (better for reads), and columnar stores are specifically designed for analytical range scans. Option A is wrong — SSTables ARE sorted. Option B is unlikely with only 5% writes. Option D conflates storage engine capabilities with query engine features. This is a gotcha because LSM trees CAN do range scans — they're just not optimal for read-dominated workloads.",
      interviewScript: "In your interview, say: 'LSM trees are designed for write-heavy workloads, trading read efficiency for write throughput. For a 95% read workload dominated by range scans, the cost of merging across multiple SSTables directly penalizes the dominant access pattern. A B-tree or columnar store would serve reads more efficiently here.'",
      proTip: "This is exactly the 'reach for LSM trees when you have high-write workloads' guidance from the content. Matching storage engine to access pattern is a staff+ signal."
    },

    // === DELTA ENCODING & COMPRESSION ===
    {
      id: "q7",
      category: "Delta Encoding & Compression",
      tier: "heavy",
      question: "Your time-series database stores CPU metrics sampled every 10 seconds. The values fluctuate between 44% and 47%. Using delta encoding, the raw 8-byte doubles are replaced with deltas like +0.1, -0.2, +0.3. A colleague asks: 'But floats are always 8 bytes — how does storing smaller numbers actually save space?' What's the correct explanation?",
      options: [
        { label: "A", text: "The database truncates the floating-point precision, rounding deltas to integers that fit in fewer bytes" },
        { label: "B", text: "Variable-length encoding (varint) represents small numbers with fewer bytes — the number 1 might take 1 byte instead of 8. Converting large absolute values into small deltas enables varint to dramatically reduce per-value storage" },
        { label: "C", text: "The deltas are stored as fixed-point integers with a known scale factor, using 2 bytes instead of 8" },
        { label: "D", text: "Modern file systems automatically compress blocks with repeating byte patterns, so smaller numbers compress better at the filesystem level" }
      ],
      correct: 1,
      explanation: "Variable-length integer encoding is the key mechanism. Standard IEEE 754 doubles always consume 8 bytes regardless of value. But varint encoding uses fewer bytes for smaller values: the number 1 needs just 1 byte, 1000 needs 2 bytes. By converting absolute values (45.2, 45.3) into tiny deltas (+0.1, -0.2), we create values that varint can represent efficiently. Option A would lose precision. Option C is a valid technique but not what TSDBs typically use. Option D describes filesystem-level compression, which is independent of the encoding scheme.",
      interviewScript: "In your interview, say: 'Delta encoding converts large absolute values into small differences. The space savings come from variable-length encoding — varint uses fewer bytes for smaller numbers. A delta of +1 might take 1 byte vs. 8 bytes for the raw double. The combination of delta encoding plus varint is what makes this so effective.'",
      proTip: null
    },
    {
      id: "q8",
      category: "Delta Encoding & Compression",
      tier: "heavy",
      question: "You're analyzing compression efficiency for a metrics pipeline that samples at exactly 10-second intervals. The timestamps are: 1000, 1010, 1020, 1030, 1040. Using delta-of-delta encoding, the stored sequence becomes: [1000, 10, 0, 0, 0, 0]. Your PM asks why you can't achieve the same compression ratio on timestamps from an event-driven system where events arrive at irregular intervals. What's the correct explanation?",
      options: [
        { label: "A", text: "Event-driven timestamps have no correlation between consecutive values, so delta encoding produces deltas as large as the original values" },
        { label: "B", text: "Delta-of-delta exploits regularity — when the interval is constant (10s), the delta-of-deltas are all zero, compressible to ~1 bit/value. Irregular intervals produce non-zero delta-of-deltas that require more bits, degrading compression from ~1 bit to several bytes per timestamp" },
        { label: "C", text: "Event-driven systems use string timestamps instead of Unix epochs, which can't be delta-encoded" },
        { label: "D", text: "The compression algorithm falls back to storing raw timestamps when it detects irregular patterns, completely negating any benefit" }
      ],
      correct: 1,
      explanation: "Delta-of-delta encoding is specifically designed for regular time series. With constant 10-second intervals, deltas are all 10, and delta-of-deltas are all 0 — encodable as essentially 1 bit per value (the Gorilla paper showed this). Irregular intervals produce varying deltas, so delta-of-deltas are non-zero and require more bits. Option A is wrong — even irregular events have some temporal correlation (deltas are smaller than absolute timestamps). Option D is wrong — the algorithm still helps, just less dramatically. Option C is wrong — all modern systems use numeric timestamps.",
      interviewScript: "In your interview, say: 'Delta-of-delta encoding exploits the regularity of fixed-interval sampling. When intervals are constant, delta-of-deltas are zero — achievable down to 1 bit per timestamp as shown in Facebook's Gorilla paper. Irregular intervals break this regularity, producing non-zero delta-of-deltas that need more bits.'",
      proTip: "Facebook's Gorilla paper demonstrated 1-bit-per-timestamp compression for regular metrics. Mention this paper by name — interviewers at FAANG companies know it and it signals depth."
    },
    {
      id: "q9",
      category: "Delta Encoding & Compression",
      tier: "heavy",
      question: "For floating-point metric values, time-series databases use XOR-based compression. When you XOR two similar float values, most bits are zero. A candidate claims: 'XOR compression works because adjacent metric values are always close together.' In which scenario does XOR-based float compression perform poorly despite values being numerically close?",
      options: [
        { label: "A", text: "When values cross a power-of-2 boundary (e.g., 63.9 → 64.1), the IEEE 754 exponent bits change, producing many differing bits in the XOR despite a small numerical delta" },
        { label: "B", text: "When values are exactly equal — XOR produces all zeros, which confuses the decoder" },
        { label: "C", text: "When values alternate between positive and negative — the sign bit flip causes maximum XOR difference" },
        { label: "D", text: "When values have more than 6 decimal places of precision, exceeding the mantissa capacity" }
      ],
      correct: 0,
      explanation: "XOR compression works on the binary representation, not the numerical value. Two numbers that are numerically close (63.9 and 64.1) can have very different binary representations if they cross an exponent boundary in IEEE 754 — the exponent bits shift, changing many bits in the XOR. Option B is wrong — XOR of identical values is 0, which is the best case (maximally compressible). Option C rarely occurs in metrics data (CPU usage doesn't go negative). Option D is wrong — precision doesn't affect XOR compression, the mantissa bits just differ more.",
      interviewScript: "In your interview, say: 'XOR compression operates on binary representations, not numerical values. Two floats that are numerically close but cross an IEEE 754 exponent boundary will have many differing bits, producing a poor XOR result. This is a subtle distinction — the compression exploits bit-level similarity, not value-level similarity.'",
      proTip: "In practice, this edge case is relatively rare for typical metrics (CPU percentages, latency values tend to stay within narrow ranges), which is why XOR compression achieves ~1.37 bytes/value on average for real workloads."
    },
    {
      id: "q10",
      category: "Delta Encoding & Compression",
      tier: "heavy",
      question: "Your team achieves an average of 1.37 bytes per metric value using XOR compression and delta-of-delta timestamps. The original data was 16 bytes per point (8-byte timestamp + 8-byte double). A new engineer calculates: 'We have 4.3 billion points/day × 1.37 bytes = 5.9 GB/day. That's nothing!' They propose storing 5 years of raw data at full resolution. What critical factor are they overlooking?",
      options: [
        { label: "A", text: "The 1.37 bytes/value figure only covers the value — timestamps, tags, series keys, block metadata, and index overhead aren't included. Actual storage with metadata is 3-5x the compressed value size" },
        { label: "B", text: "Compression ratios degrade over time as data becomes less correlated, so older data takes more space per point" },
        { label: "C", text: "5 years of full-resolution data means 7.8 trillion data points — even at 1.37 bytes, query performance over that volume degrades catastrophically without downsampling because every query must scan enormous time ranges" },
        { label: "D", text: "Disk I/O bandwidth, not storage capacity, is the bottleneck — reading 5 years of data requires decompressing each block sequentially" }
      ],
      correct: 2,
      explanation: "Storage space is only part of the equation. 5 years at 10-second resolution is ~7.8 trillion points. Queries over long time ranges (e.g., 'average CPU last year') must scan and decompress enormous volumes. Downsampling exists precisely for this — reducing historical resolution to 1-minute or 1-hour averages makes long-range queries feasible. Option A raises a valid point about overhead but isn't the critical issue. Option B is generally false — compression depends on data characteristics, not age. Option D describes a real concern but is a subset of the query performance problem.",
      interviewScript: "In your interview, say: 'Storage cost isn't the bottleneck — query performance is. Without downsampling, a query over 5 years of 10-second data must scan trillions of points. Downsampling to 1-hour averages for data older than 30 days reduces the scan volume by 360x, making historical queries practical.'",
      proTip: "This is exactly the kind of requirements negotiation interviewers look for: 'We could store all raw data, but nobody needs 10-second resolution for last year. Downsampling is the right trade-off.' Proactively raising this shows staff+ thinking."
    },

    // === TIME-BASED PARTITIONING ===
    {
      id: "q11",
      category: "Time-Based Partitioning",
      tier: "medium",
      question: "Your time-series database partitions data into daily chunks. A user runs a query: 'Show me the last 2 hours of CPU data.' It's currently 1:30 AM. The query takes 2x longer than expected. What's the most likely cause?",
      options: [
        { label: "A", text: "The query spans two daily partitions (yesterday 11:30 PM to today 1:30 AM), so the database must open and scan two partition files instead of one, doubling I/O" },
        { label: "B", text: "The overnight partition hasn't been compacted yet, so it contains many small SSTables" },
        { label: "C", text: "The system's clock drifted, causing data to be written to the wrong partition" },
        { label: "D", text: "Night-time data has lower cardinality (fewer active hosts), making the Bloom filter less effective" }
      ],
      correct: 0,
      explanation: "Time-based partitioning localizes writes and reads to specific time windows. A query for 'last 2 hours' at 1:30 AM crosses the midnight partition boundary, requiring reads from both the Nov 25 and Nov 26 partitions. Each partition involves opening files, checking indexes, and reading blocks — roughly doubling the work compared to a query that fits within one partition. Option B could contribute but isn't the primary cause. Option C is a real operational concern but not the 'most likely' cause. Option D is wrong — Bloom filter effectiveness depends on series count, not time of day.",
      interviewScript: "In your interview, say: 'The query crosses a partition boundary — it spans yesterday's and today's partitions. Time-based partitioning is optimized for queries within a single partition. Cross-boundary queries must read from multiple partitions, roughly doubling the I/O. This is a known trade-off when choosing partition granularity.'",
      proTip: "This is why partition size is a tuning parameter. Daily partitions are common, but hourly partitions might be better for workloads dominated by short-range queries. The trade-off is more files to manage vs. fewer cross-boundary queries."
    },
    {
      id: "q12",
      category: "Time-Based Partitioning",
      tier: "medium",
      question: "Your retention policy keeps 7 days of metrics. In a traditional Postgres database, implementing this requires DELETE queries that scan millions of rows. With time-based partitioning, how does retention work and why is it dramatically faster?",
      options: [
        { label: "A", text: "The database marks old partitions as 'expired' in metadata but keeps the files on disk for eventual garbage collection by the OS" },
        { label: "B", text: "The database runs DELETE statements optimized with partition pruning, which is faster than full table scans but still requires row-by-row processing" },
        { label: "C", text: "Old partitions are entire files (or directories) that can be dropped atomically — no row scanning, no index cleanup, no transaction log entries. It's essentially a filesystem delete operation" },
        { label: "D", text: "The database compresses old partitions into archive format, reducing their storage footprint instead of deleting them" }
      ],
      correct: 2,
      explanation: "This is one of the most powerful advantages of time-based partitioning. Each partition is a self-contained file or directory. Dropping a 7-day-old partition is a filesystem delete — O(1) regardless of how much data it contains. No need to scan rows, update indexes, or log individual deletes. In Postgres, deleting billions of rows requires scanning, index updates, and VACUUM operations that can take hours. Option A describes a half-measure. Option B still involves row processing. Option D conflates archival with retention.",
      interviewScript: "In your interview, say: 'Retention with time-based partitioning is trivial — you just drop the entire partition file. It's a filesystem delete, O(1) regardless of data volume. Compare this to Postgres where deleting billions of rows requires row-by-row scanning, index updates, and vacuum operations that can take hours.'",
      proTip: null
    },

    // === BLOOM FILTERS ===
    {
      id: "q13",
      category: "Bloom Filters",
      tier: "medium",
      question: "Your time-series database has 50 SSTables in a partition. A query asks for data from a specific host that only exists in 1 of the 50 SSTables. Without Bloom filters, this requires 50 disk reads. With Bloom filters (1% false positive rate per filter), approximately how many disk reads do you expect?",
      options: [
        { label: "A", text: "Exactly 1 — the Bloom filter for the correct SSTable says 'maybe here,' and all others say 'definitely not'" },
        { label: "B", text: "About 1.5 — the 1 true hit plus ~0.5 expected false positives from the 49 non-matching SSTables (49 × 0.01 ≈ 0.49)" },
        { label: "C", text: "About 5 — Bloom filters only reduce reads by 90% with 1% false positive rate" },
        { label: "D", text: "About 25 — Bloom filters cut reads in half regardless of the false positive rate" }
      ],
      correct: 1,
      explanation: "With a 1% false positive rate per SSTable, each of the 49 non-matching SSTables has a 1% chance of a false positive. Expected false positives = 49 × 0.01 ≈ 0.49. Plus the 1 true hit = ~1.5 expected disk reads. This is a massive improvement from 50 reads. The math is straightforward: expected disk reads = 1 (true positive) + (N-1) × FPR. Option A would be true only with a 0% false positive rate (impossible for a Bloom filter). Option C and D show misunderstanding of how Bloom filter probabilities compound.",
      interviewScript: "In your interview, say: 'Expected disk reads equals the 1 true hit plus the expected false positives: (N-1) × FPR. With 49 other SSTables and 1% FPR, that's about 1.5 reads instead of 50. Bloom filters typically use about 10 bits per key to achieve this 1% rate.'",
      proTip: "Mention the space cost: ~10 bits per key for 1% FPR. For a million series across 50 SSTables, that's ~60MB of Bloom filter data in memory — very reasonable for a 97% reduction in disk reads."
    },
    {
      id: "q14",
      category: "Bloom Filters",
      tier: "medium",
      question: "A candidate proposes adding Bloom filters to speed up a time-range query: 'SELECT avg(value) FROM cpu WHERE time > now() - 1h.' Why would Bloom filters provide minimal benefit for this specific query pattern?",
      options: [
        { label: "A", text: "Bloom filters only work with exact key lookups, not range predicates. Time-range queries don't check for a specific key — they scan all data within a time window. Time-based partitioning already handles the time dimension efficiently" },
        { label: "B", text: "Bloom filters are too slow to check for every timestamp in a one-hour range" },
        { label: "C", text: "The query doesn't specify a host, so there's no tag to look up in the Bloom filter" },
        { label: "D", text: "Bloom filters are stored on disk and would add latency to the query" }
      ],
      correct: 0,
      explanation: "Bloom filters answer the question 'is this specific key present in this file?' They excel at point lookups (e.g., 'does host=server-42 exist in SSTable-7?'). A time-range query without a tag filter needs to read ALL series within the time window — there's no specific key to check. Time-based partitioning already narrows down which partitions to scan based on the time range. Option B misunderstands how Bloom filters work. Option C partially explains it but misses the fundamental issue. Option D is wrong — Bloom filters are kept in memory.",
      interviewScript: "In your interview, say: 'Bloom filters are designed for point lookups — checking if a specific key exists in an SSTable. Time-range queries scan all data within a window, so there's no specific key to check. Time-based partitioning is the mechanism that optimizes time-range filtering by limiting which partitions to scan.'",
      proTip: null
    },

    // === DOWNSAMPLING & ROLLUPS ===
    {
      id: "q15",
      category: "Downsampling & Rollups",
      tier: "medium",
      question: "Your downsampling policy stores pre-aggregated rollups: 1-minute averages for data older than 24 hours. A user queries: 'What was the maximum CPU spike for host-42 last week?' and gets max=78.3%. But the ops team saw a brief spike to 95% in their real-time dashboard. What happened?",
      options: [
        { label: "A", text: "The real-time dashboard was showing predicted values, not actual measurements" },
        { label: "B", text: "The 95% spike lasted less than 1 minute. The 1-minute rollup stored min/max/avg/count, but this particular rollup only stored the average (78.3%), losing the peak. The rollup should store max values separately" },
        { label: "C", text: "The downsampled data was computed before the spike was written to disk, creating a race condition" },
        { label: "D", text: "Downsampling applied averaging to the max values, diluting the 95% spike across the 1-minute window" }
      ],
      correct: 1,
      explanation: "This is a critical design decision in downsampling. If rollups only store averages, extreme values are lost. A 95% spike lasting 10 seconds gets averaged with 50 other 10-second readings in the 1-minute window, producing something like 78.3%. Proper rollups store min, max, sum, and count for each window so any aggregation can be reconstructed. Option D describes what happens if you average the averages — also wrong but a different problem. Option C is unlikely with proper WAL-based ingestion.",
      interviewScript: "In your interview, say: 'Rollups must store min, max, sum, and count — not just averages. If you only store averages, short spikes get diluted. A 95% spike lasting 10 seconds disappears into a 78% one-minute average. This is why production TSDB rollup tables always include multiple aggregate statistics per window.'",
      proTip: "This exact failure mode is why alerting systems always query raw data, not rollups. If your alerting system reads from downsampled data, it can miss critical spikes."
    },
    {
      id: "q16",
      category: "Downsampling & Rollups",
      tier: "medium",
      question: "Your interviewer says: 'We need to store 10-second samples for 1 year.' You know this means ~3.15 billion points per series per year. What's the strongest response that demonstrates staff-level thinking?",
      options: [
        { label: "A", text: "'That's feasible with enough storage. Let me calculate the disk requirements and show it's within budget.'" },
        { label: "B", text: "'I'd push back on that requirement. Nobody needs 10-second resolution for data from 6 months ago. I'd propose: full resolution for 7 days, 1-minute rollups for 30 days, 5-minute rollups for 90 days, and 1-hour rollups for 1 year. This reduces storage by ~360x for historical data while preserving debugging capability for recent issues.'" },
        { label: "C", text: "'We should use a cheaper storage tier like S3 for data older than 30 days to manage cost.'" },
        { label: "D", text: "'1 year of retention is unusual. Most monitoring systems only keep 90 days. Can we reduce the requirement?'" }
      ],
      correct: 1,
      explanation: "This demonstrates three staff-level skills: (a) anticipating a future problem before it materializes (query performance, not just storage cost), (b) explaining the specific challenge (scanning trillions of points for historical queries), and (c) proposing a concrete alternative with a quantified trade-off (360x reduction). Option A misses the query performance problem. Option C addresses cost but not the query performance issue. Option D just pushes back without offering a solution.",
      interviewScript: "In your interview, say: 'Storing full resolution for a year is technically possible, but query performance would degrade significantly — scanning trillions of points for historical trends isn't practical. I'd propose a tiered downsampling policy: full resolution for recent data, progressively coarser rollups for older data. This preserves debugging capability while making historical queries fast.'",
      proTip: "The key phrase interviewers listen for: 'I think we probably only need the fine resolution for a week.' This shows you can negotiate requirements — a hallmark of senior+ engineers."
    },

    // === BLOCK-LEVEL METADATA ===
    {
      id: "q17",
      category: "Block-Level Metadata",
      tier: "thin",
      question: "Your TSDB stores min/max metadata for each data block. A query asks: 'Find all hosts where CPU exceeded 90% in the last hour.' The database has 10,000 blocks for this time range. How does block-level metadata improve this query, and what's the limitation?",
      options: [
        { label: "A", text: "The database checks each block's max value — blocks where max < 90% are skipped entirely without decompressing. Limitation: blocks with max ≥ 90% must be fully scanned even if only one point exceeded 90%, potentially reading blocks where the actual spike is a tiny fraction of the data" },
        { label: "B", text: "The database creates a secondary index on the values, enabling direct lookup. Limitation: the secondary index doubles storage requirements" },
        { label: "C", text: "Block metadata enables parallel scanning across all 10,000 blocks. Limitation: parallelism is bounded by CPU cores" },
        { label: "D", text: "The min/max metadata is used to sort blocks by value range for binary search. Limitation: blocks can't be binary-searched because they're time-ordered" }
      ],
      correct: 0,
      explanation: "Block-level metadata enables 'block pruning' — skipping blocks that provably can't contain matching data. If a block's max CPU value is 75%, it's impossible for any point in that block to exceed 90%, so the entire block is skipped without decompression. The limitation is granularity: a block with max=95% must be fully decompressed even if only 1 of 1000 points hit 95%. Combined with time-based partitioning (which already limits to the last hour's partitions), this provides another filtering layer.",
      interviewScript: "In your interview, say: 'Block-level min/max metadata enables pruning — blocks where max < 90% are skipped entirely. This avoids decompressing and scanning blocks that can't contain matching data. The limitation is block granularity: blocks with max ≥ 90% must be fully decompressed even if the matching point is a tiny fraction of the block.'",
      proTip: "This is the same idea behind Parquet's row group statistics and zone maps in columnar databases. Mention the connection to show breadth."
    },

    // === POSTGRES LIMITATIONS + TSDB vs GENERAL PURPOSE ===
    {
      id: "q18",
      category: "TSDB vs General-Purpose DB",
      tier: "thin",
      question: "A team stores 4.3 billion metrics per day in vanilla Postgres. They observe three problems: (1) write throughput degrades as indexes grow, (2) simple queries like 'avg CPU for host-42 last hour' take 30+ seconds, (3) each row stores the full hostname and metric name repeatedly. Which combination of TSDB techniques most directly addresses all three problems?",
      options: [
        { label: "A", text: "Sharding Postgres across multiple instances for write throughput, adding read replicas for query speed, and normalizing the schema to reduce duplication" },
        { label: "B", text: "Append-only storage + LSM trees (eliminates index-degraded writes), columnar series-oriented storage with tag indexing (co-locates related data for fast scans), and delta/XOR compression (eliminates redundant storage of repeated metadata)" },
        { label: "C", text: "Switching to a document database like MongoDB for flexible schema and horizontal scaling" },
        { label: "D", text: "Adding a caching layer (Redis) for recent queries, partitioning Postgres by time, and enabling columnar compression extensions" }
      ],
      correct: 1,
      explanation: "This question maps each Postgres limitation to a specific TSDB technique: (1) Append-only + LSM trees handle sustained high writes without index degradation because there are no in-place updates. (2) Series-oriented storage groups data by measurement+tags, so querying one host's data reads contiguous blocks instead of scattered rows. (3) Delta encoding and compression exploit the numerical regularity of metrics data, and series-keyed storage eliminates per-row metadata repetition. Option A is a valid Postgres approach but doesn't achieve the same efficiency. Option D is a pragmatic hybrid but still hits Postgres's fundamental row-store limitations.",
      interviewScript: "In your interview, say: 'Each Postgres limitation maps to a TSDB optimization: write throughput degradation is solved by append-only + LSM trees, slow queries by series-oriented co-located storage with tag indexes, and storage bloat by delta encoding and compression. The key insight is that TSDBs exploit assumptions about time-series data — regular timestamps, low-cardinality tags, correlated values — that Postgres can't.'",
      proTip: null
    },

    // === DATA MODEL (TAGS vs FIELDS) ===
    {
      id: "q19",
      category: "Data Model (Tags vs Fields)",
      tier: "heavy",
      question: "You're ingesting metrics with this schema: cpu_usage,host=server-1,region=us-west value=45.2 <timestamp>. A query filters by region='us-west' AND env='prod' and uses a tag index to find matching series. The tag index maps tag values to series using set intersection. What data structure is this tag index most similar to, and why does it make multi-tag queries fast?",
      options: [
        { label: "A", text: "A B-tree index — it stores tag values in sorted order, enabling binary search for matching series" },
        { label: "B", text: "An inverted index — it maps each tag value to a set of series IDs, and multi-tag queries intersect these sets. This is the same structure Elasticsearch uses, but instead of mapping words to documents, it maps tag values to time series" },
        { label: "C", text: "A hash table — it maps tag combinations to series IDs with O(1) lookup, making any tag filter instant" },
        { label: "D", text: "A bitmap index — each tag value gets a bit vector where each bit represents a series, and AND/OR operations combine filters" }
      ],
      correct: 1,
      explanation: "The tag index is functionally an inverted index. For each tag value (e.g., region=us-west), it stores the list of series containing that tag. Multi-tag queries compute set intersections: series matching region=us-west ∩ series matching env=prod. This is exactly how Elasticsearch works — inverted indexes mapping terms to document IDs with set operations for boolean queries. Option D (bitmap indexes) is a valid alternative implementation but not what the content describes. Option C wouldn't support set intersection efficiently. Option A doesn't capture the set-based nature.",
      interviewScript: "In your interview, say: 'The tag index is essentially an inverted index — the same data structure behind Elasticsearch. Each tag value maps to a set of series IDs. Multi-tag queries are set intersections: find series matching each tag condition and intersect the results. This gives us O(min(|set1|, |set2|)) query time regardless of total data volume.'",
      proTip: "Drawing this connection to Elasticsearch shows breadth. Both systems solve the same fundamental problem: efficient multi-attribute filtering using inverted indexes with set operations."
    },
    {
      id: "q20",
      category: "Data Model (Tags vs Fields)",
      tier: "heavy",
      question: "A candidate designing a monitoring system adds request_id as a tag on every metric point, arguing: 'We need to correlate metrics with specific requests for debugging.' What is the critical flaw in this design decision?",
      options: [
        { label: "A", text: "Request IDs are too long to store efficiently as tag values, wasting disk space" },
        { label: "B", text: "Request IDs are high-cardinality — millions of unique values per day. Since tags are indexed in memory, this creates millions of series entries in the tag index, exhausting memory and degrading query performance for all metrics, not just request-correlated ones" },
        { label: "C", text: "Request IDs change with every data point, preventing delta encoding of the tag values" },
        { label: "D", text: "Tags must be predefined in the schema and can't accept dynamic values like request IDs" }
      ],
      correct: 1,
      explanation: "This is the cardinality explosion anti-pattern. Tags are indexed in memory — every unique tag combination creates a series entry. With millions of unique request IDs, the tag index explodes: 1000 hosts × 50 metrics × 1M request IDs = 50 billion potential series. The in-memory index can't hold this, causing OOM crashes or severe degradation. Request IDs should be stored as fields (not indexed, but still queryable via sequential scan). Option A is a minor concern compared to the index explosion. Option C is wrong — tags aren't delta-encoded. Option D is wrong — most TSDBs accept dynamic tags.",
      interviewScript: "In your interview, say: 'Request IDs are high-cardinality — millions of unique values. Since tags are indexed in memory, each unique request_id × host × metric combination creates a series entry. This causes cardinality explosion: the in-memory tag index grows unbounded, eventually exhausting memory. Request IDs should be fields, not tags — you lose index-speed filtering but avoid catastrophic memory growth.'",
      proTip: "This is the single most common TSDB anti-pattern. Mention that InfluxDB and Prometheus both document this as a critical pitfall — it shows you've worked with real systems."
    },
    {
      id: "q21",
      category: "Data Model (Tags vs Fields)",
      tier: "heavy",
      question: "In a TSDB, a 'series' is defined as a unique combination of measurement + tags. Given the data point: cpu_usage,host=server-1,region=us-west,env=prod value=45.2 1700000000. If you add a new tag 'datacenter=dc1' to this same host's metrics going forward, what happens to the storage engine?",
      options: [
        { label: "A", text: "The existing series is updated with the new tag — all future data points join the original series with an additional tag attribute" },
        { label: "B", text: "A completely new series is created (cpu_usage,host=server-1,region=us-west,env=prod,datacenter=dc1). The old series still exists with its historical data. Queries spanning the tag change must union results from both series" },
        { label: "C", text: "The tag is added to the index but doesn't change the series identity — both old and new data points belong to the same series" },
        { label: "D", text: "The database rejects the write because tag schemas must be consistent within a measurement" }
      ],
      correct: 1,
      explanation: "Series identity is determined by the exact set of measurement + tags. Changing any tag creates a new series. The old series (without datacenter) retains its historical data. This means queries for host=server-1 will correctly find both series (the inverted index maps host=server-1 to both), but the results come from separate storage blocks that must be merged. This is important for capacity planning — tag schema changes multiply series count. Option A is wrong because series are immutable once defined. Option D is wrong — most TSDBs are schema-on-write.",
      interviewScript: "In your interview, say: 'Series identity is the exact measurement + tag set. Adding a tag creates a new series — the old series retains its history. This is important because tag schema changes multiply the series count, and queries spanning the change must union results from multiple series.'",
      proTip: null
    },
    {
      id: "q22",
      category: "Data Model (Tags vs Fields)",
      tier: "heavy",
      question: "Your team is debating whether 'latency_percentile' (p50, p95, p99) should be a tag or a field. The data looks like: http_latency,host=server-1,percentile=p99 value=230ms. What's the correct modeling decision and why?",
      options: [
        { label: "A", text: "Tag — you'll frequently filter by percentile ('show me all p99 latencies'), and there are only 3 distinct values (p50, p95, p99), so cardinality impact is minimal. The tag index enables efficient lookups" },
        { label: "B", text: "Field — percentiles are computed values that should be stored alongside the raw latency data, not used as dimensional metadata" },
        { label: "C", text: "Neither — store separate measurements: http_latency_p50, http_latency_p95, http_latency_p99, each as its own metric" },
        { label: "D", text: "Tag — but only if the cluster has enough memory to handle the additional series created by the percentile dimension" }
      ],
      correct: 0,
      explanation: "This is a good tag because: (1) you'll filter by it — 'show me all p99 latencies across hosts' is a common query, (2) cardinality is very low — only 3 values, so it triples the series count (acceptable), and (3) it enables efficient aggregation — querying all p99 values is a simple tag filter. Option B would make percentile queries require full scans. Option C works but loses the ability to compare percentiles in a single query. Option D's concern is valid but the cardinality (3 values) is trivially manageable.",
      interviewScript: "In your interview, say: 'Percentile should be a tag because it's low-cardinality (3 values) and you'll frequently filter by it. The decision framework is: use tags for metadata you'll filter by that has bounded, low cardinality. Use fields for the actual measured values or high-cardinality attributes.'",
      proTip: "The tag vs. field decision framework: Ask two questions — (1) Will I filter/group by this? (2) Is the cardinality bounded and low? If both yes → tag. If either no → field. Simple but powerful."
    },

    // === CARDINALITY PROBLEM ===
    {
      id: "q23",
      category: "Cardinality Problem",
      tier: "heavy",
      question: "A candidate proposes a TSDB for storing per-user behavior metrics: page_view,user_id=<UUID>,page=/dashboard value=1. The system has 10 million active users. Why will this design fail catastrophically?",
      options: [
        { label: "A", text: "UUIDs are too long for tag storage, exceeding the maximum tag value length" },
        { label: "B", text: "10 million unique user_id tags create 10 million+ series. The in-memory tag index for all user_id values consumes tens of gigabytes of RAM, and each write creates or updates a series entry. The TSDB becomes slower than Postgres for this workload" },
        { label: "C", text: "Page view events are discrete events, not continuous metrics, so the TSDB can't store them" },
        { label: "D", text: "The write throughput of 10 million user events would exceed the TSDB's ingestion capacity" }
      ],
      correct: 1,
      explanation: "This is the cardinality explosion problem. With 10M unique user_ids as tags, the in-memory index needs entries for each user × each page × each metric. The index alone could consume 10-50GB of RAM. Writes slow down because each new user_id creates a new series entry. The TSDB loses ALL its performance advantages — it becomes worse than a general-purpose database because it's paying the overhead of maintaining an enormous in-memory index that provides no benefit for high-cardinality lookups. Option C is wrong — TSDBs can store discrete events. Option D might be true but isn't the root cause.",
      interviewScript: "In your interview, say: 'This is the classic cardinality explosion. 10 million unique user_id tags mean 10 million+ series entries in the in-memory index. The TSDB's core optimization — the in-memory tag index — becomes its biggest liability. At this cardinality, a general-purpose database like Postgres or ClickHouse would actually outperform the TSDB.'",
      proTip: "The punchline from the content: 'If we make strong assumptions about our data and those assumptions are violated, the system becomes worse than a general-purpose database.' This principle applies broadly in system design."
    },
    {
      id: "q24",
      category: "Cardinality Problem",
      tier: "heavy",
      question: "Your Prometheus monitoring system has 50,000 series and uses ~500MB of RAM for the tag index. After a Kubernetes migration, pod names become tags (pods restart frequently with new names). Within a week, the series count explodes to 5 million and Prometheus OOMs. A team member suggests 'just add more memory.' Why is this NOT a sustainable solution?",
      options: [
        { label: "A", text: "Adding memory is expensive and has physical limits on a single machine" },
        { label: "B", text: "The series count grows unboundedly — every pod restart creates new series that are never cleaned up (the old pod's series still exist in the index). Adding memory only delays the inevitable OOM. The fix is to stop using ephemeral pod names as tags and use stable identifiers like deployment name or service name instead" },
        { label: "C", text: "Prometheus has a hard-coded limit on series count that can't be raised with more memory" },
        { label: "D", text: "The CPU cost of maintaining the tag index grows linearly with series count, so more memory doesn't help with query latency" }
      ],
      correct: 1,
      explanation: "This is a gotcha about TSDB cardinality with ephemeral identifiers. Pod names in Kubernetes are ephemeral — each restart generates a new name, creating a new series. The old pod's series never gets removed from the index (the data still exists in historical partitions). Over time, series count grows without bound. Adding memory delays the crash but doesn't fix the root cause. The correct fix is using stable, low-cardinality labels (deployment name, service name) instead of ephemeral pod names. Option A is true but doesn't explain WHY it's unsustainable. Option C is wrong for most Prometheus configurations. Option D is partially true but secondary to memory growth.",
      interviewScript: "In your interview, say: 'Ephemeral identifiers like Kubernetes pod names create unbounded series growth — each restart creates new series that are never reclaimed. Adding memory is a stopgap, not a fix. The solution is using stable, low-cardinality labels like deployment or service name. This is a known pitfall in Kubernetes observability.'",
      proTip: "This is one of the most common real-world TSDB operational failures. Prometheus's documentation specifically warns against high-cardinality labels. Mentioning this shows production experience."
    },
    {
      id: "q25",
      category: "Cardinality Problem",
      tier: "heavy",
      question: "Your team needs to build a system that aggregates and sorts metrics across millions of unique series — essentially a Top-K problem (e.g., 'which users have the highest error rates?'). A candidate proposes a TSDB because 'the data is time-series.' What's the fundamental issue with this proposal?",
      options: [
        { label: "A", text: "TSDBs can't perform sorting operations on metric values" },
        { label: "B", text: "TSDBs are optimized for querying within a specific series or a small set of series identified by tags. Sorting and aggregating across millions of series requires scanning all series and ranking them — the opposite of what TSDBs optimize for. A general-purpose database or stream processor would be more appropriate" },
        { label: "C", text: "The Top-K problem requires real-time computation, but TSDBs only support batch queries" },
        { label: "D", text: "TSDBs don't support the GROUP BY operations needed for aggregation" }
      ],
      correct: 1,
      explanation: "This is the content's explicit warning: 'just because you have time series data doesn't mean you need a TSDB.' TSDBs optimize for filtering to a specific series (via tag index) and then scanning that series efficiently. The Top-K problem requires the opposite — scanning ALL series, computing an aggregate for each, and sorting. TSDBs aren't designed for this cross-series aggregation at scale. A general-purpose columnar database (ClickHouse, BigQuery) or stream processor (Flink, Kafka Streams) would handle this better. Option A and D are wrong — TSDBs can sort and aggregate. Option C is wrong — TSDBs support both real-time and batch queries.",
      interviewScript: "In your interview, say: 'Having time-series data doesn't mean you need a TSDB. TSDBs optimize for querying specific series efficiently. Top-K requires aggregating across all series and ranking — the opposite access pattern. I'd reach for a columnar database like ClickHouse or a stream processor, which are designed for cross-series aggregation.'",
      proTip: "The content specifically warns about this — the Top-K problem 'seems like a TSDB would be helpful but can actually make the problem harder.' Citing this shows you understand the limits of the tool."
    },

    // === QUERY EXECUTION ===
    {
      id: "q26",
      category: "Query Execution",
      tier: "medium",
      question: "A query asks: SELECT mean(value) FROM cpu_usage WHERE host='server-1' AND time > now() - 1h GROUP BY time(5m). The database has data in both the in-memory buffer and on-disk SSTables. How are results from these two sources combined?",
      options: [
        { label: "A", text: "The buffer is flushed to disk first, then the query runs entirely on disk files for consistency" },
        { label: "B", text: "The query reads from the buffer (most recent data) and disk files (older data) concurrently, merging results. Aggregations are computed as a streaming operation — the database doesn't need to load all data into memory before computing the mean" },
        { label: "C", text: "The buffer is only used for writes; reads always go to disk after a short delay for the buffer to flush" },
        { label: "D", text: "The database maintains a separate read-optimized cache that is periodically synced from the buffer" }
      ],
      correct: 1,
      explanation: "The LSM architecture supports concurrent reads from both the in-memory buffer and disk. The buffer contains the most recent data that hasn't been flushed yet, while SSTables contain older flushed data. The query engine reads from both and merges results. Critically, aggregations are streaming — the database computes running sums and counts as it reads, without materializing all data points in memory. This is key for handling queries over billions of points. Option A would block writes during queries. Option C would miss the most recent data. Option D adds unnecessary complexity.",
      interviewScript: "In your interview, say: 'Queries read from both the in-memory buffer and disk SSTables, merging results. The buffer has the freshest data not yet flushed. Aggregations are computed as a streaming operation — the database maintains running statistics as it scans, so it doesn't need to load all data into memory.'",
      proTip: null
    },
    {
      id: "q27",
      category: "Query Execution",
      tier: "medium",
      question: "A TSDB stores data for 4 series in a file. A query with filter region='us-west' AND env='prod' needs data from 2 of these series. Using the tag index and file index, the database reads exactly 2 blocks, skipping the other 2. What property of the storage format makes this possible?",
      options: [
        { label: "A", text: "Data is stored row-by-row in timestamp order across all series, and the database uses a bitmap to skip rows from non-matching series" },
        { label: "B", text: "Each series' data is stored in its own contiguous block, and the file's index maps series keys to block offsets. The tag index identifies matching series, the file index locates their blocks, and only those blocks are read — two seeks regardless of file size" },
        { label: "C", text: "The database maintains a columnar store where all timestamps are in one column and all values in another, enabling column-level filtering" },
        { label: "D", text: "The file is sorted by tag values, so all 'us-west' data is physically adjacent and can be found via binary search" }
      ],
      correct: 1,
      explanation: "TSDB file format stores each series as a contiguous compressed block. The file ends with an index mapping series keys (measurement + tag combinations) to block offsets within the file. This means: (1) tag index → matching series IDs, (2) file index → block offsets for those series, (3) seek directly to those blocks. Two disk operations (index read + data block read) regardless of file size. Option A describes a row-store layout, which would require scanning all rows. Option C describes a columnar layout, which is different from series-oriented. Option D would break down with multi-tag filters.",
      interviewScript: "In your interview, say: 'The key design is series-oriented storage — each series gets its own contiguous block in the file, with an index mapping series keys to block offsets. This means a multi-tag query resolves to specific block locations via two lookups: tag index to find series, file index to find blocks. It's two disk ops regardless of file size.'",
      proTip: "This 'two-seek' access pattern is the fundamental design insight: series-oriented storage means writes organize data for the exact read pattern that queries need."
    },

    // === STORAGE ENGINE ARCHITECTURE ===
    {
      id: "q28",
      category: "Storage Engine Architecture",
      tier: "medium",
      question: "Your TSDB uses a Write-Ahead Log (WAL) before writing to the memtable. A colleague asks: 'If the memtable is in RAM and we're writing to the WAL on disk first, aren't we defeating the purpose of fast in-memory writes?' What's the correct explanation?",
      options: [
        { label: "A", text: "The WAL is optional and can be disabled for maximum write performance at the cost of durability" },
        { label: "B", text: "The WAL is an append-only sequential write — extremely fast, even on spinning disks. It provides crash recovery (replay the WAL to rebuild the memtable) without the random I/O penalty of traditional databases. The memtable provides fast reads and sorted organization, while the WAL provides durability" },
        { label: "C", text: "The WAL write is asynchronous — data goes to the memtable immediately and the WAL write happens in the background" },
        { label: "D", text: "The WAL only stores metadata about the write, not the actual data, so it's a small overhead" }
      ],
      correct: 1,
      explanation: "The WAL is append-only, so it's sequential I/O — the fastest possible disk access pattern. The write path is: (1) append to WAL (sequential disk write for durability), (2) write to memtable (RAM for fast access). If the database crashes, the memtable is lost but can be rebuilt by replaying the WAL. This gives you both durability and fast writes. Option A is sometimes true but doesn't explain why WAL is fast. Option C would risk data loss if the crash happens before the async write. Option D is wrong — the WAL stores the full data point.",
      interviewScript: "In your interview, say: 'The WAL is append-only — a sequential disk write, which is extremely fast. It provides durability: if the process crashes, we replay the WAL to rebuild the in-memory buffer. The key insight is that the WAL's sequential write pattern is orders of magnitude faster than the random I/O of traditional database updates.'",
      proTip: null
    },
    {
      id: "q29",
      category: "Storage Engine Architecture",
      tier: "medium",
      question: "The TSDB file format stores timestamps and values in separate blocks within a file (timestamps in one block with delta-of-delta encoding, values in another with XOR compression). A query asks for mean(value) over a time range. Why is separating timestamps from values an optimization for this query?",
      options: [
        { label: "A", text: "Separate blocks allow parallel decompression of timestamps and values on different CPU cores" },
        { label: "B", text: "Homogeneous data compresses much better — a block of all timestamps achieves better delta-of-delta compression than interleaved timestamp-value pairs. Similarly, a block of all float values achieves better XOR compression. Different data types benefit from different compression algorithms" },
        { label: "C", text: "Separating timestamps from values allows the database to skip reading timestamps entirely for value-only queries" },
        { label: "D", text: "The separation reduces memory usage because only one block needs to be in memory at a time" }
      ],
      correct: 1,
      explanation: "This is essentially columnar storage within each series block. Grouping all timestamps together enables delta-of-delta encoding to exploit their regular pattern. Grouping all float values together enables XOR compression to exploit their bit-level similarity. If timestamps and values were interleaved, neither compression algorithm could build up the patterns they exploit. Option A is a potential secondary benefit. Option C is wrong — the database needs timestamps for time filtering. Option D is partially true but not the primary reason.",
      interviewScript: "In your interview, say: 'Separating timestamps and values enables type-specific compression. Timestamps grouped together achieve excellent delta-of-delta compression because the regular intervals create zero-deltas. Float values grouped together achieve good XOR compression because adjacent values have similar bit patterns. Interleaving would break both compression strategies.'",
      proTip: "This is the same principle behind columnar databases like Parquet — homogeneous data within a column compresses dramatically better than heterogeneous row data. The TSDB applies this principle within each series block."
    },

    // === WHEN NOT TO USE A TSDB ===
    {
      id: "q30",
      category: "When NOT to Use a TSDB",
      tier: "thin",
      question: "A team is building a user analytics platform. They need to: (1) track page views per user, (2) compute Top-K most active users daily, (3) join user behavior with profile data from a relational database. A candidate proposes InfluxDB because 'all our data has timestamps.' What is the strongest counter-argument?",
      options: [
        { label: "A", text: "InfluxDB doesn't support SQL, making ad-hoc queries difficult for the analytics team" },
        { label: "B", text: "Per-user tracking creates high-cardinality tags (millions of user IDs), Top-K requires cross-series aggregation TSDBs aren't optimized for, and TSDBs have no JOIN capabilities. All three requirements violate TSDB assumptions — a general-purpose database like Postgres or a columnar store like ClickHouse would be better" },
        { label: "C", text: "InfluxDB can't handle the write throughput of a user analytics platform" },
        { label: "D", text: "TSDBs don't support transactions, which are needed for accurate page view counting" }
      ],
      correct: 1,
      explanation: "This maps each requirement to a TSDB limitation: (1) per-user tracking → cardinality explosion if user_id is a tag, no indexed filtering if it's a field, (2) Top-K → cross-series aggregation and sorting, the opposite of what TSDBs optimize for, (3) JOINs → TSDBs don't support relational joins. The content explicitly warns: 'stretch general-purpose solutions to fit your needs and only reach for specialized tech when you encounter a true bottleneck.' Option A is partially true (InfluxDB has its own query language) but not the strongest argument. Option C is wrong — InfluxDB handles high write throughput well. Option D is misleading — page view counting doesn't require transactions.",
      interviewScript: "In your interview, say: 'Having timestamped data doesn't mean you need a TSDB. This platform needs high-cardinality filtering, cross-series aggregation, and relational joins — all things TSDBs are specifically NOT optimized for. I'd start with Postgres or ClickHouse and only reach for a TSDB if I hit a bottleneck that can't be solved otherwise.'",
      proTip: "The content's best advice: 'stretch general-purpose solutions to fit your needs and only when you encounter a true bottleneck should you reach for specialized tech.' This principle applies far beyond TSDBs."
    },

    // === CROSS-SUBTOPIC BRIDGES ===
    {
      id: "q31",
      category: "LSM Trees × Bloom Filters",
      tier: "bridge",
      question: "In an LSM-based TSDB, Bloom filters are attached to each SSTable. During compaction, multiple SSTables are merged into one larger SSTable. What must happen to the Bloom filters during this process, and what's the operational trade-off?",
      options: [
        { label: "A", text: "The Bloom filters from the merged SSTables are combined using bitwise OR to create the new SSTable's filter, preserving all entries with zero additional overhead" },
        { label: "B", text: "A new Bloom filter must be built from scratch for the merged SSTable. This adds CPU and memory overhead during compaction, but the resulting single filter is more accurate than querying multiple smaller filters because one filter check replaces several" },
        { label: "C", text: "Bloom filters are discarded during compaction and lazily rebuilt on the first read — this avoids slowing down compaction" },
        { label: "D", text: "The old Bloom filters are kept in memory alongside the new SSTable's filter until the old SSTables are garbage collected" }
      ],
      correct: 1,
      explanation: "Bloom filters can't be meaningfully merged — the hash functions and bit arrays don't compose correctly via simple bitwise OR (different sizes, different hash configurations). A new Bloom filter must be constructed by hashing every key in the merged SSTable. This adds CPU cost to compaction, but the payoff is significant: after compaction, one Bloom filter check replaces the multiple checks that were needed before. This directly improves the read path. Option A is technically incorrect — Bloom filter union via OR only works with identical size and hash functions, and even then has degraded FPR. Option C would hurt read performance. Option D wastes memory.",
      interviewScript: "In your interview, say: 'During compaction, Bloom filters can't simply be merged — a new one must be built from scratch by hashing all keys in the merged SSTable. This adds CPU overhead to compaction, but the result is a single filter replacing multiple, which directly speeds up the read path. It's another form of the write amplification trade-off: spend work during compaction to benefit reads.'",
      proTip: null
    },
    {
      id: "q32",
      category: "Time-Based Partitioning × Downsampling",
      tier: "bridge",
      question: "Your TSDB uses daily time partitions and a downsampling policy: raw data for 7 days, then 1-minute rollups. A query asks for 'average CPU over the last 10 days.' How do these two mechanisms interact to serve this query?",
      options: [
        { label: "A", text: "The database reads all 10 daily partitions at raw resolution and computes the average — downsampling is only used for data older than 7 days" },
        { label: "B", text: "Time partitioning identifies the 10 relevant partitions. For the 7 most recent (raw data), the query scans full-resolution data. For the 3 oldest (downsampled), it reads pre-computed 1-minute rollup partitions. The query engine merges results from both resolution levels using the sum/count from rollups to compute accurate averages" },
        { label: "C", text: "The entire 10-day range is downsampled to 1-minute resolution first, then the average is computed uniformly" },
        { label: "D", text: "The query fails because it spans two different data resolution levels, requiring the user to issue two separate queries" }
      ],
      correct: 1,
      explanation: "Time-based partitioning and downsampling work together. Partitioning identifies which files to read (skip partitions outside the time range). Within those partitions, the query engine reads from whichever resolution is available: raw data for recent partitions, rollup data for older ones. Because rollups store sum and count (not just averages), the query engine can correctly compute the overall average by combining sum/count from rollups with raw values from recent data. Option A wastes work on data that doesn't exist at raw resolution. Option C would unnecessarily degrade recent data. Option D is wrong — modern TSDBs handle mixed-resolution queries transparently.",
      interviewScript: "In your interview, say: 'Time partitioning narrows to the 10 relevant partitions. The query engine reads raw data from the 7 recent partitions and rollup data from the 3 older ones, merging transparently. This works because rollups store sum and count, not just averages — so the overall average can be computed correctly across resolution boundaries.'",
      proTip: "This is why rollups MUST store sum and count (not just average). Average of averages is mathematically incorrect when window sizes differ. Storing sum/count enables correct recomputation."
    },
    {
      id: "q33",
      category: "Compression × Cardinality",
      tier: "bridge",
      question: "A TSDB achieves 1.37 bytes/value compression using XOR and delta-of-delta encoding. But when a team adds high-cardinality tags (like user_id), compression ratios degrade significantly — even though the actual metric values are the same. Why does tag cardinality affect value compression?",
      options: [
        { label: "A", text: "High-cardinality tags consume tag index memory, leaving less RAM for the compression buffer, forcing earlier flushes with smaller blocks" },
        { label: "B", text: "Each unique tag combination creates a separate series with its own compression context. High cardinality means millions of series, each with very few data points. XOR and delta-of-delta encoding work best with long sequences of values — short series can't build up the patterns these algorithms exploit, degrading compression dramatically" },
        { label: "C", text: "The tags themselves are stored uncompressed alongside the values, inflating the per-point storage cost" },
        { label: "D", text: "High-cardinality data violates the 'adjacent values are similar' assumption that XOR compression relies on" }
      ],
      correct: 1,
      explanation: "This is a subtle but critical interaction. Compression algorithms like XOR and delta-of-delta are stateful — they build up a compression context over sequences of values. With millions of series (from high-cardinality tags), each series has very few data points per block. A series with only 3 values can't exploit the patterns that make these algorithms effective. The 1.37 bytes/value figure comes from long sequences where patterns emerge. Option A is a secondary effect. Option C is partially true but tags are stored once per series, not per point. Option D is wrong — the values themselves haven't changed.",
      interviewScript: "In your interview, say: 'XOR and delta-of-delta compression are sequential algorithms that build efficiency over long value sequences. High-cardinality tags fragment data into millions of short series, each with few points. Short sequences can't establish the patterns these algorithms exploit, so compression degrades even though the underlying values are the same.'",
      proTip: null
    },
    {
      id: "q34",
      category: "Append-Only × LSM Trees × Query Execution",
      tier: "bridge",
      question: "Trace the complete lifecycle of a data point from ingestion to query in a TSDB. A metric arrives: cpu_usage,host=server-1 value=45.2. 10 minutes later, a dashboard queries this value. Put the following steps in the correct order: (1) WAL append, (2) SSTable flush, (3) Memtable insert, (4) Tag index update, (5) Query checks memtable, (6) Compaction merges SSTables",
      options: [
        { label: "A", text: "1→3→4→2→6→5: WAL first for durability, then memtable (sorted insert), then tag index update. Memtable flushes to SSTable when full. Compaction runs in background. Query checks memtable first for recent data" },
        { label: "B", text: "3→1→4→2→5→6: Memtable first for speed, WAL for async durability, then tag index. Flush and compact later" },
        { label: "C", text: "1→4→3→2→5→6: WAL, tag index, memtable — ensuring metadata is searchable before data is in memory" },
        { label: "D", text: "4→1→3→2→6→5: Tag index first so the series is discoverable, then WAL and memtable for storage" }
      ],
      correct: 0,
      explanation: "The write path is: WAL append (durability first — if we crash after this, we can recover), then memtable insert (in-memory sorted structure for fast reads), then tag index update (make the series discoverable). When the memtable fills, it flushes to an immutable SSTable. Compaction runs in the background merging SSTables. For the query 10 minutes later, if the data hasn't been flushed yet, it's found in the memtable. If flushed, it's in an SSTable. Option B is wrong because WAL must come before memtable for crash safety. Options C and D put tag indexing before memtable insertion, which is incorrect.",
      interviewScript: "In your interview, say: 'The write path is: WAL first for durability, then memtable for fast in-memory access, then tag index update. On flush, the sorted memtable becomes an immutable SSTable. Compaction merges SSTables in the background. Queries check the memtable first for recent data, then SSTables for older data.'",
      proTip: "This end-to-end trace is a powerful interview move. It shows you understand how all the pieces fit together, not just individual components."
    },
    {
      id: "q35",
      category: "Block Metadata × Partitioning × Query Execution",
      tier: "bridge",
      question: "A query asks: 'Find 1-minute windows where any production server's CPU exceeded 90% in the last week.' The database has 7 daily partitions, each with thousands of blocks. Describe how three different optimization layers work together to minimize disk I/O.",
      options: [
        { label: "A", text: "Layer 1: Time-based partitioning limits to 7 daily partitions (skips older data). Layer 2: Tag index filters to 'env=prod' series only (skips staging/dev blocks). Layer 3: Block-level metadata skips blocks where max < 90% (avoids decompressing blocks that can't contain spikes). Only blocks surviving all three filters are actually read and decompressed" },
        { label: "B", text: "Layer 1: Bloom filters check each partition for the 'prod' tag. Layer 2: Binary search within matching partitions finds the relevant time ranges. Layer 3: Block metadata provides the final filter" },
        { label: "C", text: "Layer 1: The query planner estimates which partitions have the most data and scans those first. Layer 2: Parallel scans across all partitions. Layer 3: Block-level metadata filters within each parallel scan" },
        { label: "D", text: "Layer 1: The inverted tag index provides all matching block offsets directly. Layer 2: Time filtering is applied post-read. Layer 3: Block metadata is checked after decompression" }
      ],
      correct: 0,
      explanation: "Three optimization layers stack: (1) Time-based partitioning eliminates data outside the query's time range entirely — no I/O for older partitions. (2) The tag index (inverted index) identifies only series matching env=prod, mapping to specific blocks — no I/O for non-production series. (3) Block-level metadata (min/max values) skips blocks where max CPU < 90% — no decompression for blocks that can't contain results. Each layer progressively narrows the data, and critically, all three checks happen BEFORE any data decompression. Option B misuses Bloom filters (they're for point lookups, not tag filtering). Option C doesn't leverage the tag index. Option D checks metadata after decompression, which is wrong.",
      interviewScript: "In your interview, say: 'Three optimization layers stack before any data decompression: time partitioning eliminates irrelevant time ranges, the tag index narrows to matching series, and block-level metadata skips blocks that can't contain values above 90%. Only blocks surviving all three filters are actually read from disk.'",
      proTip: "This layered optimization is the complete picture of why TSDBs are so fast for their target workload. Being able to articulate all three layers and how they stack is a strong staff-level signal."
    }
  ]
};

// Shuffle utility
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Group questions by category in content order
function groupByCategory(questions) {
  const order = [];
  const map = {};
  questions.forEach((q) => {
    if (!map[q.category]) {
      map[q.category] = [];
      order.push(q.category);
    }
    map[q.category].push(q);
  });
  return order.flatMap((cat) => map[cat]);
}

const TIMER_SECONDS = 90;

export default function TimeSeriesDatabasesQuiz({ quizSlug = 'advanced-time-series-databases' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [totalTimerActive, setTotalTimerActive] = useState(false);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);
  const totalTimerRef = useRef(null);



  // Timer logic
  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timerActive && timer === 0) {
      handleTimeout();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timer]);

  // Total timer
  useEffect(() => {
    if (totalTimerActive) {
      totalTimerRef.current = setInterval(() => setTotalTime((t) => t + 1), 1000);
    }
    return () => clearInterval(totalTimerRef.current);
  }, [totalTimerActive]);

  const startQuiz = useCallback((questionSet, quizMode) => {
    const qs = quizMode === "shuffled" ? shuffleArray(questionSet) : groupByCategory(questionSet);
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged(new Set());
    setSkipped([]);
    setSelected(null);
    setConfidence(null);
    setConfirmed(false);
    setTimer(TIMER_SECONDS);
    setTimerActive(true);
    setTotalTime(0);
    setTotalTimerActive(true);
    setScreen("quiz");
  }, []);

  const handleTimeout = useCallback(() => {
    setTimerActive(false);
    const q = questions[currentIdx];
    if (q && !confirmed) {
      setAnswers((prev) => ({ ...prev, [q.id]: { selected: -1, confidence: "timeout", correct: false, timedOut: true } }));
      setConfirmed(true);
    }
  }, [questions, currentIdx, confirmed]);

  const handleSelect = useCallback((idx) => {
    if (!confirmed) setSelected(idx);
  }, [confirmed]);

  const handleConfirm = useCallback(() => {
    if (selected === null || confidence === null) return;
    const q = questions[currentIdx];
    const correct = selected === q.correct;
    setAnswers((prev) => ({ ...prev, [q.id]: { selected, confidence, correct, timedOut: false } }));
    setConfirmed(true);
    setTimerActive(false);
  }, [selected, confidence, questions, currentIdx]);

  const handleNext = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelected(null);
      setConfidence(null);
      setConfirmed(false);
      setTimer(TIMER_SECONDS);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setTotalTimerActive(false);
      setScreen("results");
    }
  }, [currentIdx, questions, answers]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIdx];
    setSkipped((prev) => [...prev, q]);
    const remaining = questions.filter((_, i) => i !== currentIdx && !answers[questions[i]?.id] && !skipped.includes(questions[i]));
    // Move current question to end
    const newQuestions = [...questions.slice(0, currentIdx), ...questions.slice(currentIdx + 1), q];
    setQuestions(newQuestions);
    setSelected(null);
    setConfidence(null);
    setConfirmed(false);
    setTimer(TIMER_SECONDS);
    setTimerActive(true);
    if (currentIdx >= newQuestions.length) {
      setCurrentIdx(newQuestions.length - 1);
    }
  }, [currentIdx, questions, answers, skipped]);

  const handleFlag = useCallback(() => {
    const q = questions[currentIdx];
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  }, [questions, currentIdx]);

  // Keyboard shortcuts
  useEffect(() => {
    if (screen !== "quiz") return;
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (!confirmed) {
        if (["1", "a"].includes(key)) handleSelect(0);
        if (["2", "b"].includes(key)) handleSelect(1);
        if (["3", "c"].includes(key)) handleSelect(2);
        if (["4", "d"].includes(key)) handleSelect(3);
        if (key === "enter" && selected !== null && confidence !== null) handleConfirm();
      } else {
        if (key === "enter") handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, confirmed, selected, confidence, handleSelect, handleConfirm, handleNext]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // LANDING SCREEN
  if (screen === "landing") {
    const bd = QUIZ_DATA.subtopicBreakdown;
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> {QUIZ_DATA.difficulty}
            </div>
            <h1 className="text-3xl font-bold mb-2">{QUIZ_DATA.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{QUIZ_DATA.description}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {QUIZ_DATA.questions.length} questions</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {QUIZ_DATA.estimatedTime}</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Coverage Breakdown</h3>
            <div className="mb-3">
              <div className="text-xs font-medium text-red-400 mb-1.5">HEAVY (3-4 questions each)</div>
              <div className="flex flex-wrap gap-1.5">
                {bd.heavy.map((s) => (
                  <span key={s.name} className="bg-red-500/10 text-red-300 px-2 py-0.5 rounded text-xs">{s.name} ({s.count})</span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium text-amber-400 mb-1.5">MEDIUM (2 questions each)</div>
              <div className="flex flex-wrap gap-1.5">
                {bd.medium.map((s) => (
                  <span key={s.name} className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-xs">{s.name} ({s.count})</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-blue-400 mb-1.5">THIN (1 question each)</div>
              <div className="flex flex-wrap gap-1.5">
                {bd.thin.map((s) => (
                  <span key={s.name} className="bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded text-xs">{s.name} ({s.count})</span>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="text-xs font-medium text-purple-400 mb-1">+ 5 Cross-Subtopic Bridge Questions</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setMode("ordered"); startQuiz(QUIZ_DATA.questions, "ordered"); }}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 px-4 rounded-lg font-medium transition-colors text-sm"
            >
              Section Order
            </button>
            <button
              onClick={() => { setMode("shuffled"); startQuiz(QUIZ_DATA.questions, "shuffled"); }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm"
            >
              Shuffled (Recommended)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    const q = questions[currentIdx];
    const answer = answers[q.id];
    const isTimedOut = answer?.timedOut;
    const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-400";
    const timerBg = timer <= 15 ? "bg-red-500" : timer <= 30 ? "bg-amber-500" : "bg-indigo-500";
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {currentIdx + 1} / {questions.length}
            </div>
            <div className={`flex items-center gap-1 text-sm font-mono ${timerColor}`}>
              <Timer className="w-4 h-4" />
              {timer}s
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(totalTime)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
            <div className={`h-full ${timerBg} rounded-full transition-all duration-300`} style={{ width: `${progress}%` }} />
          </div>

          {/* Timer bar */}
          <div className="w-full h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div
              className={`h-full ${timerBg} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${(timer / TIMER_SECONDS) * 100}%` }}
            />
          </div>

          {/* Category tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs font-medium">{q.category}</span>
            <button onClick={handleFlag} className={`p-1 rounded transition-colors ${flagged.has(q.id) ? "text-amber-400" : "text-gray-600 hover:text-gray-400"}`}>
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Question */}
          <h2 className="text-lg font-medium mb-6 leading-relaxed">{q.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              let borderColor = "border-gray-800 hover:border-gray-600";
              let bg = "bg-gray-900";
              if (confirmed || isTimedOut) {
                if (idx === q.correct) { borderColor = "border-emerald-500"; bg = "bg-emerald-500/10"; }
                else if (idx === (answer?.selected ?? selected)) { borderColor = "border-red-500"; bg = "bg-red-500/10"; }
                else { borderColor = "border-gray-800"; bg = "bg-gray-900 opacity-50"; }
              } else if (idx === selected) {
                borderColor = "border-indigo-500"; bg = "bg-indigo-500/10";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={confirmed || isTimedOut}
                  className={`w-full text-left p-4 rounded-lg border ${borderColor} ${bg} transition-all duration-200`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-xs font-medium mt-0.5">
                      {opt.label}
                    </span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence selector */}
          {!confirmed && !isTimedOut && selected !== null && (
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2">How confident are you?</div>
              <div className="flex gap-2">
                {["Guessing", "Somewhat Sure", "Very Confident"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfidence(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      confidence === c
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!confirmed && !isTimedOut && (
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-sm transition-colors"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
              <button
                onClick={handleConfirm}
                disabled={selected === null || confidence === null}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selected !== null && confidence !== null
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Confirm Answer (Enter)
              </button>
            </div>
          )}

          {/* Feedback */}
          {(confirmed || isTimedOut) && (
            <div className="mt-6 space-y-4">
              {isTimedOut && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-1">
                    <Clock className="w-4 h-4" /> Time's up!
                  </div>
                  <p className="text-gray-400 text-sm">This question was marked as incorrect due to timeout.</p>
                </div>
              )}

              <div className={`rounded-lg p-4 border ${answer?.correct ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {answer?.correct ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className={`text-sm font-medium ${answer?.correct ? "text-emerald-400" : "text-red-400"}`}>
                    {answer?.correct ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Interview Script</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">{q.interviewScript}</p>
              </div>

              {q.proTip && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Pro Tip</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{q.proTip}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {currentIdx + 1 < questions.length ? "Next Question" : "View Results"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const totalQ = questions.length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const pct = Math.round((correctCount / totalQ) * 100);
    let grade, gradeColor;
    if (pct >= 90) { grade = "Staff-ready — you'd ace this topic"; gradeColor = "text-emerald-400"; }
    else if (pct >= 75) { grade = "Strong Senior — solid, minor gaps to close"; gradeColor = "text-blue-400"; }
    else if (pct >= 60) { grade = "SDE2-level — review the weak areas below"; gradeColor = "text-amber-400"; }
    else { grade = "Needs deep review — revisit the fundamentals"; gradeColor = "text-red-400"; }

    // Per-subtopic breakdown
    const subtopicStats = {};
    questions.forEach((q) => {
      if (!subtopicStats[q.category]) subtopicStats[q.category] = { total: 0, correct: 0 };
      subtopicStats[q.category].total++;
      if (answers[q.id]?.correct) subtopicStats[q.category].correct++;
    });

    // Confidence analysis
    const luckyGuesses = questions.filter((q) => answers[q.id]?.correct && answers[q.id]?.confidence === "Guessing");
    const overconfidentMisses = questions.filter((q) => !answers[q.id]?.correct && answers[q.id]?.confidence === "Very Confident");
    const incorrect = questions.filter((q) => !answers[q.id]?.correct);
    const flaggedQuestions = questions.filter((q) => flagged.has(q.id));

    // Weak subtopics (below 70%)
    const weakSubtopics = Object.entries(subtopicStats).filter(([_, s]) => (s.correct / s.total) < 0.7).map(([name]) => name);
    const weakQuestions = questions.filter((q) => weakSubtopics.includes(q.category));

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 border-2 border-gray-800 mb-4">
              <span className="text-3xl font-bold">{pct}%</span>
            </div>
            <h2 className="text-xl font-bold mb-1">{correctCount} / {totalQ} Correct</h2>
            <p className={`text-sm font-medium ${gradeColor}`}>{grade}</p>
            <p className="text-xs text-gray-500 mt-2">Total time: {formatTime(totalTime)}</p>
          </div>

          {/* Subtopic breakdown */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Subtopic Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(subtopicStats).map(([name, stats]) => {
                const p = Math.round((stats.correct / stats.total) * 100);
                const barColor = p >= 80 ? "bg-emerald-500" : p >= 60 ? "bg-amber-500" : "bg-red-500";
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">{name}</span>
                      <span className="text-gray-500">{stats.correct}/{stats.total} ({p}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence analysis */}
          {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
            <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Confidence Analysis</h3>
              {luckyGuesses.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-amber-400 mb-2">Lucky Guesses — correct but you were guessing ({luckyGuesses.length})</div>
                  {luckyGuesses.map((q) => (
                    <div key={q.id} className="text-xs text-gray-400 mb-1 pl-3 border-l border-amber-500/30">
                      {q.question.slice(0, 100)}...
                    </div>
                  ))}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-red-400 mb-2">Overconfident Misses — wrong but you were very confident ({overconfidentMisses.length})</div>
                  {overconfidentMisses.map((q) => (
                    <div key={q.id} className="text-xs text-gray-400 mb-1 pl-3 border-l border-red-500/30">
                      {q.question.slice(0, 100)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Incorrect questions */}
          {incorrect.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> Missed Questions ({incorrect.length})</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incorrect.map((q) => (
                  <div key={q.id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="text-xs text-indigo-400 mb-1">{q.category}</div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      Your answer: <span className="text-red-400">{q.options[answers[q.id]?.selected]?.label || "Timed out"}</span> · Correct: <span className="text-emerald-400">{q.options[q.correct].label}</span>
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged questions */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><Flag className="w-4 h-4 text-amber-400" /> Flagged for Review ({flaggedQuestions.length})</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {flaggedQuestions.map((q) => (
                  <div key={q.id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="text-xs text-indigo-400 mb-1">{q.category}</div>
                    <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      Your answer: <span className={answers[q.id]?.correct ? "text-emerald-400" : "text-red-400"}>{q.options[answers[q.id]?.selected]?.label || "Timed out"}</span> · Correct: <span className="text-emerald-400">{q.options[q.correct].label}</span>
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mb-8">
            {incorrect.length > 0 && (
              <button
                onClick={() => startQuiz(incorrect, mode)}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry Missed Questions ({incorrect.length})
              </button>
            )}
            {weakQuestions.length > 0 && weakQuestions.length !== incorrect.length && (
              <button
                onClick={() => startQuiz(weakQuestions, mode)}
                className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" /> Retry Weak Subtopics ({weakQuestions.length} questions)
              </button>
            )}
            <button
              onClick={() => startQuiz(QUIZ_DATA.questions, mode)}
              className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake Full Quiz
            </button>
            <button
              onClick={() => setScreen("landing")}
              className="w-full py-2.5 text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
