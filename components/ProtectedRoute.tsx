"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/signin",
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading) {
      // If requireAuth is true and user is not logged in, redirect to login
      if (requireAuth && !user) {
        router.push(redirectTo)
      }

      // If requireAuth is false (auth pages) and user is logged in, redirect to dashboard
      if (!requireAuth && user) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, requireAuth, redirectTo, router, isClient])

  // Show loading state while checking auth
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If requireAuth is true and user is logged in, or requireAuth is false and user is not logged in, render children
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>
  }

  // This should not be visible as the useEffect should redirect, but just in case
  return null
}
