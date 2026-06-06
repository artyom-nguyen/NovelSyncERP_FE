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
                  <span class="topbar-tooltip">Thêm người dùng</span>
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
                >
                  <img src="/img-fix/icon/icon-download-black.svg" alt="" />
                  <span class="topbar-tooltip">Xuất báo cáo</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshUsers()"
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
            v-if="filteredUsers.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Username</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Họ và tên</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Email</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">SĐT</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Ngày tạo</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Quyền</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Trạng thái</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-for="user in filteredUsers"
                      :key="user.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ user.login }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ getFullName(user.lastName, user.firstName) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">{{ user.email }}</p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ user.phone || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDate(user.createdDate) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <div class="label-content-table">
                          <div
                            v-for="role in user.authorities"
                            :key="role"
                            class="ct-label-new"
                          >
                            <div class="label-table-new bg-light-gray">
                              <p class="text-size-12-medium">
                                {{ formatRole(role) }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="imt-content-table">
                        <div class="ct-dots-6" v-if="getUserStatus(user) === 'ACTIVE'">
                          <div class="txt-wth-dots blue">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">Hoạt động</p>
                          </div>
                        </div>
                        <div
                          class="ct-dots-6"
                          v-else-if="getUserStatus(user) === 'PENDING'"
                        >
                          <div class="txt-wth-dots orange-txt">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">Chờ kích hoạt</p>
                          </div>
                        </div>
                        <div class="ct-dots-6" v-else>
                          <div class="txt-wth-dots d-red-txt">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">Không xác định</p>
                          </div>
                        </div>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(user.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === user.id,
                              }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openEditPopup(user)"
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
                                  @click="handleDeleteUser(user.login)"
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
                  Chưa bất kỳ hoạt động nào
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
                    <p class="txt-ct-input">Username</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="formData.login"
                        maxlength="50"
                        placeholder="Nhập tên đăng nhập"
                        :disabled="isEditMode"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form form-grid-name-custom">
                    <div>
                      <p class="txt-ct-input">Họ</p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          v-model="formData.lastName"
                          maxlength="50"
                          placeholder="Nhập họ"
                        />
                      </div>
                    </div>
                    <div>
                      <p class="txt-ct-input">Tên</p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          v-model="formData.firstName"
                          maxlength="50"
                          placeholder="Nhập tên"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Email</p>
                    <div class="ct-form-input">
                      <input
                        type="email"
                        v-model="formData.email"
                        maxlength="254"
                        placeholder="Nhập email"
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
                        maxlength="15"
                        placeholder="Nhập số điện thoại"
                        @input="handlePhoneInput"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Trạng thái</p>
                    <div class="ct-form-select">
                      <select
                        v-model="formData.status"
                        :disabled="!isEditMode"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="PENDING">Chờ kích hoạt</option>
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
                    <p class="txt-ct-input">Phân quyền</p>
                    <div class="ct-form-select">
                      <select
                        v-model="formData.authority"
                        :disabled="!isEditMode"
                      >
                        <option
                          v-for="role in roleOptions"
                          :key="role.value"
                          :value="role.value"
                        >
                          {{ role.label }}
                        </option>
                      </select>
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
                  @click="handleSubmitUser"
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
  alias: ["/admin/users"],
});

interface User {
  id: number;
  login: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  status: string;
  activated: boolean;
  langKey: string;
  createdBy: string;
  createdDate: string | null;
  lastModifiedBy: string;
  lastModifiedDate: string | null;
  authorities: string[];
}

interface UserFormPayload {
  id?: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  authority: string;
  activated: boolean;
  langKey: string;
}

const isPopupOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const openActionId = ref<number | null>(null);
const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  status: "",
  authority: "",
});

const { fallbackAuthorityNames, formatRole } = useRoutePermissions();

const { data: authorities } = await useAPI<string[]>(
  API_ENDPOINTS.authorities.list,
);

const roleOptions = computed(() => {
  const names = authorities.value?.length
    ? authorities.value
    : fallbackAuthorityNames;

  return names.map((value) => ({
    label: formatRole(value),
    value,
  }));
});

const filterFields = computed(() => [
  {
    key: "status",
    label: "Trạng thái",
    type: "select" as const,
    options: [
      { label: "Hoạt động", value: "ACTIVE" },
      { label: "Chờ kích hoạt", value: "PENDING" },
    ],
  },
  {
    key: "authority",
    label: "Quyền",
    type: "select" as const,
    options: roleOptions.value,
  },
]);

const defaultForm: UserFormPayload = {
  id: undefined,
  login: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "ACTIVE",
  authority: "ROLE_USER",
  activated: false,
  langKey: "en",
};
const formData = ref<UserFormPayload>({ ...defaultForm });

