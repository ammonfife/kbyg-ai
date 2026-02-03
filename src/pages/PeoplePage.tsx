import { useState, useEffect, useMemo } from "react";
import { Search, Users, Loader2, RefreshCw, Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { listCompanies, type Company, type Employee } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";

interface PersonWithCompany extends Employee {
  companyName: string;
  companyIndustry?: string;
}

export default function PeoplePage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCompanies();
      if (result.success && result.data) {
        setCompanies(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error || "Failed to load data");
        toast({ 
          title: "Error", 
          description: result.error || "Failed to load data", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      setError("Unable to connect to server");
      toast({ 
        title: "Connection Error", 
        description: "Unable to connect to server", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Flatten all contacts from all companies
  const allPeople = useMemo(() => {
    return companies.flatMap(company => 
      (company.employees || [])
        .filter(emp => emp.name) // Only include employees with names
        .map(employee => ({
          ...employee,
          companyName: company.name,
          companyIndustry: company.enriched_data?.industry || company.industry
        }))
    );
  }, [companies]);

  // Filter people based on search query
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return allPeople;
    const query = searchQuery.toLowerCase();
    return allPeople.filter(person => 
      person.name?.toLowerCase().includes(query) ||
      person.title?.toLowerCase().includes(query) ||
      person.companyName?.toLowerCase().includes(query) ||
      person.email?.toLowerCase().includes(query)
    );
  }, [allPeople, searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Search is instant via filtering, no action needed
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            People
          </h1>
          <p className="text-muted-foreground">
            All contacts across your target companies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {allPeople.length} total contacts
          </Badge>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <Button 
            variant="ghost" 
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* People List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPeople.length > 0 ? (
        <div className="space-y-3">
          {filteredPeople.map((person, idx) => (
            <Card key={`${person.name}-${person.companyName}-${idx}`} className="hover:shadow-md transition-shadow hover:border-primary/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{person.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {person.title && <span>{person.title}</span>}
                        {person.title && person.companyName && <span>•</span>}
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {person.companyName}
                        </span>
                      </div>
                      {person.companyIndustry && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {person.companyIndustry}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {person.email && (
                      <a 
                        href={`mailto:${person.email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="hidden md:inline">{person.email}</span>
                      </a>
                    )}
                    {person.phone && (
                      <a 
                        href={`tel:${person.phone}`}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden md:inline">{person.phone}</span>
                      </a>
                    )}
                    {(person.linkedin_url || person.linkedin) && (
                      <a 
                        href={person.linkedin_url || person.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No People Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No contacts match your search criteria." 
                : "No contacts in your database yet. Import companies with employees to see them here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
