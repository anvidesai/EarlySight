# EarlySight Backend

The **EarlySight Backend** is an operational intelligence API service built with **Python**, **FastAPI**, **SQLAlchemy 2.x**, **psycopg**, and **Uvicorn**. It provides the core service layer for early-warning problem synthesis, multi-modal signal aggregation, and PostgreSQL data persistence.

---

## Architecture & Project Structure

```text
backend/
├── app/
│   ├── __init__.py        # App package marker & version definition
│   ├── main.py            # FastAPI entry point, lifespan initialization & routers
│   ├── config.py          # Configuration: DATABASE_URL, CORS, OPENAI, & Risk/Evidence weights
│   ├── database.py        # SQLAlchemy engine, SessionLocal, Base model & DB check
│   ├── models/            # SQLAlchemy database models
│   │   ├── __init__.py    # Models package marker (exports Signal, Action)
│   │   ├── signal.py      # Signal domain model
│   │   └── action.py      # Action domain model & lifecycle timestamps
│   ├── schemas/           # Pydantic validation schemas
│   │   ├── __init__.py    # Schemas package marker (exports Signal, AI, Embedding, Risk, Evidence, Action)
│   │   ├── signal.py      # SignalCreate, SignalUpdate, SignalResponse schemas
│   │   ├── ai.py          # SignalAnalysisOutput, SignalAnalysisResponse schemas
│   │   ├── embedding.py   # RelatedSignalItem, RelatedSignalsResponse schemas
│   │   ├── risk.py        # RiskFactorBreakdown, RiskScoreResponse schemas
│   │   ├── evidence.py    # EvidenceItem, EvidenceResponse schemas
│   │   └── action.py      # ActionCreate, ActionUpdate, ActionResponse, lifecycle schemas
│   ├── services/          # Business logic & external AI integrations
│   │   ├── __init__.py    # Services package marker (exports AIService, EmbeddingService, RiskService, EvidenceService, ActionService)
│   │   ├── ai_service.py  # Reusable OpenAI service & structured signal analysis
│   │   ├── embedding_service.py # Vector embedding generation & cosine similarity engine
│   │   ├── risk_service.py # Deterministic 5-factor risk scoring & prioritization
│   │   ├── evidence_service.py # Structured evidence assembly & explainable narratives
│   │   └── action_service.py # Action state machine, lifecycle transitions & risk integration
│   └── api/               # REST API route handlers
│       ├── __init__.py    # API package marker (exports signals, ai, risks, evidence, actions routers)
│       ├── signals.py     # Signal CRUD endpoints, pagination & related signals
│       ├── ai.py          # AI analysis endpoint (POST /api/ai/analyze-signal)
│       ├── risks.py       # Dynamic risk scoring endpoints (GET /api/risks, GET /api/risks/{id})
│       ├── evidence.py    # Structured evidence endpoints (GET /api/evidence, GET /api/evidence/{id})
│       └── actions.py     # Action lifecycle endpoints & CRUD
├── tests/                 # Backend automated test suite
│   ├── __init__.py        # Test package marker
│   ├── test_risk_scoring.py # M7 risk scoring unit & endpoint tests
│   ├── test_evidence.py   # M8 evidence synthesis & explainability tests
│   ├── test_actions.py    # M9 action lifecycle, state transitions & API tests
│   └── test_m10_integration.py # M10 end-to-end integration & degraded-mode tests
├── .env.example           # Template for environment variables (copy to .env)
├── requirements.txt       # Dependencies (FastAPI, Uvicorn, SQLAlchemy, psycopg, OpenAI)
└── README.md              # Documentation & beginner-friendly setup guide
```

---

## 1. Prerequisites

Before running the backend, make sure you have:
1. **Python 3.10+** (Tested on Python 3.14):
   ```bash
   python --version
   ```
2. **PostgreSQL 14+** installed locally (or via optional Docker container).

---

## 2. Setting Up PostgreSQL Locally

PostgreSQL is required for data persistence in the EarlySight backend.

### Option A: Using Local PostgreSQL (Recommended for Windows / Mac / Linux)

1. **Install PostgreSQL**:
   * **Windows**: Download and install the official installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/). Remember the master password you set for the `postgres` superuser (default port is `5432`).
   * **macOS**: `brew install postgresql@16 && brew services start postgresql@16`
   * **Linux (Ubuntu/Debian)**: `sudo apt update && sudo apt install postgresql postgresql-contrib`

2. **Create the `earlysight` Database**:
   Open **Command Prompt**, **PowerShell**, or **Terminal**:

   * Using the PostgreSQL command line (`psql`):
     ```bash
     psql -U postgres
     ```
     Enter your `postgres` password when prompted, then run:
     ```sql
     CREATE DATABASE earlysight;
     \q
     ```

   * Or using `createdb` directly:
     ```bash
     createdb -U postgres earlysight
     ```

   * Or using **pgAdmin 4** (GUI):
     Right-click **Databases** â†’ **Create** â†’ **Database...** â†’ Enter `earlysight` â†’ Click **Save**.

### Option B: Using Docker (Optional)

If you have Docker Desktop installed, you can start a local PostgreSQL container with one command:

```bash
docker run --name earlysight-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=earlysight -p 5432:5432 -d postgres:16
```

---

## 3. Configuring the Database Connection (`DATABASE_URL`)

The backend connects to PostgreSQL using the modern `psycopg` driver.

Connection format:
```text
postgresql+psycopg://<username>:<password>@<host>:<port>/<database_name>
```

1. In the `backend` folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

2. Open `.env` and set your actual PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/earlysight
   ```

*Note: Never commit your `.env` file containing real passwords to GitHub.*

---

## 4. Setting Up Python Environment & Installing Dependencies

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   * **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   * **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   * **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

This installs:
* `fastapi` â€” High-performance async web framework
* `uvicorn[standard]` â€” Lightning-fast ASGI production server
* `sqlalchemy` â€” Python SQL toolkit and Object Relational Mapper (v2.x)
* `psycopg[binary]` â€” Modern PostgreSQL database adapter

---

## 5. Starting the Development Server

Start the FastAPI application with auto-reload:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Once running:
* **API Base URL**: `http://127.0.0.1:8000`
* **Interactive Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
* **Alternative Docs (ReDoc)**: `http://127.0.0.1:8000/redoc`

