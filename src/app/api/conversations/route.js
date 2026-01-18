import { fetchAPI } from '../../../lib/api';

/**
 * GET /api/conversations - Get all conversations or user's conversations
 */
export async function GET(request) {
  try {
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

/**
 * POST /api/conversations - Create a new conversation
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const data = await fetchAPI('/conversations', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
