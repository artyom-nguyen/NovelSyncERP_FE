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
                  <span class="topbar-tooltip">Thêm kho</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshWarehouses()"
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
                  placeholder="Tìm mã, tên, địa chỉ kho"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredWarehouses.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã kho</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên kho</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Địa chỉ</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>
                  <div class="content-table">
                    <div
                      v-for="warehouse in filteredWarehouses"
                      :key="warehouse.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ warehouse.code }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">{{ warehouse.name }}</p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ warehouse.address || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(warehouse.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === warehouse.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(warehouse)"
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
                                  @click="handleDeleteWarehouse(warehouse.id)"
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
                <p class="text-size-14-light opacity-6">Chưa có kho nào</p>
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
                  {{ isEditMode ? "Chỉnh sửa kho" : "Thêm kho" }}
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
                    <p class="txt-ct-input">Mã kho</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.code"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập mã kho"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Tên kho</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.name"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập tên kho"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Địa chỉ</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.address"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập địa chỉ kho"
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
                  @click="handleSubmitWarehouse"
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

interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string | null;
}

interface WarehouseForm {
  id?: number;
  code: string;
  name: string;
  address: string;
}

const toast = useToast();
const { confirmDelete } = useConfirmDialog();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const defaultForm: WarehouseForm = {
  id: undefined,
  code: "",
  name: "",
  address: "",
};
const formData = ref<WarehouseForm>({ ...defaultForm });

const { data: warehouses, refresh: refreshWarehouses } = await useAPI<
  Warehouse[]
>(API_ENDPOINTS.warehouses.listSorted);

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredWarehouses = computed(() =>
  (warehouses.value || []).filter((warehouse) =>
    [warehouse.code, warehouse.name, warehouse.address]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

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

const openEditPopup = (warehouse: Warehouse) => {
  isEditMode.value = true;
  formData.value = {
    id: warehouse.id,
    code: warehouse.code,
    name: warehouse.name,
    address: warehouse.address || "",
  };
  openActionId.value = null;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handleSubmitWarehouse = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã kho"),
    validateRequired(formData.value.name, "Tên kho"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;
  const payload = {
    code: formData.value.code.trim(),
    name: formData.value.name.trim(),
    address: trimOrNull(formData.value.address),
    ...(isEditMode.value ? { id: formData.value.id } : {}),
  };

  const { error } = await useAPI(
    isEditMode.value
      ? API_ENDPOINTS.warehouses.detail(formData.value.id || "")
      : API_ENDPOINTS.warehouses.list,
    { method: isEditMode.value ? "PUT" : "POST", body: payload },
  );

  isSubmitting.value = false;

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể lưu kho"));
    return;
  }

  toast.fromMessage(
    isEditMode.value ? "Cập nhật kho thành công!" : "Tạo kho thành công!",
  );
  closePopup();
  await refreshWarehouses();
};

const handleDeleteWarehouse = async (id: number) => {
  const isConfirm = await confirmDelete("Bạn có chắc chắn muốn xóa kho này?");
  if (!isConfirm) return;

  const { error } = await useAPI(API_ENDPOINTS.warehouses.detail(id), {
    method: "DELETE",
  });

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể xóa kho"));
    return;
  }

  toast.fromMessage("Xóa kho thành công!");
  openActionId.value = null;
  await refreshWarehouses();
};
</script>
