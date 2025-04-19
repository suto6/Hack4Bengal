"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, MessageSquare as ChatIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SuccessPage() {
  const [copied, setCopied] = useState(false)
  const [chatLink, setChatLink] = useState("")
  const [eventName, setEventName] = useState("")

  useEffect(() => {
    // Get the chat link from localStorage
    if (typeof window !== 'undefined') {
      const storedLink = localStorage.getItem('chatLink')
      const storedEventName = localStorage.getItem('eventName')

      if (storedLink) {
        setChatLink(storedLink)
      }

      if (storedEventName) {
        setEventName(storedEventName)
      }
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + chatLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your event has been created!</CardTitle>
          <CardDescription>
            {eventName ? `Share the chat link for "${eventName}" with your attendees` : 'Share this chat link with your attendees'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={window.location.origin + chatLink} readOnly className="bg-muted font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Button className="w-full gap-2" onClick={() => window.open(chatLink, "_blank")}>
            <ChatIcon className="h-5 w-5" />
            Open Event Chat
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="p-4 border rounded-md bg-blue-50 text-left">
            <h3 className="font-semibold mb-2">Share this link with your attendees:</h3>
            <p className="text-sm">
              Your event chat is now live! Share this link with attendees so they can ask questions about your event.
            </p>
            <p className="text-sm font-medium mt-2">
              {window.location.origin}{chatLink}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">View Dashboard</Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost">Create Another Event</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
