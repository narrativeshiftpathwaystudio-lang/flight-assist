import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 9.5h3M9 13h6M9 16h6" />
    </svg>
  );
}

export function MoneyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="7" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClothingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.2a1.8 1.8 0 1 1 1.8 1.8c-.6.4-1.3.9-1.3 1.7V9" />
      <path d="M12 9l8.2 5.4a1.8 1.8 0 0 1-1 3.3H4.8a1.8 1.8 0 0 1-1-3.3L12 9Z" />
    </svg>
  );
}

export function ToiletriesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2.5h4v2.7l1.3 1.8v13a1 1 0 0 1-1 1h-4.6a1 1 0 0 1-1-1v-13l1.3-1.8V2.5Z" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function ElectronicsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 2v5M15 2v5" />
      <path d="M7 7h10v3.5a5 5 0 0 1-10 0V7Z" />
      <path d="M12 15.5V21" />
    </svg>
  );
}

export function HealthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5V5a1 1 0 0 1 1-1h6.5a1 1 0 0 1 .7.3l9 9a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-9-9a1 1 0 0 1-.3-.7Z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SpeechIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.2 8.8l-2.1 5-5 2.1 2.1-5 5-2.1Z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2l7 2.8v5.7c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6l7-2.8Z" />
      <path d="M9 12.2l2 2 4.2-4.4" />
    </svg>
  );
}

export const categoryIcons: Record<string, ComponentType<IconProps>> = {
  Documents: DocumentIcon,
  "Money & Cards": MoneyIcon,
  Clothing: ClothingIcon,
  Toiletries: ToiletriesIcon,
  Electronics: ElectronicsIcon,
  "Health & Comfort": HealthIcon,
  Research: CompassIcon,
};
