import { Card, CardContent } from '@/components/ui/card';

import { Clipboard } from './Clipboard';
const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : process.env.BASE_URL_DEV

export function BannerEmbed({ productId }: { productId: string }) {
  const code = `<script defer src="${baseUrl}/api/products/${productId}/banner"></script>`

  return (
    <Card className='h-auto relative overflow-hidden'>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_70%)]"></div>
      <CardContent className='h-auto relative z-10'>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Embed Code</h3>
          <p className="text-sm text-muted-foreground">
            Use this code to add the banner to your existing website. The code includes all your customization settings:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-color</code>: The banner&apos;s background color</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-style</code>: The banner&apos;s border radius</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-position</code>: Where the banner appears (top/bottom)</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-text-color</code>: The text color of the banner</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-font-size</code>: The size of the text</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-container</code>: Where the banner is placed (body/header/main)</li>
            <li><code className="text-xs bg-muted px-1 py-0.5 rounded">data-sticky</code>: Whether the banner sticks to the viewport</li>
          </ul>
          <Clipboard code={code} />
        </div>
      </CardContent>
    </Card>
  );
} 