"use client"
import React, { createContext, useContext, useState } from 'react';

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
}

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
}

const defaultConfig: SiteConfig = {
  siteName: '',
  siteDescription: '',
  siteUrl: '',
  siteLogo: '',
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
} 