import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import TestcaseEditor from './TestcaseEditor';
import { executeCode } from '@/lib/actions';

function TestCase({code}:{code:string}) {
    const [activeTestCase, setActiveTestCase] = useState<string | null>(null);
     const handleTestCaseClick = (testCase: string) => {
        setActiveTestCase(testCase);
      };

      const [testcases, setTestcases] = useState([
        {
          TestCase: "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 7) == 0",
        },
        {
          TestCase: "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 1) == 0",
        },
        {
          TestCase: "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 4) == -1",
        },
        {
          TestCase: "arr = [1, 3, 5, 7, 9, 11, 13, 15]  \nassert binary_search(arr, 15) == 7",
        },
      ]);
      const [results, setResults] = useState<any[]>([]);

      const compileCode = async () => {
        const testResults = await executeCode(code, testcases); 
        setResults(testResults);
      };
    
  return (
    <div>
        <div className="flex space-x-4 justify-between">
              <div className="space-x-4">
                {["TestCase1", "TestCase2", "TestCase3", "TestCase4"].map((testCase) => (
                  <Button
                    key={testCase}
                    variant={activeTestCase === testCase ? "default" : "outline"}
                    onClick={() => handleTestCaseClick(testCase)}
                  >
                    {testCase}
                  </Button>
                ))}
              </div>
              <Button
                variant={"outline"}
                className="bg-green-300 dark:text-black"
                onClick={compileCode}
              >
                Run Code
              </Button>
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