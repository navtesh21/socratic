"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon, LinkIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';

export default function CreateContestPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('slug');
  const [leetcodeUrl, setLeetcodeUrl] = useState(query ? `https://leetcode.com/problems/${query}` : "");
  const [contestDuration, setContestDuration] = useState("");
  const [sharingLink, setSharingLink] = useState("");
  const [isContestCreated, setIsContestCreated] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "http://localhost:4000";

  const mutation = useMutation({
    mutationFn: async ({
      question_slug,
      time_limit,
    }: {
      question_slug: string;
      time_limit: string;
    }) => {
      const data = await axios.post(
        `${process.env.URL || "https://socratic-backend.onrender.com"}/createQuest`,
        {
          question_slug,
          time_limit,
          creatorId: user?.id,
        }
      );
      if (data.data.status != 200) {
        throw new Error(data.data.message);
      }
      const mockSharingLink = `${baseUrl}/challenge/${data.data.questId}`;
      setSharingLink(mockSharingLink);
      setIsContestCreated(true);
      localStorage.setItem(data.data.questId, "true");
      return data;
    },
    onError: (error) => {
      toast({
        title: "🚨 Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "🎉 Contest Created",
        description: "Share the link with your friends!",
      });
    },
  });

  function getSlugFromUrl(url: string): string {
    const urlParts = url.split("/").filter(Boolean);
    const problemIndex = urlParts.indexOf("problems");
    return problemIndex !== -1 && urlParts[problemIndex + 1] ? urlParts[problemIndex + 1] : "";
  }

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "🔒 Not Authorized",
        description: "Please sign in to create a contest.",
      });
      return;
    }
    if (!leetcodeUrl || !contestDuration) {
      toast({
        title: "⚠️ Invalid Input",
        description: "Please fill all the fields.",
      });
      return;
    }
    mutation.mutate({
      question_slug: getSlugFromUrl(leetcodeUrl),
      time_limit: contestDuration,
    });
  };

  return (
    <div className="container mx-auto p-4 mt-24">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            🚀 Create a New Contest
          </CardTitle>
          <CardDescription className="text-gray-300">
            Set up a coding contest for your peers and challenge them!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateContest}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leetcodeUrl" className="text-gray-300 font-medium">
                  LeetCode URL 🌐
                </Label>
                <Input
                  id="leetcodeUrl"
                  placeholder="https://leetcode.com/problems/..."
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contestDuration" className="text-gray-300 font-medium">
                  Contest Duration (minutes) ⏳
                </Label>
                <Input
                  id="contestDuration"
                  type="number"
                  placeholder="60"
                  value={contestDuration}
                  onChange={(e) => setContestDuration(e.target.value)}
                  required
                  min="1"
                  className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600"
                />
              </div>
              <Alert className="bg-gray-700 border-gray-600">
                <InfoIcon className="h-4 w-4 text-blue-400" />
                <AlertTitle className="text-blue-400">Note 📝</AlertTitle>
                <AlertDescription className="text-gray-300">
                  Maximum 2 users can join this contest.
                </AlertDescription>
              </Alert>
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 transition-all duration-300 hover:scale-105"
              disabled={mutation.isPending || isContestCreated}
            >
              {mutation.isPending ? "Creating..." : "Create Contest 🎯"}
            </Button>
          </form>
        </CardContent>
        {isContestCreated && (
          <CardFooter>
            <div className="w-full space-y-2">
              <Label className="text-gray-300 font-medium">Sharing Link 🔗</Label>
              <div className="flex items-center space-x-2">
                <Input value={sharingLink} readOnly className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600" />
                <Button
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(sharingLink);
                    toast({
                      title: "📋 Copied!",
                      description: "Sharing link copied to clipboard.",
                    });
                  }}
                  title="Copy to clipboard"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <LinkIcon className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}