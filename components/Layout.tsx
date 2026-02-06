import React from 'react';
import { ActivityType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentActivity: ActivityType;
  onHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentActivity, onHome }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full border-4 border-yellow-400 shadow-lg">
            <span className="text-4xl">🐼</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide drop-shadow-sm hidden sm:block">
            Little Panda Class
          </h1>
        </div>
        
        {currentActivity !== ActivityType.MENU && (
          <button 
            onClick={onHome}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-3xl border-b-4 border-red-600 btn-press"
          >
            🏠 Home
          </button>
        )}
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-[3rem] p-6 sm:p-10 cartoon-card min-h-[60vh] relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-blue-800/60 font-medium">
        Practice makes perfect! 加油!
      </footer>
    </div>
  );
};

export default Layout;