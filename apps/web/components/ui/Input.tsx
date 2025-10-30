import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    helperText?: string;
    error?: string;
};

export default function Input({ label, helperText, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                className={`w-full bg-white border ${error ? 'border-danger' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary text-gray-900 placeholder-gray-400 transition-all ${className}`}
                {...props}
            />
            {error ? (
                <p className="text-xs text-danger font-medium">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-600">{helperText}</p>
            ) : null}
        </div>
    );
}


