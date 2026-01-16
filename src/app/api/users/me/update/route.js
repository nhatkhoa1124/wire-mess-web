import { fetchAPI } from '../../../../../lib/api';

export async function PUT(request) {
  try {
    // Get Authorization header from request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return Response.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, email, phoneNumber, avatarUrl } = body;

    // Validate email format if provided
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json(
          { message: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate username if provided
    if (username && username.trim() !== '' && username.trim().length < 3) {
      return Response.json(
        { message: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Build request body with only non-empty fields
    const updateData = {};
    if (username && username.trim() !== '') {
      updateData.username = username.trim();
    }
    if (email && email.trim() !== '') {
      updateData.email = email.trim();
    }
    if (phoneNumber && phoneNumber.trim() !== '') {
      updateData.phoneNumber = phoneNumber.trim();
    }
    if (avatarUrl && avatarUrl.trim() !== '') {
      updateData.avatarUrl = avatarUrl.trim();
    }

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { message: 'No fields to update' },
        { status: 400 }
      );
    }

    const data = await fetchAPI('/users/me/update', {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
      },
      body: updateData,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
