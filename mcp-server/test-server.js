#!/usr/bin/env node

/**
 * Simple test script to verify MCP server is working
 * 
 * Usage: node test-server.js
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing GTM Enrichment MCP Server...\n');

// Start the server
const server = spawn('node', [join(__dirname, 'dist', 'index.js')], {
  env: {
    ...process.env,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || 'libsql://gtmapp-gtmapp.aws-us-west-2.turso.io',
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Listen for stderr (server logs)
server.stderr.on('data', (data) => {
  console.log('📡 Server:', data.toString().trim());
});

// Send list_tools request
setTimeout(() => {
  console.log('\n📤 Sending list_tools request...\n');
  
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {},
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

// Listen for stdout (server responses)
let buffer = '';
server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  // Try to parse complete JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log('📥 Response:', JSON.stringify(response, null, 2));
        
        if (response.result && response.result.tools) {
          console.log(`\n✅ Server working! Found ${response.result.tools.length} tools:\n`);
          response.result.tools.forEach(tool => {
            console.log(`   • ${tool.name} - ${tool.description}`);
          });
          
          server.kill();
          process.exit(0);
        }
      } catch (e) {
        console.error('Failed to parse response:', line);
      }
    }
  }
});

server.on('close', (code) => {
  console.log(`\n🛑 Server exited with code ${code}`);
  process.exit(code || 0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('\n❌ Test timed out');
  server.kill();
  process.exit(1);
}, 10000);
