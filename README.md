# **Translator**

Translator is a desktop application built with **Electron.js**, featuring **React** on the frontend and **Node.js** on the backend. It leverages **Deepgram** for audio-to-text transcription, **PyAudio** for system audio capture, and **Azure AI Translator** for language translation.

🚨 **Note:** This application is only compatible with **Windows**. 

## **Features**
- 🎤 **Audio Capture**: Capture audio from either a microphone or the system's audio output.  
- 📝 **Audio Transcription**: Convert captured audio to text using Deepgram.  [Get your Deepgram key here](https://deepgram.com). 
- 🌍 **Audio Translation**: Uses Azure AI Translator for language translation. [Get your Azure AI Translator key here](https://azure.microsoft.com/en-us/products/ai-services/ai-translator).  
- ⏳ **Real-Time Transcription**: Deepgram is designed for real-time transcription, and the app leverages this capability by streaming and processing audio with minimal latency.  
- ⚡ **Electron-Based UI**: A modern and responsive interface powered by React and Electron.  
- 🐍 **Python Backend**: Uses Python scripts executed via Node.js to handle audio processing. 

## **Requirements**
1- Install Dependencies.
    - Node.js (Latest LTS version recommended).
    - Python 3.12 (Ensure it is added to PATH).
2- Setup Python Environment. This project uses a virtual environment to manage Python dependencies. Run the following commands in PowerShell:
    ```
      cd app
      uv venv .venv
      .venv\Scripts\activate
      uv sync
    ```

3- Install Node.js Dependencies.<br/>
     - Run the following command in the root directory of the project to install dependencies: `npm install`
     - Running the Application. To start the application in development mode: `npm run dev`
     - To rebuild dependencies after installing or modifying native modules: `npm rebuild`
     - To package the application for distribution: `npm run build`

