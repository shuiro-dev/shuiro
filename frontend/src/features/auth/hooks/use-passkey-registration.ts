import { client } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { paths } from "openapi/schema"

type RegistrationResponse =
  paths["/api/register"]["post"]["responses"]["200"]["content"]["application/json"]
type RegistrationVerifyResponse =
  paths["/api/register/verify"]["post"]["responses"]["200"]["content"]["application/json"]

export function usePasskeyRegistration() {
  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string
      name: string
      role: "admin" | "student" | "teacher"
    }): Promise<RegistrationResponse> => {
      const { data: responseData, error } = await client.POST("/api/register", {
        body: data,
      })
      if (error) throw error
      if (!responseData)
        throw new Error("サーバーからレスポンスがありませんでした")
      return responseData
    },
  })

  const verifyMutation = useMutation({
    mutationFn: async (
      credential: PublicKeyCredential,
    ): Promise<RegistrationVerifyResponse> => {
      const { data, error } = await client.POST("/api/register/verify", {
        body: {
          id: credential.id,
          rawId: arrayBufferToBase64(credential.rawId),
          response: {
            attestationObject: arrayBufferToBase64(
              (credential.response as AuthenticatorAttestationResponse)
                .attestationObject,
            ),
            clientDataJSON: arrayBufferToBase64(
              credential.response.clientDataJSON,
            ),
          },
          type: "public-key",
        },
      })
      if (error) throw error
      if (!data) throw new Error("サーバーからレスポンスがありませんでした")
      return data
    },
  })

  const register = async (data: {
    email: string
    name: string
    role: "admin" | "student" | "teacher"
  }) => {
    try {
      const response = await registerMutation.mutateAsync(data)

      if (!response.challenge) {
        throw new Error("サーバーからチャレンジが返されませんでした")
      }

      // デバッグ情報を追加
      console.log("Challenge received:", response.challenge)
      console.log("Challenge type:", typeof response.challenge)

      // URLセーフなBase64のバリデーションを追加
      if (!/^[\w-]*={0,2}$/.test(response.challenge)) {
        throw new Error("Invalid Base64 challenge received from server")
      }

      const rpId =
        globalThis.location.hostname === "localhost"
          ? "localhost"
          : globalThis.location.hostname

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          attestation: "none",
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "required",
          },
          challenge: base64ToArrayBuffer(response.challenge),
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          rp: {
            id: rpId,
            name: "Online Judge",
          },
          timeout: 60_000,
          user: {
            displayName: data.name,
            id: new TextEncoder().encode(data.email),
            name: data.email,
          },
        }

      try {
        if (
          globalThis.location.protocol !== "https:" &&
          globalThis.location.hostname !== "localhost"
        ) {
          throw new Error(
            "Passkey の作成には HTTPS または localhost 環境が必要です",
          )
        }

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        })

        if (!credential) {
          throw new Error("認証情報の作成に失敗しました")
        }

        const verifyResult = await verifyMutation.mutateAsync(
          credential as PublicKeyCredential,
        )
        return verifyResult
      } catch (credentialError) {
        console.error("認証情報作成エラー:", credentialError)
        if (credentialError instanceof Error) {
          throw new TypeError(
            `Passkey の作成に失敗しました: ${credentialError.message}`,
          )
        }
        throw new Error(
          "Passkey の作成に失敗しました。ブラウザが Passkey をサポートしているか確認してください。",
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("予期せぬエラーが発生しました")
    }
  }

  return {
    error: registerMutation.error || verifyMutation.error,
    isLoading: registerMutation.isPending || verifyMutation.isPending,
    register,
  }
}

// Base64 URLセーフエンコーディング
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer))
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

// Base64 URLセーフデコーディング
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    // 必要に応じてパディングを追加（4の倍数になるように）
    const padded =
      base64.length % 4 === 0
        ? base64
        : base64.padEnd(base64.length + (4 - (base64.length % 4)), "=")

    // URLセーフなBase64文字列を標準のBase64形式に変換
    const standardBase64 = padded.replaceAll("-", "+").replaceAll("_", "/")

    const binaryString = atob(standardBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer as ArrayBuffer
  } catch (error) {
    console.error("Base64 decoding error:", error)
    console.error("Attempted to decode:", base64)
    throw new Error("Challenge のデコードに失敗しました")
  }
}
