"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"

// Define the FAQ type
interface FAQ {
  question: string;
  answer: string;
}

export default function SimpleCreatePage() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add a new FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  // Remove an FAQ
  const removeFaq = (index: number) => {
    if (faqs.length > 1) {
      const newFaqs = [...faqs];
      newFaqs.splice(index, 1);
      setFaqs(newFaqs);
    }
  };

  // Update an FAQ
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!eventName) {
        setError('Event name is required');
        setIsLoading(false);
        return;
      }

      if (!organizer) {
        setError('Organizer name is required');
        setIsLoading(false);
        return;
      }

      if (!additionalInfo) {
        setError('Additional information is required');
        setIsLoading(false);
        return;
      }

      // Filter out empty FAQs
      const validFaqs = faqs.filter(faq => faq.question.trim() && faq.answer.trim());

      // Prepare the data to send to the backend
      const eventData = {
        name: eventName,
        organizer,
        details: additionalInfo, // This maps to 'details' field in the backend
        startTime,
        endTime,
        date,
        contactNumber,
        faqs: validFaqs
      };

      console.log('Sending event data to API:', JSON.stringify(eventData));

      // Send the data to the backend
      console.log('Submitting form to API...');
      try {
        const response = await fetch('/api/event/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });

        console.log('API response status:', response.status);

        // Log response headers
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('API response headers:', headers);

        const data = await response.json();
        console.log('API response data:', data);

        if (response.ok) {
          // Store the event data in localStorage for the chat page to use
          if (typeof window !== 'undefined' && data.event) {
            localStorage.setItem('chatLink', data.link);
            localStorage.setItem('eventName', eventName);
            localStorage.setItem('eventData', JSON.stringify(data.event));
          }

          // Redirect to success page
          router.push('/success');
        } else {
          setError(data.error || 'Failed to create event');
        }
      } catch (error) {
        console.error('Error creating event:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Event</CardTitle>
          <CardDescription>Fill in the details below to set up your event chat assistant</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="Tech Conference 2023"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer Name</Label>
              <Input
                id="organizer"
                placeholder="Your Organization"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="June 15, 2023"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  placeholder="10:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  placeholder="5:00 PM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">This number will be displayed on the event chat page</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Enter all the details about your event..."
                required
                className="min-h-[150px]"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include information like venue, agenda, speakers, etc. This will help the AI answer questions accurately.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>FAQs (Question-Answer Pairs)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFaq}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add FAQ
                </Button>
              </div>

              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-md relative">
                  {faqs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => removeFaq(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor={`question-${index}`}>Question</Label>
                    <Input
                      id={`question-${index}`}
                      placeholder="What time does the event start?"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`answer-${index}`}>Answer</Label>
                    <Textarea
                      id={`answer-${index}`}
                      placeholder="The event starts at 10:00 AM on June 15, 2023."
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              ))}

              <p className="text-xs text-muted-foreground">
                Add frequently asked questions and their answers. This helps the AI provide accurate responses to common questions.
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Event Chat"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
