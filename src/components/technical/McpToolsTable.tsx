import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

interface McpTool {
  name: string;
  input: string;
  output: string;
  aiUsed: boolean;
}

const mcpTools: McpTool[] = [
  { name: "gtm_add_company", input: "Company data", output: "Company ID", aiUsed: false },
  { name: "gtm_get_company", input: "Company name", output: "Full company data", aiUsed: false },
  { name: "gtm_list_companies", input: "None", output: "Array of companies", aiUsed: false },
  { name: "gtm_search_companies", input: "Query string", output: "Matching companies", aiUsed: false },
  { name: "gtm_enrich_company", input: "Company name", output: "Enriched data", aiUsed: true },
  { name: "gtm_generate_strategy", input: "Company + your info", output: "GTM strategy", aiUsed: true },
  { name: "gtm_draft_email", input: "Company + name", output: "Personalized email", aiUsed: true },
  { name: "gtm_delete_company", input: "Company name", output: "Success", aiUsed: false },
];

export function McpToolsTable() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Tool Name</TableHead>
            <TableHead className="font-semibold">Input</TableHead>
            <TableHead className="font-semibold">Output</TableHead>
            <TableHead className="font-semibold text-center">AI Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mcpTools.map((tool) => (
            <TableRow key={tool.name}>
              <TableCell>
                <code className="text-xs bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded">
                  {tool.name}
                </code>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{tool.input}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{tool.output}</TableCell>
              <TableCell className="text-center">
                {tool.aiUsed && (
                  <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 gap-1">
                    <Cpu className="h-3 w-3" />
                    Gemini
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
