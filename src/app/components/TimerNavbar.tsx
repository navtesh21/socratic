"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Code, User, Trophy } from "lucide-react";

interface ChallengeHeaderBarProps {
  totalTime: number; // in seconds
  challengeName: string;
  userName: string;
  timeLimit: number;
  setVisibility?: (isVisible: boolean) => void;
}

export default function ChallengeHeaderBar({
  totalTime,
  challengeName,
  userName,
  timeLimit,
  setVisibility
}: ChallengeHeaderBarProps) {
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  useEffect(() => {
    setTimeRemaining(totalTime);
  }, [totalTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          {/* Left Section - Challenge Name */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Code className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-base sm:text-lg font-semibold">{challengeName}</span>
          </div>

          {/* Right Section - User, Time & Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* User */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">{userName}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-lg font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Best of Luck Button */}
            <Button variant="outline" className="text-xs sm:text-sm flex items-center px-2 sm:px-4 py-1" onClick={() => 
              {
                setVisibility?.(true)
                setTimeout(() => {
                  setVisibility?.(false)
                }, 10000)
              }
              
             }>
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Best of Luck!
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="mt-2 w-full" />
      </div>
    </div>
  );
}
