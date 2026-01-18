import { fetchAPI } from '../../../../lib/api';

/**
 * GET /api/conversations/[id] - Get a conversation by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    const data = await fetchAPI(`/conversations/${id}`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/conversations/[id] - Update a conversation by ID
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const data = await fetchAPI(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/[id] - Delete a conversation by ID
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    await fetchAPI(`/conversations/${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
