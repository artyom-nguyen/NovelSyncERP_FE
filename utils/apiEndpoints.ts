export const API_ENDPOINTS = {
  account: {
    activate: "/activate",
    changePassword: "/account/change-password",
    me: "/account",
    resetPasswordFinish: "/account/reset-password/finish",
    resetPasswordInit: "/account/reset-password/init",
    register: "/register",
    authenticate: "/authenticate",
  },
  adminUsers: {
    list: "/admin/users",
    detail: (login: string) => `/admin/users/${login}`,
  },
  authorities: {
    list: "/authorities",
  },
  categories: {
    list: "/categories",
    listSorted: "/categories?size=1000&sort=id,asc",
    detail: (id: number | string) => `/categories/${id}`,
  },
  customers: {
    list: "/customers",
    listSorted: "/customers?size=1000&sort=id,asc",
    detail: (id: number | string) => `/customers/${id}`,
  },
  departments: {
    list: "/departments",
    listSorted: "/departments?size=1000&sort=id,asc",
    detail: (id: number | string) => `/departments/${id}`,
  },
  employees: {
    list: "/employees",
    listEager: "/employees?size=1000&eagerload=true&sort=id,asc",
    detail: (id: number | string) => `/employees/${id}`,
  },
  inventoryBalances: {
    list: "/inventory-balances",
    listPaged: "/inventory-balances?size=1000",
    listByUpdatedAt: "/inventory-balances?size=1000&sort=updatedAt,desc",
  },
  inventoryTransactions: {
    list: "/inventory-transactions",
    byProduct: (productId: number | string) =>
      `/inventory-transactions?productId.equals=${productId}&size=1000&sort=createdDate,desc`,
  },
  notifications: {
    latest: "/notifications/my-latest",
    detail: (id: number | string) => `/notifications/${id}`,
  },
  payments: {
    listEager: "/payments?size=1000&eagerload=true&sort=id,desc",
    disbursement: (query: string) => `/payments/disbursement?${query}`,
    approve: (id: number | string) => `/payments/${id}/approve`,
    createVnPayUrl: (orderId: number | string) =>
      `/payments/create-vnpay-url?orderId=${orderId}`,
  },
  products: {
    list: "/products",
    listSorted: "/products?size=1000&sort=id,asc",
    detail: (id: number | string) => `/products/${id}`,
  },
  purchaseOrderLines: {
    listPaged: "/purchase-order-lines?size=1000",
  },
  purchaseOrders: {
    list: "/purchase-orders",
    detail: (id: number | string) => `/purchase-orders/${id}`,
    approve: (id: number | string) => `/purchase-orders/${id}/approve`,
    cancel: (id: number | string) => `/purchase-orders/${id}/cancel`,
    complete: (id: number | string) => `/purchase-orders/${id}/complete`,
    confirmDelivery: (id: number | string) =>
      `/purchase-orders/${id}/confirm-delivery`,
    startDelivery: (id: number | string) =>
      `/purchase-orders/${id}/start-delivery`,
  },
  salesOrderLines: {
    listPaged: "/sales-order-lines?size=1000",
  },
  salesOrders: {
    list: "/sales-orders",
    detail: (id: number | string) => `/sales-orders/${id}`,
    approve: (id: number | string) => `/sales-orders/${id}/approve`,
    cancel: (id: number | string) => `/sales-orders/${id}/cancel`,
    confirmDelivery: (id: number | string) =>
      `/sales-orders/${id}/confirm-delivery`,
    startDelivery: (id: number | string) =>
      `/sales-orders/${id}/start-delivery`,
  },
  suppliers: {
    list: "/suppliers",
    listSorted: "/suppliers?size=1000&sort=id,asc",
    detail: (id: number | string) => `/suppliers/${id}`,
  },
  transferOrders: {
    list: "/transfer-orders",
    listEager: "/transfer-orders?size=1000&eagerload=true&sort=id,desc",
    detail: (id: number | string) => `/transfer-orders/${id}`,
    workflow: (id: number | string, action: string) =>
      `/transfer-orders/${id}/${action}`,
  },
  users: {
    listSorted: "/users?size=1000&sort=id,asc",
  },
  warehouses: {
    list: "/warehouses",
    listSorted: "/warehouses?size=1000&sort=id,asc",
    detail: (id: number | string) => `/warehouses/${id}`,
  },
} as const;
