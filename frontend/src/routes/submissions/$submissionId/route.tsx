import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { $api } from "@/lib/api"
import { Label } from "@radix-ui/react-label"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "lucide-react"
import { components } from "openapi/schema"
import { useState } from "react"

type Submission = components["schemas"]["Submission"]
type TestCase = components["schemas"]["TestCase"]

const SubmissionInfo = ({ submission }: { submission: Submission }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-semibold">問題ID</dt>
            <dd>{submission.problem_id}</dd>
          </div>
          <div>
            <dt className="font-semibold">提出ID</dt>
            <dd>{submission.id}</dd>
          </div>
          <div>
            <dt className="font-semibold">提出日時</dt>
            <dd>{submission.submitted_at}</dd>
          </div>
          <div>
            <dt className="font-semibold">学生ID</dt>
            <dd>{submission.student_id}</dd>
          </div>
          <div>
            <dt className="font-semibold">プログラミング言語</dt>
            <dd>{`${submission.language.name} (${submission.language.version})`}</dd>
          </div>
          <div>
            <dt className="font-semibold">全体の結果</dt>
            <dd className="flex items-center">
              {submission.result.status === "Accepted" ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
              )}
              {submission.result.status}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

const CodeWithLineNumbers = ({ code }: { code: string }) => {
  const lines = code.split("\n")
  return (
    <div className="flex">
      <pre className="select-none pr-4 text-right text-gray-500">
        {lines.map((_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </pre>
      <pre className="flex-1">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const SubmissionedCode = ({ submission }: { submission: Submission }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>提出されたコード</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md bg-gray-100 p-4">
          <CodeWithLineNumbers code={submission.code} />
        </div>
      </CardContent>
    </Card>
  )
}

const TestResults = ({
  submission,
  testCases,
}: {
  submission: Submission
  testCases: TestCase[]
}) => {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(() =>
    submission.test_results.map(() => false),
  )

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>テスト結果</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>テストケースID</TableHead>
              <TableHead>結果</TableHead>
              <TableHead>メッセージ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submission.test_results.map(
              (
                TestResults,
                index, // テスト結果とテストケースの順番が対応するかどうか確認
              ) => (
                <>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-100"
                    key={TestResults.test_case_id}
                    onClick={() => toggleOpen(index)}
                  >
                    <TableCell>{TestResults.test_case_id}</TableCell>
                    <TableCell
                      className={
                        TestResults.status === "Passed"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {TestResults.status}
                    </TableCell>
                    <TableCell>{TestResults.message || "-"}</TableCell>
                    <TableCell>
                      {openIndexes[index] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  {openIndexes[index] && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="rounded-md bg-gray-50 p-4">
                          <h4 className="mb-2 font-semibold">入力:</h4>
                          <pre className="mb-4 overflow-x-auto rounded-md bg-white p-2">
                            <code>
                              {testCases && testCases[index]
                                ? testCases[index].input
                                : "データがありません"}
                            </code>
                          </pre>
                          <h4 className="mb-2 font-semibold">正解出力:</h4>
                          <pre className="overflow-x-auto rounded-md bg-white p-2">
                            <code>
                              {testCases && testCases[index]
                                ? testCases[index].output
                                : "データがありません"}
                            </code>
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const Feedback = () => {
  const [feedback, setFeedback] = useState("")

  const handleFeedbackSubmit = async () => {
    // ここでフィードバックを送信する処理を実装する
    console.log("フィードバックを送信: ", feedback)
    setFeedback("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>フィードバック</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="sr-only" htmlFor="feedback">
          フィードバック
        </Label>
        <Textarea
          id="feedback"
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="学生へのフィードバックを入力してください"
          rows={5}
          value={feedback}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleFeedbackSubmit}>フィードバックを送信</Button>
      </CardFooter>
    </Card>
  )
}

const SubmissionDetail = () => {
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
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/admin/submissions">
          <Button size="sm" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            提出一覧に戻る
          </Button>
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">提出詳細</h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
        <div className="order-1 lg:col-span-2">
          <SubmissionInfo submission={data} />
        </div>
        <div className="order-2 lg:order-3 lg:col-span-1">
          <SubmissionedCode submission={data} />
        </div>
        <div className="order-3 lg:col-span-2">
          <TestResults
            submission={data}
            testCases={problemData.data.test_cases}
          />
        </div>
        <div className="order-4 lg:col-span-2">
          <Feedback />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/submissions/$submissionId")({
  component: SubmissionDetail,
})
