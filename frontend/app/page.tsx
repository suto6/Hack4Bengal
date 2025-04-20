import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Calendar, Users } from "lucide-react";
import Spline from "@splinetool/react-spline";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-8">

{/* Hero Section with Fixed Cursor Position */}
<section className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
  <div className="flex flex-col gap-6 md:max-w-[50%]">
    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
      <span className="typewriter-effect">Welcome to</span>
      <br />
      <div className="relative inline-flex">
        <span className="text-primary typewriter-effect-green">Whatsevent</span>
        <span className="cursor-adjacent"></span>
      </div>
    </h1>
    <p className="text-xl text-muted-foreground">
      Your Smart Assistant for Every Event
    </p>
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
  <div className="relative w-full max-w-[400px] aspect-[1/1]">
    <Spline scene="https://prod.spline.design/IuujcnbYbFVdd1jY/scene.splinecode" />
  </div>
</section>

      {/* Features Section */}
<section className="flex flex-col gap-8">
  <h2 className="text-center text-3xl font-bold typing-animation">How It Works</h2>
  <div className="grid gap-8 md:grid-cols-3">
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInLeft">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-500 hover:bg-primary/20">
        <Calendar className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-semibold">Create Your Event</h3>
      <p className="text-muted-foreground">
        Set up your event details, date, time, and description
      </p>
    </div>
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInUp">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-500 hover:bg-primary/20">
        <MessageSquare className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-semibold">Share Chatbot Link</h3>
      <p className="text-muted-foreground">
        Send the generated link to your attendees via any platform
      </p>
    </div>
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInRight">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-500 hover:bg-primary/20">
        <Users className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-semibold">Track Registrations</h3>
      <p className="text-muted-foreground">
        Monitor attendees and manage your event from the dashboard
      </p>
    </div>
  </div>
</section>
     
    </div>
  );
}
