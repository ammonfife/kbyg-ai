import { useState, useEffect } from "react";
import { 
  Chrome, 
  Download, 
  Zap, 
  Target, 
  Mail, 
  Building2, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import kbygLogo from "@/assets/kbyg-logo.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const features = [
    {
      icon: Chrome,
      title: "One-Click Capture",
      description: "Instantly capture leads from LinkedIn and conference sites with our Chrome extension."
    },
    {
      icon: Sparkles,
      title: "AI Enrichment",
      description: "Automatically enrich company data with AI-powered insights, industry analysis, and growth signals."
    },
    {
      icon: Target,
      title: "GTM Strategy",
      description: "Generate personalized go-to-market strategies tailored to each prospect's profile."
    },
    {
      icon: Mail,
      title: "Smart Outreach",
      description: "Craft compelling, personalized emails that resonate with your target audience."
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Lead Research" },
    { value: "85%", label: "Time Saved on Outreach" },
    { value: "3x", label: "Higher Response Rates" }
  ];

  const steps = [
    {
      number: "01",
      title: "Install the Extension",
      description: "Download and add our Chrome extension in under 60 seconds."
    },
    {
      number: "02", 
      title: "Capture Leads",
      description: "Browse LinkedIn or conference sites and capture leads with one click."
    },
    {
      number: "03",
      title: "Enrich & Engage",
      description: "AI enriches your data and generates personalized outreach strategies."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={kbygLogo} alt="KBYG.ai" className="h-8" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleCTA}>
              Dashboard
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              asChild
            >
              <a href="https://github.com/ammonfife/kbyg/archive/refs/heads/main.zip">
                <Download className="h-4 w-4 mr-2" />
                Get Extension
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Conference Intelligence
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Conference Leads Into{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">
                Closed Deals
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Capture leads from any conference site, enrich them with AI, and generate 
              personalized outreach strategies—all from your browser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                asChild
              >
                <a href="https://github.com/ammonfife/kbyg/archive/refs/heads/main.zip">
                  <Chrome className={`h-5 w-5 mr-2 transition-transform ${isHovered ? 'rotate-12' : ''}`} />
                  Download Chrome Extension
                  <ArrowRight className={`h-5 w-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleCTA}
              >
                View Dashboard
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Free to start
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Dominate Conferences
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From lead capture to personalized outreach, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Three Steps to Conference Domination
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-bold text-primary/10 absolute -top-4 -left-2">
                  {step.number}
                </div>
                <div className="relative pt-12 pl-4">
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-8 w-8 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 md:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Transform Your Conference ROI?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join hundreds of sales teams using GTM Hub to turn conference leads into revenue.
              </p>
              
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <a href="https://github.com/ammonfife/kbyg/archive/refs/heads/main.zip">
                  <Download className="h-5 w-5 mr-2" />
                  Download Free Extension
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={kbygLogo} alt="KBYG.ai" className="h-6" />
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={handleCTA} className="hover:text-foreground transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate("/companies")} className="hover:text-foreground transition-colors">
              Companies
            </button>
            <button onClick={() => navigate("/import")} className="hover:text-foreground transition-colors">
              Import
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GTM Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
