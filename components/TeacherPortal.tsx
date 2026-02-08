import React, { useState, useEffect, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const data = await getAllHomeworkReports();
    setReports(data);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this homework?")) {
      await deleteReport(id);
      loadReports();
      if (selectedReport?.id === id) setSelectedReport(null);
    }
  };

  const handleClearAll = async () => {
      if (confirm("Delete ALL homework history? This cannot be undone.")) {
          await clearAllReports();
          loadReports();
          setSelectedReport(null);
      }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const success = await importReportFromJSON(file);
      if (success) {
        alert("Homework imported successfully!");
        await loadReports();
      } else {
        alert("Failed to import file. Make sure it's a valid Panda Homework JSON.");
      }
      setLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
       <div className="flex justify-between items-center mb-6 pb-4 border-b">
         <div>
            <h2 className="text-3xl font-bold text-gray-800">🍎 Teacher Portal</h2>
            <p className="text-xs text-gray-400 mt-1">View local & imported homework</p>
         </div>
         <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-bold">Exit</button>
       </div>

       <div className="flex-1 flex flex-col">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
               <div className="flex items-center gap-2">
                   <h3 className="text-xl font-bold text-blue-800">Inbox ({reports.length})</h3>
                   <input 
                      type="file" 
                      accept=".json" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                   />
                   <button 
                      onClick={handleImportClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold btn-press flex items-center gap-1"
                   >
                      📥 Import File
                   </button>
               </div>
               
               {reports.length > 0 && (
                   <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-600 underline">Clear All History</button>
               )}
           </div>

           <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {loading ? (
                   <div className="text-center py-10 text-gray-400">Loading records...</div>
               ) : reports.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
                       <span className="text-5xl mb-4">📭</span>
                       <p className="text-gray-400 font-bold">No homework submitted yet.</p>
                       <p className="text-xs text-gray-400 mt-2">Click "Import File" to load student work.</p>
                   </div>
               ) : (
                   reports.map((report) => {
                       const lesson = LESSONS.find(l => l.id === report.lessonId);
                       return (
                           <div 
                             key={report.id}
                             onClick={() => setSelectedReport(report)}
                             className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
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
                                       <span className="text-xs text-gray-400">
                                           {new Date(report.timestamp).toLocaleDateString()}
                                       </span>
                                   </div>
                               </div>
                               <div className="mt-3 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
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