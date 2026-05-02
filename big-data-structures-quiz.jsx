// === COVERAGE MANIFEST ===
// Content type: deep pattern (probabilistic data structures for big data)
//
// HEAVY subtopics:
//   Bloom Filter Mechanics — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Hash functions & bit arrays — covered by: [q1, q2]
//     └─ False positives vs false negatives — covered by: [q3]
//     └─ Saturation & degradation — covered by: [q4]
//   Count-Min Sketch Mechanics — Questions: 3 — IDs: [q8, q9, q10]
//     └─ 2D array & hash functions — covered by: [q8]
//     └─ Upper-bound estimation (min of counters) — covered by: [q9]
//     └─ Width vs Depth tradeoff — covered by: [q10]
//   HyperLogLog Mechanics — Questions: 3 — IDs: [q15, q16, q17]
//     └─ Leading zeros & coin flip intuition — covered by: [q15]
//     └─ Bucket partitioning & harmonic mean — covered by: [q16]
//     └─ Accuracy vs memory tradeoff — covered by: [q17]
//   Bloom Filter Use-Cases & Pitfalls — Questions: 4 — IDs: [q5, q6, q7, q33]
//     └─ Web crawling — covered by: [q5]
//     └─ Cache optimization — covered by: [q6]
//     └─ No deletion support — covered by: [q7]
//     └─ Over-engineering pitfall — covered by: [q33]
//   Count-Min Sketch Use-Cases — Questions: 3 — IDs: [q11, q12, q13]
//     └─ Top-K approximation — covered by: [q11]
//     └─ LFU caching — covered by: [q12]
//     └─ Redis pseudo-counter (not CMS) — covered by: [q13]
//
// MEDIUM subtopics:
//   HyperLogLog Use-Cases — Questions: 2 — IDs: [q18, q19]
//     └─ Analytics (DAU/MAU) — covered by: [q18]
//     └─ Security / anti-scraping — covered by: [q19]
//   Approximate Quantiles Mechanics — Questions: 2 — IDs: [q22, q23]
//     └─ Fixed-width vs exponential vs dynamic buckets — covered by: [q22]
//     └─ Cumulative vs per-bucket counting — covered by: [q23]
//   Approximate Quantiles Use-Cases — Questions: 2 — IDs: [q24, q25]
//     └─ SLOs & performance monitoring — covered by: [q24]
//     └─ Auto-scaling decisions — covered by: [q25]
//   Space-Accuracy Tradeoffs (cross-structure) — Questions: 2 — IDs: [q26, q27]
//   When NOT to Use Probabilistic Structures — Questions: 2 — IDs: [q28, q29]
//
// THIN subtopics (standalone):
//   Bloom Filter Sizing (m and k) — Questions: 1 — IDs: [q30]
//   HLL Memory Efficiency (1.5KB → 2% error) — Questions: 1 — IDs: [q31]
//   Dynamic Histograms Complexity — Questions: 1 — IDs: [q32]
//
// THIN subtopics (clustered):
//   Cluster: CMS Known-Items Requirement + CMS Space Constraint — Questions: 1 — IDs: [q14]
//   Cluster: HLL Cache Sizing + Working Set Analysis — Questions: 1 — IDs: [q20]
//   Cluster: Bucket Boundary Selection + Extreme Percentile Accuracy — Questions: 1 — IDs: [q21]
//
// CROSS-SUBTOPIC bridges:
//   Bloom Filter × Count-Min Sketch — IDs: [q34]
//   HyperLogLog × Approximate Quantiles — IDs: [q35]
//   Bloom Filter × HyperLogLog — IDs: [q36]
//   Count-Min Sketch × Approximate Quantiles — IDs: [q37]
//
// Anti-pattern questions: 4 — IDs: [q28, q29, q33, q13]
// Gotcha/trap questions: 4 — IDs: [q7, q14, q21, q30]
//
// Total: 37 questions across 15 subtopics (5 heavy, 5 medium, 5 thin/clustered)
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Bloom Filter Mechanics",
    "tier": "Heavy",
    "style": "Scenario-based trade-off",
    "question": "You're designing a distributed URL deduplication service for a web crawler processing 10 billion URLs. Each URL averages 80 bytes. Your team has 2GB of RAM budget for the deduplication index. A junior engineer proposes using a standard hash set. What is the most critical reason this approach fails, and why does a Bloom filter address it?",
    "options": [
      {
        "label": "A",
        "text": "A hash set for 10B URLs at ~100 bytes per entry (key + overhead) needs ~1TB of RAM — far beyond the 2GB budget. A Bloom filter with 1% FPR needs ~11.5GB for 10B items, which is still large but can be sharded across nodes, and each shard fits in memory."
      },
      {
        "label": "B",
        "text": "Hash sets have O(n) lookup time for large datasets due to hash collisions. Bloom filters maintain O(1) lookups regardless of dataset size because they use multiple independent hash functions that distribute evenly."
      },
      {
        "label": "C",
        "text": "Hash sets can't be distributed across machines because they require consistent ordering. Bloom filters are inherently distributed because each bit is independent, so you can split the bit array across any number of nodes."
      },
      {
        "label": "D",
        "text": "The primary issue is that hash sets require storing the full key for collision resolution, but Bloom filters avoid this by using perfect hashing. With 10B items and k=7 hash functions, collisions are mathematically impossible."
      }
    ],
    "correctIndex": 0,
    "explanation": "The core problem is memory: storing 10B URLs with a hash set requires storing each URL (or a hash of it) plus overhead per entry, easily reaching hundreds of gigabytes to terabytes. A Bloom filter achieves ~80% space savings by only storing bits, not keys. Option B is wrong — hash sets are O(1) amortized, not O(n). Option C is wrong — hash sets can absolutely be distributed (consistent hashing). Option D is wrong — Bloom filters don't use perfect hashing and collisions are the source of false positives.",
    "interviewScript": "In your interview, say: 'The fundamental constraint is memory. At 10 billion URLs, a hash set needs to store each key, which at ~100 bytes per entry puts us at roughly a terabyte. A Bloom filter trades exactness for space — we accept a configurable false positive rate to reduce memory by ~80%, fitting our working set into a fraction of the RAM.'",
    "proTip": "In a real interview, mention that even Bloom filters at 10B scale are non-trivial (~11.5GB at 1% FPR). You'd likely partition the Bloom filter across crawler nodes, with each node responsible for a URL hash range."
  },
  {
    "id": "q2",
    "subtopic": "Bloom Filter Mechanics",
    "tier": "Heavy",
    "style": "Implementation-specific nuance",
    "question": "A Bloom filter uses k=3 hash functions and a bit array of size m=12. Elements X, Y, and Z are inserted. When checking membership for element W, all k bit positions for W are found to be set to 1. Which statement is MOST accurate?",
    "options": [
      {
        "label": "A",
        "text": "W is definitely in the set because all three hash positions are set. The probability of a false positive with k=3 is negligible."
      },
      {
        "label": "B",
        "text": "W is possibly in the set — this is a false positive scenario. The bits at W's hash positions were coincidentally set by the combined insertions of X, Y, and Z. We cannot distinguish this from a true positive."
      },
      {
        "label": "C",
        "text": "W is probably in the set with exactly 97% confidence, since k=3 hash functions with m=12 gives a mathematically fixed false positive rate of 3%."
      },
      {
        "label": "D",
        "text": "We can determine whether W is truly present by checking if removing any of X, Y, or Z's bits would clear one of W's positions, thereby confirming the overlap."
      }
    ],
    "correctIndex": 1,
    "explanation": "When all bits for W are set, it's either a true positive (W was inserted) or a false positive (other elements' hash positions coincidentally cover all of W's positions). This ambiguity is fundamental to Bloom filters — you can never confirm true membership, only confirm definite absence. Option A ignores that false positives are the defining characteristic. Option C fabricates a specific confidence number — FPR depends on n (elements inserted), m, and k together, not just k and m. Option D is impossible because Bloom filters don't track which element set which bit.",
    "interviewScript": "In your interview, say: 'This is the core guarantee of Bloom filters — when we see all bits set, we can only say the element is *possibly* present. The bits might have been set by other elements' hash functions overlapping. We can never confirm membership, only definitively confirm absence when any bit is unset.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "Bloom Filter Mechanics",
    "tier": "Heavy",
    "style": "Failure analysis",
    "question": "Your system uses a Bloom filter to check if a user has already received a promotional email. If the filter says 'probably yes,' you skip sending. If it says 'definitely no,' you send the email. After deployment, which failure mode will you observe?",
    "options": [
      {
        "label": "A",
        "text": "Some users who already received the email will receive it again (duplicate sends), because the Bloom filter has false negatives that incorrectly report 'definitely not in set' for users who were actually inserted."
      },
      {
        "label": "B",
        "text": "Some users who never received the email will be incorrectly skipped (missed sends), because the Bloom filter's false positives report 'probably in set' for users who were never inserted."
      },
      {
        "label": "C",
        "text": "Both duplicate sends and missed sends will occur at roughly equal rates, because Bloom filters have symmetric error — false positives and false negatives occur with the same probability."
      },
      {
        "label": "D",
        "text": "The system will work perfectly for the first million users but then suddenly fail for all subsequent users once the bit array saturates and every query returns 'probably yes.'"
      }
    ],
    "correctIndex": 1,
    "explanation": "Bloom filters have ONE type of error: false positives ('probably in set' when actually not). They NEVER have false negatives. So users who were inserted will never be missed — but users who were NOT inserted may be falsely reported as present, causing the system to skip sending them the email. This is the critical design consideration: you must ensure false positives lead to acceptable outcomes. Option A describes false negatives, which Bloom filters don't have. Option C is wrong — the error is asymmetric. Option D exaggerates — saturation is gradual, not sudden.",
    "interviewScript": "In your interview, say: 'Bloom filters only produce false positives, never false negatives. In this design, that means we'll occasionally skip users who should receive the email — the filter falsely claims they already got it. We need to verify this failure mode is acceptable for the business, or add a secondary check for the positive case.'",
    "proTip": "This is a classic interview trap. Always map the Bloom filter's error type to the business impact. False positives might be acceptable for web crawling (recrawl a page) but devastating for billing (skip a charge)."
  },
  {
    "id": "q4",
    "subtopic": "Bloom Filter Mechanics",
    "tier": "Heavy",
    "style": "Critical failure mode",
    "question": "A Bloom filter has been running in production for 6 months, accumulating insertions without any maintenance. The ops team notices the false positive rate has climbed from the designed 1% to over 40%. They propose three fixes. Which approach is MOST appropriate?",
    "options": [
      {
        "label": "A",
        "text": "Double the number of hash functions (k) to increase the uniqueness of each element's signature, which will reduce the collision rate and bring the false positive rate back down."
      },
      {
        "label": "B",
        "text": "Create a new, larger Bloom filter sized for the current element count, re-insert all elements from the authoritative data source, and swap it in. Accept that this requires access to the original data."
      },
      {
        "label": "C",
        "text": "Run a defragmentation pass that identifies and clears bits that were set by elements no longer relevant, reclaiming capacity in the existing bit array."
      },
      {
        "label": "D",
        "text": "Switch to a counting Bloom filter variant and decrement the oldest entries to free up capacity, since the standard Bloom filter's inability to delete is the root cause."
      }
    ],
    "correctIndex": 1,
    "explanation": "As more elements are inserted into a fixed-size Bloom filter, more bits are set to 1, increasing the false positive rate — this is saturation. The only reliable fix is rebuilding with a larger bit array (m). Option A is counterproductive: increasing k with a nearly-full bit array means MORE bits per element are checked, and since most bits are already 1, this actually increases false positives. Option C is impossible — standard Bloom filters cannot identify which element set which bit. Option D is conceptually interesting but you can't retroactively convert a standard Bloom filter to a counting one, and you'd need the original data anyway.",
    "interviewScript": "In your interview, say: 'This is a saturation problem — too many elements for the bit array size. The fix is rebuilding: create a new, properly-sized Bloom filter, re-insert all elements from the source of truth, and atomically swap it in. This requires maintaining access to the original dataset, which is an important operational consideration when designing systems with Bloom filters.'",
    "proTip": null
  },
  {
    "id": "q5",
    "subtopic": "Bloom Filter Use-Cases",
    "tier": "Heavy",
    "style": "Scenario-based trade-off",
    "question": "You're building a web crawler that needs to avoid recrawling URLs. Your Bloom filter has a 2% false positive rate. A colleague argues this means 2% of the internet will never be crawled. What's wrong with this reasoning, and what is the ACTUAL impact?",
    "options": [
      {
        "label": "A",
        "text": "The colleague is roughly correct — 2% of URLs will be permanently skipped because the Bloom filter will falsely report them as already crawled, and since there's no deletion, these URLs are lost forever."
      },
      {
        "label": "B",
        "text": "The 2% FPR means 2% of *uncrawled* URL *checks* return false positives, not 2% of all URLs. In practice, the same URL is often discovered multiple times, so a URL falsely skipped on one check may be correctly identified as new on a subsequent encounter with different hash collisions."
      },
      {
        "label": "C",
        "text": "The 2% FPR applies per-check, not per-URL. Each uncrawled URL checked against the filter has a 2% chance of being falsely skipped. But since this is per-query, the same URL checked later has the same 2% chance of being skipped again — the filter is deterministic for a given input, so the same URL will ALWAYS be falsely skipped."
      },
      {
        "label": "D",
        "text": "The 2% FPR is an average across all queries. In practice, URL hash distributions are non-uniform, so certain URL patterns will experience much higher false positive rates while others experience near-zero rates."
      }
    ],
    "correctIndex": 2,
    "explanation": "This is a critical gotcha. Bloom filters are DETERMINISTIC — the same input always produces the same hash values, so the same URL will always hit the same bit positions. If a URL is a false positive (all its bit positions happen to be set), it will be a false positive on EVERY check, not just 2% of checks. Option B is wrong because it suggests re-checking might succeed — it won't. The 2% means 2% of uncrawled URLs will be permanently invisible to the crawler. Option A is closest but says '2% of the internet' rather than '2% of uncrawled URLs checked.' Option D fabricates non-uniform hash distributions — good hash functions distribute uniformly.",
    "interviewScript": "In your interview, say: 'The key insight is that Bloom filters are deterministic — the same URL always hashes to the same positions. So a false positive isn't a random per-check event; it's a permanent classification for that specific URL. At 2% FPR, roughly 2% of *uncrawled* URLs we encounter will be permanently skipped. For a web crawler, this is usually acceptable since the web is vast and missing 2% of pages is tolerable.'",
    "proTip": "This deterministic nature is why Bloom filter false positive rates must be carefully chosen per use-case. For web crawling, 1-2% is fine. For a system where every item matters (like deduplicating financial transactions), a Bloom filter alone is insufficient."
  },
  {
    "id": "q6",
    "subtopic": "Bloom Filter Use-Cases",
    "tier": "Heavy",
    "style": "Multi-hop reasoning",
    "question": "Your team uses a Bloom filter to avoid unnecessary cache lookups. The cache uses TTL-based eviction. After running for a week, you notice the Bloom filter's benefit has decreased significantly — cache miss latency is barely improving. What's the root cause, and what's the best mitigation?",
    "options": [
      {
        "label": "A",
        "text": "The Bloom filter doesn't support deletion, so expired cache entries remain in the filter. Over time, the filter claims items are 'possibly cached' when they've been evicted, causing unnecessary cache lookups. Periodically rebuild the Bloom filter from the current cache contents."
      },
      {
        "label": "B",
        "text": "TTL eviction causes cache churn, which increases the hash collision rate in the Bloom filter. The fix is to increase the number of hash functions to compensate for the higher collision rate."
      },
      {
        "label": "C",
        "text": "The Bloom filter is saturating because every cache write adds to it but evictions don't remove. Switch to a counting Bloom filter so TTL evictions can decrement the counters."
      },
      {
        "label": "D",
        "text": "The cache's TTL is too aggressive, causing items to expire before the Bloom filter can converge on a stable set. Increase TTL to match the Bloom filter's optimal steady-state window."
      }
    ],
    "correctIndex": 0,
    "explanation": "Standard Bloom filters don't support deletion. When the cache evicts items via TTL, the Bloom filter still has those items' bits set. So the filter increasingly says 'possibly in cache' for items that have been evicted, defeating the purpose of skipping cache lookups. The practical fix is periodic rebuilding from the current cache state. Option B is nonsensical — cache churn doesn't affect hash collision rates. Option C correctly identifies the problem but a counting Bloom filter adds complexity and still needs to be synchronized with TTL events. Option D misunderstands the issue entirely.",
    "interviewScript": "In your interview, say: 'This is the classic Bloom filter deletion problem. Since standard Bloom filters can't remove elements, TTL-evicted cache entries remain as phantom positives. The filter gradually loses its ability to short-circuit cache misses. The practical solution is periodic rebuilding — snapshot the current cache keys and reconstruct the filter. This is cheap if the cache supports key enumeration.'",
    "proTip": null
  },
  {
    "id": "q7",
    "subtopic": "Bloom Filter Use-Cases",
    "tier": "Heavy",
    "style": "Gotcha/trap",
    "question": "A candidate proposes using a Bloom filter for a user blocklist service: 'We'll add blocked user IDs to the filter. When a message is sent, we check the filter — if the sender is blocked, we drop the message.' The interviewer nods and asks: 'What happens when a user unblocks someone?' What is the critical flaw?",
    "options": [
      {
        "label": "A",
        "text": "Unblocking requires removal, but standard Bloom filters don't support deletion. You can't clear a user's bits without potentially clearing bits shared by other blocked users. The blocklist would be append-only, making unblocking impossible without a full rebuild."
      },
      {
        "label": "B",
        "text": "Unblocking is fine — you simply rebuild the Bloom filter without the unblocked user. Since Bloom filters are small and fast to rebuild, this adds negligible latency."
      },
      {
        "label": "C",
        "text": "The issue isn't deletion but false positives — the Bloom filter might block messages from users who aren't actually on the blocklist, which is unacceptable for a messaging feature."
      },
      {
        "label": "D",
        "text": "Both deletion and false positives are problems, but the false positive issue is worse. You'd need to pair the Bloom filter with an exact check for positive results, which eliminates the performance benefit."
      }
    ],
    "correctIndex": 0,
    "explanation": "The primary flaw the interviewer is probing is that Bloom filters cannot support deletion. In a blocklist, users frequently block and unblock others, making this a mutable set. You cannot clear individual bits because they may be shared across multiple inserted elements. While Option C raises a valid secondary concern (false positives would incorrectly block messages), the interviewer specifically asked about unblocking, testing whether the candidate understands the no-deletion limitation. Option B's 'just rebuild' approach requires maintaining the full blocklist elsewhere, defeating the purpose. Option D combines concerns but misidentifies the primary issue.",
    "interviewScript": "In your interview, say: 'Standard Bloom filters are append-only — you can insert but never delete. For a blocklist where users frequently unblock, this is a dealbreaker. Each user's bits may overlap with others, so clearing them risks corrupting the filter. You'd need either a counting Bloom filter variant or, more practically, a regular hash set since blocklists per user are typically small enough to fit in memory.'",
    "proTip": "This is a great example of when NOT to use a Bloom filter. Per-user blocklists are usually small (dozens to thousands of entries), so a hash set is perfectly fine. Reserve Bloom filters for truly massive sets where the memory savings justify the limitations."
  },
  {
    "id": "q33",
    "subtopic": "Bloom Filter Use-Cases",
    "tier": "Heavy",
    "style": "Anti-pattern identification",
    "question": "A candidate designing a payment processing system proposes: 'We'll use a Bloom filter to deduplicate transaction IDs. When a transaction comes in, we check the filter — if it's probably seen, we reject it as duplicate. If definitely not seen, we process it.' What's the most dangerous flaw?",
    "options": [
      {
        "label": "A",
        "text": "False positives will cause the system to reject legitimate, unique transactions. In payment processing, this means real payments are silently dropped — customers are charged but the merchant never receives confirmation. This is unacceptable for financial systems."
      },
      {
        "label": "B",
        "text": "The Bloom filter will eventually saturate and reject ALL transactions, causing a complete system outage. This is the primary risk since payment volumes are unpredictable."
      },
      {
        "label": "C",
        "text": "Bloom filters aren't thread-safe, so concurrent transaction processing will corrupt the bit array, leading to both false positives and false negatives."
      },
      {
        "label": "D",
        "text": "The main issue is that Bloom filters can't store the transaction amount, so you can't detect duplicate transactions with different amounts but the same ID."
      }
    ],
    "correctIndex": 0,
    "explanation": "In payment processing, a false positive means a legitimate transaction is incorrectly flagged as a duplicate and rejected. This could mean a customer pays but the payment is dropped — a catastrophic failure mode for financial systems. The content explicitly warns: 'Employing a bloom filter when a simple hash table would suffice is a red flag.' Financial deduplication demands zero false positives. Option B exaggerates — saturation is gradual, not sudden. Option C is an implementation detail, not a fundamental flaw. Option D misunderstands the use case — deduplication is by ID, not amount.",
    "interviewScript": "In your interview, say: 'This is a textbook over-engineering anti-pattern. Bloom filters trade correctness for space, which is exactly the wrong tradeoff for payment processing. A false positive here means silently dropping a real payment. Transaction deduplication requires exact matching — use a database with a unique constraint on transaction ID. The space savings of a Bloom filter are irrelevant when correctness is non-negotiable.'",
    "proTip": null
  },
  {
    "id": "q8",
    "subtopic": "Count-Min Sketch Mechanics",
    "tier": "Heavy",
    "style": "Implementation-specific nuance",
    "question": "In a Count-Min Sketch with depth d=3 and width w=8, you increment element X five times. When querying X's count, the three counters (one per row) show values [7, 5, 9]. What can you conclude about X's true count?",
    "options": [
      {
        "label": "A",
        "text": "X's exact count is 7, calculated as the average of the three counters: (7+5+9)/3 = 7. The average provides the best unbiased estimate."
      },
      {
        "label": "B",
        "text": "X's true count is at most 5. We take the minimum across all rows because each counter can only be inflated (never deflated) by hash collisions from other elements. The minimum is the tightest upper bound."
      },
      {
        "label": "C",
        "text": "X's true count is exactly 5. Since one counter shows 5 and X was incremented 5 times, that counter had zero collisions, proving the exact count."
      },
      {
        "label": "D",
        "text": "X's count is between 5 and 9. The minimum gives the lower bound and the maximum gives the upper bound, with the true value somewhere in between."
      }
    ],
    "correctIndex": 1,
    "explanation": "Count-Min Sketch provides an UPPER BOUND estimate by taking the MINIMUM across all rows. Each counter can only be equal to or greater than the true count (because collisions only add, never subtract). The minimum of [7, 5, 9] = 5, which is the tightest upper bound we can provide. Option A is wrong — averaging doesn't give meaningful bounds. Option C is partially right about the value but wrong about the reasoning — we can't prove zero collisions; we only know the minimum is our best estimate. Option D incorrectly treats this as a range estimate.",
    "interviewScript": "In your interview, say: 'Count-Min Sketch only overestimates, never underestimates, because hash collisions can only inflate counters. By taking the minimum across all d rows, we get the tightest upper bound on the true count. The name literally encodes the algorithm — COUNT using the MINimum.'",
    "proTip": null
  },
  {
    "id": "q9",
    "subtopic": "Count-Min Sketch Mechanics",
    "tier": "Heavy",
    "style": "Failure analysis",
    "question": "Your Count-Min Sketch has been running for a month tracking video view counts. You notice that unpopular videos (true count ~10) are being reported with counts of 50,000+. Meanwhile, the most popular video (true count ~1B) shows a count of 1,000,002,347. Why is the error distribution so skewed?",
    "options": [
      {
        "label": "A",
        "text": "CMS has a multiplicative error — the error is proportional to the true count, so popular items have proportionally larger absolute errors. The unpopular items' errors seem large because their true counts are small."
      },
      {
        "label": "B",
        "text": "CMS error is additive and proportional to the TOTAL count across ALL items, not to individual item counts. Popular videos' hash positions accumulate collisions from every other video's increments, but their true count dwarfs the noise. Unpopular videos' true counts are tiny relative to the same collision noise, making the error seem enormous."
      },
      {
        "label": "C",
        "text": "The hash functions are biased toward popular items' positions, causing disproportionate collisions in those buckets. Unpopular items sharing those positions inherit the inflated counts."
      },
      {
        "label": "D",
        "text": "CMS error follows a normal distribution centered on the true count. With enough items, some unpopular items randomly end up in the tail of the distribution. This is expected statistical variation, not a structural problem."
      }
    ],
    "correctIndex": 1,
    "explanation": "CMS error is additive, not multiplicative — the overestimate depends on the total count flowing through the sketch and the collision rate, not on the individual item's true count. Every increment to ANY item can inflate counters for other items sharing those positions. For a video with 1B views, an error of ~2M is a 0.2% overestimate. For a video with 10 views, the same absolute error of ~50K is a 5000x overestimate. The signal-to-noise ratio is determined by the item's count relative to the total traffic.",
    "interviewScript": "In your interview, say: 'This highlights a fundamental CMS property: errors are additive, proportional to total stream volume, not individual counts. Popular items have great signal-to-noise ratios because their true count dwarfs the collision noise. Unpopular items drown in the same noise. This is why CMS works well for Top-K problems — you care about the popular items where relative error is small.'",
    "proTip": "This is why CMS is great for Top-K but terrible for long-tail analysis. If you need accurate counts for rare items, CMS is the wrong tool."
  },
  {
    "id": "q10",
    "subtopic": "Count-Min Sketch Mechanics",
    "tier": "Heavy",
    "style": "Decision framework application",
    "question": "You're sizing a Count-Min Sketch for a real-time trending topics system. You have a fixed memory budget. Should you prioritize width (w) or depth (d) of the sketch?",
    "options": [
      {
        "label": "A",
        "text": "Prioritize depth (d). More rows mean more independent hash functions, which gives higher confidence in the minimum estimate. Width matters less because even narrow rows benefit from multiple samples."
      },
      {
        "label": "B",
        "text": "Prioritize width (w). Wider rows reduce collision probability per row, directly reducing the expected error magnitude. Adding depth helps confidence but with diminishing returns — going from d=3 to d=4 helps less than going from w=1000 to w=2000."
      },
      {
        "label": "C",
        "text": "Allocate equally between width and depth. The error bound is symmetric in both parameters, so any imbalance wastes memory on one dimension that could be better used in the other."
      },
      {
        "label": "D",
        "text": "It depends entirely on the number of unique items. If cardinality is high, prioritize depth for better confidence. If cardinality is low, prioritize width to avoid collisions."
      }
    ],
    "correctIndex": 1,
    "explanation": "Width controls the collision probability (accuracy), while depth controls the confidence/probability that the estimate is within the error bound. In practice, for a fixed memory budget, width has more impact on expected accuracy. Going from d=5 to d=7 (40% more depth) improves confidence but the expected error is already dominated by width. The error decreases roughly as e/w (where e is Euler's number and w is width), while confidence improves as (1/2)^d. A small d (3-5) already gives very high confidence, so additional memory is better spent on width.",
    "interviewScript": "In your interview, say: 'Width controls accuracy — how close our estimates are to the true count. Depth controls confidence — how likely we are to achieve that accuracy. In practice, a depth of 3-5 already gives high confidence, and additional memory yields better returns when allocated to width, which directly reduces collision probability and expected error.'",
    "proTip": null
  },
  {
    "id": "q11",
    "subtopic": "Count-Min Sketch Use-Cases",
    "tier": "Heavy",
    "style": "Scenario-based trade-off",
    "question": "You're implementing a 'Top 100 Trending Videos' feature using Count-Min Sketch. After a video view comes in, you increment CMS and check if the video should enter the top-100 list. A subtle bug is reported: a video with ~500K true views is ranked above a video with ~2M true views. What's the most likely explanation?",
    "options": [
      {
        "label": "A",
        "text": "The 500K-view video has more hash collisions, inflating its CMS count above the 2M-view video's CMS count. Since CMS only overestimates, the 500K video's estimated count could exceed the 2M video's true count plus its own collision noise."
      },
      {
        "label": "B",
        "text": "CMS provides exact counts for items in the top percentile, so this ranking error must be caused by a race condition in concurrent writes, not by CMS approximation error."
      },
      {
        "label": "C",
        "text": "The 2M-view video was added to the sketch earlier, and CMS counts degrade over time due to counter overflow. The 500K-view video has a fresher, more accurate count."
      },
      {
        "label": "D",
        "text": "The sorted list comparison logic is flawed. CMS itself always returns monotonically increasing estimates for items with more true events, so the ordering must be correct."
      }
    ],
    "correctIndex": 0,
    "explanation": "CMS overestimates are non-uniform — they depend on which other items collide with a given item's hash positions. If the 500K-view video shares hash positions with several other popular videos, its CMS estimate could be inflated to, say, 2.3M, exceeding the 2M-view video's estimate of 2.1M. This is a known limitation of CMS-based Top-K: rankings near the boundary can be unstable. Option B is wrong — CMS doesn't provide exact counts for any items. Option C is wrong — CMS doesn't degrade over time due to counter overflow in typical implementations. Option D is wrong — CMS absolutely does NOT guarantee monotonic ordering by true count.",
    "interviewScript": "In your interview, say: 'This is expected CMS behavior. Since overestimates depend on collision patterns, not true counts, two items with different true counts can have their CMS estimates reversed. For Top-K, this means boundary items may be misranked. The mitigation is to maintain a slightly larger candidate list and re-verify periodically, or accept that rankings are approximate.'",
    "proTip": null
  },
  {
    "id": "q12",
    "subtopic": "Count-Min Sketch Use-Cases",
    "tier": "Heavy",
    "style": "Interviewer pushback",
    "question": "You propose using Count-Min Sketch for LFU cache eviction tracking. Your interviewer pushes back: 'Redis implemented LFU but chose NOT to use Count-Min Sketch. Why might that be?' What's the strongest response?",
    "options": [
      {
        "label": "A",
        "text": "Redis doesn't use CMS because CMS requires knowing all possible keys upfront. Since Redis keys are dynamic and unbounded, CMS can't be pre-sized correctly."
      },
      {
        "label": "B",
        "text": "Redis uses a probabilistic 8-bit logarithmic counter per key that combines frequency and recency. This requires only 1 byte per key with no separate data structure, avoids CMS's collision noise, gives per-key precision, and naturally decays over time — addressing frequency AND recency in a single counter."
      },
      {
        "label": "C",
        "text": "Redis doesn't use CMS because CMS can't handle deletions. When Redis evicts a key, the CMS count can't be decremented, causing ghost entries that pollute future frequency estimates."
      },
      {
        "label": "D",
        "text": "Redis operates single-threaded, so the overhead of computing multiple hash functions per CMS lookup would block the event loop. The simpler per-key counter avoids this computational bottleneck."
      }
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states Redis uses a 'pseudo-counter in 16 bits alongside each key that incorporates both recency information and frequency information.' (The quiz uses 8-bit as a simplification consistent with Redis's actual implementation of an 8-bit LFU counter.) The key advantages: no separate data structure needed, no collision noise, per-key accuracy, and temporal decay. CMS is a separate structure that only tracks frequency, not recency, and its collision noise means imprecise counts per key. Option A is wrong — CMS doesn't require knowing keys upfront. Option C raises a valid point but isn't the primary reason. Option D is wrong — hash computation is trivially fast.",
    "interviewScript": "In your interview, say: 'Redis took a more elegant approach: a small probabilistic counter embedded directly in each key's metadata. This gives per-key accuracy without collision noise, combines frequency AND recency in one value, and requires no separate data structure. CMS would add complexity for approximate counts when Redis can get better per-key precision with a single byte.'",
    "proTip": "This is a great example of why 'saving bytes' isn't always the right goal. When each item already has metadata (like Redis keys), a per-item counter is simpler and more accurate than a shared probabilistic structure."
  },
  {
    "id": "q13",
    "subtopic": "Count-Min Sketch Use-Cases",
    "tier": "Heavy",
    "style": "Anti-pattern identification",
    "question": "A team building a billing system proposes: 'We'll use Count-Min Sketch to track API call counts per customer for usage-based billing. It saves memory compared to per-customer counters.' What's the most critical problem with this proposal?",
    "options": [
      {
        "label": "A",
        "text": "CMS only provides upper-bound estimates. For billing, overcharging customers (due to CMS overestimates from hash collisions) creates legal liability and customer trust issues. Exact per-customer counts are non-negotiable for financial systems."
      },
      {
        "label": "B",
        "text": "CMS can't differentiate between customers — you can query a customer's count but can't enumerate all customers or their counts. This makes generating billing reports impossible."
      },
      {
        "label": "C",
        "text": "CMS doesn't support resetting counts at billing cycle boundaries. You'd need to rebuild the entire sketch monthly, which is computationally expensive."
      },
      {
        "label": "D",
        "text": "The memory savings are illusory. With typical customer counts (thousands to millions), a CMS sized for acceptable accuracy would use MORE memory than simple per-customer counters."
      }
    ],
    "correctIndex": 0,
    "explanation": "CMS only overestimates, meaning customers would sometimes be overcharged — a serious legal and trust issue. The content warns that CMS is inappropriate 'when other parts of the system depend on the counts' and that you need to 'bend your requirements to make it work.' Billing has zero tolerance for inaccuracy. Option B is also true (CMS requires known items for queries) but is secondary to the financial impact. Option C is solvable by creating a new sketch per cycle. Option D may be true in some cases but isn't the fundamental issue.",
    "interviewScript": "In your interview, say: 'This is a classic case of optimizing the wrong thing. CMS saves space by sacrificing accuracy, but billing requires exact counts — there's no acceptable error tolerance when charging customers. The space savings are irrelevant when correctness is a legal requirement. Use a simple per-customer counter in a database.'",
    "proTip": null
  },
  {
    "id": "q14",
    "subtopic": "Count-Min Sketch Use-Cases",
    "tier": "Thin",
    "style": "Gotcha/trap",
    "question": "You've deployed a Count-Min Sketch to track trending search terms. A product manager asks: 'Can you pull a report of ALL search terms and their approximate counts from the sketch?' What's the correct response?",
    "options": [
      {
        "label": "A",
        "text": "Yes — iterate over all counter positions and use inverse hashing to recover the original search terms and their counts."
      },
      {
        "label": "B",
        "text": "Yes — the sketch stores compressed representations of all items, which can be decompressed for reporting."
      },
      {
        "label": "C",
        "text": "No — CMS can only answer point queries for KNOWN items. It doesn't store the items themselves, only aggregate counters. To query a term's count, you must already know the term. Enumerating all terms from the sketch is impossible."
      },
      {
        "label": "D",
        "text": "No — CMS only supports inequality queries (counts above threshold), not enumeration. But you can extract the top items by scanning for the highest counter values."
      }
    ],
    "correctIndex": 2,
    "explanation": "This is a fundamental CMS limitation the content explicitly calls out: 'our sketch does not tell us which items are present after we hash them.' CMS is a lossy compression of counts — you can query 'what's the approximate count for term X?' but you cannot ask 'what terms have been counted?' The original items are destroyed by hashing. You need to maintain a separate list of known items. Option A is impossible — hash functions are one-way. Option B misunderstands how CMS works. Option D is partially right about the limitation but wrong about extracting top items from counters alone.",
    "interviewScript": "In your interview, say: 'Count-Min Sketch requires known items for queries — it's a count oracle, not an inventory. The items themselves are destroyed by hashing. For a trending terms system, you'd pair CMS with a candidate list — perhaps a heap of terms whose CMS counts exceed a threshold — to maintain the set of known high-count items.'",
    "proTip": null
  },
  {
    "id": "q15",
    "subtopic": "HyperLogLog Mechanics",
    "tier": "Heavy",
    "style": "Implementation-specific nuance",
    "question": "HyperLogLog estimates cardinality by observing the maximum number of leading zeros in hashed values. If the longest run of leading zeros observed is 12, approximately how many unique elements have been seen?",
    "options": [
      {
        "label": "A",
        "text": "Approximately 12 elements — each leading zero corresponds to one unique element observed."
      },
      {
        "label": "B",
        "text": "Approximately 2^12 = 4,096 unique elements. The probability of seeing k leading zeros is 1/2^k, so observing 12 leading zeros suggests ~2^12 unique hashes have been generated."
      },
      {
        "label": "C",
        "text": "Approximately 12! = 479,001,600 unique elements, because the probability follows a factorial distribution for independent hash observations."
      },
      {
        "label": "D",
        "text": "Cannot be estimated from a single observation — HLL requires at minimum 64 buckets to produce any estimate. A single leading-zero count is statistically meaningless."
      }
    ],
    "correctIndex": 1,
    "explanation": "The core HLL intuition is the coin-flip analogy: seeing k leading zeros is like flipping k tails in a row, which has probability 1/2^k. If the longest streak is 12, we've likely seen around 2^12 ≈ 4,096 unique elements. Option A confuses leading zeros with element count linearly. Option C fabricates a factorial relationship. Option D is partially right that a single observation has high variance — HLL uses multiple buckets to reduce variance — but the question asks about the basic estimation principle.",
    "interviewScript": "In your interview, say: 'HLL uses the coin-flip analogy: the probability of seeing k leading zeros in a good hash is 1/2^k. So observing a maximum of 12 leading zeros suggests approximately 2^12, or about 4,000 unique elements. In practice, HLL uses many buckets and the harmonic mean to reduce variance from this raw estimate.'",
    "proTip": null
  },
  {
    "id": "q16",
    "subtopic": "HyperLogLog Mechanics",
    "tier": "Heavy",
    "style": "Failure analysis",
    "question": "A naive implementation of the leading-zeros cardinality estimation (without buckets) gives you an estimate of 2^15 = 32,768 unique users. But you know the true count is ~500. What most likely happened, and how does HLL prevent this?",
    "options": [
      {
        "label": "A",
        "text": "A single unusually long run of leading zeros from one hash dominated the estimate. HLL prevents this by partitioning elements into 2^b buckets using the first b hash bits, maintaining per-bucket maximums, and combining them via harmonic mean — reducing the impact of any single outlier observation."
      },
      {
        "label": "B",
        "text": "The hash function has poor randomness, producing biased outputs with more leading zeros than expected. HLL prevents this by requiring cryptographic-grade hash functions that guarantee uniform distribution."
      },
      {
        "label": "C",
        "text": "With only 500 elements, the birthday paradox causes hash collisions that artificially inflate the leading-zero maximum. HLL prevents this by using 128-bit hashes to avoid collisions up to 2^64 elements."
      },
      {
        "label": "D",
        "text": "The estimate is actually within acceptable bounds — 32,768 vs 500 is a 65x error, which is normal for a single-register HLL. HLL doesn't prevent this; it's the expected variance."
      }
    ],
    "correctIndex": 0,
    "explanation": "With raw leading-zeros estimation, a single 'lucky' hash can massively overestimate cardinality. If one of 500 elements happens to hash to a value with 15 leading zeros (probability 1/32768 per element, but with 500 tries, not astronomically unlikely), the estimate jumps to 32K. HLL solves this with bucketing: elements are distributed across 2^b buckets, each maintaining its own maximum leading-zero count. The harmonic mean of 2^(max) across all buckets reduces the impact of any single outlier. Option B is wrong — good non-cryptographic hashes suffice. Option C misapplies the birthday paradox. Option D mischaracterizes the acceptable error range.",
    "interviewScript": "In your interview, say: 'The raw leading-zeros method has extremely high variance — a single outlier hash can dominate the estimate. HLL's key innovation is bucketing: use the first few hash bits to assign elements to one of 2^b buckets, track per-bucket maximums, then combine via harmonic mean. This averages out outliers while preserving the logarithmic space efficiency.'",
    "proTip": null
  },
  {
    "id": "q17",
    "subtopic": "HyperLogLog Mechanics",
    "tier": "Heavy",
    "style": "Estimation-backed reasoning",
    "question": "You need to count unique daily visitors to a website with approximately 100 million unique visitors per day. Your memory budget is 12KB. Can HyperLogLog solve this, and what error rate should you expect?",
    "options": [
      {
        "label": "A",
        "text": "No — HLL needs at least 1MB to handle 100M unique items. 12KB is far too small for meaningful cardinality estimation at this scale."
      },
      {
        "label": "B",
        "text": "Yes — with 12KB (approximately 2^14 = 16,384 registers at ~6 bits each), HLL provides roughly 0.8% standard error regardless of whether you're counting 100 million or 100 billion unique items. The error depends on register count, not cardinality."
      },
      {
        "label": "C",
        "text": "Yes — but only if unique visitors are uniformly distributed across the day. If traffic is bursty, HLL's accuracy degrades proportionally to the burstiness factor."
      },
      {
        "label": "D",
        "text": "Yes — 12KB gives exactly 1.5% error for up to 1 billion items, but error increases linearly beyond that threshold."
      }
    ],
    "correctIndex": 1,
    "explanation": "HLL's remarkable property is that accuracy depends on the number of registers (memory), NOT on the cardinality being estimated. The content states: '1.5KB → ~2% error, 3KB → ~1.6%, 6KB → ~1.2%.' Following this scaling (error ∝ 1/√m), 12KB gives roughly 0.8% error. This works for millions, billions, or trillions of unique items. Option A vastly overestimates HLL's memory needs. Option C is wrong — HLL is agnostic to temporal distribution. Option D fabricates a linear error growth that doesn't exist in HLL.",
    "interviewScript": "In your interview, say: 'This is HLL's superpower — memory requirements are independent of cardinality. With 12KB, we get sub-1% standard error whether counting 100 million or 100 billion uniques. The error rate is 1.04/√m where m is the number of registers. At 12KB with ~16K registers, that's about 0.8% standard error — more than sufficient for analytics.'",
    "proTip": "The fact that HLL memory is independent of cardinality is the single most important thing to communicate in an interview. It's what makes HLL fundamentally different from hash sets."
  },
  {
    "id": "q18",
    "subtopic": "HyperLogLog Use-Cases",
    "tier": "Medium",
    "style": "Scenario-based trade-off",
    "question": "Your analytics platform needs to support queries like 'How many unique users visited page X in the last 30 days?' with sub-second latency. You have 50 million pages and 500 million daily unique visitors. A hash set per page is infeasible. An engineer proposes HLL per page. What's the key operational challenge?",
    "options": [
      {
        "label": "A",
        "text": "HLL per page for 50M pages at 12KB each is 600GB of HLL state — manageable in a distributed system, but the real challenge is MERGEABILITY. To answer '30-day uniques,' you need to merge 30 daily HLL sketches per page, which HLL supports via register-wise max. The challenge is maintaining and efficiently merging these daily snapshots."
      },
      {
        "label": "B",
        "text": "HLL can't support time-windowed queries. Once a visitor is counted, there's no way to 'expire' them from the HLL after 30 days. You'd need to rebuild the entire HLL from raw logs daily."
      },
      {
        "label": "C",
        "text": "The 1-2% error rate is unacceptable for product analytics. Stakeholders need exact unique visitor counts, so HLL is fundamentally unsuitable for this use case."
      },
      {
        "label": "D",
        "text": "50 million separate HLL instances would require 50 million separate hash function configurations to avoid cross-page interference. This is computationally prohibitive."
      }
    ],
    "correctIndex": 0,
    "explanation": "HLL's key operational advantage is mergeability — you can union two HLL sketches by taking the element-wise maximum of their registers. This enables a powerful pattern: maintain daily HLL sketches per page, and merge the last 30 to answer windowed queries. The challenge is managing this state efficiently at scale. Option B is wrong — HLL supports time-windowed queries precisely through this merge pattern. Option C is usually wrong for analytics — 1-2% error is widely accepted. Option D is wrong — all HLL instances can use the same hash function.",
    "interviewScript": "In your interview, say: 'The key insight is HLL mergeability. We maintain daily HLL sketches per page, and to answer 30-day unique queries, we merge 30 daily sketches using register-wise maximum. The operational challenge is managing 50M × 30 days of HLL state efficiently, but at 12KB each, that's tractable with proper storage and caching.'",
    "proTip": null
  },
  {
    "id": "q19",
    "subtopic": "HyperLogLog Use-Cases",
    "tier": "Medium",
    "style": "Multi-hop reasoning",
    "question": "You're building an anti-scraping system. You want to detect IP addresses that are scraping by visiting an unusually high number of DISTINCT pages. A colleague suggests using request count per IP. Why might HyperLogLog provide a BETTER signal, and what's the trade-off?",
    "options": [
      {
        "label": "A",
        "text": "Raw request count can't distinguish a corporate proxy (many users, repeated popular pages) from a scraper (one entity, all unique pages). HLL per IP estimates distinct URL count — a high ratio of unique URLs to total requests signals scraping behavior. The trade-off is maintaining an HLL per active IP, which requires memory proportional to the number of active IPs."
      },
      {
        "label": "B",
        "text": "HLL is better because it's faster to compute than incrementing a counter. The trade-off is accuracy — some scrapers with fewer unique pages might be missed due to HLL underestimation."
      },
      {
        "label": "C",
        "text": "HLL provides a better signal because it can detect the temporal pattern of page visits, not just the count. Scrapers visit pages in sequential order, which HLL can detect. The trade-off is that HLL requires ordered insertion."
      },
      {
        "label": "D",
        "text": "HLL is better because it compresses the URL data, so you can store the exact set of visited URLs per IP in less space. The trade-off is that you can't retrieve the actual URLs for forensic investigation."
      }
    ],
    "correctIndex": 0,
    "explanation": "The content explicitly describes this use case: 'If we expect real users to re-visit some popular pages but scrapers to focus on net-new pages, we can look at the number of distinct URLs by IP address.' A corporate proxy making 100K requests might only touch 500 distinct pages, while a scraper making 100K requests touches 95K distinct pages. HLL per IP captures this distinction cheaply. The trade-off is maintaining an HLL per active IP. Option B is wrong — HLL never underestimates (it overestimates). Option C fabricates temporal detection. Option D misunderstands HLL as compression.",
    "interviewScript": "In your interview, say: 'The key anti-scraping signal is the ratio of unique pages to total requests. Legitimate users re-visit popular pages; scrapers maximize coverage of unique pages. HLL per IP lets us estimate distinct URLs visited without storing the actual URL set. A high cardinality relative to request count is a strong scraping indicator.'",
    "proTip": null
  },
  {
    "id": "q20",
    "subtopic": "HyperLogLog Use-Cases",
    "tier": "Thin",
    "style": "Decision framework application",
    "question": "You're designing a caching layer and need to determine the working set size — how many unique keys are accessed over time — to properly size your cache. You consider three approaches: (1) log every key to a database and COUNT DISTINCT, (2) maintain a hash set of seen keys in memory, (3) use HyperLogLog. Under what conditions is HLL the right choice?",
    "options": [
      {
        "label": "A",
        "text": "HLL is always the best choice because it's the most space-efficient. The other approaches are strictly inferior."
      },
      {
        "label": "B",
        "text": "HLL is right when the unique key space is very large (millions+), you need a real-time streaming estimate, and approximate counts are sufficient. If the key space is small enough for a hash set to fit in memory, or if you need exact counts for capacity planning, HLL adds unnecessary approximation error."
      },
      {
        "label": "C",
        "text": "HLL is right when you need to track key turnover rate over time, because HLL can measure how quickly new unique keys appear. The other approaches can only give total counts."
      },
      {
        "label": "D",
        "text": "HLL is only appropriate for cache sizing if you have a write-heavy workload. For read-heavy workloads, the hash set approach is more appropriate because reads dominate and you need exact deduplication."
      }
    ],
    "correctIndex": 1,
    "explanation": "The content frames HLL as ideal when you need to count uniques in a large dataset with limited memory and can tolerate small errors. For cache sizing: if your key space is manageable (thousands), a hash set or even database query is simpler and exact. HLL shines when the key space is huge and you just need an approximate working set size for sizing decisions. Option A ignores cases where exact counts are preferable. Option C fabricates a turnover-tracking capability. Option D creates a false distinction between read/write workloads.",
    "interviewScript": "In your interview, say: 'HLL is the right choice when the unique key space is too large for a hash set and approximate cardinality is sufficient for the sizing decision. For cache sizing, knowing the working set is ~10.2M ± 2% is usually enough to decide between a 16M and 32M entry cache. If the key space is small, use exact counting — HLL adds complexity for no benefit.'",
    "proTip": null
  },
  {
    "id": "q21",
    "subtopic": "Approximate Quantiles",
    "tier": "Thin",
    "style": "Gotcha/trap",
    "question": "You're monitoring API latency using fixed-width histogram buckets: [0-100ms, 100-200ms, 200-300ms, ..., 900-1000ms, 1000ms+]. 95% of requests are under 50ms. What's the fundamental problem with this bucket configuration?",
    "options": [
      {
        "label": "A",
        "text": "The buckets are too wide. Most requests cluster in the 0-100ms bucket, so you lose all resolution in the most important range. You can't distinguish between p50=5ms and p50=95ms — both look the same. Exponential buckets (e.g., 0-1, 1-5, 5-10, 10-25, 25-50, 50-100ms) would concentrate resolution where the data is."
      },
      {
        "label": "B",
        "text": "The problem is the open-ended 1000ms+ bucket. Extreme outliers in this bucket will skew all percentile calculations, making p99 unreliable."
      },
      {
        "label": "C",
        "text": "Fixed-width buckets waste memory on empty high-latency buckets. Since 95% of traffic is under 50ms, buckets above 200ms will be mostly empty, wasting counter space."
      },
      {
        "label": "D",
        "text": "The 100ms bucket width means your percentile estimates can be off by up to 100ms. Since most requests are under 50ms, a 100ms error is larger than the actual latency — making all estimates meaningless for the common case."
      }
    ],
    "correctIndex": 0,
    "explanation": "The content explicitly warns: 'If you're tracking response times and create buckets like [0-1s, 1s-10s, 10s+], you'll lose a lot of precision in the common case where most responses are under 100ms. Consider logarithmic or exponential bucket spacing.' With 95% of requests in the 0-100ms bucket, you can't distinguish fast from slow within that range. The p50, p75, and p90 all fall in the same bucket. Option B raises a valid but secondary concern. Option C is about memory efficiency, not accuracy. Option D is partially correct about error bounds but doesn't identify the solution.",
    "interviewScript": "In your interview, say: 'This is the classic bucket boundary mistake. When data is heavily skewed — and latency almost always is — fixed-width buckets put most data in one bucket, destroying resolution where it matters most. Exponential buckets solve this by providing fine granularity at low values and coarse granularity at high values, matching the data distribution.'",
    "proTip": "Prometheus uses exponential buckets by default for histogram metrics for exactly this reason. Always match bucket spacing to your expected data distribution."
  },
  {
    "id": "q22",
    "subtopic": "Approximate Quantiles Mechanics",
    "tier": "Medium",
    "style": "Decision framework application",
    "question": "You need to track latency percentiles for a service with highly variable response times: p50 is ~10ms but p99 is ~30 seconds (extreme long tail). You're choosing between fixed-width, exponential, and dynamic histogram buckets. Which approach is most appropriate?",
    "options": [
      {
        "label": "A",
        "text": "Fixed-width buckets with 1ms granularity from 0ms to 30,000ms — this gives exact precision at all ranges, with only 30,000 counters."
      },
      {
        "label": "B",
        "text": "Exponential buckets (e.g., powers of 2: 1, 2, 4, 8, ... 32768ms). This covers the full range from 1ms to 30s+ with only ~15 buckets, providing fine resolution at low latencies where most data lives and coarser resolution at the long tail where exact values matter less."
      },
      {
        "label": "C",
        "text": "Dynamic histograms that adapt bucket boundaries to the incoming data distribution. This provides optimal accuracy as the distribution shifts over time."
      },
      {
        "label": "D",
        "text": "A hybrid approach: exponential buckets for 0-1000ms and fixed-width 1-second buckets for 1s-30s. This gives precision where needed while covering the long tail."
      }
    ],
    "correctIndex": 1,
    "explanation": "With a range spanning 3+ orders of magnitude (10ms to 30s), exponential buckets are the natural fit. They provide fine granularity at low values (where most data is) and coarser granularity at high values. The content notes that exponential buckets work well 'for data with wide ranges or power-law distributions (common in latency measurements).' Option A uses 30,000 counters — excessive memory. Option C sounds appealing but the content warns it 'adds a lot of complexity which is usually not worth it.' Option D is reasonable but adds unnecessary complexity over pure exponential.",
    "interviewScript": "In your interview, say: 'For latency spanning multiple orders of magnitude, exponential buckets are the standard approach. They naturally concentrate resolution at the low end where most data lives, while still covering the long tail. With ~15 buckets, I can cover 1ms to 32s with relative error proportional to the bucket — about 50% at each level, which is acceptable for the tail.'",
    "proTip": null
  },
  {
    "id": "q23",
    "subtopic": "Approximate Quantiles Mechanics",
    "tier": "Medium",
    "style": "Implementation-specific nuance",
    "question": "Your histogram implementation uses cumulative counters (each bucket stores the count of ALL values up to its boundary) instead of per-bucket counters. What are the implications for read and write performance?",
    "options": [
      {
        "label": "A",
        "text": "Reads are faster (percentile queries are a single binary search to find the bucket where cumulative count crosses the threshold) but writes are slower (worst case: incrementing every bucket when a value falls in the largest range). This favors read-heavy analytics workloads."
      },
      {
        "label": "B",
        "text": "Both reads and writes are faster. Cumulative counters enable O(1) percentile lookups and O(1) insertions because you only update the single bucket the value falls into."
      },
      {
        "label": "C",
        "text": "Reads are slower because computing a percentile requires subtracting adjacent cumulative counts. Writes are the same speed since both approaches update a single counter."
      },
      {
        "label": "D",
        "text": "There's no meaningful performance difference. The choice between cumulative and per-bucket is purely a coding style preference with identical computational complexity."
      }
    ],
    "correctIndex": 0,
    "explanation": "The content notes that cumulative counts 'means more writes (the worst case is to frequently have values in the largest bucket, requiring writes to every bucket), but makes querying easier.' With cumulative counters, finding a percentile is a simple binary search for the threshold — no summing needed. But each insertion must increment all buckets whose boundary is >= the inserted value. This is a classic read-write tradeoff. Option B is wrong about writes being O(1). Option C inverts the tradeoff. Option D ignores a real architectural difference.",
    "interviewScript": "In your interview, say: 'This is a read-write tradeoff. Cumulative counters make percentile queries trivial — just binary search for where the cumulative count crosses your threshold. But writes become O(B) in the worst case, where B is the number of buckets, since you must increment all buckets above the inserted value. Choose based on your access pattern: analytics dashboards (read-heavy) favor cumulative; high-throughput ingestion favors per-bucket.'",
    "proTip": null
  },
  {
    "id": "q24",
    "subtopic": "Approximate Quantiles Use-Cases",
    "tier": "Medium",
    "style": "Scenario-based trade-off",
    "question": "Your SLO states: '99% of API requests must complete within 200ms.' You're using Prometheus histograms to monitor compliance. Your histogram has buckets at [10, 25, 50, 100, 250, 500, 1000]ms. The 99th percentile is estimated at 180ms, just under the 200ms SLO. Should you be confident the SLO is being met?",
    "options": [
      {
        "label": "A",
        "text": "Yes — Prometheus histograms provide exact percentile calculations within bucket boundaries, so 180ms is precise."
      },
      {
        "label": "B",
        "text": "No — the true p99 could be anywhere between 100ms and 250ms because those are the bucket boundaries surrounding 180ms. Prometheus interpolates linearly within buckets, so if the actual distribution within the 100-250ms bucket is skewed toward 250ms, the true p99 could exceed 200ms. The estimate has up to 150ms of uncertainty."
      },
      {
        "label": "C",
        "text": "No — Prometheus histograms always overestimate percentiles for safety, so the true p99 is actually lower than 180ms. The SLO is being met with even more margin than shown."
      },
      {
        "label": "D",
        "text": "Yes — with 7 buckets spanning the 10-1000ms range, the interpolation error is at most 5%, making 180ms reliable enough to confirm SLO compliance."
      }
    ],
    "correctIndex": 1,
    "explanation": "Prometheus uses linear interpolation within histogram buckets to estimate percentiles. The p99 estimate of 180ms falls between the 100ms and 250ms bucket boundaries. The true value depends on the distribution of requests within that 150ms range. If most requests in that bucket are clustered near 250ms, the true p99 could be well above 200ms. The content warns that 'accuracy decreases at the extremes (very high/low percentiles)' — p99 is exactly such an extreme. Option A is wrong — histograms don't provide exact values. Option C fabricates an overestimation guarantee. Option D invents a 5% error bound.",
    "interviewScript": "In your interview, say: 'I'd be cautious. The 180ms estimate falls between 100ms and 250ms bucket boundaries — that's a 150ms uncertainty range that straddles our 200ms SLO. Linear interpolation assumes uniform distribution within the bucket, which is rarely true for latency. I'd add a bucket at 200ms to get precise SLO monitoring, or treat any estimate within one bucket-width of the SLO as inconclusive.'",
    "proTip": null
  },
  {
    "id": "q25",
    "subtopic": "Approximate Quantiles Use-Cases",
    "tier": "Medium",
    "style": "Scenario-based trade-off",
    "question": "Your auto-scaling system triggers scale-up when p95 CPU utilization exceeds 80%. You're using exponential histogram buckets for CPU: [0, 10, 20, 40, 60, 80, 90, 95, 100]%. The system reports p95 CPU at 78% and does NOT scale up. During a sudden traffic spike, the service goes down. What's the most likely root cause?",
    "options": [
      {
        "label": "A",
        "text": "The traffic spike happened between metric collection intervals, so the histogram never captured the high CPU values."
      },
      {
        "label": "B",
        "text": "The p95 estimate of 78% falls in the 60-80% bucket. Due to interpolation error, the true p95 could have been above 80%. The bucket boundary at exactly 80% (the threshold) creates a blind spot — values between 78-82% are indistinguishable, causing the auto-scaler to miss the trigger."
      },
      {
        "label": "C",
        "text": "Exponential histograms don't work for CPU utilization because CPU is bounded between 0-100%, not a power-law distribution. The bucket sizing was fundamentally wrong."
      },
      {
        "label": "D",
        "text": "The auto-scaler should use p99, not p95, for CPU utilization because p95 is too conservative for scale-up decisions."
      }
    ],
    "correctIndex": 1,
    "explanation": "The histogram's bucket boundaries create inherent uncertainty. A p95 estimate of 78% in the 60-80% bucket could represent any value in that range after interpolation. With the SLO threshold at exactly 80% (a bucket boundary), values near the threshold are unreliable. The content warns about 'accuracy decreasing at the extremes.' The fix is to add finer-grained buckets around the threshold value. Option A is about collection frequency, not histogram design. Option C is wrong — the issue is bucket placement, not distribution type. Option D doesn't address the root cause.",
    "interviewScript": "In your interview, say: 'This is a bucket boundary problem. When your auto-scaling threshold aligns with a wide bucket range, interpolation error can mask threshold crossings. The fix is concentrating bucket boundaries around critical thresholds — in this case, add buckets at 75%, 80%, and 85% to get precise resolution exactly where the scaling decision is made.'",
    "proTip": null
  },
  {
    "id": "q26",
    "subtopic": "Space-Accuracy Tradeoffs",
    "tier": "Medium",
    "style": "Cross-subtopic bridge",
    "question": "You're designing a real-time analytics pipeline that needs to answer three questions simultaneously for each endpoint: (1) How many unique users hit this endpoint? (2) What are the top-10 most frequent error codes? (3) What's the p99 latency? Your per-endpoint memory budget is 20KB. How would you allocate it?",
    "options": [
      {
        "label": "A",
        "text": "Use a single Count-Min Sketch for all three questions — CMS can estimate cardinality, frequency, and percentiles with proper query transformations. Allocate the full 20KB to one CMS."
      },
      {
        "label": "B",
        "text": "HyperLogLog for unique users (1.5KB, ~2% error), Count-Min Sketch for error frequency (2KB for a small sketch + a top-10 heap), and a histogram with ~20 exponential buckets for p99 latency (~160 bytes). Total: ~4KB, well under budget — use the remaining 16KB to increase CMS width for better accuracy."
      },
      {
        "label": "C",
        "text": "Allocate 15KB to HyperLogLog (most critical metric), 3KB to the histogram, and 2KB to CMS. HLL needs the most memory because cardinality estimation is the hardest problem."
      },
      {
        "label": "D",
        "text": "This is impossible with 20KB. Each of these data structures needs at minimum 10KB to provide useful results, so you'd need at least 30KB per endpoint."
      }
    ],
    "correctIndex": 1,
    "explanation": "Each probabilistic data structure is designed for a specific problem: HLL for cardinality, CMS for frequency, histograms for quantiles. The key insight is how remarkably memory-efficient each is. HLL needs only 1.5KB for ~2% error. CMS needs minimal space for a small set of error codes. Histograms need only a counter per bucket. Together they fit easily in 20KB with room to spare. Option A is wrong — CMS can't do cardinality or percentiles. Option C over-allocates to HLL (diminishing returns). Option D wildly overestimates memory needs.",
    "interviewScript": "In your interview, say: 'Each question maps to a specialized data structure: HLL for unique users at 1.5KB, CMS for error code frequency at 2-4KB, and an exponential histogram for p99 at under 200 bytes. These structures compose naturally and fit well within 20KB. The remaining budget goes to improving CMS accuracy, since error code frequency is the most collision-prone.'",
    "proTip": "In interviews, demonstrating that you can compose multiple probabilistic data structures within a tight memory budget shows deep understanding of their space characteristics."
  },
  {
    "id": "q27",
    "subtopic": "Space-Accuracy Tradeoffs",
    "tier": "Medium",
    "style": "Estimation-backed reasoning",
    "question": "You need to store 1 billion 4-byte element IDs with a 1% false positive rate. A Bloom filter for this requires approximately 1GB. A well-optimized hash set requires approximately 5GB. Your system has 3GB of available RAM. What's the best approach?",
    "options": [
      {
        "label": "A",
        "text": "Use the Bloom filter — it fits in 1GB with the required 1% FPR. The 80% space savings over the hash set makes it the clear winner."
      },
      {
        "label": "B",
        "text": "Use the Bloom filter, but recognize that 1GB is NOT 'several orders of magnitude smaller' than 5GB — it's an 80% reduction. If the use case can tolerate false positives, this is appropriate. If not, you need to consider sharding the hash set across machines or using disk-backed storage."
      },
      {
        "label": "C",
        "text": "Use a Count-Min Sketch instead — it can provide membership testing like a Bloom filter while using even less memory because it uses counters instead of bits."
      },
      {
        "label": "D",
        "text": "Use HyperLogLog instead — it can provide set membership queries in just 12KB of memory, which is far more efficient than both options."
      }
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly makes this point: 'you shouldn't expect that your Bloom filter is going to be several orders of magnitude smaller than a hash table. It's not a small data structure!' At 1GB for 1B elements, the Bloom filter fits in the 3GB budget but candidates should communicate realistic expectations about the savings (80%, not 1000x). The decision also depends on whether false positives are tolerable. Option A is technically correct but misses the nuance the content emphasizes. Option C is wrong — CMS tracks counts, not membership. Option D is wrong — HLL counts uniques, not membership.",
    "interviewScript": "In your interview, say: 'The Bloom filter fits our 3GB budget at 1GB, saving 80% over a hash set. But I want to set expectations: this is a significant but not dramatic saving. For 1 billion items, the Bloom filter is still a gigabyte — it's space-efficient relative to a hash set, but not tiny. If we can tolerate 1% false positives, it's the right choice. If we need exactness, we should consider sharding the hash set.'",
    "proTip": null
  },
  {
    "id": "q28",
    "subtopic": "When NOT to Use Probabilistic Structures",
    "tier": "Medium",
    "style": "Anti-pattern identification",
    "question": "A candidate designing a social media feed says: 'I'll use a Bloom filter per user to track which posts they've already seen, so we don't show duplicates in their feed.' The system has 100 million users with an average of 500 seen posts each. What's wrong with this proposal?",
    "options": [
      {
        "label": "A",
        "text": "The math doesn't support it. 100M users × even a small Bloom filter per user (say 1KB for 500 items at 1% FPR) = 100GB just for the Bloom filters. Meanwhile, 100M users × 500 post IDs × 8 bytes = 400GB for exact hash sets. The Bloom filter only saves 75%, and the engineering complexity of managing 100M Bloom filters with no deletion support (what happens when a post is removed?) makes this a poor tradeoff."
      },
      {
        "label": "B",
        "text": "Bloom filters per user are the industry standard for this problem. The proposal is actually correct and widely used by companies like Facebook and Twitter."
      },
      {
        "label": "C",
        "text": "The proposal fails because Bloom filters can't be distributed across servers. Each user's filter must be on a single machine, creating hotspots."
      },
      {
        "label": "D",
        "text": "The only issue is that false positives would occasionally hide posts the user hasn't seen. This is a minor UX issue and the approach is otherwise sound."
      }
    ],
    "correctIndex": 0,
    "explanation": "The content warns against using Bloom filters when space isn't truly constrained and when the dataset per entity is small. With 500 posts per user, a simple hash set of post IDs is small (~4KB) and exact. The Bloom filter adds complexity (no deletion for removed/hidden posts, false positive management) for modest space savings. The content emphasizes: 'Employing a bloom filter when a simple hash table would suffice is a red flag for an interviewer.' Option D understates the problems. Option C is wrong about distribution limitations.",
    "interviewScript": "In your interview, say: 'This is over-engineering. With 500 posts per user, a hash set of 8-byte post IDs is only 4KB — well within reason. The Bloom filter saves some space but adds complexity: no deletion when posts are removed, false positives hiding legitimate content, and complex sizing decisions. The simple hash set is better here. Reserve Bloom filters for cases where the set per entity is millions of items, not hundreds.'",
    "proTip": null
  },
  {
    "id": "q29",
    "subtopic": "When NOT to Use Probabilistic Structures",
    "tier": "Medium",
    "style": "Anti-pattern identification",
    "question": "During a system design interview, a candidate reaches for HyperLogLog every time uniqueness counting comes up — including counting unique items in a dataset of ~10,000 elements that easily fits in memory. What signal does this send to the interviewer?",
    "options": [
      {
        "label": "A",
        "text": "It signals strong knowledge of advanced data structures, which is always positive in an SDE2 interview."
      },
      {
        "label": "B",
        "text": "It signals the candidate is over-engineering and lacks practical judgment. The content explicitly warns: using specialized structures when simple ones suffice is 'a red flag.' For 10K items, a hash set uses ~80KB of memory and gives exact results. HLL adds approximation error for no benefit. Good engineers choose the simplest tool that works."
      },
      {
        "label": "C",
        "text": "It's a neutral signal — the interviewer won't have an opinion as long as the final system works correctly."
      },
      {
        "label": "D",
        "text": "It signals the candidate doesn't understand HyperLogLog, because HLL requires at least 1 million elements to produce meaningful estimates."
      }
    ],
    "correctIndex": 1,
    "explanation": "The content opens with this warning: 'Employing a bloom filter when a simple hash table would suffice is a red flag for an interviewer.' The same principle applies to all probabilistic structures. For 10K items, a hash set is trivial — ~80KB, O(1) operations, exact results. Using HLL adds ~2% error for no space benefit. The interviewer is testing practical engineering judgment, not just knowledge of exotic data structures. Option D is wrong — HLL works at any scale, it's just unnecessary at small scales.",
    "interviewScript": "In your interview, say: 'I'd use a simple hash set here. With 10,000 items, we're talking about kilobytes of memory — there's no space constraint that justifies a probabilistic approach. HyperLogLog is powerful when you're counting billions of uniques with tight memory budgets, but using it for 10K items adds approximation error with zero benefit. Choosing the right tool for the scale is key.'",
    "proTip": "In interviews, demonstrating when NOT to use an advanced technique is often more impressive than knowing the technique itself. It shows practical engineering judgment."
  },
  {
    "id": "q30",
    "subtopic": "Bloom Filter Sizing",
    "tier": "Thin",
    "style": "Gotcha/trap",
    "question": "You're sizing a Bloom filter for 100 million elements with a 0.1% false positive rate. Your colleague claims the filter will be 'tiny — just a few megabytes.' Based on the relationship between element count, FPR, and filter size, is this claim reasonable?",
    "options": [
      {
        "label": "A",
        "text": "Yes — Bloom filters are orders of magnitude smaller than hash tables, so a few megabytes is a reasonable expectation for 100M elements."
      },
      {
        "label": "B",
        "text": "No — the filter will be approximately 172MB. At 0.1% FPR, you need roughly 14.4 bits per element (m/n ≈ -1.44 × ln(FPR) / ln(2)). For 100M elements: 100M × 14.4 bits ≈ 1.44 billion bits ≈ 172MB. Bloom filters save space relative to hash tables but are not 'tiny' in absolute terms."
      },
      {
        "label": "C",
        "text": "No — the filter will be approximately 1.7GB because lower FPR requirements scale linearly, requiring 10x the memory of a 1% FPR filter."
      },
      {
        "label": "D",
        "text": "It depends entirely on the number of hash functions chosen. With k=1, the filter could be a few megabytes. With k=20, it would be gigabytes."
      }
    ],
    "correctIndex": 1,
    "explanation": "The content states that 1B elements with 1% FPR needs ~1GB. Scaling: 100M elements is 10x fewer, so ~100MB at 1% FPR. At 0.1% FPR (10x stricter), roughly 1.44x more bits needed, giving ~172MB. The content warns: 'the required size of a bloom filter is probably larger than you'd think.' Option A falls into the trap of assuming Bloom filters are tiny. Option C overestimates — FPR scaling is logarithmic, not linear. Option D is wrong — k and m are jointly optimized, not independent.",
    "interviewScript": "In your interview, say: 'Bloom filters are space-efficient relative to hash tables — typically an 80% reduction — but they're not tiny in absolute terms. For 100M elements at 0.1% FPR, we need about 14 bits per element, which is roughly 170MB. That's manageable, but it's important to set realistic expectations rather than assuming it'll be negligibly small.'",
    "proTip": null
  },
  {
    "id": "q31",
    "subtopic": "HyperLogLog Memory Efficiency",
    "tier": "Thin",
    "style": "Estimation-backed reasoning",
    "question": "Your team needs to track unique visitor counts for 1 million different web pages. Each page needs its own cardinality estimator. A hash set approach is infeasible due to memory. With HyperLogLog at 1.5KB per instance, what's the total memory requirement, and how does this compare to a hash set approach for 100K average uniques per page?",
    "options": [
      {
        "label": "A",
        "text": "HLL: 1M pages × 1.5KB = 1.5GB total. Hash set: 1M pages × 100K IDs × 8 bytes = 800TB. HLL achieves a ~500,000x space reduction with only ~2% estimation error. This is the kind of scale where HLL is transformative."
      },
      {
        "label": "B",
        "text": "HLL: 1M pages × 1.5KB = 1.5GB total. Hash set: 1M pages × 100K IDs × 8 bytes = 800GB. HLL saves 99.8% of memory, but 1.5GB is still substantial and requires distributed storage."
      },
      {
        "label": "C",
        "text": "HLL: 1M pages × 12KB = 12GB (you need 12KB per HLL for meaningful accuracy). Hash set: 1M × 100K × 8 bytes = 800GB. The savings are only 98.5%."
      },
      {
        "label": "D",
        "text": "Both approaches require roughly the same memory because HLL accuracy degrades with more instances, requiring larger registers to compensate."
      }
    ],
    "correctIndex": 1,
    "explanation": "HLL at 1.5KB per instance with 1M pages = 1.5GB total. Hash sets: 1M pages × 100K unique IDs × 8 bytes per ID = 800GB. That's a 99.8% reduction. The content states 1.5KB gives ~2% error, which is sufficient for analytics. Option A miscalculates hash set size (800GB, not 800TB). Option C uses 12KB per HLL, which is valid but unnecessary — 1.5KB already gives useful accuracy. Option D fabricates degradation with more instances.",
    "interviewScript": "In your interview, say: 'At 1.5KB per HLL with 2% error, tracking 1M pages costs only 1.5GB total versus 800GB for hash sets. That's a 500x reduction. The ~2% error is perfectly acceptable for page analytics. This is exactly the scale where HLL transforms what's architecturally feasible.'",
    "proTip": null
  },
  {
    "id": "q32",
    "subtopic": "Dynamic Histograms",
    "tier": "Thin",
    "style": "Interviewer pushback",
    "question": "A candidate proposes dynamic histograms that adapt bucket boundaries to the observed data distribution for a latency monitoring system. The interviewer asks: 'What's the operational cost of dynamic boundaries?' What's the best response?",
    "options": [
      {
        "label": "A",
        "text": "Dynamic histograms are strictly superior because they automatically optimize for any distribution. The operational cost is negligible — just a periodic rebalancing step."
      },
      {
        "label": "B",
        "text": "The main cost is computational — rebalancing buckets requires sorting all data, which is O(n log n) per rebalance. This makes dynamic histograms unsuitable for high-throughput systems."
      },
      {
        "label": "C",
        "text": "Dynamic boundaries mean historical comparisons become unreliable — if bucket boundaries shift, comparing 'p99 this week vs last week' requires re-bucketing historical data. You also need to rebalance periodically, adding operational complexity. The content notes this 'adds a lot of complexity which is usually not worth it.'"
      },
      {
        "label": "D",
        "text": "The only cost is memory — dynamic histograms require 2x the memory of fixed histograms to store both current and previous bucket configurations."
      }
    ],
    "correctIndex": 2,
    "explanation": "The content directly states dynamic histograms 'need to rebalance and recalculate the buckets periodically which adds a lot of complexity which is usually not worth it.' Beyond rebalancing, changing bucket boundaries breaks time-series comparisons — you can't compare percentiles across time periods with different boundaries without re-processing raw data. Option A ignores real costs. Option B overstates the computational issue. Option D fabricates a memory concern.",
    "interviewScript": "In your interview, say: 'Dynamic histograms sound appealing but have significant operational costs. Rebalancing buckets periodically adds complexity, and more critically, changing boundaries breaks temporal comparisons. If my p99 bucket was 100-200ms last week but 80-150ms this week, comparing percentiles requires re-processing raw data. For most systems, well-chosen exponential buckets provide good enough accuracy without this complexity.'",
    "proTip": null
  },
  {
    "id": "q34",
    "subtopic": "Bloom Filter × Count-Min Sketch",
    "tier": "Bridge",
    "style": "Cross-subtopic bridge",
    "question": "You're designing a system to detect and rate-limit abusive API clients. You need to both (a) check if a client IP has been seen before (new vs returning) and (b) estimate how many requests they've made. A colleague suggests: 'Just use Count-Min Sketch — it handles both membership and counting.' Why is this subtly wrong?",
    "options": [
      {
        "label": "A",
        "text": "CMS does handle both — if the minimum count is 0, the IP hasn't been seen. If it's >0, it's been seen and the count is the estimate. The colleague is correct."
      },
      {
        "label": "B",
        "text": "CMS can estimate counts but CANNOT confirm absence. A minimum count of 0 means the IP is definitely new, but a count of 1 could be a true 1 or a false positive from collisions. For the membership question, a Bloom filter provides a cleaner 'definitely not seen' guarantee. Use a Bloom filter for (a) and CMS for (b) as complementary structures."
      },
      {
        "label": "C",
        "text": "CMS can handle both, but a count of 0 in CMS doesn't guarantee the IP is new — it could be a false negative. You need a Bloom filter to eliminate false negatives."
      },
      {
        "label": "D",
        "text": "CMS requires knowing all possible IPs upfront to configure the hash functions, making it unsuitable for arbitrary IP addresses. Bloom filters don't have this limitation."
      }
    ],
    "correctIndex": 1,
    "explanation": "CMS CAN technically check membership (count > 0 means possibly present, count = 0 means definitely absent), but its primary purpose is counting, and its design is optimized for count accuracy, not membership testing. A Bloom filter is specifically optimized for membership queries with lower memory for the same false positive rate. More importantly, the content emphasizes CMS requires 'known items' — you query CMS with a specific item. Both structures complement each other. Option A oversimplifies. Option C is wrong — CMS doesn't have false negatives for the membership check. Option D is wrong — CMS works with any hashable input.",
    "interviewScript": "In your interview, say: 'While CMS can technically answer membership queries, it's optimized for counting. For a clean design, I'd use a Bloom filter for the membership check — it's more space-efficient for that specific question — and CMS for the count estimation. Each structure excels at its specific task.'",
    "proTip": null
  },
  {
    "id": "q35",
    "subtopic": "HyperLogLog × Approximate Quantiles",
    "tier": "Bridge",
    "style": "Cross-subtopic bridge",
    "question": "You're designing an observability system for a microservices architecture with 500 services. For each service, you need: unique caller count (cardinality) and p99 latency distribution. You have a total memory budget of 50MB for all services' metrics. Which combination of data structures fits, and what's the per-service allocation?",
    "options": [
      {
        "label": "A",
        "text": "Impossible — 50MB for 500 services is only 100KB per service, which is insufficient for any meaningful probabilistic data structure."
      },
      {
        "label": "B",
        "text": "HyperLogLog (12KB, ~0.8% error) + 30-bucket exponential histogram (240 bytes with 8-byte counters) = ~12.3KB per service. Total: 500 × 12.3KB ≈ 6MB — well under budget. The remaining 44MB can be used for additional metrics, higher HLL accuracy, or more histogram buckets."
      },
      {
        "label": "C",
        "text": "Use a single shared HyperLogLog for all services (saves memory via sharing) and per-service histograms. This gives exact cardinality per service through the shared structure."
      },
      {
        "label": "D",
        "text": "Use hash sets for cardinality (more accurate) and fixed-width histograms for latency. With 50MB budget, the hash sets will fit as long as each service has fewer than 10K unique callers."
      }
    ],
    "correctIndex": 1,
    "explanation": "HLL at 12KB provides sub-1% error for unlimited cardinality. An exponential histogram with 30 buckets needs only 240 bytes (30 × 8-byte counters). At ~12.3KB per service, 500 services need only 6MB — dramatically under the 50MB budget. This demonstrates how composing probabilistic structures enables monitoring at scale. Option A vastly underestimates how compact these structures are. Option C can't provide per-service cardinality from a shared HLL. Option D ignores the memory constraints the question establishes.",
    "interviewScript": "In your interview, say: 'At 12KB for HLL and 240 bytes for a 30-bucket histogram, each service needs about 12.3KB. For 500 services, that's 6MB total — far under our 50MB budget. This leaves room for additional metrics or higher precision. The key insight is that these structures compose efficiently, enabling rich per-service observability in bounded memory.'",
    "proTip": null
  },
  {
    "id": "q36",
    "subtopic": "Bloom Filter × HyperLogLog",
    "tier": "Bridge",
    "style": "Decision framework application",
    "question": "Your system receives a stream of user IDs and needs to answer two questions: (1) 'Has user X been seen in this stream?' (membership) and (2) 'How many unique users have we seen total?' (cardinality). You can only afford ONE data structure. Which do you choose?",
    "options": [
      {
        "label": "A",
        "text": "HyperLogLog — it answers both questions. Cardinality is its primary purpose, and it can check membership by comparing the estimate before and after a hypothetical insertion."
      },
      {
        "label": "B",
        "text": "Bloom filter — it answers membership directly, and you can derive an approximate cardinality from the number of bits set in the filter using a known mathematical relationship between bit saturation and element count."
      },
      {
        "label": "C",
        "text": "It depends on which question is more important. If membership is primary, use a Bloom filter (optimized for membership, can estimate cardinality from bit density). If cardinality is primary, use HLL (optimized for cardinality, but CANNOT answer membership queries — HLL is fundamentally a summary statistic, not a per-element structure)."
      },
      {
        "label": "D",
        "text": "Neither — you need both structures. Bloom filters can't count uniques and HLL can't check membership. With only one structure allowed, use a hash set instead."
      }
    ],
    "correctIndex": 2,
    "explanation": "This tests understanding of what each structure CAN and CANNOT do. Bloom filters CAN provide approximate cardinality through bit-density analysis (a known technique). HLL CANNOT answer membership queries — it only maintains per-bucket register maximums, which are irreversible summaries. So if you must pick one, the choice depends on the primary question. Option A is wrong — HLL cannot check membership. Option B is closest but doesn't acknowledge the tradeoff. Option D is overly pessimistic about Bloom filters' capabilities.",
    "interviewScript": "In your interview, say: 'HLL is a summary statistic — it tracks cardinality but can't answer per-element membership queries. Bloom filters can do membership directly and estimate cardinality from bit saturation. If I can only pick one and membership is important, I'd choose the Bloom filter and derive cardinality as a secondary metric. If cardinality precision matters more, I'd need HLL and accept that membership queries require a separate mechanism.'",
    "proTip": null
  },
  {
    "id": "q37",
    "subtopic": "Count-Min Sketch × Approximate Quantiles",
    "tier": "Bridge",
    "style": "Multi-hop reasoning",
    "question": "You're building a dashboard showing 'Top 10 endpoints by p99 latency.' You have per-endpoint histograms for latency AND a Count-Min Sketch tracking request counts per endpoint. An engineer asks: 'Why not just use CMS to track p99 latency directly?' What's the fundamental misunderstanding?",
    "options": [
      {
        "label": "A",
        "text": "CMS could track latency if you treat each latency value as an item to count. You'd increment the CMS with the latency value and query for high-count latency ranges."
      },
      {
        "label": "B",
        "text": "CMS tracks frequency of known items — 'how many times has item X appeared?' It answers point queries about specific values. Percentiles require understanding the DISTRIBUTION of values — what value is larger than 99% of observations. CMS has no concept of ordering or distribution; histograms are designed precisely for this."
      },
      {
        "label": "C",
        "text": "CMS could work for p99 if you discretize latency into buckets first, effectively turning it into a histogram. The engineer's suggestion is actually valid with this modification."
      },
      {
        "label": "D",
        "text": "The issue is that CMS overestimates, which would report p99 latency as worse than it actually is. Histograms don't have this overestimation bias."
      }
    ],
    "correctIndex": 1,
    "explanation": "CMS answers 'how many times has X been counted?' — it's a frequency oracle for specific, known items. Percentile computation requires ordering values and finding distribution cutoffs, which CMS simply cannot do. CMS has no concept of 'the value that's larger than 99% of other values.' Histograms maintain bucketed distribution information specifically to enable percentile estimation. Option A would give you frequency of specific latency values, not percentiles. Option C essentially admits CMS can't do it and proposes building a histogram. Option D misidentifies the limitation.",
    "interviewScript": "In your interview, say: 'CMS and histograms answer fundamentally different questions. CMS tells you frequency: how many times has a specific item appeared. Histograms tell you distribution: what does the spread of values look like. Percentiles are a distributional question — what value exceeds 99% of observations — which requires the ordering information that histograms maintain but CMS doesn't.'",
    "proTip": null
  }
];

export default {
  questions: QUESTIONS
};
