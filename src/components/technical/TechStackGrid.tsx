import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Cloud, Server, Chrome, Cpu } from "lucide-react";

interface TechCategory {
  title: string;
  icon: React.ElementType;
  color: string;
  items: string[];
}

const techCategories: TechCategory[] = [
  {
    title: "Frontend",
    icon: Globe,
    color: "#f59e0b",
    items: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn UI", "React Router", "TanStack Query"]
  },
  {
    title: "Backend",
    icon: Cloud,
    color: "#10b981",
    items: ["Supabase (PostgreSQL)", "Supabase Auth", "Row Level Security", "Real-time"]
  },
  {
    title: "Intelligence",
    icon: Server,
    color: "#8b5cf6",
    items: ["Node.js", "TypeScript", "MCP Protocol", "Turso (libSQL)", "Express"]
  },
  {
    title: "Extension",
    icon: Chrome,
    color: "#3b82f6",
    items: ["Manifest V3", "Vanilla JS", "Gemini API", "Chrome APIs"]
  },
  {
    title: "AI",
    icon: Cpu,
    color: "#06b6d4",
    items: ["Gemini 2.0 Flash (Extension)", "Gemini 1.5 Pro (MCP)", "Context-aware prompts", "Structured outputs"]
  }
];

export function TechStackGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {techCategories.map((category) => (
        <Card key={category.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <category.icon className="h-4 w-4" style={{ color: category.color }} />
              <span style={{ color: category.color }}>{category.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {category.items.map((item) => (
                <Badge 
                  key={item} 
                  variant="secondary" 
                  className="text-xs font-normal"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
