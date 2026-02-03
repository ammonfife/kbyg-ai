import { useState } from "react";
import { 
  Chrome, 
  Download, 
  Target, 
  Mail, 
  ArrowRight,
  Crosshair
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Import brand assets
import logoHorizontal from "@/brand-assets/logos/primary/logo-horizontal.svg";
import logoCompact from "@/brand-assets/logos/primary/logo-compact.svg";

export default function TestLandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      title: "Deep-Tier Intelligence Extraction",
      description: "Our browser extension surfaces speakers, sponsors, and attendees—not floor maps and coffee breaks."
    },
    {
      icon: Crosshair,
      title: "Pre-Qualified Target Mapping",
      description: "Automatically identify the exact buyer personas attending and what makes them tick."
    },
    {
      icon: Target,
      title: "Weaponized Conversation Openers",
      description: "Get tailored talking points that open doors, not generic icebreakers that close them."
    },
    {
      icon: Mail,
      title: "Revenue-Ready Outreach",
      description: "Generate personalized pre-show and post-show emails that convert attendees into pipeline."
    }
  ];

  const stats = [
    { 
      value: "< 15s", 
      label: "From URL to Intelligence",
      description: "Complete extraction of speakers, sponsors, and personas using Gemini 1.5 Pro."
    },
    { 
      value: "100%", 
      label: "Data Persistence",
      description: "Automated sync to your private Turso database. No lead left behind in a browser tab."
    },
    { 
      value: "0", 
      label: "Manual Research Required",
      description: "AI-generated ice breakers and GTM strategies ready before you arrive at the booth."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Install the Extension",
      description: "Add KBYG to Chrome. Takes 60 seconds, changes how you prep forever."
    },
    {
      number: "02", 
      title: "Extract Intelligence",
      description: "Hit any conference site. We extract speakers, sponsors, and attendee intel automatically."
    },
    {
      number: "03",
      title: "Dominate the Room",
      description: "Walk in knowing exactly who to talk to, what to say, and how to close."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Using brand logo */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={logoHorizontal} alt="KBYG.ai" className="h-10" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleCTA}>
              Command Center
            </Button>
            <Button 
              className="bg-[#3b82f6] hover:bg-[#2563eb] transition-colors"
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

      {/* Hero Section - Using brand gradient colors */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient orbs using brand colors */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#3b82f6]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#8b5cf6]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#06b6d4]/15 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20 hover:bg-[#3b82f6]/20">
              <Crosshair className="h-3 w-3 mr-1" />
              Intelligence Extraction for Revenue Teams
            </Badge>
            
            {/* Hero headline with brand gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                  backgroundSize: '200% auto',
                }}
              >
                Know Before You Go
              </span>
              <br />
              <span className="text-foreground">For GTM Teams</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Extract every high-value prospect, generate pre-qualified openers, and build a permanent sales asset from every event. Stop networking; start executing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* CTA with brand gradient */}
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 text-white hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)'
                }}
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
                className="text-lg px-8 py-6 border-[#3b82f6]/30 hover:border-[#3b82f6] hover:bg-[#3b82f6]/5"
                onClick={handleCTA}
              >
                Enter Command Center
              </Button>
            </div>

            {/* Installation Instructions */}
            <div className="mt-16 max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold text-center mb-6">How to Install</h4>
              <div className="grid gap-4 text-left">
                {[
                  { step: 1, title: "Extract the Folder", desc: 'Click "Get the Extension" above and unzip the folder.' },
                  { step: 2, title: "Go to Extensions", desc: "Open Chrome and type chrome://extensions in the address bar." },
                  { step: 3, title: "Turn on Developer Mode", desc: "Flip the switch in the top-right corner." },
                  { step: 4, title: "Upload", desc: "Click Load unpacked (top-left) and select the folder you just unzipped." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                    <span 
                      className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Impact Section */}
      <section className="py-20 px-6 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20">
              Operational Impact
            </Badge>
            <h2 className="text-3xl font-bold">Real-Time Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-card/50 border border-border">
                <div 
                  className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent mb-3"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                    textShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)',
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20">
              Capabilities
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Your Unfair Competitive Advantage
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop memorizing booth numbers. Start knowing exactly who writes the checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-[#3b82f6]/50 hover:shadow-xl transition-all duration-300"
                style={{
                  '--hover-shadow': '0 25px 50px -12px rgba(59, 130, 246, 0.15)'
                } as React.CSSProperties}
              >
                <div 
                  className="h-14 w-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                  }}
                >
                  <feature.icon className="h-7 w-7 text-[#3b82f6]" />
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
            <Badge className="mb-4 bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">
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
                <div 
                  className="text-8xl font-bold absolute -top-4 -left-2 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    opacity: 0.15
                  }}
                >
                  {step.number}
                </div>
                <div className="relative pt-12 pl-4">
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-8 w-8 text-[#8b5cf6]/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full brand gradient */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)'
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Next Trade Show Shouldn't Be a Gamble
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                GTM teams use KBYG to walk into events knowing exactly where the revenue is.
              </p>
              
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-white text-[#3b82f6] hover:bg-white/90"
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

      {/* Footer - Using brand compact logo */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={logoCompact} alt="KBYG.ai" className="h-8" />
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={handleCTA} className="hover:text-[#3b82f6] transition-colors">
              Command Center
            </button>
            <button onClick={() => navigate("/companies")} className="hover:text-[#3b82f6] transition-colors">
              Target Database
            </button>
            <button onClick={() => navigate("/import")} className="hover:text-[#3b82f6] transition-colors">
              Capture Analysis
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KBYG.ai. All rights reserved.
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          Made with ❤️ at{" "}
          <a href="https://www.utahtechweek.com/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">
            Utah Tech Week
          </a>
          {" & "}
          <a href="https://www.getmobly.com/" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">
            Mobly
          </a>
        </div>
      </footer>
    </div>
  );
}
