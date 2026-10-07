"""
Unit tests for Milestone 8: Evidence and Explainability Layer.
Tests cover:
- Primary signal evidence
- Severity evidence
- Related signal evidence
- Recurrence evidence
- Frequency evidence
- Trend evidence
- Evidence strength classification (LOW, MODERATE, HIGH)
- Explanation generation (WHAT, WHERE, HOW OFTEN, IS it recurring, WHY it matters)
- M7 integration (reusing risk score, level, priority, factors)
- Missing signal (404)
- Database unavailable (503 handling)
- Unavailable embeddings (degraded mode note, no fabrication)
- Unavailable AI (no OpenAI key required, deterministic)
- Empty related-signal results
- Deterministic evidence generation
- Endpoint registration and query filters
"""

from datetime import datetime, timezone, timedelta
from pathlib import Path
import sys
import unittest
from unittest.mock import MagicMock

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy.exc import OperationalError
from starlette.testclient import TestClient

from app.database import get_db
from app.main import app
from app.models.signal import Signal
from app.schemas.ai import SignalAnalysisOutput
from app.schemas.evidence import EvidenceItem, EvidenceResponse
from app.schemas.risk import RiskFactorBreakdown, RiskScoreResponse
from app.services.evidence_service import EvidenceService, evidence_service
from app.services.risk_service import risk_service


