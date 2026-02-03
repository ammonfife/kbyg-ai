import { Download, Chrome, Sparkles, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrandIcon } from "@/components/BrandIcon";

interface EmptyStateOnboardingProps {
  onDismiss?: () => void;
}

export function EmptyStateOnboarding({ onDismiss }: EmptyStateOnboardingProps) {
  const handleDownload = () => {
    // Direct download of the extension ZIP
    window.open('/kbyg-chrome-extension.zip', '_blank');
  };

  const steps = [
    { 
      number: 1, 
      title: "Download the Extension", 
      description: "Get the KBYG Chrome extension to start capturing intelligence" 
    },
    { 
      number: 2, 
      title: "Visit a Conference Page", 
      description: "Navigate to any event website with speaker or sponsor info" 
    },
    { 
      number: 3, 
      title: "Click Analyze", 
      description: "Extract companies and contacts automatically into your database" 
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <BrandIcon variant="filled" size="xl" className="w-20 h-20" />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to KBYG Intelligence
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your database is empty. Install the Chrome extension to start capturing conference intelligence.
          </p>
        </div>

        {/* Download CTA */}
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-primary">
                <Chrome className="h-12 w-12" />
                <ArrowRight className="h-6 w-6" />
                <Target className="h-12 w-12" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Get the Chrome Extension</h2>
                <p className="text-muted-foreground">
                  Capture companies and contacts from any conference website in seconds
                </p>
              </div>

              <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownload}>
                <Download className="h-5 w-5 mr-2" />
                Download Extension
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Free forever • Works on any conference site
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <Card key={step.number} className="text-left">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Already have extension? */}
        <div className="pt-4">
          <p className="text-muted-foreground">
            Already have the extension?{" "}
            <button 
              onClick={onDismiss}
              className="text-primary hover:underline font-medium"
            >
              Dismiss this message
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
