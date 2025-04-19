import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to create event with PDF');

    // Get the form data from the request
    const formData = await request.formData();

    // Log the form data keys for debugging
    console.log('Form data keys:', Array.from(formData.keys()));

    // Forward the request to the backend
    const response = await fetch('http://localhost:5000/api/event/create-with-pdf', {
      method: 'POST',
      body: formData,
    });

    // Log the response status
    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      console.error('Error from backend:', data.error || 'Unknown error');
      return NextResponse.json(
        { error: data.error || 'Failed to create event with PDF' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in event create-with-pdf API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
