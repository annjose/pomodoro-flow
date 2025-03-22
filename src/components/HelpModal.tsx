import React, { useRef } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside of content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Theme-specific button color classes for the close button
  const getCloseButtonClasses = () => {
    switch (theme) {
      case "synthwave":
        return "bg-purple-600 hover:bg-purple-700";
      case "cafe":
        return "bg-amber-600 hover:bg-amber-700";
      case "cosmic":
        return "bg-blue-700 hover:bg-blue-800";
      case "minimal":
        return "bg-gray-600 hover:bg-gray-700";
      case "lofi":
        return "bg-slate-600 hover:bg-slate-700";
      case "forest":
        return "bg-emerald-600 hover:bg-emerald-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalContentRef}
        className="bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-xl w-full max-w-md backdrop-blur-sm"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">How to Use Pomodoro Flow</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-gray-700 dark:text-gray-300">
          <p className="mb-4 text-sm">
            The Pomodoro Technique breaks work into focused intervals (25 min by default) separated by short breaks.
          </p>

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <span className="font-medium text-sm">1</span>
              </div>
              <p className="text-sm">Click <span className="font-medium">Start</span> to begin a focus session</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <span className="font-medium text-sm">2</span>
              </div>
              <p className="text-sm">Work until the timer completes</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <span className="font-medium text-sm">3</span>
              </div>
              <p className="text-sm">Take a short break when prompted</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <span className="font-medium text-sm">4</span>
              </div>
              <p className="text-sm">After 4 sessions, take a longer break</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <span className="font-medium text-sm">5</span>
              </div>
              <p className="text-sm">Customize timer durations and sessions in Settings</p>
            </div>
          </div>

          <div className="bg-gray-100/60 dark:bg-gray-700/50 p-3 rounded-lg text-sm mb-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Tips for Better Focus:</h3>
            <ul className="space-y-1 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span>Choose one specific task per session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span>Use breaks to rest and recharge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span>Note distractions and handle them during breaks</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <a 
              href="https://en.wikipedia.org/wiki/Pomodoro_Technique" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full px-3 py-1.5 bg-gray-200 dark:bg-white/30 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/40 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>About Pomodoro</span>
            </a>
            <a 
              href="https://github.com/annjose/pomodoro-flow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full px-3 py-1.5 bg-gray-200 dark:bg-white/30 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/40 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub Source</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button 
            onClick={onClose}
            className={`px-5 py-2 text-white rounded-lg transition-colors ${getCloseButtonClasses()}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
