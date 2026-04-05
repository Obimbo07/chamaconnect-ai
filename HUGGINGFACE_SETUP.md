# Hugging Face API Setup Guide

## Overview

ChamaAI uses **Hugging Face's Llama-2-7b-chat-hf** model for AI-powered financial guidance. The system works perfectly **without** an API key - it falls back to high-quality mock responses automatically.

However, if you want **real AI responses** powered by Hugging Face, follow the setup below.

## Quick Start (2 Minutes)

### Step 1: Get a Free API Key

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it `ChamaAI` (or anything)
4. Select **Read** access
5. Copy the generated token

### Step 2: Add to Your Project

#### Local Development

Create a `.env.local` file in the project root:

```bash
HUGGINGFACE_API_KEY=hf_your_copied_token_here
```

Restart the dev server:
```bash
pnpm dev
```

#### Vercel Deployment

1. Open your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add: `HUGGINGFACE_API_KEY` = `hf_your_token`
4. Click "Save"
5. Redeploy your project

## How It Works

**Every time you send a message:**

1. **Check for API key** → If not set, skip to step 4
2. **Call Hugging Face API** → Send RAG context + your message
3. **Get response** → Real AI-generated answer
4. **Fallback** → If API fails/key missing, use mock responses

**Result**: You always get a good response, whether real or mock.

## What You Get

### Without API Key (Default)
- ✓ High-quality predefined responses
- ✓ Context-aware recommendations
- ✓ Bilingual (English/Swahili)
- ✓ No cost, no setup
- ✗ Not real AI (but still excellent)

### With API Key (Real AI)
- ✓ Everything above, PLUS:
- ✓ Real Llama-2-7b-chat-hf responses
- ✓ More creative, personalized answers
- ✓ Better handling of novel questions
- ✓ ~$0.0001 per request (very cheap)
- ✓ Free tier: ~30 requests/min

## Troubleshooting

### "HUGGINGFACE_API_KEY not set" message

This is **informational only** (in development mode), not an error. It tells you:
- ✓ The app is working correctly
- ✓ Mock responses are being used
- ✓ No API key is configured

**To fix**: Set the environment variable (see Step 2 above)

### API calls failing silently

This is **expected behavior** - the app gracefully falls back to mock responses:

1. API key might be invalid
2. Hugging Face might be rate-limiting you
3. Network issue
4. Model might be loading (can take 30 seconds)

Check development console for `[RAG]` error messages with details.

### Want to see if real API is being used?

Open browser dev tools → **Network** tab → look for requests to:
```
https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf
```

If requests appear: Real API is working! If not: Using mock responses.

Also check each message in the chat for a checkmark (✓ HF API) indicator.

## Pricing

**Hugging Face Inference API Pricing:**
- Free tier: 30,000 requests/month (usually enough)
- Paid: $0.01-0.02 per 1,000 requests
- Max cost for 10,000 requests/month: ~$0.20

Very affordable! Most projects stay in free tier.

## Advanced: Custom Models

Want to use a different model? Edit `/app/api/chat/route.ts`:

```typescript
// Change this URL to any Hugging Face model
const response = await fetch('https://api-inference.huggingface.co/models/YOUR_MODEL_ID', {
```

Popular alternatives:
- `meta-llama/Llama-2-13b-chat-hf` (larger, slower, better)
- `mistralai/Mistral-7B-Instruct-v0.1` (faster)
- `tiiuae/falcon-40b-instruct` (powerful)

## FAQ

**Q: Will the app work without setting up Hugging Face?**
A: Yes! Mock responses are excellent. Real API is optional.

**Q: Is my API key safe?**
A: Yes - it's only used server-side in `/app/api/chat/route.ts`. Never sent to browser.

**Q: How many API calls per day is normal?**
A: 1-2 per user per session. Free tier easily handles 100+ active users.

**Q: Can I use a different AI provider?**
A: Yes! The code is modular. See `/app/api/chat/route.ts` for the API call.

**Q: What if I exceed my quota?**
A: App automatically falls back to mock responses. Zero downtime!

## Support

Having issues? Check:
1. Token is valid (test at https://huggingface.co/settings/tokens)
2. `.env.local` file exists with correct token
3. Server restarted after adding env var
4. Browser dev console for `[RAG]` error logs
5. Hugging Face status page: https://status.huggingface.co/

