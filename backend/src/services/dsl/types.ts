// src/services/dsl/types.ts

/** --- DSL AST 型定義 --- */

export type ArgLiteral = {
  type: "literal"
  value: number | string
}

export type ArgOption = {
  key: string
  type: "option"
  value: boolean | number | string
}

export type ArgRange = {
  max: number
  min: number
  type: "range"
}

export type CallNode = {
  args: DSLArg[]
  functionName: string
}

export type DSLArg = ArgLiteral | ArgOption | ArgRange
