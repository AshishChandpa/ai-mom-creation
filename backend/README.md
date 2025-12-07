# MoM Python Service

FastAPI service that the React Native app calls to generate Minutes of Meeting (MoM). `/process_audio` accepts audio, runs STT (faster-whisper) and returns MoM JSON. `/health` is a ping endpoint.

## Setup

```bash
# from repo root
python -m venv backend/.venv
source backend/.venv/bin/activate  # Windows: backend\\.venv\\Scripts\\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

If you see an import error like "attempted relative import with no known parent package", run the command from the repo root (so `backend` is on `PYTHONPATH`) or set `PYTHONPATH=.` when launching uvicorn.

The React Native app will call `http://<your-ip>:8000/process_audio` with multipart form data:

```
POST /process_audio
file: audio/wav
```

Endpoints:
- `GET /health` — readiness ping
- `POST /process_audio` — multipart `file` upload (file optional during early testing), returns MoM JSON and stores it in memory
- `GET /mom` — list stored MoM
- `GET /mom/{id}` — retrieve a stored MoM by id

### Enabling real Whisper transcription
- Install requirements (includes `faster-whisper`; on macOS arm64 we pin the git tag to work around prebuilt wheel availability).
- Optional env vars:
  - `WHISPER_MODEL_SIZE` (default `tiny.en`; options `tiny`, `base`, `small`, etc.)
  - `WHISPER_DEVICE` (default `cpu`; set to `cuda` if GPU available)
  - `WHISPER_COMPUTE_TYPE` (default `int8`; choose `float16`/`int8_float16` for GPUs)
- Pipeline runs faster-whisper for STT and naive summarization/action-item extraction; if dependencies are missing, it falls back to a placeholder response. Swap in diarization + LLM for production quality.

### Next steps
- Constrain CORS origins once deployed.
- Add storage (optional) for MoM and audio files.
