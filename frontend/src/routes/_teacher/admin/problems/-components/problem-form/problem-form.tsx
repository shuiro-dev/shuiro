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
import { $api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { valibotValidator } from "@tanstack/valibot-form-adapter"
import { Trash2Icon } from "lucide-react"
import React, { FC, useState } from "react"
import * as v from "valibot"

import { DataTable } from "./data-table"
import { FieldInfo } from "./field-info"
import { SubmitButton } from "./submit-button"

const problemSchema = v.object({
  body: v.string(),
  newLanguage: v.optional(v.string()),
  newVersion: v.optional(v.string()),
  supported_languages: v.pipe(
    v.array(
      v.object({
        name: v.string(),
        version: v.string(),
      }),
    ),
    v.checkItems(
      (item, _index, array) =>
        array.findIndex(
          (i) => i.name === item.name && i.version === item.version,
        ) === array.indexOf(item),
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
      (item, _index, array) =>
        array.findIndex(
          (i) => i.input === item.input && i.output === item.output,
        ) === array.indexOf(item),
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

type GenerateTestCaseBody = {
  code: string
  count: number
  inputStatus: string
  language: {
    name: string
    version: string
  }
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
      console.log("Submitted Values:", values.value)
      onSubmit(values.value)
    },
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: problemSchema,
    },
  })

  const [dsl, setDsl] = useState("")
  const [generateCode, setGenerateCode] = useState("")
  const [count, setCount] = useState(1)
  const [language, setLanguage] = useState({ name: "Python", version: "3.12" })
  const generateTestCaseMutation = $api.useMutation(
    "post",
    "/api/generate-test-case",
    {
      onError: (err) => {
        console.error("Failed to generate test cases:", err)
        alert("テストケースの生成に失敗しました")
      },
      onSuccess: (data) => {
        const currentCases = form.getFieldValue("test_cases") ?? []
        const newCases = [...currentCases, ...data.results]
        form.setFieldValue("test_cases", newCases)
      },
    },
  )

  const handleGenerateTestCases = () => {
    generateTestCaseMutation.mutate({
      body: {
        code: generateCode,
        count,
        inputStatus: dsl,
        language,
      } satisfies GenerateTestCaseBody,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit() // TanStack form
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
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
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-lg font-semibold">テストケースを自動生成</h3>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <Label>DSL (入力生成ルール)</Label>
            <Textarea
              onChange={(e) => setDsl(e.target.value)}
              placeholder='例: "int(1:100).array(3:8)" のようなDSLを記述'
              value={dsl}
            />
          </div>
          <div className="space-y-1">
            <Label>実行するコード</Label>
            <Textarea
              onChange={(e) => setGenerateCode(e.target.value)}
              placeholder="Pythonなどのサンプルコード"
              value={generateCode}
            />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
          <div className="space-y-1">
            <Label>生成する個数</Label>
            <Input
              onChange={(e) => setCount(Number(e.target.value))}
              type="number"
              value={count}
            />
          </div>
          <div className="space-y-1">
            <Label>言語</Label>
            <select
              className="w-full rounded border px-2 py-1 text-sm"
              onChange={(e) => setLanguage(JSON.parse(e.target.value))}
              value={JSON.stringify(language)}
            >
              <option value='{"name":"Python","version":"3.12"}'>
                Python 3.12
              </option>
              <option value='{"name":"Python","version":"3.11"}'>
                Python 3.11
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              disabled={generateTestCaseMutation.isPending}
              onClick={handleGenerateTestCases}
              type="button"
              variant="default"
            >
              {generateTestCaseMutation.isPending ? "生成中..." : "生成"}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          解答可能なプログラミング言語
        </h2>
        <form.Field mode="array" name="supported_languages">
          {(languages) => (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {languages.state.value.map((lang, index) => (
                  <div
                    className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2"
                    key={index}
                  >
                    <span>
                      {lang.name} ({lang.version})
                    </span>
                    <Button
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => languages.removeValue(index)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <span className="sr-only">Remove language</span>×
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-2">
                <div className="grid flex-1 gap-2">
                  <Label>言語</Label>
                  <form.Field name="newLanguage">
                    {(field) => (
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value ?? ""}
                      >
                        <option value="">言語を選択</option>
                        <option value="C++">C++</option>
                        <option value="Python">Python</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Java">Java</option>
                      </select>
                    )}
                  </form.Field>
                </div>

                <div className="grid flex-1 gap-2">
                  <Label>バージョン</Label>
                  <form.Field name="newVersion">
                    {(field) => (
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value ?? ""}
                      >
                        <option value="">バージョンを選択</option>
                        <option value="vC++20">vC++20</option>
                        <option value="v3.11">v3.11</option>
                        <option value="ES2022">ES2022</option>
                        <option value="17">17</option>
                      </select>
                    )}
                  </form.Field>
                </div>

                <Button
                  className="px-8"
                  onClick={() => {
                    const newLang = form.getFieldValue("newLanguage")
                    const newVer = form.getFieldValue("newVersion")
                    if (newLang && newVer) {
                      languages.pushValue({
                        name: newLang,
                        version: newVer,
                      })
                      form.setFieldValue("newLanguage", undefined)
                      form.setFieldValue("newVersion", undefined)
                    }
                  }}
                  type="button"
                >
                  追加
                </Button>
              </div>
              <FieldInfo field={languages} />
            </div>
          )}
        </form.Field>
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
