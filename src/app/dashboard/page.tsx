"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Users, Trophy, Code } from 'lucide-react'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useUser } from "@clerk/nextjs"

interface Participant {
  id: string;
  questId: string;
  userId: string;
  created_at: string;
}

interface Quest {
  id: string;
  creatorId: string;
  created_at: string;
  question_slug: string;
  time_limit: string;
  ended: boolean;
  winnerId: string | null;
  winner: string | null;
  Participant: Participant[];
  isCreator: boolean;
  isParticipant: boolean;
  totalParticipants: number;
  hasWon: boolean;
}

interface QuestSummary {
  total: number;
  created: number;
  participated: number;
  won: number;
}

interface QuestResponse {
  quests: Quest[];
  summary: QuestSummary;
}

export default function UserContestsPage() {
    const { user } = useUser();

    const { data, isLoading, error } = useQuery<QuestResponse>({
        queryKey: ["Quest", user?.id],
        queryFn: async () => {
          if (!user?.id) throw new Error("User not authenticated");
          
          const res = await axios.post(`https://socratic-backend.onrender.com/getQuests`, {
            userId: user.id
          });
          return res.data.data;
        },
        enabled: !!user?.id
    });

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const getEmoji = (slug: string) => {
      const emojiMap: { [key: string]: string } = {
        'sqrtx': '🧮',
        'two-sum': '➕',
        'palindrome-number': '🔄',
        'reverse-integer': '🔢',
        'regular-expression-matching': '🔍',
        'median-of-two-sorted-arrays': '📊',
        '3sum-closest': '🎯',
      }
      return emojiMap[slug] || '❓'
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p>Error loading quests. Please try again later.</p>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <p className="text-gray-500">No quests found.</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-11">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Coding Quests 🚀
            </h1>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {data.summary.total} Total Quests
            </Badge>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-violet-600 dark:text-violet-400">Total Quests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall challenges</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400">Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.created}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your challenges</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600 dark:text-blue-400">Participated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.participated}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Challenges joined</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-600 dark:text-amber-400">Won</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.won}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Victories achieved</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Recent Quests</CardTitle>
              <CardDescription>Your latest coding challenges and participations</CardDescription>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-4 p-4">
                {data.quests.map((contest) => (
                  <div 
                    key={contest.id} 
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {getEmoji(contest.question_slug)} 
                          {contest.question_slug.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created on {formatDate(contest.created_at)}
                        </p>
                      </div>
                      <Badge variant={contest.ended ? "secondary" : "default"}>
                        {contest.ended ? "Ended" : "Active"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="mr-2 h-4 w-4 text-violet-500 dark:text-violet-400" />
                        <span>{contest.time_limit} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="mr-2 h-4 w-4 text-violet-500 dark:text-violet-400" />
                        <span>{contest.totalParticipants} participant(s)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Code className="mr-2 h-4 w-4 text-violet-500 dark:text-violet-400" />
                        <span>{contest.isCreator ? 'Creator' : 'Participant'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Trophy className="mr-2 h-4 w-4 text-violet-500 dark:text-violet-400" />
                        <span>{contest.hasWon ? 'Winner!' : 'Not won'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    )
}