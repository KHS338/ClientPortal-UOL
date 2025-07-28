import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const serviceType = searchParams.get('serviceType');
    
    console.log('Credit history API called for userId:', userId, 'limit:', limit, 'serviceType:', serviceType);
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('API Base URL:', apiBaseUrl);
    
    if (!apiBaseUrl) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set');
      return NextResponse.json({
        success: false,
        message: 'API configuration error',
        error: 'Backend URL not configured'
      }, { status: 500 });
    }
    
    let url = `${apiBaseUrl}/user-subscriptions/user/${userId}/credit-history?limit=${limit}`;
    if (serviceType) {
      url += `&serviceType=${serviceType}`;
    }
    
    console.log('Fetching from URL:', url);
    
    // Get the authorization token from cookies (which is set by the auth system)
    const cookieHeader = request.headers.get('cookie');
    let authToken = null;
    
    if (cookieHeader) {
      // Extract auth_token from cookies
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      authToken = cookies['auth_token'];
    }
    
    console.log('Auth token from cookies:', authToken ? 'Present' : 'Missing');
    
    // Prepare headers for backend request
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      return NextResponse.json({
        success: false,
        message: 'Failed to retrieve credit history',
        error: `Backend service error: ${response.status} - ${errorText}`
      }, { status: response.status });
    }

    const result = await response.json();
    console.log('Backend response data:', result);

    return NextResponse.json({
      success: true,
      creditHistory: result.data || [],
      message: 'Credit history retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving credit history:', error);
    
    // If the backend is not available, return mock data for testing
    if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      console.log('Backend not available, returning mock data');
      return NextResponse.json({
        success: true,
        creditHistory: [
          {
            id: 1,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'cv-sourcing',
            roleTitle: 'Senior Software Engineer',
            createdAt: new Date().toISOString(),
            remainingCreditsAfter: 24,
            description: 'Credit used for CV Sourcing role posting'
          },
          {
            id: 2,
            actionType: 'usage',
            creditAmount: 1,
            serviceType: 'prequalification',
            roleTitle: 'Marketing Manager',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            remainingCreditsAfter: 25,
            description: 'Credit used for Prequalification service'
          },
          {
            id: 3,
            actionType: 'purchase',
            creditAmount: 50,
            serviceType: null,
            roleTitle: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            remainingCreditsAfter: 26,
            description: 'Credits purchased - Premium Plan'
          }
        ],
        message: 'Mock credit history retrieved (backend not available)'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve credit history',
      error: error.message
    }, { status: 500 });
  }
}