---

## 6. What is an Operational Signal?

In EarlySight, a **Signal** is a single observed operational data point or event. Signals are the building blocks that lead to early warnings and emergent risk detection.

Examples of operational signals:
* Water leakage detected in a server room
* HVAC heating failure in Wing B
* Escalator sensor safety stoppage
* Crowd surge or hallway overcrowding
* Repeated customer maintenance complaints

### Signal Data Fields

| Field | Type | Description | Values / Examples |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Unique identifier (auto-increment primary key) | `1`, `2`, `3` |
| `title` | String (1-255) | Short headline summarizing the observation | `"Water leakage near Rack 4"` |
| `description` | Text (optional) | Detailed notes or context | `"Dripping from ceiling tile"` |
| `category` | String | Operational category | `maintenance`, `safety`, `infrastructure`, `crowding`, `complaint`, `equipment`, `other` |
| `location` | String (optional) | Physical or logical zone | `"Building 2, 3rd Floor"` |
| `severity` | String | Assessed operational severity | `low`, `medium`, `high`, `critical` |
| `status` | String | Incident workflow status | `open`, `investigating`, `resolved` |
| `source` | String | Origin channel of the signal | `complaint`, `maintenance_report`, `incident_report`, `sensor`, `manual`, `other` |
| `created_at` | DateTime (UTC) | Timestamp when the signal was recorded | Auto-generated |
| `updated_at` | DateTime (UTC) | Timestamp when the signal was last updated | Auto-updated |

---

## 7. Operational Signals REST API

The API provides full CRUD operations under `/api/signals`.

### Endpoints Summary

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/signals` | List signals (supports pagination) | `200 OK` |
| `GET` | `/api/signals/{signal_id}` | Retrieve a signal by integer ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/signals` | Register a new operational signal | `201 Created` / `422 Validation Error` |
| `PATCH` | `/api/signals/{signal_id}` | Partially update an existing signal | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/signals/{signal_id}` | Remove a signal record | `204 No Content` / `404 Not Found` |

---

### Example Requests

#### 1. Creating a Signal (`POST /api/signals`)

**Using cURL:**
```bash
curl -X POST http://127.0.0.1:8000/api/signals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water leakage detected near Server Room 3B",
    "description": "Slow dripping observed from ceiling tile above network rack 4.",
    "category": "infrastructure",
    "location": "Building 2, 3rd Floor",
    "severity": "high",
    "status": "open",
    "source": "maintenance_report"
  }'
```

**Using PowerShell:**
```powershell
$body = @{
    title = "Water leakage detected near Server Room 3B"
    description = "Slow dripping observed from ceiling tile above network rack 4."
    category = "infrastructure"
    location = "Building 2, 3rd Floor"
    severity = "high"
    status = "open"
    source = "maintenance_report"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signals" -Method Post -Body $body -ContentType "application/json"
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Water leakage detected near Server Room 3B",
  "description": "Slow dripping observed from ceiling tile above network rack 4.",
  "category": "infrastructure",
  "location": "Building 2, 3rd Floor",
  "severity": "high",
  "status": "open",
  "source": "maintenance_report",
  "created_at": "2026-10-06T17:30:00Z",
  "updated_at": "2026-10-06T17:30:00Z"
}
```

---

#### 2. Listing Signals with Pagination (`GET /api/signals`)

Signals are returned ordered newest first. Pagination is controlled with `skip` and `limit` query parameters.

* `skip`: Number of records to skip (default: `0`, minimum: `0`).
* `limit`: Maximum number of records to return (default: `20`, minimum: `1`, maximum: `100`).

**Using cURL:**
```bash
curl "http://127.0.0.1:8000/api/signals?skip=0&limit=10"
```

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signals?skip=0&limit=10"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Water leakage detected near Server Room 3B",
    "description": "Slow dripping observed from ceiling tile above network rack 4.",
    "category": "infrastructure",
    "location": "Building 2, 3rd Floor",
    "severity": "high",
    "status": "open",
    "source": "maintenance_report",
    "created_at": "2026-10-06T17:30:00Z",
    "updated_at": "2026-10-06T17:30:00Z"
  }
]
```

---

#### 3. Updating a Signal (`PATCH /api/signals/{signal_id}`)

**Using cURL:**
```bash
curl -X PATCH http://127.0.0.1:8000/api/signals/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "investigating",
    "severity": "critical"
  }'
```

---

#### 4. Deleting a Signal (`DELETE /api/signals/{signal_id}`)

**Using cURL:**
```bash
curl -X DELETE http://127.0.0.1:8000/api/signals/1
```
Returns `204 No Content`.

---

## 8. Health Check & Graceful Degradation

### Health Endpoint (`GET /api/health`)

* **When PostgreSQL is running and connected:**
  ```json
  {
    "status": "healthy",
    "service": "EarlySight Backend",
    "database": "connected"
  }
  ```

* **When PostgreSQL is NOT running or unreachable:**
  ```json
  {
    "status": "degraded",
    "service": "EarlySight Backend",
    "database": "unavailable"
  }
  ```

### What happens if PostgreSQL is unavailable?
1. The FastAPI application **will not crash**. It boots normally, initializes its lifespan, and logs that table creation is deferred until PostgreSQL connects.
2. The health check (`/api/health`) safely reports `"status": "degraded"` and `"database": "unavailable"`.
3. Calls to `/api/signals` return HTTP 503 Service Unavailable (`{"detail": "Database service is currently unavailable. Please verify PostgreSQL connection."}`) without crashing the server process or exposing credentials.
4. Non-database endpoints (`/`, `/api/health`, `/docs`) continue to operate without interruption.
5. Once PostgreSQL starts, restarting the API or triggering the next connection check automatically establishes connectivity and initializes the tables.

---

## 9. Frontend ↔ Backend Integration (Milestone 4)

The EarlySight frontend communicates with the FastAPI backend through a unified client service located at `src/js/api.js`.

### Architecture Flow

