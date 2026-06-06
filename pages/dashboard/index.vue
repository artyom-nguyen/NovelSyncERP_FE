<template>
  <div class="top-layout-site dashboard-modern">
    <div class="main-layout-site">
      <div class="working-db-wp">
        <div class="main-db-content">
          <div class="box-welcome-db">
            <div class="box-weldb--title">
              <div class="user-avatar">
                <div class="avatar">
                  <p
                    v-if="!avatarUrl"
                    class="avatar-initials text-size-14-medium"
                  >
                    {{ userInitials }}
                  </p>
                  <img v-else :src="avatarUrl" alt="" />
                </div>
                <div class="info">
                  <p class="txt-name">{{ greetingText }}, {{ fullName }}!</p>
                  <div class="lst-contract-meta">
                    <p class="txt-contract-meta">{{ primaryRole }}</p>
                    <p class="txt-contract-meta">
                      {{ account?.email || "Chưa có email" }}
                    </p>
                    <p class="txt-contract-meta">
                      {{ account?.login || "---" }}
                    </p>
                  </div>
                </div>
              </div>

              <button
                class="btn-frame-color briefing-ai wth-tooltip"
                @click="refreshDashboard"
              >
                <span class="icon">
                  <img src="/img-fix/icon/icon-topbar-reload.svg" alt="" />
                </span>
                <span class="txt-clr text-12-light">Làm mới dữ liệu</span>
                <span class="topbar-tooltip">Load lại danh sách</span>
              </button>
            </div>
            <div class="box-weldb--content">
              <div class="box-work-todo">
                <p class="text-size-13-rgl">{{ dashboardBriefing }}</p>
              </div>
              <div class="ct-grid-kt-color">
                <div class="grid-col-item-4">
                  <div class="imt-school-schedule yellow-db-card">
                    <p class="title">Cần xử lý</p>
                    <p class="number">{{ urgentActions.length }}</p>
                  </div>
                  <div class="imt-school-schedule blue-db-card">
                    <p class="title">Sản phẩm</p>
                    <p class="number">{{ productsList.length }}</p>
                  </div>
                  <div class="imt-school-schedule green-db-card">
                    <p class="title">Đơn hôm nay</p>
                    <p class="number">{{ todayOrderCount }}</p>
                  </div>
                  <div class="imt-school-schedule red-db-card">
                    <p class="title">Tồn kho thấp</p>
                    <p class="number">{{ lowStockBalances.length }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box-function-grid">
            <div class="grid-dynamic-frame grid-6">
              <NuxtLink
                v-for="action in permittedQuickActions"
                :key="action.title"
                :to="action.route"
                class="imt-card-function dashboard-link"
                :class="action.cardClass"
              >
                <div class="icon">
                  <img :src="action.icon" alt="" />
                </div>
                <p class="txt">{{ action.title }}</p>
              </NuxtLink>
            </div>
          </div>

          <div class="box-title-color-db box-technical-tasks">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr linear-bg-sb">
                  <div class="icon">
                    <img src="/img-fix/icon/icon-storefront.svg" alt="" />
                  </div>
                  <div class="info">
                    <p class="text-14-smb">Nghiệp vụ chuyên môn</p>
                    <p class="text-size-12-light text-gray-99a">
                      Truy cập nhanh vào các module ERP đã triển khai
                    </p>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="ct-label-ticket">
                  <div class="label-table-new bg-label-zumthor-3">
                    <p class="text-size-12-medium">
                      {{ activeModuleCount }} chức năng được phân
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-tcd--content">
              <div class="mb-8">
                <p class="txt-uc-10-medium text-gray-99a">
                  Nghiệp vụ chính của bạn
                </p>
              </div>
              <div class="lst-job-tr">
                <div class="grid-module-erp">
                  <NuxtLink
                    v-for="module in activeModules"
                    :key="module.title"
                    :to="module.route"
                    class="imt-card-function dashboard-link module-active module-card-simple"
                    :class="module.colorClass"
                  >
                    <div class="module-card-main">
                      <div class="icon">
                        <img :src="module.icon" alt="" />
                      </div>
                      <div class="module-card-text">
                        <p class="title-module">{{ module.title }}</p>
                        <p class="desc-module">{{ module.description }}</p>
                      </div>
                    </div>
                    <span class="module-card-arrow">
                      <img
                        src="/img-fix/icon/icon-arrow-right-new.svg"
                        alt=""
                      />
                    </span>
                  </NuxtLink>

                  <div
                    v-for="module in inactiveModules"
                    :key="module.title"
                    class="imt-card-function module-card-simple"
                    :class="module.colorClass"
                  >
                    <div class="module-permission">
                      <div class="label-table-new">
                        <p>Chờ cấp</p>
                      </div>
                    </div>
                    <div class="module-card-main">
                      <div class="icon">
                        <img :src="module.icon" alt="" />
                      </div>
                      <div class="module-card-text">
                        <p class="title-module">{{ module.title }}</p>
                        <p class="desc-module">{{ module.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box-title-color-db bg-linear-border-yellow">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr dutch-orange">
                  <div class="icon">
                    <img src="/img-fix/icon/icon-warning-blue.svg" alt="" />
                  </div>
                  <div class="info">
                    <p class="text-14-smb txt-d-yellow-2">Cần xử lý ngay</p>
                  </div>
                </div>
              </div>
              <div class="right">
                <div
                  class="label-table-new label-dutch-orange-op50 border-radius-100"
                >
                  <p class="text-size-13-medium">
                    {{ urgentActions.length }} việc
                  </p>
                </div>
              </div>
            </div>
            <div class="box-tcd--content">
              <div v-if="urgentActions.length" class="lst-work-deal lst-job-tr">
                <div
                  v-for="item in urgentActions"
                  :key="item.key"
                  class="tr-job-now"
                  :class="item.rowClass"
                >
                  <div class="left">
                    <div class="icon">
                      <img :src="item.icon" alt="" />
                    </div>
                    <div class="info">
                      <p class="text-size-13-medium">{{ item.title }}</p>
                      <div class="lst-contract-meta">
                        <p class="txt-contract-meta">{{ item.meta }}</p>
                        <p class="txt-contract-meta">{{ item.time }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="btn-color-box">
                      <NuxtLink
                        :to="item.route"
                        class="btn-frame-text internation-orange"
                      >
                        Xử lý
                        <span class="icon">
                          <img
                            src="/img-fix/icon/icon-bold-caretright-gray.svg"
                            alt=""
                          />
                        </span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-dashboard-row">
                <p class="text-size-13-rgl">
                  Không có việc gấp. Dữ liệu vận hành đang ổn định.
                </p>
              </div>
            </div>
          </div>

          <div class="box-title-color-db">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr linear-bg-sb">
                  <div class="icon">
                    <img
                      src="/img-fix/icon/icon-bold-calendarcheck.svg"
                      alt=""
                    />
                  </div>
                  <div class="info">
                    <p class="text-14-smb">Hoạt động gần đây</p>
                    <p class="text-size-12-light text-gray-99a">
                      Đơn nhập và đơn bán mới nhất trong hệ thống
                    </p>
                  </div>
                </div>
              </div>
              <div class="right">
                <p class="text-size-12-medium txt-blue">
                  {{ formatCurrency(monthSalesAmount) }}
                </p>
              </div>
            </div>
            <div class="box-tcd--content">
              <div
                v-if="recentActivities.length"
                class="lst-job-tr lst-db-activity"
              >
                <div
                  v-for="activity in recentActivities"
                  :key="activity.key"
                  class="tr-job-now"
                >
                  <div class="left">
                    <div class="icon" :class="activity.iconClass"></div>
                    <div class="info">
                      <p class="text-size-13-medium">{{ activity.title }}</p>
                      <div class="lst-contract-meta lst-dot-date">
                        <p class="txt-contract-meta">{{ activity.amount }}</p>
                        <p class="txt-contract-meta">{{ activity.date }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="ct-task-label">
                      <div class="label-table-new bg-label-zumthor-3">
                        <p>{{ activity.status }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-dashboard-row">
                <p class="text-size-13-rgl">Chưa có hoạt động đơn hàng.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-db-content">
          <div class="box-title-color-db">
            <div class="box-tcd--content">
              <div class="box-calendar-modal">
                <div class="title-calendar">
                  <p class="txt-date">
                    {{ `Tháng ${currentMonth + 1} ${currentYear}` }}
                  </p>

                  <div class="btn-change-date">
                    <button class="btn-frame-color" @click="prevMonth">
                      <span class="icon">
                        <img
                          src="/img-fix/icon/icon-bold-caretleft.svg"
                          alt=""
                        />
                      </span>
                    </button>

                    <button class="btn-frame-color" @click="nextMonth">
                      <span class="icon">
                        <img
                          src="/img-fix/icon/icon-bold-caretright.svg"
                          alt=""
                        />
                      </span>
                    </button>
                  </div>
                </div>

                <div class="box-calendar--calendar">
                  <div class="box-calendar_dotw">
                    <p class="txt-dotw">CN</p>
                    <p class="txt-dotw">T2</p>
                    <p class="txt-dotw">T3</p>
                    <p class="txt-dotw">T4</p>
                    <p class="txt-dotw">T5</p>
                    <p class="txt-dotw">T6</p>
                    <p class="txt-dotw">T7</p>
                  </div>

                  <div class="box-calendar_day">
                    <div
                      v-for="(week, weekIndex) in calendarRows"
                      :key="weekIndex"
                      class="box-calendar_day--row"
                    >
                      <div
                        v-for="(day, dayIndex) in week"
                        :key="dayIndex"
                        class="txt-day"
                        :class="{
                          'day-empty': !day,
                          active: isToday(day),
                          'has-activity': hasCalendarActivity(day),
                        }"
                      >
                        {{ day || "" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box-title-color-db">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr beeswax">
                  <div class="info">
                    <p class="text-14-smb">Mục tiêu tuần này</p>
                  </div>
                </div>
              </div>
              <div class="right"></div>
            </div>
            <div class="box-tcd--content">
              <div class="ct-progress-db">
                <div
                  v-for="goal in weeklyGoals"
                  :key="goal.title"
                  class="progress-date-time"
                >
                  <div class="progress-content-dt">
                    <p class="text-size-12-rgl txt-gray">{{ goal.title }}</p>
                    <p class="text-size-12-medium" :class="goal.textClass">
                      {{ goal.value }}
                    </p>
                  </div>
                  <div class="progress-frame-dt">
                    <div
                      class="progress-bar-dt"
                      :class="goal.barClass"
                      :style="{ width: `${goal.percent}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="ct-goal-label">
                <div class="box-label-warning">
                  <div class="icon">
                    <img
                      src="/img-fix/icon/icon-thin-shield-green.svg"
                      alt=""
                    />
                  </div>
                  <p class="text-11-rgl txt-brown">{{ weeklySummary }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="box-title-color-db">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr linear-bg-sb">
                  <div class="info">
                    <p class="text-14-smb">Tổng quan kho</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-tcd--content">
              <div class="inventory-summary">
                <div class="summary-row">
                  <p class="text-size-12-rgl txt-gray">Tổng tồn</p>
                  <p class="text-size-13-medium">
                    {{ totalInventoryQuantity }} đơn vị
                  </p>
                </div>
                <div class="summary-row">
                  <p class="text-size-12-rgl txt-gray">Giá trị tồn ước tính</p>
                  <p class="text-size-13-medium txt-blue">
                    {{ formatCurrency(totalInventoryValue) }}
                  </p>
                </div>
                <div class="summary-row">
                  <p class="text-size-12-rgl txt-gray">Sản phẩm hết hàng</p>
                  <p class="text-size-13-medium txt-brown">
                    {{ outOfStockCount }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="box-title-color-db">
            <div class="box-tcd--title">
              <div class="left">
                <div class="box-icon-clr beeswax">
                  <div class="info">
                    <p class="text-14-smb">Sản phẩm tồn nhiều</p>
                  </div>
                </div>
              </div>
              <div class="right">
                <NuxtLink to="/inventory-balances" class="btn-frame-text"
                  >Xem kho</NuxtLink
                >
              </div>
            </div>
            <div class="box-tcd--content">
              <div v-if="topInventoryProducts.length" class="lst-job-tr">
                <div
                  v-for="item in topInventoryProducts"
                  :key="item.id"
                  class="tr-job-now stock-row"
                >
                  <div class="left">
                    <div class="icon stock-rank">
                      <p>{{ item.rank }}</p>
                    </div>
                    <div class="info">
                      <p class="text-size-13-medium">
                        {{ item.product?.name || "Sản phẩm chưa xác định" }}
                      </p>
                      <div class="lst-contract-meta">
                        <p class="txt-contract-meta">
                          {{ item.product?.sku || "---" }}
                        </p>
                        <p class="txt-contract-meta">
                          {{ item.product?.category?.name || "Chưa phân loại" }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <p class="text-size-12-medium txt-blue">
                      {{ item.quantity }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-dashboard-row">
                <p class="text-size-13-rgl">Chưa có dữ liệu tồn kho.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Account {
  id: number;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  authorities?: string[];
  authority?: string;
}

interface Category {
  id: number;
  name?: string | null;
  title?: string | null;
  desc?: string | null;
}

interface Supplier {
  id: number;
  code: string | null;
  name: string;
  address?: string | null;
  phone?: string | null;
  status?: string | null;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  basePrice: number;
  attributes?: string | null;
  category?: Category | null;
}

interface OrderUser {
  id: number;
  login: string;
}

interface Order {
  id: number;
  code?: string;
  orderCode?: string;
  poCode?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  user?: OrderUser | null;
}

interface InventoryBalance {
  id: number;
  quantity: number;
  updatedAt?: string;
  product?: Product | null;
}

interface ModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  colorClass: string;
  roles: string[];
}

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const { data: account } = await useAPI<Account>("/account");
const {
  adminManagerRoles,
  catalogRoles,
  createRoleChecker,
  financeRoles,
  formatRole,
  getActionRoles,
  getUserRoles,
  inventoryRoles,
  purchaseRoles,
  salesRoles,
  transferRoles,
} = useRoutePermissions();

const roles = computed(() => getUserRoles(account.value));
const hasAnyRole = createRoleChecker(roles);
const adminOnlyRoles = getActionRoles("admin.users");

const canLoadCatalogData = computed(() => hasAnyRole(catalogRoles));
const canLoadSalesData = computed(() => hasAnyRole(salesRoles));
const canLoadPurchaseData = computed(() => hasAnyRole(purchaseRoles));
const canLoadInventoryData = computed(() => hasAnyRole(inventoryRoles));

const { data: products, refresh: refreshProducts } = await useAPI<Product[]>(
  "/products",
  { immediate: canLoadCatalogData.value || canLoadInventoryData.value },
);
const { data: categories, refresh: refreshCategories } = await useAPI<
  Category[]
>("/categories", {
  immediate: canLoadCatalogData.value,
});
const { data: suppliers, refresh: refreshSuppliers } = await useAPI<Supplier[]>(
  "/suppliers",
  {
    immediate: canLoadCatalogData.value,
  },
);
const { data: purchaseOrders, refresh: refreshPurchaseOrders } = await useAPI<
  Order[]
>("/purchase-orders", {
  immediate: canLoadPurchaseData.value,
});
const { data: salesOrders, refresh: refreshSalesOrders } = await useAPI<
  Order[]
>("/sales-orders", {
  immediate: canLoadSalesData.value,
});
const { data: inventoryBalances, refresh: refreshInventoryBalances } =
  await useAPI<InventoryBalance[]>("/inventory-balances", {
    immediate: canLoadInventoryData.value,
  });

const productsList = computed(() => products.value || []);
const categoriesList = computed(() => categories.value || []);
const suppliersList = computed(() => suppliers.value || []);
const purchaseOrderList = computed(() => purchaseOrders.value || []);
const salesOrderList = computed(() => salesOrders.value || []);
const balanceList = computed(() => inventoryBalances.value || []);
const balancesWithProduct = computed(() =>
  balanceList.value.filter((item) => Boolean(item.product)),
);

const canCreateSalesDraft = computed(() =>
  hasAnyRole(getActionRoles("salesOrders.create")),
);
const canCreatePurchaseDraft = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.create")),
);
const canCreateTransferDraft = computed(() => hasAnyRole(transferRoles));
const canApproveOrders = computed(() =>
  hasAnyRole(getActionRoles("salesOrders.approve")),
);
const canCompleteSalesPurchase = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.complete")),
);
const canCancelOrders = computed(() => hasAnyRole(adminOnlyRoles));
const canViewInventoryWork = computed(() => hasAnyRole(inventoryRoles));

const fullName = computed(() => {
  const name =
    `${account.value?.lastName || ""} ${account.value?.firstName || ""}`.trim();
  return name || account.value?.login || "bạn";
});

const avatarUrl = computed(() => account.value?.imageUrl || "");

const userInitials = computed(() => {
  const words = fullName.value.split(" ").filter(Boolean);
  const initials = words
    .slice(-2)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase() || "NV";
});

const primaryRole = computed(() => {
  const primary =
    roles.value.find((role) => role !== "ROLE_USER") || roles.value[0];
  return primary ? formatRole(primary) : "Nhân viên";
});

const rolePermissionSummary = computed(() => {
  if (hasAnyRole(["ROLE_ADMIN"])) {
    return "Bạn có toàn quyền tạo, duyệt, chốt và hủy trên toàn hệ thống.";
  }
  if (hasAnyRole(["ROLE_MANAGER"])) {
    return "Bạn phụ trách duyệt đơn bán, đơn mua và điều chuyển trong phạm vi quản lý.";
  }
  if (hasAnyRole(["ROLE_ACCOUNTANT"])) {
    return "Bạn phụ trách thu/chi, chốt đơn bán/mua và theo dõi công nợ.";
  }
  if (hasAnyRole(["ROLE_SALES"])) {
    return "Bạn có thể tạo đơn bán nháp và theo dõi các đơn do mình phụ trách.";
  }
  if (hasAnyRole(["ROLE_PURCHASER"])) {
    return "Bạn có thể tạo đơn mua nháp và theo dõi các đơn do mình phụ trách.";
  }
  if (hasAnyRole(["ROLE_WAREHOUSE"])) {
    return "Bạn có thể tạo phiếu điều chuyển và theo dõi dữ liệu kho được phân quyền.";
  }
  if (hasAnyRole(["ROLE_SHIPPER"])) {
    return "Bạn có thể theo dõi và xử lý các phiếu điều chuyển được phân quyền.";
  }
  return "Tài khoản hiện chưa có quyền nghiệp vụ chuyên môn.";
});

const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
});

const quickActions = [
  {
    title: "Tạo sản phẩm",
    route: "/products",
    icon: "/img-fix/icon/icon-storefront.svg",
    cardClass: "card-blue",
  },
  {
    title: "Tạo đơn bán",
    route: "/sales-orders",
    icon: "/img-fix/icon/icon-bold-cart-green.svg",
    cardClass: "card-yellow",
  },
  {
    title: "Tạo đơn nhập",
    route: "/purchase-orders",
    icon: "/img-fix/icon/icon-truck-teal.svg",
    cardClass: "card-purple",
  },
  {
    title: "Kiểm tồn",
    route: "/inventory-balances",
    icon: "/img-fix/icon/icon-storage-blue.svg",
    cardClass: "card-green",
  },
  {
    title: "Nhà cung cấp",
    route: "/suppliers",
    icon: "/img-fix/icon/icon-bold-buildingoffice-white.svg",
    cardClass: "card-aqua",
  },
  {
    title: "Tài khoản",
    route: "/users",
    icon: "/img-fix/icon/icon-user-add-blue.svg",
    cardClass: "card-red",
  },
];

const quickActionRoleMap: Record<string, string[]> = {
  "/products": catalogRoles,
  "/sales-orders": salesRoles,
  "/purchase-orders": purchaseRoles,
  "/inventory-balances": inventoryRoles,
  "/suppliers": catalogRoles,
  "/users": adminOnlyRoles,
};

const permittedQuickActions = computed(() =>
  quickActions.filter((action) =>
    hasAnyRole(quickActionRoleMap[action.route] || []),
  ),
);
const moduleCards: ModuleCard[] = [
  {
    title: "Đơn bán hàng",
    description: "Theo dõi và tạo đơn bán",
    route: "/sales-orders",
    icon: "/img-fix/icon/icon-bold-cart-green.svg",
    colorClass: "mdl-linear-blue",
    roles: salesRoles,
  },
  {
    title: "Khách hàng",
    description: "Danh sách khách hàng và công nợ",
    route: "/customers",
    icon: "/img-fix/icon/icon-user-add-blue.svg",
    colorClass: "mdl-linear-blue-2",
    roles: salesRoles,
  },
  {
    title: "Đơn nhập hàng",
    description: "Quản lý nhập hàng",
    route: "/purchase-orders",
    icon: "/img-fix/icon/icon-truck-white.svg",
    colorClass: "mdl-linear-purple",
    roles: purchaseRoles,
  },
  {
    title: "Đơn điều chuyển",
    description: "Điều chuyển hàng giữa các kho",
    route: "/transfer-orders",
    icon: "/img-fix/icon/icon-truck-teal.svg",
    colorClass: "mdl-linear-orange",
    roles: transferRoles,
  },
  {
    title: "Kho hàng",
    description: "Danh mục kho vận hành",
    route: "/warehouses",
    icon: "/img-fix/icon/icon-storage-blue.svg",
    colorClass: "mdl-linear-gray",
    roles: adminManagerRoles,
  },
  {
    title: "Số dư tồn kho",
    description: "Kiểm tra tồn thực tế",
    route: "/inventory-balances",
    icon: "/img-fix/icon/icon-storage-blue.svg",
    colorClass: "mdl-linear-green",
    roles: inventoryRoles,
  },
  {
    title: "Giao dịch tồn kho",
    description: "Lịch sử biến động kho",
    route: "/inventory-transactions",
    icon: "/img-fix/icon/icon-square-dot.svg",
    colorClass: "mdl-linear-green-2",
    roles: inventoryRoles,
  },
  {
    title: "Sản phẩm",
    description: "Danh mục sản phẩm",
    route: "/products",
    icon: "/img-fix/icon/icon-storefront.svg",
    colorClass: "mdl-linear-green-2",
    roles: catalogRoles,
  },
  {
    title: "Nhóm sản phẩm",
    description: "Phân nhóm sản phẩm",
    route: "/product-categories",
    icon: "/img-fix/icon/icon-tag-new-white.svg",
    colorClass: "mdl-linear-orange",
    roles: catalogRoles,
  },
  {
    title: "Nhà cung cấp",
    description: "Thông tin nhà cung cấp",
    route: "/suppliers",
    icon: "/img-fix/icon/icon-bold-buildingoffice-white.svg",
    colorClass: "mdl-linear-blue-2",
    roles: catalogRoles,
  },
  {
    title: "Thanh toán",
    description: "Phiếu thu, phiếu chi và duyệt thanh toán",
    route: "/payments",
    icon: "/img-fix/icon/icon-info-duetone.svg",
    colorClass: "mdl-linear-purple",
    roles: financeRoles,
  },
  {
    title: "Tài khoản",
    description: "Quản trị người dùng",
    route: "/users",
    icon: "/img-fix/icon/icon-user-add-blue.svg",
    colorClass: "mdl-linear-gray",
    roles: adminOnlyRoles,
  },
  {
    title: "Nhân viên",
    description: "Hồ sơ nhân sự và phân công kho",
    route: "/employees",
    icon: "/img-fix/icon/icon-user-add-blue.svg",
    colorClass: "mdl-linear-blue",
    roles: adminManagerRoles,
  },
  {
    title: "Phòng ban",
    description: "Cơ cấu phòng ban",
    route: "/departments",
    icon: "/img-fix/icon/icon-bold-buildingoffice-white.svg",
    colorClass: "mdl-linear-orange",
    roles: adminManagerRoles,
  },
];

const activeModules = computed(() =>
  moduleCards.filter((module) => hasAnyRole(module.roles)),
);

const inactiveModules = computed(() =>
  moduleCards.filter((module) => !hasAnyRole(module.roles)),
);

const activeModuleCount = computed(() => activeModules.value.length);

const isDraftStatus = (status: string | null | undefined) =>
  (status || "").toUpperCase() === "DRAFT";

const isCompletedStatus = (status: string | null | undefined) => {
  const normalized = (status || "").toUpperCase();
  return ["COMPLETED", "COMPLETE", "DONE", "APPROVED"].includes(normalized);
};

const draftPurchaseOrders = computed(() =>
  purchaseOrderList.value.filter((order) => isDraftStatus(order.status)),
);

const draftSalesOrders = computed(() =>
  salesOrderList.value.filter((order) => isDraftStatus(order.status)),
);

const getOrderCode = (order: Order) =>
  order.orderCode || order.poCode || order.code || `#${order.id}`;

const lowStockBalances = computed(() =>
  balancesWithProduct.value
    .filter((item) => (item.quantity || 0) < 20)
    .sort((a, b) => (a.quantity || 0) - (b.quantity || 0)),
);

const outOfStockCount = computed(
  () => balanceList.value.filter((item) => (item.quantity || 0) <= 0).length,
);

const urgentActions = computed(() => {
  const sales = (
    canApproveOrders.value || canCreateSalesDraft.value
      ? draftSalesOrders.value
      : []
  )
    .slice(0, 2)
    .map((order) => ({
      key: `sales-${order.id}`,
      title: `Đơn bán ${getOrderCode(order)} đang chờ duyệt`,
      meta: formatCurrency(order.totalAmount),
      time: formatDate(order.createdAt),
      route: "/sales-orders",
      icon: "/img-fix/icon/icon-bold-checksquare-yellow.svg",
      rowClass: "tr-job-yellow",
    }));

  const purchases = (
    canApproveOrders.value || canCreatePurchaseDraft.value
      ? draftPurchaseOrders.value
      : []
  )
    .slice(0, 2)
    .map((order) => ({
      key: `purchase-${order.id}`,
      title: `Đơn nhập ${getOrderCode(order)} đang chờ duyệt`,
      meta: formatCurrency(order.totalAmount),
      time: formatDate(order.createdAt),
      route: "/purchase-orders",
      icon: "/img-fix/icon/icon-bold-checksquare-yellow.svg",
      rowClass: "tr-job-blue",
    }));

  const stocks = (canViewInventoryWork.value ? lowStockBalances.value : [])
    .slice(0, 2)
    .map((item) => ({
      key: `stock-${item.id}`,
      title: `${item.product?.name || "Sản phẩm chưa xác định"} sắp hết hàng`,
      meta: `Còn ${item.quantity || 0} đơn vị`,
      time: item.product?.sku || "---",
      route: "/inventory-balances",
      icon: "/img-fix/icon/icon-warning-red.svg",
      rowClass: "tr-job-red",
    }));

  return [...stocks, ...sales, ...purchases].slice(0, 5);
});

const todayOrderCount = computed(() => {
  const orders = [...salesOrderList.value, ...purchaseOrderList.value];
  return orders.filter((order) => isSameDate(order.createdAt, today)).length;
});

const monthSalesAmount = computed(() =>
  salesOrderList.value
    .filter((order) => isSameMonth(order.createdAt, today))
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
);

const totalInventoryQuantity = computed(() =>
  balanceList.value.reduce((sum, item) => sum + (item.quantity || 0), 0),
);

const totalInventoryValue = computed(() =>
  balancesWithProduct.value.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.product?.basePrice || 0),
    0,
  ),
);

const topInventoryProducts = computed(() =>
  [...balancesWithProduct.value]
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5)
    .map((item, index) => ({ ...item, rank: index + 1 })),
);

const recentActivities = computed(() => {
  const sales = salesOrderList.value.map((order) => ({
    key: `sales-${order.id}`,
    title: `Đơn bán ${getOrderCode(order)}`,
    amount: formatCurrency(order.totalAmount),
    date: formatDate(order.createdAt),
    status: formatStatus(order.status),
    createdAt: order.createdAt,
    iconClass: "line-blue",
  }));

  const purchases = purchaseOrderList.value.map((order) => ({
    key: `purchase-${order.id}`,
    title: `Đơn nhập ${getOrderCode(order)}`,
    amount: formatCurrency(order.totalAmount),
    date: formatDate(order.createdAt),
    status: formatStatus(order.status),
    createdAt: order.createdAt,
    iconClass: "line-orange",
  }));

  return [...sales, ...purchases]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 6);
});

const completedSalesCount = computed(
  () =>
    salesOrderList.value.filter((order) => isCompletedStatus(order.status))
      .length,
);

const completedPurchaseCount = computed(
  () =>
    purchaseOrderList.value.filter((order) => isCompletedStatus(order.status))
      .length,
);

const weeklyGoals = computed(() => {
  const totalSales = Math.max(salesOrderList.value.length, 1);
  const totalPurchases = Math.max(purchaseOrderList.value.length, 1);
  const healthyStock = Math.max(
    balanceList.value.length - lowStockBalances.value.length,
    0,
  );
  const totalStock = Math.max(balanceList.value.length, 1);

  return [
    {
      title: "Đơn bán hoàn thành",
      value: `${completedSalesCount.value}/${salesOrderList.value.length}`,
      percent: getPercent(completedSalesCount.value, totalSales),
      barClass: "solid-blue",
      textClass: "txt-blue",
    },
    {
      title: "Đơn nhập hoàn thành",
      value: `${completedPurchaseCount.value}/${purchaseOrderList.value.length}`,
      percent: getPercent(completedPurchaseCount.value, totalPurchases),
      barClass: "shamrock-green",
      textClass: "txt-shamrock-green",
    },
    {
      title: "Tỷ lệ tồn kho ổn định",
      value: `${healthyStock}/${balanceList.value.length}`,
      percent: getPercent(healthyStock, totalStock),
      barClass: "strong-amber",
      textClass: "txt-brown",
    },
  ];
});

const weeklySummary = computed(() => {
  const average =
    weeklyGoals.value.reduce((sum, goal) => sum + goal.percent, 0) /
    Math.max(weeklyGoals.value.length, 1);

  if (average >= 80)
    return `Bạn đang đạt ${Math.round(average)}% mục tiêu vận hành tuần này.`;
  if (average >= 50)
    return `Tiến độ đạt ${Math.round(average)}%, cần ưu tiên các đơn còn nháp.`;
  return "Cần rà soát đơn hàng và tồn kho thấp trong ngày hôm nay.";
});

const dashboardBriefing = computed(() => {
  const parts = [
    `${urgentActions.value.length} việc cần xử lý`,
    `${draftSalesOrders.value.length} đơn bán nháp`,
    `${draftPurchaseOrders.value.length} đơn nhập nháp`,
    `${lowStockBalances.value.length} sản phẩm tồn kho thấp`,
  ];

  return `${rolePermissionSummary.value} Hôm nay hệ thống ghi nhận ${parts.join(", ")}. Doanh thu đơn bán trong tháng hiện là ${formatCurrency(monthSalesAmount.value)}, tổng tồn kho ${totalInventoryQuantity.value} đơn vị.`;
});

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const calendarRows = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const totalDays = getDaysInMonth(currentMonth.value, currentYear.value);
  const calendar: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendar.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    calendar.push(day);
  }

  while (calendar.length % 7 !== 0) {
    calendar.push(null);
  }

  const rows = [];

  for (let i = 0; i < calendar.length; i += 7) {
    rows.push(calendar.slice(i, i + 7));
  }

  return rows;
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
    return;
  }

  currentMonth.value--;
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
    return;
  }

  currentMonth.value++;
};

