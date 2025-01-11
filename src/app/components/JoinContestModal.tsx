"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Socket } from "socket.io-client";

interface ChallengeJoinModalProps {
  challengeName: string;
  timeLimit: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  contestId: string;
  userId: string | undefined;
  socket:Socket
}

export default function ChallengeJoinModal({
  challengeName,
  timeLimit,
  isOpen,
  setIsOpen,
  contestId,
  userId,
  socket
}: ChallengeJoinModalProps) {
  const [error, setError] = useState<string | null>(null);
  
  const handleJoin = async () => {
    if (!userId) {
      setError("Please login to join the challenge");
      return;
    }
    const data = await axios.post(`${process.env.URL ||"https://socratic-backend.onrender.com"}/joinQuest`, {
     questId: contestId,
      userId,
    });

    if (data.data.status != 200) {
      setError(data.data.message);
      return;
    }

    localStorage.setItem(contestId, "true");
    setIsOpen(false);
    socket.emit("startTimer",timeLimit)
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <p className="text-xl text-muted-foreground text-red-600">{error}</p>

          <DialogTitle>Join Challenge: {challengeName}</DialogTitle>
          <DialogDescription>
            Please review the challenge details before joining.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="font-medium">Time Limit: {timeLimit} minutes</div>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              As soon as you click the &quot;Start Challenge&quot; button, the
              timer will begin, and the challenge will start immediately.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            Make sure you&apos;re ready to begin the challenge before clicking
            the button. You won&apos;t be able to pause the timer once it
            starts.
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleJoin}>Join Challenge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
