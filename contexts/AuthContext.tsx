"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import { getUserProfile, createUserProfile, type UserProfile } from "@/lib/database"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Create Supabase client with environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      setLoading(false)
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (user) {
          // Fetch user profile from database
          const { data: profile } = await getUserProfile(user.id)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch or create user profile
        let { data: profile } = await getUserProfile(session.user.id)

        // If profile doesn't exist, create one
        if (!profile) {
          const newProfile = {
            auth_id: session.user.id,
            email: session.user.email!,
            first_name: session.user.user_metadata?.first_name || "",
            last_name: session.user.user_metadata?.last_name || "",
            full_name:
              session.user.user_metadata?.full_name ||
              `${session.user.user_metadata?.first_name || ""} ${session.user.user_metadata?.last_name || ""}`.trim(),
            email_verified: session.user.email_confirmed_at ? true : false,
          }

          const { data: createdProfile } = await createUserProfile(newProfile)
          profile = createdProfile
        }

        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const signOut = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase environment variables")
        return
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      const { updateUserProfile } = await import("@/lib/database")
      const { data } = await updateUserProfile(user.id, updates)
      if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const { data } = await getUserProfile(user.id)
      setUserProfile(data)
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  // Don't render children until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
