import { NextRequest, NextResponse } from 'next/server';
import { analyzeCarbonFootprint } from '@/ai/flows/analyze-carbon-footprint';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.activities) {
      return NextResponse.json(
        { error: 'Activities are required' },
        { status: 400 }
      );
    }

    const result = await analyzeCarbonFootprint({
      activities: body.activities,
      language: body.language || 'English',
      date: body.date || new Date().toISOString().split('T')[0]
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Carbon footprint analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze carbon footprint' },
      { status: 500 }
    );
  }
}