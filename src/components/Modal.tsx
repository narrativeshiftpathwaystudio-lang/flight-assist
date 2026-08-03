import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-soft shadow-[var(--shadow-card)] hover:text-ink"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
