import { GTMDatabase, CompanyProfile } from './gtm-db.js';
import { EnrichmentService } from './gtm-enrichment.js';
import { LovableClient } from './lovable-client.js';

// Initialize services
const gtmDb = new GTMDatabase(
  process.env.TURSO_DATABASE_URL!,
  process.env.TURSO_AUTH_TOKEN!
);

const enrichment = new EnrichmentService(process.env.GEMINI_API_KEY!);

const lovable = new LovableClient(process.env.LOVABLE_API_KEY);

// Initialize GTM database
await gtmDb.initialize();

export async function handleToolCall(params: { name: string; arguments?: any }) {
  const { name, arguments: args } = params;

  if (!args) {
    return {
      content: [{ type: 'text', text: 'No arguments provided' }],
      isError: true,
    };
  }

  try {
    // GTM Tools
    if (name.startsWith('gtm_')) {
      return await handleGTMTool(name, args);
    }

    // Lovable Tools
    if (name.startsWith('lovable_')) {
      return await handleLovableTool(name, args);
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}

async function handleGTMTool(name: string, args: any) {
  switch (name) {
    case 'gtm_add_company': {
      const profile: CompanyProfile = {
        name: args.name,
        description: args.description,
        industry: args.industry,
        context: args.context,
        employees: args.employees,
      };
      const companyId = await gtmDb.addCompany(profile);
      return {
        content: [
          {
            type: 'text',
            text: `✅ Company "${profile.name}" added successfully (ID: ${companyId})`,
          },
        ],
      };
    }

    case 'gtm_get_company': {
      const profile = await gtmDb.getCompany(args.name);
      if (!profile) {
        return {
          content: [{ type: 'text', text: `❌ Company "${args.name}" not found` }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }],
      };
    }

    case 'gtm_list_companies': {
      const companies = await gtmDb.listCompanies();
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

    case 'gtm_search_companies': {
      const results = await gtmDb.searchCompanies(args.query);
      return {
        content: [
          {
            type: 'text',
            text: `🔍 Found ${results.length} companies matching "${args.query}":\n\n${results
              .map((c) => `• ${c.name} (${c.employees.length} employees)`)
              .join('\n')}`,
          },
        ],
      };
    }

    case 'gtm_enrich_company': {
      const profile = await gtmDb.getCompany(args.name);
      if (!profile) {
        return {
          content: [{ type: 'text', text: `❌ Company "${args.name}" not found` }],
        };
      }
      const enrichedProfile = await enrichment.enrichProfile(profile);
      await gtmDb.addCompany(enrichedProfile);
      return {
        content: [
          {
            type: 'text',
            text: `✨ Company "${args.name}" enriched successfully!\n\n${JSON.stringify(
              {
                description: enrichedProfile.description,
                industry: enrichedProfile.industry,
                recent_activity: enrichedProfile.recent_activity,
              },
              null,
              2
            )}`,
          },
        ],
      };
    }

    case 'gtm_generate_strategy': {
      const profile = await gtmDb.getCompany(args.company_name);
      if (!profile) {
        return {
          content: [{ type: 'text', text: `❌ Company "${args.company_name}" not found` }],
        };
      }
      const strategy = await enrichment.generateCommunicationStrategy(profile, {
        yourCompany: args.your_company,
        yourProduct: args.your_product,
        targetPersonas: args.target_personas,
        targetIndustries: args.target_industries,
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

    case 'gtm_draft_email': {
      const profile = await gtmDb.getCompany(args.company_name);
      if (!profile) {
        return {
          content: [{ type: 'text', text: `❌ Company "${args.company_name}" not found` }],
        };
      }
      const email = await enrichment.draftEmail(profile, args.from_name);
      return {
        content: [
          {
            type: 'text',
            text: `📧 **Draft Email to ${profile.name}**\n\n${email}`,
          },
        ],
      };
    }

    case 'gtm_delete_company': {
      const deleted = await gtmDb.deleteCompany(args.name);
      if (!deleted) {
        return {
          content: [{ type: 'text', text: `❌ Company "${args.name}" not found` }],
        };
      }
      return {
        content: [{ type: 'text', text: `🗑️ Company "${args.name}" deleted successfully` }],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown GTM tool: ${name}` }],
        isError: true,
      };
  }
}

async function handleLovableTool(name: string, args: any) {
  switch (name) {
    case 'lovable_create_project': {
      const result = await lovable.createProject({
        name: args.name,
        description: args.description,
        template: args.template,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_list_projects': {
      const result = await lovable.listProjects({ limit: args.limit });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_get_project_status': {
      const result = await lovable.getProjectStatus({ projectId: args.projectId });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_delete_project': {
      const result = await lovable.deleteProject({ projectId: args.projectId });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_send_command': {
      const result = await lovable.sendCommand({
        projectId: args.projectId,
        command: args.command,
        context: args.context,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_chat_with_agent': {
      const result = await lovable.chatWithAgent({
        projectId: args.projectId,
        message: args.message,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_generate_code': {
      const result = await lovable.generateCode({
        projectId: args.projectId,
        prompt: args.prompt,
        targetFile: args.targetFile,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_deploy_project': {
      const result = await lovable.deployProject({
        projectId: args.projectId,
        environment: args.environment,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_get_build_status': {
      const result = await lovable.getBuildStatus({ projectId: args.projectId });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_edit_file': {
      const result = await lovable.editFile({
        projectId: args.projectId,
        filePath: args.filePath,
        content: args.content,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'lovable_read_file': {
      const result = await lovable.readFile({
        projectId: args.projectId,
        filePath: args.filePath,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown Lovable tool: ${name}` }],
        isError: true,
      };
  }
}
