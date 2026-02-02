import { CompanyProfile } from './db.js';

export interface EnrichmentContext {
  yourCompany?: string;
  yourProduct?: string;
  targetPersonas?: string;
  targetIndustries?: string;
}

export class EnrichmentService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callGemini(
    prompt: string,
    systemInstruction?: string,
    temperature: number = 0.7
  ): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: systemInstruction
            ? {
                parts: [{ text: systemInstruction }],
              }
            : undefined,
          generationConfig: {
            temperature,
            maxOutputTokens: 2500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  private profileToText(profile: CompanyProfile): string {
    const parts = [`Company: ${profile.name}`];

    if (profile.description) {
      parts.push(`Description: ${profile.description}`);
    }

    if (profile.industry) {
      parts.push(`Industry: ${profile.industry}`);
    }

    if (profile.context) {
      parts.push(`Context: ${profile.context}`);
    }

    if (profile.employees && profile.employees.length > 0) {
      parts.push('\nTeam Members:');
      for (const emp of profile.employees) {
        parts.push(`  • ${emp.name} - ${emp.title}`);
      }
    }

    if (profile.recent_activity) {
      parts.push(`\nRecent Activity:\n${profile.recent_activity}`);
    }

    return parts.join('\n');
  }

  async generateCommunicationStrategy(
    profile: CompanyProfile,
    context: EnrichmentContext = {}
  ): Promise<string> {
    const yourCompany = context.yourCompany || 'Your company';
    const yourProduct = context.yourProduct || 'Your product/service';

    // Find target contact
    let targetContact = null;
    if (profile.employees && profile.employees.length > 0) {
      targetContact = profile.employees[0];
    }

    const contactContext = targetContact
      ? `\n\n**Target Contact:** ${targetContact.name}, ${targetContact.title || 'N/A'}`
      : '';

    const prompt = `You are a GTM (go-to-market) communication strategist.

**Context:**
- **Your Company:** ${yourCompany}
- **Your Product/Service:** ${yourProduct}
- **Target Company:** ${profile.name}${contactContext}

**Target Company Profile:**

${this.profileToText(profile)}

Generate a detailed, **product-specific** communication strategy for ${yourCompany} reaching out to this target company.

Provide:

1. **Value Alignment** - How does ${yourProduct} specifically solve problems this company faces? Connect their challenges to your solution.

2. **Key Topics** - What specific topics should you discuss? Tie each topic back to how ${yourProduct} helps.

3. **Tone & Voice** - How should you sound when representing ${yourCompany}? Match their communication style.

4. **Product Positioning** - How should you position ${yourProduct} for THIS specific audience? What angle resonates?

5. **Talking Points** - 3-5 specific things to mention that connect THEIR needs to YOUR solution

6. **Opening Line** - Draft a compelling first sentence that:
   - Shows you understand their business
   - Hints at your solution without being salesy
   - Gets them curious

7. **What to Avoid** - Topics/approaches that would turn them off, especially for ${yourProduct} type

**Critical:** Every recommendation must be specific to ${yourCompany} selling ${yourProduct} to ${profile.name}. No generic advice.`;

    return this.callGemini(
      prompt,
      'You are an expert GTM strategist. Provide specific, actionable outreach guidance based on deep company analysis.',
      0.7
    );
  }

  async draftEmail(profile: CompanyProfile, fromName: string = 'User'): Promise<string> {
    // Find best contact
    let targetContact = null;
    if (profile.employees && profile.employees.length > 0) {
      // Prefer founders/CEOs
      for (const emp of profile.employees) {
        const titleLower = (emp.title || '').toLowerCase();
        if (
          titleLower.includes('founder') ||
          titleLower.includes('ceo') ||
          titleLower.includes('president') ||
          titleLower.includes('co-founder')
        ) {
          targetContact = emp;
          break;
        }
      }

      if (!targetContact) {
        targetContact = profile.employees[0];
      }
    }

    const toName = targetContact?.name || 'there';
    const toTitle = targetContact?.title || '';

    const prompt = `Draft a personalized cold outreach email based on this company profile:

${this.profileToText(profile)}

Email details:
- From: ${fromName}
- To: ${toName}${toTitle ? ` (${toTitle})` : ''}
- Purpose: Initial outreach / introduce myself
- Tone: Professional but friendly, show research done

Requirements:
- Subject line that gets opened
- Opening that shows specific knowledge of their company
- Clear value proposition
- Soft call-to-action
- Keep it under 150 words
- No generic phrases like "I hope this email finds you well"

Format as a ready-to-send email.`;

    return this.callGemini(
      prompt,
      'You are an expert at writing personalized cold emails that get responses. Be specific and show genuine research.',
      0.8
    );
  }

  async enrichProfile(profile: CompanyProfile): Promise<CompanyProfile> {
    // Basic enrichment - could be extended with web scraping, etc.
    const prompt = `Analyze this company profile and provide additional context:

${this.profileToText(profile)}

Provide:
1. A concise company description (2-3 sentences)
2. Key industry vertical
3. Recent trends or activities in their space

Format as JSON:
{
  "description": "...",
  "industry": "...",
  "recent_activity": "..."
}`;

    const response = await this.callGemini(
      prompt,
      'You are a company research analyst. Provide accurate, concise enrichment data.',
      0.5
    );

    try {
      // Extract JSON from markdown code block if present
      let jsonStr = response.trim();
      const match = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (match) {
        jsonStr = match[1];
      }

      const enrichmentData = JSON.parse(jsonStr);

      return {
        ...profile,
        description: enrichmentData.description || profile.description,
        industry: enrichmentData.industry || profile.industry,
        recent_activity: enrichmentData.recent_activity || profile.recent_activity,
        enriched_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to parse enrichment data:', error);
      return profile;
    }
  }
}
