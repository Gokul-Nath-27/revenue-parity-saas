"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";


export function Clipboard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
        <pre className="hide-scrollbar whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2 mt-2"
        onClick={copyEmbedCode}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy Code
          </>
        )}
      </Button>
    </>
  );
}
