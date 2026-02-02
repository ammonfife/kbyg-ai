#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { ALL_TOOLS } from './tools.js';
import { handleToolCall } from './tool-handler.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.MCP_BEARER_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Bearer token authentication (optional)
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!BEARER_TOKEN) {
    return next(); // No auth required if token not set
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token' });
  }

  const token = authHeader.substring(7);
  if (token !== BEARER_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Bearer token' });
  }

  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'unified-mcp',
    version: '1.0.0',
    tools: ALL_TOOLS.length,
  });
});

// SSE endpoint for MCP protocol
app.get('/sse', authMiddleware, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial message
  res.write('data: {"type":"connected","server":"unified-mcp","version":"1.0.0"}\n\n');

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(':ping\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
});

// List tools endpoint
app.post('/tools/list', authMiddleware, async (req, res) => {
  try {
    res.json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      result: {
        tools: ALL_TOOLS,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      error: {
        code: -32603,
        message: error.message,
      },
    });
  }
});

// Call tool endpoint
app.post('/tools/call', authMiddleware, async (req, res) => {
  try {
    const { name, arguments: args } = req.body.params || {};

    if (!name) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: req.body.id || 1,
        error: {
          code: -32602,
          message: 'Invalid params: tool name is required',
        },
      });
    }

    const result = await handleToolCall({ name, arguments: args });

    res.json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      result,
    });
  } catch (error: any) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      error: {
        code: -32603,
        message: error.message,
      },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Unified MCP Server running on http://localhost:${PORT}`);
  console.log(`📊 Tools available: ${ALL_TOOLS.length}`);
  console.log(`   - GTM Enrichment: 8 tools`);
  console.log(`   - Lovable.dev Control: 11 tools`);
  console.log(`\n🔗 Endpoints:`);
  console.log(`   GET  /health           - Health check`);
  console.log(`   GET  /sse              - SSE transport (for Lovable.dev)`);
  console.log(`   POST /tools/list       - List all tools`);
  console.log(`   POST /tools/call       - Call a tool`);
  if (BEARER_TOKEN) {
    console.log(`\n🔒 Authentication: Bearer token required`);
  } else {
    console.log(`\n⚠️  Authentication: Disabled (set MCP_BEARER_TOKEN to enable)`);
  }
});
