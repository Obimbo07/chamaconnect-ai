# ChamaAI RAG Pipeline - Technical Documentation

## Overview

The RAG (Retrieval-Augmented Generation) Pipeline is the intelligent backbone of ChamaAI's AI Companion. It retrieves contextual financial data from your chama's mock database and uses it to generate highly personalized, data-backed responses from the AI model.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Query                               │
│                    "Should I buy shares?"                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │  Language Detection     │
                │  (English vs Swahili)   │
                └────────────┬────────────┘
                             │
         ┌───────────────────▼────────────────────┐
         │      RAG Context Builder               │
         │  ┌──────────────────────────────────┐  │
         │  │ 1. User Profile Extraction       │  │
         │  │ 2. Chama Status Analysis         │  │
         │  │ 3. Transaction Retrieval         │  │
         │  │ 4. Financial Metrics Calc        │  │
         │  │ 5. Intent Detection              │  │
         │  └──────────────────────────────────┘  │
         └───────────────────┬────────────────────┘
                             │
         ┌───────────────────▼────────────────────┐
         │   System Prompt Formatting             │
         │  (English or Swahili)                  │
         └───────────────────┬────────────────────┘
                             │
         ┌───────────────────▼────────────────────┐
         │   Hugging Face API Call                │
         │   (Llama-2-7b-chat-hf)                 │
         │   with Context + User Query            │
         └───────────────────┬────────────────────┘
                             │
         ┌───────────────────▼────────────────────┐
         │   Fallback to Mock Responses           │
         │   (if API fails/unavailable)           │
         └───────────────────┬────────────────────┘
                             │
                ┌────────────▼─────────────┐
                │  Format Response         │
                │  with RAG Metadata       │
                └────────────┬─────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Return to User Interface │
                │  + Intent + API Status    │
                └──────────────────────────┘
```

## Core Components

### 1. RAG Context Builder (`ragPipeline.ts`)

**Function**: `buildRAGContext(message, user, chama)`

Extracts four layers of contextual information:

#### A. User Profile Extraction
```typescript
extractUserProfile(user, chama): string
```
Returns:
- Name and role (chairperson/treasurer/member)
- Contact details
- Current share holdings and ownership percentage
- Total contributions history
- Active loans count
- Pending fines and amounts
- Recent activity summary

Example output:
```
User: Jane Wanjiku (treasurer)
Current Shares: 0 worth KSh 0
Ownership: 0%
Total Contributions: KSh 5,000
Active Loans: 1
Pending Fines: 1 totaling KSh 500
```

#### B. Chama Status Analysis
```typescript
extractChamaStatus(chama): string
```
Returns:
- Chama name and type (Chama vs SACCO)
- Total members
- Share capital value and utilization rate
- Number of issued shares and nominal value
- Active loans and total loan value
- Total contributions
- Blockchain record count

#### C. Transaction Retrieval
```typescript
extractRelevantTransactions(message, user, chama): string
```
Smart filtering based on query intent:
- **Loan query** → Loan transactions
- **Contribution query** → Contribution transactions
- **Dividend query** → Dividend transactions
- **Fine query** → Fine transactions
- **General query** → Last 5 transactions

Returns formatted transaction list with dates, amounts, and descriptions.

#### D. Financial Metrics Calculation
```typescript
extractFinancialMetrics(user, chama): string
```
Computes actionable metrics:
- Average monthly contribution
- Loan-to-contribution ratio
- Current portfolio value
- Projected annual growth
- Share growth potential over 12 months

### 2. Intent Detection

```typescript
detectQueryIntent(message): string[]
```

Identifies what the user is asking about:
- `shares` - Share portfolio questions
- `loans` - Loan-related queries
- `contributions` - Savings/contribution questions
- `fines` - Fine and penalty inquiries
- `dividends` - Profit distribution questions
- `status` - General status check
- `general` - Fallback for unmatched queries

### 3. System Prompt Formatting

```typescript
formatRAGAsPrompt(ragContext, language): string
```

Creates a contextualized system prompt for the AI model:

**English Example:**
```
You are the AI Companion for ChamaAI, supporting African savings groups and SACCOs. 
Use this context to answer questions:

User: Jane Wanjiku (treasurer)
Current Shares: 0 worth KSh 0
Ownership: 0%
...

Chama: Obimbo Chama (Chama)
Members: 3
Share Capital Value: KSh 0
...

Use this context to provide personalized advice, data-backed recommendations, 
and actionable insights. Respond in English.
```

**Swahili Example:**
```
Wewe ni AI Companion kwa ChamaAI, mnumba wa akshi za Kiafrika na vikundi vya kusambaza pesa. 
Tumia mafunzo haya kuangalia maswali:

[Same context as above, but in Swahili]

Useme mafunzo haya kutoa mashauri maalum, tahulufu zinazoambukizwa, na mapendekezo 
yenye manufaa. Jibu kwa Kiswahili.
```

## API Integration

### Hugging Face API Call

```typescript
callHuggingFaceAPI(systemPrompt, userMessage, language): Promise<string | null>
```

**Endpoint**: `https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf`

**Request Format:**
```json
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

