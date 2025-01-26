import type { Prisma } from "@prisma/client"

import { faker } from "@faker-js/faker"

import { SubmissionStatus, TestStatus } from "../api/components/schemas"
import { prisma } from "./prisma"

/**
 * Reset the database by deleting all tables except for enum tables
 * Executes deletions in a single transaction to maintain data consistency
 */
export const resetDb = async () => {
  await prisma.$transaction([
    prisma.submission.deleteMany(),
    prisma.submissionResult.deleteMany(),
    prisma.testResult.deleteMany(),
    prisma.testCase.deleteMany(),
    prisma.problem.deleteMany(),
    prisma.language.deleteMany(),
    prisma.supportedLanguage.deleteMany(),
    prisma.credential.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

/**
 * Generate test data for User entity without database insertion
 * Used for creating nested objects or preparing test data
 *
 * @param data - Partial user data to override default values
 * @returns Generated user data object conforming to UserCreateInput
 * @example
 * // Create basic user data
 * const userData = createUserData();
 *
 * // Create user data with specific role
 * const teacherData = createUserData({ role: "teacher" });
 *
 * // Use in nested object creation
 * const studentData = createStudentData({
 *   user: { create: createUserData({ role: "student" }) }
 * });
 */
export const createUserData = ({
  email = faker.internet.email(),
  name = faker.person.fullName(),
  role = "student",
  ...data
}: Partial<Prisma.UserCreateInput> = {}): Prisma.UserCreateInput => ({
  email,
  name,
  role,
  ...data,
})

/**
 * Create and persist a User entity in the database
 *
 * @param data - Partial user data to override default values
 * @returns Promise resolving to the persisted user entity
 * @example
 * // Create a basic user
 * const user = await createUser();
 *
 * // Create a teacher user
 * const teacher = await createUser({ role: "teacher" });
 */
export const createUser = (data: Partial<Prisma.UserCreateInput> = {}) =>
  prisma.user.create({
    data: createUserData(data),
  })

/**
 * Generate test data for Student entity without database insertion
 * Automatically creates associated user data with student role
 *
 * @param data - Partial student data to override default values
 * @returns Generated student data object conforming to StudentCreateInput
 * @example
 * // Create basic student data
 * const studentData = createStudentData();
 *
 * // Create student data with custom user properties
 * const studentWithCustomUser = createStudentData({
 *   user: { create: createUserData({ name: "Custom Name" }) }
 * });
 */
export const createStudentData = ({
  user = {
    create: createUserData({ role: "student" }),
  },
  ...data
}: Partial<Prisma.StudentCreateInput> = {}): Prisma.StudentCreateInput => ({
  user,
  ...data,
})

/**
 * Create and persist a Student entity in the database
 * Automatically creates associated user with student role
 *
 * @param data - Partial student data to override default values
 * @returns Promise resolving to the persisted student entity with included user
 * @example
 * // Create a basic student
 * const student = await createStudent();
 *
 * // Create a student with custom properties
 * const customStudent = await createStudent({
 *   user: { create: createUserData({ name: "Custom Student" }) }
 * });
 */
export const createStudent = (data: Partial<Prisma.StudentCreateInput> = {}) =>
  prisma.student.create({
    data: createStudentData(data),
    include: {
      user: true,
    },
  })

/**
 * Generate test data for Teacher entity without database insertion
 * Automatically creates associated user data with teacher role
 *
 * @param data - Partial teacher data to override default values
 * @returns Generated teacher data object conforming to TeacherCreateInput
 * @example
 * // Create basic teacher data
 * const teacherData = createTeacherData();
 *
 * // Create teacher data with custom user properties
 * const customTeacherData = createTeacherData({
 *   user: { create: createUserData({ name: "Professor Smith" }) }
 * });
 */
export const createTeacherData = ({
  user = {
    create: createUserData({ role: "teacher" }),
  },
  ...data
}: Partial<Prisma.TeacherCreateInput> = {}): Prisma.TeacherCreateInput => ({
  user,
  ...data,
})

/**
 * Create and persist a Teacher entity in the database
 * Automatically creates associated user with teacher role
 *
 * @param data - Partial teacher data to override default values
 * @returns Promise resolving to the persisted teacher entity with included user
 * @example
 * // Create a basic teacher
 * const teacher = await createTeacher();
 *
 * // Create a teacher with custom properties
 * const customTeacher = await createTeacher({
 *   user: { create: createUserData({ name: "Dr. Johnson" }) }
 * });
 */
export const createTeacher = (data: Partial<Prisma.TeacherCreateInput> = {}) =>
  prisma.teacher.create({
    data: createTeacherData(data),
    include: {
      user: true,
    },
  })

/**
 * Generate test data for Problem entity without database insertion
 *
 * @param data - Partial problem data to override default values
 * @returns Generated problem data object conforming to ProblemCreateInput
 * @example
 * // Create basic problem data
 * const problemData = createProblemData();
 *
 * // Create problem data with custom title
 * const customProblem = createProblemData({
 *   title: "Advanced Algorithms",
 *   body: "Implement a balanced binary tree..."
 * });
 */
export const createProblemData = ({
  body = faker.lorem.paragraph(),
  title = faker.book.title(),
  ...data
}: Partial<Prisma.ProblemCreateInput> = {}): Prisma.ProblemCreateInput => ({
  body,
  title,
  ...data,
})

/**
 * Create and persist a Problem entity in the database
 *
 * @param data - Partial problem data to override default values
 * @returns Promise resolving to the persisted problem entity with included relations
 * @example
 * // Create a basic problem
 * const problem = await createProblem();
 *
 * // Create a problem with custom properties
 * const customProblem = await createProblem({
 *   title: "Data Structures",
 *   body: "Implement a hash table..."
 * });
 */
export const createProblem = (data: Partial<Prisma.ProblemCreateInput> = {}) =>
  prisma.problem.create({
    data: createProblemData(data),
    include: {
      supportedLanguages: true,
      teachers: true,
      testCases: true,
    },
  })

/**
 * Generate test data for TestCase entity without database insertion
 * Automatically creates associated problem data if not provided
 *
 * @param data - Partial test case data to override default values
 * @returns Generated test case data object conforming to TestCaseCreateInput
 * @example
 * // Create basic test case data
 * const testCaseData = createTestCaseData();
 *
 * // Create test case data for existing problem
 * const testCaseForProblem = createTestCaseData({
 *   problem: { connect: { id: existingProblemId } }
 * });
 */
export const createTestCaseData = ({
  input = faker.lorem.sentence(),
  output = faker.lorem.sentence(),
  problem = {
    create: createProblemData(),
  },
  ...data
}: Partial<Prisma.TestCaseCreateInput> = {}): Prisma.TestCaseCreateInput => ({
  input,
  output,
  problem,
  ...data,
})

/**
 * Create and persist a TestCase entity in the database
 *
 * @param data - Partial test case data to override default values
 * @returns Promise resolving to the persisted test case entity
 * @example
 * // Create a basic test case
 * const testCase = await createTestCase();
 *
 * // Create a test case with custom input/output
 * const customTestCase = await createTestCase({
 *   input: "5 3",
 *   output: "8"
 * });
 */
export const createTestCase = (
  data: Partial<Prisma.TestCaseCreateInput> = {},
) =>
  prisma.testCase.create({
    data: createTestCaseData(data),
  })

/**
 * Generate test data for TestResult entity without database insertion
 * Automatically creates associated test case and status data if not provided
 *
 * @param data - Partial test result data to override default values
 * @returns Generated test result data object conforming to TestResultCreateInput
 * @example
 * // Create basic test result data
 * const testResultData = createTestResultData();
 *
 * // Create test result data with specific status
 * const failedTestResult = createTestResultData({
 *   status: { connect: { status: "FAILED" } }
 * });
 */
export const createTestResultData = ({
  message = faker.lorem.sentence(),
  status = {
    connect: {
      status: faker.helpers.arrayElement(TestStatus._def.values),
    },
  },
  testCase = {
    create: createTestCaseData(),
  },
  ...data
}: Partial<Prisma.TestResultCreateInput> = {}): Prisma.TestResultCreateInput => ({
  message,
  status,
  testCase,
  ...data,
})

/**
 * Create and persist a TestResult entity in the database
 *
 * @param data - Partial test result data to override default values
 * @returns Promise resolving to the persisted test result entity
 * @example
 * // Create a basic test result
 * const testResult = await createTestResult();
 *
 * // Create a test result with custom message
 * const customTestResult = await createTestResult({
 *   message: "Memory limit exceeded"
 * });
 */
export const createTestResult = (
  data: Partial<Prisma.TestResultCreateInput> = {},
) =>
  prisma.testResult.create({
    data: createTestResultData(data),
  })

/**
 * Utility function to capitalize first letter of a string
 * Used internally for generating language names
 */
const upperCaseFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Generate test data for SupportedLanguage entity without database insertion
 *
 * @param data - Partial supported language data to override default values
 * @returns Generated supported language data object conforming to SupportedLanguageCreateInput
 * @example
 * // Create basic supported language data
 * const languageData = createSupportedLanguageData();
 *
 * // Create specific language data
 * const pythonData = createSupportedLanguageData({
 *   name: "Python",
 *   version: "3.9.0"
 * });
 */
export const createSupportedLanguageData = ({
  name = upperCaseFirst(faker.lorem.word()),
  version = faker.system.semver(),
  ...data
}: Partial<Prisma.SupportedLanguageCreateInput> = {}): Prisma.SupportedLanguageCreateInput => ({
  name,
  version,
  ...data,
})

/**
 * Create and persist a SupportedLanguage entity in the database
 *
 * @param data - Partial supported language data to override default values
 * @returns Promise resolving to the persisted supported language entity
 * @example
 * // Create a basic supported language
 * const language = await createSupportedLanguage();
 *
 * // Create a specific language
 * const java = await createSupportedLanguage({
 *   name: "Java",
 *   version: "17.0.0"
 * });
 */
export const createSupportedLanguage = (
  data: Partial<Prisma.SupportedLanguageCreateInput> = {},
) =>
  prisma.supportedLanguage.create({
    data: createSupportedLanguageData(data),
  })

/**
 * Generate test data for SubmissionResult entity without database insertion
 *
 * @param data - Partial submission result data to override default values
 * @returns Generated submission result data object conforming to SubmissionResultCreateInput
 * @example
 * // Create basic submission result data
 * const resultData = createSubmissionResultData();
 *
 * // Create submission result data with specific status
 * const successResult = createSubmissionResultData({
 *   status: { connect: { status: "SUCCESS" } }
 * });
 */
export const createSubmissionResultData = ({
  message = faker.lorem.sentence(),
  status = {
    connect: {
      status: faker.helpers.arrayElement(SubmissionStatus._def.values),
    },
  },
  ...data
}: Partial<Prisma.SubmissionResultCreateInput> = {}): Prisma.SubmissionResultCreateInput => ({
  message,
  status,
  ...data,
})

/**
 * Create and persist a SubmissionResult entity in the database
 *
 * @param data - Partial submission result data to override default values
 * @returns Promise resolving to the persisted submission result entity with included status
 * @example
 * // Create a basic submission result
 * const result = await createSubmissionResult();
 *
 * // Create a submission result with specific message
 * const customResult = await createSubmissionResult({
 *   message: "Time limit exceeded"
 * });
 */
export const createSubmissionResult = (
  data: Partial<Prisma.SubmissionResultCreateInput> = {},
) =>
  prisma.submissionResult.create({
    data: createSubmissionResultData(data),
    include: {
      status: true,
    },
  })

/**
 * Generate language data for submission
 * Creates a supported language with connect-or-create logic
 */
const createLanguageDataForSubmission =
  (): Prisma.SupportedLanguageCreateNestedOneWithoutSubmissionsInput => {
    const supportedLanguage = createSupportedLanguageData()
    return {
      connectOrCreate: {
        create: supportedLanguage,
        where: {
          name_version: {
            name: supportedLanguage.name,
            version: supportedLanguage.version,
          },
        },
      },
    }
  }

/**
 * Generate student data for submission
 * Creates a student with associated user data
 *
 * @returns Nested student creation input for submissions
 * @internal Used internally by createSubmissionData
 */
const createStudentDataForSubmission =
  (): Prisma.StudentCreateNestedOneWithoutSubmissionsInput => {
    const userData = createUserData({ role: "student" })
    return {
      create: {
        user: {
          create: userData,
        },
      },
    }
  }

/**
 * Generate test data for Submission entity without database insertion
 * Automatically creates associated entities (language, problem, result, student) if not provided
 *
 * @param data - Partial submission data to override default values
 * @returns Generated submission data object conforming to SubmissionCreateInput
 * @example
 * // Create basic submission data
 * const submissionData = createSubmissionData();
 *
 * // Create submission data with existing problem
 * const submission = createSubmissionData({
 *   problem: { connect: { id: existingProblemId } },
 *   code: "def solution(a, b): return a + b"
 * });
 */
export const createSubmissionData = ({
  code = faker.lorem.paragraph(),
  language = createLanguageDataForSubmission(),
  problem = {
    create: createProblemData(),
  },
  result = {
    create: createSubmissionResultData(),
  },
  student = createStudentDataForSubmission(),
  ...data
}: Partial<Prisma.SubmissionCreateInput> = {}): Prisma.SubmissionCreateInput => ({
  code,
  language,
  problem,
  result,
  student,
  ...data,
})

/**
 * Create and persist a Submission entity in the database
 * Automatically creates all associated entities if not provided
 *
 * @param data - Partial submission data to override default values
 * @returns Promise resolving to the persisted submission entity with included relations
 * @example
 * // Create a basic submission
 * const submission = await createSubmission();
 *
 * // Create a submission for an existing problem and student
 * const customSubmission = await createSubmission({
 *   problem: { connect: { id: problemId } },
 *   student: { connect: { id: studentId } },
 *   code: "function solve(a, b) { return a + b; }"
 * });
 */
export const createSubmission = (
  data: Partial<Prisma.SubmissionCreateInput> = {},
) =>
  prisma.submission.create({
    data: createSubmissionData(data),
    include: {
      language: true,
      result: {
        include: {
          status: true,
        },
      },
      student: true,
      testResults: {
        include: {
          status: true,
        },
      },
    },
  })
