import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PinyinPractice from './components/PinyinPractice';
import SpeakingPractice from './components/SpeakingPractice';
import Quiz from './components/Quiz';
import DialoguePractice from './components/DialoguePractice';
import { ActivityType, SubmissionRecord } from './types';
import { VOCABULARY, DIALOGUES, SOUNDS } from './constants';

// Local interface to handle window.aistudio without global declaration conflict
interface AIStudioWindow extends Window {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

const App: React.FC = () => {
  const [activity, setActivity] = useState<ActivityType>(ActivityType.MENU);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      const win = window as unknown as AIStudioWindow;
      if (win.aistudio) {
        // If in Google AI Studio environment, check if key is selected
        const has = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        // If in standard environment (Netlify/Local), assume process.env.API_KEY is set or will be handled by the service
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

  const handleActivityComplete = (newRecords?: SubmissionRecord[]) => {
    if (newRecords) {
      setSubmissions(prev => [...prev, ...newRecords]);
    }
    // Play success sound
    new Audio(SOUNDS.SUCCESS).play();
    setActivity(ActivityType.SUMMARY);
  };

  const handleSubmitToTeacher = () => {
    // Mock submission
    const dataToSave = {
      studentId: 'student_123',
      date: new Date().toISOString(),
      records: submissions.map(r => ({
        ...r,
        input: r.type === 'speaking' ? '[Audio Blob]' : r.input 
      }))
    };
    console.log("Submitting to netlify function/db:", dataToSave);
    alert("Great work! Sent to your teacher! 🌟");
    setSubmissions([]);
    setActivity(ActivityType.MENU);
  };

  const renderContent = () => {
    switch (activity) {
      case ActivityType.MENU:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
            <MenuButton 
              title="✍️ Writing" 
              subtitle="Listen & Write Pinyin" 
              color="bg-blue-400"
              onClick={() => setActivity(ActivityType.PINYIN)} 
            />
            <MenuButton 
              title="🎤 Speaking" 
              subtitle="Listen & Repeat" 
              color="bg-green-400"
              onClick={() => setActivity(ActivityType.SPEAKING)} 
            />
            <MenuButton 
              title="🧩 Quiz" 
              subtitle="Match Pinyin to Meaning" 
              color="bg-purple-400"
              onClick={() => setActivity(ActivityType.QUIZ)} 
            />
            <MenuButton 
              title="💬 Dialogue" 
              subtitle="Role Play & Record" 
              color="bg-pink-400"
              onClick={() => setActivity(ActivityType.DIALOGUE)} 
            />
          </div>
        );
      case ActivityType.PINYIN:
        return <PinyinPractice data={VOCABULARY} onComplete={handleActivityComplete} />;
      case ActivityType.SPEAKING:
        return <SpeakingPractice data={VOCABULARY} onComplete={handleActivityComplete} />;
      case ActivityType.QUIZ:
        return <Quiz data={VOCABULARY} onComplete={() => handleActivityComplete()} />;
      case ActivityType.DIALOGUE:
        return <DialoguePractice data={DIALOGUES} onComplete={(records) => handleActivityComplete(records)} />;
      case ActivityType.SUMMARY:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="text-6xl mb-4">🏆</div>
             <h2 className="text-4xl font-bold text-yellow-500 mb-4">Awesome Job!</h2>
             <p className="text-gray-500 text-xl mb-8">You finished this lesson section.</p>
             
             <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                  onClick={handleSubmitToTeacher}
                  className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-green-500 hover:bg-green-600 border-b-4 border-green-700 btn-press"
                >
                  Send to Teacher 📤
                </button>
                <button 
                  onClick={() => setActivity(ActivityType.MENU)}
                  className="w-full py-4 rounded-2xl font-bold text-xl text-gray-600 bg-gray-200 hover:bg-gray-300 border-b-4 border-gray-400 btn-press"
                >
                  Back to Menu
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
                <p className="mt-8 text-sm text-gray-400">
                    Parent note: This app uses Google Gemini API for AI grading.
                </p>
            </div>
        </Layout>
    );
  }

  return (
    <Layout currentActivity={activity} onHome={() => setActivity(ActivityType.MENU)}>
      {renderContent()}
    </Layout>
  );
};

const MenuButton: React.FC<{title: string; subtitle: string; color: string; onClick: () => void}> = ({ title, subtitle, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} hover:brightness-110 text-white p-8 rounded-[2rem] text-left border-b-8 border-black/20 btn-press flex flex-col justify-between h-48`}
  >
    <span className="text-3xl font-bold block mb-2">{title}</span>
    <span className="text-lg opacity-90">{subtitle}</span>
  </button>
);

export default App;