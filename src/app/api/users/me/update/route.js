import { fetchAPI } from '@/lib/api';

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

    // Parse multipart/form-data
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const avatar = formData.get('avatar');

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

    // Build FormData for backend
    const backendFormData = new FormData();
    let hasData = false;

    if (username && username.trim() !== '') {
      backendFormData.append('username', username.trim());
      hasData = true;
    }
    if (email && email.trim() !== '') {
      backendFormData.append('email', email.trim());
      hasData = true;
    }
    if (phoneNumber && phoneNumber.trim() !== '') {
      backendFormData.append('phoneNumber', phoneNumber.trim());
      hasData = true;
    }
    if (avatar && avatar instanceof File) {
      // Convert File to Blob for axios
      const arrayBuffer = await avatar.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: avatar.type });
      backendFormData.append('avatar', blob, avatar.name);
      hasData = true;
    }

    // If no fields to update, return error
    if (!hasData) {
      return Response.json(
        { message: 'No fields to update' },
        { status: 400 }
      );
    }

    // Send multipart/form-data to backend using fetchAPI
    const data = await fetchAPI('/users/profile', {
      method: 'PUT',
      body: backendFormData,
      headers: {
        'Authorization': authHeader,
        // axios will set the correct Content-Type with boundary
      },
    });

    return Response.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    
    return Response.json(
      { message: error.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
