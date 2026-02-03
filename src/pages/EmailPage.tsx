import { useState, useEffect } from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailDisplay } from "@/components/EmailDisplay";
import { listCompanies, draftEmail, type Company, type DraftedEmail } from "@/lib/mcp";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BrandIcon } from "@/components/BrandIcon";

export default function EmailPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [email, setEmail] = useState<DraftedEmail | null>(null);

  // Form state
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get("company") || "");
  const [fromName, setFromName] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const result = await listCompanies();
      if (result.success && result.data) {
        setCompanies(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleDraft = async () => {
    if (!selectedCompany) {
      toast({ 
        title: "Missing Company", 
        description: "Please select a target company", 
        variant: "destructive" 
      });
      return;
    }
    if (!fromName.trim()) {
      toast({ 
        title: "Missing Name", 
        description: "Please enter your name", 
        variant: "destructive" 
      });
      return;
    }

    setDrafting(true);
    setEmail(null);
    
    try {
      const result = await draftEmail({
        company_name: selectedCompany,
        from_name: fromName,
      });

      if (result.success && result.data) {
        setEmail(result.data);
        toast({ title: "Email Drafted!", description: "Your personalized email is ready" });
      } else {
        toast({ 
          title: "Draft Failed", 
          description: result.error || "Failed to draft email", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to draft email", 
        variant: "destructive" 
      });
    } finally {
      setDrafting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BrandIcon variant="filled" size="lg" />
        <div>
          <h1 className="text-3xl font-bold">Outreach Composer</h1>
          <p className="text-muted-foreground">
            Draft personalized outreach emails for target companies
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Email Parameters</CardTitle>
            <CardDescription>
              Configure your personalized email draft
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Target Company *</Label>
              {loadingCompanies ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company, idx) => (
                      <SelectItem key={`${company.name}-${idx}`} value={company.name}>
                        {company.name}
                        {company.enriched_data?.industry && (
                          <span className="text-muted-foreground ml-2">
                            ({company.enriched_data.industry})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-name">Your Name *</Label>
              <Input
                id="from-name"
                placeholder="e.g., John Smith"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleDraft} 
              disabled={drafting || !selectedCompany || !fromName.trim()}
              className="w-full"
              size="lg"
            >
              {drafting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Drafting Email...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Draft Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Email Best Practices</CardTitle>
            <CardDescription>
              Tips for effective outreach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="font-medium text-primary">Personalization Matters</p>
                <p className="text-muted-foreground mt-1">
                  Emails that reference specific company details get 2x higher response rates
                </p>
              </div>
              <div className="p-3 bg-success/5 rounded-lg">
                <p className="font-medium text-success">Keep It Concise</p>
                <p className="text-muted-foreground mt-1">
                  Aim for under 150 words. Busy executives appreciate brevity
                </p>
              </div>
              <div className="p-3 bg-warning/5 rounded-lg">
                <p className="font-medium text-warning">Clear Call-to-Action</p>
                <p className="text-muted-foreground mt-1">
                  End with a specific ask - a 15-minute call, not a vague "let me know"
                </p>
              </div>
            </div>

            {drafting && (
              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Result */}
      {email && (
        <EmailDisplay email={email} companyName={selectedCompany} />
      )}
    </div>
  );
}
