import React, { useState } from 'react';
import { VocabularyItem, SubmissionRecord } from '../types';
import { SOUNDS } from '../constants';

interface Props {
  data: VocabularyItem[];
  onComplete: () => void;
  onRecord: (record: SubmissionRecord) => void;
}

const Quiz: React.FC<Props> = ({ data, onComplete, onRecord }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  // Track attempts
  const [attemptedItems, setAttemptedItems] = useState<Set<string>>(new Set());

  const currentItem = data[currentIndex];
  
  // Generate options logic (inline for simplicity in this component)
  const generateOptions = (target: VocabularyItem, all: VocabularyItem[]) => {
    const others = all.filter(i => i.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 2);
    return [target, ...others].sort(() => 0.5 - Math.random());
  };

  const [currentOptions, setCurrentOptions] = useState<VocabularyItem[]>(generateOptions(currentItem, data));

  const handleSelect = (selectedId: string) => {
    if (showResult === 'correct') return; // prevent clicking after success
    
    const isRight = selectedId === currentItem.id;

    // --- ONLY RECORD FIRST ATTEMPT ---
    if (!attemptedItems.has(currentItem.id)) {
        onRecord({
            type: 'quiz',
            itemId: currentItem.id,
            input: isRight ? 'Correct Match' : 'Incorrect Match', 
            score: isRight ? 1 : 0,
            feedback: isRight ? "Correct" : "Wrong"
        });
        setAttemptedItems(prev => new Set(prev).add(currentItem.id));
    }

    if (isRight) {
      new Audio(SOUNDS.CORRECT).play();
      setShowResult('correct');

      setTimeout(() => {
        if (currentIndex < data.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setCurrentOptions(generateOptions(data[nextIdx], data));
            setShowResult(null);
        } else {
            onComplete();
        }
      }, 1000);
    } else {
      new Audio(SOUNDS.WRONG).play();
      setShowResult('wrong');
    }
  };

  const handleSkip = () => {
    // Reset state for next item
    setShowResult(null);
    if (currentIndex < data.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setCurrentOptions(generateOptions(data[nextIdx], data));
    } else {
        onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">🧩 Match Meanings</h2>

      {/* Pinyin Cards Display */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {currentItem.pinyin.split(' ').map((syllable, idx) => (
            <div 
              key={`${currentItem.id}-${idx}`} 
              className="bg-white px-6 py-4 rounded-2xl shadow-md border-4 border-blue-100 transform -rotate-1 min-w-[100px] text-center"
            >
                <span className="text-5xl sm:text-6xl font-bold text-blue-600 font-sans tracking-wide">
                  {syllable}
                </span>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {currentOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`
              relative p-6 rounded-2xl border-b-4 font-bold text-2xl transition-all
              ${showResult === 'correct' && opt.id === currentItem.id 
                ? 'bg-green-100 border-green-500 text-green-800 scale-105' 
                : 'bg-white hover:bg-yellow-50 border-gray-200 text-gray-700 btn-press'}
              ${showResult === 'wrong' && opt.id !== currentItem.id ? 'opacity-50' : ''}
              ${showResult === 'wrong' && opt.id === currentItem.id ? 'ring-2 ring-green-400' : ''} 
            `}
          >
            {opt.english}
            
            {showResult === 'correct' && opt.id === currentItem.id && (
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl">✅</span>
            )}
          </button>
        ))}
      </div>

       {showResult === 'wrong' && (
          <div className="mt-6 text-red-500 font-bold text-xl animate-bounce">Try again!</div>
       )}

        <div className="mt-8">
            <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 font-bold py-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors"
            >
                Skip ⏩
            </button>
        </div>
        <div className="mt-2 text-gray-300 font-bold text-sm">
            {currentIndex + 1} / {data.length}
        </div>
    </div>
  );
};

export default Quiz;