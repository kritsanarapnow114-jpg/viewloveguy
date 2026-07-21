const PURPLE = "#8B5CF6";
const PURPLE_DEEP = "#7C3AED";
const CREAM = "#FFF6EA";
const BLUSH = "#FBB6CE";
const EYE = "#38BDF8";
const NOSE = "#F43F5E";

type IconSize = { size?: number | string };

/** 48x48 minimal round cat face — flat shapes, no outline, soft and friendly. */
export function CatFace({ size = "100%" }: IconSize) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <path d="M10 20 Q9 8 13 6 Q18 9 20 17 Z" fill={PURPLE} />
      <path d="M38 20 Q39 8 35 6 Q30 9 28 17 Z" fill={PURPLE} />
      <circle cx="24" cy="26" r="16" fill={CREAM} />
      <ellipse cx="17" cy="25.5" rx="3.4" ry="4" fill={EYE} />
      <ellipse cx="31" cy="25.5" rx="3.4" ry="4" fill={EYE} />
      <circle cx="15.8" cy="23.6" r="1.05" fill="#fff" />
      <circle cx="29.8" cy="23.6" r="1.05" fill="#fff" />
      <circle cx="12.5" cy="30.5" r="2.9" fill={BLUSH} opacity="0.85" />
      <circle cx="35.5" cy="30.5" r="2.9" fill={BLUSH} opacity="0.85" />
      <path d="M22 30 L26 30 L24 32.3 Z" fill={NOSE} />
    </svg>
  );
}

/** 48x64 minimal sitting cat — soft blob body, flat colors, no ink outline. */
export function CatSitting({ size = "100%" }: IconSize) {
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="24" cy="61.5" rx="15" ry="2.2" fill="rgba(124,58,237,.10)" />
      <path d="M34 51 Q46 47 43 33 Q41 24 33 25.5" fill={PURPLE} opacity="0.9" />
      <ellipse cx="24" cy="47" rx="14.5" ry="15.5" fill={CREAM} />
      <ellipse cx="17" cy="59.5" rx="4.6" ry="3.6" fill={CREAM} />
      <ellipse cx="31" cy="59.5" rx="4.6" ry="3.6" fill={CREAM} />
      <path d="M11 16 Q10 3 14 1 Q19 4 21 13 Z" fill={PURPLE} />
      <path d="M37 16 Q38 3 34 1 Q29 4 27 13 Z" fill={PURPLE} />
      <circle cx="24" cy="22" r="15" fill={CREAM} />
      <ellipse cx="17.3" cy="21.5" rx="3.4" ry="4" fill={EYE} />
      <ellipse cx="30.7" cy="21.5" rx="3.4" ry="4" fill={EYE} />
      <circle cx="16.1" cy="19.6" r="1.05" fill="#fff" />
      <circle cx="29.5" cy="19.6" r="1.05" fill="#fff" />
      <circle cx="12.2" cy="26.5" r="2.7" fill={BLUSH} opacity="0.85" />
      <circle cx="35.8" cy="26.5" r="2.7" fill={BLUSH} opacity="0.85" />
      <path d="M22 26 L26 26 L24 28.3 Z" fill={NOSE} />
    </svg>
  );
}

/** Big 84x84 hero illustration used on the login page. */
export function CatHero({ size = "100%" }: IconSize) {
  return (
    <svg viewBox="0 0 84 84" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="42" cy="79" rx="22" ry="3.5" fill="rgba(124,58,237,.12)" />
      <path d="M19 34 Q17 12 24 8 Q33 13 36 28 Z" fill={PURPLE} />
      <path d="M65 34 Q67 12 60 8 Q51 13 48 28 Z" fill={PURPLE} />
      <circle cx="42" cy="46" r="27" fill={CREAM} />
      <ellipse cx="31.5" cy="45" rx="5.2" ry="6" fill={EYE} />
      <ellipse cx="52.5" cy="45" rx="5.2" ry="6" fill={EYE} />
      <circle cx="29.6" cy="42" r="1.7" fill="#fff" />
      <circle cx="50.6" cy="42" r="1.7" fill="#fff" />
      <circle cx="23.5" cy="54" r="4.4" fill={BLUSH} opacity="0.85" />
      <circle cx="60.5" cy="54" r="4.4" fill={BLUSH} opacity="0.85" />
      <path d="M38 55.5 L46 55.5 L42 60 Z" fill={NOSE} />
      <path d="M42 60 Q42 64 36.5 64.5" stroke={PURPLE_DEEP} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M42 60 Q42 64 47.5 64.5" stroke={PURPLE_DEEP} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="29" cy="73" rx="5.8" ry="4.3" fill={CREAM} />
      <ellipse cx="55" cy="73" rx="5.8" ry="4.3" fill={CREAM} />
    </svg>
  );
}

/** 84x84 cat hugging a big coin — used to warm up money-related confirmation popups. */
export function CatCoin({ size = "100%" }: IconSize) {
  const GOLD = "#FBBF24";
  const GOLD_DEEP = "#D97706";
  return (
    <svg viewBox="0 0 84 84" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="42" cy="79" rx="24" ry="3" fill="rgba(124,58,237,.10)" />
      <path d="M18 33 Q16 14 22 11 Q30 15 33 27 Z" fill={PURPLE} />
      <path d="M66 33 Q68 14 62 11 Q54 15 51 27 Z" fill={PURPLE} />
      <ellipse cx="42" cy="35" rx="21" ry="18.5" fill={CREAM} />
      <ellipse cx="34" cy="35.5" rx="4.1" ry="4.8" fill={EYE} />
      <ellipse cx="50" cy="35.5" rx="4.1" ry="4.8" fill={EYE} />
      <circle cx="32.4" cy="33" r="1.35" fill="#fff" />
      <circle cx="48.4" cy="33" r="1.35" fill="#fff" />
      <path d="M39.7 41.2 L44.3 41.2 L42 44.2 Z" fill={NOSE} />

      <circle cx="42" cy="58" r="21" fill={GOLD} />
      <circle cx="42" cy="58" r="16" fill="none" stroke={GOLD_DEEP} strokeWidth="1.6" opacity="0.55" />
      <text x="42" y="65" textAnchor="middle" fontSize="20" fontWeight="700" fill={GOLD_DEEP} fontFamily="sans-serif">
        ฿
      </text>

      <ellipse cx="17" cy="60" rx="7.5" ry="6" fill={CREAM} transform="rotate(-18 17 60)" />
      <ellipse cx="67" cy="60" rx="7.5" ry="6" fill={CREAM} transform="rotate(18 67 60)" />
    </svg>
  );
}

/** Simple solid paw-print silhouette, used as a decorative status watermark. */
export function PawPrint({ color = "#000", size = "100%" }: { color?: string; size?: number | string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="24" cy="33" rx="12.5" ry="10.5" fill={color} />
      <ellipse cx="8.5" cy="19" rx="5" ry="6.2" fill={color} transform="rotate(-18 8.5 19)" />
      <ellipse cx="19" cy="9" rx="5" ry="6.4" fill={color} transform="rotate(-6 19 9)" />
      <ellipse cx="30" cy="9" rx="5" ry="6.4" fill={color} transform="rotate(6 30 9)" />
      <ellipse cx="40.5" cy="19" rx="5" ry="6.2" fill={color} transform="rotate(18 40.5 19)" />
    </svg>
  );
}
