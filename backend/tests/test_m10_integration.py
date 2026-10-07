"""
Milestone 10: Full Integration & Final Testing Suite for EarlySight.

Verifies the end-to-end operational intelligence workflow across all milestones:
M1: FastAPI foundation & health check
M2: PostgreSQL / SQLAlchemy relational data layer
M3: Signal REST APIs (CRUD, validation, pagination)
M4: Frontend/Backend API contract consistency
M5: AI / LLM structured signal analysis (mocked in tests)
M6: Vector embeddings & semantic related-signal detection (mocked in tests)
M7: Transparent 5-factor risk scoring & prioritization
M8: Evidence synthesis, explainability narrative, and factual reasoning
M9: Preventive action lifecycle state machine (OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED -> RESOLVED)
M10: Complete integration workflow, cross-module consistency, and degraded-mode resilience.
"""

from datetime import datetime, timezone
from pathlib import Path
import sys
import unittest
from unittest.mock import MagicMock, patch

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.testclient import TestClient

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database import Base, get_db
from app.main import app
from app.models.action import Action
from app.models.signal import Signal
from app.schemas.ai import SignalAnalysisOutput
from app.schemas.embedding import RelatedSignalItem
from app.services.action_service import action_service
from app.services.ai_service import (
    AIServiceError,
    AIServiceNotConfiguredError,
    ai_service,
)
from app.services.embedding_service import (
    EmbeddingServiceError,
    EmbeddingServiceNotConfiguredError,
    embedding_service,
)
from app.services.evidence_service import evidence_service
from app.services.risk_service import risk_service


