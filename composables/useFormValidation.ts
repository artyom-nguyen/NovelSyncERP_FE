export const LOGIN_REGEX =
  /^(?:[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*|[_.@A-Za-z0-9-]+)$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isBlank = (value: unknown) =>
  value === null || value === undefined || String(value).trim().length === 0;

export const validateRequired = (value: unknown, label: string) =>
  isBlank(value) ? `${label} không được để trống.` : "";

export const validateMaxLength = (
  value: unknown,
  maxLength: number,
  label: string,
) =>
  !isBlank(value) && String(value).trim().length > maxLength
    ? `${label} không được vượt quá ${maxLength} ký tự.`
    : "";

export const toDigitsOnly = (value: unknown) =>
  String(value || "").replace(/\D/g, "");

export const validateDigitsOnly = (value: unknown, label: string) => {
  if (isBlank(value)) return "";
  return /^\d+$/.test(String(value).trim())
    ? ""
    : `${label} chỉ được nhập số.`;
};

export const validateMinMaxLength = (
  value: unknown,
  minLength: number,
  maxLength: number,
  label: string,
) => {
  if (isBlank(value)) return "";
  const length = String(value).trim().length;
  return length < minLength || length > maxLength
    ? `${label} phải từ ${minLength} đến ${maxLength} ký tự.`
    : "";
};

export const validateEmail = (value: unknown, label = "Email") => {
  if (isBlank(value)) return "";
  const email = String(value).trim();
  if (email.length < 5 || email.length > 254) {
    return `${label} phải từ 5 đến 254 ký tự.`;
  }
  return EMAIL_REGEX.test(email) ? "" : `${label} không đúng định dạng.`;
};

export const validateLogin = (value: unknown) => {
  const requiredMessage = validateRequired(value, "Tên đăng nhập");
  if (requiredMessage) return requiredMessage;

  const login = String(value).trim();
  if (login.length > 50) {
    return "Tên đăng nhập không được vượt quá 50 ký tự.";
  }

  return LOGIN_REGEX.test(login)
    ? ""
    : "Tên đăng nhập chỉ được chứa chữ, số và các ký tự . _ - @.";
};

export const validatePasswordLength = (
  value: unknown,
  label = "Mật khẩu",
) => {
  const requiredMessage = validateRequired(value, label);
  if (requiredMessage) return requiredMessage;
  return validateMinMaxLength(value, 4, 100, label);
};

export const validatePositiveInteger = (value: unknown, label: string) => {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue >= 1
    ? ""
    : `${label} phải là số nguyên lớn hơn 0.`;
};

export const validateNonNegativeNumber = (value: unknown, label: string) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0
    ? ""
    : `${label} không được nhỏ hơn 0.`;
};

export const firstValidationError = (validators: Array<string | false>) =>
  validators.find((message) => Boolean(message)) || "";
