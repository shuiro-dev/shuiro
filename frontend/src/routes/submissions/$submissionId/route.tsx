import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { $api } from "@/lib/api"
import { Label } from "@radix-ui/react-label"
import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle, XCircle } from "lucide-react"
import { components } from "openapi/schema"
import { useState } from "react"

type Submission = components["schemas"]["Submission"]

const SubmissionInfo = ({ submission }: { submission: Submission }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="font-semibold">問題ID</dt>
            <dd>{submission.problem_id}</dd>
          </div>
          <div>
            <dt className="font-semibold">提出ID</dt>
            <dd>{submission.id}</dd>
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
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              {submission.result.status}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

const SubmissionedCode = ({ submission }: { submission: Submission }) => {
  return  (  
    <Card>
      <CardHeader>
        <CardTitle>提出されたコード</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto ">
          <code>{submission.code}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

const TestResults = ({ submission }: { submission: Submission}) => {
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
            {submission.test_results.map((TestResults) => (
              <TableRow key={TestResults.test_case_id}>
                <TableCell>{TestResults.test_case_id}</TableCell>
                <TableCell className={TestResults.status === "Passed" ? "text-green-500" : "text-red-500"}>
                  {TestResults.status}
                </TableCell>
                <TableCell>{TestResults.message || '-'}</TableCell>
              </TableRow>
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
  const submissionId= Number.parseInt(Route.useParams().submissionId)
  const { data } = $api.useSuspenseQuery("get", "/api/submissions/{submissionId}", { params: { path: { submissionId } } })
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        提出詳細
      </h1>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        <div className="order-1 lg:col-span-2">
          <SubmissionInfo submission={data} />
        </div>
        <div className="order-2 lg:order-3 lg:col-span-1">
          <SubmissionedCode submission={data} />
        </div>
        <div className="order-3 lg:col-span-2">
          <TestResults submission={data} />
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
