// lib/api/eventService.ts
import axios from 'axios';

// Define the base URL for the API
// Using relative URL to leverage Next.js API proxy
const API_BASE_URL = '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface for event data
export interface EventData {
  name: string;
  organizer: string;
  details: string;
  time: string;
  whatsappNumber: string; // Used as contactNumber in the backend
}

// Interface for event response
export interface EventResponse {
  success: boolean;
  link: string;
  event?: {
    id: string;
    name: string;
    organizer: string;
    details: string;
    time: string;
    contactNumber: string;
    chatLink: string;
    whatsappNumber: string;
    whatsappMessage: string;
    context?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  error?: string;
}

// Interface for event list
export interface Event {
  id: string;
  name: string;
  organizer: string;
  details: string;
  time: string;
  contactNumber: string;
  chatLink: string;
  whatsappNumber: string;
  whatsappMessage: string;
  context?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Removed PDF upload function

/**
 * Create a new event
 * @param eventData Event data
 * @returns Promise with event response
 */
export const createEvent = async (eventData: EventData): Promise<EventResponse> => {
  try {
    // For debugging - log the data being sent
    console.log('Sending event data:', JSON.stringify(eventData));

    // Create a mock event for testing if needed
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Generate a mock event ID
      const mockEventId = 'mock-' + Date.now();
      // Generate a web chat link
      const chatLink = `/event/${mockEventId}`;

      console.log('Using mock event data for development');

      // Create an enhanced context with additional information for better chat responses
      const enhancedContext = `${eventData.details}\n\nThe event is organized by ${eventData.organizer} and will take place on ${eventData.time}.\n\nCertificates will be provided to all participants who attend the full event. There will be some goodies and swag for early registrants.`;

      // Store the event data in localStorage for the chat page to use
      localStorage.setItem('eventData', JSON.stringify({
        id: mockEventId,
        name: eventData.name,
        organizer: eventData.organizer,
        details: eventData.details,
        time: eventData.time,
        contactNumber: eventData.whatsappNumber,
        chatLink: chatLink,
        whatsappNumber: eventData.whatsappNumber,
        whatsappMessage: chatLink,
        context: enhancedContext,
      }));

      return {
        success: true,
        link: chatLink,
        event: {
          id: mockEventId,
          name: eventData.name,
          organizer: eventData.organizer,
          details: eventData.details,
          time: eventData.time,
          contactNumber: eventData.whatsappNumber,
          chatLink: chatLink,
          whatsappNumber: eventData.whatsappNumber,
          whatsappMessage: chatLink,
          context: enhancedContext,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };
    }

    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      // Make the API request with a timeout
      const response = await apiClient.post('/event/create', eventData, {
        timeout: 10000, // 10 second timeout
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Event created successfully:', response.data);
      return response.data;
    } catch (requestError) {
      clearTimeout(timeoutId);
      throw requestError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('Error creating event:', error);

    // Handle timeout errors
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return {
        success: false,
        link: '',
        error: 'Request timed out. Please try again.'
      };
    }

    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        link: '',
        error: 'Request timed out. Please try again.'
      };
    }

    // Handle API errors
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        link: '',
        error: error.response.data.error || 'Failed to create event'
      };
    }

    // Handle network errors
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
      // Create a mock event if network error in development
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const mockEventId = 'mock-' + Date.now();
        const chatLink = `/event/${mockEventId}`;

        console.log('Network error, using mock data');

        // Create an enhanced context with additional information for better chat responses
        const enhancedContext = `${eventData.details}\n\nThe event is organized by ${eventData.organizer} and will take place on ${eventData.time}.\n\nCertificates will be provided to all participants who attend the full event. There will be some goodies and swag for early registrants.`;

        // Store the event data in localStorage for the chat page to use
        localStorage.setItem('eventData', JSON.stringify({
          id: mockEventId,
          name: eventData.name,
          organizer: eventData.organizer,
          details: eventData.details,
          time: eventData.time,
          contactNumber: eventData.whatsappNumber,
          chatLink: chatLink,
          whatsappNumber: eventData.whatsappNumber,
          whatsappMessage: chatLink,
          context: enhancedContext,
        }));

