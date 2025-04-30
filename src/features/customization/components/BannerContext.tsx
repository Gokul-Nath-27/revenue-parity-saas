"use client"
import { createContext, useState, ReactNode, useContext, type Dispatch, type SetStateAction } from 'react';

type BannerContextType = {
  bannerColor: string;
  setBannerColor: Dispatch<SetStateAction<string>>;
  bannerStyle: string;
  setBannerStyle: Dispatch<SetStateAction<string>>;
  customMessage: string;
  setCustomMessage: Dispatch<SetStateAction<string>>;
  bannerPosition: string;
  setBannerPosition: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  fontSize: string;
  setFontSize: Dispatch<SetStateAction<string>>;
  bannerContainer: string;
  setBannerContainer: Dispatch<SetStateAction<string>>;
  isSticky: boolean;
  setIsSticky: Dispatch<SetStateAction<boolean>>;
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
  const [isSticky, setIsSticky] = useState<boolean>(true);

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
      setIsSticky,
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