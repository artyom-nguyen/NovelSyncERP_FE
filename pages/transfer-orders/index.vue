<template>
  <div class="top-layout-site">
    <div class="main-layout-site">
      <div class="block-lead-view">
        <div class="main-tab">
          <div class="block-utility-topbar">
            <div class="lst-utility-wrapper">
              <div class="item-utility-topbar">
                <a
                  v-if="canCreateTransferOrder"
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="openCreatePopup"
                >
                  <img src="/img-fix/icon/icon-topbar-add.svg" alt="" />
                  <span class="topbar-tooltip">Thêm đơn điều chuyển</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshTransferOrders()"
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
                  placeholder="Tìm mã đơn, kho, trạng thái"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredTransferOrders.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã điều chuyển</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Kho xuất</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Kho nhận</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số dòng hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Người tạo</p>
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
                      v-for="order in filteredTransferOrders"
                      :key="order.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ order.transferCode }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ order.fromWarehouse?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ order.toWarehouse?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ order.transferOrderLines?.length || 0 }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ order.employee?.fullName || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p
                          class="txt-content-table"
                          :class="statusClass(order.status)"
                        >
                          • {{ statusLabel(order.status) }}
                        </p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(order.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{ 'open-box': openActionId === order.id }"
                            >
                              <div
                                v-if="
                                  order.status === 'DRAFT' &&
                                  canApproveTransferOrder
                                "
                                class="imt-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleWorkflow(order.id, 'approve')"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-checked-chat.svg"
                                      alt=""
                                    />
                                  </span>
                                  Duyệt đơn
                                </a>
                              </div>
                              <div
                                v-if="
                                  order.status === 'APPROVED' &&
                                  canHandleTransferDelivery
                                "
                                class="imt-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="
                                    handleWorkflow(order.id, 'start-delivery')
                                  "
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-topbar-reload.svg"
                                      alt=""
                                    />
                                  </span>
                                  Bắt đầu giao
                                </a>
                              </div>
                              <div
                                v-if="
                                  order.status === 'PROCESSING' &&
                                  canHandleTransferDelivery
                                "
                                class="imt-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="
                                    handleWorkflow(order.id, 'confirm-delivery')
                                  "
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-checked-chat.svg"
                                      alt=""
                                    />
                                  </span>
                                  Xác nhận giao
                                </a>
                              </div>
                              <div
                                v-if="
                                  order.status === 'PROCESSING' &&
                                  canCompleteTransferOrder
                                "
                                class="imt-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleWorkflow(order.id, 'complete')"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-checked-chat.svg"
                                      alt=""
                                    />
                                  </span>
                                  Hoàn tất
                                </a>
                              </div>
                              <div
                                v-if="
                                  canCancelTransferOrder &&
                                  (order.status === 'DRAFT' ||
                                    order.status === 'APPROVED')
                                "
                                class="imt-action delete-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleWorkflow(order.id, 'cancel')"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-delete-popup.svg"
                                      alt=""
                                    />
                                  </span>
                                  Hủy đơn
                                </a>
                              </div>
                              <div
                                v-if="order.status === 'DRAFT'"
                                class="imt-action delete-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleDeleteTransferOrder(order.id)"
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
                  Chưa có đơn điều chuyển nào
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        class="popup-export-file ct-popup-width-1200 new-popup-common"
        :class="{ 'open-popup': isPopupOpen }"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-rgl">Tạo đơn điều chuyển</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closePopup">×</div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="form-bm-popup">
                  <div class="form-row-2">
                    <div class="imt-bm-form">
                      <p class="txt-ct-input">Mã điều chuyển</p>
                      <div class="ct-form-input">
                        <input
                          v-model="formData.transferCode"
                          type="text"
                          maxlength="255"
                          placeholder="Nhập mã điều chuyển"
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
                      <p class="txt-ct-input">Trạng thái</p>
                      <div class="ct-form-input">
                        <input value="Nháp" type="text" disabled />
                      </div>
                    </div>
                  </div>
                  <div class="form-row-2">
                    <div class="imt-bm-form">
                      <p class="txt-ct-input">Kho xuất</p>
                      <div class="ct-form-select">
                        <select v-model="formData.fromWarehouseId">
                          <option value="" disabled>Chọn kho xuất</option>
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
                    <div class="imt-bm-form">
                      <p class="txt-ct-input">Kho nhận</p>
                      <div class="ct-form-select">
                        <select v-model="formData.toWarehouseId">
                          <option value="" disabled>Chọn kho nhận</option>
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

                <div class="box-table-purchased-order scroll-content-tab mt-15">
                  <div class="box-info-product">
                    <div class="title">
                      <div class="txt-wth-icon">
                        <div class="icon">
                          <img src="/img-fix/icon/icon-info-duetone.svg" alt="" />
                        </div>
                        <p class="text-size-14-medium">Danh sách sản phẩm</p>
                      </div>
                    </div>
                    <div class="button-add-pd">
                      <a
                        href="javascript:;"
                        class="btn-frame-color primary"
                        @click="addLine"
                      >
                        <div class="icon">
                          <img
                            src="/img-fix/icon/icon-bold-plus-white.svg"
                            alt=""
                          />
                        </div>
                        <p class="text-size-13-medium">Thêm sản phẩm</p>
                      </a>
                    </div>
                  </div>
                  <div class="box-table-2025 table-no-action">
                    <div class="group-table-web">
                      <div class="block-table-crm-kh ct-xs-column">
                        <div class="title-table">
                          <div class="imt-title-table flex-n-2">
                            <p class="txt-title-table">Sản phẩm</p>
                          </div>
                          <div class="imt-title-table">
                            <p class="txt-title-table">Số lượng</p>
                          </div>
                          <div class="imt-title-table imt-btn-table"></div>
                        </div>
                        <div class="content-table">
                          <div
                            v-for="(line, index) in formData.lines"
                            :key="index"
                            class="tr-table"
                          >
                            <div class="imt-content-table flex-n-2">
                              <div class="ct-form-select w-100">
                                <select v-model="line.productId">
                                  <option value="" disabled>
                                    Chọn sản phẩm
                                  </option>
                                  <option
                                    v-for="product in products"
                                    :key="product.id"
                                    :value="product.id"
                                  >
                                    {{ product.sku }} - {{ product.name }}
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
                            <div class="imt-content-table">
                              <div class="ct-form-input">
                                <input
                                  v-model.number="line.quantity"
                                  type="number"
                                  min="1"
                                />
                              </div>
                            </div>
                            <div class="imt-content-table imt-btn-table">
                              <div class="btn-action-end-modal">
                                <a
                                  href="javascript:;"
                                  class="layout-btn wth-tooltip"
                                  @click="removeLine(index)"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-delete-dt.svg"
                                      alt=""
                                    />
                                  </span>
                                  <span class="topbar-tooltip">Xóa</span>
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
                  @click="handleSubmitTransferOrder"
                >
                  <p class="text-size-13-medium">
                    {{ isSubmitting ? "Đang tạo..." : "Tạo đơn nháp" }}
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
  sku?: string;
  name?: string;
  fullName?: string;
}

