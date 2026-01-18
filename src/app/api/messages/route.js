import { fetchAPI } from '../../../lib/api';

/**
 * POST /api/messages - Create a new message
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Handle FormData for file uploads
    const contentType = request.headers.get('content-type');
    let body;
    
    if (contentType?.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      body = await request.json();
    }
    
    const data = await fetchAPI('/messages', {
      method: 'POST',
      body: body,
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to create message' },
      { status: 500 }
    );
  }
}