```text
EarlySight Frontend (Vite @ http://localhost:5173)
           ↓  fetch() HTTP requests
FastAPI Backend (Uvicorn @ http://127.0.0.1:8000)
           ↓  SQLAlchemy 2.x / psycopg
PostgreSQL Database (port 5432)
```

### Local Development Setup & Ports

| Component | Dev Command | Local URL |
| :--- | :--- | :--- |
| **FastAPI Backend** | `uvicorn app.main:app --reload --port 8000` (in `backend/`) | `http://127.0.0.1:8000` |
| **EarlySight Frontend** | `bun run dev` or `npm run dev` (in project root) | `http://localhost:5173` |

### API Base URL Configuration

The frontend client defaults to `http://127.0.0.1:8000` and can be overridden in `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Cross-Origin Resource Sharing (CORS)

FastAPI is configured with `CORSMiddleware` in `backend/app/main.py` allowing local frontend development origins:
* `http://localhost:5173`
* `http://127.0.0.1:5173`
* `http://localhost:4173`
* `http://127.0.0.1:4173`
* `http://localhost:3000`
* `http://127.0.0.1:3000`

### Current PostgreSQL Limitation & Degraded State Handling

* Because PostgreSQL is currently not installed on the local machine, the backend safely returns `503 Service Unavailable` for database-backed signal queries.
* The frontend (`signals.html`) cleanly catches this status and presents a clear, professional degraded state banner (`Backend Connected • PostgreSQL Database Offline (HTTP 503)`).
* The user can click **Retry API Request** or **View Reference Dataset** to inspect table filtering and explainability drawers without application disruption.
* When PostgreSQL is started locally, the next API request automatically connects and loads live signals from the database.

---

## 10. AI / LLM Integration Foundation (Milestone 5)

EarlySight includes an AI/LLM integration foundation powered by the official **OpenAI Python SDK** (`openai>=1.50.0`). The AI service is designed as a modular foundation for operational signal understanding, structured classification, and emerging-risk reasoning.

### Architecture & Service Structure

```text
backend/app/
├── services/
│   ├── __init__.py        # Exports AIService and singleton ai_service
│   └── ai_service.py      # OpenAI client, timeout management, prompt engineering & validation
├── schemas/
│   └── ai.py              # Pydantic schemas: SignalAnalysisOutput & SignalAnalysisResponse
└── api/
    └── ai.py              # REST endpoint: POST /api/ai/analyze-signal/{signal_id}
```

### Configuration & Environment Variables

Configure the AI service in your local `backend/.env` file:

```env
# Optional: Set your OpenAI API key to enable operational signal analysis
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

* **Default Model**: `gpt-4o-mini` (or any compatible OpenAI chat model).
* **Safe Development Default**: `OPENAI_API_KEY` defaults to empty. The backend will **never** fail to start if the key is missing.

### AI Analysis API Endpoint

#### `POST /api/ai/analyze-signal/{signal_id}`

Loads a signal from the database and performs structured operational analysis using the configured OpenAI model.

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/ai/analyze-signal/1
```

**Example Successful Response (200 OK):**
```json
{
  "signal_id": 1,
  "signal_title": "Water leakage detected near Server Room 3B",
  "status": "analyzed",
  "analysis": {
    "summary": "Water dripping directly above network equipment creates high fire and power-outage risk.",
    "category": "infrastructure",
    "severity": "high",
    "key_evidence": [
      "Slow dripping observed from ceiling tile above network rack 4",
      "Proximity to high-density server equipment"
    ],
    "recommended_attention": "Dispatch facilities plumbing team immediately to isolate overhead supply valve.",
    "reasoning": "Uncontained fluid ingress into electrical and telecommunications infrastructure can cause uncontained circuit arc trips and facility-wide outage."
  },
  "model_used": "gpt-4o-mini"
}
```

### Handling Missing API Keys & Offline Mode

When `OPENAI_API_KEY` is not provided in the environment:
* The FastAPI server starts normally and remains completely functional.
* Health check (`GET /api/health`) reports `"ai": "unavailable"`.
* The AI endpoint returns a clean, degraded status without crashing or throwing internal exceptions:

```json
HTTP 503 Service Unavailable
{
  "status": "unavailable",
  "message": "AI service is not configured. Please configure OPENAI_API_KEY."
}
```

* **No Faked Responses**: When the key is missing, no artificial AI responses are generated.

### Extended Health Check (`GET /api/health`)

The health endpoint reports application readiness, database connectivity, and AI configuration status independently:

```json
{
  "status": "degraded",
  "service": "EarlySight Backend",
  "database": "unavailable",
  "ai": "unavailable"
}
```

### Security Principles

1. **No Hardcoded Keys**: API keys are loaded strictly from the environment via `app.config.settings`.
2. **Never Exposed**: API keys are never returned in HTTP responses, logs, console traces, or documentation.
3. **Version Control Safety**: Actual `.env` files are ignored in `.gitignore`. Only `.env.example` with empty placeholders is committed.
4. **Sanitized Error Handling**: Network or authentication errors from OpenAI are intercepted and mapped to clean, sanitized messages without leaking credentials.

---

## 11. Embeddings & Related Signal Detection (Milestone 6)

EarlySight includes a semantic intelligence and related-signal detection engine powered by OpenAI vector embeddings (`text-embedding-3-small`) and pure-Python cosine similarity comparison.

This capability allows facility operators and intelligence analysts to detect precursor patterns across physical, maintenance, and safety events—identifying clusters of related incidents even when phrased in completely different language.

### Architecture & Service Structure

```text
backend/app/
├── services/
│   ├── __init__.py           # Exports EmbeddingService, cosine_similarity, signal_to_embedding_text
│   └── embedding_service.py # Vector embedding generation, in-memory cache & cosine similarity engine
├── schemas/
│   └── embedding.py         # Pydantic schemas: RelatedSignalItem, RelatedSignalsResponse
└── api/
    └── signals.py           # REST endpoint: POST /api/signals/{signal_id}/related
```

### Configuration & Environment Variables

Configure the embedding engine in `backend/.env`:

```env
# OpenAI Embedding & Related Signal Detection Configuration
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
RELATED_SIGNAL_LIMIT=5
RELATED_SIGNAL_THRESHOLD=0.70
CANDIDATE_SIGNAL_LIMIT=50
```

