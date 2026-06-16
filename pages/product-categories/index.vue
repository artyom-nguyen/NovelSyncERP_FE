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
                  <span class="topbar-tooltip">Thêm nhóm sản phẩm</span>
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
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshCategories()"
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
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm" />
              </div>
            </div>
          </div>

          <div
            v-if="filteredCategories.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã nhóm</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên nhóm</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-for="cat in filteredCategories"
                      :key="cat.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ cat.code }}
                        </p>
                      </div>

                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ cat.name || "---" }}
                        </p>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(cat.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === cat.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(cat)"
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
                                  @click="handleDeleteCategory(cat.id)"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-delete-popup.svg"
                                      alt=""
                                    />
                                  </span>
                                  Delete
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
                  Chưa có nhóm sản phẩm nào
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
                  {{ isEditMode ? "Chỉnh sửa" : "Thêm mới" }}
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
                    <p class="txt-ct-input">Mã nhóm</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.code"
                        maxlength="255"
                        placeholder="Nhập mã nhóm"
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
                    <p class="txt-ct-input">Tên nhóm</p>
                    <div class="ct-form-textarea">
                      <textarea
                        v-model="formData.name"
                        maxlength="255"
                        placeholder="Nhập tên nhóm"
                      ></textarea>
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
                  @click="handleSubmitCategory"
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
  alias: ["/catalog/categories"],
});

interface Category {
  id: number;
  code: string;
  name: string;
}

interface CategoryFormPayload {
  id?: number;
  code: string;
  name: string;
}

const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const openActionId = ref<number | null>(null);
const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  code: "",
});
const filterFields = [
  {
    key: "code",
    label: "Mã nhóm",
    type: "text" as const,
    placeholder: "Nhập mã nhóm",
  },
];

const defaultForm: CategoryFormPayload = {
  id: undefined,
  code: "",
  name: "",
};
const formData = ref<CategoryFormPayload>({ ...defaultForm });

const { data: categories, refresh: refreshCategories } =
  await useAPI<Category[]>(API_ENDPOINTS.categories.listSorted);
const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const openFilterPopup = (event?: MouseEvent) => {
  if (event?.currentTarget instanceof HTMLElement) {
    filterAnchorRect.value = event.currentTarget.getBoundingClientRect();
  }
  isFilterPopupOpen.value = true;
};

const filteredCategories = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (categories.value || []).filter((category) => {
    const codeFilter = normalizeText(filters.value.code);
    const searchableText = [category.code, category.name].map(normalizeText).join(" ");
    const matchesSearch = !keyword || searchableText.includes(keyword);
    const matchesCode = !codeFilter || normalizeText(category.code).includes(codeFilter);

    return matchesSearch && matchesCode;
  });
});

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const getExistingCategoryCodes = () =>
  (categories.value || []).map((category) => category.code);

const handleGenerateCode = () => {
  formData.value.code = generateModuleCode(
    "category",
    getExistingCategoryCodes(),
  );
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = {
    ...defaultForm,
    code: generateModuleCode("category", getExistingCategoryCodes()),
  };
  isPopupOpen.value = true;
};

const openEditPopup = (cat: Category) => {
  isEditMode.value = true;
  formData.value = {
    id: cat.id,
    code: cat.code,
    name: cat.name || "",
  };
  openActionId.value = null;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handleSubmitCategory = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã nhóm"),
    validateMaxLength(formData.value.code, 255, "Mã nhóm"),
    validateRequired(formData.value.name, "Tên nhóm"),
    validateMaxLength(formData.value.name, 255, "Tên nhóm"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;

  const payload: any = {
    code: formData.value.code.trim(),
    name: formData.value.name.trim(),
  };

  if (isEditMode.value) {
    payload.id = formData.value.id;
  }

  const apiUrl = isEditMode.value
    ? API_ENDPOINTS.categories.detail(formData.value.id || "")
    : API_ENDPOINTS.categories.list;
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
      ? "Cập nhật nhóm sản phẩm thành công!"
      : "Tạo nhóm sản phẩm thành công!",
  );
  closePopup();
  await refreshCategories();
  isSubmitting.value = false;
};

const handleDeleteCategory = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa nhóm sản phẩm này?",
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(API_ENDPOINTS.categories.detail(id), {
    method: "DELETE",
  });

  if (deleteError.value) {
    const backEndMsg =
      deleteError.value.data?.title ||
      deleteError.value.data?.message ||
      "Không thể xóa nhóm sản phẩm";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Xóa nhóm sản phẩm thành công!");
  openActionId.value = null;
  await refreshCategories();
};
</script>

