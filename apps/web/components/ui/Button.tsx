import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'ghost' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
};

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
    const base = 'inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus-visible:ring-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none';
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
        primary: 'bg-[#007BFF] text-white hover:bg-[#0056B3] active:bg-[#0056B3]/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[#007BFF]/30',
        ghost: 'bg-white text-[#007BFF] border border-gray-300 hover:bg-gray-50 hover:border-[#007BFF] focus-visible:ring-[#007BFF]/30',
        secondary: 'bg-gray-800 text-white hover:bg-gray-700 focus-visible:ring-gray-800/30',
    };
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-10 px-5 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-md',
    };
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
    );
}


