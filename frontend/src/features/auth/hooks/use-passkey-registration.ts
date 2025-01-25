import { client } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { paths } from "openapi/schema"

/**
 * 登録レスポンスの型定義
 * @typedef {Object} RegistrationResponse - OpenAPIスキーマから生成された登録レスポンス型
 */
type RegistrationResponse =
  paths["/api/register"]["post"]["responses"]["200"]["content"]["application/json"]

/**
 * 登録確認レスポンスの型定義
 * @typedef {Object} RegistrationVerifyResponse - OpenAPIスキーマから生成された登録確認レスポンス型
 */
type RegistrationVerifyResponse =
  paths["/api/register/verify"]["post"]["responses"]["200"]["content"]["application/json"]

/**
 * パスキー登録のカスタムフック
 * @returns {{
 *  register: (data: { email: string, name: string, role: "admin" | "student" | "teacher" }) => Promise<RegistrationVerifyResponse>,
 * isLoading: boolean,
 * error: Error | null
 * }}
 */
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

  /**
   * パスキーの登録処理を実行
   * @param {Object} data - 登録に必要なユーザー情報
   * @param {string} data.email - ユーザーのメールアドレス
   * @param {string} data.name - ユーザーの表示名
   * @param {"admin" | "student" | "teacher"} data.role - ユーザーの役割
   * @returns {Promise<RegistrationVerifyResponse>} 登録完了後のレスポンス
   * @throws {Error} 登録処理中にエラーが発生した場合
   */
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
            "Passkey の作成にはHTTPSまたはlocalhost環境が必要です",
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
          "Passkey の作成に失敗しました。ブラウザがPasskeyをサポートしているか確認してください。",
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

/**
 * ArrayBufferをBase64URL形式の文字列に変換
 * @param {ArrayBuffer} buffer - 変換対象のバッファ
 * @returns {string} Base64URL形式の文字列
 * @description バイナリデータをBase64URL形式に変換し、Web APIで使用可能な形式にする
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCodePoint(...new Uint8Array(buffer))
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

/**
 * Base64文字列をArrayBufferに変換
 * @param {string} base64 - Base64形式の文字列
 * @returns {ArrayBuffer} 変換されたArrayBuffer
 * @throws {Error} Base64文字列が無効な場合
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    const padded =
      base64.length % 4 === 0
        ? base64
        : base64.padEnd(base64.length + (4 - (base64.length % 4)), "=")

    const standardBase64 = padded.replaceAll("-", "+").replaceAll("_", "/")

    const binaryString = atob(standardBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = String.prototype.codePointAt.call(binaryString, i) as number
    }
    return bytes.buffer as ArrayBuffer
  } catch (error) {
    console.error("Base64 decoding error:", error)
    console.error("Attempted to decode:", base64)
    throw new Error("Challengeのデコードに失敗しました")
  }
}
