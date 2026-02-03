import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Server, Database, Globe, Cloud, Cpu, ArrowDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LayerProps {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  children: React.ReactNode;
}

function ArchitectureLayer({ title, icon: Icon, color, bgColor, children }: LayerProps) {
  return (
    <div className={`rounded-xl border-2 p-6 ${bgColor}`} style={{ borderColor: color }}>
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="h-10 w-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <h3 className="text-lg font-semibold" style={{ color }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ConnectionArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <ArrowDown className="h-6 w-6 text-muted-foreground" />
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="space-y-2">
      {/* User Layer */}
      <ArchitectureLayer
        title="USER LAYER"
        icon={Chrome}
        color="#3b82f6"
        bgColor="bg-blue-500/5"
      >
        <Card className="bg-background/80">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Chrome className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold">Chrome Extension</h4>
                <p className="text-sm text-muted-foreground mb-2">👤 User browses conference pages</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Event Analysis</Badge>
                  <Badge variant="outline" className="text-xs">Local Storage</Badge>
                  <Badge variant="outline" className="text-xs">Offline Support</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ArchitectureLayer>

      <ConnectionArrow label="HTTP/REST" />

      {/* Intelligence Layer */}
      <ArchitectureLayer
        title="INTELLIGENCE LAYER"
        icon={Cpu}
        color="#8b5cf6"
        bgColor="bg-purple-500/5"
      >
        <Card className="bg-background/80 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Server className="h-8 w-8 text-purple-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">Unified MCP Server (TypeScript)</h4>
                <p className="text-sm text-muted-foreground mb-3">HTTP/SSE Transport • 8 GTM Tools</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <code className="bg-muted px-2 py-1 rounded">gtm_add_company</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_enrich_company</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_generate_strategy</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_draft_email</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_search_companies</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_get_company</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_list_companies</code>
                  <code className="bg-muted px-2 py-1 rounded">gtm_delete_company</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-background/80">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Cpu className="h-6 w-6 text-cyan-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">Gemini AI API</h4>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <li>• Event Analysis</li>
                    <li>• Company Enrichment</li>
                    <li>• Strategy Generation</li>
                    <li>• Email Drafting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Database className="h-6 w-6 text-emerald-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">Turso Database</h4>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <li>• Companies</li>
                    <li>• Employees</li>
                    <li>• Enriched Data</li>
                    <li>• Context</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ArchitectureLayer>

      <ConnectionArrow label="MCP Protocol (HTTP/SSE)" />

      {/* Frontend Layer */}
      <ArchitectureLayer
        title="FRONTEND LAYER"
        icon={Globe}
        color="#f59e0b"
        bgColor="bg-amber-500/5"
      >
        <Card className="bg-background/80">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Globe className="h-8 w-8 text-amber-500 mt-1" />
              <div>
                <h4 className="font-semibold">React Web Dashboard</h4>
                <p className="text-sm text-muted-foreground mb-2">Command Center Interface</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Companies Management</Badge>
                  <Badge variant="outline" className="text-xs">Events Tracking</Badge>
                  <Badge variant="outline" className="text-xs">Strategy Generator</Badge>
                  <Badge variant="outline" className="text-xs">Email Composer</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ArchitectureLayer>

      <ConnectionArrow label="Supabase Client" />

      {/* Backend Layer */}
      <ArchitectureLayer
        title="BACKEND LAYER"
        icon={Cloud}
        color="#10b981"
        bgColor="bg-emerald-500/5"
      >
        <Card className="bg-background/80">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Cloud className="h-8 w-8 text-emerald-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">Supabase Backend</h4>
                <p className="text-sm text-muted-foreground mb-3">PostgreSQL • Auth • RLS • Real-time</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <code className="bg-muted px-2 py-1 rounded">user_profiles</code>
                  <code className="bg-muted px-2 py-1 rounded">events</code>
                  <code className="bg-muted px-2 py-1 rounded">people</code>
                  <code className="bg-muted px-2 py-1 rounded">expected_personas</code>
                  <code className="bg-muted px-2 py-1 rounded">sponsors</code>
                  <code className="bg-muted px-2 py-1 rounded">next_best_actions</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ArchitectureLayer>
    </div>
  );
}
