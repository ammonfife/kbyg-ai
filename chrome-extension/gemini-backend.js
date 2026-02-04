/**
 * Gemini Backend Integration
 * 
 * Securely calls Gemini API through backend proxy
 * No API key exposed in extension code
 */

// Backend API configuration
const BACKEND_URL = 'http://localhost:3000'; // Change to production URL when deployed
const BEARER_TOKEN = 'your_bearer_token_here'; // From MCP_BEARER_TOKEN env var

/**
 * Call Gemini API through backend proxy
 * @param {Object} request - Request parameters
 * @param {string} request.prompt - Text prompt for Gemini
 * @param {string} [request.systemInstruction] - System instruction
 * @param {string} [request.model] - Model name (default: gemini-2.0-flash-exp)
 * @param {number} [request.temperature] - Temperature (default: 0.7)
 * @param {number} [request.maxTokens] - Max tokens (default: 2500)
 * @returns {Promise<{text: string, model: string, tokensUsed?: number}>}
 */
async function callGemini(request) {
  const response = await fetch(`${BACKEND_URL}/api/gemini/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Analyze conference event page
 * @param {Object} params - Analysis parameters
 * @param {string} params.eventName - Event name
 * @param {string} params.eventUrl - Event URL
 * @param {string} params.pageContent - HTML or text content
 * @param {string} [params.specificQuery] - Optional specific question
 * @returns {Promise<{analysis: string}>}
 */
async function analyzeConferenceEvent(params) {
  const response = await fetch(`${BACKEND_URL}/api/gemini/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Extract company profiles from text
 * @param {string} text - Text containing company information
 * @returns {Promise<{profiles: Array}>}
 */
async function extractCompanyProfiles(text) {
  const response = await fetch(`${BACKEND_URL}/api/gemini/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return await response.json();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    callGemini,
    analyzeConferenceEvent,
    extractCompanyProfiles,
  };
}
