import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, title, children, onClose, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-primary/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-primary transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-200px)]">{children}</div>
        {footer ? <div className="p-5 border-t border-slate-100 bg-white">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;

