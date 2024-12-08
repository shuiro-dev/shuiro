/* prettier-ignore-start */

/* eslint-disable unicorn/no-abusive-eslint-disable */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as studentProblemsProblemIdRouteImport } from "./routes/(student)/problems/$problemId/route"
import { Route as teacherAdminSubmissionsSubmissionIdRouteImport } from "./routes/(teacher)/admin/submissions/$submissionId/route"
import { Route as teacherAdminProblemsProblemIdIndexImport } from "./routes/(teacher)/admin/problems/$problemId/index"

// Create Virtual Routes

const teacherRouteLazyImport = createFileRoute("/(teacher)")()
const studentRouteLazyImport = createFileRoute("/(student)")()
const studentProblemsIndexLazyImport = createFileRoute("/(student)/problems/")()
const studentdashboardIndexLazyImport = createFileRoute(
  "/(student)/(dashboard)/",
)()
const teacherAdminSubmissionsIndexLazyImport = createFileRoute(
  "/(teacher)/admin/submissions/",
)()
const teacherAdminProblemsIndexLazyImport = createFileRoute(
  "/(teacher)/admin/problems/",
)()
const teacherAdmindashboardIndexLazyImport = createFileRoute(
  "/(teacher)/admin/(dashboard)/",
)()

// Create/Update Routes

