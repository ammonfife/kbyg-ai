import { useState, useEffect } from "react";
import { Target, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StrategyDisplay } from "@/components/StrategyDisplay";
import { listCompanies, getCompany, generateStrategy, type Company, type Strategy } from "@/lib/mcp";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function StrategyPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyData, setSelectedCompanyData] = useState<Company | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCompanyDetails, setLoadingCompanyDetails] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  // Form state
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get("company") || "");
  const [yourCompany, setYourCompany] = useState("");
  const [yourProduct, setYourProduct] = useState("");
  const [targetPersonas, setTargetPersonas] = useState("");
  const [targetIndustries, setTargetIndustries] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyDetails(selectedCompany);
    }
  }, [selectedCompany]);

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

  const fetchCompanyDetails = async (companyName: string) => {
    setLoadingCompanyDetails(true);
    try {
      const result = await getCompany(companyName);
      if (result.success && result.data) {
        setSelectedCompanyData(result.data);
        
        // Auto-populate personas from employees
        if (result.data.employees && result.data.employees.length > 0) {
          const personas = result.data.employees
            .map(emp => emp.title)
            .filter(Boolean)
            .join(", ");
          setTargetPersonas(personas);
        }
        
        // Auto-populate industry
        const industry = result.data.enriched_data?.industry || result.data.industry;
        if (industry) {
          setTargetIndustries(industry);
        }
      }
    } catch (err) {
      console.error("Failed to load company details:", err);
    } finally {
      setLoadingCompanyDetails(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCompany) {
      toast({ 
        title: "Missing Company", 
        description: "Please select a target company", 
        variant: "destructive" 
      });
      return;
    }
    if (!yourCompany.trim()) {
      toast({ 
        title: "Missing Your Company", 
        description: "Please enter your company name", 
        variant: "destructive" 
      });
      return;
    }
    if (!yourProduct.trim()) {
      toast({ 
        title: "Missing Product", 
        description: "Please describe your product or service", 
        variant: "destructive" 
      });
      return;
    }

    setGenerating(true);
    setStrategy(null);
    
    try {
      const result = await generateStrategy({
        company_name: selectedCompany,
        your_company: yourCompany,
        your_product: yourProduct,
        target_personas: targetPersonas || undefined,
        target_industries: targetIndustries || undefined,
      });

      if (result.success && result.data) {
        setStrategy(result.data);
        toast({ title: "Strategy Generated!", description: "Your GTM strategy is ready" });
      } else {
        toast({ 
          title: "Generation Failed", 
          description: result.error || "Failed to generate strategy", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to generate strategy", 
        variant: "destructive" 
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Strategy Generator
        </h1>
        <p className="text-muted-foreground">
          Generate personalized GTM strategies for target companies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Parameters</CardTitle>
            <CardDescription>
              Fill in the details to generate a tailored GTM strategy
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
              <Label htmlFor="your-company">Your Company Name *</Label>
              <Input
                id="your-company"
                placeholder="e.g., Acme Corp"
                value={yourCompany}
                onChange={(e) => setYourCompany(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="your-product">Your Product/Service *</Label>
              <Textarea
                id="your-product"
                placeholder="Describe what your company offers, key features, and unique value proposition..."
                value={yourProduct}
                onChange={(e) => setYourProduct(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personas">
                Target Personas (optional)
                {loadingCompanyDetails && (
                  <span className="text-xs text-muted-foreground ml-2">Loading...</span>
                )}
              </Label>
              {selectedCompanyData?.employees && selectedCompanyData.employees.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedCompanyData.employees.map((emp, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {emp.name} {emp.title ? `• ${emp.title}` : ''}
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                id="personas"
                placeholder="e.g., CTO, VP of Engineering, Product Manager"
                value={targetPersonas}
                onChange={(e) => setTargetPersonas(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industries">Target Industries (optional)</Label>
              <Input
                id="industries"
                placeholder="e.g., Healthcare, FinTech, SaaS"
                value={targetIndustries}
                onChange={(e) => setTargetIndustries(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={generating || !selectedCompany || !yourCompany.trim() || !yourProduct.trim()}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Strategy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview / Tips */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              AI-powered strategy generation in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium">Select Target Company</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a company from your enriched database
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium">Describe Your Offering</p>
                  <p className="text-sm text-muted-foreground">
                    Explain your product and value proposition
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium">Get Personalized Strategy</p>
                  <p className="text-sm text-muted-foreground">
                    Receive talking points, positioning, and messaging
                  </p>
                </div>
              </div>
            </div>

            {generating && (
              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strategy Result */}
      {strategy && (
        <StrategyDisplay 
          strategy={strategy} 
          companyName={selectedCompany}
          onUpdate={(updatedStrategy) => setStrategy(updatedStrategy)}
        />
      )}
    </div>
  );
}
