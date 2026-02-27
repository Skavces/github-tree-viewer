import { useState, useCallback } from 'react';

export default function Toast({ children }) {
  return null; // Toast is managed by ActionBar via internal state
}

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const ToastComponent = toast ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="bg-surface-3 border border-border text-text-primary text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl shadow-black/40 flex items-center gap-2">
        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        {toast}
      </div>
    </div>
  ) : null;

  return { show, ToastComponent };
}
