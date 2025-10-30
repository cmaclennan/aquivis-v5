import * as React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'bg-success/10 text-success border-success',
    error: 'bg-danger/10 text-danger border-danger',
    info: 'bg-primary/10 text-primary border-primary',
    warning: 'bg-warning/10 text-warning border-warning',
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-md border shadow-lg flex items-center gap-3 min-w-[300px] max-w-md transition-all ${colors[type]}`}>
      <span className="flex-shrink-0">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

