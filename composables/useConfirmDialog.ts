export type ConfirmDialogTone = "danger" | "warning" | "info";

export interface ConfirmDialogOptions {
  cancelText?: string;
  confirmText?: string;
  message: string;
  title?: string;
  tone?: ConfirmDialogTone;
}

interface ConfirmDialogState extends Required<ConfirmDialogOptions> {
  isOpen: boolean;
}

let activeResolver: ((value: boolean) => void) | null = null;

const defaultState = (): ConfirmDialogState => ({
  cancelText: "Hủy",
  confirmText: "Xác nhận",
  isOpen: false,
  message: "",
  title: "Xác nhận thao tác",
  tone: "warning",
});

export const useConfirmDialog = () => {
  const state = useState<ConfirmDialogState>(
    "app-confirm-dialog",
    defaultState,
  );

  const close = (result: boolean) => {
    state.value = {
      ...state.value,
      isOpen: false,
    };

    activeResolver?.(result);
    activeResolver = null;
  };

  const confirm = (options: string | ConfirmDialogOptions) => {
    const nextOptions =
      typeof options === "string"
        ? {
            message: options,
          }
        : options;

    activeResolver?.(false);

    state.value = {
      ...defaultState(),
      ...nextOptions,
      isOpen: true,
    };

    return new Promise<boolean>((resolve) => {
      activeResolver = resolve;
    });
  };

  return {
    cancel: () => close(false),
    confirm,
    confirmDelete: (message: string, title = "Xác nhận xóa") =>
      confirm({
        confirmText: "Xóa",
        message,
        title,
        tone: "danger",
      }),
    proceed: () => close(true),
    state,
  };
};
