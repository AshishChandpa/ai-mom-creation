# **Updated Final Document — MoM System (React Native App + Python AI Service)**

---

## **1️⃣ Project Overview**

**Goal:** Build a Minutes of Meeting (MoM) generator that captures meeting audio using a mobile app and processes it through a lightweight **Python AI service** to generate structured MoM.

**Key Update:**
❗ **All AI (STT, diarization, NLP) runs in Python**, not inside the mobile device.

React Native handles:

* Recording
* Uploading audio
* Displaying MoM

Python service handles:

* Transcription (Whisper)
* Diarization
* NLP (summaries, decisions, action items)

Best for MVP. Fast to develop.

---

## **2️⃣ MVP Functional Requirements**

| Feature                   | Description                   | Input              | Output                   | Integration            |
| ------------------------- | ----------------------------- | ------------------ | ------------------------ | ---------------------- |
| **Audio Recording**       | Record audio in mobile        | WAV/MP3 file       | Local file               | React Native           |
| **Audio Upload**          | Send audio to Python backend  | Audio file         | HTTP POST                | React Native → Python  |
| **STT**                   | Transcribe audio to text      | Audio              | Transcript w/ timestamps | Python → Whisper       |
| **Diarization**           | Split by Speaker 1/2/3        | Transcript + audio | Labeled transcript       | Python → WhisperX-lite |
| **NLP Extraction**        | Get tasks, decisions, summary | Labeled transcript | Structured MoM           | Python → Llama/Gemma   |
| **MoM Formatting**        | Clean readable output         | NLP outputs        | Final MoM                | Python                 |
| **Display/Export**        | Show MoM, share/copy          | MoM text           | PDF/share                | React Native           |
| **Offline Audio Capture** | Record without network        | Audio              | Local file               | React Native           |
| **Online Processing**     | Python required               | Audio upload       | MoM                      | Python backend         |

---

## **3️⃣ New Architecture (Python-Based)**

```
      React Native (Mobile App)
      ├── Audio Recording
      ├── Upload Audio File
      └── Display MoM
                │
        HTTP API (FastAPI / Flask)
                │
        -----------------------------
        |        Python AI Service         |
        |----------------------------------|
        |  Whisper (STT)                  |
        |  WhisperX-lite (Diarization)    |
        |  Llama 3.1 / Gemma 2B (NLP)     |
        |  MoM Generator Pipeline         |
        -----------------------------
                │
           MoM Response (JSON)
```

---

## **4️⃣ Python Backend Pipeline**

### **Step 1: Audio Upload**

```
POST /process_audio
file: meeting.wav
```

### **Step 2: STT (Whisper)**

* Using **whisper-small** or **tiny.en** for speed
* Output: `"text"`, `"segments"`, `"timestamps"`

### **Step 3: Speaker Diarization**

* Using **WhisperX-lite**
* Output: `"speaker_segments"`

### **Step 4: NLP (Llama 3B / Gemma 2B)**

* Extract:

  * Summary
  * Action Items
  * Decisions
  * Deadlines
  * Topic-wise breakdown (future)

### **Step 5: MoM Formatter**

Python combines everything into a clean JSON:

```json
{
  "summary": [],
  "action_items": [],
  "decisions": [],
  "raw_transcript": ""
}
```

Mobile app simply displays it.

---

## **5️⃣ Where Each Component Lives**

### **📱 React Native (Frontend)**

* Audio Recorder
* Local file storage
* API calls to Python backend
* MoM viewer
* Sharing / PDF export

### **🐍 Python (Backend)**

* Whisper: STT
* WhisperX-lite: Diarization
* Llama: NLP summarization & extraction
* Result formatter
* API (FastAPI recommended)

### **🗂 Storage**

* Optional: Save audio files + MoM logs on server

---

## **6️⃣ API Structure (FastAPI Example)**

### **POST: /transcribe**

Send audio file to backend.

```python
@app.post("/process_audio")
async def process_audio(file: UploadFile):
    audio_path = save_file(file)
    transcript = run_whisper(audio_path)
    speakers = diarize(audio_path, transcript)
    mom = generate_mom(speakers)
    return mom
```

---

## **7️⃣ Python Libraries to Use**

| Purpose        | Library                     |
| -------------- | --------------------------- |
| Server         | FastAPI                     |
| STT            | Whisper / faster-whisper    |
| Diarization    | WhisperX-lite               |
| NLP            | Llama.cpp (Python bindings) |
| PDF (optional) | WeasyPrint / ReportLab      |
| Storage        | Local FS, SQLite (optional) |

---

## **8️⃣ React Native → Python Communication**

Example code:

```javascript
const formData = new FormData();
formData.append('file', {
  uri: audioPath,
  type: 'audio/wav',
  name: 'meeting.wav'
});

const response = await fetch('http://SERVER_IP:8000/process_audio', {
  method: 'POST',
  body: formData
});

const mom = await response.json();
setMom(mom);
```

---

## **9️⃣ Updated 8-Week Plan**

| Week | Task                                            |
| ---- | ----------------------------------------------- |
| 1–2  | React Native app + audio recording + API wiring |
| 3    | FastAPI setup + audio upload                    |
| 4    | Whisper integration                             |
| 5    | WhisperX diarization                            |
| 6    | Llama/Gemma NLP MoM generator                   |
| 7    | MoM formatting + React UI                       |
| 8    | Testing, optimizations, deployment              |

---

## **🔟 Summary of Changes**

✔ Removed Kotlin/Swift native modules
✔ AI pipeline moved to Python service
✔ React Native only handles UI + recording + upload
✔ Simplifies mobile development dramatically
✔ Easier to upgrade models in future
✔ Can scale to cloud when required

---

If you want, I can also generate:

* **FastAPI skeleton code**
* **Python AI pipeline code**
* **React Native complete API integration**
* **Model selection guide (Whisper tiny/small, Llama/Gemma)**

Just tell me:
👉 *“Give me the FastAPI + Whisper code”*
or
👉 *“Give me the React Native API integration full code”*
