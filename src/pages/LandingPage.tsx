import { useState } from "react";
import { 
  Chrome, 
  Download, 
  Zap, 
  Target, 
  Mail, 
  Building2, 
  Sparkles, 
  ArrowRight,
  Users,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import kbygLogo from "@/assets/kbyg-logo.png";
import productFitImg from "@/assets/product-fit.png";

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
      title: "Deep-Tier Intelligence",
      description: "Our browser extension surfaces speakers, sponsors, and attendees—not floor maps and coffee breaks."
    },
    {
      icon: Sparkles,
      title: "Persona Mapping",
      description: "Automatically identify the exact buyer personas attending and what makes them tick."
    },
    {
      icon: Target,
      title: "Conversation Starters",
      description: "Get tailored talking points that open doors, not generic icebreakers that close them."
    },
    {
      icon: Mail,
      title: "Revenue-Ready Outreach",
      description: "Generate personalized pre-show and post-show emails that convert attendees into pipeline."
    }
  ];

  const stats = [
    { value: "10x", label: "More Qualified Meetings" },
    { value: "85%", label: "Less Time on Logistics" },
    { value: "$100k+", label: "Avg Deal Size Targeted" }
  ];

  const steps = [
    {
      number: "01",
      title: "Install the Extension",
      description: "Add KBYG to Chrome. Takes 60 seconds, changes how you prep forever."
    },
    {
      number: "02", 
      title: "Scan Any Event",
      description: "Hit any conference site. We extract speakers, sponsors, and attendee intel automatically."
    },
    {
      number: "03",
      title: "Win the Room",
      description: "Walk in knowing exactly who to talk to, what to say, and how to close."
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
              Conference Intelligence for Revenue Teams
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Trade Shows Into{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">
                Revenue Ops
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              We don't care where the coffee is. We care where your next $100k contract is sitting.
              Deep-tier intel on speakers, sponsors, and attendees—delivered to your browser.
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
                  Get the Extension
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

            {/* Installation Instructions */}
            <div className="mt-16 max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold text-center mb-6">How to Install</h4>
              <div className="grid gap-4 text-left">
                <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <p className="font-medium">Extract the Folder</p>
                    <p className="text-sm text-muted-foreground">Click "Get the Extension" above and unzip the folder.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <p className="font-medium">Go to Extensions</p>
                    <p className="text-sm text-muted-foreground">Open Chrome and type <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chrome://extensions</code> in the address bar.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <p className="font-medium">Turn on Developer Mode</p>
                    <p className="text-sm text-muted-foreground">Flip the switch in the top-right corner.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</span>
                  <div>
                    <p className="font-medium">Upload</p>
                    <p className="text-sm text-muted-foreground">Click Load unpacked (top-left) and select the folder you just unzipped.</p>
                  </div>
                </div>
              </div>
            </div>
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
              Capabilities
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Replace Generic Logistics With Tactical Intel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop memorizing booth numbers. Start knowing exactly who writes the checks.
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
              From Event Page to Pipeline in Minutes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No more spreadsheets. No more guesswork. Just revenue.
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

      {/* Product Fit Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <img 
              src={productFitImg} 
              alt="KBYG.ai covers the entire event timeline - Planning, Event, and Followup" 
              className="w-full max-w-2xl h-auto"
            />
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
                Your Next Trade Show Shouldn't Be a Gamble
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                GTM teams use KBYG to walk into events knowing exactly where the revenue is.
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
