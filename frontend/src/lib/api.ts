import type { paths } from "openapi/schema"

import createFetchClient, { Middleware } from "openapi-fetch"
import createQueryClient from "openapi-react-query"

export const BACKEND_URL: string =
  import.meta.env.BACKEND_URL ?? "http://localhost:3000"

const authMiddleware: Middleware = {
  onRequest: async ({ request }) => {
    const token = localStorage.getItem("token")
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`)
    }
  },
}

export class APIError extends Error {
  static {
    this.prototype.name = "APIError"
  }

  public readonly body: object | string
  public readonly message: string
  public readonly status: number
  constructor(status: number, body: object | string) {
    const description = APIError.getDescriptionFromBody(body)
    const message = `${status}: ${description}`
    super(message)
    this.status = status
    this.body = body
    this.message = message
  }

  // todo: Refactor the following logic. Maybe changing the schema of the error response is necessary.
  private static getDescriptionFromBody = (body: object | string): string => {
    if (typeof body === "string") {
      return body
    }
    if (typeof body === "object" && "message" in body) {
      return String(body.message)
    }
    if (
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error != undefined &&
      "issues" in body.error &&
      Array.isArray(body.error.issues) &&
      body.error.issues.length > 0 &&
      typeof body.error.issues[0] === "object" &&
      body.error.issues[0].message != undefined
    ) {
      return body.error.issues[0].message
    }
    return JSON.stringify(body)
  }
}

export const authApi = {
  // 認証フロー
  authenticate: async (email: string) => {
    const res = await fetch("/api/authenticate", {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    if (!res.ok) throw new Error("Authentication failed")
    return res.json()
  },

  // 登録フロー
  register: async (data: {
    email: string
    name: string
    role: "admin" | "student" | "teacher"
  }) => {
    const res = await fetch("/api/register", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    if (!res.ok) throw new Error("Registration failed")
    return res.json()
  },

  verifyAuthentication: async (credential: string) => {
    const res = await fetch("/api/authenticate/verify", {
      body: JSON.stringify(credential),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    if (!res.ok) throw new Error("Authentication verification failed")
    return res.json()
  },

  verifyRegistration: async (credential: string) => {
    const res = await fetch("/api/register/verify", {
      body: JSON.stringify(credential),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    if (!res.ok) throw new Error("Registration verification failed")
    return res.json()
  },
}

/**
 * Middleware that throws an error if the response status is 404 or greater.
 *
 * @see https://openapi-ts.dev/openapi-fetch/middleware-auth#throwing
 * @see https://github.com/openapi-ts/openapi-typescript/blob/ff57082140f8964981eb9db9c042dc34132715ca/packages/openapi-fetch/examples/react-query/src/lib/api/index.ts
 */
const throwOnError: Middleware = {
  onResponse: async ({ response }) => {
    const status = response.status
    if (status >= 400) {
      const body = response.headers.get("content-type")?.includes("json")
        ? await response.clone().json()
        : await response.clone().text()
      throw new APIError(status, body)
    }
  },
}

export const client = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
})
client.use(authMiddleware)
client.use(throwOnError)

export const $api = createQueryClient(client)

export const auth = {
  getToken: () => localStorage.getItem("token"),
  isAuthenticated: () => !!localStorage.getItem("token"),
  removeToken: () => localStorage.removeItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
}
