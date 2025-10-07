import os
import pyaudiowpatch as pyaudio
import sys
import time
import json
import threading
import queue
from deepgram import (
    DeepgramClient,
    LiveTranscriptionEvents,
    LiveOptions,
)
import asyncio

RATE = 16000
CHANNELS = 1
FORMAT = pyaudio.paInt16
CHUNK = 512

sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8')

def send_error_message(error_message):
    sys.stdout.write(json.dumps({"success": False, "error": error_message}) + "\n")
    sys.stdout.flush()

def capture_audio(audio_queue, stream, duration, start_time, capture_done_event):
    while duration is None or (time.time() - start_time) < duration:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            audio_queue.put(data)
        except Exception as e:
            send_error_message(f"Error capturing audio: {str(e)}")
            break
    capture_done_event.set()

def process_transcriptions(audio_queue, deepgram_key, capture_done_event, audio_language, channels, rate):
    async def send_audio():
        try:
            deepgram = DeepgramClient(deepgram_key)
            dg_connection = deepgram.listen.websocket.v("1")

            def on_message(self, result, **kwargs):
                try:
                    sentence = result.channel.alternatives[0].transcript
                    words = result.channel.alternatives[0].words
                    response = {"success": True, "data": {"status": 0, "sentence": sentence, "words": [], "channel_info": {"is_final": result.is_final, "speech_final": result.speech_final, "from_finalize": result.from_finalize}}}

                    if words:
                        for word in words:
                            response["data"]["words"].append({"word": word.word})

                    sys.stdout.write(json.dumps(response) + "\n")
                    sys.stdout.flush()
                except Exception as e:
                    send_error_message(f"Error processing transcription: {str(e)}")

            def on_error(error):
                send_error_message(f"Deepgram error: {str(error)}")

            dg_connection.on("error", on_error)
            dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)
            options_kwargs = dict(
                                model="nova-2-general",
                                encoding="linear16",
                                sample_rate=rate,
                                channels=channels,
                                interim_results=True,
                                )
            if audio_language != "detect_language":
                options_kwargs["language"] = audio_language

            options = LiveOptions(**options_kwargs)

            if not dg_connection.start(options):
                raise Exception("Failed to start connection with Deepgram. Check API Key or network connection.")

            while True:
                try:
                    data = audio_queue.get(timeout=3)
                    dg_connection.send(data)
                except queue.Empty:
                    if capture_done_event.is_set():
                        sys.stdout.write(json.dumps({"success": True, "data": {"status": 1, "message": "Audio capturing ended."}}))
                        sys.stdout.flush()
                        break
                    continue
            dg_connection.finish()
        except Exception as e:
            send_error_message(f"{str(e)}")

    asyncio.run(send_audio())

def recognize_stream(source_type, durationTime, deepgram_key, audio_language):
    try:
        audio = pyaudio.PyAudio()
        stream = None

        device_index = None
        default_loopback = None
        if source_type == "speaker":
            default_loopback = audio.get_default_wasapi_loopback()
        else: 
            default_loopback = audio.get_default_wasapi_device() 
 
        device_index = default_loopback['index']
        CHANNELS = default_loopback['maxInputChannels']
        RATE = int(default_loopback['defaultSampleRate'])
        try:
            stream = audio.open(
                format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK,
                input_device_index=device_index,
            )
        except Exception as e:
            raise Exception(f"Error starting audio capture: {str(e)}")
        sys.stdout.write(json.dumps({"success": True, "data": {"status": 2, "message": "Audio capture started."}}, ensure_ascii=False) + "\n")
        sys.stdout.flush()
        duration = None if durationTime.lower() == "unlimited" else int(durationTime)
        start_time = time.time()
        audio_queue = queue.Queue()
        capture_done_event = threading.Event()

        capture_thread = threading.Thread(target=capture_audio, args=(audio_queue, stream, duration, start_time, capture_done_event))
        capture_thread.start()

        transcription_thread = threading.Thread(target=process_transcriptions, args=(audio_queue, deepgram_key, capture_done_event, audio_language, CHANNELS, RATE))
        transcription_thread.start()

        capture_thread.join()
        transcription_thread.join()

        if stream:
            stream.stop_stream()
            stream.close()
        audio.terminate()
        
        sys.stdout.write(json.dumps({"success": True, "data": {"status": 1, "message": "Audio capture ended."}}) + "\n")
        sys.stdout.flush()
    except Exception as e:
        send_error_message(str(e))
        sys.exit(1)

if __name__ == '__main__':
    try:
        if len(sys.argv) != 5 or sys.argv[1].lower() not in ["mic", "speaker"] or sys.argv[2].lower() not in ['unlimited', "60", "600", "1800", "3600"]:
            raise ValueError("Usage: python script.py <mic|speaker> <durationTime> <deepgram_key> <language>")
        recognize_stream(sys.argv[1].lower(), sys.argv[2], sys.argv[3], sys.argv[4])
    except Exception as e:
        send_error_message(f"Startup error: {str(e)}")
        sys.exit(1)
