import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/api/eventService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, message } = body;

    if (!eventId || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await sendChatMessage(eventId, message);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
