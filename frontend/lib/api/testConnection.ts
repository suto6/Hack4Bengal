// lib/api/testConnection.ts
import axios from 'axios';

// Using relative URL to leverage Next.js API proxy
const API_BASE_URL = '/api';

/**
 * Test the connection to the backend
 * @returns Promise with health check response
 */
export const testBackendConnection = async (): Promise<{ status: string }> => {
  try {
    // For testing when backend is not available
    if (process.env.NODE_ENV === 'development' && typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('Backend not available, using mock data');
      // Return mock data for testing
      return { status: 'ok (mocked)' };
    }

    const response = await axios.get('/health', { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('Error testing backend connection:', error);
    throw new Error('Failed to connect to backend');
  }
};
