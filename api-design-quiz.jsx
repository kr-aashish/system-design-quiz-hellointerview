// === COVERAGE MANIFEST ===
// Content type: mixed (broad survey with deep REST coverage)
//
// HEAVY subtopics:
//   REST Resource Modeling — Questions: 4 — IDs: [q1, q2, q3, q4]
//     └─ Nested: Plural nouns & URL structure — covered by: [q1]
//     └─ Nested: Path params vs query params — covered by: [q2, q3]
//     └─ Nested: Nested vs flat resources — covered by: [q4]
//   REST HTTP Methods & Idempotency — Questions: 4 — IDs: [q5, q6, q7, q8]
//     └─ Nested: PUT vs PATCH semantics — covered by: [q5]
//     └─ Nested: Idempotency & retries — covered by: [q6, q7]
//     └─ Nested: POST side effects — covered by: [q8]
//   REST Data Passing & Responses — Questions: 3 — IDs: [q9, q10, q11]
//     └─ Nested: Request body vs query vs path — covered by: [q9]
//     └─ Nested: Status codes (4xx vs 5xx) — covered by: [q10, q11]
//   GraphQL — Questions: 4 — IDs: [q12, q13, q14, q15]
//     └─ Nested: Over/under-fetching — covered by: [q12]
//     └─ Nested: Schema design & resolvers — covered by: [q13]
//     └─ Nested: N+1 problem — covered by: [q14]
//     └─ Nested: Field-level authorization — covered by: [q15]
//   Authentication & Authorization — Questions: 4 — IDs: [q16, q17, q18, q19]
//     └─ Nested: API Keys vs JWT — covered by: [q16, q17]
//     └─ Nested: JWT stateless verification — covered by: [q18]
//     └─ Nested: RBAC — covered by: [q19]
//
// MEDIUM subtopics:
//   RPC / gRPC — Questions: 3 — IDs: [q20, q21, q22]
//     └─ Nested: Protocol Buffers & type safety — covered by: [q20]
//     └─ Nested: When to use RPC vs REST — covered by: [q21, q22]
//   Pagination — Questions: 2 — IDs: [q23, q24]
//     └─ Nested: Offset vs cursor trade-offs — covered by: [q23, q24]
//   API Type Selection (REST vs GraphQL vs RPC) — Questions: 2 — IDs: [q25, q26]
//   Rate Limiting — Questions: 2 — IDs: [q27, q28]
//
// THIN subtopics (standalone):
//   Versioning Strategies — Questions: 1 — IDs: [q29]
//   Interview Strategy / Time Management — Questions: 1 — IDs: [q30]
//
// THIN subtopics (clustered):
//   Cluster: Real-time protocols + API type decision — Questions: 1 — IDs: [q31]
//
// CROSS-SUBTOPIC bridges:
//   GraphQL × Load Balancing/Caching — IDs: [q32]
//   REST × RPC (public vs internal) — IDs: [q33]
//   Pagination × GraphQL — IDs: [q34]
//   Auth × Rate Limiting — IDs: [q35]
//
// Anti-pattern questions: 4 — IDs: [q3, q8, q14, q28]
// Gotcha/trap questions: 4 — IDs: [q6, q15, q18, q24]
//
// Total: 35 questions across 12 subtopics (5 heavy, 4 medium, 3 thin)
// ========================

// Data-only quiz module. Rendering lives in QuizEngine.jsx.

