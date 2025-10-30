import * as React from 'react';

export default function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
    return (
        <div className="mb-8 flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-base text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}


