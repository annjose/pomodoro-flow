"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import HelpModal from "../components/HelpModal";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSettings {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    sessionsPerCycle: number;
}

const PomodoroFlow = () => {
    // Check for debug mode from query parameter
    const [isDebugMode, setIsDebugMode] = useState(false);
    
    // Customizable timer settings
    const [customSettings, setCustomSettings] = useState<TimerSettings>({
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsPerCycle: 4,
    });
    
    // Show settings modal
    const [showSettings, setShowSettings] = useState(false);
    
    // Show help modal
    const [showHelp, setShowHelp] = useState(false);
    
    // Reference to modal content
    const modalContentRef = useRef<HTMLDivElement>(null);
    
    // Close modal when clicking outside of it
    const handleModalBackdropClick = (e: React.MouseEvent) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            setShowSettings(false);
        }
    };
    
    // Effect to check for debug parameter in URL and set initial timer values
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const debugParam = urlParams.get('debug');
            const isDebug = debugParam === 'true' || debugParam === '1';
            setIsDebugMode(isDebug);
            
            // Reset timer with updated debug mode
            const timerDuration = isDebug ? 60 : 25 * 60; // 1 min or 25 min in seconds
            setTimeLeft(timerDuration);
        }
    }, []);
    
    // Timer settings in minutes - wrap in useMemo to avoid recreation on every render
    const timerSettings = useMemo(() => ({
        pomodoro: isDebugMode ? 0.5 : customSettings.pomodoro, // 30 seconds in debug mode
        shortBreak: isDebugMode ? 1/6 : customSettings.shortBreak, // 10 seconds in debug mode
        longBreak: isDebugMode ? 0.25 : customSettings.longBreak, // 15 seconds in debug mode
        sessionsPerCycle: customSettings.sessionsPerCycle,
    }), [isDebugMode, customSettings.pomodoro, customSettings.shortBreak, customSettings.longBreak, customSettings.sessionsPerCycle]);

    const [mode, setMode] = useState<TimerMode>("pomodoro");
    const [timeLeft, setTimeLeft] = useState(0); // Start with 0 and let the useEffect set it correctly
    const [isActive, setIsActive] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [theme, setTheme] = useState<string>("minimal");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    // Sound effects
    const timerCompleteSound = useRef<HTMLAudioElement | null>(null);

    // Initialize audio on client side only
    useEffect(() => {
        // tada2.wav by jobro -- https://freesound.org/s/60444/ -- License: Attribution 3.0
        timerCompleteSound.current = new Audio("/sounds/complete.wav");
    }, []);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            timerCompleteSound.current?.play();

            if (mode === "pomodoro") {
                setCompletedPomodoros(completedPomodoros + 1);
                
                // Display in-app notification only
                setNotificationMessage("Focus session complete! Time for a break.");
                setShowNotification(true);

                // After n pomodoros, take a long break
                if ((completedPomodoros + 1) % timerSettings.sessionsPerCycle === 0) {
                    setMode("longBreak");
                    setTimeLeft(timerSettings.longBreak * 60);
                } else {
                    setMode("shortBreak");
                    setTimeLeft(timerSettings.shortBreak * 60);
                }
            } else {
                // Display in-app notification only for break completion
                setNotificationMessage("Break time over! Ready to focus again?");
                setShowNotification(true);
                
                // After break, switch back to pomodoro
                setMode("pomodoro");
                setTimeLeft(timerSettings.pomodoro * 60);
            }

            setIsActive(false);
            
            // Hide notification after 5 seconds
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, completedPomodoros, timerSettings]);

    // Update timeLeft when timerSettings or mode changes
    useEffect(() => {
        let duration = 0;
        switch (mode) {
            case "pomodoro":
                duration = timerSettings.pomodoro * 60;
                break;
            case "shortBreak":
                duration = timerSettings.shortBreak * 60;
                break;
            case "longBreak":
                duration = timerSettings.longBreak * 60;
                break;
        }
        
        if (!isActive) {
            setTimeLeft(duration);
        }
    }, [timerSettings, mode, isActive]); // Add isActive to dependency array

    // Format time as mm:ss
    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    // Change timer mode
    const changeMode = (newMode: TimerMode) => {
        setIsActive(false); // First pause the current timer
        setMode(newMode);

        // Set the appropriate time based on the selected mode
        switch (newMode) {
            case "pomodoro":
                setTimeLeft(timerSettings.pomodoro * 60);
                break;
            case "shortBreak":
                setTimeLeft(timerSettings.shortBreak * 60);
                break;
            case "longBreak":
                setTimeLeft(timerSettings.longBreak * 60);
                break;
        }

        // Automatically start the timer after a short delay
        setTimeout(() => {
            setIsActive(true);
        }, 300);
    };

    // Toggle timer
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    // Reset timer
    const resetTimer = () => {
        setIsActive(false);

        switch (mode) {
            case "pomodoro":
                setTimeLeft(timerSettings.pomodoro * 60);
                break;
            case "shortBreak":
                setTimeLeft(timerSettings.shortBreak * 60);
                break;
            case "longBreak":
                setTimeLeft(timerSettings.longBreak * 60);
                break;
        }
    };

    // Change theme
    const cycleTheme = () => {
        const themes = ["synthwave", "cafe", "cosmic", "minimal", "lofi", "forest"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    // Save custom settings and close modal
    const saveSettings = (newSettings: TimerSettings) => {
        setCustomSettings(newSettings);
        setShowSettings(false);
        
        // Reset timer with new settings if not active
        if (!isActive) {
            switch (mode) {
                case "pomodoro":
                    setTimeLeft(isDebugMode ? 30 : newSettings.pomodoro * 60);
                    break;
                case "shortBreak":
                    setTimeLeft(isDebugMode ? 10 : newSettings.shortBreak * 60);
                    break;
                case "longBreak":
                    setTimeLeft(isDebugMode ? 15 : newSettings.longBreak * 60);
                    break;
            }
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col justify-center items-center transition-colors duration-2000 ${
                theme === "synthwave"
                    ? "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 text-pink-200"
                    : theme === "cafe"
                    ? "bg-gradient-to-br from-amber-800 via-amber-700 to-yellow-600 text-amber-100"
                    : theme === "cosmic"
                    ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-cyan-200"
                    : theme === "minimal"
                    ? "bg-gradient-to-br from-neutral-200 via-gray-200 to-neutral-300 text-gray-800"
                    : theme === "lofi"
                    ? "bg-gradient-to-br from-slate-700 via-slate-600 to-zinc-700 text-slate-200"
                    : "bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500 text-emerald-100"
            }`}
        >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-11/12 max-w-4xl min-h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/20 flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Pomodoro Flow
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm opacity-80 italic">
                            {theme.charAt(0).toUpperCase() + theme.slice(1)} vibe
                        </span>
                        <button
                            onClick={cycleTheme}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Change Theme
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-xl text-sm font-medium transition-all"
                            title="Customize timer durations"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-xl text-sm font-medium transition-all"
                            title="Help and instructions"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <a
                            href="https://github.com/annjose/pomodoro-flow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-xl text-sm font-medium transition-all"
                            title="View source code on GitHub"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                {/* Main content */}
                <div className="flex-grow flex flex-col justify-center items-center p-8">
                    {/* Timer display */}
                    <div className="mb-12 text-center">
                        <div className={`text-9xl font-bold tabular-nums leading-none tracking-tight mb-4 ${isActive ? 'animate-pulse' : ''}`}>
                            {formatTime()}
                        </div>
                        <div className="flex gap-3 justify-center mb-8">
                            {[...Array(timerSettings.sessionsPerCycle)].map((_, i) => (
                                <div 
                                    key={i}
                                    className={`w-4 h-4 rounded-full border ${
                                        i < completedPomodoros % timerSettings.sessionsPerCycle 
                                            ? theme === "minimal" 
                                                ? "bg-gray-600 border-gray-700" 
                                                : "bg-white border-white/50" 
                                            : theme === "minimal" 
                                                ? "bg-gray-300 border-gray-400"
                                                : "bg-white/20 border-white/30"
                                    }`}
                                ></div>
                            ))}
                        </div>
                        <div className="text-2xl font-semibold px-4 py-2 rounded-lg bg-white/10 inline-block">
                            {mode === "pomodoro" ? "Focus Time" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                        </div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex gap-4 w-full max-w-md">
                        <button
                            onClick={toggleTimer}
                            className="flex-1 py-6 px-8 rounded-2xl text-xl font-semibold cursor-pointer transition-all bg-white/25 hover:bg-white/40 shadow-lg"
                        >
                            {isActive ? "Pause" : "Start"}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="flex-1 py-6 px-8 rounded-2xl text-xl font-semibold cursor-pointer transition-all bg-white/15 hover:bg-white/25 shadow-lg"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Sessions: {completedPomodoros % timerSettings.sessionsPerCycle}/{timerSettings.sessionsPerCycle}</span>
                        <span className="text-xs opacity-70">(Cycle {Math.floor(completedPomodoros / timerSettings.sessionsPerCycle) + 1})</span>
                    </div>
                    <div className="flex bg-white/10 rounded-xl p-1">
                        <button
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                mode === "pomodoro"
                                    ? "bg-white/20 font-semibold"
                                    : ""
                            }`}
                            onClick={() => changeMode("pomodoro")}
                        >
                            Focus
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                mode === "shortBreak"
                                    ? "bg-white/20 font-semibold"
                                    : ""
                            }`}
                            onClick={() => changeMode("shortBreak")}
                        >
                            Short Break
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                mode === "longBreak"
                                    ? "bg-white/20 font-semibold"
                                    : ""
                            }`}
                            onClick={() => changeMode("longBreak")}
                        >
                            Long Break
                        </button>
                    </div>
                </div>
                
                {/* Settings Modal */}
                {showSettings && (
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={handleModalBackdropClick}
                    >
                        <div 
                            ref={modalContentRef}
                            className="bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-xl p-8 w-full max-w-md mx-4 backdrop-blur-sm"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Timer Settings</h2>
                            
                            <div className="space-y-6">
                                <div className="timer-setting">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium">
                                            Focus Duration
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="range" 
                                                min="1"
                                                max="60"
                                                value={customSettings.pomodoro}
                                                onChange={(e) => setCustomSettings({
                                                    ...customSettings, 
                                                    pomodoro: Number(e.target.value)
                                                })}
                                                className="w-32 accent-blue-600 dark:accent-blue-400"
                                            />
                                            <div className="w-12 text-center font-mono rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-white">
                                                {customSettings.pomodoro}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timer-setting">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium">
                                            Short Break
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="15" 
                                                value={customSettings.shortBreak}
                                                onChange={(e) => setCustomSettings({
                                                    ...customSettings, 
                                                    shortBreak: Number(e.target.value)
                                                })}
                                                className="w-32 accent-blue-600 dark:accent-blue-400"
                                            />
                                            <div className="w-12 text-center font-mono rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-white">
                                                {customSettings.shortBreak}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timer-setting">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium">
                                            Long Break
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="30" 
                                                value={customSettings.longBreak}
                                                onChange={(e) => setCustomSettings({
                                                    ...customSettings, 
                                                    longBreak: Number(e.target.value)
                                                })}
                                                className="w-32 accent-blue-600 dark:accent-blue-400"
                                            />
                                            <div className="w-12 text-center font-mono rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-white">
                                                {customSettings.longBreak}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timer-setting border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex flex-col mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium mb-3">
                                            Sessions Per Cycle
                                        </label>
                                        <div className="flex items-center justify-center">
                                            <div className="flex shadow-sm">
                                                <button 
                                                    onClick={() => setCustomSettings({
                                                        ...customSettings, 
                                                        sessionsPerCycle: Math.max(1, customSettings.sessionsPerCycle - 1)
                                                    })}
                                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-l-md text-gray-700 dark:text-gray-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    max="8"
                                                    value={customSettings.sessionsPerCycle}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (value >= 1 && value <= 8) {
                                                            setCustomSettings({
                                                                ...customSettings, 
                                                                sessionsPerCycle: value
                                                            });
                                                        }
                                                    }}
                                                    className="w-16 text-center font-mono rounded-none bg-gray-100 dark:bg-gray-700 border-x border-gray-300 dark:border-gray-600 py-2 text-sm text-gray-800 dark:text-white"
                                                />
                                                <button 
                                                    onClick={() => setCustomSettings({
                                                        ...customSettings, 
                                                        sessionsPerCycle: Math.min(8, customSettings.sessionsPerCycle + 1)
                                                    })}
                                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-r-md text-gray-700 dark:text-gray-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Number of focus sessions before a long break</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end space-x-3">
                                <button 
                                    onClick={() => setShowSettings(false)}
                                    className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => saveSettings(customSettings)}
                                    className={`px-5 py-2 text-white rounded-lg transition-colors ${
                                        theme === "synthwave"
                                            ? "bg-purple-600 hover:bg-purple-700"
                                            : theme === "cafe"
                                            ? "bg-amber-600 hover:bg-amber-700"
                                            : theme === "cosmic"
                                            ? "bg-blue-700 hover:bg-blue-800"
                                            : theme === "minimal"
                                            ? "bg-gray-600 hover:bg-gray-700"
                                            : theme === "lofi"
                                            ? "bg-slate-600 hover:bg-slate-700"
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help Modal */}
                <HelpModal 
                    isOpen={showHelp}
                    onClose={() => setShowHelp(false)}
                    theme={theme}
                />

                {/* Notification popup */}
                {showNotification && (
                    <div className="fixed top-5 right-5 left-5 mx-auto max-w-md bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-4 rounded-xl shadow-lg transform transition-transform duration-500 animate-bounce">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="font-medium">{notificationMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PomodoroFlow;