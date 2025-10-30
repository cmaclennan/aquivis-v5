import * as React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    helperText?: string;
    error?: string;
};

export default function Select({ label, helperText, error, className = '', children, ...props }: SelectProps) {
    return (
        <div className="grid gap-1.5">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className={`w-full bg-white border ${error ? 'border-danger' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary text-gray-900 transition-all ${className}`}
                {...props}
            >
                {children}
            </select>
            {error ? (
                <p className="text-xs text-danger font-medium">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-600">{helperText}</p>
            ) : null}
        </div>
    );
}


