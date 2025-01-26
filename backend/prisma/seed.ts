import type { Prisma } from "@prisma/client"

import { z } from "@hono/zod-openapi"
import { parseArgs } from "node:util"

import { SubmissionStatus, TestStatus } from "../src/api/components/schemas"
import { prisma } from "../src/db"

type SubmissionStatusType = z.infer<typeof SubmissionStatus>
type TestStatusType = z.infer<typeof TestStatus>

const initEnumTables = async () => {
  for (const status of TestStatus._def.values) {
    await prisma.testStatus.upsert({
      create: {
        status,
      },
      update: {},
      where: { status },
    })
  }

  for (const status of SubmissionStatus._def.values) {
    await prisma.submissionStatus.upsert({
      create: {
        status,
      },
      update: {},
      where: { status },
    })
  }
}

const generateFakeData = async () => {
  // 教師データの作成
  const teacherData = [
    {
      email: "alice@teacher.example.com",
      name: "Teacher Alice",
    },
    {
      email: "bob@teacher.example.com",
      name: "Teacher Bob",
    },
    {
      email: "charlie@teacher.example.com",
      name: "Teacher Charlie",
    },
  ]

  const teachers = await prisma.$transaction(async (tx) => {
    const createdTeachers = await Promise.all(
      teacherData.map(async (data) => {
        const user = await tx.user.create({
          data: {
            email: data.email,
            name: data.name,
            role: "teacher",
            teacher: {
              create: {}, // Teacher will be created with a relation to the user
            },
          },
          include: {
            teacher: true,
          },
        })
        if (!user.teacher) {
          throw new Error(`Failed to create teacher for user ${user.id}`)
        }
        return user.teacher
      }),
    )
    return createdTeachers
  })

  // 学生データの作成
  const studentData = [
    {
      email: "dave@student.example.com",
      name: "Student Dave",
    },
    {
      email: "eve@student.example.com",
      name: "Student Eve",
    },
    {
      email: "frank@student.example.com",
      name: "Student Frank",
    },
    {
      email: "george@student.example.com",
      name: "Student George",
    },
    {
      email: "harry@student.example.com",
      name: "Student Harry",
    },
  ]

  const students = await prisma.$transaction(async (tx) => {
    const createdStudents = await Promise.all(
      studentData.map(async (data) => {
        const user = await tx.user.create({
          data: {
            email: data.email,
            name: data.name,
            role: "student",
            student: {
              create: {},
            },
          },
          include: {
            student: true,
          },
        })
        if (!user.student) {
          throw new Error(`Failed to create student for user ${user.id}`)
        }
        return user.student
      }),
    )
    return createdStudents
  })

  await prisma.supportedLanguage.createMany({
    data: [
      {
        name: "Python",
        version: "3.12",
      },
    ],
  })

  const problems = await prisma.$transaction(async (tx) => {
    const createProblemWithTeacher = async (
      problemData: Omit<Prisma.ProblemCreateInput, "teachers">,
      teacherIndex: number,
    ) => {
      return await tx.problem.create({
        data: {
          ...problemData,
          teachers: {
            connect: [{ id: teachers[teacherIndex].id }],
          },
        },
        include: {
          testCases: true,
        },
      })
    }

    const helloWorld = await createProblemWithTeacher(
      {
        body: "Print 'Hello, World!' to the console.",
        supportedLanguages: {
          create: [
            {
              language: {
                connect: {
                  name_version: {
                    name: "Python",
                    version: "3.12",
                  },
                },
              },
            },
          ],
        },
        testCases: {
          create: [
            {
              input: "",
              output: "Hello, World!",
            },
          ],
        },
        title: "Hello, World!",
      },
      0,
    )

    const sum = await createProblemWithTeacher(
      {
        body: "Print the sum of two numbers.",
        supportedLanguages: {
          create: [
            {
              language: {
                connect: {
                  name_version: {
                    name: "Python",
                    version: "3.12",
                  },
                },
              },
            },
          ],
        },
        testCases: {
          create: [
            {
              input: "1 2",
              output: "3",
            },
            {
              input: "3 4",
              output: "7",
            },
          ],
        },
        title: "Sum of Two Numbers",
      },
      1,
    )

    const product = await createProblemWithTeacher(
      {
        body: "Print the product of two numbers.",
        supportedLanguages: {
          create: [
            {
              language: {
                connect: {
                  name_version: {
                    name: "Python",
                    version: "3.12",
                  },
                },
              },
            },
          ],
        },
        testCases: {
          create: [
            {
              input: "1 2",
              output: "2",
            },
            {
              input: "3 4",
              output: "12",
            },
            {
              input: "5 6",
              output: "30",
            },
          ],
        },
        title: "Product of Two Numbers",
      },
      2,
    )

    const fibonacci = (n: number): number => {
      if (n <= 1) return n
      return fibonacci(n - 1) + fibonacci(n - 2)
    }

    const fibonacciProblem = await createProblemWithTeacher(
      {
        body: "Print the fibonacci number at the given index.",
        supportedLanguages: {
          create: [
            {
              language: {
                connect: {
                  name_version: {
                    name: "Python",
                    version: "3.12",
                  },
                },
              },
            },
          ],
        },
        testCases: {
          create: Array.from({ length: 11 }, (_, i) => ({
            input: i.toString(),
            output: fibonacci(i).toString(),
          })),
        },
        title: "Fibonacci",
      },
      0,
    )

    return {
      fibonacciProblem,
      helloWorld,
      product,
      sum,
    }
  })

  // todo: generate test results
  await prisma.$transaction(async (tx) => {
    await tx.submission.create({
      data: {
        code: "print('Hello, World!')",
        language: {
          connect: {
            name_version: {
              name: "Python",
              version: "3.12",
            },
          },
        },
        problem: {
          connect: {
            id: problems.helloWorld.id,
          },
        },
        result: {
          create: {
            message: "Accepted",
            status: {
              connect: {
                status: "Accepted" satisfies SubmissionStatusType,
              },
            },
          },
        },
        student: {
          connect: {
            id: students[0].id,
          },
        },
        testResults: {
          createMany: {
            data: problems.helloWorld.testCases.map(({ id }) => ({
              message: "Passed",
              statusId: "Passed" satisfies TestStatusType,
              testCaseId: id,
            })),
          },
        },
      },
    })

    await tx.submission.create({
      data: {
        code: "print('Hello, world!')",
        language: {
          connect: {
            name_version: {
              name: "Python",
              version: "3.12",
            },
          },
        },
        problem: {
          connect: {
            id: problems.helloWorld.id,
          },
        },
        result: {
          create: {
            message: "Wrong Answer",
            status: {
              connect: {
                status: "WrongAnswer" satisfies SubmissionStatusType,
              },
            },
          },
        },
        student: {
          connect: {
            id: students[1].id,
          },
        },
        testResults: {
          createMany: {
            data: problems.helloWorld.testCases.map(({ id }) => ({
              message: "Failed",
              statusId: "Failed" satisfies TestStatusType,
              testCaseId: id,
            })),
          },
        },
      },
    })

    for (const [i, student] of students.entries()) {
      await tx.submission.create({
        data: {
          code: "a, b = map(int, input().split())\nprint(a + b)",
          language: {
            connect: {
              name_version: {
                name: "Python",
                version: "3.12",
              },
            },
          },
          problem: {
            connect: {
              id: problems.sum.id,
            },
          },
          result: {
            create: {
              message: "Accepted",
              status: {
                connect: {
                  status: "Accepted" satisfies SubmissionStatusType,
                },
              },
            },
          },
          student: {
            connect: {
              id: student.id,
            },
          },
          testResults: {
            createMany: {
              data: problems.sum.testCases.map(({ id }) => ({
                message: "Passed",
                statusId: "Passed" satisfies TestStatusType,
                testCaseId: id,
              })),
            },
          },
        },
      })

      await tx.submission.create({
        data: {
          code:
            i % 3 === 0
              ? "print(3)"
              : "a, b = map(int, input().split())\nprint(a * b)",
          language: {
            connect: {
              name_version: {
                name: "Python",
                version: "3.12",
              },
            },
          },
          problem: {
            connect: {
              id: problems.product.id,
            },
          },
          result: {
            create:
              i % 3 === 0
                ? {
                    message: "Wrong Answer",
                    status: {
                      connect: {
                        status: "WrongAnswer" satisfies SubmissionStatusType,
                      },
                    },
                  }
                : {
                    message: "Accepted",
                    status: {
                      connect: {
                        status: "Accepted" satisfies SubmissionStatusType,
                      },
                    },
                  },
          },
          student: {
            connect: {
              id: student.id,
            },
          },
          testResults: {
            createMany: {
              data: problems.product.testCases.map(({ id }) =>
                i % 3 === 0
                  ? {
                      message: "Failed",
                      statusId: "Failed" satisfies TestStatusType,
                      testCaseId: id,
                    }
                  : {
                      message: "Passed",
                      statusId: "Passed" satisfies TestStatusType,
                      testCaseId: id,
                    },
              ),
            },
          },
        },
      })

      await tx.submission.create({
        data: {
          code:
            i % 3 === 0
              ? [
                  "def fibonacci(n):",
                  "    if n == 0:",
                  "        return 1",
                  "    elif n == 1:",
                  "        return 1",
                  "    else:",
                  "        return fibonacci(n - 1) + fibonacci(n - 2)",
                  "",
                  "print(fibonacci(int(input())))",
                ].join("\n")
              : [
                  "def fibonacci(n):",
                  "    if n == 0:",
                  "        return 0",
                  "    elif n == 1:",
                  "        return 1",
                  "    else:",
                  "        return fibonacci(n - 1) + fibonacci(n - 2)",
                  "",
                  "print(fibonacci(int(input())))",
                ].join("\n"),
          language: {
            connect: {
              name_version: {
                name: "Python",
                version: "3.12",
              },
            },
          },
          problem: {
            connect: {
              id: problems.fibonacciProblem.id,
            },
          },
          result: {
            create: {
              message: "Accepted",
              status: {
                connect: {
                  status: "Accepted" satisfies SubmissionStatusType,
                },
              },
            },
          },
          student: {
            connect: {
              id: student.id,
            },
          },
          testResults: {
            createMany: {
              data: problems.fibonacciProblem.testCases.map(({ id }, i) =>
                i === 0 && i % 3 === 0
                  ? {
                      message: "Failed",
                      statusId: "Failed" satisfies TestStatusType,
                      testCaseId: id,
                    }
                  : {
                      message: "Passed",
                      statusId: "Passed" satisfies TestStatusType,
                      testCaseId: id,
                    },
              ),
            },
          },
        },
      })
    }
  })
}

const main = async () => {
  const { values } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options: {
      fake: {
        alias: "f",
        description: "Seed fake data",
        type: "boolean",
      },
    },
    strict: true,
  })

  await initEnumTables()

  if (values.fake) {
    await generateFakeData()
  }
}

try {
  await main()
  await prisma.$disconnect()
} catch (error) {
  console.error(error)
  await prisma.$disconnect()
  // eslint-disable-next-line unicorn/no-process-exit -- this is a cli app
  process.exit(1)
}
