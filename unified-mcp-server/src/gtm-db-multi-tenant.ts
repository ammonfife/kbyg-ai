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

export interface Organization {
  id: number;
  name: string;
  slug: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationMember {
  id: number;
  organization_id: number;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  invited_by?: string;
  joined_at?: string;
}

export interface Employee {
  name: string;
  title: string;
  linkedin?: string;
}

export interface CompanyProfile {
  id?: number;
  organization_id: number;
  name: string;
  description?: string;
  industry?: string;
  context?: string;
  employees: Employee[];
  recent_activity?: string;
  enriched_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Strategy {
  id?: number;
  organization_id: number;
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
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface DraftedEmail {
  id?: number;
  organization_id: number;
  company_id: number;
  strategy_id?: number;
  subject: string;
  body: string;
  from_name: string;
  to_email?: string;
  status: 'draft' | 'sent' | 'scheduled';
  created_by: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
}

export interface AuthContext {
  user_id: string;
  organization_id: number;
  role: 'owner' | 'admin' | 'member';
}

// ============================================================================
// Database Class
// ============================================================================

export class GTMDatabaseMultiTenant {
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

    // Organizations table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        owner_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Organization members table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS organization_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        invited_by TEXT,
        joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, user_id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (invited_by) REFERENCES users(id)
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id)
    `);

    // Companies table (multi-tenant)
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        industry TEXT,
        context TEXT,
        recent_activity TEXT,
        enriched_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, name),
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_companies_org ON companies(organization_id)
    `);

