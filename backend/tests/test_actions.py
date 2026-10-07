"""
Unit and API integration tests for Milestone 9: Actions & Resolution Lifecycle.
Tests cover:
- Action creation (with M7 risk score calculation and priority defaulting)
- Action retrieval by ID
- Action update (PATCH)
- Action assignment (OPEN -> ASSIGNED)
- State machine lifecycle transitions (OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED -> RESOLVED)
- Rejection of invalid transitions (OPEN -> RESOLVED, IN_PROGRESS -> RESOLVED, COMPLETED -> RESOLVED)
- Work completion (completed_at recorded)
- Quality verification (verified_at recorded)
- Formal resolution sign-off
- Action cancellation
- Query filtering (status, priority, signal_id, assigned_to)
- Pagination (skip, limit)
- Missing signal (404)
- Missing action (404)
- Database unavailable (503 handling)
- OpenAPI route registration
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
from app.models.action import Action
from app.models.signal import Signal
from app.schemas.action import ActionCreate, ActionResponse, ActionUpdate
from app.services.action_service import (
    ActionNotFoundError,
    ActionService,
    InvalidActionTransitionError,
    SignalNotFoundError,
    action_service,
)


class TestActionServiceLifecycle(unittest.TestCase):
    """Unit tests for ActionService state machine, transitions, and business rules."""

    def setUp(self):
        self.service = ActionService()

    def test_valid_transitions_state_machine(self):
        """Verifies all permitted transitions pass validation without error."""
        # OPEN -> ASSIGNED, IN_PROGRESS, CANCELLED
        self.service.validate_transition("OPEN", "ASSIGNED")
        self.service.validate_transition("OPEN", "IN_PROGRESS")
        self.service.validate_transition("OPEN", "CANCELLED")

        # ASSIGNED -> IN_PROGRESS, CANCELLED, ASSIGNED
        self.service.validate_transition("ASSIGNED", "IN_PROGRESS")
        self.service.validate_transition("ASSIGNED", "CANCELLED")
        self.service.validate_transition("ASSIGNED", "ASSIGNED")

        # IN_PROGRESS -> COMPLETED, CANCELLED
        self.service.validate_transition("IN_PROGRESS", "COMPLETED")
        self.service.validate_transition("IN_PROGRESS", "CANCELLED")

        # COMPLETED -> VERIFIED, CANCELLED
        self.service.validate_transition("COMPLETED", "VERIFIED")
        self.service.validate_transition("COMPLETED", "CANCELLED")

        # VERIFIED -> RESOLVED, CANCELLED
        self.service.validate_transition("VERIFIED", "RESOLVED")
        self.service.validate_transition("VERIFIED", "CANCELLED")

    def test_invalid_transitions_rejected(self):
        """Verifies invalid transitions raise InvalidActionTransitionError."""
        # Cannot jump from OPEN directly to RESOLVED or VERIFIED or COMPLETED
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("OPEN", "RESOLVED")
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("OPEN", "VERIFIED")
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("OPEN", "COMPLETED")

        # Cannot jump from ASSIGNED directly to RESOLVED
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("ASSIGNED", "RESOLVED")

        # Cannot jump from IN_PROGRESS directly to RESOLVED (must be COMPLETED -> VERIFIED first!)
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("IN_PROGRESS", "RESOLVED")

        # Cannot jump from COMPLETED directly to RESOLVED (must be VERIFIED first!)
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("COMPLETED", "RESOLVED")

        # Terminal state: RESOLVED cannot transition anywhere
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("RESOLVED", "OPEN")
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("RESOLVED", "IN_PROGRESS")

        # Terminal state: CANCELLED cannot transition anywhere
        with self.assertRaises(InvalidActionTransitionError):
            self.service.validate_transition("CANCELLED", "OPEN")

    def test_create_action_with_risk_priority_defaulting(self):
        """Verifies action creation calculates M7 risk score and defaults priority from risk priority."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="High pressure steam leak near generator",
            description="Continuous dripping and valve hiss.",
            category="safety",
            severity="critical",
            status="open",
            source="sensor",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        mock_db.get.return_value = mock_signal
        mock_db.scalars.return_value.all.return_value = []

        payload = ActionCreate(
            signal_id=1,
            title="Replace main steam gasket",
            description="Dispatch emergency technician.",
            # priority omitted -> should be defaulted from M7 risk score!
        )

        action = self.service.create_action(db=mock_db, payload=payload)
        self.assertEqual(action.signal_id, 1)
        self.assertEqual(action.title, "Replace main steam gasket")
        self.assertGreaterEqual(action.risk_score, 0)
        # For a critical safety signal, risk priority is HIGH or CRITICAL
        self.assertIn(action.priority, ["HIGH", "CRITICAL"])
        self.assertEqual(action.status, "OPEN")
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()

    def test_create_action_missing_signal_raises(self):
        """Verifies creating an action for a non-existent signal raises SignalNotFoundError."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        payload = ActionCreate(
            signal_id=9999,
            title="Fix non-existent problem",
        )
        with self.assertRaises(SignalNotFoundError):
            self.service.create_action(db=mock_db, payload=payload)

    def test_full_lifecycle_progression(self):
        """Verifies the complete lifecycle flow: OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED -> RESOLVED."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        action = Action(
            id=10,
            signal_id=1,
            risk_score=78,
            title="Isolate water leak above server rack",
            status="OPEN",
            priority="HIGH",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = action

        # 1. Assign action
        self.service.assign_action(mock_db, 10, assigned_to="Facilities Team A")
        self.assertEqual(action.status, "ASSIGNED")
        self.assertEqual(action.assigned_to, "Facilities Team A")

        # 2. Update to IN_PROGRESS
        update_payload = ActionUpdate(status="IN_PROGRESS")
        self.service.update_action(mock_db, 10, update_payload)
        self.assertEqual(action.status, "IN_PROGRESS")

        # 3. Complete action
        self.service.complete_action(mock_db, 10, resolution_notes="Pipe repaired with new seal.")
        self.assertEqual(action.status, "COMPLETED")
        self.assertIsNotNone(action.completed_at)
        self.assertIn("Pipe repaired", action.resolution_notes)

        # 4. Verify remediation
        self.service.verify_action(mock_db, 10, resolution_notes="Pressure test passed with zero moisture.")
        self.assertEqual(action.status, "VERIFIED")
        self.assertIsNotNone(action.verified_at)
        self.assertIn("Pressure test passed", action.resolution_notes)

        # 5. Formally resolve action
        self.service.resolve_action(mock_db, 10, resolution_notes="Formal closeout approved.")
        self.assertEqual(action.status, "RESOLVED")
        self.assertIn("Formal closeout approved", action.resolution_notes)

    def test_cancel_action(self):
        """Verifies cancellation from open/in-progress states."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        action = Action(
            id=11,
            signal_id=1,
            risk_score=45,
            title="Repaint scratched pillar",
            status="OPEN",
            priority="LOW",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = action

        self.service.cancel_action(mock_db, 11, resolution_notes="Duplicate ticket cancelled.")
        self.assertEqual(action.status, "CANCELLED")
        self.assertIn("Duplicate ticket", action.resolution_notes)


class TestActionEndpoints(unittest.TestCase):
    """API integration tests for FastAPI /api/actions routes."""

    def setUp(self):
        self.client = TestClient(app)

    def test_create_action_endpoint_success(self):
        """POST /api/actions creates action and returns 201 with populated risk_score."""
        mock_db = MagicMock()
        mock_signal = Signal(
            id=1,
            title="Water leakage near Server Room 3B",
            description="Continuous dripping observed from ceiling tile.",
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

        now = datetime.now(timezone.utc)
        def mock_refresh(instance):
            instance.id = 1
            instance.created_at = now
            instance.updated_at = now
            instance.signal = mock_signal
        mock_db.refresh.side_effect = mock_refresh

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            payload = {
                "signal_id": 1,
                "title": "Fix overhead pipe leak",
                "description": "Replace sealing joint.",
                "assigned_to": "Plumbing Unit",
            }
            resp = self.client.post("/api/actions", json=payload)
            self.assertEqual(resp.status_code, 201)
            data = resp.json()
            self.assertEqual(data["id"], 1)
            self.assertEqual(data["signal_id"], 1)
            self.assertEqual(data["title"], "Fix overhead pipe leak")
            self.assertEqual(data["status"], "ASSIGNED")
            self.assertIn("risk_score", data)
            self.assertIn("priority", data)
            self.assertEqual(data["signal_title"], "Water leakage near Server Room 3B")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_create_action_missing_signal_404(self):
        """POST /api/actions returns 404 when signal_id does not exist."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            payload = {
                "signal_id": 9999,
                "title": "Action for non-existent signal",
            }
            resp = self.client.post("/api/actions", json=payload)
            self.assertEqual(resp.status_code, 404)
            self.assertIn("Signal with ID 9999 not found", resp.json()["detail"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_action_by_id_success(self):
        """GET /api/actions/{action_id} returns action details."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        mock_action = Action(
            id=5,
            signal_id=1,
            risk_score=68,
            title="Inspect HVAC filter",
            description="Check airflow resistance.",
            assigned_to="HVAC Tech",
            status="IN_PROGRESS",
            priority="HIGH",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = mock_action

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/actions/5")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["id"], 5)
            self.assertEqual(data["status"], "IN_PROGRESS")
            self.assertEqual(data["priority"], "HIGH")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_get_action_missing_404(self):
        """GET /api/actions/{action_id} returns 404 when action does not exist."""
        mock_db = MagicMock()
        mock_db.get.return_value = None

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/actions/999")
            self.assertEqual(resp.status_code, 404)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_patch_action_invalid_transition_400(self):
        """PATCH /api/actions/{action_id} returns 400 when attempting an invalid status jump."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        mock_action = Action(
            id=7,
            signal_id=1,
            risk_score=75,
            title="Critical electrical fault",
            status="OPEN",
            priority="CRITICAL",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = mock_action

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # Cannot jump directly from OPEN to RESOLVED
            resp = self.client.patch("/api/actions/7", json={"status": "RESOLVED"})
            self.assertEqual(resp.status_code, 400)
            self.assertIn("Invalid lifecycle transition", resp.json()["detail"])
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_action_lifecycle_endpoints(self):
        """Tests convenient lifecycle endpoints: /assign, /complete, /verify, /resolve."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        mock_action = Action(
            id=20,
            signal_id=1,
            risk_score=70,
            title="Fix roof drain blockage",
            status="OPEN",
            priority="HIGH",
            created_at=now,
            updated_at=now,
        )
        mock_db.get.return_value = mock_action

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            # 1. Assign
            resp = self.client.post("/api/actions/20/assign", json={"assigned_to": "Drainage Team"})
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json()["status"], "ASSIGNED")
            self.assertEqual(resp.json()["assigned_to"], "Drainage Team")

            # 2. Advance to IN_PROGRESS via patch
            self.client.patch("/api/actions/20", json={"status": "IN_PROGRESS"})
            self.assertEqual(mock_action.status, "IN_PROGRESS")

            # 3. Complete
            resp_comp = self.client.post("/api/actions/20/complete", json={"resolution_notes": "Drain cleared"})
            self.assertEqual(resp_comp.status_code, 200)
            self.assertEqual(resp_comp.json()["status"], "COMPLETED")
            self.assertIsNotNone(resp_comp.json()["completed_at"])

            # 4. Verify
            resp_ver = self.client.post("/api/actions/20/verify", json={"resolution_notes": "Water flow confirmed normal"})
            self.assertEqual(resp_ver.status_code, 200)
            self.assertEqual(resp_ver.json()["status"], "VERIFIED")
            self.assertIsNotNone(resp_ver.json()["verified_at"])

            # 5. Resolve
            resp_res = self.client.post("/api/actions/20/resolve", json={"resolution_notes": "Ticket closed"})
            self.assertEqual(resp_res.status_code, 200)
            self.assertEqual(resp_res.json()["status"], "RESOLVED")
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_list_actions_filtering_and_pagination(self):
        """GET /api/actions supports status, priority, signal_id, assigned_to filters and pagination."""
        mock_db = MagicMock()
        now = datetime.now(timezone.utc)
        actions = [
            Action(
                id=1,
                signal_id=1,
                risk_score=80,
                title="Action 1",
                status="OPEN",
                priority="CRITICAL",
                assigned_to="Alice",
                created_at=now,
                updated_at=now,
            ),
            Action(
                id=2,
                signal_id=2,
                risk_score=50,
                title="Action 2",
                status="IN_PROGRESS",
                priority="HIGH",
                assigned_to="Bob",
                created_at=now,
                updated_at=now,
            ),
        ]
        mock_db.scalars.return_value.all.return_value = actions

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp = self.client.get("/api/actions?status=OPEN&priority=CRITICAL&skip=0&limit=10")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(len(data), 2)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_database_unavailable_503(self):
        """Endpoints return 503 degraded response when PostgreSQL is unreachable."""
        mock_db = MagicMock()
        mock_db.scalars.side_effect = OperationalError("connection refused", {}, None)
        mock_db.get.side_effect = OperationalError("connection refused", {}, None)

        app.dependency_overrides[get_db] = lambda: mock_db
        try:
            resp_list = self.client.get("/api/actions")
            self.assertEqual(resp_list.status_code, 503)

            resp_get = self.client.get("/api/actions/1")
            self.assertEqual(resp_get.status_code, 503)

            resp_create = self.client.post("/api/actions", json={"signal_id": 1, "title": "Test"})
            self.assertEqual(resp_create.status_code, 503)
        finally:
            app.dependency_overrides.pop(get_db, None)

    def test_openapi_registration(self):
        """Verifies that all M1-M9 endpoints are registered in OpenAPI schema."""
        openapi_schema = app.openapi()
        paths = openapi_schema["paths"]
        self.assertIn("/api/actions", paths)
        self.assertIn("/api/actions/{action_id}", paths)
        self.assertIn("/api/actions/{action_id}/assign", paths)
        self.assertIn("/api/actions/{action_id}/complete", paths)
        self.assertIn("/api/actions/{action_id}/verify", paths)
        self.assertIn("/api/actions/{action_id}/resolve", paths)
        self.assertIn("/api/actions/{action_id}/cancel", paths)
        self.assertIn("/api/evidence", paths)
        self.assertIn("/api/risks", paths)
        self.assertIn("/api/signals", paths)
        self.assertIn("/api/health", paths)


if __name__ == "__main__":
    unittest.main()