| Setting | Default | Description |
| :--- | :--- | :--- |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | OpenAI embedding model for semantic vector representation |
| `RELATED_SIGNAL_THRESHOLD` | `0.70` | Cosine similarity cutoff score between 0.0 and 1.0 (development threshold) |
| `RELATED_SIGNAL_LIMIT` | `5` | Maximum number of related signals to return in ranking |
| `CANDIDATE_SIGNAL_LIMIT` | `50` | Maximum candidate signals to fetch from database for vector comparison |

*Note: The similarity threshold `0.70` is a configurable development cutoff for operational relevance, not a scientifically rigid threshold.*

### Deterministic Signal Text Preparation

Signals are deterministically translated into semantic text representation via `signal_to_embedding_text()` before vectorization:

```text
Title: Water leakage near Block A
Description: Repeated moisture observed near ceiling.
Category: infrastructure
Location: Block A
Severity: medium
Source: complaint
```

This ensures reproducible, normalized embeddings across repeated queries and background processing jobs.

### Semantic Similarity Algorithm

Cosine similarity is computed in pure Python between unit embedding vectors:

$$\text{similarity} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$

* Strictly normalized and clamped to $[0.0, 1.0]$.
* Includes guards against zero vectors, empty inputs, and dimensional mismatches.
* Deterministic mathematical tests verify exact similarity between identical vectors ($1.0$), highly related vectors ($0.9939$), and orthogonal/dissimilar vectors ($0.0$).

### Related Signals API Endpoint

#### `POST /api/signals/{signal_id}/related`

Queries candidate signals from PostgreSQL, generates vector embeddings, computes semantic similarity against the target signal, and returns related signals ranked from highest to lowest similarity.

**Query Parameters (Optional overrides):**
* `limit` (int, 1-50): Override maximum results count.
* `threshold` (float, 0.0-1.0): Override minimum cosine similarity cutoff.

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/signals/1/related
```

**Example Successful Response (200 OK):**
```json
{
  "status": "ok",
  "signal_id": 1,
  "related_signals": [
    {
      "signal_id": 14,
      "similarity": 0.8924,
      "title": "Moisture accumulation near electrical panel",
      "category": "infrastructure",
      "location": "Building 2, Basement",
      "severity": "high"
    },
    {
      "signal_id": 8,
      "similarity": 0.7412,
      "title": "Ceiling tile sagging from condensation",
      "category": "maintenance",
      "location": "Building 2, 2nd Floor",
      "severity": "medium"
    }
  ],
  "model_used": "text-embedding-3-small"
}
```

*Note: Raw embedding vectors are internal numerical representations and are **never** exposed in the public API response.*

### Handling Missing API Keys & Offline Mode

When `OPENAI_API_KEY` is not provided:
* The backend boots normally without disruption.
* Health check (`GET /api/health`) reports `"embeddings": "unavailable"`.
* The related signals endpoint returns a clean, degraded response:

```json
HTTP 503 Service Unavailable
{
  "status": "unavailable",
  "message": "Embedding service is not configured. Please configure OPENAI_API_KEY."
}
```

* **No Faked Scores**: When credentials or database are offline, no artificial similarity scores or synthetic embeddings are generated.

### Extended Health Check (`GET /api/health`)

The health endpoint reports status independently for database, general AI, and embeddings:

```json
{
  "status": "degraded",
  "service": "EarlySight Backend",
  "database": "unavailable",
  "ai": "unavailable",
  "embeddings": "unavailable"
}
```

### Vector Storage Architecture: Current vs. Future

| Layer | Current Development Architecture (M6) | Future Production Architecture (Planned) |
| :--- | :--- | :--- |
| **Vector Storage** | On-demand OpenAI vector generation with in-memory SHA-256 caching | Persistent PostgreSQL `vector` columns using `pgvector` extension |
| **Similarity Search** | Dynamic in-memory cosine similarity over fetched candidate signals | Native SQL vector indexing (`HNSW` / `IVFFlat`) with `<=>` cosine distance |
| **Startup Requirements** | Runs anywhere without requiring `pgvector` or database installation | Automated Alembic migration applying `CREATE EXTENSION IF NOT EXISTS vector` |
| **Scalability** | Ideal for development, prototypes, and targeted operational signal inspection | Enterprise-scale across hundreds of thousands of historical incidents |

* **Zero Hard Startup Dependencies**: The EarlySight backend is intentionally designed to start reliably even when PostgreSQL, `pgvector`, or OpenAI API keys are not installed.

---

## 12. Risk Scoring & Prioritization (Milestone 7)

EarlySight includes a transparent, explainable risk-scoring and operational prioritization layer. It transforms individual precursor signals, cohort operational context, and semantic related-signal evidence into:

$$\text{Signal} \longrightarrow \text{Risk Factors} \longrightarrow \text{Risk Score (0–100)} \longrightarrow \text{Risk Level} \longrightarrow \text{Priority} \longrightarrow \text{Explanation}$$

### Important MVP Disclaimer
> **Notice:** The scoring model implemented in Milestone 7 is a transparent, configurable MVP heuristic. It provides immediate operational prioritization and explainable pattern attribution. It is **not** scientifically validated, does not assert real-world accuracy percentages, and does not claim statistical certainty. Factor weights and tier thresholds are fully configurable in code and environment settings.

---

### Scoring Factors & Heuristic Model

The composite risk score is evaluated dynamically across five understandable operational dimensions:

1. **Severity Contribution** ($\le 25$ pts): Evaluates operational severity (`critical`, `high`, `medium`, `low`). Optionally incorporates structured severity assessment from M5 AI analysis if higher.
2. **Frequency Contribution** ($\le 20$ pts): Evaluates how frequently signals in the same operational category or location occur across the cohort (or source reporting density if cohort is small).
3. **Recurrence Contribution** ($\le 20$ pts): Evaluates chronic/recurring indicators, keywords (`chronic`, `persistent`, `repeated`, `leakage`, `overflow`), matching location history, and unresolved lifecycle status.
4. **Related-Signal Contribution** ($\le 20$ pts): Evaluates semantic precursor clusters identified by the M6 embedding engine (proportional to count and average cosine similarity). If embeddings or database are offline, safely sets factor to $0$ with an explicit explanation note.
5. **Trend / Recent Activity Contribution** ($\le 15$ pts): Evaluates lifecycle velocity (`open` vs `investigating` vs `resolved`) and recency of observation ($<24\text{h}$, $<7\text{d}$, $<30\text{d}$).

### Weighted Additive Formula

$$\text{risk\_score} = \min\Big(100, \max\big(0, \text{severity} + \text{frequency} + \text{recurrence} + \text{related\_signals} + \text{trend}\big)\Big)$$

* Maximum potential score: $25 + 20 + 20 + 20 + 15 = 100$
* Deterministic: Identical signal and cohort inputs produce identical factor scores and explanations every time.
* Independent: Does not require OpenAI API calls during score calculation.

---

### Categorical Risk Levels & Priority Tiers

| Score Range | Risk Level | Description |
| :--- | :--- | :--- |
| **0 – 24** | `LOW` | Minor or isolated operational event. Routine monitoring recommended. |
| **25 – 49** | `MODERATE` | Non-acute condition with moderate activity. Scheduled follow-up. |
| **50 – 74** | `HIGH` | Elevated hazard with active pattern indications. Prompt investigation warranted. |
| **75 – 100** | `CRITICAL` | Severe precursor pattern or acute operational hazard. Immediate mitigation required. |

#### Operational Priority Ranking

Priority is evaluated from the final composite score to guide operational dispatch:
* **$\ge 80$**: `CRITICAL`
* **$60 – 79$**: `HIGH`
* **$30 – 59$**: `MEDIUM`
* **$< 30$**: `LOW`

*(Thresholds are configurable in `app.config.settings` and `.env`)*

---

### Configuration & Environment Variables

Configure factor weights and threshold cutoffs in `backend/.env`:

```env
# Risk Scoring Model & Prioritization Weights (Milestone 7)
RISK_WEIGHT_SEVERITY=25
RISK_WEIGHT_FREQUENCY=20
RISK_WEIGHT_RECURRENCE=20
RISK_WEIGHT_RELATED_SIGNALS=20
RISK_WEIGHT_TREND=15

