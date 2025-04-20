import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    console.log('Received chat message request');

    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { eventId, message } = body;

    if (!eventId || !message) {
      console.error('Missing required parameters:', { eventId, message });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Sending chat message to backend:', { eventId, message: message.substring(0, 50) + (message.length > 50 ? '...' : '') });

    // We'll use the backend API for all events, including mock events
    console.log('Sending request to backend API');

    // For real events, try to make the direct API request to the backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Get the backend URL from environment variables or use default
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      console.log(`Connecting to backend at: ${backendUrl}/api/chat`);

      const response = await axios.post(`${backendUrl}/api/chat`,
        { eventId, message },
        {
          timeout: 10000,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      clearTimeout(timeoutId);
      console.log('Received response from backend');
      return NextResponse.json(response.data);
    } catch (backendError: unknown) {
      console.log('Backend API error, using local fallback:', backendError instanceof Error ? backendError.message : 'Unknown error');

      // Fallback logic when backend API fails
      try {
        // Try to fetch the event data for better fallback response
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host') || 'localhost:3008';
        const baseUrl = `${protocol}://${host}`;

        const eventResponse = await fetch(`${baseUrl}/api/event/${eventId}`, { method: 'GET' });

        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          const question = message.toLowerCase();
          let response = '';

          // Generate intelligent response based on event data
          const context = eventData.context || eventData.details;
          const timeMatch = context.match(/\b\d{1,2}[:.:.]\d{2}\b/);
          const dateMatch = context.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/);
          const locationMatch = context.match(/(?:at|in)\s+([^.,]+)/);

          const hasTravelInfo = context.toLowerCase().includes('travel') || context.toLowerCase().includes('transport');
          const hasAccommodationInfo = context.toLowerCase().includes('accommodation') || context.toLowerCase().includes('hotel');
          const hasCertificateInfo = context.toLowerCase().includes('certificate');
          const hasGoodiesInfo = context.toLowerCase().includes('goodies') || context.toLowerCase().includes('swag');

          // Check if there are FAQs in the context
          const hasFaqs = context.toLowerCase().includes('frequently asked questions') || context.toLowerCase().includes('faqs');

          // Try to find a matching FAQ
          let faqAnswer = null;
          if (hasFaqs) {
            const faqSection = context.substring(context.toLowerCase().indexOf('frequently asked questions'));
            const faqRegex = new RegExp(`Q:\s*([^\n]*${message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\n]*)\s*\n\s*A:\s*([^\n]*)`, 'i');
            const faqMatch = faqSection.match(faqRegex);

            if (faqMatch && faqMatch[2]) {
              faqAnswer = faqMatch[2].trim();
            }
          }

          // If we found a matching FAQ, use that answer
          if (faqAnswer) {
            response = faqAnswer;
          }
          // Otherwise, use the fallback logic
          else if (question.includes('when') || question.includes('time') || question.includes('date')) {
            if (timeMatch && dateMatch) {
              response = `The event is scheduled for ${dateMatch[0]} at ${timeMatch[0]}.`;
            } else {
              response = `The event is scheduled for ${eventData.time}.`;
            }
          } else if (question.includes('where') || question.includes('location') || question.includes('venue')) {
            if (locationMatch) {
              response = `The event will be held at ${locationMatch[1]}.`;
            } else {
              response = `Please check the event details for location information.`;
            }
          } else if (question.includes('who') || question.includes('organizer')) {
            response = `This event is organized by ${eventData.organizer}.`;
          } else if (question.includes('certificate') || question.includes('certification')) {
            response = hasCertificateInfo
              ? `Certificates will be provided to participants.`
              : `Please contact the organizer about certificates.`;
          } else if (question.includes('goodies') || question.includes('swag') || question.includes('gift')) {
            response = hasGoodiesInfo
              ? `There will be goodies for participants.`
              : `Please contact the organizer about goodies.`;
          } else if (question.includes('travel') || question.includes('transport') || question.includes('how to get')) {
            response = hasTravelInfo
              ? `Travel information is available in the event details.`
              : `Please contact the organizer about travel.`;
          } else if (question.includes('accommodation') || question.includes('hotel') || question.includes('stay')) {
            response = hasAccommodationInfo
              ? `Accommodation information is available in the event details.`
              : `Please contact the organizer about accommodation.`;
          } else {
            // Check if we have FAQs but couldn't find an exact match
            if (hasFaqs) {
              response = `I don't have specific information about "${message}". Please check the FAQs section in the event details or contact the organizer.`;
            } else {
              // Generic response for other questions
              response = `For more details about "${message}", please check the event information or contact the organizer.`;
            }
          }

          return NextResponse.json({ response });
        }
      } catch (eventFetchError) {
        console.error('Error fetching event data for fallback response:', eventFetchError);
      }

      // Final fallback if everything else fails
      return NextResponse.json({
        response: `I'm having trouble accessing event details. Please try again later or contact the organizer directly.`
      });
    }
  } catch (error) {
    console.error('Unexpected error in chat API route:', error);
    return NextResponse.json({
      response: "I'm sorry, I encountered an unexpected error. Please try again later."
    }, { status: 500 });
  }
}