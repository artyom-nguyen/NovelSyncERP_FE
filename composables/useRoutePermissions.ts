interface PermissionAccount {
  authority?: string | null;
  authorities?: string[] | null;
}

interface RouteAccessRule {
  path: string;
  roles: string[];
}

export const useRoutePermissions = () => {
  const salesRoles = [
    "ROLE_ADMIN",
    "ROLE_SALES",
    "ROLE_MANAGER",
    "ROLE_ACCOUNTANT",
  ];
  const purchaseRoles = [
    "ROLE_ADMIN",
    "ROLE_PURCHASER",
    "ROLE_MANAGER",
    "ROLE_ACCOUNTANT",
  ];
  const transferRoles = [
    "ROLE_ADMIN",
    "ROLE_WAREHOUSE",
    "ROLE_MANAGER",
    "ROLE_SHIPPER",
  ];
  const inventoryRoles = [
    "ROLE_ADMIN",
    "ROLE_WAREHOUSE",
    "ROLE_MANAGER",
    "ROLE_ACCOUNTANT",
  ];
  const catalogRoles = [
    "ROLE_ADMIN",
    "ROLE_PURCHASER",
    "ROLE_WAREHOUSE",
    "ROLE_MANAGER",
  ];
  const financeRoles = ["ROLE_ADMIN", "ROLE_ACCOUNTANT"];
  const adminManagerRoles = ["ROLE_ADMIN", "ROLE_MANAGER"];

  const publicRoutePrefixes = [
    "/",
    "/account/register",
    "/account/activate",
    "/account/reset/request",
    "/account/reset/finish",
  ];

  const authenticatedOpenRoutes = ["/dashboard", "/work"];

  const routeAccessRules: RouteAccessRule[] = [
    { path: "/sales-orders", roles: salesRoles },
    { path: "/customers", roles: salesRoles },
    { path: "/purchase-orders", roles: purchaseRoles },
    { path: "/transfer-orders", roles: transferRoles },
    { path: "/warehouses", roles: adminManagerRoles },
    { path: "/inventory-balances", roles: inventoryRoles },
    { path: "/inventory-transactions", roles: inventoryRoles },
    { path: "/products", roles: catalogRoles },
    { path: "/product-categories", roles: catalogRoles },
    { path: "/suppliers", roles: catalogRoles },
    { path: "/payments", roles: financeRoles },
    { path: "/users", roles: ["ROLE_ADMIN"] },
    { path: "/employees", roles: adminManagerRoles },
    { path: "/departments", roles: adminManagerRoles },
  ];

  const normalizePath = (path: string) =>
    path.length > 1 ? path.replace(/\/+$/, "") : path;

  const isPathMatch = (path: string, basePath: string) => {
    const normalizedPath = normalizePath(path);
    const normalizedBasePath = normalizePath(basePath);
    return (
      normalizedPath === normalizedBasePath ||
      normalizedPath.startsWith(`${normalizedBasePath}/`)
    );
  };

  const isPublicRoute = (path: string) => {
    const normalizedPath = normalizePath(path);
    return publicRoutePrefixes.some((routePath) => {
      if (routePath === "/") return normalizedPath === "/";
      return isPathMatch(normalizedPath, routePath);
    });
  };

  const isAuthenticatedOpenRoute = (path: string) =>
    authenticatedOpenRoutes.some((routePath) => isPathMatch(path, routePath));

  const getRouteAccessRule = (path: string) =>
    routeAccessRules.find((rule) => isPathMatch(path, rule.path));

  const getUserRoles = (account: PermissionAccount | null | undefined) => {
    const authorities = account?.authorities || [];
    const authority = account?.authority ? [account.authority] : [];
    return [...new Set([...authorities, ...authority])];
  };

  const hasAnyRole = (userRoles: string[], allowedRoles: string[]) => {
    if (!allowedRoles.length) return true;
    if (!userRoles.length) return false;
    if (userRoles.includes("ROLE_ADMIN")) return true;
    return allowedRoles.some((role) => userRoles.includes(role));
  };

  const canAccessPath = (path: string, userRoles: string[]) => {
    if (isPublicRoute(path) || isAuthenticatedOpenRoute(path)) return true;
    const rule = getRouteAccessRule(path);
    if (!rule) return true;
    return hasAnyRole(userRoles, rule.roles);
  };

  return {
    adminManagerRoles,
    canAccessPath,
    catalogRoles,
    financeRoles,
    getRouteAccessRule,
    getUserRoles,
    hasAnyRole,
    inventoryRoles,
    isAuthenticatedOpenRoute,
    isPublicRoute,
    purchaseRoles,
    routeAccessRules,
    salesRoles,
    transferRoles,
  };
};
