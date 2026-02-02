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

interface MCPResponse {
  success: boolean;
  data?: unknown;
  error?: string;
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

    console.log(`Calling MCP tool: ${tool}`, params);

    // Call the MCP server's JSON-RPC endpoint
    const response = await fetch(`${MCP_SERVER_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: tool,
          arguments: params || {}
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MCP server error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `MCP server error: ${response.status}` 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('MCP response:', JSON.stringify(result).slice(0, 500));

    // Handle JSON-RPC response format
    if (result.error) {
      return new Response(
        JSON.stringify({ success: false, error: result.error.message || 'MCP tool error' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract content from MCP response
    let data = result.result;
    if (data?.content && Array.isArray(data.content)) {
      // MCP returns content as array of objects with type and text
      const textContent = data.content.find((c: any) => c.type === 'text');
      if (textContent?.text) {
        try {
          data = JSON.parse(textContent.text);
        } catch {
          data = textContent.text;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
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
