/** Bear-face Pomeranian, running side profile — used in the chase strip. */
export function DogPomBear({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 60 44" width={size} height={size} style={{ display: "block" }}>
      <circle cx="10" cy="19" r="7.5" fill="#e8a563" />
      <ellipse cx="26" cy="26" rx="14" ry="10" fill="#e8a563" />
      <ellipse cx="26" cy="31" rx="9.5" ry="4.5" fill="#f6dcb8" opacity="0.8" />
      <ellipse cx="38.5" cy="34.5" rx="2.4" ry="5" fill="#e8a563" transform="rotate(18 38.5 34.5)" />
      <ellipse cx="15.5" cy="35.5" rx="2.4" ry="5" fill="#d9924a" transform="rotate(-16 15.5 35.5)" />
      <circle cx="44" cy="17" r="9" fill="#e8a563" />
      <circle cx="39.5" cy="9.5" r="3.4" fill="#d9924a" />
      <circle cx="48.5" cy="8.5" r="3.4" fill="#d9924a" />
      <circle cx="47.2" cy="16" r="1.1" fill="#2b2a40" />
      <circle cx="52" cy="18.5" r="1.4" fill="#2b2a40" />
      <path d="M49 20.5 Q51 22 53 20.5" stroke="#2b2a40" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Fat Pomeranian, lying down eating from a bowl. */
export function DogPomFat({ size = "100%" }: { size?: number | string }) {
  return (
    <svg viewBox="0 0 68 42" width={size} height={size} style={{ display: "block" }}>
      <circle cx="55" cy="21" r="7" fill="#eec89a" />
      <ellipse cx="37" cy="25" rx="21" ry="14" fill="#eec89a" />
      <ellipse cx="37" cy="31" rx="14" ry="6" fill="#fbf0dc" opacity="0.85" />
      <ellipse cx="20" cy="35.5" rx="4" ry="2.6" fill="#eec89a" />
      <ellipse cx="46" cy="36" rx="4" ry="2.6" fill="#eec89a" />
      <circle cx="14" cy="19" r="9.5" fill="#eec89a" />
      <circle cx="9.5" cy="11" r="3.4" fill="#dba86e" />
      <circle cx="19" cy="11" r="3.4" fill="#dba86e" />
      <ellipse cx="6" cy="23" rx="3.6" ry="2.6" fill="#fbf0dc" />
      <circle cx="11.5" cy="16.5" r="1.1" fill="#2b2a40" />
      <circle cx="3" cy="23" r="1.1" fill="#2b2a40" />
      <path d="M4 26 Q6 28 8 26" stroke="#2b2a40" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <ellipse cx="1" cy="34" rx="6" ry="3" fill="#c9b0ea" />
      <ellipse cx="1" cy="33" rx="4.4" ry="1.8" fill="#f5f0fc" />
      <circle cx="-1" cy="33" r="0.9" fill="#e8a563" />
      <circle cx="1.5" cy="33.5" r="0.9" fill="#e8a563" />
      <circle cx="3.5" cy="33" r="0.9" fill="#e8a563" />
    </svg>
  );
}
