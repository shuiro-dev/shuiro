import type { Context, Next } from "hono"

import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import { jwt, sign } from "hono/jwt"

import { prisma } from "../../db"
import * as schemas from "../components/schemas/auth"

/**
 * 環境設定
 */
const config = {
  /** JWT署名用の秘密鍵 */
  jwtSecret: process.env.JWT_SECRET,
  /** アプリケーションのオリジン */
  origin: process.env.RP_ORIGIN || "https://localhost:5173",
  /** Relying Party ID */
  rpId: process.env.RP_ID || "localhost",
  /** Relying Party名 */
  rpName: process.env.RP_NAME || "Shuiro",
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not set")
}

/**
 * 汎用エラーメッセージ
 */
const AUTH_ERROR = "認証に失敗しました。入力内容をご確認ください。"

/**
 * JWT トークンを生成する
 * @param payload - ペイロードデータ
 * @param payload.role - ユーザーロール
 * @param payload.sub - ユーザーID
 * @returns 生成されたJWTトークン
 */
const createToken = async (payload: {
  role: string
  sub: string
}): Promise<string> => {
  return await sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    config.jwtSecret,
  )
}

/**
 * JWT認証ミドルウェア
 * @param c - Honoコンテキスト
 * @param next - 次のミドルウェア
 * @returns レスポンス
 * @throws {Error} 認証エラー
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const auth = c.req.header("Authorization")
  if (!auth?.startsWith("Bearer ")) {
    return c.json({ error: AUTH_ERROR }, 401)
  }

  try {
    const middleware = jwt({
      secret: config.jwtSecret,
    })

    await middleware(c, async () => {
      const payload = c.get("jwtPayload")
      if (!payload) {
        throw new Error("JWT verification failed")
      }
    })

    const payload = c.get("jwtPayload")
    if (!payload || !payload.sub || !payload.role) {
      return c.json({ error: AUTH_ERROR }, 401)
    }

    await next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return c.json({ error: AUTH_ERROR }, 401)
  }
}

// 認証済みユーザー情報を取得するユーティリティ関数
export const getCurrentUser = (c: Context) => {
  const payload = c.get("jwtPayload")
  if (!payload || !payload.sub || !payload.role) {
    throw new Error("認証情報が不正です")
  }

  return {
    id: payload.sub,
    role: payload.role,
  }
}

/**
 * 特定のロールを要求するミドルウェア
 * @param allowedRoles - 許可するロール
 * @returns ミドルウェア関数
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    try {
      const currentUser = getCurrentUser(c)
      if (!allowedRoles.includes(currentUser.role)) {
        return c.json({ error: AUTH_ERROR }, 403)
      }
      await next()
    } catch (error) {
      console.error("Role verification error:", error)
      return c.json({ error: AUTH_ERROR }, 401)
    }
  }
}

// ルート定義
const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: schemas.UserRegistration,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: schemas.AuthenticationChallenge,
        },
      },
      description: "登録チャレンジの生成",
    },
    400: {
      description: "無効なリクエスト",
    },
  },
  summary: "ユーザー登録の開始",
  tags: ["auth"],
})

const verifyRegistrationRoute = createRoute({
  method: "post",
  path: "/register/verify",
  request: {
    body: {
      content: {
        "application/json": {
          schema: schemas.RegistrationCredential,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: schemas.AuthenticationResponse,
        },
      },
      description: "登録成功とトークン発行",
    },
    400: {
      description: "検証失敗",
    },
  },
  summary: "登録の検証とトークン発行",
  tags: ["auth"],
})

const authenticateRoute = createRoute({
  method: "post",
  path: "/authenticate",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ email: z.string().email() }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: schemas.AuthenticationChallenge,
        },
      },
      description: "認証チャレンジの生成",
    },
    401: {
      description: "認証失敗",
    },
  },
  summary: "認証の開始",
  tags: ["auth"],
})

const verifyAuthenticationRoute = createRoute({
  method: "post",
  path: "/authenticate/verify",
  request: {
    body: {
      content: {
        "application/json": {
          schema: schemas.AuthenticationCredential,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: schemas.AuthenticationResponse,
        },
      },
      description: "認証成功とトークン発行",
    },
    401: {
      description: "認証失敗",
    },
  },
  summary: "認証の検証とトークン発行",
  tags: ["auth"],
})

const app = new OpenAPIHono()
  .openapi(registerRoute, async (c) => {
    const { email, name, role } = c.req.valid("json")

    try {
      // 登録済みユーザーのチェックと新規ユーザー作成を一つのトランザクションで行う
      const user = await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          // 存在チェックの結果を直接返さず、通常の登録フローを続ける
          return existingUser
        }

        const createdUser = await tx.user.create({
          data: { email, name, role },
        })

        if (role === "student") {
          await tx.student.create({
            data: { userId: createdUser.id },
          })
        } else if (role === "teacher") {
          await tx.teacher.create({
            data: { userId: createdUser.id },
          })
        }

        return createdUser
      })

      const options = await generateRegistrationOptions({
        attestationType: "none",
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: true,
          residentKey: "required",
          userVerification: "required",
        },
        rpID: config.rpId,
        rpName: config.rpName,
        userID: Buffer.from(user.id),
        userName: user.email,
      })

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
      await prisma.challenge.create({
        data: {
          challenge: options.challenge,
          expiresAt,
          userId: user.id,
        },
      })

      return c.json(options)
    } catch (error) {
      console.error("Registration error:", error)
      return c.json({ error: AUTH_ERROR }, 400)
    }
  })
  .openapi(verifyRegistrationRoute, async (c) => {
    const credentialData = c.req.valid("json")

    const challenge = await prisma.challenge.findFirst({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      where: {
        expiresAt: { gt: new Date() },
        user: { credentials: { none: {} } },
      },
    })

    if (!challenge) {
      console.log("No valid challenge found")
      return c.json({ error: AUTH_ERROR }, 400)
    }

    if (challenge.expiresAt < new Date()) {
      console.log("Challenge expired")
      return c.json({ error: AUTH_ERROR }, 400)
    }

    try {
      const verification = await verifyRegistrationResponse({
        expectedChallenge: challenge.challenge,
        expectedOrigin: config.origin,
        expectedRPID: config.rpId,
        response: {
          ...credentialData,
          clientExtensionResults: {},
        },
      })

      if (verification.verified && verification.registrationInfo) {
        const { credential } = verification.registrationInfo

        await prisma.credential.create({
          data: {
            counter: credential.counter,
            id: credential.id,
            publicKey: Buffer.from(credential.publicKey),
            userId: challenge.userId,
          },
        })

        const token = await createToken({
          role: challenge.user.role,
          sub: challenge.userId,
        })

        return c.json({ token })
      }
    } catch (error) {
      console.error("Verification Error:", error)
    }

    return c.json({ error: AUTH_ERROR }, 400)
  })
  .openapi(authenticateRoute, async (c) => {
    const { email } = c.req.valid("json")

    try {
      const user = await prisma.user.findUnique({
        include: { credentials: true },
        where: { email },
      })

      // ユーザーが存在しない場合でも同じような応答時間を維持
      if (!user || user.credentials.length === 0) {
        // ダミーのオプションを生成して遅延を作る
        await generateAuthenticationOptions({
          allowCredentials: [],
          rpID: config.rpId,
          userVerification: "required",
        })
        return c.json({ error: AUTH_ERROR }, 401)
      }

      const options = await generateAuthenticationOptions({
        allowCredentials: user.credentials.map((cred) => ({
          id: base64ToBase64URL(cred.id),
          transports: [],
          type: "public-key",
        })),
        rpID: config.rpId,
        userVerification: "required",
      })

      await prisma.challenge.create({
        data: {
          challenge: options.challenge,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          userId: user.id,
        },
      })

      return c.json(options)
    } catch (error) {
      console.error("Authentication error:", error)
      return c.json({ error: AUTH_ERROR }, 401)
    }
  })
  .openapi(verifyAuthenticationRoute, async (c) => {
    const credentialData = c.req.valid("json")

    const userCredential = await prisma.credential.findUnique({
      include: { user: true },
      where: { id: credentialData.id },
    })

    if (!userCredential) {
      return c.json({ error: AUTH_ERROR }, 401)
    }

    const challenge = await prisma.challenge.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        expiresAt: { gt: new Date() },
        userId: userCredential.userId,
      },
    })

    if (!challenge) {
      return c.json({ error: AUTH_ERROR }, 401)
    }

    try {
      const verification = await verifyAuthenticationResponse({
        credential: {
          counter: Number(userCredential.counter),
          id: base64ToBase64URL(userCredential.id),
          publicKey: new Uint8Array(userCredential.publicKey),
          transports: [],
        },
        expectedChallenge: challenge.challenge,
        expectedOrigin: config.origin,
        expectedRPID: config.rpId,
        response: {
          ...credentialData,
          clientExtensionResults: {},
        },
      })

      if (verification.verified) {
        await prisma.credential.update({
          data: { counter: verification.authenticationInfo.newCounter },
          where: { id: userCredential.id },
        })

        const token = await createToken({
          role: userCredential.user.role,
          sub: userCredential.userId,
        })

        return c.json({ token })
      }
    } catch (error) {
      console.error("Verification error:", error)
    }

    return c.json({ error: AUTH_ERROR }, 401)
  })

/**
 * Base64文字列をBase64URL形式に変換する
 * @param base64 - 変換元のBase64文字列
 * @returns Base64URL形式の文字列
 */
const base64ToBase64URL = (base64: string): string => {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

export default Object.assign(app, {
  authMiddleware,
  requireRole,
})
