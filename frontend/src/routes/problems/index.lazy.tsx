import { createLazyFileRoute } from "@tanstack/react-router"

// todo: implement Problems
const Problems = () => {
  return "Hello /problems!"
}

export const Route = createLazyFileRoute("/problems/")({
  component: Problems,
})