import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import TestcaseEditor from "./TestcaseEditor";
import { executeCode } from "@/lib/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

function TestCase({
  code,
  data,
  socket,
  setShowEndModal,
  setVisibility,
}: {
  code: string;
  data: any;
  socket: Socket;
  setShowEndModal: React.Dispatch<
    React.SetStateAction<{ show: boolean; message: string }>
  >;
  setVisibility: (isVisible: boolean) => void;
}) {
  const [activeTestCase, setActiveTestCase] = useState<string | null>(null);
  const [codeRun, setCoderun] = useState<boolean>(false);
  const { user } = useUser();
  const { toast } = useToast();
  const [testcases, setTestcases] = useState([{ TestCase: "" }]);
  const [testcasesNames, setTestcasesNames] = useState<string[]>([]);
  const [testcasesStatuses, setTestcasesStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      //@ts-ignore
      const extractedTestcases = extractTestCases(
        data.content,
        data.codeSnippets[3]
      );
      setTestcases(extractedTestcases);
    }
  }, [data]);

  // Sync testcasesNames whenever testcases change
  useEffect(() => {
    setTestcasesNames(testcases.map((_, index) => `TestCase${index + 1}`));
  }, [testcases]); // Dependency on `testcases`

  function extractTestCases(
    content: string,
    codeInfo: { lang: string; langSlug: string; code: string }
  ): { TestCase: string }[] {
    const testCases: { TestCase: string }[] = [];

    // Function to decode HTML entities
    function decodeHtmlEntities(str: string): string {
      return str
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&");
    }

    // Regular expression to capture input-output pairs from examples
    const exampleRegex =
      /<pre>\s*<strong>Input:<\/strong>\s*([\s\S]*?)\s*<strong>Output:<\/strong>\s*([\s\S]*?)<\/pre>/g;

    // Extract function name from the given Python code
    const functionNameMatch = codeInfo.code.match(/def (\w+)\(/);
    const functionName = functionNameMatch ? functionNameMatch[1] : "solution";

    let match;
    while ((match = exampleRegex.exec(content)) !== null) {
      let inputRaw = match[1].trim();
      let outputRaw = match[2].trim();

      // Decode HTML entities
      inputRaw = decodeHtmlEntities(inputRaw);
      outputRaw = decodeHtmlEntities(outputRaw);

      // Remove any comments or explanations after the expected output
      outputRaw = outputRaw.split("\n")[0].trim();

      // Convert JavaScript-style `true` / `false` to Python `True` / `False`
      if (outputRaw.toLowerCase() === "true") outputRaw = "True";
      if (outputRaw.toLowerCase() === "false") outputRaw = "False";

      // Extract variables correctly while handling edge cases
      const inputVars: string[] = [];
      const inputRegex = /\b(\w+)\s*=\s*("[^"]*"|\d+)/g;
      let varMatch;
      while ((varMatch = inputRegex.exec(inputRaw)) !== null) {
        inputVars.push(varMatch[2]); // Extract variable values
      }

      // Generate the Python assertion for test cases
      const testCase = `assert Solution().${functionName}(${inputVars.join(
        ", "
      )}) == ${outputRaw}`;

      testCases.push({ TestCase: testCase });
    }

    return testCases;
  }

  function checkTestsPassed(results: any): boolean {
    if (results.length === 0) {
      return false;
    }

    for (const result of results) {
      if (result.status.id === 11) {
        return false;
      }

      if (result.stderr) {
        return false;
      }

      if (result.compile_output) {
        return false;
      }
    }

    return true;
  }

  const handleTestCaseClick = (testCase: string) => {
    setActiveTestCase(testCase);
  };

  const [results, setResults] = useState<any[]>([]);
  console.log(results);

  const submitCode = async () => {
    if (checkTestsPassed(results)) {
      console.log("All testcases passed");
      console.log(socket.id);
      socket.emit("passed", user?.id);
      setVisibility?.(true);
      setShowEndModal({ show: true, message: "You Won Congrats!" });
      return;
    }

    toast({
      title: "Error",
      description: "All testcases are not passed",
    });
  };

  const compileCode = async () => {
    setCoderun(true);
    const testResults = await executeCode(code, testcases);
    setResults(testResults);
    setTestcasesStatuses(
      testcases.map((_, index) => (testResults[index]?.stderr ? "❌" : "✅"))
    );
    console.log(testcasesNames);
    console.log(testcases);
    console.log(activeTestCase);
    setCoderun(false);
  };

  return (
    <div>
      <div className="flex space-x-4 justify-between max-lg:flex-col">
        <div className="space-x-4 max-lg:mb-2">
          {testcasesNames.map((testCase, index) => (
            <Button
              key={testCase}
              variant={activeTestCase === testCase ? "default" : "outline"}
              onClick={() => handleTestCaseClick(testCase)}
            >
              {`${testCase} ${testcasesStatuses[index] || ""}`}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"outline"}
                  className="bg-green-300 dark:text-black"
                  onClick={compileCode}
                  disabled={codeRun}
                >
                  Run Code
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run testcase</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => submitCode()}
                >
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
      {activeTestCase && (
        <div className="px-2">
          {results.length > 0 && (
            <p className="font-normal py-2">
              {results[parseInt(activeTestCase.slice(-1)) - 1]?.stderr ? (
                <span className="text-red-600 text-sm">{`Error: ${
                  results[parseInt(activeTestCase.slice(-1)) - 1].stderr
                }`}</span>
              ) : (
                "Passed"
              )}
            </p>
          )}
          <TestcaseEditor
            code={testcases[parseInt(activeTestCase.slice(-1)) - 1].TestCase}
          />
        </div>
      )}
    </div>
  );
}

export default TestCase;