const { data: users, refresh: refreshUsers } =
  await useAPI<User[]>(API_ENDPOINTS.adminUsers.list);

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

const filteredUsers = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (users.value || []).filter((user) => {
    const matchesSearch =
      !keyword ||
      [
        user.login,
        getFullName(user.lastName, user.firstName),
        user.email,
        user.phone,
        getUserStatus(user),
        ...(user.authorities || []),
        ...(user.authorities || []).map(formatRole),
      ]
        .map(normalizeText)
        .join(" ")
        .includes(keyword);
    const matchesStatus =
      !filters.value.status || getUserStatus(user) === filters.value.status;
    const matchesAuthority =
      !filters.value.authority ||
      (user.authorities || []).includes(String(filters.value.authority));

    return matchesSearch && matchesStatus && matchesAuthority;
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

const openEditPopup = (user: User) => {
  isEditMode.value = true;
  formData.value = {
    id: user.id,
    login: user.login,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email,
    phone: user.phone || "",
    status: getUserStatus(user),
    authority:
      user.authorities && user.authorities.length > 0
        ? user.authorities[0]
        : "ROLE_USER",
    activated: user.activated,
    langKey: user.langKey || "en",
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

const handleSubmitUser = async () => {
  const validationError = firstValidationError([
    validateLogin(formData.value.login),
    validateMaxLength(formData.value.firstName, 50, "Tên"),
    validateMaxLength(formData.value.lastName, 50, "Họ"),
    validateRequired(formData.value.email, "Email"),
    validateEmail(formData.value.email),
    validateDigitsOnly(formData.value.phone, "Số điện thoại"),
    validateMaxLength(formData.value.phone, 15, "Số điện thoại"),
    validateMinMaxLength(formData.value.langKey, 2, 10, "Mã ngôn ngữ"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  isSubmitting.value = true;

  const payload: any = {
    login: formData.value.login.trim(),
    firstName: formData.value.firstName.trim(),
    lastName: formData.value.lastName.trim(),
    email: formData.value.email.trim(),
    phone: formData.value.phone.trim(),
    activated: formData.value.status === "ACTIVE",
    langKey: formData.value.langKey,
    authorities: [formData.value.authority],
  };

  if (isEditMode.value) {
    payload.id = formData.value.id;
  }

  const apiUrl = API_ENDPOINTS.adminUsers.list;
  const apiMethod = isEditMode.value ? "PUT" : "POST";

  const { error: submitError } = await useAPI(apiUrl, {
    method: apiMethod,
    body: payload,
  });

  if (submitError.value) {
    const backEndMsg = getApiErrorMessage(submitError.value, "Lỗi xử lý");
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    isSubmitting.value = false;
    return;
  }

  if (!isEditMode.value) {
    toast.fromMessage(
      "Tạo tài khoản thành công! Hệ thống đã gửi email yêu cầu thiết lập mật khẩu đến địa chỉ email của người dùng.",
    );
  } else {
    toast.fromMessage("Cập nhật tài khoản thành công!");
  }

  closePopup();
  await refreshUsers();
  isSubmitting.value = false;
};

const getDeleteUserErrorMessage = (login: string, error: any) => {
  const status = getApiErrorStatus(error);
  const serverMessage = getApiErrorText(error);

  const isLinkedDataError =
    status === 409 ||
    serverMessage.includes("constraint") ||
    serverMessage.includes("foreign key") ||
    serverMessage.includes("data integrity") ||
    serverMessage.includes("could not execute") ||
    serverMessage.includes("cannot delete");

  if (isLinkedDataError || status === 500) {
    return `Không thể xóa tài khoản "${login}" vì tài khoản này đang được liên kết với hồ sơ nhân viên. Vui lòng gỡ liên kết hoặc xóa hồ sơ nhân viên trước.`;
  }

  return getApiErrorMessage(
    error,
    "Không thể xóa tài khoản. Vui lòng thử lại sau.",
  );
};

const handleDeleteUser = async (login: string) => {
  const isConfirm = await confirmDelete(
    `Bạn có chắc chắn muốn xóa tài khoản "${login}"?`,
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(API_ENDPOINTS.adminUsers.detail(login), {
    method: "DELETE",
  });

  if (deleteError.value) {
    toast.fromMessage(getDeleteUserErrorMessage(login, deleteError.value));
    return;
  }

  toast.fromMessage("Xóa user thành công!");
  openActionId.value = null;
  await refreshUsers();
};

const getUserStatus = (user: User) => (user.activated ? "ACTIVE" : "PENDING");

const getFullName = (lastName: string | null, firstName: string | null) => {
  const full = `${lastName || ""} ${firstName || ""}`.trim();
  return full || "---";
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

</script>




