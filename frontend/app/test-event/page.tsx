"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TestEventPage() {
  const router = useRouter()
  const [eventName, setEventName] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [details, setDetails] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Store the event data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatLink', '/test-chat')
        localStorage.setItem('eventName', eventName)
      }

      // Redirect to success page
      router.push('/success')
    } catch (error) {
      console.error('Error creating event:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Test Event</CardTitle>
          <CardDescription>Fill in the details below to test the event chat assistant</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="Tech Conference 2023"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                placeholder="Your Organization"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventTime">Event Time</Label>
              <Input
                id="eventTime"
                placeholder="June 15, 2023 at 10:00 AM"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">This number will be displayed on the event chat page</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Event Details</Label>
              <Textarea
                id="details"
                placeholder="Enter all the details about your event..."
                required
                className="min-h-[150px]"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include information like venue, agenda, speakers, etc. This will help the AI answer questions accurately.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Test Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
