import { Button } from "@/components/ui/button"
import { $api } from "@/lib/api"
import {
  createLazyFileRoute,
  Link,
  NotFoundRouteComponent,
} from "@tanstack/react-router"
import { toast } from "sonner"

import { ProblemForm } from "../-components/problem-form"

const Problem = () => {
  const { problemId } = Route.useParams()

  const problem = $api.useSuspenseQuery("get", "/api/problems/{problemId}", {
    params: {
      path: {
        problemId: Number.parseInt(problemId),
      },
    },
  })
  const languages = $api.useSuspenseQuery("get", "/api/languages")
  const updateProblem = $api.useMutation("put", "/api/problems/{problemId}")

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">問題の更新</h1>
      <ProblemForm
        availableLanguages={languages.data}
        onSubmit={(values) => {
          updateProblem.mutate({
            body: values,
            params: {
              path: {
                problemId: Number.parseInt(problemId),
              },
            },
          })
          toast("問題を更新しました", {
            closeButton: true,
          })
        }}
        problem={problem.data}
        submitButtonLabel="問題を更新"
        submitButtonSubmittingLabel="問題を更新中..."
      />
    </div>
  )
}

const AdminProblemNotFound: NotFoundRouteComponent = () => {
  const { problemId } = Route.useParams()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Problem not found</h1>
        <p className="text-muted-foreground">
          The problem with ID <code>{problemId}</code> does not exist.
        </p>
      </section>
      <Button asChild variant="link">
        <Link to="/admin/problems">Back to problems</Link>
      </Button>
    </div>
  )
}

export const Route = createLazyFileRoute(
  "/_teacher/admin/problems/$problemId/",
)({
  component: Problem,
  notFoundComponent: AdminProblemNotFound,
})
