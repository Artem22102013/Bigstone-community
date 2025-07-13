// src/web/app/login/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'   // ← make sure this points to your client‑side supabase instance

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        // Dynamically pick dev vs. prod
        redirectTo: `https://community.bigstone.ovh/auth/callback`
      }
    })

    if (error) {
      console.error('OAuth error:', error.message)
    }
    // No need to router.push here – Supabase will redirect you to Discord, then back to /auth/callback
  }

  return (
    <main className="flex flex-col items-center justify-center min-h‑screen bg-gray‑100 p‑4">
      <div className="bg‑white p‑8 rounded‑lg shadow‑md w‑full max‑w‑md text‑center">
        <h1 className="text‑2xl font‑bold text‑gray‑800 mb‑6">
          Welcome to the App
        </h1>
        <p className="text‑gray‑600 mb‑8">
          Sign in with your Discord account to continue
        </p>

        <button
          onClick={handleLogin}
          className="flex items‑center justify‑center gap‑2 bg-[#5865F2] text‑white px‑6 py‑3 rounded‑lg text‑lg hover:bg-[#4752C4] transition‑colors w‑full"
        >
          <DiscordIcon />
          Sign in with Discord
        </button>
      </div>
    </main>
  )
}

function DiscordIcon() {
  return (
    <svg className="w‑6 h‑6" fill="currentColor" viewBox="0 0 24 24">
      {/* …path data… */}
    </svg>
  )
}
