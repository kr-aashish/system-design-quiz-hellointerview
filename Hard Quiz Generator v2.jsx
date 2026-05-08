/*
═══════════════════════════════════════════════════════
  COVERAGE MANIFEST — LLD Design Principles Quiz v2
═══════════════════════════════════════════════════════
  Total: 39 questions | 12 Parts | 35 concept IDs
  Formats: 30 MCQ · 6 fill-in-blank · 3 short-answer
  Tiers: L1×12 · L2×10 · L3×10 · L4×6 · L5×1

  Part A (A1–A4) — A_q01(A1), A_q02(A3,A4)
    L3 skipped: application would require inventing substrate the source doesn't provide
    L4/L5 skipped: no trade-offs or cross-concept bridges in overview

  Part B (B1–B4) — B_q01(B3), B_q02(B2,B3), B_q03(B3)
    L2 skipped: no distinct adjacent concept worth separating at L2

  Part C (C1–C6) — C_q01(C4), C_q02(C3,C4), C_q03(C5,C6), C_q04(C5,C6,B1)
    L3 skipped: C_q04 at L5 already covers application + synthesis

  Part D (D1–D4) — D_q01(D1,D2), D_q02(D3,D4), D_q03(D1,D2,D3)
    L4 skipped: source names the problem but does not present alternatives to evaluate

  Part E (E1–E4) — E_q01(E1,E2), E_q02(E3,E4), E_q03(E1,E2,E3)
    L4/L5 skipped: source presents one pattern, no alternatives or trade-offs

  Part F (F1–F5) — F_q01(F1), F_q02(F4,F5), F_q03(F2,F3), F_q04(F2,F3)
    L5 skipped: no cross-concept bridge in source for LoD

  Part G (G1–G4) — G_q01(G1), G_q02(G2,G3), G_q03(G3,G4)
    L4 skipped: KISS-vs-SOLID is L3 scenario; source doesn't give deeper alternatives

  Part H (H1–H4) — H_q01(H1), H_q02(H2,H3), H_q03(H3,H4)
    L4/L5 skipped: no alternatives or bridges beyond the example

  Part I (I1–I5) — I_q01(I1,I2), I_q02(I3,I4), I_q03(I5)
    L4/L5 skipped: source presents OCP pattern, not trade-offs against it

  Part J (J1–J6) — J_q01(J1,J2), J_q02(J2,J3), J_q03(J3,J4,J5), J_q04(J2,J6)
    L5 skipped: no cross-concept synthesis in source for LSP

  Part K (K1–K5) — K_q01(K1,K2), K_q02(K3,K4,K5), K_q03(K5)
    L4/L5 skipped: source presents ISP pattern, not alternatives

  Part L (L1–L6) — L_q01(L1), L_q02(L6), L_q03(L1,L5), L_q04(L2)
    L5 skipped: cross-concept link between DIP and OCP not explicitly drawn in source

  Cross-Part bridge: C_q04 — CROSS (C5,C6,B1) | DRY↔KISS synthesis

  Spot-check:
    "adding a new payment method means modifying code in five places" → B_q03
    "Fluent interfaces like builder.setName are fine because they return the same object type" → F_q02
    "DIP is a design principle, while dependency injection is a technique for achieving it" → L_q02
═══════════════════════════════════════════════════════
*/

import { useState } from "react";

const TIER_META = {
  L1: { label: "L1 Recall",        color: "#10b981", bg: "#052e16" },
  L2: { label: "L2 Comprehension", color: "#06b6d4", bg: "#082f49" },
  L3: { label: "L3 Application",   color: "#3b82f6", bg: "#1e1b4b" },
  L4: { label: "L4 Analysis",      color: "#f59e0b", bg: "#2d1d00" },
  L5: { label: "L5 Transfer",      color: "#ef4444", bg: "#2d0707" },
};

const TIMERS = { L1: 60, L2: 90, L3: 90, L4: 120, L5: 150 };

