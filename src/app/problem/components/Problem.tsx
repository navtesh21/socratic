import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, BookOpen, Code2, FileText } from "lucide-react";
import React from "react";

function Problem() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center">
          <BookOpen className="mr-2 h-8 w-8 text-primary" />
          Problem Title
        </h1>
        <p className="text-muted-foreground">
          Difficulty: Medium | Time Limit: 1 second
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Problem Statement
        </h2>
        <p>
          This is where the detailed problem statement would go. You can provide
          a comprehensive description of the challenge, including any background
          information, constraints, and the specific task that needs to be
          accomplished.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <AlertCircle className="mr-2 h-6 w-6 text-primary" />
          Constraints
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>1 ≤ N ≤ 10^5</li>
          <li>1 ≤ A[i] ≤ 10^9</li>
          <li>Time Limit: 1 second</li>
          <li>Memory Limit: 256 MB</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <Code2 className="mr-2 h-6 w-6 text-primary" />
          Sample Input/Output
        </h2>
        <div className="bg-muted p-4 rounded-md">
          <p className="font-semibold">Input:</p>
          <pre className="mt-2">5 1 2 3 4 5</pre>
          <p className="font-semibold mt-4">Output:</p>
          <pre className="mt-2">15</pre>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Explanation</h2>
        <p>
          Here you can provide a detailed explanation of the sample
          input/output, walking through the solution process step-by-step to
          help users understand how to approach the problem.
        </p>
      </div>
    </div>
  );
}

export default Problem;
