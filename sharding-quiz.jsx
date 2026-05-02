// === COVERAGE MANIFEST ===
// Content type: deep pattern (sharding strategies, shard key selection, cross-shard ops, consistency, hot spots)
//
// HEAVY subtopics:
//   Shard Key Selection — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Nested: Good vs bad shard keys — covered by: [q1]
//     └─ Nested: High cardinality requirement — covered by: [q2]
//     └─ Nested: Even distribution requirement — covered by: [q3]
//     └─ Nested: Query alignment with shard key — covered by: [q4]
//   Sharding Strategies — Questions: 4 — IDs: [q5, q6, q7, q8]
//     └─ Nested: Range-based sharding trade-offs — covered by: [q5]
//     └─ Nested: Hash-based and resharding problem — covered by: [q6]
//     └─ Nested: Consistent hashing solution — covered by: [q7]
//     └─ Nested: Directory-based sharding trade-offs — covered by: [q8]
//   Hot Spots & Load Imbalance — Questions: 4 — IDs: [q9, q10, q11, q12]
//     └─ Nested: Celebrity problem identification — covered by: [q9]
//     └─ Nested: Time-based hot spots — covered by: [q10]
//     └─ Nested: Detection and metrics — covered by: [q11]
//     └─ Nested: Solutions: dedicated shards, compound keys — covered by: [q12]
//   Cross-Shard Operations — Questions: 4 — IDs: [q13, q14, q15, q16]
//     └─ Nested: Scatter-gather query costs — covered by: [q13]
//     └─ Nested: Caching and denormalization trade-offs — covered by: [q14]
//     └─ Nested: Background job precomputation — covered by: [q15]
//     └─ Nested: Signal to rethink design — covered by: [q16]
//   Maintaining Consistency — Questions: 4 — IDs: [q17, q18, q19, q20]
//     └─ Nested: 2PC limitations — covered by: [q17]
//     └─ Nested: Design to avoid cross-shard transactions — covered by: [q18]
//     └─ Nested: Saga pattern with compensation — covered by: [q19]
//     └─ Nested: Eventual consistency acceptance — covered by: [q20]
//
// MEDIUM subtopics:
//   Partitioning vs Sharding — Questions: 2 — IDs: [q21, q22]
//   Modern Database Sharding — Questions: 2 — IDs: [q23, q24]
//   Interview Strategy — Questions: 2 — IDs: [q25, q26]
//
// THIN subtopics (standalone):
//   Horizontal vs Vertical Partitioning — Questions: 1 — IDs: [q27]
//   Consistent Hashing — Questions: 1 — IDs: [q28]
//   Hash Modulo Resharding Problem — Questions: 1 — IDs: [q29]
//
// THIN subtopics (clustered):
//   Cluster: Shard Rebalancing — Questions: 1 — IDs: [q30]
//   Cluster: Virtual Nodes / Vnodes — Questions: 1 — IDs: [q31]
//   Cluster: Secondary Indexes in Sharded Systems — Questions: 1 — IDs: [q32]
//
// CROSS-SUBTOPIC bridges:
//   Shard Key Selection × Hot Spots — IDs: [q3, q9]
//   Sharding Strategies × Hot Spots — IDs: [q6, q12]
//   Hot Spots × Cross-Shard Operations — IDs: [q12, q16]
//   Cross-Shard Ops × Consistency — IDs: [q13, q17]
//   Sharding Strategies × Modern DBs — IDs: [q7, q23]
//   Interview Strategy × Premature Sharding — IDs: [q25, q26]
//   Consistent Hashing × Sharding Strategies — IDs: [q7, q28]
//
// Anti-pattern questions: 4 — IDs: [q4, q14, q21, q25]
// Gotcha/trap questions: 4 — IDs: [q6, q11, q18, q20]
//
// Total: 36 questions across 15 subtopics (5 heavy, 3 medium, 7 thin)
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Shard Key Selection",
    "style": "Failure Analysis",
    "question": "Your team is designing a sharding strategy for a social media platform. You're evaluating candidate shard keys: (A) user_id, (B) is_premium (boolean), (C) created_at (timestamp), and (D) country_code. Which would you reject and why?",
    "options": [
      "Reject B and C. is_premium is a boolean with only two values, causing uneven distribution — all premium users land on one shard, all free users on another. created_at causes hot spots because recent signups cluster together on a single shard.",
      "Reject all of them. None of these are good shard keys because they're too simple. Always use a compound key like (country_code, user_id).",
      "Reject only B. is_premium is too coarse, but created_at actually distributes well because the timestamp space is large. Just avoid it for recent data only.",
      "Reject A. user_id is too fine-grained and leads to too many shards. The others are better because they group related data together."
    ],
    "correctIndex": 0,
    "explanation": "The content states that is_premium is a bad shard key because it has low cardinality — only two values. This causes extremely uneven distribution. created_at is also bad because writes cluster on 'today's date', creating a hot shard that receives all new signups. user_id has high cardinality and distributes evenly, making it a good choice. country_code could work for geographic distribution but has medium cardinality (~250 values).",
    "interviewScript": "In your interview, say: 'I'd reject is_premium immediately — it's a boolean with only two possible values, so you get 50-50 distribution instead of even load spreading. created_at is equally bad because writes cluster on the current date: all new user signups land on the same shard. user_id is cardinally rich and distributes evenly, making it the right choice here.'",
    "proTip": "Always evaluate shard keys on cardinality (distinct values) and distribution patterns (are writes/reads clustered in time or by value). Low cardinality is the most common mistake."
  },
  {
    "id": "q2",
    "subtopic": "Shard Key Selection",
    "style": "Scenario-Based Trade-offs",
    "question": "You're designing a sharding scheme for an e-commerce platform with customer orders. You choose order_id as the shard key. This distributes orders evenly across shards, but analyst queries consistently ask 'what are total sales by customer?' Which statement best captures the trade-off?",
    "options": [
      "order_id is a poor shard key choice. You should use customer_id instead because it keeps a customer's orders together, enabling fast customer analytics queries.",
      "order_id is a valid shard key for even distribution, but it conflicts with your query access pattern. Queries grouped by customer now require scatter-gather to check all shards, reading millions of orders to compute totals. The content notes shard keys must align with access patterns. Consider customer_id despite less even distribution, or accept scatter-gather as a cost of the design.",
      "order_id is perfect. All queries should be rewritten to group by order instead of customer. The platform is wrong if it needs customer-level analytics.",
      "Use both — shard by order_id for fast writes, then create a separate secondary index sharded by customer_id for analytics. This adds complexity but solves both problems."
    ],
    "correctIndex": 1,
    "explanation": "The content states: 'the shard key should align with how the data is accessed.' Using order_id evenly distributes data but misaligns with the access pattern (queries by customer). This forces scatter-gather to read from all shards. While order_id is technically valid, it's a poor fit for this workload. The trade-off is: choose customer_id (less even distribution, potentially hottest customers get busier shards) for aligned queries, or accept scatter-gather costs with order_id.",
    "interviewScript": "In your interview, say: 'order_id distributes evenly, which is good, but our access pattern is queries by customer. That means every customer analytics query hits all shards — scatter-gather. If that's our primary access pattern, I should reconsider the shard key. customer_id aligns better with queries, even if distribution is less perfect. It's a trade-off between even distribution and query efficiency.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "Shard Key Selection",
    "style": "Interviewer Pushback",
    "question": "You propose user_id as the shard key, claiming it has high cardinality and distributes evenly. An interviewer asks: 'But what if you have a power user platform where 1% of users generate 50% of the data and activity?' What's the strongest response?",
    "options": [
      "That's not a problem. High cardinality means even distribution by definition. Power users will spread their activity evenly across shards.",
      "High cardinality is necessary for even distribution by value, but it doesn't prevent hot spots if value distribution is skewed. If certain users (by user_id) are extremely active, their shards become hot. The shard key itself is still correct — user_id is cardinally rich and aligns with queries like 'get user X.' The hot spot is a separate problem solved by dedicated shards for power users, splitting hot keys across multiple shards, or local read replicas. The shard key doesn't guarantee balanced load.",
      "Power users prove that user_id is a bad shard key. You should use a compound key like (user_id, timestamp) to spread each user's data across multiple shards.",
      "Use a load-balancing shard key that automatically redistributes based on actual write volume, not cardinality."
    ],
    "correctIndex": 1,
    "explanation": "The content distinguishes between shard key cardinality (the number of distinct values) and actual load distribution across shards. High cardinality doesn't prevent hot spots if the data itself is skewed — if certain user_ids are extremely active, their shards will be hot. user_id remains the correct shard key (aligns with queries, high cardinality), but addressing the hot spot requires separate solutions: dedicated shards for power users, splitting hot keys, or local replicas.",
    "interviewScript": "In your interview, say: 'High cardinality is necessary but not sufficient for even load distribution. If certain user_ids are extremely active, their shards will still be hot. user_id is still the right shard key — it has high cardinality and aligns with our access patterns. But I need to address the hot spot separately: maybe dedicate a shard for power users, or split their data across multiple shards using a compound key like (user_id, event_id).'",
    "proTip": "Cardinality addresses distribution by value, not by load. Always think separately about the shard key itself and what you'll do about hot keys."
  },
  {
    "id": "q4",
    "subtopic": "Shard Key Selection",
    "style": "Anti-Pattern Identification",
    "question": "A candidate proposes hashing the complete user object (serialized JSON) as the shard key for a user service. Why is this a critical anti-pattern?",
    "options": [
      "Hashing the entire object is inefficient but not wrong. It works for even distribution if you use a good hash function.",
      "It's wrong because the shard key must be stable and human-interpretable for operational debugging. If a user object changes, the hash changes, and the user's shard assignment changes — they're now on a different shard. You can't query by primary key anymore. The shard key should be a small, immutable identifier like user_id.",
      "It's an anti-pattern because hash functions aren't evenly distributed. You should use the raw object as a key instead of hashing it.",
      "It's wrong because storing the entire object as a key wastes storage. Always use a numeric ID."
    ],
    "correctIndex": 1,
    "explanation": "The shard key must be: (1) stable — changing data shouldn't change shard assignment, (2) immutable — used to determine shard once and forever, (3) queryable — you need to find a row given the key. Hashing the entire object violates all three. The content implies shard keys are identifiers (user_id, order_id), not derived values that change when the underlying data changes.",
    "interviewScript": "In your interview, say: 'Hashing the entire object violates the core principle of shard keys — they must be stable and immutable. If a user updates their profile, the hash changes, and suddenly their shard assignment changes. They're now on a different shard, and we can't query them by user_id anymore. The shard key should be a small, immutable identifier that never changes.'",
    "proTip": null
  },
  {
    "id": "q5",
    "subtopic": "Sharding Strategies",
    "style": "Failure Analysis",
    "question": "You implement range-based sharding for a time-series metrics system: shard 0 handles timestamps 0-1M, shard 1 handles 1M-2M, etc. The system receives constant writes across all timestamps. After 6 months, the latest timestamp shard is 100x hotter than older shards. How does range-based sharding create this problem, and what's the mitigation?",
    "options": [
      "Range-based sharding automatically creates hot spots for the latest data because all writes go to the current timestamp range. To mitigate, switch to hash-based sharding to distribute current writes randomly.",
      "The problem is not with range-based sharding but with your range size. Use smaller ranges to split hot shards further. Instead of 1M-timestamp ranges, use 1K-timestamp ranges.",
      "Range-based sharding inherently creates hot spots because recent data is always 'hotter' in real-world systems. The mitigation is to assign the latest range to multiple shard instances (replicas) to distribute the write load, or use time-partitioned ranges that split hot shards when they exceed a threshold, moving future writes to new shards.",
      "Range-based sharding is unsuitable for time-series data. Always use hash-based sharding for metrics."
    ],
    "correctIndex": 2,
    "explanation": "The content states that range-based sharding has 'range scans and hot spots' as trade-offs. In time-series systems, this manifests as all recent data landing on a single shard. The mitigation options include: (1) splitting the hot range into sub-ranges, (2) replicating the hot shard to multiple instances to spread write load, (3) dynamically splitting when a shard exceeds load threshold. Smaller ranges (option B) help but don't fundamentally solve the problem if each timestamp has heavy write volume.",
    "interviewScript": "In your interview, say: 'Range-based sharding for timestamps naturally creates hot spots because all current writes go to the latest range. The oldest shards get few writes and become idle. I'd mitigate by either splitting the hot range into finer sub-ranges, or replicating the hot shard to multiple instances to distribute write load. For very hot time ranges, I could even implement dynamic splitting — when a shard exceeds load threshold, spin off its future writes to a new shard.'",
    "proTip": "Range-based sharding is 'simple but creates hot spots.' Hash-based is the opposite: 'complex resharding but even load.' This is the fundamental trade-off."
  },
  {
    "id": "q6",
    "subtopic": "Sharding Strategies",
    "style": "Gotcha/Trap",
    "question": "You use hash-based sharding with modulo: shard_id = hash(key) % 4. You're running 4 shards today. In 6 months, you need to add a 5th shard for capacity. You change the formula to shard_id = hash(key) % 5. What happens to your data?",
    "options": [
      "The new shard_id is calculated, and existing data automatically migrates. The system rebalances itself.",
      "The new formula changes the shard assignment for nearly all keys. A key that was on shard 2 with formula % 4 might now be on shard 3 with formula % 5. This is the 'resharding problem' — you must migrate almost all data to their new shard homes. With billions of keys, this is extremely expensive and risky. Consistent hashing avoids this by ensuring only 1/N of keys need to move when you add a shard.",
      "Changing from % 4 to % 5 causes data to be distributed unevenly because modulo is not a good hash function. You should use a prime number like % 7 instead.",
      "The resharding is fine as long as you do it during a maintenance window. It's a standard operational procedure."
    ],
    "correctIndex": 1,
    "explanation": "This is the classic hash modulo resharding problem. When you go from % N to % (N+1), the modulo changes for nearly all keys. Only keys where hash(key) % 4 and hash(key) % 5 are the same (roughly 20% of keys) stay on the same shard; 80% need to migrate. The content states this is exactly why 'consistent hashing' was invented — it ensures that adding a node only causes 1/N of keys to migrate, not 4/5 of them.",
    "interviewScript": "In your interview, say: 'Modulo resharding is expensive. When I go from % 4 to % 5, nearly every key's shard assignment changes. I'd need to migrate billions of keys to their new homes — massive data movement, high operational risk. This is why consistent hashing was invented. With consistent hashing, adding a shard only moves 1/N of keys (20% in this case), not 80%.'",
    "proTip": "The hash modulo resharding problem is a classic gotcha. Interviewers ask this to see if you understand why consistent hashing matters. Simply saying 'consistent hashing' without explaining the problem is insufficient — explain the % N issue first."
  },
  {
    "id": "q7",
    "subtopic": "Sharding Strategies",
    "style": "Decision Framework Application",
    "question": "You're sharding a user service and are deciding between hash-based and directory-based sharding. Directory-based means a lookup service stores 'which shard contains which key range.' What is the primary advantage of directory-based sharding and its main downside?",
    "options": [
      "Directory-based sharding has high cardinality distribution but introduces lookup latency. Every read must query the lookup service before finding the data, adding a hop. Consistent hashing is better because it calculates the shard directly.",
      "Directory-based sharding is more flexible than hash-based — you can reassign ranges to different shards at will by updating the lookup service, without remigrating data. But it introduces a single point of failure: if the lookup service is down, no queries work. You must replicate and cache it aggressively. Hash-based (or consistent hashing) avoids this dependency.",
      "Directory-based sharding has no advantages. It's obsolete because modern databases use consistent hashing.",
      "Directory-based sharding works best for range-based access patterns, while hash-based works for random access."
    ],
    "correctIndex": 1,
    "explanation": "The content states directory-based sharding provides 'flexibility' — you can reassign ranges without data migration. But it introduces 'lookup latency' and a 'single point of failure' in the lookup service. These are the key trade-offs. Consistent hashing avoids the lookup dependency but makes range reassignment harder.",
    "interviewScript": "In your interview, say: 'Directory-based sharding is flexible — I can move a range to a different shard without migrating data, just by updating the lookup service. But it's riskier: the lookup service becomes a dependency and potential bottleneck. If it's down, all queries fail. With hash-based or consistent hashing, there's no external dependency — shard assignment is calculated directly. That's more resilient.'",
    "proTip": null
  },
  {
    "id": "q8",
    "subtopic": "Sharding Strategies",
    "style": "Scenario-Based Trade-offs",
    "question": "You have a 10-shard system using consistent hashing with vnodes (virtual nodes). A new shard is added to the cluster. How many keys must migrate, and why does this matter for operational safety?",
    "options": [
      "All keys must migrate because consistent hashing requires a full rebalance when the ring is modified.",
      "Approximately 1/11th of all keys migrate to the new shard. This is the primary advantage of consistent hashing — minimal data movement. Vnodes ensure the migration is distributed: instead of one shard migrating all its keys, the load is spread across multiple shards, each losing 1/10th of their keys to the new shard. This prevents a single shard from becoming overloaded during rebalancing.",
      "Only keys in the new shard's assigned range migrate. With vnodes, this is typically 1-2% of total keys.",
      "No keys need to migrate with consistent hashing. The system adjusts automatically."
    ],
    "correctIndex": 1,
    "explanation": "The content mentions consistent hashing ensures that adding a node moves only 1/N of keys. Vnodes further improve this by distributing the rebalance load: instead of moving all of 1/11th from a single shard, the movement is spread across multiple shards. This prevents a single shard from becoming a bottleneck during rebalancing, making the operation safer in production.",
    "interviewScript": "In your interview, say: 'Consistent hashing moves roughly 1/11th of keys when adding a shard — much better than the 10/11 movement with modulo resharding. Vnodes make this even safer by distributing the movement across multiple shards. Instead of shard 0 pushing all its migrating keys to the new shard, the load is spread: shard 0, 1, 2, etc. each contribute a small amount. This prevents any single shard from being overloaded during rebalancing.'",
    "proTip": "Vnodes are a key optimization in modern sharding. Mention them unprompted to show you understand the operational reality of resharding."
  },
  {
    "id": "q9",
    "subtopic": "Hot Spots & Load Imbalance",
    "style": "Failure Analysis",
    "question": "Your Twitter-like social media platform uses user_id as the shard key. Your analytics reveal that the shard containing the CEO's user_id receives 10,000 requests/second while other shards average 100 requests/second. The CEO is very famous and has 5M followers who constantly view their profile and tweets. How would you mitigate this 'celebrity problem'?",
    "options": [
      "Switch to a hash-based shard key to distribute the CEO's data randomly. This solves the hot shard problem.",
      "This is a fundamental limitation of sharding by user_id. There's no mitigation.",
      "Create a dedicated shard (or shard replica) for the CEO's data. The shard key remains user_id, but high-cardinality users get their own shard home to avoid contention with regular users. Additionally, aggressively cache the CEO's profile and tweets in a separate cache tier to absorb most read requests without hitting the shard.",
      "Split the CEO's data into multiple logical shards using a compound key like (user_id, partition_id), spreading their data and load across 10 physical shards."
    ],
    "correctIndex": 2,
    "explanation": "The content explicitly describes the 'celebrity problem': certain keys (by value, not by hash) receive disproportionate load. Mitigations include: (1) dedicated shards for hot keys, (2) compound keys to split hot keys across multiple shards, (3) local caching of hot data. Option C uses dedicated shards plus aggressive caching, which is the content's recommended approach.",
    "interviewScript": "In your interview, say: 'This is the celebrity problem — certain user_ids are extremely hot. I'd handle it with two layers: (1) dedicated shard for the CEO's data to isolate their load from regular users, and (2) aggressive caching of their profile and tweets in a separate cache tier. Most reads hit the cache and never reach the shard. This way, the CEO's 10K req/sec doesn't contend with regular users.'",
    "proTip": "The celebrity problem is a classic hot spot scenario. Always mention dedicated shards or compound keys as mitigations. Pure sharding strategy changes won't help — you need targeted solutions."
  },
  {
    "id": "q10",
    "subtopic": "Hot Spots & Load Imbalance",
    "style": "Estimation-Backed Reasoning",
    "question": "You're building a time-series database for IoT sensor data. Each sensor writes one reading every 10 seconds. You shard by sensor_id. You discover that all sensors from a newly onboarded smart building wrote simultaneously on the first day, creating 100,000 concurrent writes to a single shard. Why is this a time-based hot spot, and how would you prevent it?",
    "options": [
      "This isn't a hot spot — 100K writes is routine for a well-designed shard. The problem is the IoT system's synchronization, not the sharding strategy.",
      "This is a time-based hot spot where all writes from a sensor group cluster in time. The issue is correlated startup timing. Mitigations include: (1) stagger sensor writes using random jitter or exponential backoff, (2) batch writes from correlated groups onto a temporary buffer before writing to shards, (3) use time-range shards with smaller ranges to spread the spike, (4) over-provision shards that handle concurrent sensor startups. The shard key (sensor_id) is still correct — this is a load distribution problem solved operationally.",
      "Time-based hot spots prove that sensor_id is a bad shard key. Switch to sharding by timestamp to distribute writes temporally.",
      "This is unavoidable in IoT systems. Accept the hot spot and use shard replication."
    ],
    "correctIndex": 1,
    "explanation": "The content describes time-based hot spots as a separate phenomenon from key-based hot spots. The cause is correlated write timing (all sensors starting simultaneously), not the shard key itself. Sensor_id remains the correct key. Mitigations include jitter (randomize write timing), buffering (batch correlated writes), and over-provisioning.",
    "interviewScript": "In your interview, say: 'This is a time-based hot spot from correlated sensor startup timing, not a problem with the shard key. sensor_id is still correct. I'd mitigate by adding jitter to sensor writes — randomize the timing so they don't start synchronously. I could also batch initial reads from new sensors into a temporary buffer before flushing to shards. And I'd over-provision the shards handling the building's startup window.'",
    "proTip": "Time-based and key-based hot spots are distinct problems. The shard key might be correct but the workload still creates hot spots due to timing patterns."
  },
  {
    "id": "q11",
    "subtopic": "Hot Spots & Load Imbalance",
    "style": "Gotcha/Trap",
    "question": "You monitor shard load and discover that shard 3 is 5x hotter than others. You increase its replication factor from 3 to 5 and add two read replicas. The next day, shard 3 is still 5x hotter. Why didn't read replication solve the problem?",
    "options": [
      "Read replicas didn't help because the bottleneck is write load, not read load. You replicated a shard that's hot on writes, which doesn't reduce write throughput — all writes still go to the primary. You should have split the hot shard into multiple shards using compound keys or dedicated shard instances for different key ranges.",
      "Read replicas always help. The problem is you didn't add enough — you should have added 10 replicas instead of 2.",
      "Read replication is incompatible with sharding. You must choose one or the other.",
      "The replicas need time to catch up. Give it a few days for the load to balance."
    ],
    "correctIndex": 0,
    "explanation": "A critical gotcha: read replication helps with read-heavy hot spots, not write-heavy ones. All writes go to the primary shard, so replication doesn't reduce write throughput. If shard 3 is hot on writes, the solution is splitting the shard (using compound keys) or dedicating shard instances to high-cardinality keys, not replication.",
    "interviewScript": "In your interview, say: 'Read replication helps when the hot spot is read-heavy, but if shard 3 is hot on writes, replication won't help. All writes still funnel to the primary. I need to split the hot shard — either using a compound key to spread keys across multiple shards, or dedicating separate shard instances to high-cardinality keys. That reduces write load on the primary.'",
    "proTip": "This is a classic gotcha. Replication is not a solution to all hot spots. Know when it helps (read-heavy) and when it doesn't (write-heavy)."
  },
  {
    "id": "q12",
    "subtopic": "Hot Spots & Load Imbalance",
    "style": "Scenario-Based Trade-offs",
    "question": "You decide to split the hot shard using a compound key: instead of sharding by user_id, you shard by (user_id, event_type). This spreads a hot user's events across multiple shards. What is the main trade-off introduced by this compound key approach?",
    "options": [
      "There are no trade-offs — compound keys are always better because they distribute load more evenly.",
      "Compound keys reduce query flexibility. Queries like 'get all events for user X' now require scatter-gather across all event_type shards. You can't efficiently fetch a single user's complete history from one shard anymore. This is the trade-off: even load distribution vs. query efficiency. The content notes this as a 'design compromise.'",
      "Compound keys double the shard key size, increasing memory usage and slowing comparisons. It's not worth the trade-off.",
      "Compound keys are incompatible with consistent hashing and force you to use directory-based sharding."
    ],
    "correctIndex": 1,
    "explanation": "Compound keys distribute load better (hot key problem solved) but hurt query alignment (queries by single user now scatter-gather). This is a classic trade-off between load distribution and query efficiency. The content implies these compromises are often necessary in real systems.",
    "interviewScript": "In your interview, say: 'Compound keys solve the hot shard problem by spreading a user's events across multiple shards. But they introduce a new problem: queries like \"get all events for user X\" now hit multiple shards. It's a trade-off between even load distribution and query efficiency. If the user's hot spot is the critical problem, it's a good trade-off.'",
    "proTip": null
  },
  {
    "id": "q13",
    "subtopic": "Cross-Shard Operations",
    "style": "Failure Analysis",
    "question": "Your e-commerce platform uses user_id as the shard key. A customer places an order, which triggers a query: 'sum the total value of all orders by this customer across all shards to check if they've exceeded credit limits.' This requires scatter-gather across 100 shards. You measure that this query takes 5 seconds, even though each individual shard responds in 50ms. Why is the scatter-gather so slow, and what does it signal about your design?",
    "options": [
      "The query is slow because you're hitting 100 shards. Reduce the shard count to 10 shards.",
      "The latency is driven by tail latency — the slowest shard's 50ms response determines the overall latency. With 100 shards in parallel, tail latency dominates. But more fundamentally, a 5-second operation for a critical path (credit check) signals that the design is wrong. Cross-shard operations are expensive and shouldn't be on the critical path. You should: (1) precompute credit limits in a separate index or cache, (2) denormalize customer credit into the order data, (3) use a background job to periodically update customer limits, so the credit check is a single-shard lookup.",
      "Scatter-gather is fine for occasional queries. You just need to make the queries async so they don't block the order placement.",
      "The design is correct. 5 seconds is acceptable for order processing."
    ],
    "correctIndex": 1,
    "explanation": "The content states scatter-gather queries are 'expensive' and 'a sign the design may need rethinking.' A 5-second cross-shard operation on the critical path is problematic. Solutions include precomputation, denormalization, and background jobs — all ways to avoid the scatter-gather at query time.",
    "interviewScript": "In your interview, say: 'Scatter-gather across 100 shards takes 5 seconds — too slow for a critical path like order placement. This signals a design problem. I'd avoid the cross-shard operation by precomputing the customer's credit status in a separate single-shard index, or denormalizing their current credit into the order table. Then the credit check is just a single-shard lookup. If that's not feasible, I'd batch-update credit limits nightly using a background job.'",
    "proTip": "Cross-shard operations are a red flag. They signal that either the shard key is misaligned with access patterns, or the query shouldn't be on the critical path."
  },
  {
    "id": "q14",
    "subtopic": "Cross-Shard Operations",
    "style": "Anti-Pattern Identification",
    "question": "A candidate proposes caching the result of a scatter-gather query 'sum total orders by user' in Redis with a 1-hour TTL to avoid repeated scatter-gather. The data is used to enforce customer credit limits. Why is this a problematic caching strategy?",
    "options": [
      "Caching is fine. A 1-hour stale window for credit data is acceptable.",
      "The cache itself becomes the hot spot if many queries read the same customer's credit data repeatedly.",
      "Caching the scatter-gather result hides the underlying design problem (the query shouldn't be on the critical path) and introduces staleness risk. If a customer's order value changes, the cache doesn't update immediately. They could exceed credit limits without immediate detection, or be incorrectly rejected. For critical operations like credit checks, 1-hour staleness is unacceptable. The real solution is to avoid the scatter-gather entirely: precompute the credit status or maintain a running total in a single-shard index updated with each order.",
      "Caching doesn't work with scatter-gather because the query is too complex."
    ],
    "correctIndex": 2,
    "explanation": "This is an anti-pattern of 'caching a broken design.' The content warns that caching is a symptom, not a cure. Scatter-gather queries on critical paths should be avoided by design (denormalization, precomputation, separate indexes), not hidden behind a cache that introduces staleness.",
    "interviewScript": "In your interview, say: 'Caching the result introduces staleness — if a customer places an order worth $10K, the cache doesn't reflect it for up to an hour. They could violate credit limits without immediate detection. For critical operations, that's unacceptable. The real fix is to avoid the scatter-gather entirely. I'd maintain a running total of customer orders in a separate single-shard index, updated when each order is placed. Then credit checks are instant, single-shard lookups.'",
    "proTip": null
  },
  {
    "id": "q15",
    "subtopic": "Cross-Shard Operations",
    "style": "Decision Framework Application",
    "question": "Your analytics platform needs to compute hourly aggregates across all user shards: 'sum of purchases per hour, for each of 1 billion users.' This requires scatter-gather at query time. Instead, you implement a batch job that runs every hour, computing aggregates from all shards and writing results to a separate aggregate store (sharded by time). Why is this the right approach for this use case?",
    "options": [
      "Batch computation wastes resources. Real-time scatter-gather queries are better because they're always fresh.",
      "Batch processing moves the expensive computation off the critical path. The query-time scatter-gather is replaced with a pre-computed result in the aggregate store, which is likely a simple index or cache lookup. This is acceptable for analytics because hour-old data is fine — freshness requirements are relaxed. The content advises using background jobs to 'precompute results' when cross-shard operations are expensive.",
      "Batch jobs are only suitable for final reporting, not for serving customer-facing queries.",
      "The aggregate store itself becomes a bottleneck because all aggregates write to it hourly."
    ],
    "correctIndex": 1,
    "explanation": "The content states: use 'background jobs to precompute results' as a solution to expensive cross-shard operations. For analytics workloads with relaxed freshness requirements, batch aggregation is ideal — it moves expensive computation off the critical path and serves pre-computed results.",
    "interviewScript": "In your interview, say: 'For hourly aggregates, I don't need real-time accuracy. A batch job that computes aggregates from all shards every hour and writes them to an aggregate store is perfect. The query-time cost drops from 'scatter-gather all billion users' to 'lookup pre-computed aggregate.' This is the right approach when freshness can be relaxed and cross-shard operations are expensive.'",
    "proTip": null
  },
  {
    "id": "q16",
    "subtopic": "Cross-Shard Operations",
    "style": "Critical Failure Modes",
    "question": "During an interview, the interviewer says: 'Your system requires frequent scatter-gather queries across 50 shards for critical path operations.' What does this signal about your design, and what's your response?",
    "options": [
      "Scatter-gather on the critical path means you need to scale to 100+ shards to parallelize faster.",
      "This signals that the shard key is misaligned with access patterns, or that the design itself needs rethinking. The content states scatter-gather is 'a sign to rethink the design.' If critical queries require hitting all shards, the design is working against you. Options: (1) reconsider the shard key to align with critical queries, (2) denormalize or replicate critical data to avoid cross-shard operations, (3) maintain separate indexes optimized for critical query patterns, (4) push this query off the critical path using caching or batch precomputation.",
      "Scatter-gather is fine if you implement it efficiently with proper connection pooling.",
      "The design is correct. Scale the infrastructure to handle scatter-gather latency."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly warns: scatter-gather is 'a sign the design may need rethinking.' If critical operations require hitting all shards, the design is fundamentally misaligned. The answer acknowledges this and outlines legitimate solutions.",
    "interviewScript": "In your interview, say: 'Frequent scatter-gather on the critical path is a red flag. It signals the shard key is misaligned with how data is actually accessed. I'd reconsider the design: maybe the shard key is wrong, or I need to denormalize critical data to a separate index. Or push this query off the critical path using precomputation or caching. Scatter-gather is expensive and shouldn't be on the critical path if avoidable.'",
    "proTip": "When interviewer points out scattered-gather, they're testing if you recognize it as a design smell. Acknowledge it frankly and propose solutions."
  },
  {
    "id": "q17",
    "subtopic": "Maintaining Consistency",
    "style": "Critical Failure Modes",
    "question": "You implement a cross-shard transaction using 2-phase commit (2PC): step 1 sends prepare requests to shards A, B, C; step 2 sends commit requests. During step 2, the network partitions and shard B never receives the commit message. What is the state of the system and why is 2PC problematic for sharded systems?",
    "options": [
      "Shard B will retry the transaction and eventually commit. 2PC is reliable.",
      "The transaction hangs. Shards A and C are committed, shard B is still in 'prepared' state with locks held, waiting for a commit that never arrives. All related data on shard B is locked and unavailable. This is the 'blocking problem' — shard B must wait for the coordinator to recover and send the delayed commit. 2PC is problematic for sharded systems because: (1) network partitions cause locks to be held indefinitely, (2) it's slow — two round trips across shards, (3) coordinator failure means the system can't recover until the coordinator comes back. The content states 2PC is 'slow and fragile.'",
      "2PC automatically rolls back on network partition, so the transaction is aborted.",
      "This scenario is impossible because network partitions are extremely rare."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly states 2PC is 'slow' and 'fragile.' The blocking problem during network partition (locks held indefinitely) is the key fragility. The content advises 'design to avoid cross-shard transactions' rather than relying on 2PC.",
    "interviewScript": "In your interview, say: '2PC has the blocking problem. During a network partition, prepared shards hold locks waiting for a commit that never arrives. If the coordinator fails, locks remain held indefinitely and data is unavailable. This is why the content advises designing to avoid cross-shard transactions. Better to use a saga pattern with compensating transactions, or redesign to keep related data on a single shard.'",
    "proTip": "Mention the blocking problem when criticizing 2PC. It's the core reason 2PC fails in distributed systems."
  },
  {
    "id": "q18",
    "subtopic": "Maintaining Consistency",
    "style": "Gotcha/Trap",
    "question": "You decide to avoid 2PC by redesigning your data model: instead of keeping customer and order data on separate shards, you keep them together on a shard using customer_id as the key. Now all customer updates and orders are on the same shard. But you discover that queries like 'what is the average order value across all customers?' now require scatter-gather. Are you solving the consistency problem or just moving it?",
    "options": [
      "You're solving it. Keeping data together eliminates cross-shard transactions, so consistency is guaranteed.",
      "You're moving the problem. You've solved the consistency issue (no more cross-shard transactions on the critical path), but created a new problem: analytical queries that need data from all shards. The trade-off is that you've chosen consistency and transactional correctness over query flexibility. For operational queries (customer + orders), this is the right trade-off. For analytical queries, you accept scatter-gather as a cost, or run them outside the critical path. The content states: 'design to avoid cross-shard transactions,' not 'make all queries fast.'",
      "This design is worse. You're preventing analytical queries from working efficiently.",
      "You've solved nothing. Cross-shard scatter-gather is the same problem as cross-shard transactions."
    ],
    "correctIndex": 1,
    "explanation": "This is a nuanced trade-off. The design solves the consistency problem (transactional correctness) but introduces query problems. The content implies this is the right choice — operational consistency is more important than analytical query speed. The content says 'design to avoid cross-shard transactions,' not 'design to make all queries fast.'",
    "interviewScript": "In your interview, say: 'I've solved the consistency problem — no more cross-shard transactions. But I've created a new problem for analytical queries. The trade-off is: transactional correctness on the critical path vs. analytical query flexibility. That's the right trade-off for an operational system. For the analytical queries, I run them outside the critical path or accept scatter-gather as a cost. The content makes clear: design to avoid cross-shard transactions, not to make every query fast.'",
    "proTip": null
  },
  {
    "id": "q19",
    "subtopic": "Maintaining Consistency",
    "style": "Scenario-Based Trade-offs",
    "question": "You implement a saga pattern for a cross-shard transaction: A debitCustomer, B createOrder, C creditMerchant. Step 2 (createOrder) fails. The saga must compensate: A creditCustomer (undo debit), C debitMerchant (undo credit). What is the key risk of this compensating transaction approach, and how do you mitigate it?",
    "options": [
      "The compensation itself could fail. If A creditCustomer fails, the customer is left debited without an order. This is why sagas are complex. Mitigations: (1) idempotent compensations (creditCustomer must be idempotent, safe to retry), (2) monitoring and manual intervention for compensation failures, (3) compensating transactions must be asynchronous and durable (logged before execution) so they can be retried indefinitely.",
      "Compensation is the wrong approach. Use 2PC instead.",
      "There is no risk. Compensating transactions always succeed because they undo simple operations.",
      "The risk is that the saga is too slow. Use immediate rollback instead."
    ],
    "correctIndex": 0,
    "explanation": "The content mentions saga pattern as an alternative to 2PC. The key insight is that sagas trade consistency for availability — they're loosely consistent. The compensating transactions themselves can fail, requiring idempotency and durability.",
    "interviewScript": "In your interview, say: 'The compensation itself could fail. If creditCustomer fails, the customer is permanently debited. The mitigation is to make all compensations idempotent and durable. Before executing a compensation, log it durably so it can be retried if it fails. And make creditCustomer idempotent — it's safe to retry if the first attempt partially succeeded.'",
    "proTip": "Sagas are not a 'easy alternative' to 2PC. They're loosely consistent and require careful handling of compensating transaction failures."
  },
  {
    "id": "q20",
    "subtopic": "Maintaining Consistency",
    "style": "Gotcha/Trap",
    "question": "Your team claims that eventual consistency is 'fine for any system' because 'data is eventually correct.' They propose using eventual consistency for a payment system where customers make purchases and reconcile accounting with the payment provider. What's wrong with this reasoning?",
    "options": [
      "Eventual consistency is never fine. Always use strong consistency.",
      "The claim conflates 'eventual correctness' with 'acceptable consistency.' For a payment system, eventual consistency creates a window where the system and payment provider disagree on who owes money. A customer sees their account debited but the order isn't created yet. Or the order exists but payment is still pending. For financial systems, this window is unacceptable. The content states eventual consistency is acceptable for 'analytics and metrics,' not for transactions. Financial data requires strong consistency or extremely tight consistency windows with compensating mechanisms.",
      "Eventual consistency is fine. Just add retries and the system will correct itself.",
      "The issue is that payment providers use strong consistency. If you use eventual consistency, they won't interoperate."
    ],
    "correctIndex": 1,
    "explanation": "The content explicitly names scenarios where eventual consistency is acceptable (analytics, metrics) and implies financial transactions are not. The window of inconsistency in a payment system creates liability and user confusion.",
    "interviewScript": "In your interview, say: 'Eventual consistency means there's a window where the system and payment provider disagree on the transaction state. A customer sees their account debited but the order isn't created. That window is unacceptable for a payment system. The content is clear: eventual consistency is fine for analytics and metrics, but not for transactions involving money. For payments, I need strong consistency or extremely tight windows with compensating mechanisms if inconsistency is detected.'",
    "proTip": "This is a fundamental concept: consistency models are workload-dependent. What's fine for metrics is unacceptable for money."
  },
  {
    "id": "q21",
    "subtopic": "Partitioning vs Sharding",
    "style": "Anti-Pattern Identification",
    "question": "A junior engineer says: 'Sharding is the same as partitioning. Both split data across storage.' Why is this a misleading conflation, and what's the key difference?",
    "options": [
      "They're actually the same. The terms are used interchangeably in the industry.",
      "Partitioning is splitting data within a single database (horizontal or vertical), while sharding is splitting across multiple machines. Partitioning is an internal optimization, sharding is a distributed systems pattern. The junior engineer's statement misses this distinction. Confusing them can lead to architectural mistakes: choosing partitioning when sharding is needed (can't scale beyond a single machine), or choosing sharding when simpler partitioning suffices (unnecessary distributed complexity).",
      "Sharding is modern, partitioning is obsolete.",
      "Partitioning is for reads, sharding is for writes."
    ],
    "correctIndex": 1,
    "explanation": "The content states: 'partitioning within a single database (horizontal/vertical), sharding across machines. The terms are used loosely.' This distinction is critical for design decisions.",
    "interviewScript": "In your interview, say: 'Partitioning and sharding sound similar but are different. Partitioning splits data within a single database — still one machine, one coordinator. Sharding splits across multiple machines — fully distributed. Confusing them is dangerous. If you think you only need partitioning and sharding becomes necessary later, you've already made architectural decisions that don't scale. The distinction matters.'",
    "proTip": null
  },
  {
    "id": "q22",
    "subtopic": "Partitioning vs Sharding",
    "style": "Decision Framework Application",
    "question": "You're designing a system with 10GB of data today and expecting 100GB in a year. Your current database is PostgreSQL on a single 2TB server. Should you shard now, or start with partitioning and shard later if needed?",
    "options": [
      "Shard immediately. Sharding should always be the first choice.",
      "Start with partitioning (PostgreSQL supports horizontal partitioning). 100GB easily fits on a single 2TB machine. Sharding introduces distributed complexity: network latency, partial failures, distributed transactions. Use it only when partitioning no longer scales. The content warns against 'premature sharding.'",
      "Start with sharding because the data is growing. It's better to be ready for growth.",
      "Partition to 10 partitions now, then add more partitions yearly. Avoid sharding entirely."
    ],
    "correctIndex": 1,
    "explanation": "The content emphasizes avoiding premature sharding. If the data fits on a single machine with one partition, start there. Sharding should come only when you exceed single-machine capacity or hit other bottlenecks (write throughput, connection limits). 100GB is easily within a 2TB machine's capacity.",
    "interviewScript": "In your interview, say: 'With 100GB of projected data, a single 2TB server handles it fine. I'd start with PostgreSQL partitioning to split the data logically. Only if I hit write throughput limits, connection exhaustion, or exceed the machine's capacity would I shard across multiple machines. The content emphasizes avoiding premature sharding — it adds distributed complexity that's not justified by 100GB of data.'",
    "proTip": "Premature sharding is a cardinal sin. Always start simple and shard only when necessary."
  },
  {
    "id": "q23",
    "subtopic": "Modern Database Sharding",
    "style": "Scenario-Based Trade-offs",
    "question": "You're choosing a database for a new sharded service. Cassandra uses Murmur3 hash with vnodes, DynamoDB uses internal partitions, MongoDB uses range-based chunks with hashed shard key. Which is the right choice for a multi-tenant analytics platform where tenants are isolated and queries are often tenant-specific?",
    "options": [
      "Cassandra, because Murmur3 and vnodes guarantee perfect load distribution.",
      "MongoDB with hashed shard key is the best choice. Hashed shard keys distribute load evenly and avoid hot ranges (like range-based sharding alone). MongoDB's balancer automatically moves chunks to rebalance, and support for range queries on non-shard-key fields keeps analytics flexible. Cassandra is good for pure time-series, DynamoDB for serverless workloads with simple queries.",
      "DynamoDB, because it's serverless and scales automatically.",
      "All three are equivalent for this use case."
    ],
    "correctIndex": 1,
    "explanation": "The content mentions that modern databases use different sharding strategies. MongoDB's approach (hashed shard key, automatic balancing) is well-suited for multi-tenant systems where even distribution is important. The automatic balancer solves the operational complexity of manual chunk migration.",
    "interviewScript": "In your interview, say: 'For a multi-tenant analytics platform, MongoDB with a hashed shard key is a good fit. It distributes tenants evenly across shards (avoiding hot shards), and the automatic balancer handles rebalancing as the cluster grows. Cassandra is more specialized for time-series, DynamoDB for serverless. MongoDB gives me the flexibility I need for analytics queries while keeping tenant isolation.'",
    "proTip": null
  },
  {
    "id": "q24",
    "subtopic": "Modern Database Sharding",
    "style": "Critical Failure Modes",
    "question": "You're using Vitess to shard a MySQL-based system. Vitess auto-shards and provides transparent shard routing. A developer writes a query that returns 'user.id, order.total from user join order on user.id = order.user_id'. Both tables are sharded by user_id, so this should work correctly. But the query times out. Why?",
    "options": [
      "Vitess auto-sharding is broken. Use a different tool.",
      "Even though both tables are sharded by the same key, the join still requires cross-shard correlation. The query must fetch rows from the 'user' shard, then for each user, fetch matching orders from the 'order' shard. If there are millions of users, this becomes a distributed join across many shards — expensive and slow. Vitess handles the routing transparently, but that doesn't eliminate the fundamental cost. The query needs optimization: precompute the join, denormalize order.total into user, or rewrite as separate queries.",
      "The query timed out because of network latency. Add a cache layer.",
      "Vitess requires all joins to be rewritten as subqueries."
    ],
    "correctIndex": 1,
    "explanation": "This highlights that transparent sharding hides complexity but doesn't eliminate it. Even with automated routing, distributed joins are expensive. Vitess makes it easier but doesn't change the fundamental cost.",
    "interviewScript": "In your interview, say: 'Transparent routing is convenient, but it doesn't eliminate the cost of distributed joins. Even though both tables are sharded by user_id, the join still requires correlating rows across shards for each user. For large datasets, that's expensive. I'd optimize by denormalizing order.total into user, or recomputing the join offline into a separate materialized view. Transparency doesn't mean free.'",
    "proTip": "Transparent sharding tools (Vitess, Citus) are powerful but can hide distributed complexity. Know the costs even when routing is automatic."
  },
  {
    "id": "q25",
    "subtopic": "Interview Strategy",
    "style": "Anti-Pattern Identification",
    "question": "An interviewer asks you to design a social media feed service. A candidate immediately says: 'I'll shard by user_id across 10 shards to handle the scale.' The interviewer asks: 'What scale?'. The candidate realizes the system needs to support 1M users, which fits on a single large machine. What's the mistake here?",
    "options": [
      "The candidate should have sharded by 100 instead of 10 shards.",
      "The candidate is committing premature sharding — introducing distributed complexity without justifying the need. The content warns against this. With 1M users, a single machine easily suffices. The correct approach is to propose a simple architecture first, identify the bottleneck (CPU, memory, throughput), and introduce sharding only if that bottleneck is hit.",
      "The candidate is correct. Sharding at 1M users is necessary.",
      "The candidate should have sharded by hashtag instead."
    ],
    "correctIndex": 1,
    "explanation": "The content emphasizes 'when to mention sharding' and warns against premature sharding. The interview strategy is to identify the bottleneck first, then propose sharding as a solution to that specific bottleneck.",
    "interviewScript": "In your interview, say: 'With 1M users, a single machine easily handles the data and throughput. Proposing sharding without identifying a bottleneck is premature sharding. The right approach is to start simple: estimate the database size (probably 10-50GB for 1M users), estimate throughput (reads/sec, writes/sec), and check if a single machine can handle it. Only if we hit the machine's limits do we shard. This shows I understand the tradeoffs.'",
    "proTip": "Premature sharding is the most common mistake in interviews. Always start simple and shard only when justified by a real bottleneck."
  },
  {
    "id": "q26",
    "subtopic": "Interview Strategy",
    "style": "Decision Framework Application",
    "question": "You're designing a system that needs to support 100 million users and 10 billion events per day. An interviewer asks: 'How would you introduce sharding into your design walk-through?' What's the right approach?",
    "options": [
      "Say 'I'll shard by user_id' without any justification.",
      "Start by estimating the bottleneck: 10B events/day = ~115K events/sec write throughput. Propose a single database instance and estimate its capacity: a database can handle ~50K write throughput with replication overhead. At 115K, a single instance is insufficient. Propose sharding to distribute writes across multiple instances. Then discuss the shard key (event or user_id?), strategy (hash-based for even distribution), and trade-offs. This shows you identified the bottleneck first, then introduced sharding as a targeted solution.",
      "Design a fully sharded system with 50 shards from the start.",
      "Avoid sharding and use a NoSQL database instead."
    ],
    "correctIndex": 1,
    "explanation": "The content states the interview strategy is to: 'identify the bottleneck (storage/write/read), then propose sharding as a solution, walk through shard key and strategy, address trade-offs.' Option B follows this exactly.",
    "interviewScript": "In your interview, say: 'Let me estimate the bottleneck. 10B events/day is about 115K writes/sec. A single database instance with replication can handle ~50K write throughput. That's insufficient, so I need sharding to distribute writes. I'd shard by event_id or user_id depending on access patterns. Hash-based sharding distributes evenly. The trade-off is that cross-shard queries become expensive, which is acceptable if the primary path is writing events.'",
    "proTip": "Always show your bottleneck analysis before proposing sharding. This demonstrates deep understanding, not pattern matching."
  },
  {
    "id": "q27",
    "subtopic": "Horizontal vs Vertical Partitioning",
    "style": "Critical Failure Modes",
    "question": "Explain the difference between horizontal and vertical partitioning. When would you use each?",
    "options": [
      "Horizontal partitioning splits rows (e.g., users 1-1M on shard 0, 1M-2M on shard 1). Vertical partitioning splits columns (e.g., user profile on one storage, user posts on another). Horizontal is for scale when data is large, vertical is for optimization when certain columns are accessed together more often.",
      "Horizontal partitioning is for tables, vertical is for databases.",
      "They're the same thing with different names.",
      "Horizontal is for reads, vertical is for writes."
    ],
    "correctIndex": 0,
    "explanation": "The content mentions 'horizontal/vertical partitioning' as distinct concepts. Horizontal splits rows, vertical splits columns. Each solves different problems.",
    "interviewScript": "In your interview, say: 'Horizontal partitioning splits data by rows — different user ranges on different partitions. Vertical splits by columns — user profile and user posts separated. Horizontal is for scaling large datasets, vertical is for optimization when certain columns are accessed together. For a 1M-user system, horizontal partitioning might be enough. Vertical is useful if we separate rarely-accessed columns like user profile from frequently-accessed like recent posts.'",
    "proTip": null
  },
  {
    "id": "q28",
    "subtopic": "Consistent Hashing",
    "style": "Estimation-Backed Reasoning",
    "question": "Explain consistent hashing and why it's better than modulo-based hashing for sharded systems.",
    "options": [
      "Consistent hashing uses a hash ring where nodes are placed at positions on the ring. A key's shard is determined by hashing the key and finding the nearest node clockwise on the ring. When a node is added or removed, only keys that hash near that node are affected — typically 1/N of the keys. Modulo-based reshards nearly all keys. This makes consistent hashing operationally safer for resharding.",
      "Consistent hashing is just a fancy name for modulo hashing with larger ranges.",
      "Consistent hashing is always better. Use it for everything.",
      "Consistent hashing only works for strings, not numbers."
    ],
    "correctIndex": 0,
    "explanation": "The content explicitly mentions consistent hashing as a solution to the hash modulo resharding problem. The 1/N key migration advantage is key.",
    "interviewScript": "In your interview, say: 'Consistent hashing places nodes on a hash ring. When I add a node, only keys near that node's position on the ring migrate — about 1/N of keys. Modulo-based hashing requires resharding 4/5 of keys when going from 4 to 5 shards. Consistent hashing is operationally safer for scaling clusters dynamically. It's especially useful for systems that need to add/remove nodes frequently, like distributed caches.'",
    "proTip": null
  },
  {
    "id": "q29",
    "subtopic": "Hash Modulo Resharding Problem",
    "style": "Gotcha/Trap",
    "question": "You implement hash-based sharding with modulo: shard = hash(key) % 4. You have 4 shards today. You want to add a 5th shard. Using consistent hashing, what percentage of keys need to migrate?",
    "options": [
      "80%, because 4/5 of keys change shard assignment with modulo.",
      "About 20%, or 1/(4+1). Consistent hashing ensures only keys near the new node's position on the ring migrate. Adding the 5th node affects roughly 1/5 of the keyspace.",
      "0%, because consistent hashing doesn't require resharding.",
      "100%, because adding a shard always requires a full rebalance."
    ],
    "correctIndex": 1,
    "explanation": "Consistent hashing's advantage is directly quantifiable: adding a node moves 1/N of keys, not (N-1)/N. This is the math that makes consistent hashing operationally superior.",
    "interviewScript": "In your interview, say: 'With modulo % 4 to % 5, 80% of keys change shard assignment — massive resharding. Consistent hashing reduces this to about 20%, or 1/(N+1). That's the operational advantage: adding a node only migrates 1/5 of the keyspace, not 4/5.'",
    "proTip": "The percentages matter. Know that consistent hashing reduces resharding from (N-1)/N to 1/N."
  },
  {
    "id": "q30",
    "subtopic": "Shard Rebalancing",
    "style": "Scenario-Based Trade-offs",
    "question": "You're rebalancing a sharded system because one shard is 10x hotter than others. You need to split the hot shard into two shards and migrate half the data. During migration, the hot shard serves both the old and new ranges, causing write latency to spike. How would you minimize disruption to clients?",
    "options": [
      "Pause all writes during migration to prevent race conditions.",
      "Run the migration during low-traffic hours, but that might take weeks if the shard is huge. Better approaches: (1) Use a gradual migration where old and new shards coexist, with a versioned shard assignment that clients check before each write ('write to shard X version 3'), (2) Implement application-level retry logic that handles write conflicts during migration, (3) Use eventual consistency — allow some writes to land on the old shard briefly, then migrate them to the new shard asynchronously. These approaches minimize the write latency spike during migration.",
      "Accept the latency spike as an unavoidable cost of rebalancing.",
      "Migrate only during maintenance windows when clients are offline."
    ],
    "correctIndex": 1,
    "explanation": "Real systems implement sophisticated migration strategies to minimize disruption. The most common approaches involve double-write periods (where writes go to both old and new shards), versioned shard assignments, and eventual consistency.",
    "interviewScript": "In your interview, say: 'Migrations cause disruption, but I can minimize it with careful engineering. Use a versioned shard assignment that clients check on each write — if the version has changed, write to both old and new shards briefly. Or implement eventual consistency: allow writes to land on the old shard, then migrate them to the new shard in the background. This spreads the data movement over time instead of causing a single latency spike.'",
    "proTip": "Rebalancing is a practical problem with real operational solutions. Mention these to show production experience."
  },
  {
    "id": "q31",
    "subtopic": "Virtual Nodes / Vnodes",
    "style": "Critical Failure Modes",
    "question": "What are virtual nodes (vnodes) in sharding, and why do modern systems like Cassandra use them instead of direct node assignment?",
    "options": [
      "Virtual nodes are just a marketing term. They don't provide real benefits.",
      "Each physical shard node is assigned multiple positions on the consistent hash ring (vnodes). Instead of one node at one ring position, a node might own 100 virtual positions. This improves rebalancing: when a node leaves, its vnodes are redistributed across many nodes instead of one node receiving a massive data transfer. It also improves failure recovery — a single node failure distributes data recovery across the entire cluster. Vnodes are a practical optimization for operational efficiency.",
      "Virtual nodes reduce the number of physical shards needed.",
      "Virtual nodes only work with consistent hashing."
    ],
    "correctIndex": 1,
    "explanation": "The content mentions vnodes in the context of modern database sharding (Cassandra). Vnodes distribute the rebalancing load and improve resilience.",
    "interviewScript": "In your interview, say: 'Virtual nodes give each physical node multiple positions on the consistent hash ring. When a node leaves, its vnodes spread across many remaining nodes instead of concentrating on one. This prevents any single node from being overwhelmed during rebalancing. It also speeds up recovery — when a node fails, the cluster replicates its data across many nodes in parallel instead of one node handling all the work.'",
    "proTip": "Vnodes are a practical optimization that modern systems use. Mention them to show you understand production sharding systems."
  },
  {
    "id": "q32",
    "subtopic": "Secondary Indexes in Sharded Systems",
    "style": "Failure Analysis",
    "question": "Your sharded e-commerce system is sharded by user_id. You need to support queries like 'find all orders with status=pending across all users.' You create a secondary index on status field. But queries still require scatter-gather across all shards. Why doesn't the secondary index help?",
    "options": [
      "Secondary indexes are broken in sharded systems.",
      "The secondary index is built per shard, not globally. Each shard has its own status index that only includes orders from users on that shard. To find all pending orders globally, you must check the status index on every shard — still scatter-gather. A global secondary index would help, but building one is complex: it must be updated whenever any shard's data changes, and queries must route to the index (which is itself a bottleneck). For this workload, denormalization or a separate read index sharded by status might be better.",
      "Secondary indexes work fine. The problem is the query is too broad.",
      "Use a primary index instead."
    ],
    "correctIndex": 1,
    "explanation": "Secondary indexes in sharded systems are local per shard, not global. This is a subtle but important limitation that affects query patterns.",
    "interviewScript": "In your interview, say: 'Each shard has its own status index, but it only covers that shard's data. A global query for pending orders must still hit all shards. A true global secondary index would help, but it's complex to maintain and becomes a bottleneck. For this query pattern, I'd use a separate index sharded by status, or denormalize status into the primary shard key alongside user_id.'",
    "proTip": "Understanding the limitations of secondary indexes in sharded systems shows operational depth."
  },
  {
    "id": "q33",
    "subtopic": "Shard Key Selection × Hot Spots",
    "style": "Critical Failure Modes",
    "question": "A platform shards by region (e.g., US, EU, APAC). Each region shard handles millions of users. But suddenly, the US shard becomes 5x hotter than others due to a viral event. The shard key (region) is now misaligned with actual load. How would you address this without changing the shard key?",
    "options": [
      "Change the shard key to something else — migrate all data to a new key immediately.",
      "Split the US region shard into sub-shards (e.g., US-East, US-West) using a compound key, replicate hot data to spread read load, and cache viral event data — these short-term mitigations buy time while you evaluate whether region remains the right shard key long-term.",
      "The shard key is fine. The problem is that US has more users than other regions, so just vertically scale that shard.",
      "Replicate all regions equally and traffic will balance automatically across replicas."
    ],
    "correctIndex": 1,
    "explanation": "This bridges shard key selection and hot spots. Even a reasonable shard key (region) can create hot spots if the underlying workload is skewed. Short-term mitigations exist, but the long-term solution might be rethinking the shard key.",
    "interviewScript": "In your interview, say: 'Region is a reasonable shard key until workload becomes skewed. The viral event exposed its limitation. Short-term: split the US shard into sub-regions, replicate to spread read load, or cache the hot data. But this is a symptom that region isn't the right key for this workload's patterns. Long-term, I'd redesign to shard by user_id with region as a secondary attribute.'",
    "proTip": null
  },
  {
    "id": "q34",
    "subtopic": "Sharding Strategies × Modern DBs",
    "style": "Decision Framework Application",
    "question": "You're evaluating between MongoDB (sharded by hashed shard key) and DynamoDB (sharded internally by partition key) for a real-time recommendation service. Both support sharding. Which is a better fit and why?",
    "options": [
      "Both are equivalent. Choose based on cost.",
      "MongoDB is better — it gives you control over shard key strategy and supports complex aggregation queries that recommendation engines need. DynamoDB's opaque internal sharding and limited query model make it harder to optimize for complex access patterns.",
      "DynamoDB is better because it's serverless and scales automatically.",
      "MongoDB is better because it's always been around longer."
    ],
    "correctIndex": 1,
    "explanation": "The content mentions that modern databases shard differently. The choice depends on whether you need control and complexity (MongoDB) or simplicity and auto-scaling (DynamoDB). For recommendation services with complex queries, MongoDB's transparency matters.",
    "interviewScript": "In your interview, say: 'For a recommendation service, I need control over sharding strategy and complex query support. MongoDB lets me shard by user_id, run aggregations across recommendations, and optimize for access patterns. DynamoDB is serverless but opaque — I can't control sharding, and query capabilities are limited. MongoDB gives me the flexibility the recommendation logic requires.'",
    "proTip": null
  },
  {
    "id": "q35",
    "subtopic": "Cross-Shard Ops × Consistency",
    "style": "Scenario-Based Trade-offs",
    "question": "You have a user service sharded by user_id and an order service sharded by user_id. A user deletes their account, which requires: (1) delete user from user service, (2) delete orders from order service, (3) send deletion notification. These happen across two shards. How would you implement this safely?",
    "options": [
      "Use 2PC to ensure atomicity.",
      "Use a saga pattern: emit 'delete user' event, each service processes independently with compensating actions on failure. Brief inconsistency windows are acceptable for account deletion, and the event-driven approach avoids 2PC's blocking problem.",
      "Execute both deletions sequentially, checking for errors.",
      "Delete is too dangerous in a distributed system. Don't allow account deletion."
    ],
    "correctIndex": 1,
    "explanation": "This applies saga pattern to a real-world scenario. Event-driven sagas are the modern solution to cross-shard consistency.",
    "interviewScript": "In your interview, say: 'I'd use a saga pattern with events. User deletion triggers a 'deleteUser' event. The user service processes it and deletes, emitting 'userDeleted'. The order service processes and deletes, emitting 'ordersDeleted'. The notification service sends the notification. If order deletion fails, a compensating transaction re-creates the user (if that's safe). This avoids 2PC's blocking and gives me eventual consistency for account deletion.'",
    "proTip": null
  },
  {
    "id": "q36",
    "subtopic": "Interview Strategy × Premature Sharding",
    "style": "Interviewer Pushback",
    "question": "In an interview, you propose a design for a 10M user system. The interviewer says: 'I'm concerned you're over-engineering. Is sharding really necessary here?' What's the best response that shows you understand trade-offs?",
    "options": [
      "You're right, let me start with a simple single-shard design and add sharding only if we hit bottlenecks.",
      "Let me estimate the bottleneck first. 10M users, if each has ~1KB of metadata, is 10GB — fits on a single machine. For throughput, if the system has 100 QPS reads, a single database handles that easily. Sharding introduces complexity: distributed transactions, resharding operations, query routing. Without a clear bottleneck (capacity or throughput), introducing sharding is premature. I'd start simple, monitor the bottleneck, and shard only if necessary. If the interviewer reveals 1000 QPS writes, then sharding becomes justified — a single database can't handle that throughput.",
      "Sharding is best practice. Always shard from the start.",
      "I'll shard anyway, just in case."
    ],
    "correctIndex": 1,
    "explanation": "This demonstrates the interview strategy the content recommends: start simple, identify the bottleneck, introduce sharding as a solution.",
    "interviewScript": "In your interview, say: 'Good point. Let me estimate: 10M users with 1KB metadata is 10GB — single machine handles that. For throughput, without knowing the QPS, I'll assume a typical system: maybe 100-200 QPS reads, easily handled by one database. Sharding adds complexity for resharding, routing, distributed ops. Without a clear bottleneck, it's premature. I'd start simple, monitor, and shard only if we hit capacity or throughput limits.'",
    "proTip": "Being willing to simplify your design when challenged shows confidence and understanding. Interviewers respect this more than blind insistence on sharding."
  }
];

export default {
  questions: QUESTIONS
};