class TestM10EndToEndWorkflow(unittest.TestCase):
    """
    End-to-End integration test covering the complete EarlySight lifecycle:
    Signal Ingestion -> AI Analysis -> Related Signal Detection ->
    Risk Scoring -> Evidence Generation -> Preventive Action ->
    Assignment -> In Progress -> Completion -> Verification -> Resolution.
    """

    def setUp(self):
        # Configure in-memory SQLite database with StaticPool for relational persistence testing
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.TestingSessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        Base.metadata.create_all(bind=self.engine)

        def override_get_db():
            db = self.TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_complete_end_to_end_operational_workflow(self):
        """
        Executes the entire EarlySight operational intelligence pipeline from
        precursor signal creation to formal action closeout.
        """
        # =====================================================================
        # Step 1: Pre-populate a related precursor signal in the same zone
        # =====================================================================
        precursor_payload = {
            "title": "Minor coolant leak observed under Chiller Unit B",
            "description": "Slow fluid seepage noticed during routine walk-through.",
            "category": "equipment",
            "location": "Central Plant - Sub-basement",
            "severity": "medium",
            "status": "investigating",
            "source": "maintenance_report",
        }
        res_precursor = self.client.post("/api/signals", json=precursor_payload)
        self.assertEqual(res_precursor.status_code, 201)
        precursor_id = res_precursor.json()["id"]

        # =====================================================================
        # Step 2: Signal Ingestion (Primary Signal)
        # =====================================================================
        primary_payload = {
            "title": "Abnormal vibration and overheat alert on Primary Cooling Pump #2",
            "description": "Vibration sensor tripped warning threshold. Continuous high-frequency rattling and chronic leakage pattern.",
            "category": "equipment",
            "location": "Central Plant - Sub-basement",
            "severity": "high",
            "status": "open",
            "source": "sensor",
        }
        res_primary = self.client.post("/api/signals", json=primary_payload)
        self.assertEqual(res_primary.status_code, 201)
        primary_data = res_primary.json()
        signal_id = primary_data["id"]
        self.assertEqual(primary_data["title"], primary_payload["title"])
        self.assertEqual(primary_data["severity"], "high")
        self.assertEqual(primary_data["status"], "open")

        # =====================================================================
        # Step 3: AI Signal Analysis (Mocked external OpenAI)
        # =====================================================================
        mock_analysis_output = SignalAnalysisOutput(
            summary="Primary Cooling Pump #2 exhibits severe mechanical distress and chronic fluid seepage.",
            category="equipment",
            severity="high",
            key_evidence=[
                "High-frequency vibration sensor alarm tripped",
                "Chronic leakage pattern in sub-basement zone",
            ],
            recommended_attention="Immediate physical inspection of pump bearings and mechanical seal.",
            reasoning="Unmitigated bearing failure could induce impeller seizure, leading to emergency cooling loss.",
        )

        with patch.object(ai_service, "api_key", "sk-mock-key"), \
             patch.object(ai_service, "analyze_signal", return_value=mock_analysis_output):
            res_ai = self.client.post(f"/api/ai/analyze-signal/{signal_id}")
            self.assertEqual(res_ai.status_code, 200)
            ai_data = res_ai.json()
            self.assertEqual(ai_data["status"], "analyzed")
            self.assertEqual(ai_data["analysis"]["severity"], "high")
            self.assertEqual(len(ai_data["analysis"]["key_evidence"]), 2)

        # =====================================================================
        # Step 4: Related Signal Detection (Mocked vector embeddings)
        # =====================================================================
        mock_related_items = [
            {
                "signal_id": precursor_id,
                "title": precursor_payload["title"],
                "category": precursor_payload["category"],
                "location": precursor_payload["location"],
                "severity": precursor_payload["severity"],
                "similarity": 0.892,
            }
        ]

        with patch.object(embedding_service, "api_key", "sk-mock-key"), \
             patch.object(embedding_service, "find_related_signals", return_value=mock_related_items):
            res_related = self.client.post(f"/api/signals/{signal_id}/related?limit=5")
            self.assertEqual(res_related.status_code, 200)
            related_data = res_related.json()
            self.assertEqual(len(related_data["related_signals"]), 1)
            self.assertEqual(related_data["related_signals"][0]["signal_id"], precursor_id)
            self.assertAlmostEqual(related_data["related_signals"][0]["similarity"], 0.892, places=3)

        # =====================================================================
        # Step 5: Risk Scoring (M7)
        # =====================================================================
        with patch.object(embedding_service, "api_key", "sk-mock-key"), \
             patch.object(embedding_service, "find_related_signals", return_value=mock_related_items):
            res_risk = self.client.get(f"/api/risks/{signal_id}")
            self.assertEqual(res_risk.status_code, 200)
            risk_data = res_risk.json()
            self.assertGreater(risk_data["risk_score"], 40)
            self.assertIn(risk_data["risk_level"], ["MODERATE", "HIGH", "CRITICAL"])
            self.assertIn(risk_data["priority"], ["MEDIUM", "HIGH", "CRITICAL"])
            self.assertIn("factors", risk_data)
            self.assertGreater(risk_data["factors"]["severity"], 0)
            self.assertGreater(risk_data["factors"]["recurrence"], 0)
            expected_risk_score = risk_data["risk_score"]
            expected_priority = risk_data["priority"]

        # =====================================================================
        # Step 6: Evidence & Explainability (M8)
        # =====================================================================
        with patch.object(embedding_service, "api_key", "sk-mock-key"), \
             patch.object(embedding_service, "find_related_signals", return_value=mock_related_items):
            res_evidence = self.client.get(f"/api/evidence/{signal_id}")
            self.assertEqual(res_evidence.status_code, 200)
            evidence_data = res_evidence.json()
            self.assertEqual(evidence_data["signal_id"], signal_id)
            self.assertEqual(evidence_data["risk_score"], expected_risk_score)
            self.assertIn(evidence_data["evidence_strength"], ["MODERATE", "HIGH"])
            self.assertTrue(len(evidence_data["evidence"]) >= 3)
            # Verify narrative answers core explainability questions cautiously
            narrative = evidence_data["summary"]
            self.assertIn("Central Plant - Sub-basement", narrative)
            self.assertTrue(any(word in narrative.lower() for word in ["indicates", "suggests", "concern", "precursor"]))

        # =====================================================================
        # Step 7: Create Preventive Action (M9)
        # =====================================================================
        action_payload = {
            "signal_id": signal_id,
            "title": "Overhaul Cooling Pump #2 bearings and mechanical seal",
            "description": "Deploy mechanical reliability technicians to inspect bearing tolerance and replace mechanical seal.",
        }
        res_action = self.client.post("/api/actions", json=action_payload)
        self.assertEqual(res_action.status_code, 201)
        action_data = res_action.json()
        action_id = action_data["id"]
        self.assertEqual(action_data["signal_id"], signal_id)
        self.assertEqual(action_data["status"], "OPEN")
        # Action must capture calculated M7 risk score and default priority
        self.assertGreater(action_data["risk_score"], 40)
        self.assertIn(action_data["priority"], ["MEDIUM", "HIGH", "CRITICAL"])
        self.assertIsNone(action_data["completed_at"])
        self.assertIsNone(action_data["verified_at"])

        # =====================================================================
        # Step 8: Action Assignment (OPEN -> ASSIGNED)
        # =====================================================================
        res_assign = self.client.post(
            f"/api/actions/{action_id}/assign",
            json={"assigned_to": "Mechanical Reliability Team A"},
        )
        self.assertEqual(res_assign.status_code, 200)
        assign_data = res_assign.json()
        self.assertEqual(assign_data["status"], "ASSIGNED")
        self.assertEqual(assign_data["assigned_to"], "Mechanical Reliability Team A")

        # =====================================================================
        # Step 9: Action In Progress (ASSIGNED -> IN_PROGRESS)
        # =====================================================================
        res_progress = self.client.patch(
            f"/api/actions/{action_id}",
            json={"status": "IN_PROGRESS"},
        )
        self.assertEqual(res_progress.status_code, 200)
        self.assertEqual(res_progress.json()["status"], "IN_PROGRESS")

        # =====================================================================
        # Step 10: Action Completion (IN_PROGRESS -> COMPLETED)
        # =====================================================================
        res_complete = self.client.post(
            f"/api/actions/{action_id}/complete",
            json={"resolution_notes": "Bearings replaced with SKF 6205 series. New silicone carbide seal fitted."},
        )
        self.assertEqual(res_complete.status_code, 200)
        complete_data = res_complete.json()
        self.assertEqual(complete_data["status"], "COMPLETED")
        self.assertIsNotNone(complete_data["completed_at"])
        self.assertIn("SKF 6205", complete_data["resolution_notes"])

        # =====================================================================
        # Step 11: Action Verification (COMPLETED -> VERIFIED)
        # =====================================================================
        res_verify = self.client.post(
            f"/api/actions/{action_id}/verify",
            json={"resolution_notes": "Vibration re-test conducted at full load: 0.8 mm/s RMS (normal). No fluid seepage."},
        )
        self.assertEqual(res_verify.status_code, 200)
        verify_data = res_verify.json()
        self.assertEqual(verify_data["status"], "VERIFIED")
        self.assertIsNotNone(verify_data["verified_at"])
        self.assertIn("0.8 mm/s", verify_data["resolution_notes"])

        # =====================================================================
        # Step 12: Action Resolution (VERIFIED -> RESOLVED)
        # =====================================================================
        res_resolve = self.client.post(
            f"/api/actions/{action_id}/resolve",
            json={"resolution_notes": "Preventive maintenance verified effective. Closed by Operations Supervisor."},
        )
        self.assertEqual(res_resolve.status_code, 200)
        resolve_data = res_resolve.json()
        self.assertEqual(resolve_data["status"], "RESOLVED")
        self.assertIn("Closed by Operations Supervisor", resolve_data["resolution_notes"])

        # =====================================================================
        # Step 13: Terminal State Verification (RESOLVED is terminal)
        # =====================================================================
        res_illegal = self.client.patch(
            f"/api/actions/{action_id}",
            json={"status": "IN_PROGRESS"},
        )
        self.assertEqual(res_illegal.status_code, 400)
        self.assertIn("Invalid lifecycle transition", res_illegal.json()["detail"])


