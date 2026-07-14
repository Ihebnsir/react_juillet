import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export const ToastMessage = ({ type = "success", message = "", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => onClose?.(), 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";
  const accent = isSuccess ? "bg-emerald-500" : "bg-red-500";
  const Icon = isSuccess ? FiCheckCircle : FiAlertCircle;

  return (
    <div className={`fixed right-4 top-5 z-50 w-full max-w-sm rounded-3xl p-4 text-white shadow-2xl ${accent} ring-1 ring-black/10`} role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button onClick={onClose} className="text-white/80 transition hover:text-white" aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  );
};
