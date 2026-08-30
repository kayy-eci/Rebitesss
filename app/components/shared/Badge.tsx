import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        green: 'bg-primary text-white',
        gold: 'bg-caramel text-charcoal-900',
        glass: 'bg-white/10 text-cream-50 backdrop-blur-sm',
        cream: 'bg-cream-100 text-charcoal-900',
        outline: 'border border-sage-100 bg-white text-charcoal-500',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
