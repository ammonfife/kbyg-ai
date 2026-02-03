import { useState } from "react";
import { Building2, Users, Sparkles, Target, Mail, Trash2, Loader2, Crosshair } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Company, enrichCompany, deleteCompany } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface CompanyCardProps {
  company: Company;
  onViewDetails: () => void;
  onGenerateStrategy: () => void;
  onDraftEmail: () => void;
  onRefresh: () => void;
}

export function CompanyCard({ 
  company, 
  onViewDetails, 
  onGenerateStrategy, 
  onDraftEmail,
  onRefresh 
}: CompanyCardProps) {
  const [enriching, setEnriching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const isEnriched = !!company.enriched_data;
  const employeeCount = company.employees?.length || 0;

  const handleEnrich = async () => {
    setEnriching(true);
    try {
      const result = await enrichCompany(company.name);
      if (result.success) {
        toast({ title: "Intelligence Extracted!", description: `Deep intel extracted for ${company.name}` });
        onRefresh();
      } else {
        toast({ 
          title: "Extraction Failed", 
          description: result.error || "Failed to extract intelligence", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Extraction Failed", 
        description: "Failed to extract intelligence", 
        variant: "destructive" 
      });
    } finally {
      setEnriching(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteCompany(company.name);
      if (result.success) {
        toast({ title: "Target Removed", description: `${company.name} removed from database` });
        onRefresh();
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Failed to remove target", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to remove target", 
        variant: "destructive" 
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{company.name}</CardTitle>
          </div>
          <Badge variant={isEnriched ? "default" : "secondary"} className={isEnriched ? "bg-success" : ""}>
            {isEnriched ? "Intel Extracted" : "Pending"}
          </Badge>
        </div>
        {company.enriched_data?.industry && (
          <p className="text-sm text-muted-foreground">{company.enriched_data.industry}</p>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{employeeCount} contacts</span>
          </div>
          {company.last_enriched && (
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Extracted {formatDistanceToNow(new Date(company.last_enriched))} ago</span>
            </div>
          )}
        </div>
        {company.enriched_data?.description && (
          <p className="mt-2 text-sm line-clamp-2">{company.enriched_data.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Intel
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEnrich}
          disabled={enriching}
        >
          {enriching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Deep Intel Enrichment
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onGenerateStrategy}>
          <Target className="h-4 w-4" />
          Deploy GTM Strategy
        </Button>
        <Button variant="outline" size="sm" onClick={onDraftEmail}>
          <Mail className="h-4 w-4" />
          Outreach
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={deleting}
          className="text-destructive hover:text-destructive"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
