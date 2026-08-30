'use client';

import { cn } from '@/lib/utils';
import { Reveal } from '@/app/components/reveal';

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
  titleClassName?: string;
}

/**
 * Shared section header: small uppercase eyebrow (+ optional icon),
 * display title and supporting subtitle, with a consistent entrance
 * reveal. Pass `dark` when placed on a forest/green background.
 */
export function PageHeader({
  eyebrow,
  icon,
  title,
  subtitle,
  align = 'left',
  dark = false,
  className,
  titleClassName,
}: PageHeaderProps) {
  const centered = align === 'center';

  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        centered && 'mx-auto text-center',
        className,
      )}
    >
      {(eyebrow || icon) && (
        <div
          className={cn(
            'flex items-center gap-2',
            centered && 'justify-center',
          )}
        >
          {icon}
          <span
            className={cn(
              'font-sans text-[11px] font-bold uppercase tracking-[0.22em]',
              dark ? 'text-white/70' : 'text-sage-500',
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h2
        className={cn(
          'mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]',
          dark ? 'text-white' : 'text-primary',
          centered && 'mx-auto',
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-4 font-sans text-sm leading-[1.8]',
            dark ? 'text-white/70' : 'text-muted-foreground',
            centered && 'mx-auto max-w-xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}