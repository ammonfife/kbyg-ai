import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

// Import product screenshots
import screenshot1 from "@/assets/product/screenshot-1.png";
import screenshot2 from "@/assets/product/screenshot-2.png";
import screenshot3 from "@/assets/product/screenshot-3.png";
import screenshot4 from "@/assets/product/screenshot-4.png";

const screenshots = [
  {
    src: screenshot1,
    alt: "KBYG Chrome Extension analyzing an event page with extracted speakers and personas",
    caption: "Extract Intelligence from Any Event Page",
    description: "Our extension automatically pulls event details, speakers, and generates actionable insights."
  },
  {
    src: screenshot2,
    alt: "Calendar view showing all analyzed events across months",
    caption: "Track Your Event Calendar",
    description: "See all your analyzed events at a glance with our visual calendar heatmap."
  },
  {
    src: screenshot3,
    alt: "People database showing discovered contacts across events",
    caption: "Build Your Target Database",
    description: "Every person discovered across your events, organized and ready for outreach."
  },
  {
    src: screenshot4,
    alt: "AI-generated conversation starters and LinkedIn messages for executives",
    caption: "Get Ready-to-Use Openers",
    description: "Personalized ice breakers and LinkedIn messages tailored to each persona."
  }
];

export default function ProductShowcase() {
  return (
    <section className="py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20">
            <Eye className="h-3 w-3 mr-1" />
            See It In Action
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            From Event Page to Pipeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how KBYG transforms any conference page into actionable intelligence
          </p>
        </div>

        {/* Staggered screenshot grid */}
        <div className="space-y-8 md:space-y-12">
          {screenshots.map((screenshot, idx) => (
            <div 
              key={idx}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center`}
            >
              {/* Screenshot */}
              <div className="flex-1 w-full">
                <div 
                  className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Step number badge */}
                  <div 
                    className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
                  >
                    {idx + 1}
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/0 via-transparent to-[#8b5cf6]/0 group-hover:from-[#3b82f6]/5 group-hover:to-[#8b5cf6]/5 transition-all duration-300" />
                  
                  <img 
                    src={screenshot.src} 
                    alt={screenshot.alt}
                    className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Caption */}
              <div className={`flex-1 w-full md:max-w-sm ${idx % 2 === 0 ? 'md:pl-4' : 'md:pr-4'}`}>
                <h3 className="text-2xl font-semibold mb-3">{screenshot.caption}</h3>
                <p className="text-muted-foreground text-lg">{screenshot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
