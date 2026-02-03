import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chrome, Database, Globe, RefreshCw, ArrowRight, Check } from "lucide-react";

interface FlowStepProps {
  number: number;
  title: string;
  description: string | string[];
  color: string;
}

function FlowStep({ number, title, description, color }: FlowStepProps) {
  return (
    <div className="flex gap-4">
      <div 
        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div className="flex-1 pb-6 border-l-2 border-dashed border-muted pl-6 ml-[-20px]">
        <h4 className="font-semibold mb-1">{title}</h4>
        {Array.isArray(description) ? (
          <ul className="text-sm text-muted-foreground space-y-1">
            {description.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-3 w-3 mt-1 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export function DataFlowTabs() {
  return (
    <Tabs defaultValue="extension" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="extension" className="text-xs sm:text-sm">
          <Chrome className="h-4 w-4 mr-2 hidden sm:inline" />
          Extension → Database
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
          <Globe className="h-4 w-4 mr-2 hidden sm:inline" />
          Dashboard → MCP
        </TabsTrigger>
        <TabsTrigger value="sync" className="text-xs sm:text-sm">
          <RefreshCw className="h-4 w-4 mr-2 hidden sm:inline" />
          Cross-Device Sync
        </TabsTrigger>
      </TabsList>

      <TabsContent value="extension">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Chrome className="h-5 w-5 text-blue-500" />
              Event Analysis Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <FlowStep
              number={1}
              title="User Action"
              description={[
                "User visits conference website",
                "Clicks 'Analyze Event' in extension"
              ]}
              color="#3b82f6"
            />
            <FlowStep
              number={2}
              title="Content Extraction"
              description={[
                "Extension extracts page HTML",
                "Identifies people, sponsors, event details"
              ]}
              color="#6366f1"
            />
            <FlowStep
              number={3}
              title="AI Analysis"
              description={[
                "Sends to Gemini API",
                "Generates personas, ice breakers, talking points"
              ]}
              color="#8b5cf6"
            />
            <FlowStep
              number={4}
              title="Local Storage"
              description={[
                "Saves to chrome.storage.local (instant, offline)",
                "Displays results in sidepanel"
              ]}
              color="#a855f7"
            />
            <FlowStep
              number={5}
              title="Backend Sync (if authenticated)"
              description={[
                "Extension calls backend-sync.js",
                "POST to Supabase tables: events, people, expected_personas, sponsors, next_best_actions"
              ]}
              color="#c026d3"
            />
            <FlowStep
              number={6}
              title="Result"
              description={[
                "Data available across devices",
                "Accessible in web dashboard",
                "Searchable and enrichable"
              ]}
              color="#10b981"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dashboard">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              Company Enrichment Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <FlowStep
              number={1}
              title="User Request"
              description="User clicks 'Enrich Company' in dashboard"
              color="#f59e0b"
            />
            <FlowStep
              number={2}
              title="Frontend Call"
              description={[
                "React app calls MCP client (@/lib/mcp)",
                "enrichCompany(companyName)"
              ]}
              color="#f97316"
            />
            <FlowStep
              number={3}
              title="MCP Server"
              description={[
                "Receives HTTP request",
                "Tool: gtm_enrich_company",
                "Fetches company from Turso"
              ]}
              color="#8b5cf6"
            />
            <FlowStep
              number={4}
              title="AI Enrichment"
              description={[
                "Sends company data to Gemini API",
                "Prompt: 'Analyze this company...'",
                "Gets back: industry, description, insights"
              ]}
              color="#06b6d4"
            />
            <FlowStep
              number={5}
              title="Database Update"
              description={[
                "Updates Turso with enriched_data JSON",
                "Timestamp: enriched_at"
              ]}
              color="#10b981"
            />
            <FlowStep
              number={6}
              title="Response"
              description={[
                "Returns enriched data to frontend",
                "UI updates with new information"
              ]}
              color="#22c55e"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sync">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-cyan-500" />
              Multi-Device Data Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Chrome className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold text-sm">Device A (Chrome Extension)</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Analyzes event</li>
                  <li>• Syncs to Supabase</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-semibold text-sm">Supabase (Central)</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Stores all data</li>
                  <li>• RLS ensures user isolation</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-sm">Device B (Web Dashboard)</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Loads data from Supabase</li>
                  <li>• Shows all events/companies</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 my-6">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">Real-time Sync</Badge>
              <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180" />
            </div>

            <div className="p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Chrome className="h-5 w-5 text-purple-500" />
                <h4 className="font-semibold text-sm">Device C (Another Chrome)</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Signed in with same account</li>
                <li>• Pulls data from Supabase</li>
                <li>• Merges with local cache</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
