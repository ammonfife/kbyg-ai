import { ArrowRight, Chrome, Database, Server, Cpu, Globe, Zap, Code2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import kbygLogo from "@/assets/kbyg-logo.png";

export default function TechnicalPage() {
  const navigate = useNavigate();

  const architectureLayers = [
    {
      icon: Chrome,
      title: "Chrome Extension",
      subtitle: "Data Capture Layer",
      color: "#3b82f6",
      description: "The KBYG browser extension is the primary data ingestion point. It extracts structured data from conference and event websites.",
      details: [
        "Scrapes speaker bios, sponsor logos, and attendee lists",
        "Parses event schedules and session metadata",
        "Captures company information and LinkedIn profiles",
        "Sends extracted data to the MCP server via JSON-RPC"
      ]
    },
    {
      icon: Server,
      title: "Unified MCP Server",
      subtitle: "Intelligence Processing Layer",
      color: "#8b5cf6",
      description: "A Railway-hosted Model Context Protocol server that provides 19 specialized tools for GTM intelligence operations.",
      details: [
        "8 GTM-specific tools (company CRUD, enrichment, strategy)",
        "11 platform management tools",
        "Gemini 1.5 Pro integration for AI enrichment",
        "JSON-RPC 2.0 transport protocol"
      ]
    },
    {
      icon: Zap,
      title: "Edge Function Proxy",
      subtitle: "Transport Layer",
      color: "#06b6d4",
      description: "Supabase Edge Functions act as a secure proxy, bridging browser clients with the MCP server (browsers can't call MCP directly).",
      details: [
        "Implements JSON-RPC 2.0 transport logic",
        "Transforms MCP text responses to structured JSON",
        "Handles authentication and request validation",
        "CORS-enabled for web app access"
      ]
    },
    {
      icon: Database,
      title: "Turso Database",
      subtitle: "Persistence Layer",
      color: "#10b981",
      description: "A distributed SQLite database (libSQL) that stores all extracted company profiles, contacts, and enrichment data.",
      details: [
        "Company profiles with enrichment metadata",
        "Employee/contact records with LinkedIn data",
        "Event and conference groupings",
        "AI-generated strategies and email drafts"
      ]
    },
    {
      icon: Globe,
      title: "React Frontend",
      subtitle: "Presentation Layer",
      color: "#f59e0b",
      description: "A responsive React application providing the Command Center interface for viewing and managing extracted intelligence.",
      details: [
        "Real-time dashboard with operational metrics",
        "Target Database for company management",
        "People directory for contact lookup",
        "Outreach composer with AI-generated emails"
      ]
    }
  ];

  const dataFlowSteps = [
    {
      step: 1,
      from: "User",
      to: "Chrome Extension",
      action: "Visits conference website, clicks KBYG extension"
    },
    {
      step: 2,
      from: "Chrome Extension",
      to: "MCP Server",
      action: "Sends extracted HTML/data via JSON-RPC call"
    },
    {
      step: 3,
      from: "MCP Server",
      to: "Gemini 1.5 Pro",
      action: "Processes data with AI for entity extraction & enrichment"
    },
    {
      step: 4,
      from: "MCP Server",
      to: "Turso DB",
      action: "Persists structured company/contact records"
    },
    {
      step: 5,
      from: "Frontend",
      to: "Edge Proxy",
      action: "User requests data via supabase.functions.invoke()"
    },
    {
      step: 6,
      from: "Edge Proxy",
      to: "MCP Server",
      action: "Forwards request with JSON-RPC 2.0 protocol"
    },
    {
      step: 7,
      from: "MCP Server",
      to: "Frontend",
      action: "Returns structured data → displayed in Command Center"
    }
  ];

  const techStack = [
    { category: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn UI", "React Router", "TanStack Query"] },
    { category: "Backend", items: ["Supabase Edge Functions (Deno)", "Model Context Protocol", "JSON-RPC 2.0"] },
    { category: "AI/ML", items: ["Gemini 1.5 Pro", "Lovable AI Gateway"] },
    { category: "Database", items: ["Turso (libSQL)", "Supabase (auth & proxy)"] },
    { category: "Infrastructure", items: ["Railway (MCP hosting)", "Supabase Cloud", "Lovable Cloud"] }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
            <img src={kbygLogo} alt="KBYG.ai" className="h-8" />
          </button>
          <Badge className="bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20">
            <Code2 className="h-3 w-3 mr-1" />
            Technical Documentation
          </Badge>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4 bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">
            <Layers className="h-3 w-3 mr-1" />
            System Architecture
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How KBYG Works Under the Hood
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A deep dive into the data flow between the Chrome extension, MCP servers, databases, and frontend.
          </p>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Architecture Layers</h2>
          
          <div className="space-y-4">
            {architectureLayers.map((layer, idx) => (
              <div key={idx} className="relative">
                <div 
                  className="p-6 rounded-xl border border-border bg-card hover:border-opacity-50 transition-all"
                  style={{ borderLeftWidth: '4px', borderLeftColor: layer.color }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${layer.color}15` }}
                    >
                      <layer.icon className="h-6 w-6" style={{ color: layer.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold">{layer.title}</h3>
                        <Badge variant="outline" className="text-xs" style={{ borderColor: layer.color, color: layer.color }}>
                          {layer.subtitle}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{layer.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {layer.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span style={{ color: layer.color }}>•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {idx < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow Diagram */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Data Flow Sequence</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4]" />
            
            <div className="space-y-6">
              {dataFlowSteps.map((flow, idx) => (
                <div key={idx} className="relative flex items-start gap-6 pl-4">
                  {/* Step number */}
                  <div 
                    className="relative z-10 h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)`,
                    }}
                  >
                    {flow.step}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-[#3b82f6]">{flow.from}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-[#8b5cf6]">{flow.to}</span>
                    </div>
                    <p className="text-muted-foreground">{flow.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MCP Protocol Details */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">MCP Protocol Deep Dive</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#8b5cf6]" />
                Why MCP?
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                The Model Context Protocol (MCP) provides a standardized way to expose AI-powered tools. Our Unified MCP Server hosts 19 tools that can be called by any MCP-compatible client.
              </p>
              <p className="text-muted-foreground text-sm">
                Since browsers can't call MCP servers directly, we use a Supabase Edge Function as a proxy that translates HTTP requests to JSON-RPC 2.0 format.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Server className="h-5 w-5 text-[#06b6d4]" />
                MCP Tools Available
              </h3>
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-[#3b82f6]">GTM Tools (8):</span>
                  <p className="text-muted-foreground">add_company, get_company, list_companies, update_company, delete_company, enrich_company, generate_strategy, draft_email</p>
                </div>
                <div>
                  <span className="font-medium text-[#8b5cf6]">Platform Tools (11):</span>
                  <p className="text-muted-foreground">Health checks, database management, batch operations, configuration tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Technology Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {techStack.map((stack, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-sm mb-2" style={{ 
                  color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][idx] 
                }}>
                  {stack.category}
                </h3>
                <ul className="space-y-1">
                  {stack.items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-[#3b82f6] transition-colors">
            ← Back to Home
          </button>
          <p className="text-sm text-muted-foreground">
            Built at Utah Tech Week 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
