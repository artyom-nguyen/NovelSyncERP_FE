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
                  @click="() => refreshTransactions()"
                >
                  <img src="/img-fix/icon/icon-topbar-reload.svg" alt="" />
                  <span class="topbar-tooltip">Load lại danh sách</span>
                </a>
              </div>
            </div>

            <div
              class="group-filter-utility-topbar inventory-transaction-filter"
            >
              <div class="form-search-work">
                <div class="icon-search">
                  <img src="/img-fix/icon/icon-topbar-search.svg" alt="" />
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm mã giao dịch, mã sản phẩm, tên sản phẩm, chứng từ..."
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
                      <p class="txt-title-table">Mã GD</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Thời gian</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Loại giao dịch</p>
                    </div>
                    <div class="imt-title-table table-cell-right">
                      <p class="txt-title-table">Số lượng</p>
                    </div>
                    <div class="imt-title-table table-cell-right">
                      <p class="txt-title-table">Đơn giá</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">ID sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Chứng từ</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Kho</p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-if="pendingTransactions"
                      class="tr-table table-state-row"
                    >
                      <p class="txt-content-table">
                        Đang tải dữ liệu giao dịch kho...
                      </p>
                    </div>

                    <div
                      v-else-if="filteredTransactions.length === 0"
                      class="tr-table table-state-row"
                    >
                      <p class="txt-content-table">
                        Không tìm thấy giao dịch kho phù hợp.
                      </p>
                    </div>

                    <template v-else>
                      <div
                        v-for="transaction in filteredTransactions"
                        :key="transaction.id"
                        class="tr-table tr-vertical-middle"
                      >
                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ transaction.id }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ formatDateTime(transaction.createdDate) }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <div class="ct-dots-6">
                            <div
                              class="txt-wth-dots"
                              :class="getTransactionDotClass(transaction.type)"
                            >
                              <div class="custom-status-dot"></div>
                              <p class="txt-m-content-table">
                                {{ formatTransactionType(transaction.type) }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="imt-content-table table-cell-right">
                          <p
                            class="txt-content-table"
                            :class="getQuantityClass(transaction.type)"
                          >
                            {{ getQuantityPrefix(transaction.type)
                            }}{{ transaction.quantity.toLocaleString("vi-VN") }}
                          </p>
                        </div>

                        <div class="imt-content-table table-cell-right">
                          <p class="txt-content-table">
                            {{ formatCurrency(transaction.unitCost) }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ transaction.product?.id || "---" }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <p class="txt-content-table">
                            {{ transaction.product?.sku || "---" }}
                          </p>
                        </div>

                        <div class="imt-content-table">
                          <div class="product-cell">
                            <p class="txt-content-table">
                              {{ transaction.product?.name || "---" }}
                            </p>
                            <p class="product-meta">
                              {{ formatProductAttributes(transaction.product) }}
                            </p>
                          </div>
                        </div>

                        <div class="imt-content-table">
                          <component
                            :is="
                              getReferenceRoute(transaction) ? 'NuxtLink' : 'span'
                            "
                            v-bind="
                              getReferenceRoute(transaction)
                                ? {
                                    to: getReferenceRoute(transaction),
                                    class: 'reference-link',
                                  }
                                : { class: 'txt-content-table' }
                            "
                          >
                            {{ formatReference(transaction) }}
                          </component>
                        </div>

                        <div class="imt-content-table">
                          <div class="ct-dots-6">
                            <div class="txt-wth-dots blue">
                              <div class="custom-status-dot"></div>
                              <p class="txt-m-content-table">
                                {{ transaction.warehouse?.name || "---" }}
                              </p>
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

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  alias: ["/inventory/transactions"],
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

interface InventoryTransaction {
  id: number;
  type: "RECEIPT" | "ISSUE" | "TRANSFER_IN" | "TRANSFER_OUT" | string;
  quantity: number;
  unitCost: number | null;
  referenceId: number | null;
  createdDate: string;
  product: Product | null;
  warehouse: {
    id: number;
    name: string;
  } | null;
}

const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  transactionType: "",
  createdFrom: "",
  createdTo: "",
});
const filterFields = [
  {
    key: "transactionType",
    label: "Loại giao dịch",
    type: "select" as const,
    options: [
      { label: "Nhập kho", value: "RECEIPT" },
      { label: "Xuất kho", value: "ISSUE" },
      { label: "Nhập điều chuyển", value: "TRANSFER_IN" },
      { label: "Xuất điều chuyển", value: "TRANSFER_OUT" },
    ],
  },
  {
    key: "createdFrom",
    label: "Từ ngày",
    type: "date" as const,
  },
  {
    key: "createdTo",
    label: "Đến ngày",
    type: "date" as const,
  },
];

