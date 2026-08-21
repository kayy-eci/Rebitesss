import { cn } from "@/lib/utils";
import { LeafSprig } from "@/app/components/ornaments";

export { LeafSprig };

type OrnamentProps = {
  className?: string;
};

export function LeafCycle({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={cn("h-5 w-5", className)}
    >
      <path
        d="M14 24C11 20 10 15 13 10c5 1 8 5 8 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        d="M13 10c-3 6-2 12 3 16 3 2 7 3 11 2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 18c-3 2-4 6-4 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M26 27l4 2 1-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function WalletLeaf({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={cn("h-5 w-5", className)}
    >
      <rect
        x="6"
        y="10"
        width="26"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <rect
        x="24"
        y="17"
        width="8"
        height="6"
        rx="2"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M15 14c0-4 3-6 7-6 2 0 4 1 5 3-1 3-4 4-6 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M22 20a1 1 0 1 0 0 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloudLeaf({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={cn("h-5 w-5", className)}
    >
      <path
        d="M12 28c-3.5 0-6-2.5-6-6 0-3 2-5.5 5-6 1-3.5 4.5-6 8.5-6 5 0 8.5 3.5 8.5 8.5 0 .5 0 1-.1 1.5 2.8.3 5 2.6 5 5.5 0 3-2.4 5.5-5.5 5.5H12Z"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M18 25c-1-4 1-8 6-10 2 3 1 7-3 10-1 1-2 1-3 0Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M18 25c2-3 3-6 2-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VeggieImpactScene({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 220 150"
      fill="none"
      aria-hidden
      className={cn("h-40 w-full", className)}
    >
      <path
        d="M26 30c0-14 10-24 26-24 2 12-8 22-26 24Z"
        fill="#76B852"
        opacity="0.55"
      />
      <path
        d="M26 30c0-14 10-24 26-24 2 12-8 22-26 24Z"
        fill="#285943"
        opacity="0.3"
        transform="translate(10 -6) scale(0.7)"
      />

      <g transform="translate(58 88)">
        <path
          d="M26 0C16 22 6 40 2 50c2 10 14 14 22 8 8-5 12-16 8-28C28 22 30 8 26 0Z"
          fill="#D98C5F"
          opacity="0.85"
        />
        <path
          d="M12 16c4 2 8 6 10 10"
          stroke="#C9764A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 0c-3-6 1-10 4-8 3-4 8-3 8 1-1 4-6 8-12 7Z"
          fill="#76B852"
        />
      </g>

      <g transform="translate(96 100)">
        <path d="M8 2C3-3-2-3-5-1c0 3 3 5 8 5Z" fill="#A8C686" />
        <path d="M8 2c4-5 9-5 12-3 0 3-3 5-8 5Z" fill="#76B852" />
        <circle cx="8" cy="14" r="13" fill="#D98C5F" opacity="0.9" />
        <ellipse
          cx="4"
          cy="10"
          rx="3.5"
          ry="2.5"
          fill="#FFFFFF"
          opacity="0.5"
        />
      </g>

      <path
        d="M132 96c2-8 8-13 16-13-1 8-7 13-16 13Z"
        fill="#76B852"
        opacity="0.8"
      />
      <path d="M130 98c2-9 9-14 18-13-1 8-8 14-18 13Z" fill="#A8C686" />

      <g transform="translate(150 78)">
        <rect
          x="2"
          y="6"
          width="44"
          height="34"
          rx="7"
          fill="#E5F0D8"
          stroke="#A8C686"
          strokeWidth="2"
        />
        <rect x="10" y="2" width="28" height="10" rx="5" fill="#285943" />
        <rect x="12" y="10" width="24" height="4" fill="#285943" />
        <path
          d="M8 20h32M8 28h20"
          stroke="#A8C686"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      <g transform="translate(190 104)">
        <path
          d="M4 22h20l-2 8H6l-2-8Z"
          fill="#E9DFC8"
          stroke="#D5C9AE"
          strokeWidth="1.6"
        />
        <path
          d="M14 20V8"
          stroke="#285943"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M14 12c-1-5-5-8-10-8 0 5 4 8 10 8Z" fill="#76B852" />
        <path d="M14 14c1-5 5-8 9-7-1 5-5 8-9 7Z" fill="#A8C686" />
      </g>
    </svg>
  );
}

export function BowlThumb({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("h-12 w-12", className)}
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#E5F0D8" />
      <path
        d="M14 34c0-10 8-18 18-18s18 8 18 18c0 6-2 12-6 17H20c-4-5-6-11-6-17Z"
        fill="#285943"
        opacity="0.9"
      />
      <path
        d="M16 38c4-4 9-6 16-6s12 2 16 6c-4 4-9 6-16 6s-12-2-16-6Z"
        fill="#76B852"
        opacity="0.85"
      />
      <path
        d="M26 40l3-5M35 42l3-5"
        stroke="#A8C686"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 60h20"
        stroke="#E5F0D8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BakeryThumb({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("h-12 w-12", className)}
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#F4EAD8" />
      <path d="M32 20c8 0 14 6 14 14H18c0-8 6-14 14-14Z" fill="#E9DFC8" />
      <path
        d="M24 34c-2-2-2-6 0-8M32 34c-1-3-1-7 1-10M40 34c-2-2-2-6 0-8"
        stroke="#A8C686"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 38c-2 0-3-1-3-3 4 0 6 1 8 3M44 38c2 0 3-1 3-3-4 0-6 1-8 3"
        fill="#D98C5F"
        opacity="0.7"
      />
      <circle cx="32" cy="46" r="8" fill="#285943" opacity="0.9" />
      <circle cx="28" cy="43" r="2" fill="#76B852" />
      <circle cx="35" cy="48" r="1.6" fill="#A8C686" />
    </svg>
  );
}

export function MarketThumb({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("h-12 w-12", className)}
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#F1EAD9" />
      <rect
        x="16"
        y="26"
        width="32"
        height="26"
        rx="4"
        fill="#E9DFC8"
        stroke="#D5C9AE"
        strokeWidth="2"
      />
      <rect x="20" y="22" width="24" height="10" rx="3" fill="#285943" />
      <circle cx="30" cy="40" r="4" fill="#D98C5F" opacity="0.85" />
      <circle cx="40" cy="42" r="3" fill="#76B852" />
      <path
        d="M34 34l3 3-3 3M34 44l3-3-3-3"
        stroke="#A8C686"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CafeThumb({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("h-12 w-12", className)}
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#F4EAD8" />
      <path
        d="M16 30h22v10a10 10 0 0 1-10 10h-2a10 10 0 0 1-10-10V30Z"
        fill="#285943"
        opacity="0.9"
      />
      <path
        d="M38 32h4a5 5 0 0 1 0 10h-4"
        stroke="#A8C686"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 28l3-5M30 28l3-5"
        stroke="#D98C5F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 52h14"
        stroke="#E9DFC8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { LeafSprig as SidebarSprout };
