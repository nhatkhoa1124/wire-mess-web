import { fetchAPI } from '../../../../lib/api';

export async function GET(request) {
  try {
    // Get Authorization header from request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return Response.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const data = await fetchAPI('/users/me', {
      headers: {
        'Authorization': authHeader,
      },
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to fetch user information' },
      { status: 500 }
    );
  }
}
