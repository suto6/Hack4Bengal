import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to create event');

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

    // Validate required fields
    const { name, organizer, details, time, whatsappNumber } = body;
    if (!name || !organizer || !details || !time || !whatsappNumber) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward the request to the backend with a timeout
    console.log('Forwarding request to backend');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('http://localhost:5000/api/event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Log the response status
      console.log('Backend response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error('Error from backend:', data.error || 'Unknown error');
        return NextResponse.json(
          { error: data.error || 'Failed to create event' },
          { status: response.status }
        );
      }

      console.log('Event created successfully');
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request to backend timed out');
        return NextResponse.json(
          { error: 'Request to backend timed out' },
          { status: 504 }
        );
      }
      throw fetchError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('Error in event create API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
