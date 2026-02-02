#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { GTMDatabase, CompanyProfile } from './db.js';
import { EnrichmentService } from './enrichment.js';

// Environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
  process.exit(1);
}

if (!GEMINI_KEY) {
  console.error('Error: GEMINI_API_KEY must be set');
  process.exit(1);
}

// Initialize services
const db = new GTMDatabase(TURSO_URL, TURSO_TOKEN);
const enrichment = new EnrichmentService(GEMINI_KEY);

// Initialize database
await db.initialize();

// Define tools
const TOOLS: Tool[] = [
  {
    name: 'add_company',
    description:
      'Add a new company profile to the database. Provide company name, employees, and optional context.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Company name',
        },
        employees: {
          type: 'array',
          description: 'List of employees at the company',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              title: { type: 'string' },
              linkedin: { type: 'string' },
            },
            required: ['name', 'title'],
          },
        },
        description: {
          type: 'string',
          description: 'Company description (optional)',
        },
        industry: {
          type: 'string',
          description: 'Industry vertical (optional)',
        },
        context: {
          type: 'string',
          description: 'Additional context (e.g., "Met at Conference X")',
        },
      },
      required: ['name', 'employees'],
    },
  },
  {
    name: 'get_company',
    description: 'Retrieve a company profile by name',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Company name to retrieve',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_companies',
    description: 'List all companies in the database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_companies',
    description: 'Search companies by name, description, industry, or employee name',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'enrich_company',
    description:
      'Enrich a company profile with AI-generated insights (description, industry, recent activity)',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Company name to enrich',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'generate_strategy',
    description:
      'Generate a personalized GTM communication strategy for a target company',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: {
          type: 'string',
          description: 'Target company name',
        },
        your_company: {
          type: 'string',
          description: 'Your company name',
        },
        your_product: {
          type: 'string',
          description: 'Your product/service description',
        },
        target_personas: {
          type: 'string',
          description: 'Target personas/roles (optional)',
        },
        target_industries: {
          type: 'string',
          description: 'Target industries (optional)',
        },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'draft_email',
    description: 'Draft a personalized cold outreach email to a company',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: {
          type: 'string',
          description: 'Target company name',
        },
        from_name: {
          type: 'string',
          description: 'Your name',
        },
      },
      required: ['company_name', 'from_name'],
    },
  },
  {
    name: 'delete_company',
    description: 'Delete a company from the database',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Company name to delete',
        },
      },
      required: ['name'],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'gtm-enrichment-mcp',
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
    tools: TOOLS,
  };
});

// Handle call_tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [{ type: 'text', text: 'No arguments provided' }],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'add_company': {
        const profile: CompanyProfile = {
          name: args.name as string,
          description: args.description as string | undefined,
          industry: args.industry as string | undefined,
          context: args.context as string | undefined,
          employees: args.employees as any[],
        };

        const companyId = await db.addCompany(profile);

        return {
          content: [
            {
              type: 'text',
              text: `✅ Company "${profile.name}" added successfully (ID: ${companyId})`,
            },
          ],
        };
      }

      case 'get_company': {
        const name = args.name as string;
        const profile = await db.getCompany(name);

        if (!profile) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Company "${name}" not found`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(profile, null, 2),
            },
          ],
        };
      }

      case 'list_companies': {
        const companies = await db.listCompanies();

        return {
          content: [
            {
              type: 'text',
              text: `📊 Found ${companies.length} companies:\n\n${companies
                .map((c) => `• ${c.name} (${c.employees.length} employees)`)
                .join('\n')}`,
            },
          ],
        };
      }

      case 'search_companies': {
        const query = args.query as string;
        const results = await db.searchCompanies(query);

        return {
          content: [
            {
              type: 'text',
              text: `🔍 Found ${results.length} companies matching "${query}":\n\n${results
                .map((c) => `• ${c.name} (${c.employees.length} employees)`)
                .join('\n')}`,
            },
          ],
        };
      }

      case 'enrich_company': {
        const name = args.name as string;
        let profile = await db.getCompany(name);

        if (!profile) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Company "${name}" not found`,
              },
            ],
          };
        }

        profile = await enrichment.enrichProfile(profile);
        await db.addCompany(profile);

        return {
          content: [
            {
              type: 'text',
              text: `✨ Company "${name}" enriched successfully!\n\n${JSON.stringify(
                {
                  description: profile.description,
                  industry: profile.industry,
                  recent_activity: profile.recent_activity,
                },
                null,
                2
              )}`,
            },
          ],
        };
      }

      case 'generate_strategy': {
        const companyName = args.company_name as string;
        const profile = await db.getCompany(companyName);

        if (!profile) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Company "${companyName}" not found`,
              },
            ],
          };
        }

        const strategy = await enrichment.generateCommunicationStrategy(profile, {
          yourCompany: args.your_company as string | undefined,
          yourProduct: args.your_product as string | undefined,
          targetPersonas: args.target_personas as string | undefined,
          targetIndustries: args.target_industries as string | undefined,
        });

        return {
          content: [
            {
              type: 'text',
              text: `📋 **GTM Strategy for ${profile.name}**\n\n${strategy}`,
            },
          ],
        };
      }

      case 'draft_email': {
        const companyName = args.company_name as string;
        const fromName = args.from_name as string;
        const profile = await db.getCompany(companyName);

        if (!profile) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Company "${companyName}" not found`,
              },
            ],
          };
        }

        const email = await enrichment.draftEmail(profile, fromName);

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Draft Email to ${profile.name}**\n\n${email}`,
            },
          ],
        };
      }

      case 'delete_company': {
        const name = args.name as string;
        const deleted = await db.deleteCompany(name);

        if (!deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Company "${name}" not found`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `🗑️ Company "${name}" deleted successfully`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('GTM Enrichment MCP Server running');
