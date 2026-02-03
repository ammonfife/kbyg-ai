import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
}

function CodeBlock({ title, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Code2 className="h-4 w-4 text-purple-500" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{language}</Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed bg-zinc-950 text-zinc-100">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export function CodeExamples() {
  const syncEventCode = `// chrome-extension/backend-sync.js
async function syncEventToBackend(eventData) {
  const user = await getSupabaseUser();
  
  // 1. Insert event
  const { data: event } = await supabase
    .from('events')
    .upsert({ 
      user_id: user.id,
      url: eventData.url,
      event_name: eventData.eventName,
      // ...
    })
    .select()
    .single();
    
  // 2. Insert people
  await supabase.from('people').insert(
    eventData.people.map(p => ({
      event_id: event.id,
      user_id: user.id,
      name: p.name,
      title: p.title,
      // ...
    }))
  );
  
  return event.id;
}`;

  const mcpCallCode = `// src/lib/mcp.ts
export async function enrichCompany(name: string) {
  const response = await fetch(\`\${MCP_BASE_URL}/tools/call\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'gtm_enrich_company',
      arguments: { name }
    })
  });
  return response.json();
}`;

  const rlsQueryCode = `-- Automatically filtered by RLS
SELECT * FROM events WHERE user_id = auth.uid();

-- User only sees their own events
-- No additional WHERE clause needed
-- Security enforced at database level`;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="sync">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">JavaScript</Badge>
            Sync Event to Database
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <CodeBlock
            title="backend-sync.js"
            language="JavaScript"
            code={syncEventCode}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mcp">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">TypeScript</Badge>
            Call MCP Tool
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <CodeBlock
            title="mcp.ts"
            language="TypeScript"
            code={mcpCallCode}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rls">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">SQL</Badge>
            Query with RLS
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <CodeBlock
            title="RLS Example"
            language="SQL"
            code={rlsQueryCode}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
