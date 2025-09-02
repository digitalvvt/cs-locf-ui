"use client";
import { useEffect, useState } from "react";

interface TimerProps {
  examTime: number; // Total exam time in minutes or questions count
  onTimeUp: () => void;
  onTimeUpdate?: (timeLeft: number) => void;
  className?: string; // optional external className
}

const Timer = ({ examTime, onTimeUp, onTimeUpdate, className = "" }: TimerProps) => {
  // Assuming 2 minutes per question for total time calculation
  const totalTimeInSeconds = examTime * 60;

  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / totalTimeInSeconds) * 100;
    if (percentage <= 10) return "text-red-500";
    if (percentage <= 25) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className={`bg-white dark:bg-[#0E0E0E] rounded-lg border p-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Time Remaining</h3>
        <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {Math.floor((timeLeft / totalTimeInSeconds) * 100)}% remaining
        </div>
      </div>
    </div>
  );
};

export default Timer;
