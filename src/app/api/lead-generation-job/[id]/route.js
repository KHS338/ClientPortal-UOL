import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://8w2mk49p-3001.inc1.devtunnels.ms/';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const response = await fetch(`${BACKEND_URL}/lead-generation-job/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch lead generation job', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/lead-generation-job/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update lead generation job', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get('hard');
    
    let url = `${BACKEND_URL}/lead-generation-job/${id}`;
    if (hard) {
      url += `?hard=${hard}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead generation job', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'restore') {
      const response = await fetch(`${BACKEND_URL}/lead-generation-job/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to restore lead generation job', error: error.message },
      { status: 500 }
    );
  }
}
