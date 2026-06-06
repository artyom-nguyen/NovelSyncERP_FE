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
                  <span class="topbar-tooltip">Thêm phòng ban</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshDepartments()"
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
                  placeholder="Tìm mã, tên phòng ban"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredDepartments.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã phòng ban</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tên phòng ban</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>
                  <div class="content-table">
                    <div
                      v-for="department in filteredDepartments"
                      :key="department.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ department.code }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">{{ department.name }}</p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(department.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === department.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(department)"
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
                                  @click="handleDeleteDepartment(department.id)"
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
                  Chưa có phòng ban nào
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
                  {{ isEditMode ? "Chỉnh sửa phòng ban" : "Thêm phòng ban" }}
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
                    <p class="txt-ct-input">Mã phòng ban</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.code"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập mã phòng ban"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Tên phòng ban</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.name"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập tên phòng ban"
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
                  @click="handleSubmitDepartment"
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

interface Department {
  id: number;
  code: string;
  name: string;
}

interface DepartmentForm {
  id?: number;
  code: string;
  name: string;
}

const toast = useToast();
const { confirmDelete } = useConfirmDialog();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const defaultForm: DepartmentForm = { id: undefined, code: "", name: "" };
const formData = ref<DepartmentForm>({ ...defaultForm });

const { data: departments, refresh: refreshDepartments } = await useAPI<
  Department[]
>("/departments?size=1000&sort=id,asc");

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredDepartments = computed(() =>
  (departments.value || []).filter((department) =>
    [department.code, department.name]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = { ...defaultForm };
  isPopupOpen.value = true;
};

const openEditPopup = (department: Department) => {
  isEditMode.value = true;
  formData.value = {
    id: department.id,
    code: department.code,
    name: department.name,
  };
  openActionId.value = null;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handleSubmitDepartment = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã phòng ban"),
    validateRequired(formData.value.name, "Tên phòng ban"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;
  const payload = {
    code: formData.value.code.trim(),
    name: formData.value.name.trim(),
    ...(isEditMode.value ? { id: formData.value.id } : {}),
  };

  const { error } = await useAPI(
    isEditMode.value ? `/departments/${formData.value.id}` : "/departments",
    { method: isEditMode.value ? "PUT" : "POST", body: payload },
  );

  isSubmitting.value = false;

  if (error.value) {
    const errorData = error.value.data as any;
    toast.fromMessage(
      errorData?.message || errorData?.title || "Không thể lưu phòng ban",
    );
    return;
  }

  toast.fromMessage(
    isEditMode.value
      ? "Cập nhật phòng ban thành công!"
      : "Tạo phòng ban thành công!",
  );
  closePopup();
  await refreshDepartments();
};

const handleDeleteDepartment = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa phòng ban này?",
  );
  if (!isConfirm) return;

  const { error } = await useAPI(`/departments/${id}`, { method: "DELETE" });

  if (error.value) {
    const errorData = error.value.data as any;
    toast.fromMessage(
      errorData?.message || errorData?.title || "Không thể xóa phòng ban",
    );
    return;
  }

  toast.fromMessage("Xóa phòng ban thành công!");
  openActionId.value = null;
  await refreshDepartments();
};
</script>