const teacherRouteLazyRoute = teacherRouteLazyImport
  .update({
    id: "/(teacher)",
    path: "/",
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import("./routes/(teacher)/route.lazy").then((d) => d.Route))

const studentRouteLazyRoute = studentRouteLazyImport
  .update({
    id: "/(student)",
    path: "/",
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import("./routes/(student)/route.lazy").then((d) => d.Route))

const studentProblemsIndexLazyRoute = studentProblemsIndexLazyImport
  .update({
    id: "/problems/",
    path: "/problems/",
    getParentRoute: () => studentRouteLazyRoute,
  } as any)
  .lazy(() =>
    import("./routes/(student)/problems/index.lazy").then((d) => d.Route),
  )

const studentdashboardIndexLazyRoute = studentdashboardIndexLazyImport
  .update({
    id: "/(dashboard)/",
    path: "/",
    getParentRoute: () => studentRouteLazyRoute,
  } as any)
  .lazy(() =>
    import("./routes/(student)/(dashboard)/index.lazy").then((d) => d.Route),
  )

const studentProblemsProblemIdRouteRoute = studentProblemsProblemIdRouteImport
  .update({
    id: "/problems/$problemId",
    path: "/problems/$problemId",
    getParentRoute: () => studentRouteLazyRoute,
  } as any)
  .lazy(() =>
    import("./routes/(student)/problems/$problemId/route.lazy").then(
      (d) => d.Route,
    ),
  )

const teacherAdminSubmissionsIndexLazyRoute =
  teacherAdminSubmissionsIndexLazyImport
    .update({
      id: "/admin/submissions/",
      path: "/admin/submissions/",
      getParentRoute: () => teacherRouteLazyRoute,
    } as any)
    .lazy(() =>
      import("./routes/(teacher)/admin/submissions/index.lazy").then(
        (d) => d.Route,
      ),
    )

const teacherAdminProblemsIndexLazyRoute = teacherAdminProblemsIndexLazyImport
  .update({
    id: "/admin/problems/",
    path: "/admin/problems/",
    getParentRoute: () => teacherRouteLazyRoute,
  } as any)
  .lazy(() =>
    import("./routes/(teacher)/admin/problems/index.lazy").then((d) => d.Route),
  )

const teacherAdmindashboardIndexLazyRoute = teacherAdmindashboardIndexLazyImport
  .update({
    id: "/admin/(dashboard)/",
    path: "/admin/",
    getParentRoute: () => teacherRouteLazyRoute,
  } as any)
  .lazy(() =>
    import("./routes/(teacher)/admin/(dashboard)/index.lazy").then(
      (d) => d.Route,
    ),
  )

const teacherAdminSubmissionsSubmissionIdRouteRoute =
  teacherAdminSubmissionsSubmissionIdRouteImport
    .update({
      id: "/admin/submissions/$submissionId",
      path: "/admin/submissions/$submissionId",
      getParentRoute: () => teacherRouteLazyRoute,
    } as any)
    .lazy(() =>
      import(
        "./routes/(teacher)/admin/submissions/$submissionId/route.lazy"
      ).then((d) => d.Route),
    )

const teacherAdminProblemsProblemIdIndexRoute =
  teacherAdminProblemsProblemIdIndexImport
    .update({
      id: "/admin/problems/$problemId/",
      path: "/admin/problems/$problemId/",
      getParentRoute: () => teacherRouteLazyRoute,
    } as any)
    .lazy(() =>
      import("./routes/(teacher)/admin/problems/$problemId/index.lazy").then(
        (d) => d.Route,
      ),
    )

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/(student)": {
      id: "/(student)"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof studentRouteLazyImport
      parentRoute: typeof rootRoute
    }
    "/(teacher)": {
      id: "/(teacher)"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof teacherRouteLazyImport
      parentRoute: typeof rootRoute
    }
    "/(student)/problems/$problemId": {
      id: "/(student)/problems/$problemId"
      path: "/problems/$problemId"
      fullPath: "/problems/$problemId"
      preLoaderRoute: typeof studentProblemsProblemIdRouteImport
      parentRoute: typeof studentRouteLazyImport
    }
    "/(student)/(dashboard)/": {
      id: "/(student)/(dashboard)/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof studentdashboardIndexLazyImport
      parentRoute: typeof studentRouteLazyImport
    }
    "/(student)/problems/": {
      id: "/(student)/problems/"
      path: "/problems"
      fullPath: "/problems"
      preLoaderRoute: typeof studentProblemsIndexLazyImport
      parentRoute: typeof studentRouteLazyImport
    }
    "/(teacher)/admin/submissions/$submissionId": {
      id: "/(teacher)/admin/submissions/$submissionId"
      path: "/admin/submissions/$submissionId"
      fullPath: "/admin/submissions/$submissionId"
      preLoaderRoute: typeof teacherAdminSubmissionsSubmissionIdRouteImport
      parentRoute: typeof teacherRouteLazyImport
    }
    "/(teacher)/admin/(dashboard)/": {
      id: "/(teacher)/admin/(dashboard)/"
      path: "/admin"
      fullPath: "/admin"
      preLoaderRoute: typeof teacherAdmindashboardIndexLazyImport
      parentRoute: typeof teacherRouteLazyImport
    }
    "/(teacher)/admin/problems/": {
      id: "/(teacher)/admin/problems/"
      path: "/admin/problems"
      fullPath: "/admin/problems"
      preLoaderRoute: typeof teacherAdminProblemsIndexLazyImport
      parentRoute: typeof teacherRouteLazyImport
    }
    "/(teacher)/admin/submissions/": {
      id: "/(teacher)/admin/submissions/"
      path: "/admin/submissions"
      fullPath: "/admin/submissions"
      preLoaderRoute: typeof teacherAdminSubmissionsIndexLazyImport
      parentRoute: typeof teacherRouteLazyImport
    }
    "/(teacher)/admin/problems/$problemId/": {
      id: "/(teacher)/admin/problems/$problemId/"
      path: "/admin/problems/$problemId"
      fullPath: "/admin/problems/$problemId"
      preLoaderRoute: typeof teacherAdminProblemsProblemIdIndexImport
      parentRoute: typeof teacherRouteLazyImport
    }
  }
}

// Create and export the route tree

