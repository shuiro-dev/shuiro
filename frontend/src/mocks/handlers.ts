import { BACKEND_URL } from "@/lib/api"
import { http, HttpResponse } from "msw"

function generateChallenge(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCodePoint(...array))
}

export const handlers = [
  http.post(`${BACKEND_URL}/api/register`, () => {
    return HttpResponse.json({
      challenge: generateChallenge(),
    })
  }),

  http.post(`${BACKEND_URL}/api/register/verify`, () => {
    return HttpResponse.json({
      token: "mock-token-" + Math.random().toString(36).slice(2),
    })
  }),

  http.post(`${BACKEND_URL}/api/authenticate`, () => {
    return HttpResponse.json({
      challenge: generateChallenge(),
    })
  }),

  http.post(`${BACKEND_URL}/api/authenticate/verify`, () => {
    return HttpResponse.json({
      token: "mock-token-" + Math.random().toString(36).slice(2),
    })
  }),
]
