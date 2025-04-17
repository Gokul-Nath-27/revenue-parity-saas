import React from "react";
import { Metadata } from "next";
import Navbar from "@/app/(marketing)/_components/Navbar";

export const metadata: Metadata = {
  title: "RevenueParity",
  description: "Make your digital product more profitable.",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-2 w-full">
      <Navbar />
      <main className="h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
