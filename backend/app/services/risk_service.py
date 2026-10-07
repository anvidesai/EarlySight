"""
Transparent and explainable risk-scoring and prioritization service for EarlySight (Milestone 7).
Transforms operational signal attributes, semantic precursor clusters, and AI insights into
deterministic 0–100 risk scores, categorical tiers, actionable priorities, and factor breakdowns.

NOTE: This scoring model is an MVP heuristic designed for operational early warning synthesis.
It is configurable, deterministic, and transparent, but not scientifically validated or claiming
real-world accuracy guarantees.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional, Tuple, Union

from app.config import settings
from app.schemas.ai import SignalAnalysisOutput
from app.schemas.embedding import RelatedSignalItem
from app.schemas.risk import (
    RiskFactorBreakdown,
    RiskLevelType,
    RiskPriorityType,
    RiskScoreResponse,
)

logger = logging.getLogger(__name__)

# Recurrence pattern keywords commonly found in operational precursor logs
RECURRENCE_KEYWORDS: Tuple[str, ...] = (
    "recur",
    "repeat",
    "chronic",
    "persistent",
    "multiple",
    "again",
    "frequent",
    "continual",
    "ongoing",
    "intermittent",
    "accumulat",
    "sagging",
    "overflow",
    "dripping",
    "leakage",
)

SEVERITY_WEIGHT_MAP: Dict[str, float] = {
    "critical": 1.00,
    "high": 0.76,
    "medium": 0.48,
    "low": 0.24,
}


@dataclass(frozen=True)
class RiskScoringConfig:
    """
    Configurable weights and tier boundaries for the MVP risk scoring model.
    Sum of default maximum weights = 25 + 20 + 20 + 20 + 15 = 100.
    """

    # Maximum factor point weights
    max_severity: int = settings.risk_weight_severity
    max_frequency: int = settings.risk_weight_frequency
    max_recurrence: int = settings.risk_weight_recurrence
    max_related_signals: int = settings.risk_weight_related_signals
    max_trend: int = settings.risk_weight_trend

    # Risk level score thresholds
    threshold_low: int = settings.risk_threshold_low
    threshold_moderate: int = settings.risk_threshold_moderate
    threshold_high: int = settings.risk_threshold_high
    threshold_critical: int = settings.risk_threshold_critical

    # Priority ranking score thresholds
    priority_critical_min: int = settings.risk_priority_critical_min
    priority_high_min: int = settings.risk_priority_high_min
    priority_medium_min: int = settings.risk_priority_medium_min


def _extract_field(entity: Any, field_name: str, default: Any = None) -> Any:
    """Safely extracts a field from a model instance, dictionary, or Pydantic schema."""
    if entity is None:
        return default
    if isinstance(entity, dict):
        return entity.get(field_name, default)
    return getattr(entity, field_name, default)


class RiskScoringService:
    """
    Deterministic operational risk scoring and explainability engine.
    Calculates 5-factor weighted scores without invoking external AI APIs.
    """

    def __init__(self, config: Optional[RiskScoringConfig] = None):
        self.config = config or RiskScoringConfig()

    def calculate_severity_factor(
        self,
        signal: Any,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
    ) -> Tuple[int, str]:
        """
        Calculates severity factor score (0 to max_severity).
        Uses signal.severity, optionally informed by ai_analysis.severity if provided.
        """
        signal_sev = str(_extract_field(signal, "severity", "medium")).strip().lower()
        effective_sev = signal_sev

        if ai_analysis is not None:
            ai_sev = str(_extract_field(ai_analysis, "severity", "")).strip().lower()
            if ai_sev in SEVERITY_WEIGHT_MAP:
                # If AI assessment identified higher severity, escalate to AI assessment
                if SEVERITY_WEIGHT_MAP.get(ai_sev, 0.0) > SEVERITY_WEIGHT_MAP.get(
                    signal_sev, 0.0
                ):
                    effective_sev = ai_sev

        multiplier = SEVERITY_WEIGHT_MAP.get(effective_sev, 0.24)
        points = round(self.config.max_severity * multiplier)
        return min(self.config.max_severity, max(0, points)), effective_sev

    def calculate_frequency_factor(
        self,
        signal: Any,
        candidate_signals: Optional[List[Any]] = None,
    ) -> Tuple[int, int]:
        """
        Calculates frequency factor score (0 to max_frequency).
        Counts signals in the same operational category if candidates are provided.
        Otherwise falls back to reporting source density baseline.
        """
        category = str(_extract_field(signal, "category", "other")).strip().lower()
        source = str(_extract_field(signal, "source", "manual")).strip().lower()

        if candidate_signals:
            # Count how many other signals share the same category
            matches = sum(
                1
                for c in candidate_signals
                if str(_extract_field(c, "category", "")).strip().lower() == category
            )
            if matches >= 6:
                points = self.config.max_frequency
            elif matches >= 4:
                points = round(self.config.max_frequency * 0.75)
            elif matches >= 2:
                points = round(self.config.max_frequency * 0.50)
            else:
                points = round(self.config.max_frequency * 0.25)
            return min(self.config.max_frequency, max(0, points)), matches

        # Fallback heuristic based on reporting source and critical category classification
        if source in ("sensor", "incident_report"):
            points = round(self.config.max_frequency * 0.70)
        elif source in ("complaint", "maintenance_report"):
            points = round(self.config.max_frequency * 0.50)
        else:
            points = round(self.config.max_frequency * 0.30)

        if category in ("safety", "infrastructure"):
            points += 2

        return min(self.config.max_frequency, max(0, points)), 0

    def calculate_recurrence_factor(
        self,
        signal: Any,
        candidate_signals: Optional[List[Any]] = None,
    ) -> Tuple[int, bool, bool]:
        """
        Calculates recurrence factor score (0 to max_recurrence).
        Evaluates chronic/recurring keywords, recurring location matches, and lifecycle status.
        """
        title = str(_extract_field(signal, "title", "")).lower()
        desc = str(_extract_field(signal, "description", "")).lower()
        status = str(_extract_field(signal, "status", "open")).strip().lower()
        location = _extract_field(signal, "location", None)

        text_corpus = f"{title} {desc}"
        has_keywords = any(kw in text_corpus for kw in RECURRENCE_KEYWORDS)

        points = 0
        if has_keywords:
            points += 8

        # Location recurrence check
        has_location_recurrence = False
        if location and candidate_signals:
            loc_str = str(location).strip().lower()
            loc_matches = sum(
                1
                for c in candidate_signals
                if str(_extract_field(c, "location", "")).strip().lower() == loc_str
            )
            if loc_matches >= 2:
                points += 7
                has_location_recurrence = True
            elif loc_matches == 1:
                points += 5
                has_location_recurrence = True

        # Status contribution to chronic recurrence
        if status == "open":
            points += 5
        elif status == "investigating":
            points += 3

        return (
            min(self.config.max_recurrence, max(0, points)),
            has_keywords,
            has_location_recurrence,
        )

    def calculate_related_signals_factor(
        self,
        related_signals: Optional[List[Any]] = None,
    ) -> Tuple[int, int, float]:
        """
        Calculates related-signal factor score (0 to max_related_signals).
        Uses M6 semantic similarity outputs without recomputing embeddings.
        """
        if not related_signals:
            return 0, 0, 0.0

        count = len(related_signals)
        sim_sum = 0.0
        for item in related_signals:
            sim = _extract_field(item, "similarity", 0.0)
            try:
                sim_sum += float(sim)
            except (ValueError, TypeError):
                pass

        avg_similarity = sim_sum / count if count > 0 else 0.0
        # Contribution scales with count (up to 4) and average similarity
        count_ratio = min(count, 4) / 4.0
        points = round(self.config.max_related_signals * count_ratio * avg_similarity)

        return (
            min(self.config.max_related_signals, max(0, points)),
            count,
            round(avg_similarity, 3),
        )

    def calculate_trend_factor(
        self,
        signal: Any,
        reference_time: Optional[datetime] = None,
    ) -> int:
        """
        Calculates trend and recent activity factor score (0 to max_trend).
        Evaluates lifecycle status urgency and signal timestamp recency.
        """
        status = str(_extract_field(signal, "status", "open")).strip().lower()
        created_at = _extract_field(signal, "created_at", None)

        # Status points
        if status == "open":
            status_points = 6
        elif status == "investigating":
            status_points = 4
        elif status == "resolved":
            status_points = 1
        else:
            status_points = 3

        # Recency points
        recency_points = 5
        if created_at is not None:
            if isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(
                        created_at.replace("Z", "+00:00")
                    )
                except ValueError:
                    created_at = None

            if isinstance(created_at, datetime):
                ref = reference_time or datetime.now(timezone.utc)
                if created_at.tzinfo is None:
                    # Treat naive as UTC for deterministic comparison
                    created_at = created_at.replace(tzinfo=timezone.utc)
                if ref.tzinfo is None:
                    ref = ref.replace(tzinfo=timezone.utc)

                age_hours = max(0.0, (ref - created_at).total_seconds() / 3600.0)
                if age_hours <= 24:
                    recency_points = 9
                elif age_hours <= 168:  # 7 days
                    recency_points = 6
                elif age_hours <= 720:  # 30 days
                    recency_points = 3
                else:
                    recency_points = 1

        total = status_points + recency_points
        return min(self.config.max_trend, max(0, total))

    def determine_risk_level(self, score: int) -> RiskLevelType:
        """
        Maps numerical risk score into categorical risk tiers:
        0–24: LOW, 25–49: MODERATE, 50–74: HIGH, 75–100: CRITICAL.
        """
        if score >= self.config.threshold_critical:
            return "CRITICAL"
        if score >= self.config.threshold_moderate + 1:
            return "HIGH"
        if score >= self.config.threshold_low + 1:
            return "MODERATE"
        return "LOW"

    def determine_priority(
        self,
        score: int,
        signal: Any = None,
    ) -> RiskPriorityType:
        """
        Maps risk score and operational state to priority ranking:
        >= 80: CRITICAL, 60–79: HIGH, 30–59: MEDIUM, < 30: LOW.
        """
        if score >= self.config.priority_critical_min:
            return "CRITICAL"
        if score >= self.config.priority_high_min:
            return "HIGH"
        if score >= self.config.priority_medium_min:
            return "MEDIUM"
        return "LOW"

    def generate_explanation(
        self,
        factors: RiskFactorBreakdown,
        signal: Any,
        score: int,
        risk_level: RiskLevelType,
        priority: RiskPriorityType,
        related_count: int = 0,
        avg_similarity: float = 0.0,
        has_keywords: bool = False,
        has_loc_recurrence: bool = False,
        category_matches: int = 0,
        effective_severity: str = "medium",
        related_eval_failed: bool = False,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
    ) -> str:
        """
        Generates a transparent, deterministic explanation of the assigned score
        derived directly from calculated factor contributions.
        """
        parts: List[str] = []

        # 1. Severity summary
        if effective_severity == "critical":
            parts.append("Critical operational severity indicates immediate hazard")
        elif effective_severity == "high":
            parts.append("High severity combined with elevated operational priority")
        elif effective_severity == "medium":
            parts.append("Moderate operational severity")
        else:
            parts.append("Low assessed severity")

        # 2. Related precursor signals summary
        if related_count > 0:
            parts.append(
                f"repeated related signals (count: {related_count}, avg similarity: {avg_similarity:.2f}) increase problem likelihood"
            )
        elif related_eval_failed:
            parts.append(
                "related-signal contribution could not be fully evaluated because embedding service or database is offline"
            )
        else:
            parts.append("no semantically related precursors detected")

        # 3. Recurrence or frequency notes
        status = str(_extract_field(signal, "status", "open")).strip().lower()
        if has_keywords or has_loc_recurrence:
            parts.append("recurring pattern indicators observed at this location")
        elif category_matches >= 3:
            parts.append(f"multiple active signals in this operational category")

        if status == "resolved":
            parts.append("incident is marked resolved, moderating overall trend")

        sentence = ", and ".join(parts[:2])
        if len(parts) > 2:
            sentence += f"; {'; '.join(parts[2:])}."
        else:
            sentence += "."

        # Capitalize first letter
        sentence = sentence[0].upper() + sentence[1:]

        # Append optional AI analysis context if available
        if ai_analysis is not None:
            reasoning = _extract_field(ai_analysis, "reasoning", "")
            if reasoning and isinstance(reasoning, str):
                short_reasoning = reasoning.strip()
                if len(short_reasoning) > 120:
                    short_reasoning = short_reasoning[:117] + "..."
                sentence += f" (AI context: {short_reasoning})"

        return sentence

    def score_signal(
        self,
        signal: Any,
        related_signals: Optional[List[Any]] = None,
        candidate_signals: Optional[List[Any]] = None,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
        related_eval_failed: bool = False,
        reference_time: Optional[datetime] = None,
    ) -> RiskScoreResponse:
        """
        Main entry point for scoring an operational signal.
        Accepts signal, candidate context, related signals, and optional AI analysis.
        Returns a validated RiskScoreResponse.
        """
        # 1. Calculate each scoring factor
        sev_points, effective_sev = self.calculate_severity_factor(
            signal, ai_analysis=ai_analysis
        )
        freq_points, cat_matches = self.calculate_frequency_factor(
            signal, candidate_signals=candidate_signals
        )
        rec_points, has_kw, has_loc = self.calculate_recurrence_factor(
            signal, candidate_signals=candidate_signals
        )
        rel_points, rel_count, avg_sim = self.calculate_related_signals_factor(
            related_signals=related_signals
        )
        trend_points = self.calculate_trend_factor(
            signal, reference_time=reference_time
        )

        factors = RiskFactorBreakdown(
            severity=sev_points,
            frequency=freq_points,
            recurrence=rec_points,
            related_signals=rel_points,
            trend=trend_points,
        )

        # 2. Calculate composite score
        raw_score = sev_points + freq_points + rec_points + rel_points + trend_points
        composite_score = min(100, max(0, int(raw_score)))

        # 3. Determine level & priority
        risk_level = self.determine_risk_level(composite_score)
        priority = self.determine_priority(composite_score, signal=signal)

        # 4. Generate explainable summary
        explanation = self.generate_explanation(
            factors=factors,
            signal=signal,
            score=composite_score,
            risk_level=risk_level,
            priority=priority,
            related_count=rel_count,
            avg_similarity=avg_sim,
            has_keywords=has_kw,
            has_loc_recurrence=has_loc,
            category_matches=cat_matches,
            effective_severity=effective_sev,
            related_eval_failed=related_eval_failed,
            ai_analysis=ai_analysis,
        )

        # 5. Extract metadata
        sig_id = int(_extract_field(signal, "id", 0))
        sig_title = _extract_field(signal, "title", None)
        sig_category = _extract_field(signal, "category", None)
        sig_location = _extract_field(signal, "location", None)
        sig_severity = _extract_field(signal, "severity", None)
        sig_status = _extract_field(signal, "status", None)

        return RiskScoreResponse(
            signal_id=sig_id,
            signal_title=sig_title,
            risk_score=composite_score,
            risk_level=risk_level,
            priority=priority,
            factors=factors,
            explanation=explanation,
            signal_severity=sig_severity,
            signal_category=sig_category,
            signal_location=sig_location,
            signal_status=sig_status,
            related_signals_count=rel_count,
            evaluated_at=datetime.now(timezone.utc),
        )


# Default singleton instance
risk_service = RiskScoringService()
