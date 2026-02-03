#!/bin/bash

# Generate TypeScript types from Supabase schema

echo "🔄 Generating Supabase types..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Generate types
supabase gen types typescript --local > src/integrations/supabase/types.ts

echo "✅ Types generated successfully!"
echo "📝 File: src/integrations/supabase/types.ts"
