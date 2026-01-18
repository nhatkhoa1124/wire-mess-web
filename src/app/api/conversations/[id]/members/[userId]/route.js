import { fetchAPI } from '../../../../../../lib/api';

/**
 * POST /api/conversations/[id]/members/[userId] - Add a member to a conversation
 */
export async function POST(request, { params }) {
  try {
    const { id, userId } = await params;
    const authHeader = request.headers.get('authorization');
    
    await fetchAPI(`/conversations/${id}/members/${userId}`, {
      method: 'POST',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json({ message: 'Member added successfully' });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to add member' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/[id]/members/[userId] - Remove a member from a conversation
 */
export async function DELETE(request, { params }) {
  try {
    const { id, userId } = await params;
    const authHeader = request.headers.get('authorization');
    
    await fetchAPI(`/conversations/${id}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to remove member' },
      { status: 500 }
    );
  }
}
