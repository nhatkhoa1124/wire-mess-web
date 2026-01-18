import { fetchAPI } from '../../../../../lib/api';

/**
 * GET /api/messages/conversation/[conversationId] - Get messages by conversation ID
 */
export async function GET(request, { params }) {
  try {
    const { conversationId } = await params;
    const authHeader = request.headers.get('authorization');
    
    // Get pagination params from query string
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '50';
    
    const data = await fetchAPI(`/messages/conversation/${conversationId}?page=${page}&pageSize=${pageSize}`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
