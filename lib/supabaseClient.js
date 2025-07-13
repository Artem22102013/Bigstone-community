import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw error in development
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
  console.error(`
  Missing Supabase credentials!
  Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY 
  to your .env.local file
  `)
}

export const supabase = createClient(supabaseUrl, supabaseKey)