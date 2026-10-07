# EarlySight Backend

The **EarlySight Backend** is an operational intelligence API service built with **Python**, **FastAPI**, **SQLAlchemy 2.x**, **psycopg**, and **Uvicorn**. It provides the core service layer for early-warning problem synthesis, multi-modal signal aggregation, and PostgreSQL data persistence.

---

## Architecture & Project Structure

```text
backend/
├── app/
│   ├── __init__.py        # App package marker & version definition
│   ├── main.py            # FastAPI entry point, lifespan initialization & routers
│   ├── config.py          # Configuration: DATABASE_URL, CORS, & OPENAI settings
│   ├── database.py        # SQLAlchemy engine, SessionLocal, Base model & DB check
│   ├── models/            # SQLAlchemy database models
│   │   ├── __init__.py    # Models package marker (exports Signal)
│   │   └── signal.py      # Signal domain model
│   ├── schemas/           # Pydantic validation schemas
│   │   ├── __init__.py    # Schemas package marker (exports Signal, AI, & Embedding schemas)
│   │   ├── signal.py      # SignalCreate, SignalUpdate, SignalResponse schemas
│   │   ├── ai.py          # SignalAnalysisOutput, SignalAnalysisResponse schemas
│   │   └── embedding.py   # RelatedSignalItem, RelatedSignalsResponse schemas
│   ├── services/          # Business logic & external AI integrations
│   │   ├── __init__.py    # Services package marker (exports AIService, EmbeddingService)
│   │   ├── ai_service.py  # Reusable OpenAI service & structured signal analysis
│   │   └── embedding_service.py # Vector embedding generation & cosine similarity engine
│   └── api/               # REST API route handlers
│       ├── __init__.py    # API package marker (exports signals_router, ai_router)
│       ├── signals.py     # Signal CRUD endpoints, pagination & related signals
│       └── ai.py          # AI analysis endpoint (POST /api/ai/analyze-signal)
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


