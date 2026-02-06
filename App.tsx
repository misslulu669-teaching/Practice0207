import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PinyinPractice from './components/PinyinPractice';
import SpeakingPractice from './components/SpeakingPractice';
import Quiz from './components/Quiz';
import DialoguePractice from './components/DialoguePractice';
import { ActivityType, SubmissionRecord, Lesson } from './types';
import { LESSONS, SOUNDS } from './constants';

interface AIStudioWindow {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

const App: React.FC = () => {
  const [activity, setActivity] = useState<ActivityType>(ActivityType.LESSON_SELECT);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Track completed lessons to show checkmarks in directory
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

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

  const handleLessonSelect = (id: number) => {
    setCurrentLessonId(id);
    setSubmissions([]); // Clear previous submissions
    setActivity(ActivityType.MENU);
  };

  const handleActivityComplete = (newRecords?: SubmissionRecord[]) => {
    if (newRecords) {
      setSubmissions(prev => [...prev, ...newRecords]);
    }
    // Play success sound
    new Audio(SOUNDS.SUCCESS).play();

    // Auto-advance logic
    switch (activity) {
        case ActivityType.PINYIN:
            setActivity(ActivityType.SPEAKING);
            break;
        case ActivityType.SPEAKING:
            setActivity(ActivityType.QUIZ);
            break;
        case ActivityType.QUIZ:
            setActivity(ActivityType.DIALOGUE);
            break;
        case ActivityType.DIALOGUE:
            setActivity(ActivityType.SUMMARY);
            break;
        default:
            setActivity(ActivityType.MENU);
            break;
    }
  };

  const calculateScore = () => {
    return submissions.length * 10;
  };

  const handleFinishLesson = () => {
     setActivity(ActivityType.SUMMARY);
  };

  const generateReport = () => {
    const lesson = getActiveLesson();
    const score = calculateScore();
    const date = new Date().toLocaleDateString();
    
    return `
🐼 Little Panda Class Report 🐼
-----------------------------
Student: Student_123
Lesson: ${lesson.title}
Date: ${date}

Activities Completed: ${submissions.length}
Total Score: ${score} points!

Teacher Comments:
Great effort on ${lesson.title}! 
-----------------------------
    `.trim();
  };

  const handleShare = async () => {
    const report = generateReport();
    try {
        await navigator.clipboard.writeText(report);
        alert("Report copied to clipboard! You can paste it to your teacher now. 📋");
    } catch (err) {
        console.error("Failed to copy", err);
        alert("Could not copy automatically. Please take a screenshot!");
    }
  };

  const handleCloseLesson = () => {
    if (currentLessonId !== null) {
        if (!completedLessons.includes(currentLessonId)) {
            setCompletedLessons(prev => [...prev, currentLessonId]);
        }
    }
    setCurrentLessonId(null);
    setSubmissions([]);
    setActivity(ActivityType.LESSON_SELECT);
  };

  // Navigation Handlers
  const handleBack = () => {
      // If in a module (Pinyin, etc), go to Menu
      if (
          activity === ActivityType.PINYIN || 
          activity === ActivityType.SPEAKING || 
          activity === ActivityType.QUIZ || 
          activity === ActivityType.DIALOGUE ||
          activity === ActivityType.SUMMARY
      ) {
          setActivity(ActivityType.MENU);
      } 
      // If in Menu, go to Directory
      else if (activity === ActivityType.MENU) {
          handleCloseLesson();
      }
      // If in Directory, do nothing (or maybe exit app?)
  };

  const handlePrevLesson = () => {
      if (currentLessonId && currentLessonId > 1) {
          const prevId = currentLessonId - 1;
          handleLessonSelect(prevId);
      } else {
          alert("This is the first lesson!");
      }
  };

  const handleDirectNavigate = (type: ActivityType) => {
      setActivity(type);
  };


  const renderContent = () => {
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
                            {completedLessons.includes(lesson.id) && (
                                <span className="text-4xl">✅</span>
                            )}
                            {!completedLessons.includes(lesson.id) && (
                                <span className="text-4xl opacity-20 group-hover:opacity-50">▶️</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );

      case ActivityType.MENU:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-400 mb-4 text-center uppercase tracking-widest">{activeLesson.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
                <MenuButton 
                label="WRITING"
                title="✍️ 拼音书写" 
                subtitle="Build Pinyin" 
                color="bg-blue-400"
                onClick={() => setActivity(ActivityType.PINYIN)} 
                />
                <MenuButton 
                label="SPEAKING"
                title="🎤 口语跟读" 
                subtitle="Listen & Repeat" 
                color="bg-green-400"
                onClick={() => setActivity(ActivityType.SPEAKING)} 
                />
                <MenuButton 
                label="QUIZ"
                title="🧩 听音辨意" 
                subtitle="Match Meanings" 
                color="bg-purple-400"
                onClick={() => setActivity(ActivityType.QUIZ)} 
                />
                <MenuButton 
                label="DIALOGUE"
                title="💬 情景对话" 
                subtitle="Role Play" 
                color="bg-pink-400"
                onClick={() => setActivity(ActivityType.DIALOGUE)} 
                />
            </div>
            
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={handleFinishLesson}
                    disabled={submissions.length === 0}
                    className={`
                        px-8 py-4 rounded-full font-bold text-xl text-white shadow-lg btn-press
                        ${submissions.length > 0 ? 'bg-yellow-400 hover:bg-yellow-500 border-b-4 border-yellow-600' : 'bg-gray-300 border-gray-400 cursor-not-allowed'}
                    `}
                >
                    📝 Finish Lesson & Get Report
                </button>
            </div>
            <div className="text-center mt-2 text-gray-400 text-sm">
                Complete at least one activity to finish.
            </div>
          </div>
        );

      case ActivityType.PINYIN:
        return <PinyinPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} />;
      case ActivityType.SPEAKING:
        return <SpeakingPractice data={activeLesson.vocabulary} onComplete={handleActivityComplete} />;
      case ActivityType.QUIZ:
        return <Quiz data={activeLesson.vocabulary} onComplete={() => handleActivityComplete()} />;
      case ActivityType.DIALOGUE:
        return <DialoguePractice data={activeLesson.dialogues} onComplete={(records) => handleActivityComplete(records)} />;
        
      case ActivityType.SUMMARY:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center w-full">
             <div className="text-6xl mb-4">🎉</div>
             <h2 className="text-3xl font-bold text-blue-600 mb-2">Lesson Complete!</h2>
             <p className="text-xl text-gray-600 mb-6">{activeLesson.title}</p>
             
             <div className="bg-white p-6 rounded-2xl border-4 border-yellow-200 shadow-inner w-full max-w-md mb-8">
                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                     <span className="text-gray-500 font-bold">Activities Done</span>
                     <span className="text-2xl font-bold text-green-500">{submissions.length}</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-bold">Total Score</span>
                     <span className="text-2xl font-bold text-purple-500">{calculateScore()}</span>
                 </div>
             </div>
             
             <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                  onClick={handleShare}
                  className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-green-500 hover:bg-green-600 border-b-4 border-green-700 btn-press flex items-center justify-center gap-2"
                >
                  <span>📋</span> Copy Report for Teacher
                </button>
                <button 
                  onClick={handleCloseLesson}
                  className="w-full py-4 rounded-2xl font-bold text-xl text-gray-600 bg-gray-200 hover:bg-gray-300 border-b-4 border-gray-400 btn-press"
                >
                  Back to Lessons
                </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!hasApiKey) {
    return (
        <Layout currentActivity={ActivityType.MENU} onHome={() => {}}>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">Welcome to Panda Class! 🐼</h2>
                <p className="text-gray-500 mb-8 text-xl">Please connect your API Key to start.</p>
                <button 
                    onClick={handleSelectKey}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-full border-b-4 border-blue-700 btn-press shadow-lg"
                >
                    🔑 Connect API Key
                </button>
            </div>
        </Layout>
    );
  }

  return (
    <Layout 
        currentActivity={activity} 
        onHome={() => {
            setActivity(ActivityType.LESSON_SELECT);
            setCurrentLessonId(null);
        }}
        showNav={currentLessonId !== null}
        onBack={handleBack}
        onPrevLesson={handlePrevLesson}
        onNavigate={handleDirectNavigate}
    >
      {renderContent()}
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