const isToday = (day: number | null) => {
  if (!day) return false;

  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

const hasCalendarActivity = (day: number | null) => {
  if (!day) return false;
  const selectedDate = new Date(currentYear.value, currentMonth.value, day);
  const orders = [...salesOrderList.value, ...purchaseOrderList.value];
  return orders.some((order) => isSameDate(order.createdAt, selectedDate));
};

const refreshDashboard = async () => {
  const refreshTasks: Promise<unknown>[] = [];

  if (canLoadCatalogData.value || canLoadInventoryData.value) {
    refreshTasks.push(refreshProducts());
  }
  if (canLoadCatalogData.value) {
    refreshTasks.push(refreshCategories(), refreshSuppliers());
  }
  if (canLoadPurchaseData.value) {
    refreshTasks.push(refreshPurchaseOrders());
  }
  if (canLoadSalesData.value) {
    refreshTasks.push(refreshSalesOrders());
  }
  if (canLoadInventoryData.value) {
    refreshTasks.push(refreshInventoryBalances());
  }

  await Promise.all(refreshTasks);
};

const formatCurrency = (amount: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "---";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatStatus = (status: string | null | undefined) => {
  const statusMap: Record<string, string> = {
    DRAFT: "Nháp",
    COMPLETED: "Hoàn thành",
    COMPLETE: "Hoàn thành",
    DONE: "Hoàn thành",
    APPROVED: "Đã duyệt",
    CANCELLED: "Đã hủy",
  };
  const normalized = (status || "").toUpperCase();
  return statusMap[normalized] || status || "---";
};

const getPercent = (value: number, total: number) => {
  if (!total) return 0;
  return Math.min(Math.round((value / total) * 100), 100);
};

const isSameDate = (dateStr: string | null | undefined, date: Date) => {
  if (!dateStr) return false;
  const sourceDate = new Date(dateStr);
  if (Number.isNaN(sourceDate.getTime())) return false;
  return (
    sourceDate.getDate() === date.getDate() &&
    sourceDate.getMonth() === date.getMonth() &&
    sourceDate.getFullYear() === date.getFullYear()
  );
};

const isSameMonth = (dateStr: string | null | undefined, date: Date) => {
  if (!dateStr) return false;
  const sourceDate = new Date(dateStr);
  if (Number.isNaN(sourceDate.getTime())) return false;
  return (
    sourceDate.getMonth() === date.getMonth() &&
    sourceDate.getFullYear() === date.getFullYear()
  );
};
</script>
