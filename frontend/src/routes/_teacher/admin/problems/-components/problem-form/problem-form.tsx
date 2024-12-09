import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MarkdownEditor } from "@/features/markdown-editor"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { valibotValidator } from "@tanstack/valibot-form-adapter"
import { Trash2Icon } from "lucide-react"
import { FC } from "react"
import * as v from "valibot"

import { DataTable } from "./data-table"
import { FieldInfo } from "./field-info"
import { SubmitButton } from "./submit-button"

const problemSchema = v.object({
  body: v.string(),
  supported_languages: v.pipe(
    v.array(
      v.object({
        name: v.string(),
        version: v.string(),
      }),
    ),
    v.checkItems(
      (item, index, array) =>
        array.findIndex(
          (i) => i.name === item.name && i.version === item.version,
        ) === index,
      "Duplicate languages are not allowed",
    ),
  ),
  test_cases: v.pipe(
    v.array(
      v.object({
        input: v.string(),
        output: v.string(),
      }),
    ),
    v.checkItems(
      (item, index, array) =>
        array.findIndex(
          (i) => i.input === item.input && i.output === item.output,
        ) === index,
      "Duplicate test cases are not allowed",
    ),
  ),
  title: v.pipe(v.string(), v.nonEmpty("Title is required")),
})

export type ProblemFormProps = {
  onSubmit: (values: Problem) => void
  problem: Problem
  submitButtonLabel: string
  submitButtonSubmittingLabel: string
}

type Problem = v.InferInput<typeof problemSchema>

export const ProblemForm: FC<ProblemFormProps> = ({
  onSubmit,
  problem,
  submitButtonLabel,
  submitButtonSubmittingLabel,
}) => {
  const form = useForm({
    defaultValues: problem,
    onSubmit: (values) => {
      console.log(values.value)
      onSubmit(values.value)
    },
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: problemSchema,
    },
  })

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>問題のタイトル</Label>
            <Input
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive",
              )}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name="body">
        {(field) => (
          <div
            className={cn(
              "space-y-2",
              field.state.meta.errors.length > 0 && "border-destructive",
            )}
          >
            <Label htmlFor={field.name}>問題文</Label>
            <MarkdownEditor
              className="h-[600px] md:h-[400px]"
              id={field.name}
              onBlur={field.handleBlur}
              setSource={field.handleChange}
              source={field.state.value}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <div>
        <h2 className="mb-4 text-lg font-semibold">テストケース</h2>
        <form.Field mode="array" name="test_cases">
          {(testCases) => (
            <>
              <DataTable
                columns={[
                  {
                    accessorKey: "input",
                    cell: ({ row }) => (
                      <form.Field
                        key={row.index}
                        name={`test_cases[${row.index}].input`}
                      >
                        {(field) => (
                          <>
                            <Textarea
                              className={cn(
                                "min-h-fit font-mono",
                                field.state.meta.errors.length > 0 &&
                                  "border-destructive",
                              )}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Input"
                              rows={1}
                              spellCheck="false"
                              value={field.state.value}
                              wrap="off"
                            />
                            <FieldInfo field={field} />
                          </>
                        )}
                      </form.Field>
                    ),
                    header: "Input",
                  },
                  {
                    accessorKey: "output",
                    cell: ({ row }) => (
                      <form.Field
                        key={row.index}
                        name={`test_cases[${row.index}].output`}
                      >
                        {(field) => (
                          <>
                            <Textarea
                              className={cn(
                                "min-h-fit font-mono",
                                field.state.meta.errors.length > 0 &&
                                  "border-destructive",
                              )}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Expected output"
                              rows={1}
                              spellCheck="false"
                              value={field.state.value}
                              wrap="off"
                            />
                            <FieldInfo field={field} />
                          </>
                        )}
                      </form.Field>
                    ),
                    header: "Output",
                  },
                  {
                    cell: ({ row }) => (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => testCases.removeValue(row.index)}
                              size="icon"
                              type="button"
                              variant="destructive"
                            >
                              <Trash2Icon strokeWidth={2.5} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>テストケースを削除</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ),
                    id: "actions",
                    meta: {
                      className: "w-4",
                    },
                  },
                ]}
                data={testCases.state.value}
              >
                <Button
                  className="w-full rounded-b-md rounded-t-none border-t"
                  onClick={() => testCases.pushValue({ input: "", output: "" })}
                  type="button"
                  variant="ghost"
                >
                  <span className="mr-auto text-muted-foreground">
                    + 新規追加
                  </span>
                </Button>
              </DataTable>
              <FieldInfo field={testCases} />
            </>
          )}
        </form.Field>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          解答可能なプログラミング言語
        </h2>
        <p>WIP</p>
      </div>
      <div className="flex flex-row justify-end">
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            errors: state.errors,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, errors, isSubmitting }) => (
            <SubmitButton
              canSubmit={canSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
              label={submitButtonLabel}
              submittingLabel={submitButtonSubmittingLabel}
            />
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
