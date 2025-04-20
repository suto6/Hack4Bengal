import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Bot, Calendar, Users, Sparkles } from "lucide-react"
// import { ConnectionTest } from "@/components/ConnectionTest"

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col-reverse items-center gap-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-8 md:max-w-[55%]">
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full w-fit">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Event Assistant</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Let Your Event <br />Answer Its Own Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a smart chatbot for your event in seconds. Share the link anywhere and let AI handle all attendee queries automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/simple-create">
              <Button size="lg" className="gap-2 text-md px-8 py-6 hover:shadow-lg transition-all">
                Create Free Event Bot
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-md px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-lg"></div>
          <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl bg-background p-8 shadow-lg md:h-80 md:w-80 border border-border">
            <Bot className="h-40 w-40 text-primary" />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="mx-auto max-w-4xl text-center flex flex-col gap-6 px-4 bg-secondary/30 rounded-3xl p-8 border border-border">
        <h2 className="text-3xl font-bold">Stop Drowning in Repetitive Questions</h2>
        <p className="text-muted-foreground text-xl">
          Event organizers waste <span className="font-semibold text-primary">5-10 hours</span> per event answering the same questions about schedules, locations, and rules.
        </p>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-5xl flex flex-col md:flex-row gap-12 items-center px-4">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">Your 24/7 Event Support Agent</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>Attendees get <span className="font-semibold">instant answers</span> to all event questions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span><span className="font-semibold">No coding</span> required - just paste your event details</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>Works on <span className="font-semibold">any platform</span> - websites, social media, emails</span>
            </li>
          </ul>
        </div>
        <div className="md:w-1/2 bg-muted rounded-xl p-8 border border-border shadow-sm">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-background rounded-lg p-4 max-w-[80%]">
                <p>Hi! I am your WhatsEvent assistant. Ask me anything about the event!</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-4 max-w-[80%]">
                <p>What time does the event start?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-background rounded-lg p-4 max-w-[80%]">
                <p>The event starts at 9:00 AM on Saturday, June 15th. Do not forget to register beforehand!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - How It Works */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">How WhatsEvent Works</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Three simple steps to automate your event communication</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 px-4">
          <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center hover:shadow-md transition-all">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">1. Create Your Event</h3>
            <p className="text-muted-foreground">Fill in your event details in our simple form. No technical skills needed.</p>
          </div>
          <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center hover:shadow-md transition-all">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">2. Get Your Chat Link</h3>
            <p className="text-muted-foreground">We instantly generate a unique chatbot link for your event.</p>
          </div>
          <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center hover:shadow-md transition-all">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">3. Share & Relax</h3>
            <p className="text-muted-foreground">Post the link anywhere. The bot handles all questions automatically.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl text-center flex flex-col gap-8 px-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 border border-border">
        <h2 className="text-3xl font-bold">Ready to Transform Your Event Communication?</h2>
        <p className="text-muted-foreground text-xl">
          Join hundreds of organizers saving hours every week with automated attendee support.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/simple-create">
            <Button size="lg" className="gap-2 text-md px-8 py-6 hover:shadow-lg transition-all">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      {/* <ConnectionTest /> */}
    </div>
  )
}