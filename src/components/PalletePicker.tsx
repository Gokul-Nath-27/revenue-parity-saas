import {
  ColorResult,
  color as handleColor,
  hexToHsva,
  hsvaToHsla,
  hsvaToHslString,
  validHex,
  HsvaColor,
  hslStringToHsva,
} from '@uiw/color-convert';
import React, { forwardRef } from 'react';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
  prefixCls?: string;
  color?: string | HsvaColor;
  lightness?: number[];
  onChange?: (color: ColorResult, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const {
    prefixCls = 'w-color-slider',
    className,
    style,
    onChange,
    color,
    lightness = [80, 65, 50, 35, 20],
    ...other
  } = props;

  const hsva: HsvaColor = typeof color === 'string' && validHex(color)
    ? hexToHsva(color)
    : (color as HsvaColor || { h: 0, s: 0, v: 0, a: 1 });

  const handleClick = (hslStr: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onChange?.(handleColor(hslStringToHsva(hslStr)), event);
  };

  const containerClass = [prefixCls, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      style={{ display: 'flex', ...style }}
      className={containerClass}
      {...other}
    >
      {lightness.map((num, idx) => {
        const { h } = hsvaToHsla(hsva);
        const hslStr = `hsl(${h}, 50%, ${num}%)`;
        const isChecked = hslStr === hsvaToHslString(hsva);

        return (
          <div
            key={idx}
            style={{
              paddingLeft: 1,
              width: `${100 / lightness.length}%`,
              boxSizing: 'border-box',
            }}
          >
            <div
              onClick={(event) => handleClick(hslStr, event)}
              style={{
                backgroundColor: hslStr,
                height: 12,
                cursor: 'pointer',
                ...(isChecked && {
                  borderRadius: 2,
                  transform: 'scale(1, 1.5)',
                }),
              }}
            />
          </div>
        );
      })}
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;
