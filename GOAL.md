Absolutely — let’s create a **comprehensive final document** for your MVP on-device MoM app. I’ll consolidate:

* Requirements
* Architecture
* Component responsibilities
* Workflow
* Integrations
* Implementation details and where each part sits

This will serve as a **developer-ready blueprint**.

---

````{"variant":"standard","title":"Complete Final Document - On-Device MoM App","id":"94821"} 
# **Complete Final Document — On-Device MoM System (React Native MVP)**

---

## **1️⃣ Project Overview**
**Goal:** Build a fully **offline, mobile-first, free, on-device Minutes of Meeting (MoM) generator** that captures internal meeting audio and produces structured MoM with speaker-based action items, decisions, and summary.

**Target Users:** Internal team members, small company meetings.  
**Primary Platform:** React Native (Android first, iOS later).  
**Languages Supported:** English (Phase 1), Gujarati (Phase 2).  
**Core Principle:** Fully offline, zero cloud dependency, free, and privacy-friendly.

---

## **2️⃣ MVP Functional Requirements**

| Feature | Description | Input | Output | Integration / Location |
|---------|-------------|-------|--------|-----------------------|
| **Audio Recording** | Record meeting via single phone | User starts/stops recording | WAV/MP3 audio file | React Native (JS) using `react-native-audio-recorder-player` |
| **Speech-to-Text (STT)** | Transcribe audio offline | Recorded audio | Full transcript with timestamps | Native Module (Kotlin / Swift) → Whisper.cpp |
| **Speaker Diarization** | Identify multiple speakers as Speaker 1/2/3 | Transcript + audio | Speaker-labeled transcript | Native Module → WhisperX-lite |
| **Action Item Extraction** | Detect tasks and ownership | Speaker-labeled transcript | List of tasks, speaker assignments, deadlines (if mentioned) | Native Module → Llama.cpp / Gemma 2B |
| **Decision Extraction** | Detect final agreements/decisions | Speaker-labeled transcript | Structured list of decisions | Native Module → Llama.cpp / Gemma 2B |
| **Summary Generation** | Condense discussion points | Transcript + diarization | 5–7 bullet point summary | Native Module → Llama.cpp / Gemma 2B |
| **MoM Formatting** | Combine all outputs into readable format | Summary, Action Items, Decisions | Copy-pasteable page / optional PDF | React Native UI |
| **Export / Share** | Allow sharing of MoM | Formatted text | Copy, PDF, WhatsApp, Email | React Native UI (`react-native-share`, `react-native-pdf`) |
| **Offline Operation** | All features work without Internet | N/A | N/A | Entire App (Mobile device only) |

**Exclusions for MVP:**
- Real-time transcription  
- Named speaker recognition  
- Cloud storage / cloud AI  
- Zoom/Teams integration  
- Multi-device recording  

---

## **3️⃣ Architecture Overview**

### **High-Level Flow**
```
React Native UI (JS/TS)
     │
Native Bridges (Kotlin for Android / Swift for iOS)
     │
On-Device AI Engines (C++ libraries)
     ├─ Whisper.cpp (STT)
     ├─ WhisperX-lite (Diarization)
     └─ Llama 3.1 3B / Gemma 2B (NLP: Summarization + Task Extraction)
     │
MoM Output (Text / PDF / Shareable)
```

---

### **Component Responsibility Table**

| Layer | Component | Responsibility | Integration / Location |
|-------|-----------|----------------|-----------------------|
| **UI Layer** | React Native | Screens, buttons, MoM display, sharing | Entire front-end, JS/TS |
| **Native Module (Android)** | Kotlin | Bridge to C++ engines, memory/thread handling, audio I/O | Whisper.cpp, WhisperX-lite, Llama.cpp |
| **Native Module (iOS)** | Swift | Bridge to C++ engines, memory/thread handling, audio I/O | Whisper.cpp, WhisperX-lite, Llama.cpp |
| **AI Engine** | C++ / On-device models | STT, Diarization, NLP extraction | whisper.cpp, WhisperX-lite, llama.cpp/Gemma |
| **Storage** | Local (optional) | Save audio, transcripts, MoM | react-native-fs / internal storage |
| **Export / Share** | React Native UI | Copy, PDF, share via WhatsApp/email | react-native-share, react-native-pdf |

