-- KBYG Database Schema
-- Full schema for storing extension data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (onboarding data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Onboarding data
  gemini_api_key TEXT,
  company_name TEXT,
  your_role TEXT,
  product TEXT,
  value_prop TEXT,
  target_personas TEXT,
  target_industries TEXT,
  competitors TEXT,
  
  -- Goals & Metrics
  deal_size NUMERIC,
  conversion_rate NUMERIC,
  opp_win_rate NUMERIC,
  event_goal INTEGER,
  notes TEXT,
  
  onboarding_complete BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Events table (analyzed conferences)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event details
  url TEXT NOT NULL,
  event_name TEXT,
  date TEXT,
  location TEXT,
  description TEXT,
  
  -- Analysis metadata
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ROI calculation cache
  target_count INTEGER DEFAULT 0,
  potential_revenue NUMERIC DEFAULT 0,
  
  UNIQUE(user_id, url)
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_analyzed_at ON events(analyzed_at DESC);

-- People table (attendees/speakers from events)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Person details
  name TEXT NOT NULL,
  role TEXT,
  title TEXT,
  company TEXT,
  persona TEXT,
  linkedin TEXT,
  
  -- AI-generated content
  linkedin_message TEXT,
  ice_breaker TEXT,
  
  -- Metadata
  is_target BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_people_event_id ON people(event_id);
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_company ON people(company);
CREATE INDEX idx_people_name ON people(name);

-- Expected personas table (predicted attendees)
CREATE TABLE expected_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Persona details
  persona TEXT NOT NULL,
  likelihood TEXT,
  count TEXT,
  
  -- AI-generated content
  linkedin_message TEXT,
  ice_breaker TEXT,
  conversation_starters JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  pain_points JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_expected_personas_event_id ON expected_personas(event_id);
CREATE INDEX idx_expected_personas_user_id ON expected_personas(user_id);

-- Sponsors table (companies sponsoring events)
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sponsor details
  name TEXT NOT NULL,
  tier TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sponsors_event_id ON sponsors(event_id);
CREATE INDEX idx_sponsors_user_id ON sponsors(user_id);

-- Next best actions table
CREATE TABLE next_best_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Action details
  priority INTEGER,
  action TEXT NOT NULL,
  reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_next_best_actions_event_id ON next_best_actions(event_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE expected_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_best_actions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- People policies
CREATE POLICY "Users can view people from own events" ON people
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert people to own events" ON people
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update people from own events" ON people
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete people from own events" ON people
  FOR DELETE USING (auth.uid() = user_id);

-- Expected personas policies
CREATE POLICY "Users can view personas from own events" ON expected_personas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert personas to own events" ON expected_personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sponsors policies
CREATE POLICY "Users can view sponsors from own events" ON sponsors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert sponsors to own events" ON sponsors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Next best actions policies
CREATE POLICY "Users can view actions from own events" ON next_best_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert actions to own events" ON next_best_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
