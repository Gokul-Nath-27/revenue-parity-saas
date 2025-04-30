import { getCustomization } from '@/features/customization/db';
import { catchError } from '@/lib/utils';

import { BannerApperanceForm } from './BannerApperanceForm';
import { BannerProvider } from './BannerContext';
import { BannerEmbed } from './BannerEmbed';
import { BannerPreview } from './BannerPreview';

export default async function BannerPanel({ productId }: { productId: string }) {
  const { data: customization, error } = await catchError(getCustomization(productId));
  if (error) {
    console.error(error);
  }

  return (
    <BannerProvider customization={customization}>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Banner Customization</h2>
          <p className="text-muted-foreground">Customize how your banner looks and behaves</p>
        </div>

        <div className="space-y-6">
          <BannerPreview />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <BannerApperanceForm />
            <div>
              <BannerEmbed />
            </div>
          </div>
        </div>
      </div>
    </BannerProvider>
  );
}