# Risk Level Thresholds
RISK_THRESHOLD_LOW=24
RISK_THRESHOLD_MODERATE=49
RISK_THRESHOLD_HIGH=74
RISK_THRESHOLD_CRITICAL=75

# Priority Ranking Thresholds
RISK_PRIORITY_CRITICAL_MIN=80
RISK_PRIORITY_HIGH_MIN=60
RISK_PRIORITY_MEDIUM_MIN=30
```

---

### Risk API Endpoints

#### 1. `GET /api/risks/{signal_id}`
Calculates and returns the dynamic risk score, tier level, priority, 5-factor breakdown, and transparent explanation for a specific signal.

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/risks/1
```

**Example Response (`200 OK`):**
```json
{
  "signal_id": 1,
  "signal_title": "Water leakage detected near Server Room 3B",
  "risk_score": 78,
  "risk_level": "CRITICAL",
  "priority": "HIGH",
  "factors": {
    "severity": 19,
    "frequency": 18,
    "recurrence": 16,
    "related_signals": 10,
    "trend": 15
  },
  "explanation": "High severity combined with elevated operational priority, repeated related signals (count: 2, avg similarity: 0.82) increase problem likelihood; recurring pattern indicators observed at this location.",
  "signal_severity": "high",
  "signal_category": "infrastructure",
  "signal_location": "Building 2, 3rd Floor",
  "signal_status": "open",
  "related_signals_count": 2,
  "evaluated_at": "2026-10-07T08:00:00Z"
}
```

#### 2. `GET /api/risks`
Returns a list of operational risks suitable for dashboards. Results are sorted by `risk_score` descending by default.

**Query Parameters:**
* `risk_level` (string, optional): Filter by `LOW`, `MODERATE`, `HIGH`, `CRITICAL` (case-insensitive).
* `minimum_score` (int, 0–100, optional): Filter signals with `risk_score >= minimum_score`.
* `skip` (int, default: 0): Records to skip for pagination.
* `limit` (int, 1–100, default: 50): Maximum number of evaluated risks to return.

**Example Request:**
```bash
curl "http://127.0.0.1:8000/api/risks?risk_level=HIGH&minimum_score=50&limit=10"
```

---

### Degraded-State Handling & Offline Resilience

* **Database Offline**: Both endpoints catch PostgreSQL connectivity failures cleanly and return `HTTP 503 Service Unavailable` (`{"status": "unavailable", "message": "Database service is currently unavailable. Please verify PostgreSQL connection."}`). The server never crashes.
* **Embeddings / OpenAI Offline**: If OpenAI API key is missing or embedding generation fails, the scoring engine does not crash or fabricate related signals. It assigns $0$ to the related-signal factor and notes: `"Note: Related-signal contribution could not be fully evaluated because embedding service or database is offline."`
* **AI Analysis Offline**: When structured AI analysis is not present, scoring operates deterministically on native signal attributes (`severity`, `category`, `status`, `source`, `location`, `created_at`). No fake AI insights are injected.
* **Missing Signal**: Returns `HTTP 404 Not Found` with a clear explanation (`{"detail": "Signal with ID {signal_id} not found."}`).
* **Invalid Signal ID**: Path parameter validation returns `HTTP 422 Unprocessable Entity` for IDs $\le 0$.

---

## 13. Evidence & Explainability (Milestone 8)

EarlySight includes an evidence and explainability layer that directly answers the central operational question:

$$\textbf{“Why was this signal or risk identified as important?”}$$

The layer establishes a factual chain of custody connecting:

$$\text{Signal} \longrightarrow \text{Related Evidence} \longrightarrow \text{Risk Factor Attribution} \longrightarrow \text{Supporting Evidence Items} \longrightarrow \text{Explainable Narrative}$$

### Important MVP Disclaimer
> **Notice:** Evidence synthesis and evidence-strength ratings implemented in Milestone 8 are transparent, configurable MVP heuristics grounded in verified backend records. They provide operational clarity and prevent black-box opacity. They are **not** scientifically validated confidence scores and do not assert statistical certainty. All data points reflect actual database records, M6 cosine similarities, and M7 factor weights without fabricated evidence.

