const AUTH_TOKEN_COOKIE_NAME = "auth_token";
const AUTH_TOKEN_STORAGE_KEY = "novel_auth_token";

const authTokenCookieOptions = {
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax" as const,
  path: "/",
};

export const useAuthToken = () => {
  const token = useCookie<string | null>(
    AUTH_TOKEN_COOKIE_NAME,
    authTokenCookieOptions,
  );

  const syncFromStorage = () => {
    if (!process.client) return token.value;

    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token.value && storedToken) {
      token.value = storedToken;
    }

    return token.value;
  };

  const setToken = (value: string | null) => {
    token.value = value;

    if (!process.client) return;

    if (value) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  };

  const clearToken = () => {
    setToken(null);
  };

  if (process.client && token.value) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token.value);
  }

  return {
    clearToken,
    setToken,
    syncFromStorage,
    token,
  };
};
