# EarlySight Backend

The **EarlySight Backend** is an operational intelligence API service built with **Python**, **FastAPI**, **SQLAlchemy 2.x**, **psycopg**, and **Uvicorn**. It provides the core service layer for early-warning problem synthesis, multi-modal signal aggregation, and PostgreSQL data persistence.

---

## Architecture & Project Structure

```text
backend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ __init__.py        # App package marker & version definition
â”‚   â”œâ”€â”€ main.py            # FastAPI entry point, lifespan initialization & routers
â”‚   â”œâ”€â”€ config.py          # Application configuration & DATABASE_URL settings
â”‚   â”œâ”€â”€ database.py        # SQLAlchemy engine, SessionLocal, Base model & DB check
â”‚   â”œâ”€â”€ models/            # SQLAlchemy database models
â”‚   â”‚   â”œâ”€â”€ __init__.py    # Models package marker (exports Signal)
â”‚   â”‚   â””â”€â”€ signal.py      # Signal domain model
â”‚   â”œâ”€â”€ schemas/           # Pydantic request & response validation schemas
â”‚   â”‚   â”œâ”€â”€ __init__.py    # Schemas package marker (exports Signal schemas)
â”‚   â”‚   â””â”€â”€ signal.py      # SignalCreate, SignalUpdate, SignalResponse schemas
â”‚   â””â”€â”€ api/               # REST API route handlers
â”‚       â”œâ”€â”€ __init__.py    # API package marker (exports signals_router)
â”‚       â””â”€â”€ signals.py     # Signal CRUD endpoints & pagination
â”œâ”€â”€ .env.example           # Template for environment variables (copy to .env)
â”œâ”€â”€ requirements.txt       # Dependencies (FastAPI, Uvicorn, SQLAlchemy, psycopg)
â””â”€â”€ README.md              # Documentation & beginner-friendly setup guide
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

## 9. Frontend â†” Backend Integration (Milestone 4)

The EarlySight frontend communicates with the FastAPI backend through a unified client service located at `src/js/api.js`.

### Architecture Flow

```text
EarlySight Frontend (Vite @ http://localhost:5173)
           â†“  fetch() HTTP requests
FastAPI Backend (Uvicorn @ http://127.0.0.1:8000)
           â†“  SQLAlchemy 2.x / psycopg
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
* The frontend (`signals.html`) cleanly catches this status and presents a clear, professional degraded state banner (`Backend Connected â€¢ PostgreSQL Database Offline (HTTP 503)`).
* The user can click **Retry API Request** or **View Reference Dataset** to inspect table filtering and explainability drawers without application disruption.
* When PostgreSQL is started locally, the next API request automatically connects and loads live signals from the database.
