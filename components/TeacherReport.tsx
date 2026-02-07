import React, { useMemo } from 'react';
import { SavedReport, Lesson } from '../types';
import { LESSONS, PLACEHOLDER_IMAGES } from '../constants';

interface Props {
  report: SavedReport;
  onBack: () => void;
}

const TeacherReport: React.FC<Props> = ({ report, onBack }) => {
  const lesson: Lesson = LESSONS.find(l => l.id === report.lessonId) || LESSONS[0];

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString();
  };

  // Helper to play audio
  const PlayButton = ({ input }: { input: string | Blob }) => {
    const handlePlay = () => {
      if (input instanceof Blob) {
        const url = URL.createObjectURL(input);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
      } else {
        console.warn("Audio input is not a Blob");
      }
    };

    return (
      <button 
        onClick={handlePlay}
        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full font-bold transition-colors"
      >
        <span>▶️</span> Play Audio
      </button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">📋 Teacher Dashboard</h2>
           <p className="text-gray-500">Reviewing homework for: <span className="font-bold text-blue-600">{report.studentName || 'Student'}</span></p>
           <p className="text-xs text-gray-400">{formatDate(report.timestamp)}</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-bold"
        >
          Exit Review
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        
        {/* Header Card */}
        <div className="bg-yellow-50 p-6 rounded-2xl border-l-8 border-yellow-400">
           <h3 className="text-xl font-bold text-gray-700">{lesson.title}</h3>
           <p className="text-gray-600">{lesson.description}</p>
           <div className="mt-2 font-bold text-yellow-700 text-lg">
             Score: {report.submissions.reduce((acc, curr) => acc + (curr.score * 10), 0)} pts
           </div>
        </div>

        {/* Breakdown by Type */}
        {report.submissions.length === 0 && (
             <div className="text-center py-10 text-gray-400 italic">
                 No activities completed yet.
             </div>
        )}
        
        {/* 1. Writing Section */}
        {report.submissions.some(s => s.type === 'writing') && (
           <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-600 border-b pb-1">✍️ Pinyin Spelling</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.submissions.filter(s => s.type === 'writing').map((sub, idx) => {
                    const vocab = lesson.vocabulary.find(v => v.id === sub.itemId);
                    if (!vocab) return null;
                    const isCorrect = typeof sub.input === 'string' && sub.input.replace(/\s/g, '') === vocab.pinyin.replace(/\s/g, '');

                    return (
                        <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="font-bold text-gray-500 text-sm">{vocab.chinese} ({vocab.english})</div>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                        {typeof sub.input === 'string' ? sub.input : 'Image/Audio'}
                                    </span>
                                    {!isCorrect && <span className="text-gray-400 line-through text-sm">{vocab.pinyin}</span>}
                                </div>
                            </div>
                            <div className="text-3xl">{isCorrect ? '✅' : '❌'}</div>
                        </div>
                    );
                })}
              </div>
           </div>
        )}

        {/* 2. Speaking Section */}
        {report.submissions.some(s => s.type === 'speaking') && (
           <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-600 border-b pb-1">🎤 Speaking Recordings</h3>
              <div className="grid grid-cols-1 gap-4">
                {report.submissions.filter(s => s.type === 'speaking').map((sub, idx) => {
                    // Check if it's a vocab item or a dialogue line
                    const vocab = lesson.vocabulary.find(v => v.id === sub.itemId);
                    // For dialogue, itemId is complex, simplifiction for display:
                    const isDialogue = !vocab;
                    
                    return (
                        <div key={idx} className="bg-white border-l-4 border-green-400 rounded-xl p-4 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="font-bold text-gray-700">
                                    {isDialogue ? 'Dialogue Practice' : `Vocabulary: ${vocab?.chinese}`}
                                </div>
                                <div className="text-sm text-gray-500 italic">
                                    {isDialogue ? 'Roleplay response' : vocab?.pinyin}
                                </div>
                            </div>
                            <PlayButton input={sub.input} />
                        </div>
                    );
                })}
              </div>
           </div>
        )}

        {/* 3. Quiz Results */}
        {report.submissions.some(s => s.type === 'quiz') && (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-600 border-b pb-1">🧩 Quiz Performance</h3>
                <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="font-bold text-purple-800">
                        Completed {report.submissions.filter(s => s.type === 'quiz').length} items correctly.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TeacherReport;