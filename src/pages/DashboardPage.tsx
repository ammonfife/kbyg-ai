import { useState, useEffect, useMemo } from "react";
import { Building2, Users, Sparkles, Target, TrendingUp, ArrowRight, Loader2, Wifi, WifiOff, RefreshCw, DollarSign, Crosshair, User, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { listCompanies, testMCPConnection, type Company } from "@/lib/mcp";

type ExpandedStat = "targets" | "contacts" | "enriched" | "pending" | null;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [mcpConnected, setMcpConnected] = useState<boolean | null>(null);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStat, setExpandedStat] = useState<ExpandedStat>(null);

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
      id: null as ExpandedStat,
      title: "Potential Pipeline Value",
      value: `$${potentialPipelineValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Based on enriched targets",
      color: "text-success",
      highlight: true,
      clickable: false,
    },
    {
      id: "targets" as ExpandedStat,
      title: "Targets Acquired",
      value: totalCompanies,
      icon: Crosshair,
      description: "In your database",
      color: "text-primary",
      clickable: true,
    },
    {
      id: "enriched" as ExpandedStat,
      title: "Intel Extracted",
      value: enrichedCompanies,
      icon: Sparkles,
      description: "With deep enrichment",
      color: "text-accent",
      clickable: true,
    },
    {
      id: "pending" as ExpandedStat,
      title: "Pending Extraction",
      value: pendingEnrichments,
      icon: TrendingUp,
      description: "Awaiting enrichment",
      color: "text-warning",
      clickable: true,
    },
    {
      id: "contacts" as ExpandedStat,
      title: "Total Contacts",
      value: companies.reduce((acc, c) => acc + (c.employees?.length || 0), 0),
      icon: Users,
      description: "Across all targets",
      color: "text-muted-foreground",
      clickable: true,
    },
  ];

  const toggleStat = (id: ExpandedStat) => {
    setExpandedStat(prev => prev === id ? null : id);
  };

  // Get data for expanded stat
  const getExpandedContent = () => {
    if (!expandedStat) return null;
    
    switch (expandedStat) {
      case "targets":
        return companies.map(c => ({ name: c.name, sub: c.enriched_data?.industry || c.industry || "No industry" }));
      case "enriched":
        return companies.filter(c => c.enriched_data).map(c => ({ name: c.name, sub: c.enriched_data?.industry || c.industry || "No industry" }));
      case "pending":
        return companies.filter(c => !c.enriched_data).map(c => ({ name: c.name, sub: c.industry || "Awaiting enrichment" }));
      case "contacts":
        return allContacts.map(c => ({ name: c.name, sub: `${c.title || "No title"} @ ${c.companyName}` }));
      default:
        return null;
    }
  };

  const recentCompanies = companies.slice(0, 5);

  // Flatten all contacts from all companies
  const allContacts = useMemo(() => {
    return companies.flatMap(company => 
      (company.employees || []).map(employee => ({
        ...employee,
        companyName: company.name,
        companyIndustry: company.enriched_data?.industry
      }))
    );
  }, [companies]);

  const recentContacts = allContacts.slice(0, 5);

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
            <Card 
              key={stat.title} 
              className={`${stat.highlight ? "border-success bg-success/5" : ""} ${stat.clickable ? "cursor-pointer hover:border-primary/50 transition-colors" : ""} ${expandedStat === stat.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => stat.clickable && stat.id && toggleStat(stat.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.clickable && (
                    expandedStat === stat.id ? 
                      <ChevronUp className="h-3 w-3 text-muted-foreground" /> : 
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? 'text-success' : ''}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Expanded Stat Details */}
      {expandedStat && getExpandedContent() && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>
                {expandedStat === "targets" && "All Targets"}
                {expandedStat === "enriched" && "Enriched Targets"}
                {expandedStat === "pending" && "Pending Targets"}
                {expandedStat === "contacts" && "All Contacts"}
              </CardTitle>
              <CardDescription>
                {getExpandedContent()?.length || 0} items
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpandedStat(null)}>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {getExpandedContent()?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {getExpandedContent()?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {expandedStat === "contacts" ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Crosshair className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                        {(company.enriched_data?.industry || company.industry) && ` • ${company.enriched_data?.industry || company.industry}`}
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

      {/* Recent Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Individuals across your targets</CardDescription>
          </div>
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
          ) : recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.title || "No title"}
                        {contact.companyName && ` @ ${contact.companyName}`}
                      </p>
                    </div>
                  </div>
                  {contact.linkedin_url || contact.linkedin ? (
                    <a 
                      href={contact.linkedin_url || contact.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No contacts yet. Add employees to your targets!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
