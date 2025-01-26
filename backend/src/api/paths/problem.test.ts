import { z } from "@hono/zod-openapi"
import { testClient } from "hono/testing"
import { describe, expect, test } from "vitest"

import { prisma } from "../../db"
import { createProblem, createSupportedLanguage } from "../../db/test-helpers"
import { ProblemUpdate } from "../components/schemas"
import app from "./problems"

const sortLanguages = (languages: { name: string; version: string }[]) => {
  return [...languages].sort((a, b) =>
    a.name === b.name
      ? a.version.localeCompare(b.version)
      : a.name.localeCompare(b.name),
  )
}

describe("updateProblem", () => {
  test("should update a problem", async () => {
    const python = await createSupportedLanguage({
      name: "Python",
      version: "3.12",
    })
    const javascript = await createSupportedLanguage({
      name: "JavaScript",
      version: "ES6",
    })
    const problem = await createProblem()

    const expected: z.infer<typeof ProblemUpdate> = {
      body: "New Body",
      supported_languages: [
        {
          name: python.name,
          version: python.version,
        },
        {
          name: javascript.name,
          version: javascript.version,
        },
      ],
      test_cases: [
        {
          input: "1",
          output: "1",
        },
        {
          input: "2",
          output: "2",
        },
      ],
      title: "New Title",
    }
    const response = await testClient(app).problems[":problemId"].$put({
      json: expected,
      param: {
        problemId: problem.id.toString(),
      },
    })
    expect(response.status).toBe(200)
    if (response.status !== 200) return // type guard

    const actual = await response.json()
    expect({
      ...actual,
      supported_languages: sortLanguages(actual.supported_languages),
    }).toEqual({
      ...expected,
      id: problem.id,
      supported_languages: sortLanguages(expected.supported_languages),
    })
  })

  test("should update a problem with empty supported languages", async () => {
    const problem = await createProblem()

    const expected: z.infer<typeof ProblemUpdate> = {
      body: "New Body",
      supported_languages: [],
      test_cases: [],
      title: "New Title",
    }
    const response = await testClient(app).problems[":problemId"].$put({
      json: expected,
      param: {
        problemId: problem.id.toString(),
      },
    })
    expect(response.status).toBe(200)
    if (response.status !== 200) return // type guard

    const actual = await response.json()
    expect(actual).toEqual({
      ...expected,
      id: problem.id,
    })
  })

  test("should update a problem with empty test cases", async () => {
    const problem = await createProblem()

    const expected: z.infer<typeof ProblemUpdate> = {
      body: "New Body",
      supported_languages: [],
      test_cases: [],
      title: "New Title",
    }
    const response = await testClient(app).problems[":problemId"].$put({
      json: expected,
      param: {
        problemId: problem.id.toString(),
      },
    })
    expect(response.status).toBe(200)
    if (response.status !== 200) return // type guard

    const actual = await response.json()
    expect(actual).toEqual({
      ...expected,
      id: problem.id,
    })
  })

  test("should update only changed fields", async () => {
    const python = await createSupportedLanguage({
      name: "Python",
      version: "3.12",
    })
    const javascript = await createSupportedLanguage({
      name: "JavaScript",
      version: "ES6",
    })
    const problem = await createProblem({
      supportedLanguages: {
        create: [
          {
            language: {
              connect: {
                name_version: {
                  name: python.name,
                  version: python.version,
                },
              },
            },
          },
        ],
      },
      testCases: {
        create: [
          {
            input: "1",
            output: "1",
          },
        ],
      },
    })

    const expected: z.infer<typeof ProblemUpdate> = {
      body: "New Body",
      supported_languages: [
        {
          name: python.name,
          version: python.version,
        },
        {
          name: javascript.name,
          version: javascript.version,
        },
      ],
      test_cases: [
        {
          input: "1",
          output: "1",
        },
        {
          input: "2",
          output: "2",
        },
      ],
      title: "New Title",
    }
    const response = await testClient(app).problems[":problemId"].$put({
      json: expected,
      param: {
        problemId: problem.id.toString(),
      },
    })
    expect(response.status).toBe(200)
    if (response.status !== 200) return

    const actual = await response.json()
    expect({
      ...actual,
      supported_languages: sortLanguages(actual.supported_languages),
    }).toEqual({
      ...expected,
      id: problem.id,
      supported_languages: sortLanguages(expected.supported_languages),
    })

    const updatedProblem = await prisma.problem.findUnique({
      include: {
        supportedLanguages: {
          include: {
            language: true,
          },
        },
        testCases: true,
      },
      where: {
        id: problem.id,
      },
    })

    expect(updatedProblem).not.toBeNull()
    if (!updatedProblem) return

    const originalLanguage = updatedProblem.supportedLanguages.find(
      (lang) =>
        lang.language.name === python.name &&
        lang.language.version === python.version,
    )

    expect(originalLanguage).toBeDefined()
    expect({
      name: originalLanguage?.language.name,
      version: originalLanguage?.language.version,
    }).toEqual({
      name: python.name,
      version: python.version,
    })

    const newLanguage = updatedProblem.supportedLanguages.find(
      (lang) =>
        lang.language.name === javascript.name &&
        lang.language.version === javascript.version,
    )

    expect(newLanguage).toBeDefined()
    expect({
      name: newLanguage?.language.name,
      version: newLanguage?.language.version,
    }).toEqual({
      name: javascript.name,
      version: javascript.version,
    })
  })

  test("should return 404 if problem not found", async () => {
    const response = await testClient(app).problems[":problemId"].$put({
      json: {
        body: "New Body",
        supported_languages: [],
        test_cases: [],
        title: "New Title",
      },
      param: {
        problemId: "1",
      },
    })
    expect(response.status).toBe(404)
  })
})

describe("getProblem", () => {
  test("should retrieve a problem by ID", async () => {
    const problem = await createProblem()
    const response = await testClient(app).problems[":problemId"].$get({
      param: {
        problemId: problem.id.toString(),
      },
    })

    expect(response.status).toBe(200)
    if (response.status !== 200) return // type guard

    const actual = await response.json()
    expect(actual).toEqual({
      body: problem.body,
      id: problem.id,
      supported_languages: sortLanguages(
        problem.supportedLanguages.map(({ languageName, languageVersion }) => ({
          name: languageName,
          version: languageVersion,
        })),
      ),
      test_cases: problem.testCases,
      title: problem.title,
    } satisfies typeof actual)
  })

  test("should return 404 if problem not found", async () => {
    const problemCount = await prisma.problem.count()
    const response = await testClient(app).problems[":problemId"].$get({
      param: {
        problemId: (problemCount + 1).toString(),
      },
    })
    expect(response.status).toBe(404)
  })
})
