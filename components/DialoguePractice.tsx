import React, { useState, useRef, useEffect } from 'react';
import { DialogueGroup, SubmissionRecord } from '../types';
import AudioPlayer from './AudioPlayer';
import { SOUNDS } from '../constants';

interface Props {
  data: DialogueGroup[];
  onComplete: (records: SubmissionRecord[]) => void;
}

const DialoguePractice: React.FC<Props> = ({ data, onComplete }) => {
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [records, setRecords] = useState<SubmissionRecord[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentDialogue = data[currentGroupIdx];

  // Cleanup audio url
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Recording Logic
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
    if (audioUrl) new Audio(audioUrl).play();
  };

  const handleNext = () => {
    // Save record if available
    let updatedRecords = records;
    if (recordedBlob) {
        // Find the B line to associate ID (using dialogue ID + index as mock ID)
        const studentLineIdx = currentDialogue.lines.findIndex(l => l.speaker === 'B');
        const itemId = `${currentDialogue.id}_line${studentLineIdx}`;
        
        updatedRecords = [...records, {
            type: 'speaking',
            itemId: itemId,
            input: recordedBlob,
            score: 1,
            feedback: 'Dialogue Response'
        }];
        setRecords(updatedRecords);
    }

    // Reset local state
    setRecordedBlob(null);
    setAudioUrl(null);
    setIsRecording(false);

    if (currentGroupIdx < data.length - 1) {
      setCurrentGroupIdx(prev => prev + 1);
    } else {
      onComplete(updatedRecords);
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">💬 Role Play</h2>
      <p className="text-gray-500 mb-6">Teacher reads A. You read & record B.</p>

      <div className="flex flex-col gap-6 w-full max-w-lg mb-8 overflow-y-auto pr-2">
        {currentDialogue.lines.map((line, idx) => (
          <div key={idx} className={`flex gap-4 ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0
              ${line.speaker === 'A' ? 'bg-blue-400' : 'bg-pink-400'}
            `}>
              {line.speaker === 'A' ? '👨‍🏫' : '🧑‍🎓'}
            </div>
            
            {/* Bubble */}
            <div className={`
              flex-1 p-5 rounded-3xl border-2 relative
              ${line.speaker === 'A' ? 'bg-blue-50 border-blue-100 rounded-tl-none' : 'bg-pink-50 border-pink-100 rounded-tr-none'}
            `}>
              <p className="text-2xl font-bold text-gray-800 mb-1">{line.chinese}</p>
              <p className="text-gray-600 mb-2 font-medium">{line.pinyin}</p>
              <p className="text-sm text-gray-400 italic mb-3">{line.english}</p>
              
              {line.speaker === 'A' && (
                 <div className="flex justify-start">
                    <AudioPlayer text={line.chinese} label="Listen" />
                 </div>
              )}

              {line.speaker === 'B' && (
                <div className="flex flex-col gap-2 mt-2 bg-white/50 p-2 rounded-xl">
                   <div className="flex gap-2">
                      <button
                        onClick={toggleRecording}
                        className={`
                            flex-1 py-2 rounded-xl font-bold text-sm text-white transition-all
                            ${isRecording 
                                ? 'bg-red-500 animate-pulse' 
                                : 'bg-pink-500 hover:bg-pink-600 btn-press'}
                        `}
                      >
                        {isRecording ? 'Stop' : '🎙️ Record'}
                      </button>
                      {audioUrl && !isRecording && (
                        <button
                            onClick={playRecording}
                            className="px-4 py-2 rounded-xl font-bold text-sm text-white bg-yellow-400 hover:bg-yellow-500 btn-press"
                        >
                            ▶️
                        </button>
                      )}
                   </div>
                   {recordedBlob && !isRecording && (
                       <div className="text-xs text-center text-green-600 font-bold">Recorded!</div>
                   )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto w-full max-w-md">
         {/* Only enable Next if user has recorded something (if there is a B line) or just always allow for flexibility */}
         <button
            onClick={() => {
                new Audio(SOUNDS.SUCCESS).play();
                handleNext();
            }}
            disabled={currentDialogue.lines.some(l => l.speaker === 'B') && !recordedBlob}
            className={`
                w-full py-4 rounded-2xl font-bold text-xl text-white border-b-4 btn-press transition-all
                ${(currentDialogue.lines.some(l => l.speaker === 'B') && !recordedBlob)
                    ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
                    : 'bg-orange-400 hover:bg-orange-500 border-orange-600'}
            `}
          >
            {currentGroupIdx < data.length - 1 ? "Next Dialogue ➡️" : "Finish! 🎉"}
          </button>
      </div>
    </div>
  );
};

export default DialoguePractice;