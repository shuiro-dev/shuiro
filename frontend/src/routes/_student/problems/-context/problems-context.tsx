import { UseSuspenseQueryResult } from "@tanstack/react-query"
import { components } from "openapi/schema"
import { createContext } from "react"

export type Problem = components["schemas"]["Problem"]

export type ProblemsContextType = {
  problems: UseSuspenseQueryResult<Problem[], undefined>
}

export const ProblemsContext = createContext<ProblemsContextType | undefined>(
  undefined,
)
