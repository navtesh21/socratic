import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import TestcaseEditor from './TestcaseEditor';
import { executeCode } from '@/lib/actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


function TestCase({code,data}:{code:string,data:string}) {
    const [activeTestCase, setActiveTestCase] = useState<string | null>(null);
    const [codeRun, setCoderun] = useState<boolean>(false);
    

    const [testcases, setTestcases] = useState([{ TestCase: "" }]);
    const [testcasesNames, setTestcasesNames] = useState<string[]>([]);
    
    useEffect(() => {
      if (data) {
        //@ts-ignore
        const extractedTestcases = extractTestCases(data.content, data.codeSnippets[3]);
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
      const exampleRegex = /<pre>[\s\S]*?<strong>Input:<\/strong>\s*([\s\S]*?)\s*<strong>Output:<\/strong>\s*([\s\S]*?)<\/pre>/g;
    
      // Extract function name from the given Python code
      const functionNameMatch = codeInfo.code.match(/def (\w+)\(/);
      const functionName = functionNameMatch ? functionNameMatch[1] : "solution";
    
      let match;
      while ((match = exampleRegex.exec(content)) !== null) {
        let inputRaw = match[1].trim();
        let outputRaw = match[2].trim();
    
        // Remove any additional text after the output value (like explanations)
        outputRaw = outputRaw.split("\n")[0].trim(); // Keep only the first line
    
        // Convert JavaScript-style `true` / `false` to Python `True` / `False`
        if (outputRaw.toLowerCase() === "true") outputRaw = "True";
        if (outputRaw.toLowerCase() === "false") outputRaw = "False";
    
        // Extract the actual function argument
        const inputMatch = inputRaw.match(/= (.*)$/);
        const inputValue = inputMatch ? inputMatch[1].trim() : inputRaw;
    
        // Generate the correct Python assertion for test cases
        const testCase = `assert Solution().${functionName}(${inputValue}) == ${outputRaw}`;
        testCases.push({ TestCase: testCase });
      }
    
      return testCases;
    }
    
    
     const handleTestCaseClick = (testCase: string) => {
        setActiveTestCase(testCase);
      };

      const [results, setResults] = useState<any[]>([]);
      console.log(results)

      const compileCode = async () => {
        setCoderun(true);
        const testResults = await executeCode(code, testcases); 
        setResults(testResults);
        setTestcasesNames(testcasesNames.map((_, index) => `TestCase${index + 1} ${testResults[index]?.stderr ? "❌" : "✅"}`));
        setCoderun(false);
      };
    
  return (
    <div>
        <div className="flex space-x-4 justify-between">
              <div className="space-x-4">
                {testcasesNames.map((testCase) => (
                  <Button
                    key={testCase}
                    variant={activeTestCase === testCase ? "default" : "outline"}
                    onClick={() => handleTestCaseClick(testCase)}
                  >
                    {testCase}
                  </Button>
                ))}
              </div>
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
  )
}

export default TestCase