        return {
          success: true,
          link: chatLink,
          event: {
            id: mockEventId,
            name: eventData.name,
            organizer: eventData.organizer,
            details: eventData.details,
            time: eventData.time,
            contactNumber: eventData.whatsappNumber,
            chatLink: chatLink,
            whatsappNumber: eventData.whatsappNumber,
            whatsappMessage: chatLink,
            context: enhancedContext,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };
      }

      return {
        success: false,
        link: '',
        error: 'Network error. Please check your connection and try again.'
      };
    }

    // Generic error
    return {
      success: false,
      link: '',
      error: 'Failed to create event: ' + (error instanceof Error ? error.message : String(error))
    };
  }
};

/**
 * Get all events
 * @returns Promise with list of events
 */
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await apiClient.get('/event');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Get event by ID
 * @param eventId Event ID
 * @returns Promise with event data
 */
export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    // First check if we have the event in localStorage
    if (typeof window !== 'undefined') {
      const storedEventData = localStorage.getItem('eventData');
      if (storedEventData) {
        const parsedEventData = JSON.parse(storedEventData);
        if (parsedEventData.id === eventId) {
          console.log('Found event in localStorage:', parsedEventData.name);
          return parsedEventData;
        }
      }
    }

    // If not in localStorage, try to get from the API
    console.log(`Fetching event with ID ${eventId} from API`);
    const response = await apiClient.get(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);

    // If we're in development mode, create a mock event
    if (process.env.NODE_ENV === 'development' && eventId.startsWith('test-')) {
      console.log('Creating mock event for development');
      return {
        id: eventId,
        name: 'Test Event',
        organizer: 'Test Organizer',
        details: 'This is a test event with all the details needed for testing the chat functionality. The event will be held at the Conference Center. There will be multiple speakers including John Doe and Jane Smith. Lunch and refreshments will be provided. Please bring your ID for registration.',
        time: 'June 15, 2023 at 10:00 AM',
        contactNumber: '1234567890',
        chatLink: `/event/${eventId}`,
        whatsappNumber: '1234567890',
        whatsappMessage: `/event/${eventId}`,
        context: 'This is a test event happening on June 15, 2023 at 10:00 AM at the Conference Center. The event will feature speakers including John Doe and Jane Smith on various topics including AI and machine learning. Lunch and refreshments will be provided. Please bring your ID for registration. Certificates will be provided to all participants who attend the full event. There will be some goodies and swag for early registrants.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    throw new Error('Event not found');
  }
};

/**
 * Send a chat message and get a response
 * @param eventId Event ID
 * @param message User message
 * @returns Promise with AI response
 */
export const sendChatMessage = async (eventId: string, message: string): Promise<{ response: string }> => {
  try {
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      // Make the API request with a timeout to the Next.js API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, message }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (requestError) {
      clearTimeout(timeoutId);
      throw requestError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('Error sending chat message:', error);

    // Try to get the event data from localStorage for fallback responses
    if (typeof window !== 'undefined') {
      try {
        // Check if we have the event data in localStorage
        const storedEventData = localStorage.getItem('eventData');
        if (storedEventData) {
          const event = JSON.parse(storedEventData);

          // If the stored event matches the requested event ID, use it for a fallback response
          if (event.id === eventId) {
            console.log('Using stored event data for fallback response');

            // Generate a simple response based on the question
            const question = message.toLowerCase();
            let response = '';

            if (question.includes('when') || question.includes('time') || question.includes('date')) {
              response = `The event is scheduled for ${event.time}.`;
            } else if (question.includes('where') || question.includes('location') || question.includes('venue')) {
              response = `Please check the event details for location information: ${event.details.substring(0, 100)}...`;
            } else if (question.includes('who') || question.includes('organizer')) {
              response = `This event is organized by ${event.organizer}.`;
            } else {
              response = `Thank you for your question. Here's what I know about the event: ${event.details.substring(0, 150)}...`;
            }

            return { response };
          }
        }
      } catch (fallbackError) {
        console.error('Error generating fallback response:', fallbackError);
      }
    }

    // If we get here, we couldn't generate a fallback response
    // Instead of throwing an error, return a generic response
    return {
      response: "I'm sorry, I couldn't connect to the server to answer your question. Please try again later or contact the event organizer for assistance."
    };
  }
};
