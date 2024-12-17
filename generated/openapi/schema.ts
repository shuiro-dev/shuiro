/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/problems": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** 問題の一覧を取得する */
    get: operations["getProblems"]
    put?: never
    /** 新しい問題を作成する */
    post: operations["createProblem"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/problems/{problemId}": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** 問題の詳細を取得する */
    get: operations["getProblemById"]
    /** 問題を更新する */
    put: operations["updateProblem"]
    post?: never
    /** 問題を削除する */
    delete: operations["deleteProblem"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/problems/{problemId}/submit": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** 問題に対してプログラムを提出する */
    post: operations["submitProgram"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/problems/{problemId}/test": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** 問題に対してプログラムをテストする */
    post: operations["testProgram"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/problems/{problemId}/submissions": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** 問題に対する提出一覧を取得する */
    get: operations["getSubmissionsByProblemId"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/submissions": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** 提出一覧を取得する */
    get: operations["getSubmissions"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/submissions/{submissionId}": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** 提出の詳細を取得する */
    get: operations["getSubmissionById"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/register": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** ユーザー登録の開始 */
    post: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": components["schemas"]["UserRegistration"]
        }
      }
      responses: {
        /** @description 登録チャレンジの生成 */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            "application/json": components["schemas"]["AuthenticationChallenge"]
          }
        }
        /** @description 無効なリクエスト */
        400: {
          headers: {
            [name: string]: unknown
          }
          content?: never
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/register/verify": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** 登録の検証とトークン発行 */
    post: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": components["schemas"]["RegistrationCredential"]
        }
      }
      responses: {
        /** @description 登録成功とトークン発行 */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            "application/json": components["schemas"]["AuthenticationResponse"]
          }
        }
        /** @description 検証失敗 */
        400: {
          headers: {
            [name: string]: unknown
          }
          content?: never
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/authenticate": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** 認証の開始 */
    post: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string
          }
        }
      }
      responses: {
        /** @description 認証チャレンジの生成 */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            "application/json": components["schemas"]["AuthenticationChallenge"]
          }
        }
        /** @description 認証失敗 */
        401: {
          headers: {
            [name: string]: unknown
          }
          content?: never
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/authenticate/verify": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** 認証の検証とトークン発行 */
    post: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": components["schemas"]["AuthenticationCredential"]
        }
      }
      responses: {
        /** @description 認証成功とトークン発行 */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            "application/json": components["schemas"]["AuthenticationResponse"]
          }
        }
        /** @description 認証失敗 */
        401: {
          headers: {
            [name: string]: unknown
          }
          content?: never
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    Language: {
      name: string
      version: string
    }
    TestCase: {
      input: string
      output: string
    }
    Problem: {
      body: string
      id: number
      supported_languages: components["schemas"]["Language"][]
      test_cases: components["schemas"]["TestCase"][]
      title: string
    }
    ProblemCreate: {
      body: string
      supported_languages: components["schemas"]["Language"][]
      test_cases: components["schemas"]["TestCase"][]
      title: string
    }
    ProblemUpdate: {
      body: string
      supported_languages: components["schemas"]["Language"][]
      test_cases: components["schemas"]["TestCase"][]
      title: string
    }
    /** @enum {string} */
    SubmissionStatus:
      | "Accepted"
      | "WrongAnswer"
      | "RuntimeError"
      | "CompileError"
    SubmissionResult: {
      message?: string
      status: components["schemas"]["SubmissionStatus"]
    }
    /** @enum {string} */
    TestStatus: "Passed" | "Failed"
    TestResult: {
      message?: string
      status: components["schemas"]["TestStatus"]
      test_case_id: number
    }
    Submission: {
      code: string
      id: number
      language: components["schemas"]["Language"]
      problem_id: number
      result: components["schemas"]["SubmissionResult"]
      student_id: number
      /** Format: date-time */
      submitted_at: string
      test_results: components["schemas"]["TestResult"][]
    }
    SubmissionCreate: {
      code: string
      language: components["schemas"]["Language"]
    }
    AuthenticationChallenge: {
      challenge: string
    }
    UserRegistration: {
      /** Format: email */
      email: string
      name: string
      /** @enum {string} */
      role: "admin" | "teacher" | "student"
    }
    AuthenticationResponse: {
      token: string
    }
    Credential: {
      id: string
      rawId: string
      /** @enum {string} */
      type: "public-key"
    }
    RegistrationCredential: components["schemas"]["Credential"] & {
      response: {
        attestationObject: string
        clientDataJSON: string
      }
    }
    AuthenticationCredential: components["schemas"]["Credential"] & {
      response: {
        authenticatorData: string
        clientDataJSON: string
        signature: string
        userHandle?: string
      }
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  getProblems: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 問題の一覧 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Problem"][]
        }
      }
    }
  }
  createProblem: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        "application/json": components["schemas"]["ProblemCreate"]
      }
    }
    responses: {
      /** @description 作成された問題 */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Problem"]
        }
      }
    }
  }
  getProblemById: {
    parameters: {
      query?: never
      header?: never
      path: {
        problemId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 問題の詳細 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Problem"]
        }
      }
      /** @description 指定されたIDの問題が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  updateProblem: {
    parameters: {
      query?: never
      header?: never
      path: {
        problemId: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        "application/json": components["schemas"]["ProblemUpdate"]
      }
    }
    responses: {
      /** @description 更新された問題 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Problem"]
        }
      }
      /** @description 指定されたIDの問題が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  deleteProblem: {
    parameters: {
      query?: never
      header?: never
      path: {
        problemId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 問題が削除されました */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description 指定されたIDの問題が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  submitProgram: {
    parameters: {
      query?: never
      header?: never
      path: {
        problemId: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        "application/json": components["schemas"]["SubmissionCreate"]
      }
    }
    responses: {
      /** @description 提出されたプログラム */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Submission"]
        }
      }
      /** @description 提出データが不正です */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description 指定されたIDの問題が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  testProgram: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        "application/json": components["schemas"]["SubmissionCreate"]
      }
    }
    responses: {
      /** @description 提出されたプログラムのテスト結果 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["TestResult"][]
        }
      }
    }
  }
  getSubmissionsByProblemId: {
    parameters: {
      query?: never
      header?: never
      path: {
        problemId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 提出一覧 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Submission"][]
        }
      }
      /** @description 指定されたIDの問題が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  getSubmissions: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 提出一覧 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Submission"][]
        }
      }
    }
  }
  getSubmissionById: {
    parameters: {
      query?: never
      header?: never
      path: {
        submissionId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description 提出の詳細 */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["Submission"]
        }
      }
      /** @description 指定されたIDの提出が見つかりません */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}
