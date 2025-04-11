import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Easy Parity",
  description: "Easy Parity is a simple and easy to use parity checker for Ethereum.",
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}