export const QUESTIONS = [
  {
    "id": "q1",
    "subtopic": "REST Resource Modeling",
    "tier": "heavy",
    "style": "Anti-pattern identification",
    "question": "A candidate designing a food delivery API proposes these endpoints: POST /createOrder, GET /fetchOrder/{id}, POST /cancelOrder/{id}, GET /getRestaurants. Your interviewer asks you to critique this design. What is the most critical flaw?",
    "options": [
      "Endpoints use verbs instead of nouns — REST resources should be plural nouns (e.g., /orders, /restaurants) with HTTP methods conveying the action",
      "The endpoints should all use POST since they modify server state in some way",
      "The /fetchOrder endpoint should use a query parameter instead of a path parameter for the ID",
      "The cancel endpoint should use DELETE /orders/{id} instead because cancellation always means deletion"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "REST resources represent things, not actions. Using verbs like 'createOrder' or 'fetchOrder' conflates the HTTP method with the resource name. The correct pattern is POST /orders (create), GET /orders/{id} (fetch), PATCH /orders/{id} with a status change (cancel), and GET /restaurants. Option D is tempting but cancellation isn't always deletion — it's often a status change on the order resource.",
    "interviewScript": "In your interview, say: 'REST is resource-oriented, so I'd model these as /orders and /restaurants with plural nouns. The HTTP method — GET, POST, PATCH, DELETE — conveys the action. For cancellation, I'd use PATCH /orders/{id} to update the order status rather than DELETE, since we want to preserve the order record.'",
    "proTip": "When an interviewer sees you naturally use plural nouns and separate actions from resources, they mark you as someone who's built production APIs — it's a quick signal of real-world experience."
  },
  {
    "id": "q2",
    "subtopic": "REST Resource Modeling",
    "tier": "heavy",
    "style": "Scenario-based trade-off",
    "question": "You're designing an e-commerce API. Products belong to categories, and users want to browse products filtered by category, price range, and availability. A colleague suggests /categories/{categoryId}/products?minPrice=10&maxPrice=50&available=true. Another suggests /products?category={categoryId}&minPrice=10&maxPrice=50&available=true. Which is the stronger design and why?",
    "options": [
      "The nested route is better because it enforces that products always belong to a category, matching the database foreign key relationship",
      "The flat route is better because category is one of several optional filters — nesting implies a required parent-child relationship that doesn't match the query pattern here",
      "Both are equivalent in REST; the choice is purely aesthetic and has no functional impact",
      "The nested route is better because it enables the server to optimize queries by partitioning on category first"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The key principle is: use path parameters (nesting) when the relationship is required, and query parameters when the filter is optional. Here, users might browse all products without a category filter, or filter by price alone. Making category a query parameter keeps it optional alongside other filters. The nested route forces every product query to specify a category, which doesn't match the use case. Option D describes a backend optimization that shouldn't drive API design.",
    "interviewScript": "In your interview, say: 'I'd use /products with query parameters because category is one of several optional filters. Nesting implies a required parent-child relationship — use it when the child resource doesn't make sense without the parent, like /events/{id}/tickets where tickets inherently belong to an event.'",
    "proTip": null
  },
  {
    "id": "q3",
    "subtopic": "REST Resource Modeling",
    "tier": "heavy",
    "style": "Anti-pattern identification",
    "question": "A candidate designs a social media API with: GET /users/{id}/posts (user's posts), GET /users/{id}/followers (user's followers), GET /users/{id}/followers/{followerId}/posts (posts from a specific follower). The interviewer raises an eyebrow at the last endpoint. What's the issue?",
    "options": [
      "The nesting is too deep — follower posts don't have a parent-child relationship with the user's followers; /users/{followerId}/posts already provides this data",
      "The endpoint should use POST instead of GET since accessing another user's posts requires write permission to log the access event in the audit trail — any read operation that triggers side effects should use POST to signal that the request is not idempotent",
      "Follower IDs should be passed as query parameters instead of path parameters — the correct endpoint would be /users/{id}/followers?followerId=456&include=posts, which keeps the URL flat and allows additional filter parameters to be added without deepening the nesting",
      "The primary problem is performance — three levels of URL nesting causes three separate database joins in the query execution plan, where each nesting level adds a JOIN clause, and the compounding JOIN overhead degrades query latency exponentially with nesting depth"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "Deep nesting creates confusing, redundant endpoints. A follower's posts don't conceptually belong to the 'following' relationship — they belong to the follower user. /users/{followerId}/posts already serves this purpose. The deeply nested path implies a different resource than what it actually returns. Option D is wrong because URL structure doesn't determine query execution — the server can optimize independently of URL depth.",
    "interviewScript": "In your interview, say: 'I'd avoid deep nesting beyond two levels. The follower's posts already exist at /users/{followerId}/posts — the deeply nested path creates a confusing alternative that returns the same data. Keep nesting for genuine parent-child relationships where the child doesn't exist independently.'",
    "proTip": "A good rule of thumb: if you can access the same resource through a shorter URL, the deeper nesting is probably wrong."
  },
  {
    "id": "q4",
    "subtopic": "REST Resource Modeling",
    "tier": "heavy",
    "style": "Decision framework application",
    "question": "You're building a project management tool. Tasks always belong to exactly one project, but tasks can also have labels (many-to-many). How should you model accessing tasks for a project and filtering tasks by label?",
    "options": [
      "Use /projects/{id}/tasks for project tasks AND /labels/{id}/tasks for label tasks — consistent nesting for both relationships",
      "Use /projects/{id}/tasks for project tasks (required parent) AND /tasks?label={id} for label filtering (optional filter)",
      "Use /tasks?project={id} for project tasks AND /tasks?label={id} for label tasks — keep everything flat with query params",
      "Use /tasks/{id} only and embed project and label info in the response — let clients filter client-side"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The key distinction is the nature of the relationship. Tasks ALWAYS belong to one project (required parent-child), so nesting /projects/{id}/tasks is appropriate — a task without a project doesn't make sense. Labels are many-to-many and optional, so /tasks?label={id} works better as a filter. Option A applies nesting uniformly but labels don't 'own' tasks. Option C makes the required project relationship look optional. Option D pushes filtering to the client, wasting bandwidth.",
    "interviewScript": "In your interview, say: 'I'd nest tasks under projects because it's a required one-to-many relationship — every task must have a project. But for labels, which are many-to-many and optional, I'd use query parameters: /tasks?label=bug&label=urgent. This reflects the actual data model in the URL structure.'",
    "proTip": null
  },
  {
    "id": "q5",
    "subtopic": "REST HTTP Methods & Idempotency",
    "tier": "heavy",
    "style": "Implementation-specific nuance",
    "question": "A user profile has fields: name, email, bio, and avatar_url. A mobile client only needs to update the user's email. The team debates between PUT /users/{id} and PATCH /users/{id}. Why does this distinction matter, and what could go wrong with the wrong choice?",
    "options": [
      "PUT requires sending the FULL resource — sending only {email: 'new@email.com'} would null out name, bio, and avatar_url, causing silent data loss",
      "PATCH is dangerous here because it's not idempotent — updating email could trigger cascading updates to other systems",
      "PUT is safer because it's idempotent, meaning the server can safely retry it if the network fails",
      "There's no practical difference — both PUT and PATCH accept partial updates in modern REST implementations"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "PUT semantics mean 'replace the entire resource with this payload.' If you send only {email: 'new@email.com'} via PUT, a spec-compliant server would set name, bio, and avatar_url to null/empty. This is a real production footgun. PATCH is designed for partial updates — you send only the fields you want to change. While PUT is idempotent (option C), that advantage doesn't help if the first call already destroyed data. Option D is wrong — the HTTP spec defines clear differences.",
    "interviewScript": "In your interview, say: 'I'd use PATCH for partial updates like changing just an email. PUT replaces the entire resource, so sending a partial payload would wipe out fields you didn't include. This is a common source of bugs when teams misuse PUT for partial updates.'",
    "proTip": "This is a real-world bug that hits production systems. Many developers use PUT for partial updates, and it works until a client forgets a field and silently nulls production data."
  },
  {
    "id": "q6",
    "subtopic": "REST HTTP Methods & Idempotency",
    "tier": "heavy",
    "style": "Gotcha/trap question",
    "question": "Your booking service receives a POST /bookings request. The server creates the booking and writes to the database, but the response is lost due to a network partition. The client retries the same POST request. What happens, and what's the correct mitigation?",
    "options": [
      "Nothing — POST is idempotent, so the server recognizes the duplicate and returns the existing booking",
      "A duplicate booking is created because POST is not idempotent; mitigate with an idempotency key in the request header that the server checks before processing",
      "The server returns a 409 Conflict because the booking already exists in the database",
      "The retry fails with 400 Bad Request because the original request already consumed the resource (e.g., the ticket)"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "POST is NOT idempotent — each call creates a new resource. The retry creates a duplicate booking, potentially double-charging the user. The standard mitigation is an idempotency key: the client generates a unique ID (e.g., UUID) and sends it with every request. The server stores this key alongside the booking, and if it sees the same key again, returns the original response instead of creating a new booking. Option A is the trap — it confuses POST with PUT. Option C would only work if you had unique constraints matching all request fields.",
    "interviewScript": "In your interview, say: 'POST isn't idempotent, so network retries can create duplicates. I'd implement idempotency keys — the client sends a unique request ID, and the server deduplicates. This is critical for any operation with financial consequences like bookings or payments.'",
    "proTip": "Stripe, PayPal, and every serious payment API requires idempotency keys on POST requests. Mentioning this in an interview signals production experience with distributed systems."
  },
  {
    "id": "q7",
    "subtopic": "REST HTTP Methods & Idempotency",
    "tier": "heavy",
    "style": "Failure analysis",
    "question": "You call DELETE /bookings/123 and receive a 204 No Content. Your client crashes before processing the response. On restart, the client retries DELETE /bookings/123. What's the expected behavior, and does this indicate a problem?",
    "options": [
      "The retry returns 404 Not Found — this is expected and not a problem because DELETE is idempotent (the server state is the same: booking is gone)",
      "The retry returns 204 again — the server must return the same response code for idempotent operations",
      "The retry causes an error because you can't delete an already-deleted resource — the client needs to check first with GET",
      "The retry could partially restore the booking if the server uses soft deletes, creating an inconsistent state"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "DELETE is idempotent — the key insight is that idempotency means the SERVER STATE is the same after repeated calls, not that the RESPONSE CODE is identical. The first DELETE returns 204, the retry returns 404, but in both cases the booking is gone. This is correct behavior. Option B is wrong — idempotency is about server state, not response codes. The client should handle both 204 and 404 as success cases for DELETE retries.",
    "interviewScript": "In your interview, say: 'DELETE is idempotent — repeated calls leave the server in the same state. The response code might change from 204 to 404 on retry, but that's fine. Idempotency guarantees state consistency, not response consistency. My client would treat both as successful deletion.'",
    "proTip": "Many candidates confuse idempotency with 'same response every time.' The correct definition is 'same server-side effect every time.' The response can differ."
  },
  {
    "id": "q8",
    "subtopic": "REST HTTP Methods & Idempotency",
    "tier": "heavy",
    "style": "Anti-pattern identification",
    "question": "A candidate designs a ride-sharing API where POST /rides/{id}/cancel cancels a ride. The interviewer points out that this violates REST principles. The candidate argues 'cancel is an action, and POST is for actions.' What's the strongest critique of this design?",
    "options": [
      "The endpoint uses a verb ('cancel') as a resource — in REST, cancellation should be modeled as a state change: PATCH /rides/{id} with {status: 'cancelled'}",
      "Cancel should use DELETE /rides/{id} since cancellation is conceptually equivalent to deletion",
      "The POST method is correct but the URL should be /cancel-ride/{id} to follow URL naming conventions",
      "This is actually fine — not every operation maps cleanly to CRUD, and action-oriented endpoints are acceptable in REST"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "REST models everything as resources, not actions. Cancellation is a state transition on the ride resource, best modeled as PATCH /rides/{id} with a status update. Using POST /rides/{id}/cancel is RPC-style thinking in a REST API. Option B is wrong because cancellation preserves the ride record (for billing, history). Option D sounds reasonable but the interviewer specifically asked for a critique — and the REST principle is clear that resources shouldn't be verbs.",
    "interviewScript": "In your interview, say: 'In REST, I model cancellation as a state change on the resource rather than a separate action endpoint. PATCH /rides/{id} with {status: \"cancelled\"} keeps the ride history intact and follows resource-oriented design. If we find ourselves adding verb endpoints, that's a signal we might want RPC for that service.'",
    "proTip": null
  },
  {
    "id": "q9",
    "subtopic": "REST Data Passing & Responses",
    "tier": "heavy",
    "style": "Scenario-based trade-off",
    "question": "You're designing a search API for a real estate platform. Users search with complex filters: location (lat/lng/radius), price range, property type, number of bedrooms, amenities (pool, gym, parking — multiple possible), and sort order. How should this data be passed?",
    "options": [
      "POST /properties/search with all filters in the request body — complex filter objects with arrays don't fit cleanly in query strings",
      "GET /properties with all filters as query parameters — searches are read operations and should be cacheable via GET",
      "GET /properties with simple filters as query params and complex filters (amenities array, location object) in the request body",
      "Create a /search-sessions resource: POST to create a search with all filters, then GET the results from the returned session URL"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Searches are read operations — using GET enables HTTP caching, browser history, and shareable URLs. All these filters can be encoded as query parameters: /properties?lat=40.7&lng=-74.0&radius=5&minPrice=200000&maxPrice=500000&type=condo&bedrooms=2&amenities=pool,gym&sort=price_asc. Option A uses POST which breaks cacheability. Option C puts a body on GET, which is technically allowed but poorly supported by many clients and caches. Option D overcomplicates a simple read operation.",
    "interviewScript": "In your interview, say: 'I'd use GET with query parameters because search is a read operation, and GET enables caching and URL sharing. Even complex filters like arrays can be comma-separated in query params. I'd only reach for POST /search if query strings exceeded URL length limits, around 2000 characters.'",
    "proTip": "The URL length limit is a real constraint. If your search filters genuinely can't fit in ~2000 characters (rare but possible with geo-polygon searches), POST /search is the pragmatic choice."
  },
  {
    "id": "q10",
    "subtopic": "REST Data Passing & Responses",
    "tier": "heavy",
    "style": "Implementation-specific nuance",
    "question": "Your API receives a request to create a booking, but the requested event doesn't exist. A junior developer returns 500 Internal Server Error because 'the server couldn't complete the request.' What's wrong with this, and what should the correct response be?",
    "options": [
      "Return 400 Bad Request — the client sent an invalid event ID, which is a malformed request",
      "Return 404 Not Found — the referenced event resource doesn't exist, and this is the client's responsibility to verify",
      "Return 422 Unprocessable Entity — the request syntax is valid but the semantics are wrong (referencing a nonexistent event)",
      "500 is correct — the server failed to fulfill a valid request, and the reason should be in the error body"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The critical distinction is 4xx (client error) vs 5xx (server error). A nonexistent event is NOT a server failure — the server is working correctly by rejecting an invalid reference. 404 is appropriate because the client referenced a resource (event) that doesn't exist. 400 implies the request format itself is wrong (missing fields, bad JSON), not that a referenced entity doesn't exist. 422 is also reasonable but less commonly used. 500 would mislead monitoring systems into flagging a server health issue when the client simply sent a bad ID.",
    "interviewScript": "In your interview, say: 'The difference between 4xx and 5xx matters for monitoring and debugging. 5xx means our system is broken; 4xx means the client sent something wrong. A nonexistent event ID is a client error — I'd return 404 so our alerting systems don't false-alarm.'",
    "proTip": "In production, 5xx rates trigger pager alerts. Miscategorizing client errors as 500s means your on-call engineer gets woken up for user typos."
  },
  {
    "id": "q11",
    "subtopic": "REST Data Passing & Responses",
    "tier": "heavy",
    "style": "Multi-hop reasoning",
    "question": "Your API returns 201 Created when a booking is successfully made. The response body includes the full booking object with a generated ID. A client developer asks: 'Why not just return 200 OK? Both mean success.' What's the interview-quality answer?",
    "options": [
      "201 specifically signals that a new resource was created, which tells API consumers, caches, and middleware to update their state — 200 doesn't communicate what kind of success occurred",
      "There's no practical difference — 200 and 201 are interchangeable for successful responses, and using 201 is just convention",
      "201 is required by the HTTP spec for POST requests that create resources — returning 200 would be a spec violation",
      "201 automatically includes a Location header pointing to the new resource — 200 doesn't support this header"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "Status codes communicate semantics beyond success/failure. 201 tells clients and intermediate systems that a new resource exists — API clients can update their local cache, load balancers can adjust routing, and documentation tools can generate accurate examples. 200 is a generic success that doesn't convey what happened. Option C is wrong — 200 isn't a spec violation, just less precise. Option D is wrong — the Location header can technically appear with any status code, though it's most meaningful with 201.",
    "interviewScript": "In your interview, say: 'I use 201 for resource creation because it communicates intent — clients know a new entity exists and can expect an ID in the response. Precise status codes make APIs self-documenting and help clients handle responses appropriately without parsing the body.'",
    "proTip": null
  },
  {
    "id": "q12",
    "subtopic": "GraphQL",
    "tier": "heavy",
    "style": "Scenario-based trade-off",
    "question": "You're designing the API for a platform with a lightweight mobile app (shows event name and date only) and a rich web dashboard (shows event details, venue info, ticket breakdown, and sales analytics). With REST, the team built /events/{id} returning all fields. What specific problem does this cause, and how does GraphQL solve it?",
    "options": [
      "The REST endpoint is too slow because it always joins all tables — GraphQL skips unnecessary joins at the database level automatically",
      "Mobile over-fetches (downloads venue, tickets, analytics data it ignores), wasting bandwidth and battery; GraphQL lets each client specify exactly the fields it needs in a single request",
      "REST can't handle this — you'd need to build two separate backends for mobile and web, while GraphQL consolidates into one",
      "The problem is under-fetching — the dashboard needs to make multiple REST calls; GraphQL doesn't help with over-fetching, only under-fetching"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The core problem is over-fetching: the mobile app downloads large payloads of data it never renders, wasting bandwidth and battery. With GraphQL, the mobile client queries only { event(id: \"123\") { name, date } } while the dashboard queries all fields including nested venue and tickets data. Option A is wrong — GraphQL doesn't automatically optimize database queries (that requires DataLoader patterns). Option D is backwards — GraphQL solves BOTH over-fetching and under-fetching.",
    "interviewScript": "In your interview, say: 'This is the classic over-fetching problem that motivated GraphQL at Facebook. The mobile app wastes bandwidth on fields it ignores. With GraphQL, each client declares exactly what it needs — mobile requests two fields, the dashboard requests everything — and the server returns precisely that shape.'",
    "proTip": null
  },
  {
    "id": "q13",
    "subtopic": "GraphQL",
    "tier": "heavy",
    "style": "Estimation-backed reasoning",
    "question": "You chose GraphQL for your event platform. The schema defines Event with nested Venue and [Ticket] types. Your frontend team loves it — they ship features without backend changes. Six months in, the backend team reports that average query complexity has grown 10x because frontend developers keep adding nested fields. What architectural control did you fail to implement?",
    "options": [
      "Schema stitching — the Event, Venue, and Ticket types should live in separate GraphQL services to isolate complexity",
      "Query depth limiting and query complexity analysis — without server-side controls, clients can request arbitrarily deep and expensive queries",
      "Read replicas — the growing query complexity should be handled by scaling the database horizontally",
      "Response caching at the CDN level — GraphQL responses should be cached like REST responses to handle the load"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "GraphQL's flexibility is a double-edged sword. Without server-side query complexity analysis (assigning cost to each field/relationship) and depth limiting, clients can craft queries that trigger expensive operations. A query requesting events → tickets → buyers → purchase_history → events creates circular, deeply nested resolution. Option D is tricky — GraphQL caching is notoriously harder than REST because all requests go to a single endpoint via POST, making CDN caching nearly impossible without specialized tooling like persisted queries.",
    "interviewScript": "In your interview, say: 'GraphQL needs server-side guardrails — query depth limits and complexity scoring that reject expensive queries before execution. Without these, any client can accidentally or maliciously craft a query that takes down your database. This is a key trade-off versus REST where endpoint-level caching and optimization are more straightforward.'",
    "proTip": "This is why many companies that adopt GraphQL end up implementing persisted queries — a whitelist of approved queries that prevents clients from sending arbitrary graph traversals."
  },
  {
    "id": "q14",
    "subtopic": "GraphQL",
    "tier": "heavy",
    "style": "Anti-pattern / Gotcha",
    "question": "Your GraphQL resolver for Event loads the event from the database. The Venue resolver fetches the venue by event.venueId. The Ticket resolver fetches tickets by event.id. A client queries: { events(first: 50) { name, venue { name }, tickets { price } } }. How many database queries does this naive implementation execute?",
    "options": [
      "3 queries — one for events, one batch for venues, one batch for tickets",
      "52 queries — 1 for events + 50 for venues + 1 batch for tickets",
      "101 queries — 1 for events + 50 individual venue lookups + 50 individual ticket list lookups (classic N+1 problem)",
      "150 queries — each of the 50 events triggers 3 separate resolvers that each query the database independently"
    ],
    "correct": 2,
    "confidence": null,
    "explanation": "This is the N+1 problem. The events query returns 50 events (1 query). Each event's venue resolver fires independently, executing 50 individual queries (N). Each event's tickets resolver also fires independently, executing 50 more queries (another N). Total: 1 + 50 + 50 = 101. The solution is the DataLoader pattern: batch all 50 venue IDs into a single WHERE venue_id IN (...) query, and similarly for tickets, reducing to 3 total queries.",
    "interviewScript": "In your interview, say: 'This is the N+1 problem — 50 events means 101 database queries without batching. I'd implement the DataLoader pattern to batch resolver calls: collect all venue IDs across the 50 events and execute a single WHERE IN query. This drops 101 queries down to 3.'",
    "proTip": "The N+1 problem isn't unique to GraphQL — it happens in REST too. But GraphQL makes it easier to trigger because clients control the query shape and resolvers compose dynamically."
  },
  {
    "id": "q15",
    "subtopic": "GraphQL",
    "tier": "heavy",
    "style": "Gotcha/trap question",
    "question": "Your GraphQL API serves both regular users and venue managers. Regular users should see event name, date, and ticket prices but NOT revenue data. Venue managers should see everything. You implement this by creating two separate schemas. What's wrong with this approach, and what's the GraphQL-native solution?",
    "options": [
      "Nothing is wrong — separate schemas for different user types is the standard GraphQL authorization pattern",
      "Separate schemas cause schema drift and double the maintenance burden; GraphQL natively supports field-level authorization in resolvers, where each field checks the requester's role before returning data",
      "The problem is performance — two schemas means two GraphQL servers; instead use a single schema with query-level (not field-level) authorization",
      "Separate schemas are correct for security but should be implemented using schema stitching to share common types"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "GraphQL's authorization model is fundamentally different from REST. Instead of securing entire endpoints, you secure individual fields. A single schema serves all clients, and each resolver checks whether the requesting user has permission to see that specific field. A venue manager's query returns revenue data; a regular user's query for the same field returns null or throws an authorization error. Maintaining separate schemas doubles your maintenance burden and causes drift as features are added.",
    "interviewScript": "In your interview, say: 'GraphQL handles authorization at the field level, not the schema level. I'd have a single schema where the revenue field's resolver checks the user's role. This is a key architectural difference from REST, where you'd secure entire endpoints.'",
    "proTip": "Field-level authorization is one of GraphQL's superpowers for multi-tenant systems — but it means every resolver must be security-aware, which increases the surface area for auth bugs."
  },
  {
    "id": "q16",
    "subtopic": "Authentication & Authorization",
    "tier": "heavy",
    "style": "Decision framework application",
    "question": "You're building a platform with: (1) a React web app for end users, (2) a mobile app, and (3) third-party developer integrations for event promoters to programmatically create events. What authentication strategy should you use for each, and why?",
    "options": [
      "JWT tokens for all three consumer types — JWTs are stateless, universally applicable, and carry embedded claims that eliminate the need for per-request database lookups, making them the optimal choice for both user sessions and third-party integrations because they scale horizontally without session stores",
      "API keys for all three consumer types — simpler to implement and manage centrally through a single key management service, and API keys can carry embedded permissions just like JWTs through the key's metadata, making them sufficient for both user authentication and third-party authorization",
      "JWT tokens for the web and mobile apps (user sessions with expiry); API keys for third-party developer integrations (long-lived, application-level access)",
      "OAuth2 for web/mobile, API keys for developers, and JWT for service-to-service communication between your own services"
    ],
    "correct": 2,
    "confidence": null,
    "explanation": "Different consumers need different auth mechanisms. User-facing apps (web/mobile) need JWT tokens because they carry user context (user_id, role), support expiry and refresh flows, and are stateless for distributed systems. Third-party developers need API keys because they represent application-level (not user-level) access, are long-lived, and are simple to manage programmatically. Option A fails because JWTs aren't designed for long-lived developer integrations. Option D adds OAuth2 complexity that wasn't asked for.",
    "interviewScript": "In your interview, say: 'I'd use JWT tokens for user-facing apps because they carry user context and support expiry. For third-party developer integrations, I'd use API keys — they're long-lived, application-scoped, and easy to rotate. The key principle is matching the auth mechanism to the consumer type.'",
    "proTip": null
  },
  {
    "id": "q17",
    "subtopic": "Authentication & Authorization",
    "tier": "heavy",
    "style": "Failure analysis",
    "question": "Your system uses API keys for third-party developer authentication. A developer's API key is accidentally committed to a public GitHub repository. By the time you discover this 4 hours later, what's the worst-case scenario, and what design decision would have limited the blast radius?",
    "options": [
      "The worst case is DDoS on your servers; the mitigation is IP allowlisting on API keys so only the developer's servers can use the key",
      "The worst case is unauthorized data access for 4 hours; the mitigation is per-key rate limiting and granular permission scoping so each key only accesses specific resources",
      "The worst case is minimal — API keys are encrypted in transit via HTTPS, so the leaked key can't be used without the SSL certificate",
      "The worst case is a full system compromise; the only mitigation is to never use API keys and use short-lived OAuth tokens instead"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "A leaked API key grants whatever access that key has. The blast radius depends on two design decisions: (1) granular scoping — if the key only permits 'create events' for one venue, the damage is contained; if it's an admin key with full access, everything is exposed. (2) Per-key rate limiting — prevents the attacker from bulk-scraping data in those 4 hours. Option A's IP allowlisting helps but attackers can spoof or the developer might not have static IPs. Option C is wrong — HTTPS protects in-transit; the leaked key IS the secret.",
    "interviewScript": "In your interview, say: 'I'd scope API keys with least-privilege permissions and per-key rate limits. If a key leaks, the damage is bounded to what that specific key can access and how fast. I'd also implement key rotation policies and audit logging to detect anomalous access patterns.'",
    "proTip": null
  },
  {
    "id": "q18",
    "subtopic": "Authentication & Authorization",
    "tier": "heavy",
    "style": "Gotcha/trap question",
    "question": "Your distributed system uses JWT tokens for authentication. The JWT payload contains {user_id, role, exp}. A user is promoted from 'customer' to 'admin' in your database. They make an API request 5 minutes later with their existing JWT. What happens, and what's the architectural trade-off this reveals?",
    "options": [
      "The user is correctly treated as admin because the JWT is verified against the database on each request",
      "The user is still treated as 'customer' until their JWT expires — this is the stateless trade-off; JWTs don't reflect real-time permission changes without a database lookup or short expiry times",
      "The request fails because the JWT signature becomes invalid when the user's role changes in the database",
      "The API gateway automatically detects the role mismatch between the JWT's embedded claims and the database state, and transparently issues a refreshed JWT with the updated 'admin' role before forwarding the request to the downstream service"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "This is the fundamental JWT trade-off. JWTs are stateless — the server verifies the signature and trusts the embedded claims without a database lookup. If the role changes in the database, the JWT still carries the old role until it expires. The mitigation is short expiry times (e.g., 15 minutes) with refresh tokens, or maintaining a token blocklist for critical permission changes. Option A describes session-based auth, not JWT. Option C is wrong — the signature validates the JWT's contents, not the database state.",
    "interviewScript": "In your interview, say: 'This is the core stateless trade-off with JWTs. The token carries its own claims and isn't checked against the database on every request. For critical permission changes, I'd either use short expiry windows with refresh tokens, or maintain a small blocklist of revoked tokens — accepting a slight trade-off on the stateless benefit.'",
    "proTip": "When an interviewer asks about JWT trade-offs, they want to hear 'stale claims.' Candidates who immediately mention this signal they've operated JWT-based systems in production."
  },
  {
    "id": "q19",
    "subtopic": "Authentication & Authorization",
    "tier": "heavy",
    "style": "Scenario-based trade-off",
    "question": "You're designing RBAC for a multi-tenant SaaS platform. Tenant A has roles: admin, editor, viewer. Tenant B wants: admin, editor, viewer, AND a custom 'billing-admin' role that can manage invoices but not content. How should you model this?",
    "options": [
      "Add 'billing-admin' as a global role available to all tenants — it's simpler and future tenants might need it too",
      "Use permission-based access control instead of roles — define atomic permissions (manage_billing, edit_content, view_content) and let each tenant compose custom roles from these permissions",
      "Create separate role tables per tenant to allow fully custom role definitions without affecting other tenants",
      "Deny the request — RBAC means predefined roles, and custom roles should be handled at the application layer through feature flags"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Pure role-based systems break when tenants need customization. The scalable pattern is to define atomic permissions (manage_billing, edit_content, view_reports, etc.) and let roles be named collections of permissions. Tenant A's 'editor' maps to [edit_content, view_content]. Tenant B's 'billing-admin' maps to [manage_billing, view_content]. New requirements become new permission compositions, not new system-wide roles. Option A pollutes the global namespace. Option C doesn't scale to thousands of tenants.",
    "interviewScript": "In your interview, say: 'I'd use permission-based access control under the hood, with roles as convenience groupings. Atomic permissions like manage_billing and edit_content are composable — any tenant can create custom roles by combining permissions. The authorization check is always at the permission level, not the role level.'",
    "proTip": null
  },
  {
    "id": "q20",
    "subtopic": "RPC / gRPC",
    "tier": "medium",
    "style": "Implementation-specific nuance",
    "question": "Your team uses gRPC with Protocol Buffers for internal service communication. A developer adds a new required field 'priority' to the CreateBookingRequest message. After deploying the updated booking service, the API gateway (not yet updated) starts failing on all booking requests. What went wrong?",
    "options": [
      "Protocol Buffers don't support adding new fields — the proto file must be recreated from scratch",
      "Adding a required field is a breaking change in protobuf — the old client sends messages without the field, which fails validation; new fields should always be optional with sensible defaults",
      "The gRPC service needed to be restarted after the proto change — the schema is compiled at startup",
      "The API gateway needs to regenerate its client stubs before the booking service deploys — this is a deployment ordering issue, not a schema issue"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "In Protocol Buffers (especially proto3), adding required fields is a breaking change for backward compatibility. The old API gateway doesn't know about the new field and sends messages without it. The booking service rejects these because the field is required. The correct approach is to make new fields optional with default values, ensuring old clients continue working. Option D describes a real concern (stub regeneration) but the core issue is the required field breaking backward compatibility.",
    "interviewScript": "In your interview, say: 'Proto evolution has strict rules — never add required fields to existing messages. New fields should be optional with defaults to maintain backward compatibility. This is a key advantage of protobuf: schema evolution without breaking existing clients, but only if you follow the rules.'",
    "proTip": "Proto3 actually removed the 'required' keyword entirely for this exact reason. All fields are implicitly optional with zero-value defaults."
  },
  {
    "id": "q21",
    "subtopic": "RPC / gRPC",
    "tier": "medium",
    "style": "Scenario-based trade-off",
    "question": "You're designing a ride-sharing platform with a microservices architecture. The ride-matching service calls the pricing service ~10,000 times per second with sub-10ms latency requirements. The team debates between REST (JSON over HTTP/1.1) and gRPC (protobuf over HTTP/2). Why does gRPC win here?",
    "options": [
      "gRPC is faster only because Protocol Buffers are compressed — using gzip with REST would achieve the same performance",
      "gRPC wins on three fronts: binary serialization is 5-10x smaller than JSON, HTTP/2 multiplexes requests over a single connection avoiding TCP overhead, and generated client code eliminates serialization bugs",
      "gRPC is only marginally faster than REST in practice — the real advantage is that gRPC supports bidirectional streaming, which REST doesn't support natively, and streaming is essential for the ride-matching service to continuously receive updated driver locations while simultaneously sending price recalculations",
      "gRPC wins because it bypasses the network stack entirely when services are co-located on the same machine through Unix domain sockets, eliminating TCP/IP overhead — this is the primary performance advantage, and it only applies when services are deployed on the same host, which is common in sidecar-based service mesh architectures"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "At 10K requests/second with sub-10ms latency, every millisecond counts. gRPC's advantages compound: protobuf binary encoding is 5-10x smaller than JSON (less bandwidth, faster parsing), HTTP/2 multiplexing avoids the overhead of establishing new TCP connections for each request (critical at this volume), and generated type-safe clients prevent serialization mismatches that would cause runtime errors. Option A ignores HTTP/2 multiplexing and type safety. Option D is wrong — gRPC always uses the network stack.",
    "interviewScript": "In your interview, say: 'For internal service calls at this volume and latency budget, gRPC is the clear choice. Binary serialization reduces payload size, HTTP/2 multiplexing eliminates per-request connection overhead, and generated clients provide compile-time type safety across our polyglot services.'",
    "proTip": null
  },
  {
    "id": "q22",
    "subtopic": "RPC / gRPC",
    "tier": "medium",
    "style": "Decision framework application",
    "question": "Your e-commerce platform has a public REST API consumed by mobile/web clients and internal gRPC services. Product requirements now include real-time order tracking visible to customers. The backend order-tracking service uses gRPC. How should you expose this to mobile clients?",
    "options": [
      "Expose the gRPC service directly to mobile clients — gRPC supports mobile clients natively",
      "Keep the public API as REST but add a WebSocket endpoint for real-time tracking; the API gateway translates between the WebSocket and internal gRPC streams",
      "Convert the internal order-tracking service from gRPC to REST so all services use the same protocol",
      "Use GraphQL subscriptions — they're designed for exactly this real-time use case and replace both REST and gRPC"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The architecture pattern is: REST/WebSocket for public-facing, gRPC for internal. Mobile clients expect HTTP-based protocols with broad compatibility. The API gateway bridges the gap — it accepts WebSocket connections from mobile clients for real-time updates and internally communicates with the order-tracking service via gRPC. Option A has issues — while gRPC-web exists, browser support is limited and requires a proxy anyway. Option C throws away gRPC's performance benefits for internal communication.",
    "interviewScript": "In your interview, say: 'I'd add a WebSocket endpoint on the API gateway for real-time tracking. Internally, the gateway translates to gRPC calls. This keeps our public API in REST/WebSocket (what clients expect) and our internal services in gRPC (optimized for performance). The API gateway is the translation layer.'",
    "proTip": null
  },
  {
    "id": "q23",
    "subtopic": "Pagination",
    "tier": "medium",
    "style": "Failure analysis",
    "question": "Your events API uses offset-based pagination: /events?offset=20&limit=10. During a flash sale, 15 new events are created while a user is paginating through results. The user is currently on page 3 (offset=20). What specific data anomaly will the user experience on page 4?",
    "options": [
      "Page 4 will be empty because the total count has changed and the offset now exceeds the available results",
      "The user will see 15 duplicate events they already saw on earlier pages, because the 15 new events shifted previous results forward by 15 positions",
      "Page 4 will show completely random events because the database reindexed during the concurrent writes",
      "No anomaly — offset pagination handles concurrent inserts gracefully because the database maintains a stable sort order"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "This is the core weakness of offset-based pagination. When new records are inserted before the user's current position, the existing records shift forward. Records that were at positions 21-30 are now at positions 36-45. The user's next request (offset=30) fetches what used to be positions 16-25 — items they already saw on page 2 or 3. The exact number of duplicates depends on where the new events sort relative to the user's position, but up to 15 duplicates are possible.",
    "interviewScript": "In your interview, say: 'Offset pagination breaks under concurrent writes because inserts shift records. The user sees duplicates as their offset no longer points to the right position. Cursor-based pagination solves this — instead of counting from the start, each page uses a pointer to the last seen record, which is stable regardless of inserts.'",
    "proTip": null
  },
  {
    "id": "q24",
    "subtopic": "Pagination",
    "tier": "medium",
    "style": "Gotcha/trap question",
    "question": "Your product manager asks for cursor-based pagination on the events API. The team implements it using the event's auto-incrementing database ID as the cursor. It works great for chronological feeds. Then the PM asks to add sorting by popularity (most popular first). What breaks?",
    "options": [
      "Nothing breaks — the cursor still works because auto-incrementing IDs are unique regardless of sort order",
      "The cursor is tied to insertion order (auto-increment ID), not popularity order — cursoring by ID while sorting by popularity causes events to appear in wrong positions or be skipped entirely",
      "Popularity-based sorting is simply incompatible with cursor pagination — you must switch to offset pagination for non-chronological sorts",
      "The database can't sort by popularity and filter by cursor ID efficiently, causing full table scans"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Cursor-based pagination requires the cursor to be based on the SAME field(s) as the sort order. If you sort by popularity but cursor by auto-increment ID, the cursor says 'give me events after ID 50' while the sort says 'order by popularity descending.' These conflict — an event with ID 51 might have lower popularity than ID 30. The fix is to use a composite cursor encoding the sort field(s): encode (popularity_score, id) as the cursor so pagination and sorting align.",
    "interviewScript": "In your interview, say: 'The cursor must match the sort order. For popularity sorting, I'd use a composite cursor encoding the popularity score and ID together. The ID breaks ties when multiple events have the same popularity. This is a common gotcha — simple ID-based cursors only work for chronological ordering.'",
    "proTip": "This is why many APIs encode cursors as opaque base64 strings — it gives you flexibility to change the underlying cursor fields without breaking clients."
  },
  {
    "id": "q25",
    "subtopic": "API Type Selection",
    "tier": "medium",
    "style": "Scenario-based trade-off",
    "question": "You're in a system design interview for a content management platform. The interviewer describes: a web editor (needs full article content with revision history), a mobile reader app (needs just titles and thumbnails), and an admin dashboard (needs usage analytics per article). The interviewer says 'Tell me about your API design.' What's your strongest opening move?",
    "options": [
      "Start with GraphQL immediately — the diverse client needs clearly indicate an over-fetching problem that GraphQL solves",
      "Start with REST as your default, then proactively identify that the diverse client data needs suggest GraphQL might be worth the complexity trade-off, and ask the interviewer if that's a direction they want to explore",
      "Design three separate REST APIs, one optimized for each client — this avoids the complexity of GraphQL entirely",
      "Propose REST with field selection parameters (/articles?fields=title,thumbnail) to get GraphQL-like flexibility without the complexity"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The interview-optimal move is: default to REST (showing you don't over-engineer), identify the specific problem (diverse clients with different data needs), mention GraphQL as a potential solution while acknowledging the trade-off (added complexity), and check with the interviewer. This demonstrates both technical depth AND interview awareness. Option A jumps to GraphQL without showing your reasoning process. Option D is pragmatic but doesn't demonstrate you know when GraphQL is appropriate.",
    "interviewScript": "In your interview, say: 'I'd start with REST as my default, but I notice the clients have very different data needs — mobile wants minimal fields while the editor needs full content. This is the over-fetching problem GraphQL was designed for. Would you like me to explore a GraphQL approach, or should I keep it simple with REST?'",
    "proTip": "Interviewers love when you show your reasoning AND give them a choice. It demonstrates you can identify trade-offs AND that you collaborate rather than dictate."
  },
  {
    "id": "q26",
    "subtopic": "API Type Selection",
    "tier": "medium",
    "style": "Multi-hop reasoning",
    "question": "Your system has public REST APIs for web/mobile, internal gRPC for microservices, and you're evaluating whether to add GraphQL. A teammate argues: 'GraphQL gives us one query language for everything — we should replace both REST and gRPC.' What's the critical flaw in this argument?",
    "options": [
      "GraphQL can't handle mutations — it's read-only, so you'd still need REST for write operations",
      "GraphQL's single POST endpoint and dynamic queries make HTTP caching nearly impossible, and it can't match gRPC's binary serialization performance for high-throughput internal services",
      "GraphQL doesn't support authentication — you'd lose the JWT and API key patterns already implemented in REST",
      "GraphQL schemas are too rigid — adding new fields requires schema changes, unlike REST where you can add fields to JSON freely"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Two critical flaws: (1) GraphQL uses POST for everything to a single endpoint, which defeats HTTP caching (CDNs, browsers, proxies all cache GET requests by URL — impossible with GraphQL's model). (2) For internal high-throughput services, GraphQL's text-based queries and JSON responses can't compete with gRPC's binary protobuf serialization and HTTP/2 multiplexing. GraphQL occupies a valuable middle ground (flexible client-driven queries) but doesn't replace REST's cacheability or gRPC's raw performance.",
    "interviewScript": "In your interview, say: 'GraphQL doesn't replace REST or gRPC — each protocol has a sweet spot. REST is great for cacheable public APIs. gRPC excels at high-throughput internal services. GraphQL shines when diverse clients need flexible data fetching. The right architecture often uses all three.'",
    "proTip": null
  },
  {
    "id": "q27",
    "subtopic": "Rate Limiting",
    "tier": "medium",
    "style": "Scenario-based trade-off",
    "question": "Your Ticketmaster-like platform has a concert that goes on sale at 10:00 AM. You expect 500,000 users hitting the booking endpoint simultaneously. Your standard rate limit is 100 requests/minute per user. What's the problem with applying the same rate limit to the booking endpoint during the sale, and what's a better approach?",
    "options": [
      "100 requests/minute is too generous — reduce it to 10 requests/minute for the booking endpoint to protect the system from overload",
      "The booking endpoint needs a LOWER per-user limit (e.g., 10 attempts/minute) to prevent scalping bots, PLUS a separate system-wide limit with a queue to handle the thundering herd of legitimate users",
      "Rate limiting should be disabled during high-demand events to ensure legitimate users can complete purchases",
      "The standard limit is fine — 100 requests/minute per user will naturally throttle the load since most users won't exceed this"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Two distinct problems require two distinct rate limits: (1) Per-user: 10 booking attempts/minute prevents scalping bots that would otherwise programmatically grab all tickets. (2) System-wide: a queue or admission control mechanism prevents the thundering herd from overwhelming your database. Even with 100 legitimate users each making 1 request, 500K simultaneous requests will crush your backend. You need both per-user anti-abuse limits AND system-level admission control.",
    "interviewScript": "In your interview, say: 'I'd apply endpoint-specific rate limits — a low per-user limit on bookings to prevent scalping, plus a system-wide queue for the thundering herd problem. Different endpoints face different threats, so uniform rate limits don't work.'",
    "proTip": null
  },
  {
    "id": "q28",
    "subtopic": "Rate Limiting",
    "tier": "medium",
    "style": "Anti-pattern identification",
    "question": "A candidate proposes rate limiting solely by IP address: '100 requests per IP per minute should prevent abuse.' The interviewer asks about potential issues. What's the most dangerous flaw in this approach?",
    "options": [
      "IP-based limiting blocks legitimate users behind corporate NATs or shared proxies — thousands of employees behind one IP get collectively throttled, while attackers with botnets have thousands of unique IPs",
      "IP addresses can be trivially spoofed in TCP connections, making IP-based rate limiting completely ineffective against any attacker with basic networking knowledge — since the attacker can forge the source IP in the TCP SYN packet, your rate limiter counts the requests against the wrong IP and the attacker bypasses all limits",
      "IP-based limiting doesn't work with IPv6 because the address space is too large (2^128 addresses) to track in memory — each unique IPv6 address would require a separate rate limit counter, and the memory overhead of maintaining counters for the potential address space makes this approach computationally infeasible",
      "The flaw is that 100 requests per minute is too generous for any abuse prevention scenario — the limit should be 10 requests per minute per IP to effectively throttle automated scripts, because legitimate users rarely make more than 5-10 requests per minute through normal browsing behavior"
    ],
    "correct": 0,
    "confidence": null,
    "explanation": "IP-based rate limiting has an asymmetric failure mode: it's too restrictive for legitimate users (thousands of corporate users share one IP behind NAT/VPN) and too permissive for attackers (botnets distribute across thousands of IPs). A corporate office hitting your API looks like one hyper-active user, while a botnet with 10,000 IPs gets 1,000,000 requests/minute. The better approach combines authenticated user-based limits with IP-based limits as a fallback for unauthenticated requests.",
    "interviewScript": "In your interview, say: 'Pure IP-based limiting fails both ways: it over-blocks legitimate users behind NAT and under-blocks distributed botnets. I'd use authenticated user-based limits as the primary mechanism, with IP limits only as a fallback for unauthenticated traffic.'",
    "proTip": null
  },
  {
    "id": "q29",
    "subtopic": "Versioning Strategies",
    "tier": "thin",
    "style": "Decision framework application",
    "question": "You're adding a breaking change to your public REST API: the /events response changes from returning a flat 'location' string to a nested {city, state, zip} object. You need to support existing mobile apps that haven't updated yet. The team debates URL versioning (/v1/events vs /v2/events) versus header versioning (Accept-Version: v2). What's the strongest argument for URL versioning in this scenario?",
    "options": [
      "URL versioning is more performant because the server can route to different code paths at the load balancer level without parsing headers",
      "URL versioning makes the version explicitly visible in every API call, documentation, and debug log — there's zero ambiguity about which version a client is using, which is critical when debugging 'why did my app break?' reports from mobile developers",
      "Header versioning doesn't work with CDN caching because CDN edge servers don't inspect custom request headers like Accept-Version when computing cache keys, while URL versioning (/v1/events vs /v2/events) creates naturally distinct cache entries that CDN infrastructure handles natively",
      "URL versioning is the only approach that allows running both v1 and v2 simultaneously in production — header versioning requires a single server to handle both versions through conditional logic, which means you can't independently deploy, scale, or roll back individual API versions"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "The decisive advantage of URL versioning is explicitness. When a mobile developer reports a bug, you can immediately see they're hitting /v1/events vs /v2/events in logs, documentation, and curl commands. Header versioning hides the version in request metadata that's easy to miss or forget. Option C has some truth (CDN Vary headers can handle header versioning, but it's more complex). Option D is wrong — both approaches can run simultaneously. The interview-relevant insight is: simplicity and debuggability trump theoretical purity.",
    "interviewScript": "In your interview, say: 'I'd use URL versioning — /v1/events and /v2/events. It's explicit in every log, doc, and debug session. Header versioning is technically cleaner but adds cognitive overhead. For a public API where third-party developers need clarity, explicitness wins.'",
    "proTip": null
  },
  {
    "id": "q30",
    "subtopic": "Interview Strategy / Time Management",
    "tier": "thin",
    "style": "Interviewer pushback",
    "question": "You're 8 minutes into a 45-minute system design interview and still refining your API endpoints — debating between cursor and offset pagination, considering HATEOAS links, and thinking about error response formats. Your interviewer says 'Let's move on to the high-level architecture.' What does this signal, and what's the best response?",
    "options": [
      "Push back politely — a well-designed API is the foundation of the system, and skipping details will hurt your score in later sections",
      "Agree to move on but note that you should probably return to API design later when discussing specific service interactions",
      "This signals you've over-invested in API design — acknowledge it, quickly finalize your API with the essentials (resources, methods, key parameters), and move to architecture where there's more signal for the interviewer",
      "Ask the interviewer whether this is a frontend-focused or backend-focused interview to calibrate how much API detail they want"
    ],
    "correct": 2,
    "confidence": null,
    "explanation": "The content explicitly warns: 'candidates mess up more often by spending too much time on API design than by underinvesting. Do your best to not spend more than 5 minutes outlining your APIs.' At 8 minutes, you've exceeded the budget. The interviewer is redirecting you to where they can evaluate your system design skills. HATEOAS and pagination details are important in production but low-signal in interviews compared to data modeling, scaling, and trade-offs. Quickly wrap up and move on.",
    "interviewScript": "In your interview, say: 'Good call — let me quickly finalize the API with the core endpoints and move to the architecture. For pagination, I'll use cursor-based, and we can revisit specific API details if they become relevant during the deep dive.'",
    "proTip": "An experienced interviewer redirecting you is not criticism — it's coaching. They want you to succeed and are steering you toward where you can demonstrate the most value."
  },
  {
    "id": "q31",
    "subtopic": "Real-time + API Selection",
    "tier": "thin",
    "style": "Cluster: cross-concept",
    "question": "Your system design interview asks you to build a collaborative document editor (like Google Docs). The interviewer says: 'Walk me through your API choices.' You need CRUD operations for documents AND real-time collaborative editing. What combination of protocols gives the strongest interview answer?",
    "options": [
      "Use REST for everything — REST supports real-time through long polling, which is sufficient for collaborative editing",
      "Use GraphQL subscriptions for both CRUD and real-time — a single protocol simplifies the architecture",
      "Use REST for CRUD operations (create/read/update/delete documents) and WebSockets for real-time collaborative editing — each protocol handles what it's designed for",
      "Use gRPC bidirectional streaming for everything — it handles both CRUD and real-time with superior performance"
    ],
    "correct": 2,
    "confidence": null,
    "explanation": "Different communication patterns need different protocols. REST handles CRUD cleanly (create document, fetch document list, update metadata, delete). WebSockets provide the persistent, bidirectional connection needed for real-time character-by-character collaboration. Long polling (Option A) adds latency and server load unsuitable for real-time typing. gRPC (Option D) is great for internal services but not for browser clients. Mentioning that REST and WebSockets complement each other shows protocol awareness.",
    "interviewScript": "In your interview, say: 'I'd use REST for standard CRUD on documents — creating, listing, deleting. For real-time collaboration, I'd add a WebSocket connection that streams operational transforms between editors. REST and WebSockets complement each other: REST for request-response, WebSockets for persistent bidirectional communication.'",
    "proTip": null
  },
  {
    "id": "q32",
    "subtopic": "GraphQL × Caching",
    "tier": "bridge",
    "style": "Cross-subtopic bridge",
    "question": "You chose GraphQL for your platform's public API. Your infrastructure team reports that the CDN cache hit rate dropped from 85% (with the old REST API) to 3% after the migration. Why did this happen, and what's the mitigation?",
    "options": [
      "GraphQL responses are significantly larger than REST responses because the response includes the full query structure alongside the data, exceeding the CDN's per-object cache size limits and causing cache eviction of GraphQL responses before they can serve subsequent requests",
      "GraphQL sends all requests as POST to a single endpoint (/graphql), making URL-based CDN caching impossible; the mitigation is persisted queries (pre-registered queries with unique IDs) that can be sent as GET requests with cache-friendly URLs",
      "The CDN can't parse GraphQL's response format because GraphQL returns data in a nested JSON structure with a 'data' envelope and optional 'errors' array that doesn't match the flat JSON structure CDNs are optimized to cache and compress",
      "This drop is expected and by design — GraphQL is specifically intended for dynamic, user-specific data that shouldn't be cached at the edge, so the correct response is to remove the CDN from the GraphQL request path entirely and route all traffic directly to the origin GraphQL server"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "CDNs cache based on URL + HTTP method. REST's GET /events/123 has a unique, cacheable URL. GraphQL sends POST requests to a single /graphql endpoint with the query in the body — every request looks identical to the CDN. Persisted queries solve this: you register queries ahead of time (e.g., query #1234 = the events query), then clients send GET /graphql?id=1234&variables={...}, which CDNs can cache by URL. This is also why companies like Shopify and GitHub use persisted queries in production.",
    "interviewScript": "In your interview, say: 'GraphQL kills CDN caching because all requests are POST to one endpoint. The fix is persisted queries — pre-register query templates and send them as GET with a query ID. This restores URL-based caching while keeping GraphQL flexibility.'",
    "proTip": "This caching problem is one of the top reasons companies that adopt GraphQL don't replace REST entirely — they use GraphQL where flexibility matters and keep REST where caching matters."
  },
  {
    "id": "q33",
    "subtopic": "REST × RPC bridge",
    "tier": "bridge",
    "style": "Cross-subtopic bridge",
    "question": "You're presenting your Ticketmaster system design. You've defined public REST APIs for clients and mention that internal services communicate via gRPC. The interviewer asks: 'Your booking flow goes: Mobile App → API Gateway → Booking Service → Payment Service → Inventory Service. Why not use REST everywhere?' What's your strongest answer?",
    "options": [
      "gRPC forces type safety — with REST, a developer could accidentally send a string where a number is expected, causing runtime crashes in the payment service",
      "REST would work perfectly fine for internal service communication at this scale — the gRPC choice is premature optimization for most systems because the serialization overhead difference between JSON and protobuf is only a few milliseconds per request, which is negligible compared to network latency and database query time",
      "Internal services communicate at high frequency with strict latency budgets; gRPC's binary serialization, HTTP/2 multiplexing, and generated type-safe clients reduce per-call overhead significantly compared to JSON-over-HTTP/1.1, while REST remains better for public APIs due to cacheability and tooling",
      "gRPC is technically required for inter-service communication in a microservices architecture because REST doesn't support service discovery, health checking, or load balancing between service instances — these capabilities are built into the gRPC framework through its integration with service mesh infrastructure like Envoy and Istio"
    ],
    "correct": 2,
    "confidence": null,
    "explanation": "The strongest answer addresses both sides: why gRPC for internal (performance, type safety, multiplexing) AND why REST for external (caching, browser compatibility, developer familiarity). The booking flow involves multiple service hops — each hop with gRPC saves milliseconds of serialization/deserialization overhead that compounds across the chain. But public APIs need REST's ecosystem: CDN caching, browser fetch(), curl debugging, and familiar HTTP semantics for third-party developers.",
    "interviewScript": "In your interview, say: 'Internal services communicate frequently with tight latency budgets — gRPC's binary serialization and HTTP/2 multiplexing reduce per-hop overhead that compounds across the booking → payment → inventory chain. Public APIs stay REST for cacheability, browser compatibility, and developer familiarity. Each protocol plays to its strengths.'",
    "proTip": null
  },
  {
    "id": "q34",
    "subtopic": "Pagination × GraphQL",
    "tier": "bridge",
    "style": "Cross-subtopic bridge",
    "question": "You're using GraphQL with cursor-based pagination. Your schema uses the Relay Connection spec: events(first: 10, after: \"cursor\") returns { edges { node { ... }, cursor }, pageInfo { hasNextPage, endCursor } }. A product manager asks for a 'Jump to page 5' feature. What's your response?",
    "options": [
      "Add an 'offset' argument alongside 'after' to the connection field — the Relay Connection spec supports combining cursor and offset pagination modes, allowing clients to use cursor-based pagination for sequential browsing and offset-based jumps for direct page access within the same query",
      "Cursor-based pagination fundamentally doesn't support random page access because the cursor for page 5 is only known after loading pages 1-4; propose a 'Jump to letter' or 'Jump to date range' alternative that maps to a cursor naturally",
      "Implement it client-side by caching all previously loaded cursors in local storage and using the cursor corresponding to the start of page 5 when the user clicks 'Jump to page 5' — this avoids schema changes and works within the existing Relay Connection spec",
      "Switch the entire GraphQL schema from cursor pagination to offset pagination to support this product requirement — offset pagination natively supports random page access through simple arithmetic (page 5 = offset 40 with limit 10), and the consistency trade-offs of offset pagination are acceptable for most content browsing use cases"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "This exposes the key limitation of cursor-based pagination: you can't jump to arbitrary pages because each cursor is derived from the previous page's last item. To get the cursor for page 5, you'd need to load pages 1-4 first. The pragmatic solution is to reframe the UX: instead of arbitrary page jumps, offer 'jump to date range' or 'jump to first letter' which can be converted into WHERE clauses that produce valid cursors. Option C fails because you can't cache cursors for pages you haven't loaded. Option D throws away the benefits of cursor pagination.",
    "interviewScript": "In your interview, say: 'Cursor pagination doesn't support arbitrary page jumps — that's the trade-off for its consistency guarantees. I'd work with the PM to reframe as 'jump to date' or 'jump to category,' which maps naturally to cursor-compatible queries. If random page access is truly required, we'd need offset pagination with its consistency trade-offs.'",
    "proTip": null
  },
  {
    "id": "q35",
    "subtopic": "Auth × Rate Limiting",
    "tier": "bridge",
    "style": "Cross-subtopic bridge",
    "question": "Your API uses JWT-based authentication and per-user rate limiting (1000 requests/hour). An attacker obtains a valid JWT (e.g., from a compromised device) and hammers your API at 999 requests/hour — just below the rate limit. The JWT doesn't expire for another 2 hours. What layered defense is this architecture missing?",
    "options": [
      "The rate limit is set too high — reduce it to 100 requests per hour so that abuse patterns are detected sooner, since legitimate users rarely make more than 50 requests per hour and a lower threshold provides earlier detection of compromised tokens",
      "JWT revocation capability — without a token blocklist or short expiry with refresh tokens, you can't invalidate the compromised JWT, and behavioral anomaly detection on top of static rate limits to catch usage patterns that are technically within limits but anomalous",
      "IP-based blocking should be the immediate response — block the attacker's IP address at the network edge as soon as the compromised token is detected, which instantly cuts off access without requiring any changes to the JWT infrastructure or rate limiting configuration",
      "Switch entirely from JWT to server-side session-based authentication — server-side sessions stored in Redis can be invalidated immediately by deleting the session record, which eliminates the revocation problem entirely and provides real-time control over active sessions at the cost of requiring a centralized session store"
    ],
    "correct": 1,
    "confidence": null,
    "explanation": "Two gaps compound: (1) JWTs are stateless, so you can't revoke a compromised token without a blocklist or very short expiry. The attacker can use it freely for 2 hours. (2) Static rate limits don't catch sophisticated abuse — 999 req/hour looks normal. You need behavioral anomaly detection (unusual access patterns, geographic anomalies, accessing resources the user never accessed before). Option D works but throws away JWT's scalability benefits. The layered approach is: short JWT expiry + refresh tokens + token blocklist + behavioral detection.",
    "interviewScript": "In your interview, say: 'This reveals two gaps: JWTs can't be revoked without a blocklist, and static rate limits miss sophisticated abuse. I'd implement short-lived JWTs with refresh tokens, a revocation list for compromised tokens, and behavioral anomaly detection that flags unusual patterns even within rate limits.'",
    "proTip": "This is why most production systems use 15-minute JWT expiry with refresh tokens — it limits the window of exposure for any compromised token."
  }
];

export default {
  questions: QUESTIONS
};
