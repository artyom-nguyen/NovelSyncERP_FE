export interface Account {
  id: number;
  login: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string | null;
  phone?: string | null;
  langKey?: string | null;
  activated?: boolean;
  status?: string;
  authority?: string;
  authorities?: string[];
}

export const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const source = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return (
    source
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "NS"
  );
};

export const useAccountSession = () => {
  const config = useRuntimeConfig();
  const { clearToken, syncFromStorage, token: authToken } = useAuthToken();
  const { createRoleChecker, formatRole, getUserRoles } = useRoutePermissions();

  if (process.client) {
    syncFromStorage();
  }

  const account = useState<Account | null>("current-account", () => null);

  const loadAccount = async () => {
    if (!authToken.value) {
      account.value = null;
      return null;
    }

    const { data } = await useAPI<Account>(API_ENDPOINTS.account.me);
    account.value = (data.value as Account | null | undefined) || null;
    return account.value;
  };

  const refreshAccount = async () => {
    if (!authToken.value) return null;

    const freshAccount = await $fetch<Account>(API_ENDPOINTS.account.me, {
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });
    account.value = freshAccount;
    return freshAccount;
  };

  const userRoles = computed(() => getUserRoles(account.value));
  const hasAnyRole = createRoleChecker(userRoles);

  const fullName = computed(() => {
    if (!account.value) return "User";
    const first = account.value.firstName || "";
    const last = account.value.lastName || "";
    const full = `${last} ${first}`.trim();
    return full || account.value.login;
  });

  const userInitials = computed(() => getInitials(fullName.value));
  const avatarUrl = computed(() => account.value?.imageUrl?.trim() || "");
  const primaryRole = computed(() => {
    if (!userRoles.value.length) return "Chưa phân quyền";
    const primary =
      userRoles.value.find((role) => role !== "ROLE_USER") ||
      userRoles.value[0];
    return formatRole(primary);
  });
  const isAdminAccount = computed(() => userRoles.value.includes("ROLE_ADMIN"));

  return {
    account,
    authToken,
    avatarUrl,
    clearToken,
    fullName,
    hasAnyRole,
    isAdminAccount,
    loadAccount,
    primaryRole,
    refreshAccount,
    syncFromStorage,
    userInitials,
    userRoles,
  };
};
