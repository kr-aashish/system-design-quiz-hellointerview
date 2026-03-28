// === COVERAGE MANIFEST ===
// Content type: broad survey (networking fundamentals)
//
// HEAVY subtopics:
// TCP vs UDP — Questions: 4 — IDs: [q1, q2, q3, q4]
// HTTP/HTTPS — Questions: 4 — IDs: [q5, q6, q7, q8]
// Load Balancing (Dedicated) — Questions: 4 — IDs: [q9, q10, q11, q12]
// WebSockets — Questions: 3 — IDs: [q13, q14, q15]
// Failure Handling — Questions: 4 — IDs: [q16, q17, q18, q19]
//
// MEDIUM subtopics:
// REST API Design — Questions: 2 — IDs: [q20, q21]
// gRPC/Protocol Buffers — Questions: 2 — IDs: [q22, q23]
// SSE — Questions: 2 — IDs: [q24, q25]
// WebRTC — Questions: 2 — IDs: [q26, q27]
// Client-Side Load Balancing — Questions: 2 — IDs: [q28, q29]
// Regionalization & Latency — Questions: 2 — IDs: [q30, q31]
// GraphQL — Questions: 2 — IDs: [q32, q33]
//
// THIN subtopics:
// Vertical vs Horizontal Scaling — Questions: 1 — IDs: [q34]
// Application Layer (User vs Kernel Space) — Questions: 1 — IDs: [q35]
// Cluster: OSI Layers + Web Request Lifecycle — Questions: 1 — IDs: [q36]
// Cluster: IP/Network Layer + DNS — Questions: 1 — IDs: [q37]
//
// CROSS-SUBTOPIC bridges:
// WebSockets × L4/L7 Load Balancing — IDs: [q38]
// SSE × Proxy/Infrastructure — IDs: [q39]
// gRPC × REST (internal vs external) — IDs: [q40]
// Circuit Breakers × Retries/Backoff — IDs: [q41]
// CDN × HTTP Caching × Regionalization — IDs: [q42]
//
// Total: 42 questions across 18 subtopics
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, CheckCircle, XCircle, ChevronRight, RotateCcw, Award, AlertTriangle, Zap, Brain, Target, Trophy, Timer, ArrowRight, BarChart3 } from "lucide-react";

