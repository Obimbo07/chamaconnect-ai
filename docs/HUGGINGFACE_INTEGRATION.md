# Hugging Face API Integration Guide

## Quick Start (2 minutes)

### 1. Get API Key
- Visit [Hugging Face Settings](https://huggingface.co/settings/tokens)
- Create a new token (read access is sufficient)
- Copy the token

### 2. Add to Environment
Create `.env.local` in project root:
```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

### 3. Restart Dev Server
```bash
pnpm dev
```

Done! AI Companion will now use real Hugging Face API responses.

## How It Works

### Architecture

```
User Query
    ↓
RAG Pipeline (extracting user/chama context)
    ↓
System Prompt (with financial context)
    ↓
Hugging Face API (Llama-2-7b-chat-hf model)
    ↓
Generated Response
    ↓
Fallback to Mock (if API fails)
```

### Models Available

ChamaAI uses: **meta-llama/Llama-2-7b-chat-hf**

Why this model?
- 7 billion parameters (good balance of quality/speed)
- Trained specifically for chat
- Works well with context injection
- Free tier access on Hugging Face
- Supports both English and Swahili

### Alternative Models

You can modify `/app/api/chat/route.ts` to use other models:

```typescript
// For faster responses (lighter model)
'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct'

// For better quality (but slower/more tokens)
'https://api-inference.huggingface.co/models/meta-llama/Llama-2-13b-chat-hf'

// For multilingual (Swahili support)
'https://api-inference.huggingface.co/models/bigscience/bloom-7b1'
```

## API Request/Response

### Request Format
```json
POST https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf
Authorization: Bearer hf_xxxxxxxxxxxxx
Content-Type: application/json

{
  "inputs": "System prompt + User message",
  "parameters": {
    "max_new_tokens": 256,
    "temperature": 0.7,
    "top_p": 0.9,
    "repetition_penalty": 1.2
  }
}
```

### Response Format
```json
[
  {
    "generated_text": "System prompt + User message + Generated response"
  }
]
```

### Parameters Explained

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `max_new_tokens` | 256 | Max length of response (higher = longer responses) |
| `temperature` | 0.7 | Creativity (0.1 = robotic, 1.0 = creative) |
| `top_p` | 0.9 | Diversity (lower = more focused) |
| `repetition_penalty` | 1.2 | Avoid repetition (higher = less repetition) |

Tuning tips:
- Slower responses? Lower `max_new_tokens` to 128
- Too robotic? Increase `temperature` to 0.9
- Off-topic responses? Lower `top_p` to 0.85

## Error Handling

### Scenario 1: No API Key Set
```
⚠️  HUGGINGFACE_API_KEY not set, falling back to mock responses
```
- App continues working with mock responses
- No API calls are made
- High quality hardcoded responses used

### Scenario 2: Rate Limited
```
⚠️  Hugging Face API error: 429
```
- User gets mock response instead
- No error shown to user (seamless)
- App continues working

### Scenario 3: Network Error
```
⚠️  Hugging Face API call failed: Network timeout
```
- Automatic fallback to mock response
- Logged for debugging
- User experience unaffected

### Scenario 4: Invalid API Key
```
⚠️  Hugging Face API error: 401
```
- Check `.env.local` for correct key
- Regenerate token on Hugging Face dashboard
- Restart dev server

## Monitoring & Debugging

### Check API Status
Browser console (Network tab):
1. Open DevTools → Network
2. Send a message in AI Companion
3. Look for request to `/api/chat`
4. Response contains `ragContext.hasRealAPIResponse: true` if using real API

### Debug Logs
In `/app/api/chat/route.ts`:
```typescript
console.log("[v0] RAG Context:", ragContext);
console.log("[v0] System Prompt:", systemPrompt);
console.log("[v0] API Response:", aiResponse);
console.log("[v0] Using mock fallback:", !aiResponse);
```

### Test With cURL
```bash
export HF_TOKEN="hf_your_token_here"

curl https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf \
  -X POST \
  -d '{"inputs": "Hello, how are you?"}' \
  -H "Authorization: Bearer $HF_TOKEN"
```

## Rate Limits

### Free Tier
- **Requests per minute**: ~30
- **Concurrent**: 1
- **Request size**: ~4KB per request
- **Token limit**: Varies by model (typically 2k-4k tokens)

### Paid Tier
- **No rate limits** (with throughput guarantee)
- **Price**: ~$0.01-0.02 per 1000 requests
- **Sign up**: https://huggingface.co/pricing

### Monitor Usage
- Dashboard: https://huggingface.co/settings/billing/overview
- Check for rate limit errors in server logs

## Production Deployment

### On Vercel
1. Add environment variable in Vercel dashboard:
   - Settings → Environment Variables
   - Key: `HUGGINGFACE_API_KEY`
   - Value: your token

2. Deploy and test:
   ```bash
   pnpm build
   ```

3. Verify API works in production:
   - Send test messages in deployed app
   - Check server logs for errors

### Best Practices
- Never commit `.env.local` to Git
- Use separate API keys for dev/prod
- Monitor rate limits in production
- Set up alerts for API errors
- Have mock responses as fallback (already implemented!)

## Cost Analysis

### Scenarios

**Scenario 1: Light Usage (10 messages/day)**
- API calls: 300/month
- Estimated cost: Free tier
- Status: Works on free tier

**Scenario 2: Medium Usage (100 messages/day)**
- API calls: 3,000/month
- Estimated cost: Free tier → Paid tier
- Status: Upgrade to paid if hitting rate limits

**Scenario 3: Heavy Usage (1,000 messages/day)**
- API calls: 30,000/month
- Estimated cost: ~$0.30-0.60/month
- Status: Very affordable even at scale

**Note**: Mock responses are FREE and high-quality!

## Customization

### Change System Prompt
File: `/utils/ragPipeline.ts`

```typescript
export function formatRAGAsPrompt(ragContext: RAGContext, language: 'en' | 'sw'): string {
  const systemPrompt =
    language === 'sw'
      ? `Your custom Swahili system prompt...`  // EDIT HERE
      : `Your custom English system prompt...`; // EDIT HERE
  return systemPrompt;
}
```

### Add New Intent Types
File: `/utils/ragPipeline.ts`

```typescript
export function detectQueryIntent(message: string): string[] {
  const intents: string[] = [];
  const messageLower = message.toLowerCase();

  // Add new intent
  if (messageLower.includes('investment') || messageLower.includes('uongezaji')) {
    intents.push('investments');
  }

  return intents.length > 0 ? intents : ['general'];
}
```

### Change Response Temperature
File: `/app/api/chat/route.ts`

```typescript
const response = await fetch('...', {
  body: JSON.stringify({
    inputs: fullPrompt,
    parameters: {
      temperature: 0.9,  // EDIT HERE (0.1-1.0)
      // ...
    },
  }),
});
```

## Testing with Mock Data

The RAG pipeline works perfectly with mock data. Test scenarios:

### Test 1: Share Recommendation
1. Login as Jane Wanjiku
2. Send: "Should I buy shares?"
3. Expect: Response about her zero shares, pending fine, and share purchase benefit

### Test 2: Loan Status
1. Login as John Doe
2. Send: "Mikopo yangu?" (My loans in Swahili)
3. Expect: Swahili response about his loan status

### Test 3: General Status
1. Login as Austin Obimbo
2. Send: "What is my financial status?"
3. Expect: Complete breakdown of his role, shares, contributions

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API key not working | Regenerate on HF dashboard, check `.env.local` |
| "Rate limited" | Wait 1-2 minutes or upgrade to paid tier |
| No API key set | Create `.env.local` with key, restart server |
| Response too short | Increase `max_new_tokens` to 512 |
| Response too long | Decrease `max_new_tokens` to 128 |
| Response in wrong language | Check language detection in `detectLanguage()` |
| Mock responses instead of API | Check browser DevTools Network tab |

## API Documentation

- **Model Card**: https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- **Inference API Docs**: https://huggingface.co/docs/api-inference
- **Create API Key**: https://huggingface.co/settings/tokens
- **Rate Limits**: https://huggingface.co/docs/inference-api/rate-limiting

## Next Steps

1. ✅ Get API key from Hugging Face
2. ✅ Add to `.env.local`
3. ✅ Restart dev server
4. ✅ Test with demo users
5. ✅ Monitor Network tab in DevTools
6. ✅ Deploy to production
7. ✅ Monitor usage on Hugging Face dashboard

Enjoy seamless AI-powered financial guidance for your chama!
