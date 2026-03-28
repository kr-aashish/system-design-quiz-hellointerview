// === COVERAGE MANIFEST ===
// Content type: deep pattern (single algorithm with multiple facets)
//
// HEAVY subtopics:
//   Consistent Hashing Core Mechanism (hash ring, clockwise lookup) — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Nested: Hash ring structure & key placement — covered by: [q1, q2]
//     └─ Nested: Clockwise traversal & node assignment — covered by: [q3, q4]
//   Virtual Nodes — Questions: 4 — IDs: [q5, q6, q7, q8]
//     └─ Nested: Load distribution on failure — covered by: [q5, q6]
//     └─ Nested: Virtual node naming/hashing — covered by: [q7]
//     └─ Nested: Adding nodes with vnodes — covered by: [q8]
//   Adding/Removing Nodes (data redistribution) — Questions: 3 — IDs: [q9, q10, q11]
//     └─ Nested: Bounded data movement — covered by: [q9, q10]
//     └─ Nested: Failure handling — covered by: [q11]
//   Hot Spots & Mitigation Strategies — Questions: 4 — IDs: [q12, q13, q14, q15]
//     └─ Nested: Read replicas — covered by: [q12]
//     └─ Nested: Key-space salting — covered by: [q13, q14]
//     └─ Nested: Adaptive rebalancing — covered by: [q15]
//
// MEDIUM subtopics:
//   Simple Modulo Hashing (problems) — Questions: 2 — IDs: [q16, q17]
//   Data Movement & Replication in Practice — Questions: 3 — IDs: [q18, q19, q20]
//     └─ Nested: Raft/consensus on failure — covered by: [q18]
//     └─ Nested: Replication factor restoration — covered by: [q19, q20]
//   Real-World Systems (Cassandra, DynamoDB, CDNs, Redis) — Questions: 2 — IDs: [q21, q22]
//
// THIN subtopics (standalone):
//   When to Use in Interviews — Questions: 1 — IDs: [q23]
//   Hash Space Size (2^32) — Questions: 1 — IDs: [q24]
//
// THIN subtopics (clustered):
//   Cluster: Redis Fixed Hash Slots + Consistent Hashing Trade-off — Questions: 1 — IDs: [q25]
//   Cluster: Structural Imbalance vs Workload Imbalance — Questions: 1 — IDs: [q26]
//   Cluster: Kleppmann's observation + loose terminology — Questions: 1 — IDs: [q27]
//
// CROSS-SUBTOPIC bridges:
//   Consistent Hashing × Virtual Nodes — IDs: [q28]
//   Virtual Nodes × Hot Spots — IDs: [q29]
//   Replication × Consistent Hashing — IDs: [q30]
//   Modulo Hashing × Consistent Hashing (contrast) — IDs: [q31]
//   Hot Spots × Real-World Systems — IDs: [q32]
//
// Anti-pattern questions: 4 — IDs: [q10, q16, q17, q26]
// Gotcha/trap questions: 4 — IDs: [q7, q13, q24, q27]
//
// Total: 32 questions across 11 subtopics (4 heavy, 3 medium, 4 thin/clustered)
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, Flag, SkipForward, CheckCircle, XCircle, ArrowRight, RotateCcw, ChevronRight, AlertTriangle, Lightbulb, MessageSquare, Award, BarChart3, BookOpen, Shuffle, List, Timer } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    subtopic: "Consistent Hashing Core",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "You're designing a distributed cache with 8 nodes. Using a consistent hash ring, Node A sits at position 1000 and Node B sits at position 5000 on a 0–2^32 ring. A key hashes to position 4999. A teammate argues this key should go to Node A because it's 'closer in absolute distance.' What's the correct assignment and why?",
    options: [
      "Node B at position 5000, because consistent hashing always assigns to the next node clockwise from the key's position, and 5000 is the first node encountered moving clockwise from 4999",
      "Node A at position 1000, because the ring wraps around and A is numerically closer when considering modular arithmetic on the full ring",
      "Either node is valid — consistent hashing allows the client to choose the nearest node in either direction for latency optimization",
      "Node B, but only if virtual nodes are enabled; without virtual nodes, the key falls into a dead zone between physical nodes"
    ],
    correct: 0,
    explanation: "Consistent hashing uses strictly clockwise traversal from a key's hash position to find the responsible node. The key at 4999 moves clockwise and hits Node B at 5000 first. Absolute distance or counter-clockwise proximity is irrelevant — the algorithm is directional. The teammate's confusion about 'closest node' is a common misconception; consistent hashing is not nearest-neighbor lookup, it's next-clockwise-node lookup.",
    interviewScript: "In your interview, say: 'Consistent hashing assigns keys by traversing clockwise from the key's hash position until hitting the first node. Direction matters — we always go clockwise, not to the nearest node. This deterministic rule is what makes lookups O(log n) with a sorted node list.'",
    proTip: "In production implementations like Cassandra's token ring, the 'clockwise' lookup is actually a binary search on a sorted list of node positions, giving O(log n) lookup time."
  },
  {
    id: "q2",
    subtopic: "Consistent Hashing Core",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "You have a consistent hash ring with 4 physical nodes placed at equal intervals (positions 0, 2^30, 2^31, 3×2^30 on a 2^32 ring). You insert 1 million uniformly distributed keys. Approximately how many keys does each node own, and what property of the hash function makes this work?",
    options: [
      "~250,000 keys each, because the uniform distribution of keys combined with equal node spacing means each node's arc covers exactly 1/4 of the ring, and a good hash function ensures keys are uniformly distributed across the ring",
      "~250,000 keys each, but only because we used 4 nodes — with a prime number of nodes, the distribution would be significantly skewed due to hash collision clustering",
      "Highly variable per node (±50%) because hash functions produce pseudo-random outputs that cluster unpredictably, and 1 million keys isn't enough for the law of large numbers to apply",
      "Exactly 250,000 keys each, because the hash ring guarantees perfect distribution regardless of the hash function quality or key patterns"
    ],
    correct: 0,
    explanation: "With equally-spaced nodes, each owns a 1/4 arc of the ring. A cryptographic hash function (like SHA-256 or MD5) produces uniformly distributed outputs, so ~250K keys land in each arc. The distribution is approximate (not exact) due to randomness, but with 1M keys the variance is very small. Prime vs non-prime node count doesn't cause clustering — that's a myth from modulo hashing. And no hash ring guarantees perfect distribution; it's probabilistic.",
    interviewScript: "In your interview, say: 'With N equally-spaced nodes, each owns 1/N of the ring. A good hash function distributes keys uniformly, so each node gets roughly 1/N of all keys. The quality of this distribution depends on the hash function's uniformity property, not the number of nodes.'",
    proTip: null
  },
  {
    id: "q3",
    subtopic: "Consistent Hashing Core",
    tier: "Heavy",
    style: "Failure analysis",
    question: "Your consistent hash ring has nodes at positions 10, 30, 60, and 85 (on a 0-99 ring). A client caches the ring topology and routes key K (hash=88) to node at position 10 (correct, since 10 is the next clockwise after 85→0→10). The node at position 10 crashes. The client hasn't received the updated topology yet. What happens?",
    options: [
      "The client sends the request to the crashed node at position 10, gets a connection timeout, and must either retry with a refreshed topology or fall back to the next clockwise node at position 30 — this is a window of unavailability that consistent hashing alone doesn't solve",
      "The hash ring automatically reroutes to position 30 since consistent hashing has built-in failure detection via heartbeat mechanisms on the ring",
      "The key is lost because consistent hashing provides no mechanism for handling stale topology, and the client will permanently route to the dead node",
      "The client's request succeeds because the node at position 30 automatically assumes responsibility for position 10's range the instant it fails, transparently to clients"
    ],
    correct: 0,
    explanation: "Consistent hashing is a data placement algorithm, not a failure detection or routing protocol. When a client has stale topology, it will attempt to contact the crashed node and fail. The client needs a separate mechanism (health checks, gossip protocol updates, or a service discovery system) to learn about the failure and update its ring view. This unavailability window is why production systems layer replication and failure detection on top of consistent hashing.",
    interviewScript: "In your interview, say: 'Consistent hashing tells us where data should live, but it doesn't handle failure detection. In practice, we need a separate layer — like gossip protocols in Cassandra or a coordination service — to propagate topology changes to clients and minimize the window of stale routing.'",
    proTip: "This is why DynamoDB and Cassandra replicate to N consecutive nodes on the ring. Even with a stale client, a request to any of the N replicas succeeds, masking individual node failures."
  },
  {
    id: "q4",
    subtopic: "Consistent Hashing Core",
    tier: "Heavy",
    style: "Implementation-specific nuance",
    question: "Two teams implement consistent hashing for a shared distributed cache. Team A uses MD5 to hash keys and node IDs. Team B uses CRC32. Both place the same 6 physical nodes on their respective rings. After running for a week, Team B reports significant load imbalance across nodes despite equal traffic patterns. What's the most likely root cause?",
    options: [
      "CRC32 produces a 32-bit output with weaker uniformity properties than MD5's 128-bit output, leading to less uniform node placement on the ring and therefore uneven arc sizes between nodes — 6 nodes isn't enough to average out CRC32's distribution weaknesses",
      "CRC32 is faster than MD5, causing Team B's ring to process more requests and create a thundering herd effect on certain nodes",
      "MD5 is cryptographically secure while CRC32 is not, and the security difference directly impacts load distribution fairness",
      "Both hash functions produce identical distributions for 6 nodes; the imbalance must be caused by differences in the teams' routing logic, not the hash function choice"
    ],
    correct: 0,
    explanation: "CRC32 is a checksum algorithm designed for error detection, not uniform distribution. With only 6 physical nodes, CRC32's weaker uniformity can cause nodes to cluster on the ring, creating very uneven arc sizes. MD5 (128-bit, cryptographic) distributes much more uniformly. This is why production systems like Cassandra use MD5 or Murmur3 for consistent hashing — the hash function's uniformity directly impacts load balance. Cryptographic security is irrelevant; it's the uniformity that matters.",
    interviewScript: "In your interview, say: 'The choice of hash function critically affects load distribution in consistent hashing. We need a function with strong uniformity properties — like MD5 or MurmurHash — not just any hash. CRC32 is a checksum, not designed for uniform distribution, and with few nodes the clustering effect becomes severe.'",
    proTip: "MurmurHash3 is the most common choice in modern systems (Cassandra uses it). It's non-cryptographic but has excellent uniformity and is much faster than MD5."
  },
  {
    id: "q5",
    subtopic: "Virtual Nodes",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "You're running a consistent hash ring with 5 physical nodes, each assigned 200 virtual nodes. One of the 5 physical nodes has 2x the memory and CPU of the others. How should you handle this heterogeneous hardware to maximize resource utilization?",
    options: [
      "Assign the powerful node 400 virtual nodes instead of 200, giving it proportionally more arc coverage on the ring and therefore roughly 2x the data and traffic — virtual nodes make heterogeneous capacity trivial to handle",
      "Keep all nodes at 200 virtual nodes but configure the powerful node as a read replica for the others, since consistent hashing doesn't support weighted distribution",
      "Replace the powerful node with 2 standard nodes since consistent hashing fundamentally requires homogeneous hardware for balanced distribution",
      "Assign the powerful node 200 virtual nodes like the others but use application-level routing to send overflow traffic to it, keeping the hash ring unaware of capacity differences"
    ],
    correct: 0,
    explanation: "Virtual nodes elegantly solve heterogeneous capacity. By giving the powerful node 2x virtual nodes, it owns ~2x the ring's arc space, receiving proportionally more keys and traffic. This is one of virtual nodes' key advantages beyond just balancing equal-capacity nodes. Options B and D work around the problem unnecessarily — virtual node weighting is the standard approach. Option C wastes resources by requiring hardware homogeneity.",
    interviewScript: "In your interview, say: 'Virtual nodes naturally handle heterogeneous hardware. We assign more virtual nodes to more powerful machines proportionally to their capacity. This means a node with 2x resources gets 2x virtual nodes and handles ~2x the load, all without any application-level routing complexity.'",
    proTip: null
  },
  {
    id: "q6",
    subtopic: "Virtual Nodes",
    tier: "Heavy",
    style: "Failure analysis",
    question: "Your cluster has 4 physical nodes (A, B, C, D), each with 150 virtual nodes spread across the ring. Node B fails permanently. Approximately how is Node B's data redistributed, and why is this better than the no-virtual-node scenario?",
    options: [
      "Node B's ~150 virtual node arcs are scattered around the ring, so each arc's data flows to whichever node's virtual node is next clockwise — spreading B's load roughly evenly across A, C, and D instead of dumping it all on one neighbor",
      "Node B's data is split evenly into exactly 3 equal portions (one-third each to A, C, D) because virtual nodes guarantee mathematically perfect redistribution",
      "Only 50% of Node B's data moves — the rest is handled by virtual node redundancy where multiple virtual nodes of the same physical node back each other up",
      "Node B's data goes to whichever physical node has the fewest virtual nodes currently assigned, since the ring auto-rebalances virtual node counts on failure"
    ],
    correct: 0,
    explanation: "With 150 virtual nodes scattered around the ring, Node B's arcs are interleaved with virtual nodes from A, C, and D. When B fails, each of B's virtual node arcs hands off to the next clockwise node — which could be any of A, C, or D. Because virtual nodes are well-distributed, B's load spreads roughly evenly across all survivors. Without virtual nodes, B's single arc would dump 100% of its load onto one clockwise neighbor. The distribution isn't mathematically exact (option B), but it's dramatically better than the single-node-overload scenario.",
    interviewScript: "In your interview, say: 'Virtual nodes ensure that when a node fails, its load distributes across all remaining nodes rather than overwhelming a single neighbor. Each of the failed node's virtual node arcs transfers to different successor nodes around the ring, giving us roughly even redistribution.'",
    proTip: null
  },
  {
    id: "q7",
    subtopic: "Virtual Nodes",
    tier: "Heavy",
    style: "Gotcha/trap",
    question: "A junior engineer implements virtual nodes by hashing 'NodeA-1', 'NodeA-2', ..., 'NodeA-200' to place Node A's virtual nodes on the ring. They use a simple hash function and notice that many virtual node positions cluster together. They propose fixing this by using 200 different hash functions instead. What's wrong with this proposal, and what's the actual fix?",
    options: [
      "Using 200 hash functions is unnecessary and operationally complex — the real fix is to use a single high-quality hash function (like MurmurHash3 or MD5) because a good hash function will naturally distribute 'NodeA-1' through 'NodeA-200' uniformly across the ring",
      "Using 200 hash functions is the correct approach because a single hash function cannot guarantee uniform distribution of related input strings like 'NodeA-1' and 'NodeA-2'",
      "The fix is to use random positions instead of hash-based positions for virtual nodes, since hashing inherently creates clusters for sequentially named inputs",
      "Neither approach works — the only reliable solution is to manually place virtual nodes at computed equidistant positions around the ring"
    ],
    correct: 0,
    explanation: "This is a common implementation trap. The clustering isn't caused by using one hash function — it's caused by using a weak hash function. A cryptographic or high-quality hash (MD5, SHA, MurmurHash3) treats 'NodeA-1' and 'NodeA-2' as completely unrelated inputs and distributes them uniformly. Multiple hash functions add complexity (all clients must agree on all 200 functions) with no benefit. Random positions (option C) would work but lose determinism — all clients must compute the same positions independently. Equidistant placement (option D) breaks when nodes are added/removed.",
    interviewScript: "In your interview, say: 'Virtual node positions should be computed by hashing variations of the node name — like DB1-vn1, DB1-vn2 — through a single high-quality hash function. A good hash function makes these inputs independently uniform. Using multiple hash functions adds needless complexity.'",
    proTip: "In Cassandra, virtual nodes (vnodes) are assigned random tokens from the ring space at bootstrap time. The positions are persisted, so they're deterministic after initial assignment even though they start random."
  },
  {
    id: "q8",
    subtopic: "Virtual Nodes",
    tier: "Heavy",
    style: "Multi-hop reasoning",
    question: "You have a 5-node cluster with 100 virtual nodes each. You add Node F with 100 virtual nodes. Without virtual nodes, adding a node only relieves one neighbor. With virtual nodes, approximately how many existing nodes does Node F take data from, and what determines this?",
    options: [
      "Node F takes data from all 5 existing nodes, because its 100 virtual node positions are scattered across the ring, and each one absorbs a small portion from whichever existing node's virtual node was previously responsible for that arc",
      "Node F takes data from exactly 1 node — the one with the most data — because virtual nodes use a load-aware placement algorithm that targets the heaviest node first",
      "Node F takes data from 2-3 nodes on average, because virtual nodes cluster in groups and only affect nearby physical nodes on the ring",
      "Node F takes data from all 5 existing nodes, but only if you manually trigger a rebalance operation — virtual nodes don't automatically redistribute data on join"
    ],
    correct: 0,
    explanation: "Node F's 100 virtual nodes hash to positions scattered uniformly around the ring. Each virtual node position is 'inserted' into the ring, taking over a small arc from whichever existing node's virtual node was the next clockwise. Since F's 100 positions are well-distributed, they'll land in arcs owned by all 5 existing nodes. This means F absorbs small amounts of data from every existing node — giving a much smoother addition than without virtual nodes, where only one neighbor would be affected.",
    interviewScript: "In your interview, say: 'With virtual nodes, adding a new node absorbs data from all existing nodes, not just one neighbor. The new node's virtual positions scatter across the ring, each taking a small arc from a different predecessor. This gives us a balanced cluster immediately.'",
    proTip: null
  },
  {
    id: "q9",
    subtopic: "Adding/Removing Nodes",
    tier: "Heavy",
    style: "Estimation-backed reasoning",
    question: "You have a consistent hash ring with N nodes (no virtual nodes), equally spaced. You add one new node. What fraction of total keys must be redistributed, and how does this compare to modulo hashing's redistribution?",
    options: [
      "Approximately 1/N of all keys must move (only keys in the new node's arc), compared to modulo hashing where approximately (N-1)/N keys — nearly all — must be redistributed",
      "Approximately 1/2 of all keys must move because the new node splits the ring in half, compared to modulo hashing where all keys move",
      "Approximately 1/(N+1) of all keys move in both consistent hashing and modulo hashing — the algorithms redistribute the same amount, just differently",
      "Zero keys move initially — consistent hashing lazily migrates keys only when they're next accessed, while modulo hashing requires immediate full redistribution"
    ],
    correct: 0,
    explanation: "When adding one node to N equally-spaced nodes, the new node takes responsibility for one arc — roughly 1/(N+1) of the ring, but approximately 1/N of keys from its clockwise neighbor. With modulo hashing, changing from N to N+1 in 'hash % N' scrambles nearly every key's assignment: approximately (N)/(N+1) ≈ (N-1)/N keys must move. For N=10, consistent hashing moves ~10% while modulo moves ~90%. This bounded redistribution is consistent hashing's fundamental advantage.",
    interviewScript: "In your interview, say: 'This is the core value proposition. Adding a node with consistent hashing moves only about 1/N of keys — the new node's arc. Modulo hashing moves nearly everything because the modulus changes for all keys. At scale with 100 nodes, that's 1% vs ~99% redistribution.'",
    proTip: null
  },
  {
    id: "q10",
    subtopic: "Adding/Removing Nodes",
    tier: "Heavy",
    style: "Anti-pattern identification",
    question: "A candidate proposes: 'When adding a new node to the consistent hash ring, I'll pre-compute all key movements, pause writes during migration, move the data, then resume writes. This ensures zero data inconsistency.' What's the most critical flaw in this approach?",
    options: [
      "Pausing writes causes downtime proportional to data migration time — at terabyte scale this could be hours. Production systems instead use a transition period where both old and new nodes can serve reads, with the new node gradually streaming data from the old one while writes go to the new owner",
      "The approach is actually correct and is the standard way to handle node additions in consistent hashing — the pause duration is negligible since only 1/N of data moves",
      "The flaw is that you can't pre-compute key movements because the hash function is non-deterministic and produces different results each time",
      "The approach works but only if you have fewer than 1000 keys — above that threshold, consistent hashing requires virtual nodes for any data movement"
    ],
    correct: 0,
    explanation: "The 'stop-the-world' migration is a classic anti-pattern. Even though consistent hashing limits movement to ~1/N of keys, at scale that's still terabytes. Pausing writes for the entire migration creates unacceptable downtime. Production systems like DynamoDB and Cassandra use streaming-based migration: the new node gradually receives data while the old node continues serving, with a coordination protocol handling the transition period. Hash functions are deterministic (option C is wrong), and the approach fails at any scale with significant data, not just above some threshold.",
    interviewScript: "In your interview, say: 'I'd avoid a stop-the-world migration. Instead, I'd use a gradual handoff: the new node starts accepting writes for its range immediately while streaming existing data from the old owner in the background. Reads during transition can go to either node with version reconciliation.'",
    proTip: "DynamoDB's approach: the new node becomes the 'pending' owner, receives new writes, while a background process streams existing items. The old node continues serving reads until streaming completes."
  },
  {
    id: "q11",
    subtopic: "Adding/Removing Nodes",
    tier: "Heavy",
    style: "Critical failure mode",
    question: "In a 6-node consistent hash ring with replication factor 3 (data replicated to 3 consecutive clockwise nodes), two adjacent nodes fail simultaneously. What happens to data availability, and what's the subtle risk most candidates miss?",
    options: [
      "Most data remains available from the third replica, but keys whose primary AND both replica nodes include the two failed nodes lose all copies — and critically, the surviving nodes now need to re-replicate to restore RF=3, which creates a burst of cross-node traffic that can cascade-fail remaining nodes if not throttled",
      "All data remains fully available because replication factor 3 means any 2 of 3 replicas can serve reads, and 4 surviving nodes always contain at least 1 replica of every key",
      "50% of data becomes unavailable because 2 out of 6 nodes failed, and consistent hashing distributes data proportionally across all nodes",
      "All data remains available but is read-only because consistent hashing requires a quorum of 2/3 replicas for writes, and losing 2 adjacent nodes always breaks quorum for some keys"
    ],
    correct: 0,
    explanation: "With RF=3 and consecutive replication, each key is stored on 3 adjacent clockwise nodes. If 2 adjacent nodes fail, keys where both failed nodes are among the 3 replicas lose 2 of 3 copies — they're still available from the third. BUT the subtle risk is re-replication storms: surviving nodes must re-replicate all under-replicated data to restore RF=3, and this burst of internal traffic (potentially terabytes) can overwhelm the surviving nodes, causing cascading failures. This is why systems like Cassandra have configurable re-replication throttling.",
    interviewScript: "In your interview, say: 'With RF=3, losing 2 adjacent nodes still leaves 1 copy of most data. But the real danger is the re-replication storm to restore the replication factor. Surviving nodes get hit with massive internal transfer load, which can cascade. I'd use throttled re-replication and prioritize serving reads over restoring RF.'",
    proTip: "This is called a 'repair storm' in Cassandra terminology. The nodetool repair command has a -j flag to limit parallelism specifically to prevent this cascading effect."
  },
  {
    id: "q12",
    subtopic: "Hot Spots",
    tier: "Heavy",
    style: "Scenario-based trade-off",
    question: "Your distributed cache uses consistent hashing. A viral event causes one key ('super-bowl-2027') to receive 500K reads/second — 100x normal per-key traffic. The node owning this key is maxed out. You have three options: add read replicas, use key-space salting, or add more virtual nodes to the overloaded physical node. Which approach is correct and why?",
    options: [
      "Read replicas for this specific key — replicate the hot key's data to multiple nodes and load-balance reads across them. This directly addresses the traffic imbalance without changing key distribution. Virtual nodes won't help because the problem is traffic concentration on one key, not uneven key distribution",
      "Key-space salting is best — split 'super-bowl-2027' into 'super-bowl-2027-0' through 'super-bowl-2027-9' to spread across 10 nodes, which directly distributes both reads and writes",
      "Add more virtual nodes to the overloaded physical node — this spreads its responsibility across more ring positions, reducing the load on any single position",
      "All three approaches are equally effective since they all redistribute the load from the hot key across multiple nodes"
    ],
    correct: 0,
    explanation: "This is a workload imbalance (hot traffic on one key), not a structural imbalance (uneven key distribution). Read replicas directly solve this: copy the hot data to multiple nodes and spread reads. Adding virtual nodes to the overloaded node is counterproductive — it gives that node MORE keys, not less traffic per key. Key-space salting (option B) works too, but adds read-time complexity (must query all 10 shards and aggregate) and complicates writes. For a read-heavy hot key, replicas are simpler and most effective.",
    interviewScript: "In your interview, say: 'This is a workload hotspot, not a distribution problem. Virtual nodes balance key distribution, not per-key traffic. I'd add read replicas for the hot key specifically and load-balance reads across them. This is the simplest solution that directly addresses the bottleneck.'",
    proTip: "The key distinction interviewers love: virtual nodes prevent structural imbalance (uneven keys), while replication and salting prevent workload imbalance (uneven traffic)."
  },
  {
    id: "q13",
    subtopic: "Hot Spots",
    tier: "Heavy",
    style: "Gotcha/trap",
    question: "You implement key-space salting for hot keys by appending '-{0..9}' to create 10 sharded variants. A client reads 'taylor-swift-concert' by querying all 10 shards ('taylor-swift-concert-0' through '-9') and aggregating. This works for reads. What subtle problem does this create for writes, and what must you check?",
    options: [
      "Writes must go to ALL 10 shards to keep them consistent, turning every write into a scatter operation. If different shards have different versions (e.g., a write to shard-3 fails), reads that aggregate across shards may return inconsistent or partially updated data — you need a version/timestamp mechanism to detect and resolve this",
      "Writes are unaffected because each salted key is independent — you just write to whichever shard the hash selects, and reads already handle aggregation",
      "The problem is that salted keys can't be updated atomically across nodes, but this is fine because hot keys are typically read-only (like event listings)",
      "Writes become faster because they're distributed across 10 nodes, but the aggregation at read time adds exactly 10x latency, making this approach only suitable for write-heavy workloads"
    ],
    correct: 0,
    explanation: "Key-space salting's gotcha is write consistency. If you're salting a key that gets updated (e.g., ticket availability), every write must update all 10 shards. If some updates fail, different shards hold different versions, and reads aggregating across them get inconsistent results. You need either a timestamp/version to identify the latest value, or acceptance that reads may be briefly inconsistent. This is why the content notes salting is best for read-heavy hot keys. For write-heavy hot keys, salting creates more problems than it solves.",
    interviewScript: "In your interview, say: 'Key-space salting distributes reads beautifully, but writes become scatter operations that must update all shards. If partial failures occur, shards diverge. I'd use this primarily for read-heavy hot keys and pair it with versioning for write consistency.'",
    proTip: null
  },
  {
    id: "q14",
    subtopic: "Hot Spots",
    tier: "Heavy",
    style: "Decision framework",
    question: "You have three hot-key scenarios in your system: (1) a single key with 100K reads/sec and rare writes, (2) a key prefix where 1000 related keys collectively generate extreme traffic, and (3) unpredictable hot keys that shift hourly. Which mitigation strategy best fits each scenario?",
    options: [
      "(1) Read replicas — simple, effective for single read-heavy keys; (2) Key-space salting — distributes the 1000 related keys across more nodes; (3) Adaptive rebalancing — since the hot keys shift unpredictably, you need real-time monitoring to detect and react automatically",
      "(1) Key-space salting for all three scenarios since it's the most general-purpose solution that works regardless of read/write patterns or predictability",
      "(1) Adaptive rebalancing, (2) Read replicas, (3) Key-space salting — matching complexity of solution to complexity of problem",
      "(1) Read replicas, (2) Read replicas, (3) Read replicas — replication solves all hot-key problems regardless of the access pattern"
    ],
    correct: 0,
    explanation: "Each scenario needs a different tool: (1) A single read-heavy key is perfectly solved by read replicas — replicate it to multiple nodes and load-balance. Simple and effective. (2) A prefix of 1000 related keys benefits from salting — redistribute them across more of the ring to break the locality that causes them to cluster on one node. (3) Unpredictable shifting hotspots require adaptive rebalancing (like DynamoDB's automatic approach) because you can't pre-configure replicas or salting for unknown keys.",
    interviewScript: "In your interview, say: 'I'd match the strategy to the hot-key pattern. Predictable, read-heavy single keys get replicas. Related key clusters get salting to break locality. Unpredictable shifting hotspots need adaptive rebalancing with real-time monitoring — this is what DynamoDB does automatically.'",
    proTip: "DynamoDB's adaptive rebalancing (called 'burst capacity' and 'adaptive capacity') automatically detects hot partitions and spreads their load across nodes — one reason it's favored for unpredictable workloads."
  },
  {
    id: "q15",
    subtopic: "Hot Spots",
    tier: "Heavy",
    style: "Interviewer pushback",
    question: "You propose adaptive rebalancing for hot spots: monitor traffic in real-time and move key ranges off overloaded nodes. Your interviewer pushes back: 'Moving key ranges under load sounds dangerous — what could go wrong?' What's the strongest response?",
    options: [
      "'You're right to be cautious. Live rebalancing risks: (1) increased latency during migration as data is in-flight between nodes, (2) potential for stale reads if clients haven't updated their routing tables, and (3) oscillation if the system keeps moving keys back and forth between nodes. I'd mitigate with hysteresis (don't rebalance until load sustains for X minutes), gradual migration, and client-side caching of routing updates with short TTLs.'",
      "'The risk is minimal because consistent hashing only moves a small fraction of keys during rebalancing, so the impact is bounded regardless of load conditions.'",
      "'The main risk is data loss during migration, which is why I'd ensure all data is replicated before starting any rebalancing operation. Once replication is confirmed, migration is safe.'",
      "'That's why I'd avoid adaptive rebalancing entirely and use read replicas instead — they don't require any data movement and are simpler to reason about.'"
    ],
    correct: 0,
    explanation: "The interviewer wants to see that you understand the operational complexity. The strongest response acknowledges the risks (latency spikes, stale routing, oscillation) and proposes specific mitigations. Option B downplays the risk — even small data movement under high load can cause latency spikes. Option C only addresses data loss, missing latency and oscillation risks. Option D retreats from the design instead of defending it with mitigations, which is weak in an interview setting.",
    interviewScript: "In your interview, say: 'Adaptive rebalancing under load has real risks: migration latency, stale routing tables, and oscillation. I'd add hysteresis to prevent thrashing, use gradual streaming migration, and ensure clients refresh routing tables via a push mechanism rather than polling.'",
    proTip: "The oscillation problem is sometimes called 'rebalancing storms' — the system detects a hotspot, moves data, the receiver becomes overloaded, moves data back, repeat. Hysteresis (cooldown periods) is the standard fix."
  },
  {
    id: "q16",
    subtopic: "Simple Modulo Hashing",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "A candidate designs a caching layer using hash(key) % N for 8 cache servers. They say: 'We expect to scale to 12 servers next quarter. To prepare, I'll just change N from 8 to 12 during a maintenance window.' What's the critical issue the candidate is overlooking?",
    options: [
      "Changing N from 8 to 12 invalidates nearly every cached entry because hash(key) % 8 and hash(key) % 12 produce different results for most keys — causing a cache stampede where all clients simultaneously hit the backing database for cache misses, potentially bringing down the database layer",
      "The issue is that you can't change N while servers are running — modulo hashing requires all servers to be stopped and restarted simultaneously with the new N value",
      "The only problem is a brief period of uneven distribution as the cache warms up on the 4 new servers, but existing cache entries on the original 8 servers remain valid",
      "Modulo hashing can't support more than 8 servers because the hash function's output range limits the maximum number of shards"
    ],
    correct: 0,
    explanation: "This is the canonical problem that motivates consistent hashing. When N changes from 8 to 12, approximately 8/12 ≈ 67% of keys map to a different server. Those keys are effectively 'lost' from cache — not because the data is gone, but because clients now look on the wrong server. All those misses simultaneously hit the database, creating a cache stampede (also called a 'thundering herd'). The existing cache data on the original 8 servers is still there but unreachable under the new hashing scheme.",
    interviewScript: "In your interview, say: 'Modulo hashing's fatal flaw is that changing N causes near-total cache invalidation. With 8→12 servers, roughly 67% of keys remap. All those simultaneous cache misses hit the database at once — a classic cache stampede that can cascade into a full outage.'",
    proTip: null
  },
  {
    id: "q17",
    subtopic: "Simple Modulo Hashing",
    tier: "Medium",
    style: "Anti-pattern identification",
    question: "After learning about consistent hashing, a candidate says: 'Actually, modulo hashing works fine if you never change N. Since we'll always have exactly 5 database shards, I'll use hash % 5 because it's simpler and has zero overhead.' When does this reasoning break down?",
    options: [
      "It breaks down the moment any single shard fails — even temporarily. With hash % 5, if one shard goes offline, you either serve errors for ~20% of requests or change to hash % 4, which causes the same massive redistribution problem. Consistent hashing handles transient failures gracefully by reassigning only the failed node's keys",
      "It never breaks down — if you can guarantee N never changes, modulo hashing is strictly superior to consistent hashing in every way due to simpler code and lower latency",
      "It breaks down when data volume exceeds what 5 shards can handle, but that's a capacity planning failure, not a hashing algorithm problem",
      "It breaks down because hash functions don't distribute evenly across small moduli like 5, causing permanent load imbalance"
    ],
    correct: 0,
    explanation: "Even with 'fixed' N, node failures happen. Hardware fails, deployments restart nodes, network partitions occur. When a shard is temporarily unavailable, modulo hashing gives you two bad options: serve errors for 1/N of requests, or change N and trigger mass redistribution. Consistent hashing handles this gracefully — the failed node's keys flow to the next clockwise node with no disruption to other keys. Option D is wrong because good hash functions distribute evenly regardless of modulus. Option B ignores that 'N never changes' is an unrealistic assumption in production.",
    interviewScript: "In your interview, say: 'The assumption that N never changes is unrealistic in production. Nodes fail temporarily, require maintenance, and need replacements. Modulo hashing can't handle even temporary node removal without massive redistribution. Consistent hashing's value isn't just in planned scaling — it's in graceful failure handling.'",
    proTip: null
  },
  {
    id: "q18",
    subtopic: "Data Movement & Replication",
    tier: "Medium",
    style: "Implementation-specific nuance",
    question: "Your DynamoDB table has a partition that loses its primary node. DynamoDB replicates each partition across 3 availability zones. What happens internally, and does consistent hashing play a role in the recovery?",
    options: [
      "A replica is promoted to primary via a consensus algorithm (Raft/Paxos) — no data movement occurs because the data already exists on the replica. Consistent hashing is NOT involved in this failover; it only determines initial partition placement. The recovery is handled entirely by the replication and consensus layer",
      "Consistent hashing reroutes all reads and writes from the failed node to the next clockwise node, which must then stream the data from another replica before it can serve requests",
      "DynamoDB pauses the partition, copies data from a surviving replica to a new node, then resumes — consistent hashing determines which new node receives the data",
      "All three replicas serve reads independently and any one can become the primary by winning a consistent hash election — the node with the closest hash position to the partition key becomes primary"
    ],
    correct: 0,
    explanation: "This is a crucial nuance: consistent hashing determines WHERE data should live (initial placement), but replication and consensus handle FAILURE RECOVERY. When a DynamoDB primary fails, one of the 2 existing replicas is promoted via consensus — the data is already there, so zero data movement is needed. Consistent hashing doesn't participate in failover at all. This is why the content emphasizes that 'most distributed databases use replication alongside consistent hashing to handle failures without moving data.'",
    interviewScript: "In your interview, say: 'Consistent hashing handles data placement, but replication handles failure recovery. When a primary fails, a replica is promoted via consensus — no data moves because it's already replicated. Data movement only happens during planned capacity changes, not failures.'",
    proTip: null
  },
  {
    id: "q19",
    subtopic: "Data Movement & Replication",
    tier: "Medium",
    style: "Multi-hop reasoning",
    question: "In a Cassandra cluster using consistent hashing with RF=3, a node is permanently decommissioned. The data it held is already replicated on 2 other nodes. When does data movement actually occur, and what triggers it?",
    options: [
      "Data movement occurs to restore the replication factor from 2 back to 3 — Cassandra must re-replicate the decommissioned node's data onto a new third replica. Consistent hashing determines which node becomes the new third replica (the next eligible node clockwise on the ring), and the data is streamed from one of the surviving 2 replicas",
      "No data movement occurs because the data already exists on 2 other nodes, and RF=3 just means '3 nodes can serve it' — when one is removed, RF automatically adjusts to 2",
      "Data movement is triggered immediately when the node goes offline, as the other 2 replicas race to copy data to a fresh node to maintain RF=3 within the heartbeat timeout",
      "Data movement only happens when a client next tries to read from the decommissioned node — at that point, the read is redirected and the key is lazily re-replicated"
    ],
    correct: 0,
    explanation: "When a node is permanently removed, the RF drops from 3 to 2 for its data ranges. To restore RF=3, Cassandra must re-replicate that data to a new node. Consistent hashing determines the new replica location (next clockwise eligible node). The data streams from an existing replica. This is the planned 'data movement' the content describes — it happens during membership changes to restore the replication factor, not during transient failures where replicas are simply promoted.",
    interviewScript: "In your interview, say: 'Transient failures need no data movement — replicas are promoted. But permanent decommissioning requires re-replication to restore the replication factor. Consistent hashing picks the new replica target, and data streams from a surviving copy. This is the bounded data movement consistent hashing guarantees.'",
    proTip: null
  },
  {
    id: "q20",
    subtopic: "Data Movement & Replication",
    tier: "Medium",
    style: "Ordering/sequencing",
    question: "You're adding a new node to a Cassandra cluster that uses consistent hashing with virtual nodes and RF=3. What's the correct sequence of operations to ensure zero downtime and data consistency?",
    options: [
      "(1) New node joins and announces its virtual node positions on the ring, (2) Ownership ranges are recalculated — some arcs now belong to the new node, (3) Data for those arcs is streamed from existing owners to the new node in the background, (4) Once streaming completes, the new node starts serving reads/writes for its ranges, (5) Existing nodes release ownership and clean up old data",
      "(1) Pause all writes, (2) Add new node and recalculate ring, (3) Redistribute data, (4) Resume writes — write pause ensures consistency during migration",
      "(1) Add new node with empty data, (2) Immediately start routing requests to it, (3) Handle cache misses by redirecting to old owners, (4) Eventually the new node warms up via normal traffic",
      "(1) Take a full cluster snapshot, (2) Add the new node, (3) Restore the relevant snapshot portions to the new node, (4) Start serving traffic"
    ],
    correct: 0,
    explanation: "The correct sequence is a streaming-based handoff with no downtime. The new node joins, claims its ring positions, and data streams in the background from existing owners. During streaming, reads for those ranges can still be served by the old owners. Once streaming completes, ownership transfers. This is exactly how Cassandra's bootstrap process works. Pausing writes (option B) causes unnecessary downtime. Immediate routing (option C) would return empty results. Snapshot-based (option D) is too heavy-weight and creates a point-in-time inconsistency.",
    interviewScript: "In your interview, say: 'The new node joins, announces its ring positions, and begins background streaming from existing owners. During this transition, old owners continue serving traffic. Once streaming completes, ownership transfers atomically. Zero downtime, bounded data movement.'",
    proTip: null
  },
  {
    id: "q21",
    subtopic: "Real-World Systems",
    tier: "Medium",
    style: "Implementation-specific nuance",
    question: "Redis Cluster uses CRC16(key) % 16384 to assign keys to 16,384 fixed hash slots, which are then assigned to nodes. How does this compare to consistent hashing when you need to add a node, and what trade-off did Redis make?",
    options: [
      "Redis must manually reassign slot ranges from existing nodes to the new node and migrate the keys in those slots — this requires explicit operator intervention and coordination, unlike consistent hashing where new nodes automatically claim their ring positions. Redis traded automatic rebalancing for simpler reasoning about data placement and explicit operator control over slot distribution",
      "Redis's fixed hash slots work identically to consistent hashing — adding a node automatically causes 1/N of slots to migrate. The only difference is the fixed ring size of 16,384 instead of 2^32",
      "Redis's approach is strictly worse because 16,384 slots limits you to at most 16,384 nodes, while consistent hashing has no upper bound on nodes",
      "Redis's approach causes the same full redistribution problem as modulo hashing because changing node count requires remapping all 16,384 slots"
    ],
    correct: 0,
    explanation: "Redis Cluster's fixed slot approach is a conscious trade-off. The CRC16 % 16384 mapping never changes (unlike modulo where N changes), so keys always map to the same slot. But moving a slot from one node to another requires explicit operator commands (CLUSTER SETSLOT) and data migration. Consistent hashing automates this. Redis chose explicit control and simplicity over automation — operators decide exactly which slots go where. The content specifically calls this out as a 'real design trade-off.'",
    interviewScript: "In your interview, say: 'Redis trades automatic rebalancing for explicit operator control. Keys always map to the same slot via CRC16 mod 16384, but reassigning slots between nodes is a manual operation. Consistent hashing automates node membership changes but is more complex to reason about. It's a valid trade-off depending on your operational model.'",
    proTip: "Redis's 16,384 slot limit means a practical maximum of ~1,000 nodes (since each node should own at least ~16 slots for reasonable distribution). For very large clusters, consistent hashing scales better."
  },
  {
    id: "q22",
    subtopic: "Real-World Systems",
    tier: "Medium",
    style: "Scenario-based trade-off",
    question: "You're designing a CDN and choosing between consistent hashing and round-robin for routing requests to edge servers. A popular video goes viral, generating massive traffic. How does your routing choice affect cache hit rates?",
    options: [
      "Consistent hashing ensures the same URL always routes to the same edge server, maximizing cache hit rates — the video is cached once per edge server. Round-robin distributes the viral video's requests across ALL edge servers, meaning each server must independently cache the video, wasting memory and causing many initial cache misses",
      "Round-robin is better for viral content because it spreads the load evenly, preventing any single edge server from being overwhelmed by the hot video",
      "Both perform identically for cache hit rates because CDNs replicate popular content to all edge servers regardless of routing strategy",
      "Consistent hashing is worse because it sends all traffic for the viral video to one server, creating a hot spot, while round-robin naturally distributes the load"
    ],
    correct: 0,
    explanation: "Consistent hashing is essential for CDNs specifically because of cache affinity — the same URL always goes to the same server, so caches warm up quickly and stay warm. Round-robin destroys cache locality by scattering requests for the same URL across all servers, meaning every server must independently fetch and cache the content. However, option D raises a valid concern: for extremely viral content, consistent hashing can create hot spots on the assigned server. CDNs solve this with tiered caching or replication for hot objects, not by abandoning consistent hashing.",
    interviewScript: "In your interview, say: 'CDNs use consistent hashing for cache affinity — same URL, same server, high hit rate. Round-robin destroys this locality. For viral content that overwhelms one server, CDNs add tiered caching or hot-object replication on top of consistent hashing rather than switching to round-robin.'",
    proTip: null
  },
  {
    id: "q23",
    subtopic: "When to Use in Interviews",
    tier: "Thin",
    style: "Decision framework",
    question: "You're in a system design interview asked to design a social media feed service. You mention using DynamoDB for storage. The interviewer asks: 'How does DynamoDB handle data distribution?' How deep should you go on consistent hashing?",
    options: [
      "Acknowledge that DynamoDB uses consistent hashing (or a variation) under the hood for partition placement, briefly explain why it matters (minimal redistribution when capacity changes), then pivot back to your design's partition key strategy and access patterns — going deep into ring mechanics would be off-topic for this question",
      "Go deep into hash ring mechanics, virtual nodes, and data movement — this is your chance to show foundational knowledge and interviewers always appreciate depth on distributed systems fundamentals",
      "Skip consistent hashing entirely and say 'DynamoDB handles it automatically' — any mention of internals shows you're not focused on the actual design problem",
      "Explain consistent hashing in detail but only if the interviewer explicitly asks a follow-up — mentioning it proactively risks leading the interview into a tangent you might not be prepared for"
    ],
    correct: 0,
    explanation: "The content explicitly states: 'Most system design interviews fall into the latter category' — where you acknowledge that existing solutions handle consistent hashing under the hood. For a social media feed design, the interviewer cares about your partition key choice, access patterns, and overall architecture. A brief mention that DynamoDB uses consistent hashing for automatic scaling shows knowledge without derailing the interview. Save the deep dive for infrastructure-focused interviews like 'design a distributed database.'",
    interviewScript: "In your interview, say: 'DynamoDB uses a form of consistent hashing to distribute partitions across nodes, which means adding capacity doesn't require redistributing all data. For our design, the important decision is our partition key strategy...' and pivot back.",
    proTip: "The general rule: go deep on consistent hashing when asked to design infrastructure (distributed cache, database, message broker). Go shallow when using infrastructure someone else built."
  },
  {
    id: "q24",
    subtopic: "Hash Space Size",
    tier: "Thin",
    style: "Gotcha/trap",
    question: "The standard consistent hash ring uses a space of 0 to 2^32 - 1 (about 4.3 billion positions). A candidate says: 'With 100 nodes and 200 virtual nodes each, that's 20,000 points on a 4.3 billion-position ring. There's so much empty space — wouldn't a smaller ring like 0-999,999 work better and be more efficient?'  What's wrong with this reasoning?",
    options: [
      "The 'empty space' is a feature, not a bug. The large ring space ensures that hash collisions between virtual node positions are astronomically unlikely. With a 0-999,999 ring and 20,000 points, you'd have a ~19% chance of at least one collision (birthday problem), which would cause two virtual nodes to overlap and distort the key distribution. The 2^32 space makes collisions negligible",
      "The candidate is correct — a smaller ring saves memory and computation. The 2^32 standard is a historical artifact from when hash functions only produced 32-bit outputs",
      "A smaller ring would work identically because the hash function's modulo operation normalizes any ring size to produce uniform distribution, regardless of the ring's absolute size",
      "The large ring is needed because consistent hashing must reserve space for future node additions — with 4.3 billion positions, you can add nodes for decades without running out of positions"
    ],
    correct: 0,
    explanation: "This is a birthday problem trap. With 20,000 virtual nodes on a million-position ring, collision probability is significant (~19% for at least one collision). Collisions mean two virtual nodes hash to the same position, causing one to 'absorb' the other's range and distorting the distribution. The 2^32 space makes the collision probability vanishingly small (~0.005% for 20,000 nodes). It's not about 'reserving space for growth' — it's about minimizing hash collisions between node positions.",
    interviewScript: "In your interview, say: 'The large ring space prevents hash collisions between virtual node positions via the birthday problem. With 20K virtual nodes on a 2^32 ring, collision probability is negligible. On a smaller ring, collisions become likely enough to distort the key distribution.'",
    proTip: null
  },
  {
    id: "q25",
    subtopic: "Redis Hash Slots vs Consistent Hashing",
    tier: "Thin (Clustered)",
    style: "Cross-subtopic bridge",
    question: "You're choosing between consistent hashing and Redis-style fixed hash slots for a new distributed key-value store. Your system will scale from 10 to 100+ nodes over 2 years and be managed by a small ops team (2 people). Which approach is better suited, and what's the decisive factor?",
    options: [
      "Consistent hashing is better suited because scaling from 10 to 100+ nodes involves many node additions, and consistent hashing automates the rebalancing process. With a 2-person ops team, the manual slot reassignment required by fixed hash slots for each scale-up event would be operationally unsustainable at that growth rate",
      "Fixed hash slots are better because they give the small ops team explicit control over exactly where data lives, which is critical when you can't afford misrouted requests during automated rebalancing",
      "Either approach works equally well — the ops team size is irrelevant because both approaches are fully automated in production implementations",
      "Fixed hash slots are better because they support up to 16,384 nodes while consistent hashing has practical limits around 50 nodes due to virtual node overhead"
    ],
    correct: 0,
    explanation: "The decisive factor is operational overhead during scaling. Going from 10 to 100+ nodes means dozens of node-addition events, each requiring slot reassignment with fixed hash slots. A 2-person team would spend significant time on manual rebalancing operations. Consistent hashing automates this: new nodes join and automatically claim their ring positions. Fixed hash slots' explicit control (option B) is valuable but not when you're scaling aggressively with limited ops capacity. And 16,384 slots actually limits practical node count (option D has it backwards).",
    interviewScript: "In your interview, say: 'For rapid scaling with a small ops team, consistent hashing's automatic rebalancing is the decisive advantage. Fixed hash slots give more control but require manual slot migration for every scale event — that operational cost compounds quickly when growing 10x.'",
    proTip: null
  },
  {
    id: "q26",
    subtopic: "Structural vs Workload Imbalance",
    tier: "Thin (Clustered)",
    style: "Anti-pattern identification",
    question: "A candidate notices uneven load across their consistent hash ring and says: 'I'll double the number of virtual nodes per physical node from 100 to 200 to fix the hot spot.' Monitoring shows one key receives 50K requests/second while other keys receive 100 requests/second. What fundamental mistake is the candidate making?",
    options: [
      "They're confusing structural imbalance (uneven key distribution) with workload imbalance (uneven traffic per key). Virtual nodes fix structural imbalance by spreading keys more evenly, but the problem here is one hot key generating disproportionate traffic — more virtual nodes won't reduce that key's request rate. They need read replicas or key-space salting for the hot key",
      "The candidate is correct — doubling virtual nodes will spread the hot key's traffic across more physical nodes since the key might hash to a different node's virtual node range",
      "The mistake is not doubling virtual nodes enough — they should use 1000+ virtual nodes per physical node to achieve truly even distribution at the individual key level",
      "The issue is that 100 virtual nodes was already sufficient — the hot spot is caused by a poor hash function, not insufficient virtual nodes"
    ],
    correct: 0,
    explanation: "This is the key distinction the content emphasizes: virtual nodes prevent structural imbalance (keys unevenly spread across nodes), while replication and key salting prevent workload imbalance (traffic unevenly spread across keys). A single hot key always hashes to the same position regardless of how many virtual nodes exist. Adding virtual nodes just makes the other keys more evenly distributed, which doesn't help when one key dominates traffic. The candidate needs a fundamentally different strategy.",
    interviewScript: "In your interview, say: 'I'd distinguish between structural and workload imbalance. Virtual nodes solve structural imbalance — uneven key counts across nodes. But this is workload imbalance — one key has extreme traffic. I need read replicas or key salting for that specific key. Virtual nodes are the wrong tool here.'",
    proTip: null
  },
  {
    id: "q27",
    subtopic: "Kleppmann + Loose Terminology",
    tier: "Thin (Clustered)",
    style: "Gotcha/trap",
    question: "In your interview, you explain consistent hashing using the classic ring model. The interviewer says: 'DynamoDB claims to use consistent hashing, but it actually uses a different mechanism internally.' How should you respond?",
    options: [
      "'That's a great point. As Kleppmann notes, the term \"consistent hashing\" is used loosely in practice. What matters is the principle: minimizing data movement during rebalancing. DynamoDB achieves this, even if its implementation differs from the textbook ring approach. The exact mechanism may use hash-based partitioning with fixed slot ranges rather than a literal ring.'",
      "'DynamoDB definitely uses a hash ring internally — Amazon's original Dynamo paper explicitly describes the ring model. The interviewer may be testing whether you'll back down from a correct answer.'",
      "'If DynamoDB doesn't use consistent hashing, then we shouldn't mention it in the context of DynamoDB. I'll redesign my answer to avoid the term entirely.'",
      "'The distinction doesn't matter in an interview. Consistent hashing is consistent hashing — implementation details of cloud services are irrelevant to system design discussions.'"
    ],
    correct: 0,
    explanation: "This question tests awareness of a nuance the content explicitly highlights from Kleppmann's book: 'some systems that claim to use consistent hashing actually use variations.' The strongest response acknowledges the interviewer's point, demonstrates you know about the terminological looseness, and focuses on the underlying principle (minimizing redistribution) rather than the specific mechanism. This shows depth without being defensive. Dismissing the distinction (option D) or backing down entirely (option C) are both weak interview moves.",
    interviewScript: "In your interview, say: 'You're right — Kleppmann points out that \"consistent hashing\" is used loosely. The core principle is bounded data movement during rebalancing. Whether it's a literal ring or hash-based partitioning with slot ranges, the goal is the same. I focus on the principle because that's what matters for design decisions.'",
    proTip: "Bringing up Kleppmann's 'Designing Data-Intensive Applications' by name shows the interviewer you've read the canonical text, which is always a positive signal."
  },
  {
    id: "q28",
    subtopic: "Bridge: Consistent Hashing × Virtual Nodes",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "You implement a consistent hash ring with 3 physical nodes and no virtual nodes. Node A at position 0, Node B at position 40, Node C at position 70 (on a 0-99 ring). Node B fails. You then add virtual nodes (5 per physical node) to prevent this problem in the future. But a teammate asks: 'If we had virtual nodes BEFORE Node B failed, how exactly would the failure impact have differed?' What's the precise answer?",
    options: [
      "Without virtual nodes: all of B's keys (positions 41-70) dump onto C at position 70, giving C 60% of the ring. With 5 virtual nodes per node, B's keys would be in segments scattered across the ring. When B fails, each segment's keys flow to whichever of A or C's virtual nodes is next clockwise — distributing B's load roughly equally between A and C instead of overloading just C",
      "The impact would be identical — virtual nodes help with initial key distribution but don't change what happens during failure, since the failed node's keys still go to the next clockwise neighbor",
      "Virtual nodes would have prevented the failure entirely by providing redundancy — if one of B's virtual nodes fails, the others keep serving",
      "With virtual nodes, B's failure would move only 1/5 of B's keys instead of all of them, since each virtual node holds an independent portion"
    ],
    correct: 0,
    explanation: "Without virtual nodes, B owns positions 41-70 (30 units). On failure, ALL go to C (next clockwise), giving C 60 units out of 100 — a 2x overload. With virtual nodes, B's 5 virtual positions are scattered around the ring, interleaved with A's and C's virtual nodes. When B fails, each of B's virtual node arcs flows to the next clockwise node — which could be A or C. This distributes B's load across both survivors. Virtual nodes don't provide redundancy (option C) — all virtual nodes of a physical node fail together. And ALL of B's data moves (option D is wrong), just more evenly.",
    interviewScript: "In your interview, say: 'Virtual nodes transform failure impact from concentrated to distributed. Without them, the single clockwise neighbor absorbs all load from the failed node. With them, the failed node's scattered arcs distribute across all survivors proportionally.'",
    proTip: null
  },
  {
    id: "q29",
    subtopic: "Bridge: Virtual Nodes × Hot Spots",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "Your system uses 200 virtual nodes per physical node for even key distribution. You also have a hot key problem on one physical node. A colleague suggests: 'Just assign fewer virtual nodes to the overloaded physical node — that'll reduce its share of keys and therefore its load.' Is this correct?",
    options: [
      "This is wrong and could make things worse. Reducing virtual nodes moves KEYS off the node (structural rebalancing), but the hot key stays hashed to its fixed position. If the hot key's position is still in this node's remaining arcs, the node keeps all the hot traffic with fewer total keys to amortize it. And the moved keys land on other nodes that weren't prepared for them. The fix must target the hot key directly: replicas, salting, or caching",
      "This is correct — fewer virtual nodes means fewer keys, which means less total traffic. The hot key's traffic contribution becomes a smaller fraction of a smaller total, effectively reducing the overload",
      "This works but is suboptimal — the better approach is to increase virtual nodes on OTHER nodes, which achieves the same redistribution without touching the overloaded node's configuration",
      "This is correct for the short term but creates a permanent imbalance — the overloaded node will have fewer keys than its peers indefinitely, wasting capacity when the hot key eventually cools down"
    ],
    correct: 0,
    explanation: "This is a subtle but critical mistake. Reducing virtual nodes moves random keys off the node, but the hot key stays where it is (it hashes to a fixed ring position). If that position is still in the node's remaining arcs, the hot traffic stays. Now the node has fewer 'normal' keys to dilute the hot key's impact, potentially making the per-key-average imbalance worse. Additionally, the redistributed normal keys now burden other nodes. This is treating the symptom (too many total keys) instead of the disease (one extremely hot key).",
    interviewScript: "In your interview, say: 'Adjusting virtual node counts is for structural balance — evening out key distribution. It doesn't help with workload imbalance from a hot key because the hot key's ring position doesn't change. I'd use read replicas or key salting to address the actual traffic concentration.'",
    proTip: null
  },
  {
    id: "q30",
    subtopic: "Bridge: Replication × Consistent Hashing",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "In a consistent hash ring with RF=3, data for a key at position P is stored on the 3 consecutive clockwise nodes. You add a new node N between the first and second replica nodes. What happens to the replication layout for key P?",
    options: [
      "Node N becomes one of the 3 replicas for key P (since it's now one of the 3 consecutive clockwise nodes from P). The previous third replica is no longer responsible for P and should eventually clean up that data. This happens automatically — consistent hashing determines replica placement, and adding a node shifts which nodes are 'the 3 consecutive' for affected keys",
      "Nothing changes for key P's replicas because replication assignments are fixed at write time and don't update when the ring topology changes",
      "All 3 existing replicas remain, and Node N becomes a 4th replica temporarily until a background process removes the extra copy, effectively increasing RF to 4 during transition",
      "Node N takes over as the primary for key P but the replica set stays the same — only the primary assignment uses consistent hashing, not replica placement"
    ],
    correct: 0,
    explanation: "With RF=3 and consecutive clockwise replication, adding a node between replicas 1 and 2 makes the new node one of the 3 consecutive clockwise nodes from P. The old third replica is now the fourth clockwise node and drops out of P's replica set. In practice, this transition involves streaming data to the new node and eventually cleaning up the old third replica. This is how consistent hashing and replication interact: ring topology changes automatically update replica placement for affected keys.",
    interviewScript: "In your interview, say: 'Consistent hashing determines not just the primary but also replica placement. When a node is added between existing replicas, it enters the replica set for nearby keys, and the furthest-clockwise replica drops out. The system streams data to the new replica and cleans up the old one.'",
    proTip: null
  },
  {
    id: "q31",
    subtopic: "Bridge: Modulo Hashing × Consistent Hashing",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "You're migrating a system from modulo hashing (hash % N) to consistent hashing. During the migration, some clients use the old scheme and some use the new scheme. For a given key, the two schemes route to different nodes. What strategy minimizes data availability disruption during migration?",
    options: [
      "Run both schemes simultaneously with a lookup table: when a key is requested, check the consistent hashing node first. On miss, fall back to the modulo hashing node, read the data, write it to the consistent hashing node, then return it. Gradually increase the percentage of clients using consistent hashing. Once all clients are migrated, decommission the old routing and run a background sweep to migrate any remaining keys",
      "Stop all traffic, run a batch job to copy every key from its modulo-hashed location to its consistent-hashing location, then switch all clients at once. This is the only way to guarantee consistency",
      "Use consistent hashing immediately for all writes, but read from both the old and new locations, returning whichever version is newer. This naturally migrates data over time as keys are updated",
      "Configure the consistent hash ring positions to exactly match the modulo hash output, making both schemes route identically during transition"
    ],
    correct: 0,
    explanation: "The dual-read strategy (check new location, fallback to old) minimizes disruption: no downtime, no batch migration, and keys lazily migrate as they're accessed. Gradually shifting clients to the new scheme reduces blast radius. Option B requires downtime. Option C is close but writing to the consistent hash location on every write (before full migration) risks inconsistency if the old-scheme clients are still writing to the old location. Option D is mathematically impossible — modulo hash outputs change completely when N changes, while consistent hash ring positions are fixed.",
    interviewScript: "In your interview, say: 'I'd use a dual-read migration: clients try the consistent hash node first, fall back to the old modulo node on miss, and lazily migrate the data on access. Gradually shift traffic to consistent hashing. This gives zero-downtime migration with progressive key movement.'",
    proTip: null
  },
  {
    id: "q32",
    subtopic: "Bridge: Hot Spots × Real-World Systems",
    tier: "Bridge",
    style: "Cross-subtopic bridge",
    question: "You're designing a system using Cassandra for storage. A product launch will cause one partition key to receive 10x normal read traffic for 48 hours. Cassandra uses consistent hashing with virtual nodes. Your team debates: should you pre-split the hot partition, add more Cassandra nodes, or implement application-level caching? What's the best approach for a known, temporary hot spot?",
    options: [
      "Application-level caching (e.g., Redis or in-memory cache in front of Cassandra) is best for a known, temporary hot spot. Pre-splitting changes your data model permanently for a 48-hour event. Adding Cassandra nodes requires data streaming and won't help for one partition key (consistent hashing would just move the hot partition to a new node, not split the load). A cache absorbs the read spike without any Cassandra changes",
      "Add more Cassandra nodes — consistent hashing with virtual nodes will automatically spread the hot partition's traffic across the new nodes",
      "Pre-split the hot partition into 10 sub-partitions to distribute reads across 10 nodes. This is the canonical Cassandra approach for hot partitions",
      "Do nothing — Cassandra's built-in read repair and speculative retry mechanisms can handle 10x read traffic spikes automatically"
    ],
    correct: 0,
    explanation: "For a known, temporary 48-hour spike on one partition key, application-level caching is the right tool. Adding Cassandra nodes doesn't split a single partition's traffic — consistent hashing assigns one partition to one primary node regardless of cluster size. Pre-splitting works but permanently changes your data model and query patterns for a temporary problem. Cassandra's read repair and speculative retries (option D) don't address capacity — they handle consistency and latency, not throughput. A cache layer absorbs the spike with minimal system changes.",
    interviewScript: "In your interview, say: 'For a known, temporary hot spot, I'd add a cache layer in front of the database. It's the least invasive solution — no data model changes, no cluster expansion. The cache absorbs the spike, and we remove it after the event. This is simpler and faster to implement than any database-level change.'",
    proTip: "In Cassandra, a single partition key maps to one coordinator node. No amount of cluster expansion splits traffic for one partition. This is why Cassandra's documentation emphasizes partition key design as the most critical modeling decision."
  }
];

