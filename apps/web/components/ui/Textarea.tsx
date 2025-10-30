import * as React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  const baseClasses = 'w-full px-4 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';
  const errorClasses = error ? 'border-danger focus-visible:ring-danger/30' : 'border-gray-300 focus-visible:border-primary';
  
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}

