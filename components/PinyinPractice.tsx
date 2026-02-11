import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyItem, SubmissionRecord } from '../types';
import AudioPlayer from './AudioPlayer';
import { speakText } from '../services/geminiService';
import { SOUNDS, PLACEHOLDER_IMAGES } from '../constants';

interface Props {
  data: VocabularyItem[];
  onComplete: () => void;
  onRecord: (record: SubmissionRecord) => void;
}

// Map base vowels to their toned versions [flat, rising, dipping, falling, neutral]
const TONE_MAP: Record<string, string[]> = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
};

// Helper to get base char (e.g., 'á' -> 'a')
const getBaseChar = (char: string): string => {
  for (const [base, variants] of Object.entries(TONE_MAP)) {
    if (variants.includes(char)) return base;
  }
  return char;
};

const PinyinPractice: React.FC<Props> = ({ data, onComplete, onRecord }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]); // Array of chars for easier manipulation
  const [penaltyTime, setPenaltyTime] = useState(0); 
  // Track which items have been attempted to ensure we only record the FIRST try
  const [attemptedItems, setAttemptedItems] = useState<Set<string>>(new Set());
  
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

  // Generate a pool of letters based on the target word + some distractors
  const letterPool = useMemo(() => {
    // Get unique base chars from the pinyin, ignoring spaces
    const targetChars = currentItem.pinyin.replace(/\s/g, '').split('').map(getBaseChar);
    const uniqueChars = Array.from(new Set(targetChars));
    
    // Add some common pinyin letters as distractors
    const commonDistractors = ['a', 'o', 'e', 'i', 'u', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x'];
    
    // Fill up to 12 letters if needed
    while (uniqueChars.length < 12) {
        const randomChar = commonDistractors[Math.floor(Math.random() * commonDistractors.length)];
        if (!uniqueChars.includes(randomChar)) {
            uniqueChars.push(randomChar);
        }
    }
    
    // Shuffle
    return uniqueChars.sort(() => 0.5 - Math.random());
  }, [currentItem]);

  // Reset input when word changes
  useEffect(() => {
    setUserInput([]);
    setPenaltyTime(0);
  }, [currentIndex]);

  const handleAddLetter = (char: string) => {
    if (penaltyTime > 0) return;
    setUserInput(prev => [...prev, char]);
  };

  const handleBackspace = () => {
    if (penaltyTime > 0) return;
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleToneChange = (toneIndex: number) => {
    if (penaltyTime > 0 || userInput.length === 0) return;

    // Modify the LAST character if it's a vowel
    const lastChar = userInput[userInput.length - 1];
    const base = getBaseChar(lastChar);

    if (TONE_MAP[base]) {
        const newChar = TONE_MAP[base][toneIndex];
        const newInput = [...userInput];
        newInput[newInput.length - 1] = newChar;
        setUserInput(newInput);
    }
  };

  const checkAnswer = () => {
    const inputString = userInput.join('');
    // Remove spaces from target since we track input without spaces
    const targetString = currentItem.pinyin.replace(/\s/g, '');
    const isRight = inputString === targetString;

    // --- ONLY RECORD THE FIRST ATTEMPT ---
    if (!attemptedItems.has(currentItem.id)) {
        onRecord({
            type: 'writing',
            itemId: currentItem.id,
            input: inputString,
            score: isRight ? 1 : 0,
            feedback: isRight ? "Correct First Try" : "Incorrect First Try"
        });
        setAttemptedItems(prev => new Set(prev).add(currentItem.id));
    }

    if (isRight) {
      // Correct!
      new Audio(SOUNDS.CORRECT).play();
      speakText("Excellent!", "en-US");
      
      // Delay slightly before next
      setTimeout(() => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
      }, 1500);

    } else {
      // Wrong!
      new Audio(SOUNDS.WRONG).play();
      speakText("Not quite. Look at the correct answer!", "en-US");
      setPenaltyTime(10); // Start 10s penalty
    }
  };

  const handleSkip = () => {
      // Reset penalty if active
      setPenaltyTime(0);
      setUserInput([]);
      
      if (currentIndex < data.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          onComplete();
      }
  };

  const isPenaltyActive = penaltyTime > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h2 className="text-3xl font-bold text-gray-700 mb-2">🎹 Build the Pinyin</h2>
      
      {/* Visual Cue */}
      <div className="flex items-center gap-4 mb-4">
         <img 
            src={PLACEHOLDER_IMAGES[currentItem.imageKeyword]} 
            alt={currentItem.english}
            className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-sm"
         />
         <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{currentItem.chinese}</span>
            <AudioPlayer text={currentItem.chinese} autoPlay label="Listen" />
         </div>
      </div>

      {/* Input Display Area */}
      <div className="bg-white border-4 border-blue-200 rounded-2xl w-full max-w-md h-20 mb-6 flex items-center justify-center gap-1 shadow-inner overflow-hidden relative">
         {userInput.map((char, idx) => (
             <span key={idx} className="text-4xl font-bold text-blue-600 animate-in fade-in slide-in-from-bottom-2">
                 {char}
             </span>
         ))}
         {userInput.length === 0 && !isPenaltyActive && (
             <span className="text-gray-300 text-lg">Type letters below...</span>
         )}
         <span className="w-1 h-8 bg-blue-400 animate-pulse ml-1"></span>
      </div>

      {/* Controls Container */}
      <div className={`transition-opacity duration-300 ${isPenaltyActive ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Tone Bar */}
          <div className="flex gap-2 mb-4 justify-center">
             {['¯', '´', 'ˇ', '`'].map((symbol, idx) => (
                 <button
                    key={idx}
                    onClick={() => handleToneChange(idx)}
                    className="w-12 h-12 rounded-xl bg-orange-100 hover:bg-orange-200 border-b-4 border-orange-300 text-2xl font-bold text-orange-800 btn-press"
                 >
                    {symbol}
                 </button>
             ))}
             <button
                onClick={() => handleToneChange(4)} // Neutral tone
                className="w-12 h-12 rounded-xl bg-orange-50 hover:bg-orange-100 border-b-4 border-orange-200 text-sm font-bold text-orange-600 btn-press flex items-center justify-center"
             >
                None
             </button>
          </div>

          {/* Letter Keyboard */}
          <div className="grid grid-cols-6 gap-2 mb-6 max-w-md">
             {letterPool.map((char, idx) => (
                 <button
                    key={`${char}-${idx}`}
                    onClick={() => handleAddLetter(char)}
                    className="w-12 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 border-b-4 border-blue-200 text-xl font-bold text-blue-700 btn-press"
                 >
                    {char}
                 </button>
             ))}
             <button
                onClick={handleBackspace}
                className="col-span-2 bg-red-100 hover:bg-red-200 border-b-4 border-red-300 rounded-xl font-bold text-red-600 btn-press flex items-center justify-center gap-1"
             >
                ⌫ Del
             </button>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 items-center w-full max-w-md">
            <button
                onClick={checkAnswer}
                disabled={userInput.length === 0}
                className={`
                    w-full py-4 rounded-2xl font-bold text-xl text-white transition-all
                    ${userInput.length === 0 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 border-b-4 border-green-700 btn-press'}
                `}
            >
                Check Answer ✅
            </button>
            
            <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 font-bold py-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors"
            >
                Skip ⏩
            </button>
          </div>
      </div>

      {/* Penalty Overlay */}
      {isPenaltyActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[2rem] p-8 border-8 border-yellow-400 shadow-2xl flex flex-col items-center w-full max-w-sm animate-bounce-small">
              <div className="text-6xl mb-2">🙈</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Oops! Correct answer:</h3>
              
              <div className="text-6xl font-bold text-blue-600 mb-6 tracking-wider">
                  {currentItem.pinyin}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(penaltyTime / 10) * 100}%` }}
                  ></div>
              </div>
              
              <p className="text-lg font-bold text-gray-500">
                  Try again in <span className="text-red-500 text-2xl">{penaltyTime}</span> seconds
              </p>

              {penaltyTime === 0 && (
                  <button 
                    onClick={() => {
                        setPenaltyTime(0);
                        setUserInput([]); // Clear input to restart
                    }}
                    className="mt-4 px-8 py-3 bg-blue-500 text-white font-bold rounded-xl border-b-4 border-blue-700 btn-press"
                  >
                      Try Again 🔄
                  </button>
              )}
           </div>
        </div>
      )}

      <div className="mt-6 text-gray-400 font-bold">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  );
};

export default PinyinPractice;