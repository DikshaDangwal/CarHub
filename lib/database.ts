import { supabase } from "./supabase"

export interface UserProfile {
  id: string
  auth_id: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  profile_image_url?: string
  bio?: string
  preferences?: any
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

// Create a new user profile
export async function createUserProfile(userData: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      console.error("Error creating user profile:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { data: null, error }
  }
}

// Get user profile by auth_id
export async function getUserProfile(authId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("auth_id", authId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user profile:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { data: null, error }
  }
}

// Update user profile
export async function updateUserProfile(authId: string, updates: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase.from("users").update(updates).eq("auth_id", authId).select().single()

    if (error) {
      console.error("Error updating user profile:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { data: null, error }
  }
}

// Delete user profile
export async function deleteUserProfile(authId: string) {
  try {
    const { error } = await supabase.from("users").delete().eq("auth_id", authId)

    if (error) {
      console.error("Error deleting user profile:", error)
      throw error
    }

    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error }
  }
}
