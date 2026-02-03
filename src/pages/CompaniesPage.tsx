import { useState, useEffect } from "react";
import { Search, Building2, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyCard } from "@/components/CompanyCard";
import { CompanyDetail } from "@/components/CompanyDetail";
import { listCompanies, searchCompanies, type Company } from "@/lib/mcp";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BrandIcon } from "@/components/BrandIcon";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCompanies();
      if (result.success && result.data) {
        setCompanies(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error || "Failed to load companies");
        toast({ 
          title: "Error", 
          description: result.error || "Failed to load companies", 
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCompanies();
      return;
    }
    
    setSearching(true);
    try {
      const result = await searchCompanies(searchQuery);
      if (result.success && result.data) {
        setCompanies(Array.isArray(result.data) ? result.data : []);
      } else {
        toast({ 
          title: "Search Failed", 
          description: result.error || "Search failed", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Search failed", 
        variant: "destructive" 
      });
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandIcon variant="filled" size="lg" />
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Target Database
            </h1>
            <p className="text-muted-foreground">
              Manage and enrich your company database
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchCompanies} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies by name, industry, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
        {searchQuery && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery("");
              fetchCompanies();
            }}
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
              <Button variant="outline" size="sm" onClick={fetchCompanies}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companies Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, idx) => (
            <CompanyCard
              key={`${company.name}-${idx}`}
              company={company}
              onViewDetails={() => setSelectedCompany(company.name)}
              onGenerateStrategy={() => navigate(`/strategy?company=${encodeURIComponent(company.name)}`)}
              onDraftEmail={() => navigate(`/email?company=${encodeURIComponent(company.name)}`)}
              onRefresh={fetchCompanies}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No companies match your search criteria." 
                : "Your database is empty. Import companies to get started!"}
            </p>
            <Button onClick={() => navigate("/import")}>
              Import Companies
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Company Detail Modal */}
      <CompanyDetail
        companyName={selectedCompany}
        open={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onGenerateStrategy={(name) => {
          setSelectedCompany(null);
          navigate(`/strategy?company=${encodeURIComponent(name)}`);
        }}
        onDraftEmail={(name) => {
          setSelectedCompany(null);
          navigate(`/email?company=${encodeURIComponent(name)}`);
        }}
      />
    </div>
  );
}
