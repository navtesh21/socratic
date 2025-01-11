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

export default function CreateContestPage() {
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [contestDuration, setContestDuration] = useState("");
  const [sharingLink, setSharingLink] = useState("");
  const [isContestCreated, setIsContestCreated] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const baseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "http://localhost:4000"; // Fallback for SSR
  const mutation = useMutation({
    mutationFn: async ({
      question_slug,
      time_limit,
    }: {
      question_slug: string;
      time_limit: string;
    }) => {
      console.log(user?.id);
      if (!user?.id) {
        toast({
          title: "Not Authorized ",
          description: "Please Sign in",
        });
        return
      }
      const data = await axios.post(
        `${process.env.URL || "https://socratic-backend.onrender.com"}/createQuest`,
        {
          question_slug,
          time_limit,
          creatorId: user?.id,
        }
      );
      console.log(data);
      if (data.data.status != 200) {
        throw new Error(data.data.message);
      }
      const mockSharingLink = `${baseUrl}/challenge/${data.data.questId}`;
      setSharingLink(mockSharingLink);

      setIsContestCreated(true);
      localStorage.setItem(data.data.questId,"true");
      return data;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
      });
    },
    onSuccess: () => {
      console.log("Contest created successfully");
      toast({
        title: "Contest Created",
        description: "Share the link with your friends",
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
    if (!leetcodeUrl || !contestDuration) {
      toast({
        title: "Invalid Input",
        description: "Please fill all the fields",
      });
    }
    mutation.mutate({
      question_slug: getSlugFromUrl(leetcodeUrl),
      time_limit: contestDuration,
    });
  };


  return (
    <div className="container mx-auto p-4 mt-11">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create a New Contest</CardTitle>
          <CardDescription>
            Set up a coding contest for your peers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateContest}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leetcodeUrl">LeetCode URL</Label>
                <Input
                  id="leetcodeUrl"
                  placeholder="https://leetcode.com/problems/..."
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contestDuration">
                  Contest Duration (minutes)
                </Label>
                <Input
                  id="contestDuration"
                  type="number"
                  placeholder="60"
                  value={contestDuration}
                  onChange={(e) => setContestDuration(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Maximum 2 users can join this contest.
                </AlertDescription>
              </Alert>
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={mutation.isPending || isContestCreated}
            >
              Create Contest
            </Button>
          </form>
        </CardContent>
        {isContestCreated && (
          <CardFooter>
            <div className="w-full space-y-2">
              <Label>Sharing Link</Label>
              <div className="flex items-center space-x-2">
                <Input value={sharingLink} readOnly />
                <Button
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(sharingLink)}
                  title="Copy to clipboard"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
