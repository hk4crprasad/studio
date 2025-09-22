import { NextRequest, NextResponse } from 'next/server';
import { getCarbonEmissionSuggestions } from '@/ai/flows/carbon-emission-suggestions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.lifestyle) {
      return NextResponse.json(
        { error: 'Lifestyle information is required' },
        { status: 400 }
      );
    }

    const result = await getCarbonEmissionSuggestions(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Carbon emission suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate carbon emission suggestions' },
      { status: 500 }
    );
  }
}