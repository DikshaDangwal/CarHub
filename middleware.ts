import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Create a Supabase client using environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // Protected routes that require authentication
    const protectedRoutes = ["/dashboard", "/profile"]

    // Auth routes that should redirect if user is already logged in
    const authRoutes = ["/auth/signin", "/auth/signup"]

    // If user is not signed in and trying to access protected routes
    if (!session && protectedRoutes.some((route) => path.startsWith(route))) {
      const redirectUrl = new URL("/auth/signin", request.url)
      redirectUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (session && authRoutes.some((route) => path.startsWith(route))) {
      const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard"
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/signin", "/auth/signup"],
}
