"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search, UserPlus, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getEvents, Event } from "@/lib/api/eventService"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Form state for event settings
  const [eventName, setEventName] = useState<string>('')
  const [eventDate, setEventDate] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [whatsappNumber, setWhatsappNumber] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const eventsData = await getEvents()
        setEvents(eventsData)

        // Select the first event by default if available
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0])

          // Initialize form state with selected event data
          setEventName(eventsData[0].name)
          setEventDate(eventsData[0].time)
          setEventDescription(eventsData[0].details)
          setWhatsappNumber(eventsData[0].whatsappNumber)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Mock attendees for demonstration - in a real app, this would come from the backend
  const mockAttendees = [
    { id: 1, name: "John Doe", email: "john@example.com", ticketId: "TKT-001", status: "Confirmed" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", ticketId: "TKT-002", status: "Pending" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", ticketId: "TKT-003", status: "Confirmed" },
  ]

  const filteredAttendees = mockAttendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading events...</span>
        </div>
      ) : error ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No events found</h2>
          <p className="mt-2 text-muted-foreground">Create your first event to get started</p>
          <Button className="mt-4" onClick={() => window.location.href = '/create'}>Create Event</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Event Dashboard</h1>
              <p className="text-muted-foreground">{selectedEvent?.name || 'Select an event'}</p>
            </div>
            <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Attendee
          </Button>
            </div>
          </div>

          {events.length > 1 && (
            <div className="mb-6">
              <Label htmlFor="eventSelect">Select Event</Label>
              <select
                id="eventSelect"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const selected = events.find(event => event.id === e.target.value)
                  if (selected) {
                    setSelectedEvent(selected)

                    // Update form state when event selection changes
                    setEventName(selected.name)
                    setEventDate(selected.time)
                    setEventDescription(selected.details)
                    setWhatsappNumber(selected.whatsappNumber)
                  }
                }}
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendees.length}</div>
            <p className="text-xs text-muted-foreground">Total registrations for this event</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendees.filter((a) => a.status === "Confirmed").length}</div>
            <p className="text-xs text-muted-foreground">
              {mockAttendees.length > 0 ?
                `${Math.round((mockAttendees.filter((a) => a.status === "Confirmed").length / mockAttendees.length) * 100)}% of total` :
                'No registrations yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendees.filter((a) => a.status === "Pending").length}</div>
            <p className="text-xs text-muted-foreground">Needs follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendees" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="attendees">
            Attendees
          </TabsTrigger>
          <TabsTrigger value="settings">
            Event Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="attendees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Attendees</CardTitle>
              <CardDescription>Manage your event attendees and their registration status</CardDescription>
              <div className="mt-4 flex w-full items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search attendees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAttendees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.name}</TableCell>
                        <TableCell>{attendee.email}</TableCell>
                        <TableCell>{attendee.ticketId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attendee.status === "Confirmed"
                                ? "default"
                                : attendee.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {attendee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <UserPlus className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No registrations yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Share your WhatsApp link to start collecting registrations
                  </p>
                  <Button className="mt-4">Add Attendee Manually</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>Manage your event details and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEvent ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eventDescription">Event Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="whatsappLink">WhatsApp Link</Label>
                    <div className="flex gap-2">
                      <Input id="whatsappLink" defaultValue={selectedEvent.whatsappMessage} readOnly />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedEvent.whatsappMessage)
                          alert('Link copied to clipboard!')
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p>No event selected</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                {saveSuccess && (
                  <div className="text-green-500 flex items-center">
                    <span>Changes saved successfully!</span>
                  </div>
                )}
                <Button
                  onClick={() => {
                    setIsSaving(true);
                    // Simulate API call to save changes
                    setTimeout(() => {
                      setIsSaving(false);
                      setSaveSuccess(true);
                      // Hide success message after 3 seconds
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }, 1000);
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  )
}
