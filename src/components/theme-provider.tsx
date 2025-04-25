"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

import { Toaster } from "./ui/sonner"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster position="bottom-center" />
    </NextThemesProvider>
  )
}