const SUBTOPIC_INFO = [
  { name: "Consistent Hashing Core", tier: "Heavy", questionCount: 4 },
  { name: "Virtual Nodes", tier: "Heavy", questionCount: 4 },
  { name: "Adding/Removing Nodes", tier: "Heavy", questionCount: 3 },
  { name: "Hot Spots", tier: "Heavy", questionCount: 4 },
  { name: "Simple Modulo Hashing", tier: "Medium", questionCount: 2 },
  { name: "Data Movement & Replication", tier: "Medium", questionCount: 3 },
  { name: "Real-World Systems", tier: "Medium", questionCount: 2 },
  { name: "When to Use in Interviews", tier: "Thin", questionCount: 1 },
  { name: "Hash Space Size", tier: "Thin", questionCount: 1 },
  { name: "Redis vs CH / Structural vs Workload / Terminology", tier: "Thin (Clustered)", questionCount: 3 },
  { name: "Cross-Subtopic Bridges", tier: "Bridge", questionCount: 5 },
];

const TIER_COLORS = {
  Heavy: "bg-red-500/20 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Thin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Thin (Clustered)": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Bridge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  if (pct >= 90) return { label: "Staff-ready — you'd ace this topic", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  if (pct >= 75) return { label: "Strong Senior — solid, minor gaps to close", color: "text-blue-400", bg: "bg-blue-500/20" };
  if (pct >= 60) return { label: "SDE2-level — review the weak areas below", color: "text-amber-400", bg: "bg-amber-500/20" };
  return { label: "Needs deep review — revisit the fundamentals", color: "text-red-400", bg: "bg-red-500/20" };
}

function LandingScreen({ onStart }) {
  const [mode, setMode] = useState("shuffled");
  const totalTime = Math.round((QUESTIONS.length * 75) / 60);

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4 border border-red-500/30">
          FAANG SDE2 — Hard
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Consistent Hashing</h1>
        <p className="text-gray-400 text-lg">System Design Deep Dive Quiz</p>
        <p className="text-gray-500 mt-2 text-sm">
          {QUESTIONS.length} questions · ~{totalTime} minutes · Hash rings, virtual nodes, hot spots, and real-world trade-offs
        </p>
      </div>

      <div className="bg-gray-800/60 rounded-xl p-6 mb-6 border border-gray-700/50">
        <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Coverage Breakdown</h2>
        {["Heavy", "Medium", "Thin", "Thin (Clustered)", "Bridge"].map((tier) => {
          const items = SUBTOPIC_INFO.filter((s) => s.tier === tier);
          if (items.length === 0) return null;
          return (
            <div key={tier} className="mb-4 last:mb-0">
              <div className={`inline-block text-xs px-2 py-0.5 rounded border mb-2 ${TIER_COLORS[tier]}`}>
                {tier}
              </div>
              <div className="space-y-1 ml-2">
                {items.map((s) => (
                  <div key={s.name} className="flex justify-between text-sm">
                    <span className="text-gray-300">{s.name}</span>
                    <span className="text-gray-500">{s.questionCount}q</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("section")}
          className={`flex-1 py-3 px-4 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            mode === "section"
              ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
              : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
          }`}
        >
          <List size={16} /> Section Order
        </button>
        <button
          onClick={() => setMode("shuffled")}
          className={`flex-1 py-3 px-4 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            mode === "shuffled"
              ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
              : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
          }`}
        >
          <Shuffle size={16} /> Shuffled
        </button>
      </div>

      <button
        onClick={() => onStart(mode)}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
      >
        Start Quiz <ArrowRight size={20} />
      </button>
    </div>
  );
}

function QuestionScreen({ question, index, total, onAnswer, onSkip, onFlag, isFlagged }) {
  const [selected, setSelected] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

  useEffect(() => {
    setSelected(null);
    setConfidence(null);
    setSubmitted(false);
    setTimedOut(false);
    setTimeLeft(90);
  }, [question.id]);

  useEffect(() => {
    if (submitted || timedOut) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question.id, submitted, timedOut]);

  useEffect(() => {
    if (!submitted) {
      const handler = (e) => {
        const key = e.key.toUpperCase();
        if (["1", "A"].includes(key)) setSelected(0);
        if (["2", "B"].includes(key)) setSelected(1);
        if (["3", "C"].includes(key)) setSelected(2);
        if (["4", "D"].includes(key)) setSelected(3);
        if (e.key === "Enter" && selected !== null && confidence !== null) {
          handleSubmit();
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
    if (submitted) {
      const handler = (e) => {
        if (e.key === "Enter") {
          onAnswer(selected, confidence, timedOut);
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [selected, confidence, submitted]);

  const handleSubmit = () => {
    if (selected === null || confidence === null) return;
    clearInterval(timerRef.current);
    setSubmitted(true);
  };

  const timerColor = timeLeft <= 15 ? "text-red-400" : timeLeft <= 30 ? "text-amber-400" : "text-gray-300";
  const timerBg = timeLeft <= 15 ? "bg-red-500/20" : timeLeft <= 30 ? "bg-amber-500/20" : "bg-gray-700/50";
  const labels = ["A", "B", "C", "D"];
  const confidenceLevels = ["Guessing", "Somewhat Sure", "Very Confident"];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm font-medium">{index + 1} / {total}</span>
          <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${timerBg}`}>
          <Clock size={14} className={timerColor} />
          <span className={`font-mono text-sm font-medium ${timerColor}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded border ${TIER_COLORS[question.tier] || TIER_COLORS["Heavy"]}`}>
          {question.subtopic}
        </span>
        <span className="text-xs text-gray-600">{question.style}</span>
      </div>

      <h2 className="text-white text-lg font-medium leading-relaxed mb-6">{question.question}</h2>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => {
          let cls = "bg-gray-800/60 border-gray-700/50 hover:border-gray-500 text-gray-300";
          if (submitted) {
            if (i === question.correct) cls = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300";
            else if (i === selected && i !== question.correct) cls = "bg-red-500/15 border-red-500/50 text-red-300";
            else cls = "bg-gray-800/30 border-gray-700/30 text-gray-500";
          } else if (i === selected) {
            cls = "bg-indigo-600/20 border-indigo-500/50 text-indigo-200";
          }
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border text-sm leading-relaxed transition-all ${cls}`}
            >
              <span className="font-semibold mr-2 opacity-60">{labels[i]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted && selected !== null && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">How confident are you?</p>
          <div className="flex gap-2">
            {confidenceLevels.map((c, i) => (
              <button
                key={c}
                onClick={() => setConfidence(c)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  confidence === c
                    ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
                    : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {!submitted && (
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="py-2.5 px-4 rounded-lg border border-gray-700/50 text-gray-400 text-sm hover:border-gray-600 flex items-center gap-1.5 transition-colors"
          >
            <SkipForward size={14} /> Skip
          </button>
          <button
            onClick={() => onFlag()}
            className={`py-2.5 px-4 rounded-lg border text-sm flex items-center gap-1.5 transition-colors ${
              isFlagged
                ? "border-amber-500/50 text-amber-400 bg-amber-500/10"
                : "border-gray-700/50 text-gray-400 hover:border-gray-600"
            }`}
          >
            <Flag size={14} /> {isFlagged ? "Flagged" : "Flag"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected === null || confidence === null}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              selected !== null && confidence !== null
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 space-y-4">
          {timedOut && selected === null && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-red-300 text-sm">Time's up! No answer submitted.</span>
            </div>
          )}

          <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-indigo-400" />
              <span className="text-indigo-400 font-semibold text-sm">Explanation</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm">Interview Script</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed italic">{question.interviewScript}</p>
          </div>

          {question.proTip && (
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">Pro Tip</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{question.proTip}</p>
            </div>
          )}

          <button
            onClick={() => onAnswer(selected, confidence, timedOut)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            Next Question <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ answers, questions, flagged, totalTime, onRetryMissed, onRetryWeak, onRestart }) {
  const correct = answers.filter((a) => a.selected === questions[a.qIdx].correct).length;
  const pct = Math.round((correct / questions.length) * 100);
  const grade = getGrade(pct);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;

  const subtopicScores = {};
  answers.forEach((a) => {
    const q = questions[a.qIdx];
    const st = q.subtopic;
    if (!subtopicScores[st]) subtopicScores[st] = { correct: 0, total: 0, tier: q.tier };
    subtopicScores[st].total++;
    if (a.selected === q.correct) subtopicScores[st].correct++;
  });

  const luckyGuesses = answers.filter(
    (a) => a.selected === questions[a.qIdx].correct && a.confidence === "Guessing"
  );
  const overconfidentMisses = answers.filter(
    (a) => a.selected !== questions[a.qIdx].correct && a.confidence === "Very Confident"
  );
  const incorrectAnswers = answers.filter((a) => a.selected !== questions[a.qIdx].correct);
  const flaggedAnswers = answers.filter((a) => flagged.has(a.qIdx));

  const [showSection, setShowSection] = useState("incorrect");

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <div className="text-center mb-8">
        <div className={`inline-block p-6 rounded-full ${grade.bg} mb-4`}>
          <Award size={48} className={grade.color} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-1">{pct}%</h1>
        <p className="text-gray-400">{correct} / {questions.length} correct</p>
        <p className={`mt-2 font-medium ${grade.color}`}>{grade.label}</p>
        <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
          <Timer size={14} /> {mins}m {secs}s total
        </p>
      </div>

      <div className="bg-gray-800/60 rounded-xl p-6 mb-6 border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <BarChart3 size={16} /> Per-Subtopic Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(subtopicScores).map(([name, data]) => {
            const sPct = Math.round((data.correct / data.total) * 100);
            const barColor = sPct >= 70 ? "bg-emerald-500" : sPct >= 50 ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{name}</span>
                  <span className="text-gray-500">
                    {data.correct}/{data.total} ({sPct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${sPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(luckyGuesses.length > 0 || overconfidentMisses.length > 0) && (
        <div className="bg-gray-800/60 rounded-xl p-6 mb-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Confidence Analysis</h3>
          {luckyGuesses.length > 0 && (
            <div className="mb-4">
              <p className="text-amber-400 text-sm font-medium mb-2">
                Lucky Guesses ({luckyGuesses.length}) — hidden weak spots
              </p>
              {luckyGuesses.map((a) => (
                <p key={a.qIdx} className="text-gray-400 text-sm ml-3 mb-1">
                  • Q{a.qIdx + 1}: {questions[a.qIdx].subtopic}
                </p>
              ))}
            </div>
          )}
          {overconfidentMisses.length > 0 && (
            <div>
              <p className="text-red-400 text-sm font-medium mb-2">
                Overconfident Misses ({overconfidentMisses.length}) — dangerous misconceptions
              </p>
              {overconfidentMisses.map((a) => (
                <p key={a.qIdx} className="text-gray-400 text-sm ml-3 mb-1">
                  • Q{a.qIdx + 1}: {questions[a.qIdx].subtopic}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {[
          { key: "incorrect", label: `Incorrect (${incorrectAnswers.length})` },
          { key: "flagged", label: `Flagged (${flaggedAnswers.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setShowSection(tab.key)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              showSection === tab.key
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                : "bg-gray-800/40 text-gray-400 border border-gray-700/50 hover:border-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-8 max-h-[600px] overflow-y-auto pr-1">
        {(showSection === "incorrect" ? incorrectAnswers : flaggedAnswers).map((a) => {
          const q = questions[a.qIdx];
          const labels = ["A", "B", "C", "D"];
          return (
            <div key={a.qIdx} className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded border border-gray-600 text-gray-400">Q{a.qIdx + 1}</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${TIER_COLORS[q.tier] || TIER_COLORS["Heavy"]}`}>{q.subtopic}</span>
              </div>
              <p className="text-gray-200 text-sm mb-3">{q.question}</p>
              {a.selected !== null && a.selected !== q.correct && (
                <p className="text-red-400 text-sm mb-1">
                  Your answer ({labels[a.selected]}): {q.options[a.selected].substring(0, 100)}...
                </p>
              )}
              <p className="text-emerald-400 text-sm mb-3">
                Correct ({labels[q.correct]}): {q.options[q.correct].substring(0, 100)}...
              </p>
              <p className="text-gray-400 text-sm">{q.explanation}</p>
            </div>
          );
        })}
        {(showSection === "incorrect" ? incorrectAnswers : flaggedAnswers).length === 0 && (
          <p className="text-gray-500 text-center py-8">
            {showSection === "incorrect" ? "No incorrect answers — great job!" : "No flagged questions."}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {incorrectAnswers.length > 0 && (
          <button
            onClick={onRetryMissed}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Retry Missed Questions ({incorrectAnswers.length})
          </button>
        )}
        {Object.entries(subtopicScores).some(([, d]) => Math.round((d.correct / d.total) * 100) < 70) && (
          <button
            onClick={onRetryWeak}
            className="w-full py-3 bg-amber-600/80 hover:bg-amber-600 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Retry Weak Subtopics (&lt;70%)
          </button>
        )}
        <button
          onClick={onRestart}
          className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium rounded-lg text-sm transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default function ConsistentHashingQuiz({ quizSlug = 'core-concepts-consistent-hashing' }) {
  const [screen, setScreen] = useState("landing");
  const [questionOrder, setQuestionOrder] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

  const startQuiz = (mode, customQuestions) => {
    let order;
    if (customQuestions) {
      order = customQuestions;
    } else if (mode === "shuffled") {
      order = shuffleArray(QUESTIONS.map((_, i) => i));
    } else {
      order = QUESTIONS.map((_, i) => i);
    }
    setQuestionOrder(order);
    setCurrentIdx(0);
    setAnswers([]);
    setFlagged(new Set());
    setSkipped([]);
    setStartTime(Date.now());
    setScreen("quiz");
  };

  const handleAnswer = (selected, confidence, timedOut) => {
    const qIdx = questionOrder[currentIdx];
    setAnswers((prev) => [...prev, { qIdx, selected: timedOut && selected === null ? -1 : selected, confidence: confidence || "Guessing", timedOut }]);

    if (currentIdx < questionOrder.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else if (skipped.length > 0) {
      setQuestionOrder((prev) => [...prev, ...skipped]);
      setSkipped([]);
      setCurrentIdx((i) => i + 1);
    } else {
      setTotalTime(Math.round((Date.now() - startTime) / 1000));
      setScreen("results");
    }
  };

  const handleSkip = () => {
    setSkipped((prev) => [...prev, questionOrder[currentIdx]]);
    if (currentIdx < questionOrder.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else if (skipped.length > 0) {
      const remaining = [...skipped, questionOrder[currentIdx]];
      setQuestionOrder((prev) => [...prev, ...remaining]);
      setSkipped([]);
      setCurrentIdx((i) => i + 1);
    } else {
      setQuestionOrder((prev) => [...prev, questionOrder[currentIdx]]);
      setSkipped([]);
      setCurrentIdx((i) => i + 1);
    }
  };

  const toggleFlag = () => {
    const qIdx = questionOrder[currentIdx];
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qIdx)) next.delete(qIdx);
      else next.add(qIdx);
      return next;
    });
  };

  const retryMissed = () => {
    const missed = answers.filter((a) => a.selected !== QUESTIONS[a.qIdx].correct).map((a) => a.qIdx);
    startQuiz(null, shuffleArray(missed));
  };

  const retryWeak = () => {
    const subtopicScores = {};
    answers.forEach((a) => {
      const q = QUESTIONS[a.qIdx];
      if (!subtopicScores[q.subtopic]) subtopicScores[q.subtopic] = { correct: 0, total: 0 };
      subtopicScores[q.subtopic].total++;
      if (a.selected === q.correct) subtopicScores[q.subtopic].correct++;
    });
    const weakSubtopics = new Set(
      Object.entries(subtopicScores)
        .filter(([, d]) => Math.round((d.correct / d.total) * 100) < 70)
        .map(([name]) => name)
    );
    const weakQs = QUESTIONS.map((q, i) => (weakSubtopics.has(q.subtopic) ? i : -1)).filter((i) => i >= 0);
    startQuiz(null, shuffleArray(weakQs));
  };

  if (screen === "landing") {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <LandingScreen onStart={startQuiz} />
      </div>
    );
  }

  if (screen === "results") {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <ResultsScreen
          answers={answers}
          questions={QUESTIONS}
          flagged={flagged}
          totalTime={totalTime}
          onRetryMissed={retryMissed}
          onRetryWeak={retryWeak}
          onRestart={() => setScreen("landing")}
        />
      </div>
    );
  }

  const currentQIdx = questionOrder[currentIdx];
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <QuestionScreen
        key={currentQIdx}
        question={QUESTIONS[currentQIdx]}
        index={currentIdx}
        total={questionOrder.length}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onFlag={toggleFlag}
        isFlagged={flagged.has(currentQIdx)}
      />
    </div>
  );
}
