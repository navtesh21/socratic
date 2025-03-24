import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Book, BookOpen, Code2, FileText } from "lucide-react";
import React from "react";
import DOMPurify from 'dompurify';

function Problem({data}: {data: any}) {
  console.log(data,"problem")
  if(data?.length === 0){
    return <h1>Problem not found</h1>
  }
  const createMarkup = (htmlContent:string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center">
          <BookOpen className="mr-2 h-8 w-8 text-primary" />
          {data?.title}
        </h1>
        <p className="text-muted-foreground">
          {`Difficulty: ${data?.difficulty} | Likes: ${data?.likes} | Dislikes: ${data?.dislikes}`}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Problem Statement
        </h2>
        <div className="w-full pr-5" dangerouslySetInnerHTML={createMarkup(data?.content)} />
      </div>

     
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Hints
          </h2>
        <p>
          {data?.hints.map((hint: string, index: number) => {
            return (
              <p key={index} dangerouslySetInnerHTML={createMarkup(hint)} />
            );
          })}
        </p>
      </div>
    </div>
  );
}

export default Problem;
