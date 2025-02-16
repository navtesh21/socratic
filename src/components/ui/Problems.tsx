// types.ts
interface Problem {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acRate: number;
  status: string | null;
  frontendQuestionId: string;
  isPaidOnly: boolean;
}

interface ApiResponse {
  success: boolean;
  metadata: {
    date: string;
    offset: number;
    total_questions: number;
  };
  data: Problem[];
}

// difficultyConfig.ts
type DifficultyConfig = {
  [key in 'Easy' | 'Medium' | 'Hard']: {
    emoji: string;
    color: string;
    bgColor: string;
  };
};

const difficultyConfig: DifficultyConfig = {
  Easy: { 
    emoji: "🌱", 
    color: "text-emerald-500", 
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20" 
  },
  Medium: { 
    emoji: "🔥", 
    color: "text-amber-500", 
    bgColor: "bg-amber-50 dark:bg-amber-900/20" 
  },
  Hard: { 
    emoji: "⚡", 
    color: "text-red-500", 
    bgColor: "bg-red-50 dark:bg-red-900/20" 
  }
};

// Problems.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://socratic-backend.onrender.com/getDailyQuestions");
        const data: ApiResponse = await response.json();
        
        if (!data.success) {
          throw new Error("Failed to fetch problems");
        }
        
        setProblems(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        🧩 Coding Challenges
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <Link
            key={problem.questionId}
            href={`/createChallenge?slug=${problem.titleSlug}`}
            target="_blank"
            className="group transform transition-all hover:-translate-y-1 focus:outline-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {difficultyConfig[problem.difficulty]?.emoji || "📝"}
                  </span>
                  <span className={`text-sm font-semibold ${difficultyConfig[problem.difficulty]?.color}`}>
                    {problem.difficulty}
                  </span>
                  {problem.isPaidOnly && <span className="text-yellow-500">👑</span>}
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {problem.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${difficultyConfig[problem.difficulty]?.bgColor} ${difficultyConfig[problem.difficulty]?.color}`}>
                    Success Rate: {Math.round(problem.acRate)}%
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    #{problem.frontendQuestionId}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Problems;