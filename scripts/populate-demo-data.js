#!/usr/bin/env node

/**
 * Populate Turso database with demo data from event-contacts.csv
 * Uses the unified MCP server to add companies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MCP_SERVER_URL = 'https://unified-mcp-server-production.up.railway.app';
const CSV_PATH = path.join(__dirname, '../../event-contacts.csv');

// Parse CSV
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
    });
    return obj;
  });
}

// Group by company
function groupByCompany(rows) {
  const companies = new Map();
  
  rows.forEach(row => {
    const companyName = row.Company;
    if (!companyName) return; // Skip if no company
    
    if (!companies.has(companyName)) {
      companies.set(companyName, {
        name: companyName,
        employees: [],
        industry: 'Healthcare Technology', // Inferred from event
        context: `Attended "${row.Event}" on ${row.Date} in ${row.Location.split(',')[0]}`
      });
    }
    
    const company = companies.get(companyName);
    if (row.Name) {
      company.employees.push({
        name: row.Name,
        title: row.Title || '',
        linkedin: row.LinkedIn || ''
      });
    }
  });
  
  return Array.from(companies.values());
}

// Call MCP server
async function callMCP(tool, params) {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/tools/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: tool,
          arguments: params
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }
    
    return data.result;
  } catch (error) {
    console.error(`Error calling ${tool}:`, error.message);
    throw error;
  }
}

// Add company to database
async function addCompany(company) {
  console.log(`\n📦 Adding: ${company.name} (${company.employees.length} employees)`);
  
  try {
    const result = await callMCP('gtm_add_company', company);
    
    // Extract success message from MCP response
    let message = 'Added successfully';
    if (result.content && Array.isArray(result.content)) {
      const textContent = result.content.find(c => c.type === 'text');
      if (textContent?.text) {
        message = textContent.text;
      }
    }
    
    console.log(`   ✅ ${message}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return false;
  }
}

// Main
async function main() {
  console.log('🎯 Populating Turso database with demo data...\n');
  
  // Read CSV
  console.log('📄 Reading CSV file...');
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvText);
  console.log(`   Found ${rows.length} attendees\n`);
  
  // Group by company
  console.log('🏢 Grouping by company...');
  const companies = groupByCompany(rows);
  console.log(`   Found ${companies.length} unique companies\n`);
  
  // Show summary
  console.log('📊 Companies to add:');
  companies.forEach(c => {
    console.log(`   • ${c.name} (${c.employees.length} employees)`);
  });
  
  console.log('\n🚀 Adding to database...');
  
  // Add each company
  let successCount = 0;
  let failCount = 0;
  
  for (const company of companies) {
    const success = await addCompany(company);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Done!');
  console.log(`   ✅ Successfully added: ${successCount} companies`);
  if (failCount > 0) {
    console.log(`   ❌ Failed: ${failCount} companies`);
  }
  console.log(`   👥 Total employees: ${companies.reduce((acc, c) => acc + c.employees.length, 0)}`);
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
