import { useToast as useToastContext, type ToastType } from "~/contexts/toast-context";

export function useToast() {
  const { addToast, removeToast, clearAll, toasts } = useToastContext();

  const toast = {
    success: (message: string, duration?: number) => addToast(message, "success", duration),
    error: (message: string, duration?: number) => addToast(message, "error", duration),
    warning: (message: string, duration?: number) => addToast(message, "warning", duration),
    info: (message: string, duration?: number) => addToast(message, "info", duration),
    custom: (message: string, type: ToastType, duration?: number) => addToast(message, type, duration),
    dismiss: removeToast,
    dismissAll: clearAll,
  };

  return {
    toast,
    toasts,
  };
}