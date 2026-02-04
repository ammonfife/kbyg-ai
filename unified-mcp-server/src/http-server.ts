#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { ALL_TOOLS } from './tools.js';
import { handleToolCall } from './tool-handler.js';
import { EventDatabase } from './event-db.js';
import { createEventRouter } from './event-api.js';
import { GeminiProxy } from './gemini-proxy.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.MCP_BEARER_TOKEN;

// Initialize Event Database
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
  process.exit(1);
}

const eventDb = new EventDatabase(TURSO_URL, TURSO_TOKEN);
await eventDb.initialize();
console.log('✅ Event database initialized');

// Initialize Gemini Proxy
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️  Warning: GEMINI_API_KEY not set. Gemini proxy endpoints will fail.');
}
const geminiProxy = GEMINI_API_KEY ? new GeminiProxy(GEMINI_API_KEY) : null;

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

// Mount Event API routes
app.use('/api', createEventRouter(eventDb));

// Gemini API Proxy Routes
// POST /api/gemini/generate - Generic text generation
app.post('/api/gemini/generate', authMiddleware, async (req, res) => {
  if (!geminiProxy) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  try {
    const { prompt, systemInstruction, model, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const result = await geminiProxy.generate({
      prompt,
      systemInstruction,
      model,
      temperature,
      maxTokens,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Gemini generate error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// POST /api/gemini/analyze - Analyze conference event
app.post('/api/gemini/analyze', authMiddleware, async (req, res) => {
  if (!geminiProxy) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  try {
    const { eventName, eventUrl, pageContent, specificQuery } = req.body;

    if (!eventName || !pageContent) {
      return res.status(400).json({ error: 'eventName and pageContent are required' });
    }

    const analysis = await geminiProxy.analyzeConferenceEvent({
      eventName,
      eventUrl: eventUrl || '',
      pageContent,
      specificQuery,
    });

    res.json({ analysis });
  } catch (error: any) {
    console.error('Gemini analyze error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze event' });
  }
});

// POST /api/gemini/extract - Extract company profiles
app.post('/api/gemini/extract', authMiddleware, async (req, res) => {
  if (!geminiProxy) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const profiles = await geminiProxy.extractCompanyProfiles(text);

    res.json({ profiles });
  } catch (error: any) {
    console.error('Gemini extract error:', error);
    res.status(500).json({ error: error.message || 'Failed to extract profiles' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'unified-mcp',
    version: '1.0.0',
    tools: ALL_TOOLS.length,
    eventApi: 'enabled',
    geminiProxy: geminiProxy ? 'enabled' : 'disabled',
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
  console.log(`\n🔗 MCP Endpoints:`);
  console.log(`   GET  /health           - Health check`);
  console.log(`   GET  /sse              - SSE transport (for Lovable.dev)`);
  console.log(`   POST /tools/list       - List all tools`);
  console.log(`   POST /tools/call       - Call a tool`);
  console.log(`\n📅 Event API Endpoints:`);
  console.log(`   POST   /api/events                - Save event analysis`);
  console.log(`   GET    /api/events                - List all events`);
  console.log(`   GET    /api/events/:url           - Get specific event`);
  console.log(`   DELETE /api/events/:url           - Delete event`);
  console.log(`   POST   /api/events/bulk           - Bulk import events`);
  console.log(`   POST   /api/profile               - Save user profile`);
  console.log(`   GET    /api/profile               - Get user profile`);
  console.log(`   GET    /api/people/search?q=...   - Search people`);
  console.log(`   GET    /api/analytics/summary     - Get analytics summary`);
  if (geminiProxy) {
    console.log(`\n🤖 Gemini API Endpoints:`);
    console.log(`   POST   /api/gemini/generate      - Generic text generation`);
    console.log(`   POST   /api/gemini/analyze       - Analyze conference event`);
    console.log(`   POST   /api/gemini/extract       - Extract company profiles`);
  }
  if (BEARER_TOKEN) {
    console.log(`\n🔒 Authentication: Bearer token required`);
  } else {
    console.log(`\n⚠️  Authentication: Disabled (set MCP_BEARER_TOKEN to enable)`);
  }
});
