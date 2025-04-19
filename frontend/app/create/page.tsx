"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { CalendarIcon, Clock } from "lucide-react"

import { CalendarIcon, Clock, FileText, Upload, Globe } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { createEvent, EventData } from "@/lib/api/eventService"

export default function CreateEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  // Removed PDF-related state variables

  // Form field states
  const [eventName, setEventName] = useState<string>('')
  const [organizerName, setOrganizerName] = useState<string>('')
  const [organizerEmail, setOrganizerEmail] = useState<string>('')
  const [organizerPhone, setOrganizerPhone] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventFaqs, setEventFaqs] = useState<string>('')

  // Removed PDF file handling function

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!eventName) {
        setError('Event name is required')
        setIsLoading(false)
        return
      }

      if (!organizerName) {
        setError('Organizer name is required')
        setIsLoading(false)
        return
      }

      if (!eventDescription) {
        setError('Event description is required')
        setIsLoading(false)
        return
      }

      if (!organizerPhone) {
        setError('Contact number is required')
        setIsLoading(false)
        return
      }

      // Format date and time
      let timeString = ''
      if (date) {
        timeString = format(date, 'MMMM d, yyyy')
        if (hours && minutes) {
          timeString += ` at ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
        }
      } else {
        // If no date is selected, use a default date format
        timeString = 'Date to be announced'
      }

      // Combine description and FAQs for the context
      const fullContext = `${eventDescription}\n\n${eventFaqs ? 'FAQs:\n' + eventFaqs : ''}`

      console.log('Creating event with data:', {
        name: eventName,
        organizer: organizerName,
        time: timeString,
        phone: organizerPhone
      })

      const eventData: EventData = {
        name: eventName,
        organizer: organizerName,
        details: fullContext,
        time: timeString,
        whatsappNumber: organizerPhone.replace(/\D/g, ''), // Remove non-digits
      }

      // Try to create the event
      const response = await createEvent(eventData)

      if (response.success) {
        console.log('Event created successfully:', response)
        // Store the chat link in localStorage to use on success page
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatLink', response.link)
          localStorage.setItem('eventName', eventName)

          // Also store the full event data for the chat page to use
          if (response.event) {
            localStorage.setItem('eventData', JSON.stringify(response.event))
          }
        }
        router.push('/success')
      } else {
        console.error('Failed to create event:', response.error)
        setError(response.error || 'Failed to create event')
      }
    } catch (err) {
      console.error('Error creating event:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEventPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [timeFormat, setTimeFormat] = useState<{
    startHour: string,
    startMinute: string,
    startPeriod: "AM" | "PM",
    endHour: string,
    endMinute: string,
    endPeriod: "AM" | "PM"
  }>({
    startHour: "",
    startMinute: "",
    startPeriod: "AM",
    endHour: "",
    endMinute: "",
    endPeriod: "PM"
  })
  const [timezone, setTimezone] = useState("UTC")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")

  const handleTimeChange = (field: keyof typeof timeFormat, value: string | "AM" | "PM") => {
    setTimeFormat(prev => ({ ...prev, [field]: value }))
  }

  const formatTimeDisplay = (hour: string, minute: string, period: "AM" | "PM") => {
    if (!hour && !minute) return "Select time";
    const formattedHour = hour.padStart(2, '0');
    const formattedMinute = minute.padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Check if the file is a PDF
      if (file.type !== "application/pdf") {
        setFileError("Please upload a PDF file")
        setPdfFile(null)
        return
      }
      
      // Check if the file size is less than 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size should be less than 10MB")
        setPdfFile(null)
        return
      }
      
      setPdfFile(file)
    }
  }

  const processPdf = async () => {
    if (!pdfFile) return

    setIsProcessing(true)
    setProcessingStatus("Uploading PDF...")
    
    // Simulate PDF processing with timeouts
    setTimeout(() => {
      setProcessingStatus("Analyzing document structure...")
      
      setTimeout(() => {
        setProcessingStatus("Extracting event information...")
        
        setTimeout(() => {
          setProcessingStatus("PDF successfully processed!")
          setIsProcessing(false)
        }, 1500)
      }, 1500)
    }, 1500)
    
    // In a real implementation, you would send the file to your backend
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would submit the form data to an API
    router.push("/success")

  }

  // Common timezones for the dropdown
  const timezones = [
    "UTC", "GMT", "EST", "CST", "MST", "PST", "EDT", "CDT", "MDT", "PDT", 
    "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland"
  ]

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

                <Label htmlFor="organizerPhone">Organizer Phone (optional)</Label>
                <Input id="organizerPhone" type="tel" placeholder="+1 (555) 123-4567" />

              </div>

              {/* Date Range Section */}
              <div className="grid gap-2">
                <Label>Event Date Range</Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("flex-1 justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  
                  <span className="text-gray-500">—</span>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("flex-1 justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Time Range Section */}
              <div className="grid gap-2">
                <Label>Event Time Range</Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn("flex-1 justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                        disabled={!startDate}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {formatTimeDisplay(timeFormat.startHour, timeFormat.startMinute, timeFormat.startPeriod)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="grid gap-4">
                        <div className="flex gap-2 items-center">
                          <div>
                            <Label htmlFor="startHour">Hour</Label>
                            <Input 
                              id="startHour" 
                              type="number" 
                              min="1" 
                              max="12" 
                              placeholder="HH" 
                              className="w-16"
                              value={timeFormat.startHour}
                              onChange={(e) => handleTimeChange('startHour', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="startMinute">Min</Label>
                            <Input 
                              id="startMinute" 
                              type="number" 
                              min="0" 
                              max="59" 
                              placeholder="MM" 
                              className="w-16"
                              value={timeFormat.startMinute}
                              onChange={(e) => handleTimeChange('startMinute', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Period</Label>
                            <div className="flex mt-2">
                              <Button 
                                type="button"
                                variant={timeFormat.startPeriod === "AM" ? "default" : "outline"}
                                size="sm"
                                className="rounded-r-none w-12"
                                onClick={() => handleTimeChange('startPeriod', "AM")}
                              >
                                AM
                              </Button>
                              <Button 
                                type="button"
                                variant={timeFormat.startPeriod === "PM" ? "default" : "outline"}
                                size="sm"
                                className="rounded-l-none w-12"
                                onClick={() => handleTimeChange('startPeriod', "PM")}
                              >
                                PM
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <span className="text-gray-500">—</span>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn("flex-1 justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                        disabled={!endDate}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {formatTimeDisplay(timeFormat.endHour, timeFormat.endMinute, timeFormat.endPeriod)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="grid gap-4">
                        <div className="flex gap-2 items-center">
                          <div>
                            <Label htmlFor="endHour">Hour</Label>
                            <Input 
                              id="endHour" 
                              type="number" 
                              min="1" 
                              max="12" 
                              placeholder="HH" 
                              className="w-16"
                              value={timeFormat.endHour}
                              onChange={(e) => handleTimeChange('endHour', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endMinute">Min</Label>
                            <Input 
                              id="endMinute" 
                              type="number" 
                              min="0" 
                              max="59" 
                              placeholder="MM" 
                              className="w-16"
                              value={timeFormat.endMinute}
                              onChange={(e) => handleTimeChange('endMinute', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Period</Label>
                            <div className="flex mt-2">
                              <Button 
                                type="button"
                                variant={timeFormat.endPeriod === "AM" ? "default" : "outline"}
                                size="sm"
                                className="rounded-r-none w-12"
                                onClick={() => handleTimeChange('endPeriod', "AM")}
                              >
                                AM
                              </Button>
                              <Button 
                                type="button"
                                variant={timeFormat.endPeriod === "PM" ? "default" : "outline"}
                                size="sm"
                                className="rounded-l-none w-12"
                                onClick={() => handleTimeChange('endPeriod', "PM")}
                              >
                                PM
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Timezone Selection */}
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-500" />
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              


              <div className="grid gap-2">
                <Label htmlFor="eventDescription">Event Description</Label>
                <Textarea
                  id="eventDescription"
                  placeholder="Describe your event in detail..."
                  className="min-h-[150px]"
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include all important details about your event such as venue, schedule, speakers, etc.
                  This information will be used by the AI to answer attendee questions.
                </p>
              </div>

              <div className="grid gap-2">

                <Label htmlFor="eventFaqs">FAQs / Additional Information</Label>
                <Textarea
                  id="eventFaqs"
                  placeholder="Add frequently asked questions and answers, or any additional information..."
                  className="min-h-[150px]"
                  value={eventFaqs}
                  onChange={(e) => setEventFaqs(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add any FAQs, rules, guidelines, or other information that attendees might ask about.
                </p>

                <Label htmlFor="eventFaqs">FAQs / Extra Info</Label>
                <Textarea id="eventFaqs" placeholder="Additional information, FAQs, etc." className="min-h-[100px]" />
              </div>
              
              {/* PDF Uploader Section */}
              <div className="grid gap-2">
                <Label htmlFor="pdfUpload">Upload Event PDF (Optional)</Label>
                <div className="flex flex-col gap-2">
                  <div className="border-2 border-dashed rounded-md p-6 border-gray-300 text-center">
                    <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm mb-2">Upload a PDF to auto-fill event details</p>
                    <p className="text-xs text-gray-500 mb-4">PDF will be analyzed to extract event information</p>
                    <Input
                      id="pdfUpload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('pdfUpload')?.click()}
                      className="mx-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select PDF
                    </Button>
                  </div>
                  
                  {pdfFile && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm truncate max-w-xs">{pdfFile.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {!isProcessing ? (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            onClick={processPdf}
                          >
                            Process PDF
                          </Button>
                        ) : (
                          <div className="text-sm text-gray-600">{processingStatus}</div>
                        )}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setPdfFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {fileError && (
                    <div className="p-3 mt-2 text-sm border border-red-300 bg-red-50 text-red-600 rounded-md">
                      {fileError}
                    </div>
                  )}
                </div>

              </div>
            </div>


            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Event Chat"}

            <Button type="submit" className="w-full">
              Generate WhatsApp Link

            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}