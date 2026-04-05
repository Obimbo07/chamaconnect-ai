// Server-side utility to check and report API setup status
// Runs once on server startup

let setupCheckRun = false;

export function checkHuggingFaceSetup(): void {
  // Run only once per server instance
  if (setupCheckRun) return;
  setupCheckRun = true;

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (process.env.NODE_ENV === 'development') {
    if (apiKey) {
      console.log('[ChamaAI] ✓ Hugging Face API key configured - Real AI responses enabled');
    } else {
      console.log('[ChamaAI] ℹ Hugging Face API key not set - Using high-quality mock responses');
      console.log('[ChamaAI] To enable real AI: Set HUGGINGFACE_API_KEY in .env.local');
      console.log('[ChamaAI] Get a free key at https://huggingface.co/settings/tokens');
    }
  }
}

export function isHuggingFaceConfigured(): boolean {
  return !!process.env.HUGGINGFACE_API_KEY;
}
