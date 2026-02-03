import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MCP_SERVER_URL = "https://unified-mcp-server-production.up.railway.app";

interface MCPRequest {
  tool: string;
  params: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tool, params } = await req.json() as MCPRequest;

    if (!tool) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tool name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calling MCP tool: ${tool}`, JSON.stringify(params));

    // Use the correct /tools/call endpoint with JSON-RPC format
    const endpoint = `${MCP_SERVER_URL}/tools/call`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now().toString(),
        params: {
          name: tool,
          arguments: params || {}
        }
      }),
    });

    const responseText = await response.text();
    console.log(`Response: status=${response.status}, body=${responseText.slice(0, 500)}`);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `MCP Server Error: HTTP ${response.status}`,
          debug: {
            serverUrl: MCP_SERVER_URL,
            endpoint,
            tool,
            params,
            response: responseText.slice(0, 500)
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: unknown = null;
    try {
      const data = JSON.parse(responseText);
      
      // Handle JSON-RPC response
      if (data.error) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: data.error.message || JSON.stringify(data.error)
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (data.result !== undefined) {
        result = extractMCPContent(data.result, tool);
      } else {
        result = data;
      }
    } catch (parseError) {
      console.log(`Parse error:`, parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid JSON response from MCP server`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calling MCP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Extract content from MCP response format and convert to structured data
function extractMCPContent(result: unknown, tool: string): unknown {
  if (result && typeof result === 'object') {
    const obj = result as Record<string, unknown>;
    
    // MCP returns content as array of objects with type and text
    if (Array.isArray(obj.content)) {
      const textContent = obj.content.find((c: Record<string, unknown>) => c.type === 'text');
      if (textContent?.text) {
        const text = textContent.text as string;
        
        // First try to parse as JSON (for gtm_get_company which returns JSON)
        try {
          return JSON.parse(text);
        } catch {
          // Not JSON, try to parse based on tool type
          return parseToolResponse(text, tool);
        }
      }
    }
    
    // Direct data response
    if (obj.data !== undefined) {
      return obj.data;
    }
  }
  
  return result;
}

// Parse text responses from MCP tools into structured data
function parseToolResponse(text: string, tool: string): unknown {
  switch (tool) {
    case 'gtm_list_companies':
    case 'gtm_search_companies':
      return parseCompanyList(text);
    
    case 'gtm_add_company':
    case 'gtm_delete_company':
      return { message: text, success: !text.includes('❌') };
    
    case 'gtm_enrich_company':
      return parseEnrichResponse(text);
    
    case 'gtm_generate_strategy':
      return parseStrategyResponse(text);
    
    case 'gtm_draft_email':
      return parseEmailResponse(text);
    
    default:
      return text;
  }
}

// Parse "📊 Found N companies:\n\n• Company1 (X employees)\n• Company2 (Y employees)"
function parseCompanyList(text: string): unknown[] {
  const companies: unknown[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Match "• CompanyName (N employees)"
    const match = line.match(/•\s*(.+?)\s*\((\d+)\s*employees?\)/);
    if (match) {
      companies.push({
        name: match[1].trim(),
        employees: Array(parseInt(match[2])).fill(null).map(() => ({}))
      });
    }
  }
  
  return companies;
}

// Parse enrichment response
function parseEnrichResponse(text: string): unknown {
  // Try to extract JSON from the enrichment response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        enriched_data: data
      };
    } catch {
      // Fall through
    }
  }
  
  return {
    success: !text.includes('❌'),
    message: text
  };
}

// Parse strategy response "📋 **GTM Strategy for CompanyName**\n\n..."
function parseStrategyResponse(text: string): unknown {
  // Extract sections from the strategy text
  const sections: Record<string, string | string[]> = {};
  
  // Extract company name from header
  const headerMatch = text.match(/GTM Strategy for (.+?)\*?\*?\n/);
  if (headerMatch) {
    sections.company_name = headerMatch[1].trim().replace(/\*+/g, '');
  }
  
  // Common section patterns
  const sectionPatterns = [
    { key: 'value_alignment', pattern: /Value Alignment[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'key_topics', pattern: /Key Topics[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'tone_and_voice', pattern: /Tone (?:&|and) Voice[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'product_positioning', pattern: /Product Positioning[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'talking_points', pattern: /Talking Points[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'opening_line', pattern: /Opening Line[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
    { key: 'what_to_avoid', pattern: /What to Avoid[:\s]*\n([\s\S]*?)(?=\n(?:\*\*|##|$))/i },
  ];
  
  for (const { key, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      const content = match[1].trim();
      // Check if it's a list (starts with - or •)
      if (content.match(/^[\-•]/m)) {
        sections[key] = content.split('\n')
          .filter(line => line.match(/^[\-•]/))
          .map(line => line.replace(/^[\-•]\s*/, '').trim());
      } else {
        sections[key] = content;
      }
    }
  }
  
  // If no sections found, return the raw text in a structured format
  if (Object.keys(sections).length === 0) {
    return {
      company_name: 'Unknown',
      value_alignment: text,
      key_topics: [],
      tone_and_voice: '',
      product_positioning: '',
      talking_points: [],
      opening_line: '',
      what_to_avoid: []
    };
  }
  
  return sections;
}

// Parse email response "📧 **Draft Email to CompanyName**\n\n..."
function parseEmailResponse(text: string): unknown {
  // Extract subject line
  const subjectMatch = text.match(/Subject[:\s]*(.+?)(?:\n|$)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : 'Introduction';
  
  // Extract body (everything after Subject line)
  let body = text;
  if (subjectMatch) {
    body = text.substring(text.indexOf(subjectMatch[0]) + subjectMatch[0].length).trim();
  }
  
  // Remove header "📧 **Draft Email to X**"
  body = body.replace(/^📧\s*\*?\*?Draft Email to .+?\*?\*?\s*\n+/i, '').trim();
  
  return {
    subject,
    body
  };
}
