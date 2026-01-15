import { fetchAPI } from '../../../lib/api';

export async function GET(request) {
  try {
    // Get Authorization header from request
    const authHeader = request.headers.get('authorization');
    
    const data = await fetchAPI('/conversations/me', {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}