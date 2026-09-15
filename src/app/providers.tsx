import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import type { ReactNode } from "react"
import { queryClient } from "@/shared/api/query-client"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
