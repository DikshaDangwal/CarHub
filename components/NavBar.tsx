"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from "lucide-react"
import Logo from "./Logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      closeMenu()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const closeMenu = () => setIsOpen(false)

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name[0].toUpperCase()
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name[0].toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  if (!mounted) {
    return (
      <header className="w-full absolute z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
          <Logo />
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
        </nav>
      </header>
    )
  }

  return (
    <header className="w-full absolute z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                pathname === link.href ? "text-blue-600" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {loading ? (
            <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* Profile Link */}
              <Link
                href="/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/profile"
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-blue-600 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Signup</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium ${
                    pathname === link.href ? "text-blue-600 bg-blue-50" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            {loading ? (
              <div className="space-y-2">
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : user ? (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-blue-600 text-white">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/dashboard"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                {/* Profile Link */}
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/profile"
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/auth/signin" onClick={closeMenu}>
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/signup" onClick={closeMenu}>
                    Signup
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
