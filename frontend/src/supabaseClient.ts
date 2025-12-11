import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
// Updated to use Publishable Key (new terminology, replaces Anon Key)
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase URL and Publishable Key must be set in environment variables')
}

// createClient works exactly the same way with the new keys
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

