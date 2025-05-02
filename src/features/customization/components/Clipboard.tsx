"use client";

import { Copy, Check } from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";

import { useBanner } from "./BannerContext";

export function Clipboard() {
  const { customization } = useBanner();
  const { background_color, text_color, font_size, banner_container, sticky } = customization;
  const [copied, setCopied] = useState(false);

  const embedCode = useMemo(() => {
    return `
<script src="https://revenueparity.com/embed.js"
  data-color="${background_color}"
  data-text-color="${text_color}"
  data-font-size="${font_size}"
  data-container="${banner_container}"
  data-sticky="${sticky}"></script>
    `.trim();
  }, [background_color, text_color, font_size, banner_container, sticky]);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
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
          <code>{embedCode}</code>
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
