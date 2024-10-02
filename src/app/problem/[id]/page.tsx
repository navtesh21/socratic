"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-screen mt-10">
      {/* Problem Description Section */}
      <div className="w-[40%] p-6 bg-background overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Problem Title</h1>
        <p className="mb-4">
          This is where the problem description and any related information
          would go. You can provide details about the challenge, constraints,
          and examples here.
        </p>
      </div>

      {/* Code Editor and Test Cases Section */}
      <div className="w-[60%] flex flex-col bg-muted">
        <div className="flex-grow p-6">
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
              <div className=" p-2">
                <h2 className="font-semibold pb-2">{activeTestCase}</h2>
                {results.length > 0 && (
                  <p className="font-normal py-2">
                    <span className="font-bold"> Testcase:</span>{" "}
                    {results[parseInt(activeTestCase.slice(-1)) - 1]?.stderr ? (
                      <p className="text-red-600 text-sm">{`Failed,\nError:${
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
              </div>
            )}
          </div>
        </div>
      </div>

      <Chat />
    </div>
  );
}
