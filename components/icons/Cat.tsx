export type CatAccessory =
  | "none"
  | "crown"
  | "monocle"
  | "bowtie"
  | "sunglasses"
  | "tophat"
  | "necklace"
  | "heroRed"
  | "heroBlue"
  | "heroGreen"
  | "heroPurple"
  | "heroGold"
  | "heroBlack"
  | "jobBoss"
  | "jobBanker"
  | "jobCashier"
  | "jobChef"
  | "jobRider"
  | "jobAccountant";

const HERO_COLORS: Record<string, string> = {
  heroRed: "#e0524a",
  heroBlue: "#4a80e0",
  heroGreen: "#4aa87a",
  heroPurple: "#8a5fd0",
  heroGold: "#d4a339",
  heroBlack: "#3a3852",
};

/** Shared vest/collar silhouette that each profession outfit recolors and adds details to. */
function VestBase({ color, stroke }: { color: string; stroke?: string }) {
  return (
    <path
      d="M14.5 30 Q14.5 28 17 28.3 L20.5 33 L24 29.8 L27.5 33 L31 28.3 Q33.5 28 33.5 30 L33.5 42.5 L14.5 42.5 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={stroke ? 0.8 : 0}
    />
  );
}

function CatAccessoryOverlay({ accessory }: { accessory: CatAccessory }) {
  const heroColor = HERO_COLORS[accessory];
  return (
    <>
      {heroColor && (
        <>
          {/* domino mask — generic superhero look, not tied to any specific character */}
          <path
            d="M14.8 25.2 Q15.3 22.2 19.2 22 Q22.8 21.8 24 24.3 Q25.2 21.8 28.8 22 Q32.7 22.2 33.2 25.2 Q33.4 29.6 28.8 29.4 Q25 29.7 24 27.4 Q23 29.7 19.2 29.4 Q14.6 29.6 14.8 25.2 Z"
            fill={heroColor}
          />
          <g fill={heroColor} stroke="#fff" strokeWidth="0.3">
            <path d="M24 35 L25.2 38 L24 41 L22.8 38 Z" />
            <path d="M21.2 38 L24 36.8 L26.8 38 L24 39.2 Z" />
          </g>
        </>
      )}
      {accessory === "jobBoss" && (
        <>
          <VestBase color="#33303f" />
          <path d="M22 30 L24 33.2 L26 30 Z" fill="#fff" />
          <path d="M22.6 31 L25.4 31 L24 40 Z" fill="#d4a339" />
          <rect x="23.3" y="34" width="1.4" height="2.4" fill="#33303f" />
        </>
      )}
      {accessory === "jobBanker" && (
        <>
          <VestBase color="#2d3a6b" />
          <path d="M22 30 L24 33.2 L26 30 Z" fill="#fff" />
          <path d="M22.6 31 L25.4 31 L24 39.5 Z" fill="#c94a4a" />
        </>
      )}
      {accessory === "jobCashier" && (
        <>
          <VestBase color="#3fa79b" />
          <rect x="20" y="35.5" width="8" height="5.5" rx="1.2" fill="#2f8f83" stroke="#2a7a70" strokeWidth="0.4" />
        </>
      )}
      {accessory === "jobChef" && (
        <>
          <ellipse cx="24" cy="10.5" rx="7.5" ry="5.8" fill="#fff" stroke="#ddd2bd" strokeWidth="0.8" />
          <rect x="17.5" y="13.5" width="13" height="3.4" rx="1.7" fill="#fff" stroke="#ddd2bd" strokeWidth="0.8" />
          <VestBase color="#fdfbf6" stroke="#ddd2bd" />
          <path d="M20 30.5 L24 32.5 L20 34.5 Z" fill="#c94a4a" />
          <path d="M28 30.5 L24 32.5 L28 34.5 Z" fill="#c94a4a" />
          <circle cx="24" cy="32.5" r="1.2" fill="#a83636" />
        </>
      )}
      {accessory === "jobRider" && (
        <>
          <path d="M13 10 Q24 5.5 35 10 L35 13 Q24 9.5 13 13 Z" fill="#2b2a40" />
          <ellipse cx="24" cy="9.3" rx="2.4" ry="1.2" fill="#ef8a30" />
          <VestBase color="#ef8a30" />
          <path d="M18 32 L23 42" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M30 32 L25 42" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {accessory === "jobAccountant" && (
        <>
          <VestBase color="#7a3b4a" />
          <path d="M28 34 L29.5 34 L29 39 Z" fill="#d4a339" />
          <rect x="15.5" y="23.7" width="7" height="5" rx="1" fill="none" stroke="#3a3852" strokeWidth="1.2" />
          <rect x="25.5" y="23.7" width="7" height="5" rx="1" fill="none" stroke="#3a3852" strokeWidth="1.2" />
          <path d="M22.5 25.7 L25.5 25.7" stroke="#3a3852" strokeWidth="1.2" />
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
      {accessory === "tophat" && (
        <>
          <path d="M16 13.5 L32 13.5 L32 14.8 L16 14.8 Z" fill="#2b2a40" />
          <path d="M18.5 13.5 L29.5 13.5 L28.5 3 L19.5 3 Z" fill="#3a3852" />
          <path d="M18.5 6 L29.5 6 L29.5 7.5 L18.5 7.5 Z" fill="#c98f2e" />
        </>
      )}
      {accessory === "necklace" && (
        <>
          <path d="M16 35 Q24 41 32 35" stroke="#eec358" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="39.8" r="1.6" fill="#e0577a" stroke="#c98f2e" strokeWidth="0.4" />
        </>
      )}
    </>
  );
}

type CatFaceProps = {
  size?: number | string;
  earColor?: string;
  faceColor?: string;
  maskColor?: string;
  mouthCurls?: boolean;
  accessory?: CatAccessory;
};

/** Small 48x48 cute orange-and-cream cat face — used as brand icon, nav icons, avatar. */
export function CatFace({
  size = "100%",
  earColor = "#ee9c55",
  faceColor = "#fff3e2",
  maskColor = "#fffaf2",
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
      <path d="M24 22 L26.5 27 L24.5 34.5 L21.5 27 Z" fill="#fffdf9" />
      <circle cx="15.5" cy="29.5" r="2.4" fill="#ffb9c9" opacity="0.75" />
      <circle cx="32.5" cy="29.5" r="2.4" fill="#ffb9c9" opacity="0.75" />
      <ellipse cx="19" cy="26" rx="2.3" ry="2.9" fill="#7bc47f" />
      <ellipse cx="29" cy="26" rx="2.3" ry="2.9" fill="#7bc47f" />
      <circle cx="19" cy="26.6" r="1" fill="#2b2a40" />
      <circle cx="29" cy="26.6" r="1" fill="#2b2a40" />
      <circle cx="18.3" cy="25.3" r="0.55" fill="#fff" />
      <circle cx="28.3" cy="25.3" r="0.55" fill="#fff" />
      <path d="M22 30.5 L26 30.5 L24 33 Z" fill="#f07fab" />
      {mouthCurls && (
        <>
          <path d="M24 33 Q24 35 21.9 35.2" stroke="#a58c72" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M24 33 Q24 35 26.1 35.2" stroke="#a58c72" strokeWidth="1" fill="none" strokeLinecap="round" />
        </>
      )}
      <CatAccessoryOverlay accessory={accessory} />
    </svg>
  );
}

type CatPose = "sit" | "stand" | "wave";

type CatSittingProps = {
  size?: number | string;
  earColor?: string;
  faceColor?: string;
  maskColor?: string;
  bodyColor?: string;
  accessory?: CatAccessory;
  pose?: CatPose;
};

function CatBody({ pose, bodyColor }: { pose: CatPose; bodyColor: string }) {
  if (pose === "stand") {
    return (
      <>
        <path d="M9 51 Q4 39 10 27 Q13 21 20 22" stroke={bodyColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="42" rx="11.5" ry="17" fill={bodyColor} />
        <ellipse cx="24" cy="46" rx="7" ry="11" fill="#fbf6ea" opacity="0.75" />
        <ellipse cx="12" cy="49" rx="3" ry="6.5" fill={bodyColor} />
        <ellipse cx="36" cy="49" rx="3" ry="6.5" fill={bodyColor} />
        <ellipse cx="18.5" cy="61" rx="3.7" ry="3" fill="#fbf6ea" />
        <ellipse cx="29.5" cy="61" rx="3.7" ry="3" fill="#fbf6ea" />
      </>
    );
  }
  if (pose === "wave") {
    return (
      <>
        <path d="M35 50 Q47 47 45 31 Q44 22 35 23" stroke={bodyColor} strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="47" rx="13.5" ry="15" fill={bodyColor} />
        <ellipse cx="24" cy="51" rx="8.5" ry="9.5" fill="#fbf6ea" opacity="0.75" />
        <ellipse cx="17" cy="60.5" rx="4.3" ry="3.6" fill="#fbf6ea" />
        <ellipse cx="31" cy="60.5" rx="4.3" ry="3.6" fill="#fbf6ea" />
        <path d="M34 42 Q41 37 39 28" stroke={bodyColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="39" cy="26.5" rx="3.4" ry="3" fill="#fbf6ea" />
      </>
    );
  }
  return (
    <>
      <path d="M35 50 Q47 47 45 31 Q44 22 35 23" stroke={bodyColor} strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="47" rx="13.5" ry="15" fill={bodyColor} />
      <ellipse cx="24" cy="51" rx="8.5" ry="9.5" fill="#fbf6ea" opacity="0.75" />
      <ellipse cx="17" cy="60.5" rx="4.3" ry="3.6" fill="#fbf6ea" />
      <ellipse cx="31" cy="60.5" rx="4.3" ry="3.6" fill="#fbf6ea" />
    </>
  );
}

/** Full-body 48x64 cute orange-and-cream cat, with a few poses so it doesn't look identical on every page. */
export function CatSitting({
  size = "100%",
  earColor = "#ee9c55",
  faceColor = "#fff3e2",
  maskColor = "#fffaf2",
  bodyColor = "#fff3e2",
  accessory = "none",
  pose = "sit",
}: CatSittingProps) {
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} style={{ display: "block" }}>
      <CatBody pose={pose} bodyColor={bodyColor} />
      <g>
        <path d="M11 15 L14 0 L23 10 Z" fill={earColor} />
        <path d="M37 15 L34 0 L25 10 Z" fill={earColor} />
        <path d="M13.5 12 L15.5 3.5 L20 9.5 Z" fill="#f4b2ce" />
        <path d="M34.5 12 L32.5 3.5 L28 9.5 Z" fill="#f4b2ce" />
        <ellipse cx="24" cy="22" rx="14" ry="12.5" fill={faceColor} />
        <ellipse cx="24" cy="25" rx="10.5" ry="8.5" fill={maskColor} />
        <path d="M24 17 L26.5 22 L24.5 29.5 L21.5 22 Z" fill="#fffdf9" />
        <circle cx="15.5" cy="24.5" r="2.3" fill="#ffb9c9" opacity="0.75" />
        <circle cx="32.5" cy="24.5" r="2.3" fill="#ffb9c9" opacity="0.75" />
        <ellipse cx="19" cy="21" rx="2.3" ry="2.9" fill="#7bc47f" />
        <ellipse cx="29" cy="21" rx="2.3" ry="2.9" fill="#7bc47f" />
        <circle cx="19" cy="21.6" r="1" fill="#2b2a40" />
        <circle cx="29" cy="21.6" r="1" fill="#2b2a40" />
        <circle cx="18.3" cy="20.3" r="0.55" fill="#fff" />
        <circle cx="28.3" cy="20.3" r="0.55" fill="#fff" />
        <path d="M22 25.5 L26 25.5 L24 28 Z" fill="#f07fab" />
      </g>
      <g transform="translate(0,-5)">
        <CatAccessoryOverlay accessory={accessory} />
      </g>
    </svg>
  );
}

/** Big 64x64 illustrated hero cat — used on the login page. */
export function CatHero({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block" }}>
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="rgba(90,60,130,.18)" />
      <path d="M14 27 L18 6 L31 20 Z" fill="#ee9c55" />
      <path d="M50 27 L46 6 L33 20 Z" fill="#ee9c55" />
      <path d="M17.5 23 L20 10 L27 19 Z" fill="#f4b2ce" />
      <path d="M46.5 23 L44 10 L37 19 Z" fill="#f4b2ce" />
      <ellipse cx="32" cy="37" rx="20" ry="17.5" fill="#fff3e2" />
      <ellipse cx="32" cy="41" rx="14.5" ry="12" fill="#fffaf2" />
      <path d="M32 29 L35.5 36 L32.5 46 L28.5 36 Z" fill="#fffdf9" />
      <circle cx="20" cy="43" r="3.2" fill="#ffb9c9" opacity="0.75" />
      <circle cx="44" cy="43" r="3.2" fill="#ffb9c9" opacity="0.75" />
      <ellipse cx="25" cy="35" rx="3" ry="4" fill="#7bc47f" />
      <ellipse cx="39" cy="35" rx="3" ry="4" fill="#7bc47f" />
      <circle cx="25" cy="36" r="1.4" fill="#2b2a40" />
      <circle cx="39" cy="36" r="1.4" fill="#2b2a40" />
      <circle cx="24" cy="34.2" r="0.7" fill="#fff" />
      <circle cx="38" cy="34.2" r="0.7" fill="#fff" />
      <path d="M29 41 L35 41 L32 44.5 Z" fill="#f07fab" />
      <path d="M32 44.5 Q32 47.5 28.3 47.9" stroke="#c89464" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M32 44.5 Q32 47.5 35.7 47.9" stroke="#c89464" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <g stroke="#fff3e2" strokeWidth="1.2" strokeLinecap="round" opacity=".9">
        <path d="M11 37 L19 38" />
        <path d="M11 41 L19 40.5" />
        <path d="M53 37 L45 38" />
        <path d="M53 41 L45 40.5" />
      </g>
      <ellipse cx="21" cy="53.5" rx="4.2" ry="3" fill="#fffdf9" />
      <ellipse cx="43" cy="53.5" rx="4.2" ry="3" fill="#fffdf9" />
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
      <path d="M14 27 L18 6 L31 20 Z" fill="#ee9c55" />
      <path d="M50 27 L46 6 L33 20 Z" fill="#ee9c55" />
      <path d="M17.5 23 L20 10 L27 19 Z" fill="#f4b2ce" />
      <path d="M46.5 23 L44 10 L37 19 Z" fill="#f4b2ce" />
      <ellipse cx="32" cy="37" rx="20" ry="17.5" fill="#fff3e2" />
      <ellipse cx="32" cy="41" rx="14.5" ry="12" fill="#fffaf2" />
      <path d="M32 29 L35.5 36 L32.5 46 L28.5 36 Z" fill="#fffdf9" />
      {showCheeks && (
        <>
          <circle cx="20" cy="43" r="3.2" fill="#ffb9c9" opacity="0.75" />
          <circle cx="44" cy="43" r="3.2" fill="#ffb9c9" opacity="0.75" />
        </>
      )}
      {showOpenEyes && (
        <>
          <ellipse cx="25" cy="35" rx="3" ry="4" fill="#7bc47f" />
          <ellipse cx="39" cy="35" rx="3" ry="4" fill="#7bc47f" />
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
