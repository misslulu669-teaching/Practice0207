import React, { useState, useEffect } from 'react';
import { SavedReport, Lesson, SubmissionRecord } from '../types';
import { getAllHomeworkReports, deleteReport, clearAllReports, importReportFromJSON } from '../services/reportService';
import { LESSONS } from '../constants';

interface Props {
  onBack: () => void;
}

interface SubmissionItemProps {
  sub: SubmissionRecord;
  lesson: Lesson;
}

// Helper component to render specific submission items
const SubmissionItem: React.FC<SubmissionItemProps> = ({ sub, lesson }) => {
  const vocab = lesson.vocabulary.find(v => v.id === sub.itemId);
  // Ensure we check if dialogues exist, though Lesson interface enforces it
  const dialogueItem = lesson.dialogues?.find(d => sub.itemId.startsWith(d.id));
  
  // 1. Pinyin Writing
  if (sub.type === 'writing') {
      // Use score to determine if it was correct on first try, or compare input
      const isCorrect = sub.score > 0;
      return (
          <div className={`bg-white border-l-4 ${isCorrect ? 'border-blue-400' : 'border-red-400'} p-4 rounded-r-xl shadow-sm mb-3`}>
              <div className="flex justify-between items-start">
                  <div>
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">✍️ Pinyin Spelling</span>
                      <div className="font-bold text-gray-700 text-lg mt-1">{vocab?.chinese} ({vocab?.english})</div>
                  </div>
                  <div className="text-2xl">{isCorrect ? '✅' : '❌'}</div>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                  <div>
                      <span className="text-gray-400 block">Student Wrote:</span>
                      <span className={`font-mono font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {typeof sub.input === 'string' ? sub.input : 'Media'}
                      </span>
                  </div>
                  {!isCorrect && (
                      <div>
                          <span className="text-gray-400 block">Correct Answer:</span>
                          <span className="font-mono font-bold text-gray-600 text-lg">{vocab?.pinyin}</span>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // 2. Speaking / Dialogue (Audio)
  if (sub.type === 'speaking' || sub.type === 'dialogue') {
      const audioUrl = sub.input instanceof Blob ? URL.createObjectURL(sub.input) : '';
      const title = sub.type === 'dialogue' || dialogueItem 
          ? '💬 Dialogue Roleplay' 
          : `🎤 Speaking: ${vocab?.chinese || 'Unknown'}`;

      return (
          <div className="bg-white border-l-4 border-green-400 p-4 rounded-r-xl shadow-sm mb-3">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider">{title}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Audio</span>
              </div>
              {vocab && <div className="text-gray-500 text-sm mb-2">Prompt: {vocab.pinyin}</div>}
              
              {audioUrl ? (
                  <audio controls src={audioUrl} className="w-full h-10" />
              ) : (
                  <div className="text-gray-400 text-xs italic">No audio content</div>
              )}
          </div>
      );
  }

  // 3. Quiz
  if (sub.type === 'quiz') {
      const isCorrect = sub.score > 0;
      return (
            <div className={`bg-white border-l-4 ${isCorrect ? 'border-purple-400' : 'border-red-400'} p-4 rounded-r-xl shadow-sm mb-3 flex justify-between items-center`}>
                <div>
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">🧩 Quiz Match</span>
                  {/* Using &rarr; entity for arrow */}
                  <div className="font-bold text-gray-700">{vocab?.chinese} &rarr; {vocab?.english}</div>
                </div>
                <div className="text-xl">{isCorrect ? '✅ Correct' : '❌ Wrong First Try'}</div>
            </div>
      );
  }

  return null;
};

const TeacherPortal: React.FC<Props> = ({ onBack }) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const data = await getAllHomeworkReports();
    setReports(data);
    setLoading(false);
  };

  // Fixed handleDelete with Optimistic UI Update
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    // Crucial: Stop propagation to prevent opening the report while deleting it
    e.stopPropagation();
    e.preventDefault();

    if (confirm("Delete this homework permanently?")) {
      // 1. Optimistic Update: Remove from UI immediately to feel responsive
      setReports(prev => prev.filter(r => r.id !== id));
      
      // 2. Clear selection if we just deleted the open report
      if (selectedReport?.id === id) {
          setSelectedReport(null);
      }

      // 3. Perform actual DB deletion in background
      try {
        await deleteReport(id);
      } catch (err) {
        console.error("Failed to delete from DB", err);
        // Optional: Revert UI if DB fails (rare), or just alert
        alert("Error deleting from database, please refresh.");
        loadReports();
      }
    }
  };

  // Fixed handleClearAll with Optimistic UI Update
  const handleClearAll = async () => {
      if (confirm("Delete ALL homework history? This cannot be undone.")) {
          // 1. Optimistic Update
          setReports([]);
          setSelectedReport(null);

          // 2. DB Operation
          try {
            await clearAllReports();
          } catch (err) {
              console.error("Failed to clear DB", err);
              loadReports();
          }
      }
  };

  // METHOD: Manual File Import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setIsProcessing(true);
      importReportFromJSON(file).then(success => {
          setIsProcessing(false);
          if (success) {
              alert("✅ File Imported Successfully!");
              loadReports();
          } else {
              alert("❌ Failed to import file. It might be corrupted.");
          }
          // Reset input to allow selecting same file again if needed
          e.target.value = '';
      });
  };

  // --- Render Detail View ---
  if (selectedReport) {
      const lesson = LESSONS.find(l => l.id === selectedReport.lessonId) || LESSONS[0];
      
      return (
          <div className="h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <button onClick={() => setSelectedReport(null)} className="text-2xl hover:scale-110 transition-transform">⬅️</button>
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedReport.studentName}'s Homework</h2>
                      <p className="text-gray-500 text-sm">{lesson.title} • {new Date(selectedReport.timestamp).toLocaleString()}</p>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                  <div className="flex gap-4 mb-6">
                      <div className="flex-1 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                          <div className="text-3xl font-bold text-yellow-600">{selectedReport.totalScore}</div>
                          <div className="text-xs text-yellow-800 uppercase font-bold">Total Score</div>
                      </div>
                      <div className="flex-1 bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
                          <div className="text-3xl font-bold text-blue-600">{selectedReport.submissionsCount}</div>
                          <div className="text-xs text-blue-800 uppercase font-bold">Items Completed</div>
                      </div>
                  </div>

                  <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Submission Details</h3>
                  
                  {selectedReport.submissions.map((sub, idx) => (
                      <SubmissionItem key={idx} sub={sub} lesson={lesson} />
                  ))}
              </div>
          </div>
      );
  }

  // --- Render List View ---
  return (
    <div className="w-full h-full flex flex-col">
       <div className="flex justify-between items-center mb-4 pb-4 border-b">
         <div>
            <h2 className="text-3xl font-bold text-gray-800">🍎 Teacher Portal</h2>
            <p className="text-xs text-gray-400 mt-1">Review student submissions</p>
         </div>
         <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-bold">Exit</button>
       </div>

       <div className="flex-1 flex flex-col">
           {/* IMPORT SECTION - SIMPLIFIED */}
           <div className="bg-white p-6 rounded-2xl border-2 border-green-100 shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    📥 Receive Homework
                </h3>
                
                {/* Method 2: File Upload (Only one now) */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 flex flex-col justify-between">
                    <div>
                            <label className="text-sm font-bold text-green-600 uppercase tracking-wide block mb-2">Import Homework File</label>
                            <p className="text-sm text-green-600 mb-4">Select the JSON file received via WeChat or Email.</p>
                    </div>
                    <div className="flex gap-2 items-center h-14">
                            <label className={`
                            flex-1 cursor-pointer bg-white border-2 border-dashed border-green-400 rounded-lg h-full flex items-center justify-center hover:bg-green-50 transition-colors
                            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                            `}>
                            <span className="text-green-700 font-bold text-lg">📂 Select Homework File</span>
                            <input 
                                type="file" 
                                accept=".json" 
                                onChange={handleFileImport} 
                                className="hidden" 
                                disabled={isProcessing}
                            />
                            </label>
                    </div>
                </div>
           </div>

           <div className="flex justify-between items-end mb-4">
               <h3 className="text-xl font-bold text-blue-800">Inbox ({reports.length})</h3>
               {reports.length > 0 && (
                   <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer">Clear All History</button>
               )}
           </div>

           <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {loading ? (
                   <div className="text-center py-10 text-gray-400">Loading records...</div>
               ) : reports.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
                       <span className="text-4xl mb-2">☁️</span>
                       <p className="text-gray-400 font-bold">No homework yet.</p>
                   </div>
               ) : (
                   reports.map((report) => {
                       const lesson = LESSONS.find(l => l.id === report.lessonId);
                       return (
                           <div 
                             key={report.id}
                             onClick={() => setSelectedReport(report)}
                             className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative"
                           >
                               <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-full bg-blue-100 text-2xl flex items-center justify-center">🧑‍🎓</div>
                                       <div>
                                           <div className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                                               {report.studentName}
                                           </div>
                                           <div className="text-sm text-gray-500">
                                               {lesson?.title || 'Unknown Lesson'}
                                           </div>
                                       </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                       <span className="font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-lg text-sm">
                                           {report.totalScore} pts
                                       </span>
                                       {/* TIMESTAMP UPDATED TO SHOW SECONDS */}
                                       <span className="text-xs text-gray-400 font-mono">
                                           {new Date(report.timestamp).toLocaleString()}
                                       </span>
                                   </div>
                               </div>
                               
                               {/* Updated Delete Button: Using absolute positioning for better hit target separation */}
                               <div className="mt-4 flex gap-2 justify-end">
                                    <button 
                                        className="text-xs font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors border border-red-200 z-10"
                                        onClick={(e) => handleDelete(e, report.id)}
                                    >
                                        Delete
                                    </button>
                               </div>
                           </div>
                       );
                   })
               )}
           </div>
       </div>
    </div>
  );
};

export default TeacherPortal;