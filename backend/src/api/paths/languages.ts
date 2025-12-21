import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

import { prisma } from "../../db"
import * as schemas from "../components/schemas"

const getLanguagesRoute = createRoute({
  method: "get",
  operationId: "getLanguages",
  path: "/languages",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(schemas.Language),
        },
      },
      description: "利用可能なプログラミング言語の一覧",
    },
  },
  summary: "利用可能なプログラミング言語の一覧を取得する",
  tags: ["languages"],
})

const app = new OpenAPIHono().openapi(getLanguagesRoute, async (c) => {
  const languages = await prisma.supportedLanguage.findMany({
    orderBy: [{ name: "asc" }, { version: "asc" }],
  })

  const formattedLanguages = languages.map((lang) => ({
    name: lang.name,
    version: lang.version,
  }))

  return c.json(formattedLanguages, 200)
})

export default app
