"use client"
import { createContext, useState, ReactNode, useContext } from 'react';

type BannerContextType = {
  bannerColor: string;
  setBannerColor: (color: string) => void;
  bannerStyle: string;
  setBannerStyle: (style: string) => void;
  customMessage: string;
  setCustomMessage: (message: string) => void;
  bannerPosition: string;
  setBannerPosition: (position: string) => void;
};

export const BannerContext = createContext<BannerContextType | undefined>(undefined);

export function BannerProvider({ children }: { children: ReactNode }) {
  const [bannerColor, setBannerColor] = useState('from-primary/20 to-blue-600/20');
  const [bannerStyle, setBannerStyle] = useState('rounded-md');
  const [customMessage, setCustomMessage] = useState('');
  const [bannerPosition, setBannerPosition] = useState('top');

  return (
    <BannerContext.Provider value={{
      bannerColor,
      setBannerColor,
      bannerStyle,
      setBannerStyle,
      customMessage,
      setCustomMessage,
      bannerPosition,
      setBannerPosition
    }}>
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