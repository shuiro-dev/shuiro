import type { FC } from "react"

import { Button } from "@/components/ui/button"

export type TestButtonProps = {
  className?: string
}

export const TestButton: FC<TestButtonProps> = ({ className }) => {
  return (
    <Button className={className} onClick={test} variant="outline">
      テスト実行
    </Button>
  )
}

const test = () => {
  alert("WIP")
}
