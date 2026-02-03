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

    // Try multiple endpoint patterns for MCP HTTP transport
    const endpoints = [
      `${MCP_SERVER_URL}/tools/call`,  // ✅ Correct endpoint
      `${MCP_SERVER_URL}/mcp`,
      `${MCP_SERVER_URL}/call`,
      `${MCP_SERVER_URL}/tools/${tool}`,
      MCP_SERVER_URL,
    ];

    let lastError: string | null = null;
    let result: unknown = null;

    // Try JSON-RPC format first (standard MCP protocol)
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now().toString(),
            method: "tools/call",
            params: {
              name: tool,
              arguments: params || {}
            }
          }),
        });

        const responseText = await response.text();
        console.log(`Response from ${endpoint}: status=${response.status}, body=${responseText.slice(0, 500)}`);

        if (response.ok && responseText) {
          try {
            const data = JSON.parse(responseText);
            
            // Handle JSON-RPC response
            if (data.result !== undefined) {
              result = extractMCPContent(data.result);
              break;
            } else if (data.error) {
              lastError = data.error.message || JSON.stringify(data.error);
            } else {
              // Direct response (not JSON-RPC wrapped)
              result = data;
              break;
            }
          } catch (parseError) {
            console.log(`Parse error for ${endpoint}:`, parseError);
            lastError = `Invalid JSON response: ${responseText.slice(0, 100)}`;
          }
        } else if (response.status === 404) {
          lastError = `Endpoint not found: ${endpoint}`;
          continue;
        } else {
          lastError = `HTTP ${response.status}: ${responseText.slice(0, 200)}`;
        }
      } catch (fetchError) {
        console.error(`Fetch error for ${endpoint}:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : 'Fetch failed';
      }
    }

    // If JSON-RPC didn't work, try direct tool call format
    if (result === null) {
      try {
        console.log(`Trying direct tool call format`);
        
        const response = await fetch(`${MCP_SERVER_URL}/api/${tool}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(params || {}),
        });

        const responseText = await response.text();
        console.log(`Direct call response: status=${response.status}, body=${responseText.slice(0, 500)}`);

        if (response.ok && responseText) {
          try {
            result = JSON.parse(responseText);
          } catch {
            result = responseText;
          }
        }
      } catch (directError) {
        console.error('Direct call error:', directError);
      }
    }

    if (result !== null) {
      return new Response(
        JSON.stringify({ success: true, data: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: lastError || 'Failed to call MCP server',
        debug: {
          serverUrl: MCP_SERVER_URL,
          tool,
          params
        }
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

// Extract content from MCP response format
function extractMCPContent(result: unknown): unknown {
  if (result && typeof result === 'object') {
    const obj = result as Record<string, unknown>;
    
    // MCP returns content as array of objects with type and text
    if (Array.isArray(obj.content)) {
      const textContent = obj.content.find((c: Record<string, unknown>) => c.type === 'text');
      if (textContent?.text) {
        try {
          return JSON.parse(textContent.text as string);
        } catch {
          return textContent.text;
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