interface TransferLine {
  id?: number;
  quantity: number;
  product?: SimpleRef | null;
}

interface TransferOrder {
  id: number;
  transferCode: string;
  status: string;
  fromWarehouse?: SimpleRef | null;
  toWarehouse?: SimpleRef | null;
  employee?: SimpleRef | null;
  transferOrderLines?: TransferLine[] | null;
}

interface LineForm {
  productId: number | string;
  quantity: number;
}

interface TransferForm {
  transferCode: string;
  fromWarehouseId: number | string;
  toWarehouseId: number | string;
  lines: LineForm[];
}

const toast = useToast();
const { confirmDelete } = useConfirmDialog();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isSubmitting = ref(false);

const defaultLine = (): LineForm => ({ productId: "", quantity: 1 });
const defaultForm = (): TransferForm => ({
  transferCode: "",
  fromWarehouseId: "",
  toWarehouseId: "",
  lines: [defaultLine()],
});
const formData = ref<TransferForm>(defaultForm());

const { data: transferOrders, refresh: refreshTransferOrders } = await useAPI<
  TransferOrder[]
>(API_ENDPOINTS.transferOrders.listEager);
const { data: account } = await useAPI<any>(API_ENDPOINTS.account.me);
const { data: warehousesData } = await useAPI<SimpleRef[]>(
  API_ENDPOINTS.warehouses.listSorted,
);
const { data: productsData } = await useAPI<SimpleRef[]>(
  API_ENDPOINTS.products.listSorted,
);

const warehouses = computed(() => warehousesData.value || []);
const products = computed(() => productsData.value || []);
const { createRoleChecker, getActionRoles, getUserRoles } =
  useRoutePermissions();
