from pydantic import BaseModel


class MomResponse(BaseModel):
    summary: list[str]
    action_items: list[str]
    decisions: list[str]
    raw_transcript: str
    speakers: list[dict] | None = None
    id: str | None = None
    created_at: str | None = None
