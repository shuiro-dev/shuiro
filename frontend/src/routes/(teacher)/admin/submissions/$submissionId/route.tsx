import { $api, APIError } from "@/lib/api"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/(teacher)/admin/submissions/$submissionId",
)({
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData(
        $api.queryOptions("get", "/api/submissions/{submissionId}", {
          params: {
            path: { submissionId: Number.parseInt(params.submissionId) },
          },
        }),
      )
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        throw notFound({
          routeId: "/(teacher)/admin/submissions/$submissionId",
        })
      }
      throw error
    }
  },
})
