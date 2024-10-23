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
import MonacoEditor from "@monaco-editor/react"
import { Label } from "@radix-ui/react-label"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  XCircle,
} from "lucide-react"
import { components } from "openapi/schema"
import { useState } from "react"

type Submission = components["schemas"]["Submission"]
type TestCase = components["schemas"]["TestCase"]

const SubmissionInfo = ({ submission }: { submission: Submission }) => {
  return (
    <Card className="h-full">
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

const ReadOnlyCodeBlock = ({
  code,
  language,
}: {
  code: string
  language: string
}) => {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      options={{
        lineNumbers: "on",
        minimap: { enabled: false },
        readOnly: true,
        scrollBeyondLastLine: false,
      }}
      value={code}
    />
  )
}

const SubmissionedCode = ({ submission }: { submission: Submission }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(submission.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }
  return (
    <Card className="flex flex-1 flex-col">
      {" "}
      {/* 高さを親の高さに合わせ、flexでレイアウト */}
      <CardHeader>
        <CardTitle>提出されたコード</CardTitle>
        <div className="relative">
          <button
            aria-label="コードをコピー"
            className="absolute right-2 top-2 rounded-md bg-white p-2 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="h-full overflow-x-auto rounded-md bg-gray-100 p-4">
          <ReadOnlyCodeBlock
            code={submission.code}
            language={submission.language.name.toLowerCase()}
          />
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
            {submission.test_results.map((TestResults, index) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const Feedback = () => {
  const [feedback, setFeedback] = useState("")

  const handleFeedbackSubmit = async () => {
    console.log("フィードバックを送信:", feedback)
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
    <div className="container mx-auto flex h-screen flex-col p-4">
      <div className="mb-6">
        <Link href="/admin/submissions">
          <Button size="sm" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            提出一覧に戻る
          </Button>
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">提出詳細</h1>
      <div className="flex flex-1 gap-6">
        <div className="flex flex-1 flex-col">
          <SubmissionInfo submission={data} />
          <TestResults
            submission={data}
            testCases={problemData.data.test_cases}
          />
          <Feedback />
        </div>
        <SubmissionedCode submission={data} />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/submissions/$submissionId")({
  component: SubmissionDetail,
})
