import os
import tempfile
from typing import Optional

from fastapi import UploadFile


async def persist_upload_to_temp(upload: UploadFile) -> Optional[str]:
    """Save an UploadFile to a temporary path and return it."""
    try:
        suffix = os.path.splitext(upload.filename or "")[-1]
        fd, temp_path = tempfile.mkstemp(prefix="mom_audio_", suffix=suffix or ".wav")
        with os.fdopen(fd, "wb") as tmp:
            content = await upload.read()
            tmp.write(content)
        return temp_path
    except Exception as exc:
        print(f"[persist_upload_to_temp] Failed to persist upload: {exc}")
        return None