class TestM10DegradedModeAndResilience(unittest.TestCase):
    """
    Tests degraded-mode behavior when external services, configuration, or database are unavailable.
    Guarantees no crashes, proper HTTP status codes, and zero fabricated data.
    """

    def setUp(self):
        self.client = TestClient(app)

    def test_database_unavailable_health_check_returns_degraded(self):
        """When database is offline, /api/health returns 200 with degraded status."""
        with patch("app.main.check_database_connection", return_value=(False, "Connection refused")):
            resp = self.client.get("/api/health")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["status"], "degraded")
            self.assertEqual(data["database"], "unavailable")

    def test_database_unavailable_endpoints_return_503(self):
        """When database raises OperationalError, all endpoints return 503 cleanly."""
        mock_db = MagicMock()
        mock_db.scalars.side_effect = OperationalError("connection failure", params=None, orig=Exception())
        mock_db.get.side_effect = OperationalError("connection failure", params=None, orig=Exception())
        mock_db.add.side_effect = OperationalError("connection failure", params=None, orig=Exception())
        mock_db.commit.side_effect = OperationalError("connection failure", params=None, orig=Exception())

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # 1. Signals list & create & get
            self.assertEqual(self.client.get("/api/signals").status_code, 503)
            self.assertEqual(self.client.post("/api/signals", json={"title": "Test"}).status_code, 503)
            self.assertEqual(self.client.get("/api/signals/1").status_code, 503)
            self.assertEqual(self.client.post("/api/signals/1/related").status_code, 503)

            # 2. AI analysis
            self.assertEqual(self.client.post("/api/ai/analyze-signal/1").status_code, 503)

            # 3. Risks
            self.assertEqual(self.client.get("/api/risks").status_code, 503)
            self.assertEqual(self.client.get("/api/risks/1").status_code, 503)

            # 4. Evidence
            self.assertEqual(self.client.get("/api/evidence").status_code, 503)
            self.assertEqual(self.client.get("/api/evidence/1").status_code, 503)

            # 5. Actions
            self.assertEqual(self.client.get("/api/actions").status_code, 503)
            self.assertEqual(self.client.post("/api/actions", json={"signal_id": 1, "title": "A"}).status_code, 503)
            self.assertEqual(self.client.get("/api/actions/1").status_code, 503)
            self.assertEqual(self.client.patch("/api/actions/1", json={"title": "B"}).status_code, 503)
            self.assertEqual(self.client.post("/api/actions/1/assign", json={"assigned_to": "T"}).status_code, 503)
            self.assertEqual(self.client.post("/api/actions/1/complete", json={}).status_code, 503)
            self.assertEqual(self.client.post("/api/actions/1/verify", json={}).status_code, 503)
            self.assertEqual(self.client.post("/api/actions/1/resolve", json={}).status_code, 503)
            self.assertEqual(self.client.post("/api/actions/1/cancel", json={}).status_code, 503)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_unconfigured_ai_service_returns_503(self):
        """When OPENAI_API_KEY is missing, AI and Embeddings endpoints return 503 with helpful messages."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="Smoke odor near breaker panel",
            category="safety",
            severity="high",
            status="open",
            source="manual",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        mock_db.get.return_value = mock_signal

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            with patch.object(ai_service, "api_key", ""):
                res_ai = self.client.post("/api/ai/analyze-signal/1")
                self.assertEqual(res_ai.status_code, 503)
                self.assertIn("AI service is not configured", res_ai.json()["message"])

            with patch.object(embedding_service, "api_key", ""):
                res_emb = self.client.post("/api/signals/1/related")
                self.assertEqual(res_emb.status_code, 503)
                self.assertIn("Embedding service is not configured", res_emb.json()["message"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_openai_service_runtime_error_returns_503(self):
        """When OpenAI API call raises an error, endpoints catch it and return 503 safely."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        mock_signal = Signal(
            id=1,
            title="Valve pressure oscillation",
            category="equipment",
            severity="medium",
            status="open",
            source="sensor",
            created_at=now,
            updated_at=now,
        )
        mock_candidate = Signal(
            id=2,
            title="Previous valve chatter",
            category="equipment",
            severity="low",
            status="resolved",
            source="sensor",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = mock_signal
        mock_db.scalars.return_value.all.return_value = [mock_candidate]

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            with patch.object(ai_service, "api_key", "sk-mock-key"), \
                 patch.object(ai_service, "analyze_signal", side_effect=AIServiceError("Upstream OpenAI rate limit")):
                res_ai = self.client.post("/api/ai/analyze-signal/1")
                self.assertEqual(res_ai.status_code, 503)
                self.assertIn("Upstream OpenAI rate limit", res_ai.json()["message"])

            with patch.object(embedding_service, "api_key", "sk-mock-key"), \
                 patch.object(embedding_service, "find_related_signals", side_effect=EmbeddingServiceError("OpenAI connection timeout")):
                res_emb = self.client.post("/api/signals/1/related")
                self.assertEqual(res_emb.status_code, 503)
                self.assertIn("OpenAI connection timeout", res_emb.json()["message"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_offline_embeddings_during_evidence_generation_degrades_gracefully(self):
        """When embedding service is offline, GET /api/evidence/{id} still succeeds factually without crashing."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="Exhaust fan vibration alert",
            description="Bearing temperature elevated.",
            category="equipment",
            location="Roof Zone 4",
            severity="medium",
            status="open",
            source="sensor",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        mock_db.get.return_value = mock_signal
        mock_db.scalars.return_value.all.return_value = []

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # Force embedding service unconfigured by setting empty api_key
            with patch.object(embedding_service, "api_key", ""):
                resp = self.client.get("/api/evidence/1")
                self.assertEqual(resp.status_code, 200)
                data = resp.json()
                self.assertEqual(data["signal_id"], 1)
                self.assertIn("evidence", data)
                # Verify that related signals evidence explicitly mentions offline status
                related_ev = [item for item in data["evidence"] if item["type"] == "RELATED_SIGNAL"]
                self.assertEqual(len(related_ev), 1)
                self.assertIn("offline", related_ev[0]["description"].lower())
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_missing_signal_returns_404_across_all_endpoints(self):
        """Endpoints that depend on signal_id consistently return 404 when the signal is absent."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            self.assertEqual(self.client.get("/api/signals/9999").status_code, 404)
            self.assertEqual(self.client.patch("/api/signals/9999", json={"title": "X"}).status_code, 404)
            self.assertEqual(self.client.delete("/api/signals/9999").status_code, 404)
            self.assertEqual(self.client.post("/api/signals/9999/related").status_code, 404)
            self.assertEqual(self.client.post("/api/ai/analyze-signal/9999").status_code, 404)
            self.assertEqual(self.client.get("/api/risks/9999").status_code, 404)
            self.assertEqual(self.client.get("/api/evidence/9999").status_code, 404)
            self.assertEqual(self.client.post("/api/actions", json={"signal_id": 9999, "title": "A"}).status_code, 404)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_missing_action_returns_404_across_all_action_endpoints(self):
        """Action endpoints consistently return 404 when action_id is absent."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            self.assertEqual(self.client.get("/api/actions/9999").status_code, 404)
            self.assertEqual(self.client.patch("/api/actions/9999", json={"title": "X"}).status_code, 404)
            self.assertEqual(self.client.post("/api/actions/9999/assign", json={"assigned_to": "U"}).status_code, 404)
            self.assertEqual(self.client.post("/api/actions/9999/complete", json={}).status_code, 404)
            self.assertEqual(self.client.post("/api/actions/9999/verify", json={}).status_code, 404)
            self.assertEqual(self.client.post("/api/actions/9999/resolve", json={}).status_code, 404)
            self.assertEqual(self.client.post("/api/actions/9999/cancel", json={}).status_code, 404)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_invalid_action_lifecycle_transitions_rejected_with_400(self):
        """Invalid jumps across action statuses are strictly rejected with HTTP 400."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        action = Action(
            id=10,
            signal_id=1,
            risk_score=60,
            title="Inspect coolant pump",
            status="OPEN",
            priority="HIGH",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = action

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # OPEN cannot jump to RESOLVED
            res = self.client.patch("/api/actions/10", json={"status": "RESOLVED"})
            self.assertEqual(res.status_code, 400)
            self.assertIn("Invalid lifecycle transition", res.json()["detail"])

            # OPEN cannot jump to VERIFIED
            res = self.client.patch("/api/actions/10", json={"status": "VERIFIED"})
            self.assertEqual(res.status_code, 400)
            self.assertIn("Invalid lifecycle transition", res.json()["detail"])

            # Change to IN_PROGRESS
            action.status = "IN_PROGRESS"
            # IN_PROGRESS cannot jump directly to RESOLVED without COMPLETED -> VERIFIED
            res = self.client.patch("/api/actions/10", json={"status": "RESOLVED"})
            self.assertEqual(res.status_code, 400)
            self.assertIn("Invalid lifecycle transition", res.json()["detail"])

            # Change to COMPLETED
            action.status = "COMPLETED"
            # COMPLETED cannot jump directly to RESOLVED without VERIFIED
            res = self.client.patch("/api/actions/10", json={"status": "RESOLVED"})
            self.assertEqual(res.status_code, 400)
            self.assertIn("Invalid lifecycle transition", res.json()["detail"])
        finally:
            app.dependency_overrides.pop(get_db, None)


class TestM10CrossModuleConsistency(unittest.TestCase):
    """
    Verifies cross-module consistency and ensures no duplicated logic or unnecessary AI calls.
    """

    def setUp(self):
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.TestingSessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(bind=self.engine)

        def override_get_db():
            db = self.TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_m7_risk_score_consistency_with_m8_evidence_and_m9_action(self):
        """
        Verifies that:
        1. Action risk score strictly equals Risk Service score.
        2. Evidence risk score strictly equals Risk Service score.
        3. Action priority defaults to Risk Service priority.
        4. Evidence factors match Risk Service factors.
        """
        db = self.TestingSessionLocal()
        signal = Signal(
            title="High temperature alarm on Transformer 4B",
            description="Persistent overheating warning logged over 3 consecutive cycles.",
            category="equipment",
            location="Substation West",
            severity="critical",
            status="open",
            source="sensor",
        )
        db.add(signal)
        db.commit()
        db.refresh(signal)

        # 1. Calculate ground-truth M7 risk on the persisted signal with empty candidates
        risk_res = risk_service.score_signal(signal=signal, candidate_signals=[])

        # 2. Query Evidence via API
        ev_resp = self.client.get(f"/api/evidence/{signal.id}")
        self.assertEqual(ev_resp.status_code, 200)
        ev_data = ev_resp.json()
        self.assertEqual(ev_data["risk_score"], risk_res.risk_score)
        self.assertEqual(ev_data["risk_level"], risk_res.risk_level)
        self.assertEqual(ev_data["priority"], risk_res.priority)
        self.assertEqual(ev_data["factors"]["severity"], risk_res.factors.severity)
        self.assertEqual(ev_data["factors"]["trend"], risk_res.factors.trend)

        # 3. Create Action via API
        act_resp = self.client.post(
            "/api/actions",
            json={"signal_id": signal.id, "title": "Inspect transformer coolant radiator"},
        )
        self.assertEqual(act_resp.status_code, 201)
        act_data = act_resp.json()
        self.assertEqual(act_data["risk_score"], risk_res.risk_score)
        self.assertEqual(act_data["priority"], risk_res.priority)
        db.close()

    def test_zero_ai_calls_during_risk_evidence_and_action_endpoints(self):
        """
        Ensures NO external OpenAI API calls take place during normal retrieval
        or lifecycle processing of risks, evidence, or actions.
        """
        db = self.TestingSessionLocal()
        signal = Signal(
            title="Water drip near conduit",
            category="infrastructure",
            severity="low",
            status="open",
            source="manual",
        )
        db.add(signal)
        db.commit()
        db.refresh(signal)

        with patch.object(ai_service, "get_client") as mock_openai_client:
            # 1. Get Risk
            res_r = self.client.get(f"/api/risks/{signal.id}")
            self.assertEqual(res_r.status_code, 200)
            # 2. Get Evidence
            res_e = self.client.get(f"/api/evidence/{signal.id}")
            self.assertEqual(res_e.status_code, 200)
            # 3. Create Action
            act_res = self.client.post("/api/actions", json={"signal_id": signal.id, "title": "Check conduit"})
            self.assertEqual(act_res.status_code, 201)
            act_id = act_res.json()["id"]
            # 4. Action transitions
            res_as = self.client.post(f"/api/actions/{act_id}/assign", json={"assigned_to": "Team"})
            self.assertEqual(res_as.status_code, 200)
            res_p = self.client.patch(f"/api/actions/{act_id}", json={"status": "IN_PROGRESS"})
            self.assertEqual(res_p.status_code, 200)
            res_c = self.client.post(f"/api/actions/{act_id}/complete", json={})
            self.assertEqual(res_c.status_code, 200)

            # Assert OpenAI client was NEVER invoked
            mock_openai_client.assert_not_called()
        db.close()

    def test_openapi_schema_contains_all_22_required_m1_to_m10_routes(self):
        """
        Verifies that all 22 required routes across M1 to M9 are registered in the FastAPI OpenAPI schema.
        """
        schema = app.openapi()
        paths = schema.get("paths", {})

        expected_routes = [
            ("/", "get"),
            ("/api/health", "get"),
            ("/api/signals", "get"),
            ("/api/signals", "post"),
            ("/api/signals/{signal_id}", "get"),
            ("/api/signals/{signal_id}", "patch"),
            ("/api/signals/{signal_id}", "delete"),
            ("/api/signals/{signal_id}/related", "post"),
            ("/api/ai/analyze-signal/{signal_id}", "post"),
            ("/api/risks", "get"),
            ("/api/risks/{signal_id}", "get"),
            ("/api/evidence", "get"),
            ("/api/evidence/{signal_id}", "get"),
            ("/api/actions", "get"),
            ("/api/actions", "post"),
            ("/api/actions/{action_id}", "get"),
            ("/api/actions/{action_id}", "patch"),
            ("/api/actions/{action_id}/assign", "post"),
            ("/api/actions/{action_id}/complete", "post"),
            ("/api/actions/{action_id}/verify", "post"),
            ("/api/actions/{action_id}/resolve", "post"),
            ("/api/actions/{action_id}/cancel", "post"),
        ]

        for path, method in expected_routes:
            self.assertIn(path, paths, f"Path '{path}' missing from OpenAPI paths")
            self.assertIn(method, paths[path], f"Method '{method.upper()}' missing for path '{path}'")


if __name__ == "__main__":
    unittest.main()
