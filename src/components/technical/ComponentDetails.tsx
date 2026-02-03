import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chrome, Server, Globe, Cloud } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ComponentCardProps {
  icon: React.ElementType;
  title: string;
  color: string;
  techStack: string[];
  keyFiles: { name: string; description: string }[];
  children?: React.ReactNode;
}

function ComponentCard({ icon: Icon, title, color, techStack, keyFiles, children }: ComponentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tech Stack</h5>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Files</h5>
          <ul className="space-y-1">
            {keyFiles.map((file) => (
              <li key={file.name} className="text-xs">
                <code className="text-primary">{file.name}</code>
                <span className="text-muted-foreground"> - {file.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}

export function ComponentDetails() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="extension">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Chrome className="h-5 w-5 text-blue-500" />
            Chrome Extension
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ComponentCard
            icon={Chrome}
            title="Chrome Extension"
            color="#3b82f6"
            techStack={["Manifest V3", "Vanilla JavaScript", "Gemini 2.0 Flash API", "chrome.storage.local", "Supabase JS client"]}
            keyFiles={[
              { name: "background.js", description: "Service worker, API calls" },
              { name: "sidepanel.js", description: "UI logic, rendering" },
              { name: "backend-sync.js", description: "Supabase sync" },
              { name: "auth-handler.js", description: "Authentication" },
              { name: "mcp-integration.js", description: "MCP server calls" }
            ]}
          >
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Storage Example</h5>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`chrome.storage.local.set({
  userProfile: { ... },
  savedEvents: { ... }
})`}
              </pre>
            </div>
          </ComponentCard>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mcp">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-500" />
            Unified MCP Server
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ComponentCard
            icon={Server}
            title="Unified MCP Server"
            color="#8b5cf6"
            techStack={["Node.js", "TypeScript", "MCP SDK", "Turso (libSQL)", "Gemini 1.5 Pro", "Express"]}
            keyFiles={[
              { name: "src/index.ts", description: "Server entry" },
              { name: "src/tools.ts", description: "Tool definitions" },
              { name: "src/gtm-enrichment.ts", description: "GTM logic" },
              { name: "src/gtm-db.ts", description: "Database layer" }
            ]}
          >
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Database Schema (Turso)</h5>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`companies (id, name, description, industry, enriched_at)
employees (id, company_id, name, title, linkedin)`}
              </pre>
            </div>
          </ComponentCard>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dashboard">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-500" />
            Web Dashboard
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ComponentCard
            icon={Globe}
            title="Web Dashboard"
            color="#f59e0b"
            techStack={["React 18", "TypeScript", "Vite", "Tailwind CSS", "Shadcn UI", "React Router", "TanStack Query"]}
            keyFiles={[
              { name: "src/pages/", description: "Page components" },
              { name: "src/components/", description: "Reusable components" },
              { name: "src/lib/mcp.ts", description: "MCP client" },
              { name: "src/integrations/supabase/", description: "Supabase client" }
            ]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="backend">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-emerald-500" />
            Supabase Backend
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ComponentCard
            icon={Cloud}
            title="Supabase Backend"
            color="#10b981"
            techStack={["PostgreSQL", "Supabase Auth", "Row Level Security", "Real-time Subscriptions", "Edge Functions"]}
            keyFiles={[
              { name: "user_profiles", description: "User onboarding data" },
              { name: "events", description: "Analyzed conferences" },
              { name: "people", description: "Attendees, speakers" },
              { name: "expected_personas", description: "AI predictions" },
              { name: "sponsors", description: "Event sponsors" },
              { name: "next_best_actions", description: "AI recommendations" }
            ]}
          >
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">RLS Policy Example</h5>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`-- Users can only access their own data
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);`}
              </pre>
            </div>
          </ComponentCard>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
