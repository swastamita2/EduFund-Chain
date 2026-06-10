import React, { useEffect, useState } from "react";

/**
 * ToastItem — Satu notifikasi yang muncul dan hilang otomatis.
 */
function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Trigger masuk
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto dismiss setelah 6 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 400); // tunggu animasi keluar
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/60
        rounded-2xl px-4 py-4 shadow-2xl max-w-sm w-full
        transition-all duration-400 ease-in-out
        ${visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
        }
      `}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10)",
      }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span
          className="material-symbols-outlined text-primary text-xl"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          favorite
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="font-label-md text-label-md text-on-surface">
            🎉 Donasi Baru Masuk!
          </p>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => onDismiss(toast.id), 400);
            }}
            className="text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-primary font-semibold">
          {toast.amount} ETH
        </p>
        {toast.message && (
          <p className="font-body-sm text-body-sm text-on-surface-variant italic truncate mt-0.5">
            "{toast.message}"
          </p>
        )}
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          dari{" "}
          <span className="font-mono text-on-surface">
            {toast.donor}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * ToastContainer — Mengelola stack notifikasi di pojok kanan bawah layar.
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
