type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  style: { display: "block" },
});

export function IconSearch({ size = 16, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
      <path d="M20 20 L16.4 16.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ size = 16, color = "currentColor", strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 4 V20 M4 12 H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 16, color = "currentColor", strokeWidth = 2.1 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 5 L19 19 M19 5 L5 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconEdit({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M4 20 L4.9 16.4 L15.3 6 a1.8 1.8 0 0 1 2.5 0 l1.2 1.2 a1.8 1.8 0 0 1 0 2.5 L8.6 19.1 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 7.8 L16.7 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconTrash({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 7 H19 M9 7 V5 a1 1 0 0 1 1 -1 h4 a1 1 0 0 1 1 1 v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7 L7.8 19 a2 2 0 0 0 2 1.9 h4.4 a2 2 0 0 0 2 -1.9 L17 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11 V17 M14 11 V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconCalendar({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M4 10 H20" stroke={color} strokeWidth={strokeWidth} />
      <path d="M8 3.5 V7 M16 3.5 V7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="14.5" r="1.4" fill={color} />
    </svg>
  );
}

export function IconCamera({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 8.5 a2 2 0 0 1 2 -2 h1.2 l1 -1.7 a1.6 1.6 0 0 1 1.4 -0.8 h4.8 a1.6 1.6 0 0 1 1.4 0.8 l1 1.7 H18 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export function IconMore({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="5" cy="12" r="1.7" fill={color} />
      <circle cx="12" cy="12" r="1.7" fill={color} />
      <circle cx="19" cy="12" r="1.7" fill={color} />
    </svg>
  );
}

export function IconDownload({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3.5 V15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 10.5 L12 15.5 L17 10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 17.5 V19 a2 2 0 0 0 2 2 h11 a2 2 0 0 0 2 -2 v-1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ size = 16, color = "currentColor", strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3 a4.2 4.2 0 0 1 4.2 4.2 c0 3.4 -4.2 8.3 -4.2 8.3 s-4.2 -4.9 -4.2 -8.3 A4.2 4.2 0 0 1 12 3 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="12" cy="7.2" r="1.7" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9 20.5 H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function IconPaw({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)}>
      <ellipse cx="12" cy="16" rx="6" ry="5" fill={color} />
      <ellipse cx="5" cy="9.5" rx="2.5" ry="3" fill={color} transform="rotate(-16 5 9.5)" />
      <ellipse cx="9.5" cy="5" rx="2.5" ry="3.1" fill={color} transform="rotate(-5 9.5 5)" />
      <ellipse cx="14.5" cy="5" rx="2.5" ry="3.1" fill={color} transform="rotate(5 14.5 5)" />
      <ellipse cx="19" cy="9.5" rx="2.5" ry="3" fill={color} transform="rotate(16 19 9.5)" />
    </svg>
  );
}

export function IconCheck({ size = 16, color = "currentColor", strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 14, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M9 5 L16 12 L9 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
