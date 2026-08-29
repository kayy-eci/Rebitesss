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
        'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882] focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
        active
          ? 'bg-[#C8A882] text-white shadow-md shadow-[#C8A882]/20'
          : 'border border-sage-100 bg-white text-charcoal-500 hover:border-[#C8A882]/40 hover:text-[#C8A882]',
        className
      )}
    >
      {children}
    </button>
  );
}
