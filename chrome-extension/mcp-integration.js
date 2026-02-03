/**
 * MCP Integration Layer - Dual Mode Support
 * 
 * Connects Chrome Extension to GTM MCP Server via:
 * 1. Direct MCP Server (localhost:3000 or Railway)
 * 2. Supabase Edge Function Proxy (production web app)
 */

// Configuration - Auto-detect or use environment
const MCP_CONFIG = {
  // Mode: 'direct' or 'supabase'
  mode: 'auto', // Will auto-detect best available endpoint
  
  // Direct MCP Server (Railway deployment or localhost)
  directUrl: 'https://unified-mcp-server-production.up.railway.app',
  directFallback: 'http://localhost:3000',
  
  // Supabase Edge Function (Web App API)
  supabaseUrl: 'https://etscbyzexyptgnppwyzv.supabase.co/functions/v1/mcp-proxy',
  
  // Auth (for Supabase mode)
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0c2NieXpleHlwdGducHB3eXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNzIyOTUsImV4cCI6MjA4NTY0ODI5NX0.sqGFlsQbMvqKmq2lyM2azCP16ns22hnrjTeqBBZngEE'
};

let activeMode = null;
let activeUrl = null;

/**
 * Initialize and detect best available endpoint
 */
async function initializeMCP() {
  if (activeMode) return { mode: activeMode, url: activeUrl };
  
  // Try direct MCP server first (Railway)
  const directHealth = await checkEndpointHealth(MCP_CONFIG.directUrl);
  if (directHealth.available) {
    activeMode = 'direct';
    activeUrl = MCP_CONFIG.directUrl;
    console.log('✅ MCP: Using direct Railway server');
    return { mode: activeMode, url: activeUrl };
  }
  
  // Try localhost fallback
  const localHealth = await checkEndpointHealth(MCP_CONFIG.directFallback);
  if (localHealth.available) {
    activeMode = 'direct';
    activeUrl = MCP_CONFIG.directFallback;
    console.log('✅ MCP: Using localhost server');
    return { mode: activeMode, url: activeUrl };
  }
  
  // Fallback to Supabase proxy
  activeMode = 'supabase';
  activeUrl = MCP_CONFIG.supabaseUrl;
  console.log('✅ MCP: Using Supabase Edge Function proxy');
  return { mode: activeMode, url: activeUrl };
}

/**
 * Check if endpoint is healthy
 */
async function checkEndpointHealth(url) {
  try {
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      return { available: false, error: 'Server returned error' };
    }
    
    const data = await response.json();
    return { available: true, server: data };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

/**
 * Call MCP server tool (dual mode support)
 */
async function callMCPTool(toolName, args, authToken = null) {
  await initializeMCP();
  
  if (activeMode === 'direct') {
    return callMCPDirect(toolName, args);
  } else {
    return callMCPViaSupabase(toolName, args, authToken);
  }
}

/**
 * Call MCP server directly (Railway or localhost)
 */
async function callMCPDirect(toolName, args) {
  const response = await fetch(`${activeUrl}/tools/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      params: {
        name: toolName,
        arguments: args
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`MCP server error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || 'MCP tool call failed');
  }
  
  return data.result;
}

/**
 * Call MCP via Supabase Edge Function
 */
