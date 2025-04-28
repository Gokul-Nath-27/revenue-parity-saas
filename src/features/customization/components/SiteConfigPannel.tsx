import { Card, CardContent } from '@/components/ui/card';

import { SiteInfoForm } from './SiteInfoForm';

export default function SiteConfigPanel() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Site Configuration</h2>
        <p className="text-muted-foreground">Configure your site settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          <CardContent className="relative z-10">
            <SiteInfoForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}