const QUESTIONS = [
  // ─── PART A ────────────────────────────────────────────────────
  {
    id: "A_q01", part: "A — Overview", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["A1"],
    prompt: "You're designing a parking lot system and face a decision: should the Ticket class handle both fee calculation and receipt formatting? Design principles are most valuable in this moment because they:",
    options: [
      "Give you a vocabulary to explain your design choice to the interviewer after the fact",
      "Ensure your design matches patterns that experienced engineers will immediately recognize",
      "Tell you exactly which pattern to apply based on the problem domain and class count",
      "Give you a framework to make and explain decisions in the moment, before the design solidifies"
    ],
    correctIndex: 3,
    explanation: "Principles are decision-making tools for the moment — not a post-hoc vocabulary or a rigid rulebook. The source: 'Design principles give you a framework to make those calls and explain them.'"
  },
  {
    id: "A_q02", part: "A — Overview", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["A3", "A4"],
    prompt: "Candidate A eliminates all duplicated logic in their chess game. Candidate B carefully models a Piece hierarchy so Rook, Bishop, and Queen can substitute for Piece everywhere. Which candidate is exercising the category of principles that gets the most attention in LLD interviews?",
    options: [
      "Candidate A — DRY is foundational and all structural principles derive from it",
      "Candidate B — OOD principles dominate because LLD problems expect class hierarchy design",
      "Both equally — the two categories are different framings of the same core ideas",
      "Neither — interviewers weight reasoning over category classification"
    ],
    correctIndex: 1,
    explanation: "The source is explicit: 'OOD principles get more attention because most LLD problems expect you to design class hierarchies.' Candidate B is exercising LSP, which is firmly in that OOD category."
  },

  // ─── PART B ────────────────────────────────────────────────────
  {
    id: "B_q01", part: "B — KISS", tier: "L1", depth: "Recall",
    format: "blank", style: "Definition / Identification", conceptIds: ["B3"],
    prompt: "KISS says start with the simplest solution. Add complexity only when ____.",
    correctAnswer: "simplicity stops working",
    acceptedAnswers: ["simplicity stops working", "simplicity fails", "the simple solution fails", "simple solution stops working", "it stops working", "simple stops working"],
    explanation: "The exact threshold from the source: 'The time to add complexity is when simplicity stops working.'"
  },
  {
    id: "B_q02", part: "B — KISS", tier: "L3", depth: "Application",
    format: "mcq", style: "Anti-Pattern Identification", conceptIds: ["B2", "B3"],
    prompt: "A candidate designing a ride-sharing system opens with a DriverFactory, a RideBuilder, and a SurgeDecorator — before writing a single domain class. 'For extensibility,' they say. What does this most clearly violate?",
    options: [
      "YAGNI — the patterns are extensions no current requirement requests",
      "DRY — three patterns for one domain implies logic will be scattered and repeated",
      "KISS — patterns were introduced before the simple approach was tried and found insufficient",
      "OCP — none of the pattern classes implement a common extension interface yet"
    ],
    correctIndex: 2,
    explanation: "KISS is violated because complexity arrived before simplicity stopped working. Source: 'Candidates often over-engineer because they want to show off knowledge of design patterns. Interviewers notice this.'"
  },
  {
    id: "B_q03", part: "B — KISS", tier: "L4", depth: "Analysis",
    format: "mcq", style: "Anti-Pattern Identification", conceptIds: ["B3"],
    prompt: "Which pair of observations — drawn from the signals the content actually names — most clearly justifies refactoring a class for complexity?",
    options: [
      "The class has 12 public methods and is referenced by five other files",
      "The class spans ~500 lines with ~10 responsibilities and a single change requires edits in 5 places",
      "Two senior engineers disagree about ownership and no one can name a single responsibility",
      "The class uses three design patterns and its unit tests require more setup than the tests themselves"
    ],
    correctIndex: 1,
    explanation: "These are the two explicit signals from the source: '500 lines with ten different responsibilities' and 'adding a new payment method means modifying code in five places.' Both together warrant adding complexity."
  },

  // ─── PART C ────────────────────────────────────────────────────
  {
    id: "C_q01", part: "C — DRY", tier: "L1", depth: "Recall",
    format: "blank", style: "Definition / Identification", conceptIds: ["C4"],
    prompt: "When deciding whether to extract shared logic, the key question is whether the logic is conceptually the same — not just ____ similar.",
    correctAnswer: "textually",
    acceptedAnswers: ["textually", "syntactically", "visually", "superficially", "on the surface"],
    explanation: "Direct from the source: 'The key is whether the logic is conceptually the same, not just textually similar.'"
  },
  {
    id: "C_q02", part: "C — DRY", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["C3", "C4"],
    prompt: "An email service and a logging service both share an identical five-line timestamp-formatting function. Email uses it for user-facing receipts; the logger uses it for machine-parseable audit trails. What is the strongest argument for leaving both copies in place?",
    options: [
      "Five lines is below the complexity threshold where DRY savings outweigh abstraction overhead",
      "They are in different bounded contexts, so sharing code would add deployment coupling",
      "The logic is textually similar but serves different conceptual purposes — coupling them risks one change silently breaking the other",
      "Timestamp formatting is infrastructure code, and DRY applies primarily to business logic"
    ],
    correctIndex: 2,
    explanation: "Source: 'If two pieces of code look similar but serve different purposes, sometimes duplication is fine. Forcing them to share code can create artificial coupling where changes to one break the other.'"
  },
  {
    id: "C_q03", part: "C — DRY", tier: "L4", depth: "Analysis",
    format: "mcq", style: "Trade-off Reasoning", conceptIds: ["C5", "C6"],
    prompt: "Two controllers share near-identical 50-line input sanitization. A junior wants to extract it now. Which response best demonstrates a senior's understanding of the DRY–KISS tension?",
    options: [
      "DRY wins for anything over ~10 lines — 50 lines is above the threshold, extract now",
      "Start co-located, acknowledge the duplication explicitly, and propose extracting when it appears a third or fourth time — balancing simplicity against maintenance risk",
      "KISS and DRY never actually conflict — sharing logic is always the simpler solution once it exists in multiple places",
      "Defer DRY to a future refactoring sprint — it's cleanup, not a design decision for the initial pass"
    ],
    correctIndex: 1,
    explanation: "The source models this framing: 'I'm going to start by keeping it in the User class to avoid adding unnecessary complexity early. If we see it duplicated three or four times, we can pull it into a shared validator.' Principle balance, not blind rule-following."
  },
  {
    id: "C_q04", part: "C — DRY", tier: "L5", depth: "Transfer",
    format: "short", style: "Cross-Concept Synthesis", conceptIds: ["C5", "C6", "B1"],
    prompt: "You're in a mock LLD interview. Two services share nearly identical validation logic. In 2–3 sentences, articulate the DRY–KISS tradeoff to the interviewer without sounding like you're blindly applying one rule.",
    correctAnswer: "model",
    modelAnswer: "Acknowledge that DRY says to consolidate repeated logic for single-point maintenance, but KISS says the simplest approach may be to keep it co-located for now to avoid premature abstraction. Propose starting with duplication in place, and extracting to a shared validator if the logic appears in three or more places. This shows you're balancing competing principles rather than mechanically following one rule.",
    keyPoints: [
      "Acknowledges both DRY and KISS by concept (not just by name)",
      "Proposes a threshold for extraction (3+ occurrences or similar)",
      "Avoids presenting one principle as always winning"
    ],
    explanation: "The source explicitly models this: 'The right move in an interview is to acknowledge both sides... This shows you can balance competing principles instead of blindly following rules.'"
  },

  // ─── PART D ────────────────────────────────────────────────────
  {
    id: "D_q01", part: "D — YAGNI", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["D1", "D2"],
    prompt: "A team designing a food-delivery app adds drone delivery and subscription billing because 'those features will definitely be needed in three months.' No requirements for either exist yet. What core problem does YAGNI name?",
    options: [
      "The team violates SRP by adding drone logic before the core delivery class is stable",
      "Adding unrequested features bypasses the product roadmap and creates scope creep",
      "Drone delivery should be an extension point, not an implementation, until a later sprint",
      "Future requirement guesses are usually wrong, leaving complexity for scenarios that never materialize"
    ],
    correctIndex: 3,
    explanation: "YAGNI's core: 'The problem with building for future requirements is you usually guess wrong. You add complexity for scenarios that never happen, and when the actual new requirement comes, it's different from what you prepared for.'"
  },
  {
    id: "D_q02", part: "D — YAGNI", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["D3", "D4"],
    prompt: "An interviewer asks: 'How would you extend your parking lot to support EV charging?' You sketch a Chargeable interface in response, but do not implement it. Which nuance of YAGNI does this demonstrate?",
    options: [
      "YAGNI means design with extension in mind but implement only what's currently required",
      "YAGNI forbids all interface design until a concrete requirement exists — sketching is still a violation",
      "YAGNI says speculative interfaces are acceptable; only speculative implementations are waste",
      "YAGNI only applies to full feature implementations, not to high-level architectural sketches"
    ],
    correctIndex: 0,
    explanation: "Source: 'This principle doesn't mean never think ahead — it means don't build ahead. Design with extension in mind, but only implement what's needed now.' The interviewer's 'extend' question is explicitly the cue to discuss, not to pre-build."
  },
  {
    id: "D_q03", part: "D — YAGNI", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["D1", "D2", "D3"],
    prompt: "You're designing a library checkout system covering search, borrow, and return. You're about to add a RecommendationEngine because you're confident it'll be requested soon. What does YAGNI prescribe?",
    options: [
      "Add a RecommendationEngine interface with an empty implementation stub for future engineers",
      "Add a placeholder getRecommendations() method on Book to minimize changes when the feature arrives",
      "Skip the recommendation engine entirely and implement only search, borrow, and return",
      "Add the engine behind a feature flag so it can be activated without a new deployment"
    ],
    correctIndex: 2,
    explanation: "YAGNI is direct: 'Build what you need now, not what you might need later.' The source: 'don't add support for valet parking and electric vehicle charging stations unless the requirements specifically mention them.'"
  },

  // ─── PART E ────────────────────────────────────────────────────
  {
    id: "E_q01", part: "E — Separation of Concerns", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["E1", "E2"],
    prompt: "A UI component queries the database directly to avoid an extra network round trip. Which principle does this violate, and what coupling does it create?",
    options: [
      "SRP — the component now has two responsibilities: rendering the view and fetching data",
      "DRY — the query duplicates data-fetching logic that already lives in the data access layer",
      "Separation of Concerns — the UI layer now knows how data is stored, coupling two layers that should be independent",
      "DIP — the component depends on a concrete database driver rather than an abstraction"
    ],
    correctIndex: 2,
    explanation: "SoC: 'Your UI layer shouldn't contain business logic. Your business logic shouldn't know how data is stored.' Direct DB access from the UI couples those layers — a change in storage strategy now requires touching the UI."
  },
  {
    id: "E_q02", part: "E — Separation of Concerns", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["E3", "E4"],
    prompt: "The refactored TicTacToe uses Board, Display, and InputHandler. A new requirement arrives: replace terminal output with a GUI renderer. Which part changes, and what architectural property makes this isolated?",
    options: [
      "Board changes — only Board holds the game state that the GUI needs to render",
      "TicTacToe's play() changes — it orchestrates all three and must wire the new GUI in",
      "Only Display changes, because each concern is isolated and doesn't know the others' internals",
      "InputHandler and Display both change — GUI input and rendering are the same concern"
    ],
    correctIndex: 2,
    explanation: "Source: 'If you want to switch from console input to a GUI, you only touch InputHandler. If you want to change how the board displays, you only modify Display.' Each change is isolated to one class."
  },
  {
    id: "E_q03", part: "E — Separation of Concerns", tier: "L3", depth: "Application",
    format: "short", style: "Self-Explanation / Feynman", conceptIds: ["E1", "E2", "E3"],
    prompt: "In your own words: in the bad TicTacToe example, everything is tangled in one method. If the requirement changes to support network multiplayer (input arrives over a socket instead of stdin), what specific pain would you hit? How does the refactored design eliminate that pain?",
    correctAnswer: "model",
    modelAnswer: "In the bad design, display output, input handling, and game rules are all tangled in one method — adding socket input means carefully editing that method while risking accidental breaks to win detection and display rendering. The refactored design isolates all input handling in InputHandler, so swapping to socket input only touches that class; Board and Display are completely unaffected.",
    keyPoints: [
      "Identifies tangling as the root cause of the problem",
      "Explains the risk of breaking other concerns when editing the tangled method",
      "States that the refactored design limits the change to InputHandler only"
    ],
    explanation: "SoC's payoff: 'Each change is isolated to one class. This is what lets you test each part of the system independently.'"
  },

  // ─── PART F ────────────────────────────────────────────────────
  {
    id: "F_q01", part: "F — Law of Demeter", tier: "L1", depth: "Recall",
    format: "blank", style: "Definition / Identification", conceptIds: ["F1"],
    prompt: "The Law of Demeter is also known as the principle of ____ knowledge.",
    correctAnswer: "least",
    acceptedAnswers: ["least", "minimum", "minimal"],
    explanation: "Direct from the source: 'Also called the principle of least knowledge.'"
  },
  {
    id: "F_q02", part: "F — Law of Demeter", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["F4", "F5"],
    prompt: "Pattern 1: `user.getAccount().getSubscription().getExpiryDate()`. Pattern 2: `query.where(\"active\").limit(10).orderBy(\"name\")`. Which violates the Law of Demeter, and why?",
    options: [
      "Pattern 1 — it traverses multiple different object types, exposing the internal structure of three objects",
      "Both — any method chain longer than two calls couples the caller to intermediate internal structure",
      "Pattern 2 — chaining always means reaching through one object to invoke another, violating LoD",
      "Neither — LoD applies to direct field access, not to method calls regardless of chain depth"
    ],
    correctIndex: 0,
    explanation: "Source: 'Fluent interfaces like builder.setName(\"John\").setAge(30).build() are fine because they return the same object type. The issue is specifically when chaining leaks internal structure by traversing through multiple different object types.' Pattern 2 returns the same object; Pattern 1 hops across three different types."
  },
  {
    id: "F_q03", part: "F — Law of Demeter", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["F2", "F3"],
    prompt: "A BillingService calls `invoice.getOrder().getCustomer().getBillingAddress().getCity()`. An engineer wants to fix the LoD violation. Which refactoring is correct?",
    options: [
      "Extract the chain into a static helper: BillingUtils.getCity(Invoice invoice)",
      "Add a getBillingCity() method to Invoice that encapsulates the traversal internally",
      "Store intermediate results in local variables to reduce the visual chain length",
      "Move the chain into Customer so BillingService calls customer.getCity() with one hop fewer"
    ],
    correctIndex: 1,
    explanation: "LoD fix: 'put a method on Order called getCustomerZipCode() that handles the navigation internally.' Adding getBillingCity() to Invoice is the analogous move — BillingService talks only to its immediate friend, Invoice."
  },
  {
    id: "F_q04", part: "F — Law of Demeter", tier: "L4", depth: "Analysis",
    format: "mcq", style: "Trade-off Reasoning", conceptIds: ["F2", "F3"],
    prompt: "`order.getCustomer().getAddress().getZipCode()` is a LoD violation. What is the concrete breakage risk — not just a style concern?",
    options: [
      "It prevents caching — every call traverses the object graph, making memoization unreliable",
      "It increases test setup — mocking requires three nested mock objects rather than one",
      "Every call site that traverses through Order and Customer to reach getZipCode() breaks if Address reorganizes how it stores postal data",
      "It leaks domain logic into the calling layer, preventing later separation of concerns"
    ],
    correctIndex: 2,
    explanation: "Source: 'Your code now knows the internal structure of three different objects. If any of them change how they organize their data, your code breaks.' Every call site becomes a structural dependency on all intermediate objects."
  },

  // ─── PART G ────────────────────────────────────────────────────
  {
    id: "G_q01", part: "G — SOLID Context", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["G1"],
    prompt: "SOLID principles came from a specific historical and technical context. Which best describes that context — and why does it matter for applying SOLID today?",
    options: [
      "They emerged from distributed systems failures, formalizing service-boundary contracts",
      "They were developed in the Agile era as a counterweight to waterfall over-engineering",
      "They came from functional programming research adapted for object-oriented languages",
      "They were codified during Java's dominance, when deep inheritance hierarchies and interface-heavy design were the norm"
    ],
    correctIndex: 3,
    explanation: "Source: 'SOLID principles come from Java's heyday of deep inheritance hierarchies and interface-heavy design.' This context explains why excessive SOLID outside Java/C# adds complexity without comparable benefit."
  },
  {
    id: "G_q02", part: "G — SOLID Context", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["G2", "G3"],
    prompt: "A Python microservice team debates whether to apply full SOLID — abstract base classes, ISP-compliant interfaces, DIP everywhere. A senior engineer says 'start simpler.' What grounds that position?",
    options: [
      "Python doesn't enforce interface contracts at the language level, making SOLID patterns unreliable",
      "Modern languages favor composition and functions over class hierarchies; SOLID adds complexity that KISS says to avoid unless the problem genuinely calls for it",
      "Microservices are stateless — SOLID applies within monoliths, not at the service boundary",
      "SOLID's benefits only appear at scale; a single microservice is too small to justify the overhead"
    ],
    correctIndex: 1,
    explanation: "Source: 'Modern languages favor simpler approaches—composition over class hierarchies, functions over interfaces. Don't break KISS by forcing SOLID patterns where simpler solutions work fine.'"
  },
  {
    id: "G_q03", part: "G — SOLID Context", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["G3", "G4"],
    prompt: "You're designing a simple to-do app. A task has a toggle() method that flips its done state. You could model this as a Command pattern with a ToggleCommand interface and concrete implementations. Should you?",
    options: [
      "Yes — OCP requires that behavior changes come through new classes, not direct modification of state",
      "Yes — ISP means every behavior should live behind a small focused interface",
      "No — YAGNI forbids all interface design until at least two implementations exist simultaneously",
      "No — start with a direct toggle(); introduce Command only if undo/redo requirements actually appear"
    ],
    correctIndex: 3,
    explanation: "Source: 'apply these principles when the problem calls for them, but recognize when you're adding complexity for its own sake.' Command pattern earns its place when undo/redo is needed — not from the mere existence of a toggle operation."
  },

  // ─── PART H ────────────────────────────────────────────────────
  {
    id: "H_q01", part: "H — SRP", tier: "L1", depth: "Recall",
    format: "blank", style: "Definition / Identification", conceptIds: ["H1"],
    prompt: "SRP states that a class should have one ____ to change.",
    correctAnswer: "reason",
    acceptedAnswers: ["reason", "reason to change"],
    explanation: "SRP definition: 'A class should have one reason to change.'"
  },
  {
    id: "H_q02", part: "H — SRP", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["H2", "H3"],
    prompt: "A UserService handles user creation, password hashing, and sends welcome emails. How many SRP violations exist, and what is the correct reasoning?",
    options: [
      "Zero — services are allowed to orchestrate multiple concerns; SRP targets domain objects only",
      "One — hashing and emailing are both 'user-related' operations and belong in the user service",
      "Three — each method is an independent concern and should be its own class",
      "Two — security (hashing) and notification (email) are distinct reasons to change from user management"
    ],
    correctIndex: 3,
    explanation: "Each 'reason to change' is a distinct concern: user persistence changes on schema changes; hashing changes on security policy changes; email changes on notification-channel changes. That's three responsibilities crammed into one — two SRP violations."
  },
  {
    id: "H_q03", part: "H — SRP", tier: "L3", depth: "Application",
    format: "short", style: "Self-Explanation / Feynman", conceptIds: ["H3", "H4"],
    prompt: "In your own words: Report splits into Report, PDFPrinter, and FileStorage. Three months later the team switches from PDFKit to a new PDF library. Walk through exactly what changes and what doesn't — and what would have broken in the original single-class design.",
    correctAnswer: "model",
    modelAnswer: "Only PDFPrinter changes — it's the only class with knowledge of PDFKit. Report's content logic and FileStorage's I/O are completely untouched. With the original single Report class, the same library change would require editing a class that also owns content generation and file storage logic, creating real regression risk in those areas.",
    keyPoints: [
      "Only PDFPrinter changes",
      "Report and FileStorage are unaffected",
      "Original single class would couple all three concerns, making the library change risky"
    ],
    explanation: "SRP's payoff: 'When the PDF formatting library changes, you only touch PDFPrinter. When you switch from files to a database, you only modify FileStorage. When the report content logic changes, you only update Report. Each change is isolated.'"
  },

  // ─── PART I ────────────────────────────────────────────────────
  {
    id: "I_q01", part: "I — OCP", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["I1", "I2"],
    prompt: "OCP says classes should be open for extension and closed for modification. What specific operational risk does the 'closed for modification' constraint address?",
    options: [
      "Every modification to existing working code risks introducing regressions in functionality that was previously correct",
      "Modifying a class forces all subclasses to recompile, increasing build times across the codebase",
      "Closed classes signal ownership boundaries — modification requires sign-off from the original author",
      "Modification invalidates in-memory cached instances in long-running server processes"
    ],
    correctIndex: 0,
    explanation: "Source: 'Every time you modify existing code, you risk breaking things that already work.' That's the specific, concrete operational risk OCP addresses — not a process concern or a performance concern."
  },
  {
    id: "I_q02", part: "I — OCP", tier: "L2", depth: "Comprehension",
    format: "blank", style: "Concept Distinction", conceptIds: ["I3", "I4"],
    prompt: "OCP's mechanism: adding new behavior means writing new ____ that implement existing interfaces. The old code never changes.",
    correctAnswer: "classes",
    acceptedAnswers: ["classes", "concrete classes", "implementations", "subclasses"],
    explanation: "Source: 'If you design with interfaces from the start, adding new functionality becomes a matter of writing new classes that implement those interfaces. The old code never changes, so it can't break.'"
  },
  {
    id: "I_q03", part: "I — OCP", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["I5"],
    prompt: "A PaymentProcessor handles credit and PayPal via an if-else chain. You need to add crypto. Which action follows OCP?",
    options: [
      "Add an else-if branch for crypto in process(), keeping all payment logic centralized in one place",
      "Create a CryptoPaymentProcessor subclass that overrides process() with the new crypto logic",
      "Define a PaymentMethod interface, implement CryptoPayment, and pass instances into the existing processor",
      "Add a type enum and a switch statement to replace the if-else chain, making future additions easier"
    ],
    correctIndex: 2,
    explanation: "Source: 'When you need to add cryptocurrency payments, you just create a new CryptoPayment class. The existing PaymentProcessor code never changes.' Options A and D both require modifying existing code."
  },

  // ─── PART J ────────────────────────────────────────────────────
  {
    id: "J_q01", part: "J — LSP", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["J1", "J2"],
    prompt: "Which statement most precisely captures LSP's requirement for a subclass?",
    options: [
      "The subclass must override all methods the parent defines and must not add new ones",
      "The subclass must share the same public interface but is free to restrict behavior for unsupported operations",
      "The subclass must not raise any exceptions the parent specification does not also declare",
      "The subclass must work correctly in every context where the base class is used, without callers needing to know which subclass they have"
    ],
    correctIndex: 3,
    explanation: "Source: 'if your code uses a parent class or interface, it should be able to use any subclass without knowing which specific subclass it is.' Options A and C are too narrow; B explicitly permits what LSP forbids — restricting promised behavior."
  },
  {
    id: "J_q02", part: "J — LSP", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["J2", "J3"],
    prompt: "Square extends Rectangle. Rectangle's setWidth() and setHeight() work independently. Square overrides both so setting one always sets the other. Which verdict is correct, and why?",
    options: [
      "This violates LSP — the subclass alters the semantics of setWidth() and setHeight() in ways Rectangle callers won't expect",
      "This is fine — Square adds synchronization behavior without removing any of Rectangle's public method signatures",
      "This is fine — a square is a valid mathematical subtype of a rectangle, so the inheritance is correct",
      "This violates SRP — Square is taking over Rectangle's dimension-management responsibility"
    ],
    correctIndex: 0,
    explanation: "Source: 'The subclass can add new behavior, but it can't remove or break behavior that the parent promised.' Silently synchronizing dimensions breaks the Rectangle contract that setWidth() and setHeight() are independent. Callers who rely on that independence will see unexpected behavior."
  },
  {
    id: "J_q03", part: "J — LSP", tier: "L3", depth: "Application",
    format: "mcq", style: "Anti-Pattern Identification", conceptIds: ["J3", "J4", "J5"],
    prompt: "Code review finds: `for (Bird b : birds) { if (!(b instanceof Penguin)) b.fly(); }`. What LSP-specific problem does this code expose?",
    options: [
      "The instanceof check is evidence callers must special-case a subtype — a diagnostic signal that the hierarchy violates LSP",
      "The loop risks ConcurrentModificationException if the collection changes during iteration",
      "This violates OCP — adding a new non-flying bird requires modifying the loop",
      "This violates SRP — a single loop is performing both bird-filtering and movement logic"
    ],
    correctIndex: 0,
    explanation: "Source: 'If a subclass forces callers to add special-case logic (e.g., if (bird instanceof Penguin)), you violated LSP.' The instanceof check is the exact diagnostic the source names. (OCP is also affected but LSP is the root violation.)"
  },
  {
    id: "J_q04", part: "J — LSP", tier: "L4", depth: "Analysis",
    format: "mcq", style: "Anti-Pattern Identification", conceptIds: ["J2", "J6"],
    prompt: "Bird has fly(). Penguin extends Bird and throws from fly(). You need to restructure the hierarchy to restore LSP. Which restructuring is correct?",
    options: [
      "Override fly() in Penguin as a silent no-op so no exception is thrown, preserving the method signature",
      "Add a canFly() boolean to Bird; all callers must check it before calling fly() on any bird",
      "Introduce FlyingBird between Bird and flying species; Penguin extends Bird directly and never inherits fly()",
      "Move fly() to a Flyable interface; all Bird subclasses implement it, with Penguin providing an empty stub"
    ],
    correctIndex: 2,
    explanation: "Source's fix: 'Introduce a FlyingBird class between Bird and flying species; Penguin extends Bird directly without fly().' Options A and D still expose fly() on Penguin in some form. Option B is the instanceof anti-pattern in disguise."
  },

  // ─── PART K ────────────────────────────────────────────────────
  {
    id: "K_q01", part: "K — ISP", tier: "L1", depth: "Recall",
    format: "mcq", style: "Definition / Identification", conceptIds: ["K1", "K2"],
    prompt: "A PodcastPlayer implements MediaPlayer {play(), pause(), changeSubtitles(), translateCaption()} but provides empty stubs for the last two. Which principle is being violated?",
    options: [
      "SRP — the interface conflates media control with accessibility concerns",
      "OCP — adding subtitle support modified MediaPlayer instead of extending with a new interface",
      "LSP — the stub implementations break the expected behavior contract for MediaPlayer users",
      "ISP — the interface is too large and forces PodcastPlayer to implement methods it doesn't need"
    ],
    correctIndex: 3,
    explanation: "ISP: 'Don't force classes to implement methods they don't need. If a class only needs two methods from an interface with ten methods, that interface is too big.'"
  },
  {
    id: "K_q02", part: "K — ISP", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["K3", "K4", "K5"],
    prompt: "Worker {work(), eat(), sleep()} forces Robot to implement empty eat() and sleep(). After splitting into Workable, Feedable, Restable — Robot implements only Workable. Beyond code cleanliness, what concrete behavioral risk does this split eliminate?",
    options: [
      "Robot can now extend eat() and sleep() with meaningful logic when the requirement eventually arrives",
      "It removes code paths where callers can reach Robot.eat() and receive silent empty behavior or a surprise exception",
      "It ensures Robot.work() can be overridden in a subclass without touching the eat/sleep contract",
      "It reduces interface dispatch overhead when calling Robot.work() in tight loops"
    ],
    correctIndex: 1,
    explanation: "Source: 'This leads to empty implementations or methods that throw exceptions, which is a code smell.' Splitting the interface makes those dead paths impossible to reach — callers can't accidentally invoke Robot.eat()."
  },
  {
    id: "K_q03", part: "K — ISP", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["K5"],
    prompt: "A SmartThermostat can adjust temperature and read current values but has no voice command support. A DeviceInterface has adjustTemp(), getReading(), and processVoice(). Following ISP, what should you do?",
    options: [
      "Have SmartThermostat implement DeviceInterface and throw UnsupportedOperationException in processVoice()",
      "Have SmartThermostat implement DeviceInterface with processVoice() as a silent no-op stub",
      "Split DeviceInterface into Adjustable, Readable, and VoiceCapable; SmartThermostat implements only Adjustable and Readable",
      "Add a supportsVoice() default boolean to DeviceInterface so SmartThermostat can signal its lack of capability at runtime"
    ],
    correctIndex: 2,
    explanation: "ISP fix: 'Split large interfaces into smaller, cohesive ones. Classes can implement multiple small interfaces if they need to, but they're not stuck implementing irrelevant methods.'"
  },

  // ─── PART L ────────────────────────────────────────────────────
  {
    id: "L_q01", part: "L — DIP", tier: "L1", depth: "Recall",
    format: "blank", style: "Definition / Identification", conceptIds: ["L1"],
    prompt: "DIP says your code should depend on ____, not concrete implementations.",
    correctAnswer: "abstractions",
    acceptedAnswers: ["abstractions", "interfaces", "abstract classes", "abstractions or interfaces", "abstract classes or interfaces"],
    explanation: "DIP definition: 'your code should depend on abstractions, not concrete implementations.'"
  },
  {
    id: "L_q02", part: "L — DIP", tier: "L2", depth: "Comprehension",
    format: "mcq", style: "Concept Distinction", conceptIds: ["L6"],
    prompt: "A team says: 'We inject every dependency through constructors, so we follow DIP.' What subtle point does this miss?",
    options: [
      "DIP is a principle about what the dependency is (abstraction vs. concrete); DI is a technique for delivering it — applying one doesn't automatically satisfy the other",
      "Constructor injection is the weaker form — DIP requires setter injection for hot-swappable dependencies",
      "DI through constructors is an implementation detail; DIP requires a full DI container to be fully compliant",
      "DIP applies to module-level boundaries, not to individual class constructors within a module"
    ],
    correctIndex: 0,
    explanation: "Source: 'DIP is a design principle, while dependency injection (passing dependencies through the constructor) is a technique for achieving it. They're related but not the same thing.' You can inject a concrete class through a constructor — that's DI without DIP."
  },
  {
    id: "L_q03", part: "L — DIP", tier: "L3", depth: "Application",
    format: "mcq", style: "Scenario-Based Application", conceptIds: ["L1", "L5"],
    prompt: "NotificationService instantiates EmailSender directly in its constructor. A new requirement calls for SMS support. Following DIP, what is the correct minimal change?",
    options: [
      "Add an SMSSender field alongside EmailSender and pick between them at runtime via a config flag",
      "Create an SMSNotificationService subclass that overrides notify() with SMS logic",
      "Define a MessageSender interface, have both EmailSender and SMSSender implement it, and inject the implementation through NotificationService's constructor",
      "Move EmailSender's send logic into a static utility so NotificationService holds no direct object reference"
    ],
    correctIndex: 2,
    explanation: "DIP solution: 'Instead of NotificationService creating an EmailSender directly, it should accept a MessageSender interface through its constructor.' Options A and B still couple NotificationService to concrete classes."
  },
  {
    id: "L_q04", part: "L — DIP", tier: "L4", depth: "Analysis",
    format: "mcq", style: "Trade-off Reasoning", conceptIds: ["L2"],
    prompt: "DIP is called 'inversion' because it flips who defines the contract. In the NotificationService example, what exactly gets inverted compared to the naive design?",
    options: [
      "The call direction inverts — NotificationService now calls up toward MessageSender rather than down toward EmailSender",
      "The ownership inverts — NotificationService defines the interface based on what it needs, and implementations must conform to that contract",
      "The dependency graph inverts — EmailSender now imports NotificationService instead of the reverse",
      "The abstraction layer inverts — high-level modules appear below low-level modules in the runtime call stack"
    ],
    correctIndex: 1,
    explanation: "Source: 'Normally, your business logic conforms to whatever the implementation provides. With DIP, you flip this: define an interface based on what your business logic needs, then have implementations conform to that interface.' The business logic is now in control of the contract shape."
  }
];

