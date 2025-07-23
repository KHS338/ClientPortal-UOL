import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${apiBaseUrl}/subscriptions/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Subscription data seeded successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to seed subscription data',
        error: result.message
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error seeding subscription data:', error);
    return NextResponse.json({
      success: false,
      message: 'Network error while seeding data',
      error: error.message
    }, { status: 500 });
  }
}
