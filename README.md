# Welcome to your MoM Recorder Expo app 👋

This is an [Expo](https://expo.dev) project that has been converted to a **bare workflow** to support native modules.

## Get started

1.  **Install dependencies**

    ```bash
    npm install
    ```

2.  **Android Development Setup**

    This project uses native modules and requires a correctly configured Android development environment.

    *   **Install Android Studio** and the **Android SDK**.
    *   **Set `ANDROID_HOME`**: Add the following to your shell configuration file (e.g., `~/.bash_profile`, `~/.zshrc`, `~/.profile`), replacing `/path/to/your/android/sdk` with your actual Android SDK location:
        ```bash
        export ANDROID_HOME=/path/to/your/android/sdk
        export PATH=$PATH:$ANDROID_HOME/emulator
        export PATH=$PATH:$ANDROID_HOME/platform-tools
        ```
    *   **Save** the file and **restart your terminal** or run `source ~/.bash_profile` (or `~/.zshrc`, etc.) to apply changes.
    *   **Verify Installation**: Run `echo $ANDROID_HOME` and `adb devices` in a new terminal.

3.  **Run the app (Android)**

    ```bash
    npm run android
    ```

    This will build and run the app on an Android emulator or connected device.

4.  **Run the app (iOS - requires macOS)**

    ```bash
    npm run ios
    ```

    This will build and run the app on an iOS simulator or connected device.

5.  **Configure API base URL**

    The app expects the Python service at `EXPO_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`).

    ```bash
    echo "EXPO_PUBLIC_API_BASE_URL=http://<your-ip>:8000" > .env
    ```

    Replace `<your-ip>` with the machine running the Python service (e.g., `http://192.168.1.10:8000` for device/simulator access).

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Features

This project includes:
*   **Audio Recording and Playback** using `expo-audio`.
*   **Backend-first MoM generation**: recordings are uploaded to a Python FastAPI service (Whisper/diarization/LLM pipeline).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Python backend (FastAPI + faster-whisper)

A FastAPI service lives in `backend/` and exposes `/process_audio` for MoM generation (faster-whisper STT + placeholder diarization/LLM—swap in your models).

```bash
python3.11 -m venv backend/.venv           # use Python 3.11 to avoid PyAV wheel issues
source backend/.venv/bin/activate          # Windows: backend\\.venv\\Scripts\\activate
pip install --upgrade pip
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:
- `GET /health` — readiness ping
- `POST /process_audio` — multipart `file` upload, runs STT and returns MoM JSON and stores it in memory
- `GET /mom` — list stored MoM
- `GET /mom/{id}` — retrieve a stored MoM by id

Update `EXPO_PUBLIC_API_BASE_URL` to point to this service for the mobile app.

### Backend environment notes
- Run uvicorn from the repo root so `backend` is on `PYTHONPATH` (or set `PYTHONPATH=.`).
- Default Whisper settings: `WHISPER_MODEL_SIZE=tiny.en`, `WHISPER_DEVICE=cpu`, `WHISPER_COMPUTE_TYPE=int8`. Override via env vars before starting uvicorn.
- If you see "faster-whisper not available" at startup or stub transcripts in the app, ensure the backend venv uses Python 3.11 and rerun `pip install -r backend/requirements.txt` inside that venv.
- Backend log should show `[process_audio] Received file: ...` when uploads succeed; otherwise, check the client upload path (native uses `uploadAsync`, web uses FormData/Blob).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
