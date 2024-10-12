/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"

// Create Virtual Routes

const IndexLazyImport = createFileRoute("/")()
const ProblemsProblemIdRouteLazyImport = createFileRoute(
  "/problems/$problemId",
)()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/index.lazy").then((d) => d.Route))

const ProblemsProblemIdRouteLazyRoute = ProblemsProblemIdRouteLazyImport.update(
  {
    path: "/problems/$problemId",
    getParentRoute: () => rootRoute,
  } as any,
).lazy(() =>
  import("./routes/problems/$problemId/route.lazy").then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    "/problems/$problemId": {
      id: "/problems/$problemId"
      path: "/problems/$problemId"
      fullPath: "/problems/$problemId"
      preLoaderRoute: typeof ProblemsProblemIdRouteLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexLazyRoute
  "/problems/$problemId": typeof ProblemsProblemIdRouteLazyRoute
}

export interface FileRoutesByTo {
  "/": typeof IndexLazyRoute
  "/problems/$problemId": typeof ProblemsProblemIdRouteLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/": typeof IndexLazyRoute
  "/problems/$problemId": typeof ProblemsProblemIdRouteLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: "/" | "/problems/$problemId"
  fileRoutesByTo: FileRoutesByTo
  to: "/" | "/problems/$problemId"
  id: "__root__" | "/" | "/problems/$problemId"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  ProblemsProblemIdRouteLazyRoute: typeof ProblemsProblemIdRouteLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  ProblemsProblemIdRouteLazyRoute: ProblemsProblemIdRouteLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/problems/$problemId"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/problems/$problemId": {
      "filePath": "problems/$problemId/route.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
