"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { getEventById, Event } from "@/lib/api/eventService"

// Message type definition
type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function EventChatPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)

        // Get the event data - getEventById now handles localStorage and mock events
        const eventData = await getEventById(eventId)
        setEvent(eventData)
        addWelcomeMessages(eventData.name)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Event not found or could not be loaded")
      } finally {
        setLoading(false)
      }
    }

    const addWelcomeMessages = (eventName: string) => {
      setMessages([
        {
          id: "welcome-1",
          content: `👋 Welcome to the ${eventName} event chat!`,
          sender: "bot",
          timestamp: new Date()
        },
        {
          id: "welcome-2",
          content: `I'm your AI event assistant. I can answer questions about dates, times, location, agenda, speakers, and more - all based on the information provided by the organizer.`,
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
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setSending(true)

    // Add typing indicator first
    const typingIndicatorId = `typing-${Date.now()}`;
    const typingIndicator: Message = {
      id: typingIndicatorId,
      content: "typing", // Special content to trigger typing indicator
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, typingIndicator]);

    try {
      let responseText = "";

      // Try to call API to get response from LLM
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            eventId,
            message: inputMessage
          })
        })

        if (!response.ok) {
          throw new Error("Failed to get response")
        }

        const data = await response.json()
        responseText = data.response;
      } catch (apiError) {
        console.error("API error, using fallback response:", apiError);

        // If API fails, generate a simple response based on the event data
        if (event) {
          const question = inputMessage.toLowerCase();
          if (question.includes('when') || question.includes('time') || question.includes('date')) {
            responseText = `The event is scheduled for ${event.time}.`;
          } else if (question.includes('where') || question.includes('location') || question.includes('venue')) {
            responseText = `Please check the event details for location information: ${event.details.substring(0, 100)}...`;
          } else if (question.includes('who') || question.includes('organizer')) {
            responseText = `This event is organized by ${event.organizer}.`;
          } else {
            responseText = `Thank you for your question. Here's what I know about the event: ${event.details.substring(0, 150)}...`;
          }
        } else {
          responseText = "I'm sorry, I don't have enough information to answer that question.";
        }
      }

      // After a short delay, replace with the actual response
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          content: responseText,
          sender: "bot",
          timestamp: new Date()
        };

        setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId).concat(botMessage));
      }, 1000);

      // The message is added in the setTimeout callback
    } catch (err) {
      console.error("Error sending message:", err)

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading Event Chat</CardTitle>
            <CardDescription className="text-center">
              Please wait while we load the event information...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[100vh] flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>{event?.name}</CardTitle>
          <CardDescription>
            {event?.time} • Organized by {event?.organizer}
          </CardDescription>
          <div className="mt-2 text-sm">
            <p><strong>Contact:</strong> {event?.whatsappNumber}</p>
            <p className="mt-1"><strong>Details:</strong> {event?.details ? `${event.details.substring(0, 150)}${event.details.length > 150 ? '...' : ''}` : ''}</p>
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
                  <p>{message.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-2 sm:p-4 mt-auto">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={sending}
              className="flex-grow"
            />
            <Button
              onClick={sendMessage}
              disabled={sending || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
