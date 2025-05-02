"use client"
import { hsvaToHslString } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import React, { useEffect, useState } from 'react';

import Slider from '@/components/PalletePicker';
import { Button } from '@/components/ui/button'; // assuming you have a Button component
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // adjust the path if needed
import { useBanner } from '@/features/customization/components/BannerContext';



export default function ColorPicker({ name }: { name: string }) {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  const { setBanner } = useBanner();

  useEffect(() => {
    const hslString = hsvaToHslString(hsva);
    setBanner({ [name]: hslString });
  }, [hsva, name, setBanner]);

  return (
    <>
      <Slider
        color={hsva}
        style={{ paddingBottom: 10 }}
        onChange={(color) => {
          setHsva({ ...hsva, ...color.hsv });
        }}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Pick Color</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-fit" align="start">
          <Colorful
            color={hsva}
            onChange={(color) => {
              setHsva(color.hsva);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
