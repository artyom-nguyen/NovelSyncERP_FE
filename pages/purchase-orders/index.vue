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
                  v-if="canCreatePurchaseOrder"
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
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  v-if="canTriggerRestock"
                  @click="triggerRestock"
                >
                  <img src="/img-fix/icon/icon-storage-blue.svg" alt="" />
                  <span class="topbar-tooltip">
                    {{
                      isTriggeringRestock
                        ? "AI đang chạy"
                        : "AI gợi ý nhập hàng"
                    }}
                  </span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshOrders()"
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
                  placeholder="Tìm kiếm mã đơn"
                />
              </div>
            </div>
          </div>

          <div
            v-if="filteredPurchaseOrders.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã đơn hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Người tạo</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tổng tiền</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Ngày tạo</p>
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
                      v-for="po in filteredPurchaseOrders"
                      :key="po.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ po.poCode }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ po.employee?.fullName || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(po.totalAmount) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDate(po.createdDate) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <div class="ct-dots-6">
                          <div
                            class="txt-wth-dots"
                            :class="getPurchaseStatusClass(po.status)"
                          >
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">
                              {{ formatPurchaseStatus(po.status) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(po.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{ 'open-box': openActionId === po.id }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openDetailPopup(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-warning-phos.svg"
                                      alt=""
                                  /></span>
                                  Xem chi tiết
                                </a>
                              </div>

                              <div
                                class="imt-action"
                                v-if="
                                  po.status === 'DRAFT' &&
                                  canApprovePurchaseOrder
                                "
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleApproveOrder(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-black-checked.svg"
                                      alt=""
                                  /></span>
                                  Duyệt đơn
                                </a>
                              </div>
                              <div
                                class="imt-action"
                                v-if="
                                  po.status === 'APPROVED' &&
                                  canHandlePurchaseDelivery
                                "
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleStartDelivery(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-topbar-reload.svg"
                                      alt=""
                                  /></span>
                                  Bắt đầu lấy hàng
                                </a>
                              </div>
                              <div
                                class="imt-action"
                                v-if="
                                  po.status === 'PROCESSING' &&
                                  canHandlePurchaseDelivery
                                "
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleConfirmDelivery(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-checked-chat.svg"
                                      alt=""
                                  /></span>
                                  Xác nhận hàng về
                                </a>
                              </div>
                              <div
                                class="imt-action"
                                v-if="
                                  po.status === 'PROCESSING' &&
                                  canCompletePurchaseOrder
                                "
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleCompleteOrder(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-black-checked.svg"
                                      alt=""
                                  /></span>
                                  Hoàn thành nhập kho
                                </a>
                              </div>

                              <div
                                class="imt-action delete-action"
                                v-if="canCancelPurchaseOrderStatus(po.status)"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleDeleteOrder(po)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-delete-popup.svg"
                                      alt=""
                                  /></span>
                                  {{
                                    po.status === "DRAFT"
                                      ? "Xóa đơn nháp"
                                      : "Hủy đơn"
                                  }}
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
                  Chưa có đơn nhập hàng nào
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
        v-if="isCreatePopupOpen"
        class="popup-export-file ct-popup-width-1200 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Tạo đơn mua hàng mới</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeCreatePopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="block-kt-sales">
                <div
                  class="block-kt-wrapper-popup tab-create tab-table-scroll block-table-fix"
                >
                  <p class="text-size-14-rgl mb-10">
                    Nhập thông tin đơn hàng và sản phẩm cần mua
                  </p>
                  <div class="form-popup-grid mb-10">
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Mã đơn nhập</p>
                      <div class="ct-form-input bg-gray-ds">
                        <input
                          type="text"
                          class="text-size-14-light"
                          v-model="formData.code"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Người lập đơn</p>
                      <div class="ct-form-input bg-gray-ds">
                        <input
                          type="text"
                          class="text-size-14-light"
                          :value="currentUserName"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Kho nhập <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-select">
                        <select v-model="formData.warehouseId">
                          <option value="" disabled>Chọn kho nhập</option>
                          <option
                            v-for="warehouse in warehouses"
                            :key="warehouse.id"
                            :value="warehouse.id"
                          >
                            {{ warehouse.name }}
                          </option>
                        </select>
                        <span class="icon-select"
                          ><img
                            src="/img-fix/icon/icon-arrow-down-new.svg"
                            alt=""
                        /></span>
                      </div>
                    </div>
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Nhà cung cấp <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-select">
                        <select v-model="formData.supplierId">
                          <option value="" disabled>Chọn nhà cung cấp</option>
                          <option
                            v-for="pub in suppliers"
                            :key="pub.id"
                            :value="pub.id"
                          >
                            {{ pub.name }}
                          </option>
                        </select>
                        <span class="icon-select"
                          ><img
                            src="/img-fix/icon/icon-arrow-down-new.svg"
                            alt=""
                        /></span>
                      </div>

                      <div
                        v-if="currentSupplier"
                        class="box-supplier-search bg-box-l-blue mt-5px"
                      >
                        <p class="text-size-13-light">
                          {{ currentSupplier.code || "Chưa cập nhật mã" }}
                        </p>
                        <p class="text-size-13-light">
                          {{ currentSupplier.phone || "Chưa cập nhật SĐT" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="box-table-purchased-order scroll-content-tab mt-15"
                  >
                    <div class="box-info-product">
                      <div class="title">
                        <div class="txt-wth-icon">
                          <div class="icon">
                            <img
                              src="/img-fix/icon/icon-info-duetone.svg"
                              alt=""
                            />
                          </div>
                          <p class="text-size-14-medium">Danh sách sản phẩm</p>
                        </div>
                      </div>
                      <div class="button-add-pd">
                        <a
                          href="javascript:;"
                          class="btn-frame-color primary"
                          @click="addItem"
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
                              <p class="txt-title-table">Tồn hiện tại</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">SL</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Giá nhập</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Thành tiền</p>
                            </div>
                            <div class="imt-title-table imt-btn-table"></div>
                          </div>

                          <div class="content-table">
                            <div
                              class="tr-table"
                              v-for="(item, index) in formData.items"
                              :key="index"
                            >
                              <div class="imt-content-table flex-n-2">
                                <div class="ct-form-select w-100">
                                  <select
                                    v-model="item.productId"
                                    @change="onProductChange(item)"
                                  >
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
                                  <span class="icon-select"
                                    ><img
                                      src="/img-fix/icon/icon-arrow-down-new.svg"
                                      alt=""
                                  /></span>
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <p
                                  class="txt-m-content-table"
                                  :class="
                                    getInventoryStatusClass(item.productId)
                                  "
                                  v-if="item.productId"
                                >
                                  {{
                                    formatNumber(
                                      getQuantityOnHand(item.productId),
                                    )
                                  }}
                                  đơn vị
                                </p>

                                <p v-else class="txt-content-table">---</p>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.quantity"
                                    min="1"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.price"
                                    min="0"
                                    disabled
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="box-view-inf-dis">
                                  <p class="text-13-smb text-blue">
                                    {{ formatCurrency(itemTotal(item)) }}
                                  </p>
                                </div>
                              </div>
                              <div class="imt-content-table imt-btn-table">
                                <div class="btn-action-end-modal">
                                  <div class="btn-edit-del-table">
                                    <div class="btn-nv-dh">
                                      <a
                                        href="javascript:;"
                                        class="layout-btn wth-tooltip"
                                        @click="removeItem(index)"
                                      >
                                        <span class="icon"
                                          ><img
                                            src="/img-fix/icon/icon-delete-dt.svg"
                                            alt=""
                                        /></span>
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

                    <div class="kt-summary-price mt-10">
                      <div class="box-summary-price-pos">
                        <p class="text-size-14-medium mb-10">Tổng hợp</p>
                        <div class="row-price-flex">
                          <p class="left">Tạm tính</p>
                          <p class="right">{{ formatCurrency(subTotal) }}</p>
                        </div>
                        <div class="row-price-flex final-price">
                          <p class="left">Tổng thanh toán:</p>
                          <p class="right text-blue">
                            {{ formatCurrency(finalTotal) }}
                          </p>
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
                  class="btn-frame-color imt-border"
                  @click="closeCreatePopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="submitOrder"
                >
                  <p class="text-size-13-rgl">
                    {{ isSubmitting ? "Đang xử lý..." : "Tạo đơn nháp" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeCreatePopup"></div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="isDetailPopupOpen"
        class="popup-export-file ct-popup-width-1200 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Thông tin chi tiết</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeDetailPopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content" v-if="selectedOrder">
              <div class="block-kt-sales">
                <div class="ct-header-storage">
                  <div class="box-pay-period">
                    <div class="left">
                      <div class="box-info-contract-labor">
                        <div class="title-flex-copy">
                          <p class="text-size-14-medium">Đơn mua hàng</p>
                          <div class="code-label-copy">
                            <p class="text-size-14-light opacity-6">
                              {{ selectedOrder.poCode }}
                            </p>
                            <button class="btn-copy-ic">
                              <img
                                src="/img-fix/icon/icon-round-copy.svg"
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right ct-product-title">
                      <div class="ct-label-new">
                        <div
                          class="label-table-new"
                          :class="
                            getPurchaseStatusLabelClass(selectedOrder.status)
                          "
                        >
                          <p
                            class="text-size-13-medium"
                            :class="
                              getPurchaseStatusTextClass(selectedOrder.status)
                            "
                          >
                            {{ formatPurchaseStatus(selectedOrder.status) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="nav-pill-tab">
                  <div
                    class="item-pill-tab"
                    :class="{ active: activeDetailTab === 'general' }"
                    @click="activeDetailTab = 'general'"
                  >
                    <a href="javascript:;" class="txt-pill">Thông tin chung</a>
                  </div>
                  <div
                    class="item-pill-tab"
                    :class="{ active: activeDetailTab === 'products' }"
                    @click="activeDetailTab = 'products'"
                  >
                    <a href="javascript:;" class="txt-pill"
                      >Chi tiết sản phẩm
                      <span class="number-count">{{
                        selectedOrder.items?.length || 0
                      }}</span></a
                    >
                  </div>
                </div>

                <div class="box-dc--content">
                  <div
                    class="block-kt-wrapper-popup"
                    v-if="activeDetailTab === 'general'"
                  >
                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">Thông tin giao dịch</p>
                      </div>
                      <div class="box-border-template">
                        <div class="content-box-labor">
                          <div class="grid-imt-info-2">
                            <div class="imt-info-hs">
                              <p class="text-size-14-light opacity-6 mb-4px">
                                Mã đơn hàng
                              </p>
                              <p class="text-size-14-rgl">
                                {{ selectedOrder.poCode }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">
                          Thông tin nhà cung cấp
                        </p>
                      </div>
                      <div class="box-border-template">
                        <div class="lst-text-columns">
                          <p class="title">
                            {{
                              getFirstSupplier(selectedOrder)?.name ||
                              "Chưa xác định"
                            }}
                          </p>
                          <div class="content">
                            <p>
                              Mã NCC:
                              <span>{{
                                getFirstSupplier(selectedOrder)?.code || "---"
                              }}</span>
                            </p>
                            <p>
                              Số điện thoại:
                              <span>{{
                                getFirstSupplier(selectedOrder)?.phone || "---"
                              }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">Tổng hợp giá trị</p>
                      </div>
                      <div class="ct-border-table">
                        <div class="group-table-web">
                          <div class="block-table-crm-kh ct-xs-column">
                            <div class="title-table">
                              <div class="imt-title-table">
                                <p class="txt-title-table">Tổng sản phẩm</p>
                              </div>
                              <div class="imt-title-table imt-align-right">
                                <p class="txt-title-table">
                                  {{ selectedOrder.items?.length || 0 }} mặt
                                  hàng
                                </p>
                              </div>
                            </div>
                            <div class="content-table">
                              <div class="tr-table">
                                <div class="imt-content-table">
                                  <p class="txt-content-table">Tạm tính</p>
                                </div>
                                <div class="imt-content-table imt-align-right">
                                  <p class="txt-content-table">
                                    {{
                                      formatCurrency(selectedOrder.totalAmount)
                                    }}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="summary-table">
                              <div class="imt-summary-table">
                                <p class="txt-summary-table">Tổng cộng</p>
                              </div>
                              <div class="imt-summary-table imt-align-right">
                                <p class="txt-summary-table">
                                  {{
                                    formatCurrency(selectedOrder.totalAmount)
                                  }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="block-kt-wrapper-popup tab-table-scroll"
                    v-else-if="activeDetailTab === 'products'"
                  >
                    <div class="box-recruitment mb-15">
                      <p class="text-size-14-rgl txt-d-blue-2 light-blue-bg">
                        Chi tiết sản phẩm: Danh sách
                        {{ selectedOrder.items?.length || 0 }} sản phẩm trong
                        đơn hàng này.
                      </p>
                    </div>
                    <div class="scroll-content-tab">
                      <div class="box-table-2025">
                        <div class="box-table-kt">
                          <div class="group-table-web">
                            <div class="block-table-crm-kh ct-xs-column">
                              <div class="title-table">
                                <div class="imt-title-table width-stt">
                                  <p class="txt-title-table">STT</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Mã sản phẩm</p>
                                </div>
                                <div class="imt-title-table flex-n-2">
                                  <p class="txt-title-table">
                                    Tên sản phẩm, hàng hóa
                                  </p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Số lượng</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Đơn giá</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Tổng cộng</p>
                                </div>
                              </div>

                              <div class="content-table">
                                <div
                                  class="tr-table"
                                  v-for="(item, index) in selectedOrder.items"
                                  :key="index"
                                >
                                  <div class="imt-content-table width-stt">
                                    <p class="txt-content-table">
                                      {{ index + 1 }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ item.productCode || "---" }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table flex-n-2">
                                    <p class="txt-content-table">
                                      {{ item.productName || "---" }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ item.quantity }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ formatCurrency(item.price) }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p
                                      class="txt-m-content-table font-weight-bold"
                                    >
                                      {{
                                        formatCurrency(
                                          (item.quantity || 0) *
                                            (item.price || 0),
                                        )
                                      }}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div class="ct-summary-kt mt-15">
                                <div class="box-summary-invoice no-border">
                                  <div
                                    class="box-summary-invoice--content max-w-400"
                                  >
                                    <div class="imt-sum-inv">
                                      <div class="left">
                                        <p class="text-size-14-medium">
                                          Tổng tiền trước thuế:
                                        </p>
                                      </div>
                                      <div class="right">
                                        <p class="text-size-14-medium">
                                          {{
                                            formatCurrency(
                                              selectedOrder.totalAmount,
                                            )
                                          }}
                                        </p>
                                      </div>
                                    </div>
                                    <div class="imt-sum-inv imt-sum-blue">
                                      <div class="left">
                                        <p class="text-size-14-medium">
                                          TỔNG THANH TOÁN:
                                        </p>
                                      </div>
                                      <div class="right">
                                        <p
                                          class="text-size-14-medium text-blue"
                                        >
                                          {{
                                            formatCurrency(
                                              selectedOrder.totalAmount,
                                            )
                                          }}
                                        </p>
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
                </div>
              </div>
            </div>

            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color imt-border"
                  @click="closeDetailPopup"
                >
                  <p class="text-size-13-rgl">Đóng</p>
                </a>
              </div>
              <div
                class="btn-create-group"
                v-if="
                  selectedOrder?.status === 'DRAFT' && canApprovePurchaseOrder
                "
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleApproveOrder(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Duyệt đơn</p>
                </a>
              </div>
              <div
                class="btn-create-group"
                v-if="
                  selectedOrder?.status === 'APPROVED' &&
                  canHandlePurchaseDelivery
                "
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleStartDelivery(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Bắt đầu lấy hàng</p>
                </a>
              </div>
              <div
                class="btn-create-group"
                v-if="
                  selectedOrder?.status === 'PROCESSING' &&
                  canHandlePurchaseDelivery
                "
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleConfirmDelivery(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Xác nhận hàng về</p>
                </a>
              </div>
              <div
                class="btn-create-group"
                v-if="
                  selectedOrder?.status === 'PROCESSING' &&
                  canCompletePurchaseOrder
                "
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleCompleteOrder(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Hoàn thành nhập kho</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeDetailPopup"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const toast = useToast();
const { confirm, confirmDelete } = useConfirmDialog();

definePageMeta({
  alias: ["/orders/purchase"],
});

interface EmployeeLight {
  id: number;
  fullName: string;
}

interface Supplier {
  id: number;
  code: string;
  name: string;
  phone: string | null;
  currentDebt?: number | null;
}

interface PurchaseOrder {
  id: number;
  poCode: string;
  code?: string;
  status: string;
  totalAmount: number;
  createdDate?: string | null;
  employee?: EmployeeLight;
  supplier?: Supplier | null;
  warehouse?: {
    id: number;
    name: string;
  } | null;
  items?: PurchaseOrderItem[];
  purchaseOrderLines?: any[];
}

interface PurchaseOrderItem {
  productId: number | "";
  productName?: string;
  productCode?: string;
  supplier?: Supplier | null;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  purchasePrice: number;
  sellingPrice?: number;
}

interface InventoryBalance {
  id: number;
  quantity: number;
  product: {
    id: number;
  } | null;
  warehouse?: {
    id: number;
  } | null;
}

const openActionId = ref<number | null>(null);
const isCreatePopupOpen = ref(false);
const isDetailPopupOpen = ref(false);
const isSubmitting = ref(false);
const isTriggeringRestock = ref(false);
const selectedOrder = ref<PurchaseOrder | null>(null);
const activeDetailTab = ref("general");
const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  status: "",
});
const filterFields = [
  {
    key: "status",
    label: "Trạng thái",
    type: "select" as const,
    options: [
      { label: "Bản nháp", value: "DRAFT" },
      { label: "Đã duyệt", value: "APPROVED" },
      { label: "Đang lấy hàng", value: "PROCESSING" },
      { label: "Đã hoàn thành", value: "COMPLETED" },
      { label: "Đã hủy", value: "CANCELLED" },
    ],
  },
];

const { data: purchaseOrders, refresh: refreshOrders } = await useAPI<
  PurchaseOrder[]
>(API_ENDPOINTS.purchaseOrders.listEager);
const { data: account } = await useAPI<any>(API_ENDPOINTS.account.me);
const {
  adminManagerRoles,
  createRoleChecker,
  getActionRoles,
  getUserRoles,
} =
  useRoutePermissions();

const userRoles = computed(() => getUserRoles(account.value));
const hasAnyRole = createRoleChecker(userRoles);

const canCreatePurchaseOrder = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.create")),
);
const canDeletePurchaseOrder = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.delete")),
);
const canApprovePurchaseOrder = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.approve")),
);
const canHandlePurchaseDelivery = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.delivery")),
);
const canCompletePurchaseOrder = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.complete")),
);
const canCancelPurchaseOrder = computed(() =>
  hasAnyRole(getActionRoles("purchaseOrders.cancel")),
);
const canTriggerRestock = computed(() => userRoles.value.length > 0);
const canLoadWarehouses = computed(() => hasAnyRole(adminManagerRoles));
const canLoadInventoryBalances = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const canCancelPurchaseOrderStatus = (status: string) =>
  (status === "DRAFT" && canDeletePurchaseOrder.value) ||
  (["APPROVED", "PROCESSING"].includes(status) &&
    canCancelPurchaseOrder.value);

const { data: products } = await useAPI<Product[]>(
  API_ENDPOINTS.products.listSorted,
  {
    immediate: canCreatePurchaseOrder.value,
  },
);
const { data: suppliers } = await useAPI<any[]>(API_ENDPOINTS.suppliers.list, {
  immediate: canCreatePurchaseOrder.value,
});
const { data: warehouseOptions } = await useAPI<any[]>(
  API_ENDPOINTS.warehouses.list,
  {
    immediate: canLoadWarehouses.value,
  },
);
const { data: inventoryBalances, refresh: refreshInventoryBalances } =
  await useAPI<InventoryBalance[]>(API_ENDPOINTS.inventoryBalances.listPaged, {
    immediate: canLoadInventoryBalances.value,
  });
const warehouses = computed(() => {
  const uniqueWarehouses = new Map<number, any>();

  (warehouseOptions.value || []).forEach((warehouse) => {
    if (warehouse?.id) uniqueWarehouses.set(warehouse.id, warehouse);
  });
  (purchaseOrders.value || []).forEach((order) => {
    if (order.warehouse?.id) {
      uniqueWarehouses.set(order.warehouse.id, order.warehouse);
    }
  });

  return Array.from(uniqueWarehouses.values());
});

const triggerRestock = async () => {
  if (!canTriggerRestock.value || isTriggeringRestock.value) return;
  const existingOrderIds = new Set(
    (purchaseOrders.value || []).map((order) => order.id),
  );
  isTriggeringRestock.value = true;
  try {
    const { error } = await useAPI<string>(
      API_ENDPOINTS.ai.triggerRestock,
      {
        method: "POST",
      },
    );
    if (error.value) {
      toast.fromMessage(
        getApiErrorMessage(error.value, "Không thể chạy AI gợi ý nhập hàng"),
      );
      return;
    }
    await refreshOrders();

    const newDraftOrders = (purchaseOrders.value || []).filter(
      (order) => order.status === "DRAFT" && !existingOrderIds.has(order.id),
    );

    if (newDraftOrders.length > 0) {
      searchQuery.value = "";
      filters.value.status = "";
      toast.fromMessage(
        `AI đã tạo ${newDraftOrders.length} đơn nhập hàng nháp mới. Danh sách đã được cập nhật.`,
      );
      return;
    }

    toast.fromMessage(
      "AI đã chạy nhưng chưa tạo đơn nhập hàng nháp mới. Có thể chưa có lịch sử đơn bán hoàn thành, AI Python không đề xuất nhập thêm, hoặc dữ liệu tồn kho chưa đủ.",
    );
  } finally {
    isTriggeringRestock.value = false;
  }
};

const formatPurchaseStatus = (status: string | null | undefined) => {
  const statusMap: Record<string, string> = {
    DRAFT: "Bản nháp",
    APPROVED: "Đã duyệt",
    PROCESSING: "Đang lấy hàng",
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy",
    CANCELED: "Đã hủy",
  };

  return status ? statusMap[status] || status : "---";
};

const getPurchaseStatusClass = (status: string | null | undefined) => {
  if (status === "COMPLETED" || status === "APPROVED") return "blue";
  if (status === "DRAFT" || status === "PROCESSING") return "orange-txt";
  return "d-red-txt";
};

const getPurchaseStatusLabelClass = (status: string | null | undefined) => {
  if (status === "DRAFT" || status === "PROCESSING") return "bg-orange-light";
  return "gray-blue";
};

const getPurchaseStatusTextClass = (status: string | null | undefined) => {
  if (status === "DRAFT" || status === "PROCESSING") return "text-orange";
  return "text-blue";
};

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

const filteredPurchaseOrders = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (purchaseOrders.value || []).filter((order) => {
    const matchesSearch =
      !keyword ||
      [
        order.poCode,
        order.employee?.fullName,
        order.supplier?.name,
        order.warehouse?.name,
        order.totalAmount,
        order.status,
      ]
        .map(normalizeText)
        .join(" ")
        .includes(keyword);
    const matchesStatus =
      !filters.value.status || order.status === filters.value.status;

    return matchesSearch && matchesStatus;
  });
});

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const getExistingPurchaseOrderCodes = () =>
  (purchaseOrders.value || []).map((order) => order.poCode);

const generateCode = () =>
  generateModuleCode("purchaseOrder", getExistingPurchaseOrderCodes());

const defaultForm = () => ({
  code: generateCode(),
  warehouseId: "" as number | string,
  supplierId: "",
  items: [
    {
      productId: "",
      quantity: 1,
      price: 0,
    } as PurchaseOrderItem,
  ],
});

const formData = ref(defaultForm());

const openCreatePopup = () => {
  const nextForm = defaultForm();
  if (warehouses.value?.[0]?.id) {
    nextForm.warehouseId = warehouses.value[0].id;
  }
  formData.value = nextForm;
  isCreatePopupOpen.value = true;
  refreshInventoryBalances();
};

const closeCreatePopup = () => {
  isCreatePopupOpen.value = false;
};

const currentUserName = computed(() => {
  if (!account.value) return "";
  return (
    `${account.value.lastName || ""} ${account.value.firstName || ""}`.trim() ||
    account.value.login
  );
});

const currentSupplier = computed(() => {
  return suppliers.value?.find(
    (p) => p.id === Number(formData.value.supplierId),
  );
});

const getProductCode = (productId: number | "") => {
  if (!productId) return "";
  const product = products.value?.find((item) => item.id === Number(productId));
  return product?.sku || "";
};

const inventoryByProductId = computed(() => {
  const map = new Map<number, InventoryBalance>();
  const warehouseId = Number(formData.value.warehouseId);

  (inventoryBalances.value || []).forEach((balance) => {
    if (
      balance.product?.id &&
      (!warehouseId || !balance.warehouse?.id || balance.warehouse.id === warehouseId)
    ) {
      map.set(balance.product.id, balance);
    }
  });

  return map;
});

const getQuantityOnHand = (productId: number | "") => {
  if (!productId) return 0;
  return inventoryByProductId.value.get(Number(productId))?.quantity || 0;
};

const getInventoryStatusClass = (productId: number | "") => {
  const quantity = getQuantityOnHand(productId);
  if (quantity <= 0) return "red";
  if (quantity < 20) return "orange";
  return "blue";
};

const formatNumber = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("vi-VN");

const addItem = () => {
  formData.value.items.push({
    productId: "",
    quantity: 1,
    price: 0,
  });
};

const removeItem = (index: number) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
  }
};

const onProductChange = (item: PurchaseOrderItem) => {
  const product = products.value?.find(
    (entry) => entry.id === Number(item.productId),
  );
  if (product) {
    item.price = Number(product.purchasePrice) || 0;
  }
};

const itemTotal = (item: PurchaseOrderItem) =>
  (item.quantity || 0) * (item.price || 0);

const subTotal = computed(() =>
  formData.value.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0,
  ),
);

const finalTotal = computed(() =>
  formData.value.items.reduce((sum, item) => sum + itemTotal(item), 0),
);

const submitOrder = async () => {
  const validItems = formData.value.items.filter((i) => i.productId);
  const invalidItem = validItems.find((item) =>
    Boolean(validatePositiveInteger(item.quantity, "Số lượng")),
  );
  const invalidPriceItem = validItems.find((item) =>
    Boolean(validateNonNegativeNumber(item.price || 0, "Đơn giá")),
  );
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã đơn nhập"),
    validateMaxLength(formData.value.code, 50, "Mã đơn nhập"),
    validateRequired(formData.value.warehouseId, "Kho nhập"),
    validateRequired(formData.value.supplierId, "Nhà cung cấp"),
    validItems.length > 0 ? "" : "Vui lòng chọn ít nhất 1 sản phẩm hợp lệ!",
    invalidItem ? "Số lượng sản phẩm phải là số nguyên lớn hơn 0." : "",
    invalidPriceItem ? "Đơn giá không được nhỏ hơn 0." : "",
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  if (validItems.length === 0) {
    toast.fromMessage("Vui lòng chọn ít nhất 1 sản phẩm hợp lệ!");
    return;
  }
  isSubmitting.value = true;

  try {
    const warehouseId = Number(formData.value.warehouseId);
    if (!warehouseId) {
      throw new Error("Chưa có kho để tạo đơn nhập hàng.");
    }

    const payload = {
      poCode: formData.value.code,
      status: "DRAFT",
      totalAmount: finalTotal.value,
      supplier: {
        id: Number(formData.value.supplierId),
      },
      warehouse: {
        id: warehouseId,
      },
      purchaseOrderLines: validItems.map((item) => ({
        quantity: Number(item.quantity),
        unitPrice: Number(item.price) || 0,
        product: {
          id: Number(item.productId),
        },
      })),
    };

    const { error } = await useAPI<any>(API_ENDPOINTS.purchaseOrders.list, {
      method: "POST",
      body: payload,
    });

    if (error.value) throw error.value;

    if (process.client) {
      window.dispatchEvent(new Event("novel:notifications-refresh"));
      window.setTimeout(() => {
        window.dispatchEvent(new Event("novel:notifications-refresh"));
      }, 600);
    }

    toast.fromMessage("Tạo đơn nháp thành công!");
    closeCreatePopup();
    await refreshOrders();
    await refreshInventoryBalances();
  } catch (err: any) {
    const msg =
      err.data?.title ||
      err.data?.message ||
      "Có lỗi xảy ra trong quá trình xử lý";
    toast.fromMessage(`Lỗi từ máy chủ: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
};

const openDetailPopup = async (id: number) => {
  openActionId.value = null;
  activeDetailTab.value = "general";

  const { data: poData, error: poError } = await useAPI<PurchaseOrder>(
    API_ENDPOINTS.purchaseOrders.detail(id),
  );

  if (poError.value || !poData.value) {
    toast.fromMessage("Lỗi khi tải chi tiết đơn hàng!");
    return;
  }

  const matchedLines =
    poData.value.purchaseOrderLines &&
    poData.value.purchaseOrderLines.length > 0
      ? poData.value.purchaseOrderLines
      : [];

  selectedOrder.value = {
    ...poData.value,
    items: matchedLines.map((line) => ({
      productId: line.product?.id || "",
      productCode: line.product?.sku || "---",
      productName: line.product?.name || "---",
      supplier: poData.value?.supplier || null,
      quantity: line.quantity || 0,
      price: line.unitPrice || 0,
    })),
  };

  isDetailPopupOpen.value = true;
};

const closeDetailPopup = () => {
  isDetailPopupOpen.value = false;
  selectedOrder.value = null;
};

const getFirstSupplier = (order: PurchaseOrder | null) => {
  if (!order || !order.items || order.items.length === 0) return null;
  return order.items[0].supplier;
};

const handleApproveOrder = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Duyệt đơn",
    message: "Bạn có chắc chắn muốn duyệt đơn nhập hàng này?",
    title: "Duyệt đơn nhập hàng",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error: completeError } = await useAPI(
    API_ENDPOINTS.purchaseOrders.approve(id),
    { method: "PUT" },
  );

  if (completeError.value) {
    const backEndMsg =
      completeError.value.data?.title ||
      completeError.value.data?.message ||
      "Không thể duyệt đơn nhập hàng";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Duyệt đơn nhập hàng thành công!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
  await refreshInventoryBalances();
};

const handleStartDelivery = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Bắt đầu",
    message: "Bạn có chắc chắn muốn bắt đầu lấy hàng cho đơn nhập này?",
    title: "Bắt đầu lấy hàng",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error } = await useAPI(
    API_ENDPOINTS.purchaseOrders.startDelivery(id),
    {
      method: "PUT",
    },
  );

  if (error.value) {
    const backEndMsg =
      error.value.data?.title ||
      error.value.data?.message ||
      "Không thể bắt đầu lấy hàng";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Đã bắt đầu lấy hàng!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
};

const handleConfirmDelivery = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Xác nhận",
    message: "Bạn có chắc chắn muốn xác nhận hàng đã về kho?",
    title: "Xác nhận hàng về",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error } = await useAPI(
    API_ENDPOINTS.purchaseOrders.confirmDelivery(id),
    {
      method: "PUT",
    },
  );

  if (error.value) {
    const backEndMsg =
      error.value.data?.title ||
      error.value.data?.message ||
      "Không thể xác nhận hàng về";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Xác nhận hàng về thành công!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
};

const handleCompleteOrder = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Hoàn thành",
    message:
      "Bạn có chắc chắn muốn hoàn thành nhập kho? Hành động này sẽ chốt công nợ và không thể hoàn tác.",
    title: "Hoàn thành nhập kho",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error } = await useAPI(API_ENDPOINTS.purchaseOrders.complete(id), {
    method: "PUT",
  });

  if (error.value) {
    const backEndMsg =
      error.value.data?.title ||
      error.value.data?.message ||
      "Không thể hoàn thành nhập kho";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Hoàn thành nhập kho thành công!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
  if (canLoadInventoryBalances.value) {
    await refreshInventoryBalances();
  }
};

const handleDeleteOrder = async (order: PurchaseOrder) => {
  const isDraft = order.status === "DRAFT";
  const isConfirm = await confirmDelete(
    isDraft
      ? "Bạn có chắc chắn muốn xóa đơn nhập hàng nháp này?"
      : "Bạn có chắc chắn muốn hủy đơn nhập hàng này?",
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(
    isDraft
      ? API_ENDPOINTS.purchaseOrders.detail(order.id)
      : API_ENDPOINTS.purchaseOrders.cancel(order.id),
    {
      method: isDraft ? "DELETE" : "PUT",
    },
  );

  if (deleteError.value) {
    const backEndMsg =
      deleteError.value.data?.title ||
      deleteError.value.data?.message ||
      isDraft
        ? "Không thể xóa đơn nhập hàng nháp"
        : "Không thể hủy đơn nhập hàng";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage(
    isDraft
      ? "Xóa đơn nhập hàng nháp thành công!"
      : "Hủy đơn nhập hàng thành công!",
  );
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null)
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "---";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>