**Parameters:**
- `max_new_tokens`: 256 (balance between quality and speed)
- `temperature`: 0.7 (moderately creative but stable)
- `top_p`: 0.9 (diverse but focused responses)
- `repetition_penalty`: 1.2 (avoid repetitive text)

**Requirements:**
- Environment variable: `HUGGINGFACE_API_KEY`
- Free tier available (rate limited)
- Fallback to mock responses if API unavailable

## Data Flow Example

### Query: "Should I buy shares?"

**Step 1: Language Detection**
- Input contains English keywords
- Language = 'en'

**Step 2: Intent Detection**
- Keywords: "buy", "shares"
- Intent = ['shares']

**Step 3: RAG Context Building**

A. User Profile (Jane Wanjiku):
```
Current Shares: 0 worth KSh 0
Ownership: 0%
Total Contributions: KSh 5,000
Pending Fines: 1 totaling KSh 500
```

B. Chama Status (Obimbo):
```
Members: 3
Share Capital Value: KSh 0
Utilization Rate: 0%
Issued Shares: 0
```

C. Relevant Transactions:
```
2026-03-25: CONTRIBUTION - KSh 3,000 (Jane's recent contribution)
2026-03-18: FINE - KSh 500 (Late contribution penalty)
```

D. Financial Metrics:
```
Average Monthly Contribution: KSh 5,000
Current Portfolio Value: KSh 0
Projected Annual Growth: KSh 60,000
```

**Step 4: System Prompt Creation**
Combines all context into a 500-word prompt instructing the AI to:
- Acknowledge Jane's contribution history
- Address her zero share status
- Mention the pending fine
- Suggest share purchase as path to better standing
- Provide specific guidance

**Step 5: Hugging Face API Call**
System sends formatted prompt + question to Llama-2-7b

**Step 6: Response Example**
```
"Jane, based on your financial history with Obimbo Chama, buying shares is 
an excellent decision. You've contributed KSh 5,000 consistently, but have 
zero shares. At KSh 1,000 per share, you could purchase 5 shares for KSh 5,000 
from your savings. This would:
1. Give you 100% ownership of your contributions
2. Help clear your KSh 500 fine (showing commitment)
3. Entitle you to dividend distributions
4. Increase your say in chama decisions"
```

## Fallback Mechanism

If Hugging Face API fails:

1. **Check for API key** - If missing, warn and continue
2. **Try API call** - If network error, catch and log
3. **Use mock responses** - `generateAIResponse()` from mockAIResponses.ts
4. **Return same structure** - User gets seamless experience

## Mock Data for RAG

RAG pipeline works with:

**mockData.ts provides:**
- User profiles (5 demo users)
- Chama data (2 organizations)
- Transactions (contributions, loans, repayments, dividends, fines)
- Blockchain ledger (immutable transaction hashes)

**mockAIResponses.ts provides:**
- Fallback responses for all intent types
- Bilingual (English + Swahili) coverage
- Context-aware templates

## Environment Setup

### Required for Real API:
```bash
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get a free API key from [Hugging Face](https://huggingface.co/settings/tokens)

### Optional:
```bash
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Performance Considerations

**Context Size**: ~500-800 words per request
- User profile: ~100 words
- Chama status: ~150 words
- Transactions: ~100-200 words
- Metrics: ~150 words

**Token Usage** (estimate):
- System prompt: ~200-300 tokens
- User query: ~20-30 tokens
- Response: ~150-200 tokens
- **Total**: ~400-500 tokens per request

**Cost** (Hugging Face Free Tier):
- Free tier includes reasonable inference limits
- Paid: ~$0.01-0.02 per 1000 requests (depending on throughput)

## Future Enhancements

1. **Semantic Search**: Use embeddings to find most relevant transactions
2. **Fine-tuning**: Train on chama-specific financial patterns
3. **Multi-document Retrieval**: Support PDFs, historical records
4. **Real-time Updates**: Stream responses instead of waiting for full completion
5. **Vector Database**: Use Pinecone/Weaviate for large-scale retrieval
6. **Multilingual**: Add more African languages (Kikuyu, Somali, Yoruba)

## Debugging

Enable RAG debugging by adding to chat component:

```typescript
console.log("[v0] RAG Context:", ragContext);
console.log("[v0] System Prompt:", systemPrompt);
console.log("[v0] API Response:", aiResponse);
```

Monitor performance in browser DevTools Network tab.

## Testing RAG Pipeline

### Test Queries

1. **Shares**: "Tell me about my shares" / "Habari juu ya akshi zangu"
2. **Loans**: "What loans do I have?" / "Nina mikopo ngapi?"
3. **Savings**: "How can I save more?" / "Ninaweza kusave vipi?"
4. **Fines**: "About my fines" / "Kuhusu malipo yangu"
5. **Status**: "What is my financial status?" / "Hali yangu ni nini?"

All should return highly personalized responses based on the specific user and chama data.
