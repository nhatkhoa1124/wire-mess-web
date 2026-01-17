import { fetchAPI } from '@/lib/api';

export async function GET(request) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use fetchAPI to get user data
    const data = await fetchAPI('/users/me', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });
    
    console.log('Backend response from /users/me:', data);
    
    // Return the backend response as-is
    // The frontend will map it to the appropriate format
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
