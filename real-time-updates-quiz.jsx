import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, RotateCcw, Award, AlertTriangle, Zap, Brain, Target, Trophy, Timer, ArrowRight, BarChart3 } from "lucide-react";

const QUIZ_DATA = {
  title: "Real-time Updates: System Design Deep Dive",
  description: "Test your mastery of real-time communication patterns, networking protocols, and server-side push/pull architectures. These questions go beyond definitions — they require you to reason about trade-offs, failure modes, and architectural decisions at scale.",
  estimatedTime: "25-35 min",
  difficulty: "Very Hard",
  categories: [
    "Client-Server Protocols",
    "Server-Side Propagation",
    "Scaling & Infrastructure",
    "Trade-off Analysis",
    "Failure Modes & Edge Cases"
  ],
  questions: [
    {
      id: 1,
      category: "Client-Server Protocols",
      question: "You're designing a live sports scoreboard that serves 5 million concurrent viewers. Scores update every 30-60 seconds per game, and users only need to see scores (no chat or interaction). Your infrastructure team tells you their reverse proxies have inconsistent support for chunked transfer encoding. Which approach minimizes operational risk while meeting latency requirements?",
      options: [
        { label: "A", text: "WebSockets with a dedicated WebSocket gateway service" },
        { label: "B", text: "Simple polling every 5 seconds with HTTP keep-alive" },
        { label: "C", text: "SSE with fallback to long polling for incompatible proxies" },
        { label: "D", text: "Long polling with 30-second timeout intervals" }
      ],
      correct: 1,
      explanation: "Simple polling every 5 seconds with HTTP keep-alive is the best choice here. Scores update every 30-60 seconds, so 5-second polling gives sub-10s latency — perfectly acceptable for a scoreboard. HTTP keep-alive eliminates TCP handshake overhead on repeated polls. WebSockets (A) introduce massive complexity for a uni-directional, low-frequency update pattern. SSE (C) sounds tempting but the question explicitly states proxy issues with chunked encoding, which SSE depends on. Long polling (D) works but creates 5M concurrent held connections, which is harder to manage than stateless polling.",
      proTip: "In interviews, always ask: 'Does this actually need real-time?' A 5-second delay on a sports scoreboard is imperceptible to users. Choosing the simplest viable approach signals senior-level judgment."
    },
    {
      id: 2,
      category: "Client-Server Protocols",
      question: "Your team is building a collaborative whiteboard app where users draw, type, and move objects simultaneously. You need sub-100ms latency for cursor movements and drawing strokes. The app also needs to persist all changes to a central server. A junior engineer suggests using WebRTC for everything. What is the strongest counterargument?",
      options: [
        { label: "A", text: "WebRTC doesn't support binary data, only audio/video streams" },
        { label: "B", text: "Peer-to-peer topology creates O(n²) connections and doesn't solve the persistence requirement without a parallel server path" },
        { label: "C", text: "WebRTC has higher latency than WebSockets because of STUN/TURN overhead on every message" },
        { label: "D", text: "WebRTC is not supported in modern browsers and requires native plugins" }
      ],
      correct: 1,
      explanation: "The strongest counterargument is the O(n²) connection problem combined with the persistence gap. In a room with n users, full-mesh WebRTC requires n(n-1)/2 connections. At 20 users, that's 190 connections per room. More critically, WebRTC is peer-to-peer — changes don't automatically reach a server for persistence, so you'd still need a parallel WebSocket or HTTP path to the server, doubling your architecture complexity. Option A is wrong (WebRTC DataChannels support arbitrary data). Option C is wrong (STUN/TURN is only during setup, not per-message). Option D is wrong (WebRTC has broad modern browser support).",
      proTip: "When an interviewer pushes WebRTC, acknowledge its latency benefits for small groups but pivot to the scaling and persistence concerns. Canva uses WebRTC for presence sharing specifically because cursor positions don't need persistence — that's a key distinction."
    },
    {
      id: 3,
      category: "Server-Side Propagation",
      question: "You're designing a messaging system like WhatsApp. You've chosen WebSockets for client-server communication. For server-side update propagation, you're debating between consistent hashing and pub/sub. User A sends a message to User B. User B's WebSocket connection has just silently dropped (the server hasn't detected it yet). What happens differently in each architecture?",
      options: [
        { label: "A", text: "Consistent hashing detects the drop faster because the responsible server maintains heartbeats; pub/sub has no awareness of connection state" },
        { label: "B", text: "Both architectures behave identically — the message is lost in both cases until reconnection" },
        { label: "C", text: "Pub/sub delivers the message to the endpoint server which fails to forward it, and the pub/sub system has no awareness that delivery failed; consistent hashing routes to the owning server which can detect the dead connection and queue the message" },
        { label: "D", text: "Pub/sub automatically retries delivery because Kafka guarantees at-least-once semantics; consistent hashing drops the message permanently" }
      ],
      correct: 2,
      explanation: "With consistent hashing, the server that owns User B's connection has direct knowledge of that connection's state. When it detects the connection is dead (via heartbeat failure), it can queue messages for later delivery. With pub/sub, the message is published to User B's topic, the endpoint server receives it, but when it tries to forward over the dead WebSocket, the pub/sub system has no visibility into that failure. Option A's reasoning about faster detection isn't the key difference — it's about what happens after detection. Option B is wrong because consistent hashing gives the owning server more agency. Option D incorrectly assumes Kafka retries solve application-level delivery failures.",
      proTip: "This is a classic trade-off question. In your interview, frame it as: 'Consistent hashing gives us connection-aware routing at the cost of complexity, while pub/sub gives us simpler scaling at the cost of delivery visibility. For a chat app where message delivery guarantees matter, consistent hashing is worth the complexity.'"
    },
    {
      id: 4,
      category: "Scaling & Infrastructure",
      question: "You have 100 WebSocket endpoint servers behind an L4 load balancer, each handling ~50,000 persistent connections. Your team needs to deploy a critical security patch. The deployment strategy does rolling restarts (one server at a time). What is the most critical failure mode during this deployment?",
      options: [
        { label: "A", text: "The L4 load balancer will crash because it can't handle the connection metadata changes" },
        { label: "B", text: "When a server restarts, its 50K clients reconnect simultaneously, potentially overwhelming the remaining servers and creating a cascading failure ('thundering herd')" },
        { label: "C", text: "The security patch will be inconsistent across servers during the rollout, causing protocol version mismatches" },
        { label: "D", text: "TCP connections can't be reestablished through L4 load balancers after server restart" }
      ],
      correct: 1,
      explanation: "The thundering herd problem is the most critical failure mode. When one server drops 50K connections, those clients all try to reconnect immediately. The L4 load balancer distributes them across remaining servers, but this sudden spike can push other servers past their capacity, causing them to drop connections too — creating a cascading failure. Option A is wrong (L4 LBs are very lightweight). Option C might happen but isn't a 'failure mode' — protocol negotiation handles this. Option D is wrong (L4 LBs support new TCP connections to any healthy backend). The mitigation is implementing exponential backoff with jitter on client reconnection.",
      proTip: "Always mention 'exponential backoff with jitter' when discussing reconnection strategies. Without jitter, clients using the same backoff schedule will retry in synchronized waves, perpetuating the thundering herd."
    },
    {
      id: 5,
      category: "Trade-off Analysis",
      question: "You're designing a real-time stock trading dashboard (like Robinhood). Price ticks arrive at 100+ updates per second per symbol, and users watch 10-50 symbols simultaneously. An engineer proposes SSE over WebSockets because 'the data flow is only server-to-client.' Why might this reasoning be flawed for this specific use case?",
      options: [
        { label: "A", text: "SSE doesn't support JSON payloads, only plain text" },
        { label: "B", text: "At 1,000-5,000 updates/second per user, SSE's text-based protocol adds significant bandwidth overhead compared to WebSocket's binary framing, and browsers limit concurrent SSE connections per domain to ~6" },
        { label: "C", text: "SSE connections reset every 30 seconds, causing data gaps at high frequency" },
        { label: "D", text: "WebSockets are required because the client needs to send heartbeat packets to keep the connection alive" }
      ],
      correct: 1,
      explanation: "At high update frequencies (1,000-5,000 updates/sec per user), SSE's text-based event format (with 'data:', 'event:', and newline delimiters) adds substantial overhead per message compared to WebSocket's compact binary framing. Additionally, browsers limit concurrent HTTP connections per domain to about 6, and each SSE connection counts toward this limit. With potentially dozens of symbol streams, you'd exhaust the browser's connection budget. Option A is wrong (SSE supports any text including JSON). Option C is wrong (SSE connections persist; reconnection is client-controlled). Option D is wrong (WebSocket implementations handle keep-alive at the protocol level).",
      proTip: "The browser connection limit for SSE is an underrated constraint that many candidates miss. If your interviewer pushes back on WebSockets, mention this specific limitation — it shows you understand browser-level constraints, not just server architecture."
    },
    {
      id: 6,
      category: "Failure Modes & Edge Cases",
      question: "You're running a pub/sub-based real-time system with Redis Cluster as your pub/sub layer. You have 50 endpoint servers each maintaining 100K WebSocket connections. One of the Redis Cluster nodes fails. What is the immediate blast radius, and why?",
      options: [
        { label: "A", text: "All 5M connections drop because Redis Cluster uses a single-leader topology for pub/sub" },
        { label: "B", text: "Only the topics sharded to the failed node are affected; users subscribed to those topics stop receiving updates, but the many-to-many connection topology means every endpoint server is impacted" },
        { label: "C", text: "No impact — Redis Cluster automatically fails over pub/sub subscriptions within milliseconds" },
        { label: "D", text: "Only the endpoint servers directly connected to the failed node are affected; other servers continue normally" }
      ],
      correct: 1,
      explanation: "Redis Cluster shards keys (topics) across nodes. When one node fails, all topics on that shard stop working. Because pub/sub uses many-to-many connections between Redis nodes and endpoint servers, every endpoint server has subscriptions on the failed node. So the blast radius spans all 50 endpoint servers, but only for the subset of topics on the failed shard. Option A overstates the impact (only the affected shard's topics are lost). Option C understates it (Redis failover takes seconds, not milliseconds, and subscriptions need to be re-established). Option D misunderstands the topology — every endpoint server connects to every Redis node.",
      proTip: "When discussing Redis pub/sub in interviews, proactively mention the many-to-many connection topology and its failure implications. This shows you understand the operational reality, not just the happy path."
    },
    {
      id: 7,
      category: "Client-Server Protocols",
      question: "You're building a real-time collaborative document editor. Your system uses WebSockets terminated at a dedicated WebSocket gateway service. The gateway communicates with backend application servers via gRPC. A product manager asks why users sometimes see a 2-3 second delay when first opening a document, even though subsequent edits appear instantly. What's the most likely explanation?",
      options: [
        { label: "A", text: "WebSocket connections require a TCP handshake, then an HTTP upgrade handshake, then session authentication, then document state loading — all of which are sequential and add up" },
        { label: "B", text: "The browser is throttling WebSocket connections due to browser security policies" },
        { label: "C", text: "gRPC is slower than REST for initial requests due to protobuf serialization overhead" },
        { label: "D", text: "The WebSocket gateway is performing DNS resolution for each new connection" }
      ],
      correct: 0,
      explanation: "The initial connection involves multiple sequential round trips: TCP three-way handshake (~1 RTT), TLS handshake (~1-2 RTTs for TLS 1.2), HTTP upgrade to WebSocket (~1 RTT), authentication token validation, and document state loading from the backend. Each step must complete before the next begins. Once established, the persistent connection eliminates all this overhead for subsequent messages. Option B is wrong (browsers don't throttle individual WebSocket connections). Option C is wrong (protobuf is actually faster to serialize than JSON). Option D is wrong (DNS is cached and not per-connection).",
      proTip: "In an interview, sketch out the connection timeline on the whiteboard: 'TCP → TLS → HTTP Upgrade → Auth → State Load. That's 4-5 sequential round trips before the first byte of document data.' Then propose mitigations: connection pre-warming, session resumption, or optimistic UI rendering."
    },
    {
      id: 8,
      category: "Scaling & Infrastructure",
      question: "You're scaling a WhatsApp-like messaging system to 500M concurrent users. Your current architecture uses consistent hashing to route WebSocket connections to specific servers. You realize that some 'celebrity' users have millions of followers and when they update their status, the server owning their connection becomes a hotspot. How do you address this without abandoning consistent hashing entirely?",
      options: [
        { label: "A", text: "Add virtual nodes to the hash ring to distribute celebrity users across more servers" },
        { label: "B", text: "Use consistent hashing for connection management but offload fan-out to a separate pub/sub layer — the owning server publishes the update, and the pub/sub system handles distribution to all follower servers" },
        { label: "C", text: "Rate-limit celebrity status updates to prevent hotspots" },
        { label: "D", text: "Replicate the celebrity user's connection to multiple servers so the load is shared" }
      ],
      correct: 1,
      explanation: "The hybrid approach separates concerns: consistent hashing manages which server owns a user's connection (good for connection state), while pub/sub handles fan-out (good for broadcast). The celebrity's owning server publishes a single message to the pub/sub system, which then distributes it to all servers with connected followers. This keeps the owning server's load O(1) for publishing instead of O(followers). Option A doesn't help — virtual nodes redistribute users across servers, but the celebrity's fan-out still originates from one place. Option C is a product compromise, not an architectural solution. Option D is nonsensical — you can't replicate a WebSocket connection.",
      proTip: "The pattern of 'consistent hashing for connection ownership + pub/sub for fan-out' is extremely common in production systems. In an interview, proactively suggest this hybrid: it shows you understand that no single approach solves all problems."
    },
    {
      id: 9,
      category: "Trade-off Analysis",
      question: "You're designing an Uber-like ride-matching system. Drivers send location updates every 3 seconds. Riders need to see nearby available drivers in near-real-time. An architect proposes: drivers push updates via WebSockets → updates go to a Redis pub/sub channel per geohash region → rider apps subscribe to relevant geohash channels via SSE. What's the most significant flaw in this design?",
      options: [
        { label: "A", text: "SSE can't handle the update volume from driver location changes" },
        { label: "B", text: "Drivers frequently cross geohash boundaries, requiring constant channel subscription changes on the pub/sub layer, creating excessive subscribe/unsubscribe churn that degrades Redis performance" },
        { label: "C", text: "WebSockets can't send GPS coordinates with sufficient precision" },
        { label: "D", text: "Redis pub/sub doesn't support geographic queries, so you can't filter by geohash" }
      ],
      correct: 1,
      explanation: "The fundamental flaw is subscription churn. A driver moving through a city crosses geohash boundaries frequently (every few blocks at fine granularity). Each crossing means unsubscribing from one channel and subscribing to another on Redis. With millions of drivers, this creates enormous subscribe/unsubscribe traffic on Redis. Similarly, riders' subscriptions change as they move. A better approach: drivers push to a central location service that maintains an in-memory spatial index (like a quadtree), and rider apps poll or subscribe to a personalized feed. Option A is wrong (SSE can handle this volume). Option C is nonsensical. Option D is misleading — Redis pub/sub channels are just string keys; the geohash channel naming convention works fine for publishing, but the churn is the problem.",
      proTip: "When you see a 'pub/sub per geographic region' proposal, immediately think about boundary-crossing frequency. This is a pattern that works at coarse granularity (city-level dashboards) but breaks at fine granularity (block-level driver matching)."
    },
    {
      id: 10,
      category: "Failure Modes & Edge Cases",
      question: "Your real-time chat system uses WebSockets with consistent hashing. During a scaling event, you're adding 10 new servers to the hash ring (going from 50 to 60). The system records both old and new assignments and begins migrating connections. A message is sent to User X during the migration window. What specific race condition can cause message loss, and which mitigation is correct?",
      options: [
        { label: "A", text: "User X's old server has closed the connection but the new server hasn't registered it yet; mitigate by dual-writing messages to both old and new servers during migration" },
        { label: "B", text: "The hash function produces different results on old vs new servers; mitigate by using a central routing table instead of local computation" },
        { label: "C", text: "User X reconnects to the new server but the old server's in-memory message queue hasn't been transferred; mitigate by persisting all queued messages to a durable store before initiating migration" },
        { label: "D", text: "The load balancer routes the message to a random server that doesn't own User X; mitigate by using sticky sessions" }
      ],
      correct: 0,
      explanation: "During migration, there's a window where User X's connection on the old server is being torn down while the new server hasn't established a connection yet. Any message sent during this gap targets a server that can no longer deliver it. The correct mitigation is dual-writing: during the migration window, messages for affected users are sent to both the old and new owning servers. The server that has the active connection delivers it; the other discards it. Option C describes a real concern but the question asks about the race condition during live migration, not queue transfer. Option B is wrong — consistent hashing is deterministic given the same ring state. Option D misunderstands how consistent hashing works with internal routing.",
      proTip: "In interviews, when discussing any stateful migration (consistent hashing, shard rebalancing, etc.), always mention the dual-write pattern during transition. It shows you understand that migrations are never atomic and you've thought about the gap."
    },
    {
      id: 11,
      category: "Client-Server Protocols",
      question: "You're building a real-time multiplayer game server. Your networking engineer says: 'We should use WebSockets over TCP for game state updates.' Another engineer argues: 'We should use WebRTC DataChannels which can run over UDP.' The game involves fast-paced action where a dropped position update is immediately superseded by the next one. Which engineer is right, and what's the key technical reason?",
      options: [
        { label: "A", text: "WebSocket engineer is right because TCP's reliability guarantees prevent data corruption in game state" },
        { label: "B", text: "WebRTC engineer is right because UDP avoids TCP's head-of-line blocking problem — with TCP, a single dropped packet stalls ALL subsequent packets until retransmission completes, adding latency spikes to updates that are already stale" },
        { label: "C", text: "WebSocket engineer is right because WebRTC DataChannels have too much encryption overhead for game traffic" },
        { label: "D", text: "WebRTC engineer is right because peer-to-peer reduces server costs, which is the primary concern for game servers" }
      ],
      correct: 1,
      explanation: "The WebRTC engineer is right for the key reason of TCP head-of-line blocking. With TCP, if packet N is lost, packets N+1, N+2, etc. are buffered and cannot be delivered to the application until packet N is retransmitted and received — even though those later packets contain newer, more relevant game state. With UDP (via WebRTC DataChannels configured for unreliable delivery), each packet is independent. If one is lost, later packets still arrive immediately. For a fast-paced game where position updates supersede each other, this is critical. Option A's concern about corruption is handled by checksums at the UDP level. Option C is wrong (both WebSockets and WebRTC use encryption). Option D misidentifies the benefit — it's about latency, not cost.",
      proTip: "Head-of-line blocking is one of the most important concepts in real-time networking. Mention it whenever discussing TCP vs UDP trade-offs — it shows deep protocol understanding beyond surface-level 'TCP is reliable, UDP is fast.'"
    },
    {
      id: 12,
      category: "Server-Side Propagation",
      question: "You're designing a live auction system (like eBay live auctions). Bids must be processed in strict order, and all participants must see the same bid sequence. You have 10 auction servers behind a load balancer. Which server-side propagation strategy ensures correct bid ordering with minimal latency?",
      options: [
        { label: "A", text: "Pub/sub with Redis Cluster, using one topic per auction — Redis preserves publish order within a topic" },
        { label: "B", text: "Consistent hashing to assign each auction to a single server — all bids for an auction flow through one server which establishes total ordering, then broadcasts via pub/sub" },
        { label: "C", text: "Distributed consensus (Raft/Paxos) across all 10 servers for every bid to ensure global ordering" },
        { label: "D", text: "Vector clocks on each server to establish causal ordering of bids across the distributed system" }
      ],
      correct: 1,
      explanation: "Consistent hashing to assign each auction to a single owning server gives you a natural serialization point. All bids for auction X route to server Y, which processes them sequentially (establishing total order), then publishes the ordered bid stream via pub/sub to all endpoint servers for fan-out to viewers. Option A sounds plausible but Redis pub/sub doesn't guarantee delivery order to all subscribers in a distributed setup — network delays between Redis and different endpoint servers can reorder messages. Option C is correct but massively over-engineered — consensus across 10 nodes for every bid adds unacceptable latency. Option D provides causal ordering, not total ordering — concurrent bids would be unordered.",
      proTip: "For strict ordering requirements in interviews, the simplest pattern is: funnel all related writes through a single partition/server. Mention that this trades horizontal scalability for ordering guarantees, and explain that individual auctions don't need horizontal scale — the system scales by distributing different auctions across servers."
    },
    {
      id: 13,
      category: "Scaling & Infrastructure",
      question: "Your team uses an L7 load balancer for their HTTP services and wants to add WebSocket support to their architecture. The L7 load balancer can be configured to support WebSocket upgrade requests. A senior engineer argues you should use a separate L4 load balancer for WebSocket traffic instead. What is the strongest technical justification for this position?",
      options: [
        { label: "A", text: "L7 load balancers terminate and re-establish TCP connections, adding latency to every WebSocket frame and preventing true persistent end-to-end connections between client and server" },
        { label: "B", text: "L7 load balancers can't parse WebSocket frame headers, so they'll corrupt the data" },
        { label: "C", text: "L4 load balancers are cheaper to operate than L7 load balancers" },
        { label: "D", text: "L7 load balancers don't support the HTTP Upgrade header required for WebSocket handshakes" }
      ],
      correct: 0,
      explanation: "L7 load balancers fundamentally operate by terminating incoming connections and creating new ones to backends. For HTTP request-response, this is transparent — each request can route independently. But WebSockets require a persistent, long-lived connection. With an L7 LB, you have two separate TCP connections (client↔LB and LB↔backend), meaning the LB must maintain state for every active WebSocket and proxy every frame. An L4 LB simply forwards TCP packets, maintaining a true end-to-end connection with less overhead. Option B is wrong (many L7 LBs do support WebSocket). Option C might be true but isn't the technical justification. Option D is wrong (modern L7 LBs support Upgrade).",
      proTip: "In interviews, draw the connection topology: 'With L7, every WebSocket frame traverses two TCP connections through the LB. With L4, it's a single end-to-end TCP connection. At 100K concurrent WebSockets, that's 100K stateful sessions the L7 LB must manage and proxy through.'"
    },
    {
      id: 14,
      category: "Trade-off Analysis",
      question: "You're designing a system like Google Docs. You've decided to use WebSockets for real-time collaboration and consistent hashing to route all connections for a given document to the same server. Each server holds the document's operational transform (OT) state in memory. Your system gets acquired and now needs to support documents with 500+ simultaneous editors (previously max was 20). What breaks first?",
      options: [
        { label: "A", text: "The WebSocket framing protocol can't handle messages from 500 concurrent senders" },
        { label: "B", text: "The single server owning the document becomes a CPU bottleneck — OT conflict resolution is O(n) per operation where n is concurrent operations, so 500 editors generating edits creates quadratic computational growth that one server can't handle" },
        { label: "C", text: "The consistent hash ring can't accommodate documents with high editor counts" },
        { label: "D", text: "DNS resolution slows down because too many users are resolving the same document URL" }
      ],
      correct: 1,
      explanation: "With consistent hashing, one server owns the entire document state and must process all OT operations. Each incoming edit must be transformed against all other concurrent, unacknowledged edits. With 500 editors typing simultaneously, the number of concurrent operations explodes, and each new operation requires transformation against all pending ones — creating quadratic growth in CPU usage on that single server. This is the architectural bottleneck. Option A is wrong (WebSocket has no sender limit). Option C is wrong (consistent hashing is per-document, not per-editor). Option D is nonsensical for this scenario. The fix involves either sharding the document or switching to CRDTs which can handle concurrent edits without a central coordinator.",
      proTip: "When an interviewer asks 'what breaks at 10x scale,' think about computational complexity, not just throughput. OT at a single server is O(n²) in concurrent editors — that's the insight that separates staff-level answers from senior-level ones."
    },
    {
      id: 15,
      category: "Failure Modes & Edge Cases",
      question: "Your real-time notification system uses SSE to push updates from server to client. A user reports that they stop receiving notifications after exactly 2 minutes, even though the server logs show events are still being published. The user's browser DevTools show the SSE connection as 'open.' What is the most likely root cause?",
      options: [
        { label: "A", text: "The browser's EventSource object has a built-in 2-minute timeout that disconnects idle SSE streams" },
        { label: "B", text: "An intermediate proxy or CDN is buffering the chunked response and has a 2-minute buffer timeout — it's collecting SSE events but not forwarding them until the buffer fills or times out" },
        { label: "C", text: "The server's garbage collector is pausing for exactly 2 minutes and dropping the connection" },
        { label: "D", text: "SSE has a protocol-level maximum connection duration of 2 minutes defined in the W3C specification" }
      ],
      correct: 1,
      explanation: "This is the classic SSE proxy buffering problem. Intermediate proxies, CDNs, or reverse proxies that don't understand chunked transfer encoding will buffer the response body, waiting for it to complete or for a buffer timeout. The connection appears 'open' in DevTools because the TCP connection is alive — it's the proxy that's holding the data. After 2 minutes (a common default timeout), the proxy may flush or reset. This is notoriously hard to debug because everything looks correct at both the client and server. Option A is wrong (EventSource has no such timeout). Option C is absurdly unlikely. Option D is fabricated — no such spec limit exists.",
      proTip: "If you mention SSE in an interview and then proactively say 'One gotcha with SSE is that intermediate proxies can buffer chunked responses, silently breaking the stream — this is why some teams prefer WebSockets despite SSE being simpler,' you'll demonstrate real production experience."
    },
    {
      id: 16,
      category: "Server-Side Propagation",
      question: "You're building a real-time feed system. You have 200 endpoint servers, each with ~50K WebSocket connections, and a Redis Cluster with 6 nodes for pub/sub. Each endpoint server must subscribe to topics on every Redis node (many-to-many). A new requirement comes in: the system must support 1 million distinct topics. What is the primary scaling concern?",
      options: [
        { label: "A", text: "Redis can't store 1 million keys across 6 nodes" },
        { label: "B", text: "Each of the 200 endpoint servers subscribes to a fraction of 1M topics across all 6 Redis nodes, creating up to 200 × 1M = 200M subscription relationships that consume memory on Redis and file descriptors on the endpoint servers" },
        { label: "C", text: "1 million topics will cause hash collisions in the Redis Cluster's key distribution" },
        { label: "D", text: "Pub/sub messages will be too slow because Redis processes them single-threaded" }
      ],
      correct: 1,
      explanation: "The many-to-many topology is the scaling bottleneck. Each endpoint server potentially subscribes to topics distributed across all 6 Redis nodes. With 1M topics and 200 servers, the subscription cardinality becomes massive. Redis must track which connections are subscribed to which topics, and each subscription consumes memory. On the endpoint side, maintaining subscriptions across 6 Redis nodes requires persistent connections and state management. Option A is wrong (Redis can handle millions of keys easily). Option C is wrong (Redis Cluster handles key distribution via CRC16 hash slots). Option D is partially true (Redis is single-threaded) but isn't the primary concern — pub/sub message delivery is fast per-message; it's the subscription state that's the bottleneck.",
      proTip: "In interviews, when someone proposes 'a topic per user' or 'a topic per entity,' immediately estimate the subscription cardinality: topics × subscribers. If it exceeds millions, discuss sharding strategies or alternative architectures like consistent hashing."
    },
    {
      id: 17,
      category: "Trade-off Analysis",
      question: "You're designing a live comments system for a streaming platform like Twitch. During a popular stream, 200K viewers are watching and comments arrive at 500/second. Each viewer needs to see comments in real-time. A candidate proposes: 'Use WebSockets, create one pub/sub topic per stream, publish every comment to the topic, and fan out to all 200K connected users.' What will actually happen?",
      options: [
        { label: "A", text: "The system works fine — 500 messages/second × 200K subscribers = 100M message deliveries/second is within normal pub/sub throughput" },
        { label: "B", text: "The fan-out creates 100M message deliveries/second which will overwhelm both the pub/sub layer and the endpoint servers' network bandwidth; the solution requires hierarchical aggregation — batch comments into windows (e.g., every 100ms) and send digests instead of individual messages" },
        { label: "C", text: "WebSockets can't handle 500 inbound messages per second per connection" },
        { label: "D", text: "The bottleneck is the database write speed for persisting comments, not the fan-out" }
      ],
      correct: 1,
      explanation: "500 comments/sec × 200K subscribers = 100M message deliveries per second. Even if each message is only 200 bytes, that's 20 GB/s of network bandwidth just for comment delivery. No single pub/sub cluster handles this gracefully. The solution is hierarchical aggregation: batch comments into time windows (every 100-200ms), aggregate them into a single payload per batch, and send one message to each subscriber containing multiple comments. This reduces fan-out by 50-100x while maintaining a 'live' feel. Option A dramatically underestimates the scale. Option C confuses inbound with outbound (500/sec is fine per connection). Option D might be true separately but isn't the real-time delivery bottleneck.",
      proTip: "The 'batching + hierarchical aggregation' pattern is essential for any high-fan-out system. In your interview, propose it immediately when you see large viewer counts combined with high update rates. Calculate the multiplication out loud: 'That's X messages times Y subscribers equals Z deliveries per second — we need to batch.'"
    },
    {
      id: 18,
      category: "Client-Server Protocols",
      question: "Your team is debating whether to use SSE or WebSockets for a real-time dashboard that displays 15 different metric streams simultaneously. The dashboard is read-only (no user interactions sent to server). A frontend engineer raises a concern about SSE. Which concern is valid and would tip the decision toward WebSockets?",
      options: [
        { label: "A", text: "SSE can only transmit plain text, but metric data needs to be sent as binary for efficiency" },
        { label: "B", text: "With HTTP/1.1, each SSE stream requires a separate TCP connection, and browsers limit concurrent connections to ~6 per domain — 15 streams would exceed this limit, whereas a single WebSocket can multiplex all 15 streams over one connection" },
        { label: "C", text: "SSE doesn't support authentication headers, so the dashboard metrics would be publicly accessible" },
        { label: "D", text: "SSE streams can't be individually closed without closing all other streams from the same domain" }
      ],
      correct: 1,
      explanation: "Under HTTP/1.1, each SSE connection consumes one of the browser's ~6 concurrent connections per domain. With 15 metric streams each needing their own SSE endpoint, you'd exceed this limit — streams would queue and fail to connect. A single WebSocket connection can multiplex all 15 data streams using message-level routing (e.g., a 'stream_id' field in each message). Note: HTTP/2 multiplexes streams over a single TCP connection, which mitigates this issue, but not all infrastructure supports HTTP/2 SSE. Option A is wrong (SSE supports JSON text, which is fine for metrics). Option C is wrong (SSE supports cookies and initial request headers). Option D is wrong (each EventSource can be closed independently).",
      proTip: "The browser connection limit is the SSE 'gotcha' that experienced engineers know about. If HTTP/2 is available end-to-end (including all proxies), SSE becomes viable for multiple streams. Mention this nuance: 'With HTTP/2, SSE's connection limit isn't an issue, but we'd need to verify our entire proxy chain supports it.'"
    },
    {
      id: 19,
      category: "Scaling & Infrastructure",
      question: "You're operating a WebSocket service with consistent hashing. Your monitoring shows that during peak hours, 5 out of 50 servers are at 90%+ CPU while others sit at 30%. Virtual nodes haven't helped. What is the most likely explanation AND the correct fix?",
      options: [
        { label: "A", text: "The hash function has poor distribution; fix by switching to a better hash function like xxHash" },
        { label: "B", text: "Certain high-activity users (e.g., popular chat rooms, active document editors) are hashed to those servers, and their connections consume disproportionate CPU because of message fan-out or computation — fix by splitting hot entities across multiple servers using sub-sharding" },
        { label: "C", text: "The servers have different hardware specs causing uneven performance; fix by using homogeneous hardware" },
        { label: "D", text: "The L4 load balancer is misconfigured and sending too many connections to those 5 servers; fix by reconfiguring the load balancer" }
      ],
      correct: 1,
      explanation: "With consistent hashing, the issue isn't connection count (virtual nodes address that) — it's that some entities are inherently 'hotter' than others. A chat room with 10,000 active users on one server generates far more CPU load than 10,000 idle connections on another. The fix is sub-sharding: break hot entities across multiple servers (e.g., partition a popular chat room's message processing across several servers while maintaining a coordinator). Option A is unlikely if virtual nodes are already implemented (distribution should be fairly even). Option C is possible but unlikely in a cloud environment. Option D misunderstands consistent hashing — the LB doesn't know about the hash ring.",
      proTip: "In interviews, distinguish between 'hot connections' (many connections) and 'hot entities' (high activity per connection). Virtual nodes solve the first problem. Sub-sharding or offloading computation to worker pools solves the second. Showing this distinction demonstrates deep operational understanding."
    },
    {
      id: 20,
      category: "Failure Modes & Edge Cases",
      question: "Your chat application uses WebSockets + pub/sub (Redis). User A sends a message to a group chat with 50 members. The message is published to Redis successfully. However, 3 of the 50 members never receive the message, even though their WebSocket connections are healthy and they receive subsequent messages fine. All servers are healthy. What is the most likely cause?",
      options: [
        { label: "A", text: "Redis pub/sub dropped the message due to memory pressure — pub/sub in Redis has no persistence or delivery guarantees; those 3 members' endpoint servers may have had momentary subscriber disconnects from Redis during a network blip, missing the publish event entirely" },
        { label: "B", text: "The 3 members' browsers had JavaScript event loops blocked by heavy rendering, causing the WebSocket onmessage handler to miss the frame" },
        { label: "C", text: "TCP guarantees delivery so this scenario is impossible — if the WebSocket is connected, the message must arrive" },
        { label: "D", text: "The message exceeded Redis's maximum pub/sub message size and was silently truncated for some subscribers" }
      ],
      correct: 0,
      explanation: "Redis pub/sub is fire-and-forget with zero persistence. If a subscriber isn't connected at the exact moment of publish, the message is gone forever. Those 3 members' endpoint servers likely experienced a brief Redis connection blip (even a few milliseconds) during which the publish occurred. Since pub/sub has no replay mechanism, the message was lost for those subscribers. Subsequent messages arrive fine because the connection was re-established. Option B is wrong (WebSocket frames are buffered by the browser, not dropped by JS execution). Option C is wrong (TCP guarantees delivery on a single connection, but the issue is between Redis and the endpoint server, not the WebSocket). Option D is fabricated behavior.",
      proTip: "Always mention Redis pub/sub's lack of delivery guarantees in interviews. For systems requiring reliable delivery, propose Redis Streams or Kafka instead, which support consumer groups and message replay. Say: 'Redis pub/sub is great for best-effort fan-out, but for guaranteed delivery I'd use Redis Streams with consumer groups.'"
    }
  ]
};

