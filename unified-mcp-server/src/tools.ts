import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Combined tools from GTM Enrichment and Lovable.dev Control

export const GTM_TOOLS: Tool[] = [
  {
    name: 'gtm_add_company',
    description: 'Add a new company profile to the GTM database',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
        employees: {
          type: 'array',
          description: 'List of employees',
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
        description: { type: 'string', description: 'Company description (optional)' },
        industry: { type: 'string', description: 'Industry vertical (optional)' },
        context: { type: 'string', description: 'Additional context (e.g., event attended)' },
      },
      required: ['name', 'employees'],
    },
  },
  {
    name: 'gtm_get_company',
    description: 'Retrieve a company profile from GTM database',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'gtm_list_companies',
    description: 'List all companies in GTM database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'gtm_search_companies',
    description: 'Search companies by name, description, industry, or employee',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'gtm_enrich_company',
    description: 'Enrich a company profile with AI-generated insights',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'gtm_generate_strategy',
    description: 'Generate personalized GTM communication strategy',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: { type: 'string', description: 'Target company name' },
        your_company: { type: 'string', description: 'Your company name' },
        your_product: { type: 'string', description: 'Your product/service' },
        target_personas: { type: 'string', description: 'Target personas (optional)' },
        target_industries: { type: 'string', description: 'Target industries (optional)' },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'gtm_draft_email',
    description: 'Draft personalized cold outreach email',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: { type: 'string', description: 'Target company name' },
        from_name: { type: 'string', description: 'Your name' },
      },
      required: ['company_name', 'from_name'],
    },
  },
  {
    name: 'gtm_delete_company',
    description: 'Delete a company from GTM database',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
      },
      required: ['name'],
    },
  },
];

export const LOVABLE_TOOLS: Tool[] = [
  {
    name: 'lovable_create_project',
    description: 'Create a new Lovable.dev project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        template: {
          type: 'string',
          enum: ['blank', 'react', 'vue', 'nextjs', 'vite'],
          description: 'Project template',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'lovable_list_projects',
    description: 'List all Lovable.dev projects',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max projects to return', default: 10 },
      },
    },
  },
  {
    name: 'lovable_get_project_status',
    description: 'Get the status of a Lovable project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'lovable_delete_project',
    description: 'Delete a Lovable project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'lovable_send_command',
    description: 'Send a command/prompt to Lovable AI',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        command: { type: 'string', description: 'Command/prompt to send' },
        context: { type: 'string', description: 'Additional context (optional)' },
      },
      required: ['projectId', 'command'],
    },
  },
  {
    name: 'lovable_chat_with_agent',
    description: 'Chat with Lovable AI agent',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        message: { type: 'string', description: 'Message to send' },
      },
      required: ['projectId', 'message'],
    },
  },
  {
    name: 'lovable_generate_code',
    description: 'Generate code using Lovable AI',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        prompt: { type: 'string', description: 'Code generation prompt' },
        targetFile: { type: 'string', description: 'Target file path (optional)' },
      },
      required: ['projectId', 'prompt'],
    },
  },
  {
    name: 'lovable_deploy_project',
    description: 'Deploy a Lovable project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        environment: {
          type: 'string',
          enum: ['preview', 'production'],
          description: 'Deployment environment',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'lovable_get_build_status',
    description: 'Check Lovable project build status',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'lovable_edit_file',
    description: 'Edit a file in Lovable project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        filePath: { type: 'string', description: 'File path' },
        content: { type: 'string', description: 'New content' },
      },
      required: ['projectId', 'filePath', 'content'],
    },
  },
  {
    name: 'lovable_read_file',
    description: 'Read a file from Lovable project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        filePath: { type: 'string', description: 'File path' },
      },
      required: ['projectId', 'filePath'],
    },
  },
];

export const ALL_TOOLS: Tool[] = [...GTM_TOOLS, ...LOVABLE_TOOLS];
