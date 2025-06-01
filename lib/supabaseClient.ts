import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseKey)
}

// Create a singleton instance for client-side usage
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient()
  }
  return supabaseInstance
}

// Default export
export default getClient

// Named export for createClient (for middleware compatibility)
export { createSupabaseClient as createClient }
