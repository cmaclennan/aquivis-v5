import * as React from 'react';
import Button from '@/components/ui/Button';

export default function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
}: {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="text-center py-16">
            <div className="mx-auto mb-6 size-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-layered">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-base text-gray-600 max-w-md mx-auto">{description}</p>}
            {actionLabel && onAction && (
                <div className="mt-6 flex items-center justify-center">
                    <Button onClick={onAction}>{actionLabel}</Button>
                </div>
            )}
        </div>
    );
}


