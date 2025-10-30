'use client';

import { useToast } from '@/lib/toast';
import { ToastContainer } from '@/components/ui/Toast';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

