import uuid
from datetime import datetime
from typing import Dict

from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.datastructures import UploadFile as StarletteUploadFile

from backend.file_utils import persist_upload_to_temp
from backend.models import MomResponse
from backend.pipeline import generate_mom, PipelineError


app = FastAPI(title="MoM Python Service", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


# In-memory store to unblock listing/detail; replace with database when wiring real pipeline.
_mom_store: Dict[str, MomResponse] = {}


@app.post("/process_audio", response_model=MomResponse)
async def process_audio(request: Request):
    """
    Accepts multipart file uploads (preferred) or raw bodies (fallback) to avoid 422s during early integration.
    """
    content_type = request.headers.get("content-type", "")
    upload: UploadFile | None = None

    if "multipart/form-data" in content_type:
        try:
            form = await request.form()
            possible_file = form.get("file")
            if isinstance(possible_file, (UploadFile, StarletteUploadFile)):
                upload = possible_file
                print(f"[process_audio] Received file: {upload.filename} ({upload.content_type})")
            else:
                print(
                    f"[process_audio] Multipart request 'file' was not an UploadFile. "
                    f"Type: {type(possible_file)}, Keys: {list(form.keys())}"
                )
                if hasattr(possible_file, "__dict__"):
                    print(f"[process_audio] Field dict: {possible_file.__dict__}")
        except Exception as exc:
            print(f"[process_audio] Failed to parse multipart form: {exc}")
    else:
        body = await request.body()
        print(f"[process_audio] Non-multipart payload, length {len(body)} bytes, content-type {content_type}")

    # Persist upload if present so the pipeline can read it; otherwise generate stub.
    temp_path = await persist_upload_to_temp(upload) if upload else None

    try:
        mom = await generate_mom(temp_path)
    except PipelineError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    # Ensure id/timestamp are set for listing even if pipeline did not.
    mom.id = mom.id or str(uuid.uuid4())
    mom.created_at = mom.created_at or datetime.utcnow().isoformat()

    _mom_store[mom.id] = mom
    return mom


@app.get("/mom", response_model=list[MomResponse])
async def list_mom():
    return list(_mom_store.values())


@app.get("/mom/{mom_id}", response_model=MomResponse)
async def get_mom(mom_id: str):
    if mom_id not in _mom_store:
        raise HTTPException(status_code=404, detail="MoM not found")
    return _mom_store[mom_id]
