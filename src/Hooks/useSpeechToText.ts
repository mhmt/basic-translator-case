import { useCallback, useEffect, useRef } from 'react';

//@ts-ignore
const SpeechRecognitionHelper = window.SpeechRecognition || window.webkitSpeechRecognition;

interface ISpeechToTextReturnType {
    startListening: () => void;
    stopListening: () => void;
}

const useSpeechToText = (onResult: (text: string | null) => void): ISpeechToTextReturnType => {
    const speechRecognition = useRef(new SpeechRecognitionHelper()).current;
    useEffect(() => {
        speechRecognition.onspeechend = () => {
            speechRecognition.stop();
        };
        speechRecognition.onerror = (e: any) => {
            if (e.error === "not-allowed") {
                alert("Konuşma özelliği için lütfen mikrofon izni verin.");
                onResult(null);
            }
        }
        speechRecognition.onresult = (speechResult: any) => {
            const transcript = speechResult.results[0][0].transcript;
            onResult(transcript);
        };
    }, []);

    const startListening = useCallback(() => {
        speechRecognition.start();
    }, []);

    const stopListening = useCallback(() => {
        speechRecognition.stop();
    }, []);

    return {
        startListening,
        stopListening
    }
}

export default useSpeechToText;