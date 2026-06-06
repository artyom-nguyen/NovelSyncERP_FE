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
                  @click="openCreatePopup"
                >
                  <img src="/img-fix/icon/icon-topbar-add.svg" alt="" />
                  <span class="topbar-tooltip">Thêm sản phẩm</span>
                </a>
              </div>
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
                <a href="javascript:;" class="icon-item-utility wth-tooltip">
                  <img src="/img-fix/icon/icon-download-black.svg" alt="" />
                  <span class="topbar-tooltip">Xuất báo cáo</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="refreshProductList"
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
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm mã, tên, nhóm sản phẩm..."
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredProducts.length > 0"
            class="block-main-table-content"
          >
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
                      <p class="txt-title-table">Nhóm sản phẩm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Thuộc tính</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Giá cơ sở</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tồn kho</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Trạng thái kho</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-for="product in filteredProducts"
                      :key="product.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table">{{ product.sku }}</p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ product.name }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <div class="label-content-table">
                          <div v-if="product.category" class="ct-label-new">
                            <div class="label-table-new bg-light-gray">
                              <p class="text-size-12-medium">
                                {{ product.category.name }}
                              </p>
                            </div>
                          </div>
                          <p v-else class="txt-content-table">---</p>
                        </div>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatAttributes(product.attributes) }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(product.basePrice) }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <div class="ct-dots-6">
                          <p class="txt-m-content-table">
                            {{ getQuantityOnHand(product.id).toLocaleString("vi-VN") }}
                            đơn vị
                          </p>
                        </div>
                      </div>

                      <div class="imt-content-table">
                        <div class="ct-dots-6">
                          <div
                            class="txt-wth-dots"
                            :class="getInventoryStatusClass(product.id)"
                          >
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">
                              {{ getInventoryStatusText(product.id) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(product.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === product.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(product)"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-edit-black-phosphor.svg"
                                      alt=""
                                    />
                                  </span>
                                  Chỉnh sửa
                                </a>
                              </div>
                              <div class="imt-action delete-action">
                                <a
                                  href="javascript:;"
                                  @click="handleDeleteProduct(product.id)"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-delete-popup.svg"
                                      alt=""
                                    />
                                  </span>
                                  Xóa
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="main-empty-page">
            <div class="block-empty-page">
              <div class="box-empty-sidebar icon-empty">
                <div class="icon-empty">
                  <img src="/img-fix/empty-notify.svg" alt="" />
                </div>
                <p class="text-size-14-light opacity-6">
                  Chưa có sản phẩm nào
                </p>
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
        class="popup-export-file ct-popup-width-540 new-popup-common"
        :class="{ 'open-popup': isPopupOpen }"
      >
        <div class="content-export-file">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-rgl">
                  {{ isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm" }}
                </p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closePopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="form-bm-popup">
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Mã sản phẩm</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.sku"
                        maxlength="50"
                        placeholder="Nhập mã hoặc ấn Tạo"
                      />
                      <div class="ct-form-2025">
                        <button
                          class="button-ktra"
                          @click.prevent="handleGenerateCode"
                        >
                          <span class="text">Tạo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Tên sản phẩm</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.name"
                        maxlength="255"
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Giá cơ sở</p>
                    <div class="ct-form-input">
                      <input
                        type="number"
                        v-model="formData.basePrice"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Nhóm sản phẩm</p>
                    <div class="ct-form-select">
                      <select v-model="formData.categoryId">
                        <option value="" disabled>Lựa chọn</option>
                        <option
                          v-for="cat in categoriesData"
                          :key="cat.id"
                          :value="cat.id"
                        >
                          {{ cat.name }}
                        </option>
                      </select>
                      <span class="icon-select">
                        <img
                          src="/img-fix/icon/icon-arrow-down-new.svg"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Thuộc tính mở rộng</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.attributes"
                        maxlength="1000"
                        placeholder='Ví dụ: {"color":"blue"}'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color ad-border"
                  @click="closePopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleSubmitProduct"
                >
                  <p class="text-size-13-medium">
                    {{ isSubmitting ? "Đang lưu..." : "Lưu" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closePopup"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const toast = useToast();
const { confirmDelete } = useConfirmDialog();

definePageMeta({
  alias: ["/catalog/products"],
});

interface Category {
  id: number;
  code: string;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  basePrice: number;
  attributes: string | null;
  category: Category | null;
}

interface InventoryBalance {
  product: Product | null;
  quantity: number;
}

interface ProductFormPayload {
  id?: number;
  sku: string;
  name: string;
  basePrice: number;
  attributes: string;
  categoryId: number | string;
}

const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const openActionId = ref<number | null>(null);
const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  categoryId: "",
  stockStatus: "",
});

const defaultForm: ProductFormPayload = {
  id: undefined,
  sku: "",
  name: "",
  basePrice: 0,
  attributes: "",
  categoryId: "",
};
const formData = ref<ProductFormPayload>({ ...defaultForm });

const { data: products, refresh: refreshProducts } =
  await useAPI<Product[]>(API_ENDPOINTS.products.list);
const { data: inventoryBalances, refresh: refreshInventoryBalances } =
  await useAPI<InventoryBalance[]>(API_ENDPOINTS.inventoryBalances.listPaged);
const { data: categoriesData } = await useAPI<Category[]>(
  API_ENDPOINTS.categories.list,
);

const filterFields = computed(() => [
  {
    key: "categoryId",
    label: "Nhóm sản phẩm",
    type: "select" as const,
    options: (categoriesData.value || []).map((category) => ({
      label: category.name,
      value: category.id,
    })),
  },
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
]);

const inventoryByProductId = computed(() => {
  const map = new Map<number, InventoryBalance>();

  (inventoryBalances.value || []).forEach((balance) => {
    if (balance.product?.id) {
      map.set(balance.product.id, balance);
    }
  });

  return map;
});

const getQuantityOnHand = (productId: number) => {
  return inventoryByProductId.value.get(productId)?.quantity || 0;
};

const getInventoryStatusClass = (productId: number) => {
  const quantity = getQuantityOnHand(productId);
  if (quantity <= 0) return "red";
  if (quantity < 20) return "orange";
  return "blue";
};

const getInventoryStatusText = (productId: number) => {
  const quantity = getQuantityOnHand(productId);
  if (quantity <= 0) return "Hết hàng";
  if (quantity < 20) return "Sắp hết";
  return "Còn hàng";
};

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatAttributes = (attributes: string | null | undefined) => {
  if (!attributes) return "---";
  const trimmed = attributes.trim();
  if (!trimmed || trimmed === "{}") return "---";
  return trimmed;
};

const openFilterPopup = (event?: MouseEvent) => {
  if (event?.currentTarget instanceof HTMLElement) {
    filterAnchorRect.value = event.currentTarget.getBoundingClientRect();
  }
  isFilterPopupOpen.value = true;
};

const refreshProductList = async () => {
  await refreshProducts();
  await refreshInventoryBalances();
};

const filteredProducts = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (products.value || []).filter((product) => {
    const quantityOnHand = getQuantityOnHand(product.id);
    const stockStatus =
      quantityOnHand <= 0
        ? "OUT_OF_STOCK"
        : quantityOnHand < 20
          ? "LOW_STOCK"
          : "IN_STOCK";
    const matchesSearch =
      !keyword ||
      [
        product.sku,
        product.name,
        product.attributes,
        product.category?.name,
      ]
        .map(normalizeText)
        .join(" ")
        .includes(keyword);
    const matchesCategory =
      !filters.value.categoryId ||
      product.category?.id === Number(filters.value.categoryId);
    const matchesStock =
      !filters.value.stockStatus || stockStatus === filters.value.stockStatus;

    return matchesSearch && matchesCategory && matchesStock;
  });
});

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = { ...defaultForm };
  isPopupOpen.value = true;
};

const openEditPopup = (product: Product) => {
  isEditMode.value = true;
  formData.value = {
    id: product.id,
    sku: product.sku,
    name: product.name,
    basePrice: product.basePrice,
    attributes: product.attributes || "",
    categoryId: product.category?.id || "",
  };
  openActionId.value = null;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handleGenerateCode = () => {
  formData.value.sku = `PRD-${Date.now().toString().slice(-8)}`;
};

const handleSubmitProduct = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.sku, "Mã sản phẩm"),
    validateMaxLength(formData.value.sku, 50, "Mã sản phẩm"),
    validateRequired(formData.value.name, "Tên sản phẩm"),
    validateMaxLength(formData.value.name, 255, "Tên sản phẩm"),
    validateNonNegativeNumber(formData.value.basePrice || 0, "Giá cơ sở"),
    validateRequired(formData.value.categoryId, "Nhóm sản phẩm"),
    validateMaxLength(formData.value.attributes, 1000, "Thuộc tính mở rộng"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;

  const selectedCategory = categoriesData.value?.find(
    (category) => category.id === Number(formData.value.categoryId),
  );

  const payload: any = {
    sku: formData.value.sku.trim(),
    name: formData.value.name.trim(),
    basePrice: Number(formData.value.basePrice) || 0,
    attributes: formData.value.attributes.trim() || null,
    category: selectedCategory
      ? {
          id: selectedCategory.id,
          code: selectedCategory.code,
          name: selectedCategory.name,
        }
      : null,
  };

  if (isEditMode.value) {
    payload.id = formData.value.id;
  }

  const apiUrl = isEditMode.value
    ? API_ENDPOINTS.products.detail(formData.value.id || "")
    : API_ENDPOINTS.products.list;
  const apiMethod = isEditMode.value ? "PUT" : "POST";

  const { error: submitError } = await useAPI(apiUrl, {
    method: apiMethod,
    body: payload,
  });

  if (submitError.value) {
    const backEndMsg =
      submitError.value.data?.title ||
      submitError.value.data?.message ||
      "Lỗi xử lý";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    isSubmitting.value = false;
    return;
  }

  toast.fromMessage(
    isEditMode.value
      ? "Cập nhật sản phẩm thành công!"
      : "Tạo sản phẩm thành công!",
  );
  closePopup();
  await refreshProductList();
  isSubmitting.value = false;
};

const handleDeleteProduct = async (id: number) => {
  const isConfirm = await confirmDelete("Bạn có chắc chắn muốn xóa sản phẩm này?");
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(API_ENDPOINTS.products.detail(id), {
    method: "DELETE",
  });

  if (deleteError.value) {
    const backEndMsg =
      deleteError.value.data?.title ||
      deleteError.value.data?.message ||
      "Không thể xóa sản phẩm";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Xóa sản phẩm thành công!");
  openActionId.value = null;
  await refreshProductList();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};
</script>

