"""
Evidence and Explainability service for EarlySight (Milestone 8).
Connects operational signals, semantic precursor clusters, and M7 risk dimensions
into factual evidence items, evidence-strength classification, and explainable narratives.

Answers:
- WHAT happened?
- WHERE did it happen?
- HOW OFTEN is it happening?
- IS it recurring/increasing?
- WHY does it matter?

NOTE: Evidence strength and narrative synthesis are configurable MVP heuristics
grounded in verified backend data. They do not assert scientific certainty.
"""

from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional, Set, Union

from app.config import settings
from app.schemas.ai import SignalAnalysisOutput
from app.schemas.evidence import (
    EvidenceItem,
    EvidenceResponse,
    EvidenceStrengthType,
)
from app.schemas.risk import RiskScoreResponse
from app.services.risk_service import RECURRENCE_KEYWORDS, risk_service

logger = logging.getLogger(__name__)


def _extract(entity: Any, field_name: str, default: Any = None) -> Any:
    """Safely extracts a field from a SQLAlchemy model instance, dict, or Pydantic object."""
    if entity is None:
        return default
    if isinstance(entity, dict):
        return entity.get(field_name, default)
    return getattr(entity, field_name, default)


class EvidenceService:
    """
    Evidence synthesis and explainability engine.
    Constructs structured evidence items and cautious explainable summaries
    without invoking external LLM APIs.
    """

    def __init__(
        self,
        strength_high_min: Optional[int] = None,
        strength_moderate_min: Optional[int] = None,
    ):
        self.strength_high_min = (
            strength_high_min
            if strength_high_min is not None
            else settings.evidence_strength_high_min
        )
        self.strength_moderate_min = (
            strength_moderate_min
            if strength_moderate_min is not None
            else settings.evidence_strength_moderate_min
        )

    def evaluate_evidence_strength(
        self,
        signal: Any,
        related_signals: Optional[List[Any]] = None,
        candidate_signals: Optional[List[Any]] = None,
        risk_response: Optional[RiskScoreResponse] = None,
    ) -> EvidenceStrengthType:
        """
        Calculates factual evidence strength (LOW, MODERATE, HIGH) based on concrete data density:
        - Severity level
        - Count and similarity of semantically related precursor signals
        - Location recurrence confirmation in cohort
        - Recurrence keywords in text description
        - Category density across cohort
        - Multi-source independent reporting confirmation
        - Active recent trend
        """
        points = 0

        # 1. Severity points
        sev = str(_extract(signal, "severity", "medium")).lower()
        if sev == "critical":
            points += 3
        elif sev == "high":
            points += 2
        elif sev == "medium":
            points += 1

        # 2. Related signals points
        if related_signals:
            rel_count = len(related_signals)
            if rel_count >= 3:
                points += 3
            elif rel_count >= 1:
                points += 2

            # Check if any similarity exceeds 0.85
            top_sim = max(
                (float(_extract(item, "similarity", 0.0)) for item in related_signals),
                default=0.0,
            )
            if top_sim >= 0.85:
                points += 1

        # 3. Location recurrence & keywords
        loc = _extract(signal, "location", None)
        if loc and candidate_signals:
            loc_str = str(loc).strip().lower()
            loc_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "location", "")).strip().lower() == loc_str
            )
            if loc_matches >= 1:
                points += 2

        title = str(_extract(signal, "title", "")).lower()
        desc = str(_extract(signal, "description", "")).lower()
        text_corpus = f"{title} {desc}"
        if any(kw in text_corpus for kw in RECURRENCE_KEYWORDS):
            points += 1

        # 4. Category density in candidate cohort
        cat = str(_extract(signal, "category", "other")).strip().lower()
        if candidate_signals:
            cat_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "category", "")).strip().lower() == cat
            )
            if cat_matches >= 4:
                points += 2
            elif cat_matches >= 2:
                points += 1

        # 5. Multiple independent reporting sources
        sources: Set[str] = set()
        primary_source = str(_extract(signal, "source", "")).strip().lower()
        if primary_source:
            sources.add(primary_source)
        if candidate_signals:
            for c in candidate_signals:
                s = str(_extract(c, "source", "")).strip().lower()
                if s:
                    sources.add(s)
        if len(sources) >= 3:
            points += 2
        elif len(sources) == 2:
            points += 1

        # 6. Trend / recent active state
        status = str(_extract(signal, "status", "open")).strip().lower()
        if status == "open":
            points += 1

        # Map total points into categorical tiers
        if points >= self.strength_high_min:
            return "HIGH"
        if points >= self.strength_moderate_min:
            return "MODERATE"
        return "LOW"

    def build_evidence_items(
        self,
        signal: Any,
        risk_response: RiskScoreResponse,
        candidate_signals: Optional[List[Any]] = None,
        related_signals: Optional[List[Any]] = None,
        related_eval_failed: bool = False,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
    ) -> List[EvidenceItem]:
        """
        Assembles structured EvidenceItem objects grounded in verified backend data.
        """
        items: List[EvidenceItem] = []
        factors = risk_response.factors

        sig_id = int(_extract(signal, "id", 0))
        title = str(_extract(signal, "title", "Operational Observation"))
        desc = str(_extract(signal, "description", ""))
        location = _extract(signal, "location", None)
        severity = _extract(signal, "severity", "medium")
        category = str(_extract(signal, "category", "other"))
        status = str(_extract(signal, "status", "open"))
        created_at = _extract(signal, "created_at", None)

        # 1. PRIMARY_SIGNAL Evidence
        primary_desc = f"{title}. {desc}".strip() if desc else f"{title}."
        items.append(
            EvidenceItem(
                type="PRIMARY_SIGNAL",
                description=primary_desc,
                signal_id=sig_id,
                timestamp=created_at if isinstance(created_at, datetime) else None,
                location=location,
                severity=severity,
                contribution_factor="severity",
                contribution_points=factors.severity if factors else None,
            )
        )

        # 2. SEVERITY Evidence
        sev_desc = (
            f"Assessed operational severity '{severity}' contributes "
            f"{factors.severity if factors else 0} risk points to problem prioritization."
        )
        if ai_analysis is not None:
            ai_sev = _extract(ai_analysis, "severity", None)
            if ai_sev and str(ai_sev).lower() != str(severity).lower():
                sev_desc += f" (Structured AI analysis noted elevated severity '{ai_sev}')."

        items.append(
            EvidenceItem(
                type="SEVERITY",
                description=sev_desc,
                signal_id=sig_id,
                severity=severity,
                contribution_factor="severity",
                contribution_points=factors.severity if factors else None,
            )
        )

        # 3. RELATED_SIGNAL Evidence (from M6 semantic embeddings)
        if related_signals:
            for rel in related_signals:
                rel_id = int(_extract(rel, "signal_id", 0))
                rel_title = str(_extract(rel, "title", "Corroborating Signal"))
                rel_sim = float(_extract(rel, "similarity", 0.0))
                rel_loc = _extract(rel, "location", None)
                rel_sev = _extract(rel, "severity", None)
                rel_desc = (
                    f"Corroborating incident #{rel_id}: '{rel_title}' "
                    f"detected with {rel_sim:.2f} semantic cosine similarity."
                )
                items.append(
                    EvidenceItem(
                        type="RELATED_SIGNAL",
                        description=rel_desc,
                        signal_id=rel_id,
                        similarity=round(rel_sim, 4),
                        location=rel_loc,
                        severity=rel_sev,
                        contribution_factor="related_signals",
                        contribution_points=factors.related_signals if factors else None,
                    )
                )
        elif related_eval_failed:
            items.append(
                EvidenceItem(
                    type="RELATED_SIGNAL",
                    description=(
                        "Related-signal evidence could not be fully evaluated because "
                        "the embedding service or database is currently offline."
                    ),
                    contribution_factor="related_signals",
                    contribution_points=0,
                )
            )

        # 4. RECURRENCE Evidence
        text_corpus = f"{title} {desc}".lower()
        matched_kw = [kw for kw in RECURRENCE_KEYWORDS if kw in text_corpus]
        loc_matches = 0
        if location and candidate_signals:
            loc_str = str(location).strip().lower()
            loc_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "location", "")).strip().lower() == loc_str
            )

        if loc_matches > 0 or matched_kw:
            rec_parts: List[str] = []
            if loc_matches > 0:
                rec_parts.append(
                    f"{loc_matches} prior incident(s) previously recorded near '{location}'"
                )
            if matched_kw:
                rec_parts.append(
                    f"chronic pattern indicators observed in report text ('{matched_kw[0]}')"
                )
            rec_desc = "; ".join(rec_parts).capitalize() + "."
            items.append(
                EvidenceItem(
                    type="RECURRENCE",
                    description=rec_desc,
                    location=location,
                    contribution_factor="recurrence",
                    contribution_points=factors.recurrence if factors else None,
                )
            )

        # 5. FREQUENCY Evidence
        cat_matches = 0
        if candidate_signals:
            cat_str = category.strip().lower()
            cat_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "category", "")).strip().lower() == cat_str
            )

        freq_desc = (
            f"Category '{category}' has {cat_matches} recorded signal(s) in the active cohort, "
            f"contributing {factors.frequency if factors else 0} frequency points."
            if cat_matches > 0
            else f"Signal source '{_extract(signal, 'source', 'manual')}' contributes {factors.frequency if factors else 0} frequency baseline points."
        )
        items.append(
            EvidenceItem(
                type="FREQUENCY",
                description=freq_desc,
                contribution_factor="frequency",
                contribution_points=factors.frequency if factors else None,
            )
        )

        # 6. TREND Evidence
        items.append(
            EvidenceItem(
                type="TREND",
                description=(
                    f"Operational lifecycle status is '{status}', contributing "
                    f"{factors.trend if factors else 0} trend points to urgency."
                ),
                timestamp=created_at if isinstance(created_at, datetime) else None,
                contribution_factor="trend",
                contribution_points=factors.trend if factors else None,
            )
        )

        return items

    def generate_explanation_narrative(
        self,
        signal: Any,
        risk_response: RiskScoreResponse,
        candidate_signals: Optional[List[Any]] = None,
        related_signals: Optional[List[Any]] = None,
        evidence_strength: EvidenceStrengthType = "MODERATE",
        related_eval_failed: bool = False,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
    ) -> str:
        """
        Synthesizes an explainable, fact-grounded narrative answering:
        - WHAT happened?
        - WHERE did it happen?
        - HOW OFTEN is it happening?
        - IS it recurring/increasing?
        - WHY does it matter?

        Uses cautious language ("suggests", "indicates", "may indicate", "increases concern").
        """
        title = str(_extract(signal, "title", "operational event")).strip()
        location = _extract(signal, "location", None)
        category = str(_extract(signal, "category", "operational")).strip().lower()
        severity = str(_extract(signal, "severity", "medium")).strip().lower()
        status = str(_extract(signal, "status", "open")).strip().lower()

        # 1. WHAT & WHERE
        loc_phrase = f"near '{location}'" if location else "in an unassigned location"
        what_where = f"{severity.capitalize()}-severity {category} report ('{title}') was observed {loc_phrase}."

        # 2. HOW OFTEN
        cat_matches = 0
        if candidate_signals:
            cat_str = category.strip().lower()
            cat_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "category", "")).strip().lower() == cat_str
            )
        how_often = (
            f"The category has {cat_matches} recorded event(s) across the monitored cohort."
            if cat_matches > 0
            else f"This is currently recorded as an isolated event in the '{category}' classification."
        )

        # 3. IS it recurring/increasing
        rel_count = len(related_signals) if related_signals else 0
        loc_matches = 0
        if location and candidate_signals:
            loc_str = str(location).strip().lower()
            loc_matches = sum(
                1
                for c in candidate_signals
                if str(_extract(c, "location", "")).strip().lower() == loc_str
            )

        if rel_count > 0 and loc_matches > 0:
            recurring = (
                f"{rel_count} semantically related signal(s) and repeated location reports "
                f"suggest an emerging precursor pattern."
            )
        elif rel_count > 0:
            recurring = (
                f"{rel_count} semantically related precursor signal(s) detected, "
                f"indicating potential cross-system correlation."
            )
        elif loc_matches > 0:
            recurring = (
                f"Repeated reports in the same zone suggest chronic local recurrence."
            )
        elif related_eval_failed:
            recurring = (
                "Related-signal analysis could not be evaluated due to offline services, "
                "so pattern clustering remains unverified."
            )
        else:
            recurring = "No semantically related precursor clusters have been detected."

        # 4. WHY does it matter
        if risk_response.risk_level in ("CRITICAL", "HIGH"):
            why = (
                f"Active status ('{status}') and a composite risk score of {risk_response.risk_score} "
                f"({risk_response.risk_level} / Priority {risk_response.priority}) increase concern for operational escalation."
            )
        elif risk_response.risk_level == "MODERATE":
            why = (
                f"With a risk score of {risk_response.risk_score} (MODERATE), this condition indicates "
                f"a non-acute concern warranting standard maintenance review."
            )
        else:
            why = (
                f"A risk score of {risk_response.risk_score} (LOW) indicates minimal immediate hazard, "
                f"suitable for routine monitoring."
            )

        # Append structured AI analysis context if available
        ai_note = ""
        if ai_analysis is not None:
            reasoning = _extract(ai_analysis, "reasoning", "")
            if reasoning and isinstance(reasoning, str):
                short_r = reasoning.strip()
                if len(short_r) > 110:
                    short_r = short_r[:107] + "..."
                ai_note = f" AI analysis notes: {short_r}"

        full_narrative = f"{what_where} {how_often} {recurring} {why}{ai_note}".strip()
        return full_narrative

    def build_evidence(
        self,
        signal: Any,
        risk_response: Optional[RiskScoreResponse] = None,
        candidate_signals: Optional[List[Any]] = None,
        related_signals: Optional[List[Any]] = None,
        related_eval_failed: bool = False,
        ai_analysis: Optional[Union[SignalAnalysisOutput, Dict[str, Any]]] = None,
        reference_time: Optional[datetime] = None,
    ) -> EvidenceResponse:
        """
        Main entry point for building evidence synthesis for an operational signal.
        Reuses M7 risk scoring and M6 related signal information.
        """
        # 1. Compute M7 risk response if not already supplied
        if risk_response is None:
            risk_response = risk_service.score_signal(
                signal=signal,
                related_signals=related_signals,
                candidate_signals=candidate_signals,
                ai_analysis=ai_analysis,
                related_eval_failed=related_eval_failed,
                reference_time=reference_time,
            )

        # 2. Evaluate evidence strength
        evidence_strength = self.evaluate_evidence_strength(
            signal=signal,
            related_signals=related_signals,
            candidate_signals=candidate_signals,
            risk_response=risk_response,
        )

        # 3. Assemble structured evidence items
        evidence_items = self.build_evidence_items(
            signal=signal,
            risk_response=risk_response,
            candidate_signals=candidate_signals,
            related_signals=related_signals,
            related_eval_failed=related_eval_failed,
            ai_analysis=ai_analysis,
        )

        # 4. Generate cautious, fact-grounded explanation narrative
        summary = self.generate_explanation_narrative(
            signal=signal,
            risk_response=risk_response,
            candidate_signals=candidate_signals,
            related_signals=related_signals,
            evidence_strength=evidence_strength,
            related_eval_failed=related_eval_failed,
            ai_analysis=ai_analysis,
        )

        sig_id = int(_extract(signal, "id", 0))
        sig_title = _extract(signal, "title", None)

        return EvidenceResponse(
            signal_id=sig_id,
            signal_title=sig_title,
            summary=summary,
            evidence_strength=evidence_strength,
            evidence=evidence_items,
            risk_score=risk_response.risk_score,
            risk_level=risk_response.risk_level,
            priority=risk_response.priority,
            factors=risk_response.factors,
            evaluated_at=datetime.now(timezone.utc),
        )


# Singleton instance
evidence_service = EvidenceService()