const QUIZ_DATA = {
  title: "Networking Essentials: System Design Deep Dive",
  description: "Master networking protocols, load balancing, failure handling, and architectural trade-offs. These 42 questions require reasoning about TCP vs UDP, HTTP semantics, distributed systems, and real-world operational constraints.",
  estimatedTime: "~52 min",
  difficulty: "FAANG SDE2 — Very Hard",
  categories: [
    "TCP vs UDP",
    "HTTP/HTTPS",
    "Load Balancing",
    "WebSockets",
    "Failure Handling",
    "REST API Design",
    "gRPC/Protobuf",
    "Server-Sent Events",
    "WebRTC",
    "Client-Side LB",
    "Regionalization",
    "GraphQL",
    "Scaling Strategy",
    "Network Stack"
  ],
  questions: [
    {
      id: "q1",
      category: "TCP vs UDP",
      question: "You're designing a telemetry ingestion service that receives 500K metrics/second from 10K IoT sensors. Sensors report temperature readings every 100ms. Occasional data loss (up to 2%) is acceptable, but the pipeline must never back-pressure sensors. Which transport protocol and why?",
      options: [
        { label: "A", text: "TCP with large receive buffers — guaranteed delivery prevents data gaps in analytics" },
        { label: "B", text: "UDP — connectionless delivery avoids back-pressure from flow/congestion control, and 2% loss is acceptable for aggregate telemetry" },
        { label: "C", text: "TCP with keep-alive — persistent connections reduce handshake overhead for high-frequency sends" },
        { label: "D", text: "QUIC — modern protocol gives TCP-like reliability without congestion control" }
      ],
      correct: 1,
      explanation: "UDP's connectionless nature means sensors fire-and-forget without waiting for ACKs. TCP's flow control and congestion control mechanisms would throttle sensors when the server is slow, creating back-pressure. QUIC still has congestion control. TCP with large buffers doesn't eliminate back-pressure, just delays it. This is why telemetry systems like StatsD and collectd use UDP — the operational simplicity of 'always-sendable' sensors outweighs the small data loss.",
      interviewScript: "In your interview, say: 'For high-volume telemetry where occasional loss is acceptable, UDP eliminates the back-pressure risk from TCP's flow and congestion control. The sensors can always send without blocking, and we handle the 2% loss in our aggregation layer.'",
      proTip: "Mention that many real telemetry systems (StatsD, collectd) use UDP precisely for this reason — the operational simplicity of 'always-sendable' sensors outweighs the small data loss."
    },
    {
      id: "q2",
      category: "TCP vs UDP",
      question: "A multiplayer game uses TCP for game state synchronization. During a network congestion event, players experience a 3-second freeze followed by a burst of rapid movements. What TCP mechanism causes this specific behavior pattern?",
      options: [
        { label: "A", text: "The TCP three-way handshake is being re-executed due to connection timeout" },
        { label: "B", text: "TCP's congestion control reduced the send window to near-zero, buffering packets; when congestion clears, all buffered packets deliver in a burst" },
        { label: "C", text: "TCP's checksum validation is rejecting corrupted packets, causing retransmission delays" },
        { label: "D", text: "The server's health check failed and the load balancer is rerouting to a new server" }
      ],
      correct: 1,
      explanation: "TCP's congestion control (e.g., TCP slow start, AIMD) reduces the congestion window when packet loss is detected. During congestion, the sender can barely transmit, so game state updates buffer. When congestion clears, the window rapidly opens and all buffered updates deliver at once, causing the 'teleporting' effect. This is exactly why games often prefer UDP.",
      interviewScript: "In your interview, say: 'TCP's congestion control throttles the sender during network congestion, buffering game state updates. When congestion clears, the burst of accumulated updates creates the freeze-then-teleport pattern. This is a textbook reason competitive games use UDP with application-level reliability.'",
      proTip: "This freeze-burst pattern is called 'head-of-line blocking' at the transport layer. It's one of the problems QUIC solves with independent stream multiplexing."
    },
    {
      id: "q3",
      category: "TCP vs UDP",
      question: "You're building a real-time collaborative document editor (like Google Docs). Users type and see each other's cursors. A teammate argues for UDP because 'we need low latency.' What's the strongest counter-argument?",
      options: [
        { label: "A", text: "UDP doesn't support multiplexing, so you can't have multiple streams per connection" },
        { label: "B", text: "Document edits require guaranteed ordered delivery to maintain consistency — a dropped or reordered operation corrupts the document state, and rebuilding TCP-like reliability on UDP is significant engineering overhead" },
        { label: "C", text: "Browsers don't support raw UDP, so you'd be forced to use WebRTC DataChannels which add more latency than TCP" },
        { label: "D", text: "UDP's 8-byte header doesn't leave room for the cursor position metadata" }
      ],
      correct: 1,
      explanation: "Document editing requires every operation to arrive in order — if operation 'insert a at position 5' arrives before 'delete position 3,' the document diverges. UDP provides no ordering or delivery guarantees, so you'd need to rebuild reliability at the application layer (essentially reimplementing TCP poorly). Browser support (C) is a real concern but not the strongest argument. UDP headers (D) carry arbitrary payloads. UDP does support multiplexing via ports (A is misleading).",
      interviewScript: "In your interview, say: 'For collaborative editing, operational ordering is non-negotiable for document consistency. UDP would require us to rebuild ordering and reliability guarantees at the application layer, essentially re-implementing TCP with worse battle-testing. The latency gains don't justify the engineering complexity.'",
      proTip: "Acknowledge that cursor positions specifically could tolerate UDP (they're ephemeral and latest-wins), but the document operations cannot. This nuance shows depth."
    },
    {
      id: "q4",
      category: "TCP vs UDP",
      question: "Your team is evaluating QUIC for a latency-sensitive API gateway. A principal engineer argues that QUIC eliminates TCP's head-of-line blocking. In which specific scenario does QUIC's multiplexing advantage actually matter?",
      options: [
        { label: "A", text: "When a single large response is being downloaded — QUIC splits it into parallel streams automatically" },
        { label: "B", text: "When multiple independent requests share one connection and a packet loss on one request's stream would block all other requests under TCP" },
        { label: "C", text: "When the client is behind a NAT and needs UDP hole-punching for connectivity" },
        { label: "D", text: "When TLS handshake needs to complete before any data transfer — QUIC removes encryption overhead entirely" }
      ],
      correct: 1,
      explanation: "TCP's head-of-line blocking occurs in HTTP/2 multiplexing: one connection carries multiple streams, but a single lost packet blocks ALL streams because TCP sees one byte stream. QUIC uses independent streams over UDP, so a loss on stream A doesn't block stream B. Option A is wrong — a single response is one stream. Option C confuses QUIC with WebRTC. Option D is wrong — QUIC includes encryption but achieves 0-RTT handshakes, it doesn't remove encryption.",
      interviewScript: "In your interview, say: 'QUIC's key advantage is independent stream multiplexing. In HTTP/2 over TCP, a packet loss in one stream blocks all multiplexed streams because TCP treats the connection as a single byte stream. QUIC eliminates this by giving each stream independent loss recovery.'",
      proTip: "Mention that HTTP/3 is built on QUIC specifically to solve this multiplexing problem. It's becoming the default for major CDNs like Cloudflare."
    },
    {
      id: "q5",
      category: "HTTP/HTTPS",
      question: "You're designing a REST API for a payment service. A client calls POST /payments to initiate a payment, but the server crashes after debiting the account but before sending the response. The client retries. What HTTP-level mechanism should you implement to prevent double-charging?",
      options: [
        { label: "A", text: "Use PUT instead of POST because PUT is inherently idempotent and the server will automatically deduplicate" },
        { label: "B", text: "Return a 409 Conflict status code, which the client's HTTP library will automatically skip retrying" },
        { label: "C", text: "Require an Idempotency-Key header on POST requests; the server checks if the key was already processed before executing the payment" },
        { label: "D", text: "Use HTTP/2 server push to proactively send the payment confirmation, eliminating the need for retries" }
      ],
      correct: 2,
      explanation: "POST is not idempotent by definition — calling it twice creates two payments. The Idempotency-Key pattern lets the server deduplicate retries by tracking which keys have been processed. PUT (A) is semantically idempotent for replacing a resource, but it doesn't automatically deduplicate side effects like debiting accounts. 409 (B) doesn't prevent the double-charge, it just signals conflict after the fact. Server push (D) doesn't help when the server crashes mid-processing.",
      interviewScript: "In your interview, say: 'For non-idempotent operations like payments, I'd require an Idempotency-Key header. The server stores processed keys and, on retry, returns the cached response instead of re-executing. This is how Stripe's API handles exactly this problem.'",
      proTip: "Stripe's Idempotency-Key implementation is the gold standard — mention it by name. They store the key-to-response mapping and replay the original response on retry."
    },
    {
      id: "q6",
      category: "HTTP/HTTPS",
      question: "Your API serves both mobile clients on slow 3G connections and desktop clients on fiber. A mobile team asks you to reduce payload sizes by 80%. You can't change the API response structure. Which HTTP mechanism allows you to serve optimally compressed responses without breaking any client?",
      options: [
        { label: "A", text: "Use Transfer-Encoding: chunked to split responses into smaller packets that are faster on 3G" },
        { label: "B", text: "Leverage Accept-Encoding/Content-Encoding headers — clients advertise supported compression (gzip, br), server responds with the best available encoding for that client" },
        { label: "C", text: "Set Content-Length to a smaller value so the client only reads part of the response" },
        { label: "D", text: "Use HTTP/2 HPACK header compression, which automatically compresses the response body" }
      ],
      correct: 1,
      explanation: "Content negotiation via Accept-Encoding lets mobile clients request brotli (br) compression (up to 80% smaller than raw JSON), while older clients fall back to gzip or no compression. This is transparent — clients that don't send Accept-Encoding get uncompressed responses. Chunked encoding (A) doesn't compress, it just streams. Truncating Content-Length (C) corrupts the response. HPACK (D) only compresses headers, not the body.",
      interviewScript: "In your interview, say: 'HTTP's content negotiation is designed for exactly this. Mobile clients send Accept-Encoding: br, gzip and the server responds with the most efficient encoding. Brotli typically achieves 20-30% better compression than gzip for JSON payloads, which matters significantly on 3G.'",
      proTip: "Mention that this is a textbook example of HTTP's extensible design philosophy — the Accept-* header family allows graceful capability negotiation without versioning the API."
    },
    {
      id: "q7",
      category: "HTTP/HTTPS",
      question: "A junior developer writes an API endpoint that reads the user_id from the JSON request body to fetch the user's bank account balance. The endpoint is behind HTTPS. They argue it's secure because 'HTTPS encrypts everything.' What's the critical vulnerability?",
      options: [
        { label: "A", text: "HTTPS doesn't encrypt JSON bodies, only URL parameters and headers" },
        { label: "B", text: "The user_id in the request body can be modified by any authenticated user to read other users' data — HTTPS protects data in transit, not from the sender themselves" },
        { label: "C", text: "HTTPS certificates can be spoofed by man-in-the-middle attacks, exposing the user_id" },
        { label: "D", text: "JSON parsing is vulnerable to injection attacks that bypass HTTPS encryption" }
      ],
      correct: 1,
      explanation: "HTTPS encrypts the communication channel between client and server, protecting against eavesdropping. But it does nothing to validate that the authenticated user is authorized to access the user_id they're requesting. Any user could modify their own request body to include another user's ID. This is an Insecure Direct Object Reference (IDOR) vulnerability. The server must validate authorization, not just authentication. Option A is completely wrong — HTTPS encrypts the entire HTTP message including body.",
      interviewScript: "In your interview, say: 'HTTPS protects data in transit, but the sender controls the request body. We must validate server-side that the authenticated user is authorized to access the requested user_id. Never trust client-supplied identifiers without authorization checks — this is IDOR.'",
      proTip: "This is one of the OWASP Top 10 vulnerabilities. Mention that the fix is to derive the user_id from the authentication token (e.g., JWT claims) rather than the request body."
    },
    {
      id: "q8",
      category: "HTTP/HTTPS",
      question: "A candidate designs an API where GET /users/{id}/delete removes a user account. What are the TWO most critical problems with this design?",
      options: [
        { label: "A", text: "GET requests are cached by browsers, CDNs, and proxies — a prefetch or crawler could accidentally delete users; additionally, GET should be idempotent and side-effect-free by HTTP spec" },
        { label: "B", text: "GET requests don't support request bodies, so you can't pass a confirmation token" },
        { label: "C", text: "GET requests are limited to 2048 characters in the URL, which might not fit the user ID" },
        { label: "D", text: "GET requests aren't encrypted by HTTPS, exposing the user ID in the URL" }
      ],
      correct: 0,
      explanation: "Using GET for a destructive operation is a critical anti-pattern for two reasons. First, GET requests are cached and prefetched aggressively — browser link prefetching, Google's web crawler, CDN edge servers, and proxy caches might all 'visit' this URL, triggering deletions. Second, the HTTP spec defines GET as safe and idempotent — clients and intermediaries assume GET has no side effects. Option B is wrong (confirmation tokens can go in query params). Option C is wrong (URL limits aren't relevant here). Option D is wrong (HTTPS encrypts the full URL path).",
      interviewScript: "In your interview, say: 'GET for mutations is dangerous because the entire HTTP ecosystem — browsers, caches, proxies, crawlers — assumes GET is safe. A Google bot indexing your API, or Chrome prefetching a link, could trigger mass deletions. Destructive operations must use POST or DELETE.'",
      proTip: "The classic real-world example is the 2005 Google Web Accelerator incident, where pre-fetching GET links caused unintended actions across websites."
    },
    {
      id: "q9",
      category: "Load Balancing",
      question: "You're designing a system that serves both a REST API and WebSocket connections on the same domain. Your L7 load balancer handles HTTP routing beautifully, but WebSocket connections keep dropping after 60 seconds. What is the most likely root cause?",
      options: [
        { label: "A", text: "WebSocket frames are too large for the L7 load balancer's packet inspection buffer" },
        { label: "B", text: "The L7 load balancer terminates the original TCP connection and creates a new one to the backend; its idle connection timeout is closing the WebSocket's underlying TCP connection after 60s of no HTTP request/response activity" },
        { label: "C", text: "WebSockets require a dedicated L4 load balancer and cannot traverse L7 load balancers at all" },
        { label: "D", text: "The HTTP upgrade handshake is failing because L7 load balancers strip the Upgrade header" }
      ],
      correct: 1,
      explanation: "L7 load balancers terminate client connections and establish new ones to backends. They often have idle timeout configurations designed for HTTP's request-response pattern (e.g., 60s). WebSocket connections are long-lived and may appear 'idle' from the L7 LB's perspective if no data frames are exchanged, triggering the timeout. Option C is wrong — many L7 LBs support WebSockets explicitly. Option D is sometimes true for misconfigured LBs but isn't the 'most likely' cause. Option A isn't how L7 LBs work.",
      interviewScript: "In your interview, say: 'L7 load balancers manage their own TCP connections to backends with idle timeouts. WebSocket's persistent connections trigger these timeouts during quiet periods. The fix is configuring WebSocket-aware idle timeouts or implementing application-level keepalive pings.'",
      proTip: "This is such a common operational issue that AWS ALB has a dedicated WebSocket idle timeout setting (default 4000s). Always mention keepalive pings as the application-level solution."
    },
    {
      id: "q10",
      category: "Load Balancing",
      question: "Your system processes both high-frequency trading API calls (latency-critical, <1ms overhead budget) and a user-facing dashboard (needs cookie-based session affinity). How should you architect the load balancing?",
      options: [
        { label: "A", text: "Single L7 load balancer for everything — it can handle both routing and session affinity" },
        { label: "B", text: "L4 load balancer for trading API traffic (minimal overhead, TCP passthrough), L7 load balancer for dashboard traffic (cookie inspection, session affinity) — separate entry points per traffic type" },
        { label: "C", text: "L4 load balancer for everything with IP-hash routing to simulate session affinity" },
        { label: "D", text: "Client-side load balancing for trading (service registry with direct connections) and L7 for dashboard" }
      ],
      correct: 1,
      explanation: "Trading needs raw TCP passthrough with minimal processing overhead — L4 inspects only IP/port, no packet deep inspection. Dashboard needs L7 for cookie-based routing. IP-hash (C) doesn't give true session affinity based on cookies and can cause hotspots. Single L7 for everything (A) adds unacceptable latency to trading. Client-side LB (D) for trading is viable but the question asks about architecture design, and B correctly separates concerns.",
      interviewScript: "In your interview, say: 'I'd separate traffic types at the load balancer tier. Trading gets an L4 LB for sub-millisecond TCP passthrough, dashboard gets an L7 LB for cookie-based session affinity. This avoids compromising latency-critical paths with application-layer processing.'",
      proTip: "In real FAANG systems, different traffic classes often have entirely separate ingress paths. Google's frontend infrastructure routes different service types through different load balancer tiers."
    },
    {
      id: "q11",
      category: "Load Balancing",
      question: "Your L7 load balancer runs HTTP health checks every 10 seconds against /health. A backend server's database connection pool is exhausted, so all user requests return 500 errors. But /health returns 200 because it only checks that the process is running. What class of failure is this, and how do you fix it?",
      options: [
        { label: "A", text: "This is a gray failure — the server is partially healthy. Fix by making /health perform a lightweight query against each critical dependency (database, cache, message queue)" },
        { label: "B", text: "This is a network partition — the server can't reach the database. Fix by moving the database to the same availability zone" },
        { label: "C", text: "This is expected behavior — health checks should only verify process liveness. Application errors should be handled by circuit breakers" },
        { label: "D", text: "This is a configuration issue — increase the health check frequency to every 1 second to catch transient failures faster" }
      ],
      correct: 0,
      explanation: "This is a 'gray failure' — the server is alive but unable to serve requests meaningfully. Shallow health checks (is the process running?) miss this class of failure. Deep health checks that verify critical dependencies (a lightweight DB query, cache ping, etc.) catch it. Option C is wrong — a health check that doesn't catch an unusable server defeats its purpose. Option D doesn't help if the check itself never detects the failure. Option B is wrong — this isn't a partition issue.",
      interviewScript: "In your interview, say: 'Shallow health checks only detect crashes, not gray failures. I'd implement a deep health check that verifies database connectivity, cache availability, and any critical dependency. The check should be lightweight — a simple SELECT 1 — but comprehensive enough to detect dependency failures.'",
      proTip: "Mention the distinction between liveness probes (is the process running?) and readiness probes (can it serve traffic?). Kubernetes formalizes this with separate endpoints, and it's the right mental model for any health check discussion."
    },
    {
      id: "q12",
      category: "Load Balancing",
      question: "You have 20 backend servers behind a load balancer serving an SSE endpoint. Each SSE connection is long-lived (average 30 minutes). You use round-robin load balancing. After a deployment that restarts servers one at a time, you notice one server has 4x more active connections than others. Why?",
      options: [
        { label: "A", text: "Round robin doesn't account for server capacity — the last server restarted receives all new connections while older servers are at capacity" },
        { label: "B", text: "The first server restarted has been up longest, accumulating connections over 30 minutes while other servers were being restarted and shedding their connections" },
        { label: "C", text: "Round robin is random and statistical variance causes uneven distribution" },
        { label: "D", text: "SSE connections bypass the load balancer after initial setup, causing drift" }
      ],
      correct: 1,
      explanation: "During rolling restarts, each server drops its SSE connections when restarted. Clients reconnect and get distributed across currently-healthy servers. The first server restarted has been up the longest, continuously accumulating new connections while subsequent servers were still being restarted and dropping their connections. This creates a 'stacking' effect. Least-connections algorithm solves this by routing new connections to the least-loaded server. Round robin (C) is deterministic, not random. SSE connections (D) still go through the LB.",
      interviewScript: "In your interview, say: 'For long-lived connections like SSE, round-robin creates imbalanced distribution during rolling deploys because early-restarted servers accumulate connections longer. Least-connections algorithm addresses this by always routing to the server with the fewest active connections.'",
      proTip: "This is a real operational issue at scale. Companies like Netflix use connection-aware load balancing specifically for their long-lived streaming connections."
    },
    {
      id: "q13",
      category: "WebSockets",
      question: "You're explaining WebSockets to a junior engineer. They ask: 'If WebSockets use TCP, why do we need the HTTP upgrade handshake? Why not just open a raw TCP socket?' What's the strongest technical reason for the HTTP upgrade?",
      options: [
        { label: "A", text: "Browsers don't allow raw TCP connections from JavaScript for security reasons — the HTTP upgrade leverages the existing HTTP stack to establish a WebSocket within the browser's security model" },
        { label: "B", text: "The HTTP upgrade is required by the TCP specification for multiplexing multiple protocols on port 80" },
        { label: "C", text: "WebSocket frames are encoded in HTTP format, so the upgrade tells the server to switch parsers" },
        { label: "D", text: "The HTTP upgrade allows the server to authenticate the client using HTTP cookies and headers before the persistent connection is established" }
      ],
      correct: 0,
      explanation: "The browser security model is the key reason. JavaScript in browsers cannot open arbitrary TCP connections — this would be a massive security vulnerability. The HTTP upgrade mechanism lets WebSocket connections ride on the browser's existing HTTP infrastructure (same-origin checks, cookie handling, port 80/443). Option D is a real benefit but is a consequence, not the primary reason. Option B is wrong — TCP doesn't specify this. Option C is wrong — WebSocket frames are NOT HTTP format; they have their own binary framing protocol.",
      interviewScript: "In your interview, say: 'The HTTP upgrade exists primarily because browsers restrict raw TCP access for security. WebSockets leverage the HTTP handshake to pass through the browser's security model — same-origin policy, cookies, and standard ports — before upgrading to an independent binary protocol.'",
      proTip: "Mention that the upgrade also lets WebSocket connections traverse firewalls and proxies that allow HTTP traffic on port 80/443 — a huge deployment advantage over custom TCP protocols."
    },
    {
      id: "q14",
      category: "WebSockets",
      question: "You deployed WebSockets in production. Everything works in dev, but in production, connections drop within 30 seconds. Your infrastructure includes: CDN → L7 Load Balancer → Application servers. Logs show the HTTP upgrade succeeds but frames stop flowing. What's the most likely cause?",
      options: [
        { label: "A", text: "The CDN is caching the WebSocket upgrade response and serving stale connections to new clients" },
        { label: "B", text: "The CDN or L7 load balancer doesn't support WebSocket protocol and is treating the connection as a standard HTTP request with an idle timeout" },
        { label: "C", text: "WebSocket binary frames are being rejected by the CDN's WAF (Web Application Firewall) as malicious traffic" },
        { label: "D", text: "The application server is running out of file descriptors from too many persistent connections" }
      ],
      correct: 1,
      explanation: "This is the classic 'WebSocket works in dev but not prod' problem. If any intermediary in the chain (CDN, L7 LB, proxy) doesn't understand WebSocket protocol, it treats the upgraded connection as a regular HTTP connection. The HTTP upgrade succeeds because it's standard HTTP, but subsequent WebSocket frames appear as a long-idle HTTP connection that gets terminated. Option A doesn't make sense — CDNs don't cache upgrade handshakes. Option D would cause connection refusals, not silent drops after 30s.",
      interviewScript: "In your interview, say: 'Every piece of infrastructure between client and server must support WebSocket protocol. The HTTP upgrade succeeds because it's standard HTTP, but if the CDN or LB doesn't understand WebSocket framing, it sees an idle HTTP connection and terminates it. This is why you should always verify WebSocket support across your entire infrastructure chain before choosing WebSockets.'",
      proTip: "The content specifically warns about this: 'firewalls, proxies, load balancers, and other infrastructure that don't support WebSocket connections.' This is one of the most common real-world WebSocket deployment issues."
    },
    {
      id: "q15",
      category: "WebSockets",
      question: "A candidate proposes WebSockets for a social media feed where users scroll through posts. New posts should appear at the top in near-real-time. The feed is read-only — users don't interact with the feed data itself. What's the most critical flaw in this proposal?",
      options: [
        { label: "A", text: "WebSockets don't support binary data, so image-heavy feeds can't be transmitted" },
        { label: "B", text: "WebSockets are bidirectional and stateful — using them for unidirectional, read-only data wastes server resources on maintaining persistent connections for each user when SSE or polling would serve the same purpose with less infrastructure overhead" },
        { label: "C", text: "WebSockets have a maximum message size of 64KB, too small for feed items" },
        { label: "D", text: "WebSockets require client-side certificate authentication, which social media users won't have" }
      ],
      correct: 1,
      explanation: "For a read-only feed, you don't need bidirectional communication. SSE provides server-to-client push over standard HTTP without the overhead of maintaining stateful WebSocket connections. At scale (millions of concurrent feed viewers), the persistent connection overhead of WebSockets creates significant infrastructure burden — each connection ties up memory and file descriptors on the server. SSE connections are lighter and can leverage standard HTTP infrastructure. Options A, C, and D are all factually incorrect.",
      interviewScript: "In your interview, say: 'For a read-only feed, WebSockets provide bidirectional capability we don't need, at the cost of stateful connection overhead. SSE gives us server push over standard HTTP, leveraging existing infrastructure. At millions of concurrent users, this infrastructure simplification is significant.'",
      proTip: "Always match the protocol to the communication pattern. Bidirectional (chat, gaming) → WebSockets. Unidirectional server push (feeds, notifications) → SSE. Request-response (API calls) → HTTP. This framework impresses interviewers."
    },
    {
      id: "q16",
      category: "Failure Handling",
      question: "Your service retries failed requests with exponential backoff: 1s, 2s, 4s, 8s, 16s. During a database outage affecting 1000 concurrent users, all clients start retrying simultaneously. Even with backoff, the database recovers but immediately gets overwhelmed again. What's missing from this retry strategy?",
      options: [
        { label: "A", text: "The backoff intervals should be linear, not exponential — exponential grows too slowly" },
        { label: "B", text: "Jitter — without randomization, all 1000 clients synchronize their retries at the same backoff intervals (1s, 2s, 4s...), creating coordinated retry storms at exact intervals" },
        { label: "C", text: "A maximum retry limit — clients should stop retrying after 5 attempts" },
        { label: "D", text: "The retry should use UDP instead of TCP to reduce server load" }
      ],
      correct: 1,
      explanation: "Without jitter, exponential backoff creates synchronized retry waves. All 1000 clients fail at the same time, wait 1s, retry together, wait 2s, retry together — a periodic thundering herd. Adding random jitter (e.g., base * 2^attempt + random(0, base)) spreads retries across the interval, reducing peak load. Max retries (C) help but don't solve the synchronization. Linear backoff (A) is worse — exponential backs off faster. UDP retries (D) doesn't reduce the server work of processing requests.",
      interviewScript: "In your interview, say: 'Exponential backoff alone creates synchronized retry storms. Adding jitter — randomizing the wait time within each backoff interval — decorrelates client retries and spreads the load. AWS recommends this as \"full jitter\" in their retry strategy best practices.'",
      proTip: "Reference AWS's blog post on backoff strategies — they define three approaches: full jitter, equal jitter, and decorrelated jitter. Full jitter (random between 0 and the exponential cap) provides the best spread."
    },
    {
      id: "q17",
      category: "Failure Handling",
      question: "You implement idempotency for a payment API using the Idempotency-Key header. The server checks a Redis cache for the key before processing. A payment request times out on the client side. The client retries with the same key. What subtle failure mode can still cause a double-charge?",
      options: [
        { label: "A", text: "Redis doesn't support atomic check-and-set operations, so two concurrent requests with the same key can both pass the check" },
        { label: "B", text: "If the first request's idempotency key was stored in Redis AFTER the payment was processed (not before), the retry arrives during processing, doesn't find the key in Redis, and initiates a second payment" },
        { label: "C", text: "HTTP headers are case-insensitive, so the retry might send a different-cased key that doesn't match" },
        { label: "D", text: "Redis TTL expires the key before the retry arrives, so the duplicate isn't detected" }
      ],
      correct: 1,
      explanation: "The order of operations matters critically. If the idempotency key is stored only after successful processing, there's a race window: request 1 starts processing, request 2 (retry) arrives, checks Redis, finds no key, starts processing too. The fix is to store the key BEFORE processing (or use atomic check-and-set). Option A is wrong — Redis supports SETNX (SET if Not eXists) for exactly this purpose. Option D is a real concern but happens on a different timescale (minutes/hours, not during a timeout retry). Option C is wrong — HTTP header names are case-insensitive but values are typically case-sensitive and handled correctly.",
      interviewScript: "In your interview, say: 'The critical detail is storing the idempotency key BEFORE processing, not after. Using Redis SETNX atomically reserves the key, preventing concurrent duplicate processing. If the first request fails after reserving the key, we clean it up with a TTL.'",
      proTip: "Mention that Stripe handles this by immediately storing the key with a 'processing' status, then updating to 'complete' with the cached response. Retries during processing get a 409 or wait for completion."
    },
    {
      id: "q18",
      category: "Failure Handling",
      question: "Your microservice calls a recommendation engine that starts returning errors. Your circuit breaker trips to 'open' state after 10 consecutive failures. After 30 seconds, it enters 'half-open' state and sends one test request. What should happen if this test request succeeds but takes 5x longer than normal?",
      options: [
        { label: "A", text: "Close the circuit immediately — a successful response means the service has recovered" },
        { label: "B", text: "Keep the circuit open — latency degradation indicates the service is still struggling, and routing full traffic to it now could push it back into failure" },
        { label: "C", text: "Ignore the latency and close the circuit — the circuit breaker should only evaluate success/failure, not latency" },
        { label: "D", text: "Enter a new 'quarter-open' state that allows 25% of traffic through" }
      ],
      correct: 1,
      explanation: "A 5x latency spike indicates the service is recovering but still under stress. Closing the circuit and routing full traffic to it could overwhelm it again, causing the exact cascading failure circuit breakers prevent. Sophisticated circuit breaker implementations consider both error rate AND latency. Option A risks re-triggering the failure. Option C ignores a critical health signal. Option D is not a real circuit breaker state, though the concept of gradual traffic increase is valid.",
      interviewScript: "In your interview, say: 'A slow but successful response in half-open state suggests the dependency is recovering but fragile. I'd keep the circuit open and test again after another interval. Circuit breakers should consider latency, not just success/failure — routing full traffic to a degraded service can push it back into failure.'",
      proTip: "Netflix's Hystrix library (now in maintenance mode) popularized this pattern. Modern implementations like Resilience4j allow configuring both error rate AND slow call rate thresholds for circuit transitions."
    },
    {
      id: "q19",
      category: "Failure Handling",
      question: "Your database crashes and triggers circuit breakers across 50 microservices. After 60 seconds, the database recovers. All 50 circuit breakers enter half-open state simultaneously and send test requests. The database immediately crashes again. What pattern is this, and how do you prevent it?",
      options: [
        { label: "A", text: "This is a split-brain problem — use consensus protocols to coordinate circuit breaker state across services" },
        { label: "B", text: "This is a thundering herd of health probes — stagger circuit breaker timeout periods with jitter so services don't all probe at the same time, and implement a graduated traffic ramp rather than all-or-nothing recovery" },
        { label: "C", text: "This is a network partition — the circuit breakers should be disabled during network issues" },
        { label: "D", text: "This is expected behavior — the database should be scaled to handle the probe load from 50 services" }
      ],
      correct: 1,
      explanation: "When all circuit breakers use the same timeout (60s), they synchronize their half-open probes — the same thundering herd pattern we see with retries. Adding jitter to circuit breaker timeouts spreads out the probes. Additionally, graduated recovery (letting 10% traffic through, then 25%, then 50%) prevents slamming a recovering service. Option A's consensus approach is overkill and adds latency. Option D misses the point — the probe storm is the problem, not the database capacity.",
      interviewScript: "In your interview, say: 'This is a thundering herd at the circuit breaker level. I'd add jitter to the half-open timeout so services don't synchronize their recovery probes. Additionally, half-open should gradually increase traffic rather than immediately closing the circuit — maybe 10% then 25% then full.'",
      proTip: "The jitter principle applies everywhere: retries, circuit breakers, health checks, cache TTLs. Any time N clients make synchronized decisions, jitter is the antidote."
    },
    {
      id: "q20",
      category: "REST API Design",
      question: "You're designing an API for a chess game platform. A player wants to start a game. A junior developer proposes POST /startGame. What's the RESTful way to model this, and why does it matter?",
      options: [
        { label: "A", text: "POST /games with body { \"status\": \"started\" } — REST models resources and state transitions, not operations. This makes the API discoverable and cacheable" },
        { label: "B", text: "PUT /games/{id}/start — PUT is for updates, and starting a game is updating its state" },
        { label: "C", text: "GET /games/new — GET requests are safe and starting a new game should be safe" },
        { label: "D", text: "POST /startGame is fine — REST is just a convention, and clear naming matters more than resource orientation" }
      ],
      correct: 0,
      explanation: "REST's core principle is modeling resources, not operations. POST /games creates a new game resource. The initial state can be 'started' or set by the server. This makes the API consistent with REST conventions — GET /games lists games, GET /games/{id} retrieves one, POST /games creates one, DELETE /games/{id} removes one. Option B's /start endpoint is an RPC-style action on a resource. Option C uses GET for a state-changing operation (anti-pattern). Option D misses that REST conventions enable tooling, documentation, and predictable behavior.",
      interviewScript: "In your interview, say: 'REST thinks in resources, not operations. Instead of startGame, I'd POST to /games to create a new game resource. This keeps the API uniform and predictable — standard REST tooling and documentation work out of the box. State changes happen through the resource representation, not action endpoints.'",
      proTip: "Mention that REST's uniform interface constraint is what enables features like HATEOAS and self-documenting APIs. Even if you don't implement HATEOAS, thinking in resources leads to cleaner API evolution."
    },
    {
      id: "q21",
      category: "REST API Design",
      question: "A candidate designs an API for a mobile news app where each article has an author, comments, and related articles. Their API requires 4 sequential requests to render one article page: GET /articles/{id}, GET /users/{authorId}, GET /articles/{id}/comments, GET /articles/{id}/related. The page takes 800ms to load on mobile. What's the fundamental problem and the REST-compatible solution?",
      options: [
        { label: "A", text: "The problem is under-fetching. Solution: create a composite endpoint GET /articles/{id}?include=author,comments,related that returns all nested data in one response" },
        { label: "B", text: "The problem is REST itself — switch to GraphQL for all client-facing APIs" },
        { label: "C", text: "The problem is the HTTP protocol — switch to gRPC for binary encoding and streaming" },
        { label: "D", text: "The problem is the mobile client — implement aggressive client-side caching to eliminate repeated requests" }
      ],
      correct: 0,
      explanation: "This is the classic under-fetching problem: multiple round trips add up, especially on high-latency mobile networks (4 × 200ms RTT = 800ms minimum). A composite endpoint that includes related resources in one response eliminates 3 round trips. This is still RESTful — the article resource can embed related resources. GraphQL (B) solves this too but is overkill for a well-defined, stable page. gRPC (C) doesn't solve the multiple-request problem. Client caching (D) only helps on repeat visits.",
      interviewScript: "In your interview, say: 'The core issue is under-fetching causing multiple round trips on high-latency mobile networks. I'd create a composite endpoint that embeds author, comments, and related articles. This is REST-compatible — resource representations can include embedded resources. If requirements keep changing and we need more flexible queries, that's when I'd consider GraphQL.'",
      proTip: "Mention that JSON:API and OData are REST specifications that formalize the include/embed pattern. They solve the under-fetching problem within REST conventions."
    },
    {
      id: "q22",
      category: "gRPC/Protobuf",
      question: "Your team uses gRPC for all internal service communication (10 services, ~2M RPC calls/minute). A product manager asks: 'Why can't we expose our gRPC APIs directly to our web and mobile clients?' What are the TWO most impactful reasons to keep REST for external APIs?",
      options: [
        { label: "A", text: "gRPC is slower than REST for small payloads due to protobuf encoding overhead" },
        { label: "B", text: "Browsers lack native gRPC support (requiring grpc-web proxy), and protobuf's binary format makes debugging, API exploration, and third-party integration significantly harder than JSON" },
        { label: "C", text: "gRPC doesn't support authentication or encryption, making it insecure for public-facing APIs" },
        { label: "D", text: "gRPC service definitions can't be versioned, making API evolution impossible" }
      ],
      correct: 1,
      explanation: "Browser support is the killer issue — browsers can't make native gRPC calls, requiring a grpc-web proxy that adds infrastructure complexity. Additionally, gRPC's binary protobuf format means you can't curl an endpoint, inspect responses in browser dev tools, or hand an API to a third-party developer without them setting up protobuf tooling. JSON APIs are universally readable and debuggable. Option A is wrong — gRPC is faster, not slower. Option C is wrong — gRPC supports TLS and various auth mechanisms. Option D is wrong — protobuf has versioning mechanisms.",
      interviewScript: "In your interview, say: 'Two reasons: browser support and developer experience. Browsers can't make native gRPC calls, requiring a proxy. And binary protobuf means developers can't curl our API or inspect responses in dev tools. For internal services where we control both ends, gRPC's performance is worth it. For external consumers, JSON/REST's universality wins.'",
      proTip: "Mention that this is exactly the pattern Google uses: gRPC internally, REST/JSON externally via API gateways that translate between formats."
    },
    {
      id: "q23",
      category: "gRPC/Protobuf",
      question: "Your notification service sends 50K messages/second to a downstream delivery service. Currently using REST/JSON, it consumes 40% of the delivery service's CPU just on JSON deserialization. Switching to gRPC with protobuf reduced CPU to 8%. Why is the improvement so dramatic?",
      options: [
        { label: "A", text: "gRPC uses HTTP/2 which has built-in compression, so the payloads are smaller" },
        { label: "B", text: "Protobuf uses a binary encoding with fixed-size field tags and variable-length encoding, eliminating the need to parse string keys, handle whitespace, validate syntax, and perform UTF-8 string processing that JSON requires" },
        { label: "C", text: "gRPC batches multiple messages into a single TCP packet, reducing per-message overhead" },
        { label: "D", text: "Protobuf skips validation entirely and trusts the sender, trading safety for speed" }
      ],
      correct: 1,
      explanation: "JSON parsing is inherently expensive: the parser must tokenize a text stream, handle escape sequences, validate Unicode, convert string representations of numbers, and match string keys against known fields. Protobuf's binary format uses small integer tags (not string keys), encodes numbers in native binary format, and has a predetermined schema — the deserializer knows exactly where each field starts and what type it is. No string processing, no syntax validation. At 50K messages/second, this difference is massive. Option A's HTTP/2 compression helps headers but isn't the main factor. Option C isn't how gRPC works. Option D is wrong — protobuf validates types against the schema.",
      interviewScript: "In your interview, say: 'Protobuf eliminates the computational overhead of text-based parsing. JSON requires tokenizing strings, validating syntax, and converting string representations to types. Protobuf uses binary encoding with integer field tags and native type encoding, so deserialization is essentially a memory copy with minimal processing. At 50K messages/second, this difference is massive.'",
      proTip: "Cite specific benchmarks: protobuf is typically 3-10x faster at serialization and produces payloads 3-5x smaller than JSON. For high-throughput internal services, this directly translates to fewer servers needed."
    },
    {
      id: "q24",
      category: "Server-Sent Events",
      question: "You implement SSE for a live auction system. A bidder's connection drops for 8 seconds during a critical bidding period. When the connection re-establishes, the bidder sees the correct current bid. How did the SSE protocol handle this gap without your application code manually tracking disconnections?",
      options: [
        { label: "A", text: "The browser's EventSource API cached all page state locally and reconstructed it on reconnection" },
        { label: "B", text: "The browser's EventSource API automatically reconnects and sends a Last-Event-ID header; the server uses this to replay all events the client missed since that ID" },
        { label: "C", text: "SSE maintains a server-side session that buffers events; the server pushes the buffer when it detects the reconnection via TCP keepalive" },
        { label: "D", text: "The CDN in front of the server cached the SSE event stream and served the missed events from its edge node" }
      ],
      correct: 1,
      explanation: "SSE's EventSource API has built-in reconnection with automatic Last-Event-ID tracking. When the connection drops, the browser reconnects and sends the Last-Event-ID header from the last successfully received event. The server is expected to replay events since that ID. This is a major advantage over WebSockets, where reconnection and catch-up logic must be implemented manually. Option C doesn't exist — SSE doesn't use TCP keepalive for reconnection detection. Option A is fabricated. Option D — CDNs typically don't cache SSE streams.",
      interviewScript: "In your interview, say: 'SSE has built-in reconnection through the EventSource API. The browser automatically tracks the last event ID and sends it as a header on reconnect. The server replays missed events. This is a significant advantage over WebSockets for unidirectional push — you get reconnection and catch-up for free.'",
      proTip: "When comparing SSE vs WebSockets, always mention that SSE gives you automatic reconnection and Last-Event-ID for free. Building equivalent functionality with WebSockets requires significant application code."
    },
    {
      id: "q25",
      category: "Server-Sent Events",
      question: "You deploy SSE for real-time notifications. In testing, events arrive instantly. In production behind a corporate proxy, users report 30-second delays where events arrive in large batches. The SSE connection shows as 'open' the entire time. What's happening?",
      options: [
        { label: "A", text: "The corporate proxy is rate-limiting SSE connections to prevent abuse" },
        { label: "B", text: "A misbehaving intermediate proxy is buffering the chunked transfer encoding response, accumulating all SSE events and delivering them in batches when its internal buffer fills or times out" },
        { label: "C", text: "The server's event queue is backing up due to production load, causing batched delivery" },
        { label: "D", text: "The browser's EventSource is batching events to reduce main thread interruptions" }
      ],
      correct: 1,
      explanation: "This is the exact gotcha the content warns about: 'misbehaving networks that will batch up all SSE responses into a single response.' Corporate proxies and middleboxes that don't understand streaming HTTP responses buffer the entire chunked response. They receive the events individually from the server but hold them until a buffer fills (e.g., 32KB) or a timeout fires (e.g., 30s), then deliver the batch. The connection appears open because the proxy maintains it — the SSE events just can't flow through in real-time.",
      interviewScript: "In your interview, say: 'This is a known SSE limitation — intermediate proxies can buffer chunked responses, breaking the real-time stream. The connection stays open, but events queue in the proxy's buffer. Mitigations include padding events to flush proxy buffers, using HTTPS to prevent proxy inspection, or falling back to WebSockets which use a different framing protocol that proxies are less likely to buffer.'",
      proTip: "Mention that HTTPS helps because encrypted traffic can't be buffered by transparent proxies (they can't see the content). This is why most production SSE implementations require HTTPS."
    },
    {
      id: "q26",
      category: "WebRTC",
      question: "You're designing a video conferencing system for rooms of up to 50 participants. A peer-to-peer mesh (every participant connects to every other) works for small rooms. At what point does this approach break down, and what replaces it?",
      options: [
        { label: "A", text: "It breaks at 3-4 participants because WebRTC only supports 3 peer connections per browser; use a TURN relay for larger rooms" },
        { label: "B", text: "It breaks at ~5-8 participants because each peer must encode and upload N-1 separate video streams, consuming O(n) upload bandwidth per user; replace with an SFU (Selective Forwarding Unit) that receives one stream per user and selectively forwards to others" },
        { label: "C", text: "It never breaks down — WebRTC mesh scales linearly because each connection is independent" },
        { label: "D", text: "It breaks at 10 participants due to signaling server overload; replace with DNS-based peer discovery" }
      ],
      correct: 1,
      explanation: "In a full mesh, each participant sends N-1 video streams and receives N-1 streams. At 8 participants, each user uploads 7 video streams simultaneously — ~7-14 Mbps upload on a 1-2 Mbps/stream video, which exceeds most residential upload speeds. An SFU receives one stream per user and forwards it to all others server-side, reducing upload to O(1) per user regardless of room size. TURN (A) is a relay for NAT traversal, not a topology solution. Browser WebRTC limits (A) don't exist at 3 connections. Mesh does not scale linearly (C).",
      interviewScript: "In your interview, say: 'Peer-to-peer mesh requires O(n) upload bandwidth per participant. At 5-8 users, this exceeds residential upload limits. For larger rooms, I'd use an SFU architecture — each user uploads one stream, and the SFU handles selective forwarding. This reduces per-user upload to O(1) while maintaining low latency.'",
      proTip: "The three WebRTC topologies are: Mesh (P2P, small rooms), SFU (Selective Forwarding Unit, medium rooms), and MCU (Multipoint Control Unit, large rooms where server-side transcoding combines streams). Zoom uses an SFU architecture."
    },
    {
      id: "q27",
      category: "WebRTC",
      question: "A candidate proposes using WebRTC for a customer support chat feature (text only, no audio/video). Users type messages to support agents through a web browser. Why is this a poor architectural choice?",
      options: [
        { label: "A", text: "WebRTC doesn't support text data — it only handles audio and video streams" },
        { label: "B", text: "WebRTC's complex setup (signaling server, STUN, TURN) is massive overkill for text chat that WebSockets handle trivially; additionally, WebRTC's peer-to-peer model means you lose centralized message logging and persistence without building a parallel server path" },
        { label: "C", text: "WebRTC has higher latency than WebSockets for text messages due to UDP overhead" },
        { label: "D", text: "WebRTC requires native browser plugins that support agents may not have installed" }
      ],
      correct: 1,
      explanation: "WebRTC requires signaling infrastructure, STUN/TURN servers, and NAT traversal for what is fundamentally a client-server text exchange. WebSockets provide persistent bidirectional communication with far simpler infrastructure. Critically, a support chat needs centralized logging, message persistence, and routing to available agents — all of which require a central server. WebRTC's P2P model bypasses the server, forcing you to build a parallel persistence path. Option A is wrong — WebRTC DataChannels support arbitrary data. Option D is wrong — modern browsers support WebRTC natively.",
      interviewScript: "In your interview, say: 'WebRTC solves the wrong problem here. Text chat needs a central server for message persistence, routing, and agent management. WebSockets give us persistent bidirectional communication with simple client-server architecture. WebRTC's complex signaling and P2P infrastructure provides zero benefit for text chat and actively undermines centralized requirements.'",
      proTip: "The content emphasizes: 'If you stick to only using WebRTC for video/audio calling and conferencing, you'll be in good shape.' Candidates who try to use WebRTC for non-media use cases in interviews typically go off-rail."
    },
    {
      id: "q28",
      category: "Client-Side LB",
      question: "Your internal microservice architecture uses client-side load balancing with a service registry. When a new server instance starts, it registers itself. A deployment adds 5 new instances. For 15 seconds after deployment, 30% of traffic still goes to old instances that were decommissioned. What's the root cause?",
      options: [
        { label: "A", text: "The old instances haven't deregistered from the service registry yet because they crashed instead of gracefully shutting down" },
        { label: "B", text: "Clients cache the server list from the registry and poll for updates on an interval; the 15-second gap is the cache staleness window before clients receive the updated list" },
        { label: "C", text: "DNS propagation delay is preventing the new instances from being discoverable" },
        { label: "D", text: "The service registry uses eventual consistency and hasn't replicated the new instances to all nodes yet" }
      ],
      correct: 1,
      explanation: "Client-side load balancing requires clients to maintain a local copy of the server list. Clients poll the registry at intervals (e.g., every 15 seconds). During the gap between polls, they use stale data that still includes decommissioned servers. This is the fundamental trade-off of client-side LB: reduced per-request latency (no LB hop) at the cost of propagation delay for topology changes. Option A would cause the old instances to remain listed, but the question says they're decommissioned. Option D could contribute but the primary issue is client-side caching.",
      interviewScript: "In your interview, say: 'Client-side load balancing trades real-time topology awareness for reduced per-request latency. Clients poll the registry at intervals, creating a staleness window where traffic goes to decommissioned servers. For our use case with 15-second tolerance, we could reduce the poll interval or switch to push-based registry updates like gRPC's name resolution.'",
      proTip: "Mention that gRPC's built-in client-side load balancing uses a name resolver that can receive push updates, reducing the staleness window to near-zero for controlled environments."
    },
    {
      id: "q29",
      category: "Client-Side LB",
      question: "Your service uses DNS-based load balancing with two load balancers in different regions for redundancy. One load balancer fails. Some users continue hitting the failed LB for several minutes. Why, and what determines how quickly they recover?",
      options: [
        { label: "A", text: "The DNS resolver is round-robining between both IPs, and the failed LB doesn't respond to the DNS resolver's health checks" },
        { label: "B", text: "DNS entries have a TTL (Time-to-Live); clients and intermediate DNS resolvers cache the failed LB's IP until the TTL expires, ignoring the updated DNS record that removes it" },
        { label: "C", text: "The user's browser maintains a persistent TCP connection to the failed LB, which doesn't timeout for several minutes" },
        { label: "D", text: "The CDN in front of the LBs is routing traffic to the failed one based on geographic proximity" }
      ],
      correct: 1,
      explanation: "DNS TTL is the key factor. When a DNS record changes (removing the failed LB), the update doesn't propagate instantly. Every DNS resolver in the chain (ISP resolver, corporate resolver, OS cache, browser cache) may have the old record cached until its TTL expires. If TTL is 5 minutes, some users will hit the failed LB for up to 5 minutes. This is the fundamental limitation of DNS-based failover — there's a trade-off between cache efficiency (high TTL) and failover speed (low TTL). Option A confuses DNS resolver health checks with LB health checks.",
      interviewScript: "In your interview, say: 'DNS failover speed is bounded by TTL. When we remove the failed LB from DNS, cached records persist across the resolver chain until TTL expires. Lower TTL means faster failover but more DNS queries and potentially slower resolution. A common compromise is a 60-second TTL for active-passive failover scenarios.'",
      proTip: "Mention that this is exactly why you don't rely solely on DNS for failover. Combining DNS rotation with application-level failover (client tries the next IP if the first fails) gives you both redundancy mechanisms."
    },
    {
      id: "q30",
      category: "Regionalization",
      question: "Your social media platform caches user profile images on a CDN with 200 edge locations worldwide. A user in Tokyo updates their profile picture. Users in New York still see the old image for 30 minutes. What's the standard approach to solve this without drastically increasing CDN costs?",
      options: [
        { label: "A", text: "Disable CDN caching for profile images entirely — serve all images from the origin server" },
        { label: "B", text: "Use cache-busting URLs — when a user updates their image, generate a new URL (e.g., append a version hash), so the CDN treats it as a new resource and fetches from origin; the old URL naturally expires via TTL" },
        { label: "C", text: "Send a purge request to all 200 CDN edge locations immediately after the update" },
        { label: "D", text: "Reduce the CDN TTL to 10 seconds so stale images expire quickly" }
      ],
      correct: 1,
      explanation: "Cache-busting URLs are the standard, cost-effective solution. By changing the URL (e.g., /img/profile_abc123_v2.jpg or /img/profile_abc123.jpg?h=sha256), the CDN has no cached version of the new URL and fetches from origin. The old URL's cache naturally expires. Disabling CDN caching (A) defeats the purpose. Purging all edges (C) is expensive at 200 locations and may not be instant. Low TTL (D) increases origin load dramatically and still has staleness.",
      interviewScript: "In your interview, say: 'I'd use cache-busting URLs — append a content hash to the image URL. On update, the new URL is a cache miss everywhere, fetching from origin. The old URL expires naturally. This avoids the cost of global cache invalidation while ensuring immediate freshness for new content.'",
      proTip: "This pattern is universal: CSS/JS bundles (app.abc123.js), images, and any CDN-cached content. Immutable URLs with content hashes give you infinite TTLs plus instant updates."
    },
    {
      id: "q31",
      category: "Regionalization",
      question: "You're designing a ride-sharing app like Uber. The interviewer asks how you'd handle a user who starts a ride in San Francisco (West region) and ends in Sacramento (Central Valley region), when each region has its own database. What's the most pragmatic approach?",
      options: [
        { label: "A", text: "Replicate all ride data across all regions synchronously so any region can continue the ride" },
        { label: "B", text: "The ride is owned by the originating region (San Francisco) for its entire lifecycle; cross-region rides don't need special handling because the ride is a single entity managed by one region" },
        { label: "C", text: "Migrate the ride record from West to Central Valley mid-ride when the GPS crosses the boundary" },
        { label: "D", text: "Use a global database instead of regional partitioning to avoid this problem entirely" }
      ],
      correct: 1,
      explanation: "A ride is a single entity with a lifecycle — it's created in one region and should stay there until completion. The originating region manages the entire ride, regardless of where the driver physically travels. Regional partitioning is about data locality for queries (matching riders to nearby drivers), not about physical GPS boundaries. Cross-region synchronous replication (A) defeats regional partitioning benefits. Mid-ride migration (C) creates complex state transfer problems. Global DB (D) is exactly what regional partitioning avoids.",
      interviewScript: "In your interview, say: 'Regional partitioning for ride-sharing is about matching riders to nearby drivers, not tracking physical location. A ride belongs to its originating region for its lifecycle. The driver's GPS might cross a region boundary, but the ride record doesn't need to migrate — it's a single transaction managed by one region.'",
      proTip: "Mention that Uber's actual architecture uses 'city-level' sharding for exactly this reason. Rides are sharded by city of origin, not by real-time GPS location."
    },
    {
      id: "q32",
      category: "GraphQL",
      question: "A startup with 3 frontend developers and 2 backend developers builds both a web app and mobile app. They currently have 47 REST endpoints. The mobile team complains about over-fetching on slow networks. The web team keeps requesting new endpoints. An engineer proposes migrating entirely to GraphQL. What's your assessment?",
      options: [
        { label: "A", text: "Great idea — GraphQL solves both over-fetching and reduces the need for new endpoints; with 5 developers, the migration is manageable" },
        { label: "B", text: "GraphQL would help the mobile team's over-fetching problem, but a full migration is risky; start with a GraphQL layer for mobile-specific queries while keeping REST for the web app, then evaluate whether full migration is warranted" },
        { label: "C", text: "Don't migrate — add query parameter support to existing REST endpoints (e.g., ?fields=id,name,email) to solve over-fetching without the GraphQL learning curve" },
        { label: "D", text: "The problem is the backend team, not the API paradigm — hire more backend engineers to build endpoints faster" }
      ],
      correct: 1,
      explanation: "GraphQL directly addresses mobile over-fetching (clients request exactly what they need) and reduces the endpoint proliferation problem. However, a full migration of 47 endpoints for a 5-person team is high-risk and high-effort. The pragmatic approach is to add a GraphQL gateway for mobile use cases where flexible querying provides the most value, while keeping stable REST endpoints that work well for the web team. Option C works as a stopgap but doesn't scale well with complex nested data. Option A underestimates migration risk. Option D doesn't address the architecture.",
      interviewScript: "In your interview, say: 'GraphQL is a strong fit for mobile's over-fetching problem, but I'd adopt it incrementally rather than as a full migration. Start with a GraphQL layer for mobile, prove the value, then expand. This reduces migration risk while immediately addressing the pain point.'",
      proTip: "Mention that many large companies (GitHub, Shopify) run GraphQL and REST side-by-side. Full migration is rarely necessary — the hybrid approach gets 80% of the benefit with 20% of the risk."
    },
    {
      id: "q33",
      category: "GraphQL",
      question: "A candidate proposes GraphQL for a system design interview problem with 3 fixed screens and well-defined data requirements that won't change. They argue that GraphQL's flexibility will future-proof the API. What's the flaw in this reasoning?",
      options: [
        { label: "A", text: "GraphQL doesn't support real-time subscriptions, which the system might need in the future" },
        { label: "B", text: "For fixed, well-defined queries, GraphQL adds backend resolver complexity without providing flexibility benefits; the overhead of maintaining a schema, writing resolvers, and handling N+1 query problems outweighs the value when requirements are stable" },
        { label: "C", text: "GraphQL is proprietary to Facebook and has licensing restrictions for commercial use" },
        { label: "D", text: "GraphQL can't handle more than 1000 requests per second, which limits scalability" }
      ],
      correct: 1,
      explanation: "GraphQL's value proposition is flexibility — letting clients request exactly what they need when requirements change frequently. For fixed screens with stable requirements, you know exactly what data each screen needs. Custom REST endpoints per screen are simpler, more performant (no resolver overhead), and easier to optimize (targeted database queries vs. generic resolvers). GraphQL introduces complexity: schema maintenance, resolver logic, N+1 query problems, and query complexity limits. Option A is wrong — GraphQL supports subscriptions. Options C and D are factually incorrect.",
      interviewScript: "In your interview, say: 'GraphQL shines when requirements are fluid — frequently changing mobile screens, multiple clients needing different data shapes. With 3 fixed screens and stable requirements, dedicated REST endpoints are simpler to build, optimize, and maintain. The flexibility overhead of GraphQL provides no value here.'",
      proTip: "In system design interviews, the requirements are by definition fixed. That's why the content says GraphQL's benefits in interviews are 'murky.' Save GraphQL for when the interviewer explicitly mentions changing requirements or multi-client flexibility."
    },
    {
      id: "q34",
      category: "Scaling Strategy",
      question: "Your service handles 100K requests/second on a single beefy server (96 cores, 768GB RAM). The architect insists on horizontal scaling to 10 servers. What's the strongest argument AGAINST horizontal scaling in this scenario?",
      options: [
        { label: "A", text: "Horizontal scaling introduces distributed system complexity (load balancing, data partitioning, consensus, network latency) that doesn't exist on a single server; if one server handles the load, the operational simplicity is worth the theoretical SPOF risk, which can be mitigated with standby replicas" },
        { label: "B", text: "10 servers cost 10x more than one large server due to licensing costs" },
        { label: "C", text: "Horizontal scaling makes it impossible to use database transactions" },
        { label: "D", text: "Network bandwidth between 10 servers creates a bottleneck worse than the original server" }
      ],
      correct: 0,
      explanation: "Horizontal scaling introduces significant complexity: you need load balancers, distributed state management, network latency between services, data partitioning, and consensus protocols. If a single server handles the load with headroom, the operational simplicity is a major advantage. You can mitigate SPOF risk with a warm standby. Option B oversimplifies cost. Option C is wrong — distributed transactions exist. Option D isn't necessarily true.",
      interviewScript: "In your interview, say: 'I'd prefer vertical scaling here because the load fits on one server. Horizontal scaling introduces distributed system complexity — load balancing, data partitioning, network latency — that's unnecessary overhead. I'd mitigate SPOF risk with a warm standby rather than distributing the application.'",
      proTip: "The content says 'my personal preference is to employ vertical scaling wherever possible.' Mentioning this trade-off shows you understand that distributed systems complexity has a real cost."
    },
    {
      id: "q35",
      category: "Network Stack",
      question: "Your team is evaluating whether to implement a custom application protocol at the transport layer (kernel space) versus the application layer (user space). What is the key trade-off that makes application-layer protocols the default choice for most system designs?",
      options: [
        { label: "A", text: "Kernel-space protocols are faster but require OS-level changes that are difficult to deploy, update, and debug; application-layer protocols are flexible and modifiable without kernel patching" },
        { label: "B", text: "Application-layer protocols are faster because they avoid kernel context switching" },
        { label: "C", text: "Kernel-space protocols can't be encrypted, making them insecure for production use" },
        { label: "D", text: "Application-layer protocols have direct access to hardware acceleration that kernel-space protocols can't use" }
      ],
      correct: 0,
      explanation: "The content explains that the application layer is processed in 'User Space' whereas lower layers are in 'Kernel Space,' and that the application layer 'is more flexible and can be more easily modified than lower layers.' This is the fundamental trade-off: kernel-space protocols are fast but rigid (require OS updates, reboot cycles), while user-space protocols are flexible and easy to iterate on. Option B is backwards. Option C is wrong. Option D is wrong.",
      interviewScript: "In your interview, say: 'Application-layer protocols in user space trade some performance for dramatic flexibility. We can deploy, update, and debug them without kernel changes. For most applications, the performance difference is negligible compared to the agility benefit. We only drop to lower layers when we've exhausted application-level optimizations.'",
      proTip: "DPDK and io_uring are examples of technologies that blur this line — they give user-space code near-kernel-space performance. Mention these to show awareness of modern high-performance networking."
    },
    {
      id: "q36",
      category: "Network Stack",
      question: "When a browser navigates to https://example.com/api/users, multiple protocol layers are involved. A junior engineer asks why there's latency before any application data is exchanged. Which sequence correctly describes the overhead layers and why skipping any one of them is impossible?",
      options: [
        { label: "A", text: "DNS → TLS handshake → TCP handshake → HTTP request. DNS is needed for IP resolution; you can't skip TLS on HTTPS; TCP must handshake before reliable data transfer; HTTP is the application protocol" },
        { label: "B", text: "DNS → TCP handshake → TLS handshake → HTTP request. DNS resolves the domain; TCP must establish a reliable connection before TLS can negotiate encryption; TLS must complete before HTTP data can be safely exchanged" },
        { label: "C", text: "TCP handshake → DNS → TLS handshake → HTTP request. TCP connects first, then DNS resolves over the connection" },
        { label: "D", text: "HTTP request → DNS → TCP handshake → TLS handshake. The browser sends the request first and protocols are negotiated in response" }
      ],
      correct: 1,
      explanation: "The correct order is DNS → TCP → TLS → HTTP. DNS resolves the domain to an IP address (you can't open a TCP connection without knowing where). TCP's three-way handshake establishes a reliable connection. TLS negotiates encryption on top of the established TCP connection. Then HTTP sends the actual request. Each layer depends on the one below it. This represents at minimum 3-4 round trips before any application data flows.",
      interviewScript: "In your interview, say: 'Each layer has unavoidable setup overhead: DNS resolution, TCP's three-way handshake, TLS negotiation, then the actual HTTP request. That's 3-4 RTTs minimum before any application data flows. This is why persistent connections via HTTP keep-alive or HTTP/2 are critical — they amortize the TCP and TLS setup across multiple requests.'",
      proTip: "Mention that TLS 1.3 reduces the TLS handshake from 2 RTTs to 1 RTT, and QUIC combines the transport and TLS handshake into a single round trip."
    },
    {
      id: "q37",
      category: "Network Stack",
      question: "Your company has two data centers with separate public IPs. DNS returns both IPs with round-robin rotation and a 5-minute TTL. Data center A goes down at 2:00 PM. You update DNS to remove A's IP at 2:01 PM. At 2:10 PM, 20% of users still can't access your service. Why, and what would you have done differently?",
      options: [
        { label: "A", text: "The users at 2:10 PM are experiencing a TCP connection timeout because their browser is trying to connect to the cached IP of data center A, and the 5-minute TTL hasn't expired for their local DNS cache yet; to fix this, you'd use a lower TTL (e.g., 30-60 seconds) for faster failover" },
        { label: "B", text: "The users' ISP-level DNS resolvers are ignoring your TTL and caching the record for longer; to fix this, you'd use anycast IP addressing so both data centers share a single IP" },
        { label: "C", text: "DNS doesn't support removing individual IPs — you must replace the entire record set" },
        { label: "D", text: "The browsers are using HTTP connection pooling to maintain connections to the failed data center" }
      ],
      correct: 0,
      explanation: "With a 5-minute TTL, DNS records updated at 2:01 PM won't propagate to all clients until potentially 2:06 PM. The 20% at 2:10 PM likely includes clients whose resolvers cached just before the change or from ISPs with longer-than-advertised caching. Lower TTL is the direct fix. Option B mentions a real issue but anycast is a different solution. Option C is wrong. Option D isn't the primary cause.",
      interviewScript: "In your interview, say: 'DNS failover is bounded by TTL propagation. A 5-minute TTL means some users cache the failed IP for up to 5 minutes after the DNS update. I'd set a 60-second TTL for active-passive failover. Additionally, smart clients should try the next DNS record when the first IP fails — this provides application-level failover independent of DNS propagation.'",
      proTip: "Mention that this is why you should have TWO failover mechanisms: DNS-level (remove the IP) and application-level (client tries alternate IPs from the DNS response). Relying solely on DNS changes is too slow for production failover."
    },
    {
      id: "q38",
      category: "Load Balancing",
      question: "You're building a real-time multiplayer game with WebSocket connections. You initially deploy behind an L7 load balancer for its HTTP routing features. Players report frequent disconnections. You switch to an L4 load balancer and disconnections stop. But now you need to route different game modes (ranked vs casual) to different server pools based on a URL path. How do you solve this without losing the L4 benefits for WebSockets?",
      options: [
        { label: "A", text: "Use an L7 load balancer that explicitly supports WebSocket connections — many modern L7 LBs handle WebSocket upgrades correctly" },
        { label: "B", text: "Add an L7 load balancer in front of the L4 load balancer — L7 routes the HTTP upgrade request to the correct L4 pool based on URL path, then L4 maintains the persistent WebSocket connection" },
        { label: "C", text: "Implement client-side routing — the game client reads the server list from a registry and connects directly to the correct pool based on game mode" },
        { label: "D", text: "Use DNS-based routing with different subdomains per game mode: ranked.game.com and casual.game.com, each pointing to different L4 load balancers" }
      ],
      correct: 3,
      explanation: "DNS-based routing elegantly separates the concerns: different subdomains route to different L4 load balancer pools without any L7 processing in the WebSocket path. The client connects to ranked.game.com or casual.game.com, DNS resolves to the appropriate L4 LB, and L4 maintains the persistent connection. Option A works in practice (modern ALBs support WebSockets) but the question implies the L7 LB caused issues. Option B adds complexity. Option C is viable for internal services but exposes infrastructure to game clients.",
      interviewScript: "In your interview, say: 'I'd use DNS-based routing with separate subdomains per game mode, each pointing to dedicated L4 load balancers. This gives us URL-based routing via DNS without any L7 processing in the WebSocket connection path. The L4 LBs maintain persistent TCP connections without the idle timeout issues.'",
      proTip: "This pattern — using DNS for coarse-grained routing and L4 for connection management — is common in gaming and financial trading. It keeps the data path simple while still allowing logical traffic separation."
    },
    {
      id: "q39",
      category: "Server-Sent Events",
      question: "You're choosing between SSE and WebSockets for a live dashboard that updates every 2-3 seconds. The dashboard will be deployed in enterprise environments with corporate proxies you don't control. How does this deployment constraint affect your protocol choice?",
      options: [
        { label: "A", text: "SSE is better because it's standard HTTP and corporate proxies will always pass it through correctly" },
        { label: "B", text: "WebSockets are better because corporate proxies are more likely to buffer SSE's chunked responses (breaking real-time delivery) than to interfere with WebSocket's binary framing after the upgrade; additionally, WebSocket's explicit upgrade handshake signals to proxy that it's not a standard HTTP response to buffer" },
        { label: "C", text: "Neither works through corporate proxies — you must use simple HTTP polling" },
        { label: "D", text: "Use gRPC streaming, which is specifically designed to traverse corporate proxies" }
      ],
      correct: 1,
      explanation: "The content explicitly warns that 'nasty, misbehaving networks will batch up all SSE responses into a single response.' Corporate proxies are the worst offenders. WebSocket's HTTP upgrade signals a protocol switch that most modern proxies pass through. With SSE, the failure mode is silent: the connection appears open but events arrive in batches. Option A ignores the proxy buffering problem. Option D is wrong — gRPC has worse proxy support.",
      interviewScript: "In your interview, say: 'In enterprise environments, SSE's reliance on chunked transfer encoding makes it vulnerable to silent proxy buffering. WebSockets have a cleaner failure mode: the upgrade either succeeds or fails explicitly. For enterprise deployment where I don't control the proxy infrastructure, WebSockets are the safer choice.'",
      proTip: "Mention that HTTPS mitigates SSE proxy buffering, but many enterprises use TLS-terminating proxies that can still buffer. The proxy problem is never fully solved for SSE."
    },
    {
      id: "q40",
      category: "gRPC/Protobuf",
      question: "You're designing a system with 12 internal microservices and a public-facing mobile API. An architect proposes: 'Use gRPC everywhere for consistency.' A tech lead counters: 'Use REST everywhere for simplicity.' What's the optimal hybrid approach and what determines the boundary?",
      options: [
        { label: "A", text: "gRPC for all internal service-to-service communication (binary efficiency, strong typing, streaming); REST/JSON for the public mobile API (browser debuggability, universal client support, curl-ability). The boundary is: anything client-facing is REST, anything internal is gRPC" },
        { label: "B", text: "REST for read operations, gRPC for write operations, regardless of internal vs external" },
        { label: "C", text: "gRPC everywhere with a grpc-web proxy for mobile — consistency outweighs the proxy overhead" },
        { label: "D", text: "REST everywhere — the performance difference between JSON and protobuf is negligible at any scale" }
      ],
      correct: 0,
      explanation: "The content explicitly recommends 'REST for public-facing APIs and leaving gRPC for internal service-to-service communication.' The boundary is control: for internal services, you control both ends, so gRPC's tooling requirements are fine. For external clients you don't control, REST/JSON provides universal access. Option C adds unnecessary infrastructure. Option D ignores real performance gains.",
      interviewScript: "In your interview, say: 'The boundary between gRPC and REST should follow the control boundary. Internal services where we control both ends get gRPC — binary efficiency, strong typing, and streaming. External APIs where we don't control the client get REST — universal access, debuggability, and the entire HTTP ecosystem. An API gateway translates between them at the edge.'",
      proTip: "Mention that Google's own public-facing APIs use REST, while internal communication uses Stubby (their predecessor to gRPC). This validates the hybrid approach at massive scale."
    },
    {
      id: "q41",
      category: "Failure Handling",
      question: "Your service has both retries (with exponential backoff + jitter) and a circuit breaker on calls to a payment provider. The payment provider starts failing. Walk through the interaction between these two patterns. In what order do they activate, and what prevents them from conflicting?",
      options: [
        { label: "A", text: "The circuit breaker activates first, preventing any retries from executing — they never interact because the circuit breaker short-circuits before the retry logic runs" },
        { label: "B", text: "Retries activate first — each request retries 3 times with backoff. The circuit breaker monitors the total failure rate across all attempts. Once failures exceed the threshold, the circuit opens and all subsequent calls (including retries) fail immediately without reaching the provider. The circuit breaker is the outer pattern wrapping the retry logic" },
        { label: "C", text: "They conflict — retries and circuit breakers should never be used together because retries increase the failure count that trips the circuit breaker" },
        { label: "D", text: "They operate independently on different threads — retries handle individual request failures while circuit breakers handle system-wide failures" }
      ],
      correct: 1,
      explanation: "The correct layering is: circuit breaker wraps retry logic. When a call fails, retry logic executes (backoff + jitter). Each failed attempt registers as a failure with the circuit breaker. Once cumulative failures hit the threshold, the circuit breaker opens. Now all calls fail immediately without hitting the provider. This is the correct interaction: retries handle transient failures, circuit breaker handles sustained failures.",
      interviewScript: "In your interview, say: 'Retries and circuit breakers are complementary patterns at different scopes. Retries handle transient failures on individual requests. The circuit breaker monitors cumulative failure rate and, once tripped, provides fail-fast behavior that prevents retries from hammering a dead service. The circuit breaker is the outer pattern — when it's open, calls fail immediately without entering the retry loop.'",
      proTip: "Mention that the circuit breaker threshold should account for retry amplification. If each request retries 3 times, a 50% failure rate produces 3x the failure count the circuit breaker sees."
    },
    {
      id: "q42",
      category: "Regionalization",
      question: "Your global e-commerce platform uses a CDN for product images and a regional architecture (US-East, US-West, EU, Asia) for the API. A user in Tokyo adds an item to their cart via the Asia API server, then loads a product page that's served by the CDN. The CDN edge in Tokyo has a cached version of the product page that shows 'In Stock: 5' but the item is actually out of stock after the user's purchase. How do you ensure consistency between CDN-cached content and real-time inventory without defeating the purpose of the CDN?",
      options: [
        { label: "A", text: "Don't cache inventory counts in the CDN — make a real-time API call to the regional server for current stock status, while caching static content (images, descriptions, reviews) aggressively; separate static content caching from dynamic data" },
        { label: "B", text: "Set a 0-second TTL on all CDN-cached pages so they always refetch from origin" },
        { label: "C", text: "Use WebSockets to push inventory updates to the CDN edge nodes in real-time" },
        { label: "D", text: "Move inventory data to a global database so all CDN nodes can query it directly" }
      ],
      correct: 0,
      explanation: "The solution is to decompose the page into cacheable and non-cacheable parts. Product images, descriptions, and reviews change rarely — cache them aggressively at the CDN. Inventory counts change frequently — fetch them via a real-time API call to the regional server on each page load. This is a common pattern: the CDN serves the shell/static content, and JavaScript makes API calls for dynamic data. Option B defeats CDN benefits. Option C is impractical. Option D creates a global consistency bottleneck.",
      interviewScript: "In your interview, say: 'I'd separate cacheable from dynamic content. Static content like images and descriptions gets CDN caching with long TTLs. Dynamic data like inventory counts gets a real-time API call to the regional server. This preserves CDN performance benefits for 90% of the page while ensuring inventory accuracy.'",
      proTip: "This is called 'ESI' (Edge Side Includes) in CDN terminology — composing pages from cached fragments and dynamic API calls. Mention it to show you understand CDN architecture beyond basic caching."
    }
  ]
};

