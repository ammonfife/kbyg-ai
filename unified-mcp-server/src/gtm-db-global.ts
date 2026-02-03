import { createClient, Client } from '@libsql/client';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GlobalCompany {
  id: number;
  name: string;
  domain?: string;
  industry?: string;
  description?: string;
  website?: string;
  linkedin_url?: string;
  employee_count?: number;
  founded_year?: number;
  location?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface GlobalPerson {
  id: number;
  name: string;
  email?: string;
  title?: string;
  company_id?: number;
  linkedin_url?: string;
  phone?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface UserCompanyAssociation {
  id: number;
  user_id: string;
  company_id: number;
  tags?: string[];
  notes?: string;
  relationship?: string;
  priority?: number;
  last_contact_date?: string;
  next_follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPersonAssociation {
  id: number;
  user_id: string;
  person_id: number;
  relationship?: string;
  tags?: string[];
  notes?: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Strategy {
  id?: number;
  user_id: string;
  company_id: number;
  your_company: string;
  your_product: string;
  target_personas?: string;
  target_industries?: string;
  value_alignment: string;
  key_topics: string[];
  tone_and_voice: string;
  product_positioning: string;
  talking_points: string[];
  opening_line: string;
  what_to_avoid: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DraftedEmail {
  id?: number;
  user_id: string;
  company_id?: number;
  person_id?: number;
  strategy_id?: number;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'scheduled';
  sent_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Database Class
// ============================================================================

export class GTMDatabaseGlobal {
  private client: Client;

  constructor(url: string, authToken: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  // ==========================================================================
  // Schema Initialization
  // ==========================================================================

  async initialize(): Promise<void> {
    // Users table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Global companies table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS global_companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        domain TEXT UNIQUE,
        industry TEXT,
        description TEXT,
        website TEXT,
        linkedin_url TEXT,
        employee_count INTEGER,
        founded_year INTEGER,
        location TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        UNIQUE(name, domain)
      )
    `);

    // Global people table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS global_people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        title TEXT,
        company_id INTEGER,
        linkedin_url TEXT UNIQUE,
        phone TEXT,
        location TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE SET NULL
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_people_company ON global_people(company_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_people_email ON global_people(email)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_people_linkedin ON global_people(linkedin_url)
    `);

    // User-company associations
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS user_companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        company_id INTEGER NOT NULL,
        tags TEXT,
        notes TEXT,
        relationship TEXT,
        priority INTEGER DEFAULT 0,
        last_contact_date TEXT,
        next_follow_up_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE CASCADE
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_companies_user ON user_companies(user_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_companies_company ON user_companies(company_id)
    `);

    // User-people associations
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS user_people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        person_id INTEGER NOT NULL,
        relationship TEXT,
        tags TEXT,
        notes TEXT,
        last_contact_date TEXT,
        next_follow_up_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, person_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES global_people(id) ON DELETE CASCADE
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_people_user ON user_people(user_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_people_person ON user_people(person_id)
    `);

    // Strategies table (user-specific)
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS strategies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        company_id INTEGER NOT NULL,
        your_company TEXT NOT NULL,
        your_product TEXT NOT NULL,
        target_personas TEXT,
        target_industries TEXT,
        value_alignment TEXT,
        key_topics TEXT,
        tone_and_voice TEXT,
        product_positioning TEXT,
        talking_points TEXT,
        opening_line TEXT,
        what_to_avoid TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE CASCADE
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_strategies_user ON strategies(user_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_strategies_company ON strategies(company_id)
    `);

    // Drafted emails table (user-specific)
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS drafted_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        company_id INTEGER,
        person_id INTEGER,
        strategy_id INTEGER,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        sent_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE SET NULL,
        FOREIGN KEY (person_id) REFERENCES global_people(id) ON DELETE SET NULL,
        FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_emails_user ON drafted_emails(user_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_emails_company ON drafted_emails(company_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_emails_person ON drafted_emails(person_id)
    `);
  }

  // ==========================================================================
  // User Management
  // ==========================================================================

  async createUser(user: User): Promise<void> {
    await this.client.execute({
      sql: `
        INSERT INTO users (id, email, full_name, avatar_url)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          full_name = excluded.full_name,
          avatar_url = excluded.avatar_url,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [user.id, user.email, user.full_name || null, user.avatar_url || null],
    });
  }

  async getUser(userId: string): Promise<User | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId],
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id as string,
      email: row.email as string,
      full_name: (row.full_name as string) || undefined,
      avatar_url: (row.avatar_url as string) || undefined,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
    };
  }

  // ==========================================================================
  // Global Company Management
  // ==========================================================================

  async addOrGetCompany(company: {
    name: string;
    domain?: string;
    industry?: string;
    description?: string;
    website?: string;
    linkedin_url?: string;
    created_by: string;
  }): Promise<number> {
    // Check if company exists by name or domain
    const existingResult = await this.client.execute({
      sql: `
        SELECT id FROM global_companies 
        WHERE name = ? COLLATE NOCASE
           OR (domain IS NOT NULL AND domain = ?)
        LIMIT 1
      `,
      args: [company.name, company.domain || null],
    });

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].id as number;
    }

    // Create new global company
    const result = await this.client.execute({
      sql: `
        INSERT INTO global_companies (
          name, domain, industry, description, website, linkedin_url, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        company.name,
        company.domain || null,
        company.industry || null,
        company.description || null,
        company.website || null,
        company.linkedin_url || null,
        company.created_by,
      ],
    });

    return result.rows[0]?.id as number;
  }

  async getGlobalCompany(companyId: number): Promise<GlobalCompany | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM global_companies WHERE id = ?',
      args: [companyId],
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id as number,
      name: row.name as string,
      domain: (row.domain as string) || undefined,
      industry: (row.industry as string) || undefined,
      description: (row.description as string) || undefined,
      website: (row.website as string) || undefined,
      linkedin_url: (row.linkedin_url as string) || undefined,
      employee_count: (row.employee_count as number) || undefined,
      founded_year: (row.founded_year as number) || undefined,
      location: (row.location as string) || undefined,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
      created_by: (row.created_by as string) || undefined,
    };
  }

  async searchGlobalCompanies(query: string, limit: number = 50): Promise<GlobalCompany[]> {
    const result = await this.client.execute({
      sql: `
        SELECT * FROM global_companies
        WHERE name LIKE ? COLLATE NOCASE
           OR domain LIKE ? COLLATE NOCASE
           OR industry LIKE ? COLLATE NOCASE
        ORDER BY name
        LIMIT ?
      `,
      args: [`%${query}%`, `%${query}%`, `%${query}%`, limit],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      domain: (row.domain as string) || undefined,
      industry: (row.industry as string) || undefined,
      description: (row.description as string) || undefined,
      website: (row.website as string) || undefined,
      linkedin_url: (row.linkedin_url as string) || undefined,
      employee_count: (row.employee_count as number) || undefined,
      location: (row.location as string) || undefined,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
    }));
  }

  // ==========================================================================
  // User-Company Associations
  // ==========================================================================

  async associateUserWithCompany(params: {
    user_id: string;
    company_id: number;
    tags?: string[];
    notes?: string;
    relationship?: string;
    priority?: number;
  }): Promise<number> {
    const result = await this.client.execute({
      sql: `
        INSERT INTO user_companies (
          user_id, company_id, tags, notes, relationship, priority
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, company_id) DO UPDATE SET
          tags = excluded.tags,
          notes = excluded.notes,
          relationship = excluded.relationship,
          priority = excluded.priority,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      args: [
        params.user_id,
        params.company_id,
        params.tags ? JSON.stringify(params.tags) : null,
        params.notes || null,
        params.relationship || null,
        params.priority || 0,
      ],
    });

    return result.rows[0]?.id as number;
  }

  async getUserCompanies(userId: string): Promise<(GlobalCompany & { association: UserCompanyAssociation })[]> {
    const result = await this.client.execute({
      sql: `
        SELECT 
          gc.*,
          uc.id as assoc_id,
          uc.tags,
          uc.notes,
          uc.relationship,
          uc.priority,
          uc.last_contact_date,
          uc.next_follow_up_date,
          uc.created_at as assoc_created_at
        FROM global_companies gc
        JOIN user_companies uc ON gc.id = uc.company_id
        WHERE uc.user_id = ?
        ORDER BY uc.priority DESC, gc.name
      `,
      args: [userId],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      domain: (row.domain as string) || undefined,
      industry: (row.industry as string) || undefined,
      description: (row.description as string) || undefined,
      website: (row.website as string) || undefined,
      linkedin_url: (row.linkedin_url as string) || undefined,
      employee_count: (row.employee_count as number) || undefined,
      location: (row.location as string) || undefined,
      association: {
        id: row.assoc_id as number,
        user_id: userId,
        company_id: row.id as number,
        tags: row.tags ? JSON.parse(row.tags as string) : undefined,
        notes: (row.notes as string) || undefined,
        relationship: (row.relationship as string) || undefined,
        priority: (row.priority as number) || undefined,
        last_contact_date: (row.last_contact_date as string) || undefined,
        next_follow_up_date: (row.next_follow_up_date as string) || undefined,
        created_at: (row.assoc_created_at as string) || undefined,
      },
    }));
  }

  // ==========================================================================
  // Global People Management
  // ==========================================================================

  async addOrGetPerson(person: {
    name: string;
    email?: string;
    title?: string;
    company_id?: number;
    linkedin_url?: string;
    phone?: string;
    created_by: string;
  }): Promise<number> {
    // Check if person exists by email or linkedin
    if (person.email || person.linkedin_url) {
      const existingResult = await this.client.execute({
        sql: `
          SELECT id FROM global_people 
          WHERE (email IS NOT NULL AND email = ?)
             OR (linkedin_url IS NOT NULL AND linkedin_url = ?)
          LIMIT 1
        `,
        args: [person.email || null, person.linkedin_url || null],
      });

      if (existingResult.rows.length > 0) {
        return existingResult.rows[0].id as number;
      }
    }

    // Create new global person
    const result = await this.client.execute({
      sql: `
        INSERT INTO global_people (
          name, email, title, company_id, linkedin_url, phone, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        person.name,
        person.email || null,
        person.title || null,
        person.company_id || null,
        person.linkedin_url || null,
        person.phone || null,
        person.created_by,
      ],
    });

    return result.rows[0]?.id as number;
  }

  async getPeopleAtCompany(companyId: number): Promise<GlobalPerson[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM global_people WHERE company_id = ? ORDER BY name',
      args: [companyId],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      email: (row.email as string) || undefined,
      title: (row.title as string) || undefined,
      company_id: (row.company_id as number) || undefined,
      linkedin_url: (row.linkedin_url as string) || undefined,
      phone: (row.phone as string) || undefined,
      location: (row.location as string) || undefined,
      created_at: (row.created_at as string) || undefined,
      created_by: (row.created_by as string) || undefined,
    }));
  }

  // ==========================================================================
  // Utility
  // ==========================================================================

  async close(): Promise<void> {
    this.client.close();
  }
}
