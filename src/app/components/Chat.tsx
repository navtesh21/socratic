// "use client"
// import React, { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Plus, Send } from "lucide-react"

// function Chat() {
//     const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
//         { role: "ai", content: "Helloz! How can I assist you with your coding challenge today?" },
//       ])
//       const [userInput, setUserInput] = useState("")
//     const handleSendMessage = () => {
//         if (userInput.trim()) {
//           setChatMessages([...chatMessages, { role: "user", content: userInput }])
//           setTimeout(() => {
//             setChatMessages((prev) => [
//               ...prev,
//               { role: "ai", content: "I understand. Can you provide more details about your question?" },
//             ])
//           }, 1000)
//           setUserInput("")
//         }
//       }
//   return (
//     <Sheet>
//         <SheetTrigger asChild>
//           <Button className="fixed bottom-4 right-4 rounded-full" size="icon">
//             <Plus className="h-4 w-4" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent className="w-[400px] sm:w-[540px]">
//           <SheetHeader>
//             <SheetTitle>Chat with AI Assistant</SheetTitle>
//           </SheetHeader>
//           <div className="flex flex-col h-full">
//             <ScrollArea className="flex-grow pr-4">
//               {chatMessages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`mb-4 ${
//                     message.role === "user" ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <div
//                     className={`inline-block p-2 rounded-lg ${
//                       message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
//                     }`}
//                   >
//                     {message.content}
//                   </div>
//                 </div>
//               ))}
//             </ScrollArea>
//             <div className="flex items-center mt-4">
//               <Textarea
//                 placeholder="Type your message here"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 className="flex-grow mr-2"
//               />
//               <Button onClick={handleSendMessage} size="icon">
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>
//   )
// }

// export default Chat

"use client"
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Send } from "lucide-react"
import axios from "axios"

// Define message type with proper literal types
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hello! How can I assist you with your coding challenge today?" },
  ])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Gemini API key
  const apiKey = "AIzaSyAiCrzcDOMlY_o2TmpFDjN4heDiYMr340A"
  
  // Ref for auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [chatMessages, isLoading])
  
  const fetchGeminiResponse = async (prompt: string): Promise<string> => {
    try {
      setIsLoading(true)
      
      // Using axios instead of fetch to help with CORS issues
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      })
      
      // Extract response using the structure from your reference code
      const aiResponse = response.data.candidates[0].content.parts[0].text
      return aiResponse
      
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "Sorry, there was an error connecting to the AI service."
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSendMessage = async (): Promise<void> => {
    if (userInput.trim() && !isLoading) {
      // Store current question
      const currentQuestion = userInput
      
      // Add user message with explicit type
      const newUserMessage: ChatMessage = { role: "user", content: currentQuestion }
      setChatMessages(prev => [...prev, newUserMessage])
      
      // Clear input immediately
      setUserInput("")
      
      try {
        // Create context from previous messages (limit to last 5 for context window)
        const context = [...chatMessages, newUserMessage].slice(-5).map(msg => 
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        ).join("\n")
        
        // Get AI response
        const aiResponse = await fetchGeminiResponse(context)
        
        // Add AI response to chat with explicit type
        const newAiMessage: ChatMessage = { role: "ai", content: aiResponse }
        setChatMessages(prev => [...prev, newAiMessage])
      } catch (error) {
        // Handle errors
        console.error("Error in chat flow:", error)
        setChatMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }])
      }
    }
  }
  
  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SheetHeader>
          <SheetTitle>Chat with Gemini AI</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-120px)]">
          <ScrollArea ref={scrollAreaRef} className="flex-grow pr-4 pt-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[85%] ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-muted animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center gap-2 py-4">
            <Textarea
              placeholder="Type your message here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              disabled={isLoading || !userInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Chat