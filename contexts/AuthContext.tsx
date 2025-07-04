"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
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

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Create Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
          setUserProfile(null)
        } else {
          setUser(session?.user || null)
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user || null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted, supabase.auth])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("auth_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error)
        return
      }

      if (data) {
        setUserProfile(data)
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(userId)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const userData = user?.user_metadata || {}
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            auth_id: userId,
            email: user?.email || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            full_name: userData.full_name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
            phone: userData.phone || "",
            profile_image_url: userData.avatar_url || "",
            email_verified: user?.email_confirmed_at ? true : false,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating user profile:", error)
        return
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Error creating user profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      console.log("Sign in successful:", data.user?.id)

      // Wait a moment for auth state to update
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 100)

      return { error: null }
    } catch (error) {
      console.error("Sign in exception:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        return { error }
      }

      console.log("Sign up successful:", data.user?.id)

      // Wait a moment for auth state to update
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 100)

      return { error: null }
    } catch (error) {
      console.error("Sign up exception:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
      } else {
        console.log("Sign out successful")
        setUser(null)
        setUserProfile(null)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Sign out exception:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      throw new Error("No user logged in")
    }

    try {
      const { data, error } = await supabase.from("users").update(updates).eq("auth_id", user.id).select().single()

      if (error) {
        console.error("Error updating profile:", error)
        throw error
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, signOut, updateProfile }}>
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
