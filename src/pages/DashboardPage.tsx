import { useState, useEffect } from "react";
import { Building2, Users, Sparkles, Target, TrendingUp, ArrowRight, Loader2, Wifi, WifiOff, RefreshCw, DollarSign, Crosshair } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { listCompanies, testMCPConnection, type Company } from "@/lib/mcp";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [mcpConnected, setMcpConnected] = useState<boolean | null>(null);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    fetchCompanies();
  }, []);

  const checkConnection = async () => {
    setTestingConnection(true);
    try {
      const result = await testMCPConnection();
      setMcpConnected(result.success);
      setMcpError(result.error || null);
    } catch (err) {
      setMcpConnected(false);
      setMcpError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setTestingConnection(false);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCompanies();
      if (result.success && result.data) {
        setCompanies(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error || "Failed to load targets");
      }
    } catch (err) {
      setError("Unable to connect to intelligence server");
    } finally {
      setLoading(false);
    }
  };

  const totalCompanies = companies.length;
  const enrichedCompanies = companies.filter(c => c.enriched_data).length;
  const pendingEnrichments = totalCompanies - enrichedCompanies;
  
  // Calculate potential pipeline value (enriched companies * avg deal size)
  const potentialPipelineValue = enrichedCompanies * 100000;

  const stats = [
    {
      title: "Potential Pipeline Value",
      value: `$${potentialPipelineValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Based on enriched targets",
      color: "text-success",
      highlight: true,
    },
    {
      title: "Targets Acquired",
      value: totalCompanies,
      icon: Crosshair,
      description: "In your database",
      color: "text-primary",
    },
    {
      title: "Intel Extracted",
      value: enrichedCompanies,
      icon: Sparkles,
      description: "With deep enrichment",
      color: "text-accent",
    },
    {
      title: "Pending Extraction",
      value: pendingEnrichments,
      icon: TrendingUp,
      description: "Awaiting enrichment",
      color: "text-warning",
    },
    {
      title: "Total Contacts",
      value: companies.reduce((acc, c) => acc + (c.employees?.length || 0), 0),
      icon: Users,
      description: "Across all targets",
      color: "text-muted-foreground",
    },
  ];

  const recentCompanies = companies.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Command Center</h1>
        <p className="text-muted-foreground">
          KBYG Intelligence Engine — Your conference execution platform
        </p>
      </div>

      {/* MCP Connection Status */}
      <Card className={mcpConnected === false ? "border-destructive" : mcpConnected ? "border-success" : ""}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {testingConnection ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : mcpConnected ? (
                <Wifi className="h-5 w-5 text-success" />
              ) : (
                <WifiOff className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="font-medium">
                  Intelligence Server: {testingConnection ? "Testing..." : mcpConnected ? "Connected" : "Disconnected"}
                </p>
                {mcpError && (
                  <p className="text-sm text-muted-foreground">{mcpError}</p>
                )}
                {mcpConnected && (
                  <p className="text-sm text-muted-foreground">8 extraction tools available</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={checkConnection} disabled={testingConnection}>
              <RefreshCw className={`h-4 w-4 mr-1 ${testingConnection ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchCompanies}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          stats.map((stat) => (
            <Card key={stat.title} className={stat.highlight ? "border-success bg-success/5" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? 'text-success' : ''}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Execute your next move</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/companies")}>
            <Building2 className="h-4 w-4 mr-2" />
            View Target Database
          </Button>
          <Button variant="outline" onClick={() => navigate("/strategy")}>
            <Target className="h-4 w-4 mr-2" />
            Deploy GTM Strategy
          </Button>
          <Button variant="outline" onClick={() => navigate("/email")}>
            <Sparkles className="h-4 w-4 mr-2" />
            Draft Outreach
          </Button>
          <Button variant="outline" onClick={() => navigate("/import")}>
            <Crosshair className="h-4 w-4 mr-2" />
            Extract Intelligence
          </Button>
        </CardContent>
      </Card>

      {/* Recent Targets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Targets</CardTitle>
            <CardDescription>Latest acquisitions in your database</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/companies")}>
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentCompanies.length > 0 ? (
            <div className="space-y-3">
              {recentCompanies.map((company, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate("/companies")}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crosshair className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.employees?.length || 0} contacts
                        {company.enriched_data?.industry && ` • ${company.enriched_data.industry}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {company.enriched_data ? (
                      <span className="text-success flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Intel Extracted
                      </span>
                    ) : (
                      <span>Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No targets yet. Extract intelligence to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
