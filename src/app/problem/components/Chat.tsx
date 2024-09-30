"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Send } from "lucide-react"

function Chat() {
    const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
        { role: "ai", content: "Hello! How can I assist you with your coding challenge today?" },
      ])
      const [userInput, setUserInput] = useState("")
    const handleSendMessage = () => {
        if (userInput.trim()) {
          setChatMessages([...chatMessages, { role: "user", content: userInput }])
          // Here you would typically send the message to an AI service and get a response
          // For now, we'll just simulate an AI response
          setTimeout(() => {
            setChatMessages((prev) => [
              ...prev,
              { role: "ai", content: "I understand. Can you provide more details about your question?" },
            ])
          }, 1000)
          setUserInput("")
        }
      }
  return (
    <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Chat with AI Assistant</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow pr-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center mt-4">
              <Textarea
                placeholder="Type your message here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
  )
}

export default Chat