const {
  data: inventoryTransactions,
  pending: pendingTransactions,
  refresh: refreshTransactions,
} = await useAPI<InventoryTransaction[]>(
  API_ENDPOINTS.inventoryTransactions.list,
);

const transactions = computed(() => inventoryTransactions.value || []);

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const toDateValue = (value: string | number) =>
  value ? new Date(String(value)).getTime() : null;

const openFilterPopup = (event?: MouseEvent) => {
  if (event?.currentTarget instanceof HTMLElement) {
    filterAnchorRect.value = event.currentTarget.getBoundingClientRect();
  }
  isFilterPopupOpen.value = true;
};

const isInDateRange = (dateStr: string | null | undefined) => {
  if (!filters.value.createdFrom && !filters.value.createdTo) return true;
  if (!dateStr) return false;

  const time = new Date(dateStr).getTime();
  const fromTime = toDateValue(filters.value.createdFrom);
  const toTime = toDateValue(filters.value.createdTo);
  const endOfToDate = toTime ? toTime + 24 * 60 * 60 * 1000 - 1 : null;

  return (!fromTime || time >= fromTime) && (!endOfToDate || time <= endOfToDate);
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

const filteredTransactions = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return transactions.value.filter((transaction) => {
    const matchesType =
      !filters.value.transactionType ||
      transaction.type === filters.value.transactionType;

    const searchableText = [
      transaction.id,
      transaction.type,
      transaction.quantity,
      transaction.unitCost,
      transaction.referenceId,
      formatReference(transaction),
      transaction.product?.id,
      transaction.product?.sku,
      transaction.product?.name,
      formatProductAttributes(transaction.product),
      transaction.product?.category?.name,
      transaction.warehouse?.name,
    ]
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !keyword || searchableText.includes(keyword);

    return (
      matchesType &&
      matchesSearch &&
      isInDateRange(transaction.createdDate)
    );
  });
});

const totalInQuantity = computed(() =>
  transactions.value
    .filter((transaction) => transaction.type === "RECEIPT" || transaction.type === "TRANSFER_IN")
    .reduce((sum, transaction) => sum + (transaction.quantity || 0), 0),
);

const totalOutQuantity = computed(() =>
  transactions.value
    .filter((transaction) => transaction.type === "ISSUE" || transaction.type === "TRANSFER_OUT")
    .reduce((sum, transaction) => sum + (transaction.quantity || 0), 0),
);

const netQuantity = computed(
  () => totalInQuantity.value - totalOutQuantity.value,
);

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

const formatCurrency = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("vi-VN");

const formatTransactionType = (type: string | null | undefined) => {
  if (type === "RECEIPT") return "Nhập kho";
  if (type === "ISSUE") return "Xuất kho";
  if (type === "TRANSFER_IN") return "Nhập điều chuyển";
  if (type === "TRANSFER_OUT") return "Xuất điều chuyển";
  return type || "---";
};

const getTransactionDotClass = (type: string | null | undefined) => {
  if (type === "RECEIPT" || type === "TRANSFER_IN") return "blue";
  if (type === "ISSUE" || type === "TRANSFER_OUT") return "red";
  return "yellow";
};

const getQuantityClass = (type: string | null | undefined) => {
  if (type === "RECEIPT" || type === "TRANSFER_IN") return "quantity-in";
  if (type === "ISSUE" || type === "TRANSFER_OUT") return "quantity-out";
  return "quantity-neutral";
};

const getQuantityPrefix = (type: string | null | undefined) => {
  if (type === "RECEIPT" || type === "TRANSFER_IN") return "+";
  if (type === "ISSUE" || type === "TRANSFER_OUT") return "-";
  return "";
};

const formatReference = (transaction: InventoryTransaction) => {
  return transaction.referenceId ? String(transaction.referenceId) : "---";
};

const getReferenceRoute = (transaction: InventoryTransaction) => {
  if (!transaction.referenceId) return "";

  return "";
};
</script>
