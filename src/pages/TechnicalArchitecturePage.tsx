import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Layers, GitBranch, Shield, Table, Code2, Blocks, Server } from "lucide-react";
import kbygLogo from "@/assets/brand/kbyg-logo.png";

import { ArchitectureDiagram } from "@/components/technical/ArchitectureDiagram";
import { DataFlowTabs } from "@/components/technical/DataFlowTabs";
import { ComponentDetails } from "@/components/technical/ComponentDetails";
import { SecuritySection } from "@/components/technical/SecuritySection";
import { ApiEndpointsTable } from "@/components/technical/ApiEndpointsTable";
import { McpToolsTable } from "@/components/technical/McpToolsTable";
import { TechStackGrid } from "@/components/technical/TechStackGrid";
import { CodeExamples } from "@/components/technical/CodeExamples";

interface SectionProps {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ id, icon: Icon, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function TechnicalArchitecturePage() {
  const navigate = useNavigate();

  const sections = [
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "data-flow", label: "Data Flow", icon: GitBranch },
    { id: "components", label: "Components", icon: Blocks },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Endpoints", icon: Table },
    { id: "mcp", label: "MCP Tools", icon: Server },
    { id: "stack", label: "Tech Stack", icon: Code2 },
    { id: "examples", label: "Code Examples", icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
              <img src={kbygLogo} alt="KBYG.ai" className="h-8" />
            </button>
          </div>
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Code2 className="h-3 w-3 mr-1" />
            Technical Documentation
          </Badge>
        </div>
      </nav>

      {/* Quick Nav */}
      <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <nav className="flex flex-col gap-1 p-2 rounded-lg border bg-background/80 backdrop-blur-sm">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden xl:inline">{section.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Layers className="h-3 w-3 mr-1" />
            System Architecture
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            KBYG Technical Architecture
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Know Before You Go — System Architecture & Data Flow
          </p>
          <p className="text-sm text-muted-foreground mt-4 max-w-3xl mx-auto">
            A comprehensive technical documentation of how data flows from the Chrome extension 
            through MCP servers, frontend, backend, and databases.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        <Section id="architecture" icon={Layers} title="Architecture Overview" subtitle="Full system architecture from user layer to backend">
          <ArchitectureDiagram />
        </Section>

        <Separator />

        <Section id="data-flow" icon={GitBranch} title="Data Flow" subtitle="How data moves through the system">
          <DataFlowTabs />
        </Section>

        <Separator />

        <Section id="components" icon={Blocks} title="Component Details" subtitle="Deep dive into each system component">
          <ComponentDetails />
        </Section>

        <Separator />

        <Section id="security" icon={Shield} title="Security & Privacy" subtitle="Authentication, data isolation, and performance">
          <SecuritySection />
        </Section>

        <Separator />

        <Section id="api" icon={Table} title="API Endpoints" subtitle="RESTful API reference">
          <ApiEndpointsTable />
        </Section>

        <Separator />

        <Section id="mcp" icon={Server} title="MCP Tools" subtitle="Model Context Protocol tool reference">
          <McpToolsTable />
        </Section>

        <Separator />

        <Section id="stack" icon={Code2} title="Tech Stack" subtitle="Technologies powering KBYG">
          <TechStackGrid />
        </Section>

        <Separator />

        <Section id="examples" icon={Code2} title="Code Examples" subtitle="Key implementation patterns">
          <CodeExamples />
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <p className="text-sm text-muted-foreground">
            Built at <a href="https://www.getmobly.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mobly GTM Hackathon</a> 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
