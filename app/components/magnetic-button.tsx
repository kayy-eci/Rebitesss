'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'default',
  className,
  strength = 0.4,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'cream' | 'white';
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const base = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-7 py-3.5 font-sans text-sm font-medium tracking-tight transition-colors duration-300',
    variant === 'default' &&
      'bg-primary text-primary-foreground-strong hover:bg-caramel',
    variant === 'outline' &&
      'border border-primary/40 text-primary hover:border-caramel hover:bg-caramel hover:text-white',
    variant === 'cream' &&
      'bg-secondary text-primary hover:bg-caramel hover:text-white border border-primary/10',
    variant === 'white' &&
      'border border-caramel/40 bg-white text-primary hover:border-caramel hover:bg-caramel hover:text-white',
    className
  );

  const content = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      style={{ x: pos.x * 0.3, y: pos.y * 0.3 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={base}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={base}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      {content}
    </motion.button>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-sans text-sm font-medium text-primary transition-colors',
        className
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-caramel transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
