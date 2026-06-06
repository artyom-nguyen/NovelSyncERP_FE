interface PermissionAccount {
  authority?: string | null;
  authorities?: string[] | null;
}

interface RouteAccessRule {
  path: string;
  roles: string[];
}

export const roleLabels: Record<string, string> = {
  ROLE_ADMIN: "Quản trị viên",
  ROLE_USER: "Người dùng",
  ROLE_SALES: "Bán hàng",
  ROLE_PURCHASER: "Mua hàng",
  ROLE_WAREHOUSE: "Thủ kho",
  ROLE_MANAGER: "Quản lý",
  ROLE_ACCOUNTANT: "Kế toán",
  ROLE_SHIPPER: "Giao hàng",
};

export const fallbackAuthorityNames = Object.keys(roleLabels);

export const permissionRoleGroups = {
  sales: ["ROLE_ADMIN", "ROLE_SALES", "ROLE_MANAGER", "ROLE_ACCOUNTANT"],
  purchase: ["ROLE_ADMIN", "ROLE_PURCHASER", "ROLE_MANAGER", "ROLE_ACCOUNTANT"],
  transfer: ["ROLE_ADMIN", "ROLE_WAREHOUSE", "ROLE_MANAGER", "ROLE_SHIPPER"],
  inventory: ["ROLE_ADMIN", "ROLE_WAREHOUSE", "ROLE_MANAGER", "ROLE_ACCOUNTANT"],
  catalog: ["ROLE_ADMIN", "ROLE_PURCHASER", "ROLE_WAREHOUSE", "ROLE_MANAGER"],
  finance: ["ROLE_ADMIN", "ROLE_ACCOUNTANT"],
  adminManager: ["ROLE_ADMIN", "ROLE_MANAGER"],
  adminOnly: ["ROLE_ADMIN"],
};

export type PermissionAction =
  | "salesOrders.create"
  | "salesOrders.approve"
  | "salesOrders.delivery"
  | "salesOrders.payment"
  | "salesOrders.cancel"
  | "purchaseOrders.create"
  | "purchaseOrders.approve"
  | "purchaseOrders.delivery"
  | "purchaseOrders.complete"
  | "purchaseOrders.cancel"
  | "transferOrders.create"
  | "payments.approve"
  | "admin.users";

export const permissionActions: Record<PermissionAction, string[]> = {
  "salesOrders.create": ["ROLE_ADMIN", "ROLE_SALES"],
  "salesOrders.approve": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "salesOrders.delivery": ["ROLE_ADMIN", "ROLE_SHIPPER"],
  "salesOrders.payment": ["ROLE_ADMIN", "ROLE_SHIPPER", "ROLE_ACCOUNTANT"],
  "salesOrders.cancel": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "purchaseOrders.create": ["ROLE_ADMIN", "ROLE_PURCHASER"],
  "purchaseOrders.approve": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "purchaseOrders.delivery": ["ROLE_ADMIN", "ROLE_SHIPPER"],
  "purchaseOrders.complete": ["ROLE_ADMIN", "ROLE_ACCOUNTANT"],
  "purchaseOrders.cancel": ["ROLE_ADMIN", "ROLE_MANAGER"],
  "transferOrders.create": permissionRoleGroups.transfer,
  "payments.approve": permissionRoleGroups.finance,
  "admin.users": permissionRoleGroups.adminOnly,
};

const routeAccessRules: RouteAccessRule[] = [
  { path: "/sales-orders", roles: permissionRoleGroups.sales },
  { path: "/customers", roles: permissionRoleGroups.sales },
  { path: "/purchase-orders", roles: permissionRoleGroups.purchase },
  { path: "/transfer-orders", roles: permissionRoleGroups.transfer },
  { path: "/warehouses", roles: permissionRoleGroups.adminManager },
  { path: "/inventory-balances", roles: permissionRoleGroups.inventory },
  { path: "/inventory-transactions", roles: permissionRoleGroups.inventory },
  { path: "/products", roles: permissionRoleGroups.catalog },
  { path: "/product-categories", roles: permissionRoleGroups.catalog },
  { path: "/suppliers", roles: permissionRoleGroups.catalog },
  { path: "/payments", roles: permissionRoleGroups.finance },
  { path: "/users", roles: permissionRoleGroups.adminOnly },
  { path: "/employees", roles: permissionRoleGroups.adminManager },
  { path: "/departments", roles: permissionRoleGroups.adminManager },
];

const publicRoutePrefixes = [
  "/",
  "/account/register",
  "/account/activate",
  "/account/reset/request",
  "/account/reset/finish",
];

const authenticatedOpenRoutes = ["/dashboard", "/work"];

export const useRoutePermissions = () => {
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

  const createRoleChecker =
    (userRoles: string[] | { value: string[] }) => (allowedRoles: string[]) =>
      hasAnyRole(Array.isArray(userRoles) ? userRoles : userRoles.value, allowedRoles);

  const canAccessPath = (path: string, userRoles: string[]) => {
    if (isPublicRoute(path) || isAuthenticatedOpenRoute(path)) return true;
    const rule = getRouteAccessRule(path);
    if (!rule) return true;
    return hasAnyRole(userRoles, rule.roles);
  };

  const getActionRoles = (action: PermissionAction) => permissionActions[action];

  const formatRole = (role: string) => roleLabels[role] || role;

  return {
    adminManagerRoles: permissionRoleGroups.adminManager,
    canAccessPath,
    catalogRoles: permissionRoleGroups.catalog,
    createRoleChecker,
    fallbackAuthorityNames,
    financeRoles: permissionRoleGroups.finance,
    formatRole,
    getActionRoles,
    getRouteAccessRule,
    getUserRoles,
    hasAnyRole,
    inventoryRoles: permissionRoleGroups.inventory,
    isAuthenticatedOpenRoute,
    isPublicRoute,
    permissionActions,
    permissionRoleGroups,
    purchaseRoles: permissionRoleGroups.purchase,
    routeAccessRules,
    roleLabels,
    salesRoles: permissionRoleGroups.sales,
    transferRoles: permissionRoleGroups.transfer,
  };
};
