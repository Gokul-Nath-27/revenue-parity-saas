import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/codebase/Navbar";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import React from "react";
import "./globals.css";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

console.log(spaceGrotesk);

export const metadata: Metadata = {
  title: "Avengers",
  description: "Avengers",
  icons: {
    icon: '/thanos.svg',
  },
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto px-2 w-full">
            <Navbar />
            <main className="h-[calc(100vh-64px)]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
