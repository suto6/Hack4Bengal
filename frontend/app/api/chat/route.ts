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

    // Forward the request to the backend with a timeout
    try {
      // Create a controller for the timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Try to make the direct API request to the backend
      try {
        const response = await axios.post('http://localhost:5000/api/chat',
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
      } catch (backendError) {
        console.log('Backend API error, using local fallback:', backendError.message);
        // Continue to fallback logic below
      }

      // This code is now inside the try block above
    } catch (chatError) {
      console.error('Error calling backend chat API:', chatError);

      // We need to get the event data to provide a better fallback response
      try {
        // Try to fetch the event directly from the Next.js API
        // In a server component, we need to use the full URL
        // Get the base URL from the request headers or use a default
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host') || 'localhost:3008';
        const baseUrl = `${protocol}://${host}`;

        const eventResponse = await fetch(`${baseUrl}/api/event/${eventId}`, { method: 'GET' });

        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          const question = message.toLowerCase();
          let response = '';

          // Generate a response based on the event data
          if (question.includes('when') || question.includes('time') || question.includes('date')) {
            response = `The event is scheduled for ${eventData.time}.`;
          } else if (question.includes('where') || question.includes('location') || question.includes('venue')) {
            response = `Please check the event details for location information: ${eventData.details.substring(0, 100)}...`;
          } else if (question.includes('who') || question.includes('organizer')) {
            response = `This event is organized by ${eventData.organizer}.`;
          } else if (question.includes('certificate') || question.includes('goodies') || question.includes('swag')) {
            response = `I don't have specific information about certificates or goodies. Please contact the organizer (${eventData.organizer}) for details.`;
          } else {
            response = `Thank you for your question. Here's what I know about the event: ${eventData.details.substring(0, 150)}...`;
          }

          return NextResponse.json({ response });
        }
      } catch (eventFetchError) {
        console.error('Error fetching event data for fallback response:', eventFetchError);
      }

      // If we couldn't get the event data, provide a generic response
      const question = message.toLowerCase();
      let response = '';

      if (question.includes('when') || question.includes('time') || question.includes('date')) {
        response = `I'm sorry, I couldn't connect to the server to get the event time information.`;
      } else if (question.includes('where') || question.includes('location') || question.includes('venue')) {
        response = `I'm sorry, I couldn't connect to the server to get the venue information.`;
      } else if (question.includes('who') || question.includes('organizer')) {
        response = `I'm sorry, I couldn't connect to the server to get the organizer information.`;
      } else if (question.includes('certificate') || question.includes('goodies') || question.includes('swag')) {
        response = `I'm sorry, I couldn't connect to the server to get information about certificates or goodies.`;
      } else {
        response = `I'm sorry, I couldn't connect to the server to answer your question. Please try again later or contact the event organizer for assistance.`;
      }

      return NextResponse.json({ response });
    }
  } catch (error) {
    console.error('Unexpected error in chat API route:', error);
    return NextResponse.json({
      response: "I'm sorry, I encountered an unexpected error. Please try again later."
    });
  }
}
