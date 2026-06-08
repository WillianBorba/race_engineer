# Race Engineer — CLAUDE.md

> **Read this file before starting any task.**
> This is the canonical reference for architecture, conventions, and project state.
> Keep it updated as the project evolves — stale docs are worse than no docs.

---

## Table of contents

1. [Architecture overview](#1-architecture-overview)
2. [Tech stack](#2-tech-stack)
3. [Post-implementation checklist](#3-post-implementation-checklist)

---

## 1. Architecture overview

Race Engineer is a virtual racing engineer assistant for sim racing, starting with **Assetto Corsa Competizione (ACC)**. The pilot describes car behavior in natural language; the engineer responds with setup suggestions grounded in the session's full conversation history.

```
[ Pilot ]
    │  browser / app
    ▼
[ React SPA ]
    │  REST + JWT
    ▼
[ Express API  ←──────────────────── JWT middleware ]
    │         │              │
    │         ▼              ▼
    │      [ MySQL ]     [ S3 / LocalStack ]
    │      structured    conversation turns
    │      data only     (append-only JSON)
    │
    ├── [ core/ ]          # simulator-agnostic business logic
    │
    └── [ simulators/ ]    # one adapter per sim; resolved at request time
            │
            ├── acc/       # active
            └── iracing/   # future
    │
    ▼
[ LLM — self-hosted ]
  full session history + optional telemetry injected on every call
```

**Data split (important):**
- **MySQL** → structured, relational data: users, sessions, laps
- **S3** → conversation turns as append-only JSON blobs; never store large text in MySQL

**Multi-simulator strategy:** core business logic never imports a simulator directly. Each sim implements a common `SimulatorAdapter` contract. The active adapter is resolved from `session.simulator` at request time. Adding a new sim = new folder under `simulators/` + register in `simulators/index.js`.

**Current scope (v1):** ACC only, conversation-based interaction (no live telemetry yet).
**Planned:** real-time ACC telemetry via UDP / shared memory; then iRacing, rFactor 2.

---

## 2. Tech stack

| Layer | Technology | Version / notes |
|---|---|---|
| Runtime | Node.js | 22 |
| API framework | Express | REST, no GraphQL |
| Database | MySQL | 8 |
| Object storage | AWS S3 | LocalStack in dev |
| Auth | JWT | stateless; bcrypt for passwords; no refresh token in v1 |
| Frontend | React | SPA; landing (login) + chat UI |
| Testing | Jest | unit + integration |
| LLM | Self-hosted model | internal HTTP; never call external LLM APIs |
| Containerization | Docker Compose | local dev; AWS target for prod |

---


## 3. Post-implementation checklist

Run through this after completing any feature or bugfix before opening a PR.

### Code

- [ ] Route delegates to service — no business logic in the handler
- [ ] No raw SQL outside `models/`
- [ ] New env vars added to `.env.example` this file
- [ ] New files/folders reflected in this file
- [ ] New service, model, or adapter documented in this file
- [ ] If a new session needs to be created, feel free to do so

### Tests

- [ ] Unit test covers the service logic (LLM and S3 mocked)
- [ ] Integration test covers the happy path for new routes
- [ ] Edge cases tested: missing fields, unauthorized access, not found, unknown simulator
- [ ] All tests passes with no failures

### Security

- [ ] New routes have `authMiddleware` applied (unless intentionally public)
- [ ] User input is validated before reaching the model layer
- [ ] No secrets hardcoded anywhere — all via `process.env`

### Documentation

- [ ] If a new architectural decision was made → add to **Key decisions** below
- [ ] If a new hurdle was encountered and solved → add to an Hurdle session, create if not exists (Update this document to reference the session when created)
- [ ] If a new pattern was established → add to an Pattern session, create if not exists (Update this document to reference the session when created)
- [ ] If a new simulator was added → update adapter table in Adapters session, create if not exists (Update this document to reference the session when created)

### Key decisions log

| # | Decision | Rationale |
|---|---|---|
| 1 | Conversation history in S3, not MySQL | Avoids large text columns; natural fit for append-only blobs; easy full-context replay |
| 2 | Full history re-fetched from S3 on every LLM call | No in-memory session state; API is stateless and horizontally scalable |
| 3 | LocalStack for local S3 | Same AWS SDK interface; zero code change to go to prod — only env vars |
| 4 | Self-hosted LLM | Data privacy for pilot sessions; cost control; no external API dependency |
| 5 | JWT stateless, no refresh token (v1) | Simplicity; revisit when multi-device or long-lived sessions are needed |
| 6 | 1 user = 1 pilot (v1) | Team/multi-pilot support intentionally deferred |
| 7 | Adapter/Strategy pattern for simulators, not Clean Architecture | Multi-sim support needed; Clean Architecture overhead not justified for this scope. Core never imports a sim directly — adapters are resolved at request time from `session.simulator` |
