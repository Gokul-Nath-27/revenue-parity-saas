"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useBanner } from "./BannerContext";


export function Clipboard() {
  const { bannerColor, bannerStyle, bannerPosition } = useBanner();
  const [copied, setCopied] = useState(false);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(`<script src="https://revenueparity.com/embed.js" data-color="${bannerColor}" data-style="${bannerStyle}" data-position="${bannerPosition}"></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
        <code className="hide-scrollbar">{`<script src="https://revenueparity.com/embed.js" data-color="${bannerColor}" data-style="${bannerStyle}" data-position="${bannerPosition}"></script>`}</code>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
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

  )
}