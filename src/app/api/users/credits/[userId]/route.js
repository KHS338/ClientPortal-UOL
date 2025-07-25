import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://8w2mk49p-3001.inc1.devtunnels.ms/';
    
    const response = await fetch(`${apiBaseUrl}/user-subscriptions/user/${userId}/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: 'Failed to retrieve user subscription data',
        error: 'Backend service error'
      }, { status: response.status });
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      credits: result.subscriptionHistory || [],
      totalRemainingCredits: result.totalRemainingCredits || 0,
      activeSubscription: result.activeSubscription,
      message: 'Credits retrieved successfully from user subscriptions'
    });

  } catch (error) {
    console.error('Error retrieving user credits:', error);
    return NextResponse.json({
      success: false,
      message: 'Network error while retrieving credits',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = params;
    const { creditsToUse } = await request.json();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://8w2mk49p-3001.inc1.devtunnels.ms/';
    
    const response = await fetch(`${apiBaseUrl}/user-subscriptions/user/${userId}/use-credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creditsToUse })
    });

    const result = await response.json();

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Credits used successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Insufficient credits or no active subscription'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json({
      success: false,
      message: 'Network error while using credits',
      error: error.message
    }, { status: 500 });
  }
}
