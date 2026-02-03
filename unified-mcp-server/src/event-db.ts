import { createClient, Client } from '@libsql/client';

// Core data types matching the browser extension

export interface Person {
  name: string;
  role: string;
  title?: string;
  company?: string;
  persona?: string;
  linkedin?: string;
  linkedinMessage?: string;
  iceBreaker?: string;
}

export interface Sponsor {
  name: string;
  tier?: string;
}

export interface ExpectedPersona {
  persona: string;
  likelihood?: string;
  count?: string;
  linkedinMessage?: string;
  iceBreaker?: string;
  conversationStarters?: string[];
  keywords?: string[];
  painPoints?: string[];
}

export interface NextBestAction {
  priority: number;
  action: string;
  reason: string;
}

export interface RelatedEvent {
  name: string;
  url: string;
  date?: string;
  relevance?: string;
}

export interface EventData {
  id?: number;
  userId?: string;
  url: string;
  eventName: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  estimatedAttendees?: number;
  people: Person[];
  sponsors: Sponsor[];
  expectedPersonas: ExpectedPersona[];
  nextBestActions: NextBestAction[];
  relatedEvents: RelatedEvent[];
  analyzedAt?: string;
  lastViewed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id?: number;
  userId: string;
  geminiApiKey?: string;
  companyName?: string;
  yourRole?: string;
  product?: string;
  valueProp?: string;
  targetPersonas?: string;
  targetIndustries?: string;
  competitors?: string;
  dealSize?: string;
  conversionRate?: string;
  oppWinRate?: string;
  eventGoal?: string;
  notes?: string;
  onboardingComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class EventDatabase {
  private client: Client;

  constructor(url: string, authToken: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  async initialize(): Promise<void> {
    // Create user_profiles table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        gemini_api_key TEXT,
        company_name TEXT,
        your_role TEXT,
        product TEXT,
        value_prop TEXT,
        target_personas TEXT,
        target_industries TEXT,
        competitors TEXT,
        deal_size TEXT,
        conversion_rate TEXT,
        opp_win_rate TEXT,
        event_goal TEXT,
        notes TEXT,
        onboarding_complete INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        url TEXT NOT NULL,
        event_name TEXT NOT NULL,
        date TEXT,
        start_date TEXT,
        end_date TEXT,
        location TEXT,
        description TEXT,
        estimated_attendees INTEGER,
        analyzed_at TEXT,
        last_viewed TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, url)
      )
    `);

    // Create people table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        title TEXT,
        company TEXT,
        persona TEXT,
        linkedin TEXT,
        linkedin_message TEXT,
        ice_breaker TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create sponsors table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        tier TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create expected_personas table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS expected_personas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        persona TEXT NOT NULL,
        likelihood TEXT,
        count TEXT,
        linkedin_message TEXT,
        ice_breaker TEXT,
        conversation_starters TEXT,
        keywords TEXT,
        pain_points TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create next_best_actions table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS next_best_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        priority INTEGER,
        action TEXT NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create related_events table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS related_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        date TEXT,
        relevance TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id)
    `);
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_url ON events(url)
    `);
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date)
    `);
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_people_event_id ON people(event_id)
    `);
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_people_persona ON people(persona)
    `);
  }

  // User Profile Methods
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.client.execute({
      sql: `
        INSERT INTO user_profiles (
          user_id, gemini_api_key, company_name, your_role, product, value_prop,
          target_personas, target_industries, competitors, deal_size, 
          conversion_rate, opp_win_rate, event_goal, notes, onboarding_complete
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          gemini_api_key = excluded.gemini_api_key,
          company_name = excluded.company_name,
          your_role = excluded.your_role,
          product = excluded.product,
          value_prop = excluded.value_prop,
          target_personas = excluded.target_personas,
          target_industries = excluded.target_industries,
          competitors = excluded.competitors,
          deal_size = excluded.deal_size,
          conversion_rate = excluded.conversion_rate,
          opp_win_rate = excluded.opp_win_rate,
          event_goal = excluded.event_goal,
          notes = excluded.notes,
          onboarding_complete = excluded.onboarding_complete,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        profile.userId,
        profile.geminiApiKey || null,
        profile.companyName || null,
        profile.yourRole || null,
        profile.product || null,
        profile.valueProp || null,
        profile.targetPersonas || null,
        profile.targetIndustries || null,
        profile.competitors || null,
        profile.dealSize || null,
        profile.conversionRate || null,
        profile.oppWinRate || null,
        profile.eventGoal || null,
        profile.notes || null,
        profile.onboardingComplete ? 1 : 0,
      ],
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM user_profiles WHERE user_id = ?',
      args: [userId],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as number,
      userId: row.user_id as string,
      geminiApiKey: row.gemini_api_key as string | undefined,
      companyName: row.company_name as string | undefined,
      yourRole: row.your_role as string | undefined,
      product: row.product as string | undefined,
      valueProp: row.value_prop as string | undefined,
      targetPersonas: row.target_personas as string | undefined,
      targetIndustries: row.target_industries as string | undefined,
      competitors: row.competitors as string | undefined,
      dealSize: row.deal_size as string | undefined,
      conversionRate: row.conversion_rate as string | undefined,
      oppWinRate: row.opp_win_rate as string | undefined,
      eventGoal: row.event_goal as string | undefined,
      notes: row.notes as string | undefined,
      onboardingComplete: (row.onboarding_complete as number) === 1,
      createdAt: row.created_at as string | undefined,
      updatedAt: row.updated_at as string | undefined,
    };
  }

  // Event Methods
  async saveEvent(event: EventData): Promise<number> {
    // Insert or update event
    const eventResult = await this.client.execute({
      sql: `
        INSERT INTO events (
          user_id, url, event_name, date, start_date, end_date, location,
          description, estimated_attendees, analyzed_at, last_viewed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, url) DO UPDATE SET
          event_name = excluded.event_name,
          date = excluded.date,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          location = excluded.location,
          description = excluded.description,
          estimated_attendees = excluded.estimated_attendees,
          analyzed_at = excluded.analyzed_at,
          last_viewed = excluded.last_viewed,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      args: [
        event.userId || 'default',
        event.url,
        event.eventName,
        event.date || null,
        event.startDate || null,
        event.endDate || null,
        event.location || null,
        event.description || null,
        event.estimatedAttendees || null,
        event.analyzedAt || new Date().toISOString(),
        event.lastViewed || new Date().toISOString(),
      ],
    });

    const eventId = eventResult.rows[0]?.id as number;

    // Delete existing related data
    await this.client.execute({
      sql: 'DELETE FROM people WHERE event_id = ?',
      args: [eventId],
    });
    await this.client.execute({
      sql: 'DELETE FROM sponsors WHERE event_id = ?',
      args: [eventId],
    });
    await this.client.execute({
      sql: 'DELETE FROM expected_personas WHERE event_id = ?',
      args: [eventId],
    });
    await this.client.execute({
      sql: 'DELETE FROM next_best_actions WHERE event_id = ?',
      args: [eventId],
    });
    await this.client.execute({
      sql: 'DELETE FROM related_events WHERE event_id = ?',
      args: [eventId],
    });

    // Insert people
    for (const person of event.people || []) {
      await this.client.execute({
        sql: `
          INSERT INTO people (
            event_id, name, role, title, company, persona, linkedin, 
            linkedin_message, ice_breaker
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          eventId,
          person.name,
          person.role || null,
          person.title || null,
          person.company || null,
          person.persona || null,
          person.linkedin || null,
          person.linkedinMessage || null,
          person.iceBreaker || null,
        ],
      });
    }

    // Insert sponsors
    for (const sponsor of event.sponsors || []) {
      await this.client.execute({
        sql: 'INSERT INTO sponsors (event_id, name, tier) VALUES (?, ?, ?)',
        args: [eventId, sponsor.name, sponsor.tier || null],
      });
    }

    // Insert expected personas
    for (const persona of event.expectedPersonas || []) {
      await this.client.execute({
        sql: `
          INSERT INTO expected_personas (
            event_id, persona, likelihood, count, linkedin_message, 
            ice_breaker, conversation_starters, keywords, pain_points
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          eventId,
          persona.persona,
          persona.likelihood || null,
          persona.count || null,
          persona.linkedinMessage || null,
          persona.iceBreaker || null,
          JSON.stringify(persona.conversationStarters || []),
          JSON.stringify(persona.keywords || []),
          JSON.stringify(persona.painPoints || []),
        ],
      });
    }

    // Insert next best actions
    for (const action of event.nextBestActions || []) {
      await this.client.execute({
        sql: `
          INSERT INTO next_best_actions (event_id, priority, action, reason)
          VALUES (?, ?, ?, ?)
        `,
        args: [eventId, action.priority, action.action, action.reason || null],
      });
    }

    // Insert related events
    for (const relatedEvent of event.relatedEvents || []) {
      await this.client.execute({
        sql: `
          INSERT INTO related_events (event_id, name, url, date, relevance)
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [
          eventId,
          relatedEvent.name,
          relatedEvent.url,
          relatedEvent.date || null,
          relatedEvent.relevance || null,
        ],
      });
    }

    return eventId;
  }

  async getEvent(userId: string, url: string): Promise<EventData | null> {
    const eventResult = await this.client.execute({
      sql: 'SELECT * FROM events WHERE user_id = ? AND url = ?',
      args: [userId, url],
    });

    if (eventResult.rows.length === 0) {
      return null;
    }

    const eventRow = eventResult.rows[0];
    const eventId = eventRow.id as number;

    // Get people
    const peopleResult = await this.client.execute({
      sql: 'SELECT * FROM people WHERE event_id = ?',
      args: [eventId],
    });
    const people: Person[] = peopleResult.rows.map((row) => ({
      name: row.name as string,
      role: row.role as string,
      title: row.title as string | undefined,
      company: row.company as string | undefined,
      persona: row.persona as string | undefined,
      linkedin: row.linkedin as string | undefined,
      linkedinMessage: row.linkedin_message as string | undefined,
      iceBreaker: row.ice_breaker as string | undefined,
    }));

    // Get sponsors
    const sponsorsResult = await this.client.execute({
      sql: 'SELECT * FROM sponsors WHERE event_id = ?',
      args: [eventId],
    });
    const sponsors: Sponsor[] = sponsorsResult.rows.map((row) => ({
      name: row.name as string,
      tier: row.tier as string | undefined,
    }));

    // Get expected personas
    const personasResult = await this.client.execute({
      sql: 'SELECT * FROM expected_personas WHERE event_id = ?',
      args: [eventId],
    });
    const expectedPersonas: ExpectedPersona[] = personasResult.rows.map((row) => ({
      persona: row.persona as string,
      likelihood: row.likelihood as string | undefined,
      count: row.count as string | undefined,
      linkedinMessage: row.linkedin_message as string | undefined,
      iceBreaker: row.ice_breaker as string | undefined,
      conversationStarters: JSON.parse((row.conversation_starters as string) || '[]'),
      keywords: JSON.parse((row.keywords as string) || '[]'),
      painPoints: JSON.parse((row.pain_points as string) || '[]'),
    }));

    // Get next best actions
    const actionsResult = await this.client.execute({
      sql: 'SELECT * FROM next_best_actions WHERE event_id = ? ORDER BY priority',
      args: [eventId],
    });
    const nextBestActions: NextBestAction[] = actionsResult.rows.map((row) => ({
      priority: row.priority as number,
      action: row.action as string,
      reason: row.reason as string,
    }));

    // Get related events
    const relatedResult = await this.client.execute({
      sql: 'SELECT * FROM related_events WHERE event_id = ?',
      args: [eventId],
    });
    const relatedEvents: RelatedEvent[] = relatedResult.rows.map((row) => ({
      name: row.name as string,
      url: row.url as string,
      date: row.date as string | undefined,
      relevance: row.relevance as string | undefined,
    }));

    return {
      id: eventId,
      userId: eventRow.user_id as string,
      url: eventRow.url as string,
      eventName: eventRow.event_name as string,
      date: eventRow.date as string | undefined,
      startDate: eventRow.start_date as string | undefined,
      endDate: eventRow.end_date as string | undefined,
      location: eventRow.location as string | undefined,
      description: eventRow.description as string | undefined,
      estimatedAttendees: eventRow.estimated_attendees as number | undefined,
      people,
      sponsors,
      expectedPersonas,
      nextBestActions,
      relatedEvents,
      analyzedAt: eventRow.analyzed_at as string | undefined,
      lastViewed: eventRow.last_viewed as string | undefined,
      createdAt: eventRow.created_at as string | undefined,
      updatedAt: eventRow.updated_at as string | undefined,
    };
  }

  async listEvents(userId: string, options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<EventData[]> {
    let sql = 'SELECT * FROM events WHERE user_id = ?';
    const args: any[] = [userId];

    if (options?.startDate) {
      sql += ' AND (start_date >= ? OR date >= ?)';
      args.push(options.startDate, options.startDate);
    }

    if (options?.endDate) {
      sql += ' AND (end_date <= ? OR date <= ?)';
      args.push(options.endDate, options.endDate);
    }

    sql += ' ORDER BY start_date DESC, created_at DESC';

    if (options?.limit) {
      sql += ' LIMIT ?';
      args.push(options.limit);
    }

    if (options?.offset) {
      sql += ' OFFSET ?';
      args.push(options.offset);
    }

    const result = await this.client.execute({ sql, args });

    const events: EventData[] = [];
    for (const row of result.rows) {
      const event = await this.getEvent(userId, row.url as string);
      if (event) {
        events.push(event);
      }
    }

    return events;
  }

  async deleteEvent(userId: string, url: string): Promise<boolean> {
    const result = await this.client.execute({
      sql: 'DELETE FROM events WHERE user_id = ? AND url = ?',
      args: [userId, url],
    });

    return (result.rowsAffected || 0) > 0;
  }

  async searchPeople(userId: string, query: string): Promise<any[]> {
    const result = await this.client.execute({
      sql: `
        SELECT p.*, e.event_name, e.url, e.date
        FROM people p
        JOIN events e ON p.event_id = e.id
        WHERE e.user_id = ? AND (
          p.name LIKE ? COLLATE NOCASE OR
          p.company LIKE ? COLLATE NOCASE OR
          p.title LIKE ? COLLATE NOCASE OR
          p.persona LIKE ? COLLATE NOCASE
        )
        ORDER BY p.name
      `,
      args: [userId, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
    });

    return result.rows.map((row) => ({
      name: row.name,
      role: row.role,
      title: row.title,
      company: row.company,
      persona: row.persona,
      linkedin: row.linkedin,
      eventName: row.event_name,
      eventUrl: row.url,
      eventDate: row.date,
    }));
  }

  async close(): Promise<void> {
    this.client.close();
  }
}
