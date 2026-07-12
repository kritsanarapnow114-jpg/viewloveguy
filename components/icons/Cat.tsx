export type CatAccessory = "none" | "crown" | "monocle" | "bowtie" | "sunglasses";

type CatFaceProps = {
  size?: number | string;
  earColor?: string;
  faceColor?: string;
  maskColor?: string;
  mouthCurls?: boolean;
  accessory?: CatAccessory;
};

/** Small 48x48 Snowshoe cat face — used as brand icon, nav icons, avatar. */
export function CatFace({
  size = "100%",
  earColor = "#6b5545",
  faceColor = "#efe3ce",
  maskColor = "#cdb69c",
  mouthCurls = false,
  accessory = "none",
}: CatFaceProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <path d="M11 20 L14 5 L23 15 Z" fill={earColor} />
      <path d="M37 20 L34 5 L25 15 Z" fill={earColor} />
      <path d="M13.5 17 L15.5 8.5 L20 14.5 Z" fill="#f4b2ce" />
      <path d="M34.5 17 L32.5 8.5 L28 14.5 Z" fill="#f4b2ce" />
      <ellipse cx="24" cy="27" rx="14" ry="12.5" fill={faceColor} />
      <ellipse cx="24" cy="30" rx="10.5" ry="8.5" fill={maskColor} />
      <path d="M24 22 L26.5 27 L24.5 34.5 L21.5 27 Z" fill="#fbf6ea" />
      <ellipse cx="19" cy="26" rx="2.3" ry="2.9" fill="#6fa8dc" />
      <ellipse cx="29" cy="26" rx="2.3" ry="2.9" fill="#6fa8dc" />
      <circle cx="19" cy="26.6" r="1" fill="#2b2a40" />
      <circle cx="29" cy="26.6" r="1" fill="#2b2a40" />
      <path d="M22 30.5 L26 30.5 L24 33 Z" fill="#f07fab" />
      {mouthCurls && (
        <>
          <path d="M24 33 Q24 35 21.9 35.2" stroke="#a58c72" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M24 33 Q24 35 26.1 35.2" stroke="#a58c72" strokeWidth="1" fill="none" strokeLinecap="round" />
        </>
      )}
      {accessory === "crown" && (
        <>
          <path d="M15.5 13 L15.5 7.5 L19.5 10.5 L24 4.5 L28.5 10.5 L32.5 7.5 L32.5 13 Z" fill="#eec358" stroke="#c98f2e" strokeWidth="0.5" />
          <circle cx="24" cy="9.5" r="1.3" fill="#e0577a" />
          <circle cx="18.5" cy="11.5" r="0.9" fill="#7fc4e0" />
          <circle cx="29.5" cy="11.5" r="0.9" fill="#7fc4e0" />
        </>
      )}
      {accessory === "bowtie" && (
        <>
          <path d="M18 35.5 L23.3 37.8 L18 40 Z" fill="#eec358" stroke="#c98f2e" strokeWidth="0.4" />
          <path d="M30 35.5 L24.7 37.8 L30 40 Z" fill="#eec358" stroke="#c98f2e" strokeWidth="0.4" />
          <circle cx="24" cy="37.8" r="1.5" fill="#c98f2e" />
        </>
      )}
      {accessory === "monocle" && (
        <>
          <circle cx="29" cy="26" r="4.2" fill="none" stroke="#d4a339" strokeWidth="1.1" />
          <path d="M32.5 29 Q36 32 35.5 37" stroke="#d4a339" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </>
      )}
      {accessory === "sunglasses" && (
        <>
          <path d="M13 23.5 L23 23.5 L23 28.5 Q23 30 21 30 L15 30 Q13 30 13 28.5 Z" fill="#2b2a40" />
          <path d="M25 23.5 L35 23.5 L35 28.5 Q35 30 33 30 L27 30 Q25 30 25 28.5 Z" fill="#2b2a40" />
          <path d="M23 25 L25 25" stroke="#2b2a40" strokeWidth="1.4" />
          <ellipse cx="17.5" cy="25.5" rx="2.4" ry="1.4" fill="#fff" opacity="0.22" />
          <ellipse cx="29.5" cy="25.5" rx="2.4" ry="1.4" fill="#fff" opacity="0.22" />
        </>
      )}
    </svg>
  );
}

