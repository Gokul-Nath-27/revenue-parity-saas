import { BannerApperanceForm } from './BannerApperanceForm';
import { BannerProvider } from './BannerContext';
import { BannerEmbed } from './BannerEmbed';
import { BannerPreview } from './BannerPreview';

export default function BannerPanel() {
  return (
    <BannerProvider>
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
