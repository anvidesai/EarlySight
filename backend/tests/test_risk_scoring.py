"""
Unit tests for Milestone 7: Risk Scoring and Prioritization.
Tests cover:
- Low-risk signal
- Moderate-risk signal
- High-risk signal
- Critical-risk signal
- Score boundary values
- Deterministic scoring
- Missing signal (404)
- Empty related-signal data
- Unavailable AI (no OpenAI key required)
- Unavailable database (503 handling)
- Risk-level mapping
- Priority mapping
- Dynamic explanation generation
- List endpoint query filters
- OpenAPI schema registration
"""

from datetime import datetime, timezone, timedelta
from pathlib import Path
import sys
import unittest
from unittest.mock import MagicMock, patch

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy.exc import OperationalError, SQLAlchemyError
from starlette.testclient import TestClient

from app.database import get_db
from app.main import app
from app.models.signal import Signal
from app.schemas.ai import SignalAnalysisOutput
from app.schemas.embedding import RelatedSignalItem
from app.schemas.risk import RiskFactorBreakdown, RiskScoreResponse
from app.services.risk_service import (
    RiskScoringConfig,
    RiskScoringService,
    risk_service,
)


class TestRiskScoringHeuristic(unittest.TestCase):
    """Unit tests for the deterministic risk scoring service."""

    def setUp(self):
        self.service = RiskScoringService()
        self.now = datetime.now(timezone.utc)

    def test_low_risk_signal(self):
        """A low severity, resolved signal with no related signals should score in the LOW range (0-24)."""
        signal = {
            "id": 1,
            "title": "Loose baseboard molding in lobby",
            "description": "Cosmetic trim detached from wall.",
            "category": "other",
            "location": "Lobby",
            "severity": "low",
            "status": "resolved",
            "source": "manual",
            "created_at": self.now - timedelta(days=45),
        }
        res = self.service.score_signal(signal, reference_time=self.now)
        self.assertIsInstance(res, RiskScoreResponse)
        self.assertLessEqual(res.risk_score, 24)
        self.assertEqual(res.risk_level, "LOW")
        self.assertEqual(res.priority, "LOW")
        self.assertIn("Low assessed severity", res.explanation)

    def test_moderate_risk_signal(self):
        """A medium severity signal with moderate reporting frequency and investigating status should score 25-49."""
        signal = {
            "id": 2,
            "title": "Restroom exhaust fan rattling",
            "description": "Vibration heard when fan engages.",
            "category": "maintenance",
            "location": "Restroom 2F",
            "severity": "medium",
            "status": "investigating",
            "source": "complaint",
            "created_at": self.now - timedelta(days=5),
        }
        res = self.service.score_signal(signal, reference_time=self.now)
        self.assertGreaterEqual(res.risk_score, 25)
        self.assertLessEqual(res.risk_score, 49)
        self.assertEqual(res.risk_level, "MODERATE")
        self.assertEqual(res.priority, "MEDIUM")

    def test_high_risk_signal(self):
        """A high severity signal with recurrence and related signals should score 50-74."""
        signal = {
            "id": 3,
            "title": "Persistent water dripping near distribution board",
            "description": "Chronic moisture recurrence observed over weekend.",
            "category": "infrastructure",
            "location": "Electrical Room",
            "severity": "high",
            "status": "open",
            "source": "maintenance_report",
            "created_at": self.now - timedelta(hours=6),
        }
        related = [
            {"similarity": 0.85, "title": "Moisture detected"},
            {"similarity": 0.78, "title": "Pipe condensation"},
        ]
        candidates = [
            {"category": "infrastructure", "location": "Electrical Room"},
            {"category": "infrastructure", "location": "Hallway"},
        ]
        res = self.service.score_signal(
            signal,
            related_signals=related,
            candidate_signals=candidates,
            reference_time=self.now,
        )
        self.assertGreaterEqual(res.risk_score, 50)
        self.assertLessEqual(res.risk_score, 74)
        self.assertEqual(res.risk_level, "HIGH")
        self.assertEqual(res.priority, "HIGH")
        self.assertGreater(res.factors.recurrence, 10)
        self.assertGreater(res.factors.related_signals, 0)

    def test_critical_risk_signal(self):
        """A critical severity open signal with frequent category occurrences, recurrence, and related signals scores 75-100."""
        signal = {
            "id": 4,
            "title": "Severe chemical leak with persistent accumulation and alarm trip",
            "description": "Chronic repeated overflow spreading toward power supplies.",
            "category": "safety",
            "location": "Hazmat Sector B",
            "severity": "critical",
            "status": "open",
            "source": "sensor",
            "created_at": self.now - timedelta(hours=1),
        }
        related = [
            {"similarity": 0.95},
            {"similarity": 0.91},
            {"similarity": 0.88},
            {"similarity": 0.86},
        ]
        candidates = [
            {"category": "safety", "location": "Hazmat Sector B"},
            {"category": "safety", "location": "Hazmat Sector B"},
            {"category": "safety", "location": "Hazmat Sector B"},
            {"category": "safety", "location": "Hazmat Sector A"},
            {"category": "safety", "location": "Hazmat Sector A"},
            {"category": "safety", "location": "Hazmat Sector C"},
        ]
        res = self.service.score_signal(
            signal,
            related_signals=related,
            candidate_signals=candidates,
            reference_time=self.now,
        )
        self.assertGreaterEqual(res.risk_score, 75)
        self.assertEqual(res.risk_level, "CRITICAL")
        self.assertEqual(res.priority, "CRITICAL")
        self.assertIn("Critical operational severity", res.explanation)

    def test_score_boundary_values(self):
        """Verifies exact risk level boundaries: 0-24, 25-49, 50-74, 75-100."""
        self.assertEqual(self.service.determine_risk_level(0), "LOW")
        self.assertEqual(self.service.determine_risk_level(24), "LOW")
        self.assertEqual(self.service.determine_risk_level(25), "MODERATE")
        self.assertEqual(self.service.determine_risk_level(49), "MODERATE")
        self.assertEqual(self.service.determine_risk_level(50), "HIGH")
        self.assertEqual(self.service.determine_risk_level(74), "HIGH")
        self.assertEqual(self.service.determine_risk_level(75), "CRITICAL")
        self.assertEqual(self.service.determine_risk_level(100), "CRITICAL")

    def test_priority_mapping(self):
        """Verifies priority boundaries: <30 LOW, 30-59 MEDIUM, 60-79 HIGH, >=80 CRITICAL."""
        self.assertEqual(self.service.determine_priority(15), "LOW")
        self.assertEqual(self.service.determine_priority(29), "LOW")
        self.assertEqual(self.service.determine_priority(30), "MEDIUM")
        self.assertEqual(self.service.determine_priority(59), "MEDIUM")
        self.assertEqual(self.service.determine_priority(60), "HIGH")
        self.assertEqual(self.service.determine_priority(78), "HIGH")  # Example in spec!
        self.assertEqual(self.service.determine_priority(79), "HIGH")
        self.assertEqual(self.service.determine_priority(80), "CRITICAL")
        self.assertEqual(self.service.determine_priority(95), "CRITICAL")

    def test_deterministic_scoring(self):
        """Calling score_signal multiple times with identical input produces identical output."""
        signal = {
            "id": 10,
            "title": "HVAC unit failure in data hall",
            "description": "Temperature rising rapidly.",
            "category": "equipment",
            "location": "Data Hall 1",
            "severity": "high",
            "status": "open",
            "source": "sensor",
            "created_at": self.now - timedelta(hours=2),
        }
        res1 = self.service.score_signal(signal, reference_time=self.now)
        res2 = self.service.score_signal(signal, reference_time=self.now)
        self.assertEqual(res1.risk_score, res2.risk_score)
        self.assertEqual(res1.risk_level, res2.risk_level)
        self.assertEqual(res1.priority, res2.priority)
        self.assertEqual(res1.factors.model_dump(), res2.factors.model_dump())
        self.assertEqual(res1.explanation, res2.explanation)

    def test_empty_related_signal_data(self):
        """When related signals data is empty or None, factor is 0 and evaluation succeeds gracefully."""
        signal = {
            "id": 11,
            "title": "Pavement crack near gate",
            "category": "infrastructure",
            "severity": "low",
            "status": "open",
            "source": "manual",
        }
        res_empty = self.service.score_signal(signal, related_signals=[], reference_time=self.now)
        self.assertEqual(res_empty.factors.related_signals, 0)
        self.assertIn("no semantically related precursors detected", res_empty.explanation)

        res_failed = self.service.score_signal(
            signal,
            related_signals=None,
            related_eval_failed=True,
            reference_time=self.now,
        )
        self.assertEqual(res_failed.factors.related_signals, 0)
        self.assertIn("could not be fully evaluated", res_failed.explanation)

    def test_unavailable_ai(self):
        """Scoring operates completely deterministically when AI is None/unavailable."""
        signal = {
            "id": 12,
            "title": "Elevator door sensor glitch",
            "category": "equipment",
            "severity": "medium",
            "status": "open",
            "source": "sensor",
        }
        res = self.service.score_signal(signal, ai_analysis=None, reference_time=self.now)
        self.assertIsInstance(res.risk_score, int)
        self.assertNotIn("AI context", res.explanation)

    def test_with_ai_analysis_enhancement(self):
        """When structured AI analysis is passed, severity and explanation utilize the insights."""
        signal = {
            "id": 13,
            "title": "Water dripping near Server Rack 4",
            "category": "infrastructure",
            "severity": "medium",  # Originally medium
            "status": "open",
            "source": "manual",
        }
        ai_output = SignalAnalysisOutput(
            summary="Water dripping onto high-voltage racks creates immediate arc hazard.",
            category="infrastructure",
            severity="critical",  # AI assessed critical
            key_evidence=["Dripping above Rack 4"],
            recommended_attention="Isolate water supply immediately.",
            reasoning="Direct proximity to high-density power creates high arc-flash hazard.",
        )
        res = self.service.score_signal(signal, ai_analysis=ai_output, reference_time=self.now)
        # Severity should reflect critical (25 points instead of 12 points)
        self.assertEqual(res.factors.severity, 25)
        self.assertIn("AI context", res.explanation)


