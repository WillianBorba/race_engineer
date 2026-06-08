# Race Engineer

Virtual racing engineer assistant for sim racing. Describe your car's behavior in natural language and receive data-driven setup suggestions grounded in your full session history.

Starting with **Assetto Corsa Competizione (ACC)**, with iRacing and rFactor 2 planned.

---

## Architecture

```
[ Pilot ]
    │  browser
    ▼
[ React SPA ]
    │  REST + JWT
    ▼
[ Express API ]
    │         │
    ▼         ▼
[ MySQL ]   [ S3 / LocalStack ]
structured  conversation turns
data        (append-only JSON)
    │
    ├── core/          # simulator-agnostic business logic
    └── simulators/    # one adapter per sim
            ├── acc/   # active
            └── iracing/ (planned)
    │
    ▼
[ Self-hosted LLM ]
  full session history injected on every call
```

**MySQL** stores structured data: users, sessions, laps.  
**S3** stores conversation turns as append-only JSON blobs — never large text in MySQL.

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| API | Express (REST) |
| Database | MySQL 8 |
| Object storage | AWS S3 (LocalStack in dev) |
| Auth | JWT + bcrypt |
| Frontend | React SPA |
| Testing | Jest + Supertest |
| LLM | Self-hosted (no external API calls) |
| Dev environment | Docker Compose |

---

## Getting started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose

### 1. Clone and install

```bash
git clone <repo-url>
cd race-engineer
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure

```bash
docker compose up -d
```

This starts MySQL 8 on `localhost:3306` and LocalStack S3 on `localhost:4566`.  
The database schema is applied automatically from `src/db/migrations/`.

### 4. Run the API

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.  
Health check: `GET /health`

---

## API overview

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/health` | Health check | No |
| POST | `/api/auth/register` | Register a new pilot | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/sessions` | List pilot's sessions | Yes |
| POST | `/api/sessions` | Create a new session | Yes |
| POST | `/api/chat` | Send a message to the engineer | Yes |

> Routes are being added as features are built. See `src/app.js` for the current state.

---

## Database schema

```
users       id, email, password, created_at
sessions    id, user_id, simulator, track, car, created_at
laps        id, session_id, lap_number, lap_time (ms), created_at
```

Conversation history lives in S3, keyed by `session_id`.

---

## Project structure

```
src/
├── app.js               # Express app setup
├── server.js            # HTTP server entry point
├── core/
│   └── llm.js           # LLM call logic (simulator-agnostic)
├── db/
│   ├── connection.js    # MySQL connection pool
│   └── migrations/      # SQL migration files
├── middleware/
│   └── auth.js          # JWT auth middleware
├── models/
│   ├── userModel.js
│   └── sessionModel.js
├── routes/              # Express route handlers
├── services/            # Business logic
├── simulators/
│   ├── index.js         # Adapter resolver
│   └── acc/             # ACC adapter + prompts
└── storage/
    └── s3.js            # S3 client (works with LocalStack)
```

---

## Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

Tests are located in `src/__tests__/`. The LLM and S3 are mocked in unit tests.

---

## Adding a new simulator

1. Create `src/simulators/<sim-name>/index.js` implementing `SimulatorAdapter`
2. Register it in `src/simulators/index.js`
3. The adapter will be resolved automatically from `session.simulator` at request time

---

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | API port (default: 3000) |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing JWTs |
| `AWS_REGION` | S3 region |
| `AWS_ACCESS_KEY_ID` | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key |
| `S3_BUCKET` | Bucket name for conversation history |
| `S3_ENDPOINT` | Override endpoint (LocalStack: `http://localhost:4566`) |
| `LLM_ENDPOINT` | URL of the self-hosted LLM |
