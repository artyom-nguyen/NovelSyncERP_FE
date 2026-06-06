export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  duration: number;
  id: number;
  message: string;
  title: string;
  type: ToastType;
}

const titleMap: Record<ToastType, string> = {
  success: "Thành công",
  error: "Thất bại",
  warning: "Cần kiểm tra",
  info: "Thông báo",
};

const containsAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

const getToastTypeFromMessage = (message: string): ToastType => {
  const normalized = message.toLowerCase();

  if (
    containsAny(normalized, [
      "lỗi",
      "lỗi",
      "không thể",
      "không thể",
      "thất bại",
      "thất bại",
      "không chính xác",
      "không chính xác",
      "lỗi",
      "không thể",
      "thất bại",
      "không chính xác",
    ])
  ) {
    return "error";
  }

  if (
    containsAny(normalized, [
      "vui lòng",
      "vui lòng",
      "cần",
      "cần",
      "chưa",
      "chưa",
      "vui lòng",
      "cần",
      "chưa",
    ])
  ) {
    return "warning";
  }

  if (
    containsAny(normalized, [
      "thành công",
      "thành công",
      "hoàn thành",
      "hoàn thành",
      "đã",
      "đã",
      "thành công",
      "hoàn thành",
      "đã",
    ])
  ) {
    return "success";
  }

  return "info";
};

export const useToast = () => {
  const toasts = useState<ToastItem[]>("app-toasts", () => []);

  const remove = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const show = (
    message: string,
    type: ToastType = "info",
    title = titleMap[type],
    duration = 4600,
  ) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    toasts.value = [
      { duration, id, message, title, type },
      ...toasts.value,
    ].slice(0, 5);

    if (process.client) {
      window.setTimeout(() => remove(id), duration);
    }
  };

  return {
    error: (message: string, title?: string) => show(message, "error", title),
    fromMessage: (message: string) =>
      show(message, getToastTypeFromMessage(message)),
    info: (message: string, title?: string) => show(message, "info", title),
    remove,
    show,
    success: (message: string, title?: string) =>
      show(message, "success", title),
    toasts,
    warning: (message: string, title?: string) =>
      show(message, "warning", title),
  };
};
