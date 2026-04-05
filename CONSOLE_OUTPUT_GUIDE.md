# Console Output Guide

## What You'll See (And What It Means)

### Development Mode (Local)

#### ✓ Good: API Key Configured
```
[ChamaAI] ✓ Hugging Face API key configured - Real AI responses enabled
```
**What it means**: Real Llama-2 AI is active. You'll get creative, personalized responses.

#### ℹ Good: Using Mock Responses (First Request)
```
[ChamaAI] ℹ Hugging Face API key not set - Using high-quality mock responses
[ChamaAI] To enable real AI: Set HUGGINGFACE_API_KEY in .env.local
[ChamaAI] Get a free key at https://huggingface.co/settings/tokens
```
**What it means**: This is normal and expected. Mock responses are excellent. If you want real AI, follow the link.

#### ⚠ Warning: API Error (Development Only)
```
[RAG] Hugging Face API error (429): Falling back to mock responses
```
**What it means**: API hit a rate limit or error. System is using mock responses (app still works perfectly).

#### ⚠ Warning: Network Error (Development Only)
```
[RAG] Hugging Face API call failed, using mock responses: Connection timeout
```
**What it means**: Network/connectivity issue. System is using mock responses (app still works perfectly).

### Production Mode (Deployed)

#### Silent (No Messages)
No console output unless there's a critical error.

**What it means**: Everything is working normally. Mock responses are being used or real API succeeded.

---

## Troubleshooting by Message

### "API key not set" Message Appears

**Is this a problem?** No.

**What to do:**
- If you're happy with mock responses: Do nothing
- If you want real AI: Add `HUGGINGFACE_API_KEY` to `.env.local`

### "API error (429)" Appears Multiple Times

**Is this a problem?** Temporarily - you've hit the free tier rate limit.

**What to do:**
1. Wait 5-10 minutes (Hugging Face rate limits reset)
2. Or upgrade to paid tier
3. Or just keep using mock responses (they're great!)

### "API call failed" Appears

**Is this a problem?** Temporarily - likely a network issue.

**What to do:**
1. Check your internet connection
2. Check Hugging Face status: https://status.huggingface.co/
3. Restart the dev server

### No Messages at All (Production)

**Is this a problem?** No, this is expected.

**What it means:** Everything is working normally.

---

## How to Verify Which AI is Being Used

### Method 1: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Send a message in chat
4. Look for requests to `api-inference.huggingface.co`

If requests appear → Real API is working
If no requests → Using mock responses

### Method 2: Check Message Indicator
In the chat UI, each AI message shows:
- `✓ HF API` badge = Real Hugging Face response
- No badge = Mock response

### Method 3: Check Server Logs
In development, look for:
- `[ChamaAI] ✓` = Real API configured
- `[ChamaAI] ℹ` = Using mock (normal)
- `[RAG]` prefix = API error/fallback happening

---

## Quick Reference

| Message | Severity | Action |
|---------|----------|--------|
| `✓ API key configured` | ✓ Good | None needed |
| `ℹ API key not set` | ℹ Info | Optional: add key if you want real AI |
| `[RAG] API error` | ⚠ Warning | Check Hugging Face status, wait a moment |
| `[RAG] API call failed` | ⚠ Warning | Check internet connection |
| No messages (prod) | ✓ Good | Everything is working |

---

## Remember

The app **always works perfectly**. All these messages are about which AI engine is being used, not whether it's working. You'll always get a good response.

