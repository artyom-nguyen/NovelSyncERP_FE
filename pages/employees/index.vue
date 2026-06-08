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
                  <span class="topbar-tooltip">Thêm nhân viên</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="refreshAll"
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
                  placeholder="Tìm nhân viên, số điện thoại, phòng ban"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredEmployees.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Nhân viên</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số điện thoại</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tài khoản</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Phòng ban</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Kho phụ trách</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>
                  <div class="content-table">
                    <div
                      v-for="employee in filteredEmployees"
                      :key="employee.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ employee.fullName }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ employee.phone || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ employee.user?.login || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ employee.department?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ employee.scopedWarehouse?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(employee.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === employee.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(employee)"
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
                                  @click="handleDeleteEmployee(employee.id)"
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
                  Chưa có nhân viên nào
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
                  {{ isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên" }}
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
                    <p class="txt-ct-input">Họ tên</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.fullName"
                        type="text"
                        maxlength="255"
                        placeholder="Nhập họ tên nhân viên"
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
                        maxlength="20"
                        placeholder="Nhập số điện thoại"
                        @input="handlePhoneInput"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Tài khoản</p>
                    <div class="ct-form-select">
                      <select v-model="formData.userId">
                        <option value="">Không liên kết</option>
                        <option
                          v-for="user in users"
                          :key="user.id"
                          :value="user.id"
                        >
                          {{ user.login }}
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
                    <p class="txt-ct-input">Phòng ban</p>
                    <div class="ct-form-select">
                      <select v-model="formData.departmentId">
                        <option value="">Chưa chọn</option>
                        <option
                          v-for="department in departments"
                          :key="department.id"
                          :value="department.id"
                        >
                          {{ department.name }}
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
                    <p class="txt-ct-input">Kho phụ trách</p>
                    <div class="ct-form-select">
                      <select v-model="formData.scopedWarehouseId">
                        <option value="">Chưa chọn</option>
                        <option
                          v-for="warehouse in warehouses"
                          :key="warehouse.id"
                          :value="warehouse.id"
                        >
                          {{ warehouse.name }}
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
                  @click="handleSubmitEmployee"
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

interface SimpleRef {
  id: number;
  code?: string;
  name?: string;
  login?: string;
  fullName?: string;
}

interface Employee {
  id: number;
  fullName: string;
  phone?: string | null;
  user?: SimpleRef | null;
  scopedWarehouse?: SimpleRef | null;
  department?: SimpleRef | null;
}

interface EmployeeForm {
  id?: number;
  fullName: string;
  phone: string;
  userId: number | string;
  scopedWarehouseId: number | string;
  departmentId: number | string;
}

const toast = useToast();
const { confirmDelete } = useConfirmDialog();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const defaultForm: EmployeeForm = {
  id: undefined,
  fullName: "",
  phone: "",
  userId: "",
  scopedWarehouseId: "",
  departmentId: "",
};
const formData = ref<EmployeeForm>({ ...defaultForm });

const { data: employees, refresh: refreshEmployees } = await useAPI<
  Employee[]
>(API_ENDPOINTS.employees.listEager);
const { data: usersData, refresh: refreshUsers } = await useAPI<SimpleRef[]>(
  API_ENDPOINTS.users.listSorted,
);
const { data: warehousesData, refresh: refreshWarehouses } = await useAPI<
  SimpleRef[]
>(API_ENDPOINTS.warehouses.listSorted);
const { data: departmentsData, refresh: refreshDepartments } = await useAPI<
  SimpleRef[]
>(API_ENDPOINTS.departments.listSorted);

const users = computed(() => usersData.value || []);
const warehouses = computed(() => warehousesData.value || []);
const departments = computed(() => departmentsData.value || []);

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredEmployees = computed(() =>
  (employees.value || []).filter((employee) =>
    [
      employee.fullName,
      employee.phone,
      employee.user?.login,
      employee.department?.name,
      employee.scopedWarehouse?.name,
    ]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed || null;
};

const refOrNull = (id: number | string) => (id ? { id: Number(id) } : null);

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const refreshAll = async () => {
  await Promise.all([
    refreshEmployees(),
    refreshUsers(),
    refreshWarehouses(),
    refreshDepartments(),
  ]);
};

const openCreatePopup = () => {
  isEditMode.value = false;
  formData.value = { ...defaultForm };
  isPopupOpen.value = true;
};

const openEditPopup = (employee: Employee) => {
  isEditMode.value = true;
  formData.value = {
    id: employee.id,
    fullName: employee.fullName,
    phone: employee.phone || "",
    userId: employee.user?.id || "",
    scopedWarehouseId: employee.scopedWarehouse?.id || "",
    departmentId: employee.department?.id || "",
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

const handleSubmitEmployee = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.fullName, "Họ tên nhân viên"),
    validateDigitsOnly(formData.value.phone, "Số điện thoại"),
    validateMaxLength(formData.value.phone, 20, "Số điện thoại"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;
  const payload = {
    fullName: formData.value.fullName.trim(),
    phone: trimOrNull(formData.value.phone),
    user: refOrNull(formData.value.userId),
    scopedWarehouse: refOrNull(formData.value.scopedWarehouseId),
    department: refOrNull(formData.value.departmentId),
    ...(isEditMode.value ? { id: formData.value.id } : {}),
  };

  const { error } = await useAPI(
    isEditMode.value
      ? API_ENDPOINTS.employees.detail(formData.value.id || "")
      : API_ENDPOINTS.employees.list,
    { method: isEditMode.value ? "PUT" : "POST", body: payload },
  );

  isSubmitting.value = false;

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể lưu nhân viên"));
    return;
  }

  toast.fromMessage(
    isEditMode.value
      ? "Cập nhật nhân viên thành công!"
      : "Tạo nhân viên thành công!",
  );
  closePopup();
  await refreshEmployees();
};

const handleDeleteEmployee = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa nhân viên này?",
  );
  if (!isConfirm) return;

  const { error } = await useAPI(API_ENDPOINTS.employees.detail(id), {
    method: "DELETE",
  });

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể xóa nhân viên"));
    return;
  }

  toast.fromMessage("Xóa nhân viên thành công!");
  openActionId.value = null;
  await refreshEmployees();
};
</script>
