// === COVERAGE MANIFEST ===
// Content type: deep pattern (single technology deep-dive with algorithms, architecture, and practical guidance)
//
// HEAVY subtopics:
//   HNSW (Hierarchical Navigable Small World) — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Nested: Multi-layer graph structure — covered by: [q1]
//     └─ Nested: Search traversal & greedy navigation — covered by: [q2]
//     └─ Nested: Memory overhead & build cost — covered by: [q3]
//     └─ Nested: Insert complexity & graph degradation — covered by: [q4]
//   Filtering & Hybrid Search — Questions: 4 — IDs: [q5, q6, q7, q8]
//     └─ Nested: Pre-filter vs post-filter tradeoffs — covered by: [q5]
//     └─ Nested: pgvector query planner behavior — covered by: [q6]
//     └─ Nested: Elasticsearch kNN filtered traversal — covered by: [q7]
//     └─ Nested: Hybrid keyword + vector search — covered by: [q8]
//   Inserts, Updates & Index Maintenance — Questions: 3 — IDs: [q9, q10, q11]
//     └─ Nested: Hot/cold index pattern — covered by: [q9]
//     └─ Nested: Soft deletes & compaction — covered by: [q10]
//     └─ Nested: Index rebuild strategies — covered by: [q11]
//   Architecture Patterns & Interview Usage — Questions: 4 — IDs: [q12, q13, q14, q15]
//     └─ Nested: Pattern 1 (separate service) vs Pattern 2 (hybrid) vs Pattern 3 (two-stage) — covered by: [q12, q13]
//     └─ Nested: Consistency requirements — covered by: [q14]
//     └─ Nested: When to use purpose-built vs extension — covered by: [q15]
//
// MEDIUM subtopics:
//   Vectors & Embeddings Fundamentals — Questions: 2 — IDs: [q16, q17]
//   Similarity Metrics — Questions: 2 — IDs: [q18, q19]
//   IVF (Inverted File Index) — Questions: 2 — IDs: [q20, q21]
//   LSH (Locality Sensitive Hashing) — Questions: 2 — IDs: [q22, q23]
//   Annoy (Random Projection Trees) — Questions: 2 — IDs: [q24, q25]
//   Vector DB Options & Selection — Questions: 2 — IDs: [q26, q27]
//   Numbers to Know — Questions: 2 — IDs: [q28, q29]
//   Gotchas & Limitations — Questions: 2 — IDs: [q30, q31]
//
// THIN subtopics (standalone):
//   Exact KNN & Brute Force — Questions: 1 — IDs: [q32]
//   ANN Recall Metric — Questions: 1 — IDs: [q33]
//   Embedding Drift — Questions: 1 — IDs: [q34]
//   Cold Start Problem — Questions: 1 — IDs: [q35]
//
// THIN subtopics (clustered):
//   Cluster: SIMD/GPU Optimization + Exact vs Approximate tradeoff — Questions: 1 — IDs: [q36]
//   Cluster: Common Interview Scenarios (RAG, Semantic Search, Dedup) — Questions: 1 — IDs: [q37]
//
// CROSS-SUBTOPIC bridges:
//   HNSW × Inserts/Maintenance — IDs: [q4]
//   Filtering × Architecture Patterns — IDs: [q38]
//   Similarity Metrics × Embedding Model Selection — IDs: [q19]
//   Index Type × Scale Decision — IDs: [q39]
//   Hot/Cold Index × Consistency Requirements — IDs: [q40]
//
// Anti-pattern questions: 4 — IDs: [q10, q15, q31, q34]
// Gotcha/trap questions: 4 — IDs: [q6, q23, q28, q36]
//
// Total: 40 questions across 16 subtopics (4 heavy, 8 medium, 4+2 thin)
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, ChevronRight, Flag, SkipForward, RotateCcw, CheckCircle, XCircle, AlertTriangle, Brain, Zap, BookOpen, Trophy, Target, TrendingUp, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const QUESTIONS = [
  // q1 — HNSW: Multi-layer graph structure
  {
    id: "q1",
    subtopic: "HNSW",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "You're building a semantic search system for 50 million product listings. Your HNSW index has 5 layers. During a query, the search enters Layer 3 and finds a node whose nearest neighbor at that layer is 0.15 cosine distance from the query vector, but the true nearest neighbor in the dataset is 0.02 away and exists only in Layer 0. What property of HNSW's design ensures this query still has a high probability of finding the true nearest neighbor?",
    options: [
      { label: "A", text: "Layer 3's greedy search will eventually reach every node in the graph through edge traversal, guaranteeing exact results" },
      { label: "B", text: "The hierarchical drop-down mechanism means Layer 3 narrows to the right region, and Layer 0's dense connectivity enables thorough local exploration to find the true nearest neighbor" },
      { label: "C", text: "HNSW maintains back-pointers from lower layers to upper layers, allowing the search to backtrack if a better candidate is found" },
      { label: "D", text: "Each layer independently runs a full KNN search, and results are merged across all layers to maximize recall" }
    ],
    correct: 1,
    confidence: null,
    explanation: "HNSW's power comes from its hierarchical navigation: upper sparse layers provide long-range jumps to approximate the right neighborhood, while the dense bottom layer (Layer 0) has enough connections to thoroughly explore the local region. The greedy search at each layer doesn't guarantee finding the exact nearest neighbor at that layer, but by dropping to increasingly dense layers, the search converges on the true nearest neighbor. Option A is wrong because greedy search is local, not exhaustive. Option C fabricates back-pointers that don't exist. Option D incorrectly describes independent searches per layer.",
    interviewScript: "In your interview, say: 'HNSW works like skip lists for vector space. The sparse upper layers let us quickly zoom into the right neighborhood—think of them as express lanes. Once we drop to Layer 0 where all vectors live with dense local connections, we do a thorough greedy exploration. The upper layers don't need to be precise; they just need to get us close enough that Layer 0's local search finds the actual nearest neighbors.'",
    proTip: "When discussing HNSW, mentioning the skip list analogy immediately signals deep understanding. Most candidates just say 'it's a graph' without explaining the hierarchical navigation that makes it O(log n)."
  },
  // q2 — HNSW: Search traversal
  {
    id: "q2",
    subtopic: "HNSW",
    tier: "Heavy",
    style: "Failure analysis",
    question: "Your HNSW index serves 50,000 QPS for a recommendation engine. You notice that recall has dropped from 96% to 82% over the past month, even though no configuration changes were made. The dataset grew from 10M to 15M vectors during this period, all via real-time inserts. What is the most likely root cause?",
    options: [
      { label: "A", text: "The similarity metric drifted because new vectors have different magnitude distributions than the original dataset" },
      { label: "B", text: "Newly inserted vectors have fewer and lower-quality graph connections compared to vectors present during the initial index build, degrading navigability" },
      { label: "C", text: "The HNSW index automatically reduced the number of layers to accommodate the larger dataset, reducing search precision" },
      { label: "D", text: "Memory pressure from the 50% growth caused the OS to swap index pages to disk, increasing latency and causing timeout-based result truncation" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is a well-documented HNSW degradation pattern. Vectors inserted after the initial build can only connect to vectors that already exist in the graph. They miss connections to vectors that were inserted later but happen to be nearby. Over time, this creates 'poorly connected' regions where the greedy search gets stuck in local minima. The original vectors had the benefit of the full build process which optimizes connections globally. Option A is plausible but wouldn't cause this specific recall degradation pattern. Option C is fabricated—HNSW doesn't reduce layers. Option D describes a performance issue, not a recall issue.",
    interviewScript: "In your interview, say: 'HNSW graphs degrade with incremental inserts because new vectors can only connect to existing nodes, missing optimal connections to future inserts. This creates poorly-connected regions that trap the greedy search. The solution is periodic index rebuilds to re-optimize the graph structure, often using a hot/cold index pattern.'",
    proTip: "This is exactly why production systems use the hot/cold index pattern—mentioning this follow-up unprompted shows you understand the operational reality, not just the algorithm."
  },
  // q3 — HNSW: Memory overhead
  {
    id: "q3",
    subtopic: "HNSW",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "You need to serve vector search over 20 million vectors with 1536 dimensions using float32. Your infrastructure team asks how much RAM to provision for the HNSW index. Which estimate is closest, and why do the other estimates fail?",
    options: [
      { label: "A", text: "~120 GB — raw vectors are ~115 GB and HNSW overhead is minimal since it only stores edge lists as integer IDs" },
      { label: "B", text: "~240 GB — raw vectors are ~115 GB and HNSW roughly doubles memory due to the multi-layer graph structure storing edges at each layer" },
      { label: "C", text: "~60 GB — vector quantization is applied by default in HNSW implementations, reducing each dimension to 1 byte" },
      { label: "D", text: "~500 GB — each of the ~5 HNSW layers stores a complete copy of all vectors plus edge metadata" }
    ],
    correct: 1,
    confidence: null,
    explanation: "Raw vectors: 20M × 1536 × 4 bytes = ~115 GB. HNSW adds significant overhead for the graph structure—each vector stores edges to its neighbors at each layer it appears in. The typical rule of thumb is that HNSW roughly doubles memory requirements. Option A underestimates by ignoring the substantial graph overhead (each node has ~16-64 edges, each stored as integer IDs plus layer metadata). Option C is wrong because HNSW doesn't apply quantization by default—that's a separate technique (PQ). Option D incorrectly assumes each layer stores all vectors; only Layer 0 has all vectors, upper layers have exponentially fewer.",
    interviewScript: "In your interview, say: 'Let me do the math. 20 million vectors at 1536 dimensions, 4 bytes each—that's about 115 GB just for raw vectors. HNSW roughly doubles that because of the graph structure—edge lists, layer assignments, and connection metadata. So we're looking at around 230-240 GB of RAM. This is a key reason why HNSW is memory-hungry compared to approaches like IVF.'",
    proTip: "Always do the memory math out loud in interviews. It demonstrates you can reason about infrastructure costs, and the '4 bytes × dimensions × vector count' formula plus 'HNSW doubles it' is a quick way to impress."
  },
  // q4 — HNSW × Inserts/Maintenance (bridge)
  {
    id: "q4",
    subtopic: "HNSW",
    tier: "Heavy",
    style: "Cross-subtopic bridge",
    question: "Your team runs a real-time recommendation system with an HNSW index. Product listings are added and removed throughout the day (~100K changes/day). A junior engineer proposes handling deletes by removing nodes and their edges from the HNSW graph immediately. What is the most critical problem with this approach?",
    options: [
      { label: "A", text: "Removing a node can disconnect the graph, creating isolated subgraphs where vectors become unreachable during search, catastrophically dropping recall for those regions" },
      { label: "B", text: "The deletion is O(n) because you must scan every edge in the graph to find and remove references to the deleted node" },
      { label: "C", text: "HNSW doesn't support any form of deletion; the only option is a full index rebuild" },
      { label: "D", text: "Immediate deletion causes the layer promotion probabilities to become unbalanced, making upper layers too sparse for efficient navigation" }
    ],
    correct: 0,
    confidence: null,
    explanation: "The most dangerous failure mode is graph disconnection. In HNSW, some nodes serve as critical 'bridge' connections between regions of the graph. Removing such a node and its edges can create isolated subgraphs where the greedy search can never reach—those vectors effectively vanish from search results. This is why most systems use soft deletes (marking as deleted, skipping during search) rather than hard deletes. Option B overstates the complexity—you can find edges in O(degree). Option C is wrong; deletions are possible, just risky. Option D misunderstands how layers work.",
    interviewScript: "In your interview, say: 'Hard deletes in HNSW are dangerous because removing a node can disconnect the graph—some nodes act as bridges between regions. If a bridge node is deleted, entire clusters of vectors become unreachable. That's why production systems use soft deletes, marking vectors as deleted but keeping their edges intact. You then compact during periodic index rebuilds.'",
    proTip: "This is a great place to mention the hot/cold index pattern: soft deletes accumulate in the 'cold' index until a rebuild merges them out."
  },
  // q5 — Filtering: Pre vs Post filter
  {
    id: "q5",
    subtopic: "Filtering & Hybrid Search",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "You're building a product search for an e-commerce platform with 5 million products. A user searches 'comfortable office chair' with a filter for 'in_stock = true AND price < $500'. Historical data shows 60% of products match this filter combination. Which filtering strategy minimizes overall latency while maintaining high recall?",
    options: [
      { label: "A", text: "Pre-filter to the 60% matching products, then run exact KNN on the filtered set since it's small enough" },
      { label: "B", text: "Post-filter: retrieve top-5000 by vector similarity, then apply filters, hoping enough survive to fill the result page" },
      { label: "C", text: "Hybrid: run vector search with filtering integrated into the HNSW traversal, expanding exploration when filtered candidates are insufficient" },
      { label: "D", text: "Pre-filter to create a temporary HNSW index on the 3 million matching products, then run ANN search on that index" }
    ],
    correct: 2,
    confidence: null,
    explanation: "With 60% selectivity, the filter isn't particularly restrictive, making pure pre-filter wasteful (you'd still search 3M vectors) and post-filter risky (losing 40% of top candidates could degrade result quality). Hybrid approaches that integrate filtering into the ANN traversal—like Elasticsearch's approach—explore more of the graph when filtered candidates are sparse, maintaining recall without the overhead of searching the entire filtered set. Option A's exact KNN on 3M vectors is too slow. Option B's post-filter risks insufficient results if top candidates are disproportionately out-of-stock. Option D is absurd—building a temporary HNSW index takes hours.",
    interviewScript: "In your interview, say: 'The optimal approach depends on filter selectivity. At 60% match rate, I'd use hybrid filtering integrated into the ANN traversal—this dynamically explores more graph nodes when filtered candidates are sparse. Pure pre-filter at this selectivity still leaves 3 million vectors to search, and pure post-filter risks losing too many top results. The key insight is that filter selectivity determines the strategy.'",
    proTip: null
  },
  // q6 — Filtering: pgvector gotcha
  {
    id: "q6",
    subtopic: "Filtering & Hybrid Search",
    tier: "Heavy",
    style: "Gotcha/trap",
    question: "A team using pgvector writes this query: `SELECT * FROM products WHERE category = 'electronics' AND price < 100 ORDER BY embedding <-> query_embedding LIMIT 10`. Only 0.5% of products match the WHERE clause. The query is surprisingly fast despite the 10 million row table. A teammate says 'the HNSW index must be doing filtered traversal.' Why is this explanation wrong?",
    options: [
      { label: "A", text: "pgvector doesn't support HNSW, only IVF indexes, so the traversal mechanism is fundamentally different" },
      { label: "B", text: "pgvector relies on PostgreSQL's query planner, which for highly selective filters skips the vector index entirely and does brute-force similarity on the small filtered set using B-tree indexes first" },
      { label: "C", text: "The HNSW index pre-computes filtered results for common filter combinations, so it's using a cached result set" },
      { label: "D", text: "pgvector's HNSW implementation does perform filtered traversal, and the teammate's explanation is actually correct" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is a key pgvector gotcha. Unlike Elasticsearch or Pinecone, pgvector doesn't do true filtered HNSW traversal. It relies on PostgreSQL's standard query planner to choose between the vector index and other indexes. For highly selective filters (0.5% = ~50K rows from 10M), the planner correctly chooses to use the B-tree index on category/price first, reducing to 50K rows, then does brute-force vector distance computation on just those rows—which is fast. The query is fast not because of clever vector indexing, but because Postgres is good at filter-first strategies. Option A is wrong—pgvector does support HNSW. Options C and D are fabricated.",
    interviewScript: "In your interview, say: 'pgvector has an important limitation: it doesn't do filtered HNSW traversal. It relies on PostgreSQL's query planner to choose between the vector index and traditional indexes. For highly selective filters, the planner often skips the vector index entirely and does brute-force similarity on the pre-filtered rows. This works great for very selective or very unselective filters, but can produce suboptimal plans when selectivity is in the awkward middle range.'",
    proTip: "This 'awkward middle ground' for pgvector filter selectivity is a great nuance to mention—it shows you understand operational limitations, not just theoretical capabilities."
  },
  // q7 — Filtering: Elasticsearch kNN
  {
    id: "q7",
    subtopic: "Filtering & Hybrid Search",
    tier: "Heavy",
    style: "Failure analysis",
    question: "Your Elasticsearch cluster serves vector search for a job matching platform. Recruiters filter by 'location = San Francisco AND experience_years >= 5 AND is_actively_looking = true'. Only 0.1% of candidate profiles match all three filters. Searches are taking 3-5 seconds instead of the expected 50ms. What explains this?",
    options: [
      { label: "A", text: "ES needs to shard the vector index by filter dimensions, and without filter-specific shards, it falls back to scatter-gather across all shards" },
      { label: "B", text: "ES applies filters during HNSW traversal, and with only 0.1% match rate, the search must traverse vastly more of the graph to accumulate enough filtered results, dramatically increasing latency" },
      { label: "C", text: "ES's vector search doesn't support compound filters—it can only filter on a single field, so the three-field filter forces a full scan" },
      { label: "D", text: "The candidate embeddings are too high-dimensional for ES's kNN implementation, causing slow distance computations" }
    ],
    correct: 1,
    confidence: null,
    explanation: "Elasticsearch integrates filtering into its kNN traversal—it doesn't pre-filter or post-filter, but applies filters as it explores the HNSW graph. When the filter is extremely restrictive (0.1%), the search must visit far more graph nodes to find K candidates that pass the filter. Imagine needing 10 results but only 1 in 1000 HNSW nodes passes your filter—you might need to explore 10,000+ nodes instead of the typical 100-200. This is the inherent tradeoff of filtered traversal with restrictive filters. Option A fabricates a sharding requirement. Option C is wrong—ES supports compound filters. Option D is unrelated.",
    interviewScript: "In your interview, say: 'Elasticsearch does filtered HNSW traversal, which is elegant but has a known weakness: highly restrictive filters force the search to explore many more graph nodes to find enough matching results. With a 0.1% match rate, you might need to visit 1000x more nodes than an unfiltered search. The fix is either to relax the filter, increase the candidate pool, or pre-filter if the filter is this selective.'",
    proTip: null
  },
  // q8 — Filtering: Hybrid keyword + vector
  {
    id: "q8",
    subtopic: "Filtering & Hybrid Search",
    tier: "Heavy",
    style: "Multi-hop reasoning",
    question: "You're designing search for a legal document platform. Users search with queries like 'breach of fiduciary duty in Delaware LLC'. Your team debates: keyword-only (BM25), vector-only (semantic), or hybrid. A senior engineer argues that hybrid search will always outperform either approach alone. What's the strongest counterargument?",
    options: [
      { label: "A", text: "Hybrid search doubles the infrastructure cost since you need both a text search index and a vector index, and the marginal quality improvement rarely justifies the cost" },
      { label: "B", text: "For legal search, exact terminology matters enormously—'fiduciary' has precise legal meaning that semantic embeddings may dilute by returning conceptually similar but legally distinct results, making keyword search potentially superior alone" },
      { label: "C", text: "Hybrid search requires a ranking fusion algorithm to merge results, and no fusion algorithm can perfectly combine fundamentally different relevance signals without domain-specific tuning that may not generalize" },
      { label: "D", text: "Vector embeddings can't encode domain-specific legal terminology because embedding models are trained on general text corpora" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The strongest counterargument is domain-specific: in legal search, precision of terminology is paramount. 'Breach of fiduciary duty' has a specific legal meaning distinct from 'violation of trust obligations' even though they're semantically similar. A semantic search might return the latter, which could be legally wrong. For domains where exact terminology carries precise meaning (legal, medical, regulatory), keyword search can outperform semantic search because it respects the exact terms used. Option C has merit but is weaker—fusion algorithms are well-studied. Option D is wrong—embeddings can encode domain terms, especially with fine-tuning. Option A focuses on cost rather than quality.",
    interviewScript: "In your interview, say: 'Hybrid search isn't always better. In domains like legal search, exact terminology carries precise meaning—'fiduciary duty' is legally distinct from semantically similar phrases. Semantic search might dilute this precision by returning conceptually related but legally incorrect results. The choice depends on whether your users need semantic understanding or terminological precision.'",
    proTip: null
  },
  // q9 — Inserts: Hot/cold pattern
  {
    id: "q9",
    subtopic: "Inserts, Updates & Index Maintenance",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "Your recommendation system processes 500K new product embeddings daily into an HNSW index of 100M vectors. You implement a hot/cold index pattern where the hot index is a flat (brute-force) list. At what approximate hot index size does this pattern start to degrade query latency noticeably, and why?",
    options: [
      { label: "A", text: "~1,000 vectors — even small brute-force lists add measurable latency because each query must scan them entirely" },
      { label: "B", text: "~100,000 vectors — at this point the brute-force scan of the hot index takes comparable time to the HNSW search of the cold index, roughly doubling query latency" },
      { label: "C", text: "~10 million vectors — brute-force search is efficient with SIMD instructions, so it doesn't become a bottleneck until the hot index is very large" },
      { label: "D", text: "The hot index size doesn't matter because queries only search one index at a time based on the vector's insertion timestamp" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The hot/cold pattern requires searching BOTH indexes and merging results. An HNSW search over 100M vectors typically takes 1-5ms due to logarithmic complexity. A brute-force scan's cost is linear in the number of vectors. At ~100K vectors with 1536 dimensions, brute-force takes roughly 1-3ms (with SIMD optimization), which is comparable to the HNSW search time, effectively doubling query latency. At 1K vectors the brute-force cost is negligible. At 10M vectors it would be catastrophic. Option D is wrong—you must search both to ensure you find the true nearest neighbors across the full dataset.",
    interviewScript: "In your interview, say: 'With a hot/cold pattern, queries search both indexes and merge results. The hot index uses brute-force, so its cost is linear. Once the hot index grows to around 100K vectors, the brute-force scan takes as long as the HNSW search of the cold index, doubling latency. This gives us our rebuild frequency: merge hot into cold before it hits that threshold. At 500K inserts per day, that means rebuilding roughly every few hours.'",
    proTip: null
  },
  // q10 — Inserts: Soft deletes anti-pattern
  {
    id: "q10",
    subtopic: "Inserts, Updates & Index Maintenance",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate designs a content moderation system where flagged content embeddings are 'deleted' from the vector index. They implement hard deletes that remove the vector and all its edges from the HNSW graph, then say 'deletions happen in real-time, maintaining index freshness.' What is the most critical flaw in this design?",
    options: [
      { label: "A", text: "Hard deletes are slow (O(n) per delete) and will create a write bottleneck for the moderation pipeline" },
      { label: "B", text: "Hard deletes can fragment the HNSW graph by removing bridge nodes, causing recall degradation for vectors in the disconnected regions — soft deletes with periodic compaction is safer" },
      { label: "C", text: "The moderation system should delete from the primary database, not the vector index — the vector index should be treated as a derived view" },
      { label: "D", text: "HNSW indexes are append-only and do not support any deletion mechanism" }
    ],
    correct: 1,
    confidence: null,
    explanation: "Hard deleting nodes from an HNSW graph risks disconnecting the graph. Some nodes serve as critical navigational bridges — removing them creates isolated subgraphs where the greedy search can't reach, silently dropping recall for those regions. The correct approach is soft deletes (mark as deleted, skip during search) with periodic index rebuilds that compact out deleted entries. Option A overstates the write cost. Option C has a valid point but misses the critical failure mode. Option D is wrong — deletions are possible, just dangerous.",
    interviewScript: "In your interview, say: 'I'd flag this as a critical design issue. Hard deletes in HNSW can disconnect the graph — some nodes are navigational bridges, and removing them silently kills recall for nearby vectors. The standard practice is soft deletes: mark the vector as deleted so search skips it, but keep its edges intact for graph connectivity. Then compact during scheduled index rebuilds.'",
    proTip: null
  },
  // q11 — Inserts: Index rebuild
  {
    id: "q11",
    subtopic: "Inserts, Updates & Index Maintenance",
    tier: "Heavy",
    style: "Interviewer pushback",
    question: "You propose a rolling rebuild strategy for your HNSW index: build a new index in the background, then swap it in atomically. Your interviewer pushes back: 'Building an HNSW index over 50 million vectors takes 4 hours. What happens to the vectors inserted during those 4 hours?' What's the strongest response?",
    options: [
      { label: "A", text: "Buffer inserts during the rebuild window and apply them all at once after the new index is live — the 4-hour delay in searchability is acceptable for most use cases" },
      { label: "B", text: "Maintain the hot index for new inserts during the rebuild. When the new cold index goes live, the hot index only contains 4 hours of vectors, keeping it small. Queries always search both." },
      { label: "C", text: "Use a streaming rebuild that processes new inserts into the new index as they arrive during the build process, ensuring zero delay" },
      { label: "D", text: "Partition the index into shards and rebuild one shard at a time, so only a fraction of vectors are briefly unavailable" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The hot/cold pattern elegantly solves this. During the rebuild, new inserts go to the hot index. Queries search both the old cold index and the hot index. When the new cold index is ready, you swap it in and reset the hot index to empty (or to just the vectors inserted since the rebuild started). The hot index stays small (4 hours of inserts) so brute-force search is fast. Option A creates an unacceptable 4-hour searchability gap. Option C sounds nice but is impractical — you'd be modifying the index during its own build. Option D makes vectors unavailable, which the hot/cold pattern avoids.",
    interviewScript: "In your interview, say: 'I'd use the hot/cold index pattern during rebuilds. New inserts go to a small hot index that we brute-force search. The cold index rebuild happens in the background on the current snapshot. When it's done, we swap in the new cold index, and the hot index resets to just the inserts that arrived since the rebuild started. Queries always search both, so there's zero searchability gap.'",
    proTip: null
  },
  // q12 — Architecture: Patterns
  {
    id: "q12",
    subtopic: "Architecture Patterns",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "You're designing a video recommendation system for a streaming platform. The system needs to: (1) embed user watch history into a query vector, (2) find 1000 candidate videos by similarity, (3) rerank candidates using a model that considers freshness, user demographics, and content maturity rating. Which architecture pattern fits best?",
    options: [
      { label: "A", text: "Pattern 1 (Vector DB as separate service): Send the query vector to the vector service, get back 1000 IDs, fetch full metadata from the primary DB, apply the reranking model" },
      { label: "B", text: "Pattern 2 (Hybrid search): Combine keyword search on video titles with vector similarity on embeddings, merge results with a ranking function" },
      { label: "C", text: "Pattern 3 (Two-stage retrieval): Vector search returns 1000 candidates, then a separate reranking model scores them using features the embedding doesn't capture (freshness, demographics, maturity)" },
      { label: "D", text: "Skip vector search entirely — use collaborative filtering on the user-item interaction matrix, which directly captures watch patterns without needing embeddings" }
    ],
    correct: 2,
    confidence: null,
    explanation: "Pattern 3 (two-stage retrieval) is the natural fit here. The first stage uses vector similarity for fast candidate generation (1000 from millions). The second stage applies a richer reranking model that uses features the embedding can't capture — freshness, demographics, and content ratings. This is the standard architecture for production recommendation systems. Option A is incomplete — it fetches metadata but doesn't describe the reranking step. Option B (hybrid search) is for search use cases, not recommendations. Option D has merit for recommendations but doesn't address the specific multi-signal reranking requirement.",
    interviewScript: "In your interview, say: 'This is a classic two-stage retrieval pattern. The vector search acts as a fast candidate generator — it narrows millions of videos to 1000 semantically relevant ones. Then a more sophisticated reranking model scores those 1000 using signals the embedding doesn't capture: freshness, user demographics, content maturity. This separation is key because the embedding captures semantic similarity, but the reranker can incorporate business logic and real-time signals.'",
    proTip: "Mentioning that the first stage optimizes for recall (find all potentially relevant items) while the second stage optimizes for precision (rank the best ones highest) shows you understand the fundamental design principle."
  },
  // q13 — Architecture: Pattern selection
  {
    id: "q13",
    subtopic: "Architecture Patterns",
    tier: "Heavy",
    style: "Decision framework",
    question: "A candidate proposes using Pattern 3 (two-stage retrieval with a reranker) for a simple FAQ chatbot that searches 10,000 company documents. The interviewer asks: 'Is that the right pattern here?' What's the best assessment?",
    options: [
      { label: "A", text: "Yes — two-stage retrieval is always the highest quality approach, and 10K documents is small enough that the added latency is negligible" },
      { label: "B", text: "No — for 10K documents with a simple retrieval use case, Pattern 1 (vector DB as separate service) or even brute-force KNN is sufficient. The reranker adds latency and complexity without meaningful quality improvement at this scale." },
      { label: "C", text: "No — for chatbots you should use Pattern 2 (hybrid search) because keyword matching is essential for FAQ lookups" },
      { label: "D", text: "Yes, but only if the reranker uses a cross-encoder model — other reranking approaches won't improve quality" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is an over-engineering anti-pattern. With only 10K documents, the candidate set is tiny. Pattern 1 (or even brute-force exact KNN) would be fast and simple. A reranker adds latency (~100-500ms) and a separate model to maintain, for marginal quality gain when the candidate pool is already small. The content explicitly warns: 'Stick with Pattern 1 for most problems!' and 'add complexity only when the requirements demand it.' Option A incorrectly claims two-stage is always best. Option C makes a reasonable point about hybrid search but the core issue is unnecessary complexity. Option D is too narrow.",
    interviewScript: "In your interview, say: 'I'd push back on the two-stage approach here. With 10K documents, even exact KNN is fast — sub-millisecond. Adding a reranker introduces latency and operational complexity for minimal quality gain. I'd start with Pattern 1: vector DB as a service, retrieve top-K, done. We can always add a reranker later if quality metrics show it's needed.'",
    proTip: null
  },
  // q14 — Architecture: Consistency
  {
    id: "q14",
    subtopic: "Architecture Patterns",
    tier: "Heavy",
    style: "Interviewer pushback",
    question: "You design a RAG system where documents are embedded and inserted into a vector database upon upload. Your interviewer asks: 'A user uploads a document and immediately searches for it — will they find it?' What's the most accurate and impressive response?",
    options: [
      { label: "A", text: "'Yes, our vector database supports ACID transactions, so the embedding is searchable immediately after the insert commits'" },
      { label: "B", text: "'Not necessarily. Vector search is typically eventually consistent — there may be seconds to minutes of delay before new embeddings are searchable. For this use case, I'd mention this as a known limitation and implement a write-through cache that checks recent uploads before vector search results.'" },
      { label: "C", text: "'Yes, because we generate the embedding synchronously during upload and insert it before returning success to the user'" },
      { label: "D", text: "'No, and we shouldn't try to solve this — users understand that search takes time to index new content'" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This demonstrates understanding of a critical operational nuance. Vector databases are typically eventually consistent — even if the insert API returns success, the vector may not be immediately searchable (it needs to be added to the index, which is especially slow for HNSW). The best response acknowledges this limitation and proposes a practical mitigation. Option A is wrong — most vector databases are not ACID-compliant in the traditional sense. Option C confuses insert completion with searchability. Option D is too dismissive — this is a real UX issue that good engineers address.",
    interviewScript: "In your interview, say: 'Vector search is typically eventually consistent. Even after a successful insert, the embedding might not be searchable for seconds or even minutes depending on the index type. For this use case, I'd proactively mention this: the vector DB is not our source of truth, it's an index. I might implement a recent-uploads cache that supplements vector search results for a short window after upload.'",
    proTip: "Explicitly saying 'the vector DB is not our source of truth — it's an index' is one of the most impressive things you can say in this context. It shows you understand the fundamental architectural role."
  },
  // q15 — Architecture: When to use purpose-built vs extension (anti-pattern)
  {
    id: "q15",
    subtopic: "Architecture Patterns",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate designing a product search feature for a startup with 2 million products immediately proposes Milvus as their vector database. They justify it by saying: 'Milvus handles billions of vectors, so it's future-proof.' What's wrong with this approach?",
    options: [
      { label: "A", text: "Milvus is open source and therefore lacks the support and reliability needed for production systems" },
      { label: "B", text: "At 2M vectors, pgvector or Elasticsearch kNN would suffice with far less operational complexity. Milvus is a distributed system with multiple node types — the operational overhead is unjustified at this scale and 'future-proofing' is premature optimization." },
      { label: "C", text: "Milvus doesn't support filtered search, which is essential for product search with price ranges and categories" },
      { label: "D", text: "The candidate should use Pinecone instead because it's fully managed and requires zero infrastructure" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content explicitly advises: 'start simple' and 'extensions to databases you're already using will handle millions of vectors just fine.' At 2M vectors, pgvector (if using Postgres) or ES kNN (if using Elasticsearch) handle this easily. Milvus is designed for serious scale (billions of vectors) and brings significant operational complexity — multiple node types, a distributed system to manage. Introducing this complexity for 2M vectors is premature optimization. Option A is wrong — open source can be production-ready. Option C is wrong — Milvus supports filtering. Option D is reasonable but misses the core point about starting simple with existing infrastructure.",
    interviewScript: "In your interview, say: 'I'd start simpler. At 2 million vectors, pgvector or Elasticsearch's kNN would handle this easily with far less operational overhead. The rule of thumb is to reach for purpose-built vector databases at 100 million+ vectors. Milvus is designed for billions of vectors across a distributed system — that's massive operational complexity we don't need. Start with what you have, and migrate when scale demands it.'",
    proTip: null
  },
  // q16 — Vectors & Embeddings
  {
    id: "q16",
    subtopic: "Vectors & Embeddings",
    tier: "Medium",
    style: "Multi-hop reasoning",
    question: "You're building a recommendation system for an e-commerce platform. A data scientist suggests using OpenAI's general-purpose text embeddings for product similarity. A machine learning engineer argues for training a custom embedding model on purchase co-occurrence data. Under what conditions is the ML engineer most likely correct?",
    options: [
      { label: "A", text: "Always — custom models always outperform general-purpose embeddings because they're trained on domain-specific data" },
      { label: "B", text: "When the notion of 'similarity' is domain-specific and non-obvious — e.g., diapers and baby bottles are semantically dissimilar but should be similar in a 'frequently bought together' embedding space" },
      { label: "C", text: "Only when the product catalog exceeds 10 million items, because general-purpose embeddings lose precision at scale" },
      { label: "D", text: "When latency requirements are strict, because custom models can be optimized to produce lower-dimensional embeddings" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content explicitly makes this point: general-purpose embeddings capture 'vague semantic similarity,' but applications often need a specific notion of similarity. The classic example is diapers and baby bottles — semantically different objects that are profoundly similar in purchase patterns. A custom model trained on co-occurrence data captures this domain-specific similarity that general-purpose models miss. Option A is too absolute. Option C fabricates a scale threshold. Option D has some validity but misses the core semantic argument.",
    interviewScript: "In your interview, say: 'The key question is what similarity means for our use case. General-purpose embeddings capture semantic similarity — words that mean similar things. But for recommendations, we often care about behavioral similarity: items bought together, pages visited in sequence. A custom model trained on this signal captures relationships that semantic embeddings completely miss — like diapers and baby bottles being strongly related despite being semantically different.'",
    proTip: null
  },
  // q17 — Vectors: Dimensionality
  {
    id: "q17",
    subtopic: "Vectors & Embeddings",
    tier: "Medium",
    style: "Estimation-backed reasoning",
    question: "Your team debates embedding dimensions for a similarity search system. A colleague argues: 'OpenAI's 3072-dimension embeddings capture the most nuance, so we should always use them.' What is the most important counterargument for a system serving 100M vectors?",
    options: [
      { label: "A", text: "Higher dimensions require more training data for the embedding model, and 3072 dimensions may overfit on small datasets" },
      { label: "B", text: "At 100M vectors with 3072 dimensions in float32, raw vectors alone consume ~1.1 TB of RAM. With HNSW overhead (~2x), you need ~2.2 TB — a massive infrastructure cost that may not proportionally improve result quality compared to 384 or 768 dimensions." },
      { label: "C", text: "3072 dimensions exceed the maximum supported by most vector database implementations" },
      { label: "D", text: "Higher dimensions always produce worse recall because the curse of dimensionality makes all vectors equidistant" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The math is straightforward: 100M × 3072 × 4 bytes = ~1.1 TB just for raw vectors. With HNSW's ~2x overhead, you're at ~2.2 TB of RAM. Compare with 384 dimensions: 100M × 384 × 4 = ~144 GB raw, ~288 GB with HNSW — nearly 8x cheaper. The content explicitly warns about this tradeoff: 'Higher-dimensional embeddings capture more nuance but are slower to search and use more memory. For some applications, 128 dimensions is plenty.' Option D overstates the curse of dimensionality. Option C is wrong — most DBs handle 3072. Option A conflates embedding model training with system design.",
    interviewScript: "In your interview, say: 'Let me do the math. 100 million vectors at 3072 dimensions is about 1.1 terabytes of RAM just for the vectors, doubled with HNSW overhead. Compare that to 384 dimensions: about 140 GB raw. That's an 8x infrastructure cost difference. The question is whether 3072 dimensions gives us proportionally better results. For many applications, 384 or 768 dimensions capture enough nuance — always benchmark on your actual data before committing to high dimensions.'",
    proTip: null
  },
  // q18 — Similarity Metrics
  {
    id: "q18",
    subtopic: "Similarity Metrics",
    tier: "Medium",
    style: "Decision framework",
    question: "You're choosing a similarity metric for a content recommendation system. Your embedding model normalizes all output vectors to unit length. Your colleague suggests Euclidean (L2) distance, arguing it's the most intuitive. What's the best reason to prefer cosine similarity in this case?",
    options: [
      { label: "A", text: "Cosine similarity is always faster to compute than Euclidean distance because it avoids the square root operation" },
      { label: "B", text: "When vectors are normalized to unit length, cosine similarity and Euclidean distance produce identical rankings — but cosine similarity's bounded range [−1, 1] makes thresholds more interpretable and portable across datasets" },
      { label: "C", text: "Cosine similarity works in any number of dimensions while Euclidean distance becomes meaningless above 100 dimensions" },
      { label: "D", text: "Cosine similarity captures semantic meaning while Euclidean distance only captures geometric proximity" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is a subtle but important point. For unit-normalized vectors, cosine similarity and Euclidean distance are monotonically related (minimizing L2 distance is equivalent to maximizing cosine similarity). They'll produce the same ranking. The practical advantage of cosine similarity is its bounded range: 1 means identical, 0 means orthogonal, -1 means opposite. This makes it easier to set meaningful thresholds (e.g., 'consider vectors with cosine > 0.8 as duplicates') that transfer across different datasets and embedding models. Option A is incorrect — the computational difference is negligible. Option C fabricates a dimensionality limit. Option D is meaningless — both measure geometric relationships.",
    interviewScript: "In your interview, say: 'Since our embeddings are normalized to unit length, cosine similarity and L2 distance actually produce identical rankings. But I'd prefer cosine similarity for its interpretability — the [−1, 1] range gives us intuitive thresholds. A cosine similarity of 0.95 means 'very similar' regardless of the embedding model or dataset, whereas L2 distance thresholds aren't as portable.'",
    proTip: null
  },
  // q19 — Similarity Metrics × Embedding Model (bridge)
  {
    id: "q19",
    subtopic: "Similarity Metrics",
    tier: "Medium",
    style: "Cross-subtopic bridge",
    question: "Your team trains a custom embedding model for product recommendations using a dot product loss function — the model learns to maximize the dot product between items frequently purchased together. At serving time, a colleague suggests using cosine similarity as the distance metric in the vector database. What's the potential problem?",
    options: [
      { label: "A", text: "Dot product is always incompatible with vector databases; you must convert to cosine similarity before indexing" },
      { label: "B", text: "Cosine similarity ignores vector magnitude, but the model may have learned to encode relevance strength in the magnitude — a 'very popular' product might have a larger vector. Switching to cosine could discard this signal." },
      { label: "C", text: "The dot product loss creates non-normalized vectors, and most vector databases require normalized inputs to function correctly" },
      { label: "D", text: "There's no problem — cosine similarity is equivalent to dot product for all practical purposes" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The key difference between dot product and cosine similarity is magnitude. Cosine similarity normalizes away magnitude, only comparing direction. But a model trained with dot product loss may intentionally encode information in the magnitude — a more 'relevant' or 'popular' item might get a longer vector. If you switch to cosine similarity at serving time, you lose this signal. The content notes: 'Dot product is similar to cosine similarity but doesn't normalize for magnitude.' If the model was trained to use magnitude as a feature, the serving metric must match. Option D is incorrect for non-normalized vectors. Options A and C fabricate requirements.",
    interviewScript: "In your interview, say: 'The distance metric at serving time should match what the model was trained with. Dot product preserves magnitude, and the model may have learned to encode relevance strength in vector length — more relevant items get longer vectors. Cosine similarity normalizes this away. It's like training a model to output confidence scores and then discarding the confidence at inference time.'",
    proTip: "This 'train-time vs serve-time metric mismatch' is a common production bug that's hard to debug because results look reasonable but aren't optimal."
  },
  // q20 — IVF
  {
    id: "q20",
    subtopic: "IVF (Inverted File Index)",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "You're evaluating IVF vs HNSW for a vector search system with 200M vectors that receives 50K new vectors per hour. Which characteristic of IVF makes it relatively more suitable for this write-heavy workload?",
    options: [
      { label: "A", text: "IVF uses less memory per vector because it stores cluster assignments (a single integer) rather than graph edges, making it cheaper to scale" },
      { label: "B", text: "IVF inserts are cheaper — you just compute the nearest centroid and assign the vector to that cluster, avoiding the expensive graph connection operations HNSW requires" },
      { label: "C", text: "IVF indexes can be queried during construction, while HNSW indexes cannot serve queries until fully built" },
      { label: "D", text: "IVF automatically rebalances clusters as new data arrives, maintaining optimal performance without manual intervention" }
    ],
    correct: 1,
    confidence: null,
    explanation: "IVF's key advantage for write-heavy workloads is insert cost. Adding a vector means computing distances to ~100-1000 centroids, finding the nearest one, and appending the vector to that cluster's list. This is O(k) where k is the number of clusters — typically much cheaper than HNSW insertion which requires finding neighbors and updating graph connections at each layer. Option A is also true but not the most relevant advantage for write-heavy workloads specifically. Option C is fabricated. Option D is wrong — IVF clusters can degrade over time and may need periodic rebuilds.",
    interviewScript: "In your interview, say: 'For this write-heavy workload, IVF has a clear advantage in insert cost. Adding a vector to IVF just means finding the nearest centroid and appending — O(k) where k is the number of clusters. HNSW inserts are more expensive because each new vector needs to find its neighbors and update connections at each layer it's promoted to. The tradeoff is that IVF typically has lower recall for the same latency compared to HNSW.'",
    proTip: null
  },
  // q21 — IVF: nprobe
  {
    id: "q21",
    subtopic: "IVF (Inverted File Index)",
    tier: "Medium",
    style: "Failure analysis",
    question: "Your IVF index has 1000 clusters over 50M vectors, with nprobe set to 5. A user reports that search quality is inconsistent — some queries return excellent results while others miss obviously relevant items. The embedding model and data haven't changed. What's the most likely explanation?",
    options: [
      { label: "A", text: "The 5 probed clusters always cover the same region of the vector space, creating systematic blind spots for certain query types" },
      { label: "B", text: "With nprobe=5, queries near cluster boundaries may miss relevant vectors in adjacent clusters. Queries whose true nearest neighbors span multiple clusters see degraded recall, while queries that land squarely within a single cluster work well." },
      { label: "C", text: "The k-means clustering has converged to a local minimum, creating uneven cluster sizes. Some clusters have millions of vectors and others have thousands." },
      { label: "D", text: "IVF doesn't support nprobe > 1; the parameter is being silently ignored" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is the fundamental weakness of IVF with low nprobe. Vectors near cluster boundaries have their true nearest neighbors spread across multiple clusters. If a query vector lands near a boundary, probing only 5 of 1000 clusters might miss adjacent clusters containing relevant vectors. Queries that land squarely in the center of a cluster see high recall. The inconsistency is directly explained by the geometric relationship between the query and the cluster boundaries — exactly the 'edges' problem the content describes. Option C could contribute but doesn't explain the query-dependent inconsistency. Option D is fabricated.",
    interviewScript: "In your interview, say: 'This is the classic IVF boundary problem. With only 5 out of 1000 clusters probed, queries near cluster boundaries miss relevant vectors in adjacent clusters. It's like searching for nearby restaurants when you're standing on a neighborhood boundary — you only search your neighborhood and miss great options next door. The fix is increasing nprobe, but that trades latency for recall.'",
    proTip: "The content's analogy to geospatial indexing edge cases is perfect here — mention it to show you see patterns across different indexing domains."
  },
  // q22 — LSH
  {
    id: "q22",
    subtopic: "LSH (Locality Sensitive Hashing)",
    tier: "Medium",
    style: "Decision framework",
    question: "Your system ingests a continuous stream of 100K social media posts per second, each embedded into a 256-dimension vector. You need near-real-time near-duplicate detection (find posts similar to each new post within the last hour's window). Which indexing strategy is best suited and why?",
    options: [
      { label: "A", text: "HNSW — it has the best recall, and 256 dimensions is small enough that memory overhead is manageable" },
      { label: "B", text: "IVF — its fast inserts and low memory overhead make it ideal for streaming workloads at this scale" },
      { label: "C", text: "LSH — its O(1) hash-based inserts handle the extreme write rate, multiple hash tables provide robust recall, and the time-windowed nature means you can drop old hash buckets efficiently" },
      { label: "D", text: "Annoy — its memory-mapped index files are perfect for high-throughput workloads since multiple processes can share the index" }
    ],
    correct: 2,
    confidence: null,
    explanation: "LSH's strengths align perfectly with this workload: (1) inserting is just computing hashes — O(1) per vector, essential at 100K/second. (2) The content explicitly lists 'streaming data where vectors arrive continuously' as an LSH use case. (3) Time-windowed deduplication maps naturally to hash tables — you can age out old buckets as the window slides. HNSW's expensive inserts would create a write bottleneck at 100K/sec. Annoy is immutable — you can't add vectors after building. IVF inserts are cheaper than HNSW but still involve centroid distance computations that may bottleneck at this rate.",
    interviewScript: "In your interview, say: 'For continuous streaming at 100K vectors per second, I'd choose LSH. Insertions are O(1) — just hash and bucket. This matters enormously at this write rate. The time-windowed deduplication maps naturally to hash tables — we can drop old buckets as the window slides. LSH typically has lower recall than HNSW, but for duplicate detection we can tune for high recall with multiple hash tables, and the write throughput advantage is decisive here.'",
    proTip: null
  },
  // q23 — LSH: Gotcha
  {
    id: "q23",
    subtopic: "LSH (Locality Sensitive Hashing)",
    tier: "Medium",
    style: "Gotcha/trap",
    question: "A colleague proposes using LSH with 16-bit hashes and a single hash table for a similarity search system with 10M vectors. They argue: '16 bits gives 65,536 buckets, so each bucket has ~150 vectors on average — that's fast to scan.' What subtle problem will they encounter?",
    options: [
      { label: "A", text: "16 bits is too many — the hash buckets will be too sparse, with most containing zero vectors, wasting memory" },
      { label: "B", text: "With a single hash table, two similar vectors that happen to disagree on even one of the 16 hyperplane decisions end up in completely different buckets — recall will be unacceptably low because there's no redundancy to catch these near-misses" },
      { label: "C", text: "LSH requires the number of bits to be a power of 2 minus 1, so 16 bits is an invalid configuration" },
      { label: "D", text: "16-bit hashes can't represent enough distinct buckets for 10M vectors, causing excessive collisions" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This is a fundamental LSH trap. Each of the 16 bits represents a random hyperplane decision (above/below). Two very similar vectors might agree on 15 out of 16 hyperplanes but disagree on one — and that single disagreement puts them in completely different buckets. With only one hash table, there's no second chance. The content explains this: 'A single table might miss similar vectors that happen to fall on opposite sides of one hyperplane. But with multiple tables, the probability that similar vectors share at least one bucket goes up dramatically.' You need multiple hash tables for robust recall. Option A is wrong — 150 per bucket is reasonable. Option C is fabricated. Option D is wrong — 65K buckets is fine for 10M vectors.",
    interviewScript: "In your interview, say: 'A single hash table is the trap here. Each bit is a random hyperplane decision, and similar vectors can disagree on any one of them. With 16 bits and one table, a single disagreement puts similar vectors in completely different buckets — and there's no second chance. You need multiple hash tables with different hyperplane sets so similar vectors are likely to collide in at least one table.'",
    proTip: null
  },
  // q24 — Annoy
  {
    id: "q24",
    subtopic: "Annoy",
    tier: "Medium",
    style: "Decision framework",
    question: "Spotify uses Annoy for music recommendations. A startup founder wants to use Annoy for their real-time news recommendation feed where articles are published every few seconds. Why is Annoy a poor fit for this use case?",
    options: [
      { label: "A", text: "Annoy only supports Euclidean distance, but news recommendations require cosine similarity" },
      { label: "B", text: "Annoy indexes are immutable — once built, you cannot add new vectors. A news feed with continuous article publications would require constant full index rebuilds, which is impractical." },
      { label: "C", text: "Annoy's random projection trees produce lower-quality results than HNSW for text embeddings specifically" },
      { label: "D", text: "Annoy requires all vectors to have exactly the same dimensionality, which limits which embedding models you can use" }
    ],
    correct: 1,
    confidence: null,
    explanation: "Annoy's killer feature (mmap-based read-only indexes) is also its biggest limitation: indexes are immutable. You cannot add, remove, or modify vectors once the index is built. For Spotify, this works because their music catalog updates in batches. For real-time news where articles publish every few seconds, you'd need to rebuild the entire index each time — completely impractical. The content explicitly states: 'Annoy indexes are immutable. Once built, you can't add or remove vectors—you have to rebuild the entire index.' Option A is wrong — Annoy supports multiple metrics. Option C is an overgeneralization. Option D applies to all vector indexes, not just Annoy.",
    interviewScript: "In your interview, say: 'Annoy is designed for static or batch-updated datasets. Its indexes are immutable — once built, you can't add vectors without a full rebuild. That's fine for Spotify's music catalog which updates in batches, but fatal for a real-time news feed. For continuous inserts, you'd want HNSW or LSH, which support incremental updates.'",
    proTip: "Mentioning the mmap advantage (zero-copy sharing across processes, instant loading) shows you understand WHY Annoy made the immutability tradeoff — it wasn't a limitation, it was a deliberate design choice."
  },
  // q25 — Annoy: mmap
  {
    id: "q25",
    subtopic: "Annoy",
    tier: "Medium",
    style: "Implementation nuance",
    question: "Your team runs 8 recommendation service replicas, each needing access to a 50GB Annoy index. Without mmap, how much total RAM would be consumed across all replicas, and how does mmap change this?",
    options: [
      { label: "A", text: "400 GB without mmap (50GB × 8 copies). With mmap, still 400 GB because each process needs its own copy of the data in physical RAM." },
      { label: "B", text: "400 GB without mmap. With mmap, ~50 GB total because the OS shares the same physical memory pages across all 8 processes, and the OS intelligently pages in only the actively-used portions." },
      { label: "C", text: "50 GB without mmap because modern OSes deduplicate memory. Mmap provides no additional benefit." },
      { label: "D", text: "400 GB without mmap. With mmap, 0 GB in RAM because the data stays entirely on disk and is accessed via I/O." }
    ],
    correct: 1,
    confidence: null,
    explanation: "Without mmap, each process loads the full index into its own private heap memory — 50GB × 8 = 400GB. Mmap maps the file into virtual memory, and the OS's page cache shares the physical pages across all processes. All 8 replicas share the same ~50GB of physical memory. Additionally, the OS only loads pages that are actually accessed (demand paging), so if queries only touch certain regions, actual RSS can be even lower. The content highlights this as Annoy's 'killer feature': 'Multiple processes can share the same index without copying.' Option D is wrong — mmap does use RAM (the page cache), it just doesn't duplicate it per process.",
    interviewScript: "In your interview, say: 'This is Annoy's killer feature. Without mmap, eight replicas each load 50 gigs into private heap — 400 gigs total. With mmap, the OS maps the file into virtual memory and shares the physical pages across all processes. You use about 50 gigs total regardless of replica count. Plus, the OS only pages in what you actually access, so if queries concentrate on popular items, actual memory usage can be even lower.'",
    proTip: null
  },
  // q26 — DB Options: Selection
  {
    id: "q26",
    subtopic: "Vector DB Options",
    tier: "Medium",
    style: "Decision framework",
    question: "You're leading architecture for a startup that currently uses PostgreSQL for everything. The product team wants to add 'similar products' functionality across your 3 million product catalog. What should you recommend?",
    options: [
      { label: "A", text: "Pinecone — it's fully managed and serverless, so your small team doesn't have to worry about infrastructure" },
      { label: "B", text: "pgvector — you're already on PostgreSQL, it handles millions of vectors fine, and you get joins with relational data, ACID transactions, and familiar tooling with zero new infrastructure" },
      { label: "C", text: "Milvus — it's open source and free, so it's the best choice for a startup watching costs" },
      { label: "D", text: "Build a custom solution using FAISS in-memory — it gives you the most control and best performance" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content is explicit: 'start simple' and 'if you're already on PostgreSQL, try pgvector first.' At 3M vectors, pgvector handles this without breaking a sweat. You get the massive advantage of joining vector search results with relational data (product details, inventory, pricing) in a single query. No new infrastructure to operate, no new failure modes, no new deployment pipeline. The 100M+ vector threshold for purpose-built vector DBs is nowhere close. Option A adds unnecessary infrastructure. Option C (Milvus) is massively over-engineered for 3M vectors. Option D is the most work for marginal gain.",
    interviewScript: "In your interview, say: 'Since we're already on PostgreSQL, pgvector is the obvious first choice. At 3 million vectors, it handles this easily. The huge win is keeping everything in one database — we can join vector similarity results with product metadata, inventory, and pricing in a single query. I'd only consider a dedicated vector DB if we grow past 100 million vectors or have specialized requirements pgvector can't meet.'",
    proTip: null
  },
  // q27 — DB Options: Scale threshold
  {
    id: "q27",
    subtopic: "Vector DB Options",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "A large social media company stores 2 billion user profile embeddings for a 'People You May Know' feature. They currently use pgvector but experience poor query latency and frequent OOM errors during index builds. When evaluating purpose-built vector databases, which factor should weigh MOST heavily in their decision?",
    options: [
      { label: "A", text: "API design and query language — GraphQL support (Weaviate) vs REST (Pinecone) vs gRPC (Milvus) will determine developer productivity" },
      { label: "B", text: "Operational complexity vs scale — Pinecone is fully managed but offers less control, Milvus handles billions but requires operating a distributed system, and the team must decide how much infrastructure burden they can absorb" },
      { label: "C", text: "Open source vs proprietary — open source databases are always preferable because you avoid vendor lock-in" },
      { label: "D", text: "Filtering capabilities — since 'People You May Know' requires complex demographic and social graph filters, the filtering implementation matters more than raw vector search performance" }
    ],
    correct: 1,
    confidence: null,
    explanation: "At 2 billion vectors, they've clearly outgrown pgvector and need a purpose-built solution. The critical decision is the operational tradeoff: Pinecone is zero-ops but gives less control and costs more; Milvus handles the scale but requires operating a complex distributed system. For a large social media company, the team likely has the expertise to run Milvus, but the decision depends on their operational capacity and priorities. Option A focuses on a relatively minor concern. Option C is an oversimplification. Option D raises a valid point but isn't the MOST important factor — at 2B vectors, scale is the primary constraint.",
    interviewScript: "In your interview, say: 'At 2 billion vectors, they need a purpose-built vector DB — pgvector has clearly hit its limits. The key decision is operational complexity versus control. Pinecone gives them zero infrastructure management but less tuning control and potentially higher cost. Milvus handles the scale but they're now operating a distributed system with multiple node types. For a company this size, they probably have the infrastructure team to run Milvus, but that's a significant commitment.'",
    proTip: null
  },
  // q28 — Numbers: Gotcha
  {
    id: "q28",
    subtopic: "Numbers to Know",
    tier: "Medium",
    style: "Gotcha/trap",
    question: "In an interview, a candidate says: 'Each 1536-dimension float32 vector only takes about 1.5 KB of storage, so a billion vectors fit in about 1.5 TB.' What error did they make, and what's the actual number?",
    options: [
      { label: "A", text: "They used float16 math instead of float32. Actual: 1536 × 4 bytes = ~6 KB per vector, so 1 billion vectors = ~6 TB raw, plus index overhead" },
      { label: "B", text: "They forgot to account for metadata storage. The vector itself is 1.5 KB, but metadata doubles the per-vector cost" },
      { label: "C", text: "They're actually correct — 1536 × 1 byte per dimension = 1.5 KB, since vector databases compress to 8-bit integers by default" },
      { label: "D", text: "They divided by 1024 instead of 1000 when converting bytes to kilobytes, leading to a rounding error" }
    ],
    correct: 0,
    confidence: null,
    explanation: "The candidate used 1 byte per dimension instead of 4 bytes. Float32 uses 4 bytes per number, so: 1536 dimensions × 4 bytes = 6,144 bytes ≈ 6 KB per vector. For 1 billion vectors: 6 KB × 1B = ~6 TB of raw vector storage. With HNSW index overhead (~2x), you're looking at ~12 TB. The candidate's estimate was off by 4x — a significant error in capacity planning. Option B is wrong about the base calculation. Option C fabricates default compression. Option D is a trivial rounding issue, not the core error.",
    interviewScript: "In your interview, say: 'Quick sanity check: float32 is 4 bytes per dimension. 1536 times 4 is about 6 KB per vector, not 1.5 KB. That 4x error compounds at scale — a billion vectors is 6 TB raw, roughly 12 TB with HNSW overhead. Getting the memory math right is critical for capacity planning.'",
    proTip: "Always do this math out loud and slowly in interviews. It's easy to drop a factor of 4 under pressure, and interviewers watch for it."
  },
  // q29 — Numbers: Latency
  {
    id: "q29",
    subtopic: "Numbers to Know",
    tier: "Medium",
    style: "Estimation-backed reasoning",
    question: "Your system design requires vector search to complete within a 50ms latency budget as part of a larger request that includes primary DB lookups, business logic, and response serialization. With a well-tuned HNSW index serving 10M vectors, is this feasible?",
    options: [
      { label: "A", text: "No — HNSW search over 10M vectors typically takes 50-100ms, consuming the entire latency budget with nothing left for other operations" },
      { label: "B", text: "Yes — well-tuned HNSW search over 10M vectors typically achieves 1-5ms latency, leaving ample budget for the remaining operations" },
      { label: "C", text: "Only if you use IVF instead of HNSW, which achieves sub-millisecond latency at the cost of recall" },
      { label: "D", text: "Only if the index fits entirely in L3 cache — RAM-resident indexes at this size are too slow" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content states: 'Sub-10ms is achievable for well-tuned systems. 1-5ms is common.' At 10M vectors with a well-tuned HNSW index, 1-5ms is a realistic expectation. This easily fits within the 50ms budget, leaving 45+ ms for other operations. Option A dramatically overstates HNSW latency. Option C undersells HNSW — it's typically faster than IVF for the same recall. Option D is wrong — RAM-resident HNSW at 10M vectors works fine without needing L3 cache residency.",
    interviewScript: "In your interview, say: 'Absolutely feasible. Well-tuned HNSW over 10 million vectors typically returns results in 1 to 5 milliseconds — well within our 50ms budget. That leaves 45+ milliseconds for the primary DB lookup, business logic, and serialization. Vector search is rarely the bottleneck in a well-architected system at this scale.'",
    proTip: null
  },
  // q30 — Gotchas: Vector DB not transactional
  {
    id: "q30",
    subtopic: "Gotchas & Limitations",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "A candidate designs a document management system where the vector database is the primary data store. Documents are stored as embeddings with full text in metadata, and all CRUD operations go through the vector DB's API. They say: 'This simplifies our architecture by eliminating the need for a separate database.' What's the most critical flaw?",
    options: [
      { label: "A", text: "Vector databases have size limits on metadata that would prevent storing full document text" },
      { label: "B", text: "Vector databases are NOT transactional databases and should not be used as the source of truth. They lack ACID guarantees, can lose data during index rebuilds, and offer no relational integrity. The authoritative data must live in a proper database; the vector DB is an index." },
      { label: "C", text: "Storing full text as metadata wastes space because the text is already encoded in the embedding" },
      { label: "D", text: "Vector databases don't support update operations, so document edits would be impossible" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content is emphatic on this point: 'Vector databases are not transactional databases. Don't try to use them as your source of truth. They're great at similarity search but terrible at everything else databases do. Your authoritative data lives elsewhere; the vector DB is an index.' Using a vector DB as the primary store means no ACID transactions, risk of data loss during index operations, no referential integrity, and no backup/recovery guarantees that traditional databases provide. Option C is wrong — embeddings don't contain recoverable text. Option D is inaccurate — updates are possible via delete+insert.",
    interviewScript: "In your interview, say: 'This is a fundamental architectural mistake. Vector databases are indexes, not sources of truth. They lack ACID transactions, can lose data during index rebuilds, and provide none of the durability guarantees you need for primary data storage. The authoritative documents should live in PostgreSQL or another proper database. The vector DB stores embeddings and references back to the primary store.'",
    proTip: null
  },
  // q31 — Gotchas: Exact match anti-pattern
  {
    id: "q31",
    subtopic: "Gotchas & Limitations",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "A candidate's document search design uses vector similarity as the sole retrieval mechanism. They explain: 'If a user searches for document ID DOC-4582, we embed that string and find the most similar documents.' What's the critical flaw?",
    options: [
      { label: "A", text: "Document IDs should be encrypted before embedding to prevent information leakage" },
      { label: "B", text: "Vector search finds SIMILAR things, not IDENTICAL things. Embedding 'DOC-4582' will return documents with semantically similar metadata, not the document with that exact ID. Exact lookups require a traditional database index." },
      { label: "C", text: "The embedding model can't handle alphanumeric IDs — it only works with natural language text" },
      { label: "D", text: "This approach works fine; vector databases support exact match as a special case of similarity search with distance threshold 0" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content explicitly warns: 'Exact match is not what vector search does. If you need to find an exact document by ID, use a regular database. Vector search finds similar things, not identical things.' Embedding 'DOC-4582' would produce a vector similar to embeddings of other alphanumeric strings, not necessarily the exact document. This is a category error — using a similarity tool for an identity lookup. Option C underestimates embedding models. Option D is wrong — even with distance 0, you're comparing embeddings, not raw IDs.",
    interviewScript: "In your interview, say: 'Vector search finds similar things, not identical things. An ID lookup is an exact match problem — that's what primary keys and B-tree indexes are for. Embedding an ID string and searching by similarity would return documents with coincidentally similar metadata embeddings, not the document with that ID. Always route exact lookups through your primary database and use vector search only for semantic similarity.'",
    proTip: null
  },
  // q32 — Exact KNN
  {
    id: "q32",
    subtopic: "Exact KNN & Brute Force",
    tier: "Thin",
    style: "Estimation-backed reasoning",
    question: "Your colleague argues that for a dataset of 50,000 vectors with 768 dimensions, exact KNN is sufficient and building an ANN index is over-engineering. Is this a reasonable position?",
    options: [
      { label: "A", text: "No — 50K vectors still requires an ANN index because brute force is always too slow for production use" },
      { label: "B", text: "Yes — brute force KNN over 50K × 768 dimensions involves ~150 million FLOPs per query, which modern CPUs with SIMD can complete in under a millisecond. The ANN index adds complexity with no meaningful latency improvement at this scale." },
      { label: "C", text: "Only if you have a GPU available — CPU-based brute force over 50K vectors is too slow" },
      { label: "D", text: "Yes, but only if queries are infrequent (< 1 QPS). At higher throughput, brute force can't keep up." }
    ],
    correct: 1,
    confidence: null,
    explanation: "At 50K vectors, brute force is perfectly viable. 50,000 × 768 = ~38 million multiply-add operations per query. With SIMD (processing 4-8 floats per instruction), this completes in well under a millisecond on modern CPUs. The content mentions SIMD and GPU optimization for exact KNN, and also notes that ANN exists because 'most applications can tolerate a bit of inaccuracy to gain a lot of speed' — implying that at small scale, exact KNN is fine. Adding an ANN index introduces complexity (tuning, rebuild management, recall tradeoffs) with no benefit at this scale.",
    interviewScript: "In your interview, say: 'At 50K vectors, brute force is not only reasonable, it's probably the right choice. The computation is trivial for modern CPUs with SIMD — under a millisecond. Adding an ANN index means managing recall tradeoffs, tuning parameters, and handling index maintenance for no real performance gain. Start simple, and add the index when you actually need it.'",
    proTip: null
  },
  // q33 — ANN Recall
  {
    id: "q33",
    subtopic: "ANN Recall Metric",
    tier: "Thin",
    style: "Scenario-based trade-off",
    question: "Your vector search system has a recall of 0.92. A product manager asks: 'Does this mean 8% of our search results are wrong?' How do you correctly explain what recall means in the ANN context?",
    options: [
      { label: "A", text: "'Yes, 8% of the returned results are incorrect or irrelevant matches'" },
      { label: "B", text: "'No — recall 0.92 means we find 92% of the true top-K nearest neighbors. The results we DO return are all genuinely similar; we just might miss some results that are slightly more similar than what we returned. We're not returning wrong answers — we're occasionally missing the absolute best ones.'" },
      { label: "C", text: "'It means our system is available 92% of the time and returns errors for 8% of queries'" },
      { label: "D", text: "'It means 92% of all vectors in the database are reachable by the search algorithm'" }
    ],
    correct: 1,
    confidence: null,
    explanation: "ANN recall measures what fraction of the TRUE top-K nearest neighbors your approximate algorithm actually finds. A recall of 0.92 with K=10 means if exact search would return items {A,B,C,D,E,F,G,H,I,J}, ANN returns about 9 of those 10, possibly substituting one with a slightly less similar item. The returned results are still genuinely similar — you're not getting garbage. You're just occasionally missing the absolute best match. The content defines it: 'of the true top-K nearest neighbors, what fraction did we actually find?'",
    interviewScript: "In your interview, say: 'Recall in ANN context isn't about wrong results — it's about completeness. 0.92 recall means we find 92% of the true top-K nearest neighbors. Every result we return IS genuinely similar to the query. We just occasionally miss a result that's slightly more similar than our least-similar returned item. For most applications, 95%+ recall is plenty.'",
    proTip: null
  },
  // q34 — Embedding Drift (anti-pattern)
  {
    id: "q34",
    subtopic: "Embedding Drift",
    tier: "Thin",
    style: "Anti-pattern identification",
    question: "Your team upgrades the embedding model from v1 to v2, which produces vectors in a different embedding space. A developer proposes: 'We'll start using v2 for new inserts and gradually phase out v1 vectors as they age out of the system.' What's the critical problem with this plan?",
    options: [
      { label: "A", text: "v2 vectors will be higher dimensional, causing schema compatibility issues in the vector database" },
      { label: "B", text: "v1 and v2 vectors live in incompatible embedding spaces. A v2 query vector will compute meaningless similarity scores against v1 vectors — they're geometrically unrelated even if the source data is similar. You must re-embed ALL existing data with v2." },
      { label: "C", text: "The vector database will reject inserts from a different model version because it validates embedding provenance" },
      { label: "D", text: "v2 embeddings will cluster in a different region of the vector space, making the ANN index's cluster assignments suboptimal" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content explicitly warns: 'If you change your embedding model, all your old embeddings are now incompatible. You either need to re-embed everything (expensive) or maintain multiple indexes during a transition.' Different model versions produce vectors in fundamentally different spaces — a v2 query against v1 vectors produces meaningless distances, like comparing GPS coordinates from different map projections. The gradual phase-out plan would result in degraded search quality for months as v1 vectors return increasingly random results against v2 queries.",
    interviewScript: "In your interview, say: 'This is the embedding drift problem. Different model versions produce vectors in incompatible spaces — comparing v2 query vectors against v1 stored vectors gives meaningless results. It's like comparing coordinates from different map projections. You need to either re-embed everything with v2, or maintain separate indexes per model version and merge results at query time. There's no gradual migration path.'",
    proTip: "Mentioning that APIs should include the model version in embedding metadata shows you think about operational concerns. The content specifically recommends this."
  },
  // q35 — Cold Start
  {
    id: "q35",
    subtopic: "Cold Start Problem",
    tier: "Thin",
    style: "Scenario-based trade-off",
    question: "Your recommendation system embeds user behavior (clicks, purchases, watch history) to find similar users. A brand-new user signs up and immediately asks for recommendations. Your vector search returns no meaningful results because the user has no behavior to embed. What's the strongest approach?",
    options: [
      { label: "A", text: "Generate a random embedding for new users and let the vector search return results — random vectors will find random but potentially interesting items" },
      { label: "B", text: "Fall back to popularity-based or demographic-based recommendations for new users until enough behavioral signal accumulates to generate a meaningful embedding, then transition to vector-based recommendations" },
      { label: "C", text: "Pre-compute a 'default user' embedding as the average of all existing user embeddings and use it for cold start queries" },
      { label: "D", text: "Ask the user to rate 10 items before accessing the platform to bootstrap their embedding" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content identifies cold start as a key limitation: 'If you're embedding user behavior to find similar users, new users have no behavior to embed. You need fallback strategies.' The standard approach is popularity or demographic fallback: show new users what's generally popular or what's popular among users with similar demographics, then transition to personalized vector-based recommendations as behavioral data accumulates. Option A produces random, likely poor results. Option C (average embedding) returns generic, mediocre results. Option D creates a high-friction onboarding experience.",
    interviewScript: "In your interview, say: 'Cold start is a known limitation of behavioral embedding approaches. For new users, I'd fall back to a popularity-based or demographic-based recommendation strategy. As the user accumulates behavioral signal — clicks, purchases, watches — we progressively build their embedding and transition to vector-based personalization. The key is having a graceful fallback that doesn't require behavioral data.'",
    proTip: null
  },
  // q36 — Cluster: SIMD/GPU + Exact vs Approximate (gotcha)
  {
    id: "q36",
    subtopic: "SIMD/GPU Optimization + Exact vs Approximate",
    tier: "Thin (Clustered)",
    style: "Gotcha/trap",
    question: "A colleague argues: 'With GPU-accelerated brute force, we can do exact KNN over 100M vectors in 10ms, so we don't need ANN indexes at all.' This benchmark is technically plausible for a single query. Why might this argument fail in production?",
    options: [
      { label: "A", text: "GPUs can't perform floating point operations with sufficient precision for similarity calculations" },
      { label: "B", text: "A single query can saturate a GPU, but under real load with thousands of concurrent queries, GPU compute becomes the bottleneck — you'd need many expensive GPUs. ANN indexes on CPU serve the same throughput at a fraction of the hardware cost." },
      { label: "C", text: "GPU memory is limited to 16GB, which can't hold 100M vectors" },
      { label: "D", text: "GPUs add too much network latency transferring vectors between CPU and GPU memory for each query" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The content notes that GPUs can accelerate single-query exact KNN but frames ANN as necessary for practical systems. The trap in the colleague's argument is confusing single-query latency with throughput under load. A GPU computing brute-force over 100M vectors uses massive parallelism for ONE query — but that same GPU can't simultaneously handle thousands of concurrent queries. At production throughput (tens of thousands QPS), you'd need a fleet of expensive GPUs. ANN indexes achieve similar latency on commodity CPUs with far better cost efficiency at scale. Option C understates modern GPU memory. Option D overstates transfer latency for resident data.",
    interviewScript: "In your interview, say: 'Single-query GPU brute force is fast, but it monopolizes the GPU for one query. Under real load at thousands of QPS, you'd need a fleet of expensive GPUs. ANN indexes on CPUs achieve similar single-query latency but with far better throughput per dollar — each CPU core handles a query independently with O(log n) work instead of O(n). The economics overwhelmingly favor ANN indexes at scale.'",
    proTip: null
  },
  // q37 — Cluster: Interview Scenarios (RAG, Semantic, Dedup)
  {
    id: "q37",
    subtopic: "Interview Scenarios",
    tier: "Thin (Clustered)",
    style: "Decision framework",
    question: "In an interview, you're asked to design 'a system that detects near-duplicate support tickets so agents don't work on the same issue twice.' A colleague suggests full-text search with BM25. What's the strongest argument for using vector search instead?",
    options: [
      { label: "A", text: "Vector search is faster than BM25 for large datasets because ANN is O(log n) while BM25 is O(n)" },
      { label: "B", text: "BM25 matches keywords, but duplicate tickets often describe the same issue with completely different words. 'My app keeps crashing on login' and 'Authentication screen freezes and force-closes' are near-duplicates that share zero keywords but have very similar embeddings." },
      { label: "C", text: "BM25 can't handle multilingual tickets, while vector embeddings work across languages" },
      { label: "D", text: "Vector search supports threshold-based retrieval ('find all tickets with similarity > 0.9') while BM25 only supports ranked retrieval" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The core advantage of vector search for deduplication is semantic matching. Support tickets describing the same issue use wildly different terminology — users have different vocabularies, phrasings, and levels of technical knowledge. BM25 relies on keyword overlap and would miss 'app crashing on login' vs 'authentication screen freezes' entirely. Vector embeddings capture the semantic similarity despite zero keyword overlap. This maps directly to the content's deduplication use case: 'detecting plagiarism, finding similar support tickets, or identifying duplicate listings.' Option D has some validity but isn't the strongest argument.",
    interviewScript: "In your interview, say: 'Duplicate tickets rarely use the same words. One user says \"app crashes on login,\" another says \"authentication screen freezes.\" BM25 sees zero keyword overlap and misses the duplicate entirely. Vector embeddings capture that both describe the same failure scenario. For near-duplicate detection, semantic similarity is fundamentally more useful than keyword matching.'",
    proTip: null
  },
  // q38 — Bridge: Filtering × Architecture
  {
    id: "q38",
    subtopic: "Filtering × Architecture",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "You're designing a job matching platform with 50M candidate profiles. Recruiters search by semantic skills match (vector) but always filter by location, experience level, and work authorization. You chose Pattern 1 (vector DB as separate service) with Pinecone. Your interviewer asks: 'How does your filtering strategy change if you switch to pgvector?' What's the most accurate response?",
    options: [
      { label: "A", text: "'No change — both systems support metadata filtering, so the filter strategy is identical'" },
      { label: "B", text: "'With Pinecone, filters are applied during ANN traversal using integrated metadata indexes. With pgvector, the PostgreSQL query planner chooses between the vector index and B-tree indexes. For highly selective filters (common in recruiting), pgvector may actually be faster because Postgres can pre-filter with B-tree indexes and brute-force similarity on the small result set.'" },
      { label: "C", text: "'pgvector doesn't support filtering at all — you'd need to implement post-filtering in application code'" },
      { label: "D", text: "'pgvector is strictly worse at filtering because it can't integrate filters into the HNSW traversal'" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This tests understanding of how different systems handle filtered vector search. Pinecone integrates filtering into ANN traversal with specialized metadata indexes. pgvector delegates to PostgreSQL's query planner, which can use B-tree indexes for pre-filtering, then brute-force vector distance on the filtered set. For recruiting queries with restrictive filters (specific location + experience + authorization might match 0.1% of profiles), pgvector's approach can actually be faster because B-tree pre-filtering is very efficient for selective predicates. Neither is universally better — it depends on filter selectivity.",
    interviewScript: "In your interview, say: 'The filtering behavior changes significantly. Pinecone applies filters during ANN traversal — it intersects metadata filtering with vector search in a single operation. pgvector relies on PostgreSQL's query planner, which may use B-tree indexes for pre-filtering before brute-force similarity. For recruiting with restrictive filters, pgvector's approach can actually be faster because Postgres is excellent at selective pre-filtering. The optimal strategy depends heavily on filter selectivity.'",
    proTip: null
  },
  // q39 — Bridge: Index Type × Scale
  {
    id: "q39",
    subtopic: "Index Strategy × Scale Decision",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "You're designing a system that must handle two workloads: (1) a 500M vector corpus that changes monthly via batch updates, and (2) a 200K vector 'trending items' set that changes every few minutes. Which index strategy best addresses BOTH workloads simultaneously?",
    options: [
      { label: "A", text: "Use HNSW for both — it handles any scale with consistent performance" },
      { label: "B", text: "Use HNSW for the 500M corpus (optimized for read performance at scale) and a flat brute-force index for the 200K trending set (fast to rebuild, trivially handles frequent updates at this size)" },
      { label: "C", text: "Use IVF for both — its cluster-based approach handles updates more gracefully than HNSW" },
      { label: "D", text: "Use Annoy for the 500M corpus (memory-mapped for efficiency) and LSH for the 200K trending set (handles streaming updates)" }
    ],
    correct: 1,
    confidence: null,
    explanation: "This requires matching index properties to workload characteristics. The 500M static corpus needs HNSW for best query performance — monthly batch updates are infrequent enough to absorb HNSW's rebuild cost. The 200K trending set changes every few minutes — at this size, brute-force is sub-millisecond and rebuilding is instant. Adding ANN indexing overhead for 200K vectors is unnecessary complexity. Option D uses Annoy which is immutable — fine for monthly updates but the question is about the optimal pairing. Option A ignores the write cost of HNSW for frequent updates.",
    interviewScript: "In your interview, say: 'I'd split the indexing strategy by workload. The 500M static corpus gets HNSW — best read performance, and monthly batch updates align with HNSW's rebuild cadence. The 200K trending set uses brute-force — at this size, it's sub-millisecond and trivially handles frequent updates. This is essentially the hot/cold pattern: the trending set is the hot index with no ANN overhead needed.'",
    proTip: null
  },
  // q40 — Bridge: Hot/Cold × Consistency
  {
    id: "q40",
    subtopic: "Hot/Cold Index × Consistency",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your e-commerce search uses a hot/cold index pattern. A product is soft-deleted from the cold HNSW index (marked as deleted) but hasn't been compacted yet. A customer searches and the soft-deleted product appears in results from the HNSW traversal. Your system filters it out. But now the customer only sees 9 results instead of the requested 10. How should the system handle this?",
    options: [
      { label: "A", text: "Return 9 results — users won't notice one missing result, and over-engineering this edge case isn't worth it" },
      { label: "B", text: "Request more candidates than K from the HNSW search (e.g., K × 1.2), then apply the soft-delete filter, and return exactly K results from the surviving candidates. The over-fetch factor accounts for soft-deleted vectors." },
      { label: "C", text: "Maintain a separate count of soft-deleted vectors and subtract from the total before reporting result counts to the user" },
      { label: "D", text: "Re-run the search with a higher K parameter until exactly 10 non-deleted results are found" }
    ],
    correct: 1,
    confidence: null,
    explanation: "The standard approach is over-fetching: request more candidates than needed from the ANN search, apply filters (including soft-delete checks), and return exactly K results. The over-fetch factor depends on the expected deletion rate. If 5% of vectors are soft-deleted, requesting K × 1.1 usually suffices. This is the same pattern used for any post-filtering scenario. Option A is acceptable for low-stakes applications but suboptimal. Option D is wasteful — multiple searches instead of one over-fetched search. Option C addresses the symptom, not the cause.",
    interviewScript: "In your interview, say: 'This is a classic post-filtering problem applied to soft deletes. The solution is over-fetching: request K times some factor from the HNSW search — say 1.2x if our soft-delete rate is around 10%. Apply the soft-delete filter on the expanded candidate set, and return exactly K results. This is the same principle as post-filtering for any metadata constraint — always fetch more than you need to account for filtered-out candidates.'",
    proTip: null
  }
];

const SUBTOPIC_INFO = [
  { name: "HNSW", tier: "Heavy", count: 4 },
  { name: "Filtering & Hybrid Search", tier: "Heavy", count: 4 },
  { name: "Inserts, Updates & Index Maintenance", tier: "Heavy", count: 3 },
  { name: "Architecture Patterns", tier: "Heavy", count: 4 },
  { name: "Vectors & Embeddings", tier: "Medium", count: 2 },
  { name: "Similarity Metrics", tier: "Medium", count: 2 },
  { name: "IVF (Inverted File Index)", tier: "Medium", count: 2 },
  { name: "LSH (Locality Sensitive Hashing)", tier: "Medium", count: 2 },
  { name: "Annoy", tier: "Medium", count: 2 },
  { name: "Vector DB Options", tier: "Medium", count: 2 },
  { name: "Numbers to Know", tier: "Medium", count: 2 },
  { name: "Gotchas & Limitations", tier: "Medium", count: 2 },
  { name: "Exact KNN & Brute Force", tier: "Thin", count: 1 },
  { name: "ANN Recall Metric", tier: "Thin", count: 1 },
  { name: "Embedding Drift", tier: "Thin", count: 1 },
  { name: "Cold Start Problem", tier: "Thin", count: 1 },
  { name: "SIMD/GPU + Exact vs Approximate", tier: "Thin (Clustered)", count: 1 },
  { name: "Interview Scenarios", tier: "Thin (Clustered)", count: 1 },
  { name: "Filtering × Architecture", tier: "Bridge", count: 1 },
  { name: "Index Strategy × Scale", tier: "Bridge", count: 1 },
  { name: "Hot/Cold × Consistency", tier: "Bridge", count: 1 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const CONFIDENCE_LEVELS = ["Guessing", "Somewhat Sure", "Very Confident"];

const TIER_COLORS = {
  Heavy: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  Medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  Thin: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  "Thin (Clustered)": { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
  Bridge: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

export default function VectorDatabaseQuiz({ quizSlug = 'advanced-vector-databases' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(90);
  const [timedOut, setTimedOut] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultTab, setResultTab] = useState("overview");
  const [expandedTiers, setExpandedTiers] = useState({ Heavy: true, Medium: false, Thin: false, "Thin (Clustered)": false, Bridge: false });
  const timerRef = useRef(null);

  const {
    saveAnswer: persistAnswer,
    completeQuiz,
    resumeData,
    startNewAttempt,
    saveQuestionOrder: persistQuestionOrder,
    resumeAttempt,
    isResuming,
  } = useQuizProgress(quizSlug, QUESTIONS.length);
  const totalTimerRef = useRef(null);

  const currentQ = questions[currentIdx];

  const detectMode = useCallback((questionSet) => {
    const naturalOrder = QUESTIONS.filter((question) =>
      questionSet.some((candidate) => candidate.id === question.id)
    ).map((question) => question.id);
    const currentOrder = questionSet.map((question) => question.id);
    return naturalOrder.every((id, idx) => id === currentOrder[idx]) ? "section" : "shuffled";
  }, []);

  const startQuiz = (selectedMode) => {
    const ordered = selectedMode === "shuffled" ? shuffle(QUESTIONS) : [...QUESTIONS];
    startNewAttempt(ordered.map((question) => question.id));
    setQuestions(ordered);
    setMode(selectedMode);
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setShowExplanation(false);
    setScreen("quiz");
  };

  const handleResume = useCallback(() => {
    if (!resumeData) return;

    const restoredQuestions =
      resumeData.questionOrder && resumeData.questionOrder.length > 0
        ? resumeData.questionOrder
            .map((id) => QUESTIONS.find((question) => question.id === id))
            .filter(Boolean)
        : [...QUESTIONS];

    if (restoredQuestions.length === 0) return;

    const restoredAnswers = {};
    Object.entries(resumeData.questionResults).forEach(([questionId, result]) => {
      restoredAnswers[questionId] = {
        selected: result.selectedIndex ?? -1,
        confidence: result.timedOut ? null : result.confidence,
        correct: !!result.isCorrect,
        timedOut: !!result.timedOut,
      };
    });

    const nextIndex = restoredQuestions.findIndex((question) => !resumeData.questionResults[question.id]);

    setQuestions(restoredQuestions);
    setMode(detectMode(restoredQuestions));
    setCurrentIdx(nextIndex === -1 ? Math.max(restoredQuestions.length - 1, 0) : nextIndex);
    setAnswers(restoredAnswers);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setShowExplanation(false);
    setResultTab("overview");
    setScreen("quiz");
    resumeAttempt();
  }, [resumeData, resumeAttempt, detectMode]);

  useEffect(() => {
    if (screen === "quiz" && !submitted && !timedOut) {
      return;
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setTimedOut(true);
            setShowExplanation(true);
            persistAnswer(currentQ.id, {
              selectedIndex: null,
              correctIndex: currentQ.correct,
              isCorrect: false,
              timedOut: true,
            });
            setAnswers((prev) => ({
              ...prev,
              [currentQ.id]: { selected: -1, confidence: null, correct: false, timedOut: true },
            }));
            return 0;
          }
          return t;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, currentIdx, submitted, timedOut, currentQ, persistAnswer]);

  useEffect(() => {
    if (screen === "quiz") {
      totalTimerRef.current = setInterval(() => {
        setTotalTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(totalTimerRef.current);
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || submitted || timedOut) return;
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (["1", "2", "3", "4"].includes(key)) {
        setSelectedOption(parseInt(key) - 1);
      } else if (["a", "b", "c", "d"].includes(key)) {
        setSelectedOption("abcd".indexOf(key));
      } else if (key === "enter" && selectedOption !== null && confidence !== null) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submitted, timedOut, selectedOption, confidence]);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || confidence === null) return;
    clearInterval(timerRef.current);
    const isCorrect = selectedOption === currentQ.correct;
    persistAnswer(currentQ.id, {
      selectedIndex: selectedOption,
      correctIndex: currentQ.correct,
      isCorrect,
      confidence,
    });
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { selected: selectedOption, confidence, correct: isCorrect, timedOut: false },
    }));
    setSubmitted(true);
    setShowExplanation(true);
  }, [selectedOption, confidence, currentQ, persistAnswer]);

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      clearInterval(totalTimerRef.current);
      completeQuiz(
        {
          correct: Object.values(answers).filter((answer) => answer.correct).length,
          total: questions.length,
        },
        totalTime
      );
      setScreen("results");
      return;
    }
    setCurrentIdx(nextIdx);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setTimedOut(false);
    setShowExplanation(false);
    setTimer(90);
  };

  const handleSkip = () => {
    setSkipped((prev) => [...prev, currentQ.id]);
    if (currentIdx < questions.length - 1) {
      const reorderedQuestions = [
        ...questions.slice(0, currentIdx),
        ...questions.slice(currentIdx + 1),
        currentQ,
      ];
      persistQuestionOrder(reorderedQuestions.map((question) => question.id));
      setQuestions(reorderedQuestions);
      resetQuestionState();
      return;
    }

    clearInterval(totalTimerRef.current);
    completeQuiz(
      {
        correct: Object.values(answers).filter((answer) => answer.correct).length,
        total: questions.length,
      },
      totalTime
    );
    setScreen("results");
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const getScore = () => {
    const total = questions.length;
    const correct = Object.values(answers).filter((a) => a.correct).length;
    return { total, correct, pct: Math.round((correct / total) * 100) };
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { label: "Staff-ready", desc: "You'd ace this topic", color: "text-emerald-400" };
    if (pct >= 75) return { label: "Strong Senior", desc: "Solid, minor gaps to close", color: "text-green-400" };
    if (pct >= 60) return { label: "SDE2-level", desc: "Review the weak areas below", color: "text-yellow-400" };
    return { label: "Needs deep review", desc: "Revisit the fundamentals", color: "text-red-400" };
  };

  const getSubtopicScores = () => {
    const scores = {};
    questions.forEach((q) => {
      const st = q.subtopic;
      if (!scores[st]) scores[st] = { correct: 0, total: 0, tier: q.tier };
      scores[st].total++;
      if (answers[q.id]?.correct) scores[st].correct++;
    });
    return scores;
  };

  const getLuckyGuesses = () =>
    questions.filter((q) => answers[q.id]?.correct && answers[q.id]?.confidence === "Guessing");

  const getOverconfidentMisses = () =>
    questions.filter((q) => !answers[q.id]?.correct && answers[q.id]?.confidence === "Very Confident");

  const getIncorrect = () => questions.filter((q) => !answers[q.id]?.correct);
  const getFlaggedQs = () => questions.filter((q) => flagged[q.id]);

  const retryMissed = () => {
    const missed = getIncorrect().map((q) => q.id);
    const qs = shuffle(QUESTIONS.filter((q) => missed.includes(q.id)));
    startNewAttempt(qs.map((question) => question.id));
    setQuestions(qs);
    setMode("shuffled");
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setShowExplanation(false);
    setScreen("quiz");
  };

  const retryWeakSubtopics = () => {
    const scores = getSubtopicScores();
    const weakSTs = Object.entries(scores)
      .filter(([, v]) => Math.round((v.correct / v.total) * 100) < 70)
      .map(([k]) => k);
    const qs = shuffle(QUESTIONS.filter((q) => weakSTs.includes(q.subtopic)));
    if (qs.length === 0) return;
    startNewAttempt(qs.map((question) => question.id));
    setQuestions(qs);
    setMode("shuffled");
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setFlagged({});
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setShowExplanation(false);
    setScreen("quiz");
  };

  // Landing Screen
  if (screen === "landing") {
    const tierGroups = {};
    SUBTOPIC_INFO.forEach((s) => {
      const key = s.tier.startsWith("Thin") ? "Thin" : s.tier;
      if (!tierGroups[key]) tierGroups[key] = [];
      tierGroups[key].push(s);
    });

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4">
              <Zap size={14} /> FAANG SDE2 — Hard
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vector Databases
            </h1>
            <p className="text-gray-400 mb-1">
              Deep dive quiz covering ANN indexing, HNSW, filtering, architecture patterns, and operational gotchas.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-3">
              <span className="flex items-center gap-1"><BookOpen size={14} /> {QUESTIONS.length} questions</span>
              <span className="flex items-center gap-1"><Clock size={14} /> ~{Math.round(QUESTIONS.length * 75 / 60)} min</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Coverage Breakdown</h3>
            {Object.entries(tierGroups).map(([tier, items]) => {
              const tc = TIER_COLORS[tier] || TIER_COLORS["Heavy"];
              return (
                <div key={tier} className="mb-3">
                  <div className={`text-xs font-semibold ${tc.text} mb-1`}>{tier.toUpperCase()} ({items.reduce((s, i) => s + i.count, 0)} questions)</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s.name} className={`text-xs px-2 py-1 rounded ${tc.bg} ${tc.text} border ${tc.border}`}>
                        {s.name} ({s.count})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startQuiz("section")}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
            >
              Section Order
            </button>
            <button
              onClick={() => startQuiz("shuffled")}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
            >
              Shuffled (Recommended)
            </button>
          </div>

          {isResuming && resumeData && (
            <button
              onClick={handleResume}
              className="mt-3 w-full py-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 font-medium hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Resume Quiz ({resumeData.answeredCount}/{resumeData.questionOrder?.length || QUESTIONS.length})
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (screen === "quiz" && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timerColor = timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-300";
    const timerBg = timer <= 15 ? "bg-red-500/20" : timer <= 30 ? "bg-amber-500/20" : "bg-gray-800";
    const tc = TIER_COLORS[currentQ.tier] || TIER_COLORS["Heavy"];

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {currentIdx + 1} / {questions.length}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timerBg}`}>
              <Clock size={16} className={timerColor} />
              <span className={`font-mono font-bold ${timerColor}`}>{formatTime(timer)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Subtopic tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-1 rounded ${tc.bg} ${tc.text} border ${tc.border}`}>
              {currentQ.subtopic}
            </span>
            <span className="text-xs text-gray-600">{currentQ.style}</span>
          </div>

          {/* Question */}
          <h2 className="text-lg font-medium leading-relaxed mb-6">{currentQ.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              let optClass = "bg-gray-900 border-gray-800 hover:border-gray-600 cursor-pointer";
              if (selectedOption === i && !submitted && !timedOut) {
                optClass = "bg-blue-500/10 border-blue-500 cursor-pointer";
              }
              if (submitted || timedOut) {
                if (i === currentQ.correct) {
                  optClass = "bg-emerald-500/10 border-emerald-500";
                } else if (i === (answers[currentQ.id]?.selected ?? selectedOption) && i !== currentQ.correct) {
                  optClass = "bg-red-500/10 border-red-500";
                } else {
                  optClass = "bg-gray-900 border-gray-800 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!submitted && !timedOut) setSelectedOption(i);
                  }}
                  disabled={submitted || timedOut}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${optClass}`}
                >
                  <div className="flex gap-3">
                    <span className="font-bold text-gray-500 shrink-0">{opt.label}.</span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence + Submit */}
          {!submitted && !timedOut && selectedOption !== null && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">How confident are you?</div>
              <div className="flex gap-2 mb-4">
                {CONFIDENCE_LEVELS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfidence(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      confidence === c
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {confidence && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  Submit Answer (Enter)
                </button>
              )}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-xl border ${
                answers[currentQ.id]?.correct
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {answers[currentQ.id]?.correct ? (
                    <><CheckCircle size={18} className="text-emerald-400" /><span className="font-semibold text-emerald-400">Correct!</span></>
                  ) : (
                    <><XCircle size={18} className="text-red-400" /><span className="font-semibold text-red-400">Incorrect</span></>
                  )}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{currentQ.explanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Interview Script</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">{currentQ.interviewScript}</p>
              </div>

              {currentQ.proTip && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={16} className="text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Pro Tip</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{currentQ.proTip}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                {currentIdx + 1 >= questions.length && skipped.filter((id) => !answers[id]).length === 0
                  ? "See Results"
                  : "Next Question"}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Action buttons */}
          {!submitted && !timedOut && (
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <SkipForward size={16} /> Skip
              </button>
              <button
                onClick={toggleFlag}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  flagged[currentQ.id]
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Flag size={16} /> {flagged[currentQ.id] ? "Flagged" : "Flag for Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (screen === "results") {
    const { total, correct, pct } = getScore();
    const grade = getGrade(pct);
    const stScores = getSubtopicScores();
    const luckyGuesses = getLuckyGuesses();
    const overconfidentMisses = getOverconfidentMisses();
    const incorrect = getIncorrect();
    const flaggedQs = getFlaggedQs();

    const tiers = ["Heavy", "Medium", "Thin", "Thin (Clustered)", "Bridge"];

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score Header */}
          <div className="text-center mb-8 pt-6">
            <div className="text-6xl font-bold mb-2">{pct}%</div>
            <div className={`text-xl font-semibold ${grade.color}`}>{grade.label}</div>
            <div className="text-gray-500 text-sm">{grade.desc}</div>
            <div className="text-gray-600 text-sm mt-2">
              {correct}/{total} correct in {formatTime(totalTime)}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 overflow-x-auto">
            {[
              { key: "overview", label: "Overview" },
              { key: "confidence", label: "Confidence" },
              { key: "incorrect", label: `Incorrect (${incorrect.length})` },
              { key: "flagged", label: `Flagged (${flaggedQs.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setResultTab(tab.key)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  resultTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {resultTab === "overview" && (
            <div className="space-y-4">
              {tiers.map((tier) => {
                const entries = Object.entries(stScores).filter(([, v]) => v.tier === tier);
                if (entries.length === 0) return null;
                const tc = TIER_COLORS[tier] || TIER_COLORS["Heavy"];
                return (
                  <div key={tier}>
                    <div className={`text-xs font-semibold ${tc.text} mb-2`}>{tier.toUpperCase()}</div>
                    {entries.map(([name, data]) => {
                      const stPct = Math.round((data.correct / data.total) * 100);
                      const barColor =
                        stPct >= 75 ? "bg-emerald-500" : stPct >= 50 ? "bg-yellow-500" : "bg-red-500";
                      return (
                        <div key={name} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{name}</span>
                            <span className="text-gray-500">
                              {data.correct}/{data.total} ({stPct}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} rounded-full transition-all`}
                              style={{ width: `${stPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* Confidence Tab */}
          {resultTab === "confidence" && (
            <div className="space-y-6">
              {luckyGuesses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">
                      Lucky Guesses — hidden weak spots ({luckyGuesses.length})
                    </span>
                  </div>
                  {luckyGuesses.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-2">
                      <div className="text-sm text-gray-300">{q.question}</div>
                      <div className="text-xs text-gray-500 mt-1">{q.subtopic}</div>
                    </div>
                  ))}
                </div>
              )}
              {overconfidentMisses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-sm font-semibold text-red-400">
                      Overconfident Misses — dangerous misconceptions ({overconfidentMisses.length})
                    </span>
                  </div>
                  {overconfidentMisses.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-2">
                      <div className="text-sm text-gray-300">{q.question}</div>
                      <div className="text-xs text-gray-500 mt-1">{q.subtopic}</div>
                      <div className="text-xs text-gray-400 mt-2">{q.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
              {luckyGuesses.length === 0 && overconfidentMisses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <CheckCircle size={32} className="mx-auto mb-2 text-emerald-400" />
                  <p>Great calibration! No lucky guesses or overconfident misses.</p>
                </div>
              )}
            </div>
          )}

          {/* Incorrect Tab */}
          {resultTab === "incorrect" && (
            <div className="space-y-4">
              {incorrect.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Trophy size={32} className="mx-auto mb-2 text-emerald-400" />
                  <p>Perfect score! No incorrect answers.</p>
                </div>
              ) : (
                incorrect.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">{q.subtopic}</div>
                    <div className="text-sm text-gray-200 mb-2">{q.question}</div>
                    {answers[q.id]?.selected >= 0 && (
                      <div className="text-sm text-red-400 mb-1">
                        Your answer: {q.options[answers[q.id].selected]?.label}. {q.options[answers[q.id].selected]?.text.substring(0, 80)}...
                      </div>
                    )}
                    <div className="text-sm text-emerald-400 mb-2">
                      Correct: {q.options[q.correct].label}. {q.options[q.correct].text.substring(0, 80)}...
                    </div>
                    <div className="text-xs text-gray-400">{q.explanation}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Flagged Tab */}
          {resultTab === "flagged" && (
            <div className="space-y-4">
              {flaggedQs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Flag size={32} className="mx-auto mb-2" />
                  <p>No flagged questions.</p>
                </div>
              ) : (
                flaggedQs.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">{q.subtopic}</div>
                    <div className="text-sm text-gray-200 mb-2">{q.question}</div>
                    <div className="text-sm text-emerald-400 mb-2">
                      Correct: {q.options[q.correct].label}. {q.options[q.correct].text}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{q.explanation}</div>
                    {q.proTip && (
                      <div className="text-xs text-purple-400 mt-1">
                        <span className="font-semibold">Pro Tip:</span> {q.proTip}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-8 pb-8">
            <button
              onClick={retryMissed}
              disabled={incorrect.length === 0}
              className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Retry Missed ({incorrect.length})
            </button>
            <button
              onClick={retryWeakSubtopics}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              <Target size={16} /> Retry Weak Subtopics
            </button>
          </div>
          <div className="pb-8">
            <button
              onClick={() => setScreen("landing")}
              className="w-full py-3 rounded-xl bg-gray-800 text-gray-400 font-medium hover:bg-gray-700 transition-colors"
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