function LandingScreen({ onStart }) {
  const categoryTotals = {};
  QUIZ_DATA.categories.forEach(cat => {
    categoryTotals[cat] = QUIZ_DATA.questions.filter(q => q.category === cat).length;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-6">
            <Brain size={32} className="text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">{QUIZ_DATA.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">{QUIZ_DATA.description}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Target size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <Trophy size={16} className="text-gray-400" />
              <span className="text-gray-300">{QUIZ_DATA.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Zap size={18} className="text-amber-400" />
            Subtopic Coverage (by tier)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Heavy (3-4 questions each)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {["TCP vs UDP", "HTTP/HTTPS", "Load Balancing", "WebSockets", "Failure Handling"].map(cat => (
                  <div key={cat} className="text-sm text-gray-400">
                    {cat} <span className="text-gray-600">({categoryTotals[cat] || 0})</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Medium (2 questions each)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {["REST API Design", "gRPC/Protobuf", "Server-Sent Events", "WebRTC", "Client-Side LB", "Regionalization", "GraphQL"].map(cat => (
                  <div key={cat} className="text-sm text-gray-400">
                    {cat} <span className="text-gray-600">({categoryTotals[cat] || 0})</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Thin (1 question, cross-links included)</h3>
              <div className="text-sm text-gray-400">
                Scaling Strategy, Network Stack, and bridges
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-lg"
        >
          <Zap size={20} />
          Start Quiz
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({ question, questionIndex, total, score, onAnswer, onSkip, selectedAnswer, showFeedback, onNext, timer }) {
  const isCorrect = selectedAnswer !== null && selectedAnswer !== -1 && selectedAnswer === question.correct;
  const isSkipped = selectedAnswer === -1;

  return (
    <div className="min-h-screen bg-gray-950 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-400 uppercase">Question {questionIndex + 1} / {total}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timer <= 15 ? "bg-red-500/10 border border-red-500/30" : timer <= 30 ? "bg-amber-500/10 border border-amber-500/30" : "bg-gray-800 border border-gray-700"}`}>
              <Timer size={16} className={timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-400"} />
              <span className={`text-sm font-semibold ${timer <= 15 ? "text-red-400" : timer <= 30 ? "text-amber-400" : "text-gray-300"}`}>{timer}s</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold flex-shrink-0">
              {question.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showFeedback && onAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border ${
                  showFeedback
                    ? idx === question.correct
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : selectedAnswer === idx && idx !== question.correct
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-gray-800 border-gray-700 text-gray-400"
                    : selectedAnswer === idx
                    ? "bg-blue-500/10 border-blue-500 text-blue-300"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg flex-shrink-0">{option.label}</span>
                  <span className="flex-1">{option.text}</span>
                  {showFeedback && idx === question.correct && <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                  {showFeedback && selectedAnswer === idx && idx !== question.correct && <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />}
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  Why
                </h3>
                <p className="text-sm text-gray-300">{question.explanation}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Brain size={16} className="text-blue-400" />
                  Interview Script
                </h3>
                <p className="text-sm text-gray-300">{question.interviewScript}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Pro Tip
                </h3>
                <p className="text-sm text-gray-300">{question.proTip}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showFeedback ? (
            <>
              <button
                onClick={onSkip}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold transition-all duration-200"
              >
                Skip
              </button>
            </>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {questionIndex === total - 1 ? "See Results" : "Next Question"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ score, total, answers, questions, onRestart }) {
  const pct = Math.round((score / total) * 100);
  let grade = { label: "A+", desc: "Mastery-level performance", bg: "bg-emerald-500/10", border: "border-emerald-500/30", color: "text-emerald-400", GradeIcon: Trophy };
  if (pct < 60) grade = { label: "F", desc: "Review fundamentals", bg: "bg-red-500/10", border: "border-red-500/30", color: "text-red-400", GradeIcon: XCircle };
  else if (pct < 70) grade = { label: "D", desc: "Needs improvement", bg: "bg-red-500/10", border: "border-red-500/30", color: "text-red-400", GradeIcon: AlertTriangle };
  else if (pct < 80) grade = { label: "C", desc: "Competent, but room to grow", bg: "bg-amber-500/10", border: "border-amber-500/30", color: "text-amber-400", GradeIcon: AlertTriangle };
  else if (pct < 90) grade = { label: "B", desc: "Solid understanding", bg: "bg-blue-500/10", border: "border-blue-500/30", color: "text-blue-400", GradeIcon: CheckCircle };
  else grade = { label: "A+", desc: "Mastery-level performance", bg: "bg-emerald-500/10", border: "border-emerald-500/30", color: "text-emerald-400", GradeIcon: Trophy };

  const GradeIcon = grade.GradeIcon;
  const categoryScores = {};
  questions.forEach((q, idx) => {
    if (!categoryScores[q.category]) categoryScores[q.category] = { correct: 0, total: 0 };
    categoryScores[q.category].total += 1;
    if (answers[idx] === q.correct) categoryScores[q.category].correct += 1;
  });

  const incorrect = questions.filter((q, idx) => answers[idx] !== q.correct && answers[idx] !== -1);

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
              {incorrect.map((q) => {
                const idx = questions.findIndex(x => x.id === q.id);
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-700 text-gray-400 text-xs font-mono flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed">{q.question}</p>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2 text-sm">
                        <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-300">Your answer: <span className="text-red-400 font-medium">
                          {answers[idx] === -1 ? 'Skipped' : `${q.options[answers[idx]].label}. ${q.options[answers[idx]].text}`}
                        </span></span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-300">Correct: <span className="text-emerald-400 font-medium">{q.options[q.correct].label}. {q.options[q.correct].text}</span></span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                  </div>
                );
              })}
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

export default function NetworkingEssentialsQuiz({ quizSlug = 'core-concepts-networking-essentials' }) {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(90);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);

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
    startNewAttempt(questions.map(q => q.id));
  };

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);
    stopTimer();
    const q = questions[currentQ];
    const isCorrect = idx === q.correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
    persistAnswer(q.id, {
      selectedIndex: idx,
      correctIndex: q.correct,
      isCorrect,
      confidence: null,
      timedOut: false,
    });
  };

  const handleSkip = () => {
    setSelectedAnswer(-1);
    setShowFeedback(true);
    stopTimer();
    setAnswers(prev => [...prev, -1]);
    const q = questions[currentQ];
    persistAnswer(q.id, {
      selectedIndex: -1,
      correctIndex: q.correct,
      isCorrect: false,
      confidence: null,
      timedOut: true,
    });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      startTimer();
    } else {
      completeQuiz({ correct: score, total: questions.length }, 0);
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
      onSkip={handleSkip}
      selectedAnswer={selectedAnswer}
      showFeedback={showFeedback}
      onNext={handleNext}
      timer={timer}
    />
  );
}
