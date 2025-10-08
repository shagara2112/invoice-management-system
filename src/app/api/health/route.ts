import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we can connect to the database
    const { db } = await import('@/lib/db');
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'Error',
        timestamp: new Date().toISOString(),
        database: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}