import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VocabularyItem, SubmissionRecord } from '../types';
import AudioPlayer from './AudioPlayer';
import { speakText } from '../services/geminiService';
import { SOUNDS, PLACEHOLDER_IMAGES } from '../constants';

import { pinyin } from 'pinyin-pro';

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
  'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'], // Handle v as ü
};

// Helper to get base char (e.g., 'á' -> 'a')
const getBaseChar = (char: string): string => {
  for (const [base, variants] of Object.entries(TONE_MAP)) {
    if (variants.includes(char)) return base;
  }
  return char;
};

// Helper to get tone index from a char (0-4)
const getToneIndexFromChar = (char: string): number => {
  for (const variants of Object.values(TONE_MAP)) {
    const idx = variants.indexOf(char);
    if (idx !== -1) return idx;
  }
  return 4; // Default to neutral if not found (or it's a consonant)
};

// Helper to get tone index from a syllable string
const getSyllableToneIndex = (syllable: string): number => {
  for (const char of syllable) {
    const idx = getToneIndexFromChar(char);
    if (idx !== 4) return idx; // Return first found tone
  }
  return 4; // Neutral if no tone marks found
};

// Helper to strip tones from a string
const stripTones = (str: string | undefined): string => {
  if (!str) return '';
  return str.split('').map(getBaseChar).join('');
};

// Helper to apply tone to a base syllable
const applyTone = (base: string, toneIdx: number): string => {
  if (toneIdx === 4 || toneIdx === null) return base; // Neutral tone or no tone selected

  // Rules provided by user:
  // 1. 有a不放过 (If 'a' exists, tone on 'a')
  // 2. 无a找o e (If no 'a', look for 'o' or 'e')
  // 3. iu, ui并排标在后 (If 'iu' or 'ui', tone on the second vowel)
  // 4. i上标调点去掉 (Handled by Unicode chars)
  // 5. j, q, x + ü (Tone on u/ü)

  let charToToneIndex = -1;
  let charToTone = '';

  // Rule 1: 'a'
  if (base.includes('a')) {
      charToToneIndex = base.indexOf('a');
      charToTone = 'a';
  }
  // Rule 2: 'o'
  else if (base.includes('o')) {
      charToToneIndex = base.indexOf('o');
      charToTone = 'o';
  }
  // Rule 3: 'e'
  else if (base.includes('e')) {
      charToToneIndex = base.indexOf('e');
      charToTone = 'e';
  }
  // Rule 3 (continued) & 4: iu, ui, or other vowels (i, u, ü)
  else {
      // Check for iu or ui specifically
      if (base.includes('iu')) {
          charToToneIndex = base.indexOf('u', base.indexOf('iu'));
          charToTone = 'u';
      } else if (base.includes('ui')) {
          charToToneIndex = base.indexOf('i', base.indexOf('ui'));
          charToTone = 'i';
      } else {
          // Fallback: find the last vowel (i, u, ü, v)
          const vowels = ['i', 'u', 'ü', 'v'];
          for (let i = base.length - 1; i >= 0; i--) {
              if (vowels.includes(base[i])) {
                  charToToneIndex = i;
                  charToTone = base[i];
                  break;
              }
          }
      }
  }

  if (charToToneIndex !== -1) {
      // Map v to ü for tone lookup
      const lookupChar = charToTone === 'v' ? 'ü' : charToTone;
      const tonedChar = TONE_MAP[lookupChar]?.[toneIdx] || charToTone;
      return base.substring(0, charToToneIndex) + tonedChar + base.substring(charToToneIndex + 1);
  }

  return base;
};

type Phase = 'INPUT' | 'ERROR_SHOWCASE';

