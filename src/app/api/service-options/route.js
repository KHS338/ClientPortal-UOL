import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiBaseUrl) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set');
      return NextResponse.json({
        success: false,
        message: 'API configuration error',
        error: 'Backend URL not configured'
      }, { status: 500 });
    }
    
    const url = `${apiBaseUrl}/subscriptions/service-options`;
    console.log('Fetching service options from URL:', url);
    
    // Get the authorization token from cookies
    const cookieHeader = request.headers.get('cookie');
    let authToken = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      authToken = cookies['auth_token'];
    }
    
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
        message: 'Failed to retrieve service options',
        error: `Backend service error: ${response.status} - ${errorText}`
      }, { status: response.status });
    }

    const result = await response.json();
    console.log('Backend response data:', result);

    return NextResponse.json({
      success: true,
      serviceOptions: result.data || [],
      message: 'Service options retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving service options:', error);
    
    // If the backend is not available, return fallback data
    if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      console.log('Backend not available, returning fallback service options');
      
      const fallbackOptions = [
        { value: '', label: 'All Services' },
        { value: 'cv-sourcing', label: 'CV Sourcing' },
        { value: 'prequalification', label: 'Prequalification' },
        { value: 'direct', label: '360/Direct' },
        { value: 'lead-generation', label: 'Lead Generation' },
      ];
      
      return NextResponse.json({
        success: true,
        serviceOptions: fallbackOptions,
        message: 'Service options retrieved successfully (fallback data)'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error while retrieving service options',
      error: error.message
    }, { status: 500 });
  }
}
