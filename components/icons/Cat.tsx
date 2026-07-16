/** Shared "sticker" look: bold dark outline + soft drop shadow, like a die-cut vinyl sticker. */
function StickerDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="1.1" floodColor="#3a2e22" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

const INK = "#2b1f18";
const SEAL = "#5a4636";
const CREAM = "#fff9ef";

type CatFaceProps = { size?: number | string };

/** 48x48 Snowshoe cat face — seal-point mask, blue eyes, white blaze. Used as a small icon. */
export function CatFace({ size = "100%" }: CatFaceProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <StickerDefs id="catFaceShadow" />
      <g filter="url(#catFaceShadow)">
        <path d="M10 21 L13 4 L23 15 Z" fill={SEAL} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M38 21 L35 4 L25 15 Z" fill={SEAL} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M13 17 L15 8 L20 14 Z" fill="#f2a9c4" />
        <path d="M35 17 L33 8 L28 14 Z" fill="#f2a9c4" />
        <ellipse cx="24" cy="27" rx="15" ry="13.5" fill={CREAM} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="24" cy="30" rx="11" ry="9" fill={SEAL} stroke={INK} strokeWidth="1.1" />
        <path d="M24 19.5 L27.2 27 L24.5 36.5 L20.8 27 Z" fill={CREAM} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
        <ellipse cx="18" cy="27" rx="3.7" ry="4.3" fill="#4fa3d9" stroke={INK} strokeWidth="1.1" />
        <ellipse cx="30" cy="27" rx="3.7" ry="4.3" fill="#4fa3d9" stroke={INK} strokeWidth="1.1" />
        <circle cx="18" cy="27.7" r="1.5" fill={INK} />
        <circle cx="30" cy="27.7" r="1.5" fill={INK} />
        <circle cx="16.7" cy="25.6" r="1" fill="#fff" />
        <circle cx="28.7" cy="25.6" r="1" fill="#fff" />
        <path d="M22.2 31.6 L25.8 31.6 L24 34.2 Z" fill="#e8749a" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M24 34.2 Q24 36.5 21.5 36.8" stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M24 34.2 Q24 36.5 26.5 36.8" stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

type CatSittingProps = { size?: number | string };

/** 48x64 full-body sitting Snowshoe cat — seal-point tail/ears/mask, white paws. */
export function CatSitting({ size = "100%" }: CatSittingProps) {
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} style={{ display: "block" }}>
      <StickerDefs id="catSitShadow" />
      <g filter="url(#catSitShadow)">
        <path d="M35 50 Q47 47 45 31 Q44 21 34 22.5" stroke={SEAL} strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="47" rx="14" ry="15.5" fill={CREAM} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="17" cy="60.5" rx="4.6" ry="3.8" fill={CREAM} stroke={INK} strokeWidth="1.2" />
        <ellipse cx="31" cy="60.5" rx="4.6" ry="3.8" fill={CREAM} stroke={INK} strokeWidth="1.2" />
        <path d="M11 15 L14 -1 L23 10 Z" fill={SEAL} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M37 15 L34 -1 L25 10 Z" fill={SEAL} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M13.5 12 L15.5 3 L20 9.5 Z" fill="#f2a9c4" />
        <path d="M34.5 12 L32.5 3 L28 9.5 Z" fill="#f2a9c4" />
        <ellipse cx="24" cy="22" rx="14.5" ry="12.5" fill={CREAM} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="24" cy="25" rx="10.7" ry="8.7" fill={SEAL} stroke={INK} strokeWidth="1.1" />
        <path d="M24 14.5 L27.2 22 L24.5 31.5 L20.8 22 Z" fill={CREAM} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
        <ellipse cx="18" cy="22" rx="3.7" ry="4.3" fill="#4fa3d9" stroke={INK} strokeWidth="1.1" />
        <ellipse cx="30" cy="22" rx="3.7" ry="4.3" fill="#4fa3d9" stroke={INK} strokeWidth="1.1" />
        <circle cx="18" cy="22.7" r="1.5" fill={INK} />
        <circle cx="30" cy="22.7" r="1.5" fill={INK} />
        <circle cx="16.7" cy="20.6" r="1" fill="#fff" />
        <circle cx="28.7" cy="20.6" r="1" fill="#fff" />
        <path d="M22.2 26.6 L25.8 26.6 L24 29.2 Z" fill="#e8749a" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Big 84x84 hero illustration used on the login page. */
export function CatHero({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 84 84" width={size} height={size} style={{ display: "block" }}>
      <StickerDefs id="catHeroShadow" />
      <g filter="url(#catHeroShadow)">
        <ellipse cx="42" cy="78" rx="22" ry="4" fill="rgba(60,40,30,.18)" />
        <path d="M17 34 L22 8 L38 24 Z" fill={SEAL} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M67 34 L62 8 L46 24 Z" fill={SEAL} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M21.5 28 L25 13 L34 22.5 Z" fill="#f2a9c4" />
        <path d="M62.5 28 L59 13 L50 22.5 Z" fill="#f2a9c4" />
        <ellipse cx="42" cy="46" rx="26" ry="22.5" fill={CREAM} stroke={INK} strokeWidth="1.8" />
        <ellipse cx="42" cy="51" rx="19" ry="15.5" fill={SEAL} stroke={INK} strokeWidth="1.4" />
        <path d="M42 32 L46.7 45 L42.7 60.5 L37.3 45 Z" fill={CREAM} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
        <ellipse cx="32.5" cy="45" rx="4.6" ry="5.4" fill="#4fa3d9" stroke={INK} strokeWidth="1.3" />
        <ellipse cx="51.5" cy="45" rx="4.6" ry="5.4" fill="#4fa3d9" stroke={INK} strokeWidth="1.3" />
        <circle cx="32.5" cy="46" r="1.9" fill={INK} />
        <circle cx="51.5" cy="46" r="1.9" fill={INK} />
        <circle cx="30.7" cy="43.1" r="1.3" fill="#fff" />
        <circle cx="49.7" cy="43.1" r="1.3" fill="#fff" />
        <circle cx="24.5" cy="53" r="3.6" fill="#f2a9c4" opacity="0.75" />
        <circle cx="59.5" cy="53" r="3.6" fill="#f2a9c4" opacity="0.75" />
        <path d="M38 55 L46 55 L42 60 Z" fill="#e8749a" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
        <path d="M42 60 Q42 64 37 64.5" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M42 60 Q42 64 47 64.5" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <ellipse cx="29" cy="72" rx="5.6" ry="4.2" fill={CREAM} stroke={INK} strokeWidth="1.3" />
        <ellipse cx="55" cy="72" rx="5.6" ry="4.2" fill={CREAM} stroke={INK} strokeWidth="1.3" />
      </g>
    </svg>
  );
}
