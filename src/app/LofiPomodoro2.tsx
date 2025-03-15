"use client";

import React, { useState, useEffect, useRef } from "react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSettings {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
}

const LofiPomodoro2: React.FC = () => {
    // Timer settings in minutes
    const timerSettings: TimerSettings = {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
    };

    const [mode, setMode] = useState<TimerMode>("pomodoro");
    const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [theme, setTheme] = useState<string>("minimal");

    // Sound effects
    const timerCompleteSound = useRef<HTMLAudioElement | null>(null);
    const buttonClickSound = useRef<HTMLAudioElement | null>(null);

    // Initialize audio on client side only
    useEffect(() => {
        // Click sound by dersuperanton -- https://freesound.org/s/433641/ -- License: Attribution 4.0
        buttonClickSound.current = new Audio("/sounds/click.wav");
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

                // After 4 pomodoros, take a long break
                if ((completedPomodoros + 1) % 4 === 0) {
                    setMode("longBreak");
                    setTimeLeft(timerSettings.longBreak * 60);
                } else {
                    setMode("shortBreak");
                    setTimeLeft(timerSettings.shortBreak * 60);
                }
            } else {
                // After break, switch back to pomodoro
                setMode("pomodoro");
                setTimeLeft(timerSettings.pomodoro * 60);
            }

            setIsActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, completedPomodoros, timerSettings]);

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
        setIsActive(false);
        setMode(newMode);

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
        const themes = ["minimal", "nightcity", "vintage", "pastel"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
        buttonClickSound.current?.play();
    };

    // Theme styles
    const themeStyles = {
        minimal: "bg-zinc-900 text-zinc-100",
        nightcity: "bg-indigo-950 text-pink-200",
        vintage: "bg-amber-100 text-amber-900",
        pastel: "bg-pink-100 text-purple-900",
    };

    const cardStyles = {
        minimal: "bg-zinc-800 border border-zinc-700",
        nightcity: "bg-indigo-900 border border-purple-500",
        vintage: "bg-amber-50 border border-amber-200",
        pastel: "bg-white border border-pink-200",
    };

    const buttonPrimaryStyles = {
        minimal: "bg-teal-600 hover:bg-teal-500 text-white",
        nightcity: "bg-pink-500 hover:bg-pink-400 text-white",
        vintage: "bg-amber-700 hover:bg-amber-600 text-amber-50",
        pastel: "bg-purple-500 hover:bg-purple-400 text-white",
    };

    const buttonSecondaryStyles = {
        minimal: "bg-zinc-700 hover:bg-zinc-600 text-zinc-200",
        nightcity: "bg-indigo-800 hover:bg-indigo-700 text-pink-200",
        vintage: "bg-amber-200 hover:bg-amber-300 text-amber-900",
        pastel: "bg-pink-200 hover:bg-pink-300 text-purple-900",
    };

    const themeButtonStyles = {
        minimal: "bg-zinc-700 hover:bg-zinc-600 border border-teal-500",
        nightcity: "bg-indigo-800 hover:bg-indigo-700 border border-pink-500",
        vintage: "bg-amber-200 hover:bg-amber-300 border border-amber-500",
        pastel: "bg-pink-300 hover:bg-pink-400 border border-purple-300",
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-1000 ${
                themeStyles[theme as keyof typeof themeStyles]
            }`}
        >
            <div
                className={`max-w-md w-full mx-auto rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ${
                    cardStyles[theme as keyof typeof cardStyles]
                }`}
            >
                <div className="px-6 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-light tracking-wide">
                            pomodoro
                        </h1>
                        <button
                            onClick={cycleTheme}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                themeButtonStyles[
                                    theme as keyof typeof themeButtonStyles
                                ]
                            }`}
                        >
                            Change Vibe
                        </button>
                    </div>

                    <div className="flex justify-center mb-10">
                        <div
                            className={`inline-flex rounded-full p-1 ${
                                buttonSecondaryStyles[
                                    theme as keyof typeof buttonSecondaryStyles
                                ]
                            }`}
                        >
                            <button
                                className={`px-5 py-2 rounded-full text-sm transition-all ${
                                    mode === "pomodoro"
                                        ? buttonPrimaryStyles[
                                              theme as keyof typeof buttonPrimaryStyles
                                          ]
                                        : "bg-transparent"
                                }`}
                                onClick={() => changeMode("pomodoro")}
                            >
                                Focus
                            </button>
                            <button
                                className={`px-5 py-2 rounded-full text-sm transition-all ${
                                    mode === "shortBreak"
                                        ? buttonPrimaryStyles[
                                              theme as keyof typeof buttonPrimaryStyles
                                          ]
                                        : "bg-transparent"
                                }`}
                                onClick={() => changeMode("shortBreak")}
                            >
                                Short Break
                            </button>
                            <button
                                className={`px-5 py-2 rounded-full text-sm transition-all ${
                                    mode === "longBreak"
                                        ? buttonPrimaryStyles[
                                              theme as keyof typeof buttonPrimaryStyles
                                          ]
                                        : "bg-transparent"
                                }`}
                                onClick={() => changeMode("longBreak")}
                            >
                                Long Break
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="text-7xl font-light tabular-nums">
                            {formatTime()}
                        </div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <button
                            onClick={toggleTimer}
                            className={`px-12 py-4 rounded-full text-lg uppercase tracking-widest font-semibold transition-all transform hover:scale-105 ${
                                buttonPrimaryStyles[
                                    theme as keyof typeof buttonPrimaryStyles
                                ]
                            }`}
                        >
                            {isActive ? "Pause" : "Start"}
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Session</span>
                            <span
                                className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs ${
                                    buttonPrimaryStyles[
                                        theme as keyof typeof buttonPrimaryStyles
                                    ]
                                }`}
                            >
                                {completedPomodoros + 1}
                            </span>
                            <span className="text-sm">/ 4</span>
                        </div>

                        <button
                            onClick={resetTimer}
                            className={`px-3 py-1 rounded text-xs transition-all ${
                                buttonSecondaryStyles[
                                    theme as keyof typeof buttonSecondaryStyles
                                ]
                            }`}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-sm opacity-60 max-w-md text-center">
                {theme === "minimal" &&
                    "Minimal theme - Simple, clean, distraction-free."}
                {theme === "nightcity" &&
                    "Night City theme - Focus in the glow of neon lights."}
                {theme === "vintage" &&
                    "Vintage theme - Old-school warmth for your workflow."}
                {theme === "pastel" &&
                    "Pastel theme - Soft colors for a gentle vibe."}
            </div>
        </div>
    );
};

export default LofiPomodoro2;
