// Mock authentication service for demo purposes
export interface MockUser {
  id: string
  email: string
  user_metadata: {
    first_name?: string
    last_name?: string
    full_name?: string
    phone?: string
  }
  email_confirmed_at?: string
}

export interface MockUserProfile {
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

// Mock database
const mockUsers: MockUser[] = []
const mockProfiles: MockUserProfile[] = []
let currentUser: MockUser | null = null

// Mock authentication functions
export const mockAuth = {
  async signInWithPassword(credentials: { email: string; password: string }) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For demo purposes, accept any email/password combination
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      user_metadata: {
        first_name: "Demo",
        last_name: "User",
        full_name: "Demo User",
      },
      email_confirmed_at: new Date().toISOString(),
    }

    currentUser = user
    mockUsers.push(user)

    return {
      data: { user },
      error: null,
    }
  },

  async signUp(credentials: { email: string; password: string; options?: { data: any } }) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userData = credentials.options?.data || {}
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      user_metadata: {
        first_name: userData.first_name || "New",
        last_name: userData.last_name || "User",
        full_name: userData.full_name || `${userData.first_name || "New"} ${userData.last_name || "User"}`,
        phone: userData.phone || "",
      },
      email_confirmed_at: new Date().toISOString(),
    }

    currentUser = user
    mockUsers.push(user)

    return {
      data: { user },
      error: null,
    }
  },

  async signOut() {
    currentUser = null
    return { error: null }
  },

  async getSession() {
    return {
      data: { session: currentUser ? { user: currentUser } : null },
      error: null,
    }
  },

  async getUser() {
    return {
      data: { user: currentUser },
      error: null,
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simulate auth state change
    setTimeout(() => {
      callback("SIGNED_IN", currentUser ? { user: currentUser } : null)
    }, 100)

    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }
  },
}

// Mock database functions
export const mockDatabase = {
  from(table: string) {
    if (table === "users") {
      return {
        select: (columns: string) => ({
          eq: (column: string, value: string) => ({
            single: async () => {
              const profile = mockProfiles.find((p) => p.auth_id === value)
              return {
                data: profile || null,
                error: profile ? null : { code: "PGRST116" },
              }
            },
          }),
        }),
        insert: (data: any[]) => ({
          select: () => ({
            single: async () => {
              const newProfile: MockUserProfile = {
                id: `profile_${Date.now()}`,
                auth_id: data[0].auth_id,
                email: data[0].email,
                first_name: data[0].first_name || "",
                last_name: data[0].last_name || "",
                full_name: data[0].full_name || "",
                phone: data[0].phone || "",
                date_of_birth: data[0].date_of_birth || "",
                gender: data[0].gender || "",
                address: data[0].address || "",
                city: data[0].city || "",
                state: data[0].state || "",
                country: data[0].country || "",
                postal_code: data[0].postal_code || "",
                profile_image_url: data[0].profile_image_url || "",
                bio: data[0].bio || "",
                preferences: data[0].preferences || {},
                is_active: true,
                email_verified: data[0].email_verified || false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }

              mockProfiles.push(newProfile)

              return {
                data: newProfile,
                error: null,
              }
            },
          }),
        }),
        update: (updates: any) => ({
          eq: (column: string, value: string) => ({
            select: () => ({
              single: async () => {
                const profileIndex = mockProfiles.findIndex((p) => p.auth_id === value)
                if (profileIndex !== -1) {
                  mockProfiles[profileIndex] = {
                    ...mockProfiles[profileIndex],
                    ...updates,
                    updated_at: new Date().toISOString(),
                  }
                  return {
                    data: mockProfiles[profileIndex],
                    error: null,
                  }
                }
                return {
                  data: null,
                  error: { message: "Profile not found" },
                }
              },
            }),
          }),
        }),
      }
    }
    return {}
  },
}
