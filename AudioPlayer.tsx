import React from 'react';
import { speakText } from '../services/geminiService';

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, autoPlay = false, label = "Listen" }) => {

  const handlePlay = () => {
    // Use the instant, free browser API
    speakText(text, 'zh-CN');
  };

  React.useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <button
      onClick={handlePlay}
      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-b-4 border-yellow-600 btn-press"
    >
      <span>🔊</span>
      {label}
    </button>
  );
};

export default AudioPlayer;