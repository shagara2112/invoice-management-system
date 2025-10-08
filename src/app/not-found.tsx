'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">404 - Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => router.push('/')}>Home</Button>
            <Button variant="outline" onClick={() => router.push('/debug')}>
              Debug
            </Button>
            <Button variant="outline" onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}