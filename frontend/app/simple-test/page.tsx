"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function SimpleTestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const handleCreateTestEvent = () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Create a mock event
      const mockEventId = 'test-' + Date.now()
      const chatLink = `/event/${mockEventId}`
      
      // Store the event data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatLink', chatLink)
        localStorage.setItem('eventName', 'Test Event')
        
        // Store the full event data for the chat page to use
        const eventData = {
          id: mockEventId,
          name: 'Test Event',
          organizer: 'Test Organizer',
          details: 'This is a test event with all the details needed for testing the chat functionality.',
          time: 'June 15, 2023 at 10:00 AM',
          contactNumber: '1234567890',
          chatLink: chatLink,
          whatsappNumber: '1234567890',
          whatsappMessage: chatLink,
          context: 'This is a test event happening on June 15, 2023 at 10:00 AM at the Conference Center. The event will feature speakers on various topics. Lunch will be provided. Please bring your ID for registration.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        localStorage.setItem('eventData', JSON.stringify(eventData))
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/success')
      }, 1500)
    } catch (err) {
      console.error('Error creating test event:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>Simple Test</CardTitle>
          <CardDescription>
            Create a test event without using the backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This page creates a test event directly in the browser without making any API calls.
            It's useful for testing the chat interface when the backend is not working.
          </p>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
              Test event created successfully! Redirecting to success page...
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateTestEvent} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Test Event..." : "Create Test Event"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
