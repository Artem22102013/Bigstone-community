"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { handleOAuthCallback, signIn, signInWithDiscord } from "@/lib/auth"
import { Separator } from "../ui/separator"

const errorCodeMap = {
  access_denied: "Oauth access denied.",
};

export default function SignInForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    handleOAuthCallback()
      .then(async (user) => {
        if (!user) {
          return
        }
        router.push("/auth/welcome")
      })
      .catch((err: any) => {
        setError(err.message || "Failed to complete OAuth login")
      })

    if (searchParams.get("error")) {
      const errorCode = searchParams.get("error")
      setError(errorCodeMap[errorCode as keyof typeof errorCodeMap] || "An unknown error occurred")
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(formData.username, formData.password)
      router.push("/auth/welcome")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleDiscordLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithDiscord()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Discord")
    } finally {
      setLoading(false)
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>Welcome back to the Bigstone community</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleDiscordLogin} className="w-full" disabled={loading}>
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/discord.svg" alt="Discord Icon" className="invert size-4 inline-block" />
          Sign in with Discord
        </Button>

        <Separator className="my-4"/>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Discord Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your Discord username"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center space-y-2">
            <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
