import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Target, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Person {
  name: string;
  role: string;
  title?: string;
  company?: string;
  persona?: string;
  linkedin?: string;
  linkedinMessage?: string;
  iceBreaker?: string;
}

interface ExpectedPersona {
  persona: string;
  likelihood?: string;
  count?: string;
  conversationStarters?: string[];
  keywords?: string[];
  painPoints?: string[];
}

interface Event {
  id: number;
  url: string;
  eventName: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  estimatedAttendees?: number;
  people: Person[];
  sponsors: { name: string; tier?: string }[];
  expectedPersonas: ExpectedPersona[];
  nextBestActions: { priority: number; action: string; reason: string }[];
  relatedEvents: { name: string; url: string; date?: string }[];
  analyzedAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'default';
      const response = await fetch(`${API_BASE_URL}/events?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load events",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to backend API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (url: string) => {
    if (!confirm('Delete this event?')) return;
    
    try {
      const userId = localStorage.getItem('userId') || 'default';
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${API_BASE_URL}/events/${encodedUrl}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setEvents(events.filter(e => e.url !== url));
        toast({
          title: "Success",
          description: "Event deleted",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete event",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Conference Events</h1>
        <p className="text-muted-foreground">
          Events analyzed from the KBYG Chrome Extension
        </p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No events yet</p>
            <p className="text-muted-foreground text-center max-w-md">
              Events analyzed through the KBYG Chrome Extension will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{event.eventName}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      {event.date && (
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      )}
                      {event.estimatedAttendees && (
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          ~{event.estimatedAttendees.toLocaleString()} attendees
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteEvent(event.url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {event.description}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {/* People */}
                  {event.people.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        People ({event.people.length})
                      </h3>
                      <div className="space-y-2">
                        {event.people.slice(0, 5).map((person, idx) => (
                          <div key={idx} className="text-sm border-l-2 border-primary pl-3 py-1">
                            <div className="font-medium">{person.name}</div>
                            {person.title && (
                              <div className="text-muted-foreground">{person.title}</div>
                            )}
                            {person.company && (
                              <div className="text-muted-foreground">{person.company}</div>
                            )}
                            {person.iceBreaker && (
                              <div className="text-xs text-blue-600 mt-1 italic">
                                💬 {person.iceBreaker}
                              </div>
                            )}
                          </div>
                        ))}
                        {event.people.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{event.people.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expected Personas */}
                  {event.expectedPersonas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Target Personas
                      </h3>
                      <div className="space-y-2">
                        {event.expectedPersonas.slice(0, 3).map((persona, idx) => (
                          <div key={idx} className="text-sm border-l-2 border-green-500 pl-3 py-1">
                            <div className="font-medium flex items-center gap-2">
                              {persona.persona}
                              {persona.likelihood && (
                                <Badge variant="secondary" className="text-xs">
                                  {persona.likelihood}
                                </Badge>
                              )}
                            </div>
                            {persona.count && (
                              <div className="text-muted-foreground">Est. {persona.count}</div>
                            )}
                            {persona.conversationStarters && persona.conversationStarters.length > 0 && (
                              <div className="text-xs text-green-700 mt-1">
                                💡 {persona.conversationStarters[0]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sponsors */}
                {event.sponsors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Sponsors</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.sponsors.map((sponsor, idx) => (
                        <Badge key={idx} variant="outline">
                          {sponsor.name}
                          {sponsor.tier && ` (${sponsor.tier})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Best Actions */}
                {event.nextBestActions.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Next Best Actions</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {event.nextBestActions.slice(0, 3).map((action, idx) => (
                        <li key={idx} className="text-sm">
                          <span className="font-medium">{action.action}</span>
                          {action.reason && (
                            <span className="text-muted-foreground"> - {action.reason}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {event.analyzedAt && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    Analyzed: {new Date(event.analyzedAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
