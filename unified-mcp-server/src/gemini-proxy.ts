/**
 * Gemini API Proxy
 * 
 * Securely proxies requests from Chrome extension to Gemini API
 * API key stays on server, extension uses bearer token auth
 */

export interface GeminiRequest {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  model: string;
  tokensUsed?: number;
}

export class GeminiProxy {
  private apiKey: string;
  private defaultModel: string = 'gemini-2.0-flash-exp';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Call Gemini API with the provided parameters
   */
  async generate(request: GeminiRequest): Promise<GeminiResponse> {
    const {
      prompt,
      systemInstruction,
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 2500,
    } = request;

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Build request body
    const requestBody: any = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    };

    // Add system instruction if provided
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Extract response text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No text in Gemini response');
    }

    // Extract token usage if available
    const tokensUsed = data.usageMetadata?.totalTokenCount;

    return {
      text,
      model,
      tokensUsed,
    };
  }

  /**
   * Analyze conference event website content
   * Specialized method for the Chrome extension's primary use case
   */
  async analyzeConferenceEvent(params: {
    eventName: string;
    eventUrl: string;
    pageContent: string;
    specificQuery?: string;
  }): Promise<string> {
    const { eventName, eventUrl, pageContent, specificQuery } = params;

    const systemInstruction = `You are an expert conference intelligence analyst for GTM (go-to-market) teams.
Your job is to extract actionable intelligence from conference websites to help sales, marketing, and BD teams prepare.
Focus on: attendee profiles, exhibitors, sponsors, speaking topics, networking opportunities, and business value.`;

    const basePrompt = `Analyze this conference event:

**Event:** ${eventName}
**URL:** ${eventUrl}

**Page Content:**
${pageContent.substring(0, 10000)} // Limit to avoid token overflow

**Analysis Required:**
1. **Event Overview** - What is this conference about?
2. **Target Audience** - Who attends? (roles, industries, seniority)
3. **Key Companies** - Sponsors, exhibitors, speakers' companies
4. **Speaking Topics** - What subjects are covered?
5. **Networking Value** - Why should GTM teams care?
6. **Notable Speakers** - Who are the key people?
7. **Actionable Intel** - Specific opportunities for attendees

${specificQuery ? `\n**Specific Question:**\n${specificQuery}` : ''}

Provide structured, scannable output with clear sections.`;

    const response = await this.generate({
      prompt: basePrompt,
      systemInstruction,
      temperature: 0.5, // Lower for more factual analysis
      maxTokens: 3000,
    });

    return response.text;
  }

  /**
   * Extract company profiles from text
   */
  async extractCompanyProfiles(text: string): Promise<any[]> {
    const systemInstruction = `You are a data extraction expert.
Extract company profiles from the provided text.
Return ONLY valid JSON array, no markdown formatting.`;

    const prompt = `Extract all companies mentioned in this text:

${text.substring(0, 8000)}

For each company, provide:
- name (required)
- description (if available)
- industry (if mentioned)
- people (array of {name, title} if individuals are mentioned)
- context (why they're mentioned)

Return as JSON array: [{"name": "...", "description": "...", ...}]

If no companies found, return empty array: []`;

    const response = await this.generate({
      prompt,
      systemInstruction,
      temperature: 0.3, // Very low for structured extraction
      maxTokens: 4000,
    });

    // Parse JSON response
    try {
      let jsonStr = response.text.trim();
      
      // Remove markdown code blocks if present
      const match = jsonStr.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (match) {
        jsonStr = match[1];
      }

      const profiles = JSON.parse(jsonStr);
      
      if (!Array.isArray(profiles)) {
        throw new Error('Response is not an array');
      }

      return profiles;
    } catch (error) {
      console.error('Failed to parse company profiles:', error);
      console.error('Raw response:', response.text);
      return [];
    }
  }
}