---

### Structured Evidence Representation

Each corroborating piece of evidence is structured via [EvidenceItem](file:///c:/EarlySight/backend/app/schemas/evidence.py#L29) across six extensible types:

| Evidence Type | Operational Dimension | Description & Attribution |
| :--- | :--- | :--- |
| `PRIMARY_SIGNAL` | Source Signal Record | Primary observation headline, description, physical location, severity, and timestamp. |
| `SEVERITY` | Operational Severity | Assessed hazard severity level and its point contribution to overall risk. Includes AI severity notes if M5 analysis is available. |
| `RELATED_SIGNAL` | Semantic Cross-Correlation | Corroborating precursor incidents identified by M6 embeddings with exact cosine similarity scores ($\ge 0.70$). |
| `RECURRENCE` | Chronic History | Repeated location matches in cohort records and chronic/recurring pattern keywords (`chronic`, `persistent`, `repeated`, `leakage`, `overflow`). |
| `FREQUENCY` | Cohort Density | Category occurrence volume across the active cohort or reporting channel baseline. |
| `TREND` | Lifecycle Urgency | Active workflow status (`open`, `investigating`, `resolved`) and recency of observation ($<24\text{h}$, $<7\text{d}$, $<30\text{d}$). |

---

### Evidence-Strength Classification

Rather than relying on arbitrary AI-generated confidence percentages, evidence strength is classified into three tiers based on concrete, verified corroborating data density:

| Strength Tier | Score Threshold | Data Density Criteria |
| :--- | :---: | :--- |
| **`HIGH`** | $\ge 7$ pts | Multiple related precursor signals ($\ge 3$ or top similarity $\ge 0.85$), confirmed location recurrence, chronic text indicators, high/critical severity, and multiple independent reporting channels (sensor + maintenance + complaint). |
| **`MODERATE`** | $4 – 6$ pts | 1–2 related signals, moderate category frequency in cohort, or medium severity with active lifecycle status. |
| **`LOW`** | $< 4$ pts | Isolated condition with no related precursors, no location recurrence, low severity, or resolved status. |

*(Configurable via `EVIDENCE_STRENGTH_HIGH_MIN` and `EVIDENCE_STRENGTH_MODERATE_MIN` in `.env`)*

---

### Explainability Narrative Structure

The generated narrative synthesizes verified signal attributes into a cautious, fact-grounded explanation addressing five essential operational questions:

1. **WHAT happened?** — Identifies the assessed severity, category, and observation title.
2. **WHERE did it happen?** — Identifies the physical location zone or marks it as unassigned.
3. **HOW OFTEN is it happening?** — Reports the exact count of category events across the active cohort.
4. **IS it recurring / increasing?** — Cites the count of semantically related precursors and local recurrence history.
5. **WHY does it matter?** — Relates the active status and composite M7 risk score ($0–100$) to operational escalation concern.

#### Cautious Language Standard
To prevent alarmism and avoid unwarranted certainty, narratives employ strictly cautious language:
* Uses: *“indicates”*, *“suggests”*, *“may indicate”*, *“increases concern”*.
* Never claims that a catastrophic problem *will* happen.
* Never fabricates incidents, statistics, or hallucinations.

---

### Evidence API Endpoints

#### 1. `GET /api/evidence/{signal_id}`
Returns structured evidence items, evidence-strength classification, M7 risk metrics, and the explainability narrative for a specific signal.

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/evidence/1
```

**Example Response (`200 OK`):**
```json
{
  "signal_id": 1,
  "signal_title": "Water leakage detected near Server Room 3B",
  "summary": "High-severity infrastructure report ('Water leakage detected near Server Room 3B') was observed near 'Building 2, 3rd Floor'. The category has 2 recorded event(s) across the monitored cohort. 2 semantically related signal(s) and repeated location reports suggest an emerging precursor pattern. Active status ('open') and a composite risk score of 78 (CRITICAL / Priority HIGH) increase concern for operational escalation.",
  "evidence_strength": "HIGH",
  "evidence": [
    {
      "type": "PRIMARY_SIGNAL",
      "description": "Water leakage detected near Server Room 3B. Slow dripping observed from ceiling tile above network rack 4.",
      "signal_id": 1,
      "timestamp": "2026-10-06T17:30:00Z",
      "location": "Building 2, 3rd Floor",
      "severity": "high",
      "contribution_factor": "severity",
      "contribution_points": 19
    },
    {
      "type": "SEVERITY",
      "description": "Assessed operational severity 'high' contributes 19 risk points to problem prioritization.",
      "signal_id": 1,
      "severity": "high",
      "contribution_factor": "severity",
      "contribution_points": 19
    },
    {
      "type": "RELATED_SIGNAL",
      "description": "Corroborating incident #14: 'Moisture accumulation near electrical panel' detected with 0.89 semantic cosine similarity.",
      "signal_id": 14,
      "similarity": 0.8924,
      "location": "Building 2, Basement",
      "severity": "high",
      "contribution_factor": "related_signals",
      "contribution_points": 10
    },
    {
      "type": "RECURRENCE",
      "description": "1 prior incident(s) previously recorded near 'Building 2, 3rd Floor'; chronic pattern indicators observed in report text ('dripping').",
      "location": "Building 2, 3rd Floor",
      "contribution_factor": "recurrence",
      "contribution_points": 16
    },
    {
      "type": "FREQUENCY",
      "description": "Category 'infrastructure' has 2 recorded signal(s) in the active cohort, contributing 18 frequency points.",
      "contribution_factor": "frequency",
      "contribution_points": 18
    },
    {
      "type": "TREND",
      "description": "Operational lifecycle status is 'open', contributing 15 trend points to urgency.",
      "timestamp": "2026-10-06T17:30:00Z",
      "contribution_factor": "trend",
      "contribution_points": 15
    }
  ],
  "risk_score": 78,
  "risk_level": "CRITICAL",
  "priority": "HIGH",
  "factors": {
    "severity": 19,
    "frequency": 18,
    "recurrence": 16,
    "related_signals": 10,
    "trend": 15
  },
  "evaluated_at": "2026-10-07T08:15:00Z"
}
```

#### 2. `GET /api/evidence`
Returns structured evidence summaries across all available signals, ordered by `risk_score` descending.

**Query Parameters:**
* `evidence_strength` (string, optional): Filter by `LOW`, `MODERATE`, `HIGH` (case-insensitive).
* `risk_level` (string, optional): Filter by `LOW`, `MODERATE`, `HIGH`, `CRITICAL` (case-insensitive).
* `minimum_score` (int, 0–100, optional): Filter signals with `risk_score >= minimum_score`.
* `skip` (int, default: 0): Records to skip for pagination.
* `limit` (int, 1–100, default: 50): Maximum number of records to return.

**Example Request:**
```bash
curl "http://127.0.0.1:8000/api/evidence?evidence_strength=HIGH&limit=10"
```

---

### Degraded-State Handling & Offline Resilience

* **Database Offline**: Endpoints catch PostgreSQL connection failures cleanly and return `HTTP 503 Service Unavailable` (`{"status": "unavailable", "message": "Database service is currently unavailable. Please verify PostgreSQL connection."}`).
* **Embeddings / OpenAI Offline**: If OpenAI API key is missing or embedding generation fails, the evidence service does not crash or fabricate related signals. It emits a factual degraded item: `"Related-signal evidence could not be fully evaluated because the embedding service or database is currently offline."` and proceeds safely.
* **AI Analysis Offline**: When structured AI analysis is absent, evidence is assembled strictly from verified native attributes (`severity`, `location`, `status`, `source`, `created_at`, cohort frequency, and recurrence).
* **Missing Signal**: Returns `HTTP 404 Not Found` (`{"detail": "Signal with ID {signal_id} not found."}`).
* **Invalid Signal ID**: Path validation returns `HTTP 422 Unprocessable Entity` for IDs $\le 0$.

---

## 14. Milestone 9 — Actions & Resolution Lifecycle

Milestone 9 provides an operational action tracking system that turns detected risks into accountable, preventive mitigation workflows.

### Workflow & State Machine

```
Risk Identified (M7 / M8)
      │
      ▼
   [ OPEN ] ──────────────────────────────────────────┐
      │                                                │
      ├───────────────────────┐                        │
      ▼                       ▼                        │
 [ ASSIGNED ] ─────────► [ IN_PROGRESS ]               │
      │                       │                        │
      └──────────┐            │                        │
                 ▼            ▼                        ▼
           [ CANCELLED ]   [ COMPLETED ] ───────► [ CANCELLED ]
                              │
                              ▼
                         [ VERIFIED ] ──────────► [ CANCELLED ]
                              │
                              ▼
                         [ RESOLVED ]
```

#### Valid Lifecycle Transitions

| Source Status | Permitted Target Statuses | Lifecycle Action Endpoint / Method |
| :--- | :--- | :--- |
| `OPEN` | `ASSIGNED`, `IN_PROGRESS`, `CANCELLED` | `POST /api/actions/{id}/assign`, `PATCH` |
| `ASSIGNED` | `IN_PROGRESS`, `ASSIGNED` (reassign), `CANCELLED` | `PATCH`, `POST /api/actions/{id}/cancel` |
| `IN_PROGRESS`| `COMPLETED`, `CANCELLED` | `POST /api/actions/{id}/complete`, `PATCH` |
| `COMPLETED` | `VERIFIED`, `CANCELLED` | `POST /api/actions/{id}/verify`, `PATCH` |
| `VERIFIED` | `RESOLVED`, `CANCELLED` | `POST /api/actions/{id}/resolve`, `PATCH` |
| `RESOLVED` | *None (Terminal)* | Terminal state |
| `CANCELLED` | *None (Terminal)* | Terminal state |

Direct jumps such as `OPEN → RESOLVED` or `IN_PROGRESS → RESOLVED` are rejected with `HTTP 400 Bad Request`.

### Lifecycle Timestamp Guarantees

* `completed_at`: Automatically stamped with the UTC timestamp when reaching `COMPLETED`.
* `verified_at`: Automatically stamped with the UTC timestamp when reaching `VERIFIED`.
* `resolution_notes`: Recorded during completion, verification, or resolution.

### Risk Integration (M7)

When creating an action from an originating signal:
1. Originating signal is retrieved from PostgreSQL.
2. `risk_service.score_signal()` evaluates current composite risk score ($0–100$) and priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
3. If `priority` is omitted in the request, it automatically defaults to the calculated risk priority.
4. The exact `risk_score` is persisted on the `Action` record for immutable audit traceability.

### Action API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/actions` | Create a preventive action linked to a signal |
| `GET` | `/api/actions` | List actions with filtering (`status`, `priority`, `signal_id`, `assigned_to`) & pagination |
| `GET` | `/api/actions/{id}` | Retrieve specific action details |
| `PATCH` | `/api/actions/{id}` | Update action attributes (title, assigned_to, due_date, status) |
| `POST` | `/api/actions/{id}/assign` | Assign action to an owner (`OPEN → ASSIGNED` or reassignment) |
| `POST` | `/api/actions/{id}/complete` | Mark action work complete (`IN_PROGRESS → COMPLETED`) |
| `POST` | `/api/actions/{id}/verify` | Verify resolution efficacy (`COMPLETED → VERIFIED`) |
| `POST` | `/api/actions/{id}/resolve` | Finalize action resolution (`VERIFIED → RESOLVED`) |
| `POST` | `/api/actions/{id}/cancel` | Cancel an active action (`* → CANCELLED`) |

#### Example: Create Action (`POST /api/actions`)

**Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/actions \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 1,
    "title": "Replace leaking valve above Server Room 3B",
    "description": "Engage facilities plumbing contractor to replace faulty seal.",
    "assigned_to": "facilities-team"
  }'
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "signal_id": 1,
  "risk_score": 78,
  "title": "Replace leaking valve above Server Room 3B",
  "description": "Engage facilities plumbing contractor to replace faulty seal.",
  "assigned_to": "facilities-team",
  "status": "ASSIGNED",
  "priority": "HIGH",
  "due_date": null,
  "created_at": "2026-10-07T08:30:00Z",
  "updated_at": "2026-10-07T08:30:00Z",
  "completed_at": null,
  "verified_at": null,
  "resolution_notes": null
}
```

#### Example: Complete, Verify, Resolve Flow

1. **Complete:**
```bash
curl -X POST http://127.0.0.1:8000/api/actions/1/complete \
  -H "Content-Type: application/json" \
  -d '{"resolution_notes": "Plumbing valve replaced and pressure tested."}'
