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

type Customization = {
  id: string;
  sticky: boolean;
  class_prefix: string | null;
  location_message: string;
  background_color: string;
  text_color: string;
  banner_container: string;
  font_size: string;
} | undefined
export function BannerProvider({ children, customization }: { children: ReactNode, customization: Customization }) {
  const { background_color, text_color, banner_container, font_size, sticky, class_prefix, location_message } = customization || {};
  
  const [bannerColor, setBannerColor] = useState(background_color || 'from-primary/20 to-blue-600/20');
  const [bannerStyle, setBannerStyle] = useState('rounded-md');
  const [customMessage, setCustomMessage] = useState(location_message || '');
  const [bannerPosition, setBannerPosition] = useState('top');
  const [textColor, setTextColor] = useState(text_color ||  'hsl(0, 0%, 100%)');
  const [fontSize, setFontSize] = useState(font_size || '1rem');
  const [bannerContainer, setBannerContainer] = useState(banner_container || 'body');
  const [isSticky, setIsSticky] = useState<boolean>(sticky ?? true);

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