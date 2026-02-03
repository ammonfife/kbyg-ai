#!/usr/bin/env node

/**
 * Database initialization script
 * Run this to manually initialize the database schema
 * 
 * Usage:
 *   npm run init-db
 *   # or
 *   node dist/scripts/init-db.js
 */

import { config } from 'dotenv';
import { EventDatabase } from '../src/event-db.js';

// Load environment variables
config();

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
  console.error('\nSet them in your .env file or environment:');
  console.error('  TURSO_DATABASE_URL=libsql://your-database.turso.io');
  console.error('  TURSO_AUTH_TOKEN=your_auth_token');
  process.exit(1);
}

async function main() {
  console.log('🔧 Initializing Event Database...\n');
  console.log(`Database: ${TURSO_URL}\n`);

  const db = new EventDatabase(TURSO_URL, TURSO_TOKEN);

  try {
    await db.initialize();
    console.log('✅ Database schema created successfully!\n');
    console.log('Tables created:');
    console.log('  - user_profiles');
    console.log('  - events');
    console.log('  - people');
    console.log('  - sponsors');
    console.log('  - expected_personas');
    console.log('  - next_best_actions');
    console.log('  - related_events');
    console.log('\n✨ Database is ready to use!');
  } catch (error: any) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
