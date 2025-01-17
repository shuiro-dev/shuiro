import { $api } from "@/lib/api"
import React from "react"

import { ProblemsContext } from "./problems-context"

// ProblemsProvider の Props 型
export type ProblemsProviderProps = {
  children?: React.ReactNode
}

export const ProblemsProvider: React.FC<ProblemsProviderProps> = ({
  children,
}) => {
  const problems = $api.useSuspenseQuery("get", "/api/problems")

  return (
    <ProblemsContext.Provider value={{ problems }}>
      {children}
    </ProblemsContext.Provider>
  )
}
