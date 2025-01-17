// src/services/dsl/evaluateCallNodes.ts

import { faker } from "@faker-js/faker"

import type { ArgOption, ArgRange, CallNode } from "./types"

import { floatBetween, numberBetween, randomWord } from "./faker-wrappers"
import { parseDSL } from "./parser-dsl"

/**
 * AST(CallNode[]) を評価して「ランダム生成関数 (ジェネレータ)」を返す。
 * 例:
 *   const ast = parseDSL("int(1:100).array(3:5, unique=true)");
 *   const gen = evaluateCallNodes(ast);
 *   console.log(gen()); // => [ 45, 12, 76, ... ] など
 */

let currentValueGenerator: () => unknown = () => null

export function evaluateDSL(dsl: string): () => unknown {
  const ast = parseDSL(dsl)
  return evaluateCallNodes(ast)
}

function evaluateCallNodes(callNodes: CallNode[]): () => unknown {
  // 毎回の呼び出しでリセット
  currentValueGenerator = () => null

  for (const node of callNodes) {
    const { args, functionName } = node

    switch (functionName) {
      case "array": {
        // DSL例: array(3:5, unique=true)
        const rangeArg = args.find((a) => a.type === "range") as
          | ArgRange
          | undefined
        const minLen = rangeArg ? rangeArg.min : 1
        const maxLen = rangeArg ? rangeArg.max : 1

        const uniqueOption = args.find(
          (a) => a.type === "option" && a.key === "unique",
        ) as ArgOption | undefined
        const isUnique = uniqueOption ? !!uniqueOption.value : false

        const oldGen = currentValueGenerator
        currentValueGenerator = () => {
          const length = faker.number.int({ max: maxLen, min: minLen })
          // oldGen = "単一要素生成関数"
          return isUnique
            ? faker.helpers.uniqueArray(() => oldGen(), length)
            : faker.helpers.multiple(() => oldGen(), { count: length })
        }
        break
      }

      case "float": {
        // DSL例: float(0:1) -> floatBetween(0,1,4)
        const rangeArg = args.find((a) => a.type === "range") as
          | ArgRange
          | undefined
        const min = rangeArg ? rangeArg.min : 0
        const max = rangeArg ? rangeArg.max : 1
        currentValueGenerator = () => floatBetween(min, max, 4)
        break
      }

      case "int": {
        // DSL例: int(1:100) -> numberBetween(1, 100)
        const rangeArg = args.find((a) => a.type === "range") as
          | ArgRange
          | undefined
        const min = rangeArg ? rangeArg.min : 1
        const max = rangeArg ? rangeArg.max : 100
        currentValueGenerator = () => numberBetween(min, max)
        break
      }

      case "word": {
        // DSL例: word() -> randomWord()
        currentValueGenerator = () => randomWord()
        break
      }

      default: {
        throw new Error(`Unknown function name: ${functionName}`)
      }
    }
  }

  return currentValueGenerator
}
