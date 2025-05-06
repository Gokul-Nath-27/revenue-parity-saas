"use client"
import { createContext, useReducer, ReactElement, useContext } from 'react';

export type CustomizationType = {
  id: string;
  class_prefix: string | null;
  product_id: string;
  location_message: string;
  background_color: string;
  text_color: string;
  banner_container: string;
  sticky: boolean;
  font_size: string;
  banner_radius: string;
};

type BannerContextType = {
  customization: CustomizationType;
  setBanner: (customization: Partial<CustomizationType>) => void;
  canCustomizeBanner: boolean;
};

type BannerProviderProps = {
  children: ReactElement;
  initialCustomization: CustomizationType;
  canCustomizeBanner: boolean;
};

// Create the context with undefined as initial value
export const BannerContext = createContext<BannerContextType | undefined>(undefined);

export function BannerProvider({ children, initialCustomization, canCustomizeBanner }: BannerProviderProps) {
  const [customization, setBanner] = useReducer(
    (state: CustomizationType, updates: Partial<CustomizationType>) => ({
      ...state,
      ...updates,
    }),
    initialCustomization
  );

  const value = {
    customization,
    setBanner,
    canCustomizeBanner
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
}