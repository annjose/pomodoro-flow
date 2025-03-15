"use client";

import React, { useState, useEffect, useRef } from "react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSettings {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
}

const LofiPomodoro = () => {
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
    const [theme, setTheme] = useState<string>("sunset");

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
        const themes = ["sunset", "midnight", "forest", "ocean"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <div
            className={`min-h-screen flex justify-center items-center transition-colors duration-2000 ${
                theme === "sunset"
                    ? "bg-gradient-to-tr from-yellow-400 to-red-500 text-yellow-900"
                    : theme === "midnight"
                    ? "bg-gradient-to-tr from-purple-800 to-black text-white"
                    : theme === "forest"
                    ? "bg-gradient-to-tr from-green-600 to-green-900 text-green-100"
                    : "bg-gradient-to-tr from-blue-600 to-blue-900 text-blue-100"
            }`}
        >
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 shadow-lg w-11/12 max-w-md text-center">
                <h1 className="text-3xl font-bold tracking-tight m-0">
                    Lofi Pomodoro
                </h1>

                <div className="flex bg-white/10 rounded-2xl p-1 mt-6">
                    <button
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            mode === "pomodoro"
                                ? "bg-white/25 font-semibold"
                                : ""
                        }`}
                        onClick={() => changeMode("pomodoro")}
                    >
                        Focus
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            mode === "shortBreak"
                                ? "bg-white/25 font-semibold"
                                : ""
                        }`}
                        onClick={() => changeMode("shortBreak")}
                    >
                        Short Break
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            mode === "longBreak"
                                ? "bg-white/25 font-semibold"
                                : ""
                        }`}
                        onClick={() => changeMode("longBreak")}
                    >
                        Long Break
                    </button>
                </div>

                <div className="my-10 animate-pulse">
                    <div className="text-8xl font-bold tabular-nums leading-none tracking-tighter">
                        {formatTime()}
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={toggleTimer}
                        className="flex-1 py-4 px-5 rounded-2xl text-lg font-semibold cursor-pointer transition-all bg-white/40 hover:bg-white/50"
                    >
                        {isActive ? "Pause" : "Start"}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="flex-1 py-4 px-5 rounded-2xl text-lg font-semibold cursor-pointer transition-all bg-white/20 hover:bg-white/30"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span>Completed: {completedPomodoros}</span>
                    <button
                        onClick={cycleTheme}
                        className="bg-white/30 hover:bg-white/50 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Change Vibe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LofiPomodoro;
