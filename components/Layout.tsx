import React, { useState } from 'react';
import { ActivityType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentActivity: ActivityType;
  onHome: () => void;
  // Navigation props
  showNav?: boolean;
  onBack?: () => void;
  onPrevLesson?: () => void;
  onNavigate?: (type: ActivityType) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentActivity, 
  onHome,
  showNav = false,
  onBack,
  onPrevLesson,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-50">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full border-4 border-yellow-400 shadow-lg">
            <span className="text-4xl">🐼</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide drop-shadow-sm hidden sm:block">
            Little Panda Class
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Bookmark Menu */}
          {showNav && (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-3 rounded-full border-4 border-yellow-300 btn-press shadow-md"
                title="Lesson Bookmarks"
              >
                <span className="text-2xl">🔖</span>
              </button>

              {isMenuOpen && (
                <div className="absolute top-16 right-0 bg-white border-4 border-blue-200 rounded-3xl shadow-2xl p-4 w-64 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-center font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Quick Nav</h3>
                  
                  <button 
                    onClick={() => handleNavClick(onBack!)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 font-bold text-gray-700 transition-colors"
                  >
                    <span>⬅️</span> Previous Page
                  </button>
                  
                  <button 
                    onClick={() => handleNavClick(onPrevLesson!)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 font-bold text-gray-700 transition-colors"
                  >
                    <span>⏮️</span> Previous Lesson
                  </button>
                  
                  <div className="h-0.5 bg-gray-100 my-1"></div>
                  
                  <button onClick={() => handleNavClick(() => onNavigate?.(ActivityType.PINYIN))} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 text-blue-600 font-bold">
                    <span>✍️</span> Writing
                  </button>
                  <button onClick={() => handleNavClick(() => onNavigate?.(ActivityType.SPEAKING))} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50 text-green-600 font-bold">
                    <span>🎤</span> Speaking
                  </button>
                  <button onClick={() => handleNavClick(() => onNavigate?.(ActivityType.QUIZ))} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-purple-50 text-purple-600 font-bold">
                    <span>🧩</span> Quiz
                  </button>
                  <button onClick={() => handleNavClick(() => onNavigate?.(ActivityType.DIALOGUE))} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-pink-50 text-pink-600 font-bold">
                    <span>💬</span> Dialogue
                  </button>
                </div>
              )}
            </div>
          )}

          {currentActivity !== ActivityType.MENU && currentActivity !== ActivityType.LESSON_SELECT && (
            <button 
              onClick={onHome}
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-3xl border-b-4 border-red-600 btn-press"
            >
              🏠 Home
            </button>
          )}
        </div>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-[3rem] p-6 sm:p-10 cartoon-card min-h-[60vh] relative z-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-blue-800/60 font-medium">
        Practice makes perfect! 加油!
      </footer>
      
      {/* Backdrop for menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default Layout;