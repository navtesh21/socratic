"use client";

import Chat from "@/app/components/Chat";
import CodeEditorWindow from "@/app/components/Editor";
import ChallengeJoinModal from "@/app/components/JoinContestModal";
import Problem from "@/app/components/Problem";
import TestCase from "@/app/components/TestCase";
import TimerNavbar from "@/app/components/TimerNavbar"

import { ScrollArea } from "@/components/ui/scroll-area";
import getSocket from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { timeStamp } from "console";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

function Page({ params }: { params: { id: string } }) {
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const { user, isLoaded } = useUser();

  const [time,settime] = useState<number| undefined>(undefined)
  const [code, setCode] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const socket = useMemo(() => {
    const socketInstance = getSocket();
    socketInstance.auth = { token: params.id };
    return socketInstance;
  }, []);

  const data = useQuery({
    queryKey: ["problem"],
    queryFn: async () => {
      try {
        const res = await axios.post("/api/problem", { contestId: params.id });
        const response = await res.data;
        console.log(response);
        return response;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
      setSocketId(socket.id);
    });

    socket.on("timerUpdate", (data: string) => {
      settime(parseInt(data))
    });

    socket.on("timerComplete",() => {
      alert("time ended")
    })

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [socket]);

  useEffect(() => {
    if (!localStorage.getItem(params.id)) {
      setShowModal(true);
    }
  }, []);



  useEffect(() => {
    if (data.data?.codeSnippets) {
      const newCode = data.data.codeSnippets[3]?.code;
      setCode(newCode);
    }
  }, [data.data]);

  const onChange = (data: string | undefined) => {
    setCode(data || "");
    console.log(data);
  };
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen mt-16">
      {/* Problem Description Section */}
      {!showModal && <TimerNavbar totalTime={time!} challengeName={data.data?.title} userName="navtesh" timeLimit={parseInt(data.data?.time_limit) * 60} />}
      <ChallengeJoinModal
        challengeName={data.data?.title}
        timeLimit={data.data?.time_limit}
        isOpen={showModal}
        setIsOpen={setShowModal}
        contestId={params.id}
        userId={user?.id}
        socket = {socket}
      />
      <ScrollArea className="h-[90vh] overflow-y-auto w-[45%] m-1">
        <div className="p-4 bg-background">
          <Problem data={data.data} />
        </div>
      </ScrollArea>

      {/* Code Editor and Test Cases Section */}
      <div className="w-[55%] flex flex-col bg-muted h-full">
        <div className="flex-grow p-3">
          <div className="bg-background border rounded-md p-4 flex-col flex gap-4">
            <CodeEditorWindow onChange={onChange} code={code} />

            <TestCase code={code} />
          </div>
        </div>
      </div>

      <Chat />
    </div>
  );
}

export default Page;
