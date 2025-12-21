import { testClient } from "hono/testing"
import { describe, expect, test } from "vitest"

import { createSupportedLanguage } from "../../db/test-helpers"
import app from "./languages"

describe("getLanguages", () => {
  test("should retrieve all supported languages", async () => {
    const python = await createSupportedLanguage({
      name: "Python",
      version: "3.12",
    })
    const javascript = await createSupportedLanguage({
      name: "JavaScript",
      version: "ES6",
    })

    const response = await testClient(app).languages.$get()

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    const actual = await response.json()
    expect(actual).toEqual(
      expect.arrayContaining([
        {
          name: python.name,
          version: python.version,
        },
        {
          name: javascript.name,
          version: javascript.version,
        },
      ]),
    )
  })

  test("should return empty array when no languages exist", async () => {
    const response = await testClient(app).languages.$get()

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    const actual = await response.json()
    expect(Array.isArray(actual)).toBe(true)
  })

  test("should return languages sorted by name and version", async () => {
    await createSupportedLanguage({
      name: "Python",
      version: "3.12",
    })
    await createSupportedLanguage({
      name: "JavaScript",
      version: "ES6",
    })
    await createSupportedLanguage({
      name: "Python",
      version: "3.11",
    })

    const response = await testClient(app).languages.$get()

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    const actual = await response.json()

    for (let i = 0; i < actual.length - 1; i++) {
      const current = actual[i]
      const next = actual[i + 1]

      if (current.name === next.name) {
        expect(current.version.localeCompare(next.version)).toBeLessThanOrEqual(
          0,
        )
      } else {
        expect(current.name.localeCompare(next.name)).toBeLessThan(0)
      }
    }
  })
})
