"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
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
        } else {
          setUser(session?.user || null)
        }
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
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
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted, supabase.auth])

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
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Sign out exception:", error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
