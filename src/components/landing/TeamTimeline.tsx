import parkerImg from "@/assets/team/parker.jpg";
import altonImg from "@/assets/team/alton.jpg";
import benImg from "@/assets/team/ben.jpg";
import teamWorkingImg from "@/assets/team/team-working.jpeg";

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  image?: string;
  imageName?: string;
  isTeamPhoto?: boolean;
  isFuture?: boolean;
  isHighlight?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    time: "Sunday, 8:00 AM",
    title: "The Idea Sparks",
    description: "Team assembles. Coffee brewed. Vision crystalized.",
    image: parkerImg,
    imageName: "Parker",
  },
  {
    time: "Sunday, 2:00 PM",
    title: "Architecture Takes Shape",
    description: "Database models, API design, and core intelligence engine mapped out.",
    image: altonImg,
    imageName: "Alton",
  },
  {
    time: "Sunday, 8:00 PM",
    title: "First Working Prototype",
    description: "Chrome extension capturing live data. The magic begins.",
    image: benImg,
    imageName: "Ben",
  },
  {
    time: "Monday, 3:00 AM",
    title: "Deep Work Mode",
    description: "The team locked in. Features shipping. Problems solving themselves.",
    image: teamWorkingImg,
    isTeamPhoto: true,
  },
  {
    time: "Monday, 12:00 PM",
    title: "Final Polish",
    description: "UI refinements, demo prep, last-minute optimizations.",
    isHighlight: true,
  },
  {
    time: "Monday, 4:00 PM",
    title: "Judgement Day",
    description: "Presenting KBYG to the judges...",
    isFuture: true,
  },
  {
    time: "???",
    title: "The Verdict",
    description: "",
    isFuture: true,
  },
];

export function TeamTimeline() {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Built in 36 Hours
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            The Making of KBYG
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A hackathon journey from idea to execution
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-24 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent -translate-x-1/2" />
          
          {/* Timeline events */}
          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={index}
                  className={`relative flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content side */}
                  <div className={`w-[calc(50%-2rem)] ${isLeft ? 'text-right' : 'text-left'}`}>
                    <div 
                      className={`inline-block p-4 rounded-xl transition-all duration-300 ${
                        event.isFuture 
                          ? 'bg-muted/30 border border-dashed border-muted-foreground/30' 
                          : event.isHighlight
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-card border border-border hover:border-primary/30'
                      } ${event.isFuture && index === timelineEvents.length - 1 ? 'opacity-50' : ''}`}
                    >
                      <p className={`text-xs font-medium mb-1 ${event.isFuture ? 'text-muted-foreground/60' : 'text-primary'}`}>
                        {event.time}
                      </p>
                      <h3 className={`font-semibold mb-1 ${event.isFuture ? 'text-muted-foreground' : ''}`}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className={`text-sm ${event.isFuture ? 'text-muted-foreground/60 italic' : 'text-muted-foreground'}`}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        event.isFuture 
                          ? 'bg-muted border-muted-foreground/30 animate-pulse' 
                          : event.isHighlight
                          ? 'bg-primary border-primary shadow-lg shadow-primary/30'
                          : 'bg-primary border-primary'
                      }`}
                    />
                  </div>

                  {/* Image side */}
                  <div className={`w-[calc(50%-2rem)] ${isLeft ? 'text-left' : 'text-right'}`}>
                    {event.image && (
                      <div className={`inline-block ${isLeft ? '' : ''}`}>
                        {event.isTeamPhoto ? (
                          <div className="relative">
                            <img 
                              src={event.image} 
                              alt="Team working together" 
                              className="w-48 h-32 object-cover rounded-lg shadow-lg border border-border"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                            <p className="absolute bottom-2 left-2 text-white text-xs font-medium">
                              Team KBYG
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className={`${isLeft ? 'order-1' : 'order-2'}`}>
                              <img 
                                src={event.image} 
                                alt={event.imageName} 
                                className="w-14 h-14 object-cover rounded-full border-2 border-primary/30 shadow-md"
                              />
                            </div>
                            <p className={`text-sm font-medium text-muted-foreground ${isLeft ? 'order-2' : 'order-1'}`}>
                              {event.imageName}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {event.isFuture && index === timelineEvents.length - 1 && (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-success/20 border border-primary/30 ${isLeft ? '' : ''}`}>
                        <span className="text-2xl">🏆</span>
                        <span className="text-sm font-medium bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                          TBD
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fuzzy fade-out at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        </div>

        {/* Hopeful message */}
        <div className="text-center mt-8 relative z-10">
          <p className="text-muted-foreground/60 text-sm italic">
            To be continued...
          </p>
        </div>
      </div>
    </section>
  );
}
