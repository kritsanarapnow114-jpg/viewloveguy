const FUR = "#FDBA74";
const FUR_DEEP = "#FB923C";
const FUR_LIGHT = "#FFF7ED";
const EYE = "#5B3A21";
const BLUSH = "#FBB6CE";

type IconSize = { size?: number | string };

/** 48x48 minimal round dog face — flat shapes, no outline, soft and friendly. */
export function DogFace({ size = "100%" }: IconSize) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
      <circle cx="9" cy="19" r="6.6" fill={FUR_DEEP} />
      <circle cx="39" cy="19" r="6.6" fill={FUR_DEEP} />
      <circle cx="24" cy="27" r="17" fill={FUR} />
      <ellipse cx="24" cy="30.5" rx="12.5" ry="10" fill={FUR_LIGHT} />
      <ellipse cx="17.5" cy="27" rx="2.6" ry="3" fill={EYE} />
      <ellipse cx="30.5" cy="27" rx="2.6" ry="3" fill={EYE} />
      <circle cx="16.4" cy="25.6" r="0.85" fill="#fff" />
      <circle cx="29.4" cy="25.6" r="0.85" fill="#fff" />
      <ellipse cx="24" cy="33" rx="2.6" ry="2" fill={EYE} />
      <path d="M24 34.9 Q24 36.6 21.8 37" stroke={EYE} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M24 34.9 Q24 36.6 26.2 37" stroke={EYE} strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="12.5" cy="32" r="2.2" fill={BLUSH} opacity="0.8" />
      <circle cx="35.5" cy="32" r="2.2" fill={BLUSH} opacity="0.8" />
    </svg>
  );
}

/** 48x64 minimal sitting dog — soft round ears and body, flat colors, no ink outline. */
export function DogSitting({ size = "100%" }: IconSize) {
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="24" cy="61.5" rx="15" ry="2.2" fill="rgba(251,146,60,.12)" />
      <path d="M34 47 Q46 43 42 29 Q40 21 32 22.5" fill={FUR} />
      <ellipse cx="24" cy="47" rx="15" ry="15.5" fill={FUR} />
      <ellipse cx="24" cy="52" rx="9.5" ry="9.5" fill={FUR_LIGHT} />
      <ellipse cx="16.5" cy="59.5" rx="4.8" ry="3.7" fill={FUR_LIGHT} />
      <ellipse cx="31.5" cy="59.5" rx="4.8" ry="3.7" fill={FUR_LIGHT} />
      <circle cx="10" cy="16" r="6.4" fill={FUR_DEEP} />
      <circle cx="38" cy="16" r="6.4" fill={FUR_DEEP} />
      <circle cx="24" cy="24" r="16.5" fill={FUR} />
      <ellipse cx="24" cy="27" rx="12" ry="9.5" fill={FUR_LIGHT} />
      <ellipse cx="17.7" cy="24" rx="2.5" ry="3" fill={EYE} />
      <ellipse cx="30.3" cy="24" rx="2.5" ry="3" fill={EYE} />
      <circle cx="16.6" cy="22.7" r="0.8" fill="#fff" />
      <circle cx="29.2" cy="22.7" r="0.8" fill="#fff" />
      <ellipse cx="24" cy="29.7" rx="2.5" ry="1.9" fill={EYE} />
      <path d="M24 31.4 Q24 33.1 21.9 33.5" stroke={EYE} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M24 31.4 Q24 33.1 26.1 33.5" stroke={EYE} strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="30" r="2.1" fill={BLUSH} opacity="0.8" />
      <circle cx="35" cy="30" r="2.1" fill={BLUSH} opacity="0.8" />
    </svg>
  );
}
