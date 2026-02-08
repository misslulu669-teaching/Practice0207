import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PinyinPractice from './components/PinyinPractice';
import SpeakingPractice from './components/SpeakingPractice';
import Quiz from './components/Quiz';
import DialoguePractice from './components/DialoguePractice';
import TeacherPortal from './components/TeacherPortal';
import { ActivityType, SubmissionRecord, Lesson } from './types';
import { LESSONS, SOUNDS } from './constants';
import { saveHomeworkReport, exportReportToJSON } from './services/reportService';

interface AIStudioWindow {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

// Separate component to prevent input focus loss on re-renders
const PartialSubmitBar: React.FC<{
  studentName: string;
  setStudentName: (s: string) => void;
  submissionsCount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}> = ({ studentName, setStudentName, submissionsCount, onSubmit, isSubmitting }) => (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 w-full flex flex-col items-center gap-2">
            <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest">Done for today?</h4>
            <div className="flex gap-2 w-full max-w-md">
                <input 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Name"
                    className="flex-1 bg-gray-50 border-2 border-gray-300 rounded-xl px-4 font-bold text-gray-700 h-12"
                />
                <button 
                    onClick={onSubmit}
                    disabled={isSubmitting || submissionsCount === 0}
                    className={`
                        px-6 rounded-xl font-bold text-white whitespace-nowrap h-12 flex items-center
                        ${submissionsCount > 0 
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-b-4 border-yellow-600 btn-press' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    {isSubmitting ? 'Saving...' : `💾 Save Ticket (${submissionsCount})`}
                </button>
            </div>
            <p className="text-xs text-gray-400 text-center">Save this file and send it to your teacher!</p>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handlePartialSubmit = async () => {
      if (submissions.length === 0) {
          alert("No new work to submit yet! Finish a module first.");
          return;
      }
      if (!studentName.trim()) {
          const name = prompt("Enter your name to submit:");
          if (name) handleNameChange(name);
          else return;
      }
      
      setIsSubmitting(true);
      try {
          // Use current name or prompt again if somehow empty
          const nameToUse = studentName || "Anonymous";
          // 1. Save locally
          const report = await saveHomeworkReport(
              currentLessonId || 1,
              nameToUse,
              submissions
          );
          
          if (report) {
              // 2. Export to JSON file for remote sharing
              await exportReportToJSON(report);

              alert(`✅ Saved! A file has been downloaded.\nPlease send this file to your teacher.`);
              setSubmissions([]); // Clear the queue after successful save
          } else {
              alert("Failed to save to database.");
          }
      } catch (e) {
          console.error(e);
          alert("Error submitting homework.");
      } finally {
          setIsSubmitting(false);
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
        
        // Ensure a lesson is selected if jumping to a specific activity
        if (type !== ActivityType.LESSON_SELECT && type !== ActivityType.MENU && currentLessonId === null) {
             setCurrentLessonId(1); // Default to lesson 1 if jumping blindly
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
                <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
             </div>
          </div>
        );
      
      // For all practice modes, append the PartialSubmitBar below
      // Now passing onRecord to all components to allow incremental state updates
      case ActivityType.PINYIN:
        return (
            <>
                <PinyinPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
            </>
        );
      case ActivityType.SPEAKING:
        return (
            <>
                <SpeakingPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
            </>
        );
      case ActivityType.QUIZ:
        return (
            <>
                <Quiz data={activeLesson.vocabulary} onComplete={handleActivityComplete} onRecord={handleRecord} />
                <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
            </>
        );
      case ActivityType.DIALOGUE:
        return (
            <>
                <DialoguePractice data={activeLesson.dialogues} onComplete={handleActivityComplete} onRecord={handleRecord} />
                <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
            </>
        );
        
      case ActivityType.SUMMARY:
          return (
             <div className="flex flex-col items-center justify-center h-full text-center w-full">
                 <div className="text-6xl mb-4">🎉</div>
                 <h2 className="text-3xl font-bold text-blue-600 mb-6">Lesson Complete!</h2>
                 <PartialSubmitBar 
                    studentName={studentName}
                    setStudentName={handleNameChange}
                    submissionsCount={submissions.length}
                    isSubmitting={isSubmitting}
                    onSubmit={handlePartialSubmit}
                />
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