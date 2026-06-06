interface ApiErrorPayload {
  detail?: string;
  message?: string;
  title?: string;
  type?: string;
}

interface ApiErrorLike {
  data?: ApiErrorPayload;
  message?: string;
  status?: number;
  statusCode?: number;
}

export const getApiErrorData = (error: unknown): ApiErrorLike => {
  if (!error || typeof error !== "object") return {};
  return error as ApiErrorLike;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Không thể xử lý yêu cầu. Vui lòng thử lại.",
) => {
  const apiError = getApiErrorData(error);
  return (
    apiError.data?.message ||
    apiError.data?.title ||
    apiError.data?.detail ||
    apiError.message ||
    fallback
  );
};

export const getApiErrorText = (error: unknown) => {
  const apiError = getApiErrorData(error);
  return [
    apiError.data?.title,
    apiError.data?.message,
    apiError.data?.detail,
    apiError.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const getApiErrorStatus = (error: unknown) => {
  const apiError = getApiErrorData(error);
  return apiError.statusCode || apiError.status || 0;
};
