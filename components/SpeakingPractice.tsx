import React, { useState, useRef, useEffect } from 'react';
import { VocabularyItem, SubmissionRecord } from '../types';
import AudioPlayer from './AudioPlayer';
import { PLACEHOLDER_IMAGES } from '../constants';

interface Props {
  data: VocabularyItem[];
  onComplete: () => void;
  onRecord: (record: SubmissionRecord) => void;
}

const SpeakingPractice: React.FC<Props> = ({ data, onComplete, onRecord }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentItem = data[currentIndex];

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      // Clear previous recording
      setRecordedBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    } catch (err) {
      console.error("Mic error", err);
      alert("Please allow microphone access!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  const handleNext = () => {
    // Determine the record for the current item
    const newRecord: SubmissionRecord | null = recordedBlob ? {
         type: 'speaking',
         itemId: currentItem.id,
         input: recordedBlob,
         score: 1, // Participation score
         feedback: "Recorded"
      } : null;

    // Report to parent
    if (newRecord) {
        onRecord(newRecord);
    }

    resetAndAdvance();
  };

  const handleSkip = () => {
      // If currently recording, stop it first
      if (isRecording && mediaRecorderRef.current) {
          stopRecording();
      }
      resetAndAdvance();
  };

  const resetAndAdvance = () => {
    // Reset local state for next item
    setRecordedBlob(null);
    setAudioUrl(null);
    setIsRecording(false); // Ensure stopped

    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all items
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">🎤 Listen & Repeat</h2>
      
      <div className="bg-green-50 p-6 rounded-3xl border-4 border-green-200 mb-8 flex flex-col items-center gap-4 w-full max-w-md">
         <img 
          src={PLACEHOLDER_IMAGES[currentItem.imageKeyword]} 
          alt={currentItem.english}
          className="w-48 h-48 object-cover rounded-2xl border-2 border-white shadow-md mb-2"
        />
        <div className="text-6xl font-bold text-gray-800">{currentItem.chinese}</div>
        <div className="text-2xl text-blue-500 font-bold">{currentItem.pinyin}</div>
        <AudioPlayer text={currentItem.chinese} label="Hear Teacher" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        
        {/* Controls */}
        <div className="flex gap-4">
            <button
                onClick={toggleRecording}
                className={`
                flex-1 py-4 rounded-2xl font-bold text-xl text-white shadow-lg transition-all
                ${isRecording 
                    ? 'bg-red-500 animate-pulse border-b-4 border-red-700' 
                    : 'bg-purple-500 hover:bg-purple-600 border-b-4 border-purple-700 btn-press'}
                `}
            >
                {isRecording ? '⏹️ Stop' : '🎙️ Record'}
            </button>

            {audioUrl && !isRecording && (
                <button
                    onClick={playRecording}
                    className="flex-1 py-4 rounded-2xl font-bold text-xl text-white bg-yellow-400 hover:bg-yellow-500 border-b-4 border-yellow-600 btn-press"
                >
                    ▶️ Play Back
                </button>
            )}
        </div>

        {/* Status Indicator */}
        <div className="h-8 flex items-center justify-center">
            {isRecording && <span className="text-red-500 font-bold animate-bounce">Recording...</span>}
            {!isRecording && recordedBlob && <span className="text-green-600 font-bold">Recorded! Ready to save.</span>}
        </div>

        {/* Navigation - Only allow next if recorded at least once */}
        {recordedBlob && !isRecording && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-blue-400 hover:bg-blue-500 border-b-4 border-blue-600 btn-press"
          >
            {currentIndex < data.length - 1 ? "Save & Next ➡️" : "Save & Finish 🏁"}
          </button>
        )}

        <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 font-bold py-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors"
        >
            Skip ⏩
        </button>
      </div>
      
      <div className="mt-8 text-gray-400 font-bold">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  );
};

export default SpeakingPractice;