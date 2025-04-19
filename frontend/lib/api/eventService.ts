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
  whatsappNumber: string;
  pdf?: File;
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
    whatsappNumber: string;
    whatsappMessage: string;
    context?: string;
    pdfPath?: string;
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
  whatsappNumber: string;
  whatsappMessage: string;
  context?: string;
  pdfPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create a new event with PDF upload
 * @param eventData Event data including PDF file
 * @returns Promise with event response
 */
export const createEventWithPDF = async (eventData: EventData): Promise<EventResponse> => {
  try {
    const formData = new FormData();

    // Add all event data to form data
    formData.append('name', eventData.name);
    formData.append('organizer', eventData.organizer);
    formData.append('details', eventData.details);
    formData.append('time', eventData.time);
    formData.append('whatsappNumber', eventData.whatsappNumber);

    // Add PDF file if provided
    if (eventData.pdf) {
      formData.append('pdf', eventData.pdf);
    }

    // For testing when backend is not available
    if (process.env.NODE_ENV === 'development' && typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('Backend not available, using mock data');
      // Return mock data for testing
      // Use a mock Twilio number for testing
      const mockTwilioNumber = '15716011328'; // Without the + sign
      return {
        success: true,
        link: `https://wa.me/${mockTwilioNumber}?text=Hi%20about%20${encodeURIComponent(eventData.name)}`,
        event: {
          id: 'mock-id',
          name: eventData.name,
          organizer: eventData.organizer,
          details: eventData.details,
          time: eventData.time,
          whatsappNumber: eventData.whatsappNumber,
          whatsappMessage: `https://wa.me/${mockTwilioNumber}?text=Hi%20about%20${encodeURIComponent(eventData.name)}`,
          context: eventData.details,
        }
      };
    }

    // Make API request with form data
    const response = await apiClient.post('/event/create-with-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for large files
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          link: '',
          error: 'Request timed out. The server might be down or the file is too large.'
        };
      }
      if (error.message === 'Network Error') {
        return {
          success: false,
          link: '',
          error: 'Network error. Please check if the backend server is running.'
        };
      }
      if (error.response) {
        return {
          success: false,
          link: '',
          error: error.response.data.error || 'Failed to create event'
        };
      }
    }
    return { success: false, link: '', error: 'Failed to create event. Please try again later.' };
  }
};

/**
 * Create a new event without PDF
 * @param eventData Event data
 * @returns Promise with event response
 */
export const createEvent = async (eventData: Omit<EventData, 'pdf'>): Promise<EventResponse> => {
  try {
    const response = await apiClient.post('/event/create', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        link: '',
        error: error.response.data.error || 'Failed to create event'
      };
    }
    return { success: false, link: '', error: 'Failed to create event' };
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
