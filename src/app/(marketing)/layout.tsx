import React from "react";
import Navbar from "@/components/features/marketing/Navbar";

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
