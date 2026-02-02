#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { ALL_TOOLS } from './tools.js';
import { handleToolCall } from './tool-handler.js';

// Load environment variables
config();

// Validate required environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!TURSO_URL || !TURSO_TOKEN || !GEMINI_KEY) {
  console.error('Error: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, and GEMINI_API_KEY must be set');
  process.exit(1);
}

// Create MCP server
const server = new Server(
  {
    name: 'unified-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list_tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: ALL_TOOLS,
  };
});

// Handle call_tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return handleToolCall(request.params);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Unified MCP Server running (GTM + Lovable)');