const userRoles = computed(() => getUserRoles(account.value));
const hasAnyRole = createRoleChecker(userRoles);
const canCreateTransferOrder = computed(() =>
  hasAnyRole(getActionRoles("transferOrders.create")),
);
const canApproveTransferOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const canHandleTransferDelivery = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_SHIPPER"]),
);
const canCompleteTransferOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const canCancelTransferOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredTransferOrders = computed(() =>
  (transferOrders.value || []).filter((order) =>
    [
      order.transferCode,
      order.status,
      order.fromWarehouse?.name,
      order.toWarehouse?.name,
      order.employee?.fullName,
    ]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

const statusLabel = (status: string) =>
  ({
    DRAFT: "Nháp",
    APPROVED: "Đã duyệt",
    PROCESSING: "Đang giao",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
    CANCELED: "Đã hủy",
  })[status] || status;

const statusClass = (status: string) =>
  ({
    DRAFT: "text-blue",
    APPROVED: "text-green",
    PROCESSING: "text-orange",
    COMPLETED: "text-green",
    CANCELLED: "text-red",
    CANCELED: "text-red",
  })[status] || "";

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const handleGenerateCode = () => {
  formData.value.transferCode = generateModuleCode(
    "transferOrder",
    (transferOrders.value || []).map((order) => order.transferCode),
  );
};

const openCreatePopup = () => {
  if (!canCreateTransferOrder.value) return;
  formData.value = {
    ...defaultForm(),
    transferCode: generateModuleCode(
      "transferOrder",
      (transferOrders.value || []).map((order) => order.transferCode),
    ),
  };
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = defaultForm();
};

const addLine = () => formData.value.lines.push(defaultLine());

const removeLine = (index: number) => {
  if (formData.value.lines.length > 1) formData.value.lines.splice(index, 1);
};

const handleSubmitTransferOrder = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.transferCode, "Mã điều chuyển"),
    validateRequired(formData.value.fromWarehouseId, "Kho xuất"),
    validateRequired(formData.value.toWarehouseId, "Kho nhận"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  if (
    Number(formData.value.fromWarehouseId) ===
    Number(formData.value.toWarehouseId)
  ) {
    toast.fromMessage("Kho xuất và kho nhận không được trùng nhau");
    return;
  }

  const validLines = formData.value.lines.filter(
    (line) => line.productId && Number(line.quantity) > 0,
  );

  if (!validLines.length) {
    toast.fromMessage("Vui lòng chọn ít nhất một sản phẩm");
    return;
  }

  isSubmitting.value = true;
  const payload = {
    transferCode: formData.value.transferCode.trim(),
    status: "DRAFT",
    fromWarehouse: { id: Number(formData.value.fromWarehouseId) },
    toWarehouse: { id: Number(formData.value.toWarehouseId) },
    transferOrderLines: validLines.map((line) => ({
      quantity: Number(line.quantity),
      product: { id: Number(line.productId) },
    })),
  };

  const { error } = await useAPI(API_ENDPOINTS.transferOrders.list, {
    method: "POST",
    body: payload,
  });

  isSubmitting.value = false;

  if (error.value) {
    toast.fromMessage(
      getApiErrorMessage(error.value, "Không thể tạo đơn điều chuyển"),
    );
    return;
  }

  toast.fromMessage("Tạo đơn điều chuyển thành công!");
  closePopup();
  await refreshTransferOrders();
};

const handleWorkflow = async (id: number, action: string) => {
  const { error } = await useAPI(API_ENDPOINTS.transferOrders.workflow(id, action), {
    method: "PUT",
  });

  if (error.value) {
    toast.fromMessage(
      getApiErrorMessage(error.value, "Không thể cập nhật trạng thái đơn"),
    );
    return;
  }

  toast.fromMessage("Cập nhật trạng thái đơn thành công!");
  openActionId.value = null;
  await refreshTransferOrders();
};

const handleDeleteTransferOrder = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa đơn điều chuyển này?",
  );
  if (!isConfirm) return;

  const { error } = await useAPI(API_ENDPOINTS.transferOrders.detail(id), {
    method: "DELETE",
  });

  if (error.value) {
    toast.fromMessage(
      getApiErrorMessage(error.value, "Không thể xóa đơn điều chuyển"),
    );
    return;
  }

  toast.fromMessage("Xóa đơn điều chuyển thành công!");
  openActionId.value = null;
  await refreshTransferOrders();
};
</script>
