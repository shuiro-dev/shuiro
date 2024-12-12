import { $api, APIError } from "@/lib/api"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(student)/problems")({
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(
        $api.queryOptions("get", "/api/problems", {
          params: {},
        }),
      )
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        throw notFound({ routeId: "/(student)/problems" })
      }
      throw error
    }
  },
})
