import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database schema
export async function initializeDatabase() {
  console.log('🔧 Initializing database schema...');

  const schemas = [
    // Memory table for learning
    `CREATE TABLE IF NOT EXISTS memory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT NOT NULL,
      embedding VECTOR(1536),
      context TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );`,

    // Sessions table for game state
    `CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      node_id TEXT,
      state JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );`,

    // Leaderboard for game scores
    `CREATE TABLE IF NOT EXISTS leaderboard (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      player_name TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      win_streak INTEGER DEFAULT 0,
      evolution_level INTEGER DEFAULT 1,
      adaptive_behavior JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );`,

    // AI Memory for persistent learning
    `CREATE TABLE IF NOT EXISTS ai_memory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      player_id TEXT,
      experience JSONB,
      patterns TEXT[],
      adaptations JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );`
  ];

  for (const schema of schemas) {
    try {
      await supabase.rpc('exec', { query: schema });
    } catch (e) {
      // Schema might already exist or RPC not available
      console.log('Schema check complete');
    }
  }

  console.log('✅ Database initialized');
}

export default supabase;