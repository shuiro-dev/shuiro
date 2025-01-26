import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "@/features/auth/hooks/utils"
import { client } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { paths } from "openapi/schema"

// OpenAPIスキーマから生成された型を使用
type AuthenticationResponse = {
  allowCredentials?: {
    id: string
    transports?: string[]
    type: string
  }[]
  challenge: string
}
type AuthenticationVerifyResponse =
  paths["/api/authenticate/verify"]["post"]["responses"]["200"]["content"]["application/json"]

/**
 * パスキー認証のカスタムフック
 */
export const usePasskeyAuthentication = (): {
  error: Error | null
  isLoading: boolean
  login: (email: string) => Promise<AuthenticationVerifyResponse>
} => {
  const authMutation = useMutation({
    mutationFn: async (email: string): Promise<AuthenticationResponse> => {
      const { data, error } = await client.POST("/api/authenticate", {
        body: { email },
      })
      if (error) throw error
      if (!data) throw new Error("No response data")
      return data
    },
  })

  const verifyMutation = useMutation({
    mutationFn: async (
      credential: PublicKeyCredential,
    ): Promise<AuthenticationVerifyResponse> => {
      const { data, error } = await client.POST("/api/authenticate/verify", {
        body: {
          id: credential.id,
          rawId: arrayBufferToBase64(credential.rawId),
          response: {
            authenticatorData: arrayBufferToBase64(
              (credential.response as AuthenticatorAssertionResponse)
                .authenticatorData,
            ),
            clientDataJSON: arrayBufferToBase64(
              credential.response.clientDataJSON,
            ),
            signature: arrayBufferToBase64(
              (credential.response as AuthenticatorAssertionResponse).signature,
            ),
            userHandle: (credential.response as AuthenticatorAssertionResponse)
              .userHandle
              ? arrayBufferToBase64(
                  (credential.response as AuthenticatorAssertionResponse)
                    .userHandle as ArrayBufferLike,
                )
              : undefined,
          },
          type: credential.type as "public-key",
        },
      })
      if (error) throw error
      if (!data) throw new Error("No response data")
      return data
    },
  })

  const login = async (email: string) => {
    try {
      const response = await authMutation.mutateAsync(email)

      if (!response.challenge) {
        throw new Error("Challenge is missing from the response")
      }

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge: base64ToArrayBuffer(response.challenge),
          rpId:
            globalThis.location.hostname === "localhost"
              ? "localhost"
              : globalThis.location.hostname,
          timeout: 60_000,
          userVerification: "required",
        }

      // allowCredentialsが存在する場合のみ追加
      if (response.allowCredentials) {
        publicKeyCredentialRequestOptions.allowCredentials =
          response.allowCredentials.map((cred) => ({
            id: base64ToArrayBuffer(cred.id),
            transports: (cred.transports || []) as AuthenticatorTransport[],
            type: "public-key" as const,
          }))
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })

      if (!credential) {
        throw new Error("認証情報の取得に失敗しました")
      }

      return await verifyMutation.mutateAsync(credential as PublicKeyCredential)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error)
        throw new Error(`ログインに失敗しました: ${error.message}`)
      }
      throw error
    }
  }

  return {
    error: authMutation.error || verifyMutation.error,
    isLoading: authMutation.isPending || verifyMutation.isPending,
    login,
  }
}
