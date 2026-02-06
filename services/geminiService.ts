import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResponse } from "../types";

// Helper: Convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Uses Browser Native Speech Synthesis for instant, free audio.
 * @param text The text to speak
 * @param lang 'zh-CN' for Chinese, 'en-US' for English
 */
export const speakText = (text: string, lang: 'zh-CN' | 'en-US' = 'zh-CN') => {
  if (!window.speechSynthesis) return;
  
  // Cancel previous speech to ensure instant reaction
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang === 'zh-CN' ? 0.8 : 1.0; // Slower for Chinese

  // Try to find a specific voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetVoice = voices.find(v => v.lang.includes(lang));
    if (targetVoice) utterance.voice = targetVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Helper to get client instance safely on demand
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  // If no key is found, we throw here, but only when the action is performed, avoiding app crash on load.
  if (!apiKey) {
    console.warn("API Key is missing. Ensure process.env.API_KEY is set or selected.");
  }
  // Initialize even if empty to let the SDK throw its specific error or if the environment injects it differently.
  return new GoogleGenAI({ apiKey: apiKey || '' });
};


// 1. Evaluate Handwriting (Image Analysis)
export const checkHandwritingWithGemini = async (targetWord: string, targetPinyin: string, imageBlob: Blob): Promise<FeedbackResponse> => {
  try {
    const ai = getAiClient();
    const base64Image = await blobToBase64(imageBlob);

    const prompt = `
      You are a strict but friendly Chinese teacher for children.
      The student was asked to write the Pinyin "${targetPinyin}" for the word "${targetWord}".
      Analyze the provided handwriting image.
      
      Check for:
      1. Correct letters (spelling).
      2. Correct tone mark (is the mark there? is it over the correct vowel? is it the correct shape?).
      
      Respond in JSON format:
      {
        "isCorrect": boolean,
        "message": "A short, simple sentence in English telling the student what to fix. E.g., 'You missed the tone mark!' or 'It is zuó, not zuo'."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
          },
          required: ["isCorrect", "message"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Handwriting Check Error:", error);
    return { isCorrect: false, message: "I couldn't read that clearly. Please check your API Key or try writing bigger!" };
  }
};

// 2. Evaluate Pronunciation (Audio)
export const evaluateAudioWithGemini = async (targetPinyin: string, audioBlob: Blob): Promise<FeedbackResponse> => {
  try {
    const ai = getAiClient();
    const base64Audio = await blobToBase64(audioBlob);

    const prompt = `
      You are a kind Chinese teacher for kids.
      The student is trying to say the pinyin/word: "${targetPinyin}".
      Listen to the audio. Is the pronunciation acceptable for a beginner 8-year-old?
      
      Respond in JSON format:
      {
        "isCorrect": boolean,
        "message": "Simple feedback in English."
      }
      If correct, say something like "Nice pronunciation!".
      If wrong, point out the specific error gently (e.g. "Make your voice go up for the second tone!").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-native-audio-preview-12-2025",
      contents: {
        parts: [
          { inlineData: { mimeType: "audio/wav", data: base64Audio } }, 
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
          },
          required: ["isCorrect", "message"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Audio Eval Error:", error);
    return { isCorrect: false, message: "I couldn't hear you clearly. Can you try again?" };
  }
};