import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  usePasskeyAuthentication,
  usePasskeyRegistration,
} from "@/features/auth/hooks"
import { Fingerprint } from "lucide-react"
import { useState } from "react"

type FormData = {
  email: string
  name: string
  role: Role
}

type PasskeyAuthProps = {
  onAuthenticationSuccess: (token: string) => void
}

type Role = "admin" | "student" | "teacher"

export const PasskeyAuth = ({ onAuthenticationSuccess }: PasskeyAuthProps) => {
  const [mode, setMode] = useState<"login" | "register">("login")

  return mode === "login" ? (
    <PasskeyLogin
      onRegister={() => setMode("register")}
      onSuccess={onAuthenticationSuccess}
    />
  ) : (
    <PasskeyRegistration
      onCancel={() => setMode("login")}
      onSuccess={onAuthenticationSuccess}
    />
  )
}

type PasskeyLoginProps = {
  onRegister: () => void
  onSuccess: (token: string) => void
}

const PasskeyLogin = ({ onRegister, onSuccess }: PasskeyLoginProps) => {
  const [email, setEmail] = useState("")
  const { error, isLoading, login } = usePasskeyAuthentication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login(email)
      onSuccess(result.token)
    } catch (error_) {
      console.error(error_)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>パスキーでログイン</CardTitle>
        <CardDescription>
          メールアドレスを入力してログインしてください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : "エラーが発生しました"}
            </p>
          )}
          <Button className="w-full" disabled={isLoading} type="submit">
            <Fingerprint className="mr-2 h-4 w-4" />
            {isLoading ? "パスキーで認証中..." : "パスキーでログイン"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={onRegister}
          type="button"
          variant="outline"
        >
          アカウントを作成
        </Button>
      </CardFooter>
    </Card>
  )
}

type PasskeyRegistrationProps = {
  onCancel: () => void
  onSuccess: (token: string) => void
}

const PasskeyRegistration = ({
  onCancel,
  onSuccess,
}: PasskeyRegistrationProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    role: "student",
  })

  const { error, isLoading, register } = usePasskeyRegistration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await register(formData)
      onSuccess(result.token)
    } catch (error_) {
      console.error(error_)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>アカウント作成</CardTitle>
        <CardDescription>
          必要な情報を入力してアカウントを作成してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="reg-email">メールアドレス</Label>
            <Input
              id="reg-email"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              type="email"
              value={formData.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              type="text"
              value={formData.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">ロール</Label>
            <select
              className="w-full rounded border p-2"
              id="role"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as Role,
                }))
              }
              value={formData.role}
            >
              <option value="student">学生</option>
              <option value="teacher">教師</option>
              <option value="admin">管理者</option>
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : "エラーが発生しました"}
            </p>
          )}
          <Button className="w-full" disabled={isLoading} type="submit">
            <Fingerprint className="mr-2 h-4 w-4" />
            {isLoading ? "パスキーを登録中..." : "パスキーを登録"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          戻る
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PasskeyAuth
