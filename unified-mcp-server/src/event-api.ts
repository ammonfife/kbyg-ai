import express from 'express';
import { EventDatabase, EventData, UserProfile } from './event-db.js';

export function createEventRouter(db: EventDatabase): express.Router {
  const router = express.Router();

  // Middleware to extract userId from header or query
  const getUserId = (req: express.Request): string => {
    return (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'default';
  };

  /**
   * POST /api/events
   * Save a new event analysis
   * Body: EventData
   */
  router.post('/events', async (req, res) => {
    try {
      const userId = getUserId(req);
      const eventData: EventData = {
        ...req.body,
        userId,
      };

      const eventId = await db.saveEvent(eventData);

      res.json({
        success: true,
        eventId,
        message: 'Event saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving event:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to save event',
      });
    }
  });

  /**
   * GET /api/events
   * List all events for a user
   * Query params: limit, offset, startDate, endDate
   */
  router.get('/events', async (req, res) => {
    try {
      const userId = getUserId(req);
      const options = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };

      const events = await db.listEvents(userId, options);

      res.json({
        success: true,
        count: events.length,
        events,
      });
    } catch (error: any) {
      console.error('Error listing events:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list events',
      });
    }
  });

  /**
   * GET /api/events/:url
   * Get a specific event by URL (URL-encoded)
   */
  router.get('/events/:url(*)', async (req, res) => {
    try {
      const userId = getUserId(req);
      const url = decodeURIComponent(req.params.url);

      const event = await db.getEvent(userId, url);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found',
        });
      }

      res.json({
        success: true,
        event,
      });
    } catch (error: any) {
      console.error('Error getting event:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get event',
      });
    }
  });

  /**
   * DELETE /api/events/:url
   * Delete an event by URL (URL-encoded)
   */
  router.delete('/events/:url(*)', async (req, res) => {
    try {
      const userId = getUserId(req);
      const url = decodeURIComponent(req.params.url);

      const deleted = await db.deleteEvent(userId, url);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Event not found',
        });
      }

      res.json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete event',
      });
    }
  });

  /**
   * POST /api/profile
   * Save or update user profile
   * Body: UserProfile
   */
  router.post('/profile', async (req, res) => {
    try {
      const userId = getUserId(req);
      const profile: UserProfile = {
        ...req.body,
        userId,
      };

      await db.saveUserProfile(profile);

      res.json({
        success: true,
        message: 'Profile saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to save profile',
      });
    }
  });

  /**
   * GET /api/profile
   * Get user profile
   */
  router.get('/profile', async (req, res) => {
    try {
      const userId = getUserId(req);
      const profile = await db.getUserProfile(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found',
        });
      }

      res.json({
        success: true,
        profile,
      });
    } catch (error: any) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get profile',
      });
    }
  });

  /**
   * GET /api/people/search
   * Search for people across all events
   * Query param: q (query string)
   */
  router.get('/people/search', async (req, res) => {
    try {
      const userId = getUserId(req);
      const query = req.query.q as string;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "q" is required',
        });
      }

      const people = await db.searchPeople(userId, query);

      res.json({
        success: true,
        count: people.length,
        people,
      });
    } catch (error: any) {
      console.error('Error searching people:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to search people',
      });
    }
  });

  /**
   * GET /api/analytics/summary
   * Get analytics summary for user
   */
  router.get('/analytics/summary', async (req, res) => {
    try {
      const userId = getUserId(req);
      const events = await db.listEvents(userId);

      const totalEvents = events.length;
      const totalPeople = events.reduce((sum, e) => sum + (e.people?.length || 0), 0);
      const totalSponsors = events.reduce((sum, e) => sum + (e.sponsors?.length || 0), 0);
      
      // Aggregate personas
      const personaCounts: { [key: string]: number } = {};
      events.forEach((event) => {
        event.expectedPersonas?.forEach((persona) => {
          personaCounts[persona.persona] = (personaCounts[persona.persona] || 0) + 1;
        });
      });

      const topPersonas = Object.entries(personaCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([persona, count]) => ({ persona, eventCount: count }));

      // Upcoming events (next 90 days)
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 90);
      const upcomingEvents = events.filter((event) => {
        if (!event.startDate) return false;
        const eventDate = new Date(event.startDate);
        return eventDate >= now && eventDate <= futureDate;
      });

      res.json({
        success: true,
        summary: {
          totalEvents,
          totalPeople,
          totalSponsors,
          upcomingEventsCount: upcomingEvents.length,
          topPersonas,
          upcomingEvents: upcomingEvents.slice(0, 5).map((e) => ({
            eventName: e.eventName,
            date: e.date,
            startDate: e.startDate,
            location: e.location,
            url: e.url,
          })),
        },
      });
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get analytics',
      });
    }
  });

  /**
   * POST /api/events/bulk
   * Bulk import events
   * Body: { events: EventData[] }
   */
  router.post('/events/bulk', async (req, res) => {
    try {
      const userId = getUserId(req);
      const { events } = req.body;

      if (!Array.isArray(events)) {
        return res.status(400).json({
          success: false,
          error: 'Body must contain an "events" array',
        });
      }

      const results = [];
      for (const eventData of events) {
        try {
          const eventId = await db.saveEvent({
            ...eventData,
            userId,
          });
          results.push({ success: true, eventId, url: eventData.url });
        } catch (error: any) {
          results.push({ success: false, url: eventData.url, error: error.message });
        }
      }

      const successCount = results.filter((r) => r.success).length;

      res.json({
        success: true,
        message: `Imported ${successCount} of ${events.length} events`,
        results,
      });
    } catch (error: any) {
      console.error('Error bulk importing events:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to bulk import events',
      });
    }
  });

  return router;
}
