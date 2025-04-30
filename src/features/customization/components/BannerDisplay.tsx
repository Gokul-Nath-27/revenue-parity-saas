import { Banner } from './Banner';

export default function BannerDisplay() {
  const {
    bannerColor,
    bannerStyle,
    customMessage,
    bannerPosition,
    textColor,
    fontSize,
    isSticky,
  } = Banner();

  return (
    <div
      className={`bg-gradient-to-r ${bannerColor} ${bannerStyle} ${isSticky ? 'sticky' : ''
        } ${bannerPosition === 'top' ? 'top-0' : 'bottom-0'} w-full p-4`}
      style={{
        color: textColor,
        fontSize: fontSize,
      }}
    >
      {customMessage}
    </div>
  );
} 