"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function TestChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Add welcome messages
    setMessages([
      {
        id: "welcome-1",
        content: `👋 Welcome to the Test Event chat!`,
        sender: "bot",
        timestamp: new Date()
      },
      {
        id: "welcome-2",
        content: `I'm your AI event assistant. I can answer questions about dates, times, location, agenda, speakers, and more.`,
        sender: "bot",
        timestamp: new Date(new Date().getTime() + 500)
      },
      {
        id: "welcome-3",
        content: `Try asking questions like:\n• When does the event start?\n• Where is the venue located?\n• What's on the agenda?\n• Who are the speakers?`,
        sender: "bot",
        timestamp: new Date(new Date().getTime() + 1000)
      }
    ])
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")

    // Add typing indicator
    const typingIndicatorId = `typing-${Date.now()}`
    const typingIndicator: Message = {
      id: typingIndicatorId,
      content: "typing",
      sender: "bot",
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, typingIndicator])

    // Simulate API call
    setTimeout(() => {
      // Remove typing indicator and add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        content: `This is a test response to your question: "${input}".\n\nThe event will be held on July 15, 2023 at 9:00 AM at the Grand Convention Center.`,
        sender: "bot",
        timestamp: new Date()
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId).concat(botMessage))
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[100vh] flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Test Event</CardTitle>
          <CardDescription>
            July 15, 2023 at 9:00 AM • Organized by Test Organizer
          </CardDescription>
          <div className="mt-2 text-sm">
            <p><strong>Contact:</strong> 123-456-7890</p>
            <p className="mt-1"><strong>Details:</strong> This is a test event for the chat functionality.</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto mb-2 sm:mb-4 space-y-4 p-3 sm:p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                {message.content === "typing" ? (
                  <div className="flex items-center space-x-1 py-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t p-2 sm:p-4 mt-auto">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask a question about the event..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!input.trim()}>
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