```
2. **Verify:**
```bash
curl -X POST http://127.0.0.1:8000/api/actions/1/verify \
  -H "Content-Type: application/json" \
  -d '{"verification_notes": "Ceiling inspected after 24 hours. Zero moisture detected."}'
```
3. **Resolve:**
```bash
curl -X POST http://127.0.0.1:8000/api/actions/1/resolve \
  -H "Content-Type: application/json" \
  -d '{"final_notes": "Action verified effective and closed."}'
```

### Degraded-State & Resilience

* **Database Offline**: Handled cleanly with `HTTP 503 Service Unavailable` (`{"status": "unavailable", "message": "Database service is currently unavailable. Please verify PostgreSQL connection."}`).
* **External AI Offline**: Action lifecycle transitions and CRUD execute completely deterministically without calling external OpenAI APIs.
* **Nonexistent Signal**: Returns `HTTP 404 Not Found` when attempting to link an action to a missing signal.

---

## 15. Milestone 10 — Full System Integration & Degraded-Mode Verification

Milestone 10 consolidates all components (M1 through M9) into a fully integrated, tested, and resilient operational early-warning pipeline.

### End-to-End Operational Pipeline

```
[ Signal Ingested ] (POST /api/signals)
        │
        ▼
[ AI Signal Analysis ] (POST /api/ai/analyze-signal/{id})
        │
        ▼
