// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { InfoIcon, LinkIcon } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import { useToast } from "@/hooks/use-toast";
// import { useSearchParams } from 'next/navigation';

// export default function CreateContestPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('slug');
//   const [leetcodeUrl, setLeetcodeUrl] = useState(query ? `https://leetcode.com/problems/${query}` : "");
//   const [contestDuration, setContestDuration] = useState("");
//   const [sharingLink, setSharingLink] = useState("");
//   const [isContestCreated, setIsContestCreated] = useState(false);
//   const { user } = useUser();
//   const { toast } = useToast();

//   const baseUrl =
//     typeof window !== "undefined"
//       ? `${window.location.protocol}//${window.location.host}`
//       : "http://localhost:4000";

//   const mutation = useMutation({
//     mutationFn: async ({
//       question_slug,
//       time_limit,
//     }: {
//       question_slug: string;
//       time_limit: string;
//     }) => {
//       const data = await axios.post(
//         `${process.env.URL || "https://socratic-backend.onrender.com"}/createQuest`,
//         {
//           question_slug,
//           time_limit,
//           creatorId: user?.id,
//         }
//       );
//       if (data.data.status != 200) {
//         throw new Error(data.data.message);
//       }
//       const mockSharingLink = `${baseUrl}/challenge/${data.data.questId}`;
//       setSharingLink(mockSharingLink);
//       setIsContestCreated(true);
//       localStorage.setItem(data.data.questId, "true");
//       return data;
//     },
//     onError: (error) => {
//       toast({
//         title: "🚨 Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//     onSuccess: () => {
//       toast({
//         title: "🎉 Contest Created",
//         description: "Share the link with your friends!",
//       });
//     },
//   });

//   function getSlugFromUrl(url: string): string {
//     const urlParts = url.split("/").filter(Boolean);
//     const problemIndex = urlParts.indexOf("problems");
//     return problemIndex !== -1 && urlParts[problemIndex + 1] ? urlParts[problemIndex + 1] : "";
//   }

