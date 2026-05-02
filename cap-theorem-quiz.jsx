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
      "The withdrawal is rejected—returning CA behavior instead",
      "The withdrawal is allowed, risking overdraft across partitions",
      "The system waits for partition healing before responding",
      "The withdrawal is queued until consensus is achieved"
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
      "CP is theoretically impossible—they'll get neither C nor P",
      "Returning errors during partitions sacrifices availability for users in disconnected regions",
      "Inventory double-selling requires quorum consensus, not CP alone",
      "CP doesn't prevent double-selling if the ledger itself partitions"
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
      "Synchronously block the reset email until partitions heal",
      "Accept the temporary inconsistency and add paranoid client-side checks",
      "Use CRDTs to auto-merge the profile data across partitions",
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
      "Choice A—eventual consistency means show everything immediately",
      "Choice B—gradually merge to maintain user experience, even if technically 'less consistent' by showing posts in weird order",
      "Neither—force users in partition B to refresh and reload from cache",
      "Use vector clocks to determine the 'canonical' order before merging"
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
      "AP—overselling is legal liability but rare enough to accept",
      "CP—ticket overselling is fraud; availability loss is acceptable cost",
      "Neither—use quorum writes to avoid full CP or AP",
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
      "Yes—the write-once-read-many pattern guarantees CP",
      "No—the distributed cache can become stale, making reads AP not CP",
      "Partially—it's CP for inventory, AP for the cache layer",
      "Only if the cache is replicated synchronously to all regions"
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
      "Financial regulations require ACID compliance, which is impossible with AP",
      "The cost of a liability (money owed from one account to another) exceeds the cost of brief unavailability",
      "AP can never propagate changes between partitions",
      "CP systems never lose data; AP systems always do"
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
      "CP—consistency is always worth the unavailability",
      "AP—some staleness is acceptable for engagement, availability matters more",
      "Neither—use master-master replication to avoid the trade-off",
      "Depends on whether the partition will heal in seconds or minutes"
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
      "Show 'unavailable'—consistent data is more valuable than stale data",
      "Show stale ratings—eventual consistency provides more user value",
      "Show nothing—let users navigate without ratings entirely",
      "This decision doesn't matter; CAP applies equally to both choices"
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
      "Yes—AP allows any send-and-merge-later behavior",
      "No—message ordering is critical for conversation coherence, making this unacceptable AP design",
      "Partially—AP allows out-of-order deliveries only if vector clocks resolve conflicts",
      "It depends on the message content; system messages need ordering but user chats don't"
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
      "That's why we don't use AP—we should use CP instead",
      "Yes, but the application is prepared for stale data from a cache by design",
      "We use write-through caching to ensure consistency",
      "We'd add conflict resolution via version numbers"
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
      "The profile update blocks until the partition heals (CP behavior)",
      "The profile update succeeds but feed doesn't reflect it until partition heals (AP behavior)",
      "Both block until the partition heals (CP behavior everywhere)",
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
      "It's CP—single leader guarantees consistency",
      "It's actually AP—replicas can serve stale data, risking double-booking",
      "It's CP for writes but AP for reads (a hybrid)",
      "It's neither—single-leader with lagged replicas is broken"
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
      "PostgreSQL is ACID which is stronger than CAP; it's not a CAP choice",
      "DynamoDB is faster so always better for payments",
      "Both are equivalent; just pick the cheaper option"
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
      "Strong consistency (everything is up-to-date)",
      "Causal consistency (profile update causally precedes feed)",
      "Read-your-own-writes (user sees their own post but others don't yet)",
      "Eventual consistency (everything syncs eventually)"
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
      "No—this is expected eventual consistency, not a causal consistency violation",
      "Maybe—depends on whether the store system subscribes to your bank's events",
      "This requires session tokens or vector clocks to fix, not CAP alone"
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
      "AP for both—simplify by treating everything as eventual consistency",
      "CP for both—consistency everywhere, even if it slows searches",
      "AP for search (fast, stale okay), CP for booking (prevent double-sell)",
      "CP for search, AP for booking (opposite priorities)"
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
      "Use CP everywhere—both matching and browsing go through a single leader",
      "Use AP everywhere—both matching and browsing are eventually consistent",
      "Matching through a consensus-based service (CP), profile data from AP cache",
      "Both need CP—showing old profiles is worse than any consistency benefit"
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
      "B returns an error 'leader unreachable'; partition tolerance is sacrificed",
      "B blocks waiting for partition healing; partition tolerance is sacrificed",
      "B re-routes to leader A; partition tolerance is unnecessary"
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
      "AP with partition tolerance—minority partition returns errors",
      "AP with partition tolerance—minority serves stale data",
      "Neither—this design sacrifices partition tolerance by halting the minority"
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
      "Consistency = all nodes have identical data; Availability = all nodes always respond; Partition Tolerance = system works even if some nodes fail",
      "Consistency = reads see latest writes; Availability = any non-failing node responds to requests; Partition Tolerance = system tolerates arbitrary message delays/loss",
      "Consistency = data is always correct; Availability = zero downtime; Partition Tolerance = no single point of failure",
      "These three properties are independent; you can have all three with good design"
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
      "Yes—ACID means CP, no trade-off",
      "Not necessarily—ACID describes transaction guarantees; CP describes distributed behavior during partitions",
      "No—ACID and CAP are unrelated concepts",
      "Only if the database is clustered; single-node ACID databases don't apply CAP"
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
      "Cassandra (AP) for everything—it's the most scalable",
      "Spanner (CP multi-region) for everything—it's the strongest",
      "Redis (AP cache) for payments, Postgres (CP) for cache invalidation"
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
      "Yes—vector clocks alone ensure causal consistency in any AP system",
      "Partially—vector clocks detect causality violations but don't prevent them",
      "No—causal consistency requires coordinating writes, which DynamoDB (AP) doesn't do",
      "Only if DynamoDB is configured in Global Tables multi-master mode"
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
      "It's an acceptable trade-off—the profile is consistent, notifications are best-effort",
      "We'd use a notification queue (CDC) between them, making notification delivery reliable",
      "We'd make both CP—this mixed model is too risky",
      "We'd use compensating transactions to re-send notifications"
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
      "Yes—the filtering ensures consistency across partitions",
      "No—you're still AP, just with application-layer conflict detection",
      "Partially—this is hybrid consistency, neither fully CP nor AP",
      "This filtering is impossible without partition-aware consensus"
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
      "Yes—partition tolerance means detecting and isolating partitions",
      "No—partition tolerance requires minority partitions to continue responding",
      "Partially—the majority partition respects it, but the minority is sacrificed",
      "This depends on how quickly the isolation happens"
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
      "Yes—this is an ideal design that adapts to network conditions",
      "No—you're confusing consistency levels with CAP. You can't switch between CP and AP; the choice is architectural",
      "Partially—this works only if you explicitly code fallback logic per operation",
      "Maybe—it depends on how long partitions typically last"
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
