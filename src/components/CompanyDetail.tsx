import { useState, useEffect } from "react";
import { X, Building2, Users, Sparkles, ExternalLink, Loader2, RefreshCw, Mail, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { type Company, getCompany, enrichCompany } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CompanyDetailProps {
  companyName: string | null;
  open: boolean;
  onClose: () => void;
  onGenerateStrategy: (name: string) => void;
  onDraftEmail: (name: string) => void;
}

export function CompanyDetail({ 
  companyName, 
  open, 
  onClose, 
  onGenerateStrategy,
  onDraftEmail 
}: CompanyDetailProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && companyName) {
      fetchCompany();
    }
  }, [open, companyName]);

  const fetchCompany = async () => {
    if (!companyName) return;
    setLoading(true);
    try {
      const result = await getCompany(companyName);
      if (result.success && result.data) {
        setCompany(result.data);
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Failed to load company", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to load company details", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async () => {
    if (!companyName) return;
    setEnriching(true);
    try {
      const result = await enrichCompany(companyName);
      if (result.success) {
        toast({ title: "Success", description: "Company enriched successfully!" });
        fetchCompany();
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Failed to enrich company", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to enrich company", 
        variant: "destructive" 
      });
    } finally {
      setEnriching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {companyName || "Company Details"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : company ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">Company Information</h3>
                  <Badge variant={company.enriched_data ? "default" : "secondary"}>
                    {company.enriched_data ? "Enriched" : "Pending"}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm">
                  {(company.enriched_data?.industry || company.industry) && (
                    <p><span className="font-medium">Industry:</span> {company.enriched_data?.industry || company.industry}</p>
                  )}
                  {(company.enriched_data?.description || company.description) && (
                    <p><span className="font-medium">Description:</span> {company.enriched_data?.description || company.description}</p>
                  )}
                  {company.enriched_data?.website && (
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Website:</span>
                      <a 
                        href={company.enriched_data.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {company.enriched_data.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  )}
                  {company.enriched_data?.location && (
                    <p><span className="font-medium">Location:</span> {company.enriched_data.location}</p>
                  )}
                  {company.context && (
                    <p className="text-muted-foreground italic">{company.context}</p>
                  )}
                  {company.created_at && (
                    <p><span className="font-medium">Added:</span> {new Date(company.created_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Employees */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  <h3 className="font-semibold">Employees ({company.employees?.length || 0})</h3>
                </div>
                {company.employees && company.employees.length > 0 ? (
                  <div className="grid gap-3">
                    {company.employees.map((employee, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                        onClick={() => {
                          onClose();
                          navigate(`/people?search=${encodeURIComponent(employee.name || '')}`);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.title || 'Contact'} {employee.company ? `@ ${employee.company}` : ''}
                            </p>
                            {employee.email && (
                              <p className="text-sm text-primary">{employee.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {employee.email && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${employee.email}`;
                              }}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {(employee.linkedin_url || employee.linkedin) && (
                            <a 
                              href={employee.linkedin_url || employee.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LinkedIn
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No employees found.</p>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleEnrich} disabled={enriching}>
                  {enriching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enriching...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Re-enrich
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onGenerateStrategy(company.name)}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Strategy
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onDraftEmail(company.name)}
                >
                  Draft Email
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No company data available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
