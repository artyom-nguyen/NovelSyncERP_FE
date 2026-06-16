<template>
  <div class="top-layout-site reports-page">
    <div class="main-layout-site">
      <div class="block-lead-view">
        <div class="main-tab">
          <div class="block-utility-topbar">
            <div class="lst-utility-wrapper">
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="loadReport"
                >
                  <img src="/img-fix/icon/icon-topbar-reload.svg" alt="" />
                  <span class="topbar-tooltip">Tải lại báo cáo</span>
                </a>
              </div>
            </div>
            <div class="group-filter-utility-topbar">
              <div class="reports-heading">
                <p class="text-size-14-medium">Báo cáo kinh doanh</p>
                <p class="text-size-12-light text-gray-99a">
                  Doanh thu, lợi nhuận và sản phẩm nổi bật từ đơn bán hoàn thành
                </p>
              </div>
            </div>
          </div>

          <section class="reports-panel">
            <div class="panel-head">
              <div>
                <p class="text-size-14-medium">Bộ lọc báo cáo</p>
                <p class="text-size-12-light text-gray-99a">
                  Lọc theo kho, năm và tháng để xem nhanh dữ liệu
                </p>
              </div>
              <button
                class="btn-frame-color primary"
                :disabled="!canViewReport || isLoadingReport"
                @click="loadReport"
              >
                <p class="text-size-13-medium">
                  {{ isLoadingReport ? "Đang tải..." : "Load lại dữ liệu" }}
                </p>
              </button>
            </div>

            <div v-if="canViewReport" class="reports-filter-row">
              <div class="reports-field">
                <p class="txt-ct-input">Kho</p>
                <div class="ct-form-select">
                  <select v-model="reportFilters.warehouseId">
                    <option value="">Tất cả kho</option>
                    <option
                      v-for="warehouse in warehouses"
                      :key="warehouse.id"
                      :value="warehouse.id"
                    >
                      {{ warehouse.name }}
                    </option>
                  </select>
                  <span class="icon-select">
                    <img src="/img-fix/icon/icon-arrow-down-new.svg" alt="" />
                  </span>
                </div>
              </div>
              <div class="reports-field">
                <p class="txt-ct-input">Năm</p>
                <div class="ct-form-input">
                  <input v-model.number="reportFilters.year" type="number" />
                </div>
              </div>
              <div class="reports-field">
                <p class="txt-ct-input">Tháng</p>
                <div class="ct-form-select">
                  <select v-model="reportFilters.month">
                    <option value="">Cả năm</option>
                    <option
                      v-for="month in monthOptions"
                      :key="month"
                      :value="month"
                    >
                      Tháng {{ month }}
                    </option>
                  </select>
                  <span class="icon-select">
                    <img src="/img-fix/icon/icon-arrow-down-new.svg" alt="" />
                  </span>
                </div>
              </div>
            </div>

            <div v-if="!canViewReport" class="reports-empty">
              <p class="text-size-13-rgl">
                Tài khoản cần quyền quản trị viên hoặc kế toán để xem báo cáo.
              </p>
            </div>

            <template v-else>
              <div class="reports-summary">
                <div class="reports-metric">
                  <p class="title">Tổng doanh thu</p>
                  <p class="number">
                    {{ formatCurrency(reportData?.summary?.totalRevenue) }}
                  </p>
                </div>
                <div class="reports-metric">
                  <p class="title">Tổng lợi nhuận</p>
                  <p class="number">
                    {{ formatCurrency(reportData?.summary?.totalProfit) }}
                  </p>
                </div>
              </div>

              <div class="reports-section">
                <div class="panel-head compact">
                  <p class="text-size-13-medium">Xu hướng theo tháng</p>
                </div>
                <div v-if="trendRows.length" class="reports-trend-list">
                  <div
                    v-for="row in trendRows"
                    :key="row.timeLabel"
                    class="trend-row"
                  >
                    <p class="trend-label">{{ row.timeLabel }}</p>
                    <div class="trend-bars">
                      <div class="trend-line">
                        <span>DT</span>
                        <div class="trend-track">
                          <div
                            class="trend-bar revenue"
                            :style="{ width: `${getTrendPercent(row.revenue)}%` }"
                          ></div>
                        </div>
                        <p>{{ formatShortCurrency(row.revenue) }}</p>
                      </div>
                      <div class="trend-line">
                        <span>LN</span>
                        <div class="trend-track">
                          <div
                            class="trend-bar profit"
                            :style="{ width: `${getTrendPercent(row.profit)}%` }"
                          ></div>
                        </div>
                        <p>{{ formatShortCurrency(row.profit) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="reports-empty">
                  <p class="text-size-13-rgl">Chưa có dữ liệu xu hướng.</p>
                </div>
              </div>

              <div class="reports-section">
                <div class="panel-head compact">
                  <p class="text-size-13-medium">
                    Top sản phẩm theo lợi nhuận
                  </p>
                </div>
                <div v-if="topProducts.length" class="reports-table">
                  <div class="reports-table-row head">
                    <p>Sản phẩm</p>
                    <p>SL bán</p>
                    <p>Lợi nhuận</p>
                  </div>
                  <div
                    v-for="product in topProducts"
                    :key="product.productId"
                    class="reports-table-row"
                  >
                    <p>{{ product.productName || "---" }}</p>
                    <p>{{ formatNumber(product.quantitySold) }}</p>
                    <p>{{ formatCurrency(product.profitBrought) }}</p>
                  </div>
                </div>
                <div v-else class="reports-empty">
                  <p class="text-size-13-rgl">Chưa có sản phẩm nổi bật.</p>
                </div>
              </div>

              <div class="reports-section export-section">
                <div class="panel-head compact">
                  <p class="text-size-13-medium">Xuất báo cáo Excel</p>
                </div>
                <div class="reports-filter-row">
                  <div class="reports-field">
                    <p class="txt-ct-input">Từ ngày</p>
                    <div class="ct-form-input">
                      <input v-model="exportFilters.startDate" type="date" />
                    </div>
                  </div>
                  <div class="reports-field">
                    <p class="txt-ct-input">Đến ngày</p>
                    <div class="ct-form-input">
                      <input v-model="exportFilters.endDate" type="date" />
                    </div>
                  </div>
                  <button
                    class="btn-bg-dark"
                    :disabled="isExportingReport"
                    @click="exportReport"
                  >
                    <p class="text">
                      {{ isExportingReport ? "Đang xuất..." : "Xuất Excel" }}
                    </p>
                  </button>
                </div>
              </div>
            </template>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type MoneyValue = number | string | null | undefined;

interface Account {
  authority?: string;
  authorities?: string[];
}

interface Warehouse {
  id: number;
  name: string;
}

interface DashboardSummary {
  totalRevenue: MoneyValue;
  totalProfit: MoneyValue;
}

interface MonthlyTrend {
  timeLabel: string;
  revenue: MoneyValue;
  profit: MoneyValue;
}

interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  profitBrought: MoneyValue;
}

interface DashboardResponse {
  summary: DashboardSummary;
  trendCharts: MonthlyTrend[];
  topProducts: TopProduct[];
}

const toast = useToast();
const config = useRuntimeConfig();
const { syncFromStorage, token } = useAuthToken();
const { createRoleChecker, getUserRoles, reportRoles } =
  useRoutePermissions();

const { data: account } = await useAPI<Account>(API_ENDPOINTS.account.me);
const roles = computed(() => getUserRoles(account.value));
const hasAnyRole = createRoleChecker(roles);
const canViewReport = computed(() => hasAnyRole(reportRoles));

const { data: warehousesData } = await useAPI<Warehouse[]>(
  API_ENDPOINTS.warehouses.listSorted,
  { immediate: canViewReport.value },
);

const warehouses = computed(() => warehousesData.value || []);
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const pad2 = (value: number) => String(value).padStart(2, "0");

const reportFilters = ref({
  warehouseId: "" as number | string,
  year: currentYear,
  month: "" as number | string,
});
const exportFilters = ref({
  startDate: `${currentYear}-${pad2(currentMonth)}-01`,
  endDate: new Date(currentYear, currentMonth, 0).toISOString().slice(0, 10),
});
const reportData = ref<DashboardResponse | null>(null);
const isLoadingReport = ref(false);
const isExportingReport = ref(false);

const authHeaders = (): Record<string, string> => {
  if (process.client) {
    syncFromStorage();
  }
  const headers: Record<string, string> = {};
  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`;
  }
  return headers;
};

const apiFetch = <T>(url: string, options: Record<string, unknown> = {}) =>
  $fetch<T>(url, {
    baseURL: config.public.apiBase,
    ...options,
    headers: {
      ...authHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

const reportQuery = () => {
  const params = new URLSearchParams();
  if (reportFilters.value.warehouseId) {
    params.set("warehouseId", String(reportFilters.value.warehouseId));
  }
  if (reportFilters.value.year) {
    params.set("year", String(reportFilters.value.year));
  }
  if (reportFilters.value.month) {
    params.set("month", String(reportFilters.value.month));
  }
  return params.toString();
};

const loadReport = async () => {
  if (!canViewReport.value) return;
  isLoadingReport.value = true;
  try {
    reportData.value = await apiFetch<DashboardResponse>(
      API_ENDPOINTS.dashboard.data(reportQuery()),
    );
  } catch (error) {
    reportData.value = null;
    toast.fromMessage(getApiErrorMessage(error, "Không thể tải báo cáo"));
  } finally {
    isLoadingReport.value = false;
  }
};

const toInstantStart = (date: string) =>
  new Date(`${date}T00:00:00.000`).toISOString();
const toInstantEnd = (date: string) =>
  new Date(`${date}T23:59:59.999`).toISOString();

const getFileNameFromDisposition = (disposition: string | null) => {
  const fallback = `Bao_Cao_Kinh_Doanh_${Date.now()}.xlsx`;
  if (!disposition) return fallback;
  const utfFileName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utfFileName) return decodeURIComponent(utfFileName);
  return disposition.match(/filename="?([^";]+)"?/i)?.[1] || fallback;
};

const exportReport = async () => {
  if (!exportFilters.value.startDate || !exportFilters.value.endDate) {
    toast.fromMessage("Vui lòng chọn khoảng thời gian xuất báo cáo.");
    return;
  }

  const params = new URLSearchParams({
    startDate: toInstantStart(exportFilters.value.startDate),
    endDate: toInstantEnd(exportFilters.value.endDate),
  });
  if (reportFilters.value.warehouseId) {
    params.set("warehouseId", String(reportFilters.value.warehouseId));
  }

  isExportingReport.value = true;
  try {
    const response = await $fetch.raw<Blob>(
      API_ENDPOINTS.dashboard.export(params.toString()),
      {
        baseURL: config.public.apiBase,
        headers: authHeaders(),
        responseType: "blob",
      },
    );
    const blob = response._data;
    if (!blob) throw new Error("Không nhận được file báo cáo.");

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getFileNameFromDisposition(
      response.headers.get("content-disposition"),
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.fromMessage(getApiErrorMessage(error, "Không thể xuất báo cáo"));
  } finally {
    isExportingReport.value = false;
  }
};

const toNumber = (value: MoneyValue) => Number(value || 0);
const trendRows = computed(() => reportData.value?.trendCharts || []);
const topProducts = computed(() => reportData.value?.topProducts || []);
const maxTrendValue = computed(() =>
  Math.max(
    ...trendRows.value.flatMap((row) => [
      toNumber(row.revenue),
      toNumber(row.profit),
    ]),
    1,
  ),
);
const getTrendPercent = (value: MoneyValue) =>
  Math.max(3, Math.round((toNumber(value) / maxTrendValue.value) * 100));

const formatNumber = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("vi-VN");
const formatCurrency = (amount: MoneyValue) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(toNumber(amount));
const formatShortCurrency = (amount: MoneyValue) => {
  const value = toNumber(amount);
  if (Math.abs(value) >= 1_000_000_000) {
    return `${Math.round(value / 1_000_000_000)} tỷ`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${Math.round(value / 1_000_000)} tr`;
  }
  return formatCurrency(value);
};

