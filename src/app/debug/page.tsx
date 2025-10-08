'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [apiStatus, setApiStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEnvironment();
    checkApiStatus();
  }, []);

  const checkEnvironment = () => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    });
  };

  const checkApiStatus = async () => {
    const status: Record<string, string> = {};
    
    try {
      const response = await fetch('/api/health');
      status.health = response.ok ? 'OK' : 'Error';
    } catch (error) {
      status.health = 'Error';
    }
    
    try {
      const response = await fetch('/api/auth/me');
      status.auth = response.status === 401 ? 'Working (401)' : 'Error';
    } catch (error) {
      status.auth = 'Error';
    }
    
    try {
      const response = await fetch('/api/invoices');
      status.invoices = response.ok ? 'OK' : 'Error';
    } catch (error) {
      status.invoices = 'Error';
    }
    
    setApiStatus(status);
    setLoading(false);
  };

  const refresh = () => {
    setLoading(true);
    checkEnvironment();
    checkApiStatus();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Invoice Management System - Debug Page</CardTitle>
          <CardDescription>
            This page helps diagnose issues with your deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refresh} className="mb-4">Refresh</Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between mb-2">
                    <span>{key}:</span>
                    <Badge variant={value === 'Set' ? 'default' : 'destructive'}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Status</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Checking API status...</p>
                ) : (
                  Object.entries(apiStatus).map(([key, value]) => (
                    <div key={key} className="flex justify-between mb-2">
                      <span>/api/{key}:</span>
                      <Badge variant={value === 'OK' || value.includes('401') ? 'default' : 'destructive'}>
                        {value}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}