//   const handleCreateContest = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.id) {
//       toast({
//         title: "🔒 Not Authorized",
//         description: "Please sign in to create a contest.",
//       });
//       return;
//     }
//     if (!leetcodeUrl || !contestDuration) {
//       toast({
//         title: "⚠️ Invalid Input",
//         description: "Please fill all the fields.",
//       });
//       return;
//     }
//     mutation.mutate({
//       question_slug: getSlugFromUrl(leetcodeUrl),
//       time_limit: contestDuration,
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 mt-24">
//       <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
//             🚀 Create a New Contest
//           </CardTitle>
//           <CardDescription className="text-gray-300">
//             Set up a coding contest for your peers and challenge them!
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleCreateContest}>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="leetcodeUrl" className="text-gray-300 font-medium">
//                   LeetCode URL 🌐
//                 </Label>
//                 <Input
//                   id="leetcodeUrl"
//                   placeholder="https://leetcode.com/problems/..."
//                   value={leetcodeUrl}
//                   onChange={(e) => setLeetcodeUrl(e.target.value)}
//                   required
//                   className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="contestDuration" className="text-gray-300 font-medium">
//                   Contest Duration (minutes) ⏳
//                 </Label>
//                 <Input
//                   id="contestDuration"
//                   type="number"
//                   placeholder="60"
//                   value={contestDuration}
//                   onChange={(e) => setContestDuration(e.target.value)}
//                   required
//                   min="1"
//                   className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <Alert className="bg-gray-700 border-gray-600">
//                 <InfoIcon className="h-4 w-4 text-blue-400" />
//                 <AlertTitle className="text-blue-400">Note 📝</AlertTitle>
//                 <AlertDescription className="text-gray-300">
//                   Maximum 2 users can join this contest.
//                 </AlertDescription>
//               </Alert>
//             </div>
//             <Button
//               type="submit"
//               className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 transition-all duration-300 hover:scale-105"
//               disabled={mutation.isPending || isContestCreated}
//             >
//               {mutation.isPending ? "Creating..." : "Create Contest 🎯"}
//             </Button>
//           </form>
//         </CardContent>
//         {isContestCreated && (
//           <CardFooter>
//             <div className="w-full space-y-2">
//               <Label className="text-gray-300 font-medium">Sharing Link 🔗</Label>
//               <div className="flex items-center space-x-2">
//                 <Input value={sharingLink} readOnly className="focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600" />
//                 <Button
//                   size="icon"
//                   onClick={() => {
//                     navigator.clipboard.writeText(sharingLink);
//                     toast({
//                       title: "📋 Copied!",
//                       description: "Sharing link copied to clipboard.",
//                     });
//                   }}
//                   title="Copy to clipboard"
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   <LinkIcon className="h-4 w-4 text-white" />
//                 </Button>
//               </div>
//             </div>
//           </CardFooter>
//         )}
//       </Card>
//     </div>
//   );
// }
"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, LinkIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
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

  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "http://localhost:4000";

  const mutation = useMutation({
    mutationFn: async ({ question_slug, time_limit }: { question_slug: string; time_limit: string; }) => {
      const data = await axios.post(`${process.env.URL || "https://socratic-backend.onrender.com"}/createQuest`, {
        question_slug,
        time_limit,
        creatorId: user?.id,
      });
      if (data.data.status != 200) throw new Error(data.data.message);
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
    <div className="mb-[250px] max-w-[85rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-20 mx-auto">
      <div className="grid md:grid-cols-2 items-center gap-12">
        {/* Left Column - Info */}
        <div>
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl lg:leading-tight dark:text-white">
  Host <span className="underline text-blue-600">Your Own</span> Coding Challenge
</h1>
<p className="mt-1 md:text-lg text-gray-800 dark:text-neutral-200">
  Create custom contests, invite friends, and compete in solving coding problems in real-time.
</p>

<div className="mt-8">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
    Why Create a Contest?
  </h2>

  <ul className="mt-2 space-y-2">
    <li className="flex gap-x-3">
      <CheckIcon className="shrink-0 mt-0.5 size-5 text-green-600 dark:text-green-400" />
      <span className="text-gray-600 dark:text-neutral-400">
        Challenge your friends and track scores
      </span>
    </li>
    <li className="flex gap-x-3">
      <CheckIcon className="shrink-0 mt-0.5 size-5 text-green-600 dark:text-green-400" />
      <span className="text-gray-600 dark:text-neutral-400">
        Solve LeetCode problems in a competitive setting
      </span>
    </li>
    <li className="flex gap-x-3">
      <CheckIcon className="shrink-0 mt-0.5 size-5 text-green-600 dark:text-green-400" />
      <span className="text-gray-600 dark:text-neutral-400">
        Get real-time feedback and results
      </span>
    </li>
  </ul>
</div>



      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
        Challenges inspired by FAANG & more:
        </h2>

        <div className="mt-4 flex gap-x-8">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
            <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path><path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path><path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path><path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
          <path fill="#FFB300" d="M39.6,39c-4.2,3.1-10.5,5-15.6,5c-7.3,0-13.8-2.9-18.8-7.4c-0.4-0.4,0-0.8,0.4-0.6c5.4,3.1,11.5,4.9,18.3,4.9c4.6,0,10.4-1,15.1-3C39.7,37.7,40.3,38.5,39.6,39z M41.1,36.9c-0.5-0.7-3.5-0.3-4.8-0.2c-0.4,0-0.5-0.3-0.1-0.6c2.3-1.7,6.2-1.2,6.6-0.6c0.4,0.6-0.1,4.5-2.3,6.3c-0.3,0.3-0.7,0.1-0.5-0.2C40.5,40.4,41.6,37.6,41.1,36.9z"></path><path fill="#37474F" d="M36.9,29.8c-1-1.3-2-2.4-2-4.9v-8.3c0-3.5,0-6.6-2.5-9c-2-1.9-5.3-2.6-7.9-2.6C19,5,14.2,7.2,13,13.4c-0.1,0.7,0.4,1,0.8,1.1l5.1,0.6c0.5,0,0.8-0.5,0.9-1c0.4-2.1,2.1-3.1,4.1-3.1c1.1,0,3.2,0.6,3.2,3v3c-3.2,0-6.6,0-9.4,1.2c-3.3,1.4-5.6,4.3-5.6,8.6c0,5.5,3.4,8.2,7.8,8.2c3.7,0,5.9-0.9,8.8-3.8c0.9,1.4,1.3,2.2,3,3.7c0.4,0.2,0.9,0.2,1.2-0.1l0,0c1-0.9,2.9-2.6,4-3.5C37.4,30.9,37.3,30.3,36.9,29.8z M27,22.1L27,22.1c0,2-0.1,6.9-5,6.9c-3,0-3-3-3-3c0-4.5,4.2-5,8-5V22.1z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
            <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"></path>
            </svg>

          
        </div>
      </div>


          {/* <div className="mt-10 flex items-center gap-x-5">
            <div className="flex -space-x-2">
              <img className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900" src="/api/placeholder/32/32" alt="User" />
              <img className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900" src="/api/placeholder/32/32" alt="User" />
              <img className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900" src="/api/placeholder/32/32" alt="User" />
              <span className="inline-flex justify-center items-center size-8 rounded-full bg-blue-600 text-white ring-2 ring-white">
                <span className="text-xs">+</span>
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-neutral-500">
              Join the community of competitive coders
            </span>
          </div> */}
        </div>
        

        {/* Right Column - Form */}
        <div className="relative">
          <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-10 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
              Contest Details
            </h2>

            <form onSubmit={handleCreateContest} className="mt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="leetcodeUrl" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                    LeetCode Problem URL
                  </Label>
                  <Input
                    id="leetcodeUrl"
                    value={leetcodeUrl}
                    onChange={(e) => setLeetcodeUrl(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="py-3 px-4 block w-full"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contestDuration" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                    Contest Duration (minutes)
                  </Label>
                  <Input
                    id="contestDuration"
                    type="number"
                    value={contestDuration}
                    onChange={(e) => setContestDuration(e.target.value)}
                    placeholder="60"
                    className="py-3 px-4 block w-full"
                    required
                    min="1"
                  />
                </div>

                <Alert className="bg-gray-50 dark:bg-neutral-800">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    Maximum 2 users can join this contest.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full py-3 px-4"
                  disabled={mutation.isPending || isContestCreated}
                >
                  {mutation.isPending ? "Creating..." : "Create Contest"}
                </Button>
              </div>
            </form>

            {/* {isContestCreated && (
              <div className="mt-6 space-y-2">
                <Label className="text-gray-700 font-medium dark:text-white">Sharing Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={sharingLink}
                    readOnly
                    className="bg-gray-50 dark:bg-neutral-800"
                  />
                  <Button
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(sharingLink);
                      toast({
                        title: "Copied!",
                        description: "Link copied to clipboard",
                      });
                    }}
                    className="shrink-0"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-500 text-center mt-3">
                  Share this link with your friend to start the competition!
                </p>
              </div>
            )} */}

{isContestCreated && (
  <div className="mt-6 space-y-2">
    <Label className="text-gray-700 font-medium dark:text-white">Sharing Link</Label>
    <div className="flex items-center gap-2">
      <Input
        value={sharingLink}
        readOnly
        className="bg-gray-50 dark:bg-neutral-800"
      />
      <Button
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(sharingLink);
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
        }}
        className="shrink-0"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        onClick={() => window.open(sharingLink, '_blank')}
        className="shrink-0"
      >
        <ExternalLinkIcon className="h-4 w-4" />
      </Button>
    </div>
    <p className="text-sm text-gray-500 dark:text-neutral-500 text-center mt-3">
      Share this link with your friend to start the competition!
    </p>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}
