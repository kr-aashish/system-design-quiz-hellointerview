// === COVERAGE MANIFEST ===
// Subtopic: Blob Storage Fundamentals — Questions: 2 — IDs: [q1, q2]
//   └─ Nested: Why not databases — covered by: [q1]
//   └─ Nested: 11 nines durability / sizing threshold — covered by: [q2]
// Subtopic: Server Proxy Bottleneck — Questions: 2 — IDs: [q3, q4]
//   └─ Nested: Latency & cost of proxying — covered by: [q3]
//   └─ Nested: When proxy is still needed — covered by: [q4]
// Subtopic: Presigned URLs (Upload) — Questions: 3 — IDs: [q5, q6, q7]
//   └─ Nested: Signature generation (no network call) — covered by: [q5]
//   └─ Nested: URL conditions (content-length-range, content-type) — covered by: [q6]
//   └─ Nested: Gotcha: anyone with URL can use it — covered by: [q7]
// Subtopic: Presigned URLs (Download) & CDN Signatures — Questions: 3 — IDs: [q8, q9, q10]
//   └─ Nested: Blob storage vs CDN delivery — covered by: [q8]
//   └─ Nested: Symmetric vs asymmetric key validation — covered by: [q9]
//   └─ Nested: CloudFront signed URLs vs cookies — covered by: [q10]
// Subtopic: Resumable / Chunked Uploads — Questions: 3 — IDs: [q11, q12, q13]
//   └─ Nested: Multipart vs resumable session URL — covered by: [q11]
//   └─ Nested: Resume from failure (ListParts) — covered by: [q12]
//   └─ Nested: Chunk size constraints per provider — covered by: [q13]
// Subtopic: Upload Completion & Assembly — Questions: 2 — IDs: [q14, q15]
//   └─ Nested: Completion endpoint with checksums — covered by: [q14]
//   └─ Nested: Lifecycle rules for incomplete uploads — covered by: [q15]
// Subtopic: State Synchronization — Questions: 3 — IDs: [q16, q17, q18]
//   └─ Nested: Metadata DB + blob storage dual state — covered by: [q16]
//   └─ Nested: Race conditions with client trust — covered by: [q17]
//   └─ Nested: Orphaned files — covered by: [q18]
// Subtopic: Event Notifications & Reconciliation — Questions: 3 — IDs: [q19, q20, q21]
//   └─ Nested: S3 events to SNS/SQS — covered by: [q19]
//   └─ Nested: Reconciliation jobs for pending files — covered by: [q20]
//   └─ Nested: Events can fail too — covered by: [q21]
// Subtopic: Abuse Prevention — Questions: 2 — IDs: [q22, q23]
//   └─ Nested: Quarantine bucket pattern — covered by: [q22]
//   └─ Nested: File size limits in presigned URL conditions — covered by: [q23]
// Subtopic: Metadata Handling — Questions: 2 — IDs: [q24, q25]
//   └─ Nested: Storage key as connection point — covered by: [q24]
//   └─ Nested: Why not S3 object tags for metadata — covered by: [q25]
// Subtopic: Download Optimization — Questions: 3 — IDs: [q26, q27, q28]
//   └─ Nested: Range requests for resumable downloads — covered by: [q26]
//   └─ Nested: Parallel chunk downloads — covered by: [q27]
//   └─ Nested: CDN cache + edge latency — covered by: [q28]
// Subtopic: Cloud Provider Terminology — Questions: 2 — IDs: [q29, q30]
// Subtopic: When to Use / When NOT to Use — Questions: 2 — IDs: [q31, q32]
// Cross-subtopic: Presigned URLs × State Sync — Questions: 1 — IDs: [q17]
// Cross-subtopic: Chunked Uploads × Event Notifications — Questions: 1 — IDs: [q33]
// Cross-subtopic: CDN Signatures × Abuse Prevention — Questions: 1 — IDs: [q34]
// Anti-pattern questions: 4 — IDs: [q4, q17, q25, q31]
// Gotcha/trap questions: 4 — IDs: [q5, q7, q15, q18]
// Total: 34 questions across 12 subtopics
// ========================

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuizProgress } from './useQuizProgress';
import {
  Clock,
  ChevronRight,
  Flag,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Trophy,
  Target,
  Shuffle,
  List,
  Play,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";

const QUESTIONS = [
  // q1 — Blob Storage Fundamentals
  {
    id: "q1",
    subtopic: "Blob Storage Fundamentals",
    question:
      "You're designing a photo storage service where users upload 20-50MB RAW images. A junior engineer suggests storing the images as BLOBs in PostgreSQL since 'it simplifies the architecture to one data store.' What is the most critical technical problem with this approach at scale?",
    options: [
      "PostgreSQL BLOB storage will degrade query performance on the entire database because large binary objects bloat table sizes, increase WAL write amplification, and make VACUUM operations dramatically slower — affecting all queries, not just image-related ones.",
      "PostgreSQL cannot store files larger than 1GB per row, so you'd need to implement application-level chunking that defeats the simplicity argument.",
      "PostgreSQL replication lag will increase linearly with image count, eventually causing read replicas to fall so far behind that they become unusable for serving read traffic.",
      "PostgreSQL doesn't support content-type headers on stored data, making it impossible to serve images with correct MIME types without an additional metadata table.",
    ],
    correctIndex: 0,
    explanation:
      "Storing large BLOBs in PostgreSQL kills performance across the entire database — not just for image queries. Large objects bloat table sizes, increase backup times, slow replication, and make VACUUM operations (critical for PostgreSQL health) dramatically slower. The 11 nines durability of object stores like S3 combined with unlimited capacity and per-object pricing makes them purpose-built for this. Option B is misleading — PostgreSQL's large object facility can handle files over 1GB. Option C overstates the replication impact mechanism. Option D is wrong because MIME types are application-layer concerns.",
    interviewScript:
      "In your interview, say: 'Storing large binaries in a relational database creates cross-cutting performance degradation. Table bloat from BLOBs affects VACUUM, WAL writes, and backup times for the entire database — not just image operations. Object stores like S3 are purpose-built for this: they offer 11 nines durability, scale independently from compute, and use per-object pricing.'",
    proTip:
      "The 10MB rule of thumb is a great heuristic to cite in interviews: if it's over 10MB and doesn't need SQL queries, it belongs in blob storage.",
  },
  // q2 — Blob Storage Fundamentals
  {
    id: "q2",
    subtopic: "Blob Storage Fundamentals",
    question:
      "Your system stores user documents averaging 500KB each. The team debates whether to use S3 or keep them in the application database. Given the file sizes, which consideration should MOST influence this architectural decision?",
    options: [
      "At 500KB, the overhead of presigned URL generation and the two-step upload dance adds more latency than directly proxying through the API — keep them in the database for simplicity.",
      "While 500KB files can be proxied through API servers without major bottlenecks, the decision should hinge on query patterns: if you never need to JOIN document contents with other data, blob storage still offers better cost efficiency and operational simplicity at scale.",
      "S3 is always the correct choice regardless of file size because relational databases are fundamentally incompatible with binary data storage.",
      "500KB files should be stored as base64-encoded strings in a TEXT column to avoid the BLOB performance penalties while keeping the single-store simplicity.",
    ],
    correctIndex: 1,
    explanation:
      "At 500KB, files are small enough that the server proxy approach works fine — the 10MB threshold is where pain becomes real. However, the decision isn't purely about size; it's about query patterns and scale. If you never query the file contents with SQL, blob storage offers better cost efficiency and operational separation. Option A is partially right about latency but wrong to suggest database storage as default. Option C is too absolute — small structured binary data can live in databases. Option D is terrible — base64 encoding increases size by ~33% and creates worse problems.",
    interviewScript:
      "In your interview, say: 'For 500KB files, the proxy approach is viable, so the decision comes down to query patterns and scale projections. If we don't need SQL queries against file contents, blob storage gives us independent scaling, better cost efficiency, and operational simplicity — even if the direct upload pattern isn't strictly necessary at this size.'",
    proTip: null,
  },
  // q3 — Server Proxy Bottleneck
  {
    id: "q3",
    subtopic: "Server Proxy Bottleneck",
    question:
      "A video platform proxies all uploads through its API servers. During a live event, 10,000 users simultaneously upload 2GB highlight clips. Each API server has 32GB RAM and 10Gbps network. What fails first and why?",
    options: [
      "CPU exhaustion — transcoding the video streams in real-time during upload consumes all available compute cycles.",
      "Memory exhaustion — even with streaming, each connection requires buffering, and 10,000 concurrent 2GB uploads will overwhelm the servers' ability to proxy data, forcing either connection drops or OOM kills long before network saturation.",
      "Network bandwidth — 10,000 × 2GB = 20TB of data exceeds the aggregate network capacity of any reasonable server fleet.",
      "Database connection pool — each upload creates a long-held database transaction to track progress, exhausting the connection pool and blocking all other operations.",
    ],
    correctIndex: 1,
    explanation:
      "When servers act as dumb pipes for large uploads, memory is the bottleneck. Each proxied connection requires buffer memory, and with thousands of concurrent multi-GB uploads, servers run out of memory to hold in-flight data. Even with streaming (not buffering entire files), the per-connection overhead multiplied by concurrency is devastating. The article emphasizes that servers 'add no value to the transfer, just latency and cost.' Option A is wrong — proxying doesn't involve transcoding. Option C miscalculates — 10Gbps per server across a fleet can handle the bandwidth. Option D is a real concern but not the first failure point.",
    interviewScript:
      "In your interview, say: 'The fundamental issue is that our API servers become dumb pipes — they add no value to the transfer, just latency and cost. With 10,000 concurrent large uploads, memory exhaustion from connection buffering will hit first. This is exactly why we need direct-to-storage uploads: cloud providers already have the infrastructure for massive concurrent transfers.'",
    proTip: null,
  },
  // q4 — Server Proxy Bottleneck (Anti-pattern)
  {
    id: "q4",
    subtopic: "Server Proxy Bottleneck",
    question:
      "A candidate proposes: 'Since presigned URLs bypass the server, let's use them for ALL uploads including 2KB JSON API payloads and form submissions.' What's the most critical flaw in this design?",
    options: [
      "Presigned URLs cannot handle JSON payloads — they only support binary file uploads.",
      "The two-step flow (request URL, then upload) adds unnecessary latency and complexity for small payloads where the server proxy approach has negligible overhead — you're optimizing away a problem that doesn't exist for small files.",
      "S3 charges per-request, so millions of tiny JSON uploads would cost 100x more than a traditional API.",
      "Presigned URLs expire, so if a client caches a URL and tries to submit a form 2 hours later, the submission silently fails with no user-friendly error.",
    ],
    correctIndex: 1,
    explanation:
      "The article explicitly states: 'Small files don't need it. Anything under 10MB should use normal API endpoints. The two-step dance adds latency and complexity for no real benefit.' For 2KB JSON payloads, the overhead of generating presigned URLs, making two round trips, and managing async state synchronization far exceeds the cost of simply proxying through the API server. Option A is wrong — presigned URLs can handle any content type. Option C overstates cost impact. Option D describes a real concern but isn't the core flaw.",
    interviewScript:
      "In your interview, say: 'Presigned URLs solve a specific problem — large file transfer bottlenecks. For small payloads under 10MB, the server can handle thousands of requests without the overhead. The two-step URL generation dance adds latency and architectural complexity that isn't justified when the proxy approach works perfectly fine.'",
    proTip: null,
  },
  // q5 — Presigned URLs (Upload) — GOTCHA
  {
    id: "q5",
    subtopic: "Presigned URLs (Upload)",
    question:
      "An interviewer asks: 'How does your API server generate a presigned URL? Does it need to call S3 first?' A candidate answers: 'Yes, the server makes an API call to S3 which returns the presigned URL.' What's wrong with this answer?",
    options: [
      "Nothing is wrong — S3 must be contacted to reserve the upload slot and generate a unique signature.",
      "The candidate is incorrect. Presigned URL generation happens entirely in application memory using the server's cloud credentials to create a cryptographic signature — no network call to S3 is needed. S3 verifies the signature later when the client uploads.",
      "The candidate is partially correct — a lightweight HEAD request to S3 is needed to verify the bucket exists, but the signature itself is computed locally.",
      "The candidate is wrong because presigned URLs are generated by the CDN layer (CloudFront), not by either the application server or S3.",
    ],
    correctIndex: 1,
    explanation:
      "This is a common gotcha. The article explicitly states: 'Generating a presigned URL happens entirely in your application's memory — no network call to blob storage needed. Your server uses its cloud credentials to create a signature that the storage service can verify later.' The signature is a cryptographic hash of request details combined with the secret key. S3 has its own copy of the credentials and recalculates the hash when the client uploads. This is critical for latency — URL generation is effectively free.",
    interviewScript:
      "In your interview, say: 'A key implementation detail — presigned URL generation is a pure in-memory cryptographic operation. The server uses its AWS credentials to compute an HMAC-SHA256 signature over the request parameters. No network round-trip to S3 is needed. This means URL generation is sub-millisecond and doesn't add a dependency on S3 availability for the authorization step.'",
    proTip:
      "This gotcha catches many candidates. Emphasizing that it's a local crypto operation shows deep understanding and distinguishes you from candidates who treat presigned URLs as a black box.",
  },
  // q6 — Presigned URLs (Upload)
  {
    id: "q6",
    subtopic: "Presigned URLs (Upload)",
    question:
      "You generate a presigned URL for a profile picture upload endpoint with `content-type: image/*` and `content-length-range: [0, 5242880]` (5MB max). An attacker obtains this URL. Which attack vector is NOT mitigated by these conditions?",
    options: [
      "Uploading a 500MB video file to explode your storage costs.",
      "Uploading a malicious executable renamed with a .jpg extension, since content-type validation only checks the declared MIME type header, not the actual file contents.",
      "Uploading a 4MB text file with a spoofed Content-Type header of 'image/png' — oh wait, this IS blocked because the storage service validates the Content-Type matches the restriction.",
      "Using the URL from a different IP address than the one that requested it, since presigned URLs don't encode client IP restrictions.",
    ],
    correctIndex: 1,
    explanation:
      "Content-type conditions in presigned URLs validate the HTTP Content-Type header, not the actual file contents. An attacker can upload a malicious executable with a Content-Type header of 'image/png' — the presigned URL validation will pass because the header matches. This is why the article emphasizes a quarantine/processing pipeline: 'file type validation to ensure a photo isn't actually an executable.' The content-length-range blocks oversized uploads (Option A), and the content-type check blocks mismatched headers (Option C). Option D describes a real limitation but is less dangerous.",
    interviewScript:
      "In your interview, say: 'Presigned URL conditions validate HTTP headers, not file contents. A content-type restriction checks what the client claims the file is, not what it actually is. That's why we need a post-upload processing pipeline — virus scanning, magic byte validation, and content analysis — before making any upload publicly accessible.'",
    proTip: null,
  },
  // q7 — Presigned URLs (Upload) — GOTCHA
  {
    id: "q7",
    subtopic: "Presigned URLs (Upload)",
    question:
      "A developer sets presigned URL expiry to 24 hours 'so users have plenty of time.' The system serves 100K daily users. What's the most dangerous consequence of this long expiry window?",
    options: [
      "S3 will reject the URLs because the maximum allowed expiry for presigned URLs is 1 hour.",
      "The long window means leaked or intercepted URLs remain valid for 24 hours, creating a large attack surface — any URL shared accidentally, logged in server logs, or captured in network traffic becomes a valid upload credential for an entire day.",
      "24-hour URLs will cause S3 to pre-allocate storage for all potential uploads, increasing costs even if most URLs are never used.",
      "The cryptographic signatures become weaker over time because the HMAC key rotation happens every 12 hours by default.",
    ],
    correctIndex: 1,
    explanation:
      "The article warns: 'Since anyone with the URL can use it, you need to encode restrictions when generating them.' A 24-hour window dramatically expands the blast radius of any URL leak. URLs logged in proxy servers, captured in browser history, or intercepted over insecure connections all become usable credentials. The typical recommendation is 15 minutes to 1 hour. Option A is wrong — S3 supports up to 7 days for presigned URLs. Option C is wrong — S3 doesn't pre-allocate. Option D is wrong — HMAC doesn't degrade over time.",
    interviewScript:
      "In your interview, say: 'Presigned URLs are bearer credentials — anyone with the URL can use it. That's why we keep expiry short, typically 15 minutes to 1 hour. A 24-hour window means any accidental leak — server logs, browser history, insecure proxies — gives attackers a full day to exploit the URL. The minimal viable window reduces blast radius.'",
    proTip: null,
  },
  // q8 — Download & CDN Signatures
  {
    id: "q8",
    subtopic: "Download & CDN Signatures",
    question:
      "You're serving video content. 80% of views are for the top 100 videos, 20% for the long tail of 500K videos. A candidate proposes serving ALL downloads directly from S3 presigned URLs. What's the primary problem with this architecture?",
    options: [
      "S3 presigned URLs expire, so frequently accessed videos would require constant URL regeneration, overloading the API server.",
      "S3 charges for data transfer out, and without CDN caching, every single view of a popular video fetches from origin — so the top 100 videos generate 80% of your bandwidth costs from the same repeated S3 origin fetches instead of being served from edge caches.",
      "S3 has a limit of 5,500 GET requests per second per prefix, so popular videos would hit rate limits and return 503 errors.",
      "S3 doesn't support range requests, making it impossible to implement adaptive bitrate streaming for video playback.",
    ],
    correctIndex: 1,
    explanation:
      "The article explains: 'Direct blob storage access is simpler and cheaper for infrequent downloads. CDN distribution costs more but gives better performance for frequently accessed files.' Without a CDN, every view of a popular video pulls from S3 origin — repeated data transfer costs add up massively, and users far from the S3 region face high latency. The CDN caches content at edge locations so subsequent requests in a region are served locally. Option A overstates the problem — URL generation is cheap. Option C is a real S3 limit but can be mitigated with prefix distribution. Option D is wrong — S3 supports range requests.",
    interviewScript:
      "In your interview, say: 'For the hot content serving 80% of views, we absolutely need CDN caching. Without it, every view pulls from S3 origin — that's redundant data transfer costs and unnecessary latency for users far from the region. CDN edge caches mean the first viewer in Sydney pulls from origin, but every subsequent Sydney viewer gets single-digit millisecond latency from the edge.'",
    proTip: null,
  },
  // q9 — Download & CDN Signatures
  {
    id: "q9",
    subtopic: "Download & CDN Signatures",
    question:
      "An interviewer asks: 'What's the fundamental cryptographic difference between how S3 validates presigned URLs and how CloudFront validates signed URLs?' What's the correct answer?",
    options: [
      "S3 uses symmetric key validation — it has a copy of your secret key and recalculates the same HMAC signature. CloudFront uses asymmetric (public/private) key cryptography — you sign with your private key, and CDN edge servers validate using the corresponding public key without needing your secret.",
      "S3 uses RSA-2048 signatures while CloudFront uses HMAC-SHA256 — CloudFront chose the faster algorithm because edge servers need to validate millions of URLs per second.",
      "Both use the same HMAC-SHA256 algorithm, but S3 validates against IAM credentials while CloudFront validates against a separate CloudFront key group.",
      "S3 validates signatures by calling back to IAM on each request, while CloudFront caches the validation result at edge for 60 seconds to reduce origin load.",
    ],
    correctIndex: 0,
    explanation:
      "The article explicitly contrasts these: 'S3 presigned URLs are validated by the storage service using your cloud credentials [shared secret/symmetric]. CDN signatures are validated by CDN edge servers using public/private key cryptography. You hold the private key and sign the URL. The CDN has the corresponding public key and validates signatures at edge locations worldwide — no need to call back to your servers.' This is a critical architectural difference because asymmetric crypto allows thousands of edge servers to validate without sharing secrets.",
    interviewScript:
      "In your interview, say: 'S3 uses symmetric key validation — it shares the secret key with your server and both compute the same HMAC. CloudFront uses asymmetric cryptography — I sign with my private key, and edge servers worldwide validate using the public key. This is critical because you can distribute public keys to thousands of edge locations without security risk, enabling validation without any callback to origin.'",
    proTip:
      "This distinction shows deep understanding. The reason CDNs use asymmetric crypto is that you can't distribute a shared secret to hundreds of edge locations safely — public key distribution is inherently safe.",
  },
  // q10 — Download & CDN Signatures
  {
    id: "q10",
    subtopic: "Download & CDN Signatures",
    question:
      "Your streaming platform needs to serve a video player that makes hundreds of small segment requests (.ts files) per viewing session. Each segment is a separate HTTP request. Should you use CloudFront signed URLs or signed cookies?",
    options: [
      "Signed URLs — each segment gets its own individually signed URL, giving you fine-grained access control per segment.",
      "Signed cookies — a single signed cookie covers all requests matching a URL pattern, so the player can request hundreds of segments without needing individually signed URLs for each one, reducing both server-side URL generation load and client-side complexity.",
      "Neither — adaptive bitrate streaming segments should be served unsigned through a public CDN distribution with IP-based access control.",
      "Signed URLs with a wildcard path parameter that covers all segments in a single signature, avoiding the per-segment overhead.",
    ],
    correctIndex: 1,
    explanation:
      "The article mentions that CloudFront supports both signed URLs and signed cookies. For streaming with hundreds of segment requests per session, signed cookies are ideal — you set a single cookie that grants access to a URL pattern (e.g., /videos/lecture/*), and every subsequent request includes the cookie automatically. Signed URLs would require generating hundreds of individual URLs. Option A works but is wasteful. Option C sacrifices access control. Option D doesn't exist — CloudFront signed URLs don't support wildcards in the path.",
    interviewScript:
      "In your interview, say: 'For HLS/DASH streaming with hundreds of segment requests, I'd use CloudFront signed cookies rather than signed URLs. A single cookie grants access to a URL pattern covering all segments, so the player can request any segment without pre-generating hundreds of individually signed URLs. This reduces both server load and client complexity.'",
    proTip: null,
  },
  // q11 — Resumable / Chunked Uploads
  {
    id: "q11",
    subtopic: "Resumable / Chunked Uploads",
    question:
      "You're designing a mobile video upload feature where users record 5-minute 4K clips (~1.5GB) on unreliable cellular connections. Which approach best handles this constraint?",
    options: [
      "Generate a single presigned URL for the entire 1.5GB file and let the client retry the full upload on failure — modern mobile networks are fast enough to make this practical.",
      "Use chunked uploads (e.g., S3 multipart with 5MB parts) so that on connection drop, the client queries which parts already succeeded (ListParts) and resumes from the next incomplete part — only re-uploading the failed chunk, not the entire file.",
      "Buffer the entire video in memory on the mobile device, compress it to under 10MB, then do a single presigned URL upload to avoid the chunking complexity.",
      "Stream the video in real-time to the API server as it's being recorded, so the server can write chunks to S3 incrementally and the user doesn't need to wait for recording to finish.",
    ],
    correctIndex: 1,
    explanation:
      "The article is explicit: 'If the connection drops after uploading 60 of 100 parts, the client doesn't start over. Instead, it queries the storage API to see which parts already uploaded successfully, then resumes from part 61.' For a 1.5GB file on flaky cellular, chunked uploads are essential. A 5MB chunk that fails wastes at most seconds of upload time. Option A means restarting 1.5GB uploads repeatedly. Option C is impractical — you can't compress 4K video to under 10MB without destroying quality. Option D adds server proxy bottleneck problems.",
    interviewScript:
      "In your interview, say: 'For large files on unreliable connections, chunked uploads are non-negotiable. With S3 multipart, we split the 1.5GB file into ~300 parts of 5MB each. If the connection drops after part 200, the client calls ListParts to discover parts 1-200 succeeded, then resumes from part 201. The worst case is re-uploading one 5MB chunk, not the entire file.'",
    proTip: null,
  },
  // q12 — Resumable / Chunked Uploads
  {
    id: "q12",
    subtopic: "Resumable / Chunked Uploads",
    question:
      "A user's browser crashes at 80% of a multipart upload. They reopen the app the next day. What information does the client need to resume the upload, and where should it be stored?",
    options: [
      "The client needs the Upload ID (session identifier). Smart implementations store this client-side (e.g., localStorage keyed by a file fingerprint — hash of filename, size, and last-modified date) so uploads can resume even after app restarts. The client uses this to call ListParts and resume.",
      "No client-side storage is needed — the server tracks all upload sessions in the database, so the client just re-requests an upload URL and the server automatically matches it to the existing session.",
      "The client needs to re-upload the entire file because S3 automatically cleans up incomplete multipart uploads after 1 hour.",
      "The client needs the ETag of every previously uploaded part. Without all ETags, the multipart upload cannot be completed even if all parts are in S3.",
    ],
    correctIndex: 0,
    explanation:
      "The article states: 'The implementation requires the client to track the upload session identifier... Some teams store this in localStorage so uploads can resume even after app restarts.' A file fingerprint (hash of name, size, last-modified) lets the client recognize it's the same file and retrieve the stored Upload ID. With the Upload ID, calling ListParts reveals which parts succeeded. Option B is plausible but the client still needs to identify which session to resume. Option C is wrong — lifecycle rules are typically 24-48 hours, not 1 hour. Option D is partially wrong — ListParts returns ETags.",
    interviewScript:
      "In your interview, say: 'The client needs the upload session identifier — the Upload ID in S3. We store this client-side keyed by a file fingerprint so it survives app restarts. On resume, the client uses the Upload ID to call ListParts, which returns all successfully uploaded parts with their ETags, then resumes from the first missing part.'",
    proTip: null,
  },
  // q13 — Resumable / Chunked Uploads
  {
    id: "q13",
    subtopic: "Resumable / Chunked Uploads",
    question:
      "Your system must support uploads across AWS S3, Google Cloud Storage, and Azure Blob Storage. A developer writes a unified upload client that sends 5MB chunks with individual presigned URLs for each chunk across all providers. What breaks?",
    options: [
      "Nothing breaks — 5MB chunks with individual presigned URLs is the universal standard across all three providers.",
      "GCS and Azure use a single session URL with range headers for all chunks, not individual presigned URLs per chunk. Only AWS S3 uses the pattern of individual presigned URLs per part. A unified client must handle both paradigms.",
      "Azure Block Blobs require a minimum chunk size of 100MB, so 5MB chunks will be rejected.",
      "GCS doesn't support chunked uploads at all — it requires the entire file in a single PUT request regardless of size.",
    ],
    correctIndex: 1,
    explanation:
      "The article explicitly contrasts the providers: 'AWS S3 uses multipart uploads where each 5MB+ part gets its own presigned URL. Google Cloud Storage and Azure use single session URLs where you upload chunks with range headers to the same endpoint.' A unified client assuming S3's per-part URL model will break on GCS and Azure. Option A ignores the fundamental API difference. Option C is wrong — Azure blocks are 4MB-100MB. Option D is completely wrong — GCS supports resumable uploads.",
    interviewScript:
      "In your interview, say: 'The chunking APIs differ fundamentally between providers. S3 multipart gives each part its own presigned URL. GCS and Azure use a single resumable session URL where you send chunks with range headers. A cross-provider client needs an abstraction layer that handles both paradigms — individual URLs for S3 and range-header-based streaming for GCS and Azure.'",
    proTip: null,
  },
  // q14 — Upload Completion & Assembly
  {
    id: "q14",
    subtopic: "Upload Completion & Assembly",
    question:
      "After all parts of a multipart upload are sent to S3, a developer's code immediately generates a download URL for the file. Users report getting 404 errors. What step did the developer miss?",
    options: [
      "The developer forgot to set the file's ACL to public-read, so the download URL has no permission to access the object.",
      "The developer skipped the completion step — after all parts upload, the client must call a completion endpoint with the list of part numbers and their checksums. Until this succeeds, the parts exist but there is no accessible file object.",
      "S3 has eventual consistency for new objects, so the 404 is expected for up to 30 seconds after upload completion. The developer should add a polling retry.",
      "The developer generated a download URL pointing to the wrong S3 region, since multipart uploads can scatter parts across regions.",
    ],
    correctIndex: 1,
    explanation:
      "The article states: 'After all parts upload, the client must call a completion endpoint with the list of part numbers and their checksums. The storage service then assembles these parts into the final object. Until this completion succeeds, you have parts in storage but no accessible file.' This is a critical step many developers miss — uploading all parts is NOT the same as having a complete file. Option A is about permissions, not existence. Option C is outdated — S3 provides strong consistency since 2020. Option D is wrong — parts don't scatter across regions.",
    interviewScript:
      "In your interview, say: 'This is a common mistake. Uploading all parts is necessary but not sufficient — you must explicitly call the CompleteMultipartUpload API with all part numbers and their ETags. S3 then assembles the parts into a single object. Until completion succeeds, the individual parts exist but no accessible object does. That's why users see 404s.'",
    proTip:
      "After completion, the chunks cease to exist as separate entities. The article notes: 'Once multipart upload completes, the chunks no longer exist from the perspective of the storage service. They're all combined into a single object.'",
  },
  // q15 — Upload Completion & Assembly — GOTCHA
  {
    id: "q15",
    subtopic: "Upload Completion & Assembly",
    question:
      "Your system has been running for 6 months and storage costs are 3x higher than projected. Investigation reveals millions of incomplete multipart upload parts sitting in S3. What went wrong and what's the fix?",
    options: [
      "S3 has a bug where it doesn't garbage-collect failed uploads — you need to file a support ticket with AWS to trigger cleanup.",
      "Your clients are crashing mid-upload and never calling the completion endpoint, leaving orphaned parts. Since incomplete multipart uploads cost money for stored parts, you need S3 lifecycle rules to automatically abort incomplete uploads after 24-48 hours.",
      "Your presigned URLs are expiring mid-upload, causing uploads to fail but leaving the destination objects in a corrupted state.",
      "S3 versioning is enabled and every partial upload creates a new version — disable versioning to stop accumulating old parts.",
    ],
    correctIndex: 1,
    explanation:
      "The article explicitly warns: 'Incomplete multipart uploads cost money, so lifecycle rules should clean them up after 24-48 hours.' When clients crash, lose connectivity, or abandon uploads, the uploaded parts remain in S3 indefinitely unless lifecycle rules are configured to abort incomplete multipart uploads. This is a real-world gotcha that catches teams who deploy multipart uploads without configuring cleanup. Option A is wrong — this is expected S3 behavior, not a bug. Option C mischaracterizes the failure mode. Option D conflates versioning with multipart.",
    interviewScript:
      "In your interview, say: 'Incomplete multipart uploads are a well-known cost trap. When clients crash mid-upload, the already-uploaded parts sit in S3 indefinitely, accumulating storage charges. The fix is S3 lifecycle rules — automatically abort incomplete multipart uploads after 24-48 hours. This should be configured from day one as a non-negotiable operational hygiene step.'",
    proTip: null,
  },
  // q16 — State Synchronization
  {
    id: "q16",
    subtopic: "State Synchronization",
    question:
      "In a Dropbox-like system, you store file metadata (including a 'status' column) in PostgreSQL and files in S3. A file's status is 'pending' in the database. Which of the following correctly describes all the possible states of the actual file in S3?",
    options: [
      "The file definitely does not exist in S3 yet — 'pending' means the upload hasn't started.",
      "The file might not exist, might be partially uploaded (some multipart parts present), or might be fully uploaded but the status update hasn't propagated yet — all three states are possible when the DB shows 'pending' because the two systems update at different times.",
      "The file exists in S3 but is encrypted and inaccessible until the status changes to 'completed.'",
      "The file cannot exist in S3 while status is 'pending' because the presigned URL is only generated after status changes to 'uploading.'",
    ],
    correctIndex: 1,
    explanation:
      "The article emphasizes this exact problem: 'Your database shows pending while S3 might already have the complete file — or maybe it doesn't, and you can't tell without checking.' With direct uploads, the database and blob storage are separate systems that update at different times. A 'pending' status could mean the upload hasn't started, is in progress, or completed but the notification failed. This is the core state synchronization challenge. Option A is too certain. Options C and D impose false constraints.",
    interviewScript:
      "In your interview, say: 'This is the fundamental state synchronization challenge with direct uploads. The database and blob storage are separate systems with no transactional guarantee between them. A pending status in the DB means we genuinely don't know the S3 state — the file could be absent, partially uploaded, or fully present with a lost completion notification. That's why we need event notifications plus reconciliation.'",
    proTip: null,
  },
  // q17 — State Synchronization (Anti-pattern / Cross-subtopic)
  {
    id: "q17",
    subtopic: "State Synchronization",
    question:
      "A candidate designs a system where, after uploading to S3 via presigned URL, the client calls POST /api/files/{id}/complete to mark the upload as done. The server immediately updates the database status to 'completed' and returns the download URL. What's the most dangerous flaw in trusting the client?",
    options: [
      "The client might call the completion endpoint before the upload finishes, creating race conditions where the database shows 'completed' but S3 doesn't have the file — causing download failures for other users.",
      "Malicious clients could call the completion endpoint without uploading anything, making the system believe files exist when they don't, while also creating orphaned presigned URLs that waste S3 resources.",
      "The client might send the completion call from a different IP than the upload, which S3 will flag as suspicious and delete the uploaded file.",
      "The POST request might arrive before S3's eventual consistency propagates the new object, but this resolves itself within seconds so it's a minor issue.",
    ],
    correctIndex: 0,
    explanation:
      "The article identifies multiple problems with trusting the client: 'Race conditions: The database might show completed before the file actually exists in storage. Malicious clients: Users could mark uploads as complete without actually uploading anything. Network failures: The completion notification might fail to reach your servers.' The most dangerous is the race condition because it directly causes broken functionality — other users try to download a file that doesn't exist. Option B is a concern but malicious intent is less common than network timing issues. Option C is fabricated. Option D downplays the issue.",
    interviewScript:
      "In your interview, say: 'Trusting the client for state transitions is fundamentally flawed. The client can call completion before the upload finishes, or without uploading at all. This creates a consistency gap where the database says the file exists but S3 disagrees. That's why we need server-side verification — either through S3 event notifications or a HeadObject check before updating status.'",
    proTip: null,
  },
  // q18 — State Synchronization — GOTCHA
  {
    id: "q18",
    subtopic: "State Synchronization",
    question:
      "A client successfully uploads a 2GB file to S3 via presigned URL. The client then crashes before notifying your API server. What is the system state, and why is this particularly insidious?",
    options: [
      "The file is lost — S3 automatically deletes uploads that aren't confirmed within the presigned URL's expiry window.",
      "You have an orphaned file: S3 has 2GB of data costing you money with no corresponding database record. Without reconciliation, you'll never know it exists — you're paying for storage you can't find, serve, or clean up.",
      "The file exists but is automatically quarantined by S3 because no completion webhook was received, preventing any access until manual intervention.",
      "This isn't a problem because the client will automatically retry the completion notification when it recovers, using the upload ID stored in localStorage.",
    ],
    correctIndex: 1,
    explanation:
      "The article identifies this: 'Orphaned files: The client might crash after uploading but before notifying you, leaving files in storage with no database record.' This is insidious because the file is invisible to your application — no database row references it, so you can't find it, serve it, or delete it. It silently accumulates storage costs. The fix is reconciliation: periodic jobs that scan storage for objects without matching database records. Option A is wrong — presigned URL expiry only affects the upload permission, not existing data. Option C is fabricated. Option D assumes client recovery.",
    interviewScript:
      "In your interview, say: 'This creates an orphaned file — a real data object in S3 with no corresponding metadata in our database. It's invisible to the application but costs money. This is exactly why production systems need two things: event notifications as the primary update path, and reconciliation jobs as a safety net to catch orphaned files and stuck pending records.'",
    proTip: null,
  },
  // q19 — Event Notifications & Reconciliation
  {
    id: "q19",
    subtopic: "Event Notifications & Reconciliation",
    question:
      "You implement S3 event notifications to update your database when uploads complete. The S3 event includes the object key. How does your system map this event back to the correct database row?",
    options: [
      "The S3 event includes custom metadata tags you set during presigned URL generation, including the database record ID.",
      "You use the object key (storage_key) from the event — it's the same storage_key you stored in the database when you generated the presigned URL, allowing you to find the exact row to update.",
      "You parse the filename from the S3 event and do a LIKE query against the filenames in your database.",
      "You maintain a separate mapping table that translates S3 object keys to database record IDs, indexed by the presigned URL signature.",
    ],
    correctIndex: 1,
    explanation:
      "The article explains: 'The event includes the object key — the same storage_key you stored in your database when generating the presigned URL. This lets you find the exact row to update.' When you generate the presigned URL, you choose the storage key (e.g., uploads/user123/files/abc-123.pdf) and record it in the database. When S3 fires the event, it includes this same key, creating a direct mapping. Option A is partially viable but not the primary mechanism. Option C is fragile and won't work with UUID-based names. Option D adds unnecessary complexity.",
    interviewScript:
      "In your interview, say: 'The mapping is elegant — when generating the presigned URL, we choose the S3 object key and store it as storage_key in our database. When S3 fires the upload-complete event, it includes this same key. A simple WHERE storage_key = event.key query finds the exact row to update from pending to completed.'",
    proTip: null,
  },
  // q20 — Event Notifications & Reconciliation
  {
    id: "q20",
    subtopic: "Event Notifications & Reconciliation",
    question:
      "Your S3 event notifications update the database for 99.9% of uploads. But 0.1% of files get stuck in 'pending' status forever. The events for these files were either delayed, lost, or failed processing. What's the correct production approach?",
    options: [
      "Increase the event retry count to 100 and add a dead-letter queue. If events are retried enough times, they'll eventually succeed, eliminating the need for additional mechanisms.",
      "Run a periodic reconciliation job that finds files stuck in 'pending' beyond a threshold and verifies them directly against S3 — this catches any cases where event notifications fail, providing a safety net for the primary event-driven flow.",
      "Accept 99.9% reliability as sufficient for a file storage system and let users manually re-upload the 0.1% that fail.",
      "Switch from push-based events to a pull-based model where your server polls S3 every second for new objects, eliminating the possibility of missed events.",
    ],
    correctIndex: 1,
    explanation:
      "The article prescribes exactly this: 'Events can fail too — network issues, service outages, or processing errors might cause events to be delayed or lost. That's why production systems add reconciliation as a safety net. A periodic job checks for files stuck in pending status and verifies them against storage.' This dual approach (events as primary + reconciliation as backup) is a classic distributed systems pattern. Option A helps but doesn't eliminate failures. Option C is unacceptable. Option D is wasteful and creates scaling issues.",
    interviewScript:
      "In your interview, say: 'Events are our primary mechanism, but no distributed notification system is 100% reliable. We add reconciliation as a safety net — a periodic job scans for records stuck in pending beyond a threshold, then does a HeadObject call against S3 to verify the actual state. This dual approach gives us eventual consistency guarantees without sacrificing the performance of the event-driven path.'",
    proTip: null,
  },
  // q21 — Event Notifications & Reconciliation
  {
    id: "q21",
    subtopic: "Event Notifications & Reconciliation",
    question:
      "Your reconciliation job runs every 5 minutes, checking for files stuck in 'pending' for over 10 minutes. It finds a record where the database shows 'pending' but S3 has the complete file. It also finds another record where the database shows 'pending' and S3 has NO file. How should each case be handled?",
    options: [
      "Both cases should update the database to 'failed' and notify the user to re-upload, since any inconsistency indicates a system error.",
      "Case 1: Update database to 'completed' since S3 confirms the file exists. Case 2: Keep as 'pending' for another cycle — the upload might still be in progress and the 10-minute threshold may be too aggressive.",
      "Case 1: Update database to 'completed' since S3 confirms the file exists (the event notification was lost). Case 2: Mark as 'failed' since sufficient time has passed and S3 has no evidence of an upload — the user needs to retry.",
      "Case 1: Delete the file from S3 and mark as 'failed' since the normal flow wasn't followed. Case 2: Mark as 'failed' and clean up the database record.",
    ],
    correctIndex: 2,
    explanation:
      "Reconciliation must handle both directions of inconsistency. Case 1 is a lost event — the file uploaded successfully but the notification never arrived. The fix is simply updating the database to match reality. Case 2 is a failed or abandoned upload — after sufficient time, we can confidently mark it as failed. Option A is too aggressive for Case 1 — the file is fine! Option B is too lenient for Case 2 — at some point you must declare failure. Option D is destructive for Case 1 — deleting a successfully uploaded file is terrible.",
    interviewScript:
      "In your interview, say: 'Reconciliation handles two failure modes. When the DB says pending but S3 has the file, we update to completed — it's a lost notification. When the DB says pending and S3 has nothing after our threshold, we mark as failed — it's an abandoned or failed upload. The key insight is that S3 is the source of truth for file existence, so reconciliation converges the database toward S3's actual state.'",
    proTip: null,
  },
  // q22 — Abuse Prevention
  {
    id: "q22",
    subtopic: "Abuse Prevention",
    question:
      "You implement direct uploads for a social media platform. A malicious user discovers they can upload files directly to S3 and immediately share the S3 URL with other users before any content moderation runs. How should the architecture prevent this?",
    options: [
      "Use S3 bucket policies to make all objects private by default and only generate signed download URLs for files that pass moderation.",
      "Implement a quarantine bucket pattern: uploads go to a separate quarantine bucket first, content validation runs (virus scans, image recognition, file type verification), and only after checks pass are files moved to the public-serving bucket and marked as 'available' in the database.",
      "Add real-time content scanning middleware to the presigned URL upload flow so files are scanned as bytes stream into S3.",
      "Rate-limit presigned URL generation to 1 per minute per user so attackers can't upload malicious content quickly enough to exploit.",
    ],
    correctIndex: 1,
    explanation:
      "The article describes exactly this: 'Uploads go into a quarantine bucket first. Run virus scans, content validation, and any other checks before moving files to the public bucket... Even if someone bypasses your rate limiting and uploads malicious content, they can't use it until your systems approve it.' The quarantine pattern ensures no uploaded content is accessible until validated. Option A helps with access control but doesn't address content moderation workflow. Option C is impractical — you can't inject middleware into direct S3 uploads. Option D is insufficient alone.",
    interviewScript:
      "In your interview, say: 'The key principle is: never let users immediately access what they upload. We use a quarantine bucket pattern — all uploads land in a staging bucket. An async pipeline runs virus scanning, content moderation, and file type validation. Only after passing all checks does the file move to the serving bucket. Even if someone uploads malicious content, there's no way to access or share it until our systems approve it.'",
    proTip:
      "The article notes the processing delay 'naturally throttles abuse — attackers can't immediately see if their upload worked, making automation harder.' This is a nice side benefit to mention.",
  },
  // q23 — Abuse Prevention
  {
    id: "q23",
    subtopic: "Abuse Prevention",
    question:
      "A team generates presigned URLs for a profile picture endpoint but forgets to include content-length-range conditions. What's the worst-case impact?",
    options: [
      "Users will upload corrupted images that crash the image processing pipeline.",
      "Without size limits baked into the presigned URL signature, a malicious user could upload terabytes of data on a URL meant for a small profile picture, exploding storage costs — and the upload will succeed because S3 has no default per-object size limit.",
      "The images will upload successfully but will be stored in a non-standard format that CloudFront cannot cache.",
      "S3 will apply its own default 5GB limit per presigned URL, so the practical impact is limited to moderately oversized uploads.",
    ],
    correctIndex: 1,
    explanation:
      "The article warns: 'Always include file size limits in the presigned URL conditions. Without these, someone could upload terabytes of data on a URL meant for a small image, exploding your storage costs.' S3's maximum object size is 5TB for multipart uploads. A single PUT presigned URL allows up to 5GB. Without content-length-range conditions, there's no server-side enforcement of your expected file size. Option A is about format, not size. Option C is fabricated. Option D understates the risk — 5GB is still massively oversized for a profile picture.",
    interviewScript:
      "In your interview, say: 'content-length-range is a critical security control. Without it, a presigned URL meant for a 5MB profile picture could accept a 5GB upload. At scale, a malicious user automating these uploads could rack up massive storage costs. The conditions are baked into the cryptographic signature, so they're tamper-proof once set.'",
    proTip: null,
  },
  // q24 — Metadata Handling
  {
    id: "q24",
    subtopic: "Metadata Handling",
    question:
      "When generating a presigned URL, your system creates a database record with status 'pending' and a storage_key of 'uploads/user123/1711634400/abc-uuid.pdf'. Why is it critical to generate the storage key server-side and never let the client specify it?",
    options: [
      "Client-specified keys would break the presigned URL signature because the key is part of the signed parameters.",
      "Client-specified keys create two security risks: key collisions (clients could overwrite other users' files by guessing keys) and path traversal attacks. Server-generated keys with UUID components prevent collisions, and the consistent pattern (user_id/timestamp/uuid) enables efficient querying while maintaining security.",
      "Client-specified keys would exceed S3's maximum key length of 128 characters.",
      "Client-specified keys would prevent S3 event notifications from firing because events only trigger on server-generated key patterns.",
    ],
    correctIndex: 1,
    explanation:
      "The article states: 'Never let clients specify their own keys — that's asking for overwrites and security issues.' Server-generated keys with a consistent pattern like uploads/{user_id}/{timestamp}/{uuid} prevent collisions (UUID ensures uniqueness), prevent one user from overwriting another user's files, and enable efficient listing/querying. Option A is partially true but misses the core security concern. Option C is wrong — S3 keys can be up to 1024 bytes. Option D is fabricated.",
    interviewScript:
      "In your interview, say: 'Storage keys must be server-generated for two reasons: security and collision prevention. If clients specify keys, they could overwrite other users' files by guessing key patterns. Our server generates keys like uploads/{user_id}/{timestamp}/{uuid} — the UUID prevents collisions, the user_id enables per-user listing, and the timestamp aids debugging.'",
    proTip: null,
  },
  // q25 — Metadata Handling (Anti-pattern)
  {
    id: "q25",
    subtopic: "Metadata Handling",
    question:
      "A candidate proposes storing file metadata (uploader, tags, permissions) as S3 object tags instead of in a database, arguing it 'keeps everything in one place.' Why is this approach fundamentally flawed for a file sharing system?",
    options: [
      "S3 object tags are immutable after creation, so you can never update metadata like permissions or tags.",
      "S3 limits tags to 10 per object with 256 characters each, and you can't efficiently query across objects — finding 'all PDFs uploaded by user X in the last week' requires scanning every object's tags instead of a simple database query.",
      "S3 object tags are eventually consistent, so metadata queries would return stale results for up to 24 hours.",
      "S3 charges per tag read operation, making metadata queries prohibitively expensive at scale.",
    ],
    correctIndex: 1,
    explanation:
      "The article explains: 'S3 lets you attach up to 10 tags with 256 characters each. But this is limiting and makes queries painful. You can't efficiently find all PDFs uploaded by user X in the last week by scanning object tags. Keep rich metadata in your database where it belongs.' The database is purpose-built for complex queries; S3 is purpose-built for blob storage. Option A is wrong — tags can be updated. Option C overstates consistency issues. Option D is a concern but not the fundamental flaw.",
    interviewScript:
      "In your interview, say: 'Object tags are limited to 10 per object with 256 character values — far too constrained for rich metadata. More critically, there's no way to efficiently query across objects by tag values. A simple query like find all PDFs from user X this week would require scanning every object. That's an O(n) operation versus a database index lookup. Metadata belongs in your database; storage_key is the bridge between the two systems.'",
    proTip: null,
  },
  // q26 — Download Optimization
  {
    id: "q26",
    subtopic: "Download Optimization",
    question:
      "A user is downloading a 5GB dataset file via a CDN-signed URL. At 4.2GB, their VPN reconnects and drops the connection. With standard HTTP downloads, they'd restart from zero. What HTTP mechanism prevents this, and what must your infrastructure support?",
    options: [
      "HTTP/2 multiplexing — the browser automatically resumes the download on a new stream within the same connection.",
      "HTTP Range requests — the client sends 'Range: bytes=4404019200-' to request only the remaining bytes. Both your CDN and origin storage must support range requests and return 206 Partial Content responses.",
      "HTTP chunked transfer encoding — the server remembers the last successfully sent chunk and resumes from that point on reconnection.",
      "WebSocket fallback — the download switches to a WebSocket connection which has built-in resume capability via sequence numbers.",
    ],
    correctIndex: 1,
    explanation:
      "The article describes this: 'Range requests — HTTP's ability to download specific byte ranges of a file... Track which ranges completed and request only missing pieces after reconnection. Modern browsers and download managers handle this automatically if your storage and CDN support range requests (they all do).' The client specifies the byte offset, the server returns only the requested range with a 206 status code. Both S3 and CloudFront support this natively. Option A is about connection multiplexing, not download resumption. Option C doesn't support client-initiated resume. Option D is not how downloads work.",
    interviewScript:
      "In your interview, say: 'HTTP range requests solve this. The client tracks how many bytes it received — 4.2GB — and on reconnection sends a Range header requesting bytes from that offset onward. The CDN returns a 206 Partial Content response with only the remaining 800MB. Both S3 and CloudFront support range requests natively, and modern browsers handle this automatically.'",
    proTip:
      "Mention that you need to 'ensure your signed URLs don't restrict the HTTP verbs or headers needed' for range requests — this is a subtle configuration detail from the article.",
  },
  // q27 — Download Optimization
  {
    id: "q27",
    subtopic: "Download Optimization",
    question:
      "A game distribution platform needs to deliver 50GB game updates to millions of users. An engineer proposes parallel chunk downloads — splitting the file into parts and downloading 4-6 chunks simultaneously. The article describes this approach. When is this technique actually worth the complexity?",
    options: [
      "Always — parallel downloads are strictly faster than single-connection downloads because they utilize more of the available bandwidth.",
      "Only when users are bottlenecked by per-connection throttling, not total bandwidth. Most users are limited by their total connection speed, so parallel downloads offer no benefit — they only help when the network or CDN throttles individual connections below the user's actual bandwidth.",
      "Only for files over 1GB, because the TCP slow-start overhead per connection makes parallel downloads slower for smaller files.",
      "Only when serving from blob storage directly — CDNs already implement parallel chunk delivery internally so client-side parallelism provides no additional benefit.",
    ],
    correctIndex: 1,
    explanation:
      "The article provides clear guidance: 'This can 3-4x download speeds by working around per-connection throttling. But the complexity is rarely worth it — most users are limited by their total bandwidth, not per-connection limits.' Parallel downloads only help when the network or server limits individual connection speeds below the user's actual available bandwidth. If a user has 100Mbps total and each connection gets 100Mbps, opening 6 connections won't help. Option A ignores bandwidth limits. Option C focuses on the wrong factor. Option D is wrong — CDNs don't automatically parallelize.",
    interviewScript:
      "In your interview, say: 'Parallel chunk downloads work around per-connection throttling, potentially 3-4x speeds. But most users hit their total bandwidth ceiling, not per-connection limits. The complexity of splitting, parallel downloading, and client-side reassembly is rarely worth it. My pragmatic approach would be CDN with range request support, and only consider parallel downloads if we see evidence of per-connection throttling in our metrics.'",
    proTip: null,
  },
  // q28 — Download Optimization
  {
    id: "q28",
    subtopic: "Download Optimization",
    question:
      "Your Sydney-based user downloads a file from your Virginia S3 bucket. Latency is 200ms per request. You add CloudFront. The first Sydney user still experiences 200ms+, but subsequent Sydney users get single-digit milliseconds. An interviewer asks: 'What if EVERY file is unique and never accessed twice — does the CDN still help?'",
    options: [
      "Yes — CDN edge servers still negotiate TLS faster due to geographic proximity, reducing connection setup time even for cache misses.",
      "No — if content is never accessed twice from the same edge location, CDN caching provides zero benefit. You're paying CDN costs for pass-through requests that still pull from origin. For unique, single-access files, serving directly from a regional S3 bucket closer to users (e.g., S3 in Sydney) is more cost-effective.",
      "Yes — CDNs compress data at the edge, reducing transfer size regardless of cache hit rates.",
      "No — but you should still use a CDN because it hides your S3 bucket URL from clients, providing a security benefit.",
    ],
    correctIndex: 1,
    explanation:
      "The article states CDN value comes from caching: 'The first user pulls from origin, but subsequent users in that region get cached copies.' If every file is unique and accessed once, there are no cache hits — every request is a cache miss that pulls from origin. You're adding CDN costs without the caching benefit. A better strategy is regional S3 buckets to reduce origin latency. Option A describes a minor TLS benefit that doesn't justify CDN costs. Option C overstates CDN compression capabilities. Option D is a minor point, not a justification.",
    interviewScript:
      "In your interview, say: 'Great question — CDNs are only cost-effective when content is accessed multiple times from the same edge region. For unique, single-access files, every request is a cache miss. I'd instead deploy S3 buckets in regions close to my user base — S3 in Sydney for Australian users — and serve with presigned URLs directly. Save CDN for frequently accessed content where the caching multiplier justifies the cost.'",
    proTip: null,
  },
  // q29 — Cloud Provider Terminology
  {
    id: "q29",
    subtopic: "Cloud Provider Terminology",
    question:
      "You're migrating from AWS to Azure. Your current system uses S3 multipart uploads with 5MB parts, S3 event notifications to SQS, and CloudFront signed URLs. What are the Azure equivalents?",
    options: [
      "Azure Block Blobs (4MB-100MB blocks) for chunked uploads, Event Grid for storage event notifications, and Azure CDN with SAS tokens for signed access.",
      "Azure Page Blobs for chunked uploads, Service Bus for event notifications, and Azure Front Door with managed certificates for signed access.",
      "Azure Append Blobs for chunked uploads, Event Hubs for event notifications, and Azure CDN with HMAC signatures for signed access.",
      "Azure File Shares for chunked uploads, Queue Storage for event notifications, and Azure Traffic Manager with OAuth tokens for signed access.",
    ],
    correctIndex: 0,
    explanation:
      "The article's provider comparison table maps: S3 Multipart Upload → Azure Block Blobs (4MB-100MB blocks), S3 Event Notifications (to SQS) → Event Grid (blob storage events), CloudFront signed URLs → Azure CDN with SAS tokens. Option B uses wrong Azure services (Page Blobs are for random write workloads). Option C uses wrong services (Append Blobs are for logging, Event Hubs is for streaming data). Option D uses completely wrong services.",
    interviewScript:
      "In your interview, say: 'The core concepts map directly across providers. S3 multipart becomes Azure Block Blobs with 4MB-100MB blocks. S3 event notifications to SQS become Event Grid for blob storage events. CloudFront signed URLs become Azure CDN with SAS tokens. The key API difference is that Azure uses a single session URL with block IDs rather than individual presigned URLs per part.'",
    proTip: null,
  },
  // q30 — Cloud Provider Terminology
  {
    id: "q30",
    subtopic: "Cloud Provider Terminology",
    question:
      "Your system needs to support chunked uploads across all three major cloud providers. What's the KEY architectural difference your upload client must handle between AWS S3 and Google Cloud Storage / Azure?",
    options: [
      "S3 requires server-side encryption to be configured before upload; GCS and Azure encrypt by default.",
      "S3 uses individual presigned URLs per chunk (each part gets its own URL), while GCS and Azure use a single session URL where chunks are uploaded via range headers to the same endpoint. Your client needs two different upload paradigms.",
      "S3 limits chunks to 5GB while GCS and Azure limit to 100MB, requiring different chunking strategies.",
      "S3 validates checksums per-part while GCS and Azure only validate the final assembled object, affecting error detection granularity.",
    ],
    correctIndex: 1,
    explanation:
      "The article explicitly states: 'AWS S3 uses multipart uploads where each 5MB+ part gets its own presigned URL. Google Cloud Storage and Azure use single session URLs where you upload chunks with range headers to the same endpoint.' This is a fundamental API design difference — S3's approach requires generating many presigned URLs, while GCS/Azure use a single URL with range-based uploads. Your client abstraction layer must handle both paradigms.",
    interviewScript:
      "In your interview, say: 'The fundamental difference is URL management. S3 multipart requires a separate presigned URL per chunk, so uploading 300 chunks means 300 URLs. GCS and Azure give you a single resumable session URL and you upload chunks with range headers. A cross-provider client needs an abstraction that maps to both paradigms.'",
    proTip: null,
  },
  // q31 — When to Use / When NOT to Use (Anti-pattern)
  {
    id: "q31",
    subtopic: "When to Use / When NOT to Use",
    question:
      "A fintech startup is building a document processing system where users upload bank statements (CSV files, ~2MB each). The system must validate CSV headers, check for required columns, verify data types, and reject invalid files BEFORE accepting the upload. A developer proposes presigned URLs with post-upload validation. Why is this the wrong pattern here?",
    options: [
      "2MB files are too small for presigned URLs — the pattern only makes sense above 100MB.",
      "Financial documents require the server-as-proxy approach for two reasons: first, the files are small enough that proxying adds negligible overhead; second, synchronous validation requirements mean you need to reject invalid data BEFORE accepting the upload, which requires seeing the bytes as they flow through your server.",
      "Presigned URLs don't support CSV content types, so the upload would be rejected by S3.",
      "Financial regulations prohibit direct-to-S3 uploads — all financial data must transit through application servers for audit logging.",
    ],
    correctIndex: 1,
    explanation:
      "The article explicitly lists this as a 'When NOT to use' case: 'Synchronous validation requirements. If you need to reject invalid data before accepting the upload, you need to proxy it. For example, a CSV import where you must validate headers and data types before confirming the upload.' Combined with the small file size (2MB << 10MB threshold), the traditional proxy approach is clearly correct. Option A uses the wrong threshold — it's 10MB, not 100MB. Option C is fabricated. Option D overgeneralizes compliance requirements.",
    interviewScript:
      "In your interview, say: 'This is a case where direct uploads add complexity without benefit. Two factors point to the proxy approach: the files are 2MB — well under the 10MB threshold — and we need synchronous validation. With presigned URLs, we'd accept the file into S3, then validate, then potentially have to delete and notify the user of rejection. With proxying, we validate in-flight and reject immediately with a helpful error message.'",
    proTip: null,
  },
  // q32 — When to Use / When NOT to Use
  {
    id: "q32",
    subtopic: "When to Use / When NOT to Use",
    question:
      "A healthcare startup building a HIPAA-compliant imaging system needs to store 50MB medical scans. The CTO says 'use presigned URLs since the files are over 10MB.' A compliance officer pushes back. Who's right and why?",
    options: [
      "The CTO is right — presigned URLs work fine for HIPAA because the data is encrypted in transit (HTTPS) and at rest (S3 encryption).",
      "The compliance officer is right — HIPAA requires that all medical data be stored in on-premises servers, not cloud storage.",
      "The compliance officer has a valid concern. The article notes that 'some regulatory frameworks require that data passes through certified systems or gets scanned before storage' — healthcare systems enforcing HIPAA requirements may need the proxy approach to ensure data is inspected and logged through certified systems, even though the files are large.",
      "Both are wrong — medical imaging systems should use a specialized DICOM storage service, not general-purpose blob storage.",
    ],
    correctIndex: 2,
    explanation:
      "The article explicitly addresses this: 'Compliance and data inspection. Some regulatory frameworks require that data passes through certified systems or gets scanned before storage. Healthcare systems enforcing HIPAA requirements... needs the traditional proxy approach.' While the file size suggests direct upload, compliance requirements override the performance optimization. This is a nuanced trade-off question. Option A ignores compliance workflow requirements beyond encryption. Option B is wrong — HIPAA doesn't require on-premises. Option D is tangential.",
    interviewScript:
      "In your interview, say: 'The 10MB threshold is a performance heuristic, not an absolute rule. Compliance requirements can override it. HIPAA may require data to pass through certified inspection systems before storage — audit logging, PHI scanning, or encryption with specific key management. In these cases, proxying through compliant middleware is necessary even for large files. You accept the performance trade-off for regulatory compliance.'",
    proTip: null,
  },
  // q33 — Cross-subtopic: Chunked Uploads × Event Notifications
  {
    id: "q33",
    subtopic: "Chunked Uploads × Event Notifications",
    question:
      "You configure S3 event notifications to trigger on s3:ObjectCreated:*. During a multipart upload of a 2GB video with 400 parts, your event handler receives hundreds of events. Your database status flickers between states. What's happening and how do you fix it?",
    options: [
      "S3 fires events for individual multipart parts as they upload. You should filter for only s3:ObjectCreated:CompleteMultipartUpload events, which fire only when the final assembly step succeeds — not for individual parts.",
      "S3 is sending duplicate events due to eventual consistency, and you need to add idempotency keys to your event handler.",
      "The 400 parts are being treated as 400 separate files. You need to increase the S3 event batching window to aggregate them into a single notification.",
      "Your event handler is too slow and events are being retried before processing completes. Increase the visibility timeout on your SQS queue.",
    ],
    correctIndex: 0,
    explanation:
      "This is a cross-subtopic question bridging chunked uploads and event notifications. If you subscribe to all ObjectCreated events, you may receive events for individual part uploads during multipart. The fix is subscribing to the specific CompleteMultipartUpload event, which only fires after the client calls the completion endpoint and S3 assembles the final object. This aligns with the article's emphasis that 'until this completion succeeds, you have parts in storage but no accessible file.' Options B, C, and D describe real but unrelated concerns.",
    interviewScript:
      "In your interview, say: 'The issue is event filter granularity. s3:ObjectCreated:* captures all creation events including individual multipart parts. We need to filter for s3:ObjectCreated:CompleteMultipartUpload specifically — this only fires after the completion API call succeeds and parts are assembled into the final object. This aligns with our state model: we only transition from pending to completed when the full file exists.'",
    proTip:
      "This is a great cross-topic question that tests understanding of how multipart upload lifecycle interacts with event notifications — a common production gotcha.",
  },
  // q34 — Cross-subtopic: CDN × Abuse Prevention
  {
    id: "q34",
    subtopic: "CDN Signatures × Abuse Prevention",
    question:
      "Your social media platform serves user-uploaded images through CloudFront with signed URLs that expire in 24 hours. A user uploads an image that passes initial content moderation, gets a signed download URL, then the content moderation system retroactively flags the image as policy-violating 6 hours later. Users who received the signed URL can still access the image for 18 more hours. How do you immediately revoke access?",
    options: [
      "Regenerate all CloudFront key pairs, which invalidates all existing signed URLs across the platform.",
      "Delete the image from the S3 origin. When CloudFront edge caches expire and try to refetch from origin, they'll get a 404. For immediate revocation, also create a CloudFront invalidation for the image's path to purge it from all edge caches.",
      "Update the S3 bucket policy to deny access to that specific object key, which CloudFront will respect on the next request.",
      "Reduce all future signed URL expiry times to 5 minutes. This doesn't fix the current URLs but prevents future issues.",
    ],
    correctIndex: 1,
    explanation:
      "This cross-subtopic question bridges CDN delivery with abuse prevention. Signed URLs grant time-limited access, but you need an emergency revocation mechanism. Deleting from S3 origin handles new requests after cache expiry, but CDN edge caches still serve the cached copy. CloudFront invalidation purges the content from all edge caches immediately. Combined, these two actions provide immediate revocation. Option A is nuclear — it breaks all URLs for all users. Option C doesn't work because CloudFront uses its own auth. Option D doesn't address the current problem.",
    interviewScript:
      "In your interview, say: 'We need two actions for immediate revocation. First, delete the object from S3 origin so no new cache fills can occur. Second, create a CloudFront cache invalidation for that specific path to purge it from all edge locations. This combination ensures neither cached nor origin-fetched copies are accessible. For future architecture, shorter signed URL expiry reduces the window of exposure for retroactively flagged content.'",
    proTip: null,
  },
];

const SUBTOPICS_ORDER = [
  "Blob Storage Fundamentals",
  "Server Proxy Bottleneck",
  "Presigned URLs (Upload)",
  "Download & CDN Signatures",
  "Resumable / Chunked Uploads",
  "Upload Completion & Assembly",
  "State Synchronization",
  "Event Notifications & Reconciliation",
  "Abuse Prevention",
  "Metadata Handling",
  "Download Optimization",
  "Cloud Provider Terminology",
  "When to Use / When NOT to Use",
  "Chunked Uploads × Event Notifications",
  "CDN Signatures × Abuse Prevention",
];

const CONFIDENCE_LEVELS = ["Guessing", "Somewhat Sure", "Very Confident"];

const GRADES = [
  { min: 90, label: "Staff-ready", desc: "You'd ace this topic", color: "text-emerald-400" },
  { min: 75, label: "Strong Senior", desc: "Solid, minor gaps to close", color: "text-blue-400" },
  { min: 60, label: "SDE2-level", desc: "Review the weak areas below", color: "text-yellow-400" },
  { min: 0, label: "Needs deep review", desc: "Revisit the fundamentals", color: "text-red-400" },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  return GRADES.find((g) => pct >= g.min);
}

function getSubtopicStats(answers) {
  const stats = {};
  answers.forEach(({ question, correct }) => {
    const st = question.subtopic;
    if (!stats[st]) stats[st] = { total: 0, correct: 0 };
    stats[st].total++;
    if (correct) stats[st].correct++;
  });
  return stats;
}

export default function LargeBlobsQuiz({ quizSlug = 'patterns-large-blobs' }) {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("shuffled");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [flagged, setFlagged] = useState(new Set());
  const [skipped, setSkipped] = useState([]);
  const [timer, setTimer] = useState(90);
  const [timedOut, setTimedOut] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [resultsTab, setResultsTab] = useState("overview");
  const timerRef = useRef(null);

  const { attemptId, saveAnswer: persistAnswer, completeQuiz, resumeData, startNewAttempt, resumeAttempt, isResuming } = useQuizProgress(quizSlug, QUESTIONS.length);
  const totalTimerRef = useRef(null);

  const startQuiz = (chosenMode) => {
    const m = chosenMode || mode;
    let qs;
    if (m === "shuffled") {
      qs = shuffleArray(QUESTIONS);
    } else {
      qs = [...QUESTIONS].sort((a, b) => {
        const ai = SUBTOPICS_ORDER.indexOf(a.subtopic);
        const bi = SUBTOPICS_ORDER.indexOf(b.subtopic);
        return ai - bi;
      });
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers([]);
    setFlagged(new Set());
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setScreen("quiz");
    startNewAttempt(qs.map(q => q.id));
  };

  const startRetry = (questionList) => {
    const qs = shuffleArray(questionList);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setConfidence(null);
    setSubmitted(false);
    setAnswers([]);
    setFlagged(new Set());
    setSkipped([]);
    setTimer(90);
    setTimedOut(false);
    setTotalTime(0);
    setScreen("quiz");
  };

  // Per-question timer
  useEffect(() => {
    if (screen !== "quiz" || submitted) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setSubmitted(true);
          const tq = questions[currentIdx];
          setAnswers((prev) => [
            ...prev,
            {
              question: tq,
              selected: null,
              confidence: null,
              correct: false,
              timedOut: true,
            },
          ]);
          if (tq) {
            persistAnswer(tq.id, {
              selectedIndex: null,
              correctIndex: tq.correctIndex,
              isCorrect: false,
              confidence: null,
              timedOut: true,
            });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, submitted, currentIdx, questions]);

  // Total time tracker
  useEffect(() => {
    if (screen !== "quiz") {
      clearInterval(totalTimerRef.current);
      return;
    }
    totalTimerRef.current = setInterval(() => {
      setTotalTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(totalTimerRef.current);
  }, [screen]);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || confidence === null) return;
    clearInterval(timerRef.current);
    const q = questions[currentIdx];
    const correct = selectedOption === q.correctIndex;
    setSubmitted(true);
    setAnswers((prev) => [
      ...prev,
      { question: q, selected: selectedOption, confidence, correct, timedOut: false },
    ]);
    persistAnswer(q.id, {
      selectedIndex: selectedOption,
      correctIndex: q.correctIndex,
      isCorrect: correct,
      confidence,
      timedOut: false,
    });
  }, [selectedOption, confidence, currentIdx, questions, persistAnswer]);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(90);
    } else if (skipped.length > 0) {
      // Put skipped questions at end
      setQuestions(skipped);
      setSkipped([]);
      setCurrentIdx(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(90);
    } else {
      clearInterval(totalTimerRef.current);
      const correctCount = answers.filter(a => a.correct).length;
      completeQuiz({ correct: correctCount, total: answers.length }, totalTime);
      setScreen("results");
    }
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    setSkipped((prev) => [...prev, questions[currentIdx]]);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(90);
    } else if (skipped.length > 0) {
      const allSkipped = [...skipped, questions[currentIdx]];
      setQuestions(allSkipped);
      setSkipped([]);
      setCurrentIdx(0);
      setSelectedOption(null);
      setConfidence(null);
      setSubmitted(false);
      setTimedOut(false);
      setTimer(90);
    } else {
      clearInterval(totalTimerRef.current);
      const correctCount = answers.filter(a => a.correct).length;
      completeQuiz({ correct: correctCount, total: answers.length }, totalTime);
      setScreen("results");
    }
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      const qId = questions[currentIdx].id;
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (screen !== "quiz") return;
    const handler = (e) => {
      if (submitted) {
        if (e.key === "Enter") handleNext();
        return;
      }
      const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined) setSelectedOption(idx);
      if (e.key === "Enter" && selectedOption !== null && confidence !== null) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submitted, selectedOption, confidence, handleSubmit]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const totalQuestions = answers.length;
  const totalCorrect = answers.filter((a) => a.correct).length;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Subtopic coverage for landing
  const subtopicCounts = {};
  QUESTIONS.forEach((q) => {
    subtopicCounts[q.subtopic] = (subtopicCounts[q.subtopic] || 0) + 1;
  });

  // LANDING SCREEN
  if (screen === "landing") {
    const estMinutes = Math.round((QUESTIONS.length * 75) / 60);
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-900/40 border border-red-700/50 rounded-full px-4 py-1.5 mb-4">
              <Target size={14} className="text-red-400" />
              <span className="text-red-300 text-sm font-medium">FAANG SDE2 — Hard</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Handling Large Blobs
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
              Presigned URLs, chunked uploads, CDN delivery, state synchronization, and abuse
              prevention — the full pattern for large file handling in distributed systems.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-400">{QUESTIONS.length}</div>
              <div className="text-xs text-gray-500 mt-1">Questions</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-400">~{estMinutes}m</div>
              <div className="text-xs text-gray-500 mt-1">Est. Time</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-2xl font-bold text-emerald-400">
                {Object.keys(subtopicCounts).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Subtopics</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 size={14} /> Coverage Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {Object.entries(subtopicCounts).map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between px-3 py-1.5 bg-gray-800/50 rounded-lg"
                >
                  <span className="text-xs text-gray-400 truncate mr-2">{name}</span>
                  <span className="text-xs font-mono text-blue-400 whitespace-nowrap">
                    {count}q
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMode("ordered");
                startQuiz("ordered");
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-5 py-3 transition-colors"
            >
              <List size={18} />
              <span className="font-medium">Section Order</span>
            </button>
            <button
              onClick={() => {
                setMode("shuffled");
                startQuiz("shuffled");
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 transition-colors font-medium"
            >
              <Shuffle size={18} />
              <span>Shuffled (Recommended)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    const q = questions[currentIdx];
    const progress = ((answers.length) / (QUESTIONS.length)) * 100;
    const timerColor =
      timer <= 15
        ? "text-red-400"
        : timer <= 30
        ? "text-amber-400"
        : "text-gray-300";
    const timerBg =
      timer <= 15
        ? "bg-red-900/30 border-red-800/50"
        : timer <= 30
        ? "bg-amber-900/30 border-amber-800/50"
        : "bg-gray-800/50 border-gray-700/50";

    const optionLabels = ["A", "B", "C", "D"];

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {answers.length + 1} / {QUESTIONS.length}
                {skipped.length > 0 && (
                  <span className="text-amber-400 ml-1">({skipped.length} skipped)</span>
                )}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${timerBg}`}
            >
              <Clock size={14} className={timerColor} />
              <span className={`font-mono text-sm font-bold ${timerColor}`}>
                {formatTime(timer)}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{formatTime(totalTime)}</span>
          </div>
          <div className="max-w-3xl mx-auto mt-2">
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-start justify-center p-4 pt-6 overflow-auto">
          <div className="max-w-3xl w-full">
            {/* Subtopic tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-purple-900/40 border border-purple-700/40 text-purple-300 px-2.5 py-1 rounded-full">
                {q.subtopic}
              </span>
              <button
                onClick={toggleFlag}
                className={`p-1.5 rounded-lg transition-colors ${
                  flagged.has(q.id)
                    ? "bg-amber-900/40 text-amber-400"
                    : "bg-gray-800/50 text-gray-500 hover:text-gray-300"
                }`}
                title="Flag for review"
              >
                <Flag size={14} />
              </button>
            </div>

            {/* Question text */}
            <h2 className="text-lg font-medium leading-relaxed mb-6">{q.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                let borderColor = "border-gray-800 hover:border-gray-600";
                let bg = "bg-gray-900";
                let labelBg = "bg-gray-800 text-gray-400";

                if (submitted || timedOut) {
                  if (i === q.correctIndex) {
                    borderColor = "border-emerald-600";
                    bg = "bg-emerald-950/30";
                    labelBg = "bg-emerald-800 text-emerald-200";
                  } else if (i === selectedOption && i !== q.correctIndex) {
                    borderColor = "border-red-600";
                    bg = "bg-red-950/30";
                    labelBg = "bg-red-800 text-red-200";
                  } else {
                    borderColor = "border-gray-800/50";
                    bg = "bg-gray-900/50";
                  }
                } else if (i === selectedOption) {
                  borderColor = "border-blue-500";
                  bg = "bg-blue-950/20";
                  labelBg = "bg-blue-700 text-blue-100";
                }

                return (
                  <button
                    key={i}
                    onClick={() => !submitted && !timedOut && setSelectedOption(i)}
                    disabled={submitted || timedOut}
                    className={`w-full text-left ${bg} border ${borderColor} rounded-xl p-4 transition-all flex gap-3`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${labelBg}`}
                    >
                      {optionLabels[i]}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Confidence selector (pre-submit) */}
            {!submitted && !timedOut && selectedOption !== null && (
              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2">How confident are you?</p>
                <div className="flex gap-2">
                  {CONFIDENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfidence(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        confidence === level
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons (pre-submit) */}
            {!submitted && !timedOut && (
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={selectedOption === null || confidence === null}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition-colors ${
                    selectedOption !== null && confidence !== null
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  Submit
                </button>
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors text-gray-400 text-sm"
                >
                  <SkipForward size={14} />
                  Skip
                </button>
              </div>
            )}

            {/* Explanation (post-submit) */}
            {(submitted || timedOut) && (
              <div className="space-y-4 mb-6">
                {timedOut && !answers[answers.length - 1]?.selected && answers[answers.length - 1]?.selected !== 0 && (
                  <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-1">
                      <Clock size={14} /> Time's Up!
                    </div>
                    <p className="text-sm text-gray-400">This question was marked as incorrect.</p>
                  </div>
                )}

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-2">
                    <BookOpen size={14} /> Explanation
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mb-2">
                    <MessageSquare size={14} /> Interview Script
                  </div>
                  <p className="text-sm text-indigo-200/80 leading-relaxed italic">
                    {q.interviewScript}
                  </p>
                </div>

                {q.proTip && (
                  <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-amber-400 font-medium text-sm mb-2">
                      <Lightbulb size={14} /> Pro Tip
                    </div>
                    <p className="text-sm text-amber-200/80 leading-relaxed">{q.proTip}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 font-medium transition-colors"
                >
                  {currentIdx < questions.length - 1 || skipped.length > 0 ? (
                    <>
                      Next <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      View Results <Trophy size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const grade = getGrade(pct);
    const subtopicStats = getSubtopicStats(answers);
    const luckyGuesses = answers.filter((a) => a.correct && a.confidence === "Guessing");
    const overconfidentMisses = answers.filter(
      (a) => !a.correct && a.confidence === "Very Confident"
    );
    const incorrect = answers.filter((a) => !a.correct);
    const flaggedAnswers = answers.filter((a) => flagged.has(a.question.id));
    const weakSubtopics = Object.entries(subtopicStats).filter(
      ([, s]) => s.total > 0 && (s.correct / s.total) < 0.7
    );
    const weakQuestions = answers.filter((a) =>
      weakSubtopics.some(([st]) => a.question.subtopic === st)
    );

    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "confidence", label: "Confidence" },
      { id: "incorrect", label: `Missed (${incorrect.length})` },
      { id: "flagged", label: `Flagged (${flaggedAnswers.length})` },
    ];

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Score header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gray-900 border-2 border-gray-700 mb-4">
              <div>
                <div className="text-3xl font-bold">{pct}%</div>
                <div className="text-xs text-gray-500">
                  {totalCorrect}/{totalQuestions}
                </div>
              </div>
            </div>
            <div className={`text-xl font-bold ${grade.color}`}>{grade.label}</div>
            <p className="text-gray-400 text-sm mt-1">{grade.desc}</p>
            <p className="text-xs text-gray-600 mt-2 font-mono">
              Completed in {formatTime(totalTime)}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setResultsTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  resultsTab === tab.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {resultsTab === "overview" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Per-Subtopic Breakdown</h3>
              {Object.entries(subtopicStats).map(([name, s]) => {
                const p = Math.round((s.correct / s.total) * 100);
                const barColor =
                  p >= 80 ? "bg-emerald-500" : p >= 60 ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={name} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300 truncate">{name}</span>
                      <span className="text-xs font-mono text-gray-400">
                        {s.correct}/{s.total} ({p}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`${barColor} h-2 rounded-full transition-all`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {resultsTab === "confidence" && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-3">
                  <AlertTriangle size={14} /> Lucky Guesses ({luckyGuesses.length})
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Correct answers where you were just guessing — hidden weak spots.
                </p>
                {luckyGuesses.length === 0 ? (
                  <p className="text-xs text-gray-600 italic">None — you knew what you knew!</p>
                ) : (
                  <div className="space-y-2">
                    {luckyGuesses.map((a) => (
                      <div
                        key={a.question.id}
                        className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3"
                      >
                        <span className="text-xs text-amber-300">{a.question.subtopic}</span>
                        <p className="text-sm text-gray-300 mt-1">{a.question.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
                  <XCircle size={14} /> Overconfident Misses ({overconfidentMisses.length})
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Wrong answers where you were very confident — dangerous misconceptions.
                </p>
                {overconfidentMisses.length === 0 ? (
                  <p className="text-xs text-gray-600 italic">
                    None — your confidence was well-calibrated!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {overconfidentMisses.map((a) => (
                      <div
                        key={a.question.id}
                        className="bg-red-950/20 border border-red-800/30 rounded-xl p-3"
                      >
                        <span className="text-xs text-red-300">{a.question.subtopic}</span>
                        <p className="text-sm text-gray-300 mt-1">{a.question.question}</p>
                        <p className="text-xs text-gray-500 mt-2">{a.question.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {resultsTab === "incorrect" && (
            <div className="space-y-4">
              {incorrect.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Perfect score! No missed questions.</p>
              ) : (
                incorrect.map((a) => {
                  const optLabels = ["A", "B", "C", "D"];
                  return (
                    <div
                      key={a.question.id}
                      className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">
                          {a.question.subtopic}
                        </span>
                        {a.timedOut && (
                          <span className="text-xs bg-red-900/40 text-red-300 px-2 py-0.5 rounded-full">
                            Timed Out
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-3">{a.question.question}</p>
                      {a.selected !== null && (
                        <p className="text-xs text-red-400 mb-1">
                          Your answer: {optLabels[a.selected]} —{" "}
                          {a.question.options[a.selected].substring(0, 80)}...
                        </p>
                      )}
                      <p className="text-xs text-emerald-400 mb-3">
                        Correct: {optLabels[a.question.correctIndex]} —{" "}
                        {a.question.options[a.question.correctIndex].substring(0, 80)}...
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {a.question.explanation}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {resultsTab === "flagged" && (
            <div className="space-y-4">
              {flaggedAnswers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No flagged questions. Use the flag button during the quiz to bookmark questions.
                </p>
              ) : (
                flaggedAnswers.map((a) => (
                  <div
                    key={a.question.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">
                        {a.question.subtopic}
                      </span>
                      <Flag size={12} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-medium mb-2">{a.question.question}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {a.question.explanation}
                    </p>
                    {a.question.interviewScript && (
                      <p className="text-xs text-indigo-300/70 mt-2 italic">
                        {a.question.interviewScript}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Retry buttons */}
          <div className="mt-8 space-y-3 pb-8">
            {incorrect.length > 0 && (
              <button
                onClick={() =>
                  startRetry(incorrect.map((a) => a.question))
                }
                className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded-xl px-5 py-3 text-red-300 font-medium transition-colors"
              >
                <RotateCcw size={16} />
                Retry Missed Questions ({incorrect.length})
              </button>
            )}
            {weakSubtopics.length > 0 && weakQuestions.length > 0 && (
              <button
                onClick={() =>
                  startRetry(weakQuestions.map((a) => a.question))
                }
                className="w-full flex items-center justify-center gap-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800/50 rounded-xl px-5 py-3 text-amber-300 font-medium transition-colors"
              >
                <Target size={16} />
                Retry Weak Subtopics ({weakSubtopics.length} subtopics, {weakQuestions.length} questions)
              </button>
            )}
            <button
              onClick={() => setScreen("landing")}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-5 py-3 text-gray-300 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
