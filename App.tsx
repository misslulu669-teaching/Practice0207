import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PinyinPractice from './components/PinyinPractice';
import SpeakingPractice from './components/SpeakingPractice';
import Quiz from './components/Quiz';
import DialoguePractice from './components/DialoguePractice';
import TeacherPortal from './components/TeacherPortal';
import { ActivityType, SubmissionRecord, Lesson } from './types';
import { LESSONS, SOUNDS } from './constants';
import { saveHomeworkReport, exportReportToJSON, exportReportToHTML, getReportFile } from './services/reportService';

interface AIStudioWindow {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

// --- REDESIGNED SUBMIT BAR (WeChat Style) ---
const PartialSubmitBar: React.FC<{
  studentName: string;
  setStudentName: (s: string) => void;
  submissionsCount: number;
  onWeChatShare: () => void;
  onDownloadJSON: () => void;
  onDownloadHTML: () => void;
}> = ({ studentName, setStudentName, submissionsCount, onWeChatShare, onDownloadJSON, onDownloadHTML }) => (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 w-full flex flex-col items-center gap-4">
            <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                Save your progress ({submissionsCount} items)
            </h4>
            
            <input 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Your Name"
                className="w-full max-w-md bg-gray-50 border-2 border-gray-300 rounded-xl px-4 font-bold text-gray-700 h-12 text-center focus:border-blue-400 outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                {/* Option 1: WeChat Share */}
                <button 
                    onClick={onWeChatShare}
                    disabled={submissionsCount === 0 || !studentName.trim()}
                    className={`
                        flex-1 px-4 py-3 rounded-xl font-bold text-white whitespace-nowrap flex items-center justify-center gap-2
                        ${submissionsCount > 0 && studentName.trim()
                            ? 'bg-green-500 hover:bg-green-600 border-b-4 border-green-700 btn-press' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    <span className="text-xl">💬</span> To WeChat
                </button>
            </div>
            
            {/* Secondary Options */}
            <div className="flex gap-2 w-full max-w-md">
                 <button 
                    onClick={onDownloadHTML}
                    disabled={submissionsCount === 0 || !studentName.trim()}
                    className={`
                        flex-1 px-3 py-2 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-1
                        ${submissionsCount > 0 && studentName.trim()
                            ? 'bg-blue-400 hover:bg-blue-500 border-b-4 border-blue-600 btn-press' 
                            : 'bg-gray-300 cursor-not-allowed'}
                    `}
                >
                    📄 Report Card (HTML)
                </button>
                <button 
                    onClick={onDownloadJSON}
                    disabled={submissionsCount === 0 || !studentName.trim()}
                    className={`
                        flex-1 px-3 py-2 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-1
                        ${submissionsCount > 0 && studentName.trim()
                            ? 'bg-yellow-400 hover:bg-yellow-500 border-b-4 border-yellow-600 text-yellow-900 btn-press' 
                            : 'bg-gray-300 cursor-not-allowed'}
                    `}
                >
                    📥 Backup (JSON)
                </button>
            </div>
            
            {!studentName.trim() && (
                <p className="text-xs text-red-400">Please enter your name to save.</p>
            )}
    </div>
);

const App: React.FC = () => {
  // Main State
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [activity, setActivity] = useState<ActivityType>(ActivityType.LESSON_SELECT);
  
  // Student State
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [nextActivity, setNextActivity] = useState<ActivityType>(ActivityType.MENU);
  
  // Submission State
  const [studentName, setStudentName] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Load saved name from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('panda_student_name');
    if (savedName) {
        setStudentName(savedName);
    }
  }, []);

  // Update saved name whenever it changes
  const handleNameChange = (name: string) => {
      setStudentName(name);
      localStorage.setItem('panda_student_name', name);
  };

  useEffect(() => {
    const checkKey = async () => {
      const win = window as unknown as AIStudioWindow;
      if (win.aistudio) {
        const has = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as unknown as AIStudioWindow;
    if (win.aistudio) {
      await win.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const getActiveLesson = (): Lesson => {
    return LESSONS.find(l => l.id === currentLessonId) || LESSONS[0];
  };

  // --- Student Flow Handlers ---

  const handleLessonSelect = (id: number) => {
    setCurrentLessonId(id);
    setActivity(ActivityType.MENU);
  };

  const handleRecord = (record: SubmissionRecord) => {
    setSubmissions(prev => [...prev, record]);
  };

  const handleActivityComplete = () => {
    new Audio(SOUNDS.SUCCESS).play();

    // Determine next activity logic (standard flow)
    let next = ActivityType.MENU;
    switch (activity) {
        case ActivityType.PINYIN: next = ActivityType.SPEAKING; break;
        case ActivityType.SPEAKING: next = ActivityType.QUIZ; break;
        case ActivityType.QUIZ: next = ActivityType.DIALOGUE; break;
        case ActivityType.DIALOGUE: next = ActivityType.SUMMARY; break;
        default: next = ActivityType.MENU; break;
    }
    setNextActivity(next);
    
    // Show module success screen
    setActivity(ActivityType.MODULE_SUCCESS);
  };

  const handleContinue = () => {
      setActivity(nextActivity);
  };

  // --- SUBMISSION HANDLERS ---

  const prepareReport = async () => {
      if (submissions.length === 0) return null;
      const nameToUse = studentName || "Anonymous";
      return await saveHomeworkReport(
          currentLessonId || 1,
          nameToUse,
          submissions
      );
  };

  const handleDirectDownload = async () => {
      const report = await prepareReport();
      if (report) {
          await exportReportToJSON(report);
      } else {
          alert("Nothing to download yet!");
      }
  };

  const handleHTMLDownload = async () => {
      const report = await prepareReport();
      if (report) {
          await exportReportToHTML(report);
      } else {
          alert("Nothing to download yet!");
      }
  };

  const handleWeChatShare = async () => {
      const report = await prepareReport();
      if (!report) return;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      try {
        const file = await getReportFile(report);

        // 1. Try Native Web Share (Preferred for Mobile/Tablet)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Panda Class Homework',
                text: `Homework submission from ${studentName}.`
            });
            return; // Success
        }
        
        throw new Error("Native share not supported");

      } catch (error) {
          console.log("Native share failed, using Fallback strategy", error);
          
          // 2. Fallback: Force Download
          await exportReportToJSON(report);
          
          if (isMobile) {
              setTimeout(() => {
                window.location.href = "weixin://";
              }, 1500);

              alert(
                  "✅ Homework Saved to Files!\n\n" +
                  "Since automatic sharing failed:\n" +
                  "1. The file was saved to your 'Files' or 'Downloads' app.\n" +
                  "2. WeChat will open automatically.\n" +
                  "3. In WeChat, click '+' -> 'Files' -> Select the file you just saved."
              );
          } else {
              const iframe = document.createElement("iframe");
              iframe.style.display = "none";
              iframe.src = "weixin://"; 
              document.body.appendChild(iframe);
              setTimeout(() => {
                if(document.body.contains(iframe)) document.body.removeChild(iframe);
              }, 3000);

              alert(
                  "✅ Homework File Downloaded!\n\n" +
                  "WeChat has been launched.\n" +
                  "1. Open the chat with your teacher.\n" +
                  "2. Drag and drop the downloaded file into the chat."
              );
          }
      }
  };

  // --- Navigation Handlers ---

  const handleSwitchRole = () => {
    if (userRole === 'student') {
        setUserRole('teacher');
        setActivity(ActivityType.TEACHER_PORTAL);
    } else {
        setUserRole('student');
        setActivity(ActivityType.LESSON_SELECT);
    }
  };

  const handleDirectNavigate = (type: ActivityType) => {
    if (type === ActivityType.TEACHER_PORTAL) {
        setUserRole('teacher');
        setActivity(type);
    } else {
        if (userRole !== 'student') setUserRole('student');
        if (type !== ActivityType.LESSON_SELECT && type !== ActivityType.MENU && currentLessonId === null) {
             setCurrentLessonId(1);
        }
        setActivity(type);
    }
  };

  // --- Rendering ---

  if (!hasApiKey) {
    return (
        <Layout currentActivity={ActivityType.MENU} onHome={() => {}}>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">Welcome to Panda Class! 🐼</h2>
                <button onClick={handleSelectKey} className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full border-b-4 border-blue-700 btn-press">
                    🔑 Connect API Key
                </button>
            </div>
        </Layout>
    );
  }

  // Role Selection Screen (Initial)
  if (!userRole) {
      return (
          <Layout currentActivity={ActivityType.MENU} onHome={() => {}}>
             <div className="flex flex-col items-center justify-center h-full gap-8">
                 <h2 className="text-3xl font-bold text-gray-700">Who are you?</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                     <button 
                        onClick={() => { setUserRole('student'); setActivity(ActivityType.LESSON_SELECT); }}
                        className="bg-blue-100 hover:bg-blue-200 border-4 border-blue-300 p-8 rounded-3xl btn-press text-center group"
                     >
                         <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧑‍🎓</div>
                         <div className="text-2xl font-bold text-blue-800">I am a Student</div>
                     </button>
                     <button 
                        onClick={() => { setUserRole('teacher'); setActivity(ActivityType.TEACHER_PORTAL); }}
                        className="bg-green-100 hover:bg-green-200 border-4 border-green-300 p-8 rounded-3xl btn-press text-center group"
                     >
                         <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
                         <div className="text-2xl font-bold text-green-800">I am a Teacher</div>
                     </button>
                 </div>
             </div>
          </Layout>
      );
  }

  // Teacher View
  if (userRole === 'teacher') {
      return (
        <Layout 
            currentActivity={ActivityType.TEACHER_PORTAL} 
            onHome={() => setActivity(ActivityType.LESSON_SELECT)}
            userRole={userRole}
            onSwitchRole={handleSwitchRole}
            onNavigate={handleDirectNavigate}
        >
            <TeacherPortal onBack={handleSwitchRole} />
        </Layout>
      );
  }

  // Student View Content Wrapper
  const renderStudentContent = () => {
    const activeLesson = getActiveLesson();

    const commonSubmitBar = (
        <PartialSubmitBar 
            studentName={studentName}
            setStudentName={handleNameChange}
            submissionsCount={submissions.length}
            onWeChatShare={handleWeChatShare}
            onDownloadJSON={handleDirectDownload}
            onDownloadHTML={handleHTMLDownload}
        />
    );

    switch (activity) {
      case ActivityType.LESSON_SELECT:
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">📚 Choose a Lesson</h2>
                <div className="grid grid-cols-1 gap-6">
                    {LESSONS.map(lesson => (
                        <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson.id)}
                            className="bg-white hover:bg-blue-50 border-4 border-blue-200 rounded-3xl p-6 text-left shadow-sm btn-press flex justify-between items-center group"
                        >
                            <div>
                                <h3 className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">{lesson.title}</h3>
                                <p className="text-gray-500 mt-2">{lesson.description}</p>
                            </div>
                            <span className="text-4xl opacity-20 group-hover:opacity-50">▶️</span>
                        </button>
                    ))}
                </div>
            </div>
        );

      case ActivityType.MENU:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-400 mb-6 text-center uppercase tracking-widest">{activeLesson.title}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
                <MenuButton label="Step 1" title="✍️ 拼音书写" subtitle="Build Pinyin" color="bg-blue-400" onClick={() => setActivity(ActivityType.PINYIN)} />
                <MenuButton label="Step 2" title="🎤 口语跟读" subtitle="Listen & Repeat" color="bg-green-400" onClick={() => setActivity(ActivityType.SPEAKING)} />
                <MenuButton label="Step 3" title="🧩 听音辨意" subtitle="Match Meanings" color="bg-purple-400" onClick={() => setActivity(ActivityType.QUIZ)} />
                <MenuButton label="Step 4" title="💬 情景对话" subtitle="Role Play" color="bg-pink-400" onClick={() => setActivity(ActivityType.DIALOGUE)} />
            </div>
          </div>
        );

      case ActivityType.MODULE_SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center w-full">
             <div className="text-6xl mb-4">🌟</div>
             <h2 className="text-3xl font-bold text-blue-600 mb-4">Good Job!</h2>
             
             <div className="flex flex-col gap-4 w-full max-w-sm">
                <button 
                    onClick={handleContinue}
                    className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 btn-press"
                >
                    {nextActivity === ActivityType.SUMMARY ? 'Finish Lesson 🏁' : 'Next Activity ➡️'}
                </button>
                {commonSubmitBar}
             </div>
          </div>
        );
      
      case ActivityType.PINYIN:
        return (
            <>
                <PinyinPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                {commonSubmitBar}
            </>
        );
      case ActivityType.SPEAKING:
        return (
            <>
                <SpeakingPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                {commonSubmitBar}
            </>
        );
      case ActivityType.QUIZ:
        return (
            <>
                <Quiz data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                {commonSubmitBar}
            </>
        );
      case ActivityType.DIALOGUE:
        return (
            <>
                <DialoguePractice data={activeLesson.dialogues} onComplete={handleActivityComplete} onRecord={handleRecord} />
                {commonSubmitBar}
            </>
        );
        
      case ActivityType.SUMMARY:
          return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
                 <div className="text-7xl mb-6">🎉</div>
                 <h2 className="text-4xl font-bold text-blue-600 mb-2">Lesson Complete!</h2>
                 <p className="text-gray-500 font-bold mb-8">You have completed all activities.</p>
                 
                 <div className="w-full max-w-md bg-white border-4 border-blue-100 rounded-[2rem] p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">📥 Turn In Homework</h3>
                    
                    <div className="mb-6">
                        <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Student Name</label>
                        <input 
                            value={studentName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Enter Name"
                            className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 font-bold text-gray-700 h-12"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                         {/* WeChat Main CTA */}
                        <button 
                            onClick={handleWeChatShare}
                            disabled={!studentName.trim()}
                            className={`w-full py-4 rounded-xl font-bold text-xl text-white border-b-4 btn-press flex items-center justify-center gap-3
                                ${!studentName.trim() ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 border-green-700'}
                            `}
                        >
                            <span>💬</span> Send to WeChat Friend
                        </button>
                        
                        <div className="text-center text-gray-300 text-sm font-bold">- OR -</div>
                        
                        <div className="flex gap-2">
                             <button 
                                 onClick={handleHTMLDownload}
                                 disabled={!studentName.trim()}
                                 className={`flex-1 py-3 rounded-xl font-bold text-sm text-white border-b-4 btn-press
                                    ${!studentName.trim() ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500 border-blue-600'}
                                 `}
                            >
                                📄 Save HTML Report
                            </button>
                            <button 
                                 onClick={handleDirectDownload}
                                 disabled={!studentName.trim()}
                                 className={`flex-1 py-3 rounded-xl font-bold text-sm text-white border-b-4 btn-press
                                    ${!studentName.trim() ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600 text-yellow-900'}
                                 `}
                            >
                                📥 Backup JSON
                            </button>
                        </div>
                    </div>
                 </div>
             </div>
          );

      default:
        return null;
    }
  };

  return (
    <Layout 
        currentActivity={activity} 
        onHome={() => setActivity(ActivityType.LESSON_SELECT)}
        userRole={userRole}
        onSwitchRole={handleSwitchRole}
        onNavigate={handleDirectNavigate}
    >
      {renderStudentContent()}
    </Layout>
  );
};

const MenuButton: React.FC<{label: string; title: string; subtitle: string; color: string; onClick: () => void}> = ({ label, title, subtitle, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} hover:brightness-110 text-white p-6 rounded-[2rem] text-left border-b-8 border-black/20 btn-press flex flex-col justify-between h-40 sm:h-48`}
  >
    <div>
        <span className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest mb-1 block">{label}</span>
        <span className="text-2xl sm:text-3xl font-bold block mb-2">{title}</span>
    </div>
    <span className="text-md sm:text-lg opacity-90">{subtitle}</span>
  </button>
);

export default App;