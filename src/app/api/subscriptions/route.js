import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const response = await fetch(`${apiBaseUrl}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Subscriptions retrieved successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to retrieve subscriptions',
        error: result.message
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error retrieving subscriptions:', error);
    return NextResponse.json({
      success: false,
      message: 'Network error while retrieving subscriptions',
      error: error.message
    }, { status: 500 });
  }
}