class TestEvidenceService(unittest.TestCase):
    """Unit tests for EvidenceService logic, evidence items, and explainability."""

    def setUp(self):
        self.service = EvidenceService()
        self.now = datetime.now(timezone.utc)

    def test_primary_signal_evidence(self):
        """Verifies that PRIMARY_SIGNAL evidence item accurately captures observation, location, severity, and timestamp."""
        signal = {
            "id": 1,
            "title": "Water leakage near Server Room 3B",
            "description": "Continuous dripping from ceiling tile above Rack 4.",
            "category": "infrastructure",
            "location": "Building 2, 3rd Floor",
            "severity": "high",
            "status": "open",
            "source": "maintenance_report",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, reference_time=self.now)
        self.assertIsInstance(resp, EvidenceResponse)
        self.assertEqual(resp.signal_id, 1)

        primary_items = [e for e in resp.evidence if e.type == "PRIMARY_SIGNAL"]
        self.assertEqual(len(primary_items), 1)
        self.assertIn("Water leakage near Server Room 3B", primary_items[0].description)
        self.assertEqual(primary_items[0].location, "Building 2, 3rd Floor")
        self.assertEqual(primary_items[0].severity, "high")
        self.assertEqual(primary_items[0].contribution_factor, "severity")

    def test_severity_evidence(self):
        """Verifies SEVERITY evidence item captures evaluated severity and risk points."""
        signal = {
            "id": 2,
            "title": "Gas valve fluctuation",
            "category": "safety",
            "severity": "critical",
            "status": "open",
            "source": "sensor",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, reference_time=self.now)
        sev_items = [e for e in resp.evidence if e.type == "SEVERITY"]
        self.assertEqual(len(sev_items), 1)
        self.assertIn("critical", sev_items[0].description)
        self.assertEqual(sev_items[0].contribution_points, resp.factors.severity)

    def test_related_signal_evidence(self):
        """Verifies RELATED_SIGNAL items capture corroborating signal ID, title, and similarity score."""
        signal = {
            "id": 3,
            "title": "Moisture on server rack ceiling",
            "category": "infrastructure",
            "severity": "high",
            "status": "open",
            "created_at": self.now,
        }
        related = [
            {"signal_id": 14, "title": "Pipe condensation", "similarity": 0.88, "location": "Rack 2", "severity": "medium"},
            {"signal_id": 15, "title": "Standing puddle", "similarity": 0.79, "location": "Server Hall", "severity": "high"},
        ]
        resp = self.service.build_evidence(signal, related_signals=related, reference_time=self.now)
        rel_items = [e for e in resp.evidence if e.type == "RELATED_SIGNAL"]
        self.assertEqual(len(rel_items), 2)
        self.assertEqual(rel_items[0].signal_id, 14)
        self.assertEqual(rel_items[0].similarity, 0.88)
        self.assertIn("0.88", rel_items[0].description)

    def test_recurrence_evidence(self):
        """Verifies RECURRENCE item is generated when location matches in cohort or recurrence keywords exist."""
        signal = {
            "id": 4,
            "title": "Persistent water dripping",
            "description": "Chronic recurrence observed again.",
            "category": "infrastructure",
            "location": "Basement Substation",
            "severity": "high",
            "status": "open",
            "created_at": self.now,
        }
        candidates = [
            {"id": 5, "category": "infrastructure", "location": "Basement Substation"},
            {"id": 6, "category": "infrastructure", "location": "Basement Substation"},
        ]
        resp = self.service.build_evidence(signal, candidate_signals=candidates, reference_time=self.now)
        rec_items = [e for e in resp.evidence if e.type == "RECURRENCE"]
        self.assertEqual(len(rec_items), 1)
        self.assertIn("prior incident(s)", rec_items[0].description)
        self.assertIn("chronic", rec_items[0].description)

    def test_frequency_evidence(self):
        """Verifies FREQUENCY item notes category density across candidate signals."""
        signal = {
            "id": 7,
            "title": "Fire door latch failure",
            "category": "safety",
            "severity": "medium",
            "status": "open",
            "created_at": self.now,
        }
        candidates = [
            {"category": "safety"},
            {"category": "safety"},
            {"category": "safety"},
            {"category": "safety"},
        ]
        resp = self.service.build_evidence(signal, candidate_signals=candidates, reference_time=self.now)
        freq_items = [e for e in resp.evidence if e.type == "FREQUENCY"]
        self.assertEqual(len(freq_items), 1)
        self.assertIn("4 recorded signal(s)", freq_items[0].description)

    def test_trend_evidence(self):
        """Verifies TREND item reflects lifecycle velocity and urgency."""
        signal = {
            "id": 8,
            "title": "Air filter blocked",
            "category": "maintenance",
            "severity": "low",
            "status": "investigating",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, reference_time=self.now)
        trend_items = [e for e in resp.evidence if e.type == "TREND"]
        self.assertEqual(len(trend_items), 1)
        self.assertIn("investigating", trend_items[0].description)

    def test_evidence_strength_high(self):
        """A critical signal with multiple related signals, recurring location, and multi-source data gets HIGH strength."""
        signal = {
            "id": 10,
            "title": "Severe steam pipe rupture with persistent flooding",
            "description": "Chronic repeated leak spreading rapidly.",
            "category": "safety",
            "location": "Boiler Room B",
            "severity": "critical",
            "status": "open",
            "source": "sensor",
            "created_at": self.now,
        }
        related = [
            {"signal_id": 20, "similarity": 0.92, "title": "Pressure relief valve trip"},
            {"signal_id": 21, "similarity": 0.88, "title": "High temperature alert"},
            {"signal_id": 22, "similarity": 0.81, "title": "Water vapor detected"},
        ]
        candidates = [
            {"category": "safety", "location": "Boiler Room B", "source": "maintenance_report"},
            {"category": "safety", "location": "Boiler Room B", "source": "complaint"},
            {"category": "safety", "location": "Boiler Room A", "source": "sensor"},
            {"category": "safety", "location": "Boiler Room A", "source": "manual"},
        ]
        resp = self.service.build_evidence(
            signal,
            related_signals=related,
            candidate_signals=candidates,
            reference_time=self.now,
        )
        self.assertEqual(resp.evidence_strength, "HIGH")

    def test_evidence_strength_moderate(self):
        """A medium severity signal with 1 related signal or moderate category frequency gets MODERATE strength."""
        signal = {
            "id": 11,
            "title": "Conveyor belt alignment warning",
            "description": "Minor drift noticed on belt 3.",
            "category": "equipment",
            "location": "Packaging Zone",
            "severity": "medium",
            "status": "open",
            "source": "sensor",
            "created_at": self.now,
        }
        related = [
            {"signal_id": 30, "similarity": 0.74, "title": "Roller bearing squeak"},
        ]
        candidates = [
            {"category": "equipment", "location": "Assembly Zone", "source": "manual"},
            {"category": "equipment", "location": "Assembly Zone", "source": "sensor"},
        ]
        resp = self.service.build_evidence(
            signal,
            related_signals=related,
            candidate_signals=candidates,
            reference_time=self.now,
        )
        self.assertEqual(resp.evidence_strength, "MODERATE")

    def test_evidence_strength_low(self):
        """An isolated low-severity resolved signal without related signals gets LOW strength."""
        signal = {
            "id": 12,
            "title": "Scuffed signpost in visitor parking",
            "category": "other",
            "location": "Parking North",
            "severity": "low",
            "status": "resolved",
            "source": "manual",
            "created_at": self.now - timedelta(days=60),
        }
        resp = self.service.build_evidence(signal, reference_time=self.now)
        self.assertEqual(resp.evidence_strength, "LOW")

    def test_explanation_answers_all_dimensions(self):
        """Verifies summary narrative answers WHAT, WHERE, HOW OFTEN, IS it recurring, and WHY it matters with cautious words."""
        signal = {
            "id": 13,
            "title": "Chilled water supply leak",
            "category": "infrastructure",
            "location": "Data Center Wing C",
            "severity": "high",
            "status": "open",
            "source": "maintenance_report",
            "created_at": self.now,
        }
        related = [{"signal_id": 40, "similarity": 0.85, "title": "Moisture sensor alarm"}]
        candidates = [{"category": "infrastructure", "location": "Data Center Wing C"}]
        resp = self.service.build_evidence(
            signal,
            related_signals=related,
            candidate_signals=candidates,
            reference_time=self.now,
        )
        summary = resp.summary

        # WHAT & WHERE
        self.assertIn("Chilled water supply leak", summary)
        self.assertIn("Data Center Wing C", summary)

        # HOW OFTEN
        self.assertIn("category has 1 recorded event(s)", summary)

        # IS it recurring
        self.assertIn("semantically related signal(s)", summary)

        # WHY does it matter
        self.assertIn("risk score of", summary)

        # Cautious wording
        cautious_terms = ["suggest", "indicate", "may indicate", "increases concern"]
        has_cautious = any(term in summary.lower() for term in cautious_terms)
        self.assertTrue(has_cautious, f"Explanation must use cautious wording: {summary}")

    def test_m7_integration(self):
        """Verifies M7 risk score, risk level, priority, and factors are accurately integrated into EvidenceResponse."""
        signal = {
            "id": 14,
            "title": "Electrical panel overheating",
            "category": "safety",
            "location": "Panel 4B",
            "severity": "high",
            "status": "open",
            "source": "sensor",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, reference_time=self.now)
        self.assertIsInstance(resp.risk_score, int)
        self.assertIn(resp.risk_level, ["LOW", "MODERATE", "HIGH", "CRITICAL"])
        self.assertIn(resp.priority, ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        self.assertIsNotNone(resp.factors)
        self.assertGreater(resp.factors.severity, 0)

    def test_unavailable_embeddings(self):
        """When embedding service is unconfigured or offline, related-signal item and narrative note offline status without crashing."""
        signal = {
            "id": 15,
            "title": "Broken handrail",
            "category": "safety",
            "severity": "medium",
            "status": "open",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(
            signal,
            related_signals=None,
            related_eval_failed=True,
            reference_time=self.now,
        )
        rel_items = [e for e in resp.evidence if e.type == "RELATED_SIGNAL"]
        self.assertEqual(len(rel_items), 1)
        self.assertIn("could not be fully evaluated", rel_items[0].description)
        self.assertIn("offline", resp.summary.lower())

    def test_unavailable_ai(self):
        """Scoring and evidence synthesis operate deterministically when AI is None/unavailable."""
        signal = {
            "id": 16,
            "title": "Elevator squeal",
            "category": "equipment",
            "severity": "medium",
            "status": "open",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, ai_analysis=None, reference_time=self.now)
        self.assertNotIn("AI analysis notes", resp.summary)

    def test_with_ai_analysis_context(self):
        """When structured AI analysis is provided, AI reasoning is cited without calling external APIs."""
        signal = {
            "id": 17,
            "title": "Overhead drip",
            "category": "infrastructure",
            "severity": "medium",
            "status": "open",
            "created_at": self.now,
        }
        ai_output = SignalAnalysisOutput(
            summary="Water dripping above servers creates short-circuit hazard.",
            category="infrastructure",
            severity="critical",
            key_evidence=["Ceiling tile saturated"],
            recommended_attention="Inspect valve overhead immediately.",
            reasoning="Uncontained water near energized electronic equipment causes high fire hazard.",
        )
        resp = self.service.build_evidence(signal, ai_analysis=ai_output, reference_time=self.now)
        self.assertIn("AI analysis notes", resp.summary)
        self.assertIn("energized electronic equipment", resp.summary)

    def test_empty_related_signal_results(self):
        """When related_signals is empty list, no fake related signals are emitted and narrative reflects absence of precursors."""
        signal = {
            "id": 18,
            "title": "Single cracked window pane",
            "category": "maintenance",
            "severity": "low",
            "status": "open",
            "created_at": self.now,
        }
        resp = self.service.build_evidence(signal, related_signals=[], reference_time=self.now)
        rel_items = [e for e in resp.evidence if e.type == "RELATED_SIGNAL"]
        self.assertEqual(len(rel_items), 0)
        self.assertIn("No semantically related precursor clusters", resp.summary)

    def test_deterministic_evidence_generation(self):
        """Calling build_evidence multiple times with identical inputs produces identical evidence items, strength, and narrative."""
        signal = {
            "id": 19,
            "title": "Repeated hydraulic pressure drop",
            "description": "Chronic sensor alert recurrence.",
            "category": "equipment",
            "location": "Press Unit 1",
            "severity": "high",
            "status": "open",
            "created_at": self.now,
        }
        resp1 = self.service.build_evidence(signal, reference_time=self.now)
        resp2 = self.service.build_evidence(signal, reference_time=self.now)
        self.assertEqual(resp1.summary, resp2.summary)
        self.assertEqual(resp1.evidence_strength, resp2.evidence_strength)
        self.assertEqual(resp1.risk_score, resp2.risk_score)
        self.assertEqual(len(resp1.evidence), len(resp2.evidence))
        for item1, item2 in zip(resp1.evidence, resp2.evidence):
            self.assertEqual(item1.model_dump(), item2.model_dump())


class TestEvidenceEndpoints(unittest.TestCase):
    """Integration tests for FastAPI /api/evidence and /api/evidence/{signal_id} endpoints."""

    def setUp(self):
        self.client = TestClient(app)

    def test_get_signal_evidence_success(self):
        """GET /api/evidence/{signal_id} returns 200 with structured evidence, strength, factors, and summary."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="Water leakage reported near Server Room 3B",
            description="Continuous dripping from ceiling tile.",
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
            resp = self.client.get("/api/evidence/1")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["signal_id"], 1)
            self.assertEqual(data["signal_title"], "Water leakage reported near Server Room 3B")
            self.assertIn("summary", data)
            self.assertIn("evidence_strength", data)
            self.assertIn("evidence", data)
            self.assertIn("risk_score", data)
            self.assertIn("risk_level", data)
            self.assertIn("priority", data)
            self.assertGreater(len(data["evidence"]), 0)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_signal_evidence_missing_signal_404(self):
        """GET /api/evidence/{signal_id} returns 404 when signal does not exist."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/evidence/9999")
            self.assertEqual(resp.status_code, 404)
            self.assertIn("Signal with ID 9999 not found", resp.json()["detail"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_signal_evidence_database_unavailable_503(self):
        """GET /api/evidence/{signal_id} returns 503 degraded response when DB is unreachable."""
        mock_db = MagicMock()
        mock_db.get.side_effect = OperationalError("connection refused", {}, None)

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/evidence/1")
            self.assertEqual(resp.status_code, 503)
            data = resp.json()
            self.assertEqual(data["status"], "unavailable")
            self.assertIn("Database service is currently unavailable", data["message"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_invalid_signal_id_validation_422(self):
        """GET /api/evidence/{signal_id} returns 422 validation error for signal_id <= 0."""
        resp = self.client.get("/api/evidence/0")
        self.assertEqual(resp.status_code, 422)

    def test_list_evidence_success(self):
        """GET /api/evidence returns a list of evidence summaries sorted descending by risk_score."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        s1 = Signal(
            id=1,
            title="Cosmetic scuff",
            category="other",
            severity="low",
            status="resolved",
            source="manual",
            created_at=now,
            updated_at=now,
        )
        s2 = Signal(
            id=2,
            title="Transformer spark in electrical room",
            description="Continuous arcing alarm.",
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
            resp = self.client.get("/api/evidence")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 2)
            # Must be sorted descending by risk score
            self.assertGreater(data[0]["risk_score"], data[1]["risk_score"])
            self.assertEqual(data[0]["signal_id"], 2)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_evidence_filtering(self):
        """GET /api/evidence supports filtering by evidence_strength, risk_level, and minimum_score."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        s1 = Signal(
            id=1,
            title="Cosmetic scuff",
            category="other",
            severity="low",
            status="resolved",
            source="manual",
            created_at=now,
            updated_at=now,
        )
        s2 = Signal(
            id=2,
            title="Transformer spark in electrical room",
            description="Continuous arcing alarm.",
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
            # Filter by risk_level=HIGH
            resp_risk = self.client.get("/api/evidence?risk_level=HIGH")
            self.assertEqual(resp_risk.status_code, 200)
            data_risk = resp_risk.json()
            self.assertEqual(len(data_risk), 1)
            self.assertEqual(data_risk[0]["signal_id"], 2)

            # Filter by minimum_score=50
            resp_score = self.client.get("/api/evidence?minimum_score=50")
            self.assertEqual(resp_score.status_code, 200)
            data_score = resp_score.json()
            self.assertEqual(len(data_score), 1)
            self.assertEqual(data_score[0]["signal_id"], 2)

            # Filter by evidence_strength=LOW
            resp_str = self.client.get("/api/evidence?evidence_strength=LOW")
            self.assertEqual(resp_str.status_code, 200)
            data_str = resp_str.json()
            self.assertEqual(len(data_str), 1)
            self.assertEqual(data_str[0]["signal_id"], 1)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_evidence_pagination(self):
        """GET /api/evidence applies skip and limit pagination."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        signals = [
            Signal(
                id=i,
                title=f"Incident {i}",
                category="maintenance",
                severity="medium",
                status="open",
                source="sensor",
                created_at=now,
                updated_at=now,
            )
            for i in range(1, 8)
        ]
        mock_db.scalars.return_value.all.return_value = signals

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/evidence?skip=1&limit=2")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 2)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_evidence_database_unavailable_503(self):
        """GET /api/evidence returns 503 degraded response when DB is unreachable."""
        mock_db = MagicMock()
        mock_db.scalars.side_effect = OperationalError("connection refused", {}, None)

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/evidence")
            self.assertEqual(resp.status_code, 503)
            data = resp.json()
            self.assertEqual(data["status"], "unavailable")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_openapi_registration(self):
        """Verifies that all M1-M8 endpoints are registered in OpenAPI paths."""
        openapi_schema = app.openapi()
        paths = openapi_schema["paths"]
        self.assertIn("/api/evidence", paths)
        self.assertIn("/api/evidence/{signal_id}", paths)
        self.assertIn("/api/risks", paths)
        self.assertIn("/api/risks/{signal_id}", paths)
        self.assertIn("/api/signals", paths)
        self.assertIn("/api/signals/{signal_id}", paths)
        self.assertIn("/api/signals/{signal_id}/related", paths)
        self.assertIn("/api/ai/analyze-signal/{signal_id}", paths)
        self.assertIn("/api/health", paths)
        self.assertIn("/", paths)


if __name__ == "__main__":
    unittest.main()
