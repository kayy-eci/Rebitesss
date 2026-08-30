import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid:
          'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-caramel hover:shadow-primary/30',
        outline:
          'border-2 border-primary text-primary hover:bg-caramel hover:text-white',
        cream:
          'bg-cream-50 text-primary shadow-lg shadow-primary/20 hover:bg-white',
        outlineCream:
          'border-2 border-cream-50/60 text-cream-50 hover:bg-cream-50 hover:text-caramel',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-3.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  type,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
