import { fetchAPI } from '../../../../lib/api';

/**
 * GET /api/messages/[id] - Get a message by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    const data = await fetchAPI(`/messages/${id}`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/messages/[id] - Update a message by ID
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const data = await fetchAPI(`/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to update message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/[id] - Delete a message by ID
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    await fetchAPI(`/messages/${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}