interface studentRouteLazyRouteChildren {
  studentProblemsProblemIdRouteRoute: typeof studentProblemsProblemIdRouteRoute
  studentdashboardIndexLazyRoute: typeof studentdashboardIndexLazyRoute
  studentProblemsIndexLazyRoute: typeof studentProblemsIndexLazyRoute
}

const studentRouteLazyRouteChildren: studentRouteLazyRouteChildren = {
  studentProblemsProblemIdRouteRoute: studentProblemsProblemIdRouteRoute,
  studentdashboardIndexLazyRoute: studentdashboardIndexLazyRoute,
  studentProblemsIndexLazyRoute: studentProblemsIndexLazyRoute,
}

const studentRouteLazyRouteWithChildren =
  studentRouteLazyRoute._addFileChildren(studentRouteLazyRouteChildren)

interface teacherRouteLazyRouteChildren {
  teacherAdminSubmissionsSubmissionIdRouteRoute: typeof teacherAdminSubmissionsSubmissionIdRouteRoute
  teacherAdmindashboardIndexLazyRoute: typeof teacherAdmindashboardIndexLazyRoute
  teacherAdminProblemsIndexLazyRoute: typeof teacherAdminProblemsIndexLazyRoute
  teacherAdminSubmissionsIndexLazyRoute: typeof teacherAdminSubmissionsIndexLazyRoute
  teacherAdminProblemsProblemIdIndexRoute: typeof teacherAdminProblemsProblemIdIndexRoute
}

const teacherRouteLazyRouteChildren: teacherRouteLazyRouteChildren = {
  teacherAdminSubmissionsSubmissionIdRouteRoute:
    teacherAdminSubmissionsSubmissionIdRouteRoute,
  teacherAdmindashboardIndexLazyRoute: teacherAdmindashboardIndexLazyRoute,
  teacherAdminProblemsIndexLazyRoute: teacherAdminProblemsIndexLazyRoute,
  teacherAdminSubmissionsIndexLazyRoute: teacherAdminSubmissionsIndexLazyRoute,
  teacherAdminProblemsProblemIdIndexRoute:
    teacherAdminProblemsProblemIdIndexRoute,
}

const teacherRouteLazyRouteWithChildren =
  teacherRouteLazyRoute._addFileChildren(teacherRouteLazyRouteChildren)

export interface FileRoutesByFullPath {
  "/": typeof studentdashboardIndexLazyRoute
  "/problems/$problemId": typeof studentProblemsProblemIdRouteRoute
  "/problems": typeof studentProblemsIndexLazyRoute
  "/admin/submissions/$submissionId": typeof teacherAdminSubmissionsSubmissionIdRouteRoute
  "/admin": typeof teacherAdmindashboardIndexLazyRoute
  "/admin/problems": typeof teacherAdminProblemsIndexLazyRoute
  "/admin/submissions": typeof teacherAdminSubmissionsIndexLazyRoute
  "/admin/problems/$problemId": typeof teacherAdminProblemsProblemIdIndexRoute
}

