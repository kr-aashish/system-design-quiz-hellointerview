// === COVERAGE MANIFEST ===
// Source: "Core Concepts" — System Design in a Hurry (overview page)
// Type: BREADTH SURVEY across 9 technology-agnostic primitives
// Ladder enforced per Part: L1 → L2 → L3 → L4 → L5 (climbs, never jumps)
//
// PARTS & CONCEPT IDs:
//
// Part A — Networking Essentials
//   A1 HTTP-over-TCP is the safe default (~90% of cases)
//   A2 SSE unidirectional vs WebSockets bidirectional
//   A3 WS/SSE are stateful — naive LBs fail; persistent connections + server-death handling
//   A4 gRPC: binary + HTTP/2 fast; internal-only because browsers lack native support; gRPC-Web is a workaround
//   A5 L7 LB routes by HTTP content
//   A6 L4 LB at TCP level — required for WebSockets (persistent TCP)
//   A7 Anti-pattern: WebSockets-by-default when SSE/long-poll would do
//   A8 Speed-of-light floor: NY↔London ≈ 80ms minimum
//   A9 Geographic latency → regional deployments / CDNs at edge
//   Questions: q1 (L1), q2 (L2), q3 (L3), q4 (L4), q5 (L5)
//
// Part B — API Design
//   B1 Most interviewers don't reward perfect API design
//   B2 REST is the 90% default — resources mapped to URLs
//   B3 Time-budget: 4-5 endpoints in a couple minutes; 10+ minutes is too deep
//   B4 Pagination: cursor for fast-changing lists, offset elsewhere
//   B5 AuthN: JWT for sessions, API keys for service-to-service
//   B6 Rate limiting: mention only when abuse vector exists
//   Questions: q6 (L1), q7 (L2), q8 (L3), q9 (L4), q10 (L5)
//
// Part C — Data Modeling
//   C1 Relational vs NoSQL is the upfront choice
//   C2 Relational fit: structured + relationships + strong consistency + transactions
//   C3 NoSQL fit: flexible schemas + horizontal scale without complex joins
//   C4 Normalization — split tables, consistent updates, joins get expensive
//   C5 Denormalization — duplicate data, fast reads, expensive writes
//   C6 Interview default: start normalized; denormalize hot paths only on evidence
//   C7 Interviewers reward tradeoff understanding, not blind technique
//   C8 NoSQL forces access-pattern-first design (DynamoDB partition + sort keys)
//   C9 NoSQL gotcha: queries off partition key become full-table scans
//   Questions: q11 (L1), q12 (L2), q13 (L3), q14 (L4), q15 (L5)
//
// Part D — Database Indexing
//   D1 No index → full table scan; index → direct jump in ms
//   D2 B-tree default; supports exact + range
//   D3 Hash index faster on exact, no ranges
//   D4 Specialized indexes: full-text, geospatial
//   D5 Index columns you query frequently
//   D6 Compound index for multi-column predicates
//   D7 Beyond primary DB → external (Elasticsearch, PostGIS)
//   D8 External indexes sync via CDC; lag behind primary
//   Questions: q16 (L1), q17 (L2), q18 (L3), q19 (L4), q20 (L5)
//
// Part E — Caching
//   E1 Redis ~1ms vs DB 20-50ms; 20-50x speedup
//   E2 Reduces DB load; defers DB scaling
//   E3 Cache-aside is the 90% pattern
//   E4 Hardest part: invalidation; strategies: invalidate-on-write, short TTL, both
//   E5 Cache stampede: Redis dies → DB collapses; mitigations
//   E6 Anti-pattern: cache everything
//   E7 CDN caching is for static assets at edge
//   E8 In-process cache for small rarely-changing values (config, flags)
//   E9 External Redis is default for core app data
//   Questions: q21 (L1), q22 (L2), q23 (L3), q24 (L4), q25 (L4-bonus), q26 (L5)
//
// Part F — Sharding
//   F1 Sharding triggers: storage past TB, write throughput, read throughput beyond replicas
//   F2 Shard key is the most consequential decision
//   F3 user_id sharding: user-scoped fast, global queries scatter-gather
//   F4 Hash-based: even distribution, standard
//   F5 Range-based: hot spots easy
//   F6 Directory-based: flexible but adds dependency + latency
//   F7 Biggest mistake: sharding too early
//   F8 Capacity math first
//   F9 Cross-shard transactions become impossible
//   F10 Hot spots: one shard gets disproportionate traffic
//   F11 Resharding is painful
//   F12 Interview move: justify single-DB doesn't work → state shard key → state tradeoff
//   Questions: q27 (L1), q28 (L2), q29 (L3), q30 (L4), q31 (L4-bonus), q32 (L5)
//
// Part G — Consistent Hashing
//   G1 Modulo problem: adding a node remaps almost every key
//   G2 Virtual ring: keys + servers placed; key → next clockwise server
//   G3 Add server: only ring-neighbor keys move
//   G4 Quantitative win: ~10% movement vs ~90% with modulo
//   G5 Used in: distributed caches, sharded DBs, some LBs, CDNs
//   G6 In interviews rarely need to explain mechanics
//   G7 Bring up explicitly for elastic scaling
//   Questions: q33 (L1), q34 (L2), q35 (L3), q36 (L4), q37 (L5)
//
// Part H — CAP Theorem
//   H1 Pick 2 of 3: C, A, P
//   H2 Partitions unavoidable → real choice is C vs A
//   H3 C-during-partition: refuse stale, may go down
//   H4 A-during-partition: keep serving, may diverge
//   H5 User-facing default: A + eventual consistency
//   H6 Eventual ≠ weak; eventual GUARANTEES convergence
//   H7 Strong needed for money / inventory / booking
//   H8 Mixed consistency in one app is normal
//   H9 PACELC: Else, Latency vs Consistency
//   Questions: q38 (L1), q39 (L2), q40 (L3), q41 (L4), q42 (L4-bonus), q43 (L5)
//
// Part I — Numbers to Know
//   I1 Don't BOE-math at start; do it when making a decision
//   I2 Modern hardware much more powerful than candidates assume
//   I3 Single Redis: hundreds of thousands of ops/sec
//   I4 Tuned DB: tens of thousands of QPS
//   I5 Latency hierarchy: ns memory < µs SSD < 1-10ms intra-DC < tens-100s ms cross-continent
//   I6 Latency gaps drive caching + geographic decisions
//   I7 In-context capacity walkthrough (50K req/s ÷ 5K/server ≈ 10)
//   I8 Single Postgres handles a few TB; sharding triggers at tens-to-hundreds of TB
//   I9 Per-component specs (caching, DB, app servers, MQ)
//   I10 Scale triggers per component
//   Questions: q44 (L1), q45 (L2), q46 (L3), q47 (L4), q48 (L5)
//
// CROSS-PART BRIDGES (woven into L4/L5 slots):
//   q5  — gRPC limits × geographic latency (A4 × A8) — implementation gotcha + speed-of-light
//   q15 — Data Modeling × Indexing × Caching (C × D × E) — two-levels-of-indirection ordering
//   q19 — Indexing × Search-DB × CDC (D7 × D8) — operational sync trade-off
//   q26 — Caching layers × CDN (E7 × E8 × E9) — pick-the-right-layer
//   q31 — Sharding × distributed transactions (F9 × F10) — cross-shard + hot spots
//   q47 — Numbers × Caching (I3 × E1) — modern Redis throughput vs premature scaling
//   q48 — Numbers × every-component (I9 × I10) — scale triggers cross-cutting
//
// L5 CANON PATTERN USAGE (need ≥4 of 7; ALL 7 used here):
//   1. Trade-off inversion: q10, q14, q32, q43
//   2. Framing-is-wrong: q4, q10, q37
//   3. Cross-Part synthesis: q15, q26, q48
//   4. Subtle distractors: q42 (eventual vs weak)
//   5. Operational/cost: q19, q20
//   6. Failure mode: q24, q31
//   7. Estimation-backed scenario / future-proofing: q5, q30, q47, q48
//   8. Implementation-specific gotcha: q5 (gRPC-Web), q19 (CDC lag)
//   ⇒ All 7 patterns represented ✓
//
// Total: 48 questions across 9 Parts (A–I)
// Difficulty distribution: ~19% L1, ~19% L2, ~19% L3, ~25% L4, ~19% L5
// Coverage: every concept ID (A1–I10) maps to ≥1 question
// Anti-Recall guard: every question is a scenario with explicit consequences/tradeoffs;
//                    no "which of these is NOT one of the listed X" patterns.
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import { Clock, CheckCircle, XCircle, ChevronRight, RotateCcw, Award, AlertTriangle, Zap, Brain, Target, Trophy, Timer, ArrowRight, BarChart3 } from "lucide-react";

