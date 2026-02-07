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
  userRole?: 'student' | 'teacher' | null;
  onSwitchRole?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentActivity, 
  onHome,
  onNavigate,
  userRole,
  onSwitchRole
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: '📚 Lesson Select', type: ActivityType.LESSON_SELECT },
    { label: '✍️ Pinyin Practice', type: ActivityType.PINYIN },
    { label: '🎤 Speaking', type: ActivityType.SPEAKING },
    { label: '🧩 Quiz', type: ActivityType.QUIZ },
    { label: '💬 Dialogue', type: ActivityType.DIALOGUE },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pb-24">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-4 relative z-0">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full border-4 border-yellow-400 shadow-lg">
            <span className="text-4xl">🐼</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide drop-shadow-sm hidden sm:block">
            Little Panda Class
          </h1>
        </div>
        
        {/* Only show simple Home button if not using the main nav (fallback) */}
        {!userRole && (
             <button onClick={onHome} className="text-gray-500 font-bold">Home</button>
        )}
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-[3rem] p-6 sm:p-10 cartoon-card min-h-[60vh] relative z-0 mb-10">
        {children}
      </main>

      {/* Persistent Floating Navigation Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
         
         {/* Role Switcher (Always Visible) */}
         <button 
            onClick={onSwitchRole}
            className="bg-white border-4 border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-gray-50 btn-press mb-2 text-sm"
         >
            🔄 Switch: {userRole === 'teacher' ? 'To Student' : 'To Teacher'}
         </button>

         {/* Main Menu Toggle */}
         <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full border-4 border-blue-700 shadow-2xl btn-press flex items-center justify-center w-16 h-16 transition-transform"
         >
            <span className="text-3xl">{isMenuOpen ? '✕' : '☰'}</span>
         </button>

         {/* Menu Content */}
         {isMenuOpen && (
             <div className="absolute bottom-24 right-0 bg-white border-4 border-blue-200 rounded-3xl shadow-2xl p-4 w-64 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-center font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Quick Navigation</h3>
                
                {/* Teacher specific link */}
                <button 
                  onClick={() => handleNavClick(() => onNavigate?.(ActivityType.TEACHER_PORTAL))}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${currentActivity === ActivityType.TEACHER_PORTAL ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    <span>👨‍🏫</span> Teacher Portal
                </button>

                <div className="h-0.5 bg-gray-100 my-1"></div>

                {/* Lesson Links */}
                {menuItems.map((item) => (
                    <button 
                        key={item.type}
                        onClick={() => handleNavClick(() => onNavigate?.(item.type))}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold transition-colors ${currentActivity === item.type ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        {item.label}
                    </button>
                ))}
             </div>
         )}
      </div>

      {/* Backdrop for menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default Layout;