// ─────────────────────────────────────────────────────────────────
//  Utility helpers
// ─────────────────────────────────────────────────────────────────

function normalize(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
}

function checkBlank(userInput, q) {
  const n = normalize(userInput);
  return q.acceptedAnswers.some(a => normalize(a) === n || n.includes(normalize(a)));
}

const TIER_ORDER = ["L1", "L2", "L3", "L4", "L5"];

function scoreStats(answers, selfMarked) {
  const stats = { total: 0, correct: 0, byTier: {} };
  TIER_ORDER.forEach(t => { stats.byTier[t] = { total: 0, correct: 0 }; });

  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (ans === undefined) return;
    stats.total++;
    stats.byTier[q.tier].total++;

    let correct = false;
    if (q.format === "mcq") correct = ans === q.correctIndex;
    else if (q.format === "blank") correct = checkBlank(ans, q);
    else if (q.format === "short") correct = selfMarked[q.id] === "correct";

    if (correct) { stats.correct++; stats.byTier[q.tier].correct++; }
  });
  return stats;
}

// ─────────────────────────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────────────────────────

function TierChip({ tier }) {
  const m = TIER_META[tier];
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 11, fontFamily: "monospace", fontWeight: 700,
      color: m.color, background: m.bg, border: `1px solid ${m.color}40`,
      letterSpacing: "0.05em"
    }}>{m.label}</span>
  );
}

