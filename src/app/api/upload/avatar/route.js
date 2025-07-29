import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar');
    const userId = formData.get('userId');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `avatar_${userId}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return the URL path
    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user avatar in backend
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiBaseUrl) {
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

        const headers = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const updateResponse = await fetch(`${apiBaseUrl}/users/${userId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ avatar: avatarUrl })
        });

        if (!updateResponse.ok) {
          console.warn('Failed to update user avatar in backend:', await updateResponse.text());
        }
      }
    } catch (error) {
      console.warn('Error updating user avatar in backend:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading avatar', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user avatar in backend to null
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiBaseUrl) {
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

        const headers = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const updateResponse = await fetch(`${apiBaseUrl}/users/${userId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ avatar: null })
        });

        if (!updateResponse.ok) {
          console.warn('Failed to remove user avatar in backend:', await updateResponse.text());
        }
      }
    } catch (error) {
      console.warn('Error removing user avatar in backend:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully'
    });

  } catch (error) {
    console.error('Error removing avatar:', error);
    return NextResponse.json(
      { success: false, message: 'Error removing avatar', error: error.message },
      { status: 500 }
    );
  }
}