---

## **4️⃣ Processing Workflow**

1. **Audio Capture (React Native)**  
   - User taps **Start Recording** → audio saved locally  
   - Library: `react-native-audio-recorder-player`  

2. **Transcription (Native Module → C++)**  
   - Whisper.cpp converts audio to transcript with timestamps  
   - Kotlin/Swift bridge passes file path and receives transcript  

3. **Speaker Diarization (Native Module → C++)**  
   - WhisperX-lite splits transcript by Speaker 1, Speaker 2, etc.  

4. **NLP Extraction (Native Module → C++)**  
   - LLM (Llama 3.1 3B) extracts:  
     - Action Items  
     - Decisions  
     - Summary  
     - Deadlines  

5. **MoM Formatting (React Native)**  
   - Combine outputs into readable page  
   - Optional PDF rendering  

6. **Display / Export (React Native)**  
   - Show formatted MoM  
   - Allow **copy/share/export**  

---

## **5️⃣ Prompts for NLP (LLM)**

**Action Items Extraction Prompt**
```
Extract all ACTION ITEMS from the following transcript.
Include:
- Speaker
- Task
- Deadline (if mentioned)
Format as a list.
```

**Decision Extraction Prompt**
```
Extract all DECISIONS made in the meeting.
Focus on agreements or final outcomes.
```

**Summary Generation Prompt**
```
Summarize the meeting in 5–7 concise bullet points.
Highlight discussions, plans, and outcomes.
```

**Final MoM Formatting Prompt**
```
Combine Summary, Action Items, Decisions into a structured MoM:
## Summary
## Action Items
## Decisions
```

---

## **6️⃣ Technology Stack**

| Feature | Tech Choice | Notes |
|--------|-------------|------|
| UI | React Native | MVP first Android |
| Audio Recording | react-native-audio-recorder-player | High-quality WAV/MP3 |
| File Storage | react-native-fs | Optional local history |
| STT | whisper.cpp | On-device transcription |
| Diarization | WhisperX-lite | On-device speaker separation |
| NLP / MoM | Llama 3.1 3B / Gemma 2B | On-device summarization & extraction |
| Native Bridge | Kotlin / Swift | Connect React Native to C++ AI engines |
| MoM Export | react-native-share / react-native-pdf | Copy, share, PDF |

---

## **7️⃣ Implementation Decisions for MVP**

- LLM Size: **Llama 3.1 3B**  
- Storage: Optional local storage on phone  
- Platform: Android first  
- PDF Export: Yes (optional)  

---

## **8️⃣ MVP Development Plan (8 Weeks)**

| Week | Tasks |
|------|-------|
| 1–2 | React Native project setup, audio recording, local storage integration, Whisper.cpp module integration |
| 3–4 | Diarization module integration, native bridges setup, Llama.cpp setup |
| 5 | NLP pipeline: action items, decisions, summary extraction |
| 6–7 | MoM formatting, UI improvements, export/sharing functionality |
| 8 | Testing, optimization, multi-speaker handling, internal release |

---

## **9️⃣ Future Phases**

- Named speaker recognition & voice fingerprinting  
- Multi-language support (Gujarati, Hindi)  
- Zoom/Teams recording import  
- Real-time transcription  
- Cloud sync & analytics dashboard  
- Reminder/task tracking from MoM  

---

## **10️⃣ Summary**

This document clearly maps:

- Each component and its responsibility  
- Technology stack  
- Integration points (where React Native, Kotlin/Swift, and C++ engines interact)  
- Workflow from recording → MoM generation → display/export  
- Development plan and future roadmap  

This serves as a **full blueprint for on-device MoM MVP development**, guiding developers through **what to implement, where, and how**.

---

This is now a fully consolidated reference for your project with **integration points and functionality mapping**.  
It can be used directly for development, design discussions, and team alignment.
````
