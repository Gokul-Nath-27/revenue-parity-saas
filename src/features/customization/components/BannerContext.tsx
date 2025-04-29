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
  textColor: string;
  setTextColor: (color: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  bannerContainer: string;
  setBannerContainer: (container: string) => void;
  isSticky: boolean;
  setIsSticky: (sticky: boolean) => void;
};

export const BannerContext = createContext<BannerContextType | undefined>(undefined);

export function BannerProvider({ children }: { children: ReactNode }) {
  const [bannerColor, setBannerColor] = useState('from-primary/20 to-blue-600/20');
  const [bannerStyle, setBannerStyle] = useState('rounded-md');
  const [customMessage, setCustomMessage] = useState('');
  const [bannerPosition, setBannerPosition] = useState('top');
  const [textColor, setTextColor] = useState('hsl(0, 0%, 100%)');
  const [fontSize, setFontSize] = useState('1rem');
  const [bannerContainer, setBannerContainer] = useState('body');
  const [isSticky, setIsSticky] = useState(true);

  return (
    <BannerContext.Provider value={{
      bannerColor,
      setBannerColor,
      bannerStyle,
      setBannerStyle,
      customMessage,
      setCustomMessage,
      bannerPosition,
      setBannerPosition,
      textColor,
      setTextColor,
      fontSize,
      setFontSize,
      bannerContainer,
      setBannerContainer,
      isSticky,
      setIsSticky
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