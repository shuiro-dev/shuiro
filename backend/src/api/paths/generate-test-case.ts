import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

import { evaluateDSL } from "../../services/dsl"
import { run } from "../../services/program/run"

function formatGeneratedInput(input: unknown): string {
  if (Array.isArray(input)) {
    // 配列の場合は、各要素を再帰的に文字列化してスペース区切りでjoin
    return input.map((el) => formatGeneratedInput(el)).join(" ")
  } else if (typeof input === "string") {
    // 文字列ならそのまま
    return input
  } else if (typeof input === "number") {
    // 数値なら文字列化
    return String(input)
  } else {
    // その他(オブジェクトなど)は、とりあえずString()で文字列化
    return String(input)
  }
}

const generateTestCase = createRoute({
  method: "post",
  operationId: "generateTestCase",
  path: "/generate-test-case",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string(),
            count: z.number().min(1).default(1),
            inputStatus: z.string(),
            language: z.object({
              name: z.string(),
              version: z.string(),
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            results: z.array(
              z.object({
                input: z.string(),
                output: z.string(),
              }),
            ),
          }),
        },
      },
      description: "生成したテストケースの配列",
    },
  },
  summary: "コードを実行し、生成した複数のテストケースを返す",
  tags: ["code"],
})

const app = new OpenAPIHono().openapi(generateTestCase, async (c) => {
  const { code, count, inputStatus, language } = c.req.valid("json")

  const inputGenerator = evaluateDSL(inputStatus)

  const results = []
  for (let i = 0; i < count; i++) {
    const generatedInput = inputGenerator()
    const finalInput = formatGeneratedInput(generatedInput)

    const result = await run({ code, input: finalInput, language })
    results.push({
      input: finalInput,
      output: result.stdout,
    })
  }

  return c.json({ results }, 200)
})

export default app
