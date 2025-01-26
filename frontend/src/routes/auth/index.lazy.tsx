import { PasskeyAuth } from "@/components/passkey-auth"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/auth/")({
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem("token", token)
    navigate({ to: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Shuiroにログイン</p>
        </div>
        <PasskeyAuth onAuthenticationSuccess={handleAuthSuccess} />
      </div>
    </div>
  )
}
