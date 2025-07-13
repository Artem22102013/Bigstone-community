// src/web/app/login/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in with Discord</button>
    </div>
  )
}
