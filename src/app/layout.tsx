import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/app/(marketing)/_components/Navbar";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import React from "react";
import "./globals.css";

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
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
