"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  return useContext(ToastContext);
}

// ─── Individual toast item ────────────────────────────────────────────────────

const TYPE_STYLES: Record<ToastType, { bar: string; icon: string }> = {
  success: { bar: "#22c55e", icon: "✓" },
  error:   { bar: "#ef4444", icon: "✕" },
  info:    { bar: "#3b82f6", icon: "i" },
};

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  // Slide-in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  }

  const { bar, icon } = TYPE_STYLES[toast.type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 260,
        maxWidth: 360,
        background: "var(--bg-2, #1f2937)",
        border: "1px solid var(--tb-border, rgba(255,255,255,0.08))",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 8px 32px -4px rgba(0,0,0,0.5)",
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
        pointerEvents: "auto",
      }}
    >
      {/* Coloured left bar */}
      <span
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: 6,
          background: bar,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: "var(--text, #f1f5f9)",
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Fermer la notification"
        style={{
          background: "none",
          border: "none",
          color: "var(--text-3, #6b7280)",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: "2px 4px",
          borderRadius: 4,
          flexShrink: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "var(--text, #f1f5f9)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-3, #6b7280)")
        }
      >
        ✕
      </button>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

let nextId = 0;
const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++nextId;

      setToasts((prev) => {
        const updated = [...prev, { id, message, type }];
        // Keep only the newest MAX_TOASTS; remove stale ones
        if (updated.length > MAX_TOASTS) {
          const removed = updated.splice(0, updated.length - MAX_TOASTS);
          removed.forEach((t) => {
            const timer = timers.current.get(t.id);
            if (timer !== undefined) {
              clearTimeout(timer);
              timers.current.delete(t.id);
            }
          });
        }
        return updated;
      });

      const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [removeToast]
  );

  // Cleanup on unmount
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-label="Notifications"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 60,           // above cookie banner (z-50)
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
