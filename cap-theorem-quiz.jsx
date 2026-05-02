// Coverage manifest: CAP Theorem system design quiz (28 questions)
// Subtopics: Consistency vs Availability Trade-off (4), When to Choose Consistency (3),
// When to Choose Availability (3), CAP in System Design Interviews (4),
// Different Levels of Consistency (2), Mixed Consistency Requirements (2),
// Partition Tolerance (2), CAP Definition (1), CAP vs ACID Consistency (1),
// Technology Choices (1), Cross-subtopic bridges (4 embedded)

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "Consistency vs Availability Trade-off",
    "style": "Scenario Analysis",
    "question": "During a network partition, your distributed banking system detects the customer's account exists in partition A but not partition B. The account has $10,000. A user in partition B tries to withdraw $15,000. What happens if you choose AP (Availability + Partition Tolerance)?",
    "options": [
      "The withdrawal is rejected because partition B detects it cannot reach partition A's account ledger and returns a consistency error—even though you chose AP, the banking domain's constraints override the CAP choice, meaning the system falls back to CP behavior automatically when financial data is involved",
      "The withdrawal is allowed, risking overdraft across partitions",
      "The system queues the withdrawal request in partition B's local write-ahead log and holds the response until partition healing occurs, at which point it replays the queued request against the reconciled ledger—this preserves AP semantics because the system technically accepted the request, just with delayed fulfillment",
      "The withdrawal is processed using partition B's local replica of the account balance, but with a reduced withdrawal limit (e.g., capped at $500) as a safety measure—AP systems typically implement progressive degradation rules that allow operations to proceed with reduced functionality rather than full access or complete rejection"
    ],
    "correctIndex": 1,
    "explanation": "AP systems prioritize availability: partition B will allow the withdrawal because the node there doesn't have partition A's ledger data. This creates an overdraft risk that must be resolved during reconciliation. CA systems would reject it, but by choosing AP, you accept temporary inconsistency.",
    "interviewScript": "In your interview, say: 'When we choose AP during a partition, we're saying the node will respond even without full knowledge. Partition B would say yes to the withdrawal because it doesn't see the balance restrictions. This is a real trade-off in systems like eventual consistency models.'",
    "proTip": "The key insight: AP doesn't mean 'wrong answer'—it means 'best-effort answer now, reconcile later.' Banking must add compensating transactions during merge."
  },
  {
    "id": "q2",
    "subtopic": "Consistency vs Availability Trade-off",
    "style": "Anti-pattern Detection",
    "question": "A team designing a distributed e-commerce checkout system says: 'We'll use CP to guarantee consistency and avoid double-selling inventory. During partitions, we'll return errors but never sell the same item twice.' What's the critical flaw in this reasoning?",
    "options": [
      "CP is theoretically impossible when both consistency and partition tolerance are demanded—the system will achieve neither C nor P because the quorum overhead for partition tolerance degrades consistency guarantees below the threshold needed for inventory correctness, resulting in a system that is neither consistent nor truly partition-tolerant",
      "Returning errors during partitions sacrifices availability for users in disconnected regions",
      "Inventory double-selling requires a quorum consensus protocol (like Raft or Paxos) running across all inventory nodes, not just a CP architectural choice—CP alone doesn't specify how writes are coordinated, so double-selling can still occur if the CP implementation uses asynchronous replication internally rather than consensus-based writes",
      "CP doesn't prevent double-selling if the inventory ledger itself partitions across multiple shards, because CP guarantees only apply within a single partition's scope—if item stock is split across shard A and shard B, a partition between them means neither shard has the full inventory picture, and both may independently allow sales up to their local count"
    ],
    "correctIndex": 1,
    "explanation": "The team conflates 'correctness' with consistency. CP (choosing Consistency and Partition Tolerance) means when partitions occur, you sacrifice availability—some users get errors. That's the trade-off. Saying 'never sell twice' is correct, but the cost is that partition B users can't complete purchases (availability loss). For e-commerce, this is often unacceptable.",
    "interviewScript": "In your interview, say: 'CP buys you strong consistency guarantees, but the cost is operational resilience. Users in a disconnected partition can't transact. We have to decide: is data correctness worth losing sales?'",
    "proTip": "AP with compensating transactions (refunds) is often better for commerce than CP with customer-facing errors."
  },
  {
    "id": "q3",
    "subtopic": "Consistency vs Availability Trade-off",
    "style": "Failure Analysis",
    "question": "Your distributed system detects a network partition. Node A has a user's latest profile update (email changed 1 minute ago). Node B still has the old email. A password reset email should go to the new email. Choosing AP, Node B responds with old data. The reset goes to the old email. What's the correct mitigation?",
    "options": [
      "Synchronously block the reset email until partitions heal, because password reset emails are security-critical operations that must never be sent to stale addresses—the 30-second to 5-minute delay during partition healing is acceptable for a password reset flow, and this approach ensures correctness without requiring complex session routing",
      "Accept the temporary inconsistency and implement paranoid client-side checks that verify the email address by querying multiple nodes before sending—if any node returns a different email than the others, the system queues the reset email and retries after a brief delay, providing eventually-correct behavior without sacrificing availability for non-reset operations",
      "Use CRDTs (Conflict-free Replicated Data Types) to auto-merge the profile data across partitions, ensuring that the most recent email update wins deterministically without coordination—CRDTs resolve this class of conflict automatically because last-writer-wins semantics ensure the newer email propagates to all nodes even during partition, making the reset email go to the correct address",
      "Implement read-your-own-writes guarantee for this user's session"
    ],
    "correctIndex": 3,
    "explanation": "This is a session-specific problem. If the same user (who just changed their email) initiates the reset, their session should stick to Node A (read-your-own-writes consistency). This is stronger than AP but weaker than CP—it's a consistency level between eventual and strong. Only options 2 or 4 are viable; 4 is better because it prevents the specific risk.",
    "interviewScript": "In your interview, say: 'This is where we need a hybrid approach. We're choosing AP globally but strengthening consistency for user sessions that made recent writes. Session-stickiness buys us read-your-own-writes without full CP.'",
    "proTip": "Read-your-own-writes is a middle ground: AP for others, stronger consistency for the writer's own session."
  },
  {
    "id": "q4",
    "subtopic": "Consistency vs Availability Trade-off",
    "style": "Design Trade-off",
    "question": "You're designing a social media feed system (AP priority). During a partition, users in partition B see stale posts from 10 minutes ago. Meanwhile, partition A continues accepting new posts. When partitions heal, should you: (A) Show all healed posts to B immediately, or (B) Gradually introduce healed posts to avoid shocking B with suddenly older content?",
    "options": [
      "Choice A—eventual consistency means showing everything immediately is the correct behavior, because gradual introduction violates the consistency contract: once the partition heals, all nodes should converge to the same state, and artificially delaying that convergence on some nodes creates a new form of inconsistency that is harder to reason about than the original staleness",
      "Choice B—gradually merge to maintain user experience, even if technically 'less consistent' by showing posts in weird order",
      "Neither—force users in partition B to refresh and reload their entire feed from the source-of-truth database, bypassing all caches and replicas, because any incremental merge strategy risks showing duplicate posts or missing posts due to merge conflicts that are impossible to resolve correctly without a full state reload",
      "Use vector clocks to determine the 'canonical' causal order before merging any healed data into partition B's feed, ensuring that every post appears in its causally correct position relative to all other posts—this adds 100-200ms of merge latency but guarantees that no user sees posts in an order that violates causal relationships"
    ],
    "correctIndex": 1,
    "explanation": "This is a subtle UX insight into CAP. Even AP systems benefit from smart merge strategies. Choice B trades some consistency property for user experience—posts might appear out of timestamp order. But this is pragmatic AP: you're available, eventually consistent, and thoughtful about the user experience during recovery. Vector clocks (choice D) would give you causal consistency but add complexity.",
    "interviewScript": "In your interview, say: 'CAP tells us we can't have both consistency and availability during partitions, but it doesn't prescribe how to merge. During recovery, we can be smart about the order we reveal healed data to minimize surprise.'",
    "proTip": "Pragmatic AP includes thinking about partition recovery UX, not just availability during partition."
  },
  {
    "id": "q5",
    "subtopic": "When to Choose Consistency",
    "style": "Scenario Analysis",
    "question": "Ticketmaster is selling 100 tickets for a concert. Two users click 'buy' simultaneously from different regions. The system is partitioned. If you choose AP, both partitions might sell the same ticket. A competitor chose CP instead—they write all ticket sales through a single leader and block during partitions. Users in the partitioned region see 'temporarily unavailable.' Which choice is defensible for Ticketmaster?",
    "options": [
      "AP—overselling is a legal liability but it's statistically rare enough to accept at Ticketmaster's scale, because the partition window is typically seconds to minutes and the probability of two users buying the exact same seat during that narrow window is negligible for most events, making the expected cost of occasional refunds lower than the revenue lost from partition-induced unavailability",
      "CP—ticket overselling constitutes fraud under consumer protection regulations, and the legal exposure from selling the same seat twice far exceeds any revenue loss from brief partition-induced unavailability, making CP the only legally defensible choice regardless of the operational cost",
      "Neither—use quorum writes across all ticket inventory nodes to avoid the full CP-vs-AP binary, because quorum-based systems can achieve both consistency and availability simultaneously when the quorum size is tuned correctly relative to the replication factor, effectively sidestepping the CAP trade-off for this specific use case",
      "Depends on regulatory context, but both choices are defensible"
    ],
    "correctIndex": 3,
    "explanation": "Both are defensible but require different trade-offs. CP (what Ticketmaster and many ticket systems use): partitioned users get errors, but you never oversell. AP (what some platforms try): you accept rare overselling and refund the duplicate buyer. Regulatory and business context matters. Liability risk makes CP safer, but AP is operationally better if you have good compensation processes.",
    "interviewScript": "In your interview, say: 'For ticket sales, overselling is a legal and financial risk. That's why most systems choose CP—they require a central authority to prevent double-selling, even though partitions cause brief unavailability. The cost of overselling is higher than the cost of downtime.'",
    "proTip": "High-value, scarce resources (tickets, flight seats) typically choose CP. The business consequence of overselling outweighs availability loss."
  },
  {
    "id": "q6",
    "subtopic": "When to Choose Consistency",
    "style": "Anti-pattern Detection",
    "question": "An e-commerce startup says: 'Our inventory system must be CP. We'll prevent overselling by writing all inventory updates through a write-only cluster and reading from a distributed cache.' Is this actually CP?",
    "options": [
      "Yes—the write-once-read-many pattern guarantees CP because all inventory mutations flow through a single serialized write cluster, and the distributed cache simply reflects the write cluster's state, making the entire system as consistent as the write path regardless of how reads are served",
      "No—the distributed cache can become stale, making reads AP not CP",
      "Partially—it's CP for the inventory write path and AP for the cache read layer, which is actually a valid mixed-consistency architecture because the cache layer's staleness is bounded by the cache invalidation TTL, and as long as the TTL is shorter than the average time between inventory changes, the effective consistency is indistinguishable from true CP for practical purposes",
      "Only if the cache is replicated synchronously to all regions via a cache replication protocol that mirrors every write-cluster mutation to every cache node before acknowledging the write—this approach achieves full CP at the cost of write latency proportional to the number of cache regions, but ensures that every read from any cache node reflects the latest inventory state"
    ],
    "correctIndex": 1,
    "explanation": "This is a classic anti-pattern: confusing layered consistency. Writes go through a single leader (CP), but reads come from a stale cache (AP characteristics). During a partition, the cache doesn't update—users read stale inventory and risk overselling. Real CP requires reads to see the result of the latest write, even during partitions. This design is neither CP nor AP—it's broken.",
    "interviewScript": "In your interview, say: 'CP isn't just about the write path. It requires reads to respect the latest write. A stale cache breaks CP because a user can read 'item available' after another user bought it. This is actually AP with extra latency.'",
    "proTip": "CP requires strong consistency at both write and read. Caching breaks this unless the cache is invalidated immediately (synchronously)."
  },
  {
    "id": "q7",
    "subtopic": "When to Choose Consistency",
    "style": "Scenario Analysis",
    "question": "A financial system processes a transaction: debit account A, credit account B. Both accounts are in different partitions during a network failure. Choosing CP, the transaction blocks. Choosing AP, the debit goes through but the credit doesn't (partition B is unreachable). Later, partitions heal. Which statement best describes why financial systems choose CP despite the availability cost?",
    "options": [
      "Financial regulations require ACID compliance at the transaction level, which is architecturally impossible with AP systems because AP's eventual consistency model cannot provide the atomicity guarantee needed for multi-step financial operations like debit-then-credit, making CP a regulatory requirement rather than just a design preference",
      "The cost of a liability (money owed from one account to another) exceeds the cost of brief unavailability",
      "AP can never propagate changes between partitions once the partition occurs—the debit in partition A and the credit attempt in partition B create permanently divergent state that requires manual reconciliation by a human operator, because AP's conflict resolution mechanisms (vector clocks, CRDTs) cannot handle asymmetric financial mutations where one side has state the other side has never seen",
      "CP systems guarantee zero data loss during partitions by persisting all in-flight transactions to durable storage before acknowledging them, while AP systems by definition accept data loss as a trade-off for availability—this fundamental durability difference means financial data can only exist in CP systems where every write survives any failure scenario"
    ],
    "correctIndex": 1,
    "explanation": "Financial systems choose CP because an unbalanced transfer (debit without corresponding credit) creates a liability. If partition healing fails, the credit might never arrive—the bank has given away money. This liability is more expensive than telling a user 'transaction temporarily unavailable.' AP could work with perfect partition healing guarantees and compensating transactions, but that requires additional infrastructure beyond CAP.",
    "interviewScript": "In your interview, say: 'Finance chooses CP because an inconsistent state (debit without credit) is a real-world liability. Money is owed. Even if we fix it later, the liability exists. Brief unavailability is cheaper.'",
    "proTip": "CP for money movement; AP for non-financial data. The decision is about liability, not just data correctness."
  },
  {
    "id": "q8",
    "subtopic": "When to Choose Availability",
    "style": "Scenario Analysis",
    "question": "A social media feed system receives 1 million view requests per second globally. A network partition occurs between US and EU datacenters. Choosing CP, EU users see 'feed temporarily unavailable.' Choosing AP, they see posts from 30 seconds ago (eventual consistency). Which is better and why?",
    "options": [
      "CP—consistency is worth the unavailability here because a social media feed that shows posts in the wrong order or duplicates posts from merged partitions creates a confusing user experience that degrades trust in the platform, and the 30-second staleness window is long enough that users would notice temporal anomalies in their feed ordering and perceive the platform as broken",
      "AP—some staleness is acceptable for engagement, availability matters more",
      "Neither—use master-master replication with conflict-free replicated data types (CRDTs) to avoid the trade-off entirely, because CRDTs allow both partitions to accept new posts independently and merge them deterministically when the partition heals, achieving both availability and strong eventual consistency without sacrificing either",
      "It depends on whether the partition will heal in seconds or minutes—if the partition duration is under 30 seconds, AP and CP are functionally equivalent because users won't notice the staleness before it resolves, but if the partition lasts minutes, CP's unavailability becomes noticeable enough to impact engagement metrics, making the optimal choice a function of expected partition duration rather than a fixed architectural decision"
    ],
    "correctIndex": 1,
    "explanation": "Social media feeds are AP systems because user engagement depends on availability. A feed that's 'unavailable' loses users; a feed that's 30 seconds stale is still usable. This is why platforms like Facebook, Twitter choose AP (eventual consistency) over CP. There's no high-value transaction (no overselling, no liability)—just user experience.",
    "interviewScript": "In your interview, say: 'For social feeds, availability drives engagement. If half my users can't see their feed, I've lost them. Staleness is acceptable because scrolling through slightly old posts is better than 'temporarily unavailable'.'",
    "proTip": "AP is right for engagement-driven systems. CP is right for transaction-driven systems. The question is: what does your business need most?"
  },
  {
    "id": "q9",
    "subtopic": "When to Choose Availability",
    "style": "Design Trade-off",
    "question": "A review/ratings site (like Yelp) is building their system. During a partition, should they show stale ratings from 1 hour ago, or show 'ratings unavailable' and let users search for restaurants without ratings? (Note: stale ratings are harmless; missing ratings are just less useful.)",
    "options": [
      "Show 'unavailable'—consistent data is more valuable than stale data because users making dining decisions need accurate ratings to avoid choosing a restaurant whose quality has changed, and a 1-hour-old rating could reflect a state before a major health violation, menu change, or ownership transfer that materially altered the restaurant's quality",
      "Show stale ratings—eventual consistency provides more user value",
      "Show the restaurant listing without any ratings but with a subtle indicator that ratings are temporarily refreshing—this avoids both the misleading stale-data problem and the jarring 'unavailable' error, letting users navigate and make decisions based on other signals like photos, menu, and location while ratings catch up",
      "This decision doesn't matter from a CAP perspective because ratings are derived data (aggregated from individual reviews), and derived data doesn't fall under CAP's consistency guarantees—CAP only applies to source-of-truth writes, not to computed aggregates, so the staleness of ratings is a caching concern rather than a consistency concern"
    ],
    "correctIndex": 1,
    "explanation": "Reviews and ratings are non-critical data. A 1-hour-old rating is still useful and accurate enough for most restaurant decisions. This is an AP system: show stale data rather than no data. Users would rather see 'this place got 4.2 stars an hour ago' than 'ratings unavailable.' This is why systems like Yelp, Google Maps choose eventual consistency.",
    "interviewScript": "In your interview, say: 'Stale ratings are almost as useful as fresh ratings. An hour-old rating won't mislead someone. So AP makes sense: keep serving data even if it's not perfectly up-to-date. Eventually, all replicas catch up.'",
    "proTip": "AP is perfect when staleness is acceptable but absence is not. Reviews, product info, user profiles—these all fit."
  },
  {
    "id": "q10",
    "subtopic": "When to Choose Availability",
    "style": "Anti-pattern Detection",
    "question": "A messaging app (WhatsApp-style) says: 'We'll use AP so users can always send messages, even during partitions. Message ordering doesn't matter—we'll use vector clocks to merge everything later.' Is this AP reasoning sound?",
    "options": [
      "Yes—AP allows any send-and-merge-later behavior, and vector clocks provide the causal ordering needed to reconstruct the correct message sequence during merge, so users experience temporary disorder during the partition but see a correctly-ordered conversation once healing completes, which is an acceptable trade-off for always being able to send messages",
      "No—message ordering is critical for conversation coherence, making this unacceptable AP design",
      "Partially—AP allows out-of-order message deliveries only if vector clocks are combined with Lamport timestamps to establish a total ordering across all messages, because vector clocks alone provide partial ordering which is insufficient for conversation threads where every message must appear in a single deterministic sequence relative to all other messages in the thread",
      "It depends on the message content and conversation type—system messages and transactional notifications require strict ordering, but casual user chats can tolerate reordering because humans naturally handle conversational ambiguity, so the system should classify messages into ordering tiers and apply different consistency levels per tier rather than choosing a single AP or CP strategy for all message types"
    ],
    "correctIndex": 1,
    "explanation": "This is a subtle mistake. AP doesn't mean 'abandon all consistency'—it means 'sacrifice consistency for availability.' But for messaging, conversation order is essential. Sending 'Yes' before 'Do you want coffee?' and resolving it later is bad UX. Vector clocks help merge conflicting writes but don't restore logical order. This is why messaging systems use CP (require acknowledgment) or hybrid approaches (AP for delivery but order via sequence numbers).",
    "interviewScript": "In your interview, say: 'AP lets us choose availability, but it doesn't eliminate the need for application-level ordering. Messaging needs causal consistency—if A sends 'let's meet' then 'at 3pm', that order must be preserved. We can't just merge-and-fix with vector clocks.'",
    "proTip": "AP chooses availability, but applications may need internal consistency mechanisms (sequence numbers, causal ordering) that CAP doesn't address."
  },
  {
    "id": "q11",
    "subtopic": "CAP in System Design Interviews",
    "style": "Interview Strategy",
    "question": "In a system design interview, you're asked to design a distributed cache (Redis cluster). The interviewer asks: 'What happens during a network partition?' You say: 'We'll use AP, so some nodes might return stale data while others are unreachable.' The interviewer pushes back: 'But won't that confuse the application?' What's the best follow-up response?",
    "options": [
      "That's why we should reconsider AP—we should use CP instead, because cache confusion during partitions means the application can't trust any cached value, which defeats the purpose of caching and adds latency without reliability, making a CP cache with synchronous replication to all nodes the correct architecture",
      "Yes, but the application is prepared for stale data from a cache by design",
      "We use write-through caching to ensure consistency between the cache and the backing store—every write to the database is synchronously mirrored to the cache, so even during a partition the cache nodes that are reachable from the write path will have fresh data, and the partition-isolated nodes serve stale data that's bounded by the last successful write-through",
      "We'd add conflict resolution via version numbers embedded in each cached value, so when the partition heals and cache nodes reconcile, the higher-versioned value wins deterministically—this gives us eventual consistency with strong convergence guarantees, meaning the application can detect stale reads by comparing version numbers and fall back to the source of truth when a version mismatch is detected"
    ],
    "correctIndex": 1,
    "explanation": "Caches are inherently AP. Applications using caches know data might be stale—that's the trade-off for performance. The right answer shows you understand: (1) CAP applies to the cache layer specifically, (2) applications are aware of cache staleness, (3) this is acceptable because cache-misses are tolerable. You're not defending AP as universally right; you're explaining why it fits caches.",
    "interviewScript": "In your interview, say: 'Caches are AP by design. Applications can't rely on cache for strong consistency. If fresh data is critical, we read-through to the source of truth. The partition-induced staleness is a known limitation we work around in the application logic.'",
    "proTip": "In interviews, defend architectural choices by connecting CAP to application needs, not by claiming one choice is always right."
  },
  {
    "id": "q12",
    "subtopic": "CAP in System Design Interviews",
    "style": "Non-functional Requirements",
    "question": "During a design interview, you propose: 'The user profile service is CP—writes block during partitions. The timeline feed is AP—partitions serve stale posts.' The interviewer asks: 'How do these interact?' A user updates their profile but the partition between profile and feed services is failing. What should happen?",
    "options": [
      "The profile update blocks until the partition heals because the profile service is CP, and CP's blocking behavior propagates transitively to all downstream services that depend on it—since the feed depends on profile data, the CP guarantee of the profile service extends to the feed's representation of that profile, creating end-to-end consistency at the cost of end-to-end availability",
      "The profile update succeeds but the feed doesn't reflect it until the partition heals—this is standard AP behavior where the feed service independently caches profile data and refreshes it on its own schedule, so the feed shows stale profile information until its next cache refresh cycle regardless of whether the profile service is CP or AP",
      "Both services block until the partition heals because CP behavior is required end-to-end: if the profile service is CP and the feed service consumes profile data, the feed service must also be CP for that dependency chain, otherwise the CP guarantee of the profile service is undermined by the eventual consistency of the feed's profile display",
      "Profile is CP, but the profile→feed CDC is AP, so feed eventually reflects the change"
    ],
    "correctIndex": 3,
    "explanation": "This is a real design decision: different components have different CAP choices. The profile service is CP (consistent), so the update completes. The change-data-capture (CDC) pipeline that updates the feed is AP—it will replicate the profile change asynchronously, even if delayed by the partition. Option 4 correctly names this: CDC is async, so it's AP, but it guarantees eventual consistency when the partition heals.",
    "interviewScript": "In your interview, say: 'In a microservice architecture, each service makes its own CAP choice. Profile is CP because updates are critical. But the profile-to-feed replication (CDC) is inherently AP—eventually consistent. We size the CDC pipeline to handle partition backlog.'",
    "proTip": "Enterprise systems mix CP and AP at different layers. The trick is ensuring the boundaries (CDC, event queues) are designed for their consistency model."
  },
  {
    "id": "q13",
    "subtopic": "CAP in System Design Interviews",
    "style": "Design Implications",
    "question": "You're designing a booking system (airline tickets). You propose: 'For consistency, all booking writes go through a single leader. Reads can go to replicas, but they lag by ~100ms due to replication delay.' Is this CP or AP? What's the implication for the design?",
    "options": [
      "It's CP—the single leader guarantees consistency because all booking writes are serialized through one node, and the replication lag on read replicas doesn't affect consistency for the booking operation itself since the leader is the source of truth for all seat availability decisions",
      "It's actually AP—replicas can serve stale data, risking double-booking",
      "It's CP for writes but AP for reads, which is a valid and intentional hybrid architecture—the write path through the single leader provides strong consistency for the booking transaction itself, and the read replicas serve as an AP-optimized fast path for browsing seat availability, with the understanding that users may occasionally see a seat as available that's already been booked, which is handled gracefully at booking time by the CP write path",
      "It's neither CP nor AP in the strict CAP sense—single-leader with lagged replicas is a practical architecture that doesn't map cleanly onto CAP categories because CAP assumes all nodes are peers, whereas leader-follower replication creates an asymmetric topology where consistency and availability guarantees differ depending on which node you query, making CAP's binary classification misleading for this common architecture"
    ],
    "correctIndex": 1,
    "explanation": "This is a critical flaw. Single-leader writes guarantee CP for the write operation, but if reads go to lagged replicas, two users can see 'seat available,' both book, and exceed inventory. This is AP behavior, not CP. Real CP requires reads to see the result of the latest write—either all reads go to the leader, or replicas sync before responding (synchronous replication). The implication: either use Spanner-style synchronous replication, or accept AP and oversell-recovery.",
    "interviewScript": "In your interview, say: 'Single-leader helps with writes but not reads. If replicas lag, users see stale data and book the same seat. That's AP's overhead. For real CP, we need synchronous replication, which adds latency, or we accept AP with refund policies.'",
    "proTip": "Single-leader is not enough for CP—replicas must be synchronously consistent, or you've built AP with added latency."
  },
  {
    "id": "q14",
    "subtopic": "CAP in System Design Interviews",
    "style": "Technology Choice",
    "question": "In an interview, you're asked: 'Should we use PostgreSQL (single-region, ACID) or DynamoDB (multi-region, eventual consistency) for a payments table?' How should you frame this as a CAP decision?",
    "options": [
      "PostgreSQL is CP, DynamoDB is AP; choose based on consistency needs",
      "PostgreSQL is ACID-compliant which is a stronger guarantee than what CAP describes—ACID's consistency property ensures all transactions leave the database in a valid state, which subsumes CAP's consistency property, so framing this as a CAP decision actually understates PostgreSQL's advantages and mischaracterizes the comparison",
      "DynamoDB is faster due to its distributed architecture and should be preferred for payments because low-latency transaction processing is more important than strong consistency—payment authorization windows are typically 2-3 seconds, and DynamoDB's sub-10ms response times provide much more headroom for retry logic and compensating transactions than PostgreSQL's higher-latency cross-region synchronous replication",
      "Both are functionally equivalent for payments at the application layer—the consistency guarantees of the underlying database matter less than the application's transaction management logic, because a well-designed payment service can achieve strong consistency guarantees on top of any database (including DynamoDB) through idempotency keys, saga patterns, and compensating transactions"
    ],
    "correctIndex": 0,
    "explanation": "This frames the real decision clearly. PostgreSQL (single region) achieves CP—strong consistency, partition tolerance (within that region), sacrificed by not replicating across regions. DynamoDB (multi-region) is AP—available in every region, eventually consistent, partition tolerant. For payments, you'd typically choose PostgreSQL (or distributed SQL like Spanner) because payment accuracy is non-negotiable. This is the kind of decision where CAP thinking clarifies the trade-off.",
    "interviewScript": "In your interview, say: 'Payments need strong consistency—PostgreSQL achieves that. DynamoDB is faster and available everywhere, but eventual consistency is unacceptable for money. The CAP perspective: we're choosing CP over AP for this data.'",
    "proTip": "Use CAP language to explain technology choices: 'We chose PostgreSQL for CP guarantees' is stronger than 'PostgreSQL is more reliable.'"
  },
  {
    "id": "q15",
    "subtopic": "Different Levels of Consistency",
    "style": "Consistency Spectrum",
    "question": "A user posts on social media, then immediately refreshes the feed. The post isn't there. They check their profile and see the post. A minute later, the post appears on their feed. What consistency level is this system using?",
    "options": [
      "Strong consistency—the system shows the user their own post on their profile, which means all nodes are fully synchronized and the feed delay is simply a rendering latency issue in the feed aggregation pipeline, not a consistency issue at the data layer",
      "Causal consistency—the profile update causally precedes the feed update, and the system correctly enforces that the profile reflects the write before the feed does, maintaining the causal chain between the user's action and its downstream effects across different views of the data",
      "Read-your-own-writes (user sees their own post but others don't yet)",
      "Eventual consistency—the feed eventually catches up to the profile, which is the standard behavior of an eventually consistent system where different materialized views of the same underlying data converge at different rates depending on their replication topology and refresh schedules"
    ],
    "correctIndex": 2,
    "explanation": "This is read-your-own-writes consistency. The user (the writer) sees their own post immediately (on their profile), but other readers don't see it yet. The system is stricter for writes than for reads of others' data. This is a middle ground: weaker than strong consistency (others' reads are stale), stronger than eventual (writer's reads are immediate). Social platforms often use this to prevent 'where's my post?' confusion while allowing eventual consistency for others' feeds.",
    "interviewScript": "In your interview, say: 'Read-your-own-writes solves a key problem: users see their own changes immediately, preventing confusion. But others see eventual consistency. It's more sophisticated than simple AP.'",
    "proTip": "Read-your-own-writes is a practical consistency level for user-generated content systems."
  },
  {
    "id": "q16",
    "subtopic": "Different Levels of Consistency",
    "style": "Design Trade-off",
    "question": "A banking app shows your account balance. You transfer $100 out. Immediately after, you see the new balance ($900 from $1000). You then buy something with your card in a store. The store's system (different bank) sees your balance as $1000 for 10 seconds, then it updates to $900. Your card is declined because old balance is checked. Is this causal consistency failure, and how would you fix it?",
    "options": [
      "Yes—the transfer causally precedes the store check, so the store should see $900 first",
      "No—this is expected eventual consistency behavior, not a causal consistency violation, because the store's payment processor and your bank operate as separate distributed systems with independent replication pipelines—causal consistency only applies within a single system's boundary, and cross-system consistency requires explicit coordination protocols like two-phase commit that are separate from CAP's consistency guarantees",
      "It depends on whether the store's point-of-sale system subscribes to your bank's real-time event stream—if it does, the event propagation should deliver the balance update before the card authorization check, making this a configuration issue rather than a fundamental consistency violation; if it doesn't, the store system is operating on a stale snapshot by design",
      "This requires session tokens or vector clocks to fix rather than CAP-level decisions—the card network should pass a session token from your banking app to the store's terminal that references your most recent transaction, allowing the authorization service to check the post-transfer balance rather than a stale replica, which is a protocol-level fix rather than an architecture-level CAP choice"
    ],
    "correctIndex": 0,
    "explanation": "This is a causal consistency violation. The user's action (transfer) causally precedes the store's query. If causal consistency is enforced, the store should see the transferred balance. Instead, it sees a stale value due to replication lag. The system is achieving eventual consistency but not causal consistency. To fix: the card network (Visa, Mastercard) uses real-time balance checks or consensus-based protocols, not just event propagation.",
    "interviewScript": "In your interview, say: 'This is why payment networks use synchronous balance checks, not asynchronous replication. Causal consistency would mean the merchant always sees the result of your transfer before checking balance. Strong consistency guarantees this; eventual consistency doesn't.'",
    "proTip": "Causal consistency is harder to implement than eventual consistency but essential for linked operations (transfer + spend)."
  },
  {
    "id": "q17",
    "subtopic": "Mixed Consistency Requirements",
    "style": "Scenario Analysis",
    "question": "Ticketmaster must handle two operations: (1) Finding available events—must be fast, some staleness acceptable. (2) Booking tickets—must prevent double-selling. How should they design consistency per operation?",
    "options": [
      "AP for both—simplify the architecture by treating everything as eventually consistent, because the search results showing a sold-out event is a minor UX issue that's handled gracefully by the booking service returning an error, and the architectural simplicity of a single consistency model across all operations reduces operational complexity and failure modes",
      "CP for both—consistency everywhere ensures users never see stale search results showing events that are actually sold out, which prevents the frustrating experience of finding an event, clicking through to book, and then being told it's unavailable—the slight increase in search latency from synchronous reads is worth the improved user experience of accurate search results",
      "AP for search (fast, stale okay), CP for booking (prevent double-sell)",
      "CP for search and AP for booking—search results must be accurate and consistent to prevent users from wasting time on sold-out events, while the booking process can use optimistic concurrency with compensating transactions (refunds) for the rare double-sell case, since the cost of occasionally refunding a duplicate booking is lower than the cost of slowing down every search query with synchronous consistency checks"
    ],
    "correctIndex": 2,
    "explanation": "This is the mixed requirements insight. Search (read-only, exploratory) can afford staleness—an event that sold out 2 minutes ago might still show as available; users will get an error at booking time. Booking itself (write-heavy, transactional) must be CP to prevent double-selling. This is why Ticketmaster's search is fast (AP replicas) but booking requires waiting for the central inventory service (CP). Option 3 correctly pairs the consistency model to the operation's risk profile.",
    "interviewScript": "In your interview, say: 'Different operations have different consistency needs. Search is AP—we optimize for speed and accept that some results are stale. Booking is CP—we sacrifice speed for correctness. This mixed approach lets us be fast overall without sacrificing critical correctness.'",
    "proTip": "In real systems, not everything is CP or AP. Route different operations to different consistency tiers."
  },
  {
    "id": "q18",
    "subtopic": "Mixed Consistency Requirements",
    "style": "Design Trade-off",
    "question": "Tinder uses a matching algorithm (recommending profiles to swipe on) and profile browsing. Matching must not show the same person twice (consistency-critical). Browsing profiles can show slightly stale information. How does this inform the architecture?",
    "options": [
      "Use CP everywhere—both matching and browsing should go through a single leader to prevent the edge case where a profile update (e.g., deleting their account) hasn't propagated to the AP cache layer, causing the matching algorithm to recommend a user who no longer exists on the platform",
      "Use AP everywhere—both matching and browsing can be eventually consistent, because the matching algorithm already handles edge cases like showing a profile that was recently matched with someone else by simply showing a 'no longer available' message when the user tries to interact, and this retry-based approach is simpler than maintaining two different consistency models",
      "Matching through a consensus-based service (CP), profile data from AP cache",
      "Both need CP—showing stale profile data (outdated photos, old bio) is worse than any consistency benefit from AP caching, because users make swipe decisions based on profile content, and stale profile data leads to matches based on inaccurate representations, which damages trust in the platform and increases unmatch rates"
    ],
    "correctIndex": 2,
    "explanation": "This is a sophisticated design. Matching (the core algorithm that generates swipes) must be CP—you don't want to recommend the same person twice, which would be a poor user experience. But the profile data (bio, photos, etc.) can be AP-served from cache—slightly stale photos are fine. This mixed approach uses a CP write service for matching logic but AP reads for the supporting data.",
    "interviewScript": "In your interview, say: 'Matching is the critical path—it drives engagement and must not duplicate. We run matching through a consensus service. But profile data (which might be from an AP layer) can lag. The critical operation is CP; the supporting data is AP.'",
    "proTip": "Identify the critical path (matching) vs. supporting data (profiles). CP the critical path, AP the rest."
  },
  {
    "id": "q19",
    "subtopic": "Partition Tolerance",
    "style": "Failure Scenario",
    "question": "A network partition isolates a database cluster into two parts: A (leader) and B (replicas). A user in partition B tries to read data. The system is AP. What happens, and is the partition tolerance respected?",
    "options": [
      "B returns stale data; partition tolerance is respected (AP allows this)",
      "B returns an error 'leader unreachable' because even in AP systems, read replicas must validate that their data is within an acceptable staleness window before responding—if the replica detects it hasn't received replication updates beyond a configured threshold, it returns an error rather than potentially misleading stale data, sacrificing availability for bounded staleness",
      "B blocks waiting for partition healing because AP systems still require eventual confirmation that the data served is within the consistency bounds defined by the application—the system queues the read request and returns a response only when partition healing confirms the replica's data version, maintaining partition tolerance by not crashing but trading immediate availability for bounded consistency",
      "B re-routes the request through an alternate network path to reach leader A, because modern distributed systems implement multi-path routing that finds connectivity around partitions—partition tolerance in practice means the system has redundant network paths, not that it serves stale data when the primary path fails"
    ],
    "correctIndex": 0,
    "explanation": "In AP, partition tolerance is non-negotiable—the system must tolerate partitions by continuing to operate. B returns what it has (stale data). In contrast, options B and C would be AP failure (the system stops serving requests during partitions). Option D (rerouting) wouldn't work during a partition—A is unreachable. Partition tolerance means 'keep operating despite failures,' which is what B does.",
    "interviewScript": "In your interview, say: 'Partition tolerance is about resilience. It means the system doesn't halt during network failures. AP respects this by serving available data. CP respects it too (by refusing writes until partition heals), but not by halting. Both choose partition tolerance by design.'",
    "proTip": "Partition tolerance = the system doesn't halt during network faults. Both CP and AP respect this; they just respond differently (refuse vs. stale)."
  },
  {
    "id": "q20",
    "subtopic": "Partition Tolerance",
    "style": "Scenario Analysis",
    "question": "A distributed database has 5 nodes. A network partition splits it into 3 nodes (A, B, C) and 2 nodes (D, E). Quorum is 3. The system is designed to 'allow writes only to the majority partition.' Is this CP, AP, or neither? What about partition tolerance?",
    "options": [
      "CP with partition tolerance—majority partition can write, minority can't",
      "AP with partition tolerance—the minority partition returns errors for writes but continues serving reads from its local state, which is technically AP behavior because the nodes are still available and responding to requests, even though write availability is restricted to the majority partition",
      "AP with partition tolerance—the minority partition serves stale read data while the majority handles all writes, and when the partition heals the minority nodes catch up through replication—this makes the overall system AP because every node remains responsive to some class of requests throughout the partition",
      "Neither—this design sacrifices partition tolerance by halting the minority partition, because partition tolerance requires all nodes to remain fully operational during a network split, and stopping writes on the minority means those nodes are not tolerating the partition but rather failing in response to it"
    ],
    "correctIndex": 0,
    "explanation": "This is a CP design that respects partition tolerance. The majority partition (A, B, C) can continue writing because it has quorum. The minority partition (D, E) cannot write (it rejects writes). Both partitions tolerate the failure—they don't halt—but they respond differently. This is how systems like Kafka (with leader election in majority partition) respect partition tolerance while choosing CP. Option 4 is wrong because rejecting writes isn't halting—it's a valid response during a partition.",
    "interviewScript": "In your interview, say: 'Partition tolerance doesn't mean everything keeps working. It means the system responds to the partition—some parts might reject writes, but the system doesn't hang. Majority partition gets CP, minority gets reduced capacity. Both are tolerated responses.'",
    "proTip": "Quorum systems achieve CP with partition tolerance by letting the majority partition proceed while the minority gracefully degrades (rejects writes, not halts)."
  },
  {
    "id": "q21",
    "subtopic": "CAP Definition",
    "style": "Definition Check",
    "question": "Which statement best defines the CAP Theorem's three properties in the context of distributed systems?",
    "options": [
      "Consistency = all nodes have identical data at all times through synchronous replication; Availability = all nodes always respond to every request within a bounded time; Partition Tolerance = the system continues functioning even when some nodes permanently fail and are removed from the cluster",
      "Consistency = reads see latest writes; Availability = any non-failing node responds to requests; Partition Tolerance = system tolerates arbitrary message delays/loss",
      "Consistency = the database enforces all application-level invariants and constraints, ensuring data is always semantically correct; Availability = the system maintains zero downtime with automatic failover; Partition Tolerance = there is no single point of failure in the architecture, so any individual component can fail without affecting the system",
      "These three properties are independent design dimensions that can all be achieved simultaneously with sufficiently sophisticated distributed consensus protocols—Raft and Paxos demonstrate that CP+A is achievable in practice, and the CAP theorem's 'pick two' framing is considered outdated by modern distributed systems researchers who have shown that careful protocol design can provide all three guarantees under realistic network conditions"
    ],
    "correctIndex": 1,
    "explanation": "Option 1 confuses node failures with partitions (different concepts). Option 3 conflates CAP properties with operational metrics (correctness, downtime, SPoF). Option 4 contradicts the theorem. Option 1 is the precise CAP definition: consistency (read-after-write semantics), availability (every non-failing node responds), partition tolerance (tolerates arbitrary message delays/network failures). The theorem says you can't have all three simultaneously during a partition.",
    "interviewScript": "In your interview, say: 'CAP is precise: consistency means reads reflect prior writes, availability means every node responds, partition tolerance means the system tolerates message loss. The trade-off is during partitions—you pick two.'",
    "proTip": "CAP is often misstated. Availability doesn't mean 'never down'; it means 'non-failing nodes respond.' Partition tolerance doesn't mean 'no failures'; it means 'arbitrary message delays are tolerated.'"
  },
  {
    "id": "q22",
    "subtopic": "CAP vs ACID Consistency",
    "style": "Conceptual Distinction",
    "question": "A system is ACID-compliant (Atomicity, Consistency, Isolation, Durability) with strong consistency. Does this mean it's CP in CAP terms? Why or why not?",
    "options": [
      "Yes—ACID compliance means the system is CP by definition, because ACID's consistency property (C in ACID) is the same as CAP's consistency property (C in CAP), and the atomicity and isolation guarantees of ACID automatically prevent the split-brain scenarios that CAP's consistency property is designed to address, so any ACID-compliant database inherits CP behavior without additional configuration",
      "Not necessarily—ACID describes transaction guarantees; CP describes distributed behavior during partitions",
      "No—ACID and CAP are completely unrelated concepts that address different layers of the system stack: ACID operates at the storage engine level managing transaction boundaries, while CAP operates at the network level managing node communication, so a system's ACID compliance has no bearing whatsoever on its CAP classification and the two frameworks should never be compared",
      "Only if the database is deployed as a multi-node cluster—single-node ACID databases operate outside the CAP theorem's scope because CAP specifically models distributed systems with multiple nodes that can experience network partitions, and a single-node system by definition cannot partition, making CAP's framework inapplicable and the CP/AP classification meaningless for standalone database deployments"
    ],
    "correctIndex": 1,
    "explanation": "This is the critical confusion the quiz highlights. ACID is about transaction properties (atomicity, isolation, durability). CAP is about distributed behavior during partitions. A single-node PostgreSQL is ACID-compliant but doesn't face CAP trade-offs (no partitions possible in a single node). A distributed PostgreSQL with synchronous replication is both ACID-compliant AND CP. The relationship: ACID doesn't imply CP; CP is a specific distributed guarantee. ACID can be achieved in CP systems, but ACID itself isn't a CAP choice.",
    "interviewScript": "In your interview, say: 'ACID and CAP address different concerns. ACID is about transaction semantics; CAP is about behavior during partitions. A database can be ACID within a single machine or a CP cluster, but ACID itself doesn't tell you how it behaves when partitioned.'",
    "proTip": "Don't confuse ACID consistency (all transactions see a consistent view) with CAP consistency (all nodes see the latest write)."
  },
  {
    "id": "q23",
    "subtopic": "Technology Choices",
    "style": "Architecture Decision",
    "question": "You're choosing a database for different use cases. Which pairing is most defensible from a CAP perspective?",
    "options": [
      "PostgreSQL (CP single-node) for payments, DynamoDB (AP multi-region) for user profiles",
      "Cassandra (AP) for everything—it's the most horizontally scalable option and can be tuned to provide strong consistency per-query using consistency level ALL, which effectively makes it CP for individual operations while retaining AP's multi-region availability for the rest of the workload, giving you the best of both worlds without needing to operate multiple database systems",
      "Spanner (CP multi-region) for everything—it provides the strongest consistency guarantees available in a distributed database and eliminates the need to reason about CAP trade-offs entirely, because Spanner's TrueTime-based consensus protocol achieves both strong consistency and high availability simultaneously, making the CP-vs-AP distinction irrelevant for any system that can afford Spanner's pricing",
      "Redis (AP cache) for payments with a write-through layer to PostgreSQL, and PostgreSQL (CP) for cache invalidation—this gives payments sub-millisecond read latency from Redis while PostgreSQL handles the consistency-critical write path, and the write-through layer ensures Redis always reflects the latest committed state within the cache invalidation window"
    ],
    "correctIndex": 0,
    "explanation": "Option 0 correctly matches the consistency model to the use case. Payments need CP (PostgreSQL); profiles can be AP (DynamoDB—available everywhere, eventually consistent). Option 1 (Cassandra everywhere) is wrong because some data (payments) needs CP. Option 2 (Spanner everywhere) is overengineered and expensive. Option 3 is backward—Redis shouldn't store payments. The right answer shows understanding: choose CP for consistency-critical data, AP for non-critical data.",
    "interviewScript": "In your interview, say: 'Technology choice flows from CAP. Payments need CP—we choose PostgreSQL or Spanner. User profiles are AP—DynamoDB or Cassandra. Mixing consistency models across services is how real systems balance speed and correctness.'",
    "proTip": "Don't pick one database for everything. Use CP for critical data, AP for best-effort data. The consistency model should drive technology choice."
  },
  {
    "id": "q24",
    "subtopic": "Consistency Level × Technology Choice",
    "style": "Bridge Question",
    "question": "You want causal consistency for a messaging system without using a full CP system like Spanner (too slow). You choose DynamoDB (AP) but add vector clocks. Will this give you causal consistency?",
    "options": [
      "Yes—vector clocks alone ensure causal consistency in any AP system by tracking the happens-before relationship between all events across all nodes, which provides sufficient information to reorder messages into their causal sequence during merge, making DynamoDB with vector clocks causally consistent by construction",
      "Partially—vector clocks detect causality violations after the fact but don't prevent them during the partition window, so users may see messages out of order temporarily until the merge process runs and reorders them, which provides eventual causal consistency rather than strict causal consistency",
      "No—causal consistency requires coordinating writes, which DynamoDB (AP) doesn't do",
      "Only if DynamoDB is configured in Global Tables multi-master mode with strong consistency enabled per-region—Global Tables provide cross-region replication with last-writer-wins conflict resolution, and when combined with vector clocks the system can detect and correct causal ordering violations during the replication merge phase, achieving causal consistency within the replication propagation window"
    ],
    "correctIndex": 2,
    "explanation": "This is a subtle mistake. Vector clocks help you detect and resolve causal conflicts, but they don't enforce causality. DynamoDB (AP) will happily accept writes in any order. Vector clocks can identify 'message B happened before A,' but by then, both are written. Causal consistency requires preventing the violation (CP-like), not detecting it after the fact. For messaging, you'd need ordering guarantees at write time, which DynamoDB doesn't enforce.",
    "interviewScript": "In your interview, say: 'Vector clocks are a recovery tool, not a guarantee. They help merge conflicting writes, but they don't prevent causality violations. For true causal consistency, you need write-time coordination—Spanner, consensus protocols, or sequence numbers.'",
    "proTip": "Vector clocks and CRDTs help AP systems recover gracefully, but they don't upgrade AP to a stronger consistency model."
  },
  {
    "id": "q25",
    "subtopic": "Mixed Requirements × Interview Strategy",
    "style": "Bridge Question",
    "question": "In an interview, you propose: 'The profile service is CP, the notifications service is AP.' The interviewer asks: 'What if a profile update fails to trigger a notification?' How do you respond?",
    "options": [
      "It's an acceptable trade-off—the profile is consistent through the CP service, and notifications are inherently best-effort by nature (users don't expect 100% notification delivery), so a missed notification from a partition event is within the expected operational bounds and doesn't require additional infrastructure to bridge the gap between the two services",
      "We'd use a notification queue (CDC) between them, making notification delivery reliable",
      "We'd make both services CP—this mixed model is too risky because a CP profile service feeding into an AP notification service creates a reliability gap where important profile changes (email verification, password reset, account deactivation) can fail to trigger their associated notifications, and the cost of that failure for security-critical notifications justifies the additional latency of making the notification service CP as well",
      "We'd use compensating transactions to detect and re-send missed notifications—a periodic reconciliation job would compare the profile service's change log against the notification service's delivery log, identify any profile changes that didn't trigger a corresponding notification, and re-send them with a 'delayed notification' flag so the user understands the timing discrepancy"
    ],
    "correctIndex": 1,
    "explanation": "Mixed CAP models need bridges. The profile service is CP (no data loss), but it must push changes to the notification service reliably. That bridge (CDC, event queue) should guarantee delivery, even if notifications are eventually consistent. Option 1 misses the risk: if CP writes don't trigger AP notifications, notifications disappear. Option 2 is correct: a persistent queue between services ensures the profile write triggers a notification delivery attempt.",
    "interviewScript": "In your interview, say: 'Mixing CP and AP requires reliable event streams between them. The profile service (CP) writes to a change-log. The notification service (AP) consumes and eventually delivers. The queue guarantees the event isn't lost, even if notifications lag.'",
    "proTip": "When bridging CP and AP services, the bridge itself (event queue, CDC) must be reliable—it's the glue holding consistency models together."
  },
  {
    "id": "q26",
    "subtopic": "Availability Design × Consistency Guarantees",
    "style": "Bridge Question",
    "question": "A system uses multi-master replication (write to any node, conflict resolution later) to maximize availability. During a partition, both sides can write. This sounds AP. But you add a write-filtering rule: only allow writes that don't conflict with partition A. Are you now CP?",
    "options": [
      "Yes—the filtering rule ensures consistency across partitions by preventing conflicting writes from entering the system, which is functionally equivalent to CP because the system now rejects writes that would create inconsistency, achieving the same outcome as consensus-based coordination through application-layer write validation",
      "No—you're still AP, just with application-layer conflict detection",
      "Partially—this is hybrid consistency that sits between CP and AP on the consistency spectrum, providing stronger guarantees than pure AP (because conflicting writes are filtered) but weaker than full CP (because the filtering is unilateral rather than coordinated), resulting in a practical middle ground that trades some theoretical purity for operational simplicity",
      "This filtering is technically impossible without partition-aware consensus because partition B cannot know what partition A's write-filtering rule is rejecting during the partition—any filter rule defined before the partition is based on stale knowledge of partition A's state, and any filter rule that claims to prevent conflicts with A's writes during the partition is making assumptions about writes it cannot observe, making the approach fundamentally unsound"
    ],
    "correctIndex": 1,
    "explanation": "Write-filtering in one partition doesn't enforce consistency across both. During partition, both sides can write conflicting data—partition B doesn't know what partition A's rule is rejecting. You've added conflict detection (which is good for AP recovery), but you haven't achieved CP. Only consensus protocols (2PC, Raft, Paxos) or quorum writes across partitions enforce CP. This system is still AP with smarter conflict handling.",
    "interviewScript": "In your interview, say: 'Application-level filtering is excellent for AP systems—it reduces conflicts and speeds recovery. But it's not the same as CP. CP requires coordination (quorum, consensus) to prevent conflicts upfront. Filtering resolves conflicts after the fact.'",
    "proTip": "Conflict detection and resolution are AP tools, not CP tools. CP prevents conflicts by refusing writes; AP allows writes and resolves conflicts later."
  },
  {
    "id": "q27",
    "subtopic": "Partition Tolerance × Consistency/Availability Decision",
    "style": "Bridge Question",
    "question": "A system is designed to detect partitions and automatically isolate the minority partition (stop it from serving requests). Is this respecting partition tolerance?",
    "options": [
      "Yes—partition tolerance is defined as detecting and isolating partitions to prevent split-brain scenarios, and automatically stopping the minority partition is the canonical implementation of partition tolerance because it ensures the system never enters an inconsistent state due to independent operation of disconnected segments",
      "No—partition tolerance requires that minority partitions continue responding to requests (possibly with stale data or reduced functionality), and stopping them entirely means the system is not tolerating the partition but rather failing in response to it, which violates the partition tolerance guarantee by reducing system capacity proportional to the partition size",
      "Partially—the majority partition respects it, but the minority is sacrificed",
      "This depends on how quickly the isolation happens—if the minority partition is isolated within milliseconds of partition detection, the system effectively maintains partition tolerance because the transition is fast enough that external clients experience no observable degradation, but if isolation takes seconds or longer, the system temporarily enters an inconsistent state during the detection window that violates partition tolerance guarantees"
    ],
    "correctIndex": 2,
    "explanation": "Partition tolerance means 'the system tolerates the existence of network partitions'—it doesn't mean 'all partitions must serve requests.' The majority partition continues operating (respects availability or consistency depending on the design). The minority partition stops serving—it's not halting the entire system, just gracefully degrading. This is partition-aware graceful degradation, a form of partition tolerance. A true violation would be the whole system hanging.",
    "interviewScript": "In your interview, say: 'Partition tolerance doesn't require perfect service during partitions. It requires the system to degrade gracefully. The minority partition stopping prevents split-brain, which is the right trade-off. The system as a whole tolerates the partition by partitioning itself.'",
    "proTip": "Partition tolerance = the system responds to partitions (not halts). Split-brain prevention (stopping minority) is a valid partition-tolerant response."
  },
  {
    "id": "q28",
    "subtopic": "CAP in System Design Interviews",
    "style": "Scenario Analysis",
    "question": "During an interview, you design a system and say: 'During normal operation, we achieve strong consistency. During partitions, we degrade to eventual consistency (AP). This way, we get the best of both worlds—CP normally, AP when needed.' Is this reasoning sound?",
    "options": [
      "Yes—this is an ideal adaptive design that dynamically adjusts its consistency guarantees based on network conditions, providing the strongest possible guarantees at any given moment by using CP when the network is healthy and gracefully degrading to AP when partitions occur, maximizing both consistency and availability across the system's operating envelope",
      "No—you're confusing consistency levels with CAP. You can't switch between CP and AP; the choice is architectural",
      "Partially—this works only if you explicitly code fallback logic per operation that detects partition events and switches the read/write path from synchronous (CP) to asynchronous (AP) mode, with the application maintaining a state machine that tracks the current consistency level and adjusts query routing accordingly, which is architecturally valid but extremely complex to implement correctly",
      "It depends on how long partitions typically last—if partitions are rare and short (under 30 seconds), then the system effectively operates as CP because the AP degradation window is negligible, but if partitions are frequent or long-lasting, the system's effective consistency guarantee is AP because most reads during the partition window will see stale data, making the system's classification dependent on the network's reliability profile rather than the architecture itself"
    ],
    "correctIndex": 1,
    "explanation": "This is a common misconception in interviews. CAP isn't a runtime dial—it's an architectural choice. You can design a system to tolerate some stale reads (AP-like) while usually being consistent (CP-like), but you're not 'choosing AP during partitions' as an adaptation. The system's design is fixed: if your reads can tolerate staleness, it's AP by design; if they can't, it's CP. You might improve your recovery during partitions (faster merging, better conflict resolution), but that's not 'switching to AP.'",
    "interviewScript": "In your interview, say: 'The fundamental CAP choice is architectural, not runtime. If your system can serve stale data during partitions, it's AP by design. If it blocks, it's CP by design. You optimize recovery within that choice, but you don't switch between them. That said, smart systems are AP-by-default with CP semantics for critical operations.'",
    "proTip": "Interview anti-pattern: claiming to switch between CAP modes at runtime. CAP is architectural. Optimize within your choice, don't claim to escape it."
  }
];

export default {
  questions: QUESTIONS
};
