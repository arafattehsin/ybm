import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[#C9A86C] hover:bg-[#B89A5C] text-white focus:ring-[#C9A86C]',
      secondary:
        'bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white focus:ring-[#2D2D2D]',
      outline:
        'border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white focus:ring-[#2D2D2D]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded',
      md: 'px-6 py-3 text-base rounded-md',
      lg: 'px-8 py-4 text-lg rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
