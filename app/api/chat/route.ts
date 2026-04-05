import { generateAIResponse } from '@/lib/mockAIResponses';
import { getChamaById, getUserById } from '@/lib/mockData';
import { buildRAGContext, formatRAGAsPrompt, detectQueryIntent } from '@/utils/ragPipeline';

interface HFResponse {
  generated_text: string;
}

async function callHuggingFaceAPI(
  systemPrompt: string,
  userMessage: string,
  language: 'en' | 'sw'
): Promise<string | null> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    console.warn('HUGGINGFACE_API_KEY not set, falling back to mock responses');
    return null;
  }

  try {
    // Use text-generation model with context
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Hugging Face API error: ${response.status}`, await response.text());
      return null;
    }

    const data = (await response.json()) as HFResponse[];
    if (data && data[0] && data[0].generated_text) {
      // Extract only the assistant's response
      const text = data[0].generated_text;
      const assistantResponse = text.split('Assistant:')[1]?.trim() || text;
      return assistantResponse;
    }

    return null;
  } catch (error) {
    console.warn('Hugging Face API call failed:', error);
    return null;
  }
}

function detectLanguage(message: string): 'en' | 'sw' {
  const swahiliPatterns = /habari|mali|shares|kusave|mgogoro|mikopo|akshi|majibu|karibu|asante|rafiki|jamii|pesa|mali|akshi|heri|elimu|mwaliko|harusi/i;
  return swahiliPatterns.test(message) ? 'sw' : 'en';
}

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

    // Detect language
    const language = detectLanguage(message);

    // Build RAG context from mock data
    const ragContext = buildRAGContext(message, user, chama);
    const systemPrompt = formatRAGAsPrompt(ragContext, language);

    // Attempt real Hugging Face API call
    let aiResponse = await callHuggingFaceAPI(systemPrompt, message, language);

    // Fallback to mock responses if API fails
    if (!aiResponse) {
      const mockResponse = generateAIResponse(message, user, chama);
      aiResponse = mockResponse.text;
    }

    // Return response with RAG context metadata
    return Response.json({
      message: aiResponse,
      language,
      timestamp: new Date().toISOString(),
      ragContext: {
        intent: detectQueryIntent(message),
        hasRealAPIResponse: aiResponse !== generateAIResponse(message, user, chama).text,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
