type BannerPreviewProps = {
  location_message: string;
  canRemoveBranding: boolean;
  mappings: {
    discount: string;
    coupon: string;
    country: string;
  };
  customization: {
    location_message: string;
    banner_container: string;
    background_color: string;
    text_color: string;
    font_size: string;
    sticky: boolean;
    banner_radius: string;
    class_prefix?: string | null;
  }
}


export function BannerPreview({
  location_message,
  canRemoveBranding,
  customization,
  mappings,
}: BannerPreviewProps) {
  const {
    background_color,
    text_color,
    font_size,
    sticky,
    banner_radius,
    class_prefix,
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