# System Design Quizzes

A collection of interactive system design quizzes built with React and Vite, covering the full [Hello Interview](https://www.hellointerview.com) system design curriculum.

## Current Architecture

Quiz content is stored as JSON, not JSX. There is one shared runtime (`QuizEngine.jsx`), and `App.jsx` builds its runtime catalog directly from `quiz-state.json` plus the nested quiz JSON files.

- `quiz-state.json` is the source article index. Each article has a `quizDataPath` pointing at its quiz JSON, or `null` when no quiz exists yet.
- `data/quizzes/<track>/<section>/<article>.json` stores source-of-truth quiz content.
- The `<track>/<section>/<article>` folders mirror the article path in `quiz-state.json`. Low Level Design sections must follow the index path segments: `in-a-hurry`, `concurrency`, and `problem-breakdowns`.
- `scripts/build-quiz-data.mjs` validates `quiz-state.json` and every referenced quiz JSON file. It does not generate a combined quiz database.
- `App.jsx` renders every track, section, article, quiz route, and review route from `quiz-state.json` and `import.meta.glob('./data/quizzes/**/*.json')`.

Do not create `*-quiz.jsx` files for new quizzes. Add JSON data and update `quiz-state.json`, then run `npm run build:quiz-data`.

## Available Quizzes

### In a Hurry
- How to Prepare
- Core Concepts (overview)
- Key Technologies

### Patterns
- Real-Time Updates
- Dealing with Contention
- Multi-Step Processes
- Scaling Reads
- Scaling Writes
- Handling Large Blobs
- Managing Long-Running Tasks

### Core Concepts
- Networking Essentials
- API Design
- Data Modeling
- Database Indexing
- Caching
- Sharding
- Consistent Hashing
- CAP Theorem
- Numbers to Know

### Advanced Topics / Key Technologies
- Data Structures for Big Data
- Vector Databases
- Time Series Databases
- Redis

## Reference Docs
- [`principles-of-learning.md`](./principles-of-learning.md) — master reference for evidence-based learning techniques applied to quiz design
- [`quiz-generation-methodology.md`](./quiz-generation-methodology.md) — methodology and rubric used to generate quizzes
- [`CLAUDE.md`](./CLAUDE.md) — project context and instructions for AI assistants


## Development Setup

To run locally, execute:

```bash
npm install
npm run dev
```

Visit [http://localhost:5173/](http://localhost:5173/) to view the index.
