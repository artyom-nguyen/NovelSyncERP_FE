<template>
  <div class="top-layout-site">
    <div class="main-layout-site">
      <div class="block-lead-view">
        <div class="main-tab">
          <div class="block-utility-topbar">
            <div class="lst-utility-wrapper">
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="openFilterPopup"
                >
                  <img src="/img-fix/icon/icon-topbar-filter.svg" alt="" />
                  <span class="topbar-tooltip">Bộ lọc</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                >
                  <img src="/img-fix/icon/icon-download-black.svg" alt="" />
                  <span class="topbar-tooltip">Xuất báo cáo</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="fetchBalances"
                >
                  <img src="/img-fix/icon/icon-topbar-reload.svg" alt="" />
                  <span class="topbar-tooltip">Load lại danh sách</span>
                </a>
              </div>
            </div>
            <div class="group-filter-utility-topbar">
              <div class="form-search-work">
                <div class="icon-search">
                  <img src="/img-fix/icon/icon-topbar-search.svg" alt="" />
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm mã, tên, nhóm sản phẩm, kho..."
                />
              </div>
            </div>
          </div>

          <div class="block-main-table-content">
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Thuộc tính</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Nhóm sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Kho</p>
                    </div>
                    <div class="imt-title-table justify-content-end">
                      <p class="txt-title-table">Tồn kho</p>
                    </div>
                    <div
                      v-if="canViewInventoryTransactions"
                      class="imt-title-table imt-btn-table"
                    >
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-if="pendingBalance"
                      class="tr-table p-4 justify-content-center"
                    >
                      <p class="txt-content-table opacity-6">
                        Đang tải dữ liệu tồn kho...
                      </p>
                    </div>

                    <div
                      v-else-if="filteredBalances.length === 0"
                      class="tr-table p-4 justify-content-center"
                    >
                      <p class="txt-content-table opacity-6">
                        Không tìm thấy dữ liệu tồn kho phù hợp.
                      </p>
                    </div>

                    <template v-else>
                      <div
                        v-for="item in filteredBalances"
                        :key="item.id"
                        class="tr-table tr-vertical-middle"
                      >
                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ item.product?.sku || "---" }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <p class="txt-content-table font-weight-bold">
                            {{ item.product?.name || "Chưa liên kết sản phẩm" }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ formatProductAttributes(item.product) }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <div class="label-content-table">
                            <div
                              v-if="!item.product?.category"
                              class="txt-content-table"
                            >
                              ---
                            </div>
                            <template v-else>
                              <div
                                v-if="item.product.category"
                                :key="item.product.category.id"
                                class="ct-label-new"
                              >
                                <div class="label-table-new bg-light-gray">
                                  <p class="text-size-12-medium">
                                    {{ item.product.category.name || "---" }}
                                  </p>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>

                        <div class="imt-content-table">
                          <div class="ct-dots-6">
                            <div class="txt-wth-dots blue">
                              <div class="custom-status-dot"></div>
                              <p class="txt-m-content-table">
                                {{ item.warehouse?.name || "---" }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="imt-content-table">
                          <div class="ct-dots-6">
                            <div
                              class="txt-wth-dots"
                              :class="
                                getInventoryStatusClass(item.quantity)
                              "
                            >
                              <div class="custom-status-dot"></div>
                              <p class="txt-m-content-table">
                                {{ formatNumber(item.quantity) }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="canViewInventoryTransactions"
                          class="imt-content-table imt-btn-table"
                        >
                          <div v-if="item.product" class="flex-action-crm">
                            <div class="imt-action-crm">
                              <div
                                class="icon-dots-row no-bg"
                                @click="toggleActionMenu(item.id)"
                              >
                                <img
                                  src="/img-fix/icon/icon-horiz-new-black.svg"
                                  alt=""
                                />
                              </div>
                              <div
                                class="box-popup-action-imt ct-popup-box"
                                :class="{
                                  'open-box': openActionId === item.id,
                                }"
                              >
                                <div class="imt-action">
                                  <a
                                    href="javascript:;"
                                    @click="openHistoryPopup(item)"
                                  >
                                    <span class="icon">
                                      <img
                                        src="/img-fix/icon/icon-warning-phos.svg"
                                        alt=""
                                      />
                                    </span>
                                    Xem lịch sử thẻ kho
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <TopbarFilterPopup
      v-model:open="isFilterPopupOpen"
      v-model="filters"
      :anchor-rect="filterAnchorRect"
      title="Bộ lọc danh sách"
      :fields="filterFields"
    />

    <Teleport to="body">
      <div
        class="popup-export-file ct-popup-width-1200 new-popup-common"
        :class="{ 'open-popup': isHistoryPopupOpen }"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-rgl">
                  Lịch sử thẻ kho:
                  <span class="font-weight-bold">
                    {{ selectedProduct?.name || "---" }}
                  </span>
                  <span v-if="selectedWarehouse" class="opacity-6">
                    - {{ selectedWarehouse.name || "Kho chưa xác định" }}
                  </span>
                </p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeHistoryPopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content">
              <div class="block-table-crm-kh ct-xs-column">
                <div class="title-table">
                  <div class="imt-title-table">
                    <p class="txt-title-table">Thời gian</p>
                  </div>
                  <div class="imt-title-table">
                    <p class="txt-title-table">Loại giao dịch</p>
                  </div>
                  <div class="imt-title-table">
                    <p class="txt-title-table">Chứng từ</p>
                  </div>
                  <div class="imt-title-table">
                    <p class="txt-title-table">Kho</p>
                  </div>
                  <div class="imt-title-table justify-content-end">
                    <p class="txt-title-table">Số lượng</p>
                  </div>
                </div>

                <div class="content-table">
                  <div
                    v-if="pendingTransaction"
                    class="tr-table p-4 justify-content-center"
                  >
                    <p class="txt-content-table opacity-6">
                      Đang tải lịch sử thẻ kho...
                    </p>
                  </div>
                  <div
                    v-else-if="transactions.length === 0"
                    class="tr-table p-4 justify-content-center"
                  >
                    <p class="txt-content-table opacity-6">
                      Chưa có giao dịch kho nào.
                    </p>
                  </div>

                  <template v-else>
                    <div
                      v-for="txn in transactions"
                      :key="txn.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDateTime(txn.createdDate) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <div class="ct-dots-6">
                          <div
                            class="txt-wth-dots"
                            :class="
                              getTransactionStatusClass(txn.type)
                            "
                          >
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">
                              {{ formatTransactionType(txn.type) }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatReference(txn) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ txn.warehouse?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table justify-content-end">
                        <p
                          class="txt-content-table font-weight-bold text-size-16"
                          :class="getTransactionTextClass(txn.type)"
                        >
                          {{ formatTransactionQuantity(txn) }}
                        </p>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="button-popup-content mt-3">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color ad-border"
                  @click="closeHistoryPopup"
                >
                  <p class="text-size-13-rgl">Đóng</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeHistoryPopup"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const toast = useToast();

definePageMeta({
  alias: ["/inventory/balances"],
});

interface Category {
  id: number;
  code: string | null;
  name: string | null;
}

interface Product {
  id: number;
  sku: string | null;
  name: string | null;
  purchasePrice: number | null;
  sellingPrice: number | null;
  attributes: string | null;
  category: Category | null;
}

interface Warehouse {
  id: number;
  name: string | null;
}

interface InventoryBalance {
  id: number;
  quantity: number;
  product: Product | null;
  warehouse: Warehouse | null;
}

interface InventoryTransaction {
  id: number;
  type: "RECEIPT" | "ISSUE" | "TRANSFER_IN" | "TRANSFER_OUT" | string;
  quantity: number;
  referenceId: number | null;
  createdDate: string | null;
  product: Product | null;
  warehouse: Warehouse | null;
}

const balances = ref<InventoryBalance[]>([]);
const pendingBalance = ref(true);
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  stockStatus: "",
});
const filterFields = [
  {
    key: "stockStatus",
    label: "Tồn kho",
    type: "select" as const,
    options: [
      { label: "Còn hàng", value: "IN_STOCK" },
      { label: "Sắp hết", value: "LOW_STOCK" },
      { label: "Hết hàng", value: "OUT_OF_STOCK" },
    ],
  },
];

const isHistoryPopupOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const selectedWarehouse = ref<Warehouse | null>(null);
const transactions = ref<InventoryTransaction[]>([]);
const pendingTransaction = ref(false);
const { data: account } = await useAPI<any>(API_ENDPOINTS.account.me);
const {
  createRoleChecker,
  getUserRoles,
  inventoryTransactionRoles,
} = useRoutePermissions();
const userRoles = computed(() => getUserRoles(account.value));
const hasAnyRole = createRoleChecker(userRoles);
const canViewInventoryTransactions = computed(() =>
  hasAnyRole(inventoryTransactionRoles),
);

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const fetchBalances = async () => {
  pendingBalance.value = true;

  const { data, error } = await useAPI<InventoryBalance[]>(
    API_ENDPOINTS.inventoryBalances.listPaged,
  );

  if (error.value) {
    balances.value = [];
    toast.fromMessage("Không thể tải danh sách tồn kho.");
    pendingBalance.value = false;
    return;
  }

  balances.value = data.value || [];
  pendingBalance.value = false;
};

const normalizeText = (value: string | number | null | undefined) =>
  String(value ?? "").toLowerCase();

const openFilterPopup = (event?: MouseEvent) => {
  if (event?.currentTarget instanceof HTMLElement) {
    filterAnchorRect.value = event.currentTarget.getBoundingClientRect();
  }
  isFilterPopupOpen.value = true;
};

