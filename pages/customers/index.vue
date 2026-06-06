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
                  <span class="topbar-tooltip">Thêm khách hàng</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshCustomers()"
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
                  placeholder="Tìm mã, tên, số điện thoại"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredCustomers.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã khách hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên khách hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số điện thoại</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Hạn mức nợ</p>
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
                      v-for="customer in filteredCustomers"
                      :key="customer.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ customer.code }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">{{ customer.name }}</p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ customer.phone || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatCurrency(customer.creditLimit) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatCurrency(customer.currentDebt) }}
                        </p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(customer.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === customer.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(customer)"
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
                                  @click="handleDeleteCustomer(customer.id)"
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
                  Chưa có khách hàng nào
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
                  {{ isEditMode ? "Chỉnh sửa khách hàng" : "Thêm khách hàng" }}
                </p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closePopup">×</div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="form-bm-popup">
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Mã khách hàng</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.code"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập mã khách hàng"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Tên khách hàng</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.name"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập tên khách hàng"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Số điện thoại</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.phone"
                        type="tel"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="30"
                        placeholder="Nhập số điện thoại"
                        @input="handlePhoneInput"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Hạn mức nợ</p>
                    <div class="ct-form-input">
                      <input
                        v-model.number="formData.creditLimit"
                        type="number"
                        min="0"
                        placeholder="Nhập hạn mức nợ"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Công nợ hiện tại</p>
                    <div class="ct-form-input">
                      <input
                        v-model.number="formData.currentDebt"
                        type="number"
                        min="0"
                        placeholder="Nhập công nợ hiện tại"
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
                  @click="handleSubmitCustomer"
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

interface Customer {
  id: number;
  code: string;
  name: string;
  phone?: string | null;
  creditLimit?: number | null;
  currentDebt?: number | null;
}

interface CustomerForm {
  id?: number;
  code: string;
  name: string;
  phone: string;
  creditLimit: number | null;
  currentDebt: number | null;
}

const toast = useToast();
const { confirmDelete } = useConfirmDialog();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const defaultForm: CustomerForm = {
  id: undefined,
  code: "",
  name: "",
  phone: "",
  creditLimit: null,
  currentDebt: null,
};
const formData = ref<CustomerForm>({ ...defaultForm });

const { data: customers, refresh: refreshCustomers } = await useAPI<
  Customer[]
>("/customers?size=1000&sort=id,asc");

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredCustomers = computed(() =>
  (customers.value || []).filter((customer) =>
    [customer.code, customer.name, customer.phone]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

const formatCurrency = (value?: number | null) =>
  value == null
    ? "---"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(value));

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed || null;
};

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = { ...defaultForm };
  isPopupOpen.value = true;
};

const openEditPopup = (customer: Customer) => {
  isEditMode.value = true;
  formData.value = {
    id: customer.id,
    code: customer.code,
    name: customer.name,
    phone: customer.phone || "",
    creditLimit: customer.creditLimit ?? null,
    currentDebt: customer.currentDebt ?? null,
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

const handleSubmitCustomer = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã khách hàng"),
    validateRequired(formData.value.name, "Tên khách hàng"),
    validateDigitsOnly(formData.value.phone, "Số điện thoại"),
    validateMaxLength(formData.value.phone, 30, "Số điện thoại"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;
  const payload = {
    code: formData.value.code.trim(),
    name: formData.value.name.trim(),
    phone: trimOrNull(formData.value.phone),
    creditLimit: formData.value.creditLimit,
    currentDebt: formData.value.currentDebt,
    ...(isEditMode.value ? { id: formData.value.id } : {}),
  };

  const { error } = await useAPI(
    isEditMode.value ? `/customers/${formData.value.id}` : "/customers",
    { method: isEditMode.value ? "PUT" : "POST", body: payload },
  );

  isSubmitting.value = false;

  if (error.value) {
    const errorData = error.value.data as any;
    toast.fromMessage(
      errorData?.message || errorData?.title || "Không thể lưu khách hàng",
    );
    return;
  }

  toast.fromMessage(
    isEditMode.value
      ? "Cập nhật khách hàng thành công!"
      : "Tạo khách hàng thành công!",
  );
  closePopup();
  await refreshCustomers();
};

const handleDeleteCustomer = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa khách hàng này?",
  );
  if (!isConfirm) return;

  const { error } = await useAPI(`/customers/${id}`, { method: "DELETE" });

  if (error.value) {
    const errorData = error.value.data as any;
    toast.fromMessage(
      errorData?.message || errorData?.title || "Không thể xóa khách hàng",
    );
    return;
  }

  toast.fromMessage("Xóa khách hàng thành công!");
  openActionId.value = null;
  await refreshCustomers();
};
</script>