[ Related Signal Detection ] (POST /api/signals/{id}/related)
        │
        ▼
[ Risk Scoring & Tiering ] (GET /api/risks/{id})
        │
        ▼
[ Evidence & Explainability ] (GET /api/evidence/{id})
        │
        ▼
[ Preventive Action Created ] (POST /api/actions)
        │
        ▼
[ Assigned ] ──► [ In Progress ] ──► [ Completed ] ──► [ Verified ] ──► [ Resolved ]
```

### Complete API Route Directory (22 Verified Endpoints)

| Group | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | Root API service information |
| **System** | `GET` | `/api/health` | Health & dependency status (`database`, `ai`, `embeddings`) |
| **Signals** | `GET` | `/api/signals` | Paginated operational signals list |
| **Signals** | `POST` | `/api/signals` | Create operational signal |
| **Signals** | `GET` | `/api/signals/{id}` | Retrieve signal details |
| **Signals** | `PATCH` | `/api/signals/{id}` | Update signal attributes |
| **Signals** | `DELETE`| `/api/signals/{id}` | Delete signal record |
| **Signals** | `POST` | `/api/signals/{id}/related`| Semantic cosine similarity precursor detection |
| **AI** | `POST` | `/api/ai/analyze-signal/{id}`| Structured LLM operational reasoning |
| **Risks** | `GET` | `/api/risks` | Cohort risk ranking with filters & pagination |
| **Risks** | `GET` | `/api/risks/{id}` | 5-factor composite risk breakdown ($0–100$) |
| **Evidence**| `GET` | `/api/evidence` | Cohort evidence summaries & strength rating |
| **Evidence**| `GET` | `/api/evidence/{id}` | Fact-grounded evidence & explainability narrative |
| **Actions** | `GET` | `/api/actions` | Preventive actions registry with filters & pagination |
| **Actions** | `POST` | `/api/actions` | Convert risk to preventive action |
| **Actions** | `GET` | `/api/actions/{id}` | Retrieve action details & lifecycle timestamps |
| **Actions** | `PATCH` | `/api/actions/{id}` | Update action attributes & validated state transitions |
| **Actions** | `POST` | `/api/actions/{id}/assign` | Assign action to responder (`OPEN → ASSIGNED`) |
| **Actions** | `POST` | `/api/actions/{id}/complete`| Record remediation completion (`IN_PROGRESS → COMPLETED`) |
| **Actions** | `POST` | `/api/actions/{id}/verify` | Verify resolution efficacy (`COMPLETED → VERIFIED`) |
| **Actions** | `POST` | `/api/actions/{id}/resolve`| Finalize action closure (`VERIFIED → RESOLVED`) |
| **Actions** | `POST` | `/api/actions/{id}/cancel` | Cancel active action (`* → CANCELLED`) |

### Automated Test Suite Execution

Run the complete test suite across all milestones:

```bash
python -m unittest discover -v -s backend/tests
```

Individual test modules:
```bash
python -m unittest -v backend.tests.test_risk_scoring      # M7: 20 tests
python -m unittest -v backend.tests.test_evidence          # M8: 25 tests
python -m unittest -v backend.tests.test_actions           # M9: 15 tests
python -m unittest -v backend.tests.test_m10_integration    # M10: 12 tests
```

### Degraded-Mode & Operational Resilience Matrix

| Failure Condition | System Response | Safeguard Guarantee |
| :--- | :--- | :--- |
| **PostgreSQL Offline** | `HTTP 503 Service Unavailable` on affected routes; `/api/health` reports `"status": "degraded"` | Fails cleanly without hanging or crashing; zero corrupted writes |
| **Missing OpenAI Key** | `HTTP 503` on `/api/ai/*` and `/api/signals/{id}/related`; `/api/health` reports `"ai": "unavailable"` | Risk scoring (M7), evidence (M8), and actions (M9) continue running deterministically |
| **OpenAI Upstream Outage** | `HTTP 503` with actionable error message | Graceful error boundary; no 500 internal server crashes |
| **Embeddings Offline** | `GET /api/evidence/{id}` succeeds with factual degraded notice | Factual evidence is still assembled from verified attributes; zero fabricated precursor signals |
| **Missing Resource** | `HTTP 404 Not Found` across all endpoints | Clear error details for nonexistent signal or action IDs |
| **Illegal State Transition** | `HTTP 400 Bad Request` | State machine rejects invalid transitions (e.g., `OPEN → RESOLVED`) |