    // Employees table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        title TEXT,
        linkedin TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id)
    `);

    // Strategies table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS strategies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
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
        created_by TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_strategies_org ON strategies(organization_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_strategies_company ON strategies(company_id)
    `);

    // Drafted emails table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS drafted_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        company_id INTEGER NOT NULL,
        strategy_id INTEGER,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        from_name TEXT NOT NULL,
        to_email TEXT,
        status TEXT DEFAULT 'draft',
        created_by TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        sent_at TEXT,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_emails_org ON drafted_emails(organization_id)
    `);

    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_emails_company ON drafted_emails(company_id)
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
  // Organization Management
  // ==========================================================================

  async createOrganization(name: string, slug: string, ownerId: string): Promise<number> {
    const result = await this.client.execute({
      sql: `
        INSERT INTO organizations (name, slug, owner_id)
        VALUES (?, ?, ?)
        RETURNING id
      `,
      args: [name, slug, ownerId],
    });

    const orgId = result.rows[0]?.id as number;

    // Add owner as member with 'owner' role
    await this.client.execute({
      sql: `
        INSERT INTO organization_members (organization_id, user_id, role)
        VALUES (?, ?, 'owner')
      `,
      args: [orgId, ownerId],
    });

    return orgId;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const result = await this.client.execute({
      sql: `
        SELECT o.* FROM organizations o
        JOIN organization_members om ON o.id = om.organization_id
        WHERE om.user_id = ?
        ORDER BY o.created_at DESC
      `,
      args: [userId],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      slug: row.slug as string,
      owner_id: row.owner_id as string,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
    }));
  }

  async getAuthContext(userId: string, organizationId: number): Promise<AuthContext | null> {
    const result = await this.client.execute({
      sql: `
        SELECT role FROM organization_members
        WHERE user_id = ? AND organization_id = ?
      `,
      args: [userId, organizationId],
    });

    if (result.rows.length === 0) return null;

    return {
      user_id: userId,
      organization_id: organizationId,
      role: result.rows[0].role as 'owner' | 'admin' | 'member',
    };
  }

  async addOrganizationMember(
    organizationId: number,
    userId: string,
    role: 'admin' | 'member',
    invitedBy: string
  ): Promise<void> {
    await this.client.execute({
      sql: `
        INSERT INTO organization_members (organization_id, user_id, role, invited_by)
        VALUES (?, ?, ?, ?)
      `,
      args: [organizationId, userId, role, invitedBy],
    });
  }

  async listOrganizationMembers(organizationId: number): Promise<OrganizationMember[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM organization_members WHERE organization_id = ? ORDER BY joined_at',
      args: [organizationId],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      organization_id: row.organization_id as number,
      user_id: row.user_id as string,
      role: row.role as 'owner' | 'admin' | 'member',
      invited_by: (row.invited_by as string) || undefined,
      joined_at: (row.joined_at as string) || undefined,
    }));
  }

  // ==========================================================================
  // Company Management (Organization-Scoped)
  // ==========================================================================

  async addCompany(profile: CompanyProfile, ctx: AuthContext): Promise<number> {
    // Verify user has access to organization
    if (profile.organization_id !== ctx.organization_id) {
      throw new Error('Organization mismatch');
    }

    // Insert company
    const result = await this.client.execute({
      sql: `
        INSERT INTO companies (organization_id, name, description, industry, context, recent_activity, enriched_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(organization_id, name) DO UPDATE SET
          description = excluded.description,
          industry = excluded.industry,
          context = excluded.context,
          recent_activity = excluded.recent_activity,
          enriched_at = excluded.enriched_at,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      args: [
        profile.organization_id,
        profile.name,
        profile.description || null,
        profile.industry || null,
        profile.context || null,
        profile.recent_activity || null,
        profile.enriched_at || null,
      ],
    });

    const companyId = result.rows[0]?.id as number;

    // Delete old employees and insert new ones
    await this.client.execute({
      sql: 'DELETE FROM employees WHERE company_id = ?',
      args: [companyId],
    });

    for (const emp of profile.employees || []) {
      await this.client.execute({
        sql: `INSERT INTO employees (company_id, name, title, linkedin) VALUES (?, ?, ?, ?)`,
        args: [companyId, emp.name, emp.title || null, emp.linkedin || null],
      });
    }

    return companyId;
  }

  async getCompany(name: string, ctx: AuthContext): Promise<CompanyProfile | null> {
    const companyResult = await this.client.execute({
      sql: 'SELECT * FROM companies WHERE organization_id = ? AND name = ? COLLATE NOCASE',
      args: [ctx.organization_id, name],
    });

    if (companyResult.rows.length === 0) return null;

    const company = companyResult.rows[0];

    const employeesResult = await this.client.execute({
      sql: 'SELECT name, title, linkedin FROM employees WHERE company_id = ?',
      args: [company.id as number],
    });

    const employees: Employee[] = employeesResult.rows.map((row) => ({
      name: row.name as string,
      title: (row.title as string) || '',
      linkedin: (row.linkedin as string) || undefined,
    }));

    return {
      id: company.id as number,
      organization_id: company.organization_id as number,
      name: company.name as string,
      description: (company.description as string) || undefined,
      industry: (company.industry as string) || undefined,
      context: (company.context as string) || undefined,
      employees,
      recent_activity: (company.recent_activity as string) || undefined,
      enriched_at: (company.enriched_at as string) || undefined,
      created_at: (company.created_at as string) || undefined,
      updated_at: (company.updated_at as string) || undefined,
    };
  }

  async listCompanies(ctx: AuthContext): Promise<CompanyProfile[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM companies WHERE organization_id = ? ORDER BY name',
      args: [ctx.organization_id],
    });

    const companies: CompanyProfile[] = [];

    for (const row of result.rows) {
      const employeesResult = await this.client.execute({
        sql: 'SELECT name, title, linkedin FROM employees WHERE company_id = ?',
        args: [row.id as number],
      });

      const employees: Employee[] = employeesResult.rows.map((empRow) => ({
        name: empRow.name as string,
        title: (empRow.title as string) || '',
        linkedin: (empRow.linkedin as string) || undefined,
      }));

      companies.push({
        id: row.id as number,
        organization_id: row.organization_id as number,
        name: row.name as string,
        description: (row.description as string) || undefined,
        industry: (row.industry as string) || undefined,
        context: (row.context as string) || undefined,
        employees,
        recent_activity: (row.recent_activity as string) || undefined,
        enriched_at: (row.enriched_at as string) || undefined,
        created_at: (row.created_at as string) || undefined,
        updated_at: (row.updated_at as string) || undefined,
      });
    }

    return companies;
  }

  async searchCompanies(query: string, ctx: AuthContext): Promise<CompanyProfile[]> {
    const result = await this.client.execute({
      sql: `
        SELECT DISTINCT c.* FROM companies c
        LEFT JOIN employees e ON c.id = e.company_id
        WHERE c.organization_id = ?
          AND (c.name LIKE ? COLLATE NOCASE
           OR c.description LIKE ? COLLATE NOCASE
           OR c.industry LIKE ? COLLATE NOCASE
           OR e.name LIKE ? COLLATE NOCASE)
        ORDER BY c.name
      `,
      args: [ctx.organization_id, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
    });

    const companies: CompanyProfile[] = [];

    for (const row of result.rows) {
      const employeesResult = await this.client.execute({
        sql: 'SELECT name, title, linkedin FROM employees WHERE company_id = ?',
        args: [row.id as number],
      });

      const employees: Employee[] = employeesResult.rows.map((empRow) => ({
        name: empRow.name as string,
        title: (empRow.title as string) || '',
        linkedin: (empRow.linkedin as string) || undefined,
      }));

      companies.push({
        id: row.id as number,
        organization_id: row.organization_id as number,
        name: row.name as string,
        description: (row.description as string) || undefined,
        industry: (row.industry as string) || undefined,
        context: (row.context as string) || undefined,
        employees,
        recent_activity: (row.recent_activity as string) || undefined,
        enriched_at: (row.enriched_at as string) || undefined,
        created_at: (row.created_at as string) || undefined,
        updated_at: (row.updated_at as string) || undefined,
      });
    }

    return companies;
  }

  async deleteCompany(name: string, ctx: AuthContext): Promise<boolean> {
    // Only owners/admins can delete
    if (ctx.role !== 'owner' && ctx.role !== 'admin') {
      throw new Error('Permission denied');
    }

    const result = await this.client.execute({
      sql: 'DELETE FROM companies WHERE organization_id = ? AND name = ? COLLATE NOCASE',
      args: [ctx.organization_id, name],
    });

    return (result.rowsAffected || 0) > 0;
  }

  // ==========================================================================
  // Strategy Management
  // ==========================================================================

  async saveStrategy(strategy: Strategy, ctx: AuthContext): Promise<number> {
    if (strategy.organization_id !== ctx.organization_id) {
      throw new Error('Organization mismatch');
    }

    const result = await this.client.execute({
      sql: `
        INSERT INTO strategies (
          organization_id, company_id, your_company, your_product,
          target_personas, target_industries, value_alignment, key_topics,
          tone_and_voice, product_positioning, talking_points, opening_line,
          what_to_avoid, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        strategy.organization_id,
        strategy.company_id,
        strategy.your_company,
        strategy.your_product,
        strategy.target_personas || null,
        strategy.target_industries || null,
        strategy.value_alignment,
        JSON.stringify(strategy.key_topics),
        strategy.tone_and_voice,
        strategy.product_positioning,
        JSON.stringify(strategy.talking_points),
        strategy.opening_line,
        JSON.stringify(strategy.what_to_avoid),
        ctx.user_id,
      ],
    });

    return result.rows[0]?.id as number;
  }

  async listStrategies(ctx: AuthContext): Promise<Strategy[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM strategies WHERE organization_id = ? ORDER BY created_at DESC',
      args: [ctx.organization_id],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      organization_id: row.organization_id as number,
      company_id: row.company_id as number,
      your_company: row.your_company as string,
      your_product: row.your_product as string,
      target_personas: (row.target_personas as string) || undefined,
      target_industries: (row.target_industries as string) || undefined,
      value_alignment: row.value_alignment as string,
      key_topics: JSON.parse(row.key_topics as string),
      tone_and_voice: row.tone_and_voice as string,
      product_positioning: row.product_positioning as string,
      talking_points: JSON.parse(row.talking_points as string),
      opening_line: row.opening_line as string,
      what_to_avoid: JSON.parse(row.what_to_avoid as string),
      created_by: row.created_by as string,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
    }));
  }

  // ==========================================================================
  // Email Management
  // ==========================================================================

  async saveEmail(email: DraftedEmail, ctx: AuthContext): Promise<number> {
    if (email.organization_id !== ctx.organization_id) {
      throw new Error('Organization mismatch');
    }

    const result = await this.client.execute({
      sql: `
        INSERT INTO drafted_emails (
          organization_id, company_id, strategy_id, subject, body,
          from_name, to_email, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        email.organization_id,
        email.company_id,
        email.strategy_id || null,
        email.subject,
        email.body,
        email.from_name,
        email.to_email || null,
        email.status,
        ctx.user_id,
      ],
    });

    return result.rows[0]?.id as number;
  }

  async listEmails(ctx: AuthContext): Promise<DraftedEmail[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM drafted_emails WHERE organization_id = ? ORDER BY created_at DESC',
      args: [ctx.organization_id],
    });

    return result.rows.map((row) => ({
      id: row.id as number,
      organization_id: row.organization_id as number,
      company_id: row.company_id as number,
      strategy_id: (row.strategy_id as number) || undefined,
      subject: row.subject as string,
      body: row.body as string,
      from_name: row.from_name as string,
      to_email: (row.to_email as string) || undefined,
      status: row.status as 'draft' | 'sent' | 'scheduled',
      created_by: row.created_by as string,
      created_at: (row.created_at as string) || undefined,
      updated_at: (row.updated_at as string) || undefined,
      sent_at: (row.sent_at as string) || undefined,
    }));
  }

  async close(): Promise<void> {
    this.client.close();
  }
}
