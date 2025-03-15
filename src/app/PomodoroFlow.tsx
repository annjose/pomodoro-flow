"use client";

import React, { useState, useEffect, useRef } from "react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSettings {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
}

const PomodoroFlow = () => {
    // Check for debug mode from query parameter
    const [isDebugMode, setIsDebugMode] = useState(false);
    
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
    
    // Timer settings in minutes
    const timerSettings: TimerSettings = {
        pomodoro: isDebugMode ? 0.5 : 25, // 30 seconds in debug mode, 25 minutes normally
        shortBreak: isDebugMode ? 1/6 : 5, // 10 seconds in debug mode, 5 minutes normally
        longBreak: isDebugMode ? 0.25 : 15, // 15 seconds in debug mode, 15 minutes normally
    };

    const [mode, setMode] = useState<TimerMode>("pomodoro");
    const [timeLeft, setTimeLeft] = useState(0); // Start with 0 and let the useEffect set it correctly
    const [isActive, setIsActive] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [theme, setTheme] = useState<string>("minimal");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    // Sound effects
    const timerCompleteSound = useRef<HTMLAudioElement | null>(null);
    const buttonClickSound = useRef<HTMLAudioElement | null>(null);

    // Initialize audio on client side only
    useEffect(() => {
        // Click sound by dersuperanton -- https://freesound.org/s/433641/ -- License: Attribution 4.0
        // tada2.wav by jobro -- https://freesound.org/s/60444/ -- License: Attribution 3.0
        timerCompleteSound.current = new Audio("/sounds/complete.wav");
        buttonClickSound.current = new Audio("/sounds/click.wav");
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
                
                // Display notification
                setNotificationMessage("Focus session complete! Time for a break.");
                setShowNotification(true);
                
                // Request browser notification if supported
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Pomodoro Flow", {
                        body: "Focus session complete! Time for a break.",
                        icon: "/favicon.ico"
                    });
                }

                // After 4 pomodoros, take a long break
                if ((completedPomodoros + 1) % 4 === 0) {
                    setMode("longBreak");
                    setTimeLeft(timerSettings.longBreak * 60);
                } else {
                    setMode("shortBreak");
                    setTimeLeft(timerSettings.shortBreak * 60);
                }
            } else {
                // Display notification for break completion
                setNotificationMessage("Break time over! Ready to focus again?");
                setShowNotification(true);
                
                // Request browser notification if supported
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Pomodoro Flow", {
                        body: "Break time over! Ready to focus again?",
                        icon: "/favicon.ico"
                    });
                }
                
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
    
    // Request notification permission on component mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

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
    }, [timerSettings, mode, isDebugMode]);

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
        buttonClickSound.current?.play();
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
        buttonClickSound.current?.play();
        setIsActive(!isActive);
    };

    // Reset timer
    const resetTimer = () => {
        buttonClickSound.current?.play();
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
                        <span className="text-xs opacity-60 italic">
                            {theme.charAt(0).toUpperCase() + theme.slice(1)} vibe
                        </span>
                        <button
                            onClick={cycleTheme}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Change Vibe
                        </button>
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
                            {[...Array(4)].map((_, i) => (
                                <div 
                                    key={i}
                                    className={`w-4 h-4 rounded-full ${i < completedPomodoros % 4 ? 'bg-white' : 'bg-white/20'}`}
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
                    <div className="flex items-center gap-3">
                        <span className="font-medium">Total: {completedPomodoros}</span>
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