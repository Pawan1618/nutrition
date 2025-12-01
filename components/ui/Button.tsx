import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl',
            secondary: 'bg-gray-800 text-white hover:bg-gray-700',
            glass: 'glass hover:bg-white/10 text-white',
            ghost: 'hover:bg-white/5 text-gray-300 hover:text-white',
        };

        const sizes = {
            sm: 'h-8 px-4 text-sm',
            md: 'h-10 px-6 text-base',
            lg: 'h-12 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
export { Button };
