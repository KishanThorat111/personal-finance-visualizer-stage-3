
// components/ui/toaster.tsx
'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'rounded-full bg-white/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-xl backdrop-blur-sm px-6 py-3 text-sm font-medium',
          description: 'text-xs text-muted-foreground',
          actionButton:
            'bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-1 text-xs font-semibold',
          cancelButton:
            'text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white text-xs',
        },
        duration: 3000,
      }}
    />
  );
}

export { toast } from 'sonner';
