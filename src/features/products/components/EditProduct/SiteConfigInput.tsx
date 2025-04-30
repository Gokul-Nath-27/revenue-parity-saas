import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSiteConfig } from '@/features/products/components/EditProduct/SiteConfigContext';

export function SiteConfigInput() {
  const { config, updateConfig } = useSiteConfig();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input
          id="siteName"
          value={config.siteName}
          onChange={(e) => updateConfig({ siteName: e.target.value })}
          placeholder="Enter your site name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteDescription">Site Description</Label>
        <Textarea
          id="siteDescription"
          value={config.siteDescription}
          onChange={(e) => updateConfig({ siteDescription: e.target.value })}
          placeholder="Enter your site description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteUrl">Site URL</Label>
        <Input
          id="siteUrl"
          value={config.siteUrl}
          onChange={(e) => updateConfig({ siteUrl: e.target.value })}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteLogo">Logo URL</Label>
        <Input
          id="siteLogo"
          value={config.siteLogo}
          onChange={(e) => updateConfig({ siteLogo: e.target.value })}
          placeholder="https://example.com/logo.png"
          type="url"
        />
      </div>
    </div>
  );
} 