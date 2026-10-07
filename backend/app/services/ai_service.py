"""
Reusable AI / LLM service for EarlySight operational intelligence.
Communicates with OpenAI API for signal summarization, structured analysis, and reasoning.
"""

import json
import logging
from typing import Any, Dict, Optional

from openai import (
    APIConnectionError,
    AuthenticationError,
    OpenAI,
    OpenAIError,
    RateLimitError,
)
from pydantic import ValidationError

from app.config import settings
from app.schemas.ai import SignalAnalysisOutput

logger = logging.getLogger(__name__)

SYSTEM_SIGNAL_ANALYSIS_PROMPT = """You are EarlySight's Operational Intelligence AI Analyst.
Your role is to analyze precursor operational signals from industrial, civic, or institutional facilities.
Analyze the provided signal details strictly based on the provided facts. Do NOT invent or hallucinate facts that are not present.

Respond ONLY with a valid JSON object matching the following structure:
{
  "summary": "A concise executive summary of the operational issue.",
  "category": "Operational category (maintenance, safety, infrastructure, crowding, complaint, equipment, other).",
  "severity": "Assessed operational severity level (low, medium, high, critical).",
  "key_evidence": ["Evidence observation 1", "Evidence observation 2"],
  "recommended_attention": "Immediate operational focus or action recommendation.",
  "reasoning": "Analytical reasoning explaining why this precursor matters and how it could escalate."
}"""


class AIServiceNotConfiguredError(Exception):
    """Raised when the AI service is requested but OPENAI_API_KEY is not configured."""
    pass


class AIServiceError(Exception):
    """Raised when an OpenAI API call fails or returns an unprocessable response."""
    pass


class AIService:
    """
    Service layer encapsulating OpenAI API interactions for EarlySight.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.api_key = api_key if api_key is not None else settings.openai_api_key
        self.model = model if model is not None else settings.openai_model
        self.timeout = timeout
        self._client: Optional[OpenAI] = None

    @property
    def is_configured(self) -> bool:
        """Checks whether a non-empty OpenAI API key is set."""
        return bool(self.api_key and self.api_key.strip())

    def get_client(self) -> OpenAI:
        """
        Lazily creates and returns the OpenAI client.
        Raises AIServiceNotConfiguredError if no API key is available.
        """
        if not self.is_configured:
            raise AIServiceNotConfiguredError(
                "AI service is not configured. Please configure OPENAI_API_KEY."
            )

        if self._client is None:
            self._client = OpenAI(
                api_key=self.api_key.strip(),
                timeout=self.timeout,
                max_retries=2,
            )
        return self._client

    def analyze_signal(self, signal: Any) -> SignalAnalysisOutput:
        """
        Submits signal data to the configured LLM and returns structured analysis.

        Accepts either a SQLAlchemy Signal model instance or a dictionary containing:
        - title, description, category, location, severity, source, status.

        Returns a validated SignalAnalysisOutput model.
        """
        if not self.is_configured:
            raise AIServiceNotConfiguredError(
                "AI service is not configured. Please configure OPENAI_API_KEY."
            )

        # Extract signal details safely
        title = getattr(signal, "title", None) or (signal.get("title") if isinstance(signal, dict) else "Unknown")
        description = getattr(signal, "description", None) or (signal.get("description") if isinstance(signal, dict) else "None provided")
        category = getattr(signal, "category", None) or (signal.get("category") if isinstance(signal, dict) else "other")
        location = getattr(signal, "location", None) or (signal.get("location") if isinstance(signal, dict) else "Unspecified")
        severity = getattr(signal, "severity", None) or (signal.get("severity") if isinstance(signal, dict) else "medium")
        source = getattr(signal, "source", None) or (signal.get("source") if isinstance(signal, dict) else "manual")
        status = getattr(signal, "status", None) or (signal.get("status") if isinstance(signal, dict) else "open")

        user_content = (
            f"Please analyze the following operational signal:\n"
            f"- Title: {title}\n"
            f"- Description: {description}\n"
            f"- Category: {category}\n"
            f"- Location: {location}\n"
            f"- Severity: {severity}\n"
            f"- Source: {source}\n"
            f"- Status: {status}\n"
        )

        try:
            client = self.get_client()
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_SIGNAL_ANALYSIS_PROMPT},
                    {"role": "user", "content": user_content},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )

            raw_text = response.choices[0].message.content or "{}"
            parsed_data = json.loads(raw_text)
            return SignalAnalysisOutput.model_validate(parsed_data)

        except AuthenticationError:
            logger.error("OpenAI authentication failed. Please verify OPENAI_API_KEY.")
            raise AIServiceError("OpenAI authentication failed. Invalid or revoked API key.") from None

        except RateLimitError:
            logger.warning("OpenAI rate limit reached.")
            raise AIServiceError("OpenAI service rate limit exceeded. Please retry shortly.") from None

        except APIConnectionError as exc:
            logger.warning("Failed to connect to OpenAI API: %s", type(exc).__name__)
            raise AIServiceError("Unable to reach OpenAI API service. Network timeout or connection failure.") from None

        except (json.JSONDecodeError, ValidationError) as exc:
            logger.error("Failed to parse structured output from model: %s", type(exc).__name__)
            raise AIServiceError("The AI model returned an unparseable response structure.") from None

        except OpenAIError as exc:
            logger.error("OpenAI API error encountered: %s", type(exc).__name__)
            raise AIServiceError(f"OpenAI service error: {type(exc).__name__}") from None

        except Exception as exc:
            logger.error("Unexpected error during AI signal analysis: %s", type(exc).__name__)
            raise AIServiceError("An unexpected error occurred during AI analysis.") from None


# Default application-wide singleton
ai_service = AIService()