async function callMCPViaSupabase(toolName, args, authToken = null) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': MCP_CONFIG.supabaseAnonKey,
  };
  
  // Add auth token if provided (for authenticated users)
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(activeUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tool: toolName,
      params: args
    })
  });
  
  if (!response.ok) {
    throw new Error(`Supabase proxy error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'MCP tool call failed');
  }
  
  return data.data;
}

/**
 * Save analyzed companies to MCP server (Turso database)
 */
async function saveCompaniesToMCP(analysisData, userProfile) {
  const companies = extractCompaniesFromAnalysis(analysisData);
  const savedCompanies = [];
  
  for (const company of companies) {
    try {
      const result = await callMCPTool('gtm_add_company', {
        name: company.name,
        employees: company.employees,
        description: company.description,
        industry: userProfile.targetIndustries || 'Unknown',
        context: `Extracted from ${analysisData.eventName || 'event'} on ${new Date().toISOString()}`
      });
      
      savedCompanies.push({
        company: company.name,
        status: 'saved',
        result
      });
    } catch (error) {
      console.error(`Failed to save company ${company.name}:`, error);
      savedCompanies.push({
        company: company.name,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return savedCompanies;
}

/**
 * Extract companies and employees from analysis data
 */
function extractCompaniesFromAnalysis(analysisData) {
  const companiesMap = new Map();
  
  // Extract from people
  const people = analysisData.people || analysisData.speakers || [];
  people.forEach(person => {
    if (!person.company) return;
    
    if (!companiesMap.has(person.company)) {
      companiesMap.set(person.company, {
        name: person.company,
        employees: [],
        description: '',
      });
    }
    
    companiesMap.get(person.company).employees.push({
      name: person.name || 'Unknown',
      title: person.title || '',
      linkedin: person.linkedin || ''
    });
  });
  
  // Extract from sponsors
  const sponsors = analysisData.sponsors || [];
  sponsors.forEach(sponsor => {
    if (!sponsor.name) return;
    
    if (!companiesMap.has(sponsor.name)) {
      companiesMap.set(sponsor.name, {
        name: sponsor.name,
        employees: [],
        description: sponsor.tier ? `${sponsor.tier} sponsor` : 'Event sponsor',
      });
    } else {
      // Add sponsor tier to description
      const company = companiesMap.get(sponsor.name);
      if (sponsor.tier && !company.description.includes('sponsor')) {
        company.description = `${sponsor.tier} sponsor`;
      }
    }
  });
  
  return Array.from(companiesMap.values()).filter(c => c.employees.length > 0 || c.description);
}

/**
 * Enrich company with AI-generated insights
 */
async function enrichCompany(companyName) {
  return callMCPTool('gtm_enrich_company', { name: companyName });
}

/**
 * Generate GTM strategy for a company
 */
async function generateStrategy(companyName, userProfile) {
  return callMCPTool('gtm_generate_strategy', {
    company_name: companyName,
    your_company: userProfile.companyName,
    your_product: userProfile.product,
    target_personas: userProfile.targetPersonas,
    target_industries: userProfile.targetIndustries
  });
}

/**
 * Draft personalized email
 */
async function draftEmail(companyName, fromName) {
  return callMCPTool('gtm_draft_email', {
    company_name: companyName,
    from_name: fromName
  });
}

/**
 * List all saved companies
 */
async function listSavedCompanies() {
  return callMCPTool('gtm_list_companies', {});
}

/**
 * Search companies
 */
async function searchCompanies(query) {
  return callMCPTool('gtm_search_companies', { query });
}

/**
 * Get company details
 */
async function getCompany(companyName) {
  return callMCPTool('gtm_get_company', { name: companyName });
}

/**
 * Check if MCP server is available
 */
async function checkMCPServerHealth() {
  const init = await initializeMCP();
  return {
    available: true,
    mode: init.mode,
    url: init.url
  };
}

/**
 * Auto-save analysis results to MCP server
 */
async function autoSaveAnalysis(analysisData, userProfile) {
  // Check if MCP server is available
  const health = await checkMCPServerHealth();
  
  if (!health.available) {
    console.warn('MCP server not available, skipping auto-save:', health.error);
    return {
      saved: false,
      reason: 'MCP server not available',
      error: health.error
    };
  }
  
  // Save companies
  const results = await saveCompaniesToMCP(analysisData, userProfile);
  
  // Store in chrome.storage for offline access
  await saveAnalysisToLocalStorage(analysisData);
  
  return {
    saved: true,
    companies: results,
    localBackup: true,
    mode: health.mode
  };
}

/**
 * Save analysis to chrome.storage.local as backup
 */
async function saveAnalysisToLocalStorage(analysisData) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['analysisHistory'], (result) => {
      const history = result.analysisHistory || [];
      
      history.unshift({
        ...analysisData,
        analyzedAt: new Date().toISOString()
      });
      
      // Keep only last 50 analyses
      const trimmed = history.slice(0, 50);
      
      chrome.storage.local.set({ analysisHistory: trimmed }, resolve);
    });
  });
}

/**
 * Get analysis history from local storage
 */
async function getAnalysisHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['analysisHistory'], (result) => {
      resolve(result.analysisHistory || []);
    });
  });
}

/**
 * Get connection info for debugging
 */
async function getConnectionInfo() {
  await initializeMCP();
  return {
    mode: activeMode,
    url: activeUrl,
    config: MCP_CONFIG
  };
}

// Export functions for use in sidepanel.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveCompaniesToMCP,
    enrichCompany,
    generateStrategy,
    draftEmail,
    listSavedCompanies,
    searchCompanies,
    getCompany,
    checkMCPServerHealth,
    autoSaveAnalysis,
    getAnalysisHistory,
    getConnectionInfo,
    initializeMCP
  };
}
