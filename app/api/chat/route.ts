import { generateAIResponse } from '@/lib/mockAIResponses';
import { getChamaById, getUserById } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userId, chamaId } = body;

    if (!message || !userId || !chamaId) {
      return Response.json(
        { error: 'Missing required fields: message, userId, chamaId' },
        { status: 400 }
      );
    }

    // Get user and chama data
    const user = getUserById(userId);
    const chama = getChamaById(chamaId);

    if (!user || !chama) {
      return Response.json(
        { error: 'User or chama not found' },
        { status: 404 }
      );
    }

    // Generate AI response
    const response = generateAIResponse(message, user, chama);

    return Response.json({
      message: response.text,
      language: response.language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