const QUIZ_DATA = {
  title: "Core Concepts: System Design Foundations",
  description: "The 9 technology-agnostic primitives that underpin every system design interview — networking, APIs, data modeling, indexing, caching, sharding, consistent hashing, CAP, and the numbers that make BOE math actually useful. 48 questions test conceptual reasoning, trade-offs, and operational depth — not source-text recall.",
  estimatedTime: "~60 min",
  difficulty: "FAANG SDE2 / Senior — Very Hard",
  categories: [
    "Networking",
    "API Design",
    "Data Modeling",
    "Indexing",
    "Caching",
    "Sharding",
    "Consistent Hashing",
    "CAP Theorem",
    "Numbers"
  ],
  questions: [
    {
      id: "q1",
      category: "Networking",
      difficulty: "L1",
      question: "A teammate is starting a new internal service and asks: 'What protocol should I use for service-to-service communication?' For ~90% of system design problems, what is the safe default that an interviewer expects you to assume unless you have a specific reason to deviate?",
      options: [
        { label: "A", text: "HTTP over TCP — universally supported, well-understood, and handles the vast majority of use cases" },
        { label: "B", text: "UDP for everything — it's faster than TCP and more modern" },
        { label: "C", text: "WebSockets — they're modern and support real-time applications" },
        { label: "D", text: "gRPC always — binary serialization is the obvious win" }
      ],
      correct: 0,
      explanation: "HTTP-over-TCP is the safe default. The article: 'For most systems, you'll default to HTTP over TCP. It's well-understood, works everywhere, and handles 90% of use cases.' Reach for WebSockets, SSE, or gRPC only when the workload's specific requirements (bidirectional real-time, server push, internal binary RPC) actually justify the additional complexity. Defaulting to gRPC, WebSockets, or UDP without justification signals you reach for tools without grounding the choice in the problem.",
      interviewScript: "Say: 'I'll use HTTP over TCP for the public API — it's the natural default and the interviewer doesn't need a justification for it. If we hit a specific requirement that breaks that default — server push, browser bidirectional, very-low-latency internal RPC — I'll switch then and explain why.'",
      proTip: "The senior signal isn't picking an exotic protocol; it's defending why you DIDN'T pick one. Anchor every protocol decision to a concrete requirement of the workload."
    },
    {
      id: "q2",
      category: "Networking",
      difficulty: "L2",
      question: "You're designing a stock-price ticker that pushes price updates to logged-in users. The client never needs to send anything back over the same connection — just receive prices as they change. Which protocol is the simplest correct fit, and why?",
      options: [
        { label: "A", text: "WebSockets — 'real-time' always means WebSockets" },
        { label: "B", text: "Server-Sent Events (SSE) — the data flow is server→client only, and SSE rides standard HTTP infrastructure with a one-time client handshake. It's simpler than WebSockets when the client doesn't need to push" },
        { label: "C", text: "Long-polling — the only real-time-friendly option" },
        { label: "D", text: "Plain HTTP polling once a second — modern HTTP is fast enough" }
      ],
      correct: 1,
      explanation: "SSE is unidirectional: the client opens an HTTP connection once, then the server streams data down it. The article: 'SSE is unidirectional — the client makes an initial HTTP request to open the connection, and then the server pushes data down that connection (like live scores or notifications).' WebSockets are bidirectional and add the cost of stateful connections at scale; you don't need that cost when the client never pushes. SSE is also friendlier with standard HTTP infrastructure (proxies, gzip, auth) than WebSockets.",
      interviewScript: "Say: 'For server-push-only workloads — live scores, stock tickers, notifications — SSE is the right fit. The client never pushes back, so I get the simpler protocol AND I can use standard HTTP infrastructure (auth, proxies, compression) without WebSocket-specific gotchas.'",
      proTip: "Mental model: WS = both sides talk; SSE = server talks; HTTP = either side issues a request and waits for a response. Pick the smallest one that fits the actual data flow."
    },
    {
      id: "q3",
      category: "Networking",
      difficulty: "L3",
      question: "Your real-time chat service uses WebSockets. You put it behind your standard application-routing load balancer (the kind that inspects HTTP request paths to route between services), and it starts mysteriously dropping connections under load. What is the underlying reason, and what type of LB do you actually need?",
      options: [
        { label: "A", text: "WebSocket connections are a persistent TCP stream. An L7 (application-layer) load balancer is built around one-shot HTTP request/response and doesn't natively forward long-lived stateful connections — when the LB tries to load-balance per-request, it drops the upgraded connection. WebSockets typically need an L4 (TCP-level) load balancer that just forwards bytes on the connection, or an L7 that explicitly supports the WebSocket upgrade and treats the connection as sticky" },
        { label: "B", text: "WebSockets require port 443 only; L7 balancers default to port 80" },
        { label: "C", text: "WebSockets are not a TCP protocol; you need a UDP load balancer" },
        { label: "D", text: "L7 balancers deliberately drop persistent connections for security reasons" }
      ],
      correct: 0,
      explanation: "The article: 'For WebSockets, you typically need Layer 4 balancing because you're maintaining a persistent TCP connection.' L7 LBs operate at the HTTP-request level (route by path/host/header) and are built for short request/response cycles. L4 LBs operate at the TCP level — they forward bytes on the connection without needing to understand HTTP — making them the right tool for long-lived persistent connections like WS. Side note: many modern L7 LBs DO support WebSockets explicitly via the upgrade handshake, but the 'naive HTTP LB' assumed in the question doesn't.",
      interviewScript: "Say: 'WebSockets are a persistent TCP connection — once upgraded, the LB has to forward bytes on that connection for its full lifetime, not load-balance per-request. So I need either an L4 TCP load balancer, or an L7 LB that explicitly supports the WebSocket upgrade and treats the connection as sticky to a backend.'",
      proTip: "L4 = bytes on TCP. L7 = HTTP-aware routing (path, host, header). Most candidates conflate them — naming the layer at which the LB operates is a small interview signal of depth."
    },
    {
      id: "q4",
      category: "Networking",
      difficulty: "L4",
      question: "A candidate proposes WebSockets between two internal services because 'we need real-time inter-service calls.' What is the most senior critique?",
      options: [
        { label: "A", text: "WebSockets are great between internal services — fastest possible protocol" },
        { label: "B", text: "WebSockets are an unusual choice for service-to-service: there's no browser involved (so HTTP/JSON limitations don't apply), the bidirectional-streaming requirement isn't usually present (most service calls are RPC-shaped: request→response), and you pay the cost of stateful long-lived connections at scale without the benefit. For internal service-to-service where performance matters, gRPC over HTTP/2 is the natural fit — binary serialization, streaming when you need it, RPC ergonomics. Reaching for WebSockets here usually means the candidate confused 'low-latency' with 'streaming-required'" },
        { label: "C", text: "WebSockets are too slow for internal service calls" },
        { label: "D", text: "Internal services can only use UDP, never WebSockets" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong L5-pattern. The article: 'A common mistake is proposing WebSockets when HTTP with long polling or Server-Sent Events would work fine. WebSockets add significant complexity for maintaining stateful connections at scale. Only reach for them when you genuinely need bidirectional real-time communication.' For internal service calls, the article specifically points at gRPC: 'gRPC is worth mentioning for internal service-to-service communication when performance is critical. It uses binary serialization and HTTP/2.' WebSockets are the wrong tool by default — they buy bidirectional persistence the workload doesn't need.",
      interviewScript: "Say: 'For internal service-to-service I'd reach for gRPC — binary protobuf, HTTP/2 multiplexing, RPC ergonomics — not WebSockets. Most service calls are request/response, not streams. WebSockets add stateful-connection complexity without the bidirectional-streaming requirement that justifies them.'",
      proTip: "REST externally, gRPC internally is the canonical pattern. Mention it explicitly — it shows you know the article's specific recommendation, not just 'use gRPC.'"
    },
    {
      id: "q5",
      category: "Networking",
      difficulty: "L5",
      question: "Your team chose gRPC for a public-facing API that backs a browser-based dashboard. Latency profiling on a London → Virginia round trip shows ~85ms minimum even with no work done. Two surprises arise: (1) the browser dashboard team can't directly call your gRPC API, and (2) the 85ms floor doesn't move regardless of optimization. Which explanation correctly diagnoses BOTH?",
      options: [
        { label: "A", text: "gRPC is incompatible with HTTPS, blocking browser support; the 85ms is a TLS handshake artifact" },
        { label: "B", text: "(1) Browsers don't natively support gRPC — clients must use gRPC-Web, which requires a translating proxy and doesn't support all gRPC features (notably bidirectional streaming). 'Public-facing API + browser client' is therefore the wrong fit for raw gRPC. (2) The 85ms floor is the speed-of-light through fiber London↔Virginia round-trip; physics, not optimization. Combined fix: use REST (or gRPC-Web with a proxy) for browser-facing endpoints, and reduce the geographic latency with a regional deployment / CDN-edge / EU-based replicas — you can't make Atlantic light faster" },
        { label: "C", text: "gRPC is slower than REST in production; switching to REST removes both issues" },
        { label: "D", text: "The 85ms is the native gRPC handshake overhead; switching to gRPC-Web removes both issues" }
      ],
      correct: 1,
      explanation: "Implementation-gotcha + estimation-backed L5. The article: 'browsers don't natively support gRPC (gRPC-Web exists as a workaround, but it requires a proxy and doesn't support all gRPC features).' AND: 'A request from New York to London has a minimum latency of around 80ms just from the speed of light through fiber optic cables.' London↔Virginia is similar order. Two completely independent issues happen to surface together: (1) public-facing browser client + raw gRPC = wrong fit, (2) cross-Atlantic round trip = physics. Conflating them — or thinking the 85ms is gRPC overhead — misses both root causes.",
      interviewScript: "Say: 'Two separate problems. First, browsers can't speak raw gRPC — they need gRPC-Web with a proxy, and not all gRPC features (like bidirectional streaming) work through it. So the public-facing API should be REST or gRPC-Web. Second, 85ms London-to-Virginia is the speed-of-light floor through fiber. You don't optimize that away — you put data closer to users with regional replicas, CDNs at edge, or geographic deployment.'",
      proTip: "Memorize the speed-of-light numbers: NY↔London ~80ms, NY↔Tokyo ~150ms, intra-region <5ms. Citing them in capacity discussions instantly signals you reason about physics, not just code."
    },
    {
      id: "q6",
      category: "API Design",
      difficulty: "L1",
      question: "You're 8 minutes into a system design interview and need to sketch an endpoint for 'get a single user by ID.' Without overthinking it, what's the canonical REST representation an interviewer expects?",
      options: [
        { label: "A", text: "POST /getUser with body { user_id: 123 }" },
        { label: "B", text: "GET /users/{id}" },
        { label: "C", text: "WebSocket message of type 'fetch_user'" },
        { label: "D", text: "gRPC method UserService.Get(id)" }
      ],
      correct: 1,
      explanation: "The article: 'For 90% of interviews, you'll default to REST. It maps resources to URLs and uses HTTP methods to manipulate them. Think /users/{id} for getting a user.' GET /users/{id} is the canonical resource-as-URL + verb-as-method shape. POST /getUser (A) is RPC-over-HTTP — fine in some shops but not the REST default an interviewer expects. WS (C) and gRPC (D) are wrong tools for a public read endpoint by default.",
      interviewScript: "Say: 'GET /users/{id} for the read, POST /users for create, PATCH /users/{id} for update, DELETE /users/{id} for delete. I'll keep the rest of the API in this shape and not spend whiteboard time on it unless you want me to.'",
      proTip: "Verb-as-HTTP-method is the small detail that signals familiarity. POST for create, PATCH for partial update, PUT for full replace, DELETE for delete, GET for read."
    },
    {
      id: "q7",
      category: "API Design",
      difficulty: "L2",
      question: "You have ~45 minutes total for the interview, and you're 12 minutes in still designing detailed API request/response schemas (validation rules, error code taxonomy, etc). How does this affect your interview signal, and what's the right time-budget?",
      options: [
        { label: "A", text: "Strong positive — thorough API design shows attention to detail and senior rigor" },
        { label: "B", text: "Negative. Most interviewers want 4-5 reasonable endpoints sketched in a couple of minutes and then movement on to the harder architectural problems. Spending 10+ minutes on API details signals you don't know where the architectural depth lives — which is in data flow, scaling decisions, and trade-offs, not in error-code taxonomies. Sloppy APIs are penalized, but over-detailed APIs cost you the time you needed for the questions that actually differentiate seniors" },
        { label: "C", text: "Neutral — APIs always take this long" },
        { label: "D", text: "Positive only if the interviewer is from the API platform team" }
      ],
      correct: 1,
      explanation: "The article: 'You should be able to sketch out 4-5 key endpoints in a couple minutes and move on. If you find yourself still designing API details 10 minutes into the interview, you're going too deep.' API design isn't where senior signal comes from — it's a sanity-check, not a substantive section. Senior candidates name the resource shape, list the verbs, move on. Spending too long here is the same anti-pattern as exhaustive SQL-vs-NoSQL comparisons: you're filling time on the easy stuff and starving the hard stuff.",
      interviewScript: "Say: 'Here are five endpoints — GET /users/{id}, POST /users, GET /events/{id}/bookings, POST /events/{id}/bookings, DELETE /bookings/{id}. I'll come back if anything needs nuance. Let's talk about the data model.' Two minutes, one sentence of justification per non-obvious choice, move on.",
      proTip: "Treat API design as a checkpoint, not a milestone. Hit it, move on. Save deep-dive minutes for sharding strategy, consistency choices, and capacity math — that's where the score lives."
    },
    {
      id: "q8",
      category: "API Design",
      difficulty: "L3",
      question: "Your social feed API serves a constantly-growing list of posts (new ones inserted at the top). A user scrolls back through old posts using `?offset=200&limit=20`. Between request 1 and request 2, three new posts arrive at the top of the list. What problem does the user experience, and what's the fix?",
      options: [
        { label: "A", text: "No problem — offset paginates correctly regardless of inserts" },
        { label: "B", text: "Three posts the user already saw on page 1 reappear on page 2 because the offset shifted by 3 (the new posts pushed the old ones into the next page's window). Offset-based pagination duplicates or skips items as the underlying list shifts. Cursor-based pagination (e.g., 'give me 20 items after this stable post-id') is stable against inserts because the cursor anchors to a specific post in the data, not a count from the top — even as the list grows, the next page after cursor X is the same set of items" },
        { label: "C", text: "The server crashes because offset queries are O(n) on large lists" },
        { label: "D", text: "Posts are returned in random order" }
      ],
      correct: 1,
      explanation: "The article: 'Cursor-based works better for real-time data where new items get added frequently, but offset-based is fine for most cases.' This is exactly the failure mode cursor-based fixes. With offset, page boundaries are positions in a counted list — they shift when the underlying list changes. With cursor, page boundaries are stable identifiers in the data — adding new items at the top doesn't change which item is 'after item X.' Bonus: offset queries are also O(N) at high offsets in many DBs, while cursor queries can stay O(log N) with a proper index.",
      interviewScript: "Say: 'For a feed where items are inserted at the top, I'd use cursor-based pagination — each page is anchored to a stable post-id, so new posts arriving at the top don't shift the page boundaries. Offset-based pagination works fine for static lists but creates duplicates and skips on a fast-changing feed.'",
      proTip: "The cursor is usually an opaque-encoded (timestamp, id) pair. It's stable, sortable, and tells the server exactly where to resume — without leaking implementation details to the client."
    },
    {
      id: "q9",
      category: "API Design",
      difficulty: "L4",
      question: "You're 5 minutes into your API sketch and the interviewer asks: 'how do you authenticate users?' What's the right depth and shape of answer for a system design interview?",
      options: [
        { label: "A", text: "30-second answer: 'Users get a JWT on login, included in the Authorization header on subsequent requests. Service-to-service calls use API keys (or mTLS in stricter setups). Token rotation on refresh; revoked tokens go in a small denylist with TTL matching token expiry.' Then move on. The interviewer wants to see you know the standard pattern — they don't want a 10-minute OAuth deep-dive" },
        { label: "B", text: "Spend 10 minutes designing the OAuth 2.0 authorization-code-with-PKCE flow with all 7 endpoints and refresh-token rotation logic" },
        { label: "C", text: "Skip the question — auth is too detailed for system design" },
        { label: "D", text: "Start by debating which JWT signing algorithm to use (RS256 vs HS256 vs EdDSA)" }
      ],
      correct: 0,
      explanation: "The article: 'For authentication, use JWT tokens for user sessions and API keys for service-to-service calls.' One line of guidance — that's the depth the article expects. The 30-second answer hits the user-vs-service distinction, names the standard tokens, and moves on. B turns a checkpoint into a deep-dive that costs you architecture time. D rat-holes on cryptography. The interviewer asked because they wanted a standard answer fast, not because they wanted to test OAuth flow knowledge.",
      interviewScript: "Say: 'JWT for user sessions in the Authorization header — short-lived (15-minute access, 7-day refresh), RS256-signed so the API gateway can verify without calling the auth service. API keys (or mTLS) for service-to-service. Revocation via a small denylist keyed by token-id with TTL matching token expiry.' Three sentences. Done.",
      proTip: "When the interviewer asks about a checkpoint topic (auth, rate limit, pagination), give the short canonical answer fast. The signal is recognizing it's a checkpoint, not a milestone."
    },
    {
      id: "q10",
      category: "API Design",
      difficulty: "L5",
      question: "A candidate adds 'rate limiting at the API gateway' to every system they design — Twitter, Uber, Netflix, an internal company chatbot. The interviewer asks: 'why rate limiting on Netflix's video catalog browsing API for logged-in users?' The candidate stutters. What is the senior way to think about when to MENTION rate limiting?",
      options: [
        { label: "A", text: "Rate limiting is always essential — the candidate just didn't articulate it well" },
        { label: "B", text: "Rate limiting matters when there's a credible abuse vector: scraping (Twitter), expensive ops (paid LLM API), DOS protection on login/signup endpoints, or per-tenant fairness in multi-tenant SaaS. Browsing a video catalog for a logged-in user has none of those. Adding rate limits everywhere defaults to 'I memorized a checklist' — senior candidates name rate limiting only when they can point at the specific abuse vector it prevents. The trap is treating cross-cutting concerns as universal good practices instead of specific responses to specific risks" },
        { label: "C", text: "Netflix uses CDN, so rate limiting doesn't apply to their APIs" },
        { label: "D", text: "Rate limiting is purely a security feature and doesn't belong in API design conversations" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong + trade-off-inversion L5. The article: 'if your system could get hammered by bots or abuse, mention rate limiting. But don't go deep on any of these unless the interviewer specifically asks.' The rule isn't 'always mention rate limiting' — it's 'mention it when you can name the abuse vector.' Treating it as a universal best practice rather than a context-specific response is what reveals junior thinking: the candidate has memorized 'add rate limiting' but hasn't internalized 'why.'",
      interviewScript: "Say: 'I'd add rate limiting on the login endpoint specifically — credential-stuffing protection — and on any expensive operation like search or LLM calls. For ordinary authenticated reads I wouldn't add it unless we're seeing scraping or per-tenant fairness issues. Adding rate limits everywhere by default just adds operational complexity for no protective benefit.'",
      proTip: "Same principle for every cross-cutting concern: name the specific risk it prevents. 'Add caching everywhere,' 'add retries everywhere,' 'add circuit breakers everywhere' — all are anti-patterns when applied without contextual justification."
    },
    {
      id: "q11",
      category: "Data Modeling",
      difficulty: "L1",
      question: "You're storing data for an e-commerce site: users, orders, order items, products. Orders reference users; order items reference orders and products. The data is structured, well-typed, and you need to keep it consistent on writes (no orphan order without a user). What category of database is the natural starting choice?",
      options: [
        { label: "A", text: "Relational (Postgres, MySQL) — you have clear entity relationships, structured data, transactions for the order flow, and foreign-key integrity. The article: relational works great when you have 'structured data with clear relationships and need strong consistency'" },
        { label: "B", text: "Document store — JSON gives you more flexibility" },
        { label: "C", text: "Key-value store — only the user_id matters" },
        { label: "D", text: "Graph DB — orders and products form a graph" }
      ],
      correct: 0,
      explanation: "The article: 'Relational databases like Postgres work great when you have structured data with clear relationships and need strong consistency. Things like user accounts linking to orders linking to products.' This is literally the example scenario. Choose NoSQL when schemas evolve fast or when you need horizontal scale without complex joins — neither applies here. Document/KV/graph each fit specific problems; the e-commerce starter pattern is relational.",
      interviewScript: "Say: 'I'll start with Postgres. The data is structured with clear FK relationships (orders → users, order_items → orders → products), I need transactions for the order flow so we don't end up with half-created orders, and the query patterns include joins (user's order history, product's sales). NoSQL is the right tool when those properties don't apply — they do here.'",
      proTip: "Default to relational unless you can name a specific reason NoSQL fits better (flexible schema, horizontal scale needs, KV-shaped access). 'Just because it's modern' isn't a reason."
    },
    {
      id: "q12",
      category: "Data Modeling",
      difficulty: "L2",
      question: "In your Postgres orders table, every row stores `username`, `user_email`, and `user_address` directly (copied from the users table at order time). The user updates their email — and for the next 6 months of order history, every old order shows the OLD email. What is this design called, and what's the trade-off you've accepted?",
      options: [
        { label: "A", text: "Normalized — accepts slow reads in exchange for flexible writes" },
        { label: "B", text: "Denormalized — duplicating user data into the orders table avoids a join on every read (fast reads, no users-table lookup), but every user update has to fan out to every order record (expensive writes, drift risk if the fan-out misses any). For an e-commerce site where orders should reflect data AT THE TIME OF ORDER, this might actually be intentional (a 'snapshot' for legal/audit). For displaying current user info, it's a bug. The trade-off the article describes: faster reads at the cost of expensive update fan-out and potential staleness" },
        { label: "C", text: "Sharded — the user data is split across multiple servers" },
        { label: "D", text: "Indexed — the email column has an index that needs rebuilding" }
      ],
      correct: 1,
      explanation: "The article: 'Denormalization goes the other way. You duplicate data to avoid joins and make reads faster. Instead of joining to the users table every time you display an order, you store the username directly in each order record. Now you can fetch an order and display it without touching another table. The downside is updates. If a user changes their name, you have to update it in the users table plus every order record that copied it.' Whether this is bug or feature depends on intent: snapshots-at-order-time is a legitimate pattern; out-of-date display data is a bug.",
      interviewScript: "Say: 'This is denormalization — the username/email/address are duplicated into orders to avoid the join. The cost is that user updates have to fan out, and if the fan-out is missed or eventually-consistent, you get drift. Whether that's correct depends on whether the order should show data-at-order-time (intentional snapshot, common in financial/legal contexts) or current-data (bug).'",
      proTip: "When you denormalize intentionally for snapshots, document it explicitly in the schema and the column name (e.g., `user_email_at_order` instead of `user_email`) so future engineers don't try to 'fix' it."
    },
    {
      id: "q13",
      category: "Data Modeling",
      difficulty: "L3",
      question: "In a system design interview, your interviewer asks how you'll model your data. You say: 'I'll start fully denormalized — everything wide tables, no joins, optimized for reads.' Why is this a yellow flag, even though denormalization is a legitimate technique?",
      options: [
        { label: "A", text: "Denormalization is always wrong in production systems" },
        { label: "B", text: "The senior pattern is: start with a normalized relational model and denormalize SPECIFIC hot paths only when read-perf evidence justifies it. Going fully denormalized upfront signals 'I'm applying a technique without engaging with its trade-off' — writes get expensive, drift becomes a problem, and you've optimized for reads you can't yet prove are the bottleneck. Interviewers want to see that you know each move costs you something — not that you reach for the most aggressive optimization first" },
        { label: "C", text: "Denormalization is a NoSQL pattern; you can't do it in Postgres" },
        { label: "D", text: "Joins are always faster than denormalized reads in Postgres" }
      ],
      correct: 1,
      explanation: "The article: 'In interviews, a safe default is to start with a normalized relational model and then denormalize specific hot paths if you identify read performance issues. Don't propose denormalization upfront unless you have a clear reason. Interviewers want to see that you understand the tradeoffs, not that you blindly apply techniques.' The yellow flag isn't denormalization itself — it's pre-emptively applying it without grounding it in evidence. Premature denormalization is the same anti-pattern as premature sharding.",
      interviewScript: "Say: 'I'll start with a normalized schema — users, orders, order_items, products — clean FKs, transactions for the order flow. If profiling later shows the home-feed read path is hot and the joins dominate latency, I'd denormalize THAT specific path: e.g., a precomputed feed table, or store username directly in orders if we display it on every order page. But normalize first, denormalize on evidence.'",
      proTip: "Pattern-match the reasoning chain: (1) normalized writes for integrity, (2) profile, (3) denormalize hot read paths with explicit fan-out logic. Interviewers love this exact sequence — it's the senior workflow."
    },
    {
      id: "q14",
      category: "Data Modeling",
      difficulty: "L4",
      question: "You picked DynamoDB for a Twitter-like product, partitioning by `user_id` so 'fetch all tweets for user X' is a single-partition lookup. Two months in, the PM adds a feature: 'find all tweets containing hashtag #foo across all users.' Suddenly that query is unbearably slow. What does this expose about NoSQL data modeling?",
      options: [
        { label: "A", text: "DynamoDB is the wrong database for tweets — should have used Postgres" },
        { label: "B", text: "NoSQL forces you to design AROUND your access patterns up front. Partitioning by user_id was correct for the original 'tweets-by-user' access pattern, but it makes the new cross-user 'tweets-by-hashtag' query a full-table scan because the hashtag isn't part of the partition key. The lesson: NoSQL access patterns are a design-time decision, not a query-time decision. The fix is either a Global Secondary Index keyed by hashtag, or a separate hashtag→tweet_id table maintained on every write. Either way, you have to know the query exists at design time. The very choice that made user-scoped queries fast made hashtag queries slow — that's the inherent shape of NoSQL design" },
        { label: "C", text: "The hashtag query needs more shards added" },
        { label: "D", text: "Eventual consistency is the underlying problem" }
      ],
      correct: 1,
      explanation: "The article: 'DynamoDB requires you to design your partition key and sort key based on your access patterns. If you're building a social media app and your most common query is \"get all posts for user X,\" you'd use user_id as the partition key. This makes that query a fast single-partition lookup. But now queries like \"get all posts mentioning hashtag Y\" require scanning the entire table because you didn't design for that access pattern. You have to know your queries upfront and design around them.' This is trade-off-inversion: the same key choice that optimizes one access pattern de-optimizes others.",
      interviewScript: "Say: 'In NoSQL the partition key IS the access pattern. user_id partitioning makes user-scoped queries O(1) but cross-user queries become full-table scans because the hashtag isn't in the partition key. To support hashtag queries I'd add a Global Secondary Index keyed by hashtag, or maintain a separate hashtag→tweet_ids inverted lookup written on every tweet creation. Either way I have to design for the query at table-creation time.'",
      proTip: "In Postgres you add an index after the fact and query against it. In DynamoDB you design partition + sort + GSIs UP FRONT for every access pattern. That design-time discipline is the cost of NoSQL's scale properties."
    },
    {
      id: "q15",
      category: "Data Modeling",
      difficulty: "L5",
      question: "A 6-table join (orders × users × products × shipments × addresses × promos) is 4s P50 on the home page. A teammate proposes denormalizing user/product/promo info onto every order row. A second teammate proposes adding indexes on every join column. A third proposes a Redis cache in front of the query. All three help — but they're solving different parts of the problem. What's the right ordering of moves, and why?",
      options: [
        { label: "A", text: "Cache first (Redis) → it hides everything; the underlying problem can be ignored" },
        { label: "B", text: "Indexes first (cheapest, doesn't change the data model) → if indexes don't get latency below SLA, denormalize the specific hot read path (changes the data model, adds write cost, but eliminates joins entirely) → cache only AFTER the database side is right (cache-aside in front of a still-slow underlying query just delays the failure: when the cache misses or is invalidated under load, the slow query stampedes the DB). Caching a slow query without fixing the underlying slowness is a classic anti-pattern — the cache hides the problem until traffic spikes blow through it" },
        { label: "C", text: "Denormalize first to skip joins entirely; indexes are obsolete after denormalization" },
        { label: "D", text: "Apply all three at once — they're independent and don't interact" }
      ],
      correct: 1,
      explanation: "Cross-Part L5: Data Modeling × Indexing × Caching. Two-levels-of-indirection pattern. The surface fix (cache) hides a structural problem (slow query) — and surface fixes that hide structural problems fail under stress. The right ordering reasons about cost and reversibility: indexes are cheap and reversible (drop them); denormalization is moderate cost and partly reversible; caching is cheap to add but creates an operational dependency. Apply them in cost order, AND fix the underlying slowness BEFORE adding a cache so the cache is masking peaks rather than masking a baseline failure.",
      interviewScript: "Say: 'Indexes first — cheapest move, doesn't change the data model. If we still don't hit the SLA, denormalize the specific hot path — for the home feed I'd materialize a feed_items table updated on writes. ONLY THEN add Redis in front. Caching a fundamentally slow query is the classic mistake: it papers over the problem until a cache miss or invalidation lets the underlying slow query stampede the DB at the worst possible moment.'",
      proTip: "The mental model: caches MULTIPLY existing performance — they don't FIX it. If your underlying query is broken at the database layer, fix the database layer first, then layer cache on top to absorb peak load."
    },
    {
      id: "q16",
      category: "Indexing",
      difficulty: "L1",
      question: "Your `users` table has 10 million rows. The query `SELECT * FROM users WHERE email = ?` takes 800ms. After one schema change, it drops to under 1ms. What change explains the speedup?",
      options: [
        { label: "A", text: "An index was added on the `email` column. Without an index, the database scans every one of the 10M rows comparing the email column. With an index (typically a B-tree), the database walks a balanced tree in O(log n) and jumps directly to the matching row" },
        { label: "B", text: "The table was sharded across 1500 servers" },
        { label: "C", text: "The query was migrated from Postgres to MongoDB" },
        { label: "D", text: "Network latency was reduced" }
      ],
      correct: 0,
      explanation: "The article: 'Without an index, finding a user by email means scanning every single row in your users table. If you have 10 million users, that's 10 million rows to check. With an index on the email column, the database can jump straight to the right row in milliseconds.' This is the canonical reason indexes exist — turning O(N) scans into O(log N) lookups.",
      interviewScript: "Say: 'Add a btree index on email. The 800ms is a 10M-row sequential scan. The index turns it into an O(log n) tree walk — sub-millisecond on warm cache.'",
      proTip: "Most DBs build a B-tree index by default. The fact that B-tree is the default tells you that 'exact lookup + range query' is the dominant access pattern in real systems."
    },
    {
      id: "q17",
      category: "Indexing",
      difficulty: "L2",
      question: "Your `orders` table needs to support both `WHERE order_id = ?` (exact lookups) AND `WHERE created_at BETWEEN ? AND ?` (range queries). One index type cleanly supports both; another is faster on exact match but doesn't support ranges. Which should you reach for, and why?",
      options: [
        { label: "A", text: "B-tree — its sorted-tree structure supports exact match (descend to the key in O(log n)) AND range queries (find the start of the range, then scan sequentially through the tree's sorted leaves). It's slightly slower than hash on exact match but vastly more flexible — which is why most relational DBs make B-tree the default index type" },
        { label: "B", text: "Hash index — fastest possible lookup, supports everything" },
        { label: "C", text: "Inverted index — purpose-built for range queries" },
        { label: "D", text: "Bitmap index — best for low-cardinality columns" }
      ],
      correct: 0,
      explanation: "The article: 'The most common index is a B-tree. It keeps data sorted in a tree structure that supports both exact lookups (find user with email X) and range queries (find all orders between date A and date B). Most relational databases create B-tree indexes by default. Hash indexes are faster for exact matches but can't do range queries, so they're less common.' Hash indexes scatter keys via hashing — the underlying order is meaningless, so range queries can't seek.",
      interviewScript: "Say: 'B-tree — it handles both exact and range queries because it keeps the data sorted in the tree. Hash would be faster for the exact lookup but useless for the range — and this table needs both.'",
      proTip: "Hash indexes shine for KV stores and sometimes for hash joins, but for general transactional workloads B-tree is the default for a reason: the workload almost always grows to need range queries eventually."
    },
    {
      id: "q18",
      category: "Indexing",
      difficulty: "L3",
      question: "Your event-search query is `WHERE city = 'San Francisco' AND date = '2026-12-25'`. You currently have a single-column index on `city` AND a single-column index on `date`. The query is still slow. What index design is most likely to dominate, and why?",
      options: [
        { label: "A", text: "A larger single-column index on city" },
        { label: "B", text: "A compound (multi-column) index on `(city, date)`. The database can seek directly to the (city='SF', date=12/25) entry in one tree walk. With two single-column indexes, the planner has to either pick one (ignoring the other), or do a 'bitmap AND' — find all SF rows from city index, find all 12/25 rows from date index, intersect. That's two index scans plus an intersection rather than a single direct lookup. The article specifically calls out compound indexes for this case: 'For composite queries like find events in San Francisco on December 25th, you might need a compound index on both city and date'" },
        { label: "C", text: "Drop both indexes — compound predicates always benefit from full scans" },
        { label: "D", text: "Index on date only" }
      ],
      correct: 1,
      explanation: "The article quote is direct. Single-column indexes serve single-column predicates well; compound predicates need a compound index that orders rows by (column1, column2) so the lookup can hit both conditions in one tree walk. The order of columns in the compound index matters: `(city, date)` supports `WHERE city = X AND date = Y` AND `WHERE city = X` (using only the prefix), but NOT `WHERE date = Y` alone (date isn't the leading column).",
      interviewScript: "Say: 'I'd add a compound index on (city, date). The query has both predicates conjoined, so one ordered index lets the database seek directly to the matching (city, date) pair in O(log n). Two single-column indexes force the planner into a less efficient bitmap-AND or to pick one and scan-filter the other.'",
      proTip: "Compound index column order matters: put the most-selective or most-common-prefix-queried column first. `(city, date)` works for queries with both city OR city alone; `(date, city)` works for queries with both OR date alone."
    },
    {
      id: "q19",
      category: "Indexing",
      difficulty: "L4",
      question: "Your product is rolling out search-across-articles. The team's instinct is to spin up a new Elasticsearch cluster and dual-write articles to both Postgres (source of truth) and ES on every save. A teammate proposes piping changes through change data capture (CDC) into ES instead. What's the operational difference, and what's the trade-off?",
      options: [
        { label: "A", text: "CDC and dual-writes are equivalent in correctness and latency" },
        { label: "B", text: "CDC replicates write traffic from Postgres's WAL into ES, so the application code only writes to ONE system (Postgres) and ES updates asynchronously. This is simpler at the app layer (no dual-write coordination, no partial-failure modes between the two systems, no transactional gymnastics) and decouples ES failures from write availability — if ES goes down, writes still succeed against Postgres and CDC catches up later. The TRADE-OFF: the search index lags behind the primary by some small amount — usually fine for search use cases, problematic if you need read-your-write semantics on the search index. The article: 'These external indexes typically sync from your primary database via change data capture (CDC), meaning the search index will lag slightly behind the primary database'" },
        { label: "C", text: "Dual-writes are always strictly better — they're synchronous" },
        { label: "D", text: "CDC requires moving Postgres to a different cloud region" }
      ],
      correct: 1,
      explanation: "The article: 'These external indexes typically sync from your primary database via change data capture (CDC), meaning the search index will lag slightly behind the primary database. The data you read from the search index is going to be stale by some small amount, but for search use cases that's almost always acceptable.' CDC vs dual-write is a classic operational trade-off: CDC simplifies app code (one write target) at the cost of a small consistency lag; dual-write reduces the lag but introduces partial-failure scenarios you have to design around (what if Postgres succeeds and ES fails?).",
      interviewScript: "Say: 'CDC is the senior pattern. App writes once to Postgres; Debezium / Postgres logical replication streams the WAL into ES. The app stays simple, ES failures don't block writes, and the inevitable lag (typically sub-second to a few seconds) is acceptable for search. Dual-write looks synchronous but introduces partial-failure cases — if ES write fails after Postgres commits, you're inconsistent and have to invent retry/compensation logic.'",
      proTip: "CDC tools to know: Debezium (Postgres/MySQL → Kafka), AWS DMS, Postgres logical replication, MongoDB Change Streams. Naming Debezium specifically signals you've worked with the pattern."
    },
    {
      id: "q20",
      category: "Indexing",
      difficulty: "L5",
      question: "Your team is choosing between (a) using Postgres's PostGIS extension to add geospatial queries to your existing Postgres, vs (b) standing up a separate dedicated geospatial database. Your access patterns are currently 'find restaurants within 5 miles of (lat, lng)' at 2K QPS. Which architecture is the right starting move, and what's the principle?",
      options: [
        { label: "A", text: "Always use a dedicated geospatial database — Postgres can't do geospatial" },
        { label: "B", text: "Start with PostGIS in your existing Postgres. The principle: a specialized index added to a database you ALREADY operate is dramatically cheaper than a new database on every operational dimension — replication topology, failure modes, sync pipelines, on-call surface, monitoring, security review, backup strategy. The article: 'For geospatial queries in Postgres, PostGIS is a popular extension.' Spin up a dedicated geospatial DB only when you've outgrown PostGIS at a specific KNOWN limit (e.g., spatial index doesn't fit in RAM, or query patterns demand specialized features PostGIS lacks). The cost of an extra data store isn't 'one more thing to deploy' — it's 'one more thing to debug at 3am, sync from your source of truth, and back up'" },
        { label: "C", text: "Always use a dedicated geospatial DB — operational simplicity" },
        { label: "D", text: "Use Redis for geospatial — purely in-memory wins on latency" }
      ],
      correct: 1,
      explanation: "Operational/cost L5 reasoning. The article points to PostGIS by name as the popular Postgres extension for geospatial work; the senior generalization is 'extend the data store you already operate before adding a new one.' Adding a new data store has invisible costs: a new replication strategy, new failure modes, new sync pipelines (CDC from Postgres → geospatial DB), new monitoring dashboards, new on-call playbooks. PostGIS at 2K QPS is well within what a single Postgres can handle.",
      interviewScript: "Say: 'PostGIS in our existing Postgres. 2K QPS for proximity queries is comfortable for PostGIS — it adds R-tree-style spatial indexes. The alternative — a dedicated geospatial DB — adds a new data store, a new sync pipeline, a new on-call surface, and a new failure mode for what's currently a single-feature need. I'd revisit when we hit a specific limit, like spatial-index-doesn't-fit-RAM or specialized routing/topology features.'",
      proTip: "The 'one fewer data store' heuristic is one of the highest-leverage senior moves. Every new data store you add is a forever-cost. Mention this principle explicitly — it's an instant signal of operational depth."
    },
    {
      id: "q21",
      category: "Caching",
      difficulty: "L1",
      question: "A read that takes 30ms against your Postgres replica drops to ~1ms when served from Redis. What is the underlying physical reason for this gap?",
      options: [
        { label: "A", text: "Redis is just better-written code" },
        { label: "B", text: "Redis serves the data from RAM (in-memory access plus a network round-trip dominating at ~1ms LAN), while Postgres has to read from disk (or its buffer pool), parse the SQL, plan the query, and traverse indexes/MVCC. The 20-50x gap is dominated by the storage layer (memory vs disk) plus query-engine overhead. The article: 'A cache hit on Redis takes around 1ms compared to 20-50ms for a typical database query'" },
        { label: "C", text: "Redis uses UDP and Postgres uses TCP" },
        { label: "D", text: "Redis runs on faster CPUs" }
      ],
      correct: 1,
      explanation: "The article: 'A cache hit on Redis takes around 1ms compared to 20-50ms for a typical database query. When you're serving millions of requests, that 20-50x speedup matters.' The gap isn't Redis being magical — it's RAM vs disk plus skipping a query planner. Redis stores the value pre-shaped; Postgres has to parse, plan, traverse, and read from a storage layer that's orders of magnitude slower than RAM.",
      interviewScript: "Say: 'Redis is in-memory with a simple data model — no SQL parsing, no query planner, just hash-table-style lookups. The latency is bounded by the network round-trip, which is sub-millisecond on a LAN. Postgres has to parse, plan, and read from buffer pool or disk — that's where the 20-50ms comes from.'",
      proTip: "Memorize the rule of thumb: Redis ~1ms, DB ~20-50ms. That 20-50x speedup is what makes caching the right move when DB is the bottleneck — and it's the number to cite when justifying caching in interviews."
    },
    {
      id: "q22",
      category: "Caching",
      difficulty: "L2",
      question: "Walk through the cache-aside read pattern with Redis sitting in front of Postgres. A user requests profile data for user_id=42. The cache is cold. What is the request flow?",
      options: [
        { label: "A", text: "Service queries Redis for `user:42` → MISS → service queries Postgres → gets the user → writes the user back to Redis with a TTL → returns the user. The next request for user 42 hits Redis directly and skips Postgres entirely. The article: 'On a read, check the cache first. If the data is there, return it. If not, query the database, store the result in the cache with a TTL, and return it'" },
        { label: "B", text: "Service queries Postgres → writes to Redis → done; Redis is checked on the next read" },
        { label: "C", text: "Redis automatically queries Postgres on miss; the service is unaware" },
        { label: "D", text: "Postgres pushes user_id=42 to Redis on every read it serves" }
      ],
      correct: 0,
      explanation: "The article: 'The pattern you'll use 90% of the time is cache-aside with Redis. On a read, check the cache first. If the data is there, return it. If not, query the database, store the result in the cache with a TTL, and return it. This is straightforward to implement and works for most read-heavy systems.' Cache-aside is application-driven — the cache doesn't know about the DB and vice versa; the service mediates. Other patterns (read-through, write-through) push that mediation into the cache layer but are less common.",
      interviewScript: "Say: 'Cache-aside. Read path: check Redis → MISS → query Postgres → SET in Redis with a TTL (say, 5 minutes) → return. Next read for the same key hits Redis directly. The service is responsible for the read-through; the cache is a passive store. It's the simplest pattern and works for 90% of read-heavy workloads.'",
      proTip: "On the write path with cache-aside: write to DB, then either invalidate the cache key (let next read repopulate) or update it in-place. Pick invalidation by default — it's simpler and avoids stale-after-failed-update edge cases."
    },
    {
      id: "q23",
      category: "Caching",
      difficulty: "L3",
      question: "A user updates their profile name from 'Alice' to 'Alicia'. You're using cache-aside with Redis and a 5-minute TTL on profile entries. Right after the database update, what happens, and what are your options to fix the stale-read window?",
      options: [
        { label: "A", text: "The next read returns 'Alicia' immediately because Postgres updates propagate to Redis automatically" },
        { label: "B", text: "The DB has 'Alicia' but Redis still has 'Alice' until the TTL expires (up to 5 minutes of stale reads). Options: (1) on profile-update, explicitly invalidate the cache (DEL the key) so the next read does a fresh DB load and re-cache; (2) on profile-update, write the new value into the cache directly; (3) shorten the TTL and accept less staleness with no app changes; (4) combine — invalidate AND have a short TTL as belt-and-suspenders. The article: 'The hardest part is invalidation' and lists exactly these strategies — invalidate-on-write, short TTL, or both" },
        { label: "C", text: "Redis automatically detects DB updates and invalidates" },
        { label: "D", text: "Postgres has cache-coherence with Redis built in" }
      ],
      correct: 1,
      explanation: "The article: 'When a user updates their profile in the database, you need to delete or update the cached copy. Otherwise the next read returns stale data. There are a few strategies here. You can invalidate the cache entry immediately after writes, use short TTLs and accept some staleness, or combine both. The right choice depends on how fresh your data needs to be.' The cache and the DB don't know about each other in cache-aside — the application is responsible for keeping them in sync.",
      interviewScript: "Say: 'The DB has the new name; Redis still has the old one for up to 5 minutes. I'd invalidate-on-write: after the DB update succeeds, DEL the profile cache key. Next read does the cache-miss path and pulls the fresh value. Belt-and-suspenders: keep the TTL short (5 min, not 24h) so even if invalidation is missed somewhere, the staleness window is bounded.'",
      proTip: "There's a Phil Karlton quote — 'There are only two hard things in computer science: cache invalidation and naming things.' Citing it earns no points; understanding why invalidation is hard (distributed updates, race conditions, coordinated failures) does."
    },
    {
      id: "q24",
      category: "Caching",
      difficulty: "L4",
      question: "You have 50K req/sec being served from Redis with a 95% hit rate, so Postgres sees ~2.5K req/sec. Redis crashes. What happens in the next 2 seconds, and what mitigation strategies prevent the worst-case outcome?",
      options: [
        { label: "A", text: "Postgres absorbs the 50K/sec load gracefully — modern hardware is fast" },
        { label: "B", text: "Postgres goes from ~2.5K req/sec to ~50K req/sec instantly — a 20x spike, almost certainly past its capacity. Latency spikes, connection pools exhaust, the database itself may fall over. This is a CACHE STAMPEDE. The article calls it out by name. Mitigations: (1) circuit breakers — detect Postgres distress and shed load fast (return 503 / serve degraded responses); (2) a small in-process cache as fallback for the hottest keys; (3) graceful degradation — serve a stale response from a secondary store; (4) Redis cluster with replicas so single-node failure doesn't take down all caching at once" },
        { label: "C", text: "The application layer queues all requests until Redis recovers" },
        { label: "D", text: "Redis automatically fails over to Postgres" }
      ],
      correct: 1,
      explanation: "The article: 'If Redis goes down, every request suddenly hits your database. Can it handle that traffic spike? This is called a cache stampede and it can take down your whole system. Some approaches include keeping a small in-process cache as a fallback, using circuit breakers to prevent overwhelming the database, or accepting degraded performance until Redis comes back up.' Cache stampede is the canonical failure mode: the cache layer that protected the DB is now gone, and the load it was absorbing redirects to a system that wasn't sized for it.",
      interviewScript: "Say: 'Cache stampede. The 95% hit rate hides the fact that the underlying DB is sized for 2.5K, not 50K — so when Redis dies, the DB faces a 20x spike and probably collapses. I'd defend with: (a) Redis cluster with replicas so single-node loss doesn't lose 95% of cache, (b) circuit breakers around DB calls to fail fast when latency spikes, (c) a tiny in-process LRU as a last-line fallback for ultra-hot keys, (d) graceful degradation — serve a stale answer rather than overload the DB.'",
      proTip: "There's a related stampede on cache MISS — when a hot key expires and 1000 concurrent requests all miss simultaneously, they all rush to the DB. Mitigations: stale-while-revalidate, single-flight (only one request fetches; others wait), or jittered TTLs."
    },
    {
      id: "q25",
      category: "Caching",
      difficulty: "L4",
      question: "A junior engineer proposes 'we should cache every read in our system to maximize performance.' Walk through why this is wrong.",
      options: [
        { label: "A", text: "You should cache only data that's read frequently AND changes infrequently. Caching data that changes on every request adds: (a) cache write/invalidate cost on every change, (b) staleness risk window, (c) operational burden of running and monitoring Redis. Net: if your hit rate is low and your churn is high, you've added complexity AND latency for nothing. The article: 'A common mistake is caching everything. Cache only data that's read frequently and doesn't change often. If you're caching data that changes on every request, you're just adding latency and complexity for no benefit. Profile your system first, then cache the hot paths'" },
        { label: "B", text: "Right idea — cache everything is the canonical pattern" },
        { label: "C", text: "Caching every read violates ACID guarantees in Postgres" },
        { label: "D", text: "Caching only works for static data like images" }
      ],
      correct: 0,
      explanation: "The article quote is direct. Caching has a cost-vs-benefit equation: for high-read-low-churn data, the cache hit rate is high and the speedup justifies the staleness/operational cost. For low-read-high-churn data, you eat the maintenance cost without getting the speedup. 'Cache everything' applies the technique without engaging the equation — same anti-pattern as 'denormalize everything' or 'shard everything.'",
      interviewScript: "Say: 'Cache only what's frequently-read and rarely-changing. For a per-request changing value, the cache fights itself: every write invalidates the entry, so the next read misses. You've added Redis, the staleness risk, and the operational surface for a workload where caching can't help. The senior move is: profile first, identify the actual hot paths, cache those, leave everything else alone.'",
      proTip: "Two quick metrics to evaluate cacheability: (1) READ-TO-WRITE RATIO — high is cacheable; low is not. (2) ACCEPTABLE STALENESS — a few seconds tolerable means cacheable; must-be-fresh means not without strong invalidation. Apply this before adding any cache."
    },
    {
      id: "q26",
      category: "Caching",
      difficulty: "L5",
      question: "A senior engineer reviews your design that says 'we cache feature flags in Redis on every request' and 'we cache static product images in Redis.' She suggests two changes: (1) move feature flags out of Redis into in-process cache, (2) move static images from Redis into a CDN. Why are both the right calls, and what does this teach you about caching layers?",
      options: [
        { label: "A", text: "Both changes are wrong — Redis is the universal cache" },
        { label: "B", text: "Different cache layers solve different problems. (1) Feature flags are TINY config values that change rarely (maybe per deploy) — fetching from Redis on every request adds a network hop you don't need. An in-process cache (refreshed every minute or so) is faster and removes the Redis dependency from the request hot path. (2) Static images are LARGE, GLOBAL, and rarely-changing — they belong on a CDN with edge servers near the user, not a centralized Redis where every globally-distributed user pays the round trip to your single Redis region. The article: CDN caching is for static assets at edge locations; in-process for small, rarely-changing config; external Redis for core app data. The principle: pick the cache layer based on (latency budget, geographic distribution, change rate, payload size), not 'put everything in Redis'" },
        { label: "C", text: "Feature flags should be in Postgres only, never cached" },
        { label: "D", text: "CDNs can only serve videos, not images" }
      ],
      correct: 1,
      explanation: "Cross-Part L5: caching layers × CDN. The article distinguishes three cache layers: 'CDN caching is different. It's for static assets like images, videos, and JavaScript files served from edge locations close to users. In-process caching works for small values that change rarely, like feature flags or config data. But for your core application data, external caching with Redis is the default.' Each layer is optimized for a different shape of (size, change rate, geography, network cost). Putting everything in Redis is the same kind of one-size-fits-all anti-pattern as caching everything.",
      interviewScript: "Say: 'Three caching layers, three jobs: CDN at edge for static large assets (images, JS bundles, videos) — proximity wins. In-process per-app-server for tiny rarely-changing config — zero network hops. External Redis for shared, dynamic, application-data values where two app servers must agree. Feature flags fit in-process; static images fit CDN. Putting either in Redis pays for a network hop and a centralized region for no benefit.'",
      proTip: "Feature-flag SDKs (LaunchDarkly, ConfigCat, Unleash) ship with in-process caches by design — refresh every 30-60s in the background, serve from memory on every check. That's the pattern; don't reinvent it through Redis."
    },
    {
      id: "q27",
      category: "Sharding",
      difficulty: "L1",
      question: "What is the core problem that database sharding solves?",
      options: [
        { label: "A", text: "A single database server has hit its limits — storage capacity (max-out at the TB level on Postgres), write throughput (tens of thousands of writes per second), or read throughput beyond what replicas alone can absorb. So the data is split across multiple independent servers, each owning a subset, and queries are routed to the shard owning the relevant data" },
        { label: "B", text: "A single database is using too many indexes" },
        { label: "C", text: "A single database needs encryption" },
        { label: "D", text: "A single database is in only one data center" }
      ],
      correct: 0,
      explanation: "The article: 'Sharding comes up when you've outgrown a single database and need to split your data across multiple independent servers. This happens when you hit storage limits (a single Postgres instance maxes out in the TB), write throughput limits (tens of thousands of writes per second), or read throughput that even replicas can't handle.' Sharding is fundamentally a horizontal-scale technique — same data model, more servers, partitioned by key.",
      interviewScript: "Say: 'Sharding splits the data across multiple independent DB servers when one server can no longer handle the load — TB-scale storage, tens of K writes/sec, or read traffic beyond what replicas absorb. Each shard owns a subset of the data, and queries are routed to the right shard by key. Replicas scale READS; sharding scales WRITES and STORAGE.'",
      proTip: "The triggers for sharding are stable — memorize the trio: storage past TB, writes past tens-of-K/sec, reads-past-replica-capacity. Citing them lets you defend against premature sharding by saying 'we don't hit any of those yet.'"
    },
    {
      id: "q28",
      category: "Sharding",
      difficulty: "L2",
      question: "You're sharding an Instagram-style app by `user_id`. A user requests their own profile and feed (their posts, their likes). Then a global query: 'top 100 trending posts across all users this hour.' Which is fast, which is slow, and why?",
      options: [
        { label: "A", text: "Both fast — sharding distributes load evenly across all queries" },
        { label: "B", text: "User-scoped queries (own profile, own feed) are FAST: single-shard lookup. The global trending query is SLOW: it must hit ALL shards, get the top-N from each, and aggregate (scatter-gather). This is the inherent trade-off of any shard-key choice — queries that align with the key are fast; queries that don't are scatter-gather. Sharding by user_id optimizes the user-scoped access pattern at the cost of cross-user analytics. The article: 'For a user-centric app like Instagram, sharding by user_id means all of a user's posts, likes, and comments live on one shard. User-scoped queries are fast because they only hit one shard. But now global queries like trending posts across all users become expensive because you have to hit every shard and aggregate results. That's the tradeoff'" },
        { label: "C", text: "Both slow — sharding never helps performance" },
        { label: "D", text: "The global query is fast because it doesn't filter by user" }
      ],
      correct: 1,
      explanation: "Article quote is direct. The fundamental shape of sharding is: the shard key picks WHICH access patterns are fast. Queries aligned with the key go to one shard (fast); queries orthogonal to the key go to all shards (scatter-gather, slow, expensive). There's no shard key that makes ALL queries fast — you choose which to optimize.",
      interviewScript: "Say: 'User-scoped queries are O(1) shard hits — fast. Global trending is scatter-gather across all shards: each shard returns its local top-N, the aggregator merges them, picks the global top-100. That gets expensive at high shard counts. The trade-off is intrinsic: shard key picks which queries are fast. For Instagram I'd accept the global-trending cost (it's a less-frequent query, can be precomputed offline) in exchange for fast user-scoped reads on the hot path.'",
      proTip: "For scatter-gather queries you have two outs: (a) precompute the answer in a separate aggregated table updated asynchronously, or (b) accept that those queries are slow but bound their volume. Trending topics, leaderboards, and analytics are usually (a)."
    },
    {
      id: "q29",
      category: "Sharding",
      difficulty: "L3",
      question: "You have three sharding strategies on the table for partitioning customer data: (1) hash-based on customer_id, (2) range-based on customer_id, (3) directory-based with a lookup table. For a SaaS where customers have very different traffic (some 1000x heavier than others), which is most likely to create hot spots, which is the safest default, and which has a hidden cost most candidates miss?",
      options: [
        { label: "A", text: "Hash creates hot spots; range is safest; directory is free" },
        { label: "B", text: "(1) HASH distributes evenly across shards by hashing the key — safest default for most workloads, even traffic distribution. (2) RANGE can hot-spot easily — if customers 1-100 are 'active' and 100-200 are 'dormant', the first range is overloaded. The article: 'Range-based sharding can work if your access patterns naturally partition... but it's easy to create hot spots if one range gets more traffic.' (3) DIRECTORY-based is most flexible (you can rebalance specific customers explicitly) but adds a lookup-table dependency on EVERY query — extra latency, extra failure mode (the directory becomes a single point of failure / coordination hotspot), extra operational complexity. Most candidates miss this: directory feels like 'best of both worlds' but pays a per-query tax. The article: 'rarely worth it in interviews'" },
        { label: "C", text: "All three are equivalent in practice" },
        { label: "D", text: "Range is always best; the others are theoretical" }
      ],
      correct: 1,
      explanation: "The article: 'Most systems use hash-based sharding where you hash the shard key and use modulo to pick a shard. This distributes data evenly and avoids hot spots. Range-based sharding can work if your access patterns naturally partition (like multi-tenant SaaS where each company only queries their own data), but it's easy to create hot spots if one range gets more traffic. Directory-based sharding uses a lookup table to decide where data lives. It's flexible but adds a dependency and latency to every request, so it's rarely worth it in interviews.'",
      interviewScript: "Say: 'Hash by default — even distribution, avoids hot spots. Range only if traffic genuinely partitions (multi-tenant where each tenant queries their own slice) AND I can show no tenant is 1000x heavier — otherwise the heavy tenant hot-spots its range. Directory is flexible but every query goes through a lookup table that becomes a centralized dependency — extra latency, extra failure mode, extra op surface. Hash wins by default; range fits specific workloads; directory rarely justifies the complexity.'",
      proTip: "If you genuinely have a heavy tenant, the move isn't 'directory-based sharding' — it's 'pin that tenant to a dedicated shard.' Hybrid: hash for the long tail, dedicated shard for the celebrity. Best of both worlds without the per-query directory tax."
    },
    {
      id: "q30",
      category: "Sharding",
      difficulty: "L4",
      question: "A candidate at a mid-stage startup proposes sharding their Postgres on day 1 because 'we're going to scale to millions of users.' Current load: 1K writes/sec, 80GB total data. The interviewer pushes back. What's the strongest case against premature sharding here?",
      options: [
        { label: "A", text: "Sharding is always premature — never shard" },
        { label: "B", text: "A well-tuned single Postgres handles tens of thousands of writes/sec and several TB of data. At 1K writes/sec and 80GB, the system is operating at maybe 5-10% of a single instance's capacity. Sharding adds significant complexity: cross-shard transactions become hard, hot spots are now a problem, resharding is painful, application logic gets shard-aware, and operational surface multiplies. Until you can demonstrate (with real numbers) that a single tuned instance + read replicas is insufficient, sharding is premature optimization that costs you complexity you don't yet need. The article: 'The biggest mistake with sharding is doing it too early. A well-tuned single database with read replicas can handle way more than most candidates think. Before you propose sharding, do the capacity math'" },
        { label: "C", text: "Postgres can never be sharded" },
        { label: "D", text: "Sharding is fine; complexity is worth the future-proofing" }
      ],
      correct: 1,
      explanation: "Estimation-backed L4. The article gives the exact rule: 'If you're at 10K writes per second and 100GB of data, you don't need sharding yet. Bring it up when the numbers justify it, not as a default scaling strategy.' Premature sharding is the most common scaling anti-pattern because it sounds defensible (we'll need it eventually) but costs a year of complexity for capacity you haven't earned the need for.",
      interviewScript: "Say: 'Capacity math: 1K writes/sec is ~10% of a tuned Postgres single-instance ceiling. 80GB is well under TB. We're at ~5-10% of one instance's capacity. Sharding now buys complexity (cross-shard txns, hot spots, application shard-awareness, resharding pain) that pays for itself only at much higher scale. I'd start with a single primary plus read replicas and a clear monitoring trigger (writes-per-sec, storage, replication lag) that signals when sharding becomes necessary.'",
      proTip: "Pair this with the migration story: 'when we DO need to shard, we'll add a shard router in the data-access layer first (just one shard initially), then introduce additional shards via online migration.' That sequencing buys you incremental complexity rather than upfront."
    },
    {
      id: "q31",
      category: "Sharding",
      difficulty: "L4",
      question: "Your banking app shards customer accounts by customer_id. A new feature lets a customer transfer between their CHECKING and SAVINGS accounts (both belong to the same customer, so same shard) AND between two different customers' accounts (cross-shard). You also notice ONE celebrity influencer's shard handles 50x the traffic of any other shard. What two distinct sharding pitfalls have you just hit, and how do you address each?",
      options: [
        { label: "A", text: "Both issues are eventual-consistency bugs, fixable by stronger reads" },
        { label: "B", text: "Two distinct problems. (1) CROSS-SHARD TRANSACTIONS: the cross-customer transfer touches two shards, so a normal DB transaction can't atomically debit one and credit the other — you need either distributed transactions (slow, complex 2PC) or compensating sagas (eventually consistent, more application code). Best practice: design shard boundaries to AVOID cross-shard transactions when possible — e.g., route bank-internal transfers through a separate ledger service that's NOT sharded. (2) HOT SPOT: one shard takes 50x the load of the others. Even with hash-based sharding, a single 'celebrity' KEY can saturate its shard. Fixes: write-shard the celebrity (split that one customer's data across N synthetic partition keys, aggregate on read), or simply pin that customer to a dedicated shard with extra capacity. The article: 'Cross-shard transactions become nearly impossible... Hot spots happen when one shard gets disproportionate traffic'" },
        { label: "C", text: "Both are solved by adding more replicas" },
        { label: "D", text: "Both are caused by index bloat" }
      ],
      correct: 1,
      explanation: "Failure-mode L4. The article calls out both: 'Cross-shard transactions become nearly impossible, so you need to design your shard boundaries to avoid them. If a user transfer in your banking app requires updating accounts on different shards, you'll need distributed transactions or sagas, which are complex and slow. Hot spots happen when one shard gets disproportionate traffic (think Taylor Swift's shard getting hammered while others sit idle).' Two independent canonical sharding problems happening in the same scenario.",
      interviewScript: "Say: 'Two problems. Cross-shard transfers can't use a normal DB txn — I'd design a centralized transfer/ledger service that owns the consistency contract via sagas: debit on shard A succeeds and emits an event; credit on shard B is the saga's compensation/forward action; failures unwind. For the hot shard, I'd write-shard that one customer across N synthetic partition keys (e.g., user_id_0, user_id_1, ...) and aggregate on read, OR pin that customer to a dedicated shard with extra capacity. Either way, the architecture acknowledges that sharding distributes KEYS evenly but not LOAD.'",
      proTip: "Sagas for distributed correctness are the senior pattern in shared/sharded systems; mention 'forward saga' for the success path and 'compensating saga' for the rollback path. It signals you've thought about partial failures."
    },
    {
      id: "q32",
      category: "Sharding",
      difficulty: "L5",
      question: "In an interview, after you propose sharding by user_id, the interviewer asks: 'two years from now, your app's most common query becomes content-based search. Will you reshard?' What's the senior answer, and what does this question really test?",
      options: [
        { label: "A", text: "Yes, reshard immediately by content_id" },
        { label: "B", text: "Senior answer: 'Resharding is painful — moving petabytes between shards involves dual-writes during migration, freeze windows, or sophisticated online-migration tooling. Rather than reshard the primary store, I'd add a SEPARATE INDEX optimized for the new access pattern — an Elasticsearch cluster fed via CDC for content search, or a secondary KV store keyed by content hash. The original sharding decision (by user_id) keeps its existing access patterns fast; the new access pattern gets a derived store designed for it.' Sharding decisions are STICKY — the cost of changing them later is exactly what determined the right answer the first time. The question tests whether you understand that shard-key choice has long-tail consequences that are expensive to undo, NOT whether you can do the migration. The article: 'Resharding is painful. You can't just add a new shard without moving massive amounts of data around'" },
        { label: "C", text: "No, resharding is impossible — abandon the project" },
        { label: "D", text: "Switch to NoSQL — it doesn't need sharding" }
      ],
      correct: 1,
      explanation: "Trade-off-inversion + future-proofing L5. Resharding is one of the most operationally expensive moves in distributed databases — it involves bulk data movement, dual-write windows, version compatibility, and downtime risk. The senior recognition is that you DON'T reshard for a new access pattern; you LAYER an additional store optimized for it. This is the same pattern as adding Elasticsearch for search alongside Postgres for source-of-truth — separate stores for separate access patterns.",
      interviewScript: "Say: 'I wouldn't reshard. The original user_id key still serves user-scoped queries fast, which remains a workload. For the new content-search query, I'd add a separate index — Elasticsearch fed by CDC from the primary, or a secondary KV keyed by content hash. Resharding moves petabytes of data — extreme operational risk for what can be solved with a derived store. The principle: sharding decisions are sticky, and senior architecture layers new access patterns on top of them rather than redoing them.'",
      proTip: "When a senior interviewer asks 'will you do X (painful op)?' the test is usually 'do you know X is painful?' — not whether you'd do it. Acknowledge the pain, propose the layered alternative, and explain why."
    },
    {
      id: "q33",
      category: "Consistent Hashing",
      difficulty: "L1",
      question: "A distributed cache has 10 nodes, and you assign each cache key to a node by `hash(key) % 10`. You add 1 node, making the cluster 11. What fraction of keys, approximately, map to a different node than they did before, and why does this matter?",
      options: [
        { label: "A", text: "About 10% — only the new node's range moves" },
        { label: "B", text: "About 90% — almost every key now maps to a different node because the modulus changed from 10 to 11. For a cache, 90% of keys would suddenly miss; for a sharded DB, 90% of data would need to physically move. The article: 'With simple modulo hashing, adding one server to a 10-server cluster means moving roughly 90% of your data.' This is why naive modulo hashing isn't used for cluster scaling" },
        { label: "C", text: "About 1% — modulo is stable across N changes" },
        { label: "D", text: "About 50% — exactly half the keys move" }
      ],
      correct: 1,
      explanation: "The article: 'With simple modulo hashing, adding one server to a 10-server cluster means moving roughly 90% of your data. With consistent hashing, you only move about 10% (the keys that belonged to the affected range).' The math: hash(key) mod 10 vs hash(key) mod 11 produces almost completely different mappings. This is THE problem consistent hashing was invented to solve.",
      interviewScript: "Say: 'About 90%. With hash-mod-N, changing N reshuffles almost every key — for a cache that's a 90% hit-rate collapse, for a DB that's massive data migration. This is exactly the failure mode consistent hashing fixes: it makes adding/removing nodes cost O(K/N) movement instead of O(K).'",
      proTip: "Modulo hashing is fine for a static cluster you never scale. The moment you need elastic scaling — adding nodes for traffic spikes, removing them for cost — modulo becomes a non-starter and you need consistent hashing."
    },
    {
      id: "q34",
      category: "Consistent Hashing",
      difficulty: "L2",
      question: "In consistent hashing, both servers and keys are placed on a virtual ring (e.g., a 2^32-sized hash space). Given a key K, how is its server assignment determined?",
      options: [
        { label: "A", text: "K is assigned to the closest server CLOCKWISE on the ring (the next server reached when moving clockwise from K's position). When servers come and go, only keys in their ring-neighborhood are reassigned — the rest stay put. The article: 'You hash each key and place it on the ring, then the key belongs to the next server you encounter going clockwise. When you add a new server, only the keys between that new server and the previous server need to move'" },
        { label: "B", text: "K is hashed against ALL servers and the lowest-hash wins" },
        { label: "C", text: "K is randomly assigned at request time" },
        { label: "D", text: "K is broadcast to all servers and the fastest responder wins" }
      ],
      correct: 0,
      explanation: "The article describes the mechanic precisely: place servers on a ring (each server hashes to a position), place keys on the same ring (each key hashes to a position), key K belongs to the next server clockwise from K's position. The locality is the key insight: adding/removing a server only changes the assignment for keys in that server's ring-neighborhood, leaving everything else untouched.",
      interviewScript: "Say: 'The ring is a hash space — say 0 to 2^32-1. Every server gets hashed to a position on the ring. Every key gets hashed to a position on the ring. Each key belongs to the next server clockwise from its position. The locality property is what matters: add a server, only the keys in its slice of the ring (between its position and the previous server clockwise) move; add or remove anything else, those keys are untouched.'",
      proTip: "Real implementations use VIRTUAL NODES — each physical server hashes to multiple ring positions (e.g., 100-1000) — to avoid uneven slice sizes and to smooth out the impact of adding/removing a single server. Mention virtual nodes if probed; it's a small detail that signals real-world experience."
    },
    {
      id: "q35",
      category: "Consistent Hashing",
      difficulty: "L3",
      question: "You have a 10-node distributed cache using consistent hashing with virtual nodes for even distribution. You add one new node to the cluster. Roughly what fraction of cache keys end up reassigned to the new node, requiring a refetch from the source on next access?",
      options: [
        { label: "A", text: "About 90% — most keys reshuffle" },
        { label: "B", text: "About 10% — only the keys that previously belonged to the immediate ring-neighbors of the new node migrate to it; the rest stay put. The article: 'With consistent hashing, you only move about 10% (the keys that belonged to the affected range).' This 10% migration vs 90% with naive modulo hashing is the central reason consistent hashing exists: it makes elastic scaling practical without massive data movement" },
        { label: "C", text: "100% — all keys must be re-hashed to include the new node" },
        { label: "D", text: "0% — consistent hashing means no movement" }
      ],
      correct: 1,
      explanation: "Article quote is direct: ~10% movement with consistent hashing vs ~90% with modulo. The intuition: a new node 'steals' only its slice of the ring from the previous owner; every other slice is untouched. With virtual nodes, the steal is spread across multiple ring positions so it pulls roughly its proportional share (1/(N+1) of keys for a node added to an N-cluster).",
      interviewScript: "Say: '~10% with consistent hashing. The new node only takes over the ring slices it was inserted into; everywhere else, the existing assignment is untouched. With virtual nodes (the standard implementation), that ~10% is spread evenly across the previous owners rather than coming from one neighbor. Compare that to modulo, where adding a node remaps ~90% of keys.'",
      proTip: "When you add a node to a cache with consistent hashing, you get a temporary dip in hit rate (proportional to the keys reassigned) until the new node warms up. Mention 'cache warming' if you've thought through the operational story — pre-warm via background refetch or shadow traffic."
    },
    {
      id: "q36",
      category: "Consistent Hashing",
      difficulty: "L4",
      question: "Cite ONE specific real-world distributed system where consistent hashing is core to its operation, and explain (in one sentence) why.",
      options: [
        { label: "A", text: "PostgreSQL — it uses consistent hashing for indexes" },
        { label: "B", text: "Choices include: Cassandra and DynamoDB use it for partition placement (data distributed across nodes by token range on a ring); Redis Cluster uses it (slot-based variant) for client-side key routing; Memcached uses it for client-side server selection; some CDNs use it to consistently route a given URL to the same edge server. The common theme: these systems all distribute data or requests across many nodes that come and go elastically, and consistent hashing is what makes adding/removing nodes practical without rebalancing the entire dataset. The article: 'Distributed caches like Memcached and Redis Cluster use it to distribute keys across cache nodes. Distributed databases like Cassandra and DynamoDB use it for sharding. Some load balancers use it... CDNs use it to route requests to edge servers'" },
        { label: "C", text: "Postgres — replication uses consistent hashing" },
        { label: "D", text: "Kafka — partition assignment uses consistent hashing" }
      ],
      correct: 1,
      explanation: "Article quote names them all. The unifying property is ELASTICITY: every system in the list needs to add/remove nodes without rebuilding the world, and consistent hashing is the mechanism that makes that possible. Bonus context: Cassandra calls its ring 'tokens'; DynamoDB calls it 'partition placement'; Redis Cluster uses 16384 hash slots (a discrete consistent-hashing variant); Memcached's libmemcached client implements the textbook ring; CDNs like Akamai use it for cache-affinity at the edge.",
      interviewScript: "Say: 'Cassandra uses consistent hashing (token ranges on a ring) for partition placement. Adding a node only requires the new node to take over a slice of the token range — the rest of the cluster's data stays put. The same property makes elastic node addition/removal feasible at production scale.'",
      proTip: "Redis Cluster uses a slightly different model — fixed 16384 hash slots distributed across nodes — which gets the same locality property in a discrete form (easier to reason about exactly which slot moves where). Mention this if asked about Redis specifically."
    },
    {
      id: "q37",
      category: "Consistent Hashing",
      difficulty: "L5",
      question: "A candidate spends 3 minutes diagramming the consistent-hashing ring on the whiteboard for a problem where the system has a fixed-size 5-node Redis cluster that's been the same for 2 years. The interviewer is impatient. Why is this signal-NEGATIVE even though consistent hashing IS being used by Redis Cluster under the hood?",
      options: [
        { label: "A", text: "The candidate is showing off — always cut technical depth" },
        { label: "B", text: "Consistent hashing is the right MECHANISM, but the question 'why are you spending interview time explaining it?' is the test. For a stable cluster, consistent hashing happens transparently inside Redis Cluster — saying 'we use Redis Cluster, which routes keys via consistent hashing under the hood' in one sentence is enough. You spend whiteboard minutes on consistent hashing only when the design has ELASTIC scaling — adding/removing nodes dynamically — because that's where the mechanism's value (10% vs 90% movement) actually pays off. A 5-node static cluster doesn't exercise the property. The article: 'In interviews, you rarely need to explain how consistent hashing works unless specifically asked. It's enough to say we'll use consistent hashing to distribute data across cache nodes.' The negative signal: the candidate is treating mechanism depth as proof of seniority instead of explaining the trade-off in context" },
        { label: "C", text: "Consistent hashing is wrong for Redis Cluster" },
        { label: "D", text: "Redis Cluster doesn't actually use consistent hashing" }
      ],
      correct: 1,
      explanation: "Framing-is-wrong L5. The article: 'In interviews, you rarely need to explain how consistent hashing works unless specifically asked. It's enough to say \"we'll use consistent hashing to distribute data across cache nodes\"... The interviewer usually just wants to know you're aware of the technique. The main time to bring it up is when you're discussing elastic scaling.' Mechanism depth is a junior trap: candidates think 'I know the algorithm therefore I'm senior.' Senior signal is calibrating depth to the question — naming the technique once, deep-diving only when the design exercises its value (elastic node changes).",
      interviewScript: "Say: 'Redis Cluster handles key distribution internally — under the hood it uses 16384 hash slots distributed across nodes (a consistent-hashing variant). For our 5-node static cluster, that detail doesn't affect the design. I'd only deep-dive into the ring mechanics if we were discussing elastic scaling — adding nodes during traffic spikes, removing them at off-peak — because that's where the 10%-vs-90%-data-movement property pays off.'",
      proTip: "Calibration is a senior skill: brief mention vs deep-dive vs whiteboard diagram should track how much the topic actually affects the design. Whiteboard time is the most expensive resource in the interview — spend it where it differentiates."
    },
    {
      id: "q38",
      category: "CAP Theorem",
      difficulty: "L1",
      question: "In a distributed system that experiences a network partition between two of its data centers, what does the CAP theorem force you to choose between?",
      options: [
        { label: "A", text: "Consistency or Availability — you can't have both during a partition. Partition tolerance is essentially mandatory because partitions WILL happen in any real distributed system; given P, you choose C or A. The article: 'The CAP theorem... states you can only have two of three properties at once. Consistency, Availability, and Partition tolerance. Since network partitions are unavoidable in distributed systems, you're really choosing between consistency and availability'" },
        { label: "B", text: "Speed or correctness" },
        { label: "C", text: "Cost or reliability" },
        { label: "D", text: "Replication or sharding" }
      ],
      correct: 0,
      explanation: "Article quote is direct. The classic CAP framing 'pick 2 of 3' is technically correct but practically misleading: P (partition tolerance) is mandatory in any distributed system — you don't get to pick 'no partitions.' So the real-world CAP decision is between C and A during a partition.",
      interviewScript: "Say: 'CAP says you can pick at most 2 of {Consistency, Availability, Partition-tolerance}. But network partitions WILL happen in real distributed systems, so P is mandatory. The real choice is C vs A: during a partition, do you refuse requests (preserve consistency) or keep serving with possibly-stale data (preserve availability)?'",
      proTip: "Don't get stuck on the 'pick 2 of 3' formulation in interviews. Skip directly to 'P is given; the real question is C vs A under partition' — it shows you've internalized the practical takeaway, not just memorized the theorem."
    },
    {
      id: "q39",
      category: "CAP Theorem",
      difficulty: "L2",
      question: "During a network partition, the EU data center loses contact with the US data center. A user's read hits one of the two. In a CP system, what does the EU node do? In an AP system, what does the EU node do?",
      options: [
        { label: "A", text: "Both behave identically" },
        { label: "B", text: "CP: the EU node REFUSES the read (or returns an error) because it can't confirm its local data is still consistent with the rest of the system — it preserves correctness by trading availability. The system may go partially or fully down during partitions, but when it's up, the data is always correct. AP: the EU node SERVES the read with whatever data it has locally, possibly stale relative to US writes — it preserves availability by trading consistency. Users always get a response, but different nodes may temporarily have different data until the partition heals. The article: 'If you choose consistency, when a network partition happens, some nodes will refuse to serve requests rather than return potentially stale data... If you choose availability, every node keeps serving requests even during a partition'" },
        { label: "C", text: "CP serves stale data; AP refuses" },
        { label: "D", text: "Both serve fresh data magically" }
      ],
      correct: 1,
      explanation: "Article quote is direct. The behaviors are mirror images: CP refuses-to-be-stale, AP refuses-to-be-down. Neither is universally right; the choice depends on what cost you're willing to pay (system-down vs data-stale) for the workload at hand.",
      interviewScript: "Say: 'CP — node refuses the request, preserves correctness, may serve a 503 or timeout. AP — node serves what it has locally, possibly stale, system stays up. They're symmetric: CP buys correctness at the cost of availability; AP buys availability at the cost of correctness. For most user-facing workloads AP is the right default; CP fits where stale data costs real money.'",
      proTip: "Real systems aren't pure CP or AP — they're tunable. DynamoDB lets you pick consistency per request (eventual/strong); Cassandra lets you tune consistency level per query. The choice is per-operation, not per-system."
    },
    {
      id: "q40",
      category: "CAP Theorem",
      difficulty: "L3",
      question: "For an Instagram-style social feed, the engineering team debates: should reads be strongly consistent (always reflect the latest writes immediately) or eventually consistent (briefly stale, but always available)? What's the right choice and the underlying reasoning?",
      options: [
        { label: "A", text: "Strong — users need the latest post immediately at all costs" },
        { label: "B", text: "Eventual. For a social feed, a 2-second delay before a new post appears in followers' feeds is acceptable; the app being DOWN for any user is not. The article: 'For most systems, availability is the right default. Users can tolerate seeing slightly stale data (your Instagram feed being 2 seconds old), but they can't tolerate the app being down. Social media feeds, recommendation systems, and analytics dashboards all work fine with eventual consistency.' Eventual consistency means all replicas converge to the same state given enough time without new updates — a real, formal guarantee, perfectly acceptable for social, recommendations, analytics" },
        { label: "C", text: "Strong — financial regulations require it for any social network" },
        { label: "D", text: "Eventual — but only if you're cost-sensitive" }
      ],
      correct: 1,
      explanation: "The article: 'Social media feeds, recommendation systems, and analytics dashboards all work fine with eventual consistency.' The cost-of-stale-data calculus drives the choice: a 2-second-old like count is invisible to the user; a 5-minute outage is catastrophic. Strong consistency burns availability for a property the workload doesn't need.",
      interviewScript: "Say: 'Eventual. Social feed has a low cost of staleness — a 2-second delay before a like or post appears is invisible to the user. The cost of unavailability is high — Instagram going down for any user is a major incident. Eventual consistency lets every replica serve reads during a partition; the trade-off (briefly stale data) is acceptable for the workload.'",
      proTip: "The decision rule: 'what does it cost the user if data is stale for N seconds?' If the answer is 'nothing perceptible,' default to eventual. If the answer is 'we lose money or break a promise,' you need strong."
    },
    {
      id: "q41",
      category: "CAP Theorem",
      difficulty: "L4",
      question: "You're designing an e-commerce site. Product descriptions, reviews, and user profiles need one consistency model; inventory counts and order processing need another. What's the right pattern, and why is it not a contradiction to use both in the same system?",
      options: [
        { label: "A", text: "Pick one consistency model for the entire system — mixing creates bugs" },
        { label: "B", text: "Mixed-consistency is normal: product description / reviews / user profiles → eventual consistency (a 5-second-stale review is fine and the system stays up); inventory count / order processing → strong consistency (overselling the last unit costs real money and customer trust). Different parts of the same app can use different models because the COST of stale data is different per data type. The interviewer wants to see you align consistency to business cost, not pick a global default. The article: 'You don't have to pick one model for your entire system. It's common to have different consistency requirements for different parts of the same application'" },
        { label: "C", text: "Strong everything — safer" },
        { label: "D", text: "Eventual everything — faster" }
      ],
      correct: 1,
      explanation: "Article quote is direct. Real systems aren't single-consistency; they're per-data-domain consistency. Strong is expensive (latency cost from coordination, availability cost during partitions), so you pay for it only where the workload demands it. Reviews? Cheap to be stale → eventual. Inventory? Costs real money to be stale → strong.",
      interviewScript: "Say: 'Mixed. Product descriptions, reviews, user profiles all eventual — they're cheap to be stale. Inventory counts and order processing strong — overselling the last unit is a real-money mistake and customer-trust hit. Same database (or two databases), different consistency configurations per access pattern. The principle: align consistency to the cost-of-stale, not to a system-wide default.'",
      proTip: "DynamoDB demonstrates this nicely: every read can be specified strong or eventual at request time. So one table can serve reviews via eventual reads (fast, cheap) and inventory via strong reads (slower, more expensive) — application code picks per access pattern."
    },
    {
      id: "q42",
      category: "CAP Theorem",
      difficulty: "L4",
      question: "A candidate uses 'eventual consistency' and 'weak consistency' interchangeably. The interviewer asks: 'what's the precise difference?'",
      options: [
        { label: "A", text: "They're synonyms" },
        { label: "B", text: "EVENTUAL consistency GUARANTEES that all replicas will converge to the same state given enough time without new updates — it's a real, formal promise. WEAK consistency makes NO such guarantee — there's no formal promise the system will ever converge. 'Eventual' is the model behind correctly-designed systems like DynamoDB and Cassandra: divergence is bounded and resolved. 'Weak' is what you get when you accept divergence WITHOUT a convergence mechanism — much rarer in practice and usually not what you want. The article: 'eventual consistency, where the system guarantees that all nodes will converge to the same state given enough time without new updates. This is different from weak consistency, which makes no such guarantee about convergence'" },
        { label: "C", text: "Eventual is faster than weak" },
        { label: "D", text: "Weak supports more replicas than eventual" }
      ],
      correct: 1,
      explanation: "Subtle-distractor L4. The terms get used interchangeably in casual writing, but they're formally distinct. Eventual = bounded divergence + guaranteed convergence (the systems we actually want to use). Weak = no convergence guarantee (no system claims this in the wild because it's not a useful contract). Naming the distinction precisely is a senior signal — most candidates conflate the two.",
      interviewScript: "Say: 'Eventual consistency formally guarantees convergence: given enough time without new updates, all replicas will agree. Weak consistency makes no such promise — there's no contract about whether or when divergence resolves. DynamoDB and Cassandra are eventual; you'd never want a system that's merely \"weak\" because there's no guarantee the divergence ever heals. The two terms are often misused interchangeably.'",
      proTip: "Other consistency-model terms to know: strong (linearizable), sequential, causal, monotonic-read, read-your-writes, eventual. The hierarchy roughly goes: strong → sequential → causal → eventual → weak. Mention 'read-your-writes' as a useful weakening of strong that's commonly desired in user-facing apps."
    },
    {
      id: "q43",
      category: "CAP Theorem",
      difficulty: "L5",
      question: "During healthy network operation (no partition), a candidate proposes a globally-distributed strongly-consistent database with sub-10ms reads worldwide. The interviewer says 'walk me through that latency claim.' Why is the candidate's claim suspect, and what theorem articulates the trade-off?",
      options: [
        { label: "A", text: "The claim is fine — modern hardware delivers sub-10ms global reads" },
        { label: "B", text: "PACELC: during a Partition, choose Availability or Consistency. ELSE (in healthy operation), choose Latency or Consistency. Strong consistency requires nodes to coordinate before responding (e.g., quorum reads, two-phase commit). For globally-distributed nodes, even healthy-network coordination crosses oceans — speed-of-light alone is 50-150ms cross-continent, more for round trips. So 'global + strong + sub-10ms' is physically impossible for non-cached reads. CAP captures behavior during partitions; PACELC adds the L vs C trade-off everywhere else. The article: 'In practice this means that even when your network is healthy, choosing strong consistency adds latency because nodes need to coordinate before responding'" },
        { label: "C", text: "CAP theorem alone applies; PACELC is irrelevant" },
        { label: "D", text: "The claim is correct because of CDN caching" }
      ],
      correct: 1,
      explanation: "Trade-off-inversion L5. The article: 'It's worth knowing that the CAP theorem only describes behavior during network partitions, which are relatively rare. In normal operation, the real tradeoff is between consistency and latency. This is captured by the PACELC theorem: during a Partition, choose Availability or Consistency; Else, choose Latency or Consistency.' The candidate's claim violates physics: NY↔London ~80ms one-way, so NY-London-NY ~160ms round-trip; you can't quorum-read between them in 10ms.",
      interviewScript: "Say: 'PACELC. CAP only covers partition behavior; the everyday trade-off in healthy operation is Latency vs Consistency. Strong consistency requires coordination — quorum reads, leader contact — and for globally-distributed replicas, that coordination crosses oceans. NY-London round trip is ~160ms minimum from light-speed. So global-strong-sub-10ms is physically impossible. The candidate is selling the impossible trio; the realistic options are global-eventual (sub-10ms reads, eventual consistency) or regional-strong (sub-10ms within a region, slow for cross-region).'",
      proTip: "Spanner and CockroachDB give you global strong consistency, but with the latency cost made explicit (and reduced via TrueTime / hybrid clocks). Their cross-region read latencies are tens to hundreds of ms, not sub-10ms. Citing them shows you've engaged with the real implementations of this trade-off."
    },
    {
      id: "q44",
      category: "Numbers",
      difficulty: "L1",
      question: "Order these from FASTEST (top) to SLOWEST (bottom): cross-continent network round trip, intra-data-center network round trip, SSD read, RAM access.",
      options: [
        { label: "A", text: "RAM access < SSD read < intra-DC network < cross-continent network. Order-of-magnitude ranges per the article: ~ns < ~µs < ~1-10ms < tens-to-hundreds-of-ms. These gaps are what drive system-design decisions: when to cache (memory wins by 1000x over SSD), when to add CDN/regional deployment (cross-continent latency dominates everything else)" },
        { label: "B", text: "They're roughly the same; modern hardware closes the gap" },
        { label: "C", text: "Cross-continent is fastest because of fiber" },
        { label: "D", text: "SSD reads are faster than RAM access in modern hardware" }
      ],
      correct: 0,
      explanation: "The article: 'Memory access takes nanoseconds. SSD reads take microseconds. Network calls within a data center take 1-10 milliseconds. Cross-continent calls take tens to hundreds of milliseconds.' The hierarchy is fundamental and changes order-of-magnitude scale every step. Internalizing it lets you reason about why caches work (RAM is 1000x faster than SSD), why CDNs help (avoiding cross-continent calls), and why batching matters (fewer round trips).",
      interviewScript: "Say: 'RAM in nanoseconds; SSD in microseconds; intra-data-center network 1-10ms; cross-continent network tens-to-hundreds-of-ms. Each step is roughly 3 orders of magnitude. That hierarchy is what justifies caches (RAM beats SSD by 1000x) and CDNs (avoid the cross-continent step), and why round-trip count dominates architecture choices.'",
      proTip: "There's a famous chart from Jeff Dean (Google) of these latencies — memorize the order-of-magnitude ranges. Citing them in capacity discussions is one of the cheapest ways to signal 'I think in terms of physical hardware.'"
    },
    {
      id: "q45",
      category: "Numbers",
      difficulty: "L2",
      question: "A candidate proposes sharding Postgres at 500 GB of total data. Why is this premature?",
      options: [
        { label: "A", text: "A single Postgres instance comfortably handles a few terabytes of data on modern hardware. The sharding trigger isn't 500 GB — it's hitting tens-to-hundreds of TB, OR write throughput beyond ~tens of K TPS, OR read throughput that even read replicas can't handle. The article: 'A single Postgres instance handles a few terabytes comfortably. You don't need sharding until you're hitting tens or hundreds of terabytes. If someone proposes sharding at 500GB, they're adding massive complexity for no reason.' Sharding at 500GB adds substantial complexity (cross-shard txns, resharding pain, hot spots, application shard-awareness) for zero capacity benefit" },
        { label: "B", text: "500 GB is the right sharding trigger; the candidate is correct" },
        { label: "C", text: "Postgres can't scale past 100 GB" },
        { label: "D", text: "Sharding should be done at 50 GB" }
      ],
      correct: 0,
      explanation: "Article quote is direct. 500 GB on a modern Postgres on a beefy box is comfortable. Disk is cheap, RAM caches working sets, indexes fit. The sharding trigger is when one box CAN'T do the job — measured against modern hardware capacity, not 2010-era assumptions.",
      interviewScript: "Say: 'A single tuned Postgres handles a few TB easily. 500 GB is well within one instance's capacity. The sharding trigger is tens-to-hundreds of TB, OR sustained writes past tens of K TPS, OR reads beyond replica capacity. Sharding at 500 GB adds cross-shard transaction problems, hot-spot risk, and application complexity for zero capacity benefit. Premature sharding is one of the most common scaling anti-patterns.'",
      proTip: "Modern hardware capacity is roughly: well-tuned Postgres handles tens of K writes/sec and several TB of data; a single Redis handles hundreds of K ops/sec. Memorize these — they're the numbers that prevent premature scaling architecture."
    },
    {
      id: "q46",
      category: "Numbers",
      difficulty: "L3",
      question: "Your interviewer asks: 'how many app servers do you need?' Your traffic profile is 50K req/sec, and a typical Java app server in your fleet handles ~5K req/sec at 70% CPU. What's the senior way to answer, and why does it matter that you DO the math instead of memorizing a number?",
      options: [
        { label: "A", text: "'About 10 servers, plus headroom — say, 12-15 — to absorb spikes and to handle a server going down for deploy or failure.' Math: 50K / 5K = 10 servers at full utilization, but you don't run at full; targeting ~70% utilization means you size for capacity, then add 1-2 for redundancy. Doing the math LIVE in the interview shows you reason about capacity in context. Memorizing '10 servers handle anything' is what makes a candidate look junior. The article: 'Walk through it. We're expecting 50K requests per second, each server can handle maybe 5K requests, so we need around 10 servers plus some headroom. The interviewer wants to see you think through the math, not recite memorized facts'" },
        { label: "B", text: "50 servers, to be safe" },
        { label: "C", text: "1 server — modern CPUs are very fast" },
        { label: "D", text: "The answer can't be computed without more data" }
      ],
      correct: 0,
      explanation: "Article quote is direct. Capacity math is a process, not a fact. The senior signal is showing the work — 'request rate ÷ per-server capacity = baseline count, plus headroom for spikes and failover.' The number itself is less important than the structure of the reasoning, because capacity assumptions (per-server throughput, target utilization, peak vs average) are workload-specific.",
      interviewScript: "Say: '50K req/sec ÷ 5K per server ≈ 10 servers at full utilization. Real systems target ~70% CPU at peak, so I'd add headroom: 12-15 servers, with auto-scaling between, say, 8 and 20 to absorb traffic variance. Plus that gives me capacity to lose 1-2 nodes during deploys or failures without dropping under SLA.'",
      proTip: "Always size for (request rate × handler time) ÷ (target utilization × cores per server) and add headroom for failover. Walking through the formula explicitly is more impressive than landing on the right number — interviewers are testing the reasoning structure."
    },
    {
      id: "q47",
      category: "Numbers",
      difficulty: "L4",
      question: "A candidate confidently says: 'we'll need a Redis cluster of 50 nodes to handle 100K ops/sec for our cache.' Why is this a yellow flag, and what's the more senior framing?",
      options: [
        { label: "A", text: "Capacity is right; Redis nodes can each only do 2K ops/sec" },
        { label: "B", text: "A SINGLE Redis instance handles HUNDREDS OF THOUSANDS of ops/sec. 100K ops/sec is well within ONE node's capacity. A 50-node cluster for 100K ops/sec means 2K ops/sec per node — using ~1% of each node's capacity. The candidate is using 2010-era hardware numbers and prematurely architecting for scale they don't have. Senior framing: 'Single Redis handles ~100-500K ops/sec, so 100K fits in one node + a hot standby for failover. We'd shard only when we need >500K ops/sec OR memory exceeds one node's RAM.' The article: 'A single Redis instance handles hundreds of thousands of operations per second. If you're using 2010-era numbers in your head, you'll propose sharding and caching way earlier than you need to'" },
        { label: "C", text: "Redis can never run as a single node in production" },
        { label: "D", text: "50 nodes is correct because of replication overhead" }
      ],
      correct: 1,
      explanation: "Estimation-backed L4 + adversarial pushback. The article gives the specific number: hundreds of thousands of ops/sec on a single Redis. 100K ops/sec is comfortable on one box. 50 nodes for 100K ops/sec is so far over-provisioned it actively hurts: more nodes = more failure modes, more network hops, more operational complexity. The yellow flag is the candidate using outdated capacity numbers OR not having capacity numbers at all and over-architecting by reflex.",
      interviewScript: "Say: 'A single Redis handles ~100-500K ops/sec. 100K fits in one node, so I'd run a primary + a replica for failover — two nodes, not 50. We'd shard when sustained ops/sec passes ~500K, or when the dataset exceeds the RAM of one node. Right-sizing matters: 50 nodes for a 100K workload is operational complexity buying nothing.'",
      proTip: "Modern numbers to drill in: single Redis ~100-500K ops/sec; tuned Postgres ~tens of K writes/sec; app servers ~5-10K req/sec each with 100K+ concurrent connections. These are the right-now reality on commodity cloud hardware."
    },
    {
      id: "q48",
      category: "Numbers",
      difficulty: "L5",
      question: "In an interview retrospective, a senior interviewer says: 'I'd have given the candidate a higher score if they'd named even ONE specific scale trigger for one of their components.' What is a 'scale trigger,' and what would you name for THREE different components in a system?",
      options: [
        { label: "A", text: "A scale trigger is a vague performance goal like 'when it's slow'" },
        { label: "B", text: "A scale trigger is a SPECIFIC metric crossing a SPECIFIC threshold that signals 'this component now needs scaling action.' Examples: (1) CACHE: hit rate drops below 80% (cache is sized too small or churning), latency creeps above 1ms (cache is overloaded), or memory above 80% (eviction pressure). (2) DATABASE: write throughput passes ~10K TPS sustained (single-node limit approaching), uncached read latency exceeds 5ms (need replicas or caching layer), or geographic-distribution requirements emerge. (3) APP SERVERS: CPU above 70%, response latency above SLA, concurrent connections approaching 100K per instance, or memory above 80%. (4) MESSAGE QUEUE: throughput nearing 800K msgs/sec per broker, partition count near 200K per cluster, or growing consumer lag. Naming a trigger shows you've thought about WHEN you'd act, not just WHAT you'd do — the operational signal that distinguishes seniors from architects-in-theory" },
        { label: "C", text: "Triggers don't exist; you scale on intuition" },
        { label: "D", text: "Trigger means the time of day to scale" }
      ],
      correct: 1,
      explanation: "Future-proofing + cross-part synthesis L5. The article gives explicit triggers in its table: caching (hit rate <80%, latency >1ms, memory >80%, churn); databases (writes >10K TPS, read latency >5ms uncached, geo needs); app servers (CPU >70%, latency >SLA, conns near 100K/instance, memory >80%); MQ (throughput near 800K/sec, partitions ~200K/cluster, growing consumer lag). Triggers are the operational layer of a design — when to apply the scaling moves you've described. Designs without triggers are static blueprints; designs with triggers are living systems with explicit operational decision points.",
      interviewScript: "Say: 'For each scaling move I'd propose, I'd name the trigger. For the cache: hit rate below 80% means it's too small or churning — time to grow it or shard it. For the DB: sustained writes past 10K TPS or uncached reads above 5ms means we're approaching single-instance limits — time to add replicas or shard. For app servers: CPU above 70% or concurrent connections approaching 100K — time to scale out. Naming the trigger turns the design from a static blueprint into an operational plan with explicit decision points.'",
      proTip: "Pair every scaling decision in your design with the trigger that would activate the next stage. 'We'll start with single Postgres → trigger: writes past 10K TPS → action: add a read replica → trigger: writes past 30K TPS → action: shard by user_id.' That ladder is what makes a design feel like real engineering rather than a wish list."
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
            Coverage by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {QUIZ_DATA.categories.map(cat => (
              <div key={cat} className="text-sm text-gray-400 flex items-center justify-between px-2 py-1">
                <span>{cat}</span>
                <span className="text-gray-600">({categoryTotals[cat] || 0})</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Each category climbs the L1→L5 difficulty ladder. L5 questions test trade-off inversion, framing-is-wrong, and cross-category synthesis — the patterns staff-level interviewers probe.
          </p>
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

  const difficultyColor = {
    L1: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    L2: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    L3: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    L4: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    L5: "bg-red-500/10 text-red-400 border-red-500/30",
  }[question.difficulty] || "bg-gray-700 text-gray-400 border-gray-600";

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
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold flex-shrink-0">
              {question.category}
            </span>
            {question.difficulty && (
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 border ${difficultyColor}`}>
                {question.difficulty}
              </span>
            )}
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

  const tierScores = {};
  questions.forEach((q, idx) => {
    const tier = q.difficulty || "Untiered";
    if (!tierScores[tier]) tierScores[tier] = { correct: 0, total: 0 };
    tierScores[tier].total += 1;
    if (answers[idx] === q.correct) tierScores[tier].correct += 1;
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Accuracy by Tier</h3>
          </div>
          <div className="space-y-3">
            {["L1", "L2", "L3", "L4", "L5"].filter(t => tierScores[t]).map((tier) => {
              const data = tierScores[tier];
              const tierPct = Math.round((data.correct / data.total) * 100);
              let barColor = "bg-emerald-500";
              if (tierPct < 50) barColor = "bg-red-500";
              else if (tierPct < 75) barColor = "bg-amber-500";
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-mono font-bold">{tier}</span>
                    <span className="text-sm font-semibold text-gray-400">{data.correct}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${tierPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
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
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-700 text-gray-400 text-xs font-mono flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                        {q.category}
                      </span>
                      {q.difficulty && (
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold flex-shrink-0">
                          {q.difficulty}
                        </span>
                      )}
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

export default function CoreConceptsOverviewQuiz({ quizSlug = 'in-a-hurry-core-concepts' }) {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(90);
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUIZ_DATA.questions.length);

  const questions = QUIZ_DATA.questions;

  const tierTimer = (difficulty) => {
    switch (difficulty) {
      case "L1": return 60;
      case "L2": return 90;
      case "L3": return 90;
      case "L4": return 120;
      case "L5": return 150;
      default: return 90;
    }
  };

  const startTimer = useCallback((difficulty) => {
    const initialTime = tierTimer(difficulty);
    setTimer(initialTime);
    if (timerRef.current) clearInterval(timerRef.current);
    return;
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev;
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
    startTimer(questions[0]?.difficulty);
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
      const nextIdx = currentQ + 1;
      setCurrentQ(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
      startTimer(questions[nextIdx]?.difficulty);
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
