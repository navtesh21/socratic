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
// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// const Problems: React.FC = () => {
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch("https://socratic-backend.onrender.com/getDailyQuestions");
//         const data: ApiResponse = await response.json();
        
//         if (!data.success) {
//           throw new Error("Failed to fetch problems");
//         }
        
//         setProblems(data.data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProblems();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 p-4">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//         🧩 Coding Challenges
//       </h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {problems.map((problem) => (
//           <Link
//             key={problem.questionId}
//             href={`/createChallenge?slug=${problem.titleSlug}`}
//             target="_blank"
//             className="group transform transition-all hover:-translate-y-1 focus:outline-none"
//           >
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
//               <div className="p-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="text-2xl">
//                     {difficultyConfig[problem.difficulty]?.emoji || "📝"}
//                   </span>
//                   <span className={`text-sm font-semibold ${difficultyConfig[problem.difficulty]?.color}`}>
//                     {problem.difficulty}
//                   </span>
//                   {problem.isPaidOnly && <span className="text-yellow-500">👑</span>}
//                 </div>
                
//                 <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
//                   {problem.title}
//                 </h3>
                
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   <span className={`px-3 py-1 rounded-full text-xs ${difficultyConfig[problem.difficulty]?.bgColor} ${difficultyConfig[problem.difficulty]?.color}`}>
//                     Success Rate: {Math.round(problem.acRate)}%
//                   </span>
//                   <span className="px-3 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
//                     #{problem.frontendQuestionId}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Problems;


import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Problem;
    direction: 'asc' | 'desc';
  }>({ key: 'frontendQuestionId', direction: 'asc' });

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

  const sortProblems = (key: keyof Problem) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedProblems = [...problems].sort((a, b) => {
      if (key === 'frontendQuestionId') {
        return direction === 'asc' 
          ? parseInt(a[key]) - parseInt(b[key])
          : parseInt(b[key]) - parseInt(a[key]);
      }
      const difficultyOrder: Record<string, number> = {
        Easy: 1,
        Medium: 2,
        Hard: 3
      };
      
      if (key === "difficulty") {
        return (difficultyOrder[a[key] as string] - difficultyOrder[b[key] as string]) * (direction === 'asc' ? 1 : -1);
      } else {
        if ((a[key] as number | string) < (b[key] as number | string)) return direction === 'asc' ? -1 : 1;
        if ((a[key] as number | string) > (b[key] as number | string)) return direction === 'asc' ? 1 : -1;
      }
      
      if ((a[key] as number | string) < (b[key] as number | string)) 
        return direction === 'asc' ? -1 : 1;

      if ((a[key] as number | string) > (b[key] as number | string)) 
        return direction === 'asc' ? 1 : -1;

      
      return 0;
    });

    setProblems(sortedProblems);
  };

  const renderSortIcon = (key: keyof Problem) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 
  text-gray-900 dark:text-white leading-tight tracking-wide">
  Try some <span className="text-blue-600 dark:text-blue-400">famous Leetcode Problems </span> 
  as <span className="text-blue-600 dark:text-blue-400">contests!</span> 
</h1>

      
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => sortProblems('frontendQuestionId')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                    #
                  </span>
                  {renderSortIcon('frontendQuestionId')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => sortProblems('title')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                    Title
                  </span>
                  {renderSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => sortProblems('difficulty')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                    Difficulty
                  </span>
                  {renderSortIcon('difficulty')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => sortProblems('acRate')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                    Success Rate
                  </span>
                  {renderSortIcon('acRate')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {problems.map((problem) => (
              <tr 
                key={problem.questionId}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {problem.frontendQuestionId}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/createChallenge?slug=${problem.titleSlug}`}
                    className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white hover:underline transition"
                  >
                    {problem.title}
                    {problem.isPaidOnly && <span className="ml-2 text-yellow-500">👑</span>}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    difficultyConfig[problem.difficulty].bgColor
                  } ${difficultyConfig[problem.difficulty].color}`}>
                    {difficultyConfig[problem.difficulty].emoji} {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(problem.acRate)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Divider Section */}
      <div className="relative flex items-center gap-4 py-12">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <span className="flex-shrink-0 text-gray-500 dark:text-gray-400 text-3xl font-medium">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>

      {/* New CTA Section */}
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        {/* <Link
          href="/createChallenge"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative rounded-md bg-white px-8 py-4 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900 text-base md:text-lg">
            <span className="relative inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-white group-hover:text-white">
              Create a Contest from Any LeetCode Problem
              <svg 
                className="h-5 w-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </span>
        </Link> */}
        <Link
  href="/createChallenge"
  className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-100 px-4 py-3 text-xl font-semibold font-medium text-blue-800 transition-colors hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20"
>
  Create a Contest from Any LeetCode Problem
  <svg
    className="h-5 w-5 transition-transform group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
</Link>

        <p className="text-lg text-gray-500 dark:text-gray-400 text-center max-w-lg">
          Want to create a contest from a different LeetCode problem? 
          Choose any problem and turn it into an exciting coding challenge!
        </p>
      </div>


    </div>
  );
};

export default Problems;