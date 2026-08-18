import { cn } from '@/lib/utils';

export interface PillProps {
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Pill({ active, children, onClick, className }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5A3C] focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
        active
          ? 'bg-[#8C5A3C] text-white shadow-md shadow-[#8C5A3C]/20'
          : 'border border-sage-100 bg-white text-charcoal-500 hover:border-[#8C5A3C]/40 hover:text-[#8C5A3C]',
        className
      )}
    >
      {children}
    </button>
  );
}
