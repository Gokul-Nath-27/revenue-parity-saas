"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useBanner } from "./BannerContext";

export function Clipboard() {
  const { customization } = useBanner();
  const { background_color, text_color, font_size, banner_container, sticky } = customization;
  const [copied, setCopied] = useState(false);

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://revenueparity.com/embed.js" 
  data-color="${background_color}" 
  data-text-color="${text_color}"
  data-font-size="${font_size}"
  data-container="${banner_container}"
  data-sticky="${sticky}"></script>`;

    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
        <code className="hide-scrollbar whitespace-pre">{`<script src="https://revenueparity.com/embed.js" 
  data-color="${background_color}" 
  data-text-color="${text_color}"
  data-font-size="${font_size}"
  data-container="${banner_container}"
  data-sticky="${sticky}"></script>`}</code>
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
  );
}