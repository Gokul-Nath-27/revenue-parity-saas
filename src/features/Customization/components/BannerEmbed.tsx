import { Card, CardContent } from '@/components/ui/card';

import { Clipboard } from './Clipboard';

export function BannerEmbed() {
  return (
    <Card className='h-auto'>
      <CardContent className='h-auto'>
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