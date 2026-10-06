# EarlySight Backend

The **EarlySight Backend** is an operational intelligence API service built with **Python**, **FastAPI**, and **Uvicorn**. It provides the core service layer for early-warning problem synthesis, multi-modal signal aggregation, and system health monitoring.

---

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py        # App package marker & version definition
│   ├── main.py            # FastAPI application entry point & routes
│   ├── config.py          # Minimal environment & application configuration
│   └── api/
│       └── __init__.py    # API package marker
├── requirements.txt       # Core project dependencies (FastAPI, Uvicorn)
└── README.md              # Backend documentation & quickstart instructions
```

---

## Getting Started

### 1. Prerequisites

Ensure you have Python 3.10+ installed on your system:

```bash
python --version
```

---

### 2. Create a Python Virtual Environment

Navigate to the `backend` directory and create an isolated virtual environment:

```bash
cd backend
python -m venv venv
```

---

### 3. Activate the Virtual Environment

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

---

### 4. Install Dependencies

Install the required packages using `pip`:

```bash
pip install -r requirements.txt
```

---

### 5. Start the Development Server

Run the development server using **Uvicorn** with hot-reloading:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Alternatively, run directly with Python:

```bash
python -m app.main
```

The server will start at:
* **API Base URL**: `http://127.0.0.1:8000`
* **Interactive API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
* **Alternative API Docs (ReDoc)**: `http://127.0.0.1:8000/redoc`

---

## Endpoints

### 1. Root Endpoint

* **URL**: `GET /`
* **Response**:
  ```json
  {
    "message": "EarlySight Backend API"
  }
  ```

### 2. Health Check

* **URL**: `GET /api/health`
* **Response**:
  ```json
  {
    "status": "healthy",
    "service": "EarlySight Backend"
  }
  ```

---

## Testing the API

Using `curl`:

```bash
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/api/health
```

Using PowerShell:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/health
```
