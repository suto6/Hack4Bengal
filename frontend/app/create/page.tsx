"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, Globe } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createEvent, EventData } from "@/lib/api/eventService"

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
  // PDF-related state variables removed
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [eventName, setEventName] = useState<string>('')
  const [organizerName, setOrganizerName] = useState<string>('')
  const [organizerEmail, setOrganizerEmail] = useState<string>('')
  const [organizerPhone, setOrganizerPhone] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventFaqs, setEventFaqs] = useState<string>('')
  const [venueAddress, setVenueAddress] = useState<string>('')
  const [parkingInfo, setParkingInfo] = useState<string>('')
  const [accommodationInfo, setAccommodationInfo] = useState<string>('')
  const [foodInfo, setFoodInfo] = useState<string>('')
  const [certificateInfo, setCertificateInfo] = useState<string>('')
  const [registrationInfo, setRegistrationInfo] = useState<string>('')

  const handleTimeChange = (field: keyof typeof timeFormat, value: string | "AM" | "PM") => {
    setTimeFormat(prev => ({ ...prev, [field]: value }))
  }

  const formatTimeDisplay = (hour: string, minute: string, period: "AM" | "PM") => {
    if (!hour && !minute) return "Select time";
    const formattedHour = hour.padStart(2, '0');
    const formattedMinute = minute.padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  // PDF-related functions removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
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

      let timeString = ''
      if (startDate) {
        timeString = format(startDate, 'MMMM d, yyyy')
        if (timeFormat.startHour && timeFormat.startMinute) {
          timeString += ` at ${timeFormat.startHour.padStart(2, '0')}:${timeFormat.startMinute.padStart(2, '0')} ${timeFormat.startPeriod}`
        }
      } else {
        timeString = 'Date to be announced'
      }

      // Build a comprehensive context with all the event information
      let fullContext = `${eventDescription}`

      if (venueAddress) {
        fullContext += `\n\nVenue Address:\n${venueAddress}`
      }

      if (parkingInfo) {
        fullContext += `\n\nParking Information:\n${parkingInfo}`
      }

      if (accommodationInfo) {
        fullContext += `\n\nAccommodation Information:\n${accommodationInfo}`
      }

      if (foodInfo) {
        fullContext += `\n\nFood & Refreshments:\n${foodInfo}`
      }

      if (certificateInfo) {
        fullContext += `\n\nCertificates & Rewards:\n${certificateInfo}`
      }

      if (registrationInfo) {
        fullContext += `\n\nRegistration Information:\n${registrationInfo}`
      }

      if (eventFaqs) {
        fullContext += `\n\nFAQs:\n${eventFaqs}`
      }

      const eventData: EventData = {
        name: eventName,
        organizer: organizerName,
        details: fullContext,
        time: timeString,
        whatsappNumber: organizerPhone.replace(/\D/g, ''),
      }

      const response = await createEvent(eventData)

      if (response.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatLink', response.link)
          localStorage.setItem('eventName', eventName)

          if (response.event) {
            localStorage.setItem('eventData', JSON.stringify(response.event))
          }
        }
        router.push('/success')
      } else {
        setError(response.error || 'Failed to create event')
      }
    } catch (err) {
      console.error('Error creating event:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
              </div>

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

              <div className="grid gap-2">
                <Label>Timezone</Label>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-500" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
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
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Textarea
                  id="venueAddress"
                  placeholder="Enter the full address of the venue..."
                  className="min-h-[80px]"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide the complete address including building name, street, city, and postal code.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parkingInfo">Parking Information</Label>
                <Textarea
                  id="parkingInfo"
                  placeholder="Enter details about parking availability, costs, etc..."
                  className="min-h-[80px]"
                  value={parkingInfo}
                  onChange={(e) => setParkingInfo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include information about parking options, costs, and any special arrangements.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accommodationInfo">Accommodation Information</Label>
                <Textarea
                  id="accommodationInfo"
                  placeholder="Enter details about nearby hotels, special rates, etc..."
                  className="min-h-[80px]"
                  value={accommodationInfo}
                  onChange={(e) => setAccommodationInfo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide information about recommended hotels, special rates, or accommodation arrangements.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="foodInfo">Food & Refreshments</Label>
                <Textarea
                  id="foodInfo"
                  placeholder="Enter details about meals, refreshments, dietary options, etc..."
                  className="min-h-[80px]"
                  value={foodInfo}
                  onChange={(e) => setFoodInfo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Describe what food and drinks will be provided, meal times, and dietary accommodations.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="certificateInfo">Certificates & Rewards</Label>
                <Textarea
                  id="certificateInfo"
                  placeholder="Enter details about certificates, prizes, rewards, etc..."
                  className="min-h-[80px]"
                  value={certificateInfo}
                  onChange={(e) => setCertificateInfo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Specify if certificates will be provided, any prizes or rewards, and eligibility criteria.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationInfo">Registration Information</Label>
                <Textarea
                  id="registrationInfo"
                  placeholder="Enter details about registration process, deadlines, fees, etc..."
                  className="min-h-[80px]"
                  value={registrationInfo}
                  onChange={(e) => setRegistrationInfo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include registration deadlines, fees, process, and any special requirements.
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
              </div>

              {/* PDF upload section removed */}
            </div>

            {error && (
              <div className="p-3 text-sm border border-red-300 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Event Chat"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}