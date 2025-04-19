"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, PhoneIcon as WhatsappIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SuccessPage() {
  const [copied, setCopied] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState("")
  const [eventName, setEventName] = useState("")

  useEffect(() => {
    // Get the WhatsApp link from localStorage
    if (typeof window !== 'undefined') {
      const storedLink = localStorage.getItem('whatsappLink')
      const storedEventName = localStorage.getItem('eventName')

      if (storedLink) {
        setWhatsappLink(storedLink)
      }

      if (storedEventName) {
        setEventName(storedEventName)
      }
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappLink)
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
            {eventName ? `Share the WhatsApp link for "${eventName}" with your attendees` : 'Share this WhatsApp link with your attendees'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={whatsappLink} readOnly className="bg-muted font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Button className="w-full gap-2" onClick={() => window.open(whatsappLink, "_blank")}>
            <WhatsappIcon className="h-5 w-5" />
            Open in WhatsApp
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Your attendees will receive a WhatsApp message with registration instructions
          </p>
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
