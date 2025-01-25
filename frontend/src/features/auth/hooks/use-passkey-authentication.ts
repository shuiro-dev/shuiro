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
 * @returns {{
 *   login: (email: string) => Promise<AuthenticationVerifyResponse>,
 *   isLoading: boolean,
 *   error: Error | null
 * }}
 */
export function usePasskeyAuthentication() {
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

/**
 * ArrayBufferをBase64URL形式の文字列に変換
 * @param {ArrayBuffer | ArrayBufferLike} buffer - 変換対象のバッファ
 * @returns {string} Base64URL形式の文字列
 */
function arrayBufferToBase64(buffer: ArrayBuffer | ArrayBufferLike): string {
  const uint8Array =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return btoa(String.fromCodePoint(...uint8Array))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

/**
 * Base64文字列をArrayBufferに変換
 * @param {string} base64 - Base64形式の文字列
 * @returns {Uint8Array} 変換されたUint8Array
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const standardBase64 = base64
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  const binaryString = atob(standardBase64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = String.prototype.codePointAt.call(binaryString, i) as number
  }
  return bytes
}
