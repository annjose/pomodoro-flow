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
        className="bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto backdrop-blur-sm"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pomodoro Flow Guide</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">What is the Pomodoro Technique?</h3>
            <div className="space-y-3">
              <p>
                The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
              </p>
              <p>
                Each interval is known as a "pomodoro" (Italian for tomato), named after the tomato-shaped kitchen timer that Francesco Cirillo used as a university student.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">How to Use Pomodoro Flow</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <span className="font-medium">1</span>
                </div>
                <p>Start a focus session by clicking the <span className="font-medium">Start</span> button. By default, this lasts 25 minutes.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <span className="font-medium">2</span>
                </div>
                <p>Work on your task until the timer completes.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <span className="font-medium">3</span>
                </div>
                <p>Take a short break (5 minutes by default).</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <span className="font-medium">4</span>
                </div>
                <p>After 4 focus sessions, take a longer break (15 minutes by default).</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">App Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-100/60 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Timer Controls:</span> Start, pause, and reset the timer</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Mode Selection:</span> Switch between Focus and Break modes</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Session Tracking:</span> Track progress with session dots</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Customize Settings:</span> Change durations and sessions</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Themes:</span> Multiple visual styles to choose from</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <p><span className="font-medium">Notifications:</span> Visual and sound alerts</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Productivity Tips</h3>
            <div className="space-y-3">
              <p className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <span>Choose one specific task to focus on during each session</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <span>Small tasks can be grouped together in a single session</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <span>Use breaks to rest, stretch, hydrate, or briefly step away</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">•</span>
                <span>Note distractions and postpone them until your break</span>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
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
