import { supabase } from "@/integrations/supabase/client";

export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  debug?: {
    serverUrl: string;
    tool: string;
    params: Record<string, unknown>;
  };
}

export interface Company {
  id?: string | number;
  name: string;
  description?: string;
  industry?: string;
  context?: string;
  recent_activity?: string[];
  employees?: Employee[];
  enriched_data?: EnrichedData;
  created_at?: string;
  updated_at?: string;
  last_enriched?: string;
  enriched_at?: string;
}

export interface Employee {
  id?: string;
  name: string;
  title?: string;
  linkedin_url?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}

export interface EnrichedData {
  description?: string;
  industry?: string;
  employee_count?: number;
  recent_activity?: string[];
  website?: string;
  location?: string;
}

export interface Strategy {
  company_name: string;
  value_alignment: string;
  key_topics: string[];
  tone_and_voice: string;
  product_positioning: string;
  talking_points: string[];
  opening_line: string;
  what_to_avoid: string[];
}

export interface DraftedEmail {
  subject: string;
  body: string;
  to?: string;
}

async function callMCP<T>(tool: string, params: Record<string, unknown> = {}): Promise<MCPResponse<T>> {
  try {
    console.log(`Calling MCP tool: ${tool}`, params);
    
    const { data, error } = await supabase.functions.invoke('mcp-proxy', {
      body: { tool, params }
    });

    if (error) {
      console.error('Supabase function error:', error);
      return { success: false, error: error.message };
    }

    console.log('MCP response:', data);
    return data as MCPResponse<T>;
  } catch (err) {
    console.error('MCP call error:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to call MCP server' 
    };
  }
}

// Company operations
export async function listCompanies(): Promise<MCPResponse<Company[]>> {
  return callMCP<Company[]>('gtm_list_companies');
}

export async function searchCompanies(query: string): Promise<MCPResponse<Company[]>> {
  return callMCP<Company[]>('gtm_search_companies', { query });
}

export async function getCompany(name: string): Promise<MCPResponse<Company>> {
  return callMCP<Company>('gtm_get_company', { name });
}

export async function addCompany(company: {
  name: string;
  description?: string;
  industry?: string;
  context?: string;
  employees?: Array<{
    name: string;
    title?: string;
    linkedin?: string;
  }>;
}): Promise<MCPResponse<Company>> {
  return callMCP<Company>('gtm_add_company', company);
}

export async function enrichCompany(name: string): Promise<MCPResponse<Company>> {
  return callMCP<Company>('gtm_enrich_company', { name });
}

export async function deleteCompany(name: string): Promise<MCPResponse<{ deleted: boolean }>> {
  return callMCP<{ deleted: boolean }>('gtm_delete_company', { name });
}

// Strategy operations
export async function generateStrategy(params: {
  company_name: string;
  your_company: string;
  your_product: string;
  target_personas?: string;
  target_industries?: string;
}): Promise<MCPResponse<Strategy>> {
  return callMCP<Strategy>('gtm_generate_strategy', params);
}

// Email operations
export async function draftEmail(params: {
  company_name: string;
  from_name: string;
}): Promise<MCPResponse<DraftedEmail>> {
  return callMCP<DraftedEmail>('gtm_draft_email', params);
}

// Auth operations
export async function createUser(params: {
  id: string;
  email: string;
  full_name?: string;
}): Promise<MCPResponse<{ created: boolean }>> {
  return callMCP<{ created: boolean }>('auth_create_user', params);
}

export async function createOrganization(params: {
  name: string;
  slug: string;
  owner_id: string;
}): Promise<MCPResponse<{ id: number }>> {
  return callMCP<{ id: number }>('auth_create_organization', params);
}

// Utility function to test MCP connection
export async function testMCPConnection(): Promise<MCPResponse<{ connected: boolean; tools: string[] }>> {
  try {
    const result = await listCompanies();
    return {
      success: result.success,
      data: {
        connected: result.success,
        tools: ['gtm_list_companies', 'gtm_search_companies', 'gtm_get_company', 'gtm_add_company', 'gtm_enrich_company', 'gtm_generate_strategy', 'gtm_draft_email', 'gtm_delete_company']
      },
      error: result.error
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Connection test failed'
    };
  }
}
