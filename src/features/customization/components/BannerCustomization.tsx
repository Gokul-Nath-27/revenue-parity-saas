import { notFound } from 'next/navigation';

import { getProductCustomization } from '@/features/customization/db';
import { catchError } from '@/lib/utils';
import { canRemoveBranding as canRemoveBrandingPermission, canCustomizeBanner as canCustomizeBannerPermission } from '@/permissions';

import { BannerApperanceForm } from './BannerApperanceForm';
import { BannerProvider } from './BannerContext';
import { BannerEmbed } from './BannerEmbed';
import { BannerPreview } from './BannerPreview';


export default async function BannerCustomization({ productId }: { productId: string }) {
  const { data, error } = await catchError(getProductCustomization(productId));
  if (error) {
    return <div>Error: {error?.message}</div>;
  }
  if (!data?.customization) return notFound();

  const { userId, customization } = data;

  const canRemoveBranding = await canRemoveBrandingPermission(userId);
  const canCustomizeBanner = await canCustomizeBannerPermission(userId);

  return (
    <BannerProvider initialCustomization={customization} canCustomizeBanner={canCustomizeBanner}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Preview</h3>
          <BannerPreview
            location_message={customization.location_message}
            canRemoveBranding={canRemoveBranding}
            customization={customization}
            mappings={{
              discount: '30',
              coupon: 'INDIA30',
              country: 'India',
            }}  
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <BannerApperanceForm
            productId={productId}
            canCustomizeBanner={canCustomizeBanner}
          />
          <div>
            <BannerEmbed productId={productId} />
          </div>
        </div>
      </div>
    </BannerProvider>
  );
}
