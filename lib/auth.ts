import { supabase } from "./supabase"
import { sessionManager } from "./session"

// Add simple hash function for demo
function simpleHash(password: string): string {
  // Simple hash for demo - in production use proper hashing
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export async function signUp(username: string, email: string, password: string) {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const hashedPassword = simpleHash(password)

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password_hash: hashedPassword }])
    .select()
    .single()

  if (error) throw error

  // Set session after successful signup
  sessionManager.setUser({
    id: data.id,
    username: data.username,
    email: data.email,
  })

  return data
}

export async function signIn(username: string, password: string) {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const passwordHash = simpleHash(password);
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password_hash", passwordHash)
    .single()

  if (error || !user) {
    throw new Error("Invalid credentials")
  }

  // Set session after successful signin
  sessionManager.setUser({
    id: user.id,
    username: user.username,
    email: user.email,
  })

  return user
}

export async function verifyUserForReset(username: string, email: string) {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("email", email)
    .single()

  if (error || !user) throw new Error("Username and email do not match")

  return user
}

export async function resetPassword(userId: string, newPassword: string) {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const hashedPassword = simpleHash(newPassword)

  const { error } = await supabase.from("users").update({ password_hash: hashedPassword }).eq("id", userId)

  if (error) throw error

  return true
}

// Legacy function - keeping for compatibility but not used
export async function requestPasswordReset(username: string, email: string) {
  return verifyUserForReset(username, email)
}

export async function signInWithDiscord() {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${window.location.origin}/auth/signin`
    }
  })

  if (error) throw error
  return data
}

export async function handleOAuthCallback() {
  if (!supabase) {
    throw new Error("Database connection not configured")
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw error
  }

  if (!session) {
    return null
  }
  
  await supabase.auth.signOut()
  if (!session?.user || !session.user.email) {
    throw new Error("Oauth login failed")
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single()

  if (existingUser) {
    sessionManager.setUser({
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    })
    return existingUser
  }

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{
      username: session.user.user_metadata.full_name,
      email: session.user.email,
      password_hash: simpleHash(window.crypto.randomUUID()),
    }])
    .select()
    .single()

  if (insertError) {
    throw insertError
  }

  sessionManager.setUser({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  })

  return newUser
}