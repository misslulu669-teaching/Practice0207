import React, { useState, useRef, useEffect } from 'react';
import { VocabularyItem, SubmissionRecord } from '../types';
import AudioPlayer from './AudioPlayer';
import { checkHandwritingWithGemini, speakText } from '../services/geminiService';
import CanvasBoard, { CanvasBoardRef } from './CanvasBoard';
import { SOUNDS, PLACEHOLDER_IMAGES } from '../constants';

interface Props {
  data: VocabularyItem[];
  onComplete: (records: SubmissionRecord[]) => void;
}

const PinyinPractice: React.FC<Props> = ({ data, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0); // 0 means no penalty
  const [records, setRecords] = useState<SubmissionRecord[]>([]);

  const canvasRef = useRef<CanvasBoardRef>(null);
  const currentItem = data[currentIndex];

  // Timer effect for penalty
  useEffect(() => {
    let timer: number;
    if (penaltyTime > 0) {
      timer = window.setInterval(() => {
        setPenaltyTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [penaltyTime]);

  const handleSubmit = async () => {
    if (!canvasRef.current || canvasRef.current.isEmpty()) {
        alert("Please write something first!");
        return;
    }

    setLoading(true);
    setFeedback(null);

    const imageBlob = await canvasRef.current.getBlob();
    if (!imageBlob) return;

    const result = await checkHandwritingWithGemini(currentItem.chinese, currentItem.pinyin, imageBlob);

    setLoading(false);

    if (result.isCorrect) {
      new Audio(SOUNDS.CORRECT).play();
      setIsCorrect(true);
      setFeedback(result.message);
      speakText("Great job!", "en-US");
      
      setRecords(prev => [...prev, {
        type: 'writing',
        itemId: currentItem.id,
        input: imageBlob, // Store blob for teacher
        score: 1,
        feedback: result.message
      }]);

    } else {
      new Audio(SOUNDS.WRONG).play();
      setIsCorrect(false);
      setFeedback(result.message);
      
      // Error Flow:
      // 1. Speak explanation
      speakText(result.message, "en-US");
      // 2. Start 10s penalty
      setPenaltyTime(10);
    }
  };

  const handleNext = () => {
    canvasRef.current?.clear();
    setFeedback(null);
    setIsCorrect(false);
    
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(records);
    }
  };

  const isPenaltyActive = penaltyTime > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">✍️ Write Pinyin</h2>
      
      <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
        <div className="bg-blue-50 p-4 rounded-3xl border-4 border-blue-200 flex flex-col items-center gap-2">
            <img 
            src={PLACEHOLDER_IMAGES[currentItem.imageKeyword]} 
            alt={currentItem.english}
            className="w-32 h-32 object-cover rounded-2xl border-2 border-white shadow-md"
            />
            <div className="text-5xl font-bold text-gray-800">{currentItem.chinese}</div>
            <AudioPlayer text={currentItem.chinese} autoPlay label="Play" />
        </div>

        {/* Drawing Area */}
        <div className="relative">
             <CanvasBoard 
                ref={canvasRef} 
                disabled={isCorrect || loading || isPenaltyActive} 
                width={300} 
                height={200} 
             />
             <button 
                onClick={() => canvasRef.current?.clear()}
                disabled={isCorrect || loading || isPenaltyActive}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 text-sm font-bold shadow-sm"
             >
                Clear
             </button>
        </div>
      </div>

      {/* Correct Answer Overlay during Penalty */}
      {isPenaltyActive && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-3xl border-4 border-yellow-400 text-center shadow-2xl animate-bounce">
                  <h3 className="text-2xl font-bold text-gray-500 mb-2">Look closely!</h3>
                  <div className="text-7xl font-bold text-blue-600 mb-4">{currentItem.pinyin}</div>
                  <div className="text-xl text-red-500 font-bold mb-4">Wait {penaltyTime}s to try again...</div>
                  <div className="text-gray-400">Teacher says: "{feedback}"</div>
              </div>
          </div>
      )}

      <div className="w-full max-w-md space-y-4">
        {!isCorrect && !isPenaltyActive && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-xl text-white transition-all
              ${loading ? 'bg-gray-300' : 'bg-green-400 hover:bg-green-500 border-b-4 border-green-600 btn-press'}
            `}
          >
            {loading ? 'Checking your handwriting...' : 'Check Handwriting ✨'}
          </button>
        )}

        {/* Success Feedback */}
        {isCorrect && feedback && (
          <div className="p-4 rounded-2xl text-center font-medium text-lg border-2 bg-green-100 border-green-300 text-green-700 animate-pulse">
            🎉 {feedback}
          </div>
        )}

        {isCorrect && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-blue-400 hover:bg-blue-500 border-b-4 border-blue-600 btn-press"
          >
            Next Word ➡️
          </button>
        )}
      </div>

      <div className="mt-8 text-gray-400 font-bold">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  );
};

export default PinyinPractice;