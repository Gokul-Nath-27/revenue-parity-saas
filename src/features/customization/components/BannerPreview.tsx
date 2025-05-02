"use client"
import { useBanner } from './BannerContext';

type BannerPreviewProps = {
  canRemoveBranding: boolean;
  mappings: {
    discount: string;
    coupon: string;
    country: string;
  };
}


export function BannerPreview({
  canRemoveBranding,
  mappings,
}: BannerPreviewProps) {
  const { customization } = useBanner();
  const {
    background_color,
    text_color,
    font_size,
    sticky,
    banner_radius,
    class_prefix,
    location_message,
  } = customization;

  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), value)
    },
    location_message.replace(/'/g, "&#39;")
  )
  return (
    <>
      <style type="text/css">
        {`
        .${class_prefix}-revenue-parity {
          all: revert;
          display: flex;
          flex-direction: column;
          gap: .5em;
          background-color: ${background_color};
          color: ${text_color};
          font-size: ${font_size};
          font-family: inherit;
          padding: 1rem;
          border-radius: ${banner_radius};
          ${sticky ? "position: sticky;" : ""}
          left: 0;
          right: 0;
          top: 0;
        }

        .${class_prefix}-revenue-parity-branding {
          text-align: end;
          color: inherit;
          font-size: 0.8rem;
        }
      `}
      </style>
      <div className={`${class_prefix}-revenue-parity`}>
        <p className="font-semibold" dangerouslySetInnerHTML={{ __html: mappedMessage }} />
        {!canRemoveBranding && (
          <p className={`${class_prefix}-revenue-parity-branding`}>powered by
            &nbsp;
            <a
              href="https://revenue-parity.vercel.app/"
              style={{
                textDecoration: "underline",
                fontWeight: "semibold",
              }}
            >
              revenue parity
            </a>
          </p>
        )}
      </div>

    </>
  );
}