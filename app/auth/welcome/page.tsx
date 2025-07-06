import ProtectedRoute from "@/components/auth/protected-route"
import SignInWelcome from "@/components/auth/sign-in-welcome"

export default function WelcomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <SignInWelcome />
      </div>
    </ProtectedRoute>
  )
}