const GRADES = [
  { min: 90, label: "Staff-Ready", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", icon: Trophy, desc: "Exceptional depth. You'd nail the real-time updates portion of any system design interview." },
  { min: 75, label: "Senior-Level", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", icon: Award, desc: "Strong understanding with minor gaps. Focus on the areas you missed." },
  { min: 55, label: "Mid-Level", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", icon: Target, desc: "Good foundation but trade-off reasoning needs work. Review failure modes and scaling sections." },
  { min: 0, label: "Needs Review", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", icon: AlertTriangle, desc: "Revisit the fundamentals. Focus on understanding WHY each protocol exists and its specific constraints." }
];

function getGrade(pct) {
  return GRADES.find(g => pct >= g.min);
}

function LandingScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap size={14} />
            {QUIZ_DATA.difficulty}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            {QUIZ_DATA.title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
            {QUIZ_DATA.description}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{QUIZ_DATA.questions.length}</div>
              <div className="text-xs text-gray-500 mt-1">Questions</div>
            </div>
            <div className="text-center border-x border-gray-800">
              <div className="text-2xl font-bold text-white">{QUIZ_DATA.estimatedTime}</div>
              <div className="text-xs text-gray-500 mt-1">Est. Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">SDE2+</div>
              <div className="text-xs text-gray-500 mt-1">Target Level</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories Covered</div>
            <div className="flex flex-wrap gap-2">
              {QUIZ_DATA.categories.map((cat, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          Start Quiz
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function QuestionScreen({ question, questionIndex, total, score, onAnswer, selectedAnswer, showFeedback, onNext, timer }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Question <span className="text-white font-semibold">{questionIndex + 1}</span> of {total}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                <Timer size={14} className="text-gray-500" />
                <span className={`font-mono font-semibold ${timer <= 10 ? "text-red-400" : "text-gray-300"}`}>
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-white font-semibold">{score}</span>
                <span className="text-gray-500">/ {questionIndex + (showFeedback ? 1 : 0)}</span>
              </div>
            </div>
          </div>
          <ProgressBar current={questionIndex + (showFeedback ? 1 : 0)} total={total} />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="max-w-3xl w-full">
          <div className="mb-6">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-4">
              {question.category}
            </span>
            <h2 className="text-xl text-white leading-relaxed font-medium">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {question.options.map((opt, i) => {
              let cardStyle = "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/80 cursor-pointer";
              if (showFeedback) {
                if (i === question.correct) {
                  cardStyle = "bg-emerald-500/10 border-emerald-500/40";
                } else if (i === selectedAnswer && i !== question.correct) {
                  cardStyle = "bg-red-500/10 border-red-500/40";
                } else {
                  cardStyle = "bg-gray-900/50 border-gray-800/50 opacity-50";
                }
              } else if (selectedAnswer === i) {
                cardStyle = "bg-blue-500/10 border-blue-500/40";
              }

              return (
                <button
                  key={i}
                  onClick={() => !showFeedback && onAnswer(i)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${cardStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${
                      showFeedback && i === question.correct ? "bg-emerald-500 text-white" :
                      showFeedback && i === selectedAnswer && i !== question.correct ? "bg-red-500 text-white" :
                      "bg-gray-800 text-gray-400"
                    }`}>
                      {opt.label}
                    </span>
                    <span className={`text-sm leading-relaxed ${
                      showFeedback && (i === question.correct || i === selectedAnswer) ? "text-white" : "text-gray-300"
                    }`}>
                      {opt.text}
                    </span>
                    {showFeedback && i === question.correct && (
                      <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5 ml-auto" />
                    )}
                    {showFeedback && i === selectedAnswer && i !== question.correct && (
                      <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="space-y-4 mb-8 animate-fadeIn">
              <div className={`p-4 rounded-xl border ${
                selectedAnswer === question.correct
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === question.correct ? (
                    <CheckCircle size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <span className={`text-sm font-semibold ${
                    selectedAnswer === question.correct ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {selectedAnswer === question.correct ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {question.explanation}
                </p>
              </div>

              {question.proTip && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Interview Insight</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {question.proTip}
                  </p>
                </div>
              )}

              <button
                onClick={onNext}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {questionIndex < total - 1 ? "Next Question" : "See Results"}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ score, total, answers, questions, onRestart }) {
  const pct = Math.round((score / total) * 100);
  const grade = getGrade(pct);
  const GradeIcon = grade.icon;

  const categoryScores = {};
  questions.forEach((q, i) => {
    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { correct: 0, total: 0 };
    }
    categoryScores[q.category].total++;
    if (answers[i] === q.correct) {
      categoryScores[q.category].correct++;
    }
  });

  const incorrect = questions
    .map((q, i) => ({ ...q, index: i, userAnswer: answers[i] }))
    .filter(q => q.userAnswer !== q.correct);

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${grade.bg} ${grade.border} border mb-4`}>
            <GradeIcon size={36} className={grade.color} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{score} / {total}</h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${grade.bg} ${grade.border} border ${grade.color} mb-3`}>
            {grade.label} — {pct}%
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto">{grade.desc}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Category Breakdown</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryScores).map(([cat, data]) => {
              const catPct = Math.round((data.correct / data.total) * 100);
              let barColor = "bg-emerald-500";
              if (catPct < 50) barColor = "bg-red-500";
              else if (catPct < 75) barColor = "bg-amber-500";
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{cat}</span>
                    <span className="text-sm font-semibold text-gray-400">{data.correct}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {incorrect.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Review Incorrect ({incorrect.length})
              </h3>
            </div>
            <div className="space-y-4">
              {incorrect.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-700 text-gray-400 text-xs font-mono flex-shrink-0">
                      Q{q.index + 1}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                      {q.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{q.question}</p>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2 text-sm">
                      <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-red-300">Your answer: <span className="text-red-400 font-medium">{q.options[q.userAnswer].label}. {q.options[q.userAnswer].text}</span></span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-300">Correct: <span className="text-emerald-400 font-medium">{q.options[q.correct].label}. {q.options[q.correct].text}</span></span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

export default function RealTimeUpdatesQuiz() {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(90);
  const timerRef = useRef(null);

  const questions = QUIZ_DATA.questions;

  const startTimer = useCallback(() => {
    setTimer(90);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleStart = () => {
    setScreen("quiz");
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    startTimer();
  };

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);
    stopTimer();
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      startTimer();
    } else {
      setScreen("results");
      stopTimer();
    }
  };

  if (screen === "landing") {
    return <LandingScreen onStart={handleStart} />;
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        score={score}
        total={questions.length}
        answers={answers}
        questions={questions}
        onRestart={handleStart}
      />
    );
  }

  return (
    <QuestionScreen
      question={questions[currentQ]}
      questionIndex={currentQ}
      total={questions.length}
      score={score}
      onAnswer={handleAnswer}
      selectedAnswer={selectedAnswer}
      showFeedback={showFeedback}
      onNext={handleNext}
      timer={timer}
    />
  );
}