const getStockStatus = (quantity: number) => {
  if (quantity <= 0) return "OUT_OF_STOCK";
  if (quantity < 20) return "LOW_STOCK";
  return "IN_STOCK";
};

const formatProductAttributes = (product: Product | null) => {
  if (!product?.attributes) return "---";
  const value = product.attributes.trim();
  if (!value || value === "{}") return "---";

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const entries = Object.entries(parsed).filter(([, entryValue]) =>
      entryValue !== null && entryValue !== undefined && String(entryValue).trim() !== "",
    );
    if (!entries.length) return "---";
    return entries.map(([key, entryValue]) => `${key}: ${entryValue}`).join(", ");
  } catch {
    return value;
  }
};

const filteredBalances = computed(() => {
  const keyword = normalizeText(searchQuery.value).trim();

  return balances.value.filter((item) => {
    const product = item.product;
    const searchableText = [
      item.id,
      item.quantity,
      product?.id,
      product?.sku,
      product?.name,
      formatProductAttributes(product),
      product?.category?.name,
      item.warehouse?.id,
      item.warehouse?.name,
    ]
      .map(normalizeText)
      .join(" ");
    const matchesSearch = !keyword || searchableText.includes(keyword);
    const matchesStock =
      !filters.value.stockStatus ||
      getStockStatus(item.quantity) === filters.value.stockStatus;

    return matchesSearch && matchesStock;
  });
});

const openHistoryPopup = async (balance: InventoryBalance) => {
  if (!canViewInventoryTransactions.value) return;

  const product = balance.product;
  if (!product?.id) {
    toast.fromMessage("Không tìm thấy thông tin sản phẩm để xem thẻ kho.");
    return;
  }

  selectedProduct.value = product;
  selectedWarehouse.value = balance.warehouse;
  isHistoryPopupOpen.value = true;
  pendingTransaction.value = true;
  transactions.value = [];
  openActionId.value = null;

  const { data, error } = await useAPI<InventoryTransaction[]>(
    API_ENDPOINTS.inventoryTransactions.list,
  );

  if (error.value) {
    transactions.value = [];
    toast.fromMessage("Không thể tải lịch sử thẻ kho.");
    pendingTransaction.value = false;
    return;
  }

  transactions.value = (data.value || []).filter((transaction) => {
    const matchesProduct = transaction.product?.id === product.id;
    const matchesWarehouse =
      !balance.warehouse?.id || transaction.warehouse?.id === balance.warehouse.id;

    return matchesProduct && matchesWarehouse;
  });
  pendingTransaction.value = false;
};

const closeHistoryPopup = () => {
  isHistoryPopupOpen.value = false;
  selectedProduct.value = null;
  selectedWarehouse.value = null;
  transactions.value = [];
};

const formatDateTime = (dateStr: string | null | undefined) => {
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

const formatNumber = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("vi-VN");

const getInventoryStatusClass = (qty: number | null | undefined) => {
  const quantity = Number(qty || 0);
  if (quantity <= 0) return "red";
  if (quantity < 20) return "orange";
  return "blue";
};

const formatTransactionType = (type: string | null | undefined) => {
  if (type === "RECEIPT") return "Nhập kho";
  if (type === "ISSUE") return "Xuất kho";
  if (type === "TRANSFER_IN") return "Nhập điều chuyển";
  if (type === "TRANSFER_OUT") return "Xuất điều chuyển";
  return type || "---";
};

const getTransactionStatusClass = (type: string | null | undefined) => {
  if (type === "RECEIPT" || type === "TRANSFER_IN") return "blue";
  if (type === "ISSUE" || type === "TRANSFER_OUT") return "red";
  return "orange";
};

const getTransactionTextClass = (type: string | null | undefined) => {
  if (type === "RECEIPT" || type === "TRANSFER_IN") return "text-blue";
  if (type === "ISSUE" || type === "TRANSFER_OUT") return "text-red";
  return "text-orange";
};

const formatReference = (transaction: InventoryTransaction) => {
  return transaction.referenceId ? String(transaction.referenceId) : "---";
};

const formatTransactionQuantity = (transaction: InventoryTransaction) => {
  const prefix =
    transaction.type === "RECEIPT" || transaction.type === "TRANSFER_IN"
      ? "+"
      : "-";
  return `${prefix}${formatNumber(transaction.quantity)}`;
};

const closeActionMenuOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;

  if (!target?.closest(".imt-action-crm")) {
    openActionId.value = null;
  }
};

onMounted(() => {
  fetchBalances();
  document.addEventListener("click", closeActionMenuOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeActionMenuOnOutsideClick);
});
</script>



