import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Lock, Eye, Zap, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Key,
      title: "Authentication",
      color: "#3b82f6",
      items: [
        "Supabase Auth (JWT tokens)",
        "Extension: Optional sign-in",
        "Dashboard: Required sign-in",
        "Token refresh automatic"
      ]
    },
    {
      icon: Lock,
      title: "Data Isolation",
      color: "#8b5cf6",
      items: [
        "Row Level Security on all tables",
        "User can only access their data",
        "No cross-user data leaks"
      ]
    },
    {
      icon: Shield,
      title: "API Keys",
      color: "#10b981",
      items: [
        "Gemini API key stored locally (extension)",
        "MCP server has separate Gemini key",
        "Turso auth token in environment variables"
      ]
    },
    {
      icon: Eye,
      title: "Privacy",
      color: "#f59e0b",
      items: [
        "No personal data collected",
        "User data encrypted at rest",
        "HTTPS required for all API calls",
        "Local-first: works offline"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {securityFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {feature.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span style={{ color: feature.color }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Performance Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-semibold mb-3">Caching Strategy</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Extension</Badge>
                  <span className="text-muted-foreground">chrome.storage.local (instant, 10MB limit)</span>
                </div>
                <div className="text-center text-muted-foreground">↓</div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Supabase</Badge>
                  <span className="text-muted-foreground">PostgreSQL (persistent, unlimited)</span>
                </div>
                <div className="text-center text-muted-foreground">↓</div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">MCP Server</Badge>
                  <span className="text-muted-foreground">Turso (edge, low latency)</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold mb-3">Optimizations</h5>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Local cache for instant load
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Background sync (non-blocking)
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Batch inserts for related data
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Indexed database fields
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Lazy loading of event details
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
