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
                  <span class="topbar-tooltip">Thêm nhà cung cấp</span>
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
                  @click="() => refreshSuppliers()"
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
                  placeholder="Tìm mã, tên, số điện thoại..."
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredSuppliers.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã NCC</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên nhà cung cấp</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số điện thoại</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Công nợ hiện tại</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-for="supplier in filteredSuppliers"
                      :key="supplier.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ supplier.code || "---" }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ supplier.name }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ supplier.phone || "---" }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(supplier.currentDebt) }}
                        </p>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(supplier.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === supplier.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(supplier)"
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
                                  @click="handleDeleteSupplier(supplier.id)"
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
                  Chưa có nhà cung cấp nào
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                  {{ isEditMode ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp" }}
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
                    <p class="txt-ct-input">Mã nhà cung cấp</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.code"
                        maxlength="50"
                        placeholder="Nhập mã nhà cung cấp"
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
                    <p class="txt-ct-input">Tên nhà cung cấp</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.name"
                        maxlength="255"
                        placeholder="Nhập tên nhà cung cấp"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Số điện thoại</p>
                    <div class="ct-form-input">
                      <input
                        type="tel"
                        v-model="formData.phone"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="30"
                        placeholder="Nhập số điện thoại"
                        @input="handlePhoneInput"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Công nợ hiện tại</p>
                    <div class="ct-form-input">
                      <input
                        type="number"
                        v-model="formData.currentDebt"
                        min="0"
                        placeholder="0"
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
                  @click="handleSubmitSupplier"
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
  alias: ["/catalog/suppliers"],
});

interface Supplier {
  id: number;
  code: string | null;
  name: string;
  phone: string | null;
  currentDebt?: number | null;
}

interface SupplierFormPayload {
  id?: number;
  code: string;
  name: string;
  phone: string;
  currentDebt: number;
}

const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const openActionId = ref<number | null>(null);
const searchQuery = ref("");

const defaultForm: SupplierFormPayload = {
  id: undefined,
  code: "",
  name: "",
  phone: "",
  currentDebt: 0,
};
const formData = ref<SupplierFormPayload>({ ...defaultForm });

const { data: suppliers, refresh: refreshSuppliers } =
  await useAPI<Supplier[]>(API_ENDPOINTS.suppliers.list);

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredSuppliers = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (suppliers.value || []).filter((supplier) => {
    const matchesSearch =
      !keyword ||
      [supplier.code, supplier.name, supplier.phone, supplier.currentDebt]
        .map(normalizeText)
        .join(" ")
        .includes(keyword);

    return matchesSearch;
  });
});

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const getExistingSupplierCodes = () =>
  (suppliers.value || []).map((supplier) => supplier.code);

const handleGenerateCode = () => {
  formData.value.code = generateModuleCode(
    "supplier",
    getExistingSupplierCodes(),
  );
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = {
    ...defaultForm,
    code: generateModuleCode("supplier", getExistingSupplierCodes()),
  };
  isPopupOpen.value = true;
};

const openEditPopup = (supplier: Supplier) => {
  isEditMode.value = true;
  formData.value = {
    id: supplier.id,
    code: supplier.code || "",
    name: supplier.name,
    phone: supplier.phone || "",
    currentDebt: supplier.currentDebt || 0,
  };
  openActionId.value = null;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const phone = toDigitsOnly(target.value);
  target.value = phone;
  formData.value.phone = phone;
};

const handleSubmitSupplier = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã nhà cung cấp"),
    validateMaxLength(formData.value.code, 50, "Mã nhà cung cấp"),
    validateRequired(formData.value.name, "Tên nhà cung cấp"),
    validateMaxLength(formData.value.name, 255, "Tên nhà cung cấp"),
    validateDigitsOnly(formData.value.phone, "Số điện thoại"),
    validateMaxLength(formData.value.phone, 30, "Số điện thoại"),
    validateNonNegativeNumber(formData.value.currentDebt || 0, "Công nợ hiện tại"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;

  const payload: any = {
    code: formData.value.code.trim(),
    name: formData.value.name.trim(),
    phone: formData.value.phone.trim(),
    currentDebt: Number(formData.value.currentDebt) || 0,
  };

  if (isEditMode.value) {
    payload.id = formData.value.id;
  }

  const apiUrl = isEditMode.value
    ? API_ENDPOINTS.suppliers.detail(formData.value.id || "")
    : API_ENDPOINTS.suppliers.list;
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
      ? "Cập nhật nhà cung cấp thành công!"
      : "Tạo nhà cung cấp thành công!",
  );
  closePopup();
  await refreshSuppliers();
  isSubmitting.value = false;
};

const handleDeleteSupplier = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(API_ENDPOINTS.suppliers.detail(id), {
    method: "DELETE",
  });

  if (deleteError.value) {
    const backEndMsg =
      deleteError.value.data?.title ||
      deleteError.value.data?.message ||
      "Không thể xóa nhà cung cấp";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Xóa nhà cung cấp thành công!");
  openActionId.value = null;
  await refreshSuppliers();
};

const formatCurrency = (amount: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};
</script>

