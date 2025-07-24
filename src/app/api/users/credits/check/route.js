// src/app/api/users/credits/check/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, serviceType } = await request.json();
    
    if (!userId || !serviceType) {
      return NextResponse.json({
        success: false,
        message: 'User ID and service type are required'
      }, { status: 400 });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${apiBaseUrl}/user-subscriptions/user/${userId}/check-credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceType })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        hasCredits: result.hasCredits,
        remainingCredits: result.remainingCredits,
        serviceType: result.serviceType,
        subscriptionTitle: result.subscriptionTitle,
        message: result.message
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || 'Failed to check credits'
      }, { status: response.status || 500 });
    }

  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json({
      success: false,
      message: 'Network error while checking credits',
      error: error.message
    }, { status: 500 });
  }
}
