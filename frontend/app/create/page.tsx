"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createEventWithPDF, EventData } from "@/lib/api/eventService"

export default function CreateEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')

  // Form field states
  const [eventName, setEventName] = useState<string>('')
  const [organizerName, setOrganizerName] = useState<string>('')
  const [organizerEmail, setOrganizerEmail] = useState<string>('')
  const [organizerPhone, setOrganizerPhone] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventFaqs, setEventFaqs] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Create form data manually
      const formData = new FormData()
      formData.append('eventName', eventName)
      formData.append('organizerName', organizerName)
      formData.append('organizerEmail', organizerEmail)
      formData.append('organizerPhone', organizerPhone)
      formData.append('eventDescription', eventDescription)
      formData.append('eventFaqs', eventFaqs)

      // Format date and time
      let timeString = ''
      if (date) {
        timeString = format(date, 'MMMM d, yyyy')
        if (hours && minutes) {
          timeString += ` at ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
        }
      }

      const eventData: EventData = {
        name: eventName,
        organizer: organizerName,
        details: eventDescription,
        time: timeString,
        whatsappNumber: organizerPhone.replace(/\D/g, ''), // Remove non-digits
      }

      if (selectedFile) {
        eventData.pdf = selectedFile
      }

      const response = await createEventWithPDF(eventData)

      if (response.success) {
        // Store the chat link in localStorage to use on success page
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatLink', response.link)
          localStorage.setItem('eventName', eventName)
        }
        router.push('/success')
      } else {
        setError(response.error || 'Failed to create event')
      }
    } catch (err) {
      console.error('Error creating event:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Event</CardTitle>
          <CardDescription>Fill in the details below to set up your event chat assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="Tech Conference 2023"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input
                  id="organizerName"
                  placeholder="Your name or organization"
                  required
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerEmail">Organizer Email</Label>
                <Input
                  id="organizerEmail"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerPhone">Contact Number</Label>
                <Input
                  id="organizerPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This number will be displayed on the event chat page</p>
              </div>

              <div className="grid gap-2">
                <Label>Event Date & Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                        <Clock className="mr-2 h-4 w-4" />
                        Select time
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="grid gap-2">
                        <Label htmlFor="hours">Hours</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="23"
                          placeholder="HH"
                          className="w-[80px]"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                        />
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          placeholder="MM"
                          className="w-[80px]"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="eventDescription">Event Description</Label>
                <Textarea
                  id="eventDescription"
                  placeholder="Describe your event..."
                  className="min-h-[100px]"
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="eventFaqs">FAQs / Extra Info</Label>
                <Textarea
                  id="eventFaqs"
                  placeholder="Additional information, FAQs, etc."
                  className="min-h-[100px]"
                  value={eventFaqs}
                  onChange={(e) => setEventFaqs(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pdfUpload">Upload PDF (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="pdfUpload"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose PDF
                  </Button>
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {fileName || "No file chosen"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a PDF with detailed event information. This will be used to answer attendee questions.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Event Chat"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
