"use client"

import { sessionManager, useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function SignInWelcome() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      // Always go to dashboard after sign in
      router.push("/dashboard")
    }
  }, [countdown, router])

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl text-green-600">Welcome Back!</CardTitle>
        <CardDescription>Redirecting you back in {countdown} seconds...</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/dashboard")} className="w-full">
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  )
}