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

    // First check if server is healthy
    try {
      const healthCheck = await fetch(`${MCP_SERVER_URL}/health`);
      const healthText = await healthCheck.text();
      console.log(`Health check: status=${healthCheck.status}, body=${healthText}`);
    } catch (healthError) {
      console.log(`Health check failed: ${healthError}`);
    }

    // Use the correct /tools/call endpoint with JSON-RPC format
    const endpoint = `${MCP_SERVER_URL}/tools/call`;
    
    console.log(`Calling endpoint: ${endpoint}`);
    
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
    console.log(`Response: status=${response.status}, body=${responseText.slice(0, 1000)}`);

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
        result = extractMCPContent(data.result);
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
