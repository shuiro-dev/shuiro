import { Button } from "@/components/ui/button"
import { $api } from "@/lib/api"
import { createLazyFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { SubmissionInfo } from "./-components/submission-info"
import { SubmittedCode } from "./-components/submitted-code"
import { TestResults } from "./-components/test-results"

export const SubmissionDetail = () => {
  const submissionId = Number.parseInt(Route.useParams().submissionId)
  const { data } = $api.useSuspenseQuery(
    "get",
    "/api/submissions/{submissionId}",
    { params: { path: { submissionId } } },
  )
  const problemData = $api.useSuspenseQuery(
    "get",
    "/api/problems/{problemId}",
    { params: { path: { problemId: data.problem_id } } },
  )

  return (
    <div className="container mx-auto flex h-screen flex-col p-4">
      <div className="mb-6">
        <Link href="..">
          <Button size="sm" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            提出一覧に戻る
          </Button>
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">提出詳細</h1>
      <div className="flex flex-1 gap-6">
        <div className="flex flex-1 flex-col gap-6">
          <SubmissionInfo submission={data} />
          <TestResults
            submission={data}
            testCases={problemData.data.test_cases}
          />
        </div>
        <SubmittedCode submission={data} />
      </div>
    </div>
  )
}

export const Route = createLazyFileRoute(
  "/_teacher/admin/submissions/$submissionId",
)({
  component: SubmissionDetail,
})