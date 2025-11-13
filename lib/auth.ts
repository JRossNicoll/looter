// Authentication utilities and user management
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  provider: "email" | "github" | "sso" | "phantom"
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

// Simple in-memory storage (replace with database in production)
const USERS_KEY = "looter_users"
const SESSION_KEY = "looter_session"

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return null

  const parsed = JSON.parse(session)
  // Check if session is expired
  if (new Date(parsed.expiresAt) < new Date()) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  return parsed
}

function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}

export async function signUp(
  email: string,
  password: string,
  name?: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const users = getUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name: name || email.split("@")[0],
    provider: "email",
    createdAt: new Date().toISOString(),
  }

  // Store password hash (in production, use proper hashing)
  const passwordHash = btoa(password) // Simple encoding for demo
  localStorage.setItem(`looter_pwd_${user.id}`, passwordHash)

  users.push(user)
  saveUsers(users)

  // Create session
  const session: AuthSession = {
    user,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }
  saveSession(session)

  return { success: true, user }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.provider === "email")

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Verify password
  const storedHash = localStorage.getItem(`looter_pwd_${user.id}`)
  const passwordHash = btoa(password)

  if (storedHash !== passwordHash) {
    return { success: false, error: "Invalid email or password" }
  }

  // Create session
  const session: AuthSession = {
    user,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  saveSession(session)

  return { success: true, user }
}

export async function signInWithGitHub(): Promise<{ success: boolean; error?: string; user?: User }> {
  // Simulate GitHub OAuth flow
  // In production, implement proper OAuth flow
  const mockGitHubUser = {
    id: crypto.randomUUID(),
    email: "github.user@example.com",
    name: "GitHub User",
    avatar: "https://github.com/identicons/user.png",
    provider: "github" as const,
    createdAt: new Date().toISOString(),
  }

  const users = getUsers()
  let user = users.find((u) => u.email === mockGitHubUser.email)

  if (!user) {
    user = mockGitHubUser
    users.push(user)
    saveUsers(users)
  }

  const session: AuthSession = {
    user,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  saveSession(session)

  return { success: true, user }
}

export async function signInWithSSO(): Promise<{ success: boolean; error?: string; user?: User }> {
  // Simulate SSO flow
  const mockSSOUser = {
    id: crypto.randomUUID(),
    email: "sso.user@company.com",
    name: "SSO User",
    provider: "sso" as const,
    createdAt: new Date().toISOString(),
  }

  const users = getUsers()
  let user = users.find((u) => u.email === mockSSOUser.email)

  if (!user) {
    user = mockSSOUser
    users.push(user)
    saveUsers(users)
  }

  const session: AuthSession = {
    user,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  saveSession(session)

  return { success: true, user }
}

export function signOut() {
  clearSession()
}
