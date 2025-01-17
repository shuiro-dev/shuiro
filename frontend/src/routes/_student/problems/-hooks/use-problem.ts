import { useContext } from "react"

import { ProblemsContext } from "../-context/problems-context"

export const useProblem = () => {
  const context = useContext(ProblemsContext)
  if (context === undefined) {
    throw new Error("useProblem must be used within a ProblemProvider")
  }
  return context
}
