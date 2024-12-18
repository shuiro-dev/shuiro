import type { ComponentPropsWithoutRef, FC } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog"
import { intlFormatDistance } from "date-fns"
import { CheckIcon, XIcon } from "lucide-react"
import { components } from "openapi/schema"
import { useState } from "react"

import { useProblem } from "../../-hooks/use-problem"

export type SubmissionsProps = ComponentPropsWithoutRef<"div">

type Submission = components["schemas"]["Submission"]

export const Submissions: FC<SubmissionsProps> = ({ className, ...props }) => {
  const { submissions } = useProblem()

  // ダイアログを表示するための状態管理
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<
    Submission | undefined
  >()

  // ダイアログを開く関数
  const openDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsDialogOpen(true)
  }

  // ダイアログを閉じる関数
  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedSubmission(undefined)
  }
  return (
    <div className={cn("grid grid-cols-[auto_1fr_auto]", className)} {...props}>
      {submissions.data?.map((submission, i) => (
        <Button
          className="col-span-3 grid grid-cols-subgrid gap-4"
          key={i}
          onClick={() => openDialog(submission)} // ボタンクリックでダイアログを開く
          size="sm"
          variant="outline"
        >
          <div className="flex flex-row gap-1">
            <StatusIcon status={submission.result.status} />
            <span className="font-semibold">{submission.result.status}</span>
          </div>
          <div className="text-left">{submission.result.message}</div>
          <div className="text-right text-muted-foreground">
            {intlFormatDistance(new Date(submission.submitted_at), new Date())}
          </div>
        </Button>
      ))}
      {/* モーダル */}
      {selectedSubmission && (
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
          <DialogContent
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ maxWidth: "90%", width: "auto" }}
          >
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {/* モーダル内の閉じるボタン */}
              <div className="flex justify-end">
                <button
                  className="text-lg font-semibold text-red-500 hover:text-red-700"
                  onClick={closeDialog}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Submission Details</h2>
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-300 px-4 py-2 text-left">
                        Field
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                        Student ID
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {selectedSubmission.student_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                        Status
                      </td>
                      <td className="flex items-center gap-2 border-b border-gray-300 px-4 py-2">
                        <StatusIcon status={selectedSubmission.result.status} />
                        <span>{selectedSubmission.result.status}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                        Time Ago
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left text-muted-foreground">
                        {intlFormatDistance(
                          new Date(selectedSubmission.submitted_at),
                          new Date(),
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                        Code
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {selectedSubmission.code}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                        Message
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {selectedSubmission.result.message}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

type StatusIconProps = {
  className?: string
  status: Submission["result"]["status"]
}

const StatusIcon: FC<StatusIconProps> = ({ className, status }) => {
  switch (status) {
    case "Accepted": {
      return (
        <CheckIcon
          className={cn("text-green-600 dark:text-green-400", className)}
        />
      )
    }
    default: {
      return (
        <XIcon className={cn("text-red-600 dark:text-red-400", className)} />
      )
    }
  }
}
