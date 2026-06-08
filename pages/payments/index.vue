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
                  @click="openDisbursementPopup"
                >
                  <img src="/img-fix/icon/icon-topbar-add.svg" alt="" />
                  <span class="topbar-tooltip">Tạo phiếu chi</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshPayments()"
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
                  placeholder="Tìm mã phiếu, đối tác, loại phiếu"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredPayments.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã phiếu</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Loại phiếu</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số tiền</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Trạng thái</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Đơn tham chiếu</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Khách hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Nhà cung cấp</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Ngày tạo</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>
                  <div class="content-table">
                    <div
                      v-for="payment in filteredPayments"
                      :key="payment.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ payment.paymentCode }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ typeLabel(payment.type) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(payment.amount) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p
                          class="txt-content-table"
                          :class="paymentStatusClass(payment.status)"
                        >
                          {{ paymentStatusLabel(payment.status) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ payment.referenceOrderId || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ payment.customer?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ payment.supplier?.name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDateTime(payment.createdAt) }}
                        </p>
                      </div>
                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(payment.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{
                                'open-box': openActionId === payment.id,
                              }"
                            >
                              <div
                                v-if="!payment.status || payment.status === 'PENDING'"
                                class="imt-action"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleApprove(payment.id)"
                                >
                                  <span class="icon">
                                    <img
                                      src="/img-fix/icon/icon-checked-chat.svg"
                                      alt=""
                                    />
                                  </span>
                                  Duyệt phiếu
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
                  Chưa có phiếu thanh toán nào
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
                <p class="text-size-14-rgl">Tạo phiếu chi nhà cung cấp</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closePopup">×</div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="form-bm-popup">
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Nhà cung cấp</p>
                    <div class="ct-form-select">
                      <select v-model="formData.supplierId">
                        <option value="" disabled>Chọn nhà cung cấp</option>
                        <option
                          v-for="supplier in suppliers"
                          :key="supplier.id"
                          :value="supplier.id"
                        >
                          {{ supplier.name }}
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
                    <p class="txt-ct-input">Số tiền</p>
                    <div class="ct-form-input">
                      <input
                        v-model.number="formData.amount"
                        type="number"
                        min="0"
                        placeholder="Nhập số tiền"
                      />
                    </div>
                  </div>
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Ghi chú</p>
                    <div class="ct-form-input">
                      <input
                        v-model="formData.note"
                        type="text"
                        maxlength="255"
                        placeholder="Nội dung chi"
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
                  @click="handleCreateDisbursement"
                >
                  <p class="text-size-13-medium">
                    {{ isSubmitting ? "Đang tạo..." : "Tạo phiếu chi" }}
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

interface PartnerRef {
  id: number;
  code?: string;
  name?: string;
}

interface Payment {
  id: number;
  paymentCode: string;
  type: string;
  amount: number;
  status?: "PENDING" | "COMPLETED" | string;
  referenceOrderId?: number | null;
  createdAt: string;
  customer?: PartnerRef | null;
  supplier?: PartnerRef | null;
}

interface DisbursementForm {
  supplierId: number | string;
  amount: number | null;
  note: string;
}

const toast = useToast();
const searchQuery = ref("");
const openActionId = ref<number | null>(null);
const isPopupOpen = ref(false);
const isSubmitting = ref(false);
const defaultForm: DisbursementForm = {
  supplierId: "",
  amount: null,
  note: "",
};
const formData = ref<DisbursementForm>({ ...defaultForm });

const { data: payments, refresh: refreshPayments } = await useAPI<Payment[]>(
  API_ENDPOINTS.payments.listEager,
);
const { data: suppliersData } = await useAPI<PartnerRef[]>(
  API_ENDPOINTS.suppliers.listSorted,
);

const suppliers = computed(() => suppliersData.value || []);
const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const filteredPayments = computed(() =>
  (payments.value || []).filter((payment) =>
    [
      payment.paymentCode,
      payment.type,
      payment.customer?.name,
      payment.supplier?.name,
      payment.referenceOrderId,
    ]
      .map(normalizeText)
      .join(" ")
      .includes(normalizeText(searchQuery.value)),
  ),
);

const typeLabel = (type: string) =>
  ({ RECEIPT: "Phiếu thu", DISBURSEMENT: "Phiếu chi" })[type] || type;

const paymentStatusLabel = (status?: string | null) =>
  ({ PENDING: "Chờ duyệt", COMPLETED: "Đã hoàn thành" })[status || ""] ||
  status ||
  "---";

const paymentStatusClass = (status?: string | null) =>
  status === "PENDING" ? "text-orange" : "text-green";

const formatCurrency = (value?: number | null) =>
  value == null
    ? "---"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(value));

const formatDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "---";

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const openDisbursementPopup = () => {
  formData.value = { ...defaultForm };
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  formData.value = { ...defaultForm };
};

const handleCreateDisbursement = async () => {
  const validationError = firstValidationError([
    validateRequired(formData.value.supplierId, "Nhà cung cấp"),
    validateRequired(formData.value.amount, "Số tiền"),
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  if (Number(formData.value.amount) <= 0) {
    toast.fromMessage("Số tiền phải lớn hơn 0");
    return;
  }

  isSubmitting.value = true;
  const query = new URLSearchParams({
    supplierId: String(formData.value.supplierId),
    amount: String(formData.value.amount),
    note: formData.value.note.trim(),
  }).toString();

  const { error } = await useAPI(API_ENDPOINTS.payments.disbursement(query), {
    method: "POST",
  });

  isSubmitting.value = false;

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể tạo phiếu chi"));
    return;
  }

  toast.fromMessage("Tạo phiếu chi thành công!");
  closePopup();
  await refreshPayments();
};

const handleApprove = async (id: number) => {
  const { error } = await useAPI(API_ENDPOINTS.payments.approve(id), {
    method: "PUT",
  });

  if (error.value) {
    toast.fromMessage(getApiErrorMessage(error.value, "Không thể duyệt phiếu"));
    return;
  }

  toast.fromMessage("Duyệt phiếu thành công!");
  openActionId.value = null;
  await refreshPayments();
};
</script>
