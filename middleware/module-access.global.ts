interface Account {
  authority?: string | null;
  authorities?: string[] | null;
}

export default defineNuxtRouteMiddleware(async (to) => {
  const {
    canAccessPath,
    getRouteAccessRule,
    getUserRoles,
    isPublicRoute,
  } = useRoutePermissions();
  const { clearToken, syncFromStorage, token } = useAuthToken();

  if (process.client) {
    syncFromStorage();
  }

  if (isPublicRoute(to.path)) return;

  if (!token.value) {
    return navigateTo("/");
  }

  const routeRule = getRouteAccessRule(to.path);
  if (!routeRule) return;

  const accountState = useState<Account | null>(
    "module-access-account",
    () => null,
  );
  const accountTokenState = useState<string | null>(
    "module-access-account-token",
    () => null,
  );

  if (accountTokenState.value !== token.value) {
    accountState.value = null;
    accountTokenState.value = token.value;
  }

  if (!accountState.value) {
    const config = useRuntimeConfig();

    try {
      accountState.value = await $fetch<Account>("/account", {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch {
      clearToken();
      return navigateTo("/");
    }
  }

  const userRoles = getUserRoles(accountState.value);

  if (!canAccessPath(to.path, userRoles)) {
    return navigateTo({
      path: "/work",
      query: {
        denied: to.path,
      },
    });
  }
});
