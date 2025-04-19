'use client';

import { useState, useEffect } from 'react';
import { testBackendConnection } from '@/lib/api/testConnection';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const testConnection = async () => {
    setStatus('loading');
    try {
      const response = await testBackendConnection();
      setStatus('success');
      setMessage(`Backend connection successful: ${response.status}`);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to backend. Make sure the backend server is running.');
    }
  };

  useEffect(() => {
    // Test connection on component mount, but only on the client side
    if (typeof window !== 'undefined') {
      testConnection();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-md">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Backend Connection Status:</h3>
        {status === 'loading' && <span>Testing connection...</span>}
        {status === 'success' && (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle className="h-5 w-5" />
            Connected
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1 text-red-500">
            <AlertCircle className="h-5 w-5" />
            Not Connected
          </span>
        )}
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <Button variant="outline" size="sm" onClick={testConnection} disabled={status === 'loading'}>
        Test Connection
      </Button>
    </div>
  );
}
