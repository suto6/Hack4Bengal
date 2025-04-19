"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would submit the form data to an API
    router.push("/success")
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Event</CardTitle>
          <CardDescription>Fill in the details below to set up your WhatsApp ticketing flow</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" placeholder="Tech Conference 2023" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input id="organizerName" placeholder="Your name or organization" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerEmail">Organizer Email</Label>
                <Input id="organizerEmail" type="email" placeholder="you@example.com" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organizerPhone">Organizer Phone (optional)</Label>
                <Input id="organizerPhone" type="tel" placeholder="+1 (555) 123-4567" />
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
                        <Input id="hours" type="number" min="0" max="23" placeholder="HH" className="w-[80px]" />
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input id="minutes" type="number" min="0" max="59" placeholder="MM" className="w-[80px]" />
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
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="eventFaqs">FAQs / Extra Info</Label>
                <Textarea id="eventFaqs" placeholder="Additional information, FAQs, etc." className="min-h-[100px]" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Generate WhatsApp Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
