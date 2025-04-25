import { Card, CardContent } from '@/components/ui/card';

import { Clipboard } from './Clipboard';

export function BannerEmbed() {
  return (
    <Card className='h-auto relative overflow-hidden'>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_70%)]"></div>
      <CardContent className='h-auto relative z-10'>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Embed Code</h3>
          <p className="text-sm text-muted-foreground">
            Use this code to add the banner to your existing website.
          </p>
          <Clipboard />
        </div>
      </CardContent>
    </Card>
  );
} 