"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, FileText, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateEventPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState<{hours: string, minutes: string}>({hours: "", minutes: ""})
  const [endTime, setEndTime] = useState<{hours: string, minutes: string}>({hours: "", minutes: ""})
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")

  const handleStartTimeChange = (field: 'hours' | 'minutes', value: string) => {
    setStartTime(prev => ({ ...prev, [field]: value }))
  }

  const handleEndTimeChange = (field: 'hours' | 'minutes', value: string) => {
    setEndTime(prev => ({ ...prev, [field]: value }))
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

              {/* Date and Time Selection Section - Updated with start/end times */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date & Time Column */}
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <div className="flex flex-col gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={cn("w-full justify-start text-left font-normal", (!startDate || (!startTime.hours && !startTime.minutes)) && "text-muted-foreground")}
                            disabled={!startDate}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {startTime.hours || startTime.minutes ? 
                              `${startTime.hours.padStart(2, '0')}:${startTime.minutes.padStart(2, '0')}` : 
                              "Select start time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <div className="grid gap-2">
                            <Label htmlFor="startHours">Hours</Label>
                            <Input 
                              id="startHours" 
                              type="number" 
                              min="0" 
                              max="23" 
                              placeholder="HH" 
                              className="w-[80px]"
                              value={startTime.hours}
                              onChange={(e) => handleStartTimeChange('hours', e.target.value)}
                            />
                            <Label htmlFor="startMinutes">Minutes</Label>
                            <Input 
                              id="startMinutes" 
                              type="number" 
                              min="0" 
                              max="59" 
                              placeholder="MM" 
                              className="w-[80px]"
                              value={startTime.minutes}
                              onChange={(e) => handleStartTimeChange('minutes', e.target.value)}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* End Date & Time Column */}
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <div className="flex flex-col gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={cn("w-full justify-start text-left font-normal", (!endDate || (!endTime.hours && !endTime.minutes)) && "text-muted-foreground")}
                            disabled={!endDate}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {endTime.hours || endTime.minutes ? 
                              `${endTime.hours.padStart(2, '0')}:${endTime.minutes.padStart(2, '0')}` : 
                              "Select end time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <div className="grid gap-2">
                            <Label htmlFor="endHours">Hours</Label>
                            <Input 
                              id="endHours" 
                              type="number" 
                              min="0" 
                              max="23" 
                              placeholder="HH" 
                              className="w-[80px]"
                              value={endTime.hours}
                              onChange={(e) => handleEndTimeChange('hours', e.target.value)}
                            />
                            <Label htmlFor="endMinutes">Minutes</Label>
                            <Input 
                              id="endMinutes" 
                              type="number" 
                              min="0" 
                              max="59" 
                              placeholder="MM" 
                              className="w-[80px]"
                              value={endTime.minutes}
                              onChange={(e) => handleEndTimeChange('minutes', e.target.value)}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
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

            <Button type="submit" className="w-full">
              Generate WhatsApp Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}