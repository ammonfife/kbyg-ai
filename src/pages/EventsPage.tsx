import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Building2, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listCompanies, getCompany, type Company } from "@/lib/mcp";
import { useNavigate } from "react-router-dom";

interface EventGroup {
  eventName: string;
  companies: Company[];
  extractedAt?: string;
}

export default function EventsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get list of companies
      const listResult = await listCompanies();
      if (!listResult.success || !listResult.data) {
        toast({
          title: "Error",
          description: listResult.error || "Failed to load data",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const companiesList = Array.isArray(listResult.data) ? listResult.data : [];
      
      // Fetch details for companies with context (event info)
      const companiesWithContext = companiesList.filter(c => c.employees && c.employees.length > 0);
      const detailedCompanies: Company[] = [];
      
      // Fetch in batches
      const batchSize = 5;
      for (let i = 0; i < Math.min(companiesWithContext.length, 30); i += batchSize) {
        const batch = companiesWithContext.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(company => getCompany(company.name))
        );
        
        results.forEach(result => {
          if (result.success && result.data) {
            detailedCompanies.push(result.data);
          }
        });
      }
      
      setCompanies(detailedCompanies);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to intelligence server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group companies by event (extracted from context field)
  const eventGroups = useMemo(() => {
    const groups: Record<string, EventGroup> = {};
    
    companies.forEach(company => {
      if (!company.context) return;
      
      // Extract event name from context like "Extracted from Silicon Slopes Summit on 2026-02-03T22:06:43.111Z"
      const match = company.context.match(/(?:Extracted from|Attended "?)(.+?)(?:" on|on \d{4})/i);
      const eventName = match ? match[1].trim().replace(/"/g, '') : 'Other Events';
      
      if (!groups[eventName]) {
        groups[eventName] = {
          eventName,
          companies: [],
          extractedAt: company.updated_at || company.created_at
        };
      }
      groups[eventName].companies.push(company);
    });
    
    return Object.values(groups).sort((a, b) => b.companies.length - a.companies.length);
  }, [companies]);

  const filteredEvents = eventGroups.filter(event =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.companies.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPeople = useMemo(() => {
    return companies.reduce((acc, c) => acc + (c.employees?.length || 0), 0);
  }, [companies]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Conference Events
          </h1>
          <p className="text-muted-foreground">
            Intelligence extracted from conferences via the KBYG Chrome Extension
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{eventGroups.length} events</Badge>
          <Badge variant="secondary">{companies.length} companies</Badge>
          <Badge variant="secondary">{totalPeople} contacts</Badge>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Input
        type="search"
        placeholder="Search events or companies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading event intelligence...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No events yet</p>
            <p className="text-muted-foreground text-center max-w-md">
              Events analyzed through the KBYG Chrome Extension will appear here. 
              Extract intelligence from conference websites to see them.
            </p>
            <Button className="mt-4" onClick={() => navigate('/import')}>
              Go to Capture Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEvents.map((event, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{event.eventName}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {event.companies.length} companies
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.companies.reduce((acc, c) => acc + (c.employees?.length || 0), 0)} contacts
                      </span>
                      {event.extractedAt && (
                        <span className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          Extracted: {new Date(event.extractedAt).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.companies.slice(0, 6).map((company, cidx) => (
                    <div 
                      key={cidx} 
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate(`/companies?search=${encodeURIComponent(company.name)}`)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">{company.name}</span>
                      </div>
                      {company.industry && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {company.industry}
                        </Badge>
                      )}
                      {company.employees && company.employees.length > 0 && (
                        <div className="space-y-1">
                          {company.employees.slice(0, 2).map((emp, eidx) => (
                            <div 
                              key={eidx} 
                              className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/people?search=${encodeURIComponent(emp.name || '')}`);
                              }}
                            >
                              <span className="font-medium">{emp.name}</span>
                              {emp.title && <span> - {emp.title}</span>}
                            </div>
                          ))}
                          {company.employees.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{company.employees.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {event.companies.length > 6 && (
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    +{event.companies.length - 6} more companies from this event
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
