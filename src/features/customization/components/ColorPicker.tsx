"use client"
import { hsvaToHslString, hslStringToHsva } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import React, { useEffect, useState } from 'react';

import Slider from '@/components/PalletePicker';
import { Button } from '@/components/ui/button'; // assuming you have a Button component
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // adjust the path if needed
import { useBanner } from '@/features/customization/components/BannerContext';

const colorKeys = [
  'background_color',
  'text_color',
] as const;

export default function ColorPicker({ name }: { name: typeof colorKeys[number] }) {
  const { customization: { [name]: color }, setBanner, canCustomizeBanner } = useBanner();
  const [hsva, setHsva] = useState(hslStringToHsva(color));

  useEffect(() => {
    const hslString = hsvaToHslString(hsva);
    setBanner({ [name]: hslString });
  }, [hsva, name, setBanner]);

  return (
    <ColorPickerNotAllowed canCustomizeBanner={canCustomizeBanner}>
      <input type="hidden" name={name} value={color} />
      <Slider
        className='pb-4'
        color={hsva}
        onChange={(color) => setHsva({ ...hsva, ...color.hsv })}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Pick Color</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-fit" align="start">
          <Colorful
            color={hsva}
            onChange={(color) => setHsva(color.hsva)}
          />
        </PopoverContent>
      </Popover>
    </ColorPickerNotAllowed>
  );
}


const ColorPickerNotAllowed = ({ children, canCustomizeBanner }: { children: React.ReactNode, canCustomizeBanner: boolean }) => {
  if (!canCustomizeBanner) return (
    <div className="cursor-not-allowed">
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  )
  return children;
}