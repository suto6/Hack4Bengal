// lib/api/testConnection.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Test the connection to the backend
 * @returns Promise with health check response
 */
export const testBackendConnection = async (): Promise<{ status: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  } catch (error) {
    console.error('Error testing backend connection:', error);
    throw new Error('Failed to connect to backend');
  }
};
