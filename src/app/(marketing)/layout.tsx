import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "Easy Parity",
  description: "Easy Parity is a simple and easy to use parity checker for Ethereum.",
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-2 min-h-screen">
      <header className="flex items-center justify-between w-full h-[64px]">
        {/* Nabar with loga=o and sign in button */}
        <nav className="flex items-center justify-between w-full py-4">
          <div className="text-lg font-bold">Easy Parity</div>
          <div>
            <Link href="/sign-in" className="mr-4 text-blue-500">
              <Button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      {/* Main content */}
      <main className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}