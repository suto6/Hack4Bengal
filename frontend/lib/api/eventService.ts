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
        context: eventData.details,
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
          context: eventData.details,
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
          context: eventData.details,
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
            context: eventData.details,
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
    const response = await apiClient.get(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
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
    const response = await apiClient.post('/chat', { eventId, message });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to get response');
  }
};
