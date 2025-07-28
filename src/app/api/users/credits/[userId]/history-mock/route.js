import { NextResponse } from 'next/server';

// Mock credit history data for testing when backend is not available
const mockCreditHistory = [
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
    actionType: 'usage',
    creditAmount: 1,
    serviceType: 'direct',
    roleTitle: 'Product Manager',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    remainingCreditsAfter: 26,
    description: 'Credit used for Direct service'
  },
  {
    id: 4,
    actionType: 'usage',
    creditAmount: 1,
    serviceType: 'lead-generation-job',
    roleTitle: 'Data Analyst',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    remainingCreditsAfter: 27,
    description: 'Credit used for Lead Generation Job service'
  },
  {
    id: 5,
    actionType: 'purchase',
    creditAmount: 50,
    serviceType: null,
    roleTitle: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    remainingCreditsAfter: 28,
    description: 'Credits purchased - Premium Plan'
  }
];

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    
    console.log('Mock credit history API called for userId:', userId, 'serviceType:', serviceType);
    
    // Filter by service type if specified
    let filteredHistory = mockCreditHistory;
    if (serviceType && serviceType !== 'all') {
      filteredHistory = mockCreditHistory.filter(item => item.serviceType === serviceType);
    }
    
    return NextResponse.json({
      success: true,
      creditHistory: filteredHistory,
      message: 'Mock credit history retrieved successfully'
    });

  } catch (error) {
    console.error('Error in mock credit history API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve mock credit history',
      error: error.message
    }, { status: 500 });
  }
}
