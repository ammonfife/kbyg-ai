import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Endpoint {
  endpoint: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  purpose: string;
  authRequired: boolean;
}

const endpoints: Endpoint[] = [
  { endpoint: "/events", method: "POST", purpose: "Save event analysis", authRequired: true },
  { endpoint: "/events", method: "GET", purpose: "List all events", authRequired: true },
  { endpoint: "/events/:url", method: "GET", purpose: "Get specific event", authRequired: true },
  { endpoint: "/events/:url", method: "DELETE", purpose: "Delete event", authRequired: true },
  { endpoint: "/profile", method: "POST", purpose: "Save user profile", authRequired: true },
  { endpoint: "/profile", method: "GET", purpose: "Get user profile", authRequired: true },
  { endpoint: "/people/search", method: "GET", purpose: "Search people", authRequired: true },
  { endpoint: "/analytics/summary", method: "GET", purpose: "Get analytics", authRequired: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  POST: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
  PUT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  PATCH: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function ApiEndpointsTable() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Endpoint</TableHead>
            <TableHead className="font-semibold">Method</TableHead>
            <TableHead className="font-semibold">Purpose</TableHead>
            <TableHead className="font-semibold text-center">Auth Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((ep, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{ep.endpoint}</code>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={methodColors[ep.method]}>
                  {ep.method}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{ep.purpose}</TableCell>
              <TableCell className="text-center">
                {ep.authRequired && <Check className="h-4 w-4 text-emerald-500 mx-auto" />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
