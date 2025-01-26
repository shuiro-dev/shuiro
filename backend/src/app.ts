import { OpenAPIHono } from "@hono/zod-openapi"
import { apiReference } from "@scalar/hono-api-reference"
import { cors } from "hono/cors"

import authApp from "./api/paths/auth"
import problemsApp from "./api/paths/problems"
import submissionsApp from "./api/paths/submissions"
const app = new OpenAPIHono()

app.use(
  "/api/*",
  cors({
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86_400,
    origin: ["https://localhost:5173", "http://localhost:5173"],
  }),
)

export const openApiDocument = {
  info: {
    license: { name: "" },
    title: "Problem and Submission API",
    version: "0.1.0",
  },
  openapi: "3.1.0",
} as const satisfies ReturnType<typeof app.getOpenAPI31Document>

export const routes = app
  .doc("/api/openapi.json", openApiDocument)
  .route("/api", problemsApp)
  .route("/api", submissionsApp)
  .route("/api", authApp)
  .get("/api/docs", apiReference({ spec: { url: "/api/openapi.json" } }))

export type AppType = typeof routes

export default app
