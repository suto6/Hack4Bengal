import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Calendar, Users } from "lucide-react"
import { ConnectionTest } from "@/components/ConnectionTest"

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col gap-6 md:max-w-[50%]">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary">TicketzBot</span>
          </h1>
          <p className="text-xl text-muted-foreground">Create event ticketing flows directly in WhatsApp</p>
          <div className="flex gap-4">
            <Link href="/create">
              <Button size="lg" className="gap-2">
                Enter New Event
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex h-64 w-64 items-center justify-center rounded-full bg-primary/10 p-6 md:h-80 md:w-80">
          <MessageSquare className="h-32 w-32 text-primary md:h-40 md:w-40" />
        </div>
      </section>

      {/* Connection Test */}
      <section className="mx-auto max-w-2xl">
        <ConnectionTest />
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Create Your Event</h3>
            <p className="text-muted-foreground">Set up your event details, date, time, and description</p>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Share WhatsApp Link</h3>
            <p className="text-muted-foreground">Send the generated link to your attendees via any platform</p>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Registrations</h3>
            <p className="text-muted-foreground">Monitor attendees and manage your event from the dashboard</p>
          </div>
        </div>
      </section>
    </div>
  )
}