class TestRiskEndpoints(unittest.TestCase):
    """Integration tests for FastAPI /api/risks and /api/risks/{signal_id} endpoints."""

    def setUp(self):
        self.client = TestClient(app)

    def test_get_signal_risk_success(self):
        """GET /api/risks/{signal_id} calculates and returns risk response for an existing signal."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="Water leakage near Server Room 3B",
            description="Continuous dripping observed from ceiling.",
            category="infrastructure",
            location="Building 2, 3rd Floor",
            severity="high",
            status="open",
            source="maintenance_report",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        mock_db.get.return_value = mock_signal
        mock_db.scalars.return_value.all.return_value = []

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks/1")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["signal_id"], 1)
            self.assertEqual(data["signal_title"], "Water leakage near Server Room 3B")
            self.assertIn("risk_score", data)
            self.assertIn("risk_level", data)
            self.assertIn("priority", data)
            self.assertIn("factors", data)
            self.assertIn("explanation", data)
            self.assertEqual(data["factors"]["severity"], 19)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_signal_risk_missing_signal_404(self):
        """GET /api/risks/{signal_id} returns 404 when signal does not exist."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks/9999")
            self.assertEqual(resp.status_code, 404)
            self.assertIn("Signal with ID 9999 not found", resp.json()["detail"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_signal_risk_database_unavailable_503(self):
        """GET /api/risks/{signal_id} returns 503 degraded response when DB is unreachable."""
        mock_db = MagicMock()
        mock_db.get.side_effect = OperationalError("connection refused", {}, None)

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks/1")
            self.assertEqual(resp.status_code, 503)
            data = resp.json()
            self.assertEqual(data["status"], "unavailable")
            self.assertIn("Database service is currently unavailable", data["message"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_risks_success(self):
        """GET /api/risks returns a list of evaluated signals sorted descending by risk_score."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        s1 = Signal(
            id=1,
            title="Minor paint scratch",
            category="other",
            severity="low",
            status="resolved",
            source="manual",
            created_at=now,
            updated_at=now,
        )
        s2 = Signal(
            id=2,
            title="Critical electrical arcing in substation",
            description="Persistent sparks detected near high-voltage breaker.",
            category="safety",
            severity="critical",
            status="open",
            source="sensor",
            created_at=now,
            updated_at=now,
        )
        mock_db.scalars.return_value.all.return_value = [s1, s2]

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 2)
            # Must be sorted descending by risk score
            self.assertGreater(data[0]["risk_score"], data[1]["risk_score"])
            self.assertEqual(data[0]["signal_id"], 2)
            self.assertEqual(data[0]["risk_level"], "HIGH")
            self.assertEqual(data[1]["signal_id"], 1)
            self.assertEqual(data[1]["risk_level"], "LOW")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_risks_filtering(self):
        """GET /api/risks supports risk_level and minimum_score query filters."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        s1 = Signal(
            id=1,
            title="Low issue",
            category="other",
            severity="low",
            status="resolved",
            source="manual",
            created_at=now,
            updated_at=now,
        )
        s2 = Signal(
            id=2,
            title="High hazard",
            description="Persistent alarm.",
            category="safety",
            severity="critical",
            status="open",
            source="sensor",
            created_at=now,
            updated_at=now,
        )
        mock_db.scalars.return_value.all.return_value = [s1, s2]

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # Filter by HIGH
            resp = self.client.get("/api/risks?risk_level=HIGH")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 1)
            self.assertEqual(data[0]["signal_id"], 2)

            # Filter by LOW
            resp_low = self.client.get("/api/risks?risk_level=LOW")
            self.assertEqual(resp_low.status_code, 200)
            data_low = resp_low.json()
            self.assertEqual(len(data_low), 1)
            self.assertEqual(data_low[0]["signal_id"], 1)

            # Filter by minimum_score=50
            resp_min = self.client.get("/api/risks?minimum_score=50")
            self.assertEqual(resp_min.status_code, 200)
            data_min = resp_min.json()
            self.assertEqual(len(data_min), 1)
            self.assertEqual(data_min[0]["signal_id"], 2)
            self.assertGreaterEqual(data_min[0]["risk_score"], 50)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_risks_database_unavailable_503(self):
        """GET /api/risks returns 503 degraded response when DB is unreachable."""
        mock_db = MagicMock()
        mock_db.scalars.side_effect = OperationalError("connection refused", {}, None)

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks")
            self.assertEqual(resp.status_code, 503)
            data = resp.json()
            self.assertEqual(data["status"], "unavailable")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_openapi_registration(self):
        """Verifies that all M1-M7 endpoints are properly registered in FastAPI OpenAPI schema."""
        openapi_schema = app.openapi()
        paths = openapi_schema["paths"]
        self.assertIn("/api/risks", paths)
        self.assertIn("/api/risks/{signal_id}", paths)
        self.assertIn("/api/signals", paths)
        self.assertIn("/api/signals/{signal_id}", paths)
        self.assertIn("/api/signals/{signal_id}/related", paths)
        self.assertIn("/api/ai/analyze-signal/{signal_id}", paths)
        self.assertIn("/api/health", paths)
        self.assertIn("/", paths)

    def test_invalid_signal_id_validation_422(self):
        """GET /api/risks/{signal_id} returns 422 validation error when signal_id is invalid (e.g. 0 or negative)."""
        resp = self.client.get("/api/risks/0")
        self.assertEqual(resp.status_code, 422)

    def test_list_risks_pagination(self):
        """GET /api/risks correctly applies skip and limit pagination."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        signals = [
            Signal(
                id=i,
                title=f"Signal {i}",
                category="maintenance",
                severity="medium",
                status="open",
                source="sensor",
                created_at=now,
                updated_at=now,
            )
            for i in range(1, 11)
        ]
        mock_db.scalars.return_value.all.return_value = signals

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/risks?skip=2&limit=3")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 3)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_spec_example_breakdown_structure(self):
        """Directly verifies the spec example values: score 78 -> CRITICAL, priority HIGH, factors matching."""
        factors = RiskFactorBreakdown(
            severity=20,
            frequency=18,
            recurrence=15,
            related_signals=15,
            trend=10,
        )
        score = (
            factors.severity
            + factors.frequency
            + factors.recurrence
            + factors.related_signals
            + factors.trend
        )
        self.assertEqual(score, 78)
        level = risk_service.determine_risk_level(score)
        priority = risk_service.determine_priority(score)
        self.assertEqual(level, "CRITICAL")
        self.assertEqual(priority, "HIGH")


if __name__ == "__main__":
    unittest.main()
