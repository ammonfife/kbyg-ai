import { createClient, Client } from '@libsql/client';

export interface Employee {
  name: string;
  title: string;
  linkedin?: string;
}

export interface CompanyProfile {
  id?: number;
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

export class GTMDatabase {
  private client: Client;

  constructor(url: string, authToken: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  async initialize(): Promise<void> {
    // Create companies table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        industry TEXT,
        context TEXT,
        recent_activity TEXT,
        enriched_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create employees table
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

    // Create index on company_id for faster lookups
    await this.client.execute(`
      CREATE INDEX IF NOT EXISTS idx_employees_company 
      ON employees(company_id)
    `);
  }

  async addCompany(profile: CompanyProfile): Promise<number> {
    // Insert company
    const result = await this.client.execute({
      sql: `
        INSERT INTO companies (name, description, industry, context, recent_activity, enriched_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
          description = excluded.description,
          industry = excluded.industry,
          context = excluded.context,
          recent_activity = excluded.recent_activity,
          enriched_at = excluded.enriched_at,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      args: [
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
        sql: `
          INSERT INTO employees (company_id, name, title, linkedin)
          VALUES (?, ?, ?, ?)
        `,
        args: [companyId, emp.name, emp.title || null, emp.linkedin || null],
      });
    }

    return companyId;
  }

  async getCompany(name: string): Promise<CompanyProfile | null> {
    // Get company
    const companyResult = await this.client.execute({
      sql: 'SELECT * FROM companies WHERE name = ? COLLATE NOCASE',
      args: [name],
    });

    if (companyResult.rows.length === 0) {
      return null;
    }

    const company = companyResult.rows[0];

    // Get employees
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

  async listCompanies(): Promise<CompanyProfile[]> {
    const result = await this.client.execute('SELECT * FROM companies ORDER BY name');

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

  async searchCompanies(query: string): Promise<CompanyProfile[]> {
    const result = await this.client.execute({
      sql: `
        SELECT DISTINCT c.* FROM companies c
        LEFT JOIN employees e ON c.id = e.company_id
        WHERE c.name LIKE ? COLLATE NOCASE
           OR c.description LIKE ? COLLATE NOCASE
           OR c.industry LIKE ? COLLATE NOCASE
           OR e.name LIKE ? COLLATE NOCASE
        ORDER BY c.name
      `,
      args: [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
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

  async deleteCompany(name: string): Promise<boolean> {
    const result = await this.client.execute({
      sql: 'DELETE FROM companies WHERE name = ? COLLATE NOCASE',
      args: [name],
    });

    return (result.rowsAffected || 0) > 0;
  }

  async close(): Promise<void> {
    this.client.close();
  }
}