const PinyinPractice: React.FC<Props> = ({ data, onComplete, onRecord }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Word State
  const [userSyllables, setUserSyllables] = useState<string[]>([]); // Stores user's constructed syllables
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  
  // Current Syllable Input State
  const [currentInput, setCurrentInput] = useState<string>(""); 
  const [selectedTone, setSelectedTone] = useState<number | null>(null);

  const [phase, setPhase] = useState<Phase>('INPUT');
  const [penaltyTime, setPenaltyTime] = useState(0); 
  const [attemptedItems, setAttemptedItems] = useState<Set<string>>(new Set());
  
  // Attempt Tracking
  const [attemptCount, setAttemptCount] = useState(0);
  const [firstAttempt, setFirstAttempt] = useState<string | null>(null);

  const currentItem = data[currentIndex];

  // Generate authoritative pinyin using pinyin-pro
  const targetPinyin = useMemo(() => {
      if (!currentItem) return '';
      // Use pinyin-pro to generate standard pinyin
      // toneType: 'symbol' gives us tone marks (ā)
      // type: 'string' gives us a space-separated string
      // v: true ensures ü is handled correctly if needed
      return pinyin(currentItem.chinese, { toneType: 'symbol', type: 'string', v: true });
  }, [currentItem]);

  const targetSyllables = useMemo(() => {
      if (!targetPinyin) return [];
      return targetPinyin.split(' ');
  }, [targetPinyin]);

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

  // Reset state when word changes
  useEffect(() => {
    setUserSyllables([]);
    setCurrentInput("");
    setSelectedTone(null);
    setCurrentSyllableIndex(0);
    setPhase('INPUT');
    setPenaltyTime(0);
    setAttemptCount(0);
    setFirstAttempt(null);
  }, [currentIndex]);

  // Generate a pool of letters based on the target word + some distractors
  const letterPool = useMemo(() => {
    if (!currentItem) return [];
    const targetChars = currentItem.pinyin.replace(/\s/g, '').split('').map(getBaseChar);
    const uniqueChars = Array.from(new Set(targetChars));
    
    const commonDistractors = ['a', 'o', 'e', 'i', 'u', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x'];
    while (uniqueChars.length < 12) {
        const randomChar = commonDistractors[Math.floor(Math.random() * commonDistractors.length)];
        if (!uniqueChars.includes(randomChar)) {
            uniqueChars.push(randomChar);
        }
    }
    return uniqueChars.sort(() => 0.5 - Math.random());
  }, [currentItem]);


  // --- HANDLERS ---

  const handleAddLetter = (char: string) => {
    if (phase !== 'INPUT' || penaltyTime > 0) return;
    setCurrentInput(prev => prev + char);
  };

  const handleBackspace = () => {
    if (phase !== 'INPUT' || penaltyTime > 0) return;
    
    if (currentInput.length > 0) {
        setCurrentInput(prev => prev.slice(0, -1));
    } else if (currentSyllableIndex > 0) {
        // Go back to previous syllable
        const prevIndex = currentSyllableIndex - 1;
        const prevSyllable = userSyllables[prevIndex];
        
        // Decompose previous syllable to restore state
        const toneIdx = getSyllableToneIndex(prevSyllable);
        const base = stripTones(prevSyllable);
        
        setCurrentSyllableIndex(prevIndex);
        setCurrentInput(base);
        setSelectedTone(toneIdx);
        
        // Remove from completed list
        setUserSyllables(prev => prev.slice(0, -1));
    }
  };

  const handleToneSelect = (toneIdx: number) => {
      if (phase !== 'INPUT' || penaltyTime > 0) return;
      if (currentInput.length === 0) return; // Prevent tone selection without letters

      // 1. Construct current syllable
      const constructedSyllable = applyTone(currentInput, toneIdx);
      
      // 2. Add to userSyllables
      const newUserSyllables = [...userSyllables];
      newUserSyllables[currentSyllableIndex] = constructedSyllable;
      setUserSyllables(newUserSyllables);

      // 3. Auto-Advance
      setCurrentSyllableIndex(prev => prev + 1);
      setCurrentInput("");
      setSelectedTone(null);
  };

  const handleCheckWord = () => {
      if (phase !== 'INPUT' || penaltyTime > 0) return;

      const userWord = userSyllables.join(' ');
      
      // Calculate attempts and first attempt for this check
      const currentAttemptCount = attemptCount + 1;
      const currentFirstAttempt = firstAttempt === null ? userWord : firstAttempt;
      
      // Compare against the authoritative pinyin
      if (userWord === targetPinyin) {
          // Correct!
          new Audio(SOUNDS.CORRECT).play();
          handleItemComplete(true, currentAttemptCount, currentFirstAttempt);
      } else {
          // Incorrect!
          new Audio(SOUNDS.WRONG).play();
          setPhase('ERROR_SHOWCASE');
          setPenaltyTime(8);
          
          // Update state for next attempt
          setAttemptCount(currentAttemptCount);
          if (firstAttempt === null) {
              setFirstAttempt(userWord);
          }

          setTimeout(() => {
              // Reset for retry
              setPhase('INPUT');
              setUserSyllables([]);
              setCurrentSyllableIndex(0);
              setCurrentInput("");
              setSelectedTone(null);
              setPenaltyTime(0);
          }, 8000);
      }
  };

  const handleItemComplete = (success: boolean, finalAttempts: number, finalFirstAttempt: string) => {
      if (success && currentItem) {
        speakText("Excellent!", "en-US");
        
        if (!attemptedItems.has(currentItem.id)) {
            onRecord({
                type: 'writing',
                itemId: currentItem.id,
                input: targetPinyin, // Record the correct pinyin as the final success input
                score: 1,
                feedback: "Correct",
                attempts: finalAttempts,
                firstAttemptInput: finalFirstAttempt
            });
            setAttemptedItems(prev => new Set(prev).add(currentItem.id));
        }

        setTimeout(() => {
            if (currentIndex < data.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }, 1500);
      }
  };

  const handleSkip = () => {
      setPenaltyTime(0);
      if (currentIndex < data.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          onComplete();
      }
  };

  if (!currentItem) return null;

  // Render the current input with the selected tone applied
  const previewSyllable = applyTone(currentInput, selectedTone === null ? 4 : selectedTone);
  const isWordComplete = currentSyllableIndex === targetSyllables.length;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <button
          onClick={handleSkip}
          className="absolute top-0 left-0 text-gray-400 hover:text-gray-600 font-bold py-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors"
      >
          Skip ⏩
      </button>

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
      <div className="bg-white border-4 border-blue-200 rounded-2xl w-full max-w-md h-28 mb-6 flex items-center justify-center gap-4 shadow-inner overflow-hidden relative px-4">
         
         {/* 1. Completed Syllables (User Input) */}
         {userSyllables.map((s, idx) => (
             <span key={`user-syll-${idx}`} className="text-4xl font-bold text-gray-800 font-sans mx-1">
                 {s}
             </span>
         ))}

         {/* 2. Current Syllable Input (Only if not done) */}
         {phase !== 'ERROR_SHOWCASE' && !isWordComplete && (
             <div className="flex flex-col items-center animate-pulse-slow mx-1">
                 <span className="text-4xl font-bold text-blue-600 border-b-4 border-blue-300 min-w-[60px] text-center px-2 font-sans">
                     {previewSyllable || "_"}
                 </span>
             </div>
         )}
         
         {/* 3. Future Syllables (Placeholders) */}
         {targetSyllables.slice(currentSyllableIndex + 1).map((s, idx) => (
             <div key={`future-${idx}`} className="flex gap-1 opacity-30 mx-1">
                 <span className="text-4xl font-bold text-gray-300 border-b-4 border-gray-200 min-w-[40px] text-center font-sans">
                     ...
                 </span>
             </div>
         ))}

         {/* ERROR OVERLAY */}
         {phase === 'ERROR_SHOWCASE' && (
             <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center animate-in fade-in z-10">
                 <span className="text-red-500 font-bold text-lg mb-1">Correct Answer:</span>
                 {/* Use targetPinyin generated by pinyin-pro for guaranteed correctness */}
                 <span className="text-4xl font-bold text-red-600 font-sans">{targetPinyin}</span>
                 <div className="w-full max-w-[200px] bg-red-200 h-1 mt-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(penaltyTime / 8) * 100}%` }}
                      ></div>
                 </div>
             </div>
         )}

      </div>

      {/* Controls Container */}
      <div className={`transition-opacity duration-300 w-full flex flex-col items-center ${phase === 'ERROR_SHOWCASE' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {!isWordComplete ? (
              <>
                {/* Tone Bar */}
                <div className="flex gap-2 mb-4 justify-center">
                    {['¯', '´', 'ˇ', '`'].map((symbol, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleToneSelect(idx)}
                            className={`w-12 h-12 rounded-xl border-b-4 text-2xl font-bold btn-press transition-colors
                                ${selectedTone === idx 
                                    ? 'bg-orange-500 border-orange-700 text-white' 
                                    : 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800'}
                            `}
                        >
                            {symbol}
                        </button>
                    ))}
                    <button
                        onClick={() => handleToneSelect(4)} // Neutral tone
                        className={`w-12 h-12 rounded-xl border-b-4 text-sm font-bold btn-press flex items-center justify-center transition-colors
                            ${selectedTone === 4 
                                ? 'bg-orange-500 border-orange-700 text-white' 
                                : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-600'}
                        `}
                    >
                        None
                    </button>
                </div>

                {/* Letter Keyboard */}
                <div className="grid grid-cols-6 gap-2 mb-4 max-w-md animate-in fade-in">
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
              </>
          ) : (
              /* Check Button - Only appears when word is complete */
              <button
                  onClick={handleCheckWord}
                  className="w-full max-w-md py-4 rounded-2xl font-bold text-2xl text-white bg-green-500 hover:bg-green-600 border-b-4 border-green-700 btn-press animate-in zoom-in mb-4"
              >
                  Check Answer ✅
              </button>
          )}
          
          <div className="flex justify-center w-full">
            {/* Skip button moved to top-left */}
          </div>
      </div>

      <div className="mt-6 text-gray-400 font-bold">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  );
};

export default PinyinPractice;