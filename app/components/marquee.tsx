'use client';

import { useRef } from 'react';

export function Marquee({
  children,
  reverse = false,
  className,
  pauseOnHover = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`group flex overflow-hidden ${className ?? ''}`}>
      <div
        ref={trackRef}
        className={`flex shrink-0 items-center ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
