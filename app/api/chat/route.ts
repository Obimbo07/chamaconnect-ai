import { generateAIResponse } from '@/lib/mockAIResponses';
import { getChamaById, getUserById } from '@/lib/mockData';
import { buildRAGContext, formatRAGAsPrompt, detectQueryIntent } from '@/utils/ragPipeline';
import { checkHuggingFaceSetup } from '@/lib/checkApiSetup';

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
    // API key not configured - gracefully fall back to mock responses
    // This is expected behavior when users haven't set up Hugging Face integration
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
      // API call failed - log only in development and fall back to mock
      if (process.env.NODE_ENV === 'development') {
        console.error(`[RAG] Hugging Face API error (${response.status}): Falling back to mock responses`);
      }
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
    // Network or parsing error - fall back to mock responses
    if (process.env.NODE_ENV === 'development') {
      console.error('[RAG] Hugging Face API call failed, using mock responses:', error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

function detectLanguage(message: string): 'en' | 'sw' {
  const swahiliPatterns = /habari|mali|shares|kusave|mgogoro|mikopo|akshi|majibu|karibu|asante|rafiki|jamii|pesa|mali|akshi|heri|elimu|mwaliko|harusi/i;
  return swahiliPatterns.test(message) ? 'sw' : 'en';
}

export async function POST(request: Request) {
  // Check API setup once on first request
  checkHuggingFaceSetup();

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
