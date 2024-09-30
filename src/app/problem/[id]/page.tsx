"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeEditorWindow from "../components/Editor";
import Chat from "../components/Chat";
import { executeCode } from "@/lib/actions";
import TestcaseEditor from "../components/TestcaseEditor";

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

export default function Component() {
  const [activeTestCase, setActiveTestCase] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [testcases, setTestcases] = useState([
    { TestCase: "console.log('madarchod')" },
    { TestCase: "console.log('madrid')" },
    { TestCase: "console.log('hello')" },
    { TestCase: "console.log('hello')" },
  ]);
  const [results, setResults] = useState<result[] | []>([]);

  const handleTestCaseClick = (testCase: string) => {
    setActiveTestCase(testCase);
    // Here you would typically load the test case data
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
    <div className="flex h-screen">
      {/* Problem Description Section */}
      <div className="w-[40%] p-6 bg-background overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Problem Title</h1>
        <p className="mb-4">
          This is where the problem description and any related information
          would go. You can provide details about the challenge, constraints,
          and examples here.
        </p>
        {/* Add more content as needed */}
      </div>

      {/* Code Editor and Test Cases Section */}
      <div className="w-[60%] flex flex-col bg-muted">
        <div className="flex-grow p-6">
          <div className="bg-background border rounded-md h-full p-4 flex-col flex">
            <CodeEditorWindow onChange={onChange} code={code} />

            <div className="flex space-x-4 mb-8 justify-between">
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
              <div className=" p-2">
                <h2 className="font-semibold pb-2">{activeTestCase}</h2>
                {results.length > 0 && (
                  <p className="font-normal py-2">
                    <span className="font-bold"> Output:</span>{" "}
                     {results[parseInt(activeTestCase.slice(-1)) - 1]?.stdout}
                  </p>
                )}
                <TestcaseEditor
                  code={
                    testcases[parseInt(activeTestCase.slice(-1)) - 1].TestCase
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Chat />
    </div>
  );
}
