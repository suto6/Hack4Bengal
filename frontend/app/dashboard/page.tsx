"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const mockAttendees = [
  { id: 1, name: "John Doe", email: "john@example.com", ticketId: "TKT-001", status: "Confirmed" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", ticketId: "TKT-002", status: "Pending" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", ticketId: "TKT-003", status: "Confirmed" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", ticketId: "TKT-004", status: "Cancelled" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", ticketId: "TKT-005", status: "Confirmed" },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  // Removed unused state variable 'showAttendees'

  const filteredAttendees = mockAttendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Event Dashboard</h1>
          <p className="text-muted-foreground">Tech Conference 2023</p>
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

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendees.length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendees.filter((a) => a.status === "Confirmed").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockAttendees.filter((a) => a.status === "Confirmed").length / mockAttendees.length) * 100)}%
              of total
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
              <div className="grid gap-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" defaultValue="Tech Conference 2023" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input id="eventDate" defaultValue="October 15, 2023" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventDescription">Event Description</Label>
                <Textarea
                  id="eventDescription"
                  defaultValue="Join us for a day of tech talks and networking opportunities."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
