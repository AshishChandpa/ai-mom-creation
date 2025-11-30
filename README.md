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

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Features

This project includes:
*   **Audio Recording and Playback** using `expo-audio`.
*   **Native Module Integration** for Speech-to-Text (STT) using `Whisper.cpp` (currently under development).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.