function SmallChip({ label, color = "#6b7280", bg = "#1f2937" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 7px", borderRadius: 4,
      fontSize: 10, fontFamily: "monospace", color, background: bg,
      border: "1px solid #374151", letterSpacing: "0.04em"
    }}>{label}</span>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Screens
// ─────────────────────────────────────────────────────────────────

function StartScreen({ onStart }) {
  const parts = [...new Set(QUESTIONS.map(q => q.part))];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px", fontFamily: "'Georgia', serif" }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          LLD — Design Principles
        </span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f9fafb", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        Hard Quiz
      </h1>
      <p style={{ color: "#9ca3af", margin: "0 0 32px", fontSize: 15, fontFamily: "sans-serif" }}>
        {QUESTIONS.length} questions · KISS, DRY, YAGNI, SoC, LoD, SOLID
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
        {parts.map(p => (
          <div key={p} style={{
            padding: "10px 14px", background: "#111827", borderRadius: 8,
            border: "1px solid #1f2937", fontSize: 12, color: "#d1d5db", fontFamily: "monospace"
          }}>
            {p}
          </div>
        ))}
      </div>

      <div style={{
        background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 10,
        padding: "16px 20px", marginBottom: 28
      }}>
        <div style={{ fontSize: 11, color: "#60a5fa", fontFamily: "monospace", marginBottom: 10, letterSpacing: "0.05em" }}>
          TIER LEGEND
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TIER_ORDER.map(t => <TierChip key={t} tier={t} />)}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280", fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Formats: MCQ · Fill-in-blank (production recall) · Short-answer (self-mark)
        </div>
      </div>

      <button
        onClick={onStart}
        style={{
          width: "100%", padding: "14px", borderRadius: 10,
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
          border: "1px solid #3b82f6", color: "#fff",
          fontSize: 16, fontFamily: "sans-serif", fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.02em"
        }}
      >
        Start Quiz
      </button>
    </div>
  );
}

