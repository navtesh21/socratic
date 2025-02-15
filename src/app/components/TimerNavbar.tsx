"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Code, User, Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChallengeHeaderBarProps {
  totalTime: number; // in seconds
  challengeName: string;
  userName: string;
  timeLimit: number;
}

export default function ChallengeHeaderBar({
  totalTime,
  challengeName,
  userName,
  timeLimit,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Code className="h-6 w-6" />
            <span className="text-lg font-semibold">{challengeName}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{userName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-xl font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Submit
                  </Button>
                  
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pass all the testcases to submit the problem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Progress value={progressPercentage} className="mt-2" />
      </div>
    </div>
  );
}
