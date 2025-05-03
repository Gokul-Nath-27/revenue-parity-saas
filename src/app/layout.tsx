import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revenue Parity",
  description: "Make your digital product more profitable",
  icons: { icon: '/coffee.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={spaceGrotesk.style}>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="dark"
          themes={["light", "dark"]}
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            {children}
            <SpeedInsights />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