/** Big 64x64 illustrated hero cat — used on the login page. */
export function CatHero({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="rgba(90,60,130,.18)" />
      <path d="M14 27 L18 6 L31 20 Z" fill="#6b5545" />
      <path d="M50 27 L46 6 L33 20 Z" fill="#6b5545" />
      <path d="M17.5 23 L20 10 L27 19 Z" fill="#f4b2ce" />
      <path d="M46.5 23 L44 10 L37 19 Z" fill="#f4b2ce" />
      <ellipse cx="32" cy="37" rx="20" ry="17.5" fill="#efe3ce" />
      <ellipse cx="32" cy="41" rx="14.5" ry="12" fill="#cdb69c" />
      <path d="M32 29 L35.5 36 L32.5 46 L28.5 36 Z" fill="#fbf6ea" />
      <circle cx="20" cy="43" r="3.2" fill="#e6a9c4" />
      <circle cx="44" cy="43" r="3.2" fill="#e6a9c4" />
      <ellipse cx="25" cy="35" rx="3" ry="4" fill="#6fa8dc" />
      <ellipse cx="39" cy="35" rx="3" ry="4" fill="#6fa8dc" />
      <circle cx="25" cy="36" r="1.4" fill="#2b2a40" />
      <circle cx="39" cy="36" r="1.4" fill="#2b2a40" />
      <circle cx="24" cy="34.2" r="0.7" fill="#fff" />
      <circle cx="38" cy="34.2" r="0.7" fill="#fff" />
      <path d="M29 41 L35 41 L32 44.5 Z" fill="#f07fab" />
      <path d="M32 44.5 Q32 47.5 28.3 47.9" stroke="#a58c72" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M32 44.5 Q32 47.5 35.7 47.9" stroke="#a58c72" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <g stroke="#efe3ce" strokeWidth="1.2" strokeLinecap="round" opacity=".9">
        <path d="M11 37 L19 38" />
        <path d="M11 41 L19 40.5" />
        <path d="M53 37 L45 38" />
        <path d="M53 41 L45 40.5" />
      </g>
      <ellipse cx="21" cy="53.5" rx="4.2" ry="3" fill="#fbf6ea" />
      <ellipse cx="43" cy="53.5" rx="4.2" ry="3" fill="#fbf6ea" />
    </svg>
  );
}

type CatEmptyVariant = "happy" | "sleepy" | "blush";

/** 64x64 empty-state cat faces used on "nothing here" panels. */
export function CatEmpty({ size = "100%", variant = "happy" }: { size?: number | string; variant?: CatEmptyVariant }) {
  const showCheeks = variant === "happy" || variant === "blush";
  const showHappyEyes = variant === "happy";
  const showOpenEyes = variant === "sleepy" || variant === "blush";
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block" }}>
      <path d="M14 27 L18 6 L31 20 Z" fill="#6b5545" />
      <path d="M50 27 L46 6 L33 20 Z" fill="#6b5545" />
      <path d="M17.5 23 L20 10 L27 19 Z" fill="#f4b2ce" />
      <path d="M46.5 23 L44 10 L37 19 Z" fill="#f4b2ce" />
      <ellipse cx="32" cy="37" rx="20" ry="17.5" fill="#efe3ce" />
      <ellipse cx="32" cy="41" rx="14.5" ry="12" fill="#cdb69c" />
      <path d="M32 29 L35.5 36 L32.5 46 L28.5 36 Z" fill="#fbf6ea" />
      {showCheeks && (
        <>
          <circle cx="20" cy="43" r="3.2" fill="#e6a9c4" />
          <circle cx="44" cy="43" r="3.2" fill="#e6a9c4" />
        </>
      )}
      {showOpenEyes && (
        <>
          <ellipse cx="25" cy="35" rx="3" ry="4" fill="#6fa8dc" />
          <ellipse cx="39" cy="35" rx="3" ry="4" fill="#6fa8dc" />
          <circle cx="25" cy="36" r="1.4" fill="#2b2a40" />
          <circle cx="39" cy="36" r="1.4" fill="#2b2a40" />
        </>
      )}
      {showHappyEyes && (
        <>
          <path d="M22 34 Q25 37 28 34" stroke="#2b2a40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M36 34 Q39 37 42 34" stroke="#2b2a40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d="M29 41 L35 41 L32 44.5 Z" fill="#f07fab" />
    </svg>
  );
}