export interface FileRoutesByTo {
  "/": typeof studentdashboardIndexLazyRoute
  "/problems/$problemId": typeof studentProblemsProblemIdRouteRoute
  "/problems": typeof studentProblemsIndexLazyRoute
  "/admin/submissions/$submissionId": typeof teacherAdminSubmissionsSubmissionIdRouteRoute
  "/admin": typeof teacherAdmindashboardIndexLazyRoute
  "/admin/problems": typeof teacherAdminProblemsIndexLazyRoute
  "/admin/submissions": typeof teacherAdminSubmissionsIndexLazyRoute
  "/admin/problems/$problemId": typeof teacherAdminProblemsProblemIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/(student)": typeof studentRouteLazyRouteWithChildren
  "/(teacher)": typeof teacherRouteLazyRouteWithChildren
  "/(student)/problems/$problemId": typeof studentProblemsProblemIdRouteRoute
  "/(student)/(dashboard)/": typeof studentdashboardIndexLazyRoute
  "/(student)/problems/": typeof studentProblemsIndexLazyRoute
  "/(teacher)/admin/submissions/$submissionId": typeof teacherAdminSubmissionsSubmissionIdRouteRoute
  "/(teacher)/admin/(dashboard)/": typeof teacherAdmindashboardIndexLazyRoute
  "/(teacher)/admin/problems/": typeof teacherAdminProblemsIndexLazyRoute
  "/(teacher)/admin/submissions/": typeof teacherAdminSubmissionsIndexLazyRoute
  "/(teacher)/admin/problems/$problemId/": typeof teacherAdminProblemsProblemIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | "/"
    | "/problems/$problemId"
    | "/problems"
    | "/admin/submissions/$submissionId"
    | "/admin"
    | "/admin/problems"
    | "/admin/submissions"
    | "/admin/problems/$problemId"
  fileRoutesByTo: FileRoutesByTo
  to:
    | "/"
    | "/problems/$problemId"
    | "/problems"
    | "/admin/submissions/$submissionId"
    | "/admin"
    | "/admin/problems"
    | "/admin/submissions"
    | "/admin/problems/$problemId"
  id:
    | "__root__"
    | "/(student)"
    | "/(teacher)"
    | "/(student)/problems/$problemId"
    | "/(student)/(dashboard)/"
    | "/(student)/problems/"
    | "/(teacher)/admin/submissions/$submissionId"
    | "/(teacher)/admin/(dashboard)/"
    | "/(teacher)/admin/problems/"
    | "/(teacher)/admin/submissions/"
    | "/(teacher)/admin/problems/$problemId/"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  studentRouteLazyRoute: typeof studentRouteLazyRouteWithChildren
  teacherRouteLazyRoute: typeof teacherRouteLazyRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  studentRouteLazyRoute: studentRouteLazyRouteWithChildren,
  teacherRouteLazyRoute: teacherRouteLazyRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(student)",
        "/(teacher)"
      ]
    },
    "/(student)": {
      "filePath": "(student)/route.lazy.tsx",
      "children": [
        "/(student)/problems/$problemId",
        "/(student)/(dashboard)/",
        "/(student)/problems/"
      ]
    },
    "/(teacher)": {
      "filePath": "(teacher)/route.lazy.tsx",
      "children": [
        "/(teacher)/admin/submissions/$submissionId",
        "/(teacher)/admin/(dashboard)/",
        "/(teacher)/admin/problems/",
        "/(teacher)/admin/submissions/",
        "/(teacher)/admin/problems/$problemId/"
      ]
    },
    "/(student)/problems/$problemId": {
      "filePath": "(student)/problems/$problemId/route.tsx",
      "parent": "/(student)"
    },
    "/(student)/(dashboard)/": {
      "filePath": "(student)/(dashboard)/index.lazy.tsx",
      "parent": "/(student)"
    },
    "/(student)/problems/": {
      "filePath": "(student)/problems/index.lazy.tsx",
      "parent": "/(student)"
    },
    "/(teacher)/admin/submissions/$submissionId": {
      "filePath": "(teacher)/admin/submissions/$submissionId/route.tsx",
      "parent": "/(teacher)"
    },
    "/(teacher)/admin/(dashboard)/": {
      "filePath": "(teacher)/admin/(dashboard)/index.lazy.tsx",
      "parent": "/(teacher)"
    },
    "/(teacher)/admin/problems/": {
      "filePath": "(teacher)/admin/problems/index.lazy.tsx",
      "parent": "/(teacher)"
    },
    "/(teacher)/admin/submissions/": {
      "filePath": "(teacher)/admin/submissions/index.lazy.tsx",
      "parent": "/(teacher)"
    },
    "/(teacher)/admin/problems/$problemId/": {
      "filePath": "(teacher)/admin/problems/$problemId/index.tsx",
      "parent": "/(teacher)"
    }
  }
}
ROUTE_MANIFEST_END */