function QuizScreen({ current, setCurrent, answers, setAnswers, selfMarked, setSelfMarked, onFinish }) {
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [shortText, setShortText] = useState("");

  const q = QUESTIONS[current];
  const totalQ = QUESTIONS.length;
  const progress = (current / totalQ) * 100;

  const alreadyAnswered = answers[q.id] !== undefined;

  function handleSubmit() {
    if (q.format === "mcq") {
      if (selected === null) return;
      setAnswers(prev => ({ ...prev, [q.id]: selected }));
    } else if (q.format === "blank") {
      if (!input.trim()) return;
      setAnswers(prev => ({ ...prev, [q.id]: input.trim() }));
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: shortText.trim() || "(blank)" }));
    }
    setSubmitted(true);
  }

  function handleNext() {
    if (current + 1 >= totalQ) onFinish();
    else {
      setCurrent(current + 1);
      setSubmitted(false);
      setInput("");
      setSelected(null);
      setShortText("");
    }
  }

  const isCorrect = (() => {
    if (!submitted) return null;
    if (q.format === "mcq") return selected === q.correctIndex;
    if (q.format === "blank") return checkBlank(input, q);
    return selfMarked[q.id] === "correct";
  })();

  const tierM = TIER_META[q.tier];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px", fontFamily: "sans-serif" }}>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>
            {current + 1} / {totalQ}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>
            ⏱ {TIMERS[q.tier]}s suggested
          </span>
        </div>
        <div style={{ height: 4, background: "#1f2937", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: tierM.color, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{
        background: "#0f172a", border: `1px solid ${tierM.color}30`,
        borderRadius: 12, padding: "24px", marginBottom: 16
      }}>
        {/* Meta chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <TierChip tier={q.tier} />
          <SmallChip label={q.part} color="#94a3b8" />
          <SmallChip label={q.style} color="#64748b" />
          <SmallChip label={q.format.toUpperCase()} color="#475569" />
        </div>

        {/* Prompt */}
        <p style={{
          color: "#f1f5f9", fontSize: 15.5, lineHeight: 1.7,
          margin: "0 0 20px", fontFamily: "Georgia, serif"
        }}>
          {q.prompt}
        </p>

        {/* MCQ */}
        {q.format === "mcq" && !submitted && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  textAlign: "left", padding: "12px 16px", borderRadius: 8,
                  border: `1px solid ${selected === i ? tierM.color : "#1e293b"}`,
                  background: selected === i ? `${tierM.color}15` : "#0f172a",
                  color: selected === i ? "#f1f5f9" : "#94a3b8",
                  fontSize: 14, cursor: "pointer", lineHeight: 1.5,
                  transition: "all 0.15s"
                }}
              >
                <span style={{ fontFamily: "monospace", marginRight: 10, color: tierM.color, fontSize: 12 }}>
                  {["A","B","C","D"][i]}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* MCQ submitted */}
        {q.format === "mcq" && submitted && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => {
              const isRight = i === q.correctIndex;
              const isPicked = i === selected;
              let bg = "#0f172a", borderC = "#1e293b", textC = "#64748b";
              if (isRight) { bg = "#052e16"; borderC = "#10b981"; textC = "#d1fae5"; }
              else if (isPicked && !isRight) { bg = "#2d0707"; borderC = "#ef4444"; textC = "#fecaca"; }
              return (
                <div key={i} style={{
                  padding: "12px 16px", borderRadius: 8,
                  border: `1px solid ${borderC}`, background: bg,
                  color: textC, fontSize: 14, lineHeight: 1.5
                }}>
                  <span style={{ fontFamily: "monospace", marginRight: 10, fontSize: 12 }}>
                    {["A","B","C","D"][i]}
                  </span>
                  {opt}
                  {isRight && <span style={{ marginLeft: 8, fontSize: 12 }}>✓</span>}
                  {isPicked && !isRight && <span style={{ marginLeft: 8, fontSize: 12 }}>✗</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Fill-in-blank */}
        {q.format === "blank" && !submitted && (
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Type your answer..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 8,
              border: `1px solid #1e293b`, background: "#0a0f1a",
              color: "#f1f5f9", fontSize: 14, fontFamily: "monospace",
              outline: "none", boxSizing: "border-box"
            }}
            autoFocus
          />
        )}

        {/* Blank submitted */}
        {q.format === "blank" && submitted && (
          <div>
            <div style={{
              padding: "12px 16px", borderRadius: 8,
              border: `1px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
              background: isCorrect ? "#052e16" : "#2d0707",
              color: isCorrect ? "#d1fae5" : "#fecaca",
              fontSize: 14, fontFamily: "monospace", marginBottom: 8
            }}>
              Your answer: {input} {isCorrect ? "✓" : "✗"}
            </div>
            {!isCorrect && (
              <div style={{
                padding: "10px 16px", borderRadius: 8,
                border: "1px solid #10b981", background: "#052e16",
                color: "#d1fae5", fontSize: 13, fontFamily: "monospace"
              }}>
                Accepted: {q.acceptedAnswers.slice(0, 3).join(" / ")}
              </div>
            )}
          </div>
        )}

        {/* Short-answer */}
        {q.format === "short" && !submitted && (
          <textarea
            value={shortText}
            onChange={e => setShortText(e.target.value)}
            placeholder="Write your answer in 2–4 sentences..."
            rows={4}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 8,
              border: "1px solid #1e293b", background: "#0a0f1a",
              color: "#f1f5f9", fontSize: 14, fontFamily: "Georgia, serif",
              lineHeight: 1.6, resize: "vertical", outline: "none",
              boxSizing: "border-box"
            }}
          />
        )}

        {/* Short submitted */}
        {q.format === "short" && submitted && (
          <div>
            <div style={{
              padding: "14px", borderRadius: 8, border: "1px solid #1e293b",
              background: "#0a0f1a", color: "#94a3b8", fontSize: 14,
              fontFamily: "Georgia, serif", lineHeight: 1.6, marginBottom: 12
            }}>
              <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "monospace", marginBottom: 6, letterSpacing: "0.05em" }}>YOUR ANSWER</div>
              {shortText || <em style={{ color: "#4b5563" }}>(blank)</em>}
            </div>

            <div style={{
              padding: "14px", borderRadius: 8, border: "1px solid #1e3a5f",
              background: "#0c1a2e", color: "#93c5fd", fontSize: 13,
              lineHeight: 1.6, marginBottom: 12, fontFamily: "Georgia, serif"
            }}>
              <div style={{ fontSize: 10, color: "#3b82f6", fontFamily: "monospace", marginBottom: 6, letterSpacing: "0.05em" }}>MODEL ANSWER</div>
              {q.modelAnswer}
            </div>

            <div style={{
              padding: "12px 14px", borderRadius: 8, border: "1px solid #1e293b",
              background: "#0f172a", marginBottom: 12
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.05em" }}>KEY POINTS TO HIT</div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#cbd5e1", fontSize: 13, lineHeight: 1.8 }}>
                {q.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>

            {!selfMarked[q.id] && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSelfMarked(prev => ({ ...prev, [q.id]: "correct" }))}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 8,
                    border: "1px solid #10b981", background: "#052e16",
                    color: "#d1fae5", fontSize: 13, cursor: "pointer"
                  }}>
                  ✓ I hit the key points
                </button>
                <button onClick={() => setSelfMarked(prev => ({ ...prev, [q.id]: "incorrect" }))}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 8,
                    border: "1px solid #ef4444", background: "#2d0707",
                    color: "#fecaca", fontSize: 13, cursor: "pointer"
                  }}>
                  ✗ I missed something
                </button>
              </div>
            )}
            {selfMarked[q.id] && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, textAlign: "center",
                border: `1px solid ${selfMarked[q.id] === "correct" ? "#10b981" : "#ef4444"}`,
                background: selfMarked[q.id] === "correct" ? "#052e16" : "#2d0707",
                color: selfMarked[q.id] === "correct" ? "#d1fae5" : "#fecaca",
                fontSize: 13
              }}>
                Marked as: {selfMarked[q.id] === "correct" ? "✓ Correct" : "✗ Needs review"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explanation */}
      {submitted && q.format !== "short" && (
        <div style={{
          padding: "16px 20px", borderRadius: 10, marginBottom: 16,
          background: "#0c1a0c", border: "1px solid #14532d"
        }}>
          <div style={{ fontSize: 10, color: "#16a34a", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.06em" }}>
            EXPLANATION
          </div>
          <p style={{ margin: 0, color: "#bbf7d0", fontSize: 13.5, lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
            {q.explanation}
          </p>
        </div>
      )}
      {submitted && q.format === "short" && selfMarked[q.id] && (
        <div style={{
          padding: "16px 20px", borderRadius: 10, marginBottom: 16,
          background: "#0c1a0c", border: "1px solid #14532d"
        }}>
          <div style={{ fontSize: 10, color: "#16a34a", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.06em" }}>
            EXPLANATION
          </div>
          <p style={{ margin: 0, color: "#bbf7d0", fontSize: 13.5, lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
            {q.explanation}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={q.format === "mcq" && selected === null}
            style={{
              flex: 1, padding: "13px", borderRadius: 10,
              background: (q.format === "mcq" && selected === null) ? "#1f2937" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "1px solid #3b82f6", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: q.format === "mcq" && selected === null ? "default" : "pointer",
              opacity: q.format === "mcq" && selected === null ? 0.5 : 1
            }}
          >
            Submit
          </button>
        ) : (
          (q.format !== "short" || selfMarked[q.id]) && (
            <button
              onClick={handleNext}
              style={{
                flex: 1, padding: "13px", borderRadius: 10,
                background: "linear-gradient(135deg, #0f4c2a, #166534)",
                border: "1px solid #16a34a", color: "#d1fae5",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              {current + 1 >= totalQ ? "See Results →" : "Next Question →"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ answers, selfMarked, onRestart }) {
  const stats = scoreStats(answers, selfMarked);
  const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const grade = pct >= 85 ? { label: "Strong", color: "#10b981" }
    : pct >= 65 ? { label: "Solid", color: "#3b82f6" }
    : pct >= 45 ? { label: "Developing", color: "#f59e0b" }
    : { label: "Needs Review", color: "#ef4444" };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#f9fafb", fontSize: 28, margin: "0 0 4px", fontFamily: "Georgia, serif" }}>
        Results
      </h2>
      <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 28px" }}>
        {stats.correct} / {stats.total} correct
      </p>

      <div style={{
        background: "#0f172a", border: `2px solid ${grade.color}50`,
        borderRadius: 14, padding: "28px", marginBottom: 24, textAlign: "center"
      }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: grade.color, fontFamily: "monospace" }}>
          {pct}%
        </div>
        <div style={{ fontSize: 16, color: grade.color, marginTop: 4, letterSpacing: "0.05em" }}>
          {grade.label}
        </div>
      </div>

      {/* Per-tier breakdown */}
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b",
        borderRadius: 12, padding: "20px", marginBottom: 20
      }}>
        <div style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace", marginBottom: 14, letterSpacing: "0.06em" }}>
          BREAKDOWN BY TIER
        </div>
        {TIER_ORDER.map(tier => {
          const t = stats.byTier[tier];
          if (t.total === 0) return null;
          const tp = Math.round((t.correct / t.total) * 100);
          const m = TIER_META[tier];
          return (
            <div key={tier} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <TierChip tier={tier} />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280" }}>
                  {t.correct}/{t.total} · {tp}%
                </span>
              </div>
              <div style={{ height: 6, background: "#1e293b", borderRadius: 3 }}>
                <div style={{
                  height: "100%", width: `${tp}%`,
                  background: m.color, borderRadius: 3, transition: "width 0.5s"
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-part breakdown */}
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b",
        borderRadius: 12, padding: "20px", marginBottom: 24
      }}>
        <div style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace", marginBottom: 14, letterSpacing: "0.06em" }}>
          BREAKDOWN BY PART
        </div>
        {[...new Set(QUESTIONS.map(q => q.part))].map(part => {
          const qs = QUESTIONS.filter(q => q.part === part);
          let correct = 0;
          qs.forEach(q => {
            const ans = answers[q.id];
            if (ans === undefined) return;
            if (q.format === "mcq" && ans === q.correctIndex) correct++;
            else if (q.format === "blank" && checkBlank(ans, q)) correct++;
            else if (q.format === "short" && selfMarked[q.id] === "correct") correct++;
          });
          const total = qs.filter(q => answers[q.id] !== undefined).length;
          return (
            <div key={part} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px solid #1e293b",
              fontSize: 13, color: "#cbd5e1"
            }}>
              <span style={{ fontFamily: "monospace", color: "#94a3b8" }}>{part}</span>
              <span style={{ fontFamily: "monospace", color: total === 0 ? "#4b5563" : correct === total ? "#10b981" : "#f59e0b" }}>
                {total > 0 ? `${correct}/${total}` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        style={{
          width: "100%", padding: "14px", borderRadius: 10,
          background: "#0f172a", border: "1px solid #374151",
          color: "#9ca3af", fontSize: 15, cursor: "pointer", fontWeight: 600
        }}
      >
        Restart Quiz
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Root App
// ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selfMarked, setSelfMarked] = useState({});

  function restart() {
    setScreen("start");
    setCurrent(0);
    setAnswers({});
    setSelfMarked({});
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020617 0%, #0a0f1a 50%, #020617 100%)",
      color: "#f9fafb"
    }}>
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("quiz")} />
      )}
      {screen === "quiz" && (
        <QuizScreen
          current={current} setCurrent={setCurrent}
          answers={answers} setAnswers={setAnswers}
          selfMarked={selfMarked} setSelfMarked={setSelfMarked}
          onFinish={() => setScreen("results")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen answers={answers} selfMarked={selfMarked} onRestart={restart} />
      )}
    </div>
  );
}
