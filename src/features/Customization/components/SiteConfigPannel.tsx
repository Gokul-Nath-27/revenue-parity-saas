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
        <Card>
          <CardContent>
            <SiteInfoForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}