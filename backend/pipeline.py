import asyncio
import os
import uuid
from datetime import datetime
from typing import Any, Optional

from backend.models import MomResponse

try:
    from faster_whisper import WhisperModel  # type: ignore
except Exception:
    WhisperModel = None  # type: ignore
    print("[pipeline] faster-whisper not available; will fall back to stub responses.")

_model: Any = None


class PipelineError(Exception):
    """Raised when the MoM pipeline fails."""


def _load_model() -> WhisperModel:
    if WhisperModel is None:
        raise PipelineError("faster-whisper is not installed. Install requirements to enable STT.")

    global _model
    if _model is None:
        model_size = os.getenv("WHISPER_MODEL_SIZE", "tiny.en")
        device = os.getenv("WHISPER_DEVICE", "cpu")
        compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
        try:
            _model = WhisperModel(model_size, device=device, compute_type=compute_type)
            print(f"[pipeline] Loaded Whisper model '{model_size}' on {device} ({compute_type})")
        except Exception as exc:
            raise PipelineError(f"Failed to load Whisper model '{model_size}': {exc}") from exc
    return _model


def _summarize_naive(text: str) -> tuple[list[str], list[str], list[str]]:
    if not text:
        return [], [], []
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    summary = sentences[:3]
    action_items = [s for s in sentences if any(k in s.lower() for k in ["will", "action", "follow", "todo", "assign"])]
    decisions = [s for s in sentences if any(k in s.lower() for k in ["decided", "agreed", "approved", "approved"])]
    return summary or sentences[:2], action_items[:3], decisions[:3]


async def generate_mom(audio_path: Optional[str]) -> MomResponse:
    """
    Generate MoM from an audio file using faster-whisper for STT.
    If missing dependencies or errors occur, fall back to a stub response.
    """
    if not audio_path or not os.path.exists(audio_path):
        return _stub_response("No audio file provided; returning placeholder MoM.")

    try:
        transcript_text = await asyncio.to_thread(_transcribe_whisper, audio_path)
        summary, action_items, decisions = _summarize_naive(transcript_text)
        return MomResponse(
            summary=summary or ["No summary extracted."],
            action_items=action_items or ["No action items extracted."],
            decisions=decisions or ["No decisions extracted."],
            raw_transcript=transcript_text,
            speakers=[
                {"speaker": "Speaker 1", "text": transcript_text},
            ],
            id=str(uuid.uuid4()),
            created_at=datetime.utcnow().isoformat(),
        )
    except PipelineError as exc:
        print(f"[pipeline] Pipeline dependency issue: {exc}")
        return _stub_response(str(exc))
    except Exception as exc:
        print(f"[pipeline] Whisper pipeline failed: {exc}")
        return _stub_response(f"Pipeline failed: {exc}")


def _transcribe_whisper(audio_path: str) -> str:
    model = _load_model()
    segments, _info = model.transcribe(audio_path, beam_size=1, language=None)
    transcript_parts = []
    for segment in segments:
        transcript_parts.append(segment.text.strip())
    return " ".join(transcript_parts).strip()


def _stub_response(reason: str) -> MomResponse:
    meeting_id = str(uuid.uuid4())
    return MomResponse(
        summary=[
            "MoM placeholder response.",
            reason,
        ],
        action_items=[
            "Connect backend pipeline to generate live data.",
        ],
        decisions=[
            "Deploy Whisper + diarization + LLM stack for production.",
        ],
        raw_transcript=f"Stub transcript for meeting {meeting_id}. Replace with Whisper output.",
        speakers=[
            {"speaker": "Speaker 1", "text": "Placeholder speaker text."},
        ],
        id=meeting_id,
        created_at=datetime.utcnow().isoformat(),
    )