onMounted(() => {
  if (canViewReport.value) {
    loadReport();
  }
});
</script>

<style scoped>
.reports-page .main-tab {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.reports-heading {
  text-align: right;
}

.reports-panel {
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-head.compact {
  align-items: flex-start;
}

.reports-filter-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
}

.reports-field {
  min-width: 0;
}

.reports-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.reports-metric {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.reports-metric .title {
  color: #667085;
  font-size: 13px;
  margin-bottom: 6px;
}

.reports-metric .number {
  color: #0f172a;
  font-size: 22px;
  font-weight: 700;
}

.reports-section {
  border-top: 1px solid #edf0f5;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reports-trend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.trend-label {
  font-size: 13px;
  font-weight: 600;
  color: #344054;
}

.trend-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-line {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 92px;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #667085;
}

.trend-track {
  height: 8px;
  background: #edf2f7;
  border-radius: 999px;
  overflow: hidden;
}

.trend-bar {
  height: 100%;
  border-radius: inherit;
}

.trend-bar.revenue {
  background: #2563eb;
}

.trend-bar.profit {
  background: #16a34a;
}

.reports-table {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  overflow: hidden;
}

.reports-table-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px 160px;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid #edf0f5;
  font-size: 13px;
}

.reports-table-row:first-child {
  border-top: 0;
}

.reports-table-row.head {
  background: #f8fafc;
  font-weight: 700;
  color: #344054;
}

.reports-empty {
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 16px;
  color: #667085;
  background: #f8fafc;
}

@media (max-width: 900px) {
  .reports-filter-row,
  .reports-summary,
  .reports-table-row,
  .trend-row {
    grid-template-columns: 1fr;
  }

  .reports-heading {
    text-align: left;
  }
}
</style>

