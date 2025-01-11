"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CodeEditorWindow from "../../components/Editor";
import Chat from "../../components/Chat";
import { executeCode } from "@/lib/actions";
import TestcaseEditor from "../../components/TestcaseEditor";
import Problem from "../../components/Problem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import getSocket from "@/lib/socket";

interface result {
  stdout: string;
  time: string;
  memory: number;
  stderr: null;
  token: string;
  compile_output: null;
  message: null;
  status: { id: number; description: string };
}

export default function Component({ params }: { params: { id: string } }) {
  const data = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await axios.post("/api/problem", { slug: params.id });

        const response = await res.data;
        return response;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  let socket = useMemo(() => {
    const socketInstance = getSocket();
    return socketInstance;
  }, []);

  // socket instance
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      console.log(data, "message");
    });

    return () => {
      socket.close();
    };
  }, []);

  const [activeTestCase, setActiveTestCase] = useState<string | null>(null);
  const [code, setCode] = useState(data.data?.codeSnippets[3].code || "");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [testcases, setTestcases] = useState([
    {
      TestCase:
        "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 7) == 0 ",
    },
    {
      TestCase:
        "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 1) == 0",
    },
    {
      TestCase:
        "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 4) == -1",
    },
    {
      TestCase:
        "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 15) == 7",
    },
  ]);
  const [results, setResults] = useState<result[] | []>([]);

  const handleTestCaseClick = (testCase: string) => {
    setActiveTestCase(testCase);
  };

  const compileCode = async () => {
    const testResults = await executeCode(code, testcases);

    setResults(testResults);
  };

  console.log(results);
  const onChange = (data: string | undefined) => {
    setCode(data || "");
    console.log(code);
  };

  return (
    <div className="flex h-screen mt-16">
      {/* Problem Description Section */}
      <ScrollArea className="h-[90vh] overflow-y-auto w-[45%]  m-1">
        <div className="p-4 bg-background ">
          {" "}
          <Problem data={data.data} />
        </div>
      </ScrollArea>

      {/* Code Editor and Test Cases Section */}
      <div className="w-[55%] flex flex-col bg-muted h-full">
        <div className="flex-grow p-3">
          <div className="bg-background border rounded-md p-4 flex-col flex gap-4">
            <CodeEditorWindow onChange={onChange} code={code} />

            <div className="flex space-x-4 justify-between">
              <div className="space-x-4">
                {["TestCase1", "TestCase2", "TestCase3", "TestCase4"].map(
                  (testCase) => (
                    <Button
                      key={testCase}
                      variant={
                        activeTestCase === testCase ? "default" : "outline"
                      }
                      onClick={() => handleTestCaseClick(testCase)}
                    >
                      {testCase}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant={"outline"}
                className="bg-green-300"
                onClick={compileCode}
              >
                Run Code
              </Button>
            </div>
            {activeTestCase && (
              <div className=" px-2">
                {results.length > 0 && (
                  <p className="font-normal py-2">
                    {results[parseInt(activeTestCase.slice(-1)) - 1]?.stderr ? (
                      <p className="text-red-600 text-sm">{`Error:${
                        results[parseInt(activeTestCase.slice(-1)) - 1].stderr
                      }`}</p>
                    ) : (
                      "Passed"
                    )}
                  </p>
                )}
                <TestcaseEditor
                  code={
                    testcases[parseInt(activeTestCase.slice(-1)) - 1].TestCase
                  }
                />
                <button
                  onClick={() => {
                    if (socket.connected) {
                      socket.emit("message", "Hello from client");
                      console.log("Socket ID:", socket.id);
                    } else {
                      console.log("Socket is not connected");
                    }
                  }}
                >
                  {" "}
                  click
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Chat />
    </div>
  );
}
