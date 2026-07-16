const INK = "#2b1f18";
const FUR = "#eeab63";
const FUR_DARK = "#c9873f";
const FUR_LIGHT = "#f9d8a8";

function StickerDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="1.1" floodColor="#3a2e22" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

/** 48x48 bear-face Pomeranian — round flat face, small round ears, no visible snout. */
export function DogFace({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <StickerDefs id="dogFaceShadow" />
      <g filter="url(#dogFaceShadow)">
        <circle cx="9" cy="19" r="6.4" fill={FUR} stroke={INK} strokeWidth="1.3" />
        <circle cx="39" cy="19" r="6.4" fill={FUR} stroke={INK} strokeWidth="1.3" />
        <circle cx="9" cy="20" r="3.2" fill={FUR_DARK} />
        <circle cx="39" cy="20" r="3.2" fill={FUR_DARK} />
        <circle cx="24" cy="27" r="17" fill={FUR} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="24" cy="30.5" rx="12.5" ry="10" fill={FUR_LIGHT} />
        <ellipse cx="17.5" cy="27" rx="2.7" ry="3.2" fill={INK} />
        <ellipse cx="30.5" cy="27" rx="2.7" ry="3.2" fill={INK} />
        <circle cx="16.4" cy="25.6" r="0.85" fill="#fff" />
        <circle cx="29.4" cy="25.6" r="0.85" fill="#fff" />
        <ellipse cx="24" cy="33" rx="2.7" ry="2.1" fill={INK} />
        <path d="M24 34.9 Q24 36.8 21.6 37.2" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M24 34.9 Q24 36.8 26.4 37.2" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="12.5" cy="32" r="2.1" fill="#f2a9c4" opacity="0.75" />
        <circle cx="35.5" cy="32" r="2.1" fill="#f2a9c4" opacity="0.75" />
      </g>
    </svg>
  );
}

/** 48x64 full-body sitting bear-face Pomeranian — fluffy plume tail, stubby paws. */
export function DogSitting({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} style={{ display: "block" }}>
      <StickerDefs id="dogSitShadow" />
      <g filter="url(#dogSitShadow)">
        <path d="M35 48 Q47 44 43 29 Q41 20 32 22" fill={FUR} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <ellipse cx="24" cy="47" rx="15" ry="15.5" fill={FUR} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="24" cy="52" rx="9.5" ry="9.5" fill={FUR_LIGHT} />
        <ellipse cx="16.5" cy="60.5" rx="4.8" ry="3.8" fill={FUR_LIGHT} stroke={INK} strokeWidth="1.2" />
        <ellipse cx="31.5" cy="60.5" rx="4.8" ry="3.8" fill={FUR_LIGHT} stroke={INK} strokeWidth="1.2" />
        <circle cx="10" cy="16" r="6.2" fill={FUR} stroke={INK} strokeWidth="1.3" />
        <circle cx="38" cy="16" r="6.2" fill={FUR} stroke={INK} strokeWidth="1.3" />
        <circle cx="10" cy="17" r="3.1" fill={FUR_DARK} />
        <circle cx="38" cy="17" r="3.1" fill={FUR_DARK} />
        <circle cx="24" cy="24" r="16.5" fill={FUR} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="24" cy="27" rx="12" ry="9.5" fill={FUR_LIGHT} />
        <ellipse cx="17.7" cy="24" rx="2.6" ry="3.1" fill={INK} />
        <ellipse cx="30.3" cy="24" rx="2.6" ry="3.1" fill={INK} />
        <circle cx="16.6" cy="22.7" r="0.8" fill="#fff" />
        <circle cx="29.2" cy="22.7" r="0.8" fill="#fff" />
        <ellipse cx="24" cy="29.7" rx="2.6" ry="2" fill={INK} />
        <path d="M24 31.5 Q24 33.3 21.7 33.7" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M24 31.5 Q24 33.3 26.3 33.7" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
