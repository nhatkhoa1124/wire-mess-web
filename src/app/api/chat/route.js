import { fetchAPI } from '../../../../lib/api';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const data = await fetchAPI('/chat', {
      method: 'POST',
      body: { username, password },
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message || 'Login failed' },
      { status: 400 }
    );
  }
}