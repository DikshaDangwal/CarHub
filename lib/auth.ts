import { createClient } from "@supabase/supabase-js"

export interface SignUpData {
  first_name: string
  last_name: string
  full_name: string
  phone?: string
}

// Create Supabase client
const getSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign in error:", error)
      return { data: null, error }
    }

    console.log("Sign in successful:", data.user?.id)
    return { data, error: null }
  } catch (error: any) {
    console.error("Sign in exception:", error)
    return { data: null, error }
  }
}

export async function signUp(email: string, password: string, userData: SignUpData) {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      return { data: null, error }
    }

    console.log("Sign up successful:", data.user?.id)
    return { data, error: null }
  } catch (error: any) {
    console.error("Sign up exception:", error)
    return { data: null, error }
  }
}

export async function signOut() {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Sign out error:", error)
      return { error }
    }

    console.log("Sign out successful")
    return { error: null }
  } catch (error: any) {
    console.error("Sign out exception:", error)
    return { error }
  }
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Get user error:", error)
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Get user exception:", error)
    return { user: null, error }
  }
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      console.error("Reset password error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Reset password exception:", error)
    return { data: null, error }
  }
}
